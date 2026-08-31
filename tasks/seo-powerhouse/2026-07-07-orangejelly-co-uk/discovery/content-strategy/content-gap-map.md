# Content Gap Map & Pruning Shortlist — Orange Jelly

**Author:** Content Strategist · **Date:** 2026-07-07 · Companion to `content-strategy-report.md`.
**Method:** Ran the `content-review-framework.md` pruning decision tree over the not-indexed URL sets (`evidence/indexation-urls.csv` drilldown-6 = Discovered-not-indexed, drilldown-7 = Crawled-not-indexed) and the thin category pages. Every verdict cites word count (`evidence/url-inventory.csv`), indexation state (GSC Coverage 2026-06-16), and demand where Known (`evidence/search-queries.csv`).

**Safety:** No live indexation change (redirect / noindex / remove / merge) is executed here. Every such verdict is a **recommendation** for the Risk Register requiring explicit user sign-off (Pruning Safety Rules). Redirects and 404 fixes are Technical-owned.

---

## Headline: this is an indexation problem, not a pruning problem

**The single most important finding of the prune pass:** every one of the ~46 not-indexed guide URLs is **substantial** — the smallest is `village-pub-dying-village-survival` at 877 words; the largest is `pub-health-check…` at 5,203 words; the median is ~2,500 words. **Not one not-indexed guide is thin, duplicated, or low-value.** They are not indexed because the site's internal link equity is trapped in `/capabilities` (1,035 inbound links vs the homepage's 602 — strategy §2 defect 3), starving the money pages and deep guides of the discovery signal Google needs.

**Consequence:** the correct verdict for ~44 of the not-indexed URLs is **KEEP + earn internal links** — a Technical link-rebalance job, not a content prune. Pruning any of these would destroy good content and search equity. Only a small tail (below) warrants expand/consolidate/redirect/noindex.

---

## Pruning / consolidation verdicts (per-URL, only URLs needing action)

| URL | Words | Indexation | Demand (Known) | Verdict | Rationale & target | Owner |
|---|---|---|---|---|---|---|
| `/licensees-guide/category/property` | 233 | (index page) | — | **Expand** | Thin category index; add intro + curated guide list via category template | Content |
| `/licensees-guide/category/food-drink` | 243 | drilldown-6 | — | **Expand** | Thin index; same template fix | Content |
| `/licensees-guide/category/people` | 270 | (index page) | — | **Expand** | Thin index; same template fix | Content |
| `/licensees-guide/pub-epos-system-guide` | 2937 | drilldown-6 | — | **Keep (canonical of EPOS pair)** | Overlaps `epos-data-revenue-comeback` (964w). Designate this the canonical EPOS guide; retarget/merge the smaller one's unique "revenue comeback" angle in and cross-link. Confirm ranking split via URL Inspection first | Content |
| `/licensees-guide/epos-data-revenue-comeback` | 964 | drilldown-7 | — | **Consolidate/merge** → `pub-epos-system-guide` | Thinner of the EPOS pair; if it holds no distinct ranking, merge its data-revenue angle into the canonical guide and 301 (Technical, on approval). If it holds a distinct query, keep + differentiate | Content + Technical |
| `/licensees-guide/pub-event-ideas` | 1783 | drilldown-6 | 620 impr "pub event ideas" pos 15.3 | **Keep (canonical of events pair)** + refresh | Overlaps `how-to-run-successful-pub-events` (3087w). Make this the concise list-intent canonical for "event ideas for pubs" (956 impr) / "pub event ideas"; cross-link the deep how-to. Refresh per report §4 | Content |
| `/licensees-guide/how-to-run-successful-pub-events` | 3087 | drilldown-6 | shares events demand | **Keep + differentiate** | The deep how-to companion; differentiate H1/intro from `pub-event-ideas` so they stop competing for the same query | Content |
| `/licensees-guide/pub-wages-labour-costs-guide` | 3226 | drilldown-6 | — | **Keep + redirect the broken sibling** | The live, good page. Its `-uk` sibling is a hard 404, internally linked. **Technical:** 301/308 `/licensees-guide/pub-wages-labour-costs-uk` → this `-guide` URL; repoint internal links at source | Technical |
| `/about-demo` | — | drilldown-7 | — | **Noindex (recommend)** | A demo/scaffold page crawled but non-commercial; should not be in search. Noindex + drop from sitemap, keep crawlable. User sign-off required (live indexation change) | Technical + Content |
| `/licensees-guide/fizz-street-food-pop-up` | not in inv | drilldown-7 | — | **Investigate** | Crawled-not-indexed but absent from crawl inventory — confirm live status (200 vs redirect). If 200 and unique, keep + link; if a near-duplicate of `pop-up-events-for-pubs` (2508w), consolidate | Content + Technical |
| **~44 other not-indexed guides** (autumn-pub-event-ideas 2271w, cask-ale-week 3294w, christmas-pub-event-ideas 2118w, google-business-profile 3975w, how-much-profit 3493w, wet-led-vs-food-led 3496w, wine-tasting 3357w, buying-a-pub 3560w, pub-health-check 5203w, music-bingo-101 1657w, etc.) | 877–5203 | drilldown-6/7 | mixed | **KEEP + earn internal links** | Substantial, valuable content un-indexed due to the `/capabilities` link sink. NOT a prune. Content specifies contextual links from indexed related guides/hubs; Technical redistributes boilerplate link equity. Re-check in August GSC | Content + Technical |
| **Commercial not-indexed** (`/capabilities`, `/compete-with-pub-chains`, `/pub-marketing`, `/pub-marketing-agency`, 4× `/ways-to-work/*`, 6 county pages, `/quiet-midweek-solutions`, `/empty-pub-solutions`, `/pub-marketing-no-budget`) | — | drilldown-6/7 | commercial clusters | **KEEP + index** (see hub note) | Indexation, not content. Exception: the 5-hub pub-marketing cannibalisation (strategy SEO-029) is a Technical consolidation decision, and county pages are STOP-expansion (keep the 9, build no more) | Technical |

