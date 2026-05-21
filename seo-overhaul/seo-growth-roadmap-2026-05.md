# SEO Growth Roadmap — Orange Jelly (refreshed 2026-05-21)

> Supersedes the April 2026 roadmap (`seo-growth-roadmap.md`), which predates this GSC pull and the new location pages. Driven by first-party Google Search Console data.

## Data Access & Limitations
| Source | Available | Notes |
|---|---|---|
| GSC Performance (3-month + 16-month) | ✅ Authoritative | Pages + Queries + Devices + Countries. Property is **domain-level** — includes `cheersai.` and `management.` subdomain noise (exclude from analysis). |
| Codebase (Next.js 15) | ✅ | `next.config.js`, `src/lib/seo-overrides.ts` (104 entries), `src/lib/metadata.ts`, all routes + 96 blog posts read. |
| Live site checks | ⚠️ Partial | curl/wget blocked in sandbox; redirects confirmed from `next.config.js`; technical agent confirmed live 308s. |
| PageSpeed/CrUX field data | ❌ | Rate-limited without API key. CWV section is directional (code-based) — **not measured**. |
| Keyword volume/difficulty tools (Ahrefs/Semrush) | ❌ | No external tool. All demand figures are **real GSC impressions**, not estimated volume. `/keyword-plan` will add planner data. |

## Executive Summary
Orange Jelly's organic presence is **entirely carried by the blog** (`/licensees-guide/*` is ~95% of impressions) and is throttled by one dominant, fixable problem: **a 1.1% click-through rate**. Pages routinely rank position 5–12 yet earn near-zero clicks because titles are brand/descriptive-led rather than query-led, and meta descriptions are feature statements without a hook or CTA. Separately, the site's **commercial pages are nearly invisible** — and worse, five service pages that *did* earn buyer-intent rankings (pos 2–6) were redirected to a generic `/capabilities` page in the April overhaul, throwing that equity away. The fastest gains: (1) rescue CTR via the existing `seo-overrides.ts` system, (2) reinstate the service pages, (3) push ~50 striking-distance pages onto page 1, and (4) build the missing events/pop-up/family content pillar where there is large unmet demand. Recommended focus order is in `page-worklist-2026-05.md`.

## Strategic Direction — where this site can realistically win
1. **Own the "pub events / ideas" space.** Largest demand pool (event ideas for pubs 814, pop up events 403, kids craft 292, christmas pub ideas 180) and the site already ranks; needs a year-round pillar + CTR fixes.
2. **Convert informational authority into commercial clicks.** The blog ranks; the money pages don't. Internal linking from high-impression posts → service/marketing pages is the bridge.
3. **Recapture wasted buyer-intent rankings** (service pages — D1). Real demand, already ranking, currently redirected to a mismatch.
4. **Win CTR before chasing new rankings.** A 1.1%→3% CTR at current impressions roughly triples clicks with zero new ranking work.

## Current Performance Baseline (the benchmark to beat)
- **16-month:** 403 clicks / 36,241 impressions / **1.11% CTR** / 117 visible pages / 597 queries.
- **3-month:** 184 clicks / 17,612 impressions / 1.04% CTR (≈half of all-time clicks are recent — trajectory is up, absolute volume tiny).
- **Commercial query positions:** pub marketing 22.8, pub marketing agency 19.4, social media marketing for pubs 11.8, content creation for pubs 14.8.
- **Proof CTR can work:** `village-pub-dying-village-survival` 5.6%, `pub-event-template-profit-nights` 8.7%, homepage 36% — emotive, specific titles convert.

## Key Findings by Discipline
### Technical SEO
- **CRITICAL (D1):** 5 `/services/*` pages + `/services` hub are `permanent` redirects (`next.config.js`); they still rank pos 2–6.5 for buyer queries → 0 clicks. Reinstate.
- Foundations are otherwise sound: self-canonicals, valid sitemap/robots, HSTS+CSP, JSON-LD present, AI crawlers allowed.
- `/about-demo` already fixed (410 Gone) — its 22 impr are stale residue. `/test-shadcn` live (delete).
- `/images/logo.png` 404s in 2 components (`PubMarketingLocationLandingPage.tsx:53`, `blog/EnhancedBlogSchema.tsx:48`) — rest of site correctly uses `/logo.png`. Low severity, easy fix. *(Corrected: not site-wide as first reported.)*
- Thin category taxonomy pages (pos 27–53) — enrich as hubs or noindex.
- Commercial pages absent from global nav/footer — weak internal link equity.

