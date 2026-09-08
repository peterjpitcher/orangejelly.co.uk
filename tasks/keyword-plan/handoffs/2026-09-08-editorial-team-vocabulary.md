# Editorial brief: the vocabulary pass on three service pages

Raised by the seo-powerhouse investigation of 8 September 2026
(`tasks/seo-powerhouse/2026-09-08-keyword-plan-investigations/findings.md`). **This is new work,
not part of the eleven tickets Peter approved.** It needs his explicit yes before anything is
edited, because these are the company's main service pages and they carry the repositioning.

## The problem in one line

Three service pages are well built, well written and invisible for the words their own customers
type, because those words are not on the page.

Counts are occurrences in the live rendered copy, 8 September 2026:

| Term | Demand band a month | Competition | /solutions | /solutions/booking-systems | /fractional-cmo |
|---|---|---|---|---|---|
| websites development | 1,000 to 10,000 | Low | 0 | 0 | 0 |
| website development in uk | 1,000 to 10,000 | Medium | 0 | 0 | 0 |
| website development agency uk | 100 to 1,000 | Low | 0 | 0 | 0 |
| table booking system | 100 to 1,000 | Medium | 0 | 0 | 0 |
| web booking system | 100 to 1,000 | Medium | 0 | 0 | 0 |
| restaurant booking system | 100 to 1,000 | High | 0 | 0 | 0 |
| online booking | 1,000 to 10,000 | High | 0 | 0 | 0 |
| reservation (any form) | see above | | 0 | 0 | 0 |
| fractional marketing director | 100 to 1,000 | Medium | 0 | 0 | 0 |
| part time marketing director | 10 to 100 | Low | 0 | 0 | 0 |

Bands are Keyword Planner, United Kingdom, English, Google Search, measured 8 September 2026. The
account is banded, so these are ranges, never counts. Do not print a single number and never add
bands together.

## What this job is, and is not

**It is:** adding the words customers actually use, in places where they are honest, to pages that
already do the job. A light pass on each. Probably a headline, a subheading, a sentence in the
opening, and one section heading per page.

**It is not:** a rewrite. The 2 September plain-English rewrite was deliberate and Peter approved
it. Do not undo it. If a keyword can only be inserted by making a sentence read like a brochure,
leave it out and say so.

**Hard constraint.** `scripts/check-positioning.mjs` governs these exact pages. Read it before you
start. It forbids anything describing the company as a hospitality marketing business, and it runs
in CI. `/solutions` and `/fractional-cmo` are both on its watched surface.

## Page by page

### /solutions

Currently headed "what we build" and opens "websites, applications and the systems behind them".
Nothing wrong with it, and nobody searches for "what we build".

**Primary:** website development
**Secondary:** website development agency uk, bespoke application, custom application
**Intent:** commercial

Work "website development" into the H1 or the opening sentence. The page already says "bespoke
application" twice, which is good; "custom application" is the more searched sibling and is worth
one honest use. The phrase to reach for is something like "we build websites and bespoke
applications", which is both true and searchable.

### /solutions/booking-systems

The clearest gap of the three. The page sells booking systems and never once says **online
booking**, **table booking** or **reservation**. It says "booking workflows" and "the guest and the
team".

**Primary:** table booking system, online booking system
**Secondary:** web booking system, restaurant booking system, restaurant reservation system
**Intent:** commercial

Two judgement calls for the writer, not for me:

1. **Do not chase the "free" terms.** `free online booking system` and `free booking system` sit in
   the 1,000 to 10,000 band, higher than anything else here, and they are the wrong visitor for a
   bespoke build. Leaving that traffic alone is the right trade. Say so in the draft notes so
   nobody "fixes" it later.
2. **Sector words carry the demand.** The measured terms are shaped as `restaurant booking system`,
   `salon booking system`, `table reservation system for restaurants`. If the page names the kinds
   of business it serves, it earns those words honestly. If Orange Jelly does not want to be read
   as a restaurant-only supplier, that is a positioning decision and it belongs to Peter.

### /fractional-cmo

Uses "fractional CMO" five times, which is right. Never says "marketing director", and
`fractional marketing director` is the larger term of the pair.

**Primary:** fractional cmo uk, fractional marketing director
**Secondary:** part time marketing director
**Intent:** commercial

One sentence naming the alternative phrasing would cover it, for example "a fractional CMO, or
fractional marketing director, is...". That is a small change.

**Flag for Peter before writing.** The page currently argues a fractional CMO is "often the wrong
kind of answer". That may be the right sales position and better for conversion. It also means the
page is not competing for the term it is named after. Decide which job the page is doing before
optimising it for a term it is arguing against. Do not resolve this in the copy.

## Rules that bind this brief

- The keyword lists above are the source of truth. Do not substitute your own.
- **No scenario is estimable.** No cluster in this programme reached evidence Tier A. Nobody may
  promise a click, a ranking or a traffic figure from this work.
- Every quantified proof point comes from `/CLAIMS.md`, as a percentage, attributed to The Anchor.
- British English. No em dashes. The repo's language gates now scope themselves to the published
  surface, so they will check these pages properly: run them before proposing the change.
- No question or FAQ blocks. There is still no SERP observation for these clusters.

## Before and after

Record the current rendered copy of all three pages before editing, so the October review can tell
a copy change from a Google change. Log each shipped edit as a `shipped` event in
`tasks/keyword-plan/changes.jsonl` with the ticket, date, page and deployment reference, then run
it through `deploy-verify`.

## What to expect

Two of these pages are three days old and one is eleven. They have almost no footprint yet, and the
vocabulary pass is a head start rather than a rescue. The honest expectation is that nothing
measurable happens before the review of late October 2026, and possibly not until the one after.
Anyone reading a flat October result as failure will be reading it wrong.
