# Remove more dead components (17 October 2026)

**Goal:** delete the 22 component files that nothing imported on 17 October 2026 (found while
checking PR 105), if each is really unused, plus anything that only they use. Code only, no
data. Branch `chore/remove-more-dead-components`, cut from PR 105's branch at `247529a5` because
both edit the `tailwind.config.js` plugin comment and the shadcn list in
`docs/agent-reference.md`, then rebased onto main `ff548421` once PR 105 merged.

- [x] Confirm each of the 22 is unused: every static, dynamic and re-exported import, `require`
      and `vi.mock` resolved across the repo's 621 code files, plus name and path searches in
      tests, scripts, config, `content/` and docs. None has an importer. The only mentions are
      historical docs, two one-off scripts and three comments in the poll components.
- [x] Find what deleting them leaves with no user: `ui/skeleton.tsx` and `Container.tsx` (only
      `Loading`), `Link.tsx` and `Section.tsx` (only `SeasonalPlaybooksBand`), `ui/label.tsx`
      (only `ui/form`) and `ui/accordion.tsx` (only `FAQAccordionWrapper`, once PR 105 removed
      `FAQItem` and `ui/faq-accordion`); ten Radix packages; the `.transition-normal` rule; the
      accordion keyframes and animations in `tailwind.config.js`. `tailwindcss-animate` stays,
      because `SurveyPlayer.tsx` uses `animate-in fade-in slide-in-from-right-4`.
- [x] Baseline on unchanged code (`247529a5`): lint, type-check, `test:run`, `test:utc`, build;
      snapshot every built page and the compiled CSS.
- [x] Peter approves the list: "Updated list, items 1 to 8 all yes" on 17 October 2026 (the 28
      files, the ten packages, the CSS rule and accordion animation, the plugin comment, the
      shadcn list, three poll comments; push and PR without merging).
- [x] Delete the 28 files and the ten packages; remove `.transition-normal`, the accordion
      keyframes and animations and the `globals.css` comment about them; the plugin comment now
      names the survey player; the shadcn list in `docs/agent-reference.md` is now button, card,
      image, typography; the three poll comments name the shadcn components, not deleted files.
- [x] Lint, type-check, `test:run`, `test:utc`, build; compare the build with the baseline; load
      pages of the production build in a browser.
- [x] PR 105 merged meanwhile: rebase onto main `ff548421`; confirm main's new commits (PRs 104
      and 106) import and name none of the deleted files; rerun all five checks and the build
      comparison against a build of main, each side installed with a clean `npm ci`.
- [x] Commit, staging exact files; push; open the PR.
- [ ] Peter says yes to merging.

**Results (17 October 2026, final commit on main `ff548421`):** lint passes (the one
`next/script` warning in `GoogleTagManager.tsx` predates this change), type-check passes, build
passes with 280 static pages. `test:run`: 129 files, 2,288 passed, 4 skipped. `test:utc`: 129
files, 2,289 passed, 3 skipped. Both match main. Against the build of main: the same 64 routes
and 269 prerendered routes; all 148 prerendered pages render the same markup once scripts and
hashed asset names are set aside; all 122 route handler outputs are byte-identical. The
compiled CSS loses 165 classes, each used only by the deleted files, the same list as against
`247529a5` before the rebase. The comparison flagged two, neither a class in use: the word
"transition" in page text, and `.8rem` from the deleted `text-[0.8rem]` (the live
`min-w-[8rem]` stays). The lockfile loses 23 entries (the ten packages, eight nested copies and
five transitive packages nothing else needs) and adds or upgrades none; after a clean `npm ci`
none of the ten packages is installed. In the final commit's production build, `/`, `/about`,
`/contact`, `/guides`, `/guides/ai-for-pubs`, `/insights`, `/start-here`, `/results` and
`/availability` return 200 with every stylesheet and script loading, and rendering `/`,
`/about`, `/guides/ai-for-pubs` and `/availability` in the browser logs no errors beyond the two
`/_vercel/*` analytics scripts, which exist only on Vercel. `/survey/pub-apps` cannot render
locally ("Surveys need Supabase, and it is not configured"), so the survey player's class
string was checked against the served stylesheet instead: it still gets the `enter`
animation, 0.2s, sliding in from 1rem.

