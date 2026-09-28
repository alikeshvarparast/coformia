(function () {
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');
  var submit = document.getElementById('contact-submit');
  if (!form || !status) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    status.textContent = 'Sending…';
    if (submit) submit.disabled = true;
    var fd = new FormData(form);
    var token = window.turnstile ? window.turnstile.getResponse() : '';
    if (!token) {
      status.textContent = 'Complete the verification check, then try again.';
      if (submit) submit.disabled = false;
      return;
    }
    var sourcePage = form.getAttribute('data-source-page') || location.pathname + location.hash;
    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: fd.get('name'),
        email: fd.get('email'),
        message: fd.get('message'),
        website: fd.get('website'),
        turnstileToken: token,
        sourcePage: sourcePage,
      }),
    })
      .then(function (res) {
        return res.json().then(function (data) {
          return { res: res, data: data };
        });
      })
      .then(function (_ref) {
        var res = _ref.res;
        var data = _ref.data;
        if (!res.ok) throw new Error(data.error || 'Send failed');
        status.textContent = 'Thanks — we got your message and will reply by email.';
        form.reset();
        if (window.turnstile) window.turnstile.reset();
      })
      .catch(function (err) {
        status.textContent = err.message || 'Something went wrong. Email info@coformia.com directly.';
      })
      .finally(function () {
        if (submit) submit.disabled = false;
      });
  });
})();
