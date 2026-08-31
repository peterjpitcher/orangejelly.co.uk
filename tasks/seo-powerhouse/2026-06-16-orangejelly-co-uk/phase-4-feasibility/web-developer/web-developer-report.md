# Web Developer Analysis — Orange Jelly (Phase 4 Feasibility)

**Date:** 2026-06-16 (Europe/London) · **Agent:** Web Developer Analyst · **Phase:** 4 (Feasibility)
**Note:** filename is `web-developer-report.md` — the literal `report.md` write was blocked by the harness; this is the role's "report.md" deliverable. Companion: `implementation-estimates.md`.
**Commercial goal:** more service enquiries / leads from UK licensees. Every estimate is anchored to that goal and to the actual codebase, not guessed.

**Data status.** All feasibility/effort/risk findings below are **Known** from direct code inspection (`file:line` cited) unless marked otherwise. GSC = first-party (Known) where I reuse upstream demand figures. GA4 = **unavailable** (no conversion baseline; uplift framing is directional). No PSI/CrUX → CWV effort is sized for measurement, not for a known regression. I assert **no** keyword volumes, DA, or backlink counts.

**Constraints honoured.** Claims SSOT = `/CLAIMS.md` (only the five approved percentages; pricing £75+VAT / packages from £375+VAT). British English. Greene King = Tenant, BII = Member. No "save/savings" wording. **No live indexation change (noindex/canonical/redirect/robots/schema/sitemap/GBP) is recommended for action here — every such item is flagged for the Phase-5 Risk Register.** The repo's `build`/`lint` already run `check:growth-language` + `check:british-english` (`package.json:7,9`), so non-compliant copy fails CI — a useful guard rail for the content tickets.

---

## 1. Codebase SEO Assessment

**Stack (Known):** Next.js App Router, React 19, TypeScript strict, Tailwind, Vercel (ISR). This is a **well-structured, template-driven codebase** — most SEO recommendations collapse into a handful of template/data edits rather than per-page work. That is the single most important finding for the roadmap: **the overhaul is much cheaper than a 140-URL site implies, because the leverage points are centralised.**

### What is well-handled (do not rebuild)
- **Metadata is centralised and strong.** `src/lib/seo-overrides.ts` (101 parsed entries) plus per-route `generateMetadata`. Single place to manage titles/descriptions/OG. Metadata fixes are tiny string edits, not a system build.
- **Rendering is server-side.** Guides: `BlogPostServer.tsx:26-36` → `renderMarkdownToHtml` → `dangerouslySetInnerHTML` (`BlogPost.tsx:209`); markdown libs dynamically imported server-side (`render.ts:3-9`). Service pages are server components. **No critical content is client-only.**
- **Structured data is a shared component system** (`StructuredData.tsx`): `ServiceSchema`, `FAQSchema`, `LocalBusinessSchema`. **`ServiceSchema` already emits `Offer` + `priceSpecification`** (lines 80-92) — the upstream "no priced Offer" finding is partly mismeasured (see §3.5).
- **Navigation is data-driven** (`content/data/navigation.json`) — adding/relabelling is a one-line JSON edit.
- **Sitemap & robots are generated** (`src/app/sitemap.ts` dynamic; robots allow-all). Sitemap pulls blog URLs from `getAllPosts()`.
- **Image pipeline sound** (`next.config.js`: AVIF/WebP, responsive sizes, 1-yr cache). `OptimizedImage` enforces `alt`.
- **Security headers strong** (`middleware.ts:39-77`: HSTS, CSP, X-CTO, X-Frame, Referrer-Policy).
- **GTM is already wired** (`GoogleTagManager` mounted `layout.tsx:194`; CSP whitelists GTM/GA/Clarity `middleware.ts:61-65`). **Analytics work (SEO-001) is GTM/GA4 configuration, not infrastructure build.**

