import Youtube from './Youtube';

describe('Youtube', () => {
    it('"regex" must be correct.', () => {
        expect(Youtube.getVideoId('https://www.youtube.com/watch?v=oRdzL2DX0yU')).toBe('oRdzL2DX0yU');
        expect(Youtube.getVideoId('https://youtu.be/oRdzL2DX0yU')).toBe('oRdzL2DX0yU');
        expect(Youtube.getVideoId('https://www.youtube.com/embed/oRdzL2DX0yU')).toBe('oRdzL2DX0yU');
        expect(Youtube.getVideoId('https://youtube.com/embed/oRdzL2DX0yU')).toBe('oRdzL2DX0yU');
        expect(Youtube.getVideoId('https://gaming.youtube.com/watch?v=CLdvw87teRc')).toBe('CLdvw87teRc');
        expect(Youtube.getVideoId('https://gaming.youtube.com/watch?v=CLdvw87teRc&feature=share')).toBe('CLdvw87teRc');
        expect(Youtube.getVideoId('https://music.youtube.com/watch?v=i3MKTm-49uI&feature=share')).toBe('i3MKTm-49uI');
    });

    it('all methods must work.', () => {
        const url = 'https://www.youtube.com/watch?v=oRdzL2DX0yU';
        const video = new Youtube(url);

        // static methods
        expect(Youtube.check(url)).toBe(true);

        // instance methods
        expect(video.getId()).toBe('oRdzL2DX0yU');
        expect(video.providerName).toBe('youtube');
        expect(video.url).toBe(url);
    });
});
