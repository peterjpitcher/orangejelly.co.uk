# Availability Poll Specification Review

**Review date:** 16 July 2026  
**Reviewed document:** `tasks/availability-poll/SPEC.md`  
**Repository point checked:** `cd699365`  
**Audience:** Developer and delivery owner  
**Original specification changed:** No

## Overall assessment

**Readiness: Not ready for implementation.**

The specification has strong coverage of mobile use, capability links, London time, email escaping, retention and accessibility. However, it is not a safe build contract yet. Several binding requirements conflict with each other, several required journeys have no implementable contract, and parts of the document are already stale against code and migrations committed after it was assembled.

The largest blockers are:

1. The document is not reconciled with the current repository or the applied follow-up migration.
2. The creation scope is unresolved: date-only versus slots, location, initial option count and several validation rules disagree.
3. The resend-verification, verification-success, edit, unsubscribe and calendar-download journeys are incomplete or impossible with the stated action contracts.
4. Token pages currently inherit GTM, Vercel Analytics, Speed Insights and third-party preconnects from the root layout. This conflicts with the stated no-third-party rule and can expose capability URLs.
5. Multi-table writes, digest claiming and confirmation fan-out are not transactional or durably queued.
6. Participant email is not verified. A person can type somebody else's address, so the claimed anti-relay control is not real.
7. The privacy wording applies Article 14 to data entered directly by the participant and states a false source for that data.
8. The test plan contains assertions that contradict the current code and makes end-to-end testing optional for the riskiest journeys.

## Review basis

This review checked the specification against:

- `src/lib/dateUtils.ts` and its tests;
- `src/lib/db/polls.ts` and its tests;
- both poll migrations;
- `src/app/layout.tsx`, `src/middleware.ts`, `src/app/robots.ts` and `src/app/sitemap.ts`;
- the existing email, component, environment and Vercel configuration;
- the current dependency versions installed in the repository;
- official ICO, Resend, Vercel, Cloudflare and Next.js guidance where the fact can change.

The existing suite was run during review: **13 test files and 169 tests passed**. The specification says 12 files and 149 tests, which is one example of its stale repository snapshot.

### Labels

- **Confirmed issue:** The conflict or gap is present in the specification or current repository.
- **Optional improvement:** Not required to make the stated product work, but would reduce risk or complexity.
- **P0:** Resolve before implementation starts.
- **P1:** Resolve before the affected phase is merged.
- **P2:** Resolve before production release or accept explicitly.
- **P3:** Useful follow-up.

---

## Confirmed issues

### C01. The specification is stale against the repository

**Relevant section:** Front matter; §1.0; §5.0; §5.7; §6  
**Priority:** P0  
**Type:** Delivery / documentation  
**Status:** Confirmed issue

**Description:** The document says `src/lib/db/polls.ts` is net new, says `formatSlotInLondon()` accepts date-only input, asks for a test proving the wrong 1:00am output, says the base migration is unapplied in the build table, and records 149 tests. The repository already has `src/lib/db/polls.ts`; `dateUtils.ts` now rejects date-only and zoneless slot values; both migrations are present; and 169 tests pass.

**Rationale:** A developer following the document would undo a date safety fix, duplicate an existing data layer, or write tests that must fail.

**Impact:** High risk of regression, duplicated work and incompatible pull requests.

**Recommended action:** Produce a dated errata pass before coding. Remove superseded instructions instead of relying on the correction note at the top. Mark every existing file as **modify**, **replace** or **keep**, with the current commit as the baseline.

**Open questions:** Is `cd699365` the agreed implementation baseline? Has any other branch moved the poll code further?

### C02. The applied email migration does not match the specified contract

**Relevant section:** §3.6.6; §4.4; §4.7; `20260716160000_availability_polls_email_columns.sql`  
**Priority:** P0  
**Type:** Data / contradiction  
**Status:** Confirmed issue

**Description:** The specification repeatedly defines `confirm_notify_failures` as an integer count. The applied migration defines it as `jsonb not null default '[]'`. The migration comment implies addresses may be recorded, while the UI and action contract expect a number.

**Rationale:** Code cannot implement both shapes. Recording recipient addresses would also increase personal data with no stated purpose or retention rule.

**Impact:** Runtime type errors, wrong organiser messages and unnecessary personal data.

**Recommended action:** Decide whether the field is a count or a structured delivery record. For this scope, use an integer count plus a separate total-attempted count. Apply a follow-up migration before any poll rows exist and update generated database types if used.

**Open questions:** Was the live migration applied exactly as committed? Are there still zero poll rows, as the migration comment states?

### C03. The creation scope contradicts itself

**Relevant section:** O1.1; O1.4; O1.5; §2.1 “Data written”; §3.6.1  
**Priority:** P0  
**Type:** Functional / product decision  
**Status:** Confirmed issue

**Description:** O1.1 requires a date-or-slots choice and a location field. The screen specification says the form always creates slots and does not collect location. The server schema and email/calendar sections support both dates and slots.

**Rationale:** This changes the form, validation, render branches, calendar output and test matrix.

**Impact:** A developer cannot know which UI to build. Date-only data may be supported in the database but impossible to create, while slot-only markup will crash on date rows.

**Recommended action:** Make one explicit MVP decision:

- support both kinds and fully specify both form paths; or
- ship slots only and remove date-only acceptance criteria, code paths and tests from this release.

Also decide whether location is collected.

**Open questions:** Are whole-day polls a launch requirement? Are overnight pub events a launch requirement? Is location required for the calendar entry?

### C04. The create and resend-verification journey is not implementable

**Relevant section:** O1.11–O1.12; §1.4.4; §2.1 success; §3.1; §3.6.1; §4.1  
**Priority:** P0  
**Type:** Functional / API contract  
**Status:** Confirmed issue

