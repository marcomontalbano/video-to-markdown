import { test } from 'uvu';

import GoogleDrive from './GoogleDrive.js';
import { createTest } from './test.helpers.js';

createTest(GoogleDrive, 'https://drive.google.com/file/d/5p_qEW432qT5_EWQjwTo-Q5FaEjjsWUvc/view', {
  isValid: true,
  id: '5p_qEW432qT5_EWQjwTo-Q5FaEjjsWUvc',
  providerName: 'google-drive',
});

createTest(GoogleDrive, 'https://drive.google.com/open?id=5p_qEW432qT5_EWQjwTo-Q5FaEjjsWUvc', {
  isValid: true,
  id: '5p_qEW432qT5_EWQjwTo-Q5FaEjjsWUvc',
  providerName: 'google-drive',
});

createTest(GoogleDrive, 'https://docs.google.com/presentation/d/5p_qEW432qT5_EWQjwTo-Q5FaEjjsWUvc/edit?usp=sharing', {
  isValid: true,
  id: '5p_qEW432qT5_EWQjwTo-Q5FaEjjsWUvc',
  providerName: 'google-drive',
});

test.run();
