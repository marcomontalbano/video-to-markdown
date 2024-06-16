import VideoProvider from '../VideoProvider.js';

// https://developers.tiktok.com/doc/embed-videos

export default class TikTok extends VideoProvider {
  get providerName() {
    return 'tiktok';
  }

  static get regex() {
    return [
      // - //www.tiktok.com/@tiktok/video/6584647400055377158?is_copy_url=1&is_from_webapp=v1
      /https?\:\/\/www\.tiktok\.com\/@[\w\W]+\/video\/([a-z0-9]+)/,
    ];
  }

  getThumbnail_asVideoUrl() {
    const endpoint = `https://www.tiktok.com/oembed?url=${this.url}`;

    return fetch(endpoint)
      .then((response) => response.json())
      .then((json) => json.thumbnail_url);
  }
}
