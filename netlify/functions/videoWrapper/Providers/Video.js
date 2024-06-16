import VideoProvider from '../VideoProvider.js';
import { videoRegEx } from '../videoRegEx.js';

import crypto from 'node:crypto';

export default class Video extends VideoProvider {
  get providerName() {
    return 'video';
  }

  static get regex() {
    return videoRegEx;
  }

  static getVideoId(url = '') {
    return super.getVideoId(url) ? crypto.createHash('md5').update(url).digest('hex') : undefined;
  }

  getThumbnail_asVideoUrl() {
    return Promise.resolve(this.options.image);
  }
}
