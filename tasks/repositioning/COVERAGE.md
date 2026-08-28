# Coverage register: what the plan actually covers

**Date:** 27 August 2026
**Purpose:** an honest answer to "does the plan cover all the work?"

**Answered 27 August 2026.** Every gap below now has a task ID in `MASTER-PLAN.md`, which is the
complete 94-task register for the programme. This document stays as the record of what was missing
and why, so the gaps cannot quietly reappear.

| Gap | Now tracked as |
|---|---|
| G1 design authority | T023 |
| G2 page copy | T045, T047, T051, T053, T055, T066, T068 |
| G3 fit language | T045 |
| G4 page briefs | T079 |
| G5 scoring rubric | T082 |
| G6 NextStep mapping | T074 |
| G7 case studies | T057 |
| G8 CSP | T022 |
| G9 visual regression | T011 |
| G10 component harness | T012 |
| G11 trades | T090 |
| **N1 owners and dates** | Master plan header and phase estimates. Claude owns delivery. |
| **N2 content author** | Claude writes. Peter supplies experience, listed in the plan. |
| **N3 designer has the old method** | T004, sent as `DESIGNER-BATCH-2026-08-27.md` |

The original assessment follows.

---

**Short answer at the time: no, not yet.** Roughly two thirds of the programme was specified to the
point a developer could pick it up. The rest was named but not written, and three things were not
covered at all.

Judged against one test: **could a competent developer or writer who has not been in these
conversations pick this up and do it without asking a question?**

---

## Buildable now

| Area | Where | Confidence |
|---|---|---|
| Dead code removal, adapter collapse | `component-audit.md`, WS1 | **Done and shipped** |
| Language gate fixes, vendored exclusion | WS1 | **Done and shipped** |
| Design token mapping and scoping | Spec WS2, D17 | High. Palette, scoping mechanism, security clause, font loading all stated. |
| Route disposition and redirects | Spec section 3 | High. Every route has one outcome, chain-safe, 308 stated. |
| Protected post register | `data/protected-posts-register.csv` | High. Generated, reproducible, tiered. |
| Enquiry form and lead data | `SUB-SPECS.md` Part 1 | High. Field-level contract, migration SQL, server order, abuse, privacy, follow-up. |
| AI readiness scorecard | `SUB-SPECS.md` Part 2 | High. Twelve statements, scoring, result rules, behaviour. |
| Analytics events | `SUB-SPECS.md` Part 3 | High. Eleven events with triggers, properties, consent, de-dup. |
| Insights content model | `SUB-SPECS.md` Part 4 | High. Front matter, collection split, slug collision check. |
| Keyword targets | `keyword-research.md` | High. Fifteen terms, ranked, with the page each justifies. |
| Component family mapping | `component-audit.md` | Medium. Mapping is clear, per-component porting is not. |

---

## Named but not written

Each of these is referenced in the spec as required work with no detail behind it. A developer would
stop and ask.

