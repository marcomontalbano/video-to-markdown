const fetch = require('./classes/proxiedFetch');

const { SITE_ID, NETLIFY_ACCESS_TOKEN } = process.env;

exports.handler = (event, context, callback) => {

    fetch(`https://api.netlify.com/api/v1/sites/${SITE_ID}?access_token=${NETLIFY_ACCESS_TOKEN}`)
        .then(response => response.json())
        .then(json => {
            callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    capabilities: {
                        functions: json.capabilities.functions
                    }
                }),
            });
        })
        .catch((error) => {
            callback(null, {
                statusCode: 200,
                body: JSON.stringify({ error: true })
            });
        });
        ;
};
