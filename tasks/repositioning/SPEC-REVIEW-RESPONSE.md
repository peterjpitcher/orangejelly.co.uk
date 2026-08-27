# Response to the developer review of spec v1.0

**Review:** `IMPLEMENTATION-SPEC-REVIEW.md`, 27 August 2026, 54 findings, readiness red
**Response:** 27 August 2026, spec v1.1 issued

The review was right about most things and it caught two problems that would have failed the launch:
the incoherent Phase 3 and the unscoped machine-readable surfaces. Both are fixed.

**Disposition: 49 accepted, 1 rejected on evidence, 4 accepted with a changed remedy.**

---

## The one finding that is wrong

**F03: "the quantitative evidence is not reproducible from the repository."**

The Search Console exports are committed. `git ls-files tasks/repositioning/data` returns 14 tracked
files across `gsc-orangejelly-2026-08-26/` and `gsc-the-anchor-2026-08-26/`. The review was
presumably run against a tree that predated the commit.

The underlying point still had value, so v1.1 goes further than the finding asked: the protected-post
set is now generated into `data/protected-posts-register.csv` by a script, and section 0 of the spec
states that no count may appear unless it can be regenerated from a committed file.

## Findings where the remedy changed

| Finding | Review's remedy | What v1.1 does instead | Why |
|---|---|---|---|
| F01 | Downgrade status to "not ready, foundation only" | Status is "foundation and vertical slice approved, full migration gated on three sub-specs", and the four open copy decisions get named blocking points | The open decisions block *copy on named pages*, not the build. Halting WS0 and WS1 over the swearing boundary would be theatre. |
| F09 | Replace the component count metric | Component count kept as context, gates moved to the CI command set plus duplicate-implementation and unused-export reports | Agreed the count is a bad gate. It is still a useful signal. |
| F23 | Put the Anchor story through the proof register | Exact wording pinned instead: "41.7% of organic Google Search clicks in the 12 months to 26 August 2026" | D2 closed on 27 Aug. Peter validated the metrics personally. The semantic precision point was fair and is adopted. |
| F31 | Add an AST mechanism for preserved spans | Lowercase scoped to marketing display headings; article body headings stay sentence case | Simpler, and it removes the problem rather than building machinery to survive it. Test case is `pub-vat-accounting-guide`. |

## Corrections made to the numbers

Every one of these was a genuine error in v1.0.

| Was | Now | Source |
|---|---|---|
| 44 components | **42** | 42 `.jsx.txt`, 42 matching `.d.ts.txt`, no orphans. The designer's handback says 44 and is wrong. |
| 106 articles restyled | **105 live, 1 redirected** | 106 files, 105 pages built. `cash-flow-crisis-breaking-cycle` redirects. |
| 29 protected posts | **30** (14 tier 1, 16 tier 2) | 29 posts reach exactly 95.0%, 30 reach 95.4% |
| 13 posts carry 80% | **14** | 13 carry 79.4% |
| 83 review posts, 62 zero-click | **72 review posts, 52 zero-click** | v1.0 counted `/category/` pages as posts |
| 14 redirect rules | **15 rules, 22 resolved paths** | One rule templates over 8 counties |
| 301 redirects | **308** | `permanent: true` emits 308 in Next.js 14. Accepted, and tests now assert the right status. |

## P0 findings and where they landed

