# SEO Copywriting Assessment — Orange Jelly (orangejelly.co.uk)

**Author:** SEO Copywriter · **Date:** 2026-07-07 · **Mode:** Full Overhaul, second run
**Scope (Strategy §7 Content lane):** named-channel service page bodies (June SEO-010), fix-my-pub title/meta snippet rework, position-improvement passes on high-impression pages. I produce **specs and page-level assessments** — final published copy is editorial-team's job.

---

## Summary

Six priority commercial pages assessed against their target queries (from `evidence/search-queries.csv`), the CTR gap they leave (`evidence/opportunities-ctr-gap.csv`), and current metadata (`evidence/page-metadata.csv`). One material correction to the strategy's premise sits at the top of this report because it changes what the Content lane should do.

**Headline: the crawl snapshot is stale on the channel pages.** `evidence/page-metadata.csv` shows `/services/instagram-services-for-pubs` as a live 153-word page with canonical→homepage and an empty H1. **The live code has already moved past this.** As of `main` @ 6116fe19:

- `src/app/services/instagram-services-for-pubs/page.tsx` → `permanentRedirect('/services/social-media-marketing-for-pubs')`
- `src/app/services/facebook-services-for-pubs/page.tsx` → `permanentRedirect('/services/social-media-marketing-for-pubs')`

So the "self-cancelling money ranking" defect (strategy §2 defect 1) is **already resolved in code** — both channel pages now consolidate into the `social-media-marketing-for-pubs` hub, which already carries dedicated `Instagram for Pubs` and `Facebook for Pubs` H2 blocks. The consolidation decision the strategy anticipated has effectively been made. **My named-channel brief therefore targets the hub's channel sections and the JSON-fed service pages that still render — not resurrecting standalone thin pages.** Recommendation: confirm the redirect is live in production and that `social-media-marketing-for-pubs` is in the sitemap and self-canonical (it currently is **not in the sitemap** per `url-inventory.csv` `in_sitemap=no`), then request indexing. That sitemap gap is the live blocker on the inherited Instagram/Facebook rankings, not the page body.

**Biggest genuine copy opportunities (in priority order):**

1. **`/fix-my-pub` snippet rework (P1, highest click-per-effort).** Title is 77 chars (truncates ~63), meta is 182 chars (truncates ~155). Ranks pos 5.7 / 0.9% CTR for "fix my pub" — ~3.9 clicks/yr left on table. Recovery-first, price-transparent snippet that reads distinctly from the insolvency firms on the SERP.
2. **Named-channel service pages (`paid-social`, `content-creation`, `social-media` hub) content depth.** `paid-social` (511w) and `content-creation` (536w) are below the ~600-900 target for their intent; the social hub (813w) is close but its channel sections are thin cards. These are JSON-driven — briefs feed `content/data/services/*.json` and the hub `page.tsx` sections.
3. **`/quiet-midweek-solutions` and `/compete-with-pub-chains`** are well-built already (742w / 753w, single clean H1, on-intent H2 skeleton) — position-improvement passes, not rewrites.

**Voice/CLAIMS compliance across reviewed pages: clean.** No retired metrics, no "save/savings", British English throughout, £75 + VAT / from £375 + VAT pricing consistent, 30-day guarantee present. One note below on the social hub's Instagram/Facebook copy using an implied "AI assistance" line that is fine but worth a consistency check against tone docs.

---

## Page-by-Page Recommendations

### 1. `/fix-my-pub` — SNIPPET REWORK (priority)

**Target query:** `fix my pub` (primary) · secondary: `empty pub`, `struggling pub help`, `pub turnaround`
**Current status:** pos 5.7 (12mo) / 5.3 (28d), 109 impr, 0.9% CTR — page-one ranking under-clicking by ~3.9 clicks/yr vs curve (`opportunities-ctr-gap.csv` row 6). Rescue SERP is dominated by insolvency/closure firms (strategy §4.2), leaving recovery-first positioning open. Page body itself is good: 678 words, single H1, strong H2 skeleton, The Anchor proof, 30-day guarantee, packages from £375. **The body does not need rewriting; the SERP snippet does.**

**The gap:** Title 77 chars truncates in SERP to roughly "Fix My Pub — Emergency Turnaround Help From a Working Licen…" — the payoff words ("Working Licensee") get cut and "Orange Jelly" never shows. Meta 182 chars truncates ~mid-sentence, losing the "Packages from £375 + VAT" price signal that differentiates from insolvency firms who never quote price.

