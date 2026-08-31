# Sub-specifications: enquiry, scorecard, analytics and insights

**Version:** 1.0 draft for review
**Date:** 27 August 2026
**Parent:** `IMPLEMENTATION-SPEC.md` v1.1, section 10
**Status:** Draft. These four gate the work they govern.

Four documents in one, because they overlap: the enquiry form fires the analytics events, the
scorecard hands over to the enquiry form, and the insights collection is where the content that
feeds both lives.

Everything here is checked against the current code, not assumed. Where the code constrains the
design, that is stated.

---

# Part 1: Enquiry and lead data

Governs `/start-here`, `/contact`, and the lead write path. Blocks WS5.

## 1.1 The problem with what exists

| Current | Why it does not work |
|---|---|
| `contacts.pub_name text **NOT NULL**` | Hospitality-specific and mandatory. A professional services enquiry has no pub name. This alone breaks the new form. |
| `contacts.package_interest text` | Assumes packages with prices. D3 removed pricing. |
| `contacts.message text NOT NULL` | One free-text blob. The qualification answers have nowhere to go. |
| Form fields: name, email, phone, pubName, package, message | Six fields, two of them wrong for the new positioning. |
| No contact rate-limit bucket | `src/lib/rate-limit.ts` has nine buckets, all `poll_*`. A public server action that sends mail and writes personal data has none. |

## 1.2 The design tension, and how it resolves

D12 makes the first conversation free, which argues for low friction. Qualification argues for
detail. The blueprint lists twelve fields, which is a lot to face on first contact.

**Resolution: two steps, and the lead is written after step one.**

Step one captures enough to have a conversation. It writes the lead immediately. Step two enriches
it. If someone abandons at step two, Orange Jelly still has a real enquiry rather than nothing.

This also gives a natural idempotency key: step two is an update against the id returned by step one,
so a double submit cannot create two leads.

### Step 1: "Tell us what is happening" (4 fields)

| Field | Name | Type | Required | Rules |
|---|---|---|---|---|
| Your name | `name` | text | Yes | 2 to 80 chars, `autocomplete="name"` |
| Work email | `email` | email | Yes | Valid, 254 max, `autocomplete="email"`. Free providers accepted, see 1.6. |
| Company | `company` | text | Yes | 2 to 120 chars, `autocomplete="organization"` |
| What is happening in the business? | `situation` | textarea | Yes | 20 to 2000 chars. Placeholder shows a real example, not "type here". |

Submit writes the lead and moves to step two on the same page. **The success state is reached here**,
not after step two.

### Step 2: "This makes the first call useful" (6 fields, all optional)

Framed as optional and clearly worth doing. Never blocks the conversation.

| Field | Name | Type | Options or rules |
|---|---|---|---|
| Your role | `role` | select | Owner or founder, Managing director, Chief executive, Commercial director, Operations director, Marketing director, Other |
| Roughly how many people? | `size_band` | select | 1 to 9, 10 to 49, 50 to 249, 250 to 500, More than 500 |
| Website | `website` | url | Optional, normalise to include scheme |
| What do you think is blocking growth? | `blocker` | textarea | 2000 max |
| What would success look like? | `success` | textarea | 2000 max |
| Why now? | `why_now` | textarea | 1000 max |

**Deliberately not asked:** investment range (D3 removed pricing, so asking about budget before a
free conversation is incoherent), and phone (nothing in the new journey needs it before a
conversation is agreed).

**"Who is involved in the decision" and "preferred next step" are dropped from the form.** Both are
better asked by a human in the conversation D8 promises. Putting them on a form turns a discovery
conversation into a qualification gate, which is the opposite of the decision.

## 1.3 The qualification problem D3 created

Removing the price removed the filter. The form cannot replace it, and should not try. What does the
filtering:

1. **The fit section above the form** states plainly who this is not for. Specific, not hedged: not
   for businesses wanting someone to post three times a week, not for a pair of hands on a decided
   plan, not for anyone who cannot give access to the people and data.
