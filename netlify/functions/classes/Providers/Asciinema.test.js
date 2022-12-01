import { test } from 'uvu';
import { equal } from 'uvu/assert';

import Asciinema from './Asciinema.js';

test('"regex" must be correct.', () => {
  equal(Asciinema.getVideoId('https://asciinema.org/a/335480'), '335480');
});

test('all methods must work.', () => {
  const url = 'https://asciinema.org/a/335480';
  const video = new Asciinema(url);

  // static methods
  equal(Asciinema.check(url), true);

  // instance methods
  equal(video.getId(), '335480');
  equal(video.providerName, 'asciinema');
  equal(video.url, url);
});

test.run();
