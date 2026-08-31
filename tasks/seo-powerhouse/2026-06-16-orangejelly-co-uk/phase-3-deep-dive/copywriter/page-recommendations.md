# SEO Copywriter — Page-by-Page Recommendations

**Date:** 2026-06-16 (Europe/London) · **Agent:** SEO Copywriter · **Phase:** 3 (Deep Dive)
**Commercial goal:** more service enquiries / leads from UK licensees. Every recommendation ties to that goal.

**Data status header.** GSC = first-party (Known). **GA4 not supplied** → no conversion/CTR-by-page-after-change baseline; CTR uplift targets are directional. No keyword tool → new commercial-term volumes are "validate via keyword-plan / GKP", never asserted. Copy proof points use ONLY `/CLAIMS.md` percentages (+828% search visibility, +403% table bookings, +567% private hire, −89% no-shows, +98% food revenue in 3 months — all "proven at The Anchor"). British English. No "save/savings". Greene King = Tenant, BII = Member. Improvements expressed as percentages, never raw numbers/multiples.

**Critical framing correction (verified against `src/lib/seo-overrides.ts` + route `generateMetadata`).** The brief implied titles/meta on the top guides are weak. They are NOT — the guide metadata was recently rewritten and is already strong (titles 46–55 chars leading with the keyword; descriptions 130–153 chars carrying approved CLAIMS). So the copywriter job is **not** "fix broken titles". It is two different jobs:
1. **Commercial pages** — the metadata is decent but the **on-page body** does not earn the enquiry, and the title/positioning does not differentiate in an agency SERP. This is where the 2,908-impression / 2-click collapse lives.
2. **Guides** — metadata is fine; the missing lever is the **in-content info→commercial bridge** (currently a generic category CTA pointing at `/ways-to-work`), plus light position-improvement copy.

Where metadata is already good I say so and do **not** propose a change for change's sake (per role: "don't over-optimise").

**Indexation dependency.** Several commercial pages (`/pub-marketing-agency`, `/pub-marketing`, `/capabilities`, the package pages, location pages) are currently **not indexed** (Technical C-3/C-4; analytics §5). Copy changes only convert once Technical's internal-linking/indexation fixes land and the page is in the index. Each ticket below notes this dependency. **No live indexation change is recommended here** — those route via the Phase 5 Risk Register.

---

## SECTION 1 — Commercial pages (the conversion problem: ~0.07% CTR on 2,908 commercial impressions)

### 1.1 `/pub-marketing-agency` — the highest-value commercial capture page
**Target keyword:** `pub marketing agency` (304 impr, pos 19.6, 0 clicks — Known, GSC 12-mo); secondary `marketing agency for pubs` (161 impr, pos 18.3, 0c), `hospitality marketing agency`.
**Current status:** 1,002 words (strongest commercial page); valid `ProfessionalService`+`FAQPage` schema; **orphaned (0 internal links) and not indexed** (Technical C-3). Metadata already good.

#### Metadata
| Element | Current | Recommended | Notes |
|---|---|---|---|
| Title | `Pub Marketing Agency for Independent Pubs & Bars` (48) | **Keep.** Optionally test: `Pub Marketing Agency Run by a Working Publican` (45) | Current is fine and keyword-first. The alt test leads with the *differentiator* the whole SERP lacks (every competitor — CJ Digital, Wired Media, Brew — leads "Digital Marketing Agency for Pubs"). A/B only after indexation; not a defect. |
| Meta description | `A pub marketing agency run by a working licensee, not account managers. Social, events, paid ads, and local SEO built for independent pubs. Packages from £375 + VAT.` (165) | Trim to ≤160: `A pub marketing agency run by a working licensee — not account managers. Social, events, paid ads and local SEO for independent pubs. Packages from £375 + VAT.` (158) | Only change: 165→158 chars so it doesn't truncate. Positioning is already right. |
| H1 | `A Hospitality Marketing Agency That Actually Runs a Pub` | **Keep.** | Strong, differentiated, matches intent. One H1 (verified). |

