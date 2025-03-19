import { parse } from 'node-html-parser';
import VideoProvider from '../VideoProvider.js';

// https://bilibili.tv/

export default class Bilibili extends VideoProvider {
  get providerName() {
    return 'bilibili';
  }

  get regex() {
    return [
      // - https://www.bilibili.tv/en/video/2048949558
      /https?\:\/\/www\.bilibili\.tv\/.*\/video\/([a-zA-Z0-9]+)/,
    ];
  }

  needsCloudinary() {
    return true;
  }

  getThumbnail_asVideoUrl() {
    const a = fetch(this.url, { mode: 'no-cors', referrer: 'https://bilibili.tv/' }).then((response) =>
      response.headers.entries(),
    );
    a.then((b) => {
      this.log('headers', Array.from(b));
    });

    return fetch(this.url, { mode: 'no-cors', referrer: 'https://bilibili.tv/' })
      .then((response) => response.text())
      .then((html) => {
        this.log('html', html);
        const text = parse(html)?.querySelector('script[type="application/ld+json"]')?.innerHTML;

        if (text != null) {
          return JSON.parse(text);
        }

        return [];
      })
      .then((ldJson) => {
        return ldJson.find((item) => item['@type'] === 'VideoObject')?.thumbnailUrl;
      })
      .then((image) => image ?? null);
  }
}
