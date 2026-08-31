# Tracking Evidence — collected 2026-07-07 (codebase inspection, main @ 6116fe19)

## GTM / GA4
- `src/components/GoogleTagManager.tsx`: GTM container loaded from `NEXT_PUBLIC_GTM_ID` env var (value not in repo; `.env.example` placeholder `GTM-XXXXXXX`). Consent-default script present (`gtag('consent', 'default', …)`) with a consent-update path.
- `src/lib/tracking.ts` + `src/app/actions/tracking.ts`: dataLayer push helper exists.
- `src/components/PerformanceMonitor.tsx`: pushes performance payloads to dataLayer.
- `generate_lead` GTM event from the June Resend branch is NOT in main (branch unmerged). `newsletter_signup` appears as a Supabase-stored event name in `src/lib/db/leads.ts` (lines ~256, ~346), not necessarily a GTM/GA4 event — needs verification in the live dataLayer.

## Lead capture (conversion path)
- `src/app/actions/contact.ts`: validates server-side, honeypot (`website` field), stores via `storeContactLead()` from `src/lib/db/leads.ts` (Supabase). **Success is contingent on storage** — returns error directing to WhatsApp if store fails. The June "silent dead form" bug is fixed in code.
- `src/app/actions/newsletter.ts` + `src/components/forms/newsletter-form.tsx`: newsletter action exists; `NewsletterForm` component only re-exported (`src/components/NewsletterForm.tsx`) — mount status on real pages unverified at this stage.
- `/admin` dashboard gated by Supabase Auth + `ADMIN_EMAILS` env.
- Env dependencies for the path to work in production: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (values not verifiable from repo — whether they are set in Vercel is UNVERIFIED here).

## Unverified (flag in Data Access & Limitations)
- Whether GTM container is actually configured with GA4 tags + conversions (container contents live in GTM, not the repo).
- Whether an enquiry conversion event fires client-side on contact-form success in main.
- Whether Supabase env vars are set in production (live form test needed).
- No GA4 export supplied; no Supabase leads export supplied.
