# Orange Jelly — Performance Baseline (Phase 2, Analytics)

**Date:** 2026-06-16 (Europe/London) · **Author:** Analytics Specialist
**Purpose:** the frozen starting point against which every Phase 3–5 change is measured. Re-pull the identical GSC views on the same cadence to compare.

**Data status legend:** `Known` = first-party GSC export. `unavailable` = no source provided (do not infer a number). GA4 was **not supplied** to this audit → all traffic/session/engagement/conversion baselines are `unavailable`. Third-party volume/difficulty/backlink/DA and Core Web Vitals field data are `unavailable` (no Ahrefs/Semrush/PSI/CrUX provided).

---

## 1. Organic search baseline (GSC, first-party, Known)

### UK (the commercial market — optimise to this)
| Window | UK clicks | UK impressions | UK avg position | UK CTR |
|---|---|---|---|---|
| Last 12 months | 423 | 25,935 | 13.78 | 1.63% |
| Last 28 days | 97 | 5,032 | 11.93 | 1.93% |

*Source: `evidence/gsc/GSC 12 months/Countries.csv`, `evidence/gsc/GSC 28 days/Countries.csv` (Known).*

**Run-rate read (inferred from Known data):** 97 UK clicks / 28 days ≈ a ~1,265/yr annualised pace vs the trailing-12-mo total of 423 — i.e. the recent run-rate is roughly **3× the trailing-year average**, and average position improved 13.78 → 11.93. Trajectory is positive; the job is to point it at commercial intent. *(Annualisation is an inference, not a Known figure — label it inferred wherever quoted.)*

### Device split (12 months, all-country, Known)
| Device | Clicks | Impressions | CTR | Avg position |
|---|---|---|---|---|
| Mobile | 280 | 14,956 | 1.87% | 9.83 |
| Desktop | 230 | 24,933 | 0.92% | 13.61 |
| Tablet | 8 | 635 | 1.26% | 11.74 |

*Source: `evidence/gsc/GSC 12 months/Devices.csv` (Known).* **Mobile ranks ~3.8 positions better and converts impressions to clicks ~2× better than desktop.** Mobile is the commercially material surface — Phase 4 CRO/UX must be mobile-first.

### Geography (12 months, Known)
UK = 423 of ~470 total clicks (≈90%). US 14 clicks / 5,834 impr (CTR 0.24%) is impression noise. **Do not optimise for international traffic.**

---

## 2. Page-type segmentation (GSC 12-mo Pages, Known)

| Page type | Pages | Clicks | Impressions | CTR |
|---|---|---|---|---|
| Informational guides (`/licensees-guide/*`) | 97 | 458 | 39,216 | 1.17% |
| Commercial / other (`/services`, `/ways-to-work/*`, `/pub-marketing-*`, etc.) | 34 | 49 | 3,432 | 1.43% |
| Homepage | 1 | 20 | 973 | 2.06% |

*Source: `evidence/gsc/GSC 12 months/Pages.csv`, categorised by URL path (Known).*
*Note: Pages.csv is the all-country export (totals slightly above the UK-only Countries figure); segmentation is directionally Known.*

**The structural problem in one line:** 93% of clicks land on informational guides; the commercial layer that should generate enquiries earns **49 clicks across 34 pages in a year**. The site ranks for questions, not for buyers.

---

## 3. Commercial-query cluster (the CTR collapse) — GSC Queries 12-mo, Known

The query export (`Queries.csv`, top 701 queries; GSC truncates/anonymises the long tail, so this is a **verifiable subset**, not the property total) was intent-classified. Commercial-intent queries = agency / services / "marketing for pubs" / named-channel services / fix-my-pub / recovery / turnaround.

| Cluster (query-table subset) | Queries | Clicks | Impressions | CTR | Impression-weighted avg position |
|---|---|---|---|---|---|
| **Commercial intent** | 43 | **2** | **3,236** | **0.062%** | **18.5** |
| Informational (remainder of table) | 658 | 37 | 10,145 | 0.36% | — |

*Source: `evidence/search-queries.csv` / `Queries.csv`, intent-classified (Known).*

Top commercial queries by impressions (all earning 0–1 clicks):

| Query | Clicks | Impr | Position |
|---|---|---|---|
| pub marketing | 0 | 666 | 22.3 |
| social media marketing for pubs | 1 | 380 | 12.0 |
| pub marketing agency | 0 | 304 | 19.6 |
| instagram services for pubs | 0 | 256 | 7.0 |
| content creation for pubs | 0 | 226 | 14.8 |
| paid social for pubs | 0 | 207 | 11.2 |
| marketing agency for pubs | 0 | 161 | 18.3 |
| facebook services for pubs | 0 | 123 | 6.1 |
| fix my pub | 1 | 109 | 5.7 |
| content creation services for pubs | 0 | 86 | 8.8 |

*Source: `Queries.csv` (Known).* Demand for paid pub-marketing help exists and Google already shows Orange Jelly for it — but at weighted position ~18.5 and with weak pages, the impressions never become clicks. **This is the highest-value lever on the site.**

---

## 4. Top organic landing pages (GSC 12-mo Pages, Known) — quick-win pool

Pages at position 5–20 with ≥800 impressions (existing impressions, sub-2% CTR — small ranking/metadata gains unlock clicks at no acquisition cost):

