# Implementation Estimates — Orange Jelly (Phase 4)

**Companion to** `web-developer-report.md`. Hours assume a competent developer familiar with this Next.js codebase. Effort/Risk (1-5) repeated for the opportunity-score denominator with the assumption behind each number. All file paths are absolute-from-repo-root. **Every live-indexation/sitemap/schema/redirect item routes via the Phase-5 Risk Register — flagged inline.**

---

## Tier 1 — Quick implementations (< 2 hours)

### REC-3 — Dual-H1 fix · Effort 2 / Risk 1 · ~1.5h
- **Why E2/R1:** ~5-line change to one pure function (`src/lib/markdown/preprocess.ts`) that already exists and has tests (`preprocess.test.ts`). Touches ~97 pages at once but cannot break ranking (additive, content preserved). **TOC dependency disproven** (`TableOfContents.tsx` unused; anchors from `rehype-slug` on text; FAQ extractor on `## FAQs`).
- **Approach:** detect first non-blank, non-frontmatter body line matching `^# [^#]`; rewrite to `## `; only the first occurrence; skip inside `inCodeBlock`. Add a test case.
- **Verify:** re-fetch 5 guides, assert exactly one `<h1>` (the hero). Confirm FAQ section and `#anchor` links unchanged.
- **Files:** `src/lib/markdown/preprocess.ts`, `src/lib/markdown/preprocess.test.ts`.

### REC-4 — Single-source the GONE list (sitemap) · Effort 1 / Risk 2 · ~1h · **Risk Register (sitemap)**
- **Why E1/R2:** one import + one `.filter()`. Risk 2 only because it changes a live crawl signal (sitemap contents); 410 behaviour itself is unchanged.
- **Approach:** export `RETIRED_CONTENT_PATHS` (or a slug set) from a shared module; in `src/app/sitemap.ts` blog loop, exclude any slug whose path is in the set. Alternatively filter in `getAllPosts()`.
- **Files:** `src/middleware.ts:25-29` (export set), `src/app/sitemap.ts:115-121`.
- **Verify:** re-render sitemap, assert `cash-flow-crisis-breaking-cycle` absent; 410 still served.

### REC-7 — Confirm indexing + repoint 4 stale `/services` links · Effort 1 / Risk 1 · ~1h
- **Why E1/R1:** 4 link-string edits in markdown + a GSC URL-Inspection check (no code risk).
- **Approach:** in `how-to-run-successful-pub-events`, `email-marketing-pub-retention`, `quiz-night-ideas`, `menu-engineering-lift-average-spend`, change `/services` → `/ways-to-work` (drops the 308 hop). Run URL Inspection on `/ways-to-work` + 4 packages; request indexing if needed (GSC, not code).
- **Files:** 4 `content/blog/*.md`.

### REC-10a — Add "Services" to nav · Effort 2 / Risk 2 · ~1h
- **Why E2/R2:** trivial JSON edit; Risk 2 because it changes sitewide internal-link distribution and surfaces a hub that may be re-canonicalised later (sequence before REC-10b).
- **Approach:** add `{ "label": "Services", "href": "/services", "order": 3 }` to `mainMenu` + `mobileMenu` in `content/data/navigation.json`; renumber `order`.
- **Verify:** nav renders Services on desktop + mobile; `/services` resolves 200 (confirm not redirected away).

### REC-11 — Trim meta strings + build-time lint · Effort 1 / Risk 1 · ~1.5h
- **Why E1/R1:** 5 description + 2 title string edits (copywriter supplies exact text) plus a small Node check script.
- **Approach:** edit the relevant `src/lib/seo-overrides.ts` entries / route `generateMetadata`. Add `scripts/check-meta-length.ts` and wire into `build`/`lint` alongside the existing `check:growth-language` pattern (fail if any title >60 or description >160).
- **Files:** `src/lib/seo-overrides.ts`, route `generateMetadata`, `package.json:7,9`, new `scripts/`.

### REC-12 — Correct Offer price data · Effort 1 / Risk 2 · ~1h · **Risk Register (schema)**
- **Why E1/R2:** the schema component is unchanged; only JSON `price` values move. Risk 2 = live JSON-LD change; must match CLAIMS exactly.
- **Approach:** in `content/data/services/*.json` set price/Offer to the correct CLAIMS anchor (hourly £75+VAT; on package pages, packages-from £375+VAT). Component `StructuredData.tsx` already renders `Offer`/`priceSpecification`.
- **Verify:** Rich Results Test passes Offer; figures match `/CLAIMS.md`.

### REC-21 — PSI + CrUX baseline · Effort 1 / Risk 1 · ~1h (measurement only)
- Run PSI (mobile-first) + pull CrUX for homepage, a top guide, `/ways-to-work`. No code change. Output feeds any later perf ticket.

### REC-22 — Compress 3 images + HSTS preload · Effort 1 / Risk 1 · ~1h
- Compress the 3 flagged assets to <100KB; optionally add `preload` to HSTS (`middleware.ts:52`) only after confirming all subdomains are HTTPS-ready.

