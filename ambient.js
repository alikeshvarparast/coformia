(function () {
  var HERO_BLOBS = 8;
  var TONES = ['a', 'b', 'c', 'd', 'a', 'b', 'c', 'd'];

  function init() {
    var wash = document.querySelector('.ambient-wash');
    if (!wash) return;

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var blobs = [];
    var phases = [];
    var resizeTimer;

    function pageHeight() {
      return Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        window.innerHeight
      );
    }

    function addBlob(parent, cfg, motion) {
      var outer = document.createElement('span');
      outer.className = 'ambient-blob ambient-blob--' + cfg.tone + (cfg.faint ? ' ambient-blob--faint' : '');
      var inner = document.createElement('span');
      inner.className = 'ambient-blob-motion';
      outer.appendChild(inner);
      outer.style.setProperty('--blob-x', cfg.x);
      outer.style.setProperty('--blob-y', cfg.y);
      outer.style.setProperty('--blob-s', cfg.s);
      parent.appendChild(outer);
      if (motion) {
        blobs.push({ outer: outer, inner: inner });
        phases.push(cfg.phase || 0);
      }
    }

    function fillBand(topPx, vh, seed) {
      var band = document.createElement('div');
      band.className = 'ambient-band';
      band.style.top = topPx + 'px';
      band.style.height = vh + 'px';
      for (var n = 0; n < HERO_BLOBS; n++) {
        var k = seed * 8 + n;
        addBlob(band, {
          tone: TONES[n],
          x: (6 + ((k * 37) % 88)).toFixed(1) + '%',
          y: (6 + ((k * 53) % 88)).toFixed(1) + '%',
          s: (62 + ((k * 13) % 36)).toFixed(1) + 'vmin',
          phase: k * 0.7,
        }, true);
      }
      wash.appendChild(band);
    }

    function rebuildWash() {
      var vh = window.innerHeight || 800;
      var height = pageHeight();
      var max = Math.max(0, height - vh);
      var sections = Math.max(1, Math.ceil(height / vh));

      /* Park the strip above the viewport by the full scroll range.
         At scroll 0 the hero (placed at local y = max) sits on the first screen.
         translateY(+scroll) then slides colors down while the strip above keeps the view filled. */
      wash.style.top = (-max) + 'px';
      wash.style.height = (max + height) + 'px';
      wash.innerHTML = '';
      blobs = [];
      phases = [];

      var lead = Math.ceil(max / vh);
      for (var i = 0; i < lead; i++) fillBand(i * vh, vh, i + 1);
      for (var s = 0; s < sections; s++) fillBand(max + s * vh, vh, lead + s + 1);
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

    var start = performance.now();
    function tick(now) {
      if (!reduced) {
        var t = (now - start) * 0.001;
        blobs.forEach(function (b, idx) {
          var p = phases[idx] || 0;
          var amp = 220 + (idx % HERO_BLOBS) * 36;
          var mx = Math.sin(t * 0.95 + p) * amp;
          var my = Math.cos(t * 0.82 + p * 1.2) * amp;
          var mz = Math.sin(t * 0.7 + p) * 200;
          var rx = Math.sin(t * 0.55 + p) * 32;
          var ry = Math.cos(t * 0.6 + p) * 36;
          var sc = 1 + Math.sin(t * 0.48 + p) * 0.28;
          b.inner.style.transform =
            'translate3d(' + mx + 'px,' + my + 'px,' + mz + 'px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) scale(' + sc + ')';
        });
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
