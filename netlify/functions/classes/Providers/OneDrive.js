import VideoProvider from '../VideoProvider';
import fetch from '../proxiedFetch';
import htmlMiner from 'html-miner';

// https://onedrive.live.com/

export default class OneDrive extends VideoProvider {
  get providerName() {
    return 'onedrive';
  }

  static get regex() {
    return [
      // - //1drv.ms/v/s!An21T-lhvYKSkFpqKTb4YeZpKfzC?e=iXCxja
      /https?\:\/\/1drv\.ms\/[\w]{1}\/s!([a-zA-Z0-9-]+)/,
    ];
  }

  getThumbnail_asVideoUrl() {
    return fetch(this.url)
      .then((response) => response.text())
      .then((html) => htmlMiner(html, (arg) => arg.$('[property="og:image"]').attr('content')));
  }
}
