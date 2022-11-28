export default class VideoProvider {
  static get regex() {}

  get providerName() {}

  static check(url) {
    return this.getVideoId(url) ? true : false;
  }

  static getVideoId(url = '') {
    return this.regex
      .map((rx) => {
        let [, id] = url.match(rx) || [];
        return id;
      })
      .filter((id) => id)[0];
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

  getThumbnail_asVideoUrl() {
    return new Promise();
  }

  getThumbnail_asUrl() {
    return this.getThumbnail_asVideoUrl().then((videoUrl) => {
      if (!this.needsCloudinary()) {
        return videoUrl;
      }

      return this.options.ImageService.create(videoUrl, this, {
        showPlayIcon: this.options.showPlayIcon,
      }).then((response) => response.secure_url);
    });
  }

  constructor(url, options = {}) {
    if (!this.constructor.check(url)) {
      throw new Error(`Invalid url for ${this.providerName} provider.`);
    }

    this.url = url;
    this.options = options;
  }
}
