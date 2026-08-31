# Content Quality Audit — Orange Jelly (Editor / QA Lead)

**Author:** Editor / QA Lead · **Date:** 2026-07-07 · **Mode:** Full Overhaul, second run
**Scope (per strategy §7):** AEO answer-blocks + author/expertise (E-E-A-T) signals on the 4 events/quiz cluster-leader guides (escalating June **SEO-022** Monitor→Schedule), plus a content-quality/consistency QA pass and the content-side call on the 138 retired FAQ/HowTo schema blocks.

---

## Summary

The events/quiz guide engine is **good, human-written content** — genuinely useful, on-voice, and already carrying the AEO scaffolding (a visible Quick Answer block, an author, approved-claim provenance). It is not thin AI filler, and the retired claims from `/CLAIMS.md` do **not** appear in the blog corpus (clean). The AEO gap is therefore **not "write answer blocks from scratch"** — it is one systemic template defect and two freshness/expertise gaps that repeat identically across all four leaders:

1. **FAQ Q&A is invisible to users and to answer engines.** The `faqs` frontmatter every leader carries is consumed **only** by `EnhancedBlogSchema.tsx` as `FAQPage` JSON-LD (`src/components/blog/EnhancedBlogSchema.tsx:90-100`) — i.e. it *is* one of the 138 retired rich-result blocks. There is **no visible on-page FAQ render** anywhere in the guide template (`BlogPost.tsx`, 402 lines, renders QuickAnswer + AuthorInfo + body, no FAQ section). So the single most citable, most extractable asset on each page — a clean question→answer list — is served purely as markup Google no longer rewards, and a human never sees it. This is the headline AEO finding and it is a **template/system fix**, not four page fixes.
2. **No visible freshness signal.** `updatedDate` exists in frontmatter but is used **only** in schema `dateModified` (`EnhancedBlogSchema.tsx:37`); the page renders `publishedDate` only (`BlogPost.tsx:170`). Answer engines and users both weight "last reviewed" — a guide dated 2025-05-01 with no visible refresh date reads as stale.
3. **Author signal is thin for string-author guides.** Guides using `author: "Peter Pitcher"` (string) get a generic one-line fallback bio with no credentials (`page.tsx:314-315`, default: *"Licensee of The Anchor and founder of Orange Jelly. Helping pubs thrive with proven strategies."*), whereas the object-author form and the component default carry a fuller experience bio. For E-E-A-T the bio should consistently assert first-hand experience (licensee of The Anchor, tested on-site) and, ideally, dated/quantified provenance.

QA/consistency violations found are minor and localised: **8 banned "save/savings" usages across 6 files**, **2 US spellings**, both fixable in a single sweep. Greene King ("tenant") and BII ("member") terminology is **correct** throughout the sample.

---

## The 4 cluster-leader guides (events/quiz)

Identified by impression-weighting the events/quiz queries in `evidence/search-queries.csv` (701 queries, GSC 12-mo export 2026-06-16) onto their most likely landing guide, cross-referenced with `evidence/url-inventory.csv` word counts. No GA4 page-level data exists (`landing-pages.csv` empty), so mapping is query-text→slug (inferred), not GSC Pages-confirmed.

| # | Guide (`/licensees-guide/…`) | Cluster | Impr (≈, mapped) | Words | quickAnswer? | FAQ frontmatter? | Author form |
|---|---|---|---:|---:|---|---|---|
| 1 | `pub-event-ideas` | events | **1,812** | 1,783 | ✅ visible | ✅ 4 FAQs (schema-only) | string |
| 2 | `pop-up-events-for-pubs` | events | **894** | 2,508 | ✅ visible | ✅ 4 FAQs (schema-only) | string |
| 3 | `quiz-night-ideas` | quiz | **512** (10 clicks) | 944 | ✅ visible | ✅ 3 FAQs (schema-only) | string |
| 4 | `quiz-night-101` | quiz | **416** | 1,905 | ✅ visible | ✅ 3 FAQs (schema-only) | string |

