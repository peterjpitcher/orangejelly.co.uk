# Implementation plan: GSC indexing repairs

**Spec:** `tasks/gsc-indexing/SPEC.md` revision 2
**Written:** 5 September 2026
**Branch:** `fix/gsc-indexing-repairs`, cut from `origin/main`

`origin/main` is `3d801e3f`, which is exactly the deployed production commit. The local
branch `codex/guide-enquiry-conversion` differs from it only by `src/test/anon-access.test.ts`,
two Supabase migration files and documentation, none of which this work touches, so every
line number below holds on `origin/main`. Do not branch from the local branch and do not
sweep its in-flight files into any commit here.

---

## Ownership, decided once

Each file has exactly one owner. This is the part previous drafts got wrong.

| File | Owner |
| --- | --- |
| `src/app/robots.ts`, `scripts/lib/robots-matcher.mjs`, `src/test/robots.test.ts` | WS1 |
| `content/insights/what-is-a-fractional-cmo.md`, `content/insights/ai-for-accountants.md`, `src/components/oj/SiteChrome.tsx`, `src/test/orphan-pages.test.tsx` | WS2 |
| `src/middleware.ts`, `src/middleware.test.ts`, `src/app/dev/components/page.tsx`, `src/app/results/[slug]/page.tsx`, `src/app/growth-problems/[slug]/page.tsx`, `src/lib/route-manifest.js` | WS3 |
| `scripts/synthetic-check.mjs`, `package.json` (lint-staged glob only), `tasks/gsc-indexing/PLAN.md` | WS4 |

WS1, WS2 and WS3 touch disjoint files and run in parallel. **WS4 runs last**, because it is
the single owner of `scripts/synthetic-check.mjs` and it imports the matcher WS1 creates.

## Rules that bind every work stream

- British English. **No em dash (U+2014) anywhere**, including code comments and test names.
- Design tokens only, no raw hex. `cn()` from `src/lib/utils.ts`.
- Stage the exact files you changed. **Never `git add -A`.** `tasks/todo.md` is modified and
  two `tasks/` directories are untracked; leave all three alone.
- Do not pin a test-file count in any assertion. Assert `npm run test:run` exits 0.
- Production HTML has **zero newlines**. `grep -c` returns at most 1 on it. Count with
  `grep -o ... | wc -l`.
- Do not hardcode a `/_next/static` content hash or a deployment id in a test or a script.
  They change on every build.
- Prettier reformats on commit. Match the file's existing style; do not fight the formatter.

---

## WS1. Unblock the rendering assets in robots.txt

**Why:** `Disallow: /_next/` blocks every stylesheet and script chunk, and 394 of the 398
`<img>` elements on the site. `Disallow: /icon` blocks the only favicon the site has, on all
145 pages. `Disallow: /apple-icon` and `Disallow: /opengraph-image` block the icons and the
social image the pages advertise. Spec section 4, P1.

- [x] **1.1** `src/app/robots.ts`: change `disallow` to exactly
      `['/api/', '/admin/', '/private/', '/search-index.json']`. Leave `userAgent`, `allow`
      and the sitemap line untouched.
- [x] **1.2** Replace the file's comment with one that records: what the four removed rules
      were blocking and why that mattered; that nothing under `/_next/` is sensitive because
      it is build output with no published source maps and no server-only value in a client
      bundle; and a one-line reason for each of the four rules that remain, including that
      `/admin/` deliberately does not match the bare `/admin`, which is kept out of the index
      by its own `noindex, nofollow` metadata.
- [x] **1.3** Create `scripts/lib/robots-matcher.mjs`, a Robots Exclusion Protocol matcher
      exporting `parseRobots(text)`, `selectGroup(groups, userAgent)`,
      `isAllowed(text, url, userAgent = '*')` and `explain(text, url, userAgent = '*')`.
      `explain` returns `{ allowed, target, rule, agents }` so a failing assertion can name
      the line that blocked the URL. Required behaviour:
      - Strip comments from `#`, ignore blank and colonless lines, lowercase field names.
      - Consecutive `user-agent` lines share one group. Rules before the first user-agent
        line are ignored. An empty `Disallow:` value is discarded, never treated as a rule
        matching everything.
      - Group selection: longest matching non-`*` agent token by `startsWith`, else the `*`
        group, else null meaning everything is allowed.
      - Patterns: `*` is a wildcard, a trailing `$` anchors to the end, everything else is a
        prefix. Match against `pathname + search`, so `/icon` blocks `/icon.png?abc`.
      - Precedence: longest matching pattern wins; on an exact length tie, allow beats
        disallow.
