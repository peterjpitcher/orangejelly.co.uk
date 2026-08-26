# orangejelly.co.uk: search performance, 12 months to 26 August 2026

Source: `data/gsc-orangejelly-2026-08-26/`, Google Search Console, web search, last 12 months.

This is the export that was blocking the URL plan. It is now unblocked, and the answer is not what
anyone assumed.

---

## The headline

| Measure | orangejelly.co.uk | the-anchor.pub |
|---|---|---|
| Clicks, 12 months | **969** | 14,643 |
| Impressions | **69,698** | 587,178 |
| Average position, mobile | 9.1 | 10.2 |
| Average position, desktop | 13.5 | 18.6 |

**The pub gets fifteen times the search traffic of the agency.** Orange Jelly earns roughly 81
clicks a month, under three a day.

That single fact should shape the whole plan. The thing we have been carefully protecting is small.

## Where the 969 clicks actually come from

| Group | Clicks | Share |
|---|---|---|
| `/licensees-guide/*` (the blog) | **900** | **92.9%** |
| Everything else combined | 69 | 7.1% |

Impressions are even more lopsided: the blog carries **98.3%**.

The blog being the engine was the assumption. It is now confirmed. What was not assumed is how
concentrated it is:

| | |
|---|---|
| 50% of blog clicks come from | **5 posts** |
| 80% come from | **14 posts** |
| 95% come from | **30 posts** |
| Ranking posts earning zero clicks | **62** |

Three posts alone (`summer-pub-event-ideas`, `quiz-night-ideas`,
`profitable-pub-food-menu-ideas`) account for 385 clicks, **39.7% of the entire website**.

## The finding that changes D1

Decision D1 keeps every existing URL live to protect search authority. Here is what the commercial
pages actually earn in a year:

| Page | Clicks | Impressions | Position |
|---|---|---|---|
| `/` | 28 | 1,113 | 14.2 |
| `/about` | 26 | 402 | 9.7 |
| `/contact` | 11 | 327 | 21.5 |
| `/pub-rescue` | 6 | 519 | 18.6 |
| `/services` | 2 | 1,199 | 24.1 |
| `/services/social-media-marketing-for-pubs` | 1 | 164 | 12.0 |
| `/pub-marketing-kent` | 1 | 65 | 14.5 |
| `/fix-my-pub` | 1 | 38 | 8.4 |
| `/ways-to-work` | 0 | 835 | 36.4 |
| `/results` | 0 | 160 | 5.8 |
| `/pub-marketing` | 0 | 83 | 18.8 |
| `/empty-pub-solutions` | 0 | 60 | 9.9 |
| `/quiet-midweek-solutions` | 0 | 69 | 11.1 |
| `/compete-with-pub-chains` | 0 | 1 | 12.0 |
| `/services/*` (four others) | 0 | 370 | varies |

**Every non-blog page on the site earns 78 clicks a year between them, and 65 of those go to the
homepage, about and contact.** The twelve pub landing pages and five service pages that D1 was
written to protect earn **eleven clicks a year in total**.

**Recommendation: refine D1, do not reverse it.** The instinct was right, the target was wrong.

- **Untouchable:** roughly 30 blog posts carrying 95% of blog clicks. Do not move, rename or merge
  these without a redirect and a good reason.
- **Free to restructure:** the pub landing pages, the service pages, `/ways-to-work`,
  `/capabilities`, `/compete-with-pub-chains`, `/quiet-midweek-solutions`, `/empty-pub-solutions`.
  There is no authority to lose. Consolidate them into the sector landing template as planned, and
  do it without anxiety.
- **Candidates for merging or retirement:** the 62 blog posts that rank but earn nothing. Each needs
  an individual look. Some will be seasonal, some genuinely thin.

## The real opportunity is rankings, not new pages

69,698 impressions produced 969 clicks. That is a **1.4% click-through rate** at an average position
between 9 and 13. The demand is already reaching the site. The rankings are not converting it.

| Page | Impressions | Clicks | Position |
|---|---|---|---|
| `summer-pub-event-ideas` | 10,355 | 159 | **16.8** |
| `quiz-night-ideas` | 6,438 | 122 | 12.1 |
| `social-media-strategy-for-pubs` | 4,489 | 43 | 12.6 |
| `content-marketing-ideas-pubs` | 3,130 | 18 | **15.4** |
| `national-drinks-days-pub-guide` | 2,269 | 7 | 9.0 |
| `pub-refurbishment-on-budget` | 1,970 | 14 | **15.6** |
| `summer-moments-simple-campaigns` | 1,818 | 33 | **17.3** |

`summer-pub-event-ideas` sits at position 16.8 on 10,355 impressions. Moving it into the top five
would multiply its clicks several times over, from one page, with no new content.

**There is more upside in fixing fourteen existing posts than in building eight new problem pages.**
Both should happen. The sequencing should reflect which one actually moves the number.

## Other observations

- **Nobody searches the brand.** Zero clicks for any "orange jelly" query in the top 1,000.
- **Only 81 of 969 clicks appear in the query export at all.** The other 92% come from queries too
  small for Search Console to name. That is an extremely long tail, and it means query-level
  optimisation has limited purchase. Page-level and topic-level work is what will move it.
- **`/about-demo` is live and indexed** (22 impressions). A leftover demo page that should not be
  public. Flagged for the spec.
- **Product subdomains appear in the property**: `cheersai.orangejelly.co.uk` (six URLs indexed),
  `mixerai.orangejelly.co.uk`, `management.orangejelly.co.uk`. They earn zero clicks but they are in
  the same Search Console property and need a decision about whether they belong there.
- **`/services` has 1,199 impressions at position 24.1 and earns 2 clicks.** It is being served for
  something at scale and failing to rank. Worth a look before it is deleted.

## What this does not answer

The `+828% search visibility` claim in `/CLAIMS.md` still cannot be verified from this. The export
covers 12 months with no baseline. Decision D2 remains outstanding and now blocks the Results page,
the About page and every case study.
