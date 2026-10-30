#!/usr/bin/env node
// Builds the static site into ./dist. No dependencies: `node build.js`.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const config = require('./site.config');
const { checkPalette } = require('./src/lib/contrast');
const { layout, logoMark } = require('./src/templates/layout');
const pages = require('./src/templates/pages');
const destinations = require('./src/data/destinations');
const journal = require('./src/data/journal');
const photos = require('./src/data/photos');
const { journeys } = require('./src/data/journeys');

const OUT = path.join(__dirname, 'dist');
const ASSETS = path.join(__dirname, 'src', 'assets');

// 1. Palette must pass WCAG AA for every pair the CSS uses.
const results = checkPalette(config.palette, config.contrastPairs);
const failed = results.filter((r) => !r.ok);
if (failed.length) {
  console.error('Palette fails WCAG AA contrast:');
  failed.forEach((r) => console.error(`  ${r.fg} on ${r.bg}: ${r.ratio.toFixed(2)} (needs ${r.min})`));
  process.exit(1);
}

// 2. Collect pages.
const list = [
  pages.home(),
  pages.destinationsIndex(),
  ...destinations.map(pages.destinationPage),
  pages.journeysIndex(),
  ...journeys.map(pages.journeyPage),
  pages.whenToGo(),
  pages.flying(),
  pages.staysPage(),
  pages.about(),
  pages.journalIndex(),
  ...journal.map(pages.articlePage),
  pages.enquire(),
  pages.thanks(),
  pages.privacyPage(),
  pages.termsPage(),
  pages.cookiesPage(),
  pages.notFound(),
];

// 3. Assets first, so pages can link to their fingerprinted names.
//    CSS = palette custom properties + self-hosted @font-face rules + styles, lightly minified.
//    Fingerprinted files can be cached for a year (see vercel.json).
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'assets', 'fonts'), { recursive: true });
const vars = Object.entries(config.palette)
  .map(([k, v]) => `  --${k}: ${v};`)
  .join('\n');
const fontVars = Object.entries(config.fonts)
  .filter(([k]) => !['href', 'preload'].includes(k))
  .map(([k, v]) => `  --font-${k}: ${v};`)
  .join('\n');
const minifyCss = (css) =>
  css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\n\s+/g, '\n')
    .replace(/\n{2,}/g, '\n')
    .trim() + '\n';
const css = minifyCss(
  `:root {\n${vars}\n${fontVars}\n}\n` +
    fs.readFileSync(path.join(ASSETS, 'fonts.css'), 'utf8') +
    fs.readFileSync(path.join(ASSETS, 'styles.css'), 'utf8')
);
const fingerprint = (name, body) => {
  const hash = crypto.createHash('sha256').update(body).digest('hex').slice(0, 10);
  const [base, ext] = [name.slice(0, name.lastIndexOf('.')), name.slice(name.lastIndexOf('.'))];
  const file = `${base}.${hash}${ext}`;
  fs.writeFileSync(path.join(OUT, 'assets', file), body);
  return `/assets/${file}`;
};
const js = fs.readFileSync(path.join(ASSETS, 'main.js'), 'utf8');
config.assets = { css: fingerprint('styles.css', css), js: fingerprint('main.js', js) };
for (const f of fs.readdirSync(path.join(ASSETS, 'fonts'))) {
  fs.copyFileSync(path.join(ASSETS, 'fonts', f), path.join(OUT, 'assets', 'fonts', f));
}

// 4. Render.

const write = (urlPath, content) => {
  const file = urlPath.endsWith('.html') ? path.join(OUT, urlPath) : path.join(OUT, urlPath, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
};

const rendered = list.map((p) => ({ ...p, out: layout({ ...p, body: p.body }) }));
const allHtml = rendered.map((p) => p.out).join('\n');
const used = Object.keys(photos).filter((k) => allHtml.includes(photos[k].src));

for (const p of rendered) write(p.path, p.out);

// 5. Favicon.
// Favicon: the logo mark with palette colours filled in, so it follows the brand.
const favicon = logoMark()
  .replace(/var\(--(\w+)\)/g, (_, k) => config.palette[k])
  .replace('<svg class="logo-mark"', '<svg xmlns="http://www.w3.org/2000/svg"')
  .replace(/ aria-hidden="true" focusable="false"/, '');
fs.writeFileSync(path.join(OUT, 'assets', 'favicon.svg'), favicon);

// 6. sitemap.xml and robots.txt
const urls = rendered.filter((p) => !p.path.endsWith('.html') && !p.path.includes('/thanks/'));
fs.writeFileSync(
  path.join(OUT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((p) => `  <url><loc>${config.siteUrl}${p.path}</loc></url>`)
    .join('\n')}\n</urlset>\n`
);
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${config.siteUrl}/sitemap.xml\n`);

const unused = Object.keys(photos).filter((k) => !used.includes(k));
console.log(`Built ${rendered.length} pages into dist/ (${used.length} photos used${unused.length ? `, unused: ${unused.join(', ')}` : ''}).`);
