# Baseline Metrics -- Orange Jelly (orangejelly.co.uk)

**Date:** 2026-03-23
**Purpose:** Referenceable performance baseline for measuring SEO progress
**Next review:** 2026-04-23 (30 days)

---

## Indexation Baseline

| Metric | Value | Source | Date |
|--------|-------|--------|------|
| Pages indexed (site: search) | 4 | Google `site:orangejelly.co.uk` | 2026-03-23 |
| Total indexable pages | ~100+ | Sitemap + content audit | 2026-03-23 |
| Index coverage rate | ~4% | Calculated | 2026-03-23 |
| Published blog posts | 61 | Content directory | 2026-03-23 |
| Draft blog posts | 6 | Content directory | 2026-03-23 |
| Service/landing pages | 22 | Site structure | 2026-03-23 |
| Location pages | 8 | Site structure | 2026-03-23 |

---

## Ranking Baseline

### Confirmed Rankings (Verified via Search)

| Page | Keyword | Position | Est. Monthly Volume |
|------|---------|----------|---------------------|
| /licensees-guide/quiz-night-ideas | "quiz night ideas for pubs" | **#1** | 2,000-5,000 |

### Confirmed Not Ranking (Verified via Search)

| Target Keyword | Est. Monthly Volume | Position |
|---------------|---------------------|----------|
| pub marketing consultant UK | 50-100 | Not in top 100 |
| pub marketing agency UK | 100-200 | Not in top 100 |
| how to market a pub UK | 200-500 | Not in top 100 |
| pub marketing ideas | 1,000-2,000 | Not in top 100 |
| empty pub what to do | 100-200 | Not in top 100 |
| pub marketing ideas low budget | 100-200 | Not in top 100 |

### Pages Indexed by Google (as of 2026-03-23)

| # | URL | Google Title | Correct Title? |
|---|-----|-------------|----------------|
| 1 | / (homepage) | "Fill Your Pub with AI-Powered Marketing" | NO -- stale, current title is different |
| 2 | /licensees-guide/karaoke-night-101 | Karaoke Night 101: Licensee Guide | Yes |
| 3 | /licensees-guide/how-to-run-successful-pub-events | How to Run Successful Pub Events | Yes |
| 4 | /licensees-guide/compete-with-wetherspoons | How to Compete with Wetherspoons | Yes |

---

## Analytics Implementation Baseline

| Component | Deployed? | Functional? | Notes |
|-----------|-----------|-------------|-------|
| Google Tag Manager code | Yes | **No** | Placeholder GTM ID (`GTM-XXXXXXX`) in .env.example |
| GA4 property | Unknown | **No** | No GA4 measurement ID found in codebase |
| Google Search Console | Unknown | **Unlikely** | Only 4 indexed pages suggests no sitemap submission |
| Web Vitals (code) | Yes | Partial | Pushes to dataLayer but GTM not configured |
| @vercel/analytics | **No** | N/A | Not in package.json |
| @vercel/speed-insights | **No** | N/A | Not in package.json |
| Cookie consent banner | Yes | **Broken** | Does not actually gate GTM loading |
| Microsoft Clarity | **No** | N/A | Preconnect hint exists but no script |
| Conversion tracking | **No** | N/A | No events for WhatsApp, forms, phone |

---

## Traffic Baseline (Estimated)

Without functioning analytics, these are estimates based on ranking data:

