const { html, raw } = require('../lib/html');
const config = require('../../site.config');

const NAV = [
  ['/destinations/', 'Destinations'],
  ['/journeys/', 'Journeys'],
  ['/when-to-go/', 'When to go'],
  ['/flying/', 'Flying between camps'],
  ['/stays/', 'Stays'],
  ['/journal/', 'Journal'],
  ['/about/', 'About'],
];

function layout({ title, description, path, body, image, bodyClass = '' }) {
  const { brand, contact, siteUrl } = config;
  const fullTitle = path === '/' ? `${brand.name}: private, low-impact safaris in Botswana` : `${title} | ${brand.name}`;
  const desc = description || brand.tagline;
  const navLink = ([href, label]) =>
    html`<li><a href="${href}"${path.startsWith(href) ? raw(' aria-current="page"') : ''}>${label}</a></li>`;

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
<meta name="theme-color" content="${config.palette.papyrus}">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://images.unsplash.com">
<link rel="stylesheet" href="/assets/styles.css">
<script>document.documentElement.classList.add('js')</script>
<script src="/assets/main.js" defer></script>
</head>
<body class="${bodyClass}">
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap header-inner">
    <a class="logo" href="/">${raw(logoMark())}<span>${brand.name}</span></a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
    <nav id="site-nav" class="site-nav" aria-label="Main">
      <ul>
        ${NAV.map(navLink)}
        <li><a class="btn btn-small" href="/enquire/"${path.startsWith('/enquire/') ? raw(' aria-current="page"') : ''}>Enquire</a></li>
      </ul>
    </nav>
  </div>
</header>
<main id="main">
${raw(String(body))}
</main>
<footer class="site-footer">
  <div class="wrap footer-grid">
    <div>
      <p class="footer-brand">${brand.name}</p>
      <p>${brand.tagline}</p>
    </div>
    <div>
      <h2 class="footer-h">Contact</h2>
      <p><a href="mailto:${contact.email}">${contact.email}</a><br>
      <a href="tel:${contact.phone.replace(/\s/g, '')}">${contact.phone}</a><br>
      ${contact.office}<br>
      <span class="muted">${contact.hours}</span></p>
    </div>
    <div>
      <h2 class="footer-h">Explore</h2>
      <ul class="footer-links">
        ${NAV.map(([href, label]) => html`<li><a href="${href}">${label}</a></li>`)}
        <li><a href="/enquire/">Enquire</a></li>
        <li><a href="/credits/">Photo credits</a></li>
      </ul>
    </div>
  </div>
  <div class="wrap footer-small">
    <p>© ${new Date().getFullYear()} ${brand.name}. Sample itineraries and placeholder camp names are for illustration; details are confirmed when you book.</p>
  </div>
</footer>
</body>
</html>`}`;
}

// A simple mokoro mark: a canoe, a poler and the waterline.
function logoMark() {
  return `<svg class="logo-mark" viewBox="0 0 40 40" aria-hidden="true" focusable="false"><circle cx="20" cy="20" r="19" fill="var(--papyrus)"/><path d="M8 25c6 3 18 3 24 0" stroke="var(--sand)" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M24 24 29 8" stroke="var(--sand)" stroke-width="1.6" stroke-linecap="round"/><circle cx="24" cy="13" r="2" fill="var(--sand)"/><path d="M24 15v7" stroke="var(--sand)" stroke-width="2" stroke-linecap="round"/><path d="M9 30c3-1.2 5 1.2 8 0s5 1.2 8 0 5 1.2 7 0" stroke="var(--floodLight)" stroke-width="1.4" fill="none" stroke-linecap="round"/></svg>`;
}

module.exports = { layout, logoMark };
