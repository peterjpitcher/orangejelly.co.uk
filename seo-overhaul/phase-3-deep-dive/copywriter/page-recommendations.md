# Page-by-Page SEO Copywriting Recommendations

**Date:** 2026-03-23
**Phase:** 3 -- Deep Dive

Each page below includes: current state, specific issues, and exact recommended copy.

**Note on title format:** The metadata utility appends ` | Orange Jelly` automatically. All recommended titles below are the pre-suffix value and should stay under 50 characters to keep the full rendered title under 65 characters.

---

## 1. Homepage (`/`)

**File:** `src/app/page.tsx`

### Current State

- **Title:** `Transformative Marketing for Hospitality Partners | Orange Jelly` (~65 chars with suffix)
- **Meta description:** `Orange Jelly helps UK pubs grow with action-first marketing. Proactive strategy, AI-enabled delivery, and measurable outcomes. Talk to us today.` (147 chars)
- **H1:** `Transformational hospitality marketing. Built to accelerate growth.`

### Issues

1. Title contains zero high-volume keywords. "Transformative Marketing for Hospitality Partners" matches no search query. The word "pub" does not appear.
2. H1 repeats the brand-centric language problem. No searcher types "transformational hospitality marketing".
3. Meta description is reasonable but opens with brand name instead of benefit.
4. The hero subtitle is 280+ characters -- too long for SERP context.

### Recommended Title Tag

```
Pub Marketing That Works -- From a Real Publican
```

(52 chars pre-suffix; renders as "Pub Marketing That Works -- From a Real Publican | Orange Jelly" = 65 chars)

### Recommended Meta Description

```
Pub marketing tested at a real pub. We grew quiz night to 35 regulars and food GP from 58% to 71%. Practical help from GBP 75/hr + VAT. No retainers.
```

(152 chars -- includes keyword, proof point, price, and differentiator)

### Recommended H1

```
Pub marketing from a working pub. Proven systems that fill seats.
```

### Content Recommendations

- **Add "pub marketing" to the first 100 words of visible body copy.** Currently the first visible text is the hero subtitle which says "hospitality businesses" -- change to "pubs, bars, and hospitality venues".
- **Add 3-5 internal links in the problems/features sections.** Each problem card links to a solution page (good), but add text links to the pillar page `/pub-marketing` and the agency page `/pub-marketing-agency`.
- **Add a "Featured in" mention** with a link to the BII article if available -- this is an E-E-A-T signal.

### Internal Linking Opportunities

| Anchor Text | Target URL | Location on Page |
|------------|-----------|-----------------|
| "pub marketing ideas" | /pub-marketing | Features section |
| "pub marketing agency" | /pub-marketing-agency | About section |
| "see our pub marketing results" | /results | Results section |
| "read the licensee's guide" | /licensees-guide | FAQ section |
| "fix my pub" | /fix-my-pub | Problem cards |

---

## 2. Services Page (`/services`)

**File:** `src/app/services/page.tsx`

### Current State

- **Title:** `Hospitality Growth Services for Pubs & Venues | Orange Jelly` (~59 chars with suffix)
- **Meta description:** `Action-first growth services for hospitality partners: event innovation, marketing systems, simplified tools, and clarity that unlocks momentum.` (145 chars)
- **H1 (from JSON):** `Hospitality Growth Services That Create Real Momentum`

### Issues

1. Title misses "pub marketing services" -- the direct transactional keyword (50-100/mo).
2. Meta description has no proof points, no price, no CTA. Reads like a tagline.
3. "Hospitality growth services" is not a search query anyone types.
4. The keywords field targets "event innovation hospitality" (zero search volume).

### Recommended Title Tag

```
Pub Marketing Services -- Practical Help From GBP 75/hr
```

(53 chars pre-suffix)

### Recommended Meta Description

```
Pub marketing services: social media, events, menu engineering, and local SEO. Tested at The Anchor, delivered for your pub. GBP 75/hr + VAT, no retainer.
```