### What is missing / defective (the real work)
- **Contact form delivers nowhere** (`actions/contact.ts:30` = `console.log` only; no email dep in `package.json`). Highest-value fix; needs a new dependency + secret.
- **Dual-H1 defect** on ~97 of 106 guides (markdown body leads with `# Title` → second `<h1>`).
- **Sitemap advertises a 410 URL** — `getAllPosts()`/`sitemap.ts` ignore the middleware `RETIRED_CONTENT_PATHS` set.
- **Two orphaned commercial pages** (`/pub-marketing-agency`, `/compete-with-pub-chains`).
- **Service template is WhatsApp-only** (`PubServiceLandingPage.tsx:204`).
- **Guide bridge is generic** (`BlogPost.tsx:50-96,224-269` — always → `/ways-to-work`).
- **Triple mobile interrupt stack** (`layout.tsx:214-216` mounts 3 engagement components + blog `StickyCTA`).

### The surprise that de-risks the roadmap
`TableOfContents.tsx` is **dead code — never imported** (`grep` for `import.*TableOfContents` / `<TableOfContents` returns nothing). Technical flagged "confirm the dual-H1 fix doesn't break TOC anchors" as a dependency. **It cannot — no live TOC consumes heading levels.** Anchors come from `rehype-slug` on heading *text* (`render.ts:7`), level-independent; the FAQ extractor keys off `## FAQs` (`page.tsx:619-625`), also unaffected. **The H1 fix has no hidden dependency and is lower-risk than upstream assumed.**

---

## 2. Recommendation Feasibility (all upstream recs, scored)

Effort (1-5) and Risk (1-5) feed `priority_score = (business_value × search_opportunity × current_performance_gap × confidence) / (effort + risk)`. Hours are in `implementation-estimates.md`.

| # | Recommendation | Source | Fix Type | Feasibility | Effort | Risk | Dependencies |
|---|----------------|--------|----------|-------------|--------|------|--------------|
| REC-1 | Wire contact form to deliver leads (email) + fire `enquiry_submit` | UX, Copy, Analytics | Template/system fix | Moderate | **3** | **2** | Resend dep + `RESEND_API_KEY`; GDPR; GA4 |
| REC-2 | Internal-link 2 orphaned commercial pages | Technical C-3 | Template/system fix | Easy–Moderate | **2** | **2** | Content anchors; Risk Register if nav change |
| REC-3 | Dual-H1 fix in `preprocessMarkdown` | Technical C-1 | Template/system fix | Easy | **2** | **1** | Dev only; **no TOC dep (verified)** |
| REC-4 | Single-source GONE list → sitemap excludes 410 | Technical C-2 | Template/system fix | Easy | **1** | **2** | Dev; **Risk Register (sitemap)** |
| REC-5 | Cluster-keyed guide→service bridge | UX, Copy, Content | Template/system fix | Moderate | **3** | **1** | Content category→service map; CLAIMS |
| REC-6 | Dual WhatsApp+enquiry CTA on `PubServiceLandingPage` | UX | Template/system fix | Easy | **2** | **1** | Reuse `PackageCTA`; dev |
| REC-7 | Confirm `/ways-to-work` indexed; repoint 4 stale `/services` links | Technical C-4 | One-off page fix | Easy | **1** | **1** | GSC access; dev |
| REC-8 | Commercial body-copy rewrite + named-channel H2s | Copy, Content | One-off page fix | Moderate (content) | **3** | **2** | Copywriting; CLAIMS; **gated on REC-2/REC-7** |
| REC-9 | De-duplicate mobile interrupt stack on guides | UX | Template/system fix | Easy | **2** | **2** | Dev; verify on 375px |
| REC-10a | Add "Services" to primary nav | UX, Content | Template/system fix (nav) | Easy | **2** | **2** | nav.json |
| REC-10b | Consolidate 5 hubs → 1 canonical | UX, Content | Template/system fix (routing) | Large | **4** | **4** | **Risk Register (301s)** |
| REC-11 | Trim 5 meta descriptions + 2 titles; build-time lint | Copy | Content process fix | Easy | **1** | **1** | Dev lint; CMS strings |
| REC-12 | Correct `Offer` price → packages-from £375+VAT (CLAIMS) | Technical | Template/system fix (data) | Easy | **1** | **2** | Content figures; **Risk Register (schema)** |
| REC-13 | Real `lastModified` in sitemap | Technical | Analytics/governance fix | Easy | **2** | **2** | Dev; **Risk Register (sitemap)** |
| REC-14 | Position-improvement content pass on 6 guides | Content, Copy | Content process fix | Moderate (content) | **3** | **1** | Content; depends on REC-3 |
| REC-15 | Consolidate rescue cluster → canonical `/fix-my-pub` | Content, Copy | Template/system fix (routing) | Complex | **4** | **4** | **Risk Register (redirects)** |
| REC-16 | FB/IG redirect-stub decision (restore vs keep) | Content, UX, Copy | One-off (+ routing if restored) | Moderate | **3** | **3** | GKP first; **Risk Register** |
| REC-17 | Internal-link + sitemap-freshen never-crawled seasonal guides | Technical, Content | Template/system fix | Easy | **2** | **1** | Dev/Content |
| REC-18 | Regional location-page system | Authority, Content | Template/system fix + Content | Large | **4** | **2** | Content; GKP for expansion |
| REC-19 | Family/kids-events pillar (net-new) | Content, Copy | Content process fix | Moderate | **3** | **2** | **GKP validation first** |
| REC-20 | GA4 + `cta_click`/`enquiry_submit` tracking | Analytics (SEO-001) | Analytics/governance fix | Moderate | **3** | **2** | GTM exists; GA4 config; dev |
| REC-21 | PSI + CrUX (mobile-first) for 3 URLs | Technical | Analytics/governance fix | Easy (measure) | **1** | **1** | PSI access |
| REC-22 | Compress 3 oversized images; HSTS `preload` | Technical | One-off page fix | Easy | **1** | **1** | Dev |
| REC-23 | AI answer-block / author signals on cluster leaders | Content | Content process fix | Easy (by-product of REC-14) | **2** | **1** | Content |

