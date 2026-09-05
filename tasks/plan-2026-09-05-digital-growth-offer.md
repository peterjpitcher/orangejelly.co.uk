# Websites, applications and AI growth implementation plan

> **For agentic workers:** Use the implement-plan skill when implementation is authorised. Execute the checkable tasks in dependency order. Approval of this plan is not approval of a live test message or an unpublished commercial promise.

**Goal:** Make it immediately clear that Orange Jelly builds websites, bespoke applications and connected systems, using AI where it adds value, to grow businesses through better customer experiences, bookings and repeat business.

**Architecture:** Reuse the Next.js marketing pages, `oj` components, route manifest and existing enquiry flow. Introduce focused commercial destinations rather than a separate page for every keyword. Preserve the live guide-conversion pilot and its attribution contract.

**Tech stack:** Next.js 14 App Router, React 18, strict TypeScript, Tailwind CSS 3.4, Vitest 3, existing browser audit tools and Vercel.

**Spec:** This document records Peter's agreed positioning from the 5 September conversation, the supplied positioning draft and five Keyword Planner rounds. It is the controlling specification for the next phase. `tasks/plan-2026-09-05-lead-conversion.md` continues to govern the implemented enquiry work.

**Status:** Peter authorised this phase in full on 5 September 2026. Implementation and release verification are underway; see `tasks/digital-growth/verification.md`. No new migration or live test message is authorised.

## 1. Agreed direction and scope

The offer is concrete delivery: websites, bespoke applications and connected customer systems. Growth is the outcome. Strategy determines what to build; it must not obscure what a customer can buy. AI is visible and useful, not compulsory in every deliverable.

Keep the broader small-business audience, with strong hospitality evidence and a dedicated hospitality destination. Do not change the whole business into a hospitality-only agency. General marketing, supplier contracts and broad consultancy must not have equal prominence to the core builds. Existing content stays accessible; this phase does not remove protected content or services.

Explain a digital backbone with examples: bookings, customer records, guest portals, connected software and follow-up. Distinguish using AI during development from delivering an application with AI functionality. Never describe an ordinary site as AI-powered solely because AI helped write its code.

Retain discovery, implementation, measurement and agreed ongoing improvement. Do not publish a 30-day delivery phase, unlimited ongoing support, no-results/no-charge guarantee, new package or new price. Retain current verified commercial terms and contact details from constants. The attached draft is source material, not authority to introduce its proposed promises.

## 2. Proposed messaging and page hierarchy

### Homepage copy brief

- Title: `Websites, Applications & AI for Business Growth | Orange Jelly`
- H1: `Websites and connected systems that grow your business.`
- Introduction: `We build websites, bespoke applications and AI-powered workflows that help customers find you, book with you and come back.`
- Supporting sentence: `From your website to the systems behind it, we connect the customer experience and make everyday work simpler.`
- Primary action: `Tell us what you want to build or improve` linking to the existing enquiry section.
- Secondary action: `See what we build` linking to `/solutions`.

Order: explicit offer, three build categories, real work, outcomes and attribution, short method, suitable clients, enquiry invitation. Use websites, applications and useful AI as the three categories. Explain technical terms beside examples. Keep the homepage sector-neutral; guests and hospitality examples belong in relevant sections.

Do not force `business growth consultant` into the homepage H1 merely because it has volume. That earlier recommendation is superseded by Peter's clarified offer. Homepage phrasing is a positioning decision, not a claim of measured demand for the exact headline.

### Proposed commercial map

All new URLs below are proposed, not live or registered. Task 1 checks them for conflicts before implementation.

