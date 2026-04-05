# QA Review Report — SEO Keyword Plan

**Scope:** `seo-overhaul/keyword-plan.md` — keyword assignments for all pages on orangejelly.co.uk
**Date:** 2026-04-05
**Mode:** Strategic Document Review (adapted from Spec Compliance)
**Engines:** Claude + Codex (GPT-5.4)

---

## Executive Summary

Four specialists reviewed the keyword plan from different angles. The plan demonstrates thorough keyword research across 4 batches of Google Keyword Planner data and correctly maps most existing content to search terms. However, it has **one critical strategic flaw and several structural gaps** that would significantly reduce its effectiveness if executed as-is.

**The critical flaw:** The plan prioritises raw search volume over business intent. Its top priorities (pub quiz questions at 50K/mo, pub quiz at 50K, pub games at 5K) target pub-goers looking for entertainment, not licensees looking to hire a consultant. Of the claimed 146K monthly addressable searches, fewer than 5,000 come from potential clients. Executing the plan as ordered would produce high traffic and near-zero leads.

| Severity | Count | Summary |
|----------|-------|---------|
| Critical | 4 | Intent mismatch in prioritisation, 36/71 blog posts unassigned, "near me" keywords unwinnable, conflation of consumer/operator intent |
| High | 8 | Cannibalisation risks, inflated volume claims, no DA assessment, no conversion funnel, unrealistic resource allocation, missing pages in plan, dead target URL, intent-mismatched page types |
| Medium | 10 | No measurement framework, seasonal timing gaps, missing content clusters (compliance, finance, staffing, drinks), no link building strategy, no Plan B, long-tail opportunity missed |
| Low | 3 | Regional assessment correct, problem page assessment correct, minor secondary keyword overlaps |

---

## Critical Findings

### CRIT-001: Plan optimises for traffic, not revenue (STRAT-001, STRAT-002, STRAT-003)
**Engines:** Claude + Codex (agreed)
**Finding:** The top 3 priorities target consumers, not clients. "Pub quiz questions" (50K) attracts quiz hosts. "Pub quiz" (50K) attracts quiz players. "Pub games" (5K) attracts people looking for fun. None of these people want to hire a £75/hr pub marketing consultant. Commercial-intent keywords ("hospitality marketing agency" at 500/mo, "pub lease" at 5K/mo, "how to run a pub" at 500/mo) are buried at priorities 8-12.
**Impact:** 3-6 months of effort invested in content that generates pageviews but zero enquiries.
**Fix:** Reorder priorities by conversion potential. Commercial keywords first (months 1-4), informational content second (months 5+). See revised priority list below.

### CRIT-002: 36 of 71 blog posts have no keyword assignment (SPEC-001)
**Engines:** Codex
**Finding:** The plan explicitly covers only "Top 30 by Opportunity" in the blog section. 36 live posts — including `beat-chain-pubs`, `cash-flow-crisis-breaking-cycle`, `compete-with-wetherspoons`, `crisis-pr-landlords-bad-reviews`, `kitchen-nightmares-chef-quits`, `young-people-wont-come-to-your-pub`, and 30 others — have no declared primary keyword.
**Impact:** Over half the blog inventory is unmanaged for SEO. Cannibalisation, internal linking, and content gap analysis are incomplete.
**Fix:** Complete the keyword map for all 71 posts. Even low-volume posts need a declared primary keyword to prevent internal competition and guide internal linking.

### CRIT-003: "Near me" keywords are unwinnable for a content site (STRAT-004, SPEC-004)
**Engines:** Claude + Codex (agreed)
**Finding:** "Karaoke near me" (50K), "pub quiz near me" (5K), and "music bingo near me" (500) are local pack queries. Google serves Maps results showing actual venues. A consultancy's blog post about how to run karaoke will never appear in the local pack for "karaoke near me." The plan suggests "add local schema" but this misunderstands the SERP format.
**Impact:** Three Tier 1/Tier 2 keywords in the plan are unwinnable, inflating the addressable volume figure by ~55,000.
**Fix:** Remove all "near me" variants from the keyword plan. They are not organic content opportunities for this type of site.

### CRIT-004: Several key indexable pages are missing from the plan (SPEC-002)
**Engines:** Codex
**Finding:** The following live, indexable pages have no keyword assignment: `/pub-marketing` (the exact-match route for a core topic!), `/licensees-guide` (the blog hub), `/results`, `/contact`, and all 12 `/licensees-guide/category/[category]` archive pages.
**Impact:** The strongest exact-match URL for "pub marketing" isn't even in the plan. Category pages could target cluster keywords but are ignored.
**Fix:** Add keyword assignments for all indexable routes. `/pub-marketing` should be the primary target for "pub marketing" (50/mo), not the homepage.

---

## High Findings

