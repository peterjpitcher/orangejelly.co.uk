# Orange Jelly Commercial Website Transformation — Design Spec v2

**Date:** 2026-04-05
**Status:** Approved (v2 — post QA review)
**Author:** Claude (with Peter Pitcher)
**QA Review:** Dual-engine (Claude + Codex GPT-5.4), 3 specialists, 32 findings addressed

---

## 1. Project Summary

Replace Orange Jelly's current hourly service-led website with a package-led commercial model. Four clear packages replace all existing offer structures. The transformation must preserve SEO value from 74 blog posts and existing keyword rankings while creating a single, coherent buying experience.

### Success Criteria

- A prospect can understand the offer within 30 seconds
- A prospect can tell what is and is not included in each package
- Growth Partner feels like the strongest ongoing option
- Turnaround Intensive feels premium and credible
- Payment plan messaging is visible and conversion-friendly — including on package cards
- The site launches with one coherent offer model — no mixed commercial environment at any point during rollout
- Claims are governed from a single source of truth
- Case studies are structured content, not just metric claims
- Enquiry quality improves (prospects reference specific packages)
- No SEO value lost from the migration (all high-value URLs preserved)

---

## 2. Approach

**Incremental Development, Atomic Public Launch** — develop in ordered phases but deploy Phases 2-4 together as a single public release. The brief's Section 3.1 requires full replacement with no mixed commercial environment. Therefore:

- **Phase 1 (Foundation):** Build everything behind the scenes. No public changes.
- **Phases 2-4 (Launch):** Deploy together as one atomic release. New pages, rewrites, redirects, and navigation swap all go live simultaneously. Develop on a feature branch; merge once all three phases pass QA.
- **Phase 5 (Polish):** CTA sweep across blog and regional pages. The site already presents a coherent package model at this point — Phase 5 removes lingering hourly references from deeper content.

This maps to the brief's 7-phase model as follows:

| Brief Phase | Design Phase | Coverage |
|-------------|-------------|---------|
| 1. Discovery | Pre-Phase 1 | Current-state audit (Appendix A), replacement map (Appendix B) |
| 2. Architecture & CMS | Phase 1 | Sitemap, content types, claims governance, JSON schemas |
| 3. Wireframes & page logic | Phase 1 | Page structures (Section 6), component specs (Section 7) |
| 4. Content mapping | Phase 1 | Replacement map (Appendix B), blog CTA categorisation (Section 8) |
| 5. Build | Phase 1 (components) + Phases 2-4 (pages) | All components, pages, and data files |
| 6. Migration & QA | Phase 4 | Redirects, sitemap, pricing sweep, mobile QA |
| 7. Launch | Phases 2-4 deploy together | Single atomic public launch |

---

## 3. New Package Model

### Package 1: Growth Fix

- **Price:** From £375 + VAT
- **Hours:** 5
- **Type:** One-off
- **Best for:** One clear bottleneck — quiet midweek trade, weak event turnout, confusing offer communication, low local visibility, one urgent marketing issue
- **Purpose:** Solve one problem, deliver one clear win, low-friction entry point

### Package 2: Momentum Month

- **Price:** £900 + VAT per month
- **Hours:** 12
- **Type:** Monthly retainer
- **Best for:** Building consistency, improving local marketing rhythm, supporting one main monthly priority, staying focused without overcommitting
- **Purpose:** Practical monthly plan, strategy with light execution, entry retainer without scope bloat

### Package 3: Growth Partner (Most Popular)

- **Price:** £1,800 + VAT per month
- **Hours:** 24
- **Type:** Monthly retainer
- **Best for:** Venues with multiple growth challenges, event-led growth, bookings + footfall + repeat visits together, strategic direction plus hands-on support
- **Purpose:** Strongest ongoing package, best-fit option, direction + accountability + implementation

### Package 4: Turnaround Intensive (Premium)

- **Price:** To be validated in discovery (likely higher than original estimate due to website rebuild inclusion). Display as "Pricing confirmed after diagnostic" until finalised.
- **Price handling:** `price.amount: null`, `price.display: "Pricing confirmed after diagnostic"`. Components must handle null amount gracefully — no sort/comparison logic should break.
- **Type:** 30-day sprint
- **Best for:** Venues needing a complete commercial reset
- **Includes:** Deep diagnostic, offer/message reset, event/promotional reset, local visibility reset, priority social and paid actions, lean website rebuild, tighter founder involvement, stabilisation playbooks
- **Purpose:** Premium anchor, serious intervention offer, makes Growth Partner feel like the sensible middle choice

---

## 4. Package Inclusion Logic

Every package communicates four layers:

### Layer Definitions

| Layer | Meaning | Visual Treatment |
|-------|---------|-----------------|
| **Included** | Client definitely gets this | Bold/check — primary list |
| **Light-touch** | OJ guides on this but doesn't manage at full depth | Lighter text — secondary list |
| **Add-on** | Can be bought separately where needed | "Available as add-on" — tertiary list |
| **Not included** | Outside scope unless separately agreed | Non-defensive framing — "To keep this focused..." |

### Support Level Enum (TypeScript)

```typescript
type SupportLevel = 'included' | 'light-touch' | 'add-on' | 'not-included';
```

This enum is used in `capabilities.json` `defaultSupportLevel` and in the `PackageComparison` component.

### Presentation: Progressive Disclosure

- **Package cards** (Ways to Work page): Show name, price, hours, "best for" bullets, payment plan line, CTA. No exclusion lists.
- **Package detail pages**: Show all four layers. Confident buyers convert from cards. Cautious buyers find reassurance on detail pages.
- **Capabilities page**: Shows the full digital stack with "support depth varies by package" — links to Ways to Work.

### Growth Fix — Inclusions

- **Included:** Diagnosis of main issue, one focused commercial priority, one clear action plan, messaging/offer refinement, one capability-led intervention (local visibility fix, campaign direction, event push, or booking-flow review)
- **Light-touch:** Organic social direction, local visibility guidance, basic paid social advice, basic website/booking journey review
- **Add-on:** Content production, posting/scheduling, paid social execution, community management, build work
- **Not included:** Ongoing support, multi-channel campaign management, filming, large content batches, website rebuild or development

### Momentum Month — Inclusions

- **Included:** One monthly growth objective, 30-day momentum plan, weekly priority setting, one main campaign/offer/event focus, organic social direction, content themes and caption guidance, local visibility routine, one light paid social campaign setup/optimisation, simple reporting, light website and booking journey recommendations
- **Light-touch:** Limited content shaping/repurposing, light paid social support, light tool/tracking guidance
- **Add-on:** On-site content capture, large edit batches, daily posting, community management, heavier paid social management, web build or technical implementation
- **Not included:** Unlimited content creation, full social management, website rebuild, deep CRM/automation work

### Growth Partner — Inclusions

- **Included:** 30/60/90-day momentum plan, ongoing commercial prioritisation, event and offer marketing support, strong organic social planning, campaign structure and creative direction, local visibility actions, website and booking journey optimisation guidance, moderate paid social support, reporting tied to commercial outcomes, playbooks and internal clarity where needed
- **Light-touch:** Moderate content shaping/repurposing, moderate tools support, moderate paid social management, moderate website improvement guidance
- **Add-on:** Filming days, large content production, full-time social management, advanced web builds, CRM setup, automation builds, extensive ad management across multiple campaigns
- **Not included:** Unlimited creative production, ongoing content factory-style output, full redesign/rebuild work, complex development as standard

### Turnaround Intensive — Inclusions

- **Included:** Deep diagnostic and reset plan, offer and message reset, event/promotional reset, local visibility reset, priority social and paid actions, website and booking journey reset, lean website rebuild, tighter founder involvement, reporting against immediate commercial goals, stabilisation playbooks
- **Light-touch:** Additional content shaping during reset, limited urgent asset repurposing, limited tools simplification where it supports the turnaround
- **Add-on:** Major content shoots, advanced design systems, bespoke development, ongoing management after the reset, large content calendars after the reset window
- **Not included:** Unlimited custom design/development, open-ended website scope, indefinite monthly delivery beyond the agreed sprint, full rebrand unless separately scoped

