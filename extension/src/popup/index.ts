import type { Event } from '../types.js';

const imgElement = document.querySelector('img') as HTMLImageElement;
const showPlayIconElement = document.querySelector('#showPlayIcon') as HTMLInputElement;
const titleElement = document.querySelector('#title') as HTMLInputElement;
const markdownElement = document.querySelector('#markdown') as HTMLDivElement;
const copyElement = document.querySelector('#copy') as HTMLDivElement;
const codeContainerElement = document.querySelector('.code-container') as HTMLDivElement;
const formElement = document.querySelector('form') as HTMLFormElement;
const videoNotFoundDisclaimerElement = document.querySelector('.video-not-found-disclaimer') as HTMLDivElement;

let latestResponse: Event['extractPage']['response'] | null = null;

imgElement.addEventListener('error', () => {
  latestResponse = null;
  imgElement.src = 'not-found.jpg';
});

imgElement.addEventListener('load', () => {
  updateFromLatestResponse();

  const emptyImage =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

  const isEmptyImage = imgElement.src === emptyImage;

  if (!isEmptyImage) {
    document.body.classList.remove('loading');
  }
});

titleElement.addEventListener('keyup', () => {
  updateFromLatestResponse();
});

showPlayIconElement.addEventListener('change', () => {
  sendMessage();
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

sendMessage();

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'complete') {
    sendMessage();
  }
});

function sendMessage() {
  document.body.classList.add('loading');

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];

    if (tab.status === 'complete' && tab.id != null) {
      chrome.scripting
        .executeScript({
          target: { tabId: tab.id },
          files: ['/dist/content.global.js'],
        })
        .then(() => {
          if (tab.status === 'complete' && tab.id != null) {
            chrome.tabs
              .sendMessage<Event['extractPage']['message'], Event['extractPage']['response']>(tab.id, {
                action: 'extractPage',
                showPlayIcon: showPlayIconElement.checked,
              })
              .then((response) => {
                latestResponse = response;
                if (response?.success === true) {
                  titleElement.value = response.video.title ?? '';
                  imgElement.src = response.video.generatedThumbnailUrl;
                } else {
                  videoNotFound(response);
                }
                return;
              })
              .catch((error) => {
                console.info('Error sending message:', error);
                videoNotFound(null);
              });
          }
        })
        .catch((error) => {
          console.info('Error executing script:', error);
          videoNotFound(null);
        });
    }
  });
}

function videoNotFound(response: Event['extractPage']['response'] | null): void {
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

function updateFromLatestResponse(): void {
  let title = '';
  let videoUrl = '';
  let thumbnailUrl = '';

  if (latestResponse?.success === true) {
    title = titleElement.value;
    videoUrl = latestResponse.video.url;
    thumbnailUrl = latestResponse.video.generatedThumbnailUrl;
  }

  // biome-ignore lint/complexity/noForEach: <explanation>
  markdownElement.querySelectorAll('[data-title]').forEach((element) => {
    element.textContent = title;
  });

  // biome-ignore lint/complexity/noForEach: <explanation>
  markdownElement.querySelectorAll('[data-video-url]').forEach((element) => {
    if (latestResponse?.success === true) {
      element.textContent = videoUrl;
    }
  });

  // biome-ignore lint/complexity/noForEach: <explanation>
  markdownElement.querySelectorAll('[data-thumbnail-url]').forEach((element) => {
    if (latestResponse?.success === true) {
      element.textContent = thumbnailUrl;
    }
  });

  if (latestResponse?.success === true) {
    markdownElement.classList.remove('opacity-0');
  } else {
    markdownElement.classList.add('opacity-0');
  }
}
