import Facebook from './Facebook';

describe('Facebook', () => {
  it('"regex" must be correct.', () => {
    expect(Facebook.getVideoId('https://www.facebook.com/backintimetheparty/videos/1588846901182916/')).toBe(
      '1588846901182916',
    );
    expect(
      Facebook.getVideoId('https://www.facebook.com/backintimetheparty/videos/description/1588846901182916/'),
    ).toBe('1588846901182916');
  });

  it('all methods must work.', () => {
    const url = 'https://www.facebook.com/backintimetheparty/videos/1588846901182916/';
    const video = new Facebook(url);

    // static methods
    expect(Facebook.check(url)).toBe(true);

    // instance methods
    expect(video.getId()).toBe('1588846901182916');
    expect(video.providerName).toBe('facebook');
    expect(video.url).toBe(url);
  });
});
