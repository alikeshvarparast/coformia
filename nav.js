(function () {
  function initNav() {
    var header = document.querySelector('.gnav');
    var btn = document.querySelector('.nav-toggle');
    var nav = document.getElementById('site-nav');
    var backdrop = document.querySelector('.nav-backdrop');
    if (!btn || !nav || !header || btn.dataset.navBound) return;
    btn.dataset.navBound = '1';
    function setOpen(open) {
      header.classList.toggle('is-open', open);
      document.documentElement.classList.toggle('nav-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      if (backdrop) backdrop.hidden = !open;
      if (open) {
        var first = nav.querySelector('a');
        if (first) first.focus();
      } else {
        btn.focus();
      }
    }
    btn.addEventListener('click', function () { setOpen(!header.classList.contains('is-open')); });
    if (backdrop) backdrop.addEventListener('click', function () { setOpen(false); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('is-open')) setOpen(false);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNav);
  } else {
    initNav();
  }
})();
