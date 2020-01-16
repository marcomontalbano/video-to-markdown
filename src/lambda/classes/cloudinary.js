import { v2 as cloudinary } from 'cloudinary';
import crypto from 'crypto';

export const search = (providerName, videoId) => cloudinary.search
    .expression(`resource_type:"image" AND folder="video_to_markdown/images" AND filename="${providerName}-${videoId}"`)
    .sort_by('uploaded_at', 'desc')
    .max_results(30)
    .execute();

export const create = (source, video, options = {}) => new Promise((resolve, reject) => {
    const transformations = options.showPlayIcon ? { overlay: `video_to_markdown:icons:${video.providerName}`, gravity: 'center' } : {};
    const hash = crypto.createHash('md5').update(JSON.stringify(options)).digest('hex');

    cloudinary.uploader.upload(source, {
            folder: 'video_to_markdown/images',
            public_id: `${video.providerName}--${video.getId()}-${hash}`,
            context: `url=${video.url}`,
            secure: true,
            transformation: [
                { height: 720 },
                { ...transformations }
            ]
        }, (error, result) => {
            if (error) {
                return reject(error);
            }

            resolve(result);
        }
    );
});

export default {
    search,
    create
};
