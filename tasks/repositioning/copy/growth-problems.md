# `/growth-problems` copy and the audit behind it

**Tasks:** T066, T067. Built as `src/app/growth-problems/page.tsx`,
`src/app/growth-problems/[slug]/page.tsx`, content in `src/app/growth-problems/content.ts`.

## Where the words came from

The design team's template carried all eight problems written out, in
`docs/brand/design-system/templates/growth-problem/GrowthProblem.dc.html`. The port is a
**transform** of that source, not a retype: the extracted source sits in
`tasks/repositioning/data/designer-growth-problem-variants.json` and the corrections were applied to
it programmatically. Retyping a supplied asset is exactly how all seven taxonomy tints silently
drifted from the pack.

## Eight problems, six areas

The homepage names six **areas**, which is where growth gets stuck. These are eight **symptoms**,
which is how it presents. Six map one to one. The other two are "growth has stalled", the umbrella
most people arrive with, and "using AI intelligently", which the keyword research found is the
strongest entry cluster the company has. Each problem tags itself with the areas it touches.

## What changed from the supplied copy, and why

**Shared across all eight**, so one fix rather than eight:

| Supplied | Changed to | Why |
|---|---|---|
| "the HEAR and EXPOSE half of the method" | "the HEAR and CHALLENGE half" | EXPOSE was replaced by CHALLENGE |
| "Book a growth diagnostic" | "Start the conversation" | D11 |
| "A Growth Diagnostic tests what is actually causing it…" | "It starts as a conversation, and the first one is free…" | D8 and D12: nobody buys a product as step one |

**Per page.** Every one of these was an unsupported number that would have shipped as fact:

| Page | Supplied | Why it went |
|---|---|---|
| stalled | "Half of stall diagnoses collapse when tested against the numbers." | Invented statistic |
| stalled | "Revenue has been flat for three quarters or more." | Arbitrary threshold; also excludes a reader at two quarters |
| ai | "Half of AI ideas die on data quality." | Invented statistic |
| conversion | "Response time is the strongest single conversion lever most businesses own." | Unsupported superlative |
| margin | "once the uplift is halved" | Quantification with nothing behind it |
| scale | "The workflows that fail at 2x" | CLAIMS.md bans multiples outright |
| scale | "so everything after gets cheaper" | Cost-reduction framing the repo hook rejects |
| experience | "replacing lost customers costs more than keeping them ever would" | Unsupported claim, and cost framing |
| stalled | "The cheapest unlock" | A price signal, on a site that publishes no prices, framing the answer as the cheap one rather than the right one |
| stalled, conversion | "It is almost never the answer", "The problem is almost never the leads" | Unsupported absolutes, and the same one twice |
| stalled | "the flat line always starts in one of them" | Absolute |
| ai | "vendor" | American register |

Thirteen changes across the eight pages. Every one is listed in
`src/test/growth-problems.test.tsx`, which asserts that everything NOT on that list still matches the
supplied source byte for byte. A stray edit fails the build rather than quietly becoming the new
original.

**Still to sweep when their templates are ported:** the retired method word EXPOSE is hardcoded in
four more supplied templates (`solutions`, `how-we-work`, `case-study`, `landing-page`). Our built
versions of those pages already say CHALLENGE; the note is for whoever ports the remaining ones.

## The proof sections, including the three that have none

Only the five claims in `CLAIMS.md` may be quantified, all from The Anchor, our own venue.

| Page | Proof |
|---|---|
| Growth has stalled | All five. The composite whole-business case, and it says so. |
| Weak demand | +828% visibility, +567% private hire |
| Leads not converting | +403% bookings, 89% fewer no-shows |
| Margin under pressure | +98% food revenue, **stated as revenue and not as a margin percentage** |
| Experience leaking value | 89% fewer no-shows only, on the narrow basis that it evidences the journey up to arrival and **not** repeat purchase |
| Operations slowing us down | **None.** Says so. |
| Using AI intelligently | **None.** Says so, and names two approved figures precisely to disclaim them. |
| Systems cannot keep up | **None.** Says so. |

Three of the eight have no measured result, because none of the five claims measures hours,
capacity, or anything attributable to AI, and the metrics that would have covered them were retired
for being unverifiable. Those pages say that plainly and offer the method and a baseline instead of a
number. A site that argues everything should be measured against a baseline cannot quietly invent
three results for itself.

Two partial gaps are named rather than papered over. Margin's claim measures revenue, not margin
percentage, and the page says so. Experience has no retention claim anywhere, and the page says that
before it offers the one adjacent number it does have.
