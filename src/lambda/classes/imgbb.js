import { URLSearchParams } from 'url';

import fetch from './proxiedFetch';

const { IMGBB_API_KEY } = process.env;

export const create = image => {
    return fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: new URLSearchParams([['image', image]])
      })
        .then(response => response.json())
        .then(({
            data: {
                image: {
                    url: imgbbUrl 
                } = {}
            } = {}
        }) => imgbbUrl ? imgbbUrl : base64OrUrl);
};
