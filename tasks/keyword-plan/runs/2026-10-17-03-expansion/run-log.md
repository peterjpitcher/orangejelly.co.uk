# Run log: 2026-10-17-03-expansion

Supersedes `2026-10-17-02-expansion` (one combined batch), which supersedes
`2026-10-17-01-expansion`. Both earlier runs are marked abandoned and kept in the history.

## Why this run

Trigger: a new season. Peter approved a Spring Pub Playbook hub (the fourth seasonal hub, after
summer, autumn and Christmas), five new spoke guides (Burns Night, Valentine's Day, Mother's Day,
St Patrick's Day, Easter) and a 2027 refresh of the Six Nations guide, on 17 October 2026, and
asked for the keyword plan to set their keywords.

## How the request settled

Run 01 asked for eight themed discovery batches and two website batches; the eight themed exports
came back from Get search volume and forecasts and were set aside. Run 02 combined the themed
batches into one at Peter's request. Peter then ran the eight themed batches separately with
Discover new keywords, so this run returns to the run 01 layout with the same seeds, which lets
`sort-inbox.py` file each export by its seeds. The two website exports from run 01 are carried
over unchanged.

Filed on 17 October 2026: `gkp-discover-01` to `06` (spring hub, Burns Night, Valentine's Day,
Mother's Day, St Patrick's Day, Easter) and the two website pulls `gkp-discover-09` and `10`.
Outstanding: `gkp-discover-07` (Six Nations) and `gkp-discover-08` (Dry January and drinks days).

## Mode

Expansion, phases 2 to 5. The last finalised baseline (2026-09-08-01-setup) is 39 days old, under
the 60-day threshold, so the Search Console baseline is reused and no Search Console pulls are
requested.

## Decisions

- `--refresh none`: no universe-wide demand refresh. The spring terms arrive with demand from the
  discovery exports themselves.
- Seeds lean towards licensee intent. Date terms are measured so they can be classified, not
  chased. Precedent: the `national vodka day` avoid entry.

## Data quality

- `SCHEMA_UPGRADED` (limiting): `pages.csv` predates the `first_published` column.
- The spring-hub batch returned only its ten seeds, every one without data: Keyword Planner found
  no measurable demand for the season-level terms and offered no suggestions around them. It is a
  valid discovery export and a finding for the hub page.
- The two website exports returned only a handful of rows each, because the page URL filters the
  ideas to that page's content.
- `site-events.toml` does not exist yet, although the guide section was renamed from
  `/licensees-guide/` to `/guides/` before this run. Writing it is a separate task before the next
  review run.
