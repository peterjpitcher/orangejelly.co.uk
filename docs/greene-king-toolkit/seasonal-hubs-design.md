# Seasonal Engagement Hubs — Design Sketch

**Status:** Design sketch for review · **Date:** 30 May 2026
**Builds on:** [`../../seo-overhaul/phase-2-discovery/content-strategy/hub-architecture-briefing.md`](../../seo-overhaul/phase-2-discovery/content-strategy/hub-architecture-briefing.md) (SEO research) and [`./autumn-2026-spec.md`](./autumn-2026-spec.md) (the first hub, now live on the branch).

## Decision

Build **four evergreen seasonal hubs** (Spring · Summer · Autumn · Winter) as rich, designed engagement pages, served from **one shared, flat library** of evergreen guides. Guides are **not** nested under seasonal URLs — they keep their `/licensees-guide/<slug>` paths and are **tagged by season**, so one guide can feature in several hubs. The "hub-with-sub-pages" experience comes from a **bespoke hub template**, not from URL nesting.

This maps to Orange Jelly's quarterly Greene King toolkit cadence: each hub is the QR/campaign target for that quarter's toolkit, refreshed every year at the same URL.

### Why (from the research)
- SEO benefit = internal linking + pillar quality, **not** URL depth.
- Evergreen guides serve **multiple** seasons (a wine tasting suits autumn, winter party season *and* spring). A flat shared library + season tags lets all four hubs reuse them; nesting would force one season per guide and breed duplicate content.
- Refreshing one evergreen URL per season each year compounds authority; rebuilt/dated pages do not.

---

## 1. URL model

| Thing | URL | Notes |
|---|---|---|
| Seasonal hubs (×4) | `/licensees-guide/<season>-pub-event-ideas` (autumn already lives here) | **Recommendation: keep hubs in the guide section.** Consistent with the existing autumn hub, keeps events-pillar membership, and the QR already resolves. Promoting to top-level `/<season>-pub-ideas` is marginally cleaner branding but moves a live URL for no ranking gain. |
| Guides (spokes) | `/licensees-guide/<slug>` (unchanged, flat) | Shared library, reused across hubs. |
| QR / short links | `/<season>` → hub (with UTM), per season | Already built for `/autumn`; replicate per season. |

Pick one pattern and apply it to all four hubs.

---

## 2. Tagging model (data layer) — two orthogonal dimensions

Tag each **guide** on two independent, multi-value axes in frontmatter (both separate from the existing `category`, which is the content *type*):
```yaml
seasons: # genuine seasonal fit — drives the seasonal hubs
  - autumn
  - winter
occasions: # specific moments — drives occasion hubs + finer surfacing
  - black-friday
```
A guide can carry several of each. Examples (now applied): Black Friday → `seasons: [autumn, winter]`, `occasions: [black-friday]`; the Halloween guide → `seasons: [autumn]`, `occasions: [halloween, bonfire-night]`; Six Nations → `seasons: [winter, spring]`, `occasions: [six-nations]`.

Each **hub** carries its key + an ordered curation list:
```yaml
hubSeason: "autumn"
featuredGuides: # ordered, editorial — the headline grid
  - wine-tasting-evenings-for-pubs
  - cask-ale-week-pub-guide
```

**Three rules keep multi-tagging sharp:**
1. **Evergreen ≠ seasons.** A guide that's flat all year (quizzes, social, general fundamentals) gets **no** season tag — surface it via `category` / an "essentials" rail. Reserve season tags for guides that genuinely *peak* in that season, so `[autumn, winter]` means something.
2. **Featured-vs-supporting is per hub, not per guide.** A guide only carries its tags; each hub's `featuredGuides` decides whether to headline it or merely list it under "More for this season". So one guide can headline Autumn and just appear on Winter.
3. **Occasions are independent of seasons.** Most sit inside one (christmas ∈ winter), but Easter moves and Black Friday straddles — keeping occasions as their own array avoids locking them to a season.

