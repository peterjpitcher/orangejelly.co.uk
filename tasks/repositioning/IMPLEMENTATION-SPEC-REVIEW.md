# Developer review: repositioning implementation specification

**Review target:** `tasks/repositioning/IMPLEMENTATION-SPEC.md` version 1.0, 26 August 2026  
**Review date:** 27 August 2026  
**Audience:** developer, technical lead and delivery owner  
**Review type:** technical and delivery readiness review  
**Original specification changed:** no

## Executive assessment

**Overall readiness: red. The specification is not ready to govern the full build or a public launch.**

The strategy, URL preservation intent and workstream structure are strong. The specification also shows unusually good awareness of search risk. However, it is not yet complete enough to implement safely. It contains contradictory route and content counts, an impossible dependency order, an incoherent Phase 3 launch, incomplete form and data requirements, no implementable analytics contract, and no release or rollback plan.

The highest-risk problem is that Phase 3 claims to resolve the old and new positioning conflict while Phase 4 still contains the old commercial-page migration. In the current site, those pages, root metadata, structured data, feeds, AI-facing files, forms and global engagement overlays still describe hospitality packages and display old prices. Launching Phase 3 as written would therefore create the contradiction the specification says must not ship.

The build should not start beyond small, reversible foundation work until the P0 findings are resolved and the affected P1 requirements have owners and acceptance criteria.

### Finding summary

| Status | P0 | P1 | P2 | Total |
|---|---:|---:|---:|---:|
| Confirmed issues | 9 | 34 | 11 | 54 |
| Optional improvements | 0 | 0 | 5 | 5 |

## Review scope and evidence

The review covered:

- the full implementation specification and all six companion files in `tasks/repositioning/`;
- the supplied brand-system Markdown, JSON and Word documents;
- the supplied design-system ZIP and the newer design system vendored under `docs/brand/design-system/`;
- the current Next.js application, routes, redirects, content loaders, forms, lead database, analytics, security gates, sitemap, feeds and test setup;
- a production build and the existing lint, type and unit-test gates.

Source checks found:

- the external brand Markdown and JSON files are byte-identical to the vendored copies;
- the external Word file is byte-identical to the vendored Word file, renders as 55 clean pages, and does not add material requirements beyond the Markdown pack;
- the attached `Orange Jelly Design System.zip` is byte-identical to the vendored **v1** bundle with 29 component contracts and 6 templates;
- the extracted design system in `docs/brand/design-system/` comes from a newer **v2** bundle with 14 templates, but it contains **42**, not 44, `.d.ts.txt` component contracts;
- the raw Search Console and Keyword Planner data cited by the companion documents is not present in the repository.

### Current quality baseline

| Check | Result | Important detail |
|---|---|---|
| `npm run lint` | Passed with warning | `GoogleTagManager.tsx` reports a `beforeInteractive` warning. |
| `npm run type-check` | Passed | No TypeScript errors. |
| `npm run test:run` | Passed | 41 files and 922 tests passed; the run still prints expected warnings and error-path logs. |
| `npm run build` | Passed with warnings | 155 routes/pages generated. The build reports 105 guide pages, not 106. Browserslist data is stale and the GTM lint warning remains. |

These results describe the current working tree, which already contains unrelated user changes. No existing file was changed for this review.

## Priority and status definitions

- **P0:** blocks a safe or coherent launch, or creates immediate data, security or search-migration risk.
- **P1:** must be resolved before the affected workstream starts or is accepted.
- **P2:** should be resolved before programme completion; it can be scheduled without blocking unrelated work.
- **Confirmed issue:** a contradiction, omission or risk supported by the specification, supplied sources or current code.
- **Optional improvement:** a simplification or quality improvement that is not required to make the specification internally complete.

## Detailed findings

### Governance and delivery

#### F01. The stated readiness is too strong

- **Relevant section:** document header; sections 2 and 8
- **Priority:** P1
- **Type:** confirmed issue, governance
- **Description:** The header says `Ready to build, with three named blockers`, but other unresolved decisions affect core copy and implementation. D9 still requires `EXPOSE` to be pressure-tested. The founder-versus-company model, delivery model and permanent swearing boundary also remain unresolved in the source decision log.
- **Rationale:** These decisions affect the homepage, About page, method page, form promises, case studies and 42 component contracts. They are not minor copy edits after the build.
- **Impact:** The team may hard-code language or promises that must later change across templates, metadata and content.
- **Recommended action:** Change the status to `Not ready for full implementation. Foundation work only until the named P0/P1 decisions are closed.` Add every launch-affecting open decision to section 8 with an owner and due date.
- **Open questions:** Is `HEAR. EXPOSE. BUILD. PROVE.` now approved? How much delivery is founder-led? Can an expletive appear on any permanent page?

#### F02. The design source and component count are ambiguous

- **Relevant section:** companion document table; WS3
- **Priority:** P1
- **Type:** confirmed issue, dependency/versioning
- **Description:** The attached ZIP is v1 with 29 components and 6 templates. The repository also contains a newer v2 ZIP and an extracted 14-template system. The handback and specification say 44 components, while the bundle contains 42 component prop contracts.
- **Rationale:** A developer cannot satisfy `port the 44 reference components` when only 42 contracts exist, and may accidentally implement the older six-template bundle.
- **Impact:** Missing work, duplicate work and false completion reporting.
- **Recommended action:** Name one immutable source of truth, include its path, SHA-256, template count and component count, and correct every reference to 44 unless two missing components are supplied.
- **Open questions:** Which two components make the claimed total 44? Is the external v1 ZIP obsolete and safe to ignore?

#### F03. The quantitative evidence is not reproducible from the repository

- **Relevant section:** companion documents; sections 1, 7 and 8
- **Priority:** P1
- **Type:** confirmed issue, evidence/data
- **Description:** The search documents cite `data/gsc-orangejelly-2026-08-26/` and `data/gsc-the-anchor-2026-08-26/`, but those directories and the Keyword Planner exports are absent.
- **Rationale:** The protected URL list, priority posts, baselines and proof claims all depend on those source files.
- **Impact:** Developers and reviewers cannot verify the numbers, reproduce the protected set or prove that later monitoring uses the same definitions.
- **Recommended action:** Store privacy-reviewed source exports or immutable derived CSVs, plus the calculation script and date range. Record checksums if the raw exports must remain outside Git.
- **Open questions:** Where are the source exports held? Who owns refreshing them and approving derived figures?

#### F04. There is no delivery model for a programme of this size

- **Relevant section:** sections 4 and 5
- **Priority:** P1
- **Type:** confirmed issue, delivery planning
- **Description:** Eight workstreams, 14 templates, 42 reference components, 105 or 106 articles, 83 discretionary content decisions, a database migration and analytics work have no estimates, owners, capacity assumptions or target dates.
- **Rationale:** A sequence is not a deliverable plan unless its size, ownership and critical path are visible.
- **Impact:** The work cannot be forecast, staffed or honestly reported. The 83-post review can quietly dominate the programme.
- **Recommended action:** Add an owner, estimate range, dependencies, input requirements, review owner and target release for every workstream. Treat the 83-post review as a separate backlog with a capped first batch.
- **Open questions:** How many developers, designers, writers and reviewers are available? Is the 90-day source-plan still a constraint?

