import VideoProvider from '../VideoProvider.js';

// https://www.instagram.com/p/DW9Cni5jvXG/?img_index=1

export default class Instagram extends VideoProvider {
  private thumbnailUrl?: Promise<string | null>;

  get providerName() {
    return 'instagram';
  }

  get regex() {
    return [
      // - https://www.instagram.com/p/DW9Cni5jvXG/?img_index=1
      // - https://www.instagram.com/reel/DW9Cni5jvXG/
      // - https://www.instagram.com/reels/DbVBrmiMbie/
      // - https://www.instagram.com/tv/DW9Cni5jvXG/
      // - https://www.instagram.com/clicksam_/reel/DS-tAVniTqp/
      /https?:\/\/www\.instagram\.com\/(?:[\w.]+\/)?(?:p|reel|reels|tv)\/([a-zA-Z0-9_-]+)/,
    ];
  }

  needsCloudinary() {
    return true;
  }

  getThumbnailUrl() {
    // `getThumbnailBase64` asks for the thumbnail url again: fetching the page once is enough.
    this.thumbnailUrl ??= this.fetchThumbnailUrl();

    return this.thumbnailUrl;
  }

  private async fetchThumbnailUrl(): Promise<string | null> {
    // Instagram is a single page application: moving from a post to another one does not update
    // the `og:image` already rendered in the document. We re-fetch the current page — same origin,
    // so the request is authenticated — to read the one the server renders for this specific post.
    const freshImage = await fetch(this.url)
      .then((response) => response.text())
      .then((html) => new DOMParser().parseFromString(html, 'text/html'))
      .then((page) => page.querySelector('meta[property="og:image"]')?.getAttribute('content'))
      .catch(() => undefined);

    const image = freshImage ?? document.querySelector('meta[property="og:image"]')?.getAttribute('content');

    return image ?? null;
  }
}
