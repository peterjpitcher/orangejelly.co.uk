# Editor / QA Lead Report -- orangejelly.co.uk

**Date:** 2026-03-23
**Reviewer:** Editor / QA Lead Agent
**Scope:** Content quality, accuracy, consistency, brand voice, E-E-A-T, duplication
**Pages reviewed:** Homepage, About, Services, Results, Fix My Pub, Empty Pub Solutions, Pub Rescue, Quiet Midweek Solutions, Pub Marketing (pillar), Pub Marketing Agency, Compete With Pub Chains, Pub Marketing Surrey (location page sample), 12 blog posts

---

## Executive Summary

The site is substantially well-written, empathetic, and genuinely useful for its target audience of struggling UK pub licensees. Peter's first-person voice comes through authentically, and the content demonstrates real operational experience -- a genuine E-E-A-T strength. However, there are **metric inconsistencies** across pages, a **claims audit conflict** that has not been resolved in live code, several **content overlap issues** between landing pages, and a handful of **outdated year references** in blog posts. These are fixable without major rewrites.

**Critical issues:** 3
**High-priority issues:** 7
**Medium-priority issues:** 9
**Low-priority issues:** 5

---

## 1. Critical Quality Issues

### CRITICAL-1: Quiz Night Metric Inconsistency (25-35 vs 25-30)

The approved metric in CLAUDE.md is **"25-35 regulars (up from 20)"**. However, the vast majority of live site content uses **"25-30 teams"** or **"25-30 regular teams"**:

| Location | Value Used |
|----------|-----------|
| CLAUDE.md (source of truth) | 25-35 regulars |
| Homepage (`page.tsx` line 114) | 25-30 teams |
| Results page schema (line 74) | 25-30 Regular Teams |
| Results page review schema (line 123) | 25-30 regular teams |
| Empty Pub Solutions (line 180) | 25-30 regular teams |
| Pub Rescue (line 142) | 25-30 regular teams |
| Quiet Midweek Solutions (line 127) | 25-30 regular teams |
| `src/components/SocialProof.tsx` | 25-30 quiz teams |
| `src/components/Meta.tsx` | 25-30 quiz teams |
| `content/data/results.json` | 25-30 teams |
| `content/data/services.json` | 25-30 |
| `PubServiceLandingPage.tsx` | 25-35 |
| `content/data/services/fix-my-pub.json` | 25-35 regulars |

**Impact:** The site says two different things. "25-35 regulars" (CLAUDE.md, fix-my-pub) vs "25-30 teams" (everywhere else). Also note the unit mismatch: "regulars" vs "teams" -- these are different measurements (teams could mean 4-6 people each).

**Recommendation:** Decide on ONE canonical metric and apply everywhere. If the real number is 25-30 teams per month, update CLAUDE.md. If it is 25-35 individual regulars, update all page content. The unit (teams vs regulars) must also be standardised.

### CRITICAL-2: Food GP Percentages Published Despite Claims Audit Prohibition

The Claims Audit (`docs/reports/CLAIMS_AUDIT.md`, line 79) explicitly states:

> "Our food gp should never be mentioned explicitly. Just not a % increase (e.g.: we increased our food GP% by 20% by making changes)"

Yet the explicit "58% to 71%" figure appears in **six live component/page files**:

- `src/components/PubServiceLandingPage.tsx` (line 161) -- affects Fix My Pub and likely other pages using this component
- `src/app/pub-marketing/page.tsx` (lines 91, 496) -- the pillar page
- `src/app/contact/ContactPage.tsx` (line 529)
- `src/app/pub-marketing-agency/page.tsx` (lines 21, 149) -- both meta description and page body

**Impact:** This directly contradicts Peter's own direction in the claims audit. The meta description for `/pub-marketing-agency` reads "We grew food GP from 58% to 71%" which is exactly what Peter said not to do.

**Recommendation:** Replace all "58% to 71%" instances with language like "improved food GP by over 20%" or "significant food GP improvement through menu engineering." Update meta descriptions accordingly.

### CRITICAL-3: Self-Authored Review in Structured Data

