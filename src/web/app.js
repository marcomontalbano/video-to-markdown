import NProgress from 'nprogress';
import Prism from 'prismjs';

import { videoRegEx } from '../../netlify/functions/videoWrapper/videoRegEx';
import { load as loadMarkdown } from './markdown';

const imageLoading = new URL('../images/loading.jpg', import.meta.url);

const imageNotFound = new URL('../images/not-found.jpg', import.meta.url);

const updateMarkdown = loadMarkdown();

const lambdaUrl = `${location.protocol}//${location.host}/.netlify/functions`;

const videoIcons = {
  asciinema: new URL('../images/providers/asciinema.png?as=webp', import.meta.url),
  bilibili: new URL('../images/providers/bilibili.png?as=webp', import.meta.url),
  'cleanshot-cloud': new URL('../images/providers/cleanshot-cloud.png?as=webp', import.meta.url),
  dailymotion: new URL('../images/providers/dailymotion.png?as=webp', import.meta.url),
  facebook: new URL('../images/providers/facebook.png?as=webp', import.meta.url),
  'google-drive': new URL('../images/providers/google-drive.png?as=webp', import.meta.url),
  imgur: new URL('../images/providers/imgur.png?as=webp', import.meta.url),
  loom: new URL('../images/providers/loom.png?as=webp', import.meta.url),
  onedrive: new URL('../images/providers/onedrive.png?as=webp', import.meta.url),
  peertube: new URL('../images/providers/peertube.png?as=webp', import.meta.url),
  streamable: new URL('../images/providers/streamable.png?as=webp', import.meta.url),
  tiktok: new URL('../images/providers/tiktok.png?as=webp', import.meta.url),
  video: new URL('../images/providers/video.png?as=webp', import.meta.url),
  vimeo: new URL('../images/providers/vimeo.png?as=webp', import.meta.url),
  wistia: new URL('../images/providers/wistia.png?as=webp', import.meta.url),
  youtube: new URL('../images/providers/youtube.png?as=webp', import.meta.url),
};

const domElements = {
  get formElement() {
    return document.querySelector('form');
  },
  get previewImage() {
    return document.querySelector('.preview img');
  },
  get providerImage() {
    return this.formElement.querySelector('[name="url"] ~ img');
  },
  get title() {
    return this.formElement.querySelector('[name="title"]').value;
  },
  get url() {
    return this.formElement.querySelector('[name="url"]').value;
  },
  get showPlayIcon() {
    return this.formElement.querySelector('[name="show-play-icon"]').checked;
  },
};

const loadImage = (src, success = () => {}, error = () => {}) => {
  const img = new Image();

  const loadHandler = function (...args) {
    success.apply(this, args);
  };

  const errorHandler = function (...args) {
    error.apply(this, args);
  };

  img.addEventListener('load', loadHandler, { once: true });
  img.addEventListener('error', errorHandler, { once: true });

  img.src = src;
};

const loadLoadingImage = () => {
  loadImage(imageLoading, () => {
    domElements.providerImage.setAttribute(
      'src',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
    );
    domElements.previewImage.setAttribute('src', imageLoading);
    updateMarkdown();
  });
};

const loadErrorImage = () => {
  loadImage(imageNotFound, () => {
    NProgress.done();
    domElements.providerImage.setAttribute(
      'src',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
    );
    domElements.previewImage.setAttribute('src', imageNotFound);
    updateMarkdown();
  });
};

const imageJsonConverter = (title, videoUrl, showPlayIcon, image = '') => {
  fetch(`${lambdaUrl}/image-json-legacy`, {
    method: 'POST',
    body: new URLSearchParams([
      ['image', image],
      ['url', videoUrl],
      ['showPlayIcon', showPlayIcon],
    ]),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error || data.image == null) {
        return loadErrorImage();
      }

      loadImage(data.image, function () {
        NProgress.done();
        domElements.providerImage.setAttribute('src', videoIcons[data.provider]);
        domElements.previewImage.replaceWith(this);
        updateMarkdown(title, videoUrl, data.image);
      });
    })
    .catch(() => {
      loadErrorImage();
    });
};

const videoConverter = (title, videoUrl, showPlayIcon) => {
  const video = document.createElement('video');
  const canvas = document.createElement('canvas');

  const loadRandomFrame = () => {
    if (!Number.isNaN(video.duration)) {
      const rand = Math.round(Math.random() * video.duration * 1000) + 1;
      video.currentTime = rand / 1000;
    }
  };

  video.setAttribute('crossOrigin', 'anonymous');
  video.addEventListener('loadeddata', loadRandomFrame, false);
  video.addEventListener('error', loadErrorImage, false);
  video.addEventListener(
    'seeked',
    () => {
      try {
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        imageJsonConverter(title, videoUrl, showPlayIcon, canvas.toDataURL('image/jpeg'));
      } catch (e) {
        loadErrorImage();
      }
    },
    false,
  );

  video.src = videoUrl;
};

export const load = () => {
  NProgress.configure({
    parent: '.preview',
    showSpinner: false,
  });

  let memoFormSubmit;
  document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();

    NProgress.start();

    typeof ga !== 'undefined' &&
      ga('send', 'event', {
        eventCategory: 'V2M',
        eventAction: 'convert',
        eventLabel: domElements.url,
      });

    const newMemoFormSubmit = `${domElements.url}|${domElements.showPlayIcon}`;
    if (memoFormSubmit === newMemoFormSubmit) {
      updateMarkdown(domElements.title);
      NProgress.done();
      return false;
    }

    loadLoadingImage();

    memoFormSubmit = newMemoFormSubmit;

    if (videoRegEx.every((rx) => rx.test(domElements.url))) {
      videoConverter(domElements.title, domElements.url, domElements.showPlayIcon);
    } else {
      try {
        imageJsonConverter(domElements.title, domElements.url, domElements.showPlayIcon);
      } catch (e) {
        loadErrorImage();
      }
    }
  });
};
