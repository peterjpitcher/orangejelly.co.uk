# Orange Jelly repositioning: master plan

**Version:** 1.0
**Date:** 27 August 2026
**Owner:** Claude, delivering. Peter approves, supplies experience and signs off publication.
**Status:** Live. This is the task register, updated as work completes.

This is the complete list. Every piece of work across the programme has an ID here. If it is not in
this register it is not scoped, and adding to the register is how scope changes.

The governing detail lives in `IMPLEMENTATION-SPEC.md` and `SUB-SPECS.md`. This document is the
register: what, in what order, how big, and what it needs from Peter.

## How to read the columns

- **Size:** S is part of a working session, M is about one, L is two or three, XL is four or more.
- **Peter:** blank means I do not need anything. Otherwise it names exactly what I need and when.
- **Status:** `done`, `next`, `blocked`, or blank for not started.

---

## Phase 0: Instrument and clear the ground

Nothing user-visible. Makes everything after it cheaper and safer.

| ID | Task | Depends | Size | Peter | Status |
|---|---|---|---|---|---|
| T001 | Delete 29 dead components, `demo/`, `/test-shadcn`, `/about-demo` | | M | | **done** |
| T002 | Collapse the adapter layer behind stable import paths | T001 | M | | **done** |
| T003 | Language gates exclude `docs/brand/`, stale targets removed | T001 | S | | **done** |
| T004 | Send the designer batch (method, About, expletives, authority order) | | S | | **done** |
| T005 | Build `src/lib/route-manifest.js`: every route's disposition, destination, sitemap membership. CommonJS so next.config can require it. | | M | | **done** |
| T006 | Generate `next.config.js` redirects and the sitemap from the manifest; 8 tests assert no chains, no non-200 in sitemap, phase 4 not shipped early | T005 | M | | **done** |
| T007 | 30 protected posts baselined with search metrics and on-page state, enforced by a test that fails if one loses its file, is unpublished or becomes a redirect source | | M | | **done** |
| T008 | Error and failure monitoring: server action failures, lead writes, notification failures, 404 rate, redirect loops | | M | Vercel and Supabase access if not already granted | |
| T009 | Synthetic checks: homepage, protected article, search, enquiry submit | T008 | S | | |
| T010 | GA4 enquiry event live on the current site. Code fires `contact_submit`; GTM container published as Version 4 with a Custom Event trigger and a GA4 Event tag | | M | | **done** |
| T011 | Style isolation guard: `scripts/check-style-isolation.mjs`, computed-style baseline on the protected routes rather than pixel diffs (gap G9) | | S | | **done** |
| T011a | Delete the two mislabelled `public/logo-*.svg` bitmaps, repoint the GK toolkit doc | | S | | **done** |
| T011b | Obtain the 27 Aug design bundle. Needed for page copy in phases 4 and 5, not for tokens or components: the tokens we hold already include the `--cat-*` pairs and the lowercase rule. | | S | Chase the design team | |
| T012 | Component harness at `/dev/components`, dynamic so it 404s in production. Storybook rejected (gap G10) | | S | | **done** |

## Phase 1: Foundations

| ID | Task | Depends | Size | Peter | Status |
|---|---|---|---|---|---|
| T013 | New palette added as an `oj-*` namespace alongside the legacy one, so tool routes are untouched by construction rather than by a selector (D17) | T004 | M | | **done** |
| T014 | Seven `--cat-*` taxonomy pairs added as `cat-*` Tailwind colours. Reconciling with `category-colours.ts` happens when the blog is restyled (T073) | T013 | S | | **done** |
| T015 | Pressure shadow, 1.5px borders, 3px radius, snap easing, orange double focus ring, all verified rendering | T013 | S | | **done** |
| T016 | Lowercase on `.oj-display` only, never an element rule. `.oj-keep-case` for proper nouns | T013 | S | | **done** |
| T017 | Schibsted Grotesk via `next/font/google` now. Not blocked: it is a Google font and the bundle loads it from there. Self-hosting is T017b. | T013 | S | | |
| T017b | Swap to `next/font/local` once the binaries arrive. Performance only, not a blocker. | T017 | S | Font binaries from the design team | |
| T018 | Port `tokens/prose.css` to the Typography config | T013 | M | | |
| T019 | Extend the contrast test to all states: hover, focus, active, disabled, error, inverse, text over highlight bands | T013 | M | | |
| T020 | Run the style isolation guard against the new tokens; baseline already recorded | T011, T013 | S | | |
| T021 | Runtime token-privacy check, verified against production: 7 third-party requests on the homepage, zero on all three token routes. The unit-level gate already existed | T013 | M | | **done** |
| T022 | CSP and security header review for new fonts and analytics (gap G8) | T017 | S | | |
| T023 | Record the design authority order once the designer confirms (gap G1) | T004 | S | | **done** (D28) |

