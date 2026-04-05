# Architecture Review: Commercial Website Transformation Design Spec

**Reviewed:** 2026-04-05
**Spec:** `docs/superpowers/specs/2026-04-05-commercial-transformation-design.md`
**Reviewer:** Claude (Senior Technical Architect)
**Verdict:** Spec is strong overall — well-structured progressive disclosure model, sound SEO migration strategy, and realistic phasing. However, there are 22 findings that need resolution before a developer can build without making assumptions.

---

## Critical Findings

### ARCH-001: Redirect chain on /pub-rescue will break
- **Area:** Migration
- **Severity:** Critical
- **Finding:** `next.config.js` already contains a 301 redirect from `/pub-rescue` to `/fix-my-pub`. The design spec lists `/pub-rescue` as a standalone problem page that "Routes to Turnaround Intensive" and preserves the "pub rescue package" keyword (50/mo). The spec says it is "Rewritten in place" (Section 9, URL Migration Map). However, the existing redirect means `/pub-rescue` currently does not render — it 301s to `/fix-my-pub`. The spec never mentions removing this redirect. If the redirect stays, the `/pub-rescue` page cannot exist. If it is removed, there is a period where Google has already been told it permanently moved — reclaiming it requires care.
- **Recommendation:** The spec must explicitly state: (1) Remove the existing `/pub-rescue -> /fix-my-pub` redirect in `next.config.js`. (2) Restore `/pub-rescue` as a standalone page. (3) Note the SEO risk — Google may take weeks to re-index after a 301 reversal. Add this to the risk register.

### ARCH-002: Service sub-pages missing from redirect map create 404s
- **Area:** Migration
- **Severity:** Critical
- **Finding:** The sitemap currently lists 5 service sub-pages: `services/social-media-marketing-for-pubs`, `services/instagram-services-for-pubs`, `services/facebook-services-for-pubs`, `services/paid-social-for-pubs`, `services/content-creation-for-pubs`. The spec's redirect map only covers 3 of these (social-media, paid-social, content-creation). **`/services/instagram-services-for-pubs` and `/services/facebook-services-for-pubs` are completely missing from the redirect map.** These pages exist in the live sitemap and have live `page.tsx` files. Without redirects, they become 404s after Phase 4 removes orphaned content.
- **Recommendation:** Add 301 redirects for all 5 service sub-pages to the migration map. All should redirect to `/capabilities`.

### ARCH-003: Claim component spec is too vague to implement
- **Area:** Completeness
- **Severity:** Critical
- **Finding:** The `<Claim>` component is the cornerstone of the entire claims governance system, yet its spec is just one line: "Renders a governed metric by ID" with data source "claims.json". A developer does not know: (1) What props it accepts beyond `id` (display mode? short vs long? with/without source attribution?). (2) What it renders — just the metric text? The full `displayLong`? A tooltip with source? (3) How it behaves when the ID is not found — the spec says "renders nothing", but should it log a warning in dev? Show a placeholder in dev mode? (4) Whether it supports the `displayShort` vs `displayLong` distinction in the JSON schema. (5) How it integrates visually — inline text? Block element? What styling?
- **Recommendation:** Add a full component interface spec:
  ```typescript
  interface ClaimProps {
    id: string;
    variant?: 'short' | 'long' | 'metric-only';
    showSource?: boolean;
    className?: string;
  }
  ```
  Define fallback behaviour (dev warning + null render). Specify whether it's a Server Component that reads JSON at build time or a client component.

---

## High Severity Findings

### ARCH-004: PackageComparison component has no rendering spec
- **Area:** Completeness
- **Severity:** High
- **Finding:** The spec says the Ways to Work page includes a "Comparison" section with "Key differentiators per package (not tick-box grid)" using `packages.json + capabilities.json`. It also says the component uses "Progressive labels per capability per package." But there is no visual spec. The `defaultSupportLevel` in capabilities.json maps package IDs to values like `"included"`, but the spec never defines the full vocabulary of support levels (included, light-touch, add-on, not-included?). A developer cannot build this without guessing the visual treatment for each level.
- **Recommendation:** (1) Define the complete set of `defaultSupportLevel` values. (2) Define the visual treatment for each (icon? colour? label text?). (3) Clarify whether this is a table, card grid, or accordion. (4) Specify mobile behaviour — comparison tables notoriously break on small screens.

