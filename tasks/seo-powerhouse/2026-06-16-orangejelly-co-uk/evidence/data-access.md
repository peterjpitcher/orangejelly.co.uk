# Data Access Summary

Collected at: 2026-06-16 08:04:35

This file records which search and analytics exports were available when the evidence was assembled. Missing or unreliable data is stated plainly so that downstream analysis lowers its confidence rather than inventing numbers.

## Inputs requested

| Input | Flag | Path | Status | Detail | Rows |
|---|---|---|---|---|---|
| GSC queries | --gsc | `/Users/peterpitcher/Library/Mobile Documents/com~apple~CloudDocs/Downloads/Search Data OJ/GSC 12 months/Queries.csv` | OK | detected: clicks, ctr, impressions, position, query; missing: page | 701 |
| GSC pages | --gsc-pages | `/Users/peterpitcher/Library/Mobile Documents/com~apple~CloudDocs/Downloads/Search Data OJ/GSC 12 months/Pages.csv` | OK | 132 page rows indexed | 132 |
| GA4 landing pages | --ga4 | (not supplied) | MISSING | input not provided | 0 |

## What was available

- GSC pages: 132 page rows indexed
- GSC queries: detected: clicks, ctr, impressions, position, query; missing: page

## What was missing

- GA4 landing pages (--ga4): not supplied.

## What looked unreliable

- No reliability concerns flagged for the supplied inputs.

## Normalised output

- `search-queries.csv`: 701 row(s).
- `landing-pages.csv`: 0 row(s).

Note: GSC query exports do not embed a reporting window, so the `date_range` column is stamped with the collection date above. Replace it with the true reporting window if you know it.
