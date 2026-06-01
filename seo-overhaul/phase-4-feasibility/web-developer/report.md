# Web Developer Feasibility Report -- orangejelly.co.uk

**Date:** 2026-03-23
**Author:** Web Developer Analyst
**Status:** Phase 4 -- Feasibility Assessment
**Codebase:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, Vercel

---

## Executive Summary

The orangejelly.co.uk codebase is well-architected for implementing the recommended SEO changes. The separation of concerns -- JSON data files for content, reusable components, a central metadata utility, and a dedicated SEO overrides file -- means most recommendations can be executed without architectural changes. The site already has the infrastructure for structured data, metadata management, and component composition; the gaps are in content wiring (internal linking, homepage sections) and configuration (schema completeness, sitemap dates).

**Overall assessment:** 85% of all recommendations are straightforward implementation work (XS-S effort). The remaining 15% involve larger content operations (blog post internal linking at scale, image batch conversion) that are scriptable but time-consuming.

**Total estimated effort for all recommendations:** 80-120 hours across all tiers, but the high-impact work (Tier 1) is only 12-18 hours.

---

## 1. Codebase Architecture Assessment

### Metadata System

**How it works:** A central `src/lib/metadata.ts` exports `generateMetadata()` and `generateStaticMetadata()`. Every page calls one of these with title, description, path, keywords, and OG settings. The utility automatically appends `| Orange Jelly` to titles, sets canonical URLs, OG tags, Twitter cards, and robots directives.

**SEO overrides for blog posts:** `src/lib/seo-overrides.ts` exports a `Record<string, SeoOverride>` keyed by URL path. The blog post page (`src/app/licensees-guide/[slug]/page.tsx`) checks this map and uses the override title/description if present. Currently 8 of 66+ posts have overrides.

**Feasibility for title/meta rewrites:** Excellent. Changing any page's title or description is a single-line edit in either the page's `generateMetadata()` call or the `seo-overrides.ts` file. No architectural changes needed.

**Keywords meta tag:** Present in `generateMetadata()` as an optional `keywords` parameter. Removing it is a one-line change in the utility plus removing the prop from each page. Low effort.

### Structured Data (JSON-LD)

**How it works:** The root layout (`src/app/layout.tsx`) renders a single `<script type="application/ld+json">` containing an `@graph` with three schemas: `ProfessionalService`, `WebSite`, and `BreadcrumbList`. Individual pages add their own schema via components like `FAQSchema`, `BlogPostingSchema`, `EnhancedBlogSchema`, `BreadcrumbJsonLd`, `HowToSchema`, and `SpeakableContent`.

**Current issues confirmed:**
- `WebSite` schema has no `potentialAction` (SearchAction) -- confirmed in layout.tsx line 138-150
- `ProfessionalService.sameAs` only contains `['https://www.the-anchor.pub']` -- confirmed line 135
- No `GeoCoordinates` in the organization schema
- Blog posts render duplicate `BlogPostingSchema` + `EnhancedBlogSchema` (both emit BlogPosting) -- confirmed via grep: BlogPostingSchema imported at line 9 and used at line 654 of `[slug]/page.tsx`, while EnhancedBlogSchema also renders BlogPosting
- Duplicate `BreadcrumbList` (root layout emits one, `BreadcrumbJsonLd` component emits another per page)

**Feasibility for schema fixes:** Excellent. All schema objects are plain JavaScript objects in the layout or component files. Adding SearchAction, sameAs URLs, GeoCoordinates, and removing duplicates are direct edits to existing code.

### Sitemap

**How it works:** `src/app/sitemap.ts` generates the sitemap dynamically. Static/marketing pages use `new Date().toISOString()` for lastModified (the build timestamp). Blog posts correctly use `post.updatedDate || post.publishedDate` from frontmatter.

**Fix for static page dates:** Replace `currentDate` with hardcoded realistic dates per page, or use a content-hash approach. The simplest approach: define a `lastModifiedDates` map at the top of the file with real dates for each static route. This is a straightforward code change.

### Internal Linking Architecture