### ARCH-005: Blog CTA update for 74 posts — mechanism undefined
- **Area:** Completeness
- **Severity:** High
- **Finding:** Phase 5 says "Update CTAs on all 74 blog posts" and Section 8 defines three CTA types by content category (consumer, operator informational, operator commercial). But the spec does not define: (1) How blog posts are categorised into these three types. The existing frontmatter has a `category` field with values like "Revenue Growth", "Operations", "Marketing", "Staff Management" — none of which map to the spec's consumer/operator/commercial taxonomy. (2) Whether the CTA update happens in the BlogPost component (change the hardcoded CTA section once) or requires per-post frontmatter changes. (3) The current `BlogPost.tsx` has a hardcoded "Related services" section that links to `/services/instagram-services-for-pubs`, `/services/facebook-services-for-pubs`, and `/services/paid-social-for-pubs` — all pages being redirected away. This will produce links that 301 redirect. It must be updated.
- **Recommendation:** (1) Define a mapping from existing blog categories to the three CTA types, or add a new frontmatter field. (2) Specify whether the BlogPost component CTA section should be data-driven from frontmatter or a single component-level change. (3) Explicitly note that the "Related services" links in BlogPost.tsx must be updated in Phase 4 (not Phase 5) to avoid live 301-redirect links.

### ARCH-006: Contact form package pre-select has no implementation detail
- **Area:** Completeness
- **Severity:** High
- **Finding:** The spec says "Add package pre-select dropdown to form" and "package pre-selected from URL context." The existing `ContactForm.tsx` is a thin wrapper around a `contact-form` component. There is no spec for: (1) How URL context passes the package (query param? hash? path segment?). (2) The form field name and dropdown options. (3) Whether WhatsApp CTA on package pages should include the package name in the pre-filled message (the JSON has `ctaWhatsApp` but the form does not).
- **Recommendation:** Specify: URL format (`/contact?package=growth-partner`), dropdown populated from `packages.json`, and default selection logic.

### ARCH-007: ProofStrip component undocumented
- **Area:** Completeness
- **Severity:** High
- **Finding:** The component table lists `<ProofStrip>` as "Horizontal governed metrics display" from claims.json. It appears in the Homepage structure as "Proof strip: 4-5 governed metrics." There is no spec for: which claim IDs to display, how many, layout behaviour, responsive treatment, or whether the selection is hardcoded or configurable.
- **Recommendation:** Add props interface. At minimum: `claimIds: string[]` or `category: string` filter. Define layout (horizontal scroll on mobile? wrap? carousel?).

### ARCH-008: Massive scope of hardcoded "75/hour" references
- **Area:** Phasing
- **Severity:** High
- **Finding:** A codebase search reveals "75" pricing references in **40+ locations** across the codebase — in metadata descriptions, page content, constants, components, and structured data. The spec's Phase 3 says "Replace all hardcoded metrics sitewide with Claim references" but does not acknowledge this scale. Many of these are in metadata strings (`generateMetadata` calls), structured data, and SEO override files — not just visible page content. The `PRICING` constant in `constants.ts` is still set to `£75/hour`. This is a multi-day effort on its own.
- **Recommendation:** (1) Add a dedicated task to Phase 3 or 4: "Audit and update all £75/hour references." (2) The `PRICING` constant must be updated or removed. (3) Metadata descriptions on regional pages, service pages, and the homepage all contain "75/hr" — these must be rewritten. (4) Structured data (e.g., `priceRange`) must be updated. Estimate 1-2 days for this sweep alone.

