import fetch from './proxiedFetch';

const { CLOUDINARY_CLOUD_NAME } = process.env;

export default class VideoProvider {
    static get regex() {}

    static check(url) {
        return this.getVideoId(url) ? true : false;
    }

    static getVideoId(url = '') {
        return this.regex
            .map(rx => {
                let [, id] = url.match(rx) || [];
                return id;
            })
            .filter(id => id)[0];
    }

    log(key, value) {
        console.log(`${this.providerName}: [${key}] ${value}`);
    }

    getId() {
        return this.constructor.getVideoId(this.url);
    }

    get providerName() {
        return this.constructor.name.toLowerCase();
    }

    getThumbnail_asUrl() {
        return new Promise()
    }

    getThumbnail_asBuffer() {
        return this.getThumbnail_asUrl()
            .then(url => {
                this.log('getThumbnail_asUrl', url);
                return this.fetchCloudinary(url)
            })
    }

    fetchCloudinary(url) {
        let fetchUrl = url;
        if (CLOUDINARY_CLOUD_NAME) {
            fetchUrl = `http://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/fetch/h_720/l_video_to_markdown:${this.providerName}_play,g_center/${encodeURIComponent(url)}`;
        }
        this.log('fetchCloudinary', fetchUrl);
        return fetch(fetchUrl)
            .then(response => response.buffer())
    }

    constructor(url) {
        if (!this.constructor.check(url)) {
            throw new Error(
                `Invalid url for ${this.providerName} provider.`
            );
        }

        this.url = url;
    }
}