#### Metadata

| Element | Current | Recommended | Notes |
|---------|---------|-------------|-------|
| Title | "Fix My Pub — Emergency Turnaround Help From a Working Licensee \| Orange Jelly" (77) | **"Fix My Pub — Turnaround Help From a Real Licensee"** (49) | Leads with exact query; "Real Licensee" is the differentiator vs insolvency firms; fits without truncation; drops "\| Orange Jelly" (brand is weak here, the promise earns the click). |
| Meta description | "Pub in crisis or just struggling? I run one myself. Tell me what is wrong and I will show you the fastest fix — diagnosis, reset plan, and hands-on support. Packages from £375 + VAT." (182) | **"Struggling pub, not a closing one. I run The Anchor and help licensees fix the fastest thing first — diagnosis, reset plan, hands-on support. From £375 + VAT."** (154) | Recovery-first framing ("not a closing one") explicitly separates from insolvency results; states provenance (The Anchor); keeps price signal inside the truncation limit; ends on the price, which is the click trigger vs no-price competitors. |
| H1 | "Pub Struggling? Let's Fix It." | **Keep** | On-intent, human, matches the query's emotional register. No change. |

**Recommended action (implementation):** edit the `generateMeta({ title, description })` call in `src/app/fix-my-pub/page.tsx` (lines ~13-19). Title/meta only — do not touch the body or `content/data/services/fix-my-pub.json`.
**Validation:** re-fetch `/fix-my-pub`; confirm title ≤60 and meta ≤155 chars; CTR on "fix my pub" rises above 2% in the mid-August GSC export.
**Risk/rollback:** title/meta revert via git. No ranking dependency.

#### Content improvements
None required for ranking. Optional AEO enhancement (defer to Editorial): the opening 100 words could carry one self-contained quotable answer block — "If your pub is struggling, fix the single biggest bottleneck first, not everything at once" — to earn AI-answer citations on "how to fix a struggling pub" style prompts. Low priority, cheap.

#### Internal linking
Already well-linked as a destination (cash-flow guide 301s here). No additions needed from this page.

---

### 2. `/pub-marketing-agency`

**Target query:** `pub marketing agency` (304 impr, pos 19.6, 0 CTR) · `marketing agency for pubs` (161 impr, pos 18.3) · `pub marketing` (666 impr, pos 22.3)
**Current status:** 1,002 words, single H1, on-intent H2 skeleton, canonical self-referencing. Copy quality is good — the blocker here is **not copy, it is cannibalisation and indexation**, not in my lane (five hubs compete for agency intent; strategy P2/§2 SEO-029; the page was Discovered-not-indexed in June). Position 18-22 with 0 clicks is an indexation/authority problem, not a snippet problem.

#### Metadata

| Element | Current | Recommended | Notes |
|---------|---------|-------------|-------|
| Title | "Pub Marketing Agency for Independent Pubs & Bars" (48) | **"Pub Marketing Agency Run by a Working Licensee"** (46) | Current is fine but generic — every competitor leads "for independent pubs". The differentiator ("run by a working licensee") is the one thing no agency competitor can claim; lead with it to earn the click once indexed. Keep exact-match "Pub Marketing Agency" first. |
| Meta description | "A pub marketing agency run by a working licensee, not account managers. Social, events, paid ads, and local SEO built for independent pubs. Packages from £375 + VAT." (165) | **"A pub marketing agency run by a working licensee — not account managers. Social, events, paid ads and local SEO for independent pubs. From £375 + VAT."** (150) | Trim to ≤155 so the price signal survives truncation; content is already strong. |
| H1 | "A Hospitality Marketing Agency That Actually Runs a Pub" | **"Pub Marketing Agency That Actually Runs a Pub"** | Current H1 says "Hospitality" where the query is "Pub" — align H1 to the exact target query for intent match; keep the differentiator clause. |

**Note (out of my lane, flag to Technical/Strategy):** copy fixes here return nothing until the hub cannibalisation (SEO-029) is resolved and the page is indexed. Sequence copy AFTER the hub decision, not before. Do not invest in body rewrites until this page is the confirmed canonical agency hub.
**Validation:** H1 contains "Pub Marketing Agency"; meta ≤155; then depends on indexation (GSC re-export).
**Risk/rollback:** metadata/H1 revert via git.

---

