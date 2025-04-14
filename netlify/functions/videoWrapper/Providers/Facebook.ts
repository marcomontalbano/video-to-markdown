import VideoProvider from '../VideoProvider.js';

// @ts-expect-error TODO: there're no envs in the content script
globalThis.process ??= { env: {} };

const { FACEBOOK_ACCESS_TOKEN } = process.env;

// https://www.facebook.com/backintimetheparty/videos/1588846901182916/

export default class Facebook extends VideoProvider {
  get providerName() {
    return 'facebook';
  }

  get regex() {
    return [
      // - https://www.facebook.com/backintimetheparty/videos/1588846901182916/
      /https?\:\/\/www\.facebook\.com\/[\w]+\/videos\/([0-9]+)/,

      // - https://www.facebook.com/backintimetheparty/videos/description/1588846901182916/
      /https?\:\/\/www\.facebook\.com\/[\w]+\/videos[\w/-]+\/([0-9]+)/,
    ];
  }

  getThumbnailUrl_legacy() {
    // unfortunately the FACEBOOK_ACCESS_TOKEN is temporally and there is no way to get a quality thumbnail without a valid token.
    if (FACEBOOK_ACCESS_TOKEN) {
      return fetch(
        `https://graph.facebook.com/${this.id}?access_token=${FACEBOOK_ACCESS_TOKEN}&fields=title,description,updated_time,id,thumbnails`,
      )
        .then((response) => response.json())
        .then((json) => json.thumbnails.data.filter((t: { is_preferred: boolean }) => t.is_preferred)[0].uri);
    }

    return new Promise((resolve) => resolve(`https://graph.facebook.com/${this.id}/picture`));
  }

  async getThumbnailUrl() {
    const image = document.querySelector('meta[property="og:image"]')?.getAttribute('content');
    return image ?? null;
  }
}
