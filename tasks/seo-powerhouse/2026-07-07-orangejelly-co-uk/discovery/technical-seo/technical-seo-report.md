# Technical SEO Audit — Orange Jelly (orangejelly.co.uk)

**Author:** Technical SEO Specialist · **Date:** 2026-07-07 · **Mode:** Full Overhaul, 2nd run
**Scope:** Codebase-level ROOT CAUSE + exact fix location for each technical item in the Strategy Lead's direction, plus new defects. June Tier-1 fixes are live/verified and are NOT re-reported.
**Deployed commit under audit:** main @ `6116fe19` (equals production — confirmed via `git rev-parse HEAD`, live `x-vercel-id: lhr1`, and rendered-content checks on 2026-07-07).

This report builds ON the Strategy Lead's direction. Where my codebase evidence **corrects** a strategy assumption, I say so explicitly — the strategy read three items from crawler output that the code proves have a different mechanism (and one item is already fixed). Getting the mechanism right changes the fix.

---

## Critical Issues (fix first)

### C1 — Named-channel service routes serve the HOMEPAGE (200 + homepage canonical), not a redirect. The `permanentRedirect()` in source silently no-ops in production.

**This is the single highest-value technical defect on the site and the strategy's diagnosis of it is mechanically wrong** (understandably — it was inferred from crawler output). Correcting the mechanism changes the fix from "self-canonical + build out content" to "the route is broken; the redirect never fires."

**What the code says** (`src/app/services/instagram-services-for-pubs/page.tsx`, and identical `.../facebook-services-for-pubs/page.tsx`, both @ deployed `6116fe19`):
```tsx
import { permanentRedirect } from 'next/navigation';
export default function InstagramServicesForPubsPage() {
  permanentRedirect('/services/social-media-marketing-for-pubs');
}
```

**What production actually serves** (live `curl` 2026-07-07, no `-L`):
- `HTTP/2 200` — **not** a 308. `x-matched-path: /services/instagram-services-for-pubs`, `x-vercel-cache: HIT`.
- Rendered `<title>Transformative Hospitality Growth Partner | Orange Jelly</title>` (the HOMEPAGE title).
- Rendered `<link rel="canonical" href="https://www.orangejelly.co.uk"/>` — points at the homepage.
- Rendered homepage schema graph (`ProfessionalService`, `WebSite`, `Person`, `GeoCoordinates`).
- `evidence/page-metadata.csv`: `/services/instagram-services-for-pubs` = **153 words** — i.e. the homepage's unique body-copy word-count, which is exactly the "153 words" the strategy attributed to a thin service page.

**Root cause:** a top-level `permanentRedirect()` inside a **statically-rendered** App-Router route does not produce a durable 308 at the Vercel edge; the route resolves to a cached static output that falls through to the root render. The redirect is dead. The net effect is that `/services/instagram-services-for-pubs` (GSC pos 7.0, 256 impr/12mo) and `/services/facebook-services-for-pubs` (pos 6.1) return the homepage under a homepage canonical — telling Google these money-ranking URLs are duplicates of `/`. `evidence/technical-signals.csv` records instagram as `canonical_status=points-elsewhere` → `https://www.orangejelly.co.uk`.

**Fix (choose ONE; do NOT keep the current broken `permanentRedirect`):**
- **Option A — build them out as real pages (recommended; matches strategy P1).** Replace each redirect stub with a proper page (like `social-media-marketing-for-pubs/page.tsx`): `generateMeta({ path: '/services/instagram-services-for-pubs', ... })` (self-canonical), named-channel content (reuse June SEO-010 spec), add both slugs to `src/app/sitemap.ts`, and request indexing. This recovers pos-6/7 rankings with real dedicated pages.
- **Option B — make the redirect actually work.** Move both redirects into `next.config.js async redirects()` (where `/services → /ways-to-work` already reliably 308s) instead of an in-component `permanentRedirect`. This is correct only if the decision is to consolidate into `social-media-marketing-for-pubs`; but that throws away the distinct pos-7 "instagram services for pubs" and pos-6 "facebook services for pubs" rankings, so A is preferred.

**Fix type:** One-off page fix (×2 routes) — but the underlying "in-component `permanentRedirect` on a static route silently fails" is a pattern worth a lint note. `Owner: Technical`. `Severity: Critical`. `Effort: Medium` (A) / Small (B).

---

## Crawlability & Indexation