| Destination | Primary keyword cluster | Supporting terms | Scope and boundary |
| --- | --- | --- | --- |
| `/solutions` existing | Navigation hub, no separate keyword quota | websites, bespoke applications, connected systems | Three clear routes into the core work; links to retained wider capabilities further down |
| `/solutions/hospitality-websites` proposed | hospitality web design | pub website design, restaurant website design, booking website development | Website builds and integration with existing booking tools; hotel examples only when evidence supports them |
| `/solutions/bespoke-applications` proposed | bespoke web application development | business application development, customer portal development, custom software development for small business | Bespoke browser applications, portals and internal workflows; no unsupported native mobile app promise |
| `/solutions/booking-systems` proposed | custom booking system | bespoke booking system, online booking system development, booking automation | Building or connecting the booking workflow; distinguish website integration from replacing the booking engine |
| `/growth-problems/using-ai-intelligently` existing | AI consultant for small business | AI business consultant, AI implementation consultant | Assess and implement useful AI; links to actual application work; one destination for this cluster initially |
| `/pub-marketing` existing | pub marketing | marketing for pubs | Preserve existing purpose and link into the hospitality website offer |
| `/sectors/professional-services` existing | Retain existing sector focus | Relevant website and application examples | Maintain as a supporting sector, not a priority expansion into general marketing |

Each commercial page needs: buyer and problem, tangible deliverables, appropriate existing-system integration, a verifiable example, the engagement process, fit and limitations, relevant FAQs and an enquiry action. Describe what is included in agreed work; do not invent brands integrated, client projects, performance metrics or support terms.

Website FAQs: rebuilding versus improving, retaining an existing booking provider, content ownership, measuring bookings. Application FAQs: when existing software is enough, connecting customer records, browser versus native applications, how ongoing changes are agreed. Booking FAQs: integrating versus replacing, handling booking changes, guest communications, responsibility for third-party services. AI FAQs: suitable tasks, human checks, required data and when AI is unnecessary. Answer from actual delivery practice, not assumed capabilities.

## 3. Evidence and confidence

Historical statistics: UK segmentation, 1 August 2025 to 31 July 2026, exported 5 September. Language is not recorded in the files; English was requested in chat but has not been independently confirmed. All monthly breakdowns are empty. Values are coarse 50/500/5,000 estimates. Do not sum close variants, infer seasonality or treat blank values as proof of no demand.

| Target | Reported monthly figure | Source round | Interpretation |
| --- | --- | --- | --- |
| hospitality web design | 500 | 5 | Priority commercial hypothesis |
| pub website design | 50 | 5 | Smaller, relevant supporting term |
| restaurant website design | 500 | 5 | Reported three-month and annual declines of 90%; recent demand unresolved |
| bespoke web application development | 50 | 5 | Specific delivery fit |
| custom booking system | 50 | 5 | Specific delivery fit |
| AI consultant for small business | 50 | 1 | Better audience fit than the broad head term |
| AI business consultant | 500 | 3 | Broader supporting term |
| AI consultant | 5,000 | 4 | Broad audience; not the homepage priority |
| AI application development | 500 | 5 | Only applicable to applications containing AI functionality |

Sources are the five `Keyword Stats 2026-09-05` files at `08_02_52`, `08_05_01`, `08_07_00`, `08_07_49` and `08_10_14`, under Peter's iCloud Downloads folder. Forecast exports model advertising and assumed conversions; exclude them from organic performance projections. Paid competition and bids are not organic difficulty scores.

Search checks found commercial hospitality website/booking providers and specialist AI consultancies. Useful references: https://www.servdmedia.co.uk/services/hospitality-web-design, https://www.thefoundryhospitality.com/hospitality-websites-apps and https://www.aibizassist.co.uk/. These demonstrate offer types, not achievable positions. UK Google result features and organic ranking difficulty remain unverified. Complete the search-result and existing-page checks in Task 1 before locking new routes.

Avoid primary targeting of AI website builders, free tools, training, jobs, courses, native app development or hotel-specific services without corresponding scope and evidence. Do not build separate pages for consultant/consultancy variants.

## 4. Implementation tasks

### Task 1: Validate the page map and proof

