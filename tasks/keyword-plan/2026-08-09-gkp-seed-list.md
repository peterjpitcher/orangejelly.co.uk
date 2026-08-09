# GKP Seed List for /keyword-plan (2026-08-09)

> **STATUS: seeds used, results in.** These seeds were run through GKP on 2026-08-09. The measured
> results, and the priority order they produce, are in
> [2026-08-09-ctr-reclaim.md](./2026-08-09-ctr-reclaim.md). Read that first. The priority ranking
> implied by the cluster order below was written *before* the data arrived and is wrong in one
> important way: the family and kids cluster returned **no GKP data at all**, while quiz mechanics
> returned 1,750 monthly UK searches. Raw exports are in `evidence/gkp-2026-08-09/`.

**Purpose:** paste these seeds into Google Keyword Planner ("Discover new keywords"), export the CSV,
then run `/keyword-plan` with that export plus a fresh GSC 12-month query export.

**Locale to set in GKP:** United Kingdom, English.

**Source of the seeds:** Google Search Console 12-month query export
(`tasks/seo-powerhouse/2026-06-16-orangejelly-co-uk/evidence/gsc/GSC 12 months/Queries.csv`),
filtered to queries where orangejelly.co.uk already earns impressions but has no closely matching
guide. 13,381 impressions and 39 clicks across 701 queries in that window.

**Important:** GSC only shows queries where the site already appears. It cannot show demand where
the footprint is zero. GKP fills that gap, which is why the seeds below are deliberately broader
than the observed queries.

---

## Cluster A: Family and kids (RESULT: no measurable demand)

> **GKP result: 0. All ten seeds returned no data.** The GSC impressions below are real but have
> earned zero clicks in 12 months, and GKP cannot measure the terms at all. Recommendation is to
> close SEO-135 rather than build this pillar. See the reclaim report for the full reasoning.

The July 2026 audit parked this as blocked on keyword data (SEO-135). GSC shows roughly 870
impressions of family intent across three queries with no dedicated page ranking well.

**Observed in GSC:**

| Query | Impressions | Position |
|---|---|---|
| how to organise events to attract families to pubs | 315 | 20.7 |
| kids craft pop up events for pubs | 356 | 28 |
| family friendly activities to increase pub footfall | 206 | 32 |

**GKP seeds:**
```
family friendly pub ideas
kids activities in pubs
pub family day ideas
children's entertainment for pubs
school holiday pub events
kids eat free pub
family pub marketing
pub soft play area
kids craft events pub
attract families to pub
```

**Existing pages to check for overlap:** `how-to-attract-families-to-your-pub`, `family-craft-hour-101`.

---

## Cluster B: Marketing services (commercial intent, not guides)

Roughly 2,700 impressions of buying intent. Positions 6 to 51, zero clicks. These are service page
targets, not blog guides. Worth separating in the plan so they do not get written as articles.

**Observed in GSC:**

| Query | Impressions | Position |
|---|---|---|
| pub marketing | 666 | 22.3 |
| pub marketing agency | 304 | 19.6 |
| instagram services for pubs | 256 | 7.0 |
| content creation for pubs | 226 | 14.8 |
| paid social for pubs | 207 | 11.2 |
| marketing agency for pubs | 161 | 18.3 |
| digital marketing for pubs | 137 | 44 |
| social video services for pubs | 126 | 25 |
| facebook services for pubs | 123 | 6.1 |
| pub advertising | 122 | 33 |
| content creation services for pubs | 86 | 8.8 |
| marketing agency for bars | 75 | 46 |
| agency for pubs | 67 | 24.3 |
| pubs and bars marketing solutions | 64 | 10.4 |
| bar social media marketing | 62 | 51 |
| brand partnership services for pubs | 46 | 11.3 |

**GKP seeds:**
```
pub marketing agency
hospitality marketing agency uk
social media management for pubs
pub social media agency
content creation for hospitality
marketing for bars and restaurants
pub advertising services
freelance pub marketing
```

---

## Cluster C: Events and entertainment planning

Existing coverage is heavy on individual formats (22 event guides) but light on the planning and
budgeting layer above them.

**Observed in GSC:**

| Query | Impressions | Position |
|---|---|---|
| pub entertainment ideas | 129 | 10.1 |
| boost pub revenue with events | 132 | 28 |
| ideas for pub events | 117 | 6.6 |
| how to manage entertainment budgets for pubs | 97 | 8.8 |
| pub events ideas | 87 | 12.8 |
| pub ideas to make money | 48 | 14.0 |
| pub ideas | 48 | 23.8 |

**GKP seeds:**
```
pub entertainment ideas
pub entertainment budget
how much to pay a pub band
pub events calendar
weekly pub event schedule
pub entertainment licence
booking entertainment for pubs
pub event roi
```