*Swing candidate:* `how-to-run-successful-pub-events` (≈462 impr, 3,087 words) is the events **pillar** and a close 5th; if the events cluster leader is defined by hub role rather than raw impressions, swap it for `pop-up-events-for-pubs`. Recommendation: keep the four above (they hold the demand) and treat the pillar as a fast-follow — same template fix carries it for free. Highest-impression single query on the site's informational side is **"event ideas for pubs" (956 impr, pos 16.8, 0 clicks)** → `pub-event-ideas`, so that guide is the priority AEO target.

### AEO answer-block + E-E-A-T spec (applies to all four identically)

Because the gaps are template-level, the fix is **one component change + a per-guide content pass**, not four bespoke rebuilds. For each leader:

- **Quotable 40-60 word answer** — *already present and rendered* as the Quick Answer card. Two need a light QA edit: `quiz-night-ideas`'s answer leads with unsourced specifics ("Entry £2-3 per person… transforms Tuesday turnover") — keep the format advice, but "transforms Tuesday turnover" is an unquantified outcome claim; soften to descriptive ("gives regulars a reason to come midweek"). `pub-event-ideas`'s answer is exemplary (definitional, list-led, extractable) — use it as the house pattern.
- **Visible FAQ block (the core fix)** — render the existing `faqs` frontmatter as an on-page Q&A section (each question an `<h3>`/`<dt>`, each answer a self-contained 2-3 sentence paragraph an engine can lift). This makes the retired-schema Q&A *visible and citable* and satisfies "concise answer blocks" in the AI-search checklist. Owner note: **content owns the Q&A copy quality; technical owns adding the render** (see the 138-block section and defer the markup change to technical).
- **Author/expertise (E-E-A-T)** — standardise on a bio that states first-hand experience and provenance, e.g. *"Peter Pitcher — licensee of The Anchor, Stanwell Moor, and founder of Orange Jelly. The events approach here is the one that helped grow The Anchor's table bookings by 403%."* (approved claim, `/CLAIMS.md` `table-bookings`, with "at The Anchor" provenance). Convert the four string-authors to the fuller bio so they stop hitting the generic one-line fallback.
- **Dates + sources** — surface a **visible "Last reviewed: [Month Year]"** line (wire `updatedDate` into the template) and refresh the stale ones: `quiz-night-ideas` (`publishedDate: 2025-05-01`, >12 months, over 25% of the site's events clicks ride on it) and `quiz-night-101` (2025-11-06). Any specific figure used as advice (entry prices, round counts, timings) is fine as first-hand recommendation but should read as "what works at The Anchor", not as a universal statistic.

---

## Critical / High Quality Issues

| # | Issue | Why it matters | Fix | Owner |
|---|---|---|---|---|
| EQA-1 | **FAQ Q&A rendered as retired `FAQPage` JSON-LD only — never visible on-page** across all 4 leaders (and the whole guide template) | The most extractable, most citable content on each page is invisible to users and served as markup Google retired. This is *the* AEO gap the escalation is chasing. | Add a visible FAQ render to the guide template that consumes existing `faqs` frontmatter; keep schema in step (technical owns markup) | Content (copy) + Technical (render) |
| EQA-2 | **No visible freshness date**; `updatedDate` is schema-only | Stale-looking guides lose AI-answer trust and user confidence; two leaders are >8 months old | Render a "Last reviewed" line from `updatedDate`; refresh `quiz-night-ideas` + `quiz-night-101` | Content + Technical |
| EQA-3 | **Thin author bio on string-author guides** (generic one-line fallback, no credentials) | E-E-A-T experience signal is the cheapest AEO/trust win and is currently diluted | Convert the 4 leaders to the full experience bio with provenance | Content |

---

## Factual Accuracy Flags

| Page | Claim | Issue | Data status | Severity | Recommended Action |
|------|-------|-------|-------------|----------|--------------------|
| `quiz-night-ideas` | "Entry £2-3 per person… **transforms Tuesday turnover**" (Quick Answer) | Unquantified outcome claim stated as fact; no source/provenance | inferred | Low | Soften to descriptive ("gives regulars a midweek reason to come in"); keep the price/format advice as first-hand recommendation |
| `pub-event-ideas` | "grew our table bookings by **403%**" at The Anchor | **Correct** — matches `/CLAIMS.md` `table-bookings`, with "at The Anchor" provenance and % framing | Known | — | None (exemplary; use as the model for the other three) |
| All 4 | Format/timing specifics (rounds, break length, service caps) | Presented as generic best practice | inferred | Low | Frame as "what works at The Anchor / for a typical pub", not as universal statistics |

No hallucinated studies, fabricated statistics, invented institutions, or misattributed quotes found in the sample. No retired `/CLAIMS.md` metrics (quiz regulars, £75-100K value-added, 25 hours, 60-70K views, food GP 58→71%) appear in the blog corpus — clean.

---

## AI Content Pattern Flags

Content reads as human-written (varied structure, first-person Anchor detail, natural British phrasing). One minor structural tell only:

| Page | Pattern | Example | Fix |
|------|---------|---------|-----|
| `quiz-night-ideas` | Rigid "Cluster 1/2/3/4 → exactly 3 bullets each" parallel structure | Every cluster has precisely three bullets and a one-line closer | Vary bullet counts (2/4/5) and break the identical cluster template so it reads less machine-generated; the 944-word length also makes it the thinnest leader — worth deepening during the refresh |

---

## QA / Consistency Violations (corpus-wide sample)

Scanned all 106 blog markdown files.

### Banned "save/savings" family — 8 occurrences, 6 files (`/CLAIMS.md`: use "reclaim / margin growth / cut waste")

| File:line | Text | Suggested British-on-brand replacement |
|---|---|---|
| `cash-flow-crisis-breaking-cycle.md:6` | quickAnswer "…by **saving** £100 weekly from improved margins" | "…by setting aside £100 weekly from improved margins" |
| `energy-bill-shock-cut-venue-costs.md:21` | metaDescription "energy-**saving** tactics" | "energy-cutting / lower-your-energy-bill tactics" |
| `pub-wages-labour-costs-guide.md:201` | "That is a **saving** of 45 per week" | "That reclaims £45 per week" |
| `pub-insurance-cover-guide.md:267` | "…not actually **saving** you money" | "…not actually cheaper overall" |
| `pub-insurance-cover-guide.md:286` | "A 500-pound **saving** on your premium" | "A £500 cut to your premium" |
| `wet-led-vs-food-led-pubs.md:103` | "the single biggest cost **saving**" | "the single biggest cost cut" |
| `brewery-tie-improve-your-deal.md:322, 395` | "start **saving** from day one" (×2) | "start setting money aside from day one" |

*Note:* these predate or slipped past the pre-commit hook; the hook will block any file re-touched, so fix in the same pass as any edit to these files. Also fix the "£" formatting inconsistency exposed above — several use "500 pounds"/"45 per week" instead of "£500"/"£45".

### Non-British spellings — 2 occurrences

| File:line | Text | Fix |
|---|---|---|
| `delivery-click-collect-without-harm.md:65` | "a clean, **labeled** area" | "labelled" |
| `terrible-online-reviews-damage-control.md:139` | "**traveler**-friendly information" | "traveller-friendly" |

### Terminology — PASS

- **Greene King** referenced correctly as "tenant" in every instance sampled (e.g. `brewery-tie:79`, `how-much-profit:63`). No "partner" misuse.
- **BII** referenced correctly as membership ("of which we are members", `pub-health-check:99`; "for members"). No misuse.

---

## Duplication and Overlap

| Pages | Type of overlap | Recommended resolution |
|-------|-----------------|------------------------|
| `quiz-night-ideas` (944w) ↔ `quiz-night-101` (1,905w) | Both quiz cluster; ideas = format variety, 101 = starter basics. Overlap is manageable but they compete for "pub quiz" queries. | Keep both; enforce clear intent split — 101 = "how to start", ideas = "formats to keep it fresh". They already cross-link (verified live). Ensure distinct H1/title framing so neither cannibalises. No merge. |
| `pub-event-ideas` (overview/hub) ↔ `how-to-run-successful-pub-events` (pillar, 3,087w) | Both broad "events" — one is a directory overview, one is the how-to pillar | Keep both; confirm one is unambiguously the topic owner for "event ideas for pubs" (`pub-event-ideas`, which already ranks) and the pillar is the deeper how-to. Internal links should signal the hierarchy. |

No copy-paste/scraped content detected in the sample.

---

## The 138 retired FAQ/HowTo schema blocks — content-side call

**Verdict: keep the FAQ *content*, make it visible, drop reliance on the retired rich-result markup.** The technical audit owns the markup change; this is the "is the Q&A actually useful" call.

The FAQ Q&A on the cluster-leader guides (and across the corpus) is **genuinely useful and worth keeping visible** — the questions are real user/voice-search phrasings ("How long should a pub quiz last?", "Do I need a Temporary Event Notice for a pop-up?") and the answers are self-contained and quotable. Right now that value is **wasted**: it exists only as `FAQPage` JSON-LD (retired) and is invisible to both users and answer engines that read rendered HTML.

Recommendation:
- **Render the FAQ Q&A on-page** for the events/quiz cluster leaders first (they carry the AI-answer opportunity), then roll the template change across the guide corpus. This converts dead schema weight into live, citable AEO content — the single highest-leverage move from the 138-block problem.
- **HowTo blocks:** where the guide genuinely is a procedure (e.g. how-to guides), the step content is usually already in the visible body — so the retired HowTo markup can be dropped without content loss. Verify per-page that no step-only content lives solely in the HowTo JSON-LD before technical removes it.
- **Keep FAQ markup only where it now maps to a visible on-page FAQ** (schema-matches-visible-content rule). Retired-rich-result FAQPage markup with no visible counterpart is pure maintenance weight and a schema/visible-content mismatch risk — drop it.

---

## Content Quality Standards Recommendations

1. **Make the guide template render everything the frontmatter already carries** — FAQ Q&A and `updatedDate` ("Last reviewed") are authored but invisible. Fixing the template once fixes AEO readiness across ~106 guides.
2. **Standardise the author bio** to always assert first-hand experience + provenance; retire the generic one-line fallback for string-authors.
3. **Adopt a "no unquantified outcome claims" rule** — outcome statements are either an approved `/CLAIMS.md` % with "at The Anchor" provenance, or framed as first-hand experience, never as bare universal fact.
4. **Add "save/savings" and US-spelling checks to the content sweep** (the hook catches new edits; the 8 existing "save" hits and 2 US spellings need a one-off remediation pass).

---

```json
{ "findings": [
  { "finding": "FAQ Q&A on the 4 events/quiz cluster-leader guides (and the whole guide template) renders ONLY as retired FAQPage JSON-LD, never visibly on-page — the most citable/extractable AEO asset is invisible to users and answer engines", "evidence": "src/components/blog/EnhancedBlogSchema.tsx:90-100 (faqs → FAQPage schema); src/components/blog/BlogPost.tsx (402 lines, no FAQ render — only QuickAnswer+AuthorInfo+body); live fetch pub-event-ideas & quiz-night-ideas show no visible FAQ section", "source": "Codebase inspection + live page fetch (ctx_fetch_and_index)", "dataStatus": "Known", "severity": "High", "confidence": "High", "impactArea": "AI visibility", "owner": "Editorial", "effort": "Medium", "dependencies": "Technical (add FAQ render to guide template); coupled to the 138-retired-schema fix", "fixType": "Template/system fix", "recommendedAction": "Render existing faqs frontmatter as a visible on-page Q&A block (each Q an h3/dt, each A a self-contained 2-3 sentence paragraph) on the 4 leaders first, then corpus-wide; keep schema matching visible content", "validationStep": "Live pages show a visible FAQ section whose Q&A matches the FAQPage schema; re-fetch confirms extractable answer text in rendered HTML", "riskRollback": "Content/template only, reversible via git" },
  { "finding": "4 events/quiz cluster-leader guides identified by impression-weighting: pub-event-ideas (~1,812 impr), pop-up-events-for-pubs (~894), quiz-night-ideas (~512/10 clicks), quiz-night-101 (~416). All already carry a visible Quick Answer + FAQ frontmatter + an author, so the AEO task is verification/rendering + freshness + expertise, not authoring from scratch", "evidence": "evidence/search-queries.csv (query→slug impression mapping); evidence/url-inventory.csv word counts; frontmatter grep of content/blog/*.md (hasQuickAnswer:true, faqs present, author present)", "source": "GSC 12-mo export 2026-06-16 + inventory + frontmatter inspection", "dataStatus": "inferred", "severity": "Medium", "confidence": "Medium", "impactArea": "AI visibility", "owner": "Editorial", "effort": "Small", "dependencies": "No GA4 page-level data (landing-pages.csv empty) — mapping is query-text→slug, not GSC-Pages-confirmed", "fixType": "Content process fix", "recommendedAction": "Confirm the 4 targets (swing candidate: how-to-run-successful-pub-events as events pillar); prioritise pub-event-ideas ('event ideas for pubs' 956 impr, pos 16.8, 0 clicks)", "validationStep": "Cluster-leader set agreed; AEO passes scheduled per guide", "riskRollback": "n/a — selection decision" },
  { "finding": "No visible freshness signal on guides — updatedDate exists in frontmatter but is used only in schema dateModified, never rendered; page shows publishedDate only. quiz-night-ideas (publishedDate 2025-05-01, >12 months, carries >25% of site events clicks) and quiz-night-101 (2025-11-06) read as stale", "evidence": "src/components/blog/EnhancedBlogSchema.tsx:37 (dateModified: updatedDate); src/components/blog/BlogPost.tsx:170 (<time>{publishedDate}</time> only); content/blog/quiz-night-ideas.md frontmatter publishedDate 2025-05-01", "source": "Codebase inspection + frontmatter", "dataStatus": "Known", "severity": "Medium", "confidence": "High", "impactArea": "AI visibility", "owner": "Editorial", "effort": "Small", "dependencies": "Technical (wire updatedDate into template render)", "fixType": "Template/system fix", "recommendedAction": "Render a visible 'Last reviewed: [Month Year]' line from updatedDate; content-refresh quiz-night-ideas and quiz-night-101", "validationStep": "Live guide shows a Last-reviewed line; refreshed guides carry current updatedDate", "riskRollback": "Template/content only, reversible" },
  { "finding": "Author/expertise signal is thin on string-author guides — author: \"Peter Pitcher\" (string) triggers a generic one-line fallback bio with no credentials, whereas the object-author form and component default carry a fuller experience bio. All 4 cluster leaders use the string form", "evidence": "src/app/licensees-guide/[slug]/page.tsx:308-319 (defaultBio 'Licensee of The Anchor and founder of Orange Jelly. Helping pubs thrive with proven strategies.' used for string authors); frontmatter of the 4 leaders shows author: \"Peter Pitcher\"", "source": "Codebase inspection + frontmatter", "dataStatus": "Known", "severity": "Medium", "confidence": "High", "impactArea": "AI visibility", "owner": "Editorial", "effort": "Small", "dependencies": "None", "fixType": "Content process fix", "recommendedAction": "Convert the 4 leaders to the full experience bio asserting first-hand provenance (licensee of The Anchor; approach that grew The Anchor table bookings +403% per /CLAIMS.md)", "validationStep": "Rendered author bio on the 4 leaders shows the fuller credential/experience text", "riskRollback": "Content only, reversible" },
  { "finding": "8 banned 'save/savings' usages across 6 blog files violate the /CLAIMS.md + pre-commit content rule (use reclaim/margin growth/cut waste)", "evidence": "content/blog: cash-flow-crisis-breaking-cycle.md:6, energy-bill-shock-cut-venue-costs.md:21, pub-wages-labour-costs-guide.md:201, pub-insurance-cover-guide.md:267 & 286, wet-led-vs-food-led-pubs.md:103, brewery-tie-improve-your-deal.md:322 & 395", "source": "grep of content/blog/*.md", "dataStatus": "Known", "severity": "Low", "confidence": "High", "impactArea": "conversion", "owner": "Editorial", "effort": "Small", "dependencies": "None (hook will block re-touched files until fixed)", "fixType": "Content process fix", "recommendedAction": "Replace 'save/saving' with reclaim/set aside/cut wording; also normalise '500 pounds'/'45 per week' to '£500'/'£45'", "validationStep": "grep for \\bsav(e|es|ed|ing|ings)\\b returns 0 in these files; pre-commit passes", "riskRollback": "Content only, reversible" },
  { "finding": "2 non-British spellings in blog body: 'labeled' and 'traveler-friendly'", "evidence": "content/blog/delivery-click-collect-without-harm.md:65 ('labeled'); content/blog/terrible-online-reviews-damage-control.md:139 ('traveler-friendly')", "source": "grep of content/blog/*.md", "dataStatus": "Known", "severity": "Low", "confidence": "High", "impactArea": "UX", "owner": "Editorial", "effort": "Small", "dependencies": "None", "fixType": "Content process fix", "recommendedAction": "labeled → labelled; traveler-friendly → traveller-friendly", "validationStep": "British-spelling grep returns 0 in these files", "riskRollback": "Content only, reversible" },
  { "finding": "quiz-night-ideas Quick Answer states an unquantified outcome as fact ('Entry £2-3 per person… transforms Tuesday turnover'); guide also has a rigid 'Cluster 1-4 → exactly 3 bullets' AI-tell and is the thinnest leader (944 words)", "evidence": "content/blog/quiz-night-ideas.md quickAnswer; live fetch shows Cluster 1/2/3/4 each with exactly 3 bullets", "source": "Frontmatter + live page fetch", "dataStatus": "inferred", "severity": "Low", "confidence": "Medium", "impactArea": "SEO", "owner": "Editorial", "effort": "Small", "dependencies": "None", "fixType": "Content process fix", "recommendedAction": "Soften 'transforms Tuesday turnover' to a first-hand/descriptive framing; vary bullet counts to break the parallel-structure tell; deepen toward ~1,500 words during the AEO refresh", "validationStep": "Outcome claim reframed; bullet counts vary; word count raised", "riskRollback": "Content only, reversible" },
  { "finding": "Retired /CLAIMS.md metrics (quiz regulars, £75-100K value-added, 25 hours reclaimed, 60-70K social views, food GP 58→71%, 300 contacts) do NOT appear in the blog corpus — clean; approved claims (e.g. table bookings +403% at The Anchor) are used correctly with provenance", "evidence": "grep of content/blog/*.md for retired-claim patterns returned 0; pub-event-ideas live: 'grew our table bookings by 403%' at The Anchor matches CLAIMS.md table-bookings", "source": "grep of content/blog/*.md + /CLAIMS.md + live fetch", "dataStatus": "Known", "severity": "Low", "confidence": "High", "impactArea": "SEO", "owner": "Editorial", "effort": "Small", "dependencies": "None", "fixType": "Content process fix", "recommendedAction": "No action needed — maintain; treat CLAIMS.md as the ongoing gate for any new proof points", "validationStep": "Periodic grep stays clean as new content ships", "riskRollback": "n/a" }
] }
```
