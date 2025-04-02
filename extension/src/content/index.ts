import { create } from '../../../netlify/functions/videoWrapper/index.js';

// @ts-expect-error TODO: there're no envs in the content script
globalThis.process = {
  env: {},
};

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'checkPage') {
    console.info('checkPage', message);
    const url = location.href;
    const showPlayIcon = false;
    const image = undefined;
    const ImageService = undefined;

    const video = create(url, {
      showPlayIcon,
      image,
      ImageService,
    });

    video
      .then(async (video) => {
        console.log('video', video);
        const message = {
          success: true,
          video: {
            id: video.getId(),
            thumbnailUrl: await video.getThumbnail_asVideoUrl(),
            providerName: video.providerName,
            url: video.url,
          },
        };
        console.log('message', message);
        chrome.runtime.sendMessage(message);

        return video;
        // return video.getThumbnail_asVideoUrl();
      })
      // .then((imageUrl) => {
      //   console.log('imageUrl', imageUrl);
      //   chrome.runtime.sendMessage({ success: true, siteTitle: imageUrl });
      // })
      .catch((error) => {
        console.error(error);
        chrome.runtime.sendMessage({ success: false });
      });
  }

  return true;
});
