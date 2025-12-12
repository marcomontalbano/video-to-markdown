import { storeConsent } from '../consent-manager.js';

const acceptButton = document.querySelector('#accept') as HTMLButtonElement;
const declineButton = document.querySelector('#decline') as HTMLButtonElement;

acceptButton.addEventListener('click', async () => {
  acceptButton.disabled = true;
  declineButton.disabled = true;
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
    declineButton.disabled = false;
    acceptButton.textContent = 'Accept & Continue';
    alert('An error occurred. Please try again.');
  }
});

declineButton.addEventListener('click', async () => {
  acceptButton.disabled = true;
  declineButton.disabled = true;
  declineButton.textContent = 'Uninstalling...';

  try {
    await chrome.management.uninstallSelf({
      showConfirmDialog: true,
    });
  } catch (error) {
    console.error('Error uninstalling extension:', error);

    acceptButton.disabled = false;
    declineButton.disabled = false;
    declineButton.textContent = 'Decline & Uninstall';
  }
});
