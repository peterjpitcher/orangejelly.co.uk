# SEO Migration Review: Commercial Transformation Design Spec

**Date:** 2026-04-05
**Reviewer:** Claude (SEO Specialist)
**Spec reviewed:** `docs/superpowers/specs/2026-04-05-commercial-transformation-design.md`
**Supporting docs:** `seo-overhaul/keyword-plan.md`, `src/lib/seo-overrides.ts`, `src/app/sitemap.ts`

---

## 1. Keyword Preservation

### SEO-001: /pub-rescue redirect conflicts with design spec — keyword at risk

- **Severity:** Critical
- **Finding:** The keyword plan assigns "rescue my pub" (50/mo) and "pub rescue package" (50/mo) to `/pub-rescue`. The design spec (section 5 and 13) lists `/pub-rescue` as a preserved page that "Routes to Turnaround Intensive." However, `next.config.js` already contains a 301 redirect from `/pub-rescue` to `/fix-my-pub`. This means the page does not exist as a standalone URL today — it redirects. The design spec appears unaware of this existing redirect. If Phase 3 rewrites `/pub-rescue` as its own page, the redirect must be removed. If the redirect stays, the keyword plan loses two keyword targets (100/mo combined) and the design spec's architecture is broken.
- **Recommendation:** Remove the `/pub-rescue` -> `/fix-my-pub` redirect from `next.config.js` when `/pub-rescue` is built as a standalone page in Phase 3. Alternatively, if the redirect is intentional, update the keyword plan to reassign "rescue my pub" and "pub rescue package" to `/fix-my-pub` and remove `/pub-rescue` from the design spec's sitemap.

### SEO-002: "pub advertising" (50/mo) assigned to a page being redirected away

- **Severity:** High
- **Finding:** The keyword plan assigns "pub advertising" (50/mo) as the primary keyword for `/services/paid-social-for-pubs`. The design spec redirects this URL to `/capabilities` with a 301. However, `/capabilities` is designed as a broad digital capability grid, not a targeted page for paid advertising. The keyword plan also lists "bar promotion ideas" (50/mo) as a secondary keyword on this page. The `/capabilities` page has no specific paid social section that would capture this intent.
- **Recommendation:** Ensure the `/capabilities` page includes a dedicated paid social / advertising section with on-page copy targeting "pub advertising." Alternatively, add the keyword to the seo-overrides for `/capabilities` and include it in the meta description.

### SEO-003: "social media for pubs" (50/mo) and two secondary keywords assigned to page being redirected

- **Severity:** High
- **Finding:** The keyword plan assigns three keywords totalling ~150/mo to `/services/social-media-marketing-for-pubs`: "social media for pubs" (50), "hospitality social media" (50), and "hospitality social media marketing" (50). The design spec redirects this URL to `/capabilities`. The Instagram and Facebook sub-pages already redirect to `/services/social-media-marketing-for-pubs`, so the design will create three-hop chains: `/services/instagram-services-for-pubs` -> `/services/social-media-marketing-for-pubs` -> `/capabilities`.
- **Recommendation:** (a) Ensure `/capabilities` has sufficient on-page content to rank for social media keywords. (b) Update Instagram/Facebook page redirects to point directly to `/capabilities` (not to the intermediate `/services/social-media-marketing-for-pubs`) to prevent redirect chains. See also SEO-005.

### SEO-004: "how to market a restaurant" (50/mo) assigned to /services hub being redirected

- **Severity:** Medium
- **Finding:** The keyword plan assigns "how to market a restaurant" (50/mo) as a secondary keyword to `/services`. The design spec redirects `/services` to `/ways-to-work`. The `/ways-to-work` page is a package comparison page, not a "how to" educational page. The search intent mismatch means this keyword will likely be lost even if the redirect works.
- **Recommendation:** Reassign "how to market a restaurant" to a blog post (e.g., one of the marketing strategy posts) or to the `/pub-marketing-agency` page where the "how" and "why" framing better matches informational intent. Update the keyword plan accordingly.

### SEO-005: Homepage SEO override still references "from £75/hr + VAT" pricing

