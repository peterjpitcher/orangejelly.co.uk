# Renaming and de-sectoring /licensees-guide

Costing and planning only. Nothing in this document has been implemented. Written 31 Aug 2026.

---

## 1. The short answer

Renaming the URL and restyling the pages is a medium job, roughly a week of focused engineering, and it is safe. Switching the hospitality terms to small business terms across the articles is a different job entirely, it is months of editorial work, and for about half the library it is impossible: no rewrite turns a guide to cellar management or brewery ties into small business content. The cost is dominated by that third piece, and the single biggest risk is that it takes the search traffic with it, because the section earns 900 of the site's 978 annual clicks (92.0%) and it earns them on pub vocabulary.

The QR codes are not the blocker they look like. Every printed code we can find in the repo encodes a short alias or an external shortener you control, not an article URL, and those were built precisely so the destination could be repointed without reprinting. One document is the exception and only you can tell us whether it went to print.

---

## 2. The thing to decide first

A large share of the 105 articles are irreducibly about running a pub. Every one of them says "pub" at least 7 times, 3,845 times in total, median 32 per article, maximum 115. Classified individually with no remainder:

| Bucket | Articles | Words | Annual clicks | Share of blog clicks |
|---|---|---|---|---|
| (a) Irreducibly hospitality. The sector is the subject. | 52 | 113,662 | 712 | 79.4% |
| (b\*) Universal argument wrapped around a hospitality-only core that has to be rebuilt, not word-swapped | 28 | 59,477 | 104 | 11.6% |
| (b) Universal, with pub nouns, examples and arithmetic | 25 | 45,313 | 81 | 9.0% |
| (c) Already generic | 0 | 0 | 0 | 0% |

Bucket (a) is titles like "Cellar Management", "PRS and PPL Music Licensing for Pubs", "The Complete Guide to Pub Leases, Tenancies and Brewery Ties", "Wet-Led vs Food-Led Pubs", "Pub Licensing Explained". There is no small business equivalent of a brewery tie. All five of your top posts sit in bucket (a) and they are 49.8% of the site's clicks between them.

So the real question is which of these you are asking for.

**Option A. Rename and restyle. Keep the hospitality content, label it honestly.**
The URL stops saying "licensee", the pages get the oj design system, the section chrome (title, nav, footer, category descriptions, index copy, meta) becomes sector-neutral, and hospitality is declared as a sector facet on the index and on each card rather than hidden.
Cost: phases 1 to 3 below, roughly a week of engineering plus a day of copy.
Gets you: a URL and a navigation that no longer put off a non-hospitality visitor, a section that matches the rest of the site visually, and 100% of the search traffic intact.
What it does not get you: content a plumber or an accountant would read.

**Option B. Option A, plus a content programme that adds non-hospitality articles alongside.**
Cost: Option A plus writing. Worth knowing before you commission it: this programme already exists. `/insights` is the generic collection, it holds 4 professional services articles, and it earns zero rows in the August Search Console export. The constraint on it is not the container, it is that nobody has written the articles.
Gets you: a genuinely mixed library over time.

**Option C. Option A, plus de-sectoring the existing 105 articles.**
Cost: bucket (b) is a full editorial pass per article, roughly 5 weeks. Bucket (b\*) is a rebuild per article, roughly 6 weeks. Bucket (a) cannot be edited at all, so "de-sectoring" it means writing 113,662 words of replacement content, and deleting the originals costs 712 clicks a year. Every file touched also inherits two more rewrites that ride along: 104 of 105 articles are written in your first person, which D47 rules out for the site, and 74 name The Anchor as the provenance for a claim, which CLAIMS.md requires to be stated.
Gets you: nothing measurable that Option A does not, at 10 to 20 times the cost and with most of the organic traffic at risk.

**Option D. Do nothing to the URL. Change the label and the on-page copy only.**
There is a precedent in the codebase: `/growth-problems` kept its URL while its navigation label moved to "Unlock growth", on the reasoning that the redirect cost bought nothing a visitor would notice. The counter-argument here is that a URL is customer-facing copy whether we treat it that way or not. It appears in every shared link, every browser bar and on anything printed.

