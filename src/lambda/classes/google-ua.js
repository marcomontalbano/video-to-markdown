const ua = require('universal-analytics');
const path = require('path');

const { GA_TRACKING_ID } = process.env;
const visitor = ua(GA_TRACKING_ID);

const sendEvent = (...args) => {
    visitor.event(...args).send();
}

const sendLambdaEvent = (event, send = sendEvent) => {
    const {
        path: functionUrl,
        queryStringParameters: {
            url
        } = {},
        headers: {
            referer
        } = {}
    } = event;

    const functionName = path.basename(functionUrl);
    const category = `Lambda Function - ${functionName}`;
    const refererText = referer ? `referer - ${referer}` : '';
    const urlText = url ? `videoUrl - ${url}` : '';
    const label = refererText ? refererText : urlText;

    send(category, 'invoke', label);
}

module.exports = { sendLambdaEvent };