(156 chars)

### Recommended H1

```
Pub Marketing Services That Actually Move the Till
```

### Content Recommendations

- **Replace "hospitality partners" with "pubs" in the hero subtitle.** The current subtitle mentions "hospitality partners" but the audience searches for pub-specific services.
- **Add a brief intro paragraph** below the hero that includes "pub marketing services", "pub marketing support", and "marketing for pubs" naturally.
- **Add links to individual service pages** (social media, Facebook, Instagram, content creation) in a clear navigation section.
- **Link to the results page** from the metrics section.

### Internal Linking Opportunities

| Anchor Text | Target URL | Location |
|------------|-----------|---------|
| "pub marketing agency" | /pub-marketing-agency | Hero or intro |
| "social media marketing for pubs" | /services/social-media-marketing-for-pubs | Service cards |
| "see our results" | /results | Metrics section |
| "quiz night guide" | /licensees-guide/quiz-night-ideas | Events service card |
| "menu engineering guide" | /licensees-guide/menu-engineering-lift-average-spend | Menu service card |

---

## 3. Pub Marketing Agency Page (`/pub-marketing-agency`)

**File:** `src/app/pub-marketing-agency/page.tsx`

### Current State

- **Title:** `Pub Marketing Agency -- Real Results From a Working Pub | Orange Jelly` (~70 chars with suffix -- slightly long)
- **Meta description:** `Pub marketing agency run by a licensee, not a desk. We grew food GP from 58% to 71% and built 60-70K monthly social views at The Anchor. GBP 75/hr + VAT.` (156 chars)
- **H1:** `A Pub Marketing Agency That Actually Runs a Pub`

### Issues

1. Title is slightly over 65 chars with suffix -- will be truncated. Trim 5-10 chars.
2. Meta description is strong -- proof points, price, differentiator. Keep.
3. H1 is excellent -- keyword-rich, differentiating, memorable. Keep.
4. Missing "pub marketing consultant" in content (secondary keyword, 50-100/mo).

### Recommended Title Tag

```
Pub Marketing Agency -- Tested in a Real Pub
```

(47 chars pre-suffix; renders as 62 chars total)

### Recommended Meta Description

Keep current -- it is well-written. Minor tweak:

```
Pub marketing agency run by a licensee. Food GP 58% to 71%, 60-70K monthly social views -- all proven at The Anchor. GBP 75/hr + VAT, no retainer.
```

(149 chars -- slightly tighter)

### Recommended H1

Keep current: `A Pub Marketing Agency That Actually Runs a Pub`

### Content Recommendations

- **Add "pub marketing consultant" as an H2 or in body copy.** Example: a section titled "Why Choose a Pub Marketing Consultant Over a Generic Agency?" -- this targets the secondary keyword without cannibalising the primary.
- **Add "pub marketing company" in body copy** somewhere natural -- another secondary keyword.
- **Add internal links to location pages.** Example: "We work with pubs across Surrey, London, Berkshire, and the South East" with each county linked.

### Internal Linking Opportunities

| Anchor Text | Target URL | Location |
|------------|-----------|---------|
| "pub marketing Surrey" | /pub-marketing-surrey | "Who this is for" section |
| "pub marketing London" | /pub-marketing-london | "Who this is for" section |
| "our pub marketing results" | /results | Results section |
| "pub marketing services" | /services | CTA section |
| "complete pub marketing guide" | /pub-marketing | "What we do" section |

---

## 4. Fix My Pub (`/fix-my-pub`)

**File:** `src/app/fix-my-pub/page.tsx`

### Current State

- **Title:** `Fix My Pub -- Honest Help From a Working Licensee | Orange Jelly` (~63 chars with suffix)
- **Meta description:** `Pub struggling? I run one myself. Tell me what's wrong and I'll show you the fastest fix -- with a clear plan and templates. GBP 75/hr + VAT, no contract.` (156 chars)
- **H1 (from JSON):** `Pub Struggling? Let's Fix It`