**Recommendation: Option A, now. Then Option B as a standing content commission through `/insights`, and merge `/insights` into the renamed section once it has more than four articles in it.** Option A is bounded, reversible, and does not touch a single ranking signal. Option C should be declined for buckets (a) and (b\*) outright, and considered for bucket (b) only article by article, if ever.

One thing to note either way: this reverses a decision already recorded three times. D1 says "Existing URLs stay live. No pub or hospitality URL is retired... Hospitality becomes a contained sector hub inside the new IA." `src/lib/route-manifest.js` line 111 says "Path does not change: it carries 897 of the site's 969 annual clicks." `IMPLEMENTATION-SPEC.md` says moving it "would risk the only search asset the company has". Those were all written about moving the content into a hospitality hub, not about renaming the container, and D39 is the direct precedent for what you are asking (you approved renaming `/pub-rescue` to `/why-revenue-is-falling` on exactly this reasoning). But the reversal should be recorded as a new decision rather than left to drift.

---

## 3. The QR codes

### What we know

Three printed artefacts are documented in the repo, and two of them are already safe by design.

| Artefact | What the code encodes | Exposure |
|---|---|---|
| BII summer magazine | `https://www.orangejelly.co.uk/summer` (short alias, 307) | None. Only the destination moves. |
| Greene King autumn toolkit | `https://l.the-anchor.pub/c0l05s`, your own shortener, landing on `orangejelly.co.uk/autumn` | None. Repointable outside this repo. |
| Greene King Christmas toolkit | `/christmas` alias exists in the manifest; the artwork is not in the repo | Almost certainly the same pattern, unverified |
| `docs/charlotte/rhythm-of-the-week-toolkit.md` | Six raw article URLs: `/licensees-guide/{boardgame-night-101, quiz-night-101, karaoke-night-101, music-bingo-101, cash-bingo-101, family-craft-hour-101}` | **This is the only exposed set.** |

The three aliases (`/autumn`, `/christmas`, `/summer`) are declared as temporary 307s on purpose. The manifest comment says why: "They are seasonal and repoint each year, so a permanent redirect would tell Google a mapping is final when it is not." The BII handover note says the same thing in plain terms: "the destination can be repointed each year without reprinting the code." That pattern is correct and must not be tidied into 308s.

The printed human-readable URL on the Greene King sheet is `orangejelly.co.uk/autumn`, on the apex rather than www. The apex already 308s to www before anything else runs, so a typed apex URL takes one extra hop today and would take one more after a rename.

One already-sent artefact, `content/greene-king-email-v2.html`, links to the section index. A bare-path redirect covers it.

### What only you can tell us

1. Did the Charlotte "Rhythm of the Week" toolkit go to print with those six deep-link QRs, or did the agency substitute a shortener?
2. Is there anything printed that the repo does not record? The Greene King artwork was produced by their agency, so this repository is not a complete inventory.
3. How long do the printed items stay in circulation? A magazine back issue and a laminated table talker have very different lifespans, and that decides whether "permanent" means five years or twenty.

### What a permanent redirect does and does not guarantee

A 308 keeps the old URL resolving and passes ranking signals to the new one. That is all. It does not protect you if the destination is later deleted, if the rule is removed in a future tidy-up, or if the destination itself becomes a redirect and the scan takes three hops. Every hop is another chance to lose a scan on a poor mobile connection in a pub car park, and the rule becomes maintenance the company carries indefinitely.

**The safest pattern for anything printed is the one you already use: never print a content URL.** Print a short vanity path (`/autumn`) or an external shortener you control (`l.the-anchor.pub/...`), keep it a 307, and repoint it whenever the content moves. If the Charlotte toolkit did go out with deep links, the mitigation is a permanent wildcard that ships in the same commit as the rename, commented as load-bearing so nobody deletes it, and a standing rule that no future printed material carries a content URL.

---

## 4. What it would take

Five phases. Phases 1, 2 and 3 are independent and can ship in any order or separately. Phase 4 is the expensive one and is not recommended.

