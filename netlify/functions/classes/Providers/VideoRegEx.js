import VideoProvider from '../VideoProvider.js';

export default class VideoRegEx extends VideoProvider {
  static get regex() {
    return [
      // - //example.com/video.mp4
      /^https?\:\/\/.*\.(mp4|mov|webm)$/,
    ];
  }
}
