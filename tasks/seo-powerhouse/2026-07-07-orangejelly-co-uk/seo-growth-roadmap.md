# SEO Growth Roadmap — Orange Jelly (orangejelly.co.uk)

**Date:** 2026-07-07
**Prepared for:** Peter Pitcher, Orange Jelly Ltd
**Target site:** https://www.orangejelly.co.uk · **Codebase:** main @ `6116fe19`
**Run:** Full Overhaul, second pass (builds on the 2026-06-16 audit)

---

## Data Access & Limitations

| Data source | Available? | Date range | Used for | Limitations |
|---|---|---|---|---|
| Google Search Console — Performance | Yes | 12-month + 28-day to **2026-06-16** | Demand, impressions, clicks, position | **3 weeks stale; pre-dates the June fixes going live** — no June fix is measurable yet |
| GSC — Page Indexing / Coverage | Yes | 2026-06-16 (+7 drilldowns) | Indexation states, not-indexed reasons | Same staleness caveat |
| GA4 / analytics export | **No** | — | Traffic, conversions, behaviour | Not provided (same as June); all conversion baselines are GSC + Supabase-only |
| GTM / tagging health | Partial (live inspection) | 2026-07-07 | Container load, consent, dataLayer | Container internals (GA4 tags, key events) not visible from outside — user must export |
| Rank tracking / Ahrefs / Semrush | **No** | — | Volume, difficulty, backlinks | No backlink baseline possible; authority reads are WebSearch-observed only |
| PageSpeed / CrUX field data | **No** | — | Core Web Vitals | `CRUX_API_KEY` not set — `cwv.csv` all `unavailable`; no CWV numbers invented |
| Live crawl (collect-site-evidence.py) | Yes | 2026-07-07 | 153 pages, headers, metadata, canonicals, schema, links | Sitemap has 139 URLs; crawl reached 153 (full coverage) |
| Codebase | Yes | main @ 6116fe19 | Templates, routing, schema, tracking | Deployed prod verified against HEAD via live HTTP checks |

**Confidence rule:** every figure here is first-party GSC (Known) or live-crawl (Known) unless labelled `inferred`/`WebSearch-observed`. No keyword volumes are invented — where demand is unknown the item is marked *blocked on keyword-plan*.

**Biggest limitation:** the GSC data cannot yet show whether June's fixes worked. The honest position on indexation and CTR is *"fixed in code/live, effect unmeasured until the mid-August GSC refresh."*

---

## Evidence Summary

| Evidence | Covers | Confidence |
|---|---|---|
| `search-queries.csv` (701 rows, 12-mo) + `gsc-28d/` (284 rows) | Demand, CTR, position by query | High |
| `indexation-summary.csv` + `indexation-urls.csv` (693 rows) | Not-indexed reasons and which URLs | High (as of 2026-06-16) |
| `collect-site-evidence` output (url-inventory, page-metadata, technical-signals, schema.json, internal-links) | On-page + technical state, 153 URLs | High |
| `opportunities-*.csv` + `analysis-summary.md` | Striking-distance (298), CTR-gap (27), cannibalisation | High (derived from GSC) |
| `internal-link-issues.md` | Link graph, orphans, authority sinks | High |
| `schema-validation-summary.md` | 138 retired rich-result blocks, 12 missing-required | High |
| `live-verification-notes.md` + git checks | Deployed-vs-code reconciliation | High |
| `tracking-evidence.md` + `tracking-health-check.md` | GTM/GA4/Supabase instrumentation | High (code) / Partial (container) |
| WebSearch competitor/authority notes | Off-domain presence | Medium (observed, not tooled) |

---

## Executive Summary

Orange Jelly's SEO problem is **not a traffic problem — it is a conversion-of-existing-demand problem.** The site already ranks page-one or near it for its highest-intent commercial queries ("instagram services for pubs" pos 7, "facebook services for pubs" pos 6.1, "fix my pub" pos 5.7), yet earns almost no clicks from them because the ranking pages are broken, thin, or invisible to measurement. June's structural fixes (dual-H1, guide→service bridge, key redirects) are live and verified — this pass confirms they shipped and finds the **next layer of defects sitting directly on the money path**.

Three things are capping the funnel: (1) the two best-ranked commercial pages (`/services/instagram-services-for-pubs` and its Facebook sibling) serve a 200 that canonicals to the homepage — their page-level redirect silently no-ops on Vercel's static route, so a page-one ranking points at a self-cancelling page; (2) the primary conversion — the contact form — fires **no analytics event** and lead notifications go nowhere but a silent `/admin` table, so nobody knows when search produces an enquiry; (3) the whole commercial page set was not-indexed as of June, and `/capabilities` hoovers 1,035 internal links away from the money pages.

The strategy is **reclaim, don't create.** Fix the pages that already rank, make the conversion measurable, rebalance internal links, then re-measure at the mid-August GSC refresh. Meaningful movement on commercial CTR should be visible 6–8 weeks after the fixes ship; the content and authority plays compound over 3–6 months.

---

## Strategic Direction

