import VideoProvider from '../VideoProvider.js';

// https://bilibili.tv/

export default class Bilibili extends VideoProvider {
  get providerName() {
    return 'bilibili';
  }

  get regex() {
    return [
      // - https://www.bilibili.tv/en/video/2048949558
      /https?:\/\/www\.bilibili\.tv\/.*\/video\/([a-zA-Z0-9]+)/,
      // - https://www.bilibili.com/video/BV1W7CTBTErP/
      /https?:\/\/www\.bilibili\.com\/video\/([a-zA-Z0-9]+)/,
    ];
  }

  needsCloudinary() {
    return true;
  }

  async getThumbnailUrl() {
    // bilibili.com
    const thumbnailUrl = (document.getElementById('wxwork-share-pic') as HTMLImageElement | null)?.src ?? null;

    if (thumbnailUrl != null) {
      return thumbnailUrl;
    }

    // bilibili.tv
    const text = document.querySelector('script[type="application/ld+json"]')?.innerHTML;

    if (text != null) {
      try {
        const ldJson = JSON.parse(text) as unknown as Array<{ '@type': string; thumbnailUrl: string }>;
        const thumbnailUrl = ldJson.find((item) => item['@type'] === 'VideoObject')?.thumbnailUrl;
        return thumbnailUrl ?? null;
      } catch (_error) {
        return null;
      }
    }

    return null;
  }
}