#### F05. The dependency graph is internally impossible

- **Relevant section:** WS6, WS7, WS8 and section 5
- **Priority:** P0
- **Type:** confirmed issue, delivery/dependency contradiction
- **Description:** WS7 depends on WS6, but the specification says WS7 runs alongside WS5 and can start in Phase 3, while WS6 is Phase 4. WS8 depends on WS5, but WS8 must baseline protected posts before WS6, even though WS6 can start immediately after WS4.
- **Rationale:** The declared dependencies permit WS6 to change pages before the required baseline and prevent WS7 from starting when the phasing says it should.
- **Impact:** Lost baselines, blocked teams and unreliable attribution of ranking changes.
- **Recommended action:** Split WS7 into ranking/content work that can start after baseline capture and integration work that follows WS6. Move measurement foundations and baseline capture before WS5/WS6. Publish a dependency diagram or machine-readable plan.
- **Open questions:** Is ranking work allowed before the new article template exists? Which event instrumentation must exist before page implementation?

#### F06. Phase 3 does not create a coherent public repositioning

- **Relevant section:** sections 1, 5 and 6; WS5 and WS6
- **Priority:** P0
- **Type:** confirmed issue, launch sequencing
- **Description:** Phase 3 ships five new-position pages while old commercial pages, service pages, `/contact`, root metadata, structured data, old pricing, old navigation data and global engagement overlays are not migrated until later or are not scoped at all.
- **Rationale:** The current site contains hospitality descriptions and Orange Jelly package prices across those surfaces. Phase 3 therefore cannot resolve the old/new contradiction as claimed.
- **Impact:** Confusing users, inconsistent search snippets, conflicting structured data and a failed repositioning launch.
- **Recommended action:** Add a `launch coherence sweep` before Phase 3. It must migrate or redirect every public commercial surface, global metadata, form, overlay and machine-readable output in one release. Alternatively keep the new position behind a feature flag until the sweep passes.
- **Open questions:** Which current pages may deliberately retain sector-specific hospitality wording? Can Phase 3 be redefined as a private staging milestone rather than a public launch?

#### F07. Change control and rollback are not defined

- **Relevant section:** sections 3, 5 and 7
- **Priority:** P1
- **Type:** confirmed issue, release management
- **Description:** The plan combines component deletion, global tokens, content edits, permanent redirects and schema changes without a release-unit, rollback or approval strategy.
- **Rationale:** Permanent redirects are cached, database changes can be one-way, and ranking changes can take days to appear.
- **Impact:** A bad release may be hard to isolate or reverse before search and lead data are affected.
- **Recommended action:** Define small releasable batches, preview/staging approval, backups, reversible migrations, redirect rollback rules, feature flags where useful, and a named incident owner.
- **Open questions:** What is the current deployment and rollback process on Vercel? Who can approve production redirects?

#### F08. The programme-wide gate is not currently achievable as written

- **Relevant section:** section 6; WS1 definition of done
- **Priority:** P2
- **Type:** confirmed issue, acceptance criteria
- **Description:** The whole-programme definition requires zero warnings. The current lint and build pass but produce a GTM warning, a stale Browserslist warning and test-run diagnostic output. The spec uses `npm test`, which may run Vitest in watch mode outside CI, and omits `format:check` and coverage.
- **Rationale:** A gate must name deterministic commands and distinguish expected diagnostic output from actionable warnings.
- **Impact:** Completion may be blocked by an undefined standard or passed inconsistently.
- **Recommended action:** Use exact CI commands such as `npm run format:check`, `npm run lint`, `npm run type-check`, `npm run test:run`, `npm run test:coverage` and `npm run build`. Resolve or explicitly allow named warnings.
- **Open questions:** Is zero console output required, or zero unexpected warnings? What coverage threshold applies to changed modules?

#### F09. Component count is not a sufficient success measure

- **Relevant section:** WS1, WS3 and section 6
- **Priority:** P2
- **Type:** confirmed issue, delivery metric
- **Description:** The targets `under 140` and `at or below 95` have no canonical counting command and reward file deletion rather than capability, accessibility or bundle improvements.
- **Rationale:** One file can contain several components, and a component can be moved outside `src/components` without simplifying anything.
- **Impact:** The metric can pass while duplication or regressions remain.
- **Recommended action:** Add a repeatable import-graph report and measure duplicate implementations, unused exports, client bundle size and migrated call sites. Keep component count as context, not a release gate.
- **Open questions:** What exactly counts as a component file? Are tests, route-local components and poll components excluded?

### Information architecture, content and search migration

#### F10. The protected set is not defined consistently

- **Relevant section:** sections 1, 2, 4, 6; search-performance companion
- **Priority:** P0
- **Type:** confirmed issue, data/SEO contradiction
- **Description:** The specification refers to 29 protected posts, while the source analysis says 30 posts carry 95% of blog clicks. It says 13 posts carry 80%, while the same source and section 1 say 14. No canonical list of the 29 or 30 URLs exists in the spec.
- **Rationale:** Baseline, monitoring, content locks and rollback all depend on an exact set.
- **Impact:** A valuable URL can be edited without protection, or the wrong page can block delivery.
- **Recommended action:** Add a versioned table containing every protected URL, tier, baseline metrics, allowed changes and owner. Recalculate the 80% and 95% counts from the stored export.
- **Open questions:** Is the protected set 29 or 30? Which fourteenth page is missing from WS7a?

#### F11. "All 106 posts stay" conflicts with an explicit redirected post

- **Relevant section:** sections 3, WS6 and section 6
- **Priority:** P0
- **Type:** confirmed issue, URL/content contradiction
- **Description:** The spec repeatedly says all 106 posts stay at their paths and all 106 are restyled. It also redirects `/licensees-guide/cash-flow-crisis-breaking-cycle` to `/pub-rescue`. The current build generates 105 guide pages.
- **Rationale:** A redirected source cannot also return 200 and use the new article template.
- **Impact:** Impossible acceptance criteria and an unclear content inventory.
- **Recommended action:** State either `105 live articles plus one redirected legacy article` or restore the redirected page. Align the sitemap, search index, route generation and counts.
- **Open questions:** Should the cash-flow article remain live because its content is still valuable, or is the redirect intentional and final?

#### F12. Case-study detail routes are missing from the target URL map

