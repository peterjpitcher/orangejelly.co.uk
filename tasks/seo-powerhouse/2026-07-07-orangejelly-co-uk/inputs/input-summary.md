# Run Brief — Orange Jelly SEO Full Overhaul (2026-07-07)

## Target
- Live site: https://www.orangejelly.co.uk
- Codebase: /Users/peterpitcher/Cursor/OJ-OrangeJelly.co.uk (Next.js App Router; main == origin/main at commit 6116fe19)

## Mode
Full Overhaul (Mode 2), second run. First run: `tasks/seo-powerhouse/2026-06-16-orangejelly-co-uk/` (16 June 2026). This run re-audits the whole site post-implementation and measures drift vs the June baseline.

## Primary commercial goal
More service enquiries / leads — UK licensees / pub owners finding Orange Jelly in search and contacting it. Prioritise commercial-intent pages and the conversion path, not vanity traffic. (Carried from the June run brief; unchanged.)

## Business context (from project CLAUDE.md + CLAIMS.md SSOT)
- Orange Jelly Ltd, Peter Pitcher, based at The Anchor, Stanwell Moor TW19 6AQ.
- £75/hour plus VAT; packages from £375 plus VAT; 30-day guarantee.
- Approved metrics live in /CLAIMS.md only (e.g. +828% search visibility, +403% table bookings). Percentages only — never raw numbers (user preference).
- Language: British English; Greene King = Tenant; BII = Member; no "save/savings" wording (pre-commit hook enforces).

## What changed since the June audit (verified in git)
- `fix/seo-tier1-onpage` MERGED & PUSHED (6116fe19): dual-H1 strip (~97 guides), 410→301 for retired cash-flow guide + sitemap removal, guide→service bridge CTA, internal links to /compete-with-pub-chains and /pub-marketing-agency.
- `fix/lead-capture-forms` (Resend) NOT merged — superseded by `dd6bf693 feat: add Supabase lead tracking and admin dashboard`: contact + newsletter actions now store leads in Supabase (`storeContactLead`), fail loudly, /admin dashboard gated by ADMIN_EMAILS. Conversion events recorded in DB (`newsletter_signup` seen in src/lib/db/leads.ts).
- BII summer hub + 5 renovated guides merged (d6859bcd).
- Roadmap tickets addressed (to verify live): SEO-002 (alt route), SEO-004, SEO-005, part of SEO-003/007, SEO-014-ish (sitemap excl.).

## Available data sources
- Fresh full-site crawl (collect-site-evidence.py, run 2026-07-07) — in `evidence/`.
- GSC exports dated 2026-06-16 (12-month Performance: 701 queries / 132 pages; 28-day; Page Indexing/Coverage incl. 7 drilldowns → 693 URL rows). **Three weeks stale; pre-dates the merged fixes.** No fresh GSC pull possible (no GOOGLE_APPLICATION_CREDENTIALS).
- No GA4 export (same as June). Supabase lead tracking is new but no export provided.
- CrUX/PSI: no API keys set (CRUX_API_KEY, PAGESPEED_API_KEY empty); keyless low-volume attempt only.
- Codebase + web search available to all agents.

## Known constraints
- Never scrape Google SERPs.
- Implementation: this run is a REVIEW. Produce implementation-ready tickets; do not edit site code without an explicit approval gate at the end. (User asked for a "full site review".)
- Data staleness: any query/click metric cited is 12-month-to-16-June or 28-day-to-16-June. The merged fixes cannot show in GSC data yet; re-measurement window (6–8 weeks) is not reached (3 weeks elapsed).

## Priority services/products (from site structure)
/fix-my-pub, /pub-marketing-agency, /compete-with-pub-chains, /ways-to-work (+ packages), /quiet-midweek-nights and service landing pages; guides (/licensees-guide/*) are the traffic engine feeding them.