`seasons`/`occasions` = the automatic backbone (discovery + cross-hub reuse, zero duplication); `featuredGuides` = the curation layer. Applied to the back-catalogue in Phase 3 — 19 seasonal guides tagged; see [`back-catalogue-tag-map.md`](./back-catalogue-tag-map.md).

---

## 3. Seasonal-hub template (the richer UX)

A dedicated template, triggered by `hubSeason` in frontmatter, renders top-to-bottom:

1. **Themed hero** — season palette + image, the season's headline and intent (e.g. "Fill your pub, September–November"). The QR landing moment.
2. **At-a-glance calendar** — the season's dated moments as a styled visual strip (today an autumn markdown table → a `SeasonalCalendar` component).
3. **Curated guide grid** — `SeriesHubGrid` (already built), themed per season, rendering `featuredGuides` as cards.
4. **"Plan your season" rhythm strip** — Plan · Post · Brief · Book · Measure.
5. **More for this season** — auto list of season-tagged guides beyond the featured set.
6. **Cross-season nav** — "Next: Winter Playbook →" (keeps users *and* crawlers moving between hubs).
7. **CTA** — to Orange Jelly services.

**Component reuse:** `BlogCategoryHero` → a themed `SeasonalHubHero`; `SeriesHubGrid`, `BlogPostCard`, `Grid`, and the existing schema components. This is mostly assembly, not new primitives.

**Theming constraint (important):** per the design-token rules, do **not** construct Tailwind classes dynamically (`bg-${season}-500` is banned). Define **four static season themes** — a token / CSS-variable set per season, applied via a `data-season` attribute or a static theme map — and switch by season key. Four fixed themes, statically referenced.

To the reader this is a curated mini-site per season (the "sub-page" feel) while every guide keeps its flat, reusable URL.

---

## 4. Schema

Per hub: `CollectionPage` + `ItemList` (the featured guides) + `BreadcrumbList`. Spoke labelling — "Autumn Playbook → Wine Tastings" — is derived from the guide's `seasons` / the hub's `featuredGuides`, so a spoke knows which hub it belongs to.

---

## 5. Generalising the autumn build

Today the autumn treatment is keyed off a hard-coded slug + spoke list in `src/app/licensees-guide/[slug]/page.tsx` plus `SeriesHubGrid`. To generalise:

- Replace the constants with a small `SEASON_HUBS` config: `season → { slug, label, dateRange, theme, featuredGuides, calendar }`.
- The route checks `hubSeason` (or the config) instead of one slug, and renders the seasonal template.
- Add `seasons` + `featuredGuides` to frontmatter and expose them through the markdown loader (`src/lib/markdown/`).

Low-risk and incremental — the autumn page becomes hub #1 of the template.

---

## 6. Phasing & effort

- **Now:** ship autumn (built, on `feat/autumn-toolkit-2026`). It is the reference implementation.
- **Build the template (one-off):** generalise the hub treatment, add the four static themes, the `SeasonalCalendar` component, and the tagging model. Medium effort, one focused project.
- **Per new season:** write the hub post, tag + curate guides, set the season theme, add the `/<season>` redirect. **Low** effort once the template exists — mostly content. Winter is next (alongside the Greene King Christmas toolkit), then spring, then summer.

---

## 7. Open decisions

1. **Hub URL pattern** — keep hubs in `/licensees-guide/` (recommended) vs top-level `/<season>-pub-ideas`.
2. **"Winter" vs "Christmas"** — Greene King runs a separate Christmas toolkit, so Q4 may want a dedicated **Christmas** hub *and* a broader **Winter** hub, rather than one. Decide how the four-season model absorbs Christmas.
3. **Featured vs fully-automatic grids** — confirm the hybrid (season tags for the backbone, `featuredGuides` for curated order).
4. **Timing** — build the template now, or ship autumn, measure it, then build the template before the winter toolkit.