**Current state:** The homepage (`src/app/HomePage.tsx`) is a single component rendering imported sub-components (Hero, TrustBar, FeaturesGrid, PartnershipsSection, ProblemCardsSection, ResultsSection, CTASection, FAQItems). It links to `/services`, `/about`, `/contact`, `/licensees-guide`, `/pub-marketing`, and `/quiet-midweek-solutions` via navigation and problem cards. It does NOT link to any blog posts, location pages, or most solution pages.

**Location pages:** All 8 use the shared `PubMarketingLocationLandingPage` component which renders from JSON data files. The component has intro, wins, nextSteps, FAQs, and CTA sections. There is no "Also Serving" or cross-link section.

**Footer:** Driven by `content/data/footer.json`. Currently has services (4 hash links), resources (3 links), and company links (4 links including external The Anchor). No location page links, no solution page links.

**Navigation:** Driven by `content/data/navigation.json`. Flat list: Home, Services, Hospitality Marketing, Guides, Success Stories, About, Contact. No dropdowns, no mega-menu.

**Feasibility for internal linking improvements:** Moderate-to-good. Adding homepage sections (blog grid, location links, solution links) requires adding new JSX sections to `HomePage.tsx` -- straightforward component composition. Adding cross-links to location pages requires either modifying the shared component to accept an "otherLocations" prop or adding a new section. Footer changes are JSON edits plus minor component changes.

### Contact Form

**Current state:** A fully built `ContactForm` component exists at `src/components/forms/contact-form.tsx` using React Hook Form + Zod validation with fields: name, email, phone (optional), pub name, and message. It uses shadcn/ui form components. However, this component is NOT rendered on any page. The contact page (`src/app/contact/page.tsx`) only shows WhatsApp, phone, and email contact methods.

**Feasibility for adding contact form:** Excellent. The component is complete and tested. It just needs to be imported and rendered on the contact page (and optionally on solution pages). The only gap is a backend handler -- the form likely needs a server action or API route to actually send the submission (email via Resend, or store in Supabase).

### Cookie Consent / GTM

**Current state:** `CookieNotice` component stores consent in localStorage but does NOT gate GTM loading. The `GoogleTagManager` component loads the GTM script unconditionally in `<head>` via Next.js `Script` with `afterInteractive` strategy. The GTM ID comes from `NEXT_PUBLIC_GTM_ID` env var (currently a placeholder `GTM-XXXXXXX`).

**Feasibility for fixing consent gating:** Moderate. Requires refactoring `GoogleTagManager` to check consent state before loading, or using a client-side wrapper that conditionally injects GTM after consent. The challenge is that GTM loads in `<head>` at layout level (server component) while consent state is client-side (localStorage). The fix would involve moving GTM injection to a client component that reads consent state first. Estimated 2-4 hours.

### Image Pipeline

**Current state:** 160 files in `/public/images/blog/` (both PNG and SVG versions). Next.js Image component handles runtime optimization (AVIF/WebP conversion, resizing) via `next.config.js` with aggressive caching. Source PNGs are oversized but the optimization pipeline mitigates runtime impact.

**Feasibility for batch image conversion:** The source PNGs can be batch-converted to WebP using a script (sharp, imagemin, or cwebp CLI). This is a one-time operation that does not affect the codebase architecture. The SVGs used for OG images are a separate issue -- they need PNG fallback versions generated.

### Blog Rendering System

**Current state:** Blog posts are markdown files in `/content/blog/`. The `[slug]/page.tsx` route reads markdown, parses frontmatter, renders via `BlogPostClient` component. The client component includes reading progress bar, share buttons, QuickAnswer, main content, in-article CTA, related services card, author bio, adjacent post navigation, and tags. The `StickyCTA` component (blog version at `src/components/blog/StickyCTA.tsx`) renders a floating desktop card and mobile bottom bar.

**Feasibility for blog enhancements:** Good. Adding internal links within blog content requires editing the markdown files directly. Adding StickyCTA to non-blog pages requires importing and rendering the component (the generic `src/components/StickyCTA.tsx` already exists for this purpose). Contextualising the CTA per article topic would require passing the post title/category as a prop -- minor component modification.