### Issues

1. Title is good -- keyword "fix my pub" is front-loaded. Length is acceptable.
2. Meta description is excellent -- conversational, specific, includes price.
3. H1 is good for conversion but does not contain the exact keyword "fix my pub". Consider keeping it for emotional impact since the title tag handles keyword matching.
4. Cannibalisation risk with /empty-pub-solutions and /pub-rescue.

### Recommended Title Tag

Keep current -- it works well. Minor alternative if testing:

```
Fix My Pub -- Practical Help From a Fellow Licensee
```

(53 chars pre-suffix)

### Recommended Meta Description

Keep current -- among the strongest on the site.

### Recommended H1

Keep current for conversion. OR if keyword matching is prioritised:

```
Fix My Pub: Practical Diagnosis and a Clear Plan
```

### Content Recommendations

- **Add a section addressing /pub-rescue keywords.** If /pub-rescue is redirected here (as recommended in content strategy report), add an H2: "Emergency Pub Rescue: The First 7 Days" -- this captures "pub rescue" and "struggling pub" keywords without a separate page.
- **Add internal links to blog posts** that support the diagnostic approach: revenue-levers-struggling-pubs, turnaround-playbook-independent-bars, fill-empty-pub-tables.
- **Add FAQ schema.** The fix-my-pub.json likely has FAQs -- verify and add FAQSchema component.

### Internal Linking Opportunities

| Anchor Text | Target URL | Location |
|------------|-----------|---------|
| "30-day recovery plan" | /empty-pub-solutions | Intro section |
| "quiet midweek solutions" | /quiet-midweek-solutions | Deliverables |
| "pub turnaround playbook" | /licensees-guide/turnaround-playbook-independent-bars | Intro |
| "how to fill empty pub tables" | /licensees-guide/fill-empty-pub-tables | Deliverables |
| "our pub marketing results" | /results | Social proof section |

---

## 5. Empty Pub Solutions (`/empty-pub-solutions`)

**File:** `src/app/empty-pub-solutions/page.tsx`

### Current State

- **Title:** `30-Day Pub Growth Recovery Plan | Empty Pub Solutions | Orange Jelly` (~68 chars -- too long, will be truncated)
- **Meta description:** `A practical 30-day plan to turn quiet trade into consistent momentum. Action-first recovery support tested at The Anchor. Start seeing results this week.` (155 chars)
- **H1:** `Quiet Nights to Consistent Trade in 30 Days.`

### Issues

1. Title is too long and splits the keyword with a pipe. "Empty Pub Solutions" should be front-loaded.
2. Meta description is decent but does not include the word "pub" until implied by context. Add "pub" or "empty pub" explicitly.
3. H1 is good for emotional impact but misses "empty pub" keyword.
4. FAQ section exists with good content but FAQ schema is implemented as raw JSON `dangerouslySetInnerHTML` instead of using the FAQSchema component -- inconsistent with site patterns.
5. No internal links to related blog posts.

### Recommended Title Tag

```
Empty Pub Solutions -- A 30-Day Recovery Plan
```

(48 chars pre-suffix; renders as 63 chars)

### Recommended Meta Description

```
Empty pub? Our 30-day plan rebuilds consistent trade with proven systems from The Anchor. Practical steps, real results. GBP 75/hr + VAT, no contract.
```

(152 chars)

### Recommended H1

```
Empty Pub? From Quiet Nights to Consistent Trade in 30 Days
```

### Content Recommendations

- **Add internal links to supporting blog posts** in the week-by-week plan sections. Each week's actions should link to the relevant guide.
- **Add a "Related Guides" section** before the CTA linking to: fill-empty-pub-tables, pub-empty-tuesday-nights, why-is-my-pub-empty, midweek-pub-offers-that-work.
- **Differentiate clearly from /fix-my-pub.** This page should be the long-form informational resource (30-day plan), while /fix-my-pub is the short diagnostic CTA page. Add a line: "Looking for a quick diagnosis first? Start with Fix My Pub."

