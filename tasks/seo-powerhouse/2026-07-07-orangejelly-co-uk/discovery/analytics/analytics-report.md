# Analytics & Performance Report — Orange Jelly (orangejelly.co.uk)

**Author:** Analytics Specialist · **Date:** 2026-07-07 · **Mode:** Full Overhaul, second run
**Codebase:** main @ 6116fe19 · **Live HTML fetched:** 2026-07-07 (homepage + /contact)
**Companion docs:** `tracking-health-check.md` (full GA4/GTM audit), `baseline-metrics.md` (the benchmark to beat)

---

## The one thing that matters

**GTM loads in production (container `GTM-WBHJ7Q2H`) and Consent Mode v2 is set up correctly — but the site's single most important commercial action, a contact-form enquiry, fires no analytics event at all.** The form stores the lead in Supabase and shows "Message sent successfully", then tells GA4/GTM nothing. On a lead-generation site whose whole purpose is service enquiries, this means the commercial goal is invisible in analytics from day one. This is the open **Tier-1 measurement gate (P0)** from the Strategy Lead, and it is confirmed real, not just "unverified": the enquiry event genuinely does not exist in `main`.

Everything else in this report is secondary to closing that gate.

## Performance Baseline

Full detail in `baseline-metrics.md`. In brief, and respecting the tiny scale (28-day GSC = **25 clicks / 2,654 impressions**, all figures Known/first-party but three weeks stale and pre-dating the June fixes):

- **Search demand** exists on the commercial clusters and Google already ranks the site there — social-channel cluster 1,634 impr at weighted pos ~11, rescue cluster pos ~9 — but CTR is 0–0.24%, because the ranking pages are thin, mis-canonicalised, or not indexed. This is the recurring theme: **the site ranks for buying intent and almost nobody clicks.**
- **Conversion baseline:** there are now **two** first-party sources — the Supabase `leads`/`contacts`/`conversion_events` tables (new since June, usable as an interim enquiry count) and GA4 (whose conversion events are unverified and, for the contact form, provably absent). No Supabase export was supplied, so the enquiry count is TBD pending export.
- **No GA4 traffic export, no CrUX/PSI field data** (no API keys). Organic-session and Core-Web-Vitals baselines are therefore `unavailable` this run — a data gap, not a pass.

## Tracking status at a glance — what fires vs what doesn't

| Signal | Fires in GA4/GTM today? | Evidence |
|---|---|---|
| GTM container loads (prod) | **Yes** — `GTM-WBHJ7Q2H` | live HTML homepage + /contact, 2026-07-07 |
| Consent Mode v2 default (all denied) | **Yes** | `GoogleTagManager.tsx`; live HTML `analytics_storage` |
| GA4 page_view (initial) | **Unverified** — GA4 tag lives inside container | no `G-` id in HTML/code by design |
| GA4 page_view on SPA route change | **Unverified / likely missing** | no history-change trigger visible in code |
| **Contact-form enquiry** | **NO** | `contact-form.tsx` success path pushes nothing; `contact.ts` → Supabase only |
| Newsletter signup | **NO** (and form unmounted) | `newsletter-form.tsx` no dataLayer; `<NewsletterForm` mounted nowhere |
| Phone (`tel:`) click | **NO** | tel links in ContactPage/not-found, no handler |
| Email (`mailto:`) click | **NO** | mailto in ContactPage/FooterSimple, no handler |
| WhatsApp click | **Partial** — pushes `whatsapp_click` to dataLayer + Supabase, needs GTM tag | `WhatsAppButton.tsx:71`, Navigation, StickyBar, MobileScrollPrompt |
| Package CTA click | **Partial** — pushes `package_cta_click`, needs GTM tag | `TrackedButton.tsx`, StickyEngagementBar, several pages |
| Guide→service bridge CTA click | **NO call site** — `guide_cta_click` defined but never fired | grep found no caller |
| web_vitals | **Yes** (to dataLayer, prod only) | `PerformanceMonitor.tsx` |
| Lead notification to Peter | **NO** — silent to /admin | only `leads.ts` matches notify grep; no Resend/Slack/webhook |

**Single biggest instrumentation gap:** the contact-form enquiry has no `generate_lead` event. Fix that first (ticket T1 in `tracking-health-check.md`).

