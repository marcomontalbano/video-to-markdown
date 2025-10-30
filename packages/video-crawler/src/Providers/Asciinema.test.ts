import { test } from 'uvu';

import Asciinema from './Asciinema.js';
import { createTest } from './test.helpers.js';

createTest(Asciinema, 'https://asciinema.org/a/335480', {
  id: '335480',
  isValid: true,
  providerName: 'asciinema',
});

createTest(Asciinema, 'https://asciinema.org/a/335480/', {
  id: '335480',
  isValid: true,
  providerName: 'asciinema',
});

createTest(Asciinema, 'https://asciinema.org/a/569727/iframe?', {
  id: '569727',
  isValid: true,
  providerName: 'asciinema',
});

test.run();