### Verdict counts

| Verdict | Count | Notes |
|---|---|---|
| Keep + link (indexation, not prune) | ~44 guides + commercial set | The dominant outcome — content is fine, links/index are the problem |
| Expand | 3 | Thin category index pages |
| Consolidate/merge | 2 pairs (EPOS; events) | Confirm ranking split via URL Inspection before merging |
| Redirect | 1 | `-uk` → `-guide` (Technical, the 404 fix) |
| Noindex (recommend) | 1 | `/about-demo` (user sign-off) |
| Investigate live status | 1 | `fizz-street-food-pop-up` |
| Remove / 410 | **0** | Nothing warrants removal; no page is valueless |

---

## Content Gaps (priority order)

Gaps are near-zero because the site is content-rich. The real "gaps" are **finish-quality and answer-format gaps on pages that already rank**, not missing topics. Listed with the report section that owns each.

| Gap | Target keywords (all Known unless noted) | Intent | Coverage now | Recommended action | Priority | Report ref |
|---|---|---|---|---|---|---|
| Instagram service page is a self-cancelling stub | instagram services for pubs (pos 7.0) | commercial | 153w, canonical→home | Full rebuild | P1 | §1a |
| Facebook service page has no clickable destination | facebook services for pubs (pos 6.1) | commercial | redirect/stub | Build to parity | P1 | §1b |
| Channel pages under-developed for their intent | social media / content creation / paid social for pubs | commercial | 511–813w | Light expand + hub | P1 | §1c–e |
| fix-my-pub snippet doesn't separate recovery from insolvency | fix my pub (pos 5.7) | commercial/transactional | 678w, weak snippet | Title/meta rework | P1 | §2 |
| Events cluster answer format for AI + top-10 push | event ideas for pubs (956 impr) | informational | 2 overlapping guides | Consolidate + answer block | P2 | §4, §5 |
| No visible answer blocks on cluster leaders | 4 cluster-leader queries | informational | quickAnswer in frontmatter only | Render on-page answer blocks | P2 | §5 |
| No Christmas/winter seasonal hub | christmas pub ideas (209 impr) | informational/seasonal | 2 strong guides, no hub object | Add winter hub + refresh guides | P2 (ship by Sept) | §6 |
| Thin category index pages | category browse intent | navigational | 233–270w | Expand 3 pages | P3 | §"Architecture" |
| Family/kids events pillar | **BLOCKED — keyword-plan** (no volume available) | informational | 2 guides exist, not-indexed | Validate demand before any pillar | Blocked | §7 |

**Inferred vs Known:** every demand figure above is Known (first-party GSC 12-mo, 2026-06-16). The family/kids pillar carries **no** volume figure — `unavailable`, blocked on keyword-plan GKP validation. No volumes are invented anywhere in this map.

---

## Cannibalisation

`opportunities-cannibalisation.csv` returned **0 rows** — but that is because GSC's page-join is empty for these queries (the query-level export doesn't carry the ranking URL), not because cannibalisation is absent. Two overlaps are visible from content inspection and must be confirmed by URL Inspection:

| Topic | Competing pages | Recommended resolution |
|---|---|---|
| Pub events ("event ideas for pubs" / "pub event ideas", 1,576 impr combined) | `pub-event-ideas` (1783w) vs `how-to-run-successful-pub-events` (3087w) | Designate `pub-event-ideas` the concise list-intent canonical; `how-to-run…` the deep how-to. Differentiate H1/intro, cross-link. Confirm ranking URL first |
| EPOS | `pub-epos-system-guide` (2937w) vs `epos-data-revenue-comeback` (964w) | Canonicalise on the fuller guide; merge or differentiate the smaller. Confirm ranking split first |

---

## Findings

```json
{ "findings": [
  { "finding": "Zero not-indexed guides are thin — all ~46 not-indexed URLs (drilldown-6/7) are 877-5203 words (median ~2500); the not-indexed state is caused by trapped internal-link equity (/capabilities 1035 inbound), not content quality, so the correct verdict for ~44 of them is KEEP + earn internal links, not prune", "evidence": "evidence/url-inventory.csv word_count for all drilldown-6/7 guide URLs (min village-pub-dying 877w, max pub-health-check 5203w); evidence/indexation-urls.csv; strategy-document.md §2 defect 3", "source": "collect-site-evidence.py crawl + GSC Coverage 2026-06-16", "dataStatus": "Known", "severity": "High", "confidence": "High", "impactArea": "crawl/indexing", "owner": "Content", "effort": "Medium", "dependencies": "Technical link-rebalance; August GSC re-check", "fixType": "Template/system fix", "recommendedAction": "Do not prune the not-indexed guides; specify contextual internal links from indexed related guides/hubs and pair with Technical's /capabilities link redistribution", "validationStep": "Not-indexed substantial guides exit not-indexed state in August Coverage export after link changes", "riskRollback": "Additive links — reversible" },
  { "finding": "Two guide pairs overlap and are consolidation candidates: pub-epos-system-guide (2937w) vs epos-data-revenue-comeback (964w); and pub-event-ideas (1783w) vs how-to-run-successful-pub-events (3087w) which both target the 956-impr 'event ideas for pubs' query", "evidence": "evidence/url-inventory.csv word counts; evidence/opportunities-striking-distance.csv events queries; opportunities-cannibalisation.csv 0 rows (GSC page-join empty, not absence of overlap)", "source": "collect-site-evidence.py + GSC 12-mo + content inspection", "dataStatus": "inferred", "severity": "Medium", "confidence": "Medium", "impactArea": "SEO", "owner": "Content", "effort": "Small", "dependencies": "URL Inspection to confirm ranking URL per query before any merge; user sign-off for 301", "fixType": "One-off page fix", "recommendedAction": "Confirm ranking split via URL Inspection; canonicalise each pair on the fuller/right-intent guide, differentiate or merge the other, cross-link; log any 301 in Risk Register for approval", "validationStep": "One URL per topic consolidates impressions; positions improve in August GSC", "riskRollback": "Content reversible; redirect map documented and reversible" },
  { "finding": "/about-demo is crawled-not-indexed and is a demo/scaffold page with no commercial or search purpose — noindex candidate (not removal)", "evidence": "evidence/indexation-urls.csv drilldown-7 contains /about-demo", "source": "GSC Coverage 2026-06-16 crawl", "dataStatus": "Known", "severity": "Low", "confidence": "Medium", "impactArea": "crawl/indexing", "owner": "Technical", "effort": "Small", "dependencies": "User sign-off (live indexation change); confirm page purpose", "fixType": "One-off page fix", "recommendedAction": "Confirm /about-demo is a non-production demo; if so noindex + drop from sitemap (keep crawlable); requires user approval per Pruning Safety Rules", "validationStep": "Page carries noindex and is absent from sitemap; not in future Coverage index attempts", "riskRollback": "Remove noindex to reinstate" },
  { "finding": "Three category index pages are thin (property 233w, food-drink 243w, people 270w) against five healthy siblings (events 1499w down to revenue-growth 651w) — a systemic thin-index pattern to fix at the category template", "evidence": "evidence/url-inventory.csv word_count for all 8 /licensees-guide/category/* URLs", "source": "collect-site-evidence.py crawl", "dataStatus": "Known", "severity": "Low", "confidence": "High", "impactArea": "SEO", "owner": "Content", "effort": "Small", "dependencies": "category template accepts intro copy; editorial-team", "fixType": "Template/system fix", "recommendedAction": "Add a 2-3 sentence intro + curated guide list to the three thin category pages via the template", "validationStep": "Three pages exceed ~400 words and stay indexed on re-crawl", "riskRollback": "Content reversible via git" }
] }
```