2. **`situation` is required and has a 20-character floor.** Someone who will not describe their
   problem in a sentence is not the client.
3. **Step two completion is itself a signal.** Someone who answers all six is engaged. Track it.
4. **Peter qualifies in the conversation.** That is what D8 says the conversation is for.

Review the mix after 30 days against the enquiries actually received.

## 1.4 Database migration, additive only

Deployed and verified **before** any code that writes to it.

```sql
-- Additive. No column is dropped: historic pub leads must stay readable.
ALTER TABLE contacts ALTER COLUMN pub_name DROP NOT NULL;
ALTER TABLE contacts ALTER COLUMN message DROP NOT NULL;

ALTER TABLE contacts ADD COLUMN IF NOT EXISTS company text;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS website text;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS role text;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS size_band text;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS situation text;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS qualification jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS schema_version smallint NOT NULL DEFAULT 1;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS completed_step smallint NOT NULL DEFAULT 1;

CREATE INDEX IF NOT EXISTS contacts_completed_step_idx ON contacts (completed_step);
```

`blocker`, `success` and `why_now` live in `qualification` as jsonb with `schema_version` alongside,
so the shape can change without another migration. `role` and `size_band` are columns because they
are filtered on.

**`pub_name` and `package_interest` stay in the table, stop being written, and remain readable.**
Dropping them is a destructive migration and needs separate approval per the workspace rules.

**Function audit required before any later drop.** Search `information_schema.routines` and the
migrations directory for both column names first.

## 1.5 Server action contract

One Zod schema in `src/lib/schemas/enquiry.ts`, used by client validation, the server action and the
storage mapper. The current flow has separate weak client and server contracts, which is how they
drift.

```
submitEnquiryStep1(input) -> { success: true, leadId } | { error: string }
submitEnquiryStep2(leadId, input) -> { success: true } | { error: string }
```

**Order of operations in step 1**, which fixes the current partial-failure bug where a user sees an
error after the contact row already exists:

1. Rate limit check.
2. Validate.
3. Insert contact. **This is the authoritative success condition.**
4. Return success to the user.
5. Then, as retryable secondary work: lead source, conversion event, notification email.

A failure in step 5 must never show the user an error or invite a duplicate submission. It raises an
alert instead (WS0 monitoring).

## 1.6 Abuse prevention

Reuse the existing hashed infrastructure in `src/lib/rate-limit.ts`. Two new buckets:

| Bucket | Limit | Window |
|---|---|---|
| `enquiry_ip` | 5 | 3600s |
| `enquiry_email` | 3 | 86400s |

Keep the honeypot. Add a 16KB payload limit. **Fail closed** when the limiter is unavailable: a
public action that sends mail should not degrade to unlimited. Show the existing
`RATE_LIMIT_MESSAGE`.

No Turnstile unless observed abuse justifies it. It costs conversion on a low-volume, high-value
form.

**Free email providers are accepted.** Plenty of legitimate owner-operators use Gmail. Flag them for
Peter's attention rather than rejecting them.

## 1.7 Privacy and retention

The new fields are more commercially sensitive than a pub name: role, company size, what is broken,
what success looks like, urgency.

- **Purpose:** to have a useful first conversation. Nothing else. No marketing use without separate
  consent.
- **Retention:** 24 months from last contact, then delete. Confirmed as D25. Enquiries that become clients move to the
  client record and leave this table.
- **Access:** admin only. Existing auth.
- **Notification email carries step one only.** Name, company, email, situation, plus a link to the
  admin view. The qualification answers stay behind auth rather than sitting in an inbox.
- **Never sent to analytics.** Event properties carry booleans and enums, never free text. See
  Part 3.
- **`/privacy` must be updated before launch**, not after. It currently describes a pub contact form.

## 1.8 Accessibility and failure

- Native `<form>` with a real action so it degrades without JavaScript. Step two is skipped without
  JS and the lead is still captured.
