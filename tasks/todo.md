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