---

## Tier 2 — Medium implementations (2-8 hours)

### REC-1 — Contact-form delivery + enquiry_submit · Effort 3 / Risk 2 · ~4-6h
- **Why E3/R2:** new dependency (`resend`) + secret + GDPR consideration + GA4 event wiring. Risk 2: PII handling (must not introduce new PII storage or PII-in-logs).
- **Approach:** `npm i resend`; add `RESEND_API_KEY` to `.env.example` + Vercel. In `src/app/actions/contact.ts`, after validation `await resend.emails.send(...)` to Peter's inbox; on success return + fire `enquiry_submit` (via client callback to dataLayer). **Remove the `console.log` of name/email (PII-in-logs).** Email-only for v1 — a DB persist is a new PII store needing explicit approval (workspace stop-condition).
- **Verify:** test enquiry on production → Peter receives email; `enquiry_submit` in GA4 DebugView; no PII logged.
- **Files:** `src/app/actions/contact.ts`, `.env.example`, `package.json`.

### REC-5 — Cluster-keyed guide→service bridge · Effort 3 / Risk 1 · ~4-5h
- **Why E3/R1:** template logic + a category→service map + dual-CTA render; additive, easily reverted.
- **Approach:** extend `getCategoryCTA()` (`src/components/blog/BlogPost.tsx:50-96`) to return `{heading, body, href, anchorText}` per `categorySlug`; map events→events service, `marketing`/social→`/services/social-media-marketing-for-pubs`, content→`/services/content-creation-for-pubs`, `turnaround`/empty/quiet→`/fix-my-pub`, compete→`/compete-with-pub-chains`. Replace the hardcoded `/ways-to-work` button (line 224) with the mapped `href`; render WhatsApp + enquiry. Optional `serviceBridge` frontmatter override for one-offs. Copy uses one CLAIMS proof; CI guards British-English/no-savings.
- **Verify:** re-crawl `internal-links.csv` shows topic-clustered guide→service links; each guide's bridge matches its category.
- **Files:** `src/components/blog/BlogPost.tsx` (+ optional `src/lib/blog.ts` for frontmatter field).

### REC-6 — Service-page dual CTA · Effort 2 / Risk 1 · ~2-3h
- **Why E2/R1:** one template swap reusing an existing component; covers all `/services/*`.
- **Approach:** replace the lone `WhatsAppButton` block (`src/components/PubServiceLandingPage.tsx:195-214`) with `PackageCTA` (`src/components/packages/PackageCTA.tsx`); add the 30-day-guarantee line. Add the same block to the `/services` hub hero.
- **Verify:** every `/services/*` shows WhatsApp + "Send an enquiry" → `/contact`.

### REC-2 — Internal-link the 2 orphans · Effort 2 / Risk 2 · ~3h
- **Why E2/R2:** contextual links from hubs/guides; Risk 2 if nav/footer inclusion is chosen (sitewide link-graph change → Risk Register).
- **Approach:** add intent-matched links to `/pub-marketing-agency` + `/compete-with-pub-chains` from `/ways-to-work`, `/capabilities`, and relevant guides (the cluster bridge REC-5 covers compete-with-chains). Consider footer. Then GSC URL-Inspection request-index.
- **Verify:** re-crawl shows ≥3 inbound links each.

### REC-9 — De-duplicate mobile interrupt stack · Effort 2 / Risk 2 · ~3h
- **Why E2/R2:** gating 3 mounted components by route/breakpoint; Risk 2 because mis-gating could hide a CTA on the highest-converting surface — verify on a real 375px device.
- **Approach:** in `src/app/layout.tsx:214-216`, gate `StickyEngagementBar`/`MobileScrollPrompt` so only ONE persistent CTA shows on `/licensees-guide/*` mobile; reconcile with the blog `StickyCTA` (`BlogPost.tsx:144`). Prefer keeping the intent-matched bridge as the single interrupt.
- **Verify:** at 375px a guide shows exactly one persistent bottom CTA; no overlap.

### REC-8 — Commercial body copy + named-channel H2s · Effort 3 / Risk 2 · content-led, ~1-2h dev support
- **Why E3/R2:** mostly copywriting (CLAIMS-bound); dev adds `## Facebook for your pub` / `## Instagram for your pub` H2s with anchors to the social-media service JSON/page. **Gated on REC-2/REC-7 indexation** — copy converts nothing until indexed.
- **Files:** `content/data/services/social-media-marketing-for-pubs.json` (+ `/pub-marketing-agency`, `/fix-my-pub`, paid-social, content service data/pages).

### REC-14 / REC-23 — Position + AI answer-block content pass · Effort 3 / Risk 1 · content-led
- Content adds 40-60 word answer blocks + depth to 6 guides; pairs with REC-3 (dual-H1) for the position gain. Minimal dev.

