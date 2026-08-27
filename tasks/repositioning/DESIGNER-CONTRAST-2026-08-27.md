# Contrast findings in the supplied palette

**To:** the design team
**From:** Orange Jelly implementation
**Date:** 27 August 2026
**Severity:** one of these is an accessibility defect, the other two are near-misses

We mapped the palette into Tailwind and put every approved colour pair through a
contrast test. Five assertions fail. Three distinct causes, all in colour values that
are yours to change rather than ours.

Nothing is blocked. The tokens are in and the build is green. These are marked as
tracked known-failures in `src/test/design-tokens.contrast.test.ts`, which means the
test suite passes today and will start failing the moment a corrected value lands, so
the marker cannot be forgotten.

All ratios measured against `--oj-cream #F7F5F1` and `--oj-paper #FCFBF9`.

---

## 1. The focus ring, and this is the one that matters

| Pair | Measured | Needs |
|---|---|---|
| `--oj-orange #F76B0C` on cream | **2.73:1** | 3:1 |
| `--oj-orange #F76B0C` on paper | **2.87:1** | 3:1 |

WCAG 2.1 success criterion 1.4.11 requires 3:1 for non-text UI, and a focus indicator
is the example the criterion is written for. This one fails keyboard users
specifically, which is the group least able to work around it.

**Two ways out, your call:**

- Darken the ring only: **`#EA650B`** gives 3.03:1 and is visually almost identical.
- Or swap the outer ring to `--oj-ink`, which gives 14.02:1 and is unambiguous.

We would take the ink ring. The double ring already has the page colour as its inner
band, so the outer band's job is visibility rather than brand expression, and ink is
the strongest available. But orange as a focus signal is a deliberate part of the
system, so it is your decision.

## 2. The link colour falls just short

| Pair | Measured | Needs |
|---|---|---|
| `--oj-orange-deep #C05408` on cream | **4.27:1** | 4.5:1 |
| `--oj-orange-deep #C05408` on paper | **4.4995:1** | 4.5:1 |

This is the one that stings a little, because `--oj-orange-deep` exists precisely to
solve this. The README says "body-size orange text uses `--oj-orange-deep #C05408`
(contrast)", so the intent is right and the value is a fraction light.

On paper it misses by five ten-thousandths, which no eye will ever see but a compliance
audit will.

**Minimum correction: `#BA5108`.** 4.52:1 on cream and 4.76:1 on paper. Two steps
darker in the same hue.

## 3. One taxonomy hue does not clear AA

Six of the seven are comfortable. Teal is not.

| Hue | On its own tint | On cream |
|---|---|---|
| **demand** `#2E7D74` | **3.98:1** | **4.48:1** |
| convert `#3E5C8A` | 5.39:1 | 6.22:1 |
| margin `#7A4468` | 5.85:1 | 6.76:1 |
| ops `#6B6D2F` | 4.52:1 | 5.00:1 |
| experience `#6C5B9E` | 4.55:1 | 5.32:1 |
| scale `#356950` | 5.12:1 | 5.87:1 |
| hospitality `#8A5A2E` | 4.72:1 | 5.38:1 |

**Minimum correction: `#2A736B`.** 4.55:1 on tint and 5.13:1 on cream.

Worth noting `ops` at 4.52:1 and `experience` at 4.55:1 are also close to the line. If
the tints are ever lightened, those two go under with almost no warning.

---

## What we have done meanwhile

The palette is implemented as supplied. We have changed no colour value, because the
design authority order you confirmed puts those decisions with you.

The contrast matrix is now a permanent test covering every approved pair, both light
and inverse surfaces, and all seven taxonomy hues on both their tint and the page
ground. It runs in CI. When you send corrected values we drop them in and remove the
known-failure markers.

## One thing that passed and is worth knowing

`--oj-orange` on cream measures 2.73:1, which correctly **fails** the body-text
threshold. That is the system working as designed: it is why `--oj-orange-deep` exists,
and we have a test asserting orange never becomes a body-text colour. The rule is
sound. Only the deep step's value needs nudging.