## Quick Win Opportunities

These are analytics-owned quick wins (search-side quick wins belong to Content/Technical; they trace to `opportunities-ctr-gap.csv`).

| Opportunity | Current state | Potential | Action Required | Expected Impact |
|-------------|--------------|-----------|-----------------|----------------|
| `generate_lead` on contact form | No event fires | Makes the primary commercial goal measurable | Add dataLayer push + GTM trigger + GA4 key event (T1) | Every future enquiry countable; unlocks CTR→enquiry funnel |
| Supabase leads export as interim baseline | Data exists, unexported | Establishes a real "leads since June" number to grow from | User exports `contacts` + `conversion_events` | Baseline for the 6-month enquiry KPI |
| whatsapp_click + package_cta_click → GA4 | Push to dataLayer, no GA4 tag | Two enquiry channels become measurable | Add matching GTM triggers/tags (T3) | Measures the WhatsApp fallback and package interest |
| Phone/email click events | Untracked | Phone/email are real enquiry proxies for a phone-led consultancy | GTM click triggers on tel:/mailto: (T3) | Captures off-form enquiries |
| GSC re-export (~mid-Aug) | Data 3 weeks stale, pre-fix | Makes every June fix measurable | Diarise 12mo+28d+Coverage pull, re-run analyse-search-data.py with --queries-prev | Unlocks decay analysis + fix validation |

## Declining Performance Alerts

| Page/Keyword | Decline Period | Severity | Likely Cause | Recommended Action |
|-------------|---------------|----------|--------------|-------------------|
| Whole-site conversion measurement | Since Supabase merge (dd6bf693) | Critical | Enquiry events never wired to GA4; June Resend/GA4-events branch not merged | Close P0 gate (T1, T2) |
| Newsletter conversion path | Since build | Medium | `NewsletterForm` mounted nowhere — dead path | Mount or retire (T6) |

No ranking/traffic decline can be evidenced this run: GSC data pre-dates the fixes and there is no prior-period export for decay analysis (`--queries-prev` not supplied). Decline analysis is deferred to the mid-August refresh — this is a data gap, not evidence of stability.

## Segmented Performance

### By page type
Directional only (from `search-queries.csv` clusters, no GA4 landing-page data): the **informational guide engine** (`/licensees-guide/*`, events+quiz clusters, 6,100+ impr) is where nearly all impressions and the 34 clicks/12mo live; the **commercial layer** holds better positions but near-zero CTR and much of it was not indexed in June. So the site earns informational visibility but converts almost none of it — exactly the pattern the strategy targets.

### By topic area
Commercial clusters (social-channel, rescue, agency) are the priority: best positions, worst CTR, and the pages that most need both indexation and a working `generate_lead` event so any recovered clicks can be tied to enquiries. Without T1, even a successful CTR-recovery programme (strategy P1) cannot prove it produced leads.

## Measurement Framework

Structured around **outcomes, not outputs** (per `operating-model.md`). Track blogs-published / tickets-closed for awareness, but review success on the outcomes below.

### Primary KPIs (business-aligned)
1. **Service enquiries** — contacts + `generate_lead` + whatsapp/phone/email enquiry events. Baseline = Supabase export (TBD). Report as **% change** (user preference — never raw counts). *Requires T1/T3.*
2. **Commercial-cluster CTR** — GSC. Baseline 0.00–0.24%; target ≥1% at current positions.
3. **Priority commercial pages indexed** — GSC Coverage. Baseline 0 of priority set (June); target all.
4. **Named-channel query clicks** — GSC. Baseline ~4/12mo; target double-digit % share of their impressions.
5. **Enquiry rate from organic** — enquiries ÷ organic sessions. *Blocked until T1 + a GA4 traffic baseline exist.*

### Leading indicators
- Indexation coverage of the commercial set (GSC).
- Position movement on the five named-channel queries + "fix my pub".
- Impression growth on commercial clusters.
- CTR lift from SERP on reclaimed pages.
- **AI-referral traffic** — directional only; near-zero at this scale and mostly referrer-less. Prefer GA4 native "AI Assistant" channel; else regex channel over `source` ordered above Referral. Do not present as a measured contribution.
- **Branded AI citations** — manual dated spot-check log for cluster-leader guides (quarterly); directional, not a metric.

