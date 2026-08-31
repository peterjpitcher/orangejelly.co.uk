# Landing-Page & Conversion Recommendations — Orange Jelly (Phase 3 UX/CRO)

**Date:** 2026-06-16 · **Author:** UX/CRO Specialist
Ticket-ready. Each item names the page/component/template, the precise change, an observable acceptance criterion, the fix type, and the commercial rationale (more enquiries). Copy must use only `/CLAIMS.md` approved percentages (+828% search visibility, +403% table bookings, +567% private hire, -89% no-shows, +98% food revenue — all "proven at The Anchor"); British English; no "save/savings"; Greene King = Tenant, BII = Member. No live indexation change without the Phase 5 Risk Register.

Sequencing: **UX-CRO-1 (form delivery) and Analytics SEO-001 (tracking) first**, then UX-CRO-2/3/4 (CTA templates + bridge), alongside Technical SEO-004 (indexation). Template fixes are flagged for the Web Developer Analyst to confirm effort/risk.

---

## UX-CRO-1 — Make the contact form deliver leads (CRITICAL, ship first)
- **Page/component:** `src/app/actions/contact.ts` (`submitContactForm`), `src/components/forms/contact-form.tsx`
- **Problem:** the action only `console.log`s (`contact.ts:30`) — submissions are never sent to Peter. The form shows "Message sent successfully" (`contact-form.tsx:98`) while the lead is lost.
- **Change:** send the submission as an email to `peter@orangejelly.co.uk` (Resend) including name, email, phone, venue, selected package, message; optionally persist. On success, fire the `enquiry_submit` GA4 event (Analytics SEO-001) with `{package}` param. Keep the existing Zod validation. Do NOT log PII to console.
- **Acceptance:** a test enquiry on production arrives in Peter's inbox within 1 minute; `enquiry_submit` fires in GA4 DebugView; no PII in server logs.
- **Fix type:** Template/system fix · **Owner:** UX/dev · **Effort:** Medium · **Impact:** Critical — recovers every form lead. *Stop condition: new PII storage location needs approval (GDPR).* 

## UX-CRO-2 — Add a dual WhatsApp-or-enquiry CTA to the service-page template (HIGH)
- **Template:** `src/components/PubServiceLandingPage.tsx` (used by `/services/social-media-marketing-for-pubs`, `/paid-social-for-pubs`, `/content-creation-for-pubs`)
- **Problem:** the only CTA is a WhatsApp button (`PubServiceLandingPage.tsx:204`). No enquiry form, no `/contact` link — these are the pages GSC ranks for buying intent, so the highest-intent visitors have no low-friction email path.
- **Change:** replace/augment the teal CTA section with the `PackageCTA` pattern: a WhatsApp button **and** a "Send an enquiry" button to `/contact` (pre-fill `?package=` where relevant), plus the line "Packages from £375 + VAT. 30-day action guarantee. Payment plans available." Keep the Anchor results strip (already CLAIMS-correct).
- **Acceptance:** every `/services/*` page renders both a WhatsApp and an enquiry-form CTA above the FAQ; the guarantee line is visible; both CTAs fire `cta_click` with `method`.
- **Fix type:** Template/system fix · **Owner:** UX/dev · **Effort:** Small · **Impact:** High.

## UX-CRO-3 — Intent-matched guide -> service bridge in the blog template (HIGH)
- **Template:** `src/components/blog/BlogPost.tsx:224-271` (`getCategoryCTA` + the two end-CTA cards)
- **Problem:** the end-CTA links to `/ways-to-work` and 4x `/capabilities` regardless of topic; not matched to the article; no form. Only 27/106 guides link to any service.
- **Change:** extend `getCategoryCTA` to also return an **intent-matched service URL + label** per category, e.g. social-media/customer-acquisition -> `/services/social-media-marketing-for-pubs`; events/promotions -> `/services/paid-social-for-pubs`; turnaround -> `/pub-rescue` (or turnaround service); food-drink -> the relevant service/guide. Render a single peer-to-peer "Want this done for you?" card with that service link + a dual WhatsApp/enquiry CTA and ONE approved proof point (e.g. "+403% table bookings, proven at The Anchor"). Remove the generic 6-button `/capabilities` card.
- **Acceptance:** opening any guide shows a bridge whose service link matches the guide's category; the bridge offers both WhatsApp and an enquiry path; `cta_click`/guide->service navigation is trackable.
- **Fix type:** Template/system fix · **Owner:** Content (map) + UX/dev (template) · **Effort:** Medium · **Impact:** High — converts the existing informational authority (the four top guides carry the site).

