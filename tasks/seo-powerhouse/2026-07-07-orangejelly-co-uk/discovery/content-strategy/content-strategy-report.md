# Content Strategy Report — Orange Jelly (orangejelly.co.uk)

**Author:** Content Strategist · **Date:** 2026-07-07 · **Mode:** Full Overhaul, second run
**Builds on:** `discovery/strategy/strategy-document.md` (Strategy Lead, 2026-07-07). This report does not restate strategy — it delivers the page-level content decisions the strategy delegates to Content (its §7 "Content" line and §4 win-list).

**Evidence base:** GSC 12-mo + 28-day exports dated 2026-06-16 (stale, pre-date June fixes); `evidence/` crawl of main @ 6116fe19; `content/blog/*.md` (106 guide files); `src/app/` React commercial pages. Approved metrics from `/CLAIMS.md` only (percentages, all proven at The Anchor). British English; no "save/savings"; Greene King = Tenant, BII = Member.

---

## Content thesis

Orange Jelly's content problem is not "too little" — it is **misallocated finish quality**. The site has 106 guides and a full commercial layer, but its highest-intent commercial pages are either self-cancelling (instagram service page, canonical→homepage, 153 words) or unfinished relative to their siblings, while the informational engine that already earns 6,100+ impressions is starved of the two things that convert impressions to clicks/citations: quotable on-page answer blocks and internal links to the money pages. The July content job is therefore **reclaim, not create**: finish the five named-channel service pages to the standard four of them already half-reach, rework two commercial snippets (instagram, fix-my-pub), prune/consolidate a small tail of thin and duplicate pages, and add answer blocks to four cluster leaders. **No net-new content pillar ships without keyword-plan GKP validation** — the only validated candidate (family/kids events) stays blocked.

The single most important correction to the run brief: **all five named-channel service pages already exist as separate `page.tsx` files.** This is a build-out-and-reclaim exercise, not a create-from-scratch one. Evidence: `find src/app/services` returns instagram/facebook/content-creation/paid-social/social-media-marketing directories, each with a `page.tsx`.

---

## Content Inventory Summary

| Layer | Pages | State |
|---|---|---|
| Informational guides (`/licensees-guide/*`) | 106 `.md` files | The traffic engine (6,100+ impr across events + quiz clusters). Mostly 1,000–3,000 words, quickAnswer frontmatter present on cluster leaders. On-page hygiene fixed in June (dual-H1 removed, guide→service bridge live). |
| Category index pages (`/licensees-guide/category/*`) | 8 live | Three thin: `property` 233w, `food-drink` 243w, `people` 270w. Five fine: `events` 1499w, `operations` 1120w, `marketing` 999w, `turnaround` 763w, `revenue-growth` 651w. |
| Named-channel service pages (`/services/*`) | 5 | **Uneven finish** — see §"Named-channel specs". instagram 153w (broken), social-media 813w, content-creation 536w, paid-social 511w, facebook = redirect (not in crawl inventory). |
| Core commercial | `/fix-my-pub` (678w), `/pub-marketing` (agency intent), `/pub-marketing-agency`, `/compete-with-pub-chains`, `/ways-to-work` + 4 packages | Well-titled; blocked on indexation, not content quality. |
| County/local | 9 `pub-marketing-{county}` pages | 30 impressions total / 12mo. STOP expansion (strategy §4). |

**Guide count reconciliation:** run brief cites ~117 guides; the live `content/blog/` directory holds **106 `.md` files**. The gap is retired/redirected slugs (e.g. `cash-flow-crisis-breaking-cycle` now 308→/fix-my-pub) plus category index pages counted separately. Treat 106 as the working guide count.

---

## 1. Named-channel service content specs (P1 headline)

Each spec says which EXISTING page it maps to, the current state, and the content brief. These become `editorial-team` briefs. Target keywords are Known (the page already ranks for them in GSC) — **not** blocked on keyword-plan, because we are reclaiming inherited rankings, not chasing new demand.

### 1a. `/services/instagram-services-for-pubs` — FULL REBUILD (the one true rebuild)