### 3. `/compete-with-pub-chains`

**Target query:** `compete with pub chains` / `pub vs chain` / `independent pub vs wetherspoons` (low direct volume in GSC; `uk pub chains orange spritz summer 2026` 7 impr is off-intent noise). This is a **differentiation/positioning page** serving mid-funnel intent more than a high-volume query target.
**Current status:** 753 words, single clean H1 ("Stop Competing on Price. Start Winning on Experience."), excellent on-intent H2 skeleton, The Anchor/Wetherspoons proof present. Well-built. Was Discovered-not-indexed in June (strategy §3).

#### Metadata

| Element | Current | Recommended | Notes |
|---------|---------|-------------|-------|
| Title | "Compete with Pub Chains - Practical Challenger Strategy \| Orange Jelly" (70) | **"How to Compete With Pub Chains as an Independent"** (48) | Current truncates at 70 (loses "\| Orange Jelly"); reframe to the natural-language question form people actually search/ask AI ("how to compete with…"); fits clean. |
| Meta description | "Stop losing customers to chain pubs. Practical strategies to compete through differentiation, community, and experience. Packages from £375 + VAT." (146) | **Keep** (146, on-intent, price signal present, differentiation-led) | No change needed. |
| H1 | "Stop Competing on Price. Start Winning on Experience." | **Keep** | Strong, on-intent, benefit-led. No change. |

#### Content improvements
AEO opportunity (defer to Editorial): the page answers a question AI assistants get asked ("how can an independent pub compete with a chain?"). Add one concise quotable answer block in the first 100 words. Low priority, content-only.
**Validation:** title ≤60; indexation via GSC re-export.

---

### 4. `/ways-to-work`

**Target query:** `pub marketing packages` / `pub marketing pricing` / navigational (this is the pricing/packages hub, low direct search intent — it is a conversion destination, not a ranking target).
**Current status:** 960 words, single H1, clean packages/compare/add-ons/FAQ skeleton, canonical self-referencing, in sitemap. Serves its conversion job well. **Residual issue (Technical, not mine):** internal links still point at `/services` which 301s here (strategy §2 SEO-007).

#### Metadata

| Element | Current | Recommended | Notes |
|---------|---------|-------------|-------|
| Title | "Pub Marketing Packages — Clear Pricing, Real Expertise \| Orange Jelly" (69) | **"Pub Marketing Packages & Pricing — From £375 + VAT"** (50) | Current truncates ~63 (loses brand); put the price in the title — a price in the SERP snippet is a strong qualifier/click driver for a pricing-intent page and no competitor does it. |
| Meta description | "Four clear packages for pub and hospitality marketing. From a one-off Growth Fix to ongoing Growth Partner support. Payment plans available. No hidden fees." (156) | **"Four clear pub marketing packages, from a one-off Growth Fix (£375 + VAT) to ongoing Growth Partner support. Payment plans, no hidden fees, 30-day guarantee."** (155) | Add the concrete entry price and the 30-day guarantee — both are trust/qualifier signals for a pricing page. |
| H1 | "Clear packages. Honest pricing. Real hospitality expertise." | **Keep** | On-brand, conversion-appropriate. No change. |

**Note:** low search-intent page — metadata is for the branded/navigational clicks and internal-link equity, not a keyword play. Do not over-invest.
**Validation:** title ≤60; meta ≤155.

---

### 5. `/quiet-midweek-solutions`

**Target query:** `how to increase midweek revenue for a pub or bar?` (25 impr, pos 8.2) · `which brands fail to drive repeat midweek visits?` (5 impr, pos 5.8) · `quiet pub midweek` / `fill midweek nights`
**Current status:** 742 words, single H1 ("Turn Quiet Midweek Nights Into Your Best Trade"), strong on-intent H2 skeleton (cost-of-empty-night → Anchor proof → proven formats → Growth Fix → FAQ). Canonical self-referencing, in sitemap. Was Crawled-not-indexed in June (strategy §3). Genuinely good page. Best-positioned query already sits pos 8.2 — a position-improvement target, not a rewrite.

#### Metadata

