# Repositioning decisions log

Decisions Peter has made, recorded so they are not quietly re-opened during design or build.
Cross-referenced to `docs/brand/growth-system-v0.1/13-open-decisions.md`, which lists 15 items the
pack refuses to decide on its own.

---

## Decided

| # | Decision | Made | Pack ref |
|---|---|---|---|
| D1 | **Existing URLs stay live.** No pub or hospitality URL is retired to make room for the new structure. Existing search authority is protected. Hospitality becomes a contained sector hub inside the new IA. Only thin or factually outdated pages are candidates for redirect, and each one is an individual call. **Refined by D14 once the Search Console data arrived.** | 26 Aug 2026 | Open decision 14 |
| D2 | ~~The five proof claims will be re-verified.~~ **CLOSED 27 Aug 2026. Peter validated the five metrics personally and they are approved for publication.** +828% search visibility, +403% table bookings, +567% private hire, minus 89% no-shows, +98% food revenue, all at The Anchor. No longer a blocker. The Results page, About page and case studies are unblocked. | 27 Aug 2026 | Open decision 13 |
| D3 | **No pricing on the site.** All work is bespoke. No hourly rate, no package prices, no "from" figures, no investment bands. Rationale: published estimates would read as high and put the right clients off before a conversation. The price-free `OfferCard` is correct by design. | 26 Aug 2026 | Open decisions 4 and 6 |
| D4 | **Request the missing designs** rather than inventing the absent page types. See `design-requests.md`. | 26 Aug 2026 | n/a |
| D5 | **Sequenced delivery under one governing plan.** The work ships in phases, but a single implementation spec covers everything first so nothing is missed. Discovery and research come before the spec. | 26 Aug 2026 | Open decision in `12-90-day-activation-plan.md` |
| D6 | **Geographic scope: UK-first.** Build, price and optimise for the UK. International work is accepted if it arrives, but no page, term or legal position assumes it. | 26 Aug 2026 | Open decision 8 |
| D7 | **First sectors beyond hospitality: professional services and trades.** These drive round 2 of the keyword research and the first non-hospitality case studies. Treated as a starting hypothesis to be tested against demand, not a commitment. | 26 Aug 2026 | Open decision 7 |
| D8 | **Entry is always a discussion first.** Every engagement begins with a conversation and discovery into what is causing the problem, before any solution is defined or sold. No visitor buys a product as step one. | 26 Aug 2026 | Open decision 4 |
| D9 | **"EXPOSE" to be pressure-tested** before it is baked into 44 components and 14 templates. | 26 Aug 2026 | Open decision 3 |
| D10 | **Design decisions settled by the designer** in the 26 Aug handback: lowercase display headings site-wide, orange header on conversion pages only, Schibsted Grotesk treated as production, hospitality pages take the full design system, seven muted taxonomy hues that are never orange. | 26 Aug 2026 | Open decisions 11 and 12 |
| D11 | **Primary CTA is "Start the conversation"**, site-wide, replacing "Book a growth diagnostic". The diagnostic is what the conversation leads to, not the thing a visitor buys from a button. Follows from D8 and D3. | 26 Aug 2026 | Open decision 4 |
| D12 | **The first discovery conversation is free.** Paid engagement begins once the problem is worth defining properly. | 26 Aug 2026 | Open decision 4 |
| D13 | **Lead sector is professional services. Trades is a second wave.** Round 2 data: professional services 7,950 monthly against 1,450 for trades, and six top-tier terms against two, one of which is software purchase intent. Trades pages get added later, individually, once the professional services hub is proven. | 26 Aug 2026 | Open decision 7, revises D7 |
| D14 | **D1 refined against evidence, not reversed.** Search Console shows the site earns 969 clicks a year, of which the blog takes 92.9%. Untouchable: the ~30 blog posts carrying 95% of blog clicks. Free to restructure: the 12 pub landing pages, 5 service pages, `/ways-to-work`, `/capabilities`, `/compete-with-pub-chains`, `/quiet-midweek-solutions` and `/empty-pub-solutions`, which earn **11 clicks a year between them**. Individual review: the 62 blog posts that rank but earn nothing. | 26 Aug 2026 | Open decision 14 |
| D15 | **Improving existing rankings outranks building new pages.** 69,698 impressions produce 969 clicks at position 9 to 13. Fourteen posts carry 80% of blog traffic and most sit outside the top ten. Fixing them is higher-yield than any new page. The spec sequences ranking work alongside the rebuild, not after it. | 26 Aug 2026 | n/a |
| D16 | **Keyword research is closed at three rounds.** 243 terms tested, picture stable since round 2, fifteen terms worth building for. Round 4 (trades) deferred until the professional services hub is proven. | 26 Aug 2026 | Open decision 15 |
| D17 | **Marketing design tokens are scoped, not global.** The new palette and the lowercase heading rule apply to a marketing surface, never bare `:root`. `/availability` and `/admin` keep their current styling. Rationale: "out of scope" is a requirement, not a mechanism, and root custom properties reach every route regardless of intent. Visual regression tests cover both excluded areas. | 27 Aug 2026 | n/a |
| D18 | **`/about-demo` and `/test-shadcn` are deleted** in WS1. Both are publicly routable artefacts; `/about-demo` is a live `route.ts` handler indexed at 22 impressions. | 27 Aug 2026 | n/a |
| D19 | **The bearer-token security boundary on `/availability` is non-negotiable.** Organiser and edit URLs carry a token in the path, and `MarketingChrome.tsx` deliberately fails closed to stop it reaching GTM, Vercel Analytics or preconnects. **Correction: this was already well guarded.** `MarketingChrome.test.tsx` asserts no external URL renders on token routes, that the token never appears in the chrome, and that the root layout cannot bypass the gate. `token-routes.ts` is a shared source of truth for middleware and client. A runtime network check (`npm run check:token-privacy`) has been added on top, and passes against production. | 27 Aug 2026 | n/a |
| D20 | **"EXPOSE" is rejected.** Peter does not like it. The method's second step needs a different word. `PLAN` was considered and is not recommended, see the note below. Final word not yet chosen, so no template or component copy is written until it is. Supersedes D9. | 27 Aug 2026 | Open decision 3 |
| D21 | **The brand is Orange Jelly, not Peter.** Company voice throughout, "we" not "I". No founder story as a page structure. The Anchor is framed as "our own venue" and "the business we run", never "Peter's pub". Article bylines keep a named human author, because schema and search need one, but no page is built around the founder. | 27 Aug 2026 | Open decision 9 |
| D22 | **No expletives anywhere on the site.** Not on the homepage, not on About, not in the manifesto. This overrides the brand pack's expletive rule (`05-tone-of-voice.md`), which permitted partially censored use in founder-led and campaign content. Social and campaign use remains Peter's call, off-site. | 27 Aug 2026 | Open decision 11 |
| D23 | **No response-time promise on the site.** Orange Jelly does not commit to a number of days. Existing and new clients both need proper time, and a missed promise on first contact is worse than no promise. The acknowledgement confirms receipt and says a human will reply personally. | 27 Aug 2026 | n/a |
| D24 | **Analytics load before consent where they are cookieless.** Vercel Analytics and Speed Insights set nothing on the device, so they load unconditionally. Google Tag Manager sets `_ga` and stays behind consent, because PECR requires consent for device storage regardless of whether the data is personal. See the note below. | 27 Aug 2026 | n/a |
| D25 | **Lead retention is 24 months** from last contact, then deletion. Enquiries that become clients move to the client record. | 27 Aug 2026 | n/a |
| D26 | **The method is HEAR. CHALLENGE. BUILD. OPTIMISE.** Replaces HEAR. EXPOSE. BUILD. PROVE. `CHALLENGE` is a strong choice: it is active, distinctive, and already a stated brand behaviour ("Challenge early", "Challenge plus delivery"). `OPTIMISE` replaces `PROVE` as the fourth step. See the note below on what that costs and how to cover it. Closes D20 and supersedes D9. | 27 Aug 2026 | Open decision 3 |
| D27 | **GTM stays behind consent.** Peter accepts the split in D24. Cookieless Vercel Analytics and Speed Insights load unconditionally; Google Tag Manager and GA4 require consent. | 27 Aug 2026 | n/a |
| D28 | **Design authority order, confirmed with the design team.** When two files disagree: 1) the latest dated decision log (`HANDBACK-2026-08-27.md`), 2) the handback, 3) tokens plus `.d.ts` prop contracts plus `.prompt.md` rules, 4) templates, 5) overview and README, 6) superseded v1 material. Closes gap G1 and task T023. | 27 Aug 2026 | n/a |
| D29 | **Schibsted Grotesk is production, and self-hosted.** Substitute flags removed by the design team. Binaries go in `public/fonts/` with the `@font-face` src swapped, rather than the runtime Google Fonts import. | 27 Aug 2026 | n/a |
| D30 | **Gradients are banned as decoration, with two approved exceptions:** the lower-half highlight band device, and the slider and select treatments derived from it. `check-design-tokens.mjs` must allow exactly those. | 27 Aug 2026 | n/a |
| D31 | **Case-study figures ship without a verification caveat.** Follows D2. The design team has removed the caveat from the Results template. | 27 Aug 2026 | n/a |
| D32 | **The method's canonical copy is fixed.** HEAR: understand what is really happening, not only what the brief says. CHALLENGE: challenge comfortable explanations, find the pressure points that matter. BUILD: design and implement the right practical solution. OPTIMISE: measure against the agreed baseline, learn, improve and go again. OPTIMISE is a bounded measurement loop, never open-ended retainer language. | 27 Aug 2026 | n/a |
| D33 | **Focus ring is ink, not orange.** The outer band of the double focus ring is `--oj-ink`. Orange measured 2.73:1 on cream and 2.87:1 on paper against the 3:1 WCAG 1.4.11 requires, so the indicator was failing keyboard users on the two surfaces it appears on most. Ink is 14.02:1 and 14.76:1, and it self-corrects on the taxonomy tints and the peach band where a darkened orange has nothing left. Orange remains the action and pressure signal and is no longer described as the focus signal anywhere. | 28 Aug 2026 | Design team response |
| D34 | **`--oj-orange-deep` is `#B34E08` and `--cat-demand` is `#276E66`.** Both corrected two steps past the minimum rather than to it, on the design team's reasoning that a value clearing 4.5 by 0.02 is the same mistake as one missing by 0.0005. Accent text is approved on cream and paper only: it measures 4.32:1 on `--oj-cream-2`, so sunken surfaces take ink. | 28 Aug 2026 | Design team response |
| D35 | **The supplied pack is the single source of truth for colour, and parity is enforced by a test.** All seven `--cat-*-soft` tints had differed from `docs/brand/design-system/tokens/colors.css` since they were first written, undocumented, while the commit introducing them claimed no value had changed. The drift made our contrast measurements describe a palette nobody else was running, and it hid a real failure in `--cat-ops`. All seven are synced; a parity test fails the build on any divergence that is not a recorded design-team correction. | 28 Aug 2026 | Discovered applying D33 and D34 |
| D36 | **`--cat-ops` fails AA on its own tint and is tracked, not fixed locally.** `#6B6D2F` on `#E9E9DC` is 4.4513:1 against 4.5:1 at the pack's own 12.5px bold. Both values are the design team's, so the hue is theirs to correct; fixing it here would recreate the private fork D35 just removed. Latent rather than live: `CategoryTag` has no production consumer and the tint only applies when `filled` is passed. Marked `it.fails` so it flips the moment a corrected hue lands. | 28 Aug 2026 | Raised in DESIGNER-CONTRAST-2026-08-28.md |
| D37 | **Orange sections move to a band surface so white text can carry them.** Peter asked for white text on orange for impact. On the brand orange white is 2.97:1, failing body text and failing the 3:1 large-text floor too, so it could not ship as asked. `--oj-surface-band` renders those sections on `--oj-orange-deep`, where white is 5.24:1 and passes at any size. The brand orange keeps its job as the action fill, where text is ink at 5.13:1. Applied to the three hero bands, the campaign header and the sticky bar. One line reverts it if Peter prefers the lighter ground with ink text. | 28 Aug 2026 | Raised in DESIGNER-CONTRAST-2026-08-28.md |
| D38 | ~~The ink control border on a band is 2.92:1 and stays.~~ **SUPERSEDED by D43, 30 Aug 2026.** Put to Peter as a design question; he chose the white border. The reasoning here was sound and the premise was too narrow: it treated the shortfall as seven band buttons, and the rendered audit that followed found twenty-five buttons on dark grounds carrying a border between 1.00:1 and 2.92:1. | 28 Aug 2026 | Superseded |
| D39 | **`/pub-rescue` becomes `/why-revenue-is-falling`.** Peter's instruction: the six causes behave the same way outside hospitality, so the page stops being pub-specific. It earned 6 clicks in twelve months and the query "pub rescue" earned none of them, so the move is close to free, and D14 puts these landing pages in the free-to-restructure group. Permanent redirect from the old URL, and the phase 4 redirects repoint at the new one directly so no chain forms. The five FAQs it ranked for come back rewritten to obey D3, D21 and D23. The hospitality specifics stay on `/pub-marketing`. **Worth Peter knowing: "rescue" carries insolvency connotations in UK usage, and the page turns away businesses that genuinely cannot pay.** The page opens by saying so, which is the mitigation, but a different word is available if he wants one. | 28 Aug 2026 | Peter, 28 Aug 2026 |
| D40 | **`--oj-ink-3` darkened from `#757784` to `#666873`.** The muted text token cleared none of the three surfaces it renders on: 4.29:1 on paper, 4.08:1 on cream, 3.66:1 on cream-2, against the 4.5:1 body text needs. It carries field hints, breadcrumbs, captions and card context, so it was failing on every page. It was also sitting in the suite's 3:1 group on the reasoning that muted text is secondary, which does not survive looking at where it renders, at 13px. `#666873` is the same hue at 87%, the shallowest darkening that clears all three, and still reads clearly lighter than the full ink. Recorded as an approved divergence so it cannot drift. **Third correction to the pack and not yet confirmed by the design team.** | 28 Aug 2026 | Raised in DESIGNER-CONTRAST-2026-08-28.md |
| D41 | **Contrast is audited on the rendered site, not only in the palette.** `npm run audit:contrast` renders all 34 live routes and measures every visible text node against its real composited background. The unit tests check that the palette's pairs are sound; they cannot check that a component reaches for the right pair, and every failure found was in that gap. It is a command rather than a build gate because it needs a running server. Findings left unfixed on purpose: 27 on five pages that redirect in phase 4, 9 on the internal component gallery, and the D36 tint. | 28 Aug 2026 | Recorded in DESIGNER-CONTRAST-2026-08-28.md |
| D42 | ~~Seven pages survive launch still publishing a price.~~ **WRONG, corrected 31 Aug 2026.** They do not survive. `/ways-to-work/:slug` and `/services/:slug` are declared phase 4 redirects and retire all seven the moment the release ships, which is the same release that turns the rest of the redirects on. The original finding came from looking for exact-path entries and not noticing the two wildcards that cover them. Peter asked for the pages to be retired; they already were. **What the recheck did find is real and now fixed:** two `/services` pages redirected to a third that itself retires, so on release day they would have hopped twice. Both chain tests were blind to it, because they compared sources as plain strings and the active one skipped wildcard sources altogether. The tests understand patterns now, and they caught it. Release-day table: 0 chains, 7 of 7 retired. | 31 Aug 2026 | Closed |
| D43 | **White text on every orange button, and an outline that inverts rather than vanishes.** Peter: "Make the boarder white and all text on an orange button needs to be white too." White text cannot go on the brand orange: `#f76b0c` gives 2.97:1 and every button label is bold but under 18.66px, so it needs 4.5:1 and fails even the 3:1 floor. The fill therefore drops to `--oj-orange-deep` (white 5.24:1) and to `--oj-ember` on the band (8.83:1). **Consequence Peter should see: brand orange leaves button fills entirely**, surviving on tags, pagination, method steps and the secondary button's shadow. The white border applies on dark grounds only: on cream it is 1.09:1 and would disappear, taking the heavy outline that defines the look with it. The rule written instead is that the outline is always the strongest neutral against its ground, ink on light and white on dark. Buttons are now nine cells of role by ground, the ground comes from React context rather than being typed at the call site, and the colour-named variants are deleted from the type union so a call site naming a colour fails to compile. | 30 Aug 2026 | Peter, 30 Aug 2026 |
| D44 | **His instruction fixed far more than the question that prompted it.** The rendered audit found, all shipping: two buttons with an ink fill on an ink ground at 1.00:1, invisible; eighteen more primaries with an ink border on ink at 1.00:1; seven with an ink border on the band at 2.92:1; and the ghost band hover shadow at 2.92:1. Twenty-five buttons on dark grounds in total. None of it was visible in the source, because every one of them read `variant="primary"` with no colour named. The ground resolver is what stops it recurring: the surface is declared once by whatever paints it, not remembered at each of thirty-five call sites. | 30 Aug 2026 | Recorded |
| D45 | **Canonicals are guarded, because they are the reference that goes stale silently.** `/why-revenue-is-falling` shipped pointing its canonical at `/small-business-rescue`, the name it held for two days between the de-sectoring and the reframe. That name never went live, so nothing redirects it and the tag named a 404 as the page's true address. Nothing read it, so nothing caught it, and it was found by accident. Every page's declared canonical is now asserted to name a live route, not to be a redirect source, and not to be shared with another page. No other page had it. | 31 Aug 2026 | Closed |
| D46 | **Peter's positioning overview is the source of truth for voice and message.** Supplied 31 Aug 2026, stored verbatim at `docs/brand/positioning-overview.md`, 38 sections. It supersedes earlier positioning language in this repo; where the site and the document disagree, the site changes. Three lines its section 37 asks to be preserved exactly: "For business owners ready to take control of growth." / "Orange Jelly is a strategic growth partner for ambitious businesses." / "Strategy first. Then the right combination of marketing, technology, process and action to make growth happen." (the third is working copy). Two things in it bite hardest on existing copy: the target is ambitious owners who want more, explicitly **not** people who want rescuing (sections 2 and 14), and section 34 warns against leaning on "help", "freedom", "success", "problem" and "empire" in customer-facing copy. It does **not** override CLAIMS.md or the decisions above. | 31 Aug 2026 | Peter, 31 Aug 2026 |
| D47 | **Company voice, grounded in real operating experience. CLOSED 31 Aug 2026.** Peter: "Orange Jelly is about the company, but my voice as founder has to be grounded in experience that people can trust." So D21 stands: the site speaks as "we", never in the founder's first person. What changes is that the experience behind the voice has to be visible rather than implied. The site says what it has actually run and what that taught it, and names The Anchor as a real trading business with a wage bill and suppliers, because that is the evidence the claim rests on. **In practice:** "we run a business, and this was tested there before it was offered to anybody" is right; "I run a pub" is not. Sections 17 and 18 of the positioning overview are satisfied by the substance being present, not by the grammar being first person. It also keeps section 38 intact, where Orange Jelly has to be able to outgrow one person. | 31 Aug 2026 | Peter, 31 Aug 2026 |

