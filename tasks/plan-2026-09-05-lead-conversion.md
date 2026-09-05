# Guide-to-enquiry conversion implementation specification

> **For agentic workers:** Use the implement-plan skill when implementation is authorised. Execute the work packages below in order and retain their acceptance evidence. Peter subsequently authorised implementation on 5 September 2026.

**Goal:** Turn more existing guide readers into relevant conversations and paid work by making the enquiry relevant, easy to start and measurable.

**Architecture:** Reuse the existing guide renderer, enquiry form, server action, lead records and tracking pipeline. Add a small, typed guide-conversion configuration and shared enquiry actions. Use existing public routes and existing database fields; no migration or new third-party integration is planned.

**Tech stack:** Next.js 14 App Router, React 18, strict TypeScript, Tailwind CSS 3.4, the existing `oj` components, Vitest 3 and existing browser audit tools.

**Spec:** This document is the controlling product and implementation specification. Paths below are relative to the repository root, `/Users/peterpitcher/Cursor/OJ-OrangeJelly.co.uk`.

**Status:** Implementation authorised by Peter on 5 September 2026. Implementation and local verification are recorded in `tasks/lead-conversion/verification.md`. Production message tests still require explicit authorisation. No migration has been drafted or applied.

## 1. Evidence and intended outcome

The supplied Search Console exports end on 2 September 2026. The latest seven days contain 82 Google clicks, of which 79 reached guides. Matching legacy and current guide paths gives 16 clicks for autumn pub event ideas, eight for Oktoberfest and six for profitable pub food menu ideas. These three guides account for 30 of 82 clicks. Mobile supplied 53 clicks.

The live review on 5 September followed the autumn guide's main enquiry link to `/start-here`. The guide contains a contextual text link to `/how-we-work`; its general enquiry invitation directs to `/start-here`. The destination includes process, benefits, requirements, fit criteria and pricing before the enquiry form. Its hero button can jump to the form. The form has four required fields. `/contact` presents the same form and an email alternative, without a visible WhatsApp option.

The interpretation is a hypothesis: readers seeking practical ideas may find a broad business diagnosis a larger commitment than they intended. No live funnel dataset, lead records or delivery receipts were inspected. The form was not submitted. This specification does not claim the form or notification delivery is broken, nor that any proposed change will produce a particular uplift.

Success means more genuine, relevant conversations and ultimately clients, not more button clicks. Search traffic and enquiry quality are guardrails. Historical page-level week-on-week gains and the existing enquiry conversion rate cannot be calculated from the supplied exports.

### Sources

- User-supplied files: `orangejelly.co.uk-Performance-on-Search-2026-09-05.zip` and `orangejelly.co.uk-Performance-on-Search-2026-09-05 (1).zip`, in the user's iCloud Downloads folder.
- Live pages: `https://www.orangejelly.co.uk/guides/autumn-pub-event-ideas`, `/guides/oktoberfest-pub-guide`, `/start-here`, `/contact`, `/how-we-work`.
- Current code: guide page, `EnquiryForm`, enquiry server actions, lead-source helper, tracking helper, event property dictionary, enquiry schema and case-study data.
- Commercial facts: `CLAIMS.md`, `src/lib/constants.ts`, `src/app/results/case-studies.ts`.

## 2. Constraints and decisions

- Orange Jelly remains a growth partner for small and mid-sized businesses. Hospitality-specific copy belongs on guides and their contextual enquiry variants, not a replacement for the main positioning.
- Retain the existing free first conversation of one hour. Sending an initial message must not feel like booking that hour or agreeing to paid work.
- Retain £62.50 plus VAT an hour, read from `PRICING.hourly.display`. No package, discounted rate, new delivery deadline or response-time promise.
- Retain the four existing required fields and their validation. Do not restore the removed qualification step or raise the situation minimum length.
- Retain all fit criteria and factual explanations. Reorder them rather than deleting them.
- Read workspace and project instructions, `CLAIMS.md`, voice documents, positioning overview and content-check scripts before implementation. Where historic comments conflict with current code and approved project rules, current rules govern.
- Preserve every guide slug, file, H1, SEO title, publication date, canonical, article body and existing internal link. Conversion additions sit outside the authored article body.
- No new public route, sitemap entry, route alias or change to redirects is needed. Contextual enquiry variants canonicalise to `/start-here`.
- Use only `oj` tokens and the existing layer constants. `oj/Button` remains a client component.
- No pop-ups, email gate, newsletter sequence, advertising campaign, calendar integration or redesigned homepage is included.
- No new database schema, lead state, migration or public admin endpoint is planned. Do not repurpose UTM fields for internal CTA placement.
- Preserve existing consent behaviour. Do not add storage before consent, visitor fingerprinting or personal information to analytics.
- No automatic creation of a lead from a WhatsApp click. Opening WhatsApp is not evidence that a message was sent.

