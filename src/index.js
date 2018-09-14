import $ from 'jquery';
import Prism from 'prismjs';
import NProgress from 'nprogress';
import ClipboardJS from 'clipboard';

import imageNotFound from './images/not-found.jpg';
import imageLoading from './images/loading.jpg';

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

$('form').on('submit', function(e) {
    e.preventDefault();

    NProgress.start();

    const $form = $(this);

    const title = $form.find('[name="title"]').val();
    const videoUrl = $form.find('[name="url"]').val();
    const imageUrl = `${location.protocol}//${location.host}/.netlify/functions/image?url=${videoUrl}`;

    if (videoUrl_memo === videoUrl) {
        updateMarkdown(title, imageUrl, videoUrl);
        NProgress.done();
        return false;
    }

    videoUrl_memo = videoUrl;

    $('.preview img').attr('src', imageLoading);
    updateMarkdown();

    loadImage(imageUrl, () => {
        NProgress.done();
        $('.preview img').attr('src', imageUrl);
        updateMarkdown(title, imageUrl, videoUrl);
    }, () => {
        loadImage(imageNotFound, () => {
            NProgress.done();
            videoUrl_memo = imageNotFound;
            $('.preview img').attr('src', imageNotFound);
            updateMarkdown();
        });
    });
});
