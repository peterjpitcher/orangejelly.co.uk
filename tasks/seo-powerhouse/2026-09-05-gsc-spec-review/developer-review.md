# Developer review: GSC indexing specification

**Assessment: not ready for delivery as written.** The asset crawl block, temporary apex redirect and two pages without inbound links are confirmed. The proposed direction is sensible, but the evidence totals, causal claims, P5 diagnosis, test definitions and completion criteria need correction before this becomes a reliable implementation brief.

Review date: 5 September 2026. This is a separate, read-only technical and delivery review. No fixes, domain settings, Search Console actions, messages or deployments were authorised or performed. No database migration is required or pending.

## Scope and evidence

Reviewed the [supplied specification](/Users/peterpitcher/.codex/attachments/c3dc0bb5-4369-4065-92b0-722e0f7c8f17/pasted-text.txt), its [repository copy](/Users/peterpitcher/Cursor/OJ-OrangeJelly.co.uk/tasks/gsc-indexing/SPEC.md), current relevant code and official Google, Next.js 14 and Vercel guidance. The two specification copies differ only by a final newline; both remain unchanged.

Local code inspected at commit `5848337cd93f7760031699d8fe0d0f2cf72212c0`. Public GET checks completed at 16:10 UTC on 5 September. Production asset URLs carried `dpl_Qnjnu9oeg4HmnDTa9tNJZ3aaziEh`; this is an observed asset deployment marker, not a verified Vercel project-to-commit mapping. Readiness must be rechecked against the deployment actually released.

The independent crawl fetched all **145 sitemap URLs**, all returning **200**. It counted distinct source pages with raw HTML anchors, excluding self-links and normalising fragments, queries and trailing slashes. Only sitemap URLs were used as link sources. This confirms zero inbound links to the two targets within that published sitemap set, not the absence of every possible link on the internet or outside the set. Four workers were used; no fetch failed. It did not execute JavaScript across all pages or simulate Google's renderer.

| Observation | Independently verified result |
| --- | --- |
| Robots | Live rules block `/_next/`, `/icon`, `/apple-icon`, `/opengraph-image`. |
| Assets | Sample optimised image, CSS, JavaScript and font URLs return 200 to normal GET requests, while their paths match the robots exclusion. |
| Two P3 targets | Both return 200, have self-referencing www canonicals and indexable robots metadata, but zero distinct inbound source pages in the crawl. |
| Four insights | Each has exactly two distinct source pages: `/insights` and `/sectors/professional-services`. |
| Apex | HTTP apex returns 308 to HTTPS apex; HTTPS apex returns 307 to www. A sampled deep path retains its query string. |
| Old guides | The three specifically named legacy guide URLs return 308 to their matching `/guides/` destinations; those destination pages return 200. |
| Component route | GET returns 200 with noindex metadata. The browser displays `404` and `that page is not here.`, not component specimens. |
| Icons | `/icon.png`, `/apple-icon.png`, `/opengraph-image` return 200; `/favicon.ico` returns 404. |
| Image claim | Of 401 image elements across the fetched pages, 397 use `/_next/image`; four use direct `/images/blog/*.png` paths. These are element counts, not unique images. |
| Monitoring | Running exactly `npm run monitor:posts` prints `Usage: npm run monitor:posts -- <path to GSC Pages.csv>` and exits with script status 2. |

Evidence: [crawl summary](/Users/peterpitcher/Cursor/OJ-OrangeJelly.co.uk/tasks/seo-powerhouse/2026-09-05-gsc-spec-review/evidence/summary.json), [responses and extracted links](/Users/peterpitcher/Cursor/OJ-OrangeJelly.co.uk/tasks/seo-powerhouse/2026-09-05-gsc-spec-review/evidence/live-checks.json), [distinct inbound source lists](/Users/peterpitcher/Cursor/OJ-OrangeJelly.co.uk/tasks/seo-powerhouse/2026-09-05-gsc-spec-review/evidence/internal-inbound.json), [live robots](/Users/peterpitcher/Cursor/OJ-OrangeJelly.co.uk/tasks/seo-powerhouse/2026-09-05-gsc-spec-review/evidence/robots.txt), [live sitemap](/Users/peterpitcher/Cursor/OJ-OrangeJelly.co.uk/tasks/seo-powerhouse/2026-09-05-gsc-spec-review/evidence/sitemap.xml), [sample asset requests](/Users/peterpitcher/Cursor/OJ-OrangeJelly.co.uk/tasks/seo-powerhouse/2026-09-05-gsc-spec-review/evidence/asset-checks.json), [component response](/Users/peterpitcher/Cursor/OJ-OrangeJelly.co.uk/tasks/seo-powerhouse/2026-09-05-gsc-spec-review/evidence/dev-components.html), [browser observation](/Users/peterpitcher/Cursor/OJ-OrangeJelly.co.uk/tasks/seo-powerhouse/2026-09-05-gsc-spec-review/evidence/browser-observation.md).

