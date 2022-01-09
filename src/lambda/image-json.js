import VideoWrapper from './classes/VideoWrapper';
import cloudinary from './classes/cloudinary';

import { sendLambdaEvent } from './classes/google-ua';

const isProduction = process.env.NODE_ENV === 'production'

const throwException = (statusCode, message, callback) => {
    callback = callback || (() => {});
    const error = {
        statusCode: statusCode,
        body: JSON.stringify({
            errors: [
                {
                    message: message
                }
            ]
        })
    };

    callback(null, error);
    return error;
};

const getParam  = (event, paramName) => {
    const urlSearchParams = new URLSearchParams(event.body);
    return event.httpMethod === 'GET' ? event.queryStringParameters[paramName] : urlSearchParams.get(paramName);
};

exports.handler = (event, context, callback) => {
    sendLambdaEvent(event);

    const url = getParam(event, 'url');

    if (url === undefined || url === null) {
        return throwException(422, 'param URL is mandatory.', callback);
    }

    let video;
    try {
        video = VideoWrapper.create(url, {
            showPlayIcon: getParam(event, 'showPlayIcon') === 'true',
            image: getParam(event, 'image'),
            ImageService: cloudinary
        });
    } catch (error) {
        return callback(null, {
            statusCode: 422,
            body: JSON.stringify({
                error: true,
                message: error.message
            })
        });
    }

    video.log('httpMethod', event.httpMethod);
    video.log('url', url);
    video.log('highQuality', cloudinary.useHighQuality() ? 'true' : 'false');

    video
        .getThumbnail_asUrl()
        .then(imageUrl => {
            callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    provider: video.providerName,
                    url: video.url,
                    image: imageUrl,
                }),
            });
        })
        .catch(error => {
            callback(null, {
                statusCode: 422,
                body: JSON.stringify({
                    error: true,
                    message: isProduction ? undefined : error.message
                })
            });
        });

};