- Labels on every field, never placeholder-only.
- Errors: inline plus an error summary at the top with links to fields, focus moved to the summary.
- `aria-describedby` for hints and errors, `aria-invalid` on failure.
- Success state receives focus and is announced.
- Tested at 320px and at 400% zoom.

## 1.9 What happens after submit

The parent spec ended at submission, which is where leads get lost.

| | |
|---|---|
| Owner | Peter. Single responder, single mailbox: `peter@orangejelly.co.uk`. |
| Acknowledgement | Immediate on-page confirmation: the enquiry has arrived and a person will read it and reply personally. No timescale is given (D23). |
| Response time | **No public commitment (D23).** Existing and new clients both need proper time, and a missed promise on first contact is worse than no promise. Tracked internally as a service level, never published. |
| Lead states | `new`, `contacted`, `qualified`, `conversation_booked`, `declined`, `client`. Extends the existing `status` column. |
| Calendar | Never shown automatically. D8 makes the conversation the first step, and a calendar link turns it into a booking. Peter sends one after replying. |
| Declined | A short honest reply. No silence. |
| Notification failure | Alerts, and the admin dashboard flags any lead not yet actioned so nothing goes quiet unnoticed. Internal only. |

---

# Part 2: AI readiness assessment

Governs `/tools/ai-readiness`. Targets `ai readiness assessment`, 500 tier, £8.56 to £33.61 top bid.

## 2.1 What it is and is not

It is a **pressure indicator**, not a score. The design system's `PressureMap` is explicit: no
totals, no marks out of 100. That discipline holds here.

It is also not an AI assessment in the technical sense. It assesses whether the **business** is in a
state where AI would help, which is the honest version and the one that matches "AI is part of the
toolkit, not the product".

**Result copy pattern, fixed:** "This is a signal, not a diagnosis."

## 2.2 Structure

Twelve statements, two per pressure area, four-point frequency scale: Never, Sometimes, Often,
Always.

Frequency rather than agreement, because "how often does this happen" is harder to answer
flatteringly than "do you agree".

## 2.3 Where a visitor meets this

Context for anyone reading the statements cold.

The assessment is a page at `/tools/ai-readiness`. Someone arrives from a search for "ai readiness
assessment", from an insight article, or from the growth-problems hub. They answer twelve statements,
one screen at a time, and get a picture of which parts of their business are under most pressure,
with an honest read on where AI would and would not help.

It is a **conversation starter, not a product**. It exists because the research found real search
demand for the term, and because someone who has just seen their own pressure map is far better
prepared for the free discovery conversation than someone arriving cold at a contact form.

Nobody is scored, nothing is stored unless they go on to enquire, and there is no number at the end.

## 2.4 The twelve statements, draft

Drafted from the pressure-point model and The Anchor experience. The wording is a judgement call and
is the part of this document most likely to change on review.

| # | Area | Statement |
|---|---|---|
| 1 | Demand | We can explain exactly where our best new customers come from. |
| 2 | Demand | When we need more enquiries, we know which lever to pull. |
| 3 | Conversion | We know how many enquiries turn into paying work, and why the rest do not. |
| 4 | Conversion | Someone follows up every enquiry within a day, without being chased. |
| 5 | Margin | We know which products, services or customers actually make us money. |
| 6 | Margin | We review pricing on a schedule rather than when something goes wrong. |
| 7 | Operations | The same information gets typed into more than one system. |
| 8 | Operations | Work stalls because it is waiting on one particular person. |
| 9 | Experience | We hear from customers about problems before they leave, not after. |
| 10 | Experience | A new team member could deliver our service to the same standard as our best person. |
| 11 | Scale | We could take on 50% more work without something breaking. |
| 12 | Scale | Our numbers are current enough to make a decision on this week. |

Statements 7 and 8 are deliberately reverse-scored: Always is the bad answer. This stops
straight-lining and it is where AI and automation usually earn their place.

## 2.5 Scoring and result