- **Maps to:** existing `src/app/services/instagram-services-for-pubs/page.tsx`.
- **Current state (Known):** 200, **153 words**, `canonical → homepage`, title = generic boilerplate "Transformative Hospitality Growth Partner | Orange Jelly", meta = generic homepage copy. Ranks **pos 7.0, 256 impr, 0% CTR** for "instagram services for pubs" (`evidence/search-queries.csv`; `opportunities-ctr-gap.csv` row 2 = ~9 clicks/yr on the table). It is a page-one money ranking telling Google to ignore it.
- **Primary keyword:** instagram services for pubs. **Secondary:** instagram marketing for pubs, instagram for pubs, pub instagram management.
- **Intent:** commercial (a licensee comparing whether to hire help for Instagram). They want to see it is pub-specific, done-for-you or done-with-you, priced, and proven.
- **Word target:** 700–900 (parity with the social-media sibling at 813w; enough to beat a 153w stub without bloat).
- **H2 structure:**
  1. What Instagram actually does for a pub (footfall, event fills, table bookings — concrete, not vanity metrics)
  2. What's included (Reels, Stories, grid, local hashtags/geotags, event promotion, response handling)
  3. How we work — phone-first, done in hours (reuse the content-creation page's phone-first framing; cross-link)
  4. Proof: what Instagram-led social did at The Anchor *(one CLAIMS metric — see below)*
  5. Pricing and guarantee (from £375 plus VAT, 30-day guarantee — price-transparent)
  6. FAQ (3–4 Qs: "Do I need to be on camera?", "How often do you post?", "Can you run it or teach me?")
- **CLAIMS metric to use:** `search-visibility` — "Grew Google Search visibility by 828% at The Anchor, our own venue" (the honest, on-topic proof for a visibility service). Do NOT borrow food-revenue here.
- **CTA:** dual — primary "Get an Instagram plan for your pub" → `/contact`; secondary "See how we work" → `/ways-to-work`.
- **Internal links:** in from `social-media-marketing-for-pubs` (hub → channel), `content-creation-for-pubs`, and the `social-media-strategy-for-pubs` guide; out to `/ways-to-work` and `/contact`.
- **Technical dependency (flag to Technical):** self-canonical the page and add to sitemap — content work is wasted while canonical points at the homepage. This is the gating fix.
- **Fix type:** One-off page fix (content) + Template/system (canonical). **Owner:** Content + Technical.

### 1b. `/services/facebook-services-for-pubs` — STUB DECISION (recommend: build to parity)

- **Maps to:** existing `src/app/services/facebook-services-for-pubs/page.tsx` — but the URL is **not in `url-inventory.csv`** (crawler didn't reach a 200 body; live notes imply the `/services/*` siblings are otherwise redirected). Status must be confirmed by Technical (is it 200, redirect, or noindex?).
- **Ranks:** pos 6.1, 123 impr, 0% CTR for "facebook services for pubs" (`opportunities-ctr-gap.csv` row 3 = ~6 clicks/yr). A page-one ranking with no clickable destination.
- **Decision:** **Build to parity with the instagram rebuild** (same H2 skeleton, Facebook-specific: Events, local group seeding, Facebook ads tie-in to `/services/paid-social-for-pubs`). Reasoning per decision tree: valuable keyword (pos 6.1) + intent match achievable + no better page owns it → rewrite/build, not redirect. Redirecting a pos-6 query into a generic hub throws away the ranking.
- **Word target:** 700–900. **Primary:** facebook services for pubs. **CLAIMS metric:** `table-bookings` (+403%) or `private-hire` (+567%) — Facebook Events drive bookings, so this is the honest fit.
- **CTA / links:** as instagram; cross-link instagram ↔ facebook ↔ paid-social as a channel triad under the social-media hub.
- **Technical dependency:** confirm the route resolves 200 and self-canonicals before content ships.
- **Fix type:** One-off page fix. **Owner:** Content + Technical.

### 1c. `/services/social-media-marketing-for-pubs` — LIGHT EXPAND + hub role

- **Maps to:** existing page, **813 words**, proper title ("Social Media Marketing for Pubs — Instagram, Facebook and More"), self-canonical, meta good. This is the strongest of the five.
- **Ranks:** pos 12.0, 380 impr, 0.3% CTR for "social media marketing for pubs" (biggest-impression commercial service query; `opportunities-striking-distance.csv`). Also catches "paid social for pubs" spill.
- **Decision:** Keep & optimise. Make this the **hub** of the channel cluster. Add a short "Which channel do you need?" section linking down to instagram / facebook / paid-social / content-creation. Add one quotable answer block near the top ("Social media marketing for a pub means…") for AEO.
- **Word target:** 900–1,100 (add hub links + answer block; don't rewrite what works).
- **CLAIMS metric:** `search-visibility` (+828%) as the umbrella proof.
- **Fix type:** One-off page fix + internal-link (Template-ish via the channel-triad module). **Owner:** Content.

### 1d. `/services/content-creation-for-pubs` — LIGHT EXPAND

- **Maps to:** existing page, **536 words**, good title ("Content Creation for Pubs — Phone-First, Done in Hours"), self-canonical.
- **Ranks:** pos 14.8, 226 impr, 0% CTR ("content creation for pubs"). **28-day data shows "content creation services for pubs" at pos 2.0** (strategy §4) — a near-top ranking with an unfinished page behind it. This is the highest-leverage of the "already decent" set.
- **Decision:** Keep & optimise; expand to ~800 words. Add: a "what a week of content looks like" concrete example, the batching system detail, and an answer block ("Pub content creation is…"). Explicitly target both "content creation for pubs" and "content creation **services** for pubs" (the pos-2.0 term) in H2s/FAQ.
- **CLAIMS metric:** `search-visibility` (+828%) or `table-bookings` (+403%).
- **Fix type:** One-off page fix. **Owner:** Content.

### 1e. `/services/paid-social-for-pubs` — LIGHT EXPAND

- **Maps to:** existing page, **511 words**, strong title ("Paid Social for Pubs — Meta Ads That Fill Quiet Nights"), self-canonical.
- **Ranks:** pos 11.2, 207 impr, 0% CTR ("paid social for pubs"). Cluster weighted pos 11.2 — genuine page-two-edge reclaim.
- **Decision:** Keep & optimise; expand to ~800 words. Add: a worked example of one quiet-Tuesday campaign (budget band, targeting radius, what "measured on real bookings" means), and an answer block. Cross-link from facebook (ads tie-in) and the `quiet-midweek-solutions` page.
- **CLAIMS metric:** `table-bookings` (+403%) — ads that fill nights → bookings is the honest link.
- **Fix type:** One-off page fix. **Owner:** Content.

**Systemic note:** items 1a–1e share an H2 skeleton, a CTA pattern, and a channel-triad cross-link module. Recommend a **shared service-page content template** (one `Template/system fix`) so the pattern is enforced and future channel pages inherit it, with the five bodies as `One-off page fix` fills against it.

---

## 2. `/fix-my-pub` snippet rework brief

- **Maps to:** existing `src/app/fix-my-pub/page.tsx`, 678 words (body is fine — this is a **snippet-only** rework).
- **Current (Known):** title "Fix My Pub — Emergency Turnaround Help From a Working Licensee | Orange Jelly" (77 chars — right at the truncation edge); meta "Pub in crisis or just struggling? I run one myself…". Ranks **pos 5.3 (28d) / 5.7 (12mo), 109 impr, 0.9% CTR** ("fix my pub"); `opportunities-ctr-gap.csv` row 6 = ~4 clicks/yr on the table.
- **Why it under-clicks:** the SERP for "fix my pub / pub rescue" is dominated by insolvency and closure firms (strategy §4, WebSearch 2026-07-07). A page-one recovery-first result that reads as *recovery, not closure, with a price and a guarantee* is differentiated — but the current snippet buries the recovery/price signals.
- **Recommended title (≤60 chars ideal; keep ≤65):** `Fix My Pub — Recovery Help From a Working Licensee` (drops "Emergency…| Orange Jelly" bloat; leads with the exact query "Fix My Pub"; "Recovery" separates from insolvency results).
- **Recommended meta (≤155 chars):** `Struggling or in crisis? I run a pub myself and help you turn it round — diagnosis, a reset plan, hands-on support. From £375 plus VAT. 30-day guarantee.` (recovery-first, price-transparent, guarantee visible — the three signals that beat the insolvency SERP).
- **CLAIMS metric (optional in-snippet colour, on-page for sure):** none required in the snippet (keep it human); on-page, `table-bookings` (+403%) or `food-revenue` (+98%) as the recovery proof.
- **Constraint:** this stays a **brief** — final copy is `editorial-team`'s. Do not ship this string as-is.
- **Fix type:** One-off page fix. **Owner:** Content. **Effort:** Small. **Validation:** CTR on "fix my pub" rises above 2% in the mid-August GSC export.

---

## 3. Pruning / consolidation

Full per-URL verdicts are in the companion **`content-gap-map.md`**. Summary: **17 URLs** carry a verdict beyond "leave alone". Headline counts — **3 thin category pages → expand; 2 duplicate/near-duplicate guide pairs → consolidate; 1 orphan-ish thin guide → merge; 1 broken 404 → redirect (Technical); ~9 not-indexed commercial/guide URLs → keep+link (indexation, not pruning); 0 recommended for removal/410 without user approval.** No live indexation change (redirect/noindex/remove) is executed here — all are recommendations logged for the Risk Register per the Pruning Safety Rules, requiring explicit user sign-off.

**Key principle applied:** the bulk of the not-indexed list (drilldown-6/7) is **not a content-quality problem** — these are good pages (christmas-pub-event-ideas 1,014w, how-much-profit 3,093w) that Google hasn't indexed because the commercial layer's link equity is trapped in `/capabilities` (1,035 inbound). The verdict for most is **keep + earn internal links**, which is Technical's link-rebalance job, not a prune.

---

## 4. Position-improvement pass list (6 highest-impression pos 10–20 guides)

Source: `opportunities-striking-distance.csv`, filtered pos 10–20, ranked by impressions, restricted to informational guides that already exist (commercial-service queries are handled in §1). Each is a **refresh** (add depth/freshness/answer block + internal links), not a rewrite.

| # | Query | Maps to guide | Pos | Impr | Refresh action |
|---|---|---|---|---|---|
| 1 | event ideas for pubs | `pub-event-ideas` (1,218w) + `how-to-run-successful-pub-events` (2,595w) | 16.8 | 956 | **Highest-impression query on the site.** Pick ONE canonical target (recommend `pub-event-ideas` as the concise list-intent match); add a scannable "20 event ideas" answer block up top; internal-link the other from it. Possible mild cannibalisation between the two — see gap map. |
| 2 | pub event ideas | `pub-event-ideas` (1,218w) | 15.3 | 620 | Same target as #1 — resolve the two-guide overlap first, then refresh once. |
| 3 | profitable menu items / pub menu ideas | `profitable-pub-food-menu-ideas` + `menu-engineering-lift-average-spend` (469w) | 19.0 / 13.9 | 243 / 128 | Refresh `profitable-pub-food-menu-ideas` for the "profitable menu items" list intent; expand the thin (469w) menu-engineering guide or merge its unique angle in. |
| 4 | christmas pub ideas | `christmas-pub-event-ideas` (1,014w) | 14.8 | 209 | Seasonal — ship by early September (see §6). Add a "Christmas pub ideas" answer block; freshen dates to the current festive season. |
| 5 | pub entertainment ideas | (map to `pub-event-ideas` or a dedicated entertainment guide — confirm slug) | 10.1 | 129 | Closest to page one. Add an "entertainment ideas" H2 + answer block to the best-fitting existing guide; a small change could break into the top 10. |
| 6 | pub loyalty scheme | `build-loyalty-scheme-fill-pub` (702w) | 15.7 | 110 | Refresh: add a quotable "how a pub loyalty scheme works" answer block; the guide is decent but under-ranks; cross-link from the loyalty CTA. |

**Honest caveat:** all six queries currently show **(none)** as the ranking page in GSC's page-join and near-0% CTR — the impressions are Known, the exact ranking URL per query is inferred from slug match. Confirm the ranking URL via URL Inspection before editing (cheap, avoids refreshing the wrong page).

---

## 5. AEO / answer-block candidates (handoff to `ai-seo`)

Four cluster-leader guides should get **visible, quotable on-page answer blocks** (a self-contained 40–60 word paragraph rendered near the top of the page body). **Finding:** these guides already carry `quickAnswer` in frontmatter — but that is metadata; the job is to ensure it (or a purpose-written block) renders as extractable on-page HTML that AI answer engines can quote. Confirm with Technical/Editorial whether `quickAnswer` currently renders visibly.

| Guide | Body words | quickAnswer frontmatter | Why it's the citation candidate |
|---|---|---|---|
| `pub-event-ideas` | 1,218 | Present | Cluster leader for the 956-impr "event ideas for pubs" query; active competitor content (smartpubtools, valueforvenues — GK) dated 2026. |
| `how-much-profit-does-a-pub-make` | 3,093 | Present | Definitional YMYL-adjacent query ("how much profit does a pub make") — exactly what AI Overviews summarise; author/expertise signal warranted (Peter, working licensee). |
| `christmas-pub-event-ideas` | 1,014 | Present | Seasonal, high-intent, competitor-contested; answer block ships with the September seasonal refresh. |
| `pub-christmas-bookings-fill-december` | 2,792 | Present | Deep booking-ops guide; strong candidate for "how to fill pub at Christmas" AI answers. |

**For `ai-seo`:** entity to own = "Orange Jelly / Peter Pitcher, working licensee at The Anchor"; dated claims = the CLAIMS percentages with "at The Anchor, our own venue" provenance; author/expertise signal warranted on the profit and Christmas-ops guides; schema must match the visible answer block (no marked-up-but-hidden content). Flag: 138 retired FAQ/HowTo schema blocks (strategy §2 defect 4) — decide with `ai-seo` which FAQ content stays *visible* for AEO vs which retired markup is dropped.

---

## 6. Seasonal — what ships in 6–8 weeks (autumn/Christmas)

It is early July. The 6–8 week window lands **late August / early September** — exactly the run-up to autumn and the point at which Christmas planning searches begin. `src/lib/seasonal-hubs.ts` already defines an **autumn hub** (`autumn-pub-event-ideas`, Sep–Nov, dated calendar: Cask Ale Week → rugby finals) and a summer hub; there is **no Christmas/winter hub object yet**.

**Ships by early September (in priority order):**
1. **Refresh `christmas-pub-event-ideas`** (1,014w, pos 14.8, 209 impr for "christmas pub ideas") — answer block + current-season dates. This is the concrete seasonal win the strategy names.
2. **Refresh `pub-christmas-bookings-fill-december`** (2,792w) — the deep booking guide; freshen for the new festive season, add answer block.
3. **Add a `winter`/Christmas seasonal hub** to `seasonal-hubs.ts` (mirrors the autumn object: dated December calendar — party bookings open, Black Friday gifting, NYE — linking the two Christmas guides + `pub-new-years-eve-planning-guide`). This is a `Template/system fix` (data object + existing SeasonalCalendar component renders it).
4. **Autumn hub is already built** — verify its spokes are indexed and internally linked (`autumn-pub-event-ideas` is in the not-indexed drilldown-6 list → this is an indexation/link job, flag to Technical).

**Note:** "christmas pub ideas" (209 impr) is Known demand the site already ranks for — this seasonal work is reclaim, not speculation, so it needs no keyword-plan gate.

---

## 7. What needs keyword-plan validation (invent NO volumes)

Everything below is **blocked on `keyword-plan` GKP validation** — do not brief, size, or forecast until the orchestrator runs `keyword-plan` and returns validated primary/secondary/local keywords. No volumes are stated because none are available from a connected tool.

| Candidate | Why blocked | Status |
|---|---|---|
| **Family/kids events pillar** | Named in strategy §4 as the one validated *candidate* but still un-validated; guides `how-to-attract-families-to-your-pub`, `family-craft-hour-101` exist and are not-indexed. Whether a pillar is warranted depends on GKP demand for "family friendly pub / kids events pub" terms — unknown. | **BLOCKED — keyword-plan** |
| Any **net-new informational pillar** (e.g. "pub entertainment ideas" as its own hub) | The query shows 129 impr (Known), but standing up a *new pillar* vs refreshing an existing guide needs demand validation across the cluster. | **BLOCKED — keyword-plan** (refresh of existing guide in §4 is NOT blocked) |
| **"digital marketing for pubs" / broad head terms** | Strategy §4 explicitly says do not chase these against agencies with case-study depth. Not a content brief; listed here so it is not accidentally briefed. | **DO NOT BRIEF** |
| County/local expansion | 30 impr / 12mo total — strategy STOP decision. | **DO NOT BRIEF** |

The five named-channel service pages (§1), the fix-my-pub snippet (§2), the position-improvement refreshes (§4), AEO blocks (§5), and the seasonal work (§6) are **all Known-keyword reclaims** and are **not** blocked — they can proceed to `editorial-team` immediately once Technical clears the gating canonical/indexation fixes.

---

## Content Architecture Recommendations

- **Channel-triad cluster:** make `/services/social-media-marketing-for-pubs` the hub; instagram, facebook, paid-social, content-creation are spokes cross-linked to each other and up to the hub. One reusable "related services" module (`Template/system fix`).
- **Guide → service bridge is live** (June SEO-005) — measure it, don't rebuild it. Ensure the refreshed guides in §4 carry the bridge to the *right* service (event guides → nothing hard-sell; profit/marketing guides → `/pub-marketing` or `/ways-to-work`).
- **Internal-link rebalance is the unlock for indexation** (Technical-owned): the not-indexed commercial set and guides need inbound contextual links redistributed from the `/capabilities` sink (1,035 inbound) toward money pages. Content's role: specify *which* contextual links from *which* guides (e.g. `social-media-strategy-for-pubs` guide → `/services/social-media-marketing-for-pubs`).
- **Category pages:** expand the three thin ones (property/food-drink/people) with a 2–3 sentence intro + curated guide list so they earn their index-page keep; the five healthy category pages need nothing.

## Content Briefs

The named-channel specs (§1) and fix-my-pub (§2) ARE the priority briefs, written to editorial-team handoff standard. They intentionally carry: page purpose, target user, primary/secondary keywords (Known from GSC), intent, H2 outline, CLAIMS metric, CTA, internal links, and differentiation angle. Chain: this report + briefs → (§7 items only) `keyword-plan` → `editorial-team` writes/expands/publishes.

---

## Findings

```json
{ "findings": [
  { "finding": "/services/instagram-services-for-pubs is a 153-word stub with title/meta = generic homepage boilerplate ('Transformative Hospitality Growth Partner') and canonical→homepage, while ranking pos 7.0 (256 impr, 0% CTR) for 'instagram services for pubs' — its four sibling channel pages all have proper channel-specific titles and 500-813 words", "evidence": "evidence/url-inventory.csv word_count=153; evidence/page-metadata.csv title 'Transformative Hospitality Growth Partner | Orange Jelly', canonical https://www.orangejelly.co.uk; evidence/search-queries.csv pos 7.0/256 impr/0%; evidence/opportunities-ctr-gap.csv row 2 (~9 clicks/yr)", "source": "collect-site-evidence.py crawl + GSC 12-mo export", "dataStatus": "Known", "severity": "High", "confidence": "High", "impactArea": "revenue", "owner": "Content", "effort": "Medium", "dependencies": "Technical (self-canonical + sitemap) must land first; editorial-team writes body; CLAIMS.md", "fixType": "One-off page fix", "recommendedAction": "Rebuild to 700-900 words on the shared service-page skeleton (what Instagram does for a pub / what's included / phone-first how-we-work / Anchor proof using search-visibility +828% / pricing+guarantee / FAQ); self-canonical; dual CTA; cross-link from social-media hub", "validationStep": "Re-crawl: canonical self-referencing, word_count 700+; CTR on 'instagram services for pubs' rises off 0% in mid-August GSC export", "riskRollback": "Content reversible via git; canonical revert possible" },
  { "finding": "All five named-channel service pages already exist as separate page.tsx files (instagram, facebook, content-creation, paid-social, social-media-marketing) — the P1 task is build-out/reclaim, not create-from-scratch; four are already 500-813 words with proper channel titles, only instagram is broken and facebook is a redirect/stub not reachable in crawl", "evidence": "find src/app/services returns 5 channel directories each with page.tsx; url-inventory word counts: social-media 813, content-creation 536, paid-social 511, instagram 153; facebook not in inventory", "source": "Codebase inspection (main @ 6116fe19) + url-inventory.csv", "dataStatus": "Known", "severity": "Medium", "confidence": "High", "impactArea": "SEO", "owner": "Content", "effort": "Medium", "dependencies": "editorial-team; a shared service-page content template", "fixType": "Template/system fix", "recommendedAction": "Create one shared service-page content template (H2 skeleton, CTA pattern, channel-triad cross-link module); fill instagram (rebuild), facebook (build to parity), and light-expand social-media/content-creation/paid-social against it", "validationStep": "Five service pages share consistent structure; all self-canonical and 700+ words on re-crawl", "riskRollback": "Content reversible via git" },
  { "finding": "/services/facebook-services-for-pubs ranks pos 6.1 (123 impr, 0% CTR) for 'facebook services for pubs' but the URL is absent from the crawl inventory — live status (200 vs redirect vs noindex) is unconfirmed; a page-one ranking may have no clickable destination", "evidence": "evidence/opportunities-ctr-gap.csv row 3 (~6 clicks/yr); evidence/search-queries.csv 'facebook services for pubs' pos 6.1; page absent from evidence/url-inventory.csv; src/app/services/facebook-services-for-pubs/page.tsx exists", "source": "GSC 12-mo export + codebase + crawl inventory", "dataStatus": "inferred", "severity": "High", "confidence": "Medium", "impactArea": "revenue", "owner": "Content", "effort": "Medium", "dependencies": "Technical confirms route resolves 200 + self-canonical; editorial-team", "fixType": "One-off page fix", "recommendedAction": "Confirm route status; build to parity with instagram rebuild (Facebook Events, local groups, ads tie-in to paid-social); CLAIMS metric table-bookings +403% or private-hire +567%; do NOT redirect a pos-6 query into a generic hub", "validationStep": "Route returns 200 self-canonical in re-crawl; CTR on 'facebook services for pubs' off 0% in August GSC", "riskRollback": "Content reversible; no redirect introduced" },
  { "finding": "social-media-marketing (813w, pos 12, 380 impr), content-creation (536w, pos 14.8, 226 impr; 'content creation services for pubs' pos 2.0 in 28-day), and paid-social (511w, pos 11.2, 207 impr) service pages are well-titled and self-canonical but under-developed relative to their commercial intent — light expansion + hub role + answer blocks reclaims inherited near-page-one rankings with zero new rankings required", "evidence": "url-inventory word counts; page-metadata titles/canonicals; opportunities-striking-distance.csv rows for the three queries; strategy-document.md §4 (content creation services for pubs pos 2.0 28d)", "source": "collect-site-evidence.py + GSC 12-mo/28-day", "dataStatus": "Known", "severity": "High", "confidence": "High", "impactArea": "revenue", "owner": "Content", "effort": "Medium", "dependencies": "editorial-team; CLAIMS.md", "fixType": "One-off page fix", "recommendedAction": "Make social-media the channel hub (add 'which channel?' links + answer block, expand to ~1000w); expand content-creation to ~800w targeting both 'content creation for pubs' and 'content creation services for pubs'; expand paid-social to ~800w with a worked quiet-night campaign example", "validationStep": "Commercial-cluster CTR >=1% at stable positions in Aug/Sep GSC exports", "riskRollback": "Content reversible via git" },
  { "finding": "/fix-my-pub (678w, pos 5.3 28d / 5.7 12mo, 0.9% CTR for 'fix my pub') under-clicks because its snippet does not lead with recovery-vs-closure differentiation, price, or guarantee — the query's SERP is dominated by insolvency firms, leaving recovery positioning open", "evidence": "page-metadata.csv title 77 chars 'Fix My Pub — Emergency Turnaround Help…'; search-queries.csv pos 5.7/109 impr/0.9%; opportunities-ctr-gap.csv row 6 (~4 clicks/yr); strategy-document.md §4 WebSearch note", "source": "GSC exports + crawl + WebSearch (compliant SERP notes)", "dataStatus": "Known", "severity": "Medium", "confidence": "High", "impactArea": "revenue", "owner": "Content", "effort": "Small", "dependencies": "editorial-team writes final copy; CLAIMS.md", "fixType": "One-off page fix", "recommendedAction": "Rework title to ~50 chars leading with 'Fix My Pub — Recovery Help From a Working Licensee'; meta recovery-first + price-transparent (from £375 plus VAT, 30-day guarantee). Brief only — editorial-team finalises copy", "validationStep": "CTR on 'fix my pub' rises above 2% in mid-August GSC export", "riskRollback": "Title/meta revert via git" },
  { "finding": "Three category index pages are thin: /licensees-guide/category/property (233w), /food-drink (243w), /people (270w); five sibling category pages are healthy (events 1499w, operations 1120w, marketing 999w, turnaround 763w, revenue-growth 651w) — a systemic thin-index pattern isolated to three categories", "evidence": "evidence/url-inventory.csv word_count column for all 8 /licensees-guide/category/* URLs", "source": "collect-site-evidence.py crawl", "dataStatus": "Known", "severity": "Low", "confidence": "High", "impactArea": "SEO", "owner": "Content", "effort": "Small", "dependencies": "editorial-team; category template accepts intro copy", "fixType": "Template/system fix", "recommendedAction": "Add a 2-3 sentence category intro + curated guide list to property/food-drink/people via the category template so index pages earn their keep; leave the five healthy categories untouched", "validationStep": "Three pages exceed ~400 words on re-crawl and stay indexed", "riskRollback": "Content reversible via git" },
  { "finding": "The bulk of the not-indexed URL set (drilldown-6 44 URLs, drilldown-7 30 URLs) is high-quality content (e.g. christmas-pub-event-ideas 1014w, how-much-profit-does-a-pub-make 3093w, how-to-run-successful-pub-events 2595w) — these are not pruning candidates; they are un-indexed because commercial-layer link equity is trapped in /capabilities. Verdict for most: KEEP + earn internal links", "evidence": "evidence/indexation-urls.csv drilldown-6/7; content/blog word counts; strategy-document.md §2 defect 3 (/capabilities 1035 inbound)", "source": "GSC Coverage export 2026-06-16 + content/blog inspection", "dataStatus": "Known", "severity": "Medium", "confidence": "High", "impactArea": "crawl/indexing", "owner": "Content", "effort": "Medium", "dependencies": "Technical link-rebalance is the primary unlock; Content specifies contextual links", "fixType": "Template/system fix", "recommendedAction": "Do NOT prune the not-indexed guides; specify contextual internal links from related indexed guides/hubs into the not-indexed commercial and seasonal pages; pair with Technical's /capabilities link redistribution and August GSC re-check", "validationStep": "Not-indexed guides gain inbound contextual links; exit not-indexed state in August Coverage export", "riskRollback": "Additive links — reversible" },
  { "finding": "Six highest-impression pos 10-20 informational guide queries are refresh candidates: 'event ideas for pubs' (956 impr, pos 16.8) + 'pub event ideas' (620) both map to pub-event-ideas/how-to-run-successful-pub-events (possible overlap); 'profitable menu items' (243) + 'pub menu ideas' (128); 'christmas pub ideas' (209); 'pub entertainment ideas' (129); 'pub loyalty scheme' (110)", "evidence": "evidence/opportunities-striking-distance.csv filtered pos 10-20 by impressions; content/blog word counts (pub-event-ideas 1218w, menu-engineering 469w, christmas-pub-event-ideas 1014w, build-loyalty-scheme 702w)", "source": "GSC 12-mo export + content/blog inspection", "dataStatus": "Known", "severity": "Medium", "confidence": "Medium", "impactArea": "SEO", "owner": "Content", "effort": "Medium", "dependencies": "editorial-team; URL Inspection to confirm ranking URL per query before editing", "fixType": "Content process fix", "recommendedAction": "Refresh (not rewrite) each: add scannable answer block + depth + internal links; resolve the pub-event-ideas / how-to-run-successful-pub-events overlap by choosing one canonical target for the events query and linking the other", "validationStep": "Target guides improve from pos 10-20 toward page one in Aug/Sep GSC; CTR off 0% on the six queries", "riskRollback": "Content reversible via git" },
  { "finding": "Possible cannibalisation on the events cluster: pub-event-ideas (1218w) and how-to-run-successful-pub-events (2595w) both target 'event ideas for pubs'/'pub event ideas' (combined 1576 impr, the site's biggest informational demand); GSC page-join shows (none) so exact split is unconfirmed", "evidence": "evidence/opportunities-striking-distance.csv rows 1-2; content/blog both files exist with overlapping intent; opportunities-cannibalisation.csv = 0 rows (page-join empty)", "source": "GSC 12-mo export + content/blog inspection", "dataStatus": "inferred", "severity": "Medium", "confidence": "Medium", "impactArea": "SEO", "owner": "Content", "effort": "Small", "dependencies": "URL Inspection to confirm which URL Google ranks for the query", "fixType": "One-off page fix", "recommendedAction": "Confirm ranking URL via URL Inspection; designate pub-event-ideas as the concise list-intent canonical for 'event ideas for pubs' and how-to-run-successful-pub-events as the deep how-to; cross-link and differentiate H1/intro so they stop competing", "validationStep": "One URL consolidates impressions for the events query; positions improve", "riskRollback": "Content-only, reversible" },
  { "finding": "Four cluster-leader guides already carry quickAnswer frontmatter but need it rendered as visible, extractable on-page answer blocks for AI-answer citation: pub-event-ideas, how-much-profit-does-a-pub-make, christmas-pub-event-ideas, pub-christmas-bookings-fill-december; competitors smartpubtools.com and Greene King's valueforvenues.co.uk run 2026-dated content on the same topics", "evidence": "content/blog frontmatter grep: quickAnswer present on all four; body words 1218/3093/1014/2792; strategy-document.md §4 competitor note; strategy findings SEO-022 (Monitor)", "source": "content/blog frontmatter inspection + WebSearch (compliant)", "dataStatus": "Known", "severity": "Medium", "confidence": "Medium", "impactArea": "AI visibility", "owner": "Editorial", "effort": "Medium", "dependencies": "ai-seo skill owns AEO tactics; Technical/Editorial confirm quickAnswer renders visibly; entity graph (SEO-017)", "fixType": "Content process fix", "recommendedAction": "Hand these four pages + entity ('Orange Jelly / Peter Pitcher, working licensee at The Anchor') to ai-seo; ensure a 40-60 word quotable answer block renders on-page near the top; add author/expertise signal to the profit and Christmas-ops guides; schema must match visible content", "validationStep": "Answer blocks render on-page; AI-surface citation spot-checks quarterly (manual, dated)", "riskRollback": "Content-only, reversible" },
  { "finding": "No Christmas/winter seasonal hub object exists in src/lib/seasonal-hubs.ts (only summer + autumn defined), yet 'christmas pub ideas' already earns 209 impr at pos 14.8 and the 6-8 week window lands early September — the run-up to festive booking demand", "evidence": "src/lib/seasonal-hubs.ts SEASON_HUBS array contains summer + autumn only, no winter/christmas object; search-queries.csv 'christmas pub ideas' 209 impr pos 14.8; christmas guides exist (christmas-pub-event-ideas, pub-christmas-bookings-fill-december)", "source": "Codebase inspection + GSC 12-mo export", "dataStatus": "Known", "severity": "Medium", "confidence": "High", "impactArea": "SEO", "owner": "Content", "effort": "Medium", "dependencies": "SeasonalCalendar component (already exists) renders the data object; editorial-team refreshes the two Christmas guides", "fixType": "Template/system fix", "recommendedAction": "By early September: refresh christmas-pub-event-ideas + pub-christmas-bookings-fill-december (answer blocks, current-season dates); add a winter/Christmas hub object to seasonal-hubs.ts mirroring the autumn object; verify autumn hub spokes are indexed/linked", "validationStep": "Winter hub renders; two Christmas guides refreshed and indexed before festive search peak", "riskRollback": "Data-object addition reversible; content via git" },
  { "finding": "Family/kids events pillar remains the only candidate net-new pillar but is un-validated; supporting guides (how-to-attract-families-to-your-pub, family-craft-hour-101) exist and are not-indexed. No search volume is available from any connected tool — pillar decision is blocked", "evidence": "strategy-document.md §4 (family/kids blocked on keyword-plan); indexation-urls.csv drilldown-6 contains how-to-attract-families-to-your-pub; no keyword volume tool connected", "source": "strategy-document.md + GSC Coverage + no volume source", "dataStatus": "unavailable", "severity": "Low", "confidence": "High", "impactArea": "SEO", "owner": "Content", "effort": "Large", "dependencies": "keyword-plan (interactive, orchestrator-run) must return validated GKP keywords first", "fixType": "Content process fix", "recommendedAction": "Do NOT brief, size, or forecast the family/kids pillar until keyword-plan returns validated primary/secondary/local keywords; index the two existing family guides via internal links in the meantime (no new pillar commitment)", "validationStep": "keyword-plan output received before any pillar brief is written", "riskRollback": "n/a — decision gate, not a change" }
] }
```