### HIGH-001: Keyword cannibalisation between service pages (SPEC-005, CANN data)
**Engines:** Codex
**Finding:** "Hospitality marketing agency" is assigned to both `/services` and `/pub-marketing-agency`. "Pub consultancy" appears under both `/services` and `/about`. Multiple secondary keywords overlap across the homepage, services hub, and agency page.
**Fix:** Assign one definitive page per keyword. `/pub-marketing-agency` owns "hospitality marketing agency." `/about` owns "hospitality consultant." `/services` focuses on service-category keywords.

### HIGH-002: Volume claims are inflated by double-counting (STRAT-005)
**Engines:** Claude
**Finding:** The plan adds pub quiz (50K) + pub quiz questions (50K) + quiz night (5K) + pub quiz near me (5K) = 110K as if additive. These share massive SERP overlap. The "146K+ monthly" headline is misleading.
**Fix:** De-duplicate using SERP overlap analysis. Group keywords by shared ranking URLs. Use the highest single keyword volume per group, not the sum.

### HIGH-003: No domain authority assessment (STRAT-006)
**Engines:** Claude
**Finding:** "Low competition" in Google Keyword Planner means low PPC competition, not low organic difficulty. A small consultancy site cannot rank page 1 for "pub quiz" (50K) against Wikipedia, BBC, and established quiz platforms without significant domain authority and backlinks.
**Fix:** Run an organic difficulty check (Ahrefs/Semrush). Prioritise keywords where current page 1 results have comparable DR/DA.

### HIGH-004: No content-to-conversion funnel (STRAT-007)
**Engines:** Claude
**Finding:** The plan creates content and targets keywords but doesn't map how traffic becomes revenue. No CTAs, no lead capture, no retargeting, no conversion tracking defined.
**Fix:** Design a conversion funnel: informational posts → operator-focused content → service pages → contact. Every page needs a defined conversion action.

### HIGH-005: Resource allocation unrealistic for 2-person team (STRAT-008)
**Engines:** Claude
**Finding:** 15 priorities × 8-15 hours each = 120-225 hours of content work. For a team where content isn't the primary revenue activity, this is 3-6 months.
**Fix:** Cut to 5-7 priorities per quarter. Months 1-3 = commercial content. Months 4-6 = expand.

### HIGH-006: One target page doesn't exist (SPEC-003)
**Engines:** Codex
**Finding:** "Pub promotion ideas" is mapped to `/licensees-guide/pub-promotion-ideas` — this page does not exist. The closest match is `/licensees-guide/christmas-pub-promotion-ideas`.
**Fix:** Either create the page or reassign the keyword to an existing page.

### HIGH-007: "EXISTS" labels overstate readiness (SPEC-005)
**Engines:** Codex
**Finding:** `boardgame-night-101` is labelled "EXISTS" for "pub games" (5K) but only covers board games — not darts, pool, card games, or traditional pub games. `brewery-tie-improve-your-deal` is labelled "EXISTS" for "pub lease" (5K) but only covers brewery ties, not the broader lease/tenancy topic.
**Fix:** These are "EXISTS — needs major expansion" not "EXISTS — reoptimise." Budget accordingly.

### HIGH-008: Regional page data contradicts earlier SEO docs (Codex CANN analysis)
**Engines:** Codex
**Finding:** The keyword plan says all regional keywords have 0 volume. But the site's own earlier SEO documents in `seo-overhaul/phase-2-discovery/` estimate "pub marketing London" at 50-100/mo and other locations at 10-50/mo. These are below GKP's reporting threshold but not zero. More importantly, these are the highest commercial-intent keywords in the plan — someone searching "pub marketing Surrey" is looking to hire exactly what Orange Jelly sells.
**Fix:** Don't write off regional pages. They have sub-50 volume but very high conversion intent. Maintain and cross-link them. They may be the most valuable pages per-visitor on the entire site.

---

## Medium Findings

### MED-001: No measurement framework (STRAT-009)
No KPIs, no baseline metrics, no success criteria defined. Fix: set GSC baselines and quarterly targets before starting.

### MED-002: Seasonal content lacks timing guidance (STRAT-010)
Beer garden content needs publishing by March, Christmas by September, Sunday roast by August. No calendar in the plan.

### MED-003: Missing compliance/legal content cluster (OPP-001 to OPP-004)
Pub licensing, PRS/PPL music licensing, food hygiene ratings, pub insurance — all absent. High operator intent.

### MED-004: Missing financial management content (OPP-005 to OPP-007)
Pub profit calculator, VAT guide, staff wages — no coverage. Interactive tools earn backlinks.

### MED-005: Missing drinks-specific content (OPP-013 to OPP-015)
No cask ale, real ale, or beer-focused content despite beer being the core pub product.

### MED-006: Missing sporting events content (OPP-016 to OPP-018)
Six Nations, Grand National, Euros — major trading days with no keyword targeting.

### MED-007: Missing mid-funnel content (OPP-026 to OPP-029)
No "agency vs DIY" comparison, no detailed case studies, no Google Business Profile guide.

### MED-008: No link building strategy (STRAT-015)
Cannot rank for 500+ volume keywords without backlinks. No outreach plan.

### MED-009: No Plan B (STRAT-016)
No review gates, no pivot triggers, no contingency if content doesn't rank.

