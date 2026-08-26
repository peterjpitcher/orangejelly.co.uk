# Design requests for the Orange Jelly rebuild

> **STATUS: ANSWERED IN FULL, 26 August 2026.** The designer delivered everything below in
> `Orange Jelly Design System (1).zip`, now stored at `docs/brand/design-system/`. The bundle went
> from 29 components and 6 templates to **44 components and 14 templates**. Their point-by-point
> reply is `docs/brand/design-system/HANDBACK-2026-08-26.md`. This file is kept as the record of
> what was asked and why. Nothing here is outstanding.
>
> Delivered: all 9 page templates (A9 confirmed as a reduced Start Here rather than a new design),
> the Growth Pressure Map as two components (static `PressureMap`, interactive `PressureCheck`),
> `Scorecard`, `NextStep`, `SiteSearch`, mobile navigation folded into `Header`, plus Pagination,
> EmptyState, Skeleton, ShareRow, CookieNotice, Tabs, CategoryTag and SeasonalBand. All six
> decisions in section C settled. `/availability` agreed out of scope.
>
> Two items remain on the designer's side: Greene King and BII logo migration into LogoStrip, and
> final verification of case-study figures before publish.


**Date:** 26 August 2026
**For:** whoever produced `design_handoff_website_redesign`
**Context:** the handoff covers 6 page templates and 29 components. This is what the live site needs
on top of that. Ordered by how much each one blocks the build.

The delivered work is strong and specific. Nothing below is a criticism of it. It is the gap between
a 6-template handoff and a 33-route site that is keeping all of its existing URLs.

---

## Before anything else: one folder is missing

`ds-overview.md` indexes `ui_kits/website/` as containing interactive **Home, How we work, Results
and Start here** screens. That folder is not in the delivered zip. It may already answer requests
A3 and A5 below. Please send it before we scope anything else.

---

## A. Page templates

The handoff covers home, start here, about, case study, blog listing, blog article. The website
blueprint in `10-website-blueprint.md` asks for more than that.

| # | Template | Why it is needed | Priority |
|---|---|---|---|
| A1 | **Growth problem detail** | The blueprint names 8 of these ("growth has stalled", "leads are not converting", "margin is under pressure" and so on). The search strategy makes them the primary commercial pages, ranked above service pages. One template, 8 instances. | **Highest** |
| A2 | **Growth problems hub** | Index for A1. Needs to let a visitor self-identify a symptom and route to the right page. | **Highest** |
| A3 | **How we work** | HEAR. EXPOSE. BUILD. PROVE. plus access required, how success is agreed, what a diagnostic includes. May be in the missing `ui_kits`. | High |
| A4 | **Solutions / capabilities** | Organised by outcome (create demand, convert more, protect margin, remove operational drag, improve experience, build for scale), not by service. | High |
| A5 | **Results overview** | Index above the case-study detail page. Short proof cards by pressure point. May be in the missing `ui_kits`. | High |
| A6 | **Sector hub** | We are keeping every existing hospitality URL to protect search authority. Hospitality becomes a contained specialist collection, so it needs a hub that reads as a proof-rich sector area rather than the definition of the company. | High |
| A7 | **Sector / service landing page** | Around 12 existing pub landing pages keep their URLs and content but need the new look. Currently three of them share `PubServiceLandingPage.tsx`. One template covers all of them. | High |
| A8 | **404 and error states** | None supplied. | Medium |
| A9 | **Contact** | Blueprint says a simple fallback page, not the main conversion route. May be a reduced `start-here`. Confirm rather than design if so. | Low |

## B. Components

### B1. Growth Pressure Map (the important one)

`06-signature-method.md` says this "should become a recognisable Orange Jelly diagnostic asset", and
the website blueprint asks for "a visual Growth Pressure Map" and "a problem selector that reveals
connected causes". There is no design for it anywhere in the handoff.

It is the one thing on the site that would be unmistakably Orange Jelly and not reproducible by a
competitor. It maps six connected areas (demand, conversion, margin, operations, experience, scale)
and shows pressure, not a generic scorecard.

Needed: static presentation version for the method and problem pages, and an interactive version a
visitor can complete. Please treat these as two related designs.

### B2. Scorecard / self-assessment

`09-search-vision.md` puts "tools and scorecards" at step 2 of the conversion ladder, between
reading an insight and seeing a case study. The site currently has an ROI calculator built for the
old pub proposition, which will be retired. Needs: question flow, progress, result state, and the
handover into a diagnostic enquiry.

### B3. Next-step / related-links module

The search strategy requires a specific chain: every article links to a problem page, every problem
page links to a case study, every case study links to the next offer. That chain needs one designed
component, not ad-hoc links, or it will not survive contact with 106 blog posts.

### B4. Site search

Live today. Needs input, results list, and a no-results state.

### B5. Mobile navigation

The Header spec covers the desktop bar in cream and orange tones and mentions a mobile-nav open
boolean, but there is no mobile drawer design. With a problem-led IA the mobile menu carries more
than it does now.

### B6. Smaller gaps

| Component | Note |
|---|---|
| Pagination | Insights listing. 106 posts and growing. |
| Empty states | Filtered insights with no matches, search with no results. |
| Loading / skeleton | Live today via `ui/skeleton`. |
| Share buttons | Article. Confirm whether the blog-article template already covers this. |
| Cookie notice | Live today. |
| Tabs | Live in two places. Confirm whether it survives the rebuild. |
| Data tables in articles | `.oj-prose` may already cover this. Please confirm rather than design. |
| Category / taxonomy colours | The blog uses a colour-coded taxonomy. Needs reconciling with a palette where orange is reserved as an action signal. |
| Seasonal calendar and playbooks band | Hospitality content features that survive the repositioning. |

## C. Decisions we need from you, not assumptions we should make

1. **Lowercase display headings.** Flagged as shipped on About and "under consideration site-wide".
   We need a yes or no, because it changes every template.
2. **Orange campaign header.** About defaults to orange. What is the rule for when a page gets the
   orange header rather than cream?
3. **Fonts.** Schibsted Grotesk is flagged as a Google Fonts substitute. Is a licensed family coming,
   or do we build on the substitute? Affects the type scale if it changes.
4. **Hospitality pages.** Confirmed staying live. Do they take the full new design system, or a
   visually distinct sector treatment inside it?
5. **Taxonomy colour.** See B6. Orange is reserved for action, so a colour-coded category system
   needs a defined palette that does not compete with it.
6. **Pricing is now settled as removed.** All work is bespoke and no prices go on the site. The
   price-free `OfferCard` is correct. Please confirm nothing else in the system assumes a price slot.

## D. Out of scope unless you say otherwise

`/availability` is a separate poll product living in the same codebase, with 21 components of its
own. It is not part of the marketing site. We assume it is out of scope for the redesign and will
keep it on its current styling.

---

## What we are doing on our side

Deleting 27 unreferenced components, collapsing an abandoned three-layer migration
(`Component` to `Adapter` to shadcn) down to one layer, and mapping the duplicate families onto your
29 components. That takes the component count from 179 to roughly 90 with no loss of capability. See
`component-audit.md`.
