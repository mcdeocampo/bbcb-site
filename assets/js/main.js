// Barangay Hulo Website - lightweight interactions only
(function () {
  const body = document.body;
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  // Single, safe mobile menu controller. Avoid duplicate toggle handlers.
  if (menuToggle && navMenu) {
    const closeMenu = () => {
      navMenu.classList.remove('open', 'active');
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      body.classList.remove('nav-open');
    };

    const openMenu = () => {
      navMenu.classList.add('open');
      menuToggle.classList.add('open');
      menuToggle.setAttribute('aria-expanded', 'true');
      body.classList.add('nav-open');
    };

    menuToggle.addEventListener('click', (event) => {
      event.stopPropagation();
      if (navMenu.classList.contains('open')) closeMenu();
      else openMenu();
    });

    document.addEventListener('click', (event) => {
      const clickedInside = navMenu.contains(event.target) || menuToggle.contains(event.target);
      if (!clickedInside) closeMenu();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) closeMenu();
    }, { passive: true });

    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });
  }

  // Active navigation state
  const currentPage = body.getAttribute('data-page') || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('data-page') === currentPage) link.classList.add('active');
  });

  // Auto-assign reveal animations to key sections/cards for a more modern feel
  const autoRevealSelectors = [
    '.section-heading',
    '.split-layout > *',
    '.card-grid > *',
    '.profile-grid > *',
    '.officials-grid > *',
    '.downloads-grid > *',
    '.document-list > *',
    '.contact-grid > *',
    '.footer-grid > *',
    '.official-mini',
    '.accordion .accordion-item',
    '.table-wrap'
  ];
  const revealVariants = ['reveal', 'reveal-left', 'reveal-right', 'reveal-zoom'];
  autoRevealSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, index) => {
      const hasReveal = revealVariants.some(cls => el.classList.contains(cls));
      if (!hasReveal) el.classList.add(revealVariants[index % revealVariants.length]);
      if (![1, 2, 3].some(n => el.classList.contains(`delay-${n}`)) && index > 0 && index < 4) {
        el.classList.add(`delay-${Math.min(index, 3)}`);
      }
    });
  });

  // Scroll reveal animation
  const revealItems = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-zoom');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px 40px 0px' });
    revealItems.forEach(item => observer.observe(item));
    // Fallback: ensure all reveal items become visible after 2s regardless
    setTimeout(() => {
      revealItems.forEach(item => item.classList.add('visible'));
    }, 2000);
  } else {
    revealItems.forEach(item => item.classList.add('visible'));
  }

  // Accordions for services / charter sections
  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.setAttribute('aria-expanded', 'false');
    trigger.addEventListener('click', () => {
      const content = trigger.nextElementSibling;
      const icon = trigger.querySelector('b');
      const item = trigger.closest('.accordion-item');
      const isOpen = content.classList.toggle('open');
      trigger.classList.toggle('open', isOpen);
      item?.classList.toggle('open', isOpen);
      trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (icon) icon.textContent = isOpen ? '−' : '+';
    });
  });

  // Header depth on scroll
  const updateHeaderState = () => {
    if (window.scrollY > 24) header?.classList.add('scrolled');
    else header?.classList.remove('scrolled');
  };
  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });

  // Back to top button
  const backToTop = document.querySelector('.back-to-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) backToTop?.classList.add('show');
    else backToTop?.classList.remove('show');
  }, { passive: true });
  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ── Status bar: Date + Time + Weather + AQI + Advisory ──────────────
  // All times/dates use Asia/Manila (Philippine Time). Fixed coordinates:
  // Barangay Bolbok / Batangas City: 13.7565° N, 121.0583° E

  const WMO = {
    0:'Clear Sky', 1:'Mainly Clear', 2:'Partly Cloudy', 3:'Overcast',
    45:'Foggy', 48:'Icy Fog', 51:'Light Drizzle', 53:'Drizzle',
    55:'Heavy Drizzle', 61:'Light Rain', 63:'Rain', 65:'Heavy Rain',
    71:'Light Snow', 73:'Snow', 75:'Heavy Snow', 77:'Snow Grains',
    80:'Light Showers', 81:'Showers', 82:'Heavy Showers',
    85:'Snow Showers', 86:'Heavy Snow Showers',
    95:'Thunderstorm', 96:'Thunderstorm w/ Hail', 99:'Thunderstorm w/ Hail'
  };

  function aqiInfo(v) {
    if (v <= 50)  return { label:'Good',          cls:'aqi-good',      advisory:'Good' };
    if (v <= 100) return { label:'Moderate',       cls:'aqi-moderate',  advisory:'Caution' };
    if (v <= 150) return { label:'Sensitive',      cls:'aqi-usg',       advisory:'Caution' };
    if (v <= 200) return { label:'Unhealthy',      cls:'aqi-unhealthy', advisory:'Avoid Outdoor' };
    if (v <= 300) return { label:'Very Unhealthy', cls:'aqi-very',      advisory:'Stay Indoors' };
    return               { label:'Hazardous',      cls:'aqi-hazardous', advisory:'Health Warning' };
  }

  // Date — updates once per minute (date won't change mid-session normally)
  const dateEl = document.getElementById('hero-date');
  if (dateEl) {
    const dateFmt = new Intl.DateTimeFormat('en-PH', {
      timeZone: 'Asia/Manila',
      weekday: 'short', month: 'long', day: 'numeric', year: 'numeric'
    });
    const tickDate = () => { dateEl.textContent = dateFmt.format(new Date()); };
    tickDate();
    setInterval(tickDate, 60000);
  }

  // Time — live clock, updates every second
  const timeEl = document.getElementById('hero-time');
  if (timeEl) {
    const timeFmt = new Intl.DateTimeFormat('en-PH', {
      timeZone: 'Asia/Manila',
      hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true
    });
    const tickTime = () => { timeEl.textContent = timeFmt.format(new Date()) + ' PHT'; };
    tickTime();
    setInterval(tickTime, 1000);
  }

  // Weather + AQI — fetch on load, refresh every 12 minutes
  const weatherEl  = document.getElementById('hero-weather');
  const aqiEl      = document.getElementById('hero-aqi');
  const advisoryEl = document.getElementById('hero-advisory');

  // Weather icon color class keyed to WMO code
  const WMO_CLS = (code) => {
    if (code === 0)                          return 'wx-clear';
    if (code <= 2)                           return 'wx-cloudy';
    if (code === 3)                          return 'wx-cloudy';
    if (code === 45 || code === 48)          return 'wx-fog';
    if (code >= 51 && code <= 67)            return 'wx-rain';
    if (code >= 71 && code <= 77)            return 'wx-snow';
    if (code >= 80 && code <= 82)            return 'wx-rain';
    if (code === 85 || code === 86)          return 'wx-snow';
    if (code >= 95)                          return 'wx-storm';
    return 'wx-cloudy';
  };

  const AQI_CLASSES = ['aqi-good','aqi-moderate','aqi-usg','aqi-unhealthy','aqi-very','aqi-hazardous'];

  function setFactClass(el, cls) {
    if (!el) return;
    // Remove any previous color class, keep base classes
    AQI_CLASSES.forEach(c => el.classList.remove(c));
    ['wx-clear','wx-cloudy','wx-fog','wx-rain','wx-snow','wx-storm'].forEach(c => el.classList.remove(c));
    if (cls) el.classList.add(cls);
  }

  const weatherFactEl  = document.getElementById('hero-fact-weather');
  const aqiFactEl      = document.getElementById('hero-fact-aqi');
  const advisoryFactEl = document.getElementById('hero-fact-advisory');

  function fetchWeather() {
    if (!weatherEl) return;

    var settled = false;
    var fails   = 0;
    var SOURCES = 2;

    function applyWeather(temp, desc, code) {
      if (settled) return;
      settled = true;
      weatherEl.textContent = Math.round(temp) + '°C · ' + desc;
      var cls = code != null ? WMO_CLS(code) : descToWxClass(desc);
      setFactClass(weatherFactEl, cls);
      console.log('[Bolbok Weather] displayed:', weatherEl.textContent);
    }

    function descToWxClass(d) {
      d = (d || '').toLowerCase();
      if (d.indexOf('thunder') > -1)                                    return 'wx-storm';
      if (d.indexOf('rain') > -1 || d.indexOf('drizzle') > -1
        || d.indexOf('shower') > -1)                                    return 'wx-rain';
      if (d.indexOf('snow') > -1 || d.indexOf('sleet') > -1)           return 'wx-snow';
      if (d.indexOf('fog') > -1  || d.indexOf('mist') > -1)            return 'wx-fog';
      if (d.indexOf('cloud') > -1 || d.indexOf('overcast') > -1)       return 'wx-cloudy';
      return 'wx-clear';
    }

    function onFail(label, reason) {
      console.error('[Bolbok Weather] ' + label + ' failed: ' + reason);
      fails++;
      if (fails >= SOURCES && !settled) {
        settled = true;
        weatherEl.textContent = 'Weather unavailable';
      }
    }

    // Source A — Open-Meteo (primary)
    var xhrA = new XMLHttpRequest();
    xhrA.open('GET', 'https://api.open-meteo.com/v1/forecast?latitude=13.7565&longitude=121.0583&current=temperature_2m,weather_code&timezone=Asia%2FManila');
    xhrA.timeout = 10000;
    xhrA.onload = function () {
      try {
        var d = JSON.parse(xhrA.responseText);
        applyWeather(d.current.temperature_2m, WMO[d.current.weather_code] || 'Fair', d.current.weather_code);
      } catch (e) { onFail('Open-Meteo', 'parse error'); }
    };
    xhrA.onerror   = function () { onFail('Open-Meteo', 'network error'); };
    xhrA.ontimeout = function () { onFail('Open-Meteo', 'timeout');       };
    xhrA.send();

    // Source B — wttr.in (fallback, fires simultaneously)
    var xhrB = new XMLHttpRequest();
    xhrB.open('GET', 'https://wttr.in/13.7565,121.0583?format=j1');
    xhrB.timeout = 10000;
    xhrB.onload = function () {
      try {
        var d = JSON.parse(xhrB.responseText);
        var c = d.current_condition[0];
        applyWeather(parseFloat(c.temp_C), c.weatherDesc[0].value, null);
      } catch (e) { onFail('wttr.in', 'parse error'); }
    };
    xhrB.onerror   = function () { onFail('wttr.in', 'network error'); };
    xhrB.ontimeout = function () { onFail('wttr.in', 'timeout');       };
    xhrB.send();
  }

  function fetchLocalAQI() {
    if (!aqiEl && !advisoryEl) return;
    fetch('https://air-quality-api.open-meteo.com/v1/air-quality?latitude=13.7565&longitude=121.0583&current=us_aqi&timezone=Asia%2FManila')
      .then(r => r.json())
      .then(d => {
        const raw = d.current?.us_aqi;
        if (raw == null || isNaN(raw)) throw new Error('no aqi');
        const v = Math.round(raw);
        const info = aqiInfo(v);
        if (aqiEl) {
          aqiEl.innerHTML = 'Local AQI ' + v + ' · <span class="' + info.cls + '">' + info.label + '</span>';
        }
        if (advisoryEl) {
          advisoryEl.innerHTML = '<span class="' + info.cls + '">' + info.advisory + '</span>';
        }
        setFactClass(aqiFactEl,      info.cls);
        setFactClass(advisoryFactEl, info.cls);
        console.log('[Bolbok AQI] displayed: Local AQI', v, info.label);
      })
      .catch(() => {
        if (aqiEl)      aqiEl.textContent      = 'Local AQI unavailable';
        if (advisoryEl) advisoryEl.textContent  = '—';
      });
  }

  fetchWeather();
  fetchLocalAQI();
  setInterval(fetchWeather,   15 * 60 * 1000);
  setInterval(fetchLocalAQI,  15 * 60 * 1000);
  // ─────────────────────────────────────────────────────────────────────

  // Static form readiness for future backend integration
  const contactForm = document.querySelector('.contact-form');
  contactForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    alert('Thank you. This static form is ready for future backend integration.');
  });

  // Lightweight pointer glow for desktop only
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.info-card, .official-card, .image-card, .download-card, .profile-item, .btn').forEach((el) => {
      el.addEventListener('pointermove', (event) => {
        const rect = el.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        el.style.setProperty('--mx', `${x}%`);
        el.style.setProperty('--my', `${y}%`);
      });
    });
  }

  // Citizen's Charter process section observer
  const processSection = document.querySelector('.charter-section');
  if (processSection) {
    const revealProcess = () => processSection.classList.add('process-in-view');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            revealProcess();
            observer.disconnect();
          }
        });
      }, { threshold: 0.22 });
      observer.observe(processSection);
    } else {
      revealProcess();
    }
  }
})();

