export function extractFrame(video: HTMLVideoElement | null, scale = 1): string | null {
  if (!video || video.src === '') {
    return null;
  }

  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth * scale;
  canvas.height = video.videoHeight * scale;
  canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
  const dataUrl = canvas.toDataURL();

  if (dataUrl === 'data:,') {
    return null;
  }

  return dataUrl;
}
