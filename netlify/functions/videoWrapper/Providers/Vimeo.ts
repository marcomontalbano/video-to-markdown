import VideoProvider from '../VideoProvider.js';

// https://vimeo.com/

export default class Vimeo extends VideoProvider {
  get providerName() {
    return 'vimeo';
  }

  get regex() {
    return [
      // - https://vimeo.com/263856289
      /https?\:\/\/vimeo\.com\/([0-9]+)/,

      // - https://vimeo.com/channels/staffpicks/287019927
      /https?\:\/\/vimeo\.com\/channels\/[\w]+\/([0-9]+)/,
    ];
  }

  getThumbnailUrl() {
    const endpoint = `https://vimeo.com/api/v2/video/${this.id}.json`;

    return fetch(endpoint)
      .then((response) => response.json())
      .then((json) => json[0].thumbnail_large.replace(/_[0-9]+.jpg/, '_720.jpg'));
  }
}
