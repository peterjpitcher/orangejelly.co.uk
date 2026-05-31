# Spec — Autumn 2026 Greene King Toolkit + orangejelly.co.uk Click-out Hub

**Owner:** Peter Pitcher · **Last updated:** 30 May 2026 · **Status:** Phase 1 built & verified (local); toolkit copy ready to send; Phase 2 + deploy pending.
**Companion docs:** [`autumn-2026-toolkit-copy.md`](./autumn-2026-toolkit-copy.md) (send-ready A4 copy) · [`autumn-2026-brief-review.md`](./autumn-2026-brief-review.md) (fact-check + rationale)

---

## 1. Objective

Deliver (a) the **Greene King Autumn Toolkit copy** (1–2pp A4) to Charlotte Brown by **8 June 2026**, and (b) a **reusable autumn content hub + deep-dive guides** on orangejelly.co.uk that the toolkit's single QR points to. The hub is evergreen (refreshed each autumn): one measurable, compounding asset for Orange Jelly and a richer toolkit for Greene King.

## 2. Context (verified)

- Charlotte wants the toolkit out to pubs **early August**; she explicitly flagged **wine** (new GK brochure to pubs by July) and is happy to reference Orange Jelly content. A **separate Christmas toolkit** follows (to pubs end of August) — we tee it up, we don't cover it.
- All dates/stats validated against official sources. **Two corrections applied:** Champagne Day = **Fri 23 Oct** (official 4th-Friday rule), framed as a "Champagne Weekend" 23–24 Oct; the unverifiable "low/no wine +28%" stat is **dropped**. Rugby reworded — the 2026 **Nations Championship** replaces the standalone Autumn Internationals; finals at **Twickenham, 27–29 Nov**.

## 3. Scope

**In:** toolkit A4 copy; one evergreen hub page; 3 Phase-1 guides; 4 Phase-2 guides; image assets; `blog-images.ts`; internal cross-links; the tracked `/autumn` redirect; QR via The Anchor shortlink (agency-built).
**Out:** Christmas toolkit content; Greene King's design/template work (we supply copy); paid promotion; new components/routes beyond the redirect; QR image generation (the agency does this).

## 4. Decisions (all resolved)

| # | Decision |
|---|---|
| D1 | **Authorship & sponsorship:** the playbook is **bylined to Peter Pitcher** (who runs The Anchor) and **sponsored by Orange Jelly** — clean title, OJ logo + "Sponsored by Orange Jelly" tag, an OJ sponsor **ad** on page 2, and "Words by Peter Pitcher, sponsored by Orange Jelly" footers. |
| D2 | **Evergreen hub slug** `autumn-pub-event-ideas` (no year) — QR + SEO compound each autumn; refresh content annually. |
| D3 | **Single QR.** The agency generates it; it encodes The Anchor shortlink **`https://l.the-anchor.pub/c0l05s`**, which Peter has pointed at the optimised hub URL. Printed human-readable URL = `orangejelly.co.uk/autumn`. |
| D4 | Hub sits as a **spoke under the existing events pillar**, reusing the Halloween/Bonfire post and cross-linking existing related guides. |
| D5 | New autumn-rugby guide is **autumn-specific**, cross-links the existing `pub-six-nations-rugby-marketing`. |
| D6 | **Phase 1** (live for the 8 June review): hub + wine + Sober October/low-no + Cask Ale Week. **Phase 2** (before early-Aug release): Macmillan, drinks days, autumn rugby, Black Friday/St Andrew's. Halloween reuses the existing post. |
| D7 | **Tracking:** the shortener gives scan counts; GA4 attributes sessions via `utm_campaign=autumn-2026` (GA4 live via GTM). |
| A1 | Tone = **Orange Jelly TOV** (warm, plain-English, working-publican, British English). |

## 5. Complexity & PR breakdown