The Results page (`src/app/results/page.tsx`, lines 114-134) includes a Schema.org `Review` entity where the `author` is listed as "The Anchor" reviewing "Orange Jelly Pub Consulting" with a 5-star rating. The review body reads: "Peter's AI strategies transformed our pub..."

This is Peter reviewing his own business. Google's guidelines explicitly warn against self-authored reviews in structured data. This could result in a manual action or rich result penalty.

**Recommendation:** Remove the `Review` schema entirely. Replace with additional `Article` or `CaseStudy` structured data. The testimonial content can remain on the page visually, but should not be in Schema.org review markup.

---

## 2. Factual Accuracy Flags

### HIGH-1: Outdated Year References in Blog Content

| File | Issue |
|------|-------|
| `content/blog/pub-health-check-essential-fundamentals-licensee-success.md` (lines 46, 350, 450) | References "2024" three times ("Running a successful pub in 2024...") -- should be 2026 or year-agnostic |
| `content/blog/profitable-pub-food-menu-ideas.md` (keyword line 23) | Keyword "pub food trends 2024" is stale |
| `content/blog/social-media-strategy-for-pubs.md` (title) | Title says "2025" -- will be stale by year-end |

**Recommendation:** Make evergreen where possible ("Running a successful pub today..."). For the social media guide title, consider "The Complete Social Media Strategy Guide for Pubs" without a year, or update annually.

### HIGH-2: "When I bought The Anchor in 2019" -- Inaccurate Verb

In `content/blog/why-is-my-pub-empty.md` (line 53): "When I bought The Anchor in 2019..."

Peter is a Greene King **tenant**, not an owner. "Bought" implies freehold ownership. The business profile confirms "Greene King: Tenant."

**Recommendation:** Change to "When we took on The Anchor in 2019..." or "When we started running The Anchor in 2019..." -- consistent with language used elsewhere on the site (e.g., about.json: "We took on The Anchor").

### HIGH-3: "£2,000 per week" Loss Claim Unverified

In `why-is-my-pub-empty.md` (line 67): "At our lowest point, we were losing GBP 2,000 per week."

This figure does not appear in the approved metrics or claims audit. It is a specific financial claim about The Anchor that could be challenged.

**Recommendation:** Either verify and add to the approved claims list, or soften to "significant weekly losses" or remove the specific figure.

### HIGH-4: Inconsistent GBP 4,000+ Claim Context

The "GBP 4,000+ a month" figure appears across the site referring to "supplier, rota, and energy costs." This is a cost-saving figure, not a revenue figure, but it sometimes appears alongside revenue metrics without clear labelling. On the homepage (line 181): "We cut GBP 250/week in Sunday waste and GBP 4,000+ a month in supplier, rota, and energy costs." This is clear. But in `src/lib/constants.ts` (line 64) it reads "GBP 4,000+ monthly margin growth" which conflates cost savings with margin growth.

**Recommendation:** Standardise the label. "GBP 4,000+ monthly cost reduction" or "GBP 4,000+ monthly savings" is more accurate than "margin growth."

### HIGH-5: Empty Pub Solutions Estimated Cost Mismatch

In `src/app/empty-pub-solutions/page.tsx` (line 197), the HowTo schema shows `estimatedCost` of GBP 499. But the page body says "GBP 75 per hour plus VAT." GBP 499 implies approximately 6.5 hours of work, which may or may not be realistic for a full 30-day recovery plan. There is no GBP 499 package advertised anywhere on the site.

**Recommendation:** Either remove the `estimatedCost` from the schema (it is optional), or set it to a realistic range that matches the hourly rate model.

---

## 3. Page-by-Page Assessment

