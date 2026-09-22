# BII Summer Hub 2026 — task plan

**Goal:** A summer hub for the BII ("British Institute of Innkeeping") magazine feature *"Five ways to turn summer footfall into summer revenue"*, reachable via a printed QR code. Reuse the existing seasonal-hub structure; do NOT duplicate existing guides — link each idea to its (renovated) existing guide.

**Decisions (approved by Peter):**
- Strategy: Hub → existing guides, each guide renovated to fit its idea (no new spoke pages → no SEO cannibalisation).
- Short link: `/summer` → summer hub, mirroring `/autumn` & `/christmas`, with BII tracking.
- Hub slug: `/licensees-guide/summer-pub-marketing`. publishedDate 2026-06-01 (live now; magazine lands ~24 Jul).

**Idea → existing guide map:**
1. Create bookable reasons to visit → `summer-pub-event-ideas`
2. Make every post lead somewhere → `social-media-strategy-for-pubs`
3. Keep your Google listing fresh → `google-business-profile-pub-guide`
4. Capture customer details while trade is high → `email-marketing-pub-retention`
5. Follow up and bring people back → `build-loyalty-scheme-fill-pub`

**Guardrails:** Only approved %-based claims (/CLAIMS.md). British English only (the british-english check blocks US spellings). Avoid the cost-reduction word family the growth-language hook rejects — use growth/margin language instead. Match the existing hub markdown conventions.

## Core deliverable (commit 1)
- [ ] Register summer hub in `src/lib/seasonal-hubs.ts` (calendar: [], 5 featuredGuides)
- [ ] Finalise summer theme tokens comment in `src/app/globals.css`
- [ ] Create hub landing `content/blog/summer-pub-marketing.md` (the 5 ways, OJ voice, links to each guide)
- [ ] Hero SVG `public/images/blog/summer-pub-marketing.svg` + loyalty card SVG + map in `src/lib/blog-images.ts`
- [ ] Add `/summer` redirect in `next.config.js` (BII UTM)

## QR deliverable (commit 1)
- [ ] Generate print-ready QR (SVG + hi-res PNG) for https://www.orangejelly.co.uk/summer → `marketing/bii-summer-2026/`

## Renovations (commit 2 — surgical, additive)
- [ ] `social-media-strategy-for-pubs` — add "Give every post a job" CTA section (key fit for idea 2)
- [ ] `google-business-profile-pub-guide` — add "Keep it fresh for summer" subsection
- [ ] `email-marketing-pub-retention` — add summer data-capture angle
- [ ] `build-loyalty-scheme-fill-pub` — add summer follow-up sequence
- [ ] `summer-pub-event-ideas` — add hub interlink + bookable framing
- [ ] Each guide links back to the summer hub

## Verify (before handing over)
- [ ] `npm run type-check`
- [ ] `npm run lint` (runs growth-language + british-english checks)
- [ ] `npm test`
- [ ] `npm run build`
- [ ] Incremental commits on `feat/bii-summer-hub-2026` (do NOT push without asking)

## Notes / results
- (filled in as work progresses)


## Guide-to-enquiry conversion specification, 5 September 2026

- [x] Review existing guide, enquiry, attribution and tracking code.
- [x] Write the complete specification in `tasks/plan-2026-09-05-lead-conversion.md`.
- [x] Check coverage of all five recommendations and identify release evidence.
- [x] Implement the five recommendations, with the three-guide pilot enabled and broader rollout gated.
- [x] Run production-build, browser, fixture submission and read-only aggregate checks.
- [ ] Verify the deployed release and obtain explicit permission for a real test message.

Status: implementation complete with pilot enabled; release verification pending. No production test messages or writes, no migration drafted or applied.


## GSC indexing repairs, 5 September 2026

Spec: `tasks/gsc-indexing/SPEC.md` revision 2. Plan: `tasks/gsc-indexing/PLAN.md`.
Branch `fix/gsc-indexing-repairs`, cut from `origin/main` (3d801e3f, the deployed commit).

- [x] Triage all 81 not-indexed URLs from the Search Console drill-downs, row by row.
- [x] Verify the independent developer review's corrections against the code and production.
- [x] Correct the specification: totals, image absolutes, causal language, the redirect claim,
      the `/dev/components` diagnosis, token privacy, the Validate fix reasoning, monitoring.
- [x] Write the implementation plan with one owner per file.
- [x] WS1 Unblock `/_next/`, `/icon`, `/apple-icon` and `/opengraph-image` in robots.txt,
      with an effective-matching regression test and a red-before-green proof.
- [x] WS2 Link the two orphaned pages from the two insight bodies and the footer, with an
      offline orphan and reachability gate and a mutation proof.
- [x] WS3 Return real 404s for `/dev/components`, `/results/[slug]` and
      `/growth-problems/[slug]`, correct the two false comments, and add the missing
      guide-category redirect test.
