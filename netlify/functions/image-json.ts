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
  const thumbnailUrl = getParam(event, 'thumbnailUrl');
  const thumbnailBase64 = getParam(event, 'thumbnailBase64');
  const id = getParam(event, 'id');
  const providerName = getParam(event, 'providerName');
  const url = getParam(event, 'url');
  const showPlayIcon = getParam(event, 'showPlayIcon');

  if (thumbnailUrl == null || thumbnailBase64 == null || id == null || providerName == null || url == null) {
    return toError('Missing params.', 422);
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

  if (!video.needsCloudinary()) {
    return toSuccess({
      providerName,
      url,
      generatedThumbnailUrl: thumbnailUrl,
    });
  }

  const generatedThumbnailUrl = await cloudinary
    .create(
      thumbnailBase64,
      { id, providerName, url },
      {
        showPlayIcon: showPlayIcon === 'true',
      },
    )
    .then((response) => response.secure_url)
    .catch((error) => {
      return toError(isProduction ? undefined : error.message, 422);
    });

  if (typeof generatedThumbnailUrl === 'string') {
    return toSuccess({
      providerName,
      url,
      generatedThumbnailUrl,
    });
  }

  return generatedThumbnailUrl;

  // return toSuccess({
  //   message: 'Hello from image-json.ts',
  //   event,
  //   queryStringParameters: event.queryStringParameters,
  //   body: event.body,
  //   httpMethod: event.httpMethod,
  //   headers: event.headers,
  //   generatedThumbnailUrl: thumbnailUrl,
  // });
};

export const handler2: Handler = async (event) => {
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
