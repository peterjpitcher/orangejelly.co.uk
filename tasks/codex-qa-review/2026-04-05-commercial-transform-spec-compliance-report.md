Overall verdict: Partial compliance.

Audit target: [2026-04-05-commercial-transformation-design.md](/Users/peterpitcher/Cursor/OJ-OrangeJelly.co.uk/docs/superpowers/specs/2026-04-05-commercial-transformation-design.md)

Primary findings:
- The rollout plan violates the brief's full-replacement rule by surfacing `Ways to Work` alongside `Services` and delaying some CTA cleanup until Phase 5.
- Payment plan visibility deviates from the brief because package cards explicitly omit it.
- Discovery scope, discovery questions, and required deliverables are not fully specified as required.
- The CMS model is incomplete for proof/case-study and CTA content types.
- The implementation phase model does not match the brief's required 7-phase structure.

### SPEC-001: Full Replacement
- **Brief Reference:** Section 3.1
- **Requirement:** The new package model must replace all primary offer language, conflicting service framings, and legacy commercial routes.
- **Design Reference:** Section 1 Project Summary; Section 2 Approach; Section 10 Implementation Phases
- **Status:** Deviated
- **Severity:** Critical
- **Description:** The end-state is replacement-led, but the rollout explicitly keeps `Services` alongside `Ways to Work` in Phase 2 and leaves some legacy CTA pathways until Phase 5.
- **Impact:** Prospects can encounter competing offer models during rollout, weakening clarity and conversion.

### SPEC-002: One Buying Model
- **Brief Reference:** Section 3.2
- **Requirement:** Packages must come first, capabilities second, proof must support packages, and specialist/SEO pages must feed into packages rather than compete.
- **Design Reference:** Section 5 New Sitemap; Section 6 Page Structures; Section 8 Funnel
- **Status:** Compliant
- **Severity:** Low
- **Description:** The IA puts `Ways to Work` first, uses `Capabilities` as supporting detail, positions `Results` as proof, and routes problem/SEO pages into package pages.
- **Impact:** No material gap.

### SPEC-003: Strategy As Core Value
- **Brief Reference:** Section 3.3
- **Requirement:** The offer must sell commercial direction, prioritisation, and momentum planning rather than unlimited production.
- **Design Reference:** Section 3 New Package Model; Section 4 Package Inclusion Logic; Section 7 capabilities.json
- **Status:** Compliant
- **Severity:** Low
- **Description:** The package purposes and inclusion logic consistently emphasise diagnosis, planning, prioritisation, reporting, and playbooks.
- **Impact:** No material gap.

### SPEC-004: Content Creation Not Assumed
- **Brief Reference:** Section 3.4
- **Requirement:** Social content planning may be included, but content production must remain separately controlled.
- **Design Reference:** Section 4 Content Creation Boundaries; Section 4 package inclusions; Section 6 Capabilities
- **Status:** Compliant
- **Severity:** Low
- **Description:** The design separates strategy, light production, and production, and keeps heavy production as add-on or separate scope.
- **Impact:** No material gap.

### SPEC-005: Turnaround Intensive Includes Website Rebuild
- **Brief Reference:** Section 3.5
- **Requirement:** Turnaround Intensive must include a lean website rebuild with tightly defined boundaries.
- **Design Reference:** Section 3 Package 4; Section 6 Package Detail Pages; Section 11 Turnaround Intensive Website Rebuild Scope
- **Status:** Compliant
- **Severity:** Low
- **Description:** The package explicitly includes a lean rebuild and defines both included scope and excluded scope.
- **Impact:** No material gap.

### SPEC-006: Payment Plans As Offer Element
- **Brief Reference:** Section 3.6
- **Requirement:** Payment plans must be clearly communicated on package cards, detail pages, pricing page, FAQs, and enquiry forms.
- **Design Reference:** Section 6 Ways to Work; Section 6 Package Detail Pages; Section 6 Contact; Section 8 Payment Plan Visibility
- **Status:** Deviated
- **Severity:** High
- **Description:** The design covers pricing page, detail pages, FAQs, and forms, but explicitly excludes payment plans from package cards.
- **Impact:** A non-negotiable offer element is missing at the main comparison touchpoint.

### SPEC-007: Capability Stack Coverage
- **Brief Reference:** Section 5
- **Requirement:** The capability stack must include all 10 required capabilities.
- **Design Reference:** Section 7 capabilities.json
- **Status:** Compliant
- **Severity:** Low
- **Description:** All 10 required capabilities are present: growth strategy, event/offer marketing, organic social direction, paid social, content planning/creative direction, content production, local visibility, website/booking optimisation, tools/tracking/reporting, and playbooks/standards/team clarity.
- **Impact:** No material gap.

### SPEC-008: Four-Layer Package Rules
- **Brief Reference:** Section 6
- **Requirement:** Every package must show Included, Light-touch, Add-on, and Not included.
- **Design Reference:** Section 4 Layer Definitions; Section 6 Package Detail Pages
- **Status:** Compliant
- **Severity:** Low
- **Description:** The four layers are defined globally and included in the shared package detail template. The design uses progressive disclosure rather than showing all four on cards.
- **Impact:** No material gap if detail pages remain the canonical package explanation.