- **Relevant section:** section 3, WS5 and design-system `case-study` template
- **Priority:** P1
- **Type:** confirmed issue, functional/IA gap
- **Description:** The design system includes a case-study detail template and the strategy requires full case studies, but the URL map contains only `/results`. No `/results/[slug]` route, content model or build task exists.
- **Rationale:** The specified article-to-problem-to-case-to-offer journey cannot work without case-study destinations.
- **Impact:** Broken internal-link strategy and an incomplete proof journey.
- **Recommended action:** Add the detail route or explicitly decide that Phase 1 uses only the Results overview. Define slugs, content source, canonical metadata, structured data and the D2 publication gate.
- **Open questions:** Which case studies will be public at launch? Are existing files under `content/case-studies/` retained, rewritten or blocked?

#### F13. `/404` and `/500` are described as normal Next.js routes

- **Relevant section:** target URL map; WS5 order 12
- **Priority:** P1
- **Type:** confirmed issue, technical/framework mismatch
- **Description:** In the App Router, expected error handling is implemented through `not-found.tsx`, `error.tsx` and, where needed, `global-error.tsx`. Ordinary `/404` and `/500` pages do not cover framework errors by themselves.
- **Rationale:** Building only those URLs would leave runtime and nested-route errors on the wrong UI.
- **Impact:** Missing error handling and misleading test results.
- **Recommended action:** Suggested wording: `Implement the error-page design through src/app/not-found.tsx, src/app/error.tsx and src/app/global-error.tsx as applicable. Add /404 or /500 routes only if separately required.`
- **Open questions:** Should route-segment errors expose retry actions? Which failures should offer search and which should only offer safe navigation?

#### F14. The eight growth-problem URLs are not named

- **Relevant section:** section 3 and WS5
- **Priority:** P1
- **Type:** confirmed issue, functional/SEO requirement gap
- **Description:** Eight `/growth-problems/[slug]` pages are specified without the actual slugs, titles, canonical intent or symptom-to-page mapping.
- **Rationale:** The design template's internal `problem` values are not a URL contract.
- **Impact:** Developers, writers, analytics and redirects can choose different identifiers.
- **Recommended action:** Add an eight-row route table with slug, display title, search intent, template variant, primary CTA, required proof, related case study and analytics category.
- **Open questions:** Are the intended slugs `stalled`, `demand`, `conversion`, `margin`, `operations`, `experience`, `ai` and `scale`, or longer search-facing slugs?

#### F15. The "full URL map" is not a complete route disposition

- **Relevant section:** section 3 and workstreams 5 to 7
- **Priority:** P1
- **Type:** confirmed issue, scope/IA gap
- **Description:** The map omits the case-study detail route, current dynamic child routes, generated assets and several implementation tasks. `/contact`, `/privacy` and `/licensees-guide/category/[category]` appear in the map but have no clear work item or acceptance criteria.
- **Rationale:** Every existing public route needs one outcome: keep, rewrite, redirect, remove, block or out of scope.
- **Impact:** Old copy and broken navigation survive launch unnoticed.
- **Recommended action:** Build one route-disposition manifest covering pages, dynamic patterns, campaign redirects, error handlers, feeds and machine-readable endpoints. Use it to generate tests and sitemap exclusions.
- **Open questions:** Who owns `/privacy`, category pages and the reduced `/contact` implementation? Are route handlers such as `/about-demo` deleted in WS1 or WS6?

#### F16. The redirect inventory and implementation requirements are wrong or stale

- **Relevant section:** section 3
- **Priority:** P0
- **Type:** confirmed issue, SEO/technical migration
- **Description:** The spec says 14 existing redirect rules, while the current `next.config.js` resolves to 21. It calls for 301s, while `permanent: true` in the installed Next.js version produces a 308. The source pattern `/ways-to-work/[slug]` is documentation syntax, not valid Next redirect syntax; it should be exact paths or `/ways-to-work/:slug`.
- **Rationale:** Redirect status, source syntax, query preservation and rule order directly affect search migration.
- **Impact:** Missed paths, chains, wrong status assertions and potential ranking loss.
- **Recommended action:** Generate the final redirect table from the live configuration and route inventory. Specify exact source syntax, expected status, destination, query behaviour and chain test. Decide whether 308 is acceptable or implement true 301 responses deliberately.
- **Open questions:** Is 308 acceptable for this migration? Must wildcard child routes preserve additional path segments or only the four current slugs?

#### F17. Canonical, sitemap and structured-data migration is not scoped

- **Relevant section:** WS6, section 6 and the 90-day activation source
- **Priority:** P1
- **Type:** confirmed issue, technical SEO
- **Description:** The current sitemap manually lists pages that will redirect, and the root layout contains old titles, descriptions, job titles, organisation copy and `priceRange`. No workstream updates canonicals, Open Graph metadata, breadcrumb schema, article schema or sitemap membership.
- **Rationale:** Redirecting body routes while leaving old machine-readable signals is an incomplete migration.
- **Impact:** Conflicting search signals, stale snippets and the literal failure of the no-price/no-old-position goals.
- **Recommended action:** Add a technical SEO migration task with per-template metadata rules, canonical tests, structured-data validation, sitemap rules and redirect-source exclusion.
- **Open questions:** Which schema types are approved for the new position? Should `ProfessionalService` remain, and should `priceRange` be removed?

#### F18. Non-page publishing surfaces are omitted

- **Relevant section:** success criteria, WS4 to WS7
- **Priority:** P1
- **Type:** confirmed issue, content/technical scope
- **Description:** `public/llms.txt`, `public/llms-full.txt`, `public/manifest.json`, RSS, JSON Feed, generated icons, Open Graph image, navigation JSON, footer JSON and several global constants still carry old hospitality, AI-product, package or price wording.
- **Rationale:** Search engines, AI systems, feed readers and installed web apps consume these surfaces even when pages are updated.
- **Impact:** The old positioning remains publicly distributed after launch.
- **Recommended action:** Add these artifacts to the launch coherence sweep. Define which are generated, which are source files, and how their output is tested for banned old claims and broken URLs.
- **Open questions:** Should `llms*.txt` be retained, regenerated or removed? Should feeds cover both content collections or hospitality only?

#### F19. The new `/insights` collection has no content model

- **Relevant section:** section 3 and WS5 order 11
- **Priority:** P1
- **Type:** confirmed issue, functional/content architecture
- **Description:** The route exists in the plan, but there is no schema for front matter, authors, categories, drafts, dates, images, SEO, pagination, related links or collection discovery.
- **Rationale:** The current loaders assume every Markdown post belongs under `/licensees-guide/`.
- **Impact:** New articles may leak into the wrong collection, sitemap, feed or search URL.
- **Recommended action:** Define separate content directories and types, or one typed collection with an explicit route namespace. Add draft/future behaviour, slug uniqueness, pagination, feed and sitemap rules.
- **Open questions:** Can an insight and a licensee guide share a slug? Are the seven taxonomy colours shared across both collections?

#### F20. Site search cannot meet the new information architecture

