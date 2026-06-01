# SEO Strategy Document -- Orange Jelly (orangejelly.co.uk)

**Date:** 2026-03-23
**Author:** SEO Strategy Lead Agent
**Status:** Phase 1 -- Strategy & Research

---

## 1. Business Context & Audience

### The Business
Orange Jelly is a pub marketing consultancy run by Peter Pitcher from The Anchor, Stanwell Moor, Staines TW19 6AQ. Founded March 2019. First external client September 2025 -- making it approximately 6 months into commercial consulting. Co-owner Billy Summers runs day-to-day operations at The Anchor.

### Pricing Model
GBP 75/hour plus VAT. No retainers. No lock-in. This is a significant differentiator versus agency competitors who typically charge GBP 1,500-5,000/month on retainers.

### Target Audience
**Primary:** Independent pub licensees and tenants in South East England (Surrey, Berkshire, Buckinghamshire, Hampshire, Hertfordshire, Kent, Oxfordshire, and Greater London) who are struggling with:
- Empty midweek tables
- Low footfall
- Poor margins (food and drink)
- Overwhelming marketing tasks
- Competition from chains (especially Wetherspoons)

**Secondary:** Small pub group operators (2-5 sites) looking for marketing support without agency overhead.

**Audience Intent Profile:**
- Crisis-driven searchers: "my pub is empty", "struggling pub", "pub rescue"
- Tactical searchers: "quiz night ideas", "pub marketing ideas", "how to fill empty pub"
- Solution-aware searchers: "pub marketing agency", "pub marketing consultant"
- Operational searchers: "pub food margins", "menu engineering", "EPOS data"

### Key Credentials
- Greene King tenant (not partner)
- BII member, featured in BII Autumn 2025 magazine for AI innovation
- Proven results: Food GP 58% to 71%, quiz night 20 to 25-35 regulars, 60-70K monthly social views, GBP 75K-100K value added

---

## 2. Current Organic Position Assessment

### Site Technical Foundation
**Strengths:**
- Next.js App Router with server-side rendering -- fast, crawlable, good Core Web Vitals baseline
- Proper robots.txt blocking /api/, /_next/, admin paths
- Dynamic sitemap.ts covering all pages, blog posts, and categories
- Canonical URLs properly set on all pages via `generateMetadata()` utility
- Open Graph and Twitter Card metadata on every page
- Structured data: ProfessionalService, WebSite, BreadcrumbList on root layout
- FAQSchema, ServiceSchema, LocalBusinessSchema, HowToSchema, BlogPostingSchema components available
- hreflang tags (en-GB + x-default) on all pages
- ISR with 60-second revalidation on blog posts

**Weaknesses:**
- No SearchAction schema in WebSite structured data (missed sitelinks search box opportunity)
- Organization schema uses `ProfessionalService` type but also `LocalBusiness` in some components -- inconsistent @type
- No `sameAs` links to social profiles (only links to the-anchor.pub) -- missing Facebook, Instagram, LinkedIn
- Blog posts served under `/licensees-guide/` path -- good for branding but dilutes the "blog" signal for Google
- No internal linking strategy visible in content structure
- SEO overrides exist for only 8 of 61+ published blog posts
- `keywords` meta tag still used (has zero SEO value since 2009, not harmful but signals outdated practice)
- No `lastModified` dates derived from actual content changes -- sitemap uses `new Date().toISOString()` for static pages, making every page appear "just updated" on every build

### Content Foundation
- **61 published blog posts** across 17 categories (some miscategorised -- "Revenue Growth" not matching defined categories)
- **1 pillar page** at `/pub-marketing` -- comprehensive, well-structured, FAQ schema
- **1 agency comparison page** at `/pub-marketing-agency` -- targets commercial keyword
- **8 location pages** (Surrey, London, Berkshire, Buckinghamshire, Hampshire, Hertfordshire, Kent, Oxfordshire)
- **6 solution pages** (services, pub-rescue, fix-my-pub, empty-pub-solutions, quiet-midweek-solutions, compete-with-pub-chains, pub-marketing-no-budget)
- **5 social media service pages** (Facebook, Instagram, paid social, content creation, social media marketing)
- **6 draft posts** not yet published

### Indexation Status
Google `site:orangejelly.co.uk` returned only 4 results in search, which is critically low for a site with 100+ indexable pages. This suggests:
- The site may be very new to Google's index (likely -- domain was probably not actively promoted before late 2025)
- Backlink profile is likely thin
- Domain authority is very low
- OR there is a technical indexation issue that needs investigation (check Google Search Console)

