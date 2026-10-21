# Mokoro Journeys: Botswana safari website

A fast, static travel website for private, low-impact safaris in Botswana.
Plain HTML and CSS, a little JavaScript, no frameworks and no npm
dependencies. A small Node script builds every page into `dist/`.

## Run it

You need Node.js 18 or newer.

```sh
npm run build    # build the site into dist/
npm start        # build, then serve dist/ on http://localhost:3000
npm run check    # build, then check links, alt text and output markup
```

`dist/` is plain static files. Upload it to any static host.

## Deploy on Vercel

`vercel.json` is already set up (build command `node build.js`, output
directory `dist`, no install step).

- **From GitHub:** in Vercel, choose *Add New → Project*, import this
  repository and deploy. No settings need changing.
- **From the command line:** `npx vercel` for a preview, `npx vercel --prod`
  for production.

After the first deploy, set `siteUrl` in `site.config.js` to the real domain
and redeploy, so canonical links and `sitemap.xml` are correct.

## Change the brand

Everything brand-specific is in **`site.config.js`**:

- `brand`: name, short name, tagline and the story behind the name. The
  alternative brand ("Pula Safaris") is kept under `brand.alternative`; copy
  its values into the main fields to switch.
- `contact`: email, phone, WhatsApp, office, hours (placeholders for now).
- `siteUrl`: the live domain.
- `enquiry.endpoint`: where the enquiry form posts (see below).
- `palette`: the colours. They become CSS custom properties (`--sand`,
  `--papyrus`, `--flood`, `--ochre`...) and are also used for the favicon and
  map.
- `contrastPairs`: every text/background pair the CSS uses. **The build stops
  if any pair is below WCAG AA**, so a palette change can't quietly break
  contrast. If you add a new colour combination in the CSS, add it here.

## Edit the content

| What | File |
| --- | --- |
| Destinations (text, best months, rules, photos) | `src/data/destinations.js` |
| "Water or dry?" month data | `src/data/months.js` |
| Sample journeys, day-by-day plans, flight routes | `src/data/journeys.js` |
| Stays (placeholder names) | `src/data/stays.js` |
| Journal articles | `src/data/journal.js` |
| Photos and credits | `src/data/photos.js` |
| Page layouts and page text | `src/templates/pages.js` |
| Header, footer, `<head>` | `src/templates/layout.js` |
| Chooser, map, cards, luggage rule | `src/templates/components.js` |
| Styles | `src/assets/styles.css` |
| Menu, chooser, map tabs, form | `src/assets/main.js` |

After editing, run `npm run build` (or `npm start`) again.

Templates use a tiny `html` tagged template (`src/lib/html.js`) that escapes
every value, so text in the data files is safe to write as plain text.

### Add a destination or journey

- Add an object to `destinations.js` with a unique `slug` and approximate
  `lon`/`lat` (used to place it on the map). If its map label overlaps
  another, add an offset in `LABELS` in `components.js`.
- Add a journey to `journeys.js`. `route` is a list of destination slugs or
  hubs (`maun`, `kasane`). Flight distances and times are calculated from the
  coordinates.

### Photos

Photos come from Unsplash and are loaded straight from `images.unsplash.com`
in several sizes (`srcset`), as Unsplash's guidelines ask.

**Rule:** use a photo only for a place that matches the location stated on
its Unsplash page, and only photos under the free Unsplash License (not
Unsplash+). To add one, open its Unsplash page, check the location, add an
entry to `photos.js` (image ID, page, photographer, username, location as
shown on the page, your own alt text), then reference its key. The credit
caption and the `/credits/` page are generated automatically. If a place has
no matching photo, the site shows a drawn illustration rather than a photo of
somewhere else.

### The enquiry form

A static site can't send email by itself. Two options:

1. Set `enquiry.endpoint` in `site.config.js` to a form service that accepts a
   POST (Formspree, Basin, Getform or your own API). The form posts there and
   then shows `/enquire/thanks/`.
2. Leave it empty (the current setting). The form then opens the visitor's
   email app with the enquiry filled in, addressed to `contact.email`.

## Signature features

- **Water or dry?** (home page and `/when-to-go/`): pick a month to see the
  Delta flood level against how green the pans are, what the month is good
  for and where to go. Arrow keys move between months. Without JavaScript all
  twelve months are listed.
- **Flying between camps** (`/flying/`, and on every journey page): a
  schematic SVG map of northern Botswana with each journey's light-aircraft
  legs, a table of distances and estimated flying times, and the 20 kg soft-bag
  luggage rule.

## Quality checks

- `npm run check` checks internal links, image alt text, headings and leaked
  markup in the built pages.
- The palette is checked against WCAG AA on every build.
- The pages were also tested with axe-core (WCAG 2.1 AA rules) at mobile and
  desktop widths with no violations. Text is never placed directly on photos.

## Before launch

Read **`FACTS-TO-VERIFY.md`**. It lists every fact, rule, season and
placeholder on the site that needs checking against a primary source.

## Project layout

```
site.config.js        brand, contact, palette, form endpoint
build.js              builds dist/
serve.js              local preview server
scripts/check.js      post-build checks
vercel.json           Vercel settings
src/data/             content
src/templates/        page templates and components
src/lib/              HTML escaping, contrast maths, map geometry
src/assets/           CSS and JavaScript
```
