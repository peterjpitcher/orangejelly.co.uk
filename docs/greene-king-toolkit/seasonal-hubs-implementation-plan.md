# Seasonal Hub System — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan phase-by-phase. Each phase is independently shippable; steps use checkbox (`- [ ]`) syntax.

**Goal:** Turn the one-off autumn hub into a reusable seasonal-hub *system* — a config- and tag-driven hub template, a season-tagged guide library, and a site-wide discovery layer — so a rich seasonal or occasion hub can be stood up from existing content with low effort.

**Architecture:** One flat guide library (`content/blog/*.md`), tagged by season. A `SEASON_HUBS` config + per-post frontmatter (`hubSeason`, `featuredGuides`, `seasons`) drives a themed hub template, rendered by the existing `/licensees-guide/[slug]` route (no new routes, **no guide URLs change**). Hubs surface via footer, guides index, a date-aware homepage band, breadcrumbs and nav.

**Tech stack:** Next.js 15 App Router, markdown + gray-matter, TypeScript, Tailwind (static per-season design tokens — no dynamic class construction), Vercel.

**Builds on:** [`seasonal-hubs-design.md`](./seasonal-hubs-design.md) (the design) and the live autumn hub on `feat/autumn-toolkit-2026` (the reference implementation this generalises).

**Verification model:** content pages have no unit-test convention here, so each phase is verified with: `npm run type-check`, `npm run build` (the autumn hub + all pages still generate), the content hooks (growth-language + British-English checks; prettier; eslint), and a manual render check. Each phase ends with a commit; each is independently deployable.

---

## Phasing & dependencies

| Phase | Produces (shippable) | Depends on |
|---|---|---|
| **0. Deploy autumn** (parallel) | Autumn live — the reference implementation | — (gated on Peter) |
| **1. Hub engine** | Autumn hub rendered via a config/tag-driven system instead of hardcoded slugs | — |
| **2. Themed hub UX** | The hub as a themed pillar (hero, calendar, cross-hub nav) | 1 |
| **3. Back-catalogue audit & tags** | The whole guide library tagged by season; "more for this season" lists | 1 |
| **4. Surfacing layers** | Footer, guides-index band, breadcrumb hub level, homepage season-band, nav | 1 (3 makes it richer) |
| **5. Second hub (Winter/Christmas)** | A second live hub — makes surfacing meaningful | 1–4 |

Recommended order: **1 → 2 → 3 → 4 → 5**, with Phase 0 (autumn deploy) any time. Phases 2/3/4 can overlap once 1 lands.

**Open decisions that gate work:** (a) **Winter vs Christmas** hub for Q4 — gates Phase 5; (b) **hub URL pattern** (keep in `/licensees-guide/`, recommended) — set in Phase 1 config; (c) nav dropdown vs flat item — Phase 4, do once ≥3 hubs exist.

---

## Phase 1 — Hub engine (config + tag driven)

**Goal:** Replace the hardcoded autumn hub logic with a config + frontmatter system, with the autumn hub rendering identically through it.

**Files:**
- Create: `src/lib/seasonal-hubs.ts`
- Modify: `src/app/licensees-guide/[slug]/page.tsx`, `src/components/blog/SeriesHubGrid.tsx`

- [ ] **1.1 — Create the hub config.** New `src/lib/seasonal-hubs.ts`:

```ts
export interface SeasonalHub {
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  hubSlug: string;          // the hub post slug
  label: string;            // "Autumn Pub Playbook"
  shortLabel: string;       // "Autumn Playbook" (breadcrumb/nav)
  dateRange: { startMonth: number; endMonth: number }; // for the homepage "current season" band
  featuredGuides: string[]; // ordered spoke slugs
}

export const SEASON_HUBS: SeasonalHub[] = [
  {
    season: 'autumn',
    hubSlug: 'autumn-pub-event-ideas',
    label: 'Autumn Pub Playbook',
    shortLabel: 'Autumn Playbook',
    dateRange: { startMonth: 9, endMonth: 11 },
    featuredGuides: [
      'wine-tasting-evenings-for-pubs',
      'sober-october-low-no-alcohol-pubs',
      'cask-ale-week-pub-guide',
      'macmillan-coffee-morning-pub-guide',
      'national-drinks-days-pub-guide',
      'autumn-rugby-nations-championship-pubs',
      'black-friday-pub-ideas',
    ],
  },
];

export const getHubBySlug = (slug: string) => SEASON_HUBS.find((h) => h.hubSlug === slug);
export const isHubSlug = (slug: string) => SEASON_HUBS.some((h) => h.hubSlug === slug);
// getHubForDate(month) → the hub whose dateRange covers the month (for the homepage band). Handles wrap-around (winter).
```

