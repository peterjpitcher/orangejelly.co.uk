# Structured-data validation — summary

- Source file: `schema.json`
- Validated at (UTC): 2026-07-07T06:14:36.196856+00:00
- Pages with JSON-LD: 152
- Typed JSON-LD blocks checked: 5946

This validation is OFFLINE — no Rich Results Test or external API is called. Required/recommended fields come from a bundled, sourced subset of Google's structured-data documentation; nothing is inferred about unknown types.

## Findings

| Finding | Count |
|---|---|
| Blocks missing a REQUIRED field | 12 |
| Blocks missing a RECOMMENDED field | 818 |
| Retired/deprecated rich results (HowTo/FAQ) | 138 |
| Self-serving Review/AggregateRating | 0 |
| Rich-result eligible (required complete, live type) | 753 |
| Unknown @type (no verdict given) | 4564 |

## Actionable gaps (150)

Seeded into `backlog-seed-schema.json` for `score-opportunities.py` (the six 1-5 scores are left for the human/orchestrator).

- **schema-001** — Review the FAQPage schema on https://www.orangejelly.co.uk/ — its rich result has been retired by Google; keep the markup only if it still serves a non-rich-result purpose.
- **schema-002** — Review the FAQPage schema on https://www.orangejelly.co.uk/about — its rich result has been retired by Google; keep the markup only if it still serves a non-rich-result purpose.
- **schema-003** — Review the FAQPage schema on https://www.orangejelly.co.uk/compete-with-pub-chains — its rich result has been retired by Google; keep the markup only if it still serves a non-rich-result purpose.
- **schema-004** — Review the FAQPage schema on https://www.orangejelly.co.uk/contact — its rich result has been retired by Google; keep the markup only if it still serves a non-rich-result purpose.
- **schema-005** — Review the FAQPage schema on https://www.orangejelly.co.uk/contact?package=growth-fix — its rich result has been retired by Google; keep the markup only if it still serves a non-rich-result purpose.
- **schema-006** — Review the FAQPage schema on https://www.orangejelly.co.uk/contact?package=growth-partner — its rich result has been retired by Google; keep the markup only if it still serves a non-rich-result purpose.
- **schema-007** — Review the FAQPage schema on https://www.orangejelly.co.uk/contact?package=momentum-month — its rich result has been retired by Google; keep the markup only if it still serves a non-rich-result purpose.
- **schema-008** — Review the FAQPage schema on https://www.orangejelly.co.uk/contact?package=turnaround-intensive — its rich result has been retired by Google; keep the markup only if it still serves a non-rich-result purpose.
- **schema-009** — Review the FAQPage schema on https://www.orangejelly.co.uk/empty-pub-solutions — its rich result has been retired by Google; keep the markup only if it still serves a non-rich-result purpose.
- **schema-010** — Review the FAQPage schema on https://www.orangejelly.co.uk/fix-my-pub — its rich result has been retired by Google; keep the markup only if it still serves a non-rich-result purpose.

## Output files

- `schema-issues.csv` — one row per typed JSON-LD block.
- `backlog-seed-schema.json` — actionable gaps shaped for `score-opportunities.py`.

_Offline validation. No external API called. Unknown types are reported, never guessed._
