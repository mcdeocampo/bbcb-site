// Barangay Bolbok — Directory Module (Phase 1: sample data only)
// Self-contained: does not touch main.js or any other existing script.
// Data shape is deliberately flat/normalized so it can later be swapped for
// a fetch('/api/directory/...') call without changing the render functions.
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

  // ── Sample data ──────────────────────────────────────────────────────────
  var MAP_LOCATIONS = [
    { id: 'ml1', name: 'Barangay Bolbok Hall', category: 'Barangay Hall', description: 'Main administrative office of Barangay Bolbok, serving residents with public assistance and documentation.', address: 'Barangay Hall, Bolbok, Batangas City, Batangas', contact: '043 980 0831', hours: 'Monday - Friday, 8:00 AM - 5:00 PM', lat: 13.7565, lng: 121.0583 },
    { id: 'ml2', name: 'Bolbok Health Center', category: 'Health Center', description: 'Rural health unit annex providing basic consultations, immunization, and maternal care.', address: 'Purok 2, Bolbok, Batangas City', contact: '043 980 1122', hours: 'Monday - Saturday, 8:00 AM - 5:00 PM', lat: 13.7571, lng: 121.0590 },
    { id: 'ml3', name: 'Bolbok Lying-In Clinic', category: 'Health Center', description: 'Maternal and newborn care clinic supporting barangay health programs.', address: 'Purok 5, Bolbok, Batangas City', contact: '043 980 1145', hours: 'Open 24 hours', lat: 13.7558, lng: 121.0575 },
    { id: 'ml4', name: 'Bolbok Elementary School', category: 'Schools', description: 'Public elementary school serving children of Barangay Bolbok and nearby areas.', address: 'Purok 1, Bolbok, Batangas City', contact: '043 980 1200', hours: 'Monday - Friday, 7:00 AM - 5:00 PM', lat: 13.7580, lng: 121.0570 },
    { id: 'ml5', name: 'Bolbok National High School', category: 'Schools', description: 'Public secondary school offering junior and senior high school programs.', address: 'Purok 3, Bolbok, Batangas City', contact: '043 980 1210', hours: 'Monday - Friday, 7:00 AM - 5:00 PM', lat: 13.7550, lng: 121.0600 },
    { id: 'ml6', name: 'Bolbok Covered Court (Evacuation Center)', category: 'Evacuation Centers', description: 'Designated evacuation site during typhoons, flooding, and other disaster events.', address: 'Purok 2, Bolbok, Batangas City', contact: '043 980 0831', hours: 'Activated during disaster operations', lat: 13.7568, lng: 121.0585 },
    { id: 'ml7', name: 'Bolbok Multi-Purpose Hall', category: 'Evacuation Centers', description: 'Secondary evacuation and relief distribution site for the barangay.', address: 'Purok 4, Bolbok, Batangas City', contact: '043 980 0831', hours: 'Activated during disaster operations', lat: 13.7545, lng: 121.0565 },
    { id: 'ml8', name: 'Bolbok Public Market', category: 'Public Facilities', description: 'Wet and dry market serving residents with fresh produce and everyday goods.', address: 'Purok 1, Bolbok, Batangas City', contact: '043 980 1300', hours: 'Daily, 5:00 AM - 6:00 PM', lat: 13.7590, lng: 121.0595 },
    { id: 'ml9', name: 'Bolbok Barangay Plaza & Basketball Court', category: 'Public Facilities', description: 'Open community plaza used for sports, assemblies, and events.', address: 'Purok 2, Bolbok, Batangas City', contact: '043 980 0831', hours: 'Daily, 6:00 AM - 9:00 PM', lat: 13.7562, lng: 121.0588 },
    { id: 'ml10', name: 'Bolbok Water District Station', category: 'Public Facilities', description: 'Local water utility station handling water service requests and billing.', address: 'Purok 3, Bolbok, Batangas City', contact: '043 980 1400', hours: 'Monday - Friday, 8:00 AM - 5:00 PM', lat: 13.7575, lng: 121.0600 }
  ];

  var BUSINESSES = [
    { id: 'b1', name: "Aling Nena's Carinderia", category: 'Food & Restaurants', description: 'Homestyle Filipino meals and merienda favorites at affordable prices.', address: 'Purok 1, Bolbok, Batangas City', contact: '0917 123 4567', hours: 'Daily, 6:00 AM - 8:00 PM', social: '#', lat: 13.7566, lng: 121.0579 },
    { id: 'b2', name: 'Bolbok Grill House', category: 'Food & Restaurants', description: 'Grilled specialties, pulutan, and cold drinks for gatherings and nightouts.', address: 'Purok 2, Bolbok, Batangas City', contact: '0917 234 5678', hours: 'Daily, 4:00 PM - 11:00 PM', social: '#', lat: 13.7569, lng: 121.0592 },
    { id: 'b3', name: 'Dela Cruz Sari-Sari Store', category: 'Stores', description: 'Neighborhood store for everyday essentials, load, and household needs.', address: 'Purok 3, Bolbok, Batangas City', contact: '0918 345 6789', hours: 'Daily, 6:00 AM - 9:00 PM', social: '#', lat: 13.7553, lng: 121.0598 },
    { id: 'b4', name: 'Bolbok Hardware & Construction Supply', category: 'Stores', description: 'Hardware, construction materials, and home improvement supplies.', address: 'Purok 1, Bolbok, Batangas City', contact: '043 980 1500', hours: 'Monday - Saturday, 7:00 AM - 6:00 PM', social: '#', lat: 13.7583, lng: 121.0573 },
    { id: 'b5', name: 'Bolbok Auto Repair Shop', category: 'Services', description: 'Motorcycle and vehicle repair, maintenance, and parts.', address: 'Purok 4, Bolbok, Batangas City', contact: '0919 456 7890', hours: 'Monday - Saturday, 8:00 AM - 6:00 PM', social: '#', lat: 13.7548, lng: 121.0563 },
    { id: 'b6', name: 'Reyes Tailoring & Dressmaking', category: 'Services', description: 'Custom sewing, alterations, and dressmaking services.', address: 'Purok 2, Bolbok, Batangas City', contact: '0920 567 8901', hours: 'Monday - Saturday, 9:00 AM - 6:00 PM', social: '#', lat: 13.7564, lng: 121.0587 },
    { id: 'b7', name: 'Bolbok Home-Baked Treats', category: 'Local Entrepreneurs', description: 'Home-based baker Marites Santos offers cakes, pastries, and baked goods made to order.', address: 'Purok 3, Bolbok, Batangas City', contact: '0921 678 9012', hours: 'Daily, 7:00 AM - 7:00 PM (orders via Facebook)', social: '#', lat: 13.7576, lng: 121.0602 },
    { id: 'b8', name: "Juan's Native Delicacies", category: 'Local Entrepreneurs', description: 'Small home business producing kakanin and native Filipino delicacies.', address: 'Purok 1, Bolbok, Batangas City', contact: '0922 789 0123', hours: 'Daily, 6:00 AM - 6:00 PM', social: '#', lat: 13.7561, lng: 121.0577 }
  ];

  var ORGANIZATIONS = [
    { id: 'o1', name: 'Bolbok Homeowners Association', category: 'Associations', description: 'Community association coordinating neighborhood safety, maintenance, and welfare initiatives.', contactPerson: 'Mr. Ramon Villanueva (President)', officers: ['Ramon Villanueva — President', 'Elena Cruz — Secretary', 'Mark Torres — Treasurer'], contactDetails: '0917 111 2222', programs: 'Community clean-up drives, security patrol coordination, neighborhood dispute mediation.', location: 'Purok 2, Bolbok, Batangas City', lat: 13.7563, lng: 121.0586 },
    { id: 'o2', name: 'Sangguniang Kabataan (SK) Bolbok', category: 'Youth Organizations', description: 'Official youth council of Barangay Bolbok, representing the interests of young residents.', contactPerson: 'Hon. Mark Jesty Roxas (SK Chairman)', officers: ['Mark Jesty Roxas — SK Chairman', 'Angel Reyes — SK Secretary', 'Paolo Gomez — SK Treasurer'], contactDetails: '043 980 0831', programs: 'Youth sports leagues, skills training workshops, environmental clean-up campaigns.', location: 'Barangay Hall, Bolbok, Batangas City', lat: 13.7565, lng: 121.0583 },
    { id: 'o3', name: 'Bolbok Senior Citizens Association', category: 'Senior Citizens', description: 'Association supporting the welfare, benefits, and social activities of senior residents.', contactPerson: 'Mrs. Corazon Reyes (President)', officers: ['Corazon Reyes — President', 'Benjamin Santos — Vice President', 'Lourdes Aquino — Secretary'], contactDetails: '0918 222 3333', programs: 'Monthly pension assistance coordination, wellness checkups, social gatherings.', location: 'Barangay Hall Annex, Bolbok, Batangas City', lat: 13.7567, lng: 121.0581 },
    { id: 'o4', name: "Bolbok Women's Livelihood Group", category: 'Community Groups', description: 'Grassroots group empowering women through livelihood and savings programs.', contactPerson: 'Mrs. Luz Fernandez (Coordinator)', officers: ['Luz Fernandez — Coordinator', 'Rosario Mendoza — Assistant Coordinator'], contactDetails: '0919 333 4444', programs: 'Livelihood skills training, handicraft production, community savings circle.', location: 'Purok 3 Community Center, Bolbok, Batangas City', lat: 13.7577, lng: 121.0599 }
  ];

  var EMERGENCY = [
    { id: 'e1', name: 'Barangay Emergency Hotline', category: 'Emergency Contacts', number: '043 980 0831 / 911', address: 'Barangay Hall, Bolbok, Batangas City', services: 'General emergency response and disaster coordination.', lat: 13.7565, lng: 121.0583 },
    { id: 'e2', name: 'Batangas Medical Center', category: 'Hospitals', number: '(043) 723 1234', address: 'Kumintang Ibaba, Batangas City', services: '24/7 emergency room and trauma care.', lat: 13.7860, lng: 121.0430 },
    { id: 'e3', name: 'Signal Village Doctors Hospital', category: 'Hospitals', number: '(043) 723 5678', address: 'Batangas City, Batangas', services: '24/7 emergency room and general medicine.', lat: 13.7690, lng: 121.0560 },
    { id: 'e4', name: 'Batangas City Police Station — Bolbok Outpost', category: 'Police', number: '117 / (043) 980 2000', address: 'Bolbok, Batangas City, Batangas', services: 'Police assistance, community patrol, crime reporting.', lat: 13.7570, lng: 121.0592 },
    { id: 'e5', name: 'Batangas City Fire Station', category: 'Fire Services', number: '116 / (043) 980 3000', address: 'Batangas City, Batangas', services: 'Fire suppression and rescue operations.', lat: 13.7720, lng: 121.0610 },
    { id: 'e6', name: 'Batangas City DRRMO', category: 'Disaster Response Contacts', number: '(043) 980 4000', address: 'Batangas City, Batangas', services: 'Disaster response coordination, relief operations, evacuation management.', lat: 13.7700, lng: 121.0500 }
  ];

  // ── Small helpers ────────────────────────────────────────────────────────
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function mapsLink(lat, lng) {
    return 'https://www.google.com/maps?q=' + lat + ',' + lng;
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

    var map = null, markers = {};
    if (mapEl && window.L) {
      map = L.map(mapEl, { scrollWheelZoom: false }).setView([BOLBOK_CENTER.lat, BOLBOK_CENTER.lng], 15);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      var MARKER_HEX = { blue: '#1565d8', teal: '#00a884', gold: '#f6c445', red: '#e5484d' };
      MAP_LOCATIONS.forEach(function (loc) {
        var color = MARKER_HEX[CAT_COLOR[loc.category] || 'blue'];
        var marker = L.circleMarker([loc.lat, loc.lng], {
          radius: 9, color: '#fff', weight: 2, fillColor: color, fillOpacity: 0.95
        }).addTo(map);
        marker.bindPopup(
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
        return '<article class="dir-card reveal">' +
          '<div class="dir-card-banner dir-card-banner--' + color + '">' + (CAT_ICON[loc.category] || '📍') + '</div>' +
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
  }

  // ── Business Directory ───────────────────────────────────────────────────
  function initBusinessSection() {
    var searchEl = document.getElementById('biz-search');
    var filtersEl = document.getElementById('biz-filters');
    var listEl = document.getElementById('biz-list');
    if (!listEl) return;

    function render(items) {
      listEl.innerHTML = items.map(function (b) {
        var color = CAT_COLOR[b.category] || 'blue';
        return '<article class="dir-card reveal">' +
          '<div class="dir-card-banner dir-card-banner--' + color + '">' + (CAT_ICON[b.category] || '🏪') + '</div>' +
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
          '<a class="text-link" href="' + mapsLink(b.lat, b.lng) + '" target="_blank" rel="noopener noreferrer">📍 View on Map</a>' +
          '<a class="text-link" href="' + esc(b.social) + '" target="_blank" rel="noopener noreferrer">🔗 Social Page</a>' +
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
  }

  // ── Organization Directory ───────────────────────────────────────────────
  function initOrganizationSection() {
    var searchEl = document.getElementById('org-search');
    var filtersEl = document.getElementById('org-filters');
    var listEl = document.getElementById('org-list');
    if (!listEl) return;

    function render(items) {
      listEl.innerHTML = items.map(function (o) {
        var color = CAT_COLOR[o.category] || 'blue';
        return '<article class="dir-card reveal">' +
          '<div class="dir-card-banner dir-card-banner--' + color + '">' + (CAT_ICON[o.category] || '🤝') + '</div>' +
          '<div class="dir-card-body">' +
          '<span class="dir-chip dir-chip--' + color + ' dir-chip-static">' + esc(o.category) + '</span>' +
          '<h3>' + esc(o.name) + '</h3>' +
          '<p>' + esc(o.description) + '</p>' +
          '<ul class="dir-meta-list">' +
          '<li>👤 ' + esc(o.contactPerson) + '</li>' +
          '<li>📞 ' + esc(o.contactDetails) + '</li>' +
          '<li>📍 ' + esc(o.location) + '</li>' +
          '</ul>' +
          '<p class="dir-card-subhead">Officers</p>' +
          '<ul class="dir-meta-list">' + o.officers.map(function (off) { return '<li>' + esc(off) + '</li>'; }).join('') + '</ul>' +
          '<p class="dir-card-subhead">Activities / Programs</p>' +
          '<p class="dir-card-note">' + esc(o.programs) + '</p>' +
          '<div class="dir-card-actions">' +
          '<a class="text-link" href="' + mapsLink(o.lat, o.lng) + '" target="_blank" rel="noopener noreferrer">📍 View on Map</a>' +
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
  }

  // ── Emergency Directory ──────────────────────────────────────────────────
  function initEmergencySection() {
    var filtersEl = document.getElementById('em-filters');
    var listEl = document.getElementById('em-list');
    if (!listEl) return;

    function render(items) {
      listEl.innerHTML = items.map(function (e) {
        var color = CAT_COLOR[e.category] || 'red';
        return '<article class="dir-card dir-card-emergency reveal">' +
          '<div class="dir-card-banner dir-card-banner--' + color + '">' + (CAT_ICON[e.category] || '🚨') + '</div>' +
          '<div class="dir-card-body">' +
          '<span class="dir-chip dir-chip--' + color + ' dir-chip-static">' + esc(e.category) + '</span>' +
          '<h3>' + esc(e.name) + '</h3>' +
          '<a class="dir-emergency-number" href="tel:' + esc(e.number.split('/')[0].replace(/[^0-9+]/g, '')) + '">📞 ' + esc(e.number) + '</a>' +
          '<ul class="dir-meta-list">' +
          '<li>📍 ' + esc(e.address) + '</li>' +
          '<li>🛟 ' + esc(e.services) + '</li>' +
          '</ul>' +
          '<div class="dir-card-actions">' +
          '<a class="text-link" href="' + mapsLink(e.lat, e.lng) + '" target="_blank" rel="noopener noreferrer">📍 View on Map</a>' +
          '</div></div></article>';
      }).join('') || '<p class="dir-empty">No entries match this category.</p>';
    }

    function apply() {
      var cat = chips.getActive();
      render(EMERGENCY.filter(function (e) { return cat === 'All' || e.category === cat; }));
    }

    var chips = buildChips(filtersEl, EMERGENCY, apply);
    apply();
  }

  function boot() {
    initMapSection();
    initBusinessSection();
    initOrganizationSection();
    initEmergencySection();

    // Newly injected cards use the same .reveal convention as the rest of the
    // site, but main.js's IntersectionObserver already ran before these
    // existed — show them directly instead of duplicating an observer.
    document.querySelectorAll('.dir-card-grid .reveal').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
