/**
 * Walks the live site and measures the contrast of every piece of rendered text.
 *
 * WHY THIS EXISTS RATHER THAN MORE UNIT TESTS. `design-tokens.contrast.test.ts`
 * checks that the palette's pairs are sound. It cannot check that a component
 * actually uses the right pair, and that is where the real failures were: the token
 * file said "on a light surface, darken the orange to gain contrast", and four
 * components used the brand orange anyway. Nothing caught it because nothing looked
 * at rendered output.
 *
 * So this renders each route and reads the computed colour of every text node,
 * compositing alpha down the ancestor chain rather than taking the browser's
 * `rgba(...)` at face value. Getting that wrong is how a naive version of this
 * reported the entire footer as failing when it was fine.
 *
 * Run against a dev server or a production build:
 *   node scripts/audit-contrast.mjs [baseUrl]
 */
import { chromium } from 'playwright';

const BASE = process.argv[2] ?? 'http://localhost:3000';
const { ROUTES } = await import('../src/lib/route-manifest.js').then((m) => m.default ?? m);

const paths = ROUTES.filter((r) => r.disposition === 'live')
  .map((r) => r.path)
  .filter((p) => !p.includes('['));

const MEASURE = () => {
  const parse = (c) => {
    if (!c || c === 'transparent') return [0, 0, 0, 0];
    const n = c.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0];
    // `color(srgb r g b / a)` gives 0..1 channels; rgb()/rgba() gives 0..255.
    const srgb = c.startsWith('color(');
    const [r, g, b] = srgb ? n.slice(0, 3).map((v) => v * 255) : n.slice(0, 3);
    const a = n.length > 3 ? n[3] : 1;
    return [r, g, b, a];
  };
  const composite = (fg, bg) => {
    const a = fg[3];
    return [fg[0] * a + bg[0] * (1 - a), fg[1] * a + bg[1] * (1 - a), fg[2] * a + bg[2] * (1 - a), 1];
  };
  const lum = ([r, g, b]) =>
    [r, g, b]
      .map((v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      })
      .reduce((s, v, i) => s + [0.2126, 0.7152, 0.0722][i] * v, 0);
  const ratio = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
    return (x + 0.05) / (y + 0.05);
  };

  /*
   * The effective background is every semi-transparent layer above the first
   * opaque one, composited in paint order. Reading only the nearest painted colour
   * makes a translucent panel look like a total failure.
   *
   * Background IMAGES matter as much as background colours and are easy to miss.
   * The first version of this ignored them and reported 105 false failures on
   * /licensees-guide alone, where white text sits on a dark red gradient that the
   * script could not see, so it fell through to the white card behind and called
   * white-on-white. A run that cries wolf 105 times is worse than no run at all.
   *
   * Gradients are handled by pulling out their colour stops and taking the worst
   * one for the text in question. Raster images cannot be measured this way, so
   * those are reported separately as unmeasurable rather than passed or failed.
   */
  const gradientStops = (image) => {
    if (!image || image === 'none') return null;
    if (!/gradient\(/.test(image)) return 'raster';
    const stops = image.match(/(rgba?\([^)]*\)|color\([^)]*\))/g);
    return stops && stops.length ? stops.map(parse) : null;
  };

  /*
   * Scrims. A card that puts text over an image almost always darkens it first with
   * an absolutely positioned overlay, and that overlay is a SIBLING of the text
   * rather than an ancestor, so walking up the tree never sees it.
   *
   * Missing them is not a small error. It made every category label on
   * /licensees-guide look like a failure when the real figures are 5.4:1 and 5.97:1,
   * and 52 false alarms in one page is how a check like this gets ignored.
   */
  const scrims = (ancestor, textRect) => {
    const found = [];
    for (const child of ancestor.children) {
      const cs = getComputedStyle(child);
      if (cs.position !== 'absolute' && cs.position !== 'fixed') continue;
      const c = parse(cs.backgroundColor);
      if (c[3] === 0) continue;
      const r = child.getBoundingClientRect();
      // Only count it if it actually covers the text.
      const covers =
        r.left <= textRect.left &&
        r.right >= textRect.right &&
        r.top <= textRect.top &&
        r.bottom >= textRect.bottom;
      if (covers) found.push(c);
    }
    return found;
  };

  const backdrop = (el, textColour, textRect) => {
    const layers = [];
    for (let n = el; n; n = n.parentElement) {
      const cs = getComputedStyle(n);

      for (const scrim of scrims(n, textRect)) layers.push(scrim);

      const stops = gradientStops(cs.backgroundImage);
      if (stops === 'raster') return 'unmeasurable';
      if (stops) {
        // Worst case for this text: the stop it contrasts least against.
        let worst = null;
        let worstRatio = Infinity;
        for (const stop of stops) {
          if (stop[3] === 0) continue;
          const solid = stop[3] === 1 ? stop : composite(stop, [255, 255, 255, 1]);
          const r = ratio(composite(textColour, solid), solid);
          if (r < worstRatio) {
            worstRatio = r;
            worst = solid;
          }
        }
        if (worst) layers.push(worst);
      }

      const c = parse(cs.backgroundColor);
      if (c[3] === 0) {
        if (layers.length && layers[layers.length - 1][3] === 1) break;
        continue;
      }
      layers.push(c);
      if (c[3] === 1) break;
    }
    let out = layers.pop() ?? [255, 255, 255, 1];
    while (layers.length) out = composite(layers.pop(), out);
    return out;
  };

  const findings = [];
  const unmeasurable = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set();

  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.textContent.trim();
    if (!text) continue;
    const el = node.parentElement;
    if (!el || seen.has(el)) continue;
    seen.add(el);
    if (el.closest('[aria-hidden="true"]')) continue; // decorative, exempt from 1.4.3
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || cs.opacity === '0') continue;
    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) continue;
    /*
     * Visually hidden text is not rendered, so its colour is irrelevant. The usual
     * sr-only recipe is a clipped 1px box rather than display:none, which is exactly
     * why it survives the checks above and why four "(required)" labels showed up as
     * failures on /start-here when nobody can see them.
     */
    const clipped = cs.clip !== 'auto' || cs.clipPath !== 'none';
    if (clipped && rect.width <= 2 && rect.height <= 2) continue;

    const bg = backdrop(el, parse(cs.color), rect);
    if (bg === 'unmeasurable') {
      unmeasurable.push({ text: text.slice(0, 60), colour: cs.color });
      continue;
    }
    const fg = composite(parse(cs.color), bg);
    const size = parseFloat(cs.fontSize);
    const weight = Number(cs.fontWeight) || 400;
    // WCAG large text: 24px, or 18.66px when bold.
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    const need = large ? 3 : 4.5;
    const cr = ratio(fg, bg);
    if (cr + 0.005 < need) {
      findings.push({
        text: text.slice(0, 60),
        ratio: Number(cr.toFixed(2)),
        need,
        size,
        weight,
        colour: cs.color,
        background: `rgb(${bg.slice(0, 3).map(Math.round).join(', ')})`,
        selector: el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).split(/\s+/).slice(0, 3).join('.') : ''),
      });
    }
  }
  return { findings, unmeasurable };
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
let total = 0;
let unreadable = 0;
const byText = new Map();

