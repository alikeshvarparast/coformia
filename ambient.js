(function () {
  var HERO_BLOBS = 8;
  var TONES = ['a', 'b', 'c', 'd', 'a', 'b', 'c', 'd'];

  function init() {
    var wash = document.querySelector('.ambient-wash');
    if (!wash) return;

    wash.style.transform = 'none';
    wash.innerHTML = '';

    var band = document.createElement('div');
    band.className = 'ambient-band';
    band.style.top = '0';
    band.style.height = '100%';

    for (var n = 0; n < HERO_BLOBS; n++) {
      var k = n;
      var outer = document.createElement('span');
      outer.className = 'ambient-blob ambient-blob--' + TONES[n];
      var inner = document.createElement('span');
      inner.className = 'ambient-blob-motion';
      outer.appendChild(inner);
      outer.style.setProperty('--blob-x', (6 + ((k * 37) % 88)).toFixed(1) + '%');
      outer.style.setProperty('--blob-y', (6 + ((k * 53) % 88)).toFixed(1) + '%');
      outer.style.setProperty('--blob-s', (62 + ((k * 13) % 36)).toFixed(1) + 'vmin');
      band.appendChild(outer);
    }

    wash.appendChild(band);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