## Phase 2: Component library

Ported on demand. A component is not built until a page needs it.

| ID | Task | Depends | Size | Peter | Status |
|---|---|---|---|---|---|
| T024 | Core: Button, Stat, Tag, Mark | T013 | M | | |
| T025 | Chrome: Header both tones, Footer, Breadcrumb | T024 | L | | |
| T026 | Mobile drawer, grouped nav, built mobile-first | T025 | M | | |
| T027 | Forms: Field, Input, Select, Textarea, Checkbox, Radio, Slider | T024 | L | | |
| T028 | Content: Card, PressureCard, ProofCard, MethodStep, Quote | T024 | M | | |
| T029 | Editorial: ArticleCard, FAQ, Toc, CategoryTag, NextStep, Pagination, ShareRow, Tabs | T024 | L | | |
| T030 | Feedback: Alert, Modal, EmptyState, Skeleton | T024 | M | | |
| T031 | Marketing: OfferCard, CompareTable, LogoStrip, NewsletterBand, SeasonalBand. LogoStrip consumes `public/partners/*.png`, type-only fallback on ink. | T024 | M | | |
| T032 | Diagnostic: PressureMap, PressureCheck, Scorecard | T028 | L | | |
| T033 | StickyCTA and CookieNotice with permanent reopen control | T024 | M | | |
| T034 | Rebuild the search index: new content types, CI build, lazy load, stale and corrupt handling | | L | | |
| T035 | SiteSearch component wired to the rebuilt index | T034, T030 | M | | |
| T036 | Fixed-surface rules: stacking, max combined footprint, safe areas, reduced motion, keyboard-open behaviour | T033 | S | | |
| T037 | axe and keyboard tests across ported components | T024 to T033 | L | | |

## Phase 3: Vertical slice in staging

Proves the whole journey including lead capture and measurement before anything goes public.

| ID | Task | Depends | Size | Peter | Status |
|---|---|---|---|---|---|
| T038 | Additive Supabase migration for the enquiry data. Applied and verified: 8 columns added, `pub_name` and `message` now nullable, nothing dropped, 5 historic leads intact | | M | | **done** |
| T039 | Shared Zod enquiry schema in `src/lib/schemas/enquiry.ts` | T038 | S | | |
| T040 | `submitEnquiryStep1` and `Step2` server actions, correct failure ordering | T039 | M | | |
| T041 | Two new rate limit buckets, honeypot, payload cap, fail closed | T040 | S | | |
| T042 | Enquiry form UI, two steps, no-JS fallback, error summary | T027, T040 | L | | |
| T043 | Admin view, notification email, lead states | T040 | M | | |
| T044 | Update `/privacy` for the new data, purpose, retention, deletion | T038 | M | Approve the wording | |
| T045 | Write `/start-here` copy including the fit language (gap G3) | T042 | M | React to my draft | |
| T046 | Build `/start-here` | T045, T042 | M | | |
| T047 | Write homepage copy (gap G2) | T023 | M | React to my draft | |
| T048 | Build `/` | T047, T025, T028 | L | | |
| T049 | Analytics events wired per the dictionary, consent split per D24 and D27 | T010, T046 | L | | |
| T050 | End-to-end test of the slice on a production-like Supabase and Resend | T046, T048, T049 | M | | |

## Phase 4: Launch coherence release

