# Google Search Console indexing, triage and repair spec

**Property:** `sc-domain:orangejelly.co.uk` (domain property)
**Report snapshot:** Page indexing, last updated 28 August 2026
**Discovery:** 5 September 2026
**Revision:** 2, 5 September 2026. Corrected against an independent developer review
(`tasks/seo-powerhouse/2026-09-05-gsc-spec-review/developer-review.md`) and a verification
sweep that re-checked every contested claim against the code and production.

**Status:** approved for implementation. The plan is `tasks/gsc-indexing/PLAN.md`.

---

## 1. Headline

The 28 August report lists 81 not-indexed URLs. **Seventy-eight of them need no action from
this repository.** Three point at live defects, and the verification sweep found two more
defects the report does not show at all, one of which is the most valuable item in the set.

| | Count | Disposition |
| --- | --- | --- |
| Other products on other subdomains | 22 | Out of scope here. Log with their owners. |
| Legacy paths that already 308 since the 31 August release | 55 | No action. Will reclassify on recrawl. |
| Host canonicalisation rows | 3 | **2 are a live defect:** the apex serves 307, not a permanent redirect. |
| Blocked build asset | 1 | **Live defect:** robots.txt blocks the CSS, JS and images Google needs. |
| **Total** | **81** | |

Not in the report, found by inspection:

- **Two live pages have never been crawled.** `/fractional-cmo` and `/tools/ai-readiness`
  are in the sitemap, serve 200, and have zero inbound internal links from any of the 145
  sitemap pages. Both inspect as "Discovered, currently not indexed", last crawl N/A,
  discovered via sitemap.xml only.
- **Four dynamic route families answer soft 404s.** An unknown slug under `/results/`,
  `/insights/`, `/growth-problems/` or `/guides/category/` returns HTTP 200 carrying the
  root loading fallback, with contradictory robots directives in the same document.

---

## 2. Why most of the report is noise

**The property is a domain property.** `sc-domain:orangejelly.co.uk` covers www, the apex,
http, https and every subdomain. Three other products account for 22 rows:

| Host | What it is | Rows |
| --- | --- | --- |
| `management.orangejelly.co.uk` | AnchorManagementTools (separate repo) | 18 |
| `cheersai.orangejelly.co.uk` | CheersAI (separate repo) | 3 |
| `links.auth.orangejelly.co.uk` | Resend email click tracking | 1 |

**The data predates the release.** The report was last updated 28 August 2026.
Repositioning phase 4 shipped 31 August: the `/licensees-guide` to `/guides` rename, the
`/services` and `/ways-to-work` retirement, `/capabilities` to `/solutions`. Fifty-five rows
are old paths that release turned into 308s.

All 55 were followed on production on 5 September: **every one terminates in a 200.** The
two rows the report calls 404s, `/licensees-guide/kitchen-nightmares-chef-quits` and
`/licensees-guide/brewery-tie-improve-your-deal`, now 308 to live `/guides/` articles.

Verified example of the pattern: `/licensees-guide/pub-health-safety-checklist` sits in
"Crawled, currently not indexed", while `/guides/pub-health-safety-checklist` inspects as
"URL is on Google, Page is indexed". The old URL is the duplicate. That is the rename
working.

**Row-level inventory.** The eight category counts sum to 81 (14 + 9 + 8 + 5 + 1 + 23 + 21 + 0).
Every category's row list matches its count. The 81 partition without overlap or remainder
into 22 non-website rows and 59 marketing-website rows (55 legacy, 3 root variants, 1 build
asset). The arithmetic was audited independently.

---

## 3. Category by category

### Page with redirect, 14

| URLs | Verdict |
| --- | --- |
| 6 x `/licensees-guide/*` (articles and category pages) | Intended 308 from the rename |
| 3 x `/services*` | Intended phase 4 retirement |
| 2 x `/pub-marketing-{kent,hertfordshire}` | Intended county consolidation |
| `http://www.orangejelly.co.uk/` | 308 to https, correct |
| `http://orangejelly.co.uk/`, `https://orangejelly.co.uk/` | **Defect. See P2.** |

Verified chain on 5 September:

```
http://orangejelly.co.uk/  =308=>  https://orangejelly.co.uk/  =307=>  https://www.orangejelly.co.uk/  =200
```

The 307 holds on every path tested (`/`, `/about`, `/guides`, `/pub-marketing`), preserves
path and query byte for byte, and is unchanged under a Googlebot user agent.

