import { test } from 'uvu';
import { equal } from 'uvu/assert';

import OneDrive from './OneDrive.js';

test('"regex" must be correct.', () => {
  equal(
    OneDrive.getVideoId('https://1drv.ms/v/s!An21T-lhvYKSkFpqKTb4YeZpKfzC?e=iXCxja'),
    'An21T-lhvYKSkFpqKTb4YeZpKfzC',
  );
});

test('all methods must work.', () => {
  const url = 'https://1drv.ms/v/s!An21T-lhvYKSkFpqKTb4YeZpKfzC?e=iXCxja';
  const video = new OneDrive(url);

  // static methods
  equal(OneDrive.check(url), true);

  // instance methods
  equal(video.getId(), 'An21T-lhvYKSkFpqKTb4YeZpKfzC');
  equal(video.providerName, 'onedrive');
  equal(video.url, url);
});

test.run();
