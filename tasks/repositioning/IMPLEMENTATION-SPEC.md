# Orange Jelly repositioning: governing implementation spec

**Version:** 1.1
**Date:** 27 August 2026
**Supersedes:** v1.0 of 26 August 2026, following the developer review in
`IMPLEMENTATION-SPEC-REVIEW.md`
**Status:** Foundation and vertical-slice work approved. Full page migration gated on the three
sub-specifications named in section 10.
**Owner:** Peter Pitcher

This is the single plan. If a piece of work on the repositioning is not in here, it has not been
scoped.

### What changed in v1.1

The review raised 54 findings. Disposition of every one is in `SPEC-REVIEW-RESPONSE.md`. The
material changes:

- Every count is corrected and now generated from committed data, not written by hand.
- The dependency graph is rebuilt. Measurement and baseline capture move to **WS0**, before anything
  touches a page.
- Phase 3 becomes an **atomic launch coherence release**, not five pages.
- `/availability` protection becomes a technical requirement with a security clause, not a note.
- Three sub-specifications are now required before the work they govern can start.
- Absolute acceptance language is replaced with testable criteria.
- **D2 is closed.** Peter has validated the five performance metrics personally. They are approved
  for publication.

---

## 0. Source of truth, pinned

Counts in v1.0 came from prose and were wrong in four places. Everything below is now derived from
committed files.

| Thing | Value | Derived from |
|---|---|---|
| Design bundle | **42 components, 14 templates** | `docs/brand/design-system/`. The designer's handback says 44. It is wrong. 42 `.jsx.txt` and 42 matching `.d.ts.txt`, no orphans. |
| Superseded bundle | v1, 29 components, 6 templates | `docs/brand/_source/orange-jelly-design-system-v1.zip`. **Obsolete. Do not implement from it.** |
| Blog articles | **105 live, 1 redirected** | 106 files in `content/blog/`, build generates 105 guide pages. `cash-flow-crisis-breaking-cycle` is redirected. |
| Protected posts | **30** (tier 1: 14, tier 2: 16) | `data/protected-posts-register.csv` |
| Review posts | **72**, of which 52 earn zero clicks | Same register |
| Blog clicks, 12 months | 897 across 102 ranking URLs | Same register |
| Redirect rules | **15 rules resolving to 22 paths** | `next.config.js`. One rule templates over 8 counties. |
| Search Console exports | Committed | `data/gsc-orangejelly-2026-08-26/`, `data/gsc-the-anchor-2026-08-26/` |

The review's finding F03 said the exports were absent. They are committed, 14 files tracked. The
register CSV is regenerated from them, so every protected-post number in this spec is reproducible.

**Rule: no count appears in this document unless it can be regenerated from a committed file.**

---

## 1. What this is doing

Moving orangejelly.co.uk from hospitality marketing agency to **growth partner for ambitious small
and mid-sized businesses**, without breaking the small amount of search authority that exists, and
without pretending the new positioning has demand it does not have.

### The four things the evidence changed

1. **The site earns 969 clicks a year.** The blog is 92.9% of it. Fourteen posts carry 80%. The
   twelve pub landing pages and five service pages the plan was originally built to protect earn
   eleven clicks a year between them.
2. **The new positioning has almost no Google demand.** 243 terms tested. Fifteen are worth building
   for.
3. **The biggest available win is rankings, not pages.** 69,698 impressions produce 969 clicks at
   average position 9 to 13.
4. **The Anchor is the proof.** It earns fifteen times the traffic, and 41.7% of its organic Google
   Search clicks in the 12 months to 26 August 2026 came from aviation content rather than pub
   content.

### What success looks like

Restated as testable criteria. v1.0 used absolutes that would have failed valid content.

- A visitor understands within 20 seconds that Orange Jelly solves growth problems, starts with the
  problem, works across commercial, operational and technical issues, and treats AI as a tool.
- **No master company description** uses "hospitality marketing agency". Approved sector usage
  inside the hospitality hub remains, because it is accurate there and it is the highest-value term
  in the research.