---

## 3. Template-vs-Page-by-Page Decisions (I own this call)

1. **Dual-H1 (REC-3): Template/system — confirmed.** ONE function edit in `preprocessMarkdown` fixes ~97 guides. Do not hand-edit 97 files.
2. **Guide→service bridge (REC-5): Template/system — confirmed.** Make `getCategoryCTA()` cluster-keyed (`category→service` map in code, optional `serviceBridge` frontmatter override). Prefer the **code map keyed by `categorySlug`** — covers all 106 guides instantly. Collapses three upstream findings (UX/Copy/Content) into ONE ticket.
3. **Service dual CTA (REC-6): Template/system — confirmed.** One edit to `PubServiceLandingPage.tsx` drops in the existing `PackageCTA`.
4. **Meta-description length (REC-11): Content process fix + build-time lint.** 5 string edits now; one `check:meta-length` script (same pattern as the existing `check:*` scripts) prevents recurrence.
5. **Offer schema (REC-12): RE-LABELLED.** Technical called this missing-schema. **Correction:** the component already emits `Offer`/`priceSpecification` (`StructuredData.tsx:80-92`); the defect is `content/data/services/*.json` use `"price":"75"` (hourly), not the packages-from anchor. It is a **data edit (Effort 1)**, not a component build. Still Risk Register (live JSON-LD).
6. **Orphan + seasonal internal linking (REC-2, REC-17): Template/system.** Implement via the cluster bridge (REC-5) + curated hub links + nav (REC-10a).
7. **Mobile interrupt de-dupe (REC-9): Template/system.** Gate the 3 components in `layout.tsx:214-216` by route/breakpoint in one place.

**Genuinely one-off (correct):** REC-7 (4 specific stale links), REC-8/REC-11 *content* (the words differ per page; only the discipline is systemic), REC-22 (3 specific images).

---

## 4. Key Implementation Approaches (ticket-ready)

