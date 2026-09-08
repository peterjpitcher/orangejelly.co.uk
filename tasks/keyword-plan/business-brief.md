# Business brief, Orange Jelly

Written at programme set-up, 8 September 2026, from the repository's own sources of truth.
Peter owns this file. Anything marked **[confirm]** is inference from the code and the prior
audits, not something Peter has stated to this programme, and it drives `business_value` in
`clusters.csv`, so it changes the running order of the plan.

## The situation this programme starts in

The site was rebuilt and repositioned on 31 August 2026 and rewritten again on 2 September.
`/licensees-guide` became `/guides` on the same day. That single rename sits under roughly 900
of the site's 978 annual clicks, so nearly all of the organic traffic the company has changed
address eight days before this programme began.

The consequence for measurement is unavoidable and worth stating plainly: every window this
programme can pull today describes the site as it was **before** the rebuild. The rebuild is not
yet measurable. It becomes measurable in the review run of late October 2026, once the new
structure has a full window behind it.

## Outcome wanted

Enquiries, through the contact and project-enquiry forms. Not traffic, not impressions, and not
rankings except where a ranking is the constraint on an enquiry.

Measurement is possible for the first time this programme. GA4 events were connected on
5 September 2026 (`src/lib/tracking.ts`): `enquiry_started`, `contact_submit`,
`scorecard_started`, `scorecard_completed`, `scorecard_to_enquiry`, `guide_cta_click` and
`article_to_problem`. Until 5 September there was no enquiry event at all, which is why no
cluster in this programme carries conversion evidence yet. The first run that can attribute an
enquiry to a cluster is the one after a full window of that data exists.

## Priority services, in order **[confirm]**

Inferred from the site's own navigation and the 31 August repositioning:

1. Websites and connected systems, including bespoke applications.
2. Booking systems.
3. AI-supported workflows where they add value.
4. Fractional marketing leadership.
5. Hospitality and pub marketing, on the sector pages where it remains accurate.

The tension this programme has to hold: the business now sells items 1 to 3, and the organic
footprint is almost entirely item 5 plus a large library of pub operations guides. The guides
earn the traffic; the solutions pages earn the money. Question 2 in the run reply asks how Peter
wants that weighted, because it decides whether the plan spends its effort defending the guide
library or building a footprint for the new positioning.

## Capacity constraints **[confirm]**

Delivery is Peter's own time, published at £62.50 plus VAT an hour. There are no packages and no
fixed-price products. That caps how many enquiries are useful and argues for fewer, better
qualified enquiries rather than volume. It also caps content production: a plan that proposes
more pages than one person can write is not a plan.

## Geography

The United Kingdom, matching the reporting country. No local lens, no Google Business Profile.
The business address is at The Anchor in Stanwell Moor but the business does not sell to a
catchment, so local terms are out of scope.

## Conversion evidence

GA4 key events, live from 5 September 2026, as listed above. Nothing before that date. No call
tracking. No CRM figures in this repository.

## Seasonal calendar **[confirm]**

- Quarterly Greene King pub toolkit content, with a Christmas toolkit cycle running to end of
  August each year.
- The pub trade's own peaks drive the guide library: Christmas, Easter, summer, the major sporting
  calendar and the national drinks days the promotional-calendar guide covers.
- No closures apply; this is not a venue.

## Business-value rubric

Applied to `business_value` in `clusters.csv`:

- **5** Core service with capacity and margin, aligned to the enquiry outcome.
- **4** Core service.
- **3** Secondary service, or content that demonstrably feeds a core service.
- **2** Supporting content that holds the library together.
- **1** Peripheral, kept because it exists rather than because it earns.

Intent alignment with the enquiry outcome is part of this rubric, not a separate weight. A guide
that ranks well and converts nobody scores lower than a service page that ranks badly and would.