## 3. Complete visitor journeys

### A. Reader who wants help with the guide's topic

1. Read the quick answer and introductory content.
2. See a compact invitation about that topic, with form and WhatsApp choices.
3. Choose the form and reach `/start-here?guide=<approved-slug>&placement=early#enquiry`.
4. See a topic-specific heading above the existing four-field form, relevant proof and a plain explanation of the next step.
5. Enter their own message and submit through the existing server action.
6. See the existing accessible confirmation only after the enquiry is stored.
7. Peter sees the lead in the existing admin view and receives the existing notification, with the originating guide available.

### B. Reader who prefers WhatsApp

1. Choose the WhatsApp action in a guide callout or on the enquiry/contact page.
2. Open a standard `wa.me` link using `CONTACT.whatsappNumber` and a short approved message.
3. Edit and send the message in WhatsApp themselves.
4. Peter receives and handles the conversation normally. The website records only the click, subject to the existing tracking behaviour.
5. Peter includes genuine WhatsApp enquiries in the aggregate weekly count. No scraping or new store of contact details is introduced.

### C. Visitor arriving directly at enquiry or contact

1. See the existing broad positioning and a short explanation of the initial message.
2. Reach a form immediately after the hero and short reassurance, before the long process and qualification sections.
3. Choose form, WhatsApp or email.
4. Receive the same submission behaviour regardless of entry route.

## 4. Recommendation 1: contextual guide invitations

### Scope and rollout

Launch first on `autumn-pub-event-ideas`, `oktoberfest-pub-guide` and `profitable-pub-food-menu-ideas`. After the measurement and functional gates in section 10 pass, extend the shared component to all published guides. Draft and future-dated guides retain existing visibility rules.

A typed configuration supports explicit overrides for priority slugs and a category fallback for the eight current guide categories. Reuse the category identifiers already resolved by the guide loader. Do not maintain another guide URL list.

### Placement

- Early callout: after the quick answer and before the authored article body. The quick answer is the first useful section; do not split rendered HTML or inject JSX into Markdown to place this block.
- End callout: immediately after the article and any separately rendered FAQ, before related guides and seasonal-hub link collections.
- Existing sticky CTA: keep its activation, dismissal and cookie-offset behaviour. Use the same configured primary label and contextual destination. Do not add a second sticky bar or a second sticky WhatsApp control.
- Existing final generic enquiry band on selected guides: replace its message with the relevant configured message, or reuse it as the end callout if positioned correctly. Do not render duplicate end invitations.
- Early block: short heading, one sentence and two actions. Full proof appears in the end block and destination. Keep the early block small enough that it does not dominate the answer.

### Proposed copy, ready for review

| Context | Heading | Supporting sentence | Primary action |
|---|---|---|---|
| Autumn | Turn autumn plans into bookings. | Tell Peter which events you are planning and where you need a hand. | Talk about my autumn plans |
| Oktoberfest | Give your Oktoberfest a clear route to bookings. | Tell Peter what you are planning and what is getting in the way. | Talk about my Oktoberfest |
| Food menu | Make your menu work harder for your business. | Tell Peter what is happening with food sales and where you want to grow. | Talk about my food sales |
| Other events | Turn your next event into a reason to book. | Tell Peter what you are planning and where you need a hand. | Talk about my event |
| Revenue growth | Turn interest into business growth. | Tell Peter what is happening and what you want to change. | Talk about my growth plans |
| Marketing | Turn attention into enquiries and bookings. | Tell Peter where people find you and what happens next. | Talk about my marketing |
| Food and drink | Make food and drink a stronger part of your business. | Tell Peter what is selling and where you want to grow. | Talk about my food and drink |
| Operations, people, property, turnaround, unknown category | Put these ideas to work in your business. | Tell Peter what is happening and where you need a hand. | Talk about my business |

