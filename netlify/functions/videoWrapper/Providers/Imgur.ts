import VideoProvider from '../VideoProvider.js';

// https://imgur.com/

export default class Imgur extends VideoProvider {
  get providerName() {
    return 'imgur';
  }

  get regex() {
    return [
      // - https://imgur.com/VT1vCoz
      /https?:\/\/imgur\.com\/([0-9A-Za-z]+)/,
    ];
  }

  async getThumbnailUrl() {
    return `${this.url}.jpg`;
  }
}
