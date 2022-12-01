import { test } from 'uvu';
import { equal } from 'uvu/assert';

import CleanShotCloud from './CleanShotCloud.js';

test('"regex" must be correct.', () => {
  equal(CleanShotCloud.getVideoId('https://cln.sh/YRePNX'), 'YRePNX');
});

test('all methods must work.', () => {
  const url = 'https://cln.sh/YRePNX';
  const video = new CleanShotCloud(url);

  // static methods
  equal(CleanShotCloud.check(url), true);

  // instance methods
  equal(video.getId(), 'YRePNX');
  equal(video.providerName, 'cleanshot-cloud');
  equal(video.url, url);
});

test.run();