**Atomic.** Every public surface that describes the company ships together. Nothing that mentions the
old position remains live afterwards.

| ID | Task | Depends | Size | Peter | Status |
|---|---|---|---|---|---|
| T051 | Write `/how-we-work` copy, HEAR CHALLENGE BUILD OPTIMISE, measurement inside OPTIMISE | T023 | M | React to my draft | |
| T052 | Build `/how-we-work` | T051, T028 | M | | |
| T053 | Write `/about` copy, company voice, no founder story (D21) | | M | **Your material needed.** See "What I need from you". | |
| T054 | Build `/about` | T053 | M | | |
| T055 | Write `/results` copy, lead with the Anchor demand-discovery story | | M | Confirm the framing | |
| T056 | Build `/results` and `/results/[slug]` | T055, T028 | L | | |
| T057 | Select and write the first case studies (gap G7) | T055 | L | **Your material needed.** | |
| T058 | Root metadata, titles, descriptions, Open Graph, canonicals per template | T005 | M | | |
| T059 | Structured data: approved types, remove `priceRange`, drop old org copy | T058 | M | | |
| T060 | Sitemap generated from the manifest, redirect sources excluded | T005 | S | | |
| T061 | `llms.txt`, `llms-full.txt`, `manifest.json`, RSS, JSON Feed, icons, OG image, navigation and footer JSON, `src/lib/constants.ts` | T058 | L | | |
| T062 | Build-time scan: no banned old-position phrase, no service price, in any public output | T061 | M | | |
| T063 | Consolidate the pub landing pages into `sector-landing`, apply the redirect table | T006, T031 | L | | |
| T064 | Launch checklist generated from the manifest, plus rollback plan and named incident owner | T062 | S | Be reachable for 48 hours after | |
| T065 | **Ship phase 4** | all above | M | Approve the release | |

## Phase 5: Depth

| ID | Task | Depends | Size | Peter | Status |
|---|---|---|---|---|---|
| T066 | Write the eight growth-problem pages, lifting the designer's copy where it holds | T023 | L | | |
| T067 | Build `/growth-problems` and its eight children | T066, T032 | L | | |
| T068 | Write and build `/solutions` | T066 | M | | |
| T069 | Write the twelve scorecard result texts, including where AI does not help | T032 | M | Feedback once built | |
| T070 | Build `/tools/ai-readiness` | T069, T032 | L | | |
| T071 | Write and build `/fractional-cmo`, using the language to be found then arguing against the format | | M | | |
| T072 | Restyle `/licensees-guide` as the hospitality sector hub | T031 | M | | |
| T073 | Restyle all 105 live articles with `blog-article`, add ShareRow | T029, T072 | L | | |
| T074 | Build the NextStep mapping for 105 posts, validate destinations at build (gap G6) | T073 | L | Approve the 30 protected mappings | |
| T075 | `/insights` collection: directory, front matter schema, slug collision check, feeds, pagination | T029 | L | | |
| T076 | Error handling via `not-found.tsx`, `error.tsx`, `global-error.tsx` | T030 | M | | |
| T077 | `/sectors/professional-services` hub | T072 | M | | |
| T078 | Restyle `/contact` as reduced start-here | T046 | S | | |

## Phase 6: Earn the traffic

Continuous. Starts during phase 3 and does not stop.

| ID | Task | Depends | Size | Peter | Status |
|---|---|---|---|---|---|
| T079 | Write 14 page briefs for the tier-one posts (gap G4) | T007 | L | | |
| T080 | Execute the 14 tier-one ranking fixes, snapshot before and after | T079, T073 | XL | Approve changes to protected posts | |
| T081 | Tier-two: restyle and NextStep only, 16 posts | T073, T074 | M | | |
| T082 | Write the 72-post scoring rubric (gap G5) | | S | | |
| T083 | Score the first ten tier-three posts, review, then decide whether to continue | T082 | M | Approve keep, merge or retire | |
| T084 | Article: `ai for accountants` | T075 | M | **Your material needed.** | |
| T085 | Article: `marketing for law firms` | T075 | M | **Your material needed.** | |
| T086 | Article: `what is a fractional cmo` | T075 | M | | |
| T087 | Article: `professional services marketing` | T075 | M | **Your material needed.** | |
| T088 | Articles 5 to 15 against the remaining target terms | T084 to T087 | XL | Ongoing input | |
| T089 | Weekly monitoring of the 30 protected posts for eight weeks after T073 | T073 | M | | |
| T090 | Trades second wave: keyword round 4, then pages (gap G11) | T077 | L | Decide when | |