### Content Creation Boundaries

The site must clearly communicate three layers of content involvement:

1. **Strategy layer (included in packages):** Campaign direction, content themes, shot lists, creative prompts, caption guidance, review of client-shot content, content priorities tied to commercial outcomes
2. **Light production layer (limited inclusion where listed):** Small amounts of editing, repurposing client-shot assets, limited content shaping within package hours
3. **Production layer (always separately controlled):** Filming, photography, heavy editing, large asset batches, daily posting, scheduling, community management

A dedicated `<ContentBoundaries>` component on the capabilities page renders this three-layer model visually — strategy (green), light production (amber), production (red/separate).

---

## 5. Site Architecture

### New Sitemap

```
/                                         Homepage (SEO: "hospitality marketing" 500/mo)
/ways-to-work                             Package comparison + payment plans
/ways-to-work/growth-fix                  Package 1 detail
/ways-to-work/momentum-month              Package 2 detail
/ways-to-work/growth-partner              Package 3 detail (Most Popular)
/ways-to-work/turnaround-intensive        Package 4 detail (SEO: "pub transformation" 50/mo)
/capabilities                             Digital capability stack (SEO: recaptures "social media for pubs" 50/mo, "pub advertising" 50/mo)
/pub-marketing-agency                     Why choose OJ (SEO: "hospitality marketing agency" 500/mo)
/about                                    Team + credentials (SEO: "hospitality consultant" 500/mo)
/results                                  Case studies + proof (claims-governed)
/contact                                  Package-aware form + WhatsApp
/pub-marketing                            SEO pillar hub (SEO: "pub marketing" 50/mo)
/pub-marketing-[county] x8                Regional pages (SEO: 10-100/mo each)
/licensees-guide                          Blog hub
/licensees-guide/[slug] x74              Blog posts (SEO: 100K+ combined)
/licensees-guide/category/[cat]           Category archives
/fix-my-pub                               Routes to Turnaround Intensive
/empty-pub-solutions                      Routes to Growth Fix / Growth Partner
/pub-rescue                               Routes to Turnaround Intensive (SEO: "pub rescue package" 50/mo) — see Migration Note 1
/quiet-midweek-solutions                  Routes to Growth Fix
/compete-with-pub-chains                  Routes to Growth Fix / Growth Partner
/pub-marketing-no-budget                  Routes to Growth Fix (from £375)
```

**Migration Note 1 — /pub-rescue:** An existing 301 redirect in `next.config.js` sends `/pub-rescue` to `/fix-my-pub`. This must be removed to restore `/pub-rescue` as a standalone page. Risk: Google may take weeks to re-index after a 301 reversal. Mitigation: submit the URL for re-indexing via GSC immediately after launch. Alternatively, if the SEO risk is deemed too high, merge the "pub rescue package" (50/mo) keyword target into `/fix-my-pub` and keep the redirect.

### Navigation

**Primary:** Home | Ways to Work | Capabilities | Results | Guides | About | Contact

### Footer

```json
{
  "packages": [
    { "label": "Growth Fix", "href": "/ways-to-work/growth-fix" },
    { "label": "Momentum Month", "href": "/ways-to-work/momentum-month" },
    { "label": "Growth Partner", "href": "/ways-to-work/growth-partner" },
    { "label": "Turnaround Intensive", "href": "/ways-to-work/turnaround-intensive" }
  ],
  "capabilities": [
    { "label": "Growth Strategy", "href": "/capabilities" },
    { "label": "Event Marketing", "href": "/capabilities" },
    { "label": "Social Media", "href": "/capabilities" },
    { "label": "Paid Social", "href": "/capabilities" },
    { "label": "Local Visibility", "href": "/capabilities" }
  ],
  "resources": [
    { "label": "Licensee's Guide", "href": "/licensees-guide" },
    { "label": "Results", "href": "/results" },
    { "label": "Pub Marketing", "href": "/pub-marketing" }
  ],
  "company": [
    { "label": "About", "href": "/about" },
    { "label": "Contact", "href": "/contact" },
    { "label": "The Anchor", "href": "https://the-anchor.pub" }
  ],
  "locations": [
    { "label": "London", "href": "/pub-marketing-london" },
    { "label": "Surrey", "href": "/pub-marketing-surrey" },
    { "label": "Berkshire", "href": "/pub-marketing-berkshire" },
    { "label": "Buckinghamshire", "href": "/pub-marketing-buckinghamshire" },
    { "label": "Hampshire", "href": "/pub-marketing-hampshire" },
    { "label": "Hertfordshire", "href": "/pub-marketing-hertfordshire" },
    { "label": "Kent", "href": "/pub-marketing-kent" },
    { "label": "Oxfordshire", "href": "/pub-marketing-oxfordshire" }
  ]
}
```

### Navigation JSON

```json
{
  "mainMenu": [
    { "label": "Home", "href": "/" },
    { "label": "Ways to Work", "href": "/ways-to-work" },
    { "label": "Capabilities", "href": "/capabilities" },
    { "label": "Results", "href": "/results" },
    { "label": "Guides", "href": "/licensees-guide" },
    { "label": "About", "href": "/about" },
    { "label": "Contact", "href": "/contact" }
  ],
  "mobileMenu": [
    { "label": "Home", "href": "/" },
    { "label": "Ways to Work", "href": "/ways-to-work" },
    { "label": "Capabilities", "href": "/capabilities" },
    { "label": "Results", "href": "/results" },
    { "label": "Guides", "href": "/licensees-guide" },
    { "label": "About", "href": "/about" },
    { "label": "Contact", "href": "/contact" }
  ],
  "whatsappCta": {
    "enabled": true,
    "defaultMessage": "Hi Peter, I'd like to find out about your packages."
  }
}
```

---

## 6. Page Structures

### Homepage (`/`)

| Section | Purpose | Data Source |
|---------|---------|------------|
| Hero | Introduce OJ + package-led value prop. CTA: "See Our Packages" → /ways-to-work. Secondary: WhatsApp. | Static + packages.json (starting price) |
| Proof strip | 4-5 governed metrics | claims.json (see ProofStrip component spec) |
| Where growth gets stuck | 4-6 problem cards → route to packages (not standalone problem pages) | Static |
| Package summary | 4 cards — Growth Partner highlighted. Payment plan line on each card. | packages.json |
| Capability summary | Icon grid of 10 capabilities | capabilities.json |
| Why OJ is different | Founder-led, tested at The Anchor, action-first | Static |
| Results | 2-3 case study cards | case-studies.json |
| Final CTA | WhatsApp primary + form secondary + payment plan note | packages.json + constants.ts |

**SEO metadata:**
- Title: "Hospitality Marketing That Fills Seats | Orange Jelly"
- Description: "Hospitality marketing packages from a working pub. Strategy, events, social, local visibility — tested at The Anchor, delivered for your venue. Packages from £375 + VAT."
- Keywords: hospitality marketing, hospitality marketing ideas, pub marketing

### Ways to Work (`/ways-to-work`)

| Section | Purpose | Data Source |
|---------|---------|------------|
| Hero | "Clear packages. Honest pricing. Real hospitality expertise." | Static |
| Package cards | 4 across, Growth Partner highlighted, payment plan line on each | packages.json |
| Comparison | Key differentiators per package — progressive labels (see PackageComparison spec) | packages.json + capabilities.json |
| Add-ons | What can be bought separately | add-ons.json |
| Payment plans | Dedicated section: "Flexible payment options available. Ask Peter about spreading the cost." | packages.json |
| FAQs | 6-8 questions | Static |
| CTA | "Not sure which? Message Peter" — WhatsApp + form | constants.ts |