### ARCH-009: Navigation and footer JSON schemas not defined
- **Area:** Data Model
- **Severity:** High
- **Finding:** Phase 1 says "Prepare updated navigation.json and footer.json (not deployed)." The spec defines the new navigation items (Section 5) and footer structure but never provides the JSON schema for these files. The existing `navigation.json` has a specific shape (`mainMenu`, `mobileMenu`, `whatsappCta`). The existing `footer.json` has `links.services`, `links.resources`, `links.company`, `links.solutions`, `links.locations`. The spec's new footer structure (Packages, Capabilities, Resources, Company, Locations) does not match the current schema at all.
- **Recommendation:** Provide the updated JSON structure for both files, or explicitly state which keys change and which are preserved.

---

## Medium Severity Findings

### ARCH-010: capabilities.json defaultSupportLevel values not enumerated
- **Area:** Data Model
- **Severity:** Medium
- **Finding:** The example shows `"growth-fix": "included"` but the package inclusion logic defines four layers: included, light-touch, add-on, not-included. The spec never explicitly states what string values `defaultSupportLevel` can take. A developer will guess, and inconsistency across 10 capabilities x 4 packages (40 cells) is likely.
- **Recommendation:** Define the enum: `"included" | "light-touch" | "add-on" | "not-included"`. Add a TypeScript type definition to the spec.

### ARCH-011: Package detail page "How it works" data is placeholder
- **Area:** Data Model
- **Severity:** Medium
- **Finding:** The packages.json schema includes a `process` array with `step`, `title`, `description`. The spec says each package detail page shows "3-4 step process specific to this package." But no actual process content is defined anywhere in the spec. Each package needs unique process steps. This is content that must be written.
- **Recommendation:** Either provide the process content for all 4 packages in the spec, or flag this as a content dependency that blocks Phase 2 deployment.

### ARCH-012: Add-ons list is incomplete
- **Area:** Data Model
- **Severity:** Medium
- **Finding:** The add-ons.json example shows one entry (Content Production). The package inclusion sections list multiple add-on items across packages (content production, posting/scheduling, paid social execution, community management, build work, filming days, CRM setup, automation builds, etc.). The spec does not provide the full list of add-on items for the JSON file.
- **Recommendation:** Enumerate all distinct add-on items that should appear in `add-ons.json`. Cross-reference against all four packages' add-on lists to ensure completeness.

### ARCH-013: Turnaround Intensive price field handling
- **Area:** Data Model
- **Severity:** Medium
- **Finding:** The Turnaround Intensive price is "To be validated in discovery." The packages.json schema requires `price.amount` (number) and `price.display` (string). What value goes in `amount` for a package with no confirmed price? The spec does not define how the display should render — "Price on application"? "From X"? The PackageCard and PackageComparison components need to handle this gracefully.
- **Recommendation:** Define: `amount: null`, `display: "Pricing confirmed in discovery"` or similar. Ensure components handle `null` amount without breaking sort/comparison logic.

### ARCH-014: claims.json does not cover all metrics in CLAUDE.md
- **Area:** Data Model
- **Severity:** Medium
- **Finding:** The CLAUDE.md lists 8 approved metrics: quiz_night, food_gp, social_media, database, value_added, sunday_savings, tasting_retention, ai_time_saved. The claims.json example only shows `food-gp-growth`. The spec says "Only metrics from CLAUDE.md are permitted" but does not provide the full claims.json content for all 8 metrics.
- **Recommendation:** Provide the complete claims.json with all 8 metrics fully populated (id, metric, context, displayShort, displayLong, source, category, relatedPackages, relatedCapabilities).

