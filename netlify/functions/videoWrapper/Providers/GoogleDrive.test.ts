import { test } from 'uvu';
import { equal } from 'uvu/assert';

import GoogleDrive from './GoogleDrive.js';

test('"regex" must be correct.', () => {
  equal(
    GoogleDrive.getVideoId('https://drive.google.com/file/d/5p_qEW432qT5_EWQjwTo-Q5FaEjjsWUvc/view'),
    '5p_qEW432qT5_EWQjwTo-Q5FaEjjsWUvc',
  );
  equal(
    GoogleDrive.getVideoId('https://drive.google.com/open?id=5p_qEW432qT5_EWQjwTo-Q5FaEjjsWUvc'),
    '5p_qEW432qT5_EWQjwTo-Q5FaEjjsWUvc',
  );
  equal(
    GoogleDrive.getVideoId('https://docs.google.com/presentation/d/5p_qEW432qT5_EWQjwTo-Q5FaEjjsWUvc/edit?usp=sharing'),
    '5p_qEW432qT5_EWQjwTo-Q5FaEjjsWUvc',
  );
});

test('all methods must work.', () => {
  const url = 'https://drive.google.com/file/d/5p_qEW432qT5_EWQjwTo-Q5FaEjjsWUvc/view';
  const video = new GoogleDrive(url);

  // static methods
  equal(GoogleDrive.check(url), true);

  // instance methods
  equal(video.getId(), '5p_qEW432qT5_EWQjwTo-Q5FaEjjsWUvc');
  equal(video.providerName, 'google-drive');
  equal(video.url, url);
});

test.run();
