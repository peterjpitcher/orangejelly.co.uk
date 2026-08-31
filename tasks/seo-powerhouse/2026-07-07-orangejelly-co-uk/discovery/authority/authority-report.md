# Authority & Off-Page Analysis — Orange Jelly (orangejelly.co.uk)

**Author:** Authority / Digital PR Specialist · **Date:** 2026-07-07 · **Mode:** Full Overhaul, second run
**Scope (per Strategy Lead §7):** entity graph (AI-identity prerequisite), ttagz-style "pub marketing agencies UK" listicle inclusion, Morning Advertiser trade-press angle, earned-authority programme. **Not in scope:** AEO / AI-answer content (owned by content + editorial, handoff to `ai-seo`).

> **Data-status banner.** No Ahrefs/Semrush/Moz export was available this run. There is **no `backlinks.csv`** in the workspace. Every off-page observation below comes from **WebSearch results or live page fetches on 2026-07-07**, or from the site's own crawled schema (`evidence/schema.json`). No backlink count, referring-domain count, or DA/DR figure is stated anywhere — where I have no source, I say so and mark confidence `Low`/`inferred`. Third-party directory profiles are reported only as "listing present/absent as observed in search", never with a metric.

---

## Current Authority Position

**Directional read: authority is near-zero off-domain, and the entity graph that would let AI systems and Google confidently identify the business is only half-built.** This is a start-up authority profile, consistent with "first external client September 2025" — not a red flag, but the single biggest ceiling on the commercial strategy after indexation.

Three converging evidence lines:

1. **No branded search demand yet.** In the 12-month GSC export (`evidence/search-queries.csv`), the entire brand footprint is three rows: `orange jelly` (1 impression, pos 17.0), `peter pitcher` (2 impressions, pos 7.5), `the anchor stanwell moor` (1 impression, pos 46.0) — **0 clicks across all three**. Brand search is the demand-side shadow of authority/PR; there is essentially none. (Source: GSC 12-mo export, dated 2026-06-16, stale but directionally reliable for brand terms.) `Data status: Known`.

2. **No third-party editorial or directory presence found.** Across every WebSearch run on 2026-07-07 (`"Orange Jelly" pub marketing`, `Morning Advertiser`, `BII member`, `Greene King case study`, hospitality-agency directories), **the only domains that surface Orange Jelly are its own (`orangejelly.co.uk`) and generic LinkedIn people-directory pages.** No Morning Advertiser piece, no BII BIIBusiness/News feature, no Greene King case study crediting Orange Jelly, no podcast, no local Staines/Surrey media, no agency directory (DesignRush, Clutch, ttagz, getonbloc). `Data status: inferred` (absence-of-evidence from search; a link could exist that search does not surface — but its invisibility is itself the finding). `Confidence: Medium`.

3. **The entity graph is thin.** The homepage `#organization` node (`ProfessionalService`) has exactly **one** `sameAs` value — `https://www.the-anchor.pub` — and the `#peter-pitcher` `Person` node has **no `sameAs` at all**. Confirmed exhaustively: across all 5,946 JSON-LD nodes on the site, **the only distinct `sameAs` value that exists anywhere is `the-anchor.pub`** (`evidence/schema.json` analysis). No LinkedIn, Companies House, Facebook, Instagram, BII profile, or Greene King link is wired into the machine-readable identity. `Data status: Known`. `Confidence: High`.

### Entity-graph ticket (June SEO-017) — status: **PARTIALLY DONE**

The scaffolding shipped — there is a proper `@id`-linked `#organization` → `founder` → `#peter-pitcher` graph, `foundingDate`, `address`, `geo`, `contactPoint`. **But the two things SEO-017 exists to deliver are missing:**
- **Organization `sameAs` is a single URL** (should enumerate LinkedIn company page, Companies House filing, Facebook, Instagram, and BII/Greene King profile URLs). The Strategy Lead flags Organization `sameAs` as the **prerequisite for AI-answer identity** — that prerequisite is not met.
- **`knowsAbout` is absent everywhere** (0 of 970 entity nodes). The founder `Person` node has no `sameAs` and no `alumniOf`/`knowsAbout`, so there is nothing tying "Peter Pitcher" the author to external corroborating profiles.