**Description:** The UI says it replaces the form in place, while `createPoll` returns `nextPath: '/availability/new/check-your-inbox'`; that route is not in the file inventory. The success screen must offer “Send it again”, but no resend action is one of the eight actions. `createPoll` deliberately returns no poll id or token, so the screen has no safe handle identifying which draft to resend.

**Rationale:** Email failure is explicitly accepted, making the resend route a required recovery path, not polish.

**Impact:** An organiser can create an unrecoverable draft and cannot use the promised control.

**Recommended action:** Define one flow. Recommended: return a short-lived, purpose-specific resend capability; navigate to a check-inbox route; add `resendVerification(resendToken)` with an atomic 60-second guard and token rotation. Do not identify a draft by email because multiple drafts per email are allowed.

**Open questions:** Should resend capability be stored hashed? How long should it last? What happens after the draft's 24-hour deletion boundary?

### C05. Verification success cannot obtain the links through the stated action type

**Relevant section:** R15; §2.2; §3.1; §3.6.2  
**Priority:** P0  
**Type:** Functional / API contract  
**Status:** Confirmed issue

**Description:** `verifyOrganiserEmail()` returns only `PollActionResult`, but the success page needs the participant and organiser tokens. Verification nulls the verify token in the same update, so the page cannot look the poll up by that token afterwards. R15 says to re-read by poll id, but the action does not return the id.

**Rationale:** The success screen and links email require data that the public contract discards.

**Impact:** The route cannot meet its acceptance criteria without bypassing the action or widening the contract ad hoc.

**Recommended action:** Define a server-only verification service returning `{ pollId, participantToken, organiserToken, organiserEmail, ... }`. Keep a separate public action result if needed. Perform update-and-return in one database call and pass the returned row directly to rendering and email composition.

**Open questions:** Is verification intended to be called only by the page, or also as a client-invoked server action?

### C06. Important routes and handlers are missing

**Relevant section:** P2.3–P2.7; P3.4; §4.6; §6  
**Priority:** P1  
**Type:** Functional / integration  
**Status:** Confirmed issue

**Description:** The participant edit route is listed but has no screen-level specification. The confirmed page promises an `.ics` download but no download route or response contract exists. The one-click unsubscribe route is mentioned only in a header string. Its GET/POST behaviour, token, response, idempotency and tests are absent.

**Rationale:** These are user-visible and externally invoked endpoints. A filename in an inventory is not an implementable contract.

**Impact:** Broken links, insecure handler choices and inconsistent UI are likely.

**Recommended action:** Add explicit contracts for:

- the edit screen, including loading, error, success and locked states;
- a token-protected calendar download route with content type, filename and caching headers;
- a one-click unsubscribe POST plus a human GET landing page;
- check-inbox and shared not-found routes.

**Open questions:** Should `.ics` download use the participant token, a separate token or a generated data URL? Does unsubscribe stop only digests/nudges or all non-essential poll mail?

### C07. Custom 404 behaviour is underspecified and internally inconsistent

**Relevant section:** O2.4; E6–E7; §2.2; §2.3; §2.4  
**Priority:** P1  
**Type:** Functional / framework  
**Status:** Confirmed issue

**Description:** The document requires byte-identical 404 responses, but gives the verify route different headings and body copy from the shared “not live” page. It also says a Server Component “renders” a 404 without stating how the status is set.

**Rationale:** In the App Router, `notFound()` terminates rendering and uses the segment's `not-found` file; it also injects `noindex`. Merely rendering error copy returns 200. See [Next.js `notFound()`](https://nextjs.org/docs/app/api-reference/functions/not-found).

**Impact:** Soft 404s, inconsistent token-oracle behaviour and indexable error pages.

**Recommended action:** Use one shared segment `not-found.tsx` and call `notFound()` for unknown, expired, consumed and hidden-draft tokens. Remove route-specific invalid copy if byte identity is a hard requirement.

**Open questions:** Does “byte-identical” include response headers, or only visible body content?

### C08. Participant email is still an open-relay surface

**Relevant section:** P1.8; §3.6.3; §4.3; §4.6  
**Priority:** P0  
**Type:** Security / email deliverability  
**Status:** Confirmed issue

**Description:** The specification says a participant email goes only to an address “the recipient typed themselves”. The system cannot prove that. Anyone holding a participant link can enter any third-party address, causing an edit-link email and later a confirmation email to be sent there.

**Rationale:** Optional email plus no verification makes the participant endpoint a limited mail relay. IP and poll limits reduce volume but do not establish consent or ownership.

**Impact:** Spam complaints, abuse of the sending domain, privacy complaints and unwanted disclosure of poll details.

**Recommended action:** Choose and document one control:

- verify participant email before storing it as contactable; or
- do not send the edit email and show the edit link only on screen; or
- send one verification email and send confirmation only after verification.

Add a per-address limit and suppression check whichever route is chosen.

**Open questions:** Is participant confirmation email essential enough to justify email verification? What abuse volume is acceptable?

### C09. Token pages inherit third-party scripts that can expose capability URLs

**Relevant section:** O3.8; E8–E9; §3.3; current `src/app/layout.tsx`  
**Priority:** P0  
**Type:** Security / architecture  
**Status:** Confirmed issue

**Description:** The specification requires no third-party resource on token pages, but all routes inherit GTM, the GTM no-script iframe, Vercel Analytics, Speed Insights and third-party preconnects from the root layout. `Referrer-Policy: no-referrer` does not stop JavaScript from reading `window.location` and sending the full path.

**Rationale:** Participant, organiser, edit and verification tokens are bearer credentials. Analytics collection of a page URL is a credential leak.

**Impact:** Anyone with access to analytics, tag-manager history, a vendor log or a copied event may gain poll capability.

