const { html, raw } = require('../lib/html');
const config = require('../../site.config');
const photos = require('../data/photos');
const destinations = require('../data/destinations');
const months = require('../data/months');
const { journeys } = require('../data/journeys');
const { routeMap, legTable, legs, place, bySlug } = require('./map');

// ---------------------------------------------------------------- photos ---


function imgUrl(src, w, h) {
  const p = `auto=format&fit=crop&w=${w}&q=72` + (h ? `&h=${h}` : '');
  return `${src}?${p}`;
}

// The first photo from a list of keys that exists in photos.js.
function firstPhoto(keys = []) {
  return [].concat(keys).map((k) => photos[k]).find(Boolean);
}

function img(p, { sizes = '100vw', eager = false, cls = '' } = {}) {
  const widths = [480, 800, 1200, 1800, 2400];
  const srcset = widths.map((w) => `${imgUrl(p.src, w)} ${w}w`).join(', ');
  return html`<img class="${cls}" src="${imgUrl(p.src, 1200)}" srcset="${srcset}" sizes="${sizes}" alt="${p.alt}"
    ${eager ? raw('fetchpriority="high"') : raw('loading="lazy"')} decoding="async">`;
}

// Responsive photo. When no verified photo exists for a place we
// draw an illustration instead of using a photo from somewhere else.
function photo(keys, { sizes = '100vw', ratio = '3/2', eager = false, cls = '', kind = 'water' } = {}) {
  const p = firstPhoto(keys);
  if (!p) return illustration(kind, cls, ratio);
  return html`<figure class="photo ${cls}" style="--ratio:${ratio}">
  ${img(p, { sizes, eager })}
</figure>`;
}

function illustration(kind, cls, ratio) {
  const c = config.palette;
  const scenes = {
    water: `<rect width="600" height="400" fill="${c.floodLight}"/><path d="M0 250 Q150 225 300 245 T600 238 V400 H0Z" fill="${c.papyrusLight}"/><path d="M0 285 Q160 270 300 285 T600 280 V400 H0Z" fill="${c.flood}" opacity=".85"/><path d="M200 300c40 10 120 10 160 0" stroke="${c.ink}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M320 298 345 205" stroke="${c.ink}" stroke-width="3"/><circle cx="318" cy="246" r="7" fill="${c.ink}"/><path d="M318 253v38" stroke="${c.ink}" stroke-width="7" stroke-linecap="round"/>`,
    river: `<rect width="600" height="400" fill="${c.floodLight}"/><path d="M0 220 Q300 200 600 225 V400 H0Z" fill="${c.dune}"/><path d="M0 270 Q300 255 600 275 V400 H0Z" fill="${c.flood}" opacity=".85"/>`,
    dry: `<rect width="600" height="400" fill="${c.sandDeep}"/><circle cx="470" cy="110" r="38" fill="${c.ochreBright}" opacity=".75"/><path d="M0 260 Q300 245 600 262 V400 H0Z" fill="${c.sand}"/><g fill="${c.inkSoft}"><rect x="120" y="170" width="18" height="92"/><path d="M100 175 Q129 120 158 175Z"/></g>`,
  };
  return raw(`<figure class="photo illustration ${cls}" style="--ratio:${ratio}"><svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Illustration (no location-verified photo yet)">${scenes[kind] || scenes.water}</svg></figure>`);
}

// ------------------------------------------------------------- small bits ---

// 19.45 → 19°27′
function dms(v) {
  const a = Math.abs(v);
  const d = Math.floor(a);
  const m = Math.round((a - d) * 60);
  return `${d}°${String(m).padStart(2, '0')}′`;
}
const coords = (p) => `${dms(p.lat)}S ${dms(p.lon)}E`;

const kindLabel = (kind) => ({ water: 'Water country', river: 'River country', dry: 'Dry country' })[kind];
const pad = (n) => String(n).padStart(2, '0');

// Pill button with an arrow disc, as used across the site.
function btn(href, label, cls = '') {
  return html`<a class="btn ${cls}" href="${href}"><span>${label}</span><span class="btn-disc" aria-hidden="true">${raw(arrow())}</span></a>`;
}
function arrow() {
  return '<svg viewBox="0 0 16 16" width="14" height="14"><path d="M4 12 12 4M6 4h6v6" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';
}

// Section label: "01 — Water or dry?"
function label(n, text) {
  return html`<p class="label"><span class="label-n">${n}</span> ${text}</p>`;
}

const routeNames = (j) => j.route.map((r) => place(r).name);
const monthName = (m) => months[m - 1].name;

// ----------------------------------------------------------------- heroes ---

