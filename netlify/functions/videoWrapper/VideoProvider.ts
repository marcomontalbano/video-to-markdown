import type { Options } from '../types';

export default class VideoProvider {
  url: string;
  options: Options;

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
    return this.options.showPlayIcon;
  }

  log(key: string, value: unknown) {
    console.log(`${this.providerName}: [${key}] ${value}`);
  }

  getThumbnailUrl_legacy(): Promise<string | null> {
    return Promise.resolve(null);
  }

  getThumbnailUrl(): Promise<string | null> {
    return Promise.resolve(null);
  }

  constructor(url: string, options: Options = {}) {
    this.url = url;
    this.options = options;
  }
}
