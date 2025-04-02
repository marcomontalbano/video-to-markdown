import { v2 as cloudinary } from 'cloudinary';
import CryptoJS from 'crypto-js';
import type { Options } from '../types';
import type VideoProvider from '../videoWrapper/VideoProvider';

const { USE_HIGH_QUALITY = false } = process.env;

// const search = (providerName, videoId) =>
//   cloudinary.search
//     .expression(`resource_type:"image" AND folder="video_to_markdown/images" AND filename="${providerName}-${videoId}"`)
//     .sort_by('uploaded_at', 'desc')
//     .max_results(30)
//     .execute();

const useHighQuality = () => USE_HIGH_QUALITY === 'true';

const QUALITY = {
  NTSC: 240,
  NHD: 360,
  SD: 480,
  HD: 720,
  FHD: 1080,
  QHD: 1440,
  UHD4K: 2160,
};

async function create(source: string, video: VideoProvider, options?: Options) {
  const highQualitySize = QUALITY.HD;
  const lowQualitySize = QUALITY.SD;

  // https://cloudinary.com/documentation/image_transformations#adjusting_image_quality
  const highQuality = [{ height: highQualitySize }];

  const lowQuality = [
    { quality: 'auto:low' },
    { if: 'w_gt_h' },
    { height: lowQualitySize },
    { if: 'else' },
    { width: lowQualitySize },
    { if: 'end' },
  ];

  const overlayHeight = useHighQuality() ? '1.0' : (lowQualitySize / highQualitySize).toFixed(2).toString();
  const transformations = options?.showPlayIcon
    ? {
        overlay: `video_to_markdown:icons:${video.providerName}`,
        height: overlayHeight,
        flag: 'relative',
        gravity: 'center',
      }
    : {};
  const hash = CryptoJS.MD5(JSON.stringify(options)).toString(CryptoJS.enc.Hex);
  const cloudinaryOptions = {
    folder: 'video_to_markdown/images',
    public_id: `${video.providerName}--${video.getId()}-${hash}`,
    context: `url=${video.url}|provider=${video.providerName}`,
    secure: true,
    transformation: [...(useHighQuality() ? highQuality : lowQuality), { ...transformations }],
  };

  const cloudinaryResponse = await cloudinary.uploader.upload(source, cloudinaryOptions);

  return cloudinaryResponse;
}

export default {
  // search,
  create,
  useHighQuality,
};
