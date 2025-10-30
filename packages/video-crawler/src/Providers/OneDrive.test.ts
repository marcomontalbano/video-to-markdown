import { test } from 'uvu';

import OneDrive from './OneDrive.js';
import { createTest } from './test.helpers.js';

createTest(OneDrive, 'https://1drv.ms/v/s!An21T-lhvYKSkFpqKTb4YeZpKfzC?e=iXCxja', {
  isValid: true,
  id: 'An21T-lhvYKSkFpqKTb4YeZpKfzC',
  providerName: 'onedrive',
});

createTest(
  OneDrive,
  'https://onedrive.live.com/?qt=allmyphotos&photosData=%2Fshare%2F9282BD61E94FB57D%212138%3Fithint%3Dvideo%26e%3DiXCxja%26migratedtospo%3Dtrue&sw=bypassConfig&cid=9282BD61E94FB57D&id=9282BD61E94FB57D%212138&redeem=aHR0cHM6Ly8xZHJ2Lm1zL3YvcyFBbjIxVC1saHZZS1NrRnBxS1RiNFllWnBLZnpDP2U9aVhDeGph&v=photos',
  {
    isValid: true,
    id: '?qt=allmyphotos&photosData=%2Fshare%2F9282BD61E94FB57D%212138%3Fithint%3Dvideo%26e%3DiXCxja%26migratedtospo%3Dtrue&sw=bypassConfig&cid=9282BD61E94FB57D&id=9282BD61E94FB57D%212138&redeem=aHR0cHM6Ly8xZHJ2Lm1zL3YvcyFBbjIxVC1saHZZS1NrRnBxS1RiNFllWnBLZnpDP2U9aVhDeGph&v=photos',
    providerName: 'onedrive',
  },
);

createTest(
  OneDrive,
  'https://onedrive.live.com/?qt=allmyphotos&photosData=%2Fshare%2F1C827834532D46A7%21s8e2b233039b04a08bda364f92ccae643%3Fithint%3Dvideo%26e%3DQblvlh%26migratedtospo%3Dtrue&sw=bypassConfig&cid=1C827834532D46A7&id=1C827834532D46A7%21s8e2b233039b04a08bda364f92ccae643&redeem=aHR0cHM6Ly8xZHJ2Lm1zL3YvYy8xYzgyNzgzNDUzMmQ0NmE3L0VUQWpLNDZ3T1FoS3ZhTmstU3pLNWtNQnZnbHFpWGFBT1ZuYnI3SDJQaHZ2b0E%5FZT1RYmx2bGg&v=photos',
  {
    isValid: true,
    id: '?qt=allmyphotos&photosData=%2Fshare%2F1C827834532D46A7%21s8e2b233039b04a08bda364f92ccae643%3Fithint%3Dvideo%26e%3DQblvlh%26migratedtospo%3Dtrue&sw=bypassConfig&cid=1C827834532D46A7&id=1C827834532D46A7%21s8e2b233039b04a08bda364f92ccae643&redeem=aHR0cHM6Ly8xZHJ2Lm1zL3YvYy8xYzgyNzgzNDUzMmQ0NmE3L0VUQWpLNDZ3T1FoS3ZhTmstU3pLNWtNQnZnbHFpWGFBT1ZuYnI3SDJQaHZ2b0E%5FZT1RYmx2bGg&v=photos',
    providerName: 'onedrive',
  },
);

test.run();
