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
| D11 | **Primary CTA is "Bring us the problem"**, site-wide, replacing "Book a growth diagnostic". The diagnostic is what the conversation leads to, not the thing a visitor buys from a button. Follows from D8 and D3. | 26 Aug 2026 | Open decision 4 |
| D12 | **The first discovery conversation is free.** Paid engagement begins once the problem is worth defining properly. | 26 Aug 2026 | Open decision 4 |
| D13 | **Lead sector is professional services. Trades is a second wave.** Round 2 data: professional services 7,950 monthly against 1,450 for trades, and six top-tier terms against two, one of which is software purchase intent. Trades pages get added later, individually, once the professional services hub is proven. | 26 Aug 2026 | Open decision 7, revises D7 |
| D14 | **D1 refined against evidence, not reversed.** Search Console shows the site earns 969 clicks a year, of which the blog takes 92.9%. Untouchable: the ~30 blog posts carrying 95% of blog clicks. Free to restructure: the 12 pub landing pages, 5 service pages, `/ways-to-work`, `/capabilities`, `/compete-with-pub-chains`, `/quiet-midweek-solutions` and `/empty-pub-solutions`, which earn **11 clicks a year between them**. Individual review: the 62 blog posts that rank but earn nothing. | 26 Aug 2026 | Open decision 14 |
| D15 | **Improving existing rankings outranks building new pages.** 69,698 impressions produce 969 clicks at position 9 to 13. Fourteen posts carry 80% of blog traffic and most sit outside the top ten. Fixing them is higher-yield than any new page. The spec sequences ranking work alongside the rebuild, not after it. | 26 Aug 2026 | n/a |
| D16 | **Keyword research is closed at three rounds.** 243 terms tested, picture stable since round 2, fifteen terms worth building for. Round 4 (trades) deferred until the professional services hub is proven. | 26 Aug 2026 | Open decision 15 |
| D17 | **Marketing design tokens are scoped, not global.** The new palette and the lowercase heading rule apply to a marketing surface, never bare `:root`. `/availability` and `/admin` keep their current styling. Rationale: "out of scope" is a requirement, not a mechanism, and root custom properties reach every route regardless of intent. Visual regression tests cover both excluded areas. | 27 Aug 2026 | n/a |
| D18 | **`/about-demo` and `/test-shadcn` are deleted** in WS1. Both are publicly routable artefacts; `/about-demo` is a live `route.ts` handler indexed at 22 impressions. | 27 Aug 2026 | n/a |
| D19 | **The bearer-token security boundary on `/availability` is non-negotiable.** Organiser and edit URLs carry a token in the path, and `MarketingChrome.tsx` deliberately fails closed to stop it reaching GTM, Vercel Analytics or preconnects. No test currently guards this. One is now required, asserting no third-party request and no marketing chrome on token routes. | 27 Aug 2026 | n/a |

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

**Recommendation: promote "Bring us the problem" to the primary site-wide CTA** and keep the
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
