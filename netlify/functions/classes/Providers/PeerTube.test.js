import { test } from 'uvu';
import { equal } from 'uvu/assert';

import PeerTube from './PeerTube';

test('"regex" must be correct.', () => {
  equal(PeerTube.getVideoId('https://framatube.org/w/kkGMgK9ZtnKfYAgnEtQxbv?start=1s'), 'kkGMgK9ZtnKfYAgnEtQxbv');
});

test('all methods must work.', () => {
  const url = 'https://framatube.org/w/kkGMgK9ZtnKfYAgnEtQxbv?start=1s';
  const video = new PeerTube(url);

  // static methods
  equal(PeerTube.check(url), true);

  // instance methods
  equal(video.getId(), 'kkGMgK9ZtnKfYAgnEtQxbv');
  equal(video.providerName, 'peertube');
  equal(video.url, url);
});

test.run();
