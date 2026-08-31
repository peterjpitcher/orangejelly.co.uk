/**
 * Finds images the browser is stretching.
 *
 * WHY THIS EXISTS. The footer mark shipped squashed: a 640x667 icon rendering at
 * 300x40, a flattened ellipse where a round orange slice should be. The class on it
 * was `h-10 w-auto`, which is exactly what you would write and reads as correct in
 * review. It is not, inside a column flex container: `align-items` defaults to
 * `stretch`, the cross axis of a column is the width, and a stretched flex item
 * beats `width: auto`. `object-fit` then defaults to `fill`, so the pixels squash
 * rather than letterbox.
 *
 * Nothing caught it. Unit tests cannot: jsdom has no layout, so `getBoundingClientRect`
 * returns zeroes and every aspect ratio is NaN. The only place this is visible is a
 * real browser, which is where this runs.
 *
 * It compares each image's rendered aspect ratio against its intrinsic one. Anything
 * off by more than a rounding error, while `object-fit` is `fill`, is being distorted.
 * `cover` and `contain` are excluded on purpose: those crop or letterbox by design,
 * so a mismatch there is the author's intent rather than an accident.
 *
 *   node scripts/audit-images.mjs [baseUrl]
 */
import { chromium } from 'playwright';

const BASE = process.argv[2] ?? 'http://localhost:3000';
const { ROUTES } = await import('../src/lib/route-manifest.js').then((m) => m.default ?? m);

// 4% covers sub-pixel rounding at small sizes without hiding a real squash. The
// footer bug was off by a factor of 7.8, so nothing near the boundary is interesting.
const TOLERANCE = 0.04;

const paths = ROUTES.filter((r) => r.disposition === 'live')
  .map((r) => r.path)
  .filter((p) => !p.includes('['));

const MEASURE = () => {
  const out = [];
  for (const img of document.querySelectorAll('img')) {
    // An image that has not decoded has no intrinsic size to compare against.
    if (!img.naturalWidth || !img.naturalHeight) continue;
    const rect = img.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) continue;

    const style = getComputedStyle(img);
    // cover and contain distort nothing: they crop or letterbox deliberately.
    if (style.objectFit !== 'fill') continue;

    /*
     * Only measure images that have finished arriving.
     *
     * A first version of this reported a card image as 4% distorted on one run and
     * clean on the next. The class on it was `transition-opacity duration-300`: it
     * was measured mid-fade, while the browser was still settling its box. A check
     * that disagrees with itself between runs gets ignored, so the settling states
     * are excluded rather than tolerated.
     */
    if (!img.complete) continue;
    if (style.opacity !== '1') continue;
    if (style.transitionProperty !== 'none' && style.transitionDuration !== '0s') {
      // Still animatable. Only skip if it has not settled, which the caller
      // guarantees by waiting; this is belt and braces for slow machines.
      if (img.getAnimations?.().some((a) => a.playState === 'running')) continue;
    }

    const intrinsic = img.naturalWidth / img.naturalHeight;
    const rendered = rect.width / rect.height;
    out.push({
      alt: img.alt || '(no alt)',
      className: img.className,
      intrinsic: Number(intrinsic.toFixed(3)),
      rendered: Number(rendered.toFixed(3)),
      skew: Number((rendered / intrinsic).toFixed(2)),
      natural: `${img.naturalWidth}x${img.naturalHeight}`,
      box: `${Math.round(rect.width)}x${Math.round(rect.height)}`,
    });
  }
  return out;
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const distorted = new Map();
let checked = 0;

for (const p of paths) {
  const res = await page.goto(BASE + p, { waitUntil: 'networkidle' }).catch(() => null);
  if (!res || !res.ok()) {
    console.log(`  ?  ${p}  (${res ? res.status() : 'no response'})`);
    continue;
  }

  // Lazy images below the fold never decode, so they have no intrinsic size and would
  // be skipped silently. The footer mark is one of them, which is how the original bug
  // hid from a first version of this check that did not do it.
  await page.evaluate(() => {
    for (const img of document.querySelectorAll('img')) img.loading = 'eager';
    window.scrollTo(0, document.body.scrollHeight);
  });
  // Long enough for the 300ms card fade to finish, plus a decode margin. The images
  // are local, so this is settling time rather than network time.
  await page.waitForTimeout(1200);
  await page.evaluate(() => Promise.all(
    [...document.querySelectorAll('img')].map((i) => i.decode().catch(() => {}))
  ));

  const found = await page.evaluate(MEASURE);
  checked += found.length;
  for (const f of found.filter((x) => Math.abs(x.skew - 1) > TOLERANCE)) {
    const key = `${f.alt}|${f.natural}|${f.box}|${f.className}`;
    if (!distorted.has(key)) distorted.set(key, { ...f, routes: [] });
    distorted.get(key).routes.push(p);
  }
}

await browser.close();

console.log(`\n${'='.repeat(70)}`);
if (!distorted.size) {
  console.log(`No distorted images. ${checked} checked across ${paths.length} routes.`);
  process.exit(0);
}

console.log(`${distorted.size} distorted image(s), ${checked} checked across ${paths.length} routes.\n`);
for (const item of distorted.values()) {
  console.log(`  "${item.alt}"`);
  console.log(`    natural ${item.natural} (${item.intrinsic}) rendered ${item.box} (${item.rendered})`);
  console.log(`    stretched by x${item.skew}  class="${item.className}"`);
  console.log(`    on ${item.routes.length} route(s), e.g. ${item.routes[0]}`);
  console.log(
    `    likely cause: a flex parent stretching it. Add self-start, or set an explicit width.\n`
  );
}
process.exit(1);
