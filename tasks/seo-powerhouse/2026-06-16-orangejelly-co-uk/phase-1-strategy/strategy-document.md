# Orange Jelly — SEO Strategy Document (Phase 1)

**Date:** 2026-06-16 (Europe/London) · **Mode:** Full Site Overhaul · **Author:** SEO Strategy Lead
**Primary commercial goal:** more service enquiries / leads from UK licensees and pub operators.
**Data status note:** GSC is first-party (Known). **GA4 was not supplied** → there is no conversion, session or revenue baseline. Every commercial-outcome target below is therefore provisional until enquiry conversion tracking exists. New-term search volumes are **not** asserted — they are marked "validate via keyword-plan / GKP".

---

## 1. Business context

Orange Jelly sells practical, AI-assisted marketing help to UK pubs and licensees — hourly (£75 + VAT) and packages (from £375 + VAT), with a 30-day action guarantee. The differentiator is unusually strong and rare in this market: the founder (Peter Pitcher) runs a real pub (The Anchor, Stanwell Moor) and the proof points are measured at his own venue. The audience is time-poor independent licensees who are sceptical of agencies; the winning angle is peer-to-peer ("one publican to another"), not agency polish.

**Commercial reality:** this is a lead-gen site, not a publisher. Success is enquiries, not pageviews. The site must rank for what people type *when they are looking for help with their pub*, and convert that visit into a contact. Today it does neither at scale.

## 2. Current organic position (GSC, first-party)

| Window | UK clicks | UK impressions | UK avg position | UK CTR |
|---|---|---|---|---|
| 12 months | 423 | 25,935 | 13.78 | 1.63% |
| Last 28 days | 97 | 5,032 | 11.93 | 1.93% |

- **Trajectory is positive.** 28-day run-rate (~97 UK clicks/4 weeks ≈ ~1,260/yr annualised) is roughly 3× the trailing-12-month average, and average position improved from 13.78 → 11.93. Something is working; the job is to point it at commercial intent. *(Source: GSC Countries 12-mo + 28-day. Known.)*
- **Mobile vs desktop:** Mobile 280 clicks at pos 9.83 (CTR 1.87%); Desktop 230 clicks at pos 13.61 (CTR 0.92%). Mobile ranks better and converts clicks better — mobile experience is commercially material. *(Source: GSC Devices 12-mo. Known.)*
- **Demand is UK-dominant** (423 of ~470 clicks). International impressions are noise for a UK lead-gen business; do not optimise for them.

### What is working
All top landing pages are informational `/licensees-guide/` posts. The four that carry the site: *(Source: GSC Pages 12-mo. Known.)*

| Page | Clicks | Impr | Pos |
|---|---|---|---|
| /licensees-guide/summer-pub-event-ideas | 96 | 7,572 | 15.1 |
| /licensees-guide/quiz-night-ideas | 76 | 4,348 | 11.8 |
| /licensees-guide/profitable-pub-food-menu-ideas | 67 | 4,479 | 7.4 |
| /licensees-guide/social-media-strategy-for-pubs | 37 | 3,836 | 12.6 |

### What is not working — the central problem
- **The site ranks for questions, not for buyers.** By landing-page category over 12 months: informational guides = **458 clicks / 39,216 impr across 97 pages**; commercial/service pages = **44 clicks / 3,228 impr across 22 pages**; homepage = 24 clicks. *(Source: GSC Pages 12-mo, categorised. Known.)*
- **Commercial-intent queries are visible but earn almost nothing.** 57 commercial-intent queries (agency / services / "marketing for pubs" / "fix my pub" / recovery) drew **2,908 impressions but only 2 clicks** over 12 months, at positions clustered 6–20. Examples: `pub marketing agency` 304 impr pos 19.6 (0 clicks); `instagram services for pubs` 256 impr pos 7.0 (0 clicks); `content creation for pubs` 226 impr pos 14.8 (0 clicks); `paid social for pubs` 207 impr pos 11.2 (0 clicks); `marketing agency for pubs` 161 impr pos 18.3 (0 clicks). *(Source: search-queries.csv, intent-classified. Known.)*

This is the strategic crux: **demand for paid pub-marketing help exists and Google already shows Orange Jelly for it — but the commercial pages are weak enough that the impressions never become clicks, let alone enquiries.** Fixing this is worth more than any new traffic.

### Indexation drag
GSC Coverage shows the page-indexing backlog on a ~140-URL site: *(Source: GSC Coverage report 2026-06-16. Known.)*

| Reason | Pages |
|---|---|
| Discovered – currently not indexed | 44 |
| Crawled – currently not indexed | 30 |
| Excluded by 'noindex' tag | 10 |
| Page with redirect | 7 |
| Not found (404) | 6 |
| Blocked by robots.txt | 6 |
| Duplicate without user-selected canonical | 2 |