### Current SERP Visibility
Based on the site:search returning only 4 indexed pages, current organic traffic is likely minimal. The indexed pages were:
1. Homepage (with old title "Fill Your Pub with AI-Powered Marketing")
2. Karaoke Night 101
3. How to Run Successful Pub Events
4. How to Compete with Wetherspoons

This tells us Google is picking up some blog content but has not indexed the pillar page, location pages, or service pages yet.

---

## 3. Where the Site Can Realistically Win

### Winnable Territory (6-12 months)

**Tier 1: Long-tail informational keywords (highest volume, lowest competition)**
The 61 blog posts target pub-specific operational and marketing queries. These are low-competition, high-intent queries that larger agencies and publications do not target specifically. Examples: "pub empty tuesday nights", "quiz night ideas for pubs", "how to compete with wetherspoons", "pub food margin ideas".

**Tier 2: Location + service keywords (moderate volume, moderate competition)**
"Pub marketing Surrey", "pub marketing London", etc. These have low but highly qualified search volume. The 8 location pages already target these. Most competitors do not have location-specific pub marketing pages.

**Tier 3: Problem-state keywords (moderate volume, low-moderate competition)**
"My pub is empty", "struggling pub", "pub rescue", "fix my pub". These are crisis-driven, high-intent searches. Orange Jelly has dedicated landing pages for several of these. Competition is mainly from insolvency firms and general hospitality consultancies, not marketing specialists.

**Tier 4: Commercial head terms (lower volume, higher competition)**
"Pub marketing agency", "pub marketing consultant", "pub marketing services". These are the money keywords but also the most competitive. Brew Digital, YesMore, and larger hospitality agencies dominate here currently.

### Realistic Assessment
Orange Jelly is NOT going to outrank Brew Digital (16+ years, award-winning, massive backlink profile) or YesMore (London creative consultancy with enterprise clients) for head terms in the next 6 months. However:

1. **The long-tail is wide open.** No competitor has 61 blog posts specifically about pub operations and marketing. Brew has perhaps 10-15 blog posts on pub topics. SmartPubTools has similar content but is primarily a SaaS product, not a consultancy.

2. **The "licensee who does it" angle is unique.** Every competitor is an agency. Peter is a working licensee. This is a genuine E-E-A-T advantage (Experience, Expertise, Authoritativeness, Trustworthiness) that Google's algorithms explicitly reward.

3. **Location pages have virtually no competition.** Nobody else has "pub marketing [county]" pages with local knowledge.

---

## 4. Priority Ranking (Commercial Impact x Achievability)

| # | Initiative | Commercial Impact | Achievability | Priority |
|---|-----------|-------------------|---------------|----------|
| 1 | Fix indexation -- get all 100+ pages into Google's index | Critical | High | P0 |
| 2 | Strengthen pillar page `/pub-marketing` with internal links from all blog posts | High | High | P1 |
| 3 | Optimise top 20 blog posts for featured snippets and FAQ rich results | High | High | P1 |
| 4 | Build topical authority clusters linking blog posts to service pages | High | Medium | P1 |
| 5 | Enhance location pages with local structured data and unique content depth | Medium | High | P2 |
| 6 | Create missing content for keyword gaps (see opportunity-map.md) | High | Medium | P2 |
| 7 | Build E-E-A-T signals: author page, BII feature link, case study detail | Medium | High | P2 |
| 8 | Technical SEO fixes (sitemap dates, schema consistency, social sameAs) | Medium | High | P2 |
| 9 | Backlink acquisition via BII, trade press, local business directories | High | Low | P3 |
| 10 | Target commercial head terms via `/pub-marketing-agency` page strengthening | High | Low | P3 |

---

## 5. Concrete KPIs and Targets

### 3-Month Targets (by June 2026)
- **Indexed pages:** 100+ (from current ~4)
- **Organic clicks/month:** 500+ (baseline likely <50)
- **Blog posts ranking page 1 for target keyword:** 10+
- **Featured snippets won:** 3+
- **Location pages indexation:** All 8 indexed and appearing in local results

