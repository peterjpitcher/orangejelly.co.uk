# Orange Jelly Keyword Plan v2

Built from Google Keyword Planner data (UK, March 2025 - February 2026).
Updated 2026-04-05 after dual-engine QA review (Claude + Codex GPT-5.4).

## Key Principles (from QA Review)

1. **Commercial intent first** — prioritise keywords where the searcher could become a client
2. **One primary keyword per page** — no cannibalisation between pages
3. **Intent segmentation** — every keyword tagged as Operator (O), Consumer (C), or Mixed (M)
4. **Realistic volume** — "near me" local pack queries removed; no double-counting across SERP-overlapping terms
5. **Complete coverage** — all 71 blog posts and all indexable routes assigned

---

## Intent Buckets

| Bucket | Description | Conversion Potential | Priority Weight |
|--------|-------------|---------------------|-----------------|
| **O — Operator** | Licensee/landlord searching for business help | HIGH — potential client | 3-5x |
| **M — Mixed** | Could be operator or consumer | MEDIUM — some conversion | 2x |
| **C — Consumer** | Pub-goer looking for entertainment/venues | LOW — brand awareness only | 1x |

---

## Master Keyword Map

### Tier 1 — High Volume (5,000-50,000/mo)

| Primary Keyword | Vol/mo | Intent | Competition | Target Page | Status | Notes |
|----------------|--------|--------|-------------|-------------|--------|-------|
| pub lease | 5,000 | O | Low | `/licensees-guide/brewery-tie-improve-your-deal` | EXISTS — needs major expansion | Highest-volume operator keyword. Expand beyond brewery ties to cover full lease/tenancy landscape |
| pub quiz | 50,000 | C | Low | `/licensees-guide/quiz-night-101` | EXISTS — reframe for operators | Reframe with licensee CTAs. Realistic: page 2-3 ranking, long-tail capture |
| pub quiz questions | 50,000 | C | Low | NEW — lightweight listicle | GAP | Brand awareness play, not lead gen. Keep simple, not pillar content |
| music bingo | 5,000 | C | High | `/licensees-guide/music-bingo-101` | EXISTS | Operator angle already strong in 101 format |
| pub games | 5,000 | C | High | `/licensees-guide/boardgame-night-101` | EXISTS — needs major expansion | Expand beyond board games to darts, pool, skittles, card games |
| pub beer garden | 5,000 | C | Low | NEW blog post | GAP | Seasonal (publish by March). Consumer intent but high volume |
| pub sunday roast | 5,000 | C | Low | NEW blog post | GAP | Seasonal (publish by August). Frame for operators: "how to market your sunday roast" |
| quiz night | 5,000 | C | Low | `/licensees-guide/quiz-night-101` | EXISTS — secondary | Captured by quiz-night-101 |
| sunday lunch pub | 5,000 | C | Low | Same page as pub sunday roast | GAP | Combined with pub sunday roast |

**Removed from Tier 1:**
- ~~karaoke near me (50K)~~ — local pack query, unwinnable via content SEO
- ~~pub quiz near me (5K)~~ — local pack query, unwinnable via content SEO
- ~~music bingo near me (500)~~ — local pack query, unwinnable via content SEO

### Tier 2 — Medium Volume (500/mo)

| Primary Keyword | Vol/mo | Intent | Competition | Target Page | Status |
|----------------|--------|--------|-------------|-------------|--------|
| hospitality marketing | 500 | O | Low | `/` (homepage) | EXISTS — rewrite meta & H1 |
| hospitality marketing agency | 500 | O | Medium | `/pub-marketing-agency` | EXISTS — reoptimise |
| hospitality consultant | 500 | O | Medium | `/about` | EXISTS — add keyword targeting |
| how to run a pub | 500 | O | Medium | `/licensees-guide/pub-health-check-essential-fundamentals-licensee-success` | EXISTS — reoptimise |
| running a pub | 500 | O | Medium | Same as above (secondary) | EXISTS |
| buying a pub | 500 | O | Medium | NEW blog post | GAP |
| pub business plan | 500 | O | Medium | NEW blog post + template | GAP |
| pub website | 500 | O | Low | NEW blog post | GAP |
| pub tenancy | 500 | O | Medium | `/licensees-guide/brewery-tie-improve-your-deal` | EXISTS — secondary to pub lease |
| menu engineering | 500 | O | Low | `/licensees-guide/menu-engineering-lift-average-spend` | EXISTS |
| pub event ideas | 500 | M | Low | `/licensees-guide/how-to-run-successful-pub-events` | EXISTS — reoptimise as hub |
| pub food ideas | 500 | M | Low | `/licensees-guide/profitable-pub-food-menu-ideas` | EXISTS |
| pub menu ideas | 500 | M | Low | `/licensees-guide/menu-engineering-lift-average-spend` | EXISTS — secondary |
| pub closing | 500 | M | Low | `/licensees-guide/village-pub-dying-village-survival` | EXISTS |
| pub karaoke | 500 | C | Low | `/licensees-guide/karaoke-night-101` | EXISTS |
| pub quiz ideas | 500 | M | Low | `/licensees-guide/quiz-night-ideas` | EXISTS |
| pub bingo | 500 | C | Low | `/licensees-guide/cash-bingo-101` | EXISTS |
| cash bingo | 500 | C | Medium | `/licensees-guide/cash-bingo-101` | EXISTS — secondary |
| free pub quiz | 500 | C | Low | `/licensees-guide/quiz-night-101` | EXISTS — secondary |
| pub quiz rounds | 500 | C | Low | `/licensees-guide/quiz-night-ideas` | EXISTS |
| pub new years eve | 500 | M | Low | `/licensees-guide/seasonal-pub-events-calendar` | EXISTS |
| pub garden ideas | 500 | M | High | Combine with pub beer garden post | GAP |
| beer garden ideas | 500 | M | High | Combine with pub beer garden post | GAP |
| christmas pub quiz | 500 | C | Low | `/licensees-guide/christmas-pub-promotion-ideas` | EXISTS |
| pub decor ideas | 500 | M | High | `/licensees-guide/low-cost-decor-refreshes-new-improved` | EXISTS |
| pub happy hour | 500 | M | Low | `/licensees-guide/fill-empty-seats-midweek-offers` | EXISTS |
| pub interior design | 500 | M | Low | `/licensees-guide/pub-refurbishment-on-budget` | EXISTS |

