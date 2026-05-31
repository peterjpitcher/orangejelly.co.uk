# Hub-with-Subpages vs Flat Hub-and-Spoke: Architecture Briefing

**Scenario:** Orange Jelly's "Autumn Pub Playbook" — 1 hub + ~7 deep-dive guides, currently flat under `/licensees-guide/<slug>`, interlinked hub-and-spoke. Most guides are EVERGREEN, general-interest, and belong to a year-round "pub event ideas" pillar. A printed Greene King QR points at the hub.

**Date:** May 2026. Sources: Google Search Central, Ahrefs, Semrush, Backlinko, Search Engine Journal (2021–2026).

---

## RECOMMENDATION

**Keep the current flat `/licensees-guide/<slug>` URLs. Do NOT migrate the guides into a `/autumn/...` hierarchy.** Invest instead in (a) a strong, permanent year-round pillar page ("pub event ideas") that owns the evergreen guides, and (b) a lightweight, refreshable seasonal "Autumn Playbook" hub that *curates and links to* those same guides without owning their URLs.

The SEO benefit of a topic cluster comes from the **internal-linking network + a quality pillar page**, *not* from nesting URLs in a subfolder. Moving existing-URL content into a seasonal folder is the worst of both worlds: it incurs 301 migration risk and equity dilution, and it siloes evergreen, year-round content under a dated/seasonal path it will outlive.

**Confidence: high.** The deciding sources are unusually explicit (Ahrefs: silos = folders, clusters = links — "think clusters first, architecture as support, not strict silos"; Google: URL structure is about being human-readable, not a ranking lever).

---

## KEY BEST-PRACTICE POINTS (each with one-line rationale)

### 1. Subfolder nesting is NOT what delivers cluster SEO — internal linking + the pillar page is
- **Ahrefs (internal links guide):** A *silo* = folder structure (`/seo/keyword-research`); a *topic cluster* = the linking network (pillar linked reciprocally to subtopics). "Both help Google understand topical relevance; they just approach it differently." → The ranking benefit is achievable with EITHER URL layout, so URL nesting is not required.
- **Ahrefs:** "Think in topic clusters first and use clean site architecture as support — not a strict silo system. Strict silos discourage linking between sections, [so] you miss out on passing authority and context across related topics." → A rigid `/autumn/` silo would actively *hurt* cross-linking to the broader events pillar.
- **Google Search Central (URL structure):** Recommends URLs that are "constructed logically and intelligible to humans" and to "group topically" — framed as crawlability/clarity, never as a ranking multiplier. → `/topic/subpage` does not out-rank `/section/subpage` given identical internal linking.
- **Ahrefs (topic clusters):** "Google has never specifically said to use topic clusters." The closest official line is "Design your site to have a clear conceptual page hierarchy" — satisfiable via linking + breadcrumbs, not folder depth.