- [x] WS4 Extend the synthetic check to prove the live rules, then run the full gate.
- [x] Push the branch and open a PR (#56), then merge on Peter's explicit yes.
- [ ] Peter: change the apex domain redirect from temporary to permanent in Vercel.

Status: LIVE. Merged as 3b7acf8b and deployed as dpl_6TBXmoBFfBAERW8bPdBQSrxghZRy on
5 September 2026. Verified against production: robots.txt now carries only the four intended
rules; all 10 /_next/image URLs on a guide, including all 6 hero variants, return 200 to
Googlebot; /icon.png, /apple-icon.png, /opengraph-image and /manifest.webmanifest all 200;
/dev/components, /dev, /results/<unknown> and /growth-problems/<unknown> all return a real
404 with the not-found page in the served HTML; /api/admin/enquiries still 401s; /admin keeps
its noindex; /guides/README still 410s and the legacy redirects still resolve to a 200.
check:synthetic 16 of 17, with llms.txt the only red and failing since before this release.
check:token-privacy passed across 3 token routes with its control detecting 9 third-party
requests. No migration.

An adversarial review raised 27 findings across five lenses; 19 were refuted on independent
verification and 6 were fixed in 8e76e338, the most serious being that the robots matcher
kept only the first record naming a crawler, so a file with two "User-agent: *" records would
have read as permissive while Googlebot was blocked from every stylesheet.

Outstanding: the apex still serves 307, which only Peter can change in the Vercel dashboard.
Two decisions remain open with recommended defaults in SPEC section 7 (dynamicParams on
/insights/[slug] and on /guides/category/[category]). Follow-up crawl and index checks at 7,
14 and 28 days are not scheduled.


## Back office onto the public page styling, 22 September 2026

**Ask:** bring /admin and every back-office page into line with the current public pages.
Branch `feat/back-office-styling`, worktree `.claude/worktrees/back-office-styling`.

**Gap found (screenshots, fixture data, no live calls):** the signed-in bar is still the old navy
bar with the OJ roundel; the enquiries list and the enquiry measurement panel are on the old
white-card palette (`brand-base`, `surface`, `bg-white`); twelve poll components still use it;
page titles are plain sentence case on paper where the public pages open on an ink hero with a
lowercase display heading and alternate paper and cream bands.

**Decisions**
- Header: the public `Header` itself (cream bar, 44px horizontal logo, orange current marker,
  ink mobile drawer). Sign out is a ghost button, not the orange primary. Still hidden for guests.
- Page intro: an ink hero, as on the eighteen public reading pages. Poll titles are somebody's
  own words, so they keep their case and get no added full stop.
- Sections: `Band`, alternating paper and cream with the ink rule. Cards flip to the opposite
  surface so they stay visible.
- No marketing footer on tool screens. No copy, field names, fetch bodies or behaviour change.

**Complexity:** 4 (L, 25 files, no schema). Split into three commits that each deploy alone:
- [x] 1. Shared header + hero, /admin (sign-in, dashboard, enquiries, enquiry measurement, surveys)
- [x] 2. Organiser poll screens (/availability, /availability/new, results, verify, their components)
- [x] 3. Guest poll screens (vote, edit answers, not found, error and loading states)
- [x] Each: type-check, lint, both test zones, build, screenshots at 1440 and 375

**Results**
- Commits `6d30f752` (admin), `2d9b8ef4` (organiser polls), `c852734a` (guest polls), on
  `feat/back-office-styling`, local only.
- New shared pieces: `src/components/admin/BackOfficeHero.tsx` (ink hero) and
  `BackOfficeBand.tsx` (the public Band at tool padding, plus the two card surfaces and the block
  heading). `Header` gained `cta.variant` and hides its Menu toggle when it has nothing to open.
- Every back-office screen is off the old palette and the legacy `Text`, `Heading`, `Card`,
  `Button` and shadcn `ui/*` components; a grep of `src/app/admin`, `src/app/availability`,
  `src/components/admin` and `src/components/polls` finds none in code.
- Verified with fixture data only (no live API, database or server action): screenshots at 1440
  and 375; phone drawer, Sign out, delete dialogue and vote validation driven in a browser.
  Vitest 1856/1857 in both zones, lint (one existing GoogleTagManager warning), build green.
- Left alone: `cellClass` in `src/components/polls/organiser/results-display.ts` still names the
  old palette, but nothing imports it.

---

# Dead poll links answer a real 404 (22 September 2026)

**Problem:** `/availability/p/<unknown>` answers 200. `src/app/loading.tsx` wraps every route in a
Suspense boundary, so the shell is sent with a 200 before `notFound()` runs. Same defect on
`/availability/p/.../edit/...`, `/availability/o/...`, `/survey/...` and unknown slugs under
`/insights/` and `/guides/category/`. `/availability/verify/...` never calls `notFound()`.

- [x] Reproduce on a local production build (all token routes 200, HTML is only the loading cover)
- [x] Work out what the root loading screen gives public pages (a cover on client-side navigation
      to the three dynamic pages, `/contact`, `/start-here`, `/insights`; nothing on static pages
      or on any first load)
- [x] Move the cover to a shared component; delete the root `loading.tsx`
- [x] Give `/contact`, `/start-here` and `/insights` (list only, via a route group) their own
      `loading.tsx`, so they keep the cover
- [x] Resolve the organiser token in a layout above `o/[token]/loading.tsx`, so the results
      skeleton stays and a dead link still 404s
- [x] Correct every comment that says the root `loading.tsx` exists or that these routes are 200
- [x] Unit test: no `loading.tsx` above a `notFound()` caller
- [x] Synthetic check: dead poll links and an unknown survey return 404 on the live site
- [x] Type-check, lint, `npx vitest run`, `npm run test:utc`, build, curl every route

**Results (local production build, 22 September 2026):**

- No database settings: every dead poll link 404 (was 200).
- Local stand-in database: unknown and draft tokens 404 on `p`, `p/.../edit/...` and `o`; unknown
  survey and survey preview 404; unknown insight and category 404; live `p` and `o` 200. The live
  organiser page sends its first byte in 14 ms and streams the skeleton, then the results.
- Prefetch data still carries the site cover for `/contact`, `/start-here`, `/insights`, and the
  organiser skeleton for `/availability/o/...`.
- Dead links show "this link isn't live." in the browser, with no third-party requests.
- Type-check clean; Vitest 107 files green in London and UTC; ESLint 0 errors on the project config
  (`npm run lint` cannot run inside a nested worktree: the parent folder's ESLint config clashes).
