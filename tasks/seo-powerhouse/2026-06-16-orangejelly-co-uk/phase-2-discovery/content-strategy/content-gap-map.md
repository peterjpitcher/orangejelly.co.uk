# Orange Jelly — Content Gap Map (Phase 2, Content Strategist)

**Date:** 2026-06-16 · Prioritised by **commercial value (enquiries) × achievability ÷ effort** — not traffic.
**Data:** GSC 12-mo (Known); `src/app` routes + `content/blog` + `evidence/page-metadata.csv`, `internal-links.csv`, GSC Coverage drilldowns (Known). New-term volume = "validate via keyword-plan / GKP". GA4 = unavailable.

The headline gap is **not** "missing pages". It is the **info→commercial bridge** plus an **indexation + intent-satisfaction** failure on a commercial layer that already exists. The one genuinely *missing* content area is **family/kids events (C11)**.

---

## Priority 0 — the gates (must precede measurable content work)

| Gap | Evidence | Data status | Severity | Confidence | Impact area | Owner | Effort | Fix type | Recommended action |
|---|---|---|---|---|---|---|---|---|---|
| Commercial layer not indexed | GSC Coverage drilldown: `/services`, `/pub-marketing`, `/pub-marketing-agency`, `/capabilities`, `/compete-with-pub-chains`, `/ways-to-work/growth-fix\|growth-partner\|momentum-month`, 7/9 location pages all not indexed | Known | Critical | High | crawl/indexing | Technical | Medium | Template/system fix | Diagnose & resolve so commercial pages index. **Route via Risk Register. Gates all C1–C3, C9 content ROI.** Content owner cannot fix this but must not brief copy as the cure. |
| No enquiry tracking | GA4 not supplied (`data-access.md`) | Known | High | High | conversion | Analytics | Medium | Analytics/governance fix | Stand up GA4 + form/CTA conversion events before measuring any bridge/CTA change |

---

## Priority 1 — the info→commercial bridge (highest commercial lever, content-owned)

| Gap | Evidence | Data status | Severity | Confidence | Impact area | Owner | Effort | Fix type | Recommended action |
|---|---|---|---|---|---|---|---|---|---|
| Guide→service links are generic boilerplate, not contextual bridges | `internal-links.csv`: 851 guide→commercial links, ≈38 per target evenly distributed (= sitewide footer/menu block, not in-content topic-matched links) | Known | High | High | conversion/SEO | Content | Medium | Template/system fix | Add an **in-body, topic-matched "want this done for you?" bridge block** to the guide template, keyed to the guide's cluster → its matching service (C4/C5 events→events service; C7 social→C2; C3 empty/quiet→fix-my-pub). Peer-to-peer voice, single relevant link, not a link farm. Keep the existing footer block but stop relying on it as "the bridge". |
| Top guides carry the site but route to the wrong/too-many destinations | summer-events 7,572i/96c, quiz 4,348i/76c, food 4,479i/67c, social 3,836i/37c — all informational; commercial pages earn 44c total (Phase 1) | Known | High | High | conversion | Content/UX | Medium | Content process fix | For each of the top ~12 guides, define **one** intent-matched primary CTA destination in the brief; remove the "every service in the footer" dilution from the in-content experience |

---

## Priority 2 — commercial capture (demand already shown to OJ)

