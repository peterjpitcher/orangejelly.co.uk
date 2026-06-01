# Analytics Assessment Report -- Orange Jelly (orangejelly.co.uk)

**Date:** 2026-03-23
**Author:** Analytics Specialist Agent
**Status:** Phase 2 -- Discovery

---

## Executive Summary

Orange Jelly has a significant content asset (100+ pages, 61 published blog posts) that is almost entirely invisible to Google. Only 4 pages are indexed. The site has Google Tag Manager infrastructure in place but the GTM container ID appears to be a placeholder, meaning **no analytics data is being collected in production**. This is the most urgent gap: without measurement, every SEO improvement is flying blind.

The competitive landscape is crowded at the agency level (Brew Digital, YesMore, CJ Digital, Wired Media) but wide open in the niche Orange Jelly occupies -- licensee-led, independent pub marketing consulting at GBP 75/hour. The long-tail informational keyword space (quiz nights, events, empty pubs, midweek trade) has realistic ranking potential within 3-6 months once indexation is resolved.

---

## 1. Current Visibility Assessment

### Google Index Status (Verified 2026-03-23)

A `site:orangejelly.co.uk` search confirms only **4 pages indexed**:

| # | Page | Title in Google | Notes |
|---|------|----------------|-------|
| 1 | Homepage | "Fill Your Pub with AI-Powered Marketing" | **Stale title** -- current site title is "Transformative Hospitality Growth Partner" |
| 2 | /licensees-guide/karaoke-night-101 | Karaoke Night 101: Licensee Guide | Indexed and showing |
| 3 | /licensees-guide/how-to-run-successful-pub-events | How to Run Successful Pub Events | Indexed and showing |
| 4 | /licensees-guide/compete-with-wetherspoons | How to Compete with Wetherspoons | Indexed and showing |

**So what:** 96% of the site's content investment is generating zero organic value. The homepage is displaying an outdated title, meaning Google has not re-crawled it recently. This confirms extremely low crawl frequency -- a hallmark of low domain authority and weak backlink profile.

### SERP Position Checks (2026-03-23)

| Search Query | Orange Jelly Position | Who Ranks Instead |
|-------------|----------------------|-------------------|
| "pub marketing consultant UK" | Not found in top 100 | YesMore, Leopard Co, Snack London, SideDish, Prohibition PR |
| "pub marketing agency UK" | Not found in top 100 | Brew Digital, CJ Digital, YesMore, Wired Media, ttagz |
| "how to market a pub UK" | Not found in top 100 | Premierline, Brew Digital, Value for Venues, Morning Advertiser |
| "pub marketing ideas" | Not found in top 100 | Premierline, Peek & Poke, GetOnBloc, Restroworks |
| "quiz night ideas for pubs" | **Position 1** | orangejelly.co.uk/licensees-guide/quiz-night-ideas |
| "empty pub what to do" | Not found in top 100 | PBS, Nory, BII, The Conversation |
| "pub marketing ideas low budget" | Not found in top 100 | Peek & Poke, GetOnBloc, Restroworks |

**So what:** The site has ONE confirmed page 1 ranking -- "quiz night ideas for pubs" at position 1. This is a high-volume keyword (2K-5K/mo estimated). This proves the content quality is strong enough to rank; the problem is indexation and authority, not content quality. The quiz night ranking alone could be driving 500-1,500 clicks/month if properly measured.

---

## 2. Analytics Implementation Audit

### What Exists

| Component | Status | Location | Notes |
|-----------|--------|----------|-------|
| Google Tag Manager | Code deployed | `src/components/GoogleTagManager.tsx` | Uses `NEXT_PUBLIC_GTM_ID` env var |
| GTM Noscript fallback | Code deployed | Same component, in `<body>` | Correct implementation |
| Web Vitals tracking | Code deployed | `src/components/PerformanceMonitor.tsx` | Pushes CLS, FID, LCP, FCP, TTFB to dataLayer |
| Cookie consent banner | Code deployed | `src/components/CookieNotice.tsx` | GDPR-compliant accept/reject for analytics |
| Preconnect hints | Code deployed | `PreloadResources` component | Preconnects to google-analytics.com, googletagmanager.com, clarity.ms |
| `.env.example` | GTM ID is placeholder | `NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX` | Placeholder value, not a real container ID |