### Business Goals and SEO Alignment
The commercial goal is **more service enquiries from UK licensees**, not vanity traffic. Every ticket is judged by whether it captures commercial-intent demand or feeds it to a page that converts. Scale is tiny (28 days = 25 clicks / 2,654 impressions), so this is conversion-rate and demand-capture work on a small site, not portfolio management.

### Where This Site Can Win (next 6 months)
1. **Named-channel service queries it already ranks for** — inherited pos 2–7 rankings pointing at broken/thin pages. Fixing the pages recovers clicks with zero new rankings required. Highest click-per-effort on the site.
2. **Rescue/turnaround** ("fix my pub" pos 5.7) — the SERP is owned by insolvency firms; Orange Jelly's recovery-first framing is genuinely differentiated and already ranks.
3. **The events/quiz guide engine** (6,100+ impressions) — already winning; the job is position-improvement passes, proving the bridge converts, and AEO answer-blocks for AI citations.
4. **"Pub marketing (agency)"** (1,131 impressions, pos ~20, 0 clicks) — winnable only after the five-hub cannibalisation is resolved and one hub is indexed. Medium-term.

### Priority Framework
**P0 Measurement gate** → **P1 Reclaim inherited commercial rankings** → **P2 Index the commercial layer** → **P3 Convert & defend the guide engine** → **P4 Hygiene & authority.** Commercial value × achievability ÷ effort, dependencies respected.

### Competitive Position
Weak domain authority; near-zero third-party citations (8 WebSearch runs on 2026-07-07 found Orange Jelly only on its own domain + generic LinkedIn). Competitor CJ Digital occupies every citation surface OJ is absent from (getonbloc top-10, ttagz, DesignRush, Clutch). OJ cannot win head terms by links in 6 months; it wins on inherited rankings + a differentiator competitors can't copy — a consultancy run from a live Greene King pub with real turnaround numbers.

---

## Current Performance Baseline

### Organic Visibility (12-month GSC to 2026-06-16 — pre-fix)

| Cluster | Queries | Clicks | Impressions | Weighted pos | CTR |
|---|---:|---:|---:|---:|---:|
| Events (general) | 112 | 10 | 4,456 | 20.0 | 0.22% |
| Quiz/bingo/karaoke | 140 | 24 | 1,651 | 17.8 | 1.45% |
| Commercial — social/channel | 22 | 4 | 1,634 | **11.2** | 0.24% |
| Commercial — agency/marketing | 14 | 0 | 1,444 | 25.4 | **0.00%** |
| Commercial — rescue/turnaround | 5 | 1 | 197 | **9.4** | 0.51% |
| County/local | 9 | 0 | 30 | 37.3 | 0.00% |

**The structural insight:** the site's *best positions are on its commercial clusters* (social 11.2, rescue 9.4) and its *worst CTRs are also there* (~0.2%, 0%). Demand exists, Google ranks the site for it, and almost nobody clicks — because the ranking pages are thin/mis-canonicalised/not-indexed. That is a fixable, high-leverage situation.

### Top Performing Content (GSC Pages, 12-mo)
| Page | Clicks | Impressions | Note |
|---|---:|---:|---|
| `/licensees-guide/social-media-strategy-for-pubs` | 37 | 3,836 | Guide out-earns every commercial page |
| `/licensees-guide/instagram-marketing-for-pubs` | 5 | 728 | Informational, not the service page |
| `/services` | 2 | 1,199 | Now 308→`/ways-to-work` |
| `/services/facebook-services-for-pubs` | 0 | 58 | Ranks pos 6.1, converts 0 |
| `/services/instagram-services-for-pubs` | 0 | 48 | Ranks pos 7, converts 0 |

### Underperforming Areas
Every commercial page: best positions, near-zero clicks. Root causes addressed in P1/P2.

---

## URL Inventory Summary

| Template type | URLs found | Sampled | Main issues |
|---|---:|---:|---|
| Guides `/licensees-guide/*` | 117 | Representative + all outliers | 1 hard 404 (slug rename); FAQ answers hidden from users; WhatsApp-only bridge target |
| Service pages `/services/*` | 5 | 5 | 2 serve 200→homepage (redirect no-op); 2 thin; 3 missing from sitemap |
| Commercial hubs / top-level | ~18 | All | 5 compete for agency intent; whole set not-indexed in June |
| County pages `/pub-marketing-*` | 9 | All | 30 impressions/12mo — de-prioritised |
| Conversion (`/contact*`) | 5 | All | `?package=*` correctly canonical to `/contact` |
| Category index | 3 | 3 | Thin (233–270 words) |
| **Total crawled** | **153** | full | 1× 404, rest 200 |

---

## Key Findings

