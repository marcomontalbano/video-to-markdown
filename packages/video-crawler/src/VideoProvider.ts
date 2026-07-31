import type { Options } from './types';

export default class VideoProvider {
  url: string;
  options: Options;

  private thumbnailUrl?: Promise<string | null>;
  private title?: Promise<string>;

  get regex(): RegExp[] {
    return [];
  }

  get providerName(): string | undefined {
    return undefined;
  }

  get valid() {
    return this.id != null;
  }

  get id(): string | null {
    const id = this.regex
      .map((rx) => {
        const [, id] = this.url.match(rx) || [];
        return id;
      })
      .filter((id) => id)[0];

    if (typeof id === 'string') {
      return id.replace(/\//g, '--');
    }

    return id ?? null;
  }

  needsCloudinary() {
    return this.options.showPlayIcon ?? false;
  }

  log(key: string, value: unknown) {
    console.log(`${this.providerName}: [${key}] ${value}`);
  }

  /**
   * Resolve the thumbnail url, at most once per instance: `getThumbnailBase64` needs it too and
   * providers may have to reach the network to find it.
   * Providers customize the lookup overriding `fetchThumbnailUrl`.
   */
  async getThumbnailUrl(): Promise<string | null> {
    this.thumbnailUrl ??= this.fetchThumbnailUrl();

    return this.thumbnailUrl;
  }

  protected async fetchThumbnailUrl(): Promise<string | null> {
    return Promise.resolve(null);
  }

  /**
   * Resolve the title, at most once per instance.
   * Providers customize the lookup overriding `fetchTitle`.
   */
  async getTitle(): Promise<string> {
    this.title ??= this.fetchTitle();

    return this.title;
  }

  protected async fetchTitle(): Promise<string> {
    return document.title;
  }

  async getThumbnailBase64(): Promise<string | null> {
    const url = await this.getThumbnailUrl();

    if (url == null) {
      return null;
    }

    return fetch(url)
      .then((response) => response.blob())
      .then(
        (blob) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result?.toString() ?? null);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          }),
      );
  }

  constructor(url: string, options: Options = {}) {
    this.url = url;
    this.options = options;
  }
}
