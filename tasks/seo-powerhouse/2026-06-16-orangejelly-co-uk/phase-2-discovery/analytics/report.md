# Orange Jelly — Analytics & Performance Report (Phase 2)

**Date:** 2026-06-16 (Europe/London) · **Author:** Analytics Specialist
**Commercial goal:** more service enquiries / leads from UK licensees.
**Companion file:** `baseline-metrics.md` (frozen benchmark — full tables and sources there).

**Data status:** GSC = **Known** (first-party). GA4 = **not supplied** → all session/engagement/conversion/revenue metrics are **`unavailable`** and never fabricated. No Ahrefs/Semrush/PSI/CrUX → volumes/backlinks/DA/Core-Web-Vitals are `unavailable`/`inferred`.

---

## Performance Baseline (the benchmark to beat)

GSC, UK, first-party (Known): **423 clicks / 25,935 impr / pos 13.78 / CTR 1.63%** (12 months); **97 clicks / 5,032 impr / pos 11.93 / CTR 1.93%** (last 28 days). Recent run-rate ~3× the trailing-year average and average position improved 2 places — trajectory positive (annualisation is inferred). Mobile beats desktop on rank (9.83 vs 13.61) and CTR (1.87% vs 0.92%) — **mobile is the commercial surface**. UK ≈ 90% of clicks; international is noise.

**One-line diagnosis:** the site ranks for *questions* (97 guides = 458 clicks/yr) not *buyers* (34 commercial pages = 49 clicks/yr); the commercial pages that should capture buying intent are **not indexed** (SEO-004); and **nothing measures whether a visitor enquires** (SEO-001). Fix measurement → indexation → commercial layer, in that order. Full tables: `baseline-metrics.md`.

---

## Quick Win Opportunities

Quantified **only** from GSC (Known). "Potential" = mechanism/ceiling implied by existing impressions, not a click forecast (no GA4/CTR model); labelled inferred where it goes beyond raw figures.

| Opportunity | Current (GSC, Known) | Potential (mechanism) | Action | Expected impact |
|---|---|---|---|---|
| **Commercial pages not indexed** | `/pub-marketing-agency`, `/pub-marketing`, 6 `/pub-marketing-*` regions, 4 `/ways-to-work/*` packages, `/capabilities`, `/compete-with-pub-chains` in Discovered-not-indexed | Cannot earn the 3,236 commercial impressions while absent from index — caps the whole funnel at ~0 | Technical diagnose+index (Risk Register); Analytics confirm in Coverage | **Critical** — unblocks the commercial cluster |
| **Commercial-query CTR collapse** | 43 commercial queries: 3,236 impr, **2 clicks**, weighted pos ~18.5 | Modest CTR at current pos converts a measurable share; some already top-10 (`instagram services for pubs` 7.0, `fix my pub` 5.7, `facebook services for pubs` 6.1) | Strengthen `/services` + intent pages; sharpen metadata/CTAs (CLAIMS) | **High** — direct lead proxy |
| **summer-pub-event-ideas** | 7,572 impr, 96c, **pos 15.1**, CTR 1.27% | Largest impression pool; top-10 is click threshold | Refresh/expand + answer blocks (SEO-006) | **High** |
| **content-marketing-ideas-pubs** | 2,158 impr, 15c, pos 15.6, CTR 0.70% | Sub-1% CTR at pos 15.6 → headroom | Depth/intent pass | Medium |
| **social-media-strategy-for-pubs** | 3,836 impr, 37c, pos 12.6, CTR 0.96% | Lift position AND bridge to do-it-for-you social | Optimise + guide→service bridge | High (dual) |
| **`event ideas for pubs` query** | 956 impr, **0c**, pos 16.8 | ~1,000 impr, no page in click range | Map to best event guide; top-10 | Medium |
| **`/licensees-guide` hub** | 1,272 impr, 2c, pos 17.5, CTR 0.16% | Ranks but snippet not earning clicks | Metadata rewrite | Low–Medium |
| **christmas-pub-promotion-ideas** | 1,375 impr, 17c, pos 11.6 | Seasonal; refresh ahead of Q4 | Seasonal refresh | Medium (timed) |

---

## Declining Performance Alerts

No period-over-period GSC was exported (only 12-mo + 28-day snapshots) → **trend-based decline detection is `unavailable`**; do not assert decline without comparison data. Risk flags from the snapshot (not measured declines):