### Reporting cadence
- **Weekly:** Supabase leads triage (new contacts), GSC anomalies, 404 spikes, crawl errors.
- **Monthly:** commercial-cluster CTR + position, indexation progress, enquiry trend (once T1 live), competitor movement.
- **Quarterly:** organic enquiry contribution, visibility by strategic topic, progress vs roadmap.
- **Tools:** GSC (demand/indexation), GA4 (once conversions verified), Supabase `/admin` + exports (first-party enquiry truth), GTM (tag config). No third-party volume tool connected — no volume/traffic forecasts made.

## Post-Launch Validation Plan

| Shipped change | 0–48h checks | 1–2 week checks | 4–8 week checks | Baseline to compare |
|----------------|-------------|-----------------|-----------------|---------------------|
| T1 `generate_lead` event | DebugView shows event on test submit; lead in /admin; no double-fire | Events accruing in GA4; count ≈ Supabase contacts | Enquiry trend vs Supabase baseline | Supabase contacts export |
| T2 GA4 config + SPA page_view | page_view in Realtime on load + route change | Sessions/page_views sane vs Vercel logs | Organic sessions trend established | none (new baseline) |
| T3 phone/email/whatsapp/CTA events | Each fires in DebugView | Volumes plausible | Channel mix of enquiries | Supabase conversion_events |
| Commercial page CTR fixes (Content/Tech) | Rendered output + canonical correct | GSC crawl/index of the pages | CTR + clicks per query vs June | GSC 2026-06-16 export |
| GSC re-export (mid-Aug) | Export lands in workspace | analyse-search-data.py + decay run | Fix validation vs June baseline | June search-queries.csv |

## Data Gaps

- **GA4 container internals** — GA4 Config tag, measurement ID, key-events list, triggers: unreadable from outside. **User must export the GTM container + GA4 key-events list.**
- **Supabase leads export** — not supplied; interim enquiry baseline cannot be quantified until exported.
- **GA4 traffic export** — none; no organic-session baseline, no enquiry-rate denominator.
- **CrUX/PSI field data** — no API keys; Core Web Vitals baseline `unavailable` (the `web_vitals` dataLayer event exists in code but its data is not accessible here).
- **Fresh GSC** — 3 weeks stale, pre-fix; no prior-period file so decay analysis was skipped. Re-export ~mid-August.
- **Live firing proof** — no GA4/GTM access and no consented prod browser session this run, so all firing-level items are `unverified`; installation-level items are proven from live HTML.

---

