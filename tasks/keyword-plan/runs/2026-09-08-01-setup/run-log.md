# Run log: 2026-09-08-01-setup

Mode: programme set-up. Phases 0 to 5. Stage at the end of this session: **awaiting the exports
named in `request.md`**. Nothing is measured yet, so this run has produced no plan and no numbers.

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