### Phase 0. Decisions and safety net. Half a day.

- Record the reversal of D1 as a new decision.
- Reissue `tasks/repositioning/data/baselines/protected-posts-2026-08-27.json` with the new URLs **before** the rename ships. It holds 30 posts keyed by absolute `/licensees-guide/...` paths and `scripts/monitor-protected-posts.mjs` matches on them. If it is not reissued first, `npm run monitor:posts` reports all 30 protected posts as gone and gives you 30 false alarms and no signal for the weeks you most need it.
- Decide whether the renamed section joins `scripts/check-positioning.mjs` SURFACES. It currently exempts the hospitality section and bans `/for (?:pubs|hospitality)/gi`. A section renamed to read as generic stops being obviously exempt, and the answer changes the cost of phase 3.

### Phase 1. The rename and the redirects. Two days including verification.

What changes:

| Surface | Size |
|---|---|
| `src/lib/seo-overrides.ts` | 104 path keys, pure prefix replacement, no canonicals declared |
| `content/blog/*.md` internal links | 475 links across 102 files, 94 distinct targets, zero absolute URLs |
| `src/` | 236 occurrences across 45 files, of which 12 are tests |
| `scripts/` | 26 occurrences across 14 files |
| `content/data/` | 10 occurrences (navigation 4, footer 3, related-links 3); two of the footer three are the Autumn and Christmas Playbook deep links |
| Tracked feed artefacts | `public/rss.xml` 40 and `public/feed.json` 164 |
| Route files | 4 files move: index (423 lines), `[slug]` (789), `BlogPostClient`, `category/[category]` (179) |
| `src/middleware.ts` | 17 legacy category redirects, the `/licensees-guide/category/` prefix, and a 410 gate on two README paths |
| Route manifest | 2 new wildcard entries, 8 existing live rules touching the section |

Live URL count is 113: the index, 104 articles (105 markdown files less `cash-flow-crisis-breaking-cycle`, which already redirects to `/fix-my-pub`), and 8 category pages.

Five traps that are easy to walk into:

1. **`getRedirectedGuideSlugs()` hardcodes the prefix and filters out wildcard patterns** (`route-manifest.js`, `!p.includes(':')`). It is what stops the sitemap advertising the guide slugs that redirect, and it is consumed by `src/app/sitemap.ts`. Move the manifest entries and not this constant and it returns an empty array, silently. No test catches it, because the sitemap test only checks the static route list.
2. **Redirect ordering.** `getRedirectsForPhases` emits in declaration order and Next matches first-wins. A wildcard declared before the five exact old-slug rules swallows them, and four of those slugs have no content file, so they would land on new-prefix 404s. The chain test finds chains, not shadowing.
3. **`route-manifest.test.ts` line 227** hardcodes `target.startsWith('/licensees-guide/')` as always-serves-200. After the rename that assertion waves through anything.
4. **Nothing tests the 475 markdown links.** `internal-links.test.tsx` renders a hardcoded list of React pages and never reads `content/blog`. Either a link-resolution check gets written as part of this phase, or 475 rewrites are verified by eye.
5. **Nothing runs the test suite automatically.** `npm run build` runs six content gates and `next build`, no vitest. There is no CI workflow and no pre-push hook. The chain test is a manual gate, so it has to be run deliberately.

Also: `public/rss.xml` and `public/feed.json` are only regenerated by `npm run build:feeds`, which is not inside `npm run build`. They will ship stale unless `npm run build:all` is run on purpose, and RSS item GUIDs are the article URLs, so the rename re-delivers every item to existing subscribers.

Three test files break usefully and need updating in the same commit: `route-manifest.test.ts`, `internal-links.test.tsx` (asserts the homepage links to `/licensees-guide`) and `main-gate.test.tsx` (mocks a guide article path).

### Phase 2. The restyle. Two to three days.

Nothing needs building. Every component is already written and exported from `src/components/oj/editorial.tsx`: FAQ, Toc, CategoryTag, ArticleCard, Pagination, Tabs, NextStep, plus Breadcrumb. `/insights` is a working reference implementation and its article page is 190 lines against the guide article page's 789.