### Internal Linking Opportunities

| Anchor Text | Target URL | Location |
|------------|-----------|---------|
| "why is my pub empty?" | /licensees-guide/why-is-my-pub-empty | Problem section |
| "fix my Google listing" | /licensees-guide/social-media-strategy-for-pubs | Week 1 |
| "midweek pub offers that work" | /licensees-guide/midweek-pub-offers-that-work | Week 1 |
| "email marketing for pubs" | /licensees-guide/email-marketing-pub-retention | Week 2 |
| "quiz night ideas" | /licensees-guide/quiz-night-ideas | Week 2 |
| "quick diagnosis? Fix My Pub" | /fix-my-pub | Intro or CTA |

---

## 6. Quiet Midweek Solutions (`/quiet-midweek-solutions`)

**File:** `src/app/quiet-midweek-solutions/page.tsx`

### Current State

- **Title:** `Build Midweek Momentum - Proven Tuesday & Wednesday Solutions | Orange Jelly` (~76 chars -- far too long)
- **Meta description:** `Turn quiet midweek nights into consistent bookings with practical systems proven at The Anchor. Tuesday and Wednesday solutions that actually work.` (148 chars)
- **H1 (from JSON):** Varies by heroSection data

### Issues

1. Title is 76 chars with suffix -- will be heavily truncated. Google will show approximately "Build Midweek Momentum - Proven Tuesday & We..."
2. "Build Midweek Momentum" is not a search query. Target keywords are "quiet midweek pub" (100-200/mo), "pub empty tuesday nights" (50-100/mo).
3. Meta description is decent but does not include "pub" in the first 50 characters.
4. **Critical:** The FAQ section is disabled with `{false && ...}`. This removes valuable content and FAQ schema opportunity.
5. **Critical:** The "Midweek Momentum System" section is also disabled with `{false && ...}`. This is substantial content being hidden.
6. **Critical:** The "Implementation Timeline" section is also disabled. Three major content sections are suppressed.

### Recommended Title Tag

```
Quiet Midweek Pub Solutions -- Fill Tuesday & Wednesday
```

(55 chars pre-suffix -- slightly long but keywords front-loaded)

Alternative:

```
Quiet Midweek Pub? Tuesday & Wednesday Solutions
```

(50 chars pre-suffix)

### Recommended Meta Description

```
Quiet midweek pub nights? Proven systems to fill Tuesday and Wednesday. Quiz nights, themed events, and promotion templates from The Anchor. GBP 75/hr.
```

(153 chars)

### Recommended H1

```
Quiet Midweek Pub? Proven Solutions for Tuesday and Wednesday
```

### Content Recommendations

- **Re-enable the FAQ section.** The FAQ content exists and is rendered by FAQSchema at the bottom of the page, but the visible FAQ accordions are suppressed. Re-enable `{false && ...}` sections for FAQs, strategies, and timeline.
- **Re-enable the "Midweek Momentum System" section.** This is substantial, keyword-rich content that should be visible.
- **Re-enable the "Implementation Timeline" section.** The 4-week plan adds depth and supports the HowTo schema opportunity.
- **Add internal links** to the specific midweek blog posts: pub-empty-tuesday-nights, midweek-pub-offers-that-work, quiet-monday-night-promotions, fill-empty-seats-midweek-offers.

### Internal Linking Opportunities

| Anchor Text | Target URL | Location |
|------------|-----------|---------|
| "pub empty Tuesday nights" | /licensees-guide/pub-empty-tuesday-nights | Problem section |
| "midweek pub offers that work" | /licensees-guide/midweek-pub-offers-that-work | Strategies |
| "Monday night promotions" | /licensees-guide/quiet-monday-night-promotions | Event ideas |
| "quiz night ideas" | /licensees-guide/quiz-night-ideas | Tuesday winners |
| "how to run successful pub events" | /licensees-guide/how-to-run-successful-pub-events | Event ideas |
| "see our results" | /results | Results section |