- [x] **1.4** Create `src/test/robots.test.ts`. It must prove **effective matching**, not
      array membership. Import `robots` from `@/app/robots`, `getBaseUrl` from
      `@/lib/site-config`, and the matcher. Add a local `serialiseRobots(config)` that
      mirrors Next's own serialiser (User-Agent lines, then Allow, then Disallow in array
      order, blank line between groups, Sitemap last), with a comment naming
      `node_modules/next/dist/build/webpack/loaders/metadata/resolve-route-data.js` and the
      pinned `next@14.2.35`.
- [x] **1.5** Test the matcher before trusting it: empty disallow allows everything;
      `Disallow: /` blocks everything; prefix not segment (`/a/` blocks `/a/b`, allows
      `/ab`); longest pattern wins; allow beats an equal-length disallow; `*` wildcard; `$`
      anchor; query is matched (`/icon` blocks `/icon.png?abc`); group specificity and
      fallback; comments; case handling.
- [x] **1.6** Assert the serialised file equals an explicit template literal. Use `toBe`,
      **never `toMatchInlineSnapshot`**, because `vitest -u` would rewrite a snapshot instead
      of failing. `getBaseUrl()` resolves to the production URL under vitest (verified;
      `.env.local` is not loaded), so the sitemap line is stable.
- [x] **1.7** An `ALLOWED` table asserted for both `'*'` and `'Googlebot'`, printing
      `explain(...).rule` on failure, covering at least: a CSS chunk; the same with a `?dpl=`
      query; a JS chunk; a route chunk; a woff2 font; a `/_next/image` URL with an encoded
      `url=` and `w`/`q` params; `/icon.png?<hash>`; `/apple-icon.png?<hash>`;
      `/opengraph-image?<hash>`; `/manifest.webmanifest`; a page URL; `/sitemap.xml`;
      `/llms.txt`.
- [x] **1.8** A coverage guard asserting the `ALLOWED` table still contains every asset kind
      (stylesheet, script, font, optimised-image, favicon, apple-touch-icon,
      open-graph-image, manifest, page, discovery), so a future edit cannot quietly delete a
      whole class.
- [x] **1.9** A `BLOCKED` table asserted for both agents: `/api/`, `/api/events`,
      `/api/admin/enquiries`, `/api/cron/polls`, `/api/preview?secret=x`, `/admin/`,
      `/admin/enquiries`, `/private/`, `/private/anything.html`, `/search-index.json`.
      **Do not include `/api/contact`**; no such route exists, and a table row for a URL that
      is not real teaches the wrong thing.
- [x] **1.10** Structural guards derived from `robots()`: exactly one rule group whose
      `userAgent` is `'*'`; no disallow value contains `*` or `$`; no disallow value is `/`;
      `allow` is exactly `/`. These survive somebody legitimately updating the expected text.
- [x] **1.11** Two trap fixtures serialised through the same helper, proving a membership
      test would not catch either. Trap A: disallow list without `/_next/` but with
      `/*_next*` and `/*.json$`; assert the array lacks `/_next/`, then assert the CSS, JS,
      font and optimiser URLs are still blocked. Trap B: the real `*` group plus a
      `Googlebot` group disallowing `/_next/`; assert the `*` array lacks `/_next/`, then
      assert the CSS URL is blocked for Googlebot and allowed for Bingbot.
- [x] **1.12** Assert `public/robots.txt` does not exist, with a comment that a static file
      there would collide with the metadata route, and that `generateRobotsTxt()` in
      `src/lib/feeds.ts` is an unused second source of robots rules to be removed separately.
- [x] **1.13** **Red before green.** Temporarily restore the four rules, run
      `npx vitest run src/test/robots.test.ts`, confirm it fails naming the CSS, icon,
      apple-icon and opengraph-image rows for both agents, then revert. Record the failure
      output in the PR body. A gate that has never been red is not a gate.

**Known gap to state in the PR, not to fix here:** `check:british-english` only accepts CLI
paths under `content/` plus six named files, so it will not scan the new comment in
`src/app/robots.ts`. Proofread it by hand. `check:growth-language` does receive the file but
blanks comments before matching, so it will not scan it either.

---

## WS2. Give the two orphaned pages real inbound links, and gate it

**Why:** `/fractional-cmo` and `/tools/ai-readiness` are in the sitemap, serve 200, and are
linked from nowhere. Both have never been crawled. Spec section 4, P3.