| Page | Quality | Accuracy | Voice | Actionable | Issues |
|------|---------|----------|-------|------------|--------|
| **Homepage** | Good | Fair -- quiz metric mismatch | Consistent | Yes | Uses "25-30 teams" not "25-35 regulars"; "modernizes" should be "modernises" (US spelling, line 95) |
| **About** | Good | Good | Consistent | Yes | No specific metrics cited -- safe. Timeline is clean |
| **Services** | Good | Good | Consistent | Yes | Data-driven from JSON, clean separation |
| **Results** | Good | Fair | Consistent | Yes | Self-review schema; 25-30 metric variant |
| **Fix My Pub** | Good | Fair | Consistent | Yes | Uses PubServiceLandingPage which shows 58-71% GP explicitly |
| **Empty Pub Solutions** | Good | Fair | Consistent | Yes | GBP 499 schema cost; 25-30 metric variant |
| **Pub Rescue** | Good | Good | Consistent | Yes | Clean; 25-30 metric used consistently |
| **Quiet Midweek Solutions** | Good | Good | Fair | Yes | Two whole sections hidden with `{false &&}` -- dead code |
| **Pub Marketing (pillar)** | Excellent | Fair | Excellent | Yes | Explicit 58-71% GP; best single page on the site for E-E-A-T |
| **Pub Marketing Agency** | Good | Fair | Consistent | Yes | 58-71% in meta description; pillar-quality content |
| **Compete With Pub Chains** | Good | Good | Consistent | Yes | Clean, data-driven |
| **Location pages (Surrey sample)** | Fair | Good | Consistent | Fair | Thin -- delegates to component with JSON data |

### Blog Post Assessment (12 posts reviewed)

| Post | Quality | Accuracy | Voice | Actionable | Issues |
|------|---------|----------|-------|------------|--------|
| quiz-night-101 | Excellent | Good | Excellent | Excellent | Best-in-class guide; comprehensive, practical |
| fill-empty-pub-tables | Good | Fair | Good | Good | "GBP 262,080 annual impact" estimate may feel inflated |
| menu-engineering-lift-average-spend | Good | Good | Good | Good | Clean, practical |
| why-is-my-pub-empty | Good | Fair | Excellent | Good | "bought" verb; GBP 2K/week claim |
| compete-with-wetherspoons | Good | Good | Excellent | Good | Strong E-E-A-T; mentions The Coach House in Reading (unverified) |
| social-media-strategy-for-pubs | Good | Good | Good | Good | Year in title will date |
| profitable-pub-food-menu-ideas | Good | Good | Good | Good | 2024 keyword stale |
| low-budget-pub-marketing-ideas | Good | Good | Good | Excellent | Practical, well-structured |
| pub-empty-tuesday-nights | Good | Good | Excellent | Good | Clean |
| karaoke-night-101 | Excellent | Good | Excellent | Excellent | Comprehensive toolkit format |
| turnaround-playbook-independent-bars | Good | Good | Good | Good | Clean |
| revenue-levers-struggling-pubs | Good | Good | Excellent | Excellent | First-person, specific, actionable |

---

## 4. Duplication and Content Overlap

### HIGH-6: Three Overlapping "Struggling Pub" Landing Pages

These three pages target substantially the same audience with similar content:

1. `/pub-rescue` -- "Pub Recovery Support"
2. `/fix-my-pub` -- "Fix My Pub -- Honest Help"
3. `/empty-pub-solutions` -- "30-Day Pub Growth Recovery Plan"

All three pages:
- Target licensees whose pubs are struggling
- Offer 30-day recovery timelines
- Feature the same Anchor case study metrics
- End with WhatsApp CTAs
- Include 4-week action plans

The differentiation is subtle at best. `/pub-rescue` focuses on crisis urgency, `/fix-my-pub` on diagnostic honesty, `/empty-pub-solutions` on a structured plan. But a visitor (or Google) would struggle to distinguish them.

**Recommendation:** Consolidate to one primary page (suggest `/fix-my-pub` as the canonical conversion page) and redirect or merge the other two. Alternatively, make differentiation sharper: one for emergencies (revenue crisis), one for growth (already stable but want more), one for specific problem diagnosis.

### HIGH-7: Blog Post Topic Overlap

Several blog posts cover substantially similar ground:

**Empty pub cluster:**
- `why-is-my-pub-empty` (12 reasons)
- `fill-empty-pub-tables` (15 strategies)
- `pub-empty-tuesday-nights` (Tuesday-specific)
- `fill-empty-seats-midweek-offers` (midweek offers)

**Turnaround cluster:**
- `turnaround-playbook-independent-bars`
- `revenue-levers-struggling-pubs`
- `30-day-action-plan-stabilise-hospitality`
- `cashflow-fixes-when-trade-drops`
- `cash-flow-crisis-breaking-cycle`

