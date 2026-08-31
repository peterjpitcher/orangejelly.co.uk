# Content Quality Audit — Orange Jelly (Phase 3, Editor / QA Lead)

**Date:** 2026-06-16 (Europe/London) · **Author:** Editor / Quality Assurance Lead
**Commercial goal:** more service enquiries / leads from UK licensees and pub operators.
**Note:** filename is `editor-qa-report.md` — the literal `report.md` write is blocked by the harness; this is the role's report deliverable.
**Reads:** Phase 1 strategy + opportunity map; Phase 2 technical-seo, content-strategy, analytics, authority; `/CLAIMS.md`; live codebase (`content/blog/`, `content/data/`, `src/`).

**Data status header.** GSC = first-party (Known). **GA4 not supplied** → no conversion/engagement/AI-referral baseline (`unavailable`). No keyword/backlink tool, no PSI/CrUX → no volume/DA/CWV asserted. Word counts, FAQ counts, duplication and claims-compliance are **Known** — measured directly from the repository (`ctx_execute` over `content/` and `src/`). Indexation buckets are **Known** from GSC Coverage drilldown `Table.csv`. AI-pattern judgements are **inferred** (Medium confidence) — editorial reads of measured structural signals, not tool output.

---

## Summary

The content is **broadly trustworthy and on-brand, but systemically thin at the top**, and the headline word-count figure other agents relied on is wrong. The Content Strategist stated guides are "deep (1,500–4,000w)". Measured from the repository, **median total rendered words across 105 guides is 1,355, but the four pages that carry the entire site's visibility are 360–391 body words each** (`summer-pub-event-ideas` 368 body / 504 total; `quiz-night-ideas` 360/515; `profitable-pub-food-menu-ideas` 324/486; `social-media-strategy-for-pubs` 391/531). 24 guides are under 500 total rendered words and 39 under 700. This is the most important content-quality finding and it reframes two team conclusions (below).

The **claims layer is in good shape where it matters most.** The four primary structured-data files CLAIMS.md flagged — `claims.json`, `results.json`, `case-studies.json`, `social-proof.json` — are all migrated to the five approved percentages (commits `e6685309`, `aaf97c99`). Retired metrics survive only in **three peripheral/stale locations**: a live homepage trust badge, an orphaned (unrendered) testimonial component, and an internal outreach template.

E-E-A-T is a genuine strength on paper (real publican, real venue, measured results, strong schema) but **under-expressed**: author entity has `social: null` and a one-line bio, and the thinness undermines the "proven operator depth" the brand sells. AI-generation tells are present but moderate; the bigger AI-trust risk is unsourced numeric advice in body copy, not robotic prose.

**No fabricated-statistic / hallucinated-study problem** in the blog bodies — the no-invented-data line holds. Numbers are either approved CLAIMS or clearly-framed industry benchmarks (GP %, labour %), not invented Anchor results.

---

## Critical Quality Issues

### Q-1. The visibility-carrying guides are thin
The four top-impression pages are 324–391 body words (~486–531 total after quickAnswer + 3 FAQs render). They rank pos 7–16 *despite* the thinness (entity/brand strength + freshness), so depth is the clearest lever into the top-10 click range (ties to SEO-006). **Owner: Content. Fix: Content process fix.**

### Q-2. Thin content is a *partial* driver of "Crawled – not indexed", not the whole story (resolves the brief's core question)
- **44 "Discovered – not indexed"** = under-discovery (orphaned commercial pages + never-crawled seasonal guides at `1970-01-01`) — a linking/crawl problem, NOT quality. Technical's diagnosis is correct.
- **30 "Crawled – not indexed"** is the quality bucket: 20 are `/licensees-guide/` posts; **11 of the 20 are under 700 total words (median 593)** → thinness is credible there. The other half are genuinely deep (`pub-health-check…` 5,381w, `buying-a-pub-complete-guide` 3,384w, `pub-toilet-refurbishment…` 2,787w) and sit in cannibalised clusters → **duplication/overlap + weak internal linking**, not thinness.
- **Verdict:** the ~74 is **not** primarily thin/duplicative guide content. Recommend **Refresh** (thicken) for the 11 thin ones, **Merge/canonical** for the cannibalised deep ones (CAN-1/2/3), **Keep** for the deep stand-alones once internally linked.

### Q-3. A retired claim is live on the homepage
`content/data/trust-badges.json` (order 5) renders **"Transform 25 Hours Into Growth"** via `TrustBadgesWrapper` → `TrustBadges` on the homepage / `StandardSections`. "25 hours reclaimed" is on the CLAIMS.md retired DO-NOT-USE list. Only live public claims violation. **Owner: Content/Editorial. Fix: One-off page fix.**

