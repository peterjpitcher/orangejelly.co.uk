# Orange Jelly — SERP Snapshots (Phase 1)

**Date checked:** 2026-06-16 · **Search location:** national (UK), unless noted.
**Rule:** manual SERP review supports **intent and competitor analysis only**. No volume, difficulty, traffic or ranking position is reported from these checks. Existing-demand figures elsewhere come from GSC (Known). SERP-feature presence below is from manual review (Confidence Medium).

---

## Cluster 1 — "pub marketing agency" / "marketing for pubs" (COMMERCIAL — priority capture)
- **Representative query:** `pub marketing agency`, `marketing for pubs`
- **Dominant intent:** Commercial (hire help)
- **Top ranking page types:** agency service/landing pages (CJ Digital, Wired Media, Marketing For Pubs, We Are Brew), one listicle ("Top 10 pub marketing agencies" — getonbloc)
- **SERP features present:** sitelinks on brand agencies; some PAA; local pack only when a town modifier is added; AI Overview inconsistent on the pure commercial query
- **Competitor angles:** "full-service digital agency for pubs/hospitality", free audits, SEO+social+PPC bundles; generalist hospitality positioning
- **Content/format pattern:** service landing pages with case studies, service lists, contact CTAs
- **Gaps in top results:** no "real working publican who does it for you" angle; no transparent fixed-package pricing; no single-venue measured proof; agency-sceptic audience underserved
- **Can OJ compete:** **Yes, on positioning** — GSC shows OJ already at pos ~18–22 for these (Known); the win is anti-agency service pages that earn the click, not new ranking
- **Confidence:** Medium

## Cluster 2 — "pub event ideas" / "event ideas for pubs" (INFORMATIONAL → bridge — priority)
- **Representative query:** `pub event ideas`, `event ideas for pubs`
- **Dominant intent:** Informational (with commercial undertone — operators planning)
- **Top ranking page types:** brewery hub (Greene King valueforvenues), trade media (Morning Advertiser), supplier blogs (Mitchell & Cooper), DIY-tool listicles (smartpubtools), **and orangejelly.co.uk** (how-to-run-successful-pub-events appears)
- **SERP features present:** People Also Ask; AI Overview likely on "ideas" framing; image pack on some variants
- **Competitor angles:** "12/15/20 creative event ideas", footfall-stat hooks (e.g. CAMRA quiz-attendance stat), 2026-dated freshness
- **Content/format pattern:** numbered idea lists, 1,500–3,000 words, dated, with quick takeaways
- **Gaps:** generic idea lists without implementation systems or real outcomes; no operator-proof; little done-for-you path
- **Can OJ compete:** **Yes — already ranks** (summer-pub-event-ideas 7,572 impr/96c pos 15.1, Known). Win = lift to top-10 + add proof + bridge to events service
- **Confidence:** Medium

## Cluster 3 — "quiz night ideas" / "pub quiz rounds/themes" (INFORMATIONAL → bridge)
- **Representative query:** `quiz night ideas`, `pub quiz round ideas`
- **Dominant intent:** Informational
- **Top ranking page types:** quiz-specialist sites (Quiz On Demand, AhaSlides, Cheeky Trivia, Top Trivia Questions), Wikipedia, **orangejelly.co.uk** (quiz-night-ideas / quiz-night-101)
- **SERP features present:** PAA, AI Overview common on "ideas/rounds", featured snippet on definitional queries ("what is a pub quiz")
- **Competitor angles:** ready-made rounds, downloadable questions, theme lists
- **Content/format pattern:** list-heavy, examples-led; quiz vendors push their product
- **Gaps:** few connect "run a great quiz" to "fill the pub midweek / grow revenue"; little operator-commercial framing
- **Can OJ compete:** **Yes — already ranks** (quiz-night-ideas 4,348 impr/76c pos 11.8, Known). Strong AI-citation candidate via concise answer blocks
- **Confidence:** Medium

## Cluster 4 — "pub food / menu ideas" / "profitable menu items" (INFORMATIONAL → bridge)
- **Representative query:** `pub menu ideas`, `profitable menu items`, `most profitable bar food`
- **Dominant intent:** Informational (margin/revenue-minded operators)
- **Top ranking page types:** hospitality blogs, supplier content, recipe/operator hubs, **orangejelly.co.uk** (profitable-pub-food-menu-ideas, its best-positioned big page at pos 7.4)
- **SERP features present:** PAA; AI Overview on "profitable/most profitable" framing; image pack
- **Competitor angles:** menu engineering, GP/margin tips, trend lists
- **Content/format pattern:** how-to + lists; margin-led angles win
- **Gaps:** few combine menu design with real revenue outcomes from a venue
- **Can OJ compete:** **Yes — strongest existing position** (4,479 impr/67c pos 7.4, Known). Near top-10; small push + proof + bridge
- **Confidence:** Medium

