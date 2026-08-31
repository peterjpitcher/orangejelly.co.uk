# UX & Conversion Analysis — Orange Jelly (orangejelly.co.uk)

**Author:** UX/CRO Specialist · **Date:** 2026-07-07 · **Mode:** Full Overhaul, second run
**Scope (per Strategy §7):** enquiry path on the reclaimed named-channel pages; verify the June SEO-006 dual-CTA shipped; mobile-first assessment (mobile is the commercial surface); /contact friction; newsletter mount as second-chance conversion.
**Method:** codebase inspection at `main @ 6116fe19` + live HTTP fetches (2026-07-07). Where a claim rests on rendered-HTML vs markup inference, it is labelled. I cannot run a real browser — no interactive form submission, no JS-rendered DOM, no real tap-target measurement. Backend delivery of the contact form is traced in code but not proven with a live test submission (handed to Analytics).

---

## Summary

**Conversion-path verdict: the path DELIVERS in code, but the primary conversion surface is WhatsApp-only, and the single form-based enquiry route is confined to two page types.** The June "silent dead form" era is genuinely over — `submitContactForm` validates server-side, runs a honeypot, and only returns success if `storeContactLead` writes to Supabase (fails loudly to a WhatsApp fallback otherwise). That is the right architecture. But three structural CRO problems sit on top of it:

1. **The service landing template (`PubServiceLandingPage`) offers WhatsApp only — no enquiry-form option.** The June SEO-006 dual-CTA (WhatsApp + enquiry) did **NOT** ship on the service template. It shipped on **one component only — `PackageCTA`** (WhatsApp + "Send an enquiry" → /contact), which is used on package/`/fix-my-pub` pages, not on the reclaimed named-channel service pages. So the highest-intent inherited traffic (social/instagram/facebook queries) lands on a page whose only conversion action is "open WhatsApp". Anyone not ready to open a WhatsApp chat with a stranger has no lower-commitment route.

2. **The reclaimed-channel page situation has changed under the strategy's feet and needs reconciliation.** In the codebase at HEAD, `/services/instagram-services-for-pubs` and `/services/facebook-services-for-pubs` are now `permanentRedirect` (308) → `/services/social-media-marketing-for-pubs`. But **production still serves HTTP 200** for the instagram URL (verified live 2026-07-07). So the consolidation is committed in code but **not deployed** — production still shows the thin, self-canonicalising page the strategy described. This is a deploy-lag / staged-not-shipped state, not a contradiction. Either way, the consolidation target (`social-media-marketing-for-pubs`) is WhatsApp-only.