---

## 2. Recommendation-by-Recommendation Feasibility

### CRITICAL: Internal Linking (Homepage)

| Recommendation | Files Affected | Implementation | Effort | Risk |
|----------------|---------------|----------------|--------|------|
| Add "Latest Articles" section (6-9 blog posts) | `src/app/HomePage.tsx` | Import `getAllPosts()` from blog lib, render a grid of BlogCard components linking to recent posts. The blog card component already exists in the licensees-guide page. | 2-3 hours | Low |
| Add "Areas We Cover" section (8 location pages) | `src/app/HomePage.tsx` | Add a new Section with a Grid of 8 Button/Card links to location pages. Data can be hardcoded or pulled from a small JSON array. | 1-2 hours | Low |
| Add all solution page links to ProblemCards | `src/app/HomePage.tsx` or `ProblemCardsSection.tsx` | The ProblemCardsSection already links to `/quiet-midweek-solutions`. Add cards/links for fix-my-pub, empty-pub-solutions, compete-with-pub-chains, pub-marketing-no-budget. | 1-2 hours | Low |

### CRITICAL: Location Page Cross-Linking

| Recommendation | Files Affected | Implementation | Effort | Risk |
|----------------|---------------|----------------|--------|------|
| Add "Also Serving" section to all 8 location pages | `src/components/PubMarketingLocationLandingPage.tsx` + 8 JSON data files | Two options: (A) Add an `otherLocations` prop to the shared component and pass the filtered list from each page, or (B) hardcode the full location list in the component and filter out the current one based on a `currentSlug` prop. Option B is simpler. | 2-3 hours | Low |

### HIGH: Metadata & Title Rewrites

| Recommendation | Files Affected | Implementation | Effort | Risk |
|----------------|---------------|----------------|--------|------|
| Rewrite homepage title, description, H1 | `src/app/page.tsx` (metadata), `src/app/HomePage.tsx` (hero data) | Direct string replacements in the local data object and generateStaticMetadata call. | 30 min | Low -- test that title renders correctly |
| Rewrite services page title/description | `src/app/services/page.tsx` or `content/data/services.json` | Check whether metadata comes from JSON or page file. Edit accordingly. | 30 min | Low |
| Rewrite results page title/description | `src/app/results/page.tsx` or `content/data/results.json` | Same pattern. | 30 min | Low |
| Rewrite all location page titles | 8 page files (`src/app/pub-marketing-*/page.tsx`) | Each has inline `generateMetadata()` call. Direct string edit. | 1 hour total | Low |
| Add SEO overrides for 20 priority blog posts | `src/lib/seo-overrides.ts` | Add 20 entries to the existing object. Each entry is 3 lines. | 2-3 hours (including writing titles) | Low |
| Add SEO overrides for remaining ~44 blog posts | `src/lib/seo-overrides.ts` | Same pattern, larger volume. Could be partially automated with a script that generates templates from frontmatter. | 4-6 hours | Low |

### HIGH: Schema Fixes

