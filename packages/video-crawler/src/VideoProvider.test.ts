import { test } from 'uvu';
import { equal } from 'uvu/assert';

import VideoProvider from './VideoProvider.js';

test('resolves the thumbnail url once, no matter how many times it is asked for', async () => {
  let calls = 0;

  class Provider extends VideoProvider {
    protected async fetchThumbnailUrl() {
      calls += 1;
      return Promise.resolve('https://example.com/thumbnail.jpg');
    }
  }

  const video = new Provider('https://example.com/video');

  equal(await video.getThumbnailUrl(), 'https://example.com/thumbnail.jpg');
  equal(await video.getThumbnailUrl(), 'https://example.com/thumbnail.jpg');

  equal(calls, 1, 'Expected "fetchThumbnailUrl" to be called once:');
});

test('resolves the title once, no matter how many times it is asked for', async () => {
  let calls = 0;

  class Provider extends VideoProvider {
    protected async fetchTitle() {
      calls += 1;
      return Promise.resolve('A video title');
    }
  }

  const video = new Provider('https://example.com/video');

  equal(await video.getTitle(), 'A video title');
  equal(await video.getTitle(), 'A video title');

  equal(calls, 1, 'Expected "fetchTitle" to be called once:');
});

test.run();
