# Page Worklist — Orange Jelly (2026-05-21)

**Purpose:** the complete, prioritised list of pages to work through. Feed each page (in priority order) into `/keyword-plan` to produce its keyword plan, then optimise.

**Source data:** fresh GSC export (3-month + 16-month, pulled 2026-05-21). Full evidence in:
`phase-2-discovery/analytics/gsc-baseline-2026-05.md`, `gsc-queries-2026-05.md`,
`phase-2-discovery/content-strategy/page-action-table-2026-05.md`,
`phase-2-discovery/technical-seo/report-2026-05.md`.

**Baseline to beat:** 16-month = 403 clicks / 36,241 impressions / **1.11% CTR**. The dominant, fixable problem is CTR — pages rank (often pos 5–12) but earn almost no clicks.

---

## ⚠️ Resolve these BEFORE keyword planning the affected pages

These are structural decisions that change which page owns which keyword. Settle them first so `/keyword-plan` targets the right URL.

| # | Decision | Why it matters | Recommendation | Approval (routing/index change) |
|---|---|---|---|---|
| D1 | The 5 `/services/*` pages 308-redirect to `/capabilities` (set in `next.config.js`) yet still rank pos 2–6.5 for high-intent buyer queries ("instagram services for pubs" pos 6.5, "facebook services for pubs" pos 5.8). Every earned click redirects to a generic page → 0 clicks, and these rankings will decay. | This is the biggest **commercial** opportunity on the site — real buyer demand, already ranking, currently wasted. | **Reinstate the 5 dedicated service pages** (remove the redirects), each query-matched, then optimise. Keep `/capabilities` as a supporting overview. | **Yes — routing change** |
| D2 | Cannibalisation: multiple pages compete for one intent (see "Merges" below). | `/keyword-plan` should target the surviving page, not the ones being merged away. | Approve the merge map below; 301 the losers into the winners. | **Yes — 301 redirects** |
| D3 | 8 location pages (`/pub-marketing-[county]`) share near-duplicate templated copy; 6 have zero visibility. | Thin/duplicate local pages risk being treated as doorway pages. | Write unique local content for **London + Surrey first** (home turf + demand); noindex the rest until populated. | **Yes — noindex** |

---

## TIER 1 — Do first (P1): highest impressions × striking distance × commercial value

Work these first. Each is either a big impression pool stuck just off page 1, or a buyer-intent page with wasted rankings.

### 1a. Commercial pages (revenue intent)
| # | Page | Primary target keyword (GSC demand) | Current | Action |
|---|---|---|---|---|
| 1 | `/pub-marketing` | **pub marketing** (533 impr, pos 22.8); marketing agency for pubs (161) | pos 22.8 | Reframe from "complete guide" to the **commercial pillar**; rewrite title+meta; pull internal links from top blog posts |
| 2 | `/pub-marketing-agency` | **pub marketing agency** (303 impr, pos 19.4) | no visibility | Front-load "Pub Marketing Agency" in title; make this the single owner of agency intent |
| 3 | `/pub-rescue` | **pub rescue** (18), pub business recovery; 429 impr | pos 18.0 | Title omits "pub rescue" — front-load it; biggest-impression commercial page |
| 4–8 | `/services/{instagram,facebook,paid-social,content-creation,social-media-marketing}-for-pubs` | instagram services for pubs (236), facebook services for pubs (103), paid social for pubs (186), content creation for pubs (211), social media marketing for pubs (324) | pos 2–6.5 but **redirected** | **Pending D1.** If reinstated: query-matched title + benefit/proof/CTA meta. Highest-CTR-leverage set on the site |

