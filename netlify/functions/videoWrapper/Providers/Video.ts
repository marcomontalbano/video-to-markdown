import CryptoJS from 'crypto-js';
import { extractFrame } from '../utils.js';
import VideoProvider from '../VideoProvider.js';
import { videoRegEx } from '../videoRegEx.js';

export default class Video extends VideoProvider {
  get providerName() {
    return 'video';
  }

  get regex() {
    return videoRegEx;
  }

  get id() {
    return super.id ? CryptoJS.MD5(this.url).toString(CryptoJS.enc.Hex) : null;
  }

  async getThumbnailUrl() {
    const scale = 1;
    const video = document.querySelector('video');

    return extractFrame(video, scale);
  }
}
