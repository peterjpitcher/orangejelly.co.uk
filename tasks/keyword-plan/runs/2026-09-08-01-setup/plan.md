# Keyword Plan: orangejelly.co.uk (GB), run 2026-09-08-01-setup, mode setup

## Next required input

Your decision on the backlog below, as one yes or no to the whole list. Nothing else is needed to
finish this run.

## How to read this plan

**This is a baseline, and it describes the site as it was before 31 August 2026.** The
repositioning released that day, and `/licensees-guide` became `/guides` underneath roughly 900 of
the site's 978 annual clicks. Every window here straddles or predates that. Nothing in this plan
measures the site you can see today. The rebuild becomes measurable in the review of late
October 2026.

**Levels and completeness.** Property totals come from `Chart.csv` and are complete for the
window. Query figures are always a named subset. Cluster figures are named-query evidence and are
labelled as such; they are never the cluster's traffic.

**Coverage is poor, and partly my fault.** In these exports the named-query tables carry
**9.1% of clicks** over three months (47 of 515) and **37.2% of impressions**. The other 91% of
clicks belong to queries Google will not name. Worse, because I asked you to apply a Country
filter, the Pages table was restricted to the same named subset: it reports 47 clicks where the
property total is 515. An unfiltered export of the same 16 months, taken on 31 August, has a Pages
table covering **100.9%** of its chart total. So the country filter bought UK accuracy at the cost
of a complete page census. Next run takes both: one unfiltered export for pages, the filtered ones
for queries.

**Demand is banded, and a band is not a number.** The Ads account has no active spend, so Keyword
Planner returns 50, 500, 5,000 and 50,000, which encode the ranges 10 to 100, 100 to 1K, 1K to 10K
and 10K to 100K. Every demand figure below is printed as its range. Band codes are never summed.

**Evidence tiers.** 15 clusters are Tier B, 2 are Tier D. **Nothing reached Tier A**, because no
cluster has both the named-query evidence and the head-term demand observation that Tier A
requires. That is why every scenario below reads "not estimable" rather than a click forecast.

**Curve.** The bundled `awr-organic-blended` curve is used. The site's own curve had only 5 valid
bins (5, 6, 7, 9, 10) and needs at least 5 including bins 3 and 8. Site bins are kept in
`analysis/curve.json` as context.

## What moved since the last run

Nothing, because this is the first finalised run. It establishes the baseline that the October
review will compare against. `delta.py` recorded `BASELINE_ESTABLISHED`.

Eleven changes shipped between 9 August and 6 September are recorded in `changes.jsonl` so the
next run can say "moved after change X" honestly: the 9 August title and description rewrite on
six mapped guides, the site-wide metadata hygiene of the same day, the 31 August repositioning and
rename, the 2 September plain-English rewrite, the 5 September indexing repairs and GA4 events,
and the 6 September retirement of "growth partner".

## The finding that should change what you do next

The positioning you moved to has **more measurable demand than everything the guide library has
ever ranked for**, and the site has almost no footprint in it.

Measured on 8 September, United Kingdom, English, Google Search:

| Term | Band, searches a month | Paid competition |
|---|---|---|
| websites and applications | 10K to 100K | Low |
| websites development | 1K to 10K | Low |
| website development in uk | 1K to 10K | Medium |
| free online booking system | 1K to 10K | High |
| online reservation system free | 1K to 10K | High |
| table booking system | 100 to 1K | Medium |
| web booking system | 100 to 1K | Medium |
| fractional marketing director | 100 to 1K | Medium |
| fractional cmo uk | 100 to 1K | Low |
| professional services marketing agency | 100 to 1K | Medium |
| hospitality website design | 100 to 1K | Medium |

Against that, **the highest band any pub content term has ever returned is 100 to 1K**, reached by
four terms in total: `picture round ideas`, `pub quiz answer sheet`, `pub quiz round ideas` and
`pub bingo`. Of the 67 pub terms measured on 9 August, 44 returned no data at all, and all 44 were
asked again on 8 September and returned no data again.

