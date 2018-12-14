Video to Markdown
=================

[![Build Status](https://travis-ci.org/marcomontalbano/video-to-markdown.svg?branch=master)](https://travis-ci.org/marcomontalbano/video-to-markdown)

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

- Youtube
- Facebook (low-quality)
- Dailymotion
- Vimeo
- Asciinema


## Hosting

If you want your own copy, just

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/marcomontalbano/video-to-markdown)


## Development stuff

To run the project locally, here’s what you’ll need:

### System Requirements

* [git](https://git-scm.com)
* [NodeJS](nodejs.org) 8 or greater
* [yarn](yarnpkg.com)

### Setup

`cd` into your local copy of the repository and run `yarn`

```
cd video-to-markdown
yarn
```

```
yarn start
```

This will start the client server on http://localhost:8080, and the netlify-lambda server on http://localhost:9000.

[netlify-lambda](https://github.com/netlify/netlify-lambda) isn’t required to deploy Lambda functions to Netlify, but it offers some handy features out of the box that make it quicker to get started, like the local dev server and nice defaults for transpiling and bundling functions in production.

The client server is configured to proxy `/.netlify` requests to the Lambda server (see [webpack.client.js](webpack.client.js)). This is the same behavior the site has when it’s deployed to Netlify.