### ARCH-015: Phase 1 timeline of 1-2 weeks is tight
- **Area:** Phasing
- **Severity:** Medium
- **Finding:** Phase 1 requires: 4 JSON data files with complete content, 9 new components (Claim, PackageCard, PackageComparison, PackageDetail, PaymentPlanBanner, PackageCTA, CapabilityGrid, AddOnList, ProofStrip), updated navigation.json and footer.json, and unit tests for all components. That is approximately 13-15 deliverables. At a pace of ~1 component per day including tests, this is 2-3 weeks minimum for a single developer.
- **Recommendation:** Either extend to 2-3 weeks, or split Phase 1 into Phase 1a (data files + core components: Claim, PackageCard, PackageDetail) and Phase 1b (comparison, grid, and auxiliary components).

### ARCH-016: Phases 3+4 same-week shipping is risky
- **Area:** Phasing
- **Severity:** Medium
- **Finding:** Phase 3 (rewrite homepage, pub-marketing-agency, 6 problem pages, results, contact, plus full metric sweep) is spec'd at 1 week. Phase 4 (nav swap, footer swap, redirects, cleanup, sitemap) is spec'd at 2-3 days. Together that is 7-10 working days of changes that must ship in the same week. The homepage rewrite alone — given the current page has deeply embedded `£75/hour` references, structured data, and FAQ schema — is likely 2-3 days.
- **Recommendation:** Acknowledge that "same week" means "same deployment window" — not necessarily calendar week. Consider a feature flag or staging branch where both phases are prepared in advance and merged together.

### ARCH-017: Sitemap update scope is underspecified
- **Area:** Completeness
- **Severity:** Medium
- **Finding:** Phase 4 says "Update sitemap.ts" but the current sitemap includes all 5 service sub-pages and the `/services` parent page. The update must: (1) Remove all `/services/*` entries. (2) Add `/ways-to-work` and 4 sub-pages. (3) Add `/capabilities`. (4) Keep all problem pages, regional pages, blog pages unchanged. The spec does not list these specific changes.
- **Recommendation:** Add a sitemap change checklist to Phase 4.

### ARCH-018: No structured data / schema.org spec for new pages
- **Area:** Missing
- **Severity:** Medium
- **Finding:** The existing site uses structured data extensively (FAQSchema, ProductSchema, EventSchema, AggregateRatingSchema, BreadcrumbJsonLd). The new pages — especially Ways to Work, package detail pages, and capabilities — have no structured data requirements defined. Package detail pages could benefit from `Product` or `Service` schema. The Ways to Work page could use `ItemList` schema.
- **Recommendation:** Define schema.org requirements for each new page type. At minimum: `Service` schema on package detail pages, `BreadcrumbList` on all new pages.

---

## Low Severity Findings

### ARCH-019: Icon system for capabilities undefined
- **Area:** Missing
- **Severity:** Low
- **Finding:** capabilities.json has an `icon` field (e.g., `"strategy"`). The spec does not define the icon set or how icons map to visual assets. The existing codebase has `JourneyIcons.tsx` but no general icon system.
- **Recommendation:** Define the icon set (Lucide? Heroicons? Custom SVGs?) and provide the mapping for all 10 capability icons.

### ARCH-020: Loading and error states not specified
- **Area:** Missing
- **Severity:** Low
- **Finding:** Per CLAUDE.md and workspace rules, every data-driven UI must handle loading, error, and empty states. The spec defines no loading or error states for any new component. Since the data is JSON (not async), loading states are less critical — but error states for missing data (e.g., claim ID not found, package slug not matching) need definition.
- **Recommendation:** Add error handling behaviour to component specs. For server components reading static JSON, define build-time validation that catches missing references.

### ARCH-021: Responsive behaviour unspecified for key components
- **Area:** Missing
- **Severity:** Low
- **Finding:** PackageCard (4 across), CapabilityGrid (10 items), and PackageComparison have no mobile layout spec. The existing site uses `Grid` with responsive column props (`{ default: 1, md: 2 }`). The new components need similar treatment but the spec does not define breakpoints.
- **Recommendation:** Add responsive layout notes: PackageCards (1 col mobile, 2 col tablet, 4 col desktop), CapabilityGrid (1 col mobile, 2 col tablet, 3-5 col desktop), Comparison (stacked cards on mobile, table on desktop).

