const { html, raw } = require('../lib/html');
const config = require('../../site.config');
const photos = require('../data/photos');
const destinations = require('../data/destinations');
const months = require('../data/months');
const { hubs, journeys } = require('../data/journeys');
const geo = require('../lib/geo');

const bySlug = Object.fromEntries(destinations.map((d) => [d.slug, d]));
const place = (key) => hubs[key] || bySlug[key];

// ---------------------------------------------------------------- photos ---

const UTM = `utm_source=${encodeURIComponent(config.brand.name.toLowerCase().replace(/\s+/g, '_'))}&utm_medium=referral`;
const withUtm = (url) => url + (url.includes('?') ? '&' : '?') + UTM;

function imgUrl(src, w, h) {
  const p = `auto=format&fit=crop&w=${w}&q=70` + (h ? `&h=${h}` : '');
  return `${src}?${p}`;
}

// The first photo from a list of keys that exists in photos.js.
function firstPhoto(keys = []) {
  return keys.map((k) => photos[k]).find(Boolean);
}

function credit(p) {
  return html`Photo: <a href="${withUtm(p.profile)}">${p.photographer}</a> on <a href="${withUtm('https://unsplash.com/')}">Unsplash</a>, ${p.location}`;
}

// Responsive photo with credit. When no verified photo exists for a place we
// draw an illustration instead of using a photo from somewhere else.
function photo(keys, { sizes = '100vw', ratio = '3/2', eager = false, cls = '', kind = 'water', caption = true } = {}) {
  const p = firstPhoto([].concat(keys));
  if (!p) return illustration(kind, cls, ratio);
  const widths = [480, 800, 1200, 1800, 2400];
  const srcset = widths.map((w) => `${imgUrl(p.src, w)} ${w}w`).join(', ');
  return html`<figure class="photo ${cls}" style="--ratio:${ratio}">
  <img src="${imgUrl(p.src, 1200)}" srcset="${srcset}" sizes="${sizes}" alt="${p.alt}"
    ${eager ? raw('fetchpriority="high"') : raw('loading="lazy"')} decoding="async">
  ${caption ? html`<figcaption>${credit(p)}</figcaption>` : ''}
</figure>`;
}

function illustration(kind, cls, ratio) {
  const c = config.palette;
  const scenes = {
    water: `<rect width="600" height="400" fill="${c.floodLight}"/><path d="M0 250 Q150 225 300 245 T600 238 V400 H0Z" fill="${c.papyrusLight}"/><path d="M0 285 Q160 270 300 285 T600 280 V400 H0Z" fill="${c.flood}" opacity=".85"/><path d="M200 300c40 10 120 10 160 0" stroke="${c.ink}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M320 298 345 205" stroke="${c.ink}" stroke-width="3"/><circle cx="318" cy="246" r="7" fill="${c.ink}"/><path d="M318 253v38" stroke="${c.ink}" stroke-width="7" stroke-linecap="round"/><g stroke="${c.papyrus}" stroke-width="3">${[40, 60, 75, 520, 540, 560].map((x) => `<path d="M${x} 285 V${190 + (x % 30)}"/><circle cx="${x}" cy="${185 + (x % 30)}" r="9" fill="${c.papyrus}"/>`).join('')}</g>`,
    river: `<rect width="600" height="400" fill="${c.floodLight}"/><path d="M0 220 Q300 200 600 225 V400 H0Z" fill="${c.dune}"/><path d="M0 270 Q300 255 600 275 V400 H0Z" fill="${c.flood}" opacity=".85"/><g fill="${c.inkSoft}"><ellipse cx="250" cy="225" rx="45" ry="28"/><rect x="225" y="235" width="11" height="30"/><rect x="262" y="235" width="11" height="30"/><path d="M208 220 q-14 25 -4 45" stroke="${c.inkSoft}" stroke-width="8" fill="none"/></g>`,
    dry: `<rect width="600" height="400" fill="${c.sandDeep}"/><circle cx="470" cy="110" r="38" fill="${c.ochreBright}" opacity=".75"/><path d="M0 260 Q300 245 600 262 V400 H0Z" fill="${c.sand}"/><path d="M0 300 Q300 290 600 305" stroke="${c.dune}" stroke-width="2" fill="none"/><g fill="${c.inkSoft}"><rect x="120" y="170" width="18" height="92"/><path d="M100 175 Q129 120 158 175Z"/><path d="M129 170 l-30 -28 M129 170 l28 -32 M129 168 v-40" stroke="${c.inkSoft}" stroke-width="6"/></g>`,
  };
  return raw(`<figure class="photo illustration ${cls}" style="--ratio:${ratio}"><svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Illustration (no location-verified photo yet)">${scenes[kind] || scenes.water}</svg></figure>`);
}