### Tier 3 — Low Volume / Long-Tail (50/mo)

| Primary Keyword | Vol/mo | Intent | Target Page | Status |
|----------------|--------|--------|-------------|--------|
| pub marketing | 50 | O | `/pub-marketing` | EXISTS — was incorrectly assigned to homepage |
| pub marketing agency | 50 | O | `/pub-marketing-agency` | EXISTS — secondary |
| pub marketing ideas | 50 | O | `/licensees-guide/low-budget-pub-marketing-ideas` | EXISTS |
| pub marketing strategies | 50 | O | `/licensees-guide/social-media-strategy-for-pubs` | EXISTS |
| pub advertising | 50 | O | `/services/paid-social-for-pubs` | EXISTS |
| pub consultancy | 50 | O | `/about` | EXISTS — secondary to hospitality consultant |
| pub seo | 50 | O | Combine with pub website post | GAP |
| pub entertainment ideas | 50 | M | `/licensees-guide/how-to-run-successful-pub-events` | EXISTS — secondary |
| pub promotion ideas | 50 | M | `/licensees-guide/low-budget-pub-marketing-ideas` | REASSIGNED — original target didn't exist |
| social media for pubs | 50 | O | `/services/social-media-marketing-for-pubs` | EXISTS |
| hospitality social media | 50 | O | `/services/social-media-marketing-for-pubs` | EXISTS — secondary |
| how to run a pub quiz | 50 | O | `/licensees-guide/quiz-night-101` | EXISTS — secondary |
| how to promote a pub | 50 | O | `/licensees-guide/local-pub-marketing` | EXISTS |
| how to increase footfall | 50 | O | `/licensees-guide/fill-empty-pub-tables` | EXISTS |
| how to market a restaurant | 50 | O | `/services` | EXISTS |
| bar marketing ideas | 50 | O | `/licensees-guide/low-budget-pub-marketing-ideas` | EXISTS — secondary |
| bar promotion ideas | 50 | O | `/licensees-guide/low-budget-pub-marketing-ideas` | EXISTS — secondary |
| gastropub menu ideas | 50 | M | `/licensees-guide/profitable-pub-food-menu-ideas` | EXISTS — secondary |
| pub food menu ideas | 50 | M | `/licensees-guide/profitable-pub-food-menu-ideas` | EXISTS — secondary |
| pub management | 50 | O | `/licensees-guide/pub-health-check-essential-fundamentals-licensee-success` | EXISTS — secondary |
| pub profit margins | 50 | O | `/licensees-guide/rescue-your-margins-drinks-mix` | EXISTS |
| pub refurbishment | 50 | M | `/licensees-guide/pub-refurbishment-on-budget` | EXISTS |
| pub theme night ideas | 50 | M | `/licensees-guide/theme-hour-power-hour` | EXISTS |
| struggling pub | 50 | O | `/fix-my-pub` | EXISTS |
| empty pub | 50 | O | `/empty-pub-solutions` | EXISTS |
| rescue my pub | 50 | O | `/pub-rescue` | EXISTS |
| how to start a pub | 50 | O | Combine with buying a pub post | GAP |
| taking over a pub | 50 | O | Combine with buying a pub post | GAP |
| quiz night ideas | 50 | M | `/licensees-guide/quiz-night-ideas` | EXISTS — secondary |
| pub staff training | 50 | O | `/licensees-guide/staff-motivation-hacks-no-pay-rise` | EXISTS |
| pub social media ideas | 50 | O | `/licensees-guide/social-media-tactics-footfall-seven-days` | EXISTS |
| average pub profit uk | 50 | O | `/licensees-guide/revenue-levers-struggling-pubs` | EXISTS |
| how to get more google reviews | 50 | O | `/licensees-guide/terrible-online-reviews-damage-control` | EXISTS |
| pub loyalty scheme | 50 | O | `/licensees-guide/build-loyalty-scheme-fill-pub` | EXISTS |
| pub loyalty card | 50 | O | `/licensees-guide/build-loyalty-scheme-fill-pub` | EXISTS — secondary |
| hospitality marketing ideas | 50 | O | `/licensees-guide/low-budget-pub-marketing-ideas` | EXISTS — secondary |
| hospitality social media marketing | 50 | O | `/services/social-media-marketing-for-pubs` | EXISTS — secondary |
| pub ambience | 50 | M | `/licensees-guide/reboot-pub-atmosphere-on-budget` | EXISTS |
| pub atmosphere | 50 | M | `/licensees-guide/reboot-pub-atmosphere-on-budget` | EXISTS — secondary |
| pub cocktail menu | 50 | M | `/licensees-guide/rescue-your-margins-drinks-mix` | EXISTS — secondary |
| pub stock control | 50 | O | `/licensees-guide/zero-waste-stock-management-pubs` | EXISTS |
| pub waste management | 50 | O | `/licensees-guide/zero-waste-stock-management-pubs` | EXISTS — secondary |
| pub christmas ideas | 50 | M | `/licensees-guide/christmas-pub-promotion-ideas` | EXISTS |
| pub halloween ideas | 50 | M | `/licensees-guide/seasonal-pub-events-calendar` | EXISTS — secondary |
| pub valentines ideas | 50 | M | `/licensees-guide/seasonal-pub-events-calendar` | EXISTS — secondary |
| pubs closing uk | 50 | M | `/licensees-guide/village-pub-dying-village-survival` | EXISTS — secondary |
| brewery tie | 50 | O | `/licensees-guide/brewery-tie-improve-your-deal` | EXISTS — secondary |
| tied pub | 50 | O | `/licensees-guide/brewery-tie-improve-your-deal` | EXISTS — secondary |
| pub lunch ideas | 50 | C | Combine with sunday roast post | GAP |
| pub email marketing | 50 | O | `/licensees-guide/email-marketing-pub-retention` | EXISTS |
| pub tiktok | 50 | O | `/licensees-guide/social-media-strategy-for-pubs` | EXISTS — add section |