**Limitations:** no original 81-row GSC export, authenticated URL Inspection results, Performance export, crawl logs or Vercel domain settings were available to this review. Historical indexing classifications, traffic loss and the precise infrastructure rule responsible for the 307 are not independently confirmed. No conversion submission, full accessibility audit, load test or Google-rendered screenshot was performed. A public response is not proof of Google's indexed state. No application tests or build were run because this delivery changes documentation only; the failing monitoring invocation was reproduced to validate the runbook finding.

## Priority and finding types

**High:** resolve before approving the affected work or its acceptance criteria. **Medium:** resolve in the implementation ticket or release runbook. **Low:** optional improvement, outside the minimum repair. These are review priorities, distinct from the original document's P1 to P5 work labels.

A **confirmed issue** can be a defect in the specification itself, not necessarily a production defect. An **unconfirmed assumption** needs evidence before it is stated as fact. An **optional improvement** is not a release blocker. Decision references D1 to D3 are raised in the accompanying chat; the report records their delivery implications without embedding unanswered questions.

## Findings

### F01. The triage totals cannot be reconciled

**Priority:** High. **Type:** confirmed contradiction, data quality. **Section:** opening summary; sections 1, 2 and 5.

**Description:** The category totals sum to 81, but the subdomain table sums to 22, not 24. Reading the crawled category as 19 website URLs plus two management URLs implies 55 old-path redirects across categories: 11 + 2 + 23 + 19. The headline says 51. “Nineteen ... plus” also ambiguously places the two solution URLs inside or outside that 19.

**Rationale and impact:** The headline's disposition of all 81 rows cannot be audited. The counts may be corrected without changing the repair, but cannot support a confident wholesale dismissal.

**Recommended action:** Reconcile a single row-level inventory containing original URL, host, GSC category, snapshot date, current response, final destination and disposition. Derive every subtotal from it. Keep GSC category and present HTTP behaviour separate. Specify whether the two solution URLs are included in the 19. Do not substitute 55 as a verified export count before reconciling the source.

**Open items:** original export and reconciliation are evidence dependencies, not a product decision.

### F02. The evidence pack lacks provenance and mixes observation periods

**Priority:** High. **Type:** confirmed evidence gap. **Section:** sections 2, 3 and 7.

**Description:** The original export and inspection captures are absent. The figures 145 live, 142 discovered and 94 + 40 = 134 classified may represent different scopes or dates; the specification does not reconcile them. A missing referring page or last-crawl value is presented as complete discovery history.

**Rationale and impact:** Current crawling can support the link diagnosis but cannot recreate the 28 August report. URL Inspection's indexed record differs from its live test, and absent referring-page data is not proof that no such page exists. [Google URL Inspection guidance](https://support.google.com/webmasters/answer/9012289?hl=en).

**Recommended action:** Retain timestamped captures with property, exact URL, selected filters, report update date, inspection mode, last crawl, declared and Google-selected canonical. Label the two target statuses as supplied observations until those records are attached. Archive redirect chains and link-source lists, not just a command template. Redact private query strings and bearer tokens before committing or sharing exports.

**Open items:** access to historical evidence remains unresolved; it does not block the already verified asset repair.

### F03. Orphan status is not proof of the indexing cause or lost traffic

**Priority:** High. **Type:** unconfirmed causal and commercial assumptions. **Section:** opening summary and section 3.

