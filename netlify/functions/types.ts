import type { create } from './videoWrapper';
import type VideoProvider from './videoWrapper/VideoProvider';

export type ImageService = {
  // search: (providerName: string, videoId: string) => Promise<unknown>;
  create: (source: string, video: VideoProvider, options?: Options) => Promise<{ secure_url: string }>;
  useHighQuality: () => boolean;
};

export type Options = {
  showPlayIcon?: boolean;
  image?: string;
  ImageService?: ImageService;
};
