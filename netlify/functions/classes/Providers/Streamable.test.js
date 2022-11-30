import { test } from 'uvu';
import { equal } from 'uvu/assert';

import Streamable from './Streamable';

test('"regex" must be correct.', () => {
  equal(Streamable.getVideoId('https://streamable.com/1nvj5i'), '1nvj5i');
});

test('all methods must work.', () => {
  const url = 'https://streamable.com/1nvj5i';
  const video = new Streamable(url);

  // static methods
  equal(Streamable.check(url), true);

  // instance methods
  equal(video.getId(), '1nvj5i');
  equal(video.providerName, 'streamable');
  equal(video.url, url);
});

test.run();
