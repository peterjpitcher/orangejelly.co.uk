# Implementation Estimates -- orangejelly.co.uk SEO Overhaul

**Date:** 2026-03-23
**Author:** Web Developer Analyst
**Status:** Phase 4 -- Feasibility Assessment

---

## Effort Tiers Overview

| Tier | Label | Total Effort | Impact | When |
|------|-------|-------------|--------|------|
| 1 | Quick Wins (P0) | 12-18 hours | Critical -- fixes indexation | Week 1 |
| 2 | High-Value Fixes (P1) | 14-22 hours | High -- improves rankings + conversions | Weeks 2-3 |
| 3 | Optimisation (P2) | 20-32 hours | Medium -- strengthens authority + UX | Weeks 4-6 |
| 4 | Scale & Polish (P3) | 24-40 hours | Medium-Low -- comprehensive coverage | Weeks 7-12 |
| **Total** | | **70-112 hours** | | **12 weeks** |

---

## Tier 1: Quick Wins (Week 1) -- 12-18 hours

These are the highest-leverage changes. They directly address the root cause of low indexation (missing internal links from homepage) and fix critical content/schema issues.

### Batch 1A: Homepage Internal Linking (4-6 hours)

| # | Task | Files | Effort | Dependencies |
|---|------|-------|--------|-------------|
| 1 | Add "Latest Pub Marketing Guides" section with 6-9 recent blog post cards | `src/app/HomePage.tsx` | 2-3 hrs | Import getAllPosts from blog lib, render grid |
| 2 | Add "Areas We Cover" section with 8 location page links | `src/app/HomePage.tsx` | 1 hr | None -- hardcode location array |
| 3 | Expand ProblemCards to link all 6 solution pages (not just quiet-midweek) | `src/app/HomePage.tsx` or `ProblemCardsSection.tsx` | 1-2 hrs | None |

**Verification:** Build succeeds, homepage renders all new sections, all links resolve to 200 status.

### Batch 1B: Location Page Cross-Linking (2-3 hours)

| # | Task | Files | Effort | Dependencies |
|---|------|-------|--------|-------------|
| 4 | Add "Also Serving" section to PubMarketingLocationLandingPage component | `src/components/PubMarketingLocationLandingPage.tsx` | 1.5 hrs | Add `currentSlug` prop |
| 5 | Pass currentSlug from each location page to the component | 8 page files (`src/app/pub-marketing-*/page.tsx`) | 30 min | Task 4 |
| 6 | Link pillar page /pub-marketing to all 8 location pages | `src/app/pub-marketing/page.tsx` | 30 min | None |

**Verification:** Each location page shows 7 cross-links. Pillar page links to all 8 locations.

### Batch 1C: Critical Metadata Rewrites (2-3 hours)

| # | Task | Files | Effort | Dependencies |
|---|------|-------|--------|-------------|
| 7 | Rewrite homepage title to include "pub marketing" | `src/app/page.tsx` | 15 min | None |
| 8 | Rewrite homepage H1 and subtitle to use pub pain language | `src/app/HomePage.tsx` (hero data object) | 30 min | None |
| 9 | Rewrite services page title/description | `src/app/services/page.tsx` | 15 min | None |
| 10 | Rewrite results page title/description | `src/app/results/page.tsx` | 15 min | None |
| 11 | Rewrite all 8 location page titles | 8 files `src/app/pub-marketing-*/page.tsx` | 1 hr | None |

**Verification:** Build succeeds, spot-check 3 pages for correct title rendering in browser tab.

### Batch 1D: Schema Quick Fixes (2-3 hours)

| # | Task | Files | Effort | Dependencies |
|---|------|-------|--------|-------------|
| 12 | Add SearchAction to WebSite schema | `src/app/layout.tsx` (~line 138) | 30 min | Determine search URL pattern |
| 13 | Add social profile URLs to sameAs | `src/app/layout.tsx` (~line 135) | 15 min | Need actual URLs from Peter |
| 14 | Add GeoCoordinates for The Anchor | `src/app/layout.tsx` (organizationSchema) | 15 min | None -- coords are public |
| 15 | Remove duplicate BlogPostingSchema from blog posts | `src/app/licensees-guide/[slug]/page.tsx` (~line 654) | 15 min | Verify EnhancedBlogSchema covers all fields |
| 16 | Remove duplicate BreadcrumbList from blog posts | `src/app/licensees-guide/[slug]/page.tsx` | 15 min | Depends on #15 |
| 17 | Remove self-review schema from Results page | `src/app/results/page.tsx` (~line 114-134) | 15 min | None |
| 18 | Fix HowTo estimatedCost (499 -> remove or 75) | `src/app/empty-pub-solutions/page.tsx` | 5 min | None |

