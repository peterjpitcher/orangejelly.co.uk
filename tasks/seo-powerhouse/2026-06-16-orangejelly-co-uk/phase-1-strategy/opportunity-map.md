# Orange Jelly — Sitewide Opportunity Map (Phase 1)

**Date:** 2026-06-16 · Prioritised by commercial value (enquiries), not traffic.
**Sources:** GSC 12-mo Pages/Queries/Coverage (Known); crawl evidence (Known); manual SERP review (intent only). New-term volumes = "validate via keyword-plan / GKP". GA4 = **unavailable**.

---

## A. The info→commercial conversion path (highest commercial value)

The single biggest commercial lever is **not new traffic** — it is converting the licensees who already arrive on guides into enquiries. The site has ~458 informational clicks/12 mo and 44 commercial-page clicks/12 mo; the bridge between them barely exists.

| Finding | Evidence | Data status | Severity | Confidence | Impact area | Owner | Effort | Fix type | Recommended action |
|---|---|---|---|---|---|---|---|---|---|
| Top guides carry the site but don't route to services | GSC Pages: summer-events 96c, quiz 76c, food 67c, social 37c — all informational; commercial pages 44c total | Known | High | High | conversion | Content/UX | Medium | Template/system fix | Add a contextual, peer-to-peer "want this done for you?" bridge block to the guide template, intent-matched to the relevant service page |
| No enquiry tracking exists | GA4 not supplied (data-access.md) | Known | High | High | conversion | Analytics | Medium | Analytics/governance fix | Stand up GA4 + form/CTA conversion events before measuring any bridge |

## B. Commercial-capture plays (high value — demand already shown to OJ)

Google shows OJ for paid-help queries at pos 6–20 but the pages earn ~0 clicks. Strengthening them captures demand that already exists.

| Finding | Evidence (GSC 12-mo, Known) | Severity | Confidence | Impact area | Owner | Effort | Fix type | Recommended action |
|---|---|---|---|---|---|---|---|---|
| Commercial cluster: 2,908 impr, 2 clicks | 57 intent-classified queries; e.g. `pub marketing agency` 304 impr pos 19.6 (0c) | High | High | SEO/conversion | Content | Large | Template/system fix | Build/strengthen a `/services` hub + intent-matched service pages (C1–C3) that answer these queries directly |
| Named-channel service terms rank but don't convert | `instagram services for pubs` 256 impr pos 7.0 (0c); `facebook services for pubs` 123 impr pos 6.1 (0c); `content creation for pubs` 226 impr pos 14.8 (0c); `paid social for pubs` 207 impr pos 11.2 (0c) | High | High | SEO/conversion | Content | Medium | One-off page fix | Dedicated do-it-for-you channel pages with clear scope, packages-from pricing and a CLAIMS-backed proof block |
| Rescue/turnaround intent is strong | `fix my pub` 109 impr pos 5.7 (1c); `pub business recovery services stockport` 22 impr pos 7.9 (0c) | Medium | High | SEO/conversion | Content | Medium | One-off page fix | A focused "fix my pub / turnaround" service page tied to the 30-day action guarantee |

## C. Position-improvement plays (existing guides, pos 11–16 → top-10)

These already have impressions; small ranking gains unlock clicks at no acquisition cost.

| Page / query | Evidence (Known) | Severity | Confidence | Impact area | Owner | Effort | Fix type | Action |
|---|---|---|---|---|---|---|---|---|
| summer-pub-event-ideas | 7,572 impr, 96c, **pos 15.1** | High | High | SEO | Content | Medium | One-off page fix | Refresh/expand + answer blocks; biggest single impression pool on the site |
| content-marketing-ideas-pubs | 2,158 impr, 15c, pos 15.6 | Medium | High | SEO | Content | Medium | One-off page fix | Improve depth/intent match to lift to top-10 |
| pub-refurbishment-on-budget | 1,792 impr, 13c, pos 14.7 | Medium | High | SEO | Content | Small | One-off page fix | On-page optimisation |
| christmas-pub-promotion-ideas | 1,375 impr, 17c, pos 11.6 | Medium | High | SEO | Content | Small | One-off page fix | Seasonal refresh ahead of Q4 |
| social-media-strategy-for-pubs | 3,836 impr, 37c, pos 12.6 | Medium | High | SEO/conversion | Content | Medium | One-off page fix | Lift position **and** bridge to C2 services |
| `event ideas for pubs` (query) | 956 impr, **0c**, pos 16.8 | Medium | High | SEO | Content | Medium | One-off page fix | Map to best event guide; improve to top-10 to start earning clicks |