Secondary action everywhere: **Message Peter on WhatsApp**. Nearby alternative: **Email Peter**, using `CONTACT.email`.

These are invitations to an initial discussion, not commitments to provide free event plans, financial audits or implementation.

### Configuration interface

Create `src/lib/guide-conversion.ts`:

```ts
export type GuideCtaPlacement = 'early' | 'end' | 'sticky';
export type GuideProof = 'bookings' | 'food-revenue' | 'search-visibility' | 'none';
export interface GuideConversionConfig {
  heading: string;
  body: string;
  primaryLabel: string;
  messageHint: string;
  whatsappMessage: string;
  proof: GuideProof;
}
export function getGuideConversion(
  slug: string,
  category: string
): GuideConversionConfig;
export function getGuideEnquiryHref(
  slug: string,
  placement: GuideCtaPlacement
): string;
```

Build query strings with `URLSearchParams`. Only supply published guide slugs from the loader. Validate incoming query values against that loader on the server; unknown, repeated, overlong or malformed inputs produce the normal generic form. Never echo arbitrary query text into copy, a link destination or a hidden field.

## 5. Recommendation 2: lower-friction initial contact

### `/start-here` order

1. Existing broad hero, with short initial-message explanation and primary anchor to `#enquiry`.
2. Enquiry section, containing contextual heading where valid, short reassurance, four-field form, contact alternatives and relevant proof.
3. Existing benefits of the free hour.
4. Existing process steps.
5. Existing cost and duration explanation.
6. Existing positive fit criteria.
7. Existing requirements and poor-fit criteria.
8. Existing FAQs and final invitation.

Keep one form and one `id="enquiry"`. A direct hash link must land with the heading visible below the fixed header. The form begins before long explanatory or qualifying sections on mobile and desktop. Do not claim every field fits above the fold on every screen.

### Copy and form behaviour

Generic introduction: **Tell Peter what is happening and what you would like to change. A line is enough to start.**

Reassurance: **Sending a message does not commit you to a call or paid work. The first conversation is free. Any paid work is agreed before it starts.**

Submit button: **Send my enquiry**. Pending label: **Sending...**. Keep existing success copy, inline errors, error summary, input retention and focus management.

Fields stay: Your name, Email, Business or venue, What's going on? All remain required. No budget, phone, accounts, calendar selection or marketing consent field is added.

Topic-specific guidance is help text, not a prefilled answer. Examples: autumn asks which events they are planning; Oktoberfest asks what they are planning and where they need help; food asks what is happening with food sales. The visitor must write their own situation.

Reword only the process step that currently requests a couple of sentences on each of four questions: the fields are contact details plus one short message. Proposed replacement: **Your contact details and a line about what is happening. We can ask the rest when we talk.**

Update `tasks/repositioning/copy/start-here.md` to match intentional changes. Update copy-lock tests to protect the new approved order and text without weakening fit, pricing or claims checks. Do not rewrite the rest of the positioning programme.

On `/contact`, retain its compact structure, adopt the same reassurance and button label, and add the same WhatsApp/email alternatives.

## 6. Recommendation 3: WhatsApp as a real alternative

Use the existing `URLS.whatsapp(message)` helper and `CONTACT` constants. No literal phone number is added to a component.

Approved prefilled message patterns:

- Autumn: `Hi Peter, I have been reading your autumn pub events guide. I would like to talk about my autumn plans.`
- Oktoberfest: `Hi Peter, I have been reading your Oktoberfest guide. I would like to talk about plans for my pub.`
- Food: `Hi Peter, I have been reading your food menu guide. I would like to talk about food sales at my pub.`
- Other guides: `Hi Peter, I have been reading your guide: <approved public guide title>. I would like to talk about my business.`
- Direct enquiry/contact: `Hi Peter, I would like to talk about my business.`

