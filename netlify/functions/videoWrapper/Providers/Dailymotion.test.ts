import { test } from 'uvu';

import Dailymotion from './Dailymotion.js';
import { createTest } from './test.helpers.js';

createTest(Dailymotion, 'https://www.dailymotion.com/video/x3ke49', {
  isValid: true,
  id: 'x3ke49',
  providerName: 'dailymotion',
});

createTest(Dailymotion, 'https://dai.ly/xxl8su', {
  isValid: true,
  id: 'xxl8su',
  providerName: 'dailymotion',
});

createTest(Dailymotion, 'https://example.com/1234', {
  isValid: false,
  id: null,
  providerName: 'dailymotion',
});

test.run();