- **Severity:** High
- **Finding:** The seo-overrides.ts file for `/` contains the meta description: "Practical pub marketing from £75/hr + VAT." After the commercial transformation, the pricing model changes to packages (from £375 + VAT). The meta description will be factually wrong and commercially misleading from the moment Phase 3 ships.
- **Recommendation:** Update the homepage SEO override meta description to reference the new package model. Suggested: "Hospitality marketing proven at a real pub. We grew quiz night to 35 regulars and food GP from 58% to 71%. Clear packages from £375 + VAT."

---

## 2. Redirect Chain Risk

### SEO-006: Triple redirect chain — Instagram/Facebook -> Social Media -> Capabilities

- **Severity:** Critical
- **Finding:** The Q1 SEO work already created these redirects:
  - `/services/instagram-services-for-pubs` -> `/services/social-media-marketing-for-pubs` (permanentRedirect in page.tsx)
  - `/services/facebook-services-for-pubs` -> `/services/social-media-marketing-for-pubs` (permanentRedirect in page.tsx)

  The design spec adds:
  - `/services/social-media-marketing-for-pubs` -> `/capabilities` (301)

  This creates a chain: A -> B -> C. Google will eventually resolve chains, but it wastes crawl budget, delays link equity transfer (studies show ~10-15% loss per hop), and risks the intermediate URL being dropped from the index before Google discovers the final destination.
- **Recommendation:** When implementing Phase 4 redirects, update the Instagram and Facebook page redirects to point directly to `/capabilities`. Change both `page.tsx` files to `permanentRedirect('/capabilities')`.

### SEO-007: /services -> /ways-to-work redirect is clean but sitemap still lists /services

- **Severity:** Medium
- **Finding:** The current `sitemap.ts` includes `/services` as a static page with priority 0.9. After the redirect goes live in Phase 4, this creates a conflict: the sitemap tells Google to crawl `/services`, but the server returns a 301. This wastes crawl budget and sends mixed signals about canonical URLs.
- **Recommendation:** Remove `/services` from `sitemap.ts` in Phase 4 when the redirect is deployed. Add `/ways-to-work` to the sitemap instead.

### SEO-008: Sitemap still lists individual service sub-pages

- **Severity:** Medium
- **Finding:** The `sitemap.ts` `marketingRoutes` array includes all five service sub-pages (`services/social-media-marketing-for-pubs`, `services/instagram-services-for-pubs`, `services/facebook-services-for-pubs`, `services/paid-social-for-pubs`, `services/content-creation-for-pubs`). Two of these (Instagram, Facebook) already redirect. The design adds redirects for the remaining three. After Phase 4, all five will be 301s listed in the sitemap.
- **Recommendation:** Remove all `/services/*` entries from `sitemap.ts` in Phase 4. Replace with `/capabilities` and the four `/ways-to-work/*` package detail pages.

---

## 3. Internal Linking Impact

### SEO-009: Blog CTA changes shift link equity from /services to /ways-to-work

- **Severity:** Medium
- **Finding:** The design updates CTAs on 74 blog posts and 8 regional pages to point to `/ways-to-work` instead of current targets (mix of `/services`, `/contact`, and direct WhatsApp). This is a significant redistribution of internal link equity. The `/ways-to-work` page will become the most internally linked conversion page on the site, receiving equity from 82+ pages. This is intentional and positive for the new commercial model, but `/services` and its sub-pages will lose all internal link equity from content pages.
- **Recommendation:** This is the correct approach for the new model. No change needed, but ensure Phase 4 (redirect deployment) and Phase 5 (CTA sweep) ship close together. A gap where old CTAs point to /services while /services redirects to /ways-to-work wastes equity through redirect hops.

### SEO-010: Regional page cross-linking is a positive SEO signal — ensure implementation

- **Severity:** Low
- **Finding:** The design (Phase 5) adds cross-links between the 8 regional pages. This is explicitly recommended in the keyword plan. Cross-linking regional pages strengthens topical cluster signals for "pub marketing [county]" keywords. Currently these pages are isolated silos.
- **Recommendation:** Implement as specified. Consider also adding a "See all regions" link on each regional page back to `/pub-marketing` to reinforce the hub-spoke structure.