**Verification:** Run Google Rich Results Test on homepage, a blog post, and results page.

### Batch 1E: Critical Content Fixes (1-2 hours)

| # | Task | Files | Effort | Dependencies |
|---|------|-------|--------|-------------|
| 19 | Re-enable disabled FAQ/content sections on quiet-midweek-solutions | `src/app/quiet-midweek-solutions/page.tsx` (3 locations) | 15 min | Visual check that content renders correctly |
| 20 | Fix "bought" to "took on" in why-is-my-pub-empty | `content/blog/why-is-my-pub-empty.md` | 5 min | None |
| 21 | Fix US spelling "modernizes" to "modernises" | `src/app/HomePage.tsx` or component | 5 min | None |
| 22 | Update 2024 year references to evergreen phrasing | 3 blog markdown files | 15 min | None |

**Verification:** Build succeeds, spot-check quiet-midweek page.

---

## Tier 2: High-Value Fixes (Weeks 2-3) -- 14-22 hours

### Batch 2A: SEO Overrides for Priority Blog Posts (3-4 hours)

| # | Task | Files | Effort | Dependencies |
|---|------|-------|--------|-------------|
| 23 | Add SEO overrides for top 20 blog posts | `src/lib/seo-overrides.ts` | 3-4 hrs | Recommended titles from copywriter report |

Posts to prioritise (in order):
1. quiz-night-ideas
2. compete-with-wetherspoons
3. how-to-run-successful-pub-events
4. fill-empty-pub-tables
5. why-is-my-pub-empty
6. midweek-pub-offers-that-work
7. low-budget-pub-marketing-ideas
8. content-marketing-ideas-pubs
9. instagram-marketing-for-pubs
10. christmas-pub-promotion-ideas
11. seasonal-pub-events-calendar
12. turnaround-playbook-independent-bars
13. revenue-levers-struggling-pubs
14. menu-engineering-lift-average-spend
15. pub-differentiation-strategies
16. attract-families-to-pub
17. pub-health-check
18. karaoke-night-101 (already has override -- review)
19. beat-chain-pubs
20. email-marketing-pub-retention

**Verification:** Build succeeds, spot-check 5 posts for correct title/description in page source.

### Batch 2B: Sitemap & Technical SEO (2-3 hours)

| # | Task | Files | Effort | Dependencies |
|---|------|-------|--------|-------------|
| 24 | Fix sitemap lastModified dates for static pages | `src/app/sitemap.ts` | 1-2 hrs | None |
| 25 | Fix naked domain 307 redirect | Vercel Dashboard | 15 min | Vercel access |
| 26 | Remove keywords meta tag from metadata utility | `src/lib/metadata.ts` | 15 min | None |
| 27 | Remove keywords props from all page files | ~20 page files | 30 min | Task 26 |

**Verification:** Check sitemap.xml in browser for varied dates. Test naked domain redirect with curl. Build succeeds after keywords removal.

### Batch 2C: Conversion Improvements (4-6 hours)

| # | Task | Files | Effort | Dependencies |
|---|------|-------|--------|-------------|
| 28 | Render ContactForm on contact page | `src/app/contact/ContactPage.tsx` | 30 min | Task 29 |
| 29 | Create server action for contact form submission | New: `src/app/actions/contact.ts` | 2-3 hrs | Need email/storage solution |
| 30 | Add StickyCTA to 5 solution pages | 5 page files | 1.5 hrs | None |
| 31 | Add StickyCTA to location page component | `src/components/PubMarketingLocationLandingPage.tsx` | 30 min | None |

**Verification:** Submit test form, verify submission is received. Check sticky CTA appears on solution/location pages.

### Batch 2D: Analytics Setup (2-4 hours)