### Technical SEO — **Needs work (money-path defects)**
**Critical/High:**
- `/services/instagram-services-for-pubs` + Facebook sibling serve **200 canonical→homepage** while ranking pos 6–7: page-level `permanentRedirect()` no-ops on the static Vercel route (`technical 14`; live-verified).
- `/capabilities` gets **1,035 internal links** (> homepage 602) from `content/data/footer.json` + 4 mis-anchored `BlogPost.tsx` CTAs (×106 guides) — link equity drained from money pages (`technical 15`).
- 3 live, ranking service pages absent from `src/app/sitemap.ts`.
**Medium:** hard 404 `pub-wages-labour-costs-uk` (slug rename, no redirect); 12 missing-required schema fields (`StructuredData.tsx:58-109`); 138 retired FAQ/HowTo rich-result blocks (decision: keep FAQ visible for AEO, drop retired markup).
**Already resolved (verified):** `contact?package=*` canonicalises correctly; sitemap excludes non-200s; all June fixes live.

### Content & Keywords — **Reclaim, don't create**
Every not-indexed guide is substantial (877–5,203 words) — this is an indexation/link-equity problem, **not** a thin-content problem. **Zero removals.** Pruning verdicts on 17 URLs: 3 category pages → expand; 2 pairs → consolidate; 1 → redirect; 1 (`/about-demo`) → noindex. Named-channel service pages are the P1 reclaim. Family/kids pillar **blocked on keyword-plan**.

### Authority & Backlinks — **Weak**
Entity graph (June SEO-017) only **partially** done: the only `sameAs` across 5,946 JSON-LD nodes is `the-anchor.pub`; Person node has no `sameAs`, `knowsAbout` absent — the AI-identity prerequisite is unmet. Near-zero editorial/directory presence. Top plays: complete the entity graph (schema-only, do first), Greene King toolkit byline, BII/Morning Advertiser pitch.

### UX & Conversion — **Path delivers, but too few pages route to it**
Contact form now writes to Supabase and fails loudly (silent-form era over). But the dual-CTA (June SEO-006) shipped on `PackageCTA` only, **not** on `PubServiceLandingPage` — the exact P1 reclaim targets are WhatsApp-only. Newsletter form is mounted on zero pages (dead path). `/contact` itself is well-built and low-friction.

### Content Quality — **High, with systemic gaps**
The 4 cluster-leader guides already have Quick Answer + FAQ frontmatter + author — but FAQ renders **only** as (retired) JSON-LD, never visibly on-page, so the most citable asset is invisible. Freshness dates and author credentials are schema-only. QA: 8 "save/savings" hits + 2 US spellings to fix; no retired CLAIMS metrics in the corpus.

---

## Priority Mapping

| Priority Area | Why it matters commercially | Evidence | Next step | Confidence |
|---|---|---|---|---|
| Named-channel service pages | Ranks pos 2–7, captures ~0 clicks — pages broken/thin | search-queries.csv; technical 14 | Fix routing + sitemap + content | High |
| Conversion measurement + lead delivery | Primary conversion invisible; leads land silently | analytics 37/42 | Instrument + notify | High |
| Commercial indexation + link rebalance | Whole set not-indexed June; `/capabilities` sink | indexation-urls.csv; internal-link-issues.md | Rebalance + re-index, re-measure August | High / Medium |
| `/fix-my-pub` snippet | pos 5.7, 0.9% CTR, differentiated SERP position | copy 56 | Title/meta rework | High |
| Guide-engine conversion + AEO | 6,100+ impr, hidden FAQ, WhatsApp-only CTA | editor 62; uxcro 70 | Visible FAQ + dual-CTA + newsletter + answer-blocks | Medium–High |
| Agency-hub consolidation | 1,131 impr, pos ~20, 0 clicks, 5 hubs compete | strategy 9 | Consolidate after August GSC | Medium |
| Entity graph / authority | AI identity + citations | schema.json; authority 50 | Complete graph now; earned media quarterly | High / Medium |

Full lists: `priority-mapping/pre-approved-small-fixes.md`, `priority-mapping/high-risk-approval-list.md`, `priority-mapping/keyword-plan-requests.md`.

---

## Keyword Planning Inputs

| Priority Area/Page | Keyword Data Source | Status | Notes |
|---|---|---|---|
| Named-channel service pages | GSC (pos 2–12) | Validated (Known) | No keyword-plan needed — reclaim on existing rankings |
| `/fix-my-pub` | GSC ("fix my pub" pos 5.7) | Validated (Known) | — |
| Events/quiz cluster | GSC | Validated (Known) | — |
| Agency hub | GSC (1,131 impr) | Validated (Known) | Consolidation, not new keywords |
| Christmas/winter | GSC ("christmas pub ideas" pos 14.8) | Validated (Known) | Seasonal timing |
| Family/kids events pillar | none | **Blocked on keyword-plan** | Run `/keyword-plan` + GKP data before any build |

---

## Editorial Production Handoff

Full briefs: `content-production/editorial-team-briefs.md`. Summary:

| Page/Asset | Mode | Keyword Source | Approval Bucket | Status |
|---|---|---|---|---|
| Social-media hub + paid-social + content-creation | Edit existing | GSC | High-risk (Group A) / Pre-approved | Blocked on SEO-106 / Ready |
| `/fix-my-pub` title+meta | Edit existing | GSC | Pre-approved | Ready |
| 4 cluster-leader guides (AEO) | Edit existing | GSC | Pre-approved | Ready after SEO-119 |
| 6 position-improvement guides | Edit existing | GSC | Pre-approved | Ready |
| Christmas/winter refresh | Edit existing | GSC | Pre-approved | Schedule (early Sept) |
| Family/kids pillar | Draft only | keyword-plan | Deferred | Blocked |

