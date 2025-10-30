import CryptoJS from 'crypto-js';
import { suite } from 'uvu';
import { equal } from 'uvu/assert';
import { md5 } from './md5';
import type { Options } from './types';

const test = suite('MD5');

test('implementation should be equivalent', async () => {
  const message = `
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

  const actual = CryptoJS.MD5(message).toString(CryptoJS.enc.Hex);
  const expect = md5(message);

  equal(actual, expect);

  const url = 'https://docs.google.com/presentation/d/5p_qEW432qT5_EWQjwTo-Q5FaEjjsWUvc/edit?usp=sharing';

  equal(CryptoJS.MD5(url).toString(CryptoJS.enc.Hex), md5(url));

  const options: Options = {
    showPlayIcon: true,
    image: undefined,
  };

  equal(CryptoJS.MD5(JSON.stringify(options)).toString(CryptoJS.enc.Hex), md5(JSON.stringify(options)));
});

test.run();
