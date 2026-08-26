# Orange Jelly repositioning: governing implementation spec

**Version:** 1.0
**Date:** 26 August 2026
**Status:** Ready to build, with three named blockers
**Owner:** Peter Pitcher

This is the single plan. If a piece of work on the repositioning is not in here, it has not been
scoped. Everything else in `tasks/repositioning/` is evidence feeding this document.

| Companion document | What it holds |
|---|---|
| `decisions.md` | D1 to D16, the decisions in force |
| `keyword-research.md` | Three rounds, 243 terms, the fifteen worth building for |
| `orangejelly-search-performance.md` | What the current site actually earns |
| `anchor-search-performance.md` | The lead case study |
| `component-audit.md` | 179 components, the duplication, the target shape |
| `design-requests.md` | What was asked of the designer and what came back |
| `docs/brand/` | The strategy pack and the design system |

---

## 1. What this is doing

Moving orangejelly.co.uk from hospitality marketing agency to **growth partner for ambitious small
and mid-sized businesses**, without breaking the small amount of search authority that exists, and
without pretending the new positioning has demand it does not have.

### The four things the evidence changed

Anyone reading this spec needs these four facts before the plan makes sense.

1. **The site earns 969 clicks a year.** The blog is 92.9% of it. Thirteen posts carry 80%. The
   twelve pub landing pages and five service pages the plan was originally built to protect earn
   eleven clicks a year between them.
2. **The new positioning has almost no Google demand.** 243 terms tested. The category language and
   the symptom language both return close to nothing. Fifteen terms are worth building for.
3. **The biggest available win is rankings, not pages.** 69,698 impressions produce 969 clicks at
   average position 9 to 13. Fixing fourteen existing posts beats building eight new ones.
4. **The Anchor is the proof.** It earns fifteen times the traffic, and 41.7% of it comes from
   aviation content rather than pub content. That is a demand-discovery story that transfers to any
   sector and needs no claim verification.

### What success looks like

- A visitor understands within 20 seconds that Orange Jelly solves growth problems, starts with the
  problem, works across commercial, operational and technical issues, and treats AI as a tool.
- No page contradicts the new position.
- Not one of the 29 protected blog posts loses a ranking.
- The thirteen highest-impression posts move up the results page.
- Qualified enquiries arrive through a conversation, not a purchase.

### Explicitly out of scope

- `/availability` and its 21 components. Agreed with the designer (D). Stays on current styling.
- `/admin`.
- The `cheersai`, `mixerai` and `management` subdomains, beyond a decision about whether they belong
  in the Search Console property.
- Paid search. The bid data in the research is used as an intent signal only.

---

## 2. Decisions in force

Full text in `decisions.md`. The ones that shape this spec:

| | Decision |
|---|---|
| D1 / D14 | Existing URLs stay live, refined by evidence. 29 blog posts untouchable, commercial pages free to restructure. |
| D2 | The five proof claims are re-verified before publication. **Not started. Blocker.** |
| D3 | No pricing anywhere on the site. |
| D8 / D11 / D12 | Entry is always a free discovery conversation. Primary CTA is "Bring us the problem". |
| D13 | Professional services first. Trades is a second wave. |
| D15 | Ranking work on existing posts runs alongside the rebuild, not after it. |
| D16 | Keyword research is closed. |

---

## 3. Target information architecture

### Navigation

`Growth problems` · `How we work` · `Results` · `Insights` · `About` · **Bring us the problem**

Hospitality lives inside Insights as a sector collection, not in the top-level nav.

### The two content collections

This is the most important structural decision in the spec and it is driven by the data.

**`/licensees-guide/*` does not move.** All 106 posts stay exactly where they are. That path carries
900 of the site's 969 clicks and every one of the 29 protected posts. Moving it to `/insights/` to
satisfy the blueprint's naming would risk the only search asset the company has, for no gain.

It also happens to be honest. Every post in there is pub content. It is a licensees' guide.

