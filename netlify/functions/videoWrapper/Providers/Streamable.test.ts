import { test } from 'uvu';

import Streamable from './Streamable.js';
import { createTest } from './test.helpers.js';

createTest(Streamable, 'https://streamable.com/1nvj5i', {
  isValid: true,
  id: '1nvj5i',
  providerName: 'streamable',
});

test.run();
