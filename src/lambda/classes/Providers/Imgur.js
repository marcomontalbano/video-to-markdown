import VideoProvider from '../VideoProvider';

// https://imgur.com/

export default class Imgur extends VideoProvider {

    get providerName() {
        return 'imgur';
    }

    static get regex() {
        return [
            // - //imgur.com/VT1vCoz
            /https?\:\/\/imgur\.com\/([0-9A-Za-z]+)/
        ];
    }

    getThumbnail_asVideoUrl() {
        return new Promise(resolve => resolve(`${this.url}.jpg`));
    }
}
