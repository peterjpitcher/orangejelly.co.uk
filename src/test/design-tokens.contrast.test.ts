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

/*
 * ── Repositioning palette (2026) ──────────────────────────────────────────────
 *
 * The new palette gives colours deliberately different jobs to the old one, so
 * passing the legacy matrix proves nothing about it. Orange is a signal for action
 * rather than a background, peach exists only as a highlight, and the same ink is
 * used for text, borders and full-bleed inverse sections.
 *
 * These assert the pairs the design system actually approves, and the ones it
 * warns about. The most important is the last: orange is NOT a body-text colour on
 * cream, which is exactly the mistake the --oj-orange-deep step exists to prevent.
 */
describe('repositioning palette contrast', () => {
  const OJ = {
    orange: cssVar('--oj-orange'),
    orangeDeep: cssVar('--oj-orange-deep'),
    ember: cssVar('--oj-ember'),
    ink: cssVar('--oj-ink'),
    ink2: cssVar('--oj-ink-2'),
    ink3: cssVar('--oj-ink-3'),
    cream: cssVar('--oj-cream'),
    paper: cssVar('--oj-paper'),
    peach: cssVar('--oj-peach'),
    ok: cssVar('--oj-ok'),
    danger: cssVar('--oj-danger'),
  };

  it('resolves every token from the stylesheet', () => {
    for (const [name, value] of Object.entries(OJ)) {
      expect(value, `--oj-${name} did not resolve`).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  describe('body text, needs 4.5:1', () => {
    const cases: Array<[string, string, string]> = [
      ['ink on cream', OJ.ink, OJ.cream],
      ['ink on paper', OJ.ink, OJ.paper],
      ['ink on peach', OJ.ink, OJ.peach],
      ['ink on orange', OJ.ink, OJ.orange],
      ['cream on ink', OJ.cream, OJ.ink],
      ['secondary ink on cream', OJ.ink2, OJ.cream],
      ['ember on cream', OJ.ember, OJ.cream],
      ['danger on paper', OJ.danger, OJ.paper],
      ['ok on paper', OJ.ok, OJ.paper],
    ];

    it.each(cases)('%s clears 4.5:1', (_name, fg, bg) => {
      expect(contrast(fg, bg)).toBeGreaterThanOrEqual(4.5);
    });
  });

  describe('large and non-text, needs 3:1', () => {
    const cases: Array<[string, string, string]> = [
      ['muted ink on cream', OJ.ink3, OJ.cream],
      ['orange on ink, for inverse sections', OJ.orange, OJ.ink],
      ['ink border on cream', OJ.ink, OJ.cream],
    ];

    it.each(cases)('%s clears 3:1', (_name, fg, bg) => {
      expect(contrast(fg, bg)).toBeGreaterThanOrEqual(3);
    });
  });

  it('does not let orange become a body-text colour on cream', () => {
    // The whole reason --oj-orange-deep exists.
    expect(contrast(OJ.orange, OJ.cream)).toBeLessThan(4.5);
  });

  /*
   * ── The three corrections of 28 August 2026 ─────────────────────────────────
   *
   * These were `it.fails` markers describing real defects in the supplied palette,
   * raised with the design team on 27 August. All three came back corrected, so the
   * markers are gone and these are ordinary assertions again. That is the point of
   * having marked them rather than deleting or loosening them: the requirement
   * never moved, only the palette did.
   *
   * @see tasks/repositioning/DESIGNER-CONTRAST-2026-08-27.md for what was raised
   * @see tasks/repositioning/decisions.md D33 for what came back
   */
  it('gives the accent link enough contrast on cream', () => {
    // Was 4.27:1 with #C05408. Now 4.81:1 with #B34E08, which is two steps past the
    // minimum correction on purpose: a value clearing 4.5 by 0.02 is the same
    // mistake as one missing by 0.0005, facing the other way.
    expect(contrast(OJ.orangeDeep, OJ.cream)).toBeGreaterThanOrEqual(4.5);
  });

  it('gives the accent link enough contrast on paper', () => {
    // Was 4.4995:1, short by five ten-thousandths. Now 5.06:1.
    expect(contrast(OJ.orangeDeep, OJ.paper)).toBeGreaterThanOrEqual(4.5);
  });

  it('keeps accent text off the sunken surface, where it does not clear 4.5:1', () => {
    // 4.32:1 on --oj-cream-2. The correction did not lift it far enough to make the
    // accent safe on every surface, so the rule is written down here rather than
    // left to be rediscovered: sunken surfaces take ink body text, not accent.
    expect(contrast(OJ.orangeDeep, cssVar('--oj-cream-2'))).toBeLessThan(4.5);
  });

  it('draws the focus ring in ink, so it reads on light surfaces', () => {
    // WCAG 1.4.11. The outer band was orange at 2.73:1 on cream and 2.87:1 on
    // paper, which is a focus indicator keyboard users cannot see. Ink is 14.02:1
    // and 14.76:1.
    expect(contrast(OJ.ink, OJ.cream)).toBeGreaterThanOrEqual(3);
    expect(contrast(OJ.ink, OJ.paper)).toBeGreaterThanOrEqual(3);
  });

  it('lets the inner band carry the ring on ink sections', () => {
    // On an ink surface the ink outer band disappears into the background, and the
    // page-colour inner band is what makes the ring visible. 14.02:1. This is why
    // the ring needs no per-surface logic.
    //
    // --oj-surface-page is an alias rather than a hex, so the alias is checked and
    // the ratio is measured against what it resolves to.
    expect(cssVar('--oj-surface-page')).toBe('var(--oj-cream)');
    expect(contrast(OJ.cream, OJ.ink)).toBeGreaterThanOrEqual(3);
  });

  it('keeps the ring pointed at ink, in the one place it is declared', () => {
    // The ring was written out as a box-shadow literal in four files. It is now one
    // token. This asserts the token itself, because the correction is only real if
    // nothing quietly points the outer band back at orange.
    const ring = cssVar('--oj-ring');
    expect(ring).toContain('var(--oj-ink)');
    expect(ring).not.toContain('var(--oj-orange)');
  });

  it('reads the demand hue on its own tint', () => {
    // Was 3.98:1, the only one of the seven that failed. Now 4.89:1 with #276E66.
    expect(contrast(cssVar('--cat-demand'), cssVar('--cat-demand-soft'))).toBeGreaterThanOrEqual(
      4.5
    );
  });

  it('keeps text on the peach highlight band readable', () => {
    // The band sits behind display type, so ink over peach is the pair that matters.
    expect(contrast(OJ.ink, OJ.peach)).toBeGreaterThanOrEqual(4.5);
  });

  describe('taxonomy hues on their own soft tint, needs 4.5:1', () => {
    // 'demand' was a known failure and is fixed. 'ops' is a known failure and is
    // asserted separately below.
    const pairs = ['demand', 'convert', 'margin', 'experience', 'scale', 'hospitality'] as const;

    it.each(pairs)('%s reads on its tint', (name) => {
      const fg = cssVar(`--cat-${name}`);
      const bg = cssVar(`--cat-${name}-soft`);
      expect(fg, `--cat-${name} missing`).toMatch(/^#[0-9a-f]{6}$/i);
      expect(contrast(fg, bg)).toBeGreaterThanOrEqual(4.5);
    });

    it.each([...pairs, 'ops'] as const)('%s also reads on cream', (name) => {
      // ops is included here: it is only the tint pairing that fails, and the hue
      // is fine on the page background at 5.00:1.
      expect(contrast(cssVar(`--cat-${name}`), OJ.cream)).toBeGreaterThanOrEqual(4.5);
    });

    /*
     * KNOWN FAIL, raised with the design team on 28 August 2026.
     *
     * --cat-ops #6B6D2F on --cat-ops-soft #E9E9DC is 4.4513:1, short of 4.5:1 by
     * 0.0487. Both values are the pack's, so this is a defect in the supplied
     * palette rather than in this repository.
     *
     * IT WAS HIDDEN BY OUR OWN DRIFT. Against the tint this repo previously held,
     * #EAEBDC, the same hue reads 4.5191:1 and passes. That is why the memo of 27
     * August reported ops as passing at 4.52, and why the design team confirmed
     * "ops and experience both pass": both were reading a number that only existed
     * here. Syncing the tints to the pack is what exposed it.
     *
     * LATENT, NOT LIVE. CategoryTag has no production consumer yet, and the tint is
     * the background only when `filled` is passed, which happens once, in a test,
     * for a different category. Nobody has seen this pairing. It is marked rather
     * than fixed locally because the hue is the design team's to change, and
     * darkening it here would put the repository back into a private fork of their
     * palette, which is the thing that caused this.
     *
     * The marker fails for "unexpectedly passed" the moment a corrected hue lands,
     * which forces it to be removed rather than quietly outliving the problem.
     */
    it.fails('KNOWN FAIL: ops reads on its own tint', () => {
      expect(contrast(cssVar('--cat-ops'), cssVar('--cat-ops-soft'))).toBeGreaterThanOrEqual(4.5);
    });

    it('still clears the 3:1 that its border and dot need', () => {
      // SC 1.4.11 governs the tag's 1.5px border and its dot, which are non-text.
      // Those are fine; the failure is specific to the label at 12.5px.
      expect(contrast(cssVar('--cat-ops'), cssVar('--cat-ops-soft'))).toBeGreaterThanOrEqual(3);
    });
  });
});

describe('the web app manifest', () => {
  it('uses the real palette values, not an approximation of them', async () => {
    // The manifest is JSON the operating system reads, so its colours have to be
    // literal: there is no stylesheet on an Android home screen. That makes them
    // the one place a palette change can silently fail to reach, which is what this
    // pins down.
    const manifest = (await import('@/app/manifest')).default();
    expect(manifest.theme_color.toLowerCase()).toBe(cssVar('--oj-orange').toLowerCase());
    expect(manifest.background_color.toLowerCase()).toBe(cssVar('--oj-paper').toLowerCase());
  });
});

describe('the last-resort error page', () => {
  it('uses the real palette values, since it renders without the stylesheet', () => {
    // global-error.tsx replaces the root layout, so it has no access to the
    // stylesheet or to Tailwind. Its colours are literal by necessity, which makes
    // them the other place a palette change can silently fail to reach.
    const source = readFileSync(path.resolve(__dirname, '../app/global-error.tsx'), 'utf8');
    expect(source).toContain(cssVar('--oj-orange'));
    expect(source).toContain(cssVar('--oj-ink'));
  });

  it('keeps that page readable', () => {
    // Ink on orange, which is the one pairing the page has.
    expect(contrast(cssVar('--oj-ink'), cssVar('--oj-orange'))).toBeGreaterThanOrEqual(4.5);
  });
});

/**
 * The repositioning palette against the pack it came from.
 *
 * Every one of the seven `--cat-*-soft` tints differed from
 * `docs/brand/design-system/tokens/colors.css` by one to three per channel, in
 * mixed directions, from the moment they were first written. Nothing recorded it as
 * an override and the commit that introduced them stated that no colour value had
 * been changed.
 *
 * It mattered more than a rounding difference. The contrast memo sent to the design
 * team on 27 August was measured against our tints, so the ratios we reported, and
 * the ratios they confirmed back to us, described a palette nobody else was
 * running. One pair, `--cat-ops`, passes on our tint and fails on theirs.
 *
 * A palette held in two places drifts silently and by eye is undetectable. This
 * diffs them.
 */
describe('palette parity with the supplied pack', () => {
  const PACK = readFileSync(
    path.resolve(__dirname, '../../docs/brand/design-system/tokens/colors.css'),
    'utf8'
  );

  function hexTokens(source: string): Map<string, string> {
    const found = new Map<string, string>();
    for (const match of source.matchAll(/(--[a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{3,8})\s*;/g)) {
      found.set(match[1], match[2].toLowerCase());
    }
    return found;
  }

  /**
   * Divergences that are deliberate, each with the reason and the date it was
   * agreed. The vendored pack copy is the 26 August delivery and predates the
   * corrections the design team issued on the 28th.
   *
   * Anything not on this list fails. Adding to it without a reason is the thing
   * that produced the tint drift.
   */
  const APPROVED_DIVERGENCE: Record<string, { ours: string; why: string }> = {
    '--oj-orange-deep': {
      ours: '#b34e08',
      why: 'Design team correction, 28 Aug 2026. Pack #C05408 gives 4.27:1 on cream, under the 4.5:1 needed for a body-text accent.',
    },
    '--cat-demand': {
      ours: '#276e66',
      why: 'Design team correction, 28 Aug 2026. Pack #2E7D74 gives 3.99:1 on its own tint.',
    },
  };

  const ours = hexTokens(CSS);
  const pack = hexTokens(PACK);
  const shared = [...pack.keys()].filter(
    (name) => name.startsWith('--oj-') || name.startsWith('--cat-')
  );

  it('holds every token the pack defines', () => {
    const missing = shared.filter((name) => !ours.has(name));
    expect(missing).toEqual([]);
  });

  it('matches the pack everywhere except the two agreed corrections', () => {
    const unexplained = shared
      .filter((name) => ours.get(name) !== pack.get(name))
      .filter((name) => APPROVED_DIVERGENCE[name]?.ours !== ours.get(name))
      .map((name) => `${name}: pack ${pack.get(name)}, ours ${ours.get(name)}`);

    expect(unexplained).toEqual([]);
  });

  it('holds the two corrections at exactly the agreed values', () => {
    for (const [name, { ours: expected }] of Object.entries(APPROVED_DIVERGENCE)) {
      expect(ours.get(name)).toBe(expected);
    }
  });

  it('carries all seven taxonomy tints, which is where the drift was', () => {
    const softs = shared.filter((name) => name.endsWith('-soft') && name.startsWith('--cat-'));
    expect(softs).toHaveLength(7);
    for (const name of softs) {
      expect(ours.get(name)).toBe(pack.get(name));
    }
  });
});
