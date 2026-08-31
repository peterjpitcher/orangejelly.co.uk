# SEO Growth Roadmap — Orange Jelly (orangejelly.co.uk)

**Date:** 2026-06-16 (Europe/London)
**Prepared for:** Peter Pitcher, Orange Jelly Limited
**Target site:** https://www.orangejelly.co.uk
**Mode:** Full Site Overhaul · **Primary commercial goal:** more service enquiries / leads from UK licensees and pub operators
**Constraints enforced throughout:** `/CLAIMS.md` is the only source of quantified proof points (express as percentages, never raw numbers/multiples); British English; no "save/savings" wording; Greene King = **Tenant**, BII = **Member**; no live indexation/canonical/redirect/robots/schema/GBP change without explicit user sign-off (see Risk Register).

---

## Data Access & Limitations

**Mandatory section.** Every figure below is labelled by source and status. No keyword volumes, traffic estimates, rankings, conversion rates, backlink counts, domain authority, or Core Web Vitals are invented; where a source was unavailable it is stated and confidence is lowered.

| Data source | Available? | Date range | Used for | Limitations |
|-------------|-----------|-----------|----------|-------------|
| Google Search Console | **Yes** (first-party) | 12-month + 28-day snapshots; Coverage 2026-06-16 | UK demand, impressions, clicks, position, CTR, indexation/coverage | Two snapshots only — **no overlapping period-over-period window**, so trend/decline detection is `unavailable`. Queries export has no page column (701-query cap; long tail truncated). |
| GA4 / analytics | **No** (not supplied) | — | — | No session, engagement, bounce, conversion, enquiry, or revenue baseline exists. **Every commercial-outcome target is provisional until enquiry tracking exists (SEO-001).** GTM container is wired into the page and CSP whitelists GA/GTM/Clarity, so infrastructure exists — but no conversion events fire. |
| Rank tracking / SEO tool (Ahrefs/Semrush/Moz) | **No** | — | — | No keyword volume, difficulty, backlink, or third-party authority (DA/DR/AS) figure is asserted. New-term targets are marked "validate via keyword-plan / GKP". |
| Google Keyword Planner (GKP) | **No** | — | — | Net-new pages (family-events; FB/IG un-redirect; regional expansion) are **gated on GKP volume validation** before build. |
| PageSpeed Insights / CrUX | **No** | — | — | Core Web Vitals (field + lab) `unavailable`. CWV is sized for measurement (SEO-018), never scored or guessed. |
| Live site fetch + `collect-site-evidence.py` | **Yes** | crawl 2026-06-16 06:56 UTC; 50 of 140 sitemap URLs | Status codes, metadata, canonicals, JSON-LD, robots, sitemap, internal links | 50-page sample (cap 50, depth 4) — absolute counts (e.g. "29 multiple-H1") are *of the sample*; template root causes verified site-wide in code + live fetch. |
| Codebase access | **Yes** (full) | this repo, 2026-06-16 | Templates, routing, schema generation, server actions, effort/risk feasibility | Known. Effort/risk scores are anchored to actual `file:line` inspection, not guessed. |

**How the gaps shape this roadmap:** the GA4 gap means the #1 KPI (enquiries) has no baseline — so **establishing tracking is the first ticket and the gate on proving every commercial claim**. The GKP gap means three net-new content plays sit in Monitor until volumes are validated. The CWV gap means no performance ticket is scored as a known regression — only as measurement.

---

## Evidence Summary

| Evidence file/source | What it covers | Confidence |
|----------------------|----------------|-----------|
| `evidence/gsc/GSC 12 months/` + `28 days/` (Queries 701, Pages 132, Devices, Countries) | UK demand, CTR, position by page/query/device — the baseline to beat | **High** (first-party) |
| `evidence/gsc/…Coverage…/` (Critical issues + 7 drilldown Table.csv) | Indexation state: 44 Discovered-not-indexed, 30 Crawled-not-indexed, 10 noindex, 7 redirect, 6×404, 6 robots-blocked, 2 dup-no-canonical | **High** (first-party) |
| `evidence/search-queries.csv` (intent-classified) | Commercial-cluster demand: 2,908–3,236 impr / 2 clicks across 43–57 commercial queries | **High** |
| `evidence/url-inventory.csv`, `page-metadata.csv`, `technical-signals.csv`, `internal-links.csv`, `schema.json`, `audit-summary.md` | Per-URL status, metadata, link graph, structured data (50-page crawl) | **High** for sampled pages; template patterns **High** (confirmed in code) |
| Codebase inspection (`file:line` throughout Phase 2–4 reports) | Contact-form defect, dual-H1 template, sitemap/410 conflict, orphaned pages, WhatsApp-only CTAs, Offer-price data, GTM wiring | **High** (Known) |
| Web search (June 2026) — `competitor-landscape.md`, `authority/report.md` | Competitor positioning, SERP presence, off-page authority | **Medium** (directional; no tool metrics) |
| GA4 / PSI / Ahrefs | — | **Unavailable** — not used to assert any number |

Where multiple agents independently reached the same finding (e.g. the commercial-layer indexation block flagged by Strategy, Technical, Analytics **and** UX; the contact-form defect flagged by UX, Copywriter **and** Web Developer), confidence is raised accordingly.

---

## Executive Summary

Orange Jelly already has the demand it needs: GSC shows licensees finding the site and Google already surfaces it for high-value commercial queries such as "pub marketing agency", "instagram services for pubs" (pos 7.0) and "fix my pub" (pos 5.7). The problem is **not traffic — it is a broken conversion path**. The single contact form does not deliver leads anywhere (the server action only `console.log`s the submission, then shows "Message sent successfully"); almost every CTA funnels to untracked WhatsApp; the commercial service pages that rank for buying intent are largely **not indexed**; and there is **no analytics to measure any of it**. Across 12 months the commercial cluster drew ~2,908–3,236 impressions and **2 clicks**, while ~458 informational clicks land on guides that barely bridge to a service.

The strategy is therefore **fix the funnel before chasing rankings**: (1) stand up enquiry tracking and make the contact form deliver leads; (2) get the commercial pages indexed and give them a real enquiry path; (3) bridge the informational authority the site already earns into intent-matched service offers. The codebase is template-driven, so the four highest-value fixes are low-effort/low-risk and fit ~2 days of dev. Meaningful, measurable lead lift should appear within the 6–8 week post-launch window once tracking and indexation land; ranking-led gains (position improvements, authority) compound over 3–6 months.

---

## Strategic Direction

### Business Goals and SEO Alignment
This is a lead-gen site, not a publisher. Success = **service enquiries**, not pageviews. The SEO programme is pointed entirely at: ranking for what licensees type *when they want help with their pub*, and converting that visit into a contact. The differentiator — a real working publican (The Anchor) with measured, `/CLAIMS.md`-approved results — is the wedge against both agencies and the brewery content hub.

