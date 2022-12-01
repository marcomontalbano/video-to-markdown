import VideoProvider from '../VideoProvider.js';

import crypto from 'crypto';

export default class Video extends VideoProvider {
  get providerName() {
    return 'video';
  }

  static get regex() {
    return [
      // - //example.com/video.mp4
      /^https?\:\/\/.*\.(mp4|mov|webm)$/,
    ];
  }

  static getVideoId(url = '') {
    return super.getVideoId(url) ? crypto.createHash('md5').update(url).digest('hex') : undefined;
  }

  getThumbnail_asVideoUrl() {
    return Promise.resolve(this.options.image);
  }
}