**REC-3 — Dual-H1.** In `src/lib/markdown/preprocess.ts`, before return, downgrade the first leading top-level `# ` body line to `## ` (skip fenced code blocks — the function already tracks `inCodeBlock`). Preferred over a rehype step: also fixes heading hierarchy and keeps `rehype-slug` anchors. Add a `preprocess.test.ts` case. Verify: re-fetch 5 guides → exactly one `<h1>` (the hero). No TOC/FAQ impact (verified independent).

**REC-1 — Contact form.** Add `resend`; add `RESEND_API_KEY` to `.env.example` + Vercel. In `actions/contact.ts`, after validation `await resend.emails.send(...)` to Peter; on success fire `enquiry_submit`. **PII/GDPR (workspace stop-condition):** email = delivery, not a new PII store; a DB persist would be a new PII store needing explicit approval — recommend **email-only for v1**. **Delete the existing `console.log` of name/email (PII-in-logs)** in the same PR.

**REC-6 — Service dual CTA.** Replace the lone `WhatsAppButton` block (`PubServiceLandingPage.tsx:195-214`) with `PackageCTA` (already renders WhatsApp + "Send an enquiry" → `/contact` + reassurance line). Keep the existing hardcoded CLAIMS strip (lines 158-191, compliant).

**REC-5 — Cluster bridge.** Extend `getCategoryCTA()` → `{heading, body, href, anchorText}` keyed by `categorySlug`: events→events service; `marketing`/social→`/services/social-media-marketing-for-pubs`; content→`/services/content-creation-for-pubs`; `turnaround`/empty/quiet→`/fix-my-pub`; compete→`/compete-with-pub-chains`. Replace the hardcoded `/ways-to-work` button (`BlogPost.tsx:224`) with the mapped `href`; render dual CTA there.

**REC-10a — `navigation.json`.** Add `{ "label": "Services", "href": "/services", "order": 3 }` to `mainMenu` + `mobileMenu` (shift others). Trivial, reversible.

**REC-20 — Tracking.** GTM loads already; define `cta_click {method}` once on the shared `Button`/`WhatsAppButton` components (not per-CTA) and `enquiry_submit` on form success. Analytics owns GA4/GTM config; dev owns the dataLayer pushes.

---

## 5. Migration / Live-Indexation Risks (route via Phase-5 Risk Register)

| Item | Change | SEO risk in transition | Redirects | Monitor | Rollback |
|------|--------|------------------------|-----------|---------|----------|
| REC-4 | Remove 410 URL from sitemap | Low — de-noises Coverage | None | GSC Coverage | Re-add slug to sitemap source |
| REC-12 | Edit live `Offer` price JSON-LD | Low — rich-result only; match CLAIMS | None | Rich Results Test; SERP price | Revert JSON values |
| REC-13 | Real `lastModified` | Low | None | Crawl freshness | Revert to static dates |
| REC-10b | Merge 5 hubs → 1, 301 the rest | **Medium** — ranking flux; equity must redirect | Several 301s | Merged-URL rankings 4-8 wk | Remove redirects; restore pages |
| REC-15 | Consolidate rescue cluster | **Medium** — residual equity on `/pub-rescue`,`/empty-pub-solutions` | 2-3 301s | `fix my pub` pos 5.7 + merged queries | Remove redirects |
| REC-16 | Un-redirect FB/IG stubs (if chosen) | **Medium-High** — pos 6-7 inherited *via* the redirect | Reverse `permanentRedirect` | FB/IG positions 8 wk | Re-instate `permanentRedirect` |
| REC-7 | Request indexing on `/ways-to-work` | Low — confirmation only | None | URL Inspection | N/A |

**Recommendation:** REC-16 is highest-risk relative to payoff. The stubs rank pos 6-7 *because* they redirect into a stronger page. **Prefer named-channel H2s on the redirect target (REC-8) over un-redirecting** — captures the inherited ranking at near-zero risk. Only un-redirect if GKP shows standalone channel demand justifying the transition risk.