## Consequences of D3 worth naming

Removing pricing removes the filter the pack was relying on. `07-offer-architecture.md` treats
minimum engagement values as "one of the most important filters against low-value work", and the
public price was doing that job on the current site.

If price is not filtering, something else must, or the enquiry inbox fills with work Orange Jelly
does not want. The realistic replacements are the qualification form, the fit section, and the
diagnostic-first entry route. This needs designing deliberately, not left to chance.

**This is not a reason to reverse D3.** It is a requirement D3 creates. Flagged for the spec.

## Consequence of D8 worth naming

The pack sets the primary button as **"Book a growth diagnostic"** and demotes **"Bring us the
problem"** to a campaign line. D8 reverses the logic. If the first step is always a discussion, then
the primary action is a conversation, not a purchase, and "Book a growth diagnostic" reads as buying
a product before anyone has agreed what the problem is.

**Recommendation: promote "Start the conversation" to the primary site-wide CTA** and keep the
diagnostic as what the conversation leads to. This also solves a second problem. With no price on
the site (D3), a button that says "book" invites the question the page cannot answer.

Flagged for the spec. Affects every template, since the CTA appears in Header, StickyCTA, CTA bands
and NextStep.

## Consequence of the round 1 keyword data

The category phrase and the symptom language both returned close to zero Google demand. See
`keyword-research.md`. The practical effect on this plan:

- The eight growth-problem pages still get built, but as conversion and AI-citation assets. They
  should not carry an organic traffic target.
- The 106 hospitality posts remain the traffic engine and need investment, not just preservation.
- "Hospitality marketing agency" is the highest-value term in the set and the pack bans it as a
  description. It stays in the sector hub where it is accurate, and out of the company description.

## Still open, needed before copy is final

- **Swearing boundary on the permanent homepage.** The pack recommends keeping expletives to
  founder-led and campaign content only.
- **Founder versus company brand.** How much delivery stays visibly Peter-led.
- **Greene King and BII logo migration** into LogoStrip. Files exist in `public/`. Designer is
  waiting on the go-ahead.

## Consequence of the round 2 keyword data

`AI for [profession]` is the strongest demand cluster found across 177 tested terms, and the brand
pack bans leading with AI. Both hold, on one condition: **AI is the entry, growth is the
conversion.** Articles answering "where does AI actually help an accountancy practice" are exactly
the useful, challenging content the pack asks for, and they conclude that the AI question sits
downstream of a business question. AI stays out of the company description, the homepage and the
category. See `keyword-research.md` Finding 7.

The `fractional` cluster gets one page that uses the language to be found and then argues against
the format: a business with problems across demand, margin and operations does not need a fractional
CMO, it needs someone who can see all three. See Finding 8.

