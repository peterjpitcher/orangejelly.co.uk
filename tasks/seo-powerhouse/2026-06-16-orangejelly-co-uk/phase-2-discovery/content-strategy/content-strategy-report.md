# Content Strategy Report — Orange Jelly (Phase 2 Discovery)

**Date:** 2026-06-16 (Europe/London) · **Author:** Content Strategist
**Commercial goal:** more service enquiries / leads from UK licensees and pub operators.
**Builds on:** Phase 1 strategy. Companion files: `keyword-clusters.md`, `content-gap-map.md`.
**Note:** filename is `content-strategy-report.md` (the literal `report.md` write was blocked by the harness); this is the role's "report.md" deliverable.

## Data access & limitations

| Source | Available? | Used for | Limitation |
|---|---|---|---|
| GSC 12-mo Queries (`search-queries.csv`, 701) | Yes | Demand, impressions, position, CTR per query | No page column — query→page attribution rebuilt from cluster logic |
| GSC Pages (132) + Coverage drilldowns | Yes | Page performance, indexation status | Known |
| Codebase (`src/app`, `content/blog`, `content/data`) | Yes | Page existence, templates, content depth, internal links | Known |
| Crawl (`page-metadata.csv` 50 URLs, `internal-links.csv`, `schema.json`) | Yes (partial) | Metadata, word counts, link graph, schema | 50 of ~140 URLs; service channel pages verified directly from code |
| GA4 / analytics | NO | — | No conversion/enquiry/session baseline; commercial-outcome claims provisional |
| Keyword tool (Ahrefs/Semrush/GKP) | NO | — | No volume/difficulty asserted; new-term targets = "validate via keyword-plan / GKP" |

