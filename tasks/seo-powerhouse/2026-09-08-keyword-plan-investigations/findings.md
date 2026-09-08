# Seven investigations, orangejelly.co.uk

Quick Checkup, read-only. 8 September 2026. Handed over from keyword-plan run
`2026-09-08-01-setup` (`tasks/keyword-plan/handoffs/2026-09-08-seo-powerhouse.md`).

No changes were made. Five of the seven are answered. Two need a human to look at a Google
results page and cannot be automated.

## Diagnosis in three sentences

Nothing is broken. All five pages with "no visibility" return 200, are indexable, carry a correct
self-canonical and sit in the sitemap; two of them are three days old and the other two are
eleven, so most of the measurement window predates their existence. The one real problem is not
technical: the pages are written in Orange Jelly's vocabulary rather than the words people search
with, and one page spent its first eight days with no internal links pointing at it.

## Findings, most important first

### 1. The pages are too new to have a footprint. Confidence: high

| Page | First committed | Age at window end (6 Sep) |
|---|---|---|
| /solutions/booking-systems | 5 September 2026 | 1 day |
| /solutions/hospitality-websites | 5 September 2026 | 1 day |
| /solutions | 28 August 2026 | 9 days |
| /fractional-cmo | 28 August 2026 | 9 days |

The keyword-plan evidence reports 5 named-query impressions for booking systems and 2 for websites
and applications over three months. Those pages existed for one day of that window. The figures are
correct and mean nothing yet.

**Action: none.** Re-measure in the October review. Treat any conclusion about these pages drawn
from the current baseline as premature.

### 2. The pages do not use the words people search with. Confidence: high

This is the finding worth acting on. Counts are occurrences in the live rendered copy on
8 September 2026.

| Term (measured demand band) | /solutions | /solutions/booking-systems | /fractional-cmo |
|---|---|---|---|
| website development (1K to 10K) | 0 | 0 | 0 |
| web development | 0 | 0 | 0 |
| custom application | 0 | 0 | 0 |
| online booking (1K to 10K) | 0 | 0 | 0 |
| table booking (100 to 1K) | 0 | 0 | 0 |
| reservation | 0 | 0 | 0 |
| fractional marketing director (100 to 1K) | 0 | 0 | 0 |
| marketing director | 0 | 0 | 0 |

The booking systems page sells booking systems and never once says "online booking", "table
booking" or "reservation". The solutions page is headed "what we build" and never says "website
development". The fractional CMO page uses "fractional CMO" five times, which is right, but never
"marketing director", and `fractional marketing director` is a 100 to 1K term.

The copy is good. It reads as a person talking, which was the point of the 2 September rewrite.
The problem is narrower than that: a handful of high-demand phrases are absent entirely, and a page
cannot rank for words it does not contain.

One judgement call to make deliberately rather than by accident: `/fractional-cmo` argues that a
fractional CMO is "often the wrong kind of answer". That may well convert better. It also means the
page is not straightforwardly competing for the term. Worth deciding which job that page is for.

**Action:** a copy pass adding the missing vocabulary where it is honest to do so. Not a rewrite.
This is `editorial-team` work, and it is small.

### 3. /fractional-cmo was an orphan for its first eight days. Confidence: high, now resolved

The crawl of 5 September found **zero inbound internal links** to `/fractional-cmo`, alone with
`/tools/ai-readiness` at the bottom of all 145 sitemap pages. It was published 28 August. Commit
`2bb177b4` on 5 September added a link in `SiteChrome.tsx`.

Verified live today: `/fractional-cmo` now receives one link from every page checked (`/`,
`/solutions`, `/sectors/professional-services`, `/insights`). Position 26.8 in the keyword-plan
evidence is consistent with a page that had no internal links for most of the window.

**Action: none.** Already fixed. Re-measure in October.

### 4. tk_000009 rests on a mistake I made in the brief. Confidence: high

The brief asked seo-powerhouse to explain a collapse from 4,352 impressions to 11 on
`/guides/social-media-strategy-for-pubs`. There is no collapse. Those are two different measures:

- 4,352 was the **page's** impressions over twelve months to 9 August, from an unfiltered
  all-countries export.
- 11 was the **cl_0013 cluster's named-query** impressions over three months, UK only, from a
  country-filtered export whose named subset covers about 9% of clicks.

