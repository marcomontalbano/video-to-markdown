import { md5 } from '../md5';
import { extractFrame } from '../utils.js';
import VideoProvider from '../VideoProvider.js';

export default class Video extends VideoProvider {
  get providerName() {
    return 'video';
  }

  get regex() {
    return [
      // - //example.com/video.mp4
      /^https?:\/\/.*\.(mp4|mov|webm)$/,
    ];
  }

  get id() {
    return super.id ? md5(this.url) : null;
  }

  async getThumbnailUrl() {
    const scale = 1;
    const video = document.querySelector('video');

    return extractFrame(video, scale);
  }
}