```json
{ "findings": [
  { "finding": "Contact-form enquiry — the site's primary commercial conversion — fires NO analytics event. On success, contact-form.tsx pushes nothing to dataLayer and calls no trackClientEvent; submitContactForm stores the lead in Supabase only. GA4/GTM never learns an enquiry occurred, so the lead-gen goal is invisible in analytics.", "evidence": "src/components/forms/contact-form.tsx onSubmit (setSubmitStatus('success') with no dataLayer.push); src/app/actions/contact.ts (storeContactLead only); no 'generate_lead'/'contact_submit' anywhere in src", "source": "Codebase inspection (main @ 6116fe19)", "dataStatus": "Known", "severity": "Critical", "confidence": "High", "impactArea": "conversion", "owner": "Analytics", "effort": "Small", "dependencies": "GTM container access; GA4 key-event config", "fixType": "Analytics/governance fix", "recommendedAction": "Add window.dataLayer.push({event:'generate_lead', form_name:'contact', package}) in the contact-form success branch; create GTM Custom Event trigger generate_lead -> GA4 event; mark it a GA4 key event", "validationStep": "Test submission shows generate_lead in GA4 DebugView, increments the key event, and the lead appears in /admin", "riskRollback": "None — remove push / pause GTM tag; no user-facing change" },
  { "finding": "GTM container GTM-WBHJ7Q2H loads in production with correct Consent Mode v2 defaults (analytics_storage denied by default, wait_for_update 500, fires before GTM). Installation is healthy; the gate is what fires inside/after it, not whether GTM loads.", "evidence": "Live HTML of https://www.orangejelly.co.uk/ and /contact (2026-07-07) contain GTM-WBHJ7Q2H + googletagmanager ns.html noscript iframe + analytics_storage consent default; src/components/GoogleTagManager.tsx; mounted src/app/layout.tsx:194-195", "source": "Live HTML fetch + codebase inspection", "dataStatus": "Known", "severity": "Low", "confidence": "High", "impactArea": "conversion", "owner": "Analytics", "effort": "Small", "dependencies": "None", "fixType": "Analytics/governance fix", "recommendedAction": "No fix to installation; proceed to verify container contents (GA4 tag + conversion triggers)", "validationStep": "Tag Assistant resolves GTM-WBHJ7Q2H on the live site", "riskRollback": "n/a" },
  { "finding": "GA4 configuration tag and its measurement ID cannot be verified from outside the GTM container; no hard-coded G- id exists in code/HTML (by design). If no GA4 Config tag is present in the container, the site has NO analytics at all despite GTM loading.", "evidence": "No gtag/js?id=G- in live HTML; no G- measurement ID in src; GA4 tags live in container GTM-WBHJ7Q2H which is not externally readable", "source": "Live HTML fetch + codebase grep", "dataStatus": "unavailable", "severity": "Critical", "confidence": "Medium", "impactArea": "conversion", "owner": "Analytics", "effort": "Small", "dependencies": "User must export GTM container + GA4 property access", "fixType": "Analytics/governance fix", "recommendedAction": "User exports GTM container GTM-WBHJ7Q2H and confirms a GA4 Configuration tag with a valid G- measurement ID fires on All Pages; confirm page_view in GA4 Realtime", "validationStep": "GA4 Config tag screenshot + page_view visible in GA4 Realtime on a live consented visit", "riskRollback": "n/a — verification" },
  { "finding": "SPA route-change page views likely missing: Next.js App Router does client-side navigation but no history-change page_view trigger is visible; if the container relies only on default gtm.js page_view, every page after the first is undercounted.", "evidence": "No History Change trigger or route-change page_view code in repo (would live in the GTM container); Next.js App Router client navigation confirmed by architecture", "source": "Codebase inspection + architecture", "dataStatus": "inferred", "severity": "High", "confidence": "Medium", "impactArea": "conversion", "owner": "Analytics", "effort": "Small", "dependencies": "GTM container access", "fixType": "Analytics/governance fix", "recommendedAction": "In GTM enable page_view on browser-history changes (or a History Change trigger) so client-side navigations count", "validationStep": "Navigating between pages without reload produces a new page_view each time in DebugView", "riskRollback": "Disable the trigger" },
  { "finding": "NewsletterForm is a dead conversion path: the component and its Supabase newsletter_signup event exist, but grep for '<NewsletterForm' returns only the component's own definition — it is rendered on no page or footer, so no user can submit it, and even if they could it pushes no dataLayer event.", "evidence": "grep -rn '<NewsletterForm' src -> only src/components/forms/newsletter-form.tsx (self); src/components/NewsletterForm.tsx re-exports but has no consumer; newsletter-form.tsx onSubmit has no dataLayer.push", "source": "Codebase inspection", "dataStatus": "Known", "severity": "Medium", "confidence": "High", "impactArea": "conversion", "owner": "UX", "effort": "Small", "dependencies": "Decision on placement; dev", "fixType": "One-off page fix", "recommendedAction": "Mount NewsletterForm on the guide template (second-chance conversion for informational traffic) or retire the component + action; if mounted, add newsletter_signup dataLayer push + GA4 key event", "validationStep": "Form renders on a live page; test signup lands in Supabase newsletter_subscribers and shows newsletter_signup in DebugView", "riskRollback": "Component-level, reversible" },
  { "finding": "No lead notification: captured enquiries land silently in the /admin dashboard with no email/Slack/webhook alert to Peter. Only leads.ts matches the notify grep and it only inserts to Supabase; the June Resend branch that would have emailed was never merged. A lead nobody sees can sit unactioned.", "evidence": "grep 'resend|nodemailer|sendMail|notify|slack|webhook' across src/app/actions + src/lib/db returns only src/lib/db/leads.ts (Supabase inserts); no email/webhook side-effect on storeContactLead", "source": "Codebase inspection", "dataStatus": "Known", "severity": "High", "confidence": "High", "impactArea": "conversion", "owner": "Analytics", "effort": "Small", "dependencies": "Email (Resend) or Slack/webhook credentials", "fixType": "Analytics/governance fix", "recommendedAction": "Send an email (Resend) or Slack/webhook notification on storeContactLead success so Peter is alerted to every enquiry, not reliant on checking /admin", "validationStep": "Test lead triggers a notification to Peter within seconds and appears in /admin", "riskRollback": "Remove the notification call; no user-facing impact" },
  { "finding": "Phone (tel:) and email (mailto:) clicks are untracked despite being real enquiry proxies for a phone-led consultancy: tel links on /contact and 404 page, mailto on /contact and footer, none instrumented; trackClientEvent has no phone_click/email_click in its allowed event set.", "evidence": "src/app/contact/ContactPage.tsx:225,322 (tel:), :339 (mailto:); src/components/FooterSimple.tsx:207 (mailto:); src/app/not-found.tsx:154 (tel:); trackClientEvent TrackableEvent union lacks phone/email", "source": "Codebase inspection", "dataStatus": "Known", "severity": "High", "confidence": "High", "impactArea": "conversion", "owner": "Analytics", "effort": "Small", "dependencies": "GTM container access", "fixType": "Template/system fix", "recommendedAction": "Add GTM click triggers on a[href^='tel:'] -> phone_click and a[href^='mailto:'] -> email_click, both as GA4 key events", "validationStep": "Clicking tel:/mailto: produces phone_click/email_click in DebugView", "riskRollback": "Disable the GTM triggers" },
  { "finding": "WhatsApp and package-CTA clicks push to dataLayer (whatsapp_click, package_cta_click) but have no confirmed GA4 tags, and the guide->service bridge CTA event (guide_cta_click) is defined but has no call site, so the strategy-P3 bridge conversion cannot be measured.", "evidence": "trackClientEvent call sites: WhatsAppButton.tsx:71, Navigation.tsx:177, StickyEngagementBar.tsx:99/115, MobileScrollPrompt.tsx:91, TrackedButton.tsx:53; grep found no caller pushing guide_cta_click; GA4 tags live in unseen GTM container", "source": "Codebase inspection", "dataStatus": "Known", "severity": "Medium", "confidence": "High", "impactArea": "conversion", "owner": "Analytics", "effort": "Small", "dependencies": "GTM container access; bridge CTA component", "fixType": "Template/system fix", "recommendedAction": "Add GTM Custom Event triggers -> GA4 events for whatsapp_click and package_cta_click (mark whatsapp_click key event); instrument the guide->service bridge CTA to fire guide_cta_click", "validationStep": "Each event visible in DebugView; bridge CTA click on a guide page fires guide_cta_click", "riskRollback": "Disable GTM triggers / revert instrumentation" },
  { "finding": "Custom dataLayer events are gated behind tracking.ts hasAnalyticsConsent() reading localStorage 'oj-cookie-consent', which is a SEPARATE store from the gtag Consent Mode state. If CookieNotice Accept does not write the exact shape hasAnalyticsConsent expects, all custom events (whatsapp/cta) and their /api/events Supabase logging silently drop.", "evidence": "src/lib/tracking.ts hasAnalyticsConsent() reads 'oj-cookie-consent' expecting {analytics:true} or 'accepted'; src/components/GoogleTagManager.tsx updateGtagConsent() manages a separate Consent Mode state; CookieNotice.tsx accept path not verified to satisfy both", "source": "Codebase inspection", "dataStatus": "inferred", "severity": "Medium", "confidence": "Medium", "impactArea": "conversion", "owner": "Analytics", "effort": "Small", "dependencies": "dev", "fixType": "Template/system fix", "recommendedAction": "Ensure CookieNotice Accept calls updateGtagConsent(true) AND writes the exact oj-cookie-consent value hasAnalyticsConsent() accepts; reconcile the two consent stores", "validationStep": "After Accept, a whatsapp_click reaches both dataLayer and the Supabase conversion_events log", "riskRollback": "Revert consent-write change" },
  { "finding": "Supabase leads table is the only trustworthy first-party enquiry source and it has not been exported, so no enquiry baseline can be quantified this run. GA4 conversion data is absent (contact form) or unverified, so Supabase is the interim source of truth for the 6-month enquiry KPI.", "evidence": "src/lib/db/leads.ts (contacts, newsletter_subscribers, conversion_events, lead_sources tables); run brief: 'no Supabase export provided'; /admin dashboard gated by ADMIN_EMAILS", "source": "Codebase inspection + run brief", "dataStatus": "unavailable", "severity": "High", "confidence": "High", "impactArea": "revenue", "owner": "Analytics", "effort": "Small", "dependencies": "Supabase access / ADMIN_EMAILS login", "fixType": "Analytics/governance fix", "recommendedAction": "User exports Supabase contacts + conversion_events since dd6bf693 as the interim enquiry baseline; report growth as % change per user preference", "validationStep": "Enquiry count established; used as baseline for the enquiries KPI", "riskRollback": "n/a — export only" },
  { "finding": "GSC exports are 3 weeks stale (2026-06-16) and pre-date the June fixes; no prior-period export exists so decay analysis was skipped. No June fix is measurable and no traffic decline can be evidenced until a refresh.", "evidence": "evidence/search-queries.csv dated 2026-06-16; evidence/analysis-summary.md 'Decay n/a (no --queries-prev supplied)'; run brief known constraints", "source": "Run brief + file dates + analyse-search-data.py summary", "dataStatus": "Known", "severity": "High", "confidence": "High", "impactArea": "SEO", "owner": "Analytics", "effort": "Small", "dependencies": "GSC access (GOOGLE_APPLICATION_CREDENTIALS)", "fixType": "Analytics/governance fix", "recommendedAction": "Diarise a GSC re-export (12-mo, 28-day, Coverage) for ~2026-08-15; re-run analyse-search-data.py with --queries-prev to unlock decay analysis and validate the June fixes", "validationStep": "Fresh exports in workspace; decay analysis produced; June-fix impact readable", "riskRollback": "None" },
  { "finding": "No GA4 traffic export and no CrUX/PSI field data (no API keys), so organic-session, engagement, and Core Web Vitals baselines are unavailable this run. The web_vitals dataLayer event exists in code (PerformanceMonitor.tsx) but its data is not accessible here.", "evidence": "run brief: no GA4 export, CRUX_API_KEY/PAGESPEED_API_KEY empty; src/components/PerformanceMonitor.tsx pushes web_vitals to dataLayer (prod only)", "source": "Run brief + codebase inspection", "dataStatus": "unavailable", "severity": "Medium", "confidence": "High", "impactArea": "UX", "owner": "Analytics", "effort": "Small", "dependencies": "GA4 access; CrUX/PSI API keys", "fixType": "Analytics/governance fix", "recommendedAction": "Once GA4 access exists, export organic sessions + engagement; add CrUX/PSI keys for a CWV field baseline; route web_vitals to GA4 as a non-key event", "validationStep": "GA4 organic-session baseline recorded; CWV field data (p75 LCP/INP/CLS) captured", "riskRollback": "n/a" },
  { "finding": "No GA4 internal-traffic filter or AI-referral channel is verifiable (both live in GA4 admin). On a 25-clicks/28d baseline, unfiltered self-visits (Peter/The Anchor, /admin) would badly distort reporting; AI-referral is near-zero and mostly referrer-less at this scale.", "evidence": "No filter/channel config readable from repo; /admin is a real live path; run brief scale (25 clicks/28d)", "source": "Codebase inspection + scale from GSC", "dataStatus": "unavailable", "severity": "Medium", "confidence": "Medium", "impactArea": "conversion", "owner": "Analytics", "effort": "Small", "dependencies": "GA4 admin access", "fixType": "Analytics/governance fix", "recommendedAction": "In GA4 add an internal-traffic rule (IP) and exclude /admin from key reports; add AI channel group (native 'AI Assistant' or regex over source ordered above Referral) but treat it as directional, not complete", "validationStep": "Internal-traffic filter active; /admin excluded; AI channel group ordered above Referral", "riskRollback": "Remove filter/channel definitions" }
] }
```
