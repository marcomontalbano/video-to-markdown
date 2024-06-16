import { test } from 'uvu';

import Wistia from './Wistia.js';
import { createTest } from './test.helpers.js';

createTest(Wistia, 'https://home.wistia.com/medias/e4a27b971d', {
  isValid: true,
  id: 'e4a27b971d',
  providerName: 'wistia',
});

createTest(Wistia, 'https://wistia.com/medias/e4a27b971d', {
  isValid: true,
  id: 'e4a27b971d',
  providerName: 'wistia',
});

createTest(Wistia, 'https://home.wistia.com/embed/iframe/e4a27b971d', {
  isValid: true,
  id: 'e4a27b971d',
  providerName: 'wistia',
});

createTest(Wistia, 'https://john.wistia.com/embed/iframe/e4a27b971d', {
  isValid: true,
  id: 'e4a27b971d',
  providerName: 'wistia',
});

createTest(Wistia, 'https://john.wistia.com/embed/playlists/e4a27b971d', {
  isValid: true,
  id: 'e4a27b971d',
  providerName: 'wistia',
});

createTest(Wistia, 'https://john.wi.st/embed/playlists/e4a27b971d', {
  isValid: true,
  id: 'e4a27b971d',
  providerName: 'wistia',
});

createTest(Wistia, 'https://home.wi.st/medias/e4a27b971d', {
  isValid: true,
  id: 'e4a27b971d',
  providerName: 'wistia',
});

createTest(Wistia, 'https://wistia.com/series/one-ten-one-hundred?wchannelid=z2vptfjlxk&wvideoid=donagpxtdr', {
  isValid: true,
  id: 'donagpxtdr',
  providerName: 'wistia',
});

test.run();
