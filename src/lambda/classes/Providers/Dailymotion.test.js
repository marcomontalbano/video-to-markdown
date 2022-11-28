import Dailymotion from './Dailymotion';

describe('Dailymotion', () => {
  it('"regex" must be correct.', () => {
    expect(Dailymotion.getVideoId('https://www.dailymotion.com/video/x3ke49')).toBe('x3ke49');
    expect(Dailymotion.getVideoId('https://dai.ly/xxl8su')).toBe('xxl8su');
  });

  it('all methods must work.', () => {
    const url = 'https://www.dailymotion.com/video/x3ke49';
    const video = new Dailymotion(url);

    // static methods
    expect(Dailymotion.check(url)).toBe(true);

    // instance methods
    expect(video.getId()).toBe('x3ke49');
    expect(video.providerName).toBe('dailymotion');
    expect(video.url).toBe(url);
  });
});