What the page actually did over the three months to 6 September, adding both URLs it is reported
under: **289 impressions**, 0 clicks, average position 25.6 on the old path and 34.8 on the new.
Over sixteen months, 1,338.

The page has 17 inbound internal links, returns 200, is indexable and self-canonical. There is no
technical problem here.

**Action: none, and the ticket should be closed as answered.** The real observation, worth carrying
forward, is that the page earns hundreds of impressions and no clicks at position 25 to 35, which
is a position problem, not a snippet problem.

### 5. Renamed guides appear twice in the page data. Confidence: high

`/licensees-guide/<slug>` and `/guides/<slug>` both appear in the same export and both resolve to
the same `page_id`, so `analysis/page-performance.csv` carries two rows per renamed page. Anything
that sums that file without grouping will read a page as smaller than it is, or double-count it.

This is a consequence of the 31 August rename and will persist until the old URLs age out of the
16-month window, so roughly December 2027.

**Action:** whoever reads `page-performance.csv` next must group by `page_id`, not by URL. Worth a
note in the keyword-plan measurement contract.

### 6. Not a finding: the homepage is in the sitemap

I flagged this as missing partway through and it was my error. The sitemap lists it as
`https://www.orangejelly.co.uk` with no trailing slash, which matches its canonical. Consistent and
correct. Recorded here so nobody re-investigates it.

## Technical state of all five pages, for the record

Checked live, 8 September 2026.

| Page | Status | Indexable | Canonical | In sitemap | Inbound links |
|---|---|---|---|---|---|
| / | 200 | yes | self | yes | 144 |
| /solutions | 200 | yes | self | yes | 144 |
| /solutions/booking-systems | 200 | yes | self | yes | 7 |
| /fractional-cmo | 200 | yes | self | yes | 0 at 5 Sep, now site-wide |
| /guides/social-media-strategy-for-pubs | 200 | yes | self | yes | 17 |

The rename redirect works: `/licensees-guide/social-media-strategy-for-pubs` returns a clean 308 to
`/guides/social-media-strategy-for-pubs`. Sitemap holds 145 URLs, all 200 at the last full crawl.

## tk_000003, brand: answered, no action

`/` returns 200, is indexable, self-canonical, in the sitemap, and carries "Orange Jelly" in its
title. One named-query impression over three months for `orange jelly` is almost certainly the
query being too rare to clear Google's naming threshold, not a visibility fault. Nothing to fix.
If brand search matters commercially, that is a demand problem, not an SEO one.

## The two SERP checks: not done, and not automatable

`tk_000004` (`/why-revenue-is-falling`, position 7.6, no clicks) and `tk_000010`
(`/guides/cellar-management-beer-quality-guide`, position 8.6, 3 clicks) both need someone to look
at a live Google results page. Automated scraping of Google Search is against its terms and the
method forbids it, so this is a two-minute human job, not a tooling gap.

**For tk_000004,** search `why is my pub revenue falling` and `fix my pub`. **For tk_000010,**
search `cellar management` and `cask ale week 2026`. For each, note:

1. What sits above the site: an AI overview, People Also Ask, videos, a featured snippet, ads.
2. Whether the first organic result answers the question on the results page itself.
3. What kind of page ranks first: a guide, a supplier, a forum, a brewery.
4. Date, device and location you searched from.

Tell me what you see and I will record it as a `check-done` event on the ticket in
`tasks/keyword-plan/changes.jsonl`, with source, locale, device, date and features. Until that
event exists, `diagnose.py` will not propose snippet work for those two clusters, by design.

My expectation, worth testing rather than trusting: at position 7.6 and 8.6 with almost no clicks,
a feature block above the fold is the most likely explanation, and `cask ale week 2026` in
particular looks like people wanting a date rather than a guide, which no rewrite will convert.

## Limitations

- Read-only. No changes were made and none are proposed for implementation here.
- Inbound link counts come from the 5 September crawl of 145 sitemap URLs; links from outside the
  sitemap were not surveyed. The `/fractional-cmo` result was re-verified live today.
- Indexation was inferred from crawlability, canonicals and sitemap membership. Actual index status
  needs the Page Indexing report in Search Console, which was not exported.
- No Core Web Vitals, authority or UX assessment. Out of scope for this pass.
