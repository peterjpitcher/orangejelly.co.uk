# Retired-claims sweep — master worklist

**Purpose:** a file-by-file inventory of every *retired* Orange Jelly business claim still present in the repo, so a human can run a focused content sweep.

- **Single source of truth:** [`/CLAIMS.md`](../../CLAIMS.md). The approved, percentage-based claims (+828% search visibility, +403% table bookings, +567% private hire, −89% no-shows, +98% food revenue) are **correct** and are NOT flagged here.
- **Date context:** generated 2026-06-01 (read-only audit). British English throughout.
- **Scope note:** the *actionable* worklist is the **primary zone** — live, tracked content (`content/**`, `src/**`) plus the `CLAUDE.md` guidance block. A large **secondary zone** (one-off Sanity migration scripts in `scripts/`, planning docs in `docs/`/`seo-overhaul/`, QA reports in `tasks/`, `CLAUDE_OLD.md`, and generated feeds in `public/`) also contains retired figures but is **not rendered by the site**. It is listed separately at the end; treat it as low priority / optional history cleanup.
- **Governance docs excluded** from all listings (they legitimately discuss retired claims): `CLAIMS.md`, `docs/CLAIMS_MASTER.md`, `docs/plans/APPROVED_CLAIMS.md`, `docs/TONE_OF_VOICE.md`.

### Headline

The four `content/data` files named as SSOT implementation targets in CLAIMS.md — `claims.json`, `social-proof.json`, `results.json`, `case-studies.json` — have **already been re-based** onto the approved claims. **No retired figures remain in them.** The surviving retired claims are concentrated in four un-rendered Greene King handover templates, one rendered trust-badge, one FAQ line, and a stale example block in `CLAUDE.md`.

---

## 1. Summary table (primary zone — live/tracked content)

"High confidence" = an unambiguous retired claim. The strict primary pass left **no ambiguous primary hits** — all primary hits below are high-confidence. Generic-number false positives are documented under Caveats (section 5).

| # | Retired claim | Files affected (high-conf, primary) | Secondary-zone files |
|---|---------------|:---:|:---:|
| 1 | AI time reclaimed — "25 hours/week" | 3 | 43 |
| 2 | Social reach / views — "60,000–70,000 monthly" | 1 | 38 |
| 3 | Value added — "£75,000–£100,000" | 4 | 27 |
| 4 | Monthly cost reductions — "£4,000+/month" / "£4,000 extra" | 5 | 2 |
| 5 | Food waste — "reduced by 90%" | 1 | 3 |
| 6 | SMS contacts — "250 opted-in" | 1 | 1 |
| 7 | Contact database — "300 contacts" | 0 | 14 |
| 8 | Sunday waste / margin — "£250/week" | 4 | 19 |
| 9 | Tasting retention — "85%" | 0 | 17 |
| 10 | Live video engagement — "+300%" | 0 | 1 |
| 11 | UGC engagement — "79%" | 0 | 4 |
| 12 | Foot traffic — "20% more" | 0 | 6 |
| 13 | Food GP — "58% → 71%" | 0 | 52 |
| 14 | Quiz regulars — "25–30 / 25–35 / up from 20" | 3 | 50 |
| 15 | Results-page case-study stats (+22% GP, +20% weekday, 30% waste, 93% time, +300% reach, +79% UGC, 100% sell-out, 90% food waste) | 0 | 3 |
| | **Distinct primary files affected** | **7** | — |

---

## 2. By retired claim (primary zone detail)

### 1. AI time reclaimed — "25 hours/week"
*Action:* Retire — raw number, no replacement. Reframe as "reclaim hours every week" with no figure (CLAIMS.md tone guidance).

**High confidence:**

- `content/data/trust-badges.json:35` — "title": "Transform 25 Hours Into Growth",
- `content/greene-king-email-template.md:135` — - Up to 25 hours reclaimed each week
- `content/greene-king-email-v2.html:99` — We've reclaimed <strong>up to 25 hours weekly</strong> across the board - from menu planning to social media, from event organisation to Sunday lunch bookings. All …

### 2. Social reach / views — "60,000–70,000 monthly"
*Action:* Retire. Use `search-visibility` (+828%) as the visibility proof point instead.

