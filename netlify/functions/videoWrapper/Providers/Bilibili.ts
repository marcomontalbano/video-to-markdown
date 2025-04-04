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

  getThumbnailUrl_legacy() {
    return fetch(this.url)
      .then((response) => response.text())
      .then((html) => {
        const text = parse(html)?.querySelector('script[type="application/ld+json"]')?.innerHTML;

        if (text != null) {
          return JSON.parse(text) as unknown as Array<{ '@type': string; thumbnailUrl: string }>;
        }
      })
      .then((ldJson) => {
        return ldJson?.find((item) => item['@type'] === 'VideoObject')?.thumbnailUrl ?? null;
      });
  }

  async getThumbnailUrl() {
    const text = document.querySelector('script[type="application/ld+json"]')?.innerHTML;

    if (text != null) {
      try {
        const ldJson = JSON.parse(text) as unknown as Array<{ '@type': string; thumbnailUrl: string }>;
        const thumbnailUrl = ldJson.find((item) => item['@type'] === 'VideoObject')?.thumbnailUrl;
        return thumbnailUrl ?? null;
      } catch (error) {
        return null;
      }
    }

    return null;
  }
}
