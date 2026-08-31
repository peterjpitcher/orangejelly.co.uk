# Technical SEO Audit — orangejelly.co.uk

**Date:** 2026-06-16 (Europe/London) · **Agent:** Technical SEO Specialist · **Phase:** 2 (Discovery)
**Commercial goal:** more service enquiries/leads from UK licensees. Every finding is tied to that goal.

**Data status header.** GSC = first-party (Known). **GA4 was not supplied** -> no Core Web Vitals field data, no conversion/session baseline; CWV is marked "needs measurement (PSI/CrUX)" and never guessed. No Ahrefs/Semrush -> no volume/DA/backlink numbers asserted. Crawl = 50 of 140 sitemap URLs (`evidence/audit-summary.md`), so absolute counts (e.g. "29 multiple-H1") are **of the 50-page sample**; the *template root cause* is verified site-wide in code and by live fetch.

**No live indexation change (noindex/canonical/redirect/robots/schema/sitemap/GBP) is recommended for action here.** Every change below is routed to the Phase-5 Risk Register.

---

## Critical Issues (fix first — actively blocking crawl/index/rank or commercial conversion)

### C-1. Every blog/guide page renders TWO `<h1>` tags — template defect (site-wide)
**Root cause (verified in code, not inferred):** the guide route renders a hero H1 **and** the markdown body's leading `# Title` as a second H1.
- Hero: `src/app/licensees-guide/[slug]/page.tsx:725` renders `<BlogCategoryHero title={post.title} ...>`; `BlogCategoryHero.tsx:60` emits `<Heading level={1}>`. For seasonal hubs the equivalent is `SeasonalHubHero.tsx:66` (`level={1}`).
- Body: 97 of 106 files in `content/blog/` begin their body with `# <Title>`; `src/lib/markdown/render.ts` (remark-parse -> remark-rehype) faithfully converts that `#` into a second `<h1>` inside the `dangerouslySetInnerHTML` block at `BlogPost.tsx:209`.
- **Live confirmation:** `GET /licensees-guide/quiz-night-ideas` -> `<h1>` count = **2**; `/autumn-pub-event-ideas` and `/cask-ale-week-pub-guide` -> **2** each. Homepage and `/ways-to-work` correctly have **1**.
- **Crawl quantification:** of the 50-page sample, 29 pages have multiple H1s; **25 are the *same* H1 text rendered twice** (hero title == markdown `# Title`), 4 are near-duplicate (frontmatter `title` "Can't" vs markdown `#` "Cannot", e.g. `staff-motivation-hacks-no-pay-rise`). Both are the same root cause.
- **Why it matters:** duplicate H1s dilute the primary on-page topic signal across the entire informational engine — the exact pages (`quiz-night-ideas`, `summer-pub-event-ideas`, `profitable-pub-food-menu-ideas`, `social-media-strategy-for-pubs`) that carry the site's visibility (Strategy section 2). This is one template fix that cleans ~100 pages at once.
- **Fix type: Template/system fix.** Choose ONE H1 source. Recommended: keep the hero `<Heading level={1}>` as the canonical page H1, and demote the markdown leading `#` — either (a) strip/downgrade a leading `# H1` in `preprocessMarkdown` so the body starts at `##`, or (b) add a rehype step that rewrites the first `<h1>` in `contentHtml` to `<h2>`. Option (a) is cleanest because it also fixes the heading-hierarchy (currently H1->H1). Hand to Web Developer Analyst to confirm the preprocess approach doesn't break the Table-of-Contents anchor logic.
- **Validation:** re-fetch 5 guides, assert exactly one `<h1>`; confirm TOC still renders.

### C-2. Sitemap advertises a URL that the server returns **410 Gone** — self-conflicting signal
- **The 410 URL is `/licensees-guide/cash-flow-crisis-breaking-cycle`** (the single non-200 in the crawl; `url-inventory.csv` status=410, `in_sitemap=yes`).
- **Root cause:** the slug is in the GONE list at `src/middleware.ts:28` -> returns 410 (`middleware.ts:90`), **but** `content/blog/cash-flow-crisis-breaking-cycle.md` still has `status: "published"`, so `getAllPosts()` includes it and `src/app/sitemap.ts` (blog loop, line ~118) emits it into the sitemap.
- GSC shows this URL under **"Discovered – currently not indexed"** (Coverage Drilldown 5) — Google found it via the sitemap, hasn't fetched the 410 cleanly, and it sits in the backlog.
- **Why it matters:** you are telling Google "index this" (sitemap) and "this is permanently gone" (410) simultaneously. Wastes crawl attention and pollutes the not-indexed report so real problems are harder to see.
- **Fix type: Template/system fix** (one rule, prevents recurrence). Make `getAllPosts()`/sitemap exclude any slug in the middleware GONE list (single source of truth), OR set the MD `status` to something the sitemap filters. Decide whether 410 is even correct here — if the content has value, restore it; if truly retired, keep 410 but remove from sitemap.
- **Validation:** re-render sitemap, assert the slug is absent; confirm 410 still served. **Route via Risk Register (sitemap change).**

