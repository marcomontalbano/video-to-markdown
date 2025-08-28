import VideoProvider from '../VideoProvider.js';

// https://support.streamable.com/api-documentation

export default class Streamable extends VideoProvider {
  get providerName() {
    return 'streamable';
  }

  get regex() {
    return [
      // - https://streamable.com/1nvj5i
      /https?:\/\/streamable\.com\/([a-z0-9]+)/,
    ];
  }

  needsCloudinary() {
    return true;
  }

  async getThumbnailUrl() {
    const endpoint = `https://api.streamable.com/oembed.json?url=${encodeURIComponent(`https://streamable.com/${this.id}`)}`;

    return fetch(endpoint)
      .then((response) => response.json())
      .then((json) => json.thumbnail_url);
  }
}