| Recommendation | Files Affected | Implementation | Effort | Risk |
|----------------|---------------|----------------|--------|------|
| Add SearchAction to WebSite schema | `src/app/layout.tsx` (websiteSchema object, ~line 138) | Add `potentialAction` property with SearchAction targeting the site search. Requires knowing the search URL pattern (likely `/licensees-guide?search={query}` or similar). | 30 min | Low |
| Add sameAs social profiles | `src/app/layout.tsx` (organizationSchema.sameAs, ~line 135) | Change from `['https://www.the-anchor.pub']` to include Facebook, Instagram, LinkedIn URLs. Requires the actual profile URLs from Peter. | 15 min | Low -- needs social URLs |
| Add GeoCoordinates | `src/app/layout.tsx` (organizationSchema) | Add `geo` property with latitude/longitude for The Anchor. | 15 min | Low |
| Remove duplicate BlogPostingSchema from blog posts | `src/app/licensees-guide/[slug]/page.tsx` (~line 654) | Remove the `<BlogPostingSchema>` component call since `EnhancedBlogSchema` already renders BlogPosting. | 15 min | Low -- verify EnhancedBlogSchema covers all fields |
| Remove duplicate BreadcrumbList | `src/app/licensees-guide/[slug]/page.tsx` | Either remove `BreadcrumbJsonLd` from individual pages (root layout already has it) or make the root layout breadcrumb conditional. | 30 min | Low |
| Remove self-review schema from Results page | `src/app/results/page.tsx` (~line 114-134) | Delete the Review schema object. | 15 min | Low |
| Fix HowTo estimatedCost on empty-pub-solutions | `src/app/empty-pub-solutions/page.tsx` | Change value from '499' to '75' or remove estimatedCost. | 5 min | Low |
| Add LocalBusiness schema to location pages | `src/components/PubMarketingLocationLandingPage.tsx` | Add a new JSON-LD script block with LocalBusiness + areaServed per location. Would need county-specific data passed via props or JSON. | 2-3 hours total | Low |

### HIGH: Content Fixes

| Recommendation | Files Affected | Implementation | Effort | Risk |
|----------------|---------------|----------------|--------|------|
| Re-enable disabled sections on quiet-midweek-solutions | `src/app/quiet-midweek-solutions/page.tsx` (lines 177, 227, 421) | Change `{false && (` to `{(` in three locations. | 15 min | Low -- verify content renders correctly, verify FAQ schema matches visible content |
| Fix "bought" to "took on" in blog post | `content/blog/why-is-my-pub-empty.md` | Single word replacement. | 5 min | Low |
| Fix US spelling "modernizes" | `src/app/HomePage.tsx` or related component | Single character change (z to s). | 5 min | Low |
| Update 2024 year references in blog posts | 3 blog markdown files | Direct text edits. | 15 min | Low |
| Standardise quiz metric (25-30 vs 25-35) | ~12 files (components + pages + JSON) | Search-and-replace after Peter confirms the canonical number. | 1-2 hours | Medium -- need business decision first |
| Remove explicit food GP percentages per claims audit | 6 files identified in Editor report | Replace "58% to 71%" with relative language. | 1 hour | Medium -- need approved replacement wording |

### MEDIUM: Conversion Improvements

| Recommendation | Files Affected | Implementation | Effort | Risk |
|----------------|---------------|----------------|--------|------|
| Add ContactForm to contact page | `src/app/contact/ContactPage.tsx` | Import and render the existing `ContactForm` component. Need a server action or API route to handle form submissions. | 3-4 hours (including backend) | Low |
| Add StickyCTA to solution/location pages | 5 solution pages + `PubMarketingLocationLandingPage.tsx` | Import `StickyCTA` from `src/components/StickyCTA.tsx` and render it. The generic version already exists. | 1-2 hours | Low |
| Add trust micro-copy near WhatsApp CTAs | `src/components/WhatsAppButton.tsx` or individual pages | Either modify the WhatsApp button component to accept optional trust text, or add Text elements adjacent to each CTA. Component-level change is cleaner. | 1-2 hours | Low |
| Reorder homepage sections | `src/app/HomePage.tsx` | Move JSX blocks around. ProblemCards up, Results up, Features down, Partnerships down. | 1 hour | Low -- verify layout integrity |
| Add solution pages to navigation | `content/data/navigation.json` + possible `Navigation.tsx` changes | JSON currently supports flat links only. Adding a dropdown/mega-menu requires modifying the Navigation component to support nested items. | 4-6 hours | Medium -- UI complexity |
| Add location pages to footer | `content/data/footer.json` + `src/components/FooterSimple.tsx` | Add a new "Areas" link group to footer JSON. May need FooterSimple to handle the additional column. | 2-3 hours | Low |
| Reduce contact page FAQs from 12 to 5 | `src/app/contact/ContactPage.tsx` or contact data JSON | Remove 7 FAQ entries. | 30 min | Low |

### MEDIUM: Technical SEO

