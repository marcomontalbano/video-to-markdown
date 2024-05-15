import VideoProvider from '../VideoProvider.js';
import htmlMiner from 'html-miner';

// https://cleanshot.com/

export default class CleanShotCloud extends VideoProvider {
  get providerName() {
    return 'cleanshot-cloud';
  }

  static get regex() {
    return [
      // - //cln.sh/YRePNX
      /https?\:\/\/cln\.sh\/([a-zA-Z0-9]+)/,
    ];
  }

  needsCloudinary() {
    return false;
  }

  getThumbnail_asVideoUrl() {
    return fetch(this.url)
      .then((response) => response.text())
      .then((html) => htmlMiner(html, (arg) => arg.$('[property="og:image"]').attr('content')))
      .then((image) => {
        if (this.options.showPlayIcon) {
          return image;
        }

        return image.replace(/\/draw\(image\(.*\),position:center\)/, '');
      });
  }
}
