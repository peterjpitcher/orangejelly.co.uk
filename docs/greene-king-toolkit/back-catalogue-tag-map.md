# Back-Catalogue Season Tag Map — Proposal for sign-off

**Status:** ✅ **Applied** (Phase 3.2, commit `6b14ba3e`) — 19 seasonal guides tagged with the two-dimension taxonomy (`seasons[]` + `occasions[]`). Evergreen/non-seasonal guides correctly left untagged (rule 1). `featuredGuides` curation: autumn done; winter follows with the Winter hub (Phase 5).
**Date:** 31 May 2026 · **Scope:** all 102 guides in `content/blog/` (README excluded), classified by 3 subagents against a strict relevance bar.

## How to read this
Each guide was tagged `spring`/`summer`/`autumn`/`winter` **only on genuine seasonal fit** (a guide may suit several), `year-round` for evergreen formats (quizzes, social, event fundamentals), or `none` for non-seasonal operational/finance/compliance guides. `hubFeature`: `yes` = a marquee headline guide for a hub, `tag` = a supporting "more for this season" link, `no` = not seasonal.

---

## Headline tally

| Bucket | ~count | Verdict |
|---|---|---|
| **Autumn** | ~11 (hub + spokes) | ✅ Hub built |
| **Winter** | ~10 (incl. a Christmas cluster) | ✅ **Earns a hub — build next** |
| **Summer** | ~3 | ⚠️ Below the bar — anchor exists, needs content |
| **Spring** | ~1 | ❌ Needs content before a hub |
| **Year-round backbone** | ~31 | Supporting links on every hub (`tag`) |
| **Non-seasonal (`none`)** | ~49 | Excluded from hubs (the relevance bar held — ~half the catalogue is correctly operational/finance) |

## What this tells us (the point of the audit)

