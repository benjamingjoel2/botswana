const { html, raw } = require('../lib/html');
const config = require('../../site.config');
const destinations = require('../data/destinations');
const months = require('../data/months');
const stays = require('../data/stays');
const journal = require('../data/journal');
const photos = require('../data/photos');
const { journeys } = require('../data/journeys');
const c = require('./components');

const { brand, contact } = config;
const fmtDate = (iso) => new Date(iso + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

// Every page returns { path, title, description, body, image? }.

function pageHead(eyebrow, title, lede) {
  return html`<header class="page-head wrap">
  ${eyebrow ? html`<p class="eyebrow">${eyebrow}</p>` : ''}
  <h1>${title}</h1>
  ${lede ? html`<p class="lede">${lede}</p>` : ''}
</header>`;
}

function hero(keys, { kind, alt } = {}) {
  return html`<div class="hero">${c.photo(keys, { eager: true, ratio: '21/9', kind, cls: 'hero-photo' })}</div>`;
}

function cta(text = 'Tell us when you would like to travel and what matters to you. We reply personally, usually within two working days.', href = '/enquire/') {
  return html`<section class="band band-papyrus">
  <div class="wrap cta">
    <h2>Plan a quiet safari</h2>
    <p>${text}</p>
    <a class="btn btn-light" href="${href}">Start an enquiry</a>
  </div>
</section>`;
}

function monthStrip(best) {
  return html`<ol class="month-strip" aria-label="Suggested months">
  ${months.map((m) => html`<li class="${best.includes(m.m) ? 'on' : ''}"><abbr title="${m.name}">${m.short[0]}</abbr><span class="visually-hidden">${m.name}: ${best.includes(m.m) ? 'recommended' : 'possible, not our first choice'}</span></li>`)}
</ol>`;
}

// ------------------------------------------------------------------ home ---

function home() {
  const heroPhoto = 'okavango-1';
  return {
    path: '/',
    title: 'Home',
    description: `${brand.name}: private, low-impact safaris in Botswana. Small camps, few vehicles, the Okavango Delta and the Kalahari.`,
    image: c.imgUrl(photos[heroPhoto].src, 1200),
    body: html`
<section class="home-hero">
  ${c.photo(heroPhoto, { eager: true, ratio: '16/9', cls: 'hero-photo', sizes: '100vw' })}
  <div class="wrap">
    <div class="hero-card">
      <p class="eyebrow">Private safaris in Botswana</p>
      <h1>Quiet camps. Few vehicles. Water and sand.</h1>
      <p class="lede">We plan small, low-impact journeys through the Okavango Delta, the northern rivers and the Kalahari pans, in camps where you may not see another vehicle all day.</p>
      <p class="actions"><a class="btn" href="/journeys/">See sample journeys</a> <a class="text-link" href="#water-or-dry">Water or dry? Choose your month</a></p>
    </div>
  </div>
</section>

<section class="wrap section">
  <div class="split">
    <div>
      <p class="eyebrow">High value, low volume</p>
      <h2>Botswana chose fewer visitors, not more</h2>
    </div>
    <div class="prose">
      <p>Botswana's tourism policy favours small numbers of visitors in large wild areas. Concessions are leased to a few small camps, most reached by light aircraft. It costs more than a lodge safari, and in return you get space: a sighting to yourself, a silent mokoro channel, a night sky with no other lights.</p>
      <p>We build every journey around that idea. Small camps, private areas where we can, and slow days.</p>
      <p><a class="text-link" href="/journal/high-value-low-volume/">How the model works, and its trade-offs</a></p>
    </div>
  </div>
  <ul class="principles">
    <li><h3>Small camps</h3><p>We look for camps with a handful of tents, not large lodges.</p></li>
    <li><h3>Few vehicles</h3><p>Private concessions where guides limit vehicles at a sighting.</p></li>
    <li><h3>Light footprint</h3><p>Fly-in camps on raised decks, solar power where possible, local guides and staff.</p></li>
  </ul>
</section>

<section class="band band-sand section" id="water-or-dry">
  <div class="wrap">
    <div class="section-head">
      <p class="eyebrow">Signature tool</p>
      <h2>Water or dry? Choose your month</h2>
      <p class="lede">Botswana has two peaks that point in opposite directions. The Okavango floods in the dry winter (roughly June to August). The pans and the Kalahari turn green in the summer rains (roughly December to March). Pick a month to see which side is at its best.</p>
    </div>
    ${c.chooser('chooser-home')}
    <p><a class="text-link" href="/when-to-go/">More on when to go</a></p>
  </div>
</section>

<section class="wrap section">
  <div class="section-head">
    <p class="eyebrow">Destinations</p>
    <h2>Nine places, two kinds of country</h2>
  </div>
  <div class="grid grid-3">${destinations.slice(0, 6).map(c.destinationCard)}</div>
  <p class="center"><a class="btn btn-outline" href="/destinations/">All nine destinations</a></p>
</section>

<section class="band band-flood section">
  <div class="wrap">
    <div class="section-head">
      <p class="eyebrow">Sample journeys</p>
      <h2>Routes we would start from</h2>
      <p class="lede">Every journey is planned for you. These show how the pieces fit together.</p>
    </div>
    <div class="grid grid-3">${journeys.slice(0, 3).map(c.journeyCard)}</div>
  </div>
</section>

<section class="wrap section">
  <div class="split split-map">
    <div>
      <p class="eyebrow">Flying between camps</p>
      <h2>Camp to camp by light aircraft</h2>
      <p>Most camps are reached in small planes from Maun or Kasane. Flights are short and low, and often the best wildlife viewing of the trip.</p>
      ${c.luggageRule()}
      <p><a class="text-link" href="/flying/">See the route map</a></p>
    </div>
    <div>${raw(c.routeMap({ id: 'home-map' }))}</div>
  </div>
</section>

<section class="band band-sand section">
  <div class="wrap">
    <div class="section-head"><p class="eyebrow">Journal</p><h2>Notes from the field</h2></div>
    <div class="grid grid-3">${journal.slice(0, 3).map(articleCard)}</div>
  </div>
</section>
${cta()}`,
  };
}

// --------------------------------------------------------- destinations ---

function destinationsIndex() {
  const group = (kind, title, text) => html`<section class="wrap section-sm">
  <h2>${title}</h2>
  <p class="lede">${text}</p>
  <div class="grid grid-3">${destinations.filter((d) => d.kind === kind).map(c.destinationCard)}</div>
</section>`;
  return {
    path: '/destinations/',
    title: 'Destinations',
    description: 'The Okavango Delta, Moremi, Chobe, Savuti, Linyanti, the Makgadikgadi and Nxai pans, the Central Kalahari and Tsodilo Hills.',
    body: html`
${pageHead('Destinations', 'Where we go in Botswana', 'Northern Botswana divides into water country, river country and dry country. The best trips usually combine two of them.')}
<div class="wrap section-sm">${raw(c.routeMap({ id: 'dest-map', active: null }))}
<p class="small center">Schematic map; positions are approximate. Select a place to read more.</p></div>
${group('water', 'Water country', 'The Okavango Delta and Moremi: at their fullest in the dry winter months.')}
${group('river', 'River country', 'The Chobe and Linyanti rivers: elephant country, best late in the dry season.')}
${group('dry', 'Dry country', 'Savuti, the pans, the Kalahari and Tsodilo: open space, green after the rains, silver and silent in winter.')}
${cta()}`,
  };
}

function destinationPage(d, i) {
  const prev = destinations[(i + destinations.length - 1) % destinations.length];
  const next = destinations[(i + 1) % destinations.length];
  const hereStays = stays.filter((s) => s.place === d.slug);
  const hereJourneys = journeys.filter((j) => j.route.includes(d.slug));
  const gallery = d.photos.slice(1).filter((k) => photos[k]);
  const first = c.firstPhoto(d.photos);
  return {
    path: `/destinations/${d.slug}/`,
    title: d.name,
    description: d.summary,
    image: first ? c.imgUrl(first.src, 1200) : null,
    body: html`
${hero(d.photos, { kind: d.kind })}
${pageHead(c.kindLabel(d.kind), d.name, d.summary)}
<div class="wrap section-sm two-col">
  <div class="prose">
    ${d.intro.map((p) => html`<p>${p}</p>`)}
    <h2>What you do here</h2>
    <ul>${d.activities.map((a) => html`<li>${a}</li>`)}</ul>
    <h2>Good to know</h2>
    <ul>${d.rules.map((a) => html`<li>${a}</li>`)}</ul>
  </div>
  <aside class="facts">
    <h2 class="facts-h">At a glance</h2>
    <dl>
      <dt>Feel</dt><dd>${d.feel}</dd>
      <dt>Getting there</dt><dd>${d.airstrip}</dd>
      <dt>Best months</dt><dd>${monthStrip(d.best)}<p class="small">${d.bestNote}</p></dd>
    </dl>
    <a class="btn btn-block" href="/enquire/?place=${d.slug}">Enquire about ${d.name}</a>
  </aside>
</div>
${gallery.length ? html`<section class="wrap section-sm"><h2 class="visually-hidden">Photos</h2><div class="gallery">${gallery.map((k) => c.photo(k, { sizes: '(min-width: 900px) 33vw, 100vw' }))}</div></section>` : ''}
${d.nearby ? html`<section class="wrap section-sm"><h2>${d.nearby.title}</h2>${c.photo(d.nearby.photo, { ratio: '21/9' })}</section>` : ''}
${hereStays.length ? html`<section class="wrap section-sm"><h2>Where we might stay</h2><div class="grid grid-3">${hereStays.map(stayCard)}</div></section>` : ''}
${hereJourneys.length ? html`<section class="wrap section-sm"><h2>Sample journeys that include ${d.name}</h2><div class="grid grid-3">${hereJourneys.map(c.journeyCard)}</div></section>` : ''}
<nav class="wrap pager" aria-label="More destinations">
  <a href="/destinations/${prev.slug}/" rel="prev">← ${prev.name}</a>
  <a href="/destinations/${next.slug}/" rel="next">${next.name} →</a>
</nav>
${cta()}`,
  };
}

// ------------------------------------------------------------- journeys ---

function journeysIndex() {
  return {
    path: '/journeys/',
    title: 'Sample journeys',
    description: 'Sample Botswana safari routes with day-by-day plans: flood season, green season, northern rivers and Tsodilo.',
    body: html`
${pageHead('Sample journeys', 'Routes, day by day', 'These are starting points, not fixed packages. We change the order, the camps and the length to fit your dates and interests.')}
<div class="wrap section-sm"><h2 class="visually-hidden">All sample journeys</h2><div class="grid grid-2">${journeys.map(c.journeyCard)}</div></div>
${cta()}`,
  };
}

function journeyPage(j) {
  return {
    path: `/journeys/${j.slug}/`,
    title: j.name,
    description: j.summary,
    image: photos[j.photo] ? c.imgUrl(photos[j.photo].src, 1200) : null,
    body: html`
${hero(j.photo)}
${pageHead(`${j.nights} nights · ${j.season}`, j.name, j.summary)}
<div class="wrap section-sm">
  <dl class="stat-row">
    <div><dt>Length</dt><dd>${j.nights} nights</dd></div>
    <div><dt>Best months</dt><dd>${j.season}</dd></div>
    <div><dt>Pace</dt><dd>${j.pace}</dd></div>
    <div><dt>Route</dt><dd>${c.routeNames(j).join(' → ')}</dd></div>
  </dl>
</div>
<section class="wrap section-sm split split-map">
  <div>
    <h2>The route</h2>
    ${c.legTable(j)}
    <p class="small">* Straight-line distances and estimated flying times. Real flights may stop at other airstrips on the way.</p>
  </div>
  <div>${raw(c.routeMap({ id: `map-${j.slug}`, only: j.slug, active: j.slug }))}</div>
</section>
<section class="wrap section-sm">
  <h2>Day by day</h2>
  <ol class="timeline">
    ${j.days.map((day) => html`<li>
      <p class="day">${day.d}</p>
      <div><h3>${day.title}</h3><p class="where">${c.bySlug[day.place] ? html`<a href="/destinations/${day.place}/">${c.place(day.place).name}</a>` : c.place(day.place).name}</p><p>${day.text}</p></div>
    </li>`)}
  </ol>
</section>
<section class="wrap section-sm">${c.luggageRule()}</section>
${cta('Like this route? Tell us your dates and we will suggest camps and a price range.', `/enquire/?journey=${j.slug}`)}`,
  };
}

// ------------------------------------------------------------ when to go ---

function whenToGo() {
  return {
    path: '/when-to-go/',
    title: 'When to go',
    description: 'Botswana month by month: when the Okavango floods, when the pans turn green, and what each month is good for.',
    body: html`
${pageHead('When to go', 'Water or dry?', 'Botswana works all year, but not in the same places. Choose a month to see where to go.')}
<section class="wrap section-sm"><h2 class="visually-hidden">Month by month</h2>${c.chooser('chooser-main')}</section>
<section class="band band-sand section">
  <div class="wrap two-col-even">
    <div class="prose">
      <h2>Why the Delta floods in the dry season</h2>
      <p>Rain falls on the highlands of Angola from about November to March. It takes months to travel down the Okavango River and spread across the almost flat Delta. So the water arrives in the central Delta around May and June and is usually highest from June to August, just as the rest of Botswana dries out. Wildlife walks in from the dry country to the permanent water.</p>
      <p><a class="text-link" href="/journal/reading-the-flood/">Reading the flood</a></p>
      ${c.photo('okavango-4', { sizes: '(min-width: 900px) 45vw, 100vw' })}
    </div>
    <div class="prose">
      <h2>Why the pans are best in the rains</h2>
      <p>The Makgadikgadi, Nxai Pan and the Central Kalahari have little permanent water. When the summer rains come, from about November or December, grass grows fast and zebra, wildebeest, springbok and gemsbok move in to graze and give birth. Predators follow. It is the green season: hot, stormy, beautiful and quieter in many camps.</p>
      ${c.photo('botswana-2', { sizes: '(min-width: 900px) 45vw, 100vw' })}
    </div>
  </div>
</section>
<section class="wrap section">
  <h2>The year at a glance</h2>
  <div class="table-wrap" tabindex="0" role="region" aria-label="The year at a glance">
  <table class="year-table">
    <thead><tr><th scope="col">Month</th><th scope="col">Delta water (0–5)</th><th scope="col">Green pans (0–5)</th><th scope="col">Rain</th><th scope="col">In short</th></tr></thead>
    <tbody>${months.map((m) => html`<tr><th scope="row">${m.name}</th><td>${m.water}</td><td>${m.pans}</td><td>${m.rain}/5</td><td>${m.headline}</td></tr>`)}</tbody>
  </table>
  </div>
  <p class="small">These are typical patterns, not forecasts. Flood size and timing change each year with rainfall in Angola, and local rains vary.</p>
</section>
${cta()}`,
  };
}

// ---------------------------------------------------------------- flying ---

function flying() {
  return {
    path: '/flying/',
    title: 'Flying between camps',
    description: 'Light-aircraft routes between safari camps in Botswana, with the 20 kg soft-bag luggage rule.',
    body: html`
${pageHead('Flying between camps', 'Camp to camp by light aircraft', 'Most camps in the Delta, Linyanti and Savuti have their own sand airstrip. Small aircraft link them to each other and to Maun and Kasane. Choose a journey to see its route.')}
<section class="wrap section-sm">${c.luggageRule()}</section>
<section class="wrap section-sm" data-route-switch>
  <div class="route-tabs" role="group" aria-label="Choose a journey">
    ${journeys.map((j, i) => html`<button type="button" class="chip" data-show-route="${j.slug}" aria-pressed="${i === 0 ? 'true' : 'false'}">${j.name}</button>`)}
  </div>
  <div class="split split-map">
    <div class="route-panels">
      ${journeys.map((j, i) => html`<div class="route-panel${i === 0 ? ' is-active' : ''}" data-route-panel="${j.slug}">
        ${c.legTable(j)}
        <p><a class="text-link" href="/journeys/${j.slug}/">Day-by-day plan for ${j.name}</a></p>
      </div>`)}
      <p class="small">* Distances are straight lines between approximate positions. Times assume a single-engine aircraft at about 260 km/h plus time to taxi, climb and land; real flights often stop at other airstrips to drop off or pick up guests.</p>
    </div>
    <div>${raw(c.routeMap({ id: 'flying-map' }))}</div>
  </div>
</section>
<section class="band band-sand section">
  <div class="wrap two-col-even">
    <div class="prose">
      <h2>What the flights are like</h2>
      <ul>
        <li>Usually single-engine aircraft with between about 5 and 12 passenger seats.</li>
        <li>Flights are shared with guests going to other camps, so a "direct" leg may include a short stop.</li>
        <li>You are weighed with your bag at check-in in Maun or Kasane. Please tell us your weight honestly when you book; it is used only for loading the aircraft.</li>
        <li>Flights are low, so the views of the Delta channels and herds are part of the safari. A window seat is never far away.</li>
        <li>Schedules are set the day before and can change with weather and other guests' plans.</li>
      </ul>
    </div>
    <div class="prose">
      <h2>The two gateways</h2>
      <p><strong>Maun</strong> is the base for the Okavango Delta, Moremi, the pans and the Central Kalahari. International travellers usually connect through Johannesburg or another regional hub.</p>
      <p><strong>Kasane</strong> is the base for the Chobe riverfront and is close to Victoria Falls. Starting in Kasane and ending in Maun (or the reverse) avoids flying back on yourself.</p>
      <p>Hard suitcases can be stored in Maun or Kasane while you are in the camps. Ask us to arrange it.</p>
    </div>
  </div>
</section>
${cta()}`,
  };
}

// ----------------------------------------------------------------- stays ---

function stayCard(s) {
  const d = c.bySlug[s.place];
  return html`<article class="card card-stay">
  <div class="card-body">
    ${s.placeholder ? html`<p class="tag">Placeholder name</p>` : ''}
    <h3>${s.name}</h3>
    <p class="eyebrow"><a href="/destinations/${d.slug}/">${d.name}</a> · ${s.style}</p>
    <p>${s.text}</p>
    <p class="small">${s.size}</p>
  </div>
</article>`;
}

function staysPage() {
  return {
    path: '/stays/',
    title: 'Stays',
    description: 'The kind of small, low-impact camps we use across Botswana.',
    body: html`
${pageHead('Stays', 'Small camps, chosen carefully', 'We work with small camps that keep vehicle numbers low and employ local staff. The names below are placeholders that show the kind of place we choose; we will name our partner camps here once agreements are in place.')}
<section class="wrap section-sm">
  <h2>What we look for</h2>
  <ul class="principles">
    <li><h3>Size</h3><p>Usually under ten tents or rooms, so a camp feels like a house party, not a hotel.</p></li>
    <li><h3>Vehicles</h3><p>A small number of vehicles per concession, and guides who share sightings rather than crowd them.</p></li>
    <li><h3>People</h3><p>Botswana guides and staff, community lease fees and real training programmes.</p></li>
    <li><h3>Footprint</h3><p>Raised, removable structures, solar power and careful water and waste management.</p></li>
  </ul>
</section>
${destinations.map((d) => {
  const list = stays.filter((s) => s.place === d.slug);
  return list.length ? html`<section class="wrap section-sm"><h2>${d.name}</h2><div class="grid grid-3">${list.map(stayCard)}</div></section>` : '';
})}
${cta()}`,
  };
}

// ----------------------------------------------------------------- about ---

function about() {
  return {
    path: '/about/',
    title: 'About',
    description: `About ${brand.name}: private, low-impact safaris in Botswana.`,
    body: html`
${hero('botswana-1')}
${pageHead('About', `About ${brand.name}`, brand.tagline)}
<div class="wrap section-sm two-col">
  <div class="prose">
    <h2>The name</h2>
    <p>${brand.nameStory}</p>
    <h2>What we do</h2>
    <p>We plan private safaris in Botswana for people who would rather have a quiet camp than a big lodge. That usually means fly-in camps in private concessions, a mix of water and dry country, and enough time in each place to slow down.</p>
    <p>We follow the idea behind Botswana's "high value, low volume" tourism: fewer visitors, less impact, more of the income staying in the country.</p>
    <h2>How we work</h2>
    <ul>
      <li><strong>Honest seasons.</strong> We tell you what a month is good for and what it is not, including when we think you should go somewhere else.</li>
      <li><strong>Few vehicles.</strong> We choose camps by how they manage sightings, not by how they look in brochures.</li>
      <li><strong>Local people.</strong> Guides, polers and staff from Botswana, and camps that share income with neighbouring communities.</li>
      <li><strong>No hard sell.</strong> No invented reviews, no awards we have not won. Ask us for references and we will put you in touch with past travellers who have agreed to talk.</li>
    </ul>
  </div>
  <aside class="facts">
    <h2 class="facts-h">Contact</h2>
    <dl>
      <dt>Email</dt><dd><a href="mailto:${contact.email}">${contact.email}</a></dd>
      <dt>Phone</dt><dd><a href="tel:${contact.phone.replace(/\s/g, '')}">${contact.phone}</a></dd>
      ${contact.whatsapp ? html`<dt>WhatsApp</dt><dd><a href="https://wa.me/${contact.whatsapp}">Message us</a></dd>` : ''}
      <dt>Office</dt><dd>${contact.office}</dd>
      <dt>Hours</dt><dd>${contact.hours}</dd>
    </dl>
    <a class="btn btn-block" href="/enquire/">Start an enquiry</a>
  </aside>
</div>
${cta()}`,
  };
}

// --------------------------------------------------------------- journal ---

function articleCard(a) {
  return html`<article class="card">
  <a class="card-link" href="/journal/${a.slug}/">
    ${c.photo(a.photo, { sizes: '(min-width: 900px) 33vw, 100vw', caption: false })}
    <div class="card-body">
      <p class="eyebrow"><time datetime="${a.date}">${fmtDate(a.date)}</time></p>
      <h3>${a.title}</h3>
      <p>${a.excerpt}</p>
    </div>
  </a>
</article>`;
}

function journalIndex() {
  return {
    path: '/journal/',
    title: 'Journal',
    description: 'Notes on Botswana: seasons, the flood, packing for light aircraft and how the safari model works.',
    body: html`
${pageHead('Journal', 'Notes from the field', 'Practical notes on seasons, packing and how safaris in Botswana work.')}
<div class="wrap section-sm"><h2 class="visually-hidden">All journal notes</h2><div class="grid grid-2">${journal.map(articleCard)}</div></div>
${cta()}`,
  };
}

function articlePage(a) {
  const block = (b) =>
    b.h ? html`<h2>${b.h}</h2>` : b.list ? html`<ul>${b.list.map((li) => html`<li>${li}</li>`)}</ul>` : html`<p>${b.p}</p>`;
  return {
    path: `/journal/${a.slug}/`,
    title: a.title,
    description: a.excerpt,
    image: c.imgUrl(photos[a.photo].src, 1200),
    body: html`
${hero(a.photo)}
<article>
  ${pageHead(raw(`<time datetime="${a.date}">${fmtDate(a.date)}</time>`), a.title, a.excerpt)}
  <div class="wrap prose prose-narrow section-sm">${a.body.map(block)}</div>
</article>
<nav class="wrap pager" aria-label="Journal"><a href="/journal/">← All journal notes</a></nav>
${cta()}`,
  };
}

// ---------------------------------------------------------------- enquire ---

function enquire() {
  const endpoint = config.enquiry.endpoint;
  const opt = (v, label = v) => html`<option value="${v}">${label}</option>`;
  const check = (name, v) => html`<label class="check"><input type="checkbox" name="${name}" value="${v}"> ${v}</label>`;
  return {
    path: '/enquire/',
    title: 'Enquire',
    description: `Start planning a private safari in Botswana with ${brand.name}.`,
    body: html`
${pageHead('Enquire', 'Tell us about your trip', 'A few details help us suggest the right season, places and camps. We reply personally, usually within two working days.')}
<div class="wrap section-sm two-col">
  <form class="enquiry" id="enquiry-form" method="post"
    action="${endpoint || `mailto:${contact.email}`}" ${endpoint ? '' : raw('enctype="text/plain"')}
    data-endpoint="${endpoint}" data-email="${contact.email}" data-subject="Safari enquiry: ${brand.name}">
    <fieldset>
      <legend>About you</legend>
      <div class="field"><label for="f-name">Name <span class="req">(required)</span></label><input id="f-name" name="name" autocomplete="name" required></div>
      <div class="field"><label for="f-email">Email <span class="req">(required)</span></label><input id="f-email" name="email" type="email" autocomplete="email" required></div>
      <div class="field"><label for="f-phone">Phone or WhatsApp</label><input id="f-phone" name="phone" type="tel" autocomplete="tel"></div>
      <div class="field"><label for="f-country">Country you live in</label><input id="f-country" name="country" autocomplete="country-name"></div>
    </fieldset>
    <fieldset>
      <legend>Your trip</legend>
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
      <fieldset class="checks">
        <legend>Places you are interested in</legend>
        ${destinations.map((d) => html`<label class="check"><input type="checkbox" name="places" value="${d.slug}"> ${d.name}</label>`)}
      </fieldset>
      <fieldset class="checks">
        <legend>What matters most</legend>
        ${['Mokoro and water', 'Walking', 'Big game and predators', 'Green season and birds', 'Photography', 'Culture and rock art', 'Children travelling'].map((v) => check('interests', v))}
      </fieldset>
      <div class="field"><label for="f-message">Anything else?</label><textarea id="f-message" name="message" rows="5"></textarea></div>
    </fieldset>
    <p class="small">We use these details only to reply to your enquiry. We do not add you to a mailing list.</p>
    <button class="btn" type="submit">Send enquiry</button>
    <p class="form-status" role="status" aria-live="polite"></p>
    ${endpoint ? '' : html`<p class="small">This sends your enquiry using your email app. If nothing opens, write to us at <a href="mailto:${contact.email}">${contact.email}</a>.</p>`}
  </form>
  <aside class="facts">
    <h2 class="facts-h">Prefer to talk?</h2>
    <dl>
      <dt>Email</dt><dd><a href="mailto:${contact.email}">${contact.email}</a></dd>
      <dt>Phone</dt><dd><a href="tel:${contact.phone.replace(/\s/g, '')}">${contact.phone}</a></dd>
      <dt>Hours</dt><dd>${contact.hours}</dd>
    </dl>
    <p class="small">Not sure when to go? Try the <a href="/when-to-go/">Water or dry? month chooser</a>.</p>
  </aside>
</div>`,
  };
}

function thanks() {
  return {
    path: '/enquire/thanks/',
    title: 'Thank you',
    description: 'Your enquiry has been sent.',
    body: html`${pageHead('Enquiry sent', 'Thank you', 'We have your enquiry and will reply personally, usually within two working days.')}
<div class="wrap section-sm"><p><a class="btn btn-outline" href="/journal/">Read the journal while you wait</a></p></div>`,
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
${pageHead('Credits', 'Photo credits', 'All photographs are from Unsplash, used under the Unsplash License. We only use a photo for a place that matches the location given on its Unsplash page. Where we have no such photo yet, we show an illustration instead.')}
<div class="wrap section-sm table-wrap" tabindex="0" role="region" aria-label="Photo credits">
<table class="credits">
  <thead><tr><th scope="col">Photo</th><th scope="col">Photographer</th><th scope="col">Location on Unsplash</th><th scope="col">Unsplash page</th></tr></thead>
  <tbody>${used.map((p) => html`<tr>
    <td><img src="${c.imgUrl(p.src, 160, 107)}" width="80" height="53" alt="" loading="lazy"> <span>${p.alt}</span></td>
    <td><a href="${c.withUtm(p.profile)}">${p.photographer}</a></td>
    <td>${p.pageLocation}</td>
    <td><a href="${c.withUtm(p.page)}">View on Unsplash</a></td>
  </tr>`)}</tbody>
</table>
</div>`,
  };
}

function notFound() {
  return {
    path: '/404.html',
    title: 'Page not found',
    description: 'Page not found.',
    body: html`${pageHead('404', 'Lost in the channels', 'That page does not exist. Try one of these instead.')}
<div class="wrap section-sm"><p><a class="btn" href="/">Home</a> <a class="btn btn-outline" href="/destinations/">Destinations</a> <a class="btn btn-outline" href="/journeys/">Journeys</a></p></div>`,
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
