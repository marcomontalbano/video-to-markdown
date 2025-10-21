import cloudinary from '../../netlify/functions/cloudinary/index.js';
import { create } from '../../netlify/functions/videoWrapper/index.js';

const isProduction = process.env.NODE_ENV === 'production';

const toError = (message: string, statusCode = 500): Response => {
  return new Response(
    JSON.stringify({
      error: true,
      message,
    }),
    {
      status: statusCode,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*',
      },
    },
  );
};

const toSuccess = (payload: Record<string, unknown>, statusCode = 200): Response => {
  return new Response(JSON.stringify(payload), {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': '*',
    },
  });
};

const toURLSearchParams = async (request: Request): Promise<URLSearchParams> => {
  const contentType = request.headers.get('Content-Type');
  if (request.method === 'POST' && contentType === 'application/x-www-form-urlencoded') {
    return new URLSearchParams(await request.text()) ?? new URLSearchParams();
  }

  return new URLSearchParams();
};

/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
  async fetch(request, _envv_ctxtx): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Methods': '*',
        },
      });
    }

    const urlSearchParams = await toURLSearchParams(request);

    const thumbnailUrl = urlSearchParams.get('thumbnailUrl');
    const thumbnailBase64 = urlSearchParams.get('thumbnailBase64');
    const id = urlSearchParams.get('id');
    const providerName = urlSearchParams.get('providerName');
    const url = urlSearchParams.get('url');
    const showPlayIcon = urlSearchParams.get('showPlayIcon');

    if (thumbnailUrl == null || id == null || providerName == null || url == null) {
      return toError('Missing params.', 422);
    }

    let video: Awaited<ReturnType<typeof create>>;

    try {
      video = await create(url, {
        showPlayIcon: urlSearchParams.get('showPlayIcon') === 'true',
        image: urlSearchParams.get('image') ?? undefined,
      });
    } catch (error) {
      return toError(error?.message, 422);
    }

    if (video == null) {
      return toError('Video not found.', 422);
    }

    if (!video.needsCloudinary()) {
      return toSuccess({
        providerName,
        url,
        generatedThumbnailUrl: thumbnailUrl,
      });
    }

    const generatedThumbnailUrl = await cloudinary
      .create(
        thumbnailBase64 ?? thumbnailUrl,
        { id, providerName, url },
        {
          showPlayIcon: showPlayIcon === 'true',
        },
      )
      .then((response) => response.secure_url)
      .catch((error) => {
        return toError(isProduction ? undefined : error.message, 422);
      });

    if (typeof generatedThumbnailUrl === 'string') {
      return toSuccess({
        providerName,
        url,
        generatedThumbnailUrl,
      });
    }

    return generatedThumbnailUrl;
  },
} satisfies ExportedHandler<Env>;