### SPEC-009: Detailed Package Inclusion Logic
- **Brief Reference:** Section 7
- **Requirement:** Growth Fix, Momentum Month, Growth Partner, and Turnaround Intensive must each define detailed four-layer inclusions.
- **Design Reference:** Section 4 Growth Fix; Momentum Month; Growth Partner; Turnaround Intensive - Inclusions
- **Status:** Compliant
- **Severity:** Low
- **Description:** All four packages have explicit Included, Light-touch, Add-on, and Not included lists.
- **Impact:** No material gap.

### SPEC-010: Social Media Content Creation Rule
- **Brief Reference:** Section 8
- **Requirement:** The design must distinguish strategy, light production, and production, with production always separate.
- **Design Reference:** Section 4 Content Creation Boundaries; Section 6 Capabilities
- **Status:** Compliant
- **Severity:** Low
- **Description:** The three-level model is explicit and repeated in package and capability presentation.
- **Impact:** No material gap.

### SPEC-011: Turnaround Website Rebuild Boundaries
- **Brief Reference:** Section 9
- **Requirement:** The lean reset scope and the separate-scope exclusions must be explicitly defined.
- **Design Reference:** Section 6 Package Detail Pages; Section 11 Turnaround Intensive Website Rebuild Scope
- **Status:** Compliant
- **Severity:** Low
- **Description:** The document covers the required page-count, template-led/mobile-first/CMS-managed constraints, proof/contact flow, SEO, analytics, one amend round, selective reuse, and the separate-scope exclusions.
- **Impact:** No material gap.

### SPEC-012: No Mixed Commercial Environment At Launch
- **Brief Reference:** Section 10
- **Requirement:** The site must not launch with old service pillars, conflicting solution promises, duplicated pricing logic, competing CTA pathways, clashing proof wording, or mixed navigation/footer structures.
- **Design Reference:** Section 6 Problem Pages; Results; Blog Posts; Regional Pages; Section 7 Claims Governance Rules; Section 10 Phases 2-5
- **Status:** Deviated
- **Severity:** Critical
- **Description:** The end-state addresses several items, but the rollout still introduces public mixed states: `Services` remains in nav in Phase 2, old pages remain live, and blog/regional CTA cleanup is deferred to Phase 5.
- **Impact:** Users can still enter outdated commercial routes and receive inconsistent offer signals during rollout.

### SPEC-013: Claims Governance
- **Brief Reference:** Section 11
- **Requirement:** Master claims must be defined, centrally stored, standardised, and reused across the correct pages from a single source of truth.
- **Design Reference:** Section 7 claims.json; Section 7 Claims Governance Rules; Section 6 Homepage; Package Detail Pages; Problem Pages; Results
- **Status:** Compliant
- **Severity:** Low
- **Description:** Claims are centralized in `claims.json`, rendered via `<Claim>`, linked to packages/capabilities, and reused across major proof surfaces.
- **Impact:** No material gap.

### SPEC-014: Payment Plan Placement Coverage
- **Brief Reference:** Section 12
- **Requirement:** Payment plans must be visible on package cards, package detail pages, pricing/Ways to Work, FAQs, and enquiry forms, not buried in legal copy.
- **Design Reference:** Section 6 Ways to Work; Section 6 Package Detail Pages; Section 6 Contact; Section 8 Payment Plan Visibility
- **Status:** Deviated
- **Severity:** High
- **Description:** Coverage is 4 out of 5 required placements. The document explicitly states payment plans will not appear on package cards.
- **Impact:** Users comparing packages on the main pricing surface may miss financing flexibility and drop earlier.

### SPEC-015: Discovery Scope Workstreams
- **Brief Reference:** Section 13
- **Requirement:** Discovery must cover current-state audit, information architecture, UX/conversion, CMS/content model, technical approach, SEO/migration, and commercial rules.
- **Design Reference:** Section 5 Site Architecture; Section 6 Page Structures; Section 7 Data Model; Section 8 Conversion Architecture; Section 9 SEO Migration Plan; Section 10 Implementation Phases
- **Status:** Partial
- **Severity:** High
- **Description:** The document contains content relevant to IA, UX/conversion, CMS, SEO/migration, commercial rules, and some technical approach, but it does not define a discrete discovery scope and omits a clear current-state audit workstream.
- **Impact:** The project can proceed without the structured discovery gate the brief requires.

### SPEC-016: Discovery Questions
- **Brief Reference:** Section 14
- **Requirement:** The 10 discovery questions the developer must answer must be included.
- **Design Reference:** NOT FOUND
- **Status:** Missing
- **Severity:** High
- **Description:** There is no discovery question set and no answered-question appendix.
- **Impact:** Core assumptions remain unvalidated and hard to track through implementation.