- [x] **2.1** `content/insights/what-is-a-fractional-cmo.md`: add one paragraph immediately
      after the line beginning `**The underlying problem is that a seat is not a diagnosis.**`
      and before `## What to ask before you hire one`. The link must be a descriptive noun
      phrase, never a call-to-action verb and never a service noun: `/fractional-cmo` uses
      the category language to be found and then argues against the format, so the anchor
      must not read as a service on offer. Draft:

      > We have set the same argument out as a decision on its own page, including the three
      > situations where a fractional CMO genuinely is the right hire:
      > [when a fractional CMO is the right answer, and when it is not](/fractional-cmo).

      **Verify before writing:** `RIGHT_ANSWER` in `src/app/fractional-cmo/content.ts` has
      exactly three entries. Do **not** promise "five questions": this insight already lists
      five questions itself, so that would sell the reader something they have just read.
- [x] **2.2** `content/insights/ai-for-accountants.md`: add one paragraph immediately after
      the line beginning `If those three come back clean and the constraint really is
      production volume` and before `## What we will and will not claim`. Draft:

      > If you would rather work through that as a set of statements than as three questions,
      > the [AI readiness assessment](/tools/ai-readiness) asks twelve of them about how the
      > business actually runs. It takes about two minutes and there is no score at the end.

      **Verify every factual claim against `src/app/tools/ai-readiness/page.tsx` and
      `AiReadinessTool.tsx` before writing it**: the number of statements, the stated
      duration, and whether there is a score. Correct the sentence to match the page rather
      than the page to match the sentence.
- [x] **2.3** `src/components/oj/SiteChrome.tsx`, the footer `columns` array only, **not**
      the header `ITEMS` array: add `{ label: 'AI readiness', href: '/tools/ai-readiness' },`
      to the `Start` column after `Growth problems`.
- [x] **2.4** Same array, `Reading` column: add
      `{ label: 'Fractional CMO', href: '/fractional-cmo' },` after
      `For professional services`. `Reading` rather than `Start` is deliberate: under `Start`
      a bare "Fractional CMO" label reads as a service on offer, which the page exists to
      argue against; under `Reading`, beside "Pubs" and "For professional services", it reads
      as a topic. Add one comment above the first of the two entries saying both fix orphans,
      and note that they sit in **different columns** so the comment does not claim they are
      adjacent. A fourth footer column is not possible: `Footer.tsx:87` hard-codes three link
      tracks.
- [x] **2.5** Create `src/test/orphan-pages.test.tsx`, a deterministic offline link-graph
      gate. No network, no `.next`, no shelling out. Header comment must state the rule and
      its limitation: edges come from the rendered non-dynamic live pages plus every insight
      and guide markdown body, so a page whose only inbound link is a template link on a
      dynamic detail page would be reported, and the fix in that case is to add the template
      as a source.
- [x] **2.6** Mocks, hoisted, copied from `src/test/internal-links.test.tsx` plus one new:
      `@/lib/tracking`; the `react-dom` partial mock supplying `useFormStatus` and
      `useFormState` for `/start-here` and `/contact`; and `next/headers` supplying
      `draftMode: () => ({ isEnabled: false })`, which `src/app/guides/page.tsx` awaits.
- [x] **2.7** Helpers used by both the real assertions and the synthetic ones, so the
      synthetic tests exercise the same code: `normalise(href)` returns null unless the href
      starts with `/`, otherwise strips the fragment and query and any trailing slash except
      the root; `reachableFrom(root, edges)` breadth-first; `orphansIn(targets, edges)`.
- [x] **2.8** A `RENDERED` table of the live non-dynamic pages keyed by the URL each serves,
      and a `NOT_RENDERED` exclusion list with a one-line reason each: `/privacy` (live but
      `sitemap: false`), `/admin` (authenticated), `/availability` (the separate poll
      product), `/dev/components` (development harness, noindex, not in the sitemap).
      `/guides` is async and must be rendered as `render(await GuidesPage())`.
- [x] **2.9** Build the graph in `beforeAll`: render each source, harvest
      `container.querySelectorAll('a[href]')` through `normalise`, then `cleanup()`.
      **Do not wrap a render in try/catch**; a page that fails to load must fail the file
      loudly rather than contribute an empty source. Then add markdown sources: each insight
      as `/insights/<slug>` and each guide as `/guides/<slug>`, scanning the body for
      markdown links and skipping image syntax.