Only an approved public title may be inserted. Never transfer form contents, names, email addresses, internal IDs, session IDs, query strings or tracking tokens into the message.

Use an ordinary accessible external link. Clearly label a new-tab opening if used, with `rel="noopener noreferrer"`. Do not embed a WhatsApp widget or preload third-party scripts. Provide the form and email as fallbacks when the app is unavailable. The link remains usable with JavaScript disabled and when analytics fails.

## 7. Recommendation 4: proof at the decision point

Create a small shared proof block using approved constants rather than copied numeric literals.

| Context | Exact proof wording | Existing destination |
|---|---|---|
| Autumn, Oktoberfest, other events, revenue | +403% table bookings at The Anchor, our own venue. | `/results/interest-that-did-not-turn-up` |
| Food menu, food and drink | +98% food revenue in three months at The Anchor, our own venue. | `/results/busy-and-not-much-better-off` |
| Marketing | +828% Google Search visibility at The Anchor, our own venue. | `/results/nobody-could-find-us` |
| Generic business, operations, people, property, turnaround | No numeric proof card by default. Offer a plain link to the existing results page. | `/results` |

Use **See what changed at The Anchor** as the case-study link label. Add **Results from our own venue, not a forecast for your business.** beside quantified proof. Do not imply the entire booking result came from Oktoberfest or the autumn campaign.

A one-sentence explanation may paraphrase the existing case study: booking friction and reasons to visit for bookings; menu contribution, descriptions and pricing for food; customer search language and clearer enquiry routes for visibility. Introduce no additional quantified claim.

Before rollout, open each existing case-study destination and verify its content and successful response. Do not infer that a slug in a local data file proves the live page exists.

## 8. Recommendation 5: measurement and operational reliability

### Reuse and interpretation

Existing code supplies `guide_cta_click`, `whatsapp_click`, `enquiry_started` and server-side `enquiry_submitted`. Existing lead states are `new`, `contacted`, `qualified`, `conversation_booked`, `declined`, `client`. Reuse them. Confirm actual live storage and admin availability before relying on them.

The current `enquiry_started` event is only a start signal, not a completed enquiry. An enquiry row is the authoritative submission evidence. Notification delivery is separate. Do not add a client event that can impersonate a confirmed server-side submission.

### Event contract

| Event | Trigger | Allowed new contextual values | Counting |
|---|---|---|---|
| `guide_cta_click` | Form action selected on a guide | `guide_slug`, `placement`, `channel=form`, `version=guide-enquiry-v1` | Consented unique sessions per guide and placement; raw events separately |
| `whatsapp_click` | WhatsApp link selected | `guide_slug` when valid, `placement`, `channel=whatsapp`, same version | Click intent only, never a lead |
| `enquiry_started` | First actual form input | existing `entry_point`, plus validated `guide_slug`, `placement`, same version | Once per configured form entry key |
| `enquiry_submitted` | Existing successful lead write | Existing lead ID and source; validated guide context if present | Distinct stored lead IDs, never clicks |

Allow placements `early`, `end`, `sticky`, `enquiry`, `contact`. Validate event property values as well as property names; reject arbitrary strings in slug, placement, channel and version fields. Apply the narrow contract to new callers of legacy events without silently breaking their existing callers. Keep legacy analytics totals separately distinguishable by version.

Preserve the existing first-party, identifier-free event path without analytics consent. Do not label those counts as unique visitors or stitch them into sessions. Only consented analytics can supply a session-based funnel. Never divide all stored leads by consented sessions and call the result a conversion rate.

### Attribution

Use explicit, validated `guide` and `placement` query parameters for the enquiry context. These communicate the selected topic and action, not an inferred first visit. Preserve them through failed form submissions without rewriting what the visitor typed.

