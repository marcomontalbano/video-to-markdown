import { create } from '../../../netlify/functions/videoWrapper/index.js';

// @ts-expect-error TODO: there're no envs in the content script
globalThis.process ??= { env: {} };

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === 'checkPage') {
    console.info('[content] checkPage', message);

    const url = location.href;
    const showPlayIcon = false;

    const video = create(url, {
      showPlayIcon,
    });

    console.info('[content] video', video);

    if (video == null) {
      sendResponse({ success: false });
      return;
    }

    void video.getThumbnailUrl().then((thumbnailUrl) => {
      const message = {
        success: true,
        video: {
          id: video.id,
          thumbnailUrl,
          providerName: video.providerName,
          url: video.url,
        },
      };

      console.info('[content] sendResponse', message);
      sendResponse(message);
    });

    /**
     * Function to call (at most once) when you have a response.
     * The argument should be any JSON-ifiable object.
     * If you have more than one onMessage listener in the same document, then only one may send a response.
     * This function becomes invalid when the event listener returns,
     * unless you return true from the event listener to indicate you wish to send a response asynchronously
     * (this will keep the message channel open to the other end until sendResponse is called).
     */
    return true;
  }

  return undefined;
});
