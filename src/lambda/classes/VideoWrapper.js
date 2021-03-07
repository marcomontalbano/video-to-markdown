export default class VideoWrapper {
    static get videoProviders() {
        return [
            require('./Providers/Dailymotion'),
            require('./Providers/Facebook'),
            require('./Providers/Youtube'),
            require('./Providers/Vimeo'),
            require('./Providers/Asciinema'),
            require('./Providers/GoogleDrive'),
            require('./Providers/Video'),
            require('./Providers/Loom'),
            require('./Providers/Wistia'),
            require('./Providers/Streamable'),
            require('./Providers/CleanShotCloud'),
        ];
    }

    static create(url, options) {
        const videoProvider = this.videoProviders.filter(vp => {
            return vp.default.check(url);
        });

        if (videoProvider.length !== 1) {
            throw new Error('VideoProvider not found.');
        }

        return new videoProvider[0].default(url, options);
    }
}
