# Design system review, 2026-08-09

Every claim was reproduced in a running dev server or computed from the palette,
not read off the source. Measurements are given so each one can be re-checked.

Verification after the changes: `type-check` clean, `lint` clean (one pre-existing
`next/script` warning in GoogleTagManager), 888 tests pass across 39 files,
production build succeeds, CSS 18KB gzipped against a 50KB budget.

## Fixed

- [x] D1 `tailwindcss-animate` was neither installed nor registered as a Tailwind
      plugin, yet 7 components shipped its classes, so `animate-in fade-in-0
      zoom-in-95` resolved to `animation-name: none` and every Radix enter/exit
      transition snapped. Installed and registered. Now resolves to
      `animation-name: enter`. Affected `ui/sheet`, `ui/navigation-menu`,
      `ui/tooltip`, `ui/dialog`, `ui/select`, `engagement/MobileScrollPrompt`,
      `adapters/AlertAdapter`.
- [x] D2 Desktop nav dropdown opened under the wrong item. The Guides trigger sat
      at `left=688.5`, the panel rendered at `left=208` (i.e. under "Home"), because
      the shared Radix viewport wrapper is `absolute left-0 top-full` and so anchors
      to the left edge of the menu root, not the open trigger. Each panel now
      anchors inside its own Item. Measured offset from trigger: 0px.
- [x] D3 Header "Chat on WhatsApp" label sat 2px high: 10px above, 14px below.
      `WhatsAppButton` was `inline-block`, so the global 44px min-height could not
      redistribute its slack. Now `inline-flex items-center`: 12px and 12px.
      `ButtonAdapter.tsx:92-101` documents the identical bug and fix; this
      component had never received it.
- [x] D4 Global tap-target sledgehammer replaced. Was `min-height: 44px;
      min-width: 44px; position: relative` on every `a, button, input, select,
      textarea, [role=button], [tabindex]`. The `min-width` half inflated Radix's
      visually-hidden 1x1 spans into real 44x44 boxes in the layout; the
      `min-height` half mis-centred every non-flex control. Now height only, on
      real controls, with `align-content: center` so the extra space is shared
      rather than dumped underneath, wrapped in `:where()` for zero specificity.
      Re-measured afterwards: 0 controls under 44px on the homepage at 375px and on
      the guide hub at 1440px (146 controls checked).
- [x] D5 `--radius` was declared but never mapped in `tailwind.config.js`, so it
      was a dead token and 157 `rounded-lg`/`rounded-md` usages silently took
      Tailwind defaults. Now mapped. Deliberately a visual no-op: `lg` 8px, `md`
      6px, `xl` 12px and `2xl` 16px all land on their previous values. Only
      `rounded-sm` moves, 2px to 4px, across 6 usages.
- [x] D6 Hover states lightened instead of darkening. `orange.dark` was `#FF8901`,
      lighter than `orange.DEFAULT` `#F65403` (luminance 0.259 to 0.392), and was
      the hover state in ~25 places. Now `#C2410C`, which darkens correctly and
      clears AA: 5.18:1 with white, 4.84:1 as text on cream. Confirmed generated:
      `.hover\:bg-orange-dark:hover { background-color: rgb(194 65 12) }`.
- [x] D7 Accordion keyframes were defined twice, in `globals.css` and in
      `tailwind.config.js`, free to drift. Removed the hand-written copy.
- [x] D8 `html` was painted navy while `body` was cream, so overscroll flashed a
      dark band. Both now cream.
- [x] D9 Focus ring failed WCAG 1.4.11. `#FF8901` scored 2.22:1 against cream,
      under the 3:1 minimum, so keyboard focus was near-invisible sitewide. Now the
      brand orange, which clears 3:1 on both surfaces the ring appears on: 3.17:1
      on cream, 4.00:1 on the navy header. Width raised 2px to 3px for margin.
      Applied to both `--color-focus-ring` and the shadcn `--ring`.
- [x] D10 `ui/button` focus ring was a 1px hairline, and the variant sets
      `focus-visible:outline-none`, opting out of the global 3px outline. Now
      `ring-2` with an offset.
- [x] D11 `ui/button` sizes were `h-9`/`h-8`/`h-10`, i.e. 36/32/40px: all under the
      44px target and all dead, since the global rule raised them anyway. Now state
      `min-h-tap` honestly and hold without the global rule.