---

## 7. Results Page (`/results`)

**File:** `src/app/results/page.tsx`

### Current State

- **Title:** `Hospitality Marketing Results for Pubs, Bars & Venues | Orange Jelly` (~68 chars -- too long)
- **Meta description:** `See hospitality marketing results proven at The Anchor, then adapted for hospitality partners. Real numbers, real strategies, measurable growth.` (145 chars)
- **H1 (from JSON):** `Real Hospitality Results From The Anchor`

### Issues

1. Title is too long and leads with "Hospitality Marketing Results" -- not a search query.
2. Meta description repeats "hospitality" twice and has no specific numbers.
3. H1 uses "hospitality" instead of "pub".
4. Keywords field targets "hospitality marketing results" (near-zero volume). Should target "pub marketing results" or "pub marketing case studies".

### Recommended Title Tag

```
Pub Marketing Results -- Proven at The Anchor
```

(48 chars pre-suffix)

### Recommended Meta Description

```
Pub marketing results: food GP 58% to 71%, quiz night 25-35 regulars, 60-70K monthly social views. All proven at The Anchor. See what we can do for your pub.
```

(159 chars -- slightly over, trim if needed)

Trimmed alternative:

```
Pub marketing results from The Anchor: food GP 58% to 71%, quiz night to 35 regulars, 60-70K social views. See what works.
```

(124 chars)

### Recommended H1

```
Pub Marketing Results From The Anchor
```

### Content Recommendations

- **Add a summary statistics section** at the top with the headline numbers in large text.
- **Add links from each case study to the relevant service page and blog post.** For example, the quiz night case study should link to /licensees-guide/quiz-night-ideas and /services.
- **Add a "Ready to get similar results?" CTA** that links to /fix-my-pub and /contact.

### Internal Linking Opportunities

| Anchor Text | Target URL | Location |
|------------|-----------|---------|
| "our pub marketing services" | /services | CTA section |
| "quiz night guide" | /licensees-guide/quiz-night-ideas | Quiz case study |
| "menu engineering guide" | /licensees-guide/menu-engineering-lift-average-spend | Food GP study |
| "social media strategy" | /licensees-guide/social-media-strategy-for-pubs | Social media study |
| "fix my pub" | /fix-my-pub | Final CTA |
| "pub marketing agency" | /pub-marketing-agency | Trust section |

---

## 8. Pub Marketing Surrey (`/pub-marketing-surrey`)

**File:** `src/app/pub-marketing-surrey/page.tsx`

### Current State

- **Title:** `Pub Marketing Surrey - Grow Your Local Trade | Orange Jelly` (~59 chars with suffix)
- **Meta description:** `Practical pub marketing for Surrey venues: local SEO, community events, and social media systems that drive footfall from nearby residents. GBP 75/hr + VAT.` (157 chars -- slightly over)
- **H1:** Determined by JSON data

### Issues

1. Title is decent but "Grow Your Local Trade" is generic. Could be more specific.
2. Meta description is good but slightly over 155 chars.
3. Missing "pub marketing consultant Surrey" as secondary keyword.

### Recommended Title Tag

```
Pub Marketing Surrey -- Local Expertise, Real Results
```

(54 chars pre-suffix)

Alternative:

```
Pub Marketing Surrey -- From a Working Publican
```

(49 chars pre-suffix)

### Recommended Meta Description

```
Pub marketing in Surrey from a local licensee. Social media, events, local SEO, and Google Business Profile. Proven at The Anchor, Stanwell Moor. GBP 75/hr.
```

(158 chars -- trim slightly)

Trimmed:

```
Pub marketing in Surrey from a local licensee. Social media, events, and local SEO proven at The Anchor, Stanwell Moor. GBP 75/hr + VAT.
```

(138 chars)

### Recommended H1

```
Pub Marketing in Surrey -- Local Expertise From The Anchor
```

### Content Recommendations

- **Add specific Surrey pub knowledge** -- mention Surrey towns, local events, Surrey-specific challenges (commuter demographics, competition from London, rural vs suburban pubs).
- **Add links to main service pages** and relevant blog posts.
- **Add LocalBusiness schema** with Surrey-specific geo coordinates if not already present.
- **Mention "pub marketing consultant Surrey"** in body copy naturally.

### Internal Linking Opportunities

| Anchor Text | Target URL | Location |
|------------|-----------|---------|
| "pub marketing agency" | /pub-marketing-agency | Intro |
| "our services" | /services | Services section |
| "quiz night ideas" | /licensees-guide/quiz-night-ideas | Events section |
| "pub marketing London" | /pub-marketing-london | Footer/related |
| "pub marketing Berkshire" | /pub-marketing-berkshire | Footer/related |
| "see our results" | /results | Proof section |

---

## 9. Pub Marketing London (`/pub-marketing-london`)

**File:** `src/app/pub-marketing-london/page.tsx`

### Current State

- **Title:** `Pub Marketing London - Stand Out in a Crowded City | Orange Jelly` (~65 chars -- borderline)
- **Meta description:** `Cut through London competition with local pub marketing that builds regulars. Events, social media, and Google visibility tailored for city pubs. GBP 75/hr + VAT.` (163 chars -- too long)
- **H1:** Determined by JSON data

### Issues

1. Title is good but "Stand Out in a Crowded City" is generic. Competitors could use the same.
2. Meta description is 163 chars -- will be truncated. Trim.
3. "Pub marketing London" is the highest-volume location keyword (50-100/mo).

### Recommended Title Tag

```
Pub Marketing London -- Fill Seats in a Busy City
```

(51 chars pre-suffix)

### Recommended Meta Description

```
Pub marketing for London venues. Local SEO, events, social media, and Google visibility from a working publican. GBP 75/hr + VAT, no retainer.
```

(144 chars)

### Recommended H1

```
Pub Marketing in London -- Stand Out and Fill Seats
```

### Content Recommendations

- **Add London-specific content** -- mention boroughs, London pub challenges (high rents, staff turnover, competition density), London-specific event ideas.
- **Cross-link to Surrey and other location pages.**
- **Add specific proof points** relevant to London pubs.

### Internal Linking Opportunities

Same pattern as Surrey -- link to main services, agency page, results, and relevant blog posts. Add cross-links to other location pages.

---

## 10. Licensees Guide (`/licensees-guide`)

**File:** `src/app/licensees-guide/page.tsx`

### Current State

- **Title:** `The Licensee's Guide - Expert Pub Management Advice | Orange Jelly` (~66 chars -- borderline)
- **Meta description:** `Essential guides for pub owners covering marketing, events, food, and business strategy. Practical advice that also applies to restaurants and bars.` (148 chars)
- **H1:** `The Licensee's Guide`

### Issues

1. Title is acceptable but "Expert Pub Management Advice" is generic. Could be more specific about what makes this content unique.
2. Meta description is decent but does not mention the volume of content (66+ guides) or Peter's credentials.
3. H1 is branded and short -- acceptable for a collection page.
4. The intro paragraph says "with ideas you can adapt for restaurants and bars" -- this dilutes the pub keyword focus.

### Recommended Title Tag

```
The Licensee's Guide -- 60+ Proven Pub Strategies
```

(51 chars pre-suffix)

### Recommended Meta Description

```
60+ pub management guides from a working licensee. Marketing, events, food margins, and business strategy. Every tip tested at The Anchor first.
```

(145 chars)

### Recommended H1