- **No protected URL suffers a canonical, metadata, internal-link or content regression.** Rankings
  are monitored against agreed thresholds, not guaranteed, because they are not ours to control.
- **All primary commercial conversion CTAs** read "Bring us the problem". Functional controls
  (search, share, submit, pagination, cookie) keep descriptive labels.
- **No Orange Jelly service price is published.** Editorial pricing examples in articles are
  permitted and expected.
- Qualified enquiries arrive through a conversation, not a purchase.

### Explicitly out of scope

- `/availability` and `/admin`. Out of scope is enforced technically in WS2, not merely declared.
- The `cheersai`, `mixerai` and `management` subdomains, beyond an indexation decision.
- Paid search.

---

## 2. Decisions in force

Full text in `decisions.md`.

| | Decision |
|---|---|
| D1 / D14 | Existing URLs stay live, refined by evidence. 30 protected posts, commercial pages free to restructure. |
| D2 | **CLOSED 27 Aug 2026.** Peter has personally validated the five metrics. Approved for publication. |
| D3 | No Orange Jelly service price on the site. |
| D8 / D11 / D12 | Entry is always a free discovery conversation. Primary CTA is "Bring us the problem". |
| D13 | Professional services first. Trades is a second wave. |
| D15 | Ranking work runs alongside the rebuild. |
| D16 | Keyword research closed. |
| D17 | **Marketing tokens are scoped, not global.** See WS2. |
| D18 | `/about-demo` and `/test-shadcn` are deleted in WS1. |
| D19 | The bearer-token security boundary on `/availability` is non-negotiable and gains a test. |
| D21 | The brand is Orange Jelly, not Peter. Company voice, no founder-story page structure. |
| D22 | No expletives anywhere on the site. |
| D23 | No published response time. |
| D24 / D27 | Cookieless analytics load unconditionally. GTM and GA4 stay behind consent. |
| D25 | 24-month lead retention. |
| D26 | The method is **HEAR. CHALLENGE. BUILD. OPTIMISE.** |

### Still open

The copy decisions that blocked pages are closed. One remains.

| Open decision | Blocks | Needed by |
|---|---|---|
| Public fit language and qualification threshold | `/start-here` | Before WS5 order 2 |

The wording of the twelve scorecard statements is open but not blocking: Peter has approved the
structure and will give feedback once it is built.

---

## 3. Target information architecture

### Navigation

`Growth problems` · `How we work` · `Results` · `Insights` · `About` · **Bring us the problem**

### The two content collections

**`/licensees-guide/*` does not move.** It carries 897 of the site's 969 clicks and all 30 protected
posts. Moving it to satisfy the blueprint's naming would risk the only search asset the company has.
It is also honest: every post in there is pub content.

New-positioning content starts fresh at `/insights/*`. Two collections, two audiences, no migration
risk. The content model for the second collection is a named sub-specification (section 10).

### Route disposition

Every public route has exactly one outcome. This table is the contract. Where v1.0 was silent, an
outcome is now stated.

**Keep, restyle only**

| URL | Template | Note |
|---|---|---|
| `/` | `landing-page` | |
| `/about` | `about` | 26 clicks |
| `/contact` | reduced `start-here` | Hero and form, no qualification steps, no FAQ |
| `/results` | `results` | |
| `/results/[slug]` | `case-study` | **New in v1.1.** v1.0 omitted it while specifying the case-study template and the article to problem to case to offer chain. Source: `content/case-studies/`. |
| `/privacy` | prose | **Must be updated** for the new enquiry data. See section 10. |
| `/licensees-guide` | `sector-hub` | Hospitality sector hub |
| `/licensees-guide/[slug]` | `blog-article` | 105 live articles. Paths do not change. |
| `/licensees-guide/category/[category]` | `blog-listing` | Restyle, keep taxonomy |
| `/pub-rescue` | `sector-landing` | 6 clicks, 519 impressions |
| `/pub-marketing` | `sector-landing` | Absorbs all five `/services/*` children |

**New**