Seven of the legacy category rows now resolve through a two-hop 308 chain, for example
`/licensees-guide/category/toolkits` to `/guides/category/toolkits` to
`/guides/category/events`. Chains are tolerated by Google and these are not worth collapsing
for seven URLs with no traffic, but the fact is recorded rather than left to be rediscovered.

### Blocked by robots.txt, 9

Eight are `management.orangejelly.co.uk/events/*`. Correct, no action here.

The ninth is `https://www.orangejelly.co.uk/_next/static/css/f62ad9e515a7337d.css`. It is the
visible tip of the largest defect in this set. See P1.

### Excluded by 'noindex', 8

All eight are `management.orangejelly.co.uk`. Correctly noindexed. Nothing on this site.

### Not found (404), 5

Two are legacy `/licensees-guide/` paths, already fixed by the rename and verified live.
Three are `cheersai.orangejelly.co.uk/{settings,dashboard,auth/login}`. Whether those three
are correct is a question for whoever owns CheersAI; nothing in this repository serves them.

### Blocked due to other 4xx, 1

`https://links.auth.orangejelly.co.uk/`, Resend's click-tracking host. Not a web page.

### Discovered, currently not indexed, 23

Every one is a URL that now redirects, all with last crawl N/A: 15 old `/licensees-guide/*`,
4 `/ways-to-work/*`, plus `/capabilities`, `/compete-with-pub-chains`,
`/pub-marketing-agency` and `/pub-marketing-no-budget`. No action.

### Crawled, currently not indexed, 21

Nineteen on this site (16 `/licensees-guide/*`, plus `/pub-marketing-berkshire`,
`/quiet-midweek-solutions` and `/empty-pub-solutions`), all of which now 308. Two on
`management.orangejelly.co.uk`. No live `/guides/` URL appears in this list.

### Duplicate without user-selected canonical, 0

Nothing.

---

## 4. The defects

### P1. robots.txt blocks the assets Google needs to render the site

`src/app/robots.ts` disallows `/_next/`, `/icon`, `/apple-icon` and `/opengraph-image`.
Measured against a full crawl of all 145 sitemap URLs on 5 September, all returning 200:

| Rule | What it blocks | Measured scope |
| --- | --- | --- |
| `Disallow: /_next/` | Every stylesheet and script chunk (`/_next/static/...`) | 2 CSS files and 17 JS chunks on the home page alone, 44 distinct `/_next/static` assets sitewide |
| `Disallow: /_next/` | The image optimiser (`/_next/image?url=...`) | **394 of 398 `<img>` elements**, and 1,598 of 1,602 URL references counting `srcset` |
| `Disallow: /icon` | `/icon.png?<hash>`, via prefix matching including the query | `<link rel="icon">` on **all 145 pages**. There is no `/favicon.ico`; this is the site's only favicon. |
| `Disallow: /apple-icon` | `/apple-icon.png?<hash>` | `<link rel="apple-touch-icon">` on all 145 pages |
| `Disallow: /opengraph-image` | The generated social image | `og:image` on 4 pages, `twitter:image` on 32 |

What this does and does not mean, stated exactly:

- Google's guidance on CSS and JavaScript is unambiguous: blocking them prevents Google
  rendering the page as a visitor sees it. GSC has already logged one blocked stylesheet.
- The image **files** are not unreachable. `/images/**`, `/brand/**` and `/logo.png` are
  allowed and return 200. What is blocked is the optimiser URL the pages actually reference.
- **Structured data is safe.** All 473 JSON-LD blocks reference direct absolute
  `/images/...` or `/logo.png` URLs, none blocked. The `og:image` on all 113 guide, guides
  index and category pages is also a direct path. Rich results are not at risk.
- The four crawlable `<img>` exceptions are all on `/guides/summer-moments-simple-campaigns`,
  the only markdown file in `content/` using in-body image syntax.
- Google will not show a favicon in search results for a favicon URL it may not fetch.

Nothing under `/_next/` is sensitive: it is build output, with no published source maps and
no server-only value reaching a client bundle. This was checked rather than assumed.

**Fix:** remove all four rules. Keep `/api/`, `/admin/`, `/private/` and `/search-index.json`.

Note for the test design: `Disallow: /admin/` does **not** match the bare path `/admin`.
That is deliberate and stays as it is; `/admin` is kept out of the index by its own
`noindex, nofollow` metadata, not by robots.

### P2. The apex redirect is temporary

`https://orangejelly.co.uk/` serves **307 Temporary Redirect** to www.