| # | Task | Files | Effort | Dependencies |
|---|------|-------|--------|-------------|
| 32 | Install @vercel/analytics and @vercel/speed-insights | `package.json`, `src/app/layout.tsx` | 30 min | None |
| 33 | Set real GTM container ID in Vercel env vars | Vercel Dashboard + `.env` | 15 min | GTM container created |
| 34 | Fix cookie consent to gate GTM loading | `src/components/GoogleTagManager.tsx`, `src/components/CookieNotice.tsx` | 2-3 hrs | None |

**Verification:** Vercel Analytics dashboard shows data. GTM Preview mode shows tags firing only after consent.

### Batch 2E: Footer & Navigation Enhancement (2-3 hours)

| # | Task | Files | Effort | Dependencies |
|---|------|-------|--------|-------------|
| 35 | Add location pages to footer | `content/data/footer.json`, `src/components/FooterSimple.tsx` | 1.5-2 hrs | May need 4th footer column |
| 36 | Add solution pages to footer | `content/data/footer.json` | 30 min | Task 35 |
| 37 | Reduce contact page FAQs from 12 to 5 | `src/app/contact/ContactPage.tsx` or contact data | 30 min | None |

**Verification:** Footer renders correctly on desktop and mobile with new links.

---

## Tier 3: Optimisation (Weeks 4-6) -- 20-32 hours

### Batch 3A: Content Consistency (3-5 hours)

| # | Task | Files | Effort | Dependencies |
|---|------|-------|--------|-------------|
| 38 | Standardise quiz metric across all files | ~12 files | 1-2 hrs | BLOCKED: Peter confirms number |
| 39 | Remove explicit food GP percentages per claims audit | 6 files | 1 hr | BLOCKED: Peter confirms wording |
| 40 | Standardise "GBP 4,000+" label as cost savings | `src/lib/constants.ts` + pages | 30 min | None |
| 41 | Fix localSEO metadata in 3 blog posts | 3 markdown files | 15 min | None |

### Batch 3B: Internal Linking in Top 15 Blog Posts (6-10 hours)

| # | Task | Files | Effort | Dependencies |
|---|------|-------|--------|-------------|
| 42 | Add 3-5 contextual internal links to each of the top 15 blog posts | 15 markdown files | 6-10 hrs | Linking map from copywriter report |

Prioritise posts that are already indexed or ranking:
1. quiz-night-ideas -> link to quiz-night-101, services, fix-my-pub
2. compete-with-wetherspoons -> link to compete-with-pub-chains, pub-marketing-agency
3. how-to-run-successful-pub-events -> link to quiz-night-ideas, summer-pub-event-ideas, services
4. karaoke-night-101 -> link to services, how-to-run-successful-pub-events
5-15. Continue with highest-ranking-potential posts

**80/20 Alternative:** Add a "Related Guides" component to the blog post template that auto-generates links based on category. One component change covers all 66 posts with category-matched links. Estimated 3-4 hours instead of 6-10.

### Batch 3C: Image Optimisation (4-6 hours)

| # | Task | Files | Effort | Dependencies |
|---|------|-------|--------|-------------|
| 43 | Write and run batch PNG-to-WebP conversion script | `/public/images/blog/` | 3-4 hrs | Install sharp |
| 44 | Update any hardcoded PNG references in code | `src/lib/blog-images.ts` + markdown files | 1-2 hrs | Task 43 |

**80/20 Alternative:** Only convert the 10 largest PNGs (>1MB). Let Next.js Image handle the rest at runtime. Estimated 1 hour instead of 4-6.

### Batch 3D: Homepage Reordering & Trust Signals (3-4 hours)

| # | Task | Files | Effort | Dependencies |
|---|------|-------|--------|-------------|
| 45 | Reorder homepage sections (Problems up, Features down) | `src/app/HomePage.tsx` | 1 hr | None |
| 46 | Revise TrustBar items to show metrics not features | `src/app/HomePage.tsx` or TrustBar component | 1 hr | None |
| 47 | Add trust micro-copy next to WhatsApp CTAs site-wide | `src/components/WhatsAppButton.tsx` | 1-2 hrs | None |

### Batch 3E: Advanced Schema (3-4 hours)

| # | Task | Files | Effort | Dependencies |
|---|------|-------|--------|-------------|
| 48 | Add LocalBusiness schema with areaServed to each location page | `src/components/PubMarketingLocationLandingPage.tsx` | 2-3 hrs | County geocoordinates |
| 49 | Add FAQ schema to fix-my-pub (if FAQs exist in JSON) | `src/app/fix-my-pub/page.tsx` | 30 min | Check data file |
| 50 | Consolidate JSON-LD blocks on blog posts to 2-3 max | `src/app/licensees-guide/[slug]/page.tsx` | 1 hr | Tasks 15, 16 |