| URL | Template |
|---|---|
| `/growth-problems` | `growth-problems-hub` |
| `/growth-problems/{8 slugs below}` | `growth-problem` |
| `/how-we-work` | `how-we-work` |
| `/solutions` | `solutions` |
| `/start-here` | `start-here` |
| `/insights`, `/insights/[slug]` | `blog-listing`, `blog-article` |
| `/sectors/professional-services` | `sector-hub` |
| `/tools/ai-readiness` | `Scorecard` |
| `/fractional-cmo` | `growth-problem` variant |

**The eight growth-problem slugs.** v1.0 left these unnamed, which would have let developers,
writers, analytics and redirects each invent their own. The template's internal `problem` values are
not a URL contract.

| Slug | Template variant | Display title |
|---|---|---|
| `growth-has-stalled` | `stalled` | Growth has stalled |
| `not-enough-leads` | `demand` | Demand is drying up |
| `leads-not-converting` | `conversion` | Leads are not converting |
| `margin-under-pressure` | `margin` | Margin is disappearing |
| `operations-slowing-us-down` | `operations` | Operations are slowing the business |
| `customer-experience-leaking-value` | `experience` | The experience is leaking value |
| `where-to-start-with-ai` | `ai` | We want to use AI and do not know where to start |
| `systems-cannot-scale` | `scale` | The systems cannot take the next stage |

**Error handling.** v1.0 specified `/404` and `/500` as routes. That is wrong for the App Router and
would leave runtime and nested-route errors on the wrong UI. Implement the `error-page` design
through `src/app/not-found.tsx`, `src/app/error.tsx` and `src/app/global-error.tsx`. The `notfound`
variant carries `SiteSearch`; the `error` variant does not, because the backend may be the thing
that failed.

**Deleted (D18)**

| URL | Reason |
|---|---|
| `/test-shadcn` | Development artefact, publicly routable |
| `/about-demo` | Leftover `route.ts` handler, live and indexed at 22 impressions |

### Redirects

**Status.** `permanent: true` in Next.js 14 emits **308**, not 301. v1.0 said 301 throughout. 308 is
treated as equivalent to 301 by Google for consolidation, so **308 is accepted**. The spec says 308
so that tests assert the right thing.

**Existing.** 15 rules resolving to 22 paths, including 8 templated county paths. Four interact with
this plan:

| Existing rule | Interaction |
|---|---|
| `/services` to `/ways-to-work` | `/services` is already a redirect, not a page. Its 1,199 impressions are for a URL serving no content. |
| The two `/services/*` social rules to `/services/social-media-marketing-for-pubs` | Their target is retired here. Repoint or create a chain. |
| `/pub-marketing-${county}` to `/pub-marketing` | 8 paths. Already correct, leave alone. |
| `/licensees-guide/cash-flow-crisis-breaking-cycle` to `/fix-my-pub` | Points at a page retired here. This is also why the build makes 105 pages from 106 files. |

**Rule: every redirect resolves in one hop. When a target moves, repoint everything aimed at it in
the same change.**

**New and repointed**

| From | To | Note |
|---|---|---|
| `/fix-my-pub` | `/pub-rescue` | |
| `/licensees-guide/cash-flow-crisis-breaking-cycle` | `/pub-rescue` | Repointed |
| `/empty-pub-solutions` | `/pub-rescue` | |
| `/quiet-midweek-solutions` | `/pub-rescue` | |
| `/compete-with-pub-chains` | `/licensees-guide/compete-with-wetherspoons` | |
| `/pub-marketing-agency` | `/pub-marketing` | |
| `/pub-marketing-no-budget` | `/pub-marketing` | |
| `/services/:slug` | `/pub-marketing` | Covers all five children. Valid Next syntax, not `[slug]`. |
| `/services` | `/how-we-work` | Repointed from `/ways-to-work` |
| `/capabilities` | `/solutions` | |
| `/ways-to-work` | `/how-we-work` | 835 impressions. Redirect, never delete. |
| `/ways-to-work/:slug` | `/how-we-work` | Valid Next syntax |

