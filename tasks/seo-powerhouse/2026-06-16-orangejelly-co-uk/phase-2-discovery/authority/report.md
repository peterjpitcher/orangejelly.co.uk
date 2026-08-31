# Orange Jelly — Authority & Off-Page Analysis (Phase 2)

**Date:** 2026-06-16 (Europe/London) · **Owner:** Authority Specialist
**Method:** Web search (June 2026) + first-party crawl (`evidence/schema.json`, `internal-links.csv`) + codebase. **No backlink tool / no DA-DR-AS metric is asserted** — see `backlink-analysis.md` for the full data-status banner. Competitor authority is a **directional** read from observable signals only.
**Constraints honoured:** `/CLAIMS.md` is the only source of quantified proof points (search-visibility +828%; table-bookings +403%; private-hire +567%; no-shows -89%; food-revenue +98% — all proven at The Anchor). Greene King = **Tenant**, BII = **Member**. British English. No "save/savings" language. **No live indexation/schema change without routing through the Phase 5 Risk Register.**

---

## Current Authority Position

Orange Jelly's authority is **almost entirely on-page and topical**, not off-page. Across multiple targeted brand searches (June 2026) the results are dominated by orangejelly.co.uk's own pages plus The Anchor's own properties — **no independent trade-press article, agency-directory listing, review-platform profile, or third-party roundup naming Orange Jelly surfaced** (web search; Confidence: Medium, inferred from consistent absence). For a services business with its first external client in September 2025 this is expected: no deliberate digital-PR or outreach has happened yet.

The strategic consequence aligns exactly with the Phase 1 strategy: **OJ should win first by converting the informational visibility it already has (no new authority required), and treat authority building as the medium/long-term enabler for the competitive commercial cluster (C1–C3).** Chasing "pub marketing agency" head-on today, with a near-blank off-page profile against directory-backed agencies and a brewery hub inside the Greene King/Wikipedia ecosystem, is not realistic — and the strategy correctly de-prioritises it.

**The good news:** a near-blank profile carries **no toxic-link risk to remediate** — the whole job is *building* genuine authority, which is lower-risk than cleaning up. And OJ's single biggest authority weakness is **self-inflicted and free to fix**: the entity graph it publishes about itself.

## Backlink Profile Summary

| Metric | Orange Jelly | valueforvenues (Greene King) | CJ Digital | Agencies (Wired/MforPubs) |
|---|---|---|---|---|
| Referring domains | **Unavailable** (no tool) | Unavailable | Unavailable | Unavailable |
| DA / DR / AS | **Unavailable** (no tool) | Unavailable | Unavailable | Unavailable |
| Institutional / entity authority (observed) | None (no Wikipedia, single `sameAs`) | **High** — Greene King corporate + Wikipedia entity + InnSight | Low–Med | Low |
| Third-party directory / review presence (observed) | **None observed** | n/a (corporate) | **Yes** (DesignRush profile, reviews) | Some |
| Editorial / trade-press mentions (observed) | **None observed** | Within GK ecosystem | "Award-winning" claims | Limited |
| Self-published `sameAs` links | **1** (`the-anchor.pub`) — Known | n/a | n/a | n/a |

> Empty metric cells are **unavailable by design** (no backlink tool). Do not fill with estimates. "Observed/None observed" = directional web-search read, Confidence Medium.

## Authority Gap Analysis

| Keyword area (Phase 1 cluster) | OJ authority | Competitor authority (observed) | Gap | Closable? | Priority |
|---|---|---|---|---|---|
| Commercial — "pub marketing agency", "marketing for pubs" (C1) | Very low off-page | Agencies: directory/review-backed; some PPC | **Wide** | Partially, slowly (12mo+) — via directories/reviews/editorial | **Medium** — strategy already says win on conversion first, not ranking |
| Commercial — named-channel "instagram/content/paid social for pubs" (C2–C3) | Very low off-page | Mixed; less defended | **Moderate** | Yes, over time — but conversion of existing impressions matters more now | **Medium** |
| Informational — quiz / events / food / social for pubs (C4–C7) | **Already competitive on-page** (ranks pos 7–16) | Greene King hub out-resources; smartpubtools/Morning Advertiser strong | Closable on *credibility*, not authority | **Yes** — out-credible, don't out-authority | **High** (defends the funnel) |
| Local/regional service intent (Kent/Oxfordshire; recovery-services pos 7.9) | Low | National agencies absent locally; no local operator authority | **Narrow** | **Yes** — local entity + GBP + regional citations | **High** (realistic, cheap) |
| AI answer-engine citation (C4–C7) | Schema foundation strong; entity links weak | Hubs structured for snippets | Moderate | Yes — entity + quotable blocks + author identity | **Medium** |