## UX-CRO-4 — Surface "Services" in the nav + pick one canonical commercial hub (MEDIUM)
- **Files:** `content/data/navigation.json`; strategic decision across `/services`, `/ways-to-work`, `/capabilities`, `/pub-marketing`, `/pub-marketing-agency`
- **Problem:** nav offers "Ways to Work" + "Capabilities" (jargon) but never "Services"; five overlapping commercial hubs; `/contact` linked from only ~8 places.
- **Change:** add a top-level nav item using buyer language ("Services" or "Marketing for Pubs") pointing at the chosen canonical hub; ensure that hub links out to the individual service pages and to `/contact`. Decide (with Content/Strategy) which hub is canonical and reduce duplication; any URL merge/redirect routes via the Risk Register.
- **Acceptance:** primary nav exposes a buyer-language services entry; the canonical hub links to all service pages + `/contact`; CTAs across commercial pages resolve to consistent destinations.
- **Fix type:** Template/system fix · **Owner:** UX + Content · **Effort:** Small (nav) / Medium (consolidation) · **Impact:** Medium.

## UX-CRO-5 — Fix the named-channel redirect experience (HIGH, pairs with SEO-004)
- **Pages:** `/services/instagram-services-for-pubs`, `/services/facebook-services-for-pubs` (308 -> `/services/social-media-marketing-for-pubs`)
- **Problem:** GSC ranks these terms pos 7.0 / 6.1 with 0 clicks; the URLs are redirects and a live fetch caught the "Loading Orange Jelly..." shell mid-redirect; the destination is WhatsApp-only.
- **Change:** keep the consolidation, but (a) confirm with Technical the redirect is a clean server-side 308 with no client loading flash; (b) ensure the destination has the UX-CRO-2 dual CTA; (c) on the social-media destination, keep the dedicated Instagram and Facebook sections (already present, `social-media-marketing-for-pubs/page.tsx`) and add a channel-specific enquiry CTA ("Want help running your pub's Instagram/Facebook? Send an enquiry").
- **Acceptance:** the two terms' destination renders instantly server-side; shows channel sections + dual CTA + guarantee; cluster CTR on the two terms moves above 0 at 4-8 weeks.
- **Fix type:** Template/system fix · **Owner:** UX/Content; Technical confirms redirect · **Effort:** Small · **Impact:** High. *Redirect-target change routes via Risk Register.*

## UX-CRO-6 — Consolidate the mobile interrupt stack on guides (MEDIUM)
- **Components:** `StickyEngagementBar` (`layout.tsx:214`), blog `StickyCTA` (`BlogPost.tsx:144`), `MobileScrollPrompt` (`engagement/MobileScrollPrompt.tsx`)
- **Problem:** up to three bottom-anchored CTAs can show together on mobile guides — the pages that earn the most clicks (mobile out-ranks desktop in GSC). Clutter competes with the conversion goal and can obscure content.
- **Change:** keep exactly ONE persistent mobile CTA on `/licensees-guide/[slug]` — prefer the UX-CRO-3 intent-matched bridge as a single sticky/inline element — and suppress the duplicate `StickyCTA`/`StickyEngagementBar` on those routes. Retire the root `StickyCTA.tsx` if it duplicates `StickyEngagementBar`.
- **Acceptance:** at 375px on a guide, exactly one persistent CTA is visible; no overlapping bottom bars.
- **Fix type:** Template/system fix · **Owner:** UX/dev · **Effort:** Small · **Impact:** Medium.

## UX-CRO-7 — Add an email-capture path to the `/services` hub hero + remove WhatsApp-only dead-ends (MEDIUM)
- **Page:** `src/app/services/ServicesPage.tsx`
- **Problem:** the hub's hero CTA and section CTAs are WhatsApp-only (`ServicesPage.tsx:67-76, 191-197, 269-277`); no enquiry form path on the hub itself.
- **Change:** add the dual `PackageCTA` block to the final CTA section and keep the guarantee section; ensure the service-landing cards link to the real service pages (verify against `services.json`).
- **Acceptance:** `/services` offers both WhatsApp and an enquiry-form CTA; all service cards resolve to live service pages.
- **Fix type:** One-off page fix · **Owner:** UX/dev · **Effort:** Small · **Impact:** Medium (capped until indexed — pairs with SEO-004).

---

## What is already good (keep / replicate)
- `/pub-marketing-agency` is the model commercial page: strong intent-matched H1, claims strip, packages, **dual WhatsApp + "Send an enquiry" CTA with the 30-day guarantee**, Greene King tenant framing. Replicate this CTA + trust pattern everywhere.
- `PackageCTA` component already implements the correct dual-CTA pattern — promote it to the standard.
- `ExitIntentModal` is accessible (Escape, focus, backdrop) and uses good problem-led copy — keep; point one option at `/contact`.
- WhatsApp buttons meet 44px tap targets; contact form has inline Zod validation, loading/disabled state, and a clear success state (the only defect is delivery).
- Contact page trust stack (Peter+Billy photo, "what happens next" 5 steps, ProofStrip with approved claims, no-pushy-sales reassurance) is strong — preserve it.

## Acceptance summary (observable, for QA)
1. Form enquiry reaches Peter's inbox + `enquiry_submit` fires. 2. Every service page + `/services` hub + each guide shows a WhatsApp AND an enquiry-form CTA with the 30-day guarantee. 3. Every contact CTA fires `cta_click {method}`. 4. Nav exposes a buyer-language services entry. 5. Guides show an intent-matched bridge. 6. One persistent mobile CTA per guide at 375px. 7. Named-channel terms' destination renders server-side with the dual CTA.