- [ ] **1.2 — Surface `featuredGuides`/`seasons` from frontmatter.** In `[slug]/page.tsx` `getMarkdownPost`, read `frontMatterRecord.seasons` and `frontMatterRecord.featuredGuides` the same way it already reads `quickAnswer`/`faqs` (via `getOptionalStringArray`). Add them to `ExtendedBlogPost`. (No loader rewrite — the raw frontmatter is already available on `frontMatterRecord`.)

- [ ] **1.3 — Replace hardcoded autumn constants with the config.** In `[slug]/page.tsx`, delete `AUTUMN_HUB_SLUG`/`AUTUMN_SPOKE_SLUGS`; derive from the config: `const hub = getHubBySlug(post.slug); const isHub = Boolean(hub);` and build `hubSpokes` from `hub.featuredGuides` (preferring the post's own `featuredGuides` frontmatter if present, else the config). Keep the existing behaviour: on a hub, suppress generic related posts and render `SeriesHubGrid`.

- [ ] **1.4 — Parameterise `SeriesHubGrid` from the hub.** Pass `heading`/`listName` from `hub.label` (it already accepts these props). Default copy stays as a fallback.

- [ ] **1.5 — Verify.** `npm run type-check` clean; `npm run build` EXIT 0; the autumn hub still lists the same 7 spokes (check `.next` render / prerender manifest); other posts unaffected. Commit `refactor(hubs): drive the autumn hub from a SEASON_HUBS config`.

**Acceptance:** autumn hub renders identically, now config-driven; adding a hub later = a config entry + a post, no route edits.

---

## Phase 2 — Themed hub UX

**Goal:** Make a hub look like a designed seasonal pillar, not a blog post.

**Files:** Create `src/components/blog/SeasonalHubHero.tsx`, `src/components/blog/SeasonalCalendar.tsx`; modify `globals.css` (theme tokens) + `[slug]/page.tsx`; extend `SEASON_HUBS` with `theme` + `calendar`.

- [ ] **2.1 — Four static season themes.** Define four token sets (accent, soft background, hero gradient) in `globals.css` (Tailwind v4 `@theme`/CSS variables), selected by a `data-season` attribute on the hub wrapper. **Do NOT build classes dynamically** (`bg-${season}` is banned by the design rules and Tailwind purge). Four fixed themes, referenced statically.
- [ ] **2.2 — `SeasonalHubHero`.** Wrap/extend `BlogCategoryHero` with the season theme + a date-range strapline (e.g. "September–November"). Rendered only for hub posts.
- [ ] **2.3 — `SeasonalCalendar`.** Render the hub's `calendar` entries (`{ date, moment, opportunity }[]`, added to the config) as a styled "at a glance" strip, reusing `Grid`/`Card`/design tokens. Replaces the markdown calendar table on the hub.
- [ ] **2.4 — Cross-hub nav.** A "Next: {next season} →" link from the config's ordered seasons, at the foot of the hub.
- [ ] **2.5 — Verify.** Build green; manual render of the autumn hub; check colour-contrast (WCAG AA) on each theme; keyboard focus visible. Commit `feat(hubs): themed seasonal hub template (hero, calendar, cross-hub nav)`.

**Acceptance:** the autumn hub reads as a themed, scannable pillar; the template is season-agnostic (theme + content from config/frontmatter).

---

## Phase 3 — Back-catalogue audit & season tagging

**Goal:** Tag the existing ~70 guides by season so hubs draw depth from current content, and discover which occasions clear the "earns a hub" bar.

**Files:** Create `docs/greene-king-toolkit/back-catalogue-tag-map.md` (review artefact); modify many `content/blog/*.md` (frontmatter `seasons:`); extend hub `featuredGuides`.

- [ ] **3.1 — Audit (subagent-assisted).** Classify every `content/blog/*.md` by season/occasion relevance using a strict relevance bar (genuine seasonal fit only — not "everywhere"). Output `back-catalogue-tag-map.md`: `slug → seasons[] + candidate featured-for + rationale`, and a tally of guides per season/occasion (this is the data for the "earns a hub" decisions). **Human sign-off before applying.**
- [ ] **3.2 — Apply `seasons` tags.** Add `seasons: [...]` frontmatter to the agreed guides (respecting the growth-language + British hooks; re-read files before editing — prettier reformats on commit).
- [ ] **3.3 — Curate `featuredGuides`.** Update each hub's config/frontmatter featured list from the tagged set (curated, ordered headline grid).
- [ ] **3.4 — "More for this season".** On a hub, render an auto-list of season-tagged guides beyond `featuredGuides` (filter `getAllBlogPosts` by `seasons`).
- [ ] **3.5 — Verify.** Build green; hubs show featured + "more for this season"; no guide tagged into an irrelevant hub. Regenerate `build:all` (search/feeds) and commit. Commit `feat(content): season-tag the guide library + more-for-this-season lists`.

**Acceptance:** the library is tagged; the tag tally tells us which occasions justify a hub (Phase 5 input).

---

## Phase 4 — Surfacing layers (discovery)

**Goal:** Make hubs discoverable site-wide. Each task is independently shippable.

- [ ] **4.1 — Footer "Playbooks" column.** Add a `playbooks` array to `content/data/footer.json`; map it as a column in `FooterWrapper.tsx` + `FooterSimple.tsx`. *(Very low effort; site-wide, crawlable.)*
- [ ] **4.2 — Guides-index band.** Add a "Seasonal Playbooks" `<Section>` at the top of `src/app/licensees-guide/page.tsx` (above the post grid), rendering hub cards from `SEASON_HUBS`.
- [ ] **4.3 — Breadcrumb hub level.** In `[slug]/page.tsx`, for a post whose slug is in some hub's `featuredGuides`, build the trail `Home → Licensee's Guide → {hub.shortLabel} → {post}` (both the visual `BlogCategoryHero` breadcrumbs and `BreadcrumbJsonLd`). Add hub paths to `breadcrumbPaths` in `src/components/Breadcrumb.tsx`.
- [ ] **4.4 — Homepage current-season band.** Add a `CurrentSeasonHubBand` component + a `<Section>` to `src/app/page.tsx` that features `getHubForDate(currentMonth)` (the in-season hub), rotating automatically. Guard for "no hub this month" (renders nothing).
- [ ] **4.5 — Nav entry (do when ≥3 hubs).** Add a "Playbooks" item to `content/data/navigation.json`; optionally upgrade `Navigation.tsx` to a dropdown listing the hubs. *(Deferred until there are enough hubs to justify it.)*
- [ ] **4.6 — Verify each.** Build green; links resolve; the homepage band shows the correct season for the current date; mobile + a11y spot-check. Commit per surface (e.g. `feat(hubs): surface playbooks in the footer`).

**Acceptance:** a hub is reachable from the footer (every page), the guides index, its spokes' breadcrumbs, and the homepage in-season — without any guide URL changing.

---

## Phase 5 — Second hub (Winter / Christmas)

**Goal:** Prove the system with a second hub and make the surfacing layer meaningful. **Decision gate:** resolve Winter vs Christmas vs both (design doc §7.2).

- [ ] **5.1 — Hub content + config.** Create the hub post (`content/blog/<slug>.md`) with `hubSeason`, intro, calendar; add a `SEASON_HUBS` entry (theme, dateRange, featuredGuides — drawing on Phase 3 tags, e.g. `christmas-pub-promotion-ideas`, `pub-christmas-bookings-fill-december`, `pub-new-years-eve-planning-guide`); add the `/<season>` redirect in `next.config.js`; SVG + `blog-images.ts`.
- [ ] **5.2 — Tag + cross-link.** Ensure the relevant guides carry the season tag and the hub's `featuredGuides`; cross-hub nav now links autumn ↔ winter.
- [ ] **5.3 — Verify + `build:all` + commit.** As per the content pipeline (hooks, prerender manifest, regenerate search/feeds).

**Acceptance:** two live hubs; the footer/index/nav now list multiple playbooks; the template proved reusable.

---

## Cross-cutting requirements (every phase)
- **No URL changes to guides.** Hubs keep evergreen slugs; QR/short links unaffected.
- **Hooks:** growth-language + British-English checks; prettier + eslint pass (re-read files after a commit — they're reformatted).
- **Static theming only** — no dynamic Tailwind class construction.
- **Verification pipeline** per phase: type-check → build → (hooks via commit) → manual render. Regenerate `build:all` whenever posts/tags change (production build does not).
- **Route changes** (`[slug]/page.tsx`) trigger a `/session-setup partial` docs refresh — note it.
- **Deploy** each phase independently; production deploy stays gated on Peter (indexation).

## Coverage check (vs the design doc)
§1 URL model → Phase 1 (config, no guide URL change) ✔ · §2 tagging model → Phases 1.2 + 3 ✔ · §3 template (hero/calendar/grid/cross-nav/more-for-season) → Phases 2 + 3.4 ✔ · §4 schema (ItemList already built; breadcrumb hub level) → Phase 4.3 ✔ · §5 generalising the autumn build → Phase 1 ✔ · §6 phasing → this plan ✔ · §7 open decisions → flagged at Phases 1 & 5. Surfacing map (footer/index/homepage/breadcrumb/nav) → Phase 4 ✔.

## Execution handoff
Recommended: **subagent-driven, one phase at a time**, reviewing between phases (Phase 1 first; it's the foundation). Phase 3's audit is a natural parallel subagent fan-out with human sign-off before tags are applied. Autumn deploy (Phase 0) is independent — it can ship whenever.
