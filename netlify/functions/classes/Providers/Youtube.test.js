import { test } from 'uvu';
import { equal } from 'uvu/assert';

import Youtube from './Youtube.js';

test('"regex" must be correct.', () => {
  equal(Youtube.getVideoId('https://www.youtube.com/watch?v=oRdzL2DX0yU'), 'oRdzL2DX0yU');
  equal(Youtube.getVideoId('https://m.youtube.com/watch?v=oRdzL2DX0yU'), 'oRdzL2DX0yU');
  equal(Youtube.getVideoId('https://youtu.be/oRdzL2DX0yU'), 'oRdzL2DX0yU');
  equal(Youtube.getVideoId('https://www.youtube.com/embed/oRdzL2DX0yU'), 'oRdzL2DX0yU');
  equal(Youtube.getVideoId('https://youtube.com/embed/oRdzL2DX0yU'), 'oRdzL2DX0yU');
  equal(Youtube.getVideoId('https://gaming.youtube.com/watch?v=CLdvw87teRc'), 'CLdvw87teRc');
  equal(Youtube.getVideoId('https://gaming.youtube.com/watch?v=CLdvw87teRc&feature=share'), 'CLdvw87teRc');
  equal(Youtube.getVideoId('https://music.youtube.com/watch?v=i3MKTm-49uI&feature=share'), 'i3MKTm-49uI');
});

test('all methods must work.', () => {
  const url = 'https://www.youtube.com/watch?v=oRdzL2DX0yU';
  const video = new Youtube(url);

  // static methods
  equal(Youtube.check(url), true);

  // instance methods
  equal(video.getId(), 'oRdzL2DX0yU');
  equal(video.providerName, 'youtube');
  equal(video.url, url);
});

test.run();