| Page/Keyword | Signal | Severity | Likely cause | Action |
|---|---|---|---|---|
| 30 marketing pages "Crawled – not indexed" | Crawled, not indexed | Medium | Thin/duplicative or weak internal links | Technical+Content: depth/links then request indexing |
| New seasonal guides "Discovered – never crawled" (1970-01-01) | Never fetched | Medium | Orphaned (not in sitemap/links) | Internal-link + sitemap |
| 2 guides 404 (`kitchen-nightmares-chef-quits`, `brewery-tie-improve-your-deal`) | 404 | Low–Medium | Removed/renamed, no redirect | Confirm intent; redirect if equity |

Real decline detection is enabled by the SEO Change Log + weekly GSC pull below.

---

## Segmented Performance

**By page type (GSC 12-mo, Known):** Guides 97pg → 458c/39,216i/1.17%; Commercial 34pg → 49c/3,432i/1.43%; Homepage → 20c/973i/2.06%. 93% of clicks are informational. Commercial CTR (1.43%) is fine *per impression* — the catastrophe is **impression starvation** (3,432 vs 39,216) from un-indexed pages.
**By intent (GSC Queries, Known):** commercial 0.062% CTR vs informational 0.36% — a position + page-strength + indexation problem, not demand.
**By device (Known):** Mobile 280c@9.83/1.87% vs Desktop 230c@13.61/0.92% → validate conversion work mobile-first.
**By geography (Known):** UK ≈90% — optimise UK only.

---

## Measurement Framework (outcome-based)

**Primary KPIs (outcomes):**
1. **Service enquiries** (form submit + WhatsApp/tel CTA clicks, organic-attributed) — baseline `unavailable` until SEO-001; the #1 KPI.
2. **Clicks to commercial pages (GSC)** — baseline **49/12 mo (Known)**; target a material multiple.
3. **Commercial-cluster CTR (43 queries)** — baseline **0.062% (Known)**; target low-single-digit %.
4. **Indexed commercial pages** — baseline **0 of priority set (Known)**; target all indexed.
5. **Organic enquiry conversion rate** — `unavailable` until GA4; eventual north-star.

**Leading indicators:** indexation coverage delta (weekly); position movement on 43-query cluster + quick-win guides; commercial-page impression growth; CTR lift on edited pages; **AI-referral traffic** (GA4 channel once live — until then `unavailable`, manual dated citation log only, confidence Low).

**Outputs (track, do NOT report as success):** blogs published, tickets closed, pages optimised, bridges/links added.

**Cadence:** Weekly — GSC clicks/impr/pos for commercial cluster + quick-win guides, indexation delta, 404 spikes, new-content first-appearance. Monthly — cluster performance, commercial click trend, enquiries + conversion rate (post-SEO-001), CTR on edited pages, competitor re-check vs `valueforvenues.co.uk`. Quarterly — organic→enquiry contribution, topic-area visibility, seasonal planning, strategy re-base on enquiry data. **Tools:** GSC = spine; GA4 (SEO-001) = sessions/conversions; one Looker Studio dashboard joining both with saved "Commercial pages" + "Commercial cluster" filters.

---

## Measurement Governance

**SEO Change Log (start now, before any Phase 3–5 deploy):** one row per change logged *before* deploy — date, change, URL(s), owner, hypothesis, baseline snapshot, validation windows, result. Primary diagnostic when metrics move; essential on a small/noisy site.
**Alert rules (first responder):** UK organic clicks −20% WoW (Analytics); coverage −10%/Valid drop (Technical); 404s +50% WoW (Technical); priority/commercial position drop >5 (Analytics→Content); schema errors (Technical); CWV regression once field source exists (Technical). Automate via GSC email alerts + a GA4 custom insight.

---

## Post-Launch Validation Plan

Windows: **0–48h** deploy correctness · **1–2 wk** crawl/index/early rank · **4–8 wk** clicks/impr/CTR/position/conversions vs baseline.

| Shipped change | 0–48h | 1–2 wk | 4–8 wk | Baseline to compare |
|---|---|---|---|---|
| **SEO-001** GA4 + enquiry/CTA events | GA4 receiving; `enquiry_submit` + `cta_click` fire in DebugView/Preview; consent gating works | Events accrue, no dupes, organic attributing | Enquiry baseline established → set targets | Enquiry baseline = **`unavailable`** (this creates it) |
| **SEO-004** commercial pages indexed | URL Inspection 200/indexable/correct render | Exit "not indexed"; appear in query data | Cluster impressions then clicks | 0 indexed / 49 commercial clicks / 3,236 cluster impr |
| **SEO-002** guide→service bridges | Bridge renders; links resolve; click event fires | Links crawled (GSC links report) | Guide→service click events; commercial click trend | 49 commercial clicks/12 mo |
| **SEO-003** strengthen `/services`+ pages | Live, 200, metadata/schema/CLAIMS correct | Indexed; appear for commercial queries | Cluster CTR/position vs baseline | Cluster CTR 0.062%, pos ~18.5 |
| **SEO-006** quick-win guide position pass | Edits live; titles/meta updated; no regressions | Re-crawl; position check | Toward top-10; CTR/clicks vs baseline | Per-page rows, baseline §4 |
| **SEO-007** commercial metadata/CTA sharpen | Title/meta length OK; CLAIMS-accurate | Re-crawl picks up snippet | CTR delta on edited pages | Page CTR at edit time |