**Files:** inspect `src/lib/route-manifest.js`, `src/app/solutions/content.ts`, `src/app/growth-problems/content.ts`, `src/app/results/case-studies.ts`, `src/app/home-content.ts`, `CLAIMS.md`; record findings in `tasks/digital-growth/page-map.md` when implementation starts.

- [ ] Inventory existing and redirected URLs for all proposed topics, including historical routes and existing AI tools. Reuse a suitable page rather than duplicate its purpose.
- [ ] Map available Search Console queries to their current destinations. Label unavailable query-by-page combinations rather than deriving them from separate totals. Record baseline dates, clicks, impressions, CTR and position without inventing missing values.
- [ ] Inspect UK English search results for the four priority clusters, recording date, result types and named competitors. Mark unobserved features as unverified. Record whether buyers seek bespoke work, existing software or information.
- [ ] Produce a final one-cluster-to-one-URL map. If two proposed pages satisfy the same intent, consolidate their planned content before creating routes.
- [ ] Inventory public work examples. Verify each example's ownership, scope and permission for publication. Use approved public material only; omit private screenshots or client details lacking permission.

**Acceptance:** every proposed route has a distinct purpose, an evidence source and a relevant enquiry destination. No recommendation claims a ranking or revenue outcome. Missing proof limits claims rather than causing invented examples.

### Task 2: Clarify the core offer

**Modify:** `src/app/page.tsx`, `src/app/home-content.ts`, `src/app/solutions/page.tsx`, `src/app/solutions/content.ts`, `src/components/oj/Header.tsx`, `src/components/oj/Footer.tsx`; align `tasks/repositioning/copy/homepage.md` and `tasks/repositioning/copy/solutions.md`. Update `docs/brand/positioning-overview.md` with the approved refinement during implementation, retaining factual history.

- [ ] Apply the homepage brief in section 2 and use the existing design system.
- [ ] Put the three concrete build categories before broad diagnostic content. Keep existing problem routes accessible through supporting links.
- [ ] Turn `/solutions` into a clear build overview. Until the new routes exist, its build-category links use sections on the same page; never publish a link to an unbuilt destination.
- [ ] Make the shared footer describe websites, applications and connected systems. Keep navigation concise; retain Guides and existing sector access.
- [ ] Review homepage tests in `src/test/homepage.test.tsx`; replace obsolete positioning assertions with meaningful heading, destination and proof assertions. Do not weaken claim or content gates to accommodate copy.

**Acceptance:** in a browser, the first screen states what is built and why. A visitor can find the website/application offer without reading the method. At 320 px and 390 px there is no horizontal overflow or blocked enquiry control. Keyboard focus and 200% zoom remain usable.

### Task 3: Build the approved commercial destinations

**Create, if Task 1 confirms the map:** `src/app/solutions/hospitality-websites/page.tsx` and `content.ts`; `src/app/solutions/bespoke-applications/page.tsx` and `content.ts`; `src/app/solutions/booking-systems/page.tsx` and `content.ts`.

**Modify:** `src/lib/route-manifest.js`, `src/app/solutions/content.ts`, `src/app/solutions/page.tsx`, `src/app/growth-problems/content.ts`. Test routes through `src/test/canonical-urls.test.ts` and `src/test/route-manifest.test.ts`.

- [ ] Build the pages using existing Server Components and `oj` primitives. Use the project's metadata helper, canonical host and route manifest; do not add a second route list.
- [ ] Use titles `Hospitality Website Design | Orange Jelly`, `Bespoke Web Application Development | Orange Jelly` and `Custom Booking Systems | Orange Jelly`, subject to the validated map. H1s explain the same service in plain language.
- [ ] Follow the section and FAQ briefs in section 2. Place genuine project examples near the offer, with problem, what was built and verified outcome distinguished.
- [ ] Retain approved Anchor attribution. Do not attribute the whole booking increase to a website or AI feature alone.
- [ ] Register only completed pages as live and indexable, then replace the hub's section links with their working routes in the same change.
- [ ] Refine the existing AI page with concrete application examples and links, preserving its URL and avoiding duplication of existing AI assessment tools.