This is the highest-leverage, lowest-effort authority fix on the site: it is a template change to one schema-generation function, needs no outreach, and directly serves the AI-identity goal.

---

## Backlink Profile Summary

| Metric | This Site | Notes |
|--------|-----------|-------|
| Backlink tool data | **None this run** | No Ahrefs/Semrush export; `backlinks.csv` absent |
| Referring domains (observed in search) | Own domain + LinkedIn people-directory only | No third-party editorial link surfaced on 2026-07-07 |
| Directory listings (observed) | None found on DesignRush, Clutch, ttagz, getonbloc | Competitors present on all four (see gap analysis) |
| Entity `sameAs` links | 1 (`the-anchor.pub`) | The only external identity link the site itself declares |

*No competitor backlink columns are populated: without a link tool I cannot responsibly state referring-domain counts for anyone. The comparison below is **presence/absence in observable citation surfaces**, which is the honest, sourceable version of a competitor authority comparison.*

---

## Competitor Authority Comparison (WebSearch-observable only)

The Strategy Lead is explicit that OJ cannot beat established agencies on head terms. The authority evidence confirms *why*: competitors occupy the citation surfaces OJ is absent from.

| Citation surface | Orange Jelly | CJ Digital | Other named specialists | Source |
|---|---|---|---|---|
| ttagz "Pub Marketing Agencies in UK" (7 agencies) | **Absent** (Website Visibility, Snack London, Restaurant Genie named; OJ not) | — | Website Visibility, Snack London | WebSearch 2026-07-07 (page itself blocks bots — SSL handshake fail on fetch) |
| getonbloc "Pub Marketing Agencies: Top 10" | **Absent** | Ranked #1 | Toast, OMNE, Samphire, Pub Creative, Propeller | WebSearch 2026-07-07 (page 404'd on direct fetch; list read from search snippet) |
| DesignRush hospitality directory (~1,944 cos) | **Absent** (not found) | Listed | many | WebSearch 2026-07-07 |
| Clutch UK hospitality/leisure | **Absent** (not found) | Listed | many | WebSearch 2026-07-07 |
| "Voted #1 / featured in local news" earned coverage | **None found** | Claims "voted #1 restaurant marketing agency 2025"; client reviews aggregated | The Social Shepherd, others have blog/press | cjdigital.co, twinstrata.com review, designrush.com |

**Competitor pattern (the playbook OJ is not running):** CJ Digital and peers have (a) profiles on vetted directories (DesignRush, Clutch) that carry aggregated client reviews, (b) inclusion in third-party "best/top" listicles that rank for `pub marketing agency` intent, and (c) their own review/press pages. These are exactly the surfaces that feed both Google's `pub marketing agency` SERP (where OJ ranks pos 18–25 with 0 clicks per Strategy §3) **and** AI-answer citations. `Confidence: Medium` (search-observable, no metrics).

**Competitor vulnerability OJ can exploit:** none of these are *pub-owner-operators*. Orange Jelly's differentiator — a consultancy run from a live Greene King pub with its own trading results — is a genuine, defensible authority angle that CJ Digital et al. structurally cannot claim. That is the story every earned-media play below leans on.

---

## Authority Gap Analysis

| Keyword / intent area | OJ authority (directional) | Competitor authority (observed) | Gap | Closable? | Priority |
|---|---|---|---|---|---|
| `pub marketing agency` (head) | Very low — no directory/listicle presence | High — CJ Digital #1, present on all directories | Large | Not in 6 months by links alone; **do not chase** | Low (defer to indexation + hub consolidation) |
| Named-channel service queries (`instagram services for pubs` etc.) | Already ranks pos 2–7 on-merit | N/A — these are OJ's inherited rankings | **Negative gap (OJ ahead)** | Already won; authority not the blocker | High (but owned by Technical/Content, not links) |
| `fix my pub` / rescue-recovery | Ranks pos 5–8, differentiated angle | Insolvency firms (different intent) | Small | Yes — protect with entity/author signals | Medium |
| AI-answer identity ("who is Orange Jelly / Peter Pitcher") | Blocked — thin entity graph, no sameAs | Competitors have corroborating profiles | Medium | **Yes, cheaply — the SEO-017 completion** | High |
| Local pack / Maps (Stanwell Moor) | GBP status unverified (see below) | Local agencies own local SERPs (Strategy §4) | Unknown | Partially — GBP + citations | Medium |