**High confidence:**

- `content/greene-king-email-template.md:67` — When we took over, quiz nights were empty. Now we consistently see 25-30 regular teams each month, reach 60,000-70,000 people on social media, and have added £7…

### 3. Value added — "£75,000–£100,000"
*Action:* Retire — raw £, not a %. No replacement.

**High confidence:**

- `CLAUDE.md:807` — value_added: "£75K"
- `content/greene-king-email-template.md:67` — When we took over, quiz nights were empty. Now we consistently see 25-30 regular teams each month, reach 60,000-70,000 people on social media, and have added £7…
- `content/greene-king-email-template.md:130` — - £75,000-£100,000 added business value
- `content/greene-king-partnership-email.html:106` — <div style="color: #FF6B35; font-size: 32px; font-weight: 700; margin-bottom: 8px;">£75k-£100k</div>
- `content/greene-king-partnership-email.html:107` — <div style="color: #2C5F5F; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Business Value Added</div>
- `content/greene-king-partnership-letter.html:389` — <div class="metric-value">£75k-£100k</div>
- `content/greene-king-partnership-letter.html:390` — <div class="metric-label">Value Added</div>

### 4. Monthly cost reductions — "£4,000+/month" / "£4,000 extra"
*Action:* Retire. No approved cost-reduction % exists; remove the figure and avoid the banned cost-reduction wording (the pre-commit hook rejects it).

**High confidence:**

- `content/faqs/website.md:5` — 80% of people check a pub's website before visiting. Without one, you're invisible on Google and losing £1000s in bookings to competitors. Our websites get you …
- `content/greene-king-email-template.md:58` — I'm Peter Pitcher, licensee of The Anchor in Stanwell Moor - a Greene King tenancy we've run since March 2019. We've cut £250/week in Sunday waste and £4,000+ a…
- `content/greene-king-email-template.md:134` — - £4,000+ monthly cost reductions
- `content/greene-king-email-v2.html:78` — I'm Peter Pitcher, and together with my husband Billy, we run <strong>The Anchor in Stanwell Moor</strong> - a Greene King tenancy since March 2019. We've cut £…
- `content/greene-king-email-v2.html:117` — <div style="color: #FF6B35; font-size: 28px; font-weight: 700; margin-bottom: 4px;">£4,000+</div>
- `content/greene-king-partnership-email.html:193` — Higher tenant profitability drives better rent sustainability and growth potential. Our £250/week waste reduction and £4,000+ monthly cost reductions demonstrate the po…
- `content/greene-king-partnership-letter.html:456` — <p>Higher tenant profitability drives better rent sustainability and growth potential. Our £250/week waste reduction and £4,000+ monthly cost reductions demonstrate the…

### 5. Food waste — "reduced by 90%"
*Action:* Retire — no replacement. Remove, or reframe as "cut waste" with no figure.

**High confidence:**

- `content/greene-king-email-v2.html:165` — AI constantly analyses and revises our menus, identifying what sells and what doesn't. We cut £250/week in Sunday waste and reduced food waste by 90% by underst…

### 6. SMS contacts — "250 opted-in"
*Action:* Retire — no replacement.

**High confidence:**

- `content/greene-king-email-template.md:79` — 5. **Community Engagement**: Build a database of regular customers (we have 250 opted-in SMS contacts) who actually come back, not just grab offers and disappea…
- `content/greene-king-email-template.md:131` — - 250 opted-in SMS contacts

### 7. Contact database — "300 contacts"
*Action:* Retire — no replacement. (No live hits found.)

**High confidence:** none in live/tracked content.

### 8. Sunday waste / margin — "£250/week"
*Action:* Retire — no replacement. Reframe as "cut waste" with no figure.

**High confidence:**

