import $ from 'jquery';
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
    $('<img>')
        .on('load', () => {
            success.apply(this, arguments);
        })
        .on('error', () => {
            error.apply(this, arguments);
        })
        .attr('src', src);
};

const updateMarkdown = (title, imageUrl, videoUrl) => {
    const markdown =
        title === undefined ? '&nbsp;' :
        `<span class="token punctuation">[![<span class="token attr-value">${title}</span>](<span class="token attr-value">${imageUrl}</span>)](<span class="token attr-value">${videoUrl}</span> "<span class="token attr-value">${title}</span>")</span>`
    ;

    $('.markdown').toggleClass('tooltipped', title !== undefined);
    $('.markdown').attr('data-clipboard-text', $('.markdown code').html(markdown).text());
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
        used = `~ ${Math.round(used / 3600)}`;
        included /= 3600;
        unit = 'hours';
    }


    $(`.donations .${functionType} .progress > div`).attr('style', `--percentage: ${percentage};`);
    $(`.donations .${functionType} small`).text(`${used} / ${included} ${unit}`);
}

$.getJSON({
    url: `${lambdaUrl}/netlify` 
})
.done((data) => {
    if (data.error !== true) {
        updateQuota(data, 'invocations');
        updateQuota(data, 'runtime');
        $('.donations').show();
    }
});

$('form').on('submit', function(e) {
    e.preventDefault();

    NProgress.start();

    const $form = $(this);

    const title = $form.find('[name="title"]').val();
    const videoUrl = $form.find('[name="url"]').val();
    const jsonUrl = `${lambdaUrl}/image-json?url=${videoUrl}`;
    const imageUrl = `${lambdaUrl}/image?url=${videoUrl}`;

    if (videoUrl_memo === videoUrl) {
        updateMarkdown(title, imageUrl, videoUrl);
        NProgress.done();
        return false;
    }

    videoUrl_memo = videoUrl;

    $form.find('[name="url"] ~ img').attr('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
    $('.preview img').attr('src', imageLoading);
    updateMarkdown();

    $.getJSON({
        url: jsonUrl
    })
    .done((data) => {
        loadImage(data.base64, () => {
            NProgress.done();
            $form.find('[name="url"] ~ img').attr('src', videoIcons[data.provider]);
            $('.preview img').attr('src', data.base64);
            updateMarkdown(title, imageUrl, videoUrl);
        });
    })
    .fail(() => {
        loadImage(imageNotFound, () => {
            NProgress.done();
            videoUrl_memo = imageNotFound;
            $form.find('[name="url"] ~ img').attr('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
            $('.preview img').attr('src', imageNotFound);
            updateMarkdown();
        });
    });
});