// Full-bleed photo hero with the title set over a dark scrim. Falls back to a
// plain dark band when there is no verified photo.
function hero({ photo: keys, eyebrow, title, lede, meta, cls = '', actions }) {
  const p = firstPhoto(keys);
  return html`<section class="hero ${p ? '' : 'hero-plain'} ${cls}">
  ${p ? html`<div class="hero-media">${img(p, { eager: true, sizes: '100vw' })}</div>` : ''}
  <div class="hero-inner wrap">
    ${meta ? html`<p class="hero-meta mono">${meta}</p>` : ''}
    <div class="hero-text">
      ${eyebrow ? html`<p class="label label-light">${eyebrow}</p>` : ''}
      <h1 class="display">${title}</h1>
      ${lede ? html`<p class="hero-lede">${lede}</p>` : ''}
      ${actions || ''}
    </div>
  </div>
</section>`;
}

// Plain page head on sand, for pages without a lead photo.
function pageHead(n, eyebrow, title, lede) {
  return html`<header class="page-head grid-lines">
  <div class="wrap">
    ${label(n, eyebrow)}
    <h1 class="display display-dark">${title}</h1>
    ${lede ? html`<p class="lede">${lede}</p>` : ''}
  </div>
</header>`;
}

// ----------------------------------------------------------------- cards ---

function destinationRow(d, i) {
  const p = firstPhoto(d.photos);
  return html`<li>
  <a class="dest-row" href="/destinations/${d.slug}/">
    <span class="dest-n mono">${pad(i + 1)}</span>
    <span class="dest-thumb">${p ? img(p, { sizes: '160px' }) : raw('<span class="thumb-plain"></span>')}</span>
    <span class="dest-name">${d.name}</span>
    <span class="dest-kind mono">${kindLabel(d.kind)}</span>
    <span class="dest-coords mono">${coords(d)}</span>
    <span class="dest-arrow" aria-hidden="true">${raw(arrow())}</span>
  </a>
</li>`;
}

function destinationIndex(list = destinations) {
  return html`<ol class="dest-index">${list.map((d) => destinationRow(d, destinations.indexOf(d)))}</ol>`;
}

function destinationCard(d) {
  const p = firstPhoto(d.photos);
  return html`<a class="tile-card ${p ? '' : 'tile-plain'}" href="/destinations/${d.slug}/">
  ${p ? img(p, { sizes: '(min-width: 900px) 33vw, (min-width: 600px) 50vw, 100vw' }) : ''}
  <span class="tile-top mono">${coords(d)}</span>
  <span class="tile-bottom">
    <span class="label label-light">${kindLabel(d.kind)}</span>
    <span class="tile-title">${d.name}</span>
    <span class="tile-text">${d.summary}</span>
  </span>
</a>`;
}

// Tall journey cards that widen on hover or focus (desktop); stacked on mobile.
function journeyStrip(list = journeys) {
  return html`<div class="jstrip">
  ${list.map((j, i) => {
    const p = firstPhoto(j.photo);
    return html`<a class="jcard" href="/journeys/${j.slug}/">
      ${p ? img(p, { sizes: '(min-width: 900px) 50vw, 100vw' }) : ''}
      <span class="jcard-top mono"><span>${pad(i + 1)}</span><span>${j.nights} nights</span></span>
      <span class="jcard-body">
        <span class="label label-light">${j.season}</span>
        <span class="jcard-title">${j.name}</span>
        <span class="jcard-more">
          <span class="jcard-text">${j.summary}</span>
          <span class="jcard-route mono">${routeNames(j).join(' → ')}</span>
        </span>
      </span>
    </a>`;
  })}
</div>`;
}

function journeyCard(j) {
  const p = firstPhoto(j.photo);
  return html`<a class="tile-card" href="/journeys/${j.slug}/">
  ${p ? img(p, { sizes: '(min-width: 900px) 33vw, 100vw' }) : ''}
  <span class="tile-top mono">${j.nights} nights</span>
  <span class="tile-bottom">
    <span class="label label-light">${j.season}</span>
    <span class="tile-title">${j.name}</span>
    <span class="tile-text">${routeNames(j).join(' → ')}</span>
  </span>
</a>`;
}

// ------------------------------------------------------- water or dry? ---

function meter(text, value, cls) {
  return html`<div class="meter ${cls}">
  <span class="meter-label mono">${text}</span>
  <span class="meter-track" aria-hidden="true"><span class="meter-fill" style="width:${value * 20}%"></span></span>
  <span class="meter-value">${value}/5</span>
</div>`;
}

