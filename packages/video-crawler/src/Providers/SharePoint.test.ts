import { test } from 'uvu';

import SharePoint from './SharePoint.js';
import { createTest } from './test.helpers.js';

createTest(
  SharePoint,
  'https://z12d3-my.sharepoint.com/personal/modderabyss_z12d3_onmicrosoft_com/_layouts/15/stream.aspx?id=%2Fpersonal%2Fmodderabyss%5Fz12d3%5Fonmicrosoft%5Fcom%2FDocuments%2FPc%20Backup%2FDIY%2FPImicroscope1%2Emp4&ga=1&referrer=StreamWebApp%2EWeb&referrerScenario=AddressBarCopied%2Eview%2Eda220803%2Dbc1e%2D43d1%2Da128%2Db41fd343f265',
  {
    isValid: true,
    id: 'modderabyss_z12d3_onmicrosoft_com--_layouts--15--stream.aspx?id=%2Fpersonal%2Fmodderabyss%5Fz12d3%5Fonmicrosoft%5Fcom%2FDocuments%2FPc%20Backup%2FDIY%2FPImicroscope1%2Emp4&ga=1&referrer=StreamWebApp%2EWeb&referrerScenario=AddressBarCopied%2Eview%2Eda220803%2Dbc1e%2D43d1%2Da128%2Db41fd343f265',
    providerName: 'sharepoint',
  },
);

test.run();
