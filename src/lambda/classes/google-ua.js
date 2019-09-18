const ua = require('universal-analytics');
const visitor = ua('UA-50467643-11');

const sendEvent = (...args) => {
    visitor.event(...args).send();
}

const sendLambdaEvent = event => {
    const {
        path,
        headers: {
            referer
        } = {}
    } = event;

    const category = `Lambda Function - ${path}`;
    const label = referer ? `referer - ${referer}` : '';

    sendEvent(category, 'invoke', label);
}

module.exports = { sendLambdaEvent };