### SEO-011: /capabilities page receives redirects but has no inbound internal links planned

- **Severity:** High
- **Finding:** Three service pages will redirect to `/capabilities`, and it appears in the primary navigation. However, no blog CTA or regional page CTA routes to `/capabilities`. It is not linked from any of the 74 blog posts. Its only internal links will be from navigation and footer. For a page absorbing 150+/mo of redirected keyword equity, this is thin internal linking support.
- **Recommendation:** Add contextual internal links to `/capabilities` from relevant blog posts (e.g., social media strategy, content marketing, local pub marketing). Also link from `/ways-to-work` ("See everything we can help with") and from `/pub-marketing-agency` ("Explore our full digital capability stack").

---

## 4. Cannibalisation Risk

### SEO-012: /ways-to-work will NOT cannibalise /pub-marketing-agency

- **Severity:** Low (no action needed)
- **Finding:** `/ways-to-work` targets no keywords (conversion page, zero search volume). `/pub-marketing-agency` targets "hospitality marketing agency" (500/mo). These have different intents: one is a pricing/packaging page, the other is a credibility/trust page. Search engines distinguish transactional from informational intent. No cannibalisation risk.
- **Recommendation:** None. The design correctly separates these pages by intent.

### SEO-013: /capabilities may cannibalise blog posts for social media and content keywords

- **Severity:** Medium
- **Finding:** The `/capabilities` page will cover 10 capability areas including organic social direction, paid social, content planning, and local visibility. The keyword plan has dedicated blog posts targeting "social media for pubs," "pub content ideas," "local pub marketing," and "pub advertising." If `/capabilities` includes substantial copy on these topics (rather than brief summaries), Google may struggle to determine which page to rank. The design says capabilities shows "shortDescription" per capability, which should be safe, but the content must stay brief.
- **Recommendation:** Keep capability descriptions on `/capabilities` to 2-3 sentences maximum per capability. Link from each capability to the relevant blog post for "deep dive" content. This creates a hub-spoke pattern where the capabilities page aggregates and the blog posts provide depth. Do NOT add keyword-targeted copy to `/capabilities` entries.

### SEO-014: Package detail pages will NOT compete with each other

- **Severity:** Low (no action needed)
- **Finding:** The four package detail pages (`/ways-to-work/growth-fix`, `/momentum-month`, `/growth-partner`, `/turnaround-intensive`) each target different audiences and use cases. Only `/ways-to-work/turnaround-intensive` has a keyword target ("pub transformation" 50/mo). The others are conversion pages with no keyword targets. No cannibalisation risk.
- **Recommendation:** None.

### SEO-015: "pub marketing ideas" keyword has dual assignment

- **Severity:** Medium
- **Finding:** The keyword plan assigns "pub marketing ideas" (50/mo) to both `/licensees-guide/low-budget-pub-marketing-ideas` (as primary) and `/pub-marketing-no-budget` (in the problem pages table). Both pages target budget-conscious operators with similar language. Google may split rankings between them.
- **Recommendation:** Differentiate clearly: keep "pub marketing ideas" as the primary for the blog post (educational, how-to content). Reframe `/pub-marketing-no-budget` around "affordable pub help" or "pub marketing on a budget" (service-oriented, commercial intent). The blog post educates; the problem page converts. Update the keyword plan to reflect this split.

---

## 5. Structured Data

### SEO-016: No schema markup specified for /ways-to-work

- **Severity:** High
- **Finding:** The design spec does not mention structured data for the Ways to Work page. This page contains pricing, package descriptions, FAQs, and service information — all of which have well-supported schema types. Missing schema means lost opportunity for rich results (pricing snippets, FAQ dropdowns).
- **Recommendation:** Implement the following schema on `/ways-to-work`:
  - `FAQPage` schema for the 6-8 FAQ section
  - `ItemList` schema wrapping the four packages (each as a `ListItem` linking to its detail page)
  - `Organization` schema (if not already sitewide) with `hasOfferCatalog` referencing the packages

