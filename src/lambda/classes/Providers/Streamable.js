import VideoProvider from '../VideoProvider';
import fetch from '../proxiedFetch';

// https://support.streamable.com/api-documentation

export default class Streamable extends VideoProvider {

    get providerName() {
        return 'streamable';
    }

    static get regex() {
        return [
            // - //streamable.com/1nvj5i
            /https?\:\/\/streamable\.com\/([a-z0-9]+)/
        ];
    }

    getThumbnail_asVideoUrl() {
        const endpoint = `https://api.streamable.com/oembed.json?url=https%3A%2F%2Fstreamable.com%2F${this.getId()}`;

        return fetch(endpoint)
            .then(response => response.json())
            .then(json => {
                const cdns = ['-west', '-east'];
                const thumbnail_url = `https:${json.thumbnail_url}?height=540`;

                const thumbnails = cdns.map(cdn => thumbnail_url.replace(new RegExp(cdns.join('|')), cdn))

                return Promise.all(thumbnails.map(tmb => fetch(tmb)))
            })
            .then(results => results.filter(result => result.status === 200))
            .then(results => results.shift())
            .then(result => result ? result.url : Promise.reject())
    }
}