- [x] D12 Header WhatsApp link announced as "Chat on WhatsApp on WhatsApp", because
      `aria-label` appended the channel to a label that already named it.
- [x] D13 Trust microcopy was `charcoal/60`, 3.90:1 on white, under AA. Now
      `charcoal/70`, 5.27:1.
- [x] D14 WhatsApp green existed only as a CSS variable with no Tailwind mapping, so
      callers either wrote `bg-[var(--color-whatsapp)]` or pasted a hex, and the two
      hover values had drifted: `Navigation` hardcoded `#20bd5a` while the token said
      `#128C7E`. Mapped as `bg-whatsapp`/`bg-whatsapp-dark` and both callers moved onto it.
- [x] D15 Added a `tap` spacing token so components stop hardcoding `min-h-[44px]`,
      which appeared 30 times.
- [x] Regression cover: extended `ButtonAdapter.centring.test.tsx` with four tests
      pinning the WhatsAppButton flex contract and both accessible-name branches.

## Not a defect, checked and dismissed

- Vercel analytics CSP errors in the dev console are dev-only. Both packages fall
  back to same-origin paths in production (`/_vercel/insights/script.js`,
  `/_vercel/speed-insights/script.js`), which pass `'self'`.
- The mobile sheet appearing stuck off-screen at `translateX(-281px)` was the
  browser pane being hidden, freezing `document.timeline` at 0 so the enter
  animation never advanced. Driven to its end it lands at `left: 0` with all 13
  links on screen.

---

# Phase 2, approved 2026-08-09

Peter approved the CTA fill change and asked for the deferred sweeps.

## Accessible CTA fill (approved)

The brand orange cannot carry white body text: 3.39:1 against a 4.5:1
requirement. The brand hex is untouched. Instead the orange ramp now splits by job:

| Token | Hex | Used for |
|---|---|---|
| `orange` | `#F65403` | large display text, borders, decorative fills, text on navy (4.00:1) |
| `orange-dark` | `#C2410C` | solid CTA fills with white text (5.18:1), links on light surfaces (4.84:1) |
| `orange-darker` | `#9A3412` | hover partner for `orange-dark` (7.31:1 / 6.82:1) |

A resting state sitting at the AA floor needs a hover that moves further into
contrast, which is why the third step exists.

## Token scales added

- **Elevation**: `boxShadow` now tints with the brand navy `rgb(26 47 73)` instead
  of pure black, which greyed out against the blue-tinted surfaces. Geometry is
  unchanged from Tailwind's ramp, so all 69 existing `shadow-*` usages keep the
  elevation they were designed with and only the hue moves.
- **Control sizes**: `tap` 44px, `control` 48px, `control-lg` 56px, on `spacing`,
  `minHeight` and `minWidth`. 25 hardcoded `[44px]`/`[48px]`/`[56px]` values moved
  onto them. Values identical, so no visual change.
- z-index was left alone deliberately. Half-adopting a named layer scale across 51
  call sites would leave two competing systems, which is worse than one ad-hoc one.

## Alias rename

`charcoal`, `cream` and `teal` are gone. 709 mechanical replacements across 125
files, plus hand fixes where the codemod could not see the semantics:

    charcoal[-light|-dark] -> brand-base[-light|-dark]
    cream / -light / -dark -> surface / surface-bright / surface-alt
    teal[-light]           -> blue-support[-light]
    teal-dark              -> brand-base            <- not blue-support-dark

That last mapping is why removing them beat renaming them: `teal-dark` never
resolved to a dark teal, it resolved to the navy base, so `bg-teal hover:bg-teal-dark`
was a blue button hovering to navy. They are not kept as deprecated aliases,
because Tailwind silently drops an unknown colour rather than failing, and leaving
both spellings live is how a codebase ends up half-migrated.

Things the codemod got wrong and that were caught and fixed:

- Self-referencing CSS variables (`--color-surface: var(--color-surface)`) that
  overrode the real definitions above them and would have invalidated the page
  background entirely.
- Unquoted object keys in 12 lookup maps, which TypeScript caught: the unions had
  been renamed but the keys had not, so `bgClasses[background]` would have returned
  undefined and interpolated the string "undefined" into className.
