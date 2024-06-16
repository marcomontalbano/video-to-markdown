import VideoProvider from '../VideoProvider.js';

// https://onedrive.live.com/

export default class OneDrive extends VideoProvider {
  get providerName() {
    return 'onedrive';
  }

  get regex() {
    return [
      // - //1drv.ms/v/s!An21T-lhvYKSkFpqKTb4YeZpKfzC?e=iXCxja
      /https?\:\/\/1drv\.ms\/[\w]{1}\/s!([a-zA-Z0-9-]+)/,

      // - //1drv.ms/v/c/1c827834532d42r1/ETAjK46wOQhKve5q-SzK5kMBvglqiXaAOVnbr7H2Phvve3?e=Qblvee
      /https?\:\/\/1drv\.ms\/[\w]{1}\/[\w]{1}\/([a-zA-Z0-9]+\/[a-zA-Z0-9-]+)/,
    ];
  }

  getThumbnail_asVideoUrl() {
    return fetch(this.url)
      .then(async (response) => ({
        url: response.url,
        text: await response.text(),
      }))
      .then(async ({ url: redirectUrl, text }) => {
        this.log('redirectUrl', redirectUrl);

        const searchParams = new URL(redirectUrl).searchParams;
        const driveId = searchParams.get('cid');
        const itemId = searchParams.get('resId');
        const authkey = searchParams.get('authkey');
        const redeem = searchParams.get('redeem');

        if (driveId == null || itemId == null || (authkey == null && redeem == null)) {
          throw new Error('Link is not valid.');
        }

        this.log('driveId', driveId);
        this.log('itemId', itemId);

        if (authkey != null) {
          this.log('auth', 'authkey is defined');
          // https://learn.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_list_thumbnails?view=odsp-graph-online
          const apiUrl = `https://api.onedrive.com/v1.0/drives/${driveId}/items/${itemId}/thumbnails?authkey=${authkey}`;
          this.log('apiUrl', apiUrl);

          return fetch(apiUrl);
        }

        if (redeem != null) {
          this.log('auth', 'authentication required');
          const [, appId] = text.match(/"clientId":"([\w-]+)"/) ?? [];
          this.log('appId', appId);
          const auth = await fetch('https://api-badgerp.svc.ms/v1.0/token', {
            headers: {
              accept: '*/*',
              'accept-language': 'en-US,en;q=0.9',
              'cache-control': 'private',
              'content-type': 'application/json;odata=verbose',
              priority: 'u=1, i',
              'sec-ch-ua': '"Not-A.Brand";v="99", "Chromium";v="124"',
              'sec-ch-ua-mobile': '?0',
              'sec-ch-ua-platform': '"macOS"',
              'sec-fetch-dest': 'empty',
              'sec-fetch-mode': 'cors',
              'sec-fetch-site': 'cross-site',
            },
            referrer: 'https://photos.onedrive.com/',
            referrerPolicy: 'strict-origin-when-cross-origin',
            body: JSON.stringify({ appId }),
            method: 'POST',
            mode: 'cors',
            credentials: 'omit',
          }).then((r) => r.json());

          const { authScheme, token } = auth;

          if (authScheme == null || token == null) {
            throw new Error('Cannot get a valid token.');
          }

          // https://learn.microsoft.com/en-us/onedrive/developer/rest-api/resources/driveitem?view=odsp-graph-online
          const apiUrl = `https://my.microsoftpersonalcontent.com/_api/v2.0/shares/u!${redeem}/driveitem/thumbnails`;
          this.log('apiUrl', apiUrl);

          return fetch(apiUrl, {
            headers: {
              accept: '*/*',
              'accept-language': 'en-US,en;q=0.9',
              authorization: `${capitalizeFirstLetter(authScheme)} ${token}`,
              'cache-control': 'max-age=0',
              'content-type': 'text/plain;charset=UTF-8',
              prefer: 'autoredeem',
              priority: 'u=1, i',
              'sec-ch-ua': '"Not-A.Brand";v="99", "Chromium";v="124"',
              'sec-ch-ua-mobile': '?0',
              'sec-ch-ua-platform': '"macOS"',
              'sec-fetch-dest': 'empty',
              'sec-fetch-mode': 'cors',
              'sec-fetch-site': 'cross-site',
            },
            referrer: 'https://photos.onedrive.com/',
            referrerPolicy: 'strict-origin-when-cross-origin',
            body: null,
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
          });
        }
      })
      .then((res) => {
        if (res == null) {
          throw new Error('Cannot elaborate the request.');
        }

        return res.json();
      })
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

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
