import type { Handler } from '@netlify/functions';
import cloudinary from './cloudinary/index.js';
import { create } from './videoWrapper/index.js';

const isProduction = process.env.NODE_ENV === 'production';

const throwException = (statusCode, message) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify({
      error: true,
      message,
    }),
  };
};

const getParam = (event, paramName) => {
  const urlSearchParams = new URLSearchParams(event.body);
  return event.httpMethod === 'GET' ? event.queryStringParameters[paramName] : urlSearchParams.get(paramName);
};

export const handler: Handler = async (event) => {
  const url = getParam(event, 'url');

  if (url === undefined || url === null) {
    return throwException(422, 'param URL is mandatory.');
  }

  let video: Awaited<ReturnType<typeof create>>;

  try {
    video = await create(url, {
      showPlayIcon: getParam(event, 'showPlayIcon') === 'true',
      image: getParam(event, 'image'),
      ImageService: cloudinary,
    });
  } catch (error) {
    return throwException(422, error.message);
  }

  video.log('httpMethod', event.httpMethod);
  video.log('url', url);
  video.log('id', video.getId());
  video.log('highQuality', cloudinary.useHighQuality() ? 'true' : 'false');

  return video
    .getThumbnail_asUrl()
    .then((imageUrl) => {
      return {
        statusCode: 200,
        body: JSON.stringify({
          provider: video.providerName,
          url: video.url,
          image: imageUrl,
        }),
      };
    })
    .catch((error) => {
      return throwException(422, isProduction ? undefined : error.message);
    });
};
