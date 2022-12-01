import { test } from 'uvu';
import { equal } from 'uvu/assert';

import Video from './Video.js';

test('"regex" must be correct.', () => {
  equal(Video.getVideoId('https://i.imgur.com/vhjwXMB.mp4'), 'f48ef897bfabed6334368c76e716f871');
  equal(Video.check('https://asciinema.org/a/335480'), false);
});

test('all methods must work.', () => {
  const url = 'https://i.imgur.com/vhjwXMB.mp4';
  const video = new Video(url);

  // static methods
  equal(Video.check(url), true);

  // instance methods
  equal(video.getId(), 'f48ef897bfabed6334368c76e716f871');
  equal(video.providerName, 'video');
  equal(video.url, url);
});

test.run();