Keep current: `The Licensee's Guide` -- it is the branded name.

### Content Recommendations

- **Rewrite the lead paragraph** to front-load "pub" language: "Practical pub management guides from a working licensee" instead of "Essential guides for modern pub management, with ideas you can adapt for restaurants and bars."
- **Remove console.log** at line 236 -- production code should not log post counts.
- **Add featured/pinned posts** at the top: quiz-night-ideas, compete-with-wetherspoons, how-to-run-successful-pub-events.

---

## 11. Blog: Quiz Night Ideas (`/licensees-guide/quiz-night-ideas`)

**File:** `content/blog/quiz-night-ideas.md`

### Current State

- **Title (frontmatter):** `Quiz Night Ideas: 25 Formats That Pack Your Pub Every Week`
- **metaDescription:** `Discover 25 creative quiz night ideas and formats for pubs. From themed rounds to interactive challenges, learn how to run quiz nights that boost revenue`
- **H1:** Same as title

### Issues

1. Title is strong -- keyword front-loaded, number, benefit. At 58 chars it is just at the limit.
2. metaDescription is 152 chars -- good length. Could be slightly more specific with a proof point.
3. No SEO override exists for this post (it has one for quiz-night-101 but not quiz-night-ideas).
4. H1 duplicates title -- this is standard for blog posts and acceptable.

### Recommended SEO Override

Add to `src/lib/seo-overrides.ts`:

```typescript
'/licensees-guide/quiz-night-ideas': {
  title: 'Quiz Night Ideas: 25 Formats That Pack Your Pub',
  description: '25 quiz night ideas that fill pubs weekly. Formats, round ideas, and hosting tips from a pub that runs 25-35 teams every week. Steal our system.',
},
```

### Content Recommendations

- **Add internal links to:** quiz-night-101, how-to-run-successful-pub-events, pub-empty-tuesday-nights.
- **Add a CTA section** linking to /services or /fix-my-pub: "Need help setting up your quiz night? Talk to Peter."
- **Add link to /pub-marketing-agency** for readers who want hands-on help.

---

## 12. Blog: Compete with Wetherspoons (`/licensees-guide/compete-with-wetherspoons`)

**File:** `content/blog/compete-with-wetherspoons.md`

### Current State

- **Title (frontmatter):** `How to Compete with Wetherspoons: A Survival Guide for Independent Pubs`
- **metaDescription:** `Wetherspoons opened nearby? Discover 12 proven strategies independent pubs use to compete successfully with Wetherspoons and other chain pubs.`
- **H1:** Same as title

### Issues

1. Title is 71 chars -- slightly long. The key keyword "how to compete with wetherspoons" is front-loaded (excellent). This page already ranks #1.
2. metaDescription is 141 chars -- good.
3. No SEO override exists. Given this is already ranking #1, changes should be conservative.

### Recommended SEO Override

Add to `src/lib/seo-overrides.ts`:

```typescript
'/licensees-guide/compete-with-wetherspoons': {
  title: 'How to Compete with Wetherspoons (12 Proven Strategies)',
  description: 'Wetherspoons opened nearby? 12 proven strategies independent pubs use to compete and win. Written by a licensee who competes with chains daily.',
},
```

### Content Recommendations

- **Minimal changes** -- this page is already ranking well. Do not disrupt.
- **Add internal links to:** /compete-with-pub-chains (landing page), /licensees-guide/beat-chain-pubs, /licensees-guide/pub-differentiation-strategies.
- **Add a CTA** linking to /fix-my-pub or /services.
- **Ensure FAQ schema is rendering** for the frontmatter FAQs.

---

## 13. Blog: How to Run Successful Pub Events (`/licensees-guide/how-to-run-successful-pub-events`)

**File:** `content/blog/how-to-run-successful-pub-events.md`

### Current State

