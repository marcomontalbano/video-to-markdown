import VideoWrapper from './classes/VideoWrapper';
import * as imgbb from './classes/imgbb';

import { sendLambdaEvent } from './classes/google-ua';

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
    const image = getParam(event, 'image');

    if (url === undefined || url === null) {
        return throwException(422, 'param URL is mandatory.', callback);
    }

    let video;
    try {
        video = VideoWrapper.create(url, {
            showPlayIcon: getParam(event, 'showPlayIcon') === 'true'
        });
    } catch (e) {
        return callback(null, {
            statusCode: 422,
            body: JSON.stringify({
                error: true,
                message: e.message
            })
        });
    }

    video.log('httpMethod', event.httpMethod);
    video.log('url', url);
    video.log('image', image);

    if (image) {
        imgbb.create(image).then(imageUrl => {
            callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    provider: video.providerName,
                    url: video.url,
                    image: imageUrl
                }),
            });
        });
    } else {
        video
            .getThumbnail_asImgbbUrl()
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
                    body: JSON.stringify({ error: true })
                });
            });
    }

};
