# Autumn Pub Playbook — Website Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the complete Autumn Pub Playbook — the hub plus all eight deep-dive guides — live on orangejelly.co.uk, with the QR/redirect tracking working, so the Greene King autumn toolkit can point pubs to it.

**Architecture:** Markdown posts in `content/blog/*.md` are auto-discovered by `src/lib/blog-md.ts` (`fs.readdirSync`) and rendered at `/licensees-guide/[slug]`. The hub interlinks its spokes (hub-and-spoke). A `/autumn` redirect in `next.config.js` injects the campaign UTM. Deployed on Vercel; analytics via GTM/GA4.

**Tech Stack:** Next.js 15 App Router, markdown + `gray-matter`, TypeScript, Tailwind, Vercel, GTM/GA4.

**Verification model (read first):** these are content pages, not unit-tested functions — this repo has no test convention for blog posts. So each task is verified with the project's real content quality gates: `npm run build` (page generates), a **fact grep** (only verified stats/dates), `npm run type-check`/`npm run lint` for code edits, and a link check (every internal link resolves to an existing `content/blog/*.md`). Discipline is unchanged: write → verify → commit, small commits, exact paths, no placeholders.

**Scope:** complete and deploy all website content (Phase 1 is already built locally; Phase 2 is the four remaining guides; then go-live). **Out of scope (next milestone):** reviewing/finalising the printed toolkit — we do that *after* all content is live.

---

## Current state