---

## Complete Page-Level Keyword Assignments

### Homepage (`/`)
- **Primary:** hospitality marketing (500)
- **Secondary:** hospitality marketing ideas (50)
- **Intent:** O — Establish authority, drive to services/content
- **CTA:** "Talk to us about growing your pub" → contact page

### Pub Marketing Hub (`/pub-marketing`)
- **Primary:** pub marketing (50)
- **Secondary:** pub marketing strategies (50)
- **Intent:** O — Hub page linking to all regional and service pages
- **Note:** This exact-match URL was previously unassigned. It should be the primary target for "pub marketing," not the homepage.

### About (`/about`)
- **Primary:** hospitality consultant (500)
- **Secondary:** pub consultancy (50)
- **Intent:** O — Build trust, credentials

### Services Hub (`/services`)
- **Primary:** pub marketing services (—)
- **Secondary:** pub advertising (50), how to market a restaurant (50)
- **Intent:** O — Convert visitors to enquiries
- **Note:** Cannibalisation resolved — "hospitality marketing agency" moved exclusively to `/pub-marketing-agency`

### Services: Social Media (`/services/social-media-marketing-for-pubs`)
- **Primary:** social media for pubs (50)
- **Secondary:** hospitality social media (50), hospitality social media marketing (50)
- **Intent:** O — Service page conversion

### Services: Instagram (`/services/instagram-services-for-pubs`)
- **Primary:** instagram for pubs (—)
- **Action:** CONSOLIDATE into `/services/social-media-marketing-for-pubs` as a section. Keep URL as redirect for PPC.

### Services: Facebook (`/services/facebook-services-for-pubs`)
- **Primary:** facebook marketing for pubs (—)
- **Action:** CONSOLIDATE into `/services/social-media-marketing-for-pubs` as a section. Keep URL as redirect for PPC.

### Services: Paid Social (`/services/paid-social-for-pubs`)
- **Primary:** pub advertising (50)
- **Secondary:** bar promotion ideas (50)

### Services: Content Creation (`/services/content-creation-for-pubs`)
- **Primary:** pub content creation (—)
- **Note:** Very low volume. Reframe page copy around "hospitality content" and "pub social media content."

