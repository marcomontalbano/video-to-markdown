import { loadStats } from './web/netlify';
import { load as loadAnalytics } from './web/analytics';
// import { load as loadDisclaimer } from './web/disclaimer';
import { load as loadApp } from './web/app';

loadStats();
loadAnalytics();
// loadDisclaimer();
loadApp();