**Left alone:** the historical docs that mention the deleted files (`docs/migration/`,
`docs/reports/`, `docs/ACTION-PLAN.md`, `docs/brand/design-system/`, `seo-overhaul/` and older
`tasks/` notes); the one-off `scripts/add-react-memo.js`, which lists `Link`, `Loading`,
`ProblemCard`, `Section` and `JourneyIcons`, and `scripts/migrate-related-links.ts` with its
README; the `globals.css` note on `[id]` scroll margins, which mentions accordions in general;
the `--radix-` exemption in `scripts/check-design-tokens.mjs`, which no longer matches anything.
**Parked:** `CaseStudySelector.tsx` and `ROICalculator.tsx` are imported only by their own
tests (without them `Grid.tsx` and `AnimatedItem.tsx` lose their last importers);
`@radix-ui/react-dropdown-menu`, `react-popover`, `react-toast` and `react-tooltip` have no
importer; `.transition-slow` has no user; `content/data/related-links.json` is deliberately
unread (`src/lib/article-next-step.ts`).

# Remove dead legacy components (17 October 2026)

**Goal:** delete the nine legacy components in `src/components/` that PR 103 only repointed
from the deleted `/logo.png`, if each is really unused, plus anything that only they use. Code
only, no data. Branch `chore/remove-dead-legacy-components`, from main `26bc4ef2` (after PR 103).

- [x] Confirm each of the nine is unused: every static, dynamic and re-exported import,
      `require` and `vi.mock` resolved across the repo's 635 code files, plus name searches in
      tests, scripts, config, `content/` and docs. Six have no importer. Three do:
      `PerformanceMonitor.tsx` (the root layout and `MarketingChrome`), `SiteLoadingScreen.tsx`
      (re-exported by three `loading.tsx` files) and `Hero.tsx` (imported only by
      `PubServiceLandingPage.tsx`, which nothing has imported since phase 4 on 31 August).
- [x] Find what deleting the six leaves with no user: `TrackedButton.tsx`, `ui/sheet.tsx`,
      `ui/navigation-menu.tsx`, the `@radix-ui/react-navigation-menu` package and the
      `.transition-quick` rule in `globals.css`. `OptimizedImage`, `Heading` and `Text` stay,
      because live files still import them (`OptimizedImage` through `SiteLoadingScreen`).
- [x] Baseline on unchanged code: lint, type-check, `test:run`, `test:utc`, build; snapshot
      every built page and the compiled CSS.
- [x] Delete the nine files, the package and the CSS rule; take the deleted names out of the
      `tailwind.config.js` plugin comment and the shadcn list in `docs/agent-reference.md`.
- [x] Lint, type-check, `test:run`, `test:utc`, build; compare the build with the baseline; load
      seven pages of the production build in a browser.
- [x] Commit, staging exact files (`d0585033`); push; open PR 105.
- [x] Peter approves deleting `Hero.tsx` and `PubServiceLandingPage.tsx`, plus `FAQItem.tsx`,
      `StructuredData.tsx` and `ui/faq-accordion.tsx`, which only they use: "1 yes" on
      17 October 2026. No package, CSS rule or image is left unused by them.
- [x] Delete the five; take `faq-accordion` out of the shadcn list in `docs/agent-reference.md`.
- [x] Lint, type-check, `test:run`, `test:utc`, build; compare the build with the first
      commit's and main's; load nine pages of the production build.
- [x] Commit, staging exact files; push to PR 105.
- [x] Peter says yes to merging PR 105: merged as `ff548421` on 17 October 2026.