### REC-13 — Real sitemap lastModified · Effort 2 / Risk 2 · ~2-3h · **Risk Register (sitemap)**
- Drive `lastModified` for static/marketing pages from a real source (e.g. content frontmatter `updatedDate`, or git mtime, or a maintained data map) instead of the hardcoded `2026-04-05`/`2026-03-17` in `src/app/sitemap.ts:15-112`. Blog dates already real.

### REC-19 — Family/kids-events pillar · Effort 3 / Risk 2 · ~1 day content · **GKP-gated**
- Net-new guide using the existing markdown pipeline. Do NOT build until GKP confirms volume.

### REC-20 — GA4 + CTA/enquiry tracking · Effort 3 / Risk 2 · ~4-6h (config + dev)
- **Why E3/R2:** GTM already loads (`layout.tsx:194`; CSP `middleware.ts:61-65`), so this is config + dataLayer pushes, not infra. Risk 2: event-naming/consent correctness.
- **Approach:** add `cta_click {method:whatsapp|phone|email|form}` to the shared `Button`/`WhatsAppButton` components (one wiring) and `enquiry_submit` on form success; configure GA4 events + GTM tags (Analytics owns config).

### REC-16 — FB/IG redirect-stub decision · Effort 3 / Risk 3 · **Risk Register if un-redirected; GKP first**
- **Why E3/R3:** if "keep + named-channel H2s" (recommended) → low risk, content-only (folds into REC-8). If "un-redirect" → restore two pages + reverse `permanentRedirect`, with Medium-High ranking-transition risk (they rank pos 6-7 *via* the redirect). Decision needs GKP demand validation.

---

## Tier 3 — Large implementations (1-5 days)

### REC-18 — Regional location-page system · Effort 4 / Risk 2 · ~2-4 days
- **Why E4/R2:** thicken + genuinely differentiate 9 existing `/pub-marketing-{county}` pages (avoid near-duplicate doorway risk — role rule), ensure discovery (parent hub link + sitemap + internal links), index. Content-heavy. Low ranking risk (additive), but large effort.

### REC-10b — Hub consolidation (5 → 1 canonical) · Effort 4 / Risk 4 · ~2-3 days · **Risk Register (301s)**
- **Why E4/R4:** requires a canonical-hub decision (Content), a 301 map in `next.config.js` for the merged URLs, content folding, and 4-8 week ranking monitoring. Ranking-flux risk on URLs that already rank. **Defer behind the nav-only REC-10a.**

### REC-15 — Rescue-cluster consolidation · Effort 4 / Risk 4 · ~1-2 days · **Risk Register (redirects)**
- **Why E4/R4:** designate `/fix-my-pub` canonical; 301 `/pub-rescue`, `/empty-pub-solutions` (residual-equity risk — `fix my pub` ranks pos 5.7); re-point the empty/quiet guide cluster bridges here. Monitor merged-URL queries.

---

## Major projects (1+ weeks) — none required
No recommendation needs a full URL migration, CMS migration, or architecture rebuild. The centralised, template-driven codebase means the most impactful work is achievable in days, not weeks. The only multi-day items (REC-18, REC-10b, REC-15) are content/routing consolidations, not platform rework.

---

## Effort/Risk summary table (denominator inputs for opportunity scoring)

| Rec | Effort | Risk | Tier | Risk-Register? |
|-----|:------:|:----:|------|:--------------:|
| REC-1 form delivery | 3 | 2 | Medium | — (PII sign-off) |
| REC-2 orphan links | 2 | 2 | Medium | if nav/footer |
| REC-3 dual-H1 | 2 | 1 | Quick | — |
| REC-4 sitemap GONE | 1 | 2 | Quick | **Yes** |
| REC-5 cluster bridge | 3 | 1 | Medium | — |
| REC-6 service dual CTA | 2 | 1 | Medium | — |
| REC-7 confirm index + 4 links | 1 | 1 | Quick | — |
| REC-8 commercial copy + H2s | 3 | 2 | Medium | — |
| REC-9 mobile interrupt de-dupe | 2 | 2 | Medium | — |
| REC-10a nav "Services" | 2 | 2 | Quick | — |
| REC-10b hub consolidation | 4 | 4 | Large | **Yes** |
| REC-11 meta length + lint | 1 | 1 | Quick | — |
| REC-12 Offer price data | 1 | 2 | Quick | **Yes** |
| REC-13 real lastModified | 2 | 2 | Medium | **Yes** |
| REC-14 position content | 3 | 1 | Medium | — |
| REC-15 rescue consolidation | 4 | 4 | Large | **Yes** |
| REC-16 FB/IG decision | 3 | 3 | Medium | **Yes** if un-redirect |
| REC-17 seasonal links | 2 | 1 | Medium | — |
| REC-18 regional system | 4 | 2 | Large | — |
| REC-19 family-events page | 3 | 2 | Medium | — (GKP-gated) |
| REC-20 analytics tracking | 3 | 2 | Medium | — |
| REC-21 PSI/CrUX | 1 | 1 | Quick | — |
| REC-22 images/HSTS | 1 | 1 | Quick | — |
| REC-23 AI answer blocks | 2 | 1 | Medium | — |