**Headline:** the only *wide* authority gap is the competitive commercial head terms — and the strategy already routes round it (convert first). Everywhere else the gap is **narrow and closable** with ethical, on-brand work, or is a *credibility* gap (winnable with first-hand results) rather than an authority gap.

## Link Profile Health

- **Toxic / spammy links:** none observed; cannot be confirmed without a backlink tool → `unavailable`. No disavow action recommended (nothing visible to disavow).
- **Anchor text / velocity:** not enumerable without a tool → `unavailable`. Deliberate acquisition is inferred near-zero (no editorial footprint).
- **Self-published entity links (`sameAs`):** **under-built — a single link** (`the-anchor.pub`); founder `Person` has no external `sameAs` and no `knowsAbout`. This is the one Known, fixable health issue. (`src/app/layout.tsx:116-149`; `evidence/schema.json`.)
- **Algorithmic risk:** none asserted. The real risk is **opportunity cost** — competitors building authority while OJ does not.

## Authority Building Opportunities

### High-Priority Opportunities (ticket-ready)

**AUTH-01 — Rebuild the entity graph (`sameAs` / `memberOf` / `knowsAbout`).** *Owner: Authority + Technical. Effort: Small. Fix type: Template/system fix.*
The Organization `sameAs` is `['https://www.the-anchor.pub']` only. Add OJ's genuine, verifiable external identities: LinkedIn (company + Peter Pitcher personal), Facebook/Instagram if active, Google Business Profile URL, Companies House page, and BII member reference. Add `knowsAbout` topics (pub marketing, pub events, hospitality social media) and a founder `sameAs` (LinkedIn) to the `Person` block. **Target:** every claimed real profile is reflected in structured data. **Success:** Rich Results Test shows the expanded Organization/Person; the entity becomes machine-linkable for Knowledge Graph + AI engines. **Route the live schema change through the Phase 5 Risk Register.** 100% in OJ's control, no outreach.

