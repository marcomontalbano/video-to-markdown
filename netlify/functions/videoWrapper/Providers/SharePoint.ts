import VideoProvider from '../VideoProvider.js';

export default class SharePoint extends VideoProvider {
  get providerName() {
    return 'sharepoint';
  }

  get regex() {
    return [
      // - https://z12d3-my.sharepoint.com/:v:/g/personal/modderabyss_z12d3_onmicrosoft_com/Ea-3UaH8n3hNhgo6p0VgTYgB51AoAVw3KFwu6tIj-eb9vg?e=45ylpB
      // - https://z12d3-my.sharepoint.com/personal/modderabyss_z12d3_onmicrosoft_com/_layouts/15/stream.aspx?id=%2Fpersonal%2Fmodderabyss%5Fz12d3%5Fonmicrosoft%5Fcom%2FDocuments%2FPc%20Backup%2FDIY%2FPImicroscope1%2Emp4&ga=1&referrer=StreamWebApp%2EWeb&referrerScenario=AddressBarCopied%2Eview%2Eda220803%2Dbc1e%2D43d1%2Da128%2Db41fd343f265
      /https?\:\/\/[\w-]+\.sharepoint\.com\/personal\/(.*)/,
    ];
  }

  needsCloudinary() {
    return true;
  }

  async getThumbnailUrl() {
    const scripts = Array.from(document.querySelectorAll('script'));

    const script = scripts.find((script) => {
      return script.innerHTML.includes('var g_fileInfo = {') && script.innerHTML.includes('thumbnailUrl');
    });

    if (script?.innerHTML != null) {
      const thumbnailUrl = script.innerHTML.match(/"thumbnailUrl":"(.*?)"/)?.[1]?.replace(/\\u0026/g, '&');

      return thumbnailUrl ?? null;
    }

    return null;
  }
}
