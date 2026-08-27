# Coverage register: what the plan actually covers

**Date:** 27 August 2026
**Purpose:** an honest answer to "does the plan cover all the work?"

**Short answer: no, not yet.** Roughly two thirds of the programme is specified to the point a
developer could pick it up. The rest is named but not written, and three things are not covered at
all. This document lists every gap so none of them is a surprise later.

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
| G2 | **Page copy.** No copy exists for home, about, how we work, solutions or results. The growth-problem pages are the exception: the designer put all eight variants in the template and said lift them verbatim. | WS5 | Large |
| G3 | **Fit language for `/start-here`.** The one remaining blocking copy decision. It is the qualification filter that replaced the price. | WS5 order 2 | Small |
| G4 | **The 14 page briefs** for tier-one ranking work. The spec says each needs target queries, SERP intent, change hypothesis, permitted edits and a monitoring date. None written. | WS8a | Medium |
| G5 | **The 72-post scoring rubric.** Capped at ten posts for a first pass, but the scoring criteria are not defined. | WS8c | Small |
| G6 | **NextStep mapping** for 105 posts. Every post needs a curated problem, case and offer link. The existing related-links data contains retired routes and old prices and cannot be reused. | WS6 | Medium |
| G7 | **Case study selection and content.** `/results/[slug]` now exists as a route. Which case studies ship, and who writes them, is undecided. | WS5 order 4 | Medium |
| G8 | **CSP and security header changes.** Named once. New fonts and analytics behaviour may need policy changes, and broadening CSP to make a component work quietly weakens every route. | WS2, WS4 | Small |
| G9 | **Visual regression tooling.** Required by D17 to prove `/availability` is unchanged. Not chosen. | WS2 | Small |
| G10 | **Component harness.** WS3 says "a private component harness". Storybook or the existing test stack is not decided. | WS3 | Small |
| G11 | **Trades second wave.** Deferred by D13 with no plan behind it. | Post-launch | Small |

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
