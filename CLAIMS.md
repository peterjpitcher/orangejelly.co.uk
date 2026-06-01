# Orange Jelly — Claims & Metrics (Single Source of Truth)

**Status:** Authoritative. This file supersedes `docs/plans/APPROVED_CLAIMS.md`.
**Approved by:** Peter Pitcher · **Last reviewed:** 2026-06-01 · **Review cycle:** quarterly

---

## How to use this document

- Every quantified proof point shown anywhere on orangejelly.co.uk **must** come from the "Approved claims" table below.
- **Always express improvement as a percentage — never a raw number or a multiple.** Clients relate to "+403%" far better than "5×" or "from 6 to 20". Say "+98%", not "doubled"; say "−89%", not "from 20% to 2%".
- Every proof point is **proven at The Anchor, our own venue** — always state that provenance.
- Content constraints: British English throughout. Use "reclaim", "margin growth" or "cut waste" rather than the cost-reduction synonyms the pre-commit hook rejects.

---

## Approved claims (the only quantified proof points in use)

| ID | Public-facing claim | % | Basis / provenance (The Anchor) |
|----|---------------------|---|--------------------------------|
| `search-visibility` | Grew Google Search visibility by **828%** | **+828%** | Growth in Google Search-driven website visibility (Search Console clicks/impressions). |
| `table-bookings` | Increased table bookings by **403%** | **+403%** | Just over a fivefold increase in table bookings at The Anchor. |
| `private-hire` | Grew private hire bookings by **567%** | **+567%** | ~6 bookings/year previously; 20 confirmed in 6 months (~40/year run-rate). (40 − 6) / 6 = +567%. |
| `no-shows` | Cut booking no-shows by **89%** | **−89%** | No-show rate fell from around 20% to around 2% — an 89% reduction. |
| `food-revenue` | Grew food revenue by **98%** in three months | **+98%** | Food revenue grew by 98% (nearly doubled) within three months. |

### Notes on phrasing
- Lead with the percentage. Lighter copy may round generously (e.g. "more than 500%" for private hire) but never understate the true figure.
- `no-shows` reads best as "cut no-shows by 89%".
- `food-revenue` reads best as "grew food revenue by 98% in three months" — keep the % primary; "nearly doubled" may follow as colour, not as the headline number.
- Figures are deliberately precise (not rounded) so they read as real, measured results rather than marketing estimates.

---

## Retired claims — DO NOT USE

These older metrics are no longer approved. Remove them wherever they appear (data files, pages, blog posts, FAQs, schema/JSON-LD).

| Old claim | Where it lived | Replacement |
|-----------|----------------|-------------|
| Food GP "58% → 71%" | `claims.json` `food-gp-growth`, `case-studies.json` | `food-revenue` (+98%) |
| Quiz regulars "25-35 / 25-30 / up from 20" | `claims.json` `quiz-regulars`, `social-proof.json`, blogs | Retire (no replacement) |
| Social views "60-70K monthly" | `claims.json` `social-views`, `social-proof.json`, `case-studies.json` | `search-visibility` (+828%) is the visibility proof |
| "300 contacts" database | `claims.json` `contact-database`, `case-studies.json` | Retire |
| "250 opted-in SMS contacts" | `social-proof.json`, `results.json` | Retire |
| "£75-100K value added" | `claims.json` `value-added`, `social-proof.json`, `constants.ts` | Retire (raw £, not a %) |
| "£250/week" Sunday waste/margin | `claims.json` `sunday-margin-growth`, `social-proof.json`, `constants.ts` | Retire |
| "85% tasting retention" | `claims.json` `tasting-retention`, `results.json` | Retire |
| "25 hours/week" reclaimed | `claims.json` `ai-time-reclaimed`, `social-proof.json`, `constants.ts`, blogs | Retire (raw number) |
| Results-page case-study stats — "+22% GP", "+20% weekday", "30% waste", "93% time", "+300% reach", "+79% UGC", "100% sell-out", "90% food waste" | `results.json` | Re-base the case studies on the five approved claims |

> **Rationale:** the new set is growth-, booking- and revenue-led (get found, get booked, grow) — more relevant to clients and aligned to the Orange Jelly tone of voice. The retired set leaned on AI-efficiency and raw counts.

---

## Implementation map (where these render)

- **Structured data:** `content/data/claims.json` (ProofStrip source), `content/data/social-proof.json`, `content/data/results.json`, `content/data/case-studies.json`
- **Code constants:** `src/lib/constants.ts` (`SUCCESS_METRICS`)
- **AI / dev guidance:** `CLAUDE.md` (`metrics:` block) — keep in sync with this file
- **Pages & content:** homepage, `/results`, `/pub-marketing`, location landing pages, plus blog posts and FAQs

---

## Source

New claims provided by Peter (2026-05-31); figures refined to precise, non-rounded values 2026-06-01, aligned to the Orange Jelly Tone of Voice Guide. All figures are from The Anchor, Stanwell Moor.
