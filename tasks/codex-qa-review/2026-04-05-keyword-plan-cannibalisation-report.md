Audited [keyword-plan.md](/Users/peterpitcher/Cursor/OJ-OrangeJelly.co.uk/seo-overhaul/keyword-plan.md).

Exact duplicated keyword targets in the plan are: `hospitality marketing agency`, `pub marketing agency`, `pub consultancy`, `pub marketing ideas`, `hospitality marketing ideas`, `pub advertising`, `bar promotion ideas`, `instagram for pubs`, `pub instagram ideas`, `facebook marketing for pubs`, `pub facebook page`, `empty pub`, `pub bingo`, `pub social media ideas`, `pub decor ideas`, `pub ambience`, `pub atmosphere`.

### CANN-001: Commercial service intent is split across three parent pages
- **Keywords involved:** `hospitality marketing agency`, `pub marketing agency`, `pub consultancy`, `hospitality consultant`
- **Pages involved:** `/services`, `/pub-marketing-agency`, `/about`
- **Type:** Cannibalisation
- **Severity:** Critical
- **Description:** `/services` and `/pub-marketing-agency` both target agency intent, while `/about` and `/services` both touch consultant/consultancy intent. The plan never cleanly separates hub, service, and trust-page roles, so core commercial signals are fragmented.
- **Recommendation:** Make `/pub-marketing-agency` the sole SEO page for agency terms, keep `/services` as a neutral services hub, keep `/about` brand-led, and assign consultancy intent to only one commercial URL.

### CANN-002: Pub marketing and promotion intent is scattered across homepage, blog, and service pages
- **Keywords involved:** `pub marketing ideas`, `hospitality marketing ideas`, `pub promotion ideas`, `how to promote a pub`, `pub advertising`, `bar promotion ideas`
- **Pages involved:** `/`, `/licensees-guide/low-budget-pub-marketing-ideas`, `/pub-marketing-no-budget`, `/licensees-guide/pub-promotion-ideas` (marked `redirect?`), `/licensees-guide/local-pub-marketing`, `/services`, `/services/paid-social-for-pubs`
- **Type:** Intent Overlap
- **Severity:** High
- **Description:** One core intent, “how do I market or promote a pub?”, is spread across too many URLs. Exact duplication already exists on `pub marketing ideas`, while the rest are close synonyms Google is likely to cluster together.
- **Recommendation:** Keep one informational hub for marketing ideas and one commercial page for paid promotion/advertising; remove idea-led keywords from homepage and PPC/problem pages, and merge or redirect weaker duplicates.

### CANN-003: Social media keywords are split across too many URLs
- **Keywords involved:** `instagram for pubs`, `pub instagram ideas`, `facebook marketing for pubs`, `pub facebook page`, `pub social media ideas`
- **Pages involved:** `/services/social-media-marketing-for-pubs`, `/services/instagram-services-for-pubs`, `/services/facebook-services-for-pubs`, `/licensees-guide/instagram-marketing-for-pubs`, `/licensees-guide/facebook-marketing-local-pubs`, `/licensees-guide/social-media-strategy-for-pubs`, `/licensees-guide/social-media-tactics-footfall-seven-days`
- **Type:** Cannibalisation
- **Severity:** High
- **Description:** The plan duplicates platform terms across service pages and blog posts, and it also duplicates `pub social media ideas` across two advice posts. That is too many URLs for one low-volume cluster, especially when the plan already recommends consolidating Instagram/Facebook service pages.
- **Recommendation:** Keep one commercial social hub and one informational social hub; merge, redirect, or canonical the extra pages.

### CANN-004: Problem-solution pages compete with the organic rescue content
- **Keywords involved:** `empty pub`, `struggling pub`, `rescue my pub`, `how to increase footfall`, `quiet pub midweek`
- **Pages involved:** `/empty-pub-solutions`, `/fix-my-pub`, `/pub-rescue`, `/quiet-midweek-solutions`, `/licensees-guide/fill-empty-pub-tables`, `/licensees-guide/revenue-levers-struggling-pubs`
- **Type:** Intent Overlap
- **Severity:** High
- **Description:** The plan says these pages are for conversion, not SEO, but it still assigns them SEO keywords that overlap the rescue/footfall blog content. `empty pub` is already duplicated exactly, and the rest serve the same recovery intent.
- **Recommendation:** If they are PPC pages, noindex or canonical them. If they stay indexable, collapse them into one rescue hub and let the blog posts handle the informational subtopics.