| Element | Current | Recommended | Notes |
|---------|---------|-------------|-------|
| Title | "Quiet Midweek? Fill Tuesday & Wednesday Nights" (46) | **Keep** (46, benefit-led, specific, on-intent) | No change — strong as is. |
| Meta description | "Turn dead midweek nights into reliable trade with proven Tuesday and Wednesday formats tested at The Anchor, tailored to your pub. Packages from £375 + VAT." (156) | **Trim to ≤155:** "Turn dead midweek nights into reliable trade with proven Tuesday and Wednesday formats tested at The Anchor. Packages from £375 + VAT." (133) | Only fix is length; the "tailored to your pub" clause is the trimmable padding. |
| H1 | "Turn Quiet Midweek Nights Into Your Best Trade" | **Keep** | No change. |

#### Content improvements — position-improvement pass (defer specifics to Editorial)
The page ranks pos 8.2 for a natural-language question. To push toward page-one top-5 and win the AI-answer:
- Add a concise, directly-answering block for "how to increase midweek revenue for a pub" in the first 150 words — a numbered "3 things that reliably fill a quiet midweek" list is highly quotable for AI Overviews and featured snippets.
- The "Proven Midweek Event Formats" H2 should name specific formats (quiz, steak night, etc.) as H3s so they match long-tail midweek queries.
**Validation:** meta ≤155; position on the midweek query improves toward top-5 in mid-August GSC export.

---

### 6. `/services/instagram-services-for-pubs` (and `/services/facebook-services-for-pubs`) — CONSOLIDATED, NOT REWRITTEN

**Target query:** `instagram services for pubs` (256 impr, pos 7.0, 0 CTR — 9.0 clicks/yr left on table, the single biggest channel-query gap) · `facebook services for pubs` (123 impr, pos 6.1, 5.5 clicks/yr) · `instagram for pubs`, `facebook for pubs`.
**Current status (LIVE, corrected from stale crawl):** both pages now `permanentRedirect` to `/services/social-media-marketing-for-pubs`. The 153-word canonical-to-homepage page in `page-metadata.csv` no longer exists. The inherited page-one rankings for these queries will resolve to the social-media hub via the 308 redirect.

**This is the highest-value channel opportunity on the site (14.5 clicks/yr across the two queries) and the fix is now indexation, not copy:**

1. **`/services/social-media-marketing-for-pubs` is NOT in the sitemap** (`url-inventory.csv`: `in_sitemap=no`). The redirect target of two page-one rankings is invisible to the sitemap. **This is the live blocker.** → add it (Technical), request indexing.
2. The hub already carries an `Instagram for Pubs` H2 and a `Facebook for Pubs` H2 (in `page.tsx`, not JSON) with 813 words total — enough to be a credible destination for both inherited rankings.
3. **Copy job (my lane):** the two on-page channel sections are currently generic 3-card blocks. They should be strengthened so the hub genuinely deserves the "instagram services for pubs" / "facebook services for pubs" rankings it inherits — see brief in the next section.

#### Metadata (the hub)

| Element | Current | Recommended | Notes |
|---------|---------|-------------|-------|
| Title | "Social Media Marketing for Pubs — Instagram, Facebook and More \| Orange Jelly" (77) | **"Instagram & Facebook Marketing for Pubs"** (40) | Current truncates ~63 and buries "Instagram, Facebook" past the fold; because this page now absorbs the Instagram/Facebook rankings, lead with the two channel names people actually search. Keeps "for Pubs" exact-match. |
| Meta description | "Social media marketing for pubs across Instagram and Facebook: a repeatable plan, templates, and execution rhythm that drives bookings and footfall. Packages from £375 + VAT." (174) | **"Instagram and Facebook marketing for pubs: a repeatable plan, templates, and a weekly rhythm that fills tables — not just likes. From £375 + VAT."** (146) | Lead with both channel names (matches inherited queries); ≤155; "fills tables not just likes" is the pub-specific benefit hook. |
| H1 | "Social Media Marketing for Pubs" | **"Instagram & Facebook Marketing for Pubs"** | Align H1 to the queries the page now ranks for; "Social Media Marketing" is the category, "Instagram & Facebook" is the search language. |

**Validation:** hub in sitemap; redirects return 308; re-fetch confirms self-canonical; CTR on "instagram services for pubs" / "facebook services for pubs" rises off 0% in mid-August GSC export.
**Risk/rollback:** metadata/H1 revert via git; sitemap/redirect changes are Technical's, reversible.

---

## Named-Channel Content Briefs (feed editorial-team → `content/data/services/*.json` + hub `page.tsx`)