## D. Indexation cleanup (removes growth drag — route via Risk Register)

The "not indexed" buckets mix **noise to exclude** with **pages that must index**. The fix differs by type. **No live indexation change in Phase 1.**

| Finding | Evidence (GSC Coverage drilldown, Known) | Severity | Confidence | Impact area | Owner | Effort | Fix type | Action |
|---|---|---|---|---|---|---|---|---|
| Commercial pages not indexed | `/services`, `/compete-with-pub-chains`, `/capabilities` in not-indexed buckets | High | High | crawl/indexing | Technical | Medium | Template/system fix | Diagnose & fix so commercial pages index (lead blocker) |
| New seasonal guides never crawled | `autumn-pub-event-ideas`, `cask-ale-week-pub-guide`, `pop-up-events-for-pubs`, `national-drinks-days-pub-guide` crawled `1970-01-01` | High | High | crawl/indexing | Technical | Small | Template/system fix | Internal-link + sitemap so Google fetches them |
| Cross-subdomain URLs polluting property | `cheersai.orangejelly.co.uk/*`, `management.orangejelly.co.uk/events/*`, `auth/login` in not-indexed | Medium | High | crawl/indexing | Technical | Medium | Template/system fix | Confirm property scope; these belong to other apps, not the marketing site |
| Protocol/host duplicates | `http://`, `http://www`, non-www variants in not-indexed | Medium | High | crawl/indexing | Technical | Small | Template/system fix | Verify canonical/redirect to https://www (via Risk Register) |
| 10 noindex / 7 redirect / 6×404 / 6 robots-blocked / 2 dup-no-canonical | Coverage critical issues | Medium | High | crawl/indexing | Technical | Medium | Template/system fix | Audit each list; fix 404s/redirects; confirm intentional noindex |

## E. Structural & rich-result opportunities

| Finding | Evidence | Data status | Severity | Confidence | Impact area | Owner | Effort | Fix type | Action |
|---|---|---|---|---|---|---|---|---|---|
| Internal linking is guide-heavy, service-light | crawl internal-links.csv; guide→service bridges largely absent | Known | High | Medium | SEO/conversion | Technical/Content | Medium | Template/system fix | Add intent-matched guide→service links sitewide |
| Schema foundation is strong; leverage it | schema.json: ProfessionalService×52, FAQPage×41, BlogPosting×217, BreadcrumbList×141, LocalBusiness, Service, Offer present | Known | Low | High | AI visibility/SEO | Technical | Small | Template/system fix | Ensure Service/Offer schema on service pages matches visible CLAIMS; keep FAQPage on guides for PAA/AI |
| 29 pages with multiple H1s | audit-summary "Multiple H1s: 29" | Known | Low | High | SEO | Technical | Medium | Template/system fix | Normalise to one H1 per page in the template |
| 3 oversized images (>200KB) | audit-summary | Known | Low | High | UX/SEO | Technical | Small | One-off page fix | Compress; mobile ranks/converts best so mobile weight matters |

## F. AI answer-engine visibility (distinct dimension; confidence Low — no AI-referral data)

There is **no AI-referral data** in the workspace, so all AI impact is Low confidence and directional. Assess by citation-readiness:

- **Best AI-citation candidates:** C5 quiz nights, C4 pub event ideas, C6 food/menu, C7 social media for pubs. These are FAQ-style, OJ already ranks, the existing FAQPage/Speakable schema and `quickAnswer` frontmatter pattern produce quotable blocks, and the real-publican author gives an expertise signal. Manual SERP review shows AI Overviews / People-Also-Ask appearing on these informational queries — concise, dated, source-worthy answer blocks are the way in.
- **Weaker candidates (not worth chasing yet):** the commercial agency cluster (C1–C3). AI engines rarely cite a vendor as the neutral answer to "pub marketing agency"; effort there is better spent on the service-page conversion job, not AI citation.
- **Action:** add/maintain concise quotable answer blocks + author/expertise signals on cluster leaders (C4–C7); ensure schema matches visible content. Treat AI citation as a by-product of the content-quality work, measured only directionally until referral data exists.

## Prioritised summary

1. **Analytics first** (B/A prerequisite) — without enquiry tracking nothing commercial is provable.
2. **Convert (A) + capture (B)** — the bridge plus the commercial pages are the lead-gen core.
3. **Index (D)** — unblock commercial + new pages (Risk Register).
4. **Improve (C)** — top-10 the high-impression guides.
5. **Structure & AI (E/F)** — internal links, schema-content match, answer blocks; AI as by-product.
