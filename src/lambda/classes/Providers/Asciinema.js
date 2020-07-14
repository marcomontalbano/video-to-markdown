import VideoProvider from '../VideoProvider';

// https://asciinema.org/

export default class Asciinema extends VideoProvider {

    get providerName() {
        return 'asciinema';
    }

    static get regex() {
        return [
            // - //asciinema.org/a/335480
            /https?\:\/\/asciinema\.org\/a\/([0-9]+)/
        ];
    }

    static get useCloudinary() {
        return false
    }

    getThumbnail_asVideoUrl() {
        return new Promise(resolve => resolve(`${this.url}.svg`));
    }
}