### SEO-017: No schema markup specified for package detail pages

- **Severity:** High
- **Finding:** Package detail pages contain structured pricing, inclusion lists, and process steps. Without schema, Google cannot display rich results for these pages.
- **Recommendation:** Implement on each package detail page:
  - `Service` schema with `name`, `description`, `provider` (Orange Jelly), `offers` (with `price`, `priceCurrency: "GBP"`)
  - `HowTo` schema for the "How it works" 3-4 step process
  - If the page includes FAQs, add `FAQPage` schema
  - Example for Growth Fix:
    ```json
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Growth Fix",
      "description": "A focused package for one clear bottleneck",
      "provider": { "@type": "Organization", "name": "Orange Jelly" },
      "offers": {
        "@type": "Offer",
        "price": "375",
        "priceCurrency": "GBP",
        "priceSpecification": { "valueAddedTaxIncluded": false }
      }
    }
    ```

### SEO-018: No schema markup specified for /capabilities

- **Severity:** Medium
- **Finding:** The capabilities page lists 10 services with descriptions and per-package support levels. This is a natural fit for `ItemList` + `Service` schema.
- **Recommendation:** Implement `ItemList` schema with each capability as a `ListItem` containing a `Service` entity. Include `name` and `description` for each. This helps Google understand the page structure and may generate sitelinks in search results.

---

## 6. Sitemap and Indexation

### SEO-019: New pages missing from sitemap.ts

- **Severity:** High
- **Finding:** The current `sitemap.ts` has no entries for the new pages introduced by the design: `/ways-to-work`, `/ways-to-work/growth-fix`, `/ways-to-work/momentum-month`, `/ways-to-work/growth-partner`, `/ways-to-work/turnaround-intensive`, and `/capabilities`. The design spec (Phase 4) says "Update sitemap.ts" but provides no specifics.
- **Recommendation:** Add to `sitemap.ts` in Phase 4:
  ```
  /ways-to-work              — priority: 0.9, changeFrequency: weekly
  /ways-to-work/growth-fix   — priority: 0.7, changeFrequency: monthly
  /ways-to-work/momentum-month — priority: 0.7, changeFrequency: monthly
  /ways-to-work/growth-partner — priority: 0.8, changeFrequency: monthly
  /ways-to-work/turnaround-intensive — priority: 0.7, changeFrequency: monthly
  /capabilities              — priority: 0.7, changeFrequency: monthly
  ```

### SEO-020: All new pages should be indexable

- **Severity:** Low (confirmation)
- **Finding:** All six new pages serve distinct user intents and contain unique content. None should be noindexed. `/ways-to-work` is the primary conversion page. Package detail pages provide depth for cautious buyers. `/capabilities` absorbs redirected keyword equity. All belong in the sitemap and index.
- **Recommendation:** Ensure no `noindex` meta tags are applied to any new pages. All should be indexable and in the sitemap.

### SEO-021: /pub-rescue listed in sitemap but currently redirects via next.config.js

- **Severity:** Medium
- **Finding:** `/pub-rescue` is not in the current sitemap (correct, since it redirects), but the keyword plan has it assigned with "pub rescue package" (50/mo). The design spec lists it as a standalone page. If Phase 3 restores it as a page, it must be added to the sitemap. If the redirect stays, it must stay out of the sitemap and the keyword plan must be updated.
- **Recommendation:** Track this alongside SEO-001. When the redirect is removed and the page is built, add `/pub-rescue` to the sitemap with priority 0.75.

---

## 7. Meta and OG Tags

### SEO-022: No meta titles/descriptions specified for /ways-to-work

- **Severity:** High
- **Finding:** The design does not specify meta titles or descriptions for the primary conversion page. Without explicit SEO overrides, Next.js will generate defaults which are unlikely to be optimal.
- **Recommendation:** Add to `seo-overrides.ts`:
  ```typescript
  '/ways-to-work': {
    title: 'Ways to Work With Orange Jelly | Pub Marketing Packages',
    description: 'Four clear pub marketing packages from £375 + VAT. Growth Fix, Momentum Month, Growth Partner, and Turnaround Intensive. Payment plans available.',
  }
  ```

