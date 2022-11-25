import Imgur from './Imgur';

describe('Imgur', () => {
    it('"regex" must be correct.', () => {
        expect(Imgur.getVideoId('https://imgur.com/VT1vCoz')).toBe('VT1vCoz');
    });

    it('all methods must work.', () => {
        const url = 'https://imgur.com/VT1vCoz';
        const video = new Imgur(url);

        // static methods
        expect(Imgur.check(url)).toBe(true);

        // instance methods
        expect(video.getId()).toBe('VT1vCoz');
        expect(video.providerName).toBe('imgur');
        expect(video.url).toBe(url);
    });
})
