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
  document.body.classList.remove('loading');
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

function sendMessage() {
  document.body.classList.add('loading');
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];

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
            titleElement.value = '';
            imgElement.src = 'not-found.jpg';
            videoNotFoundDisclaimerElement.classList.remove('hidden');
            formElement.classList.add('hidden');
            codeContainerElement.classList.add('hidden');

            const url = new URL(response?.video.url ?? '');

            // biome-ignore lint/style/noNonNullAssertion: `a` tag is always present
            videoNotFoundDisclaimerElement.querySelector('a')!.href =
              `https://github.com/marcomontalbano/video-to-markdown/issues/new?template=new_video_provider.yml&title=Add video from ${url.hostname}&links=-%20${encodeURIComponent(response?.video.url ?? '')}`;
          }
          return;
        });
    }
  });
}

function updateFromLatestResponse(): void {
  if (latestResponse?.success === true) {
    const title = titleElement.value;
    const markdown = `[![<span>${title}</span>](<span>${latestResponse.video.generatedThumbnailUrl}</span>)](<span>${latestResponse.video.url}</span>&nbsp;"<span>${title}</span>")`;
    markdownElement.innerHTML = markdown;
  } else {
    markdownElement.innerHTML = '';
  }
}