---

## Data Gaps

1. **GA4 + enquiry tracking absent end-to-end — SEO-001, the gating prerequisite.** GTM scaffolded (`src/components/GoogleTagManager.tsx`) but (a) loads only if `NEXT_PUBLIC_GTM_ID` set (`.env.example:13` placeholder), (b) **no conversion events** anywhere (only `dataLayer.push` is GTM bootstrap `GoogleTagManager.tsx:21`; contact-form success `contact-form.tsx:84` and ~15 WhatsApp/`tel:`/`mailto:` CTAs push nothing), (c) contact action only `console.log`s (`contact.ts:30`). Until shipped, the lead goal is unmeasurable.
2. **No period-over-period GSC** → decline detection `unavailable`.
3. **No GA4 session/engagement** → bounce/time/conversion-rate `unavailable`.
4. **No PSI/CrUX** → Core Web Vitals field data `unavailable` (crawl lab signals: 3 oversized images, 29 multiple-H1 only).
5. **No Ahrefs/Semrush** → volume/difficulty/backlinks/DA `unavailable`; new terms "validate via keyword-plan / GKP".
6. **No AI-referral data** → AI contribution `unavailable`; manual citation log only, confidence Low.

```json
{ "findings": [
  { "finding": "No end-to-end enquiry conversion tracking exists; lead-gen goal unmeasurable (SEO-001). GTM scaffolded but loads only if NEXT_PUBLIC_GTM_ID set; no conversion events for contact form or WhatsApp/tel/mailto CTAs; contact action only console.logs.", "evidence": "src/components/GoogleTagManager.tsx:5,21; .env.example:13 placeholder GTM-XXXXXXX; src/components/forms/contact-form.tsx:84 success pushes no event; src/app/actions/contact.ts:30 console.log only; ~15 WhatsApp/tel/mailto CTAs (Navigation/StickyEngagementBar/CTASection/PackageCTA/BlogPost) untracked", "source": "codebase grep + manual inspection; GA4 not supplied (data-access.md)", "dataStatus": "Known", "severity": "Critical", "confidence": "High", "impactArea": "conversion", "owner": "Analytics", "effort": "Medium", "dependencies": "GA4 + GTM container access; dev", "fixType": "Analytics/governance fix", "recommendedAction": "Create GA4 property; set real NEXT_PUBLIC_GTM_ID in prod; push enquiry_submit on contact-form success and persist server-side (replace console.log); add shared cta_click tracker {method:whatsapp|phone|email|contact}; create GA4 event tags in GTM and mark enquiry_submit a key event; keep Consent Mode v2.", "validationStep": "GTM Preview + GA4 DebugView show enquiry_submit and cta_click firing with method param and respecting consent; events accrue without dupes; organic enquiry baseline established 4-8 wk", "riskRollback": "Low — additive client events + env var; no indexation change. Push method/flags only, never PII." },
  { "finding": "Entire commercial layer is not indexed (caps the lead funnel): /pub-marketing-agency, /pub-marketing, 6 /pub-marketing-* regions, 4 /ways-to-work/* packages, /capabilities, /compete-with-pub-chains in Discovered-not-indexed. Contradicts Phase 1 assumption that not-indexed buckets are mostly subdomain noise.", "evidence": "evidence/gsc/orangejelly.co.uk-Coverage-Drilldown-2026-06-16 (5)/Table.csv (44 URLs) and (6)/Table.csv (30 URLs) are 100% orangejelly.co.uk marketing URLs, 0 subdomain/protocol noise", "source": "GSC Coverage drilldown Table.csv (Known)", "dataStatus": "Known", "severity": "Critical", "confidence": "High", "impactArea": "crawl/indexing", "owner": "Technical", "effort": "Medium", "dependencies": "Dev; Risk Register; Technical owns root-cause", "fixType": "Template/system fix", "recommendedAction": "Technical diagnose why pages aren't indexed (orphaned/thin/missing-from-sitemap/soft-noindex) and remediate via Risk Register; Analytics tracks them out of not-indexed buckets weekly. Commercial KPIs cannot move until they index.", "validationStep": "URL Inspection indexable+200; exit not-indexed in Coverage 1-2 wk; commercial impressions rise vs 3,236 baseline 4-8 wk", "riskRollback": "Diagnosis only; live indexation change routes via Risk Register" },
  { "finding": "Commercial-intent cluster earns 2 clicks from 3,236 impressions (CTR 0.062%) at weighted pos ~18.5; some already top-10 (instagram services for pubs 7.0, facebook services for pubs 6.1, fix my pub 5.7).", "evidence": "evidence/search-queries.csv / GSC 12 months/Queries.csv: 43 intent-classified commercial queries; pub marketing 666i pos22.3 0c; pub marketing agency 304i pos19.6 0c; instagram services for pubs 256i pos7.0 0c", "source": "GSC Queries 12-mo intent-classified (Known); top-701 subset, long tail truncated by GSC", "dataStatus": "Known", "severity": "High", "confidence": "High", "impactArea": "conversion", "owner": "Content", "effort": "Large", "dependencies": "Indexation (SEO-004) first; Content/Copywriting; CLAIMS.md", "fixType": "Template/system fix", "recommendedAction": "After indexing, strengthen /services + intent-matched service pages to answer these queries; sharpen commercial metadata/CTAs with CLAIMS-approved proof to lift CTR; prioritise already-top-10 named-channel terms.", "validationStep": "Cluster CTR > 0.062% and weighted position improving on the 43-query set at 4-8 wk", "riskRollback": "Content/metadata only; revert copy. No indexation change without Risk Register." },
  { "finding": "summer-pub-event-ideas is the largest impression pool (7,572 impr) stuck at pos 15.1 / CTR 1.27% — top-10 is the click threshold.", "evidence": "GSC 12 months/Pages.csv: /licensees-guide/summer-pub-event-ideas 96c 7,572i pos 15.1", "source": "GSC Pages 12-mo (Known)", "dataStatus": "Known", "severity": "High", "confidence": "High", "impactArea": "SEO", "owner": "Content", "effort": "Medium", "dependencies": "Content", "fixType": "One-off page fix", "recommendedAction": "Refresh/expand depth + concise answer blocks to push pos 15.1 toward top-10; biggest single-page upside from existing impressions.", "validationStep": "Position toward top-10 and clicks/CTR rise vs 96c/1.27% at 4-8 wk", "riskRollback": "Content edit; revert revision." },
  { "finding": "Mobile out-performs desktop (pos 9.83 vs 13.61; CTR 1.87% vs 0.92%) — the better-converting surface for the lead goal.", "evidence": "GSC 12 months/Devices.csv: Mobile 280c/14,956i/1.87%/9.83; Desktop 230c/24,933i/0.92%/13.61", "source": "GSC Devices 12-mo (Known)", "dataStatus": "Known", "severity": "Medium", "confidence": "High", "impactArea": "conversion", "owner": "UX", "effort": "Small", "dependencies": "Phase 4 CRO/UX", "fixType": "Template/system fix", "recommendedAction": "Validate all conversion-path work (forms, WhatsApp CTA, guide→service bridges) mobile-first; ensure CTA tracking (SEO-001) splits by device in GA4.", "validationStep": "GA4 device-segmented enquiry rate available post-SEO-001; mobile path verified on real devices", "riskRollback": "None — analysis/measurement guidance." },
  { "finding": "No conversion/session/engagement/revenue baseline and no period-over-period GSC trend — decline detection and conversion rate unmeasurable until GA4 + change log exist.", "evidence": "data-access.md: GA4 not supplied; only 12-mo and 28-day GSC snapshots (no overlapping comparison window)", "source": "data-access.md + supplied evidence (Known gap)", "dataStatus": "unavailable", "severity": "Medium", "confidence": "High", "impactArea": "conversion", "owner": "Analytics", "effort": "Small", "dependencies": "GA4 (SEO-001); weekly GSC pull discipline", "fixType": "Analytics/governance fix", "recommendedAction": "Stand up the SEO Change Log now and a weekly GSC export of the commercial cluster + quick-win pages to build period-over-period baseline; add GA4 sessions/engagement once SEO-001 lands. Do not report any page as declining until comparison data exists.", "validationStep": "Change log populated before first Phase 3 deploy; two consecutive weekly GSC pulls stored", "riskRollback": "None — process/governance only." }
] }
```
