# Handoff to seo-powerhouse: seven investigations

From keyword-plan run `2026-09-08-01-setup`, finalised 8 September 2026, approved in full by
Peter Pitcher. Evidence is in `tasks/keyword-plan/runs/2026-09-08-01-setup/`.

These are **investigations, not fixes**. Nothing here should be rewritten, consolidated or
redirected until the investigation says what is actually wrong. That ordering is the point.

## Read this first

Every window in the evidence **predates the 31 August 2026 rebuild**, when the repositioning
shipped and `/licensees-guide` became `/guides` underneath roughly 900 of the site's 978 annual
clicks. Two of the pages below (`/solutions/hospitality-websites`, `/solutions/booking-systems`)
were only published on 5 September, so "no visibility" may simply mean Google has not caught up.
Establishing that is part of the job.

Named-query coverage in this evidence is **9.1% of clicks** over three months. Impression and
position figures are a named subset, never the page's traffic.

---

## tk_000001, priority 37.5, cluster cl_0001, website and application build

**Target page:** `/solutions`
**Evidence:** 2 named-query impressions at position 6.0 over the three months to 6 September 2026.
**Demand:** `websites and applications` band 10K to 100K a month; `websites development` and
`website development in uk` band 1K to 10K. United Kingdom, English, measured 8 September 2026.

The largest measured demand anywhere in this programme, against a two-impression footprint.
Position 6.0 on those two impressions suggests the page is not ineligible, just invisible.

**What to establish:** is `/solutions` indexed; what does it currently rank for; is anything on the
site competing with it for these terms; and is the page's own copy actually about websites and
applications in the words people search with. The 10K to 100K terms are broad and may not be
commercial intent, so a SERP inspection for `website development uk` and `bespoke web application`
matters more than the band does.

## tk_000002, priority 37.5, cluster cl_0002, booking systems

**Target page:** `/solutions/booking-systems`, published 5 September 2026
**Evidence:** 5 named-query impressions at position 7.8.
**Demand:** `free online booking system` and `online reservation system free` band 1K to 10K, both
High competition; `table booking system` and `web booking system` band 100 to 1K, Medium.

**What to establish:** indexation first, given the page is days old. Then whether the free-oriented
head terms are worth chasing at all: a page selling bespoke booking systems ranking for "free
booking system" attracts the wrong visitor, and the 100 to 1K commercial terms may be the better
target despite the smaller band.

## tk_000003, priority 37.5, cluster cl_0017, brand

**Target page:** `/`
**Evidence:** 1 named-query impression at position 12.0 over three months for `orange jelly`.

For a company with a live site and a public name, that is not a normal brand footprint. Position
12 on the brand term would be worse. Most likely explanation is that the query is too rare to clear
Google's naming threshold, in which case there is nothing to fix and the finding is simply that
brand search volume is negligible. Confirm which it is before anyone treats it as a problem.

## tk_000004, priority 36.0, cluster cl_0012, pub turnaround, SERP check

**Target page:** `/why-revenue-is-falling`
**Evidence:** 148 named-query impressions at position 7.6, zero clicks. Tagged
`CTR_GAP_CANDIDATE`.
**Demand:** band 10 to 100.

A click-through gap at position 7.6 is usually a feature block, an AI overview, or a mismatch
between the title and the intent, not a weak title on its own. **Record the SERP observation as a
`check-done` event on this ticket in `changes.jsonl`**, with source, locale, device, date and the
features seen. `diagnose.py` will not unlock `improve-snippet` for this cluster until that event
exists.

## tk_000006, priority 30.0, cluster cl_0005, fractional marketing leadership

**Target page:** `/fractional-cmo`
**Evidence:** 18 named-query impressions at position 26.8.
**Demand:** `fractional marketing director` band 100 to 1K Medium; `fractional cmo uk` band 100 to
1K Low.

Low competition on a commercially shaped term with a live page at position 26.8. Establish whether
position 26.8 reflects a thin page, no internal links, or no authority for the term.

## tk_000009, priority 22.5, cluster cl_0013, pub social media marketing

**Target page:** `/guides/social-media-strategy-for-pubs`
**Evidence:** 11 named-query impressions at position 7.4 in this window. The same page carried
4,352 impressions and 42 clicks in the twelve months to 9 August 2026.

The collapse from 4,352 impressions to 11 is the thing to explain. It may be the URL rename, it may
be the country filter restricting the named subset, or it may be real. Check the page under both
its old and new paths.

## tk_000010, priority 18.0, cluster cl_0014, cellar and drinks operations, SERP check

**Target page:** `/guides/cellar-management-beer-quality-guide`
**Evidence:** 957 named-query impressions at position 8.6, 3 clicks. Tagged `CTR_GAP_CANDIDATE`.

The largest impression count of any cluster tagged for a click-through gap. Note that a big part of
this cluster's impressions come from `cask ale week 2026` (641 impressions, 2 clicks, position
6.5), which is a dated seasonal query and may simply be people looking for the dates. Same
`check-done` requirement as tk_000004.

---

## Reporting back

Record the outcome of each investigation as an event in
`tasks/keyword-plan/changes.jsonl`, so the October review can read it:

- A SERP observation: a `check-done` event on the ticket, `details` carrying source, locale,
  device, date and features seen.
- A shipped change: a `shipped` event with the ticket id, date, page, what changed and the
  deployment reference, then through `deploy-verify`.
- A conclusion that no change is needed: a `check-done` event saying so, with the reasoning.

Checkpoints: technical at 0 to 48 hours through deploy-verify, indexation at 1 to 2 weeks,
measurement in the keyword-plan review of late October 2026.