**SEO metadata:**
- Title: "Pub Marketing Packages — Clear Pricing, Real Expertise | Orange Jelly"
- Description: "Four clear packages for pub and hospitality marketing. From a one-off Growth Fix to ongoing Growth Partner support. Payment plans available. No hidden fees."
- Schema: `ItemList` with 4 `ListItem` entries linking to package detail pages

### Package Detail Pages (`/ways-to-work/[slug]`)

Shared template, data-driven from packages.json:

| Section | Purpose |
|---------|---------|
| Hero | Name, price, hours, one-liner, best-for bullets, payment plan line, CTA |
| Included | Full list of what's in the package |
| Light-touch | What OJ guides on but doesn't fully manage |
| Add-ons | What can be added separately |
| Not included | Non-defensive: "To keep this focused..." |
| How it works | 3-4 step process specific to this package (see process content below) |
| Proof | 1-2 relevant case studies from case-studies.json |
| Payment plan | "Payment plans available for this package" |
| CTA | WhatsApp with package context + form with package pre-selected |

**Turnaround Intensive additional section:** Website rebuild scope (included + separate scope).

**SEO metadata per page:**
- `/ways-to-work/growth-fix`: "Growth Fix — Solve One Pub Problem Fast | From £375 + VAT"
- `/ways-to-work/momentum-month`: "Momentum Month — Ongoing Pub Marketing Support | £900/mo + VAT"
- `/ways-to-work/growth-partner`: "Growth Partner — Full Pub Marketing Support | Orange Jelly"
- `/ways-to-work/turnaround-intensive`: "Pub Turnaround Intensive — 30-Day Commercial Reset | Orange Jelly" (targets "pub transformation" 50/mo)

**Schema:** `Service` schema on each package detail page. `BreadcrumbList` on all.

**Process content per package:**

Growth Fix:
1. "We listen" — 30-min diagnostic call to understand the problem
2. "We diagnose" — identify the one priority that will move the needle
3. "We deliver" — action plan + one focused intervention within 5 hours
4. "You decide" — results speak; step up to Momentum Month if you want ongoing support

Momentum Month:
1. "Monthly kickoff" — set the month's one main objective
2. "Weekly priorities" — clear tasks tied to the objective
3. "Hands-on support" — we work alongside you on the priority
4. "Monthly review" — what worked, what's next, adjust the plan

Growth Partner:
1. "90-day roadmap" — map the full growth plan across 3 months
2. "Weekly execution" — priorities, campaigns, events, content direction
3. "Ongoing accountability" — we track what matters (bookings, footfall, revenue)
4. "Evolve and grow" — adjust strategy as your venue develops

Turnaround Intensive:
1. "Deep diagnostic" — 2-3 day assessment of your venue, offer, and market
2. "Reset plan" — complete commercial reset strategy with Peter
3. "30-day sprint" — intensive implementation including lean website rebuild
4. "Handover" — stabilisation playbooks, clear next steps, optional Growth Partner transition

### Capabilities (`/capabilities`)

| Section | Purpose | Data Source |
|---------|---------|------------|
| Hero | "Everything we can help with" | Static |
| Capability grid | 10 capabilities with description and support-level-per-package indicator | capabilities.json |
| Support depth note | "Support depth varies by package" | Static |
| Content creation explainer | Strategy vs light production vs production — ContentBoundaries component | Static |
| CTA | Route to Ways to Work | Static |

**SEO metadata:**
- Title: "Pub Marketing Capabilities — Social Media, Events, SEO & More | Orange Jelly"
- Description: "Full-stack pub marketing support: social media, events, paid ads, local visibility, content, website optimisation, and more. See what's included in each package."
- Keywords: social media for pubs, pub advertising, hospitality social media, pub marketing services
- Schema: `BreadcrumbList`

**Internal links to /capabilities must be added from:**
- Blog CTA rotation (see Section 8)
- `/pub-marketing` hub page
- Homepage capability summary section

### Problem Pages (6 pages — rewritten in place)

Each keeps its current URL and keyword target. Content rewritten to:
1. Acknowledge the problem (empathy — keep current strength)
2. Present the relevant package as the solution
3. Show proof from case-studies.json
4. CTA routes to the specific package detail page

| Page | Routes To | Transitional Copy Note |
|------|-----------|----------------------|
| `/fix-my-pub` | Turnaround Intensive | — |
| `/empty-pub-solutions` | Growth Fix or Growth Partner | — |
| `/pub-rescue` | Turnaround Intensive | See Migration Note 1 |
| `/quiet-midweek-solutions` | Growth Fix | — |
| `/compete-with-pub-chains` | Growth Fix or Growth Partner | — |
| `/pub-marketing-no-budget` | Growth Fix (from £375) | "Even with a tight budget, a focused Growth Fix can deliver a clear win from just £375 + VAT" |

### Pub Marketing Agency (`/pub-marketing-agency` — rewritten in place)

Reframed as "Why Choose Orange Jelly as Your Hospitality Marketing Partner." Preserves "hospitality marketing agency" (500/mo) keyword targeting. Content positions OJ's credentials, founder-led model, proof, then routes to `/ways-to-work`.

### Results (`/results` — rewritten in place)

Replace all hardcoded metrics with `<Claim>` components. Add case study cards from `case-studies.json`. Add package context ("This is the kind of result Growth Partner delivers"). Keep as primary trust page.

### Contact (`/contact` — updated)

- Package pre-select dropdown populated from `packages.json`
- URL format for pre-selection: `/contact?package=growth-partner`
- WhatsApp messages include package context from `packages.json` `ctaWhatsApp` field
- Payment plan mention in form intro: "Payment plans available — ask Peter"
- Form fields: name, venue name, package interest (dropdown, optional), message, phone (optional)

### Blog Posts (74 — CTA update only)

No content changes. The `BlogPost.tsx` component's CTA section is updated once (component-level change, not per-post):

**Blog CTA category mapping:**

| Existing Category | CTA Type | CTA Copy | CTA Link |
|-------------------|----------|----------|----------|
| toolkits, events-promotions | Consumer | "Running a pub? See how we help licensees grow revenue" | /ways-to-work |
| customer-acquisition, empty-pub-solutions, turnaround, community | Operator informational | "Need help putting this into practice?" | /ways-to-work |
| food-drink, analytics, sales, communications, competition, people | Operator commercial | "We do this for pubs every week. See our packages" | /ways-to-work |

**Important:** The existing "Related services" section in `BlogPost.tsx` hardlinks to `/services/instagram-services-for-pubs`, `/services/facebook-services-for-pubs`, and `/services/paid-social-for-pubs`. These links must be updated to `/capabilities` in Phase 2-4 (the atomic launch), NOT deferred to Phase 5.

### Regional Pages (8 — CTA update only)

Update pricing references and CTAs to route to packages. Add cross-links between regions. No URL or keyword changes.

---

## 7. Data Model

### content/data/packages.json

