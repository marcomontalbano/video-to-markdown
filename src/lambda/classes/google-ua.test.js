import { sendLambdaEvent } from './google-ua';

describe('google-ua', () => {
    describe('sendLambdaEvent', () => {
        it('should send event without a specified referer', () => {
            const mock = jest.fn();

            sendLambdaEvent({
                path: '/.netlify/functions/image-json',
            }, mock);

            expect(mock).toBeCalledWith('Lambda Function - image-json', 'invoke', '');
        });

        it('should send event with a specified referer', () => {
            const mock = jest.fn();

            sendLambdaEvent({
                path: '/.netlify/functions/image-json',
                headers: {
                    referer: 'https://example.com'
                }
            }, mock);

            expect(mock).toBeCalledWith('Lambda Function - image-json', 'invoke', 'referer - https://example.com');
        });
    });
});
