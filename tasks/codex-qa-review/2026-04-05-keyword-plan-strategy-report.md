# SEO Keyword Plan Strategy Review

**Project:** Orange Jelly (orangejelly.co.uk)
**Reviewed:** 2026-04-05
**Reviewer:** Senior SEO Strategist (AI)
**Document Under Review:** `seo-overhaul/keyword-plan.md`

---

## Executive Summary

The keyword plan identifies genuine search volume opportunities but suffers from a fundamental strategic flaw: it prioritises raw traffic volume over business-relevant intent. The plan's top three priorities (pub quiz questions, pub quiz, pub games) target people who want to *play* pub games, not people who want to *hire a pub marketing consultant*. This is the equivalent of a law firm optimising for "how to write a will yourself" -- it drives visits but not revenue.

The plan claims 146K addressable monthly searches, but a realistic conversion-weighted analysis suggests fewer than 5,000 of those searches come from potential clients. The plan needs to be rebalanced around commercial intent, with high-volume informational content playing a supporting role rather than leading the strategy.

---

## Detailed Findings

### STRAT-001: Top priority keyword has near-zero conversion potential
- **Area:** Prioritisation
- **Severity:** Critical
- **Finding:** "Pub quiz questions" (50K/mo) is ranked as Priority #1. The searcher intent is overwhelmingly a pub-goer or quiz host looking for free questions to use. They are not a licensee looking to hire a marketing consultant. Even if the post ranks #1 and captures 5% CTR (2,500 visits/month), the conversion path from "I need quiz questions" to "I need to pay someone £75/hr for pub marketing" is essentially non-existent. The plan itself acknowledges this post "could drive more traffic than the rest of the blog combined" -- but traffic is not revenue.
- **Recommendation:** Demote to Tier 2/3 as a brand awareness and topical authority play. Proceed with it, but do not invest disproportionate effort. Do not measure success by this keyword's traffic. Create a simpler version (a listicle with downloadable rounds) rather than a comprehensive pillar page.

### STRAT-002: Plan systematically conflates pub-goer intent with licensee intent
- **Area:** Business Fit
- **Severity:** Critical
- **Finding:** The following high-volume keywords all target pub customers, not pub operators: "pub quiz" (50K), "pub quiz questions" (50K), "karaoke near me" (50K), "pub beer garden" (5K), "pub sunday roast" (5K), "pub games" (5K), "pub quiz near me" (5K), "sunday lunch pub" (5K). That is 175K out of the 146K claimed addressable volume (with double-counting). A person searching "pub sunday roast" is looking for where to eat, not how to market their pub's roast. The plan is building a consumer discovery site, not a B2B consultancy site.
- **Recommendation:** Segment every keyword into one of three buckets: (A) Licensee/operator intent -- these are clients, (B) Consumer intent -- these build brand but do not convert, (C) Mixed/ambiguous. Weight all prioritisation decisions by bucket. Bucket A keywords should receive 3-5x the priority weighting of Bucket B keywords regardless of volume.

### STRAT-003: Genuine commercial-intent keywords are buried at Priority 8-12
- **Area:** Prioritisation
- **Severity:** Critical
- **Finding:** The keywords most likely to attract paying clients are: "hospitality marketing" (500), "hospitality marketing agency" (500), "hospitality consultant" (500), "how to run a pub" (500), "buying a pub" (500), "pub business plan" (500). These are people actively seeking professional help or starting a business -- the exact audience Orange Jelly serves. Yet these are ranked at priorities 8-12, behind consumer entertainment keywords with zero conversion potential.
- **Recommendation:** Elevate all commercial-intent keywords to the top 5 priorities. A single conversion from "hospitality marketing agency" (one client at £75/hr x 20hrs = £1,500) is worth more than 100,000 visits from "pub quiz questions."

### STRAT-004: "Near me" keywords cannot be won by a content site
- **Area:** Competition
- **Severity:** High
- **Finding:** "Karaoke near me" (50K) and "pub quiz near me" (5K) are local pack queries. Google serves these with Maps results showing actual pubs near the searcher. A consultancy blog post cannot rank in the local pack for these queries. The plan suggests "add local schema" but this misunderstands the SERP format -- local pack results are driven by Google Business Profile proximity, not on-page schema on a consultancy site.
- **Recommendation:** Remove "near me" variants from the keyword plan entirely. They are not winnable through content SEO for this type of site.

### STRAT-005: Volume claims are inflated by keyword cannibalisation
- **Area:** Measurement
- **Severity:** High
- **Finding:** The plan adds "pub quiz" (50K) + "pub quiz questions" (50K) + "quiz night" (5K) + "pub quiz near me" (5K) = 110K as if they are additive. In practice, these keywords share significant SERP overlap. A single well-ranked page might capture clicks from multiple variants, but the total addressable traffic is far less than the sum. The "146K+ searches/month" headline figure is misleading and could set unrealistic expectations.
- **Recommendation:** De-duplicate the volume claims. Group keywords by SERP overlap (check if the same URLs rank for multiple keywords) and use the highest single keyword volume as the group estimate, not the sum.