This is emitted by a Host-keyed rule at the Vercel edge that short-circuits the deployment
entirely. Proof: `curl -H "Host: orangejelly.co.uk" https://www.orangejelly.co.uk/guides?a=1`
returns 307 with no `content-security-policy` and no `x-matched-path`, whereas the same URL
without the Host override returns 200 with both. The apex response also carries
`strict-transport-security: max-age=63072000`, a value that appears nowhere in this
repository.

**It cannot be fixed from this repository.** `vercel.json` already declares the apex rule
with `permanent: true` (a 308) and `src/middleware.ts:147` issues a 301; neither can produce
the observed 307, because neither runs. The middleware branch is in fact unreachable in
production for this reason, and is left alone rather than deleted in this release.

Correcting an earlier statement in revision 1: **"every redirect in the codebase is a 308" is
false.** The built routes manifest is 37 redirects at 308 and 3 at 307. The three are the
campaign links `/autumn`, `/christmas` and `/summer`, declared `permanent: false` at
`src/lib/route-manifest.js:663` so they can be repointed each season. That is deliberate and
correct.

**Fix:** Peter changes the domain redirect status to permanent in the Vercel dashboard
(Project Settings, Domains, Edit on `orangejelly.co.uk`). There is no Vercel CLI command that
edits a domain's `redirectStatusCode`: `vercel domains` has no redirect option, and
`vercel redirects` takes paths rather than hosts, so a `/:path*` rule added that way would
also fire on www and loop. Record the before and after values.

### P3. Two live pages have no inbound internal links

`/fractional-cmo` and `/tools/ai-readiness` are in the sitemap, serve 200, and are linked
from nowhere. Two independent crawls of all 145 sitemap URLs agree: the only occurrences of
either path anywhere on the site are the two pages' own canonical and `og:url` tags.

| Inbound internal links | Pages |
| --- | --- |
| **0** | `/fractional-cmo`, `/tools/ai-readiness` |
| 2 | the four `/insights/*` articles |
| 4 and above | everything else, including all 112 guide URLs |

Stated carefully: missing internal links are a **confirmed discovery weakness and a
plausible contributor** to both pages going uncrawled. They are not a proven sole cause, and
no traffic has been shown to be lost, because neither page has ever ranked. Adding the links
removes a defect we control; whether and when Google crawls and selects the pages is an
outcome to observe, not a promise.

`/tools` itself is a 404 with no page file, so there is no tool hub to link from.

### P4. Four dynamic route families answer soft 404s

An unknown slug under `/results/`, `/insights/`, `/growth-problems/` or `/guides/category/`
returns **HTTP 200** carrying the root loading fallback. The 404 UI reaches the browser only
inside the React Server Component payload, so a crawler without JavaScript receives a 200
with a spinner. The document also carries two contradicting robots tags: the page's own
`index, follow` and Next's injected `noindex`.

Cause: `src/app/loading.tsx` sits at the app root, so Next 14 wraps every route in a Suspense
boundary and flushes the shell with a 200 before the page component runs. Once headers are
sent the status cannot change. This is documented Next 14 behaviour on
`next@14.2.35`, not a Vercel quirk.

`/guides/[slug]` is unaffected: it pairs `revalidate = 60` with `dynamicParams = false`, so
an unknown slug is resolved at routing time and `/guides/no-such-guide-xyz` returns a genuine
404 with the not-found page in the HTML. That is the in-repo precedent.

**Fix, scoped deliberately.** `dynamicParams = false` is added to the two routes where it
carries no trade-off:

| Route | Params source | Ship it? |
| --- | --- | --- |
| `/results/[slug]` | `CASE_STUDIES`, a static array | **Yes.** Closed set, no drafts, no redirects. |
| `/growth-problems/[slug]` | `GROWTH_PROBLEMS`, a static array | **Yes.** Same. |
| `/insights/[slug]` | `getAllInsights()`, which filters out drafts | **No.** Would end draft preview for insights. |
| `/guides/category/[category]` | `getCategories()` | **No.** Line 80 calls `permanentRedirect()` for a legacy slug; that path would become unreachable. |

The two excluded routes are a decision for Peter, recorded in section 7. Note that the
`/guides/category/` legacy-slug redirect is currently held up entirely by
`src/middleware.ts:135`, and **that branch has no test**. This release adds one, because it
is load-bearing today regardless of what is decided later.

### P5. `/dev/components` returns a soft 404

Production answers **HTTP 200**, not 404.

Correcting revision 1: **the component harness is not publicly reachable.** The page calls
`notFound()` when `NODE_ENV` is production and serves no specimen markup; a production fetch
contains zero occurrences of the harness strings. What is wrong is the status code, and two
comments that claim otherwise. Both `src/app/dev/components/page.tsx` and the route manifest
note credit `force-dynamic` with producing a real 404, which it cannot do for the reason in
P4.

