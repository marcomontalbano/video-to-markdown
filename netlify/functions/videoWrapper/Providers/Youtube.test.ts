import { test } from 'uvu';

import Youtube from './Youtube.js';
import { createTest } from './test.helpers.js';

createTest(Youtube, 'https://www.youtube.com/watch?v=oRdzL2DX0yU', {
  isValid: true,
  id: 'oRdzL2DX0yU',
  providerName: 'youtube',
});

createTest(Youtube, 'https://m.youtube.com/watch?v=oRdzL2DX0yU', {
  isValid: true,
  id: 'oRdzL2DX0yU',
  providerName: 'youtube',
});

createTest(Youtube, 'https://youtu.be/oRdzL2DX0yU', {
  isValid: true,
  id: 'oRdzL2DX0yU',
  providerName: 'youtube',
});

createTest(Youtube, 'https://www.youtube.com/embed/oRdzL2DX0yU', {
  isValid: true,
  id: 'oRdzL2DX0yU',
  providerName: 'youtube',
});

createTest(Youtube, 'https://youtube.com/embed/oRdzL2DX0yU', {
  isValid: true,
  id: 'oRdzL2DX0yU',
  providerName: 'youtube',
});

createTest(Youtube, 'https://gaming.youtube.com/watch?v=CLdvw87teRc', {
  isValid: true,
  id: 'CLdvw87teRc',
  providerName: 'youtube',
});

createTest(Youtube, 'https://gaming.youtube.com/watch?v=CLdvw87teRc&feature=share', {
  isValid: true,
  id: 'CLdvw87teRc',
  providerName: 'youtube',
});

createTest(Youtube, 'https://music.youtube.com/watch?v=i3MKTm-49uI&feature=share', {
  isValid: true,
  id: 'i3MKTm-49uI',
  providerName: 'youtube',
});

createTest(Youtube, 'https://www.youtube.com/shorts/iVxCy5lXLaA?feature=share', {
  isValid: true,
  id: 'iVxCy5lXLaA',
  providerName: 'youtube',
});

test.run();