- Several components already carried both vocabularies, so the rename produced
  duplicate union members and orphaned map entries.
- `teal-600` and `orange-50/100/200/500/600/800` were in use but had never
  rendered: the custom `orange`/`teal` objects replaced Tailwind's numeric scales,
  so those classes generated no CSS. The AlertAdapter warning variant and the
  search-result category chip had been styleless the whole time.

## Contrast remediation

Audited with a checker that resolves each element's effective background by
compositing up the tree, then applies the 4.5:1 / 3:1 threshold by measured font
size and weight. Text over photographs and gradients is excluded and counted
separately, since a solid-colour check cannot judge it.

Across 10 pages: **2367 text elements checked, failures down from several hundred
to the decorative markers noted below.** Fixed along the way:

- Every solid orange fill behind white text, 44 sites.
- Link colour on light surfaces, and a separate `orange-on-dark` for the navy
  footer, where going darker made things worse (2.62:1). The footer's own
  `hover:text-blue-support-light` was 2.07:1 on navy and is gone.
- Nav active state, WhatsApp chips (`green-600` 3.30:1 to `green-700` 5.02:1),
  `green-600` body text in 15 places, comparison-table markers (the faintest was
  1.38:1), breadcrumb separators, and 60 `text-brand-base/40-60` values (3.90:1) to `/75`.
- `Heading` and `Text` defaulted to an explicit navy that overrode any container
  which had set a light colour, producing navy-on-blue at 1.65:1. They now default
  to `inherit`. On the page background that resolves to the same navy as before,
  because body carries `text-foreground`.
- `CardAdapter` applied `background` only when `variant === 'colored'` while
  applying `text-white` on `background` alone, so a dark-background card with the
  default variant rendered white text on white: 1:1, completely invisible. One live
  call site was doing exactly that.

---

# Phase 3, 2026-08-10

## Brand orange corrected to #F16F23

The ramp was rebuilt around the real Orange Jelly orange, same hue and saturation
throughout, hsl(22 88% ...):

| Token | Hex | Job |
|---|---|---|
| `orange` | `#F16F23` | brand. 4.55:1 on navy, so it is the accent on dark surfaces |
| `orange-dark` | `#AD460B` | CTA fills with white text (5.74:1), links on light (5.36:1) |
| `orange-darker` | `#903B09` | hover for the above (7.46:1 / 6.96:1) |
| focus ring | `#D3560D` | the only lightness clearing 3:1 on both cream and navy |

`#F16F23` is lighter than the colour it replaced, which reversed one thing: it is
now 2.79:1 on cream, failing even the 3:1 large-text bar, so it can no longer be
text of any size on a light surface. It gained on navy though (4.55:1 against
4.00:1), so dark surfaces now use the true brand colour rather than a substitute.

That split is why `orange-on-dark` exists on `Link`, `Heading`, `Text` and
`FeatureList`: contrast runs in opposite directions on the two surfaces and one
value cannot serve both. 91 `text-orange` usages moved to the light-surface value,
and the handful on navy (`ProofStrip`, the footer heading, one `FeatureList`) were
put back by measuring, not by guessing.

## Content width standardised

Measured at 1440px, the homepage had nine distinct content left edges. The header
ran `max-w-7xl` with a 32px gutter and started at 112px; sections ran `max-w-6xl`
with 24px and started at 168px, so the logo sat 56px left of the copy beneath it.
`max-w-6xl` itself appeared at both 160px and 168px depending on whether the author
remembered the `sm:` step.

A shell is a width AND a gutter, so they are now one thing: `.page-shell`. Applied
to the header, footer, `Section`, and the nine hand-rolled bands. Verified: one
content edge, 176px, across all nine audited pages.

Inner reading measures (`max-w-2xl`/`3xl`/`4xl`, ~180 usages) are deliberately left
alone. A narrow measure for a paragraph inside a wide section is good typography,
not drift. What was drift, the same measure landing at different edges because a
block added its own `px-4` on top of the shell, is gone with the shells.

## Protection added

Two layers, because the failures here are silent by nature: Tailwind emits nothing
for an unknown colour, so the class stays in the HTML and the style never arrives.

`scripts/check-design-tokens.mjs`, wired into `lint`, `build`, and lint-staged:

1. Retired colour names (`charcoal`, `cream`, `teal`) cannot come back.
2. Numeric scales for overridden families (`orange-500`) are rejected, since they
   generate no CSS.
3. Hardcoded control sizes must use the `tap`/`control`/`control-lg` tokens.
4. Hand-rolled page shells must use `.page-shell`.
5. Hardcoded hex outside a documented allowlist.
6. Self-referencing or duplicated CSS custom properties.
7. `var()` references that resolve to nothing.

`src/test/design-tokens.contrast.test.ts` reads the real token values rather than
restating them, and asserts: the brand hex is unchanged; the ramp darkens
monotonically; each step clears AA for its stated job; the focus ring clears 3:1 on
both surfaces; `--ring` matches `--color-focus-ring`; and the email hexes,
`THEME_COLORS` and `globals.css` all still agree with `tailwind.config.js`.

`CardAdapter.invisible-text.test.tsx` pins the two invisible-text fixes: a card can
never apply `text-white` without also applying a dark background, and `Heading`
and `Text` inherit rather than forcing a colour.

The contrast test immediately earned its place: it found that
`category-colours.ts` opens by claiming "All primary colours pass WCAG AA contrast
for white text" while Marketing was 3.56:1 and Events 2.29:1, with the Events
gradient ending on a stop worse than either. All three fixed.

## Correction: filled controls carry the brand orange, not a darker substitute

