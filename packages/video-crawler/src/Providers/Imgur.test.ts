import { test } from 'uvu';

import Imgur from './Imgur.js';
import { createTest } from './test.helpers.js';

createTest(Imgur, 'https://imgur.com/VT1vCoz', {
  isValid: true,
  id: 'VT1vCoz',
  providerName: 'imgur',
});

test.run();
