import { test } from 'uvu';

import Bilibili from './Bilibili.js';
import { createTest } from './test.helpers.js';

createTest(Bilibili, 'https://www.bilibili.tv/en/video/2048949558', {
  id: '2048949558',
  isValid: true,
  providerName: 'bilibili',
});

createTest(Bilibili, 'https://www.bilibili.tv/th/video/2048949558', {
  id: '2048949558',
  isValid: true,
  providerName: 'bilibili',
});

createTest(Bilibili, 'https://www.bilibili.tv/en/video/2040069379?bstar_from=bstar-web.ugc-video-detail.playlist.all', {
  id: '2040069379',
  isValid: true,
  providerName: 'bilibili',
});

test.run();