- Each statement scores 0 to 3. Reverse-scored items invert.
- Each area totals 0 to 6 from its two statements.
- **Pressure is the inverse of the score.** Low score, high pressure.
- Fill mapping, matching `PressureMap`: 0 to 1 ember, 2 to 3 orange, 4 to 5 peach, 6 paper.
- **No overall total is calculated, stored or shown.**

**Result page shows:** the `PressureMap` grid, the one or two areas under most pressure named in
plain words, two or three sentences per pressed area on what that usually means and where AI does
and does not help, and the handover.

**Where AI honestly does not help** must appear in the result for at least one area. A tool that
always concludes "you need AI" is a lead magnet pretending to be an assessment, and it would fail
the brand's own decision filter.

## 2.6 Handover

Result page ends with "Start the conversation" (D11), pre-filling the enquiry `situation` field with
the named pressure areas so the visitor does not retype. Editable.

## 2.7 Behaviour

- Answers held client-side during the assessment.
- **Not stored** unless the visitor submits an enquiry, in which case the pressure areas travel as
  structured data on the lead, not the raw answers.
- `onComplete` fires the analytics event with area bands only, never raw answers.
- Progress indicator, back navigation, restart.
- Deep link to the result is **not** supported. It is not a shareable score and pretending otherwise
  invites treating it as one.
- Without JavaScript: a static page explaining the twelve areas with a link to the enquiry form.
- Keyboard operable throughout, radio groups with proper fieldset and legend, one question group per
  focus stop.

---

# Part 3: Analytics event dictionary

Governs WS0 and WS8.

## 3.1 Rules

1. **No free text in any property, ever.** Booleans, enums, counts and durations only. The enquiry
   answers never reach GA4.
2. Every event has a de-duplication key.
3. Events split into **operational records** (first-party, written regardless of consent because
   they are records of a transaction the user initiated) and **analytics** (consent-gated).
4. `conversion_events.properties` is already `jsonb`, so first-party storage needs no migration.
5. `src/lib/tracking.ts` exposes `trackClientEvent`. Both the TypeScript union and the server
   allowlist need updating for each new event.

## 3.2 The dictionary

| Event | Trigger | Properties | Category | De-dup key |
|---|---|---|---|---|
| `enquiry_started` | First field of step 1 receives input | `source_page`, `entry_point` (nav, sticky, cta_band, next_step, scorecard) | Analytics | session + page |
| `enquiry_submitted` | Step 1 contact row written | `lead_id`, `source_page`, `entry_point` | **Operational** | `lead_id` |
| `enquiry_qualified` | Step 2 written | `lead_id`, `fields_completed` (0 to 6) | **Operational** | `lead_id` |
| `scorecard_started` | First answer given | `source_page` | Analytics | session |
| `scorecard_completed` | Twelfth answer given | `pressure_bands` (6 enums), `duration_seconds` | Analytics | session |
| `scorecard_to_enquiry` | Enquiry started from a result page | `pressure_bands` | Analytics | session |
| `pressure_check_used` | A symptom button on the hub changes the map | `symptom` (enum of 6), `interaction_index` | Analytics | session + symptom |
| `next_step_click` | `NextStep` link clicked | `from_stage` (article, problem, case), `to_stage`, `from_slug`, `to_slug` | Analytics | session + from + to |
| `bring_us_the_problem_click` | Any primary CTA | `surface` (header, sticky, cta_band, hero, footer), `page_template` | Analytics | session + surface + page |
| `search_performed` | Search returns | `result_count`, `had_results` | Analytics | session + query hash |
| `article_to_problem` | Navigation from `/licensees-guide/*` or `/insights/*` to `/growth-problems/*` | `from_slug`, `to_slug` | Analytics | session + pair |

`enquiry_submitted` fires **server-side after the row is written**, keyed on `lead_id`. That is why
it cannot double-count, which was a real risk in the earlier list.

## 3.3 Consent

**D24 splits this by whether the tool touches the device, not by whether the data is personal.**
PECR regulation 6 requires consent to store or access information on a device regardless of whether
it is personal data, so "there is no PII in it" does not exempt a tool that sets a cookie.

