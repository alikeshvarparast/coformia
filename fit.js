/* fit.js — safety net for fit.css.
   fit.css sizes everything from the browser window, so most sections fit on
   their own. If a section is still taller than the window (a small or
   half-width browser window, large browser zoom, long text), this shrinks that
   section's content just enough to fit, and undoes it when the window grows.
   Runs again whenever the window is resized. Phones and very short windows
   keep normal scrolling. */
(function () {
  var MIN_SCALE = 0.62;
  var desktop = window.matchMedia('(min-width: 901px) and (min-height: 560px)');
  var supportsZoom = 'zoom' in document.documentElement.style;
  if (!supportsZoom) return;

  function navHeight() {
    var v = parseFloat(getComputedStyle(document.body).getPropertyValue('--nav-h'));
    return isNaN(v) ? 54 : v;
  }

  function fitAll() {
    var sections = document.querySelectorAll('main > section');
    var avail = window.innerHeight - navHeight();
    sections.forEach(function (sec, idx) {
      var inner = sec.querySelector(':scope > .wrap');
      if (!inner) return;
      inner.style.zoom = '';
      if (!desktop.matches) return;
      // sections that already stretch to the window (live demos) manage themselves
      if (sec.classList.contains('appview')) return;
      // the first section shares the screen with every bar above it
      var room = idx === 0 ? window.innerHeight - (sec.getBoundingClientRect().top + window.scrollY) : avail;
      var cs = getComputedStyle(sec);
      var pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
      var scale = 1;
      for (var i = 0; i < 4; i++) {
        var need = inner.getBoundingClientRect().height + pad;
        if (need <= room + 1) break;
        scale = Math.max(MIN_SCALE, scale * (room / need) - 0.005);
        inner.style.zoom = scale.toFixed(3);
        if (scale === MIN_SCALE) break;
      }
    });
  }


  /* section backgrounds: each section gets a tone, and blends from the
     previous section's colour at its top edge */
  function toneColours() {
    var root = document.documentElement;
    var theme = root.getAttribute('data-theme');
    var dark = theme === 'dark' || (theme !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    return dark
      ? { a: '#1B2130', b: '#232A3B', warm: '#2A241C', dark: '#0E1533' }
      : { a: '#F7F8FC', b: '#E9EDF7', warm: '#FBF4EC', dark: '#0E1533' };
  }
  function toneSections() {
    var secs = document.querySelectorAll('main > section');
    var light = ['a', 'b'], k = 0, prev = null;
    var colours = toneColours();
    secs.forEach(function (sec) {
      var t;
      if (sec.classList.contains('appview')) t = 'dark';
      else if (sec.id === 'founding' || sec.id === 'contact') t = 'warm';
      else { t = light[k % 2]; k++; }
      sec.setAttribute('data-tone', t);
      if (prev) sec.style.setProperty('--prev', colours[prev]);
      // a quick blend next to the dark app view, a long soft one between light tones
      sec.style.setProperty('--blend', (t === 'dark' || prev === 'dark') ? '28px' : 'clamp(70px, 14vh, 160px)');
      prev = t;
    });
  }
  toneSections();
  if (window.matchMedia) {
    var scheme = window.matchMedia('(prefers-color-scheme: dark)');
    if (scheme.addEventListener) scheme.addEventListener('change', toneSections);
  }

  /* each section's content eases in as it scrolls into view */
  if ('IntersectionObserver' in window && !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
    document.documentElement.classList.add('fx');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll('main > section').forEach(function (sec, i) { if (i === 0) sec.classList.add('in-view'); else io.observe(sec); });
  }

  var raf = 0;
  function schedule() { cancelAnimationFrame(raf); raf = requestAnimationFrame(fitAll); }

  window.addEventListener('resize', schedule);
  window.addEventListener('load', schedule);
  if (desktop.addEventListener) desktop.addEventListener('change', schedule);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
  document.addEventListener('DOMContentLoaded', schedule);
  schedule();
})();
