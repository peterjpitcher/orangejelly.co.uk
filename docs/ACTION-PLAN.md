# Orange Jelly Website — Full Action Plan
**Created:** 4 March 2026
**Goal:** More enquiries from UK pub licensees
**Status:** Ready to implement — work in priority order

---

## Context for a New Session

This plan was created after a comprehensive audit of the orangejelly.co.uk website covering security, UX, design system, code quality, SEO, and content — combined with analysis of 3 months of Google Search Console data.

**The core finding:** The site ranks well in Google (positions 4-15 for many valuable terms) but the titles and descriptions people see in search results are not compelling enough to make them click. This is the fastest path to more enquiries.

**Primary goal:** More enquiries (not just traffic).

**Build command:** `npm run build`
**Type check:** `npm run type-check`
**Lint:** `npm run lint`
**Deploy:** `vercel --prod --yes`

---

## Phase 1 — Fix Pages Already Ranking (Do This First)
### Why: These pages are in Google positions 4-10 RIGHT NOW but getting zero or near-zero clicks. Fixing the title and description in search results costs nothing and can generate enquiries within days of Google re-crawling the page.

---

### 1.1 Fix the fix-my-pub page (HIGHEST PRIORITY)
**File:** `src/app/fix-my-pub/page.tsx`
**Problem:** The query "fix my pub" gets 56 impressions/month at position 6.25 — someone desperate to fix their pub is seeing this page in Google but not clicking. Zero clicks in 3 months.
**What to do:** Read the current `generateMetadata()` function. Rewrite the title and description to be urgent, empathetic, and specific. Someone searching "fix my pub" is at crisis point.

**Target:**
- Title: ~55 chars. Should feel like you understand their emergency. E.g. "Fix My Pub — Honest Help From a Working Licensee"
- Description: 150-160 chars. Address the pain directly. E.g. "Quiet nights, empty seats, dropping revenue? Peter Pitcher has turned around The Anchor and dozens of pubs. No agency fluff — direct help."
- Also check the page content itself — does the hero headline immediately say "I understand your problem and here's how I fix it"? It should.

---

### 1.2 Fix the four service page titles/descriptions
**Problem:** These pages rank 4th-7th on Google but get zero clicks. People see them and don't click because the title/description isn't compelling.

#### Instagram Services page
**File:** `src/app/services/instagram-services-for-pubs/page.tsx` (or check `src/components/PubServiceLandingPage.tsx` — service pages may share a template)
**Query ranking for:** "instagram services for pubs" — position 4.58, 71 impressions, 0 clicks
**Fix:** Title should promise a clear outcome (e.g. "Instagram for Pubs — Real Posts That Fill Your Pub"). Description should name the specific result and who it's for.

#### Paid Social page
**File:** `src/app/services/paid-social-for-pubs/page.tsx`
**Query:** "paid social for pubs" — position 4.32, 57 impressions, 0 clicks
**Fix:** Same approach. The description needs to explain what paid social does for a pub in plain English with a specific benefit.

#### Facebook Services page
**File:** `src/app/services/facebook-services-for-pubs/page.tsx`
**Query:** "facebook services for pubs" — position 5.61, 41 impressions, 0 clicks
**Fix:** Same pattern. "Facebook for Pubs — Weekly Content That Brings Locals Back In"

#### Content Creation page
**File:** `src/app/services/content-creation-for-pubs/page.tsx`
**Query:** "content creation for pubs" — position 7.12, 69 impressions, 0 clicks
**Fix:** Make it specific — what kind of content, what result, how quickly.

**For all service pages:** After fixing metadata, also check the page hero text. If the metadata gets people to click, the first thing they see on the page must continue the promise — immediate empathy, specific outcome, clear call to action above the fold.

---

### 1.3 Improve CTR on high-impression blog posts
These posts have huge visibility in Google but terrible click rates. Better titles = more traffic from existing rankings.

#### Summer Pub Events article
**File:** `content/blog/summer-pub-event-ideas.md`
**Stats:** 2,830 impressions/month, position 15.99, only 0.81% CTR (23 clicks)
**If CTR improved to 3%:** 84 clicks instead of 23 — from the same ranking
**Fix:** The title visible in Google (the `title:` field in frontmatter) needs to be more compelling. Also check the `excerpt:` — this becomes the meta description. It should tease the content rather than summarise it. Make people feel they're missing something by not clicking.
**Note:** The position (16) also means improving the content quality could push it to page 1, multiplying the effect further.

