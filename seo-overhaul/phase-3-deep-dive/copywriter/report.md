# SEO Copywriter Report -- Orange Jelly (orangejelly.co.uk)

**Date:** 2026-03-23
**Phase:** 3 -- Deep Dive
**Author:** SEO Copywriter Agent

---

## Executive Summary

Orange Jelly has strong content foundations -- commercially relevant pages, genuine E-E-A-T credentials, and a unique licensee-operator positioning that no competitor can replicate. However, the on-page SEO copywriting across the site's priority pages has several systemic weaknesses that limit ranking potential:

1. **Title tags are too long, too vague, or miss primary keywords.** Many titles prioritise brand messaging ("Transformative Marketing for Hospitality Partners") over search-intent keywords ("Pub Marketing Agency" or "Empty Pub Solutions"). Google truncates titles beyond ~60 characters and front-loads the first 3-4 words for ranking weight.

2. **Meta descriptions lack calls-to-action and specificity.** Several descriptions read like mission statements rather than click-driving SERP snippets. The best-performing meta descriptions include a number, a benefit, and a CTA.

3. **H1 tags are inconsistent.** Some pages have compelling, keyword-rich H1s; others use generic or brand-centric headings that do not match search intent.

4. **Internal linking is thin.** Priority conversion pages (services, pub-marketing-agency, fix-my-pub) receive minimal inbound links from the 66 published blog posts. The blog posts themselves rarely link to each other or to service pages.

5. **Blog SEO overrides cover only 8 of 66+ posts.** The remaining posts use their frontmatter titles directly, which are often good but could be improved for click-through rate and keyword targeting.

6. **"Hospitality partner" language dilutes pub keyword targeting.** The recent brand refresh replaced "pub" language with "hospitality partner" terminology in many places. While this broadens the brand, it weakens keyword relevance for the primary audience (pub licensees searching for pub-specific help).

---

## Key Patterns Identified

### Pattern 1: Brand Language vs Search Language

The site uses "hospitality partners", "hospitality growth services", "transformational marketing" extensively. These terms have near-zero search volume. Target customers search for "pub marketing", "help for struggling pubs", "pub marketing agency". Every title tag and H1 should lead with what the searcher types, not what the brand calls itself.

**Recommendation:** Reserve brand language for body copy and about sections. Titles, H1s, and meta descriptions should use searcher vocabulary.

### Pattern 2: Title Tag Formula

Current titles are often descriptive but not competitive. The recommended formula for Orange Jelly pages:

```
[Primary Keyword] -- [Benefit/Differentiator] | Orange Jelly
```

The `| Orange Jelly` suffix is appended automatically by the metadata utility, so the `title` prop should NOT include "Orange Jelly". Keep the pre-suffix title to 45-50 characters maximum.

### Pattern 3: Meta Description Formula

```
[Hook with primary keyword]. [Specific proof point or number]. [CTA]. [Price/differentiator].
```

Target: 150-155 characters. Always end with a reason to click.

### Pattern 4: Missing Internal Links

Every blog post should link to at least:
- Its parent cluster/service page
- 2-3 related blog posts
- One conversion page (fix-my-pub, contact, or services)

Every service/solution page should link to at least:
- 3-5 relevant blog posts as supporting evidence
- The results page
- Related service pages

---

## Priority Pages Summary

| Page | Title Quality | Meta Quality | H1 Quality | Internal Links | Overall |
|------|:---:|:---:|:---:|:---:|:---:|
| Homepage | Weak | Moderate | Weak | Moderate | Needs work |
| Services | Weak | Weak | Moderate | Moderate | Needs work |
| Pub Marketing Agency | Strong | Strong | Strong | Good | Minor tweaks |
| Fix My Pub | Strong | Strong | Good | Moderate | Minor tweaks |
| Empty Pub Solutions | Good | Moderate | Good | Weak | Needs work |
| Quiet Midweek Solutions | Moderate | Moderate | Good | Weak | Needs work |
| Results | Weak | Moderate | Moderate | Moderate | Needs work |
| Pub Marketing Surrey | Moderate | Good | Moderate | Weak | Needs work |
| Pub Marketing London | Moderate | Good | Moderate | Weak | Needs work |
| Licensees Guide | Moderate | Moderate | Moderate | Good | Minor tweaks |
| Blog: Quiz Night Ideas | Good | Good | Good | Moderate | Minor tweaks |
| Blog: Compete with Wetherspoons | Good | Good | Good | Moderate | Minor tweaks |
| Blog: How to Run Pub Events | Good | Good | Good | Moderate | Minor tweaks |

---

## Top 5 Quick Wins

1. **Rewrite homepage title and H1** to include "pub marketing" -- the single highest-impact keyword change on the site.
2. **Rewrite services page title and meta description** to target "pub marketing services" instead of generic "hospitality growth services".
3. **Add internal links from top blog posts to conversion pages** -- quiz-night-ideas, compete-with-wetherspoons, and how-to-run-successful-pub-events collectively have the most ranking potential and should funnel to /services and /pub-marketing-agency.
4. **Rewrite results page title** to target "pub marketing results" or "pub marketing case studies" instead of generic "hospitality marketing results".
5. **Enable FAQ schema on quiet-midweek-solutions** -- the FAQ section is coded but rendered inside `{false && ...}` (disabled). Re-enable it and add FAQ structured data.

---

## Detailed Recommendations

See `page-recommendations.md` for complete page-by-page analysis with exact recommended title tags, meta descriptions, H1s, content additions, and internal linking opportunities.
