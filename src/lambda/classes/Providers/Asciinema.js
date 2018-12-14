import VideoProvider from '../VideoProvider';

// https://asciinema.org/

export default class Asciinema extends VideoProvider {

    get providerName() {
        return 'asciinema';
    }

    static get regex() {
        return [
            // - //asciinema.org/a/113463
            /https?\:\/\/asciinema\.org\/a\/([0-9]+)/
        ];
    }

    static get useCloudinary() {
        return false
    }

    getThumbnail_asUrl() {
        return new Promise(resolve => resolve(`${this.url}.png`));
    }
}
