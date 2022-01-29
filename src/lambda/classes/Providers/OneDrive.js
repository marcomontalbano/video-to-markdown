import VideoProvider from '../VideoProvider';
import fetch from '../proxiedFetch';
import htmlMiner from 'html-miner'

// https://onedrive.live.com/

export default class OneDrive extends VideoProvider {

    get providerName() {
        return 'onedrive';
    }

    static get regex() {
        return [
            // - //1drv.ms/v/s!An21T-lhvYKSkFpqKTb4YeZpKfzC?e=iXCxja
            // - //1drv.ms/w/s!An21T-lhvYKSjgYmTepcasWnVldK?e=CH4HsI
            /https?\:\/\/1drv\.ms\/[\w]{1}\/s!([a-zA-Z0-9-]+)/
        ];
    }

    // https://storage.live.com/Items/9282BD61E94FB57D%212138%3ACustomThumbnailSource%2CHighRes%2CDefault?width=1280&height=720&authKey=%21AGopNvhh5mkp_MI

    getThumbnail_asVideoUrl() {
        return fetch(this.url)
            .then(response => response.text())
            .then(html => htmlMiner(html, arg => arg.$('[property="og:image"]').attr('content')))
    }
}