These are content briefs, not final copy. Each maps to the existing JSON schema (`hero`, `intro.paragraphs`, `deliverables.items`, `process.steps`, `faqs`, `cta`) or the hub's inline channel sections. **CLAIMS rule for all:** use only the five approved percentages, always attributed to The Anchor; British English; no "save/savings"; one CLAIMS metric per page minimum.

### Brief A — `social-media-marketing-for-pubs` hub (the priority — absorbs Instagram + Facebook rankings)

- **Intent:** commercial/comparison — a licensee searching "instagram/facebook services for pubs" wants to know *what they get, whether it works for a pub, and what it costs*. They are choosing a provider.
- **Word target:** grow from 813 → ~900-1,000 (adds channel depth without bloat).
- **H2 structure (existing skeleton is sound — strengthen the two channel blocks):**
  - Hero + intro: keep.
  - `What you get` / `How it works` / `Real Results from The Anchor`: keep; ensure the Results block leads with the **`search-visibility` +828%** claim (visibility is the on-topic proof for social/discovery) and states "proven at The Anchor".
  - **`Instagram for Pubs`** (H2): replace the three generic cards with pub-specific substance answering "instagram services for pubs" intent — (1) what an Instagram-for-pubs service actually covers (Reels/Stories cadence, local hashtag/geo routine, event-selling captions), (2) a named weekly rhythm, (3) one line on measurement (bookings, not likes). Add an H3 FAQ-style line "Do I need to be on camera?" (answer: no).
  - **`Facebook for Pubs`** (H2): same depth — Events, local groups playbook, reviews/reputation; keep the existing "why Facebook still matters for pubs" list, expand to name the booking-link/menu setup.
- **Internal links:** link "paid ads" mentions → `/services/paid-social-for-pubs`; "content" mentions → `/services/content-creation-for-pubs`; a CTA → `/ways-to-work`. Add a contextual link from `/pub-marketing` and `/pub-marketing-agency` bodies INTO this hub with anchor "social media marketing for pubs" (Technical/Editorial).
- **CTA:** existing WhatsApp CTA + `/ways-to-work` — keep.
- **AEO:** first 100 words should contain a quotable answer to "what does social media marketing for a pub involve?".
- **CLAIMS metric:** `search-visibility` +828% (primary); optionally `table-bookings` +403% as the "fills tables" payoff.

### Brief B — `paid-social-for-pubs` (below depth target: 511w → ~650-750w)

