import { suite } from 'uvu';
import { equal } from 'uvu/assert';

import { create } from './index.js';

const test = suite('"create" method must instantiate the correct Video Provider.');

test('dailymotion', async () => {
  equal(create('https://www.dailymotion.com/video/x3ke49')?.providerName, 'dailymotion');
});

test('vimeo', async () => {
  equal(create('https://vimeo.com/263856289')?.providerName, 'vimeo');
});

test('youtube', async () => {
  equal(create('https://www.youtube.com/watch?v=oRdzL2DX0yU')?.providerName, 'youtube');
});

test('facebook', async () => {
  equal(create('https://www.facebook.com/backintimetheparty/videos/1588846901182916/')?.providerName, 'facebook');
});

test('asciinema', async () => {
  equal(create('https://asciinema.org/a/335480')?.providerName, 'asciinema');
});

test('bilibili', async () => {
  equal(create('https://www.bilibili.tv/en/video/2048949558')?.providerName, 'bilibili');
});

test('google-drive', async () => {
  equal(create('https://drive.google.com/file/d/5p_qEW432qT5_EWQjwTo-Q5FaEjjsWUvc/view')?.providerName, 'google-drive');
});

test('imgur', async () => {
  equal(create('https://imgur.com/VT1vCoz')?.providerName, 'imgur');
});

test('onedrive', async () => {
  equal(create('https://1drv.ms/v/s!An21T-lhvYKSkFpqKTb4YeZpKfzC?e=iXCxja')?.providerName, 'onedrive');
});

test('peertube', async () => {
  equal(create('https://framatube.org/w/kkGMgK9ZtnKfYAgnEtQxbv?start=1s')?.providerName, 'peertube');
});

test('tiktok', async () => {
  equal(create('https://www.tiktok.com/@tiktok/video/6584647400055377158')?.providerName, 'tiktok');
});

test('video', async () => {
  equal(create('https://i.imgur.com/vhjwXMB.mp4')?.providerName, 'video');
});

test('loom', async () => {
  equal(create('https://www.loom.com/share/3d0b326f650749bbb1fa13895dcd6563')?.providerName, 'loom');
});

test('wistia', async () => {
  equal(create('https://home.wistia.com/medias/e4a27b971d')?.providerName, 'wistia');
});

test('streamable', async () => {
  equal(create('https://streamable.com/1nvj5i')?.providerName, 'streamable');
});

test('cleanshot-cloud', async () => {
  equal(create('https://cln.sh/YRePNX')?.providerName, 'cleanshot-cloud');
});

test.run();
