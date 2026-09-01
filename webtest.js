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

  // ---------------------------------------------------------------
  // Content uit de CMS (content/*.json) inladen en de pagina vullen.
  // Als het ophalen om wat voor reden mislukt (bijv. lokaal geopend
  // bestand zonder server), blijft de tekst die al in de HTML staat
  // gewoon zichtbaar als fallback.
  // ---------------------------------------------------------------

  function setText(id, value) {
    var el = document.getElementById(id);
    if (el && value !== undefined && value !== null) el.textContent = value;
  }

  fetch('content/site.json')
    .then(function (res) { return res.json(); })
    .then(function (data) {
      setText('hero-title', data.hero_title);
      setText('hero-lede', data.hero_lede);
      setText('about-lede', data.about_lede);
      setText('about-p1', data.about_p1);
      setText('about-p2', data.about_p2);
      setText('about-intro', data.about_intro);
      setText('contact-email', data.email);
      setText('contact-phone', data.phone);
      setText('contact-address', data.address);

      if (Array.isArray(data.stats)) {
        var statRow = document.getElementById('stat-row');
        if (statRow) {
          statRow.innerHTML = '';
          data.stats.forEach(function (stat) {
            var div = document.createElement('div');
            div.className = 'stat';
            div.innerHTML =
              '<span class="num"></span><span class="label"></span>';
            div.querySelector('.num').textContent = stat.num;
            div.querySelector('.label').textContent = stat.label;
            statRow.appendChild(div);
          });
        }
      }
    })
    .catch(function () {
      // Stil falen: de fallback-tekst in de HTML blijft dan gewoon staan.
    });

  fetch('content/trainings.json')
    .then(function (res) { return res.json(); })
    .then(function (data) {
      var list = document.getElementById('training-list');
      if (!list || !Array.isArray(data.trainingen)) return;
      list.innerHTML = '';
      data.trainingen.forEach(function (training) {
        var row = document.createElement('div');
        row.className = 'training-row';
        row.innerHTML =
          '<div class="training-name"></div>' +
          '<div class="training-desc"></div>' +
          '<div class="training-meta"><span class="meta-sessions"></span><span class="meta-schedule"></span></div>';
        row.querySelector('.training-name').textContent = training.name;
        row.querySelector('.training-desc').textContent = training.description;
        row.querySelector('.meta-sessions').textContent = training.sessions;
        row.querySelector('.meta-schedule').textContent = training.schedule;
        list.appendChild(row);
      });
    })
    .catch(function () {});

  fetch('content/team.json')
    .then(function (res) { return res.json(); })
    .then(function (data) {
      var grid = document.getElementById('team-grid');
      if (!grid || !Array.isArray(data.team)) return;
      grid.innerHTML = '';
      data.team.forEach(function (member) {
        var card = document.createElement('div');
        card.className = 'team-card';
        card.innerHTML =
          '<div class="avatar"></div>' +
          '<div class="team-name"></div>' +
          '<div class="team-role"></div>' +
          '<p class="team-bio"></p>';
        var avatar = card.querySelector('.avatar');
        avatar.textContent = member.initials;
        avatar.style.background = member.color || '#4a3178';
        card.querySelector('.team-name').textContent = member.name;
        card.querySelector('.team-role').textContent = member.role;
        card.querySelector('.team-bio').textContent = member.bio;
        grid.appendChild(card);
      });
    })
    .catch(function () {});

});
