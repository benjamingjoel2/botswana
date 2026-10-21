#!/usr/bin/env node
// Post-build checks on ./dist: internal links resolve, images have alt
// text, and no template markup leaked out as escaped text.
// Run with `npm run check`.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'dist');
const files = [];
(function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.html')) files.push(p);
  }
})(ROOT);

const problems = [];
const exists = (url) => {
  const clean = url.split('#')[0].split('?')[0];
  if (!clean) return true;
  const p = path.join(ROOT, clean);
  return fs.existsSync(p) && (fs.statSync(p).isFile() || fs.existsSync(path.join(p, 'index.html')));
};

for (const file of files) {
  const rel = '/' + path.relative(ROOT, file);
  const html = fs.readFileSync(file, 'utf8');
  for (const [, url] of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
    if (!exists(url)) problems.push(`${rel}: broken link ${url}`);
  }
  for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt="/.test(tag)) problems.push(`${rel}: <img> without alt`);
  }
  if (/&lt;(figure|svg|div|section|a |p>)/.test(html)) problems.push(`${rel}: escaped markup in output`);
  if (!/<h1[\s>]/.test(html)) problems.push(`${rel}: no <h1>`);
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log(`Checked ${files.length} pages: links, alt text and markup OK.`);
