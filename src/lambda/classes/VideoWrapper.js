export default class VideoWrapper {
  static get videoProviders() {
    return [
      require('./Providers/Asciinema'),
      require('./Providers/CleanShotCloud'),
      require('./Providers/Dailymotion'),
      require('./Providers/Facebook'),
      require('./Providers/GoogleDrive'),
      require('./Providers/Imgur'),
      require('./Providers/Loom'),
      require('./Providers/OneDrive'),
      require('./Providers/PeerTube'),
      require('./Providers/Streamable'),
      require('./Providers/TikTok'),
      require('./Providers/Video'),
      require('./Providers/Vimeo'),
      require('./Providers/Wistia'),
      require('./Providers/Youtube'),
    ];
  }

  static create(url, options) {
    const videoProvider = this.videoProviders.filter((vp) => {
      return vp.default.check(url);
    });

    if (videoProvider.length === 0) {
      throw new Error('VideoProvider not found.');
    }

    if (videoProvider.length > 1) {
      throw new Error(`More than one VideoProvider (${videoProvider.map((vp) => vp.default.name).join(', ')}).`);
    }

    return new videoProvider[0].default(url, options);
  }
}
