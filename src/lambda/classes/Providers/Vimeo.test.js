import Vimeo from './Vimeo';

describe('Vimeo', () => {
    it('"regex" must be correct.', () => {
        expect(Vimeo.getVideoId('https://vimeo.com/263856289')).toBe('263856289');
        expect(Vimeo.getVideoId('https://vimeo.com/channels/staffpicks/287019927')).toBe('287019927');
    });

    it('all methods must work.', () => {
        const url = 'https://vimeo.com/channels/staffpicks/287019927';
        const video = new Vimeo(url);

        // static methods
        expect(Vimeo.check(url)).toBe(true);

        // instance methods
        expect(video.getId()).toBe('287019927');
        expect(video.providerName).toBe('vimeo');
        expect(video.url).toBe(url);
    });
})
