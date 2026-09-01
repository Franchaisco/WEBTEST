// Laadt de content-bestanden (content/site.json, content/trainings.json,
// content/team.json) en vult de website ermee.
// Dit zijn precies de bestanden die leden straks via /admin bewerken —
// dit script hoeft daarna nooit meer aangepast te worden.

document.addEventListener('DOMContentLoaded', function () {
  Promise.all([
    fetchJson('content/site.json'),
    fetchJson('content/trainings.json'),
    fetchJson('content/team.json')
  ])
    .then(function (results) {
      renderSite(results[0]);
      renderTrainingen(results[1]);
      renderTeam(results[2]);
    })
    .catch(function (err) {
      // Als een bestand niet geladen kan worden, blijft de vaste tekst in de
      // HTML gewoon staan als terugval — de site blijft dus altijd bruikbaar.
      console.warn('Content kon niet volledig geladen worden, vaste tekst blijft staan.', err);
    });
});

function fetchJson(path) {
  return fetch(path, { cache: 'no-store' }).then(function (response) {
    if (!response.ok) throw new Error(path + ' niet gevonden');
    return response.json();
  });
}

function renderSite(data) {
  if (!data) return;

  setText('hero-headline', data.hero_title);
  setText('hero-intro', data.hero_lede);

  setText('about-lede', data.about_lede);
  setText('about-p1', data.about_p1);
  setText('about-p2', data.about_p2);
  setText('about-pillars-intro', data.about_intro);

  var statsEl = document.getElementById('about-stats');
  if (statsEl && Array.isArray(data.stats)) {
    statsEl.innerHTML = '';
    data.stats.forEach(function (stat) {
      var div = document.createElement('div');
      div.className = 'stat';
      div.innerHTML =
        '<span class="num">' + escapeHtml(stat.num) + '</span>' +
        '<span class="label">' + escapeHtml(stat.label) + '</span>';
      statsEl.appendChild(div);
    });
  }

  var contactDetails = document.getElementById('contact-details');
  if (contactDetails) {
    contactDetails.innerHTML =
      '<span>' + escapeHtml(data.email) + '</span>' +
      '<span>' + escapeHtml(data.phone) + '</span>' +
      '<span>' + escapeHtml(data.address) + '</span>';
  }
}

function renderTrainingen(data) {
  var list = document.getElementById('training-list');
  if (!list || !data || !Array.isArray(data.trainingen)) return;

  list.innerHTML = '';
  data.trainingen.forEach(function (t) {
    var row = document.createElement('div');
    row.className = 'training-row';
    row.innerHTML =
      '<div class="training-name">' + escapeHtml(t.name) + '</div>' +
      '<div class="training-desc">' + escapeHtml(t.description) + '</div>' +
      '<div class="training-meta"><span>' + escapeHtml(t.sessions) + '</span><span>' + escapeHtml(t.schedule) + '</span></div>';
    list.appendChild(row);
  });
}

function renderTeam(data) {
  var grid = document.getElementById('team-grid');
  if (!grid || !data || !Array.isArray(data.team)) return;

  grid.innerHTML = '';
  data.team.forEach(function (member) {
    var card = document.createElement('div');
    card.className = 'team-card';
    card.innerHTML =
      '<div class="avatar" style="background:' + escapeHtml(member.color || '#4a3178') + ';">' + escapeHtml(member.initials) + '</div>' +
      '<div class="team-name">' + escapeHtml(member.name) + '</div>' +
      '<div class="team-role">' + escapeHtml(member.role) + '</div>' +
      '<p class="team-bio">' + escapeHtml(member.bio) + '</p>';
    grid.appendChild(card);
  });
}

function setText(id, value) {
  if (typeof value !== 'string') return;
  var el = document.getElementById(id);
  if (el) el.textContent = value;
}

function escapeHtml(value) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