- `content/greene-king-email-template.md:7` — - "How We Cut £250/Week in Sunday Waste at Our Greene King Pub"
- `content/greene-king-email-template.md:58` — I'm Peter Pitcher, licensee of The Anchor in Stanwell Moor - a Greene King tenancy we've run since March 2019. We've cut £250/week in Sunday waste and £4,000+ a…
- `content/greene-king-email-template.md:81` — 6. **Waste Reduction**: Our Sunday lunch prediction model cuts £250 weekly in waste - crucial for hitting those GP targets.
- `content/greene-king-email-template.md:133` — - £250/week waste reduction
- `content/greene-king-email-v2.html:78` — I'm Peter Pitcher, and together with my husband Billy, we run <strong>The Anchor in Stanwell Moor</strong> - a Greene King tenancy since March 2019. We've cut £…
- `content/greene-king-email-v2.html:111` — <div style="color: #FF6B35; font-size: 28px; font-weight: 700; margin-bottom: 4px;">£250/week</div>
- `content/greene-king-email-v2.html:136` — 🍽️ How We Cut £250/Week in Sunday Lunch Waste
- `content/greene-king-email-v2.html:165` — AI constantly analyses and revises our menus, identifying what sells and what doesn't. We cut £250/week in Sunday waste and reduced food waste by 90% by underst…
- `content/greene-king-partnership-email.html:99` — <div style="color: #FF6B35; font-size: 32px; font-weight: 700; margin-bottom: 8px;">£250/week</div>
- `content/greene-king-partnership-email.html:193` — Higher tenant profitability drives better rent sustainability and growth potential. Our £250/week waste reduction and £4,000+ monthly cost reductions demonstrate the po…
- `content/greene-king-partnership-letter.html:384` — <div class="metric-value">£250/week</div>
- `content/greene-king-partnership-letter.html:456` — <p>Higher tenant profitability drives better rent sustainability and growth potential. Our £250/week waste reduction and £4,000+ monthly cost reductions demonstrate the…

### 9. Tasting retention — "85%"
*Action:* Retire — no replacement. (No live hits found.)

**High confidence:** none in live/tracked content.

### 10. Live video engagement — "+300%"
*Action:* Retire — no replacement. (No live hits found.)

**High confidence:** none in live/tracked content.

### 11. UGC engagement — "79%"
*Action:* Retire — no replacement. (No live hits found.)

**High confidence:** none in live/tracked content.

### 12. Foot traffic — "20% more"
*Action:* Retire — no replacement. (No live hits; only generic "foot traffic" prose, see Caveats.)

**High confidence:** none in live/tracked content.

### 13. Food GP — "58% → 71%"
*Action:* Replace with `food-revenue` (+98% in three months). (No live "58→71" pairing remains — already cleaned.)

**High confidence:** none in live/tracked content.

### 14. Quiz regulars — "25–30 / 25–35 / up from 20"
*Action:* Retire — no replacement.

**High confidence:**

- `CLAUDE.md:805` — quiz_night: "25 regulars"
- `content/greene-king-email-template.md:67` — When we took over, quiz nights were empty. Now we consistently see 25-30 regular teams each month, reach 60,000-70,000 people on social media, and have added £7…
- `content/greene-king-email-template.md:132` — - 25-30 quiz teams every month
- `content/greene-king-email-v2.html:96` — When QuestionOne brought us <strong>zero customers</strong> and refused to innovate, we took matters into our own hands. Using AI tools and our own creativity, …

### 15. Results-page case-study stats (+22% GP, +20% weekday, 30% waste, 93% time, +300% reach, +79% UGC, 100% sell-out, 90% food waste)
*Action:* Re-base affected case studies on the five approved claims. NOTE: results.json & case-studies.json already re-based — no live hits remain.

**High confidence:** none in live/tracked content.

---

## 3. By file — sweep checklist (primary zone)

Sorted by number of distinct retired claims, descending. Work top-to-bottom.

- [ ] `content/greene-king-email-template.md` — claims: AI time reclaimed, Social reach / views, Value added, Monthly cost reductions, SMS contacts, Sunday waste / margin, Quiz regulars
  - _STATIC handover doc — tracked in git, NOT rendered by the app. Epicentre: carries almost every retired claim verbatim._
- [ ] `content/greene-king-email-v2.html` — claims: AI time reclaimed, Monthly cost reductions, Food waste, Sunday waste / margin, Quiz regulars
  - _STATIC handover doc — not rendered. Retired claims in body + metric tiles._