---

## Scored SEO Backlog

Produced by `scripts/score-opportunities.py`: `priority_score = (business_value × search_opportunity × current_performance_gap × confidence) / (effort + risk)`. Full CSV: `priority-mapping/scored-backlog.csv`. Expected-clicks forecasts are near-zero/blank because absolute impression volumes are small and several rows have no per-query demand tag — treat commercial upside as *high-intent but low-absolute-volume*, i.e. quality of visitor over quantity.

| ID | Action | Cat | Score | Impact | Eff | Risk | Owner | Decision | Approval | Source |
|----|--------|-----|------:|--------|-----|------|-------|----------|----------|--------|
| SEO-107 | Add 3 live money pages to sitemap | Tech | 160.0 | H | L | L | Technical | Do now | Pre-approved | technical 20 |
| SEO-114 | URL-inspect + re-index commercial set (post-link-fix) | Tech | 133.3 | H | L | L | Technical | Do now | Pre-approved | strategy 2 |
| SEO-106 | Fix Instagram/Facebook 200→homepage (redirect no-op) | Tech | 125.0 | H | L | M | Technical | Do now | **High-risk A** | 5-agent |
| SEO-104 | Mid-August GSC re-export (measure June fixes) | Analytics | 120.0 | H | L | L | Analytics | Do now | Pre-approved (user) | strategy 12 |
| SEO-101 | Fire generate_lead GA4 event + verify GA4 config | Analytics | 93.8 | H | M | M | Analytics | Do now | Pre-approved | analytics 37/39 |
| SEO-108 | `/fix-my-pub` recovery-first snippet | Content | 72.0 | H | L | L | Content | Do now | Pre-approved | copy 56 |
| SEO-126 | Complete entity graph (Org/Person sameAs) | Authority | 48.0 | M | L | L | Authority | Do now | Pre-approved | authority 50 |
| SEO-112 | Rebalance /capabilities 1,035 inbound links | Tech | 48.0 | H | L | M | Technical | Do now | Pre-approved | technical 15 |
| SEO-119 | Render FAQ visibly on guide template (AEO) | Tech | 48.0 | M | L | L | Technical | Do now | Pre-approved | editor 62 |
| SEO-110 | Deepen social hub to ~900–1,000w | Content | 48.0 | M | L | L | Content | Schedule | Pre-approved | copy 58 |
| SEO-118 | Dual-CTA on PubServiceLandingPage | UX | 42.7 | H | L | L | UX | Do now | Pre-approved | uxcro 70 |
| SEO-102 | Lead notification (email/webhook) | Analytics | 41.7 | H | L | L | Technical | Do now | **High-risk C** | analytics 42 |
| SEO-103 | Export Supabase leads baseline + live test | Analytics | 40.0 | M | L | L | Analytics | Do now | Pre-approved (user) | analytics 46 |
| SEO-111 | Metadata length fixes (4 commercial pages) | Content | 36.0 | M | L | L | Content | Schedule | Pre-approved | copy 60 |
| SEO-109 | Expand paid-social + content-creation pages | Content | 36.0 | M | L | L | Content | Schedule | Pre-approved | content 28 |
| SEO-122 | Position-improvement refresh (6 guides) | Content | 36.0 | M | M | L | Content | Schedule | Pre-approved | content 32 |
| SEO-105 | Track tel:/mailto: clicks + SPA page_view | Analytics | 32.0 | M | L | L | Analytics | Schedule | Pre-approved | analytics 43 |
| SEO-115 | 301 the 404 `-uk` slug + fix link | Tech | 30.0 | M | L | L | Technical | Do now | Pre-approved | technical 16 |
| SEO-124 | Fix 12 missing-required schema fields | Tech | 30.0 | M | L | L | Technical | Do now | Pre-approved | technical 19 |
| SEO-113 | Consolidate 5 pub-marketing hubs → 1 | Tech | 27.4 | H | H | M | Technical | Schedule | **High-risk B** | strategy 9 |
| SEO-121 | AEO answer-blocks + E-E-A-T on 4 leaders | Content | 27.0 | M | L | L | Editorial | Schedule | Pre-approved | editor 63 |
| SEO-137 | Christmas/winter seasonal hub (by Sept) | Content | 27.0 | M | L | L | Content | Schedule | Pre-approved | content 35 |
| SEO-120 | Mount orphaned NewsletterForm on guides | UX | 18.0 | M | L | L | UX | Schedule | Pre-approved | uxcro 72 |
| SEO-117 | Link the orphaned `/pub-rescue` | Tech | 16.0 | L | L | L | Technical | Schedule | Pre-approved | technical 23 |
| SEO-131 | Greene King toolkit byline+link | Authority | 13.5 | M | L | M | Authority | Schedule | Pre-approved (user) | authority |
| SEO-130 | Expand/noindex 3 thin category pages | Content | 12.0 | L | L | L | Content | Monitor | Pre-approved | content 30 |
| SEO-133 | Backlink baseline pull | Authority | 12.0 | L | L | L | Authority | Monitor | Deferred (tool) | authority 54 |
| SEO-125 | Rationalise retired FAQ/HowTo markup | Tech | 10.7 | L | L | L | Technical | Monitor | Pre-approved | technical 18 |
| SEO-116 | Repoint residual `/services` links | Tech | 10.0 | L | L | L | Technical | Schedule | Pre-approved | technical 17 |
| SEO-134 | Verify/claim Google Business Profile | Authority | 8.0 | L | L | L | Authority | Monitor | Deferred (user) | authority 53 |
| SEO-138 | CWV baseline (set CRUX_API_KEY) | Analytics | 8.0 | L | L | L | Analytics | Monitor | Deferred (user) | technical 24 |
| SEO-132 | BII + Morning Advertiser pitch | Authority | 7.2 | M | M | M | Authority | Monitor | Deferred (user) | authority 51 |
| SEO-123 | Events-cluster cannibalisation | Content | 6.0 | L | L | M | Content | Monitor | Pre-approved | content 33 |
| SEO-128 | Fix save/savings + US spellings | Content | 5.0 | L | L | L | Editorial | Schedule | Pre-approved | editor 66 |
| SEO-127 | Sitemap lastModified honesty | Tech | 4.0 | L | L | L | Technical | Monitor | Pre-approved | technical 21 |
| SEO-129 | Editorial QA sweep (claims audit) | Content | 4.0 | L | L | L | Editorial | Monitor | Pre-approved | editor 68 |
| SEO-135 | Family/kids events pillar | Content | 3.6 | L | M | M | Content | Monitor | **Blocked (keyword-plan)** | content 36 |
| SEO-136 | County-page expansion — STOP | Content | 2.5 | L | L | L | Content | Reject | Decision | strategy 11 |