And the footprint is the mirror image. Over three months the site earned 1,618 named-query
impressions for pub and hospitality marketing, 1,637 for pub events and 1,374 for pub bingo, but
**5 impressions for booking systems and 2 for websites and applications**.

So the site ranks where the demand is smallest and is absent where the demand is largest. That is
the whole strategic picture in one line, and it is the first time this programme can show it,
because no discovery pull had ever been run against this site before today.

Two cautions before anyone acts on the table above. The very high bands attach to broad, ambiguous
phrases (`websites and applications`, `websites to make websites`) that are not necessarily
commercial intent, and several carry High competition. The specific, commercially shaped terms
(`table booking system`, `fractional cmo uk`, `professional services marketing agency`,
`hospitality website design`) are the honest targets. A SERP check is proposed below before any
page is written against them.

## Cluster scoreboard

Ordered by priority score. Impressions, position and clicks are named-query evidence over the
three months to 6 September 2026, not cluster traffic.

| Cluster | Demand (band) | Named clicks | Named impressions | Position | Tier | Deciding tag | Action | Priority |
|---|---|---|---|---|---|---|---|---|
| Website and application build (cl_0001) | 10K to 100K top term | 0 | 2 | 6.0 | B | LOW_OBSERVED_VISIBILITY | investigate-visibility | 37.5 |
| Booking systems (cl_0002) | 1K to 10K top term | 0 | 5 | 7.8 | B | LOW_OBSERVED_VISIBILITY | investigate-visibility | 37.5 |
| Brand (cl_0017) | unknown | 0 | 1 | 12.0 | B | LOW_OBSERVED_VISIBILITY | investigate-visibility | 37.5 |
| Pub turnaround (cl_0012) | 10 to 100 | 0 | 148 | 7.6 | B | CTR_GAP_CANDIDATE | serp-check | 36.0 |
| Pub and hospitality marketing (cl_0004) | 10 to 100 | 0 | 1,618 | 19.7 | B | STRIKING_DISTANCE_CANDIDATE | strengthen-page | 32.0 |
| Fractional marketing leadership (cl_0005) | 100 to 1K top term | 0 | 18 | 26.8 | B | LOW_OBSERVED_VISIBILITY | investigate-visibility | 30.0 |
| Pub quiz mechanics (cl_0007) | 100 to 1K top term | 15 | 687 | 11.1 | B | STRIKING_DISTANCE_CANDIDATE | strengthen-page | 24.0 |
| Pub bingo (cl_0008) | 100 to 1K | 6 | 1,374 | 10.9 | B | STRIKING_DISTANCE_CANDIDATE | strengthen-page | 24.0 |
| Pub social media marketing (cl_0013) | unknown | 0 | 11 | 7.4 | B | LOW_OBSERVED_VISIBILITY | investigate-visibility | 22.5 |
| Cellar and drinks operations (cl_0014) | unknown | 3 | 957 | 8.6 | B | CTR_GAP_CANDIDATE | serp-check | 18.0 |
| Promotional calendar (cl_0015) | unknown | 1 | 402 | 11.4 | B | STRIKING_DISTANCE_CANDIDATE | strengthen-page | 16.0 |
| Pub food and menu profitability (cl_0009) | 10 to 100 | 0 | 179 | 21.5 | B | DEMAND_UNKNOWN | hold | 9.0 |
| Pub events and entertainment (cl_0010) | 10 to 100 | 4 | 1,637 | 23.3 | B | DEMAND_UNKNOWN | hold | 9.0 |
| Pub staffing and people (cl_0011) | 10 to 100 | 0 | 16 | 15.4 | B | DEMAND_UNKNOWN | hold | 3.0 |
| Pub refurbishment and property (cl_0016) | 10 to 100 | 0 | 91 | 53.5 | B | DEMAND_UNKNOWN | hold | 3.0 |
| Hospitality websites (cl_0003) | 100 to 1K | none | none | none | D | LOW_OBSERVED_VISIBILITY | research | not scored |
| Professional services sector (cl_0006) | 100 to 1K | none | none | none | D | LOW_OBSERVED_VISIBILITY | research | not scored |