**The honest headline:** authority is not the lever for OJ's *winnable* battles (named-channel reclaim, rescue) — those are page-quality and indexation problems the Technical/Content agents own. Authority's job here is narrower and specific: **complete the entity graph so AI systems and Google can identify the business, and start a slow, credible earned-mention programme off the one genuinely link-worthy asset OJ has — the pub-operator story.**

---

## Link Profile Health

No toxic-link or anchor-over-optimisation risk to report — because there is essentially **no external link profile to assess.** With no tool export and no third-party links surfacing in search, the health assessment is: **profile is near-empty, not damaged.** That is the correct state for a business with its first external client in Sept 2025; the risk is stagnation, not penalty. `Data status: unavailable` (link tool). `Confidence: Low`.

---

## Google Business Profile / Local Presence

**Could not verify a GBP for "Orange Jelly" as a consultancy** via WebSearch on 2026-07-07 — no Maps/GBP panel surfaced for the brand (searches returned only orangejelly.co.uk pages and a generic hospitality-GBP guide). The Anchor itself has an OpenTable listing and presumably a GBP (it is a trading pub), but **the consultancy's own local presence is unverified.** `Data status: unavailable` (I cannot confirm a GBP exists or its NAP consistency from WebSearch alone; never fetching google.com/search). `Confidence: Low`.

**Ticket implication (June SEO-028):** GBP audit needs someone with Google Maps access to (a) confirm whether an Orange Jelly consultancy GBP exists, (b) if so, check NAP against the site's `PostalAddress` (`The Anchor, 20 High Street, Stanwell Moor, Staines TW19 6AQ` / `+447990587315`), categories, and reviews. If none exists, decide whether a consultancy-at-a-pub-address GBP is even appropriate (it may cannibalise/confuse The Anchor's own listing — this is a judgement call, recommend keeping the consultancy digital-only and investing local effort in The Anchor's GBP instead). `Confidence: Low` — needs GBP access.

---

## Authority Building Opportunities

### High-Priority (do first — no outreach required)

1. **Complete the entity graph (finish SEO-017).** Add a full `sameAs` array to `#organization` (LinkedIn company page, Companies House filing URL, Facebook, Instagram, BII member profile, Greene King Pub Partners profile if one exists) and a `sameAs` to `#peter-pitcher` (his LinkedIn, and his author URL). Add `knowsAbout` (pub marketing, hospitality growth, events, quiz nights, local SEO for pubs). **This is a single template/schema-generation fix, ships without anyone replying to an email, and is the named AI-identity prerequisite.** Highest impact-per-effort authority action on the site.

### Content-Based Link Opportunities (the one genuinely link-worthy asset)

2. **The Anchor as a proprietary case study / original data.** OJ has something no competitor has: real trading results from a pub it operates (CLAIMS.md percentages only — e.g. +828% search visibility, +403% table bookings, +98% food revenue). A single, well-packaged "how we turned around our own pub" case study — framed as method + numbers, not a brochure — is the classic link-and-mention magnet in this niche and the natural pitch hook for trade press. It already half-exists at `/results`; the authority job is to make it *citable and pitch it*, not to write new content (that's Content's lane).

### Relationship & Outreach Targets (ranked by likelihood given Peter's REAL assets)

