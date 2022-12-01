import VideoProvider from '../VideoProvider.js';
import fetch from '../proxiedFetch.js';
import htmlMiner from 'html-miner';

// https://joinpeertube.org/

export default class PeerTube extends VideoProvider {
  get providerName() {
    return 'peertube';
  }

  static get regex() {
    return [
      // //framatube.org/w/kkGMgK9ZtnKfYAgnEtQxbv?start=1s
      /\/w\/([a-zA-Z0-9]+)/, // not so strong :(
    ];
  }

  getThumbnail_asVideoUrl() {
    return fetch(this.url)
      .then((response) => response.text())
      .then((html) => {
        const platform = htmlMiner(html, (arg) => arg.$('[property="og:platform"]').attr('content'));

        if (platform !== 'PeerTube') {
          throw new Error(`'og:platform' does not match PeerTube`);
        }

        return html;
      })
      .then((html) => htmlMiner(html, (arg) => arg.$('[property="og:image"]').attr('content')));
  }
}
