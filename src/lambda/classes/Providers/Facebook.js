import VideoProvider from '../VideoProvider';
import fetch from '../proxiedFetch';

const { FACEBOOK_ACCESS_TOKEN } = process.env;

// https://www.facebook.com/backintimetheparty/videos/1588846901182916/

export default class Facebook extends VideoProvider {

    get providerName() {
        return 'facebook';
    }

    static get regex() {
        return [
            // - //www.facebook.com/backintimetheparty/videos/1588846901182916/
            /https?\:\/\/www\.facebook\.com\/[\w]+\/videos\/([0-9]+)/,

            // - //www.facebook.com/backintimetheparty/videos/description/1588846901182916/
            /https?\:\/\/www\.facebook\.com\/[\w]+\/videos[\w/-]+\/([0-9]+)/,
        ];
    }

    getThumbnail_asUrl() {
        // unfortunately the FACEBOOK_ACCESS_TOKEN is temporally and there is no way to get a quality thumbnail without a valid token.
        if (FACEBOOK_ACCESS_TOKEN) {
            return fetch(`https://graph.facebook.com/${this.getId()}?access_token=${FACEBOOK_ACCESS_TOKEN}&fields=title,description,updated_time,id,thumbnails`)
                .then(response => response.json())
                .then(json => json.thumbnails.data.filter(t => t.is_preferred)[0].uri)
        }

        return new Promise(resolve => resolve(`https://graph.facebook.com/${this.getId()}/picture`));
    }
}
