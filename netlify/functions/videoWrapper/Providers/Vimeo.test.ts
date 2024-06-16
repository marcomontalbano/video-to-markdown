import { test } from 'uvu';

import Vimeo from './Vimeo.js';
import { createTest } from './test.helpers.js';

createTest(Vimeo, 'https://vimeo.com/263856289', {
  isValid: true,
  id: '263856289',
  providerName: 'vimeo',
});

createTest(Vimeo, 'https://vimeo.com/channels/staffpicks/287019927', {
  isValid: true,
  id: '287019927',
  providerName: 'vimeo',
});

test.run();
