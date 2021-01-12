import Prism from 'prismjs';
import NProgress from 'nprogress';

import * as netlify from './web/netlify';
import * as markdown from './web/markdown';

import imageNotFound from './images/not-found.jpg';
import imageLoading from './images/loading.jpg';

const lambdaUrl = `${location.protocol}//${location.host}/.netlify/functions`;

const videoIcons = {
    video: require('./images/providers/video.png'),
    dailymotion: require('./images/providers/dailymotion.png'),
    facebook: require('./images/providers/facebook.png'),
    vimeo: require('./images/providers/vimeo.png'),
    youtube: require('./images/providers/youtube.png'),
    asciinema: require('./images/providers/asciinema.png'),
    'google-drive': require('./images/providers/google-drive.png'),
    loom: require('./images/providers/loom.png'),
    wistia: require('./images/providers/wistia.png'),
    streamable: require('./images/providers/streamable.png'),
};

const domElements = {
    get formElement() { return document.querySelector('form') },
    get previewImage() { return document.querySelector('.preview img') },
    get providerImage() { return this.formElement.querySelector('[name="url"] ~ img') },
    get title() { return this.formElement.querySelector('[name="title"]').value },
    get url() { return this.formElement.querySelector('[name="url"]').value },
    get showPlayIcon() { return this.formElement.querySelector('[name="show-play-icon"]').checked },
};

netlify.loadStats();

NProgress.configure({
    parent: '.preview',
    showSpinner: false
});

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
        markdown.update();
    });
}

const loadErrorImage = () => {
    loadImage(imageNotFound, () => {
        NProgress.done();
        domElements.providerImage.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
        domElements.previewImage.setAttribute('src', imageNotFound);
        markdown.update();
    });
}

document.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function (e) {
        ga('send', 'event', {
            eventCategory: 'Outbound Link',
            eventAction: 'click',
            eventLabel: e.target.href
        });
    });
})

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
                markdown.update(title, videoUrl, data.image);
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

import Video from './lambda/classes/Providers/Video';

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
        markdown.update(domElements.title);
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

// handle disclaimer modal
const donationSection = document.querySelector('.container.donations');

function closeModal(event) {
    const isDonation = event.target.closest('.donations');
    const isClose = isDonation && event.target.matches('.close');

    if (isClose || !isDonation) {
        document.body.classList.remove('modal');
        window.scrollTo(0, 0);
        sessionStorage.setItem('prompt-donation', 'false');
    }
}

if (sessionStorage.getItem('prompt-donation') !== 'false') {
    document.body.classList.add('modal');

    document.addEventListener('click', closeModal)

    setTimeout(() => {
        const outFromTop = donationSection.offsetTop - window.pageYOffset < 0;
        const outFromBottom = (donationSection.offsetTop + donationSection.offsetHeight) > window.innerHeight;
        if (outFromTop || outFromBottom) {
            window.scrollTo(0, donationSection.offsetTop);
        }
    }, 100)
}