- **Intent:** commercial — "paid social for pubs" / "social media ads for pubs" (pos 11.2, 207 impr). Licensee wants to know paid ads can work on a small budget for a single night.
- **Gap:** 511 words is thin for a commercial service page; the strategy flags it as a P1 reclaim target. The single-night-selling angle in the current title/meta is strong — the body needs to deliver it.
- **H2/section brief (maps to JSON):**
  - `intro.paragraphs`: keep the "paid social works when you sell one thing" thesis; add one paragraph on realistic small budgets (no invented figures — describe the approach, not a £ number that isn't in CLAIMS).
  - `deliverables.items`: ensure it covers audience/geo targeting, creative, one-night campaign structure, and booking-based measurement.
  - `process.steps`: 3-4 steps from "pick the night" → "build the offer" → "target locally" → "measure on bookings".
  - `faqs`: the 5 existing are good ("Do I need a big ad budget?" etc.) — keep.
- **CLAIMS metric:** `table-bookings` +403% (the on-topic "ads fill tables" proof), attributed to The Anchor. Do NOT invent ad ROAS/CPC figures.
- **Internal links:** → `/services/content-creation-for-pubs` (creative feeds ads), → `/quiet-midweek-solutions` (paid social to fill a quiet night), → `/ways-to-work`.
- **Word target justification:** the two sibling channel pages sit at 536-813w; 650-750 brings paid-social to parity for the same intent depth (not an arbitrary number).

### Brief C — `content-creation-for-pubs` (536w → ~650-750w)

- **Intent:** commercial — "content creation for pubs" (pos 14.8, 226 impr) / "content creation services for pubs" (pos 8.8, 86 impr — near page-one, higher-priority reclaim). Licensee wants photos/Reels/captions without hiring an agency or learning editing.
- **Gap:** 536 words; "content creation services for pubs" at pos 8.8 is a genuine near-page-one reclaim. The phone-first/batching angle is differentiated — deepen it.
- **H2/section brief:**
  - `intro.paragraphs`: keep "better content, less time"; add the batching-in-one-session thesis explicitly.
  - `deliverables.items`: photos, Reels, captions, a reusable batching system/template pack, a monthly content calendar.
  - `process.steps`: "one filming session → batch edit → schedule a month" — make the time-efficiency concrete without using retired "25 hours/week" style raw-number claims.
  - `faqs`: existing 5 are strong (pro photos? / on camera? / how long? / consistent? / cost?) — keep.
- **CLAIMS metric:** `search-visibility` +828% (content drives visibility/discovery) attributed to The Anchor.
- **Internal links:** → `/services/social-media-marketing-for-pubs` (where the content gets used), → `/services/paid-social-for-pubs` (content feeds ads), → `/ways-to-work`.
- **Word target justification:** parity with the social hub's per-intent depth; "content creation services for pubs" at pos 8.8 justifies the investment.

### Briefs D/E — Instagram & Facebook standalone pages: DO NOT RECREATE

Both now redirect into the hub (correct decision — one strong page beats two thin ones for overlapping intent). Editorial should put the Instagram/Facebook substance into the **hub's channel sections** (Brief A), not resurrect standalone pages. If a future keyword-plan shows standalone Instagram/Facebook demand large enough to warrant separate pages, revisit — no evidence for that today.

---

## CLAIMS / Voice / British-English Compliance Notes

Reviewed all six priority pages plus the three named-channel JSON files and the social hub component. **No violations found:**

- No retired metrics (no "25 hours", "£75-100K value added", "58%→71% GP", "60-70K social views") appear on any reviewed page.
- No "save/savings" language; British English throughout ("optimise", "programme"-style usage consistent).
- Pricing consistent: £75/hour + VAT, packages from £375 + VAT, 30-day guarantee.
- Greene King / BII language not present on these commercial pages (n/a here).
- **One consistency note (not a violation):** the social hub's Instagram tips list references "Batch content in one session per week using AI assistance" — fine, but AI-efficiency framing is what CLAIMS deliberately moved *away* from (retired-claims rationale). When Editorial deepens the channel sections, lead with the booking/visibility benefit, keep "AI assistance" as a method aside, not a headline. Flag to Editorial, low priority.
- **Approved metric coverage gap (opportunity, not violation):** the three channel service-page JSON files are light on CLAIMS proof points in the body. Briefs A-C above each specify which approved metric to add — this strengthens both conversion and AEO credibility.

---

## Fix Type Rollup (for orchestrator)

- **Template/system fix:** add `social-media-marketing-for-pubs` to sitemap (Technical); this unblocks the two highest-value inherited channel rankings.
- **One-off page fix:** `/fix-my-pub` snippet rework (priority); metadata trims on `ways-to-work`, `compete-with-pub-chains`, `quiet-midweek-solutions`, `pub-marketing-agency` H1 alignment; social hub title/H1 realignment to Instagram/Facebook.
- **Content process fix:** channel-page depth briefs A-C → editorial-team (add CLAIMS metric, reach ~650-1,000w parity, strengthen hub channel sections).
- **Out of my lane (flagged):** hub cannibalisation (SEO-029) gates `pub-marketing-agency` copy ROI; `/services` internal-link repoint (SEO-007); sitemap/redirect confirmation — all Technical.

---

## Handoff: which pages need editorial-team

- **`social-media-marketing-for-pubs` hub** — Brief A (priority: absorbs Instagram + Facebook rankings; deepen channel sections + add CLAIMS metric).
- **`paid-social-for-pubs`** — Brief B (511w → 650-750w).
- **`content-creation-for-pubs`** — Brief C (536w → 650-750w; "content creation services for pubs" pos 8.8 reclaim).
- Position-improvement AEO passes (answer-blocks) on `quiet-midweek-solutions`, `compete-with-pub-chains`, `fix-my-pub` — content-only, low priority, Editorial/AEO lane.

The four snippet/metadata reworks (`fix-my-pub`, `ways-to-work`, `compete-with-pub-chains`, `quiet-midweek-solutions`, `pub-marketing-agency`, social hub) are one-off `generateMeta()` edits — direct implementation tickets, no editorial process needed.

---

```json
{ "findings": [
  { "finding": "/fix-my-pub title is 77 chars (truncates ~63, losing 'Working Licensee' + brand) and meta is 182 chars (truncates ~155, losing the 'from £375 + VAT' price signal); page ranks pos 5.7 / 0.9% CTR for 'fix my pub' leaving ~3.9 clicks/yr on the table on a SERP dominated by insolvency firms where recovery-first, price-transparent framing is differentiated", "evidence": "evidence/page-metadata.csv /fix-my-pub title_length=77 meta_description_length=182; evidence/opportunities-ctr-gap.csv 'fix my pub' pos 5.72/109 impr/0.92% CTR/est 3.9 clicks; evidence/search-queries.csv 'fix my pub' pos 5.72", "source": "page-metadata.csv + opportunities-ctr-gap.csv + search-queries.csv", "dataStatus": "Known", "severity": "High", "confidence": "High", "impactArea": "revenue", "owner": "Content", "effort": "Small", "dependencies": "CLAIMS.md; dev edit to src/app/fix-my-pub/page.tsx", "fixType": "One-off page fix", "recommendedAction": "Rewrite title to 'Fix My Pub — Turnaround Help From a Real Licensee' (49 chars) and meta to 'Struggling pub, not a closing one. I run The Anchor and help licensees fix the fastest thing first — diagnosis, reset plan, hands-on support. From £375 + VAT.' (154 chars); title/meta only, leave body and JSON untouched", "validationStep": "Re-fetch /fix-my-pub: title ≤60, meta ≤155; CTR on 'fix my pub' rises above 2% in mid-August GSC export", "riskRollback": "Title/meta revert via git; no ranking dependency" },
  { "finding": "The stale crawl records /services/instagram-services-for-pubs as a live 153-word page with canonical→homepage, but live code (main @ 6116fe19) has already replaced both instagram and facebook service pages with permanentRedirect to /services/social-media-marketing-for-pubs — the self-cancelling money-ranking defect is resolved in code; the remaining live blocker is that the redirect TARGET (the social hub) is NOT in the sitemap", "evidence": "src/app/services/instagram-services-for-pubs/page.tsx and facebook-services-for-pubs/page.tsx = permanentRedirect('/services/social-media-marketing-for-pubs'); evidence/url-inventory.csv social-media-marketing-for-pubs in_sitemap=no; evidence/search-queries.csv 'instagram services for pubs' pos 6.99/256 impr, 'facebook services for pubs' pos 6.11/123 impr", "source": "Codebase inspection (page.tsx) + url-inventory.csv + search-queries.csv", "dataStatus": "Known", "severity": "High", "confidence": "High", "impactArea": "SEO", "owner": "Technical", "effort": "Small", "dependencies": "Sitemap generation; dev", "fixType": "Template/system fix", "recommendedAction": "Add /services/social-media-marketing-for-pubs to the sitemap and request indexing; confirm the instagram/facebook 308 redirects are live in production so the inherited page-one rankings resolve to the hub", "validationStep": "Hub appears in sitemap.xml; redirects return 308; CTR on 'instagram services for pubs' and 'facebook services for pubs' rises off 0% in mid-August GSC export", "riskRollback": "Sitemap entry removable; redirects reversible" },
  { "finding": "Social hub /services/social-media-marketing-for-pubs now absorbs Instagram + Facebook query rankings (14.5 clicks/yr across the two queries) but its title (77 chars, truncates) and H1 lead with 'Social Media Marketing' — the category term — rather than 'Instagram & Facebook', the language people actually search; its two on-page channel sections are generic 3-card blocks rather than substance that earns the inherited rankings", "evidence": "evidence/page-metadata.csv /services/social-media-marketing-for-pubs title_length=77 H1='Social Media Marketing for Pubs'; src/app/services/social-media-marketing-for-pubs/page.tsx (Instagram/Facebook H2 card blocks); evidence/opportunities-ctr-gap.csv 'instagram services for pubs' est 9.0 + 'facebook services for pubs' est 5.5 clicks", "source": "page-metadata.csv + component source + opportunities-ctr-gap.csv", "dataStatus": "Known", "severity": "High", "confidence": "High", "impactArea": "revenue", "owner": "Content", "effort": "Medium", "dependencies": "editorial-team; sitemap fix (prerequisite)", "fixType": "One-off page fix", "recommendedAction": "Retitle to 'Instagram & Facebook Marketing for Pubs' (title + H1); deepen the Instagram and Facebook channel sections per Brief A (~900-1,000w, pub-specific substance, search-visibility +828% claim attributed to The Anchor)", "validationStep": "Title ≤60; H1 contains 'Instagram & Facebook'; re-fetch confirms; CTR recovery on the two channel queries in mid-August GSC export", "riskRollback": "Metadata/H1 revert via git; content changes reversible" },
  { "finding": "/services/paid-social-for-pubs (511w) and /services/content-creation-for-pubs (536w) are below the ~650-750w depth their commercial intent warrants; 'content creation services for pubs' sits at pos 8.8 (near page-one) and 'paid social for pubs' at pos 11.2 — both P1 reclaim targets whose thin bodies under-serve the query", "evidence": "evidence/url-inventory.csv paid-social-for-pubs word_count=511, content-creation-for-pubs word_count=536; evidence/search-queries.csv 'content creation services for pubs' pos 8.77/86 impr, 'paid social for pubs' pos 11.23/207 impr; evidence/opportunities-ctr-gap.csv rows for both", "source": "url-inventory.csv + search-queries.csv + opportunities-ctr-gap.csv", "dataStatus": "Known", "severity": "Medium", "confidence": "High", "impactArea": "SEO", "owner": "Editorial", "effort": "Medium", "dependencies": "editorial-team; CLAIMS.md for approved metrics", "fixType": "Content process fix", "recommendedAction": "Editorial to expand both to ~650-750w per Briefs B and C, mapping to the existing JSON schema (intro/deliverables/process/faqs); add one approved CLAIMS metric each (table-bookings +403% for paid-social, search-visibility +828% for content-creation), attributed to The Anchor; no invented ad/ROAS figures", "validationStep": "Word count ~650-750 on re-crawl; approved metric present; positions on the two queries improve toward page-one in mid-August GSC export", "riskRollback": "Content changes reversible via git" },
  { "finding": "Four commercial pages have SERP-truncating metadata lengths that clip the price signal / brand: /ways-to-work title 69 chars, /compete-with-pub-chains title 70 chars, /quiet-midweek-solutions meta 156 chars, /pub-marketing-agency H1 says 'Hospitality' where the target query is 'Pub'; all are otherwise well-built single-H1 pages needing snippet trims not rewrites", "evidence": "evidence/page-metadata.csv: ways-to-work title_length=69, compete-with-pub-chains title_length=70, quiet-midweek-solutions meta_description_length=156, pub-marketing-agency h1='A Hospitality Marketing Agency That Actually Runs a Pub'", "source": "page-metadata.csv", "dataStatus": "Known", "severity": "Medium", "confidence": "High", "impactArea": "SEO", "owner": "Content", "effort": "Small", "dependencies": "dev edits to each page's generateMeta()", "fixType": "One-off page fix", "recommendedAction": "Apply the recommended titles/metas/H1 in the page-by-page tables: shorten ways-to-work + compete titles to ≤50 and add price to ways-to-work title; trim quiet-midweek meta to ≤155; align pub-marketing-agency H1 + title to 'Pub Marketing Agency' exact match (but sequence pub-marketing-agency AFTER hub cannibalisation SEO-029 is resolved)", "validationStep": "All titles ≤60, metas ≤155 on re-crawl; pub-marketing-agency H1 contains 'Pub Marketing Agency'", "riskRollback": "Metadata/H1 revert via git" },
  { "finding": "The three named-channel service-page JSON bodies carry no approved CLAIMS proof point, weakening both conversion credibility and AI-answer authority; the social hub's Instagram tips list leads with 'using AI assistance' — an AI-efficiency framing CLAIMS deliberately retired in favour of growth/booking/revenue proof", "evidence": "content/data/services/paid-social-for-pubs.json, content-creation-for-pubs.json, social-media-marketing-for-pubs.json (no CLAIMS metric in body); src/app/services/social-media-marketing-for-pubs/page.tsx FeatureList item 'Batch content in one session per week using AI assistance'; CLAIMS.md retired-claims rationale", "source": "JSON + component inspection + CLAIMS.md", "dataStatus": "Known", "severity": "Low", "confidence": "High", "impactArea": "conversion", "owner": "Editorial", "effort": "Small", "dependencies": "CLAIMS.md; editorial-team", "fixType": "Content process fix", "recommendedAction": "Add one approved percentage metric per channel page (Briefs A-C), always attributed to The Anchor; keep 'AI assistance' as a method aside, lead channel copy with booking/visibility benefit not AI-efficiency", "validationStep": "Each channel page body contains one approved CLAIMS % attributed to The Anchor; no retired metric or AI-efficiency headline", "riskRollback": "Content changes reversible via git" }
] }
```


