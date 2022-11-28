import PeerTube from './PeerTube';

describe('PeerTube', () => {
  it('"regex" must be correct.', () => {
    expect(PeerTube.getVideoId('https://framatube.org/w/kkGMgK9ZtnKfYAgnEtQxbv?start=1s')).toBe(
      'kkGMgK9ZtnKfYAgnEtQxbv',
    );
  });

  it('all methods must work.', () => {
    const url = 'https://framatube.org/w/kkGMgK9ZtnKfYAgnEtQxbv?start=1s';
    const video = new PeerTube(url);

    // static methods
    expect(PeerTube.check(url)).toBe(true);

    // instance methods
    expect(video.getId()).toBe('kkGMgK9ZtnKfYAgnEtQxbv');
    expect(video.providerName).toBe('peertube');
    expect(video.url).toBe(url);
  });
});
