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

Status: specification local only. No product code changed, no production messages or writes, no migration drafted or applied.
