# SEO Powerhouse Full Overhaul — 2026-07-07 run plan

- [x] Stage 1 — Inputs (inputs/input-summary.md; autonomous, June brief carried forward)
- [x] Stage 2a — Evidence: fresh crawl (153 pages), GSC import (12-mo + 28-day + Coverage), search-data analysis, internal-link graph, schema validation, CWV (unavailable), drift vs June, live redirect verification
- [x] Stage 2b — Strategy Lead (14 findings)
- [x] Stage 2c — Technical / Content / Analytics / Authority (re-run on Opus after Fable limit; all reports written)
- [x] Stage 2d — Copywriter / Editor-QA / UX-CRO (all reports written)
- [x] Stage 3 — Priority mapping: 77 findings → 38-ticket backlog.json → scored-backlog.csv + 4 priority lists
- [x] Stage 4 — Keyword-plan requests (family/kids pillar blocked; rest are GSC-known reclaim)
- [x] Stage 5 — Web-developer feasibility notes (exact fix locations from technical report)
- [x] Stage 6/7 — Review-only: no code changed; batched approval list (Groups A/B/C) prepared
- [x] Stage 8 — seo-growth-roadmap.md (full report-templates.md structure)
- [x] Stage 9 — Baseline frozen (baseline-pre-change.json + run-fingerprint.json); drift = no true regressions; re-measurement window ~mid-August

## Key reconciliations resolved this run
- Instagram/Facebook service pages: page-level permanentRedirect no-ops on static Vercel route → both serve 200 canonical→homepage while ranking pos 6-7. Fix = next.config.js redirect (proven pattern) or rebuild. (5-agent signal; live-verified over conflicting code-read.)
- Contact form: fixed (Supabase store, fails loudly) BUT fires no GA4 event + no lead notification (silent /admin).
- June Tier-1 fixes all verified live-deployed.

## Handed to user (only they can do)
1. Fresh GSC export (12-mo + 28-day + Coverage) ~2026-08-15 to measure June + Tier-1 fixes.
2. GTM container export + GA4 key-events list + one live contact-form test in DebugView.
3. Approve batched Group A (channel routing) now; defer Group B (hub consolidation) to August.
4. Optional: set CRUX_API_KEY for CWV; provide Ahrefs/Semrush for backlink baseline; run /keyword-plan for family/kids pillar.