---

## The Roadmap

### Tier 1: Immediate Fixes (This Week)
Money-path defects + the measurement gate. All pre-approved except SEO-106 (needs the Group A cannibalisation check).

| # | Action | Category | Impact | Effort | Dependencies | Owner |
|---|--------|----------|--------|--------|-------------|-------|
| SEO-101 | Fire `generate_lead` event + verify GA4 config | Analytics | High | M | GTM/GA4 access | Analytics |
| SEO-102 | Lead notification on new Supabase lead | Technical | High | S | Resend/webhook | Technical |
| SEO-106 | Fix Instagram/Facebook 200→homepage routing | Technical | High | S | Group A approval | Technical |
| SEO-107 | Add 3 money pages to sitemap | Technical | High | XS | dev | Technical |
| SEO-108 | `/fix-my-pub` recovery-first snippet | Content | High | S | CLAIMS; editorial-team | Content |
| SEO-112 | Rebalance `/capabilities` internal links | Technical | High | S–M | dev | Technical |
| SEO-115 | 301 the 404 `-uk` slug | Technical | Medium | XS | dev | Technical |

### Tier 2: Short-Term Wins (Next 4–8 Weeks)
Convert the reclaimed traffic + first measurement gate.

| # | Action | Category | Impact | Effort | Dependencies | Owner |
|---|--------|----------|--------|--------|-------------|-------|
| SEO-118 | Dual-CTA on `PubServiceLandingPage` | UX | High | S | reuse PackageCTA; SEO-106 | UX |
| SEO-119 | Render FAQ visibly on guides (AEO) | Technical | Medium | S | dev | Technical |
| SEO-110 | Deepen social hub to ~900–1,000w | Content | Medium | M | editorial-team; SEO-106 | Content |
| SEO-109 | Expand paid-social + content-creation pages | Content | Medium | M | editorial-team | Content |
| SEO-111 | Metadata length fixes (4 pages) | Content | Medium | S | editorial-team | Content |
| SEO-124 | Fix 12 missing-required schema fields | Technical | Medium | S | dev | Technical |
| SEO-126 | Complete entity graph (Org/Person sameAs) | Authority | Medium | S | dev; schema-markup | Authority |
| SEO-114 | URL-inspect + re-index commercial set | Technical | High | S | SEO-106/107/112 first | Technical |
| SEO-104 | Mid-August GSC re-export (measure June) | Analytics | High | S | GSC access | Analytics |
| SEO-120 | Mount NewsletterForm on guides | UX | Medium | XS | SEO-101 | UX |
| SEO-105 | Track tel:/mailto: + SPA page_view | Analytics | Medium | S | GTM | Analytics |

### Tier 3: Medium-Term Growth (1–3 Months)

| # | Action | Category | Impact | Effort | Dependencies | Owner |
|---|--------|----------|--------|--------|-------------|-------|
| SEO-113 | Consolidate 5 pub-marketing hubs → 1 | Technical | High | L | **Group B approval; August GSC first** | Technical |
| SEO-121 | AEO answer-blocks + E-E-A-T on 4 leaders | Content | Medium | M | editorial-team; ai-seo; SEO-119 | Editorial |
| SEO-122 | Position-improvement refresh (6 guides) | Content | Medium | M | editorial-team | Content |
| SEO-137 | Christmas/winter seasonal hub (ship by Sept) | Content | Medium | M | editorial-team | Content |
| SEO-131 | Greene King toolkit byline+link | Authority | Medium | M | Charlotte Brown outreach | Authority |
| SEO-116 / SEO-117 / SEO-125 / SEO-128 | Link + schema + QA hygiene batch | Mixed | Low | S each | dev/editorial | Mixed |