### 1b. Informational pages — big impression pools at pos 7–17 (CTR rescue + push)
| # | Page | Primary target keyword (GSC demand) | Current | Action |
|---|---|---|---|---|
| 9 | `summer-pub-event-ideas` | **event ideas for pubs** (814), pub event ideas (547) | 6,427 impr, pos 14.7 | Biggest pool on the site. Broaden to a year-round **events pillar** (or spin a `/pub-event-ideas` pillar); front-load "Pub Event Ideas" |
| 10 | `profitable-pub-food-menu-ideas` | profitable menu items (201), pub menu ideas (117), most profitable bar food (82) | 4,137 impr, pos 7.2 | Menu pillar; add exact phrases; benefit-led meta |
| 11 | `social-media-strategy-for-pubs` | social media for pubs, pub social media | 3,601 impr, pos 12.8 | Biggest CTR-gap page by volume (0.97%). Meta rewrite; funnel link → `/services/social-media-marketing-for-pubs` |
| 12 | `quiz-night-ideas` | **quiz night ideas** (135), pub quiz ideas (47) | 3,000 impr, pos 12.7 | Quiz pillar; absorb `quiz-night-101` (see merges) |
| 13 | `pub-refurbishment-on-budget` | pub refurbishment (98), bar refurbishment (126) | 1,712 impr, pos 14.1 | Question title buries the keyword — front-load "Pub Refurbishment on a Budget"; refurb pillar |
| 14 | `content-marketing-ideas-pubs` | content creation for pubs (211), pub content, pub story ideas (37) | 1,688 impr, pos 16.4 | Front-load "Pub Content Ideas"; link → `/services/content-creation-for-pubs` |
| 15 | `pub-health-check-…-licensee-success` | how to run a pub | 701 impr, pos 7.0, **0.43% CTR** | Strong position, near-zero clicks — meta is the failure; rewrite with hook + CTA |
| 16 | `buying-a-pub-complete-guide` | buying a pub, how to buy a pub | 262 impr, pos 5.4, **0% CTR** | Flagship CTR failure. Title is fine — rewrite the **meta description** (missing/unappealing) |
| 17 | `quiz-night-101` | how to run a pub quiz (22), quiz night format (82) | 789 impr, pos 7.1 | **Merge → `quiz-night-ideas`** OR retarget tightly to "how to run a pub quiz" |

### 1c. Major content gaps (rebuild from weak pages — strong demand, no good page)
| # | Page | Primary target keyword (GSC demand) | Current | Action |
|---|---|---|---|---|
| 18 | `fizz-street-food-pop-up` → rebuild | **pop up events for pubs** (403, pos 37), street food pub | 9 impr, pos 4.2 | Rebuild as the **pop-up events pillar**; front-load the exact phrase |
| 19 | `family-craft-hour-101` → rebuild | **kids craft pop up events for pubs** (292), family activities to increase pub footfall (172), how to attract families to pubs (90) | 7 impr | Rebuild as **family-events pillar**; consolidate `how-to-attract-families-to-your-pub` (zero-vis) into it |

### 1d. Technical clean-up (P1 — do alongside)
| # | Item | Action | Approval |
|---|---|---|---|
| 20 | `/test-shadcn` live & public | Delete the route (dev test page) | — |
| 21 | `/images/logo.png` 404 in schema | Fix path → `/logo.png` in `PubMarketingLocationLandingPage.tsx:53` and `blog/EnhancedBlogSchema.tsx:48` | — |

---

## TIER 2 — Next (P2): striking distance, cluster consolidation, commercial support

**Commercial / landing:** `/services` (hub), `/empty-pub-solutions`, `/quiet-midweek-solutions`, `/compete-with-pub-chains`, `/ways-to-work`, `/pub-marketing-berkshire`, `/pub-marketing-kent`.

**Informational — pos 4–12, meta rewrite for CTR (0% click at strong positions):**
`cellar-management-beer-quality-guide` (6.5), `double-drinks-profit-without-selling-more` (6.3), `pub-health-safety-checklist` (6.4), `quiet-monday-night-promotions` (6.0), `turnaround-playbook-independent-bars` (5.2), `menu-engineering-lift-average-spend` (4.4), `partnering-local-brands-share-marketing` (pub co branding 115; pos 17), `recession-proof-pub-strategies`, `build-loyalty-scheme-fill-pub` (pub loyalty scheme 39), `christmas-pub-promotion-ideas` (christmas pub ideas 180), `midweek-pub-offers-that-work`, `compete-with-wetherspoons`, `instagram-marketing-for-pubs` (blog), `facebook-marketing-local-pubs` (blog), `summer-moments-simple-campaigns`, `live-music-events-for-pubs`, `seasonal-pub-events-calendar`, `/licensees-guide` (hub).

