import type { Event } from '../types';

const imgElement = document.querySelector('img');
const showPlayIconElement = document.querySelector('#showPlayIcon') as HTMLInputElement;

imgElement?.addEventListener('error', () => {
  imgElement.src = 'not-found.jpg';
});

showPlayIconElement.addEventListener('change', () => {
  sendMessage();
});

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
          if (response?.success === true) {
            if (imgElement != null) {
              imgElement.src = response.video.generatedThumbnailUrl;
              document.body.classList.remove('loading');
            }
          }
          return;
        });
    }
  });
}

// import { create } from '../../../netlify/functions/videoWrapper/index.js';
// chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
//   const tab = tabs[0];
//   const showPlayIcon = false;

//   if (tab.url == null) {
//     console.error('[popup] no url');
//     return;
//   }

//   const video = create(tab.url, {
//     showPlayIcon,
//   });

//   console.info('[popup] video', video);

//   const imgElement = document.querySelector('img');
//   if (imgElement != null) {
//     imgElement.src = await video?.getThumbnailUrl();
//   }
// });

// document.addEventListener('DOMContentLoaded', async () => {
//   chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
//     const tab = tabs[0];

//     console.log('[popup] tab', tab);

//     const url = location.href;
//     const showPlayIcon = false;

//     const video = create(url, {
//       showPlayIcon,
//     });

//     console.info('[content] video', video);

//     if (tab.status === 'complete' && tab.id != null) {
//       const response = await chrome.tabs.sendMessage(tab.id, { action: 'checkVideo' });
//       console.log('[popup] response', response);
//     }
//   });

//   // chrome.storage.session.get('video', ({ video }) => {
//   //   console.log('[popup] video', video);
//   //   const imgElement = document.querySelector('img');

//   //   if (imgElement != null) {
//   //     imgElement.src = video.thumbnailUrl;
//   //   }
//   // });
// });