The header and footer chrome has already migrated on two of the three routes. The category route has not: it imports no oj components at all. What is left is 15 legacy components in `src/components/blog/` (1,675 lines) and the three route files.

The one decision buried in here: the blog's 8 categories (events 32, operations 23, marketing 20, turnaround 14, revenue-growth 12, people 2, property 1, food-drink 1) do not map onto the oj taxonomy's 7 hues (demand, conversion, margin, operations, experience, scale, hospitality). Three blog categories hold two articles or fewer. Restyling forces that mapping; the rename alone does not.

### Phase 3. The chrome terminology. One day.

This is the honest reading of "switch hospitality terms to small business terms": the words a visitor sees before they open an article.

- The section display name appears 27 times across 16 files, not the handful it looks like.
- Five of the eight category descriptions in `src/lib/blog.ts` carry pub language ("Day-to-day pub management", "brewery relations", "empty pub recovery"). The category names themselves are already generic.
- The index page title, subtitle and its JSON-LD.
- The author byline is hospitality vocabulary sitting in structured data: "Licensee of The Anchor... Helping pubs thrive with proven strategies" appears in 8 places and renders as Person schema on all 105 article pages. It is already non-compliant with D47 and with section 34's warning on "help", so it needs rewriting regardless of this project.
- Roughly 104 meta descriptions if you want them neutral, though this is the point where phase 3 starts becoming phase 4, and I would leave article-level metadata alone.

Two pieces of hygiene worth folding in while these files are open: `content/blog/pub-drinks-menu-design-guide.md` line 260 publishes the "60 to 70K monthly social media views" figure that CLAIMS.md line 43 retires with "DO NOT USE"; and `STALE-GUIDE-LINKS.md` records 26 in-article links across 26 files pointing at pages that redirect at phase 4.

### Phase 4. Article-body de-sectoring. Not recommended. Months.

Bucket (b) at 25 articles is roughly 5 weeks, bucket (b\*) at 28 articles is roughly 6 weeks, bucket (a) at 52 articles cannot be done. Beyond the word count, three things make this worse than it looks:

- The vocabulary is not decoration, it is the ranking surface. 78 of the 102 indexed article URLs carry a hospitality word in the slug and they earn 859 of 897 clicks (95%). 90% of `voiceSearchQueries` and 82% of `keywords` in the frontmatter are hospitality terms, and all 105 articles emit FAQPage schema built from 503 questions of which 384 are hospitality.
- 351 worked examples are built on pub arithmetic (covers, spend per head, wet and dry GP, price per pint). Those need new numbers, not new nouns.
- Half-doing it is worse than either extreme. An article titled for small business that still says "cellar" in paragraph four ranks for neither audience.

### Phase 5. Merge `/insights`. Separate decision, half a day of engineering.

If it happens, it runs guides-ward: folding 4 insights articles into the renamed section costs 4 URL moves and carries no print exposure, where the reverse costs 113. See section 5.

---

## 5. Naming

**Recommended: URL `/guides`, navigation label "Guides", page title `guides.`**

The path is free: no route, and no `/guides` string anywhere in `src`, `content`, `public` or `next.config.js`. The navigation already says "Guides" (`SiteChrome.tsx` line 85), so the header needs no change and the URL would finally agree with the label. It matches the house pattern exactly, where `/insights` renders `insights.` as a lowercase heading. It says what the thing is rather than who it is for, it is sector-neutral without claiming to be about small business generally, and at 7 characters it is the shortest candidate, which matters for anything printed. It is not on section 34's warning list.

Runners-up and why they lost:

| Candidate | Why not |
|---|---|
| `/growth-guides` | Strongest positioning fit (section 33 lists Growth first, and it ties to the `/growth-problems` spine both collections map to), but it is brand-inward language and twice the length. |
| `/playbooks` | The content genuinely is playbook-shaped and the repo already uses the word. But it is borrowed consultancy language, and section 32 says the brand must not sound management-consultancy heavy. |
| `/small-business-guides` | The most literal reading of your brief, and the one the content contradicts most directly with 3,845 mentions of "pub" behind it. Also the longest to print. |
| `/sectors/hospitality` | Structurally the most honest name for the content that exists, and closest to D1's sector-hub model, but it moves the URL further into hospitality, which is the opposite of what you asked for. |
| `/resources`, `/knowledge-hub`, `/knowledge-base`, `/academy`, `/library`, `/blog` | Corporate-dead, support-desk, implies a course, describes a container with no promise in it, or a route the site has deliberately never used. |