**Fix:** answer the 404 in `src/middleware.ts`, which runs before rendering begins and can
still set a status. Correct both comments.

---

## 5. Explicitly not doing

- **Strengthening the `/insights/*` cluster.** Revision 1 called two inbound links thin. On
  inspection it is not a defect: every page on the site links to `/insights` through the
  header nav, so all four articles are two clicks from anywhere. Adding cards to
  `/growth-problems/weak-demand` would be actively wrong, because 45 of the 105 hospitality
  guides funnel there and those readers are not the audience for "Marketing for law firms".
  Dropped.
- **Adding a `/favicon.ico`.** Google supports PNG favicons. The repair the existing icon
  needs is crawl access, which P1 gives it. A second icon file is maintenance without a
  proven fault.
- **A URL-prefix Search Console property.** Useful reporting scope, not a technical fix.
  Recorded as an option in section 7.
- **Deleting the unreachable middleware apex branch**, and `generateRobotsTxt()` in
  `src/lib/feeds.ts`, which is a second, unused source of robots rules. Both are recorded as
  follow-ups so the next person does not rediscover them.
- **Anything on `management.` or `cheersai.`** from this repository.
- **Clicking "Validate fix" in Search Console yet.** Correcting revision 1's reasoning:
  validation does re-check current URLs rather than the stale snapshot, so "it would measure
  the wrong thing" was wrong. The real reasons to hold are that most rows are intentional
  redirects and other products' pages, which a validation could never clear, and that the
  live fixes must be verified first. Once P1 ships and is verified, scope any validation to
  the actually repaired issue.

---

## 6. Acceptance

Release acceptance is what can be proved on release day by a command or an HTTP response.
Indexing is not a release criterion: Google's selection and timing are not ours to control,
and a crawl request does not guarantee inclusion.

**Provable on release day**

1. `npm run lint`, `npm run type-check`, `npm run test:run` and `npm run build` all exit 0.
2. Live `/robots.txt` contains exactly `Disallow: /api/`, `/admin/`, `/private/` and
   `/search-index.json`, and nothing else. Fetch with a cache-busting query string: the file
   is served behind the Vercel edge cache.
3. Every `/_next/static` and `/_next/image` URL extracted from the freshly deployed home page
   and a guide page is allowed for Googlebot by the live rules and returns 200. Never
   hardcode a content hash; they change on every build.
4. `/icon.png`, `/apple-icon.png`, `/opengraph-image` and `/manifest.webmanifest` return 200
   and are allowed for Googlebot.
5. `/api/`, `/api/admin/enquiries`, `/admin/`, `/private/` and `/search-index.json` are still
   blocked for Googlebot, and `/api/admin/enquiries` still answers 401.
6. `/dev/components` returns 404 and its body contains no loading fallback.
7. `/results/no-such-case-study` and `/growth-problems/no-such-problem` return 404 with the
   not-found page in the served HTML.
8. `/fractional-cmo` and `/tools/ai-readiness` each appear as a link in the live HTML of at
   least one other page.
9. `https://orangejelly.co.uk/` returns a permanent redirect, path and query preserved, and
   the same holds for a deep path and a query-bearing path.
10. No regression: `/guides/README` still 410s, `/guides/category/social-media` still 308s to
    `/guides/category/marketing`, and a sample guide still returns 200.

**Observed afterwards, not acceptance**

- Google re-reading robots.txt. It caches for roughly 24 hours, so a same-day check proves
  the file changed, not that Googlebot has re-read it. Check "Page resources" in URL
  Inspection no earlier than 48 hours after deploy.
- `/fractional-cmo` and `/tools/ai-readiness` acquiring a last-crawl date, then being
  indexed.
- The 55 legacy rows reclassifying from "Discovered" and "Crawled" to "Page with redirect".

Checkpoints at 7, 14 and 28 days after release. Owner: Peter. Persistent non-crawl is a new
diagnostic task, not evidence the release failed. Never remove useful links because indexing
is slow.

**Weekly protected-post monitoring, corrected.** `npm run monitor:posts` on its own prints a
usage line and exits 2. The working invocation is:

```bash
npm run monitor:posts -- <path-to-GSC-Pages-export.csv>
```

It compares a Google Search Console Pages export against
`tasks/repositioning/data/baselines/protected-posts-2026-08-27.json`. It exits 0 even when it
prints alerts, so **a zero exit code is not an all-clear**; the printed output must be read.
Check that the export's date window is comparable to the baseline's before comparing totals.