The drilldowns reveal the buckets are **mixed**, which changes the fix: many "not indexed" URLs are *cross-subdomain noise* (`cheersai.orangejelly.co.uk`, `management.orangejelly.co.uk/events/...`, `auth/login`) that should never have been in this property's scope, plus protocol/host duplicates (`http://`, non-www). But the same buckets also contain **commercial and brand-new pages that need to index**: `/services`, `/compete-with-pub-chains`, `/capabilities`, and several new seasonal guides crawled `1970-01-01` (i.e. discovered, never fetched: `autumn-pub-event-ideas`, `cask-ale-week-pub-guide`, `pop-up-events-for-pubs`, `national-drinks-days-pub-guide`). A commercial page (`/services`) sitting in "not indexed" is a direct lead-gen blocker. *(Source: Coverage drilldown Table.csv files. Known.)*

## 3. Where the site can realistically win

Honest assessment by achievability × commercial value:

1. **Convert existing informational authority into enquiries (highest ROI, lowest effort).** The site already ranks pos 7–16 for high-impression pub-operations questions. These visitors are licensees — exactly the buyer. The win is not more traffic; it is a credible info→service bridge on every guide plus a commercial page that actually converts. This needs no new ranking.
2. **Capture the commercial-intent cluster the site is already shown for (high value, medium effort).** "pub marketing agency", "marketing for pubs", "social media marketing for pubs", "content creation for pubs", "paid social for pubs", "fix my pub" — Google already surfaces OJ at pos 6–20. Purpose-built, well-structured service pages can move these into the click range and feed the lead goal directly.
3. **Defend and deepen the informational clusters where OJ ranks but a brewery hub is climbing (medium value, medium effort).** Quiz nights, pub event ideas, pub food/menu, social media for pubs. Greene King's `valueforvenues.co.uk` competes here with heavier resourcing — OJ's edge is the real-publican voice and measured results.
4. **Local service intent (medium value, low-medium effort).** The site has location pages (`/pub-marketing-kent`, `-oxfordshire`); `pub business recovery services stockport` already shows at pos 7.9. A coherent location-page system targeting UK regions is a realistic local-pack/organic play.

**Where the site cannot win head-on (de-prioritise):** broad head terms like generic "marketing agency", high-competition national agency terms, or international traffic. Do not chase them.

## 4. The information-vs-commercial tension, and how to resolve it

The tension: the content engine produces informational guides that rank, but the money is in service enquiries the guides don't drive. **Do not stop the content engine — it is the top-of-funnel asset and the source of all current visibility.** Resolve the tension structurally, not by trading one for the other:

- **Build the bridge, don't burn the bench.** Every high-traffic guide gets a contextual, non-salesy "want this done for you?" path to the matching service — peer-to-peer, not a banner. The guide proves competence; the bridge offers to do it.
- **Create a commercial layer the guides can point to.** Today the guides have nowhere good to send a convinced reader. Build/strengthen service pages (do-it-for-you social, content, paid social, "fix my pub" turnaround) that match the commercial queries already showing impressions, then internally link guides → services with intent-matched anchors.
- **Measure the bridge.** Without GA4/enquiry tracking we are flying blind on the only metric that matters. Establishing enquiry conversion tracking is a Phase-2 prerequisite, not a nice-to-have.

## 5. Strategic priorities (ranked by commercial impact × achievability)

1. **Establish enquiry conversion tracking (GA4 + form/CTA events).** Without it, the lead-gen goal is unmeasurable and every other priority is unprovable. **Blocker to remove first.**
2. **Fix the commercial conversion layer.** Strengthen `/services` and intent-matched service pages; ensure they index; build guide→service internal links; sharpen commercial metadata and CTAs (using only `/CLAIMS.md` proof points).
3. **Clean up indexation scope.** Separate genuine "index these" pages (commercial + new seasonal guides) from cross-subdomain/protocol noise. *(All live indexation changes route through the Phase-2+ Risk Register — no noindex/canonical/robots/redirect edits in Phase 1.)*
4. **Position-improvement plays on existing high-impression guides** (summer events, quiz, food, social, content marketing, Christmas) — move pos 12–16 to top-10.
5. **Defend/expand the four core informational clusters** against the Greene King hub with the real-publican differentiator and approved results.

## 6. Success metrics / KPIs (outcome-based)

Targets are provisional pending GA4 baseline. Primary metric is **enquiries**, not clicks.

| KPI | Baseline (source) | 6-month target | Why |
|---|---|---|---|
| Service enquiries (form + contact events) | **Unavailable — no GA4** (must be established) | Establish baseline, then set target after 1 month of data | The only metric that maps to revenue |
| Clicks to commercial/service pages (GSC) | 44 clicks/12 mo (Known) | Material multiple of baseline as commercial pages index + improve | Direct lead proxy |
| Commercial-query CTR (the 57-query set) | ~0.07% (2 clicks / 2,908 impr) (Known) | Lift into low single-digit % at current positions | Captures demand already shown |
| UK avg position, commercial cluster | pos ~6–20 (Known) | Move priority terms to top-10 | Click threshold |
| Indexed commercial + new-guide pages | `/services` etc. currently not indexed (Known) | All priority pages indexed | Removes lead blocker |
| UK organic clicks (overall) | 423/12 mo; 97/28 days (Known) | Sustain the improved run-rate | Health check, not the goal |