| Category | Behaviour without consent |
|---|---|
| **Vercel Analytics and Speed Insights** | **Load unconditionally.** Cookieless, nothing stored on the device, so the device-storage rule is not engaged. Covers traffic, referrers, page performance and journey shape. |
| Operational (`enquiry_submitted`, `enquiry_qualified`) | Written to the first-party store. Records of a transaction the user chose to start, not device storage. Not sent to GA4. |
| Google Tag Manager and GA4 | **Behind consent.** GTM sets `_ga`. Analytics is not strictly necessary to deliver the service, so it does not fall in the PECR exemption. |
| Analytics events (everything else in 3.2) | Routed to Vercel and the first-party store without consent where they carry no device identifier; sent to GA4 only with consent. |

This is a good-faith reading and not legal advice.

`CookieNotice` needs a permanent reopen control, a consent version, and an expiry. Withdrawal must
stop collection immediately.

## 3.4 The journey

Joined on an anonymous session id generated client-side, stored in `sessionStorage`, sent as a
property. It never persists across sessions and never joins to a person until an enquiry is
submitted, at which point `lead_id` takes over.

## 3.5 Verification

Every event needs a test asserting it fires once with the right properties. Release QA checks GA4
DebugView and the `conversion_events` table together: an event in one and not the other is a defect.

---

# Part 4: The insights content model

Governs `/insights`. Smaller, but it blocks WS5 order 11.

## 4.1 The constraint

The current loaders assume every Markdown file under `content/blog/` is a licensees' guide and
hard-code `/licensees-guide/<slug>`. Two collections need separating cleanly, or new articles leak
into the hospitality sitemap, feed and search index.

## 4.2 Structure

- `content/blog/` stays exactly as it is. 106 files, `/licensees-guide/*`. **Untouched.**
- `content/insights/` is new. `/insights/*`.
- A `collection` discriminant on the loader, not a path guess.
- **Slugs must be unique across both collections.** A build-time check fails on collision, because
  ambiguity here breaks canonicals and internal links.

## 4.3 Front matter

Shared fields with `content/blog/`: `title`, `slug`, `excerpt`, `publishedDate`, `status`, `author`,
`category`, `tags`, `quickAnswer`, `faqs`.

Added for insights:

| Field | Purpose |
|---|---|
| `collection: insights` | Required discriminant |
| `problemPage` | Slug of the `/growth-problems/*` page this links to. **Required.** Enforces the search strategy's chain. |
| `sector` | Optional. `professional-services`, `trades`, `hospitality`. Drives `CategoryTag`. |
| `targetTerm` | The keyword this exists for, from the fifteen. Required, and the build fails without it. |

`targetTerm` being mandatory is deliberate. The brand pack says no article exists only to attract
traffic, and the research closed with fifteen terms. If a new article does not map to one, it needs
a conscious decision rather than a habit.

## 4.4 Rules

- Drafts and future dates excluded from build, sitemap, feed and search.
- Both collections appear in search, filtered by `collection`.
- Separate RSS and JSON feeds per collection, plus a combined feed.
- Pagination on `/insights` at 12 per page, `hrefFor` real links, never a load-more button.
- The seven taxonomy hues are shared across both collections. Hospitality is always umber.

---

# Review status

Reviewed by Peter on 27 August 2026. Four points were settled and are now reflected above:

- **No response-time promise** (D23). Section 1.9 updated.
- **Cookieless analytics load before consent, GTM stays behind it** (D24). Section 3.3 rewritten with
  the reasoning.
- **24-month lead retention confirmed** (D25). Section 1.7.
- **Scorecard context added** (section 2.3), because the statements needed framing before they could
  be judged. The wording of the twelve statements themselves is still open.

Also now in force and affecting this document indirectly: D21 makes the site company-voiced rather
than founder-led, so all copy examples here use "we", and D22 removes expletives site-wide.
