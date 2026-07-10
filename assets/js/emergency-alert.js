/* Emergency Alert System — Public (Phase 2) */
(function () {
  'use strict';

  var API_URL = '/api/emergency-alerts/active';
  var POLL_INTERVAL = 60000;

  // Track current displayed alert to detect changes across polls
  var _currentId = null;
  var _currentVersion = null;

  function ackKey(id, version) {
    return 'EmergencyAlert_' + id + '_Version_' + version;
  }

  function isAcknowledged(id, version) {
    try { return localStorage.getItem(ackKey(id, version)) === 'true'; } catch (e) { return false; }
  }

  function acknowledge(id, version) {
    try { localStorage.setItem(ackKey(id, version), 'true'); } catch (e) {}
  }

  function esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function priorityClass(p) {
    if (p === 'Critical') return 'ea-banner-critical';
    if (p === 'Warning')  return 'ea-banner-warning';
    return 'ea-banner-advisory';
  }

  function alertSlug(title) {
    return (title || 'alert').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  function warningIconSVG() {
    return '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="width:100%;height:100%">' +
      '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M12 9v4M12 17h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
      '</svg>';
  }

  // ── Banner ──────────────────────────────────────────────────────────────────
  function removeBanner() {
    var el = document.getElementById('ea-banner');
    if (el && el.parentNode) el.parentNode.removeChild(el);
    _currentId = null;
    _currentVersion = null;
  }

  function showBanner(alert) {
    // Remove existing banner first so we always render fresh
    var existing = document.getElementById('ea-banner');
    if (existing && existing.parentNode) existing.parentNode.removeChild(existing);

    var slug = alertSlug(alert.title);
    var areaNote = alert.targetArea ? ' &mdash; ' + esc(alert.targetArea) : '';
    var detailUrl = '/emergency-alerts/' + esc(slug) + '?id=' + esc(alert.id);

    var banner = document.createElement('div');
    banner.id = 'ea-banner';
    banner.className = 'ea-banner is-visible ' + priorityClass(alert.priority);
    banner.setAttribute('role', 'alert');
    banner.setAttribute('aria-live', 'polite');
    banner.innerHTML =
      '<div class="ea-banner-inner container">' +
        '<span class="ea-banner-icon">' + warningIconSVG() + '</span>' +
        '<div class="ea-banner-body">' +
          '<div class="ea-banner-title">&#x1F6A8; ' + esc(alert.priority) + ' Alert &mdash; ' + esc(alert.title) + '</div>' +
          '<div class="ea-banner-msg">' + esc(alert.message) + areaNote + '</div>' +
        '</div>' +
        '<div class="ea-banner-actions">' +
          '<a class="ea-banner-link" href="' + detailUrl + '">View Details</a>' +
          '<button class="ea-banner-close" aria-label="Close alert banner" id="ea-banner-close-btn">' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>' +
          '</button>' +
        '</div>' +
      '</div>';

    var header = document.querySelector('.site-header');
    if (header && header.parentNode) {
      header.parentNode.insertBefore(banner, header.nextSibling);
    } else {
      document.body.insertBefore(banner, document.body.firstChild);
    }

    document.getElementById('ea-banner-close-btn').addEventListener('click', function () {
      removeBanner();
    });
  }

  // ── Popup ───────────────────────────────────────────────────────────────────
  function removePopup() {
    var el = document.getElementById('ea-popup-overlay');
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  function showPopup(alert) {
    removePopup();

    var slug = alertSlug(alert.title);
    var detailUrl = '/emergency-alerts/' + esc(slug) + '?id=' + esc(alert.id);

    var areaHtml = alert.targetArea
      ? '<div class="ea-popup-meta-row">&#x1F4CD; Affected area: <strong style="margin-left:3px">' + esc(alert.targetArea) + '</strong></div>'
      : '';
    var instrHtml = alert.instructions
      ? '<div class="ea-popup-section">' +
          '<div class="ea-popup-section-label">What To Do</div>' +
          '<p class="ea-popup-instr">' + esc(alert.instructions) + '</p>' +
        '</div>'
      : '';

    var overlay = document.createElement('div');
    overlay.id = 'ea-popup-overlay';
    overlay.className = 'ea-popup-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Critical Emergency Alert');
    overlay.innerHTML =
      '<div class="ea-popup-box">' +
        '<div class="ea-popup-head">' +
          '<div class="ea-popup-label">&#x1F6A8; Critical Emergency Alert</div>' +
          '<div class="ea-popup-title">' + esc(alert.title) + '</div>' +
          '<div class="ea-popup-badges">' +
            '<span class="ea-popup-badge ea-popup-badge-type">' + esc(alert.alertType) + '</span>' +
            '<span class="ea-popup-badge ea-popup-badge-priority">Critical Priority</span>' +
          '</div>' +
        '</div>' +
        '<div class="ea-popup-body">' +
          '<div class="ea-popup-section">' +
            '<div class="ea-popup-section-label">Emergency Message</div>' +
            '<p class="ea-popup-msg">' + esc(alert.message) + '</p>' +
          '</div>' +
          instrHtml +
          areaHtml +
        '</div>' +
        '<div class="ea-popup-foot">' +
          '<a class="ea-popup-btn-detail" href="' + detailUrl + '" id="ea-popup-detail-btn">View Details</a>' +
          '<button class="ea-popup-btn-close" id="ea-popup-close-btn">Close</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);

    function closePopup() {
      acknowledge(alert.id, alert.version);
      removePopup();
    }

    document.getElementById('ea-popup-close-btn').addEventListener('click', closePopup);
    // Acknowledge when navigating to detail page so popup doesn't reappear there
    document.getElementById('ea-popup-detail-btn').addEventListener('click', function () {
      acknowledge(alert.id, alert.version);
    });
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closePopup();
    });
  }

  // ── Skip popup on the detail page itself ─────────────────────────────────────
  var _isDetailPage = document.body.getAttribute('data-page') === 'emergency-alert-detail.html';

  // ── Resolved toast ───────────────────────────────────────────────────────────
  function showResolvedToast() {
    var existing = document.getElementById('ea-toast');
    if (existing && existing.parentNode) existing.parentNode.removeChild(existing);

    var toast = document.createElement('div');
    toast.id = 'ea-toast';
    toast.className = 'ea-toast';
    toast.innerHTML =
      '<div class="ea-toast-icon">' +
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>' +
      '</div>' +
      '<div class="ea-toast-content">' +
        '<div class="ea-toast-title">Situation Resolved</div>' +
        '<div class="ea-toast-msg">The emergency alert has been lifted. Residents may return to normal activities.</div>' +
      '</div>' +
      '<button class="ea-toast-close" id="ea-toast-close" aria-label="Dismiss">&#x2715;</button>' +
      '<div class="ea-toast-progress"><div class="ea-toast-bar"></div></div>';

    document.body.appendChild(toast);
    setTimeout(function () { toast.classList.add('is-visible'); }, 16);

    function dismiss() {
      clearTimeout(autoTimer);
      toast.classList.remove('is-visible');
      setTimeout(function () { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 400);
    }

    var autoTimer = setTimeout(dismiss, 6000);
    document.getElementById('ea-toast-close').addEventListener('click', dismiss);
  }

  // ── Core logic ───────────────────────────────────────────────────────────────
  function applyAlert(data) {
    if (!data || !data.active) {
      console.log('[EA] No active alert.');
      if (_currentId !== null) showResolvedToast();
      removeBanner();
      removePopup();
      return;
    }

    var acked = isAcknowledged(data.id, data.version);
    var showingPopup = data.enablePopup && !acked;
    console.log('[EA] Active alert received.');
    console.log('[EA] ID:', data.id, '| Priority:', data.priority, '| Alert Type:', data.alertType);
    console.log('[EA] enablePopup:', data.enablePopup, '| Acknowledged:', acked, '| Showing popup:', showingPopup);
    console.log('[EA] Banner class:', priorityClass(data.priority));

    showBanner(data);
    _currentId = data.id;
    _currentVersion = data.version;

    if (showingPopup && !_isDetailPage) {
      showPopup(data);
    } else {
      removePopup();
    }
  }

  function checkAlerts() {
    fetch(API_URL)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        console.log('[EA] API response:', JSON.stringify(data));
        applyAlert(data);
      })
      .catch(function (err) {
        console.log('[EA] Fetch error:', err);
      });
  }

  // Run immediately on load, then poll every 60 seconds
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkAlerts);
  } else {
    checkAlerts();
  }
  setInterval(checkAlerts, POLL_INTERVAL);
})();