### 2. What makes the PILLAR/HUB page rank and convert
- **Backlinko:** A pillar comprehensively covers a broad topic and links to detailed cluster pages; it "targets the broader primary keyword" while cluster pages target "long-tail secondary keywords." → Build the events pillar to win the head term ("pub event ideas"); let guides win the long-tail.
- **Backlinko:** Integrate each cluster subtopic into the pillar outline, and ensure every page "can stand alone." → Hub should summarise + two-way link each guide; guides must read standalone (they're general-interest).
- **SEJ:** Clusters let lower-authority sites rank long-tail now and "elevate the performance of the pillar content for more competitive keywords" over time. → Favours one *permanent* pillar accruing equity, not an annually-rebuilt seasonal page.
- **Breadcrumbs + schema:** Ahrefs — Google treats breadcrumbs "as normal links in PageRank computation" (Gary Illyes). Add `BreadcrumbList` + a hub `CollectionPage`/`ItemList` to express the hierarchy *without* needing nested URLs.

### 3. Evergreen-under-seasonal is an anti-pattern
- **Semrush (301s, "When NOT to redirect"):** For *temporary/seasonal* moves, use 302 and keep the original URL in the index — i.e. seasonal context should not permanently re-home a URL. → Evergreen guides ("how to run a wine tasting evening") must NOT live at a seasonal/dated path they outlive.
- **Ahrefs (Podia example):** A model evergreen cluster — one hub linking to 8 subpages — ranks well on **flat, non-nested URLs** (`podia.com/how-to-create-sell-profitable-online-course`), described as "long-form guide split into bite-sized chunks." → Direct precedent that flat hub-and-spoke is best-practice for evergreen clusters; the current structure already matches it.
- **Pro:** A seasonal hub gives the campaign a clear landing page + a QR target. **Con of siloing the guides under it:** fragments the year-round pillar, strands authority when the campaign ends, and forces an annual URL churn. → Resolve by *curation, not ownership*: seasonal hub links to permanently-homed guides.

### 4. UX: a dedicated hub + breadcrumbs + "part of X" labelling beats plain interlinked posts
- A hub landing page is the correct **QR destination** (orientation, "start here," choose-your-guide) — better than dropping print users onto a single blog post.
- **Ahrefs (reasonable-surfer):** Main-body contextual links carry the most weight; nav/breadcrumbs are "discounted as template elements." → Keep the hub-and-spoke links **in body copy** (highest value) and use breadcrumbs/"part of the Pub Event Ideas series" labels for orientation + structure signals.
- "Part of X" labelling + breadcrumbs improves wayfinding and topical context for users *and* crawlers without any URL change.

### 5. AI / LLM search (AI Overviews, ChatGPT, Perplexity) reward clusters + linking, not folders
- **Semrush (topic clusters):** Topical authority from a quality cluster "helps with SEO and GEO… appear for more prompts in LLM tools," and "LLMs often use Google results." → The cluster + internal links is the AI-visibility asset; URL path is irrelevant to it.
- **Semrush (AI Overviews):** AIOs use **query fan-out** (multiple related sub-queries synthesised into one answer) and weight content quality, source authority, relevance. → Comprehensive hub + standalone, well-linked guides answer more fan-out branches — exactly what a strong cluster provides regardless of URL nesting.

### 6. URL-change risk makes migration a net negative here
- **Semrush (301s):** 301s transfer "almost all" ranking power *but* "it can take weeks or even months" to settle; restructuring requires a full old→new redirect map. → Real cost and a multi-week ranking-recovery window for zero ranking upside.
- **Semrush:** Redirect chains/loops "waste crawl budget" and can impede equity flow. Restructuring an interlinked cluster risks chains and breaks existing in-body internal links. → Every existing hub↔spoke link would need rewriting; misses become chains/404s.
- **Google:** Best practice is stable, logical URLs from the start. The printed QR points at the hub — changing hub/guide URLs risks the **printed Greene King toolkit linking to redirected (or broken) URLs**, a hard external dependency you cannot re-print.

---

## NET FOR THIS SCENARIO

| | Hub-with-subpages (`/autumn/...`) | Flat hub-and-spoke (current) + strong pillar |
|---|---|---|
| Cluster SEO benefit | Same (comes from linking, not folders) | **Same** |
| Evergreen content fit | Poor — siloed under dated/seasonal path | **Strong** — neutral, year-round URLs |
| Annual refresh | URL churn each year | **Refresh hub copy only; URLs stable** |
| Migration risk | 301 map, equity-settle delay, broken in-body links, printed-QR risk | **None** |
| AI/LLM visibility | Same | **Same** |
| UX | Good (if breadcrumbs/labels added) | **Good** (add hub + breadcrumbs + "part of X" — no URL change needed) |

**Do:** strengthen the permanent "pub event ideas" pillar to own the guides; add `BreadcrumbList` + hub `CollectionPage`/`ItemList` schema; keep in-body two-way hub↔spoke links; label guides "part of the Pub Event Ideas series"; make the Autumn hub a curated, refreshable view that *links to* (not owns) the evergreen guides at their existing URLs.
**Don't:** move any existing `/licensees-guide/<slug>` URL into a `/autumn/` hierarchy.

---

## STRONGEST SOURCES
1. Google Search Central — URL Structure Best Practices: https://developers.google.com/search/docs/crawling-indexing/url-structure
2. Ahrefs — Internal Links for SEO (silos vs clusters; reasonable-surfer; breadcrumbs as PageRank): https://ahrefs.com/blog/internal-links-for-seo/
3. Ahrefs — Topic Clusters (Google never mandated clusters; Podia flat-URL evergreen example): https://ahrefs.com/blog/topic-clusters/
4. Backlinko — Pillar Pages (structure, keyword targeting, standalone pages): https://backlinko.com/pillar-pages
5. Semrush — Topic Clusters for SEO (topical authority for SEO + GEO/LLMs; Oct 2025): https://www.semrush.com/blog/topic-clusters/
6. Semrush — AI Overviews & How to Optimize (query fan-out; Feb 2026): https://www.semrush.com/blog/ai-overviews/
7. Semrush — 301 Redirects & SEO (equity transfer, settle time, "when NOT to redirect" = seasonal; Feb 2026): https://www.semrush.com/blog/301-redirects/
8. Search Engine Journal — Topic Clusters as SEO Weapon (pillar elevates competitive head terms): https://www.searchenginejournal.com/topic-clusters-seo/