**Results (17 October 2026):** lint passes (the one `next/script` warning in
`GoogleTagManager.tsx` predates this change), type-check passes (also with the incremental
cache off), build passes with 280 static pages. `test:run`: 129 files, 2,287 passed, 4 skipped.
`test:utc`: 129 files, 2,288 passed, 3 skipped. Both match the baseline. Against the baseline
build: the same 64 routes and 269 prerendered routes; all 148 prerendered pages render the same
markup once scripts and hashed asset names are set aside; all 122 route handler outputs
(sitemap, robots, feeds, `llms.txt`, share images) are byte-identical. The compiled CSS loses
92 classes, each used only by the deleted files (`!bg-whatsapp`, which the live `Button` uses,
stays). The lockfile loses only the one package entry. In the browser, `/`, `/about`,
`/contact`, `/guides`, `/guides/ai-for-pubs`, `/insights` and `/start-here` return 200 with
every stylesheet and script loading; the only console errors are the two `/_vercel/*`
analytics scripts, which exist only on Vercel.

**Results of the second commit (17 October 2026):** the same checks pass with the same counts.
Against both the first commit's build and main's: the same 64 routes and 269 prerendered
routes, all 148 prerendered pages render the same markup, and all 122 route handler outputs
are byte-identical. The compiled CSS loses 17 more classes, each used only by the deleted
files. The same seven pages plus `/growth-problems` and `/pub-marketing` return 200 with every
asset loading.

**Also changed:** the `tailwind.config.js` comment on `tailwindcss-animate` also named
`ui/tooltip` and `AlertAdapter`, both deleted on 27 August; it now names `ui/dialog` and
`ui/select` only.
**Left alone:** `PerformanceMonitor.tsx` and `SiteLoadingScreen.tsx`, which are live; the
historical docs that mention the deleted files (`docs/migration/`, `docs/reports/`,
`docs/ACTION-PLAN.md`, `seo-overhaul/` and older `tasks/` notes); the one-off
`scripts/add-react-memo.js`, which lists `ServiceCard.tsx`, `Logo.tsx` and `FAQItem.tsx`; the
`tailwind.config.js` comment on the WhatsApp colour, which records why `Navigation` once
hardcoded its hover colour; the fixture path `src/components/StructuredData.tsx` in
`src/test/language-gate-scope.test.ts`, which writes its own file there in a temporary folder
and never reads the real one.

# Remove dead code that points at retired addresses (14 October 2026)

**Goal:** remove code that still points at pages phase 4 retired (`/fix-my-pub`,
`/quiet-midweek-solutions`, `/services` and the rest), found 14 October 2026. Code only, no data;
the redirects in `src/lib/route-manifest.js` stay. Branch `chore/remove-dead-retired-route-code`,
from main `a8747c8f` (after PRs 93 to 96).

- [x] Check the two cleanup branches: `chore/remove-orphaned-retired-files` (data files and
      outreach drafts) and `chore/remove-dead-retired-copy` (homepage components and data files).
      Neither touched these files; both have since merged (PRs 94 and 95).
- [x] Confirm each candidate is dead: static and dynamic imports, `require`, `vi.mock`, tests,
      scripts, config, and whether `seo-overrides.ts` feeds the sitemap, feeds, `llms.txt` or the
      search index (it does not).
- [x] Sweep `src` for every path literal that an emitted redirect catches.
- [x] Baseline on unchanged code: lint, type-check, build, tests in London and UTC.
- [x] Peter approves the list: "1 yes, 2 all, 3 yes, 4 yes" on 14 October 2026, relayed by the
      project management session (the guide bridge; all three pop-ups, their config, exports and
      four WhatsApp messages; twelve overrides; the middleware comment; a leftover-override test;
      push and PR without merging).
- [x] Snapshot every built page's title, description and canonical on main `a8747c8f`.
- [x] Add the test first and watch it fail on the ten redirected overrides.
- [x] Delete the approved code.
- [x] Lint, type-check, build, test:run, test:utc; diff the built metadata against the snapshot.
- [x] Commit, staging exact files (`e5d98f35`).
- [ ] The project management session pushes, opens the PR and merges.

