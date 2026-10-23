# Run log: 2026-10-17-02-expansion

Supersedes `2026-10-17-01-expansion`, which is marked abandoned. Both stay in the history.

## Why this run

Trigger: a new season. Peter approved a Spring Pub Playbook hub (the fourth seasonal hub, after
summer, autumn and Christmas), five new spoke guides (Burns Night, Valentine's Day, Mother's Day,
St Patrick's Day, Easter) and a 2027 refresh of the Six Nations guide, on 17 October 2026, and
asked for the keyword plan to set their keywords.

## Why run 01 was superseded

Run 01 asked for eight themed discovery batches of ten seeds and two website batches. The eight
themed exports came back from Get search volume and forecasts rather than Discover new keywords:
each held exactly its ten seeds, and each arrived with a Keyword Forecasts export.
`sort-inbox.py` quarantined the eight forecasts and left the eight volume exports unmatched; they
sit in run 01's `raw/ignored/` and are not used. The two website batches were valid discovery
exports.

Peter then asked for the themed batches to be combined into one (17 October 2026). Keyword Planner
takes at most ten seeds per discovery search, so the eighty seeds became one batch of ten, one per
spring moment plus a general events seed, chosen for licensee intent:
`pub event ideas`, `burns night menu ideas`, `valentines menu ideas`, `mothers day menu ideas`,
`st patricks day food ideas`, `easter pub events`, `six nations pub`, `dry january pub ideas`,
`national margarita day`, `international whisky day`. Keyword Planner returns ideas related to the
whole set, so each moment gets fewer suggestions than a batch of its own would have given. That
trade was Peter's to make.

The two website exports from run 01 are copied into this run unchanged and filed by
`sort-inbox.py` as `gkp-discover-02` and `gkp-discover-03`.

## Mode

Expansion, phases 2 to 5. The last finalised baseline (2026-09-08-01-setup) is 39 days old, under
the 60-day threshold, so the Search Console baseline is reused and no Search Console pulls are
requested.

## Decisions

- `--refresh none`: no universe-wide demand refresh. The spring terms arrive with demand from the
  discovery export itself; a gap pull for specific spring terms that discovery does not return can
  follow in phase 3.
- Seeds lean towards licensee intent. Date terms ("mothers day 2027" and similar) are expected
  among the returned ideas and are classified, not chased. Precedent: the `national vodka day`
  avoid entry (consumer intent, clicks that do not convert).

## Data quality

- `SCHEMA_UPGRADED` (limiting): `pages.csv` predates the `first_published` column; it reads as
  unknown. The new pages will carry it when they are added.
- The two website exports returned only a handful of rows each, because the page URL filters the
  ideas to that page's content. They are valid discovery exports and are kept.
- `site-events.toml` does not exist yet, although the guide section was renamed from
  `/licensees-guide/` to `/guides/` before this run. That does not affect discovery for pages that
  do not exist yet. It does affect any page-level comparison, so writing the file is a separate
  task before the next review run.
