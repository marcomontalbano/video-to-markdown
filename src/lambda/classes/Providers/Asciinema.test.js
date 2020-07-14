import Asciinema from './Asciinema';

describe('Asciinema', () => {
    it('"regex" must be correct.', () => {
        expect(Asciinema.getVideoId('https://asciinema.org/a/335480')).toBe('335480');
    });

    it('all methods must work.', () => {
        const url = 'https://asciinema.org/a/335480';
        const video = new Asciinema(url);

        // static methods
        expect(Asciinema.check(url)).toBe(true);

        // instance methods
        expect(video.getId()).toBe('335480');
        expect(video.providerName).toBe('asciinema');
        expect(video.url).toBe(url);
    });
})