**Description:** “Cause, established”, “no reason to spend crawl budget” and “actually costing traffic” go beyond the evidence. The two pages were only recently published at the discovery date. Their absence from a crawl schedule does not identify a single cause.

**Rationale and impact:** This could create an unjustified promise that adding links will recover traffic. Google advises most sites to focus on sitemap and indexing health; small sites do not automatically need an advanced crawl-budget programme. [Google crawl-budget guidance](https://developers.google.com/crawling/docs/crawl-budget).

**Recommended action:** Describe missing links as a confirmed discovery weakness and plausible contributor. Preserve the link repair, but check access, canonical selection, quality and actual post-release crawl evidence before asserting causation. Treat traffic improvement as an outcome to measure using comparable Performance data, not an established loss.

**Open items:** traffic baseline and Google's eventual selection remain unknown; no invented uplift target is needed.

### F04. Asset consequences are overstated despite a valid underlying defect

**Priority:** Medium. **Type:** confirmed factual overstatement and unconfirmed impact. **Section:** section 2, blocked resources; section 4, P1.

**Description:** “Every image”, “No image indexing at all”, “every page has no images” and “Rich results are not at risk” are not established. The live crawl finds four direct image paths as well as optimised paths. The specification itself identifies unblocked schema image URLs. Open Graph fetching by social platforms is a separate observation from Google's search rendering.

**Rationale and impact:** Blocked rendering resources are a sufficient reason to act; unsupported absolutes undermine the diagnosis. Unblocked image URLs do not establish all rich-result eligibility, and an OG rule does not prove every social preview has failed. [Google JavaScript guidance](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics) and [image guidance](https://developers.google.com/search/docs/appearance/google-images).

**Recommended action:** Say that Google is prevented from fetching matching resource URLs and that this can impair rendering and image discovery. Verify a marketing page and protected guide through Google's tested-page resources where access permits. Separate favicon, apple-touch icon, social-image and search-image effects. Do not broaden this repair into a schema rewrite.

**Open items:** Google-rendered appearance, image index coverage and rich-result status remain unverified.

### F05. P5 misidentifies a status-code problem as public harness exposure

**Priority:** High. **Type:** confirmed incorrect diagnosis. **Section:** section 4, P5.

**Description:** The browser displays the not-found page even though the response status is 200. Current [page code](/Users/peterpitcher/Cursor/OJ-OrangeJelly.co.uk/src/app/dev/components/page.tsx:105) already calls `notFound()` in production and sets `force-dynamic`. The manifest's promised hard 404 is not delivered, but the claim that visitors can access the harness is contradicted by the observed journey.

**Rationale and impact:** Implementing another identical `notFound()` guard would not address the mechanism. Next.js 14 documents 200 responses for streamed not-found pages. Dynamic rendering alone is not a hard-404 guarantee. [Next.js 14 documentation](https://nextjs.org/docs/14/app/api-reference/file-conventions/not-found).

**Recommended action:** Reframe P5 as correcting the HTTP status and inaccurate comment. If included, test a production build and deployment for actual 404 status, absent specimen content, expected noindex and preserved local development access. Diagnose response streaming before choosing the smallest change. Merely editing the comment does not meet the currently stated production-404 intention.

**Open items:** inclusion in this indexing release is part of D1; public exposure is not a supported security finding.

### F06. Suggested internal links are not a bounded delivery requirement

**Priority:** High. **Type:** confirmed functional ambiguity. **Section:** section 4, P3 and P4.

**Description:** It is unclear whether all eight P3 placements are mandatory, whether footer links alone satisfy the requirement, and which exact guides or growth-problem pages must link to each insight. “Strengthen” has no measurable end point; two incoming source pages do not establish thin content.

**Rationale and impact:** Developers can deliver materially different work and still claim compliance. Prominent fractional-CMO navigation also needs to respect the current website/applications/connected-systems offer rather than imply a new service. See [current solutions page](/Users/peterpitcher/Cursor/OJ-OrangeJelly.co.uk/src/app/solutions/page.tsx:54) and [fractional-CMO explanation](/Users/peterpitcher/Cursor/OJ-OrangeJelly.co.uk/src/app/fractional-cmo/page.tsx:9).

**Recommended action:** For the minimum repair, specify a contextual link from `/insights/what-is-a-fractional-cmo` to `/fractional-cmo`, and from `/growth-problems/using-ai-intelligently` to `/tools/ai-readiness`, with descriptive anchors and useful surrounding copy. Require visible HTML anchors to final canonical URLs. Treat other placements as separate editorial choices; define exact source-target pairs if P4 is included. Follow claims, positioning and protected-post rules.

**Open items:** D1 covers scope and placements. No content removal, slug change or new service positioning is authorised.

### F07. The proposed structural test can pass an unreachable site section

**Priority:** High. **Type:** confirmed test-design gap. **Section:** section 4, P3.

**Description:** “Zero internal inbound links” lacks rules for self-links, duplicate anchors, footer links, source eligibility, aliases, query strings, redirects and client rendering. Two disconnected pages can link to each other and satisfy the test while remaining unreachable from the homepage. The [existing outgoing-link test](/Users/peterpitcher/Cursor/OJ-OrangeJelly.co.uk/src/test/internal-links.test.tsx:111) does not measure inbound connectivity.

**Rationale and impact:** An undefined graph can produce false passes or unstable failures. The manifest alone cannot prove rendered links, and the [sitemap generator](/Users/peterpitcher/Cursor/OJ-OrangeJelly.co.uk/src/app/sitemap.ts:25) also includes dynamic content collections.

**Recommended action:** Define all published canonical sitemap targets as the required target set. Count distinct indexable source pages excluding self-links; separate contextual from shared-navigation links. Resolve relative URLs, normalise approved host aliases, fragments and non-content query parameters, and separately flag redirecting links. Require reachability from `/` to prevent disconnected clusters. Include published guides, categories, insights and case studies, while excluding drafts, future posts, tokens and deliberate non-indexable routes. A failed fetch must make the audit incomplete, never count as an empty page or pass.

**Open items:** D2 covers whether the full graph gate belongs in this release or follows focused regression assertions.

### F08. Crawl execution and CI integration are unspecified

**Priority:** Medium. **Type:** confirmed delivery, reliability and performance gap. **Section:** section 4, structural test.

**Description:** No command, runtime, environment, concurrency limit, timeout, retry policy or output is defined. Crawling production in ordinary unit tests would introduce network dependence, variable content and deployment drift.

**Rationale and impact:** A small fix could acquire a slow, flaky test system. Current public HTML is sufficient for the observed orphan defect; a browser on every page is not automatically necessary.

**Recommended action:** Use a bounded audit against the production build served locally, with the existing sitemap as input and a fresh browser sample for interactive exceptions. Cap concurrency and overall duration, retry transient failures a bounded number of times, and report incomplete coverage separately. Fail on unexpected redirects, non-HTML targets and fetch errors. Permit a separate read-only post-deploy crawl. Reuse existing Node/browser tooling; do not add a crawler service, database or second URL registry.

**Open items:** D2 sets gate scope; the developer can choose ordinary execution limits without a further business decision.

### F09. Robots tests must prove effective rules and real resources

**Priority:** Medium. **Type:** confirmed acceptance gap. **Section:** section 4, P1.

**Description:** Array membership checks do not prove that an asset is allowed: a broader disallow or a different bot group could still match it. Only two of the four retained exclusions receive explicit negative tests.

**Rationale and impact:** The proposed regression test could pass while the rendered robots response still blocks CSS, images or icons. [Google robots matching and caching rules](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec).

**Recommended action:** Test generated robots output and effective matching for Googlebot and Googlebot-Image, representative CSS, JS, fonts, optimised image queries, both icon paths and the generated OG URL. Verify all four retained exclusions, sitemap host and absence of a catch-all block. Fetch the actual live resource URLs for status and content type after deployment. Keep `/admin/` unchanged in this repair; do not describe its slash-prefixed robots rule as authentication or assume it matches bare `/admin`.

**Open items:** none requiring Peter's decision. The narrower allow-rule alternative should be removed from the ticket once one implementation is chosen.

### F10. Privacy acceptance promises more than its checker proves

**Priority:** Medium. **Type:** confirmed security verification gap. **Section:** section 4, P1.

**Description:** The [token checker](/Users/peterpitcher/Cursor/OJ-OrangeJelly.co.uk/scripts/check-token-privacy.mjs:42) verifies third-party request behaviour using synthetic tokens; it does not prove noindex metadata or the Referrer-Policy header. “Nothing under `/_next/` is sensitive” is also too broad a security assertion. Robots is a crawl directive, not an access boundary.

**Rationale and impact:** A passing single command must not become a blanket privacy guarantee. The code's actual token families are `/availability/p/`, `/availability/o/` and `/availability/verify/`, as defined in [token-routes](/Users/peterpitcher/Cursor/OJ-OrangeJelly.co.uk/src/lib/token-routes.ts:25).

**Recommended action:** Preserve those route controls and run the existing checker with its marketing control. If the ticket asserts all protections, separately check headers and metadata for the three synthetic route families. State that those fixtures do not exercise a valid participant session. Avoid real bearer URLs in crawler logs, reports or third-party inspection. Fix any actual secret exposure at its source rather than relying on robots. No auth, database or retention-policy change is part of this repair.

**Open items:** none for this review. Any future valid-token fixture requiring live data needs its own explicit authorisation.

### F11. Redirect ownership and the acceptance matrix are missing

**Priority:** Medium. **Type:** confirmed integration and deployment gap; partly unconfirmed assumption. **Section:** section 2, redirects; section 4, P2.

**Description:** The live 307 is confirmed, but a response alone does not identify the exact Vercel setting. “Every redirect in the codebase is a 308” is false: [middleware](/Users/peterpitcher/Cursor/OJ-OrangeJelly.co.uk/src/middleware.ts:147) also emits 301. The dashboard-only assertion is unnecessary; what matters is ownership of the domain configuration.

**Rationale and impact:** Permanent redirects support the canonical preference; both 301 and 308 are valid permanent choices. A temporary redirect does not prove the destination cannot be indexed. [Google redirect guidance](https://developers.google.com/search/docs/crawling-indexing/301-redirects).

**Recommended action:** Identify the Vercel project/team and current domain configuration, then retain 308 as the intended apex setting. Name an authorised operator and record before/after values. Test HTTP/HTTPS on apex/www, root, deep guide, legacy path, query-bearing path and a nonexistent path. Preserve paths and queries, reject loops and unrelated destinations, and verify final content/canonicals or the intended 404. Leave subdomain DNS and mail configuration unchanged. See [Vercel domain documentation](https://vercel.com/docs/domains/working-with-domains/deploying-and-redirecting).

**Open items:** authorised infrastructure operator and access must be assigned in the ticket; no dashboard mutation was made.

### F12. Legacy exclusions need final-destination checks, not just redirects

**Priority:** Medium. **Type:** confirmed migration-verification gap. **Section:** sections 1, 2, 5 and 6.

**Description:** A 308 is treated as enough to close an old-path issue. Only named examples are available to reproduce. A permanent redirect can still lead to unrelated content, a chain, a soft 404, noindex or an incorrect canonical.

**Rationale and impact:** Incorrect closures could hide migration regressions on protected guides. Other products are properly outside this repository's repair scope, but “outside scope” does not prove their exclusions are correct.

**Recommended action:** For each supplied website row, follow the chain and check destination status, relevance, canonical and indexability. Prioritise protected guides and maintain existing slugs. Record external-host rows as out of scope with an owner, without triggering cross-repository fixes. Retain intended redirects; do not seek to make their GSC exclusion rows disappear as a success target.

**Open items:** complete legacy URL inventory remains an evidence dependency. No new content migration is proposed.

### F13. Indexing and category movement cannot be release guarantees

**Priority:** High. **Type:** confirmed acceptance and monitoring gap. **Section:** section 6, especially steps 1, 3 and 5.

**Description:** “Move to indexed” and a roughly flat exclusion count are treated as expected completion. A report date later than 31 August does not establish that fixes released in September were crawled. Old hashed assets may remain excluded or vanish rather than be indexed.

**Rationale and impact:** Developers control deployed signals, not Google's selection or processing time. Google says crawl requests do not guarantee inclusion and repeated requests do not accelerate crawling. [Google recrawl guidance](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl).

**Recommended action:** Separate immediate release acceptance from search follow-up. Release acceptance should prove correct live rules, links, responses, content and canonicals. Record the actual deployment timestamp, later indexing-request time and later Google crawl date. Propose follow-ups at 7, 14 and 28 days after release as operating checkpoints, not Google deadlines. Escalate persistent non-crawl or exclusion to targeted diagnosis; never roll back useful links simply because indexing is slow. Allow for Google's cached robots file before interpreting unchanged resource reports.

**Open items:** D3 assigns the follow-up owner and checkpoints.

### F14. The reason given for avoiding Validate fix is incorrect

**Priority:** Medium. **Type:** confirmed process misconception. **Section:** section 5 and section 6.

**Description:** Validation is rejected because it would measure the stale snapshot. Google starts checking current affected URLs during validation. The real complication is the mixed domain-property category, which includes intentional exclusions in other products.

**Rationale and impact:** The stated rule can delay useful verification indefinitely or later trigger a validation that can never clear. Google can also recognise resolved issues without a manual validation request. [Google validation process](https://support.google.com/webmasters/answer/7440203?hl=en).

**Recommended action:** Keep manual validation optional. Scope any request to an actually repaired issue and eligible URL set after live verification. Do not validate intended redirects or intentional blocks merely to clear a report. Use individual URL Inspection for the two targets. Assign an owner/full user for indexing requests, record success or quota/access failure, and avoid repeated submissions. No new bulk-indexing integration is justified.

**Open items:** operator access and chosen follow-up method belong to D3; no Search Console write occurred.

### F15. The weekly monitoring command is not executable as specified

**Priority:** Medium. **Type:** confirmed runbook defect. **Section:** section 6, step 6.

**Description:** The bare command fails because the script requires a GSC Pages CSV. [The implementation](/Users/peterpitcher/Cursor/OJ-OrangeJelly.co.uk/scripts/monitor-protected-posts.mjs:84) reads that local export and deliberately exits successfully when traffic alerts exist. It is neither a live GSC fetch nor a scheduler.

**Rationale and impact:** A developer could hand over a monitor that never runs or silently ignore its printed alerts. Comparing a weekly export to a differently sized baseline window would also mislead.

**Recommended action:** Specify `npm run monitor:posts -- <path-to-GSC-Pages.csv>`, the property/host filters, search type, comparable date windows and manual reviewer. Store review results and define escalation for missing data and meaningful protected-page declines. Check the historical baseline's window before comparing totals. Do not wire exit code zero to an “all clear” notification. Scheduling is a separate authorised action.

**Open items:** D3 assigns export and review responsibility.

### F16. Release sequencing, rollback and verification ownership are absent

**Priority:** High. **Type:** confirmed delivery gap. **Section:** sections 4 to 6.

**Description:** There are no ticket owners, approval boundaries, dependencies, build gates, deployment identity requirements or rollback instructions. P2 changes infrastructure separately from repository code. The review-only status does not authorise either.

**Rationale and impact:** Code rollback alone cannot restore a changed domain setting. An unverified deployment could be mistaken for the tested build. Other work has shipped since the specification's reference release.

**Recommended action:** Use the release sequence below. Record exact files, commit, deployment ID, production alias, timestamps and operator. Require existing lint/content checks, `type-check`, `test:run` and build, then actual deployed-path checks. Keep code changes separate from domain settings in the release log. Restore the prior domain setting for loops/path loss; revert the relevant code increment for a demonstrated regression. Google report latency is not a rollback trigger.

**Open items:** implementation and live changes need explicit authorisation after this review. No migration is needed.

### F17. Visitor journeys and accessible link behaviour need focused acceptance

**Priority:** Medium. **Type:** confirmed user-journey and accessibility gap. **Section:** section 4, P3/P4.

**Description:** The specification ends at adding links and requesting indexing. It does not verify that readers recognise the destinations, can use the links by keyboard, or can complete the AI assessment handover to the enquiry page.

**Rationale and impact:** More visits only help if the existing journey remains usable. [The assessment code](/Users/peterpitcher/Cursor/OJ-OrangeJelly.co.uk/src/app/tools/ai-readiness/AiReadinessTool.tsx:74) supports pressure and no-pressure results, focus movement and an enquiry prefill, so these are concrete existing paths to preserve, not requests for new features.

**Recommended action:** Test the agreed source links on mobile and desktop for descriptive names, focus visibility, ordinary same-tab navigation and crawlable `href`. Exercise both assessment result branches, incomplete-answer feedback, keyboard completion, result focus, reset/revisit behaviour and encoded prefill on `/start-here`. Check that consent choices do not block the journey. Use fixtures for submission failures and do not send a real enquiry without separate permission. Keep source links usable without JavaScript; describe any assessment limitation or existing fallback honestly.

**Open items:** no defect in these flows is asserted by this review; execution belongs in release QA.

### F18. Measurement and performance need small, proportionate safeguards

**Priority:** Medium. **Type:** confirmed non-functional gap. **Section:** sections 3, 4 and 6.

**Description:** There is no measurement baseline for the commercial claim, or post-unblocking check for resource errors and image-optimiser load. The plan could also tempt unnecessary tracking just to count added links.

**Rationale and impact:** Changes in crawlability are not equivalent to ranking, enquiries or revenue. Opening existing resource paths may change crawler demand, but there is no measured load problem in this review.

**Recommended action:** Record page-level impressions/clicks and index state before release where available. Reuse consent-gated assessment events already in the code. Compare consistent periods and avoid causal attribution from a small movement. Review existing hosting errors, latency and image usage after release; retain normal caching and do not disable image optimisation as a speculative fix. Add no tracking SDK, raw-answer storage or new personal-data field for this task.

**Open items:** baseline data and monitoring ownership depend on D3. No load test or analytics rewrite is required for these small link/rule changes.

### F19. A favicon.ico is optional, not part of the indexing repair

**Priority:** Low. **Type:** optional improvement. **Section:** section 4, P1.

**Description:** The missing `.ico` endpoint is real, but the existing PNG favicon is present and declared. The repair required for the existing icon is crawl access. Google supports common favicon formats, including PNG. [Google favicon guidance](https://developers.google.com/search/docs/appearance/favicon-in-search?hl=en).

**Rationale and impact:** A duplicate icon creates another asset to maintain without addressing an additional proven indexing fault.

**Recommended action:** Unblock and verify the existing declared favicon first. Add `.ico` only for a separately identified compatibility need, using approved artwork and consistent metadata. Do not promise that a favicon will appear in search immediately.

**Open items:** D1 recommends deferring this optional asset.

### F20. A URL-prefix property is useful reporting scope, not a technical fix

**Priority:** Low. **Type:** optional improvement. **Section:** section 5.

**Description:** A www HTTPS property can separate website reporting from application subdomains, but it does not change indexing, redirects or robots. It also omits apex and HTTP migration observations.

**Rationale and impact:** Treating property creation as part of the repair can add access/setup work without changing live behaviour.

**Recommended action:** Retain the domain property for whole-domain diagnosis. Add a www prefix property only if it materially simplifies ongoing review; otherwise document appropriate report filters. Name the owner and avoid assuming new permissions or a reset of search processing.

**Open items:** D1 recommends treating this as optional follow-on reporting work.

## Suggested wording changes only

These are targeted amendments for the author, not a rewritten specification:

| Location | Suggested replacement |
| --- | --- |
| Opening summary | “Most recorded exclusions appear intentional or relate to legacy URLs. Current checks confirm blocked rendering assets, a temporary apex redirect and two sitemap pages without inbound links. Reconcile the original URL inventory before publishing exact disposition totals.” |
| Section 3 cause statement | “The two pages have no inbound links from the crawled sitemap pages. This weakens internal discovery and may contribute to delayed crawling; the precise cause and traffic impact are not established.” |
| Section 2 image consequence | “The rule blocks optimised image URLs and rendering assets used across the site. Some direct image URLs remain crawlable; actual Google rendering and image-index impact need inspection.” |
| P5 | “The production route returns HTTP 200 with a noindexed not-found page. Component specimens were not visible. Correct the hard-404 claim and, if in scope, fix the response status.” |
| Section 6 indexing outcome | “After release, verify the live technical changes and request indexing once. Track subsequent crawl and index status separately; indexing is an intended outcome, not a guaranteed release criterion.” |
| Section 6 monitoring command | “The nominated reviewer exports comparable GSC Pages data and runs `npm run monitor:posts -- <path-to-GSC-Pages.csv>`, then reviews the printed results.” |

## Recommended acceptance and delivery sequence

1. **Correct and scope the brief.** Reconcile counts and evidence labels; apply F03 to F06 wording corrections. Agree D1 to D3 in chat. Attach the exact P3 source-target list and owner assignments. Keep historical data gaps visible rather than blocking independently proven repairs.
2. **Prepare the smallest code increment after authorisation.** Unblock the four asset prefixes; add the agreed contextual links and focused regression checks. Include full graph validation only under the agreed D2 scope. Use existing route/sitemap sources. Keep P4, favicon and prefix-property work separate unless selected. Handle the streamed 404 correction as a distinct, testable increment if included.
3. **Verify a production build.** Run `npm run lint`, `npm run type-check`, `npm run test:run` and `npm run build`. Test rendered robots matching, source links, target metadata, graph completeness where included and visitor journeys. Fail on unexpected errors or incomplete coverage. Existing content checks must remain intact.
4. **Approve and release the concrete change set.** Record files changed and deliberately excluded, tested commit and rollback. Deploy code through the normal Vercel process. Apply the separately approved apex setting with an authorised operator and before/after record. Infrastructure can be sequenced independently, but both need their own evidence.
5. **Verify production immediately.** Record deployment ID and timestamp; fetch robots, current assets, canonical targets and the redirect matrix. Click the agreed links. Run `npm run check:token-privacy` and separately verify any broader privacy assertions. Check relevant legacy/protected destinations. Run the existing synthetic suite with failures investigated against current behaviour, not assumed away.
6. **Complete the search follow-up.** Once live checks pass, an authorised owner/full user submits the two target URLs once. Record submission or access/quota failure. Review fresh indexed observations and comparable Performance data at the agreed checkpoints. Treat persistent exclusion as a new diagnostic task, not proof the deployment failed.

No schema change, data backfill, package migration, content move or database operation is needed. Preserve the manifest, protected post paths and existing token controls. Keep real form submissions and mail out of read-only QA.

## Readiness, decisions and risks

**Ready:** the factual basis for removing the four asset exclusions; the permanent-apex preference; adding relevant contextual links to the two confirmed targets. These are technically small changes.

**Not ready:** the complete handover and its claims of cause, scope and success. Required corrections are F01/F02 evidence reconciliation, F03/F04 calibrated claims, F05 corrected diagnosis, F06 to F10 executable requirements, and F13 to F16 operational acceptance and ownership. No critical security incident or measured traffic loss has been established.

**Unresolved delivery decisions, raised in chat:** D1 defines the minimum release and optional work; D2 defines the full-site connectivity gate; D3 names the search follow-up owner and review checkpoints. These do not prevent completion of this review. Evidence still needed includes the source GSC rows/inspection captures and the authorised Vercel project configuration.

**Major risks:** shipping the wrong P5 fix; closing legacy rows without checking their destinations; declaring privacy proven by an incomplete check; creating a flaky production-dependent crawl test; overstating Google's response; and allowing unbounded editorial work to delay the small verified repairs. Each has a corresponding action above.

**Recommended next step:** approve a corrected, bounded implementation ticket covering the verified minimum repair, regression checks and an owned follow-up. Do not approve the entire document unchanged.

## Delivery status and file accounting

Created this developer report and its read-only evidence folder. Appended the review checklist and completion record to [tasks/todo.md](/Users/peterpitcher/Cursor/OJ-OrangeJelly.co.uk/tasks/todo.md). No application source, tests, content, configuration, original specification or deployment was changed. The original untracked `tasks/gsc-indexing/` folder was left intact.

**Done** - Separate technical and delivery review delivered, local only. No migration pending.
**Next:** Resolve the three delivery decisions in chat before implementation authorisation.