Keep the actual enquiry URL as `source_page`, with only approved context parameters. The admin source can identify the guide from those values. Preserve genuine incoming UTM values under the existing consent/storage rules; do not invent or overwrite acquisition campaigns. Report guide context as self-selected journey context, not proof that the session originated in Google.

Do not claim `landing_page` is a verified first-touch source until the implementation checks when `getBrowserLeadSource` first runs. If the earliest observation is the form, label it as an observed page rather than silently attributing an earlier visit. Strip fragments and arbitrary query parameters from new tracking payloads. Keep free-text situation and contact details inside the existing authorised enquiry flow.

### Weekly readout

Implement an authenticated admin summary alongside `EnquiriesPanel`, using the shared admin bearer gate and server-only data access. Return aggregates, not a downloadable list of contact details. Reuse existing fields and conversion-event JSON; inspect live schema before coding the query. No new schema is required by the design.

Show separate sections for:

- Google clicks by targeted guide, from a dated Search Console export, with latest complete reporting date.
- Consented guide sessions and unique-session CTA/start rates, only where existing analytics can provide compatible denominators. Otherwise display unavailable, not zero or an estimate.
- First-party CTA/start event counts, explicitly labelled as event counts.
- Stored enquiries by creation cohort, guide context, and current lead state. Include an unknown-context group.
- New genuine WhatsApp conversations, entered only as an aggregate in the weekly readout by Peter. No new storage of WhatsApp personal data and no automatic lead creation.
- Qualified enquiries, booked conversations and clients for the same enquiry cohort, with the observation date and cohort age.

`Qualified` means a genuine business enquiry, within the work Orange Jelly offers, with a relevant problem and willingness to discuss action. `Client` means paid work has been agreed, not merely a positive reply. A lead in a later stage should not disappear from a cumulative qualified count: explicitly count `qualified`, `conversation_booked` and `client` together and label it as current qualified-or-later status. This is not historical stage-entry tracking. Declined-after-qualified leads cannot be reconstructed without a status history; disclose that limitation.

Do not merge WhatsApp and form identities automatically or require invented email addresses. Peter removes known duplicates from the aggregate commercial readout and records the adjustment count, with no personal details in reports.

### Delivery acceptance

With explicit approval for the controlled production test, submit one clearly identified test enquiry using a contact address Peter controls. Verify visible confirmation, exactly one expected lead row, its attribution, the conversion record, notification delivery to the existing destination and a usable reply address. Exclude the test ID from reporting without deleting it automatically.

In local or isolated tests, simulate database failure, notification failure, event-write failure, malformed input, rate limiting and repeat submit. Database failure must show an error and fallback contact method while retaining inputs. Notification/event failure after the lead write must not falsely tell the visitor that the enquiry failed; it must leave an operational error visible to the team. Confirm existing behaviour before proposing any new alerting infrastructure.

No email, WhatsApp message, live status edit or database write occurs as part of the specification review.

## 9. File map and implementation work packages

Overall complexity: 4, because several shared surfaces and measurement code change. Split into independently reviewable PRs, normally 300 to 500 meaningful lines each. Keep production rollout ordered; do not leave broken intermediate states.

### Work package A: measurement baseline and event context

Files to inspect or modify: `src/lib/tracking.ts`, `src/app/actions/tracking.ts`, `src/app/api/events/route.ts`, `src/lib/lead-source.ts`, `src/app/actions/enquiry.ts`, `src/lib/db/enquiries.ts`, `src/test/analytics-events.test.ts`, `src/test/enquiry-action.test.ts`.

- [ ] Inspect current live schema and existing records read-only, verify event property storage and baseline coverage.
- [ ] Add a shared context validator to `src/lib/guide-conversion.ts`; consume published guide metadata on the server and send only validated public values to client components.
- [ ] Extend the event contract and attribution handling defined above without changing successful lead storage semantics.
- [ ] Add tests for invalid guide values, repeated parameters, non-enum placements, no-consent storage behaviour and failed telemetry that does not block navigation or submission.
- [ ] Run targeted tests, standard checks and a browser journey on a production build; commit the exact changed files.

Deliverable: existing pages still behave as before; the data contract and validated context are ready for the new actions. No migration.

### Work package B: enquiry page and contact choices

