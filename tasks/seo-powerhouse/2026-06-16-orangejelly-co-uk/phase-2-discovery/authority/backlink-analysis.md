# Orange Jelly — Backlink & Off-Page Profile Analysis (Phase 2)

**Date:** 2026-06-16 (Europe/London) · **Owner:** Authority Specialist
**Method:** Web search only (June 2026). **No connected backlink tool** (Ahrefs / Semrush / Moz) → **no referring-domain count, no DA/DR/AS number is asserted anywhere in this document.** Where competitor authority is described it is a **directional** read from observable signals (corporate ecosystem, Wikipedia entity, directory listings), never a metric.
**First-party data:** GSC `search-visibility` is the only Known link-driven proof point (`/CLAIMS.md`: +828% Google Search visibility at The Anchor).

> **Data-status banner.** This is an off-page profile *assessment*, not a link audit. A link audit requires a backlink tool the team does not have. Every quantitative authority claim below is therefore marked `inferred` or `unavailable`, and every recommendation is a forward-looking link-*earning* action — not a "disavow / clean up the existing profile" action, because the existing profile cannot be enumerated without a tool. **First action in the plan = get backlink-tool data so this assessment can become a measurement.**

---

## 1. What we can and cannot know

| Question | Can we answer it? | Why |
|---|---|---|
| How many referring domains does OJ have? | **No — unavailable** | No Ahrefs/Semrush/Moz access. Do not state a number. |
| What is OJ's DA / DR? | **No — unavailable** | Third-party estimate only; no tool data to quote. |
| Is the anchor-text profile over-optimised / toxic? | **No — unavailable** | Cannot enumerate inbound anchors without a tool. |
| Is the brand mentioned online without a link (unlinked mentions)? | **Directional — inferred** | Web search surfaces no third-party editorial mentions at all (see §2). |
| What entity/`sameAs` signals does OJ publish about itself? | **Yes — Known** | First-party crawl (`evidence/schema.json`) + codebase (`src/app/layout.tsx:149`). |
| Do competitors hold structural authority OJ lacks? | **Directional — inferred** | Observable corporate ecosystem / Wikipedia / directory signals (§4). |

---

## 2. Off-page presence: directional read (inferred)

**Observed signal (web search, June 2026):** brand queries — `"Orange Jelly pub marketing Peter Pitcher The Anchor"`, `"Orange Jelly" pub marketing BII licensee`, `"Orange Jelly" Staines marketing Google reviews Trustpilot Companies House` — return **almost exclusively orangejelly.co.uk's own pages**, plus The Anchor's own properties (`the-anchor.pub`, OpenTable). No independent trade-press article, no agency-directory listing, no review-platform profile, and no third-party "best pub marketing help" roundup naming Orange Jelly surfaced in any query.

**Interpretation (inferred, Confidence: Medium — strong absence across multiple targeted queries):**
- The off-page profile is **thin and largely self-referential**. OJ's discoverability and the GSC clicks it earns are driven by **on-page content + topical relevance**, not by an external link/citation footprint.
- This is consistent with a young services business (first external client Sept 2025) that has not yet done any deliberate digital-PR or outreach.
- **This is an opportunity, not a liability.** There are no toxic-link red flags to remediate (nothing to disavow that we can see); the entire job is *building* genuine authority from a near-blank base, which is lower-risk than cleaning up a spammy profile.

**What this means for strategy:** every competitive commercial keyword (C1–C3: "pub marketing agency", "marketing for pubs") sits behind an authority gap OJ has *not yet started closing*. The Phase 1 strategy's instinct is correct — **win first on conversion of existing informational visibility** (no new authority needed), and treat authority building as the medium/long-term enabler for the competitive commercial terms.

---

## 3. Entity & self-published authority signals (Known — first-party)

These are the signals OJ controls directly and can fix immediately. They are the foundation every off-page link/mention should reinforce.

| Signal | Current state | Evidence | Gap |
|---|---|---|---|
| Organization `sameAs` | **Only `https://www.the-anchor.pub`** | `src/app/layout.tsx:149`; `evidence/schema.json` (`ProfessionalService` "Orange Jelly Limited" → `sameAs: ['https://www.the-anchor.pub']`) | No LinkedIn, no Facebook/Instagram, no Google Business Profile, no Companies House, no BII member page, no review platform. The entity graph is barely connected. |
| Founder `Person` schema | `Person` "Peter Pitcher", jobTitle + description present; **no `sameAs`, no `knowsAbout`** | `src/app/layout.tsx:116–123`; `knowsAbout` = 0 occurrences in `evidence/schema.json` | The named expert (the whole differentiator) has no linked external identity (LinkedIn) and no machine-readable expertise topics. |
| Organization affiliations | BII membership & Greene King tenancy stated in prose only | web search confirms "proud BII members"; not in `sameAs`/`memberOf` | BII / Greene King relationships are authority-bearing but not expressed as structured entity links. |
| Brand consistency (NAP) | The Anchor address consistent in schema (`TW19 6AQ`) | `src/app/layout.tsx:136–148` | Consistent — good foundation for local/entity work. |