#### Pub Refurbishment article
**File:** `content/blog/pub-refurbishment-on-budget.md`
**Stats:** 1,170 impressions/month, position 13.67, only 0.43% CTR (5 clicks)
**Fix:** Same — title and excerpt need a rewrite. Also consider whether this is truly a "struggling licensee wanting to refurbish" audience or builders/contractors. If it's the wrong audience, the article may need refocusing toward licensees considering whether a refurb is the right move.

#### Content Marketing Ideas article
**File:** `content/blog/content-marketing-ideas-pubs.md`
**Stats:** 815 impressions/month, position 19.41, only 0.37% CTR (3 clicks)
**Fix:** Position 19 means page 2 — it needs both a better title for CTR AND better content to push to page 1. Rewrite title to be very specific and actionable.

---

## Phase 2 — Build the Missing Pages (Next 2 Weeks)
### Why: There are high-value search queries with real commercial intent that the site has no dedicated page for.

---

### 2.1 Create a "Pub Marketing Agency" page
**Priority:** HIGH — this is a transactional query (someone ready to hire)
**Query:** "pub marketing agency" — 149 impressions/month at position 13.74
**What to build:** A dedicated landing page at `/pub-marketing-agency` (or similar) that:
- Speaks directly to pub owners who want to hire a marketing specialist
- Differentiates Orange Jelly from generic agencies (Peter works from a real pub)
- Has a strong CTA — WhatsApp or contact form
- Includes real results (approved metrics only — see below)
- Has proper FAQ structured data for "People Also Ask"

**Related queries to target on the same page:**
- "marketing agency for pubs" (77 impressions, pos 15.53)
- "digital marketing for pubs" (82 impressions, pos 50.54)
- "marketing agency for bars" (41 impressions, pos 24.61)
- "marketing for pubs" (15 impressions, pos 19.13)

**File to create:** `src/app/pub-marketing-agency/page.tsx`
**Pattern to follow:** Look at `src/app/pub-rescue/page.tsx` or `src/app/fix-my-pub/page.tsx` for the right structure.

---

### 2.2 Create a "Pub Marketing" hub page
**Query:** "pub marketing" — 210 impressions/month at position 17.65
**Note:** There is already a `/pub-marketing` page but it's getting 1 click from 1 impression — check `src/app/pub-marketing/page.tsx`. It may not be properly optimised or may be too thin.
**What to do:** Read the existing page. If it's thin, expand it significantly. It should be the definitive guide to pub marketing — covering social media, events, email, local SEO — with internal links to all relevant blog posts and services. Think of it as a pillar page.

---

### 2.3 Create a "Family Friendly Pub Activities" article
**Queries with no good page:**
- "family friendly activities to increase pub footfall" — 89 impressions, pos 31.94
- "how to attract families to pubs" — 82 impressions, pos 32.70
- "how to organise events to attract families to pubs" — 67 impressions, pos 30.24

This cluster of queries shows clear demand and the site is appearing (pos 30-32) but too far back to get clicks. A well-written dedicated article targeting this angle could rank in top 10.
**File to create:** `content/blog/how-to-attract-families-to-your-pub.md`
**Follow the blog article creation guide in CLAUDE.md exactly.**

---

### 2.4 Strengthen the Events hub
**Queries:**
- "event ideas for pubs" — 330 impressions, pos 16.57, 0 clicks
- "pub event ideas" — 265 impressions, pos 15.46, 2 clicks
- "pub events ideas" — 15 impressions, pos 12.53
- "ideas for pub events" — 43 impressions, pos 6.28

Multiple variations of the same search are all landing on different pages or the same page at varying positions. The site needs ONE excellent hub article for "pub event ideas" that consolidates all the variants.
**Check:** Does `content/blog/how-to-run-successful-pub-events.md` exist and is it strong enough? Read it. If not, either strengthen it or create a better one.

---

## Phase 3 — Fix Remaining Blog Posts (51 Posts)
### Why: 51 of the 71 blog posts still have broken voice search queries and missing structured FAQs. These reduce the chance of appearing in "People Also Ask" boxes and voice search results.