## Cross-cutting, not phase-bound

| ID | Task | Size | Peter | Status |
|---|---|---|---|---|
| T091 | Keep `decisions.md`, `COVERAGE.md` and this register current as work lands | S | | ongoing |
| T092 | Test matrix: component, integration, redirect and canonical assertions, visual, axe, keyboard, cross-browser, no-JS, responsive | L | | |
| T093 | Indexation decision for the `cheersai`, `mixerai` and `management` subdomains | S | Decide | |
| T094 | 30-day review of enquiry quality against the fit filter | S | Together | |

---

## Sequencing and rough duration

Sizes total roughly 95 to 120 working sessions. At three or four sessions a week that is **six to
nine months** to complete everything, with the public repositioning landing much earlier.

| Phase | Sessions | Lands |
|---|---|---|
| 0. Instrument and clear | 8 to 10 | 3 of 12 tasks already done |
| 1. Foundations | 10 to 12 | |
| 2. Components | 20 to 25 | |
| 3. Vertical slice | 15 to 18 | Staging only |
| 4. **Launch coherence release** | 18 to 22 | **The public repositioning** |
| 5. Depth | 20 to 25 | |
| 6. Traffic | continuous | |

**Phase 4 is the milestone that matters.** Everything before it is invisible. On this shape it is
roughly 70 to 85 sessions in, so the realistic read is **four to six months to public launch** if we
work steadily, sooner if phases 2 and 5 get trimmed.

**The honest risk to that estimate:** phase 2 and phase 6 are the two that expand. Components can
gold-plate, and content has no natural end. Both are capped in the spec, and both need watching.

---

## What I need from you

Four things, and only four. Everything else I own.

### 1. Approvals at named points

The migration before it runs (T038), the privacy wording (T044), changes to protected posts (T080),
the protected-post NextStep mappings (T074), the phase 4 release (T065), and keep or retire calls on
the tier-three posts (T083).

### 2. Access

GA4 and GTM (T010), and Vercel and Supabase monitoring if I do not already have it (T008).

### 3. Your material for content, which I cannot invent

I can write structure, argument, research and every word of the general content. I cannot invent
what happened to you or what you did. For these I need you talking, not writing. A voice note or a
scrappy call is fine and better than a document.

| For | What I need |
|---|---|
| `/about` (T053) | Why Orange Jelly exists in your words. What you refuse to do and why. What you have learned running The Anchor that changed how you think about other people's businesses. Twenty minutes of you talking is plenty. |
| Case studies (T057) | For each: what the business was, what was actually wrong, what you did, what changed, and what makes it transferable. Including any non-hospitality work, however small, because we badly need one. |
| `ai for accountants` (T084) | Any real exposure to accountancy practices, and where you have genuinely seen AI help or fail in a service business. |
| `marketing for law firms` (T085) | The same for legal, or an honest "none", in which case I write it from research and we mark it as research-led. |
| `professional services marketing` (T087) | Your view on why professional services firms market badly. You will have one. |

**If you have no experience in a sector, say so.** I will write from research and we will not imply
otherwise. The pack's own rule is that no claim goes out without evidence behind it, and that
applies to implied experience too.

### 4. Reactions, not drafts

For homepage, `/start-here`, `/how-we-work` and `/results` copy I will write a draft and you tell me
what is wrong with it. Reacting is faster than writing and you are better at it.

---

## What is deliberately not in this plan

- Paid search. Bid data was used as an intent signal only.
- `/availability` and `/admin` beyond protecting them from the restyle.
- Rebranding the product subdomains.
- Any offer, price or package. D3 stands.
