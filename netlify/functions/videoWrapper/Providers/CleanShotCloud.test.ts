import { test } from 'uvu';

import CleanShotCloud from './CleanShotCloud.js';
import { createTest } from './test.helpers.js';

createTest(CleanShotCloud, 'https://cln.sh/sllTrgqg', {
  isValid: true,
  id: 'sllTrgqg',
  providerName: 'cleanshot-cloud',
});

test.run();
