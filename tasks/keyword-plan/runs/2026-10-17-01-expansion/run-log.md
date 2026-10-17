# Run log: 2026-10-17-01-expansion

## Why this run

Trigger: a new season. Peter approved a Spring Pub Playbook hub (the fourth seasonal hub, after
summer, autumn and Christmas), five new spoke guides (Burns Night, Valentine's Day, Mother's Day,
St Patrick's Day, Easter) and a 2027 refresh of the Six Nations guide, on 17 October 2026, and
asked for the keyword plan to set their keywords.

## Mode

Expansion, phases 2 to 5. The last finalised baseline (2026-09-08-01-setup) is 39 days old, under
the 60-day threshold, so the Search Console baseline is reused and no Search Console pulls are
requested.

## Decisions

- `--refresh none`: no universe-wide demand refresh in this request. The new spring terms arrive
  with demand from the discovery exports themselves; a gap pull for spring terms that discovery
  does not return follows in phase 3 if needed. A universe-wide gap refresh is not what this run is
  for and would multiply the operator's work.
- Seeds lean towards licensee intent ("... pub ideas", "... promotion ideas", "... menu ideas"),
  with a few date terms ("mothers day 2027", "easter 2027 dates") kept so the consumer side of the
  demand is measured and can be classified, not chased. Precedent: the `national vodka day` avoid
  entry (consumer intent, clicks that do not convert).
- Two URL batches use the site's own spring-relevant guides (Six Nations, events calendar). No
  competitor URL: `config.competitors` is empty.

## Data quality

- `SCHEMA_UPGRADED` (limiting): `pages.csv` predates the `first_published` column; it reads as
  unknown. The new pages will carry it when they are added.
- `site-events.toml` does not exist yet, although the guide section was renamed from
  `/licensees-guide/` to `/guides/` before this run. That does not affect discovery for pages that
  do not exist yet. It does affect any page-level comparison, so writing the file is a separate
  task before the next review run.
