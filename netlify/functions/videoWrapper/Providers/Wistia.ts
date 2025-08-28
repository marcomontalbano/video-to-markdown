import VideoProvider from '../VideoProvider.js';

// https://wistia.com/support/developers/oembed#an-example

export default class Wistia extends VideoProvider {
  get providerName() {
    return 'wistia';
  }

  get regex() {
    return [
      // - https://home.wistia.com/medias/e4a27b971d
      /https?:\/\/(?:[^.]+\.)?(?:wistia\.com|wi\.st)\/medias\/([a-zA-Z0-9_-]+)/,

      // - https://home.wistia.com/embed/iframe/e4a27b971d
      /https?:\/\/(?:[^.]+\.)?(?:wistia\.com|wistia\.net|wi\.st)\/embed\/[^/]+\/([a-zA-Z0-9_-]+)/,

      // - https://wistia.com/series/one-ten-one-hundred?wchannelid=z2vptfjlxk&wvideoid=donagpxtdr
      /https?:\/\/(?:[^.]+\.)?(?:wistia\.com|wi\.st)\/.*wvideoid=([a-zA-Z0-9_-]+)/,
    ];
  }

  needsCloudinary() {
    return false;
  }

  getThumbnailUrl() {
    const endpoint = `https://fast.wistia.com/oembed?url=http%3A%2F%2Fhome.wistia.com%2Fmedias%2F${this.id}`;

    return fetch(endpoint)
      .then((response) => response.json())
      .then<string>((json) => {
        const { thumbnail_url, player_color = '686560' } = json;
        const options = [
          this.options.showPlayIcon && 'image_play_button=1',
          `image_play_button_color=${player_color}EE`,
        ];

        return `${thumbnail_url}&${options.filter((elm) => elm).join('&')}`;
      });
  }
}
