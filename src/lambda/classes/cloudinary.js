import { v2 as cloudinary } from 'cloudinary';
import crypto from 'crypto';

const { USE_HIGH_QUALITY = false } = process.env;

const search = (providerName, videoId) => cloudinary.search
    .expression(`resource_type:"image" AND folder="video_to_markdown/images" AND filename="${providerName}-${videoId}"`)
    .sort_by('uploaded_at', 'desc')
    .max_results(30)
    .execute();

const useHighQuality = () => USE_HIGH_QUALITY == 'true';

const create = (source, video, options = {}) => new Promise((resolve, reject) => {

    // https://cloudinary.com/documentation/image_transformations#adjusting_image_quality
    const highQuality = [
        { height: 720 },
    ]
    const lowQuality = [
        { height: 540 },
        { quality: 'auto:eco' },
    ]

    const overlayHeight = useHighQuality() ? '1.0' : (lowQuality[0].height / highQuality[0].height).toFixed(2).toString();
    const transformations = options.showPlayIcon ? { overlay: `video_to_markdown:icons:${video.providerName}`, height: overlayHeight, flag: 'relative', gravity: 'center' } : {};
    const hash = crypto.createHash('md5').update(JSON.stringify(options)).digest('hex');
    const cloudinaryOptions = {
        folder: 'video_to_markdown/images',
        public_id: `${video.providerName}--${video.getId()}-${hash}`,
        context: `url=${video.url}`,
        secure: true,
        transformation: [
            ...(useHighQuality() ? highQuality : lowQuality),
            { ...transformations }
        ]
    };

    cloudinary.uploader.upload(source, cloudinaryOptions, (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve(result);
        }
    );
});

export default {
    search,
    create,
    useHighQuality
};