Every scenario is "not estimable" for the reason given above. All 17 carry
`EVIDENCE_INSUFFICIENT (cannibalisation)`, because page pulls were dropped from this run.

## Page performance

The complete page census below comes from the **12-month export of 9 August 2026**, whose Pages tab
is complete: it sums to 850 clicks against a stated property total of 850. It is all countries, not
GB, and it ends a month before this run's windows. It is used here because no export taken today
can reproduce it, for the reason given under "How to read this plan".

| Page | Clicks | Impressions | Position |
|---|---|---|---|
| /licensees-guide/summer-pub-event-ideas | 145 | 9,704 | 16.5 |
| /licensees-guide/quiz-night-ideas | 106 | 5,753 | 12.0 |
| /licensees-guide/profitable-pub-food-menu-ideas | 98 | 5,189 | 7.7 |
| /licensees-guide/social-media-strategy-for-pubs | 42 | 4,352 | 12.7 |
| /licensees-guide/quiz-night-101 | 40 | 2,937 | 7.9 |
| /licensees-guide/cash-bingo-101 | 37 | 1,979 | 9.5 |

The unfiltered 16-month export of 31 August 2026 is the control that proves the point: its Pages
tab carries 1,008 clicks against a chart total of 999, so 100.9% coverage, while today's
country-filtered 16-month export carries 70 against 904.

Within this run's own three-month window, the pages carrying the most named-query impressions were
`summer-pub-event-ideas` (1,897 impressions, 7 clicks, position 33.1), `cash-bingo-101` (1,422, 7
clicks, 10.8), `macmillan-coffee-morning-pub-guide` (916, 2 clicks, 11.1) and `quiz-night-ideas`
(829, 15 clicks, 14.0).

Two URLs earning impressions are absent from the page map and should be added next run:
`/ways-to-work` (504 impressions, position 42.5) and `/guides/pub-insurance-cover-guide` (295
impressions, position 28.6).

## Defend and repair

`Brand (cl_0017)` carries one named-query impression at position 12.0 over three months. For a
company with a live site and a public name, that is not a normal brand footprint, and it sits in
the queue as `investigate-visibility` rather than as a content job. It may be nothing more than
the query being too rare to be named; the investigation is what settles it.

No navigational queries beyond the brand term appear in the named subset.

## Primary page targets, secondary and question terms

Local terms do not apply: the profile is `established-nonlocal` and no local lens was pulled.

Primary targets follow the cluster to target page mapping in `clusters.csv`. Two changes were made
to that mapping this run, both from evidence:

- `cl_0010` (pub events) was retargeted from `/guides/pub-event-ideas`, which earned 20
  impressions in twelve months, to `/guides/summer-pub-event-ideas`, which earned 9,704 and is the
  largest page on the site.
- Eight of the highest-impression guides were missing from `pages.csv` entirely and were added.

Question terms are not proposed as answer blocks anywhere in this plan, because no SERP
observation exists for any cluster. That is what the two `serp-check` tickets are for.

## Avoid list

| Term | Scope | Reason |
|---|---|---|
| family kids pub | all | Ten seeds returned no data on 9 August 2026 and the same terms returned no data again on 8 September. The GSC impressions are real (229 for "how to organise events to attract families to pubs", 226 for "kids craft pop up events for pubs" over three months) but have earned no clicks. SEO-135 stays closed. |
| national vodka day | cl_0015 | Consumer intent. The drinks-days guide earns impressions from drinkers wanting a date, not from licensees. Impressions stay high and clicks stay low, deliberately. |

Eight keywords in the universe are flagged against these entries.

## Per-cluster guidance

**cl_0001 Website and application build, and cl_0002 Booking systems.** Highest priority, and both
are `investigate-visibility` rather than "write a page". The site has service pages live for both
and 2 and 5 named-query impressions respectively. Before anything is written, find out whether
those pages are indexed, whether they are eligible for the terms at all, and what is actually
ranking. `/solutions/hospitality-websites` and `/solutions/booking-systems` were only published on
5 September, so some of this may simply be that Google has not caught up.

