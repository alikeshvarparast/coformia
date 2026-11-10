(function () {
    var btn = document.getElementById('copy-email'), state = document.getElementById('copy-state'), el = document.getElementById('email');
    if (!btn || !el) return;
    btn.addEventListener('click', function () {
      function fallback() { var r = document.createRange(); r.selectNodeContents(el); var s = window.getSelection(); s.removeAllRanges(); s.addRange(r); state.textContent = 'Selected. Press Ctrl+C or Cmd+C to copy.'; }
      var addr = 'info@coformia.com';
      if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(addr).then(function () { state.textContent = 'Email address copied.'; }, fallback); } else { fallback(); }
    });
  })();



  (function () {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) return;
    var els = document.querySelectorAll('.promise h2, .triple > div, .hub-title, .hub-sub, .hub-art, .tile, .steps h2, .approach-steps li, .founder blockquote, .contact h2');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    els.forEach(function (el) { if (el.getBoundingClientRect().top > window.innerHeight) { el.classList.add('reveal'); io.observe(el); } });
  })();


  (function () {
    var story = document.getElementById('story');
    var frame = document.getElementById('story-frame');
    if (!story || !frame) return;
    var chapters = story.querySelectorAll('.story-chapter');
    if (!chapters.length) return;
    function storyProgress() {
      var travel = story.offsetHeight - window.innerHeight;
      if (travel < 1) return 0;
      var rect = story.getBoundingClientRect();
      var scrolled = Math.min(Math.max(-rect.top, 0), travel);
      return scrolled / travel;
    }
    var chapter = -1;
    function setChapter(idx) {
      if (idx === chapter) return;
      chapter = idx;
      chapters.forEach(function (c, i) { c.classList.toggle('is-on', i === idx); });
      var product = idx >= 2 ? 'qualane' : 'formulane';
      if (frame.dataset.product !== product) {
        frame.dataset.product = product;
        frame.src = '/workbench.html?product=' + product + '&embed=1';
      }
      window.dispatchEvent(new CustomEvent('story-chapter', { detail: idx }));
    }
    function tick() {
      if (window.innerWidth < 901) {
        chapters.forEach(function (c) { c.classList.remove('is-on'); });
        story.classList.remove('is-locked');
        story.style.setProperty('--story-p', '0%');
        return;
      }
      var p = storyProgress();
      var rect = story.getBoundingClientRect();
      var inLock = rect.top < window.innerHeight * 0.45 && rect.bottom > window.innerHeight * 0.55;
      story.classList.toggle('is-locked', inLock);
      story.style.setProperty('--story-p', (p * 100) + '%');
      var idx = p < 0.33 ? 0 : p < 0.66 ? 1 : 2;
      setChapter(idx);
    }
    window.addEventListener('scroll', tick, { passive: true });
    window.addEventListener('resize', function () { requestAnimationFrame(tick); });
    tick();
  })();


  (function () {
    var dock = document.getElementById('dock');
    var hero = document.querySelector('.hero');
    var story = document.getElementById('story');
    if (!dock || !hero) return;
    function updateDock() {
      var heroRect = hero.getBoundingClientRect();
      var show = heroRect.bottom < window.innerHeight * 0.72;
      if (story) {
        var sr = story.getBoundingClientRect();
        var inStory = sr.top < window.innerHeight * 0.9 && sr.bottom > window.innerHeight * 0.2;
        if (inStory) show = false;
      }
      dock.hidden = !show;
      dock.classList.toggle('is-visible', show);
    }
    window.addEventListener('scroll', updateDock, { passive: true });
    window.addEventListener('resize', updateDock);
    updateDock();
  })();


  (function () {
    var nodes = document.querySelectorAll('.hub-art .node');
    nodes.forEach(function (node) {
      var key = '';
      node.classList.forEach(function (c) { if (c.indexOf('node-') === 0) key = c.slice(5); });
      if (!key) return;
      function hot(on) {
        node.classList.toggle('is-hot', on);
        document.querySelectorAll('.path-' + key).forEach(function (p) { p.classList.toggle('is-hot', on); });
      }
      node.addEventListener('mouseenter', function () { hot(true); });
      node.addEventListener('mouseleave', function () { hot(false); });
      node.addEventListener('click', function () { hot(true); setTimeout(function () { hot(false); }, 1200); });
    });
  })();


  (function () {
    var index = document.getElementById('approach-index');
    var steps = document.querySelectorAll('#approach-steps li');
    if (!index || !steps.length || !('IntersectionObserver' in window)) return;
    var nums = index.querySelectorAll('li');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var i = Array.prototype.indexOf.call(steps, e.target);
        nums.forEach(function (n, j) { n.classList.toggle('is-on', j === i); });
      });
    }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });
    steps.forEach(function (li) { io.observe(li); });
  })();
