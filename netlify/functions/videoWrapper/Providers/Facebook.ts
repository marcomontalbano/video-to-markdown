import VideoProvider from '../VideoProvider.js';

// @ts-expect-error TODO: there're no envs in the content script
globalThis.process ??= { env: {} };

// https://www.facebook.com/backintimetheparty/videos/1588846901182916/

export default class Facebook extends VideoProvider {
  get providerName() {
    return 'facebook';
  }

  get regex() {
    return [
      // - https://www.facebook.com/backintimetheparty/videos/1588846901182916/
      /https?:\/\/www\.facebook\.com\/[\w]+\/videos\/([0-9]+)/,

      // - https://www.facebook.com/backintimetheparty/videos/description/1588846901182916/
      /https?:\/\/www\.facebook\.com\/[\w]+\/videos[\w/-]+\/([0-9]+)/,
    ];
  }

  async getThumbnailUrl() {
    const image = document.querySelector('meta[property="og:image"]')?.getAttribute('content');
    return image ?? null;
  }
}
