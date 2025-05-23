// @ts-check

import Prism from 'prismjs';

import { load as loadAnalytics } from './web/analytics';
import { load as loadDisclaimer } from './web/disclaimer';
import { loadStats } from './web/netlify';

loadStats();
loadAnalytics();
loadDisclaimer();
