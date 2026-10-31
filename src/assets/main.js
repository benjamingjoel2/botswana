// Progressive enhancement only: every page works without this file.
(function () {
  'use strict';

  // Header: transparent over a photo hero, solid once the page scrolls.
  var header = document.querySelector('[data-header]');
  if (header && document.body.classList.contains('has-overlay')) {
    var onScroll = function () {
      header.classList.toggle('is-over', window.scrollY < 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Full-screen menu on small screens.
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('menu');
  if (toggle && menu) {
    var setMenu = function (open) {
      menu.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.querySelector('.nav-toggle-text').textContent = open ? toggle.dataset.labelClose : toggle.dataset.labelOpen;
      document.body.classList.toggle('menu-open', open);
      if (open) menu.querySelector('a').focus();
    };
    toggle.addEventListener('click', function () { setMenu(menu.hidden); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) { setMenu(false); toggle.focus(); }
    });
  }

  // Reveal on scroll. Content is visible without JS, and is shown anyway
  // after a moment if IntersectionObserver is missing.
  var reveal = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    reveal.forEach(function (el) { io.observe(el); });
  } else {
    reveal.forEach(function (el) { el.classList.add('is-in'); });
  }

  // "Water or dry?" chooser: one month visible at a time.
  document.querySelectorAll('[data-chooser]').forEach(function (root) {
    var buttons = root.querySelectorAll('.month-btn');
    var panels = root.querySelectorAll('.month-panel');
    function show(m, focus) {
      buttons.forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.dataset.month === String(m)));
      });
      panels.forEach(function (p) {
        p.classList.toggle('is-active', p.dataset.panel === String(m));
      });
      if (focus) {
        var b = root.querySelector('.month-btn[data-month="' + m + '"]');
        if (b) b.focus();
      }
    }
    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        show(b.dataset.month);
      });
      b.addEventListener('keydown', function (e) {
        var m = Number(b.dataset.month);
        if (e.key === 'ArrowRight') { e.preventDefault(); show((m % 12) + 1, true); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); show(((m + 10) % 12) + 1, true); }
      });
    });
    show(root.dataset.initial || 1);
  });

  // Flying page: switch journey routes on the map.
  document.querySelectorAll('[data-route-switch]').forEach(function (root) {
    var chips = root.querySelectorAll('[data-show-route]');
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var slug = chip.dataset.showRoute;
        chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
        root.querySelectorAll('[data-route-panel]').forEach(function (p) {
          p.classList.toggle('is-active', p.dataset.routePanel === slug);
        });
        root.querySelectorAll('.m-route').forEach(function (g) {
          g.classList.toggle('is-active', g.dataset.route === slug);
        });
      });
    });
  });

  // Enquiry form: prefill from ?journey= / ?place=, then submit.
  var form = document.getElementById('enquiry-form');
  if (form) {
    var params = new URLSearchParams(location.search);
    if (params.get('journey')) form.elements.journey.value = params.get('journey');
    if (params.get('place')) {
      form.querySelectorAll('input[name="places"]').forEach(function (i) {
        if (i.value === params.get('place')) i.checked = true;
      });
    }

    var status = form.querySelector('.form-status');
    form.addEventListener('submit', function (e) {
      if (!form.checkValidity()) return;
      e.preventDefault();
      var data = new FormData(form);
      var endpoint = form.dataset.endpoint;

      if (endpoint) {
        status.textContent = form.dataset.labelSending;
        fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
          .then(function (r) {
            if (!r.ok) throw new Error(r.status);
            location.href = form.dataset.thanks;
          })
          .catch(function () {
            status.textContent = form.dataset.labelError;
          });
        return;
      }

      // No form service configured: open the visitor's email app.
      var lines = [];
      var seen = {};
      data.forEach(function (value, key) {
        if (!value) return;
        if (seen[key]) { lines[seen[key]] += ', ' + value; return; }
        seen[key] = lines.length;
        lines.push(key.charAt(0).toUpperCase() + key.slice(1) + ': ' + value);
      });
      location.href = 'mailto:' + form.dataset.email +
        '?subject=' + encodeURIComponent(form.dataset.subject) +
        '&body=' + encodeURIComponent(lines.join('\n'));
      status.textContent = form.dataset.labelMailto;
    });
  }
})();
