const { html } = require('../lib/html');
const destinations = require('../data/destinations');
const { hubs, journeys } = require('../data/journeys');
const geo = require('../lib/geo');

const bySlug = Object.fromEntries(destinations.map((d) => [d.slug, d]));
const place = (key) => hubs[key] || bySlug[key];

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

module.exports = { routeMap, legTable, legs, place, bySlug };