## Consequence of the search data

Two things in the plan were built on an assumption the data has now corrected.

**The authority we were protecting is smaller and differently placed than we thought.** It is not
the pub landing pages, it is about thirty blog posts. That frees the commercial-page restructure to
be decisive rather than cautious, and it makes those thirty posts genuinely precious.

**The proof story got better.** `the-anchor.pub` earns fifteen times the search traffic of
`orangejelly.co.uk`, and 41.7% of it comes from aviation content rather than pub content. The live
laboratory is not a rhetorical device, it is the demonstrably more successful search property, and
its success came from finding demand nobody in the business would have named. That is the case
study. See `anchor-search-performance.md`.

## Still to resolve before the spec is final

- **Proof verification (D2) has not started** and now blocks the Results page, the About page and
  every case study. The Anchor export covers 12 months with no baseline, so it cannot verify the
  +828% claim on its own.
- **Product subdomains** (`cheersai`, `mixerai`, `management`) sit inside the orangejelly.co.uk
  Search Console property with URLs indexed. They need a decision about whether they belong there.
- **`/about-demo` is live and indexed.** Leftover demo page, should not be public.

## Consequence of the developer review, 27 August 2026

The review of spec v1.0 raised 54 findings. Response and disposition in `SPEC-REVIEW-RESPONSE.md`,
spec reissued as v1.1. Four decisions came out of it: D2 closed, plus D17, D18 and D19 above.