```json
[
  {
    "id": "growth-fix",
    "name": "Growth Fix",
    "slug": "growth-fix",
    "shortDescription": "A focused package for one clear bottleneck",
    "price": {
      "amount": 375,
      "display": "From £375 + VAT",
      "type": "one-off"
    },
    "hours": "5 hours",
    "badge": null,
    "bestFor": [
      "Quiet midweek trade",
      "Weak event turnout",
      "Confusing offer communication",
      "Low local visibility",
      "One urgent marketing issue"
    ],
    "included": [
      "Diagnosis of main issue",
      "One focused commercial priority",
      "One clear action plan",
      "Messaging and offer refinement",
      "One capability-led intervention"
    ],
    "lightTouch": [
      "Organic social direction",
      "Local visibility guidance",
      "Basic paid social advice",
      "Basic website and booking journey review"
    ],
    "addOns": [
      "content-production",
      "posting-scheduling",
      "paid-social-execution",
      "community-management",
      "build-work"
    ],
    "notIncluded": [
      "Ongoing support",
      "Multi-channel campaign management",
      "Filming",
      "Large content batches",
      "Website rebuild or development"
    ],
    "process": [
      { "step": 1, "title": "We listen", "description": "30-min diagnostic call to understand the problem" },
      { "step": 2, "title": "We diagnose", "description": "Identify the one priority that will move the needle" },
      { "step": 3, "title": "We deliver", "description": "Action plan plus one focused intervention within 5 hours" },
      { "step": 4, "title": "You decide", "description": "Results speak — step up to Momentum Month if you want ongoing support" }
    ],
    "paymentPlan": {
      "available": true,
      "copy": "Payment plans available",
      "cardCopy": "Payment plans available"
    },
    "ctaWhatsApp": "Hi Peter, I'm interested in the Growth Fix package.",
    "relatedProof": ["food-gp-growth", "quiz-regulars"],
    "relatedCaseStudies": ["anchor-midweek-turnaround"],
    "sortOrder": 1,
    "visible": true
  }
]
```

Note: `addOns` references IDs from `add-ons.json`. `relatedProof` references IDs from `claims.json`. `relatedCaseStudies` references IDs from `case-studies.json`. `price.amount` is `null` for Turnaround Intensive.

### content/data/capabilities.json

```json
[
  {
    "id": "growth-strategy",
    "name": "Growth Strategy & Momentum Planning",
    "shortDescription": "Commercial direction, prioritisation, 30/60/90-day plans",
    "icon": "target",
    "defaultSupportLevel": {
      "growth-fix": "included",
      "momentum-month": "included",
      "growth-partner": "included",
      "turnaround-intensive": "included"
    },
    "exampleOutcomes": [
      "Clear 90-day growth roadmap",
      "Weekly priorities that drive revenue"
    ],
    "sortOrder": 1
  },
  {
    "id": "event-marketing",
    "name": "Event & Offer Marketing",
    "shortDescription": "Event formats, promotional campaigns, seasonal calendars",
    "icon": "calendar",
    "defaultSupportLevel": {
      "growth-fix": "included",
      "momentum-month": "included",
      "growth-partner": "included",
      "turnaround-intensive": "included"
    },
    "exampleOutcomes": [
      "Profitable quiz night attracting 25-35 regulars",
      "Seasonal event calendar with clear ROI"
    ],
    "sortOrder": 2
  },
  {
    "id": "organic-social",
    "name": "Organic Social Direction",
    "shortDescription": "Content themes, posting strategy, engagement approach",
    "icon": "share-2",
    "defaultSupportLevel": {
      "growth-fix": "light-touch",
      "momentum-month": "included",
      "growth-partner": "included",
      "turnaround-intensive": "included"
    },
    "exampleOutcomes": [
      "60-70K monthly social media views",
      "Consistent posting rhythm that drives footfall"
    ],
    "sortOrder": 3
  },
  {
    "id": "paid-social",
    "name": "Paid Social",
    "shortDescription": "Meta ads, campaign setup, targeting, optimisation",
    "icon": "trending-up",
    "defaultSupportLevel": {
      "growth-fix": "light-touch",
      "momentum-month": "light-touch",
      "growth-partner": "included",
      "turnaround-intensive": "included"
    },
    "exampleOutcomes": [
      "Targeted ads filling quiet midweek nights",
      "Cost-effective local reach campaigns"
    ],
    "sortOrder": 4
  },
  {
    "id": "content-planning",
    "name": "Content Planning & Creative Direction",
    "shortDescription": "Campaign briefs, shot lists, creative prompts, caption guidance",
    "icon": "pen-tool",
    "defaultSupportLevel": {
      "growth-fix": "not-included",
      "momentum-month": "included",
      "growth-partner": "included",
      "turnaround-intensive": "included"
    },
    "exampleOutcomes": [
      "Clear content calendar tied to commercial priorities",
      "Creative direction that builds a recognisable brand"
    ],
    "sortOrder": 5
  },
  {
    "id": "content-production",
    "name": "Content Production",
    "shortDescription": "Filming, photography, editing, asset creation",
    "icon": "camera",
    "defaultSupportLevel": {
      "growth-fix": "add-on",
      "momentum-month": "add-on",
      "growth-partner": "add-on",
      "turnaround-intensive": "light-touch"
    },
    "exampleOutcomes": [
      "Professional-quality content from a phone",
      "Consistent visual identity across channels"
    ],
    "sortOrder": 6
  },
  {
    "id": "local-visibility",
    "name": "Local Visibility",
    "shortDescription": "Google Business Profile, local SEO, directories, reviews",
    "icon": "map-pin",
    "defaultSupportLevel": {
      "growth-fix": "light-touch",
      "momentum-month": "included",
      "growth-partner": "included",
      "turnaround-intensive": "included"
    },
    "exampleOutcomes": [
      "Top 3 Google Maps position for local searches",
      "Consistent 4.5+ star review rating"
    ],
    "sortOrder": 7
  },
  {
    "id": "website-booking",
    "name": "Website & Booking Journey Optimisation",
    "shortDescription": "Website improvements, booking flow, menu display, contact paths",
    "icon": "monitor",
    "defaultSupportLevel": {
      "growth-fix": "light-touch",
      "momentum-month": "light-touch",
      "growth-partner": "light-touch",
      "turnaround-intensive": "included"
    },
    "exampleOutcomes": [
      "Clear booking journey that converts visitors",
      "Mobile-friendly menu and contact flow"
    ],
    "sortOrder": 8
  },
  {
    "id": "tools-tracking",
    "name": "Tools, Tracking & Reporting",
    "shortDescription": "Analytics, tool simplification, commercial reporting",
    "icon": "bar-chart-2",
    "defaultSupportLevel": {
      "growth-fix": "not-included",
      "momentum-month": "light-touch",
      "growth-partner": "included",
      "turnaround-intensive": "included"
    },
    "exampleOutcomes": [
      "Simple dashboard tracking bookings and footfall",
      "Monthly report tied to commercial outcomes"
    ],
    "sortOrder": 9
  },
  {
    "id": "playbooks-standards",
    "name": "Playbooks, Standards & Team Clarity",
    "shortDescription": "SOPs, content standards, ownership clarity, team briefings",
    "icon": "book-open",
    "defaultSupportLevel": {
      "growth-fix": "not-included",
      "momentum-month": "not-included",
      "growth-partner": "included",
      "turnaround-intensive": "included"
    },
    "exampleOutcomes": [
      "Staff know exactly what good looks like",
      "Repeatable systems that work without you"
    ],
    "sortOrder": 10
  }
]
```

**Icon system:** Uses Lucide React icons (already common in Next.js projects). Icon field stores the Lucide icon name as a string.

### content/data/add-ons.json

