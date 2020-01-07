import fetch from './proxiedFetch';
import * as imgbb from './imgbb';

const { CLOUDINARY_CLOUD_NAME, IMGBB_API_KEY } = process.env;

export default class VideoProvider {
    static get regex() {}

    static get useCloudinary() { return true }

    get providerName() { }

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

    getThumbnail_asVideoUrl() {
        return new Promise();
    }

    getThumbnail_asCloudinaryUrl() {
        return this.getThumbnail_asVideoUrl().then(url => this.getThumbnail_validateUrl(url));
    }

    getThumbnail_asImgbbUrl() {
        return this.getThumbnail_asCloudinaryUrl().then(cloudinaryUrl => imgbb.create(cloudinaryUrl));
    }

    getThumbnail() {
        return this.getThumbnail_asImgbbUrl()
            .then(url => {
                this.log('getThumbnail', url);

                return fetch(url).then(response => response.buffer()).then(buffer => ({ buffer, url }));
            })
    }

    getThumbnail_validateUrl(url) {
        if (this.constructor.useCloudinary && CLOUDINARY_CLOUD_NAME) {
            const cloudinaryPlayIcon = this.options.showPlayIcon ? `l_video_to_markdown:${this.providerName}_play,g_center/` : '';
            return `http://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/fetch/h_720/${cloudinaryPlayIcon}${encodeURIComponent(url)}`;
        }

        return url;
    }

    constructor(url, options) {
        if (!this.constructor.check(url)) {
            throw new Error(
                `Invalid url for ${this.providerName} provider.`
            );
        }

        this.url = url;
        this.options = options;
    }
}