**What needs fixing in each post:**
1. `voiceSearchQueries:` in frontmatter — current ones are malformed (e.g. "How do I to [title]..."). Replace with 3 natural human questions like "how do I get more people into my pub on a quiet Tuesday?"
2. `faqs:` array in frontmatter — most posts only have `hasFAQs: true` with FAQs buried in body text. Add a proper `faqs:` array with minimum 3 entries, each with a `question:` and `answer:` (2-3 sentences minimum)

**The 20 posts already fixed (do NOT re-edit these):**
1. why-is-my-pub-empty.md
2. fill-empty-pub-tables.md
3. compete-with-wetherspoons.md
4. low-budget-pub-marketing-ideas.md
5. quiz-night-ideas.md
6. profitable-pub-food-menu-ideas.md
7. social-media-strategy-for-pubs.md
8. how-to-run-successful-pub-events.md
9. pub-differentiation-strategies.md
10. revenue-levers-struggling-pubs.md
11. facebook-marketing-local-pubs.md
12. instagram-marketing-for-pubs.md
13. email-marketing-pub-retention.md
14. midweek-pub-offers-that-work.md
15. pub-empty-tuesday-nights.md
16. recession-proof-pub-strategies.md
17. upselling-secrets-training-scripts.md
18. menu-engineering-lift-average-spend.md
19. staff-motivation-hacks-no-pay-rise.md
20. live-music-events-for-pubs.md

**Fix all other .md files in `content/blog/` that have malformed voiceSearchQueries or missing faqs arrays.**

**How to spot malformed voice queries:** Look for any voiceSearchQuery that starts with "How do I to" or "How do I [exact title]" — these are all broken.
**FAQ format required:**
```yaml
faqs:
  - question: "Natural question a pub owner would ask?"
    answer: "Clear, specific answer. Include numbers where possible. 2-3 sentences."
  - question: "Another common question?"
    answer: "Detailed answer with practical advice."
  - question: "Third question?"
    answer: "Answer that directly addresses the query."
```

---

## Phase 4 — County Pages Local Content
### Why: The 7 county pages (Surrey, London, Berkshire, Buckinghamshire, Hampshire, Hertfordshire, Kent, Oxfordshire) have ~40-50% overlapping content, which risks keyword cannibalisation.

**Files:**
- `src/app/pub-marketing-surrey/page.tsx`
- `src/app/pub-marketing-london/page.tsx`
- `src/app/pub-marketing-berkshire/page.tsx`
- `src/app/pub-marketing-buckinghamshire/page.tsx`
- `src/app/pub-marketing-hampshire/page.tsx`
- `src/app/pub-marketing-hertfordshire/page.tsx`
- `src/app/pub-marketing-kent/page.tsx`
- `src/app/pub-marketing-oxfordshire/page.tsx`

**Note:** The metadata (titles and descriptions) was already made unique in the previous session. What still needs doing is the **page body content**.

**For each county page, research and add:**
1. Approximate number of pubs in that county (publicly available data)
2. The competitive landscape (chain pubs presence, Wetherspoons locations)
3. Seasonal patterns relevant to that region (e.g. London = year-round trade, tourist peaks; Surrey = commuter belt, lunch trade; Kent = seasonal tourism, hop harvest history)
4. 3 FAQs that are genuinely county-specific (not just the county name swapped in)
5. At least one local angle that Peter can credibly speak to (proximity to Stanwell Moor for Surrey, access to London venues etc.)

**The component rendering these pages:** `src/components/PubMarketingLocationLandingPage.tsx` — read this to understand what fields are available to customise.

---

## Phase 5 — Internal Linking
### Why: Blog posts rarely link to service pages. Every article that solves a problem should point the reader to the relevant service.

**The pattern to implement:**

Each blog post should have 1-3 contextual internal links to relevant service or conversion pages. Add them naturally within the body content, not as a list at the bottom.

**Priority linking targets (these are the conversion pages):**
- `/fix-my-pub` — link from any article about struggling pubs, empty pubs, pub rescue
- `/pub-rescue` — link from turnaround/crisis articles
- `/quiet-midweek-solutions` — link from midweek and quiet night articles
- `/empty-pub-solutions` — link from empty pub, footfall articles
- `/compete-with-pub-chains` — link from Wetherspoons/competition articles
- `/services` — link from any article where a reader might want professional help
- `/contact` — link from articles with high commercial intent