// `id` must be unique on the page. Without JavaScript every month is listed;
// with it, one month shows at a time.
function chooser(id, { initial = new Date().getMonth() + 1 } = {}) {
  return html`<div class="chooser" data-chooser id="${id}" data-initial="${initial}">
  <div class="chart">
    <div class="chart-keys mono" aria-hidden="true"><span class="k-water">Delta water</span><span class="k-pans">Green pans</span></div>
    <div class="chart-cols" role="group" aria-label="Choose a month">
      ${months.map(
        (mo) => html`<button type="button" class="mcol" data-month="${mo.m}" aria-pressed="false" aria-controls="${id}-m${mo.m}">
        <span class="tile t-water" style="--v:${mo.water / 5}" aria-hidden="true"></span>
        <span class="tile t-pans" style="--v:${mo.pans / 5}" aria-hidden="true"></span>
        <span class="mcol-label mono" aria-hidden="true">${mo.short}</span>
        <span class="visually-hidden">${mo.name}: Delta water ${mo.water} of 5, green pans ${mo.pans} of 5</span>
      </button>`
      )}
    </div>
  </div>
  <div class="chooser-panels">${months.map((mo) => monthPanel(id, mo))}</div>
</div>`;
}

function monthPanel(id, mo) {
  const lean = mo.water > mo.pans ? 'water' : mo.pans > mo.water ? 'dry' : 'both';
  const leanText = { water: 'Lean to the water', dry: 'Lean to the dry country', both: 'A bit of both' }[lean];
  return html`<section class="month-panel" id="${id}-m${mo.m}" data-panel="${mo.m}" aria-labelledby="${id}-h${mo.m}">
  <div class="month-top">
    <div>
      <p class="lean lean-${lean} mono">${leanText}</p>
      <h3 class="month-name" id="${id}-h${mo.m}">${mo.name}</h3>
      <p class="month-headline">${mo.headline}</p>
    </div>
    <dl class="month-facts">
      <div><dt class="mono">Rain</dt><dd>${['None', 'Very little', 'Light', 'Moderate', 'Frequent', 'Heavy'][mo.rain]}</dd></div>
      <div><dt class="mono">Maun, typical</dt><dd>${mo.temp}</dd></div>
    </dl>
  </div>
  <div class="month-sides">
    <div class="side">
      <h4 class="side-h">Water: the Okavango</h4>
      ${meter('Flood level', mo.water, 'm-water')}
      <p>${mo.water_note}</p>
    </div>
    <div class="side">
      <h4 class="side-h">Dry: pans and Kalahari</h4>
      ${meter('Green and busy', mo.pans, 'm-pans')}
      <p>${mo.dry_note}</p>
    </div>
    <div class="side">
      <h4 class="side-h">Good for</h4>
      <ul>${mo.good.map((g) => html`<li>${g}</li>`)}</ul>
    </div>
    <div class="side">
      <h4 class="side-h">Keep in mind</h4>
      <ul>${mo.watch.map((g) => html`<li>${g}</li>`)}</ul>
    </div>
  </div>
  <p class="month-go"><span class="mono">Where to go in ${mo.name}</span> ${mo.go.map((s) => html`<a href="/destinations/${s}/">${bySlug[s].name}</a>`)}</p>
</section>`;
}

// ---------------------------------------------------------------- luggage ---

function luggageRule() {
  return html`<section class="luggage" aria-labelledby="luggage-h">
  <div class="luggage-figure" aria-hidden="true"><span class="luggage-kg">20</span><span class="luggage-unit mono">kg</span></div>
  <div>
    <p class="label"><span class="label-n">!</span> The luggage rule</p>
    <h2 id="luggage-h" class="luggage-h">20 kg per person, in a soft bag</h2>
    <ul class="luggage-list">
      <li><strong>Total weight,</strong> including hand luggage, cameras and lenses.</li>
      <li><strong>Soft bag only:</strong> no wheels, no rigid frame, no hard case. It has to squeeze into a small pod or hold.</li>
      <li><strong>About 30 × 35 × 70 cm</strong> (width × height × length). Operators differ, so we send the exact size for your aircraft before you buy a bag.</li>
      <li><strong>Need more?</strong> An extra seat can sometimes be booked for gear, in advance.</li>
    </ul>
    <p class="small">Limits are set by the air charter operators and can be lower on some routes. <a href="/journal/packing-for-20-kg/">How to pack for 20 kg</a></p>
  </div>
</section>`;
}

module.exports = {
  photo,
  img,
  firstPhoto,
  imgUrl,
  btn,
  arrow,
  label,
  hero,
  pageHead,
  coords,
  pad,
  destinationCard,
  destinationIndex,
  journeyCard,
  journeyStrip,
  kindLabel,
  chooser,
  routeMap,
  legTable,
  legs,
  luggageRule,
  place,
  bySlug,
  monthName,
  routeNames,
};
