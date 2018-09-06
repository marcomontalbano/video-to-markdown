import $ from 'jquery';
import Prism from 'prismjs';

import imageNotFound from './images/not-found.jpg';
import imageLoading from './images/loading.jpg';

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

loadImage(imageLoading);
loadImage(imageNotFound);

$('form').on('submit', function(e) {
    e.preventDefault();

    const $form = $(this);

    const url = $form.find('[name="url"]').val();
    const title = $form.find('[name="title"]').val();
    const imageUrl = `${location.protocol}//${location.host}/.netlify/functions/image?url=${url}`;

    $('.preview').addClass('loading');
    $('.preview img').attr('src', imageLoading);
    $('.markdown code').html('&nbsp;');

    loadImage(imageUrl, () => {
        $('.preview').removeClass('loading');
        $('.preview img').attr('src', imageUrl);
        $('.markdown code').html(
            `<span class="token punctuation">[![<span class="token attr-value">${title}</span>](<span class="token attr-value">${imageUrl}</span>)](<span class="token attr-value">${url}</span> "<span class="token attr-value">${title}</span>")</span>`
            // `[![${title}](${imageUrl})](${url} "${title}")`
        );
    }, () => {
        loadImage(imageNotFound, () => {
            $('.preview').removeClass('loading');
            $('.preview img').attr('src', imageNotFound);
            $('.markdown code').html('&nbsp;');
        });
    });
});
