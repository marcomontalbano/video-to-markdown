import { hasValidConsent, openConsentPage } from '../consent-manager.js';
import type { Event, Response } from '../types.js';

const imgElement = document.querySelector('img') as HTMLImageElement;
const showPlayIconElement = document.querySelector('#showPlayIcon') as HTMLInputElement;
const titleElement = document.querySelector('#title') as HTMLInputElement;
const markdownElement = document.querySelector('#markdown') as HTMLDivElement;
const copyElement = document.querySelector('#copy') as HTMLDivElement;
const codeContainerElement = document.querySelector('.code-container') as HTMLDivElement;
const formElement = document.querySelector('form') as HTMLFormElement;
const videoNotFoundDisclaimerElement = document.querySelector('.video-not-found-disclaimer') as HTMLDivElement;

let latestResponse: Response | null = null;

/**
 * Check if the user has given consent, and if not, open the consent page and close the popup
 * @returns A promise that resolves to true if consent is given, false otherwise
 */
async function checkConsent(): Promise<boolean> {
  const consentGiven = await hasValidConsent();

  if (!consentGiven) {
    await openConsentPage();
    window.close();
  }

  return consentGiven;
}

// Initial consent check
void checkConsent().then((consentGiven) => {
  if (consentGiven) {
    checkPage().then((response) => renderResponse(response));
  }
});

imgElement.addEventListener('error', () => {
  latestResponse = null;
  imgElement.src = 'not-found.jpg';
});

imgElement.addEventListener('load', () => {
  renderMarkdown(latestResponse);

  const emptyImage =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

  const isEmptyImage = imgElement.src === emptyImage;

  if (!isEmptyImage) {
    document.body.classList.remove('loading');
    document.body.classList.remove('idle');
  }
});

titleElement.addEventListener('keyup', () => {
  renderMarkdown(latestResponse);
});

formElement.addEventListener('submit', (event) => {
  event.preventDefault();

  // Double-check consent before sending data
  void checkConsent().then((consentGiven) => {
    if (consentGiven) {
      sendMessage();
    }
  });
});

copyElement.addEventListener(
  'click',
  () => {
    const text = markdownElement.innerText.replace(/ /gm, ' ').replace(/\n/gm, '');
    navigator.clipboard.writeText(text).then(() => {
      copyElement.classList.add('copied');
      setTimeout(() => {
        copyElement.classList.remove('copied');
      }, 1000);
    });
  },
  true,
);

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const tab = tabs[0];
  titleElement.value ||= tab.title ?? '';
});

chrome.tabs.onUpdated.addListener((_tabId, changeInfo) => {
  if (changeInfo.status === 'complete') {
    titleElement.value ||= changeInfo.title ?? '';
    checkPage().then((response) => renderResponse(response));
  }
});

function checkPage(): Promise<Event['checkPage']['response'] | null> {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];

      if (tab.status === 'complete' && tab.id != null) {
        installScript(tab.id)
          .then(() => {
            if (tab.status === 'complete' && tab.id != null) {
              chrome.tabs
                .sendMessage<Event['checkPage']['message'], Event['checkPage']['response']>(tab.id, {
                  action: 'checkPage',
                  showPlayIcon: showPlayIconElement.checked,
                })
                .then((response) => {
                  resolve(response);
                })
                .catch((error) => {
                  console.info('Error sending message:', error);
                  resolve(null);
                });
            }
          })
          .catch((error) => {
            console.info('Error executing script:', error);
            resolve(null);
          });
      }
    });
  });
}

function sendMessage() {
  document.body.classList.remove('idle');
  document.body.classList.add('loading');
  markdownElement.classList.add('opacity-0');

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];

    if (tab.status === 'complete' && tab.id != null) {
      installScript(tab.id)
        .then(() => {
          if (tab.status === 'complete' && tab.id != null) {
            checkPage().then((response) => {
              if (response?.success && response.video.needsCloudinary) {
                if (tab.status === 'complete' && tab.id != null) {
                  chrome.tabs
                    .sendMessage<Event['extractPage']['message'], Event['extractPage']['response']>(tab.id, {
                      action: 'extractPage',
                      showPlayIcon: showPlayIconElement.checked,
                    })
                    .then((response) => {
                      renderResponse(response);
                      latestResponse = response;
                    })
                    .catch((error) => {
                      console.info('Error sending message:', error);
                      renderResponse(response);
                    });
                }
              } else {
                renderResponse(response);
                latestResponse = response;
              }
            });
          }
        })
        .catch((error) => {
          console.info('Error executing script:', error);
          renderResponse(null);
        });
    }
  });
}

function videoNotFound(response: Response | null): void {
  titleElement.value = '';
  imgElement.src = 'not-found.jpg';
  videoNotFoundDisclaimerElement.classList.remove('hidden');
  formElement.classList.add('hidden');
  codeContainerElement.classList.add('hidden');

  if (response?.video.url != null) {
    const url = new URL(response.video.url);

    // biome-ignore lint/style/noNonNullAssertion: `a` tag is always present
    videoNotFoundDisclaimerElement.querySelector('a')!.href =
      `https://github.com/marcomontalbano/video-to-markdown/issues/new?template=new_video_provider.yml&title=Add video from ${url.hostname}&links=-%20${encodeURIComponent(response.video.url ?? '')}`;
  }
}

function renderResponse(response: Response | null): void {
  if (response?.success === true) {
    titleElement.value ||= response.video.title ?? '';
    imgElement.src =
      'generatedThumbnailUrl' in response.video ? response.video.generatedThumbnailUrl : response.video.thumbnailUrl;
  } else {
    videoNotFound(response);
  }
}

function renderMarkdown(response: Response | null): void {
  let title = '';
  let videoUrl = '';
  let thumbnailUrl = '';

  if (response?.success === true) {
    title = titleElement.value;
    videoUrl = response.video.url;
    thumbnailUrl =
      'generatedThumbnailUrl' in response.video ? response.video.generatedThumbnailUrl : response.video.thumbnailUrl;
  }

  markdownElement.querySelectorAll('[data-title]').forEach((element) => {
    element.textContent = title;
  });

  markdownElement.querySelectorAll('[data-video-url]').forEach((element) => {
    if (response?.success === true) {
      element.textContent = videoUrl;
    }
  });

  markdownElement.querySelectorAll('[data-thumbnail-url]').forEach((element) => {
    if (response?.success === true) {
      element.textContent = thumbnailUrl;
    }
  });

  if (response?.success === true) {
    markdownElement.classList.remove('opacity-0');
  } else {
    markdownElement.classList.add('opacity-0');
  }
}

/**
 * Install the content script into the given tab if not already installed
 * @param tabId The ID of the tab where to install the script
 * @returns A promise that resolves when the script is installed or already present
 */
async function installScript(tabId: number) {
  const results = await chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      // @ts-expect-error This is a workaround to check if the script is already injected
      const alreadyInjected = !!window.__videoToMarkdownInjected;

      // @ts-expect-error This is a workaround to check if the script is already injected
      window.__videoToMarkdownInjected = true;

      return alreadyInjected;
    },
  });

  const alreadyInjected = results?.[0]?.result ?? false;

  if (!alreadyInjected) {
    return chrome.scripting.executeScript({
      target: { tabId },
      files: ['/dist/content.global.js'],
    });
  }
}
