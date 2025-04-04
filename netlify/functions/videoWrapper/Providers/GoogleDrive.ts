import VideoProvider from '../VideoProvider.js';

export default class GoogleDrive extends VideoProvider {
  get providerName() {
    return 'google-drive';
  }

  get regex() {
    return [
      // - https://drive.google.com/open?id=1eC4FKIvGeFQX93VBy5Sil2UkbmLiGXky
      /https?\:\/\/drive\.google\.com\/open\?id=([a-zA-Z0-9\_\-]+)/,

      // - https://drive.google.com/file/d/1eC4FKIvGeFQX93VBy5Sil2UkbmLiGXky/view
      /https?\:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9\_\-]+)/,

      // - https://docs.google.com/presentation/d/1eC4FKIvGeFQX93VBy5Sil2UkbmLiGXky/edit?usp=sharing
      /https?\:\/\/docs\.google\.com\/presentation\/d\/([a-zA-Z0-9\_\-]+)/,
    ];
  }

  async getThumbnailUrl_legacy() {
    return `https://drive.google.com/thumbnail?authuser=0&sz=w1280&id=${this.id}`;
  }

  async getThumbnailUrl() {
    return `https://drive.google.com/thumbnail?authuser=0&sz=w1280&id=${this.id}`;
  }
}
