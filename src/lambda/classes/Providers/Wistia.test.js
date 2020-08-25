import Wistia from './Wistia';

describe('Wistia', () => {
    it('"regex" must be correct.', () => {
        expect(Wistia.getVideoId('https://home.wistia.com/medias/e4a27b971d')).toBe('e4a27b971d');
        expect(Wistia.getVideoId('https://wistia.com/medias/e4a27b971d')).toBe('e4a27b971d');
        expect(Wistia.getVideoId('https://home.wistia.com/embed/iframe/e4a27b971d')).toBe('e4a27b971d');
        expect(Wistia.getVideoId('https://john.wistia.com/embed/iframe/e4a27b971d')).toBe('e4a27b971d');
        expect(Wistia.getVideoId('https://john.wistia.com/embed/playlists/e4a27b971d')).toBe('e4a27b971d');
        expect(Wistia.getVideoId('https://john.wi.st/embed/playlists/e4a27b971d')).toBe('e4a27b971d');
        expect(Wistia.getVideoId('https://home.wi.st/medias/e4a27b971d')).toBe('e4a27b971d');
        expect(Wistia.getVideoId('https://home.wi.st/medias/e4a27b971d')).toBe('e4a27b971d');
        expect(Wistia.getVideoId('https://wistia.com/series/one-ten-one-hundred?wchannelid=z2vptfjlxk&wvideoid=donagpxtdr')).toBe('donagpxtdr');
    });

    it('all methods must work.', () => {
        const url = 'https://home.wistia.com/medias/e4a27b971d';
        const video = new Wistia(url);

        // static methods
        expect(Wistia.check(url)).toBe(true);

        // instance methods
        expect(video.getId()).toBe('e4a27b971d');
        expect(video.providerName).toBe('wistia');
        expect(video.url).toBe(url);
    });
})
