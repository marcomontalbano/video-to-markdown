import VideoProvider from '../VideoProvider.js';

// https://asciinema.org/

export default class Asciinema extends VideoProvider {
  get providerName() {
    return 'asciinema';
  }

  get regex() {
    return [
      // - https://asciinema.org/a/335480
      /https?\:\/\/asciinema\.org\/a\/([0-9]+)/,
    ];
  }

  needsCloudinary() {
    return false;
  }

  async getThumbnailUrl_legacy() {
    return `${this.url}.svg`;
  }

  async getThumbnailUrl() {
    return `${this.url}.svg`;
  }
}
