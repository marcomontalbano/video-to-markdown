import { test } from 'uvu';

import PeerTube from './PeerTube.js';
import { createTest } from './test.helpers.js';

createTest(PeerTube, 'https://framatube.org/w/kkGMgK9ZtnKfYAgnEtQxbv?start=1s', {
  isValid: true,
  id: 'kkGMgK9ZtnKfYAgnEtQxbv',
  providerName: 'peertube',
});

test.run();