While some overlap is acceptable for topical authority, the turnaround cluster has five posts with significant content repetition. Internal linking between them is needed to signal hierarchy to Google.

**Recommendation:** Designate one post per cluster as the "hub" and link all satellite posts back to it. Ensure each satellite has a genuinely distinct angle.

---

## 5. Brand Voice Analysis

### Overall Assessment: STRONG

Peter's voice is consistent, warm, direct, and credible. Key characteristics observed:

- **Conversational but not casual** -- uses "you" extensively, avoids jargon, explains technical terms
- **Empathetic** -- repeatedly acknowledges the stress and isolation of running a struggling pub
- **Practical** -- every piece of advice includes specific next steps, not just theory
- **Experience-backed** -- references to The Anchor feel genuine, not performative

### Voice Inconsistencies

| Issue | Location | Detail |
|-------|----------|--------|
| US spelling | Homepage line 95 | "modernizes" should be "modernises" (UK English) |
| Overly corporate tone | Some service page headings | "Transformational Marketing", "Simplified Technology Tools", "Positive Disruption, Safe Delivery" -- these feel agency-speak, not pub-landlord language |
| Inconsistent first/third person | Various | Homepage uses third person ("We tested everything at The Anchor"), blog posts use first person ("When I took over..."), About page mixes both |
| "Hospitality partners" language | Site-wide | Used extensively as a generic term, but feels corporate. Peter's target audience thinks of themselves as "landlords", "licensees", "publicans" -- not "hospitality partners" |

**Recommendation:** The "hospitality partners" rebrand is understandable for broadening the business beyond pubs, but it creates a mismatch with the blog content (which is explicitly pub-focused). Consider using "hospitality partners" in service/about pages and "landlords" / "licensees" in blog content and landing pages.

---

## 6. E-E-A-T Assessment

### Experience: STRONG
Peter demonstrably runs a pub. The Anchor is real, verifiable, named. The content includes specific operational details (stone-baked pizzas, WhatsApp quiz groups, specific supplier names like Brakes and Bidfood) that could only come from someone doing the work.

### Expertise: STRONG
The blog content demonstrates deep knowledge of pub operations: menu engineering, GP calculation, event formats, licensing compliance, staff management. The toolkit format posts (quiz-night-101, karaoke-night-101) are particularly strong.

### Authoritativeness: MODERATE
- BII feature is a genuine authority signal (mentioned consistently)
- No visible backlinks from authoritative third-party sources yet
- No author page at `/about/peter-pitcher` (author bio exists in schema but not as a standalone page)
- No external case studies or testimonials from clients beyond The Anchor

### Trustworthiness: FAIR-TO-GOOD
- Transparent pricing (GBP 75/hour plus VAT mentioned everywhere)
- No misleading guarantees
- HOWEVER: The self-review in schema is a trust risk (see CRITICAL-3)
- HOWEVER: The food GP explicit percentages contradict the claims audit direction (see CRITICAL-2)
- No visible privacy policy or terms of service linked (not checked exhaustively)