New content for the new positioning starts fresh at `/insights/*`. Two collections, two audiences,
no migration risk.

### Full URL map

**Unchanged, restyled only**

| URL | Template | Note |
|---|---|---|
| `/` | `landing-page` | |
| `/about` | `about` | 26 clicks, the second-best commercial page |
| `/contact` | reduced `start-here` | Fallback route, not the main conversion |
| `/results` | `results` | 160 impressions, currently 0 clicks |
| `/privacy` | prose | |
| `/licensees-guide` | `sector-hub` | Becomes the hospitality sector hub |
| `/licensees-guide/[slug]` | `blog-article` | **All 106 posts. Do not touch the paths.** |
| `/licensees-guide/category/[category]` | `blog-listing` | |
| `/pub-rescue` | `sector-landing` | 6 clicks, 519 impressions. The strongest of the pub pages. |
| `/pub-marketing` | `sector-landing` | 83 impressions. Becomes the single surviving hospitality service page, absorbing all five `/services/*` children. |

**New**

| URL | Template | Justified by |
|---|---|---|
| `/growth-problems` | `growth-problems-hub` | Blueprint. Conversion asset, not a traffic asset. |
| `/growth-problems/[slug]` × 8 | `growth-problem` | Blueprint. Same. |
| `/how-we-work` | `how-we-work` | Blueprint |
| `/solutions` | `solutions` | Blueprint |
| `/start-here` | `start-here` | Primary conversion route |
| `/insights` | `blog-listing` | New-positioning content |
| `/insights/[slug]` | `blog-article` | New-positioning content |
| `/sectors/professional-services` | `sector-hub` | D13. Target: `professional services marketing` |
| `/tools/ai-readiness` | `Scorecard` | Target: `ai readiness assessment`, 500 tier, £8.56 to £33.61 |
| `/fractional-cmo` | `growth-problem` variant | Targets the fractional cluster, argues against the format |
| `/404`, `/500` | `error-page` | |

**14 redirects already exist and three of them break this plan**

`next.config.js` already redirects. Two entries make the naive consolidation wrong:

| Existing redirect | Consequence |
|---|---|
| `/services` to `/ways-to-work` | `/services` is **already a redirect**, not a page. Its 1,199 impressions at position 24 are for a URL that does not serve content. |
| `/services/instagram-services-for-pubs` and `/services/facebook-services-for-pubs` to `/services/social-media-marketing-for-pubs` | Sending the target to `/services` would build a three-hop chain. |
| `/pub-marketing-${county}` to `/pub-marketing` | Explains the Kent, Berkshire and London URLs in Search Console. Already handled, leave alone. |
| `/licensees-guide/cash-flow-crisis-breaking-cycle` to `/fix-my-pub` | A blog URL points at a page this spec retires. Must be repointed in the same change. |

**Rule: every redirect resolves in one hop. When a target moves, repoint everything aimed at it in
the same change.** Chains are the most likely way this restructure quietly loses the little
authority the site has.

**Consolidated by redirect (301), chain-safe**

| From | To | Note |
|---|---|---|
| `/fix-my-pub` | `/pub-rescue` | Also repoint `/licensees-guide/cash-flow-crisis-breaking-cycle` |
| `/licensees-guide/cash-flow-crisis-breaking-cycle` | `/pub-rescue` | Repointed, currently aims at `/fix-my-pub` |
| `/empty-pub-solutions` | `/pub-rescue` | |
| `/quiet-midweek-solutions` | `/pub-rescue` | |
| `/compete-with-pub-chains` | `/licensees-guide/compete-with-wetherspoons` | That post earns 16 clicks on 1,262 impressions |
| `/pub-marketing-agency` | `/pub-marketing` | |
| `/pub-marketing-no-budget` | `/pub-marketing` | |
| `/services/social-media-marketing-for-pubs` | `/pub-marketing` | The surviving service page. Consolidates into the sector landing. |
| `/services/instagram-services-for-pubs` | `/pub-marketing` | **Repointed** from the existing target to avoid a chain |
| `/services/facebook-services-for-pubs` | `/pub-marketing` | **Repointed** for the same reason |
| `/services/content-creation-for-pubs` | `/pub-marketing` | |
| `/services/paid-social-for-pubs` | `/pub-marketing` | |
| `/services` | `/how-we-work` | **Repointed** from `/ways-to-work`, which is itself retired |
| `/capabilities` | `/solutions` | |
| `/ways-to-work` | `/how-we-work` | 835 impressions. Redirect, never delete. |
| `/ways-to-work/[slug]` | `/how-we-work` | |