// ----------------------------------------------------------------- cards ---

function destinationCard(d) {
  return html`<article class="card">
  <a class="card-link" href="/destinations/${d.slug}/">
    ${photo(d.photos, { sizes: '(min-width: 900px) 33vw, (min-width: 600px) 50vw, 100vw', kind: d.kind, caption: false })}
    <div class="card-body">
      <p class="eyebrow">${kindLabel(d.kind)}</p>
      <h3>${d.name}</h3>
      <p>${d.summary}</p>
    </div>
  </a>
</article>`;
}

function kindLabel(kind) {
  return { water: 'Water country', river: 'River country', dry: 'Dry country' }[kind];
}

function journeyCard(j) {
  return html`<article class="card">
  <a class="card-link" href="/journeys/${j.slug}/">
    ${photo(j.photo, { sizes: '(min-width: 900px) 33vw, (min-width: 600px) 50vw, 100vw', caption: false })}
    <div class="card-body">
      <p class="eyebrow">${j.nights} nights · ${j.season}</p>
      <h3>${j.name}</h3>
      <p>${j.summary}</p>
      <p class="route-line">${routeNames(j).join(' → ')}</p>
    </div>
  </a>
</article>`;
}

const routeNames = (j) => j.route.map((r) => place(r).name);

// ------------------------------------------------------- water or dry? ---

const monthName = (m) => months[m - 1].name;

function meter(label, value, cls) {
  return html`<div class="meter ${cls}">
  <span class="meter-label">${label}</span>
  <span class="meter-track" aria-hidden="true"><span class="meter-fill" style="width:${value * 20}%"></span></span>
  <span class="meter-value">${value}/5</span>
</div>`;
}

// `id` must be unique on the page. Without JavaScript every month is listed;
// with it, one month shows at a time.
function chooser(id, { initial = new Date().getMonth() + 1 } = {}) {
  return html`<div class="chooser" data-chooser id="${id}" data-initial="${initial}">
  <div class="chooser-year" role="group" aria-label="Choose a month">
    ${months.map(
      (mo) => html`<button type="button" class="month-btn" data-month="${mo.m}" aria-pressed="false" aria-controls="${id}-m${mo.m}">
      <span class="bars" aria-hidden="true">
        <span class="bar bar-water" style="height:${8 + mo.water * 16}%"></span>
        <span class="bar bar-pans" style="height:${8 + mo.pans * 16}%"></span>
      </span>
      <span class="month-label"><abbr title="${mo.name}">${mo.short}</abbr></span>
    </button>`
    )}
  </div>
  <p class="chooser-key"><span class="key key-water"></span> Water in the Delta <span class="key key-pans"></span> Green pans and Kalahari</p>
  <div class="chooser-panels">
    ${months.map((mo) => monthPanel(id, mo))}
  </div>
</div>`;
}