**AUTH-02 — Claim & complete a Google Business Profile for the Orange Jelly service entity** (distinct from The Anchor's listing). *Owner: Authority. Effort: Small. Fix type: One-off.* OJ has **no observed local/business listing of its own**. A complete GBP (categories, service area = GB, link to `/services`) creates a primary entity citation, supports local service intent (Phase 1 priority 4), and feeds `sameAs`. **GBP changes route via Risk Register** per brief. **Success:** verified GBP live; URL added to `sameAs`.

**AUTH-03 — Get backlink-tool data to baseline the profile.** *Owner: Authority/Analytics. Effort: Small. Fix type: Analytics/governance fix.* One-off Ahrefs/Semrush/Moz pull so referring domains, anchors and any genuinely toxic link become visible. Converts this *assessment* into a *measurement* and lets future authority work be tracked against a real baseline. **Success:** a baseline referring-domain list exists in `evidence/`.

**AUTH-04 — Convert the Greene King tenant relationship into an editorial feature + link.** *Owner: Authority. Effort: Medium. Fix type: Content-process fix.* Greene King Pub Partners actively publishes tenant case studies (`greenekingpubs.co.uk/why-greene-king/case-studies`). The Anchor is a GK **Tenant** with measured, approved results (+403% table bookings, +98% food revenue in three months, -89% no-shows). Pitch a tenant success feature → earns a contextually relevant, high-trust link from inside the GK ecosystem and reinforces the entity. **Keep framing = Tenant, not partner.** **Success:** published GK case study linking to orangejelly.co.uk (or to The Anchor with an OJ mention).

### Content-Based Link Opportunities

**AUTH-05 — "From The Anchor" original data asset (link magnet).** *Owner: Authority + Content. Effort: Medium. Fix type: Content-process fix.* The market is full of generic listicles (smartpubtools, QuizVault, Greene King hub) but **no competitor publishes a single real operator's measured results.** OJ's defensible asset is first-hand, dated data from The Anchor. Build one genuinely linkable, citable resource — e.g. "What actually moved the numbers at our pub: a real operator's quiz/events/food results" — anchored to the approved CLAIMS (%-only, no save/savings). This is the kind of original-data page journalists and other operators reference. It also strengthens C4–C7 defence against the brewery hub. **Success:** the asset earns its first independent citation; tracked in AUTH-03 baseline.

**AUTH-06 — Make existing top guides more reference-worthy + quotable.** *Owner: Content. Effort: Medium. Fix type: Template/system fix.* The four guides that carry the site (summer events, quiz, food, social) already rank pos 7–16. Add concise quotable answer blocks + the real-publican proof to make them the page other people *cite* (PAA / AI Overviews / other blogs' "further reading"). Authority by-product of content quality; coordinate with the Content Strategist. **Success:** answer blocks live; AI-citation/PAA presence monitored directionally (no AI-referral data exists yet).

### Relationship and Outreach Targets

**AUTH-07 — Morning Advertiser Opinion & Interviews contribution.** *Owner: Authority. Effort: Medium. Fix type: Content-process fix.* The Morning Advertiser (trade authority since 1794) runs an Opinion & Interviews section featuring operators. A peer-to-peer, results-led contributed piece from a real licensee is a strong fit and earns a high-trust trade link/mention. **Success:** published contribution with a link or named mention.

**AUTH-08 — BII member visibility & awards footprint.** *Owner: Authority. Effort: Medium. Fix type: Content-process fix.* OJ is a BII **Member** and The Anchor meets typical Licensee-of-the-Year eligibility (2+ years trading, personal licence, food hygiene 4/5). BII member directory presence, award entry (BII LOYA / Great British Pub Awards / Publican Awards) and any resulting finalist/semi-finalist coverage (CLH News, bii.org, Morning Advertiser all cover these) are genuine, on-brand citation sources. **Framing = Member.** **Success:** BII member listing links to OJ; any award coverage captured.

**AUTH-09 — Pub/hospitality podcast guest appearances.** *Owner: Authority. Effort: Medium. Fix type: Content-process fix.* Pub-operator podcasts increasingly feature real operators discussing practical marketing. A founder guest spot earns show-notes links and brand mentions to the exact buyer audience. **Success:** ≥1 episode published with a show-notes link.

**AUTH-10 — Agency/hospitality directory + review parity.** *Owner: Authority. Effort: Small–Medium. Fix type: Content-process fix.* Agency competitors (e.g. CJ Digital) hold directory listings (DesignRush) and review signals OJ lacks entirely. Build ethical parity: relevant hospitality/marketing directories and a review-platform profile, with real client reviews once the client base supports it. **Success:** verified listings live; added to `sameAs`.

## Authority Building Plan

### Short Term (1–3 months) — foundation, fully in OJ's control
- **AUTH-01** rebuild entity `sameAs`/`memberOf`/`knowsAbout` (via Risk Register).
- **AUTH-02** claim & complete Google Business Profile (via Risk Register).
- **AUTH-03** pull backlink-tool baseline so everything downstream is measurable.
- **AUTH-10 (start)** core directory + review-platform listings.
- **AUTH-06 (start)** add quotable answer blocks to the four cluster-leader guides (coordinate with Content).

### Medium Term (3–6 months) — earn editorial citations on the real story
- **AUTH-04** Greene King tenant case-study feature (Tenant framing).
- **AUTH-07** Morning Advertiser opinion contribution.
- **AUTH-08** BII member listing + award entry and any coverage.
- **AUTH-05** publish the "From The Anchor" original-data link asset (CLAIMS-backed, %-only).

### Long Term (6–12 months) — sustained, compounding authority
- **AUTH-09** ongoing podcast/guest appearances as a recognised operator voice.
- Sustain **AUTH-05** as a recurring, dated data release (quarterly seasonal results) — the asset competitors structurally cannot replicate.
- Local/regional citation building behind the location-page system (Phase 1 priority 4) to compound local entity authority.
- Thought-leadership positioning of Peter Pitcher as the named, linkable expert — feeding back into the `Person` entity (AUTH-01).

## Risk Assessment

- **Dependency risk (Low–Medium):** off-page authority is currently near-zero, so there is no single high-value link to lose. The forward risk is over-reliance on the **Greene King relationship** for editorial links — keep diverse sources (BII, trade media, podcasts, original data) so no one relationship is load-bearing. Maintain **Tenant** framing in all GK-linked copy to avoid mis-stating the relationship.
- **Algorithmic risk (Low):** all recommended links are editorial/earned (no schemes, no PBNs, no paid links disguised as editorial), so no penalty exposure. The `sameAs` work is self-published structured data — validate via Rich Results Test before/after; **rollback = revert the schema string** (route through Risk Register).
- **Competitive threat (Medium):** the Greene King hub and agencies are resourced and active. OJ cannot out-authority the brewery hub — the mitigation is the **out-credible** strategy (first-hand, dated, %-based results) plus disciplined entity + directory + editorial building on the terms OJ can actually win.
- **Data-availability risk (Medium):** without backlink-tool data and GA4, authority work cannot yet be measured against a baseline or tied to enquiries. **AUTH-03 (tool baseline)** and Phase-1 SEO-001 (GA4/enquiry tracking) are prerequisites for proving authority ROI.

---

See the machine-readable findings array in the agent's returned summary / orchestrator backlog.