- [ ] `content/greene-king-partnership-email.html` — claims: Value added, Monthly cost reductions, Sunday waste / margin
  - _STATIC handover doc — not rendered. Retired claims in metric tiles + body._
- [ ] `content/greene-king-partnership-letter.html` — claims: Value added, Monthly cost reductions, Sunday waste / margin
  - _STATIC handover doc — not rendered. Retired claims in metric tiles + body._
- [ ] `CLAUDE.md` — claims: Value added, Quiz regulars
  - _AI-guidance file — stale example blocks (test_metrics, business) still show "25 regulars" / "£75K" / "58% → 71%". Not user-facing, but should be synced to CLAIMS.md._
- [ ] `content/data/trust-badges.json` — claims: AI time reclaimed
  - _RENDERED (via src/components/TrustBadgesWrapper.tsx) — LIVE customer-facing. "Transform 25 Hours Into Growth"._
- [ ] `content/faqs/website.md` — claims: Monthly cost reductions
  - _FAQ content — "one pub saw £4,000 extra bookings in 3 months"._

> Optional cosmetic: `content/data/results.json` and `content/data/case-studies.json` still use the legacy ids/slugs `food-gp-improvement` / `anchor-food-gp`, but their numbers are already the approved +98% food-revenue claim. No copy change needed; rename only if slug hygiene matters.

---

## 4. Suggested replacements (per claim)

| Retired claim | What to do |
|---------------|------------|
| AI time reclaimed — "25 hours/week" | Retire — raw number, no replacement. Reframe as "reclaim hours every week" with no figure (CLAIMS.md tone guidance). |
| Social reach / views — "60,000–70,000 monthly" | Retire. Use `search-visibility` (+828%) as the visibility proof point instead. |
| Value added — "£75,000–£100,000" | Retire — raw £, not a %. No replacement. |
| Monthly cost reductions — "£4,000+/month" / "£4,000 extra" | Retire. No approved cost-reduction % exists; remove the figure and avoid the banned cost-reduction wording (the pre-commit hook rejects it). |
| Food waste — "reduced by 90%" | Retire — no replacement. Remove, or reframe as "cut waste" with no figure. |
| SMS contacts — "250 opted-in" | Retire — no replacement. |
| Contact database — "300 contacts" | Retire — no replacement. (No live hits found.) |
| Sunday waste / margin — "£250/week" | Retire — no replacement. Reframe as "cut waste" with no figure. |
| Tasting retention — "85%" | Retire — no replacement. (No live hits found.) |
| Live video engagement — "+300%" | Retire — no replacement. (No live hits found.) |
| UGC engagement — "79%" | Retire — no replacement. (No live hits found.) |
| Foot traffic — "20% more" | Retire — no replacement. (No live hits; only generic "foot traffic" prose, see Caveats.) |
| Food GP — "58% → 71%" | Replace with `food-revenue` (+98% in three months). (No live "58→71" pairing remains — already cleaned.) |
| Quiz regulars — "25–30 / 25–35 / up from 20" | Retire — no replacement. |
| Results-page case-study stats (+22% GP, +20% weekday, 30% waste, 93% time, +300% reach, +79% UGC, 100% sell-out, 90% food waste) | Re-base affected case studies on the five approved claims. NOTE: results.json & case-studies.json already re-based — no live hits remain. |

General rule (from CLAIMS.md): express any improvement as a **percentage**, always attribute it to **The Anchor**, use British English, and avoid the banned cost-reduction word family (the pre-commit hook rejects it) — prefer "reclaim", "cut waste", or "margin growth".

---

## 5. Caveats — generic patterns that produced false positives

Searched but **deliberately excluded** from high-confidence lists because, in context, they are legitimate generic content rather than retired Anchor claims:

