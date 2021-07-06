require('dotenv').config();

const fs = require('fs');
const path = require('path');

const fetch = require('../src/lambda/classes/proxiedFetch');
const dbPath = path.resolve(__dirname, '..', 'src', 'db.json');

const { SITE_ID, NETLIFY_ACCESS_TOKEN } = process.env;

fetch(`https://api.netlify.com/api/v1/sites/${SITE_ID}?access_token=${NETLIFY_ACCESS_TOKEN}`)
    .then(response => response.json())
    .then(({ capabilities: { functions } }) => {
        fs.writeFileSync(dbPath, JSON.stringify({
            netlify: {
                capabilities: {
                    functions
                }
            }
        }, undefined, 2));
    })
    .catch((error) => {
        fs.writeFileSync(dbPath, '{}');
    })