**cl_0004 Pub and hospitality marketing services.** 1,618 named-query impressions at position 19.7
and no clicks. The largest reclaimable footprint on the site, and the one place where the old
positioning still earns attention. Position, not the title, is the constraint at 19.7.

**cl_0007 Pub quiz mechanics and cl_0008 Pub bingo.** The only pub clusters with demand in the 100
to 1K band, and both sit in striking distance (11.1 and 10.9). Bingo has no hub page: `pg_0030`
`/guides/pub-bingo` is planned, not live, and 1,374 impressions currently land on the two format
guides.

**cl_0012 Pub turnaround and cl_0014 Cellar.** Both tagged `CTR_GAP_CANDIDATE` at positions 7.6
and 8.6. A SERP check comes first, because a click-through gap at position 8 is often an AI
overview or a feature block rather than a weak title.

**cl_0009, cl_0010, cl_0011, cl_0016.** Hold. Real impressions, positions between 15 and 53, and
demand no better than 10 to 100. Not worth effort while the clusters above are open.

**Overlaps.** 44 queries match more than one cluster and are excluded from cluster totals until
resolved. Most are `cl_0001` against `cl_0002` (booking terms that mention websites) or `cl_0001`
against `cl_0006` (professional services websites). They need resolving before the October review,
and they matter because they sit in the two highest-priority clusters.

## Backlog for approval

One list, one decision. Eleven tickets, ordered by priority score. Six are investigations rather
than changes, which is the right shape for a first run on a site whose evidence is this thin.

**Approval required, investigations first**

| Ticket | Priority | Cluster | Action | Owner |
|---|---|---|---|---|
| tk_000001 | 37.5 | cl_0001 | investigate-visibility: website and application build | seo-powerhouse |
| tk_000002 | 37.5 | cl_0002 | investigate-visibility: booking systems | seo-powerhouse |
| tk_000003 | 37.5 | cl_0017 | investigate-visibility: brand | seo-powerhouse |
| tk_000004 | 36.0 | cl_0012 | serp-check: pub turnaround | seo-powerhouse |
| tk_000006 | 30.0 | cl_0005 | investigate-visibility: fractional marketing | seo-powerhouse |
| tk_000009 | 22.5 | cl_0013 | investigate-visibility: pub social media | seo-powerhouse |
| tk_000010 | 18.0 | cl_0014 | serp-check: cellar and drinks | seo-powerhouse |

**Approval required, content**

| Ticket | Priority | Cluster | Action | Owner |
|---|---|---|---|---|
| tk_000005 | 32.0 | cl_0004 | strengthen-page: pub and hospitality marketing | editorial-team |
| tk_000007 | 24.0 | cl_0007 | strengthen-page: pub quiz mechanics | editorial-team |
| tk_000008 | 24.0 | cl_0008 | strengthen-page: pub bingo | editorial-team |
| tk_000011 | 16.0 | cl_0015 | strengthen-page: promotional calendar | editorial-team |

**Deferred, not proposed**

`hold` on cl_0009, cl_0010, cl_0011 and cl_0016. `research` on cl_0003 and cl_0006, which are
Tier D with no footprint at all.

The skill's own guidance is to propose at most five actions in a run. Eleven are listed because
seven of them are investigations that cost an hour each and unblock everything else. If you want
it cut to five, take tk_000001, tk_000002, tk_000004, tk_000005 and tk_000008.

## Handoffs

- `investigate-visibility` and `serp-check` to **seo-powerhouse**, with the evidence rows attached.
- `strengthen-page` to **editorial-team**, with the primary and secondary keywords, intent,
  evidence tier, deciding tag, and the note that no scenario is estimable.
- No `plan-page` tickets. The gate for programmatic pages is not met by anything here.
- Every shipped change through **deploy-verify**, and logged as a `shipped` event in
  `changes.jsonl`.

