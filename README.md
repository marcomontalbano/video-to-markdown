Video to Markdown
=================

[![Test](https://img.shields.io/github/actions/workflow/status/marcomontalbano/video-to-markdown/test.yaml?style=for-the-badge)](https://github.com/marcomontalbano/video-to-markdown/actions/workflows/test.yaml)
[![Cloudinary](https://shields.io/badge/-Cloudinary-3448c5?style=for-the-badge)](https://cloudinary.com/invites/lpov9zyyucivvxsnalc5/nfvt85kdqleszdah0hxq?t=default)
&nbsp;&nbsp;&nbsp;
[![PayPal.me](https://img.shields.io/badge/paypal-donate-119fde.svg?style=for-the-badge)](https://www.paypal.me/marcomontalbano)
[![Sponsor](https://img.shields.io/badge/-Sponsor-fafbfc?logo=GitHub%20Sponsors&style=for-the-badge)](https://github.com/sponsors/marcomontalbano)

<!-- [![Chrome Web Store](https://img.shields.io/badge/-Chome%20Web%20Store-white?style=for-the-badge&logo=googlechrome&logoColor=white&color=%234285f4)](https://chromewebstore.google.com/detail/video-to-markdown/opnjdnjnjkhajckagfjchbgdfofflnhn)
[![Firefox add-on](https://img.shields.io/badge/-Firefox%20add%E2%80%93on-white?style=for-the-badge&logo=firefox&logoColor=white&color=%23ff7139)](https://addons.mozilla.org/firefox/addon/video-to-markdown) -->

[![Chrome Web Store](https://img.shields.io/badge/-Chrome%20Web%20Store-white?style=for-the-badge&logo=googlechrome&color=%23e3f2fd)](https://chromewebstore.google.com/detail/video-to-markdown/opnjdnjnjkhajckagfjchbgdfofflnhn)
[![Firefox add-on](https://img.shields.io/badge/-Firefox%20add%E2%80%93on-white?style=for-the-badge&logo=firefox&color=%23ffe0b2)](https://addons.mozilla.org/firefox/addon/video-to-markdown)


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
- [x] Bilibili
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

Just click the extension's "Generate" button when you’re on a video page, and it will instantly generate the Markdown code for you - thumbnail included.

This change helps the service stay reliable, and super easy to use.


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
cp ./packages/service/.env.sample ./packages/service/.env
# update the .env with proper values
```

* `CLOUDINARY_URL` ( **required** ) - this is the `API Environment variable` that you can get from your Cloudinary dashboard inside the **Account Details** section.

```sh
# update types
pnpm --filter service cf-typegen

# run the service
pnpm --filter service dev
```

```sh
# build the extension
BASE_URL=http://localhost:8787 pnpm --filter browser-extension build

# built extensions are available at:
# `./packages/browser-extension/dist-chrome.zip`
# `./packages/browser-extension/dist-firefox.zip`
```

```sh
# run the website
pnpm --filter website dev

# http://localhost:8080
```

## Terms and Privacy Policy

### Website: video-to-markdown.marcomontalbano.com

We anonymously track the number of visitors with Simple Analytics. No personal data is collected or stored.
> Simple Analytics is a privacy-friendly analytics tool that does not use cookies or collect personal data. It provides insights into website traffic without compromising user privacy.

This site does not use cookies.

We do not store any other data on our servers.

### Browser Extension: Video to Markdown (Chrome/Firefox)

When you use the extension's "Generate" button, the current video thumbnail and URL are sent to our backend for processing. Cloudinary may be involved in image generation depending on the specific operation required.
> Cloudinary is a cloud-based image and video management service that provides a comprehensive solution for managing and delivering images and videos. It offers features such as image and video upload, storage, transformation, optimization, and delivery through a global content delivery network (CDN).

The backend processes the data but does not store any of it.

No analytics, tracking scripts, or cookies are used by the extension itself.

No personal or usage data is collected, stored, or shared.

### Terms of Use

By using this service, you agree to the following terms:

* You are responsible for the content you upload and share.
* You will not use this service for any illegal or unauthorized purpose.
* We reserve the right to modify or discontinue the service at any time.

If you do not agree to these terms, please do not use this service.


[Cloudinary]: https://cloudinary.com/invites/lpov9zyyucivvxsnalc5/nfvt85kdqleszdah0hxq?t=default