3. **Greene King toolkit relationship (warmest lead).** Peter already writes quarterly toolkit content for Greene King (contact: Charlotte Brown; per project memory). That is an existing, real relationship where a byline credit + link back to orangejelly.co.uk is a low-friction, high-relevance ask — a supplier/partner-link reclamation (Playbook Template D). **Highest-likelihood earned link on this list.**
4. **BII membership.** OJ is a "proud BII member" (stated on-site). BII runs BIIBusiness / member news and a member directory. A member-directory listing + a "practical AI in a real pub" member-story pitch is warm, on-brand, and OJ already qualifies. Medium likelihood.
5. **Morning Advertiser trade-press angle (June SEO-030).** The pub-operator-who-runs-a-marketing-consultancy story + real turnaround numbers is a legitimate MA/Publican's Morning Advertiser angle (they cover independent-licensee ingenuity constantly). Cold-ish but genuinely newsworthy; medium likelihood, higher effort (needs a tailored pitch, not a template blast).
6. **ttagz / getonbloc / DesignRush / Clutch listicle & directory inclusion.** These are the surfaces competitors sit on and OJ is absent from. ttagz's list is editorial (7 agencies) — pitch for inclusion with the pub-operator differentiator. DesignRush/Clutch are self-serve profiles OJ can simply create. Lower relevance-per-link than #3–5 but they directly target `pub marketing agency` citation surfaces. Note ttagz's own page blocks automated fetching (SSL handshake failure 2026-07-07) — approach via their contact form.
7. **Local Staines/Surrey media + partner links.** Lowest priority given local demand is 30 impressions/12mo (Strategy §4), but a hyper-local "local business helps pubs" angle is cheap if a relationship already exists. Defer.

---

## Authority Building Plan

### Short term (1–3 months)
- **Complete the entity graph** (SEO-017 finish) — no dependency on anyone external. *Ship first.*
- **Reclaim the Greene King toolkit link** — email Charlotte Brown, ask for a byline credit + followed link on the toolkit content OJ already writes (Template D).
- **Create DesignRush + Clutch profiles** — self-serve, targets `pub marketing agency` directory surface where competitors sit.
- **Confirm/create GBP decision** (needs Google access — hand to whoever has it).

### Medium term (3–6 months)
- **Package `/results` into a pitchable case study** (coordinate with Content) and **pitch the Morning Advertiser + BII member news** with the pub-operator story.
- **Pitch ttagz and getonbloc for listicle inclusion** via their contact forms.
- **Stand up an outreach tracker** (`discovery/authority/outreach-tracker.md`) so nothing is double-pitched; cap follow-ups at 1–2.

### Long term (6–12 months)
- **Sustain the pub-operator thought-leadership angle** — one credible earned mention per quarter beats a link-buying spree. Let brand search demand (currently ~0) grow as the signal that authority is building.
- **Re-baseline** if/when a link tool becomes available: run `import-search-data.py --backlinks` to finally populate `backlinks.csv` (June SEO-019 has never been done — no tool this run either; it remains open).

---

## Risk Assessment

