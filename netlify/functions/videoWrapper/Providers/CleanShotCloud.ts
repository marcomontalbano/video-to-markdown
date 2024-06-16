import { parse } from 'node-html-parser';
import VideoProvider from '../VideoProvider.js';

// https://cleanshot.com/

export default class CleanShotCloud extends VideoProvider {
  get providerName() {
    return 'cleanshot-cloud';
  }

  get regex() {
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
}
