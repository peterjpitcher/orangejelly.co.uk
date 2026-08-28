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
| T017 | Schibsted Grotesk via `next/font/google`, added alongside the existing pair so nothing changes until a component asks for `--font-oj` | T013 | S | | **done** |
| T017b | Swap to `next/font/local` once the binaries arrive. Performance only, not a blocker. | T017 | S | Font binaries from the design team | |
| T018 | `.oj-prose` ported from the design bundle onto the `--oj-*` namespace. Not yet wired into blog templates: that is WS6, after the protected posts have been through their change budget | T013 | M | | **done** |
| T019 | Contrast matrix extended across the new palette. **Found 3 real accessibility defects in the supplied colours**, raised with the designer, tracked as expected-to-fail | T013 | M | | **done** |
| T020 | Style isolation guard run against the new tokens and passing three consecutive runs; leak detection proved by deliberate failure | T011, T013 | S | | **done** |
| T021 | Runtime token-privacy check, verified against production: 7 third-party requests on the homepage, zero on all three token routes. The unit-level gate already existed | T013 | M | | **done** |
| T022 | CSP reviewed: **no change needed**. `next/font` self-hosts the typeface from `/_next/static/media`, so it is served from `'self'`. Verified 15 woff2 files in the build and no off-origin font reference in the compiled CSS | T017 | S | | **done** |
| T023 | Record the design authority order once the designer confirms (gap G1) | T004 | S | | **done** (D28) |

## Phase 2: Component library

Ported on demand. A component is not built until a page needs it.

| ID | Task | Depends | Size | Peter | Status |
|---|---|---|---|---|---|
| T024 | Core: Button, Stat, Tag, Mark, ported to `src/components/oj/` alongside the existing set. 13 behaviour tests, verified rendering | T013 | M | | **done** |
| T025 | Chrome: Header in both tones, Footer, Breadcrumb. 13 behaviour tests, verified rendering | T024 | L | | **done** |
| T026 | Mobile drawer with grouped sub-nav, folded into Header by the designer. Adds Escape, focus management and scroll lock, none of which the reference had | T025 | M | | **done** |
| T027 | Forms: Field, Input, Select, Textarea, Checkbox, Radio. Field wires label, describedby and invalid automatically. Slider deferred: nothing in the enquiry sub-spec needs one | T024 | L | | **done** |
| T028 | Content: Card, PressureCard, ProofCard, MethodStep, Quote. PressureCard is now a real link rather than a card with an onClick and a bare arrow inside | T024 | M | | **done** |
| T029 | Editorial: ArticleCard, FAQ, Toc, CategoryTag, NextStep, Pagination, Tabs. FAQ uses real `<details>` so it works without JavaScript. ShareRow needs client clipboard, done with T033 | T024 | L | | **done** |
| T030 | Feedback: Alert, Modal, EmptyState, Skeleton. Modal gains a real focus trap, which the reference lacked | T024 | M | | **done** |
| T031 | Marketing: OfferCard (price-free by construction, no price prop exists), CompareTable, LogoStrip, NewsletterBand, SeasonalBand | T024 | M | | **done** |
| T032 | Diagnostic: PressureMap, PressureCheck, Scorecard. Pressure stated in words as well as colour. No total is ever calculated or shown | T028 | L | | **done** |
| T033 | StickyCTA, CookieNotice with equal-weight accept and decline, and ShareRow | T024 | M | | **done** |
| T034 | Search index rebuilt: collection-tagged, urls derived not hard-coded, 936KB down to 196KB, and now built as part of `npm run build` rather than a step someone has to remember | | L | | **done** |
| T035 | SiteSearch: input, announced result counts, and a no-results state that routes to the growth-problems hub. Index loading stays the caller's job so it can be lazy | T034, T030 | M | | **done** |
| T036 | Fixed-surface stacking documented in `layers.ts` and enforced by tests that read the z-index out of each component rather than trusting the constant. Safe areas and reduced motion in place | T033 | S | | **done** |
| T037 | axe sweep across all 38 component cases against wcag2a, wcag2aa and wcag21aa: zero violations. Keyboard behaviour covered per component, since axe cannot see focus order or announcement | T024 to T033 | L | | **done** |

## Phase 3: Vertical slice in staging

Proves the whole journey including lead capture and measurement before anything goes public.