**Total click exposure of the entire restructure: 2 clicks a year.**

**Deleted**

| URL | Reason |
|---|---|
| `/test-shadcn` | Development artefact, publicly routable |
| `/about-demo` | Leftover demo, `route.ts` handler, live and indexed at 22 impressions |

**Leave alone.** The `/autumn`, `/christmas` and `/summer` campaign redirects carry Greene King and
BII tracking parameters and point at protected posts. The seven `/licensees-guide/*` to
`/licensees-guide/*` redirects are content merges that already happened. Do not touch either group.

**Verify before build.** Confirm the redirect map end to end with a crawler after WS6, not by
reading the config. There are 14 existing rules and this spec adds 16.

---

## 4. Workstreams

Eight workstreams. Dependencies are marked. Nothing in a later workstream starts before its
dependency has passed its definition of done.

### WS1: Foundations

**Depends on:** nothing. Start here.

The component audit found an abandoned migration: `Button.tsx` to `adapters/ButtonAdapter.tsx` to
`ui/button.tsx`. Three files, one button, across nine primitives. Swapping design tokens before
collapsing that means restyling three copies of everything.

1. Delete the 27 components with no reference anywhere in `src` (2,617 lines). Full list in
   `component-audit.md`.
2. Delete `demo/ui/` (3 files, unreferenced) and the `/test-shadcn` route.
3. Collapse the nine transitional wrappers and delete `src/components/adapters/` (16 files).
4. Update `scripts/check-growth-language.mjs`, whose `FILE_TARGETS` names `ServiceComparison`,
   `SocialProof` and `ROICalculator`, all of which go.
5. Add a `docs/brand/` exclusion to `check-growth-language.mjs` and `check-british-english.mjs`. The
   vendored pack currently fails both on false positives and forces `--no-verify` commits.

**Done when:** `npm run lint`, `npm run type-check`, `npm test` and `npm run build` all pass, the
component count is under 140, and no commit needs `--no-verify`.

### WS2: Design tokens

**Depends on:** WS1.

The current palette is navy `#1A2F49`, blue `#01619E`, orange `#F16F23`, pale blue `#F2F8FC`. The
new one is warm ink `#23252E`, cream `#F7F5F1`, orange `#F76B0C`, peach `#FFD3AD`. Cool to warm,
entirely.

**Keep the architecture, replace the values.** The token layer, the contrast test in
`src/test/design-tokens.contrast.test.ts` and the `check:design-tokens` gate are all good work and
all survive. Only the numbers change.

1. Map `docs/brand/design-system/tokens/*.css` into `tailwind.config.js`.
2. Add the seven `--cat-*` taxonomy pairs. Reconcile with `src/lib/category-colours.ts`.
3. Add the pressure shadow (`5px 5px 0`, never blurred), 1.5px ink borders, 3px radius, the snap
   easing, the orange double focus ring.
4. Add the global lowercase rule for `h1`, `h2` and `.oj-display`, plus `.oj-keep-case` for proper
   nouns. This is site-wide per the designer's decision 1.
5. Load Schibsted Grotesk. Treated as production, not a substitute.
6. Port `tokens/prose.css` to the Tailwind Typography config.