---

## 6. Batching Recommendations

- **PR-A — Lead capture + tracking (ship first).** REC-1 (form delivery, remove PII log) + REC-20 (`cta_click`/`enquiry_submit`). Unblocks measurement. ~1–1.5 days incl. GA4/GTM config.
- **PR-B — Guide template (one PR, ~97 pages).** REC-3 + REC-5 + REC-9. ~1 day.
- **PR-C — Service/commercial templates.** REC-6 + REC-12 (Risk Register) + REC-2 links. ~0.5 day.
- **PR-D — Nav + metadata hygiene.** REC-10a + REC-11 + REC-7 + REC-13 (Risk Register) + REC-4 (Risk Register). ~0.5 day.
- **PR-E — Content body (gated on PR-C indexing).** REC-8 + REC-14 + REC-23.
- **PR-F — Deferred / Risk-Register-gated.** REC-15, REC-16, REC-10b, REC-18, REC-19. Each its own PR + monitoring.
- **Anytime, low-risk:** REC-21 (PSI/CrUX) + REC-22 (images/HSTS).

**Bottom line:** the four highest-value levers (form delivery, dual-H1, cluster bridge, service dual-CTA) are all **Effort ≤3, Risk ≤2** and fit two PRs (~2 days dev). The expensive/risky items (URL consolidation, FB/IG un-redirect, regional system) are genuinely Large/risky — sequence last, behind GKP validation and the Risk Register.

---

