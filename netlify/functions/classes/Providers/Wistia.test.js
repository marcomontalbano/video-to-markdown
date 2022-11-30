import { test } from 'uvu';
import { equal } from 'uvu/assert';

import Wistia from './Wistia';

test('"regex" must be correct.', () => {
  equal(Wistia.getVideoId('https://home.wistia.com/medias/e4a27b971d'), 'e4a27b971d');
  equal(Wistia.getVideoId('https://wistia.com/medias/e4a27b971d'), 'e4a27b971d');
  equal(Wistia.getVideoId('https://home.wistia.com/embed/iframe/e4a27b971d'), 'e4a27b971d');
  equal(Wistia.getVideoId('https://john.wistia.com/embed/iframe/e4a27b971d'), 'e4a27b971d');
  equal(Wistia.getVideoId('https://john.wistia.com/embed/playlists/e4a27b971d'), 'e4a27b971d');
  equal(Wistia.getVideoId('https://john.wi.st/embed/playlists/e4a27b971d'), 'e4a27b971d');
  equal(Wistia.getVideoId('https://home.wi.st/medias/e4a27b971d'), 'e4a27b971d');
  equal(Wistia.getVideoId('https://home.wi.st/medias/e4a27b971d'), 'e4a27b971d');
  equal(
    Wistia.getVideoId('https://wistia.com/series/one-ten-one-hundred?wchannelid=z2vptfjlxk&wvideoid=donagpxtdr'),
    'donagpxtdr',
  );
});

test('all methods must work.', () => {
  const url = 'https://home.wistia.com/medias/e4a27b971d';
  const video = new Wistia(url);

  // static methods
  equal(Wistia.check(url), true);

  // instance methods
  equal(video.getId(), 'e4a27b971d');
  equal(video.providerName, 'wistia');
  equal(video.url, url);
});

test.run();