3. **The newsletter form is orphaned — mounted nowhere.** `NewsletterForm`/`NewsletterSignup` components and the `newsletter.ts` action exist and write to Supabase, but no page in `src/app` renders them. The second-chance conversion opportunity on the guide engine (the site's largest traffic source) is completely unrealised.

Mobile hygiene is genuinely good at the component level (44–56px min tap targets, iOS 16px inputs, safe-area insets, `touch-action: manipulation`) — the mobile problem is not tap targets, it is **CTA choice**: a single WhatsApp deep-link as the only conversion action on the commercial surface.

---

## Conversion-path integrity — does every priority commercial page have a working route to enquiry?

| Page | Route/template | Enquiry route present? | Delivery |
|---|---|---|---|
| /contact | ContactPage + `ContactForm` | **Form (6 fields) + WhatsApp + tel + mailto** | Form → `submitContactForm` → `storeContactLead` (Supabase). Traced in code, delivers or fails loudly. Live test outstanding (Analytics). |
| /fix-my-pub | uses `PackageCTA` | **WhatsApp + "Send an enquiry" → /contact** (dual) | PackageCTA dual-CTA present. Good. |
| /ways-to-work + packages | `PackageCTA` / `PackageDetail` | **Dual (WhatsApp + enquiry)** | Good. |
| /services/social-media-marketing-for-pubs | `PubServiceLandingPage` | **WhatsApp ONLY** (Hero CTA + bottom CTA both wa.me) | No form link. Highest-intent inherited traffic lands here. |
| /services/content-creation-for-pubs | `PubServiceLandingPage` | **WhatsApp ONLY** | Same. |
| /services/paid-social-for-pubs | `PubServiceLandingPage` | **WhatsApp ONLY** | Same. |
| /services/instagram-services-for-pubs | `permanentRedirect` in code; **200 thin page in prod** | In prod: WhatsApp only (thin) | Staged redirect not deployed. |
| /pub-marketing-agency, /compete-with-pub-chains, /capabilities | app pages (not inspected this pass for CTA) | Inferred WhatsApp via `CTASection` | `CTASection` is WhatsApp-only (`TrackedButton` → `URLS.whatsapp`). |
| Guides (`/licensees-guide/*`) | `BlogPost.tsx` | **WhatsApp + `/ways-to-work` + bridge link.** No form, no newsletter. | Bridge CTA present & tracked (`guide_service_bridge`). |

**Verdict:** No page silently drops a lead — the form path is real and the WhatsApp/tel/mailto links resolve. But **the commercial service pages that already rank have no form-based enquiry option** — they are single-CTA (WhatsApp). For a cold organic visitor from a "instagram services for pubs" search, "open WhatsApp and message a stranger" is a high-commitment ask with no fallback. This is a **"ranks but weak conversion route"** pattern — High severity for the reclaimed-channel pages specifically, because they are the highest-intent traffic the site can get and the strategy's entire P1 rests on converting them.

### Did the SEO-006 dual-CTA ship? — NO (partially)

- **Shipped:** `PackageCTA.tsx` — WhatsApp primary + "Send an enquiry" outline button → `/contact?package=<slug>`, with reassurance micro-copy. This is exactly the dual-CTA pattern. It covers package pages and `/fix-my-pub`.
- **NOT shipped:** the **service landing template** (`PubServiceLandingPage.tsx`), which renders every named-channel service page. Its Hero CTA is WhatsApp-only and its bottom CTA section is a single `WhatsAppButton`. No enquiry-form option anywhere on the template.
- **Consequence:** the pages the strategy names as the P1 reclaim targets are precisely the ones that did NOT get the dual-CTA. The fix is a **template/system fix** — add the enquiry option to `PubServiceLandingPage`, ideally by reusing the `PackageCTA` dual-button pattern (or lifting it into a shared `ServiceCTA`).

---

## Landing Page Assessments

| Page | Search Intent Match | Above-the-Fold | CTA Clarity | Mobile | Trust Signals | Overall |
|------|-------------------|-----------------|-------------|--------|---------------|---------|
| /services/social-media-marketing-for-pubs | Good (title + hero match "social media marketing for pubs") | Hero H1 + subtitle + single WhatsApp CTA | Single WhatsApp CTA — clear but **only one commitment level** | Tap targets fine; single deep-link CTA | Price ("from £375 + VAT"), "no contracts", The Anchor proof in body | **Amber — converts only the WhatsApp-ready** |
| /services/instagram-services-for-pubs (prod, thin) | Ranks pos 7.0 but 153 words, canonical→homepage | Thin | WhatsApp only | ok | Weak (thin body) | **Red in prod — self-cancelling** (redirect staged, not live) |
| /fix-my-pub | Strong recovery framing; differentiated vs insolvency SERP | H1 "Pub Struggling? Let's Fix It." + PackageCTA dual | **Dual CTA — good** | Good | ProofStrip, case study, guarantee, price | **Green** |
| /contact | Direct intent | Hero + "Three Ways to Start Momentum" | Multiple clear routes | Form inputs 16px, 44px submit | Availability status, WhatsApp-preferred, response-time copy | **Green** |
| /ways-to-work | Package/pricing intent | H1 "Clear packages. Honest pricing." | PackageCTA dual per package | Good | Transparent pricing, payment plans | **Green** |

---

## Conversion Flow Issues

| Flow | Steps | Friction Points | Recommendation | Impact |
|------|-------|----------------|----------------|--------|
| Organic → named-channel service page → enquiry | Land → (WhatsApp only) → open WhatsApp app → type → send | **Single high-commitment CTA.** No form fallback for the not-ready-to-chat visitor. Leaving the site to a messaging app is a context switch that loses the hesitant. | Add dual-CTA (WhatsApp + "Send an enquiry" → `/contact?service=<slug>`) to `PubServiceLandingPage` bottom CTA and Hero. Reuse `PackageCTA` pattern. | High — this is the P1 traffic |
| Organic guide → conversion | Land → read → bridge link → service page → WhatsApp | Bridge lands on a WhatsApp-only service page (compounds the above). No email-capture on guide for the not-yet-ready reader. | Mount `NewsletterForm` on `BlogPost.tsx` as a second-chance capture; ensure bridge target has a form option. | Medium — largest traffic source, lowest commercial intent |
| /contact form completion | Land → 6 fields → submit | Message field requires ≥10 chars (reasonable). Package select is optional and helpful. No inline per-field validation shown until submit attempt (RHF default is onSubmit). Success replaces form (good). | Consider onBlur validation mode; otherwise low friction. Field count is fine. | Low — form is already well-built |

---

## Mobile-First Assessment (mobile ≈ commercial surface)

Assessed from component markup + Tailwind classes (not live device measurement).

**Good (verified in markup):**
- `WhatsAppButton` sizes enforce `min-h-[44px]` (small) / `min-h-[48px]` (medium) / `min-h-[56px]` (large) — meets 44px WCAG target.
- `MobileCTA` utility: `min-height: max(44px, ...)`, bumps to 48px under 768px, sets `font-size: 1rem` (16px) to prevent iOS zoom, `touch-action: manipulation`, safe-area-inset padding.
- Contact form submit is `min-h-[44px]`; `StickyCTA` close button is `min-h-[44px] min-w-[44px]`.
- Hero secondary action button is `min-h-[56px]`.

**Problem (the real mobile CRO issue):**
- On the commercial service surface, the **only** above-the-fold conversion action on mobile is a single WhatsApp deep-link. There is no visible in-page form and no lower-commitment alternative. On mobile this is defensible (WhatsApp is native and fast) — but it should be a **choice**, not the only door. Dual-CTA closes this.
- `PubServiceLandingPage` Hero uses `showCTA` (WhatsApp) with no `secondaryAction` wired for the service pages — so even the Hero's built-in secondary-button slot is unused. Wiring `secondaryAction={{ text: 'Send an enquiry', href: '/contact?service=...' }}` is a near-zero-effort win.

**Not verifiable here:** actual CLS/LCP on mobile, real tap accuracy, whether the JS-shell ("Loading Orange Jelly...") seen on the live instagram fetch causes a perceptible blank-flash on mobile (it may — the live HTML for that route is a client-render placeholder, which is a perceived-speed / interaction-readiness risk; flagged to Technical/Web-Dev).

---

## /contact Page Friction Audit

- **Fields:** 6 — Name, Email, Phone (optional), Venue Name, Package (optional select), Message. All reasonable for a considered B2B enquiry; nothing to cut. Phone and Package are explicitly optional.
- **Honeypot:** present — hidden `website` field, `tabIndex={-1}`, `aria-hidden`, `autoComplete="off"`; server short-circuits to success if filled. Good.
- **Validation:** Zod schema + RHF; `FormMessage` renders inline per field. Server re-validates in `submitContactForm`. Default RHF mode is onSubmit, so errors appear after first submit attempt (acceptable; onBlur would be marginally smoother).
- **Error state:** `role="alert"` red banner: "Something went wrong. Please try again or message Peter on WhatsApp instead." — good, gives a fallback route.
- **Success state:** replaces form with `role="status"` confirmation and resets. Good.
- **Loading/double-submit:** submit button `disabled` while `submitting`, label switches to "Sending...". Good.
- **Reassurance copy:** "Payment plans available on all packages", "Prefer to write? ... Peter will get back to you", availability status, response-time lines. Strong.
- **Package deep-link:** `?package=<slug>` preselects the package dropdown (`useSearchParams`) — nice touch that carries intent from `PackageCTA`.

**Verdict: /contact is well-built and low-friction.** The gap is not on /contact — it is that too few pages route to it.

---

## Newsletter Form — second-chance conversion

- `NewsletterForm` (`src/components/NewsletterForm.tsx` re-export), `newsletter-form.tsx`, and `newsletter.ts` action all exist; the action writes to `newsletter_subscribers` in Supabase and records a `newsletter_signup` conversion event.
- **It is mounted on ZERO pages.** `grep` for `<NewsletterSignup`/`<NewsletterForm` across `src` returns only the component's own file. Not on the guide template (`BlogPost.tsx` has no newsletter reference), not on guides index, not on homepage.
- **Opportunity:** the guide engine is the site's largest traffic source (per strategy, ~458 informational clicks/yr) with the lowest immediate commercial intent — exactly the audience an email capture is for. Mounting `NewsletterForm` at the foot of `BlogPost.tsx` (below the service bridge) is a template/system fix that turns "read and leave" traffic into a re-marketable list. Delivery is already built and instrumented.

---

## User Journey Gaps

- **Dead-end for the hesitant on service pages:** WhatsApp-only means the only exit toward conversion is leaving the site. No in-page form, no "email instead" on the service template.
- **Guide → service bridge lands on a weaker-converting page:** the bridge (good, tracked) sends guide readers to service pages that themselves only offer WhatsApp — the fix compounds if the service template gets a form option.
- **`/capabilities` over-linked from the guide template** (four `/capabilities` links in `BlogPost.tsx`) — matches the strategy's "1,035 inbound links, authority sink" finding. From a UX view these are low-value repeated links competing with the one bridge link that matters. Redistributing them toward money pages is a Technical/Web-Dev item; flagged for cross-reference.

---

## Quick UX Wins (high impact, low effort)

1. **Add the enquiry option to `PubServiceLandingPage`** (Hero `secondaryAction` + bottom CTA) — reuse `PackageCTA`. Turns every named-channel page from single-CTA to dual-CTA. *This is the single highest-value CRO fix and directly enables Strategy P1.*
2. **Mount `NewsletterForm` on `BlogPost.tsx`** below the service bridge — zero new backend, captures the largest-but-coldest audience.
3. **Deploy the staged instagram/facebook redirects** (or, if consolidation is deferred, self-canonical + build out the live thin page) — reconcile the code-vs-prod gap so the reclaimed ranking stops pointing at a self-cancelling page. (Technical-owned; UX impact is that the pos-7 traffic currently hits a thin dead-end.)

---

```json
{ "findings": [
  { "finding": "Service landing template (PubServiceLandingPage) offers WhatsApp-only conversion — no enquiry-form option. The June SEO-006 dual-CTA did NOT ship on the service template; it shipped only on PackageCTA (package/fix-my-pub pages). Every named-channel service page that already ranks (the Strategy P1 reclaim targets) therefore has a single high-commitment CTA and no lower-commitment form fallback.", "evidence": "src/components/PubServiceLandingPage.tsx (Hero showCTA=WhatsApp; bottom CTA is a single WhatsAppButton, no form link); contrast src/components/packages/PackageCTA.tsx:41-51 which has WhatsApp + 'Send an enquiry' → /contact", "source": "Codebase inspection (main @ 6116fe19)", "dataStatus": "Known", "severity": "High", "confidence": "High", "impactArea": "conversion", "owner": "UX", "effort": "Medium", "dependencies": "Web Developer Analyst to confirm template change effort/risk", "fixType": "Template/system fix", "recommendedAction": "Add the dual-CTA to PubServiceLandingPage: wire Hero secondaryAction={{text:'Send an enquiry', href:'/contact?service=<slug>'}} and replace the bottom single WhatsAppButton with the PackageCTA dual pattern (or a shared ServiceCTA). Route form to existing /contact flow.", "validationStep": "Every /services/* named-channel page shows both a WhatsApp CTA and a visible enquiry-form route above the fold at 375px; enquiry click lands on /contact with service preselected.", "riskRollback": "Low — additive CTA; revert component change via git." },
  { "finding": "Reclaimed named-channel pages are in a staged-not-deployed state: /services/instagram-services-for-pubs and /services/facebook-services-for-pubs are permanentRedirect(308)→/services/social-media-marketing-for-pubs in code at HEAD, but production still serves HTTP 200 for the thin instagram page (canonical→homepage). The SEO fix exists in the repo but is not live, so the pos-7 inherited ranking still points at a self-cancelling page.", "evidence": "git show HEAD:src/app/services/instagram-services-for-pubs/page.tsx = permanentRedirect; live fetch 2026-07-07 GET /services/instagram-services-for-pubs returns status=200 (redirect:manual, no Location); live HTML body = JS shell 'Loading Orange Jelly...'", "source": "Codebase inspection + live HTTP fetch (redirect:manual)", "dataStatus": "Known", "severity": "High", "confidence": "High", "impactArea": "conversion", "owner": "Technical", "effort": "Small", "dependencies": "Deploy pipeline; decision on consolidation vs build-out (Strategy P1/P2)", "fixType": "One-off page fix", "recommendedAction": "Deploy the staged redirects (or, if consolidation is deferred, self-canonical the instagram page and build out its body). Confirm the consolidation target (social-media-marketing-for-pubs) has the dual-CTA before sending the reclaimed traffic to it.", "validationStep": "Production returns 308 for the instagram/facebook URLs (or a self-canonical 200 with full content); target page has a working enquiry route.", "riskRollback": "Low — redirect reversible; documented map." },
  { "finding": "Newsletter form is orphaned — mounted on zero pages. NewsletterForm/NewsletterSignup components and newsletter.ts action exist and write to Supabase (newsletter_subscribers + newsletter_signup event), but no page in src/app renders them. The second-chance email-capture opportunity on the guide engine (the site's largest traffic source, lowest immediate commercial intent) is entirely unrealised.", "evidence": "grep -rln '<NewsletterSignup|<NewsletterForm' src → only the component's own file; src/components/blog/BlogPost.tsx has no Newsletter reference (has WhatsApp + /ways-to-work + bridge only)", "source": "Codebase inspection (main @ 6116fe19)", "dataStatus": "Known", "severity": "Medium", "confidence": "High", "impactArea": "conversion", "owner": "UX", "effort": "Small", "dependencies": "None — delivery already built and instrumented", "fixType": "Template/system fix", "recommendedAction": "Mount NewsletterForm at the foot of BlogPost.tsx (below the service bridge). Add a short value-prop line. No backend work required.", "validationStep": "Form visible on live guide pages; newsletter_signup rows appear in Supabase after a test submit.", "riskRollback": "Low — component-level, reversible." },
  { "finding": "Guide→service bridge lands readers on WhatsApp-only service pages, compounding the single-CTA problem. The bridge itself is well-built (one category-matched link per guide, tracked as guide_service_bridge) but its destination service pages have no form fallback, so the coldest audience (guide readers) is handed to the highest-commitment CTA with no alternative.", "evidence": "src/components/blog/BlogPost.tsx:350-366 (serviceBridge link, tracked); bridge targets are PubServiceLandingPage instances which are WhatsApp-only", "source": "Codebase inspection", "dataStatus": "Known", "severity": "Medium", "confidence": "High", "impactArea": "conversion", "owner": "UX", "effort": "Medium", "dependencies": "Depends on the PubServiceLandingPage dual-CTA fix landing first", "fixType": "Template/system fix", "recommendedAction": "Fix the service template dual-CTA (finding 1); the bridge then automatically delivers a two-option landing. No separate bridge change needed.", "validationStep": "Following a guide bridge link lands on a page with both WhatsApp and enquiry-form options.", "riskRollback": "n/a — dependent on finding 1." },
  { "finding": "Contact form is well-built and low-friction — not a conversion blocker. 6 fields (2 optional), working honeypot, Zod+RHF inline validation, loud error banner with WhatsApp fallback, success replacement state, double-submit guard, package deep-link preselect. The conversion problem is that too few pages route to it, not the form itself.", "evidence": "src/components/forms/contact-form.tsx (fields, honeypot website field tabIndex=-1, disabled-on-submitting, success role=status, ?package= preselect); src/app/actions/contact.ts (server re-validation, storeContactLead, WhatsApp fallback on store failure)", "source": "Codebase inspection", "dataStatus": "Known", "severity": "Low", "confidence": "High", "impactArea": "UX", "owner": "UX", "effort": "Small", "dependencies": "None", "fixType": "One-off page fix", "recommendedAction": "Optional polish: switch RHF to onBlur validation mode for slightly smoother inline errors. Otherwise leave as-is; invest effort in routing more pages TO this form (findings 1, 3).", "validationStep": "Inline field errors surface on blur; no regression in submit/success/error states.", "riskRollback": "Low — validation-mode flag." },
  { "finding": "Mobile tap-target hygiene is good at the component level; the mobile CRO issue is CTA choice, not sizing. WhatsAppButton (44/48/56px), MobileCTA (max(44px), 48px <768px, 16px inputs, safe-area, touch-action:manipulation), 44px submit and sticky-close all meet WCAG. But on the commercial service surface the only above-the-fold mobile conversion action is a single WhatsApp deep-link, and PubServiceLandingPage does not even use the Hero's available secondaryAction slot.", "evidence": "src/components/WhatsAppButton.tsx sizeClasses min-h; src/components/MobileCTA.tsx addSafeAreaStyles(); src/components/Hero.tsx secondaryAction slot unused by PubServiceLandingPage", "source": "Codebase inspection (markup — not live device measurement)", "dataStatus": "inferred", "severity": "Medium", "confidence": "Medium", "impactArea": "conversion", "owner": "UX", "effort": "Small", "dependencies": "Ties to finding 1 (dual-CTA)", "fixType": "Template/system fix", "recommendedAction": "Wire Hero secondaryAction on service pages to an enquiry-form link (near-zero effort) as the mobile lower-commitment door; delivered as part of finding 1.", "validationStep": "On a 375px viewport, service pages show two distinct conversion actions above the fold, both ≥44px.", "riskRollback": "Low — additive." },
  { "finding": "Live instagram service URL returns a client-render JS shell ('Loading Orange Jelly...') rather than server-rendered HTML, a perceived-speed / interaction-readiness risk on the reclaimed-traffic page. Whether this causes a visible blank-flash on mobile is not verifiable without a real browser.", "evidence": "live fetch 2026-07-07 /services/instagram-services-for-pubs body = 'Loading Orange Jelly...' placeholder (plain HTTP, no JS execution)", "source": "Live HTTP fetch", "dataStatus": "inferred", "severity": "Low", "confidence": "Low", "impactArea": "UX", "owner": "Technical", "effort": "Medium", "dependencies": "Web Developer Analyst to confirm render path; resolved anyway if the redirect deploys", "fixType": "One-off page fix", "recommendedAction": "Confirm the route is not shipping a blocking client-render shell; if the redirect deploys this URL is moot, but verify the consolidation target renders server-side.", "validationStep": "Target page returns meaningful server-rendered HTML on first byte; no perceptible blank-flash on mobile.", "riskRollback": "n/a — diagnostic." }
] }
```

