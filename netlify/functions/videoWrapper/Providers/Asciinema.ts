import VideoProvider from '../VideoProvider.js';

// https://asciinema.org/

export default class Asciinema extends VideoProvider {
  get providerName() {
    return 'asciinema';
  }

  static get regex() {
    return [
      // - //asciinema.org/a/335480
      /https?\:\/\/asciinema\.org\/a\/([0-9]+)/,
    ];
  }

  needsCloudinary() {
    return false;
  }

  getThumbnail_asVideoUrl() {
    return Promise.resolve(`${this.url}.svg`);
  }
}
