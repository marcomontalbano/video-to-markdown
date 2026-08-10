import { test } from 'uvu';

import Instagram from './Instagram.js';
import { createTest } from './test.helpers.js';

createTest(Instagram, 'https://www.instagram.com/p/DW9Cni5jvXG/?img_index=1', {
  isValid: true,
  id: 'DW9Cni5jvXG',
  providerName: 'instagram',
});

createTest(Instagram, 'https://www.instagram.com/reel/DW9Cni5jvXG/', {
  isValid: true,
  id: 'DW9Cni5jvXG',
  providerName: 'instagram',
});

createTest(Instagram, 'https://www.instagram.com/tv/DW9Cni5jvXG/', {
  isValid: true,
  id: 'DW9Cni5jvXG',
  providerName: 'instagram',
});

createTest(Instagram, 'https://www.instagram.com/clicksam_/reel/DS-tAVniTqp/', {
  isValid: true,
  id: 'DS-tAVniTqp',
  providerName: 'instagram',
});

createTest(Instagram, 'https://www.instagram.com/reels/DbVBrmiMbie/', {
  isValid: true,
  id: 'DbVBrmiMbie',
  providerName: 'instagram',
});

test.run();
