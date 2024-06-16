import type { Options } from '../types';

export default class VideoProvider {
  url: string;
  options: Options;

  static get regex(): RegExp[] {
    return [];
  }

  get providerName(): string | undefined {
    return undefined;
  }

  static check(url) {
    return !!this.getVideoId(url);
  }

  static getVideoId(url = ''): string | undefined {
    const id = this.regex
      .map((rx) => {
        const [, id] = url.match(rx) || [];
        return id;
      })
      .filter((id) => id)[0];

    if (typeof id === 'string') {
      return id.replaceAll('/', '--');
    }

    return id;
  }

  needsCloudinary() {
    return this.options.showPlayIcon;
  }

  log(key, value) {
    console.log(`${this.providerName}: [${key}] ${value}`);
  }

  getId() {
    return this.constructor.getVideoId(this.url);
  }

  getThumbnail_asVideoUrl(): Promise<string | null> {
    return new Promise(() => {});
  }

  getThumbnail_asUrl(): Promise<string | null> {
    return this.getThumbnail_asVideoUrl().then((videoUrl) => {
      if (videoUrl == null) {
        return null;
      }

      if (!this.needsCloudinary()) {
        return videoUrl;
      }

      return (
        this.options.ImageService?.create(videoUrl, this, {
          showPlayIcon: this.options.showPlayIcon,
        }).then((response) => response.secure_url) ?? null
      );
    });
  }

  constructor(url: string, options: Options = {}) {
    if (!this.constructor.check(url)) {
      throw new Error(`Invalid url for ${this.providerName} provider.`);
    }

    this.url = url;
    this.options = options;
  }
}
