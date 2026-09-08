# What the first run taught us about the keyword-plan skill

Written 8 September 2026, from the programme set-up run `2026-09-08-01-setup` on orangejelly.co.uk:
the first end-to-end use of v2.1 on a real site. Twenty six pulls, 4,454 keywords, 17 clusters, a
finalised baseline and eleven approved tickets.

Ordered by value. Each item says what happened, why it matters and what to change.

---

## 1. The demand lookup is dead on every first run. This breaks the whole tier system

**Severity: critical. Fix this before the next run anywhere.**

`diagnose.py:546`:

```python
demand = select_demand(tables["demand_observations"], (cluster.get("head_keyword_id") or "").strip())
```

and `select_demand` opens with `if not keyword_id: return None`.

`head_keyword_id` was blank on all 17 clusters, so `demand` was `None` on all 17, so every cluster
was tagged `DEMAND_UNKNOWN`, so **not one cluster could reach evidence Tier A**, so every scenario
printed `not estimable` and the plan could not size a single opportunity.

The universe was not short of data. It held **2,968 keywords with a returned demand observation**,
and **12 of the 17 clusters had at least one assigned keyword carrying one**. `cl_0001` had 650 and
`cl_0002` had 675. All of it was invisible to the diagnosis.

This is guaranteed on every set-up run, not bad luck. Phase 0 writes `clusters.csv` before any
keyword exists, `keywords.csv` starts empty by design, and keyword ids are minted later by
`import-gkp.py`. **Nothing in the documented flow ever sets `head_keyword_id`.**

**Change, in preference order:**

1. `build-universe.py` sets `head_keyword_id` where it is blank: the assigned keyword whose
   normalised text exactly matches the cluster's head term, else the assigned keyword with the
   highest demand band, else the highest-impression named query. Record which rule fired.
2. `diagnose.py` falls back when `head_keyword_id` is blank: take the highest band among keywords
   with `primary_cluster_id == cid`, and record the keyword id it used in a new
   `demand_keyword_id` column so the choice is auditable.
3. Add a `HEAD_KEYWORD_MISSING` limiting message so a blank one is never silent again.

Do 1 and 2 both. 2 alone leaves `clusters.csv` permanently incomplete; 1 alone breaks again the
moment a new cluster is added mid-programme.

---

## 2. The cluster-pull cap chose the twelve clusters with the least to export

**Severity: high.**

`make-request.py` capped cluster pulls at twelve and selected them **by business value**. Because
the new positioning is the commercial priority, its clusters score 4 and 5, so the cap handed pulls
to `cl_0001` (one matching query, one impression in twelve months), `cl_0002` (two queries, two
impressions), `cl_0003`, `cl_0005`, `cl_0006` and `cl_0017` (one impression), while excluding
`cl_0014`, `cl_0015` and `cl_0016`, which had 470, 841 and 557 impressions.

Six of the twelve pulls could not return data. Three clusters with real footprint got nothing.

**Change:** rank the cap by **expected yield**, not business value. When any prior query evidence
exists, including a legacy or not-comparable export, run each cluster regex over it and rank by
matched impressions. Where no prior evidence exists, fall back to business value and say so.
Business value belongs in the priority score, which is where it already is; using it twice, once to
decide what to measure and again to decide what matters, biases the programme towards measuring
what it already believes.

Add an informational message naming the clusters skipped and why, so the operator can override.

---

## 3. Ship the inbox sorter. Nobody should rename exports

**Severity: high, and the single biggest reduction in operator friction.**

Peter's exact words were "I'm also not going to rename them either". He was right, and renaming was
never necessary: every Search Console export records its own filters and dates in `Filters.csv` and
`Chart.csv`, and every Keyword Planner export carries its layout and its keywords.

I wrote `sort-inbox.py` for this workspace. It sorted 22 of 25 files unattended, including matching
all thirteen Search Console exports to the right pull purely from their contents.

**Change:** move it into `<skill-root>/scripts/sort-inbox.py` and put it in the flow between the
operator's reply and `validate-run.py`. Three details worth keeping:

- Match property pulls on the `Date` preset in `Filters.csv`.
- When the query filter text does not match, score every candidate cluster regex against the
  export's own `Queries.csv` and take the best. **This worked on all ten cluster exports, matching
  100% of returned queries in every case.** Refuse to guess on a tie.
- Match Keyword Planner discovery pulls by seed overlap with the returned keywords.

---

## 4. Preset date ranges need to be a first-class option

**Severity: high.**