**Results (14 October 2026):** the new test failed on exactly the ten redirected overrides
before the deletion and passes after it (104 entries). Lint passes (the one `next/script`
warning predates this change), type-check passes, build passes with 278 static pages and the
same 91 routes. `test:run`: 129 files, 2,285 passed, 4 skipped. `test:utc`: 129 files, 2,286
passed, 3 skipped. Against a build of main `a8747c8f`, all 147 built pages keep the same title,
description, canonical, Open Graph and Twitter tags, and the sitemap, robots, feeds, `llms.txt`
and share images are byte-identical. The CSS loses 20 classes, each used only by the deleted
pop-ups.

**Also changed:** the `tailwind.config.js` comment listed `MobileScrollPrompt` among the
components that need `tailwindcss-animate`; it no longer names the deleted file.
**Left alone:** the redirects and the tests that check them; `MarketingChrome` and its test,
which checks by wording that the pop-ups stay gone (its sample route `/ways-to-work` now
redirects, which does not matter to what it tests); one-off `scripts/` that name the old pages;
the scan lists in `check-british-english.mjs` and `check-growth-language.mjs`, which still name
two deleted page files. `MESSAGES` in `src/lib/constants.ts` now has no reader at all, because
PR 95 deleted `CTASection.tsx`; it was not on the approved list.

# Remove dead copy that still carries retired claims (14 October 2026)

**Goal:** delete components and data files that no page renders but which still say "All using
AI" and "Featured in BII magazine for AI innovation" (found 13 October 2026). Code and content
files only, no database data. Peter approves the file list once before anything is deleted.
Branch `chore/remove-dead-retired-copy`.

- [x] Confirm each file is unused: static and dynamic imports, `require`, `vi.mock` and runtime
      reads of `content/data` across `src`, `scripts` and config.
- [x] Find what deleting `src/app/HomePage.tsx` leaves with no importer (seven components).
- [x] Baseline on the unchanged branch: lint, type-check, `test:run` and `test:utc` (128 files,
      2,181 passed, 4 skipped), build (278 pages).
- [x] Peter approves the list: "all yes" on 14 October 2026, given in the project management
      session (the six files, the seven components, the comment, push and PR without merging).
- [x] Delete the 13 approved files; note in `src/app/about/content.ts` that `about.json` is gone.
- [x] Lint, type-check, `test:run`, `test:utc`, build; compare the route list with the baseline.
- [ ] Push and open a PR. The project management session reviews and merges.

**Results:** lint and type-check pass (the one `next/script` warning predates this change).
`test:run`: 128 files, 2,181 passed, 4 skipped. `test:utc`: 128 files, 2,182 passed, 3 skipped;
the extra pass is the timezone gate, which runs only under `npm run test:utc`. Build: 278 pages,
the same 91 routes as before, and none of the 147 built pages contains either retired sentence.

**Left alone:** old docs; one-off `scripts/` that name these files; the provenance line in
`tasks/repositioning/copy/about.md`; the `public/partners/` logos, which are public addresses.
**Parked:** the unread `content/data/services/*.json`, `quiet-midweek.json` and old outreach
drafts, now a separate conversation.

# Remove orphaned retired data files and outreach drafts (14 October 2026)

**Goal:** delete files left behind by retired pages and old outreach, found while removing dead
homepage components. Files only, no database data. Branch `chore/remove-orphaned-retired-files`.

- [x] Confirm each candidate is unused: imports, fs reads of `content/`, `package.json` scripts,
      Husky and lint-staged, tests, `next.config.js`. Only the two content gates walk them.
- [x] Baseline on unchanged code: lint, type-check, build, tests in London and UTC.
- [x] Peter approves the deletion list (relayed by the managing session, 14 October): delete the
      seven retired data files and all six Greene King outreach files; keep both partner logos.
- [x] Delete the 13 approved files; mark the deleted drafts in `docs/plans/retired-claims-sweep.md`.
- [x] Lint, type-check, test:run, test:utc, build.
- [x] Commit: the seven data files, then the Greene King drafts with the checklist update.
- [ ] Push and open the PR. The managing session reviews and merges.

