import VideoProvider from '../VideoProvider.js';

// https://www.youtube.com/

export default class Youtube extends VideoProvider {
  get providerName() {
    return 'youtube';
  }

  get regex() {
    return [
      // - //www.youtube.com/watch?v=oRdzL2DX0yU
      /https?\:\/\/www\.youtube\.com\/watch\?v\=([a-zA-Z0-9\_\-]+)/,

      // - //m.youtube.com/watch?v=oRdzL2DX0yU
      /https?\:\/\/m\.youtube\.com\/watch\?v\=([a-zA-Z0-9\_\-]+)/,

      // - //youtu.be/oRdzL2DX0yU
      /https?\:\/\/youtu\.be\/([a-zA-Z0-9\_\-]+)/,

      // - //www.youtube.com/embed/oRdzL2DX0yU
      /https?\:\/\/www\.youtube\.com\/embed\/([a-zA-Z0-9\_\-]+)/,

      // - //youtube.com/embed/oRdzL2DX0yU
      /https?\:\/\/youtube\.com\/embed\/([a-zA-Z0-9\_\-]+)/,

      // - //gaming.youtube.com/watch?v=CLdvw87teRc
      /https?\:\/\/gaming\.youtube\.com\/watch\?v\=([a-zA-Z0-9\_\-]+)/,

      // - //music.youtube.com/watch?v=i3MKTm-49uI&feature=share
      /https?\:\/\/music\.youtube\.com\/watch\?v\=([a-zA-Z0-9\_\-]+)/,
    ];
  }

  getThumbnail_asVideoUrl() {
    const maxVideoImage = `https://i.ytimg.com/vi/${this.getId()}/maxresdefault.jpg`;
    const hqVideoImage = `https://i.ytimg.com/vi/${this.getId()}/hqdefault.jpg`;

    return fetch(maxVideoImage).then((response) => (response.status === 200 ? response.url : hqVideoImage));
  }
}