### SEO-023: No meta titles/descriptions specified for package detail pages

- **Severity:** High
- **Finding:** Four new package detail pages have no specified meta data.
- **Recommendation:** Add to `seo-overrides.ts`:
  ```typescript
  '/ways-to-work/growth-fix': {
    title: 'Growth Fix | One Problem, One Plan, From £375 + VAT',
    description: '5 hours of focused pub marketing to solve one clear bottleneck. Diagnosis, action plan, and one capability-led intervention. Payment plans available.',
  },
  '/ways-to-work/momentum-month': {
    title: 'Momentum Month | Monthly Pub Marketing From £900 + VAT',
    description: '12 hours per month of strategic pub marketing. One priority, one campaign, weekly direction. Build consistency without overcommitting.',
  },
  '/ways-to-work/growth-partner': {
    title: 'Growth Partner | Ongoing Pub Marketing From £1,800 + VAT',
    description: '24 hours per month of hands-on pub marketing support. Strategy, events, social, local visibility, and reporting tied to commercial outcomes.',
  },
  '/ways-to-work/turnaround-intensive': {
    title: 'Turnaround Intensive | Complete Pub Commercial Reset',
    description: 'A 30-day pub transformation sprint. Deep diagnostic, offer reset, local visibility reset, lean website rebuild, and stabilisation playbooks.',
    keywords: ['pub transformation', 'pub turnaround', 'pub rescue package'],
  }
  ```

### SEO-024: No meta title/description specified for /capabilities

- **Severity:** Medium
- **Finding:** The capabilities page absorbs redirected keywords ("social media for pubs" 50/mo, "pub advertising" 50/mo) but has no meta data specified.
- **Recommendation:** Add to `seo-overrides.ts`:
  ```typescript
  '/capabilities': {
    title: 'Capabilities | Social Media, Events, Local Visibility & More',
    description: 'Everything Orange Jelly can help with: social media for pubs, paid advertising, event marketing, local visibility, content direction, and website optimisation.',
    keywords: ['social media for pubs', 'pub advertising', 'hospitality social media'],
  }
  ```

### SEO-025: OG images not specified for new pages

- **Severity:** Low
- **Finding:** No Open Graph images are specified for the six new pages. Social sharing and link previews will fall back to the site default (if one exists) or show no image.
- **Recommendation:** Create branded OG images (1200x630px) for at minimum `/ways-to-work` and `/capabilities`. Package detail pages can share a single "Orange Jelly Packages" OG image or use the Ways to Work image. These can be SVGs in `/public/images/og/` following the existing blog image pattern, or generated dynamically using `next/og`.

---

## Summary

| Severity | Count | IDs |
|----------|-------|-----|
| Critical | 2 | SEO-001, SEO-006 |
| High | 7 | SEO-002, SEO-003, SEO-005, SEO-011, SEO-016, SEO-017, SEO-019, SEO-022, SEO-023 |
| Medium | 7 | SEO-004, SEO-007, SEO-008, SEO-013, SEO-015, SEO-018, SEO-024 |
| Low | 5 | SEO-010, SEO-012, SEO-014, SEO-020, SEO-025 |

### Top 5 Actions Before Implementation

1. **Resolve /pub-rescue redirect conflict** (SEO-001) — decide whether it's a standalone page or redirect, update next.config.js and keyword plan accordingly
2. **Fix Instagram/Facebook redirect chains** (SEO-006) — update both page.tsx files to redirect directly to `/capabilities` when Phase 4 ships
3. **Add SEO overrides for all new pages** (SEO-022, SEO-023, SEO-024) — write meta titles and descriptions before pages go live
4. **Update sitemap.ts** (SEO-007, SEO-008, SEO-019) — remove redirected URLs, add new pages
5. **Update homepage meta description** (SEO-005) — remove £75/hr pricing reference before Phase 3 ships