### C-3. Two commercial pages are **orphaned** (zero internal links) -> "Discovered, currently not indexed"
- `/compete-with-pub-chains` and `/pub-marketing-agency` are **live 200, `index, follow`, in the sitemap, schema-valid** — yet both sit in GSC "Discovered – currently not indexed" with `last crawled 1970-01-01` (never fetched).
- **Root cause (verified):** `internal-links.csv` shows **0 inbound internal links** to either page across the 50-page crawl. They are not in the main nav or footer link set. A page in the sitemap but with no internal links is a weak discovery candidate — Google defers crawling. This is *not* a noindex/canonical block.
- **Why it matters:** `/pub-marketing-agency` targets the highest-value commercial query the site is already shown for (`pub marketing agency` 304 impr, pos 19.6, 0 clicks — Strategy section 2). It cannot earn clicks while unindexed. Direct lead blocker.
- **Fix type: Template/system fix** (navigation/internal-linking). Add intent-matched internal links from the `/ways-to-work` hub, `/capabilities`, and relevant guides to both pages; consider nav/footer inclusion. This is the same internal-linking lever Content/UX needs for the guide->service bridge (Strategy SEO-002).
- **Validation:** re-crawl, confirm >=3 inbound links each; GSC URL Inspection -> request indexing after links ship.

### C-4. `/ways-to-work` (the live commercial hub) is in the not-indexed backlog — confirm it is actually indexing
- **Strategy assumed `/services` is the commercial page "not indexed".** Reality (verified live): **`/services` 308-redirects (permanent) to `/ways-to-work`** (`next.config.js:20-24`). `/ways-to-work` is the real hub: live 200, 1 H1, `index, follow`, in sitemap, valid `ProfessionalService`+`FAQPage` schema, 130 inbound internal links in the crawl. The 308 is clean (single hop, no chain) and Google treats it like a 301 — fine.
- **Open issue:** `/ways-to-work` appears in GSC "Discovered – currently not indexed" (Drilldown 5, `1970-01-01`). With strong internal linking it should index; the `1970-01-01` suggests the export predates the redirect/hub launch. **Action: GSC URL Inspection (live test) on `/ways-to-work` and the four `/ways-to-work/*` package pages to confirm indexed; request indexing if not.** No code change needed unless inspection shows a block.
- 4 guide pages still link to the old `/services` URL with commercial anchors ("pub marketing services", "pub consultancy services") — `how-to-run-successful-pub-events`, `email-marketing-pub-retention`, `quiz-night-ideas`, `menu-engineering-lift-average-spend`. **Fix type: One-off content fix** — repoint those 4 links to `/ways-to-work` to drop the redirect hop and pass equity directly.

---

## Crawlability & Indexation

| Check | Status | Details | Impact | Fix |
|-------|--------|---------|--------|-----|
| robots.txt | OK | `User-Agent: *` `Allow: /`; disallows `/api/`, `/_next/`, `/admin/`, `/private/`, `/search-index.json`, `/icon`, `/apple-icon`, `/opengraph-image`; Sitemap line present. Nothing valuable blocked. (live fetch) | Low | None |
| XML sitemap | OK w/ defects | 140 `<loc>` (live). Correctly omits `/services` (redirect). **Defects:** includes the 410 page (C-2); all static/marketing `lastModified` hardcoded identical (`2026-04-05`/`2026-03-17`) in `src/app/sitemap.ts` — not genuine freshness. Blog `lastModified` uses real `updatedDate`/`publishedDate` (good). | Medium | C-2 + replace hardcoded lastmods with real update dates |
| Canonicals | OK | 49/50 crawled pages self-canonical; **0 mismatches**; the 1 "missing" is the 410 (text/plain, no HTML). Live spot-checks: blog & home self-canonical correct. | Low | None |
| noindex | OK (in sample) | All 49 crawled HTML pages = `index, follow`. GSC "Excluded by noindex" (10) are **all `management.orangejelly.co.uk/*` and `/auth/login`** (Drilldown 0) — a *different app/subdomain*, correctly noindexed. None are marketing-site pages. | Low | None (confirm intentional) |
| "Discovered – not indexed" (44) | Mixed | Drilldown 5: contains **must-index commercial/new pages** (`/ways-to-work`, `/capabilities`, `/compete-with-pub-chains`, `/pub-marketing-agency`, `/pub-marketing-*` regional, `/ways-to-work/*` packages) **and never-fetched new guides** (`autumn-pub-event-ideas`, `cask-ale-week-pub-guide`, `pop-up-events-for-pubs`, `national-drinks-days-pub-guide`, etc.), all `1970-01-01`. | High | Internal-link + URL-Inspection these (C-3, C-4); they are live & indexable, just under-discovered |
| "Crawled – not indexed" (30) | Watch | Drilldown 6: all real marketing-site guide/landing URLs (`/empty-pub-solutions`, `/quiet-midweek-solutions`, `/pub-marketing-no-budget`, many guides). Crawled but Google judged them not worth indexing yet -> quality/thinness/duplication signal, not a technical block. | Medium | Content depth + internal linking (hand to Content); not a technical fix |
| 404s (6) | Mostly external | Drilldown 2: 3 are `cheersai.orangejelly.co.uk/*` (different app); 1 is the redirect source `brewery-tie-improve-your-deal` (now redirected, stale 404 record); `kitchen-nightmares-chef-quits` (retired). | Low | Confirm redirects cover any valuable retired slugs |
| Redirects (7) | OK | Drilldown 1: `http://`, `http://www`, `https://orangejelly.co.uk` (non-www) -> https://www canonical host (correct); `/services` -> `/ways-to-work` (correct); 3 category URLs. All resolve. `next.config.js` redirects are all `permanent: true` single-hop (verified live: no chains). | Low | None |
| Blocked by robots.txt (6) | Correct | Drilldown 3: all `management.orangejelly.co.uk/events/*` — a *different subdomain's* events app, correctly out of scope. | Low | None |
| Duplicate, no canonical (2) | External | Drilldown 4: both `management.orangejelly.co.uk/auth/login?redirectedFrom=...` — not marketing-site URLs. | Low | None |