```json
[
  {
    "id": "content-production",
    "name": "Content Production",
    "description": "Filming, photography, heavy editing, large asset batches",
    "whoFor": "Venues that need regular professional content",
    "priceNote": "Scoped separately",
    "relatedPackages": ["growth-fix", "momentum-month", "growth-partner"],
    "sortOrder": 1
  },
  {
    "id": "posting-scheduling",
    "name": "Posting & Scheduling",
    "description": "Daily posting, content scheduling, platform management",
    "whoFor": "Venues that want fully managed social feeds",
    "priceNote": "Scoped separately",
    "relatedPackages": ["growth-fix", "momentum-month"],
    "sortOrder": 2
  },
  {
    "id": "paid-social-execution",
    "name": "Paid Social Management",
    "description": "Full campaign management, budget optimisation, reporting",
    "whoFor": "Venues running significant ad spend",
    "priceNote": "Scoped separately",
    "relatedPackages": ["growth-fix", "momentum-month"],
    "sortOrder": 3
  },
  {
    "id": "community-management",
    "name": "Community Management",
    "description": "Comment responses, DM handling, review management",
    "whoFor": "Venues with active social communities",
    "priceNote": "Scoped separately",
    "relatedPackages": ["growth-fix", "momentum-month", "growth-partner"],
    "sortOrder": 4
  },
  {
    "id": "build-work",
    "name": "Web Build & Technical Work",
    "description": "Website development, booking integrations, CRM setup",
    "whoFor": "Venues needing technical implementation",
    "priceNote": "Scoped separately",
    "relatedPackages": ["growth-fix", "momentum-month", "growth-partner"],
    "sortOrder": 5
  },
  {
    "id": "filming-days",
    "name": "Filming Days",
    "description": "On-site professional filming and photography sessions",
    "whoFor": "Venues building a content library",
    "priceNote": "Scoped separately",
    "relatedPackages": ["growth-partner"],
    "sortOrder": 6
  },
  {
    "id": "automation-crm",
    "name": "CRM & Automation",
    "description": "CRM setup, email automation, booking system integration",
    "whoFor": "Venues ready to systematise customer relationships",
    "priceNote": "Scoped separately",
    "relatedPackages": ["growth-partner"],
    "sortOrder": 7
  }
]
```

### content/data/claims.json

```json
{
  "claims": [
    {
      "id": "food-gp-growth",
      "metric": "58% → 71%",
      "context": "Food gross profit growth at The Anchor",
      "displayShort": "Food GP: 58% → 71%",
      "displayLong": "Grew food gross profit from 58% to 71% at The Anchor",
      "source": "The Anchor trading records",
      "lastVerified": "2026-03-01",
      "category": "revenue",
      "relatedPackages": ["growth-partner", "turnaround-intensive"],
      "relatedCapabilities": ["growth-strategy"]
    },
    {
      "id": "quiz-regulars",
      "metric": "25-35",
      "context": "Weekly quiz night regulars (up from 20)",
      "displayShort": "25-35 quiz regulars",
      "displayLong": "Built quiz night to 25-35 regulars, up from 20",
      "source": "The Anchor weekly counts",
      "lastVerified": "2026-03-01",
      "category": "footfall",
      "relatedPackages": ["momentum-month", "growth-partner"],
      "relatedCapabilities": ["event-marketing"]
    },
    {
      "id": "social-views",
      "metric": "60-70K",
      "context": "Monthly social media views",
      "displayShort": "60-70K monthly social views",
      "displayLong": "Generating 60,000 to 70,000 monthly social media views",
      "source": "Meta Business Suite analytics",
      "lastVerified": "2026-03-01",
      "category": "visibility",
      "relatedPackages": ["momentum-month", "growth-partner"],
      "relatedCapabilities": ["organic-social"]
    },
    {
      "id": "contact-database",
      "metric": "300",
      "context": "Customer contacts in database",
      "displayShort": "300 contacts",
      "displayLong": "Built a database of 300 customer contacts",
      "source": "The Anchor CRM",
      "lastVerified": "2026-03-01",
      "category": "retention",
      "relatedPackages": ["growth-partner"],
      "relatedCapabilities": ["tools-tracking"]
    },
    {
      "id": "value-added",
      "metric": "£75-100K",
      "context": "Total value added to The Anchor",
      "displayShort": "£75-100K value added",
      "displayLong": "Added £75,000 to £100,000 in value to The Anchor",
      "source": "The Anchor financial review",
      "lastVerified": "2026-03-01",
      "category": "revenue",
      "relatedPackages": ["growth-partner", "turnaround-intensive"],
      "relatedCapabilities": ["growth-strategy"]
    },
    {
      "id": "sunday-margin-growth",
      "metric": "£250/week",
      "context": "Weekly margin gains from Sunday operations improvement",
      "displayShort": "£250/week Sunday margin growth",
      "displayLong": "Unlocking £250 per week through improved Sunday operations",
      "source": "The Anchor weekly P&L",
      "lastVerified": "2026-03-01",
      "category": "efficiency",
      "relatedPackages": ["growth-partner", "turnaround-intensive"],
      "relatedCapabilities": ["growth-strategy"]
    },
    {
      "id": "tasting-retention",
      "metric": "85%",
      "context": "Tasting event customer retention rate",
      "displayShort": "85% tasting retention",
      "displayLong": "85% of tasting event attendees return within 30 days",
      "source": "The Anchor booking records",
      "lastVerified": "2026-03-01",
      "category": "retention",
      "relatedPackages": ["momentum-month", "growth-partner"],
      "relatedCapabilities": ["event-marketing"]
    },
    {
      "id": "ai-time-reclaimed",
      "metric": "25 hours/week",
      "context": "Time reclaimed through AI workflow implementation",
      "displayShort": "25 hrs/week reclaimed with AI",
      "displayLong": "Reclaiming 25 hours per week through AI-powered workflows",
      "source": "Orange Jelly time tracking",
      "lastVerified": "2026-03-01",
      "category": "efficiency",
      "relatedPackages": ["growth-partner"],
      "relatedCapabilities": ["tools-tracking"]
    }
  ],
  "governance": {
    "reviewFrequency": "quarterly",
    "lastFullReview": "2026-03-01",
    "approvedBy": "Peter Pitcher"
  }
}
```

### content/data/case-studies.json (NEW — addresses QA finding)

```json
[
  {
    "id": "anchor-midweek-turnaround",
    "title": "How The Anchor Filled Midweek Tables",
    "challenge": "Quiet Tuesday and Wednesday nights with minimal footfall",
    "action": "Introduced quiz night format, steak night promotion, and targeted social media campaigns",
    "result": "Built quiz night to 25-35 weekly regulars, midweek covers up significantly",
    "metrics": ["quiz-regulars", "social-views"],
    "relatedPackages": ["growth-fix", "momentum-month"],
    "relatedCapabilities": ["event-marketing", "organic-social"]
  },
  {
    "id": "anchor-food-gp",
    "title": "From 58% to 71% Food Gross Profit",
    "challenge": "Food margins below industry standard, waste issues, pricing not optimised",
    "action": "Menu engineering, portion control, supplier renegotiation, waste tracking systems",
    "result": "Food GP grew from 58% to 71%, unlocking thousands per month in margin growth",
    "metrics": ["food-gp-growth", "sunday-margin-growth"],
    "relatedPackages": ["growth-partner", "turnaround-intensive"],
    "relatedCapabilities": ["growth-strategy"]
  },
  {
    "id": "anchor-social-growth",
    "title": "60-70K Monthly Social Views From Scratch",
    "challenge": "Minimal social media presence, no consistent posting, low local awareness",
    "action": "Content strategy, posting rhythm, local engagement, community building",
    "result": "Grew to 60-70K monthly views and built a 300-contact database",
    "metrics": ["social-views", "contact-database"],
    "relatedPackages": ["momentum-month", "growth-partner"],
    "relatedCapabilities": ["organic-social", "tools-tracking"]
  }
]
```

### Claims Governance Rules

1. `claims.json` is the single source of truth for metrics — no metric appears hardcoded anywhere else
2. `case-studies.json` is the single source of truth for narrative proof — challenge/action/result stories
3. `<Claim>` component renders metric text by ID. `<CaseStudy>` component renders narrative proof by ID.
4. `governance.lastFullReview` date triggers review reminder if >90 days old
5. Each claim and case study links to related packages and capabilities for contextual display
6. Only metrics from CLAUDE.md are permitted. No new metrics without Peter's sign-off.

---

## 7b. Component Specifications

### `<Claim>` Component

```typescript
interface ClaimProps {
  id: string;
  variant?: 'short' | 'long' | 'metric-only';
  showSource?: boolean;
  className?: string;
}
```