### Agency Page (`/pub-marketing-agency`)
- **Primary:** hospitality marketing agency (500)
- **Secondary:** pub marketing agency (50)
- **Intent:** O — Direct service discovery

### Contact (`/contact`)
- **Primary:** — (no keyword target)
- **Intent:** Conversion endpoint. Optimise for usability, not search.

### Results (`/results`)
- **Primary:** — (no keyword target)
- **Intent:** Trust/proof page. Link to from service and problem pages.

### Licensee's Guide Hub (`/licensees-guide`)
- **Primary:** licensee advice (—)
- **Secondary:** pub landlord advice (—)
- **Intent:** O — Content hub. Optimise as a category/listing page with strong internal links.

### Category Archive Pages (`/licensees-guide/category/[category]`)
- **Assignments by category:**
  - `/licensees-guide/category/customer-acquisition` → "how to attract customers to a pub" (—)
  - `/licensees-guide/category/empty-pub-solutions` → "empty pub solutions" (—)
  - `/licensees-guide/category/toolkits` → "pub event guides" (—)
  - `/licensees-guide/category/competition` → "independent pub survival" (—)
  - Other categories: assign topically relevant long-tail keywords
- **Intent:** O — Cluster landing pages. Add unique intro copy per category.

### Problem Pages (Conversion Pages — not SEO targets)
| Page | Primary Keyword | Vol | Role |
|------|----------------|-----|------|
| `/fix-my-pub` | struggling pub | 50 | PPC landing + internal link target |
| `/empty-pub-solutions` | empty pub | 50 | PPC landing + internal link target |
| `/pub-rescue` | rescue my pub | 50 | PPC landing + internal link target |
| `/quiet-midweek-solutions` | quiet pub midweek | — | PPC landing + internal link target |
| `/compete-with-pub-chains` | compete with pub chains | — | PPC landing + internal link target |
| `/pub-marketing-no-budget` | pub marketing ideas | 50 | PPC landing + internal link target |

### Regional Pages (High Conversion Intent — maintain and cross-link)
| Page | Est. Vol | Intent | Action |
|------|----------|--------|--------|
| `/pub-marketing-london` | 50-100 | O | Maintain. Add cross-links to all other regions. Link from `/pub-marketing` hub. |
| `/pub-marketing-surrey` | 10-50 | O | Maintain. Add cross-links. OJ's home territory — strongest local signals. |
| `/pub-marketing-berkshire` | 10-50 | O | Maintain. Add cross-links. |
| `/pub-marketing-hampshire` | 10-50 | O | Maintain. Add cross-links. |
| `/pub-marketing-kent` | 10-50 | O | Maintain. Add cross-links. |
| `/pub-marketing-hertfordshire` | 10-50 | O | Maintain. Add cross-links. |
| `/pub-marketing-oxfordshire` | 10-50 | O | Maintain. Add cross-links. |
| `/pub-marketing-buckinghamshire` | 10-50 | O | Maintain. Add cross-links. |

**Regional verdict (REVISED):** GKP reports 0 (below threshold), but earlier SEO audits estimate 10-100/mo per region. More importantly, these are the highest conversion-intent keywords on the entire site — someone searching "pub marketing Surrey" wants to hire exactly what OJ sells. Do NOT deprecate. Cross-link all regions, link from `/pub-marketing` hub, and ensure Google Business Profile is optimised.

---

## Blog Post Keyword Assignments — ALL 71 Posts

### High-Priority Posts (Operator Intent, 500+ vol)

| Blog Post | Primary Keyword | Vol | Intent | Secondary Keywords |
|-----------|----------------|-----|--------|--------------------|
| brewery-tie-improve-your-deal | pub lease (5K) | 5,000 | O | pub tenancy (500), brewery tie (50), tied pub (50) |
| pub-health-check-essential-fundamentals-licensee-success | how to run a pub (500) | 500 | O | running a pub (500), pub management (50) |
| menu-engineering-lift-average-spend | menu engineering (500) | 500 | O | pub menu ideas (500) |
| profitable-pub-food-menu-ideas | pub food ideas (500) | 500 | M | pub food menu ideas (50), gastropub menu ideas (50) |
| village-pub-dying-village-survival | pub closing (500) | 500 | M | pubs closing uk (50) |
| low-cost-decor-refreshes-new-improved | pub decor ideas (500) | 500 | M | pub ambience (50), pub atmosphere (50) |
| pub-refurbishment-on-budget | pub interior design (500) | 500 | M | pub refurbishment (50) |

### Entertainment/Event Posts (Consumer/Mixed Intent, high volume)

