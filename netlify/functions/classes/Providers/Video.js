import VideoRegEx from './VideoRegEx.js';

import crypto from 'node:crypto';

export default class Video extends VideoRegEx {
  get providerName() {
    return 'video';
  }

  static getVideoId(url = '') {
    return super.getVideoId(url) ? crypto.createHash('md5').update(url).digest('hex') : undefined;
  }

  getThumbnail_asVideoUrl() {
    return Promise.resolve(this.options.image);
  }
}
