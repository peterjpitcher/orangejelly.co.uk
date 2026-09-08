# Handoff to editorial-team: four content jobs

From keyword-plan run `2026-09-08-01-setup`, finalised 8 September 2026, approved in full by
Peter Pitcher. Evidence is in `tasks/keyword-plan/runs/2026-09-08-01-setup/`.

## Rules that bind every brief below

- **The keyword lists here are the source of truth.** Do not substitute your own.
- **No scenario is estimable.** No cluster reached evidence Tier A, so nobody may promise a click
  or traffic number from this work. If a draft implies one, cut it.
- **Demand figures are bands, not counts.** The Ads account has no active spend, so Keyword Planner
  returns encoded bands. Write "100 to 1K a month" or say nothing. Never print a single number, and
  never add bands together.
- **Only approved claims.** Every quantified proof point comes from `/CLAIMS.md`, expressed as a
  percentage, always attributed to The Anchor.
- **House constraints.** British English. No em dashes. The repo's pre-commit guards reject
  cost-reduction phrasing and American spellings, so write around them rather than through them.
  Use "reclaim", "margin growth" or "cut waste" instead. The guard is literal enough that this very
  file tripped it while describing the rule, so do not quote the banned words even to explain them.
- **Question terms are not answer blocks yet.** No SERP observation exists for any cluster, so do
  not build FAQ or answer blocks on an assumption about what the results page looks like.

---

## tk_000005, priority 32.0, cluster cl_0004: strengthen /pub-marketing

**The largest reclaimable footprint on the site.** 1,618 named-query impressions at average
position 19.7 over three months, and zero clicks.

**Primary:** pub marketing, pub marketing agency, marketing agency for pubs
**Secondary:** hospitality marketing agency uk, marketing for bars and restaurants, pub advertising,
digital marketing for pubs, content creation for pubs, paid social for pubs, instagram services for
pubs, facebook services for pubs
**Intent:** commercial
**Evidence tier:** B. **Deciding tag:** STRIKING_DISTANCE_CANDIDATE. **Action:** strengthen-page.
**Demand:** band 10 to 100 on the head terms measured. The demand here is small; the *footprint* is
what makes this worth doing.

**The brief.** At position 19.7, a title rewrite will not fix this. Depth and specificity will.
The page has to be unambiguously about marketing for pubs and bars, in the words above, with enough
substance to move from page two.

**The tension to hold.** Orange Jelly repositioned away from being a hospitality marketing company
on 31 August 2026. The positioning gate in `scripts/check-positioning.mjs` allows "hospitality
marketing agency" on the sector pages because it is accurate there, and forbids it anywhere that
describes the company. `/pub-marketing` is a sector page, so the language is allowed. Read that
gate before writing, and do not let this page drift into describing the whole business.

## tk_000007, priority 24.0, cluster cl_0007: strengthen quiz mechanics

**Target page:** `/guides/quiz-night-101`
687 named-query impressions at position 11.1, 15 clicks. In the twelve months to 9 August 2026 this
page carried 2,937 impressions and 40 clicks at position 7.9.

**Primary:** how to run a pub quiz, pub quiz format, quiz night format
**Secondary:** pub quiz round ideas, pub quiz answer sheet, picture round ideas, pub quiz question
rounds, pub quiz scoring system, quiz night rules, pub quiz prizes, pub quiz topics
**Intent:** informational
**Evidence tier:** B. **Deciding tag:** STRIKING_DISTANCE_CANDIDATE.
**Demand:** `picture round ideas`, `pub quiz answer sheet` and `pub quiz round ideas` each band
**100 to 1K** a month, all Low competition. `how to run a pub quiz`, `pub quiz format`,
`pub quiz question rounds` and `quiz night rules` each band 10 to 100.

**The brief.** These three 100 to 1K terms are the strongest measured demand in the entire pub
content estate, and the site already ranks at 11.1. The gap is **format and round mechanics**, not
another ideas list. Answer-sheet structure, round types, scoring, and a picture round that someone
could actually run on Thursday.

**Cannibalisation risk.** `quiz-night-ideas` and `restart-quiz-music-sport-roi` already exist, and
`quiz-night-ideas` is the bigger page (5,753 impressions in twelve months). Read both before
writing and be explicit about which page owns which intent.

## tk_000008, priority 24.0, cluster cl_0008: the pub bingo hub

**Target page:** `/guides/pub-bingo`, **which does not exist yet**. `pg_0030` is marked `planned`.

1,374 named-query impressions at position 10.9, 6 clicks, currently landing on the two format
guides because there is no hub.

**Primary:** pub bingo
**Secondary:** bingo in pubs, how to run bingo in a pub, bingo night in pubs, bingo licence uk pub,
bingo equipment for pubs
**Intent:** informational
**Evidence tier:** B. **Deciding tag:** STRIKING_DISTANCE_CANDIDATE.
**Demand:** `pub bingo` band **100 to 1K**, Medium competition. It is one of only four pub terms
ever measured in that band. The other five secondary terms all returned no data, twice: on
9 August and again on 8 September.

**The brief.** A hub above `cash-bingo-101` and `music-bingo-101`, earning the generic term and
sending people to the right format. Licensing is the question a licensee actually has, so cover it
properly and accurately: gaming rules are a legal matter, and getting this wrong would be worse
than not covering it. If the licensing position cannot be stated with confidence, say what to check
and with whom rather than guessing.

**Structural note.** Adding a hub above two existing guides creates the cannibalisation risk it is
meant to solve. The hub must not restate the format guides; it must route to them.

## tk_000011, priority 16.0, cluster cl_0015: strengthen the promotional calendar

**Target page:** `/guides/national-drinks-days-pub-guide`
402 named-query impressions at position 11.4, 1 click.

**Primary:** pub promotion calendar, national drinks days
**Secondary:** awareness days for pubs, drinks day promotions
**Intent:** informational
**Evidence tier:** B. **Deciding tag:** STRIKING_DISTANCE_CANDIDATE.

**Read the avoid list before starting.** `national vodka day` is on it, scoped to this cluster.
The page attracts consumers looking for a date, not licensees, and those clicks do not convert.
The August rewrite deliberately reframed the title towards licensees and accepted lower
click-through as the right trade. **Do not undo that.** The job is to make the page more useful to
a licensee planning a year of promotions, not to chase the consumer query.

Expect impressions to stay high and clicks to stay modest here. That is the intended outcome, and
the October review should not read it as failure.

---

## Reporting back

Log each shipped change as a `shipped` event in `tasks/keyword-plan/changes.jsonl` with the ticket
id, date, page, what changed and the deployment reference, then run it through `deploy-verify`.
The keyword-plan review of late October 2026 reads those events to attribute movement.
