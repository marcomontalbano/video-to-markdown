import Loom from './Loom';

describe('Loom', () => {
    it('"regex" must be correct.', () => {
        expect(Loom.getVideoId('https://www.loom.com/share/3d0b326f650749bbb1fa13895dcd6563')).toBe('3d0b326f650749bbb1fa13895dcd6563');
    });

    it('all methods must work.', () => {
        const url = 'https://www.loom.com/share/3d0b326f650749bbb1fa13895dcd6563';
        const video = new Loom(url);

        // static methods
        expect(Loom.check(url)).toBe(true);

        // instance methods
        expect(video.getId()).toBe('3d0b326f650749bbb1fa13895dcd6563');
        expect(video.providerName).toBe('loom');
        expect(video.url).toBe(url);
    });
})
