import { v2 as cloudinary } from 'cloudinary';
import crypto from 'node:crypto';

const { USE_HIGH_QUALITY = false } = process.env;

const search = (providerName, videoId) =>
  cloudinary.search
    .expression(`resource_type:"image" AND folder="video_to_markdown/images" AND filename="${providerName}-${videoId}"`)
    .sort_by('uploaded_at', 'desc')
    .max_results(30)
    .execute();

const useHighQuality = () => USE_HIGH_QUALITY === 'true';

const create = (source, video, options = {}) =>
  new Promise((resolve, reject) => {
    const highQualitySize = 720;
    const lowQualitySize = 500;

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
    const transformations = options.showPlayIcon
      ? {
          overlay: `video_to_markdown:icons:${video.providerName}`,
          height: overlayHeight,
          flag: 'relative',
          gravity: 'center',
        }
      : {};
    const hash = crypto.createHash('md5').update(JSON.stringify(options)).digest('hex');
    const cloudinaryOptions = {
      folder: 'video_to_markdown/images',
      public_id: `${video.providerName}--${video.getId()}-${hash}`,
      context: `url=${video.url}|provider=${video.providerName}`,
      secure: true,
      transformation: [...(useHighQuality() ? highQuality : lowQuality), { ...transformations }],
    };

    cloudinary.uploader.upload(source, cloudinaryOptions, (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });
  });

export default {
  search,
  create,
  useHighQuality,
};
