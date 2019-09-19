import fetch from './proxiedFetch';

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
        return this.getThumbnail_asCloudinaryUrl().then(url => {
            return fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}&image=${this.getThumbnail_validateUrl(url)}`)
                .then(response => response.json())
                .then(json => json.data.image.url);
        });
    }

    getThumbnail_asBuffer() {
        return this.getThumbnail_asImgbbUrl()
            .then(url => {
                this.log('getThumbnail', url);

                return fetch(url).then(response => response.buffer());
            })
    }

    getThumbnail_validateUrl(url) {
        if (this.constructor.useCloudinary && CLOUDINARY_CLOUD_NAME) {
            return `http://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/fetch/h_720/l_video_to_markdown:${this.providerName}_play,g_center/${encodeURIComponent(url)}`;
        }

        return url;
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
