// Progressive enhancement only: every page works without this file.
(function () {
  'use strict';

  // Mobile menu
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
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
        status.textContent = 'Sending…';
        fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
          .then(function (r) {
            if (!r.ok) throw new Error(r.status);
            location.href = '/enquire/thanks/';
          })
          .catch(function () {
            status.textContent = 'Sorry, that did not send. Please email us at ' + form.dataset.email + '.';
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
      status.textContent = 'Your email app should open with the enquiry filled in. Please press send there.';
    });
  }
})();