| Check | Status | Details (evidence) | Impact | Fix location |
|---|---|---|---|---|
| Redirect stubs serve homepage | **Broken** | C1 above — instagram/facebook service routes return 200+homepage canonical | Critical | `src/app/services/{instagram,facebook}-services-for-pubs/page.tsx` |
| Hard 404 internally linked | **Broken** | `/licensees-guide/pub-wages-labour-costs-uk` → 404 (live + `evidence/technical-signals.csv` status=404). Live sibling `-guide` self-canonicals fine | Medium | see T3 below |
| Residual `/services` internal links | **Residual** | 9 links from 9 pages still target `/services` (308→`/ways-to-work`) — `evidence/broken-internal-links.csv` `redirect_chain_len=1` | Low | see T4 below |
| `contact?package=*` canonical | **Already correct** | All 4 param URLs canonical → `/contact` (`evidence/technical-signals.csv` `canonical_status=points-elsewhere`→`/contact`, which is the DESIRED target). Root cause: `src/app/contact/layout.tsx` hard-sets `alternates.canonical='https://www.orangejelly.co.uk/contact'` for the whole `/contact` segment; query strings inherit it | — (resolved) | No canonical change needed |
| Robots.txt | **OK** | Live: `User-Agent: *  Allow: /` + 8 sensible Disallows (`/api/`, `/admin/`, `/_next/`, `/private/`, icons, `search-index.json`). Sitemap referenced. No page-blocking of value URLs | — | `public/robots.txt` (or route) — no change |
| AI crawler access | **OK** | Single `*` group, no per-bot Disallow → OAI-SearchBot, ChatGPT-User, Claude-User, Claude-SearchBot, PerplexityBot, Applebot all permitted. No accidental block of search/user AI bots | — | No change |
| `llms.txt` | Absent | No `/llms.txt`. Proposed convention only, not honoured by major crawlers — leave as-is; not a defect | — | N/A |
| Noindex / x-robots | **OK** | 0 noindex on value pages (`evidence/audit-summary.md`) | — | — |
| Soft-404 / JS-dependency | **OK** | 0 soft-404 candidates; Playwright not installed so no raw-vs-rendered diff, but site is SSR/statically-rendered (canonicals/titles present in raw HTML) | — | — |

### T3 — 404: `/licensees-guide/pub-wages-labour-costs-uk` (slug rename without a redirect)

**Root cause (confirmed):** the guide was renamed to the `-guide` slug. `evidence/seo-overrides.ts` scan shows `/licensees-guide/pub-wages-labour-costs-guide` is the live override key (self-canonical, in sitemap, 200); the `-uk` slug has no content file and no redirect. Exactly **one** internal link points at the dead `-uk` slug: `src/content` body of `/licensees-guide/how-much-profit-does-a-pub-make` (anchor "pub wages and labour costs" — `evidence/broken-internal-links.csv` row 21, `internal-links.csv`). It is also in GSC Coverage "Not found (404)".

**Fix (two parts, same changeset):**
1. **Redirect** — add to `next.config.js async redirects()` (alongside the existing guide-rename entries like `fizz-street-food-pop-up`):
   ```js
   { source: '/licensees-guide/pub-wages-labour-costs-uk',
     destination: '/licensees-guide/pub-wages-labour-costs-guide', permanent: true },
   ```
2. **Fix the link at source** — update the in-body link in the `how-much-profit-does-a-pub-make` guide (in `content/`) to point at the `-guide` slug so no internal link resolves through the redirect.

**Fix type:** One-off page fix. `Owner: Technical`. `Severity: Medium`. `Effort: Small`.

### T4 — Residual internal links to `/services` (June SEO-007 leftover)

**Root cause:** `/services` 308-redirects to `/ways-to-work` (`next.config.js`), but 9 links from 9 sources still point at `/services` (`internal-links.csv`). They split into two systemic sources:
- **6 guide-body links** (in `content/`): `christmas-pub-promotion-ideas`, `email-marketing-pub-retention`, `quiz-night-ideas`, `how-to-run-successful-pub-events`, `menu-engineering-lift-average-spend`, `profitable-pub-food-menu-ideas` — anchors "pub marketing services" / "pub consultancy services".
- **3 breadcrumb links** emitted by `PubServiceLandingPage` on the 3 live service pages: `breadcrumbs={[{ label: 'Services', href: '/services' }, ...]}` in `src/app/services/{social-media-marketing,paid-social,content-creation}-for-pubs/page.tsx` (lines ~26–28 each).

**Fix (Template/system + content):**
- Breadcrumbs: change the `href: '/services'` breadcrumb crumb to `/ways-to-work` in the 3 service `page.tsx` files (or make it non-linking, since `/services` no longer exists as a destination). This is the systemic slice.
- The 6 guide-body links: repoint to `/ways-to-work` (or the relevant named service page) in `content/`.

**Fix type:** Template/system fix (breadcrumbs) + content process fix (6 guide links). `Owner: Technical`. `Severity: Low`. `Effort: Small`.

---

## Site Architecture & Internal Linking

### T1 — `/capabilities` absorbs 1,035 inbound links (> homepage's 602) from TWO sitewide components. Precise decomposition + rebalance.

**Root cause (fully decomposed from `internal-links.csv` by anchor text):** `/capabilities` is a legitimate umbrella page (`src/app/capabilities/page.tsx` — "Everything we can help with"), NOT a thin/duplicate page, so this is a **link-equity distribution** problem, not a delete. The 1,035 inbound links come from two boilerplate emitters firing on every page:

