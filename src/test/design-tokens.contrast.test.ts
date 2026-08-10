import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import tailwindConfig from '../../tailwind.config.js';
import {
  BRAND_ORANGE,
  BRAND_ORANGE_DARK,
  BRAND_CHARCOAL,
  BRAND_BLUE,
  BRAND_SURFACE,
} from '@/lib/poll-emails/shell';
import { THEME_COLORS } from '@/lib/theme-colors';
import { getAllCategoryConfigs } from '@/lib/category-colours';

/**
 * The palette's accessibility contract, asserted against the real token values.
 *
 * Every number in here was measured on the running site and then written into the
 * comments in tailwind.config.js and globals.css. This file is what stops those
 * comments becoming fiction: it reads the actual hexes rather than restating them,
 * so changing a brand colour without re-checking its contrast fails the suite.
 *
 * The rules it encodes, learned from what was actually broken:
 *
 *   1. Contrast direction reverses by surface. On cream you darken to gain
 *      contrast; on navy you lighten. A single "hover is darker" rule produced
 *      2.62:1 footer links the first time round.
 *   2. A hover state must move further into contrast than its resting state.
 *      `orange.dark` once aliased a colour LIGHTER than the brand orange, so every
 *      button lit up on hover and dropped white text to 2.38:1.
 *   3. Anything that renders outside the build (email hexes, the shadcn --ring
 *      triplet) has to be pinned to the same source, or it silently drifts.
 */

const CSS = readFileSync(path.resolve(__dirname, '../app/globals.css'), 'utf8');

// --- colour maths, WCAG 2.1 relative luminance ------------------------------

function toRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '').trim();
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
}