| Blog Post | Primary Keyword | Vol | Intent | Secondary Keywords |
|-----------|----------------|-----|--------|--------------------|
| quiz-night-101 | pub quiz (50K) | 50,000 | C | quiz night (5K), how to run a pub quiz (50), free pub quiz (500) |
| quiz-night-ideas | pub quiz ideas (500) | 500 | M | pub quiz rounds (500), quiz night ideas (50) |
| music-bingo-101 | music bingo (5K) | 5,000 | C | pub bingo (500) |
| cash-bingo-101 | cash bingo (500) | 500 | C | bingo night ideas (50) |
| karaoke-night-101 | pub karaoke (500) | 500 | C | karaoke night ideas (50) |
| boardgame-night-101 | pub games (5K) | 5,000 | C | pub games ideas (50) |
| how-to-run-successful-pub-events | pub event ideas (500) | 500 | M | pub entertainment ideas (50) |
| seasonal-pub-events-calendar | pub new years eve (500) | 500 | M | pub halloween ideas (50), pub valentines ideas (50), pub christmas events (50) |
| christmas-pub-promotion-ideas | christmas pub quiz (500) | 500 | C | pub christmas ideas (50) |
| summer-pub-event-ideas | pub summer events (—) | — | M | — |
| live-music-events-for-pubs | live music pub (—) | — | M | pub live music booking (—) |
| theme-hour-power-hour | pub theme night ideas (50) | 50 | M | — |
| family-craft-hour-101 | pub family activities (—) | — | M | — |
| fizz-street-food-pop-up | pub pop-up event (—) | — | M | — |

### Marketing & Social Media Posts (Operator Intent)

| Blog Post | Primary Keyword | Vol | Intent | Secondary Keywords |
|-----------|----------------|-----|--------|--------------------|
| low-budget-pub-marketing-ideas | pub marketing ideas (50) | 50 | O | bar marketing ideas (50), hospitality marketing ideas (50), pub promotion ideas (50) |
| social-media-strategy-for-pubs | pub marketing strategies (50) | 50 | O | pub social media ideas (50) |
| social-media-tactics-footfall-seven-days | social media pub footfall (—) | — | O | — |
| facebook-marketing-local-pubs | pub facebook page (50) | 50 | O | facebook marketing for pubs (—) |
| instagram-marketing-for-pubs | instagram for pubs (—) | — | O | pub instagram ideas (—) |
| content-marketing-ideas-pubs | pub content ideas (—) | — | O | — |
| local-pub-marketing | how to promote a pub (50) | 50 | O | local pub advertising (—) |
| email-marketing-pub-retention | pub email marketing (50) | 50 | O | — |
| partnering-local-brands-share-marketing | pub partnership marketing (—) | — | O | — |
| community-outreach-reintroduce-pub | pub community engagement (—) | — | O | — |

### Business Operations Posts (Operator Intent)

| Blog Post | Primary Keyword | Vol | Intent | Secondary Keywords |
|-----------|----------------|-----|--------|--------------------|
| revenue-levers-struggling-pubs | average pub profit uk (50) | 50 | O | pub revenue (50) |
| rescue-your-margins-drinks-mix | pub profit margins (50) | 50 | O | pub cocktail menu (50) |
| double-drinks-profit-without-selling-more | pub drinks profit (—) | — | O | — |
| upselling-secrets-training-scripts | pub upselling (—) | — | O | — |
| zero-waste-stock-management-pubs | pub stock control (50) | 50 | O | pub waste management (50) |
| build-loyalty-scheme-fill-pub | pub loyalty scheme (50) | 50 | O | pub loyalty card (50) |
| epos-data-revenue-comeback | pub epos system (—) | — | O | — |
| nobody-books-tables-anymore | pub booking system (—) | — | O | — |
| staff-motivation-hacks-no-pay-rise | pub staff training (50) | 50 | O | — |
| kitchen-nightmares-chef-quits | pub chef recruitment (—) | — | O | — |

### Financial Survival Posts (Operator Intent)

| Blog Post | Primary Keyword | Vol | Intent | Secondary Keywords |
|-----------|----------------|-----|--------|--------------------|
| cash-flow-crisis-breaking-cycle | pub cash flow (—) | — | O | — |
| cashflow-fixes-when-trade-drops | pub cashflow management (—) | — | O | — |
| energy-bill-shock-cut-venue-costs | pub energy costs (—) | — | O | — |
| rent-supplier-negotiations-cash-tight | pub rent negotiation (—) | — | O | — |
| recession-proof-pub-strategies | recession proof pub (—) | — | O | — |
| survive-off-season-revenue-packages | pub off season revenue (—) | — | O | — |
| turn-heating-costs-into-winter-wins | pub heating costs (—) | — | O | — |

### Problem/Turnaround Posts (Operator Intent)

