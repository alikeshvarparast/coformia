(function () {
  var HERO_BLOBS = 6;
  var BAND_VH = 3.25;
  var TONES = ['a', 'b', 'c', 'd', 'a', 'b'];

  function initWash() {
    var wash = document.querySelector('.ambient-wash');
    if (!wash || wash.dataset.parallaxBound) return;
    wash.dataset.parallaxBound = '1';

    var resizeTimer;

    function pageHeight() {
      return Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        window.innerHeight
      );
    }

    function addBlob(parent, cfg) {
      var outer = document.createElement('span');
      outer.className = 'ambient-blob ambient-blob--' + cfg.tone;
      var inner = document.createElement('span');
      inner.className = 'ambient-blob-motion';
      outer.appendChild(inner);
      outer.style.setProperty('--blob-x', cfg.x);
      outer.style.setProperty('--blob-y', cfg.y);
      outer.style.setProperty('--blob-s', cfg.s);
      parent.appendChild(outer);
    }

    function fillBand(topPx, vh, seed) {
      var band = document.createElement('div');
      band.className = 'ambient-band';
      band.style.top = topPx + 'px';
      band.style.height = vh + 'px';
      for (var n = 0; n < HERO_BLOBS; n++) {
        var k = seed * 17 + n * 29;
        addBlob(band, {
          tone: TONES[n],
          x: (4 + ((k * 41) % 92)).toFixed(1) + '%',
          y: (4 + ((k * 59) % 92)).toFixed(1) + '%',
          s: (72 + ((k * 19) % 44)).toFixed(1) + 'vmin',
        });
      }
      wash.appendChild(band);
    }

    function rebuildWash() {
      var vh = window.innerHeight || 800;
      var bandH = Math.max(vh, Math.round(vh * BAND_VH));
      var height = pageHeight();
      var max = Math.max(0, height - vh);
      var sections = Math.max(1, Math.ceil(height / bandH));

      wash.style.top = (-max) + 'px';
      wash.style.height = (max + height) + 'px';
      wash.innerHTML = '';

      var lead = Math.ceil(max / bandH);
      for (var i = 0; i < lead; i++) fillBand(i * bandH, bandH, i * 11 + 1);
      for (var s = 0; s < sections; s++) fillBand(max + s * bandH, bandH, lead + s * 11 + 3);
    }

    function applyScrollParallax() {
      var y = window.scrollY || document.documentElement.scrollTop || 0;
      wash.style.transform = 'translate3d(0, ' + y.toFixed(2) + 'px, 0)';
    }

    function scheduleRebuild() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        rebuildWash();
        applyScrollParallax();
      }, 120);
    }

    rebuildWash();
    applyScrollParallax();

    window.addEventListener('scroll', applyScrollParallax, { passive: true });
    window.addEventListener('resize', scheduleRebuild, { passive: true });
    window.addEventListener('load', scheduleRebuild);
  }

  function initNav() {
    var header = document.querySelector('.gnav');
    var btn = document.querySelector('.nav-toggle');
    var nav = document.getElementById('site-nav');
    if (!btn || !nav || !header || btn.dataset.navBound) return;
    btn.dataset.navBound = '1';
    function setOpen(open) {
      header.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    btn.addEventListener('click', function () { setOpen(!header.classList.contains('is-open')); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('is-open')) setOpen(false);
    });
  }

  function boot() {
    initWash();
    initNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
