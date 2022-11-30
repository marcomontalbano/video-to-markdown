import { sendLambdaEvent } from './google-ua';

import sinon from 'sinon';
import { test } from 'uvu';
import { equal } from 'uvu/assert';

test('sendLambdaEvent should send event without a specified referer', () => {
  const mock = sinon.spy();

  sendLambdaEvent(
    {
      path: '/.netlify/functions/image-json',
    },
    mock,
  );

  equal(mock.getCall(0).args, ['Lambda Function - image-json', 'invoke', '']);
});

test('sendLambdaEvent should send event with a specified referer', () => {
  const mock = sinon.spy();

  sendLambdaEvent(
    {
      path: '/.netlify/functions/image-json',
      headers: {
        referer: 'https://example.com',
      },
      queryStringParameters: {
        url: 'https://example.com',
      },
    },
    mock,
  );

  equal(mock.getCall(0).args, ['Lambda Function - image-json', 'invoke', 'referer - https://example.com']);
});

test('sendLambdaEvent should send event with a specified url', () => {
  const mock = sinon.spy();

  sendLambdaEvent(
    {
      path: '/.netlify/functions/image-json',
      queryStringParameters: {
        url: 'https://example.com',
      },
    },
    mock,
  );

  equal(mock.getCall(0).args, ['Lambda Function - image-json', 'invoke', 'videoUrl - https://example.com']);
});

test.run();