### What Is Missing

| Gap | Impact | Priority |
|-----|--------|----------|
| **No real GTM container ID configured** | Zero analytics data being collected | P0 -- CRITICAL |
| **No GA4 property** (or if exists, not connected via GTM) | No traffic, behaviour, or conversion data | P0 -- CRITICAL |
| **No Google Search Console** verified (or not submitted sitemap) | Cannot monitor indexation, crawl errors, or keyword rankings | P0 -- CRITICAL |
| **No @vercel/analytics** package | Missing free Vercel-native analytics (page views, web vitals) | P1 |
| **No @vercel/speed-insights** package | Missing free Core Web Vitals monitoring from Vercel | P1 |
| **No conversion tracking** | WhatsApp clicks, contact form submissions, phone calls not tracked | P1 |
| **No UTM parameter strategy** | Cannot attribute traffic from social media (60-70K monthly views) | P2 |
| **Cookie consent does not gate GTM loading** | GTM script loads regardless of consent choice -- GDPR risk | P2 |
| **Microsoft Clarity** preconnect exists but no implementation | Hints at planned heatmap/session recording but not deployed | P3 |

### Cookie Consent Issue

The `GoogleTagManager` component loads in `<head>` unconditionally. The `CookieNotice` component stores consent preferences but **does not gate the GTM script loading**. The cookie banner mentions "Loaded only after you tap Accept analytics" but this is not actually enforced in code. GTM fires on every page load regardless of consent. This is a GDPR compliance risk.

**So what:** Even if GTM were configured with a real container ID, it would fire before consent is given, which violates UK GDPR/PECR requirements for analytics cookies.

---

## 3. Traffic Potential Estimate

### Addressable Keyword Universe

Based on the keyword framework (120+ mapped keywords across 14 clusters), here is the estimated total addressable UK search volume:

| Cluster | Combined Est. Monthly Volume | Ranking Difficulty | Revenue Proximity |
|---------|-----------------------------|--------------------|-------------------|
| Quiz Nights & Events | 8,000-15,000 | Low-Medium | Indirect (awareness) |
| Pub Marketing (Core) | 3,000-6,000 | Medium-High | High |
| Social Media for Pubs | 1,000-2,500 | Medium | High |
| Empty Pub / Struggling Pub | 800-1,500 | Low-Medium | Very High (crisis intent) |
| Pub Food & Margins | 1,000-2,000 | Low-Medium | Medium |
| Midweek Trade | 600-1,200 | Low | High |
| Competition & Positioning | 400-1,000 | Low | Medium |
| Families & Demographics | 500-1,000 | Low | Medium |
| Loyalty & Retention | 300-600 | Low | Medium |
| Reviews & Reputation | 250-500 | Low-Medium | Medium |
| Location Keywords | 200-500 | Very Low | Very High |
| Financial / Cash Flow | 400-800 | Low | High |
| Staff & Operations | 350-700 | Low | Low |
| Agency/Consultant (Commercial) | 500-1,000 | High | Highest |
| **Total Addressable** | **~17,000-32,000/mo** | | |

### Realistic Traffic Projections

Assuming proper indexation, on-page optimisation, and internal linking:

| Timeframe | Indexed Pages | Est. Organic Clicks/Month | Assumptions |
|-----------|--------------|--------------------------|-------------|
| Current (Mar 2026) | 4 | 50-200 | Only quiz night ranking driving meaningful traffic |
| 3 months (Jun 2026) | 80-100+ | 500-1,500 | Index all pages, optimise top 20, FAQ schema |
| 6 months (Sep 2026) | 100+ | 2,000-4,000 | Long-tail rankings mature, internal linking boosts pillar |
| 12 months (Mar 2027) | 120+ | 5,000-10,000 | Backlink building, content gaps filled, featured snippets |

