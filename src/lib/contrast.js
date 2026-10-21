// WCAG 2.x contrast ratio between two hex colours.

function luminance(hex) {
  const h = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const lin = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function ratio(a, b) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

function checkPalette(palette, pairs) {
  return pairs.map(([fg, bg, min]) => {
    if (!palette[fg] || !palette[bg]) throw new Error(`Unknown palette key in contrast pair: ${fg} / ${bg}`);
    const r = ratio(palette[fg], palette[bg]);
    return { fg, bg, min, ratio: r, ok: r >= min };
  });
}

module.exports = { ratio, checkPalette };