- **Title (frontmatter):** `How to Run Successful Pub Events: A Complete Guide to Profitable Functions`
- **metaDescription:** `Master the art of running successful pub events. Complete guide covering planning, promotion, execution, and profit maximisation for all types of pub`
- **H1:** `How to Run Successful Pub Events: The Complete Guide to Filling Your Pub With Profitable Events`

### Issues

1. Frontmatter title is 73 chars -- too long for a title tag. Will be truncated.
2. H1 is 94 chars -- excessively long. Google may use the title tag instead.
3. metaDescription is 149 chars -- acceptable but lacks specificity.
4. No SEO override exists.

### Recommended SEO Override

Add to `src/lib/seo-overrides.ts`:

```typescript
'/licensees-guide/how-to-run-successful-pub-events': {
  title: 'How to Run Successful Pub Events (Complete Guide)',
  description: 'The complete guide to profitable pub events. Planning, promotion, and execution systems that grew our quiz night to 35 regulars. Templates included.',
},
```

### Content Recommendations

- **Shorten the H1** in the markdown content to: `How to Run Successful Pub Events: The Complete Guide`
- **Add internal links to:** quiz-night-ideas, quiz-night-101, summer-pub-event-ideas, seasonal-pub-events-calendar, pub-event-template-profit-nights.
- **Add CTA** linking to /services and /fix-my-pub.
- **Link to /quiet-midweek-solutions** from the midweek events section.

---

## Cross-Cutting Recommendations

### 1. Replace "Hospitality Partners" with "Pubs" in Key Positions

Pages affected: Homepage, Services, Results. The brand language is fine in body copy and about sections, but title tags, H1s, and meta descriptions should use "pub" language that matches search behaviour.

### 2. Create SEO Overrides for Top 20 Blog Posts

Priority posts needing overrides (in addition to the 3 above):

| Post | Recommended Title |
|------|------------------|
| fill-empty-pub-tables | How to Fill Empty Pub Tables (Proven System) |
| why-is-my-pub-empty | Why Is My Pub Empty? 7 Real Reasons and Fixes |
| midweek-pub-offers-that-work | Midweek Pub Offers That Actually Work |
| low-budget-pub-marketing-ideas | Low Budget Pub Marketing Ideas (Free and Cheap) |
| social-media-strategy-for-pubs | (already has override -- keep) |
| pub-empty-tuesday-nights | (already has override -- keep) |
| content-marketing-ideas-pubs | Content Marketing Ideas for Pubs (Simple Plan) |
| instagram-marketing-for-pubs | Instagram Marketing for Pubs (What to Post) |
| christmas-pub-promotion-ideas | Christmas Pub Promotion Ideas That Drive Revenue |
| seasonal-pub-events-calendar | Pub Events Calendar: What to Run Each Month |
| turnaround-playbook-independent-bars | Pub Turnaround Playbook (30-Day Recovery Plan) |
| revenue-levers-struggling-pubs | Revenue Levers for Struggling Pubs (Quick Wins) |

### 3. Systematic Internal Linking

Build a linking network:

**Hub pages (receive links):**
- /pub-marketing (pillar)
- /pub-marketing-agency (commercial)
- /services (commercial)
- /fix-my-pub (conversion)
- /results (social proof)

**Spoke pages (send links):**
- All 66 blog posts should link to at least one hub page
- All solution pages should link to 3-5 blog posts and 1-2 hub pages
- Location pages should link to the agency page and services page

### 4. Enable Disabled Content Sections

The quiet-midweek-solutions page has three content sections disabled with `{false && ...}`:
- FAQ section (line 421)
- Midweek Momentum System (line 177)
- Implementation Timeline (line 227)

These contain valuable, keyword-rich content that should be re-enabled.

### 5. Remove `keywords` Meta Tags

The `keywords` meta tag has had zero SEO value since 2009. Remove from all pages to clean up code. The `keywords` prop in `generateMetadata` and `generateStaticMetadata` should be deprecated.
