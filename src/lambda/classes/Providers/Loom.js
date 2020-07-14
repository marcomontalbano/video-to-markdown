import VideoProvider from '../VideoProvider';
import fetch from '../proxiedFetch';

// https://www.loom.com/

export default class Loom extends VideoProvider {

    get providerName() {
        return 'loom';
    }

    static get regex() {
        return [
            // - //www.loom.com/share/3d0b326f650749bbb1fa13895dcd6563
            /https?\:\/\/www\.loom\.com\/share\/([a-z0-9]+)/
        ];
    }

    static get useCloudinary() {
        return false
    }

    getThumbnail_asVideoUrl() {
        const gifImage = `https://cdn.loom.com/sessions/thumbnails/${this.getId()}-with-play.gif`;
        const jpgImage = `https://cdn.loom.com/sessions/thumbnails/${this.getId()}-with-play.jpg`;

        return fetch(gifImage)
            .then(response => response.status === 200 ? response.url : jpgImage)
    }
}