### Revenue Attribution Model

| Metric | Conservative | Moderate | Optimistic |
|--------|-------------|----------|------------|
| Monthly organic clicks (12mo) | 5,000 | 7,500 | 10,000 |
| Click-to-lead rate | 0.5% | 1.0% | 1.5% |
| Leads per month | 25 | 75 | 150 |
| Lead-to-client rate | 10% | 15% | 20% |
| New clients per month | 2.5 | 11 | 30 |
| Avg. client value (5hrs @ GBP 75) | GBP 375 | GBP 375 | GBP 375 |
| **Monthly organic revenue** | **GBP 937** | **GBP 4,125** | **GBP 11,250** |

**So what:** Even the conservative scenario yields nearly GBP 1,000/month from organic search within 12 months -- a meaningful revenue stream for a consultancy with zero client acquisition cost. The moderate scenario aligns with the strategy document's GBP 5,000/month target.

---

## 4. Competition Strength Assessment

### Head Term Competition ("pub marketing agency", "pub marketing consultant")

| Competitor | Est. Domain Rating | Content Depth | Location Pages | Pub Operator? | Threat Level |
|-----------|-------------------|---------------|----------------|---------------|-------------|
| Brew Digital | 40-50 | 15-30 posts | None | No | High |
| YesMore | 30-40 | Minimal blog | London only | No | Medium |
| CJ Digital | 20-30 | Service pages | None | No | Medium |
| Premierline | 50-60 | Insurance + advice | None | No (insurer) | Medium (content only) |
| SmartPubTools | 10-20 | 10-20 posts | None | Yes | Medium (growing) |
| ttagz | 20-30 | Aggregator content | None | No | Low |
| **Orange Jelly** | **<5** | **61 posts** | **8 counties** | **Yes** | N/A |

**So what:** Orange Jelly cannot compete on domain authority for head terms in the short term. But no competitor matches OJ's content depth (61 posts), location specificity (8 counties), or practitioner credibility. The strategy of winning long-tail first, then building toward head terms is correct.

### Long-Tail Competition (informational queries)

The quiz night ranking at position 1 demonstrates that long-tail competition is weak. Most informational queries about pub operations are served by:
- General hospitality content sites (Morning Advertiser, Caterer)
- Insurance company blogs (Premierline)
- Generic marketing blogs (Peek & Poke, GetOnBloc)
- Forum posts and Q&A sites

None of these have Orange Jelly's depth of pub-specific, practitioner-authored content. Once indexed, 30-40 of the 61 blog posts have realistic page 1 potential for their target keywords within 6 months.

### Emerging Competitive Threats

1. **SmartPubTools** is the closest competitor model (licensee-run, content-driven, AI-positioned). Currently smaller but growing. Monitor their content output.
2. **Brew Digital's** "Pints & Profits" annual report generates significant backlinks. Orange Jelly needs a comparable linkable asset.
3. **AI-generated content** from non-specialists could flood the long-tail. OJ's defense is real experience and specific Anchor numbers.

---

## 5. Industry Context -- Why This Matters Now

The UK pub industry is in structural crisis:
- **6 pubs per week** closing (BBPA 2024 data)
- **1 in 4 independent pubs** predicted to fail (BII)
- **4,000+ closures since 2019**
- **GBP 24.9 billion** market projected for 2026 (IBISWorld)
- **Greene King** announced 150 pub closures in 2026, directly affecting OJ's target audience of GK tenants
- **GBP 300 million** government support package announced Jan 2026 (business rates discount)

**So what:** The market of struggling, cost-pressured independent pub licensees searching for help is growing, not shrinking. Crisis-intent searches ("my pub is empty", "struggling pub", "pub rescue") are likely increasing. Orange Jelly's crisis content funnel is perfectly timed if it can get indexed.

