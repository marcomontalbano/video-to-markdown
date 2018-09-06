import fileType from 'file-type';
import VideoWrapper from './classes/VideoWrapper';

const isDevelopment = process.env.NODE_ENV === 'development';

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
                headers: {
                    'Content-Type': fileType(buffer).mime
                },
                body: isDevelopment ? buffer : buffer.toString('base64'),
                isBase64Encoded: isDevelopment ? false : true
            });
        })
        .catch(error => {
            callback(null, {
                statusCode: 422,
                body: JSON.stringify({ error })
            });
        });
};