The two findings that mattered most were not in the numbers. Phase 3 as written would not have
resolved the old-versus-new contradiction, because the old position also lives in root metadata,
structured data, feeds, `llms.txt`, the manifest and the navigation JSON. And "out of scope" for
`/availability` was a statement of intent with no mechanism behind it, over a route family that
carries bearer tokens in the URL.

Open copy decisions still needing an answer, each now tied to the page it blocks: whether "EXPOSE"
is approved (`/how-we-work`), founder versus company presentation (`/about`), and whether an
expletive appears on any permanent page (homepage, `/about`).

## Note on D20: why PLAN is not recommended

`PLAN` was proposed as the replacement for `EXPOSE`. It is the weakest available option and it works
against the positioning.

The brand pack defines Orange Jelly explicitly against "a slide-deck consultancy that diagnoses and
disappears". Planning is what that consultancy sells. Every agency plans. The word carries no
information about what Orange Jelly does differently.

It also describes the wrong activity. Stage two's job in `06-signature-method.md` is to "find the
pressure points, root causes and opportunities that matter". That is diagnosis. A plan is an output
of it, not the work itself, and naming the output makes the method sound like it ends at a document.

Recommended instead: **HEAR. FIND. BUILD. PROVE.** Four single-syllable active verbs, and "find" is
already in the pack's own signature lines ("We find where growth is being blocked and make the right
change happen").