| Gap | Evidence (GSC 12-mo, Known) | Severity | Confidence | Impact area | Owner | Effort | Fix type | Recommended action |
|---|---|---|---|---|---|---|---|---|
| Best-positioned commercial queries resolve to **redirect stubs** | `instagram services for pubs` 256i **pos 7.0** 0c + `facebook services for pubs` 123i **pos 6.1** 0c → both are 5-line `permanentRedirect` to `/services/social-media-marketing-for-pubs` (`src/app/services/{facebook,instagram}-services-for-pubs/page.tsx`) | Critical | High | conversion/SEO | Content | Medium | One-off page fix | **Decision (validate via keyword-plan):** either (a) restore them as full named-channel pages with channel-specific scope + CLAIMS proof, or (b) keep the redirect but make the destination explicitly answer "Facebook services" and "Instagram services" with named-channel sections + anchors so the redirected ranking still satisfies intent. Highest CTR-recovery opportunity on the site. |
| `/services/social-media-marketing-for-pubs` must absorb redirected channel intent | It is the redirect target for both facebook + instagram stubs; 155-line render | High | High | conversion/SEO | Content | Small | One-off page fix | Ensure visible H2 sections for "Facebook for your pub" and "Instagram for your pub" so the inherited pos-6/7 rankings land on relevant content; CLAIMS-backed proof block; packages-from pricing |
| Paid social / content service pages don't earn the click | `paid social for pubs` 207i pos 11.2 0c; `content creation for pubs` 226i pos 14.8 0c; `content creation services for pubs` 86i **pos 8.8** 0c | High | High | conversion/SEO | Content | Medium | One-off page fix | Strengthen `/services/paid-social-for-pubs` + `/services/content-creation-for-pubs`: clearer scope, packages-from £375+VAT, 30-day guarantee, one approved CLAIM each, single primary CTA |
| Hub/agency pages not converting (compounded by non-indexation) | `pub marketing agency` 304i pos 19.6 0c; `pub marketing` 666i pos 22.3 0c; `marketing agency for pubs` 161i pos 18.3 0c; `/pub-marketing-agency` 1,002w (not indexed) | High | High | conversion/SEO | Content | Medium | One-off page fix | Once indexed (P0): sharpen `/pub-marketing-agency` + `/pub-marketing` + `/services` hub with anti-agency positioning ("a working publican, not account managers"), transparent fixed pricing, 30-day guarantee, CLAIMS proof, clear routing into channel + package pages |
| Rescue/turnaround intent strong but split across 4 pages | `fix my pub` 109i **pos 5.7** 1c; `pub business recovery services stockport` 22i pos 7.9; 4 overlapping routes (see cannibalisation) | High | High | conversion/SEO | Content | Medium | One-off page fix | Consolidate to one canonical "fix my pub / turnaround" page tied to the 30-day action guarantee; retarget/redirect the others (Risk Register) |

---

## Priority 3 — new content (genuine gap, validate volume first)

| Gap | Evidence (GSC 12-mo, Known) | Severity | Confidence | Impact area | Owner | Effort | Fix type | Recommended action |
|---|---|---|---|---|---|---|---|---|
| **Family / kids events for pubs — no page owns it** | `kids craft pop up events for pubs` 356i pos 28.4; `how to organise events to attract families to pubs` 315i pos 20.7; `family friendly activities to increase pub footfall` 206i pos 32.4; `how to attract families to pubs` 91i pos 32.3; `partner with kids entertainment providers for pubs` 9i pos 12.6 (≈1,000+ impr, all pos 20–37, scattered across thin pages) | High | High | SEO (→conversion) | Content | Medium | One-off page fix → cluster | Build a **dedicated "Family & kids events for pubs" pillar** consolidating these intents; bridge to events service. **Validate `family events for pubs` volume via keyword-plan / GKP before committing** (GSC shows impressions, not market volume). |
| "Pub loyalty scheme" sub-cluster under-served | `pub loyalty scheme` 110i pos 15.7; `pub loyalty cards` 90i pos 29.8 (existing `build-loyalty-scheme-fill-pub.md` ranks pos 15.7 — refresh, not new) | Medium | High | SEO | Content | Small | One-off page fix | Refresh existing loyalty guide to top-10; not a new-page gap |
| Premiumisation / average-spend angle | `premiumisation in your pub` 80i pos 14.6; `premium-pub-positioning.md` exists | Low-Med | High | SEO | Content | Small | One-off page fix | Refresh existing page; no new page needed |

---

## Priority 4 — position-improvement on existing high-impression guides (no new content)