---

## Tier 4: Scale & Polish (Weeks 7-12) -- 24-40 hours

### Batch 4A: Remaining Blog SEO Overrides (4-6 hours)

| # | Task | Files | Effort | Dependencies |
|---|------|-------|--------|-------------|
| 51 | Add SEO overrides for remaining ~44 blog posts | `src/lib/seo-overrides.ts` | 4-6 hrs | None |

**80/20 Alternative:** Create a script that generates override templates from frontmatter (auto-truncating titles, adding keyword patterns). Manual review/edit takes 2-3 hours instead of 4-6.

### Batch 4B: Remaining Blog Internal Links (8-12 hours)

| # | Task | Files | Effort | Dependencies |
|---|------|-------|--------|-------------|
| 52 | Add internal links to remaining ~50 blog posts | 50 markdown files | 8-12 hrs | Category-based link suggestions |

**80/20 Alternative:** Implement an auto-related-posts component based on category/tags that renders at the end of every post. This gives every post 3-5 related links automatically. Estimated 3-4 hours for the component vs 8-12 for manual linking.

### Batch 4C: Navigation Enhancement (4-6 hours)

| # | Task | Files | Effort | Dependencies |
|---|------|-------|--------|-------------|
| 53 | Add dropdown support to Navigation component | `src/components/Navigation.tsx`, `content/data/navigation.json` | 4-6 hrs | Design decision on menu structure |

**80/20 Alternative:** Already addressed by footer links (Tier 2). Skip the navigation dropdown and rely on footer + homepage sections for discoverability.

### Batch 4D: Page Consolidation (2-4 hours)

| # | Task | Files | Effort | Dependencies |
|---|------|-------|--------|-------------|
| 54 | Redirect /pub-rescue to /fix-my-pub (301) | `src/middleware.ts` or `next.config.js` redirects | 30 min | Business decision |
| 55 | Add /pub-rescue crisis keywords to /fix-my-pub content | `src/app/fix-my-pub/page.tsx` or JSON | 1-2 hrs | Task 54 |
| 56 | Differentiate /empty-pub-solutions from /fix-my-pub more clearly | Both page files | 1-2 hrs | Content strategy decision |

### Batch 4E: Advanced Features (6-10 hours)

| # | Task | Files | Effort | Dependencies |
|---|------|-------|--------|-------------|
| 57 | Create author page at /about/peter-pitcher | New: `src/app/about/peter-pitcher/page.tsx` | 3-4 hrs | Bio content, photo |
| 58 | Add Table of Contents component to long blog posts | `src/app/licensees-guide/[slug]/page.tsx`, `TableOfContents.tsx` | 2-3 hrs | Component already exists |
| 59 | Create OG image PNG fallbacks for top 10 blog posts | `/public/images/blog/` | 2-3 hrs | Design tool or script |
| 60 | Publish 6 draft blog posts | 6 markdown files (status: draft -> published) | 30 min each = 3 hrs | Review content quality |

---

## Recommended Batching Strategy

### Sprint 1 (Week 1): "Get Indexed" -- 12-18 hours
Focus: Batches 1A through 1E
Goal: Fix the root cause of low indexation by establishing homepage links to all content clusters.
Deliverables: Homepage links to blog posts, location pages, and solution pages. Location page cross-links. Critical metadata rewrites. Schema fixes. Content re-enablement.

### Sprint 2 (Weeks 2-3): "Rank Better" -- 14-22 hours
Focus: Batches 2A through 2E
Goal: Optimise titles/descriptions for click-through, add conversion paths, set up analytics.
Deliverables: 20 blog SEO overrides, sitemap fixes, contact form live, StickyCTA on all long pages, analytics operational, footer enhanced.

### Sprint 3 (Weeks 4-6): "Strengthen Authority" -- 20-32 hours
Focus: Batches 3A through 3E
Goal: Internal linking, content consistency, image optimisation, trust signals.
Deliverables: Top 15 posts interlinked, metrics standardised, images optimised, homepage reordered, advanced schema.

