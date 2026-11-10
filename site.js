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

  function bindDemoTabs() {
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
      });
    });
  }

  bindScrollProgress();
  bindDemoTabs();
})();
