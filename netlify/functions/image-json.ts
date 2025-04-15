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
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*',
      },
      body: '',
    };
  }

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
};
