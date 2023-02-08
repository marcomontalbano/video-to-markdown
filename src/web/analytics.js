export const load = () => {
  document.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function (e) {
      typeof ga !== 'undefined' &&
        ga('send', 'event', {
          eventCategory: 'Outbound Link',
          eventAction: 'click',
          eventLabel: e.target.href,
        });
    });
  });
};