function monthPanel(id, mo) {
  const lean = mo.water > mo.pans ? 'water' : mo.pans > mo.water ? 'dry' : 'both';
  const leanText = { water: 'Lean to the water', dry: 'Lean to the dry country', both: 'A bit of both' }[lean];
  return html`<section class="month-panel" id="${id}-m${mo.m}" data-panel="${mo.m}" aria-labelledby="${id}-h${mo.m}">
  <div class="month-head">
    <h3 id="${id}-h${mo.m}">${mo.name}</h3>
    <p class="lean lean-${lean}">${leanText}</p>
  </div>
  <p class="month-headline">${mo.headline}</p>
  <div class="month-grid">
    <div class="side side-water">
      <h4>Water: the Okavango</h4>
      ${meter('Flood level', mo.water, 'm-water')}
      <p>${mo.water_note}</p>
    </div>
    <div class="side side-dry">
      <h4>Dry: pans and Kalahari</h4>
      ${meter('Green and busy', mo.pans, 'm-pans')}
      <p>${mo.dry_note}</p>
    </div>
  </div>
  <div class="month-grid month-lists">
    <div><h4>Good for</h4><ul>${mo.good.map((g) => html`<li>${g}</li>`)}</ul></div>
    <div><h4>Keep in mind</h4><ul>${mo.watch.map((g) => html`<li>${g}</li>`)}</ul>
    <p class="small">Rain: ${['none', 'very little', 'light', 'moderate', 'frequent', 'heavy'][mo.rain]} · Typical Maun temperatures ${mo.temp}</p></div>
  </div>
  <p class="month-go"><strong>Where to go in ${mo.name}:</strong> ${mo.go.map((s, i) => html`${i ? ', ' : ''}<a href="/destinations/${s}/">${bySlug[s].name}</a>`)}</p>
</section>`;
}

// -------------------------------------------------------------- the map ---

// Label placement around each marker: [dx, dy, text-anchor]
const LABELS = {
  maun: [-10, 18, 'end'],
  kasane: [10, -8, 'start'],
  'okavango-delta': [-12, 4, 'end'],
  moremi: [10, -6, 'start'],
  'chobe-riverfront': [-8, -10, 'end'],
  savuti: [10, 14, 'start'],
  linyanti: [-10, -8, 'end'],
  'makgadikgadi-pans': [0, 28, 'middle'],
  'nxai-pan': [10, -8, 'start'],
  'central-kalahari': [0, 22, 'middle'],
  'tsodilo-hills': [-10, -10, 'middle'],
};

const pts = (list) => list.map(([lon, lat]) => geo.project(lon, lat).join(',')).join(' ');

