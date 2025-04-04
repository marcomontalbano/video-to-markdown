import { parse } from 'node-html-parser';
import VideoProvider from '../VideoProvider.js';

// https://joinpeertube.org/

export default class PeerTube extends VideoProvider {
  get providerName() {
    return 'peertube';
  }

  get regex() {
    return [
      // https://framatube.org/w/kkGMgK9ZtnKfYAgnEtQxbv?start=1s
      /\/w\/([a-zA-Z0-9]+)/, // not so strong :(
    ];
  }

  getThumbnailUrl_legacy() {
    return fetch(this.url)
      .then((response) => response.text())
      .then((html) => {
        const platform = parse(html)?.querySelector('[property="og:platform"]')?.getAttribute('content');

        if (platform !== 'PeerTube') {
          throw new Error(`'og:platform' does not match PeerTube`);
        }

        return html;
      })
      .then((html) => {
        return parse(html)?.querySelector('[property="og:image:url"]')?.getAttribute('content');
      })
      .then((url) => url ?? null);
  }

  async getThumbnailUrl() {
    const platform = document.querySelector('[property="og:platform"]')?.getAttribute('content');

    if (platform !== 'PeerTube') {
      throw new Error(`'og:platform' does not match PeerTube`);
    }

    const image = document.querySelector('[property="og:image:url"]')?.getAttribute('content');

    return image ?? null;
  }
}