**Acceptance:** each public route returns its intended page, has one correct canonical and appears once in the sitemap. Links work end to end. No empty case-study cards, invented integrations or unsupported claims are published.

### Task 4: Connect the offer to enquiries and relevant reading

**Modify:** `src/app/start-here/page.tsx`, `src/app/start-here/content.ts`, `src/app/how-we-work/content.ts`, `src/app/pub-marketing/content.ts`, `src/app/sectors/professional-services/content.ts`. Inspect `src/lib/enquiry-source.ts`, `src/lib/guide-conversion.ts` and `src/components/oj/EnquiryForm.tsx` before any attribution change.

- [ ] Welcome visitors who know what they want built as well as those seeking diagnosis. Preserve the early form, four required fields, reassurance, WhatsApp and email.
- [ ] Explain discovery as deciding the right build and measurement, not a compulsory vague consulting phase. Retain verified pricing and consultation terms.
- [ ] Link the pub page to hospitality websites and relevant growth-problem pages to applications or booking systems.
- [ ] Preserve all existing guide content, URLs and the three-guide pilot. Add commercial links through relevant surrounding components only after checking topical fit and the existing pilot measurement boundary.
- [ ] Reuse the existing enquiry path and validated attribution. Do not invent a `service` query parameter that the cleaner would discard. First verify existing referrer/source capture from a new commercial page through submission using fixtures; if service-level attribution needs new design, record it separately before altering the contract.

**Acceptance:** website, application and booking visitors can reach and submit the existing form in fixtures. Success, storage failure and notification failure behave as currently specified. Invalid context falls back cleanly. Consent rules remain intact and no PII enters analytics. Real production submissions and messages still require explicit permission.

### Task 5: Verify, release when authorised and measure

**Evidence:** `tasks/digital-growth/verification.md`, exact changed-file inventory and PR descriptions. No database change is planned.

- [ ] Run `npm run lint`, `npm run type-check`, `npm run test:run` and `npm run build`; run date-sensitive attribution/summary tests under UTC as well. Record pre-existing warnings separately from new failures.
- [ ] Run browser checks for homepage to each offer to enquiry, desktop and mobile, keyboard and zoom. Exercise fixture success and dependency failures where the flow changed. Check redirects and canonicals against their exact destinations.
- [ ] Review source/claims, route ownership, protected posts and published copy. Do not remove, move or rename protected content, change pricing or introduce commercial guarantees.
- [ ] Prepare independently reviewable commits for core messaging, commercial pages and enquiry/link alignment. Stage exact files only; preserve unrelated local work.
- [ ] After implementation/release authorisation, verify preview, merge, push and verify the exact production SHA, READY deployment and canonical-domain deployment ID. Record browser smoke checks and bounded runtime logs. No live claim based on a successful build alone.
- [ ] Record baseline and launch date for each changed page. Review organic query relevance, clicks, enquiries, qualified enquiries and unknown attribution after 28 complete days, with a further 8-week ranking review. These are review windows, not ranking promises. Do not attribute seasonal changes to this release alone.
- [ ] Keep the earlier guide pilot review separate. No scheduled automation without a user request.

## 5. Boundaries and completion

This plan does not change authentication, polls, databases, prices, response promises, guide article copy or unrelated applications. Preserve current claim constants, protected posts, URL ownership and consent controls. The existing delivery-test permission remains separate.

The implementation is complete only when the approved pages clearly communicate the specialism, real enquiry paths have been exercised to the authorised extent, checks pass, production identity is verified and limitations are documented. A keyword shortlist alone does not establish organic ranking opportunity.

Plan-only work ends with a reviewed specification and task checklist. It does not publish copy or authorise the proposals in the attached positioning draft. There are no new commercial guarantees in this plan.