**Watch:** `/availability` is out of scope but shares the global stylesheet. A global token swap
will restyle it whether we intend to or not. Either scope the poll app's styles or accept the
change deliberately. **This needs a call before WS2 starts.**

**Done when:** the contrast test passes on the new palette, `check:design-tokens` passes, and no
hardcoded hex has been added outside the existing allowlist.

### WS3: Component library

**Depends on:** WS2.

Port the 44 reference components to typed Tailwind and CVA. They are plain React with inline styles,
so they are a specification, not code to paste.

Mapping the duplicate families onto them:

| Current | Count | Becomes |
|---|---|---|
| Button family | 7 | `core/Button` |
| Card family | 10 | `content/Card`, `PressureCard`, `ProofCard`, `editorial/ArticleCard` |
| Heading / Text | 5 | Tokens and `.oj-prose`. No component. |
| Form fields | 10 | `forms/Field` plus the six inputs |
| Whole forms | 7 | `Field` composition, `marketing/NewsletterBand` |
| FAQ / accordion | 5 | `editorial/FAQ` |
| Sticky and floating CTA | 7 | `chrome/StickyCTA` |
| Trust and proof | 10 | `core/Stat`, `content/ProofCard`, `marketing/LogoStrip` |
| Chrome | 10 | `chrome/Header`, `Footer`, `Breadcrumb` |
| Layout primitives | 5 | Tokens plus the 1160px container rule |
| Page sections | 10 | Composed in templates |
| JSON-LD | 12 | One generic component plus per-type config |

Priority order within WS3, driven by what unblocks pages: Button, Header, Footer, Card, Stat, Field
and the inputs, then everything else.

**Done when:** every component has a typed props interface matching its `.d.ts.txt` contract, the
component count is at or below 95, and Storybook or an equivalent renders each one in both header
tones.

### WS4: Chrome and global

**Depends on:** WS3.

1. `Header` with cream and orange tones. Orange on conversion pages only: `/start-here`,
   `/growth-problems` and its children. Cream everywhere else, About included.
2. Mobile drawer. Nav items take `sub[]`, the eight problem pages group under "Growth problems".
   **Mobile is 78% of clicks and ranks eight positions better than desktop.** Build mobile first.
3. `Footer` on ink, orange mark, "© 2026 Orange Jelly Limited", never "Ltd".
4. `StickyCTA` and every CTA surface carry **"Bring us the problem"** (D11).
5. `CookieNotice`, equal-weight decline.
6. `SiteSearch` fed from the existing `search-index.json`, with the no-results state routing to
   `/growth-problems`.

**Done when:** chrome renders correctly on all 14 template types at mobile, tablet and desktop, and
no CTA anywhere says "Book a growth diagnostic".

### WS5: New pages

**Depends on:** WS4.

Build order is by commercial value, not by blueprint order.

| Order | Page | Why first |
|---|---|---|
| 1 | `/` | Everything else is judged against it |
| 2 | `/start-here` | The conversion route. Nothing else matters if this does not work. |
| 3 | `/how-we-work` | Answers the question the homepage raises |
| 4 | `/results` | Proof. **Partly blocked by D2.** Lead with the Anchor discovery story, which needs no verification. |
| 5 | `/about` | Second-best performing commercial page today |
| 6 | `/growth-problems` and 8 children | Conversion and citation assets. Copy for all eight is in the template's logic block, lift it verbatim. |
| 7 | `/solutions` | |
| 8 | `/tools/ai-readiness` | Targets a 500-tier term using a component we already have |
| 9 | `/sectors/professional-services` | D13 |
| 10 | `/fractional-cmo` | Targets the fractional cluster |
| 11 | `/insights`, `/insights/[slug]` | Needs content before it is worth shipping |
| 12 | `/404`, `/500` | |

**Enquiry form** on `/start-here`: name, work email, company, website, role, employee or revenue
band, what is happening, what you believe is blocking growth, what success looks like, why now, who
is involved in the decision, preferred next step. No service picker. No investment range field,
because D3 removed pricing and D12 made the first conversation free.