1. **Winter/Christmas clears the "earns a hub" bar from content you already have** — `christmas-pub-promotion-ideas`, `pub-christmas-bookings-fill-december`, `pub-new-years-eve-planning-guide`, `turn-heating-costs-into-winter-wins`, plus `black-friday-pub-ideas` (gifting) and `wine-tasting-evenings-for-pubs` (party-season tastings). That's ~6 strong guides before writing a word. **This validates Phase 5 = build the Winter/Christmas hub next**, which also lines up with the Greene King Christmas toolkit.
2. **Christmas is the centrepiece, not a peer of "Winter".** There's a clear Christmas cluster (festive bookings, NYE) sitting inside a broader winter set (heating, off-season, Six Nations run-up). Recommendation: **a Winter hub with Christmas as the headline** (single hub), unless you'd rather a dedicated Christmas hub + a lighter Winter one. *(This is the design-doc §7.2 open decision — now with data.)*
3. **Summer is thin** — anchored by `summer-pub-event-ideas` + `summer-moments-simple-campaigns` (~3). Below the ≥5 bar: launch lean or commission 2–3 guides first.
4. **Spring is essentially empty** — only `pub-six-nations-rugby-marketing` (Feb–Mar) genuinely lands. A spring hub needs content first (Mother's Day, Easter, Six Nations-as-spring).
5. **~49 guides are correctly non-seasonal** (VAT, insurance, licensing, EPOS, wages, refurb, turnaround…) — they stay out of hubs.

## Proposed tag application (on sign-off)

| Group | Guides | Proposed `seasons` |
|---|---|---|
| Autumn hub + spokes | the 7 autumn guides + hub | `autumn` (wine-tasting & black-friday also `winter`) |
| Winter/Christmas | christmas-pub-promotion-ideas, pub-christmas-bookings-fill-december, pub-new-years-eve-planning-guide, turn-heating-costs-into-winter-wins | `winter` |
| Spring anchor | pub-six-nations-rugby-marketing | `spring` (+`winter` cusp) |
| Summer | summer-pub-event-ideas, summer-moments-simple-campaigns | `summer` |
| Cross-season planner | seasonal-pub-events-calendar | all four |
| Year-round backbone | ~31 evergreen (quizzes, social, pub-event-ideas, pop-ups…) | left untagged / `year-round` marker — surface as "more for this season" by category, not season tag |
| Non-seasonal | ~49 operational/finance | no tag |

## Open questions for you
1. **Winter vs Christmas** — one **Winter hub (Christmas-led)** (recommended) or a dedicated **Christmas hub + Winter hub**?
2. **Summer/Spring** — defer until content justifies (recommended: Winter next, summer/spring later), or stand up lean hubs now?
3. A few borderline calls I've defaulted: Six Nations → `spring`+`winter`; heating/energy → `winter` supporting; NYE → `winter`/occasion `new-year` (could be its own occasion). Happy to adjust.

---

## Full classification (proposed per-guide tags)

*(Three batches, alphabetical. This is the data behind the table above.)*

### Batch A

| slug | seasons | occasion | hubFeature | rationale |
| --- | --- | --- | --- | --- |
| 30-day-action-plan-stabilise-hospitality | none | - | no | Turnaround checklist, non-seasonal |
| autumn-pub-event-ideas | autumn | - | yes | Marquee autumn events pillar guide |
| autumn-rugby-nations-championship-pubs | autumn | - | yes | Headline Nov rugby autumn event |
| black-friday-pub-ideas | autumn,winter | christmas | yes | Black Friday into Christmas bookings |
| boardgame-night-101 | year-round | - | tag | Evergreen midweek social night |
| brewery-tie-improve-your-deal | none | - | no | Lease/tenancy operations guide |
| build-loyalty-scheme-fill-pub | year-round | - | tag | Evergreen loyalty/retention marketing |
| buying-a-pub-complete-guide | none | - | no | Pub ownership operations guide |
| cash-bingo-101 | year-round | - | tag | Evergreen midweek gaming night |
| cash-flow-crisis-breaking-cycle | none | - | no | Finance/cash flow, non-seasonal |
| cashflow-fixes-when-trade-drops | none | - | no | Finance triage, non-seasonal |
| cask-ale-week-pub-guide | autumn | - | yes | Cask Ale Week is autumn event |
| cellar-management-beer-quality-guide | none | - | no | Cellar operations, non-seasonal |
| christmas-pub-promotion-ideas | winter,autumn | christmas | yes | Marquee Christmas planning guide |
| community-outreach-reintroduce-pub | year-round | - | tag | Evergreen community marketing |
| compete-with-wetherspoons | none | - | no | Competition strategy, non-seasonal |
| content-marketing-ideas-pubs | year-round | - | tag | Evergreen social content plan |
| delivery-click-collect-without-harm | none | - | no | Operations/systems, non-seasonal |
| does-your-pub-need-a-website | none | - | no | Website/SEO marketing, non-seasonal |
| double-drinks-profit-without-selling-more | none | - | no | Drinks margin strategy, non-seasonal |
| email-marketing-pub-retention | year-round | - | tag | Evergreen email retention marketing |
| energy-bill-shock-cut-venue-costs | winter | - | tag | Energy costs peak in winter |
| epos-data-revenue-comeback | none | - | no | EPOS data/analytics, non-seasonal |
| facebook-marketing-local-pubs | year-round | - | tag | Evergreen social media marketing |
| family-craft-hour-101 | year-round | - | tag | Evergreen Sunday family event |
| fill-empty-pub-tables | year-round | - | tag | Evergreen footfall fundamentals |
| food-allergies-gdpr-compliance | none | - | no | Compliance/legal, non-seasonal |
| food-hygiene-rating-five-star-guide | none | - | no | Compliance/hygiene, non-seasonal |
| google-business-profile-pub-guide | none | - | no | Local SEO marketing, non-seasonal |
| how-much-profit-does-a-pub-make | none | - | no | Pub finance benchmarks, non-seasonal |
| how-to-attract-families-to-your-pub | year-round | - | tag | Evergreen family footfall events |
| how-to-respond-bad-pub-reviews | none | - | no | Reputation management, non-seasonal |
| how-to-run-successful-pub-events | year-round | - | tag | Evergreen event-running fundamentals |
| instagram-marketing-for-pubs | year-round | - | tag | Evergreen social media marketing |

### Batch B

| slug | seasons | occasion | hubFeature | rationale |
| --- | --- | --- | --- | --- |
| karaoke-night-101 | year-round | - | no | Evergreen weekly entertainment format |
| kitchen-nightmares-chef-quits | none | - | no | Operational crisis, not seasonal |
| live-music-events-for-pubs | year-round | - | no | Evergreen events fundamentals |
| low-budget-pub-marketing-ideas | year-round | - | no | Evergreen marketing fundamentals |
| low-cost-decor-refreshes-new-improved | none | - | no | Operational refurb, not seasonal |
| macmillan-coffee-morning-pub-guide | autumn | - | yes | Macmillan morning is autumn fixture |
| menu-engineering-lift-average-spend | none | - | no | Operational revenue tactic, evergreen |
| midweek-pub-offers-that-work | year-round | - | no | Evergreen midweek trade fundamentals |
| music-bingo-101 | year-round | - | no | Evergreen weekly entertainment format |
| national-drinks-days-pub-guide | autumn | - | yes | Explicitly autumn drinks activations |
| nobody-books-tables-anymore | none | - | no | Operational table management |
| partnering-local-brands-share-marketing | year-round | - | no | Evergreen marketing partnerships |
| pop-up-events-for-pubs | year-round | - | tag | Evergreen events, fills quiet nights |
| premium-pub-positioning | none | - | no | Operational positioning strategy |
| profitable-pub-food-menu-ideas | none | - | no | Operational menu/food profitability |
| prs-ppl-music-licensing-pubs | none | - | no | Compliance/licensing, not seasonal |
| pub-accessibility-welcoming-guide | none | - | no | Operational accessibility/compliance |
| pub-business-plan-template-guide | none | - | no | Finance/operations, not seasonal |
| pub-chalkboard-a-board-ideas | year-round | - | no | Evergreen marketing tactic |
| pub-christmas-bookings-fill-december | winter | christmas | yes | Marquee Christmas bookings guide |
| pub-differentiation-strategies | none | - | no | Operational positioning strategy |
| pub-drinks-menu-design-guide | none | - | no | Operational drinks menu design |
| pub-empty-tuesday-nights | year-round | - | no | Evergreen midweek trade fix |
| pub-epos-system-guide | none | - | no | EPOS/operations, not seasonal |
| pub-event-ideas | year-round | - | tag | Evergreen year-round events index |
| pub-event-template-profit-nights | year-round | - | tag | Evergreen reusable event blueprint |
| pub-halloween-bonfire-night-events | autumn | halloween | yes | Marquee Halloween/Bonfire autumn guide |
| pub-health-check-essential-fundamentals-licensee-success | none | - | no | Operational fundamentals, evergreen |
| pub-health-safety-checklist | none | - | no | Compliance/health-safety, not seasonal |
| pub-insurance-cover-guide | none | - | no | Insurance/finance, not seasonal |
| pub-licensing-premises-personal-licence-guide | none | - | no | Licensing/compliance, not seasonal |
| pub-marketing-plan-2026-monthly-guide | year-round | - | tag | Evergreen year-round marketing calendar |
| pub-new-years-eve-planning-guide | winter | new-year | yes | Marquee New Year's Eve guide |
| pub-recruitment-hiring-bar-staff | none | - | no | Recruitment/people, not seasonal |

### Batch C

| slug | seasons | occasion | hubFeature | rationale |
|------|---------|----------|------------|-----------|
| pub-refurbishment-on-budget | none | - | no | Operational refurb, non-seasonal |
| pub-six-nations-rugby-marketing | winter | - | yes | Six Nations rugby Feb–Mar |
| pub-toilet-refurbishment-budget-guide | none | - | no | Operational refurb, non-seasonal |
| pub-vat-accounting-guide | none | - | no | Finance/VAT, non-seasonal |
| pub-wages-labour-costs-guide | none | - | no | Wages/labour, non-seasonal |
| quiet-monday-night-promotions | year-round | - | tag | Midweek footfall, any season |
| quiz-night-101 | year-round | - | tag | Evergreen quiz fundamentals |
| quiz-night-ideas | year-round | - | tag | Evergreen quiz formats |
| reboot-pub-atmosphere-on-budget | year-round | - | tag | Atmosphere, any time |
| recession-proof-pub-strategies | none | - | no | Finance/survival, non-seasonal |
| rent-supplier-negotiations-cash-tight | none | - | no | Finance/negotiation, non-seasonal |
| rescue-your-margins-drinks-mix | none | - | no | Margins/drinks mix, non-seasonal |
| restart-quiz-music-sport-roi | year-round | - | tag | Events relaunch, any season |
| revenue-levers-struggling-pubs | none | - | no | Turnaround/finance, non-seasonal |
| seasonal-pub-events-calendar | spring, summer, autumn, winter | - | yes | Year-round seasonal event planner |
| sober-october-low-no-alcohol-pubs | autumn | - | yes | Sober October autumn moment |
| social-media-strategy-for-pubs | year-round | - | tag | Evergreen social strategy |
| social-media-tactics-footfall-seven-days | year-round | - | tag | Evergreen social sprint |
| staff-motivation-hacks-no-pay-rise | none | - | no | HR/people, non-seasonal |
| summer-moments-simple-campaigns | summer | - | yes | Summer campaign idea bank |
| summer-pub-event-ideas | summer | - | yes | Summer event ideas, costed |
| survive-off-season-revenue-packages | autumn, winter | - | tag | Off/shoulder-season packages |
| terrible-online-reviews-damage-control | none | - | no | Reputation mgmt, non-seasonal |
| theme-hour-power-hour | year-round | - | tag | Saturday promo, any season |
| turn-heating-costs-into-winter-wins | winter | - | yes | Winter cold-weather revenue |
| turnaround-playbook-independent-bars | none | - | no | Turnaround strategy, non-seasonal |
| upselling-secrets-training-scripts | year-round | - | tag | Evergreen upselling training |
| village-pub-dying-village-survival | none | - | no | Rural survival strategy, non-seasonal |
| wet-led-vs-food-led-pubs | none | - | no | Revenue model, non-seasonal |
| why-is-my-pub-empty | none | - | no | Footfall diagnosis, non-seasonal |
| win-back-locals-after-slow-trade | year-round | - | tag | Reconnection plan, any season |
| wine-tasting-evenings-for-pubs | autumn, winter | - | tag | Wine tasting suits cooler months |
| young-people-wont-come-to-your-pub | none | - | no | Audience strategy, non-seasonal |
| zero-waste-stock-management-pubs | none | - | no | Stock control, non-seasonal |
