# SEO Evidence — Audit Summary

- Site crawled: https://www.orangejelly.co.uk/
- Collection date/time: 2026-07-07 06:12:25 UTC
- Collector: seo-powerhouse collect-site-evidence.py (read-only crawl)
- Pages collected: 153 (cap 200, max depth 4)
- robots.txt: 1 user-agent group(s), 8 Disallow rule(s), 1 Allow rule(s), 1 Sitemap line(s).
- Sitemap URLs discovered: 139

This file is a plain-English summary of repeatable evidence collected directly from the live site. All counts below come from the crawl; nothing is inferred or invented. Cite the companion CSV/JSON files for per-URL detail.

## Status-code distribution

| Status | Count |
|---|---|
| 200  | 152 |
| 404  | 1 |

## Templates found (URL-pattern heuristic)

| Template guess | URLs |
|---|---|
| section:licensees-guide | 117 |
| contact/conversion | 5 |
| service | 5 |
| section:ways-to-work | 4 |
| about/company | 1 |
| homepage | 1 |
| top-level:capabilities | 1 |
| top-level:compete-with-pub-chains | 1 |
| top-level:empty-pub-solutions | 1 |
| top-level:fix-my-pub | 1 |
| top-level:licensees-guide | 1 |
| top-level:pub-marketing | 1 |
| top-level:pub-marketing-agency | 1 |
| top-level:pub-marketing-berkshire | 1 |
| top-level:pub-marketing-buckinghamshire | 1 |
| top-level:pub-marketing-hampshire | 1 |
| top-level:pub-marketing-hertfordshire | 1 |
| top-level:pub-marketing-kent | 1 |
| top-level:pub-marketing-london | 1 |
| top-level:pub-marketing-no-budget | 1 |
| top-level:pub-marketing-oxfordshire | 1 |
| top-level:pub-marketing-surrey | 1 |
| top-level:pub-rescue | 1 |
| top-level:quiet-midweek-solutions | 1 |
| top-level:results | 1 |
| top-level:ways-to-work | 1 |

## Top issues

| Issue | Count | Notes |
|---|---|---|
| Network/fetch errors | 0 | URLs that could not be retrieved (see `error` column). |
| Missing <title> | 1 | HTML pages with no title tag. |
| Missing meta description | 1 | HTML pages with no meta description. |
| Missing canonical | 1 | HTML pages with no rel=canonical. |
| Canonical points elsewhere | 5 | Canonical genuinely targets a different URL (trailing-slash/scheme-case differences ignored). |
| No H1 | 2 | HTML pages with no H1 heading. |
| Multiple H1s | 0 | HTML pages with more than one H1. |
| Thin content (<300 words) | 4 | May need consolidation or expansion. |
| Noindex pages | 0 | Via robots meta or X-Robots-Tag header. |
| Pages behind redirects | 5 | Internal/sitemap URLs that redirect (see chain). |
| No structured data | 1 | HTML pages with no JSON-LD @type detected. |
| Images missing alt text | 0 | Total across all crawled pages. |
| Pages with oversized images | 11 | Image > 200 KB via HEAD. |
| HTML pages not in sitemap | 9 | Crawled but absent from XML sitemap. |
| Soft-404 candidates | 0 | 200 OK pages with near-empty/error-phrase main content (heuristic — see `soft_404_candidate` in url-inventory.csv). |
| JS-dependent pages | 0 | Rendered DOM materially exceeds raw HTML (heuristic — see `render-diff.csv`). |

## Raw vs rendered (JavaScript dependency)

- A rendered crawl was wanted (framework fingerprint detected or `--playwright` requested) but Playwright is not installed, so no raw-vs-rendered diff could be produced. Install with `pip install playwright && playwright install chromium`.

## Coverage diff (sitemap vs crawl vs indexed)

- In sitemap but not crawled: 0
- Crawled but not in sitemap (possible orphans): 9
- In sitemap but not in the GSC-indexed set: 69
- Indexed but not in sitemap: 35

Sample of crawled-but-not-in-sitemap URLs (first 10):
  - https://www.orangejelly.co.uk/contact?package=growth-fix
  - https://www.orangejelly.co.uk/contact?package=growth-partner
  - https://www.orangejelly.co.uk/contact?package=momentum-month
  - https://www.orangejelly.co.uk/contact?package=turnaround-intensive
  - https://www.orangejelly.co.uk/licensees-guide/pub-wages-labour-costs-uk
  - https://www.orangejelly.co.uk/services/content-creation-for-pubs
  - https://www.orangejelly.co.uk/services/instagram-services-for-pubs
  - https://www.orangejelly.co.uk/services/paid-social-for-pubs
  - https://www.orangejelly.co.uk/services/social-media-marketing-for-pubs

## Output files

- `url-inventory.csv` — one row per URL (status, final URL, template, counts; plus `soft_404_candidate`, `js_dependent`).
- `page-metadata.csv` — title, meta description, canonical, Open Graph, headings.
- `technical-signals.csv` — status, canonicals (+ `canonical_status`: self/points-elsewhere/none/n/a), robots, redirects, sitemap inclusion.
- `schema.json` — JSON-LD blocks grouped by URL, plus @types found.
- `internal-links.csv` — source URL, target URL, anchor text.
- `render-diff.csv` — raw-vs-rendered per-URL comparison (only pages crawled in rendered mode).
- `broken-internal-links.csv` — internal link targets that 4xx/5xx or redirect.
- `audit-summary.md` — this file.

_Read-only crawl. robots.txt respected. Google SERPs never scraped._