**Indexation triage summary (the core ask):**
- **(a) Correctly excluded noise — no action:** all `cheersai.orangejelly.co.uk/*` (404s), all `management.orangejelly.co.uk/*` (noindex/robots-blocked/dup), and the http/non-www host duplicates. These belong to other apps; the only governance action is to **stop expecting them in this property's index** (likely a GSC property-scope artefact — this is a domain property capturing subdomains). *Recommend: verify whether GSC is a Domain property; if so, the subdomain noise is expected and not a marketing-site problem.*
- **(b) MUST index — treat as Critical lead blockers:** `/ways-to-work` (+ 4 package pages), `/capabilities`, `/compete-with-pub-chains`, `/pub-marketing-agency`, regional `/pub-marketing-*`, and the never-crawled seasonal guides. Root cause = under-discovery (orphan/low internal links + `1970-01-01` never-fetched), **not** a directive block. Fix = internal linking + sitemap freshness + URL Inspection.

---

## Site Architecture & Internal Linking

- **Internal linking is hub-heavy but uneven.** From the 50-page crawl: `/capabilities` 329 inbound, `/ways-to-work` 130, `/contact` 110, `/licensees-guide` 89, `/ways-to-work/turnaround-intensive` 87, regional pages 51 each — but `/compete-with-pub-chains` and `/pub-marketing-agency` = **0** (orphans, C-3), and `/services` still receives 4 (wasted on a redirect).
- **`/capabilities` paradox:** 329 inbound links yet "Discovered – not indexed". Heavy linking rules out orphaning -> likely a recently-added page Google hasn't prioritised, or perceived thin/duplicate content. Resolve via URL Inspection + a content-depth pass (hand to Content), not a technical fix.
- **Guide->service bridge is largely absent** (corroborates Strategy SEO-002 / Opportunity-map A). The same internal-linking work that fixes C-3 should add intent-matched guide->service links sitewide. **Fix type: Template/system fix** (add a service-bridge block to the guide template + curated contextual links).
- **Breadcrumbs:** present and valid (`BreadcrumbList` x141 in schema; passed to heroes via `breadcrumbs=` prop). Good.

---

## Performance & Core Web Vitals

| Metric | Current | Target | Issue | Recommendation |
|--------|---------|--------|-------|----------------|
| LCP / INP / CLS | **needs measurement (PSI/CrUX)** | LCP <2.5s, INP <200ms, CLS <0.1 | No field or lab data was supplied; not guessed. | Run PageSpeed Insights + pull CrUX for homepage, a guide, `/ways-to-work`. Mobile ranks/converts best (Strategy section 2) — prioritise mobile lab + field. |
| Image weight | 3 pages with image >200KB (crawl, Known); directional only | <100KB each (project bar) | Identified by HEAD size, not rendered LCP. | Compress the 3 flagged images; `next.config.js` already enables AVIF/WebP + responsive `deviceSizes`/`imageSizes` + 1yr cache (good baseline). |
| JS / rendering | Directional (code only) | — | Next.js App Router; blog uses server-rendered HTML (`BlogPostServer` -> `dangerouslySetInnerHTML`), markdown libs dynamically imported in `render.ts` (good — keeps them server-side). | No action without measurement; note as low-risk architecture. |
| Server/caching | `cache-control: public, max-age=0, must-revalidate` on HTML (live); `compress: true`, `poweredByHeader: false` in config | — | `max-age=0` is normal for Vercel ISR HTML. | None; confirm CDN/ISR behaviour during CWV measurement. |