### Where This Site Can Win
1. **Convert existing informational authority into enquiries (highest ROI, lowest effort, no new ranking).** The site ranks pos 7–16 for high-impression pub-operations questions; those visitors *are* the buyer. The win is the info→service bridge + a conversion layer that works.
2. **Capture the commercial cluster the site is already shown for (high value, medium effort).** "pub marketing agency", "marketing for pubs", named-channel "instagram/facebook/content/paid social for pubs", "fix my pub" — Google already surfaces OJ at pos 6–20; purpose-built, indexed, well-converting service pages move impressions into clicks and enquiries.
3. **Defend the four core informational clusters** (quiz, events, food, social) against the Greene King `valueforvenues.co.uk` hub with the real-publican, dated-results angle — out-credible, not out-publish.
4. **Local/regional service intent (medium value):** existing Kent/Oxfordshire pages + `pub business recovery services stockport` at pos 7.9 prove the play; a coherent, genuinely-differentiated regional system is realistic.

**Where the site cannot win head-on (de-prioritise):** broad head terms ("marketing agency"), high-competition national agency terms, and international traffic.

### Priority Framework
Everything below is ranked by `priority_score = (business_value × search_opportunity × current_performance_gap × confidence) / (effort + risk)` (1–5 inputs), then re-sequenced by **dependency** and **risk**. Two non-negotiable dependency rules override raw score: **(a) tracking before measurement** — nothing commercial is provable until SEO-001 lands; **(b) indexation before content that relies on it** — a service-page rewrite converts nothing while the page is out of the index. Commercial value beats vanity traffic in every tie.

### Competitive Position
- **Commercial cluster:** a crowded field of agencies (CJ Digital, Wired Media, Marketing For Pubs). OJ's wedge is **anti-agency positioning** — a real publican, fixed transparent pricing (from £375 + VAT), a 30-day action guarantee, measured results. Don't out-agency the agencies; be the credible non-agency choice and make the pages earn the clicks Google already gives.
- **Informational clusters:** the threat is the **Greene King** brewery hub out-resourcing OJ. OJ cannot out-publish a brewery; it can **out-credible** it with first-hand, dated, %-based results in a peer voice — and convert those readers (which the hub has no incentive to do for OJ). Greene King framing stays **Tenant**.
- **Off-page authority:** near-blank profile (no observed trade-press, directory, or review presence). Good news: no toxic-link risk; the whole job is *building*. The biggest authority weakness is self-inflicted and free to fix — a single `sameAs` entity link.

---

## Current Performance Baseline