### Tier 4: Long-Term Strategic Bets (3–6 Months)

| # | Action | Category | Expected Impact | Dependencies |
|---|--------|----------|----------------|-------------|
| SEO-132 | BII + Morning Advertiser earned media | Authority | Builds citation base competitors have, OJ lacks | User outreach; CLAIMS |
| SEO-134 | Google Business Profile for OJ consultancy | Authority | Local/entity presence | Google account |
| SEO-133 | Backlink baseline + link programme | Authority | Measurable authority tracking | Ahrefs/Semrush |
| SEO-135 | Family/kids events pillar | Content | New demand capture | **keyword-plan validation** |
| SEO-138 | CWV field-data baseline | Analytics | Performance monitoring | CRUX_API_KEY |

---

## Implementation Tickets

Selected tickets in full; the rest are one-line rows in the Scored Backlog with locations in `implementation-planning/web-developer/web-developer-report.md`. This run is **review-only — nothing applied.**

### SEO-106: Fix Instagram/Facebook service pages serving 200→homepage
Owner: Technical · Status: Do now · Approval: **High-risk (Group A)** · Score: 125.0 · Expected clicks Δ: high-intent, low-absolute (256+123 impr at pos 6–7)
Source evidence: `live-verification-notes.md`; `page-metadata.csv`; `search-queries.csv`; `src/app/services/{instagram,facebook}-services-for-pubs/page.tsx`

**Problem:** Both pages call `permanentRedirect('/services/social-media-marketing-for-pubs')` in a statically-rendered route; on Vercel this silently no-ops and the page serves a 200 that canonicals to the homepage. Both rank pos 6–7 for their money query and capture 0 clicks.
**Why it matters:** the site's two best-positioned commercial rankings point at self-cancelling pages — the single highest click-per-effort fix available.
**Implementation notes:** move the redirect into `next.config.js` `redirects()` (proven pattern — `/services`→`/ways-to-work` at `next.config.js:19-21` works), **or** rebuild them as real self-canonical pages. Recommended: redirect to the hub + strengthen the hub (SEO-110) to avoid a three-way split. Add the hub to the sitemap (SEO-107).
**Acceptance criteria:**
- [ ] Both URLs return a 301/308 to `/services/social-media-marketing-for-pubs` (or serve a self-canonical 200 if rebuilt)
- [ ] No page in the crawl canonicals to the homepage except the homepage
- [ ] Hub is in the sitemap
**Validation:** re-crawl shows correct status/canonical; CTR on "instagram/facebook services for pubs" rises off 0% in the August GSC export.
**Risk and rollback:** wrong redirect could drop the ranking before the target inherits it — revert the `next.config.js` entry and URL-inspect. Cannibalisation check: target already ranks (7 impr); redirect-to-hub is the recommended, non-splitting choice.

### SEO-101: Fire the enquiry conversion event
Owner: Analytics · Status: Do now · Approval: Pre-approved · Score: 93.8
Source evidence: `tracking-health-check.md`; `analytics-report.md` findings 37/39/40; `src/components/forms/contact-form.tsx`

**Problem:** the contact form's success path pushes nothing to GA4/GTM — the primary commercial conversion is invisible. GTM (`GTM-WBHJ7Q2H`) and Consent Mode v2 load correctly, but there is no `generate_lead` event (the June commit that added it was never merged).
**Why it matters:** you cannot manage, attribute, or grow enquiries you cannot see; this is the gate every other commercial KPI depends on.
**Implementation notes:** on `submitContactForm` success, push `generate_lead` to dataLayer via `src/lib/tracking.ts`; mirror `cta_click{method}`. Verify the GA4 config tag + measurement ID inside the GTM container (user-side).
**Acceptance criteria:**
- [ ] `generate_lead` visible in GA4 DebugView on a live test submission
- [ ] Event maps to a GA4 key event / conversion
**Validation:** DebugView + a test lead appears in `/admin`.
**Risk and rollback:** additive; remove the push to revert.

### SEO-102: Lead notification on new Supabase lead
Owner: Technical · Status: Do now · Approval: **High-risk (Group C)** · Score: 41.7
Source evidence: `analytics-report.md` finding 42; `src/lib/db/leads.ts`

**Problem:** captured enquiries land silently in the `/admin` dashboard — nothing emails/Slacks Peter, so a lead can sit unseen (the June Resend branch was never merged).
**Why it matters:** a lead nobody sees is a lost customer; response time is the whole game in pub rescue.
**Implementation notes:** add an email/webhook on successful `storeContactLead()` insert (Resend or a Supabase edge function). Touches the live enquiry path — feature-flag and test.
**Acceptance criteria:**
- [ ] A test submission triggers a notification within seconds
- [ ] Storage still succeeds if notification fails (never block lead capture)
**Validation:** test lead → notification received + row in Supabase.
**Risk and rollback:** guard so notification failure never breaks capture; revert the notification call to roll back.