#### Content improvements (this is the real work — earn the enquiry)
The page already has the right bones (anti-agency angle, "Real Numbers From a Real Pub", packages, FAQ). Sharpen for conversion:
1. **Lead the first 100 words with a quotable answer block** that states what OJ is and the wedge, so it satisfies the searcher in the first screen and is liftable by AI Overviews:
   > *"Orange Jelly is a pub marketing agency run by a working licensee — Peter Pitcher, who runs The Anchor in Stanwell Moor. Not a generalist hospitality agency with account managers: the person advising you on filling your pub fills his own, every week. We grew table bookings 403% and food revenue 98% at our own pub, and we do the same work for yours from £375 + VAT, with a 30-day action guarantee."*
   (Every number above is from `/CLAIMS.md`.)
2. **Make the "Real Numbers From a Real Pub" block carry ALL FIVE approved CLAIMS, not a subset**, each tagged "at The Anchor, our own pub": +828% Google Search visibility · +403% table bookings · +567% private hire bookings · −89% booking no-shows · +98% food revenue in three months. This is the differentiator no competitor SERP result can match (they show client logos, not the agency's own venue).
3. **Add a "What you get vs a normal agency" comparison block** (two columns, not a price war): *Them* — retainers, account managers, monthly reports, jargon. *Us* — fixed packages from £375 + VAT, you talk to the publican who does the work, a 30-day action guarantee. Colour must not be the only differentiator (label each column in text — accessibility).
4. **One primary CTA repeated at top, mid, and end** — "Tell Peter what's broken" → `/contact` (the contact page leads with "Speak directly with Peter"). Secondary: "See the packages" → `/ways-to-work`. Avoid the every-service link dump.
5. **Route into the channel + package pages** from the body ("Need just social? See social media for pubs. Just ads? See paid social.") — this also fixes the orphaned-page discovery problem (Technical C-3) by adding the inbound links those pages need.

#### Internal linking additions (also resolves the orphan/index blocker — Technical C-3)
- Inbound TO this page: from `/ways-to-work` ("Prefer the full agency view?"), `/capabilities`, homepage services area, and the social/events guide bridges with anchor **"pub marketing agency run by a publican"**.
- Outbound FROM this page: → `/services/social-media-marketing-for-pubs`, `/services/paid-social-for-pubs`, `/services/content-creation-for-pubs`, `/fix-my-pub`, `/ways-to-work`.

---

### 1.2 `/services/social-media-marketing-for-pubs` — must satisfy three inherited intents
**Target keywords:** `social media marketing for pubs` (380 impr, pos 12.0, 1c — Known) PLUS it is the redirect target for `facebook services for pubs` (123 impr, **pos 6.1**, 0c) and `instagram services for pubs` (256 impr, **pos 7.0**, 0c) — the two best-positioned commercial queries on the entire site (verified: `src/app/services/{facebook,instagram}-services-for-pubs/page.tsx` are 5-line `permanentRedirect` stubs to this page).
**Current status:** ~155-line render; metadata good. **This page inherits pos-6/7 rankings but the visitor lands on a generic "social media" page that never says "Facebook" or "Instagram" prominently — so the click never converts.**

#### Metadata
| Element | Current | Recommended | Notes |
|---|---|---|---|
| Title | `Social Media Marketing for Pubs — Instagram, Facebook and More` (60) | **Keep.** | Already names both inherited channels and hits 60 chars exactly. Good. |
| Meta description | `Social media marketing for pubs across Instagram and Facebook: a repeatable plan, templates, and execution rhythm that drives bookings and footfall. Packages from £375 + VAT.` (172) | Trim to ≤160: `Instagram and Facebook for pubs: a repeatable plan, templates and execution that drives bookings — done for you. Packages from £375 + VAT.` (137) | Current truncates at 172. Lead with the two channels (matches the inherited queries) + "done for you" (commercial-intent signal). |
| H1 | `Social Media Marketing for Pubs` (from `hero.title`) | **Keep.** | One H1; matches primary keyword. |

#### Content improvements (highest CTR-recovery on the site — pos 6–7 with 0 clicks)
1. **Add two visible H2 sections so the inherited rankings land on relevant content** (the redirect carries pos-6/7 equity; the page must answer the query the searcher typed):
   - `## Facebook for your pub` — events, local groups, reviews, clear offers; what OJ sets up and runs.
   - `## Instagram for your pub` — a Reels workflow, local engagement, phone-first content; what OJ produces.
   Give each an anchor (`#facebook-for-pubs`, `#instagram-for-pubs`) so the redirect can deep-link in future and the section is independently citable.
2. **Quotable opening answer block** (first 100 words): *"Social media marketing for pubs means turning Facebook and Instagram into a system that fills tables — not another daily chore. We build the plan, the templates and the posting rhythm, then either hand it over or run it for you. It's the same approach that grew our own pub's Google Search visibility by 828% at The Anchor. Packages from £375 + VAT."*
3. **One approved CLAIM, used well:** `+828% Google Search visibility` is the most relevant proof for a digital-visibility service (it is literally the search-visibility claim). State provenance: "at The Anchor, our own pub."
4. **Decision flagged to Risk Register (do NOT execute here):** whether to *restore* `/services/facebook-services-for-pubs` and `/services/instagram-services-for-pubs` as full named-channel pages (un-redirect) OR keep the redirect and rely on the H2s above. Restoring may recover the named-channel CTR better; consolidating concentrates equity. **Validate `facebook services for pubs` / `instagram services for pubs` demand via keyword-plan / GKP before deciding.** Copy is ready for either path.

#### Internal linking
- Inbound: from `social-media-strategy-for-pubs`, `facebook-marketing-pubs`, `instagram-marketing-pubs` guides with anchor **"get us to run your pub's social media"** (topic-matched bridge, see Section 3).
- Outbound: → `/services/paid-social-for-pubs` ("Want to put budget behind it?"), `/services/content-creation-for-pubs`, `/pub-marketing-agency`.

---

### 1.3 `/services/paid-social-for-pubs`
**Target keyword:** `paid social for pubs` (207 impr, pos 11.2, 0c — Known); secondary `facebook ads for pubs`, `pub advertising`.
**Current status:** metadata good; page exists.

#### Metadata
| Element | Current | Recommended | Notes |
|---|---|---|---|
| Title | `Paid Social for Pubs — Meta Ads That Fill Quiet Nights` (54) | **Keep.** | Keyword-first, benefit-led, good length. |
| Meta description | `Facebook and Instagram ads that sell one specific night — your quiet Tuesday, Sunday lunch, or event. Locally targeted and measured on real bookings. Packages from £375 + VAT.` (174) | Trim to ≤160: `Facebook and Instagram ads that fill one specific night — quiet Tuesday, Sunday lunch or an event. Locally targeted, measured on bookings. From £375 + VAT.` (155) | Only change: length. |
| H1 | `Paid Social for Pubs` | Keep. | |

#### Content improvements
1. **Quotable opener:** define paid social for pubs in one liftable sentence — *"Paid social for pubs is running small, local Facebook and Instagram ad campaigns that fill one specific night — your quiet Tuesday, your Sunday lunch, your next quiz — and measuring success on bookings, not likes."*
2. **Add a "What a campaign costs and includes" block** with the packages-from £375 + VAT anchor and the 30-day action guarantee — sceptical, time-poor licensees need the price objection answered on-page (it's the agency-sceptic audience the strategy describes).
3. **One CLAIM:** `+403% table bookings` (most relevant to "fill the night" intent), provenance The Anchor.
4. **Primary CTA:** "Tell Peter the night you need filling" → `/contact`.

#### Internal linking
- Inbound: from `/services/social-media-marketing-for-pubs`, `midweek-pub-offers-that-work` and `quiet-midweek-solutions` (anchor **"run paid social to fill the night"**).
- Outbound: → `/quiet-midweek-solutions`, `/ways-to-work`.

---

### 1.4 `/services/content-creation-for-pubs`
**Target keywords:** `content creation for pubs` (226 impr, pos 14.8, 0c) and `content creation services for pubs` (86 impr, **pos 8.8**, 0c — Known).
**Current status:** metadata good.

#### Metadata
| Element | Current | Recommended | Notes |
|---|---|---|---|
| Title | `Content Creation for Pubs — Phone-First, Done in Hours` (54) | **Keep.** | Good; "Done in Hours" is a strong time-poor hook. |
| Meta description | `Photos, Reels, captions, and a batching system so you create a week of pub content in one session. Phone-first and no editing skills needed. Packages from £375 + VAT.` (165) | Trim to ≤160: `Photos, Reels and captions plus a batching system — a week of pub content in one phone session. No editing skills needed. Packages from £375 + VAT.` (148) | Length only. |
| H1 | `Content Creation for Pubs` | Keep. | |

#### Content improvements
1. **Add a visible "Content creation services for pubs" phrasing** in an H2 or opening line — the page ranks pos 8.8 for the `...services...` variant, so the word "services" should appear naturally near the top.
2. **Quotable opener** defining the service + the time-saved benefit (no raw "hours reclaimed" number — that claim is retired per `/CLAIMS.md`; frame qualitatively: "without it eating your week").
3. **One CLAIM:** `+98% food revenue in three months` works if content is food-led; otherwise `+828% Google Search visibility`. Pick one, provenance The Anchor.
4. **Primary CTA** → `/contact`; bridge ← from `content-marketing-ideas-pubs` guide (Section 3).

---

### 1.5 `/fix-my-pub` — the rescue/turnaround capture page (strong existing position)
**Target keyword:** `fix my pub` (109 impr, **pos 5.7**, 1c — Known); secondary `pub business recovery` / `...recovery services [town]` (pos 7.9 on Stockport variant).
**Current status:** route uses inline `generateMetadata` (NO seoOverride entry — verified); current title `Fix My Pub — Emergency Turnaround Help From a Working Licensee` (60). One of FOUR overlapping rescue pages (`/fix-my-pub`, `/pub-rescue`, `/empty-pub-solutions`, `/quiet-midweek-solutions`) — consolidation owned by Content Strategist (CAN-3, Risk Register). **This page should be the canonical rescue destination.**

#### Metadata
| Element | Current | Recommended | Notes |
|---|---|---|---|
| Title | `Fix My Pub — Emergency Turnaround Help From a Working Licensee` (60) | **Keep.** | Keyword-first, 60 chars, differentiator present. |
| Meta description | `Pub in crisis or just struggling? I run one myself. Tell me what is wrong and I will show you the fastest fix — diagnosis, reset plan, and hands-on support. Packages from £375 + VAT.` (181) | Trim to ≤160: `Pub struggling? I run one myself. Tell me what's wrong and I'll show you the fastest fix first — diagnosis, reset plan, hands-on support. From £375 + VAT.` (153) | Length only; keep the first-person publican voice (it converts for this audience). |
| H1 | `Pub Struggling? Let's Fix It` (from `hero.title`) | Keep. | First-person, empathetic — right for crisis intent. |

#### Content improvements
1. **Tie explicitly to the 30-day action guarantee** in the opening block — the guarantee is the single strongest objection-killer for a frightened, sceptical operator: *"If you don't have a clear, prioritised action plan within 30 days, you don't pay."* (Confirm exact guarantee wording with Peter before shipping; the CLAIMS file confirms a 30-day action guarantee exists.)
2. **Quotable answer block:** *"'Fix my pub' starts with one question: what's the single biggest thing bleeding money right now? We diagnose it, fix the highest-impact problem first, and give you a 30-day action plan. We turned our own pub around — table bookings +403%, no-shows down 89% at The Anchor."*
3. **Add a regional line for the recovery-services-with-location intent** (e.g. *"We help pubs across the UK, not just the South East"*) — the `recovery services stockport` pos-7.9 signal shows location-modified rescue demand; one honest sentence captures it without building doorway pages.
4. **CTA:** "Tell Peter what's broken" → `/contact` (matches the existing hero CTA).

#### Internal linking
- This is the **single canonical rescue bridge target** for the empty/quiet/why-is-my-pub-empty guide cluster (CAN-3). All those guides should bridge HERE, not to four competing pages.

---

### 1.6 `/ways-to-work` (the live commercial hub — `/services` 308-redirects here)
**Target keyword:** `pub marketing packages`, `pub marketing pricing`, `pub marketing cost`.
**Current status:** live 200, 1 H1, valid schema, 130 inbound links — but appears in not-indexed backlog (Technical C-4: confirm via URL Inspection, likely a stale `1970-01-01` export). Metadata good. **Missing priced `Offer`/`Service` schema** (Technical, Risk Register).

#### Metadata
| Element | Current | Recommended | Notes |
|---|---|---|---|
| Title | `Pub Marketing Packages — Clear Pricing, Real Expertise \| Orange Jelly` (65) | Tighten to ≤60: `Pub Marketing Packages — Clear Pricing From £375 + VAT` (53) | Current is 65 (truncates). New version surfaces the price anchor — a strong CTR driver for a pricing-intent searcher. |
| Meta description | `Four clear packages for pub and hospitality marketing. From a one-off Growth Fix to ongoing Growth Partner support. Payment plans available. No hidden fees.` (155) | **Keep.** | Good length, transparent-pricing angle is on-strategy. |
| H1 | Verify exactly one (Technical confirmed 1). | — | |

#### Content improvements
1. **Add a one-line "which package am I?" decision aid** at the top mapping symptom → package (one problem = Growth Fix; ongoing = Momentum Month / Growth Partner; crisis = Turnaround Intensive). Reduces choice paralysis = more enquiries.
2. **Repoint the 4 stale guide links** that still point at `/services` to `/ways-to-work` (Technical C-4) — content task, drops the redirect hop.
3. **CLAIMS proof strip** with all five approved metrics, provenance The Anchor.

---

### 1.7 `/pub-marketing` and `/capabilities` — clarify role, avoid cannibalisation (CAN-5)
**Status:** both not indexed; overlap with `/services` hub and `/pub-marketing-agency`. Metadata already good (verified in `seo-overrides.ts`). **Recommendation owned jointly with Content Strategist:** pick ONE canonical for the broad "pub marketing" query (666 impr, pos 22.3). Copy guidance:
- `/pub-marketing` → position as the **broad educational hub** ("what pub marketing is and the levers that move trade") that routes down to `/services` (catalogue) and `/pub-marketing-agency` (done-for-you). Keep title `Pub Marketing — Proven Systems From a Working Licensee`.
- `/capabilities` → if it survives the Content Strategist's de-dup, position strictly as the **"what's in each package" detail page**, internally linked from `/ways-to-work`, not competing for the head term. If duplicative → Noindex candidate (Risk Register, not here).
- **No metadata change needed**; the lever is role-clarity + indexation, not copy length.

---

## SECTION 2 — Top guides: position-improvement (metadata is already good — do NOT rewrite titles)

For every guide below I verified the current title/description in `src/lib/seo-overrides.ts`. **All are already well-optimised** (keyword-first, correct length, CLAIMS where relevant). The position-improvement lever is **content depth + answer blocks + the dual-H1 fix (Technical C-1)**, not metadata. I note any genuine micro-tweak; otherwise "keep".

### 2.1 `summer-pub-event-ideas` — biggest impression pool on the site
**7,572 impr, 96c, pos 15.1 (Known).** Title `Pub Event Ideas for Summer: 35 That Make Money` (46) and description are good. **Keep metadata.**
**Content (lift pos 15→top-10):**
1. **Add a concise answer block under the H1** answering "what are the best summer pub events?" in 40–60 words (snippet/AI-Overview target; the SERP shows PAA + AI Overview on this query per serp-snapshots.md).
2. **Add a costed/ranked-by-profit angle** the competitors (generic idea lists) lack — the excerpt already promises "ranked by profit"; make sure the body delivers a clear profit ranking, which is OJ's differentiator vs Greene King's `valueforvenues` and supplier listicles.
3. **Topic-matched bridge** → events service / `/ways-to-work` with anchor **"want us to plan your summer programme?"** (see Section 3), not the generic category CTA.
4. The dual-H1 defect (Technical C-1) currently splits the topic signal on this exact page — flag as the dependency that most helps this page's position.

### 2.2 `profitable-pub-food-menu-ideas` — closest to top-10 already
**4,479 impr, 67c, pos 7.4 (Known).** Title `Profitable Pub Food Menu Ideas (High-Margin Picks)` (50) + description carrying `+98%` are good. **Keep metadata.**
**Content:** smallest push needed — add a tight "most profitable pub food" answer block (matches the `most profitable bar food` SERP framing) and ensure `+98% food revenue in three months` proof is visible mid-page with provenance. Bridge → menu/content service.

### 2.3 `social-media-strategy-for-pubs` — the clearest info→commercial bridge on the site
**3,836 impr, 37c, pos 12.6 (Known).** Title `Social Media Strategy for Pubs (Weekly System)` (46) good; description already carries `+828%`. **Keep metadata.**
**Content:**
1. The title/excerpt say "2025" in the frontmatter (`The Complete Social Media Strategy Guide for Pubs in 2025`) — the **body/headers should not show a stale year**; update any "in 2025" in-body to evergreen or current. (The override title already avoids the year — good; check the H1/body.)
2. **Strongest bridge candidate:** this guide should bridge DOWN to `/services/social-media-marketing-for-pubs` (which inherits the pos-6/7 channel rankings). Anchor: **"or get us to run it for you →"**. This single link connects the informational authority (3,836 impr) to the best-positioned commercial page.

### 2.4 `content-marketing-ideas-pubs`
**2,158 impr, 15c, pos 15.6 (Known).** Title `Pub Content Ideas: What to Post to Fill Tables` (46) good. **Keep metadata.**
**Content:** improve depth/intent match; add answer block; **bridge → `/services/content-creation-for-pubs`** (anchor "done for you in one phone session").

### 2.5 `pub-refurbishment-on-budget`
**1,792 impr, 13c, pos 14.7 (Known).** Title `Pub Refurbishment on a Budget: Fix First Guide` (46) good. **Keep metadata.**
**Content:** absorb `bar refurbishment` (127 impr) and `pub refit` (65 impr) variants as H2s/synonyms; add a "what to fix first under £5K" answer block. Bridge is weaker here (low commercial intent) — link to `/fix-my-pub` only if the page frames refurb as part of a turnaround.

### 2.6 `christmas-pub-promotion-ideas`
**1,375 impr, 17c, pos 11.6 (Known).** Title `Christmas Pub Promotion Ideas That Drive Revenue` (48) good. **Keep metadata.**
**Content:** seasonal refresh ahead of Q4 (dates/this-year framing in body, not slug — slug is evergreen, good); answer block for "how to promote a pub at Christmas". Confirm indexation with Technical (flagged in one drilldown). Bridge → events service / `/ways-to-work`.

### 2.7 `compete-with-wetherspoons` (1,050 impr, 13c, pos 9.2) & `quiz-night-101` (1,372 impr, 16c, pos 7.8) & `midweek-pub-offers-that-work` (902 impr, 10c, pos 7.8)
All near/at top-10 with good metadata (verified). **Keep metadata.** These are bridge + answer-block candidates:
- `compete-with-wetherspoons` → bridge to `/compete-with-pub-chains` (commercial) — note **Wetherspoons/chains framing must stay accurate; Greene King = Tenant** if GK is ever mentioned in comparisons.
- `quiz-night-101` & `quiz-night-ideas` → bridge to `/quiet-midweek-solutions` or events service (quiz fills midweek). Resolve the quiz duplication first (CAN-2: `quiz-night-ideas` is the leader; retarget `quiz-night-101` to the beginner "how to run a pub quiz" intent — its override title already does this well).
- `midweek-pub-offers-that-work` → bridge to `/quiet-midweek-solutions` → `/services/paid-social-for-pubs`.

---

## SECTION 3 — Info→commercial bridges (the single biggest commercial lever)

**Problem (verified in code):** the guide template's bridge is `getCategoryCTA()` in `src/components/blog/BlogPost.tsx` — a generic, category-based block (4 hard-coded variants) whose button is always **"See Our Packages" → `/ways-to-work`**. It is the same boilerplate on every guide; `internal-links.csv` confirms ~38 evenly-distributed guide→commercial links = a sitewide block, not topic-matched bridges. The guide proves competence but sends a convinced reader to a generic hub instead of the matching service.

**Fix type: Template/system fix (primary) + Content process fix.** Make the bridge topic-matched per cluster, with a single relevant service link and peer-to-peer voice. Implementation options for the developer:
- **Option A (preferred):** extend `getCategoryCTA()` to return `{ heading, body, href, anchorText }` keyed by category/cluster, so each guide's bridge points to its ONE matching service. Mapping below.
- **Option B:** add an optional `serviceBridge` field to guide frontmatter (`{ href, heading, anchor }`) overriding the category default for the top ~15 guides, falling back to the category map.

**Cluster → service mapping (anchor text in bold, peer-to-peer voice):**

| Guide cluster | Example guides | Bridge destination | Suggested heading + anchor |
|---|---|---|---|
| Events / summer / seasonal | summer-pub-event-ideas, pub-event-ideas, christmas-pub-promotion-ideas, pop-up-events-for-pubs | events angle of `/services` → `/ways-to-work` | "Want us to plan and promote your events programme?" — anchor **"get us to run your pub's events"** |
| Quiz / midweek | quiz-night-ideas, quiz-night-101, midweek-pub-offers-that-work | `/quiet-midweek-solutions` → `/services/paid-social-for-pubs` | "Quiet midweek? We fill Tuesdays and Wednesdays." — anchor **"fix your quiet midweek nights"** |
| Social media | social-media-strategy-for-pubs, facebook-marketing-pubs, instagram-marketing-pubs | `/services/social-media-marketing-for-pubs` | "Or get us to run your pub's social media." — anchor **"get us to run your social media"** |
| Content | content-marketing-ideas-pubs | `/services/content-creation-for-pubs` | "No time to make it? We do it for you in one phone session." — anchor **"content creation for pubs"** |
| Empty / quiet / struggling | fill-empty-pub-tables, why-is-my-pub-empty, nobody-books-tables-anymore, pub-empty-tuesday-nights | `/fix-my-pub` (single canonical, CAN-3) | "Pub feeling empty? Tell me what's broken." — anchor **"fix my pub"** |
| Food / menu | profitable-pub-food-menu-ideas, menu-engineering-lift-average-spend | menu/content angle of `/services` | "Want help re-engineering your menu for margin?" — anchor **"pub menu help"** |
| Compete / chains | compete-with-wetherspoons, recession-proof-pub-strategies | `/compete-with-pub-chains` | "Build a challenger position with us." — anchor **"compete with pub chains"** |

**Copy rules for every bridge:** one CLAIM max (the most relevant approved percentage, provenance The Anchor); peer-to-peer ("one publican to another"), not agency-speak; one primary link; keep the existing footer block but stop treating it as "the bridge". Each bridge must read like advice, not a banner (per strategy: "contextual, non-salesy").

**Validation:** after the template change, `internal-links.csv` re-crawl shows topic-clustered (not evenly-distributed) guide→service links; GA4 (once SEO-001 lands) shows guide→service path + enquiry events.

---

## SECTION 4 — Homepage & contact (conversion-path copy)

### 4.1 Homepage `/`
**Title** `Hospitality Marketing That Fills Seats | From a Real Publican` (61) — 1 char over; trim pipe spacing or shorten to `Hospitality Marketing That Fills Seats — Real Publican` (54). **Description** already carries `+403%` and `+98%` — keep. **H1** good. Content: ensure the five CLAIMS proof strip is above the fold on mobile (mobile ranks/converts best — strategy §2); one clear primary CTA to `/contact` and one to `/ways-to-work`.

### 4.2 `/contact` (the enquiry destination)
**Title** `Contact Us - Speak Directly with Peter | Orange Jelly` (53) and **H1** `Talk to a Hospitality Growth Partner` are good. **Recommendation:** the H1 and title use different framings ("Peter" vs "Hospitality Growth Partner") — align to the peer-to-peer voice that converts this audience: consider H1 **"Talk to Peter — a working publican, not a call centre"**. Reduce form friction (UX/CRO owns this in Phase 4); copy should reassure ("no obligation, no agency pitch — just honest advice") and reference the 30-day action guarantee. **Analytics dependency:** the contact form currently only `console.log`s (no capture, no event — analytics §6); enquiries are unmeasurable until SEO-001 lands. Flag, don't fix here.

---

## New content outlines

Net-new content is **not** the copywriter's call to originate (Content Strategist owns it). The one validated gap they flagged — **Family & kids events for pubs** (≈1,000+ impr scattered pos 20–37) — needs `family events for pubs` volume validated via keyword-plan / GKP **before** building. When commissioned, the page should: target `family friendly pub events` / `how to attract families to pubs`; H1 "Family & Kids Events for Pubs That Fill Quiet Afternoons"; answer block; cost-ranked ideas; bridge → events service. Word count to match the consolidated events pillar, not an arbitrary number. **No outline committed until volume is validated.**
