import VideoProvider from '../VideoProvider.js';

// https://www.instagram.com/p/DW9Cni5jvXG/?img_index=1

export default class Instagram extends VideoProvider {
  private page?: Promise<Document | null>;

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

  protected async fetchThumbnailUrl() {
    const freshImage = (await this.fetchPage())?.querySelector('meta[property="og:image"]')?.getAttribute('content');
    const image = freshImage ?? document.querySelector('meta[property="og:image"]')?.getAttribute('content');

    return image ?? null;
  }

  protected async fetchTitle() {
    const freshTitle = (await this.fetchPage())?.querySelector('meta[property="og:title"]')?.getAttribute('content');

    return freshTitle ?? document.title;
  }

  /**
   * Instagram is a single page application: moving from a post to another one does not update the
   * `og:` meta tags already rendered in the document. We re-fetch the current page — same origin,
   * so the request is authenticated — to read the ones the server renders for this specific post.
   * The page is fetched once and shared by every lookup.
   */
  private fetchPage(): Promise<Document | null> {
    this.page ??= fetch(this.url)
      .then((response) => response.text())
      .then((html) => new DOMParser().parseFromString(html, 'text/html'))
      .catch(() => null);

    return this.page;
  }
}