### SEO-112: Rebalance /capabilities internal links
Owner: Technical · Status: Do now · Approval: Pre-approved · Score: 48.0
Source evidence: `internal-link-issues.md`; `content/data/footer.json`; `src/components/blog/BlogPost.tsx:276/289/302/315`

**Problem:** `/capabilities` receives 1,035 internal links (> homepage 602) from the footer + 4 mis-anchored guide CTAs (×106 guides), concentrating equity on a page with no matching GSC demand while money pages starve.
**Why it matters:** internal links are the main lever OJ controls for indexation/ranking of the commercial layer.
**Implementation notes:** repoint the 4 `BlogPost.tsx` CTAs to the named service/money pages; repoint 2 footer links.
**Acceptance criteria:**
- [ ] Re-crawl: `/capabilities` inbound materially below homepage
- [ ] Money pages gain inbound links
**Validation:** re-run `analyze-internal-links.py`.
**Risk and rollback:** low; restore links if rankings wobble.

*(Remaining tickets SEO-103/104/105/107/108/109/110/111/113/114/115/118/119/120/121/124/126 and the hygiene/authority items: see the Scored Backlog rows + `web-developer-report.md` for exact file locations and acceptance checks.)*

---

## Implementation Status

**Planned only — review run; no code changed.**

### Batched Approval Request
| Group | Changes | Why it matters | Risk if wrong | Rollback | Recommendation |
|---|---|---|---|---|---|
| A. Channel routing | SEO-106 | Unblocks the top click-per-effort win | Drop pos-6/7 ranking before hub inherits | Revert `next.config.js`; URL-inspect | **Approve now** (redirect-to-hub variant) |
| B. Hub consolidation | SEO-113 | Unlocks 1,131-impr agency cluster | Consolidate wrong URL / too early | Documented redirect map, reversible | **Defer to mid-August** GSC refresh |
| C. Lead delivery | SEO-102 | Stops silent leads | Bug could break capture | Feature-flag; revert | **Approve with SEO-101** |

### Deferred or Blocked
| Item | Blocker | Next action |
|---|---|---|
| SEO-135 family/kids pillar | No demand data | Run `/keyword-plan` + GKP |
| SEO-133 backlink baseline | No Ahrefs/Semrush | Provide export |
| SEO-138 CWV baseline | No `CRUX_API_KEY` | Set key, re-run collect-cwv |
| SEO-104 August measurement | Time (fixes must age 6–8 wks) | Re-export GSC ~2026-08-15 |

---

## Risk Register

No high-risk change proceeds without explicit sign-off. Full detail: `priority-mapping/high-risk-approval-list.md`.

| Group | Change | Risk | Impact if wrong | Rollback | Approval |
|---|---|---|---|---|---|
| A | Move Instagram/Facebook redirect to `next.config.js` → hub | Wrong redirect drops a pos-6/7 ranking | Loss of best commercial rankings | Revert entry; URL-inspect | **Yes** |
| B | Consolidate 5 pub-marketing hubs to 1 (301 the rest) | Consolidating wrong/early URL | Loss of 1,131 agency impressions | Reversible redirect map; no deletion | **Yes — after August GSC** |
| C | Lead notification on live enquiry path | Bug breaks capture | Missed enquiries | Guarded; storage unaffected | **Yes** |
| — | Retired-schema removal (SEO-125) | Removing a still-useful signal | Minimal (rich result already retired) | git revert | Keep FAQ visible; low-risk |

---

## Content Briefs for Priority Pages

### Social-media hub + channel reclaim
**Target cluster:** "social media marketing for pubs" (pos 12) + instagram/facebook/paid-social/content-creation "for pubs" (pos 2–7). **Source:** GSC (Known). **Intent:** commercial done-for-you. **Type:** service page. **Mode:** Edit existing (hub); routing via SEO-106.
**Outline:** H1 "Instagram & Facebook Marketing for Pubs"; H2 per channel (Instagram, Facebook, paid social, content); H2 "What you get / packages"; H2 proof (one CLAIMS metric). ~900–1,000w.
**Metadata:** Title ≤60 incl. channels; description with packages-from £375 plus VAT.
**Differentiation:** run by a working licensee, real pub numbers. **Internal links:** `/ways-to-work`, `/fix-my-pub`.

### /fix-my-pub snippet
**Cluster:** "fix my pub" (pos 5.7), "empty pub". **Source:** GSC. **Intent:** rescue/recovery. **Mode:** Edit existing (title+meta).
**Metadata:** Title ≤50 recovery-first, brand-bearing; description ≤155, price-transparent + 30-day guarantee. **Differentiation:** recovery, not insolvency.

### 4 cluster-leader guides — AEO
**Pages:** `pub-event-ideas`, `pop-up-events-for-pubs`, `quiz-night-ideas`, `quiz-night-101`. **Mode:** Edit existing (content-only). **Task:** visible 40–60w Quick Answer, visible FAQ, author credentials, visible updated date. **Route:** `ai-seo`.

