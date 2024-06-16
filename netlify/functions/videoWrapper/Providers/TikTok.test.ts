import { test } from 'uvu';

import TikTok from './TikTok.js';
import { createTest } from './test.helpers.js';

createTest(TikTok, 'https://www.tiktok.com/@tiktok/video/6584647400055377158?is_copy_url=1&is_from_webapp=v1', {
  isValid: true,
  id: '6584647400055377158',
  providerName: 'tiktok',
});

createTest(TikTok, 'https://www.tiktok.com/@tiktok_it.1/video/6584731204698770693?is_copy_url=1&is_from_webapp=v1', {
  isValid: true,
  id: '6584731204698770693',
  providerName: 'tiktok',
});

createTest(TikTok, 'https://www.tiktok.com/@tiktok/video/6584647400055377158', {
  isValid: true,
  id: '6584647400055377158',
  providerName: 'tiktok',
});

test.run();
