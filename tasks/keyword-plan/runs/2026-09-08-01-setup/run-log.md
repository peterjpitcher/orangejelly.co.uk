# Run log: 2026-09-08-01-setup

Mode: programme set-up. Phases 0 to 5. Stage at the end of this session: **plan written, awaiting the backlog decision**. Twenty five
exports arrived on 8 September 2026 and twenty four of the twenty six pulls are present.

## What was built

`config.toml`, `business-brief.md`, `clusters.csv` (17 clusters), `pages.csv` (30 pages),
`keywords.csv`, `aliases.csv`, `overlaps.csv`, `changes.jsonl`, and this run's `seeds.json` and
`request.md`. All 34 cluster regexes pass `check-regex.py`.

## The fact that shapes everything else

The site was rebuilt and repositioned on **31 August 2026**, and `/licensees-guide` became
`/guides` on the same day. That prefix carries roughly 900 of the site's 978 annual clicks. The
copy was rewritten again on 2 September and two service pages were added on 5 September.

So every window this run can pull describes the site **before** the rebuild. The rebuild itself is
not measurable yet. It becomes measurable in the review run of late October 2026, once a full
window sits behind it. Say so in the plan rather than letting a reader assume the numbers describe
the site they can see today.

## Decisions

**Profile: `established-nonlocal`.** Roughly a thousand ranked queries over twelve months, sold to
businesses across the United Kingdom rather than to a catchment. No Google Business Profile, no
local lens.

**Volume mode: `banded`, established from evidence rather than assumed.** Every individual keyword
in the nine exports of 9 August 2026 returned 50.0 or 500.0 and nothing else. That is the band
encoding. Consequence below.

**The 9 August exports were volumes pulls, not discovery pulls.** `validate-run.py` identified the
layout as `volumes`, and each export returns exactly the keywords submitted. The August document
describes using "Discover new keywords"; that is not what the files show. **No discovery pull has
ever been run against this site**, which is why the twelve discovery pulls in this request matter
more than they would on a site with a discovery history.

**Legacy migration.** The nine Keyword Planner exports are migrated into
`runs/2026-08-09-01-legacy/` with their original paths and sha256 checksums in `run.json`, and
their 67 keywords and demand observations promoted to the workspace root. The Search Console files
of the same date are **not** migrated: they are single-tab CSVs with no Chart or Filters tab, so
they carry no window, no country filter and no property totals, and cannot anchor a baseline. They
stay in `evidence/gsc-2026-08-09/` as context only, and were used in this session solely to choose
discovery seeds and to sanity-check cluster regexes, never as a metric.

**Three page pulls were hand-patched.** `gsc-3m-p-pg_0019`, `pg_0021` and `pg_0027` were generated
filtering on `/guides/<slug>` over 1 June to 31 August. Those URLs existed for one day of that
window. The filters now read `/(licensees-guide|guides)/<slug>` so they span the rename. Both
`request.json` and `request.md` were patched together and the new patterns pass `check-regex.py`.
This is the only hand edit to a generated file in this run.

## The correction this run makes to the August plan

The August report ordered the content plan on cluster totals: "quiz mechanics 1,750 monthly UK
searches, clear winner"; "pub bingo 500"; "staffing 200", and so on. Those figures are sums of
**band codes**, not searches, and the segmentation rows they came from are Keyword Planner's own
totals of the same codes. They cannot be read as search volumes and must not be repeated.

What the same exports actually support, of 67 keywords measured on 9 August 2026:

- **44 returned no data at all.**
- **19 sit in the band 10 to 100 searches a month.**
- **4 sit in the band 100 to 1,000 a month:** `picture round ideas`, `pub quiz answer sheet`,
  `pub quiz round ideas` and `pub bingo`.

The running order survives, because quiz holds three of the four top-band terms and bingo the
fourth. The magnitude does not. Nothing measured on this site so far exceeds a band of 100 to
1,000 searches a month.

## Decisions Peter made on 8 September 2026

1. **Property type: domain property.** Search Console lists it as `orangejelly.co.uk` with no
   scheme or host, which is how a domain property displays. `config.toml` is correct as written.
2. **The new positioning outranks the guide library.** `cl_0005` and `cl_0006` raised to business
   value 4, so every new-positioning service now sits above every content cluster.
3. **Keep committing raw exports** to the public repository.
4. **Narrow the growth-language guard** to published content. Handed to a separate session.

## Changes made to the request after Peter read it

**Preset date ranges instead of exact dates.** Every Search Console pull now names a preset
(Last 16 months, Last 3 months, Last 28 days) and its expected window is a container the preset
falls inside. `validate-run.py` records `WINDOW_SHORTER`, which is limiting and expected, not an
error. The cost is deferred, not avoided: preset windows drift with the export date, so
year-on-year comparison and the decay check both want calendar-aligned windows and will report
"not available" if the programme stays on presets. Neither is available on a first run anyway, so
nothing is lost today. Revisit at the second or third review.

**No renaming.** Every Search Console export records its own filters and dates in `Filters.csv`
and `Chart.csv`, and every Keyword Planner export carries its layout and keywords, so exports are
identified by content rather than filename. `sort-inbox.py` in the workspace root does the filing.
It was tested against three real exports (a 16-month zip, a 28-day folder and a Keyword Planner
volumes CSV) and placed all three correctly. Where the query filter text does not match, it scores
each candidate regex against the export's own `Queries.csv` and takes the best, refusing to guess
on a tie.