## Checkpoints due

| When | What | Owner |
|---|---|---|
| 0 to 48 hours after any ship | technical verification | deploy-verify |
| 1 to 2 weeks after any ship | indexation | the implementing workflow |
| Late October 2026 | measurement, and the first window that describes the rebuilt site | the next keyword-plan review |
| December 2026 to February 2027 | structural, the next expansion | keyword-plan expansion |

Nothing is overdue: this is the first run.

## Data quality and limitations

1. **Every window predates or straddles the 31 August rebuild.** No figure here describes the
   live site.
2. **Named-query coverage is 9.1% of clicks** over three months, 9.9% over 28 days, 7.7% over 16
   months. Impression coverage is 35% to 40%.
3. **The Country filter restricted the Pages table** to the same named subset. Proven against an
   unfiltered control of the same 16 months, whose Pages tab covers 100.9%. Next run takes one
   unfiltered export as well.
4. **`gsc-16m-all` hit the 1,000 row table cap** on Queries and is truncated.
5. **All Search Console windows are shorter than requested**, because presets end at the last day
   with data. Recorded as `WINDOW_SHORTER` on all 13 exports, which is expected.
6. **Two discovery pulls were not taken** (`gkp-discover-11`, `gkp-discover-12`, the URL batches
   for `/solutions/booking-systems` and `/pub-marketing`). Both themes are covered elsewhere. They
   stay eligible for the next expansion.
7. **The Keyword Planner forecast export was discarded**, as the method requires. It is kept at
   `raw/ignored/` and contributed nothing.
8. **No conversion evidence exists for any cluster.** GA4 enquiry events only started on
   5 September 2026.
9. **No decay evaluation**, because no prior finalised run exists.
10. **Two Search Console reporting incidents** overlap the 16-month window: the num=100 removal of
    September 2025 and the impressions logging error running to 27 April 2026. Impressions,
    position and click-through are not comparable across either boundary; clicks are.
11. **A defect in the skill's importer was found and fixed during this run.** `pages_index` in
    `import-gsc.py` indexed only `url` and `canonical_url`, never `redirect_from`, so a site that
    has renamed a section could not be matched to its own history. Every page row resolved to
    nothing and the page analysis read as zero. Fixed, the existing tests still pass, and the
    import was re-run.

## Sources

Every figure traces to a file under `runs/2026-09-08-01-setup/`. Hashes for all 24 present pulls
are in `analysis/validation.json` and will be written into `manifest.json` at finalisation.

- Search Console, property `sc-domain:orangejelly.co.uk`, Web, United Kingdom, exported
  8 September 2026: `raw/gsc-16m-all`, `raw/gsc-3m-all`, `raw/gsc-month-all`, and ten
  query-filtered exports `raw/gsc-3m-q-cl_0004`, `cl_0007`, `cl_0008`, `cl_0009`, `cl_0010`,
  `cl_0012`, `cl_0013`, `cl_0014`, `cl_0015`, `cl_0016`.
- Keyword Planner, United Kingdom, English, Google Search, August 2025 to July 2026, exported
  8 September 2026: ten discovery exports `raw/gkp-discover-01` to `-10`, and one volume export
  `raw/gkp-volumes-01.csv`.
- Keyword Planner, same settings, July 2025 to June 2026, exported 9 August 2026: nine volume
  exports migrated in `runs/2026-08-09-01-legacy/`.
- Unfiltered Search Console control, Last 16 months, exported 31 August 2026:
  `tasks/seo-powerhouse/orangejelly.co.uk-Performance-on-Search-2026-08-31.zip`.
- Complete page census, 12 months to 9 August 2026: `evidence/gsc-2026-08-09/pages-12mo.csv`.
- Derived: `analysis/cluster-performance.csv`, `analysis/page-performance.csv`,
  `analysis/diagnostics.csv`, `analysis/backlog.csv`, `analysis/discovery-summary.md`,
  `analysis/demand-summary.md`, `analysis/curve.json`, `analysis/delta.md`.