| Metric | Estimated Value | Confidence | Basis |
|--------|----------------|------------|-------|
| Organic clicks/month | 50-200 | Low | Only 1 confirmed ranking (#1 quiz night) + 3 other indexed pages |
| Organic impressions/month | 500-2,000 | Low | Estimated from quiz night volume + brand searches |
| Direct traffic/month | Unknown | N/A | No analytics |
| Referral traffic/month | Unknown | N/A | No analytics |
| Social traffic/month | Unknown | N/A | No analytics; 60-70K monthly social views claimed |
| Organic leads/month | 0-2 | Low | No conversion tracking in place |

---

## Domain Authority Baseline

| Metric | Estimated Value | Notes |
|--------|----------------|-------|
| Domain Rating (Ahrefs-equivalent) | <5 | New domain, minimal backlinks expected |
| Referring domains | <10 | Likely only the-anchor.pub and a few directories |
| Backlinks total | <50 | No link building campaign run |
| Domain age (active SEO) | ~6 months | First external client Sep 2025, content likely accelerated late 2025 |

*Note: These are estimates. Run a free Ahrefs or Moz audit to verify.*

---

## Content Baseline

| Metric | Value |
|--------|-------|
| Total published blog posts | 61 |
| Posts with SEO overrides (title/meta) | 8 of 61 (13%) |
| Posts with FAQ schema | ~1 (pillar page only) |
| Posts with HowTo schema | 0 confirmed |
| Keyword clusters covered | 14 |
| Keywords with existing content | ~95 (79% of 120 mapped) |
| Content gaps identified | ~25 keywords (21%) |
| Average post length | 1,500-3,000 words (per CLAUDE.md guidelines) |
| Content publishing cadence | Weekly (when active) |

---

## Technical Performance Baseline

| Metric | Target | Current (Code-based estimate) | Notes |
|--------|--------|-------------------------------|-------|
| LCP | < 2.5s | Likely good (Next.js SSR + image optimisation) | No field data available |
| INP | < 200ms | Likely good (server components default) | No field data available |
| CLS | < 0.1 | Likely good (font swap + image dimensions set) | No field data available |
| TTFB | < 600ms | Likely good (Vercel edge + ISR) | No field data available |

*Note: These are code-based estimates. Actual field data requires @vercel/speed-insights or GSC Core Web Vitals report.*

---

## Competitive Position Baseline

| Metric | Orange Jelly | Best Competitor |
|--------|-------------|-----------------|
| Content depth (pub-specific posts) | 61 | Brew: 15-30, SmartPubTools: 10-20 |
| Location pages | 8 counties | None (zero competitors) |
| Domain authority | <5 | Brew: 40-50, Premierline: 50-60 |
| Pub operator credibility | Yes (The Anchor) | SmartPubTools only |
| Pricing transparency | GBP 75/hr visible | Most hidden |
| Crisis content pages | 3 (fix-my-pub, pub-rescue, empty-pub-solutions) | Hotel & Pub Rescue: 1 |
| AI positioning | BII featured | SmartPubTools (SaaS tool) |

---

## Targets (for tracking against this baseline)

### 30-Day Targets (by 2026-04-23)

- [ ] Google Search Console set up and verified
- [ ] GA4 property created and collecting data
- [ ] @vercel/analytics installed and reporting
- [ ] Sitemap submitted to GSC
- [ ] Top 20 pages submitted for indexing via URL Inspection
- [ ] Indexed pages: 20+ (up from 4)
- [ ] Conversion events configured: WhatsApp click, contact form, phone click

### 90-Day Targets (by 2026-06-23)

- [ ] Indexed pages: 100+ (up from 4)
- [ ] Organic clicks/month: 500+ (up from ~50-200)
- [ ] Page 1 rankings: 10+ (up from 1)
- [ ] Featured snippets: 3+
- [ ] Organic leads/month: 5+ (measurable)
- [ ] All 8 location pages indexed

### 180-Day Targets (by 2026-09-23)

- [ ] Organic clicks/month: 2,000+
- [ ] Page 1 rankings: 25+
- [ ] Featured snippets: 8+
- [ ] Pillar page (/pub-marketing): Page 1 for "pub marketing"
- [ ] Organic leads/month: 10+
- [ ] Domain Rating: 10+

### 365-Day Targets (by 2027-03-23)

- [ ] Organic clicks/month: 5,000+
- [ ] Page 1 rankings: 40+
- [ ] /pub-marketing-agency: Page 1 for "pub marketing agency"
- [ ] Domain Rating: 20+
- [ ] Organic leads/month: 25+
- [ ] Organic revenue attribution: GBP 5,000+/month

---

## How to Update This Baseline

1. **Weekly:** Check GSC for indexed page count, new rankings, crawl errors
2. **Monthly:** Update ranking positions for all tracked keywords; record organic clicks, impressions, CTR
3. **Quarterly:** Full baseline refresh -- update all tables, compare against targets, adjust projections
4. **On milestone:** Record date and metric when any target is achieved

---

*This baseline was established without access to Google Search Console, GA4, or any third-party SEO tool. All ranking data is from manual web searches. All traffic estimates are modelled from keyword volume data and assumed click-through rates. Update this document as real data becomes available.*
