# Internal-Link Analysis — Issues

- Generated: 2026-07-07 06:14:35 UTC
- Source: `internal-links.csv` + `url-inventory.csv` (read-only analysis; nothing inferred beyond the counts below).
- Internal links analysed: 7859
- Pages in inventory: 153
- Orphaned pages (≤0 internal inbound link): 1 (0.7% of inventory)
- PageRank not computed — networkx raised ImportError: Error importing numpy: you should not try to import numpy from
        its source directory; please exit the numpy source tree, and relaunch
        your python interpreter from there..

## Orphaned pages

Pages present in the crawl/sitemap but with no internal inbound links. They rely on the sitemap alone for discovery and pass no internal link equity.

| URL | In sitemap | Template |
|---|---|---|
| https://www.orangejelly.co.uk/pub-rescue | yes | top-level:pub-rescue |

## High-impression, low-inbound pages ("money pages")

None found — pages with search impressions already carry at least the median number of internal inbound links.

## Boilerplate authority sinks

Pages linked from ≥80% of crawled pages (≥122 inbound) — usually navigation/footer targets. This is a structural observation: confirm these are intentional and not draining equity from money pages.

| URL | Inbound links |
|---|---|
| https://www.orangejelly.co.uk/capabilities | 1035 |
| https://www.orangejelly.co.uk/ | 602 |
| https://www.orangejelly.co.uk/ways-to-work | 449 |
| https://www.orangejelly.co.uk/about | 411 |
| https://www.orangejelly.co.uk/contact | 338 |
| https://www.orangejelly.co.uk/results | 312 |
| https://www.orangejelly.co.uk/ways-to-work/turnaround-intensive | 270 |
| https://www.orangejelly.co.uk/licensees-guide | 269 |
| https://www.orangejelly.co.uk/licensees-guide/autumn-pub-event-ideas | 223 |
| https://www.orangejelly.co.uk/ways-to-work/growth-fix | 177 |
| https://www.orangejelly.co.uk/pub-marketing | 168 |
| https://www.orangejelly.co.uk/ways-to-work/growth-partner | 165 |
| https://www.orangejelly.co.uk/licensees-guide/christmas-pub-event-ideas | 163 |
| https://www.orangejelly.co.uk/pub-marketing-berkshire | 162 |
| https://www.orangejelly.co.uk/pub-marketing-buckinghamshire | 162 |
| https://www.orangejelly.co.uk/pub-marketing-hampshire | 162 |
| https://www.orangejelly.co.uk/pub-marketing-hertfordshire | 162 |
| https://www.orangejelly.co.uk/pub-marketing-kent | 162 |
| https://www.orangejelly.co.uk/pub-marketing-london | 162 |
| https://www.orangejelly.co.uk/pub-marketing-oxfordshire | 162 |
| https://www.orangejelly.co.uk/pub-marketing-surrey | 162 |
| https://www.orangejelly.co.uk/ways-to-work/momentum-month | 160 |
| https://www.orangejelly.co.uk/services/social-media-marketing-for-pubs | 154 |
| https://www.orangejelly.co.uk/services/content-creation-for-pubs | 153 |
| https://www.orangejelly.co.uk/services/paid-social-for-pubs | 152 |

## Anchor-text concentration

Targets whose dominant anchor text accounts for ≥80% of their inbound links (≥3 inbound). Varied, descriptive anchors usually help relevance more than a single repeated phrase.

| URL | Dominant anchor | Share | Inbound links |
|---|---|---|---|
| https://www.orangejelly.co.uk/services/paid-social-for-pubs | Paid Social | 100% | 152 |
| https://www.orangejelly.co.uk/contact?package=growth-fix | Send an enquiry | 100% | 4 |
| https://www.orangejelly.co.uk/contact?package=turnaround-intensive | Send an enquiry | 100% | 4 |
| https://www.orangejelly.co.uk/licensees-guide/beat-chain-pubs | beating chain pubs | 100% | 3 |
| https://www.orangejelly.co.uk/pub-marketing-berkshire | Berkshire | 99% | 162 |
| https://www.orangejelly.co.uk/pub-marketing-buckinghamshire | Buckinghamshire | 99% | 162 |
| https://www.orangejelly.co.uk/pub-marketing-hampshire | Hampshire | 99% | 162 |
| https://www.orangejelly.co.uk/pub-marketing-hertfordshire | Hertfordshire | 99% | 162 |
| https://www.orangejelly.co.uk/pub-marketing-kent | Kent | 99% | 162 |
| https://www.orangejelly.co.uk/pub-marketing-london | London | 99% | 162 |
| https://www.orangejelly.co.uk/pub-marketing-oxfordshire | Oxfordshire | 99% | 162 |
| https://www.orangejelly.co.uk/pub-marketing-surrey | Surrey | 99% | 162 |
| https://www.orangejelly.co.uk/services/content-creation-for-pubs | Content Creation | 99% | 153 |
| https://www.orangejelly.co.uk/services/social-media-marketing-for-pubs | Social Media | 99% | 154 |
| https://www.orangejelly.co.uk/results | Results | 97% | 312 |
| https://www.orangejelly.co.uk/ways-to-work/turnaround-intensive | Turnaround Intensive | 96% | 270 |
| https://www.orangejelly.co.uk/licensees-guide/christmas-pub-event-ideas | Christmas Playbook | 96% | 163 |
| https://www.orangejelly.co.uk/ways-to-work/momentum-month | Momentum Month | 95% | 160 |
| https://www.orangejelly.co.uk/ways-to-work/growth-partner | Growth Partner | 93% | 165 |
| https://www.orangejelly.co.uk/pub-marketing | Pub Marketing | 90% | 168 |
| https://www.orangejelly.co.uk/contact | Contact | 90% | 338 |
| https://www.orangejelly.co.uk/licensees-guide/how-much-profit-does-a-pub-make | OperationsOperationsHow Much Profit Does a Pub Make? Realistic Numbers for 2026How Much Profit Does a Pub Make? Realistic Numbers for 2026 You have probably searched this question because you are either thinking about buying a pub and...8 December 2025·15 min read | 88% | 26 |
| https://www.orangejelly.co.uk/licensees-guide/wet-led-vs-food-led-pubs | OperationsOperationsWet-Led vs Food-Led Pubs: Understanding Your Revenue ModelWet-Led vs Food-Led Pubs: Understanding Your Revenue Model Every pub in the country falls somewhere on a spectrum. At one end you have the classic boozer —...22 December 2025·15 min read | 88% | 26 |
| https://www.orangejelly.co.uk/ways-to-work/growth-fix | Growth Fix | 88% | 177 |
| https://www.orangejelly.co.uk/licensees-guide/pub-marketing-plan-2026-monthly-guide | MarketingMarketingYour Pub Marketing Plan for 2026: Month-by-Month GuideYour Pub Marketing Plan for 2026: Month-by-Month Guide January is the worst month in the pub trade. You already know this. But what separates the pubs that...29 December 2025·18 min read | 87% | 23 |

## Output files

- `internal-link-summary.csv` — per-URL inbound/outbound/orphan/pagerank/impressions.
- `internal-link-issues.md` — this file.
- `backlog-seed-links.json` — backlog rows for `score-opportunities.py`.

_Read-only analysis of locally collected evidence. No metric here is invented; every figure traces to internal-links.csv, url-inventory.csv or search-queries.csv._
