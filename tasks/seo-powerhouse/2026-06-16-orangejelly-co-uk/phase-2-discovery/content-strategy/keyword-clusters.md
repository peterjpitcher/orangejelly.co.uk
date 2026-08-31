# Orange Jelly — Keyword Cluster Analysis (Phase 2, Content Strategist)

**Date:** 2026-06-16 (Europe/London) · **Author:** Content Strategist
**Builds on:** `phase-1-strategy/keyword-framework.md` (do not duplicate — this deepens it with page-level coverage from the codebase + crawl).
**Data status:** Existing demand = GSC 12-month Queries (`evidence/search-queries.csv`, 701 queries) — **Known, first-party**. Coverage = `src/app` routes + `content/blog` + `evidence/page-metadata.csv` — **Known**. New-term volumes = **none asserted** → "validate via keyword-plan / GKP". GA4 = **unavailable** (no conversion baseline). Manual SERP review (`phase-1-strategy/serp-snapshots.md`) informs intent/competition only — never volume, difficulty or rank.

---

## What changed vs Phase 1's assumptions (important — re-read before planning)

Phase 1 stated the commercial pages were "weak — pages exist, ~0 clicks" and framed the work as build/strengthen. First-party codebase + crawl evidence sharpens this materially:

1. **The commercial layer is far more built-out than Phase 1 documented.** Live routes exist for `/services` (hub) + 5 channel pages, `/pub-marketing`, `/pub-marketing-agency`, `/fix-my-pub`, `/pub-rescue`, `/compete-with-pub-chains`, `/capabilities`, 9 location pages, and `/ways-to-work` + 4 packages. *(Source: `src/app` route listing. Known.)* The job is therefore **fix / index / differentiate / bridge** far more than **create from scratch**.
2. **The dominant lead-gen blocker is indexation, not absence.** GSC Coverage drilldowns show the commercial layer is overwhelmingly **not indexed**: `/services`, `/pub-marketing`, `/pub-marketing-agency`, `/capabilities`, `/compete-with-pub-chains`, `/ways-to-work/growth-fix|growth-partner|momentum-month`, and 7 of 9 location pages all sit in not-indexed buckets. *(Source: `evidence/gsc/*Coverage-Drilldown*` Table.csv. Known.)* A page that is not indexed cannot earn the 2,908 commercial impressions Phase 1 found — so those impressions are coming from the *few* commercial URLs Google has indexed (e.g. the channel service pages), while the hub/agency/package pages contribute nothing. **This is owned by Technical (route via Risk Register), but it gates every content recommendation here — flagged throughout.**
3. **Two highest-position commercial pages are redirect stubs.** `facebook services for pubs` (pos 6.1, 123 impr, 0 clicks) and `instagram services for pubs` (pos 7.0, 256 impr, 0 clicks) are the **best-ranked commercial queries on the site** — and both target pages are 5-line `permanentRedirect` stubs pointing at `/services/social-media-marketing-for-pubs`. *(Source: `src/app/services/{facebook,instagram}-services-for-pubs/page.tsx`. Known.)* So Google ranks a redirect; the destination must satisfy "facebook/instagram services" intent or the click is wasted. This is a precise, high-value fix.
4. **The guide→commercial "bridge" already exists — but as generic boilerplate, not contextual links.** 851 guide→commercial internal links exist, distributed almost perfectly evenly (≈38 links per commercial target across the sampled guides). *(Source: `evidence/internal-links.csv`. Known.)* That even distribution is the signature of a **sitewide footer/menu block**, not topic-matched in-content bridges. The gap is not "no links" — it is "the right link, in context, with peer-to-peer anchor text, inside the guide body".

These four facts reorder the content priorities below.

---

## Cluster map (deepens Phase 1's C1–C10)

Intent: **I**=Informational, **C**=Commercial, **T**=Transactional, **N**=Navigational. "GSC" figures are 12-month, Known.