- **Relevant section:** WS4 item 6
- **Priority:** P1
- **Type:** confirmed issue, functional/performance integration
- **Description:** The current `search-index.json` contains 103 hospitality items, is about 936 KB, is not rebuilt by `npm run build`, and the builder hard-codes `/licensees-guide/<slug>`. It excludes new insights, problem pages, sector pages and case studies.
- **Rationale:** Feeding the existing file into the new component does not produce site search for the new site.
- **Impact:** Search appears functional but cannot find the new proposition. The large index also loads on component mount on mobile.
- **Recommended action:** Define indexed content types, fields and exclusions; update the builder; run it deterministically in CI; test stale/missing/corrupt indexes; and lazy-load or split the index.
- **Open questions:** Should search cover only editorial content or all public pages? What is the maximum result/index size?

#### F21. "Untouchable" content also needs ranking changes

- **Relevant section:** D1/D14, WS6 and WS7
- **Priority:** P1
- **Type:** confirmed issue, content-change contradiction
- **Description:** Protected posts are described as untouchable or `change nothing else`, while WS7 requires substantive ranking improvements and the whole-site goals require removing old service pricing and unverified claims from some of those articles.
- **Rationale:** Ranking work normally changes titles, headings, copy, internal links or schema. Current protected articles contain old Orange Jelly prices and at least one unverified result.
- **Impact:** Either the ranking work cannot happen, or protection is bypassed without a controlled change policy.
- **Recommended action:** Replace `untouchable` with a change budget: immutable path, controlled metadata/content changes, before/after snapshots, approval and rollback thresholds.
- **Open questions:** Which fields may change on each tier? Does visual restyling count as a protected change?

#### F22. Several whole-programme requirements are literal but impossible or contradictory

- **Relevant section:** sections 1 and 6; WS4
- **Priority:** P1
- **Type:** confirmed issue, acceptance ambiguity
- **Description:** `Every CTA` cannot use one label because search, share, form submit, cookie and pagination controls need descriptive actions. `No price anywhere` conflicts with useful editorial examples and sector content. `No page describes Orange Jelly as a hospitality marketing agency` conflicts with the approved hospitality search target. `Not one ... loses a ranking` is not controllable by the implementation.
- **Rationale:** Absolute language makes valid content fail and external search behaviour an engineering acceptance gate.
- **Impact:** Endless interpretation disputes or accidental deletion of useful content.
- **Recommended action:** Suggested wording: `All primary commercial conversion CTAs use Let's talk`; `No public Orange Jelly service price is published`; `No master company description uses hospitality marketing agency, while approved sector usage remains`; `No protected URL, canonical, metadata or content regression is introduced, with rankings monitored against agreed thresholds`.
- **Open questions:** Which controls count as primary conversion CTAs? Which editorial prices and sector phrases are exempt?

#### F23. The Anchor story still requires proof verification

- **Relevant section:** sections 1, WS5, WS7e, risks and blockers
- **Priority:** P1
- **Type:** confirmed issue, proof/claims
- **Description:** The spec repeatedly says the Anchor discovery story needs no verification, but it uses exact GSC figures such as 41.7% and 6,103 clicks. It also changes `organic search clicks` into broader phrases such as `search visits`.
- **Rationale:** A claim can be easy to verify and still require source, date range, definition, context and approval. Search Console is not independently public.
- **Impact:** An overstated or semantically inaccurate lead case study undermines the evidence-led position.
- **Recommended action:** Put the story through the same proof register as every other claim. Use exact wording such as `41.7% of organic Google Search clicks in the 12 months to 26 August 2026` if verified.
- **Open questions:** Who can approve use of The Anchor data? Is the denominator clicks, sessions, users or all visits?

#### F24. The `NextStep` chain has no usable data contract

- **Relevant section:** WS6 and WS7; design handback B3
- **Priority:** P1
- **Type:** confirmed issue, content integration
- **Description:** The spec says to add `NextStep` to 106 posts but does not define each post's problem, case and offer links. The existing related-link data is old, generic and contains retired routes, old offers and prices.
- **Rationale:** A component cannot create a meaningful commercial journey without curated mappings and fallbacks.
- **Impact:** Repetitive, irrelevant or broken calls to action across the highest-value content.
- **Recommended action:** Create a typed mapping keyed by content slug, validate all destinations during build, define fallbacks by category and require editorial approval for protected posts.
- **Open questions:** Who curates the first 105 mappings? May a post link directly to `/start-here` when no relevant case study exists?

#### F25. The 83-post review is an unbounded decision project

- **Relevant section:** WS7c
- **Priority:** P1
- **Type:** confirmed issue, delivery/content governance
- **Description:** `Keep, merge or retire` is required for 83 posts with no criteria, data window, approval process, redirect rules or completion limit.
- **Rationale:** Zero clicks alone does not prove that a page is thin, useless, seasonal or safe to merge.
- **Impact:** Large hidden scope and avoidable search/content loss.
- **Recommended action:** Define a scoring rubric using impressions, links, freshness, uniqueness, conversions, seasonal value and business relevance. Trial it on ten pages before committing the rest.
- **Open questions:** Who approves retirement? What minimum evidence justifies a merge or 410?

#### F26. Ranking work is stated as an outcome, not an implementable brief

- **Relevant section:** WS7a and WS7b
- **Priority:** P2
- **Type:** confirmed issue, SEO functional detail
- **Description:** The spec identifies opportunity pages but not target queries, intent mismatches, competing URLs, proposed changes, expected leading indicators or review dates.
- **Rationale:** `Fix the rankings` is not a bounded task and can cause uncontrolled rewrites.
- **Impact:** Inconsistent optimisation and no way to attribute results.
- **Recommended action:** Create one page brief per target with query clusters, current SERP intent, change hypothesis, allowed edits, internal links, schema, author/reviewer and monitoring date.
- **Open questions:** Is the current separate SEO-powerhouse work already producing these briefs? How will overlapping work be coordinated?

#### F27. "AI citation" is not defined as a measurable success criterion

- **Relevant section:** WS8
- **Priority:** P2
- **Type:** confirmed issue, measurement ambiguity
- **Description:** The spec says growth-problem pages should be judged on AI citation but provides no engine set, query set, location, frequency, baseline or attribution method.
- **Rationale:** AI answers are volatile and personalised. A single observed citation is not a stable KPI.
- **Impact:** Pages may be labelled successful or unsuccessful using anecdotal checks.
- **Recommended action:** Define a small repeatable prompt set, engines, signed-out conditions, monthly cadence and evidence capture. Treat citations as directional, not a launch gate.
- **Open questions:** Which systems matter commercially? Is mention, linked citation or referred traffic the desired measure?

#### F28. The Search Console subdomain question is not framed as an implementation decision

- **Relevant section:** out of scope and section 8
- **Priority:** P2
- **Type:** confirmed issue, analytics/configuration ambiguity
- **Description:** The question asks whether subdomains `belong in the Search Console property`. If the source is a Domain property, subdomains are inherently included; separate URL-prefix properties can be created for reporting but do not remove them from the domain view.
- **Rationale:** The practical choice is reporting/property structure and indexation policy, not membership in a domain property.
- **Impact:** Time can be spent pursuing an impossible configuration change.
- **Recommended action:** Record the current property type, then decide whether each subdomain should remain indexable and whether separate URL-prefix properties are required.
- **Open questions:** Are the product subdomains intended to be public and indexed? Who owns their sitemaps and canonical policy?