| ID | Task | Depends | Size | Peter | Status |
|---|---|---|---|---|---|
| T038 | Additive Supabase migration for the enquiry data. Applied and verified: 8 columns added, `pub_name` and `message` now nullable, nothing dropped, 5 historic leads intact | | M | | **done** |
| T039 | One Zod schema shared by client, server actions and the storage mapper, replacing a form schema and a hand-written chain of server ifs that could drift | T038 | S | | **done** |
| T040 | Both server actions. The row is the authoritative success condition and nothing after it can turn a stored enquiry into a user-facing error | T039 | M | | **done** |
| T041 | `enquiry_ip` and `enquiry_email` buckets, honeypot, and fail-closed limiting because this action sends mail | T040 | S | | **done** |
| T042 | Two-step enquiry form: one native form, one server action, error summary, and it works with JavaScript off | T027, T040 | L | | **done** |
| T043 | Admin enquiry view, the six lead states enforced by a database constraint, and a notification email that links to the answers rather than carrying them | T040 | M | | **done** |
| T044 | `/privacy` rewritten for the new data, the 24-month retention, and the consent line drawn at device storage | T038 | M | Approve the wording | **done, wording awaiting your approval** |
| T045 | `/start-here` copy including the fit language, in `tasks/repositioning/copy/start-here.md` | T042 | M | React to my draft | **done, awaiting your reaction** |
| T046 | Build `/start-here`, with its own `oj` chrome and the legacy package overlays suppressed | T045, T042 | M | | **done** |
| T047 | Homepage copy, in `tasks/repositioning/copy/homepage.md` | T023 | M | React to my draft | **done, awaiting your reaction** |
| T048 | Build `/`, replacing the packages homepage | T047, T025, T028 | L | | **done** |
| T049 | Client event dictionary, per-event property allowlist, session id, and the consent split drawn by device storage rather than by whether the data is personal | T010, T046 | L | | **done, wiring the remaining call sites lands with their pages** |
| T050 | Schema conformance between the writer and production, as a test. The live submission stays a human step on the launch checklist, because it creates a real lead and sends real mail | T046, T048, T049 | M | | **done, automatable half** |

## Phase 4: Launch coherence release

**Atomic.** Every public surface that describes the company ships together. Nothing that mentions the
old position remains live afterwards.

| ID | Task | Depends | Size | Peter | Status |
|---|---|---|---|---|---|
| T051 | `/how-we-work` copy, in `tasks/repositioning/copy/how-we-work.md` | T023 | M | React to my draft | **done, awaiting your reaction** |
| T052 | Build `/how-we-work` | T051, T028 | M | | **done** |
| T053 | `/about` copy, in `tasks/repositioning/copy/about.md`, written only from facts already in the repo | | M | **Twenty minutes of you talking would make it specific.** | **done, and it stands up as written** |
| T054 | Build `/about` | T053 | M | | **done** |
| T055 | `/results` copy, in `tasks/repositioning/copy/results.md`, leading with the demand-discovery story | | M | Confirm the framing | **done, framing awaiting your confirmation** |
| T056 | Build `/results` and `/results/[slug]` | T055, T028 | L | | **done** |
| T057 | The first three case studies, all at The Anchor, told through the four method steps | T055 | L | **Your material needed for any client case study.** | **done for the Anchor three; client work still needs your material and their permission** |
| T058 | Root metadata and the default share card, rewritten off the sector | T005 | M | | **done** |
| T059 | Organisation and website schema: `priceRange` removed, sector description replaced, founder reduced to a `founder` property | T058 | M | | **done** |
| T060 | Sitemap generated from the manifest, redirect sources excluded, case studies emitted from the data | T005 | S | | **done** |
| T061 | `llms.txt`, `llms-full.txt` and the manifest generated rather than written; feeds, OG image and the company tagline rewritten | T058 | L | | **done except the legacy navigation and footer JSON, which phase 4 replaces with T063** |
| T062 | `check:positioning`, wired into build and lint, with phase 4 exemptions named and countable | T061 | M | | **done for every surface phase 4 has reached; scope widens with T063** |
| T063 | `/pub-marketing` and `/pub-rescue` rebuilt as the two surviving hospitality pages; the redirect table verified against the phase 4 release | T006, T031 | L | | **done, except the one-line phase flip and the deletion of the superseded pages, which are the release itself (T065)** |
| T064 | `tasks/repositioning/LAUNCH-CHECKLIST.md`, generated by `npm run launch:checklist`, with the rollback and the owner | T062 | S | Be reachable for 48 hours after | **done** |
| T065 | **Ship phase 4** | all above | M | Approve the release | |

## Phase 5: Depth