### ARCH-022: Content creation boundaries — no component spec
- **Area:** Commercial
- **Severity:** Low
- **Finding:** The spec defines a three-layer content creation model (strategy, light production, production) and says it should appear on the Capabilities page as a "Content creation explainer." But there is no component defined for this. It is listed as "Static" content. Given this is a critical commercial safeguard against the "content creation assumed included" risk, it deserves its own reusable component that can be referenced on package detail pages too.
- **Recommendation:** Consider a `<ContentBoundaryExplainer>` component or at minimum provide the copy/layout spec for this section so it is not improvised.

---

## Commercial Risk Assessment

### COMM-001: Mixed messaging window is narrower than spec implies
- **Area:** Commercial
- **Severity:** High
- **Finding:** Between Phase 2 (new pages live) and Phase 4 (old pages removed), the site will have BOTH pricing models live simultaneously. The spec mitigates this by shipping Phases 3+4 in the same week, but Phase 2 already creates a mixed environment. During Phase 2, the old `/services` page still says "75/hour", while `/ways-to-work` says "From 375 + VAT" for packages. A prospect could see both.
- **Recommendation:** Consider not adding "Ways to Work" to the main navigation in Phase 2. Instead, only make the pages accessible by direct URL for testing. Deploy navigation change only in Phase 4 alongside old page removal.

### COMM-002: Turnaround Intensive scope creep is partially mitigated but still at risk
- **Area:** Commercial
- **Severity:** Medium
- **Finding:** Section 11 defines website rebuild scope well, but the boundary between "lean website rebuild" (included) and "bespoke development" (separate) is inherently fuzzy. The spec does not define what "template-led" means in practice — is it a Next.js template? WordPress? Squarespace? The answer significantly changes the Turnaround Intensive pricing.
- **Recommendation:** Add a clarifying note: "Template-led = [specific platform/approach]. Anything requiring custom development beyond this template is out of scope."

### COMM-003: Content creation boundary copy must be reviewed by Peter
- **Area:** Commercial
- **Severity:** Medium
- **Finding:** The three-layer content model is well-structured in the spec, but the actual customer-facing copy that communicates these boundaries does not exist yet. Poor wording could either (a) make OJ sound restrictive and put prospects off, or (b) leave enough ambiguity that clients still assume content production is included. This is flagged in the brief's risk register but the mitigation ("explicit on capabilities page and package details") depends entirely on copy quality.
- **Recommendation:** Draft the customer-facing copy for the three-layer model and get Peter's sign-off before development. This is a content dependency, not a code dependency.

---

## Summary

| Severity | Count |
|----------|-------|
| Critical | 3 |
| High | 6 |
| Medium | 8 |
| Low | 4 |
| Commercial | 3 (1 High, 2 Medium) |
| **Total** | **22** (including 2 that overlap commercial + technical) |

### Top 5 Actions Before Development Starts

1. **Fix the /pub-rescue redirect conflict** (ARCH-001) — this will cause a 404 or redirect loop if not addressed
2. **Add missing service page redirects** (ARCH-002) — instagram and facebook service pages will 404
3. **Write full Claim component interface** (ARCH-003) — this blocks all claims-governed rendering
4. **Define PackageComparison visual treatment and support level enum** (ARCH-004, ARCH-010) — blocks the centrepiece of the Ways to Work page
5. **Audit and plan for 40+ hardcoded pricing references** (ARCH-008) — this is a much larger effort than the spec implies

### What Is Good

- SEO migration strategy is conservative and sound — preserving all high-value URLs
- Progressive disclosure model (cards -> detail pages -> capabilities) is well-thought-out
- claims.json governance model is excellent — single source of truth with quarterly review
- Package structure and inclusion logic is comprehensive and clearly differentiated
- Phasing order is correct (foundation -> add -> rewrite -> consolidate -> polish)
- Risk register covers the right risks