### MED-010: Missing hub-and-spoke architecture (OPP-033, OPP-035)
No systematic internal linking strategy. Location pages are orphaned. No topic cluster structure defined.

---

## Low Findings

### LOW-001: Regional page assessment is sound (STRAT-012)
The plan correctly identifies these as conversion pages not SEO drivers. However, per HIGH-008, don't deprecate them — they have the highest per-visitor conversion potential.

### LOW-002: Problem page assessment is correct (STRAT-012)
Keep for PPC and internal linking. Good analysis.

### LOW-003: Minor secondary keyword overlaps
"Hospitality marketing ideas" appears as secondary on both homepage and low-budget-marketing-ideas post. Low impact but should be disambiguated.

---

## Cross-Engine Analysis

### Agreed (Both Claude and Codex Flagged)
- **Intent mismatch in prioritisation** — both engines independently concluded the plan optimises for traffic over leads
- **"Near me" keywords unwinnable** — both flagged these as local pack queries unsuitable for content SEO
- **Service page cannibalisation** — both found overlapping keyword assignments
- **Regional pages undervalued** — Codex found contradicting data in earlier SEO docs; Claude's strategy review noted the high conversion intent

### Codex-Only Findings (Investigate)
- 36 unassigned blog posts (SPEC-001) — high confidence, verified against file system
- Dead target URL for "pub promotion ideas" (SPEC-003) — verified, page doesn't exist
- `/pub-marketing` route omitted from plan (SPEC-002) — verified, the exact-match URL is missing

### Claude-Only Findings (Context-Dependent)
- Resource allocation concerns — requires business context to validate
- Measurement framework gaps — strategic recommendation, not a structural error
- Content opportunity gaps (compliance, finance, drinks) — estimated volumes need GKP validation

---

## Revised Priority Recommendation

Reordered by business impact (conversion potential x realistic ranking x effort):

| # | Action | Target Keywords | Vol | Rationale |
|---|--------|----------------|-----|-----------|
| 1 | **Homepage → "hospitality marketing"** | hospitality marketing (500) | 500 | Highest commercial intent. Direct service discovery. |
| 2 | **Service pages consolidation + optimisation** | hospitality marketing agency (500), hospitality consultant (500) | 1,050 | Closest to revenue. Consolidate IG/FB into hub. |
| 3 | **Brewery-tie → "Pub Lease" guide** | pub lease (5K), pub tenancy (500) | 5,500 | Highest-volume licensee-intent keyword. |
| 4 | **Pub health check → "How to Run a Pub"** | how to run a pub (500), running a pub (500) | 1,000 | Operator intent. Future clients. |
| 5 | **NEW: Buying a Pub guide** | buying a pub (500), how to start a pub (50) | 600 | Top-of-funnel for future clients. |
| 6 | **NEW: Pub Business Plan + template** | pub business plan (500) | 500 | Lead magnet. Email capture. |
| 7 | **NEW: Pub Website guide** | pub website (500), pub seo (50) | 550 | Directly sells OJ services. |
| 8 | **Menu engineering reoptimise** | menu engineering (500), pub menu ideas (500) | 1,000 | Operator intent. Core service. |
| 9 | **Complete keyword map for all 71 blog posts** | Various (50/mo each) | ~1,500 | Foundation for all other work. |
| 10 | **Quiz-night-101 reframe for operators** | pub quiz (50K), quiz night (5K) | 55K | Brand awareness. Reframe with licensee CTAs. |

**Deprioritised to Q2-Q3:** Pub quiz questions post (consumer), beer garden post (consumer), sunday roast post (consumer), boardgame/pub games rewrite (consumer), all "near me" variants (unwinnable).

---

## Recommendations

1. **Fix the intent mismatch first** — reorder the plan's priorities as above before creating any content
2. **Complete the keyword map** — all 71 blog posts and all indexable routes need assignments to prevent cannibalisation
3. **Add measurement** — set GSC baselines, define quarterly KPIs, build review gates at 90/180/365 days
4. **Run a domain authority check** — understand which keywords are realistically winnable before investing effort
5. **Design conversion funnels** — every content page needs a defined path to an enquiry
6. **Don't abandon regional pages** — they have the highest per-visitor conversion intent on the site
7. **Validate opportunity keywords** — run a batch 5 through GKP for the compliance, financial, and drinks keywords identified in the opportunities report

---

## Individual Specialist Reports

| Report | Location |
|--------|----------|
| Spec Compliance (Codex) | `tasks/codex-qa-review/2026-04-05-keyword-plan-spec-compliance-report.md` |
| Cannibalisation (Codex) | Output captured in session logs (file write failed) |
| Opportunities (Claude) | `tasks/codex-qa-review/2026-04-05-keyword-plan-opportunities-report.md` |
| Strategy (Claude) | `tasks/codex-qa-review/2026-04-05-keyword-plan-strategy-report.md` |
| **Merged Report** | `tasks/codex-qa-review/2026-04-05-keyword-plan-codex-qa-report.md` |
