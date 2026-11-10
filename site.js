(function () {
  function bindScrollProgress() {
    var bar = document.querySelector('#scroll-progress span');
    if (!bar) return;
    function tick() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var p = h > 0 ? window.scrollY / h : 0;
      bar.style.width = (p * 100).toFixed(2) + '%';
    }
    window.addEventListener('scroll', tick, { passive: true });
    tick();
  }

  function armFrame(frame) {
    var pending = frame.getAttribute('data-src');
    if (!pending || frame.getAttribute('src')) return;
    function load(url) {
      frame.setAttribute('src', url);
      var btn = frame.parentElement && frame.parentElement.querySelector('.load-demo');
      if (btn) btn.hidden = true;
    }
    var narrow = window.matchMedia && window.matchMedia('(max-width: 899px)').matches;
    if (narrow) {
      var btn = frame.parentElement && frame.parentElement.querySelector('.load-demo');
      if (btn) btn.addEventListener('click', function () { load(pending); });
      return;
    }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        if (entries.some(function (e) { return e.isIntersecting; })) {
          load(pending);
          io.disconnect();
        }
      }, { rootMargin: '200px' });
      io.observe(frame);
    } else {
      load(pending);
    }
  }

  function bindDemoTabs() {
    document.querySelectorAll('iframe[data-src]').forEach(armFrame);
    var root = document.getElementById('home-demos');
    if (!root) return;
    var frame = document.getElementById('demo-frame');
    var tabs = root.querySelectorAll('.demo-tabs button[role="tab"]');
    if (!frame || !tabs.length) return;
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var product = tab.getAttribute('data-product');
        if (!product) return;
        tabs.forEach(function (t) {
          t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
        });
        frame.src = '/workbench.html?product=' + encodeURIComponent(product) + '&embed=1';
        var btn = frame.parentElement && frame.parentElement.querySelector('.load-demo');
        if (btn) btn.hidden = true;
      });
    });
  }

  bindScrollProgress();
  bindDemoTabs();
})();
