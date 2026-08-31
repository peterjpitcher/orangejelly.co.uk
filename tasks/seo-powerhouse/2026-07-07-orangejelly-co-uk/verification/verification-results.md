# Verification Results — Tier-1 Batch 1 (deployed 2026-07-07)

Branch `feat/seo-2026-07-tier1` merged to `main` (merge commit `98659ca9`) and pushed to origin → Vercel production deploy.

## Pre-deploy gates (local, on branch)
- `npm run type-check` — clean
- `npm test` — 79/79 pass (incl. 3 new contact.test.ts cases locking the lead-notification safety rule)
- `npm run lint` — growth-language + British-English checks pass
- `npm run build` — compiled successfully, 160/160 static pages
- Redirects confirmed compiled into `.next/routes-manifest.json`

## Post-deploy live verification (production, ~90s after push)
| Check | Result |
|---|---|
| `/services/instagram-services-for-pubs` | 308 → `/services/social-media-marketing-for-pubs` ✅ (was 200 canonical→homepage) |
| `/services/facebook-services-for-pubs` | 308 → `/services/social-media-marketing-for-pubs` ✅ |
| `/licensees-guide/pub-wages-labour-costs-uk` | 308 → `/licensees-guide/pub-wages-labour-costs-guide` ✅ (was hard 404) |
| `/services/social-media-marketing-for-pubs` (redirect target) | 200 ✅ |
| Sitemap includes social-media-marketing / paid-social / content-creation | yes ✅ |
| Sitemap no longer lists the redirected instagram page | confirmed ✅ |

## Tickets shipped
- SEO-106 (Instagram/Facebook routing), SEO-107 (sitemap service pages), SEO-115 (404 slug redirect) — commit `19917a77`
- SEO-102 (lead alert email via Resend, best-effort) — commit `401d9465`

## Outstanding verification (needs a live action)
- **SEO-102 end-to-end:** send a real test enquiry via the live contact form and confirm (a) it appears in `/admin` and (b) an alert email arrives at peter@orangejelly.co.uk. `CONTACT_FROM_EMAIL` confirmed set in Vercel by Peter.

## Live test debrief (2026-07-07, Peter's first test enquiry)
- **Lead capture: WORKING.** Peter's test ("Peter Pitcher / The Anchor / Need help!") is in the `contacts` table (Supabase project `miqqkllqfyvaomzgujed`), id `b392f5a2…`, created 12:56:26 UTC, plus a `contact_submit` conversion event. No data lost.
- **Admin "Recent contacts" empty in the screenshot** = transient/old-build artefact, NOT a code bug. DB now returns total_contacts=1, contacts_30d=1 consistently; the API query and dashboard render are correct. A refresh of `/admin` shows the row.
- **Email alert did NOT arrive.** Root cause almost certainly deploy/env timing: either Peter tested in the ~90s window before commit `98659ca9` went live, or `CONTACT_FROM_EMAIL` was added to Vercel after that deploy (Vercel only bakes env vars in at deploy time). Fix: commit `ca016bd9` forces a fresh build (bakes in current env) + adds a plain-text part and per-variable diagnostic logging. Deploy verified healthy.
- **Outstanding:** Peter to re-test on the new build. If still no email, the next suspect is Resend domain verification — check the domain in `CONTACT_FROM_EMAIL` shows "Verified" in the Resend dashboard.

## Post-launch monitoring (per roadmap)
- 0–48h: re-crawl affected URLs (done above); watch GSC for new 404/redirect errors.
- 1–2 wks: URL-Inspect the reclaimed pages; confirm they leave the not-indexed states.
- 6–8 wks (~mid-August): compare CTR/position/clicks vs `measurement/baseline-pre-change.json`.