### Components, design, accessibility and performance

#### F29. The wrapper collapse has no API migration plan

- **Relevant section:** WS1 and WS3
- **Priority:** P1
- **Type:** confirmed issue, technical migration
- **Description:** WS1 removes wrappers and adapters before WS3 introduces new components, but it does not state which implementation survives or how existing prop APIs are migrated to the reference contracts.
- **Rationale:** Current pages depend on several generations of component props. The new design contracts do not automatically cover those call sites.
- **Impact:** Broad compile failures or rushed compatibility code hidden inside pages.
- **Recommended action:** Produce an import graph and a per-family compatibility table. Replace implementations behind stable imports first, migrate call sites in batches, then remove facades only when no consumers remain.
- **Open questions:** Which path becomes the canonical import for each primitive? Are backward-compatible props temporarily allowed?

#### F30. `/availability` is decided out of scope but technically unprotected from global styling

- **Relevant section:** explicit out of scope, WS2 watch item and blocker 2
- **Priority:** P0
- **Type:** confirmed issue, styling architecture
- **Description:** The design handback already says `/availability` stays on current styling, while the spec treats that as an undecided call. Global colour variables, root fonts and the `h1,h2` lowercase selector will still affect `/availability` and `/admin`.
- **Rationale:** "Out of scope" is a requirement, not an implementation mechanism.
- **Impact:** Unplanned product and admin regressions from a marketing-site redesign.
- **Recommended action:** Close the decision as out of scope and define the technical solution: scoped marketing tokens under a route shell, or a frozen legacy token scope for availability/admin. Add visual regression tests for both.
- **Open questions:** May shared primitives change visually inside `/availability`, or must it be pixel-stable?

#### F31. Global lowercase headings cannot handle Markdown proper nouns as specified

- **Relevant section:** WS2 item 4 and WS6
- **Priority:** P1
- **Type:** confirmed issue, content/rendering ambiguity
- **Description:** The global rule lowercases every `h1` and `h2`, while proper nouns require `.oj-keep-case`. The current Markdown pipeline sanitises raw HTML, so writers cannot reliably wrap `VAT`, `AI`, `Google`, event names or other proper nouns in that class.
- **Rationale:** Protected hospitality posts contain many such headings, and the rule also affects out-of-scope routes.
- **Impact:** Visually incorrect headings and manual exceptions that do not survive rendering.
- **Recommended action:** Scope lowercase styling to explicit marketing display classes, or add a supported Markdown/AST mechanism for preserved spans. Test representative protected posts.
- **Open questions:** Is visual lowercasing intended inside article body headings, privacy content, polls and admin?

#### F32. The design sources contain unresolved internal contradictions

- **Relevant section:** WS2 and WS3; design-system README, overview, SKILL and handback
- **Priority:** P1
- **Type:** confirmed issue, design governance
- **Description:** The handback treats Schibsted Grotesk as production while the README and overview call it a substitute. The design SKILL says no gradients while tokens, components and templates use gradient-based highlight bands and slider/select treatments. The README footer still refers to six templates.
- **Rationale:** The spec asks for high-fidelity implementation but does not declare which source wins when design files disagree.
- **Impact:** Review disputes and inconsistent implementations.
- **Recommended action:** Add a design authority order, then correct or archive stale files. A sensible order is final decision log, handback, tokens/contracts/prompts, templates, overview/README, older v1 material.
- **Open questions:** Are lower-half highlight gradients approved exceptions? Is Schibsted permanently approved?

#### F33. Component completion checks props but not behaviour

- **Relevant section:** WS3 definition of done
- **Priority:** P2
- **Type:** confirmed issue, functional acceptance
- **Description:** Matching `.d.ts.txt` props does not prove keyboard behaviour, responsive layout, empty/loading/error states, route semantics or the rules in each `.prompt.md`. `Storybook or equivalent` is not selected or scoped.
- **Rationale:** The most important components are interactive: Header, Modal, FAQ, SiteSearch, PressureCheck, Scorecard and form fields.
- **Impact:** Components can be type-correct but unusable or inaccessible.
- **Recommended action:** Choose the visual-lab tool, list required states per component, and add interaction and accessibility tests. Do not expose the lab as an indexed production route.
- **Open questions:** Is Storybook acceptable, or should the existing test stack provide a private component harness?

#### F34. WCAG AA is a label, not a test plan

- **Relevant section:** section 6; WS2 to WS5
- **Priority:** P1
- **Type:** confirmed issue, accessibility
- **Description:** The spec says WCAG 2.1 AA but gives no testable criteria for navigation, drawers, forms, search comboboxes, dialogs, scorecards, focus order, error summaries, reflow, zoom, headings, landmarks or screen-reader output.
- **Rationale:** Automated contrast tests cover only a small part of accessibility.
- **Impact:** A nominal AA release with serious keyboard or assistive-technology defects.
- **Recommended action:** Use a per-template accessibility checklist, automated axe checks, keyboard tests, 200%/400% zoom and reflow checks, and manual screen-reader tests for the key journeys. Consider adopting WCAG 2.2 AA for the new work.
- **Open questions:** Which browsers and screen readers form the supported matrix? Who signs off manual accessibility QA?

#### F35. Motion, sticky surfaces and reflow edge cases are omitted

- **Relevant section:** WS2 to WS4
- **Priority:** P2
- **Type:** confirmed issue, accessibility/responsive behaviour
- **Description:** The spec adds animated pressure interactions, a sticky header, sticky CTA, cookie notice and mobile drawer without reduced-motion behaviour, overlap rules, safe-area handling or small-height viewport tests.
- **Rationale:** Fixed surfaces can cover content or form actions, especially on mobile and at zoom.
- **Impact:** Failed reflow, obscured controls and motion discomfort.
- **Recommended action:** Define `prefers-reduced-motion`, safe-area padding, stacking order, dismissal persistence, and a maximum combined fixed-surface footprint. Test 320px width and short landscape viewports.
- **Open questions:** Can the cookie notice and sticky CTA appear together? Which surface wins when the mobile keyboard opens?

#### F36. Core Web Vitals acceptance is not measurable as written

- **Relevant section:** section 6 and WS8
- **Priority:** P1
- **Type:** confirmed issue, performance/measurement
- **Description:** LCP, INP and CLS thresholds have no source, percentile, device, network, page set or sample rule. Current custom monitoring records FID rather than INP and only sends to the data layer when analytics is available.
- **Rationale:** Lab Lighthouse results and field 75th-percentile data answer different questions, and low-traffic pages may have no field data.
- **Impact:** Performance can neither be accepted nor monitored consistently.
- **Recommended action:** Set lab budgets for representative templates and field goals at the 75th percentile where data exists. Add INP collection, route grouping and alert thresholds. Name the measurement tools and test conditions.
- **Open questions:** Are the thresholds launch gates in lab, post-launch field goals, or both?

