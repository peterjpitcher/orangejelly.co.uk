# Contrast corrections: applied, and one thing we got wrong

**To:** the design team
**From:** Orange Jelly implementation
**Date:** 28 August 2026
**Re:** your response of 27 August

All three corrections are in. Every ratio you quoted reproduces here to two decimal
places. Two follow-ups, one of which is a correction to the memo we sent you.

---

## Applied

| Token | Now | Measured here |
|---|---|---|
| focus ring, outer band | `var(--oj-ink)` | 14.02:1 cream, 14.76:1 paper |
| `--oj-orange-deep` | `#B34E08` | 4.81:1 cream, 5.06:1 paper |
| `--cat-demand` | `#276E66` | 4.89:1 tint, 5.50:1 cream |

The ring was written out as a box-shadow literal in four files. It is now one
`--oj-ring` token and the three components reference it. We could not take your
`--ring` name: it is occupied here by the legacy shadcn theme, which stores an HSL
triplet rather than a shadow, so it is `--oj-ring` in our namespace.

Test markers handled as you asked. The two link markers and the demand marker
flipped to passing and are ordinary assertions again. The two ring markers are
replaced by assertions that the ring colour clears 3:1 on both surfaces, plus one
that the token itself still points at ink, because the correction is only real if
nothing quietly points the outer band back at orange. The orange-on-cream
documentation test is untouched.

Your usage rule is written down as a test rather than a note: accent text is
asserted to be **below** 4.5:1 on `--oj-cream-2`, so anyone who puts it there gets a
failing build rather than a comment they did not read.

---

## 1. The memo we sent you was measured against the wrong tints

This is ours, and it matters.

All seven `--cat-*-soft` tints in our stylesheet differed from
`tokens/colors.css`, by one to three per channel, in mixed directions, from the
moment they were first written. Nothing recorded it as an override, and the commit
that introduced them stated that no colour value had been changed. That was wrong.

So the "on its own tint" column in our 27 August memo describes a palette only we
were running. You can see it in the range you quoted back to us: 4.52 to 5.85 are
our numbers, not yours.

| | our tint | your tint |
|---|---|---|
| ops | 4.5191 | **4.4513** |
| margin | 5.8516 | 5.7695 |
| experience | 4.5486 | 4.5878 |
| scale | 5.1217 | 5.1442 |
| hospitality | 4.7243 | 4.7049 |

We have synced all seven to yours. A parity test now diffs our palette against
`docs/brand/design-system/tokens/colors.css` on every run and fails on any
divergence that is not one of your two corrections, each recorded with its reason.
We will not hold a private fork of your palette again.

Future memos from us will state which token file they were measured against.

## 2. `--cat-ops` does not pass, and it is your tint that shows it

`--cat-ops #6B6D2F` on `--cat-ops-soft #E9E9DC` is **4.4513:1**, short of 4.5:1 by
0.0487. Both values are yours. It read 4.5191:1 here only because of the drift
above, which is why our memo reported it passing and why "ops and experience both
pass" got confirmed back to us.

The threshold is 4.5, not 3. Your `CategoryTag` renders the label at 12.5px/700 and
our port at 12px/600. Large text starts at 18.66px bold, so neither qualifies. SC
1.4.11 covers the 1.5px border and the dot at 3:1, which the pair clears; it applies
in addition to 1.4.3, not instead of it.

**This is latent, not live.** The tint is the background only when `filled` is
passed, and `CategoryTag` has no production consumer here yet. Nobody has seen it.
We are not treating it as urgent.

**We have not fixed it locally,** and we would rather not. The hue is yours to
change, the hue is where the headroom is (the tint is at the light end already), and
darkening it here would put us straight back into the private fork we have just
removed. It is marked `it.fails` in our suite with the measured ratio, using the
mechanism you asked us to keep, so it flips to "unexpectedly passed" the moment a
corrected value lands and forces the marker out.

**Also worth saying:** experience was not propped up by our drift. It reads 4.5878
on your tint and 4.5486 on ours, and passes on both. Ops is the only one of the
seven where the drift changed the verdict.

---

## What we would ask for

One corrected `--cat-ops` hue, dark enough to clear 4.5:1 on `#E9E9DC` with real
margin rather than by hundredths, on the same reasoning you applied to
`--oj-orange-deep`. `#65672C` gives 4.86:1 on the tint and 5.46:1 on cream; `#5F612A` gives
5.31:1 and 5.97:1. Both hold the hue angle. Your call on which, and on whether the frozen-tint rule means you would
rather move the hue than the tint here too.

No rush on our side. It is tracked and it is not shipping in front of anybody.

---

## Round two: the orange band, raised 28 August 2026

### What changed and why

Peter asked for white text on orange backgrounds, for impact. White on the brand
orange `#f76b0c` measures **2.97:1**. That fails body text at 4.5:1 and fails even
the 3:1 large-text floor, so it could not ship as asked.

Rather than refuse the instruction or ship a failure, the orange sections now sit on
a new surface token:

```css
--oj-surface-band: var(--oj-orange-deep);  /* #b34e08 */
--oj-text-on-band: #ffffff;
```

White on that ground is **5.24:1** and passes at every size. A deeper ground under
white type also reads as more emphatic, which was the point of the request.

The brand orange keeps its existing job as the action fill on buttons, tags,
pagination and the like, where the text is ink at 5.13:1 and unchanged.

Applied to: the hero bands on `/start-here`, `/growth-problems/[slug]` and
`/results/[slug]`, the campaign header, and the sticky call-to-action bar.