---

## 7. Open decisions

These do not block the release. Each has a recommended default, which is what happens if no
answer comes.

1. **`dynamicParams = false` on `/insights/[slug]`?** It would make unknown insight slugs
   return a real 404, and would end draft preview for insights. Recommended default: leave it
   as it is, because a working preview is worth more than a soft 404 on URLs nobody requests.
2. **`dynamicParams = false` on `/guides/category/[category]`?** Same benefit, but it would
   make the in-page legacy-slug `permanentRedirect()` unreachable, leaving middleware as the
   only cover. Recommended default: leave it as it is; this release adds the missing
   middleware test either way.
3. **Draft-mode preview.** `/guides/[slug]` already pairs `dynamicParams = false` with a
   `generateStaticParams` that excludes drafts, so an unpublished guide 404s before the
   `draftMode()` read at line 387 can matter. `PREVIEW_SECRET` is documented as live.
   Recommended default: record preview as working for insights and categories only, and open
   a separate ticket if guide preview is wanted back.
4. **A URL-prefix property for `https://www.orangejelly.co.uk/`.** Recommended default: add
   it, because 22 of the 81 rows triaged here were other products.

5. **The four `/availability` token routes are soft 404s too.** An invalid poll token
   answers 200, not 404. The anti-oracle property those routes are designed around is
   the identical outcome for every failure cause, and that still holds: unknown, expired,
   consumed, deleted and draft all return the same 200. Nothing leaks. But the comment in
   `src/app/availability/not-found.tsx` asserted a 404 as part of the control, and it was
   wrong; it has been corrected to say what actually happens. Fixing the status means a
   route-segment `loading.tsx` under `/availability`, or narrowing the app-root one.
   Recommended default: leave it, because these routes are `noindex` bearer-token URLs
   where a soft 404 carries no search cost, and the security property does not depend on
   the status.

Follow-ups with no decision needed, logged so they are not rediscovered:

- `buildSearchIndex()` in `src/lib/search.ts` maps only `getAllPosts()`, so the four insights
  are absent from site search. The live index is 105 items, all guides. Separate ticket.
- `generateRobotsTxt()` in `src/lib/feeds.ts` is an unused second source of robots rules.
- The apex branch in `src/middleware.ts` is unreachable in production.
- `check:claims` harvests every two or three digit percentage in `CLAIMS.md` rather than the
  five approved ones, so its allow-list is 17 figures and currently includes 58 and 71, which
  are the retired food gross-profit claim. New copy saying "58%" would pass the gate.
- The `llms.txt describes the current company` check in `scripts/synthetic-check.mjs` asserts
  a phrase the live copy no longer uses and forbids a pound sign the approved price requires.
  It has been red on production since before this release. Either the copy or the check is
  stale, and which one is a positioning question.

---

## 8. Evidence

All checks run on 5 September 2026 against production at commit `3d801e3f`, deployment
`dpl_Qnjnu9oeg4HmnDTa9tNJZ3aaziEh`.

- All 81 not-indexed URLs read from the Search Console drill-down tables and classified
  row by row. Arithmetic audited independently.
- Full crawl of all 145 sitemap URLs, twice, independently: 145 of 145 returned 200;
  398 `<img>` elements, 394 via `/_next/image`; 473 JSON-LD blocks, none blocked;
  959 internal link edges; exactly two orphans.
- URL Inspection: `/guides/pub-health-safety-checklist` indexed; `/fractional-cmo` and
  `/tools/ai-readiness` discovered and never crawled.
- Redirect chains: `curl -sI` on apex and www across root, deep path and query-bearing path,
  including a Host-spoof probe that isolates the edge rule.
- Soft 404s: status and body inspection of `/dev/components`, `/results/`, `/insights/`,
  `/growth-problems/`, `/guides/category/` and the four `/availability` token routes, against
  the Next 14 streaming documentation and the installed `next@14.2.35`.
- Independent developer review:
  `tasks/seo-powerhouse/2026-09-05-gsc-spec-review/developer-review.md`. Its raw evidence
  pack sits beside it and is deliberately not committed: `live-checks.json` alone is 3 MB of
  full HTTP response bodies from a 145-URL crawl, which is a working artefact rather than
  something to carry in the repository's history.
- Adversarial review of the implementation, 5 September 2026: 27 findings raised across five
  lenses (search visibility, security, runtime correctness, test vacuity, conventions), 19
  refuted on independent verification, 6 fixed in commit `8e76e338`, 2 recorded above as
  follow-ups.