| Blog Post | Primary Keyword | Vol | Intent | Secondary Keywords |
|-----------|----------------|-----|--------|--------------------|
| fill-empty-pub-tables | how to increase footfall (50) | 50 | O | empty pub (50) |
| fill-empty-seats-midweek-offers | midweek pub offers (—) | — | O | pub happy hour (500) |
| pub-empty-tuesday-nights | quiet tuesday pub (—) | — | O | — |
| quiet-monday-night-promotions | quiet monday pub (—) | — | O | — |
| midweek-pub-offers-that-work | midweek pub deals (—) | — | O | — |
| why-is-my-pub-empty | why is my pub empty (—) | — | O | — |
| win-back-locals-after-slow-trade | win back pub customers (—) | — | O | — |
| 30-day-action-plan-stabilise-hospitality | pub turnaround plan (—) | — | O | — |
| turnaround-playbook-independent-bars | bar turnaround (—) | — | O | — |
| restart-quiz-music-sport-roi | pub entertainment roi (—) | — | O | — |
| pub-event-template-profit-nights | pub event profit template (—) | — | O | — |

### Competition Posts (Operator Intent)

| Blog Post | Primary Keyword | Vol | Intent | Secondary Keywords |
|-----------|----------------|-----|--------|--------------------|
| beat-chain-pubs | beat chain pubs (—) | — | O | — |
| compete-with-wetherspoons | compete with wetherspoons (—) | — | O | — |
| pub-differentiation-strategies | pub differentiation (—) | — | O | — |
| premium-pub-positioning | premium pub positioning (—) | — | O | — |
| young-people-wont-come-to-your-pub | attract young people pub (—) | — | O | — |
| how-to-attract-families-to-your-pub | attract families pub (—) | — | O | — |

### Reputation & Reviews Posts (Operator Intent)

| Blog Post | Primary Keyword | Vol | Intent | Secondary Keywords |
|-----------|----------------|-----|--------|--------------------|
| terrible-online-reviews-damage-control | how to get more google reviews (50) | 50 | O | pub tripadvisor (50) |
| crisis-pr-landlords-bad-reviews | pub bad reviews (—) | — | O | — |

### Food & Menu Posts (Mixed Intent)

| Blog Post | Primary Keyword | Vol | Intent | Secondary Keywords |
|-----------|----------------|-----|--------|--------------------|
| food-allergies-gdpr-compliance | pub food allergens (—) | — | O | — |
| delivery-click-collect-without-harm | pub click and collect (—) | — | O | — |

### Atmosphere & Design Posts (Mixed Intent)

| Blog Post | Primary Keyword | Vol | Intent | Secondary Keywords |
|-----------|----------------|-----|--------|--------------------|
| reboot-pub-atmosphere-on-budget | pub atmosphere (50) | 50 | M | pub ambience (50) |
| pub-refurbishment-on-budget | pub interior design (500) | 500 | M | pub refurbishment (50) |
| low-cost-decor-refreshes-new-improved | pub decor ideas (500) | 500 | M | — |

### Seasonal Campaigns Posts (Mixed Intent)

| Blog Post | Primary Keyword | Vol | Intent | Secondary Keywords |
|-----------|----------------|-----|--------|--------------------|
| summer-moments-simple-campaigns | pub summer marketing (—) | — | O | — |
| summer-pub-event-ideas | pub summer events (—) | — | M | — |

---

## Content Gaps — New Pages Needed

### Phase 1: Commercial Content (Months 1-3)

These target operator-intent keywords and have the clearest path to conversion.

1. **"How to Buy a Pub: The Complete UK Guide"** — Target: `buying a pub` (500), `how to start a pub` (50), `taking over a pub` (50)
   - Top-of-funnel for future clients. Covers finances, legals, brewery ties, first 90 days.
   - Lead magnet: downloadable checklist.
   - Cross-links: brewery-tie post, pub business plan, services page.

2. **"Pub Business Plan Template: Free Download & Guide"** — Target: `pub business plan` (500)
   - Lead magnet: downloadable template captures email.
   - Cross-links: buying a pub, revenue-levers, how to run a pub.

3. **"Does Your Pub Need a Website? What Actually Works in 2026"** — Target: `pub website` (500), `pub seo` (50)
   - Directly sells OJ's services. Covers website essentials, local SEO, Google Business Profile.
   - Cross-links: services pages, google reviews post.

### Phase 2: High-Volume Operator Content (Months 3-5)

4. **Expand brewery-tie post → "The Complete Guide to Pub Leases, Tenancies & Brewery Ties"** — Target: `pub lease` (5K), `pub tenancy` (500), `brewery tie` (50)
   - Highest-volume operator keyword. Major expansion needed — not just a reoptimise.
   - Cover: types of agreement, negotiation tactics, rights, exit clauses.

5. **Reframe pub-health-check → "How to Run a Pub: The Licensee's Essential Guide"** — Target: `how to run a pub` (500), `running a pub` (500)
   - Expand to cover all fundamentals. Position as the definitive guide for new licensees.

