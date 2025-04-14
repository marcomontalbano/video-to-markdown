import type { Event } from '../types.js';

/**
 * Background script for the extension.
 * This script runs in the background and listens for events from the browser.
 * It handles tab updates, tab creation, and tab activation events.
 * It sends messages to the content script to check the page and update the icon accordingly.
 */

function switchTab(tabId: number) {
  chrome.tabs
    .sendMessage<Event['checkPage']['message'], Event['checkPage']['response']>(tabId, { action: 'checkPage' })
    .then((response) => {
      if (response == null) {
        return;
      }

      const path = '../../images';
      const sizes = ['16', '32', '48', '128'];
      const iconSuffix = response.success === true ? '-active' : '-inactive';

      chrome.action.setIcon({
        path: sizes.reduce(
          (acc, size) =>
            Object.assign(acc, {
              [size]: `${path}/icon-${size}${iconSuffix}.png`,
            }),
          {} as Record<string, string>,
        ),
      });
    })
    .catch((error) => {
      void error;
    });
}

// When a page loads or is reloaded
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'complete') {
    switchTab(tabId);
  }
});

chrome.tabs.onCreated.addListener((tab) => {
  if (tab.status === 'complete' && tab.id != null) {
    switchTab(tab.id);
  }
});

chrome.tabs.onMoved.addListener((tabId, moveInfo) => {
  if (moveInfo.fromIndex !== moveInfo.toIndex) {
    switchTab(tabId);
  }
});

// When the user switches to another tab
chrome.tabs.onActivated.addListener((activeInfo) => {
  switchTab(activeInfo.tabId);
});