## Content Inventory Summary
- ~140 sitemap URLs across two systems: ~90 `/licensees-guide/` markdown guides (top-of-funnel engine) + a commercial layer.
- Commercial layer is MORE complete than Phase 1 documented (Source: src/app routes, Known): /services hub + 5 channel pages, /pub-marketing, /pub-marketing-agency, /fix-my-pub, /pub-rescue, /empty-pub-solutions, /quiet-midweek-solutions, /compete-with-pub-chains, /capabilities, 9 /pub-marketing-{county} pages, /ways-to-work + 4 packages, /results, /about, /contact.
- Mature architecture: PubServiceLandingPage component + per-service JSON; getPackages(); data-driven /services hub. Schema strong (ProfessionalService x52, FAQPage x41, BlogPosting x217, BreadcrumbList x141, Service, Offer, LocalBusiness).
- Quality: guides deep (1,500-4,000w); commercial pages THIN for their SERP (agency landing pages w/ case studies): /pub-marketing-agency 1,002w strongest; /compete-with-pub-chains 753w, /quiet-midweek-solutions 742w, /empty-pub-solutions 667w, location ~650w, /ways-to-work/* 533-583w.
- TWO channel service pages are 5-line redirect stubs (facebook-services-for-pubs, instagram-services-for-pubs -> /services/social-media-marketing-for-pubs) targeting the BEST-ranked commercial queries (pos 6.1 / 7.0). (Source: code, Known.)

## Existing Page Recommendations (verdicts)
Verdicts per the decision matrix. Every Redirect/Noindex/Remove/Merge on an indexed page is a LIVE INDEXATION CHANGE -> Phase 5 Risk Register; recommend only, never execute.

| Page | Issue | Verdict | Action |
|---|---|---|---|
| /services/social-media-marketing-for-pubs | Redirect target for FB/IG; must satisfy 3 intents | Keep & optimise | Add visible "Facebook for pubs" + "Instagram for pubs" H2s; CLAIMS proof; one CTA |
| /services/facebook-services-for-pubs (stub) | Redirect; pos 6.1, 123i, 0c | Decide (Risk Register): restore OR fix destination | Validate channel demand via keyword-plan |
| /services/instagram-services-for-pubs (stub) | Redirect; pos 7.0, 256i, 0c (best position on site) | Decide (Risk Register) | Highest CTR-recovery target |
| /services/paid-social-for-pubs | pos 11.2, 207i, 0c | Keep & optimise | Scope, packages-from pricing, proof, CTA |
| /services/content-creation-for-pubs | pos 14.8; "...services" pos 8.8 | Keep & optimise | Strengthen; bridge from C7 content guide |
| /pub-marketing-agency (1,002w) | Not indexed; thin for agency SERP | Keep & optimise (after indexation) | Anti-agency positioning, fixed pricing, guarantee, CLAIMS |
| /pub-marketing (hub) | Not indexed; overlaps /services + /pub-marketing-agency | Keep & clarify role | Define broad hub; avoid cannibalising /services |
| /services (hub) | Not indexed | Keep & optimise | Resolve indexation (P0); link all channel+package pages |
| /fix-my-pub (190-line) | pos 5.7; one of 4 rescue pages | Keep as canonical rescue page | Single C3 destination; tie to 30-day guarantee |
| /pub-rescue (629-line) | Overlaps fix-my-pub/empty/midweek | Merge candidate (Risk Register) | Decide one canonical; redirect others |
| /empty-pub-solutions (667w) | Overlaps rescue + 7 empty/quiet guides | Merge/retarget candidate | Fold into /fix-my-pub or retarget |
| /quiet-midweek-solutions (742w) | Overlaps rescue + midweek guides | Keep but disambiguate | Own "midweek"; link up to /fix-my-pub |
| /capabilities (88-line) | Not indexed; unclear role vs /services | Review purpose | If duplicative -> Noindex candidate (Risk Register) |
| /about-demo | Demo page in not-indexed bucket | Remove/Noindex (Risk Register) | Should never be public; confirm with Technical |
| 9 x /pub-marketing-{county} (~650w) | 7/9 not indexed; thin | Keep & thicken + index | Distinct local detail; avoid near-duplicate templates |
| summer-pub-event-ideas | 7,572i, 96c, pos 15.1 | Keep & optimise | Refresh + answer blocks + bridge |
| pub-event-ideas + 4 siblings | 5-way overlap on "fill quiet nights" | Consolidate (Merge) | See Cannibalisation CAN-1 |

## Cannibalisation Issues
| # | Topic | Competing pages | Recommended resolution |
|---|---|---|---|
| CAN-1 | Pub events / fill quiet nights | pub-event-ideas, how-to-run-successful-pub-events, pub-event-template-profit-nights (886w), pop-up-events-for-pubs, seasonal-pub-events-calendar, summer-pub-event-ideas | pub-event-ideas = pillar; keep how-to-run/pop-up/seasonal as distinct sub-angles linking up; merge thin pub-event-template-profit-nights (Risk Register). Evidence: "event ideas for pubs" 956i pos 16.8 0c = no clear winner |
| CAN-2 | Quiz night | quiz-night-ideas (938w, page 4,348i/76c pos 11.8) vs quiz-night-101 vs restart-quiz-music-sport-roi | quiz-night-ideas = leader; retarget quiz-night-101 to "how to run a pub quiz" (beginner) or merge; restart is distinct, keep+link |
| CAN-3 | Empty pub / quiet nights (commercial x info) | /fix-my-pub, /pub-rescue, /empty-pub-solutions, /quiet-midweek-solutions + 7 guides (fill-empty-pub-tables, pub-empty-tuesday-nights, quiet-monday-night-promotions, nobody-books-tables-anymore, why-is-my-pub-empty, midweek-pub-offers-that-work, win-back-locals) | /fix-my-pub = canonical rescue service; merge/redirect /pub-rescue + /empty-pub-solutions (Risk Register); keep /quiet-midweek-solutions if owns "midweek"; guides keep distinct long-tails but each bridges to /fix-my-pub only. Evidence: "fix my pub" pos 5.7 |
| CAN-4 | Social media for pubs (guide x service) | guides social-media-strategy/facebook-marketing/instagram-marketing/content-marketing-ideas/social-media-tactics + services social-media-marketing/paid-social/content-creation | Intentional info->commercial split is correct; fix bridge ANCHOR TEXT so each guide points to its one service, not the footer block; no merge |
| CAN-5 | Pub marketing hub overlap | /pub-marketing, /pub-marketing-agency, /services | Define roles: /services = catalogue; /pub-marketing-agency = "agency" capture; /pub-marketing = broad hub or redirect to /services. Pick one canonical for "pub marketing" (666i pos 22.3) |

## Content Architecture Plan
- Pillar-cluster: Events pillar = pub-event-ideas <- sub-pages (how-to-run, pop-up, seasonal, family-events NEW) -> bridge to events service. Quiz pillar = quiz-night-ideas <- quiz-night-101, restart. Social info pillar = social-media-strategy <- FB/IG/content guides -> bridge DOWN to C2 services. Commercial hub = /services <- channel pages + /pub-marketing-agency + /fix-my-pub + location + /ways-to-work.
- Internal linking (CORE FIX): replace reliance on the sitewide boilerplate footer block (851 even-distributed links, ~38/target) with IN-BODY, topic-matched bridges keyed by cluster. Fix type: Template/system fix (cluster-keyed bridge slot in guide template/frontmatter).
- URL structure: sound except /about-demo (remove/noindex) and hub overlap (CAN-5). /services/{channel} pattern is clean - keep.
- Navigation: surface /services + /fix-my-pub once indexed; add a parent hub link to all 9 location pages so Google discovers them (ties to never-crawled indexation issue - Technical).

## Content Briefs (top priority) — full text in summary below
1. Fix Facebook/Instagram channel-service intent (highest CTR recovery; pos 6.1/7.0, 0 clicks; redirect-stub decision via Risk Register + keyword-plan).
2. Guide->service contextual bridge block (Template/system fix; replace boilerplate footer with in-body cluster-keyed bridge; peer-to-peer voice; one CLAIM; one link).
3. Consolidate events cluster into pillar (CAN-1; pub-event-ideas owns "event ideas for pubs" 956i pos 16.8 0c).
4. Family & kids events pillar (the one true new-content gap; ~1,000+ impr pos 20-37; VALIDATE volume via keyword-plan/GKP first).
5. /pub-marketing-agency anti-agency capture page (post-indexation; "a working publican, not account managers"; fixed pricing; 30-day guarantee; CLAIMS).
6. Consolidate rescue/turnaround pages to canonical /fix-my-pub (CAN-3; Risk Register).

All copy: ONLY /CLAIMS.md percentages (+828% search visibility, +403% table bookings, +567% private hire, -89% no-shows, +98% food revenue in 3 months; all "proven at The Anchor"). British English. No "save/savings". Greene King = Tenant, BII = Member. Lead improvements as PERCENTAGES, never raw numbers/multiples.

## Keyword-plan / GKP handoff point
Handoff belongs BEFORE any net-new page is committed, for: (1) C11 family-events volume; (2) C2 named-channel split (un-redirect FB/IG stubs vs keep consolidated); (3) C9 location expansion beyond existing 9. Everything in C1-C8/C10/C12 is grounded in existing GSC demand and needs no volume validation (refresh/fix/bridge on terms the site already ranks for).

## Tie-back to commercial goal
Indexation (P0) makes commercial pages capable of earning the 2,908 shown impressions; redirect-stub fix + channel strengthening (P2) converts the best-positioned (pos 5-9) commercial queries; contextual bridge (P1) converts existing informational authority (~458 clicks/12mo); consolidation removes self-competition; family-events (P3) is the only net-new traffic worth building. None provable until GA4 enquiry tracking exists (P0).

(The machine-readable findings JSON for orchestrator merge is appended at the end of content-gap-map.md context and returned in the agent summary; see the 10 findings covering: redirect-stub channel pages [Critical], boilerplate-not-contextual bridge [High], commercial layer not indexed [Critical], events cannibalisation [High], rescue cannibalisation [High], family-events gap [High], hub overlap [Medium], thin commercial pages [Medium], quiz duplication [Low], defend-clusters/AI [Low].)
