export const load = () => {
  for (const anchorElement of document.querySelectorAll('a')) {
    anchorElement.addEventListener('click', (e) => {
      typeof ga !== 'undefined' &&
        ga('send', 'event', {
          eventCategory: 'Outbound Link',
          eventAction: 'click',
          eventLabel: e.target.href,
        });
    });
  }
};
