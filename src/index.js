import Prism from 'prismjs';
import NProgress from 'nprogress';
import ClipboardJS from 'clipboard';

import imageNotFound from './images/not-found.jpg';
import imageLoading from './images/loading.jpg';

const lambdaUrl = `${location.protocol}//${location.host}/.netlify/functions`;
const enableFunctionUsageSummary = true;

const videoIcons = {
    dailymotion: require('./images/providers/dailymotion.png'),
    facebook: require('./images/providers/facebook.png'),
    vimeo: require('./images/providers/vimeo.png'),
    youtube: require('./images/providers/youtube.png'),
    asciinema: require('./images/providers/asciinema.png'),
    'google-drive': require('./images/providers/google-drive.png'),
};

NProgress.configure({
    parent: '.preview',
    showSpinner: false
});

new ClipboardJS('.markdown');

const loadImage = (src, success = () => { }, error = () => { }) => {
    const img = document.createElement('img');
    img.addEventListener('load', () => {
        success.apply(this, arguments);
    });

    img.addEventListener('error', () => {
        error.apply(this, arguments);
    });

    img.src = src;
};

const updateMarkdown = (() => {
    let imageUrl_memo, videoUrl_memo;

    return (title, imageUrl = imageUrl_memo, videoUrl = videoUrl_memo) => {

        if (title === undefined) {
            imageUrl_memo = undefined;
            videoUrl_memo = undefined;
        }

        imageUrl_memo = imageUrl ? imageUrl : imageUrl_memo;
        videoUrl_memo = videoUrl ? videoUrl : videoUrl_memo;

        const markdown =
            title === undefined ? '&nbsp;' :
                `<span class="token punctuation">[![<span class="token attr-value">${title}</span>](<span class="token attr-value">${imageUrl}</span>)](<span class="token attr-value">${videoUrl}</span> "<span class="token attr-value">${title}</span>")</span>`
            ;

        const markdownElement = document.querySelector('.markdown');
        const markdownCodeElement = markdownElement.querySelector('code');
        markdownCodeElement.innerHTML = markdown;
        markdownElement.classList.toggle('hint--top', title !== undefined);
        markdownElement.setAttribute('data-clipboard-text', markdownCodeElement.textContent);
    };
})();

loadImage(imageLoading);
loadImage(imageNotFound);

function updateQuota(data, functionType) {
    let used       = data.capabilities.functions[functionType].used;
    let included   = data.capabilities.functions[functionType].included;
    let unit       = data.capabilities.functions[functionType].unit;

    const percentage = (used / included * 100);

    if (unit === 'seconds') {
        const hours = Math.round(used / 3600);
        const minutes = Math.round(used / 60);
        used = hours >= 1 ? `~ ${hours}` : `${minutes} minutes`;
        included /= 3600;
        unit = 'hours';
    }

    document.querySelector(`.functions .${functionType} .progress > div`).style.setProperty('--percentage', percentage);
    document.querySelector(`.functions .${functionType} small`).textContent = `${used} / ${included} ${unit}`;
}

if (enableFunctionUsageSummary) {
    const { netlify } = require('./db.json');

    if (netlify) {
        updateQuota(netlify, 'invocations');
        updateQuota(netlify, 'runtime');
        document.querySelector('.functions').classList.remove('hidden');
    }
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

const loadErrorImage = (formElement) => {
    loadImage(imageNotFound, () => {
        NProgress.done();
        formElement.querySelector('[name="url"] ~ img').setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
        document.querySelector('.preview img').setAttribute('src', imageNotFound);
        updateMarkdown();
    });
}

let memoFormSubmit;
document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault();

    ga('send', 'event', {
        eventCategory: 'V2M',
        eventAction: 'convert'
    });

    NProgress.start();

    const formElement = e.currentTarget;

    const title = formElement.querySelector('[name="title"]').value;
    const videoUrl = formElement.querySelector('[name="url"]').value;
    const showPlayIcon = formElement.querySelector('[name="show-play-icon"]').checked;
    const newMemoFormSubmit = `${videoUrl}|${showPlayIcon}`;

    if (memoFormSubmit === newMemoFormSubmit) {
        updateMarkdown(title);
        NProgress.done();
        return false;
    }

    memoFormSubmit = newMemoFormSubmit;

    formElement.querySelector('[name="url"] ~ img').setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
    document.querySelector('.preview img').setAttribute('src', imageLoading);
    updateMarkdown();

    fetch(`${lambdaUrl}/image-json?showPlayIcon=${showPlayIcon}&url=${encodeURIComponent(videoUrl)}`).then(r => r.json())
        .then(data => {
            if (data.error) {
                return loadErrorImage(formElement);
            }

            loadImage(data.image, () => {
                NProgress.done();
                formElement.querySelector('[name="url"] ~ img').setAttribute('src', videoIcons[data.provider]);
                document.querySelector('.preview img').setAttribute('src', data.image);
                updateMarkdown(title, data.image, videoUrl);
            });
        })
        .catch(() => {
            loadErrorImage(formElement);
        });
});