| Source | Anchor(s) | Links |
|---|---|---|
| **Footer** (`content/data/footer.json` → `links.capabilities`, rendered by `FooterWrapper.tsx`→`FooterSimple.tsx`) | "Growth Strategy", "Event Marketing", "Local Visibility" — 3 entries hard-coded `href: "/capabilities"` (footer.json lines 23,24,28) | 3 × 152 = **456** |
| **Footer top-level** (`FooterSimple.tsx:106`) | "Capabilities" heading link | 1 × 152 = **152** |
| **Blog guide template** (`src/components/blog/BlogPost.tsx` lines 276, 289, 302, 315) | 4 CTAs "Social media for pubs", "Paid social and ads", "Content and creative", "Event marketing" — ALL hard-coded `href="/capabilities"` | 4 × 106 guides = **424** |
| Contextual | "What we do", "See Full Capability Breakdown" | 3 |

By contrast the real money pages starve: `/fix-my-pub` **22** inbound / 16 pages; `/compete-with-pub-chains` **10** / 8; `/pub-marketing-agency` **57** / 57. The `/ways-to-work` packages get their equity via footer already (449).

**The BlogPost.tsx block is the most wasteful:** four CTAs literally labelled "Social media for pubs", "Paid social and ads", "Content and creative" — but every one links to `/capabilities` instead of the matching named service page that actually holds the pos-6/7 rankings. This is a mismatched-anchor bug as well as an equity sink.

**Fix (Template/system fix — two files, resolves all ~880 boilerplate links at once):**
1. **`src/components/blog/BlogPost.tsx`** — repoint the 4 CTAs to their anchor-matching destinations:
   - "Social media for pubs" → `/services/social-media-marketing-for-pubs`
   - "Paid social and ads" → `/services/paid-social-for-pubs`
   - "Content and creative" → `/services/content-creation-for-pubs`
   - "Event marketing" → keep `/capabilities` OR point at the events cluster; (there is no dedicated events service page)
2. **`content/data/footer.json`** — repoint 2 of the 3 `links.capabilities` `/capabilities` entries to money pages (e.g. "Growth Strategy" → `/ways-to-work`, "Local Visibility" → `/pub-marketing`); keep one contextual `/capabilities` link. Leave the top-level "Capabilities" heading link (1/page) — a single sitewide link to an umbrella page is fine.

Net effect: `/capabilities` inbound drops well below the homepage; the named service pages and `/fix-my-pub`/`/pub-marketing-agency` gain contextual, anchor-relevant inbound equity. **Validation:** re-crawl shows `/capabilities` inbound < 602 and the four service/rescue pages materially up.

**Fix type:** Template/system fix. `Owner: Technical`. `Severity: High`. `Effort: Small`.

### Orphan / other
- **1 orphan page:** `/pub-rescue` — in sitemap, 0 internal inbound links (`evidence/internal-link-issues.md`). Add a contextual link from `/fix-my-pub` and/or the footer to give it discovery + equity. `Severity: Low`, `Effort: Small`, one-off.
- No high-impression/low-inbound "money page" anomalies beyond the starvation described in T1.

---

## Structured Data

### T5 — 138 retired FAQ/HowTo rich-result blocks + 12 missing-required blocks. Two distinct template bugs. Keep FAQ content VISIBLE for AEO; the fix is about the retired MARKUP only.

**Breakdown (`evidence/schema-issues.csv`, 5,946 blocks over 152 pages):**

**(a) 138 retired rich-result blocks = 136 `FAQPage` + 2 `HowTo`**, across 137 URLs. By template bucket: **108 guides**, 11 county/pub-marketing, 7 top-level commercial, 5 contact(+params), 4 services, 1 homepage, 1 ways-to-work. Google retired FAQ and HowTo rich results, so this markup earns no SERP enhancement; it is maintenance weight. **It is NOT harmful and the on-page Q&A must stay for AEO/answer-engines.** The recommendation is a template-level decision about the JSON-LD, not the visible content.

Emitting components (all in `src/components/StructuredData.tsx`):
- `FAQSchema` (lines 14–44) — invoked from the blog guide template, `ServicesPage.tsx:61`, `PubServiceLandingPage.tsx:86`, and the commercial page templates. This one component is responsible for all 136 FAQPage blocks.
- `HowToSchema` (lines 232–286) — 2 blocks.

**Recommendation (Template/system fix, ONE decision point):** the choice is centralised in `FAQSchema`/`HowToSchema`. Either (i) keep the markup (valid, future-proofs if Google reinstates, and some AI answer-engines parse FAQPage) — in which case log the decision and **de-prioritise**, or (ii) if the team wants to shed maintenance weight, gate emission behind a flag or remove the `<script>` output from `FAQSchema` while leaving `FAQItem`/visible Q&A untouched. **Do NOT touch the visible FAQ copy.** My recommendation: keep it (option i) and record the decision — it is cheap to retain and mildly useful for AEO; spend effort on C1/T1 instead.

