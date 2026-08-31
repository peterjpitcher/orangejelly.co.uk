# SEO Evidence — Audit Summary

- Site crawled: https://www.orangejelly.co.uk/
- Collection date/time: 2026-06-16 06:56:25 UTC
- Collector: seo-powerhouse collect-site-evidence.py (read-only crawl)
- Pages collected: 50 (cap 50, max depth 4)
- robots.txt: 1 user-agent group(s), 8 Disallow rule(s), 1 Allow rule(s), 1 Sitemap line(s).
- Sitemap URLs discovered: 140

This file is a plain-English summary of repeatable evidence collected directly from the live site. All counts below come from the crawl; nothing is inferred or invented. Cite the companion CSV/JSON files for per-URL detail.

## Status-code distribution

| Status | Count |
|---|---|
| 200  | 49 |
| 410  | 1 |

## Templates found (URL-pattern heuristic)

| Template guess | URLs |
|---|---|
| section:licensees-guide | 39 |
| section:ways-to-work | 2 |
| contact/conversion | 1 |
| homepage | 1 |
| top-level:compete-with-pub-chains | 1 |
| top-level:empty-pub-solutions | 1 |
| top-level:licensees-guide | 1 |
| top-level:pub-marketing-agency | 1 |
| top-level:pub-marketing-kent | 1 |
| top-level:pub-marketing-oxfordshire | 1 |
| top-level:quiet-midweek-solutions | 1 |

## Top issues

| Issue | Count | Notes |
|---|---|---|
| Network/fetch errors | 0 | URLs that could not be retrieved (see `error` column). |
| Missing <title> | 0 | HTML pages with no title tag. |
| Missing meta description | 0 | HTML pages with no meta description. |
| Missing canonical | 0 | HTML pages with no rel=canonical. |
| No H1 | 0 | HTML pages with no H1 heading. |
| Multiple H1s | 29 | HTML pages with more than one H1. |
| Thin content (<300 words) | 1 | May need consolidation or expansion. |
| Noindex pages | 0 | Via robots meta or X-Robots-Tag header. |
| Pages behind redirects | 0 | Internal/sitemap URLs that redirect (see chain). |
| No structured data | 0 | HTML pages with no JSON-LD @type detected. |
| Images missing alt text | 0 | Total across all crawled pages. |
| Pages with oversized images | 3 | Image > 200 KB via HEAD. |
| HTML pages not in sitemap | 0 | Crawled but absent from XML sitemap. |

## Output files

- `url-inventory.csv` — one row per URL (status, final URL, template, counts).
- `page-metadata.csv` — title, meta description, canonical, Open Graph, headings.
- `technical-signals.csv` — status, canonicals, robots, redirects, sitemap inclusion.
- `schema.json` — JSON-LD blocks grouped by URL, plus @types found.
- `internal-links.csv` — source URL, target URL, anchor text.
- `audit-summary.md` — this file.

_Read-only crawl. robots.txt respected. Google SERPs never scraped._