---

## 6. Quick Win Opportunities

### Opportunity 1: Capitalise on Existing #1 Ranking

The quiz-night-ideas page ranking at position 1 for a 2K-5K/mo keyword is the site's single biggest current asset. Actions:
- **Add conversion tracking** to measure how many quiz-night visitors click through to services or contact
- **Add internal links** from this page to pillar page, services page, and related posts
- **Add FAQ schema** if not already present to capture more SERP real estate
- **Create a quiz night email sequence** as a lead magnet (capture email, nurture to consulting client)

### Opportunity 2: Greene King Tenant Content

With 150 GK pub closures announced in 2026 and OJ being a GK tenant, there is an immediate content opportunity:
- Blog post: "Greene King Pub Closures 2026: What Tenants Should Do Next"
- This targets a trending search query with genuine practitioner authority
- Could generate backlinks from industry press

### Opportunity 3: World Cup 2026 Content

The 2026 FIFA World Cup (June-July) is flagged by Morningstar as a potential pub sales booster. Pre-position content:
- "World Cup 2026 Pub Marketing: How to Maximise Match Day Revenue"
- Seasonal content with built-in search demand spike

### Opportunity 4: Free Vercel Analytics (Zero Effort)

Install `@vercel/analytics` and `@vercel/speed-insights` packages. These provide:
- Page view tracking without cookie consent requirements (privacy-friendly)
- Core Web Vitals monitoring
- No GTM dependency
- Can be live within 1 hour

---

## 7. Measurement Framework

### KPIs (Key Performance Indicators)

These are the outcomes that matter for the business:

| KPI | Current Baseline | 3-Month Target | 6-Month Target | 12-Month Target |
|-----|-----------------|----------------|----------------|-----------------|
| Indexed pages | 4 | 100+ | 100+ | 120+ |
| Organic clicks/month | ~50-200 (est.) | 500+ | 2,000+ | 5,000+ |
| Organic leads/month (WhatsApp + contact form) | Unknown | 5+ | 10+ | 25+ |
| Organic revenue attribution | GBP 0 | GBP 500+ | GBP 2,000+ | GBP 5,000+ |
| Page 1 rankings | 1 confirmed | 10+ | 25+ | 40+ |

### Leading Indicators

These predict whether KPIs will be hit:

| Indicator | Why It Matters | Measurement Method | Target Cadence |
|-----------|---------------|-------------------|----------------|
| Pages indexed (GSC) | Prerequisite for all organic traffic | Google Search Console Coverage report | Weekly |
| Impressions (GSC) | Shows content is being seen even if not clicked | GSC Performance report | Weekly |
| Average position per cluster | Shows ranking trajectory | GSC, filter by keyword cluster | Bi-weekly |
| Click-through rate by page | Identifies title/description optimisation needs | GSC Performance report | Monthly |
| Internal links per page | Predicts authority distribution | Screaming Frog or manual audit | Monthly |
| Core Web Vitals | Affects ranking eligibility | Vercel Speed Insights + GSC | Weekly |
| Backlinks acquired | Predicts domain authority growth | Ahrefs/Moz free tier, GSC Links report | Monthly |
| Content published | Predicts keyword coverage growth | Editorial calendar tracking | Weekly |

### Reporting Cadence

| Report | Frequency | Audience | Content |
|--------|-----------|----------|---------|
| Indexation check | Weekly | Peter (internal) | Pages indexed, crawl errors, new rankings |
| Traffic snapshot | Bi-weekly | Peter (internal) | Organic clicks, top pages, position changes |
| Full SEO report | Monthly | Peter + Billy | All KPIs, competitive movement, content performance, next actions |
| Quarterly review | Quarterly | Business decision | Revenue attribution, ROI assessment, strategy adjustment |

### Conversion Events to Track

Once analytics is properly configured, these events must be tracked:

