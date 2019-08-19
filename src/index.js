import Prism from 'prismjs';
import NProgress from 'nprogress';
import ClipboardJS from 'clipboard';

import imageNotFound from './images/not-found.jpg';
import imageLoading from './images/loading.jpg';

const lambdaUrl = `${location.protocol}//${location.host}/.netlify/functions`;

const videoIcons = {
    dailymotion: require('./images/providers/dailymotion.png'),
    facebook: require('./images/providers/facebook.png'),
    vimeo: require('./images/providers/vimeo.png'),
    youtube: require('./images/providers/youtube.png'),
    asciinema: require('./images/providers/asciinema.png'),
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

const updateMarkdown = (title, imageUrl, videoUrl) => {
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

loadImage(imageLoading);
loadImage(imageNotFound);

let videoUrl_memo;

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

fetch(`${lambdaUrl}/netlify`)
    .then(response => response.json())
    .then(data => {
        if (data.error !== true) {
            updateQuota(data, 'invocations');
            updateQuota(data, 'runtime');
            document.querySelector('.functions').classList.remove('hidden');
        }
    });

document.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function (e) {
        ga('send', 'event', {
            eventCategory: 'Outbound Link',
            eventAction: 'click',
            eventLabel: e.target.href
        });
    });
})

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
    const jsonUrl = `${lambdaUrl}/image-json?url=${encodeURIComponent(videoUrl)}`;
    const imageUrl = `${lambdaUrl}/image?url=${encodeURIComponent(videoUrl)}`;

    if (videoUrl_memo === videoUrl) {
        updateMarkdown(title, imageUrl, videoUrl);
        NProgress.done();
        return false;
    }

    videoUrl_memo = videoUrl;

    formElement.querySelector('[name="url"] ~ img').setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
    document.querySelector('.preview img').setAttribute('src', imageLoading);
    updateMarkdown();

    fetch(jsonUrl).then(r => r.json())
        .then(data => {
            loadImage(data.base64, () => {
                NProgress.done();
                formElement.querySelector('[name="url"] ~ img').setAttribute('src', videoIcons[data.provider]);
                document.querySelector('.preview img').setAttribute('src', data.base64);
                updateMarkdown(title, imageUrl, videoUrl);
            });
        })
        .catch(() => {
            loadImage(imageNotFound, () => {
                NProgress.done();
                videoUrl_memo = imageNotFound;
                formElement.querySelector('[name="url"] ~ img').setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
                document.querySelector('.preview img').setAttribute('src', imageNotFound);
                updateMarkdown();
            });
        })
        ;
});
