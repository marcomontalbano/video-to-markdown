import VideoWrapper from './VideoWrapper';

describe('VideoWrapper', () => {
    it('"create" method must instantiate the correct Video Provider.', () => {
        expect(VideoWrapper.create('https://www.dailymotion.com/video/x3ke49').providerName).toBe('dailymotion');
        expect(VideoWrapper.create('https://vimeo.com/263856289').providerName).toBe('vimeo');
        expect(VideoWrapper.create('https://www.youtube.com/watch?v=oRdzL2DX0yU').providerName).toBe('youtube');
        expect(VideoWrapper.create('https://www.facebook.com/backintimetheparty/videos/1588846901182916/').providerName).toBe('facebook');
    });
});
