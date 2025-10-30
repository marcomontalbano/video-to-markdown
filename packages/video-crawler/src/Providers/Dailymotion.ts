import VideoProvider from '../VideoProvider.js';

// https://developer.dailymotion.com/api

export default class Dailymotion extends VideoProvider {
  get providerName() {
    return 'dailymotion';
  }

  get regex() {
    return [
      // - https://www.dailymotion.com/video/x3ke49
      /https?:\/\/www\.dailymotion\.com\/video\/([a-zA-Z0-9_-]+)/,

      // - https://dai.ly/xxl8su
      /https?:\/\/dai\.ly\/([a-zA-Z0-9_-]+)/,
    ];
  }

  async getThumbnailUrl() {
    const endpoint = `https://api.dailymotion.com/video/${this.id}?fields=title,thumbnail_720_url`;

    return fetch(endpoint)
      .then((response) => response.json())
      .then((json) => json.thumbnail_720_url);
  }
}