6. **Reoptimise menu-engineering post** — Target: `menu engineering` (500), `pub menu ideas` (500), `pub food ideas` (500)
   - Add practical menu templates, pricing frameworks, food GP calculator.

### Phase 3: Brand Awareness Content (Months 5-8)

7. **"Pub Quiz Questions: Free Rounds for Your Next Quiz Night"** — Target: `pub quiz questions` (50K)
   - Lightweight listicle format. Free downloadable rounds.
   - Include prominent OJ branding and licensee-focused CTAs.
   - NOT a pillar page — keep effort proportional to conversion potential (near zero).

8. **"Pub Beer Garden Ideas: Make the Most of Your Outdoor Space"** — Target: `pub beer garden` (5K), `beer garden ideas` (500), `pub garden ideas` (500)
   - Publish by March for summer traffic. Frame for operators: layout, events, revenue tips.

9. **"Pub Sunday Roast: How to Market Yours and Fill Tables Every Week"** — Target: `pub sunday roast` (5K), `sunday lunch pub` (5K)
   - Publish by August. Frame for operators: marketing, pricing, social media, quality consistency.

10. **Expand boardgame-night-101 → "Pub Games: The Complete Guide for Licensees"** — Target: `pub games` (5K)
    - Expand beyond board games to darts, pool, skittles, card games, table football.

### Future Opportunities (Validate with Batch 5 GKP data)

- Pub licensing / premises licence guide (est. 1K-5K)
- Food hygiene rating guide (est. 5K-10K)
- Pub insurance guide (est. 1K-5K)
- Pub profit calculator (interactive tool)
- PRS/PPL music licensing guide
- Pub staff wages / recruitment guide
- Sporting events guides (Six Nations, Grand National, Euros)

---

## Implementation Priority (Revised)

Ordered by: conversion potential x realistic ranking x effort required.

### Q1 (Months 1-3): Foundation + Commercial Content

| # | Action | Target Keywords | Vol | Intent | Effort |
|---|--------|----------------|-----|--------|--------|
| 1 | **REOPTIMISE: Homepage → "hospitality marketing"** | hospitality marketing (500) | 500 | O | Small — meta, H1, body copy |
| 2 | **REOPTIMISE: Service pages + consolidation** | hospitality marketing agency (500), hospitality consultant (500) | 1,050 | O | Medium — consolidate IG/FB, rewrite service hub |
| 3 | **REOPTIMISE: brewery-tie → "Pub Lease" guide** | pub lease (5K), pub tenancy (500) | 5,500 | O | Large — major content expansion |
| 4 | **REOPTIMISE: pub-health-check → "How to Run a Pub"** | how to run a pub (500), running a pub (500) | 1,000 | O | Medium — expand and reframe |
| 5 | **NEW: "Buying a Pub" guide** | buying a pub (500), how to start a pub (50) | 600 | O | Medium — new post |
| 6 | **NEW: "Pub Business Plan" + template** | pub business plan (500) | 500 | O | Medium — new post + downloadable |
| 7 | **NEW: "Pub Website" guide** | pub website (500), pub seo (50) | 550 | O | Medium — new post |

### Q2 (Months 4-6): Expand + Measure

| # | Action | Target Keywords | Vol | Intent | Effort |
|---|--------|----------------|-----|--------|--------|
| 8 | **REOPTIMISE: menu-engineering** | menu engineering (500), pub menu ideas (500) | 1,000 | O | Medium |
| 9 | **Complete keyword map for remaining blog posts** | Various long-tail | ~1,500 | O | Small per post — bulk update |
| 10 | **Cross-link regional pages** | pub marketing [county] (10-100 each) | ~400 | O | Small — template update |
| 11 | **NEW: Pub quiz questions (lightweight)** | pub quiz questions (50K) | 50,000 | C | Small — listicle, not pillar |
| 12 | **REOPTIMISE: quiz-night-101 with operator CTAs** | pub quiz (50K), quiz night (5K) | 55,000 | C | Small — add CTAs, reframe intro |

### Q3 (Months 7-9): Seasonal + Brand Awareness

| # | Action | Target Keywords | Vol | Intent | Effort |
|---|--------|----------------|-----|--------|--------|
| 13 | **NEW: Pub beer garden post** (publish March) | pub beer garden (5K) | 6,000 | C | Medium |
| 14 | **NEW: Pub sunday roast post** (publish August) | pub sunday roast (5K) | 10,000 | C | Medium |
| 15 | **REOPTIMISE: boardgame-night → pub games** | pub games (5K) | 5,000 | C | Large — major expansion |

---

## Measurement Framework

### Baselines (Set Before Starting)
- Current organic sessions/month (Google Analytics)
- Current keyword positions (Google Search Console)
- Current monthly enquiries from organic traffic
- Current domain authority (Ahrefs/Moz)