**Cannibalisation warning:** `pub-event-ideas` and `how-to-run-successful-pub-events` already exist.
Check before adding another events hub.

---

## Cluster D: Quiz mechanics (deeper than the current guides)

Quiz is the strongest performing topic on the site (`quiz night ideas` at position 7.7, four clicks).
The gap is format and round mechanics, not another ideas list.

**Observed in GSC:**

| Query | Impressions | Position |
|---|---|---|
| quiz night format | 109 | 31 |
| pub quiz bonus round | 75 | 28 |
| quiz night format details | 56 | 10.3 |
| pub quiz format | 55 | 15.6 |
| how to run a pub quiz | 48 | 9.6 |
| pun quiz calendar | 45 | 24.1 |
| pub quiz topics | 42 | 10.3 |

**GKP seeds:**
```
pub quiz format
how to run a pub quiz
pub quiz round ideas
pub quiz question rounds
pub quiz scoring system
quiz night rules
pub quiz answer sheet
picture round ideas
pub quiz prizes
```

**Existing pages:** `quiz-night-101`, `quiz-night-ideas`, `restart-quiz-music-sport-roi`.

---

## Cluster E: Bingo hub

Two format guides exist (`cash-bingo-101`, `music-bingo-101`) but nothing ranks for the generic term.

| Query | Impressions | Position |
|---|---|---|
| pub bingo | 59 | 12.6 |
| bingo in pubs | 51 | 11.1 |

**GKP seeds:**
```
pub bingo
bingo night in pubs
how to run bingo in a pub
bingo licence uk pub
bingo equipment for pubs
```

---

## Cluster F: Refurbishment and maintenance

| Query | Impressions | Position |
|---|---|---|
| bar refurbishment | 127 | 37 |
| pub refurbishment | 98 | 34 |
| pub maintenance | 91 | 77 |
| pub refit | 65 | 30 |

**GKP seeds:**
```
bar refurbishment cost
pub refurbishment cost uk
pub refit ideas
pub maintenance checklist
pub interior design
brewery refurbishment funding
```

**Existing pages:** `pub-refurbishment-on-budget`, `pub-toilet-refurbishment-budget-guide`,
`low-cost-decor-refreshes-new-improved`, `reboot-pub-atmosphere-on-budget`. High cannibalisation risk.

---

## Cluster G: Positioning, loyalty and branding

| Query | Impressions | Position |
|---|---|---|
| pub co branding | 116 | 17.1 |
| pub loyalty cards | 90 | 30 |
| premiumisation in your pub | 80 | 14.6 |
| what makes wetherspoons exclusive | 43 | 21.4 |

**GKP seeds:**
```
pub loyalty card scheme
pub loyalty app
pub branding ideas
pub rebrand
premiumisation hospitality
pub brand identity
```

---

## Cluster H: Staffing (no GSC data, structurally underserved)

Only three of 105 guides cover staff. There is no GSC signal because there is no content to generate
impressions. This is a pure GKP discovery cluster, so treat all output as unvalidated demand.

**GKP seeds:**
```
pub staff recruitment
how to retain bar staff
bar staff training
pub rota planning
tronc scheme pubs
hospitality staff shortage
pub staff handbook
bar staff interview questions
national minimum wage hospitality
```

---

## Cluster I: Turnaround language

| Query | Impressions | Position |
|---|---|---|
| fix my pub | 109 | 5.7 |
| summer pub | 76 | 9.1 |

**GKP seeds:**
```
fix my pub
struggling pub help
pub turnaround
failing pub advice
pub business support uk
```

One further seed in this cluster used rescue-style phrasing ("how to ... a failing pub"). It is
omitted from the list above because the repo's growth-language check blocks that verb in markdown.
The verbatim term is preserved in the raw export at `evidence/gkp-2026-08-09/` and it returned no
GKP data, so nothing measurable is lost.

---

## What to do with this

1. Re-export GSC (12 months and 28 days, UK) from Search Console. The June export is now two months
   stale and the standing note said mid-August 2026.
2. Paste each cluster's seeds into GKP "Discover new keywords", set location to United Kingdom,
   language English. Download the CSV per cluster or as one combined export.
3. Run `/keyword-plan` and supply both files. Name the source and date for each.
4. Expect bucketed ranges (for example "100 to 1K") rather than exact volumes, because the Google Ads
   account has no active spend. That is normal and the skill handles it. Read ranges by their lower
   bound.

## Open flag on the brief

105 guides currently produce 39 clicks from 13,381 impressions over 12 months, a click-through rate of
about 0.29 percent. Average positions sit between 5 and 25. Topic coverage is not the constraint;
ranking position and title or snippet appeal are. More guides will add impressions but will not
convert them at current positions. Worth pairing the new pages with a title and meta rewrite on the
existing top-impression pages.
