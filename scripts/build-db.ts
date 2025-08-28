import * as dotenv from 'dotenv';

dotenv.config();

import fs from 'node:fs';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const dbPath = path.resolve(__dirname, '..', 'src', 'db.json');

const { SITE_ID, NETLIFY_ACCESS_TOKEN } = process.env;

fetch(`https://api.netlify.com/api/v1/sites/${SITE_ID}?access_token=${NETLIFY_ACCESS_TOKEN}`)
  .then((response) => response.json())
  .then(({ capabilities: { functions } }) => {
    fs.writeFileSync(
      dbPath,
      JSON.stringify(
        {
          netlify: {
            capabilities: {
              functions,
            },
          },
        },
        undefined,
        2,
      ).concat('\n'),
    );
  })
  .catch((_error) => {
    fs.writeFileSync(dbPath, '{}');
  });