### STRAT-006: No domain authority reality check
- **Area:** Competition
- **Severity:** High
- **Finding:** The plan marks several 50K and 5K keywords as "Low competition" based on Google Keyword Planner data. GKP competition scores reflect paid advertising competition, not organic ranking difficulty. A small consultancy site with limited backlinks and domain authority is unlikely to rank on page 1 for "pub quiz" (50K) against established quiz platforms, Wikipedia, and major media sites. The plan contains no assessment of current domain authority, backlink profile, or competitor analysis for top SERP positions.
- **Recommendation:** Conduct a proper organic difficulty assessment using Ahrefs, Semrush, or Moz. For each target keyword, check the DR/DA of current page 1 results. If the top 10 results are all DR 50+ sites, a DR 15-25 consultancy site will not rank without significant link building investment. Adjust priorities based on realistic ranking potential.

### STRAT-007: Plan lacks a content-to-conversion funnel
- **Area:** Business Fit
- **Severity:** High
- **Finding:** The plan identifies pages to create and keywords to target, but does not map how traffic becomes revenue. There is no mention of: lead capture mechanisms (email gates, consultation booking forms), CTAs within content, retargeting strategy, or conversion tracking. A pub quiz questions post without a clear path to "and here is how Orange Jelly can help your pub" is a dead end.
- **Recommendation:** Design a conversion funnel for each content tier. Informational content (quiz questions, beer garden ideas) should contain contextual CTAs to operator-focused content. Operator-focused content should drive to service pages and contact forms. Every new page should have a defined conversion action and tracking.

### STRAT-008: Resource allocation is unrealistic for a 2-person team
- **Area:** Resources
- **Severity:** High
- **Finding:** The plan lists 15 priorities including 6 new pages and 9 major reoptimisations. The blog creation guide specifies 1,500-3,000 words per post with custom SVG images, downloadable resources, comprehensive FAQ sections, and schema markup. Creating one post to this standard takes 8-15 hours. The full plan represents 120-225 hours of content work alone, before accounting for keyword research validation, technical SEO, link building, or actual client work. For a 2-person team where content creation is not the primary revenue activity, this is 3-6 months of work.
- **Recommendation:** Cut to 5-7 priorities maximum for the first quarter. Focus the first 90 days exclusively on commercial-intent content that can generate leads. Informational content can be added in Q2-Q3 once the revenue-generating pages are performing.

### STRAT-009: No measurement framework or success criteria
- **Area:** Measurement
- **Severity:** Medium
- **Finding:** The plan has no KPIs, no timeline, no milestones, and no definition of success. "Total addressable volume" is not a KPI -- it is a theoretical ceiling. There is no baseline measurement of current organic traffic, current keyword rankings, or current conversion rates. Without these, there is no way to measure whether the plan is working.
- **Recommendation:** Define baseline metrics now (current organic sessions, current keyword positions, current enquiry volume from organic). Set quarterly targets: Q1 = commercial pages live + indexed, Q2 = page 1 rankings for 3+ commercial keywords, Q3 = measurable increase in organic enquiries. Track leading indicators (impressions in Google Search Console) weekly and lagging indicators (conversions) monthly.

### STRAT-010: Seasonal keywords lack timing guidance
- **Area:** Resources
- **Severity:** Medium
- **Finding:** "Pub beer garden" peaks in spring/summer. "Christmas pub quiz" peaks in November/December. "Pub sunday roast" peaks in autumn/winter. The plan lists these without publication timing. Content needs to be indexed and gaining authority 2-3 months before its seasonal peak to capture the traffic spike.
- **Recommendation:** Add a content calendar with publication dates aligned to seasonal search patterns. Beer garden content should be published by March. Christmas content by September. Sunday roast content by August.

### STRAT-011: Service page consolidation is correct but under-emphasised
- **Area:** Prioritisation
- **Severity:** Medium
- **Finding:** The plan correctly identifies that Instagram (0/mo) and Facebook (0/mo) service pages have no search volume and should be consolidated. This is good analysis but it is buried as recommendation #3. Service pages are the closest-to-revenue pages on the site. Optimising the services hub for "hospitality marketing agency" (500/mo) and ensuring it converts well should be a top-3 priority.
- **Recommendation:** Make service page consolidation and optimisation Priority #2, immediately after the homepage reoptimisation. These pages serve users with the highest commercial intent.

