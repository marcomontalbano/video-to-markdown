import VideoProvider from '../VideoProvider.js';
import fetch from '../proxiedFetch.js';

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
      .then((response) => response.url)
      .then((redirectUrl) => {
        this.log('redirectUrl', redirectUrl);

        const searchParams = new URL(redirectUrl).searchParams;

        // GET /drives/{drive-id}/items/{item-id}/thumbnails
        const driveId = searchParams.get('cid');
        const itemId = searchParams.get('resId');
        const authkey = searchParams.get('authkey');

        if (driveId == null || itemId == null || authkey == null) {
          throw new Error('Link is not valid.');
        }

        // https://learn.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_list_thumbnails?view=odsp-graph-online
        const apiUrl = `https://api.onedrive.com/v1.0/drives/${driveId}/items/${itemId}/thumbnails?authkey=${authkey}`;
        this.log('apiUrl', apiUrl);
        return fetch(apiUrl);
      })
      .then((res) => res.json())
      .then((json) => {
        const [firstThumbnail] = json.value;

        if (firstThumbnail == null) {
          throw new Error('Cannot find a thumbnail.');
        }

        const { large, medium, small } = firstThumbnail;
        const thumbnailUrl = large?.url ?? medium?.url ?? small?.url;

        if (firstThumbnail == null) {
          throw new Error('Cannot find a thumbnail URL.');
        }

        this.log('thumbnailUrl', thumbnailUrl);

        return thumbnailUrl;
      });
  }
}
