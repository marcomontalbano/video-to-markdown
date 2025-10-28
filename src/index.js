// @ts-check

import 'prismjs';

import { load as loadDisclaimer } from './web/disclaimer';
import { loadStats } from './web/netlify';

loadStats();
loadDisclaimer();