### Quarterly KPIs

| Timeframe | Leading Indicators | Lagging Indicators |
|-----------|-------------------|-------------------|
| 3 months | 5+ commercial keywords in top 20; GSC impressions up 50% | 1-2 organic enquiries/month |
| 6 months | 3+ commercial keywords on page 1; 500+ organic sessions/month | 3-5 organic enquiries/month |
| 12 months | 10+ keywords on page 1; 1,500+ organic sessions/month | 5-10 organic enquiries/month; 2+ clients sourced from organic |

### Review Gates

- **90 days:** If no commercial keywords in top 20 → assess DA, audit technical SEO, begin link building before creating more content
- **180 days:** If organic enquiries haven't increased → consider shifting to Google Ads for commercial keywords; organic becomes brand-awareness only
- **12 months:** Full ROI review — organic investment vs alternative channels

---

## Conversion Funnel Design

Every page needs a defined path to an enquiry:

```
Consumer content (pub quiz, beer garden, games)
  → Contextual CTA: "Running a pub? See how we help licensees grow revenue"
    → Operator content (how to run a pub, menu engineering, pub lease)
      → Service-aware CTA: "Want hands-on help? See our services"
        → Service pages (social media, content creation, marketing)
          → Contact CTA: "Talk to Peter — £75/hr, no retainer"
            → Contact page / booking form
```

### CTA Strategy by Content Type

| Content Type | CTA Approach | Example |
|-------------|-------------|---------|
| Consumer posts (quiz, games, bingo) | Soft contextual sidebar/footer | "Are you the landlord? Here's how we help pubs like yours" |
| Operator informational (how to run a pub, pub lease) | Mid-article + end CTA | "Need help putting this into practice? Book a free 15-min call" |
| Operator commercial (marketing ideas, menu engineering) | Strong service CTA | "We do this for pubs every week. See our services →" |
| Problem pages (fix my pub, empty pub) | Urgent CTA | "Let's fix this. Talk to Peter today →" |
| Service pages | Direct conversion | "£75/hr + VAT. No retainer. Book your first session →" |

---

## Link Building Strategy

### Quick Wins (Month 1-2)
1. Claim/update all pub industry directory listings (BII, BBPA, local business directories)
2. Optimise Google Business Profile with service categories and regular posts
3. Ensure all social profiles link to homepage with consistent NAP

### Ongoing (Month 3+)
4. Pitch guest articles to Morning Advertiser, Pub & Bar Magazine, Propel Info
5. Create a "UK Pub Industry Statistics 2026" page as a linkable asset for journalists
6. Leverage Greene King tenancy network for co-marketing mentions
7. Submit case studies to hospitality industry roundups

---

## Seasonal Content Calendar

| Month | Publish | Keyword Target | Why Now |
|-------|---------|---------------|---------|
| January | Pub Business Plan | pub business plan (500) | New Year = new plans |
| February | Buying a Pub guide | buying a pub (500) | Spring market opens |
| March | Pub Beer Garden post | pub beer garden (5K) | 2-3 months before summer peak |
| April | Pub Website guide | pub website (500) | Evergreen, no seasonal dependency |
| May | Menu Engineering reoptimise | menu engineering (500) | Summer menu planning |
| June | Quiz-night-101 operator reframe | pub quiz (50K) | Quiz season peaks autumn |
| July | Pub Quiz Questions listicle | pub quiz questions (50K) | Pre-autumn quiz season |
| August | Pub Sunday Roast post | pub sunday roast (5K) | 2 months before autumn/winter peak |
| September | Christmas Pub Promotion reoptimise | christmas pub quiz (500) | 2 months before Christmas |
| October | Brewery-tie → Pub Lease expansion | pub lease (5K) | Evergreen, large project |
| November | Pub Games expansion | pub games (5K) | Winter indoor entertainment |
| December | Review + plan next year | — | Measure, adjust, plan |

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| High-volume consumer keywords attract zero clients | Very High | High | Rebalanced: commercial keywords are priorities 1-7 |
| Domain authority too low for 5K+ terms | High | High | Link building plan + focus on long-tail first |
| Resource overload stalls execution | High | Medium | Max 7 priorities per quarter |
| No conversion tracking = flying blind | High | Medium | Set up GSC + analytics before starting |
| Seasonal content published too late | Medium | Medium | Calendar with 2-3 month lead times |
| Competitor response | Low | Medium | Monitor SERPs monthly; niche expertise is defensible |

---

## QA Review Reference

This plan was reviewed by a 4-specialist team (2x Codex GPT-5.4, 2x Claude) on 2026-04-05.
Full reports in `tasks/codex-qa-review/`:
- Spec Compliance Audit (Codex)
- Cannibalisation Audit (Codex)
- Opportunities Report (Claude)
- Strategy Review (Claude)
- Merged QA Report