| Page / query | Evidence (Known) | Severity | Confidence | Impact area | Owner | Effort | Fix type | Action |
|---|---|---|---|---|---|---|---|---|
| summer-pub-event-ideas | 7,572i, 96c, **pos 15.1** | High | High | SEO | Content | Medium | One-off page fix | Refresh/expand + answer blocks; biggest impression pool on the site |
| `event ideas for pubs` (query) | 956i, **0c**, pos 16.8 | High | High | SEO | Content | Medium | One-off page fix | Map to the consolidated events pillar (see cannibalisation); lift to top-10 to start earning clicks |
| content-marketing-ideas-pubs | 2,158i, 15c, pos 15.6 | Medium | High | SEO | Content | Medium | One-off page fix | Improve depth/intent; bridge to C2d content service |
| pub-refurbishment-on-budget | 1,792i, 13c, pos 14.7 | Medium | High | SEO | Content | Small | One-off page fix | On-page optimisation; absorb `bar refurbishment` 127i / `pub refit` 65i variants |
| christmas-pub-event-ideas | 1,375i, 17c, pos 11.6 (also flagged not-indexed in one drilldown — confirm w/ Technical) | Medium | High | SEO | Content | Small | One-off page fix | Seasonal refresh ahead of Q4; verify indexation |
| social-media-strategy-for-pubs | 3,836i, 37c, pos 12.6 | Medium | High | SEO/conversion | Content | Medium | One-off page fix | Lift position **and** add contextual bridge to C2 services |

---

## Priority 5 — defend informational clusters vs Greene King hub + AI citation

| Gap | Evidence | Data status | Severity | Confidence | Impact area | Owner | Effort | Fix type | Action |
|---|---|---|---|---|---|---|---|---|---|
| `valueforvenues.co.uk` (Greene King) competes across all 4 core informational clusters | Web search June 2026 (`competitor-landscape.md`): ranks for social-media-for-pubs, event ideas, footfall | Known | Medium | Medium | SEO | Content | Medium | Content process fix | Defend C4–C7 with real-publican voice, dated first-hand outcomes (approved CLAIMS only), quotable answer blocks the brewery hub can't match. **Greene King = Tenant** framing in any comparison. |
| AI-citation readiness on C4–C7 leaders | Manual SERP: PAA/AI Overview on informational "ideas/how-to" queries; `schema.json`: FAQPage×41, Speakable, BlogPosting×217 present | inferred | Low | Low | AI visibility | Content | Medium | Content process fix | Maintain concise quotable answer blocks + named-author expertise on quiz/events/food/social leaders; ensure schema matches visible content. Do **not** chase AI citation on the commercial cluster (vendors rarely cited as neutral answers). Directional only — no AI-referral data exists. |

---

## Competitor-type read (per role file)

- **SERP/business (commercial C1–C3):** CJ Digital, Wired Media, Marketing For Pubs, We Are Brew, YesMore — agency landing pages with case studies. **Beatable on positioning, not output volume.** OJ wedge: anti-agency, real publican, fixed pricing, 30-day guarantee, measured CLAIMS.
- **Content/AI (informational C4–C8):** `valueforvenues.co.uk` (Greene King) is the priority threat — brewery-resourced, fresh, broad. **Out-credible, don't out-publish.**
- **DIY/AI tools:** smartpubtools — the "do it myself" alternative; OJ's "or we'll do it for you" path is the differentiator.
- **SERP competitor likely unbeatable head-on:** quiz-vendor sites (Quiz On Demand, AhaSlides) on pure quiz-question queries → differentiate on "run a quiz that fills the pub", not "free quiz questions".

---

## Gap-map summary (do-this-order)

1. **Index the commercial layer (P0, Technical/Risk Register)** — without it, every C1–C3 content fix is invisible.
2. **Fix the redirect-stub channel pages + strengthen channel/hub service pages (P2)** — the highest CTR-recovery on the site (pos 5–9, 0 clicks).
3. **Replace boilerplate footer "bridge" with in-body, topic-matched guide→service bridges (P1)** — converts existing informational authority.
4. **Consolidate the cannibalised event/quiz/rescue clusters (see `report.md` §Cannibalisation)** — then position-improve the leaders (P4).
5. **Build the family-events pillar (P3)** — the one true new-content gap; validate volume via keyword-plan first.
6. **Defend C4–C7 vs Greene King + AI answer blocks (P5)** — protect the funnel; AI as by-product.
