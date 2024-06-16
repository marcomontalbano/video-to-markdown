import VideoProvider from '../VideoProvider.js';

// https://www.loom.com/

export default class Loom extends VideoProvider {
  get providerName() {
    return 'loom';
  }

  get regex() {
    return [
      // - //www.loom.com/share/3d0b326f650749bbb1fa13895dcd6563
      /https?\:\/\/www\.loom\.com\/share\/([a-z0-9]+)/,
    ];
  }

  needsCloudinary() {
    return false;
  }

  getThumbnail_asVideoUrl() {
    const playIconSuffix = this.options.showPlayIcon ? 'with-play' : '00001';
    const gifImage = `https://cdn.loom.com/sessions/thumbnails/${this.getId()}-${playIconSuffix}.gif`;
    const jpgImage = `https://cdn.loom.com/sessions/thumbnails/${this.getId()}-${playIconSuffix}.jpg`;

    return fetch(gifImage).then((response) => (response.status === 200 ? response.url : jpgImage));
  }
}