**Recommended action:** Put availability routes under a minimal route-group layout with no analytics, engagement widgets, third-party preconnects or marketing chrome. If the current root layout cannot be bypassed, restructure layouts before adding the routes. Add an automated browser assertion that no third-party request occurs.

**Open questions:** Which GTM tags read page URLs today? Are Vercel Analytics path parameters retained or redacted in the current account?

### C10. Search and crawler controls are missing for capability pages

**Relevant section:** §2.0; §3.3; current root metadata and `robots.ts`  
**Priority:** P1  
**Type:** Security / SEO  
**Status:** Confirmed issue

**Description:** The root metadata is indexable and `robots.ts` allows `/availability/`. The specification does not require `noindex`, `nofollow`, `noarchive`, a restrictive `X-Robots-Tag`, or removal of token URLs from analytics and link previews.

**Rationale:** Secret URLs should not depend on search-engine goodwill or on never being linked accidentally.

**Impact:** Poll titles, participant links or organiser links may appear in crawler stores or browser services if leaked.

**Recommended action:** Add route metadata and middleware headers for every token route. Keep `/availability/new` indexable only if that is a marketing decision. Keep dynamic token routes out of the sitemap.

**Open questions:** Should the public participant poll be intentionally share-previewable, or should unfurl bots receive generic metadata with no poll title?

### C11. Multi-table writes are not atomic

**Relevant section:** §3.1; §3.6.1; §3.6.3; §3.6.4; current `src/lib/db/polls.ts`  
**Priority:** P0  
**Type:** Data integrity / reliability  
**Status:** Confirmed issue

**Description:** Poll creation, first response, response update, expiry movement and digest bookkeeping span multiple Supabase calls. The specification uses compensating deletes. The current update implementation deletes all answers before inserting replacements, so an insert failure can remove a participant's valid prior response.

**Rationale:** Compensation is not a transaction and can also fail. Several writes can partially commit or race.

**Impact:** Lost votes, orphan rows, wrong retention dates and misleading success states.

**Recommended action:** Move each logical write into a Postgres function called through Supabase RPC, or use the existing Postgres connection for explicit transactions. Cover create, submit, update, confirm claim and digest claim. Return a typed result from the transaction.

**Open questions:** Is adding security-definer RPC functions acceptable? If so, what search path and grant model will be used?

### C12. Database integrity claims are stronger than the schema

**Relevant section:** O1.5; O6.3; §3.6.6; base migration  
**Priority:** P1  
**Type:** Data integrity  
**Status:** Confirmed issue

**Description:** `poll_options_shape_chk` checks only the shape of each option. It cannot ensure that the shape matches the parent poll's `option_kind`, contrary to the specification. `polls_confirmed_option_fk` is also a simple FK, so it does not ensure the confirmed option belongs to the same poll.

**Rationale:** Application checks are useful but should not be described as database guarantees when they are not.

**Impact:** A bug or service-role script can create a poll with contradictory option data or a cross-poll confirmed option.

**Recommended action:** Add a composite confirmed-option FK using `(confirmed_option_id, id)` to `(poll_options.id, poll_id)`. Enforce parent-kind consistency in a transactional RPC or trigger. Add a unique constraint on `(poll_id, position)` if position is relied on for deterministic order.

**Open questions:** Is trigger-based parent-kind validation acceptable, or will all writes be forced through RPC functions?

### C13. `closes_at` has two incompatible meanings

**Relevant section:** O5; §3.6.1 `closesAt`; §3.6.3; §3.6.5  
**Priority:** P0  
**Type:** Data model / functional  
**Status:** Confirmed issue

**Description:** `closes_at` is used as the actual time an organiser closed the poll. The create schema also accepts a future `closesAt` as an automatic deadline, although the UI does not collect it. Reopening sets it to null and erases the historic close time.

**Rationale:** One column cannot reliably mean both scheduled deadline and actual transition time.

**Impact:** Voting may be rejected while the page still says open, reporting becomes inaccurate, and reopen destroys audit information.

**Recommended action:** For this scope, remove `closesAt` from create input and use `closed_at` only as a transition timestamp. If scheduled closure is required, add a separate `voting_deadline_at` and specify how pages move to the closed state.

**Open questions:** Is automatic closure in scope? Is historic close/reopen data needed?

### C14. Option validation rules disagree

**Relevant section:** O1.8; §2.1 validation; §3.6.1 schema; §5  
**Priority:** P1  
**Type:** Functional / validation  
**Status:** Confirmed issue

**Description:** O1.8 rejects two slot options with the same start instant. Client validation compares `(date, start, end)`, and server validation compares `startsAt|endsAt`, allowing the same start with different ends. Description is capped at 500 characters in the UI and 1,000 on the server. Positions are specified as zero-based but current code and tests store one-based values.

**Rationale:** Client and server rules must agree, and ordering must have one convention.

**Impact:** Crafted requests behave differently from the form and test expectations become unstable.

**Recommended action:** Publish one validation table used by client schema, server schema and tests. Decide whether duplicate means same start or same full range. Align limits and position numbering.

**Open questions:** Is “19:00–20:00” distinct from “19:00–21:00” for poll purposes?

### C15. Overnight and boundary-time journeys are not defined

**Relevant section:** O1.6–O1.8; §2.1 time inputs; §3.6.1; E10–E11  
**Priority:** P1  
**Type:** Functional / date-time  
**Status:** Confirmed issue

**Description:** The form gives each slot one date plus start and end times, so it cannot express an overnight slot. The formatter and server schema support cross-midnight ranges. `step={900}` suggests 15-minute values, but the server accepts any minute. A slot earlier today is not clearly rejected. The autumn repeated hour is silently mapped to the earlier instant while the displayed phrase remains ambiguous to a human.

**Rationale:** Pub events often cross midnight, and DST ambiguity is exactly the class of error this feature says it must avoid.

