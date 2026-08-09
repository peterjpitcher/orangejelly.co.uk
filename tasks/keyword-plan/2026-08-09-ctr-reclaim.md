# CTR Reclaim and Metadata Rewrite (2026-08-09)

**What this is:** the evidence behind the metadata changes made to `src/lib/seo-overrides.ts` on
2026-08-09, plus the GKP demand data that reprioritised the content plan.

**Sources**
- Google Search Console, property orangejelly.co.uk, Web search, last 12 months and last 28 days,
  exported 2026-08-09. Archived at `evidence/gsc-2026-08-09/`.
- Google Keyword Planner, United Kingdom, English, July 2025 to June 2026, exported 2026-08-09.
  Archived at `evidence/gkp-2026-08-09/`. Nine cluster exports.

---

## Correction to the earlier baseline

An earlier reading of this site used the June 2026 export, which was a partial extract and reported
13,381 impressions and 39 clicks. The full 12-month export corrects that:

| Measure | Value |
|---|---|
| Impressions (12mo) | 64,546 |
| Clicks (12mo) | 850 |
| Site CTR | 1.32% |
| Ranked queries | 1,004 |
| Ranked pages | 148 |

The conclusion still holds but is less severe than first stated: CTR is below what the site's
positions should earn, and position is the bigger constraint on the commercial pages.

---

## GKP demand: what people actually search for

This reorders the content plan significantly. Volumes are GKP bucketed averages for the UK. Blank
means GKP reported no data, which means demand too low to report, not necessarily zero.

| Cluster | UK monthly total | Verdict |
|---|---|---|
| **Quiz mechanics** | **1,750** | Clear winner. Build here first. |
| **Pub bingo** | **500** | Single strong head term. |
| Staffing | 200 | Real demand, and only 3 of 105 guides cover it. |
| Marketing services | 150 | Commercial intent, low volume. |
| Events and entertainment | 150 | Mostly already covered. |
| Loyalty and branding | 100 | Thin. |
| Refurbishment | 50 | Thin. |
| Turnaround | 50 | Thin, but "fix my pub" is on-brand. |
| **Family and kids** | **0 (no data)** | **All ten seeds returned no data.** |

Highest-volume individual terms:

| Term | UK monthly | Paid competition |
|---|---|---|
| picture round ideas | 500 | Low (8) |
| pub quiz answer sheet | 500 | Low (19) |
| pub quiz round ideas | 500 | Low (0) |
| pub bingo | 500 | Medium (38) |

### The family and kids pillar should be dropped

The July 2026 audit parked a family/kids pillar as the priority net-new pillar, blocked on keyword
data (SEO-135). That data now exists and it is empty: all ten seeds ("family friendly pub ideas",
"kids activities in pubs", "attract families to pub", "school holiday pub events" and six others)
returned no GKP data at all.

GSC does show family-shaped impressions ("how to organise events to attract families to pubs", 450
impressions at position 18.5; "kids craft pop up events for pubs", 485 at 24.8), but those queries
have earned zero clicks in 12 months and GKP cannot measure them. Recommendation: close SEO-135 as
"not supported by demand data" rather than building the pillar. Revisit only if GSC impressions
convert to clicks on the existing `how-to-attract-families-to-your-pub` guide.

---

## What was changed and why

Expected CTR is modelled from a standard UK organic curve (position 1 = 26.7%, 5 = 5.5%, 10 = 2.3%,
banded beyond that). "Clicks missed" is (expected minus actual) times impressions over 12 months.

### Pages rewritten because they underperform their position

| Page | Impr | Clicks | CTR | Pos | Missed |
|---|---|---|---|---|---|
| `/licensees-guide/profitable-pub-food-menu-ideas` | 5,189 | 98 | 1.89% | 7.7 | 58 |
| `/licensees-guide/quiz-night-101` | 2,937 | 40 | 1.36% | 7.9 | 48 |
| `/licensees-guide/national-drinks-days-pub-guide` | 1,689 | 3 | 0.18% | 8.9 | 41 |
| `/licensees-guide/cellar-management-beer-quality-guide` | 1,211 | 9 | 0.74% | 8.5 | 27 |
| `/licensees-guide/social-media-strategy-for-pubs` | 4,352 | 42 | 0.97% | 12.7 | 23 |
| `/licensees-guide/pub-health-check-...-success` | 727 | 3 | 0.41% | 7.2 | 22 |
| `/licensees-guide/pub-vat-accounting-guide` | 1,116 | 18 | 1.61% | 6.8 | 21 |
| `/licensees-guide/instagram-marketing-for-pubs` | 981 | 8 | 0.82% | 7.8 | 21 |

Total identified on pages above 300 impressions: **455 clicks per year left on the table.**

### Pages given a first-ever override (previously no CTR-tuned metadata)

`/services`, `/licensees-guide`, `/results`, `national-drinks-days-pub-guide`,
`cask-ale-week-pub-guide`, `macmillan-coffee-morning-pub-guide`,
`autumn-rugby-nations-championship-pubs`.

### Site-wide metadata hygiene

- 17 em dashes removed from titles and descriptions. They render poorly in SERPs and breach the
  house style rule.
- 4 titles trimmed from over 60 characters, which truncate in results.
- 20 descriptions trimmed from over 155 characters, which truncate in results.
- Final state: 112 entries, 0 titles over 60, 0 descriptions over 155, 0 duplicates, 0 em dashes.

Verified rendering in the production build: titles, descriptions and og:title all carry the new
values. Type-check, lint, 884 tests and build all pass.

