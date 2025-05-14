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

  async getThumbnailUrl() {
    const image = document.querySelector('[property="og:image"]')?.getAttribute('content');

    if (this.options.showPlayIcon) {
      return image ?? null;
    }

    return image?.replace(/\/draw\(image\(.*\),position:center\)/, '').replace(/&?play=1/, '') ?? null;
  }
}
