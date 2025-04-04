import type { Options } from '../types.js';

// @ts-expect-error TODO: there're no envs in the content script
globalThis.process ??= { env: {} };

import * as videoProviders from './Providers/index.js';

export function create(url: string, options?: Options) {
  const videoProvider = Object.values(videoProviders).filter((vp) => {
    return new vp.default(url).valid;
  });

  if (videoProvider.length === 0) {
    return null;
    // throw new Error('VideoProvider not found.');
  }

  if (videoProvider.length > 1) {
    return null;
    // throw new Error(`More than one VideoProvider (${videoProvider.map((vp) => vp.default.name).join(', ')}).`);
  }

  return new videoProvider[0].default(url, options);
}
