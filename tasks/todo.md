# Plan: migrate site claims to the new business proof set — COMPLETE

**Decisions (2026-05-31):** full pivot to the 5 new %-based claims; private hire = annualised **+567%**.
Canonical SSOT: [`/CLAIMS.md`](../CLAIMS.md). New set (all The Anchor): Search visibility **+828%** · table bookings **+403%** · private hire **+567%** · no-shows **−89%** · food revenue **+98%**.
Orphan retired metrics (£75-100K value, 25 hrs/week, £4,000/month, 90% food waste, 250/300 contacts) → retired, reframed qualitatively (never a raw number).

## Phase 0 — Discovery & decisions ✅
## Phase 1 — Root SSOT ✅ (CLAIMS.md, CLAUDE.md YAML, deprecated APPROVED_CLAIMS.md)
## Phase 2 — Data layer ✅ (claims.json + 8 ProofStrips + packages.json + case-studies.json + social-proof.json + constants.ts + tests)
## Phase 3 — Rendered site ✅
- /results (results.json, ResultsPage.tsx, page.tsx schema, case-studies.json)
- 8 landing pages · 6 components · seo-overrides.ts + metadata.ts · 5 content/data files · 9 FAQs
## Phase 4 — Blog + content ✅
- 24 blog posts (generic benchmarks preserved; only Anchor proof claims pivoted)
- 4 content/case-studies/*.md (confirmed unrendered — hygiene)
- content/greene-king-email-template.md → LEFT per your choice (overlaps active autumn-toolkit work)

## Verification ✅ (all green)
- type-check (tsc) · lint (eslint + growth-language + british-english) · 67 tests · production build

## Phase 5 — Ship (open)
- [ ] git: nothing committed yet; working tree also holds unrelated autumn-toolkit changes. Plan: stage only the claims files and commit to main as a clean changeset — awaiting your go.
- [ ] Run `/session-setup partial` (route files changed)

## Notes
- 3 pre-existing lint warnings in `src/components/blog/BlogPost.tsx` (unused imports) are unrelated to this work.
