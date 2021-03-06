import CleanShotCloud from './CleanShotCloud';

describe('CleanShotCloud', () => {
    it('"regex" must be correct.', () => {
        expect(CleanShotCloud.getVideoId('https://cln.sh/YRePNX')).toBe('YRePNX');
    });

    it('all methods must work.', () => {
        const url = 'https://cln.sh/YRePNX';
        const video = new CleanShotCloud(url);

        // static methods
        expect(CleanShotCloud.check(url)).toBe(true);

        // instance methods
        expect(video.getId()).toBe('YRePNX');
        expect(video.providerName).toBe('cleanshot-cloud');
        expect(video.url).toBe(url);
    });
})