**Leave alone.** `/autumn`, `/christmas`, `/summer` carry Greene King and BII campaign tracking and
point at protected posts. The seven `/licensees-guide/*` to `/licensees-guide/*` rules are completed
content merges.

**Total click exposure of the entire restructure: 2 clicks a year.**

**The redirect table is generated, not hand-written.** A route manifest (`src/lib/route-manifest.ts`)
holds each route's disposition, destination, canonical status and sitemap membership. It generates
the `next.config.js` redirects, drives sitemap exclusion, and is the fixture for the redirect tests.
Hand-counting the config is what produced the wrong number in v1.0.

---

## 4. Workstreams

### WS0: Measurement and baseline

**Depends on:** nothing. **Runs first. Nothing touches a page until this is done.**

v1.0 had WS8 depending on WS5 while also needing to baseline before WS6. That was impossible and
would have lost the baselines.

1. Baseline all 30 protected posts: clicks, impressions, position, CTR, canonical, title, meta
   description, H1, internal links in and out. Store as a dated snapshot beside the register.
2. Event dictionary (sub-spec, section 10). Names alone are not implementable.
3. GA4 enquiry event live on the **current** site before anything changes, so there is a
   before-and-after.
4. Error and failure monitoring: server-action failures, lead-write failures, notification failures,
   404 rate, redirect loops.
5. Synthetic checks: homepage, a protected article, search, enquiry submission.

**Done when:** a rerun of the register reproduces the same numbers, the enquiry event fires in GA4
DebugView and lands in the first-party store, and an induced lead-write failure raises an alert.

### WS1: Foundations

**Depends on:** WS0.

1. Delete the 27 unreferenced components, `demo/ui/`, `/test-shadcn` and `/about-demo`.
2. Collapse the nine transitional wrappers and delete `src/components/adapters/`.

   **API migration, which v1.0 omitted.** Removing wrappers before the new components exist breaks
   every call site. The order is: produce an import graph and a per-family compatibility table,
   replace the implementation behind the existing stable import path, migrate call sites in batches,
   then remove the facade only when no consumers remain. Backward-compatible props are allowed
   temporarily and must be removed before WS3 closes.
3. Update `check-growth-language.mjs`, whose `FILE_TARGETS` names three components being deleted.
4. Add a `docs/brand/` exclusion to the language gates so vendored files stop forcing `--no-verify`.
5. Create `src/lib/route-manifest.ts` and generate redirects from it.

**Done when:** the CI command set in section 6 passes and no commit needs `--no-verify`.

### WS2: Design tokens, scoped

**Depends on:** WS1.

**D17: the marketing palette is scoped, not global.** This is the answer to the `/availability`
question and it is a requirement, not a preference. "Out of scope" is not an implementation
mechanism. `:root` custom properties and a global `h1,h2 {text-transform:lowercase}` reach every
route regardless of intent.

