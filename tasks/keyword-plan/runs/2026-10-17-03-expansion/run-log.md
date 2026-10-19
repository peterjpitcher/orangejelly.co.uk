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

## Cluster set-up (Peter, 17 October 2026)

Peter approved, in one message, seven new groups (cl_0018 Spring pub playbook, cl_0019 Burns
Night, cl_0020 Valentine's Day, cl_0021 Mother's Day, cl_0022 St Patrick's Day, cl_0023 Easter,
cl_0024 Six Nations in the pub), two clean-ups and four rule-outs:

- Every pattern passed `check-regex.py`; the playbook pattern was shortened to fit the
  200-character limit.
- New pages pg_0039 to pg_0044 (planned) and the live Six Nations guide pg_0045 were added to a
  staged `pages.csv`, which also gains the `first_published` column.
- The occasion menu terms the pub food group (cl_0009) had caught were resolved to their occasion
  groups as operator overlap resolutions, 162 in all; no term had two spring candidates. The 44
  older overlaps outside the spring groups are untouched.
- cl_0009's head keyword was cleared to be re-picked from its own terms. The automatic rule chose
  "candle light dinner menu ideas" on a tie, a home-dining term, so it was set by hand to "pub
  christmas menu ideas", the pub-specific term in the same band.
- cl_0015's head keyword was set to "international whisky day" once "margarita" was ruled out for
  that group.
- The rule-outs are in `config.toml` under the spring 2027 heading.

Phase 3 was skipped (`--refresh none`). Phase 4 ran with no Search Console exports, so every
spring group is tier C and the playbook tier D, as expected for new pages. The plan proposes five
collect-evidence tickets for approval and defers the rest.

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