**39 pulls cut to 26.** Two reductions, both evidence-led rather than cosmetic:

- **Six cluster pulls dropped** because the clusters have no footprint to export. Against the
  twelve-month query file, `cl_0001` matched one query with one impression, and `cl_0002`,
  `cl_0003`, `cl_0005`, `cl_0006`, `cl_0011` and `cl_0017` matched almost nothing. That is a
  finding about the new positioning, not a reason to click through empty exports. The ten clusters
  that remain all have real footprint, from 221 to 4,197 impressions over twelve months.
- **All eleven page pulls dropped.** Every URL in the window is a pre-rebuild URL, and the
  property-scope Pages tab already gives complete page totals for all 148 pages. Cannibalisation
  and unattributed-traffic analysis wait for the October review, when a page filter will describe
  the site that is actually live.

**The page map was wrong about the biggest page in the site.** `cl_0010` targeted
`/guides/pub-event-ideas`, which earned 20 impressions over twelve months, while
`/licensees-guide/summer-pub-event-ideas` earned 9,704 and is the single largest page on the
site. Retargeted, and the eight highest-impression guides missing from `pages.csv` were added,
taking it from 30 pages to 38.

## Data quality carried into the plan

- Every window available to this run predates the rebuild. Page-level comparison across
  31 August 2026 compares different URLs.
- Two Search Console reporting incidents in `references/gsc-incidents.toml` overlap the sixteen
  month window: the num=100 removal of September 2025 and the impressions logging error running to
  27 April 2026. Impressions, position and click-through are not comparable across either
  boundary; clicks are. `delta.py` flags this per metric once snapshots exist.
- `keywords.csv` holds 67 keywords, of which 44 have an `absent` observation. Those stay eligible
  and are re-asked as `gkp-volumes-01` in this request.
- No conversion evidence exists for any cluster. GA4 enquiry events were only connected on
  5 September 2026.


## What happened when the exports arrived, 8 September 2026

Twenty five files, dropped in unrenamed. `sort-inbox.py` placed twenty two of them by reading each
export's own filters and dates. The three it would not guess at were handled by hand:

- The Keyword Planner **forecast** export was correctly refused and moved to `raw/ignored/`. The
  method ignores the forecast tab entirely, so it contributed nothing.
- Two URL-seeded discovery exports could not be matched on seed overlap, because a URL batch
  submits a page rather than keywords. They were placed as `gkp-discover-09` (the site URL) and
  `gkp-discover-10` (`/solutions`) on the sequential fit of their export timestamps and their
  content, and the reason is recorded here rather than in the file names.
- `gkp-discover-11` and `gkp-discover-12` were not taken. Marked `required: false` with the reason
  in `request.json`; both themes are covered elsewhere, so the run was not held up for them.

The regex filters worked. Every query-filtered export carries its pattern in `Filters.csv` prefixed
with `+`, and the sorter's fallback confirmed the match behaviourally: in all ten, **100 percent of
the returned queries match the intended cluster regex**. `FILTER_TEXT_UNCONFIRMED` is raised only
because of that `+` prefix, which now stands confirmed as Google's own notation.

## The defect this run found in the skill itself

`pages_index` in `import-gsc.py` indexed only `url` and `canonical_url`. It never read
`redirect_from`, although the schema documents that column as being "for a moved URL". The
consequence on this site was severe and silent: every export covering a window before 31 August
carries `/licensees-guide/...` paths, none of them matched, and the entire page analysis came back
as zeros with identical figures repeated across all three windows. It looked like data.

Fixed by indexing `redirect_from` in a second pass, so a live URL always wins a collision with
another page's old path. Two regression tests added to `scripts/tests/test_import_gsc.py`, and both
were confirmed to fail with the fix removed (`'' != 'pg_0009'`) and pass with it in place. The
full import was then re-run.

## The country filter cost the complete page census

Asking for a Country filter on every export was my call, and it had a cost I did not anticipate.
With the filter applied, Search Console restricts the Pages table to the same non-anonymised subset
as the Queries table. Proved against a clean control: the unfiltered 16-month export of 31 August
has a Pages tab covering 100.9 percent of its chart total, while today's country-filtered 16-month
export covers 7.7 percent.

The correction for the next run is one extra export, not a change of approach: take one unfiltered
property export for the page census, and keep the country filter on everything else, because the
United Kingdom is only 69 percent of this site's impressions.

## Numbers this run established

Property totals, United Kingdom, Web, from `Chart.csv`:

- 16 months to 6 September 2026: 904 clicks, 56,750 impressions.
- 3 months to 6 September 2026: 515 clicks, 32,439 impressions.
- 28 days to 6 September 2026: 213 clicks, 15,532 impressions.

Named-query coverage: 7.7, 9.1 and 9.9 percent of clicks respectively. Universe: 4,454 keywords,
1,792 assigned to a cluster, 44 open overlaps. Diagnostics: 15 clusters at Tier B, 2 at Tier D,
none at Tier A, 11 tickets proposed.