| ID | Task | Depends | Size | Peter | Status |
|---|---|---|---|---|---|
| T066 | The eight growth-problem pages, transformed from the designer's template with eight unsupported numbers removed | T023 | L | | **done** |
| T067 | Build `/growth-problems` and its eight children | T066, T032 | L | | **done** |
| T068 | Write and build `/solutions` | T066 | M | | **done, brought forward: the phase 4 table redirects `/capabilities` here so the release could not ship without it** |
| T069 | The twelve result texts, six areas in two states, each naming where AI does **not** help | T032 | M | Feedback once built | **done, ready for your feedback** |
| T070 | Build `/tools/ai-readiness`, with a server-rendered fallback for no JavaScript | T069, T032 | L | | **done** |
| T071 | `/fractional-cmo`: uses the category language to be found, then argues against the format and says when to hire one anyway | | M | | **done** |
| T072 | `/licensees-guide` framed as the hospitality sector hub, additively so the schema and hero are untouched | T031 | M | | **done** |
| T073 | `ShareRow` and `NextStep` added to all 105 articles, additively. Full visual restyle held: it changes the rendering of the 30 posts carrying 95% of blog clicks and belongs with T080 | T029, T072 | L | | **partly done, visual restyle held for T080** |
| T074 | All 105 mapped, in `tasks/repositioning/data/article-next-steps.json`, validated by test | T073 | L | Approve the 30 protected mappings | **done, the 30 await your approval** |
| T075 | `/insights` collection: `collection` discriminant, Zod front matter with required `problemPage` and `targetTerm`, slug collision gate, pagination, sitemap | T029 | L | | **done, one article in it** |
| T076 | `not-found.tsx` rebuilt, and `error.tsx` and `global-error.tsx` added, neither of which existed | T030 | M | | **done** |
| T077 | `/sectors/professional-services`: the six areas translated into firm language, and an explicit list of what we do not have | T072 | M | | **done** |
| T078 | `/contact` rebuilt as a reduced `/start-here` | T046 | S | | **done** |

## Phase 6: Earn the traffic

Continuous. Starts during phase 3 and does not stop.

| ID | Task | Depends | Size | Peter | Status |
|---|---|---|---|---|---|
| T079 | 14 briefs in `tasks/repositioning/TIER-ONE-BRIEFS.md`, each diagnosing position or CTR and testing exactly one change | T007 | L | | **done** |
| T080 | Execute the 14 tier-one ranking fixes, snapshot before and after | T079, T073 | XL | Approve changes to protected posts | |
| T081 | Tier-two: NextStep and ShareRow, 16 posts | T073, T074 | M | | **done, covered by T073 and T074 which applied to all 105** |
| T082 | `tasks/repositioning/TIER-THREE-RUBRIC.md`: eight weighted criteria, a decision tree, automatic keeps and merge mechanics | | S | | **done** |
| T083 | Score the first ten tier-three posts, review, then decide whether to continue | T082 | M | Approve keep, merge or retire | |
| T084 | Article: `ai for accountants`, research-led and flagged as such. It also gives `/growth-problems/using-ai-intelligently` its first way in from search | T075 | M | **Sharpen with your real exposure when you have it.** | **done, research-led** |
| T085 | Article: `marketing for law firms`, research-led and flagged as such | T075 | M | **Sharpen if you have legal exposure; the plan says an honest none is fine.** | **done, research-led** |
| T086 | Article: `what is a fractional cmo`, written from research and flagged as such on the page | T075 | M | | **done** |
| T087 | Article: `professional services marketing`, research-led and flagged as such | T075 | M | **Your view on why they market badly would sharpen it.** | **done, research-led** |
| T088 | Articles 5 to 15 against the remaining target terms | T084 to T087 | XL | Ongoing input | |
| T089 | `npm run monitor:posts -- <GSC Pages.csv>` diffs all 30 against the committed baseline and flags real movement | T073 | M | Export from Search Console weekly for eight weeks | **script done, the weekly export is yours** |
| T090 | Trades second wave: keyword round 4, then pages (gap G11) | T077 | L | Decide when | |

## Cross-cutting, not phase-bound

| ID | Task | Size | Peter | Status |
|---|---|---|---|---|
| T091 | Keep `decisions.md`, `COVERAGE.md` and this register current as work lands | S | | ongoing |
| T092 | Component, integration, redirect and canonical, axe, keyboard and no-JS all covered by the suite. Visual, cross-browser and automated responsive still need a browser runner: Playwright is a dependency with no config, and responsive is currently verified by hand at 320, 375 and 1280 | L | | **partly done, browser matrix outstanding** |
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