| # | Cluster | Intent | Target page (exists?) | Current coverage verdict | Key GSC evidence (Known) | Difficulty (inferred, SERP) | Opportunity | Priority |
|---|---|---|---|---|---|---|---|---|
| **C1** | Pub marketing agency / help (hub) | C | `/pub-marketing-agency` (1,002w), `/pub-marketing` (hub), `/services` (hub) — **all not indexed** | **Index + differentiate.** Pages exist; not in index | `pub marketing agency` 304i pos 19.6 0c; `pub marketing` 666i pos 22.3 0c; `marketing agency for pubs` 161i pos 18.3 0c; `marketing for pubs` 17i pos 18.6 0c | High (agency field) | High — demand shown, anti-agency wedge open | **Immediate** |
| **C2a** | Social media management for pubs | C | `/services/social-media-marketing-for-pubs` (155-line render) | **Keep + strengthen.** Strongest-built service page | `social media marketing for pubs` 380i pos 12.0 1c; `social media for pubs` 27i pos 33.3; `bar social media marketing` 62i pos 51.4 | Medium | High | **Immediate** |
| **C2b** | Facebook / Instagram services for pubs | C | `facebook-services-for-pubs` + `instagram-services-for-pubs` = **redirect stubs** to C2a | **Decision needed:** redirect target must satisfy named-channel intent (see cannibalisation §) | `instagram services for pubs` 256i **pos 7.0** 0c; `facebook services for pubs` 123i **pos 6.1** 0c; `facebook for pubs` 69i pos 9.1; `instagram for pubs` 60i pos 8.3 | Medium — already pos 6–9 | **Highest CTR-recovery upside on the site** (best positions, 0 clicks) | **Immediate** |
| **C2c** | Paid social / Meta ads for pubs | C | `/services/paid-social-for-pubs` (render) | **Keep + strengthen** | `paid social for pubs` 207i pos 11.2 0c; `social media ads for pubs` 12i pos 51.7; `paid social services for pubs` 21i pos 21.1 | Medium | High | **Immediate** |
| **C2d** | Content creation / social video for pubs | C | `/services/content-creation-for-pubs` (render) | **Keep + strengthen** | `content creation for pubs` 226i pos 14.8 0c; `content creation services for pubs` 86i pos 8.8 0c; `social video services for pubs` 126i pos 25.0 | Medium | High | **Immediate** |
| **C3** | Pub rescue / turnaround / "fix my pub" | C | `/fix-my-pub` (190-line render), `/pub-rescue` (629-line render), `/empty-pub-solutions` (667w), `/quiet-midweek-solutions` (742w) | **Consolidate + index.** Four overlapping commercial pages (cannibalisation, see §) | `fix my pub` 109i **pos 5.7** 1c; `pub business recovery services stockport` 22i pos 7.9 0c; `pub help` 11i pos 20.8 | Medium | High — strong positions, ties to 30-day guarantee | **Immediate** |
| **C4** | Pub event ideas | I→C bridge | `pub-event-ideas`, `how-to-run-successful-pub-events`, `pub-event-template-profit-nights`, `pop-up-events-for-pubs`, `seasonal-pub-events-calendar`, `summer-pub-event-ideas` | **Consolidate (5-way cannibalisation) + bridge.** Strong rankings but split equity | `event ideas for pubs` 956i pos 16.8 **0c**; `pub event ideas` 620i pos 15.3 5c; `pop up events for pubs` 501i pos 37.6 0c; summer-events page 7,572i/96c pos 15.1 | Medium | High traffic; biggest impression pool | **Immediate** |
| **C5** | Quiz nights | I→C bridge | `quiz-night-ideas` (938w), `quiz-night-101`, `restart-quiz-music-sport-roi` | **Refresh leader + de-dupe.** Ranks well | quiz-night-ideas page 4,348i/76c pos 11.8; `quiz night ideas` 207i pos 7.7 4c; `pub quiz ideas` 107i pos 12.5 4c; `quiz night format` 109i pos 31.0 | Medium | Med-high; AI-citation candidate | **Short-term** |
| **C6** | Pub food / menu / margin | I→C bridge | `profitable-pub-food-menu-ideas`, `menu-engineering-lift-average-spend`, `pub-drinks-menu-design-guide` | **Defend (best position) + bridge** | food page 4,479i/67c **pos 7.4**; `profitable menu items` 243i pos 18.9; `pub menu ideas` 128i pos 13.9; `most profitable bar food` 89i pos 17.4 | Medium | Med-high; near top-10 already | **Short-term** |
| **C7** | Social media for pubs (how-to) | I→C bridge to C2 | `social-media-strategy-for-pubs`, `facebook-marketing-local-pubs`, `instagram-marketing-for-pubs`, `content-marketing-ideas-pubs`, `social-media-tactics-footfall-seven-days` | **Refresh + bridge to C2.** The clearest info→commercial pivot | social-media-strategy page 3,836i/37c pos 12.6; `instagram marketing for pubs` 32i pos 11.6; `content-marketing-ideas-pubs` 2,158i/15c pos 15.6 | Medium | High — direct funnel into C2 services | **Short-term** |
| **C8** | Seasonal pub playbooks | I (+bridge) | `christmas-pub-event-ideas`, `summer-pub-marketing`, `pub-halloween-bonfire-night-events`, `autumn-*`, `cask-ale-week`, `oktoberfest`, `national-drinks-days`, `sober-october` | **Index the new ones + seasonal refresh.** Several not indexed | `christmas pub ideas` 209i pos 14.8; christmas page 1,375i/17c pos 11.6; `christmas event ideas for pubs` 19i pos 10.8 | Low-Med | Med; demand is calendar-driven | **Short-term** |
| **C9** | Local pub marketing (regional) | C-local | 9 `/pub-marketing-{county}` pages (~650w each) — **7 of 9 not indexed** | **Index + thicken thin pages** | `pub business recovery services stockport` 22i pos 7.9; `hospitality content creation berkshire` 10i pos 38.0; location pages exist | Med (local) | Med; local-pack + service-with-location intent | **Medium-term** |
| **C10** | Pub operations / cost / survival | I | broad guide set (`pub-wages`, `compete-with-wetherspoons`, `how-much-profit-does-a-pub-make`, `recession-proof`, energy/VAT/licensing) | **Defend breadth.** Top-of-funnel reach | `compete with wetherspoons` 1,050i/13c pos 9.2; `pub wages`; `how much profit does a pub make` | Med | Med; audience-qualifying traffic | **Medium-term** |
| **C11** | Family / kids events (NEW sub-cluster) | I→C bridge | partial (`how-to-attract-families-to-your-pub`, `family-craft-hour-101`); no dedicated "family events" service angle | **Gap — high latent demand, no consolidated page** | `kids craft pop up events for pubs` 356i pos 28.4; `how to organise events to attract families to pubs` 315i pos 20.7; `family friendly activities to increase pub footfall` 206i pos 32.4; `how to attract families to pubs` 91i pos 32.3 | Low-Med | **High & under-served** — 1,000+ impr across family-event queries, all pos 20–37 (no page owns it) | **Short-term** |
| **C12** | Pub refurbishment / refit on a budget | I | `pub-refurbishment-on-budget`, `pub-toilet-refurbishment-budget-guide`, `low-cost-decor-refreshes` | **Refresh — pos 14.7, big pool** | refurbishment page 1,792i/13c pos 14.7; `bar refurbishment` 127i pos 37.0; `pub refurbishment` 98i pos 34.2; `pub refit` 65i pos 29.9 | Low-Med | Med; position-improvement play | **Short-term** |