- [x] **2.10** Anti-vacuous guard 1: the rendered source paths plus the exclusion list must
      **exactly equal** the live non-dynamic paths in `ROUTES`. Set equality, not a subset,
      so adding a page forces a conscious choice and deleting one forces a prune.
- [x] **2.11** Anti-vacuous guard 2, floors **measured, not guessed**. Use a per-page floor
      of 12 and a total floor of 800, and put the measurement and its date in a comment.
      **Corrected after delivery:** the figures written here first (a minimum of 13 and a
      total of 959) were taken from a measurement made before the footer entries existed and
      with a different harvest. Re-measured on the shipped branch: the per-page minimum is 25
      anchors, on `/tools/ai-readiness`, and the total is 1,229 edges. The conservative floors
      were kept deliberately, because a floor that ordinary copy editing trips gets raised
      until it means nothing.
- [x] **2.12** Anti-vacuous guard 3: each hub still lists its whole collection, with every
      floor derived from the source collection rather than typed as a number. `/guides` links
      at least as many guide URLs as the sitemap advertises and exactly
      `blogCategories.length` category URLs; `/insights` at least `getAllInsights().length`;
      `/results` at least `CASE_STUDIES.length`; `/growth-problems` at least
      `GROWTH_PROBLEMS.length`.
- [x] **2.13** The gate: every sitemap path has at least one inbound edge from a different
      page, listing any that do not.
- [x] **2.14** Reachability: every sitemap path is reachable from `/`, listing any that are
      not. This is what stops two mutually-linking orphans passing.
- [x] **2.15** A named regression test asserting at least one inbound edge for each of
      `/fractional-cmo` and `/tools/ai-readiness`, titled for the two pages orphaned on
      5 September 2026, so a failure names the history and not just the rule.
- [x] **2.16** Prove the contextual links through the real renderer:
      `markdownToHtml(getInsightBySlug('what-is-a-fractional-cmo').content)` contains
      `href="/fractional-cmo"`, and the same for `ai-for-accountants` and
      `/tools/ai-readiness`. This fails if somebody keeps the footer entry and quietly drops
      the body link.
- [x] **2.17** Two discriminating tests on synthetic edge sets, in the style of
      `route-manifest.test.ts`: `orphansIn(['/', '/a', '/b'], [{from:'/',to:'/a'}])` returns
      `['/', '/b']`; and for `[{'/'->'/a'}, {'/x'->'/y'}, {'/y'->'/x'}]`,
      `orphansIn(['/x','/y'], edges)` is empty while `reachableFrom('/', edges)` is
      `{'/', '/a'}`.
- [x] **2.18** **Mutation proof.** Remove both footer entries and both markdown links, run
      the file, confirm it fails naming exactly `/fractional-cmo` and `/tools/ai-readiness`
      in both the inbound and the reachability assertions, then revert. Separately, delete
      `/insights` from the `RENDERED` table and confirm guard 1 fails. Record both in the PR
      body.

**Note for the PR:** `content/insights` is scanned by `check:claims`, which runs in
`npm run build`. Neither new paragraph carries a figure, so both pass, but any future number
in an insight body fails the build rather than the commit.

---

## WS3. Turn the soft 404s into real ones, and correct two false comments

**Why:** an unknown slug under `/results/`, `/growth-problems/`, `/insights/` or
`/guides/category/` returns HTTP 200 with the root loading fallback and two contradicting
robots tags. `/dev/components` does the same. Spec section 4, P4 and P5.

- [x] **3.1** `src/middleware.ts`: add a `/dev` guard that returns a 404 through the existing
      `applySecurityHeaders` helper when `process.env.NODE_ENV === 'production'`. Place it
      after the retired-content 410 branch and before the guide-category branch. Use
      `NODE_ENV`, not `VERCEL_ENV`, so it matches the guard already inside the page. Do not
      gate it on GET or HEAD: a development-only path serves nothing in production whatever
      the method. Match the `/dev` prefix on a segment boundary so `/development-plan` and
      `/devon` are untouched.
- [x] **3.2** Comment the guard with the reason: a render-time `notFound()` cannot set the
      status on this site, because `src/app/loading.tsx` sits at the app root, so Next 14
      wraps every route in a Suspense boundary and flushes the shell with a 200 before the
      page component runs. Middleware runs before rendering begins.
- [x] **3.3** `src/app/dev/components/page.tsx`: correct the two comments that credit
      `force-dynamic` with returning a real 404 (the file docblock and the docblock above
      `export const dynamic`). Keep the in-page `notFound()` guard as a second layer and say
      so in one line above it. The phrase "returns a real 404" and "return an actual 404"
      must not survive anywhere in the file.