`make-request.py` only emits exact calendar windows. Peter asked for presets ("just ask for the last
28 days, 3 months or 16 months"), and I had to hand-patch `request.json` and `request.md` to get
them, which is exactly the kind of edit the contract says should not happen.

The validator already handles it correctly: a preset window sitting inside a wider requested window
records `WINDOW_SHORTER`, which is limiting, not fatal.

**Change:** add `--windows {calendar,preset}` to `make-request.py`. Under `preset` it should widen
each expected window into a container the preset will fall inside, add `preset` to `expected`, and
write the choice into `run.json`.

Then make the cost explicit rather than discovered later. Preset windows drift with the export date,
so `delta.py`'s year-on-year comparison and the decay check both want calendar alignment and will
report "not available". A run using presets should print that in the plan's data-quality section
automatically, not rely on the analyst remembering.

---

## 5. The regex filter wording is now confirmed. Stop flagging it

**Severity: medium, and it is pure noise reduction.**

`scripts/CONTRACT.md` says the exact wording Google uses for a regex filter "has not been confirmed
on a real export". It has now, ten times over. Search Console writes:

```
Query,"+(?i)((pub )?quiz\b.{0,25}\b(night|round|format|...)|picture round|quiz night)"
```

A leading `+`, then the pattern verbatim.

That single unknown character produced **ten `FILTER_TEXT_UNCONFIRMED` limiting messages in one
run**, on ten exports that were all perfectly correct.

**Change:** strip a leading `+` before comparison in `validate-run.py`, update the contract, and keep
`FILTER_TEXT_UNCONFIRMED` for genuinely different shapes. A validator that cries wolf on every
correct export trains the operator to ignore it.

---

## 6. Renamed pages produce two rows each in page-performance.csv

**Severity: medium, and it will silently corrupt arithmetic.**

After the 31 August rename, `/licensees-guide/<slug>` and `/guides/<slug>` both appear in the same
export and both resolve to the same `page_id`. `analysis/page-performance.csv` therefore carries two
rows per renamed page per window. Anything summing that file without grouping reads a page as
smaller than it is.

It caught me out inside this very run: I read 9 impressions for the social media guide when the
honest figure across both URLs was 289.

**Change:** `join-performance.py` should group by `page_id` and sum, keeping the contributing URLs in
a `url_variants` column, and emit an informational `PAGE_URL_VARIANTS` naming the affected pages.
This persists for sixteen months after any rename, so it is not an edge case.

---

## 7. The skill has no concept of the site changing under it

**Severity: high, and it was the most important fact in this entire run.**

The site was rebuilt, repositioned and had its main URL prefix renamed on 31 August 2026, eight days
before the run. That prefix carried roughly 900 of the site's 978 annual clicks. Every window the
run could pull describes a site that no longer exists.

`references/gsc-incidents.toml` models **Google-side** reporting incidents. There is no equivalent
for **site-side** events, which are far more common and just as damaging to a comparison.

**Change:** add site events as first-class, either as `site-events.toml` in the workspace or as a
`site_event` type in `changes.jsonl`, with a type (`url-migration`, `redesign`, `repositioning`,
`content-purge`), a date and the affected path pattern. Then:

- `delta.py` flags any comparison whose window crosses one, and refuses page-level comparison across
  a `url-migration` outright.
- `diagnose.py` suppresses `DECAY_CANDIDATE` and `LOW_OBSERVED_VISIBILITY` for pages younger than
  the window, which would have prevented four of this run's eleven tickets.
- The plan's "How to read this plan" names them.

Related and cheap: **record page age**. Four clusters in this plan were diagnosed as having no
visibility when their target pages were one and nine days old inside a ninety day window. `pages.csv`
already has `last_changed`; add `first_published` and have `diagnose.py` refuse to tag a page that
did not exist for most of the window.

---

## 8. Handoff briefs need the same evidence discipline as the plan

**Severity: medium. Both of these were my errors, and the skill let me make them.**

**Do not predict the answer.** I wrote into the seo-powerhouse handoff that "a feature block above
the fold is the most likely explanation". It was wrong: the SERP had no AI overview, no featured
snippet and no People Also Ask. The real cause was that "fix my pub" is largely a navigational query
for Punch Pubs. A prediction in a brief anchors the investigator towards confirming it.

**Change:** the handoff contract should forbid stating an expected answer in an `investigate` or
`serp-check` ticket. State the evidence and the question. Nothing else.

**Carry scope on every figure.** I asked seo-powerhouse to explain "a collapse from 4,352 impressions
to 11". There was no collapse. 4,352 was a page-level, twelve-month, all-countries figure; 11 was a
cluster-level, named-query, three-month, United Kingdom figure. Two different measures of two
different things.

Rule 2 of the skill already says every figure carries its scope and completeness. The plan template
enforces it. **The handoff template does not.**

**Change:** require scope, window and completeness on every figure in a handoff brief, and add a
lint that rejects a brief containing a bare number.

---

## 9. The operator can use the wrong Keyword Planner tool for a month without knowing

**Severity: medium.**

The 9 August exports were taken believing they were "Discover new keywords". They were "Get search
volume and forecasts". Nobody noticed for a month, and the whole content plan was built on the
belief that discovery had been done. It had not. `validate-run.py` identified it in seconds once the
pulls were declared.

**Change:** `make-request.py` should print the operator's own check next to every discovery pull:
*"a discovery export returns far more rows than you typed. If it returns exactly your list, you used
Get search volume instead, and this pull needs re-taking."* Name the exact button and tab.

Related: Peter also exported the **Keyword Forecasts** tab by accident. My sorter rejected it, but
only as a side effect of the layout check. **Change:** have the sorter quarantine forecast exports to
`raw/ignored/` by name and by layout, and say so, rather than reporting them as unmatched.

---

## 10. Band arithmetic is the most dangerous failure in this skill and nothing detects it

**Severity: high.**

The August report published "quiz mechanics: 1,750 monthly UK searches, clear winner, build here
first", and that figure ordered the content plan for a month. It was the sum of band **codes**, not
searches. The true reading of the same file: of 67 keywords, 44 returned nothing, 19 sat in the band
10 to 100, and 4 sat in 100 to 1,000.

The rules forbid this in three separate places. Nothing enforces it.

**Change, two parts:**

1. `import-gkp.py` should never import the segmentation total rows (the `All` and country rows that
   carry the summed codes) as keywords. They are the source of the temptation.
2. Add a plan lint: every number printed in `plan.md` must appear in a file under `runs/<run_id>/`.
   That is rule 1 of the skill made mechanical, and it would have caught the August error before it
   reached a reader.

---

## 11. A SERP observation needs to record personalisation

**Severity: medium.**

Peter's `fix my pub` screenshots were personalised and taken from his own postcode. His site appeared
at roughly position 3; Search Console reports the query at an average of 4.95. Both are true and they
measure different things. A site owner searching their own terms is the least neutral observer there
is.

**Change:** make `personalisation` (`personalised` or `incognito`) and `location` required fields on
a `check-done` event, and have the request text ask for a non-personalised window. Where the
observation is personalised, the plan should print the position as indicative and prefer the Search
Console average.

---

## 12. URL-seeded discovery batches cannot be identified from their contents

**Severity: low, but it cost the only manual step in an otherwise automatic sort.**

Two discovery exports could not be matched because `url_batches` may carry no seeds, and seed overlap
is the matching signal. I placed them by timestamp order, which was correct but was a judgement call.

**Change:** require at least two seeds on every `url_batch`, purely as a matching fingerprint, or
have the sorter fall back to export timestamp order within a source type and say it did so.

---

## 13. Smaller things worth writing down

- **"Last 16 months" returned thirteen.** The export covered 2025-08-01 to 2026-09-06. Document it so
  nobody reads it as a data gap or a failed export.
- **Legacy single-tab exports are the common shape.** People export just the Queries tab. The
  migration guidance handles it correctly (no window, no country filter, not comparable, context
  only), but it should name the shape explicitly, because it is what most sites will arrive with.
- **`check-regex.py` rejects `\.`** and only permits `\b` and `\s`. Correct per the grammar, but the
  error should suggest the fix, which is a character class: `[.]`. I hit this and it cost a cycle.
- **The 12-month legacy query file was the most useful thing in the workspace.** It sized clusters,
  chose seeds, predicted which pulls would be empty and caught a badly targeted cluster. The skill
  treats not-comparable evidence as nearly worthless. It should say plainly that such evidence is
  fine for choosing what to measure, and only barred from being quoted as a metric.

---

## What went right, and should not be changed

Worth recording so none of this gets refactored away:

- **Stopping at the request boundary.** The discipline of writing the request and ending the turn is
  what kept the operator in control of a 26-export ask.
- **`validate-run.py` caught the discovery-versus-volumes error instantly**, a month after a human
  had missed it. Layout checking earns its place.
- **Fatal versus limiting is the right division.** Twenty six limiting messages and zero fatal ones
  described the run honestly: usable, with known caveats.
- **Refusing to sum bands** is the rule that would have prevented the most expensive mistake in this
  site's recent history.
- **Approval bound to a row hash** meant the eleven tickets were approved against the evidence
  actually shown, not against a later rescoring.
