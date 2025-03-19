import { test } from 'uvu';

import Video from './Video.js';
import { createTest } from './test.helpers.js';

createTest(Video, 'https://i.imgur.com/vhjwXMB.mp4', {
  isValid: true,
  id: 'f48ef897bfabed6334368c76e716f871',
  providerName: 'video',
});

createTest(Video, 'https://asciinema.org/a/335480', {
  isValid: false,
  id: null,
  providerName: 'video',
});

test.run();