- [x] **3.4** `src/lib/route-manifest.js`: replace the `/dev/components` note with an
      accurate one naming middleware as the source of the 404. Leave `disposition: 'live'`
      and `sitemap: false` exactly as they are. `next.config.js` requires this file at build
      time, so a syntax slip fails the build loudly.
- [x] **3.5** `src/app/results/[slug]/page.tsx`: add `export const dynamicParams = false;`
      beside the existing `generateStaticParams`. `CASE_STUDIES` is a static array with no
      drafts and no redirects, so this carries no trade-off. Comment it with the reason and
      point at `src/app/guides/[slug]/page.tsx` as the precedent.
- [x] **3.6** `src/app/growth-problems/[slug]/page.tsx`: the same, over `GROWTH_PROBLEMS`.
- [x] **3.7** **Do not** add `dynamicParams` to `src/app/insights/[slug]/page.tsx` or
      `src/app/guides/category/[category]/page.tsx`. Insights have a draft workflow that
      `getAllInsights()` filters out, so it would end draft preview; the category route calls
      `permanentRedirect()` for a legacy slug, which would become unreachable. Both are open
      decisions in spec section 7.
- [x] **3.8** `src/middleware.test.ts`: extend the request helper to take a method,
      defaulting to GET so existing call sites are unchanged. Add tests asserting status 404
      for GET, HEAD and POST on `/dev/components`, and for `/dev` and
      `/dev/components/anything`, with `NODE_ENV` stubbed to production.
- [x] **3.9** Assert the 404 carries the security headers, proving it went through
      `applySecurityHeaders` rather than being a bare response.
- [x] **3.10** Assert that with `NODE_ENV` stubbed to development the same request is a 200,
      which is the proof that local development access is preserved. Assert
      `/development-plan` and `/devon` are 200 in production, killing the prefix bug.
- [x] **3.11** Restore the stubbed env after each test. Follow the precedent that actually
      exists in this repo, `src/app/actions/polls.test.ts`, which restores with
      `vi.stubEnv('NODE_ENV', original ?? 'test')`. Confirm the file's existing assertions
      still pass unchanged.
- [x] **3.12** Add the **missing** test for the guide-category legacy-slug redirect in
      `src/middleware.ts`. There is no test for it today, and it is the only cover for
      `/guides/category/social-media` and its siblings. Assert the 308 and the destination
      for at least three legacy slugs from `LEGACY_CATEGORY_REDIRECTS`, and that a canonical
      slug is not redirected.
- [x] **3.13** Add tests asserting the two `dynamicParams` routes now resolve an unknown slug
      at routing time. A unit test cannot prove a status code Next assigns, so assert what is
      testable in vitest (that `generateStaticParams` returns the closed set and that
      `dynamicParams` is exported as `false`), and prove the status live in WS4.
- [x] **3.14** Verify locally with `npm run dev` running: `/dev/components` returns 200 and
      renders specimens on localhost. This must be checked before the increment is called
      done.

---

## WS4. Live verification, and the release runbook

Runs after WS1 to WS3. Single owner of `scripts/synthetic-check.mjs`.

- [x] **4.1** `scripts/synthetic-check.mjs`: import `isAllowed` and `explain` from
      `./lib/robots-matcher.mjs`. Keep the existing `robots does not block the site` check
      exactly as it is.
- [x] **4.2** Add one check, `robots lets Googlebot fetch the rendering assets`. Fetch
      `/robots.txt`, the home page and one guide page. Extract every `/_next/static` URL from
      href and src, every `/_next/image` src, the `icon`, `apple-touch-icon` and `manifest`
      hrefs, and the `og:image` and `twitter:image` values, decoding `&amp;` to `&`.
- [x] **4.3** Anti-vacuous floors **before** any assertion, because a silent extraction
      failure is how this class of check passes while proving nothing: throw unless there are
      at least 15 distinct `/_next/static` URLs from the home page, at least 5 distinct
      `/_next/image` URLs from the guide, and exactly one each of the icon, apple-touch-icon,
      manifest and og:image values.
- [x] **4.4** Assert every extracted URL is allowed for Googlebot, naming the URL and the
      blocking rule on failure; that `/api/`, `/api/admin/enquiries`, `/admin/`,
      `/admin/enquiries`, `/private/` and `/search-index.json` are blocked; and that `/admin`
      and `/` are allowed. Then fetch each distinct extracted asset once and require a 200,
      so the check proves both that Googlebot may fetch it and that it is there.