| # | Finding | Resolution in v1.1 |
|---|---|---|
| F05 | Dependency graph impossible | **WS0** created. Measurement and baseline run before anything touches a page. WS8 no longer depends on WS6. |
| F06 | Phase 3 not a coherent repositioning | Phase 3 becomes a **private staging milestone**. New **Phase 4 launch coherence release** ships every public surface that describes the company, atomically, gated by a generated checklist and a banned-phrase scan. |
| F10 | Protected set inconsistent | `data/protected-posts-register.csv` generated from the export. 30 posts, tiered, with rank, clicks, impressions, position and cumulative share. |
| F11 | 106 posts contradicts a redirected post | Stated as 105 live plus 1 redirected throughout. |
| F16 | Redirect inventory wrong and stale | Counts corrected, 308 accepted, `:slug` syntax fixed, and the table is now generated from `src/lib/route-manifest.ts` rather than hand-written. |
| F30 | `/availability` unprotected from global styling | **D17.** Marketing tokens scoped to a marketing surface, never bare `:root`. Visual regression tests on both excluded areas. |
| F39 | Enquiry form not implementable | Named sub-specification. Blocks `/start-here`. |
| F40 | Form needs an unscoped data migration | Same sub-specification. Additive schema deployed before the code that writes it. |
| F48 | Bearer-token security boundary can regress | **D19.** Verified: `MarketingChrome.tsx` fails closed on `/availability` because organiser URLs carry a token in the path. No test currently guards it. One is now required. |

## P1 and P2 findings

All accepted. Where they landed:

**Route and content architecture.** F12 case-study detail route added as `/results/[slug]`. F13
error handling moved to `not-found.tsx` / `error.tsx` / `global-error.tsx`. F14 the eight
growth-problem slugs are named. F15 every public route now has exactly one stated disposition. F19
`/insights` content model is a named sub-spec. F11 and F21 resolved together by replacing
"untouchable" with a per-tier change budget.

**Technical SEO.** F17 and F18 become **WS7**, a workstream that did not exist in v1.0. Canonicals,
structured data, `priceRange` removal, sitemap generation from the manifest, plus `llms.txt`,
`llms-full.txt`, `manifest.json`, RSS, JSON Feed, icons, the OG image and navigation JSON.

**Components and design.** F02 count corrected and the v1 bundle marked obsolete. F29 wrapper
collapse gains an explicit API migration order. F32 design authority order **not yet recorded**, tracked as G1 in `COVERAGE.md`. This document originally claimed it was done. It was not. F33 component
done-ness now includes `.prompt.md` behaviour, states, axe and keyboard. O03 adopted: port on demand.

**Accessibility and performance.** F34 per-template checklist, axe, keyboard, zoom and reflow.
F35 fixed-surface stacking, reduced motion, safe areas, 320px and short landscape. F36 lab budgets
plus field p75, and INP replaces the current FID collection. F37 `next/font` instead of the bundle's
runtime `@import`, route budgets, lazy-loaded search. F38 contrast matrix extended to all states.

**Data, security and analytics.** F41 to F47 fold into the enquiry and analytics sub-specs. F49 CSP
and header regression testing added. F20 site search index rebuilt rather than reused.

**Testing and operations.** F52 test matrix, F53 monitoring and alerting, F07 release and rollback,
all now sections 6, 7 and 8. F54 accepted: Search Console is a post-launch monitor, not a workstream
gate.

**Deferred with reason.** F04 delivery model and F09's estimates need capacity that has not been
agreed. Section 9 states that every workstream needs an owner, estimate and target release before
Phase 1 starts, which is the honest position rather than inventing numbers.

## Decisions this triggered

| | |
|---|---|
| **D2 closed** | Peter has personally validated the five performance metrics. Approved for publication. This unblocks the Results page, the About page and every case study. |
| **D17** | Marketing tokens are scoped, not global. `/availability` and `/admin` keep current styling. |
| **D18** | `/about-demo` and `/test-shadcn` deleted in WS1. |
| **D19** | The bearer-token security boundary is non-negotiable and gains a regression test. |

## What is still genuinely gated

Three sub-specifications, listed in section 10 of the spec: enquiry and lead data, the AI readiness
scorecard, and the analytics event dictionary. Plus the smaller `/insights` content model.

Nothing gates WS0 or WS1. Baseline capture, dead-code deletion, the wrapper collapse, the gate fixes
and the route manifest can all start now.
