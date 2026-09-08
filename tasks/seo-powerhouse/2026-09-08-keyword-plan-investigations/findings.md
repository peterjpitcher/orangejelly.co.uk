# Seven investigations, orangejelly.co.uk

Quick Checkup, read-only. 8 September 2026. Handed over from keyword-plan run
`2026-09-08-01-setup` (`tasks/keyword-plan/handoffs/2026-09-08-seo-powerhouse.md`).

No changes were made. **Six of the seven are answered.** One (tk_000010, cellar) still needs a
human to look at a Google results page, which cannot be automated.

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

## tk_000004, fix my pub: answered 8 September 2026, and I predicted it wrong

Peter searched `fix my pub` from TW19 6BB on desktop with personalised results on, and supplied
screenshots.

**There is no feature block.** No AI overview, no featured snippet, no People Also Ask. I had
predicted a feature block above the fold as the most likely explanation for a click-through gap at
position 7.6. That was wrong.

**The real cause is intent.** The query is substantially navigational for Punch Pubs. Ranking on
page one: Punch Pubs "Support", "A Guide To Your Punch Services" (PDF), Punch Taverns Buying Club,
Punch Taverns, and the Punch Pubs Publicans' Forum twice. The "People also search for" block is led
by **Punch Pubs, Punch pubs contact number, Punch pubs login**. A second intent is physical repair:
Vidette UK commercial refurbishment, and Masterfix "Pub Maintenance London".

Only a minority of that page is business turnaround, and there the one direct competitor is
`simonmckenzie.co.uk`, "Pub Turnaround Specialist UK", offering thirty five years of turning around
failing pubs and to "restore profitability within 90 days".

So 59 impressions at average position 4.95 earning zero clicks is not a snippet failure. Most of
the people searching that phrase want a repair portal or a landlord's helpdesk, and they are never
going to click a marketing guide. **No snippet work is warranted.** The honest read is that this
term is worth less than its impression count suggests.

Two further observations from the same SERP:

1. **Orange Jelly ranked with the wrong page.** In Peter's view the site appeared around position 3
   with "Pub VAT and Accounting: The Landlord's Plain-English Guide", not with the cluster's target
   page. Treat that position with care: results were personalised and searched from the owner's own
   postcode, so it is not a neutral read. Search Console's average of 4.95 is the reliable figure.
2. **The cluster is pointed at the wrong page anyway.** `cl_0012` targets `/why-revenue-is-falling`,
   which earns nothing directly in this window. The page actually carrying the cluster is
   `/guides/why-is-my-pub-empty` (144 impressions, position 7.95). `/pub-rescue` contributes 10
   impressions at 4.6 and correctly 308s into `/why-revenue-is-falling`. The mapping should move to
   `/guides/why-is-my-pub-empty` at the next review.

## tk_000010, cellar: still open

Needs the same treatment: search `cellar management` and `cask ale week 2026`, and note what sits
above the site, whether the first result answers on the page, and what kind of page ranks first.

Given what `fix my pub` turned out to be, the honest prior is now weaker than before: `cask ale week
2026` carries 641 of that cluster's impressions and is almost certainly people wanting a date, which
no rewrite converts.

## Limitations

- Read-only. No changes were made and none are proposed for implementation here.
- Inbound link counts come from the 5 September crawl of 145 sitemap URLs; links from outside the
  sitemap were not surveyed. The `/fractional-cmo` result was re-verified live today.
- Indexation was inferred from crawlability, canonicals and sitemap membership. Actual index status
  needs the Page Indexing report in Search Console, which was not exported.
- No Core Web Vitals, authority or UX assessment. Out of scope for this pass.