| # | Gap | Blocks | Effort to close |
|---|---|---|---|
| G1 | **Design authority order.** The review asked for a rule on which design file wins when they disagree, and the response document claims it was recorded. **It was not.** Zero mentions in the spec. The sources genuinely do conflict: the handback treats Schibsted Grotesk as production while the README calls it a substitute, and the SKILL file bans gradients while the tokens use gradient highlight bands. | WS2, WS3 | Small |
| G2 | **Page copy.** No copy exists for home, about, how we work, solutions or results. The growth-problem pages are the exception: the designer put all eight variants in the template and said lift them verbatim. **Closed. Copy written and built for home, /start-here, /how-we-work, /results, /about, /solutions, the eight growth problems, both sector pages and /contact. Each has a reviewable copy document in tasks/repositioning/copy/ and a test holding the page to it.** | WS5 | Large |
| G3 | **Fit language for `/start-here`.** The one remaining blocking copy decision. It is the qualification filter that replaced the price. **Closed. The fit language is on /start-here, six named behaviours rather than a hedge, and asserted by test.** | WS5 order 2 | Small |
| G4 | **The 14 page briefs** for tier-one ranking work. The spec says each needs target queries, SERP intent, change hypothesis, permitted edits and a monitoring date. None written. **Closed. tasks/repositioning/TIER-ONE-BRIEFS.md, fourteen briefs each diagnosing position or CTR and testing one change.** | WS8a | Medium |
| G5 | **The 72-post scoring rubric.** Capped at ten posts for a first pass, but the scoring criteria are not defined. **Closed. tasks/repositioning/TIER-THREE-RUBRIC.md, eight weighted criteria and a decision tree. Scoring is blocked on an external backlink export, which the rubric says outright rather than scoring without it.** | WS8c | Small |
| G6 | **NextStep mapping** for 105 posts. Every post needs a curated problem, case and offer link. The existing related-links data contains retired routes and old prices and cannot be reused. **Closed. All 105 mapped in tasks/repositioning/data/article-next-steps.json, validated by test. One growth problem has no inbound article and that is recorded rather than forced.** | WS6 | Medium |
| G7 | **Case study selection and content.** `/results/[slug]` now exists as a route. Which case studies ship, and who writes them, is undecided. **Closed for the Anchor three, told through the four method steps and covering all five approved claims. Client case studies still need Peter and their permission.** | WS5 order 4 | Medium |
| G8 | **CSP and security header changes.** Named once. New fonts and analytics behaviour may need policy changes, and broadening CSP to make a component work quietly weakens every route. | WS2, WS4 | Small |
| G9 | **Visual regression tooling.** Required by D17 to prove `/availability` is unchanged. Not chosen. | WS2 | Small |
| G10 | **Component harness.** WS3 says "a private component harness". Storybook or the existing test stack is not decided. | WS3 | Small |
| G11 | **Trades second wave.** Deferred by D13 with no plan behind it. | Post-launch | Small |
| G12 | **Founder voice in 75 of the 105 articles.** 136 instances of "I run", "my pub", "I have". D21 says company voice throughout, and article bylines keep a named human author, so it is genuinely ambiguous whether the body copy is in scope. It is a content change to the protected posts either way, so it belongs with T080 and T081 and needs Peter's call on the voice question first. | WS8 | Medium |

---

## Not covered at all

| # | Gap | Why it matters |
|---|---|---|
| **N1** | **Owners, estimates and dates.** Deliberately deferred in spec section 9 because capacity has not been agreed. Until it is, this is a sequence, not a plan. It cannot be forecast or honestly reported on. | This is the largest gap in the whole set. |
| **N2** | **Who writes the content.** WS8d needs articles for fifteen target terms. G2 needs five pages of copy. G7 needs case studies. No author, no cadence, no review process. | Content is the traffic engine and the plan has no one holding it. |
| **N3** | **The design system carries the old method.** D26 changed the method to HEAR. CHALLENGE. BUILD. OPTIMISE. after the designer had built around HEAR. EXPOSE. BUILD. PROVE. It is hardcoded in **five templates** (`landing-page`, `how-we-work`, `solutions`, `growth-problem`, `case-study`), the **MethodStep prop contract**, both `ui_kits` screens and the SKILL rules. | Created by our own decision, on 27 August, and not yet sent to the designer. |

---

## The design feedback batch that has not been sent

Three things need to go back to the designer together. None has been raised yet.

1. **The method words changed** (N3). Five templates and the `MethodStep` contract carry
   EXPOSE and PROVE.
2. **The About template's founder story must go** (D21). It ships a founder-story section with a
   photo placeholder, and the brand is now company-voiced with no founder-led page structure.
3. **Expletives are out** (D22). Confirm nothing in the templates or prompts assumes the manifesto
   line "Stop circling the problem. Make the f***ing change."

Outstanding from their side, unchanged: Greene King and BII logo migration into `LogoStrip`.

---

## Honest assessment

The **architecture** is covered: routes, redirects, tokens, components, data model, events, content
model, and what is protected. That was the hard part and it is done to a level someone could build
from.

The **content and delivery** are not. Nobody is named against any workstream, no dates exist, and
five pages of copy plus fifteen articles plus an unknown number of case studies have no author.

The gap that would hurt soonest is N3, because it is self-inflicted and it gets more expensive every
day the designer does not know.
