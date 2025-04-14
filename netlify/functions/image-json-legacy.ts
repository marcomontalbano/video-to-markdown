import type { Handler, HandlerEvent } from '@netlify/functions';
import cloudinary from './cloudinary/index.js';
import { create } from './videoWrapper/index.js';

const isProduction = process.env.NODE_ENV === 'production';

const toError = (message: string, statusCode = 500) => {
  return {
    statusCode: statusCode,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      error: true,
      message,
    }),
  };
};

const toSuccess = (payload: Record<string, unknown>, statusCode = 200) => {
  return {
    statusCode: statusCode,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  };
};

const getParam = (event: HandlerEvent, paramName: string): string | undefined => {
  if (event.body == null) {
    return undefined;
  }

  if (event.httpMethod === 'GET') {
    return event.queryStringParameters?.[paramName];
  }

  const urlSearchParams = new URLSearchParams(event.body);
  return urlSearchParams.get(paramName) ?? undefined;
};

export const handler: Handler = async (event) => {
  const url = getParam(event, 'url');

  if (url === undefined || url === null) {
    return toError('param URL is mandatory.', 422);
  }

  let video: Awaited<ReturnType<typeof create>>;

  try {
    video = await create(url, {
      showPlayIcon: getParam(event, 'showPlayIcon') === 'true',
      image: getParam(event, 'image'),
    });
  } catch (error) {
    return toError(error.message, 422);
  }

  if (video == null) {
    return toError('Video not found.', 422);
  }

  video.log('httpMethod', event.httpMethod);
  video.log('url', url);
  video.log('id', video.id);
  video.log('highQuality', cloudinary.useHighQuality() ? 'true' : 'false');

  return video
    .getThumbnailUrl_legacy()
    .then((videoUrl) => {
      if (videoUrl == null) {
        return null;
      }

      if (!video.needsCloudinary()) {
        return videoUrl;
      }

      return (
        cloudinary
          .create(videoUrl, video, {
            showPlayIcon: video.options.showPlayIcon,
          })
          .then((response) => response.secure_url) ?? null
      );
    })
    .then((imageUrl) => {
      return toSuccess({
        provider: video.providerName,
        url: video.url,
        image: imageUrl,
      });
    })
    .catch((error) => {
      return toError(isProduction ? undefined : error.message, 422);
    });
};
