document.addEventListener('DOMContentLoaded', function () {

  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close the menu after choosing a link (mobile)
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Contact form: verstuurt echt naar FormSubmit via fetch (AJAX endpoint)
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');

  if (form && status) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var submitButton = form.querySelector('button[type="submit"]');
      status.classList.remove('success', 'error');
      status.textContent = 'Bezig met versturen…';
      if (submitButton) submitButton.disabled = true;

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            status.textContent = 'Bedankt! Je bericht is verzonden.';
            status.classList.add('success');
            form.reset();
          } else {
            throw new Error('Verzenden mislukt');
          }
        })
        .catch(function () {
          status.textContent = 'Er ging iets mis bij het verzenden. Probeer het later opnieuw of mail ons rechtstreeks.';
          status.classList.add('error');
        })
        .finally(function () {
          if (submitButton) submitButton.disabled = false;
        });
    });
  }

});
