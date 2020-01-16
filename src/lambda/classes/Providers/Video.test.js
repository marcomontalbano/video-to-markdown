import Video from './Video';

describe('Video', () => {
    it('"regex" must be correct.', () => {
        expect(Video.getVideoId('https://i.imgur.com/vhjwXMB.mp4')).toBe('f48ef897bfabed6334368c76e716f871');
        expect(Video.check('https://asciinema.org/a/113463')).toBe(false);
    });

    it('all methods must work.', () => {
        const url = 'https://i.imgur.com/vhjwXMB.mp4';
        const video = new Video(url);

        // static methods
        expect(Video.check(url)).toBe(true);

        // instance methods
        expect(video.getId()).toBe('f48ef897bfabed6334368c76e716f871');
        expect(video.providerName).toBe('video');
        expect(video.url).toBe(url);
    });
})
