function switchTab(tabId: number) {
  chrome.tabs.sendMessage(tabId, { action: 'checkPage' });
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

chrome.runtime.onMessage.addListener((message) => {
  const path = '../../images';
  const sizes = ['16', '32', '48', '128'];
  const iconSuffix = message.success === true ? '-active' : '-inactive';

  chrome.action.setIcon({
    path: sizes.reduce(
      (acc, size) =>
        Object.assign(acc, {
          [size]: `${path}/icon-${size}${iconSuffix}.png`,
        }),
      {} as Record<string, string>,
    ),
  });

  chrome.storage.session.set({ video: message.video });

  return true;
});