**Impact:** Valid events cannot be entered, crafted input bypasses UI rules, or a repeated-hour event is understood differently by organiser and calendar.

**Recommended action:** Decide whether overnight slots are supported. If yes, collect an end date or an “ends next day” control. Enforce 15-minute steps server-side if they are a rule. Reject past starts if required. For the autumn overlap, either reject the repeated hour or show the selected offset explicitly as BST/GMT.

**Open questions:** What is the maximum duration? Should a repeated-hour poll offer both occurrences?

### C16. “If need be” default behaviour is unsafe and contradictory

**Relevant section:** SCOPE decision; P1.5; §5.8  
**Priority:** P0  
**Type:** Product / functional  
**Status:** Confirmed issue

**Description:** The product text can be read as making the third state available by default. The component test instead requires every unanswered option to start selected as “If need be”. P1.5 says every option must be answered and the screen says “Tap one answer for each option”. Preselection makes both claims false.

**Rationale:** A participant could submit every option as “If need be” without making any choice.

**Impact:** Accidental availability data and an unreliable winner.

**Recommended action:** Start every answer as `null` and require an explicit choice. Keep “If need be” visible without a feature toggle. If preselection is genuinely wanted, change the user copy and add a final confirmation that names untouched defaults.

**Open questions:** Did “default on” mean “show the option” or “preselect the answer”?

### C17. Closed and confirmed participant views cannot show disabled answers as specified

**Relevant section:** P3.5–P3.6; §2.3 error states  
**Priority:** P1  
**Type:** Functional / UX  
**Status:** Confirmed issue

**Description:** The shared participant link does not identify a participant. On a closed or confirmed poll, the page therefore cannot know which answers to preselect. Rendering disabled radio groups without a value would look like the visitor answered nothing.

**Rationale:** Aggregate-only public access intentionally omits per-person identity.

**Impact:** Misleading read-only UI.

**Recommended action:** On the shared link, render option labels and aggregate totals only. Show personal disabled answers only on a valid edit-token route or after an explicitly accepted local-device convenience flow.

**Open questions:** Should the edit-token route continue to show the person's answers after confirmation?

### C18. The participant edit journey is not specified to build quality

**Relevant section:** P2; §2.5 inventory  
**Priority:** P1  
**Type:** Functional / accessibility  
**Status:** Confirmed issue

**Description:** The edit page is a fifth user screen but the document calls the feature four screens and gives the edit page no layout, component, validation, success, failure, focus, privacy or locked-state detail. It says email is pre-filled but later says email is not editable.

**Rationale:** Edit is described as a core differentiator and cannot rely on inference from the first-response form.

**Impact:** Inconsistent form behaviour and possible accidental email changes or disclosure.

**Recommended action:** Add a full edit-screen contract. Mark email as read-only or omit it. Define stale token, mismatched participant-token, shared-device, closed and confirmed behaviour.

**Open questions:** Can the participant change their name? Can they remove their email? Can they delete their own response?

### C19. Ignoring a mismatched participant token creates a confused URL

**Relevant section:** P2.5  
**Priority:** P2  
**Type:** Security / routing  
**Status:** Confirmed issue

**Description:** The edit page resolves by edit token and explicitly ignores a mismatched participant token in the URL.

**Rationale:** This permits a URL that appears to belong to poll A while rendering poll B. It also conflicts with path-scoped cookies and canonical link generation.

**Impact:** Confusing support cases and possible data exposure on shared screens.

**Recommended action:** Resolve by edit token, then require the parent participant token to match. Return the shared 404 when it does not. Redirect to the canonical edit URL only if exposing the canonical participant token is acceptable.

**Open questions:** Is there any valid journey that needs the mismatch to succeed?

### C20. The local edit-token cookie creates shared-device and XSS risk

**Relevant section:** §2.3 “Already-voted state”  
**Priority:** P1  
**Type:** Security / privacy  
**Status:** Confirmed issue

**Description:** The browser client is told to write the edit bearer token into a 90-day cookie. A client-written cookie cannot be `HttpOnly`. On a shared device, the next person opening the poll can see and change the earlier person's answers. The notice does not describe the cookie or a way to forget it.

**Rationale:** The edit token grants write access to personal data.

**Impact:** Cross-user disclosure and edit access on shared pub or family devices.

**Recommended action:** Do not auto-open personal answers from the shared participant link. If convenience is retained, set an encrypted or opaque `HttpOnly` cookie server-side, scope its lifetime to poll expiry, show “Not you?” and “Forget this response on this device”, and document it as strictly necessary.

**Open questions:** Is repeat-device convenience worth the shared-device risk?

### C21. “Everyone invited, including non-voters” is impossible

**Relevant section:** O6.4; lifecycle day 14; §3.6.6; §4.4; §5.3  
**Priority:** P0  
**Type:** Functional / data model  
**Status:** Confirmed issue

**Description:** A `poll_participants` row is created only after a response is submitted. There is no invitee list. The system can email only responders who supplied an address, plus the organiser. The document later admits this in §4.5 but still requires tests for non-voters.

**Rationale:** A non-voter has no row or email address.

**Impact:** Impossible acceptance tests and misleading organiser copy claiming everyone was told.

**Recommended action:** Replace the requirement and copy with: “the organiser and every responder who supplied a verified email address”. Keep the copyable confirmation block for everyone else. An invitee list must remain separate scope.

**Open questions:** Does the business still require contacting non-voters? If yes, is the added relay and data risk accepted?

### C22. Confirmation fan-out is synchronous, non-idempotent and incorrectly throttled

**Relevant section:** §3.6.6; §4.4 per-recipient loop; §4.6  
**Priority:** P0  
**Type:** Performance / email integration  
**Status:** Confirmed issue