- **Phase 1 — built locally, verified, not deployed:** hub `autumn-pub-event-ideas` + guides `wine-tasting-evenings-for-pubs`, `sober-october-low-no-alcohol-pubs`, `cask-ale-week-pub-guide`; 4 SVGs; `blog-images.ts` mappings; cross-links in `pub-event-ideas.md` + `seasonal-pub-events-calendar.md`; `/autumn` redirect. Build was green; all four routes in the prerender manifest.
- **Phase 2 — to build (this plan):** four guides + images + mappings + rugby cross-links.
- **Go-live — to do (this plan, gated):** regenerate search/feeds, deploy preview → production (production = indexation = needs Peter's explicit go).

---

## File Structure

| File | Create/Modify | Responsibility |
|---|---|---|
| `content/blog/macmillan-coffee-morning-pub-guide.md` | Create | Phase-2 guide: Macmillan daytime fundraiser |
| `content/blog/national-drinks-days-pub-guide.md` | Create | Phase-2 guide: Vodka/G&T/Champagne days |
| `content/blog/autumn-rugby-nations-championship-pubs.md` | Create | Phase-2 guide: autumn rugby bookings |
| `content/blog/black-friday-pub-ideas.md` | Create | Phase-2 guide: gifting/deposits + St Andrew's |
| `public/images/blog/<slug>.svg` ×4 | Create | Brand share image per guide |
| `src/lib/blog-images.ts` | Modify | Map the 4 new slugs → SVGs |
| `content/blog/pub-six-nations-rugby-marketing.md` | Modify | Reciprocal link to the autumn-rugby guide |
| `content/blog/autumn-pub-event-ideas.md` | Modify | Repoint hub rugby link to the new guide |

---

## Shared guide-authoring standard (every Phase-2 guide uses this)

**Voice:** warm, plain-English, operator-to-operator, second person ("you/your pub"), British English, encouraging, practical, scannable (H2/H3, short paragraphs). No fluff, no jargon. Match the two reference posts for tone: `content/blog/pub-event-ideas.md` and `content/blog/pub-halloween-bonfire-night-events.md`.

**Hard rules:**
- British English throughout.
- **Do not invent statistics.** Use only the verified facts listed in each task. Attribute exactly.
- The Anchor: keep qualitative; the only approved metrics are those in `CLAUDE.md`'s metrics list (e.g. value-added £75k–£100k, quiz 25–35 regulars). Never fabricate numbers.
- One short responsible-retailing line where alcohol/events are involved (Challenge 25 / Drinkaware; check premises licence / Temporary Event Notice with the council ≥4 weeks ahead for fireworks, extended hours, ticketed or outdoor events).
- Length ~1,300–1,800 words of prose, plus a repeated `## FAQs` text block (house style).

**Frontmatter template** (fill the `<…>` fields; keep fixed values verbatim):
```yaml
---
title: "<title>"
slug: "<slug>"
publishedDate: 2026-05-25
excerpt: "<150-160 chars; doubles as meta description>"
quickAnswer: "<40-60 words answering the title question>"
author: "Peter Pitcher"
category: "events"
featuredImage: "/images/blog/<slug>.svg"
tags:
  - "<tag>"
status: "published"
metaDescription: "<150-160 chars>"
keywords:
  - "<keyword>"
hasFAQs: true
hasQuickAnswer: true
localSEO: {"localModifiers":["near me","local","in my area","UK"],"nearbyLandmarks":["London","Surrey","Staines"],"targetLocation":"United Kingdom"}
voiceSearchQueries:
  - "<query>"
faqs:
  - question: "<q>"
    answer: "<2-3 sentences>"
ctaSettings:
  ctaType: "contact"
  ctaHeading: "<heading>"
  ctaButtonText: "Book a Growth Fix"
  ctaButtonLink: "/ways-to-work/growth-fix"
schema:
  "@context": "https://schema.org"
  "@type": "Article"
---
```

**SVG template** (1200×630; swap `<TITLE>` and `<SUBTITLE>`; long titles ~64px, short ~92px):
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="<TITLE> — Orange Jelly">
  <rect width="1200" height="630" fill="#EA580C"/>
  <rect x="0" y="0" width="1200" height="8" fill="#006064"/>
  <rect x="0" y="622" width="1200" height="8" fill="#006064"/>
  <text x="600" y="300" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="76" font-weight="700" fill="#FFFFFF"><TITLE></text>
  <text x="600" y="368" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="34" fill="#FFFFFF" opacity="0.92"><SUBTITLE></text>
  <text x="600" y="560" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="26" letter-spacing="3" fill="#FFFFFF" opacity="0.85">ORANGE JELLY</text>
</svg>
```

---

## Task 0: Branch + commit the built Phase 1

**Files:** none new (commits existing local Phase-1 work onto a branch, leaving unrelated working-tree changes untouched).

- [ ] **Step 1: Create the feature branch**

```bash
cd /Users/peterpitcher/Cursor/OJ-OrangeJelly.co.uk
git checkout -b feat/autumn-toolkit-2026
```

- [ ] **Step 2: Stage ONLY the autumn files** (do not `git add -A` — the tree has unrelated pre-existing changes)

```bash
git add \
  content/blog/autumn-pub-event-ideas.md \
  content/blog/wine-tasting-evenings-for-pubs.md \
  content/blog/sober-october-low-no-alcohol-pubs.md \
  content/blog/cask-ale-week-pub-guide.md \
  public/images/blog/autumn-pub-event-ideas.svg \
  public/images/blog/wine-tasting-evenings-for-pubs.svg \
  public/images/blog/sober-october-low-no-alcohol-pubs.svg \
  public/images/blog/cask-ale-week-pub-guide.svg \
  src/lib/blog-images.ts \
  content/blog/pub-event-ideas.md \
  content/blog/seasonal-pub-events-calendar.md \
  next.config.js \
  docs/greene-king-toolkit/
```

- [ ] **Step 3: Verify the staged set is correct**

Run: `git status --short` → Expected: only the files above staged (prefixed `A`/`M`); the unrelated pre-existing modifications remain unstaged.

- [ ] **Step 4: Commit**

```bash
git commit -m "feat(content): add Autumn Pub Playbook hub + Phase-1 guides + tracked /autumn redirect

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 1: Macmillan Coffee Morning guide

**Files:**
- Create: `content/blog/macmillan-coffee-morning-pub-guide.md`
- Create: `public/images/blog/macmillan-coffee-morning-pub-guide.svg`
- Modify: `src/lib/blog-images.ts`

**Verified facts (use only these):** Macmillan's World's Biggest Coffee Morning 2026 is **Friday 25 September 2026** (the last Friday of September; Macmillan stress you can host on any day). Official sign-up/fundraising pack: macmillan.org.uk/coffee-morning. Do not invent fundraising totals.

**Internal links (must resolve):** `/licensees-guide/how-to-run-successful-pub-events`, `/licensees-guide/autumn-pub-event-ideas` (hub), `/ways-to-work`.

- [ ] **Step 1: Create the SVG** — use the SVG template with `<TITLE>` = `Macmillan Coffee Morning` (font-size 60), `<SUBTITLE>` = `Fill a quiet daytime, do some good`. Write to `public/images/blog/macmillan-coffee-morning-pub-guide.svg`.

- [ ] **Step 2: Add the image mapping** — in `src/lib/blog-images.ts`, inside the "New articles (2026 — Autumn toolkit)" block, add:

```ts
    'macmillan-coffee-morning-pub-guide': '/images/blog/macmillan-coffee-morning-pub-guide.svg',
```

- [ ] **Step 3: Write the guide** to `content/blog/macmillan-coffee-morning-pub-guide.md` using the shared standard. Specifics:
  - `title`: "How to Host a Macmillan Coffee Morning in Your Pub"
  - `slug`: `macmillan-coffee-morning-pub-guide`
  - keywords/tags around: "macmillan coffee morning", "pub fundraising event", "pub coffee morning", "community pub events"
  - 4 `voiceSearchQueries` (e.g. "when is the macmillan coffee morning 2026", "how do I host a coffee morning in my pub", "pub charity event ideas", "how to raise money for charity in a pub")
  - 4 `faqs`: "When is the Macmillan Coffee Morning 2026?" (answer states Fri 25 Sep 2026 + you can host any day), "How do I host one in a pub?", "How does a coffee morning make money for a wet-led pub?", "Do I need anything official to fundraise?" (point to macmillan.org.uk pack)
  - `ctaHeading`: "Want help filling your quiet daytimes?"
  - Outline: why daytime trade is the gap; the date + that you can flex it; a simple run-sheet (coffee + cake, a raffle, a donation jar, a community-group tie-in); making it pay for a wet-led pub (footfall, food attach, regulars' goodwill); promoting it (local groups, socials, GBP); turning it into a repeating community fixture. Link `how-to-run-successful-pub-events` for the ops basics and the hub.

- [ ] **Step 4: Verify**

Run: `npm run build 2>&1 | grep -c "Compiled successfully\|EXIT"` then confirm the page exists:
`grep -o "licensees-guide/macmillan-coffee-morning-pub-guide" .next/prerender-manifest.json`
Expected: the slug prints (page generated). And fact check:
`grep -n "25 Sep\|Friday 25" content/blog/macmillan-coffee-morning-pub-guide.md` → date present and correct.

- [ ] **Step 5: Commit**

```bash
git add content/blog/macmillan-coffee-morning-pub-guide.md public/images/blog/macmillan-coffee-morning-pub-guide.svg src/lib/blog-images.ts
git commit -m "feat(content): add Macmillan Coffee Morning pub guide

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: National drinks days guide (Vodka / G&T / Champagne)

**Files:**
- Create: `content/blog/national-drinks-days-pub-guide.md`
- Create: `public/images/blog/national-drinks-days-pub-guide.svg`
- Modify: `src/lib/blog-images.ts`

**Verified facts:** National Vodka Day = **Sun 4 Oct 2026**; International Gin & Tonic Day = **Mon 19 Oct 2026**; International Champagne Day = **Fri 23 Oct 2026** (official 4th-Friday rule) — frame as a **Champagne Weekend, Fri 23–Sat 24 Oct**. No other hard stats.

**Internal links:** `/licensees-guide/pub-drinks-menu-design-guide`, `/licensees-guide/autumn-pub-event-ideas` (hub), `/ways-to-work`.

- [ ] **Step 1: Create the SVG** — `<TITLE>` = `Autumn Drinks Days` (72px), `<SUBTITLE>` = `Vodka, gin and champagne moments`. Write to `public/images/blog/national-drinks-days-pub-guide.svg`.

- [ ] **Step 2: Add the image mapping** in `src/lib/blog-images.ts`:

```ts
    'national-drinks-days-pub-guide': '/images/blog/national-drinks-days-pub-guide.svg',
```

- [ ] **Step 3: Write the guide** to `content/blog/national-drinks-days-pub-guide.md`. Specifics:
  - `title`: "Vodka, Gin and Champagne Days: Easy Autumn Drinks Activations"
  - `slug`: `national-drinks-days-pub-guide`
  - tags/keywords: "national vodka day", "gin and tonic day", "champagne day", "pub drinks promotion"
  - 4 `voiceSearchQueries` (e.g. "when is national vodka day 2026", "international gin and tonic day 2026", "when is champagne day 2026", "pub cocktail promotion ideas")
  - 4 `faqs` with the three dates stated exactly + "how do I run a low-effort drinks day in a pub?"
  - `ctaHeading`: "Want a drinks offer that lifts spend?"
  - Outline: why single-serve "drinks days" are low-effort, high-margin hooks; **National Vodka Day (4 Oct)** — Bloody Mary brunch, a signature martini, a vodka cocktail special; **Gin & Tonic Day (19 Oct)** — a G&T board, a local gin spotlight, tonic/garnish pairings; **Champagne Weekend (23–24 Oct)** — fizz by the glass, a sparkling tasting, premium "small wins"; how to run any of them in one shift (one featured serve, one chalkboard, one social post); pricing for margin; link `pub-drinks-menu-design-guide` and the hub. Responsible-retailing line.

- [ ] **Step 4: Verify**

`npm run build` → EXIT 0. Then:
`grep -o "licensees-guide/national-drinks-days-pub-guide" .next/prerender-manifest.json` → prints.
`grep -n "4 Oct\|19 Oct\|23.*24 Oct\|23 Oct" content/blog/national-drinks-days-pub-guide.md` → all three dates present and correct. Confirm **no** "Sat 24" stated as Champagne *Day* (it's the weekend, day is 23rd).

- [ ] **Step 5: Commit**

```bash
git add content/blog/national-drinks-days-pub-guide.md public/images/blog/national-drinks-days-pub-guide.svg src/lib/blog-images.ts
git commit -m "feat(content): add national drinks days pub guide (vodka, gin, champagne)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Autumn rugby (Nations Championship) guide

**Files:**
- Create: `content/blog/autumn-rugby-nations-championship-pubs.md`
- Create: `public/images/blog/autumn-rugby-nations-championship-pubs.svg`
- Modify: `src/lib/blog-images.ts`

**Verified facts:** The new **Nations Championship** launches in 2026 and **replaces the standalone Autumn Internationals**. November window **6–21 Nov**; **Finals Weekend at Twickenham, Fri 27–Sun 29 Nov 2026**. Home-nation November fixtures (per the published schedule — add the line *"Fixtures correct at the time of writing (last checked 30 May 2026); confirm kick-off times nearer the date"*):
- Fri 6 Nov — Ireland v Argentina (Aviva)
- Sat 7 Nov — Scotland v New Zealand (Murrayfield); Wales v Japan (Principality)
- Sun 8 Nov — England v Australia (Twickenham)
- Sat 14 Nov — Wales v New Zealand; England v Japan; Ireland v Fiji
- Sun 15 Nov — Scotland v Australia
- Sat 21 Nov — England v New Zealand; Ireland v South Africa; Scotland v Japan; Wales v Australia
- Fri 27–Sun 29 Nov — Finals Weekend, Twickenham

**Internal links:** `/licensees-guide/pub-six-nations-rugby-marketing`, `/licensees-guide/nobody-books-tables-anymore`, `/licensees-guide/autumn-pub-event-ideas` (hub), `/ways-to-work`.

- [ ] **Step 1: Create the SVG** — `<TITLE>` = `Autumn Rugby 2026` (76px), `<SUBTITLE>` = `Fill your pub for the Nations Championship`. Write to `public/images/blog/autumn-rugby-nations-championship-pubs.svg`.

- [ ] **Step 2: Add the image mapping** in `src/lib/blog-images.ts`:

```ts
    'autumn-rugby-nations-championship-pubs': '/images/blog/autumn-rugby-nations-championship-pubs.svg',
```

- [ ] **Step 3: Write the guide** to `content/blog/autumn-rugby-nations-championship-pubs.md`. Specifics:
  - `title`: "Autumn Rugby 2026: Filling Your Pub for the Nations Championship"
  - `slug`: `autumn-rugby-nations-championship-pubs`
  - tags/keywords: "autumn rugby", "nations championship", "rugby in pubs", "showing rugby in your pub"
  - 4 `voiceSearchQueries` (e.g. "when is the rugby on in November 2026", "nations championship fixtures 2026", "how do I get my pub busy for the rugby", "rugby finals weekend 2026")
  - 4 `faqs`: "What is the Nations Championship?" (new in 2026, replaces standalone Autumn Internationals, finals at Twickenham 27–29 Nov), "When are the November rugby fixtures?", "How do I get bookings for the rugby?", "Do I need anything to show rugby in my pub?" (commercial sports subscription + correct licensing — keep general, advise checking their provider)
  - `ctaHeading`: "Want your screens booked out this November?"
  - Outline: November is a rugby month and the new format means a big game most weekends; the fixture grid (above, with the "last checked" caveat); take **table bookings before kick-off** (link `nobody-books-tables-anymore`); match platters/packages; a screen/sound checklist; the Finals Weekend angle; converting rugby crowds into Christmas bookings (bridge to the hub). Cross-link the existing `pub-six-nations-rugby-marketing` as the year-round rugby playbook. Responsible-retailing line.

- [ ] **Step 4: Verify**

`npm run build` → EXIT 0. Then:
`grep -o "licensees-guide/autumn-rugby-nations-championship-pubs" .next/prerender-manifest.json` → prints.
`grep -n "27.*29 Nov\|Twickenham\|6.*21 Nov\|last checked" content/blog/autumn-rugby-nations-championship-pubs.md` → finals dates, venue, window and the caveat all present.

- [ ] **Step 5: Commit**

```bash
git add content/blog/autumn-rugby-nations-championship-pubs.md public/images/blog/autumn-rugby-nations-championship-pubs.svg src/lib/blog-images.ts
git commit -m "feat(content): add autumn rugby / Nations Championship pub guide

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Black Friday + St Andrew's Day guide

**Files:**
- Create: `content/blog/black-friday-pub-ideas.md`
- Create: `public/images/blog/black-friday-pub-ideas.svg`
- Modify: `src/lib/blog-images.ts`

**Verified facts:** Black Friday = **Fri 27 Nov 2026**; Cyber Monday = **Mon 30 Nov 2026**; St Andrew's Day = **Mon 30 Nov 2026** (Cyber Monday and St Andrew's genuinely share the day). No other hard stats.

**Internal links:** `/licensees-guide/christmas-pub-promotion-ideas`, `/licensees-guide/pub-christmas-bookings-fill-december`, `/licensees-guide/autumn-pub-event-ideas` (hub), `/ways-to-work`.

- [ ] **Step 1: Create the SVG** — `<TITLE>` = `Black Friday for Pubs` (68px), `<SUBTITLE>` = `Gift cards and bookings, not discounts`. Write to `public/images/blog/black-friday-pub-ideas.svg`.

- [ ] **Step 2: Add the image mapping** in `src/lib/blog-images.ts`:

```ts
    'black-friday-pub-ideas': '/images/blog/black-friday-pub-ideas.svg',
```

- [ ] **Step 3: Write the guide** to `content/blog/black-friday-pub-ideas.md`. Specifics:
  - `title`: "Black Friday for Pubs: Gift Cards and Bookings, Not Discounts"
  - `slug`: `black-friday-pub-ideas`
  - tags/keywords: "black friday pub", "pub gift cards", "cyber monday pub", "st andrews day pub"
  - 4 `voiceSearchQueries` (e.g. "what should a pub do for black friday", "pub gift card ideas", "when is st andrews day 2026", "how to fill christmas bookings")
  - 4 `faqs` with the dates + "should a pub discount on Black Friday?" (no — protect margin; sell gift cards/deposits) + a St Andrew's question
  - `ctaHeading`: "Want a Christmas booking machine, not a discount war?"
  - Outline: why blanket discounting kills margin; the late-November conversion window (Black Friday 27 Nov → Cyber Monday + St Andrew's 30 Nov); **sell gift cards, take Christmas party deposits, push a January bounce-back voucher**; limited table packages instead of price cuts; **St Andrew's Day (Mon 30 Nov)** Scottish specials (haggis bon bons, whisky flight, Scottish beer, a Scotland quiz); bridge to Christmas (link `christmas-pub-promotion-ideas` and `pub-christmas-bookings-fill-december`) and the hub. Responsible-retailing line.

- [ ] **Step 4: Verify**

`npm run build` → EXIT 0. Then:
`grep -o "licensees-guide/black-friday-pub-ideas" .next/prerender-manifest.json` → prints.
`grep -n "27 Nov\|30 Nov\|St Andrew" content/blog/black-friday-pub-ideas.md` → dates present.

- [ ] **Step 5: Commit**

```bash
git add content/blog/black-friday-pub-ideas.md public/images/blog/black-friday-pub-ideas.svg src/lib/blog-images.ts
git commit -m "feat(content): add Black Friday + St Andrew's Day pub guide

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Wire up the rugby cross-links

**Files:**
- Modify: `content/blog/autumn-pub-event-ideas.md` (repoint hub rugby link to the new guide)
- Modify: `content/blog/pub-six-nations-rugby-marketing.md` (reciprocal link to the new guide)

- [ ] **Step 1: Repoint the hub's rugby link.** In `content/blog/autumn-pub-event-ideas.md`, replace the interim link:

Find: `(Our [pub rugby marketing guide](/licensees-guide/pub-six-nations-rugby-marketing) has the booking and match-day playbook.)`
Replace with: `(Our [autumn rugby playbook](/licensees-guide/autumn-rugby-nations-championship-pubs) has the fixtures, booking terms and match-day checklist.)`

- [ ] **Step 2: Add the reciprocal link.** Open `content/blog/pub-six-nations-rugby-marketing.md`, read it, and add one contextual sentence/link in the intro or a "See also" near the top:
`For the autumn internationals specifically, see our [Autumn Rugby 2026 guide](/licensees-guide/autumn-rugby-nations-championship-pubs).`

- [ ] **Step 3: Verify links resolve**

```bash
for s in autumn-rugby-nations-championship-pubs pub-six-nations-rugby-marketing; do test -f "content/blog/$s.md" && echo "OK $s" || echo "MISSING $s"; done
```
Expected: `OK` for both. Then `npm run build` → EXIT 0.

- [ ] **Step 4: Commit**

```bash
git add content/blog/autumn-pub-event-ideas.md content/blog/pub-six-nations-rugby-marketing.md
git commit -m "feat(content): link hub + six-nations post to the autumn rugby guide

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Full content verification (all 8 pages)

**Files:** none (verification only).

- [ ] **Step 1: Build + confirm all 8 pages generate**

```bash
npm run build > /tmp/oj-build.log 2>&1; echo "EXIT=$?"
grep -oE "licensees-guide/(autumn-pub-event-ideas|wine-tasting-evenings-for-pubs|sober-october-low-no-alcohol-pubs|cask-ale-week-pub-guide|macmillan-coffee-morning-pub-guide|national-drinks-days-pub-guide|autumn-rugby-nations-championship-pubs|black-friday-pub-ideas)" .next/prerender-manifest.json | sort -u | wc -l
```
Expected: `EXIT=0` and a count of **8**.

- [ ] **Step 2: Type-check + lint**

```bash
npm run type-check && npx eslint src/lib/blog-images.ts
```
Expected: clean (the only `blog-images.ts` change is added string entries).

- [ ] **Step 3: Fact sweep — no forbidden stat anywhere in the new content**

```bash
grep -rn "28%" content/blog/macmillan-coffee-morning-pub-guide.md content/blog/national-drinks-days-pub-guide.md content/blog/autumn-rugby-nations-championship-pubs.md content/blog/black-friday-pub-ideas.md || echo "clean"
```
Expected: `clean`.

- [ ] **Step 4: Internal-link check** — every internal link in the new posts points to a real post or page. Run `/link-review` (skill) on the eight new/changed posts, or:

```bash
grep -ohE "/licensees-guide/[a-z0-9-]+" content/blog/autumn-pub-event-ideas.md content/blog/macmillan-coffee-morning-pub-guide.md content/blog/national-drinks-days-pub-guide.md content/blog/autumn-rugby-nations-championship-pubs.md content/blog/black-friday-pub-ideas.md | sort -u | while read p; do s=${p##*/}; test -f "content/blog/$s.md" && echo "OK $s" || echo "CHECK $s"; done
```
Expected: `OK` for blog targets (note `/ways-to-work*` are app routes, not blog files — those are fine; verify they exist under `src/app/`).

- [ ] **Step 5: Commit** (if Step 1–4 surfaced fixes; otherwise skip). Use a `fix(content):` message.

---

## Task 7: Regenerate search + feeds

**Files:** none authored (verifies the new posts flow into on-site search + RSS).

- [ ] **Step 1: Run the full build**

```bash
npm run build:all 2>&1 | tail -20; echo "EXIT=${PIPESTATUS[0]}"
```
Expected: EXIT 0; search index + feeds regenerate without error.

- [ ] **Step 2: Confirm the production build does the same.** Check `package.json` `scripts.build` and any Vercel build-command override. If the deployed build runs only `next build` (not search+feeds), the live search/RSS won't include the new posts — update the build command to `npm run build:all` (or `build:search && build:feeds && build`). Note the finding; change only if needed.

---

## Task 8: Preview deploy + review

**Files:** none.

- [ ] **Step 1: Push the branch**

```bash
git push -u origin feat/autumn-toolkit-2026
```

- [ ] **Step 2: Get the Vercel preview URL** (auto-created for the branch) and click through: the hub, all 8 guides render with images, internal links work, and `<preview>/autumn` redirects to the hub with the UTM query.

- [ ] **Step 3: Mobile + a11y spot-check** the hub + one guide (headings, alt text, contrast, tap targets).

- [ ] **Step 4: Peter + Charlotte review** the preview. Capture any copy fixes → apply as `fix(content):` commits and re-push.

---

## Task 9: Production deploy (GATED — Peter's explicit go)

**Files:** none. **This step makes the pages public/indexable — do not proceed without Peter's confirmation.**

- [ ] **Step 1: Confirm go-live** with Peter (production deploy = indexation).

- [ ] **Step 2: Merge to production**

```bash
git checkout main
git pull
git merge --no-ff feat/autumn-toolkit-2026
git push origin main
```
(Vercel deploys `main` to production.)

- [ ] **Step 3: Verify live** — `https://www.orangejelly.co.uk/licensees-guide/autumn-pub-event-ideas` loads; `https://www.orangejelly.co.uk/autumn` 307s to the hub with `utm_campaign=autumn-2026`.

- [ ] **Step 4: Confirm the shortlink + QR resolve.** Scan/open `https://l.the-anchor.pub/c0l05s` → lands on the live hub. Confirm GA4 shows the `autumn-2026` campaign (real-time) and the shortener logs the scan.

- [ ] **Step 5: Tell Peter it's live** so he can send Charlotte the toolkit copy + the QR brief to the agency.

---

## Coverage check (self-review)

- Spec §7.3 Phase-2 guides → Tasks 1–4 ✔ · §7.6 rugby reciprocal + hub repoint → Task 5 ✔ · §7.5 images/mappings → in each task ✔ · §7.7 QR/redirect/tracking → verified Task 8/9 ✔ · §9 DoD "before go-live" (build:all, preview, production, QR/GA4, mobile/a11y) → Tasks 6–9 ✔ · git standards (branch, selective add, no force-push) → Tasks 0/8/9 ✔.
- No forbidden-stat reintroduction: enforced by the shared standard + Task 6 Step 3.
- All internal links target existing pages: enforced by Task 6 Step 4.

## Next milestone (out of scope here)
Once all content is live and verified, switch focus to **reviewing and finalising the printed toolkit** ([`autumn-2026-toolkit-copy.md`](./autumn-2026-toolkit-copy.md)) with Charlotte — proofing, the OJ byline/sponsorship level, logo placement, and the agency's QR build.
