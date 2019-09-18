import fileType from 'file-type';
import VideoWrapper from './classes/VideoWrapper';

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

exports.handler = (event, context, callback) => {
    sendLambdaEvent(event);

    const url = event.queryStringParameters.url;

    const video = VideoWrapper.create(url);

    if (url === undefined) {
        return throwException(422, 'param URL is mandatory.', callback);
    }

    video.log('GET', url);

    video
        .getThumbnail_asBuffer()
        .then(buffer => {
            callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    provider: video.providerName,
                    url: video.url,
                    mime: fileType(buffer).mime,
                    base64: `data:${fileType(buffer).mime};base64,${buffer.toString('base64')}`,
                }),
            });
        })
        .catch(error => {
            callback(null, {
                statusCode: 422,
                body: JSON.stringify({ error: true })
            });
        });
};
