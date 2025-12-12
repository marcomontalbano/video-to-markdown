export const CURRENT_CONSENT_VERSION = 1;

/**
 * Check if user has valid consent for the current version
 */
export async function hasValidConsent(): Promise<boolean> {
  const { consentVersion } = await chrome.storage.local.get('consentVersion');
  return consentVersion === CURRENT_CONSENT_VERSION;
}

/**
 * Store consent approval for the current version
 */
export async function storeConsent(): Promise<void> {
  await chrome.storage.local.set({ consentVersion: CURRENT_CONSENT_VERSION });
}

/**
 * Open consent page in a new tab
 */
export async function openConsentPage(): Promise<void> {
  await chrome.tabs.create({
    url: chrome.runtime.getURL('src/consent/consent.html'),
    active: true,
  });
}