---

## Page-by-Page Quality Assessment (priority pages)

Scoring 1–5 (5 = strong); words = total rendered (Known).

| Page | Words | Accuracy | Clarity | Usefulness | Voice | Trust | AI tells | Overall | Key issue |
|------|-------|----------|---------|------------|-------|-------|----------|---------|-----------|
| summer-pub-event-ideas | 504 | 5 | 4 | 3 | 5 | 4 | Low–Med | 3.5 | Title "35 ideas" vs ~368w body; thin for 7,572-impr SERP |
| quiz-night-ideas | 515 | 5 | 4 | 3 | 5 | 4 | Low–Med | 3.5 | Thin (360 body); cannibalised (CAN-2) |
| profitable-pub-food-menu-ideas | 486 | 5 | 4 | 3 | 5 | 4 | Low | 3.5 | Best position (7.4) but thinnest leader |
| social-media-strategy-for-pubs | 531 | 5 | 4 | 3 | 5 | 4 | Low–Med | 3.5 | Thin; should be clearest info→C2 bridge |
| pub-health-check-…-success | 5,381 | 5 | 4 | 5 | 5 | 4 | Low | 4.5 | Deep but Crawled-not-indexed = linking/dup, NOT quality |
| buying-a-pub-complete-guide | 3,384 | 5 | 5 | 5 | 5 | 4 | Low | 4.5 | Useful pillar; needs link discovery |
| recession-proof-pub-strategies | 367 | 4 | 4 | 2 | 5 | 3 | Med | 3.0 | Thinnest guide; surface-level; merge or thicken |
| menu-engineering-lift-average-spend | 576 | 5 | 4 | 3 | 5 | 4 | Low | 3.5 | Overlaps food cluster; crawled-not-indexed |

**Sitewide pattern:** accuracy, voice, trust consistently high; **usefulness/depth is the weak axis**, concentrated in thin guides. Voice is the brand's strongest, most consistent asset (no "different authors" problem).

---

## Factual Accuracy Flags

| Location | Claim | Issue | Severity | Action |
|------|-------|-------|----------|--------|
| `trust-badges.json:35` (LIVE homepage) | "Transform 25 Hours Into Growth" | Retired claim rendered publicly | High | Replace with approved %-led/non-numeric badge |
| `greene-king-email-template.md` (internal, not routed) | "25-30 regular teams", "60,000-70,000 people on social", "added £75,000-£100,000", "save up to 25 hours/week", "250 opted-in SMS contacts" | 5 retired claims + banned "save" wording in copy-pasteable outreach template | Medium | Rewrite to approved CLAIMS, remove "save", or delete |
| `VideoTestimonial.tsx:117–135` (ORPHANED) | "From 20 to 60+ covers", "£400+/week", "15% increase", "2 growth hours/week" | Unapproved raw-number claims in dead code | Low | Delete or rewrite before any reuse |
| `author.json` | "Co-owner of The Anchor" | Reconcile with canonical founder/co-owner framing | Low | Confirm role wording with Peter; align sitewide |
| Blog bodies (8 hits) | "saving/savings" | Legacy wording hook now blocks for new commits | Low | Reword on next edit (margin/reclaim) |

**No hallucination patterns found.** No fake studies, invented institutions, or fabricated Anchor results. GP/labour % are industry benchmarks (legitimate advice) — would be stronger with a one-line source for AI-citation safety.

---

## AI Content Pattern Flags

Measured (Known): **60/105 guides carry exactly 3 FAQs**; **43/105 carry exactly 3 voiceSearchQueries**. Rule-of-three tell is **present but not universal** — a template default, not pervasive robotic writing. Body prose reads human and in-voice.

| Pattern | Evidence | Severity | Fix |
|---------|----------|----------|-----|
| Rule-of-three default | 60/105 exactly 3 FAQs; 43/105 exactly 3 voice queries | Low | Vary FAQ count to real PAA demand when refreshing |
| Title-promise vs depth gap | "35 Summer Pub Events…" in ~368 body words | Medium | Deliver the 35 with substance or retitle |
| Templated cross-link line | "Part of the autumn pub playbook…" on 9 pages | Low | Vary the sentence; OK as hub-linking device |
| Generic surface coverage | thinnest guides (367–413w) | Medium | Thicken with first-hand Anchor specifics or merge |

**Net read:** AI risk is **thinness + predictable structure**, not robotic language. Fix = depth + first-hand specificity (also strengthens E-E-A-T).

---

## Duplication and Overlap