- **Server Component** — reads `claims.json` at build time
- **Rendering:** `variant="short"` renders `displayShort` (default). `variant="long"` renders `displayLong`. `variant="metric-only"` renders just the `metric` field.
- **Inline by default** — renders as `<span>`. When `variant="long"`, renders as `<p>`.
- **Missing ID:** Returns `null` in production. Logs a console warning in development.
- **Source attribution:** When `showSource={true}`, appends "(Source: [source])" in smaller text.

### `<CaseStudy>` Component

```typescript
interface CaseStudyProps {
  id: string;
  variant?: 'card' | 'full';
  className?: string;
}
```

- **Server Component** — reads `case-studies.json` at build time
- `variant="card"`: Renders title + result summary as a compact card
- `variant="full"`: Renders challenge → action → result narrative with related metrics

### `<PackageCard>` Component

```typescript
interface PackageCardProps {
  packageId: string;
  highlighted?: boolean;
  className?: string;
}
```

- Reads from `packages.json` by ID
- Renders: name, price.display, hours, badge (if set), bestFor bullets (first 4), payment plan cardCopy, CTA button
- `highlighted={true}` adds visual emphasis (border colour, "Most Popular" badge, slightly larger)
- **Responsive:** 1 column mobile, 2 columns tablet, 4 columns desktop

### `<PackageComparison>` Component

```typescript
interface PackageComparisonProps {
  className?: string;
}
```

- Reads from `capabilities.json` and `packages.json`
- **Desktop (md+):** Table layout. Rows = capabilities. Columns = packages. Cells show support level with visual treatment:
  - `included`: Green check + "Included"
  - `light-touch`: Amber dot + "Light-touch"
  - `add-on`: Grey plus + "Add-on"
  - `not-included`: Empty / dash
- **Mobile (<md):** Stacked cards. Each package is a card showing its capabilities as a list with the same visual indicators.
- Growth Partner column visually emphasised

### `<ProofStrip>` Component

```typescript
interface ProofStripProps {
  claimIds: string[];
  className?: string;
}
```

- Renders a horizontal strip of governed metrics
- **Desktop:** Horizontal row, evenly spaced
- **Mobile:** 2x2 grid or horizontal scroll
- Each metric uses `<Claim variant="short" />`

### `<ContentBoundaries>` Component

Renders the three-layer content creation model visually on the capabilities page:
- Strategy (green) — "Included in packages"
- Light Production (amber) — "Limited inclusion where listed"
- Production (red/separate) — "Always separately scoped"

Each layer lists its specific activities.

---

## 8. Conversion Architecture

### Funnel

```
DISCOVERY (SEO-driven, 100K+ addressable searches)
  Blog posts → "Need help? See our packages"
  Problem pages → "We solve this. Here's how"
  Regional pages → "Local support, clear packages"

CONSIDERATION (keyword-targeted, 1,500/mo commercial intent)
  Homepage → "hospitality marketing" (500/mo)
  Agency page → "hospitality marketing agency" (500/mo)
  About → "hospitality consultant" (500/mo)
  Pub marketing hub → "pub marketing" (50/mo)

DECISION (conversion-optimised, zero search volume)
  Ways to Work → 4 packages, comparison, payment plans
  Package detail pages → inclusions, exclusions, add-ons
  Contact → package-aware form + WhatsApp

POST-DECISION (trust reinforcement)
  Results → proof that packages deliver
```

### CTA Strategy by Content Type

| Content Type | CTA Approach |
|-------------|-------------|
| Consumer posts (quiz, games, bingo) | Soft contextual sidebar/footer: "Are you the landlord? Here's how we help" |
| Operator informational (how to run a pub, pub lease) | Mid-article + end: "Need help putting this into practice?" |
| Operator commercial (marketing ideas, menu engineering) | Strong: "We do this for pubs every week. See our packages" |
| Problem pages (fix my pub, empty pub) | Urgent: "Let's fix this" → specific package |
| Capabilities page | Direct: "Find the right package" → Ways to Work |
| Package detail pages | Conversion: WhatsApp + form with package pre-selected |

### Contact Mechanisms

Every package touchpoint offers both:
1. **WhatsApp (primary):** Pre-filled message with package context from `packages.json` `ctaWhatsApp` field
2. **Form (secondary):** "Prefer email? Fill in our enquiry form" — package pre-selected via URL param (`/contact?package=growth-partner`)

### Payment Plan Visibility

- **Package cards:** Subtle line beneath price: "Payment plans available" (from `packages.json` `paymentPlan.cardCopy`)
- **Ways to Work page:** Dedicated section below package comparison
- **Package detail pages:** Note within each page
- **FAQs:** Explicit question and answer about payment plans
- **Contact form:** Mention in form intro

---

## 9. SEO Migration Plan

### URL Migration Map

| Current URL | Action | New Destination | Keyword Impact |
|------------|--------|----------------|----------------|
| `/` | Rewrite in place | Same | "hospitality marketing" (500/mo) — preserved |
| `/services` | 301 redirect | `/ways-to-work` | No valuable keyword — no impact |
| `/services/social-media-marketing-for-pubs` | 301 redirect | `/capabilities` | "social media for pubs" (50/mo) — recaptured on capabilities page |
| `/services/paid-social-for-pubs` | 301 redirect | `/capabilities` | "pub advertising" (50/mo) — recaptured on capabilities page |
| `/services/content-creation-for-pubs` | 301 redirect | `/capabilities` | Zero volume — no impact |
| `/services/instagram-services-for-pubs` | **UPDATE existing redirect** | `/capabilities` (was → social media hub) | Fixes redirect chain |
| `/services/facebook-services-for-pubs` | **UPDATE existing redirect** | `/capabilities` (was → social media hub) | Fixes redirect chain |
| `/pub-marketing-agency` | Rewrite in place | Same | "hospitality marketing agency" (500/mo) — preserved |
| `/about` | Minor update | Same | "hospitality consultant" (500/mo) — preserved |
| `/pub-rescue` | **Remove existing redirect**, restore as standalone page | Same | "pub rescue package" (50/mo) — see Migration Note 1 |
| All other problem pages (5) | Rewrite in place | Same URLs | All keywords preserved |
| All regional pages (8) | CTA update | Same URLs | All keywords preserved |
| All blog posts (74) | CTA update | Same URLs | All keywords preserved |

**Redirect chain fix:** The Q1 work created redirects from Instagram/Facebook pages to the social media hub. The social media hub is now being redirected to `/capabilities`. Update the Instagram/Facebook redirects to point directly to `/capabilities` to avoid a 3-hop chain.

### New URLs

```
/ways-to-work                        NEW — no search volume (conversion page)
/ways-to-work/growth-fix             NEW — no search volume (conversion page)
/ways-to-work/momentum-month         NEW — no search volume (conversion page)
/ways-to-work/growth-partner         NEW — no search volume (conversion page)
/ways-to-work/turnaround-intensive   NEW — "pub transformation" (50/mo)
/capabilities                        NEW — recaptures "social media for pubs" (50/mo), "pub advertising" (50/mo)
```

### Sitemap Update Checklist

**Remove from sitemap.ts:**
- `/services`
- `/services/social-media-marketing-for-pubs`
- `/services/paid-social-for-pubs`
- `/services/content-creation-for-pubs`
- `/services/instagram-services-for-pubs`
- `/services/facebook-services-for-pubs`

**Add to sitemap.ts:**
- `/ways-to-work`
- `/ways-to-work/growth-fix`
- `/ways-to-work/momentum-month`
- `/ways-to-work/growth-partner`
- `/ways-to-work/turnaround-intensive`
- `/capabilities`

**Preserve unchanged:**
- All problem pages, regional pages, blog posts, hub pages

### Pricing Reference Sweep

A codebase audit found **40+ hardcoded "£75/hour" references** across metadata descriptions, page content, constants, components, structured data, and SEO overrides. This must be addressed as a dedicated task:

1. Update `PRICING` constant in `src/lib/constants.ts` — change from hourly to package-led (e.g., "From £375 + VAT")
2. Update all `generateMetadata` calls that reference "£75"
3. Update all SEO overrides in `src/lib/seo-overrides.ts` that reference "£75"
4. Update all structured data (`priceRange` fields)
5. Update all regional page content
6. Update problem page content
7. Update FAQ answers referencing hourly pricing

---

## 10. Implementation Phases

### Phase 1: Foundation (2-3 weeks, no public changes)

**Phase 1a — Data & Core Components (week 1-2):**
- Create content/data/packages.json (complete — all 4 packages with full inclusion logic)
- Create content/data/capabilities.json (complete — all 10 capabilities with support levels)
- Create content/data/add-ons.json (complete — all 7 add-ons)
- Create content/data/claims.json (complete — all 8 governed metrics)
- Create content/data/case-studies.json (complete — 3 case studies)
- Build `<Claim>` component with full interface spec
- Build `<CaseStudy>` component
- Build `<PackageCard>` component
- Build `<PackageDetail>` template
- Build `<PackageCTA>` component (WhatsApp + form, package-aware)
- Unit test all components

**Phase 1b — Auxiliary Components (week 2-3):**
- Build `<PackageComparison>` component with desktop table + mobile stacked cards
- Build `<CapabilityGrid>` component with Lucide icons
- Build `<ProofStrip>` component
- Build `<PaymentPlanBanner>` component
- Build `<AddOnList>` component
- Build `<ContentBoundaries>` component
- Prepare updated navigation.json and footer.json
- Unit test all components

**Exit criteria:** All components render correctly in isolation. All data files complete and validated. No public changes deployed.

### Phases 2-4: Atomic Public Launch (feature branch, 1-2 weeks, deployed together)

All built on a feature branch. Merged and deployed as a single release.

**New pages (Phase 2 work):**
- Build and test `/ways-to-work` page
- Build and test `/ways-to-work/growth-fix`
- Build and test `/ways-to-work/momentum-month`
- Build and test `/ways-to-work/growth-partner`
- Build and test `/ways-to-work/turnaround-intensive` (with website rebuild scope section)
- Build and test `/capabilities` page

**Page rewrites (Phase 3 work):**
- Rewrite homepage with package-led structure, claims from claims.json, case studies from case-studies.json
- Rewrite `/pub-marketing-agency` as "Why Choose OJ" — preserve keyword targeting
- Rewrite 6 problem pages to route to specific packages
- Update `/results` with `<Claim>` and `<CaseStudy>` components
- Update `/contact` with package-aware form (dropdown from packages.json, URL param pre-selection)
- Replace all hardcoded metrics sitewide with `<Claim>` references
- **Pricing sweep:** Update all 40+ "£75/hour" references (constants, metadata, SEO overrides, structured data)
- Update BlogPost.tsx "Related services" links to point to `/capabilities`

**Legacy removal (Phase 4 work):**
- Swap navigation.json to new structure
- Swap footer.json to new structure
- Deploy 301 redirects for /services and all service sub-pages
- Update Instagram/Facebook redirects to point directly to `/capabilities` (fix chain)
- Remove `/pub-rescue` → `/fix-my-pub` redirect from next.config.js; restore `/pub-rescue` as standalone
- Remove orphaned service page components and data files
- Update sitemap.ts (add new URLs, remove redirected URLs)

**Pre-launch QA:**
- Full mobile QA on all new and rewritten pages
- Verify all redirects work (no chains, no 404s)
- Verify no page on the site mentions "£75/hour" as primary pricing
- Verify no navigation or footer link points to `/services`
- Verify all claims render from claims.json (no hardcoded metrics)
- Verify WhatsApp messages include package context

**Exit criteria:** Site presents one coherent package-led commercial model. No mixed messaging. All redirects clean. All new pages mobile-tested.

### Phase 5: Polish (1-2 weeks, CTA sweep)

- Update CTAs on all 74 blog posts (component-level change using category mapping from Section 6)
- Update CTAs and pricing references on 8 regional pages
- Update CTAs on `/pub-marketing` hub
- Add cross-links between regional pages
- Add internal links to `/capabilities` from blog CTA rotation and hub pages
- Submit `/pub-rescue` to GSC for re-indexing (if redirect was removed)
- GSC monitoring for 404s, crawl errors, and indexation issues over 2-4 weeks

**Exit criteria:** Every page on the site routes to packages. No legacy pricing language anywhere. GSC clean.

---

## 11. Turnaround Intensive Website Rebuild Scope

### Included in Package

- 5-8 core pages
- Template-led build
- Mobile-first
- CMS-managed
- Refreshed positioning and offer structure
- Proof and contact flow
- Basic SEO setup
- Analytics installed
- One controlled round of amends
- Reuse of existing content where sensible, with selective rewriting

### Separate Scope (requires separate agreement)

- Advanced integrations
- Bespoke booking tools
- Complex migrations
- Deep copywriting across a large archive
- Full rebrand
- Fully bespoke custom design system
- Large functionality builds

---

## 12. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Old offer model leaks into new one | Medium | High | Atomic launch (Phases 2-4 together). Full audit in Phase 5. |
| Turnaround Intensive underpriced with website rebuild | High | High | Price validated in discovery before launch. Display as "Pricing confirmed after diagnostic" until finalised. |
| Content creation assumed included | Medium | High | Three-layer model explicit on capabilities page and package details. ContentBoundaries component. |
| SEO value lost during migration | Low | High | All high-value URLs preserved. Redirect chains fixed. Only 100/mo at risk. |
| Claims drift over time | Medium | Medium | claims.json + case-studies.json with quarterly review and single-source components. |
| Package overlap confuses prospects | Medium | Medium | Progressive disclosure + clear "best for" differentiation + Growth Partner visual emphasis. |
| Payment plan messaging becomes vague | Low | Medium | Visible on cards, dedicated section, FAQs, and form. Not buried. |
| Blog CTAs not updated (mixed messaging) | Medium | Medium | Phase 5 covers all 74 posts. Component-level change, not per-post. |
| /pub-rescue redirect reversal causes temporary SEO confusion | Medium | Low | Submit to GSC for re-indexing. Monitor for 4 weeks. Alternative: merge keyword into /fix-my-pub. |

### Commercial Risk Note

Per the brief's Section 20, these risks must be flagged explicitly:

1. **Turnaround Intensive pricing:** Must be validated before launch. Including a lean website rebuild likely pushes the price significantly above the original working estimate. Peter must confirm the final price (or confirm "pricing after diagnostic" is the permanent approach).
2. **Package boundary clarity:** Growth Fix (5 hours) and Momentum Month (12 hours) could feel overlapping if "best for" bullets aren't distinct enough. The "one issue" vs "ongoing rhythm" distinction must be crystal clear.
3. **Payment plan operations:** The site will say "payment plans available" but Peter needs to define: which packages qualify, whether deposits apply, and whether Turnaround Intensive has staged payments. This is an operational decision, not a design decision.

---

## 13. Keywords Preserved Through Migration