**The qualification problem.** Removing the price removed the filter that kept low-value enquiries
out. The form, the fit section and the free-conversation framing now have to do that job on purpose.
The fit section must say plainly who this is not for.

### WS6: Existing page migration

**Depends on:** WS4.

1. Restyle `/licensees-guide` as the hospitality sector hub using `sector-hub`. Umber sector badge,
   not orange. Anchor stats card, `SeasonalBand`, article grid.
2. Restyle all 106 posts with `blog-article`. **Paths do not change.** Add `ShareRow` under the
   byline and `NextStep` at the foot.
3. Consolidate the pub landing pages into `sector-landing` and apply the redirect table in section 3.
4. Apply `CategoryTag` with the taxonomy hues, reconciled against `category-colours.ts`.

**Done when:** every one of the 29 protected posts returns 200 on its original URL, every redirect
in section 3 resolves in one hop, and Search Console shows no coverage errors after seven days.

### WS7: Content and rankings

**Depends on:** WS6. Runs in parallel with WS5. This is D15 and it is the highest-yield work in the
spec.

**7a. Fix the thirteen posts carrying 80% of traffic.** These have the impressions and lack the
rankings.

| Post | Impressions | Clicks | Position |
|---|---|---|---|
| summer-pub-event-ideas | 10,355 | 159 | **16.8** |
| quiz-night-ideas | 6,438 | 122 | 12.1 |
| profitable-pub-food-menu-ideas | 5,629 | 104 | 7.8 |
| quiz-night-101 | 3,615 | 48 | 8.0 |
| content-marketing-ideas-pubs | 3,130 | 18 | **15.4** |
| cash-bingo-101 | 2,621 | 54 | 9.2 |
| pub-vat-accounting-guide | 1,978 | 27 | 7.5 |
| social-media-strategy-for-pubs | 4,489 | 43 | 12.6 |
| christmas-pub-promotion-ideas | 1,836 | 27 | 11.8 |
| summer-moments-simple-campaigns | 1,818 | 33 | **17.3** |
| midweek-pub-offers-that-work | 1,362 | 23 | 7.7 |
| why-is-my-pub-empty | 1,183 | 24 | 7.2 |
| oktoberfest-pub-guide | 798 | 30 | 6.9 |

The three in bold sit outside the top fifteen on strong impression counts. They are the single
biggest opportunity on the site.

**7b. Protect the next sixteen.** Listed in `orangejelly-search-performance.md`. Restyle, add
`NextStep`, change nothing else.

**7c. Review the 83 tier-three posts.** 62 earn zero clicks. Each needs a call: keep, merge or
retire. Two exceptions worth fixing rather than retiring: `cask-ale-week-pub-guide` (922
impressions) and `pub-health-check-essential-fundamentals-licensee-success` (743).

**7d. New content for the new positioning.** Targeting the fifteen terms from `keyword-research.md`.
First four, in order: `ai for accountants`, `marketing for law firms`, `what is a fractional cmo`,
`professional services marketing`.

**AI is the entry, growth is the conversion.** These articles answer the AI question honestly and
conclude that it sits downstream of a business question. AI stays out of the company description,
the homepage and the category.

**7e. The Anchor case study.** Lead the Results page with the demand-discovery story: the business
assumed its search opportunity was pub search, it was not, the real demand sat in an adjacent
interest nobody would have named, and it now brings in 41.7% of all search visits. Needs no claim
verification and argues for the new positioning rather than the old one.

### WS8: Measurement

**Depends on:** WS5.

1. Events: `bring_us_the_problem_click`, `enquiry_started`, `enquiry_submitted`,
   `scorecard_started`, `scorecard_completed`, `pressure_check_used`, `next_step_click`.
2. Journey tracking: insight to problem page to case study to enquiry.
3. **A standing gate applies here.** There is currently no GA4 enquiry event on this site. The
   repositioning does not ship without one.
