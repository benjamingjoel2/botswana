// Geography helpers for the schematic map.

// Map window: northern and central Botswana.
const VIEW = { lonMin: 20.6, lonMax: 27.2, latMax: -17.3, latMin: -22.6 };
const K = 100; // pixels per degree of latitude
const COS = Math.cos((20 * Math.PI) / 180); // shrink longitude at ~20°S

const WIDTH = Math.round((VIEW.lonMax - VIEW.lonMin) * K * COS);
const HEIGHT = Math.round((VIEW.latMax - VIEW.latMin) * K);

function project(lon, lat) {
  return [
    Math.round((lon - VIEW.lonMin) * K * COS * 10) / 10,
    Math.round((VIEW.latMax - lat) * K * 10) / 10,
  ];
}

// Great-circle distance in km.
function distanceKm(a, b) {
  const R = 6371;
  const rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Rough flight time for a single-engine light aircraft: ~260 km/h cruise
// plus ~10 minutes for taxi, climb and approach, rounded to 5 minutes.
// This is an estimate for planning only; see FACTS-TO-VERIFY.md.
function flightMinutes(km) {
  const min = (km / 260) * 60 + 10;
  return Math.max(15, Math.round(min / 5) * 5);
}

module.exports = { VIEW, WIDTH, HEIGHT, project, distanceKm, flightMinutes };