### STRAT-012: Problem pages and regional pages correctly assessed
- **Area:** Business Fit
- **Severity:** Low
- **Finding:** The plan correctly identifies that problem pages (/fix-my-pub, /empty-pub-solutions, /pub-rescue) and regional pages have near-zero search volume and should be treated as conversion/PPC pages rather than SEO targets. This is sound analysis.
- **Recommendation:** No change needed. This assessment is correct. Ensure these pages are well-linked from organic content as conversion destinations.

### STRAT-013: "Pub lease" keyword is a genuine hybrid opportunity
- **Area:** Prioritisation
- **Severity:** Low
- **Finding:** "Pub lease" (5K/mo) is one of the few high-volume keywords where the searcher might actually be a current or prospective licensee -- someone who could become a client. A person researching pub leases is either taking on a pub (future client) or renegotiating their current lease (current licensee). The plan correctly identifies this as a reoptimisation opportunity but ranks it at Priority #4.
- **Recommendation:** Elevate to Priority #3. This is the highest-volume keyword with genuine licensee intent.

### STRAT-014: Missing long-tail programmatic opportunity
- **Area:** Business Fit
- **Severity:** Medium
- **Finding:** The plan focuses on individual keyword targeting but misses a programmatic long-tail opportunity. Queries like "how to increase pub turnover," "pub wet sales declining," "how to attract younger customers to pub," and "pub footfall after COVID" are low-volume individually but collectively represent a significant pool of licensees actively seeking help. These are high-intent, low-competition, and perfectly aligned with Orange Jelly's expertise.
- **Recommendation:** Add a "long-tail licensee problems" content cluster. Mine Google Search Console for existing impressions on these terms. Create 500-800 word focused posts answering specific licensee questions. These are faster to produce, more likely to rank, and more likely to convert than the high-volume consumer keywords.

### STRAT-015: No link building strategy
- **Area:** Competition
- **Severity:** Medium
- **Finding:** Ranking for any keyword above 500/mo volume requires backlinks. The plan contains no link building strategy, no mention of outreach, no digital PR approach, and no assessment of current backlink profile. Without links, even well-optimised content will plateau at page 2-3 for competitive terms.
- **Recommendation:** Develop a basic link building plan. Realistic approaches for a pub consultancy: (1) Get listed in pub industry directories and BII resources, (2) Contribute guest articles to pub trade publications (Morning Advertiser, Pub & Bar magazine), (3) Create linkable assets like a "UK Pub Industry Statistics" page that journalists reference, (4) Leverage the Greene King tenancy for potential co-marketing.

### STRAT-016: Plan B is absent
- **Area:** Risk
- **Severity:** Medium
- **Finding:** The plan assumes that creating content for high-volume keywords will result in rankings and traffic. There is no contingency for: (a) content not ranking due to domain authority gap, (b) traffic arriving but not converting, (c) Google algorithm changes devaluing informational content, (d) competitor response. A small business investing significant time in content creation needs to know when to pivot.
- **Recommendation:** Define review gates. At 90 days: if no page 1 rankings for commercial keywords, reassess technical SEO and link building before creating more content. At 180 days: if organic enquiries have not increased, consider shifting budget to paid search for commercial keywords and using organic purely for brand awareness. At 12 months: full ROI review comparing organic investment against alternative channels (Google Ads, pub trade show presence, direct outreach).

---

## Risk Summary

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| High-volume keywords attract zero clients | Very High | High | Rebalance toward commercial intent |
| Domain authority too low to rank for 5K+ terms | High | High | Link building + focus on long-tail first |
| Resource overload stalls execution | High | Medium | Cut to 5-7 priorities per quarter |
| No conversion tracking means flying blind | High | Medium | Set up GSC + analytics + goal tracking before starting |
| Seasonal content published too late | Medium | Medium | Content calendar with lead times |
| Competitor analysis not done | Medium | Medium | Audit top 3 SERPs for each target keyword |

---

## Revised Priority Recommendation

Reordered by business impact potential (conversion likelihood x realistic ranking potential), not raw search volume.