**Description:** Confirmation updates the poll and then awaits every email inside the user request. The stated `sleep(120)` is about 8.3 requests per second, not two. Current Resend documentation says the default is five requests per second per team and recommends a queue for spikes. No idempotency key is specified.

**Rationale:** A timeout after the database update leaves the poll confirmed while the browser sees failure. A retry cannot safely resend. Resend supports 24-hour idempotency keys. See [Resend rate limits](https://resend.com/docs/api-reference/rate-limit) and [idempotency keys](https://resend.com/docs/dashboard/emails/idempotency-keys).

**Impact:** Partial fan-out, duplicate mail, request timeouts and provider 429 responses.

**Recommended action:** Write confirmation jobs to an outbox transactionally with the status change. Process them asynchronously with bounded concurrency, retry/backoff and per-recipient idempotency keys such as `poll-confirm/<pollId>/<sequence>/<recipientHash>`. Do not sleep in the server action.

**Open questions:** What is the maximum expected recipient count? Is a durable worker available, or should the cron drain the outbox?

### C23. Digest claiming races and has no durable delivery state

**Relevant section:** §4.2; §3.8  
**Priority:** P1  
**Type:** Concurrency / email integration  
**Status:** Confirmed issue

**Description:** Two simultaneous responses can both see an open digest window and both send. State is updated only after successful delivery. There is no atomic claim, lease, attempt count or backoff. A daily cron can leave the final digest pending for nearly a day.

**Rationale:** Read-build-send-write is not concurrency-safe.

**Impact:** Duplicate digests, repeated retries on every vote, or late organiser notification.

**Recommended action:** Use an outbox row with a unique digest-window key and atomic claim. Define delivery latency, retry intervals, maximum attempts and terminal failure handling.

**Open questions:** Is near-real-time organiser notification required, or is daily delivery acceptable?

### C24. Email delivery cannot be monitored or suppressed

**Relevant section:** §4.6; §3.8  
**Priority:** P1  
**Type:** Monitoring / deliverability  
**Status:** Confirmed issue

**Description:** The design logs immediate API errors but has no Resend webhook, delivery id storage, hard-bounce suppression, complaint suppression or alert thresholds. Resend recommends webhooks for bounces and alerts, and requires webhook signature verification and idempotent handling.

**Rationale:** A successful API call is not proof of delivery. Repeatedly mailing hard-bouncing or complaining addresses damages sender health.

**Impact:** The organiser may be told mail was sent when it bounced, and sender reputation can degrade unnoticed.

**Recommended action:** Store Resend message ids and minimal delivery state. Add a signed webhook route, deduplicate by `svix-id`, suppress permanent bounces/complaints, and alert on failure-rate thresholds. See [Resend webhook guidance](https://resend.com/docs/webhooks/introduction) and [signature verification](https://resend.com/docs/webhooks/verify-webhooks-requests).

**Open questions:** Should suppression be global to the Resend team or scoped to polls? Who receives deliverability alerts?

### C25. The send ceiling is declared mandatory but not specified

**Relevant section:** §4.6  
**Priority:** P1  
**Type:** Security / delivery  
**Status:** Confirmed issue

**Description:** The document requires a hard per-poll daily send ceiling but defines no value, counter, time window, atomic update or user behaviour when reached. The 60-responses-per-day limit is not a lifetime participant cap.

**Rationale:** A long-lived poll can accumulate far more recipients than the stated design point.

**Impact:** Unbounded fan-out cost and long-running confirmation jobs.

**Recommended action:** Set explicit per-message-type and total limits. Enforce them atomically before enqueueing mail. Define whether excess recipients are omitted, queued for later or block confirmation with a clear organiser warning.

**Open questions:** What is the supported maximum responders per poll? What quota must remain reserved for contact-form notifications?

### C26. Turnstile is named but not technically specified

**Relevant section:** P1 note; §3.4; §6 phase 2a  
**Priority:** P1  
**Type:** Security / integration  
**Status:** Confirmed issue

**Description:** Turnstile is a phase gate, but there is no widget mode, server-side Siteverify request, secret handling, hostname/action validation, token expiry handling, retry UX or test plan. The document also says to add Cloudflare to `connect-src` globally, while current web guidance requires `script-src` and `frame-src`; `connect-src` depends on mode.

**Rationale:** Client rendering alone is not an abuse control. CSP should be widened only as required. See [Cloudflare Turnstile CSP guidance](https://developers.cloudflare.com/turnstile/reference/content-security-policy/).

**Impact:** A bypassable challenge or an unnecessarily broader site-wide CSP.

**Recommended action:** Add the complete server-verification contract and environment variables. Apply route-specific CSP if possible. Test missing, expired, duplicate, wrong-hostname and Cloudflare-unavailable outcomes.

**Open questions:** Managed, non-interactive or invisible mode? Fail open or closed when Siteverify is unavailable?

### C27. The privacy notice uses the wrong collection route and false wording

**Relevant section:** P1.12; §4.3; §4.4  
**Priority:** P0  
**Type:** Privacy / legal  
**Status:** Confirmed issue

**Description:** Participants type their name, answers and optional email directly into Orange Jelly's form. That is direct collection, normally Article 13, not Article 14. The proposed notice says the organiser supplied the participant's details, which is false in this design.

**Rationale:** The ICO distinguishes data collected from the person from data obtained elsewhere. See [ICO right to be informed](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/individual-rights/right-to-be-informed/).

**Impact:** An inaccurate privacy notice and an unverified lawful-basis decision.

**Recommended action:** Obtain legal/privacy review before Phase 3. Rewrite the notice around direct collection, link to a durable privacy notice, and document the legitimate-interests assessment. If relying on legitimate interests, include the right to object and the actual recipients/processors.

**Open questions:** Is Orange Jelly the sole controller, or are Orange Jelly and the organiser separate or joint controllers for parts of the processing? Has an LIA been completed?

**Suggested wording change:** Replace “That’s where we got your details” with wording such as: “You gave Orange Jelly your name, answers and optional email address when you responded to this poll.” This wording still needs legal approval.

### C28. Processor, transfer and cookie disclosures are missing

**Relevant section:** Decisions 3 and 8; P1.12; §3.4; §4; cookie flow  
**Priority:** P1  
**Type:** Privacy / delivery  
**Status:** Confirmed issue

**Description:** The notice does not cover Supabase, Upstash, Resend, Vercel, Cloudflare Turnstile, international transfers, retention of provider logs, or the edit-token cookie. No data-processing-agreement or regional-hosting check is listed.

**Rationale:** These vendors process IP addresses, email addresses, message content or capability URLs. The exact disclosure depends on the chosen configuration.

**Impact:** Incomplete transparency and unassessed cross-border or subprocessor risk.

**Recommended action:** Add a privacy delivery checklist: vendor role, DPA, region, transfer mechanism, data fields, log retention, deletion route and notice wording. Update the site's main privacy/cookie material, which does not currently contain a poll privacy notice.

**Open questions:** Which Upstash region will be used? What Resend/Vercel log retention applies to the live plans? Is Turnstile acceptable for this audience?

### C29. Cron assumptions are stale and reliability controls are absent

**Relevant section:** §3.8; §4.2; §4.5; §6; Q8  
**Priority:** P1  
**Type:** Deployment / operations  
**Status:** Confirmed issue

**Description:** The spec says Hobby allows two cron jobs; current Vercel documentation says 100 per project, with Hobby limited to daily frequency and up to 59 minutes of timing variation. Vercel does not retry failed cron invocations. The proposed job has no distributed lock, idempotency key, run record, alert or backlog metric. `sweepUnverifiedDrafts()` is not given the 500-row safety limit used for expired polls.

**Rationale:** Retention is a promised obligation, and digest/nudge processing can overlap or fail silently. See [Vercel cron usage](https://vercel.com/docs/cron-jobs/usage-and-pricing) and [cron management](https://vercel.com/docs/cron-jobs/manage-cron-jobs).

**Impact:** Late deletion, duplicate sends, uncontrolled draft deletion or an unnoticed stopped job.

**Recommended action:** Refresh plan facts; add an execution lock, idempotent passes, per-pass limits, run/audit records, backlog counts and failure alerting. Document that instant rollback does not update active cron jobs automatically.

**Open questions:** What is the live Vercel plan? Who checks a failed retention run? What deletion delay beyond 60 days is acceptable?

### C30. Rate-limit deployment and failure behaviour are incomplete

**Relevant section:** §3.4; §6 phase 2a  
**Priority:** P1  
**Type:** Security / delivery  
**Status:** Confirmed issue

**Description:** Creation and confirmation fail closed when Upstash is absent, but there is no documented local/test/staging strategy, configuration health check, timeout, retry policy or alert. IP extraction trusts the first `x-forwarded-for` value without a platform-specific verification test. Pepper rotation is not covered.

**Rationale:** A missing environment variable would disable the core product, while a spoofable IP source would bypass throttling.

**Impact:** Production outage or ineffective abuse controls.

**Recommended action:** Add startup/config checks, short Upstash timeouts, environment-specific test adapters, Vercel header verification, alerts and a pepper-rotation procedure. Do not put real mail behind preview deployments; use a sink or approved test recipients.

**Open questions:** Does Vercel overwrite or append the live `x-forwarded-for` header in this project configuration? What is the acceptable limiter latency?

### C31. Accessibility requirements conflict with the supplied markup

**Relevant section:** P1.3; §2.1 success; §2.3 answer control; §2.4 matrix  
**Priority:** P1  
**Type:** Accessibility  
**Status:** Confirmed issue

**Description:** P1.3 requires `fieldset` and `legend`; §2.3 forbids fieldsets and uses `role="radiogroup"`. The success state adds a second h1 inside a form while the page h1 remains. `AlertTitle` renders h5, causing heading-level jumps. Option cards use h3 without a defined h2. The sample results cell contains only the state in its screen-reader span despite requiring name, option and state. The full-size absolute radio lacks an explicit inset.

**Rationale:** These are structural semantics, not visual detail.

**Impact:** Confusing screen-reader output, poor heading navigation and unreliable hit areas.

**Recommended action:** Choose one native grouping pattern and test it in VoiceOver/NVDA. Keep one page h1; use paragraphs inside alerts where heading level cannot be controlled; use h2 for option cards or add an h2 section; make the complete cell label real; add `inset-0` to the radio input.

**Open questions:** Has the proposed radiogroup pattern been tested on iOS VoiceOver, not only keyboard desktop?

### C32. Mobile sticky controls omit safe-area and obstruction handling

**Relevant section:** §2.3 sticky submit; manual QA  
**Priority:** P2  
**Type:** Accessibility / mobile UX  
**Status:** Confirmed issue

**Description:** The sticky bar has no `env(safe-area-inset-bottom)` padding and no defined spacer at the end of the form. The root cookie notice and engagement widgets can also occupy the bottom of the screen unless removed by the minimal layout.

**Rationale:** iPhones with a home indicator and site overlays can obscure the primary action or last answer.

**Impact:** Hard-to-reach controls on the most important viewport.

**Recommended action:** Add safe-area padding and bottom content spacing, and remove marketing overlays from availability routes. Test 320px, iPhone SE and a notched device.

**Open questions:** Should the submit bar appear only after scrolling, or whenever there are more than three options?

### C33. The test plan contains stale and impossible assertions

**Relevant section:** §5.0; §5.3; §5.7; §5.8  
**Priority:** P0  
**Type:** Testing / delivery  
**Status:** Confirmed issue

**Description:** The plan requires a date test expecting `formatSlotInLondon('2026-07-04')` to return 1:00am, while current code correctly throws and existing tests cover the guard. It calls `db/polls.ts` and its tests net new although both exist. It requires a confirmation test for non-voters who cannot exist in the data model. It names `OptionCard` and `ResultsTable` while the component inventory names `AnswerRadioGroup` and `ResultsMatrix`.

**Rationale:** Tests are executable requirements; stale tests force incorrect code.

**Impact:** The test suite will either fail by design or pass against the wrong behaviour.

**Recommended action:** Rebuild the test matrix from the reconciled contracts and current repository. Keep the existing date-only rejection tests. Remove impossible non-voter tests and align component/file names.

**Open questions:** Which current poll tests are intended to be kept versus replaced?

### C34. End-to-end and database integration testing is treated as optional

**Relevant section:** §5.1; §5.7; §5.10  
**Priority:** P1  
**Type:** Testing  
**Status:** Confirmed issue

**Description:** E2E is optional even though the feature depends on dynamic routes, cookies, middleware headers, 404 status, server actions, external mail and multiple database constraints. Database tests mock Supabase and deliberately do not execute migrations or transaction behaviour.

**Rationale:** Unit mocks cannot catch route wiring, service-role permissions, Postgres constraints, RPC atomicity, cookies, headers or actual email payload integration.

**Impact:** A fully green unit suite can still ship a broken core journey.

**Recommended action:** Make two browser journeys and a local-Supabase integration suite release gates. Cover create→verify→vote→edit→close→confirm, plus failure/retry. Add migration smoke tests, webhook signature tests, accessibility checks and one controlled concurrency test.

**Open questions:** Can CI run Supabase locally? If not, what isolated integration environment is approved?

### C35. Monitoring and incident response are not defined

**Relevant section:** §3.8; §4.6; build order  
**Priority:** P1  
**Type:** Monitoring / operations  
**Status:** Confirmed issue

**Description:** Most failures only call `console.error`. There are no metrics or alerts for create/vote errors, rate-limit refusal, limiter outage, email queue depth, bounce/complaint rate, cron age, retention backlog, confirmation partial failure or database compensation failure.

**Rationale:** Several accepted best-effort paths fail after returning success. Without monitoring, “best effort” becomes “unknown”.

**Impact:** Silent missed mail, stuck deletion and prolonged outages.

**Recommended action:** Define a small operational scorecard and alerts before launch. At minimum: last successful retention run, expired backlog, outbox backlog/age, send failure rate, bounce/complaint rate, limiter health and action error rate. Name an owner and runbook.

**Open questions:** Which monitoring service is available? Who is on call for a failed retention sweep or email incident?

### C36. Deployment, migration and rollback steps are incomplete

**Relevant section:** §6; front-matter correction  
**Priority:** P1  
**Type:** Deployment / migration  
**Status:** Confirmed issue

**Description:** The build order still instructs editing an already-applied migration. There is no feature flag, environment validation gate, migration compatibility window, data backfill check, rollback path, staged mail mode, production smoke test or cron rollback step.

**Rationale:** Schema is already ahead of the application. Rollback must keep old code compatible with new columns, and email must not begin accidentally when keys appear.

**Impact:** Irreversible production drift or a launch that sends real messages during validation.

**Recommended action:** Create a release runbook: verify migration ledger and zero-row assumption; add follow-up migrations only; deploy dark behind a flag; use a mail sink/allowlist; smoke-test headers and routes; enable cron and mail separately; document rollback including manual cron handling.

**Open questions:** Is there a staging Supabase project? Can Resend be restricted to approved recipients during acceptance testing?

### C37. Production-host-only email blocks realistic staging tests

**Relevant section:** §4.0; §4.1; §5.10  
**Priority:** P2  
**Type:** Delivery / integration  
**Status:** Confirmed issue

**Description:** `sendPollEmail` refuses any base URL other than production, while manual QA requires real inbox tests. This forces testing from production or by bypassing the guard.

**Rationale:** Calendar, link and inbox testing should happen before production enablement.

**Impact:** Risky production testing or untested email paths.

**Recommended action:** Support an explicit non-production mail mode with an approved-recipient allowlist and a clear subject/banner. Keep arbitrary preview recipients blocked.

**Open questions:** Which addresses are approved for staging mail? Is a separate Resend test domain available?

### C38. The specification is too large to act as one source of truth

**Relevant section:** Entire document  
**Priority:** P2  
**Type:** Delivery / maintainability  
**Status:** Confirmed issue

**Description:** The document is 3,662 lines and contains product decisions, implementation pseudocode, current-repo observations, full email templates, tests and release notes. Corrections are layered on top rather than removing obsolete instructions.

**Rationale:** The size and repetition caused the contradictions found in this review.

**Impact:** Slow review, missed rulings and future drift.

**Recommended action:** After resolving blockers, split the contract into a short binding requirements/decision document and linked technical, email/privacy, test and release appendices. Give each fact one authoritative home.

**Open questions:** Who owns keeping the contract aligned after each phase?

---

## Optional improvements

### O01. Store hashes of capability tokens, not raw tokens

**Relevant section:** §3.2; migrations  
**Priority:** P2  
**Type:** Security hardening  
**Status:** Optional improvement

**Description:** All capability tokens are stored in clear text. A database or service-role leak immediately grants every poll permission.

**Rationale:** The server only needs to compare a presented token with a stable hash.

**Impact:** Clear-text storage increases the blast radius of a database leak.

**Recommended action:** Before real rows exist, consider storing SHA-256/HMAC token hashes and indexing those. Keep raw tokens only in the initial response/email. Provide purpose-specific token rotation for organiser and participant links if support needs it.

**Open questions:** Is token revocation/rotation required for a forwarded organiser link?

### O02. Reduce launch scope to slots and transactional mail

**Relevant section:** §1; §4; §6  
**Priority:** P2  
**Type:** Simplification  
**Status:** Optional improvement

**Description:** Date-only polls, digests, nudges, calendar updates and one-click unsubscribe create a large first release.

**Rationale:** The core value is create, vote, see results and confirm.

**Impact:** Keeping everything in launch increases delivery time and the number of coupled failure modes.

**Recommended action:** Consider launch scope of slots only, no digest/nudge, on-screen edit link, verified participant email only if confirmation mail is needed, and one durable confirmation outbox. Add the rest after observed use.

**Open questions:** Which email types are essential to validate the product?

### O03. Remove `confirm_sequence` until event updates exist

**Relevant section:** O7; §4.4 calendar attachment  
**Priority:** P3  
**Type:** Simplification  
**Status:** Optional improvement

**Description:** Confirmed is terminal, so one poll cannot issue an updated confirmed event. `confirm_sequence` therefore increments once and never serves the update behaviour used to justify it.

**Rationale:** The UID can remain stable without building an unsupported update workflow.

**Impact:** Minor schema and test complexity.

**Recommended action:** Keep a stable UID but omit sequence bookkeeping until reschedule/cancellation becomes a real feature. If it remains, correct the explanation so it does not imply reopening a confirmed poll.

**Open questions:** Is calendar cancellation/reschedule likely in the next release?

### O04. Add accessible copy controls for capability links

**Relevant section:** §2.2; §2.4  
**Priority:** P3  
**Type:** UX / accessibility  
**Status:** Optional improvement

**Description:** Selectable monospaced text is harder to use than a clear copy action and may not be keyboard-friendly.

**Rationale:** A client component can announce “Copied” through a local status region without adding a toast system.

**Impact:** Minor friction on the organiser's main task.

**Recommended action:** Add a copy button with fallback selection, keep the URL visible, and announce success in `aria-live="polite"`.

**Open questions:** Does the browser support baseline allow Clipboard API with a fallback?

### O05. Add participant self-service deletion

**Relevant section:** P2; O8; privacy notice  
**Priority:** P3  
**Type:** Privacy / product  
**Status:** Optional improvement

**Description:** A participant can edit but cannot delete their own response. They must contact Orange Jelly or the organiser.

**Rationale:** The edit token already grants access to exactly one participant row.

**Impact:** More manual rights requests and less control for participants.

**Recommended action:** Consider “Delete my response” on the edit route with a confirmation dialog. Clear the local device cookie at the same time.

**Open questions:** Should deletion notify the organiser or remain silent?

---

## Unresolved decisions

These decisions must be answered before the affected work begins:

| Decision | Needed by | Recommended default |
|---|---:|---|
| Dates, slots or both at launch | Before UI/data refactor | Slots only unless date-only demand is confirmed |
| Collect location | Before create form | Yes if calendar output is launch scope |
| Meaning of “If need be default on” | Before vote UI | Visible but unselected |
| Overnight slots | Before validation | Support with an end-date/next-day control |
| Participant email ownership control | Before any participant mail | Verify before contactable |
| Sole/joint controller and lawful basis | Before Phase 3 | Obtain privacy advice and complete an LIA |
| Maximum responders and send ceiling | Before email/outbox design | Set a supported hard limit |
| Email processing model | Before Phase 4 | Transactional outbox and asynchronous worker |
| Edit-token device convenience | Before vote UI | Do not auto-open personal answers on shared links |
| Resend domain, plan and quota reserve | Before Phase 2b | Separate poll sender if `auth.*` carries auth mail |
| Vercel/Upstash/Resend regions and retention | Before privacy sign-off | Record in a processor checklist |
| Cron ownership and alerts | Before Phase 5 | Named owner with a daily failure alert |

## Major risks

1. **Credential leakage:** analytics and vendor logs receiving bearer tokens from URL paths.
2. **Data loss:** non-transactional response replacement and compensation failure.
3. **Mail abuse:** arbitrary participant email addresses and no verified ownership.
4. **Partial notification:** synchronous fan-out timing out after confirmation commits.
5. **False assurance:** organiser copy saying everyone was told when only responders with addresses are known.
6. **Compliance error:** false Article 14/source wording and unreviewed controller/lawful-basis assumptions.
7. **Operational silence:** retention, digest and deliverability failures visible only in console logs.
8. **Build drift:** developers following stale instructions that conflict with committed code.

## Required changes before build approval

1. Reconcile the document to the current repository and migration state.
2. Resolve the creation scope, default answer behaviour, overnight slots and `closes_at` meaning.
3. Define the resend, verification return, edit, calendar download, unsubscribe and 404 contracts.
4. Design a minimal third-party-free layout for token routes, plus noindex headers.
5. Replace compensating multi-write flows with transactions and use a durable email outbox.
6. Decide how participant email ownership is proved before mail is sent.
7. Correct the recipient claim to responders with verified email plus organiser.
8. Obtain privacy review and replace the Article 14/source wording.
9. Fix the migration/type mismatch for `confirm_notify_failures` and strengthen cross-poll integrity.
10. Rebuild the test plan and make browser plus database integration tests release gates.
11. Add webhook-based delivery monitoring, suppression, cron health and alerts.
12. Add a staged deployment and rollback runbook.

## Recommended next steps

1. Hold a short decision review for the unresolved product and privacy questions above.
2. Publish a small errata/decision record and update only the binding parts of the specification.
3. Apply any follow-up schema corrections while the poll tables are empty.
4. Implement one thin vertical slice behind a feature flag: create, verify, vote and results, with mail restricted to approved test recipients.
5. Add transactional RPCs/outbox and the minimal token-safe layout before production mail.
6. Complete privacy, security and accessibility review before Phase 3 is exposed publicly.
7. Run browser, local-database, real-inbox and cron failure tests before enabling the feature.

