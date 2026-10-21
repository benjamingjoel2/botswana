const { html, raw } = require('../lib/html');
const config = require('../../site.config');
const destinations = require('../data/destinations');
const months = require('../data/months');
const stays = require('../data/stays');
const journal = require('../data/journal');
const photos = require('../data/photos');
const { journeys, hubs } = require('../data/journeys');
const c = require('./components');

const { brand, contact } = config;
const fmtDate = (iso) => new Date(iso + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
const ogImage = (keys) => {
  const p = c.firstPhoto(keys);
  return p ? c.imgUrl(p.src, 1200, 630) : null;
};

// Every page returns { path, title, description, body, image?, overlay? }.
// `overlay` is true when the page opens with a full-bleed photo hero.

// Closing call to action: full-bleed photo with a big line of type.
function closing(text = 'Tell us when you would like to travel and what matters to you. We reply personally, usually within two working days.', href = '/enquire/', key = 'botswana-1') {
  const p = c.firstPhoto(key);
  return html`<section class="closing">
  ${p ? html`<div class="closing-media">${c.img(p, { sizes: '100vw' })}</div>` : ''}
  <div class="wrap closing-inner">
    <p class="label label-light"><span class="label-n">→</span> Enquire</p>
    <h2 class="display">Plan a quiet safari.</h2>
    <p class="closing-text">${text}</p>
    ${c.btn(href, 'Start an enquiry', 'btn-light')}
  </div>
  ${p ? html`<p class="hero-credit">${c.credit(p)}</p>` : ''}
</section>`;
}

function sectionHead(n, eyebrow, title, lede, cls = '') {
  return html`<div class="section-head ${cls}">
  ${c.label(n, eyebrow)}
  <h2 class="h-xl">${title}</h2>
  ${lede ? html`<p class="lede">${lede}</p>` : ''}
</div>`;
}

function monthStrip(best) {
  return html`<ol class="month-strip" aria-label="Suggested months">
  ${months.map((m) => html`<li class="${best.includes(m.m) ? 'on' : ''}"><abbr title="${m.name}" aria-hidden="true">${m.short[0]}</abbr><span class="visually-hidden">${m.name}: ${best.includes(m.m) ? 'recommended' : 'possible, not our first choice'}</span></li>`)}
</ol>`;
}

const typicalDay = [
  ['05:45', 'Wake-up call', 'Coffee and rusks by the fire as the sky turns grey, then pink.'],
  ['06:30', 'Out on the water', 'By mokoro through the channels, or on foot across an island with your guide.'],
  ['10:30', 'Back for brunch', 'A long, late breakfast on the deck.'],
  ['12:00', 'The quiet hours', 'Sleep, read, sit in the hide. Elephants often come to camp at midday.'],
  ['15:30', 'Tea', 'Something cold, something baked.'],
  ['16:00', 'Afternoon outing', 'Boat, mokoro or drive, ending with a drink where the light is best.'],
  ['19:30', 'Dinner', 'Usually at one long table, with the guides.'],
  ['21:00', 'Night sounds', 'Reed frogs, hippos, a lion a long way off. No other lights.'],
];

// ------------------------------------------------------------------ home ---

function home() {
  const heroKey = 'okavango-4';
  const maun = hubs.maun;
  const kasane = hubs.kasane;
  return {
    path: '/',
    title: 'Home',
    overlay: true,
    description: `${brand.name}: private, low-impact safaris in Botswana. Small camps, few vehicles, the Okavango Delta and the Kalahari.`,
    image: ogImage(heroKey),
    body: html`
<section class="hero hero-home">
  <div class="hero-media">${c.img(photos[heroKey], { eager: true, sizes: '100vw' })}</div>
  <div class="hero-inner wrap">
    <p class="hero-meta mono">19°27′S 22°54′E · Okavango Delta, Botswana</p>
    <div class="hero-text">
      <p class="label label-light">Private safaris in Botswana</p>
      <h1 class="display display-hero">Quiet water,<br><em>open sand.</em></h1>
      <div class="hero-row">
        <p class="hero-lede">Small, low-impact journeys through the Okavango Delta, the northern rivers and the Kalahari pans, in camps where you may not see another vehicle all day.</p>
        <p class="hero-actions">${c.btn('/journeys/', 'Sample journeys', 'btn-light')} ${c.btn('#water-or-dry', 'Water or dry?', 'btn-ghost')}</p>
      </div>
    </div>
    <ol class="hero-strip">
      ${journeys.map((j, i) => html`<li><a href="/journeys/${j.slug}/">
        <span class="hs-thumb">${c.img(photos[j.photo], { sizes: '96px' })}</span>
        <span class="hs-text"><span class="mono">${c.pad(i + 1)} · ${j.nights} nights</span><span class="hs-name">${j.name}</span></span>
      </a></li>`)}
    </ol>
  </div>
  <p class="hero-credit">${c.credit(photos[heroKey])}</p>
</section>

<section class="section">
  <div class="wrap">
    ${c.label('01', 'High value, low volume')}
    <h2 class="visually-hidden">High value, low volume</h2>
    <p class="statement" data-reveal>Botswana chose fewer visitors, not more. We plan journeys around that idea: <em>camps of a handful of tents,</em> private concessions, a light aircraft between them, and enough time in each place to hear the river.</p>
    <ol class="principles">
      <li data-reveal><span class="mono">A</span><h3>Small camps</h3><p>A handful of tents, not a large lodge. It feels like staying with people who know the place.</p></li>
      <li data-reveal><span class="mono">B</span><h3>Few vehicles</h3><p>Private concessions where guides keep sightings quiet, and walking, mokoro and night drives are allowed.</p></li>
      <li data-reveal><span class="mono">C</span><h3>Light footprint</h3><p>Camps on raised decks that can be lifted away, solar power where possible, Botswana guides and staff.</p></li>
    </ol>
    <p><a class="text-link" href="/journal/high-value-low-volume/">How the model works, and its trade-offs</a></p>
  </div>
</section>

<section class="stats wrap" aria-label="Botswana in four numbers">
  <dl>
    <div data-reveal><dt class="stat">20<small>kg</small></dt><dd>Luggage per person on light aircraft, in a soft bag.</dd></div>
    <div data-reveal><dt class="stat">Jun–Aug</dt><dd>Usual peak of the Okavango flood, in the dry winter.</dd></div>
    <div data-reveal><dt class="stat">Dec–Mar</dt><dd>The rains turn the pans and the Kalahari green.</dd></div>
    <div data-reveal><dt class="stat">9</dt><dd>Places, from the Delta and the rivers to the salt pans.</dd></div>
  </dl>
</section>

<section class="band-night section" id="water-or-dry">
  <div class="wrap">
    ${sectionHead('02', 'Water or dry?', raw('Two seasons that point <em>in opposite directions.</em>'), 'The Okavango floods in the dry winter, roughly June to August. The pans and the Kalahari turn green in the summer rains, roughly December to March. Choose a month.', 'on-night')}
    ${c.chooser('chooser-home')}
    <p class="after"><a class="text-link" href="/when-to-go/">More on when to go</a></p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    ${sectionHead('03', 'Destinations', raw('Nine places, <em>two kinds of country.</em>'))}
    <div class="feature-pair">
      ${c.destinationCard(c.bySlug['okavango-delta'])}
      ${c.destinationCard(c.bySlug['makgadikgadi-pans'])}
    </div>
    ${c.destinationIndex()}
  </div>
</section>

<section class="section band-sand">
  <div class="wrap">
    ${sectionHead('04', 'Sample journeys', raw('Routes we would <em>start from.</em>'), 'Every journey is planned for you. These show how the pieces fit together.')}
  </div>
  <div class="wrap-wide">${c.journeyStrip()}</div>
</section>

<section class="section">
  <div class="wrap day">
    <div class="day-media">${c.photo('okavango-3', { ratio: '4/5', sizes: '(min-width: 900px) 40vw, 100vw' })}</div>
    <div>
      ${c.label('05', 'A day in a water camp')}
      <h2 class="h-xl">Early starts, <em>long middays.</em></h2>
      <ol class="day-list">
        ${typicalDay.map(([t, h, p]) => html`<li data-reveal><span class="day-time">${t}</span><div><h3>${h}</h3><p>${p}</p></div></li>`)}
      </ol>
      <p class="small">A typical rhythm. Times change with the season and from camp to camp.</p>
    </div>
  </div>
</section>

<section class="band-night section flying-band">
  <div class="wrap">
    ${c.label('06', 'Flying between camps')}
    <p class="codes" aria-label="Maun to Kasane">
      <span><span class="code">MUB</span><span class="mono">Maun · ${c.coords(maun)}</span></span>
      <span class="code-dash" aria-hidden="true">—</span>
      <span><span class="code">BBK</span><span class="mono">Kasane · ${c.coords(kasane)}</span></span>
    </p>
    <div class="split-map">
      <div>
        <p class="lede on-night">Most camps have their own sand airstrip. Small aircraft link them to each other and to the two gateways, flying low enough to count elephants.</p>
        ${c.luggageRule()}
        ${c.btn('/flying/', 'See every route', 'btn-light')}
      </div>
      <div class="map-card">${raw(c.routeMap({ id: 'home-map' }))}</div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    ${sectionHead('07', 'Journal', raw('Notes <em>from the field.</em>'))}
    <div class="journal-grid">${journal.slice(0, 3).map(articleCard)}</div>
  </div>
</section>
${closing()}`,
  };
}

// --------------------------------------------------------- destinations ---

function destinationsIndex() {
  const group = (kind, n, title, text) => html`<section class="section-sm">
  <div class="wrap">
    ${sectionHead(n, c.kindLabel(kind), title, text)}
    <div class="card-grid">${destinations.filter((d) => d.kind === kind).map(c.destinationCard)}</div>
  </div>
</section>`;
  return {
    path: '/destinations/',
    title: 'Destinations',
    overlay: true,
    image: ogImage('okavango-4'),
    description: 'The Okavango Delta, Moremi, Chobe, Savuti, Linyanti, the Makgadikgadi and Nxai pans, the Central Kalahari and Tsodilo Hills.',
    body: html`
${c.hero({ photo: 'botswana-2', eyebrow: 'Destinations', title: raw('Where we go <em>in Botswana.</em>'), lede: 'Northern Botswana divides into water country, river country and dry country. The best trips usually combine two of them.', meta: '9 places · northern and central Botswana' })}
<section class="section-sm">
  <div class="wrap split-map">
    <div>${c.label('00', 'All places')}${c.destinationIndex()}</div>
    <div class="map-card sticky">${raw(c.routeMap({ id: 'dest-map', active: null }))}<p class="small">Schematic map; positions are approximate. Select a place to read more.</p></div>
  </div>
</section>
${group('water', '01', raw('Water <em>country.</em>'), 'The Okavango Delta and Moremi: at their fullest in the dry winter months.')}
${group('river', '02', raw('River <em>country.</em>'), 'The Chobe and Linyanti rivers: elephant country, best late in the dry season.')}
${group('dry', '03', raw('Dry <em>country.</em>'), 'Savuti, the pans, the Kalahari and Tsodilo: open space, green after the rains, silver and silent in winter.')}
${closing()}`,
  };
}

function destinationPage(d, i) {
  const next = destinations[(i + 1) % destinations.length];
  const nextP = c.firstPhoto(next.photos);
  const hereStays = stays.filter((s) => s.place === d.slug);
  const hereJourneys = journeys.filter((j) => j.route.includes(d.slug));
  const gallery = d.photos.slice(1).filter((k) => photos[k]);
  const hasPhoto = Boolean(c.firstPhoto(d.photos));
  return {
    path: `/destinations/${d.slug}/`,
    title: d.name,
    overlay: hasPhoto,
    description: d.summary,
    image: ogImage(d.photos),
    body: html`
${c.hero({ photo: d.photos, eyebrow: `${c.pad(i + 1)} · ${c.kindLabel(d.kind)}`, title: d.name, lede: d.summary, meta: c.coords(d) })}
<section class="glance wrap" aria-label="At a glance">
  <div><p class="mono">Feel</p><p>${d.feel}</p></div>
  <div><p class="mono">Getting there</p><p>${d.airstrip}</p></div>
  <div><p class="mono">Best months</p>${monthStrip(d.best)}</div>
</section>
<section class="section-sm">
  <div class="wrap two-col">
    <div class="prose">
      <p class="intro">${d.intro[0]}</p>
      ${d.intro.slice(1).map((p) => html`<p>${p}</p>`)}
      <h2>What you do here</h2>
      <ul>${d.activities.map((a) => html`<li>${a}</li>`)}</ul>
      <h2>When to go</h2>
      <p>${d.bestNote}</p>
      <h2>Good to know</h2>
      <ul>${d.rules.map((a) => html`<li>${a}</li>`)}</ul>
    </div>
    <div class="aside">
      <p class="mono">Plan it</p>
      <p>Tell us your dates and we will suggest where ${d.name} fits.</p>
      ${c.btn(`/enquire/?place=${d.slug}`, `Enquire about ${d.name}`)}
    </div>
  </div>
</section>
${gallery.length ? html`<section class="section-sm"><div class="wrap"><h2 class="visually-hidden">Photos</h2><div class="mosaic mosaic-${Math.min(gallery.length, 3)}">${gallery.slice(0, 3).map((k) => c.photo(k, { sizes: '(min-width: 900px) 50vw, 100vw', ratio: '4/3' }))}</div></div></section>` : ''}
${d.nearby ? html`<section class="section-sm"><div class="wrap">${c.label('+', d.nearby.title)}${c.photo(d.nearby.photo, { ratio: '21/9' })}</div></section>` : ''}
${hereStays.length ? html`<section class="section-sm"><div class="wrap">${c.label('→', 'Where we might stay')}<div class="stay-grid">${hereStays.map(stayCard)}</div></div></section>` : ''}
${hereJourneys.length ? html`<section class="section-sm"><div class="wrap">${c.label('→', `Sample journeys with ${d.name}`)}<div class="card-grid">${hereJourneys.map(c.journeyCard)}</div></div></section>` : ''}
<a class="next" href="/destinations/${next.slug}/">
  ${nextP ? html`<span class="next-media">${c.img(nextP, { sizes: '100vw' })}</span>` : ''}
  <span class="wrap next-inner"><span class="label label-light">Next destination</span><span class="display">${next.name} →</span></span>
</a>`,
  };
}

// ------------------------------------------------------------- journeys ---

function journeysIndex() {
  return {
    path: '/journeys/',
    title: 'Sample journeys',
    overlay: true,
    image: ogImage('okavango-3'),
    description: 'Sample Botswana safari routes with day-by-day plans: flood season, green season, northern rivers and Tsodilo.',
    body: html`
${c.hero({ photo: 'okavango-2', eyebrow: 'Sample journeys', title: raw('Routes, <em>day by day.</em>'), lede: 'Starting points, not fixed packages. We change the order, the camps and the length to fit your dates and interests.', meta: `${journeys.length} routes · 3 to 10 nights` })}
<section class="section-sm">
  <div class="wrap"><h2 class="visually-hidden">All sample journeys</h2></div>
  <div class="wrap-wide">${c.journeyStrip()}</div>
</section>
${closing()}`,
  };
}

function journeyPage(j, i) {
  const ls = c.legs(j);
  return {
    path: `/journeys/${j.slug}/`,
    title: j.name,
    overlay: true,
    description: j.summary,
    image: ogImage(j.photo),
    body: html`
${c.hero({ photo: j.photo, eyebrow: `Journey ${c.pad(i + 1)} · ${j.nights} nights`, title: j.name, lede: j.summary, meta: c.routeNames(j).join(' → ') })}
<section class="glance wrap" aria-label="At a glance">
  <div><p class="mono">Length</p><p class="glance-big">${j.nights} nights</p></div>
  <div><p class="mono">Best months</p><p class="glance-big">${j.season}</p></div>
  <div><p class="mono">Pace</p><p>${j.pace}</p></div>
  <div><p class="mono">Flights</p><p>${ls.length} short flights</p></div>
</section>
<section class="band-night section">
  <div class="wrap split-map">
    <div>
      ${sectionHead('01', 'The route', raw('Camp to camp <em>by air.</em>'), null, 'on-night')}
      ${c.legTable(j)}
      <p class="small on-night">* Straight-line distances and estimated flying times. Real flights may stop at other airstrips on the way.</p>
    </div>
    <div class="map-card">${raw(c.routeMap({ id: `map-${j.slug}`, only: j.slug, active: j.slug }))}</div>
  </div>
</section>
<section class="section">
  <div class="wrap">
    ${sectionHead('02', 'Day by day', raw('How the days <em>unfold.</em>'))}
    <ol class="timeline">
      ${j.days.map((day) => {
        const pl = c.place(day.place);
        const p = c.firstPhoto(pl.photos || []);
        return html`<li data-reveal>
        <p class="day-label mono">${day.d}</p>
        <div class="tl-body">
          <h3>${day.title}</h3>
          <p class="where mono">${c.bySlug[day.place] ? html`<a href="/destinations/${day.place}/">${pl.name}</a>` : pl.name}</p>
          <p>${day.text}</p>
        </div>
        <div class="tl-thumb">${p ? c.img(p, { sizes: '(min-width: 900px) 220px, 100vw' }) : ''}</div>
      </li>`;
      })}
    </ol>
  </div>
</section>
<section class="section-sm"><div class="wrap">${c.luggageRule()}</div></section>
${closing('Like this route? Tell us your dates and we will suggest camps and a price range.', `/enquire/?journey=${j.slug}`, j.photo)}`,
  };
}

// ------------------------------------------------------------ when to go ---

function whenToGo() {
  return {
    path: '/when-to-go/',
    title: 'When to go',
    overlay: true,
    image: ogImage('botswana-2'),
    description: 'Botswana month by month: when the Okavango floods, when the pans turn green, and what each month is good for.',
    body: html`
${c.hero({ photo: 'botswana-2', eyebrow: 'When to go', title: raw('Water <em>or dry?</em>'), lede: 'Botswana works all year, but not in the same places. Choose a month to see where to go.', meta: 'Thunderstorm building, late afternoon, Botswana' })}
<section class="band-night section">
  <div class="wrap">
    ${sectionHead('01', 'Month by month', raw('Pick a month.'), null, 'on-night')}
    ${c.chooser('chooser-main')}
  </div>
</section>
<section class="section">
  <div class="wrap two-even">
    <div class="prose" data-reveal>
      ${c.label('02', 'The flood')}
      <h2 class="h-lg">Why the Delta floods <em>in the dry season</em></h2>
      <p>Rain falls on the highlands of Angola from about November to March. It takes months to travel down the Okavango River and spread across the almost flat Delta. So the water arrives in the central Delta around May and June and is usually highest from June to August, just as the rest of Botswana dries out. Wildlife walks in from the dry country to the permanent water.</p>
      <p><a class="text-link" href="/journal/reading-the-flood/">Reading the flood</a></p>
      ${c.photo('okavango-1', { sizes: '(min-width: 900px) 45vw, 100vw', ratio: '4/3' })}
    </div>
    <div class="prose" data-reveal>
      ${c.label('03', 'The rains')}
      <h2 class="h-lg">Why the pans are best <em>in the rains</em></h2>
      <p>The Makgadikgadi, Nxai Pan and the Central Kalahari have little permanent water. When the summer rains come, from about November or December, grass grows fast and zebra, wildebeest, springbok and gemsbok move in to graze and give birth. Predators follow. It is the green season: hot, stormy, beautiful and quieter in many camps.</p>
      ${c.photo('makgadikgadi-1', { sizes: '(min-width: 900px) 45vw, 100vw', ratio: '4/3' })}
    </div>
  </div>
</section>
<section class="section band-sand">
  <div class="wrap">
    ${sectionHead('04', 'The year at a glance', 'All twelve months')}
    <div class="table-wrap" tabindex="0" role="region" aria-label="The year at a glance">
    <table class="year-table">
      <thead><tr><th scope="col">Month</th><th scope="col">Delta water</th><th scope="col">Green pans</th><th scope="col">Rain</th><th scope="col">In short</th></tr></thead>
      <tbody>${months.map((m) => html`<tr><th scope="row">${m.name}</th><td>${m.water}/5</td><td>${m.pans}/5</td><td>${m.rain}/5</td><td>${m.headline}</td></tr>`)}</tbody>
    </table>
    </div>
    <p class="small">Typical patterns, not forecasts. Flood size and timing change each year with rainfall in Angola, and local rains vary.</p>
  </div>
</section>
${closing()}`,
  };
}

// ---------------------------------------------------------------- flying ---

function flying() {
  const { maun, kasane } = hubs;
  return {
    path: '/flying/',
    title: 'Flying between camps',
    description: 'Light-aircraft routes between safari camps in Botswana, with the 20 kg soft-bag luggage rule.',
    body: html`
<header class="band-night page-head-night">
  <div class="wrap">
    ${c.label('00', 'Flying between camps')}
    <h1 class="visually-hidden">Flying between camps</h1>
    <p class="codes" aria-hidden="true">
      <span><span class="code">MUB</span><span class="mono">Maun · ${c.coords(maun)}</span></span>
      <span class="code-dash">—</span>
      <span><span class="code">BBK</span><span class="mono">Kasane · ${c.coords(kasane)}</span></span>
    </p>
    <p class="lede on-night">Most camps in the Delta, Linyanti and Savuti have their own sand airstrip. Small aircraft link them to each other and to Maun and Kasane. Choose a journey to see its route.</p>
  </div>
</header>
<section class="band-night section-sm" data-route-switch>
  <div class="wrap">
    <div class="route-tabs" role="group" aria-label="Choose a journey">
      ${journeys.map((j, i) => html`<button type="button" class="chip" data-show-route="${j.slug}" aria-pressed="${i === 0 ? 'true' : 'false'}"><span class="mono">${c.pad(i + 1)}</span> ${j.name}</button>`)}
    </div>
    <div class="split-map">
      <div class="route-panels">
        ${journeys.map((j, i) => html`<div class="route-panel${i === 0 ? ' is-active' : ''}" data-route-panel="${j.slug}">
          ${c.legTable(j)}
          <p><a class="text-link on-night" href="/journeys/${j.slug}/">Day-by-day plan for ${j.name}</a></p>
        </div>`)}
        <p class="small on-night">* Distances are straight lines between approximate positions. Times assume a single-engine aircraft at about 260 km/h plus time to taxi, climb and land; real flights often stop at other airstrips to drop off or pick up guests.</p>
      </div>
      <div class="map-card">${raw(c.routeMap({ id: 'flying-map' }))}</div>
    </div>
  </div>
</section>
<section class="section-sm"><div class="wrap">${c.luggageRule()}</div></section>
<section class="section">
  <div class="wrap two-even">
    <div class="prose">
      ${c.label('01', 'On board')}
      <h2 class="h-lg">What the flights <em>are like</em></h2>
      <ul>
        <li>Usually single-engine aircraft with between about 5 and 12 passenger seats.</li>
        <li>Flights are shared with guests going to other camps, so a "direct" leg may include a short stop.</li>
        <li>You are weighed with your bag at check-in in Maun or Kasane. Please tell us your weight honestly when you book; it is used only for loading the aircraft.</li>
        <li>Flights are low, so the views of the Delta channels and herds are part of the safari.</li>
        <li>Schedules are set the day before and can change with weather and other guests' plans.</li>
      </ul>
    </div>
    <div class="prose">
      ${c.label('02', 'Gateways')}
      <h2 class="h-lg">Maun <em>and Kasane</em></h2>
      <p><strong>Maun</strong> is the base for the Okavango Delta, Moremi, the pans and the Central Kalahari. International travellers usually connect through Johannesburg or another regional hub.</p>
      <p><strong>Kasane</strong> is the base for the Chobe riverfront and is close to Victoria Falls. Starting in Kasane and ending in Maun (or the reverse) avoids flying back on yourself.</p>
      <p>Hard suitcases can be stored in Maun or Kasane while you are in the camps. Ask us to arrange it.</p>
    </div>
  </div>
</section>
${closing()}`,
  };
}

// ----------------------------------------------------------------- stays ---

function stayCard(s) {
  const d = c.bySlug[s.place];
  return html`<article class="stay">
  ${s.placeholder ? html`<p class="tag mono">Placeholder name</p>` : ''}
  <h3>${s.name}</h3>
  <p class="mono stay-meta"><a href="/destinations/${d.slug}/">${d.name}</a> · ${s.style}</p>
  <p>${s.text}</p>
  <p class="small">${s.size}</p>
</article>`;
}

function staysPage() {
  return {
    path: '/stays/',
    title: 'Stays',
    overlay: true,
    image: ogImage('moremi-5'),
    description: 'The kind of small, low-impact camps we use across Botswana.',
    body: html`
${c.hero({ photo: 'moremi-5', eyebrow: 'Stays', title: raw('Small camps, <em>chosen carefully.</em>'), lede: 'The names below are placeholders that show the kind of place we choose. We will name our partner camps here once agreements are in place.', meta: 'Sunset, Moremi' })}
<section class="section">
  <div class="wrap">
    ${c.label('01', 'What we look for')}
    <h2 class="visually-hidden">What we look for</h2>
    <ol class="principles principles-4">
      <li><span class="mono">A</span><h3>Size</h3><p>Usually under ten tents or rooms, so a camp feels like a house party, not a hotel.</p></li>
      <li><span class="mono">B</span><h3>Vehicles</h3><p>A small number of vehicles per concession, and guides who share sightings rather than crowd them.</p></li>
      <li><span class="mono">C</span><h3>People</h3><p>Botswana guides and staff, community lease fees and real training programmes.</p></li>
      <li><span class="mono">D</span><h3>Footprint</h3><p>Raised, removable structures, solar power and careful water and waste management.</p></li>
    </ol>
  </div>
</section>
${destinations.map((d, i) => {
  const list = stays.filter((s) => s.place === d.slug);
  return list.length ? html`<section class="section-sm"><div class="wrap stays-row"><div>${c.label(c.pad(i + 1), c.kindLabel(d.kind))}<h2 class="h-lg"><a href="/destinations/${d.slug}/">${d.name}</a></h2></div><div class="stay-grid">${list.map(stayCard)}</div></div></section>` : '';
})}
${closing()}`,
  };
}

// ----------------------------------------------------------------- about ---

function about() {
  return {
    path: '/about/',
    title: 'About',
    overlay: true,
    image: ogImage('botswana-1'),
    description: `About ${brand.name}: private, low-impact safaris in Botswana.`,
    body: html`
${c.hero({ photo: 'botswana-3', eyebrow: 'About', title: raw(`About <em>${brand.name}</em>`), lede: brand.tagline, meta: 'Clouds before sunset, Botswana' })}
<section class="section">
  <div class="wrap">
    ${c.label('01', 'The name')}
    <p class="statement">${brand.nameStory}</p>
  </div>
</section>
<section class="section-sm">
  <div class="wrap two-col">
    <div class="prose">
      ${c.label('02', 'What we do')}
      <p class="intro">We plan private safaris in Botswana for people who would rather have a quiet camp than a big lodge.</p>
      <p>That usually means fly-in camps in private concessions, a mix of water and dry country, and enough time in each place to slow down. We follow the idea behind Botswana's "high value, low volume" tourism: fewer visitors, less impact, more of the income staying in the country.</p>
      ${c.label('03', 'How we work')}
      <ul>
        <li><strong>Honest seasons.</strong> We tell you what a month is good for and what it is not, including when we think you should go somewhere else.</li>
        <li><strong>Few vehicles.</strong> We choose camps by how they manage sightings, not by how they look in brochures.</li>
        <li><strong>Local people.</strong> Guides, polers and staff from Botswana, and camps that share income with neighbouring communities.</li>
        <li><strong>No hard sell.</strong> No invented reviews, no awards we have not won. Ask us for references and we will put you in touch with past travellers who have agreed to talk.</li>
      </ul>
    </div>
    <div class="aside">
      <p class="mono">Contact</p>
      <p><a href="mailto:${contact.email}">${contact.email}</a><br><a href="tel:${contact.phone.replace(/\s/g, '')}">${contact.phone}</a><br>${contact.office}</p>
      <p class="small">${contact.hours}</p>
      ${c.btn('/enquire/', 'Start an enquiry')}
    </div>
  </div>
</section>
${closing()}`,
  };
}

// --------------------------------------------------------------- journal ---

function articleCard(a) {
  return html`<a class="article-card" href="/journal/${a.slug}/" data-reveal>
  <span class="ac-media">${c.img(photos[a.photo], { sizes: '(min-width: 900px) 33vw, 100vw' })}</span>
  <span class="mono"><time datetime="${a.date}">${fmtDate(a.date)}</time></span>
  <span class="ac-title">${a.title}</span>
  <span class="ac-text">${a.excerpt}</span>
</a>`;
}

function journalIndex() {
  return {
    path: '/journal/',
    title: 'Journal',
    description: 'Notes on Botswana: seasons, the flood, packing for light aircraft and how the safari model works.',
    body: html`
${c.pageHead('00', 'Journal', raw('Notes <em>from the field.</em>'), 'Practical notes on seasons, packing and how safaris in Botswana work.')}
<section class="section-sm"><div class="wrap"><h2 class="visually-hidden">All journal notes</h2><div class="journal-grid journal-grid-2">${journal.map(articleCard)}</div></div></section>
${closing()}`,
  };
}

function articlePage(a) {
  const block = (b) =>
    b.h ? html`<h2>${b.h}</h2>` : b.list ? html`<ul>${b.list.map((li) => html`<li>${li}</li>`)}</ul>` : html`<p>${b.p}</p>`;
  const [first, ...rest] = a.body;
  return {
    path: `/journal/${a.slug}/`,
    title: a.title,
    overlay: true,
    description: a.excerpt,
    image: ogImage(a.photo),
    body: html`
<article>
  ${c.hero({ photo: a.photo, eyebrow: raw(`Journal · <time datetime="${a.date}">${fmtDate(a.date)}</time>`), title: a.title, cls: 'hero-article' })}
  <div class="wrap prose prose-article section-sm">
    <p class="intro">${a.excerpt}</p>
    ${first.p ? html`<p>${first.p}</p>` : block(first)}
    ${rest.map(block)}
  </div>
</article>
<nav class="wrap pager" aria-label="Journal"><a class="text-link" href="/journal/">All journal notes</a></nav>
${closing()}`,
  };
}

// ---------------------------------------------------------------- enquire ---

function enquire() {
  const endpoint = config.enquiry.endpoint;
  const opt = (v, text = v) => html`<option value="${v}">${text}</option>`;
  const check = (name, v, text = v) => html`<label class="check"><input type="checkbox" name="${name}" value="${v}"><span>${text}</span></label>`;
  return {
    path: '/enquire/',
    title: 'Enquire',
    description: `Start planning a private safari in Botswana with ${brand.name}.`,
    body: html`
${c.pageHead('00', 'Enquire', raw('Tell us about <em>your trip.</em>'), 'A few details help us suggest the right season, places and camps. We reply personally, usually within two working days.')}
<div class="wrap section-sm two-col">
  <form class="enquiry" id="enquiry-form" method="post"
    action="${endpoint || `mailto:${contact.email}`}" ${endpoint ? '' : raw('enctype="text/plain"')}
    data-endpoint="${endpoint}" data-email="${contact.email}" data-subject="Safari enquiry: ${brand.name}">
    <fieldset>
      <legend><span class="mono">01</span> About you</legend>
      <div class="field-row">
        <div class="field"><label for="f-name">Name <span class="req">(required)</span></label><input id="f-name" name="name" autocomplete="name" required></div>
        <div class="field"><label for="f-email">Email <span class="req">(required)</span></label><input id="f-email" name="email" type="email" autocomplete="email" required></div>
      </div>
      <div class="field-row">
        <div class="field"><label for="f-phone">Phone or WhatsApp</label><input id="f-phone" name="phone" type="tel" autocomplete="tel"></div>
        <div class="field"><label for="f-country">Country you live in</label><input id="f-country" name="country" autocomplete="country-name"></div>
      </div>
    </fieldset>
    <fieldset>
      <legend><span class="mono">02</span> Your trip</legend>
      <div class="field-row">
        <div class="field"><label for="f-month">Month you would like to travel</label>
          <select id="f-month" name="month">${opt('', 'Not sure yet')}${months.map((m) => opt(m.name))}</select></div>
        <div class="field"><label for="f-year">Year</label>
          <select id="f-year" name="year">${[0, 1, 2].map((n) => opt(String(new Date().getFullYear() + n)))}</select></div>
      </div>
      <div class="field-row">
        <div class="field"><label for="f-nights">Nights in Botswana</label>
          <select id="f-nights" name="nights">${opt('', 'Not sure yet')}${['4–6', '7–9', '10–12', '13 or more'].map((n) => opt(n))}</select></div>
        <div class="field"><label for="f-people">Travellers</label><input id="f-people" name="travellers" type="number" min="1" max="20" value="2" inputmode="numeric"></div>
      </div>
      <div class="field"><label for="f-journey">A sample journey you liked</label>
        <select id="f-journey" name="journey">${opt('', 'None in particular')}${journeys.map((j) => opt(j.slug, j.name))}</select></div>
      <div class="field"><label for="f-budget">Approximate budget per person, excluding international flights</label>
        <select id="f-budget" name="budget">${opt('', 'Prefer to discuss')}${['Under USD 8,000', 'USD 8,000–15,000', 'USD 15,000–25,000', 'Over USD 25,000'].map((b) => opt(b))}</select></div>
    </fieldset>
    <fieldset class="checks">
      <legend><span class="mono">03</span> Places you are interested in</legend>
      ${destinations.map((d) => check('places', d.slug, d.name))}
    </fieldset>
    <fieldset class="checks">
      <legend><span class="mono">04</span> What matters most</legend>
      ${['Mokoro and water', 'Walking', 'Big game and predators', 'Green season and birds', 'Photography', 'Culture and rock art', 'Children travelling'].map((v) => check('interests', v))}
    </fieldset>
    <div class="field"><label for="f-message">Anything else?</label><textarea id="f-message" name="message" rows="5"></textarea></div>
    <p class="small">We use these details only to reply to your enquiry. We do not add you to a mailing list.</p>
    <button class="btn" type="submit"><span>Send enquiry</span><span class="btn-disc" aria-hidden="true">${raw(c.arrow())}</span></button>
    <p class="form-status" role="status" aria-live="polite"></p>
    ${endpoint ? '' : html`<p class="small">This sends your enquiry using your email app. If nothing opens, write to us at <a href="mailto:${contact.email}">${contact.email}</a>.</p>`}
  </form>
  <div class="aside">
    <p class="mono">Prefer to talk?</p>
    <p><a href="mailto:${contact.email}">${contact.email}</a><br><a href="tel:${contact.phone.replace(/\s/g, '')}">${contact.phone}</a></p>
    <p class="small">${contact.hours}</p>
    <p class="small">Not sure when to go? Try the <a href="/when-to-go/">Water or dry? month chooser</a>.</p>
  </div>
</div>`,
  };
}

function thanks() {
  return {
    path: '/enquire/thanks/',
    title: 'Thank you',
    description: 'Your enquiry has been sent.',
    body: html`${c.pageHead('✓', 'Enquiry sent', raw('Thank <em>you.</em>'), 'We have your enquiry and will reply personally, usually within two working days.')}
<div class="wrap section-sm">${c.btn('/journal/', 'Read the journal while you wait')}</div>`,
  };
}

// --------------------------------------------------------------- credits ---

function credits(usedKeys) {
  const used = [...usedKeys].filter((k) => photos[k]).map((k) => photos[k]);
  return {
    path: '/credits/',
    title: 'Photo credits',
    description: 'Credits for the photographs on this site.',
    body: html`
${c.pageHead('00', 'Credits', raw('Photo <em>credits.</em>'), 'All photographs are from Unsplash, used under the Unsplash License. We only use a photo for a place that matches the location given on its Unsplash page. Where we have no such photo yet, we show an illustration instead.')}
<div class="wrap section-sm"><div class="table-wrap" tabindex="0" role="region" aria-label="Photo credits">
<table class="credits">
  <thead><tr><th scope="col">Photo</th><th scope="col">Photographer</th><th scope="col">Location on Unsplash</th><th scope="col">Unsplash page</th></tr></thead>
  <tbody>${used.map((p) => html`<tr>
    <td><span class="credit-cell"><img src="${c.imgUrl(p.src, 160, 107)}" width="80" height="53" alt="" loading="lazy"> <span>${p.alt}</span></span></td>
    <td><a href="${c.withUtm(p.profile)}">${p.photographer}</a></td>
    <td>${p.pageLocation}</td>
    <td><a href="${c.withUtm(p.page)}">View on Unsplash</a></td>
  </tr>`)}</tbody>
</table>
</div></div>`,
  };
}

function notFound() {
  return {
    path: '/404.html',
    title: 'Page not found',
    description: 'Page not found.',
    body: html`${c.pageHead('404', 'Not found', raw('Lost in <em>the channels.</em>'), 'That page does not exist. Try one of these instead.')}
<div class="wrap section-sm actions">${c.btn('/', 'Home')} ${c.btn('/destinations/', 'Destinations', 'btn-outline')} ${c.btn('/journeys/', 'Journeys', 'btn-outline')}</div>`,
  };
}

module.exports = {
  home,
  destinationsIndex,
  destinationPage,
  journeysIndex,
  journeyPage,
  whenToGo,
  flying,
  staysPage,
  about,
  journalIndex,
  articlePage,
  enquire,
  thanks,
  credits,
  notFound,
};