Endorse the Content Strategist's CAN-1…CAN-5 — overlaps are real and several overlapping pages sit in the crawled-not-indexed bucket. Highest priority: events 6-way (`event ideas for pubs` 956i pos16.8 0c = no winner → pillar = `pub-event-ideas`, merge thin `pub-event-template-profit-nights`); rescue 4-page (`/fix-my-pub` canonical, merge/redirect `/pub-rescue` + `/empty-pub-solutions`). No external plagiarism in the sample — overlap is internal/self-inflicted.

---

## Brand Voice

Strong, consistent, the brand's defensible edge (first-person, plain-English, one-publican-to-another). Watch-items: the internal GK template drifts salesy/retired/"save"; enforce Tenant (GK) / Member (BII) framing in any new comparison copy. **Protect the voice during depth work** — thicken with real Anchor specifics, not generic agency filler.

---

## E-E-A-T / AI Answer-Engine Readiness (verification)

- **Strong foundation:** real operator, dated measured results, `Person` author, `BlogPosting`/`FAQPage`/`Speakable` schema (0 parse errors per Technical). Amplify, don't rebuild.
- **Under-expressed author:** `author.json` `social:null`, `slug:null`, one-line bio → confirms Authority AUTH-01. Enrich with credentials (BII Member, years operating, approved CLAIMS), real `sameAs`/LinkedIn, visible author block (schema change → Risk Register).
- **Schema↔content match:** approved CLAIMS render consistently; no schema asserts a result the page doesn't show. The Offer/price gap is *missing*, not *mismatched* — safe to add with CLAIMS pricing.
- **Answer-block readiness:** `quickAnswer` + FAQs give quotable blocks; thinnest guides offer little quotable substance → depth fixes this. AI impact confidence **Low** (no AI-referral data).

---

## Content Quality Standards Recommendations

The site lacks a content standard (hence 24 sub-500w guides + 60 identical-3-FAQ pages). Recommend: (1) minimum-depth bar by intent (pillars ≥1,200w, sub-angles ≥800w; never an "N ideas" listicle that doesn't deliver N); (2) one topic = one canonical; (3) every quantified proof traces to `/CLAIMS.md`; (4) every guide carries ≥1 concrete Anchor specific (the E-E-A-T moat and anti-AI-tell); (5) FAQ count follows real demand, not a fixed three.

---

## Risk Register Seed (ALL require approval — no live indexation change executed)

| RR# | Proposed action | Pages | Type | Owner | Rollback | Approval |
|-----|-----------------|-------|------|-------|----------|----------|
| RR-C1 | Merge thin `pub-event-template-profit-nights` (490w) → `pub-event-ideas`; 301 | 1→pillar | Redirect/Merge | Content | Restore status:published; remove redirect | Required |
| RR-C2 | Merge/redirect `/pub-rescue` + `/empty-pub-solutions` → `/fix-my-pub` | 2→1 | Redirect/Merge | Content | Remove redirects; re-publish | Required |
| RR-C3 | Retarget/merge `quiz-night-101` → `quiz-night-ideas` | 1 | Redirect/Retarget | Content | Revert | Required |
| RR-C4 | Pick one canonical for "pub marketing" (`/pub-marketing` vs `/pub-marketing-agency` vs `/services`→`/ways-to-work`); redirect loser | ≤2 | Redirect/Canonical | Content/Tech | Remove redirect | Required |
| RR-C5 | Resolve `cash-flow-crisis-breaking-cycle` 410-vs-sitemap (restore vs keep-410+drop-from-sitemap) | 1 | Restore/410 | Content/Tech | Toggle status; single-source GONE list | Required (overlaps Technical C-2) |
| RR-C6 | Review `/capabilities` (88-line): if duplicative → noindex; else thicken | 1 | Noindex/Refresh | Content | Remove noindex | Required |
| RR-C7 | Remove/Noindex `/about-demo` (demo in not-indexed bucket) | 1 | Noindex/Remove | Tech/Content | Re-publish | Required (confirm Technical) |
| RR-C8 | Thicken 11 sub-700w guides in Crawled-not-indexed, then request indexing | 11 | Content refresh (no directive) | Content | N/A — additive | Low-risk |
| RR-C9 | Delete orphaned `VideoTestimonial.tsx` (unapproved claims, no imports) | 1 component | Code removal | Dev/Editorial | Git revert | Low-risk |
| RR-C10 | Fix live homepage trust badge (remove "25 Hours") | trust-badges.json | One-off copy fix | Content/Editorial | Git revert | Low-risk |

RR-C1…C7 = QA-verified, approval-gated consolidation of the Content Strategist's merges/redirects. RR-C8…C10 = content/code fixes, no indexation directive, minimal risk.

---

(Machine-readable findings JSON is returned in the agent's summary for orchestrator merge.)