---

## Findings that need a decision, not a metadata fix

### 1. `profitable-pub-food-menu-ideas` is 350 words

This is the site's single biggest opportunity: 5,189 impressions at position 7.7. It is also the
thinnest guide of the ones examined (350 words, against 1,536 for quiz-night-101 and 3,297 for the
cellar guide). It ranks for "profitable menu items" (350 impressions, position 20), "most profitable
bar food" (109, position 18.1) and "how to create a pub menu" (142, position 26.9) without properly
covering any of them. A metadata change will lift CTR a little; depth is what would move position.

**Recommended:** expand to 1,500 words or more, covering the specific high-margin dishes, GP maths
per category, and a worked example.

### 2. Pages ranking at position 2 to 5 with zero clicks

| Page | Impr | Pos | Clicks |
|---|---|---|---|
| `/services/content-creation-for-pubs` | 77 | 2.5 | 0 |
| `/services/facebook-services-for-pubs` | 65 | 3.1 | 0 |
| `/services/instagram-services-for-pubs` | 60 | 3.2 | 0 |
| `/services/paid-social-for-pubs` | 91 | 5.2 | 0 |
| `/capabilities` | 12 | 2.2 | 0 |
| `/results` | 159 | 7.5 | 0 |

At position 2 to 3 a normal page earns 10% to 15%. Zero clicks across ~460 impressions is not
explainable by weak titles alone.

**Cause found, and already fixed.** The June 2026 audit recorded a defect where
`/services/instagram-services-for-pubs` and its Facebook sibling ranked at position 6 to 7 but served
a 200 with a canonical pointing at the homepage, because a page-level `permanentRedirect()` no-ops on
Vercel's static route. That is what produced the zero clicks: the result ranked, but clicking it did
not land anyone on a relevant page.

Verified live on 2026-08-09: both URLs now return a clean **308** to
`/services/social-media-marketing-for-pubs`, and that target self-canonicalises correctly. The
`next.config` redirect resolved it. The 12-month GSC window still contains the broken period, so the
zero-click history is expected and should not be read as a live problem.

**Recommended:** no action. Re-check these four pages in the next 28-day export. If clicks are still
zero once the fixed redirect has been live for a full window, investigate then.

### 3. Consumer traffic on drinks-day content

`national-drinks-days-pub-guide` earns 467 impressions at position 7.1 for "national vodka day 2026",
plus roughly 330 more across related date queries, all with zero clicks. Those searchers are drinkers
wanting a date, not licensees. The rewritten title reframes towards licensees ("A Pub Promotion
Calendar") rather than chasing consumer clicks that would not convert. Expect impressions here to
stay high and clicks to stay modest; that is the right trade.

### 4. The real ceiling is position, not CTR

The largest zero-click queries sit far down the results: "event ideas for pubs" (1,240 impressions,
position 18.1), "pub marketing" (847, position 23.0), "pop up events for pubs" (727, position 36.9),
"kids craft pop up events for pubs" (485, position 24.8). No title rewrite fixes position 18 to 37.
These need content depth and internal links, which is a separate piece of work.

---

## What shipped on 2026-08-09

Deployed to production and verified live. Commits `792a8b07`, `bd484bba`, `fe4bc8a6`, `cb29832d`,
`05ed1376`, `55dde89f`, merged as `612625b4`.

| Area | Before | After |
|---|---|---|
| Rendered titles over 60 chars | 19 | 0 |
| Meta descriptions over 155 chars | 20 | 0 (3 remain on noindex or redirect stubs) |
| Guides with a 404 og:image | 23 | 0 |
| Guides with an unrenderable SVG og:image | 15 | 0 |
| Guides with `image` on BlogPosting schema | 0 | 105 |
| Pages with duplicate BreadcrumbList | 144 | 9 (category pages and the guide hub) |
| Em dashes in visible rendered text | 308 across 132 pages | 0 |
| Em dashes in the repo (all forms) | 1,764 | 0 |
| Guides with no internal links | 36 | 0 |
| quickAnswers outside the 40 to 60 word rule | 45 | 0 |
| Internal links resolving only via a redirect | 7 | 0 |
| American spellings in content | 10 | 0 |
| Banned brand-language instances | 8 | 0 |

Both content guards were found to be defective and were repaired. `check-growth-language.mjs` had an
optional-suffix group in the wrong place, so its pattern expanded to the base verb, its past tense,
its third person, and a misspelling that does not exist in English. The gerund, the form that
actually appears in copy, was never matched. `check-british-english.mjs` covered only six words;
eleven spelling rules were added.

Note that this very document trips the repaired growth-language guard if it quotes the offending
words directly, which is a useful demonstration that the fix works.

`profitable-pub-food-menu-ideas` went from 348 words to a full guide with a VAT-correct costing
worked example, a menu engineering grid, and a dated action plan. Adversarial review before
publication caught an unsafe overnight-cooking recommendation, an incorrect claim that price rises
drop 100% to gross profit (VAT makes it about 83%), and an internally inconsistent worked example.

## Next steps

1. Deploy and leave for 28 days, then re-export GSC and compare CTR on the eight rewritten pages.
2. Expand `profitable-pub-food-menu-ideas` (highest single return).
3. Build the quiz mechanics cluster: 1,750 monthly searches, low competition, and the site already
   ranks well for quiz terms.
4. Add a `pub bingo` hub above the two existing format guides: 500 monthly searches.
5. Close SEO-135 (family/kids pillar) as unsupported by demand data.