**(b) 12 missing-REQUIRED blocks — these ARE worth fixing (two clean template fixes):**
- **9× `WebSite` schema missing `name` + `url`** on `/licensees-guide` and the 8 category pages (`/licensees-guide/category/*`). Root cause: the WebSite JSON-LD emitted on the guide-index/category template omits `name`/`url`. Fix the single component that emits `WebSite` on those templates (search `@type":"WebSite` emitters — likely `CollectionPageSchema.tsx` or the licensees-guide layout).
- **3× `LocalBusiness` missing `address`** on the 3 live service pages (`social-media-marketing`, `paid-social`, `content-creation`). Root cause: `ServiceSchema` (`StructuredData.tsx:58–109`) nests `provider: { '@type': 'LocalBusiness', name, '@id' }` with **no `address`**. `PubServiceLandingPage.tsx:75` calls `ServiceSchema`. **Fix in `ServiceSchema`:** either add a `PostalAddress` to the nested provider, or (cleaner) drop the inline `LocalBusiness` and reference the site-wide Organization/LocalBusiness by `@id` (`${baseUrl}/#localbusiness` / `#organization`) so it resolves against the fully-specified node emitted globally. This fixes all 3 in one edit.

**Fix type:** Template/system fix. `Owner: Technical`. `Severity: Medium` (retired blocks Low; missing-required Medium). `Effort: Medium`.

---

## Sitemap & Coverage

### T7 — Sitemap 139 vs crawl 153: delta explained; 3 real money pages wrongly excluded; lastModified honesty (June SEO-016).

`src/app/sitemap.ts` builds: 11 static + 16 marketing + all non-redirected blog posts + categories. Delta findings:

- **8 crawled-200 URLs are not in the sitemap** (`evidence/technical-signals.csv` `in_sitemap=no`):
  - **3 real money pages MISSING and should be added:** `/services/social-media-marketing-for-pubs`, `/services/paid-social-for-pubs`, `/services/content-creation-for-pubs`. These are live, self-canonical, indexable, and hold rankings — but `sitemap.ts` has an explicit comment "Services are represented on a single page; avoid fragment URLs in sitemap" and never adds them. **Fix:** add these 3 slugs (and, once C1 is fixed as real pages, the instagram/facebook slugs too) to a `serviceRoutes` block in `sitemap.ts`.
  - **4 `contact?package=*` param URLs** — correctly excluded (canonical → `/contact`); no action.
  - **1 `/services/instagram-services-for-pubs`** — currently broken (C1); once fixed as a real page, add to sitemap.
- **404 / redirected URLs correctly excluded:** `pub-wages-labour-costs-uk` (404) is not in the sitemap; `cash-flow-crisis-breaking-cycle` is explicitly filtered via `REDIRECTED_GUIDE_SLUGS`. `sitemap.ts` does not advertise any non-200 URL. **This part is clean** (June SEO-016 sitemap-404 concern resolved).
- **lastModified honesty (June SEO-016 residual):** static + marketing pages use hard-coded dates (`'2026-04-05'`, `'2026-03-17'`) not tied to real content changes; blog pages correctly use `post.updatedDate || post.publishedDate`. Hard-coded static dates are a mild freshness-signal dishonesty. **Fix (low priority):** derive static-page `lastModified` from file mtime or a per-route constant updated on real edits; at minimum stop advancing them without a content change.

**Fix type:** Template/system fix (`sitemap.ts`). `Owner: Technical`. `Severity: Medium` (missing service pages) / Low (lastModified). `Effort: Small`.

---

## Performance & Core Web Vitals

**No field data available — do not infer numbers.** `evidence/cwv.csv` = all `source=unavailable` (no `CRUX_API_KEY` configured; low-traffic origin likely has no CrUX record either). `collect-cwv.py` returns `unavailable`, which is missing data, not a pass.

**To unlock field data:** set `CRUX_API_KEY` (and optionally a PSI key) in the run environment and re-run `scripts/collect-cwv.py`. Until then, no LCP/INP/CLS/TTFB can be reported.

**Directional-only signals from the crawl (Confidence: Low, no field validation):**
- **11 pages with oversized images (>200 KB via HEAD)** (`evidence/audit-summary.md`). `next.config.js` is correctly configured for optimisation (`formats: ['image/avif','image/webp']`, sensible `deviceSizes`, `minimumCacheTTL: 31536000`), so the likely cause is source assets served at full resolution or hero PNGs (e.g. `/images/headers/capabilities.png`) not routed through `next/image`. Worth a spot-check of the 11 URLs' hero images once CWV field data confirms an LCP problem.
- 0 images missing alt text (good).

