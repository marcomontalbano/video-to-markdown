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

  check() {
    return !!this.getVideoId();
  }

  getVideoId(): string | null {
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

  getId() {
    return this.getVideoId();
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
    // if (!this.check()) {
    //   throw new Error(`Invalid url for ${this.providerName} provider.`);
    // }

    this.url = url;
    this.options = options;
  }
}