### Sprint 4 (Weeks 7-12): "Complete Coverage" -- 24-40 hours
Focus: Batches 4A through 4E
Goal: Full blog optimisation, remaining SEO overrides, advanced features.
Deliverables: All posts have overrides and links, navigation enhanced, pages consolidated, author page live, drafts published.

---

## Quick Reference: Files Touched Per Sprint

### Sprint 1 (most impactful, fewest files)
- `src/app/HomePage.tsx` -- homepage sections
- `src/app/page.tsx` -- homepage metadata
- `src/app/layout.tsx` -- schema fixes
- `src/app/licensees-guide/[slug]/page.tsx` -- duplicate schema removal
- `src/app/results/page.tsx` -- self-review removal
- `src/app/empty-pub-solutions/page.tsx` -- HowTo cost fix
- `src/app/quiet-midweek-solutions/page.tsx` -- re-enable content
- `src/app/services/page.tsx` -- title rewrite
- `src/components/PubMarketingLocationLandingPage.tsx` -- cross-links
- 8x `src/app/pub-marketing-*/page.tsx` -- title rewrites + pass currentSlug
- `src/app/pub-marketing/page.tsx` -- link to locations
- `content/blog/why-is-my-pub-empty.md` -- word fix
- 3x blog markdown files -- year references

### Sprint 2
- `src/lib/seo-overrides.ts` -- 20 new entries
- `src/app/sitemap.ts` -- date fixes
- `src/lib/metadata.ts` -- remove keywords
- `src/app/contact/ContactPage.tsx` -- add form
- New: `src/app/actions/contact.ts` -- form handler
- 5x solution page files -- add StickyCTA
- `src/components/GoogleTagManager.tsx` -- consent gating
- `src/components/CookieNotice.tsx` -- consent events
- `content/data/footer.json` -- new link sections
- `src/components/FooterSimple.tsx` -- new column
- Vercel Dashboard -- env vars, domain redirect

### Sprint 3
- ~15 blog markdown files -- internal links
- ~12 files -- metric standardisation
- `/public/images/blog/` -- image conversion
- `src/app/HomePage.tsx` -- section reordering
- `src/components/WhatsAppButton.tsx` -- trust micro-copy
- `src/components/PubMarketingLocationLandingPage.tsx` -- LocalBusiness schema

### Sprint 4
- `src/lib/seo-overrides.ts` -- remaining entries
- ~50 blog markdown files -- internal links
- `src/components/Navigation.tsx` -- dropdown (optional)
- `src/middleware.ts` -- redirect rules
- New: `src/app/about/peter-pitcher/page.tsx`
- 6x draft blog markdown files -- publish

---

## Cost Summary (at estimated GBP 75/hr consulting rate)

| Sprint | Hours | Est. Cost |
|--------|-------|-----------|
| Sprint 1 (Week 1) | 12-18 | GBP 900-1,350 |
| Sprint 2 (Weeks 2-3) | 14-22 | GBP 1,050-1,650 |
| Sprint 3 (Weeks 4-6) | 20-32 | GBP 1,500-2,400 |
| Sprint 4 (Weeks 7-12) | 24-40 | GBP 1,800-3,000 |
| **Total** | **70-112** | **GBP 5,250-8,400** |

**ROI context:** The analytics report projects GBP 937-4,125/month in organic revenue within 12 months. Sprint 1 alone (the highest-impact work) costs GBP 900-1,350 and is the prerequisite for all projected organic traffic growth. The payback period for Sprint 1 is 1-2 months at even the most conservative traffic projection.

---

## Items NOT Requiring Developer Time

These recommendations from the reports are not code changes:

| Item | Owner | Notes |
|------|-------|-------|
| Set up Google Search Console | Peter | Domain verification + sitemap submission |
| Create GA4 property + GTM container | Peter/Marketing | Prerequisite for GTM fix |
| Request indexing of top 20 pages via GSC | Peter | Manual URL inspection tool |
| Run Ahrefs/Moz backlink audit | Peter | Free tier available |
| Collect external client testimonials | Peter | Content, not code |
| Confirm canonical quiz metric | Peter | Business decision |
| Confirm food GP replacement wording | Peter | Business decision |
| Provide social media profile URLs | Peter | Needed for schema |
| Content strategy decision on /pub-rescue | Peter | Business decision |
| Outreach for backlinks (BII, trade press) | Peter/Marketing | Link building campaign |
| Google Business Profile optimisation | Peter | External platform |