// ── Site settings sync ────────────────────────────────────────────────────────
(function () {
  fetch('/api/site-settings').then(function (r) { return r.json(); }).then(function (s) {
    // Text content
    document.querySelectorAll('[data-setting]').forEach(function (el) {
      var key = el.getAttribute('data-setting');
      if (key === 'copyright') {
        var yr = s.copyright_year || '';
        var ow = s.copyright_owner || '';
        var sx = s.copyright_suffix || '';
        if (yr || ow || sx) el.textContent = '© ' + yr + ' ' + ow + '. ' + sx;
      } else {
        el.textContent = s[key] || '';
        if (el.tagName === 'A') {
          var phoneKeys = { footer_phone: 1, barangay_phone: 1, homepage_hotline_number: 1, emergency_card_number: 1, police_card_number: 1 };
          var emailKeys = { footer_email: 1, barangay_email: 1 };
          if (s[key]) {
            if (phoneKeys[key]) el.href = 'tel:' + s[key].replace(/[\s\-().\/]/g, '');
            else if (emailKeys[key]) el.href = 'mailto:' + s[key];
          } else {
            el.removeAttribute('href');
          }
        }
      }
    });
    // href attributes — the element always renders; a link is attached only when
    // its URL is configured. Without a URL it stays inert (no href) rather than
    // falling back to a stale hardcoded link.
    document.querySelectorAll('[data-setting-href]').forEach(function (el) {
      var key = el.getAttribute('data-setting-href');
      if (s[key]) { el.href = s[key]; }
      else { el.removeAttribute('href'); }
    });
    // An emergency tile exists only to dial its number, so drop the whole tile
    // when no number is configured rather than leaving a bare label.
    ['emergency_card_number', 'police_card_number'].forEach(function (key) {
      var el = document.querySelector('[data-setting="' + key + '"]');
      var tile = el && el.closest('.hero-emergency-item');
      if (tile) tile.style.display = s[key] ? '' : 'none';
    });
  }).catch(function (err) { console.error('[settings] /api/site-settings fetch failed:', err); });
})();