On adding `OPTIMISE` as a fifth step: not recommended. `PROVE` already contains test, iterate and
"decide whether to scale, adjust or stop". A permanent fifth step implies the work never finishes,
which contradicts the commercial principle that Orange Jelly stops when the agreed outcome is
reached. Ongoing work belongs in the Growth Partnership offer, not the method. Four steps also match
the 42 components and 14 templates already built around a four-step `MethodStep` sequence.

## Note on D24: the constraint behind the split

Peter asked for all analytics to load before consent, on the basis that there is no personal data in
them. That reasoning is sound for data protection but does not settle the question, because the
relevant rule is a different one.

PECR regulation 6 requires consent to store or access information on a user's device, whether or not
that information is personal. Analytics is not "strictly necessary" for delivering the service, so
it does not fall in the exemption. The ICO has enforced this position against analytics cookies
specifically.

The practical split gives most of what was asked for:

- **Vercel Analytics and Speed Insights are cookieless.** They store nothing on the device, so the
  device-storage rule is not engaged and they can load unconditionally. That covers traffic,
  referrers, page performance and journey shape.
- **Google Tag Manager sets `_ga`.** It stays behind consent.
- **First-party operational records** (a lead written because someone submitted a form) are records
  of a transaction the user initiated, not device storage, and are unaffected.