### 6-Month Targets (by September 2026)
- **Organic clicks/month:** 2,000+
- **Blog posts ranking page 1:** 25+
- **Featured snippets:** 8+
- **"Pub marketing" pillar page:** Page 1 (position 5-10)
- **Location pages:** Average position <20 for "[county] pub marketing"
- **Organic leads (WhatsApp clicks from organic):** 10+/month

### 12-Month Targets (by March 2027)
- **Organic clicks/month:** 5,000+
- **Blog posts ranking page 1:** 40+
- **"Pub marketing agency" page:** Page 1 (position 3-7)
- **Domain Rating (Ahrefs):** 20+ (from likely <5)
- **Organic leads:** 25+/month
- **Organic revenue attribution:** GBP 5,000+/month in booked consulting hours

---

## 6. Review Scope for Specialist Agents

### Technical SEO Agent
- Audit and fix Google Search Console indexation issues
- Fix sitemap lastModified dates to use real content modification dates
- Resolve schema @type inconsistency (ProfessionalService vs LocalBusiness)
- Add SearchAction to WebSite schema
- Add social profile sameAs links
- Review and fix any crawl errors, redirect chains, or orphan pages
- Audit Core Web Vitals (LCP, INP, CLS) against targets in CLAUDE.md
- Verify canonical URL implementation across all page types
- Check for duplicate content issues between similar pages (e.g., `/pub-rescue` vs `/empty-pub-solutions` vs `/fix-my-pub`)
- Remove keywords meta tags or replace with more useful meta

### Content SEO Agent
- Audit all 61 published blog posts for: title tag optimisation, meta description quality, heading hierarchy, internal linking, keyword targeting, and content depth
- Identify the top 20 posts with highest ranking potential and create optimisation briefs
- Create content briefs for the keyword gaps identified in opportunity-map.md
- Develop a content calendar for the next 6 months
- Build internal linking map connecting blog posts to pillar page and service pages
- Review and expand the 8 SEO overrides to cover all high-value posts
- Audit category pages for SEO value and recommend consolidation where needed
- Address the 6 draft posts: publish-ready assessment

### On-Page SEO Agent
- Optimise title tags across all pages (many are generic or too long)
- Write compelling meta descriptions for all service and landing pages
- Add FAQ schema to all pages with FAQ content (currently only on pillar page)
- Enhance HowTo schema usage on blog posts with step-by-step content
- Review heading hierarchy on all page types
- Optimise image alt text across the site
- Add internal links from high-authority pages to conversion pages
- Review CTA placement and conversion path from blog to contact

### Local SEO Agent
- Audit and optimise Google Business Profile
- Ensure NAP consistency across directories
- Build local citations in pub/hospitality directories
- Enhance location pages with LocalBusiness schema per county
- Add GeoCoordinates to structured data
- Create or claim listings on relevant platforms (Yell, Thomson Local, Yelp, etc.)
- Review and respond to any existing Google reviews

### Link Building Agent
- Identify backlink opportunities from BII, trade publications, pub industry sites
- Create linkable assets (calculators, templates, downloadable guides)
- Outreach strategy for pub trade press (Morning Advertiser, Pub & Bar Magazine, Caterer Licensee Hotelier)
- HARO/journalist request monitoring for pub/hospitality topics
- Local link building (Surrey business directories, chambers of commerce)
- Guest posting opportunities on hospitality blogs
- Broken link building in the pub/hospitality niche

---

## 7. Strategic Narrative

Orange Jelly's SEO strategy should be built on three pillars:

**1. Own the long-tail through depth of content.** With 61 published posts and a clear content creation capability, the site can dominate the "pub marketing advice" long-tail within 6 months. No competitor has this depth of licensee-written, operationally-tested content. The key is proper indexation, internal linking, and on-page optimisation of existing content before creating new content.

**2. Win local through authenticity.** The location pages plus the "I actually run a pub in Surrey" angle is an E-E-A-T advantage that agencies cannot replicate. Strengthening these pages with genuine local knowledge, local business schema, and Google Business Profile integration will capture the small but highly qualified local search volume.

**3. Build toward commercial terms through topical authority.** Rather than trying to rank for "pub marketing agency" directly, build topical authority by ranking for 40+ long-tail queries, then use internal linking to funnel that authority to the commercial pages. Google rewards sites that demonstrate comprehensive expertise in a topic. 61 posts + 8 location pages + 6 service pages = a topical authority signal that no competitor currently matches in the narrow "pub marketing" niche.

The critical first step is solving the indexation problem. Until Google has crawled and indexed all pages, nothing else matters.
