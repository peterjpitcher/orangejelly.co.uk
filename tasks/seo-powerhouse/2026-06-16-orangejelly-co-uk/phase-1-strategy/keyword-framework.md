# Orange Jelly — Keyword & Intent Framework (Phase 1)

**Date:** 2026-06-16 · **Source for existing demand:** GSC 12-month Queries (701 queries) + Pages (132) — first-party, **Known**.
**New-term rule:** any term the site does not yet rank for has **no asserted volume**. Marked "validate via keyword-plan / GKP". Manual SERP checks (see `serp-snapshots.md`) inform intent/competition only — never volume, difficulty or rank.

---

## The framework at a glance

The site's demand is overwhelmingly **informational** (pub-operations questions) and its commercial demand, though present, converts almost nothing. The framework is built to **convert informational authority into enquiries** and **capture the commercial cluster Google already shows OJ for**.

| Cluster | Dominant intent | Target page type | Current coverage | GSC evidence (Known) | Priority tier |
|---|---|---|---|---|---|
| C1 Pub-marketing service / agency | Commercial | Service landing pages | Weak — pages exist, ~0 clicks | `pub marketing agency` 304 impr pos 19.6 (0c); `marketing agency for pubs` 161 impr pos 18.3 (0c); `pub marketing` 666 impr pos 22.3 (0c) | **Immediate** |
| C2 Done-for-you channel services | Commercial | Service sub-pages | Weak/absent | `instagram services for pubs` 256 impr pos 7.0 (0c); `content creation for pubs` 226 impr pos 14.8 (0c); `paid social for pubs` 207 impr pos 11.2 (0c); `facebook services for pubs` 123 impr pos 6.1 (0c) | **Immediate** |
| C3 Pub rescue / turnaround | Commercial | Solution page | Partial (`empty-pub-solutions`, `quiet-midweek-solutions`) | `fix my pub` 109 impr pos 5.7 (1c); `pub business recovery services stockport` 22 impr pos 7.9 (0c) | **Immediate** |
| C4 Pub event ideas | Informational → commercial bridge | Guide + bridge to events service | Strong (ranks) | `event ideas for pubs` 956 impr pos 16.8; `pub event ideas` 620 impr pos 15.3 (5c); summer-pub-event-ideas page 7,572 impr/96c | **Immediate** |
| C5 Quiz nights | Informational → bridge | Guide + bridge | Strong | quiz-night-ideas page 4,348 impr/76c pos 11.8; `quiz night ideas` 207 impr pos 7.7 (4c); `pub quiz ideas` 107 impr pos 12.5 (4c) | **Short-term** |
| C6 Pub food / menu | Informational → bridge | Guide + bridge | Strong | profitable-pub-food-menu-ideas page 4,479 impr/67c pos 7.4; `profitable menu items` 243 impr pos 18.9; `pub menu ideas` 128 impr pos 13.9 | **Short-term** |
| C7 Social media for pubs | Informational → bridge to C2 | Guide → service | Strong | social-media-strategy-for-pubs page 3,836 impr/37c pos 12.6; `social media marketing for pubs` 380 impr pos 12.0 (1c) | **Short-term** |
| C8 Seasonal pub playbooks | Informational | Seasonal guides | Partial; new ones not indexed | `christmas pub ideas` 209 impr pos 14.8; christmas-pub-promotion-ideas page 1,375 impr/17c; new autumn/cask guides "discovered, not crawled" | **Short-term** |
| C9 Local pub marketing (regional) | Commercial-local | Location pages | Thin (Kent/Oxon exist, ~650 words) | `pub marketing oxfordshire` page exists; recovery-services-stockport pos 7.9 | **Medium-term** |
| C10 Pub operations / cost & survival | Informational | Guides | Strong, broad | `pub wages` , `compete with wetherspoons` 1,050 impr/13c pos 9.2; `recession-proof` etc. | **Medium-term** |

## Intent mapping — the commercial gap, stated plainly

- **Informational demand** (C4–C8, C10) is where the site lives: ~458 clicks / 39,216 impr over 12 months across the guides. This is healthy top-of-funnel and must be protected.
- **Commercial demand** (C1–C3) is real and **already surfaced to OJ**: 57 commercial-intent queries = 2,908 impressions, but only **2 clicks** (≈0.07% CTR), at positions mostly 6–20. *(Source: search-queries.csv intent-classified, Known.)* The gap is not "no demand" or "not ranking" — it is **weak commercial pages that don't earn the click**. That is the framework's number-one job.
- **Local-commercial** (C9) is an emerging proof point (`...recovery services stockport` at pos 7.9 on tiny volume) suggesting a regional location-page system could capture service-with-location intent.

## Page-type mapping

- **Service landing pages (new/strengthened):** C1 hub ("pub marketing help/agency"), C2 channel pages (social, content, paid social), C3 "fix my pub"/turnaround. These target the commercial clusters directly and are the enquiry destinations.
- **Guides (existing, defend + bridge):** C4–C8, C10 keep ranking and each gains an intent-matched internal link + contextual "done-for-you" bridge to the relevant service page.
- **Location pages (system):** C9 — a templated regional set, internally linked from the service hub.
- **Seasonal guides:** C8 — ensure the new ones index and are linked from the seasonal hub.

## Priority tiers (opportunity × achievability ÷ effort)

- **Immediate:** C1, C2, C3 (commercial capture) + C4 bridge (highest-traffic guide → events service). Plus the analytics prerequisite (cannot prove enquiry lift otherwise).
- **Short-term:** C5, C6, C7 bridges + position-improvement; C8 seasonal indexing.
- **Medium-term:** C9 location system; C10 ongoing operations content for top-of-funnel breadth.

## Current coverage vs gaps

- **Has content, underperforming:** C1–C3 (commercial pages exist but earn ~0 clicks) → fix, don't create from scratch.
- **Has content, performing:** C4–C8, C10 → defend + bridge.
- **Thin:** C9 location pages (~650 words each).
- **Total gap (validate before building):** named-channel service pages may be missing for some terms in C2 (`facebook services for pubs`, `social video services for pubs`) — confirm existence in Phase 2/3 before deciding build vs strengthen. Volume for any net-new term = **validate via keyword-plan / GKP**.

## Cannibalisation watch (flag for Phase 2/3)

Multiple overlapping event/quiz/seasonal guides (`summer-pub-event-ideas`, `how-to-run-successful-pub-events`, `pub-event-template-profit-nights`, `pop-up-events-for-pubs`, quiz-night-ideas vs quiz-night-101) may split equity across the C4/C5 clusters. Confirm with GSC page-vs-query mapping in Phase 2 (the 12-month Queries export lacks a page column, so query→page attribution must be rebuilt) before consolidating.

**Constraint reminder for all downstream copy:** only `/CLAIMS.md` approved percentages may appear (+828% search visibility, +403% table bookings, +567% private hire, −89% no-shows, +98% food revenue). No save/savings wording. British English. Greene King = Tenant, BII = Member.