- **Dependency risk:** the *only* external identity link the site declares is `the-anchor.pub`. If that domain changed or lapsed, the entire declared entity graph would point nowhere. Widening `sameAs` (opportunity #1) also de-risks this. `Confidence: High`.
- **Algorithmic risk:** none observable — there is no link profile to be penalised. The risk is the opposite: invisibility. `Confidence: Medium`.
- **Competitive threat:** CJ Digital and peers are actively compounding authority (directories, reviews, "voted #1" listicles, press pages). OJ starting from zero means the gap on `pub marketing agency` widens unless the differentiated pub-operator angle is pushed. This is why the Strategy Lead is right to have OJ win on *inherited named-channel rankings* rather than contest the agency head term. `Confidence: Medium`.
- **SEO-019 baseline still open:** with no backlink tool this run (as in June), there is still **no referring-domain baseline**. Every authority statement here is search-observable only; the first real baseline requires a tool export. Flag this as the standing measurement gap. `Confidence: High`.

---

## Sources (all accessed 2026-07-07)

- `evidence/schema.json` — full JSON-LD analysis (5,946 nodes; single `sameAs` = the-anchor.pub; `#organization` and `#peter-pitcher` nodes).
- `evidence/search-queries.csv` — brand footprint (orange jelly / peter pitcher / the anchor stanwell moor rows).
- `evidence/live-verification-notes.md`, `inputs/input-summary.md`, `discovery/strategy/strategy-document.md`.
- WebSearch: `"Orange Jelly" pub marketing Peter Pitcher Stanwell Moor`; `"pub marketing agencies UK" best list ttagz`; `"Orange Jelly" OR "Peter Pitcher" Morning Advertiser`; `"Orange Jelly" BII member OR Greene King case study`; `Orange Jelly Stanwell Moor Google Business Profile reviews`; `ttagz pub marketing agencies UK list`; `CJ Digital pub marketing agency reviews press coverage`; `pub marketing agency directory Clutch DesignRush`.
- ttagz page ([ttagz.co.uk/post/pub-marketing-agencies-in-uk](https://www.ttagz.co.uk/post/pub-marketing-agencies-in-uk)) — could not fetch (SSL handshake failure); content read from search snippets only.
- getonbloc "Top 10" ([business.getonbloc.com/pub-marketing-agencies/](https://business.getonbloc.com/pub-marketing-agencies/)) — 404 on direct fetch; list read from search snippet.

```json
{ "findings": [
  { "finding": "Entity-graph ticket (June SEO-017) only PARTIALLY done: the #organization ProfessionalService node has a single sameAs (the-anchor.pub) and the #peter-pitcher Person node has NO sameAs; knowsAbout is absent on all 970 entity nodes. Across all 5,946 JSON-LD nodes the ONLY distinct sameAs value on the entire site is the-anchor.pub. Organization sameAs is the Strategy Lead's stated prerequisite for AI-answer identity, so that prerequisite is unmet.", "evidence": "evidence/schema.json: #organization node sameAs=[the-anchor.pub] only; #peter-pitcher node has no sameAs/knowsAbout; site-wide distinct sameAs count = 1", "source": "Offline JSON-LD analysis of evidence/schema.json (ctx_execute_file)", "dataStatus": "Known", "severity": "High", "confidence": "High", "impactArea": "AI visibility", "owner": "Technical", "effort": "Small", "dependencies": "dev; URLs for LinkedIn/Companies House/Facebook/Instagram/BII/Greene King profiles", "fixType": "Template/system fix", "recommendedAction": "In the schema-generation function, expand #organization sameAs to enumerate LinkedIn company page, Companies House filing, Facebook, Instagram, BII member profile and Greene King Pub Partners profile; add sameAs to #peter-pitcher (his LinkedIn + author URL); add knowsAbout (pub marketing, hospitality growth, events, quiz nights, local SEO for pubs)", "validationStep": "Re-crawl schema: #organization sameAs lists 4+ external profiles; #peter-pitcher has sameAs; Rich Results Test passes", "riskRollback": "Low — schema additions are reversible via git; only add URLs that resolve" },
  { "finding": "Near-zero third-party editorial/directory authority: across all 2026-07-07 WebSearch runs the only domains surfacing Orange Jelly are orangejelly.co.uk and generic LinkedIn people-directory pages. No Morning Advertiser, BII news, Greene King case study, podcast, local media, or agency directory (DesignRush/Clutch/ttagz/getonbloc) mention was found — while competitor CJ Digital is present on all of them.", "evidence": "WebSearch 2026-07-07 (8 queries): OJ absent from ttagz 7-agency list, getonbloc Top 10, DesignRush, Clutch; CJ Digital ranked #1 and directory-listed", "source": "WebSearch (compliant; no google.com/search)", "dataStatus": "inferred", "severity": "High", "confidence": "Medium", "impactArea": "SEO", "owner": "Authority", "effort": "Large", "dependencies": "Outreach capacity; Content for case-study packaging", "fixType": "Content process fix", "recommendedAction": "Start earned-mention programme off the pub-operator differentiator: (1) reclaim Greene King toolkit byline+link (Charlotte Brown, Template D), (2) BII member directory + member-news pitch, (3) Morning Advertiser trade-press pitch with The Anchor turnaround numbers, (4) self-serve DesignRush/Clutch profiles, (5) pitch ttagz/getonbloc listicle inclusion", "validationStep": "First followed external editorial/partner link live (record linking-page URL in outreach-tracker); brand-search impressions rise off ~0 in a later GSC export", "riskRollback": "n/a — additive outreach; only ethical earned links" },
  { "finding": "No branded search demand: 12-mo GSC brand footprint is 3 rows total — 'orange jelly' (1 impr), 'peter pitcher' (2 impr), 'the anchor stanwell moor' (1 impr), 0 clicks across all. Brand search is the demand-side signal of authority/PR; there is essentially none.", "evidence": "evidence/search-queries.csv: the only brand/founder rows are the three above, all 0 clicks", "source": "GSC 12-mo export 2026-06-16 (stale but reliable for brand terms)", "dataStatus": "Known", "severity": "Medium", "confidence": "High", "impactArea": "SEO", "owner": "Authority", "effort": "Large", "dependencies": "Earned-mention programme above", "fixType": "Content process fix", "recommendedAction": "Treat brand-search growth as the north-star KPI for the authority programme; do not chase the pub-marketing-agency head term with links (competitor gap too large in 6 months) — grow brand demand via the differentiated pub-operator story instead", "validationStep": "Brand-term impressions/clicks trend upward in successive GSC exports", "riskRollback": "n/a — measurement/positioning decision" },
  { "finding": "Google Business Profile for the Orange Jelly consultancy is UNVERIFIED (June SEO-028): no Maps/GBP panel for the brand surfaced in WebSearch on 2026-07-07; cannot confirm existence, NAP consistency, categories, or reviews from search alone (google.com/search must not be fetched).", "evidence": "WebSearch 'Orange Jelly Stanwell Moor Google Business Profile reviews' 2026-07-07 returned only orangejelly.co.uk pages + a generic GBP guide", "source": "WebSearch (compliant)", "dataStatus": "unavailable", "severity": "Medium", "confidence": "Low", "impactArea": "local", "owner": "Authority", "effort": "Small", "dependencies": "Google Maps/GBP access", "fixType": "Analytics/governance fix", "recommendedAction": "With GBP access, confirm whether an Orange Jelly consultancy GBP exists; if yes, audit NAP against the site PostalAddress (The Anchor, 20 High Street, Stanwell Moor, Staines TW19 6AQ / +447990587315), categories, reviews. If none, recommend keeping the consultancy digital-only (a pub-address consultancy GBP risks confusing The Anchor's own listing) and invest local effort in The Anchor's GBP instead", "validationStep": "GBP existence + NAP status documented; decision recorded", "riskRollback": "Low — no live change until decision made" },
  { "finding": "Backlink baseline (June SEO-019) still never done: no Ahrefs/Semrush/Moz export this run, no backlinks.csv in the workspace. All off-page assessment is WebSearch-observable only, so there is no referring-domain baseline to measure future link-building against.", "evidence": "No backlinks.csv in evidence/; inputs/input-summary.md confirms no SEO-tool credentials; June SEO-019 open", "source": "Workspace file inventory + run brief", "dataStatus": "unavailable", "severity": "Medium", "confidence": "High", "impactArea": "SEO", "owner": "Authority", "effort": "Small", "dependencies": "Access to a backlink tool (Ahrefs/Semrush/Moz)", "fixType": "Analytics/governance fix", "recommendedAction": "When a backlink tool becomes available, pull a referring-domains export and run scripts/import-search-data.py --backlinks to populate backlinks.csv as the first real off-page baseline; until then, treat all authority figures as directional/search-observed", "validationStep": "backlinks.csv exists with referring_domain rows; baseline dated and recorded", "riskRollback": "n/a" },
  { "finding": "Competitor authority gap on 'pub marketing agency' is large and not closable by links in 6 months: CJ Digital ranks #1 on getonbloc Top 10, is directory-listed (DesignRush, Clutch), aggregates client reviews and claims 'voted #1 2025'; ttagz's 7-agency list includes Website Visibility/Snack London/Restaurant Genie but not Orange Jelly. OJ is absent from every observed citation surface for this intent.", "evidence": "WebSearch 2026-07-07: getonbloc Top10, ttagz list, DesignRush, Clutch all show competitors, none show OJ; cjdigital.co + twinstrata.com review corroborate CJ Digital positioning", "source": "WebSearch (compliant); ttagz page unfetchable (SSL) and getonbloc page 404 on direct fetch — lists read from search snippets", "dataStatus": "inferred", "severity": "Medium", "confidence": "Medium", "impactArea": "SEO", "owner": "Authority", "effort": "Large", "dependencies": "None (strategic)", "fixType": "Content process fix", "recommendedAction": "Do NOT contest the pub-marketing-agency head term via link-building this cycle (aligns with Strategy §4 'where it cannot win'); instead exploit the one gap competitors cannot close — OJ is a pub-operator, they are not — and target directory/listicle inclusion opportunistically while focusing authority effort on the entity graph and warm partner links", "validationStep": "OJ appears in at least one third-party pub/hospitality agency listicle or directory; decision to deprioritise head-term link chase recorded", "riskRollback": "n/a — strategic decision" }
] }
```
