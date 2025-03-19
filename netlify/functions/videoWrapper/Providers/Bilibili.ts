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
    return fetch(this.url)
      .then((response) => response.text())
      .then((html) => {
        const text = parse(html)?.querySelector('script[type="application/ld+json"]')?.innerHTML;

        if (text != null) {
          return JSON.parse(text);
        }
      })
      .then((ldJson) => {
        return ldJson.find((item) => item['@type'] === 'VideoObject')?.thumbnailUrl;
      })
      .then((image) => image ?? null);
  }
}
