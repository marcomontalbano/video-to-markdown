import { parse } from 'node-html-parser';
import VideoProvider from '../VideoProvider.js';

// https://cleanshot.com/

export default class CleanShotCloud extends VideoProvider {
  get providerName() {
    return 'cleanshot-cloud';
  }

  get regex() {
    return [
      // - https://cln.sh/sllTrgqg
      /https?\:\/\/cln\.sh\/([a-zA-Z0-9]+)/,
    ];
  }

  needsCloudinary() {
    return false;
  }

  getThumbnailUrl_legacy() {
    return fetch(this.url)
      .then((response) => response.text())
      .then((html) => {
        return parse(html)?.querySelector('[property="og:image"]')?.getAttribute('content');
      })
      .then((image) => {
        if (this.options.showPlayIcon) {
          return image;
        }

        return image?.replace(/\/draw\(image\(.*\),position:center\)/, '').replace(/&?play=1/, '');
      })
      .then((image) => image ?? null);
  }

  async getThumbnailUrl() {
    const image = document.querySelector('[property="og:image"]')?.getAttribute('content');

    if (this.options.showPlayIcon) {
      return image ?? null;
    }

    return image?.replace(/\/draw\(image\(.*\),position:center\)/, '').replace(/&?play=1/, '') ?? null;
  }
}
