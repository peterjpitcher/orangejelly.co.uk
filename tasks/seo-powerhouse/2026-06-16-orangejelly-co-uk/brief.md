# Run Brief — Orange Jelly SEO Full Overhaul

**Date:** 2026-06-16 (Europe/London)
**Mode:** Full Site Overhaul
**Workspace:** `tasks/seo-powerhouse/2026-06-16-orangejelly-co-uk/`

## Target
- **Live site:** https://www.orangejelly.co.uk
- **Codebase:** this repo — `/Users/peterpitcher/Cursor/OJ-OrangeJelly.co.uk` (Next.js App Router; blog content in `/content/blog/`)

## Primary commercial goal
**More service enquiries / leads** — UK licensees / pub owners finding Orange Jelly in search and contacting it for help. Prioritise commercial-intent pages and the conversion path, not vanity traffic.

## Business context
- Orange Jelly — practical, AI-powered marketing help for UK pubs/licensees. Founder Peter Pitcher; run from The Anchor, Stanwell Moor (Staines). Sells services/packages (hourly £75 + VAT; packages from £375 + VAT; 30-day action guarantee).
- Audience: independent licensees and small pub operators who are time-poor and sceptical of agencies. Tone: encouraging, plain-English, peer-to-peer (one publican to another).
- Competition framing: local independents, hospitality marketing agencies, and DIY/AI tools.

## Hard constraints (enforce in every agent)
- **Claims SSOT = `/CLAIMS.md`.** Agents may ONLY use the approved metrics/percentages in that file when recommending on-page copy. Never invent or inflate numbers (reinforces the skill's no-invented-data rule).
- Greene King = **Tenant** (not partner); BII = **Member**. British English. No "save/savings" language (repo pre-commit hook blocks it).
- No live indexation changes (noindex/canonical/redirect/robots/schema/GBP) without explicit user approval — route via the Risk Register.

## Available data sources
- Codebase (full read access), live URL fetch, web search.
- **GSC + GA4 exports:** user is providing CSVs → import via `scripts/import-search-data.py` into `evidence/` before/at Phase 2 so the analytics baseline is first-party, not inferred.
- Crawl evidence: `scripts/collect-site-evidence.py` → `evidence/`.

## Checkpoints
Pause after Phase 1 (Strategy) for user review before fanning out Phases 2–5.
