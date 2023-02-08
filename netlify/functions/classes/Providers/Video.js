import VideoProvider from '../VideoProvider.js';

import CryptoJS from 'crypto-js';

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
    return super.getVideoId(url) ? CryptoJS.MD5(url).toString(CryptoJS.enc.Hex) : undefined;
  }

  getThumbnail_asVideoUrl() {
    return Promise.resolve(this.options.image);
  }
}