### SPEC-017: Required Deliverables
- **Brief Reference:** Section 15
- **Requirement:** The document must include the 9 required deliverables.
- **Design Reference:** Section 5 Site Architecture; Section 6 Page Structures; Section 7 Data Model; Section 7 Claims Governance Rules; Section 9 SEO Migration Plan; Section 10 Implementation Phases; Section 12 Risk Register
- **Status:** Partial
- **Severity:** High
- **Description:** Sitemap, page structures, CMS/data model, claims governance, SEO migration, technical implementation, and risk coverage are present. A current-state commercial audit is absent, and there is no explicit replacement map tying every legacy route/offer/promise to its replacement.
- **Impact:** Reviewers cannot verify full commercial replacement or implementation readiness end to end.

### SPEC-018: Recommended Page Structure
- **Brief Reference:** Section 16
- **Requirement:** The design must include Homepage, Ways to Work/Pricing, Capabilities, package detail pages, Results/proof, and Guides/solution pages.
- **Design Reference:** Section 5 New Sitemap; Section 6 Homepage; Ways to Work; Package Detail Pages; Capabilities; Problem Pages; Results; Blog Posts
- **Status:** Compliant
- **Severity:** Low
- **Description:** All required page groups appear in the sitemap and page-structure definitions.
- **Impact:** No material gap.

### SPEC-019: CMS Content Types And Fields
- **Brief Reference:** Section 17
- **Requirement:** The CMS/content model must define Package, Capability, Add-on, Proof/case study, and CTA content types, each with required fields.
- **Design Reference:** Section 7 packages.json; capabilities.json; add-ons.json; claims.json; Section 6 page structures
- **Status:** Partial
- **Severity:** High
- **Description:** Package, Capability, and Add-on are modeled well. Proof is reduced to governed claims rather than a distinct case-study content type, and CTA is not modeled as a content type at all; it remains static/constants-driven.
- **Impact:** Content governance and future editing flexibility will be weaker than the brief requires.

### SPEC-020: Functional Requirements
- **Brief Reference:** Section 18
- **Requirement:** The design must support reusable package cards, better-than-tick-box comparison logic, reusable claims/proof, clear CTA routing, package-aware forms, WhatsApp-first, strong mobile UX, visible proof, simple add-ons, and future pricing changeability.
- **Design Reference:** Section 6 Ways to Work; Package Detail Pages; Contact; Section 7 Components; Section 8 Funnel; CTA Strategy; Contact Mechanisms; Section 10 mobile QA
- **Status:** Compliant
- **Severity:** Low
- **Description:** The functional model is componentized, package-aware, WhatsApp-first, proof-driven, add-on friendly, mobile-tested, and JSON-driven for future pricing changes.
- **Impact:** No material gap.

### SPEC-021: Implementation Phase Model
- **Brief Reference:** Section 19
- **Requirement:** The project must use the 7 phases: Discovery, Architecture/CMS, Wireframes, Content mapping, Build, Migration/QA, and Launch.
- **Design Reference:** Section 10 Implementation Phases
- **Status:** Deviated
- **Severity:** High
- **Description:** The design defines 5 rollout phases (`Foundation`, `Add`, `Rewrite`, `Consolidate`, `Polish`) instead of the required 7 phases. Discovery, wireframes, content mapping, explicit migration/QA, and launch gating are not represented as required phase objects.
- **Impact:** Delivery controls and approvals will not align with the brief's implementation model.

### SPEC-022: Risk Coverage
- **Brief Reference:** Section 20
- **Requirement:** The document must flag 8 risks.
- **Design Reference:** Section 12 Risk Register
- **Status:** Compliant
- **Severity:** Low
- **Description:** The risk register contains 8 discrete risks with likelihood, impact, and mitigation.
- **Impact:** No material gap.

**Requirements Coverage Matrix**
| Brief Section | Coverage Summary | Status |
|---|---|---|
| 3 | 4/6 non-negotiables covered; full replacement rollout and payment-plan-on-cards deviate | Partial |
| 5 | 10/10 capability items covered | Compliant |
| 6 | 1/1 package rule covered through progressive disclosure | Compliant |
| 7 | 4/4 packages have detailed four-layer inclusion logic | Compliant |
| 8 | 1/1 social content creation rule covered | Compliant |
| 9 | 1/1 Turnaround rebuild scope and exclusions covered | Compliant |
| 10 | End-state mostly aligned, but rollout still allows mixed model states | Deviated |
| 11 | Claims governance model covered | Compliant |
| 12 | 4/5 required payment-plan placements covered; package cards missing | Deviated |
| 13 | 6/7 workstream topics appear implicitly; no explicit discovery scope/current-state audit | Partial |
| 14 | 0/10 discovery questions present | Missing |
| 15 | 6/9 deliverables explicit, 2 partial, 1 missing | Partial |
| 16 | 6/6 required page groups covered | Compliant |
| 17 | 3/5 content types explicit; proof partial; CTA missing | Partial |
| 18 | Functional requirements covered | Compliant |
| 19 | 5 custom phases instead of required 7-phase model | Deviated |
| 20 | 8/8 risks present by count | Compliant |

Overall section-level result: 12 Compliant, 4 Partial, 5 Deviated, 1 Missing.