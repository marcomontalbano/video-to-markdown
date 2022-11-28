import OneDrive from './OneDrive';

describe('OneDrive', () => {
  it('"regex" must be correct.', () => {
    expect(OneDrive.getVideoId('https://1drv.ms/v/s!An21T-lhvYKSkFpqKTb4YeZpKfzC?e=iXCxja')).toBe(
      'An21T-lhvYKSkFpqKTb4YeZpKfzC',
    );
  });

  it('all methods must work.', () => {
    const url = 'https://1drv.ms/v/s!An21T-lhvYKSkFpqKTb4YeZpKfzC?e=iXCxja';
    const video = new OneDrive(url);

    // static methods
    expect(OneDrive.check(url)).toBe(true);

    // instance methods
    expect(video.getId()).toBe('An21T-lhvYKSkFpqKTb4YeZpKfzC');
    expect(video.providerName).toBe('onedrive');
    expect(video.url).toBe(url);
  });
});