This is a good-faith reading, not legal advice. Peter can overrule it for GTM as an accepted
commercial risk, and that would be recorded here as a separate decision.

## Consequence of D21 for the design system

The `about` template ships a founder-story section with a photo placeholder. D21 removes the founder
story as a page structure. That section needs repurposing into the company's way of working, or
removing. Flag to the designer with the next batch of feedback.

## Note on D26: what dropping PROVE costs, and how it is covered

`CHALLENGE` is a better second step than either `EXPOSE` or `PLAN`. That part is settled and good.

Dropping `PROVE` has a cost worth naming, because the method is now the only place the discipline
was visible. The brand pack hangs its entire credibility argument on measurement:

- "Do not claim to be impactful. Show the problem, the change and the evidence."
- "Brilliant thinking is useless until it changes something."
- The positioning defines Orange Jelly against "a slide-deck consultancy that diagnoses and
  disappears", and measurement is the thing that separates them.

`OPTIMISE` means keep improving. It does not mean show it worked. A reader can now go through the
whole method without being told that Orange Jelly measures anything.

**This is Peter's decision and it stands.** The gap is covered elsewhere rather than by reopening it:

1. The `/how-we-work` page states the measurement commitment inside the `OPTIMISE` step: baselines
   agreed before work starts, impact measured against them, and the honest position where evidence
   is incomplete.
2. The `Results` page and `ProofCard` carry the evidence discipline in the design, which they
   already do.
3. The "every bold claim followed by proof" rule in `05-tone-of-voice.md` is unaffected and stays a
   copy gate.

Changing the fourth word is cheap now, while nothing is built. It becomes expensive once 14
templates and the method components carry it. If it is going to change, it should change before WS5.

## Note on D32: the measurement gap is closed

D26 dropped PROVE and with it the only measurement language in the method. The design team's
27 August handback closes that properly rather than papering over it. OPTIMISE now reads "measure
against the agreed baseline, learn, improve and go again", and the How We Work page carries an
explicit deliverables line: "Agreed success measures. Baseline and impact reviews on a repeating
cycle. Honest reporting when evidence is incomplete."

That is a better outcome than the original PROVE, because it states the discipline as a commitment
rather than a single word. The concern raised against D26 is resolved and needs no further action.

## Correction to D19, 27 August 2026

The spec claimed no test guarded the token-route boundary. That was wrong, and it
was my error rather than a gap in the codebase. `MarketingChrome.test.tsx` already
covers it thoroughly at unit level, and `src/lib/token-routes.ts` exists specifically
so middleware and the client gate cannot drift apart. The comments in both files
explain the credential-leak reasoning better than the spec did.

What was genuinely missing was a runtime assertion: a unit test can prove a component
renders nothing, but not that no request left the machine. `scripts/check-token-privacy.mjs`
now drives a real browser with analytics consent granted, which is the strong form of
the test, and asserts zero third-party requests on all three token routes.

It has to run against a deployment. Vercel Analytics is a no-op off Vercel and a local
`next start` does not reproduce the deployed environment, so nothing third-party loads
locally and a pass would prove nothing. The script has a control route that turns that
into a loud failure instead of a false pass.

Verified against production on 27 August: the homepage made 7 third-party requests, the
three token routes made none.
