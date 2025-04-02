document.addEventListener('DOMContentLoaded', async () => {
  chrome.storage.session.get('video', (data) => {
    console.log('data', FormData);
    const img = document.querySelector('img');

    if (img) {
      img.src = data.video.thumbnailUrl;
    }
  });
});
