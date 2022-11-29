import { test } from 'uvu';
import { equal } from 'uvu/assert';

import Imgur from './Imgur';

test('"regex" must be correct.', () => {
  equal(Imgur.getVideoId('https://imgur.com/VT1vCoz'), 'VT1vCoz');
});

test('all methods must work.', () => {
  const url = 'https://imgur.com/VT1vCoz';
  const video = new Imgur(url);

  // static methods
  equal(Imgur.check(url), true);

  // instance methods
  equal(video.getId(), 'VT1vCoz');
  equal(video.providerName, 'imgur');
  equal(video.url, url);
});

test.run();