| Recommendation | Files Affected | Implementation | Effort | Risk |
|----------------|---------------|----------------|--------|------|
| Fix naked domain 307 redirect | Vercel Dashboard (not code) | This is a Vercel project settings change, not a code change. The middleware already does 301 at line 113, but Vercel's edge may intercept first. | 15 min | Low -- Vercel Dashboard access required |
| Fix sitemap lastModified dates | `src/app/sitemap.ts` | Replace `currentDate` with a `Map<string, string>` of real dates per route. | 1-2 hours | Low |
| Remove keywords meta tag | `src/lib/metadata.ts` + all page files that pass `keywords` | Remove `keywords` from the metadata utility return object, then remove `keywords` props from page files. | 1 hour | Low |
| Fix GTM placeholder / set up real GTM | `.env` file + Vercel env vars | Set `NEXT_PUBLIC_GTM_ID` to real container ID. Requires creating GA4 property and GTM container first. | 30 min (code), 2 hours (GTM/GA4 setup) | Low |
| Fix cookie consent to gate GTM | `src/components/GoogleTagManager.tsx` + `src/components/CookieNotice.tsx` | Refactor GTM to a client component that checks localStorage consent before injecting the script. | 2-4 hours | Medium -- needs testing across consent states |
| Install @vercel/analytics + @vercel/speed-insights | `package.json` + `src/app/layout.tsx` | `npm install` + add `<Analytics />` and `<SpeedInsights />` components to layout. | 30 min | Low |

### MEDIUM: Image Optimization

| Recommendation | Files Affected | Implementation | Effort | Risk |
|----------------|---------------|----------------|--------|------|
| Batch convert 91 oversized PNGs to WebP | `/public/images/blog/*.png` | Write a Node script using `sharp` to batch convert. Update any hardcoded PNG references in code/markdown. | 4-6 hours (script + verification) | Medium -- must verify all image references still work |
| Create PNG versions of SVG OG images | `/public/images/blog/*.svg` | Write a conversion script (sharp or Puppeteer-based SVG-to-PNG). Update `blog-images.ts` mappings. | 4-6 hours | Medium -- SVG rendering quality may vary |

### LOW: Advanced / Long-term

| Recommendation | Files Affected | Implementation | Effort | Risk |
|----------------|---------------|----------------|--------|------|
| Add internal links within 66 blog post markdown files | 66 files in `content/blog/` | Manual editing of markdown content. Each post needs 3-5 contextual links added. Could be partially assisted by a script that suggests link targets based on keyword matching. | 12-20 hours | Low per file, but large total volume |
| Consolidate/differentiate overlapping solution pages | `/pub-rescue`, `/fix-my-pub`, `/empty-pub-solutions` | Requires a content strategy decision first. Code changes are either redirects (simple) or content rewrites (moderate). | 2-4 hours (redirects) or 8-12 hours (rewrites) | Medium -- needs business decision |
| Create author page at /about/peter-pitcher | New file: `src/app/about/peter-pitcher/page.tsx` | Create new page with Peter's bio, credentials, BII feature link, photo. Straightforward page creation. | 3-4 hours | Low |
| Contextualise blog StickyCTA per article topic | `src/components/blog/StickyCTA.tsx` + `BlogPost.tsx` | Pass post title/category as props. Update CTA text to use the topic. | 2-3 hours | Low |
| Add Table of Contents to long blog posts | Blog post page + `TableOfContents.tsx` (already exists) | Import and render the existing component. May need to parse headings from markdown content. | 2-3 hours | Low |
| Implement CSP nonces (replace unsafe-inline) | `src/middleware.ts` + `next.config.js` | Significant security improvement but complex. Requires nonce generation in middleware, passing to Script components. | 6-8 hours | Medium-High -- can break inline scripts/styles |

---

## 3. Dependencies and Blockers

