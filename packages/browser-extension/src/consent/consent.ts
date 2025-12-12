import { storeConsent } from '../consent-manager.js';

const acceptButton = document.querySelector('#accept') as HTMLButtonElement;

acceptButton.addEventListener('click', async () => {
  acceptButton.disabled = true;
  acceptButton.textContent = 'Accepting...';

  try {
    await storeConsent();

    // Close this tab
    const currentTab = await chrome.tabs.getCurrent();
    if (currentTab?.id) {
      await chrome.tabs.remove(currentTab.id);
    }
  } catch (error) {
    console.error('Error storing consent:', error);
    acceptButton.disabled = false;
    acceptButton.textContent = 'Accept & Continue';
    alert('An error occurred. Please try again.');
  }
});
