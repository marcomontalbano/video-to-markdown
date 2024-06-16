import { test } from 'uvu';

import CleanShotCloud from './CleanShotCloud.js';
import { createTest } from './test.helpers.js';

createTest(CleanShotCloud, 'https://cln.sh/YRePNX', {
  isValid: true,
  id: 'YRePNX',
  providerName: 'cleanshot-cloud',
});

test.run();