| Dependency | Required For | Owner | Status |
|------------|-------------|-------|--------|
| Peter confirms canonical quiz metric (25-30 teams vs 25-35 regulars) | Metric standardisation | Peter | BLOCKED -- needs business decision |
| Peter confirms approved food GP replacement wording | Claims audit compliance | Peter | BLOCKED -- needs business decision |
| Social media profile URLs (Facebook, Instagram, LinkedIn) | sameAs schema | Peter | BLOCKED -- needs URLs |
| Real GTM container ID | Analytics setup | Peter/Dev | BLOCKED -- needs GA4/GTM setup |
| Content strategy decision on /pub-rescue consolidation | Page consolidation | Peter | BLOCKED -- needs business decision |
| Vercel Dashboard access | 307 redirect fix | Dev | Likely available |
| External client testimonial content | Trust signals | Peter | BLOCKED -- needs client feedback |

---

## 4. Risk Assessment

### Low Risk (safe to implement immediately)
- All metadata/title rewrites
- Schema additions (SearchAction, sameAs, GeoCoordinates)
- Schema duplicate removal
- Re-enabling disabled content sections
- Homepage section additions (blog grid, location links)
- Location page cross-linking
- StickyCTA on additional pages
- Sitemap date fixes
- Footer/navigation link additions
- SEO override additions
- Vercel Analytics/Speed Insights installation
- Individual blog post content fixes

### Medium Risk (test before deploying)
- Cookie consent GTM gating (can break analytics if misconfigured)
- Image batch conversion (must verify all references)
- Navigation dropdown/mega-menu (UI complexity, mobile testing needed)
- Metric standardisation (must touch many files consistently)
- Contact form backend (needs server action, email sending, or storage)

### Higher Risk (plan carefully)
- CSP nonce implementation (can break functionality)
- Page consolidation with redirects (affects existing Google rankings)
- Removing keywords meta from all pages (very low risk technically, but touches many files)

---

## 5. Simpler Alternatives for Expensive Recommendations

| Expensive Recommendation | 80/20 Alternative | Effort Saved |
|--------------------------|-------------------|-------------|
| Add internal links to all 66 blog posts (12-20 hrs) | Add links to top 15 posts only (the ones with ranking potential). Use a "Related Guides" section added to the blog post template that auto-links based on category -- one component change covers all posts. | 8-14 hours |
| Create PNG versions of all SVG OG images (4-6 hrs) | Set a default PNG OG image for all blog posts that lack one. Only create custom PNGs for top 10 posts. | 3-4 hours |
| Add navigation dropdown for solution pages (4-6 hrs) | Add solution page links to the footer instead (JSON edit + minor component change). | 3-4 hours |
| Contextualise StickyCTA per article (2-3 hrs) | Use a single improved generic message: "Need help with your pub? Chat with Peter" -- already close to current. | 2 hours |
| Full contact form with backend (3-4 hrs) | Use a simple mailto: link styled as a form CTA, or embed a Tally/Typeform. | 2-3 hours |
| Consolidate 3 overlapping solution pages (8-12 hrs for rewrites) | Set up 301 redirects from /pub-rescue to /fix-my-pub. Keep /empty-pub-solutions as the long-form informational page. | 6-10 hours |

---

## 6. Technology Considerations

### What the codebase does well
- Clean separation of data (JSON) and presentation (components)
- Central metadata utility prevents inconsistent SEO implementation
- Component library is mature (Hero, Section, Card, Button, Grid, etc.)
- Server components by default with client components only where needed
- Good TypeScript typing throughout

### Gaps to be aware of
- No automated testing for SEO (no tests checking meta tags, schema, etc.)
- No content linting (no automated check for metric consistency across files)
- Blog post internal linking is manual (no automated related-post suggestion system)
- The navigation component does not support nested menus/dropdowns
- No email sending infrastructure (Resend, SendGrid, etc.) for form submissions -- would need to be set up for the contact form

### Build/Deploy considerations
- `dynamicParams = false` on blog routes means new posts require a rebuild
- ISR with 60s revalidation on blog posts is appropriate
- Image optimization is handled at runtime by Next.js/Vercel -- source image size does not affect page load, but does affect build/deploy size and git repo size
- The 79MB images directory could slow CI/CD; consider moving to external storage (Vercel Blob, Cloudinary) long-term
