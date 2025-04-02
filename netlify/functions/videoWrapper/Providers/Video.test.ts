import { test } from 'uvu';
import { equal } from 'uvu/assert';

import Video from './Video.js';
import { createTest } from './test.helpers.js';

import crypto from 'node:crypto';
import CryptoJS from 'crypto-js';

import cloudinary from '../../cloudinary/index.js';
import type { Options } from '../../types.js';

createTest(Video, 'https://i.imgur.com/vhjwXMB.mp4', {
  isValid: true,
  id: 'f48ef897bfabed6334368c76e716f871',
  providerName: 'video',
});

createTest(Video, 'https://asciinema.org/a/335480', {
  isValid: false,
  id: null,
  providerName: 'video',
});

test('node:crypto vs crypto-js', () => {
  const url = 'https://docs.google.com/presentation/d/5p_qEW432qT5_EWQjwTo-Q5FaEjjsWUvc/edit?usp=sharing';

  equal(CryptoJS.MD5(url).toString(CryptoJS.enc.Hex), crypto.createHash('md5').update(url).digest('hex'));

  const options: Options = {
    showPlayIcon: true,
    image: undefined,
    ImageService: cloudinary,
  };

  equal(
    CryptoJS.MD5(JSON.stringify(options)).toString(CryptoJS.enc.Hex),
    crypto.createHash('md5').update(JSON.stringify(options)).digest('hex'),
  );
});

test.run();
