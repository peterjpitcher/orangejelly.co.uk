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
