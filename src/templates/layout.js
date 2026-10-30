const { html, raw } = require('../lib/html');
const config = require('../../site.config');

const NAV = [
  ['/destinations/', 'Destinations'],
  ['/journeys/', 'Journeys'],
  ['/when-to-go/', 'When to go'],
  ['/flying/', 'Flying'],
  ['/stays/', 'Stays'],
  ['/journal/', 'Journal'],
  ['/about/', 'About'],
];

// `overlay: true` puts the header over a full-bleed hero (light text on a
// dark scrim) until the page scrolls; otherwise the header is solid.
function layout({ title, description, path, body, image, overlay = false }) {
  const { brand, contact, siteUrl } = config;
  const fullTitle = path === '/' ? `${brand.name}: private, low-impact safaris in Botswana` : `${title} | ${brand.name}`;
  const desc = description || brand.tagline;
  const current = (href) => (path.startsWith(href) ? raw(' aria-current="page"') : '');

  return `<!doctype html>
${html`<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${fullTitle}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${siteUrl + path}">
<meta property="og:title" content="${fullTitle}">
<meta property="og:description" content="${desc}">
<meta property="og:type" content="website">
<meta property="og:url" content="${siteUrl + path}">
${image ? html`<meta property="og:image" content="${image}">` : ''}
<meta name="theme-color" content="${config.palette.night}">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://images.unsplash.com">
${heroPreload(String(body))}
${config.fonts.preload.map((f) => html`<link rel="preload" href="${f}" as="font" type="font/woff2" crossorigin>`)}
<link rel="stylesheet" href="${config.assets.css}">
<script>document.documentElement.classList.add('js')</script>
<script src="${config.assets.js}" defer></script>
</head>
<body class="${overlay ? 'has-overlay' : ''}">
<a class="skip" href="#main">Skip to content</a>
<header class="site-header${overlay ? ' is-over' : ''}" data-header>
  <div class="header-inner">
    <a class="logo" href="/">${raw(logoMark())}<span>${brand.name}</span></a>
    <nav class="site-nav" id="site-nav" aria-label="Main">
      <ul>${NAV.map(([href, label]) => html`<li><a href="${href}"${current(href)}>${label}</a></li>`)}</ul>
    </nav>
    <a class="header-cta" href="/enquire/"${current('/enquire/')}>Enquire</a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="menu"><span class="nav-toggle-bars" aria-hidden="true"></span><span class="nav-toggle-text">Menu</span></button>
  </div>
</header>
<div class="menu" id="menu" hidden>
  <nav aria-label="Menu">
    <ol>
      ${NAV.map(([href, label], i) => html`<li><a href="${href}"${current(href)}><span class="mono">${String(i + 1).padStart(2, '0')}</span>${label}</a></li>`)}
      <li><a href="/enquire/"${current('/enquire/')}><span class="mono">08</span>Enquire</a></li>
    </ol>
  </nav>
  <p class="menu-contact mono"><a href="mailto:${contact.email}">${contact.email}</a></p>
</div>
<main id="main">
${raw(String(body))}
</main>
<footer class="site-footer">
  <div class="wrap">
    <div class="footer-top">
      <p class="footer-claim">${brand.tagline}</p>
      <a class="btn btn-light" href="/enquire/"><span>Start an enquiry</span><span class="btn-disc" aria-hidden="true"><svg viewBox="0 0 16 16" width="14" height="14"><path d="M4 12 12 4M6 4h6v6" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></span></a>
    </div>
    <div class="footer-grid">
      <div>
        <h2 class="footer-h mono">Contact</h2>
        <p><a href="mailto:${contact.email}">${contact.email}</a><br>
        ${contact.office}</p>
        <p class="footer-muted">${contact.hours}</p>
      </div>
      <div>
        <h2 class="footer-h mono">Explore</h2>
        <ul class="footer-links">${NAV.map(([href, label]) => html`<li><a href="${href}">${label}</a></li>`)}</ul>
      </div>
      <div>
        <h2 class="footer-h mono">Small print</h2>
        <ul class="footer-links">
          <li><a href="/privacy/">Privacy policy</a></li>
          <li><a href="/terms/">Booking terms</a></li>
          <li><a href="/cookies/">Cookie policy</a></li>
        </ul>
        <p class="footer-muted">Sample itineraries and placeholder camp names are for illustration; details are confirmed when you book.</p>
      </div>
    </div>
  </div>
  <p class="footer-mark" aria-hidden="true">${brand.name}</p>
  <div class="wrap footer-small mono"><p>© ${new Date().getFullYear()} ${brand.name}</p><p>${brand.shortName} · Botswana</p></div>
</footer>
</body>
</html>`}`;
}

// Preload the page's hero (the one image marked fetchpriority="high") so the
// browser starts downloading it before it has parsed the body.
function heroPreload(body) {
  const tag = body.match(/<img [^>]*fetchpriority="high"[^>]*>/);
  if (!tag) return '';
  const attr = (n) => (tag[0].match(new RegExp(`\\s${n}="([^"]*)"`)) || [])[1];
  const srcset = attr('srcset');
  const sizes = attr('sizes');
  if (!srcset) return '';
  return raw(`<link rel="preload" as="image" href="${attr('src')}" imagesrcset="${srcset}" imagesizes="${sizes || '100vw'}" fetchpriority="high">`);
}

// A simple mokoro mark: a canoe, a poler and the waterline.
function logoMark() {
  return `<svg class="logo-mark" viewBox="0 0 40 40" aria-hidden="true" focusable="false"><circle cx="20" cy="20" r="19" fill="var(--papyrus)"/><path d="M8 25c6 3 18 3 24 0" stroke="var(--sand)" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M24 24 29 8" stroke="var(--sand)" stroke-width="1.6" stroke-linecap="round"/><circle cx="24" cy="13" r="2" fill="var(--sand)"/><path d="M24 15v7" stroke="var(--sand)" stroke-width="2" stroke-linecap="round"/><path d="M9 30c3-1.2 5 1.2 8 0s5 1.2 8 0 5 1.2 7 0" stroke="var(--floodLight)" stroke-width="1.4" fill="none" stroke-linecap="round"/></svg>`;
}

module.exports = { layout, logoMark };
