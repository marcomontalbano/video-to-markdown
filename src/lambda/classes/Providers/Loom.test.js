import { test } from 'uvu';
import { equal } from 'uvu/assert';

import Loom from './Loom';

test('"regex" must be correct.', () => {
  equal(
    Loom.getVideoId('https://www.loom.com/share/3d0b326f650749bbb1fa13895dcd6563'),
    '3d0b326f650749bbb1fa13895dcd6563',
  );
});

test('all methods must work.', () => {
  const url = 'https://www.loom.com/share/3d0b326f650749bbb1fa13895dcd6563';
  const video = new Loom(url);

  // static methods
  equal(Loom.check(url), true);

  // instance methods
  equal(video.getId(), '3d0b326f650749bbb1fa13895dcd6563');
  equal(video.providerName, 'loom');
  equal(video.url, url);
});

test.run();
