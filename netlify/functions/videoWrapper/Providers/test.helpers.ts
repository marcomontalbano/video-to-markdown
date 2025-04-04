import { test } from 'uvu';
import { equal } from 'uvu/assert';
import type VideoProvider from '../VideoProvider';

export function createTest(
  Video: typeof VideoProvider,
  url: string,
  expectations: { isValid: boolean; id: string | null; providerName: string },
) {
  test(`expectations for the url: ${url}`, () => {
    const video = new Video(url);

    // static methods
    equal(video.valid, expectations.isValid, 'Expected "check()" to be deeply equal:');

    // instance methods
    equal(video.id, expectations.id, 'Expected "id" to be deeply equal:');
    equal(video.providerName, expectations.providerName, 'Expected "providerName" to be deeply equal:');
    equal(video.url, url, 'Expected "url" to be deeply equal:');
  });
}
