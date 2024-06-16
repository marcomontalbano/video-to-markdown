import VideoProvider from '../VideoProvider.js';

// https://imgur.com/

export default class Imgur extends VideoProvider {
  get providerName() {
    return 'imgur';
  }

  static get regex() {
    return [
      // - //imgur.com/VT1vCoz
      /https?\:\/\/imgur\.com\/([0-9A-Za-z]+)/,
    ];
  }

  getThumbnail_asVideoUrl() {
    return Promise.resolve(`${this.url}.jpg`);
  }
}
