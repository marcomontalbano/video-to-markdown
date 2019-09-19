const ua = require('universal-analytics');
const visitor = ua('UA-50467643-11');
const path = require('path');

const sendEvent = (...args) => {
    visitor.event(...args).send();
}

const sendLambdaEvent = (event, send = sendEvent) => {
    const {
        path: functionUrl,
        headers: {
            referer
        } = {}
    } = event;

    const functionName = path.basename(functionUrl);
    const category = `Lambda Function - ${functionName}`;
    const label = referer ? `referer - ${referer}` : '';

    send(category, 'invoke', label);
}

module.exports = { sendLambdaEvent };
