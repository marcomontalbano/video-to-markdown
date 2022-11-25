import Prism from 'prismjs';
import NProgress from 'nprogress';

import { load as loadMarkdown } from './markdown';
import Video from '../lambda/classes/Providers/Video';

import imageNotFound from '../images/not-found.jpg';
import imageLoading from '../images/loading.jpg';

const updateMarkdown = loadMarkdown();

const lambdaUrl = `${location.protocol}//${location.host}/.netlify/functions`;

const videoIcons = {
    'asciinema': require('../images/providers/asciinema.png'),
    'cleanshot-cloud': require('../images/providers/cleanshot-cloud.png'),
    'dailymotion': require('../images/providers/dailymotion.png'),
    'facebook': require('../images/providers/facebook.png'),
    'google-drive': require('../images/providers/google-drive.png'),
    'imgur': require('../images/providers/imgur.png'),
    'loom': require('../images/providers/loom.png'),
    'onedrive': require('../images/providers/onedrive.png'),
    'peertube': require('../images/providers/peertube.png'),
    'streamable': require('../images/providers/streamable.png'),
    'tiktok': require('../images/providers/tiktok.png'),
    'video': require('../images/providers/video.png'),
    'vimeo': require('../images/providers/vimeo.png'),
    'wistia': require('../images/providers/wistia.png'),
    'youtube': require('../images/providers/youtube.png'),
};

const domElements = {
    get formElement() { return document.querySelector('form') },
    get previewImage() { return document.querySelector('.preview img') },
    get providerImage() { return this.formElement.querySelector('[name="url"] ~ img') },
    get title() { return this.formElement.querySelector('[name="title"]').value },
    get url() { return this.formElement.querySelector('[name="url"]').value },
    get showPlayIcon() { return this.formElement.querySelector('[name="show-play-icon"]').checked },
};

const loadImage = (src, success = () => { }, error = () => { }) => {
    const img = new Image();

    const loadHandler = function() {
        success.apply(this, arguments);
    }

    const errorHandler = function() {
        error.apply(this, arguments);
    }

    img.addEventListener('load', loadHandler, { once: true });
    img.addEventListener('error', errorHandler, { once: true });

    img.src = src;
}

const loadLoadingImage = () => {
    loadImage(imageLoading, () => {
        domElements.providerImage.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
        domElements.previewImage.setAttribute('src', imageLoading);
        updateMarkdown();
    });
}

const loadErrorImage = () => {
    loadImage(imageNotFound, () => {
        NProgress.done();
        domElements.providerImage.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
        domElements.previewImage.setAttribute('src', imageNotFound);
        updateMarkdown();
    });
}

const imageJsonConverter = (title, videoUrl, showPlayIcon, image = '') => {
    fetch(`${lambdaUrl}/image-json`, {
        method: 'POST',
        body: new URLSearchParams([
            ['image', image],
            ['url', videoUrl],
            ['showPlayIcon', showPlayIcon],
        ])
      }).then(r => r.json())
        .then(data => {
            if (data.error) {
                return loadErrorImage();
            }

            loadImage(data.image, function() {
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
        if (!isNaN(video.duration)) {
            const rand = Math.round(Math.random() * video.duration * 1000) + 1;
            video.currentTime = rand / 1000;
        }
    }

    video.setAttribute('crossOrigin', 'anonymous');
    video.addEventListener('loadeddata', loadRandomFrame, false);
    video.addEventListener('error', loadErrorImage, false);
    video.addEventListener('seeked', () => {
        try {
            const context = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            imageJsonConverter(title, videoUrl, showPlayIcon, canvas.toDataURL('image/jpeg'));
        } catch (e) {
            loadErrorImage();
        }
    }, false);

    video.src = videoUrl;
};

export const load = () => {
    NProgress.configure({
        parent: '.preview',
        showSpinner: false
    });

    let memoFormSubmit;
    document.querySelector('form').addEventListener('submit', function (e) {
        e.preventDefault();
    
        NProgress.start();
    
        ga('send', 'event', {
            eventCategory: 'V2M',
            eventAction: 'convert',
            eventLabel: domElements.url
        });
    
        const newMemoFormSubmit = `${domElements.url}|${domElements.showPlayIcon}`;
        if (memoFormSubmit === newMemoFormSubmit) {
            updateMarkdown(domElements.title);
            NProgress.done();
            return false;
        }
    
        loadLoadingImage();
    
        memoFormSubmit = newMemoFormSubmit;
    
        if (Video.check(domElements.url)) {
            videoConverter(domElements.title, domElements.url, domElements.showPlayIcon);
        } else {
            imageJsonConverter(domElements.title, domElements.url, domElements.showPlayIcon);
        }
    });
}