- **`58%` / `71%` / `food GP`** — Blog articles give generic industry GP advice ("target 60–65% wet GP", "food GP 65–70%", "if blended wet GP is below 58%"). Educational benchmarks, not the retired "58% → 71%" Anchor claim. The actual pairing no longer exists in live content.
- **`foot traffic`** — Appears only as ordinary copy/titles ("Turn Food Photos Into Foot Traffic", A-board article). No instance of the retired "20% more foot traffic" claim survives.
- **`hours a week`** — Blog prose about hours running a pub takes ("60–80 hours a week", "8–10 overtime hours") and ROI-calculator field labels ("Hours per week on admin") — not the retired "25 hours reclaimed" claim.
- **`25-30` / `25-35`** — Also matches benign ranges like "£25–35 experience packages" and "labour cost 25–30%". Only quiz-context matches kept.
- **`60000` / `70000`** — Matches `setInterval(…, 60000)` in `src/components/AvailabilityStatus.tsx` and unrelated keyword-volume figures in QA reports.
- **`sell-out` / `sellout`** — Generic event-marketing copy and an SEO keyword ("sell out pub events"); none are the retired "100% sell-out" stat.
- **`£1000s`** — "losing £1000s in bookings" is rhetorical, not the £4,000 claim. (The genuine £4,000 hit in faqs/website.md was kept.)

---

## 6. Secondary zone — non-rendered files (awareness only, low priority)

82 files outside the live site also contain retired figures. These are **historical / build / planning artefacts** and do not affect what visitors see. Sweep only for full repo hygiene.

Breakdown by area:

- **scripts/ (one-off Sanity migration scripts — only 2 wired into package.json; src/ imports none)** — 30 file(s)
- **docs/ (planning & handover markdown)** — 23 file(s)
- **seo-overhaul/ (SEO planning docs)** — 20 file(s)
- **tasks/ (codex-qa-review reports)** — 5 file(s)
- **public/ (generated feeds/search index — regenerate from source)** — 2 file(s)
- **other** — 1 file(s)
- **CLAUDE_OLD.md (superseded copy of CLAUDE.md)** — 1 file(s)

<details><summary>Full secondary-zone file list (click to expand)</summary>

