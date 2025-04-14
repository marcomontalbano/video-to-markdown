import { create } from '../../../netlify/functions/videoWrapper/index.js';
import type { Event } from '../types.js';

// @ts-expect-error TODO: there're no envs in the content script
globalThis.process ??= { env: {} };

const eventCallback: (
  message: Event['checkPage']['message'] | Event['extractPage']['message'],
  sender: chrome.runtime.MessageSender,
  sendResponse: (message: Event['checkPage']['response'] | Event['extractPage']['response']) => void,
) => void = (message, _sender, sendResponse) => {
  void (async () => {
    if (message.action === 'checkPage') {
      const message = await checkUrl(location.href);
      sendResponse(message);
    }

    if (message.action === 'extractPage') {
      const responseMessage = await checkUrl(location.href, message.showPlayIcon);

      if (responseMessage == null || responseMessage.success === false) {
        sendResponse({
          success: false,
        });

        return;
      }

      const BASE_URL = 'http://localhost:8888';
      const lambdaUrl = `${BASE_URL}/.netlify/functions`;
      const response = await fetch(`${lambdaUrl}/image-json`, {
        method: 'POST',
        body: toURLSearchParams(responseMessage.video),
      }).then((response) => response.json());

      sendResponse({
        ...responseMessage,
        video: {
          ...responseMessage.video,
          ...response,
        },
      });
    }
  })();

  if (message.action === 'extractPage' || message.action === 'checkPage') {
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
};

chrome.runtime.onMessage.addListener(eventCallback);

async function checkUrl(url: string, showPlayIcon = false): Promise<Event['checkPage']['response']> {
  const video = create(url, {
    showPlayIcon,
  });

  if (video == null) {
    return {
      success: false,
    };
  }

  const thumbnailUrl = await video.getThumbnailUrl();

  const thumbnailBase64 = await video.getThumbnailBase64();

  if (thumbnailBase64 == null || video.id == null) {
    return {
      success: false,
    };
  }

  return {
    success: true,
    video: {
      id: video.id,
      thumbnailUrl,
      thumbnailBase64,
      providerName: video.providerName,
      url: video.url,
      showPlayIcon,
    },
  };
}

/**
 * Convert a record of params to URLSearchParams
 * @param params - params to convert
 */
function toURLSearchParams(params: Record<string, string | number | boolean | null | undefined>): URLSearchParams {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value != null) {
      searchParams.append(key, value.toString());
    }
  }

  return searchParams;
}
