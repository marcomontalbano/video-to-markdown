Video to Markdown
=================

[![Build Status](https://travis-ci.org/marcomontalbano/video-to-markdown.svg?branch=master)](https://travis-ci.org/marcomontalbano/video-to-markdown)
[![Beerpay](https://beerpay.io/marcomontalbano/video-to-markdown/badge.svg?style=beer)](https://beerpay.io/marcomontalbano/video-to-markdown)
[![Beerpay](https://img.shields.io/badge/make-wish-f95c5c.svg)](https://beerpay.io/marcomontalbano/video-to-markdown)
[![PayPal.me](https://img.shields.io/badge/paypal-donate-119fde.svg)](https://www.paypal.me/marcomontalbano)

[![Netlify Status](https://api.netlify.com/api/v1/badges/545bbce5-8f34-4834-9e16-685a9990c987/deploy-status)](https://app.netlify.com/sites/video-to-markdown/deploys)

Add videos to your markdown files easier - [https://video-to-markdown.netlify.com](https://video-to-markdown.netlify.com).


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

- [x] Youtube
- [x] Facebook (low-quality)
- [x] Dailymotion
- [x] Vimeo
- [x] Asciinema
- [x] Google Drive
- [x] Loom
- [x] Wistia


## Hosting

First of all you need to create a [Cloudinary] account (I'm using this service to generate and host images) so that you can copy your personal `CLOUDINARY_URL` from your dashboard. The url is something similar to `cloudinary://my_key:my_secret@my_cloud_name`.

Now you can easily deploy your own copy on Netlify.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/marcomontalbano/video-to-markdown)


## Development stuff

To run the project locally, here’s what you’ll need:

### Requirements

* [Cloudinary] account
* [Node.js](https://nodejs.org/) 10 or greater

### Setup

`cd` into your local copy of the repository and run `npm install`

```
cd video-to-markdown
npm install
```

```
npm start
```

This will start the client server on http://localhost:8080, and the netlify-lambda server on http://localhost:8081.

[netlify-lambda](https://github.com/netlify/netlify-lambda) isn’t required to deploy Lambda functions to Netlify, but it offers some handy features out of the box that make it quicker to get started, like the local dev server and nice defaults for transpiling and bundling functions in production.

The client server is configured to proxy `/.netlify` requests to the Lambda server (see [webpack.client.js](webpack.client.js)). This is the same behavior the site has when it’s deployed to Netlify.

## Privacy

Google Analytics is used to record the following:

* [Basic visit data](https://support.google.com/analytics/answer/6004245?ref_topic=2919631).
* `referer` or `video url` to track api usage.

All images are generated via [Cloudinary] and stored in it.
In this way the generated images are cached so we can avoid to call Netlify functions again thus reducing the quota consumption.

By clicking on `convert to markdown` or consuming api you accept this terms & condition; no additional data is sent to the server.

[Cloudinary]: https://cloudinary.com/invites/lpov9zyyucivvxsnalc5/nfvt85kdqleszdah0hxq
