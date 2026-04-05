# QA Review Report — Commercial Transformation Design Spec

**Scope:** `docs/superpowers/specs/2026-04-05-commercial-transformation-design.md`
**Date:** 2026-04-05
**Mode:** Spec Compliance Review (design vs brief)
**Engines:** Claude (Architecture + SEO) + Codex (Spec Compliance — pending)
**Spec:** Original transformation brief (22 sections)

---

## Executive Summary

The design spec is architecturally sound and covers the vast majority of the brief's requirements. The incremental transformation approach, progressive disclosure model, claims governance system, and SEO migration strategy are all well-conceived. However, the review found **3 critical issues, 9 high-severity gaps, and 10 medium findings** that need resolution before a developer can build confidently.

The critical issues are all migration-related: an existing redirect on `/pub-rescue` that conflicts with the design, a redirect chain risk on service pages, and the `<Claim>` component being too vague to implement. The high-severity gaps are primarily **missing implementation detail** — component interfaces, responsive behaviour, structured data, and the massive scope of replacing 40+ hardcoded "£75/hour" references.

| Severity | Count | Summary |
|----------|-------|---------|
| Critical | 3 | Redirect conflicts, redirect chains, Claim component too vague |
| High | 9 | Component specs incomplete, blog CTA mechanism undefined, pricing reference sweep underestimated, nav/footer schemas missing, meta/OG missing for new pages |
| Medium | 10 | Data model enums, process content placeholder, add-ons list incomplete, phasing tight, sitemap changes, structured data, capability icons |
| Low | 4 | Responsive layouts, error states, content creation component, icon system |

---

## Critical Findings

### CRIT-001: /pub-rescue already 301 redirects to /fix-my-pub
**Engines:** Claude (Architecture + SEO — agreed)
**Finding:** `next.config.js` contains a permanent 301 redirect from `/pub-rescue` to `/fix-my-pub`. The design spec treats `/pub-rescue` as a standalone page that routes to Turnaround Intensive and targets "pub rescue package" (50/mo). This page cannot exist while the redirect is in place.
**Impact:** If the redirect stays, the design's keyword assignment and conversion routing for `/pub-rescue` are impossible. If removed carelessly, Google may take weeks to re-index after a 301 reversal.
**Fix:** (1) Remove the redirect from `next.config.js`. (2) Restore `/pub-rescue` as a standalone page. (3) Add to risk register: "Google may delay re-indexing after 301 reversal." (4) Consider whether `/pub-rescue` should remain separate or whether its keyword target ("pub rescue package" 50/mo) can be absorbed into `/fix-my-pub`.

### CRIT-002: Redirect chain on service pages (3-hop)
**Engines:** Claude (SEO)
**Finding:** Instagram and Facebook service pages already redirect to `/services/social-media-marketing-for-pubs` (Q1 work). The design adds a further redirect from `/services/social-media-marketing-for-pubs` to `/capabilities`. This creates a 3-hop chain: `/services/instagram-services-for-pubs` → `/services/social-media-marketing-for-pubs` → `/capabilities`. Google tolerates chains but devalues them — link equity leaks at each hop.
**Fix:** Update the Q1 Instagram and Facebook redirects to point directly to `/capabilities` (skip the intermediate). Ensure no chain exceeds 2 hops.

### CRIT-003: Claim component spec is too vague to implement
**Engines:** Claude (Architecture)
**Finding:** The `<Claim>` component is the cornerstone of claims governance but its spec is one line: "Renders a governed metric by ID." A developer doesn't know: what props it accepts, what it renders (short vs long?), how it handles missing IDs, whether it's a server or client component, or how it integrates visually.
**Fix:** Add full component interface:
```typescript
interface ClaimProps {
  id: string;
  variant?: 'short' | 'long' | 'metric-only';
  showSource?: boolean;
  className?: string;
}
```
Define: Server Component, reads JSON at build time. Missing ID = dev warning + null render. Inline by default (spans), block when `variant="long"`.

---

## High Findings

### HIGH-001: PackageComparison component has no rendering spec
**Engine:** Claude (Architecture)
**Finding:** The comparison section is described as "progressive labels per capability per package" and "not tick-box grid" — but no visual treatment, vocabulary of labels, layout format, or mobile behaviour is defined.
**Fix:** Define the support level enum (`included | light-touch | add-on | not-included`), visual treatment per level (colour/icon/label), layout (table desktop, stacked cards mobile), and responsive breakpoints.