## Cluster 5 — "social media for pubs" / "social media marketing for pubs" (INFORMATIONAL → COMMERCIAL bridge)
- **Representative query:** `social media for pubs`, `social media marketing for pubs`
- **Dominant intent:** Mixed — informational ("how to") shading into commercial ("services/agency for")
- **Top ranking page types:** brewery hub (Greene King), agency pages (getonbloc, CJ Digital), tool blogs (Ripples, AppInstitute, 24social), **orangejelly.co.uk** (social-media-strategy-for-pubs)
- **SERP features present:** PAA; AI Overview on "how to" variants; the commercial "...marketing for pubs" variant pulls in agency results
- **Competitor angles:** platform-by-platform tips, content-calendar advice; agencies pivot to "we'll run it for you"
- **Content/format pattern:** comprehensive how-to guides; agencies layer a service CTA
- **Gaps:** the how-to guides rarely offer a credible done-for-you path; agency pages lack operator proof
- **Can OJ compete:** **Yes** — this is the clearest **info→commercial bridge** on the site: OJ ranks for the guide (3,836 impr/37c pos 12.6, Known) AND shows for `instagram/facebook/paid social ... services for pubs` (Known). Connect guide → C2 service pages
- **Confidence:** Medium

```json
{ "findings": [
  { "finding": "Commercial-intent queries earn near-zero clicks despite 2,908 impressions over 12 months (the central lead-gen problem)", "evidence": "search-queries.csv intent-classified: 57 commercial queries = 2,908 impr / 2 clicks; e.g. 'pub marketing agency' 304 impr pos 19.6 0c, 'instagram services for pubs' 256 impr pos 7.0 0c, 'paid social for pubs' 207 impr pos 11.2 0c", "source": "GSC 12-month Queries export", "dataStatus": "Known", "severity": "Critical", "confidence": "High", "impactArea": "conversion", "owner": "Content", "effort": "Large", "dependencies": "Copywriting, CLAIMS.md", "fixType": "Template/system fix", "recommendedAction": "Build/strengthen a /services hub + intent-matched service pages (agency/social/content/paid social/turnaround) that directly answer these shown queries, with anti-agency positioning, fixed packages and CLAIMS-backed proof", "validationStep": "GSC: commercial-cluster CTR and clicks-to-service-pages rise; GA4 enquiry events fire", "riskRollback": "Content-only change; revert page copy if needed" },
  { "finding": "Site ranks for questions, not buyers: 458 informational clicks vs 44 commercial-page clicks over 12 months", "evidence": "GSC Pages categorised: info-guide 458c/39,216i across 97 pages; commercial 44c/3,228i; homepage 24c", "source": "GSC 12-month Pages export", "dataStatus": "Known", "severity": "High", "confidence": "High", "impactArea": "conversion", "owner": "Content", "effort": "Medium", "dependencies": "UX, dev, CLAIMS.md", "fixType": "Template/system fix", "recommendedAction": "Add a contextual peer-to-peer guide→service bridge block to the guide template, intent-matched to the relevant service page", "validationStep": "GA4 path from guides to /services and enquiry events; GSC clicks to service pages", "riskRollback": "Template change; revertible" },
  { "finding": "No GA4 / enquiry conversion tracking — the lead-gen goal is unmeasurable", "evidence": "data-access.md: GA4 landing pages MISSING (not supplied); no session/conversion baseline", "source": "data-access.md / workspace inventory", "dataStatus": "Known", "severity": "High", "confidence": "High", "impactArea": "conversion", "owner": "Analytics", "effort": "Medium", "dependencies": "GA4 access, dev", "fixType": "Analytics/governance fix", "recommendedAction": "Stand up GA4 + form/CTA conversion events; import GSC; define enquiry funnel and baseline before measuring downstream work", "validationStep": "GA4 DebugView shows enquiry/CTA events firing; baseline recorded", "riskRollback": "Additive tracking only; no live-content risk" },
  { "finding": "Commercial and brand-new pages sit in GSC 'not indexed' buckets", "evidence": "Coverage drilldown Table.csv: /services, /compete-with-pub-chains, /capabilities not indexed; new seasonal guides (autumn-pub-event-ideas, cask-ale-week-pub-guide, pop-up-events-for-pubs, national-drinks-days-pub-guide) last-crawled 1970-01-01 (never fetched)", "source": "GSC Coverage drilldown 2026-06-16", "dataStatus": "Known", "severity": "High", "confidence": "High", "impactArea": "crawl/indexing", "owner": "Technical", "effort": "Medium", "dependencies": "Dev; route any live change via Risk Register", "fixType": "Template/system fix", "recommendedAction": "Diagnose why commercial pages are not indexed; internal-link + sitemap the never-crawled seasonal guides so Google fetches them", "validationStep": "GSC URL Inspection: pages move to Indexed; impressions appear", "riskRollback": "No live indexation change in Phase 1; changes gated by Risk Register" },
  { "finding": "GSC indexation buckets polluted by cross-subdomain and protocol/host duplicate URLs", "evidence": "Coverage drilldown: cheersai.orangejelly.co.uk/*, management.orangejelly.co.uk/events/*, auth/login, plus http:// and non-www variants in not-indexed buckets", "source": "GSC Coverage drilldown 2026-06-16", "dataStatus": "Known", "severity": "Medium", "confidence": "High", "impactArea": "crawl/indexing", "owner": "Technical", "effort": "Medium", "dependencies": "Dev; Risk Register", "fixType": "Template/system fix", "recommendedAction": "Confirm GSC property scope; these URLs belong to separate apps/subdomains, not the marketing site — verify canonical/redirect of host/protocol duplicates to https://www", "validationStep": "Re-run Coverage; noise buckets shrink, leaving genuine site URLs", "riskRollback": "Diagnostic in Phase 1; live edits via Risk Register" },
  { "finding": "Greene King's valueforvenues.co.uk competes across all four core informational clusters OJ depends on", "evidence": "Manual SERP review 2026-06-16: valueforvenues ranks for social-media-for-pubs, pub event ideas, and footfall queries", "source": "Web search (June 2026)", "dataStatus": "Known", "severity": "Medium", "confidence": "Medium", "impactArea": "SEO", "owner": "Content", "effort": "Medium", "dependencies": "Content; CLAIMS.md (Greene King = Tenant framing)", "fixType": "Content process fix", "recommendedAction": "Defend the four clusters with real-publican voice, dated first-hand outcomes (approved CLAIMS) and quotable answer blocks the brewery hub cannot match", "validationStep": "Maintain/improve GSC position on cluster pages; AI/snippet presence", "riskRollback": "Content-only" },
  { "finding": "Strong position-improvement upside: high-impression guides stuck at pos 11–16", "evidence": "GSC Pages: summer-pub-event-ideas 7,572i pos 15.1; content-marketing-ideas-pubs 2,158i pos 15.6; pub-refurbishment-on-budget 1,792i pos 14.7; social-media-strategy-for-pubs 3,836i pos 12.6", "source": "GSC 12-month Pages export", "dataStatus": "Known", "severity": "Medium", "confidence": "High", "impactArea": "SEO", "owner": "Content", "effort": "Medium", "dependencies": "Content", "fixType": "One-off page fix", "recommendedAction": "Refresh/expand + add answer blocks to lift these into the top-10 click range; bridge social page to services", "validationStep": "GSC: position improves toward top-10 and clicks rise", "riskRollback": "Content-only" },
  { "finding": "Quiz/events/food/social clusters are the realistic AI-citation opportunities; commercial cluster is not", "evidence": "Manual SERP review: PAA/AI Overview present on informational 'ideas/how-to' queries; schema.json shows FAQPage x41 + Speakable + BlogPosting x217 already in place", "source": "Web search + crawl schema.json", "dataStatus": "inferred", "severity": "Low", "confidence": "Low", "impactArea": "AI visibility", "owner": "Content", "effort": "Medium", "dependencies": "Content, schema", "fixType": "Content process fix", "recommendedAction": "Maintain concise quotable answer blocks + named-author expertise signals on C4–C7 leaders; ensure schema matches visible content; do not chase AI citation on the commercial cluster", "validationStep": "Directional only until AI-referral data exists; monitor AI Overview/snippet presence", "riskRollback": "Content-only" }
] }
```
