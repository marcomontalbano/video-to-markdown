const nodeFetch = require('node-fetch').default;
const HttpsProxyAgent = require('https-proxy-agent');

const { HTTP_PROXY, HTTPS_PROXY } = process.env;

const fetch = (url, options = {}) => {
  if (HTTP_PROXY) {
    options.agent = new HttpsProxyAgent(HTTP_PROXY);
  }

  return nodeFetch(url, options);
};

module.exports = fetch;