### CANN-005: `pub bingo` is assigned to two different bingo pages
- **Keywords involved:** `pub bingo`
- **Pages involved:** `/licensees-guide/cash-bingo-101`, `/licensees-guide/music-bingo-101`
- **Type:** Cannibalisation
- **Severity:** Medium
- **Description:** `pub bingo` is primary on the cash-bingo page and secondary on the music-bingo page. Because music bingo is a subtype of bingo, the two URLs can compete rather than reinforce each other.
- **Recommendation:** Let one page own `pub bingo` and keep the other tightly focused on `music bingo` only.

### CANN-006: Decor, ambience, and atmosphere intent is over-segmented
- **Keywords involved:** `pub decor ideas`, `pub ambience`, `pub atmosphere`, `pub interior design`
- **Pages involved:** `/licensees-guide/low-cost-decor-refreshes-new-improved`, `/licensees-guide/reboot-pub-atmosphere-on-budget`, `/licensees-guide/pub-refurbishment-on-budget`
- **Type:** Cannibalisation
- **Severity:** High
- **Description:** These three pages all answer the same “improve the look and feel of the pub” intent. Exact duplication already exists on `pub decor ideas`, `pub ambience`, and `pub atmosphere`.
- **Recommendation:** Pick one ambience/decor hub, keep refurbishment as the structural/capex spoke, and strip overlapping secondary keywords from the other pages.

### CANN-007: The quiz cluster has no fully defined hub-and-spoke structure
- **Keywords involved:** `pub quiz`, `quiz night`, `pub quiz ideas`, `quiz night ideas`, `pub quiz rounds`, `pub quiz questions`, `free pub quiz`, `christmas pub quiz`
- **Pages involved:** `/licensees-guide/quiz-night-101`, `/licensees-guide/quiz-night-ideas`, `/licensees-guide/christmas-pub-promotion-ideas`, `NEW quiz questions page (URL TBD)`
- **Type:** Clustering Gap
- **Severity:** High
- **Description:** This is the strongest cluster in the plan, but only one cross-link is explicitly defined. The plan does not set clear ownership for ideas, rounds, question banks, free assets, and seasonal quiz intent.
- **Recommendation:** Make `/licensees-guide/quiz-night-101` the hub, `/quiz-night-ideas` the ideation spoke, the new questions page the question-bank spoke, and keep Christmas quiz intent on the seasonal page only.

### CANN-008: The pub events cluster lacks ownership boundaries
- **Keywords involved:** `pub event ideas`, `pub entertainment ideas`, `pub games`, `music bingo`, `cash bingo`, `pub karaoke`, `pub beer garden`
- **Pages involved:** `/licensees-guide/how-to-run-successful-pub-events`, `/licensees-guide/boardgame-night-101`, `/licensees-guide/music-bingo-101`, `/licensees-guide/cash-bingo-101`, `/licensees-guide/karaoke-night-101`, `/licensees-guide/seasonal-pub-events-calendar`, `/licensees-guide/summer-pub-event-ideas`, `NEW beer garden page (URL TBD)`
- **Type:** Clustering Gap
- **Severity:** Medium
- **Description:** The plan calls `/licensees-guide/how-to-run-successful-pub-events` a hub but never defines the spoke structure. It also adds `pub beer garden` as an angle on `summer-pub-event-ideas` while proposing a dedicated beer-garden page, which sets up future overlap.
- **Recommendation:** Use `/licensees-guide/how-to-run-successful-pub-events` as the umbrella hub, let each activity page own only its exact format keyword, and make the new beer-garden page the sole owner of beer-garden terms.

### CANN-009: The food and menu cluster is missing a clear internal-linking model
- **Keywords involved:** `pub food ideas`, `pub menu ideas`, `pub food menu ideas`, `gastropub menu ideas`, `pub sunday roast`, `sunday lunch pub`, `pub lunch ideas`
- **Pages involved:** `/licensees-guide/profitable-pub-food-menu-ideas`, `/licensees-guide/menu-engineering-lift-average-spend`, `NEW sunday roast page (URL TBD)`
- **Type:** Clustering Gap
- **Severity:** Medium
- **Description:** The plan treats food ideas, menu engineering, roast, and lunch as separate wins but does not define how they reinforce one another. That weakens topical authority and makes future overlap more likely.
- **Recommendation:** Put one food-performance hub above these pages, keep menu engineering as the optimisation spoke, and route roast/lunch intent into one Sunday-roast spoke.