### Content & Keywords
- 15 keyword clusters mapped to target pages (see worklist). Biggest gap: **pop-up / family events** (~960 impr at pos 28–37, no strong page).
- CTR crisis is a **systemic title/meta pattern**, fixable at the `seo-overrides.ts` level (104 entries already exist).
- Cannibalisation across quiz, events "101" posts, empty-tables trio, reviews trio, competition, EPOS, Christmas — merge map in worklist.
- 23 blog posts have zero visibility (recent/mis-targeted); several target real demand and just need indexing + internal links.

### UX & Conversion
- Best-converting pages prove emotive, specific, problem-led titles work. Apply that voice in rewrites. (Existing April UX/CRO report still broadly valid.)

## The Roadmap

### Tier 1 — Immediate (this week)
- **CTR rescue batch** via `seo-overrides.ts`: P1 informational pages (worklist 9–17) — title front-load + meta hook/CTA. *No routing risk.*
- **Decision D1**: approve reinstating service pages; **Decision D2**: approve merge map; **Decision D3**: approve location-page plan.
- **Tech clean-up**: delete `/test-shadcn`; fix `/images/logo.png` in 2 components.
- Commercial title/meta: `/pub-marketing`, `/pub-marketing-agency`, `/pub-rescue`.

### Tier 2 — Short-term wins (4–8 weeks)
- Reinstate + optimise the 5 service pages (post-D1).
- Execute cannibalisation merges with 301s (post-D2).
- Internal-linking pass: high-impression blog posts → commercial pages; add commercial pages to nav/footer.
- P2 meta-rewrite batch (pos 4–12, 0% CTR pages).
- Build the **events pillar** (broaden `summer-pub-event-ideas`) + **pop-up** and **family** event pages.

### Tier 3 — Medium-term growth (1–3 months)
- Refurbishment, menu, social, cost/finance, and competition cluster build-out with pillar→cluster internal linking.
- Unique local content for London + Surrey location pages; noindex the rest until populated.
- Activate the 23 zero-visibility blog posts (indexing + links + retargeting).

### Tier 4 — Long-term strategic bets (3–6 months)
- Category ownership of "pub events" and "pub marketing" through depth + authority building.
- Authority/digital-PR (see April authority report) to lift the whole domain — the location and commercial pages need authority, not just on-page work.

## Risk Register (changes needing explicit sign-off)
| Recommended change | Risk | Impact if wrong | Rollback | Approval |
|---|---|---|---|---|
| Reinstate 5 service pages (remove redirects in `next.config.js`) | Re-introduces URLs previously redirected; brief duplicate-intent overlap with `/capabilities` | Temporary ranking flux | Re-add redirects | **Required** |
| 301 merges (quiz, competition, empty-pub, reviews, EPOS, Christmas, local-pub-marketing) | Wrong merge target loses a ranking | Lost rankings on merged URLs | Restore page + remove 301 | **Required** |
| 301 `/about-demo` → `/about` | Minimal (stale page) | Negligible | Remove redirect | **Required** |
| Noindex thin category pages + unpopulated location pages | Over-noindexing useful pages | Lost crawl/visibility | Remove noindex | **Required** |
| Delete `/test-shadcn` | None (dev page) | None | Restore from git | Low |
| Title/meta rewrites via `seo-overrides.ts` | Low — content only, reversible | Could dip if worse than current | Revert entry | Low (review copy) |

## Measurement Framework (outcomes, not outputs)
Track monthly in GSC against the 2026-05 baseline:
- **CTR** (headline): 1.11% → target 3%+ on the P1 set. *Primary success metric.*
- **Clicks**: 403/16mo and 184/3mo baselines — track 3-month rolling.
- **Striking-distance → page 1**: count of pages moving from pos 5–20 into top 10 (51 candidates today).
- **Commercial query positions**: pub marketing (22.8), pub marketing agency (19.4), social media marketing for pubs (11.8) → target top 10.
- **Service-page clicks** post-reinstatement (currently 0 despite pos 2–6).
- **New pillar impressions**: events / pop-up / family pages from zero baseline.
- Leading indicator: indexed-and-linked count for the 23 zero-visibility posts.

## Next Step
Work `page-worklist-2026-05.md` top-down. For each page (starting Tier 1), run `/keyword-plan` to lock the primary + secondary keywords, then optimise title/meta/content. Settle decisions D1–D3 before keyword-planning the service pages, merge targets, and location pages.

## Out of Scope / Future
- Off-domain authority/backlink execution (covered in April `authority/` report — still valid).
- `cheersai.` / `management.` subdomains (separate apps; GSC noise only).
- CWV optimisation pending real PageSpeed/CrUX measurement (run with an API key).