function channel(v: number): number {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function luminance(hex: string): number {
  const [r, g, b] = toRgb(hex);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Composite a colour at `alpha` over an opaque background, as the browser would. */
function over(fg: string, alpha: number, bg: string): string {
  const f = toRgb(fg);
  const b = toRgb(bg);
  return (
    '#' +
    f
      .map((c, i) =>
        Math.round(c * alpha + b[i] * (1 - alpha))
          .toString(16)
          .padStart(2, '0')
      )
      .join('')
  );
}

/** Pull a custom property's literal value out of globals.css. */
function cssVar(name: string): string {
  const m = CSS.match(new RegExp(`^\\s*${name}\\s*:\\s*([^;]+);`, 'm'));
  if (!m) throw new Error(`${name} is not declared in globals.css`);
  return m[1].trim();
}

// --- the tokens under test, read from source --------------------------------

const colors = tailwindConfig.theme.extend.colors as Record<string, Record<string, string>>;
const ORANGE = colors.orange;
const BRAND = colors.brand;

const WHITE = '#FFFFFF';
const CREAM = colors.surface.DEFAULT; // the page background
const NAVY = colors['brand-base'].DEFAULT; // the header and footer background

const AA_BODY = 4.5;
const AA_LARGE = 3;
const AA_NON_TEXT = 3; // WCAG 1.4.11, focus rings and UI boundaries

describe('orange ramp', () => {
  it('should keep the brand orange as the Orange Jelly brand colour', () => {
    // Guards against a well-meaning "fix" that swaps the brand for a Tailwind
    // stock orange to make a contrast warning go away. The ramp below is how
    // contrast gets solved; the brand hex is not negotiable.
    expect(ORANGE.DEFAULT.toUpperCase()).toBe('#F16F23');
    expect(BRAND.DEFAULT.toUpperCase()).toBe(ORANGE.DEFAULT.toUpperCase());
  });

  it('should darken monotonically from DEFAULT through dark to darker', () => {
    // The bug this pins: `dark` once resolved to a colour lighter than DEFAULT,
    // so every hover reduced contrast instead of increasing it.
    expect(luminance(ORANGE.dark)).toBeLessThan(luminance(ORANGE.DEFAULT));
    expect(luminance(ORANGE.darker)).toBeLessThan(luminance(ORANGE.dark));
  });

  it('should let a filled control be the brand orange with a navy label', () => {
    /*
     * The pairing every CTA, badge and filled band now uses.
     *
     * This is the correction to a wrong turn: white on the brand orange is
     * 2.98:1, and the first fix darkened the FILL until white worked, which
     * pushed every button away from the logo colour. Navy on the brand orange is
     * 4.55:1, so the label was the thing to change. Keep both assertions: they
     * are what stops someone "fixing" the contrast by darkening the fill again.
     */
    expect(contrast(NAVY, ORANGE.DEFAULT)).toBeGreaterThanOrEqual(AA_BODY);
    expect(contrast(WHITE, ORANGE.DEFAULT)).toBeLessThan(AA_BODY);
  });

  it('should darken the label, not the fill, on hover', () => {
    // Deepening the fill breaks the navy label: it falls to about 4.05:1 one step
    // down. The hover moves the label to brand-base-dark instead, on the same fill.
    const hoverLabel = colors['brand-base'].dark;
    expect(contrast(hoverLabel, ORANGE.DEFAULT)).toBeGreaterThanOrEqual(AA_BODY);
    expect(contrast(hoverLabel, ORANGE.DEFAULT)).toBeGreaterThan(contrast(NAVY, ORANGE.DEFAULT));
  });

  it('should let orange-dark carry white body text', () => {
    // Retained for the inverse controls: a white or light fill with an orange-dark
    // label, and outline buttons that fill on hover.
    expect(contrast(WHITE, ORANGE.dark)).toBeGreaterThanOrEqual(AA_BODY);
  });

  it('should let orange-dark act as body text on the page background', () => {
    // Inline links on cream.
    expect(contrast(ORANGE.dark, CREAM)).toBeGreaterThanOrEqual(AA_BODY);
  });

  it('should give orange-darker more contrast than orange-dark on both surfaces', () => {
    // A hover has to be an improvement, not just a change.
    expect(contrast(WHITE, ORANGE.darker)).toBeGreaterThan(contrast(WHITE, ORANGE.dark));
    expect(contrast(ORANGE.darker, CREAM)).toBeGreaterThan(contrast(ORANGE.dark, CREAM));
  });

  it('should let the brand orange carry body text on the navy surfaces', () => {
    // Footer links and the metrics bar. On navy the ramp runs the other way:
    // orange-dark is ~2.8:1 here, the brand orange is ~4.55:1.
    expect(contrast(ORANGE.DEFAULT, NAVY)).toBeGreaterThanOrEqual(AA_BODY);
  });

  it('should lighten, not darken, for the hover on dark surfaces', () => {
    // Link's `orange-on-dark` hovers to brand.highlight.
    expect(luminance(BRAND.highlight)).toBeGreaterThan(luminance(ORANGE.DEFAULT));
    expect(contrast(BRAND.highlight, NAVY)).toBeGreaterThan(contrast(ORANGE.DEFAULT, NAVY));
  });

  it('should document that the brand orange cannot carry white text or sit on cream', () => {
    // Not a wish, a measurement. If a future palette change makes these pass, the
    // guidance in tailwind.config.js is stale and should be rewritten.
    expect(contrast(WHITE, ORANGE.DEFAULT)).toBeLessThan(AA_BODY);
    expect(contrast(ORANGE.DEFAULT, CREAM)).toBeLessThan(AA_BODY);
  });
});

describe('focus ring', () => {
  const ring = cssVar('--color-focus-ring');

  it('should be a literal hex rather than an alias of another token', () => {
    // Pointing this at --color-accent or --color-orange-dark fails one surface or
    // the other. It needs its own lightness.
    expect(ring).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it('should clear the non-text minimum on both surfaces it appears over', () => {
    expect(contrast(ring, CREAM)).toBeGreaterThanOrEqual(AA_NON_TEXT);
    expect(contrast(ring, NAVY)).toBeGreaterThanOrEqual(AA_NON_TEXT);
  });

  it('should match the shadcn --ring triplet', () => {
    // Two declarations, one colour. shadcn components ring off --ring; everything
    // else rings off --color-focus-ring. They drifted apart once already.
    const hsl = CSS.match(/--ring:\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%/);
    expect(hsl).not.toBeNull();
    const [h, s, l] = [Number(hsl![1]), Number(hsl![2]) / 100, Number(hsl![3]) / 100];
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      return Math.round((l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))) * 255);
    };
    const fromHsl = [f(0), f(8), f(4)];
    const fromHex = toRgb(ring);
    // Rounding between hex and hsl notation costs at most a unit per channel.
    fromHsl.forEach((v, i) => expect(Math.abs(v - fromHex[i])).toBeLessThanOrEqual(2));
  });
});

describe('surfaces and body text', () => {
  it('should carry body text on the page background', () => {
    expect(contrast(NAVY, CREAM)).toBeGreaterThanOrEqual(AA_BODY);
  });

  it('should carry white text on both dark fills', () => {
    expect(contrast(WHITE, NAVY)).toBeGreaterThanOrEqual(AA_BODY);
    expect(contrast(WHITE, colors['blue-support'].DEFAULT)).toBeGreaterThanOrEqual(AA_BODY);
  });

  it('should need dark text on the highlight fill, never white', () => {
    // brand.highlight is a light tint of the brand orange. White on it is ~2.05:1.
    expect(contrast(WHITE, BRAND.highlight)).toBeLessThan(AA_LARGE);
    expect(contrast(NAVY, BRAND.highlight)).toBeGreaterThanOrEqual(AA_BODY);
  });

  it('should keep muted body text above the floor at the opacity actually used', () => {
    // /60 measured 3.90:1 on white and was swept to /75 across 60 call sites.
    expect(contrast(over(NAVY, 0.6, WHITE), WHITE)).toBeLessThan(AA_BODY);
    expect(contrast(over(NAVY, 0.75, WHITE), WHITE)).toBeGreaterThanOrEqual(AA_BODY);
    expect(contrast(over(NAVY, 0.75, CREAM), CREAM)).toBeGreaterThanOrEqual(AA_BODY);
  });
});

describe('values duplicated outside the Tailwind build', () => {
  it('should keep globals.css in step with the Tailwind orange ramp', () => {
    expect(cssVar('--color-accent').toUpperCase()).toBe(ORANGE.DEFAULT.toUpperCase());
    expect(cssVar('--color-orange-dark').toUpperCase()).toBe(ORANGE.dark.toUpperCase());
    expect(cssVar('--color-orange-darker').toUpperCase()).toBe(ORANGE.darker.toUpperCase());
  });

  it('should keep the email hexes in step, since an inbox has no build step', () => {
    expect(BRAND_ORANGE.toUpperCase()).toBe(ORANGE.DEFAULT.toUpperCase());
    expect(BRAND_ORANGE_DARK.toUpperCase()).toBe(ORANGE.dark.toUpperCase());
    expect(BRAND_CHARCOAL.toUpperCase()).toBe(NAVY.toUpperCase());
    expect(BRAND_BLUE.toUpperCase()).toBe(colors['blue-support'].DEFAULT.toUpperCase());
    expect(BRAND_SURFACE.toUpperCase()).toBe(CREAM.toUpperCase());
  });

  it('should only use the interactive orange behind white text in emails', () => {
    // The email CTA is a solid fill with white label text and no hover to fall
    // back on, so the resting colour is the only chance to get it right.
    expect(contrast(WHITE, BRAND_ORANGE_DARK)).toBeGreaterThanOrEqual(AA_BODY);
  });

  it('should keep the THEME_COLORS map in step', () => {
    expect(THEME_COLORS.accent.toUpperCase()).toBe(ORANGE.DEFAULT.toUpperCase());
    expect(THEME_COLORS.base.toUpperCase()).toBe(NAVY.toUpperCase());
  });
});

describe('blog category palette', () => {
  // category-colours.ts opens with "All primary colours pass WCAG AA contrast for
  // white text". This session found several comments that had quietly become
  // fiction, so the claim is checked rather than trusted.
  it('should carry white text on every category colour, as its header claims', () => {
    for (const config of getAllCategoryConfigs()) {
      const ratio = contrast(WHITE, config.primary);
      expect(
        ratio,
        `${config.label} (${config.primary}) is ${ratio.toFixed(2)}:1 against white`
      ).toBeGreaterThanOrEqual(AA_BODY);
    }
  });

  it('should carry white text across the whole gradient, not just its first stop', () => {
    // The Events gradient ended on #E65100 at 3.79:1, so the label faded out
    // towards the bottom of the card while the top of it passed.
    for (const config of getAllCategoryConfigs()) {
      for (const stop of config.gradient.match(/#[0-9a-fA-F]{6}/g) ?? []) {
        const ratio = contrast(WHITE, stop);
        expect(
          ratio,
          `${config.label} gradient stop ${stop} is ${ratio.toFixed(2)}:1 against white`
        ).toBeGreaterThanOrEqual(AA_BODY);
      }
    }
  });
});