- [x] **4.5** Add one check, `the component harness is not served in production`, asserting
      `/dev/components` returns 404.
- [x] **4.6** Add one check asserting `/results/no-such-case-study` and
      `/growth-problems/no-such-problem` return 404. Note that the script's `get()` helper
      discards the body for a status of 400 or more, so assert the **status**, not the body;
      if the body is wanted, fetch it separately rather than changing the shared helper.
- [x] **4.7** `package.json` lint-staged: add a glob so `scripts/**/*.mjs` is Prettier
      formatted. The shared matcher is otherwise the only unlinted file in the change set:
      `scripts/` is excluded by `tsconfig.json`, `.mjs` matches none of the existing globs,
      and `next lint` does not reach it.
- [x] **4.8** Run the full gate in order: `npm run lint`, `npm run type-check`,
      `npm run test:run`, `npm run build`. All must exit 0. Note that `npm run lint` prints
      one standing `GoogleTagManager.tsx` warning; that is pre-existing and does not fail.

---

## Release

Deploy only on Peter's explicit yes. Push and open a PR; do not merge to `main`, because a
merge is a production deploy.

- [x] **R1** Commit in four increments, one per work stream, staging exact paths.
- [x] **R2** Push `fix/gsc-indexing-repairs` and open a PR against `main`. Record in the body:
      the files changed and the files deliberately not changed; the red-before-green output
      from 1.13; both mutation proofs from 2.18; the two open decisions from spec section 7;
      and the assumption that `origin/main` is still the deployed commit.
- [x] **R3** After merge, record the deployment id and the production alias. Do not assume
      the newest deployment is the one under test.
- [x] **R4** Run the release checks in spec section 6, items 2 to 10, against that
      deployment. Fetch `/robots.txt` with a cache-busting query string: it is served behind
      the Vercel edge cache with an observed age of hours.
- [x] **R5** Run `npm run check:synthetic`. **Read the named per-check output, not the exit
      code.** One check, `llms.txt describes the current company`, has been failing on
      production since before this branch and cannot pass against the current code: it
      asserts the body contains "growth partner" and no pound sign, while `src/lib/llms.ts`
      contains neither the phrase nor a price-free body, because it interpolates the approved
      £62.50 rate. The script therefore exits 1 on a fully correct release. Expect **16 of 17
      passing, with `llms.txt` the only red**. Anything else red is a real failure and names
      itself, quoting the rule or the status that caused it. Whether llms.txt or the check is
      the stale one is a positioning question for Peter, not a fix to make in passing.
      Then run `npm run check:token-privacy`. Note what
      `check:token-privacy` actually proves: it drives the token routes with synthetic tokens
      and asserts no third-party request is made. It does **not** check the `noindex`
      metadata or the `Referrer-Policy` header, so do not report it as proof of those. The
      robots change cannot affect token privacy in any case, because robots.txt never
      covered those routes.
- [ ] **R6** Peter changes the apex domain redirect to permanent in the Vercel dashboard.
      Record the before and after values. Then verify apex and www, http and https, across
      root, a deep guide path and a query-bearing path, checking the status, that the path
      and query survive, and that there is no loop.
- [~] **R7** Rollback. Code and infrastructure roll back separately and a code revert cannot
      undo a domain setting. Revert the relevant commit for a demonstrated code regression;
      restore the previous domain redirect value for a loop or a lost path. Slow Google
      reporting is not a rollback trigger.
- [ ] **R8** Follow-up at 7, 14 and 28 days: URL Inspection on the two previously orphaned
      pages, and "Page resources" on the home page no earlier than 48 hours after deploy.
      Owner: Peter.

## Out of scope, recorded so it is not rediscovered

- Strengthening the `/insights/*` cluster. Two inbound links is not a defect; every page
  links to `/insights` through the header nav.
- A `/favicon.ico`. Google supports PNG favicons; the existing one only needed crawl access.
- `buildSearchIndex()` in `src/lib/search.ts` omits insights, so site search cannot find
  them. Real bug, separate ticket.
- `generateRobotsTxt()` in `src/lib/feeds.ts`, an unused second source of robots rules.
- The unreachable apex branch in `src/middleware.ts`.
- Draft-mode preview for `/guides/[slug]`, already dead because `dynamicParams = false` pairs
  with a `generateStaticParams` that excludes drafts.
- Anything on `management.orangejelly.co.uk` or `cheersai.orangejelly.co.uk`.