## 7. Review scope for Phases 2–5

- **Technical SEO (Phase 2):** indexation scope cleanup (subdomain/protocol noise vs pages that must index), the 6 × 404 and 7 × redirect URLs, robots.txt scope, the 29 multiple-H1 pages, sitemap hygiene (140 URLs vs ~132 indexed-eligible), and why new seasonal guides show "discovered, never crawled". Route all live changes via the Risk Register.
- **Analytics (Phase 2, prerequisite):** stand up GA4 + enquiry/CTA conversion events; import GSC; define the enquiry funnel and baseline. Nothing downstream is measurable without this.
- **Content Strategy (Phase 3):** the info→commercial bridge; the four core clusters vs the Greene King hub; seasonal coverage (the new guides); answer-block formatting for AI citation.
- **Copywriting (Phase 3):** commercial service pages + guide CTAs, using only `/CLAIMS.md` (no save/savings language; British English; Greene King = Tenant, BII = Member).
- **UX/CRO (Phase 4):** the conversion path on `/services`, `/contact`, and guide→service bridges; mobile-first (mobile ranks/converts best).
- **Authority (Phase 5):** local/regional signals, the real-publican entity, and earning citations in AI answer engines.

## 8. Recommended ongoing cadence

Two-week sprint after the overhaul: ship from the prioritised backlog → verify in GSC/GA4 → refine. Monthly: review GSC commercial-cluster CTR/position and GA4 enquiries; re-rank the backlog. Quarterly: seasonal content planning (the calendar already drives demand — summer/Christmas/autumn rugby) and a competitor re-check against the Greene King hub. The strategy is a living system, re-based on enquiry data once tracking exists.

---

## Initial backlog (owned by Strategy; other agents append)

| ID | Category | Item | Why it matters | Expected impact | Effort | Priority tier | Dependencies | Decision |
|---|---|---|---|---|---|---|---|---|
| SEO-001 | Analytics | Stand up GA4 + enquiry/CTA conversion tracking; import GSC; define enquiry funnel & baseline | Lead-gen goal is unmeasurable without it; gates every other proof | High | Medium | GA4 access, dev | **Do now** |
| SEO-002 | Content/UX | Add contextual guide→service "done-for-you" bridge to top-traffic guides (summer events, quiz, food, social) | Converts existing informational authority into enquiries; no new ranking needed | High | Medium | Content, dev, CLAIMS.md | **Do now** |
| SEO-003 | Content | Strengthen `/services` + build intent-matched service pages (do-it-for-you social, content, paid social, "fix my pub" turnaround) to match shown commercial queries | Captures 2,908 commercial impressions currently earning 2 clicks | High | Large | Content, copywriting | **Do now** |
| SEO-004 | Technical | Diagnose why `/services`, `/compete-with-pub-chains`, `/capabilities` + new seasonal guides are not indexed (separate from subdomain/protocol noise) | A commercial page not indexed is a direct lead blocker | High | Medium | Dev; Risk Register for any live change | **Do now** |
| SEO-005 | Technical | Scope cleanup: exclude `cheersai.`/`management.` subdomain + http/non-www duplicate URLs from this property's indexable set | Removes ~half the "not indexed" noise so real issues are visible | Medium | Medium | Dev; Risk Register | **Schedule** |
| SEO-006 | Content | Position-improvement pass on high-impression guides at pos 12–16 (summer events 15.1, content-marketing 15.6, Christmas 11.6, pub-refurbishment 14.7) | Top-10 thresholds unlock clicks on existing impressions | Medium | Medium | Content | **Schedule** |
| SEO-007 | Content | Sharpen commercial metadata/CTAs on service + location pages using approved CLAIMS only | Lifts commercial-cluster CTR at current positions | Medium | Small | Copywriting, CLAIMS.md | **Schedule** |
| SEO-008 | Content | Defend the 4 core clusters vs `valueforvenues.co.uk` (Greene King hub) with real-publican angle + approved results; add quotable answer blocks | Protects the visibility that feeds the funnel | Medium | Medium | Content | **Schedule** |
| SEO-009 | Technical | Resolve 6×404 and 7×redirect URLs; audit 29 multiple-H1 pages; sitemap hygiene | Crawl efficiency + ranking hygiene on a small site | Medium | Medium | Dev; Risk Register | **Schedule** |
| SEO-010 | Authority | Coherent UK regional location-page system (build on Kent/Oxfordshire; recovery-services intent already at pos 7.9) | Local service intent is a realistic organic/local-pack lead source | Medium | Large | Content, Authority | **Monitor** |
| SEO-011 | Content | AI answer-engine answer blocks + author/expertise signals on cluster leaders | Earn AI Overview / Perplexity citations where OJ owns the entity | Low–Medium | Medium | Content, schema | **Monitor** |
