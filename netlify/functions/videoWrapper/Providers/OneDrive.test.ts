import { test } from 'uvu';

import OneDrive from './OneDrive.js';
import { createTest } from './test.helpers.js';

createTest(OneDrive, 'https://1drv.ms/v/s!An21T-lhvYKSkFpqKTb4YeZpKfzC?e=iXCxja', {
  isValid: true,
  id: 'An21T-lhvYKSkFpqKTb4YeZpKfzC',
  providerName: 'onedrive',
});

test.run();
