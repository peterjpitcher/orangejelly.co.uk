Audited the keyword plan against `page.tsx` routes in `src/app`, the 71 live blog posts in `content/blog` (excluding `README.md`), and indexable dynamic URLs in [sitemap.ts](/Users/peterpitcher/Cursor/OJ-OrangeJelly.co.uk/src/app/sitemap.ts#L15). I excluded non-page `route.ts` endpoints, metadata routes, layouts, and the explicit `noIndex` internal page [test-shadcn/page.tsx](/Users/peterpitcher/Cursor/OJ-OrangeJelly.co.uk/src/app/test-shadcn/page.tsx#L15).

### SPEC-001: Blog assignment coverage is incomplete
- **Spec Reference:** `Blog Post Keyword Assignments (Existing — Top 30 by Opportunity)`
- **Requirement:** Every live blog post should have a keyword assignment in the plan.
- **Status:** Missing
- **Severity:** Critical
- **Description:** The plan only covers 35 of 71 live posts and explicitly stops at “Top 30” in [keyword-plan.md](/Users/peterpitcher/Cursor/OJ-OrangeJelly.co.uk/seo-overhaul/keyword-plan.md#L227). 36 live posts are omitted even though the site has SEO overrides for all 71 in [seo-overrides.ts](/Users/peterpitcher/Cursor/OJ-OrangeJelly.co.uk/src/lib/seo-overrides.ts#L8). Missing slugs: `30-day-action-plan-stabilise-hospitality`, `beat-chain-pubs`, `cash-flow-crisis-breaking-cycle`, `cashflow-fixes-when-trade-drops`, `community-outreach-reintroduce-pub`, `compete-with-wetherspoons`, `content-marketing-ideas-pubs`, `crisis-pr-landlords-bad-reviews`, `delivery-click-collect-without-harm`, `double-drinks-profit-without-selling-more`, `energy-bill-shock-cut-venue-costs`, `epos-data-revenue-comeback`, `family-craft-hour-101`, `fizz-street-food-pop-up`, `food-allergies-gdpr-compliance`, `how-to-attract-families-to-your-pub`, `kitchen-nightmares-chef-quits`, `live-music-events-for-pubs`, `midweek-pub-offers-that-work`, `nobody-books-tables-anymore`, `partnering-local-brands-share-marketing`, `premium-pub-positioning`, `pub-differentiation-strategies`, `pub-empty-tuesday-nights`, `pub-event-template-profit-nights`, `quiet-monday-night-promotions`, `recession-proof-pub-strategies`, `rent-supplier-negotiations-cash-tight`, `restart-quiz-music-sport-roi`, `summer-moments-simple-campaigns`, `survive-off-season-revenue-packages`, `turn-heating-costs-into-winter-wins`, `turnaround-playbook-independent-bars`, `upselling-secrets-training-scripts`, `win-back-locals-after-slow-trade`, `young-people-wont-come-to-your-pub`.
- **Impact:** Over half of the live blog inventory has no declared primary keyword, so the plan cannot reliably govern coverage, internal linking, or cannibalisation.

### SPEC-002: Indexable page coverage is incomplete
- **Spec Reference:** `Page-Level Keyword Assignments`
- **Requirement:** Every indexable page route should have a keyword assignment or an explicit exclusion.
- **Status:** Missing
- **Severity:** High
- **Description:** The plan omits `/pub-marketing`, `/licensees-guide`, `/results`, `/contact`, and all 12 `/licensees-guide/category/[category]` archives even though these routes are indexable in [sitemap.ts](/Users/peterpitcher/Cursor/OJ-OrangeJelly.co.uk/src/app/sitemap.ts#L15). `/pub-marketing` is the clearest miss: it already exists as an exact-match guide page in [pub-marketing/page.tsx](/Users/peterpitcher/Cursor/OJ-OrangeJelly.co.uk/src/app/pub-marketing/page.tsx#L17), but the plan never assigns it a keyword.
- **Impact:** Live SEO pages are unmanaged, and the strongest exact-match route for a core topic is absent from the plan.

### SPEC-003: One mapped target page does not exist
- **Spec Reference:** `Master Keyword Map — Tier 3`
- **Requirement:** Any keyword mapped to an existing target must point to a real page.
- **Status:** Deviated
- **Severity:** High
- **Description:** `pub promotion ideas` is mapped to `/licensees-guide/pub-promotion-ideas` in [keyword-plan.md](/Users/peterpitcher/Cursor/OJ-OrangeJelly.co.uk/seo-overhaul/keyword-plan.md#L75), but there is no matching route or blog slug. The only related live page is `/licensees-guide/christmas-pub-promotion-ideas` in [seo-overrides.ts](/Users/peterpitcher/Cursor/OJ-OrangeJelly.co.uk/src/lib/seo-overrides.ts#L95).
- **Impact:** The plan contains a dead destination and hides a real gap that needs either a new page or an intentional redirect decision.

### SPEC-004: Several high-volume mappings do not match search intent
- **Spec Reference:** `Master Keyword Map — Tier 1`, `Master Keyword Map — Tier 2`, `Blog Post Keyword Assignments`
- **Requirement:** Keyword-to-page mappings should match the content’s likely search intent.
- **Status:** Deviated
- **Severity:** High
- **Description:** Inference from query phrasing plus page copy: `karaoke near me`, `pub quiz near me`, and `music bingo near me` are local/discovery queries, but the plan maps them to operator how-to guides in [keyword-plan.md](/Users/peterpitcher/Cursor/OJ-OrangeJelly.co.uk/seo-overhaul/keyword-plan.md#L17), [keyword-plan.md](/Users/peterpitcher/Cursor/OJ-OrangeJelly.co.uk/seo-overhaul/keyword-plan.md#L25), and [keyword-plan.md](/Users/peterpitcher/Cursor/OJ-OrangeJelly.co.uk/seo-overhaul/keyword-plan.md#L53). The actual pages are clearly “Licensee Guide” toolkits in [karaoke-night-101.md](/Users/peterpitcher/Cursor/OJ-OrangeJelly.co.uk/content/blog/karaoke-night-101.md#L2), [quiz-night-101.md](/Users/peterpitcher/Cursor/OJ-OrangeJelly.co.uk/content/blog/quiz-night-101.md#L2), and [music-bingo-101.md](/Users/peterpitcher/Cursor/OJ-OrangeJelly.co.uk/content/blog/music-bingo-101.md#L2).
- **Impact:** The plan’s biggest volume opportunities are overstated because the current page type is unlikely to satisfy the dominant SERP intent.

### SPEC-005: Primary keyword ownership is inconsistent and some “EXISTS” labels overstate fit
- **Spec Reference:** `Page-Level Keyword Assignments`, `Master Keyword Map — Tier 1`, `Master Keyword Map — Tier 3`, `Strategic Recommendations`
- **Requirement:** One primary keyword should have one best-fit page, and `EXISTS` should mean the current page is already a credible fit.
- **Status:** Partial
- **Severity:** Medium
- **Description:** `hospitality marketing agency` is assigned to both `/services` and `/pub-marketing-agency` in [keyword-plan.md](/Users/peterpitcher/Cursor/OJ-OrangeJelly.co.uk/seo-overhaul/keyword-plan.md#L168) and [keyword-plan.md](/Users/peterpitcher/Cursor/OJ-OrangeJelly.co.uk/seo-overhaul/keyword-plan.md#L196). The plan also gives `pub marketing` to the homepage in [keyword-plan.md](/Users/peterpitcher/Cursor/OJ-OrangeJelly.co.uk/seo-overhaul/keyword-plan.md#L68) even though `/pub-marketing` is the exact-match guide [pub-marketing/page.tsx](/Users/peterpitcher/Cursor/OJ-OrangeJelly.co.uk/src/app/pub-marketing/page.tsx#L17). Separately, `boardgame-night-101` is narrower than `pub games` [boardgame-night-101.md](/Users/peterpitcher/Cursor/OJ-OrangeJelly.co.uk/content/blog/boardgame-night-101.md#L2), and `brewery-tie-improve-your-deal` is narrower than `pub lease` [brewery-tie-improve-your-deal.md](/Users/peterpitcher/Cursor/OJ-OrangeJelly.co.uk/content/blog/brewery-tie-improve-your-deal.md#L2), so the current `EXISTS` labels are optimistic.
- **Impact:** The plan risks cannibalisation between service pages and overstates how ready some current URLs are to rank for their assigned terms.

**Requirements Coverage Matrix**

| Route | Compliance | Note |
|---|---|---|
| `/` | Partial | Assigned, but `pub marketing` is better suited to `/pub-marketing` |
| `/about` | Compliant | Assigned |
| `/compete-with-pub-chains` | Compliant | Assigned |
| `/contact` | Missing | No keyword assignment |
| `/empty-pub-solutions` | Compliant | Assigned |
| `/fix-my-pub` | Compliant | Assigned |
| `/licensees-guide/[slug]` | Partial | 35/71 child blog routes assigned |
| `/licensees-guide/category/[category]` | Missing | 0/12 category archive routes assigned |
| `/licensees-guide` | Missing | No keyword assignment |
| `/pub-marketing-agency` | Partial | Assigned, but overlaps `/services` |
| `/pub-marketing-berkshire` | Compliant | Covered in regional section |
| `/pub-marketing-buckinghamshire` | Compliant | Covered in regional section |
| `/pub-marketing-hampshire` | Compliant | Covered in regional section |
| `/pub-marketing-hertfordshire` | Compliant | Covered in regional section |
| `/pub-marketing-kent` | Compliant | Covered in regional section |
| `/pub-marketing-london` | Compliant | Covered in regional section |
| `/pub-marketing-no-budget` | Compliant | Assigned |
| `/pub-marketing-oxfordshire` | Compliant | Covered in regional section |
| `/pub-marketing-surrey` | Compliant | Covered in regional section |
| `/pub-marketing` | Missing | Exact-match guide omitted |
| `/pub-rescue` | Compliant | Assigned |
| `/quiet-midweek-solutions` | Compliant | Assigned |
| `/results` | Missing | No keyword assignment |
| `/services/content-creation-for-pubs` | Compliant | Assigned |
| `/services/facebook-services-for-pubs` | Compliant | Assigned |
| `/services/instagram-services-for-pubs` | Compliant | Assigned |
| `/services` | Partial | Assigned, but overlaps `/pub-marketing-agency` |
| `/services/paid-social-for-pubs` | Compliant | Assigned |
| `/services/social-media-marketing-for-pubs` | Compliant | Assigned |
| `/test-shadcn` | Excluded | Internal `noIndex` page |

Non-page routes excluded from coverage: `/about-demo`, `/api/preview`, `/api/preview/exit`, plus metadata routes such as `sitemap`, `robots`, icons, and Open Graph image endpoints.