# Live Verification Notes — 2026-07-07 (manual HTTP checks, redirect:manual)

These checks correct/clarify crawler output. The crawler follows redirects, so redirected URLs appear in `url-inventory.csv`/`page-metadata.csv` with their TARGET page's status/canonical/schema — read drift entries for those URLs with that in mind.

| URL | Live behaviour | Interpretation |
|---|---|---|
| /licensees-guide/cash-flow-crisis-breaking-cycle | **308 → /fix-my-pub** | June ticket (410→301) IS live (Next.js emits 308; permanence equivalent to 301). The drift-report "canonical-changed/schema-added" rows for this URL are crawler-follow artefacts, NOT regressions. |
| /services | **308 → /ways-to-work** | Legacy hub redirect live. Internal links still pointing at /services (see broken-internal-links.csv, redirect_chain_len=1) should be repointed — June ticket SEO-007 partially outstanding. |
| /services/instagram-services-for-pubs | **200**, canonical → homepage, 153 words | ODDITY: a live, thin service page that ranks (GSC 12-mo: "instagram services for pubs" pos 7.0, 256 impressions, 0% CTR) but declares itself a duplicate of the homepage. Its sibling under /services is otherwise redirected. High-value fix candidate. |
| /licensees-guide/pub-wages-labour-costs-uk | **404** | Hard 404, internally linked (see broken-internal-links.csv), also in GSC Coverage "Not found (404)". Fix: restore, redirect, or remove links. |
| /summer | **307 → /licensees-guide/summer-pub-marketing?utm_source=bii…** | QR campaign redirect; temporary (307) is acceptable for a campaign alias. Not in sitemap concern only. |
| /licensees-guide/premium-pub-positioning | 200, bridge CTA present, exactly 1 H1, no x-robots | June fixes SEO-004 (dual H1) and SEO-005 (guide→service bridge) verified live. |

Deployment status: production reflects main @ 6116fe19 (all June merged fixes observed live).