for (const p of paths) {
  const res = await page.goto(BASE + p, { waitUntil: 'networkidle' }).catch(() => null);
  if (!res || !res.ok()) {
    console.log(`  ?  ${p}  (${res ? res.status() : 'no response'})`);
    continue;
  }
  const { findings: found, unmeasurable } = await page.evaluate(MEASURE);
  total += found.length;
  if (unmeasurable.length) {
    unreadable += unmeasurable.length;
    console.log(`\n${p}  ${unmeasurable.length} text node(s) on a raster image, not measurable here`);
  }
  if (found.length) {
    console.log(`\n${p}  ${found.length} failing`);
    for (const f of found) {
      console.log(
        `   ${String(f.ratio).padStart(5)} / ${f.need}  ${String(f.size) + 'px'.padEnd(2)} w${f.weight}  ${f.colour} on ${f.background}\n         "${f.text}"  ${f.selector}`
      );
      const key = `${f.colour}|${f.background}|${f.need}`;
      byText.set(key, (byText.get(key) ?? 0) + 1);
    }
  }
}

await browser.close();

console.log(`\n${'='.repeat(70)}`);
console.log(`${total} failing text nodes across ${paths.length} routes.`);
if (unreadable) {
  console.log(`${unreadable} more sit on a raster image and need looking at by eye.`);
}
if (byText.size) {
  console.log('\nGrouped by colour pair, commonest first:');
  for (const [k, n] of [...byText].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(n).padStart(4)}x  ${k}`);
  }
}
process.exit(total ? 1 : 0);
