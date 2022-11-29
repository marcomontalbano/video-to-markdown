import { test } from 'uvu';
import { equal } from 'uvu/assert';

import Facebook from './Facebook';

test('"regex" must be correct.', () => {
  equal(
    Facebook.getVideoId('https://www.facebook.com/backintimetheparty/videos/1588846901182916/'),
    '1588846901182916',
  );
  equal(
    Facebook.getVideoId('https://www.facebook.com/backintimetheparty/videos/description/1588846901182916/'),
    '1588846901182916',
  );
});

test('all methods must work.', () => {
  const url = 'https://www.facebook.com/backintimetheparty/videos/1588846901182916/';
  const video = new Facebook(url);

  // static methods
  equal(Facebook.check(url), true);

  // instance methods
  equal(video.getId(), '1588846901182916');
  equal(video.providerName, 'facebook');
  equal(video.url, url);
});

test.run();