### Organic Visibility
| Metric | Current (GSC, Known) | Industry Benchmark | Target (6 months) |
|--------|---------------------|-------------------|-------------------|
| UK organic clicks | 423 / 12 mo; **97 / 28 days** (~3× annualised run-rate) | `unavailable` (no tool) | Sustain the improved run-rate (health check, not the goal) |
| UK avg position | 13.78 (12 mo) → **11.93 (28 days)** | — | Priority commercial terms into top-10 |
| UK CTR | 1.63% (12 mo); 1.93% (28 days) | — | Lift commercial-cluster CTR off ~0.06–0.07% |
| Commercial-cluster CTR | **0.062–0.07%** (2 clicks / 2,908–3,236 impr) | — | Low single-digit % at current positions |
| Indexed priority commercial pages | **0 of the priority set** (Discovered/Crawled-not-indexed) | — | All priority commercial pages indexed |
| Service enquiries (the #1 KPI) | **Unavailable — no GA4** | — | Establish baseline (SEO-001), then set target after 1 month of data |

Mobile out-ranks and out-converts desktop (pos 9.83 / CTR 1.87% vs 13.61 / 0.92%) — **mobile is the commercial surface**; validate all conversion work mobile-first. UK ≈ 90% of clicks — optimise UK only.

### Top Performing Content (GSC Pages 12-mo, Known)
| Page | Clicks | Impressions | Position | Notes |
|------|-------:|------------:|---------:|-------|
| /licensees-guide/summer-pub-event-ideas | 96 | 7,572 | 15.1 | Largest impression pool on the site; top-10 is the click threshold |
| /licensees-guide/quiz-night-ideas | 76 | 4,348 | 11.8 | Cluster leader; carries the site |
| /licensees-guide/profitable-pub-food-menu-ideas | 67 | 4,479 | 7.4 | Best-ranked guide |
| /licensees-guide/social-media-strategy-for-pubs | 37 | 3,836 | 12.6 | Clearest info→commercial bridge candidate |

Conversion data for these pages is `unavailable` (no GA4).

### Underperforming Areas
- **Commercial pages:** 34 pages → ~49 clicks / 12 mo; the cluster is **impression-starved** because the pages are not indexed, not because demand or per-impression CTR is poor (commercial CTR 1.43% per impression is fine — there are almost no impressions).
- **Position 11–16 guides** with large impression pools (summer events, content-marketing 15.6, social 12.6, christmas 11.6, pub-refurbishment 14.7) sit just below the click threshold.
- **`event ideas for pubs`** query: 956 impr, **0 clicks**, pos 16.8 — no page in click range.

---

## URL Inventory Summary

Crawl sampled 50 of 140 sitemap URLs (status: 49×200, 1×410). Template root causes verified in code site-wide.

| Template type | URLs found (approx) | Sampled | Main issues |
|---------------|--------------------:|--------:|-------------|
| `/licensees-guide/` markdown guides (top-of-funnel engine) | ~90 | 39+ | **Dual-H1 template defect** (~97/106 files); generic non-intent-matched service bridge; several never-crawled (seasonal) and 30 Crawled-not-indexed |
| Commercial service pages (`/services` hub + 5 channel pages, `/pub-marketing-agency`, `/fix-my-pub`, `/pub-rescue`, `/empty-pub-solutions`, `/quiet-midweek-solutions`, `/compete-with-pub-chains`, `/capabilities`) | ~20 | ~6 | **Not indexed**; WhatsApp-only CTA (no form); thin-for-SERP body; 2 FB/IG channel pages are redirect stubs; five competing "hire us" hubs |
| Commercial hub `/ways-to-work` + 4 package pages | 5 | 2 | In not-indexed backlog (confirm via URL Inspection); missing priced Offer anchor; title 65 chars |
| Regional location pages (`/pub-marketing-{county}` ×9) | 9 | 2 | 7/9 not indexed; thin; under-linked |
| Homepage / contact / about / results | ~5 | 4 | **Contact form delivers nowhere (Critical)**; homepage title 61 chars |
| Out-of-scope subdomain noise (`cheersai.`, `management.`) + protocol/host duplicates | — | — | Pollute Coverage; likely a Domain-property artefact, not a marketing-site problem |
| Retired (410) | 1 | 1 | `cash-flow-crisis-breaking-cycle` is 410 **but advertised in the sitemap** — self-conflicting |

---

## Key Findings by Discipline

### Technical SEO
**Overall health:** Needs work — a few high-leverage defects on an otherwise strong, well-structured codebase (centralised metadata, server-side rendering, valid schema foundation, strong security headers, GTM already wired).

**Critical issues:**
- **Two commercial pages are orphaned** (`/pub-marketing-agency`, `/compete-with-pub-chains`) — 0 internal links → "Discovered, currently not indexed", never fetched (`1970-01-01`). `/pub-marketing-agency` targets the highest-value commercial query (`pub marketing agency` 304 impr, pos 19.6, 0 clicks). Direct lead blocker. (Technical C-3; corroborated by Analytics, UX.)
- **Dual-H1 template defect on ~97 of 106 guides** — hero `<h1>` plus the markdown body's leading `# Title` rendered as a second `<h1>`, diluting the topic signal on the exact pages that carry the site's visibility. One `preprocess.ts` edit fixes all of them; **no TableOfContents dependency** (that component is dead code — verified by Web Developer). (Technical C-1.)
- **Sitemap advertises a 410 URL** (`cash-flow-crisis-breaking-cycle`) — middleware says "gone", the markdown says "published", the sitemap says "index this". Self-conflicting crawl signal. (Technical C-2.)
- **`/services` 308-redirects to `/ways-to-work`** (the real hub) — confirm the hub + 4 package pages are indexed via URL Inspection; repoint 4 stale `/services` guide links. (Technical C-4.)

**Key opportunities:** internal-link + sitemap-freshen the never-crawled seasonal guides; correct the `Offer` price data (component already emits Offer — it's a data edit to the packages-from anchor, not a schema build); real `lastModified` in the sitemap; verify GSC property type so ~half the not-indexed list (subdomain/protocol noise) is correctly read as expected, not a problem. **CWV is `unavailable` — run PSI/CrUX before any performance work.**

### Content & Keywords
**Content coverage:** Strong informational engine; commercial layer more complete than first assumed but thin-for-SERP and not converting.

**Top content gaps:**
| Missing/weak topic | Target keywords | Competitor coverage | Priority | Estimated impact |
|--------------------|-----------------|---------------------|----------|------------------|
| Named-channel service pages not naming the channel | "instagram services for pubs" (pos 7.0), "facebook services for pubs" (pos 6.1) | Mixed; less defended | High | Highest CTR-recovery move on the site (inherited top-of-page-one rankings landing on generic content) |
| Family & kids events pillar (net-new) | "kids craft pop up events for pubs", "events to attract families to pubs" (pos 20–37, ~1,000+ impr) | Generic listicles | Medium | The one validated net-new gap — **build only after GKP volume validation** |
| Intent-matched guide→service bridge | n/a (conversion, not ranking) | Competitors don't bridge | High | Converts ~458 informational clicks/12 mo; no new ranking needed |

**Cannibalisation issues:** events cluster (CAN-1: 6 pages, "event ideas for pubs" 956 impr/0c shows no clear winner); rescue/turnaround (CAN-3: `/fix-my-pub` vs `/pub-rescue` vs `/empty-pub-solutions` vs `/quiet-midweek-solutions`); pub-marketing hub overlap (CAN-5: `/pub-marketing` vs `/pub-marketing-agency` vs `/services`). Each consolidation is a **live indexation change → Risk Register**.

### Authority & Backlinks
**Authority level:** Weak off-page relative to competitors (directionally — no backlink tool). Almost all authority is on-page/topical.
**Authority gap summary:** the only *wide* gap is the competitive commercial head terms — and the strategy routes round it (convert first). Everywhere else the gap is narrow and closable with ethical work, or is a *credibility* gap (winnable with first-hand results) not an authority gap. The single Known fixable health issue: the entity graph publishes one `sameAs` link only. No toxic links observed (cannot confirm without a tool → `unavailable`).

### UX & Conversion
**Landing page quality:** Needs improvement — the conversion layer fails in three compounding ways.
**Key conversion issues:**
- **The contact form delivers leads nowhere** — `actions/contact.ts:30` is `console.log` only; no email/CRM/DB write; user sees success. **The single most damaging defect on the site; it invalidates the entire enquiry funnel.** (Critical.)
- **Almost every CTA funnels to WhatsApp** (high-friction for a sceptical first-time visitor; no record if not sent; entirely untracked). The good pattern (`PackageCTA`: WhatsApp **or** enquiry form + guarantee) exists but is underused.
- **Service pages that rank for buying intent are WhatsApp-only** (no form, no `/contact` link); the named-channel buyer-intent URLs 308-redirect to a WhatsApp-only template.
- **Destination chaos:** five competing commercial hubs; nav surfaces jargon ("Ways to Work", "Capabilities") but never "Services"; `/contact` linked from only ~8 places.
- **Mobile guides fire three competing bottom-anchored interrupts** on the exact pages that earn the most clicks.

### Content Quality
**Editorial assessment:** High quality on guides; metadata recently rebuilt and genuinely good (titles 46–55 chars, descriptions carrying approved CLAIMS). **Do not rewrite working guide metadata.** The real copy levers are commercial-page body copy (answer block, full proof, transparent price, anti-agency, single CTA) and the topic-matched bridge. Minor hygiene: 5 commercial meta descriptions >160 chars, 2 titles >60 chars, one stale "2025" body heading.

---

## Scored SEO Backlog

Every accepted recommendation, scored by the canonical formula `priority_score = (business_value × search_opportunity × current_performance_gap × confidence) / (effort + risk)` (1–5 inputs, denominator floored at 1) via `scripts/score-opportunities.py`. Full inputs and the reproducible output are in `backlog-inputs.json` and `scored-backlog.csv`. Ranked by score, then re-sequenced by dependency and risk (see Roadmap). Each row maps to an Implementation Ticket of the same ID.

| ID | Action | Category | Score | Impact | Effort | Risk | Owner | Status | Source |
|----|--------|----------|------:|--------|--------|------|-------|--------|--------|
| SEO-001 | GA4 + enquiry/CTA conversion tracking; import GSC; define funnel & baseline | Analytics | 100.00 | H | M | L | Analytics | **Do now** | analytics F1; web-dev REC-20 |
| SEO-002 | Wire contact form to deliver leads (Resend) + remove PII log + fire enquiry_submit | UX | 75.00 | H | M | L | Technical | **Do now** | ux finding 1; web-dev REC-1; copy 8 |
| SEO-003 | Diagnose & fix indexation of the commercial layer (internal links + URL Inspection) | Technical | 125.00 | H | L | L | Technical | **Do now** | technical C-3/C-4; analytics 2; ux 8 |
| SEO-004 | Dual-H1 template fix in `preprocess.ts` (fixes ~97 guides) | Technical | 85.33 | H | L | L | Technical | **Do now** | technical C-1; web-dev REC-3 |
| SEO-005 | Cluster-keyed guide→service bridge (dual CTA, peer voice, one CLAIM) | Content | 80.00 | H | M | L | Content | **Do now** | ux 5; copy 3; content brief 2 |
| SEO-006 | Dual WhatsApp+enquiry block + guarantee on `PubServiceLandingPage` | UX | 85.33 | H | L | L | UX | **Do now** | ux finding 2; web-dev REC-6 |
| SEO-007 | Confirm `/ways-to-work` (+4 packages) indexed; repoint 4 stale `/services` links | Technical | 128.00 | H | L | L | Technical | **Do now** | technical C-4; web-dev REC-7 |
| SEO-008 | Internal-link + sitemap-freshen never-crawled seasonal guides | Technical | 64.00 | M | L | L | Technical | Schedule | technical fix #5; opp-map D |
| SEO-009 | Add "Services" to primary nav; pick one canonical hub direction | UX | 48.00 | M | L | L | UX | Schedule | ux 6; web-dev REC-10a |
| SEO-010 | Commercial body-copy rewrite + named-channel H2s (gated on indexation) | Content | 100.00 | H | M | L | Content | Schedule | copy 1 & 2; analytics 3 |
| SEO-011 | Position-improvement content pass on 6 high-impression guides | Content | 64.00 | M | M | L | Content | Schedule | opp-map C; copy 6 |
| SEO-012 | Trim 5 meta descriptions >160 + 2 titles >60; add length lint | Content | 67.50 | M | L | L | Content | Schedule | copy 4 & 5; web-dev REC-11 |
| SEO-013 | De-duplicate mobile interrupt stack on guides | UX | 20.25 | M | L | L | UX | Schedule | ux 7; web-dev REC-9 |
| SEO-014 | Single-source GONE list so sitemap excludes the 410 URL | Technical | 30.00 | M | L | L | Technical | Schedule | technical C-2; web-dev REC-4 |
| SEO-015 | Correct `Offer` price data → packages-from £375+VAT (CLAIMS) | Technical | 36.00 | M | L | L | Technical | Schedule | technical fix #6; web-dev REC-12 |
| SEO-016 | Real `lastModified` in sitemap for static/marketing pages | Technical | 15.00 | L | L | L | Technical | Schedule | technical fix #7; web-dev REC-13 |
| SEO-017 | Rebuild entity graph (`sameAs`/`knowsAbout`/founder Person) | Authority | 36.00 | M | L | L | Authority | Schedule | authority AUTH-01 |
| SEO-018 | PSI + CrUX (mobile-first) baseline for 3 URLs | Analytics | 24.00 | L | L | L | Analytics | Schedule | technical fix #9; web-dev REC-21 |
| SEO-019 | Backlink-tool baseline pull (AUTH-03) | Authority | 24.00 | L | L | L | Authority | Schedule | authority AUTH-03 |
| SEO-020 | Verify GSC property type; filter subdomain/protocol noise from reporting | Analytics | 15.00 | L | L | L | Analytics | Monitor | technical fix #8 |
| SEO-021 | Compress 3 oversized images; add HSTS `preload` | Technical | 16.00 | L | L | L | Technical | Monitor | technical fix #10; web-dev REC-22 |
| SEO-022 | AI answer-blocks + author signals on 4 cluster-leader guides | Content | 27.00 | M | L | L | Content | Monitor | opp-map F; AUTH-06 |
| SEO-023 | Consolidate events cannibalisation (CAN-1) | Content | 13.50 | M | M | M | Content | Monitor | content CAN-1 |
| SEO-024 | Consolidate rescue cluster → canonical `/fix-my-pub` | Content | 10.12 | M | L | H | Content | Monitor | content CAN-3; copy 7; web-dev REC-15 |
| SEO-025 | FB/IG redirect-stub decision (prefer H2s over un-redirect) | Content | 27.43 | H | M | H | Content | Monitor | content brief 1; copy 2; web-dev REC-16 |
| SEO-026 | Coherent UK regional location-page system | Authority | 18.00 | M | H | L | Authority | Monitor | strategy P4; web-dev REC-18 |
| SEO-027 | Family/kids events pillar (net-new, GKP-gated) | Content | 14.40 | M | M | L | Content | Monitor | content brief 4; copy 9 |
| SEO-028 | Claim & complete Orange Jelly Google Business Profile | Authority | 27.00 | M | L | L | Authority | Monitor | authority AUTH-02 |
| SEO-029 | Hub consolidation (5 hubs → 1, 301 map) | Technical | 10.12 | M | H | H | Technical | Monitor | ux 6; web-dev REC-10b |
| SEO-030 | Earned-authority programme (GK case study, Morning Advertiser, BII, data asset, podcasts) | Authority | 18.00 | M | H | L | Authority | Monitor | authority AUTH-04/05/07/08/09/10 |

**Sequencing note (score vs dependency):** SEO-007 (128) and SEO-003 (125) score highest, but **SEO-001 (100) executes first** — it is the dependency gate: without enquiry tracking, the lead lift from every other ticket is unmeasurable (operating-model rule "tracking before measurement"). SEO-010 scores 100 but is correctly **Scheduled**, not Do-now, because it is gated on indexation (SEO-003/SEO-007) landing first — copy converts nothing on an unindexed page. These two overrides are exactly the "rank by score, then dependencies, then risk" rule applied.

---

## The Roadmap

### Tier 1: Immediate Fixes (This Week)

The conversion-and-discovery core. Ship as Web Developer's **PR-A** (lead capture + tracking) and **PR-B/PR-C** (templates). All Effort ≤3, Risk ≤2.

| # | Action | Category | Impact | Effort | Dependencies | Owner |
|---|--------|----------|--------|--------|--------------|-------|
| SEO-001 | GA4 + enquiry/CTA tracking (the gate) | Analytics | High | M | GA4+GTM config (GTM already loaded); dev | Analytics |
| SEO-002 | Contact form delivers leads (Resend) + remove PII log | UX/Technical | High | M | resend dep + RESEND_API_KEY; GDPR; SEO-001 | Technical |
| SEO-007 | Confirm `/ways-to-work` indexed; repoint 4 stale links | Technical | High | S | GSC access; dev | Technical |
| SEO-003 | Index the commercial layer (internal links + URL Inspection) | Technical | High | S–M | dev; Risk Register if nav change | Technical |
| SEO-004 | Dual-H1 template fix (~97 guides) | Technical | High | S | dev only (no TOC dep) | Technical |
| SEO-006 | Dual WhatsApp+enquiry CTA on service template | UX | High | S | reuse PackageCTA; SEO-003 | UX |
| SEO-005 | Cluster-keyed guide→service bridge | Content | High | M | dev map; CLAIMS; SEO-002 | Content |

### Tier 2: Short-Term Wins (Next 4–8 Weeks)

Measurable gains once Tier 1 has shipped and indexation is confirmed. Web Developer **PR-D** (nav + hygiene) and **PR-E** (content body, gated on indexing).

| # | Action | Category | Impact | Effort | Dependencies | Owner |
|---|--------|----------|--------|--------|--------------|-------|
| SEO-010 | Commercial body-copy rewrite + named-channel H2s | Content | High | M | **gated on SEO-003/SEO-007**; CLAIMS; SEO-006 | Content |
| SEO-012 | Trim 5 meta descriptions + 2 titles; length lint | Content | Medium | S | dev lint; seo-overrides.ts | Content |
| SEO-009 | Add "Services" to nav; choose canonical hub direction | UX | Medium | S | navigation.json; Content | UX |
| SEO-008 | Internal-link + sitemap-freshen never-crawled seasonal guides | Technical | Medium | S | dev/content | Technical |
| SEO-011 | Position-improvement pass on 6 high-impression guides | Content | Medium | M | **depends on SEO-004**; content | Content |
| SEO-013 | De-duplicate mobile interrupt stack on guides | UX | Medium | S | dev; verify at 375px | UX |
| SEO-018 | PSI + CrUX baseline (mobile-first) | Analytics | Low | S | PSI access | Analytics |
| SEO-021 | Compress 3 oversized images; HSTS preload | Technical | Low | S | dev | Technical |

### Tier 3: Medium-Term Growth (1–3 Months)

Structural improvements that compound. Several route through the Risk Register.

| # | Action | Category | Impact | Effort | Dependencies | Owner |
|---|--------|----------|--------|--------|--------------|-------|
| SEO-014 | Single-source GONE list → sitemap excludes 410 | Technical | Medium | S | **Risk Register (sitemap)** | Technical |
| SEO-015 | Correct `Offer` price data to CLAIMS anchors | Technical | Medium | S | **Risk Register (schema)**; Content figures | Technical |
| SEO-016 | Real sitemap `lastModified` | Technical | Low | S | **Risk Register (sitemap)** | Technical |
| SEO-017 | Rebuild entity graph (`sameAs`/`knowsAbout`/Person) | Authority | Medium | S | **Risk Register (schema)**; verifiable profiles | Authority |
| SEO-019 | Backlink-tool baseline pull | Authority | Low | S | tool access | Authority |
| SEO-022 | AI answer-blocks + author signals (by-product of SEO-011) | Content | Medium | S | content; no AI-referral data (directional) | Content |
| SEO-028 | Claim Orange Jelly Google Business Profile | Authority | Medium | S | **Risk Register (GBP)** | Authority |
| SEO-020 | Verify GSC property type; filter noise from reporting | Analytics | Low | S | GSC admin | Analytics |

### Tier 4: Long-Term Strategic Bets (3–6 Months)

Larger plays around category ownership, architecture, and authority. **GKP-gated** and/or **Risk-Register-gated** — each ships as its own PR with monitoring.

| # | Action | Category | Expected Impact | Dependencies |
|---|--------|----------|-----------------|--------------|
| SEO-025 | FB/IG redirect-stub decision (prefer H2s; un-redirect only if GKP justifies) | Content | High (pos 6–7 demand, 0 clicks today) | **GKP first; Risk Register** (highest-risk:payoff item) |
| SEO-024 | Consolidate rescue cluster → canonical `/fix-my-pub` | Content | Medium (de-cannibalise; concentrate equity) | **Risk Register (301s)**; GSC monitoring |
| SEO-023 | Consolidate events cannibalisation (CAN-1) | Content | Medium | **Risk Register (redirect of merged page)** |
| SEO-029 | Hub consolidation (5 → 1 canonical) | Technical | Medium (clarity + equity concentration) | **Risk Register (301s)**; gated on SEO-009 decision; monitoring |
| SEO-026 | Coherent UK regional location-page system | Authority | Medium (local service-intent lead source) | content; **GKP for expansion**; SEO-028 |
| SEO-027 | Family/kids events pillar (net-new) | Content | Medium (~1,000+ impr at pos 20–37) | **GKP volume validation before build** |
| SEO-030 | Earned-authority programme (GK case study, Morning Advertiser, BII, "From The Anchor" data asset, podcasts) | Authority | Medium, compounding | outreach; CLAIMS (%-only, **Tenant** framing); SEO-019 baseline |

---

## Implementation Tickets

Tickets in execution order (dependency-sequenced). Each is self-contained, with acceptance criteria, validation, and risk/rollback. Live indexation/canonical/redirect/robots/schema/sitemap/GBP changes are flagged **[Risk Register — requires approval]**.

### SEO-001: GA4 + enquiry/CTA conversion tracking (the measurement gate)

Owner: Analytics · Status: Do now · Priority score: 100.00
Source evidence: `analytics/report.md` Data Gap 1 + finding 1; `web-developer-report.md` REC-20; UX finding 4; Technical CSP note (`middleware.ts:61-65` whitelists GTM/GA/Clarity; `layout.tsx:194` mounts GoogleTagManager).

Problem: GTM is wired into the page but **no conversion events fire**. Contact-form success pushes nothing; ~15 WhatsApp/`tel:`/`mailto:` CTAs push nothing; the contact action only `console.log`s. The lead-gen goal is unmeasurable.

Why it matters: enquiries are the #1 KPI and have **no baseline**. Until this lands, the lead lift from every other ticket is unprovable. This is the dependency gate for the whole roadmap.

Implementation notes: create/connect the GA4 property; set the real `NEXT_PUBLIC_GTM_ID` in Vercel prod (`.env.example:13` is a placeholder). Wire a single `cta_click {method: whatsapp|phone|email|form}` push into the shared `Button`/`WhatsAppButton` components (not per-CTA) and `enquiry_submit` on contact-form success. Create matching GA4 event tags in GTM; mark `enquiry_submit` a key event. Keep Consent Mode v2. Push method/flags only — **never PII**.

Acceptance criteria:
- [ ] GA4 receiving data; `enquiry_submit` and `cta_click` (with `method`) fire in GTM Preview + GA4 DebugView, respecting consent.
- [ ] Events accrue without duplicates; organic attribution visible; device split available.
- [ ] An enquiry baseline is captured to set targets after one month.

Validation: 0–48h — events fire in DebugView. 1–2wk — events accrue, no dupes, organic attributing. 6–8wk — enquiry baseline established.
Risk and rollback: Low — additive client events + env var; no indexation change. Rollback = remove the dataLayer pushes. No new PII storage.

### SEO-002: Wire the contact form to actually deliver leads

Owner: Technical (UX-driven) · Status: Do now · Priority score: 75.00
Source evidence: `ux-cro/report.md` finding 1 (Critical); `web-developer-report.md` REC-1; `copywriter-report.md` finding 8. `src/app/actions/contact.ts:30` (`console.log` only); `contact-form.tsx:91-112` shows success UI regardless.

Problem: the only email-capture path on the site **silently discards every enquiry** while telling the licensee "Message sent successfully".

Why it matters: this single defect invalidates the entire enquiry funnel — the commercial goal of the whole engagement. Every other conversion improvement is wasted until it is fixed.

Implementation notes: add `resend`; add `RESEND_API_KEY` to `.env.example` + Vercel. In `submitContactForm`, after validation `await resend.emails.send(...)` to Peter; on success fire `enquiry_submit` (SEO-001). **Delete the existing `console.log` of name/email (PII-in-logs) in the same PR.** PII/GDPR (workspace stop-condition): email = delivery, not a new PII store; **email-only for v1** — a DB persist would be a new PII store needing explicit approval.

Acceptance criteria:
- [ ] A test enquiry on production is received by email by Peter.
- [ ] `enquiry_submit` fires in GA4 DebugView from the contact page.
- [ ] No PII is written to logs.

Validation: 0–48h — test enquiry delivered, event fires, no PII in logs. 1–2wk — real enquiries arriving. 6–8wk — form-capture share of enquiries measurable.
Risk and rollback: Low — additive delivery path; revert the action if delivery fails. Handle PII per GDPR; no new PII logging without approval.

### SEO-007: Confirm `/ways-to-work` indexed; repoint stale `/services` links

Owner: Technical · Status: Do now · Priority score: 128.00
Source evidence: Technical C-4 (`next.config.js:20-24` `/services` 308 → `/ways-to-work`; hub live 200, 1 H1, valid schema, 130 inbound links; GSC Drilldown 5 lists it at `1970-01-01`); `web-developer-report.md` REC-7. 4 guides still link to old `/services` with commercial anchors.

Problem: the live commercial hub appears in the not-indexed backlog (likely a stale export pre-dating the redirect); 4 guides waste link equity on a redirect hop.

Why it matters: the hub must be in the index to earn the commercial impressions; dropping the redirect hop passes equity directly to the live page.

Implementation notes: run GSC URL Inspection (live test) on `/ways-to-work` and the 4 `/ways-to-work/*` package pages; request indexing if not indexed. Repoint the 4 guide links (`how-to-run-successful-pub-events`, `email-marketing-pub-retention`, `quiz-night-ideas`, `menu-engineering-lift-average-spend`) from `/services` to `/ways-to-work`.

Acceptance criteria:
- [ ] URL Inspection reports `/ways-to-work` + 4 packages indexable/indexed.
- [ ] Re-crawl shows 0 internal links to `/services`.

Validation: 0–48h — links updated, URL Inspection submitted. 1–2wk — pages exit not-indexed. 6–8wk — commercial impressions begin to appear for these URLs.
Risk and rollback: Low — links revert trivially; no live redirect change. (URL Inspection is confirmation only.)

### SEO-003: Diagnose & fix indexation of the commercial layer

Owner: Technical · Status: Do now · Priority score: 125.00
Source evidence: Technical C-3 (`internal-links.csv`: 0 inbound to `/pub-marketing-agency`, `/compete-with-pub-chains`; both live 200, index,follow, in sitemap, valid schema; GSC Drilldown 5 `1970-01-01`); Analytics finding 2 (Coverage drilldowns 5 & 6 are 100% marketing URLs, 0 subdomain noise); UX finding 8; `search-queries.csv` (`pub marketing agency` 304 impr pos 19.6 0c).

Problem: the commercial pages that should capture buying intent are orphaned/under-discovered and **not indexed** — capping the lead funnel at ~0.

Why it matters: the cluster cannot earn its ~2,908–3,236 impressions while absent from the index. This is the structural reason demand isn't converting.

Implementation notes: add intent-matched internal links to `/pub-marketing-agency`, `/compete-with-pub-chains`, `/capabilities`, the regional `/pub-marketing-*` pages and `/ways-to-work/*` packages from `/ways-to-work`, `/capabilities`, the guide bridge (SEO-005) and nav (SEO-009); then GSC URL Inspection → request indexing. Root cause is under-discovery, not a directive block — verify no soft-noindex/thin signal remains. Distinguish from the correctly-excluded subdomain noise (see SEO-020). **[Risk Register — requires approval if any nav/redirect change is involved.]**

Acceptance criteria:
- [ ] ≥3 inbound internal links to each previously-orphaned commercial page (re-crawl).
- [ ] URL Inspection shows the priority commercial pages submitted/indexable.

Validation: 0–48h — links live, inspection submitted. 1–2wk — pages exit "not indexed" in Coverage. 6–8wk — cluster impressions rise vs the 3,236 baseline.
Risk and rollback: Low for the internal-linking (additive — remove links to revert). Any live indexation/nav change routes via Risk Register.

### SEO-004: Dual-H1 template fix

Owner: Technical · Status: Do now · Priority score: 85.33
Source evidence: Technical C-1 (live `/quiz-night-ideas` h1 count = 2; `page.tsx:725` + `BlogCategoryHero.tsx:60` + `SeasonalHubHero.tsx:66`; 97/106 `content/blog/` files lead with `# `; `render.ts` converts to a second `<h1>`); `web-developer-report.md` REC-3 (TableOfContents is dead code → **no TOC dependency**; `rehype-slug` derives ids from heading text, level-independent; FAQ extractor keys off `## FAQs`).

Problem: every guide renders two `<h1>` tags, diluting the primary topic signal on the visibility-carrying content engine.

Why it matters: one template edit sharpens the topic signal on ~97 pages — the exact guides this roadmap wants to position-improve (SEO-011) and that AI engines parse.

Implementation notes: in `src/lib/markdown/preprocess.ts`, before return, downgrade the first leading top-level `# ` body line to `## ` (skip fenced code blocks — the function already tracks `inCodeBlock`). Keep the hero `<Heading level={1}>` as the page H1. Add a `preprocess.test.ts` case.

Acceptance criteria:
- [ ] Re-fetch 5 guides → exactly one `<h1>` (the hero).
- [ ] FAQ extraction and heading anchors unchanged; test passes.

Validation: 0–48h — re-fetch confirms single H1, TOC/FAQ intact. 1–2wk — re-crawl confirms across guides. 6–8wk — position check on target guides.
Risk and rollback: Low — additive string transform, no content loss; revert the preprocess change.

### SEO-006: Dual WhatsApp + enquiry CTA on the service template

Owner: UX · Status: Do now · Priority score: 85.33
Source evidence: `ux-cro/report.md` finding 2 + quick win 2 (`PubServiceLandingPage.tsx:204` WhatsApp-only); `web-developer-report.md` REC-6 (reuse existing `PackageCTA`).

Problem: the service pages that rank for buying intent offer WhatsApp as the only conversion action — no form, no `/contact` link.

Why it matters: gives every service page an email-capture path (the lower-friction bridge for a sceptical mid-research buyer). One template edit covers all service pages.

Implementation notes: replace the lone `WhatsAppButton` block (`PubServiceLandingPage.tsx:195-214`) with the existing `PackageCTA` (renders WhatsApp + "Send an enquiry" → `/contact` + reassurance). Keep the compliant CLAIMS strip (lines 158-191).

Acceptance criteria:
- [ ] Each `/services/*` page shows both a WhatsApp button and an enquiry-form link with the 30-day guarantee line.
- [ ] `cta_click {method}` + `enquiry_submit` attributable from these pages (post-SEO-001).

Validation: 0–48h — dual CTA renders on all service pages. 1–2wk — events firing. 6–8wk — service-page enquiries measurable.
Risk and rollback: None — additive CTA; revert the template change.

### SEO-005: Cluster-keyed guide→service bridge

Owner: Content (dev-supported) · Status: Do now · Priority score: 80.00
Source evidence: `ux-cro/report.md` finding 5 (only 27/106 guides reference any service link); `copywriter-report.md` finding 3 (`getCategoryCTA()` always → `/ways-to-work`); content-strategy brief 2; `web-developer-report.md` REC-5 (one code map keyed by `categorySlug` covers all 106 guides). `internal-links.csv` shows ~38 evenly-distributed boilerplate links, not contextual.

Problem: the guide end-CTA is generic and not intent-matched, so the site's informational authority is barely bridged to enquiries.

Why it matters: converts the ~458 informational clicks/12 mo the site already earns — the highest-ROI commercial lever, requiring **no new ranking**.

Implementation notes: extend `getCategoryCTA()` → `{heading, body, href, anchorText}` keyed by `categorySlug`: events→events service; social/marketing→`/services/social-media-marketing-for-pubs`; content→`/services/content-creation-for-pubs`; turnaround/empty/quiet→`/fix-my-pub`; compete→`/compete-with-pub-chains`. Replace the hardcoded `/ways-to-work` button (`BlogPost.tsx:224`) with the mapped `href`; render the dual WhatsApp+form CTA there. Peer-to-peer voice; one `/CLAIMS.md` proof point; one link.

Acceptance criteria:
- [ ] Each guide shows a bridge matched to its category (re-crawl `internal-links.csv` shows topic-clustered guide→service links).
- [ ] Copy passes `check:growth-language` + `check:british-english`; uses one approved CLAIM.

Validation: 0–48h — bridges render correctly per category. 1–2wk — links crawled (GSC links report). 6–8wk — guide→service click events; commercial-page clicks rise vs 49/12-mo baseline.
Risk and rollback: Low — template/content only; revert the map.

### SEO-010: Commercial body-copy rewrite + named-channel H2s

Owner: Content · Status: Schedule (Tier 2) · Priority score: 100.00
Source evidence: `copywriter-report.md` findings 1 & 2 (Critical); content-strategy; `analytics/report.md` finding 3. **Gated on SEO-003/SEO-007 indexation + SEO-006 CTA.**

Problem: the commercial pages don't earn the click in the SERP (no differentiation vs agencies) or the enquiry on-page (weak proof, buried price, generic CTA). `/services/social-media-marketing-for-pubs` inherits pos-6/7 rankings from the FB/IG redirect stubs but never names those channels on-page.

Why it matters: captures the 2,908–3,236 commercial impressions currently earning 2 clicks — the direct enquiry lever.

Implementation notes: rewrite the body of `/pub-marketing-agency`, `/services/{social,paid-social,content}`, `/fix-my-pub`: quotable opener answer block; all five `/CLAIMS.md` proof points with "proven at The Anchor" provenance (percentages only); transparent packages-from £375 + VAT; the 30-day guarantee; an anti-agency comparison ("a working publican, not account managers"); one primary CTA to `/contact`. Add visible `## Facebook for your pub` / `## Instagram for your pub` H2 sections to the social-media destination so inherited rankings land on relevant content. **Do not rewrite working guide metadata.**

Acceptance criteria:
- [ ] Each page carries an answer block, the CLAIMS proof, the price anchor, the guarantee, and a single primary CTA.
- [ ] Named-channel H2s present on the social-media page; copy passes the language/British-English lints.

Validation: 0–48h — copy live, metadata/CLAIMS correct. 1–2wk — re-crawl picks up new content; pages appear for commercial queries. 6–8wk — commercial-cluster CTR rises from ~0.07% and weighted position improves on the 43-query set.
Risk and rollback: Low — content only; revert page copy. No live indexation/redirect change here (FB/IG un-redirect is SEO-025, separately gated).

### SEO-008 to SEO-030 (summary tickets)

The remaining tickets follow the same structure; full per-ticket detail lives in the source reports cited in the Scored Backlog. Key acceptance/validation/risk notes:

- **SEO-008** Internal-link + sitemap-freshen never-crawled seasonal guides — *Accept:* the 4 guides gain inbound links and are fetched (exit `1970-01-01`). *Validate:* 1–2wk re-crawl/Coverage. *Risk:* Low.
- **SEO-009** Add "Services" to `navigation.json` (buyer language); choose canonical-hub direction — *Accept:* nav exposes Services on desktop+mobile. *Risk:* Low/reversible (label only; URL consolidation is SEO-029).
- **SEO-011** Position-improvement pass on 6 guides (depends on SEO-004) — *Accept:* 40–60w answer block + depth added, no metadata regressions. *Validate:* 6–8wk position toward top-10. *Risk:* Low (content additions).
- **SEO-012** Trim 5 meta descriptions ≤160 + 2 titles ≤60; add `check:meta-length` lint — *Accept:* lengths in range; lint added. *Risk:* Low.
- **SEO-013** De-duplicate mobile interrupt stack on guides — *Accept:* one persistent CTA at 375px. *Risk:* Low (remove/hide duplicates).
- **SEO-014** Single-source GONE list → sitemap excludes the 410 URL — **[Risk Register — sitemap].** *Accept:* slug absent from sitemap, 410 still served. *Rollback:* re-add slug.
- **SEO-015** Correct `Offer` price data to CLAIMS anchors — **[Risk Register — schema].** *Accept:* Rich Results Test passes Offer; price matches CLAIMS exactly. *Rollback:* revert JSON values.
- **SEO-016** Real sitemap `lastModified` — **[Risk Register — sitemap].** *Accept:* lastmod reflects real edit dates. *Rollback:* revert.
- **SEO-017** Rebuild entity graph — **[Risk Register — schema].** *Accept:* Rich Results Test shows expanded Organization/Person; every `sameAs` is a real verifiable profile. *Rollback:* revert the schema string.
- **SEO-018** PSI + CrUX baseline (mobile-first) — *Accept:* reports captured for 3 URLs. *Risk:* N/A (measurement).
- **SEO-019** Backlink-tool baseline pull — *Accept:* referring-domain baseline saved to `evidence/`. *Risk:* N/A.
- **SEO-020** Verify GSC property type; filter subdomain/protocol noise — *Accept:* property type confirmed; reporting filtered to the www marketing host. *Risk:* N/A (reporting only).
- **SEO-021** Compress 3 oversized images; HSTS preload — *Accept:* HEAD <100KB; securityheaders A. *Rollback:* restore assets / remove preload.
- **SEO-022** AI answer-blocks + author signals (by-product of SEO-011) — *Accept:* blocks live; AI/PAA presence monitored directionally (no AI-referral data). *Risk:* Low.
- **SEO-023** Consolidate events cannibalisation — **[Risk Register — redirect of merged page].** *Rollback:* remove redirect, restore page.
- **SEO-024** Consolidate rescue cluster → `/fix-my-pub` — **[Risk Register — 301s].** *Validate:* `fix my pub` pos 5.7 + merged queries 4–8wk. *Rollback:* remove redirects.
- **SEO-025** FB/IG redirect-stub decision — **[Risk Register — reverse `permanentRedirect`]; GKP-gated.** Prefer named-channel H2s (SEO-010) over un-redirecting; un-redirect only if GKP proves standalone demand. *Highest risk:payoff item — recommend the H2 route.* *Rollback:* re-instate `permanentRedirect`.
- **SEO-026** UK regional location-page system — GKP-gated for expansion; genuinely differentiated, **no doorway pages**. *Risk:* Low–Medium.
- **SEO-027** Family/kids events pillar — **GKP volume validation before build.** *Rollback:* do not build until validated.
- **SEO-028** Claim Orange Jelly GBP — **[Risk Register — GBP].** *Accept:* verified GBP live; URL added to `sameAs`.
- **SEO-029** Hub consolidation (5→1) — **[Risk Register — 301s]; gated on SEO-009 decision.** *Validate:* merged-URL equity transferred, no sustained ranking loss 4–8wk. *Rollback:* remove redirects, restore pages.
- **SEO-030** Earned-authority programme — outreach; CLAIMS %-only with **Tenant** framing for any Greene King feature. *Risk:* Low (editorial/earned only).

---

## Risk Register

**Mandatory section.** Every change that could damage search performance — every indexation, canonical, redirect, robots, content-pruning/removal, schema, sitemap, and GBP change. **No item proceeds without explicit user sign-off.** Every item here must also appear in the SEO Change Log before deployment.

| ID | Recommended Change | Risk | Impact if Wrong | Rollback Plan | Requires Approval |
|----|--------------------|------|-----------------|---------------|-------------------|
| SEO-003 | Internal-link/nav changes to index commercial pages | Low (additive); Medium only if nav structure changes | Wrong/over-linking dilutes; nav regressions | Remove added links; revert nav.json | **Yes** (if nav/redirect involved) |
| SEO-014 | Remove the 410 URL from the sitemap (single-source GONE list) | Low — de-noises Coverage | None material | Re-add slug to sitemap source | **Yes** (sitemap) |
| SEO-015 | Edit live `Offer`/`priceSpecification` price JSON-LD | Low — rich-result only; must match CLAIMS | Mis-stated price in rich results | Revert JSON price values | **Yes** (schema) |
| SEO-016 | Real `lastModified` in sitemap | Low | Freshness signal noise | Revert to static dates | **Yes** (sitemap) |
| SEO-017 | Expand Organization/Person `sameAs`/`knowsAbout` schema | Low | Invalid/misleading entity links | Revert the schema string; Rich Results Test before/after | **Yes** (schema) |
| SEO-024 | Consolidate rescue cluster → `/fix-my-pub` (2–3 × 301) | **Medium** — ranking flux; residual equity on `/pub-rescue`, `/empty-pub-solutions` | Loss of rankings/traffic on merged URLs | Remove redirects; restore pages; request re-index | **Yes** (redirects) |
| SEO-023 | Merge thin `pub-event-template-profit-nights` (301) | Medium — ranking flux on merged page | Loss of any equity the page held | Remove redirect; restore page | **Yes** (redirect) |
| SEO-025 | Un-redirect FB/IG stubs (only if GKP justifies) | **Medium–High** — pos 6–7 inherited *via* the redirect into a stronger page | Loss of the best commercial positions on the site | Re-instate `permanentRedirect` | **Yes** (redirect) |
| SEO-029 | Hub consolidation (5 → 1, several 301s) | **Medium** — ranking flux; equity must redirect cleanly | Sustained ranking loss across merged hubs | Remove redirects; restore pages | **Yes** (redirects) |
| SEO-028 | Claim/complete Orange Jelly Google Business Profile | Low–Medium | Mis-categorised/duplicate listing; NAP inconsistency | Edit/remove the GBP listing | **Yes** (GBP) |
| SEO-020 | Confirm GSC Domain-property scope (reporting only) | Low | None (no site change) | N/A — reporting only | **Yes** (GSC admin) |
| SEO-021 | Add HSTS `preload` | Low | Preload is hard to reverse if a subdomain isn't HTTPS-ready | Remove preload token (slow to de-list) | **Yes** (header) |

**Note on SEO-010 / FB/IG:** the *body-copy rewrite and named-channel H2s* in SEO-010 are content-only and do **not** require Risk-Register approval. Only the redirect change (SEO-025) does. The recommendation is to capture the FB/IG value via H2s (no routing change) and avoid the Medium–High redirect risk unless GKP proves standalone demand.

---

## Measurement Framework

Outcome-based — measure enquiries and commercial conversion, not output (blogs published, tickets closed). **GA4 is currently unavailable**, so the #1 KPI has no baseline until SEO-001 lands; targets are provisional and set after one month of post-SEO-001 data.

### Primary KPIs
| KPI | Current Baseline (source) | Target (3 months) | Target (6 months) |
|-----|---------------------------|-------------------|-------------------|
| Service enquiries (form submit + WhatsApp/tel/mailto CTA clicks, organic-attributed) | **Unavailable — no GA4** (SEO-001 creates it) | Establish baseline; set target after 1 month of data | Material lift over the established baseline |
| Clicks to commercial pages (GSC) | **49 / 12 mo** (Known) | Rising as pages index | A material multiple of baseline |
| Commercial-cluster CTR (43-query set) | **0.062%** (2 clicks / 3,236 impr) (Known) | Lift off the floor | Low single-digit % at current positions |
| Indexed priority commercial pages | **0 of the set** (Known) | All priority pages indexed | Sustained indexation |
| UK avg position, commercial cluster | pos ~18.5 weighted (Known) | Priority terms toward top-10 | Priority terms top-10 |
| Organic enquiry conversion rate | **Unavailable** until GA4 | — | Eventual north-star once baseline exists |

### Tracking Cadence
- **Weekly:** GSC clicks/impr/position for the commercial cluster + quick-win guides; indexation-coverage delta; 404 spikes; new-content first-appearance. (Enables period-over-period baseline the snapshots currently lack.)
- **Monthly:** cluster performance; commercial-click trend; enquiries + conversion rate (post-SEO-001); CTR on edited pages; competitor re-check vs `valueforvenues.co.uk`.
- **Quarterly:** organic→enquiry contribution; topic-area visibility; seasonal planning (summer/Christmas/autumn); strategy re-base on enquiry data.

**Tools:** GSC = spine; GA4 (SEO-001) = sessions/conversions; one Looker Studio dashboard joining both with saved "Commercial pages" + "Commercial cluster" filters. **SEO Change Log** started now (one row per change, logged *before* deploy). **Alert rules** (first responder): UK organic clicks −20% WoW (Analytics); coverage −10% (Technical); 404s +50% WoW (Technical); priority/commercial position drop >5 (Analytics→Content); schema errors (Technical); CWV regression once a field source exists (Technical).

---

## Post-Launch Validation Plan

Every shipped change is validated across three windows. Each ticket carries the checks relevant to what it ships; this is the baseline applying to all.

| Timing | Check |
|--------|-------|
| **0–48 hours** | Confirm deployment and rendered output (not just source); status codes, metadata, schema, redirects, and tracking live and correct on affected pages. For tracking (SEO-001/002): `enquiry_submit` + `cta_click` fire in DebugView; test enquiry delivered by email; **no PII in logs**. For URL/redirect changes: 301/308 correct, old URLs behave as intended. Confirm the SEO Change Log entry is complete. Check GSC for new errors. |
| **1–2 weeks** | Crawl/indexation behaviour on affected pages (recrawled? exiting "not indexed"?); sitemap status; new GSC coverage errors/exclusions; early ranking fluctuations where data exists. Confirm internal links are crawled (GSC links report) for SEO-003/005/007. |
| **6–8 weeks** | Compare clicks, impressions, CTR, average position, and (post-SEO-001) enquiries/conversions against the pre-change baseline. Commercial-cluster CTR vs 0.062%; commercial clicks vs 49/12 mo; target-guide positions toward top-10. If results are negative, escalate and consider the rollback in the Risk Register. A ticket is only fully closed when its 6–8 week window is reviewed and the result logged. |

For supported engines (Bing/Yandex), submit changed URLs via **IndexNow** to accelerate discovery (Google does not currently support it). Each validation result feeds back into both the SEO Change Log (observed vs expected effect) and the next sprint's priorities.

---

## Recommended Operating Cadence

Two-week sprint after the overhaul: ship from the prioritised backlog → verify in GSC/GA4 → refine. Weekly performance-and-priority review (SEO lead, technical, content, analytics, dev) + weekly execution check-in. Monthly strategic review. Quarterly deep review (category performance, technical health, content quality, authority, business impact). The strategy is a living system, re-based on enquiry data once SEO-001 exists.

---

## Out of Scope / Future Considerations

- **Conversion-rate experimentation (A/B testing of CTAs/copy):** premature until SEO-001 produces a stable enquiry baseline — revisit once tracking has ~1 month of data.
- **Core Web Vitals optimisation:** out of scope until SEO-018 establishes a PSI/CrUX baseline; no performance work should be scored as a known regression without field data.
- **New net-new content beyond the validated family-events gap:** gated on GKP — do not commit word count or build until volumes are validated. The same gate applies to FB/IG un-redirect (SEO-025) and regional expansion (SEO-026).
- **Backlink disavow / link cleanup:** nothing toxic observed and no tool data — `unavailable`; revisit only after the SEO-019 baseline pull.
- **International/non-UK optimisation:** deliberately excluded — UK ≈ 90% of clicks; international impressions are noise for a UK lead-gen business.
- **CRM/database persistence of enquiries:** explicitly out of scope for v1 (email-only delivery) — a new PII datastore requires explicit GDPR sign-off (workspace stop-condition).
- **Next review cycle:** re-run the commercial-cluster CTR/position analysis and a competitor re-check against the Greene King hub once enquiry data exists; re-rank the Monitor bucket as GKP and backlink baselines arrive.
