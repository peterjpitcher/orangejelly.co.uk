# Data Access Summary

Collected at: 2026-07-07 07:12:29

This file records which search and analytics exports were available when the evidence was assembled. Missing or unreliable data is stated plainly so that downstream analysis lowers its confidence rather than inventing numbers.

## Inputs requested

| Input | Flag | Path | Status | Detail | Rows |
|---|---|---|---|---|---|
| GSC queries | --gsc | `/Users/peterpitcher/Cursor/OJ-OrangeJelly.co.uk/tasks/seo-powerhouse/2026-06-16-orangejelly-co-uk/evidence/gsc/GSC 28 days/Queries.csv` | OK | detected: clicks, ctr, impressions, position, query; missing: page | 284 |
| GSC pages | --gsc-pages | `/Users/peterpitcher/Cursor/OJ-OrangeJelly.co.uk/tasks/seo-powerhouse/2026-06-16-orangejelly-co-uk/evidence/gsc/GSC 28 days/Pages.csv` | OK | 76 page rows indexed | 76 |
| GA4 landing pages | --ga4 | (not supplied) | MISSING | input not provided | 0 |
| GSC page indexing (coverage) | --coverage | (not supplied) | MISSING | optional input not provided | 0 |
| Backlinks (Ahrefs/Semrush) | --backlinks | (not supplied) | MISSING | optional input not provided | 0 |

## What was available

- GSC pages: 76 page rows indexed
- GSC queries: detected: clicks, ctr, impressions, position, query; missing: page

## What was missing

- GA4 landing pages (--ga4): not supplied.
- GSC page indexing (coverage) (--coverage): not supplied (optional).
- Backlinks (Ahrefs/Semrush) (--backlinks): not supplied (optional).

## What looked unreliable

- No reliability concerns flagged for the supplied inputs.

## Normalised output

- `search-queries.csv`: 284 row(s).
- `landing-pages.csv`: 0 row(s).

Note: GSC query exports do not embed a reporting window, so the `date_range` column is stamped with the collection date above. Replace it with the true reporting window if you know it.
