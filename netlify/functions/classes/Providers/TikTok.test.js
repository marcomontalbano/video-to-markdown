import { test } from 'uvu';
import { equal } from 'uvu/assert';

import TikTok from './TikTok';

test('"regex" must be correct.', () => {
  equal(
    TikTok.getVideoId('https://www.tiktok.com/@tiktok/video/6584647400055377158?is_copy_url=1&is_from_webapp=v1'),
    '6584647400055377158',
  );
  equal(
    TikTok.getVideoId('https://www.tiktok.com/@tiktok_it.1/video/6584731204698770693?is_copy_url=1&is_from_webapp=v1'),
    '6584731204698770693',
  );
  equal(TikTok.getVideoId('https://www.tiktok.com/@tiktok/video/6584647400055377158'), '6584647400055377158');
});

test('all methods must work.', () => {
  const url = 'https://www.tiktok.com/@tiktok/video/6584647400055377158?is_copy_url=1&is_from_webapp=v1';
  const video = new TikTok(url);

  // static methods
  equal(TikTok.check(url), true);

  // instance methods
  equal(video.getId(), '6584647400055377158');
  equal(video.providerName, 'tiktok');
  equal(video.url, url);
});

test.run();