**Baseline (14 October 2026, unchanged code):** lint passes (one existing warning,
`src/components/GoogleTagManager.tsx:73`); type-check passes; build passes with 278 static pages;
tests pass in London (2,181) and UTC (2,182). In a fresh worktree `search-index.test.ts` fails
until a build has generated `public/search-index.json`, so run the build before the tests.

**Results (14 October 2026, after the deletions):** identical to the baseline. Lint passes with
the same single warning, type-check passes, build passes with 278 static pages, tests pass in
London (2,181) and UTC (2,182). `public/partners/bii-logo.png` and `greene-king-logo.png` are
kept: sent emails or the Greene King toolkit may link to them.

# Food hygiene guide: three factual corrections (14 October 2026)

**Goal:** correct the re-inspection timing and fee, the display law and the unsourced search figure
in `content/blog/food-hygiene-rating-five-star-guide.md` (tier 3-review: slug and file fixed, body
and FAQ answers may change) without lengthening the guide. Peter approves the exact wording before
any commit. Branch `claude/strange-vaughan-7aa87c` from main `a0d04e57`. The temperature edits on
`claude/determined-lumiere-082716` are uncommitted in another worktree and touch other lines.

- [x] Re-open sources: FSA Brand Standard Revision 8 (Section 8, Q&A 1, 4, 5, 7, 12, 15), Food
      Hygiene Rating (Wales) Act 2013 ss 5, 7, 12, 13, Food Hygiene Rating Act (Northern Ireland)
      2016 ss 3, 4, 7, NI SR 2016/425, gov.uk/food-hygiene-ratings and the FSA re-visit form page.
- [x] Draft the wording: two FAQ answers, the re-inspection section, The bottom line.
- [x] Checks: growth language on the file, British English, lint, tests, build.
- [x] Three-way merge test against the temperature edits.
- [x] Peter approves the wording (14 October, relayed by the managing session).
- [ ] Commit, rerun the checks, push and open the PR. The managing session reviews and merges.

**Results (14 October 2026):** the guide is 26 words shorter (4,240 to 4,214); no passage grew.
Growth-language check on the file, British English, lint (one existing warning in
`GoogleTagManager.tsx`), build (278 pages) and tests in London (2,181) and UTC (2,182) pass. The
first test run failed only on `search-index.test.ts`, because a fresh worktree has no
`public/search-index.json` until the build makes one. `git merge-file` with the temperature edits
over main gives no conflicts. The local page shows the new section, bottom line and both FAQ
answers, and the FAQPage schema carries the new answers.

# BII articles: research and specs (13 October 2026)

**Goal:** Peter asked for research, then one build-ready spec per article, for two printed BII
articles that each link by QR code to a full guide on orangejelly.co.uk. Article 1: AI in
hospitality (500 to 550 words, plus a 300 word option). Article 2: event food compliance and
allergen handling (300 words at most). A separate, less capable agent will write and build from
the specs, so they must stand alone. Branch `docs/bii-article-specs`. Spec and research only: no
article copy, no guide, no redirect and no QR code is created here.

- [x] Read the repo rules a new guide must meet (content gates, front matter, next-step mapping,
      campaign redirects, the BII summer 2026 precedent).
- [x] Web research, one topic per agent: AI tool shortcuts; AI in UK hospitality; AI rules and
      risks; allergen law; event food safety law; the BII and its publication.
- [x] Check the safety-critical legal facts myself against legislation.gov.uk and GOV.UK (the
      Food Standards Agency moved its guidance there from food.gov.uk in June 2026).
- [x] Write `tasks/bii-articles-2026/` with one spec per article and the shared production rules.
- [x] Prove the build recipe in the specs with throwaway stub guides (checks, tests, build), then
      remove the stubs.
- [x] Commit the specs on this branch. Do not push without Peter's say-so.

**Results (13 October 2026):** `tasks/bii-articles-2026/` holds the shared rules (`README.md`), one
spec per article, three small tools (word counter, QR maker, QR reader), a proof of each print
plan and the six research dossiers. Two dry runs, both reverted. In the second, both guides were
built from the specs' own wording and the repo edits were made exactly as the specs describe:
lint, type-check and build passed, and the full suite passed in London (2,187) and UTC (2,188),
128 files each. Every web address in the specs (69) passes the British English and
growth-language gates. All five print blocks pass the word counter. Both QR codes read back to
the right address.

