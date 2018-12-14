import Asciinema from './Asciinema';

describe('Asciinema', () => {
    it('"regex" must be correct.', () => {
        expect(Asciinema.getVideoId('https://asciinema.org/a/113463')).toBe('113463');
    });

    it('all methods must work.', () => {
        const url = 'https://asciinema.org/a/113463';
        const video = new Asciinema(url);

        // static methods
        expect(Asciinema.check(url)).toBe(true);

        // instance methods
        expect(video.getId()).toBe('113463');
        expect(video.providerName).toBe('asciinema');
        expect(video.url).toBe(url);
    });
})