### One thing this fixed that was already broken

The campaign header with `tone="orange"` put white nav links on the brand orange.
That was **2.97:1** before this change as well as after it, on `/start-here` and every
growth problem page. It is now 5.24:1.

The sticky bar's dismiss control was `ink/70` over orange, which composites to
**3.27:1**. Text needs 4.5:1, and it is the only way to clear a bar that covers
content on a short screen. Now full strength on the band.

### One thing this made worse, and it needs your decision

Buttons on a band keep the heavy ink border the pack specifies. Against the brand
orange that border was 5.13:1. Against the deeper band it is **2.92:1**, a hair under
the 3:1 that WCAG 1.4.11 asks of a control boundary.

It has been left alone on purpose, because the fix is a design change rather than a
bug fix:

- The button label is unaffected and passes at 5.13:1. Nobody cannot read the
  button. The only question is whether the edge is what identifies it.
- The button is also carried by hue and by its hard offset shadow, so the border is
  not doing the work by itself.
- The obvious remedy, a white border, measures 5.24:1 and clears the criterion
  outright, but it takes the heavy ink outline off every call to action on the site.

**Question for you: white border on band buttons, or keep the ink border and accept
2.92:1?** Either is defensible. We would rather you chose than have us restyle the
primary call to action while fixing a colour bug.

The shortfall is asserted at its current size in `design-tokens.contrast.test.ts`, so
if a token moves later the suite raises it again instead of letting it drift.

### Logos

The new marks are in `public/brand/`. The horizontal lockup on the orange header is
currently a `brightness-0 invert` filter on the dark asset. It renders correctly, but
a proper reversed horizontal asset would be better than a filter, particularly for
anyone printing a page. **Can you supply one?**

---

## Round three: a full audit of the rendered site

The band work prompted a proper sweep rather than another spot check, so
`npm run audit:contrast` now renders all 34 live routes and measures every visible
text node against its real composited background.

It exists because unit tests could not have found any of this. They check the
palette's pairs are sound; they cannot check that a component reaches for the right
pair. That gap is exactly where the failures were.

Getting the measurement honest took three passes. The first run reported 157
failures. 52 were text on a gradient the script could not see, and 52 false alarms
in one page is how a check like this gets ignored, so it now reads gradient stops,
composites absolutely positioned scrims, and skips visually hidden text.

**157 real-looking findings became 44 real ones, and are now 41.**

### Fixed

**`--oj-ink-3`, the muted text colour: 34 failures on its own.** It was #757784,
which clears nothing it is used on: 4.29:1 on paper, 4.08:1 on cream, 3.66:1 on
cream-2, against the 4.5:1 body text needs. It carries field hints, breadcrumbs,
card context and captions, so it was failing on every page rather than in one place.

It was also sitting in the suite's 3:1 group, on the reasoning that muted text is
secondary. Looking at where it actually renders, at 13px and 13.5px, that reasoning
does not hold. It has been moved to the 4.5:1 group.

Now **#666873**, the same hue at 87% and the shallowest darkening that clears all
three surfaces: 5.35:1 on paper, 5.09:1 on cream, 4.57:1 on cream-2. It still reads
clearly lighter than the full ink, which is the job it exists to do.

**This is a change to your palette and we would like it confirmed.** It is recorded
as an approved divergence in the test suite so it cannot drift, and it is the third
such correction after `--oj-orange-deep` and `--cat-demand`.

**The brand orange used as text on light surfaces.** `Stat`, `PressureCard` and the
`Header` wordmark used `--oj-orange` for their accent, which on paper is 2.73:1 and
fails even the 3:1 large-text floor. They now pick the deep orange on light grounds
and keep the brand orange on ink, where it is 5.55:1 and correct.

Worth saying we got this wrong first time and the audit caught it: the same swap was
applied to four headings on `/about`, `/how-we-work`, `/fractional-cmo` and
`/sectors/professional-services`, which turned out to sit on ink bands rather than
light ones, where it made 5.55:1 into 2.90:1. Reverted, measured, and the reason is
in the code.

**The breadcrumb's current page on a band.** Ink at 2.92:1, from the band move. It is
now the band's own text colour, and the current page is still distinguished by being
the only item without an underline.

**The WhatsApp button's trust line, at 1.69:1 on three live service pages.** It was
navy at 70%, chosen because that gives 5.27:1 on white, which it does. The button is
also used inside the blue call-to-action band, where navy on blue is invisible. It
now inherits its colour instead of naming one: 4.80:1 on the blue, 7.21:1 on white.

### Left alone, on purpose

**27 failures on five pages that redirect in phase 4** (`/fix-my-pub`,
`/empty-pub-solutions`, `/compete-with-pub-chains` and the four `/ways-to-work`
pages). Legacy styling on pages that are going away. Fixing them is work thrown away
at launch.

**9 on `/dev/components`.** The internal gallery, not in the sitemap, and several are
deliberate swatch labels showing what a colour looks like.

**1 on `/sectors/professional-services`:** `--cat-ops` at 4.45:1, the tint you asked
us to freeze. Unchanged, still recorded, still latent rather than live.

### Not measurable, and worth your eye

Guide cards put white text over a photograph with a 35% navy scrim. Against the
gradient fallback that is 5.40:1 and fine. Against a bright photograph it may not be,
and no static check can tell you. If you have a view on the scrim strength, we would
take it: at 55% the same text is 6.58:1 against the gradient and has much more room
against a light image.