### Should this section and /insights stay separate?

Probably not, but not yet. The split is real in the code (`collection` is a required, validated frontmatter field, and the loader hard-codes the guide URL shape, so a shared loader is genuinely unsafe today) and it was a deliberate choice, not an accident. But from a visitor's side it is two doors to one room with unhelpful signs on both: 105 articles against 4, one navigation slot each out of seven, and both named by format so nobody can tell an insight from a guide.

My recommendation is to keep them separate through phases 1 to 3, then merge guides-ward once `/insights` has enough articles to be worth merging. Merging now removes a navigation item you recently asked to have added, and it merges four articles into 105, which changes nothing a visitor would notice.

---

## 6. What we would not do

- **We would not convert `/autumn`, `/christmas` or `/summer` to permanent redirects while tidying the redirect table.** They are 307 on purpose. Permanence is what stops them being repointed next year without reprinting the codes.
- **We would not print a content URL on anything, ever again.** Short alias or shortener only.
- **We would not rewrite the article bodies.** For 52 of them it is impossible, for the rest it is months of work that risks 92% of the site's search traffic and buys nothing measurable.
- **We would not neutralise the article frontmatter.** The `voiceSearchQueries`, `keywords` and FAQ questions are the relevance signal, not decoration.
- **We would not ship the rename, the restyle and the terminology change in one release.** If traffic moves, nothing would tell you which of the three caused it, and the rollback would be all or nothing.
- **We would not run a bulk find-and-replace across `content/blog`.** The pre-commit hooks reject certain language and non-British spelling and reformat on commit, so a scripted 105-file pass will not land in one go, and 91 distinct hospitality tokens means a partial pass leaves residue in almost every file.
- **We would not rename the section without reissuing the protected-posts baseline first.** The instrument that would tell you whether the rename cost anything is the instrument the rename disables.
- **We would not retire the 62 zero-click articles as a batch.** `TIER-THREE-RUBRIC.md` already scopes this properly, expects "zero or one post out of 75", and names the real blocker, which is that there is no backlink data in the repo and nothing should be scored until there is.

---

## 7. Open questions

1. **Which option is this, A, B, C or D?** Recommendation: A now, B as a standing commission through `/insights`. C should be declined; it costs months and risks most of the search traffic for nothing a visitor gains.
2. **Did the Charlotte "Rhythm of the Week" toolkit go to print with those six raw article QR codes, or did the agency use a shortener?** Recommendation: tell us either way, because if it did we ship a permanent wildcard in the same commit as the rename and comment it as load-bearing; if it did not, the QR constraint costs nothing at all.
3. **Is there any printed material the repo does not record?** Recommendation: assume yes and treat the wildcard as permanent regardless, since it is one line and costs nothing.
4. **New URL: `/guides`?** Recommendation: yes. The navigation already says "Guides", the path is free, and it is the shortest thing to print.
5. **Do you want the restyle (phase 2) even if you decide against the rename?** Recommendation: yes, and it can ship first. It is independent, it is the piece with no search risk at all, and the category route is currently the last page on the site with none of the new design system on it.
6. **Should the renamed section join the positioning language gate?** Recommendation: yes. If it is called something generic it should be held to the generic copy rules, which mostly means the section chrome, not the articles.
7. **Should `/insights` merge into the renamed section?** Recommendation: not yet. Revisit once it has more than four articles; merging four into 105 changes nothing a visitor would notice and removes a navigation item you recently asked for.
8. **Can we commission a one-off backlink export from any tool?** Recommendation: yes, half an hour with a trial account. It is the single strongest input to the redirect-permanence decision and no audit has ever had one.