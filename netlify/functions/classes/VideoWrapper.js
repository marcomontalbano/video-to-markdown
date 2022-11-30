// @ts-check

export default class VideoWrapper {
  static getVideoProviders() {
    return Promise.all([
      import('./Providers/Asciinema.js'),
      import('./Providers/CleanShotCloud.js'),
      import('./Providers/Dailymotion.js'),
      import('./Providers/Facebook.js'),
      import('./Providers/GoogleDrive.js'),
      import('./Providers/Imgur.js'),
      import('./Providers/Loom.js'),
      import('./Providers/OneDrive.js'),
      import('./Providers/PeerTube.js'),
      import('./Providers/Streamable.js'),
      import('./Providers/TikTok.js'),
      import('./Providers/Video.js'),
      import('./Providers/Vimeo.js'),
      import('./Providers/Wistia.js'),
      import('./Providers/Youtube.js'),
    ]);
  }

  static async create(url, options) {
    const videoProviders = await this.getVideoProviders()
    const videoProvider = videoProviders.filter((vp) => {
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