### CANN-010: Several “top opportunities” are consumer or local-intent terms, not B2B operator terms
- **Keywords involved:** `pub quiz`, `karaoke near me`, `pub quiz near me`, `music bingo near me`, `pub beer garden`, `pub sunday roast`, `sunday lunch pub`
- **Pages involved:** `/licensees-guide/quiz-night-101`, `/licensees-guide/karaoke-night-101`, `/licensees-guide/music-bingo-101`, `NEW beer garden page (URL TBD)`, `NEW sunday roast page (URL TBD)`
- **Type:** Data Issue
- **Severity:** Critical
- **Description:** These terms are mostly venue-discovery or consumer-intent queries. The plan treats them as traffic drivers for B2B advisory pages, and for the `near me` terms it assumes a guide page can win with local schema, which is usually false.
- **Recommendation:** Re-score the plan by SERP intent fit, not raw Keyword Planner volume. Keep operator-intent queries as priorities and treat local/consumer terms as GBP, location-page, or event-listing opportunities instead.

### CANN-011: The projected `146,000+` opportunity is overstated
- **Keywords involved:** `pub quiz`, `quiz night`, `pub quiz near me`, `pub beer garden`, `beer garden ideas`, `pub garden ideas`, `pub sunday roast`, `sunday lunch pub`
- **Pages involved:** `/licensees-guide/quiz-night-101`, `/licensees-guide/music-bingo-101`, `/licensees-guide/boardgame-night-101`, `/licensees-guide/brewery-tie-improve-your-deal`, `/`, `/pub-marketing-agency`, `NEW beer garden page (URL TBD)`, `NEW sunday roast page (URL TBD)`
- **Type:** Data Issue
- **Severity:** High
- **Description:** The plan adds close variants as if they were separate traffic pools and mixes multiple intents into one headline number. That inflates the upside materially.
- **Recommendation:** Replace the gross total with one primary keyword per page, supporting variants grouped under that page, and an intent-adjusted opportunity score.

### CANN-012: The “regional pages = zero volume” verdict is not verified
- **Keywords involved:** `pub marketing London`, `pub marketing Surrey`, `pub marketing Berkshire`, `pub marketing Hampshire`, `pub marketing Kent`, `pub marketing Hertfordshire`, `pub marketing Buckinghamshire`, `pub marketing Oxfordshire`, `hospitality marketing Surrey`
- **Pages involved:** `/pub-marketing-london`, `/pub-marketing-surrey`, `/pub-marketing-berkshire`, `/pub-marketing-hampshire`, `/pub-marketing-kent`, `/pub-marketing-hertfordshire`, `/pub-marketing-buckinghamshire`, `/pub-marketing-oxfordshire`
- **Type:** Strategy Question
- **Severity:** High
- **Description:** This plan says every regional term is `0`, but other project docs estimate 10-100/mo for the same cluster and classify it as commercial local intent: [keyword-framework.md](/Users/peterpitcher/Cursor/OJ-OrangeJelly.co.uk/seo-overhaul/phase-1-strategy/keyword-framework.md#L168), [keyword-clusters.md](/Users/peterpitcher/Cursor/OJ-OrangeJelly.co.uk/seo-overhaul/phase-2-discovery/content-strategy/keyword-clusters.md#L376). The more likely problem is page quality and structure, which earlier technical SEO work also flagged for this cluster: [report.md](/Users/peterpitcher/Cursor/OJ-OrangeJelly.co.uk/seo-overhaul/phase-2-discovery/technical-seo/report.md#L34).
- **Recommendation:** Do not delete the regional cluster blindly. Keep pages only where you can add unique local proof, case studies, testimonials, and regional relevance; consolidate weaker counties into an `areas we serve` or South East hub; cross-link the retained location pages and noindex any kept purely for PPC.

The two fixes with the biggest impact are: first, collapse the competing commercial/service URLs into a clean architecture; second, re-score the high-volume list by real SERP intent before prioritising content production.