**Found by the dry run:** a guide dated in the future is silently left out of the build while
every test still passes, so a printed short link would lead nowhere. The specs now say so and the
README's first post-build check catches it.

**Not done here, on purpose:** no article copy, guide, short link or QR code exists. That is the
build agent's job, from the specs. OpenAI's help pages refuse automated readers, so the ChatGPT
menu names in Article 1 rest on the research pass reading them in a browser: Peter confirms three
of them on a signed-in account before print. Article 2 needs a food safety check by a qualified
person before it is printed.

## Peter's answers applied (14 October 2026)

Peter answered the seven open questions: the word limits cover the article only; copy deadline
Friday 13 November 2026, first draft wanted this week; printed links go through his
`l.the-anchor.pub` shortener to the standard guide addresses; the bio is approved and The Anchor
is a tenancy, not a lease; the BII verifies Article 2 itself, with a note at the top of the copy;
Article 1 gets his tasting-night example (his idea, which AI makes happen faster); push and open
a PR.

- [x] README: decisions D2 to D4 rewritten for the shortener, D11 and D12 added, the assumptions
      table replaced with his answers, section 6 rewritten (Peter creates the link; `CODE`
      placeholder until he does), the site redirect and its two test edits dropped.
- [x] Prove the replacement test edit: the guide path in `PRINTED` fails the test while the guide
      is missing and passes (25 of 25) once it exists. Reverted.
- [x] `make-qr.py` accepts only `https://l.the-anchor.pub/<code>`; tested with the summer 2026
      code (reads back PASS) and three refusals.
- [x] Article 1: facts T1 to T4 from Peter and The Anchor's event page; locked tasting-night
      section in both print versions; guide section 9 rebuilt around it; Greene King named nowhere.
- [x] Article 2: locked note to the BII with a source per check; Peter's list updated.
- [x] Both proofs re-run: 542, 292 and 292 words, all PASS.
- [x] Commit, push, open the PR: https://github.com/peterjpitcher/orangejelly.co.uk/pull/90

**Left to Peter:** create the two short links (destinations in README section 1), send Article
2 to the BII with its note, and confirm the tasting-night wording.

## Both BII articles written (14 October 2026)

Peter merged PR 90 and asked for the articles to be written.

- [x] Article 1 on `feat/bii-ai-article`: guide `content/blog/ai-for-pubs.md` (2,662 words of
      prose), print copy and handover in `marketing/bii-ai-2026/` (542 and 292 words), wiring.
- [x] Article 2 on `feat/bii-event-food-article`, built on Article 1: guide
      `content/blog/pub-event-food-safety-allergens.md` (3,588 words of prose), print copy with
      the BII note and handover in `marketing/bii-event-food-2026/` (292 words), wiring.
- [x] Sources: every non-OpenAI source read on the day and still says what the guides quote (23
      for Article 1, 33 for Article 2). OpenAI's help pages refused scripts and the browser.
- [x] Lint, type-check, build; tests 128 files in London (2,185) and UTC (2,186); both guides
      built with one H1 and listed in the sitemap.
- [ ] Short links and QR codes: waiting for Peter. Footers say `l.the-anchor.pub/CODE`.
- [ ] Push and open a PR: needs Peter's yes, because merging publishes both guides.

**Found:** the commit hook reformats `article-next-steps.json` to two-space indentation; the spec
length ranges could not include the locked prompts and tables, so both now count prose only.

# Microsoft Clarity back behind consent (1 October 2026)

**Goal:** Peter asked why no Clarity data is arriving. It was blocked on purpose on 22 September
(PR 68) for recording without consent. Bring it back for visitors who accept analytics only.
Branch `feat/clarity-after-consent`.