### HIGH-002: Blog CTA update mechanism undefined for 74 posts
**Engine:** Claude (Architecture)
**Finding:** Phase 5 updates 74 blog CTAs but doesn't define: how posts are categorised (consumer/operator/commercial), whether the change is in the BlogPost component or per-post frontmatter, or that the existing BlogPost.tsx hardcodes links to service pages being redirected. Those links must be updated in Phase 4, not Phase 5.
**Fix:** (1) Map existing blog categories to the three CTA types. (2) Make the BlogPost CTA section data-driven from a single component change. (3) Move "Related services" link update to Phase 4.

### HIGH-003: 40+ hardcoded "£75/hour" references across codebase
**Engine:** Claude (Architecture)
**Finding:** Pricing references appear in metadata descriptions, page content, constants, components, structured data, and SEO overrides — 40+ locations. Phase 3 says "replace all hardcoded metrics" but underestimates the scope. This is a 1-2 day sweep on its own.
**Fix:** Add a dedicated pricing sweep task to Phase 3. Update `PRICING` constant. Audit all `generateMetadata` calls, SEO overrides, and structured data.

### HIGH-004: Navigation and footer JSON schemas not defined
**Engine:** Claude (Architecture)
**Finding:** The spec defines new nav and footer structures but doesn't provide the JSON schema. The existing schemas don't match the new structure (e.g., footer has `links.solutions` which doesn't exist in the new model).
**Fix:** Provide the updated JSON structure for both files.

### HIGH-005: Keywords on redirected service pages not recaptured
**Engine:** Claude (SEO)
**Finding:** "Social media for pubs" (50/mo) and "pub advertising" (50/mo) are assigned to pages being 301-redirected to `/capabilities`. But `/capabilities` has no defined meta title, description, or keyword targeting to recapture these terms.
**Fix:** Define meta title/description for `/capabilities` that includes "social media for pubs" and related terms.

### HIGH-006: No meta titles/descriptions for any of the 6 new pages
**Engine:** Claude (SEO)
**Finding:** Ways to Work, 4 package detail pages, and Capabilities have no SEO metadata specified.
**Fix:** Define title and description for each. Suggested:
- `/ways-to-work`: "Pub Marketing Packages — Clear Pricing, Real Expertise | Orange Jelly"
- `/ways-to-work/growth-fix`: "Growth Fix — Solve One Pub Problem Fast | From £375 + VAT"
- `/ways-to-work/growth-partner`: "Growth Partner — Ongoing Pub Marketing Support | Orange Jelly"
- `/ways-to-work/turnaround-intensive`: "Pub Turnaround Intensive — 30-Day Commercial Reset | Orange Jelly"
- `/capabilities`: "Pub Marketing Capabilities — Full Digital Support Stack | Orange Jelly"

### HIGH-007: No structured data for new pages
**Engine:** Claude (SEO + Architecture)
**Finding:** Existing site uses extensive schema.org markup. New pages have none defined. Package detail pages should use `Service` schema. Ways to Work should use `ItemList`. All new pages need `BreadcrumbList`.
**Fix:** Add structured data requirements per page type.

### HIGH-008: /capabilities has no inbound internal links from blog content
**Engine:** Claude (SEO)
**Finding:** After redirects, `/capabilities` absorbs link equity from service pages but has no direct links from the 74 blog posts or hub pages. This weakens its ability to rank for the redirected keywords.
**Fix:** Add `/capabilities` to the blog CTA rotation and include links from the pub marketing hub.

### HIGH-009: Homepage meta description still references old pricing
**Engine:** Claude (SEO)
**Finding:** The current homepage meta (updated in Q1) includes "hospitality marketing" targeting but the page content and structured data still embed "£75/hour" references that will conflict with the package model.
**Fix:** Covered by HIGH-003 pricing sweep, but flag homepage as first priority.

---

## Medium Findings

### MED-001: capabilities.json support level values not enumerated
Define the enum: `"included" | "light-touch" | "add-on" | "not-included"`. Add TypeScript type.

### MED-002: Package process steps are placeholder
"How it works" section on each package detail page needs content written for all 4 packages. Flag as content dependency for Phase 2.

### MED-003: Add-ons list incomplete
Only one example in spec. Cross-reference all four packages' add-on sections and enumerate the full list.

### MED-004: Turnaround Intensive price handling undefined
Define: `amount: null`, `display: "Pricing confirmed after diagnostic"`. Ensure components handle null gracefully.

### MED-005: claims.json only has 1 of 8 approved metrics
Provide the complete file with all 8 CLAUDE.md metrics fully populated.

### MED-006: Phase 1 timeline is tight (1-2 weeks for 15 deliverables)
Recommend 2-3 weeks, or split into Phase 1a (data + core components) and 1b (auxiliary components).

### MED-007: Phases 3+4 same-week shipping is ambitious
Consider a feature branch where both phases are prepared in advance and deployed together.

### MED-008: Sitemap update scope not detailed
List specific additions and removals for sitemap.ts.

### MED-009: Potential cannibalisation between /capabilities and existing blog posts
"Social media for pubs" keyword on /capabilities could compete with social-media-strategy-for-pubs blog post. Ensure differentiation through content type (service page vs guide).

### MED-010: /pub-marketing-no-budget messaging conflict
Currently positioned around "no budget" / free tactics. Routing to Growth Fix (from £375) creates a disconnect. Needs transitional copy: "Even with a tight budget, a focused Growth Fix can deliver..."

---

## Low Findings

### LOW-001: Responsive layouts unspecified for key components
Add breakpoint notes: PackageCards (1→2→4 col), CapabilityGrid (1→2→5 col), Comparison (stacked→table).

### LOW-002: Error states not defined
For server components reading static JSON, add build-time validation. Define fallback for missing claim IDs, invalid package slugs.

### LOW-003: Content creation boundaries have no dedicated component
The three-layer content model (strategy/light production/production) needs a visual component for the capabilities page. Not defined.

### LOW-004: Icon system for capabilities undefined
Define the icon set (Lucide recommended — already common in Next.js projects) and provide mappings for all 10 capabilities.

---

## Recommendations — Priority Order

### Must Fix Before Implementation (Critical + High)

1. **Resolve /pub-rescue redirect conflict** — decide: keep as standalone or merge into /fix-my-pub
2. **Fix redirect chains** — update Q1 Instagram/Facebook redirects to point to `/capabilities` directly
3. **Spec the Claim component fully** — TypeScript interface, variants, fallback behaviour
4. **Spec the PackageComparison component** — support level enum, visual treatment, mobile layout
5. **Define meta titles/descriptions for all 6 new pages**
6. **Define structured data for new pages**
7. **Add pricing sweep task to Phase 3** — acknowledge 40+ locations
8. **Define blog CTA update mechanism** — component-level change, move service link update to Phase 4
9. **Provide nav/footer JSON schemas**

### Should Fix Before Implementation (Medium)

10. Complete claims.json with all 8 metrics
11. Complete add-ons.json with full list
12. Write package process step content
13. Define Turnaround Intensive price handling
14. Extend Phase 1 to 2-3 weeks
15. Prepare Phases 3+4 on a feature branch

### Can Fix During Implementation (Low)

16. Add responsive layout notes to component specs
17. Define error handling behaviour
18. Add content creation boundaries component
19. Choose and map capability icons

---

## Codex Spec Compliance Findings (Additional)

The Codex GPT-5.4 spec compliance audit completed and found issues not caught by the Claude reviews:

### CODEX-CRIT: Rollout violates full-replacement rule (Brief 3.1)
**Engine:** Codex only
**Finding:** The design's Phase 2 explicitly keeps "Services" in navigation alongside "Ways to Work," and Phase 5 defers blog CTA cleanup. During this window, prospects encounter competing offer models. The brief's Section 3.1 says "replace ALL primary offer language" and Section 10 says "must not launch with mixed navigation."
**Impact:** The brief treats this as non-negotiable. The phased approach creates exactly the mixed environment the brief warns against.
**Fix:** Compress Phases 2-4 into a single deployment. New pages, rewrites, and legacy removal should go live together. The "additive then swap" approach is sound for development (feature branch) but the public-facing transition must be atomic.

### CODEX-HIGH-1: Payment plans missing from package cards (Brief 3.6)
**Engine:** Codex only
**Finding:** The brief says payment plans must be visible on "package cards, detail pages, pricing page, FAQs, enquiry forms." The design explicitly excludes payment plans from package cards ("Not on package cards — cards stay clean"). This contradicts a non-negotiable requirement.
**Fix:** Add a subtle line to package cards: "Payment plans available" beneath the price. Doesn't need to be prominent — just present.

### CODEX-HIGH-2: Discovery questions not answered (Brief 14)
**Engine:** Codex only
**Finding:** The brief lists 10 specific discovery questions the developer must answer. The design addresses most implicitly through its architecture and migration plan, but none are explicitly answered as a numbered list.
**Fix:** Add an appendix to the spec that explicitly answers each of the 10 discovery questions with references to the relevant spec sections.

### CODEX-HIGH-3: Required deliverables incomplete (Brief 15)
**Engine:** Codex only
**Finding:** Of the 9 required deliverables: current-state commercial audit is absent, replacement map is implicit but not explicit, and commercial risk note is embedded in the risk register rather than being a standalone section.
**Fix:** Add: (1) Current-state audit summary (can reference the earlier site audit from this session). (2) Explicit replacement map table: each current page/section → its fate. (3) Standalone commercial risk section addressing Option 4 pricing, package overlap, and payment plan operations.

### CODEX-HIGH-4: Implementation phases deviate from brief's 7-phase model (Brief 19)
**Engine:** Codex only
**Finding:** The brief specifies 7 phases (Discovery, Architecture/CMS, Wireframes, Content mapping, Build, Migration/QA, Launch). The design uses 5 phases (Foundation, Add, Rewrite, Consolidate, Polish). Discovery and wireframes are absent. Content mapping is implicit.
**Fix:** Either: (A) Map the design's 5 phases to the brief's 7-phase structure, showing where each brief phase is covered. Or (B) Reframe the design's phases to match the brief's model. Option A is more practical — the design's phases are implementation-focused while the brief's are discovery-focused. They're complementary, not conflicting.

### CODEX-HIGH-5: CMS model missing Proof/case-study and CTA content types (Brief 17)
**Engine:** Codex only
**Finding:** The brief requires 5 content types: Package, Capability, Add-on, Proof/case study, CTA. The design models Package, Capability, Add-on, and Claims — but Claims is a metric governance system, not a case study content type. The CTA is handled through constants, not a CMS content type.
**Fix:** (1) Add a `content/data/case-studies.json` separate from claims.json — case studies have challenge/action/result narratives, not just metrics. (2) Either model CTAs as a content type or explicitly justify why constants.ts is sufficient.

### Codex Coverage Matrix Summary
| Brief Section | Status |
|--------------|--------|
| 3.1 Full replacement | Deviated (rollout creates mixed state) |
| 3.2 One buying model | Compliant |
| 3.3 Strategy as core value | Compliant |
| 3.4 Content creation boundaries | Compliant |
| 3.5 Turnaround includes website | Compliant |
| 3.6 Payment plans | Deviated (missing from cards) |
| 5 Capability stack | Compliant |
| 6 Four-layer rules | Compliant |
| 7 Inclusion logic | Compliant |
| 8 Content creation rule | Compliant |
| 9 Website rebuild scope | Compliant |
| 10 Full replacement launch | Deviated (phased rollout) |
| 11 Claims governance | Compliant |
| 12 Payment plan visibility | Deviated (cards) |
| 13 Discovery scope | Partial |
| 14 Discovery questions | Missing |
| 15 Required deliverables | Partial |
| 16 Page structure | Compliant |
| 17 CMS content types | Partial |
| 18 Functional requirements | Compliant |
| 19 Implementation phases | Deviated |
| 20 Risk coverage | Compliant |

---

## Updated Severity Summary (All 3 Engines)

| Severity | Count | Sources |
|----------|-------|---------|
| Critical | 4 | 3 Claude + 1 Codex |
| High | 14 | 9 Claude + 5 Codex |
| Medium | 10 | Claude |
| Low | 4 | Claude |

---

## Updated Recommendations — Priority Order

### Must Fix Before Implementation

1. **Atomic public launch** — develop in phases but deploy Phases 2-4 together. No mixed commercial model visible to prospects. (CODEX-CRIT)
2. **Resolve /pub-rescue redirect** (CRIT-001)
3. **Fix redirect chains** — update Q1 redirects to point to `/capabilities` directly (CRIT-002)
4. **Full Claim component spec** (CRIT-003)
5. **Add payment plan line to package cards** — brief says non-negotiable (CODEX-HIGH-1)
6. **Add case-study content type** separate from claims (CODEX-HIGH-5)
7. **PackageComparison component spec** (HIGH-001)
8. **Define meta titles/descriptions for 6 new pages** (HIGH-006)
9. **Define structured data for new pages** (HIGH-007)
10. **Pricing sweep task** — acknowledge 40+ locations (HIGH-003)
11. **Blog CTA mechanism** — component-level change (HIGH-002)
12. **Nav/footer JSON schemas** (HIGH-004)
13. **Answer the 10 discovery questions explicitly** (CODEX-HIGH-2)
14. **Add current-state audit + replacement map** (CODEX-HIGH-3)
15. **Map design phases to brief's 7-phase model** (CODEX-HIGH-4)

### Should Fix Before Implementation

16-25: Medium findings (data model completions, phasing adjustments, sitemap details)

### Can Fix During Implementation

26-29: Low findings (responsive layouts, error states, icons, content creation component)

---

## Individual Specialist Reports

| Report | Location |
|--------|----------|
| Spec Compliance (Codex) | `tasks/codex-qa-review/2026-04-05-commercial-transform-spec-compliance-report.md` |
| Architecture Review (Claude) | `tasks/codex-qa-review/2026-04-05-commercial-transform-architecture-report.md` |
| SEO Migration Review (Claude) | `tasks/codex-qa-review/2026-04-05-commercial-transform-seo-report.md` |
| **Merged Report** | `tasks/codex-qa-review/2026-04-05-commercial-transform-codex-qa-report.md` |