- `CLAUDE_OLD.md` — AI time reclaimed, Social reach / views, Value added, Contact database, Sunday waste / margin, Tasting retention, Food GP, Quiz regulars
- `assets/email-signature.html` — AI time reclaimed
- `docs/ACTION-PLAN.md` — AI time reclaimed, Social reach / views, Value added, Contact database, Sunday waste / margin, Tasting retention, Food GP, Quiz regulars
- `docs/CONTENT_COMPARISON_REPORT.md` — Social reach / views, Value added, Food GP, Quiz regulars
- `docs/CONTENT_VERIFICATION_REPORT.md` — AI time reclaimed, Social reach / views, Food GP, Quiz regulars
- `docs/FINAL_COMPLIANCE_REPORT.md` — AI time reclaimed, Social reach / views, Value added, Contact database, Sunday waste / margin, Tasting retention, Food GP, Quiz regulars
- `docs/FINAL_CONTENT_VERIFICATION_REPORT.md` — AI time reclaimed, Social reach / views, Value added, Contact database, Sunday waste / margin, Tasting retention, Food GP, Quiz regulars
- `docs/PRODUCTION_CONTENT_VERIFICATION.md` — AI time reclaimed, Social reach / views, Value added, Contact database, Sunday waste / margin, Tasting retention, Food GP, Quiz regulars
- `docs/greene-king-toolkit/autumn-2026-implementation-plan.md` — Value added, Quiz regulars
- `docs/greene-king-toolkit/autumn-2026-spec.md` — Value added
- `docs/migration/CLAIMS_MIGRATION_PLAN.md` — AI time reclaimed, Contact database
- `docs/migration/EXECUTIVE_SUMMARY_SHADCN_MIGRATION.md` — Quiz regulars
- `docs/migration/MIGRATION_COMPLETE_REPORT.md` — Food GP
- `docs/plans/REQUIRED_CHANGES.md` — AI time reclaimed, Social reach / views, Value added, Sunday waste / margin, Tasting retention, Food GP, Quiz regulars
- `docs/plans/seo-optimization-plan.md` — AI time reclaimed
- `docs/reports/CLAIMS_AUDIT.md` — AI time reclaimed, Social reach / views, Value added, Monthly cost reductions, Food waste, SMS contacts, Contact database, Sunday waste / margin, Live video engagement, UGC engagement, Foot traffic, Food GP, Quiz regulars
- `docs/reports/COMPREHENSIVE_BLOG_REVIEW_REPORT.md` — Foot traffic
- `docs/reports/RAW_CONTENT_AND_HTML_ISSUES.md` — AI time reclaimed
- `docs/reports/blog-schema-analysis-2025-08-11.md` — Foot traffic
- `docs/reports/comprehensive-blog-review-1754646722064.json` — Foot traffic, Food GP
- `docs/reports/comprehensive-blog-review-1754647042563.json` — Foot traffic, Food GP
- `docs/superpowers/plans/2026-04-05-commercial-transform-plan-a-foundation.md` — Food GP
- `docs/superpowers/plans/2026-04-05-commercial-transform-plan-b-atomic-launch.md` — Quiz regulars
- `docs/superpowers/specs/2026-04-05-commercial-transformation-design.md` — AI time reclaimed, Social reach / views, Value added, Contact database, Sunday waste / margin, Tasting retention, Food GP, Quiz regulars
- `docs/voice/growth-messaging.md` — AI time reclaimed
- `public/llms-full.txt` — AI time reclaimed
- `public/llms.txt` — AI time reclaimed, Results-page case-study stats (+22% GP, +20% weekday, 30% waste, 93% time, +300% reach, +79% UGC, 100% sell-out, 90% food waste)
- `scripts/CASE_STUDIES_STATUS.md` — Social reach / views, Contact database, Sunday waste / margin, Tasting retention, Food GP, Quiz regulars, Results-page case-study stats (+22% GP, +20% weekday, 30% waste, 93% time, +300% reach, +79% UGC, 100% sell-out, 90% food waste)
- `scripts/add-pub-health-check-article.ts` — Quiz regulars
- `scripts/case-studies-import.ndjson` — AI time reclaimed, Social reach / views, Sunday waste / margin, Tasting retention, Food GP, Quiz regulars
- `scripts/create-case-studies.ts` — AI time reclaimed, Social reach / views, Sunday waste / margin, Tasting retention, Food GP, Quiz regulars, Results-page case-study stats (+22% GP, +20% weekday, 30% waste, 93% time, +300% reach, +79% UGC, 100% sell-out, 90% food waste)
- `scripts/create-og-image.ts` — Value added, Food GP, Quiz regulars
- `scripts/create-selected-articles.ts` — Quiz regulars
- `scripts/delete-old-case-studies.ts` — Social reach / views, Food GP, Quiz regulars
- `scripts/migrate-about-content-simple.js` — AI time reclaimed, Social reach / views, Value added, Food GP, Quiz regulars
- `scripts/migrate-about-content.ts` — AI time reclaimed, Food GP, Quiz regulars
- `scripts/migrate-about-faqs.ts` — AI time reclaimed, Social reach / views, Value added, Food GP, Quiz regulars
- `scripts/migrate-about-hardcoded-content.ts` — AI time reclaimed, Social reach / views, Value added, Food GP, Quiz regulars
- `scripts/migrate-all-hardcoded-content.ts` — AI time reclaimed, Social reach / views, Food GP
- `scripts/migrate-all-landing-pages.ts` — Social reach / views, Tasting retention, Quiz regulars
- `scripts/migrate-case-studies.ts` — AI time reclaimed, Social reach / views, Food waste, Contact database, Tasting retention, Food GP, Quiz regulars
- `scripts/migrate-company-constants.ts` — Food GP, Quiz regulars
- `scripts/migrate-footer-content.ts` — AI time reclaimed
- `scripts/migrate-homepage-content.ts` — AI time reclaimed, Social reach / views, Value added, Food GP, Quiz regulars
- `scripts/migrate-homepage-hero.ts` — AI time reclaimed, Social reach / views, Value added, Food GP, Quiz regulars
- `scripts/migrate-landing-pages-content.ts` — AI time reclaimed, Social reach / views, Food GP, Quiz regulars
- `scripts/migrate-landing-pages.ts` — Social reach / views, Tasting retention, Quiz regulars
- `scripts/migrate-phase1-content.ts` — AI time reclaimed, Social reach / views, Contact database, Food GP, Quiz regulars
- `scripts/migrate-related-links.ts` — AI time reclaimed
- `scripts/migrate-roi-calculator.ts` — AI time reclaimed
- `scripts/migrate-seo-metadata.ts` — Sunday waste / margin, Food GP, Quiz regulars
- `scripts/migrate-services-content-new.ts` — AI time reclaimed, Social reach / views, Value added, Sunday waste / margin, Tasting retention, Food GP, Quiz regulars
- `scripts/migrate-services-content.ts` — AI time reclaimed, Social reach / views, Value added, Sunday waste / margin, Tasting retention, Food GP, Quiz regulars
- `scripts/migrate-services-faqs.ts` — AI time reclaimed, Social reach / views, Value added, Tasting retention, Food GP, Quiz regulars
- `scripts/migrate-social-proof.ts` — AI time reclaimed, Sunday waste / margin, Food GP, Quiz regulars
- `scripts/migrate-trustbar-content.ts` — Food GP, Quiz regulars
- `scripts/standardize-blog-posts.ts` — AI time reclaimed, Social reach / views, Value added, Contact database, Sunday waste / margin, Food GP, Quiz regulars
- `seo-overhaul/editorial-calendar-26-weeks.md` — Food GP, Quiz regulars
- `seo-overhaul/keyword-plan.md` — Food GP
- `seo-overhaul/phase-1-strategy/competitor-landscape.md` — AI time reclaimed
- `seo-overhaul/phase-1-strategy/keyword-framework.md` — UGC engagement, Food GP
- `seo-overhaul/phase-1-strategy/strategy-document.md` — Social reach / views, Value added, Food GP, Quiz regulars
- `seo-overhaul/phase-2-discovery/analytics/baseline-metrics.md` — Social reach / views, UGC engagement
- `seo-overhaul/phase-2-discovery/analytics/report.md` — Social reach / views
- `seo-overhaul/phase-2-discovery/authority/backlink-analysis.md` — Quiz regulars
- `seo-overhaul/phase-2-discovery/authority/report.md` — AI time reclaimed, Social reach / views, Food GP, Quiz regulars
- `seo-overhaul/phase-2-discovery/content-strategy/content-gap-map.md` — AI time reclaimed, Food GP
- `seo-overhaul/phase-2-discovery/content-strategy/keyword-clusters.md` — Food GP
- `seo-overhaul/phase-2-discovery/content-strategy/page-action-table-2026-05.md` — Foot traffic
- `seo-overhaul/phase-2-discovery/content-strategy/report.md` — AI time reclaimed, Social reach / views, Value added, Contact database, Sunday waste / margin, Tasting retention, Food GP
- `seo-overhaul/phase-3-deep-dive/copywriter/page-recommendations.md` — Social reach / views, Food GP, Quiz regulars
- `seo-overhaul/phase-3-deep-dive/editor-qa/report.md` — Food GP, Quiz regulars
- `seo-overhaul/phase-3-deep-dive/ux-cro/landing-page-recommendations.md` — Social reach / views, Value added, Sunday waste / margin, Food GP, Quiz regulars
- `seo-overhaul/phase-3-deep-dive/ux-cro/report.md` — Social reach / views, Value added, Sunday waste / margin, Quiz regulars
- `seo-overhaul/phase-4-feasibility/web-developer/implementation-estimates.md` — Food GP
- `seo-overhaul/phase-4-feasibility/web-developer/report.md` — Food GP, Quiz regulars
- `seo-overhaul/seo-growth-roadmap.md` — UGC engagement, Food GP, Quiz regulars
- `tasks/codex-qa-review/2026-04-05-commercial-transform-seo-report.md` — AI time reclaimed, Food GP, Quiz regulars
- `tasks/codex-qa-review/2026-04-05-keyword-plan-codex-qa-report.md` — AI time reclaimed
- `tasks/codex-qa-review/2026-04-05-keyword-plan-opportunities-report.md` — Social reach / views
- `tasks/codex-qa-review/2026-04-05-keyword-plan-strategy-report.md` — Value added
- `tasks/todo.md` — AI time reclaimed, Value added, Monthly cost reductions, Food waste, Contact database

</details>