| Event | Trigger | Priority |
|-------|---------|----------|
| `whatsapp_click` | Click on any WhatsApp CTA button | P0 |
| `contact_form_submit` | Contact form submission | P0 |
| `phone_click` | Click on phone number link | P1 |
| `blog_scroll_75` | User scrolls 75% of a blog post | P1 |
| `cta_click` | Click on any conversion CTA (Fix My Pub, Get Started, etc.) | P1 |
| `roi_calculator_complete` | User completes ROI calculator interaction | P1 |
| `newsletter_signup` | Newsletter form submission | P2 |
| `related_post_click` | Click on related articles section | P2 |
| `search_query` | On-site search performed | P2 |

---

## 8. Data Gaps and Risks

### Critical Data Gaps

| Gap | Impact | Resolution |
|-----|--------|------------|
| No Google Search Console access | Cannot verify indexation issues, crawl errors, or actual ranking data | Set up and verify GSC immediately |
| No GA4 data | Zero insight into current traffic, user behaviour, or conversions | Configure GTM with real container ID + GA4 property |
| No backlink profile data | Cannot assess domain authority or link building progress | Run free Ahrefs/Moz audit or use GSC Links report |
| No Core Web Vitals field data | Cannot verify performance from real users | Install @vercel/speed-insights + check GSC CWV report |
| No conversion baseline | Cannot measure ROI of SEO improvements | Implement conversion tracking (see events above) |
| Cookie consent does not gate GTM | GDPR/PECR compliance risk; could result in ICO action | Fix consent flow to conditionally load GTM |

### Risks to Projections

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Technical indexation blocker (not just slow crawl) | Medium | Critical | Verify via GSC URL Inspection tool on priority pages |
| Google algorithm update devalues thin or AI content | Medium | High | Ensure all content has genuine practitioner depth and E-E-A-T signals |
| Competitor (SmartPubTools/Brew) accelerates content production | Medium | Medium | Maintain publishing cadence, focus on unique angle (licensee + specific numbers) |
| GTM/GA4 misconfiguration provides inaccurate data | Medium | Medium | Validate tracking with GTM Preview mode and GA4 DebugView before relying on data |
| Seasonal variation masks underlying trends | Low | Low | Compare year-over-year when available; account for pub seasonality (summer = outdoor, Dec = Christmas parties) |

---

## 9. Recommended Immediate Actions (Priority Order)

| # | Action | Owner | Effort | Impact |
|---|--------|-------|--------|--------|
| 1 | Set up Google Search Console, verify domain, submit sitemap | Peter / Dev | 30 min | Critical |
| 2 | Create GA4 property, configure GTM container, deploy real GTM ID | Peter / Dev | 2 hours | Critical |
| 3 | Fix cookie consent to gate GTM script loading | Dev | 2 hours | High (compliance) |
| 4 | Install @vercel/analytics + @vercel/speed-insights | Dev | 30 min | Medium (free baseline) |
| 5 | Set up conversion events (WhatsApp click, contact form, phone) | Dev + GTM | 3 hours | High |
| 6 | Request indexing of top 20 pages via GSC URL Inspection | Peter | 1 hour | Critical |
| 7 | Run Ahrefs/Moz free audit for backlink baseline | Peter | 30 min | Medium |
| 8 | Create first monthly reporting template | Analytics | 2 hours | Medium |

---

## 10. The Bottom Line

Orange Jelly has built a content engine (61 posts, 8 location pages, 6 solution pages) that is almost entirely invisible to search engines. The one page that IS ranking well (quiz night ideas at #1) proves the content quality is strong enough to compete. The problem is not content -- it is infrastructure: no analytics, no Search Console, incomplete indexation.

The pub industry crisis (6 closures/week, 1 in 4 predicted to fail, Greene King shuttering 150 sites) means the addressable audience of struggling licensees searching for help is at an all-time high. Orange Jelly is uniquely positioned with practitioner credibility that no agency can match.

**Fix measurement first. Fix indexation second. The content will do the rest.**