**Complexity: L (≈4)** — 7+ files, customer-facing content, no schema/auth change. Sliced:
- **PR 0 (non-code):** toolkit copy doc → send to Charlotte. **✅ done.**
- **PR 1 (Phase 1):** hub + 3 guides + images + `blog-images.ts` + cross-links + `/autumn` redirect. **✅ built & verified (local, not deployed).**
- **PR 2 (Phase 2):** 4 remaining guides + images + reciprocal links + repoint hub's rugby link. **⬜ pending.**
- **Deploy:** `build:all` → preview → production. **⬜ pending (Peter's go — indexation).**

---

## 6. Part A — Greene King toolkit deliverable (A4) ✅ copy ready

**Final copy:** [`autumn-2026-toolkit-copy.md`](./autumn-2026-toolkit-copy.md). Layout, top→bottom:

- **Title:** *The Autumn Pub Playbook* (clean).
- **Byline:** *by Peter Pitcher, who runs The Anchor in Stanwell Moor.*
- **Sponsor tag:** OJ logo + *Sponsored by Orange Jelly* (logo asset: `public/logo.png`; GK logo `public/logo-greene-king.svg` available for a co-branded lockup).
- **Page 1:** intro (Peter's voice) → "Plan it. Post it. Brief it. Book it. Measure it." strip → **Autumn at a glance** calendar (corrected dates) → footer.
- **Page 2:** five plays (**wine featured first**; covers low/no, cask+Macmillan, Halloween+Bonfire, rugby→Black Friday→St Andrew's) → responsible-retailing box → **Orange Jelly sponsor ad** (benefit copy + the approved £75k–£100k value-added proof point + "Book a free chat → orangejelly.co.uk") → QR callout → Christmas teaser → footer.

**Actions to ship Part A:**
1. **Peter → send Charlotte** the copy; flag the **Champagne Day** correction (Fri 23 Oct) and the OJ byline/sponsorship (offer to dial back).
2. **Peter → supply** `public/logo.png` (and optionally GK logo) to the agency for placement.
3. **Agency →** drop copy into the GK template; **generate the QR** encoding `https://l.the-anchor.pub/c0l05s`.
4. **Peter → shortlink** `c0l05s` points at the optimised hub URL. **✅ done.** *(For GA4 attribution, ensure the destination carries `utm_campaign=autumn-2026`, or routes via `orangejelly.co.uk/autumn`, which adds it.)*

---

## 7. Part B — orangejelly.co.uk changes

### 7.1 Hub page ✅ built
`content/blog/autumn-pub-event-ideas.md` → `/licensees-guide/autumn-pub-event-ideas`. Frontmatter complete (events category, `status: published`, `publishedDate: 2026-05-25`, FAQs, quickAnswer, voiceSearchQueries, schema). Body: intro → at-a-glance calendar (corrected) → a section per moment linking its spoke → "your first move" → Christmas bridge → CTA to `/ways-to-work/growth-fix`.

### 7.2 Phase-1 guides ✅ built (OJ voice, fact-checked)

| File / route | Notes |
|---|---|
| `wine-tasting-evenings-for-pubs.md` | Wine made easy + £10–15 flight run-sheet. Only external stat = London Wine Fair 2026 themes; no low/no wine %. |
| `sober-october-low-no-alcohol-pubs.md` | Drinkaware 45%/22%, BBPA ~200m (forecast), CGA 36.9% — attributed; **no 28% wine stat**. |
| `cask-ale-week-pub-guide.md` | Confirmed dates (17–27 Sep 2026); 10-day plan; links the cellar-management guide. |

Each: full frontmatter modelled on `pub-halloween-bonfire-night-events.md`, ≥4 FAQs, CTA → `/ways-to-work/growth-fix`, an SVG image, internal links to existing slugs only.

### 7.3 Phase-2 guides ⬜ pending (live before early-August release)

| File / slug | Scope | Links |
|---|---|---|
| `macmillan-coffee-morning-pub-guide.md` | Daytime community fundraiser checklist | hub, `how-to-run-successful-pub-events` |
| `national-drinks-days-pub-guide.md` | Vodka (4 Oct), G&T (19 Oct), Champagne Weekend (23–24 Oct) | `pub-drinks-menu-design-guide`, hub |
| `autumn-rugby-nations-championship-pubs.md` | Live Nov fixture grid (Scotland v NZ 7 Nov, Wales v NZ 14 Nov, England v NZ 21 Nov, Ireland v SA 21 Nov; Finals 27–29 Nov, Twickenham) + "last checked" date; booking terms, match menu, screen checklist | `pub-six-nations-rugby-marketing` (reciprocal), `nobody-books-tables-anymore`, hub |
| `black-friday-pub-ideas.md` | Gift cards, deposits, bounce-back (no margin-killing discounts) + St Andrew's Day | `christmas-pub-promotion-ideas`, `pub-christmas-bookings-fill-december`, hub |

**Phase-2 also:** add 4 SVGs + `blog-images.ts` entries; add reciprocal link in `pub-six-nations-rugby-marketing.md`; **repoint the hub's rugby link** from the interim `pub-six-nations-rugby-marketing` to the new `autumn-rugby-nations-championship-pubs`.

### 7.4 Reuse (no new file) ✅
Halloween/Bonfire is covered by `pub-halloween-bonfire-night-events`; the hub links it rather than duplicating.

### 7.5 Images & mappings ✅ built
4 brand SVGs at `/public/images/blog/<slug>.svg` (orange `#EA580C`, white title, "Orange Jelly"); `imageMap` in `src/lib/blog-images.ts` updated with all 4 slugs. Phase 2 adds 4 more.

### 7.6 Internal-linking changes
| File | Change | Status |
|---|---|---|
| `content/blog/pub-event-ideas.md` (Autumn bullet) | Link to the autumn hub | ✅ done |
| `content/blog/seasonal-pub-events-calendar.md` (Q4) | Link to the autumn hub | ✅ done |
| `content/blog/pub-six-nations-rugby-marketing.md` | Reciprocal link to the autumn-rugby guide | ⬜ Phase 2 |

### 7.7 QR, shortlink & tracked redirect
- **Redirect (built):** `/autumn` → `/licensees-guide/autumn-pub-event-ideas?utm_source=greene-king&utm_medium=print-toolkit&utm_campaign=autumn-2026` in `next.config.js` `redirects()` (`permanent: false` → 307, repointable). Compiled & verified.
- **QR (agency):** encodes `https://l.the-anchor.pub/c0l05s` → optimised hub URL (Peter has set the destination). Visible printed URL `orangejelly.co.uk/autumn`.
- **Tracking:** shortener = scan counts; GA4 = sessions via `utm_campaign=autumn-2026`. The hub must be **deployed** before the shortlink/QR resolve.

### 7.8 SEO / schema ✅ on built pages
Per post: `quickAnswer`, `faqs`, `voiceSearchQueries`, `metaDescription`, `keywords`, `localSEO`, `schema` Article. Hub-and-spoke interlinking (each spoke links up to the hub).

---

## 8. File manifest

**Created — Phase 1 ✅:** `content/blog/autumn-pub-event-ideas.md`, `wine-tasting-evenings-for-pubs.md`, `sober-october-low-no-alcohol-pubs.md`, `cask-ale-week-pub-guide.md`; 4× `public/images/blog/<slug>.svg`.
**Modified — Phase 1 ✅:** `src/lib/blog-images.ts`; `content/blog/pub-event-ideas.md`; `content/blog/seasonal-pub-events-calendar.md`; `next.config.js` (redirect).
**Pending — Phase 2 ⬜:** 4× guide `.md` + 4× SVG; `src/lib/blog-images.ts` (+4); `content/blog/pub-six-nations-rugby-marketing.md` (reciprocal); hub rugby-link repoint.
**Deliverables:** `docs/greene-king-toolkit/autumn-2026-toolkit-copy.md` ✅; QR (agency) ⬜.

## 9. Definition of Done

**Phase 1 (met):**
- [x] `npm run build` EXIT 0; all 4 pages in the prerender manifest.
- [x] `tsc --noEmit` clean; ESLint clean on edited files.
- [x] Facts QA: no "28%"; stats attributed; **Champagne 23–24 Oct**, finals 27–29 Nov correct.
- [x] `/autumn` compiled → 307 with the UTM string.
- [x] Real metrics only (the ad uses the approved £75k–£100k figure); responsible-retailing wording present; OJ voice.
- [x] No broken internal links (hub links only to pages that exist; rugby points to the interim six-nations post until Phase 2).

**Before go-live (pending):**
- [ ] Phase-2 guides built + linked; hub rugby link repointed.
- [ ] `npm run build:all` (regenerates on-site search + RSS to include new posts).
- [ ] Preview deploy reviewed by Peter + Charlotte → production deploy (Peter's go).
- [ ] Shortlink/QR resolve to the live hub with UTM; GA4 shows the campaign.
- [ ] Mobile + WCAG AA spot-check.

## 10. Verification record (Phase 1)
Build EXIT 0; prerender manifest contains all 4 routes; redirect present in `routes-manifest.json` (307); type-check clean; lint clean on edits; fact greps clean (no 28%; correct dates/attribution). Not yet deployed.

## 11. Risks & watch-outs

| Risk | Mitigation |
|---|---|
| Rugby fixtures/kick-off times shift | A4 stays window-level; hub guide carries the grid + "last checked" + "confirm kick-off times". |
| Wrong Champagne date in print | Flag to Charlotte; "Champagne Weekend 23–24 Oct" framing. |
| Shortlink destination lacks UTM | GA4 loses campaign attribution (scan counts still via shortener). Point destination at `/autumn` or append the UTM. |
| Straying into Christmas | Out of scope; handoff teaser only. |
| OJ branding heavier than GK expects | Note to Charlotte offers to dial back. |

## 12. Timeline
This weekend: toolkit copy to Charlotte; Phase 1 built ✅. **By 8 June:** final copy + QR to Charlotte. **By late July:** Phase 2 live (whole hub complete). **Early August:** GK issues the toolkit. Post-launch: send Charlotte a scan/traffic read → sets up the Christmas toolkit.

## 13. Remaining actions
1. **Peter:** send Charlotte the copy (flag Champagne date + OJ byline/sponsorship); supply logo to the agency. Shortlink ✅ set.
2. **Claude (on your go):** build Phase-2 guides; repoint hub rugby link; optional `feat/autumn-toolkit-2026` branch + commit; optional preview deploy.
3. **Pre-launch:** `build:all`, preview review, production deploy, confirm QR + GA4.
