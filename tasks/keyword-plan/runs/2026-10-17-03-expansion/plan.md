# Keyword Plan: orangejelly.co.uk (GB)   run 2026-10-17-03-expansion, mode expansion

## Next required input

One approval from Peter of the backlog list at the end of this plan. No further exports are needed for this run.

## How to read this plan

- **Scope.** An expansion for the spring 2027 season: a Spring Pub Playbook hub, five new occasion guides (Burns Night, Valentine's Day, Mother's Day, St Patrick's Day, Easter) and a 2027 refresh of the Six Nations guide. Peter approved the build on 17 October 2026 and the keyword groups, clean-ups and rule-outs on the same day.
- **Demand.** Keyword Planner "Discover new keywords" exports, United Kingdom, English, Google Search, window 1 October 2025 to 30 September 2026. Peter attested on 17 October 2026 that the volumes showed ranges, so every figure is a band (`encoded_band`), printed as a range and never summed. Location, language and network were requested as printed and not separately confirmed.
- **Completeness.** No Search Console pulls in this run: the 8 September 2026 baseline is reused because it is under 60 days old. There are therefore no clicks, impressions or positions here, every spring group is evidence tier C (demand only) and the playbook is tier D (no measurable demand). No scenario is estimable.
- **Curve.** The bundled `awr-organic-blended` fallback; no property-scope 3m export in this run.
- **Incidents and site events.** No window overlaps an incident. `site-events.toml` does not exist yet, although the guide section was renamed from `/licensees-guide/` to `/guides/` before this run; nothing in this plan compares pages across that rename.
- **Phases.** Phase 1 skipped (baseline reused). Phase 3 skipped (`--refresh none`): the discovery exports carried demand for the terms that matter; seeds with no data stay eligible for the next expansion.
- **Runs.** This run supersedes `2026-10-17-02-expansion`, which superseded `2026-10-17-01-expansion`; both are abandoned and kept for the history.

## What moved since the last run

- Not available: this run has no month or 3m window to compare with run `2026-09-08-01-setup` (see `analysis/delta.md`).

## Cluster scoreboard

From `analysis/plan-skeleton.md`, spring groups first, ordered by priority score; tier C for every spring group means demand is known and performance is not yet measured.

| Cluster | Head term | Demand (band, mode, date) | Target page | Tier | Action | Priority |
|---|---|---|---|---|---|---|
| Burns Night (cl_0019) | burns night menu ideas | 100 to 1,000 (encoded_band, 2026-10-17) | pg_0040 | C | collect-evidence | 8.0 |
| Valentine's Day (cl_0020) | valentine's day menu ideas for restaurants | 100 to 1,000 (encoded_band, 2026-10-17) | pg_0041 | C | collect-evidence | 8.0 |
| Mother's Day (cl_0021) | mothers day menu ideas | 100 to 1,000 (encoded_band, 2026-10-17) | pg_0042 | C | collect-evidence | 8.0 |
| St Patrick's Day (cl_0022) | st patricks day pub ideas | 10 to 100 (encoded_band, 2026-10-17) | pg_0043 | C | collect-evidence | 4.0 |
| Easter (cl_0023) | easter pub ideas | 10 to 100 (encoded_band, 2026-10-17) | pg_0044 | C | collect-evidence | 4.0 |
| Six Nations in the pub (cl_0024) | six nations pub | 10 to 100 (encoded_band, 2026-10-17) | pg_0045 | C | collect-evidence | 4.0 |
| Spring pub playbook (cl_0018) | spring pub event ideas | unknown | pg_0039 | D | research | |

The other seventeen groups appear in `analysis/plan-skeleton.md` unchanged in substance; this run gathered no new evidence for them, so their tickets are deferred to the next review run.

## Page performance

- None in this run: no Search Console exports.

## Defend and repair

- None: no group has a brand-flagged head keyword.

## Primary page targets, secondary and question terms

Bands from `staged/demand-observations.csv`, observed 2026-10-17. Primary and secondary terms are licensee intent. Date and consumer terms are answered in passing on the page, never targeted.

| Page | Primary | Secondary | Answer in passing, not targeted |
|---|---|---|---|
| pg_0039 Spring Pub Playbook | none measurable: every season-level term returned no data | none | none |
| pg_0040 Burns Night | burns night menu ideas (100 to 1,000) | burns night menu (1,000 to 10,000); burns supper menu (1,000 to 10,000); burns night running order (10 to 100); how to host a burns night (10 to 100); burns night pub ideas (10 to 100) | burns night 2027 (1,000 to 10,000) |
| pg_0041 Valentine's Day | valentine's day menu ideas for restaurants (100 to 1,000) | valentines day set menu (100 to 1,000); valentines menu ideas (100 to 1,000); bar ideas for valentine's day (10 to 100); anti valentine's day bar ideas (10 to 100); business marketing ideas for valentines day (10 to 100) | none |
| pg_0042 Mother's Day | mothers day menu ideas (100 to 1,000) | mothers day set menu (100 to 1,000); mother's day afternoon tea menu ideas (10 to 100); mother's day buffet menu ideas (10 to 100); mother's day marketing campaign ideas (10 to 100) | mothers day 2027 (10,000 to 100,000); when is mothers day 2027 (1,000 to 10,000) |
| pg_0043 St Patrick's Day | st patricks day pub ideas (10 to 100) | ideas for st patricks day food (100 to 1,000); bar ideas for st patrick's day (10 to 100); marketing ideas for st patrick's day (10 to 100); menu ideas for st patrick's day (10 to 100); hosting a st patrick's day party (10 to 100) | st patricks day 2027 (1,000 to 10,000) |
| pg_0044 Easter | easter pub ideas (10 to 100) | easter menu ideas (100 to 1,000); easter sunday menu ideas (100 to 1,000); easter weekend events (100 to 1,000); community easter event ideas (10 to 100); easter bank holiday events (10 to 100); best easter marketing campaigns (10 to 100) | easter 2027 dates (10,000 to 100,000); easter bank holiday 2027 (1,000 to 10,000) |
| pg_0045 Six Nations | six nations pub (10 to 100) | six nations screening (10 to 100); watch six nations pub (10 to 100) | six nations 2027 fixtures (1,000 to 10,000); six nations 2027 (1,000 to 10,000) |

Question terms: "how to host a burns night" and "when is mothers day 2027" are the only question-form terms with demand in these groups. Neither has a dated result-page observation, so neither is mapped to an answer block; the guides may answer them in their own words.

## Avoid list

All in `config.toml`, approved by Peter on 17 October 2026, on top of the two earlier entries ("family kids pub", "national vodka day"):

- "near me", scoped to each of the seven spring groups (cl_0018 to cl_0024): people looking for a pub to visit, not licensees running one.
- "2020", "2021", "2022", "2023", scope all: searches naming a past year are out of date.
- "recipe", "at home", "craft", scoped to the five occasion groups (cl_0019 to cl_0023): home cooking and crafts. Scoped so that "craft beer" and recipe costing elsewhere stay eligible.
- "bonnet", "breakfast in bed", "preschool", "eyfs", "classroom", scope all: home, children's and school terms.
- "margarita", scope cl_0015: mostly drinkers, many American, hunting chain-restaurant deals; the same call as "national vodka day".

## Per-cluster guidance

Every page follows `CLAUDE.md`: British English, no retired self-description, only the five approved claims, no invented facts, and dates checked against an official source. Pages are written in the Orange Jelly company voice, with The Anchor as "our own venue".

### pg_0039 Spring Pub Playbook (cl_0018), new, /guides/spring-pub-event-ideas

- **Title:** Spring Pub Playbook 2027: Every Date from Dry January to Easter
- **H1:** the spring pub playbook (the hub design lowercases display headings)
- **Intent:** the seasonal hub and the Greene King spring toolkit's landing page. It earns search through the guides it links to, not through its own terms.
- **Sections:** the 2027 calendar (every date, linking to its guide); lead times; plan it all in an afternoon (the AI planning guide as the lead card); the occasion guides; the existing guides that also fit (Six Nations, drinks days, low and no alcohol, the events calendar); keep it responsible.
- **Build:** registered as the spring hub in `src/lib/seasonal-hubs.ts` (the spring theme tokens already exist).
- **Overlap note:** "pub events calendar" belongs to the existing events calendar guide; the hub links to it rather than competing.

### pg_0040 Burns Night (cl_0019), new, /guides/burns-night-pub-ideas

- **Title:** Burns Night Menu Ideas for Pubs: Supper, Running Order and Promotion
- **H1:** burns night menu ideas for pubs
- **Intent:** informational, licensee planning a Burns supper.
- **Sections:** why Burns Night suits a pub (Monday 25 January 2027); a Burns supper menu, traditional and modern; the running order (Selkirk Grace, piping in the haggis, the Address, the toasts, Auld Lang Syne); one sitting, one price, pre-ordered; drinks; promotion timeline; allergens from the supplier's information, never assumed.

### pg_0041 Valentine's Day (cl_0020), new, /guides/valentines-day-pub-ideas

- **Title:** Valentine's Day Menu Ideas for Pubs and Restaurants: Set Menus, Sittings and Promotion
- **H1:** valentine's day menu ideas for pubs
- **Intent:** informational, licensee building a Valentine's offer.
- **Sections:** 2027 falls on a Sunday with England v France in the afternoon; set menu ideas; two sittings and deposits; a bar night for everyone else (anti-Valentine's, Galentine's); promotion timeline; keep it responsible.

### pg_0042 Mother's Day (cl_0021), new, /guides/mothers-day-pub-ideas

- **Title:** Mother's Day Menu Ideas for Pubs: Set Menus, Bookings and Promotion
- **H1:** mother's day menu ideas for pubs
- **Intent:** informational, licensee planning a Mother's Day lunch service.
- **Sections:** the date (Sunday 7 March 2027) and the rugby weekend before it; set menu ideas; sittings and table turns; afternoon tea and buffet alternatives; bookings, deposits and reminders; the marketing campaign, week by week.

### pg_0043 St Patrick's Day (cl_0022), new, /guides/st-patricks-day-pub-ideas

- **Title:** St Patrick's Day Pub Ideas: Events, Food and Promotions
- **H1:** st patrick's day pub ideas
- **Intent:** informational, licensee planning a midweek event.
- **Sections:** the date (Wednesday 17 March 2027, a bank holiday in Northern Ireland, four days after the Six Nations finale); event formats (music, a quiz, an Irish night); food ideas; drinks without risky promotions (the Scottish rules); promotion; staffing the night.

### pg_0044 Easter (cl_0023), new, /guides/easter-pub-ideas

- **Title:** Easter Pub Ideas: Menus, Events and Promotions for the Long Weekend
- **H1:** easter pub ideas
- **Intent:** informational, licensee planning the four-day weekend.
- **Sections:** the dates (Good Friday 26 March to Easter Monday 29 March 2027) and bank holidays by nation; a plan for each day; Easter Sunday menu ideas; community and family events (an egg hunt); International Whisk(e)y Day on Easter Saturday; promotion.

### pg_0045 Six Nations (cl_0024), refresh, /guides/pub-six-nations-rugby-marketing

- **Title:** Six Nations 2027 in Your Pub: Fixtures, Screening and Match-Day Ideas
- **H1:** six nations 2027 in your pub
- **Intent:** informational, licensee planning the men's and women's championships. The slug stays: it is the live URL.
- **Change:** replace 2026 references with the verified 2027 fixtures (men's 5 February to 13 March, women's on five Saturdays from 10 April to 15 May); keep the screening, food and booking guidance; link to the playbook.

## Backlog for approval

One list, one approval.

**Already approved by Peter on 17 October 2026 (content build, not diagnose tickets):** the six new pages pg_0039 to pg_0044 and the pg_0045 refresh, written to the guidance above.

**Approval asked now (five, by priority score):**

- tk_000021: collect-evidence, Burns Night (priority 8.0)
- tk_000022: collect-evidence, Valentine's Day (priority 8.0)
- tk_000023: collect-evidence, Mother's Day (priority 8.0)
- tk_000028: collect-evidence, St Patrick's Day (priority 4.0)
- tk_000029: collect-evidence, Easter (priority 4.0)

Collect-evidence means the next review run requests query-filtered Search Console pulls for these groups once their pages are live, so they can move from tier C to a measured tier.

**Deferred:** tk_000030 (Six Nations, over the five-a-run limit and ranked last of the ties) and every ticket for groups outside this expansion (tk_000012 to tk_000020, tk_000024 to tk_000027), to the next review run.

## Handoffs

- **editorial-team:** one brief per page from the guidance above, carrying primary, secondary and answer-in-passing terms as the source of truth, the intent, evidence tier C (D for the playbook), the deciding action (collect-evidence; research for the playbook), the scenario "not estimable", the overlap notes and the checkpoint dates below.
- **deploy-verify:** every shipped page.
- **seo-powerhouse:** none in this run.

## Checkpoints due

- Technical, within 48 hours of each deploy: deploy-verify.
- Indexation, one to two weeks after each deploy: the implementer.
- Measurement: the first review run with a full window after the pages go live, with paired intervention pulls. Demand for each occasion peaks in the weeks before its date, so the windows that matter fall between January and April 2027.
- Structural: the next expansion, three to six months on.

## Data quality and limitations

- No Search Console data in this run; every figure is a demand band.
- Location, language and network are unattested (limiting).
- `pages.csv` predates the `first_published` column (limiting); the staged copy adds it.
- The Pub food and menu profitability group (cl_0009) had its head keyword set by hand to "pub christmas menu ideas" (10 to 100) after the automatic rule picked "candle light dinner menu ideas" on a tie. Peter approved re-picking that group's head from its own terms.
- The playbook has no measurable search demand; its value is as the toolkit's landing page and as the hub that links the season together.
- `site-events.toml` is missing; writing it is a separate task before the next review run.

## Sources

- `raw/gkp-discover-01-spring-hub.csv` sha256 d7518a4bd5217338024c1dab6ca12ab2b4451977862df7ad8325424e6fb5260f
- `raw/gkp-discover-02-burns-night.csv` sha256 286ffd7876d9f38b88dbd3d4afd7c069381fce046a87b6509b9326333f85e885
- `raw/gkp-discover-03-valentines.csv` sha256 fbf1b3dfc97b7a4e76912c6e6fe3cbecdb4624f19e2348491472081c3c74889d
- `raw/gkp-discover-04-mothers-day.csv` sha256 cafa5406e19d68592586951153e2e84ddac5ff165fa36095547aa417ea986c2d
- `raw/gkp-discover-05-st-patricks.csv` sha256 104ca19914abe34723a0425c9651c97080277fd23320d9de74ee7f1be5f9563e
- `raw/gkp-discover-06-easter.csv` sha256 d649b9b4787ea791d6ecd52430090e7f3c02ccba2472ad840781b15dfb70d01a
- `raw/gkp-discover-07-six-nations.csv` sha256 8e3ff8c7320bff16d145cde6c7b6a890404fe1bae5e8c18eb8beb2a0c356a2aa
- `raw/gkp-discover-08-dry-january-drinks-days.csv` sha256 e325d453fb97eb26404b3f67272a74822ca0f3aec9057f056f827893d6c96b43
- `raw/gkp-discover-09-page-six-nations-guide.csv` sha256 68328456741926d22857b578862b288ed5845b78d734662b8806e116770c574c
- `raw/gkp-discover-10-page-events-calendar-guide.csv` sha256 b2b1be1b6446ee03586ede1db8b7735953ad9794ff63c9c847a977f5c3f2cb39
- `analysis/plan-skeleton.md`, `analysis/delta.md`, `analysis/backlog.csv`, `analysis/diagnostics.csv`, `analysis/discovery-summary.md`, `staged/clusters.csv`, `staged/pages.csv`, `staged/keywords.csv`, `staged/demand-observations.csv`, `staged/overlaps.csv`, `config.toml`