1. Marketing tokens and the lowercase rule apply to a marketing scope (a `data-surface="marketing"`
   attribute or wrapper set in the marketing route group's layout), never bare `:root`.
2. `/availability` and `/admin` keep the current tokens, unchanged.
3. **D19, security.** `MarketingChrome.tsx` deliberately blocks GTM, Vercel Analytics, performance
   monitoring and preconnects on `/availability`, because organiser URLs carry a bearer token in the
   path and would otherwise leak to third parties. `ChromeGate` does the same for chrome. Both
   behaviours are non-negotiable and survive any layout change. **There is currently no test guarding
   this. Add one:** assert no third-party request and no marketing chrome on `/availability/o/:token`
   and `/availability/p/:token`.
4. Map the tokens, add the seven `--cat-*` pairs, reconcile with `src/lib/category-colours.ts`.
5. Pressure shadow, 1.5px borders, 3px radius, snap easing, orange double focus ring.
6. Fonts via `next/font` with a self-hosted or Google-sourced Schibsted Grotesk, **not** the
   bundle's runtime `@import`. The app already uses `next/font` and the CSP is configured for it.
7. Port `tokens/prose.css` to the Typography config.

**Lowercase headings need a content mechanism.** The rule lowercases every `h1` and `h2`, and proper
nouns need `.oj-keep-case`. The Markdown pipeline sanitises raw HTML, so writers cannot wrap "VAT",
"AI" or "Google" in a span. Either scope lowercase to marketing display classes only and leave
article body headings alone, or add a supported AST mechanism. **Recommendation: scope it to display
headings on marketing templates.** Article headings stay sentence case. Test against
`pub-vat-accounting-guide`, which is protected and full of proper nouns.

**Done when:** the contrast test passes across the extended state matrix (normal, hover, focus,
active, disabled, error, inverse, and text over highlight bands), `/availability` and `/admin` are
visually unchanged under regression snapshots, and the token leak test passes.

### WS3: Component library

**Depends on:** WS2.

Port the 42 reference components to typed Tailwind and CVA. **Port on demand**: a component is not
built until a page in WS5 or WS6 needs it. Unported components are backlog, not launch blockers.

Family mapping is unchanged from v1.0 and is in `component-audit.md`.

**Done when:** each ported component matches its `.d.ts.txt` contract **and** its `.prompt.md`
behaviour rules, has states for empty, loading and error where applicable, passes axe and keyboard
tests, and renders in a private component harness that is not an indexed production route.

Component count is context, not a gate. The gate is the CI command set plus duplicate-implementation
and unused-export reports.

### WS4: Chrome and global

**Depends on:** WS3.

Header with both tones, orange on conversion pages only. Mobile drawer first, since mobile is 78% of
clicks and ranks eight positions better. Footer. StickyCTA. CookieNotice with a permanent reopen
control. SiteSearch.

**Site search needs rebuilding, not reusing.** The current `search-index.json` holds 103 hospitality
items, is about 936 KB, hard-codes `/licensees-guide/<slug>`, and is not rebuilt by `npm run build`.
Feeding it to the new component produces a search that cannot find the new proposition. Define the
indexed types, update the builder, run it in CI, lazy-load the index on first interaction, and
handle stale, missing and corrupt indexes.

**Fixed-surface rules.** Sticky header, sticky CTA, cookie notice and mobile drawer can collide.
Define stacking order, a maximum combined fixed footprint, safe-area padding, `prefers-reduced-motion`
behaviour, and what happens when the mobile keyboard opens. Test at 320px and in short landscape.

### WS5: New pages

**Depends on:** WS4, and on the enquiry sub-spec for `/start-here`.

Build order: `/`, `/start-here`, `/how-we-work`, `/results`, `/about`, then `/growth-problems` and
its eight children, `/solutions`, `/tools/ai-readiness`, `/sectors/professional-services`,
`/fractional-cmo`, `/insights`, error handlers.

`/results/[slug]` case studies ship with the Results overview. D2 is closed, so the five metrics are
approved and the proof pages are no longer blocked.

### WS6: Existing page migration

**Depends on:** WS4 and WS0's baseline.

Restyle the hospitality hub, all 105 live articles, and the pub landing pages. Apply the redirect
table. Add `ShareRow` and `NextStep`.

**`NextStep` needs a data contract, which v1.0 omitted.** Adding it to 105 posts without curated
mappings produces repetitive or broken calls to action on the highest-value content. Build a typed
mapping keyed by slug, validate every destination at build time, define category-level fallbacks,
and require editorial approval for the 30 protected posts. The existing related-links data contains
retired routes and old prices and cannot be used as is.

**"Untouchable" was the wrong word.** v1.0 said protected posts must not change while WS7 requires
ranking changes to the same posts. Replace it with a change budget:

| Tier | Path | Metadata and headings | Body copy | Internal links |
|---|---|---|---|---|
| 1 (14 posts) | Immutable | Allowed, approved, snapshot before and after | Allowed, approved | Allowed |
| 2 (16 posts) | Immutable | Allowed | Allowed | Allowed |
| 3 (72 posts) | Reviewable | Free | Free | Free |

Restyling is not a protected change. Path changes are never allowed on tiers 1 and 2.

### WS7: Technical SEO and non-page surfaces

**New in v1.1.** v1.0 scoped none of this, which meant the site could redirect its pages while every
machine-readable surface still described hospitality packages at old prices. That alone would have
failed the launch.

1. Root metadata, titles, descriptions, Open Graph, canonicals per template.
2. Structured data: which schema types are approved, whether `ProfessionalService` survives, and
   removal of `priceRange` (D3).
3. Sitemap: currently lists pages that will redirect. Generate from the route manifest, exclude
   redirect sources.
4. `public/llms.txt`, `public/llms-full.txt`, `public/manifest.json`, RSS, JSON Feed, generated
   icons, the Open Graph image, navigation and footer JSON, and the constants in `src/lib/`.
5. A build-time check that no public output contains banned old-position phrases or retired prices.

### WS8: Content and rankings

**Depends on:** WS0 baseline. Runs in parallel with WS5 and WS6.

**8a.** The 14 tier-1 posts. Each gets a page brief: target query cluster, current SERP intent,
change hypothesis, permitted edits, internal links, schema, reviewer, monitoring date. "Fix the
rankings" is not a task.

**8b.** The 16 tier-2 posts. Restyle, `NextStep`, no substantive rewrite.

**8c.** The 72 tier-3 posts. **Capped.** Score ten posts against a rubric (impressions, links,
freshness, uniqueness, seasonal value, business relevance), review the outcome, then decide whether
to continue. This is a separate backlog and must not be allowed to consume the programme.

**8d.** New content for the fifteen target terms, starting with `ai for accountants`,
`marketing for law firms`, `what is a fractional cmo`, `professional services marketing`.

**8e.** The Anchor case study. Exact wording: "41.7% of organic Google Search clicks in the 12
months to 26 August 2026".

---

## 5. Phasing

| Phase | Workstreams | Ships |
|---|---|---|
| **0. Instrument** | WS0 | Nothing visible. Baselines and events on the current site. |
| **1. Clear the ground** | WS1, WS2 | Nothing visible. |
| **2. Build the kit** | WS3, WS4 | Nothing visible. Private harness only. |
| **3. Vertical slice, staging** | WS5 (`/`, `/start-here`), enquiry stack, WS7 partial | Staging only. Proves the full journey including lead capture and measurement. |
| **4. Launch coherence release** | Everything that mentions the old position, in one release | **Public repositioning.** |
| **5. Depth** | Remaining WS5, WS6 | Growth problems, tools, sector hubs, 105 articles restyled. |
| **6. Earn the traffic** | WS8 | Continuous. |

### Phase 4 is atomic, and this is the biggest change from v1.0

v1.0 claimed five new pages would resolve the old-versus-new contradiction. They would not. The
contradiction also lives in root metadata, structured data, `priceRange`, the sitemap, RSS and JSON
feeds, `llms.txt`, the manifest, navigation and footer JSON, global engagement overlays, the contact
form and every pub service page.

**Phase 4 ships every public surface that describes the company, in one release.** Nothing that
mentions the old position may remain live after it. The gate is a checklist generated from the route
manifest plus a build-time scan for banned phrases.

Phase 3 is explicitly a **private staging milestone**, not a launch.

---

## 6. Definition of done

**CI command set**, exact and deterministic:

```
npm run format:check && npm run lint && npm run type-check && npm run test:run && npm run build
```

`npm test` is not used; it runs Vitest in watch mode.

- [ ] All five commands pass. Two known warnings are allowed and named: the
      `GoogleTagManager.tsx` `beforeInteractive` warning and stale Browserslist data. Any new
      warning fails the gate.
- [ ] Redirect tests: every row in the route manifest resolves in one hop with the expected status
- [ ] Canonical and sitemap tests: no redirect source appears in the sitemap
- [ ] No public output contains a banned old-position phrase or an Orange Jelly service price
- [ ] All 30 protected posts return 200 on their original paths with no metadata regression against
      the WS0 snapshot
- [ ] axe passes on one representative page per template
- [ ] Keyboard journeys pass for Header, drawer, Modal, FAQ, SiteSearch, PressureCheck, Scorecard
      and the enquiry form
- [ ] Reflow at 320px and at 400% zoom
- [ ] `/availability` and `/admin` visually unchanged, and the no-third-party-request test passes
- [ ] Lab budgets met on representative templates; field Core Web Vitals tracked at p75 where data
      exists. INP replaces the current FID collection.
- [ ] GA4 enquiry event live, de-duplicated, and reconciling with the first-party store
- [ ] Enquiry submitted end to end against a production-like Supabase and Resend

---

## 7. Risks

| Risk | Response |
|---|---|
| A protected post regresses | WS0 snapshot, change budget by tier, one-hop redirects, weekly monitoring for eight weeks |
| Global styling leaks into the poll product | D17 scoped tokens plus visual regression tests |
| **Bearer tokens leak to third parties** | D19. Non-negotiable, with a new regression test. |
| Lead loss during the form migration | Additive schema deployed before the code that writes it, idempotency key, transactional boundary, rollback plan |
| Mixed-position launch | Phase 4 is atomic with a generated checklist and a banned-phrase scan |
| The 72-post review consumes the programme | Capped at ten, reviewed before continuing |
| Scope creep across 42 components | Port on demand only |

---

## 8. Release and rollback

v1.0 had none, which the review was right to call out. Permanent redirects are cached and database
changes can be one-way.

- Small releasable batches. One workstream never ships as a single release.
- Every release goes to a Vercel preview and is approved there.
- Database migrations are additive first, backfilled second, destructive never without explicit
  approval and a backup.
- Redirects ship behind the route manifest so a revert is a single file.
- Phase 4 has a named rollback: revert the release, redirects included, within one hour.
- Named incident owner for the 48 hours after Phase 4.

---

## 9. Delivery

Owners, estimates and dates are not in this document because they depend on capacity that has not
been agreed. **Before Phase 1 starts, every workstream needs an owner, an estimate range and a
target release.** Without that this is a sequence, not a plan.

The 72-post review (WS8c) is tracked as a separate backlog with its own cap, so it cannot silently
dominate.

---

## 10. Required sub-specifications

Three pieces of work are specified here only at the level of intent. Each needs its own document
before the work it governs can start. This is the honest gate on the programme.

| Sub-spec | Governs | Must define |
|---|---|---|
| **Enquiry and lead data** | `/start-here`, `/contact`, WS5 | Field-level contract (names, types, options, required rules, limits, autocomplete, validation messages, error summary, no-JS fallback). The additive Supabase migration, since the current `contacts` table stores `pub_name` and `package_interest` and cannot hold qualification data. Admin view, notification email, privacy copy, retention, deletion and export. Rate limiting on the existing hashed infrastructure, honeypot, payload limits. Idempotency and partial-failure behaviour. The human follow-up journey: owner, response time, acknowledgement, calendar step, rejection path. |
| **AI readiness scorecard** | `/tools/ai-readiness` | The 12 statements, scoring model, pressure mapping, result bands, recommendation copy, disclaimer, persistence, restart, CTA handover, whether answers are stored, accessibility and no-JS behaviour. A component is not an assessment product. |
| **Analytics event dictionary** | WS0, WS8 | Per event: trigger, required properties, prohibited personal data, consent category, GA4 name, first-party name, de-duplication key, validation test. Plus the consent matrix, including whether Vercel Analytics loads before consent and which events are operational records rather than optional analytics. |

**`/insights` content model** is a fourth, smaller piece: front matter schema, directory, draft and
future-dating behaviour, slug uniqueness against `/licensees-guide/`, pagination, feed and sitemap
membership. The current loaders assume every Markdown post is a licensees' guide.

---

## 11. What is not blocked

Everything in WS0 and WS1 can start now. That is the measurement baseline, the dead-code deletion,
the wrapper collapse, the gate fixes and the route manifest. None of it is visible to a user, none
of it depends on an open decision, and all of it makes the work after it cheaper.