Modify: `src/app/start-here/page.tsx`, `src/app/start-here/content.ts`, `src/app/contact/page.tsx`, `src/components/oj/EnquiryForm.tsx`, `tasks/repositioning/copy/start-here.md`, `src/test/start-here-page.test.tsx`, `src/test/enquiry-form.test.tsx`.

Create: `src/components/oj/EnquiryActions.tsx`, `src/components/oj/EnquiryProof.tsx` and focused component tests.

- [ ] Add optional validated guide context to `EnquiryForm` props while retaining `entryPoint` compatibility with all existing callers.
- [ ] Implement one reusable action component using `URLS.whatsapp`, form destinations and the event contract.
- [ ] Move the form to the specified order and add contextual help, reassurance, proof and alternatives.
- [ ] Update the paired source-copy document and tests together.
- [ ] Verify generic, valid-context, malformed-context and no-JavaScript journeys; commit the exact changed files.

Deliverable: a short initial-contact journey with existing qualification information intact. Depends on A.

### Work package C: guide callouts and pilot

Modify: `src/app/guides/[slug]/page.tsx`, `src/components/oj/conversion.tsx`, `src/lib/guide-conversion.ts`.

Create: `src/components/oj/GuideEnquiryCallout.tsx`, `src/test/guide-conversion.test.ts`, `src/test/guide-enquiry-callout.test.tsx`.

- [ ] Populate explicit slug copy and category fallback copy from section 4.
- [ ] Add early and end callouts outside the article HTML and bind existing sticky CTA to the same context.
- [ ] Enable the three pilot slugs through a typed rollout configuration; leave all other guide rendering unchanged initially.
- [ ] Verify proof constant mapping, canonical enquiry links, single end CTA and unchanged article text/headings.
- [ ] Run mobile and desktop browser checks and the guide protection tests; commit the exact changed files.

Deliverable: all recommendations visible on the pilot journeys. Depends on B.

### Work package D: weekly aggregate view and reliability evidence

Inspect/modify: `src/components/admin/EnquiriesPanel.tsx`, `src/app/admin/AdminDashboard.tsx`, `src/lib/db/enquiries.ts`.

Create: `src/components/admin/EnquirySummary.tsx`, `src/app/api/admin/enquiry-summary/route.ts`, `src/test/enquiry-summary.test.ts` and `tasks/lead-conversion/measurement-runbook.md` during implementation.

- [ ] Build aggregate counts by creation period, validated guide context and current stage, including unknown context and an explicit test-ID exclusion.
- [ ] Use the existing admin authentication helper; test unauthenticated requests and ensure no personal records enter the summary response.
- [ ] Provide the dated weekly readout procedure, manual aggregate WhatsApp field and unavailable-data rules.
- [ ] Run the approved controlled delivery test and retain redacted evidence, including deployment ID and timestamp.
- [ ] Commit the exact changed files after checks pass.

Deliverable: a trustworthy weekly review with receipt evidence. Depends on A; complete before assessing the pilot. If live records do not support a denominator, show its limitation rather than adding a speculative tracking system.

### Work package E: broader guide rollout

Modify only the rollout configuration and affected tests, unless verified pilot findings require a separately reviewed correction.

- [ ] Review the pilot using section 10 and confirm qualification workload and tracking are usable.
- [ ] Enable category fallbacks for remaining published guides, keeping explicit pilot overrides.
- [ ] Inspect one guide from each category plus one seasonal hub and a legacy redirected URL.
- [ ] Run all release checks, deploy only when authorised and record production verification.

Deliverable: all guides use the shared contextual journey. Depends on C and D; no guide content migration.

## 10. Acceptance criteria, measurement window and rollout

### Functional acceptance