| New Priority | Action | Target Keywords | Vol/mo | Rationale |
|-------------|--------|----------------|--------|-----------|
| 1 | **REOPTIMISE: Homepage for "hospitality marketing"** | hospitality marketing (500), pub marketing (50) | 550 | Highest commercial intent. Searchers are looking for exactly what Orange Jelly sells. Moderate competition, winnable with good on-page SEO. Every other page links back here. |
| 2 | **REOPTIMISE: Service pages + consolidation** | hospitality marketing agency (500), hospitality consultant (500), pub marketing agency (50) | 1,050 | Direct service discovery queries. Consolidate Instagram/Facebook into main social media page. Ensure clear CTAs and booking flow. |
| 3 | **REOPTIMISE: brewery-tie post as "Pub Lease" guide** | pub lease (5K), pub tenancy (500), brewery tie (50) | 5,550 | Highest-volume keyword with genuine licensee intent. Person researching pub leases is a plausible future client. |
| 4 | **REOPTIMISE: pub-health-check as "How to Run a Pub" guide** | how to run a pub (500), running a pub (500), pub management (50) | 1,050 | Operator-intent keyword. Searchers are licensees or aspiring licensees -- the target audience. |
| 5 | **NEW: "How to Buy a Pub" guide** | buying a pub (500), how to start a pub (50), taking over a pub (50) | 600 | Top-of-funnel for future clients. Someone buying a pub today may hire a consultant within 6-12 months. Lead magnet opportunity. |
| 6 | **NEW: "Pub Business Plan" guide + template** | pub business plan (500) | 500 | Lead magnet (downloadable template captures email). Searcher is an aspiring or current licensee. Natural cross-sell to consultancy services. |
| 7 | **NEW: "Does Your Pub Need a Website?" guide** | pub website (500), pub seo (50) | 550 | Directly sells Orange Jelly's services. Searcher is a licensee wondering about digital presence -- exactly the awareness stage before hiring a consultant. |
| 8 | **REOPTIMISE: menu-engineering post** | menu engineering (500), pub menu ideas (500), pub food ideas (500) | 1,500 | Mixed intent but operator-heavy. Licensees search these when trying to improve margins -- a core Orange Jelly service. |
| 9 | **REOPTIMISE: quiz-night-101 for "pub quiz" cluster** | pub quiz (50K), quiz night (5K), how to run a pub quiz (50) | 55K | High volume, but reframe for licensees ("how to run a profitable quiz night") not consumers. Include operator-focused CTAs. Realistic expectation: page 2-3 ranking, capturing long-tail variants. |
| 10 | **NEW: Long-tail licensee problem cluster (4-6 short posts)** | struggling pub (50), empty pub (50), pub profit margins (50), how to increase footfall (50), pub closing (500) | 750 | Low volume individually but very high intent. These searchers are licensees with urgent problems -- the most likely to hire a consultant. Fast to create, realistic to rank, highest conversion rate. |

### Deprioritised (move to Q2-Q3)

| Action | Reason |
|--------|--------|
| Pub quiz questions post (50K) | Consumer intent, not client intent. Create a lightweight version in Q2 for brand awareness. |
| Pub beer garden post (5K) | Consumer intent (people looking for beer gardens to visit). Seasonal -- publish by March 2027 if pursued. |
| Pub sunday roast post (5K+) | Consumer intent (people looking for where to eat). |
| Boardgame/pub games reoptimisation (5K) | Consumer intent. Low conversion potential. |
| Karaoke near me reoptimisation (50K) | Local pack query, unwinnable via content SEO. |
| Music bingo reoptimisation (5K) | Consumer intent unless reframed for operators. |

### Recommended Timeline

**Month 1-2 (Foundation):**
- Set up Google Search Console tracking and conversion goals
- Conduct backlink audit and competitor SERP analysis for top 10 keywords
- Execute Priorities 1-2 (homepage + service page reoptimisation)
- Begin Priorities 3-4 (pub lease and how to run a pub reoptimisations)

**Month 3-4 (Commercial Content):**
- Publish Priorities 5-7 (buying a pub, business plan, pub website guides)
- Execute Priority 8 (menu engineering reoptimisation)
- Begin link building outreach to trade publications

**Month 5-6 (Expand + Measure):**
- Publish Priority 10 (long-tail licensee problem cluster)
- Reframe quiz-night-101 with operator angle (Priority 9)
- First major performance review: Are commercial keywords ranking? Are enquiries increasing?
- Decision gate: proceed to informational content (beer garden, sunday roast, quiz questions) or double down on commercial content and link building

### Success Metrics

| Timeframe | Leading Indicators | Lagging Indicators |
|-----------|-------------------|-------------------|
| 3 months | 5+ commercial keywords in top 20; GSC impressions up 50% | 1-2 organic enquiries/month |
| 6 months | 3+ commercial keywords on page 1; 500+ organic sessions/month | 3-5 organic enquiries/month |
| 12 months | 10+ keywords on page 1; 1,500+ organic sessions/month | 5-10 organic enquiries/month; 2+ clients sourced from organic |

### The Bottom Line

This keyword plan is thorough in its research but backwards in its prioritisation. It optimises for the metric that matters least to a 2-person consultancy (traffic volume) at the expense of the metric that matters most (qualified leads). A pub marketing consultant does not need 146K monthly visits. They need 5-10 licensees per month to visit their site and pick up the phone. Rebalancing toward commercial intent, realistic ranking targets, and a proper conversion funnel will produce better business outcomes from less content effort.
