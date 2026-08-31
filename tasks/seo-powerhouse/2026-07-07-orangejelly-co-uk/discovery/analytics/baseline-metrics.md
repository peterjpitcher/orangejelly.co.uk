# Performance Baseline — Orange Jelly (orangejelly.co.uk)

**Author:** Analytics Specialist · **Date:** 2026-07-07 · **Purpose:** the benchmark to beat at the mid-August (8-week) and December (6-month) re-measurement gates.

**Data status caveat:** all GSC figures are first-party (`Known`) but dated **2026-06-16 — three weeks stale and pre-dating the June fixes**. They are the *pre-fix* baseline; they cannot yet reflect merged work. GA4 traffic, engagement, and CrUX field data are `unavailable` this run (no exports / no API keys). Report all future gains as **% change** (user preference — never raw counts/multiples).

## 1. Search visibility baseline (GSC, first-party, 2026-06-16)

**Scale (respect it in every decision):**
- 28-day: **25 clicks / 2,654 impressions** (`evidence/gsc-28d/search-queries.csv`).
- 12-month: **701 queries / 132 pages** (`evidence/search-queries.csv`).

**Cluster picture (impression-weighted position; computed in strategy-document.md §3 from `search-queries.csv`):**

| Cluster | Queries | Clicks | Impressions | Weighted pos | CTR |
|---|---:|---:|---:|---:|---:|
| Events (general) | 112 | 10 | 4,456 | 20.0 | 0.22% |
| Quiz/bingo/karaoke | 140 | 24 | 1,651 | 17.8 | 1.45% |
| Commercial — social/channel | 22 | 4 | 1,634 | 11.2 | 0.24% |
| Commercial — agency/marketing | 14 | 0 | 1,444 | 25.4 | 0.00% |
| Commercial — rescue/turnaround | 5 | 1 | 197 | 9.4 | 0.51% |
| County/local | 9 | 0 | 30 | 37.3 | 0.00% |

**Structural read:** best positions sit on the commercial clusters (social ~11, rescue ~9); worst CTRs sit there too (0–0.24%). Demand exists, Google ranks the site, almost nobody clicks — because those pages are thin/mis-canonicalised/not indexed.

**Named-channel queries already ranking (the P1 reclaim targets, from `opportunities-ctr-gap.csv` / `search-queries.csv`):**

| Query | Pos | Impr/12mo | CTR | Clicks left on table (curve) |
|---|---:|---:|---:|---:|
| instagram services for pubs | 7.0 | 256 | 0.0% | ~9 |
| facebook services for pubs | 6.1 | 123 | 0.0% | ~6 |
| social media marketing for pubs | 12.0 | 380 | 0.3% | ~5 |
| paid social for pubs | 11.2 | 207 | 0.0% | ~4 |
| content creation for pubs | 14.8 | 226 | 0.0% | ~3 |
| fix my pub | 5.7 (5.3 in 28d) | 109 | 0.9% | ~4 |

CTR-by-position target uses the bundled **inferred industry curve** (Advanced Web Ranking / Google Organic CTR study) — labelled inferred because 28-day volume (25 clicks) is too thin to derive a stable site-specific curve. State this whenever quoting the "clicks left" column.

## 2. Indexation baseline (GSC Coverage, 2026-06-16)

- **Discovered – currently not indexed (44 URLs, drilldown-6):** includes the entire commercial priority set — `/capabilities`, `/compete-with-pub-chains`, `/pub-marketing`, `/pub-marketing-agency`, all four `/ways-to-work/*` packages, six county pages.
- **Crawled – currently not indexed (30 URLs, drilldown-7):** `/quiet-midweek-solutions`, `/empty-pub-solutions`, `/pub-marketing-no-budget`.
- **Priority commercial pages indexed: 0 of the priority set** (pre-fix). This is the structural cap on the funnel. Post-fix status is **unknown** until the mid-August refresh.

Source: `evidence/indexation-summary.csv`, `evidence/indexation-urls.csv`.

## 3. Conversion baseline (first-party)

- **Supabase leads** (`contacts`, `newsletter_subscribers`, `conversion_events`, `lead_sources` — `src/lib/db/leads.ts`): **new since June (dd6bf693)**; a usable interim enquiry source. **Count = TBD — export not supplied this run.** This is the source of truth for the enquiries KPI until GA4 conversions are verified.
- **GA4 conversions:** the contact-form `generate_lead` event **does not exist** (see `tracking-health-check.md`); other conversion events (whatsapp/cta) push to dataLayer but their GA4 tags are unverified. **No GA4 conversion baseline can be trusted.**
- **Enquiry rate from organic:** not computable — needs both a `generate_lead` event (T1) and a GA4 organic-session denominator (currently `unavailable`).

## 4. Engagement & Core Web Vitals baseline

- **GA4 engagement** (bounce, time on page, pages/session): `unavailable` — no GA4 export.
- **Core Web Vitals field data** (CrUX p75 LCP/INP/CLS/TTFB): `unavailable` — no CRUX_API_KEY/PAGESPEED_API_KEY. The site emits a `web_vitals` dataLayer event in production (`PerformanceMonitor.tsx`) but that data is not accessible in this run. Treat CWV as a data gap, not a pass.

## 5. Device / geography baseline

Directional (June roadmap baseline, unchanged evidence): mobile out-performs desktop; UK ≈ 90% of clicks. Mobile is the commercial surface — prioritise mobile in any conversion/CRO work.

## 6. Targets to beat (6-month, from strategy §6)

| KPI | Baseline (Known) | Target | Source |
|---|---|---|---|
| Service enquiries | Supabase count TBD (export needed); GA4 unverified | Establish July baseline, then grow; report as % | Supabase + GA4 |
| Priority commercial pages indexed | 0 of priority set | All (agency, 4 packages, fix-my-pub set, quiet-midweek) | GSC Coverage |
| Commercial-cluster CTR | 0.00–0.24% | ≥1% at current positions | GSC |
| Named-channel query clicks | ~4/12mo across cluster | Double-digit % share of their impressions | GSC |
| Events-cluster clicks | 34/12mo (events+quiz) | Hold or grow; bridge CTR measured | GSC + GA4 |

## 7. Re-measurement schedule

- **~2026-08-15 (8-week gate):** re-export GSC 12-mo + 28-day + Coverage; re-run `analyse-search-data.py --queries-prev evidence/search-queries.csv` for decay analysis; validate June fixes; export Supabase leads for the first enquiry delta.
- **~December 2026 (6-month gate):** full re-crawl; organic enquiry contribution; visibility by topic; roadmap progress.

All figures above trace to the cited GSC CSVs or codebase locations. No volume, rank, traffic, or conversion figure has been invented; every gap is labelled `unavailable`.