// Closed, smoothed outline through the given points (Catmull-Rom to Bezier).
function smooth(list) {
  const p = list.map(([lon, lat]) => geo.project(lon, lat));
  const n = p.length;
  let d = `M${p[0][0]} ${p[0][1]}`;
  for (let i = 0; i < n; i++) {
    const [p0, p1, p2, p3] = [p[(i - 1 + n) % n], p[i], p[(i + 1) % n], p[(i + 2) % n]];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1.map((v) => v.toFixed(1)).join(' ')} ${c2.map((v) => v.toFixed(1)).join(' ')} ${p2[0]} ${p2[1]}`;
  }
  return d + 'Z';
}

function ellipse(lon, lat, rxDeg, ryDeg, attrs) {
  const [cx, cy] = geo.project(lon, lat);
  const [x2] = geo.project(lon + rxDeg, lat);
  return `<ellipse cx="${cx}" cy="${cy}" rx="${(x2 - cx).toFixed(1)}" ry="${(ryDeg * 100).toFixed(1)}" ${attrs}/>`;
}

function baseMap() {
  const border = [
    [20, -23.5], [20, -22], [21, -22], [21, -18.32], [23.3, -17.98], [23.55, -18.3], [24, -18], [24.5, -17.86],
    [25.15, -17.8], [25.26, -17.79], [25.63, -18.5], [26.05, -19.3], [26.2, -19.6], [27.2, -20.5], [27.7, -21.1],
    [28, -21.6], [29.37, -22.19], [28, -22.6], [27, -23.6], [20, -23.6],
  ];
  const delta = [
    [22.35, -18.78], [21.98, -19.2], [22.1, -19.7], [22.6, -20.02], [23.1, -20.1], [23.5, -19.95], [23.78, -19.5],
    [23.62, -19.05], [23.1, -18.82], [22.6, -18.74],
  ];
  const ckgr = [[22.8, -20.85], [24.55, -20.85], [24.9, -21.6], [24.6, -22.7], [22.8, -22.7]];
  const [w, h] = [geo.WIDTH, geo.HEIGHT];
  const label = (lon, lat, text, cls, rot = 0) => {
    const [x, y] = geo.project(lon, lat);
    return `<text x="${x}" y="${y}" class="${cls}"${rot ? ` transform="rotate(${rot} ${x} ${y})"` : ''}>${text}</text>`;
  };
  const [sx, sy] = [w - 140, h - 24];
  const km100 = (100 / (111.32 * Math.cos((20 * Math.PI) / 180))) * 100 * Math.cos((20 * Math.PI) / 180); // 100 km in px
  return `
  <rect width="${w}" height="${h}" class="m-outside"/>
  <polygon points="${pts(border)}" class="m-country"/>
  <polygon points="${pts(ckgr)}" class="m-park"/>
  <polyline points="${pts([[21.55, -17.95], [21.78, -18.27], [22.1, -18.55], [22.4, -18.8]])}" class="m-river m-river-wide"/>
  <path d="${smooth(delta)}" class="m-delta"/>
  <polyline points="${pts([[23.3, -17.98], [23.55, -18.3], [24, -18], [24.5, -17.86], [25.15, -17.8], [25.26, -17.79]])}" class="m-river"/>
  <polyline points="${pts([[23.85, -18.18], [23.95, -18.4], [24.07, -18.57]])}" class="m-river m-river-thin"/>
  <polyline points="${pts([[23.43, -19.97], [23.9, -20.3], [24.3, -20.6], [24.6, -21.05]])}" class="m-river m-river-thin"/>
  ${ellipse(25.2, -20.72, 0.55, 0.32, 'class="m-pan"')}
  ${ellipse(26.0, -20.6, 0.28, 0.45, 'class="m-pan"')}
  ${ellipse(24.8, -19.86, 0.12, 0.1, 'class="m-pan"')}
  ${label(20.75, -20.5, 'NAMIBIA', 'm-country-label', -90)}
  ${label(22.2, -17.55, 'NAMIBIA', 'm-country-label')}
  ${label(26.15, -19.0, 'ZIMBABWE', 'm-country-label')}
  ${label(22.45, -21.9, 'BOTSWANA', 'm-country-label m-botswana')}
  ${label(22.25, -20.25, 'Okavango', 'm-water-label')}
  <g class="m-scale" transform="translate(${sx} ${sy})"><path d="M0 0h${km100.toFixed(1)}" /><path d="M0 -4v8M${km100.toFixed(1)} -4v8"/><text x="${(km100 / 2).toFixed(1)}" y="-8">100 km</text></g>
  <g class="m-north" transform="translate(${w - 30} 34)"><path d="M0 -16 7 6 0 1 -7 6Z"/><text y="22">N</text></g>`;
}

function marker(key) {
  const p = place(key);
  const [x, y] = geo.project(p.lon, p.lat);
  const [dx, dy, anchor] = LABELS[key] || [10, 4, 'start'];
  const isHub = Boolean(hubs[key]);
  const shape = isHub
    ? `<rect x="${x - 6}" y="${y - 6}" width="12" height="12" class="m-hub" transform="rotate(45 ${x} ${y})"/>`
    : `<circle cx="${x}" cy="${y}" r="6" class="m-dot m-dot-${p.kind}"/>`;
  const text = `<text x="${x + dx}" y="${y + dy}" text-anchor="${anchor}" class="m-label${isHub ? ' m-label-hub' : ''}">${p.name.replace(' Game Reserve', '')}</text>`;
  return isHub ? `<g>${shape}${text}</g>` : `<a href="/destinations/${key}/" class="m-place">${shape}${text}</a>`;
}

function legPath(a, b, i) {
  const [x1, y1] = geo.project(a.lon, a.lat);
  const [x2, y2] = geo.project(b.lon, b.lat);
  // Bend each leg a little to read as a flight arc.
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const bend = Math.min(40, len * 0.18) * (i % 2 ? -1 : 1);
  const cx = mx + (-(y2 - y1) / len) * bend;
  const cy = my + ((x2 - x1) / len) * bend;
  return `<path d="M${x1} ${y1} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2} ${y2}" class="m-leg" marker-end="url(#arrow)"/>`;
}

function legs(j) {
  const out = [];
  for (let i = 1; i < j.route.length; i++) {
    const a = place(j.route[i - 1]);
    const b = place(j.route[i]);
    const km = Math.round(geo.distanceKm(a, b));
    out.push({ from: a, to: b, km, min: geo.flightMinutes(km), i });
  }
  return out;
}

// One SVG with every journey's route as its own layer. `active` is the
// journey shown first; JS on the Flying page switches layers.
function routeMap({ active = journeys[0].slug, only = null, id = 'route-map' } = {}) {
  const list = only ? journeys.filter((j) => j.slug === only) : journeys;
  const keys = [...Object.keys(hubs), ...destinations.map((d) => d.slug)];
  return `<svg class="route-map" id="${id}" viewBox="0 0 ${geo.WIDTH} ${geo.HEIGHT}" role="group" aria-labelledby="${id}-title ${id}-desc">
  <title id="${id}-title">Schematic map of northern Botswana with light-aircraft routes between camps</title>
  <desc id="${id}-desc">Shows the Okavango Delta, Chobe, Linyanti, Savuti, the Makgadikgadi and Nxai pans, the Central Kalahari and Tsodilo Hills, with the gateway towns of Maun and Kasane. Positions are approximate. The route legs are listed in the table beside the map.</desc>
  <defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 10 5 0 10z" class="m-arrow"/></marker></defs>
  ${baseMap()}
  ${list.map((j) => `<g class="m-route${j.slug === active ? ' is-active' : ''}" data-route="${j.slug}">${legs(j).map((l) => legPath(l.from, l.to, l.i)).join('')}</g>`).join('')}
  ${keys.map(marker).join('')}
</svg>`;
}

function legTable(j) {
  const ls = legs(j);
  const total = Math.round(ls.reduce((s, l) => s + l.min, 0) / 5) * 5;
  const hm = total >= 60 ? `${Math.floor(total / 60)} h ${total % 60 ? `${total % 60} min` : ''}`.trim() : `${total} min`;
  return html`<div class="table-wrap" tabindex="0" role="region" aria-label="${j.name} flights"><table class="legs">
  <caption>${j.name}: flights, estimated</caption>
  <thead><tr><th scope="col">Flight</th><th scope="col">Distance*</th><th scope="col">Time*</th></tr></thead>
  <tbody>${ls.map((l) => html`<tr><th scope="row">${l.from.name} → ${l.to.name}</th><td>${l.km} km</td><td>~${l.min} min</td></tr>`)}</tbody>
  <tfoot><tr><td colspan="2">Total time in the air</td><td>~${hm}</td></tr></tfoot>
</table></div>`;
}

function luggageRule() {
  return html`<aside class="luggage" aria-labelledby="luggage-h">
  <div class="luggage-icon" aria-hidden="true">${raw(bagSvg())}</div>
  <div>
    <p class="eyebrow">The luggage rule</p>
    <h2 id="luggage-h" class="luggage-h"><span class="big">20 kg</span> per person, in a soft bag</h2>
    <ul class="luggage-list">
      <li><strong>Total weight,</strong> including hand luggage, cameras and lenses.</li>
      <li><strong>Soft bag only:</strong> no wheels, no rigid frame, no hard case. It has to squeeze into a small pod or hold.</li>
      <li><strong>About 25 × 30 × 62 cm.</strong> We send the exact size for your aircraft before you buy a bag.</li>
      <li><strong>Need more?</strong> An extra seat can sometimes be booked for gear, in advance.</li>
    </ul>
    <p class="small">Limits are set by the air charter operators and can be lower on some routes. <a href="/journal/packing-for-20-kg/">How to pack for 20 kg</a>.</p>
  </div>
</aside>`;
}

function bagSvg() {
  return `<svg viewBox="0 0 120 120"><path d="M38 36c0-12 44-12 44 0" fill="none" stroke="var(--ink)" stroke-width="5" stroke-linecap="round"/><path d="M18 46c0-7 6-10 12-10h60c6 0 12 3 12 10l4 50c0 7-5 10-12 10H26c-7 0-12-3-12-10Z" fill="var(--papyrus)"/><path d="M22 60h76" stroke="var(--sand)" stroke-width="3" stroke-dasharray="5 5"/><text x="60" y="92" text-anchor="middle" font-size="22" font-weight="700" fill="var(--white)">20 kg</text></svg>`;
}

module.exports = {
  photo,
  firstPhoto,
  imgUrl,
  credit,
  withUtm,
  destinationCard,
  journeyCard,
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
