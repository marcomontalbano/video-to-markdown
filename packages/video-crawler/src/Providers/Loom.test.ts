import { test } from 'uvu';

import Loom from './Loom.js';
import { createTest } from './test.helpers.js';

createTest(Loom, 'https://www.loom.com/share/3d0b326f650749bbb1fa13895dcd6563', {
  isValid: true,
  id: '3d0b326f650749bbb1fa13895dcd6563',
  providerName: 'loom',
});

test.run();