**Start with the top 10 highest-traffic blog posts** (by clicks in GSC data):
1. profitable-pub-food-menu-ideas → link to /services and /contact
2. social-media-strategy-for-pubs → link to social media services
3. summer-pub-event-ideas → link to /quiet-midweek-solutions or /services
4. quiz-night-ideas → link to /quiet-midweek-solutions
5. village-pub-dying-village-survival → link to /pub-rescue
6. christmas-pub-promotion-ideas → link to /services
7. compete-with-wetherspoons → link to /compete-with-pub-chains
8. pub-refurbishment-on-budget → link to /fix-my-pub
9. content-marketing-ideas-pubs → link to content creation service
10. midweek-pub-offers-that-work → link to /quiet-midweek-solutions

---

## Phase 6 — Conversion Optimisation
### Why: Goal is enquiries, not just traffic. The pages people reach need to convert them.

### 6.1 Check the fix-my-pub page flow
**File:** `src/app/fix-my-pub/` — read the full page component
**Check:**
- Is there a clear "what happens when you contact us" explanation?
- Is the WhatsApp button visible without scrolling on mobile?
- Is there a form AND a WhatsApp option? (Some people prefer each)
- Are there trust signals (results, testimonials) close to the CTA?
- What's the first sentence of the page? It should immediately mirror the search query that brought them there.

### 6.2 Check the contact page
**File:** `src/app/contact/` — read the full page
**The contact page gets 4 clicks/month at position 22 with 4.4% CTR** — meaning people searching for a way to contact Peter are clicking but not always submitting. Check the form for friction.

### 6.3 Add a results/social proof section to key service pages
**File:** `src/components/ResultsSection.tsx` and `src/app/results/page.tsx`
The results page exists but isn't linked from service pages. Consider adding a condensed social proof section (2-3 stats with context) to `/fix-my-pub`, `/pub-rescue`, and the contact page.

**Approved metrics to use:**
- Quiz night: "25-35 regulars (up from 20)"
- Food GP: "58% → 71%"
- Social media: "60-70K monthly views"
- Value added: "£75-100K"
- Sunday margin gain: "£250/week"
- AI time freed: "25 hours/week"

---

## Phase 7 — New Publish Cadence
### Why: All 71 existing posts were published Thursday/Friday. Going forward, publish on Mondays.

**Rule for all new blog posts:**
- Set `publishedDate:` to the upcoming Monday
- Set `status: published` only when ready to go live
- Minimum 1 post per month (ideally 2)

**Next recommended topics based on GSC data:**
1. "How to attract families to your pub" (89 impressions, pos 32 — clear gap)
2. "Pub marketing agency vs DIY — which is right for your pub?" (captures agency query intent)
3. "How to run a pub with no money" (appeared in queries — real pain point)
4. "AI tools for pubs" ("ai for pubs" query appearing — forward-looking topic Peter is well-placed for)
5. "Bar refurbishment — is it worth it for struggling pubs?" (115 impressions, pos 37 — wrong angle currently)

---

## Quick Reference — Key Files

### Pages
| Page | File |
|------|------|
| Homepage | `src/app/page.tsx` + `src/app/HomePage.tsx` |
| Fix My Pub | `src/app/fix-my-pub/` |
| Pub Rescue | `src/app/pub-rescue/` |
| Contact | `src/app/contact/` |
| Services | `src/app/services/` |
| Instagram Services | `src/app/services/instagram-services-for-pubs/` |
| Paid Social | `src/app/services/paid-social-for-pubs/` |
| Facebook Services | `src/app/services/facebook-services-for-pubs/` |
| Content Creation | `src/app/services/content-creation-for-pubs/` |
| Quiet Midweek | `src/app/quiet-midweek-solutions/` |
| Empty Pub | `src/app/empty-pub-solutions/` |
| Compete | `src/app/compete-with-pub-chains/` |
| Results | `src/app/results/` |
| Blog listing | `src/app/licensees-guide/` |
| Blog posts | `content/blog/*.md` |

### Components
| Component | File |
|-----------|------|
| Navigation | `src/components/Navigation.tsx` |
| Hero | `src/components/Hero.tsx` |
| CTA Section | `src/components/CTASection.tsx` |
| Sticky CTA | `src/components/StickyCTA.tsx` |
| WhatsApp Button | `src/components/WhatsAppButton.tsx` |
| ROI Calculator | `src/components/ROICalculator.tsx` |
| Contact Form | `src/components/forms/contact-form.tsx` |
| Location pages | `src/components/PubMarketingLocationLandingPage.tsx` |
| Service pages | `src/components/PubServiceLandingPage.tsx` |
| Results Section | `src/components/ResultsSection.tsx` |