**Fix type:** Analytics/governance fix (get CRUX key) then One-off image fixes if warranted. `Owner: Analytics` (key) / Technical (images). `Severity: Low` (directional). `Effort: Small`.

---

## Security & Trust
- Full HTTPS; middleware forces canonical host `www.orangejelly.co.uk` + HTTPS (301) and sets HSTS (prod), X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, and a CSP (`src/middleware.ts`). API routes get headers via `next.config.js`. No mixed-content or header defects found. **No action.**

## Image SEO
- Alt text: 100% present (0 missing). Formats configured for AVIF/WebP. Only concern is the 11 oversized-image pages above (directional). Consider an image sitemap only if image search becomes a channel — not warranted at current scale.

## Local SEO
- LocalBusiness/Organization schema present globally (NAP, geo, `areaServed: GB`, `sameAs: the-anchor.pub`). The 3 service-page `LocalBusiness` missing-`address` blocks (T5b) are the only structured local defect. County pages exist but have negligible demand (strategy §4 — STOP decision). No new local work recommended.

## AI Search & Entity Readiness (technical half)
- **Bot access: clean.** robots.txt permits all AI search/user crawlers (no per-bot Disallow). No WAF/bot-fight evidence of blocking (Vercel default). Server-rendered HTML carries titles/canonicals/schema in raw source, so answers survive for extraction.
- FAQ content is server-rendered and visible → extractable for answer engines (keep it — see T5).
- Hand-off to `ai-seo`/Editorial for answer-block structuring and entity `sameAs` expansion (strategy §7). No technical blocker.

## Content Lifecycle
- `next.config.js` handles retired/renamed guides with 301s; sitemap filters redirected slugs. The one gap is the `-uk` 404 (T3). Freshness signals: blog `dateModified` derived from post data (honest); static sitemap dates are not (T7).

---

## Prioritised Fix List

| Priority | Issue | Fix location | Impact | Effort | Fix type |
|---|---|---|---|---|---|
| **P0 (Critical)** | Instagram/Facebook service routes serve homepage + homepage canonical (redirect dead) | `src/app/services/{instagram,facebook}-services-for-pubs/page.tsx` | Recovers pos-6/7 money rankings | Medium | One-off (×2) |
| **P1 (High)** | `/capabilities` 1,035-link equity sink; BlogPost CTAs mis-linked | `src/components/blog/BlogPost.tsx` (276–320) + `content/data/footer.json` (23,24,28) | Redistributes equity to money pages | Small | Template/system |
| **P2 (Medium)** | 404 slug rename, no redirect | `next.config.js redirects()` + `content/` link in `how-much-profit-does-a-pub-make` | Removes 404, recovers link | Small | One-off |
| **P2 (Medium)** | 12 missing-required schema (9× WebSite name/url, 3× LocalBusiness address) | WebSite emitter on guide/category template + `ServiceSchema` in `StructuredData.tsx` | Valid structured data | Medium | Template/system |
| **P2 (Medium)** | 3 real service pages absent from sitemap | `src/app/sitemap.ts` (add serviceRoutes) | Discovery/indexation of ranking pages | Small | Template/system |
| **P3 (Low)** | Residual `/services` links (breadcrumbs + 6 guides) | 3 service `page.tsx` breadcrumbs + `content/` | Removes redirect hops | Small | Template/system + content |
| **P3 (Low)** | 138 retired FAQ/HowTo blocks | `FAQSchema`/`HowToSchema` in `StructuredData.tsx` — **keep, record decision** | Maintenance only; keep for AEO | Medium | Template/system |
| **P3 (Low)** | `/pub-rescue` orphan | Add contextual link from `/fix-my-pub`/footer | Discovery | Small | One-off |
| **P3 (Low)** | Sitemap static lastModified not honest | `src/app/sitemap.ts` | Freshness-signal honesty | Small | Template/system |
| **Gate** | No CWV field data | Set `CRUX_API_KEY`, re-run `collect-cwv.py` | Unblocks performance audit | Small | Analytics/governance |

### Corrections to strategy assumptions (evidence-backed)
1. **Instagram/facebook service pages are not "thin self-canonicalised pages" — the routes are broken and serve the homepage** (C1). Fix is to build them as real pages (or move the redirect to `next.config.js`), not to "add a self-canonical to a thin page."
2. **`contact?package=*` canonical is ALREADY correct** (→ `/contact` via `contact/layout.tsx`). No canonical work needed; the only residual is retired FAQ schema on those variants (covered by T5).
3. **The `/capabilities` sink is two components, and BlogPost's four CTAs are also mis-anchored** — the fix repoints CTAs whose visible labels already name the money pages.

---

