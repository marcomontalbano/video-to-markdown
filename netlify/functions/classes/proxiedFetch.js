import nodeFetch from 'node-fetch';
import HttpsProxyAgent from 'https-proxy-agent';

const { HTTP_PROXY, HTTPS_PROXY } = process.env;

const fetch = (url, options = {}) => {
  if (HTTP_PROXY) {
    options.agent = new HttpsProxyAgent(HTTP_PROXY);
  }

  return nodeFetch(url, options);
};

export default fetch;