### SEO & Schema
| File | Purpose |
|------|---------|
| `src/app/sitemap.ts` | XML sitemap |
| `src/app/robots.ts` | Robots.txt |
| `src/app/layout.tsx` | Root metadata |
| `src/lib/metadata.ts` | Metadata helper |
| `src/components/BlogPostingSchema.tsx` | Blog structured data |
| `src/components/CollectionPageSchema.tsx` | List structured data |
| `src/components/FAQAccordionWrapper.tsx` | FAQ structured data |

---

## Approved Business Metrics (ONLY use these — never invent others)
- Quiz night: "25-35 regulars (up from 20)"
- Food GP: "58% → 71%"
- Social media: "60-70K monthly views"
- Database: "300 contacts"
- Value added: "£75-100K"
- Sunday margin gain: "£250/week"
- Tasting retention: "85%"
- AI time freed: "25 hours/week"

## Business Language Rules
- Greene King = **Tenant** (NEVER "partner")
- BII = **Member**
- Peter Pitcher = Founder
- Billy Summers = Co-owner (runs The Anchor day-to-day)
- Location: The Anchor, Stanwell Moor, Staines TW19 6AQ
- Pricing: £75/hr + VAT, no packages, 30-day guarantee
- UK English throughout (optimise not optimize, etc.)

---

## What Was Already Fixed (Previous Session — Do Not Redo)

### Security
- Open redirect vulnerability fixed in `/api/preview/route.ts` and `/api/preview/exit/route.ts`
- `sanitizeInput()` bug fixed (script tag stripping order)
- API routes now get security headers via `next.config.js`

### Technical SEO
- `CollectionPageSchema.tsx` — BlogPosting now wrapped in ListItem
- `BlogPostingSchema.tsx` — articleBody strips HTML, truncated to 5,000 chars
- All 7 county pages now have unique meta descriptions
- Duplicate meta tags removed from `layout.tsx`
- `robots.ts` — deprecated host field removed
- `vercel.json` — no-op rewrite removed; static assets get 1-year cache
- `next.config.js` — deviceSizes, imageSizes, minimumCacheTTL added
- `foundingDate` corrected to ISO 8601
- `contactOption: TollFree` removed
- Blog sitemap priority raised from 0.6 to 0.7

### UX
- `alert()` replaced with in-page states in contact-form.tsx and newsletter-form.tsx
- Touch targets brought to 44px minimum across 8 components
- Newsletter dismiss: 5s → 15s
- Skip-to-main improved
- Search no-results state improved

### Design System
- Hardcoded hex colours in Hero.tsx → Tailwind tokens
- CSS var() in 8 components → Tailwind tokens
- Raw `<a>` in PartnershipsSection.tsx → Link component

### Content (20 posts fixed)
- Voice queries fixed
- Excerpts completed
- Structured FAQs added to frontmatter

---

## GSC Data Summary (March 2026 — 3 months)

### Top pages by clicks
| Page | Clicks | Impressions | CTR | Position |
|------|--------|-------------|-----|----------|
| profitable-pub-food-menu-ideas | 31 | 2,387 | 1.3% | 7.5 |
| social-media-strategy-for-pubs | 25 | 2,248 | 1.11% | 13.1 |
| summer-pub-event-ideas | 23 | 2,830 | 0.81% | 16.0 |
| quiz-night-ideas | 12 | 840 | 1.43% | 14.5 |
| homepage | 11 | 619 | 1.78% | 18.6 |

### Service pages with position but 0 clicks
| Page | Position | Impressions |
|------|----------|-------------|
| Instagram services | 4.6 | 71 |
| Paid social | 4.3 | 57 |
| Fix my pub | 6.3 | 56 |
| Facebook services | 5.6 | 41 |
| Content creation | 7.1 | 69 |

### High-volume queries with no dedicated page
| Query | Impressions | Position |
|-------|-------------|----------|
| event ideas for pubs | 330 | 16.6 |
| pub marketing | 210 | 17.7 |
| social media marketing for pubs | 159 | 12.0 |
| pub marketing agency | 149 | 13.7 |
| bar refurbishment | 115 | 37.1 |
| family friendly activities for pubs | 89 | 31.9 |
| how to attract families to pubs | 82 | 32.7 |