#### F37. There are no route-level bundle or font-loading budgets

- **Relevant section:** WS2, WS3 and section 6
- **Priority:** P2
- **Type:** confirmed issue, performance
- **Description:** The design adds a variable font, 42 components, animations, a 936 KB search index and interactive diagnostics without JS, CSS, font or image budgets. The source font file uses a runtime Google Fonts import, while the current app uses `next/font`.
- **Rationale:** Mobile is the primary surface and the current Contact page already has a 200 KB first-load bundle.
- **Impact:** Passing functional tests while making the most important journeys slower.
- **Recommended action:** Prefer `next/font/google` or a locally hosted approved font, lazy-load heavy tools/search, keep server components by default, and set route-level budgets for JS, LCP asset size and font requests.
- **Open questions:** Must search be globally mounted? Are diagnostics loaded only on their own routes?

#### F38. Contrast acceptance does not cover all interactive states

- **Relevant section:** WS2 definition of done and section 6
- **Priority:** P2
- **Type:** confirmed issue, accessibility/design testing
- **Description:** Passing the existing contrast test does not guarantee contrast for all taxonomy pairs, muted text, focus indicators, visited links, disabled fields, error states, orange header states or text placed over highlight bands.
- **Rationale:** The new palette deliberately gives colours different jobs.
- **Impact:** Local AA failures despite a green palette test.
- **Recommended action:** Expand the token test matrix and add rendered component checks for normal, hover, focus, active, disabled, error and inverse states.
- **Open questions:** Which colour pairs are explicitly permitted for small text, large text and non-text UI?

### Enquiry, data, integrations, security and analytics

#### F39. The new enquiry form is not an implementable contract

- **Relevant section:** WS5 enquiry form
- **Priority:** P0
- **Type:** confirmed issue, functional requirement gap
- **Description:** The field list does not say which fields are required, their input types, options, limits, conditional behaviour, validation messages, autocomplete values or accessibility behaviour. `employee or revenue band`, `who is involved` and `preferred next step` are especially ambiguous.
- **Rationale:** Client and server validation, storage and analytics must share one exact contract.
- **Impact:** Rework, inconsistent data and form abandonment.
- **Recommended action:** Add a field-level specification with names, types, options, required rules, maximum lengths, server validation, privacy copy, error summary, success state and no-JavaScript/failure fallback. Define what happens after submission, including any calendar step.
- **Open questions:** Are personal email addresses accepted? Is the form one page or conditional/multi-step? What are the preferred-next-step options?

#### F40. The form requires an unscoped data and admin migration

- **Relevant section:** WS5 and WS8
- **Priority:** P0
- **Type:** confirmed issue, data/integration/migration
- **Description:** The current `contacts` table and server action store `pub_name`, `package_interest` and one message. The admin dashboard, notification email, privacy page and analytics use those fields. None can store or display the proposed qualification data.
- **Rationale:** A UI-only form change would drop data or fail at runtime.
- **Impact:** Lost enquiries, broken admin views and privacy statements that do not match processing.
- **Recommended action:** Add a backwards-compatible database migration, typed shared schema, server action update, admin update, email template update, privacy update, data export and rollback plan. Deploy the additive schema before code that writes it.
- **Open questions:** Should qualification answers be columns or a versioned JSON object? Must historic pub leads remain readable in the same admin view?

#### F41. Abuse prevention is not specified

- **Relevant section:** WS5 enquiry form
- **Priority:** P1
- **Type:** confirmed issue, security/availability
- **Description:** The current contact flow has only a honeypot and weak manual server validation. The new high-value form has no rate limit, bot challenge, payload limit or abuse response.
- **Rationale:** Public server actions that send mail and write personal data are common spam targets.
- **Impact:** Inbox abuse, database noise, Resend limits and service cost.
- **Recommended action:** Reuse the existing hashed rate-limit infrastructure with contact-specific buckets, keep a honeypot, apply strict server-side Zod validation and payload limits, and add Turnstile only if observed abuse justifies it.
- **Open questions:** Should contact submission fail open or closed when the limiter is unavailable? What rate is acceptable per IP/email?

#### F42. Partial failure and duplicate-submission behaviour are undefined

- **Relevant section:** WS5 and WS8
- **Priority:** P1
- **Type:** confirmed issue, data integrity/error handling
- **Description:** The current lead flow performs contact insert, source insert and conversion-event insert sequentially. If a later write fails, the user can see failure after the contact already exists and may submit a duplicate. The new spec says nothing about idempotency or transactions.
- **Rationale:** Multi-step forms and analytics add more failure points.
- **Impact:** Duplicate leads, missing attribution and misleading user errors.
- **Recommended action:** Define an idempotency key, transactional boundary or durable outbox. Return success once the lead is safely stored and treat notification/analytics as retryable secondary work.
- **Open questions:** What is the authoritative success condition: lead stored, notification sent, or both?

#### F43. Privacy and retention requirements do not cover the proposed data

- **Relevant section:** WS5, `/privacy` URL and WS8
- **Priority:** P1
- **Type:** confirmed issue, privacy/security
- **Description:** The new form collects role, business size, blockers, success expectations, urgency and decision-making information. The spec does not define purpose, retention, access, deletion, redaction in logs, consent/lawful-basis wording or data-minimisation limits.
- **Rationale:** This is more commercially sensitive and personally attributable data than the current contact form.
- **Impact:** Excess data collection, stale privacy content and avoidable exposure.
- **Recommended action:** Create a data inventory and retention rule, update the privacy page before launch, restrict admin access, avoid sending full answers to analytics, and test deletion/export procedures.
- **Open questions:** How long are unsuccessful enquiries retained? Which answers need to appear in notification email versus only the secure admin view?

#### F44. The human follow-up journey is missing

- **Relevant section:** success criteria and WS5
- **Priority:** P1
- **Type:** confirmed issue, operational user journey
- **Description:** The specification ends at form submission. It does not state who receives it, response time, qualification status, next-step selection, calendar booking, rejection path, acknowledgement wording or fallback when email notification fails.
- **Rationale:** `Qualified enquiries arrive through a conversation` requires an operating process, not only a form.
- **Impact:** Good leads can be lost even when the website works technically.
- **Recommended action:** Define the lead state machine, owner, service level, acknowledgement, notification escalation and manual fallback. Test the full journey from first field interaction to booked or declined conversation.
- **Open questions:** Is Peter the sole responder? Is calendar access ever shown automatically?

#### F45. The AI readiness scorecard has no product specification

