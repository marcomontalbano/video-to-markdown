import { test } from 'uvu';
import { equal } from 'uvu/assert';

import Vimeo from './Vimeo';

test('"regex" must be correct.', () => {
  equal(Vimeo.getVideoId('https://vimeo.com/263856289'), '263856289');
  equal(Vimeo.getVideoId('https://vimeo.com/channels/staffpicks/287019927'), '287019927');
});

test('all methods must work.', () => {
  const url = 'https://vimeo.com/channels/staffpicks/287019927';
  const video = new Vimeo(url);

  // static methods
  equal(Vimeo.check(url), true);

  // instance methods
  equal(video.getId(), '287019927');
  equal(video.providerName, 'vimeo');
  equal(video.url, url);
});

test.run();
