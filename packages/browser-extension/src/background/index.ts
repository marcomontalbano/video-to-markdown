// Background script for handling extension installation and consent flow
import { hasValidConsent, openConsentPage } from '../consent-manager.js';

chrome.runtime.onInstalled.addListener(async (details) => {
  const consentGiven = await hasValidConsent();

  if (!consentGiven) {
    await openConsentPage();
  }

  // Log installation details for debugging
  if (details.reason === 'install') {
    console.log('Extension installed - consent page opened');
  } else if (details.reason === 'update') {
    console.log('Extension updated to version', chrome.runtime.getManifest().version);
    if (!consentGiven) {
      console.log('Consent version mismatch - consent page opened');
    }
  }
});