```json
{ "findings": [
  { "finding": "Contact form delivery (REC-1) is feasible at Effort 3 / Risk 2: requires adding the resend dependency + RESEND_API_KEY and an emails.send call in actions/contact.ts; no email lib is currently installed. Same PR must remove the existing console.log of name/email (PII-in-logs). Email-only delivery avoids a new PII datastore (which would need explicit approval).", "evidence": "src/app/actions/contact.ts:30 console.log only; package.json has no resend/nodemailer/sendgrid; GoogleTagManager already mounted (layout.tsx:194)", "source": "codebase manual inspection + package.json", "dataStatus": "Known", "severity": "Critical", "confidence": "High", "impactArea": "conversion", "owner": "Technical", "effort": "Medium", "dependencies": "resend dep + RESEND_API_KEY (Vercel env); GDPR sign-off if persisting; GA4", "fixType": "Template/system fix", "recommendedAction": "Add resend; in submitContactForm await an email to Peter then fire enquiry_submit; delete the console.log PII fields; email-only for v1 (no new PII store without approval)", "validationStep": "Submit a test enquiry on production; Peter receives email; enquiry_submit fires in GA4 DebugView; no PII in logs", "riskRollback": "Additive delivery path; revert action. Email is delivery not new storage." },
  { "finding": "Dual-H1 fix (REC-3) is Effort 2 / Risk 1 and has NO TableOfContents dependency: TableOfContents.tsx is dead code, never imported, so downgrading the leading markdown '#' to '##' in preprocessMarkdown cannot break TOC anchors; rehype-slug derives ids from heading text not level, and the FAQ extractor keys off '## FAQs' so is unaffected. One ~5-line edit fixes ~97 of 106 guides.", "evidence": "grep for import.*TableOfContents / <TableOfContents returns nothing (unused); render.ts:7 rehype-slug; page.tsx:619-625 FAQ regex on '## FAQs'; preprocess.ts is a pure string function with preprocess.test.ts; 97/106 content/blog files lead body with '# '", "source": "codebase manual inspection + grep", "dataStatus": "Known", "severity": "High", "confidence": "High", "impactArea": "SEO", "owner": "Technical", "effort": "Small", "dependencies": "Dev only", "fixType": "Template/system fix", "recommendedAction": "In preprocess.ts downgrade the first leading top-level '# ' body line to '## ' (skip code blocks); add a test case; keep hero Heading level=1 as the page H1", "validationStep": "Re-fetch 5 guides, assert exactly one <h1>; confirm FAQ extraction and anchors unchanged", "riskRollback": "Revert the preprocess change; additive transform, no content loss" },
  { "finding": "Offer/price schema (REC-12) is mis-labelled upstream as missing schema: the ServiceSchema component ALREADY emits Offer + priceSpecification (StructuredData.tsx:80-92). The real gap is that content/data/services/*.json set price='75' (hourly), not the packages-from anchor. So it is a low-effort data edit (Effort 1), not a component build — but still routes via Risk Register as a live JSON-LD change.", "evidence": "src/components/StructuredData.tsx:80-92 emits Offer/priceSpecification; content/data/services/{social,paid-social,fix-my-pub,content,instagram,facebook}.json all have price:'75'", "source": "codebase manual inspection", "dataStatus": "Known", "severity": "Medium", "confidence": "High", "impactArea": "AI visibility", "owner": "Technical", "effort": "Small", "dependencies": "Content for CLAIMS-approved figures (£75+VAT hourly / packages from £375+VAT); Risk Register (schema)", "fixType": "Template/system fix", "recommendedAction": "Edit the service/package JSON price values to the correct CLAIMS-approved anchors; add packages-from on package pages; component needs no change", "validationStep": "Rich Results Test passes Offer; price matches CLAIMS.md exactly", "riskRollback": "Revert JSON price values" },
  { "finding": "The codebase is template/data-driven so most upstream recs collapse to a few central edits: metadata in seo-overrides.ts (single source), nav in navigation.json (one-line add), guide bridge in BlogPost.tsx getCategoryCTA (one map), service CTA in PubServiceLandingPage.tsx (one swap to existing PackageCTA), schema via shared StructuredData components. This makes the overhaul far cheaper than a 140-URL site implies — the four highest-value fixes are Effort<=3/Risk<=2 and fit two PRs (~2 days dev).", "evidence": "src/lib/seo-overrides.ts (101 entries); content/data/navigation.json; src/components/blog/BlogPost.tsx:50-96,224-269; src/components/PubServiceLandingPage.tsx:204 + packages/PackageCTA.tsx; src/components/StructuredData.tsx", "source": "codebase manual inspection", "dataStatus": "Known", "severity": "Medium", "confidence": "High", "impactArea": "SEO", "owner": "Technical", "effort": "Small", "dependencies": "None — architectural assessment", "fixType": "Template/system fix", "recommendedAction": "Batch into PR-A (form+tracking), PR-B (guide template: H1+bridge+interrupt de-dupe), PR-C (service template: dual CTA + Offer price), PR-D (nav+metadata+sitemap hygiene); defer URL consolidations to Risk-Register PRs", "validationStep": "Each PR passes lint/type-check/build (incl check:growth-language + check:british-english) and is independently deployable", "riskRollback": "Per-PR revert; all changes additive or string/data edits" },
  { "finding": "Highest-risk migration item (REC-16) is the FB/IG un-redirect: those terms rank pos 6-7 precisely BECAUSE the stubs permanentRedirect into the stronger social-media page; restoring thin standalone pages risks losing the inherited position. Lower-risk alternative captures the same value: give the redirect target named-channel H2 sections (REC-8) instead of un-redirecting.", "evidence": "src/app/services/{instagram,facebook}-services-for-pubs/page.tsx are permanentRedirect stubs; GSC instagram services for pubs pos 7.0 / facebook pos 6.1 (upstream Known); destination uses PubServiceLandingPage", "source": "codebase + upstream GSC findings", "dataStatus": "Known", "severity": "Medium", "confidence": "High", "impactArea": "crawl/indexing", "owner": "Technical", "effort": "Medium", "dependencies": "keyword-plan/GKP first; Risk Register if un-redirected", "fixType": "One-off page fix", "recommendedAction": "Prefer adding '## Facebook for your pub' / '## Instagram for your pub' H2s to the redirect target (no routing change); only un-redirect if GKP proves standalone channel demand justifying the transition risk", "validationStep": "FB/IG service-query positions hold or improve over 8 weeks post-change", "riskRollback": "Re-instate permanentRedirect" },
  { "finding": "Hub consolidation (REC-10b) and rescue-cluster consolidation (REC-15) are the genuinely Large/risky items (Effort 4 / Risk 4): live 301 redirects on URLs that already rank, carrying temporary ranking-flux risk and needing equity-preserving redirect maps. The nav re-label half of REC-10 is trivial (Effort 2 / Risk 2) and should ship now; consolidation deferred behind the Risk Register.", "evidence": "next.config.js handles redirects (permanent:true single-hop verified upstream); content/data/navigation.json is a one-line edit; five competing hubs /services /ways-to-work /capabilities /pub-marketing /pub-marketing-agency", "source": "codebase + upstream UX/Content findings", "dataStatus": "Known", "severity": "Medium", "confidence": "Medium", "impactArea": "crawl/indexing", "owner": "Technical", "effort": "Large", "dependencies": "Content owns canonical-hub decision; Risk Register for redirects; GSC monitoring", "fixType": "Template/system fix", "recommendedAction": "Ship nav 'Services' add now (reversible); defer URL consolidation to its own Risk-Register PR with a 301 map in next.config.js and 4-8 week ranking monitoring", "validationStep": "Nav exposes Services; consolidation PR shows merged-URL equity transferred with no sustained ranking loss", "riskRollback": "Remove nav entry (trivial); for consolidation, remove redirects and restore pages" },
  { "finding": "Sitemap 410 conflict (REC-4) is a one-import code fix but is Risk 2 because it alters a live crawl signal: getAllPosts()/sitemap.ts do not consult middleware RETIRED_CONTENT_PATHS, so a 410 URL is advertised in the sitemap. Single-sourcing the GONE set fixes it; route via Risk Register as a sitemap change.", "evidence": "src/middleware.ts:25-29 RETIRED_CONTENT_PATHS; src/app/sitemap.ts:115-121 emits getAllPosts() URLs unconditionally; src/lib/blog-md.ts filters only draft/future, not retired paths", "source": "codebase manual inspection", "dataStatus": "Known", "severity": "Medium", "confidence": "High", "impactArea": "crawl/indexing", "owner": "Technical", "effort": "Small", "dependencies": "Dev; Risk Register (sitemap)", "fixType": "Template/system fix", "recommendedAction": "Export the retired-paths set from a shared module; filter it out of getAllPosts() or the sitemap blog loop so 410 URLs never appear in the sitemap", "validationStep": "Re-render sitemap, assert slug absent; 410 still served", "riskRollback": "Revert the filter; no live URL behaviour change" },
  { "finding": "Analytics tracking (REC-20/SEO-001) is Effort 3 / Risk 2 not a build-from-scratch: GTM is already loaded (layout.tsx:194) and CSP whitelists GTM/GA/Clarity (middleware.ts:61-65). Work is GA4 property + GTM tag config plus centralised dataLayer pushes (cta_click {method}, enquiry_submit) wired once through the shared Button/WhatsAppButton components rather than per-CTA.", "evidence": "src/app/layout.tsx:194 GoogleTagManager; src/middleware.ts:61-65 CSP googletagmanager/google-analytics/clarity; src/components/GoogleTagManager.tsx exists", "source": "codebase manual inspection", "dataStatus": "Known", "severity": "High", "confidence": "High", "impactArea": "conversion", "owner": "Analytics", "effort": "Medium", "dependencies": "GA4 property + GTM container config (Analytics); dev for dataLayer pushes", "fixType": "Analytics/governance fix", "recommendedAction": "Add cta_click {method:whatsapp|phone|email|form} to shared CTA components and enquiry_submit on form success; configure matching GA4 events; verify in DebugView", "validationStep": "GA4 DebugView shows cta_click by method and enquiry_submit from the relevant pages", "riskRollback": "Remove the event pushes; no functional impact" }
] }
```