**Severity: High.** A near-empty `sameAs` array is the single biggest *self-inflicted* authority weakness. It is also the cheapest to fix (no outreach, no third party), and it directly supports both entity recognition (Knowledge Graph / AI answer engines) and the real-publican E-E-A-T story the strategy is built on.

---

## 4. Competitor authority — directional comparison (inferred; NO metrics)

> No DA/DR/AS is quoted. Each cell is a directional read from observable, citable signals.

| Competitor | Authority basis (observed) | Directional strength vs OJ | OJ's exploitable weakness in them |
|---|---|---|---|
| **valueforvenues.co.uk (Greene King)** | Sits inside the Greene King corporate ecosystem: `greenekingpubs.co.uk` case studies, `InnSight` magazine (supplier-funded, sent to all tenanted pubs), `2gmarketing.co.uk` supplier links, and a **Wikipedia entity** for Greene King. Brewery-brand domain trust. | **Much stronger** (institutional + entity). OJ **cannot** out-authority this head-on. | Brand-tied perspective; no single-operator lived results; **no incentive to convert a reader into an OJ-style enquiry.** OJ out-*credibles* with first-hand, dated, % results — it does not out-authority. |
| **CJ Digital** | Third-party directory presence (DesignRush agency profile with reviews/clients); "award-winning" positioning; London agency footprint. | **Stronger off-page** (directory + review signals OJ has none of). | "Agency" framing the agency-sceptical audience distrusts; no operator credibility. OJ's anti-agency, real-publican wedge is the differentiator. |
| **Wired Media / Marketing For Pubs / We Are Brew** | Agency sites, some with directory/review presence and PPC spend; exact-match domain (Marketing For Pubs). | **Comparable-to-stronger off-page**, but none shows institutional/entity authority. | Generalist hospitality positioning; thin operator proof; retainer model. OJ's fixed packages (from £375 + VAT) + 30-day action guarantee + measured results are concrete and low-risk. |
| **smartpubtools.com / Morning Advertiser** | smartpubtools = content/tool hub with broad listicle coverage; Morning Advertiser = trade-news authority since 1794 (Wikipedia entity). | Morning Advertiser **much stronger** (trade authority); smartpubtools comparable content competitor. | These are **link/citation *targets*, not just rivals** — Morning Advertiser's Opinion section and smartpubtools-style roundups are places OJ should *earn* coverage (see plan). |

**Reading:** OJ faces two different authority problems. Against the **brewery hub** the gap is institutional and *not closable head-on* — so don't try; win on credibility + conversion. Against the **agencies** the gap is ordinary off-page footprint (directories, reviews, awards) that OJ can realistically build, and OJ's positioning advantage (real operator vs agency) is genuine.

---

## 5. Link-profile health & red flags

| Check | Finding | Data status |
|---|---|---|
| Toxic / spammy inbound links | **None observed** in web search; but cannot be ruled in/out without a backlink tool | unavailable |
| Over-optimised anchor text | Cannot enumerate without a tool | unavailable |
| Link velocity (gaining/stalled) | Cannot measure without a tool; **inferred near-zero deliberate acquisition** given absence of editorial mentions | inferred |
| Links from penalised/deindexed sites | Cannot assess without a tool | unavailable |
| **Self-published entity links (`sameAs`)** | **Under-built — single link** | **Known** (§3) |

**No algorithmic red flag is asserted.** The honest position: there is no evidence of harm and no evidence of a meaningful inbound profile. The risk here is *opportunity cost* (competitors building authority while OJ doesn't), not penalty risk.

---

## 6. What feeds into the plan (cross-ref `report.md`)

1. **Fix the entity graph first** (`sameAs`/`memberOf`/`knowsAbout`) — 100% in OJ's control, no outreach, supports E-E-A-T + AI citation.
2. **Get backlink-tool data** so this assessment becomes a measurable baseline and any genuinely toxic link (if one exists) becomes visible.
3. **Earn editorial citations** through the real-publican story (BII, Greene King tenant feature, Morning Advertiser opinion, pub podcasts) — the channels where OJ's differentiator is an asset, not a liability.
4. **Build directory/review parity** with the agency competitors (Google Business Profile, relevant agency/hospitality directories, review platform) — ordinary, ethical, closable.

All structured-data / schema changes that touch the live site route through the **Phase 5 Risk Register** (no live indexation/schema change without approval).
