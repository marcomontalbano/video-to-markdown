document.addEventListener('DOMContentLoaded', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];

    console.log('[popup] tab', tab);

    if (tab.status === 'complete' && tab.id != null) {
      console.log('[popup] sendMessage');

      chrome.tabs.sendMessage(tab.id, { action: 'checkPage' }).then((response) => {
        console.log('[popup] response', response);

        if (response == null) {
          return;
        }

        const imgElement = document.querySelector('img');
        if (imgElement != null) {
          imgElement.src = response.video.thumbnailUrl;
        }
      });
    }
  });
});

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