**Do not score CWV until PSI/CrUX is run.** Mark `unavailable`.

---

## Mobile Usability

- **Responsive baseline present:** `next.config.js` defines responsive `deviceSizes`/`imageSizes`; blog content uses `prose prose-lg max-w-none` (fluid). No horizontal-scroll or fixed-width evidence in code.
- **Commercially important:** GSC shows mobile ranks better (pos 9.83 vs 13.61) and converts clicks better (CTR 1.87% vs 0.92%) than desktop (Strategy section 2). Mobile experience is a lead lever, not a checkbox.
- **No field viewport/tap-target data available.** Recommend mobile lab audit (PSI mobile) alongside CWV. `confidence: Low` on specific mobile UX issues until measured. (UX/CRO owns the conversion-path mobile review per Strategy section 7.)

---

## Structured Data

| Page type | Current schema (verified) | Missing / gap | Rich-result opportunity |
|-----------|---------------------------|---------------|-------------------------|
| Commercial hub `/ways-to-work` | `ProfessionalService`, `FAQPage`, `BreadcrumbList`, `WebSite`, `ContactPoint`, `PostalAddress`, `GeoCoordinates`, `ListItem` — **0 parse errors** (live) | **No `Offer`/`Service` with price** despite "packages from 375+VAT" being a headline commercial signal. Only `Service` x2, `Offer` x1 across the whole crawl. | Add `Service` + `Offer`/`priceSpecification` on package pages so pricing is machine-readable (governance, not a defect). Use ONLY `/CLAIMS.md`-approved figures. |
| Commercial `/pub-marketing-agency` | `ProfessionalService`, `FAQPage`, `BreadcrumbList` — valid (live) | Same Offer gap | FAQ rich results already eligible (FAQPage present). |
| Blog guide | `BlogPosting`, `FAQPage`, `BreadcrumbList`, `Person`, `SpeakableSpecification`, `WebPage` — valid (live) | None structural | FAQ + Speakable already support PAA/voice/AI. Strong. |
| Sitewide | `Organization` x219, `ProfessionalService` x52, `BlogPosting` x217, `FAQPage` x41, `BreadcrumbList` x141 (`schema.json`) | — | Foundation is strong and valid. **Do not rebuild.** |

**Governance issues (not defects):** (1) the missing priced `Offer`/`Service` on package pages; (2) ensure any schema claim (ratings, results) maps to `/CLAIMS.md` before it ships. **Fix type: Template/system fix** for the Offer addition (one schema template on package pages). Route any live schema change via Risk Register.

---

## Security & Trust