The first pass at the brand orange treated the white button label as fixed and
darkened the *fill* until white cleared AA. That worked on paper and was wrong in
practice: every button drifted away from the logo colour, which is what Peter
noticed. Sampling the logo confirmed the token was right all along (its dominant
orange is `#F37123` against the token's `#F16F23`, one unit per channel), so the
fills were the only thing off.

The label was the thing to change:

| Pairing | Ratio |
|---|---|
| white on `#F16F23` | 2.98:1, fails |
| **navy `#1A2F49` on `#F16F23`** | **4.55:1, passes** |
| `brand-base-dark` on `#F16F23` (hover) | 5.45:1 |

So every solid orange fill (44 sites: CTAs, badges, number circles, the nav active
pill, the sticky bar, CTA bands) is now `bg-orange` with a navy label, and hover
darkens the *label* rather than the fill. It has to work that way round: deepening
the fill drops the navy label to 4.05:1.

`orange-dark` did not become redundant. It is still the colour for orange *text* on
light surfaces, where the brand orange is 2.79:1, and for outline buttons that fill
on hover.

Two components now carry fill and label as one value rather than letting a caller
set them separately, since that pairing is exactly what drifts: `CTASection`'s
variant map and `MetricsBar`'s bar map. `MetricsBar` also lost a hardcoded
`text-yellow-300` highlight that was unreadable on the light fills.

The contrast test asserts both halves of this, including the deliberately negative
`expect(contrast(WHITE, ORANGE.DEFAULT)).toBeLessThan(4.5)`, so nobody can "fix"
the contrast by darkening the fill again.

## Correction: the tap-target rule was outranking Tailwind's utilities

Reported as "the x on the sticky bar isn't lined up". It was 22px above centre,
and the cause was mine and much wider than that one button.

The replacement tap-target rule was written as:

    :where(a, button, ...):not(.sr-only, [aria-hidden='true'])

with a comment claiming zero specificity. Half true. `:where()` contributes
nothing, but **`:not()` takes the specificity of its most specific argument**, so
`:not(.sr-only, ...)` scored (0,1,0), tying with `.absolute` and `.min-h-0`. On a
tie the later rule wins, and this file is emitted after Tailwind's utilities, so
the global rule beat them. The dismiss button carried `absolute min-h-0` and
rendered as a 44px-tall relatively-positioned box.

That was overriding `position` and `min-height` utilities on every anchor, button,
input, select and textarea on the site. The sticky bar just happened to be where it
showed.

Fix: wrap the exclusion in `:where()` too, `:where(...):where(:not(...))`, which
returns the whole selector to (0,0,0). Verified afterwards: the dismiss button is
`position: absolute`, `min-height: 0px`, 0px off centre, 12px from the edge as
`right-3` intends, and a sweep of five pages found 0 remaining cases where a
control's computed position or min-height disagreed with its classes.

Worth remembering when reading the rest of this file: `:where()` around the
positive half of a selector does not make the selector zero-specificity if a
`:not()` elsewhere in it carries a class or attribute.

## Correction: double shells and forced alignment

Reported as "/ways-to-work doesn't look right". Two separate causes, both the same
shape as bugs already fixed here: a component forcing a value its container had
already set.

**Double shells.** `<Section>` applies `.page-shell`, and 57 of the 59 `<Container>`
uses in the codebase sit inside a `<Section>`. `Container` defaulted to
`padding: true`, so each added a second gutter on top of the first. Measured on
/ways-to-work at 1920px: the section band started at 416 and everything inside the
Container started at 448. Its default `maxWidth` of 7xl (1280px) hid the cause,
because it is wider than the 1088px a shell actually offers, so the Container
constrained nothing and its only effect was that stray 32px.

`Container` now defaults to `padding: false`. It constrains a reading measure; the
shell owns the gutter. The two standalone uses in `Loading.tsx` pass `padding`
explicitly.

**Forced alignment.** `Heading` and `Text` defaulted `align` to `'left'`, which
emits an explicit `text-left` that overrides a parent's `text-center`. On
/ways-to-work that produced a centred narrow column of left-aligned copy sitting
under a centred heading, its left edge unrelated to anything else on the page.
Both now default to an `inherit` alignment that emits nothing, exactly as their
colour default already does.

After: the header logo, the section shell and the package card grid all sit on
416px, and the intro copy is centred under its heading.

## Correction: the sticky bar dismiss button

Two rounds, two different causes.

**Vertically off by 22px.** The global tap-target rule read
`:where(...):not(.sr-only, [aria-hidden='true'])`. The comment claimed zero
specificity, but `:not()` contributes the specificity of its most specific
argument, so `.sr-only` put the whole selector at (0,1,0), tying with `.absolute`
and `.min-h-0`. On a tie the later rule wins, and this file is emitted after
Tailwind's utilities, so the global rule beat them: the dismiss button rendered
`position: relative` at 44px tall instead of `absolute` at 16px. That was not a
one-button bug, it was overriding every positioned or short control on the site.
Wrapping the `:not()` inside `:where()` puts it back to (0,0,0).

**Horizontally stranded.** With positioning restored, the button sat at
`absolute right-3` against a `max-w-5xl` container inside a full-width bar. That
container edge is invisible once the viewport is wider than 1024px, so at 1920px
the button sat 237px right of the CTAs and still 460px short of the bar's own
edge, attached to neither. It is now a flex child in the same centred cluster,
16px after the buttons, at every width.

**A third problem found while measuring.** The rotating statement had no minimum
width and the CTAs are a fixed 241px, so at 375px it was squeezed into 75px,
wrapped to six lines and made the bar 136px tall, roughly a sixth of the screen.
It is now hidden below `md` and truncates rather than wraps above it. The bar is
44px tall at both 375px and 1920px.

## Width standardisation

Reported as "widths standardised throughout, it looks terrible". The outer shell
had already been unified; the inside of each band had not.

There were 18 different `max-w` values in play, and three of them did the same
job: centred body copy appeared at 672px, 768px and 896px more or less
interchangeably across 136 blocks. That is what made pages look unrelated to each
other. The width of a paragraph is not a per-page decision.

Now there are two inner widths, defined in `globals.css` beside `.page-shell`:

| Class | Width | For |
|---|---|---|
| `.page-shell` | 1152px + gutter | anything spanning the page |
| `.measure-wide` | 896px | centred grids, media, comparison tables |
| `.measure` | 768px | all prose. The default |

Applied: 138 blocks to `.measure`, 4 to `.measure-wide`, 141 redundant `mx-auto`
removed, 8 nested constraints dropped so they fill the shell, 3 hand-rolled shells
swapped for the class.

Three things the class sweep could not see, found by measuring the rendered pages:

- **`Container` built its width from a prop at runtime.** `maxWidth="4xl"` never
  appears as a class in the source, so 41 call sites kept setting page widths by
  hand after the raw utilities were cleaned out. The prop is now `width`, taking
  `measure` / `measure-wide` / `full`: naming the job rather than the size is what
  stops it drifting again.
- **Full-bleed bands put the gutter inside the measure.** `CTASection` and four
  others used `measure px-4 sm:px-6`, which insets within the 768px, so their copy
  landed 24px right of every other measure. Shell for the gutter, measure for the
  width, in that order.
- **The image hero disagreed with itself.** Its breadcrumb used `page-shell` while
  its title used `max-w-5xl` plus its own padding, so the title started 72px right
  of the breadcrumb directly above it.

Measured at 1920px, distinct content left edges per page:

| Page | Before | After |
|---|---|---|
| /ways-to-work | 9 | 2 (416 shell, 576 measure) |
| /about | 11 | 3 (416, 512 measure-wide, 576) |

Check 5 in `scripts/check-design-tokens.mjs` now fails the build on any centred
`max-w-*`, with `StickyEngagementBar` and `AdminDashboard` allowlisted and the
reason recorded. Fixing that check also exposed that its `isComment` test only
looked at one line at a time, so the second line of a block comment, and every JSX
comment, was being scanned as code.

## Content width matches the header, and a runtime audit to keep it that way

Two questions: why did a width constraint survive on the guide pages, and how do we
sweep properly.

**Why it survived.** The static check catches ad-hoc width CLASSES. It cannot see
what lands on screen, because that depends on how components compose. On
/licensees-guide/[slug] the hero put its breadcrumb, H1 and standfirst flush to the
shell at 416 while the article sat in a centred measure at 576: a 160px step, on
104 pages, with every static rule satisfied.

**The sweep.** `scripts/audit-widths.mjs` (`npm run audit:widths`) loads every route
from sitemap.xml in Playwright, which was already a devDependency, and measures
where content actually starts. Reference edges are derived from each page's own
`.page-shell` and the measure widths are read from the stylesheet, so the audit
keeps working when the tokens change rather than asserting numbers it has memorised.

Six rules: shell edges agree, no nested shells, no gutter on a measure, measures on
their edge, no ad-hoc centred widths, and title and body on one spine. The last one
is the one that would have caught this page; the first five all passed on it.

The audit was itself wrong three times before it was right, each caught by checking
its own output rather than trusting a green result:
 - it reported "passed" while three routes returned HTTP 500
 - below 816px it wanted an edge left of the shell, 29 phantom violations at 768px
 - it read content boxes, so a card with p-8 looked 32px misaligned
It was then proved by planting a violation, confirming it failed, and reverting.

**The decision.** A three-lens panel said centre-both unanimously: put the hero copy
in the same measure as the article. That removed the step but made the pages look
thinner, and Peter's call was that content should match the header instead.

So the column width is now one token:

```
--measure-max: 72rem;       /* globals.css, the single lever */
--measure-wide-max: 72rem;
```

Both equal the shell, so every block lines up with the header and footer. Changing
prose back to a narrower column is one line, because all 141 measures read from it.

The trade-off, recorded because it is a real one: at 1920px the shell gives 1088px
of content, roughly 150 characters per line. Typographic guidance is 45 to 75. Fine
for marketing sections, grids and cards; long for the guide articles. `48rem` was
the previous value if the guides should read narrower.

**Verified:** 134 routes at 1920, 1280, 768 and 375px, every block on a scale edge.

## Final state

2367 text elements audited across 9 pages: **0 contrast failures**. One content
edge sitewide. 922 tests, lint, type-check and production build all pass.

## Known remaining, deliberate

- Resolved in phase 3: `FeatureList` now takes `iconColor="orange-on-dark"`, so its
  glyphs are correct on both surfaces.
- `/services` is a redirect to `/ways-to-work` in `next.config.js`, which is why it
  would not load in an audit frame. Not a defect.
- Text over photography is excluded from the audit by construction: a solid-colour
  check cannot judge a gradient scrim over an image. Two apparent white-on-white
  failures turned out to be exactly this and were correctly left alone. Those need
  checking by eye.
- Inner reading measures (`max-w-2xl`/`3xl`/`4xl`) are not standardised, on purpose.
  A narrow measure inside a wide section is good typography; only the shells needed
  to agree.
- Still open from phase 1: no font-size or z-index scales; the shadcn `--background`
  (`#F3F8FC`) and `--color-surface` (`#F2F8FC`) remain one unit apart; dark-mode
  variables are defined but nothing toggles `.dark`; `src/components/demo/ui/`
  duplicates `button` and `badge`.