**Recommendation:** Create a dedicated author page for Peter Pitcher at `/about/peter-pitcher` to strengthen E-E-A-T. Add the BII magazine link as an external authority reference. Seek and publish testimonials from actual consulting clients (Orange Jelly's first external client was September 2025, so there should be feedback available by now).

---

## 7. LocalSEO Metadata Inconsistency in Blog Posts

### MEDIUM-1: Mismatched Local SEO Targets

Multiple blog posts have `localSEO` metadata pointing to regions outside Orange Jelly's service area:

| Post | localSEO.targetLocation | Issue |
|------|------------------------|-------|
| `menu-engineering-lift-average-spend` | Cambridgeshire | OJ operates in South East England |
| `staff-motivation-hacks-no-pay-rise` | East Midlands | OJ operates in South East England |
| `turnaround-playbook-independent-bars` | North West England | OJ operates in South East England |

The primary audience is South East England per the strategy document. These scattered local targets dilute geographic relevance signals.

**Recommendation:** Either standardise all localSEO to Surrey/South East, or if geographic expansion is intentional, create a deliberate regional content strategy.

---

## 8. Dead Code and Technical Debt

### MEDIUM-2: Hidden Sections in Quiet Midweek Solutions

`src/app/quiet-midweek-solutions/page.tsx` has two large sections wrapped in `{false && (...)}` (lines 177-224 and 227-280). These include "The Midweek Momentum System" and a transformation timeline. This is dead code that should either be properly removed or enabled.

### MEDIUM-3: Commented-Out Success Metrics in Pub Rescue

`src/app/pub-rescue/page.tsx` (lines 344-376) has a large commented-out section for success metrics with a note "successMetrics not defined." This creates visual inconsistency with other pages that do show metrics.

### MEDIUM-4: Hidden FAQ Section in Quiet Midweek Solutions

The FAQ section in `quiet-midweek-solutions/page.tsx` (line 421) is also wrapped in `{false && ...}` but the `FAQSchema` component at line 530 still renders the structured data. This means Google sees FAQ schema but users cannot see the FAQ content on the page -- a potential structured data violation.

---

## 9. Content Quality Standards Recommendations

### For Immediate Action (This Week)

1. **Resolve quiz metric inconsistency** -- pick one number, apply everywhere (CRITICAL-1)
2. **Remove explicit food GP percentages** from live pages per claims audit (CRITICAL-2)
3. **Remove self-review schema** from Results page (CRITICAL-3)
4. **Fix "bought" to "took on"** in why-is-my-pub-empty blog post (HIGH-2)
5. **Fix hidden FAQ schema mismatch** in quiet-midweek-solutions (MEDIUM-4)

### For Next Sprint

6. **Consolidate or differentiate** the three struggling-pub landing pages (HIGH-6)
7. **Update 2024 references** in blog posts to be evergreen (HIGH-1)
8. **Fix US spelling** "modernizes" to "modernises" on homepage (LOW)
9. **Remove or enable** dead code sections in quiet-midweek-solutions (MEDIUM-2)
10. **Create author page** at `/about/peter-pitcher` for E-E-A-T (HIGH)

### For Content Calendar

11. **Designate hub posts** for each content cluster and build internal linking (HIGH-7)
12. **Seek and publish** real client testimonials (not self-authored)
13. **Standardise localSEO metadata** across all blog posts (MEDIUM-1)
14. **Standardise "GBP 4,000+ monthly"** label as cost savings not margin growth (HIGH-4)
15. **Review HowTo schema estimated cost** on empty-pub-solutions (HIGH-5)

### Content Quality Checklist (For All New Content)

- [ ] All metrics match CLAUDE.md approved numbers exactly
- [ ] No explicit food GP percentages (use relative improvement language)
- [ ] "Greene King tenant" never "partner"
- [ ] UK English spelling throughout
- [ ] Year references are evergreen or marked for annual update
- [ ] localSEO targets match OJ service area (unless deliberate expansion)
- [ ] First-person voice consistent with Peter's established tone
- [ ] No unverified specific financial claims (GBP amounts must be in approved list)
- [ ] Blog posts link back to relevant hub/pillar pages
- [ ] FAQ content visible on page if FAQ schema is present

---

## 10. Summary Metrics

| Category | Score | Notes |
|----------|-------|-------|
| Content Quality | 8/10 | Blog posts are genuinely excellent; some landing pages are thin |
| Factual Accuracy | 6/10 | Metric inconsistencies and claims audit violations lower this |
| Brand Voice | 8/10 | Strong and authentic; minor corporate-speak creep on service pages |
| E-E-A-T | 7/10 | Strong experience/expertise; authority needs external signals |
| Usefulness | 9/10 | A struggling licensee would find real, actionable help here |
| Trust Signals | 6/10 | Self-review schema, missing client testimonials, no author page |
| Technical Consistency | 5/10 | Dead code, hidden sections, schema mismatches |

**Overall Assessment:** The content is genuinely good and would help real pub licensees. The issues identified are mostly consistency and compliance problems rather than fundamental quality problems. Fixing the critical and high-priority items would significantly strengthen the site's credibility with both Google and human visitors.