- **HTTPS:** enforced; http/non-www all 301/308 -> `https://www` (Drilldown 1 + live). **HSTS:** `max-age=31536000; includeSubDomains` (live) — strong; **missing `preload`** (low-priority hardening). Set in `src/middleware.ts:52`.
- **Security headers present (live, all HTML):** `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, `Content-Security-Policy` (set in `src/middleware.ts`; API routes covered in `next.config.js:80`). Good posture.
- **CSP note for Analytics:** CSP already whitelists `googletagmanager.com` + `google-analytics.com` (live) -> **a GTM/GA container is wired into the page** even though GA4 exports weren't supplied. Flag to the Analytics specialist: the tag infra may already exist; verify whether GA4 is firing before standing up new tracking (SEO-001).

---

## Image SEO

- **Alt text:** crawl found **0 images missing alt** across 50 pages (`audit-summary.md`) — good; `OptimizedImage` enforces required `alt` (CLAUDE.md component standard).
- **Formats/responsive:** AVIF/WebP + responsive sizes + long cache configured (`next.config.js`). Sound.
- **Weight:** 3 pages exceed 200KB image (crawl HEAD). Compress those specific assets. `Fix type: One-off page fix`. Directional (not LCP-confirmed).
- **Image sitemap:** none. Low priority — not an image-led business.

---

## Local SEO

- **LocalBusiness/ProfessionalService schema present** with NAP, `GeoCoordinates`, `PostalAddress`, `ContactPoint`, `OpeningHoursSpecification` (`schema.json`) — The Anchor, Stanwell Moor. Good entity grounding.
- **Regional service pages exist** (`/pub-marketing-kent`, `-oxfordshire`, `-surrey`, `-london`, `-hampshire`, `-hertfordshire`, `-buckinghamshire`, `-berkshire`) — Kent/Oxfordshire get 51 inbound links each (linked), others need discovery checks (several in the not-indexed backlog). `pub business recovery services stockport` already ranks pos 7.9 (Strategy section 3) — local service intent is real.
- **GBP not assessable** (no access in workspace) — `unavailable`. **Do not recommend doorway/near-duplicate location pages** (role rule). Hand the coherent regional-page system to Authority (Strategy SEO-010); keep pages genuinely differentiated.

---

## AI Search & Entity Readiness

- **AI crawlers: not blocked.** robots.txt is allow-all with no `GPTBot`/`ClaudeBot`/`Claude-User`/`OAI-SearchBot`/`PerplexityBot`/`Google-Extended`/`Applebot` rules (live) -> all AI search/user crawlers can reach the site. No accidental block. (No Cloudflare/Akamai bot-fight evidence; on Vercel.)
- **`/llms.txt` exists** (HTTP 200, live) — already implemented. Useful but not a substitute for crawlable HTML/schema (which is strong).
- **Answerability:** guides carry `QuickAnswer`, `FAQPage`, `SpeakableSpecification` and a real-publican `Person` author — strong citation-readiness on the informational cluster (matches Opportunity-map F). The C-1 duplicate-H1 fix will *sharpen* the topic signal AI engines parse.
- **Entity clarity:** consistent `Organization` (x219) + `ProfessionalService` + author `Person` across pages = clear entity. Good.

---

## Content Lifecycle

- **Seasonal URLs are evergreen (good):** `autumn-pub-event-ideas`, `christmas-pub-event-ideas`, `summer-pub-marketing` — no dated slugs; QR redirects (`/autumn`, `/christmas`, `/summer`) are `permanent: false` and repointable yearly (`next.config.js:55-75`). Correct pattern.
- **Never-crawled new guides:** the seasonal guides at `1970-01-01` (C-3 cohort) are published, evergreen, and indexable — just under-discovered. Internal-link them from the seasonal hub + `/licensees-guide` and they will be fetched.
- **Retired content:** the 410 page (C-2) is the lifecycle conflict — middleware says gone, MD says published, sitemap advertises it. Single-source the GONE list.
- **Freshness signals:** blog `lastModified` is genuine (`updatedDate`/`publishedDate`); **static/marketing `lastModified` is hardcoded** (C-2 table) -> replace with real dates so freshness isn't faked. `Fix type: Analytics/governance fix` (content-update discipline).
- **Thin content:** crawl flagged 1 (the 410 — expected) + 1 category page; not a real thin-content problem on the sample.

---

## Prioritised Fix List

| Priority | Issue | Impact | Effort | Fix type | Dependency |
|----------|-------|--------|--------|----------|------------|
| 1 (Critical) | C-3: orphaned commercial pages (`/pub-marketing-agency`, `/compete-with-pub-chains`) — 0 internal links -> not indexed | Direct lead blocker; targets shown commercial queries | Small–Medium | Template/system (internal linking) | Dev/Content; Risk Register (if nav change) |
| 2 (Critical) | C-4: confirm `/ways-to-work` (+ packages) indexed via URL Inspection; repoint 4 stale `/services` internal links | Commercial hub must be in the index to earn the 2,908 commercial impressions | Small | One-off content fix + GSC | Dev; GSC access |
| 3 (Critical) | C-1: dual-H1 template defect on ~100 guides | Sharpens topic signal on the visibility-carrying content engine | Medium | Template/system fix | Dev (preprocess/rehype) — confirm with Web Dev Analyst |
| 4 (Critical) | C-2: sitemap advertises a 410 page; single-source the GONE list | Removes self-conflicting crawl signal; de-noises Coverage | Small | Template/system fix | Dev; Risk Register (sitemap) |
| 5 (High) | Internal "Discovered – not indexed" cohort: link + URL-Inspect the never-crawled seasonal guides | Unblocks ranking-ready seasonal content ahead of season | Small | Template/system (internal linking + sitemap freshness) | Dev/Content; Risk Register |
| 6 (High) | Add priced `Offer`/`Service` schema to `/ways-to-work/*` package pages (CLAIMS-approved figures only) | Machine-readable pricing for rich results/AI | Small | Template/system fix | Dev/Content; Risk Register (schema) |
| 7 (Medium) | Replace hardcoded `lastModified` in `sitemap.ts` with real update dates | Genuine freshness signals | Small | Analytics/governance fix | Dev |
| 8 (Medium) | Verify GSC property scope (Domain property capturing cheersai./management. subdomains = expected noise) | Stops mis-reading ~half the not-indexed list as a problem | Small | Analytics/governance fix | GSC admin |
| 9 (Medium) | Run PSI + CrUX (mobile-first) for homepage, a guide, `/ways-to-work` | Establishes the CWV baseline currently unavailable | Small | Analytics/governance fix | PSI access |
| 10 (Low) | Compress 3 oversized images; add HSTS `preload` | Minor weight/security hardening | Small | One-off page fix | Dev |

---

```json
{ "findings": [
  { "finding": "Every blog/guide page renders two <h1> tags: hero H1 (BlogCategoryHero/SeasonalHubHero) plus the markdown body's leading '# Title' rendered as a second h1", "evidence": "Live GET /licensees-guide/quiz-night-ideas h1 count=2, /autumn-pub-event-ideas=2; src/app/licensees-guide/[slug]/page.tsx:725 + BlogCategoryHero.tsx:60 + SeasonalHubHero.tsx:66 (level={1}); 97/106 files in content/blog/ start body with '# '; render.ts converts it to <h1>; crawl page-metadata.csv shows 29/50 multiple-H1 (25 same-text-twice)", "source": "Live fetch (ctx_execute) + codebase read + collect-site-evidence.py page-metadata.csv", "dataStatus": "Known", "severity": "Critical", "confidence": "High", "impactArea": "SEO", "owner": "Technical", "effort": "Medium", "dependencies": "Dev; confirm with Web Developer Analyst (TOC anchor impact)", "fixType": "Template/system fix", "recommendedAction": "Pick one H1 source: strip/downgrade the leading markdown '# H1' to '##' in preprocessMarkdown (preferred, also fixes heading hierarchy), keeping the hero Heading level={1} as the page H1", "validationStep": "Re-fetch 5 guides and assert exactly one <h1>; confirm Table of Contents anchors still render", "riskRollback": "Revert the preprocess/rehype change; purely additive transform, no content loss" },
  { "finding": "XML sitemap advertises /licensees-guide/cash-flow-crisis-breaking-cycle which the server returns 410 Gone — self-conflicting crawl signal", "evidence": "url-inventory.csv status=410 in_sitemap=yes; src/middleware.ts:28 GONE list + :90 returns 410; content/blog/cash-flow-crisis-breaking-cycle.md status:published; sitemap.ts blog loop emits it; GSC Coverage Drilldown 5 lists it as Discovered-not-indexed", "source": "collect-site-evidence.py + codebase read + GSC Coverage drilldown", "dataStatus": "Known", "severity": "Critical", "confidence": "High", "impactArea": "crawl/indexing", "owner": "Technical", "effort": "Small", "dependencies": "Dev; Risk Register (sitemap change)", "fixType": "Template/system fix", "recommendedAction": "Single-source the GONE list: make getAllPosts()/sitemap exclude any slug present in middleware GONE array so 410 URLs never appear in the sitemap; decide whether 410 is correct vs restoring content", "validationStep": "Re-render sitemap and assert slug absent; confirm 410 still served", "riskRollback": "Re-add slug to sitemap source; no live URL behaviour changes" },
  { "finding": "Two commercial pages are orphaned (zero internal links) so Google leaves them as Discovered-currently not indexed: /pub-marketing-agency and /compete-with-pub-chains", "evidence": "internal-links.csv: 0 inbound links to either; both live 200 + index,follow + in sitemap + valid schema (live fetch); GSC Coverage Drilldown 5 lists both at last-crawled 1970-01-01; /pub-marketing-agency targets 'pub marketing agency' 304 impr pos 19.6 0 clicks (search-queries.csv)", "source": "collect-site-evidence.py internal-links.csv + live fetch + GSC Coverage drilldown + GSC queries", "dataStatus": "Known", "severity": "Critical", "confidence": "High", "impactArea": "crawl/indexing", "owner": "Technical", "effort": "Medium", "dependencies": "Dev/Content; Risk Register if nav change", "fixType": "Template/system fix", "recommendedAction": "Add intent-matched internal links to both pages from /ways-to-work, /capabilities and relevant guides (and consider nav/footer); then request indexing via GSC URL Inspection", "validationStep": "Re-crawl, confirm >=3 inbound links each; GSC URL Inspection shows submitted/indexed", "riskRollback": "Remove added links; no destructive change" },
  { "finding": "Strategy assumed /services is an unindexed commercial page; in reality /services 308-permanently redirects to the live indexable hub /ways-to-work, which itself appears in the not-indexed backlog and must be confirmed indexed", "evidence": "Live: /services 308 -> /ways-to-work (next.config.js:20-24); /ways-to-work 200, 1 h1, index,follow, in sitemap, valid ProfessionalService+FAQPage schema, 130 inbound links (internal-links.csv); GSC Drilldown 5 lists /ways-to-work at 1970-01-01; 4 guides still link to old /services (internal-links.csv)", "source": "Live fetch + next.config.js + collect-site-evidence.py + GSC Coverage drilldown", "dataStatus": "Known", "severity": "Critical", "confidence": "High", "impactArea": "crawl/indexing", "owner": "Technical", "effort": "Small", "dependencies": "Dev; GSC access; Risk Register (links)", "fixType": "One-off page fix", "recommendedAction": "Run GSC URL Inspection on /ways-to-work and the 4 /ways-to-work/* package pages; request indexing if not indexed; repoint the 4 guide links from /services to /ways-to-work to drop the redirect hop", "validationStep": "URL Inspection reports Indexed; re-crawl confirms 0 internal links to /services", "riskRollback": "Links revert trivially; no live redirect change" },
  { "finding": "GSC not-indexed buckets are dominated by out-of-scope subdomain noise (cheersai./management.) and host duplicates, likely a Domain-property artefact, masking the real commercial-page issues", "evidence": "Coverage drilldowns: noindex(10)=all management.+auth/login; robots-blocked(6)=management./events; 404(6)=3 cheersai.; dup-no-canonical(2)=management./auth/login; redirect(7)=http/non-www host duplicates", "source": "GSC Coverage drilldown Table.csv (all 7)", "dataStatus": "Known", "severity": "Medium", "confidence": "High", "impactArea": "crawl/indexing", "owner": "Analytics", "effort": "Small", "dependencies": "GSC admin", "fixType": "Analytics/governance fix", "recommendedAction": "Confirm whether GSC is a Domain property (captures subdomains). If so, treat cheersai./management. URLs as expected noise and filter them out of indexation reporting rather than fixing them", "validationStep": "GSC property settings confirm Domain vs URL-prefix; reporting filtered to www marketing host", "riskRollback": "Reporting-only; no site change" },
  { "finding": "Commercial/package pages lack priced Offer/Service schema despite 'packages from 375+VAT' being a headline signal; only Service x2 / Offer x1 across the whole crawl", "evidence": "Live /ways-to-work and /pub-marketing-agency JSON-LD: ProfessionalService+FAQPage present, no Offer/priceSpecification (0 offers detected); schema.json aggregate Service=2 Offer=1", "source": "Live JSON-LD parse (ctx_execute) + schema.json", "dataStatus": "Known", "severity": "Medium", "confidence": "High", "impactArea": "AI visibility", "owner": "Technical", "effort": "Small", "dependencies": "Dev/Content; CLAIMS.md; Risk Register (schema)", "fixType": "Template/system fix", "recommendedAction": "Add Service + Offer/priceSpecification to /ways-to-work/* package pages using only CLAIMS.md-approved pricing (75+VAT hourly, packages from 375+VAT)", "validationStep": "Rich Results Test passes Offer; pricing matches CLAIMS.md exactly", "riskRollback": "Remove the Offer block; schema otherwise unchanged" },
  { "finding": "Sitemap lastModified for static and marketing pages is hardcoded to identical dates (2026-04-05 / 2026-03-17) rather than genuine update timestamps", "evidence": "src/app/sitemap.ts lines 18-126: all staticPages and marketingPages share fixed lastModified; only blogPages use real updatedDate/publishedDate", "source": "Codebase read (src/app/sitemap.ts)", "dataStatus": "Known", "severity": "Low", "confidence": "High", "impactArea": "crawl/indexing", "owner": "Technical", "effort": "Small", "dependencies": "Dev", "fixType": "Analytics/governance fix", "recommendedAction": "Drive lastModified from real content update dates (or omit) so freshness signals are honest", "validationStep": "Sitemap lastmod values vary and match actual edit dates", "riskRollback": "Revert to static dates" },
  { "finding": "Core Web Vitals cannot be assessed — no PSI/CrUX field or lab data was supplied; mobile ranks and converts best so mobile CWV is commercially material", "evidence": "No PSI/CrUX in workspace; GSC Devices: mobile pos 9.83 CTR 1.87% vs desktop pos 13.61 CTR 0.92% (strategy-document.md)", "source": "data-access.md (no GA4/PSI) + GSC Devices", "dataStatus": "unavailable", "severity": "Medium", "confidence": "Low", "impactArea": "UX", "owner": "Analytics", "effort": "Small", "dependencies": "PSI access", "fixType": "Analytics/governance fix", "recommendedAction": "Run PageSpeed Insights + pull CrUX (mobile-first) for homepage, a top guide, and /ways-to-work to establish the CWV baseline before any perf work", "validationStep": "PSI report and CrUX history captured for the three URLs", "riskRollback": "N/A — measurement only" },
  { "finding": "30 real marketing-site URLs are Crawled-currently not indexed, indicating a content quality/thinness/duplication signal rather than a technical block", "evidence": "GSC Coverage Drilldown 6: 30 URLs incl /empty-pub-solutions, /quiet-midweek-solutions, /pub-marketing-no-budget and many guides, all crawled with recent dates but not indexed", "source": "GSC Coverage drilldown Table.csv (Crawled-not-indexed)", "dataStatus": "Known", "severity": "Medium", "confidence": "Medium", "impactArea": "crawl/indexing", "owner": "Content", "effort": "Medium", "dependencies": "Content team", "fixType": "Content process fix", "recommendedAction": "Hand to Content: deepen/differentiate these pages and improve internal linking; not resolvable by a technical directive", "validationStep": "GSC moves URLs from Crawled-not-indexed to Indexed after content/link work", "riskRollback": "N/A — content work" },
  { "finding": "Strong, valid structured-data foundation should be preserved, not rebuilt (0 parse errors on all sampled pages)", "evidence": "Live JSON-LD parse: 0 parse errors on /ways-to-work, /pub-marketing-agency, /licensees-guide/quiz-night-ideas; schema.json aggregate Organization x219, BlogPosting x217, ProfessionalService x52, FAQPage x41, BreadcrumbList x141, SpeakableSpecification x34", "source": "Live JSON-LD parse (ctx_execute) + schema.json", "dataStatus": "Known", "severity": "Low", "confidence": "High", "impactArea": "AI visibility", "owner": "Technical", "effort": "Small", "dependencies": "None", "fixType": "Template/system fix", "recommendedAction": "Keep current schema; only add the Offer/Service gap and ensure all schema claims map to CLAIMS.md; do not rebuild", "validationStep": "Rich Results Test remains error-free after any edit", "riskRollback": "N/A" },
  { "finding": "robots.txt does not block any AI search/user crawler and /llms.txt is already published — good AI-visibility posture", "evidence": "Live robots.txt allow-all with no GPTBot/ClaudeBot/Claude-User/OAI-SearchBot/PerplexityBot/Google-Extended/Applebot rules; /llms.txt returns HTTP 200", "source": "Live fetch (ctx_execute)", "dataStatus": "Known", "severity": "Low", "confidence": "High", "impactArea": "AI visibility", "owner": "Technical", "effort": "Small", "dependencies": "None", "fixType": "Template/system fix", "recommendedAction": "No change; maintain allow-all for AI search/user bots; keep llms.txt current", "validationStep": "Periodic robots.txt review confirms no accidental AI-bot block", "riskRollback": "N/A" },
  { "finding": "Security/HTTPS posture is strong: HSTS + X-Content-Type-Options + X-Frame-Options + Referrer-Policy + CSP present on all HTML; http/non-www force to https://www; HSTS lacks preload", "evidence": "Live headers on home/blog/410: strict-transport-security max-age=31536000 includeSubDomains, x-content-type-options nosniff, x-frame-options SAMEORIGIN, referrer-policy strict-origin-when-cross-origin, content-security-policy present; set in src/middleware.ts:41-57; next.config.js:80 covers /api/*", "source": "Live header fetch (ctx_execute) + codebase read", "dataStatus": "Known", "severity": "Low", "confidence": "High", "impactArea": "SEO", "owner": "Technical", "effort": "Small", "dependencies": "Dev", "fixType": "One-off page fix", "recommendedAction": "Optional hardening: add preload to HSTS after confirming all subdomains are HTTPS-ready", "validationStep": "securityheaders.com A grade; HSTS preload-eligible", "riskRollback": "Remove preload token" },
  { "finding": "CSP already whitelists Google Tag Manager and Google Analytics, implying tag infrastructure exists despite GA4 exports not being supplied", "evidence": "Live home CSP script-src includes googletagmanager.com and google-analytics.com; data-access.md records GA4 as not supplied", "source": "Live CSP header (ctx_execute) + data-access.md", "dataStatus": "Known", "severity": "Medium", "confidence": "Medium", "impactArea": "conversion", "owner": "Analytics", "effort": "Small", "dependencies": "Analytics specialist; GA4 access", "fixType": "Analytics/governance fix", "recommendedAction": "Flag to Analytics (SEO-001): verify whether a GA4/GTM container is already firing before standing up new tracking; the enquiry-conversion gap may be configuration not absence", "validationStep": "GTM/GA4 real-time shows events; enquiry conversion defined", "riskRollback": "N/A — investigation" },
  { "finding": "Three pages carry images over 200KB (directional weight signal, not LCP-confirmed)", "evidence": "audit-summary.md 'Pages with oversized images: 3' via HEAD; next.config.js already enables AVIF/WebP + responsive sizes + 1yr cache", "source": "collect-site-evidence.py audit-summary + codebase", "dataStatus": "Known", "severity": "Low", "confidence": "Medium", "impactArea": "UX", "owner": "Technical", "effort": "Small", "dependencies": "Dev", "fixType": "One-off page fix", "recommendedAction": "Compress the 3 flagged images to <100KB; verify they are not lazy-loaded if above the fold", "validationStep": "HEAD size <100KB; PSI image-weight audit clean", "riskRollback": "Restore original assets" }
] }
```

