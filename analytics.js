(function () {
  var script = document.currentScript;
  var domain = script && script.getAttribute('data-domain');
  if (!domain) return;
  if (navigator.doNotTrack === '1' || window.doNotTrack === '1') return;
  var s = document.createElement('script');
  s.defer = true;
  s.dataset.domain = domain;
  s.src = 'https://plausible.io/js/script.js';
  document.head.appendChild(s);
})();