| Keyword | Vol/mo | Pre-Migration URL | Post-Migration URL | Status |
|---------|--------|-------------------|-------------------|--------|
| hospitality marketing | 500 | `/` | `/` | Preserved |
| hospitality marketing agency | 500 | `/pub-marketing-agency` | `/pub-marketing-agency` | Preserved |
| hospitality consultant | 500 | `/about` | `/about` | Preserved |
| social media for pubs | 50 | `/services/social-media-marketing...` | `/capabilities` (recaptured) | Redirect + recapture |
| pub advertising | 50 | `/services/paid-social-for-pubs` | `/capabilities` (recaptured) | Redirect + recapture |
| pub lease | 5,000 | `/licensees-guide/brewery-tie...` | Same | Preserved |
| how to run a pub | 500 | `/licensees-guide/pub-health-check...` | Same | Preserved |
| pub quiz | 50,000 | `/licensees-guide/quiz-night-101` | Same | Preserved |
| music bingo | 5,000 | `/licensees-guide/music-bingo-101` | Same | Preserved |
| pub games | 5,000 | `/licensees-guide/boardgame-night-101` | Same | Preserved |
| pub marketing | 50 | `/pub-marketing` | `/pub-marketing` | Preserved |
| pub transformation | 50 | None | `/ways-to-work/turnaround-intensive` | New capture |
| pub rescue package | 50 | `/pub-rescue` | `/pub-rescue` | Preserved (redirect removed) |
| All blog keywords | 100K+ | `/licensees-guide/*` | Same | Preserved |
| All regional keywords | ~400 | `/pub-marketing-*` | Same | Preserved |

---

## Appendix A: Current-State Commercial Audit

### What currently works
- Founder-led positioning (Peter's direct involvement) is genuinely differentiating
- WhatsApp-first contact removes friction — prospects can message immediately
- Proof metrics (food GP, quiz regulars, social views) are compelling and specific
- Blog content (74 posts) drives significant organic authority
- Problem-led entry points (empty tables, struggling pub) match real emotional states

### What conflicts
- Homepage, services page, and problem pages all present different versions of the offer
- Four service pillars (Event Innovation, Transformational Marketing, Simplified Technology, Clearing Up Ambiguity) don't map to how prospects buy
- Six specialist social pages create the impression that OJ is a social media agency, not a strategic growth partner
- "£75/hour + VAT" everywhere positions OJ as hourly help, not strategic partnership
- Fix My Pub page promises a turnaround but offers the same £75/hour model as everything else

### What creates mixed-environment risk
- Old service pillars acting as primary offers alongside any new packages
- Solution pages making promises (30-day action plans, templates) that differ from package scope
- Footer navigation pointing to both old service categories and new package structure
- Multiple CTAs competing (WhatsApp, services page, specific solution pages)

---

## Appendix B: Replacement Map

| Current Page/Section | Fate | New Destination | Notes |
|---------------------|------|----------------|-------|
| Homepage hero (hourly pricing) | **Rewrite** | Package-led hero | "From £375 + VAT" replaces "£75/hour" |
| Homepage problem cards | **Rewrite** | Route to packages | Cards link to specific packages, not standalone pages |
| Homepage service pillars | **Remove** | Capability summary links to /capabilities | 4 pillars → 10 capabilities |
| `/services` page | **Redirect** | `/ways-to-work` | 301 permanent |
| `/services` 4 pillars | **Remove** | Absorbed into capabilities page | Event Innovation, Transformational Marketing, etc. |
| `/services` specialist cards | **Remove** | Redirected or absorbed | Individual service pages redirect to /capabilities |
| `/services/social-media-marketing-for-pubs` | **Redirect** | `/capabilities` | 301 permanent |
| `/services/instagram-services-for-pubs` | **Update redirect** | `/capabilities` | Was → social media hub; now direct |
| `/services/facebook-services-for-pubs` | **Update redirect** | `/capabilities` | Was → social media hub; now direct |
| `/services/paid-social-for-pubs` | **Redirect** | `/capabilities` | 301 permanent |
| `/services/content-creation-for-pubs` | **Redirect** | `/capabilities` | 301 permanent |
| `/pub-marketing-agency` | **Rewrite** | Same URL, reframed | "Why Choose OJ" → routes to packages |
| `/fix-my-pub` | **Rewrite** | Same URL | Routes to Turnaround Intensive |
| `/empty-pub-solutions` | **Rewrite** | Same URL | Routes to Growth Fix / Growth Partner |
| `/pub-rescue` | **Restore + rewrite** | Same URL | Remove redirect, restore as standalone |
| `/quiet-midweek-solutions` | **Rewrite** | Same URL | Routes to Growth Fix |
| `/compete-with-pub-chains` | **Rewrite** | Same URL | Routes to Growth Fix / Growth Partner |
| `/pub-marketing-no-budget` | **Rewrite** | Same URL | Routes to Growth Fix (from £375) |
| `/results` | **Rewrite** | Same URL | Claims-governed, case-study cards |
| `/contact` | **Update** | Same URL | Package-aware form + WhatsApp |
| Navigation "Services" | **Replace** | "Ways to Work" | — |
| Footer service links | **Replace** | Package links | — |
| Footer solution links | **Remove** | Problem pages demoted from footer | — |
| All "£75/hour" references | **Replace** | Package-led pricing | 40+ locations |
| Blog CTAs | **Update** | Route to /ways-to-work | Component-level change |
| Regional CTAs | **Update** | Route to packages | — |
| `PRICING` constant | **Update** | Package-led display | — |

---

## Appendix C: Discovery Questions Answered

Per the brief's Section 14:

**1. What is the best way to move from service-led to package-led without losing SEO or clarity?**
Atomic public launch with incremental development. All high-value URLs preserved. New pages are additive (new URLs). Old pages are either rewritten in place (preserving URLs) or 301-redirected. See Section 9.

**2. Which current pages should be retained, merged, rewritten, redirected, or removed?**
See Appendix B (Replacement Map) for the complete mapping.

**3. Should packages live only on one page or have dedicated landing pages?**
Both. `/ways-to-work` is the comparison page with package cards. Each package also has a detail page at `/ways-to-work/[slug]` for progressive disclosure and PPC landing page potential.

**4. How should capabilities sit beneath the package model without becoming competing offers?**
`/capabilities` shows the full digital stack but explicitly states "support depth varies by package" and routes to Ways to Work. It does not present capabilities as independently purchasable services.

**5. How should specialist social pages behave in the new structure?**
All specialist social pages redirect to `/capabilities`. Their unique content is absorbed into the capabilities page. Instagram and Facebook content was already consolidated into the social media hub (Q1 work); that hub now redirects to `/capabilities`.

**6. How should payment-plan messaging surface without creating confusion?**
Subtle line on package cards ("Payment plans available"), dedicated section on Ways to Work, note on each detail page, FAQ entry, and form intro mention. Operational details (which packages, deposit rules, staged payments) are Peter's decision, not displayed until confirmed.

**7. What is the cleanest way to model package inclusions in the CMS?**
JSON-based content files (packages.json, capabilities.json, add-ons.json, claims.json, case-studies.json). Each file has a defined schema. Components read from JSON at build time. Peter can update pricing, inclusions, and claims by editing JSON files — no code changes needed.

**8. What is the exact website scope inside Turnaround Intensive?**
See Section 11. Lean reset: 5-8 pages, template-led, mobile-first, CMS-managed, one round of amends. Anything beyond (advanced integrations, bespoke tools, full rebrand) is separate scope.

**9. What is the likely effort impact of including the website rebuild?**
The Turnaround Intensive price must be revalidated. The website rebuild alone is likely 3-5 days of development work (template-led, content reuse). Combined with the diagnostic and reset work, the package likely needs to be priced significantly above the original working estimate.

**10. What should the phased implementation plan look like?**
See Section 10. Phase 1 (Foundation, 2-3 weeks) → Phases 2-4 (Atomic Launch, 1-2 weeks on feature branch) → Phase 5 (Polish, 1-2 weeks). Total: 5-7 weeks.

---

## QA Review Reference

This spec (v2) incorporates all findings from a 3-specialist QA review conducted 2026-04-05:
- Spec Compliance Audit (Codex GPT-5.4): 22 findings
- Architecture Review (Claude): 22 findings
- SEO Migration Review (Claude): 23 findings
- Merged report: `tasks/codex-qa-review/2026-04-05-commercial-transform-codex-qa-report.md`

All critical and high findings have been addressed in this version.