4. Baseline every one of the 29 protected posts before WS6 touches them, and monitor weekly for
   eight weeks after.

**Do not set an organic traffic target for the growth-problem pages.** They have no Google demand
behind them by design. Judge them on assisted conversions and AI citation.

---

## 5. Phasing

| Phase | Workstreams | Ships |
|---|---|---|
| **1. Clear the ground** | WS1, WS2 | Nothing visible. The codebase stops fighting the change. |
| **2. Build the kit** | WS3, WS4 | Nothing visible. Components and chrome ready. |
| **3. The new position goes live** | WS5 (1 to 5), WS8 | Home, start here, how we work, results, about. The company is publicly repositioned. |
| **4. Depth** | WS5 (6 to 12), WS6 | Growth problems, solutions, tools, sector hub, all 106 posts restyled. |
| **5. Earn the traffic** | WS7 | Ranking fixes and new content. Continuous. |

Phase 3 is the point of no return and the point of the exercise. The activation plan in the brand
pack has the right instinct: do not delay the position until everything is perfect, but do not
launch while the old and new descriptions openly contradict each other. Phase 3 resolves the
contradiction. Phase 4 completes the argument.

WS7 can start during phase 3. It touches content, not components.

---

## 6. Definition of done, whole programme

- [ ] `npm run lint`, `type-check`, `test` and `build` pass with zero warnings
- [ ] `check:design-tokens`, `check:british-english`, `check:growth-language` pass without
      `--no-verify`
- [ ] Component count at or below 95, from 179
- [ ] Every one of the 29 protected posts returns 200 on its original URL
- [ ] Every redirect resolves in one hop, no chains
- [ ] LCP under 2.5s, INP under 200ms, CLS under 0.1, on mobile
- [ ] WCAG 2.1 AA, including the new palette's contrast pairs
- [ ] No page describes Orange Jelly as a hospitality marketing agency
- [ ] No price anywhere on the site
- [ ] Every CTA is "Bring us the problem"
- [ ] No unverified claim published (D2)
- [ ] GA4 enquiry event live and firing
- [ ] `/about-demo` and `/test-shadcn` gone

---

## 7. Risks

| Risk | Likelihood | Impact | Response |
|---|---|---|---|
| A protected post loses rankings during restyling | Medium | **High.** These 29 posts are the company's entire search asset. | Baseline before, weekly monitoring for eight weeks, paths never change, one-hop redirects only |
| The token swap restyles `/availability` unintentionally | **High** | Medium | Decide before WS2 starts. Scope the poll styles or accept it deliberately. |
| D2 never completes and the Results page ships empty | Medium | High | Lead with the Anchor discovery story, which needs no verification. Hold the percentages back rather than publishing unverified. |
| The growth-problem pages get judged on organic traffic and read as failures | **High** | Medium | Stated in WS8 and section 1. Repeat it at launch. |
| Removing the price fills the inbox with low-value enquiries | Medium | Medium | The fit section and qualification form must do that job deliberately. Review after 30 days. |
| Scope creep from 44 components into a design system project | Medium | Medium | Port on demand. A component is not built until a page in WS5 or WS6 needs it. |

---

## 8. Blockers

Three things are genuinely blocked. Everything else can start.

1. **Proof verification (D2).** Not started. Blocks the Results page, the About page and every case
   study. Needs baseline period, exact definition and data source for +828%, +403%, +567%, −89% and
   +98%. The Anchor export covers 12 months with no baseline and cannot verify them.
2. **The `/availability` styling decision.** Blocks WS2. In scope for the token swap or scoped out.
3. **Greene King and BII logo migration** into `LogoStrip`. With the designer, files exist in
   `public/`. Blocks the proof band only.

Not blocking, but needs an answer: whether the `cheersai`, `mixerai` and `management` subdomains
stay in the orangejelly.co.uk Search Console property.