**Zero-visibility blog to activate (real demand, get indexed + linked):** `pub-marketing-plan-2026-monthly-guide`, `google-business-profile-pub-guide`, `how-much-profit-does-a-pub-make`, `pub-business-plan-template-guide`, `pub-licensing-premises-personal-licence-guide`.

---

## TIER 3 — Later (P3): low impressions / evergreen / cluster members

Meta polish + internal linking only; cluster under the relevant pillar. Includes: `premium-pub-positioning`, `food-allergies-gdpr-compliance`, `why-is-my-pub-empty`, `village-pub-dying-village-survival`, `pub-empty-tuesday-nights`, `pub-event-template-profit-nights`, `revenue-levers`, `pub-differentiation-strategies`, all `*-101` event posts (fold into events clusters), the cost/finance cluster (`energy-bill-shock`, `cashflow-fixes`, `rent-supplier-negotiations`, `pub-vat-accounting`, `pub-wages-labour-costs`), staffing cluster, the compliance evergreens (`food-hygiene-rating`, `prs-ppl-music-licensing`, `pub-insurance-cover`, `pub-accessibility`), seasonal posts (`pub-halloween-bonfire-night`, `pub-new-years-eve`, `pub-six-nations-rugby`), `/about`, `/contact`, `/results`, `/`, `/capabilities`, `/ways-to-work/[slug]` package pages, `/pub-marketing-no-budget`, remaining location pages.

---

## Cannibalisation — merge map (settle before keyword planning these clusters)

| Keep (winner) | Merge / 301 in | Cluster |
|---|---|---|
| `quiz-night-ideas` | `quiz-night-101` | Quiz |
| `compete-with-wetherspoons` | `beat-chain-pubs` | Competition |
| `/pub-marketing` (commercial) | `local-pub-marketing` (blog, pos 55) | Pub marketing |
| `/empty-pub-solutions` (commercial) | `fill-empty-pub-tables`, `fill-empty-seats-midweek-offers` | Empty pub |
| one reviews guide | `terrible-online-reviews-damage-control` + `how-to-respond-bad-pub-reviews` + `crisis-pr-landlords-bad-reviews` | Reputation |
| events pillar | the `*-101` posts (cash-bingo, karaoke, boardgame, music-bingo, theme-hour) as cluster children | Events |
| `epos-data-revenue-comeback` | `pub-epos-system-guide` | EPOS |
| `christmas-pub-promotion-ideas` | `pub-christmas-bookings-fill-december` | Christmas |

---

## Keyword clusters (target-page map for `/keyword-plan`)

| Cluster | Best target page | Lead keyword (GSC) |
|---|---|---|
| Pub Events (year-round) | `summer-pub-event-ideas` → events pillar | event ideas for pubs (814) |
| Pop-up / Family Events | rebuild `fizz-street-food-pop-up` + `family-craft-hour-101` | pop up events for pubs (403); kids craft pop up events (292) |
| Quiz Nights | `quiz-night-ideas` | quiz night ideas (135) |
| Menu / Food Profitability | `profitable-pub-food-menu-ideas` | profitable menu items (201) |
| Social Media (done-for-you) | `/services/*` (pending D1) | instagram/facebook/paid social/content creation for pubs |
| Social Media (how-to) | `social-media-strategy-for-pubs`, `content-marketing-ideas-pubs` | social media for pubs |
| Pub Marketing (commercial) | `/pub-marketing` + `/pub-marketing-agency` | pub marketing (533); pub marketing agency (303) |
| Pub Rescue / Empty / Midweek | `/pub-rescue`, `/fix-my-pub`, `/empty-pub-solutions`, `/quiet-midweek-solutions` | fix my pub (82); empty pub (17) |
| Refurbishment | `pub-refurbishment-on-budget` | pub refurbishment (98) |
| Competition | `compete-with-wetherspoons` → `/compete-with-pub-chains` | compete with wetherspoons |
| Buying / Running a Pub | `buying-a-pub-complete-guide`, `pub-health-check…` | buying a pub; how to run a pub |
| Brand Partnerships | `partnering-local-brands-share-marketing` | pub co branding (115) |
| Cost / Finance | cost cluster pages | pub energy bills, cashflow |
| Local (county) | `/pub-marketing-[county]` (pending D3) | pub marketing [county] |
