import TikTok from './TikTok';

describe('TikTok', () => {
    it('"regex" must be correct.', () => {
        expect(TikTok.getVideoId('https://www.tiktok.com/@tiktok/video/6584647400055377158?is_copy_url=1&is_from_webapp=v1')).toBe('6584647400055377158');
        expect(TikTok.getVideoId('https://www.tiktok.com/@tiktok_it.1/video/6584731204698770693?is_copy_url=1&is_from_webapp=v1')).toBe('6584731204698770693');
        expect(TikTok.getVideoId('https://www.tiktok.com/@tiktok/video/6584647400055377158')).toBe('6584647400055377158');
    });

    it('all methods must work.', () => {
        const url = 'https://www.tiktok.com/@tiktok/video/6584647400055377158?is_copy_url=1&is_from_webapp=v1';
        const video = new TikTok(url);

        // static methods
        expect(TikTok.check(url)).toBe(true);

        // instance methods
        expect(video.getId()).toBe('6584647400055377158');
        expect(video.providerName).toBe('tiktok');
        expect(video.url).toBe(url);
    });
})
