Video to Markdown
=================

[![Test](https://github.com/marcomontalbano/video-to-markdown/actions/workflows/test.yaml/badge.svg)](https://github.com/marcomontalbano/video-to-markdown/actions/workflows/test.yaml)
[![Cloudinary](https://shields.io/badge/-Cloudinary-3448c5)](https://cloudinary.com/invites/lpov9zyyucivvxsnalc5/nfvt85kdqleszdah0hxq?t=default)
[![PayPal.me](https://img.shields.io/badge/paypal-donate-119fde.svg)](https://www.paypal.me/marcomontalbano)
[![Sponsor](https://img.shields.io/badge/-Sponsor-fafbfc?logo=GitHub%20Sponsors)](https://github.com/sponsors/marcomontalbano)

[![Netlify Status](https://api.netlify.com/api/v1/badges/545bbce5-8f34-4834-9e16-685a9990c987/deploy-status)](https://app.netlify.com/sites/video-to-markdown/deploys)

Add videos to your markdown files easier [starting from here](https://video-to-markdown.marcomontalbano.com/)!


## Why?

How often did you find yourself googling _¨How to embed a video in markdown?¨_

While its not possible to embed a video in markdown, the best and easiest way is to extract a frame from the video, add a layer with a play icon and link the video url on the image.

Speaking HTMLese, this is what you would do:

```html
<a href="{video-url}" title="Link Title"><img src="{image-url}" alt="Alternate Text" /></a>
```

that translates into markdown as:

```md
[![Alternate Text]({image-url})]({video-url} "Link Title")
```

To speed up the process I developped this tool that will do it for you.

You just need to paste the video url in the field above and you will get the markdown you need.


## Features

List of supported video providers:

- [x] Asciinema
- [x] CleanShot Cloud
- [x] Dailymotion
- [x] Facebook (low-quality)
- [x] Google Drive
- [x] Imgur
- [x] Loom
- [x] OneDrive
- [x] PeerTube
- [x] SharePoint
- [x] Streamable
- [x] TikTok
- [x] Vimeo
- [x] Wistia
- [x] Youtube


## A browser extension

Originally, this tool started as a simple website where you could paste a video URL and instantly get a nicely formatted
Markdown snippet with the video thumbnail and title.

But over time, we ran into limitations: many websites restrict access to their content from external services, which made
it harder to reliably fetch video metadata just from a pasted URL.

That’s why we moved to a browser extension.

By running directly in your browser, the extension can access video information from the page you’re currently viewing,
with your permission. This makes the tool:

- 🔍 More accurate — it works directly with the content you’re seeing
- ⚡ Faster — no need to copy and paste URLs

Just click the extension when you’re on a video page, and it will instantly generate the Markdown code for you — thumbnail included.

This change helps the service stay reliable, and super easy to use.

## Hosting

First of all you need to create a [Cloudinary] account (I'm using this service to generate and host images) so that you can copy your personal `CLOUDINARY_URL` from your dashboard. The url is something similar to `cloudinary://my_key:my_secret@my_cloud_name`.

Now you can easily deploy your own copy on Netlify.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/marcomontalbano/video-to-markdown)


## Development stuff

To run the project locally, here’s what you’ll need:

### Requirements

* [Cloudinary] account
* [Node.js](https://nodejs.org/) 22.14 or greater

### Setup

`cd` into your local copy of the repository and run `pnpm install`

```sh
cd video-to-markdown
pnpm install
```

```sh
cp .env.sample .env
# update the .env with proper values
```

* `CLOUDINARY_URL` ( **required** ) - this is the `API Environment variable` that you can get from your Cloudinary dashboard inside the **Account Details** section.
* `GA_TRACKING_ID` ( _optional_ ) - this is a Google Analytics Tracking ID. Can be used if you need to track page views and events.
* `NETLIFY_ACCESS_TOKEN` ( _optional_ ) - this a Netlify Access Token. In combination with the `SITE_ID` can be used to display the **API Usage** in the website.
* `SITE_ID` ( _optional_ ) - this the Netlify Site ID. In combination with the `NETLIFY_ACCESS_TOKEN` can be used to display the **API Usage** in the website.
* `USE_HIGH_QUALITY` ( _optional_ ) - this is a boolean flag. If `true`, the generated images will be stored in Contenful with hi-res quality (default to `false`)

```sh
pnpm dev

# http://localhost:8888
```

## Privacy

Google Analytics is used to record the following:

* [Basic visit data](https://support.google.com/analytics/answer/6004245?ref_topic=2919631).
* `referer` or `video url` to track api usage.

All images are generated via [Cloudinary] and stored in it.
In this way the generated images are cached so we can avoid to call Netlify functions again thus reducing the quota consumption.

By clicking on `convert to markdown` or consuming api you accept this terms & condition; no additional data is sent to the server.

[Cloudinary]: https://cloudinary.com/invites/lpov9zyyucivvxsnalc5/nfvt85kdqleszdah0hxq?t=default
