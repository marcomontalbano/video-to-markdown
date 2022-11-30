// @ts-check

import VideoWrapper from './classes/VideoWrapper.js';
import cloudinary from './classes/cloudinary.js';

import { sendLambdaEvent } from './classes/google-ua.js';

const isProduction = process.env.NODE_ENV === 'production';

const throwException = (statusCode, message) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify({
      errors: [
        {
          message: message,
        },
      ],
    }),
  };
};

const getParam = (event, paramName) => {
  const urlSearchParams = new URLSearchParams(event.body);
  return event.httpMethod === 'GET' ? event.queryStringParameters[paramName] : urlSearchParams.get(paramName);
};

export const handler = async (event, context, callback) => {
  sendLambdaEvent(event);

  const url = getParam(event, 'url');

  if (url === undefined || url === null) {
    return throwException(422, 'param URL is mandatory.');
  }

  let video;
  try {
    video = await VideoWrapper.create(url, {
      showPlayIcon: getParam(event, 'showPlayIcon') === 'true',
      image: getParam(event, 'image'),
      ImageService: cloudinary,
    });
  } catch (error) {
    return callback(null, {
      statusCode: 422,
      body: JSON.stringify({
        error: true,
        message: error.message,
      }),
    });
  }

  video.log('httpMethod', event.httpMethod);
  video.log('url', url);
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
      return {
        statusCode: 422,
        body: JSON.stringify({
          error: true,
          message: isProduction ? undefined : error.message,
        }),
      };
    });
};
