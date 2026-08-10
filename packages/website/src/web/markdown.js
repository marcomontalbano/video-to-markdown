import ClipboardJS from 'clipboard';

/**
 * The markdown link title is wrapped in double quotes, so a title containing one would close it
 * too early. Backslashes are escaped first, otherwise the one we add here could be swallowed by
 * an existing escape.
 */
const escapeTitle = (title) => title.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

const update = (markdownElement) => {
  let videoUrl_memo;
  let imageUrl_memo;

  return (title, videoUrl = videoUrl_memo, imageUrl = imageUrl_memo) => {
    if (title === undefined) {
      videoUrl_memo = undefined;
      imageUrl_memo = undefined;
    }

    videoUrl_memo = videoUrl ? videoUrl : videoUrl_memo;
    imageUrl_memo = imageUrl ? imageUrl : imageUrl_memo;

    const markdown =
      title !== undefined && videoUrl && imageUrl
        ? `<span class="token punctuation">[![<span class="token attr-value">${title}</span>](<span class="token attr-value">${imageUrl}</span>)](<span class="token attr-value">${videoUrl}</span> "<span class="token attr-value">${escapeTitle(title)}</span>")</span>`
        : '&nbsp;';

    const markdownCodeElement = markdownElement.querySelector('code');
    markdownCodeElement.innerHTML = markdown;
    markdownElement.classList.toggle('hint--top', title !== undefined);
    markdownElement.setAttribute('data-clipboard-text', markdownCodeElement.textContent);
  };
};

export const load = () => {
  const markdownElement = document.querySelector('.markdown');

  new ClipboardJS(markdownElement);

  return update(markdownElement);
};
