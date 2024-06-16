import { test } from 'uvu';

import Facebook from './Facebook.js';
import { createTest } from './test.helpers.js';

createTest(Facebook, 'https://www.facebook.com/backintimetheparty/videos/1588846901182916/', {
  isValid: true,
  id: '1588846901182916',
  providerName: 'facebook',
});

createTest(Facebook, 'https://www.facebook.com/backintimetheparty/videos/description/1588846901182916/', {
  isValid: true,
  id: '1588846901182916',
  providerName: 'facebook',
});

test.run();