```json
{ "findings": [
  { "finding": "/services/instagram-services-for-pubs and /services/facebook-services-for-pubs return HTTP 200 rendering the HOMEPAGE with canonical=https://www.orangejelly.co.uk, despite source declaring permanentRedirect(). The in-component permanentRedirect on a statically-rendered App Router route silently no-ops at the Vercel edge (x-vercel-cache: HIT). These URLs hold pos 7.0 / pos 6.1 money rankings and are being told they duplicate the homepage.", "evidence": "Live curl 2026-07-07: HTTP/2 200, x-matched-path=/services/instagram-services-for-pubs, rendered <title>Transformative Hospitality Growth Partner | Orange Jelly</title>, <link rel=canonical href=https://www.orangejelly.co.uk>; src/app/services/instagram-services-for-pubs/page.tsx @6116fe19 = permanentRedirect('/services/social-media-marketing-for-pubs'); evidence/page-metadata.csv instagram=153 words; evidence/technical-signals.csv canonical_status=points-elsewhere", "source": "Live HTTP check + git show 6116fe19 + collect-site-evidence.py", "dataStatus": "Known", "severity": "Critical", "confidence": "High", "impactArea": "SEO", "owner": "Technical", "effort": "Medium", "dependencies": "dev; content for page bodies (June SEO-010)", "fixType": "One-off page fix", "recommendedAction": "Replace both redirect stubs with real self-canonical pages (mirror social-media-marketing-for-pubs/page.tsx), add named-channel content, add both slugs to sitemap.ts, request indexing. Do NOT keep the in-component permanentRedirect; if consolidation is genuinely wanted, move the redirect to next.config.js redirects() where /services already 308s reliably — but rebuilding as real pages is preferred to preserve the distinct rankings.", "validationStep": "curl -I returns the page's own 200 with self-canonical (or a real 308); GSC CTR on 'instagram/facebook services for pubs' rises off 0% in next export", "riskRollback": "Low — page/redirect changes reversible via git" },
  { "finding": "/capabilities receives 1,035 internal links (> homepage 602) from two sitewide boilerplate emitters, starving money pages (/fix-my-pub 22 inbound, /compete-with-pub-chains 10, /pub-marketing-agency 57). Decomposition: footer capabilities block 3×152=456 + footer 'Capabilities' heading 152 + BlogPost.tsx 4 CTAs ×106 guides=424. The four BlogPost CTAs are labelled 'Social media for pubs'/'Paid social and ads'/'Content and creative'/'Event marketing' but all hard-code href=/capabilities instead of the matching named service pages.", "evidence": "evidence/internal-links.csv anchor breakdown (152×'Capabilities'+152×'Growth Strategy'+152×'Event Marketing'+152×'Local Visibility'+106×4 blog CTAs); evidence/internal-link-issues.md Boilerplate authority sinks; src/components/blog/BlogPost.tsx lines 276,289,302,315 href='/capabilities'; content/data/footer.json lines 23,24,28 href='/capabilities'", "source": "collect-site-evidence.py internal-links.csv + codebase read", "dataStatus": "Known", "severity": "High", "confidence": "High", "impactArea": "SEO", "owner": "Technical", "effort": "Small", "dependencies": "dev", "fixType": "Template/system fix", "recommendedAction": "In BlogPost.tsx repoint the 4 CTAs to their anchor-matching destinations (/services/social-media-marketing-for-pubs, /services/paid-social-for-pubs, /services/content-creation-for-pubs; keep 'Event marketing'→/capabilities). In footer.json repoint 2 of 3 capabilities entries to /ways-to-work and /pub-marketing; keep one contextual /capabilities link and the top-level heading link.", "validationStep": "Re-crawl: /capabilities inbound < 602; named service pages + /fix-my-pub + /pub-marketing-agency inbound counts materially up", "riskRollback": "Low — restore hrefs if rankings wobble" },
  { "finding": "Hard 404 at /licensees-guide/pub-wages-labour-costs-uk — a slug rename (live sibling /licensees-guide/pub-wages-labour-costs-guide self-canonicals and is in sitemap) that never got a redirect. Exactly one internal link points at the dead slug: the body of the how-much-profit-does-a-pub-make guide (anchor 'pub wages and labour costs').", "evidence": "Live curl 404; evidence/technical-signals.csv status=404 canonical empty; -guide slug present in evidence/seo-overrides.ts scan (self-canonical, sitemap=yes); evidence/broken-internal-links.csv row 21 source=how-much-profit-does-a-pub-make target_status=404", "source": "Live HTTP check + collect-site-evidence.py + seo-overrides scan", "dataStatus": "Known", "severity": "Medium", "confidence": "High", "impactArea": "crawl/indexing", "owner": "Technical", "effort": "Small", "dependencies": "dev", "fixType": "One-off page fix", "recommendedAction": "Add a 301 (Next 308) in next.config.js redirects(): /licensees-guide/pub-wages-labour-costs-uk -> /licensees-guide/pub-wages-labour-costs-guide; and fix the in-body link in the how-much-profit-does-a-pub-make guide (content/) to the -guide slug.", "validationStep": "URL returns 308 to -guide; broken-internal-links.csv has no 404 row for this target on re-crawl; GSC Coverage 404 clears", "riskRollback": "None — standard redirect" },
  { "finding": "Residual internal links to /services (308 -> /ways-to-work): 9 links from 9 sources — 3 are breadcrumb crumbs emitted by the service page templates (href:'/services') and 6 are guide-body links.", "evidence": "evidence/internal-links.csv (9 sources); evidence/broken-internal-links.csv redirect_chain_len=1; src/app/services/{social-media-marketing,paid-social,content-creation}-for-pubs/page.tsx breadcrumbs label:'Services' href:'/services'", "source": "collect-site-evidence.py + codebase read", "dataStatus": "Known", "severity": "Low", "confidence": "High", "impactArea": "crawl/indexing", "owner": "Technical", "effort": "Small", "dependencies": "dev; content team for 6 guide links", "fixType": "Template/system fix", "recommendedAction": "Change the '/services' breadcrumb crumb to '/ways-to-work' (or make it non-linking) in the 3 service page.tsx files; repoint the 6 guide-body '/services' links in content/ to /ways-to-work.", "validationStep": "Re-crawl: no internal links resolve through the /services redirect", "riskRollback": "None" },
  { "finding": "138 retired FAQ/HowTo rich-result JSON-LD blocks (136 FAQPage + 2 HowTo) across 137 URLs (108 guides, 11 county, 7 top-level commercial, 5 contact, 4 services, 1 homepage, 1 ways-to-work). Google retired these rich results so the markup earns no SERP enhancement, but the on-page Q&A must stay for AEO. All FAQPage blocks originate from one component (FAQSchema in StructuredData.tsx).", "evidence": "evidence/schema-issues.csv: deprecated_or_retired=138 (FAQPage 136, HowTo 2); evidence/schema-validation-summary.md; src/components/StructuredData.tsx FAQSchema (14-44) + HowToSchema (232-286)", "source": "validate-schema.py offline pass (5,946 blocks, 152 pages)", "dataStatus": "Known", "severity": "Low", "confidence": "High", "impactArea": "SEO", "owner": "Technical", "effort": "Medium", "dependencies": "dev; AEO decision on FAQ retention", "fixType": "Template/system fix", "recommendedAction": "Template-level decision in FAQSchema/HowToSchema. Recommended: KEEP the markup (valid, mildly useful for AI answer engines, cheap to retain) and record the decision; if shedding maintenance weight is preferred, gate/remove only the <script> JSON-LD emission while leaving all visible FAQItem Q&A untouched. Do not remove on-page FAQ copy.", "validationStep": "Decision recorded; if removed, re-run validate-schema.py shows retired-block count down and no change to visible FAQ content", "riskRollback": "Low — schema-only, reversible; no ranking depends on retired rich results" },
  { "finding": "12 blocks missing a REQUIRED field, from two template bugs: 9x WebSite schema missing name+url on /licensees-guide and 8 category pages; 3x LocalBusiness missing address on the 3 live service pages (nested provider inside ServiceSchema).", "evidence": "evidence/schema-issues.csv missing_required: WebSite(name;url) on /licensees-guide + /licensees-guide/category/* (9); LocalBusiness(address) on /services/{content-creation,paid-social,social-media-marketing}-for-pubs (3); src/components/StructuredData.tsx ServiceSchema lines 58-109 provider LocalBusiness has no address; PubServiceLandingPage.tsx:75 calls ServiceSchema", "source": "validate-schema.py + codebase read", "dataStatus": "Known", "severity": "Medium", "confidence": "High", "impactArea": "SEO", "owner": "Technical", "effort": "Medium", "dependencies": "dev", "fixType": "Template/system fix", "recommendedAction": "Fix the WebSite emitter on the guide-index/category template to include name+url. In ServiceSchema, either add a PostalAddress to the nested provider or (cleaner) reference the global Organization/LocalBusiness by @id (${baseUrl}/#localbusiness) so it resolves against the fully-specified node. Both fixes are single-component edits.", "validationStep": "Re-run validate-schema.py: missing-required count = 0", "riskRollback": "Low — additive schema fields" },
  { "finding": "3 live money pages are absent from the XML sitemap: /services/social-media-marketing-for-pubs, /services/paid-social-for-pubs, /services/content-creation-for-pubs (all 200, self-canonical, ranking). sitemap.ts explicitly never adds service sub-pages ('Services are represented on a single page' comment). Delta sitemap 139 vs crawl 153 otherwise explained by correctly-excluded contact?package params, the broken instagram route, and the 404.", "evidence": "evidence/technical-signals.csv in_sitemap=no + status=200 for the 3 service pages; src/app/sitemap.ts (no service routes, comment lines ~9-11); evidence/audit-summary.md coverage diff (crawled-not-in-sitemap: 9)", "source": "collect-site-evidence.py + sitemap.ts read", "dataStatus": "Known", "severity": "Medium", "confidence": "High", "impactArea": "crawl/indexing", "owner": "Technical", "effort": "Small", "dependencies": "dev", "fixType": "Template/system fix", "recommendedAction": "Add a serviceRoutes block to sitemap.ts including the 3 live service pages (and, after C1 is fixed as real pages, the instagram/facebook slugs). Keep contact?package params and non-200 URLs excluded (already correct).", "validationStep": "sitemap.xml contains the 3 service URLs; GSC Coverage picks them up in next crawl", "riskRollback": "None — additive sitemap entries" },
  { "finding": "Sitemap static/marketing lastModified dates are hard-coded ('2026-04-05','2026-03-17') and not tied to real content changes, while blog pages correctly use post.updatedDate||publishedDate. Mild freshness-signal dishonesty (June SEO-016 residual). Sitemap correctly excludes all non-200 URLs (that half of SEO-016 is resolved).", "evidence": "src/app/sitemap.ts staticPages/marketingPages hard-coded lastModified; blogPages use post.updatedDate||post.publishedDate; REDIRECTED_GUIDE_SLUGS filters redirected slug", "source": "sitemap.ts read", "dataStatus": "Known", "severity": "Low", "confidence": "High", "impactArea": "crawl/indexing", "owner": "Technical", "effort": "Small", "dependencies": "dev", "fixType": "Template/system fix", "recommendedAction": "Derive static-page lastModified from a per-route constant updated on real edits (or file mtime); stop advancing dates without a content change.", "validationStep": "sitemap lastModified values change only when the corresponding page content changes", "riskRollback": "None" },
  { "finding": "contact?package=* parameter URLs already canonicalise correctly to /contact (desired) via src/app/contact/layout.tsx hard-set canonical for the whole /contact segment. The strategy's 'canonical check needed' is resolved; the only residual on these URLs is retired FAQPage schema (covered by the retired-schema finding). They are correctly excluded from the sitemap.", "evidence": "evidence/technical-signals.csv contact?package=* canonical_status=points-elsewhere -> https://www.orangejelly.co.uk/contact; src/app/contact/layout.tsx alternates.canonical='https://www.orangejelly.co.uk/contact'", "source": "collect-site-evidence.py + codebase read", "dataStatus": "Known", "severity": "Low", "confidence": "High", "impactArea": "crawl/indexing", "owner": "Technical", "effort": "Small", "dependencies": "None", "fixType": "One-off page fix", "recommendedAction": "No canonical change required. Only ensure the retired-FAQ-schema decision (see retired-schema finding) covers these variants. Optionally suppress FAQPage schema on the param variants specifically if the retire-markup path is chosen.", "validationStep": "Confirmed already correct in current evidence; no regression on re-crawl", "riskRollback": "None" },
  { "finding": "/pub-rescue is an orphan: in sitemap but with 0 internal inbound links, relying on sitemap alone for discovery and passing no internal equity.", "evidence": "evidence/internal-link-issues.md Orphaned pages table (/pub-rescue, in sitemap: yes)", "source": "collect-site-evidence.py internal-link analysis", "dataStatus": "Known", "severity": "Low", "confidence": "High", "impactArea": "crawl/indexing", "owner": "Technical", "effort": "Small", "dependencies": "dev", "fixType": "One-off page fix", "recommendedAction": "Add a contextual internal link to /pub-rescue from /fix-my-pub and/or the footer resources block.", "validationStep": "Re-crawl shows /pub-rescue with >=1 internal inbound link", "riskRollback": "None" },
  { "finding": "No Core Web Vitals field data available (CRUX_API_KEY not configured; cwv.csv all source=unavailable). 11 pages carry oversized images (>200 KB via HEAD) as a directional-only signal — next.config.js image optimisation is correctly configured, so likely-cause is hero assets not routed through next/image. Cannot report LCP/INP/CLS without field data.", "evidence": "evidence/cwv.csv (all rows source=unavailable); evidence/cwv-data-access.md; evidence/audit-summary.md 'Pages with oversized images: 11'; next.config.js images formats avif/webp", "source": "collect-cwv.py (unavailable) + audit-summary.md", "dataStatus": "unavailable", "severity": "Low", "confidence": "Low", "impactArea": "UX", "owner": "Analytics", "effort": "Small", "dependencies": "CRUX_API_KEY / PSI key", "fixType": "Analytics/governance fix", "recommendedAction": "Set CRUX_API_KEY and re-run scripts/collect-cwv.py to obtain field p75 LCP/INP/CLS/TTFB. Only after field data confirms an LCP issue, spot-check the 11 oversized-image hero assets and route them through next/image. Do not invent CWV numbers.", "validationStep": "cwv.csv shows source=field or lab rows; if remediated, LCP improves in field data", "riskRollback": "None — measurement + reversible image swaps" }
] }
```