---

## Measurement Framework

### Primary KPIs
| KPI | Baseline (Known) | Target (3 mo) | Target (6 mo) | Forecast |
|---|---|---|---|---|
| Service enquiries | Supabase leads (export needed) + GA4 unverified | Establish + `generate_lead` firing | Grow; report as % | No demand source — directional |
| Priority commercial pages indexed | ~0 of set (June Coverage) | Agency + 4 packages + fix-my-pub set indexed | Full set | Gated on August GSC |
| Commercial-cluster CTR | 0.00–0.24% (12-mo) | ≥1% at current positions | ≥1.5% | Small absolute, high intent |
| Named-channel query clicks | ~4/12mo | Double-digit % of their impressions | Sustained | — |
| Events/quiz clicks | 34/12mo | Hold/grow; bridge CTR measured | Grow | — |

Targets are directional, not modelled — no third-party volume tool is connected and absolute volumes are small.

### GA4 / GTM / Tagging Health
| Area | Status | Evidence | Required fix | Acceptance |
|---|---|---|---|---|
| Installation | Pass | `GTM-WBHJ7Q2H` loads in prod | — | — |
| Consent | Pass | Consent Mode v2 defaults all-denied pre-GTM | — | — |
| Page views | Unverified (SPA risk) | App Router client nav; config tag not visible | Confirm SPA `page_view` fires | DebugView on route change |
| Key events | **Fail (enquiry)** | contact-form success fires nothing | SEO-101 `generate_lead` | Event in DebugView |
| Action tags | Partial | WhatsApp/package clicks push; tel/mailto untracked | SEO-105 | Clicks in GA4 |
| Attribution | Unverified | UTM redirects exist; GA4 admin not visible | User confirms | Channels populate |

Conversion measurement is broken → treated as a Tier-1 prerequisite (SEO-101).

### Tracking Cadence
**Weekly:** Supabase leads + GSC anomalies (30-min triage). **Monthly:** one P-tier slice + KPI review. **Quarterly:** strategy review + AI-citation spot-check.

---

## Post-Launch Validation Plan
| Timing | Check |
|---|---|
| 0–48 h | Deployment, rendered output, status codes, metadata, schema, redirects, tracking (esp. SEO-106 redirect + SEO-101 event) |
| 1–2 wks | Crawl/indexation, GSC errors, sitemap, URL-inspection status |
| 6–8 wks (~mid-August) | Clicks, impressions, CTR, position, conversions vs the frozen `baseline-pre-change.json`; run `measure-delta.py` |

---

## Drift vs Last Run

Fingerprint diff (`build-baseline.py`, June→July): **no true regressions.** The one flagged "canonical-changed" — `/licensees-guide/cash-flow-crisis-breaking-cycle` now canonical→`/fix-my-pub` — is the intended June 410→301 redirect showing up as a crawler-follow artefact (confirmed live: 308→`/fix-my-pub`), **not** a regression. One improvement recorded (schema added on the same URL). 103 "new pages this run" reflect the wider crawl (153 vs June's 50-page cap), not new content.

| Drift type | Entity | Before | Now | Tier-1 action |
|---|---|---|---|---|
| Canonical-changed (benign) | `/licensees-guide/cash-flow-crisis-breaking-cycle` | none | `/fix-my-pub` | None — intended redirect, confirmed live |

**Statement: no regressions vs last run.**

---

## Technical Implementation Notes

**Quick (<2h each):** SEO-107 (sitemap), SEO-115 (404 redirect), SEO-120 (mount newsletter), SEO-124 (schema fields), SEO-126 (entity graph), SEO-127, SEO-128.
**Medium (2–8h):** SEO-106 (routing), SEO-101/102/105 (tracking), SEO-108/111 (snippets), SEO-112 (link rebalance), SEO-118 (dual-CTA), SEO-119 (FAQ render).
**Large (1–5d):** SEO-109/110 (content depth), SEO-113 (hub consolidation), SEO-121/122 (guide passes), SEO-137 (seasonal hub).
**Migration risks:** SEO-106 and SEO-113 change how ranking URLs resolve — both gated (A now, B after August). All changes single-file/additive; each should pass `type-check → lint → test → build` independently; pre-commit hooks enforce British English + no "save/savings".

---

## Out of Scope / Future Considerations
- **GA4 behavioural analysis** — no export supplied; revisit once `generate_lead` accrues data.
- **Backlink strategy depth** — no tool baseline; SEO-133 first.
- **Core Web Vitals** — no field data; SEO-138 first (`CRUX_API_KEY`).
- **Family/kids + net-new pillars** — blocked on keyword-plan.
- **Next review:** after the mid-August GSC refresh (measures June + Tier-1) and a full re-crawl at the 6-month mark (December).

---

*Prepared by the seo-powerhouse skill. Evidence in `tasks/seo-powerhouse/2026-07-07-orangejelly-co-uk/`. All metrics first-party (GSC) or live-crawl unless labelled inferred/WebSearch-observed; no keyword volumes invented; Google SERPs never scraped.*