- Every pilot CTA reaches the correct contextual form; the message hint matches the guide.
- Direct `/start-here` and `/contact` remain useful without context parameters.
- The form appears before long process/fit sections; anchor navigation is not hidden under the header.
- One-line situation input remains accepted under the existing schema; contact validation remains unchanged.
- WhatsApp message and destination are correct, editable by the visitor and contain no private data.
- Browser tests stop before sending an external message unless specifically authorised.
- Relevant proof uses approved constants, names The Anchor as the company's own venue and links to the correct live case study.
- No duplicate form IDs, nested links, duplicated end CTA or article headings enter the table of contents.
- Analytics rejection leaves all actions usable; no new identifier or device storage is created before consent.
- Confirmed submissions come from stored rows; WhatsApp clicks are never counted as confirmed conversations.
- Admin summary access is protected by the shared bearer gate. Test and unknown-attribution buckets are explicit.

### Browser matrix

Use a production build and browser-based checks at 390 px mobile width and 1440 px desktop width, plus a 320 px overflow check. Include keyboard-only navigation, visible focus, labels, error-summary focus, 200% zoom, cookie notice open and dismissed, sticky CTA activated and dismissed, and analytics accepted/rejected. Confirm tap targets and cookie controls remain reachable. Run a no-JavaScript form path in an isolated environment where submission is permitted.

### Standard release checks

Run `npm run lint`, `npm run type-check`, `npm run test:run` and `npm run build`. Include the existing protected-post, canonical-URL, enquiry, analytics and start-here suites. Run existing UTC test coverage where available. Do not introduce Playwright as a test runner; use the existing browser audit approach.

No production-impacting monitor script should be run casually. Use `deploy-verify` for any live deployment claim and `e2e-test` for the implementation's browser verification. Read applicable Supabase guidance before live data inspection or query implementation. Any unforeseen migration needs its own reviewed production-migration procedure and explicit authorisation.

### Commercial assessment

Capture the prior 28 complete days where records exist. If no reliable baseline exists, label the first period as baseline collection. Start the pilot clock at the verified deployment, use a 28-day initial review and compare equal weekday coverage. This is a review interval, not a promised time to results. Do not schedule an automation without a separate request.

At each weekly review show actual counts, data freshness, unknown attribution, qualification workload and consent coverage. Compare the same three guides before and after, with all-guide context. Seasonal demand, acquisition mix and the recent site changes mean before/after differences are directional, not proof of causality.

Do not run parallel A/B variants at this traffic level. If the first period has too few enquiries to distinguish a pattern, keep reporting counts and continue observation rather than inventing a percentage target or declaring a winner. Expand when receipt and measurement work, the experience passes browser checks and the conversations are relevant; statistical proof of uplift is not required for expansion, but must not be claimed.

Stop expansion for a failed enquiry path, incorrect WhatsApp destination, inaccessible form/cookie controls, misleading proof, unprotected reporting or an unmanageable increase in irrelevant enquiries. Correct verified issues before rollout.

### Deployment and rollback

Prepare reviewable PRs and preview evidence first. Spec approval and implementation approval must be distinguished from live test and publishing authorisation. Where Peter explicitly authorises the complete rollout, carry it through without asking again for routine build, merge, push and verification steps within that scope.

Record branch, commit, deployment ID, tested URLs and browser observations after each release. Roll back the most recent UI/configuration change on a confirmed regression; retain lead rows, event records and previous guide URLs. No data deletion is part of rollback. Verify the restored enquiry journey before describing the incident as resolved.

## 11. Coverage and completion record

| Recommendation | Specification | Delivery |
|---|---|---|
| Contextual invitations on busiest guides | Sections 3 and 4 | C, then E |
| Easier first contact | Section 5 | B |
| WhatsApp alternative | Section 6 | B and C |
| Relevant proof | Section 7 | B and C |
| Measurement and verified delivery | Section 8 | A and D |

Files deliberately left unchanged by the planned scope: all `content/blog/*.md`, `content/insights/*`, `src/lib/route-manifest.js`, redirects, article metadata, `CLAIMS.md`, contact and pricing constants, existing case-study copy, auth implementation and `supabase/migrations/*`. Reuse them as sources of truth. Changes to the existing enquiry schema are not required.

Specification completion means the requirements, copy, component boundaries, rollout, measurement limitations and acceptance criteria are recorded and checked. Product completion requires implementation plus the actual visitor-path and delivery evidence above. This document does not mark any product work complete.
