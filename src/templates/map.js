const { html } = require('../lib/html');
const destinations = require('../data/destinations');
const { hubs } = require('../data/journeys');
const geo = require('../lib/geo');

const bySlug = Object.fromEntries(destinations.map((d) => [d.slug, d]));
const place = (key) => hubs[key] || bySlug[key];

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

module.exports = { legTable, legs, place, bySlug };
