import Streamable from './Streamable';

describe('Streamable', () => {
  it('"regex" must be correct.', () => {
    expect(Streamable.getVideoId('https://streamable.com/1nvj5i')).toBe('1nvj5i');
  });

  it('all methods must work.', () => {
    const url = 'https://streamable.com/1nvj5i';
    const video = new Streamable(url);

    // static methods
    expect(Streamable.check(url)).toBe(true);

    // instance methods
    expect(video.getId()).toBe('1nvj5i');
    expect(video.providerName).toBe('streamable');
    expect(video.url).toBe(url);
  });
});