---

## Intent mapping — the commercial gap, restated precisely

- **Informational demand (C4–C8, C10–C12)** is where the site lives and ranks. Healthy top-of-funnel; protect and bridge it. *(GSC: ~458 informational clicks/12mo per Phase 1.)*
- **Commercial demand (C1–C3) is real, already surfaced, and almost entirely un-clicked.** The 57-query commercial set = 2,908 impr / 2 clicks (≈0.07% CTR). *(Source: search-queries.csv, Phase 1 intent-classification, Known.)* The new evidence pinpoints **why**: the hub/agency/package pages aren't indexed at all, and the two best-positioned channel queries (facebook/instagram services, pos 6.1/7.0) resolve to redirect stubs. The gap is **indexation + intent-satisfaction + differentiation**, not "no page".
- **Family-events (C11)** is a genuine *new* informational gap with strong shown demand (1,000+ impr across `kids craft pop up events`, `attract families`, `family friendly activities`) and no page owning it — all stuck pos 20–37. This is the clearest *new-content* opportunity in the dataset.

---

## Difficulty vs opportunity (honest, SERP-informed — no invented numbers)

- **Lowest-effort / highest-return:** C2b (facebook/instagram services) and C3 (`fix my pub`) — already pos 5–9, the click is one fix away (indexation + intent-matched destination). C6 food (pos 7.4) and C5 quiz (pos 7.7 on `quiz night ideas`) are near top-10 on informational terms.
- **Medium-effort / high-return:** C1 hub, C2a/c/d channel pages, C4 events consolidation, C7 social bridge.
- **Higher-effort / medium-return:** C9 location system (thin pages, local difficulty), C10 breadth.
- **De-prioritise (per Phase 1):** generic "marketing agency", national high-competition agency terms, international traffic.

**Difficulty labels are inferred from manual SERP review only** (`serp-snapshots.md`) — no keyword tool was connected, so no difficulty score is asserted as fact.

---

## Keyword-plan / GKP handoff point

A `keyword-plan` (Google Keyword Planner) handoff belongs **here, before any net-new page is committed**, specifically for:

1. **C11 family-events** — confirm volume/competition for `family events for pubs`, `kids events for pubs`, `family friendly pub activities` before building a dedicated pillar (GSC shows impressions but GSC impressions ≠ market volume).
2. **C2 named-channel split decision** — validate whether `facebook services for pubs` / `instagram services for pubs` carry enough standalone demand to justify *un-redirecting* the stubs into full pages, vs keeping the consolidated social page. GSC shows position (6.1/7.0) but the redirect masks true page-level demand.
3. **C9 location expansion** — before adding counties beyond the existing 9, validate `pub marketing {county}` demand.

Everything in clusters C1–C8, C10, C12 is grounded in **existing GSC demand** and needs no volume validation to proceed — those are refresh/fix/bridge actions on terms the site already ranks for.