- **Relevant section:** `/tools/ai-readiness`, WS5 order 8 and WS8 events
- **Priority:** P1
- **Type:** confirmed issue, functional/data gap
- **Description:** A route and generic Scorecard component exist, but the 12 statements, scoring model, pressure mapping, result bands, recommendations, disclaimer, answer persistence, restart behaviour and CTA handover are absent.
- **Rationale:** Reusing a component does not define the assessment product.
- **Impact:** Arbitrary or misleading results and analytics with no agreed meaning.
- **Recommended action:** Write a separate scorecard specification reviewed by a subject expert. Include questions, scoring, result copy, accessibility, validation, privacy, no-JavaScript behaviour and test vectors.
- **Open questions:** Is the result a lead magnet, anonymous tool or qualification input? Are answers stored, emailed or client-only?

#### F46. Analytics events are names without contracts

- **Relevant section:** WS8
- **Priority:** P1
- **Type:** confirmed issue, analytics/integration
- **Description:** Event names are listed without exact triggers, properties, consent rules, de-duplication, owner, GA4 mapping or first-party database mapping. `pressure_check_used` is especially vague, and `enquiry_submitted` could fire more than once.
- **Rationale:** The current implementation has TypeScript and server allowlists that must be updated in several places. It stores some first-party events separately from GA4.
- **Impact:** Missing or inflated metrics and a journey that cannot be reconstructed.
- **Recommended action:** Create an event dictionary with trigger, required properties, prohibited personal data, consent category, GA4 name, first-party name, de-duplication key and validation test. Add DebugView and database checks to release QA.
- **Open questions:** Are scorecard raw answers analytics data? What anonymous/session identifier joins the journey before an enquiry?

#### F47. Consent behaviour is incomplete for the new measurement plan

- **Relevant section:** WS4 CookieNotice and WS8
- **Priority:** P1
- **Type:** confirmed issue, privacy/analytics
- **Description:** Equal-weight decline is specified, but there is no preference-reopen control, consent version, expiry, withdrawal path or classification of Vercel Analytics, first-party events and form conversion records.
- **Rationale:** Journey tracking must behave consistently before, after and without analytics consent.
- **Impact:** Incomplete data, inaccurate privacy statements or tracking outside the chosen consent model.
- **Recommended action:** Define the consent matrix and retention/version rules. Provide a permanent `Cookie settings` control and test accept, reject, withdraw and stored-old-version journeys.
- **Open questions:** Does Vercel Analytics load before consent? Which first-party events are operational records rather than optional analytics?

#### F48. Global work can regress a deliberate bearer-token security boundary

- **Relevant section:** explicit out of scope; WS2, WS4 and WS8
- **Priority:** P0
- **Type:** confirmed issue, security
- **Description:** `/availability` organiser and edit URLs contain bearer tokens. Current code deliberately blocks GTM, Vercel Analytics, performance monitoring, preconnects and marketing overlays on those routes. The spec discusses only styling and does not preserve this security requirement.
- **Rationale:** Replacing the root layout, Header/Footer or analytics stack can leak token paths to third parties.
- **Impact:** Anyone with analytics access could gain poll-organiser capability.
- **Recommended action:** Add a non-negotiable requirement that no third-party request or marketing chrome runs on token routes. Preserve `ChromeGate`, `MarketingChrome` and GTM route gates, and keep the existing regression tests plus a browser network test.
- **Open questions:** Are there any other token or preview routes requiring the same treatment?

#### F49. CSP and security-header regression testing is absent

- **Relevant section:** WS2 to WS5
- **Priority:** P1
- **Type:** confirmed issue, security/platform
- **Description:** New fonts, scripts, analytics, form behaviour and components can require CSP changes, but the specification does not mention the current middleware policy, form-action restrictions, frame sources or API headers.
- **Rationale:** Broadening CSP to make a component work can silently reduce protection across every route.
- **Impact:** Security regression or production-only broken assets/forms.
- **Recommended action:** Keep CSP/header changes in a reviewed task, prefer self-hosted assets and existing dependencies, and add production-header tests for marketing, API and token routes.
- **Open questions:** Can `unsafe-eval` and some broad third-party origins be removed during this work, or is that a separate security project?

#### F50. The LogoStrip blocker is not actionable

- **Relevant section:** blocker 3
- **Priority:** P2
- **Type:** confirmed issue, dependency/asset governance
- **Description:** The spec says the logo files already exist in `public/` but the designer must migrate them. It does not state whether the blocker is permission, asset quality, component wiring or brand approval.
- **Rationale:** A blocker needs a named owner, required input and acceptance test.
- **Impact:** The proof band can remain blocked despite the assets being available.
- **Recommended action:** State the exact missing decision, approved files, display rules, alt text, link behaviour and owner. If permission is already available, move it from blockers to implementation.
- **Open questions:** Is there written permission to display both logos? Which SVG/PNG versions are approved?

#### F51. External services and deployment order are not documented

- **Relevant section:** WS5, WS8 and section 5
- **Priority:** P1
- **Type:** confirmed issue, integration/deployment
- **Description:** The programme depends on Supabase, Postgres fallback logic, Resend, GTM/GA4, Vercel Analytics, Search Console and Vercel deployment configuration, but has no environment matrix, secret requirements, migration order or preview behaviour.
- **Rationale:** Several current features behave differently when a service is unconfigured.
- **Impact:** A preview can appear successful while production lead capture or analytics fails.
- **Recommended action:** Add a dev/preview/production integration matrix, required environment variables, safe fallbacks, health checks and deployment order. Test against non-production service projects where possible.
- **Open questions:** Is there a separate Supabase preview/staging project? How are GA4 test events separated from production data?

### Testing, monitoring and deployment

#### F52. The test strategy does not cover the programme risk

- **Relevant section:** all definitions of done
- **Priority:** P1
- **Type:** confirmed issue, testing
- **Description:** The spec names unit-level build gates and a final crawler but no end-to-end, visual regression, accessibility, analytics, form integration, cross-browser, no-JavaScript or responsive test matrix.
- **Rationale:** Most programme risks are integration risks across routes, content, redirects and third parties.
- **Impact:** A green unit suite can ship broken journeys and SEO signals.
- **Recommended action:** Add a test plan covering component tests, form/server integration, route/canonical/redirect assertions, visual snapshots, axe, keyboard journeys, Chrome/Safari/Firefox, mobile breakpoints, analytics DebugView and production smoke tests.
- **Open questions:** Will Playwright be the end-to-end tool? Which routes are representative of all 14 templates?

#### F53. There is no operational monitoring or alerting plan

- **Relevant section:** WS8 and section 7
- **Priority:** P1
- **Type:** confirmed issue, monitoring/operations
- **Description:** The measurement work covers marketing events and weekly rankings but not JavaScript errors, server-action failures, lead-write failures, email-notification failures, elevated 404s, redirect loops, Supabase errors or Core Web Vitals alerts.
- **Rationale:** A custom 500 page does not tell the team that a failure occurred.
- **Impact:** Lost leads and broken routes may remain unnoticed until a user reports them.
- **Recommended action:** Define error capture, structured logs, alert thresholds, dashboards, on-call owner and synthetic checks for homepage, protected article, search, scorecard and enquiry submission.
- **Open questions:** Is an error-monitoring service already approved? Where should lead-delivery alerts go?