| Page | Clicks | Impr | Position | CTR |
|---|---|---|---|---|
| /licensees-guide/summer-pub-event-ideas | 96 | 7,572 | 15.1 | 1.27% |
| /licensees-guide/profitable-pub-food-menu-ideas | 67 | 4,479 | 7.4 | 1.50% |
| /licensees-guide/quiz-night-ideas | 76 | 4,348 | 11.8 | 1.75% |
| /licensees-guide/social-media-strategy-for-pubs | 37 | 3,836 | 12.6 | 0.96% |
| /licensees-guide/content-marketing-ideas-pubs | 15 | 2,158 | 15.6 | 0.70% |
| /licensees-guide/pub-refurbishment-on-budget | 13 | 1,792 | 14.7 | 0.73% |
| /licensees-guide/christmas-pub-promotion-ideas | 17 | 1,375 | 11.6 | 1.24% |
| /licensees-guide/quiz-night-101 | 16 | 1,372 | 7.8 | 1.17% |
| /licensees-guide (hub) | 2 | 1,272 | 17.5 | 0.16% |
| /licensees-guide/compete-with-wetherspoons | 13 | 1,050 | 9.2 | 1.24% |
| /licensees-guide/midweek-pub-offers-that-work | 10 | 902 | 7.8 | 1.11% |
| /licensees-guide/summer-moments-simple-campaigns | 15 | 877 | 12.2 | 1.71% |

*Source: `evidence/gsc/GSC 12 months/Pages.csv` (Known).*

---

## 5. Indexation baseline (GSC Coverage drilldowns, Known)

| Reason (drilldown) | Pages | Marketing-site URLs | Subdomain/protocol noise |
|---|---|---|---|
| Discovered – currently not indexed | 44 | **44** | 0 |
| Crawled – currently not indexed | 30 | **30** | 0 |
| Excluded by 'noindex' tag | 10 | ~0 | 10 (`management.`/`cheersai.` + auth) |
| Page with redirect | 7 | 0 | 7 (http/non-www host variants) |
| Not found (404) | 6 | 2 guides | 4 (`cheersai.` settings etc.) |
| Blocked by robots.txt | 6 | 0 | 6 (`management.` events) |
| Duplicate w/o user-selected canonical | 2 | 0 | 2 (`management.` auth) |

*Source: `evidence/gsc/orangejelly.co.uk-Coverage-Drilldown-*` Table.csv + Metadata.csv (Known).*

**Material correction to the Phase 1 framing:** the two largest buckets — Discovered-not-indexed (44) and Crawled-not-indexed (30) — are **100% genuine Orange Jelly marketing-site pages, zero subdomain noise.** The subdomain/protocol noise lives in the *noindex/redirect/robots/duplicate* buckets, which are largely working as intended. The 74 not-indexed marketing URLs include the **entire commercial layer**:
- `/pub-marketing-agency`, `/pub-marketing`, `/pub-marketing-no-budget`
- all 6 regional location pages (`/pub-marketing-london|surrey|oxfordshire|hampshire|hertfordshire|buckinghamshire`)
- all 4 package pages (`/ways-to-work/growth-fix|growth-partner|momentum-month|turnaround-intensive`)
- `/capabilities`, `/compete-with-pub-chains`, `/quiet-midweek-solutions`, `/empty-pub-solutions`
- ~50 guides (incl. new seasonal: `autumn-pub-event-ideas`, `christmas-pub-event-ideas`, `cask-ale-week-pub-guide`, `pop-up-events-for-pubs`, `national-drinks-days-pub-guide`)

**Every commercial page that should capture the §3 demand is currently not indexed.** This is the binding constraint on the lead-gen goal, not a clean-up nicety. (Diagnosis owned by Technical Specialist; the analytics read is: the commercial baseline in §2 is artificially near-zero partly *because the pages aren't in the index*.)

---

## 6. Conversion / enquiry baseline

| Metric | Value | Data status |
|---|---|---|
| Organic sessions | — | `unavailable` (no GA4) |
| Organic engagement (bounce/time/pages-per-session) | — | `unavailable` (no GA4) |
| Enquiry form submissions | — | `unavailable` (not captured — see below) |
| WhatsApp / phone CTA clicks | — | `unavailable` (no event tracking) |
| Organic conversion rate | — | `unavailable` |
| Lead/revenue from organic | — | `unavailable` |

**Codebase audit (Known, first-party):**
- GTM is scaffolded (`src/components/GoogleTagManager.tsx`) with Consent Mode v2, but only loads when `NEXT_PUBLIC_GTM_ID` is set — `.env.example:13` ships the placeholder `GTM-XXXXXXX`. Production GTM/GA4 status is **`unavailable`** (no GA4 export, no GTM/property access provided).
- **No conversion events exist.** The only `dataLayer.push` in the codebase is the GTM bootstrap (`GoogleTagManager.tsx:21`). Contact-form success (`src/components/forms/contact-form.tsx:84`) pushes no event; the ~15 WhatsApp/`tel:`/`mailto:` CTAs (Navigation, StickyEngagementBar, CTASection, PackageCTA, BlogPost, guide template) have no click tracking.
- The contact server action (`src/app/actions/contact.ts:30`) only `console.log`s the submission — enquiries are **not captured server-side either** (no email/CRM/DB write).

**Conclusion:** the lead-gen goal is currently **unmeasurable end-to-end**. This is the SEO-001 prerequisite (see report.md §Measurement Framework + Data Gaps).

---

## 7. What "unavailable" blocks (do not fabricate)

- Core Web Vitals / mobile UX field data — `unavailable` (no PSI/CrUX). Crawl flagged 3 oversized images and 29 multiple-H1 pages (Known, from audit-summary) but those are lab/structure signals, not field CWV.
- Keyword search volumes for new commercial terms — `unavailable`; validate via keyword-plan / Google Keyword Planner before asserting demand size.
- Backlink counts / domain authority — `unavailable` (no Ahrefs/Semrush).
- AI-referral traffic / AI citations — `unavailable` (no GA4 channel data); track manually as a directional log only.