- [x] Find the cause: `clarity.ms` is absent from the CSP, and the GTM container (version 6) still
      carries three Clarity tags (project `ybvvjuugxb` twice, project `splb2wuxka` once).
- [x] CSP: allow `https://*.clarity.ms` in `script-src` and `connect-src` only.
- [x] Keep GTM, and so Clarity, off `/admin`, and mask the admin screen as a second lock.
- [x] Cookie notice and privacy notice name Clarity; switching analytics off clears its cookies.
- [x] Tests for each of the above.
- [x] Lint, type-check, tests in London and UTC, build.
- [x] Browser check with the real container on a local server.
- [ ] GTM: leave one Clarity tag for `ybvvjuugxb`, pause the other two, publish. Needs Peter's
      Google sign-in, and must happen before this branch is deployed.
- [ ] PR, merge, confirm the production deploy, confirm a recording arrives in Clarity.

**Results (1 October 2026):** lint, type-check and build pass; the full suite passes in London
(2,181) and UTC (2,182). On a local server with the real container: nothing from Google or
Microsoft before a choice; after Accept, Clarity 0.8.70 loads, sets `_clck` and `_clsk` and its
upload returns 204; `/admin` and `/availability/new` load neither GTM nor Clarity with analytics
accepted; switching analytics off clears every cookie and the reload loads nothing.

# Availability poll: production readiness (29 September 2026)

**Goal:** close the four gaps a read-only audit of `/availability` found, then ship. Peter approved
"fix everything ... then deploy" on 29 September 2026. Branch `fix/poll-production-readiness`.

- [x] Digest: nothing ever set `digest_pending_since`, so the "new responses" email never sent.
      Mark it on every vote and edit, send lazily with an atomic claim (SPEC §4.2), and have the
      cron flush through the same code.
- [x] Unsubscribe: `List-Unsubscribe` pointed at a route that did not exist. Add the one-click
      POST route, a GET that lands on the organiser page, an on/off control there, and a visible
      link in the digest and nudge bodies.
- [x] Verification email failure: the organiser was told "we've sent your links" when nothing
      went. Say so on screen, keep the resend control, test with a failing sender.
- [x] Admin gate: `/api/admin/polls` and `/api/admin/stats` inline their own bearer check. Move
      both to `requireAdmin`; the polls dashboard lists only the signed-in admin's own polls,
      which is what its copy ("every poll you have set up") already says.
- [x] Lint, type-check, tests in London and UTC, build.
- [ ] PR, merge, confirm the production deploy, probe the live routes.

**Results (29 September 2026):** lint, type-check and build pass; the full suite passes in London
and UTC (117 files, 2,000 tests, 4 skipped). New tests cover the digest trigger and its window,
the one-click route, the email switch, the failed-email screen and the admin poll filter.

**Not done here, on purpose:** a live test poll on production. Creating one needs the Turnstile
bot check, which an agent must not complete, so it is left for Peter.

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
- [x] Verify the deployed release and its canonical production domain.
- [ ] Obtain explicit permission for a real test message and confirm inbox receipt.

Status: pilot live on deployment dpl_HwdsuBMwuJJkyAjMdP9WUScR8Cod. Final release verified. Real test enquiry and inbox receipt await explicit permission. Broader rollout follows the specified 28-day review. No migration drafted or applied.

## Digital growth offer plan, 5 September 2026

- [x] Incorporate the agreed websites, applications, connected systems and useful AI positioning.
- [x] Incorporate five Keyword Planner rounds with demand and intent limitations.
- [x] Write the follow-on plan in `tasks/plan-2026-09-05-digital-growth-offer.md` and connect the original enquiry plan.
- [x] Validate page ownership, search intent and public project evidence.
- [x] Implement the approved messaging and commercial destinations after authorisation.
- [x] Verify enquiry journeys, release identity and measurement baseline.

Status: implementation live as dpl_Qnjnu9oeg4HmnDTa9tNJZ3aaziEh, commit 3d801e3f86f8088b9e3adc33085ff820fa461bfb. No migration. Fixture enquiry checks passed; real inbox receipt remains unverified pending explicit permission. Future measurement reviews are not scheduled.


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