#### F54. Search Console "no errors after seven days" is not a valid workstream completion gate

- **Relevant section:** WS6 definition of done
- **Priority:** P2
- **Type:** confirmed issue, acceptance/monitoring
- **Description:** Search Console processing is asynchronous, can take longer than seven days, and can contain unrelated historic issues. The team cannot make Google report zero errors on demand.
- **Rationale:** A workstream gate should be controlled by the team and scoped to introduced changes.
- **Impact:** WS6 can remain artificially open or pass based on incomplete processing.
- **Recommended action:** Gate release on crawler results, sitemap validity and production status checks. Use Search Console as a post-launch monitor with thresholds for new affected URLs and a named response plan.
- **Open questions:** What number or rate of new excluded/error URLs triggers rollback or investigation?

## Optional improvements

#### O01. Use one route manifest to drive redirects, sitemap and tests

- **Relevant section:** section 3
- **Priority:** P2
- **Type:** optional improvement, simplification
- **Description:** Store each route's disposition, destination, canonical status and sitemap inclusion once.
- **Rationale:** The same information is currently duplicated across prose, `next.config.js`, sitemap code and tests.
- **Impact:** Fewer stale counts and redirect chains.
- **Recommended action:** Create a typed route manifest and generate or validate configuration from it.
- **Open questions:** Should campaign redirects remain separate because they have annual ownership?

#### O02. Use one shared, versioned lead schema

- **Relevant section:** WS5 and WS8
- **Priority:** P2
- **Type:** optional improvement, simplification
- **Description:** Define the enquiry once in Zod and derive client types, server validation and storage mapping from it.
- **Rationale:** The current contact flow has separate weak client and server contracts.
- **Impact:** Less drift and safer migrations.
- **Recommended action:** Add a `schemaVersion` to stored qualification data and write migration-aware readers for historic leads.
- **Open questions:** None beyond F39/F40.

#### O03. Port components only when a page needs them

- **Relevant section:** WS3 and risk 6
- **Priority:** P2
- **Type:** optional improvement, scope simplification
- **Description:** The risk response already says to port on demand, but the WS3 wording implies all 42 components must be completed before pages.
- **Rationale:** Several reference components may not be required for the first coherent release.
- **Impact:** Smaller initial scope and earlier user-visible validation.
- **Recommended action:** Build the minimal vertical slice for Home, Start Here and global chrome, then add components by template dependency. Track unported reference components as backlog, not launch blockers.
- **Open questions:** Which components are genuinely required for the coherent launch sweep?

#### O04. Lazy-load and segment site search

- **Relevant section:** WS4 SiteSearch
- **Priority:** P2
- **Type:** optional improvement, performance
- **Description:** Load the index on first search interaction and consider separate hospitality/new-insight indexes.
- **Rationale:** Most visitors will not search, and mobile is the dominant surface.
- **Impact:** Lower initial network and parse cost.
- **Recommended action:** Fetch on focus or dialog open, cache the result and keep a usable failure state.
- **Open questions:** Does one combined index remain within the agreed size budget after launch content is added?

#### O05. Add a machine-readable source manifest for the design handoff

- **Relevant section:** companion documents and WS3
- **Priority:** P2
- **Type:** optional improvement, delivery quality
- **Description:** Record bundle version, hash, component contracts, templates, token files and known placeholders in one manifest.
- **Rationale:** It would have exposed the current 42-versus-44 discrepancy immediately.
- **Impact:** Faster handoff validation and fewer source-of-truth disputes.
- **Recommended action:** Generate the manifest in CI and fail if documented counts drift.
- **Open questions:** Who owns publishing the corrected design bundle?

## Required changes before full implementation

The minimum changes required to move from red to amber are:

1. Correct the protected content list and the 105/106, 13/14 and 29/30 contradictions.
2. Replace the dependency graph so measurement and baselines precede content/template changes.
3. Redefine Phase 3 as an atomic coherence release or a private staging milestone.
4. Publish one complete route-disposition table, including case studies, error handlers and exact redirect syntax/status.
5. Pin the current design bundle and correct the 42/44 component count.
6. Specify the enquiry form, database/admin migration, privacy handling and follow-up process.
7. Specify the AI readiness assessment and the analytics event dictionary.
8. Add the technical SEO and non-page artifact migration.
9. Protect `/availability` styling and its no-third-party-request security boundary.
10. Add test, monitoring, deployment and rollback plans with owners.

## Unresolved decisions

These decisions need named owners and dates:

- final approval of `HEAR. EXPOSE. BUILD. PROVE.` and specifically `EXPOSE`;
- founder-led versus company-led presentation and delivery promises;
- permanent-site swearing boundary;
- exact public fit language, employee/revenue bands and qualification threshold;
- the canonical protected-post set and whether the cash-flow article remains live;
- whether case-study details ship at launch;
- exact growth-problem slugs;
- acceptance of Next.js 308 redirects or a true 301 requirement;
- approved Anchor metric definitions and proof permissions;
- enquiry form flow, next-step options and response service level;
- AI readiness scorecard purpose, questions, storage and scoring;
- Search Console/indexation policy for product subdomains;
- logo-use permission and approved Greene King/BII assets.

## Major risks after correction

Even with a corrected specification, the largest remaining risks are:

1. **Search regression on protected articles.** Visual and internal-link changes can still alter layout, crawl paths and user signals even when URLs stay fixed.
2. **Mixed-position launch.** Any missed metadata, feed, overlay or old commercial page can undermine the new story.
3. **Lead loss during migration.** The new form crosses UI, validation, database, admin, email and analytics.
4. **Global-style leakage.** Marketing tokens and lowercase rules can change the poll product and admin.
5. **Unverified proof.** Exact Anchor and historic percentage claims need consistent definitions and approval.
6. **Scope expansion.** The 83-post review and full component port can consume the programme without improving the first commercial journey.

## Recommended next steps

1. Hold a short specification-resolution session covering only the P0 findings and unresolved decisions.
2. Produce the route manifest, protected URL register, corrected dependency plan and coherent-launch checklist.
3. Write two small technical sub-specifications: enquiry/data and AI-readiness scorecard/analytics.
4. Pin and correct the design handoff, then build one vertical slice in staging: global chrome, Home, Start Here, lead capture and measurement.
5. Run accessibility, performance, security and production-like form tests on that slice before scaling the component/template migration.
6. Only then estimate and schedule the remaining pages, article restyle and ranking work.

**Readiness after these steps:** the programme can move to amber when all P0 findings are closed and every affected P1 finding has an owner, acceptance criteria and scheduled resolution. It becomes green only after the coherent launch slice passes staging, data, analytics, accessibility, performance, redirect and rollback tests.
