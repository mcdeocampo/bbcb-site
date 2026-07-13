// Barangay Bolbok — Directory Module (Phase 2: backed by /api/directory/*)
// Self-contained: does not touch main.js or any other existing script.
// Data is fetched from the public read-only endpoints added in Phase 2
// (server.py), which only return records an administrator has published
// via Directory Management in the admin panel.
(function () {
  'use strict';

  var BOLBOK_CENTER = { lat: 13.7565, lng: 121.0583 };

  // ── Category color tokens (kept consistent with the site's existing palette) ──
  var CAT_COLOR = {
    'Barangay Hall': 'blue',
    'Health Center': 'teal',
    'Schools': 'gold',
    'Evacuation Centers': 'red',
    'Public Facilities': 'blue',
    'Food & Restaurants': 'gold',
    'Stores': 'blue',
    'Services': 'teal',
    'Local Entrepreneurs': 'gold',
    'Associations': 'blue',
    'Youth Organizations': 'teal',
    'Senior Citizens': 'gold',
    'Community Groups': 'blue',
    'Emergency Contacts': 'red',
    'Hospitals': 'red',
    'Police': 'blue',
    'Fire Services': 'gold',
    'Disaster Response Contacts': 'red'
  };
  var CAT_ICON = {
    'Barangay Hall': '🏛️', 'Health Center': '🏥', 'Schools': '🏫',
    'Evacuation Centers': '⛑️', 'Public Facilities': '🏗️',
    'Food & Restaurants': '🍽️', 'Stores': '🛒', 'Services': '🔧', 'Local Entrepreneurs': '🧺',
    'Associations': '🤝', 'Youth Organizations': '🧑‍🤝‍🧑', 'Senior Citizens': '👴', 'Community Groups': '👥',
    'Emergency Contacts': '🚨', 'Hospitals': '🏥', 'Police': '🚓', 'Fire Services': '🚒', 'Disaster Response Contacts': '📡'
  };

  // ── Small helpers ────────────────────────────────────────────────────────
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function mapsLink(lat, lng) {
    return 'https://www.google.com/maps?q=' + lat + ',' + lng;
  }
  // Shared banner: shows the uploaded image if present, otherwise falls back
  // to the category icon. Used by all 4 directory card types. If the image
  // fails to load, swap back to the icon so a broken-image glyph never shows.
  function bannerHtml(imageUrl, fallbackIcon) {
    if (!imageUrl) return fallbackIcon;
    var src = imageUrl.indexOf('http') === 0 ? imageUrl : '/' + imageUrl;
    return '<img src="' + esc(src) + '" alt="" style="width:100%;height:100%;object-fit:cover" ' +
      'onerror="this.outerHTML=' + esc(JSON.stringify(fallbackIcon)) + '">';
  }
  function matches(item, query, fields) {
    if (!query) return true;
    var q = query.toLowerCase();
    return fields.some(function (f) {
      var v = item[f];
      if (Array.isArray(v)) v = v.join(' ');
      return String(v || '').toLowerCase().indexOf(q) !== -1;
    });
  }
  function fetchJSON(url) {
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error('Request failed: ' + r.status);
      return r.json();
    });
  }

  // Builds "All" + one chip per category found in `items`, wires click handlers,
  // and calls onChange(activeCategory) whenever the selection changes.
  function buildChips(container, items, onChange) {
    var cats = [];
    items.forEach(function (i) { if (cats.indexOf(i.category) === -1) cats.push(i.category); });
    var active = 'All';
    function render() {
      container.innerHTML = ['All'].concat(cats).map(function (c) {
        var color = CAT_COLOR[c] || 'blue';
        return '<button type="button" class="dir-chip dir-chip--' + color + (c === active ? ' active' : '') + '" data-cat="' + esc(c) + '">' +
          (CAT_ICON[c] ? CAT_ICON[c] + ' ' : '') + esc(c) + '</button>';
      }).join('');
    }
    render();
    container.addEventListener('click', function (e) {
      var btn = e.target.closest('.dir-chip');
      if (!btn) return;
      active = btn.getAttribute('data-cat');
      render();
      onChange(active);
    });
    return { getActive: function () { return active; } };
  }

  // ── Community Map (Leaflet) ──────────────────────────────────────────────
  function initMapSection() {
    var searchEl = document.getElementById('map-search');
    var filtersEl = document.getElementById('map-filters');
    var listEl = document.getElementById('map-list');
    var mapEl = document.getElementById('dir-map');
    if (!listEl) return;

    listEl.innerHTML = '<p class="dir-empty">Loading locations…</p>';

    fetchJSON('/api/directory/map').then(function (d) {
      var MAP_LOCATIONS = d.locations || [];
      var map = null, markers = {};

      if (mapEl && window.L) {
        map = L.map(mapEl, { scrollWheelZoom: false }).setView([BOLBOK_CENTER.lat, BOLBOK_CENTER.lng], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        var MARKER_HEX = { blue: '#1565d8', teal: '#00a884', gold: '#f6c445', red: '#e5484d' };
        MAP_LOCATIONS.forEach(function (loc) {
          if (loc.lat == null || loc.lng == null) return;
          var color = MARKER_HEX[CAT_COLOR[loc.category] || 'blue'];
          var marker = L.circleMarker([loc.lat, loc.lng], {
            radius: 9, color: '#fff', weight: 2, fillColor: color, fillOpacity: 0.95
          }).addTo(map);
          var popupThumb = loc.imageUrl
            ? '<img src="' + esc(loc.imageUrl.indexOf('http') === 0 ? loc.imageUrl : '/' + loc.imageUrl) + '" alt="" style="width:100%;max-width:220px;height:110px;object-fit:cover;border-radius:8px;margin-bottom:6px" onerror="this.remove()">'
            : '';
          marker.bindPopup(
            popupThumb +
            '<strong>' + esc(loc.name) + '</strong><br>' +
            '<span style="color:#00a884;font-weight:700">' + esc(loc.category) + '</span><br>' +
            esc(loc.description) + '<br>' +
            '<em>' + esc(loc.address) + '</em><br>' +
            (loc.contact ? '📞 ' + esc(loc.contact) + '<br>' : '') +
            (loc.hours ? '🕒 ' + esc(loc.hours) : '')
          );
          markers[loc.id] = marker;
        });
      }

      function renderList(items) {
        listEl.innerHTML = items.map(function (loc) {
          var color = CAT_COLOR[loc.category] || 'blue';
          return '<article class="dir-card reveal visible">' +
            '<div class="dir-card-banner dir-card-banner--' + color + '">' + bannerHtml(loc.imageUrl, CAT_ICON[loc.category] || '📍') + '</div>' +
            '<div class="dir-card-body">' +
            '<span class="dir-chip dir-chip--' + color + ' dir-chip-static">' + esc(loc.category) + '</span>' +
            '<h3>' + esc(loc.name) + '</h3>' +
            '<p>' + esc(loc.description) + '</p>' +
            '<ul class="dir-meta-list">' +
            '<li>📍 ' + esc(loc.address) + '</li>' +
            (loc.contact ? '<li>📞 ' + esc(loc.contact) + '</li>' : '') +
            (loc.hours ? '<li>🕒 ' + esc(loc.hours) + '</li>' : '') +
            '</ul>' +
            '<button type="button" class="text-link dir-locate-btn" data-id="' + loc.id + '" style="background:none;border:none;cursor:pointer;font-family:inherit">Locate on Map →</button>' +
            '</div></article>';
        }).join('') || '<p class="dir-empty">No locations match your search.</p>';
      }

      function apply() {
        var q = searchEl ? searchEl.value.trim() : '';
        var cat = chips.getActive();
        var items = MAP_LOCATIONS.filter(function (loc) {
          return (cat === 'All' || loc.category === cat) && matches(loc, q, ['name', 'description', 'address']);
        });
        renderList(items);
        if (map) {
          Object.keys(markers).forEach(function (id) {
            var show = items.some(function (i) { return i.id === id; });
            var m = markers[id];
            if (show && !map.hasLayer(m)) m.addTo(map);
            else if (!show && map.hasLayer(m)) map.removeLayer(m);
          });
        }
      }

      var chips = buildChips(filtersEl, MAP_LOCATIONS, apply);
      if (searchEl) searchEl.addEventListener('input', apply);
      apply();

      listEl.addEventListener('click', function (e) {
        var btn = e.target.closest('.dir-locate-btn');
        if (!btn || !map) return;
        var loc = MAP_LOCATIONS.find(function (l) { return l.id === btn.getAttribute('data-id'); });
        if (!loc) return;
        mapEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        map.setView([loc.lat, loc.lng], 17);
        var marker = markers[loc.id];
        if (marker) { if (!map.hasLayer(marker)) marker.addTo(map); marker.openPopup(); }
      });
    }).catch(function () {
      listEl.innerHTML = '<p class="dir-empty">Unable to load locations right now. Please try again later.</p>';
    });
  }

  // ── Business Directory ───────────────────────────────────────────────────
  function initBusinessSection() {
    var searchEl = document.getElementById('biz-search');
    var filtersEl = document.getElementById('biz-filters');
    var listEl = document.getElementById('biz-list');
    if (!listEl) return;

    listEl.innerHTML = '<p class="dir-empty">Loading businesses…</p>';

    fetchJSON('/api/directory/businesses').then(function (d) {
      var BUSINESSES = d.businesses || [];

      function render(items) {
        listEl.innerHTML = items.map(function (b) {
          var color = CAT_COLOR[b.category] || 'blue';
          return '<article class="dir-card reveal visible">' +
            '<div class="dir-card-banner dir-card-banner--' + color + '">' + bannerHtml(b.imageUrl, CAT_ICON[b.category] || '🏪') + '</div>' +
            '<div class="dir-card-body">' +
            '<span class="dir-chip dir-chip--' + color + ' dir-chip-static">' + esc(b.category) + '</span>' +
            '<h3>' + esc(b.name) + '</h3>' +
            '<p>' + esc(b.description) + '</p>' +
            '<ul class="dir-meta-list">' +
            '<li>📍 ' + esc(b.address) + '</li>' +
            '<li>📞 ' + esc(b.contact) + '</li>' +
            '<li>🕒 ' + esc(b.hours) + '</li>' +
            '</ul>' +
            '<div class="dir-card-actions">' +
            (b.lat != null && b.lng != null ? '<a class="text-link" href="' + mapsLink(b.lat, b.lng) + '" target="_blank" rel="noopener noreferrer">📍 View on Map</a>' : '') +
            (b.social ? '<a class="text-link" href="' + esc(b.social) + '" target="_blank" rel="noopener noreferrer">🔗 Social Page</a>' : '') +
            '</div></div></article>';
        }).join('') || '<p class="dir-empty">No businesses match your search.</p>';
      }

      function apply() {
        var q = searchEl ? searchEl.value.trim() : '';
        var cat = chips.getActive();
        render(BUSINESSES.filter(function (b) {
          return (cat === 'All' || b.category === cat) && matches(b, q, ['name', 'description', 'address']);
        }));
      }

      var chips = buildChips(filtersEl, BUSINESSES, apply);
      if (searchEl) searchEl.addEventListener('input', apply);
      apply();
    }).catch(function () {
      listEl.innerHTML = '<p class="dir-empty">Unable to load businesses right now. Please try again later.</p>';
    });
  }

  // ── Organization Directory ───────────────────────────────────────────────
  function initOrganizationSection() {
    var searchEl = document.getElementById('org-search');
    var filtersEl = document.getElementById('org-filters');
    var listEl = document.getElementById('org-list');
    if (!listEl) return;

    listEl.innerHTML = '<p class="dir-empty">Loading organizations…</p>';

    fetchJSON('/api/directory/organizations').then(function (d) {
      var ORGANIZATIONS = d.organizations || [];

      function render(items) {
        listEl.innerHTML = items.map(function (o) {
          var color = CAT_COLOR[o.category] || 'blue';
          var officers = o.officers || [];
          return '<article class="dir-card reveal visible">' +
            '<div class="dir-card-banner dir-card-banner--' + color + '">' + bannerHtml(o.imageUrl, CAT_ICON[o.category] || '🤝') + '</div>' +
            '<div class="dir-card-body">' +
            '<span class="dir-chip dir-chip--' + color + ' dir-chip-static">' + esc(o.category) + '</span>' +
            '<h3>' + esc(o.name) + '</h3>' +
            '<p>' + esc(o.description) + '</p>' +
            '<ul class="dir-meta-list">' +
            '<li>👤 ' + esc(o.contactPerson) + '</li>' +
            '<li>📞 ' + esc(o.contactDetails) + '</li>' +
            '<li>📍 ' + esc(o.location) + '</li>' +
            '</ul>' +
            (officers.length ? '<p class="dir-card-subhead">Officers</p><ul class="dir-meta-list">' + officers.map(function (off) { return '<li>' + esc(off) + '</li>'; }).join('') + '</ul>' : '') +
            (o.programs ? '<p class="dir-card-subhead">Activities / Programs</p><p class="dir-card-note">' + esc(o.programs) + '</p>' : '') +
            '<div class="dir-card-actions">' +
            (o.lat != null && o.lng != null ? '<a class="text-link" href="' + mapsLink(o.lat, o.lng) + '" target="_blank" rel="noopener noreferrer">📍 View on Map</a>' : '') +
            '</div></div></article>';
        }).join('') || '<p class="dir-empty">No organizations match your search.</p>';
      }

      function apply() {
        var q = searchEl ? searchEl.value.trim() : '';
        var cat = chips.getActive();
        render(ORGANIZATIONS.filter(function (o) {
          return (cat === 'All' || o.category === cat) && matches(o, q, ['name', 'description', 'location', 'contactPerson']);
        }));
      }

      var chips = buildChips(filtersEl, ORGANIZATIONS, apply);
      if (searchEl) searchEl.addEventListener('input', apply);
      apply();
    }).catch(function () {
      listEl.innerHTML = '<p class="dir-empty">Unable to load organizations right now. Please try again later.</p>';
    });
  }

  // ── Emergency Directory ──────────────────────────────────────────────────
  function initEmergencySection() {
    var filtersEl = document.getElementById('em-filters');
    var listEl = document.getElementById('em-list');
    if (!listEl) return;

    listEl.innerHTML = '<p class="dir-empty">Loading emergency contacts…</p>';

    fetchJSON('/api/directory/emergency').then(function (d) {
      var EMERGENCY = d.contacts || [];

      function render(items) {
        listEl.innerHTML = items.map(function (e) {
          var color = CAT_COLOR[e.category] || 'red';
          return '<article class="dir-card dir-card-emergency reveal visible">' +
            '<div class="dir-card-banner dir-card-banner--' + color + '">' + bannerHtml(e.imageUrl, CAT_ICON[e.category] || '🚨') + '</div>' +
            '<div class="dir-card-body">' +
            '<span class="dir-chip dir-chip--' + color + ' dir-chip-static">' + esc(e.category) + '</span>' +
            '<h3>' + esc(e.name) + '</h3>' +
            '<a class="dir-emergency-number" href="tel:' + esc((e.number || '').split('/')[0].replace(/[^0-9+]/g, '')) + '">📞 ' + esc(e.number) + '</a>' +
            (e.altNumber ? '<a class="dir-emergency-number dir-emergency-alt" href="tel:' + esc(e.altNumber.split('/')[0].replace(/[^0-9+]/g, '')) + '">📞 ' + esc(e.altNumber) + ' (alternate)</a>' : '') +
            '<ul class="dir-meta-list">' +
            '<li>📍 ' + esc(e.address) + '</li>' +
            '<li>🛟 ' + esc(e.services) + '</li>' +
            '</ul>' +
            '<div class="dir-card-actions">' +
            (e.lat != null && e.lng != null ? '<a class="text-link" href="' + mapsLink(e.lat, e.lng) + '" target="_blank" rel="noopener noreferrer">📍 View on Map</a>' : '') +
            '</div></div></article>';
        }).join('') || '<p class="dir-empty">No entries match this category.</p>';
      }

      function apply() {
        var cat = chips.getActive();
        render(EMERGENCY.filter(function (e) { return cat === 'All' || e.category === cat; }));
      }

      var chips = buildChips(filtersEl, EMERGENCY, apply);
      apply();
    }).catch(function () {
      listEl.innerHTML = '<p class="dir-empty">Unable to load emergency contacts right now. Please try again later.</p>';
    });
  }

  function boot() {
    initMapSection();
    initBusinessSection();
    initOrganizationSection();
    initEmergencySection();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