## Promote the pub-apps survey across the site, 22 September 2026

**Ask (Peter):** a primary nav link, a popup or lightbox on all pages, and champion it
everywhere, the homepage included. Branch `feat/survey-promotion`, worktree
`.claude/worktrees/survey-promotion`.

**Decisions (mine, to confirm with Peter in the PR):**
- One switch, `src/lib/promoted-survey.ts`: set it to null and the nav item, footer link,
  bands and popup all come down together when the survey closes.
- The popup checks the survey is still live before it opens and fails closed.
- It waits until the cookie choice is made, opens after 8 seconds, and once seen stays away for
  14 days (never again after "Take the survey" or a visit to the survey).
- Desktop gets a centred lightbox. Phones get a small card at the bottom, because Google demotes
  pages whose popups cover the content on phones and most search visits are on phones.
- Not shown on the survey itself, the back office or the enquiry page (/start-here).

- [ ] Config, nav item (highlighted), footer link, survey page marks itself current
- [ ] SurveyBand on the homepage, Pubs page and guides library
- [ ] Status endpoint and the SurveyPrompt popup in MarketingChrome
- [ ] Tests, copy-doc amendments, type-check, lint, both test zones, build, screenshots


## Square share cards on the new brand, 26 September 2026

Peter: "The opengraph images look horrible. Can you fix them so they're square and use our
new logo/branding?" Branch `feat/square-share-cards`, worktree `.claude/worktrees/share-cards`.

What production sent before the change (crawl of all 145 sitemap URLs, 26 September):
104 guides sent their 1600x900 hero photo; 28 pages (about, contact, results, growth
problems, insights and more) sent no og:image at all, because a page-level `openGraph`
replaces the root layout's and none of them re-declared `images`; 9 guide listing pages
sent `og-default.jpg`, the retired "AI-Powered Marketing for UK Pubs" picture; the home page
and three solutions pages sent the 1200x630 orange card with a system font and no logo.

- [x] Crawl production and record what every URL sends.
- [x] Extract Schibsted Grotesk (the site's face, SIL OFL) from the build cache as static
      700 and 900 TTFs, so the cards can use it without a network fetch.
- [x] Design panel: four square directions rendered and judged for brand fit, phone-preview
      legibility and 1.91:1 crop survival. The judges split three ways; the chosen layout is the
      colour-block anatomy (orange header, cream page, ink footer) with their grafts.
- [x] One shared card renderer (fonts, logo, palette, 1200x1200) in `src/lib/share-card/`.
- [x] Default card (`app/opengraph-image.tsx`), survey card, and a per-guide card
      (`app/guides/[slug]/opengraph-image.tsx`) built at build time.
- [x] Every page that sets `openGraph` declares the default card; `metadata.ts` default and the
      guides listing stop using `og-default.jpg`; twitter images follow og via Next's autofill.
- [x] Guard test so a page cannot set `openGraph` without an image again; palette pinned to
      the tokens; the card renders at 1200x1200; logo and title measured inside the safe band.
- [x] Lint, type-check, tests (London and UTC), build; crawl the local production build: all
      148 pages send one 1200x1200 PNG og:image and twitter:image that loads.
- [x] Adversarial review (four reviewers, each finding verified): 11 confirmed and fixed,
      notably versioned card URLs, lowercase display type (D10) and the kern feature
      removed from the fonts.
- [x] PR #77 merged on Peter's yes. The Vercel preview built but was not crawled: it is
      behind Deployment Protection and Peter declined a standing bypass secret.
- [x] Production verified: all 147 pages (145 sitemap URLs plus the survey and privacy
      pages) send one versioned 1200x1200 PNG og:image with a matching twitter:image,
      the survey card is drawn on Vercel with the survey's real question, and the
      deployment logged no runtime errors.

Status: live on deployment dpl_A9mKeE4ryRjQuUngsh1JyL5a7NPd, merge commit
520e6fa52dc6013b54832c003c470fbaa04c6176. No migration.
