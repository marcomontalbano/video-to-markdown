import { test } from 'uvu';
import { equal } from 'uvu/assert';

import Dailymotion from './Dailymotion.js';

test('"regex" must be correct.', () => {
  equal(Dailymotion.getVideoId('https://www.dailymotion.com/video/x3ke49'), 'x3ke49');
  equal(Dailymotion.getVideoId('https://dai.ly/xxl8su'), 'xxl8su');
});

test('all methods must work.', () => {
  const url = 'https://www.dailymotion.com/video/x3ke49';
  const video = new Dailymotion(url);

  // static methods
  equal(Dailymotion.check(url), true);

  // instance methods
  equal(video.getId(), 'x3ke49');
  equal(video.providerName, 'dailymotion');
  equal(video.url, url);
});

test.run();
