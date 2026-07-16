# Availability Poll — Implementation Spec

**Status:** approved to build. Phase 0 done; **Phase 1 done — the base migration is applied to production**. This document is the build contract for Phases 2–5.

> **Correction applied 16 July 2026, after assembly.** This document was drafted while `20260716150000_availability_polls.sql` was still unapplied, and three places said so. It has since been applied to the live project (`miqqkllqfyvaomzgujed`) and verified: the composite foreign keys were proven against the real database in a rolled-back transaction, rejecting a cross-poll vote and accepting a legitimate one. **Every column addition this document calls for is therefore a follow-up `alter table` migration, not an edit to that file.** They are gathered into `20260716160000_availability_polls_email_columns.sql`, which is also applied. Where the text below says "not yet applied" or "still editable", read this note instead.
**Date:** 16 July 2026
**Scope source:** `/Users/peterpitcher/Cursor/OJ-OrangeJelly.co.uk/tasks/availability-poll/SCOPE.md` is the source for **WHAT** and **WHY** — the product case, the licence analysis, the data model rationale, the delivery plan and the decisions. **This document is HOW.** Where the two disagree on a fact about the repo, this document wins, because it was written against the live code. Where they disagree on a product decision, SCOPE.md wins.

## What this is

A page on orangejelly.co.uk where you put up to eight dates or time slots, get one link, and send it to whoever you need an answer from.
They tap Yes, If need be, or No against each option on their phone. No account, no app, nothing to download.
You get a private link showing who can make what, and a public link you share.
When you pick a time, everyone who gave an email address gets told, with the time written out in words and a calendar file attached.
Nobody logs in. Holding the link is what gives you permission — so the private link stays private.
The whole poll and everyone's answers are deleted 60 days after the last date on it.

## Decisions this spec assumes

Taken from SCOPE.md §"Decisions taken — 16 July 2026". These are settled. If any of them is reversed, this document changes.

1. **Build it in-repo**, from scratch. Not Rallly Cloud Pro. The branding and the URL are the point, and the ~£6–12k capacity cost is accepted against that.
2. **The GPL/AGPL gate is upheld.** No AGPL or GPL code enters this repo. Rallly, Crab.fit, Nextcloud Polls, jawanndenn, Dudle, CabbageMeet and Easy!Appointments are all out. Parachute (MIT) may be read as a reference for grid logic only. Crab.fit's source is not to be read with intent to copy.
3. **Orange Jelly is the controller**, not a processor. It is OJ's tool, on OJ's site, and OJ decides the purpose. This is what the privacy notice says.
4. **Aggregate counts only during voting** — never per-person votes to participants. This shapes the data model and it is not configurable.
5. **Hard cap of 8 options.** Enforced in the UI and again in `createPoll`.
6. **Poll mail goes out on an Orange Jelly sending domain, but Phase 2a lands first.** Organiser verification and rate limiting ship before any poll mail does.
7. **`db/migrations/` and `scripts/migrate-db.ts` are deleted** (`89e7ef2a`). `pg`, `DATABASE_URL` and `DATABASE_SSL` are retained — `src/lib/db/client.ts` uses them for the app's Postgres fallback client.
8. **Retention window is 60 days** after the last response or the last option date, whichever is later. This is the documented basis for `polls.expires_at` and for the privacy notice.

## Contents

- [Reconciled — binding rulings](#reconciled--binding-rulings) — **read this first.** Where the sections below disagree, this list wins.
- [1. User stories, acceptance criteria, state machine](#1-user-stories-acceptance-criteria-state-machine)
- [2. Screen-by-screen UI spec](#2-screen-by-screen-ui-spec)
- [3. Server actions, validation, errors, security](#3-server-actions-validation-errors-security)
- [4. Email specification](#4-email-specification)
- [5. Test plan](#5-test-plan)
- [6. Build order](#6-build-order)
- [7. Open questions](#7-open-questions)

---

## Reconciled — binding rulings

The five sections below were written independently and verified independently. They disagree in seventeen places. **Each ruling below is binding and overrides whatever the section text says.** Everything not listed here is as the sections state.

| # | The disagreement | Ruling — this wins |
|---|---|---|
| **R1** | §3 specifies `closePoll(organiserToken)`, one-way. §1 replaces it with `setPollOpen(organiserToken, open: boolean)`. §5's state machine lists `closed → open` as **illegal**. | **`setPollOpen(organiserToken, open: boolean)`.** §1 is authoritative on behaviour, and SCOPE.md §4.7 says "close poll" without saying it is irreversible. `closed → open` is a **legal** edge in `poll-state.ts`; §5's `it('should refuse the move when a closed poll is reopened')` becomes `it('should allow the move when a closed poll is reopened')`. Everywhere §3 and §5 say `closePoll`, read `setPollOpen`. |
| **R2** | §1 and §4 require a third poll-level `verify_token`. §3 reuses `organiser_token` as the magic link. | **A separate `verify_token`.** The verify URL is the one that lands in an unverified inbox; putting the organiser token in it puts admin capability in the most-forwarded email in the feature. `polls` gains `verify_token text unique` and `verify_token_expires_at timestamptz`, both nullable, both nulled on verification so the link is single-use. |
| **R3** | §2 says the `[token]` on `/availability/verify/[token]` is the organiser token. | **It is the `verify_token`.** Follows from R2. §2's verify screen resolves by `verify_token` and renders the participant and organiser links from the resolved row. |
| **R4** | §2 labels the middle state **"If needed"**. §1 and §4 label it **"If need be"**. | **"If need be"**, everywhere, in every label, glyph legend, email and count. The wire value stays `'if_need_be'`. |
| **R5** | §2 says `poll_participants.email` is not collected in Phase 1. §1 (P1.8/P1.9) and §3 (`submitResponseSchema`) collect it as optional. | **Collected, optional.** Without it there is no edit-link email and no confirmation fan-out to participants, which are both in SCOPE.md §4. |
| **R6** | §2's `ClosePollControl` guards confirm with `where status = 'open'`. §3 guards with `where status in ('open','closed')`. | **`status in ('open','closed')`.** A closed poll must still be confirmable — that is the normal flow. |
| **R7** | §1 §0 says the poll UI uses `src/components/ui/button.tsx` throughout. §2 says use the legacy `ButtonAdapter` (`@/components/Button`). | **The legacy adapter, `import Button from '@/components/Button'`.** §2 carries the evidence: shadcn `--primary` is charcoal not orange, and shadcn `size="default"` is 36px against the site's own 44px tap-target rule. |
| **R8** | §1 (P3.7) and §2 require `revalidatePath`. §3 (Departure 3) forbids it. | **Call it.** Every `/availability/*` dynamic route is `force-dynamic`, so it is belt-and-braces — but the behaviour must not depend on a single `dynamic` export surviving a refactor. §5 mocks `next/cache` and asserts it. |
| **R9** | §2's vote form sets `maxLength={80}` on the participant name. §1, §3 and the shared rule say **50**. | **50.** `VALIDATION_MESSAGES.name.maxLength` says "less than 50 characters" and it must not become a lie. |
| **R10** | §1 (O1.13) uses `'Too many polls from this connection. Try again in an hour.'` §3 uses one uniform string. | **`'Too many attempts. Please try again in a few minutes.'`**, identical on every action and every bucket. Naming the bucket tells an attacker which limit they hit. |
| **R11** | §2 says participants see **no** per-option counts during voting. §1 (P1.6, P3.1) and SCOPE.md decision 3 say they see **aggregate counts**. | **Aggregate counts are shown.** "Aggregate only" means *counts and not names*, not *nothing*. §2's "no counts" reading is wrong. §1's copy applies, including the zero-response empty state. |
| **R12** | §1 §0 specifies a hand-rolled RFC 5545 generator at `src/lib/ics.ts`. §4 specifies the `ics` npm package (ISC) under `src/lib/poll-emails/`. | **The `ics` npm package.** ISC passes the licence gate; line folding at 75 octets, `\r\n` endings and `SUMMARY`/`DESCRIPTION` escaping are exactly what breaks silently in Outlook. There is no `src/lib/ics.ts`. |
| **R13** | §3 defines `sendPollEmail` with no `attachments`. §4 defines it with `attachments` and `headers`. | **One signature, §4's:** `{ to, subject, html, text, replyTo?, attachments?, headers? }`. Phase 2 simply passes neither optional field. Do not ship two signatures. |
| **R14** | §5's test plan assumes `checkRateLimit(key: string)`. §3 defines `checkRateLimit(bucket: RateLimitBucket, key: string)`. | **§3's two-argument form.** §5's mock factory takes both. |
| **R15** | §1 (O2.3) makes the verify link idempotent and non-consuming. §4 makes it single-use with a 24-hour expiry. | **Single-use, 24-hour expiry, and idempotent within the same render.** The route nulls the token in the same conditional update that flips `draft → open`, then re-reads the poll by `id` and renders the links. A second click on the same link therefore 404s — so the success page shows both links on screen, and the links email (§4) is what the organiser keeps. §1's "click it twice" case is served by the links email, not by the verify URL. |
| **R16** | §1 (E1) says the confirm fan-out on a zero-response poll is a normal one-recipient send. §4's recipient builder seeds the organiser first. | **No conflict — recorded so nobody "fixes" it.** The recipient set is never empty: `polls.organiser_email` is `not null` and verified. |
| **R17** | §3 numbers its email section 9 and its test section 10; §4 numbers `sendPollEmail`'s home differently. | **Cosmetic.** `sendPollEmail` and `sendPollEmails` live in `src/lib/email.ts`. The template builders live in `src/lib/poll-emails/`. |

---

## 1. User stories, acceptance criteria, state machine

This section is authoritative on **behaviour**. Where it names a route, action, table or component, those are the ones set out in §5 and §6 of `SCOPE.md`. Anything not already in the repo is marked **NET NEW** and named with its file path.

Two vocabulary rules apply throughout and are load-bearing for the copy:

- The three response states are **Yes**, **If need be**, **No**. Stored as `'yes' | 'if_need_be' | 'no'` in `poll_responses.availability`. Rendered as glyph + text, never colour alone (`✓ Yes`, `~ If need be`, `✗ No`).
- All times display in Europe/London and say so on screen. No detection, no conversion, no offsets.

---

### 1.0 Repo facts this section depends on — verified, not assumed

A developer implementing from this section will hit all of these. They are stated here once rather than repeated.

| Fact | Evidence | Consequence for the build |
|---|---|---|
| **Primary keys have no database default.** `id uuid primary key` on `polls`, `poll_options`, `poll_participants`, `poll_responses` — no `gen_random_uuid()`. | `supabase/migrations/20260716150000_availability_polls.sql` | Every insert must supply `id`. Use `randomUUID()` from node `crypto`, matching the lead-data layer. Omitting `id` is a not-null violation, not a silent default. |
| **`formatSlotInLondon` does not reject a date-only value.** It throws only on `NaN`. | `src/lib/dateUtils.ts` — `formatSlotInLondon` does `new Date(instant)` then a NaN check; `assertIsoDate` (with the "Expected a date-only value…" message) is reached only from `formatDateInLondon` and `londonWallClockToInstant`. | The type split guards the *date* direction, **not** the *slot* direction. See E17 — this needs an application-level guard, and it is the single highest-risk defect in the feature. |
| **No `chart` colour exists in Tailwind.** `--chart-1`…`--chart-5` are raw CSS custom properties only. | `src/app/globals.css:594-602`; `tailwind.config.js` `theme.extend.colors` has no `chart` key | `bg-chart-1` renders nothing. Use `style={{ backgroundColor: 'hsl(var(--chart-1))' }}`, or add the tokens to `tailwind.config.js` first. |
| **`ui/progress` cannot be recoloured or segmented by prop.** The Indicator is hardcoded `bg-primary`; `className` lands on the Root; `value` is a single number. | `src/components/ui/progress.tsx` | It cannot render a three-segment Yes/If-need-be/No bar. See O3.4. |
| **`ui/table`'s `Table` hides its scroll container.** It wraps the `<table>` in `<div className="relative w-full overflow-auto">` and passes `className` to the `<table>`. | `src/components/ui/table.tsx` | The wrapper takes no `tabindex`, no `role`, no accessible name. See O3.3. |
| **`FormMessage` is field-scoped.** It calls `useFormField` and needs a `FormField`/`FormItem` ancestor. | `src/components/ui/form.tsx` | Form-level errors need their own `role="alert"` region. |
| **`src/lib/email.ts` cannot address a recipient.** It exports `escapeHtml` and `sendLeadNotification` only; the recipient is resolved internally from `CONTACT_NOTIFICATION_EMAIL`. | `src/lib/email.ts`; `SCOPE.md` §6 | **NET NEW:** add `sendPollEmail`, taking a required `to: string`, before any poll mail is built. Keep the plain-text part and reply-to. |
| **No rate limiting exists anywhere.** | grep over `src/`; `SCOPE.md` §6 | **NET NEW:** `src/lib/rate-limit.ts` (Upstash), Phase 2a, before any poll mail ships. |
| **No `revalidatePath` call exists anywhere.** | grep over `src/` | See P3.7 — no in-repo precedent to copy. |
| **No `.ics` library.** | `package.json` | **NET NEW:** the `ics` npm package (ISC), per **R12**. Emit `DTSTART`/`DTEND` as UTC instants (`…Z`), never floating local times. |
| **Two `Button` components with incompatible APIs.** `src/components/Button.tsx` (`variant="primary\|secondary\|ghost\|outline"`, `href`, `loading`) and `src/components/ui/button.tsx` (`variant="default\|destructive\|outline\|secondary\|ghost\|link"`, `size`, `asChild`). | both files | **Per R7, the poll UI uses the legacy adapter `@/components/Button` throughout.** Say which one; do not let a developer guess. |
| **`check-growth-language.mjs` checks this file at commit; `check-british-english.mjs` does not check it or the poll UI.** The growth script has no path filter and takes lint-staged's CLI args (`*.{js,jsx,ts,tsx,json,md}`); the British script's `shouldCheckCliPath` drops anything outside `content/` or its six `FILE_TARGETS`. | `scripts/check-growth-language.mjs`; `scripts/check-british-english.mjs`; `package.json` `lint-staged` | Never spell the banned verb or its inflections in this document or in any staged file. British spelling in `src/app/availability/*` is **unenforced** — maintain it by hand, or add the path to the British script in Phase 2 (recommended). |

**Time-rendering rules — use these exact compositions.** `LONG_DATE` is `'EEEE, d MMMM yyyy'`, so a comma follows the weekday. There is no helper that appends "UK time"; compose it.

| Need | Composition | Output |
|---|---|---|
| A date-only option | `formatDateInLondon(option_date, 'long')` | `Saturday, 4 July 2026` |
| A slot option (single instant) | `formatSlotInLondon(starts_at)` | `Tuesday, 14 July 2026 at 2:00pm` |
| A slot option (range) | `formatSlotRangeInLondon(starts_at, ends_at)` | `Tuesday, 14 July 2026, 2:00pm – 4:00pm` |
| A confirmed time, in prose | `` `${formatSlotRangeInLondon(s, e)} UK time` `` (slots) or `` `${formatDateInLondon(d, 'long')} (all day) UK time` `` (dates) | `Tuesday, 14 July 2026, 2:00pm – 4:00pm UK time` |
| A participant's response date | `formatDateInLondon(toLocalIsoDate(created_at), 'short')` | `Fri 3 Jul` — never `formatSlotInLondon`, which would add a meaningless time |

---

### 1.1 Roles

| Role | Identity | Capability comes from | Accounts? |
|---|---|---|---|
| **Organiser** | An email address, proven once by magic link | `polls.organiser_token` in the URL | No account. Verification only. |
| **Participant** | A self-asserted `display_name`. Optionally an email they type themselves. | `polls.participant_token` to vote; their own `poll_participants.edit_token` to change a vote | No account. Ever. |

Identity is not authenticated for either role. Possession of the token *is* the permission. This is the deliberate trade-off for a no-login tool, and the organiser email says so in plain words.

---

### 1.2 Organiser stories

#### US-O1 — Build a poll

> **As an** organiser, **I want** to propose up to 8 dates or time slots under a title, **so that** I can find a time that works without a chain of emails.

| # | Acceptance criterion |
|---|---|
| O1.1 | **Given** I am on `/availability/new`, **when** the page loads, **then** I see fields for title (required), description (optional), location (optional), my name (required), my email (required), a date-or-slots choice, and an option builder starting with one empty option. |
| O1.2 | **Given** the option builder holds 8 options, **when** I look for "Add another option", **then** the button is `disabled` and helper text reads "8 options is the limit — fewer options gets you more honest answers." The cap is enforced again in `createPoll` and a 9th option returns `{ error: VALIDATION_MESSAGES.poll.tooManyOptions }`. |
| O1.3 | **Given** I have fewer than 2 options, **when** I press "Publish poll", **then** submission is refused and no row is written. This is a **form-level** error, not a field error: `FormMessage` requires a `FormField` context and cannot carry it. Render it in a dedicated `<div role="alert">` above the submit control, with the text `VALIDATION_MESSAGES.poll.tooFewOptions`. Two is the floor; a one-option poll is an announcement, not a poll. |
| O1.4 | **Given** I chose date-only options, **when** the poll is stored, **then** each `poll_options` row has `option_date` set and `starts_at`/`ends_at` null, and `polls.option_kind = 'dates'`. |
| O1.5 | **Given** I chose slot options, **when** the poll is stored, **then** each row has `starts_at`/`ends_at` set and `option_date` null, and `polls.option_kind = 'slots'`. Mixing kinds within one poll is impossible in the UI and rejected by `poll_options_shape_chk`. |
| O1.6 | **Given** a slot whose end is at or before its start, **when** I submit, **then** validation refuses it before any write, with `VALIDATION_MESSAGES.poll.slotEndBeforeStart`. Backstopped by the `ends_at > starts_at` clause inside `poll_options_shape_chk`. |
| O1.7 | **Given** I enter a slot at a time that does not exist on that date in Europe/London (the spring-forward gap), **when** I submit, **then** `londonWallClockToInstant` throws, `createPoll` catches it and returns `{ error: err.message }` — verbatim, which is exactly: `"02:30 does not exist on 2026-03-29 in Europe/London — the clocks go forward and that hour is skipped. Choose a different time."` No unhandled exception reaches the page. |
| O1.8 | **Given** two options resolve to the same date (dates poll) or the same start instant (slots poll), **when** I submit, **then** it is refused with `VALIDATION_MESSAGES.poll.duplicateOption` ("You've proposed the same time twice."). Compared after conversion, on the resolved value, not on the raw input. |
| O1.9 | **Given** the honeypot `website` field is filled, **when** I submit, **then** `createPoll` returns `{ success: true }` and writes nothing. Copy `src/app/actions/contact.ts` exactly — the short-circuit is the first statement in the action, before validation. |
| O1.10 | **Given** a valid submission, **when** it succeeds, **then** exactly one `polls` row exists with `status = 'draft'`, `email_verified_at` null, `timezone = 'Europe/London'`, and three independent tokens (`participant_token`, `organiser_token`, `verify_token` — each ≥128 bits CSPRNG, base64url, none derivable from another or from `id`), and `expires_at` set per US-O9. **The application generates every `id`** — `randomUUID()` for the poll and for each option — because no table carries a database default. |
| O1.11 | **Given** the poll is stored, **when** the page re-renders, **then** I see a `role="status" aria-live="polite"` block reading "Check your email. Your poll goes live once you confirm the address." **No token appears on this screen.** The links only exist in the email. |
| O1.12 | **Given** the poll is stored but Resend fails or is unconfigured, **when** I finish, **then** I still get O1.11's success state, and `console.error('[polls] Poll stored but verification email not sent: …')` is written. Store first, notify best-effort — the `contact.ts` philosophy exactly. The poll is recoverable: a repeat `createPoll` from the same email is allowed (there is no uniqueness on `organiser_email`). |
| O1.13 | **Given** I am rate limited, **when** I submit, **then** I get `{ error: 'Too many attempts. Please try again in a few minutes.' }` (per **R10**) and nothing is written. **NET NEW:** `src/lib/rate-limit.ts` (Upstash), per IP, Phase 2a. It does not exist today and there is no rate limiting anywhere in the codebase to copy. Ships before any poll mail does. |

**NET NEW — `VALIDATION_MESSAGES.poll` keys.** `src/lib/validation-messages.ts` has no poll, option, slot, date or availability keys today, and `SCOPE.md` §8 forbids inlining validation copy. Add exactly these:

```ts
poll: {
  titleRequired: 'Give your poll a title',
  tooFewOptions: 'Propose at least two options — one option is an announcement, not a poll',
  tooManyOptions: '8 options is the limit',
  duplicateOption: "You've proposed the same time twice",
  slotEndBeforeStart: 'The end time must be after the start time',
  answerEveryOption: "Give an answer for every option — 'No' is a perfectly good answer",
  votingClosed: 'Voting has closed on this poll',
  alreadyConfirmed: 'This poll is already confirmed',
  responsesLocked: 'This poll is confirmed. Responses are locked',
},
```

**Field limits.** Participant and organiser names reuse the existing rule: minimum 2, **maximum 50**, per `src/lib/validation.ts` and `VALIDATION_MESSAGES.name.maxLength` ("Name must be less than 50 characters"). Do not invent a different cap for polls — it would make the shared message a lie.

#### US-O2 — Confirm my email and take the poll live

> **As an** organiser, **I want** to prove my email address once, **so that** nobody can use the site to send mail in my name.

| # | Acceptance criterion |
|---|---|
| O2.1 | **Given** a `draft` poll, **when** I open `/availability/verify/[verify_token]` with the correct magic-link token, **then** `email_verified_at` is set to `now()`, `status` becomes `'open'`, and I am shown the participant link **and** the organiser link, clearly separated and labelled. |
| O2.2 | **Given** the verify page, **when** it renders the two links, **then** the participant link is presented as "Send this one to your guests" and the organiser link as "Keep this one. Anyone who has it can close the poll and confirm the time." The forwarded-link risk is stated, not hidden. |
| O2.3 | **Given** the verify link, **when** it has already been used, **then** per **R15** it is single-use and 24-hour-expiring: the conditional update (`set email_verified_at = now(), status = 'open', verify_token = null, verify_token_expires_at = null where verify_token = $1 and status = 'draft'`) matches once, and a second click gets the "not live" page. The organiser keeps their links from the links email (§4), which is sent immediately on verification, and from the verify page itself. It **never** reverts `closed`/`confirmed` to `open`. |
| O2.4 | **Given** an unknown, malformed, expired or deleted verify token, **when** I open the page, **then** I get the shared "This link isn't live any more" page (US-P5) and a 404 status. The response is byte-identical whether the token never existed or has been consumed — no oracle. |
| O2.5 | **Given** an unverified `draft` poll, **when** anyone opens its participant link, **then** they see the same "not live" page. A draft is invisible to the world. |
| O2.6 | **Given** the verify link, **when** it is compared with `participant_token`/`organiser_token`, **then** it is neither — it is a third independent value. **NET NEW:** `verify_token text unique` and `verify_token_expires_at timestamptz` on `polls`, generated by `generateToken()`. Added by the follow-up migration `20260716160000_availability_polls_email_columns.sql` — see the correction in the front matter; the base migration is applied and no longer editable. Reusing `organiser_token` as the magic link would put the organiser token in the one email most likely to be forwarded on. |

#### US-O3 — Watch the results come in

> **As an** organiser, **I want** to see who said what against every option, **so that** I can pick the time with the least damage.

| # | Acceptance criterion |
|---|---|
| O3.1 | **Given** an `open` poll with responses, **when** I open `/availability/o/[token]`, **then** I see a semantic `<table>` — participants as rows, options as columns, with `<thead>`, `<th scope="col">` on options, `<th scope="row">` on names, and a `<tfoot>` carrying the per-option totals. No `role="grid"`. |
| O3.2 | **Given** the matrix, **when** a screen reader reaches any cell, **then** its accessible name is self-contained and position-independent — e.g. "Peter, Tuesday, 14 July 2026 at 2:00pm, if need be". Built from the composition table in §1.0, never by hand. |
| O3.3 | **Given** the matrix on a 320px viewport, **when** I view it, **then** it sits in a scroll container that is `overflow-x: auto` **and** carries `tabIndex={0}` **and** `role="region"` **and** `aria-label="Poll results"`, with `position: sticky` on the header row and the first column. **`ui/table`'s `Table` cannot do this** — it hard-wraps the table in a bare `<div className="relative w-full overflow-auto">` and routes `className` to the `<table>`, leaving the wrapper unreachable. Build the matrix from `<table>`/`<thead>`/`<tbody>`/`<tfoot>` directly inside your own labelled container, or lift `Table` first. Do not pretend `ui/table` covers it. A scrolling *data table* is WCAG 1.4.10's named exception; the participant form is not, and never scrolls sideways. |
| O3.4 | **Given** per-option totals, **when** they render, **then** each column foots with counts for Yes / If need be / No **as text first** ("4 yes · 1 if need be · 2 no"), plus a proportional bar. **The bar is not `ui/progress`.** `ui/progress` hardcodes `bg-primary` on its Indicator, accepts a single `value`, and exposes no way to segment or recolour — it physically cannot show three shares. Build a plain three-`<div>` flex bar with `aria-hidden="true"` (the text above it is the accessible version), widths as percentages, and colours applied inline: `hsl(var(--chart-3))` for Yes, `hsl(var(--chart-4))` for If need be, `hsl(var(--chart-1))` for No. **Do not write `bg-chart-3`** — `tailwind.config.js` has no `chart` colour key; the variables exist only as raw CSS at `globals.css:594-602`. Adding the tokens to `tailwind.config.js` is an acceptable alternative, but it is a change, not a given. |
| O3.5 | **Given** totals, **when** the best option is picked out, **then** it is ranked by (Yes count desc, If-need-be count desc, `position` asc) and marked with a `Badge` **and** the words "Best so far" — never colour alone. |
| O3.6 | **Given** a tie on that ranking, **when** the page renders, **then** every tied option carries the badge. No arbitrary winner. |
| O3.7 | **Given** an `open` poll with zero responses, **when** I open the organiser view, **then** I see an empty state: "Nobody has voted yet. Here's your participant link again — [link] — and a nudge is usually all it takes." Never a blank table. |
| O3.8 | **Given** any organiser page, **when** the response headers are set, **then** `Referrer-Policy: no-referrer` is present and no third-party resource is requested. |
| O3.9 | **Given** every option has zero Yes **and** zero If-need-be responses, **when** the page renders, **then** **no option carries the "Best so far" badge.** The badge is suppressed entirely unless at least one option has `yes + if_need_be > 0`. Without this rule O3.6 makes every option tie and every option a winner — see E2. This is the badge's only suppression condition; it is stated once, here, and E2 refers to it rather than restating it. |

#### US-O4 — Remove a response

> **As an** organiser, **I want** to delete a row, **so that** a test entry or a duplicate does not distort the picture.

| # | Acceptance criterion |
|---|---|
| O4.1 | **Given** a response row, **when** I press "Delete this response", **then** a `Dialog` confirms with the participant's name spelled out before anything is deleted. |
| O4.2 | **Given** I confirm, **when** `deleteResponse(organiserToken, participantId)` runs, **then** the `poll_participants` row is deleted and its `poll_responses` go with it via the `on delete cascade` on `poll_responses_participant_fk`. Totals recompute on the next render (`revalidatePath` — see US-P3.7). |
| O4.3 | **Given** a `participantId` belonging to a different poll, **when** the action runs, **then** it returns `{ error: … }` and deletes nothing. The action resolves the poll from the token first, then scopes the delete `where id = $participantId and poll_id = $resolvedPollId`. Never trust an id from the client. |
| O4.4 | **Given** the poll is `confirmed`, **when** I try to delete a response, **then** the control is not rendered **and** the action re-reads `status` and returns `{ error: VALIDATION_MESSAGES.poll.responsesLocked }`. UI hiding is never the control. |

#### US-O5 — Close the poll

> **As an** organiser, **I want** to stop new votes, **so that** the picture stops shifting while I decide.

| # | Acceptance criterion |
|---|---|
| O5.1 | **Given** an `open` poll, **when** I press "Close the poll", **then** `setPollOpen(organiserToken, false)` sets `status = 'closed'` and `closes_at = now()`, and existing responses are untouched. |
| O5.2 | **Given** a `closed` poll, **when** I look at the organiser view, **then** I see everything I saw when it was open, plus a "Reopen the poll" control and a banner reading "Closed — nobody can vote or change their answer." |
| O5.3 | **Given** a `closed` poll, **when** I press "Reopen the poll", **then** `setPollOpen(organiserToken, true)` sets `status = 'open'` and `closes_at = null`. Closing is reversible; confirming is not. |
| O5.4 | **Given** a `draft` or `confirmed` poll, **when** `setPollOpen` is called in either direction, **then** it returns `{ error: … }` and changes nothing. You cannot close what was never open, and you cannot reopen what is confirmed. |

**Signature note — a correction to `SCOPE.md` §6, and binding per R1.** §6 lists `closePoll(organiserToken)` only, with no way to reverse it; "closePoll reversed" is not an implementable instruction. Replace it with one explicit action:

```ts
setPollOpen(organiserToken: string, open: boolean): Promise<{ success?: boolean; error?: string }>
```

It refuses unless the current status is the opposite of the target (`open === true` requires `'closed'`; `open === false` requires `'open'`), re-read inside the action.

#### US-O6 — Confirm the time

> **As an** organiser, **I want** to commit to one option and tell everybody, **so that** the coordination actually ends.

| # | Acceptance criterion |
|---|---|
| O6.1 | **Given** an `open` or `closed` poll, **when** I press "Confirm this time" on an option, **then** a `Dialog` restates the time in full words plus timezone — "Tuesday, 14 July 2026, 2:00pm – 4:00pm UK time", per the composition table in §1.0 — and warns: "This locks the poll. You can't undo it from here." |
| O6.2 | **Given** I confirm, **when** `confirmOption(organiserToken, optionId)` runs, **then** `status` becomes `'confirmed'`, `confirmed_option_id` is set, and `closes_at` is set to `now()` **only if it was null**. A poll confirmed from `closed` keeps its original close time. |
| O6.3 | **Given** an `optionId` from another poll, **when** the action runs, **then** it returns `{ error: … }`. Scoped `where id = $optionId and poll_id = $resolvedPollId`. Note `polls_confirmed_option_fk` is a **simple** FK to `poll_options(id)`, not a composite one, so the database will **not** catch this — the check is the only control. |
| O6.4 | **Given** confirmation succeeds, **when** the fan-out fires, **then** the recipient set is: **every `poll_participants.email` that is not null, plus `polls.organiser_email`**, de-duplicated case-insensitively. That includes people who never voted. Non-voters still need to know, and the organiser gets their own copy so they have the same `.ics` everyone else has. |
| O6.5 | **Given** the fan-out email, **when** it is composed, **then** it carries the time in words + "UK time", an `.ics` attachment, Add-to-Google and Add-to-Outlook links, and every user-supplied string passes through `escapeHtml()` from `src/lib/email.ts`. **NET NEW, both blocking:** (a) `sendLeadNotification` takes no `to` and resolves its recipient internally — add `sendPollEmail` to `src/lib/email.ts` accepting a required `to: string`, keeping the plain-text part and reply-to; (b) no `.ics` library exists — add the `ics` npm package (per **R12**), emitting `DTSTART`/`DTEND` as UTC instants with a trailing `Z`, never floating local times. |
| O6.6 | **Given** the fan-out throws or Resend rejects, **when** the action returns, **then** it still returns `{ success: true }` — the poll is confirmed in the database and a failed email must never un-confirm it. `console.error('[polls] Confirmed but fan-out failed: …')`. The organiser page then shows a `<div role="status" aria-live="polite">` reading "Confirmed. Some notifications didn't get through — the link below has the details to share by hand." Not `Alert`: `ui/alert.tsx` hardcodes `role="alert"`, which is assertive and interrupts, and this is a post-hoc status, not an urgent one. |
| O6.7 | **Given** an already-`confirmed` poll, **when** `confirmOption` runs again, **then** it returns `{ error: VALIDATION_MESSAGES.poll.alreadyConfirmed }` and does **not** re-send the fan-out. Guard against a double-tap re-mailing twenty people. |
| O6.8 | **Given** a `draft` poll, **when** `confirmOption` runs, **then** it returns `{ error: … }`. |

#### US-O7 — Change my mind after confirming

> **As an** organiser, **I want** a route out when the confirmed time falls through, **so that** I am not stuck with a dead poll.

| # | Acceptance criterion |
|---|---|
| O7.1 | **Given** a `confirmed` poll, **when** I look for a "Reopen" or "Un-confirm" control, **then** **there isn't one.** `confirmed` is terminal. Twenty people have it in their calendar; silently unwinding that is worse than the problem. |
| O7.2 | **Given** a `confirmed` poll, **when** I open the organiser view, **then** I see: "Confirmed for Tuesday, 14 July 2026, 2:00pm – 4:00pm UK time. If it falls through, tell people yourself and build a fresh poll — we won't quietly move a date that's already in their calendar." with a "Build a fresh poll" button linking to `/availability/new`. |
| O7.3 | **Given** a `confirmed` poll, **when** I press "Delete this poll", **then** that route stays open (US-O8). Deleting is honest; silently reopening is not. |
| O7.4 | **Given** "Build a fresh poll" from a confirmed poll, **when** the form loads, **then** it is empty. No copy-forward — that is templates, and templates are explicitly out of scope. |

#### US-O8 — Delete the poll

> **As an** organiser, **I want** to remove the whole thing, **so that** I can honour a request to erase data without waiting 60 days.

| # | Acceptance criterion |
|---|---|
| O8.1 | **Given** any state, **when** I press "Delete this poll", **then** a `Dialog` requires a second confirmation and states "This removes every response too. It cannot be undone." |
| O8.2 | **Given** I confirm, **when** `deletePoll(organiserToken)` runs, **then** the `polls` row is deleted and `poll_options`, `poll_participants` and `poll_responses` cascade. No soft delete, no tombstone. This is a GDPR erasure path and must be a real deletion. Note `polls_confirmed_option_fk` is `on delete set null`, not cascade — it points from `polls` to `poll_options`, so it never obstructs the poll's own deletion. |
| O8.3 | **Given** the poll is deleted, **when** anyone opens any of its links — participant, organiser, verify or edit — **then** they see the "not live" page (US-P5) with a 404. Identical to a token that never existed. |

#### US-O9 — Know how long the data lives

> **As an** organiser, **I want** the poll to clear itself away, **so that** I am not holding other people's data indefinitely.

| # | Acceptance criterion |
|---|---|
| O9.1 | **Given** a poll is created, **when** `expires_at` is computed, **then** it is **60 days after the later of: the last option's date/end instant, and `now()`**. `expires_at` is `not null`, so it must be supplied on insert. |
| O9.2 | **Given** any response is inserted or updated, **when** the write commits, **then** `expires_at` is recomputed as 60 days after the later of `now()` and the last option's date/end instant. Options are immutable once the poll is published, so this only ever moves forward. "60 days after the last response or the last option date, whichever is later." |
| O9.3 | **Given** a date-only poll, **when** `expires_at` is derived from the last `option_date`, **then** that date is anchored at the end of that London day via `londonWallClockToInstant(lastOptionDate, '23:59')` plus 59 999 ms. A `date` is never handed to a timezone conversion as if it were an instant, and `formatSlotInLondon` is never called on one. 23:59 is never inside the spring-forward gap, so this call cannot throw. |
| O9.4 | **Given** the Phase 5 cron sweep runs, **when** it finds polls with `expires_at < now()`, **then** they are deleted with the same cascade as US-O8. |
| O9.5 | **Given** any poll page or invitation email, **when** it renders, **then** it states the retention window in plain words: "This poll and everyone's answers are deleted 60 days after the last date on it." |
| O9.6 | **Given** the retention sweep has not yet run (it is periodic, not instant), **when** an expired poll is opened before the sweep catches it, **then** the page checks `expires_at < now()` at render and shows the "not live" page regardless. The cron does the deleting; the page does not serve expired data while waiting. |

---

### 1.3 Participant stories

#### US-P1 — Answer without signing up for anything

> **As a** participant, **I want** to give my availability on my phone with no account, **so that** it takes thirty seconds and not a password reset.

| # | Acceptance criterion |
|---|---|
| P1.1 | **Given** an `open` poll, **when** I open `/availability/p/[token]`, **then** I see the title, description, location, the organiser's name, "All times are UK time (Europe/London)", a name field, an optional email field, and one card per option. No login, no account prompt, ever. |
| P1.2 | **Given** the option cards, **when** I view them on a 375px screen, **then** they are a **vertical list** — one card per option, three tap targets each, each ≥44×44px (`min-h-[44px] min-w-[44px]`). No drag, no horizontal scroll, no zoom, no matrix. |
| P1.3 | **Given** one option card, **when** I inspect its markup, **then** it is a `fieldset` with a `legend` naming the option in full — `formatSlotRangeInLondon(starts_at, ends_at)` → "Tuesday, 14 July 2026, 2:00pm – 4:00pm" for slots, `formatDateInLondon(option_date, 'long')` → "Saturday, 4 July 2026" for dates — containing three mutually exclusive native `<input type="radio">` inside the existing `Form`/`FormField` pattern. **Do not add a radio-group component.** Neither `src/components/ui/radio-group.tsx` nor `@radix-ui/react-radio-group` exists, and native radios inside a `fieldset` already give correct grouping, keyboard behaviour and screen-reader semantics for free. Adding the dependency would be a **NET NEW** dependency buying nothing. |
| P1.4 | **Given** the three states, **when** they render, **then** each carries a glyph **and** text: `✓ Yes`, `~ If need be`, `✗ No`. Colour is never the sole indicator (WCAG 1.4.1). Any meaningful fill hits 3:1 against adjacent fills (1.4.11). |
| P1.5 | **Given** an unanswered option, **when** I submit, **then** it is refused inline with `VALIDATION_MESSAGES.poll.answerEveryOption` ("Give an answer for every option — 'No' is a perfectly good answer."). Partial responses would misread as availability. |
| P1.6 | **Given** the aggregate display, **when** I look at a card, **then** I see counts only — "4 yes · 1 if need be · 2 no" — and **never who voted which way**. Per-person votes are the organiser's view alone. (Binding per **R11**.) |
| P1.7 | **Given** an empty or whitespace-only name, **when** I submit, **then** it is refused: name is required, **minimum 2, maximum 50 characters**, reusing `VALIDATION_MESSAGES.name` exactly as `src/lib/validation.ts` does. Do not invent a different cap. |
| P1.8 | **Given** an email I typed, **when** I submit, **then** it is stored on `poll_participants.email` and used only to send **me** my own edit link and the confirmation. It is never shown to other participants and never enters the organiser's matrix as a clickable address. |
| P1.9 | **Given** no email, **when** I submit, **then** it still works. Email is optional and the form says so. |
| P1.10 | **Given** the honeypot `website` is filled, **when** it posts, **then** `submitResponse` returns `{ success: true }` and writes nothing — the `contact.ts` short-circuit, first statement in the action. |
| P1.11 | **Given** any participant page, **when** headers are set, **then** `Referrer-Policy: no-referrer` is present. The token is in the URL. |
| P1.12 | **Given** the form, **when** the privacy notice renders, **then** it is on the page before I submit: who the controller is (Orange Jelly Limited), what is collected, why, lawful basis (legitimate interests), that the organiser gave us the invitation context, the 60-day retention, my rights, and the ICO route. Article 14, not 13 — the data came to us indirectly. |

**Deliberately cut: the time-to-submit check.** An earlier draft required discarding submissions "faster than the minimum time-to-submit". No such control exists in the repo (`contact.ts` has the honeypot and nothing else), and the draft named no threshold, no field to carry the render timestamp and no tamper-resistance — a signed timestamp is the only non-trivial version, and an unsigned one is a client-supplied number an attacker sets to whatever they like. Phase 2a's rate limiting plus Turnstile on `createPoll` is the control. Honeypot only on `submitResponse`.

#### US-P2 — Change my answer

> **As a** participant, **I want** to update what I said, **so that** a diary change does not mean emailing the organiser.

| # | Acceptance criterion |
|---|---|
| P2.1 | **Given** I have just submitted, **when** the success state renders, **then** my edit link is shown **on screen** — `role="status" aria-live="polite"` — with "Keep this link if you need to change your answer." It is shown even when I gave no email. This is the honest fix for the no-identity problem, not a nice-to-have. |
| P2.2 | **Given** I gave an email, **when** the submission commits, **then** I also get that link by email, with the privacy notice, best-effort. A failed email never fails the submission. Blocked on `sendPollEmail` (see O6.5) — until that lands, only the on-screen link exists, and P2.1 is what makes that acceptable rather than broken. |
| P2.3 | **Given** my edit link, **when** I open `/availability/p/[token]/edit/[editToken]` on an `open` poll, **then** my current answers are pre-selected and my name and email are pre-filled. |
| P2.4 | **Given** I change answers and press "Update", **when** `updateResponse(editToken, input)` runs, **then** it resolves the participant by `edit_token` alone (unique on `poll_participants`), then upserts `poll_responses` on the `unique (participant_id, option_id)` constraint — a real, named conflict target. No new participant row is created. This is the only genuine upsert in the design. |
| P2.5 | **Given** the `editToken` and the poll's `participant_token` in the URL disagree, **when** the page loads, **then** the poll is resolved from the **`editToken`** (participant → `poll_id` → poll) and the mismatched `participant_token` is ignored, not trusted. The edit token is the capability; the `[token]` segment is decoration on the URL. |
| P2.6 | **Given** a `closed` or `confirmed` poll, **when** I open my edit link, **then** I see my answers read-only with a banner — "This poll is closed, so answers are locked" or "Confirmed for Tuesday, 14 July 2026, 2:00pm – 4:00pm UK time" — and the Update control is not rendered. `updateResponse` re-reads `status` and refuses server-side too. |
| P2.7 | **Given** an unknown or deleted `editToken`, **when** I open the page, **then** the "not live" page with a 404. |

#### US-P3 — See where things stand

> **As a** participant, **I want** to know the shape of the answers, **so that** I can tell whether my "if need be" is decisive.

| # | Acceptance criterion |
|---|---|
| P3.1 | **Given** an `open` poll, **when** I look at any option, **then** I see aggregate counts and a total responder count ("7 people so far"). Nothing identifying anybody. |
| P3.2 | **Given** the aggregate display, **when** I look for a "best option" badge, **then** **there isn't one** on the participant view. Ranking anchors people to the popular options — the exact effect the aggregate-only decision exists to dampen. Counts only. |
| P3.3 | **Given** zero responses, **when** I open the poll, **then** the cards show "Nobody's answered yet — you're first." Not "0 yes · 0 if need be · 0 no". |
| P3.4 | **Given** a `confirmed` poll, **when** I open the participant link, **then** the URL still works (it is not deleted) and I see: the confirmed time in full words + "UK time", Add-to-Google and Add-to-Outlook links, an `.ics` download, and "This time is confirmed. The voting is done." The voting form is **not** rendered. |
| P3.5 | **Given** a `confirmed` poll, **when** I look at the confirmed view, **then** I see the option totals but **not** the per-person matrix. Confirmation does not turn a participant into an organiser. |
| P3.6 | **Given** a `closed` poll, **when** I open the participant link, **then** I see "Voting has closed. [Organiser name] is picking a time." with the options and their totals, and no form. |
| P3.7 | **Given** a response is submitted, updated or deleted, **when** the write commits, **then** `revalidatePath` is called for `/availability/p/[token]`, `/availability/p/[token]/edit/[editToken]` and `/availability/o/[token]` so counts are current on next load. **This is a new pattern for this repo** — grep confirms no server action anywhere calls `revalidatePath`. There is no in-repo precedent to copy; write it deliberately and test it. Note the pages are `force-dynamic` per `SCOPE.md` §6, so this is belt-and-braces against the router cache, not the data source. (Binding per **R8**.) |

---

### 1.4 The state machine

Four states, on `polls.status`, constrained by the CHECK in the migration (`check (status in ('draft', 'open', 'closed', 'confirmed'))`). There is no fifth state and no `expired` state — expiry is a timestamp plus a deletion, not a status.

```
                    createPoll
                        │
                        ▼
                   ┌─────────┐
                   │  draft  │◄──── invisible to everyone but the verify link
                   └────┬────┘
                        │ verifyOrganiserEmail(verify_token)
                        ▼
                   ┌─────────┐
 setPollOpen(t,true)│  open   │──── voting happens here, and only here
      ┌────────────►└────┬────┘
      │                  │        │
      │                  │        │ confirmOption(organiserToken, optionId)
      │ setPollOpen(t,false)      │
      │                  ▼        │
      │             ┌─────────┐   │
      └─────────────┤ closed  ├───┤ confirmOption
                    └─────────┘   │
                                  ▼
                            ┌───────────┐
                            │ confirmed │  TERMINAL
                            └───────────┘

deletePoll / cron sweep past expires_at: any state ──► row gone (hard delete, cascade)
```

#### 1.4.1 Transitions

| From | To | Trigger | Preconditions | Side effects |
|---|---|---|---|---|
| — | `draft` | `createPoll(input)` | Validation passes; ≥2 and ≤8 options; not rate limited; honeypot empty | App-generated uuids; three tokens generated; `polls` + `poll_options` inserted; `expires_at` set; verification email sent best-effort |
| `draft` | `open` | `verifyOrganiserEmail(verify_token)` | Token matches a poll with `status = 'draft'` and is unexpired | `email_verified_at = now()`; `verify_token` nulled; participant + organiser links revealed on screen and emailed to the organiser |
| `open` | `closed` | `setPollOpen(organiser_token, false)` | `status = 'open'` | `closes_at = now()`; responses untouched; `revalidatePath` |
| `closed` | `open` | `setPollOpen(organiser_token, true)` | `status = 'closed'` | `closes_at = null`; `revalidatePath` |
| `open` | `confirmed` | `confirmOption(organiser_token, optionId)` | `status = 'open'`; option belongs to this poll | `confirmed_option_id` set; `closes_at = now()` (it was null); fan-out to every participant email + the organiser, best-effort |
| `closed` | `confirmed` | `confirmOption(organiser_token, optionId)` | `status = 'closed'`; option belongs to this poll | `confirmed_option_id` set; **`closes_at` left as it was** — it is already non-null and records the real close time; fan-out as above |
| `confirmed` | *anything* | — | **No transition exists.** Terminal. | — |
| any | *row deleted* | `deletePoll(organiser_token)`, or the cron sweep when `expires_at < now()` | Token matches / expiry passed | Hard delete; cascade to options, participants, responses |

#### 1.4.2 What each state permits

| | `draft` | `open` | `closed` | `confirmed` |
|---|---|---|---|---|
| Participant link resolves | ✗ 404 | ✓ | ✓ | ✓ |
| Participant can vote | ✗ | ✓ | ✗ | ✗ |
| Participant can edit their answer | ✗ | ✓ | ✗ read-only | ✗ read-only |
| Participant sees aggregate counts | ✗ | ✓ | ✓ | ✓ |
| Participant sees who voted what | ✗ | ✗ | ✗ | ✗ (never, in any state) |
| Participant sees the confirmed time | — | — | — | ✓ + `.ics` + calendar links |
| Organiser link resolves | ✓ * | ✓ | ✓ | ✓ |
| Organiser sees the per-person matrix | ✓ * (empty) | ✓ | ✓ | ✓ |
| Organiser can close / reopen | ✗ | ✓ close | ✓ reopen | ✗ |
| Organiser can confirm an option | ✗ | ✓ | ✓ | ✗ (already confirmed) |
| Organiser can delete a response | ✗ | ✓ | ✓ | ✗ |
| Organiser can delete the poll | ✓ * | ✓ | ✓ | ✓ |
| Verify link resolves | ✓ (transitions, then consumed) | ✗ (consumed) | ✗ | ✗ |
| Email sent on entry | Verification → organiser | Links → organiser | none | Fan-out → every participant email + the organiser |

\* **Reachable in principle, not in practice.** The organiser token is revealed only on the verify page and in the links email (O1.11 puts no token on the create screen), and both only exist after verification. So in `draft` nobody holds the organiser link. The rows are marked ✓ because the *server* must behave this way if the token is presented — never because a user can get there.

#### 1.4.3 The participant link, state by state

| State | What the participant link does |
|---|---|
| `draft` | 404 "This link isn't live any more". An unverified draft is indistinguishable from a poll that never existed. |
| `open` | The voting form. Cards, three states, aggregate counts, name + optional email, privacy notice. |
| `closed` | Read-only. Options and totals, "Voting has closed. [Organiser] is picking a time." No form. |
| `confirmed` | The confirmed time in words + UK time, `.ics`, Add-to-Google, Add-to-Outlook, totals. No form, no matrix. The URL stays live — this is the point of the whole feature. |
| deleted / expired | 404 "This link isn't live any more", identical to `draft`. |

#### 1.4.4 The three questions, answered flatly

- **Can you vote on a closed poll?** No. The form is not rendered, and `submitResponse`/`updateResponse` both re-read `status` inside the action and return `{ error: VALIDATION_MESSAGES.poll.votingClosed }`. UI hiding is never the control.
- **What does a participant see on a confirmed poll?** The confirmed time spelled out in words with "UK time", `.ics`, Add-to-Google, Add-to-Outlook, and the per-option totals. Not the matrix, not who voted what, no form. The link stays live indefinitely — until deletion or the 60-day sweep.
- **What happens to an unverified draft?** Nothing, and then it is deleted — within 24 hours, by the Phase 5 sweep's draft predicate (§4.1). It is invisible on the participant link. There is a **"Send it again"** control on the create screen, rate-limited to one per 60 seconds per poll, which regenerates `verify_token` and re-sends; regenerating invalidates the previous link and the screen says so. An organiser who loses that too builds a new poll; `organiser_email` is not unique (it carries a plain index, `polls_organiser_email_idx`, not a constraint) and nothing blocks it.

---

### 1.5 Full lifecycle

| Day | Event | State | Data |
|---|---|---|---|
| 0 | Organiser fills `/availability/new`, presses "Publish poll". `createPoll` validates, generates `participant_token`, `organiser_token`, `verify_token` and every uuid, inserts `polls` + 2–8 `poll_options`, sets `expires_at`. | `draft` | 1 poll row, 2–8 option rows |
| 0 | Verification email to the organiser. Best-effort — a failure does not roll back the poll. | `draft` | unchanged |
| 0 | Organiser opens `/availability/verify/[verify_token]`. `email_verified_at` set, token consumed. Both links shown on screen and emailed, clearly separated, with the forwarded-link warning. | **`open`** | poll updated |
| 0–14 | Organiser sends the participant link by whatever channel they like. We never send it for them — anonymous invitation is the open-relay hole. | `open` | unchanged |
| 1–14 | Each participant opens the link, gives a name, optionally an email, answers all options. `submitResponse` inserts a `poll_participants` row (app-generated uuid + `edit_token`) + one `poll_responses` row per option, and recomputes `expires_at`. Their edit link is shown on screen and emailed if they gave an address. | `open` | +1 participant, +N responses per person |
| 1–14 | Organiser gets a **digested** notification of new responses — never one email per vote. | `open` | unchanged |
| 1–14 | Participants change their minds via their own edit links. `updateResponse` upserts on `(participant_id, option_id)`. | `open` | responses updated, `updated_at` bumped by the `poll_responses_set_updated_at` trigger |
| 14 | Organiser presses "Close the poll" — `setPollOpen(token, false)`. | **`closed`** | `closes_at` set |
| 14 | Organiser presses "Confirm this time" on the winner, confirms the `Dialog`. | **`confirmed`** | `confirmed_option_id` set; `closes_at` untouched (already set at close) |
| 14 | Fan-out to every participant email plus the organiser, **including non-voters**: time in words + UK time, `.ics`, Add-to-Google, Add-to-Outlook. All user strings through `escapeHtml()`. | `confirmed` | unchanged |
| 14–74 | Every link stays live. The participant link shows the confirmed time. The organiser link shows the matrix and the confirmation. Nothing changes. | `confirmed` | unchanged |
| ~74 (60 days after the later of the last option date and the last response) | Vercel cron hits the token-protected sweep route, finds `expires_at < now()`, hard-deletes the poll. Options, participants and responses cascade. | *gone* | 0 rows |
| ~74+ | Every link — participant, organiser, verify, edit — returns the "This link isn't live any more" page with a 404. Identical to a token that never existed. | *gone* | — |

At any point the organiser can press "Delete this poll" and jump straight to the last two rows.

---

### 1.6 Edge cases

| # | Case | Expected behaviour |
|---|---|---|
| **E1** | **Nobody responds.** | The poll sits in `open` until the organiser acts or `expires_at` passes. No automatic reminders to participants — cron nudges to participants are out of scope (see §4.5). The organiser view shows the empty state (O3.7) with the participant link repeated. The organiser can still confirm an option with zero votes: "Nobody voted, so this is your call" — the `Dialog` says exactly that. The fan-out is **not** empty: per O6.4 the recipient set always includes `polls.organiser_email`, which is not null and verified, so the organiser gets their own `.ics` and the send is a normal one-recipient send, not a no-op to be special-cased. |
| **E2** | **Everybody says no to everything.** | Not an error state and not a failure — it is a real, useful answer. The organiser view shows every option with 0 yes / 0 if-need-be / N no, **no "Best so far" badge on any option — the suppression rule in O3.9, not an exception invented here.** Without O3.9 the O3.6 tie rule would badge every option, which is why the rule lives in O3 and is only referenced here. Plus a plain banner: "Nothing here works for anyone. Build a fresh poll with different times." with a link to `/availability/new`. Confirm is still enabled — an organiser may need to pick a time regardless, and the tool does not overrule them. |
| **E3** | **Two people with the same name.** | Both are stored. `display_name` has no uniqueness and never will — self-asserted names are not identity. The organiser matrix shows two "Sarah" rows, disambiguated in the row header's accessible name by their response date, rendered as `formatDateInLondon(toLocalIsoDate(created_at), 'short')` → "Sarah, answered Fri 3 Jul". **Not `formatSlotInLondon(created_at)`** — that would append a meaningless time to a disambiguator. The organiser deletes one if it is a duplicate. **We never merge, never prompt "is this you?", and never key on email.** A partial unique index on `(poll_id, lower(email))` is explicitly rejected: two colleagues sharing one pub inbox is common, and it would turn a cosmetic duplicate into a hard submission failure for a real user. |
| **E4** | **The same person votes twice from the participant link.** | Two `poll_participants` rows, two sets of responses. This is the designed consequence of having no identity, and it is accepted, not defended against. It is contained three ways: (a) the edit link appears **on screen** immediately after the first submission (P2.1), which is the reason it is on screen and not only in email; (b) if they gave an email, they have the same link there; (c) the organiser can delete either row (US-O4). No upsert is possible — an upsert needs a stable conflict target and a first-time responder has none: `display_name` is not unique, `email` is optional, and `edit_token` is generated by us at insert time. |
| **E5** | **The organiser confirms, then wants a different time.** | No un-confirm exists (US-O7). The organiser view says so and offers two honest routes: tell people yourself and build a fresh poll, or delete this poll. Rationale in the copy: people already have the confirmed time in their calendars; quietly reopening would leave a stale `.ics` with no correction, which is worse than the coordination cost of saying so. `confirmOption` on a `confirmed` poll returns `{ error: VALIDATION_MESSAGES.poll.alreadyConfirmed }` and never re-fires the fan-out. |
| **E6** | **A participant opens an expired or deleted link.** | The shared "not live" page: `<Heading level={1}>` "This link isn't live any more", body text "Polls and their answers are deleted 60 days after the last date on them. If you think this is a mistake, ask whoever sent it to build a fresh one." HTTP 404. **Byte-identical** whether the token never existed, was deleted, or has expired — a distinguishable response is a token oracle. The page carries no organiser name, no poll title, nothing from the record. |
| **E7** | **A participant opens a `draft` poll's participant link.** | Same page as E6, same 404. An unverified draft leaks nothing — not its existence, not its title. |
| **E8** | **The organiser link gets forwarded to a participant.** | That person is now, in effect, the organiser: they can see the matrix, close, delete responses, confirm, and delete the poll. This is the accepted cost of no-login and it is **named explicitly**, not buried: the verify page and the links email both say "Keep this one. Anyone who has it can close the poll and confirm the time." There is no technical control — capability URLs work exactly this way, and pretending otherwise would mean inventing accounts. Mitigation is honesty plus `Referrer-Policy: no-referrer`, no third-party resources on token pages, and tokens scrubbed from logging. |
| **E9** | **A participant link is pasted into a group chat that unfurls it.** | Harmless by design — the participant link is meant to be shared widely; that is its job. But nothing on the token pages loads a third-party resource, so an unfurl bot fetches the page and nothing else. The `Referrer-Policy: no-referrer` header stops the token leaking onward via `Referer`. |
| **E10** | **The organiser proposes a slot in the spring-forward gap.** | `londonWallClockToInstant` throws by design. `createPoll` catches and returns `err.message` verbatim as `{ error: … }` — it already names the time, the date, the zone and the reason ("…does not exist on … in Europe/London — the clocks go forward and that hour is skipped. Choose a different time."). Never coerce a non-existent time into a real one, and never rewrite that message: it is tested in `dateUtils`'s 43-test suite and the two must not drift. |
| **E11** | **The organiser proposes a slot in the autumn overlap (the repeated hour).** | Stored silently as the **earlier (BST)** occurrence, per the documented `dateUtils` decision (`londonWallClockToInstant` explicitly rewinds an hour when the earlier wall clock matches). No warning, no prompt. The rendered time is unambiguous to a human reading it and the `.ics` carries a UTC instant, so both occurrences of "1:30am" cannot disagree about which meeting is meant. |
| **E12** | **A response arrives between the organiser pressing "Close" and the page re-rendering.** | The write loses. `submitResponse` re-reads `status` inside the action and returns `{ error: VALIDATION_MESSAGES.poll.votingClosed }`. The participant sees a `role="alert"` block with that message and their answers still in the form so they can screenshot or copy them. No silent drop. |
| **E13** | **Two organiser tabs both press "Confirm", on different options.** | The first wins. The second re-reads `status` inside the action, finds `confirmed`, returns `{ error: VALIDATION_MESSAGES.poll.alreadyConfirmed }`, changes nothing and sends nothing. To make this a genuine race guard rather than a read-then-write with a window in it, write it as a conditional update — `update polls set status = 'confirmed', confirmed_option_id = $1 where organiser_token = $2 and status in ('open','closed')` — and treat "zero rows matched" as the already-confirmed error. Fan out **only** when the update matched a row. Guarded by the database, not by the UI and not by a prior `select`. |
| **E14** | **A participant submits a 9th option's vote by crafting the payload.** | `submitResponse` validates that the set of `option_id`s submitted is exactly the set belonging to this poll — no more, no fewer. A foreign `option_id` is rejected by validation, and `poll_responses_option_fk` — composite, `foreign key (option_id, poll_id) references poll_options(id, poll_id)` — is the database-level backstop that makes a cross-poll vote impossible even if validation is wrong. |
| **E15** | **The poll title contains HTML or a script tag.** | Stored verbatim — sanitising at write time destroys legitimate apostrophes and is the wrong layer. Escaped at every render: React escapes it in JSX for free, and `escapeHtml()` from `src/lib/email.ts` is **mandatory** on every user string in every email. Poll titles are attacker-controlled and end up in HTML mail. |
| **E16** | **A participant gives an email that bounces.** | Nothing happens to the vote. The vote is already committed; the email is best-effort. `console.error('[polls] Edit link not sent: …')`. The edit link is on screen (P2.1), so a bounce costs them nothing. |
| **E17** | **A date-only option is rendered.** | Through `formatDateInLondon(option_date, 'long')` → "Saturday, 4 July 2026". **`formatSlotInLondon` must never be called on a `YYYY-MM-DD` value — and, contrary to what a reader of `dateUtils` might assume, it will not stop you.** It does `new Date(instant)` and throws only on `NaN`; `new Date('2026-07-04')` parses cleanly to UTC midnight, so it returns "Saturday, 4 July 2026 at 1:00am" during BST — a plausible-looking, silently wrong string. The `assertIsoDate` guard, with its "Expected a date-only value…" message, is on `formatDateInLondon` and `londonWallClockToInstant` — it protects the *date* direction only. **Therefore the guard is the application's job, in two places:** (a) branch on `polls.option_kind` at every render site, never on the shape of the value; (b) `src/lib/db/polls.ts` types the row as a discriminated union — `{ kind: 'date'; date: IsoDate } \| { kind: 'slot'; startsAt: Date; endsAt: Date }` — so a slot formatter cannot be reached with a date at the type level. Add a `dateUtils` test asserting `formatSlotInLondon('2026-07-04')` returns the 1:00am string, so the hazard is pinned by a test rather than by a comment. This is the single bug most likely to destroy trust in the tool, and the draft that claimed the type split already caught it was wrong in the most dangerous possible direction. |

---

## 2. Screen-by-screen UI spec

### 2.0 Cross-cutting decisions (apply to all four screens)

**Design-token warning — read before writing any button.**
The shadcn `--primary` CSS variable is **charcoal `#1A2F49`** (`globals.css:567`, `213 48% 19%`), *not* the brand orange `#F65403`. Therefore `<Button variant="default">` from `src/components/ui/button.tsx` renders **dark navy**. Every brand-orange call to action on these screens MUST use the legacy adapter — `import Button from '@/components/Button'` (→ `ButtonAdapter`) with `variant="primary"`, which force-applies `bg-orange text-white hover:bg-orange-dark`. (This is **R7**, and it overrides §1's contrary note.) The shadcn `--accent` variable is a pale blue-grey (`205 55% 94%`), not orange either; do not reach for `bg-accent` expecting a highlight. Likewise `--radius: 0.5rem` in `globals.css` is **not** wired into `tailwind.config.js` (there is no `borderRadius` key in the theme extend) — use literal `rounded-md` / `rounded-lg`.

**Colour-token names are not what you'd guess.** Verified against `tailwind.config.js`:

| Intended colour | Correct class | Hex |
|---|---|---|
| Brand orange | `bg-orange` / `border-orange` / `text-orange` | `#F65403` |
| Pale orange wash | `bg-orange-light` | `#FFF2D4` |
| Amber highlight | **`bg-brand-highlight` / `border-brand-highlight`** — **not** `bg-highlight`, which does not exist and compiles to nothing | `#FFBD28` |
| Pale blue surface | `bg-surface-alt` | `#E7F1F8` |
| Body text | `text-charcoal` | `#1A2F49` |
| Muted text on white | `text-charcoal-light` | `#324A68` (>4.5:1 on white) |
| Hairlines | `border-border` (shadcn `--border`) | — |

`highlight` and `grounded` live under the `brand` key (`brand.highlight`, `brand.grounded`), so they are always `*-brand-highlight` / `*-brand-grounded`. Getting this wrong fails silently — the tile renders unstyled, not red.

**Second gotcha — layout wrappers.** `<Section>` already wraps its children in `<div className="max-w-6xl mx-auto px-4 sm:px-6">`. Do **not** nest `<Container>` inside `<Section>`. All four screens use `<Section>` alone.

**Third gotcha — `<Grid>`** builds Tailwind classes dynamically (`src/components/Grid.tsx:31-34`, `` `grid-cols-${columns.default}` ``), which the workspace rules forbid and which Tailwind's purge breaks. None of these four screens use `<Grid>`; use static `grid-cols-*` classes directly.

**Fourth gotcha — `<Card>` ignores `background` unless `variant="colored"`.** `CardAdapter.tsx:64-70` only applies `backgroundMap[background]` when `variant === 'colored'`. With `variant="bordered"` the card's fill comes from the shadcn base class `bg-card` (`--card: 0 0% 100%` in light, i.e. white). So write `<Card variant="bordered" padding="medium">` and **omit `background`** — passing `background="white"` is a no-op that reads as if it does something.

**Toasts do not exist** (no `ui/toast.tsx`, no Sonner). Every server-action outcome surfaces via `<Alert>` or inline `<FormMessage>`. `<Alert>` has only `default | destructive` — there is no success variant, so success states use `variant="default"` plus a className, spec'd per-screen below.

**`<Alert>` role.** `src/components/ui/alert.tsx:27` hardcodes `role="alert"` on the root **before** spreading `{...props}`, so an explicitly passed `role="status"` does win. Every success/neutral Alert below therefore passes `role="status"` deliberately — do not strip it as redundant, or the announcement becomes assertive.

**`<AlertTitle>` is an `<h5>`** (`alert.tsx:33`). Where this spec says "H1", that means a real `<Heading level={1}>` rendered **outside** the Alert. Every route must have exactly one h1; an Alert alone does not provide it.

**Breakpoints** are stock Tailwind (no `screens` key in the config): `sm 640 / md 768 / lg 1024 / xl 1280`. "375px" below means the base, un-prefixed styles.

**Navigation.** None of these routes are added to `content/data/navigation.json`. The tool is link-shared, not browsed to. `/availability/new` is reachable from the `/ways-to-work` page body only. If it were added, note that `mainMenu` and `mobileMenu` are duplicated arrays and both would need an entry plus a re-numbered `order`.

**Availability values are fixed by the database.** `poll_responses.availability` is `check (availability in ('yes', 'if_need_be', 'no'))`. The wire value for the middle state is **`if_need_be`**, not `if_needed`. The UI label is **"If need be"** (per **R4**); never let the label leak into the value.

**Availability glyphs (WCAG 1.4.1 — colour is never the only signal).** One canonical mapping used identically on the vote screen, the results matrix and the results legend:

| DB value | Glyph | Text label | Fill | Text |
|---|---|---|---|---|
| `'yes'` | `✓` | "Yes" | `bg-orange` (`#F65403`) | `text-white` |
| `'if_need_be'` | `~` | "If need be" | `bg-brand-highlight` (`#FFBD28`) | `text-charcoal` |
| `'no'` | `✕` | "No" | `bg-surface-alt` (`#E7F1F8`) | `text-charcoal` |
| *(no row)* | `–` | "Not answered" | `bg-white` | `text-charcoal/50` |

"Not answered" is the absence of a `poll_responses` row for that `(participant_id, option_id)` pair — there is no fourth enum value and none must be invented.

Glyphs are rendered as inline text inside a `<span aria-hidden="true">` with the real state carried by the control's accessible name or the cell's visually-hidden text — never by the glyph alone and never by fill alone.

**Tap targets.** Every interactive control is at least 44×44. The legacy `ButtonAdapter` already guarantees this — `legacySizeClasses` are `small: min-h-[44px]`, `medium: min-h-[44px]`, `large: min-h-[48px]` — whereas raw shadcn `size="default"` is `h-9` (36px) and `size="sm"` is `h-8` (32px), both **below** `--tap-target-size: 44px` in `globals.css`. Use the adapter; do not use `@/components/ui/button` directly on these screens, notwithstanding that `src/components/forms/contact-form.tsx` does.

---

### 2.1 Screen 1 — Create poll

**Route:** `/availability/new` → `src/app/availability/new/page.tsx`

**Composition:** `page.tsx` is a **Server Component** (exports `metadata`, renders the static heading/intro chrome). It renders `<CreatePollForm />` from `src/components/availability/create-poll-form.tsx`, which is a **Client Component** (`'use client'`) because it needs `useForm`, `useFieldArray` for the dynamic option rows, and `useState` for the submitted/error state. This mirrors the existing split in `src/components/forms/contact-form.tsx` — **in shape only**: that file imports the raw shadcn `Button` and skips `FormDescription`. Copy its `Form`/`FormField`/`zodResolver` structure, not its button import.

**Data written.** This form produces one `polls` row plus 2–8 `poll_options` rows. Fields the UI does not collect but the action MUST set, per the migration:

- `id` — `randomUUID()` in the app; the column has no DB default.
- `option_kind` — always **`'slots'`** for this screen (date + start + end). NOT NULL, no default.
- `timezone` — leave to the `'Europe/London'` default.
- `status` — `'draft'` on create; the verify screen moves it to `'open'`.
- `participant_token` / `organiser_token` / `verify_token` — CSPRNG, base64url, ≥128 bits, mutually underivable.
- `expires_at` — NOT NULL, no default: 60 days after the later of the last response and the last option's `ends_at`. On create that is `max(ends_at) + 60 days`.
- `poll_options.position` — 0-based, matching the order of the rows on screen. NOT NULL.
- `poll_options.starts_at` / `ends_at` — instants from `londonWallClockToInstant(date, time)`. `option_date` stays NULL (enforced by `poll_options_shape_chk`).
- `location` — not collected on this screen; leave NULL.

**Layout at 375px**
Single column, full-bleed within the `<Section>` padding. Order top to bottom: `<Heading level={1}>`, intro `<Text>`, then the form as one stacked column — every field is full width, every label sits above its input. The option rows are stacked cards, each showing date + start time + end time on two lines (date full width; start and end side by side as `grid grid-cols-2 gap-3`). The "Add another option" button is `fullWidth`. The submit button is `fullWidth` and sits at the bottom of the flow (not sticky — a sticky bar would overlap the last option row on a short iPhone SE viewport).

**Layout at desktop (`md:` and up)**
`<Section background="cream" padding="large">` with the form constrained by `className="max-w-2xl"` on the form wrapper (the Section already caps at `max-w-6xl`; the narrower cap keeps line lengths readable). Option rows become `md:grid md:grid-cols-[1fr_auto_auto_auto] md:gap-3 md:items-end` — date, start, end, remove-button on one line. "Add another option" shrinks to `fullWidth={false}` via a `md:w-auto` wrapper. Submit button sits left-aligned under the form, `fullWidth={false}`.

**Chrome (Server Component part)**

```tsx
<Section background="cream" padding="large">
  <Heading level={1} align="left" color="charcoal">Find a time that works</Heading>
  <Text size="lg" color="muted" className="mt-4 max-w-2xl">
    Put up to eight options to your team, send them one link, and see who can make what.
    No accounts, no app, nothing for them to download.
  </Text>
  <CreatePollForm />
</Section>
```

**Fields and controls (Client Component)**

All fields use the shadcn form primitives from `src/components/ui/form.tsx` (`Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage` — all exported, verified) driven by `useForm` + `zodResolver`.

| # | Field | Component | Props / notes |
|---|---|---|---|
| 1 | Poll title | `<Input>` from `@/components/ui/input` | `type="text"`, `maxLength={120}`, `required`. → `polls.title`. `InputProps` is an empty interface extending `InputHTMLAttributes` — it has **no** error prop; the error renders through `<FormMessage>` beneath it. |
| 2 | What it's for | `<Textarea>` from `@/components/ui/textarea` | Optional. `rows={3}`, `maxLength={500}`. → `polls.description`. Note there is no exported `TextareaProps` type — it is `React.ComponentProps<'textarea'>`. |
| 3 | Your name | `<Input>` | `type="text"`, `required`, `autoComplete="name"`, `maxLength={50}`. → `polls.organiser_name`. |
| 4 | Your email | `<Input>` | `type="email"`, `required`, `autoComplete="email"`, `inputMode="email"`. → `polls.organiser_email`. |
| 5..n | Option date | `<Input>` | `type="date"`, `required`. Value is a date-only `IsoDate` (`YYYY-MM-DD`) and is passed to `londonWallClockToInstant(date, time)` server-side to produce `starts_at` / `ends_at`. Set `min={getTodayIsoDate()}` — this is the **only** correct "today" (`dateUtils.ts:106`); a naive `toISOString()` puts the poll a day out between midnight and 01:00 London in summer. |
| 5..n | Start time | `<Input>` | `type="time"`, `required`, `step={900}` (15-minute granularity). Must match `/^([01]\d\|2[0-3]):([0-5]\d)$/` — the same `WALL_CLOCK_TIME_PATTERN` `londonWallClockToInstant` enforces, or it throws. |
| 5..n | End time | `<Input>` | `type="time"`, `required`, `step={900}` |
| — | Remove option | legacy `<Button>` | `variant="ghost"` `size="small"` `type="button"` `aria-label="Remove option 3"` (index is 1-based, injected). `size="small"` is `min-h-[44px]` in the adapter, so it clears the tap-target bar. Rendered only when option count > 1. Contains a `<span aria-hidden="true">✕</span>`. |
| — | Add another option | legacy `<Button>` | `variant="outline"` `size="medium"` `fullWidth` `type="button"` `disabled={fields.length >= 8}` |
| — | Honeypot | plain `<input>` | `type="text"`, `tabIndex={-1}`, `autoComplete="off"`, `className="hidden"`, `aria-hidden="true"`, registered as `website`. This is the repo's existing convention, verbatim from `contact-form.tsx:123-130`; `submitContactForm` returns `{ success: true }` without storing when `data.website` is truthy. Copy it exactly. |
| — | Submit | legacy `<Button>` | `variant="primary"` `size="large"` `type="submit"` `loading={isSubmitting}` `fullWidth` + `md:w-auto` wrapper. **`type` defaults to `'button'` in `ButtonAdapter` — you must pass `type="submit"` explicitly.** `loading={true}` renders `<Loader2 className="mr-2 h-4 w-4 animate-spin"/>` before the children, sets `aria-busy`, sets `disabled`, and swaps the shadcn variant to `'loading'` (grey) while the legacy orange classes still apply on top. |

**Time-input decision.** Native `<input type="date">` and `<input type="time">` are used rather than a picker component. There is no date-picker in `src/components/ui/` (verified full listing) and adding one is a new dependency for no gain — the native iOS/Android wheels are better than anything we would build, and they hit the 44px target for free.

**Why no `<Select>` for the date.** `<Select>` exists and is wired, but a free date range beats a fixed list, and the poll is not constrained to a preset window.

**Validation (client, zod).** Mirrors `contact-form.tsx`: zod lives client-side only. Rules — title min 3 chars; `z.string().email()`; at least 2 options; at most 8 options; each option's end time strictly after its start time (matching `poll_options_shape_chk`'s `ends_at > starts_at`); no two options identical on `(date, start, end)`; date not in the past (`>= getTodayIsoDate()`). Errors render inline via `<FormMessage>`.

> **Pattern note for the implementer:** the server action must *also* validate. The repo's server actions contain **zero zod** — `src/app/actions/contact.ts` hand-rolls if-chains returning `{ error: string }` and types the return as `Promise<{ success?: boolean; error?: string }>`. §3 introduces server-side zod deliberately; follow §3's schemas, and note the return-type shape is unchanged.

> **NET NEW — email delivery.** `src/lib/email.ts` exports only `escapeHtml` and `sendLeadNotification`, and `sendLeadNotification` **hardcodes the recipient** to `process.env.CONTACT_NOTIFICATION_EMAIL || 'peter@orangejelly.co.uk'`. There is currently **no way to email an arbitrary address**. Sending the organiser their verify link requires `sendPollEmail` in `src/lib/email.ts`, taking a `to`, reusing the same Resend client, the same `RESEND_API_KEY` env var, the same `escapeHtml` on every interpolated value, and the same `{ success?, error? }` return. Per §1 O1.12 and §4, this send is **best-effort** — a failure logs and still shows the success state, and the "Send it again" control (§1.4.4) is the recovery route. Detail belongs in §3 and §4; it is flagged here because screen 1's success copy depends on it.

**Microcopy**

- H1: "Find a time that works"
- Intro: "Put up to eight options to your team, send them one link, and see who can make what. No accounts, no app, nothing for them to download."
- Title label: "What are you arranging?" · placeholder: "Quiz night briefing"
- Description label: "Any detail people need (optional)" · description: "Shown to everyone you send the link to."
- Name label: "Your name" · description: "Shown on the poll so people know who's asking."
- Email label: "Your email" · description: "We send your organiser link here. It is the only way back into your results, so use an address you can get to."
- Options fieldset legend: "Your options"
- Options helper: "Add between two and eight. All times are London time."
- Date label: "Date" · Start label: "From" · End label: "Until"
- Add button: "Add another option"
- Add button at the cap (disabled): helper text below reads "That's the maximum of eight options."
- Submit: "Send me my links"
- Below submit, small print: "By sending this you agree we can email you about this poll. Nothing else, and we don't pass your address on. We delete the poll and everyone's answers 60 days after the last date on it."

**Loading state.** The form itself is client-rendered with no data fetch, so there is no skeleton. Submission: `loading` on the submit button (spinner + `aria-busy` + disabled, all handled by `ButtonAdapter`), and every `<Input>` / `<Textarea>` gets `disabled={isSubmitting}` to prevent a double submit.

**Error state.** Server-action failure renders above the submit button:

```tsx
<Alert variant="destructive" role="alert" className="mb-6">
  <AlertTitle>That didn't go through</AlertTitle>
  <AlertDescription>{error}</AlertDescription>
</Alert>
```

Field errors: `<FormMessage>` inline, plus `aria-invalid` handled by `FormControl`. On submit failure, move focus to the `<Alert>` (`tabIndex={-1}` + `ref.current?.focus()`).

**Empty state.** The form mounts with exactly **two** empty option rows via `useFieldArray` `defaultValues` — a poll with one option is meaningless, so a genuinely empty option list is never rendered. If a user removes down to one row, the remove buttons disappear (`fields.length > 1` guard) rather than allowing zero.

**Success state.** Replace the form in place (do not navigate) with an h1 plus the confirmation Alert:

```tsx
<Heading level={1} color="charcoal">Check your inbox</Heading>
<Alert variant="default" role="status"
  className="mt-4 border-orange bg-orange-light text-charcoal">
  <AlertTitle>We've sent your links</AlertTitle>
  <AlertDescription>
    We've emailed <strong>{email}</strong> a link to confirm your address. Tap it and
    your poll goes live — then you'll get your team's link and your own private one.
  </AlertDescription>
</Alert>
```

There is no success variant on `<Alert>`, so `border-orange` + `bg-orange-light` (`#FFF2D4`) is the agreed treatment — used identically on screens 2, 3 and 4. Note the poll is `status='draft'` at this point and the participant link does **not** work until verification; do not show it here. The **"Send it again"** control (§1.4.4) sits below this Alert, rate-limited to one per 60 seconds per poll.

**Accessibility.** The option rows are wrapped in `<fieldset>` + `<legend>` (styled with `className="contents"` on the fieldset at desktop so the grid still applies to the rows). The whole options list is `aria-live="polite"` so adding or removing a row is announced. After "Add another option", focus moves to the new row's date input. After removing row *n*, focus moves to the remove button of row *n-1*, or to the "Add another option" button if row 1 was removed.

---

### 2.2 Screen 2 — Verify email landing

**Route:** `/availability/verify/[token]` → `src/app/availability/verify/[token]/page.tsx`

The `[token]` here is the **`verify_token`** (per **R2**/**R3**) — not the organiser token. Verification sets `polls.email_verified_at = now()`, moves `polls.status` from `'draft'` to `'open'`, and nulls `verify_token` / `verify_token_expires_at` so the link is single-use. It does not touch `participant_token` or `organiser_token`, both of which it then renders.

**Composition:** **Server Component**, no client boundary at all. It reads the token from `params`, calls the verification data function directly, and renders one of two static outcomes. There is nothing interactive on the page beyond links, so shipping zero client JS here is the correct call — and it means the verification happens on a plain GET with no hydration delay.

`export const dynamic = 'force-dynamic'` — this page mutates state and must never be cached or statically rendered.

> **NET NEW pattern note.** Verifying on GET means an email-scanner prefetch can consume the token. Per **R15** the token *is* consumed on first use, so a scanner prefetch verifies the poll and the organiser's own click then 404s. **This is the accepted trade-off, and it is why the links email (§4) is sent on verification** — the organiser's links reach them by mail regardless of who or what clicked first. Do not "fix" this by making the token reusable; a reusable magic link is a permanent capability sitting in an inbox.

**Layout at 375px**
Single centred column. `<Section background="cream" padding="large">`, contents in a `<div className="max-w-md mx-auto text-center">` — one glyph block, one `<Heading level={1}>`, one `<Text>`, one full-width primary button, one secondary text link. Vertical rhythm `space-y-6`.

**Layout at desktop**
Identical, just more breathing room from `padding="large"` (`py-14 md:py-20`). The `max-w-md` cap keeps it a card-like column rather than a stretched line. This screen is deliberately not responsive-complex — it is a two-second read.

**Controls**

| Outcome | Condition | Content |
|---|---|---|
| **Success** | `verify_token` matches a `draft`, unexpired poll; the conditional update matched | `<Heading level={1}>` + `<Alert variant="default" role="status" className="border-orange bg-orange-light text-charcoal">` + a legacy `<Button variant="primary" size="large" href={`/availability/o/${organiserToken}`} fullWidth className="md:w-auto">`. Note: when `href` is set, `ButtonAdapter` renders a `next/link` via `asChild` **and drops `type`** — that is fine here. Below it, the share-link block. |
| **Invalid, expired, consumed or unknown token** | no row matches | `<Heading level={1}>` + `<Alert variant="destructive">` + a legacy `<Button variant="outline" size="large" href="/availability/new">`. **Byte-identical for all four causes** — a distinguishable response is a token oracle (§1 E6). |

**Share-link block (success only).** Because there is no toast component, a "copied!" confirmation has nowhere to live without adding a client boundary. Decision: render the links as **selectable text** in a bordered box, not a copy button.

```tsx
<Box as="div" background="white" padding="small" rounded="md"
  className="border border-border text-left break-all">
  <Text size="sm" color="muted" className="mb-1">Your team's link</Text>
  <Text size="sm" as="span" className="font-mono select-all">
    {participantUrl}
  </Text>
</Box>
```

`participantUrl` is built from `polls.participant_token`. The organiser link renders in a second, identically-styled box under its own heading — **"Private — just for you"** — carrying the warning from §1 O2.2. `select-all` means one tap selects the whole URL on iOS. This avoids a `'use client'` boundary and a clipboard permission prompt for links that are also sitting in the organiser's inbox anyway.

**Microcopy**

- Success H1: "You're all set"
  Body: "Your poll is live. Share the link below with your team — they don't need an account, they just tap three buttons and they're done."
  Organiser-link heading: "Private — just for you" · body: "Keep this one. Anyone who has it can close the poll and confirm the time."
  Button: "See my results"
- Invalid H1: "That link didn't work"
  Body: "Confirmation links work once and last a day. If you've already used it, your links are in the email we sent straight afterwards. Otherwise, set up a new poll."
  Button: "Set up a new poll"

**Loading state.** Server-rendered, so the browser shows nothing intermediate. A `src/app/availability/verify/[token]/loading.tsx` provides a `<Skeleton>` fallback for the streamed shell:

```tsx
<Section background="cream" padding="large">
  <div className="max-w-md mx-auto space-y-4">
    <Skeleton className="h-10 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6" />
    <Skeleton className="h-12 w-full" />
  </div>
</Section>
```

**Error state.** Covered by the invalid-token outcome above (rendered, not thrown). A genuine data-layer exception falls through to `src/app/availability/verify/[token]/error.tsx` — a client error boundary rendering `<Heading level={1}>` "Something went wrong" plus `<Alert variant="destructive">` with "That's at our end, not yours. Try the link from your email again in a minute." and a legacy `<Button variant="outline" size="medium" type="button" onClick={reset}>Try again</Button>`.

**Empty state.** Not applicable — a token either resolves to a poll or it does not, and both branches render content.

**Accessibility.** The outcome glyph is `<span aria-hidden="true">` (`✓` on success, `✕` on failure); the meaning is carried entirely by the H1. The success `<Alert>` gets `role="status"`, the failure `<Alert>` keeps the component's built-in `role="alert"`. `<Heading level={1}>` is the only h1 and does *not* need programmatic focus — this is a fresh navigation, so the browser handles it.

---

### 2.3 Screen 3 — Participant vote

**Route:** `/availability/p/[token]` → `src/app/availability/p/[token]/page.tsx`, where `[token]` is `polls.participant_token`.

**Composition:** `page.tsx` is a **Server Component** — it resolves the token, fetches the poll, its options (ordered by `poll_options.position`) and the per-option tallies, and renders the static header (title, organiser name, description, reply count). It passes the option array and the tallies down to `<VoteForm />` in `src/components/availability/vote-form.tsx`, a **Client Component**, which owns the answer state, the name and email fields, and the submit. `export const dynamic = 'force-dynamic'` so the counts are never a stale cached number.

The page is only reachable when `polls.status` is `'open'`, `'closed'` or `'confirmed'`. A `'draft'` poll (organiser has not verified) renders the invalid-link outcome — the link is real but not yet live, and saying so would leak the existence of an unverified poll.

**Aggregate counts, no names.** Per **R11** and SCOPE.md decision 3, the participant sees the per-option counts ("4 yes · 1 if need be · 2 no") and the total responder count, and **never** who voted which way. "Aggregate only" means counts instead of names — not the absence of counts. There is **no** "best option" badge on this screen (§1 P3.2): ranking anchors people to the popular options, which is the exact effect the decision exists to dampen.

**Reply count copy.** The schema has **no invitee or headcount column**, so "{n} of {m}" is not computable and must not be spec'd. `n` is `count(distinct participant_id)` over `poll_participants` for this poll. Copy is therefore:
- `n === 0` → "Nobody's answered yet — you're first."
- `n === 1` → "One person has replied so far."
- `n > 1` → "{n} people have replied so far."

At `n === 0` the cards show that line instead of "0 yes · 0 if need be · 0 no" (§1 P3.3).

**Layout at 375px — this is the screen that matters**
Vertical list. **One card per option. Never a matrix.** When2Meet's drag-select grid deselects on iPhone Safari and loses answers outright; that failure mode is the entire reason this tool exists.

Each option is a `<Card>` (legacy adapter, `variant="bordered"` `padding="medium"` — no `background` prop, per §2.0; the base `bg-card` is white). Inside, top to bottom:

1. Option date, `<Heading level={3}>`, from `formatDateInLondon(toLocalIsoDate(option.starts_at), 'long')` → "Saturday, 4 July 2026". **There is no `option.date` field on a slot option** — `poll_options.option_date` is NULL whenever `starts_at`/`ends_at` are populated (`poll_options_shape_chk`), and screen 1 only ever creates slots. Derive the date from the instant via `toLocalIsoDate`.
2. Time range, `<Text size="base" color="muted">`, from `formatSlotRangeInLondon(option.starts_at, option.ends_at)` → "Saturday, 4 July 2026, 7:30pm – 9:00pm". The date repeats between the heading and this line. That is accepted deliberately: string-surgery to trim the date off a formatted range is fragile, and `formatSlotRangeInLondon` deliberately spells both dates out when a range crosses midnight, which trimming would destroy. It reads naturally and it cannot break.
3. The three answer buttons: `<AnswerRadioGroup>` in a `grid grid-cols-3 gap-2`, each tile `min-h-[56px]` — comfortably above the 44px floor, because these are the only controls on the screen and thumb accuracy matters more than density.
4. The aggregate line, `<Text size="sm" color="muted">` — "4 yes · 1 if need be · 2 no", or the zero-response line above.

At desktop the list stays a single column, capped at `className="max-w-2xl"`. It does **not** become a grid. The vertical list is the design; widening it would reintroduce the matrix by the back door.

**The answer control — NET NEW component**

`src/components/availability/answer-radio-group.tsx` — **NET NEW**, required.

**There is no `RadioGroup` in this repo.** Verified: no `src/components/ui/radio-group.tsx` (the full `ui/` listing is accordion, alert, avatar, badge, button, card, checkbox, dialog, faq-accordion, form, image, input, label, navigation-menu, progress, select, separator, sheet, skeleton, table, tabs, textarea, tooltip, typography — nothing else), and **no `@radix-ui/react-radio-group` in `package.json`**.

**Decision: build it on native `<input type="radio">`, add no dependency.** Rationale — native radios give us roving focus, arrow-key navigation, the required-group semantics and the form-reset behaviour for free, and they are the one control iOS Safari has never broken. A Radix dependency buys styling hooks we do not need for three fixed buttons. Using `<Checkbox>` (which exists) would be wrong: the answer is single-choice, and a checkbox group announces as multi-select.

Full specification:

```tsx
'use client';

import { cn } from '@/lib/utils';

/** Wire values are fixed by poll_responses.availability's check constraint. */
export type AvailabilityAnswer = 'yes' | 'if_need_be' | 'no';

export interface AnswerRadioGroupProps {
  /** poll_options.id — becomes the radio `name`, so it is unique per card. */
  optionId: string;
  /** Rendered as the group's accessible name via aria-labelledby. */
  labelledById: string;
  value: AvailabilityAnswer | null;
  onChange: (value: AvailabilityAnswer) => void;
  disabled?: boolean;
}

const ANSWERS: Array<{
  value: AvailabilityAnswer;
  label: string;
  glyph: string;
  selected: string;
}> = [
  { value: 'yes',        label: 'Yes',        glyph: '✓', selected: 'bg-orange text-white border-orange' },
  { value: 'if_need_be', label: 'If need be', glyph: '~', selected: 'bg-brand-highlight text-charcoal border-brand-highlight' },
  { value: 'no',         label: 'No',         glyph: '✕', selected: 'bg-surface-alt text-charcoal border-charcoal' },
];
```

Renders:

```tsx
<div role="radiogroup" aria-labelledby={labelledById} className="grid grid-cols-3 gap-2">
  {ANSWERS.map((a) => (
    <label
      key={a.value}
      className={cn(
        'relative flex min-h-[56px] cursor-pointer select-none flex-col items-center justify-center gap-1',
        'rounded-md border-2 px-2 py-3 text-sm font-semibold transition-colors',
        'focus-within:outline focus-within:outline-2 focus-within:outline-offset-2',
        'focus-within:outline-[var(--color-focus-ring)]',
        value === a.value ? a.selected : 'border-border bg-white text-charcoal hover:bg-surface',
        disabled && 'cursor-not-allowed opacity-60'
      )}
    >
      <input
        type="radio"
        name={`answer-${optionId}`}
        value={a.value}
        checked={value === a.value}
        disabled={disabled}
        onChange={() => onChange(a.value)}
        className="absolute h-full w-full cursor-pointer opacity-0"
      />
      <span aria-hidden="true" className="text-lg leading-none">{a.glyph}</span>
      <span>{a.label}</span>
    </label>
  ))}
</div>
```

Notes on that markup, because each line is load-bearing:
- `role="radiogroup"` is on the wrapper and `aria-labelledby` points at the card's `<Heading level={3}>` id (pass the id through `<Heading id=…>` — `HeadingAdapter` forwards unknown props to the shadcn `Heading`; if that proves unreliable, wrap the heading in a `<span id={labelledById}>`). A screen reader announces "Saturday, 4 July 2026, radio group, Yes, 1 of 3". **This is a radiogroup per option — explicitly not `role="grid"`.**
- The `<input>` is visually hidden with `opacity-0` and stretched over the label, **not** `display:none` or `sr-only` — a hidden-but-present input keeps native keyboard behaviour and keeps the whole 56px tile as the hit area.
- The glyph is `aria-hidden`; the text label carries the meaning. Both the glyph and the word are always visible, so the state never depends on fill colour alone.
- Focus is drawn with `focus-within:outline` using `--color-focus-ring` — which resolves to `--color-accent-secondary`, i.e. `#FF8901` (`globals.css:85,112`). The shadcn `ring` token is also orange-family (`32 100% 50%`), but `focus-within` on a label wrapping a hidden input needs an explicit outline, not `ring`.
- `border-2` means the selected state also differs by border weight, giving a third non-colour signal.
- `bg-brand-highlight` / `border-brand-highlight`, **not** `bg-highlight` — see the token table in §2.0.

**Other controls on the vote screen**

| Field | Component | Props |
|---|---|---|
| Your name | `<Input>` | `type="text"` `required` `autoComplete="name"` `maxLength={50}` (per **R9**). → `poll_participants.display_name` (NOT NULL). |
| Your email (optional) | `<Input>` | `type="email"` `autoComplete="email"` `inputMode="email"` `maxLength={254}`. → `poll_participants.email`, nullable. Per **R5** this **is** collected in Phase 1: without it there is no edit-link email and no confirmation on fan-out. Description: "Optional. We'll send you your own link back to this answer, and tell you what gets picked. We never show it to anyone else." An empty string is normalised to `null` server-side. |
| Honeypot | plain `<input type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" {...register('website')} />` | Same convention as the contact form. |
| Submit | legacy `<Button>` | `variant="primary"` `size="large"` `type="submit"` `loading={isSubmitting}` `fullWidth` |

**There is no note/comment field.** An earlier draft specified "Note for the organiser" (Textarea, 280 chars). `poll_responses` has no such column and neither does `poll_participants`; the field is unstorable against the current migration. It is **cut** from Phase 1. If it is wanted, it needs a `poll_responses.note text` or `poll_participants.note text` column and a follow-up migration — do not build the input against nothing.

The name and email fields sit **below** the option cards and above submit. People answer first and identify themselves second; asking for a name before showing what they're answering costs replies.

**Sticky submit at 375px.** The submit sits in a `sticky bottom-0` bar (`className="sticky bottom-0 -mx-4 border-t border-border bg-white/95 px-4 py-3 backdrop-blur md:static md:mx-0 md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none"`) once more than three options are on screen. Unlike screen 1, there is a long scroll here and the reply is the whole point. `<Section>` applies `overflow-hidden` on the `<section>` element (`Section.tsx:44`), which **breaks `position: sticky`** — so the vote form must be rendered outside `<Section>` inside a plain `<div className="max-w-2xl mx-auto px-4 sm:px-6">`. Do not fight the Section's base class with `!overflow-visible`.

**Microcopy**

- H1: the poll title (`polls.title`).
- Sub-line: "{organiser_name} is asking. All times are London time."
- Description, if the organiser gave one (`polls.description`).
- Reply count: per the three-branch rule above. Never "{n} of {m}".
- Options intro: "Tap one answer for each option."
- Name label: "Your name" · description: "So {organiser_name} knows who's replied."
- Submit: "Send my answers"
- Unanswered-options guard, inline `<Alert variant="destructive" role="alert">` above submit: `VALIDATION_MESSAGES.poll.answerEveryOption` — "Give an answer for every option — 'No' is a perfectly good answer." plus "{k} still to go."
- Privacy notice, rendered on the page **before** submit (§1 P1.12, Article 14): the shared constant from `src/lib/poll-emails/privacyNotice.ts`, so the page and the email cannot drift.

**Loading state.** `src/app/availability/p/[token]/loading.tsx` renders the header skeleton plus three card skeletons:

```tsx
<div className="max-w-2xl mx-auto space-y-4 px-4 py-10">
  <Skeleton className="h-9 w-2/3" />
  <Skeleton className="h-4 w-1/2" />
  {[0, 1, 2].map((i) => (
    <div key={i} className="rounded-lg border border-border p-6 space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="grid grid-cols-3 gap-2">
        <Skeleton className="h-14" />
        <Skeleton className="h-14" />
        <Skeleton className="h-14" />
      </div>
    </div>
  ))}
</div>
```

**Error states.**

- **Bad / unknown token, or `status = 'draft'`, or `expires_at < now()`** → the Server Component renders the shared "not live" page from §1 E6, not a form, with HTTP 404: `<Heading level={1}>` "This link isn't live any more" + `<Alert variant="destructive">` with the E6 body copy. It carries no poll title and no organiser name.
- **`status = 'closed'` (replies stopped, no option picked)** → `<Alert variant="default" role="status" className="border-charcoal bg-surface-alt">`, H1 "Voting has closed", body "{organiser_name} is picking a time." Options render **read-only** below it (`AnswerRadioGroup` with `disabled`), with their totals, and no form.
- **`status = 'confirmed'` (an option has been picked)** → `<Alert variant="default" role="status" className="border-orange bg-orange-light text-charcoal">`, H1 "A time's been picked", body "{organiser_name} has gone with {formatSlotRangeInLondon(...)} UK time. The poll is closed, so nobody can add a reply now." Plus an `.ics` download and the Add-to-Google / Add-to-Outlook links (§1 P3.4). Options render read-only with their totals, and the confirmed option's card carries `border-orange` plus a visible "Picked" label — never colour alone. No matrix (§1 P3.5).
- **Submit failure** → `<Alert variant="destructive" role="alert">` above the submit button: "We couldn't record that. Your answers are still on this page — try again in a moment." Focus moves to the alert. **Critically: do not clear the form state on failure.** The single worst outcome for this tool is discarding someone's answers.

**Empty state.** A poll with zero options cannot be created (screen 1 enforces a minimum of two, as does the server action). If the data layer returns one anyway, render `<Alert variant="destructive">` "This poll hasn't got any options on it yet. Ask {organiser_name} to send a new link." and no form.

**Already-voted state.** On a successful submit the action returns the new `poll_participants.edit_token` as `editUrl`, and the client sets a first-party cookie `oj_poll_{pollId}` whose value **is that edit token** (`SameSite=Lax`, `Secure`, path-scoped to `/availability/p/{participantToken}`, 90 days). It must carry the edit token, not a bare `1`: on revisit the page needs a way to find the participant's existing rows, and `poll_responses` is uniquely keyed on `(participant_id, option_id)` — a flag with no identifier cannot resolve to a participant, so "Change my answers" would create a second participant and a duplicate set of votes. The token is the only handle the schema gives us.

On revisit with a valid cookie, the page renders the answers back read-only with `<Alert variant="default" role="status" className="border-orange bg-orange-light text-charcoal">`: "You've already replied. Here's what you sent." plus a legacy `<Button variant="outline" size="medium" href={editUrl}>Change my answers</Button>` pointing at `/availability/p/[token]/edit/[editToken]`. If the cookie is missing or its token does not resolve, the page renders a fresh blank form — this is a convenience, **not** a security control, and it is not the duplicate-vote defence (§1 E4 is).

**Success state.** Replace the whole form with:

```tsx
<Alert variant="default" role="status"
  className="border-orange bg-orange-light text-charcoal">
  <AlertTitle>Thanks — that's in</AlertTitle>
  <AlertDescription>
    {organiserName} will let you know what's been picked.
    Keep this link if you need to change your answer: <a href={editUrl}>{editUrl}</a>
  </AlertDescription>
</Alert>
```

The edit link is **on screen, always** (§1 P2.1) — including when no email was given. When the edit-link email failed, add an inline note: "We couldn't email this to you, so copy it now." Focus moves to the alert (`tabIndex={-1}`, `ref.current?.focus()`) so screen-reader users are not left at the bottom of a form that has vanished. The h1 already on the page (the poll title) stays put.

**Accessibility summary for this screen.**
- One `role="radiogroup"` **per option card**, each named by that card's `<Heading level={3}>` via `aria-labelledby`. Never `role="grid"`.
- Every answer state carries a glyph *and* a word, so it survives greyscale and colour-vision deficiency (WCAG 1.4.1).
- Every tile is 56px tall and at least a third of a 375px viewport wide — well past 44×44.
- The option list is `<fieldset>`-free (a fieldset around nested radiogroups is noisy in VoiceOver); the "Tap one answer for each option" line is associated with the list via `aria-describedby` on the list container.
- Keyboard: `Tab` moves between option cards, arrow keys move within a card's three answers — native radio behaviour, free.

---

### 2.4 Screen 4 — Organiser results

**Route:** `/availability/o/[token]` → `src/app/availability/o/[token]/page.tsx`, where `[token]` is `polls.organiser_token`.

**Composition:** **Server Component**. It resolves the organiser token, fetches the poll, its options (ordered by `position`), its participants and every response, and renders the matrix as static HTML. Zero client JS for the table itself — a table of at most 8 columns does not need hydrating, and server-rendering it means the organiser sees results the instant the page paints. `export const dynamic = 'force-dynamic'` — results must never be cached.

The client boundaries are `<ClosePollControl />` (`src/components/availability/close-poll-control.tsx`), which owns confirm and its dialogue, and the close/reopen, delete-response and delete-poll controls, each of which needs a `Dialog`.

> **NET NEW pattern warning — `revalidatePath`.** When the organiser confirms an option, closes, reopens or deletes a response, `/availability/o/[token]` and `/availability/p/[token]` must both re-render. **`revalidatePath` does not appear anywhere in `src/`** — `grep -rn 'revalidatePath' src/` returns nothing. Introducing it here is a **new pattern for this repo**, not a copy of an existing one. Per **R8** it is called anyway: with `dynamic = 'force-dynamic'` on both routes it is belt-and-braces, but the behaviour must not depend on a single `dynamic` export surviving a future refactor.

**Layout at 375px**
Header block first, full width: `<Heading level={1}>` (poll title), `<Text color="muted">` reply count, then the **best-option summary** — the single most useful thing on the page and the reason it sits above the matrix, because the matrix requires horizontal scrolling on a phone and the summary does not.

Summary block:

```tsx
<Card variant="bordered" padding="medium" className="mt-6">
  <Heading level={2} className="text-xl">Best so far</Heading>
  <Text className="mt-2">
    {formatSlotRangeInLondon(best.starts_at, best.ends_at)} UK time
  </Text>
  <Text size="sm" color="muted" className="mt-1">
    {yesPct}% said yes, {ifNeedBePct}% said if need be.
  </Text>
  <ClosePollControl organiserToken={token} optionId={best.id} />
</Card>
```

Percentages, not counts, in the summary — per the standing rule, proportions are presented as percentages. Denominator is the number of participants who have replied to this poll (`count(distinct participant_id)`), not the number of `poll_responses` rows. Ranking rule, per §1 O3.5: yes count descending, then if-need-be count descending, then `poll_options.position` ascending. **The card is suppressed entirely** when there are zero replies (no denominator), and per §1 O3.9 when no option has any yes or if-need-be. Per §1 O3.6, every tied option carries the badge. The raw "who said what" lives in the matrix below.

Then the matrix, in its scroll container, full-bleed to the viewport edge on mobile (`-mx-4`) so the scrollable area is obviously scrollable and the first column can sit flush.

**Layout at desktop**
Header and summary in a `md:grid md:grid-cols-[2fr_1fr] md:gap-8 md:items-start` — title block left, summary card right. The matrix sits full width below, still inside the scroll container (it may still overflow at 8 options × many respondents, and a container that only sometimes scrolls is worse than one that always can).

**The matrix**

This screen **is** the matrix — horizontally scrollable, sticky header row and sticky first column. Hand-rolled rather than using `src/components/ui/table.tsx`: that component is an unstyled wrapper with its own `overflow-auto` div and no sticky support, and fighting it costs more than writing the six elements below.

```tsx
<div
  tabIndex={0}
  role="region"
  aria-labelledby="results-table-caption"
  className="relative -mx-4 overflow-x-auto overflow-y-visible px-4
             focus:outline focus:outline-2 focus:outline-offset-2
             focus:outline-[var(--color-focus-ring)] sm:mx-0 sm:px-0"
>
  <table className="w-full min-w-[640px] border-collapse text-sm">
    <caption id="results-table-caption" className="sr-only">
      Who can make each option. Rows are people, columns are the options you put up.
    </caption>
    <thead>
      <tr>
        <th scope="col"
          className="sticky left-0 top-0 z-20 bg-white p-3 text-left font-semibold text-charcoal">
          Name
        </th>
        {options.map((o) => (
          <th key={o.id} scope="col"
            className="sticky top-0 z-10 min-w-[8rem] bg-white p-3 text-left font-semibold text-charcoal">
            <span className="block">
              {formatDateInLondon(toLocalIsoDate(o.starts_at), 'short')}
            </span>
            <span className="block font-normal text-charcoal-light">
              {formatSlotRangeInLondon(o.starts_at, o.ends_at)}
            </span>
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {participants.map((p) => (
        <tr key={p.id} className="border-t border-border">
          <th scope="row"
            className="sticky left-0 z-10 bg-white p-3 text-left font-medium text-charcoal">
            {p.display_name}
          </th>
          {options.map((o) => {
            const a = answersByParticipant[p.id]?.[o.id] ?? null;
            return (
              <td key={o.id} className="p-3">
                <span className={cn('inline-flex min-h-[32px] min-w-[32px] items-center justify-center gap-1 rounded-md px-2 py-1', cellClass(a))}>
                  <span aria-hidden="true">{glyph(a)}</span>
                  <span className="sr-only">{answerLabel(a)}</span>
                  <span aria-hidden="true" className="hidden sm:inline">{answerLabel(a)}</span>
                </span>
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

Non-negotiables in that markup:
- **Semantic `<table>`** with a real `<thead>`, `<th scope="col">` on every column header and `<th scope="row">` on every name cell. Not divs, not `role="grid"`.
- Rows are `poll_participants` (name from `display_name`), not `poll_responses`. `a` is `null` — rendered as "Not answered" — when no `poll_responses` row exists for `(p.id, o.id)`. There is no `'not_answered'` enum value; absence is the state.
- Per §1 O3.2 each cell's accessible name must be self-contained: the `sr-only` span reads name, option and state together ("Peter, Tuesday, 14 July 2026 at 2:00pm, if need be"), not just the state. Per §1 E3, duplicate `display_name`s are disambiguated in the row header's accessible name by `formatDateInLondon(toLocalIsoDate(created_at), 'short')` → "Sarah, answered Fri 3 Jul".
- Column dates come from `toLocalIsoDate(o.starts_at)`. `poll_options.option_date` is NULL on every option this tool creates (`option_kind = 'slots'`); reading `o.date` returns `undefined` and `formatDateInLondon` throws.
- The scroll container has `tabIndex={0}`, `role="region"` and an accessible name via `aria-labelledby` pointing at the `<caption>` — a keyboard-only user must be able to scroll it, and a scrollable region needs a name to be announced.
- `<caption className="sr-only">` supplies both the accessible name and an explanation of the axes.
- Sticky first column is `sticky left-0` with an explicit `bg-white` and `z-10` (the top-left corner cell needs `z-20` to sit above both). Sticky requires a non-transparent background or rows scroll visibly underneath.
- `overflow-y-visible` alongside `overflow-x-auto` is intentional so sticky headers still work vertically.
- **`<Section>` applies `overflow-hidden`** (`Section.tsx:44`) — same trap as screen 3. Render the table outside `<Section>`, in a plain `<div className="max-w-6xl mx-auto px-4 sm:px-6">`.
- Every cell carries a glyph, an `sr-only` name, and a visible word from `sm:` up. At 375px the visible word is hidden to keep columns narrow, but the glyph plus the fill remain and the `sr-only` text keeps it announced — the glyph alone is still a non-colour signal, satisfying 1.4.1.
- `text-charcoal-light` is `#324A68` on white — a contrast ratio comfortably above 4.5:1.

**Legend.** Directly below the table, because a glyph key that requires scrolling back is no key at all:

```tsx
<ul className="mt-4 flex flex-wrap gap-4">
  {/* one <li> per state: the same glyph chip + the same word */}
</ul>
```

Copy: "✓ Yes · ~ If need be · ✕ No · – Not answered".

**Totals row.** A `<tfoot>` per §1 O3.1 and O3.4, with `<th scope="row">Totals</th>` and one `<td>` per option. Each cell carries **the counts as text first** — "4 yes · 1 if need be · 2 no" — then the three-`<div>` proportional bar from §1 O3.4 (`aria-hidden="true"`, inline `hsl(var(--chart-N))` fills, **never** `bg-chart-N`, **never** `ui/progress`). The summary card above uses percentages; the table foot uses counts, because a per-cell percentage next to a per-cell count is noise.

**Share block.** Above the matrix, the participant link (built from `polls.participant_token`) in the same `select-all` bordered box as screen 2, labelled "Your team's link", with copy: "Send this to anyone you still need an answer from."

**Loading state.** `src/app/availability/o/[token]/loading.tsx`:

```tsx
<div className="max-w-6xl mx-auto space-y-6 px-4 py-10">
  <Skeleton className="h-9 w-1/2" />
  <Skeleton className="h-4 w-1/3" />
  <Skeleton className="h-32 w-full rounded-lg" />
  <Skeleton className="h-64 w-full rounded-lg" />
</div>
```

**Error state.** Invalid or unknown organiser token → the shared "not live" page from §1 E6 with HTTP 404, byte-identical to every other cause. Data-layer exceptions fall to `error.tsx` with the same copy as screen 2's boundary.

**Empty state.** Nobody has replied yet — the matrix is not rendered at all (an empty `<tbody>` with sticky headers is a confusing artefact). Instead, per §1 O3.7:

```tsx
<Card variant="bordered" padding="large" className="text-center">
  <Heading level={2} align="center" className="text-xl">Nobody has voted yet</Heading>
  <Text align="center" color="muted" className="mt-2">
    Here's your participant link again, and a nudge is usually all it takes.
  </Text>
</Card>
```

The share block still renders above it — the empty state is precisely when the organiser needs that link most. The "Best so far" card is suppressed while there are zero replies.

**Closed state.** `polls.status = 'closed'`. Banner: `<Alert variant="default" role="status" className="border-charcoal bg-surface-alt">` — "Closed — nobody can vote or change their answer." Everything the open view showed still renders, plus a **"Reopen the poll"** control calling `setPollOpen(token, true)` (§1 O5.2/O5.3). Confirm stays available (**R6**).

**Confirmed state.** `polls.status = 'confirmed'` with `polls.confirmed_option_id` set. The summary card is replaced by:

```tsx
<Alert variant="default" role="status"
  className="border-orange bg-orange-light text-charcoal">
  <AlertTitle>You've picked a time</AlertTitle>
  <AlertDescription>
    Confirmed for {formatSlotRangeInLondon(o.starts_at, o.ends_at)} UK time. If it falls
    through, tell people yourself and build a fresh poll — we won't quietly move a date
    that's already in their calendar.
  </AlertDescription>
</Alert>
```

Plus a legacy `<Button variant="outline" size="medium" href="/availability/new">Build a fresh poll</Button>` (§1 O7.2). There is **no** un-confirm control (§1 O7.1). "Delete this poll" stays (§1 O7.3). When `confirm_notify_failures > 0`, the `role="status"` note from §1 O6.6 and §4.4 renders here with the copyable block. The matrix remains visible and read-only; the confirmed column gets `className="bg-orange-light"` on its `<th>` and cells plus a `<span className="sr-only">Chosen option. </span>` prefix inside the `<th scope="col">` — again, never colour alone. The delete-response controls are not rendered, and `deleteResponse` refuses server-side (§1 O4.4).

**`<ClosePollControl />` — Client Component**

`'use client'`. Props: `{ organiserToken: string; optionId: string }`. Renders a legacy `<Button variant="primary" size="medium" type="button" loading={isPending} fullWidth className="mt-4 md:w-auto">` reading **"Confirm this time"**. Clicking opens the shadcn `<Dialog>` (present at `src/components/ui/dialog.tsx`) for confirmation, since confirming is irreversible:

- Dialog title: "Confirm this time?"
- Dialog body: "{formatSlotRangeInLondon(starts_at, ends_at)} UK time. This locks the poll. You can't undo it from here."
- On a zero-response poll, the body instead reads: "Nobody voted, so this is your call." followed by the same lock warning (§1 E1).
- Confirm: legacy `<Button variant="primary" size="medium" type="button" loading={isPending}>` — "Yes, confirm it"
- Cancel: legacy `<Button variant="ghost" size="medium" type="button">` — "Not yet"

The action sets `polls.confirmed_option_id = $optionId` **and** `polls.status = 'confirmed'` in one statement, guarded by `where organiser_token = $1 and status in ('open','closed')` (per **R6** and §1 E13) so a double-submit is a no-op rather than a re-confirmation and a re-mailing. `confirmed_option_id` is a **simple** FK to `poll_options(id)`, so the action must re-check `poll_id` rather than trusting the client-supplied `optionId` (§1 O6.3) — the database will not catch it.

On failure: `<Alert variant="destructive" role="alert">` inside the dialog — "We couldn't confirm that. Try again in a moment." The dialog stays open.

Radix `<Dialog>` traps focus and closes on Escape out of the box, satisfying the project's modal accessibility bar without extra work. The same `Dialog` pattern serves "Delete this response" (§1 O4.1 — names the participant) and "Delete this poll" (§1 O8.1 and §3.6.8 — requires typing the poll title, because it destroys third-party data).

**Microcopy**

- H1: the poll title.
- Sub-line: "{n} people have replied." · `n === 1`: "One person has replied." · `n === 0`: "Nobody's replied yet." Never "{n} of {m}" — the schema has no headcount to divide by.
- Share block label: "Your team's link" · helper: "Send this to anyone you still need an answer from."
- Summary heading: "Best so far"
- Summary stat: "{yesPct}% said yes, {ifNeedBePct}% said if need be."
- Tie line, shown when two or more options tie: "Two options are level. Pick whichever suits you."
- Everybody-said-no banner (§1 E2): "Nothing here works for anyone. Build a fresh poll with different times."
- Table caption (sr-only): "Who can make each option. Rows are people, columns are the options you put up."
- Totals row header: "Totals"
- Legend: "✓ Yes · ~ If need be · ✕ No · – Not answered"

**Accessibility summary for this screen.**
- Real semantic table, `<thead>`, `<th scope="col">` / `<th scope="row">`, `<caption>`, `<tfoot>`.
- Scroll container: `tabIndex={0}` + `role="region"` + accessible name.
- Every cell state has a glyph and self-contained screen-reader text; fill colour is decorative reinforcement only.
- All interactive controls hit 44px via the legacy `ButtonAdapter` sizes (`small` and `medium` = `min-h-[44px]`, `large` = `min-h-[48px]`).
- Focus outlines use `--color-focus-ring` (→ `#FF8901`) throughout for consistency with the vote screen.

---

### 2.5 Component inventory

**Existing, used as-is:**
`Section`, `Box`, `Heading` (legacy default export → `HeadingAdapter`), `Text` (legacy default export → `TextAdapter`), `Button` (legacy default export → `ButtonAdapter`), `Card` (legacy default export → `CardAdapter`, **without** the `background` prop), `Input` (`ui/input`), `Textarea` (`ui/textarea`), `Alert` / `AlertTitle` / `AlertDescription` (`ui/alert`), `Dialog` (`ui/dialog`), `Badge` (`ui/badge`, for the "Best so far" marker, always alongside the words), `Skeleton` (`ui/skeleton`), the `ui/form.tsx` set (`Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage` — all exported), `Container` (only on the routes that do not use `Section`).

**Deliberately not used:** `Grid` (dynamic class construction), `ui/table.tsx` (no sticky support; its wrapper `overflow-auto` fights ours), `ui/progress.tsx` (hardcoded `bg-primary`, single `value` — cannot segment), `<Select>` (native date/time inputs are better here), `<Checkbox>` (wrong semantics for a single-choice answer), the raw shadcn `<Button>` (charcoal `--primary`, sub-44px heights — **R7**), any toast (does not exist).

**NET NEW files:**

| Path | Kind |
|---|---|
| `src/components/availability/answer-radio-group.tsx` | Client. Fully specified above. Native radios, no new dependency. |
| `src/components/availability/create-poll-form.tsx` | Client. Copies `src/components/forms/contact-form.tsx` in structure, but uses the legacy `Button` adapter, not `ui/button`. |
| `src/components/availability/vote-form.tsx` | Client. |
| `src/components/availability/close-poll-control.tsx` | Client. |
| `src/components/availability/results-matrix.tsx` | Server. The table markup above, extracted for testability. |
| `src/app/availability/new/page.tsx` | Server |
| `src/app/availability/verify/[token]/page.tsx` + `loading.tsx` + `error.tsx` | Server / Server / Client |
| `src/app/availability/p/[token]/page.tsx` + `loading.tsx` + `error.tsx` | Server / Server / Client |
| `src/app/availability/p/[token]/edit/[editToken]/page.tsx` | Server |
| `src/app/availability/o/[token]/page.tsx` + `loading.tsx` + `error.tsx` | Server / Server / Client |

**NET NEW outside this section, but blocking it:** `sendPollEmail` in `src/lib/email.ts` (the existing `sendLeadNotification` hardcodes its recipient). Screens 1 and 2 do not work without it.

**NET NEW dependencies: none for the UI.** Everything above is built from what is already installed. (`ics`, `@upstash/ratelimit` and `@upstash/redis` are added by §3 and §4, not by these screens.)

**Commit-gate check.** `scripts/check-growth-language.mjs` and `scripts/check-british-english.mjs` scope themselves to an explicit `FILE_TARGETS` list plus the `content/` directories; nothing under `src/app/availability/**` or `src/components/availability/**` is in scope, so neither hook inspects these files at build. All copy above is nevertheless clean against both rule sets — no banned cost-reduction verb, and British spelling throughout ("colour", "artefact", "centred", "organiser"). Keep it that way.

---

## 3. Server actions, validation, errors, security

Everything in this section lives in `src/app/actions/polls.ts` (server actions, **NET NEW**), `src/app/api/cron/poll-retention/route.ts` (the Phase 5 sweep, **NET NEW**), `src/lib/poll-tokens.ts` (**already built** — read it before writing anything token-related), `src/lib/rate-limit.ts` (**NET NEW**), `src/lib/validation/polls.ts` (**NET NEW**, Zod schemas), `src/lib/db/polls.ts` (data layer, **NET NEW** — Phase 1 delivered the migration, not this module) and two additions to `src/lib/email.ts` (**NET NEW**, §4).

All eight actions are public and unauthenticated. There is no user auth on this site — `src/lib/db/supabase-admin.ts` exposes a service-role client only, RLS is enabled on all four poll tables with zero policies, and no anon/cookie client exists anywhere. **RLS cannot protect these tables. Holding a token is the whole authorisation model, and every action must resolve its token server-side before it touches a row.**

**Runtime facts a reader must not get wrong:** `next` is `^14.2.32` (not 15), so `headers()` from `next/headers` is **synchronous** and returns a `ReadonlyHeaders`, not a `Headers`. `zod` is `4.3.5`. `uuid ^11.1.0` and `pg ^8.21.0` are installed. Ids are generated with `import { randomUUID } from 'crypto';`, exactly as `src/lib/db/leads.ts:1` does — do not reach for the `uuid` package.

---

### 3.1 Shared contract

The repo's existing shape (`src/app/actions/contact.ts`, `src/app/actions/newsletter.ts`) is exactly:

```ts
Promise<{ success?: boolean; error?: string }>
```

Both keys optional, no discriminated union, no `data` field. Callers check `result.error`, then assume success. **Keep that contract for six of the eight actions.**

Two actions must widen it, and this is a deliberate, recorded departure:

```ts
// src/app/actions/polls.ts

/** The repo's existing action contract, unchanged. */
export interface PollActionResult {
  success?: boolean;
  error?: string;
}

/**
 * createPoll and submitResponse each hand back one URL the caller must render.
 * The extra key is additive and optional: `result.error` is still the only check
 * a caller has to make, so this does not break the established pattern — it
 * extends it in the one place the product genuinely needs a value returned.
 */
export interface CreatePollResult extends PollActionResult {
  /** Where to send the organiser next: the "check your inbox" page. Never a token URL. */
  nextPath?: string;
}

export interface SubmitResponseResult extends PollActionResult {
  /**
   * The participant's own edit link, absolute, on www.orangejelly.co.uk.
   * Rendered on screen immediately after voting. This is the product mitigation
   * for duplicate participants — see §3.5.
   */
  editUrl?: string;
}
```

**Departure 2 — Zod on the server.** `zod 4.3.5` is installed and used client-side (`src/components/forms/contact-form.tsx`), but no server action imports it; server validation today is hand-rolled if-chains (`contact.ts:48-60`). Nested date/slot/vote payloads make that unworkable. This feature introduces server-side Zod. It is a new pattern, not an existing one — call it out in the PR.

**Kept verbatim from `contact.ts`:**
- Honeypot first: an optional `website?: string`; if truthy, return `{ success: true }` **without writing anything** (`contact.ts:45-47`). Copy exactly.
- Persist first, then best-effort side-effects in a `try/catch` that can never turn a stored write into a user-facing error, with a `[polls]`-tagged `console.error` (`contact.ts:70-83`).
- No auth check, no permission check, no `logAuditEvent` — none of that exists here.

**Departure 3 — `revalidatePath`.** No action in this repo calls it (`grep -rn 'revalidatePath' src/app/actions/` returns nothing). Per **R8** it is nevertheless called on every state-changing action, for the paths listed in §1 P3.7. Poll pages render server-side and are `export const dynamic = 'force-dynamic'`, so this is belt-and-braces rather than load-bearing — but the behaviour must not depend on a single `dynamic` export surviving a refactor. `force-dynamic` on every `/availability/*` dynamic route stays mandatory regardless: the comment at `next.config.js:33-38` documents a real past bug where page logic no-op'd because the route rendered statically.

**Departure 4 — errors surface.** `leads.ts` swallows failures into `{ stored: false }` plus a `console.error`. `src/lib/db/polls.ts` returns `{ stored: boolean; id?: string; error?: string }` — the same shape as `leads.ts`'s internal `StoredResult`, which is **not exported**, so `polls.ts` declares and exports its own. The actions must map a genuine database failure to a real user-facing message. A silently dropped vote is a correctness bug users notice.

**Which client.** `src/lib/db/polls.ts` uses `getSupabaseAdminClient()` from `src/lib/db/supabase-admin.ts`, guarded by `isSupabaseAdminConfigured()`. The repo also ships a node-postgres pool (`dbQuery`, `src/lib/db/client.ts:39`) which `leads.ts` uses as a fallback when Supabase is not configured (`leads.ts:360-372`). **The poll layer does not use the `pg` fallback.** One configured path, one set of failure modes. This matters for §3.6.1 and §3.6.3: supabase-js has no transaction, so multi-table writes compensate instead.

---

### 3.2 Token generation — **already implemented, do not rewrite**

`src/lib/poll-tokens.ts` exists with `src/lib/poll-tokens.test.ts` alongside it. It satisfies the whole brief:

```ts
import { randomBytes } from 'crypto';

export const TOKEN_LENGTH = 22;        // 22 base64url characters
const TOKEN_BYTES = 16;                // 16 bytes drawn → 128 bits of real entropy
export const TOKEN_ENTROPY_BITS = TOKEN_BYTES * 8;

export function generateToken(): string;
export function generatePollTokens(): PollTokens;   // { participantToken, organiserToken, editToken }
export function isWellFormedToken(value: unknown): value is string;
export function scrubTokens(text: string): string;
```

Properties the implementation already guarantees, and which the actions rely on:

- **CSPRNG only.** `randomBytes`, never `Math.random()`, never a UUID, never a counter.
- **≥128 bits.** 16 bytes drawn = 128 bits of entropy; base64url encodes them into 22 characters (≈132 bits of *encoding* space — the entropy is the 128 that were drawn, and `TOKEN_ENTROPY_BITS` states it honestly).
- **Independent draws.** `generatePollTokens()` calls `generateToken()` three times. Nothing is derived from anything else and nothing is derived from `polls.id`. A participant holding `participant_token` cannot compute `organiser_token`.
- **base64url, not hex** — same entropy in fewer characters, URL-path-safe with no `+`, `/` or `=`.

**Rules for every action:**

1. Call `generatePollTokens()` once in `createPoll` for the poll's `participant_token` and `organiser_token`, and `generateToken()` once more for its `verify_token` — a fourth independent draw (per **R2**). Do not widen `generatePollTokens()`; the verify token stays a separate call so it stays an independent draw. Call `generateToken()` once per new `poll_participants` row for its `edit_token`. Never reuse the `editToken` that `generatePollTokens()` returns for a per-participant row unless you are creating that participant in the same call.
2. Every action that receives a token calls `isWellFormedToken(token)` **before** any database round-trip. A malformed token returns the same message as a non-existent one — never a distinguishable error, or the endpoint becomes an oracle.
3. All four columns are `text unique` (`participant_token`, `organiser_token` and `edit_token` are `not null`; `verify_token` is nullable so it can be nulled on use). A unique violation on insert is a CSPRNG collision at 2⁻¹²⁸, i.e. never. Do not retry; let it surface as a generic write failure and log it, because it means something is broken, not unlucky.
4. Token lookups use `.eq('participant_token', token)` / `.eq('organiser_token', token)` / `.eq('edit_token', token)` / `.eq('verify_token', token)` against the unique index. Never `LIKE`, never `ilike`.

**Log scrubbing — mandatory.** Every `console.error` / `console.info` in `src/app/actions/polls.ts`, `src/lib/db/polls.ts`, `src/lib/poll-emails/**` and the cron route passes its message through `scrubTokens()`:

```ts
console.error('[polls] Vote not stored:', scrubTokens(String(err)));
```

Never log a raw token, a raw poll URL, or an unscrubbed error from Supabase (the client echoes filter values into error strings). `scrubTokens` is deliberately shape-based, so it catches a token embedded in a URL or an error body; its lookarounds leave UUIDs intact, which is the identifier worth having in a log.

---

### 3.3 Referrer-Policy: `no-referrer` on token pages — **middleware change required**

`src/middleware.ts:44` currently sets `Referrer-Policy: strict-origin-when-cross-origin` on every matched route. That sends `https://www.orangejelly.co.uk` (origin only) cross-origin — which is fine for the rest of the site and **not** fine here, because `strict-origin-when-cross-origin` sends the **full URL, path and all, on same-origin navigations**, and the token is in the path.

The tokens are capability URLs. Anything that reads `Referer` — an outbound link, an embedded resource, an analytics beacon, a proxy, an error reporter — receives the whole capability. Anyone holding `/availability/o/<token>` is the organiser, permanently.

**Change** `applySecurityHeaders(response)` (`src/middleware.ts:40`) to take the pathname and override:

```ts
const TOKEN_PATH_PATTERN = /^\/availability\/(p|o|verify)\//;

function applySecurityHeaders(response: NextResponse, pathname: string) {
  response.headers.set(
    'Referrer-Policy',
    TOKEN_PATH_PATTERN.test(pathname) ? 'no-referrer' : 'strict-origin-when-cross-origin'
  );
  // ...everything else unchanged
}
```

`/availability/verify/` is in the pattern because the magic-link token is equally a capability. The middleware matcher (`src/middleware.ts:138`) is `'/((?!api|_next/static|_next/image|favicon.ico).*)'` — it excludes only `api`, `_next/static`, `_next/image` and `favicon.ico`, so `/availability/*` is already matched and **no matcher edit is needed**. There are **four** `applySecurityHeaders(...)` call sites (`src/middleware.ts:91, 111, 123, 126`) and every one must pass `url.pathname`.

Reinforcing rules, which the pages must honour and the actions must not undermine:
- **No third-party resources on a token page.** No GTM, no Clarity, no external image, no external font. Any of them turns the `Referer` header into a leak even with `no-referrer` set, if the policy is ever loosened.
- **No token in an `<a href>` to an external destination** from a token page.
- **Every emailed and returned URL uses `https://www.orangejelly.co.uk`**, never the apex. `vercel.json:15-27` adds a platform-level apex→www redirect that fires before middleware. (Accuracy note, per §4: it sets `"permanent": true`, which Vercel emits as a **308**, and a 308 preserves the method and body — so an apex link would not in fact drop a POST. The `www` rule stands on canonicalisation, not on that.) `src/middleware.ts:116-124` guards its own apex redirect with `isGetOrHead`.

---

### 3.4 Rate limiting — `src/lib/rate-limit.ts` (**NET NEW**, Phase 2a)

**Nothing exists today.** No `@upstash/ratelimit`, no `@upstash/redis`, no rate-limit code anywhere in `src/`. `src/middleware.ts` sets security headers only. `submitContactForm`, `subscribeToNewsletter` and `POST /api/events` are all unauthenticated, unthrottled public writes protected by a honeypot alone. That is the cautionary precedent, not the model.

**Dependencies (NET NEW):** `@upstash/ratelimit`, `@upstash/redis`. Env: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `RATE_LIMIT_KEY_PEPPER`. **All three go in `.env.example`**, which currently documents only the Supabase and Resend/`CONTACT_*` vars.

```ts
// src/lib/rate-limit.ts
import { createHash } from 'crypto';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

/** The complete set of buckets. Adding one means adding it here first. */
export type RateLimitBucket =
  | 'poll_create_ip'
  | 'poll_create_email'
  | 'poll_verify_ip'
  | 'poll_respond_ip'
  | 'poll_respond_poll'
  | 'poll_update_ip'
  | 'poll_organiser_ip';

/** Window per bucket. Sliding window throughout — no fixed windows, no token buckets. */
const BUCKETS: Record<RateLimitBucket, { limit: number; window: `${number} ${'s' | 'm' | 'h' | 'd'}` }> = {
  poll_create_ip:    { limit: 3,  window: '1 h' },
  poll_create_email: { limit: 5,  window: '1 d' },
  poll_verify_ip:    { limit: 20, window: '1 h' },
  poll_respond_ip:   { limit: 20, window: '1 h' },
  poll_respond_poll: { limit: 60, window: '1 d' },
  poll_update_ip:    { limit: 30, window: '1 h' },
  poll_organiser_ip: { limit: 30, window: '1 h' },
};

export interface RateLimitResult {
  allowed: boolean;
  /** Seconds until the window resets. For the user-facing message. */
  retryAfterSeconds: number;
}

/**
 * True only when Upstash AND the pepper are configured.
 *
 * The pepper is part of the configuration, not an optional extra: without it,
 * hashKey() is an unpeppered SHA-256, which is reversible across the whole IPv4
 * space and across any list of email addresses. An unpeppered limiter is a
 * limiter that stores PII, so it counts as not configured.
 */
export function isRateLimitConfigured(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL &&
      process.env.UPSTASH_REDIS_REST_TOKEN &&
      process.env.RATE_LIMIT_KEY_PEPPER
  );
}

/**
 * Hashes an identifier before it becomes a rate-limit key.
 *
 * Applies to IP addresses AND email addresses. Both are personal data under
 * GDPR, and an email address is the more identifying of the two — peppering the
 * IP while writing the address in clear would be theatre. A peppered SHA-256 is
 * a stable key with no way back to the value, and Upstash expires it with the
 * window.
 *
 * Throws when the pepper is absent rather than degrading silently. Callers
 * gate on isRateLimitConfigured() first, so this is unreachable in practice
 * and is a loud failure if the gate is ever removed.
 */
export function hashKey(value: string): string {
  const pepper = process.env.RATE_LIMIT_KEY_PEPPER;
  if (!pepper) throw new Error('RATE_LIMIT_KEY_PEPPER is not configured.');
  return createHash('sha256').update(`${pepper}:${value}`).digest('hex').slice(0, 32);
}

/**
 * Reads the client IP the way Vercel presents it.
 *
 * Structurally typed, not `Headers`: on next 14 `headers()` returns a
 * ReadonlyHeaders, which is not assignable to Headers.
 */
export function getClientIp(headers: { get(name: string): string | null }): string {
  return headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

export async function checkRateLimit(
  bucket: RateLimitBucket,
  key: string
): Promise<RateLimitResult>;
```

`getClientIp` falls back to `'unknown'`, which shares one bucket across every caller with no `x-forwarded-for`. On Vercel the header is always present, so this is a local-development and misconfiguration path, not a production one — accepted, and named here so nobody treats it as a bug.

**Limits.** Named buckets, all sliding-window. **Every key is passed through `hashKey()`; a `polls.id` is a uuid we minted and is hashed too, purely so one code path handles every bucket.**

| Bucket | Action | Key | Limit | Why |
|---|---|---|---|---|
| `poll_create_ip` | `createPoll` | `hashKey(getClientIp(headers()))` | **3 per hour** | Poll creation triggers outbound mail on the OJ sending domain. This is the open-relay surface. |
| `poll_create_email` | `createPoll` | `hashKey(organiserEmail)` — already lower-cased by Zod | **5 per day** | Stops one address enumerating the rate limit across a proxy pool. |
| `poll_verify_ip` | `verifyOrganiserEmail` | `hashKey(ip)` | **20 per hour** | Brute-forcing a 128-bit token is impossible; the limit exists to stop the endpoint being used as a database load generator. |
| `poll_respond_ip` | `submitResponse` | `hashKey(ip)` | **20 per hour** | Generous: a whole pub team can share one NAT'd connection. Tight enough to stop matrix-flooding. |
| `poll_respond_poll` | `submitResponse` | `hashKey(polls.id)` | **60 per day** | Per-poll cap. An 8-option poll with 60 responders is already beyond the design point; past that it is abuse. Enforced **after** token resolution, so it needs the poll row first. |
| `poll_update_ip` | `updateResponse` | `hashKey(ip)` | **30 per hour** | Editing is cheap and expected to be repeated. |
| `poll_organiser_ip` | `setPollOpen`, `confirmOption`, `deleteResponse`, `deletePoll` | `hashKey(ip)` | **30 per hour**, shared bucket | `confirmOption` fans out email to everyone invited — the second-largest mail amplifier after creation. |

**Ordering inside an action:** honeypot → Zod parse → IP-keyed limit → token resolution → poll-keyed limit → state checks → write. The IP limit sits before the token lookup so a flood never reaches the database; the poll limit sits after, because it needs the poll id.

**Fail-closed on the mail-sending paths, fail-open on the rest.** If `isRateLimitConfigured()` is false or Upstash throws:

- `createPoll` and `confirmOption`: **refuse**. Return the fail-closed message for that action and `console.error('[polls] Rate limiter unavailable — refusing to create.')` (or `— refusing to confirm.`). An unthrottled endpoint that sends mail on the OJ domain is exactly the deliverability risk this feature must not take. Losing a poll is recoverable; a burned sending domain is not.
- Everything else: **allow**, and `console.error('[polls] Rate limiter unavailable — allowing <action>.')`. A voter losing their vote because Upstash blipped is a worse outcome than an unthrottled vote.

**User-facing copy on a limit hit** (identical shape everywhere, no bucket named — do not tell an attacker which limit they hit; binding per **R10**):

> `'Too many attempts. Please try again in a few minutes.'`

**Turnstile is out of scope for this section.** It is Phase 2a, gates `createPoll` only, and needs `challenges.cloudflare.com` in `script-src`, `frame-src` **and** `connect-src` in `src/middleware.ts:57-75`. Nothing for it exists in the repo.

---

### 3.5 The duplicate-participant constraint — stated once, honoured everywhere

`submitResponse` **cannot upsert `poll_participants`.** An upsert needs a unique conflict target and a first-time responder has none: `display_name` is `text not null` with no unique constraint and is self-asserted, `email` is nullable and optional, and `edit_token` is generated by us at insert time. The table's unique constraints are `id` (primary key), `edit_token` and the composite `poll_participants_id_poll_id_key (id, poll_id)` — **all three are ours, none is the responder's**.

**Therefore: a submission without an `edit_token` always INSERTs a new participant.** The same person voting twice from the participant link appears twice in the organiser's matrix.

**Product mitigations, in the order they are implemented:**

1. **`submitResponse` returns `editUrl` and the page renders it on screen immediately**, not only by email. A returning responder has a token to come back with, and someone who gave no email address still gets their link. This is why `SubmitResponseResult` widens the contract.
2. **`deleteResponse` exists** (§3.6.7), so a duplicate is a nuisance the organiser clears in one click, not a defect.
3. **Do not add** a partial unique index on `(poll_id, lower(email))`. Two colleagues sharing one pub address is common and it would turn a cosmetic duplicate into a hard submission failure for a legitimate user.

Do not engineer identity into an explicitly account-free tool. This is the accepted trade-off and it is recorded here so nobody re-litigates it in review.

---

### 3.6 The actions

#### Shared Zod primitives — `src/lib/validation/polls.ts` (**NET NEW**)

**Message strings.** Poll copy is added to `src/lib/validation-messages.ts` under a new `poll` key on `VALIDATION_MESSAGES` (the keys listed in §1 US-O1), and imported from there — never inlined in a component. **Do not reuse the existing `VALIDATION_MESSAGES.name.*` / `.email.*` entries**: they read `'Name must be at least 2 characters'` and `'Please enter a valid email address'` — no full stop, and third-person where the poll forms address the responder directly. Reusing them would silently change the copy on the contact and newsletter forms if a poll string were ever edited. The schemas below inline their messages for readability; the implementation reads them from `VALIDATION_MESSAGES.poll.*`. British English, present tense, tells the user what to do.

```ts
import { z } from 'zod';
import { isValidIsoDate, getTodayIsoDate, compareIsoDates } from '@/lib/dateUtils';
import { isWellFormedToken } from '@/lib/poll-tokens';

/** A capability token. Shape only — existence is a database question. */
const tokenSchema = z
  .string()
  .refine(isWellFormedToken, { message: 'That link is not valid.' });

/** Matches polls.option_kind. */
const optionKindSchema = z.enum(['dates', 'slots'], {
  message: 'Choose whether the poll is about whole days or specific times.',
});

/** Matches poll_responses.availability. */
const availabilitySchema = z.enum(['yes', 'if_need_be', 'no'], {
  message: 'Choose yes, if need be, or no for every option.',
});

/**
 * A calendar date. Never converted between zones — see the header of
 * src/lib/dateUtils.ts.
 *
 * superRefine with an early return, NOT two chained .refine() calls. Zod runs
 * every refinement in a chain even after an earlier one fails, and
 * compareIsoDates() calls assertIsoDate(), which THROWS on malformed input
 * (src/lib/dateUtils.ts:207, 62-72). Chained, `safeParse('rubbish')` throws an
 * uncaught Error instead of returning { success: false } — verified against the
 * installed zod 4.3.5 — and createPoll 500s on any typo'd date. The order below
 * is load-bearing: nothing calls a dateUtils function until isValidIsoDate has
 * passed.
 */
const isoDateSchema = z.string().superRefine((value, ctx) => {
  if (!isValidIsoDate(value)) {
    ctx.addIssue({ code: 'custom', message: 'Enter a date as YYYY-MM-DD.' });
    return; // Mandatory. compareIsoDates() below throws on anything malformed.
  }
  if (compareIsoDates(value, getTodayIsoDate()) < 0) {
    ctx.addIssue({ code: 'custom', message: 'Dates must be today or later.' });
  }
});

/**
 * An instant. Must carry a zone. `datetime({ offset: true })` rejects a naive
 * '2026-07-14T19:30' — which is the exact shape that silently becomes UTC and
 * puts a 7:30pm pub slot at 8:30pm in July.
 */
const instantSchema = z
  .string()
  .datetime({ offset: true, message: 'Enter a time that includes its time zone.' });
```

`isValidIsoDate` rejects unpadded parts, two-digit years, 30 February and 29 February in a non-leap year (`src/lib/dateUtils.ts:48-66`). `getTodayIsoDate()` is London's date, not UTC's (`src/lib/dateUtils.ts:106`) — between midnight and 01:00 BST those differ, and using `new Date().toISOString()` here would reject a date that is still today in the pub.

---

#### 3.6.1 `createPoll`

```ts
export async function createPoll(input: CreatePollInput): Promise<CreatePollResult>;
```

```ts
const slotSchema = z
  .object({ startsAt: instantSchema, endsAt: instantSchema })
  .refine((s) => new Date(s.endsAt) > new Date(s.startsAt), {
    message: 'Each slot must end after it starts.',
    path: ['endsAt'],
  })
  .refine((s) => new Date(s.endsAt).getTime() - new Date(s.startsAt).getTime() <= 24 * 60 * 60 * 1000, {
    message: 'A slot cannot be longer than 24 hours.',
    path: ['endsAt'],
  });

export const createPollSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, 'Give the poll a title of at least 3 characters.')
      .max(120, 'The title must be 120 characters or fewer.'),
    description: z
      .string()
      .trim()
      .max(1000, 'The description must be 1,000 characters or fewer.')
      .optional(),
    location: z
      .string()
      .trim()
      .max(200, 'The location must be 200 characters or fewer.')
      .optional(),
    organiserName: z
      .string()
      .trim()
      .min(2, 'Your name must be at least 2 characters.')
      .max(50, 'Your name must be 50 characters or fewer.'),
    organiserEmail: z
      .string()
      .trim()
      .toLowerCase()
      .email('Please enter a valid email address.')
      .max(254, 'That email address is too long.'),
    optionKind: optionKindSchema,
    /** Populated when optionKind === 'dates'. */
    dates: z.array(isoDateSchema).optional(),
    /** Populated when optionKind === 'slots'. */
    slots: z.array(slotSchema).optional(),
    closesAt: instantSchema.optional(),
    /** Honeypot. Copy contact-form.tsx:124-131 exactly. */
    website: z.string().optional(),
  })
  // Exactly one option array, matching optionKind. Mirrors poll_options_shape_chk.
  .superRefine((v, ctx) => {
    const list = v.optionKind === 'dates' ? v.dates : v.slots;
    const wrongList = v.optionKind === 'dates' ? v.slots : v.dates;
    const path = v.optionKind === 'dates' ? ['dates'] : ['slots'];

    if (wrongList && wrongList.length > 0) {
      ctx.addIssue({ code: 'custom', path, message: 'A poll is about whole days or specific times, never both.' });
    }
    if (!list || list.length < 2) {
      ctx.addIssue({ code: 'custom', path, message: 'Add at least 2 options for people to choose from.' });
    }
    if (list && list.length > 8) {
      ctx.addIssue({ code: 'custom', path, message: 'A poll can have at most 8 options.' });
    }
    // Duplicate options make the results matrix nonsense.
    if (list) {
      const keys = list.map((o) => (typeof o === 'string' ? o : `${o.startsAt}|${o.endsAt}`));
      if (new Set(keys).size !== keys.length) {
        ctx.addIssue({ code: 'custom', path, message: 'Each option must be different.' });
      }
    }
  })
  .refine((v) => !v.closesAt || new Date(v.closesAt) > new Date(), {
    message: 'The closing time must be in the future.',
    path: ['closesAt'],
  });

export type CreatePollInput = z.infer<typeof createPollSchema>;
```

**The honeypot field markup**, copied from `src/components/forms/contact-form.tsx:124-131` — all five attributes, not four:

```tsx
<input type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" {...form.register('website')} />
```

**The `min(2)` / `max(8)` decision.** Scope §4.2 says "propose 5–8 options" and caps at 8. The cap of 8 is hard and enforced here. The floor is **2**, not 5: a two-option poll is a legitimate use ("Tuesday or Thursday?") and rejecting it would be a defect. The UI guidance stays "5–8 works best"; the server refuses only what is actually broken.

**Flow:**
1. Honeypot: `if (input.website) return { success: true };` — no write, no mail. Runs before `safeParse`, exactly as `contact.ts:45` does.
2. `createPollSchema.safeParse(input)`. On failure return `{ error: firstIssueMessage }` (see §3.7).
3. `checkRateLimit('poll_create_ip', hashKey(getClientIp(headers())))` — fail-closed. `headers()` from `next/headers` is synchronous on next 14; do not `await` it.
4. `checkRateLimit('poll_create_email', hashKey(data.organiserEmail))` — fail-closed.
5. `randomUUID()` for `polls.id` and each `poll_options.id`. Neither column has a database default; the app generates and passes ids in, matching `src/lib/db/leads.ts` exactly.
6. `generatePollTokens()` → `participant_token`, `organiser_token`; the third returned token is discarded (participants do not exist yet). Then `generateToken()` → `verify_token`, with `verify_token_expires_at = now() + 24 hours` (**R2**/**R15**).
7. Compute `expires_at`: **60 days after the later of the last option date and now.** Options are the only anchor at creation; `submitResponse` pushes it forward. `dates` → `londonWallClockToInstant(lastDate, '23:59')` (safe: 23:59 exists on every date, so the spring-gap throw at `dateUtils.ts:181` is unreachable); `slots` → `max(endsAt)`. Then `+ 60 days`.
8. Insert `polls` with `status: 'draft'`, `timezone: 'Europe/London'`, `email_verified_at: null`, then `poll_options` with `position` 0..n-1 in submitted order. **supabase-js has no transaction, and the poll layer does not use the `pg` fallback (§3.1).** So: insert `polls` first; if the `poll_options` insert fails, delete the poll row and return the write-failure message. If the compensating delete *also* fails, log it with `scrubTokens` and return the same message — the orphan is harmless (it is unreachable without options) and `expires_at` is `not null`, so the Phase 5 sweep removes it within 60 days (and within 24 hours via the draft predicate in §4.1).
9. Best-effort: `sendPollEmail({ to: data.organiserEmail, subject, html, text })` (§4) with the verification link `https://www.orangejelly.co.uk/availability/verify/<verify_token>`. Wrapped in `try/catch`; a mail failure never fails the call. `escapeHtml()` (`src/lib/email.ts:7`) every user-supplied value — the title is attacker-controlled and lands in HTML mail.
10. Return `{ success: true, nextPath: '/availability/new/check-your-inbox' }`. **Never return any token.** The organiser gets the verify link by email; that is what proves they own the address.

**Auth:** none. Anyone can create a poll. The poll is inert until verified — `status: 'draft'` means `submitResponse` refuses it.

**Failure modes:**

| Failure | User sees |
|---|---|
| Honeypot filled | `{ success: true }` — a fake success. No write, no mail. |
| Zod failure | The first issue's message, inline via `FormMessage`. |
| Rate limit hit | `'Too many attempts. Please try again in a few minutes.'` |
| Rate limiter unavailable | `'Poll creation is unavailable right now. Please try again shortly.'` (fail-closed) |
| `polls` insert fails | `'Your poll was not created. Please try again, or message Peter on WhatsApp.'` |
| `poll_options` insert fails | Same message; the orphan `polls` row is deleted first, and the sweep clears it if that delete also fails. |
| Verification mail fails | **`{ success: true }`.** The poll is stored. `console.error('[polls] Poll created but verification mail not sent:', scrubTokens(...))`. The check-your-inbox page carries the "Send it again" control and a WhatsApp route. This is `contact.ts:70-83`'s stated philosophy applied literally. |

---

#### 3.6.2 `verifyOrganiserEmail`

```ts
export async function verifyOrganiserEmail(token: string): Promise<PollActionResult>;
```

```ts
export const verifyOrganiserEmailSchema = z.object({ token: tokenSchema });
```

**Flow:** shape check → `poll_verify_ip` limit (fail-open) → the conditional update, in one statement:

```sql
update polls
set email_verified_at = now(),
    status = 'open',
    verify_token = null,
    verify_token_expires_at = null
where verify_token = $1
  and status = 'draft'
  and verify_token_expires_at > now()
returning id, participant_token, organiser_token, title, organiser_name, organiser_email;
```

Zero rows matched → the "not live" outcome, byte-identical for an unknown token, a consumed token, an expired token and a non-draft poll. One row matched → set `status = 'open'`, render both links, and fire the links email (§4.1) best-effort.

**The token is a separate `verify_token`, not `organiser_token`** (**R2**). Reusing the organiser token would put admin capability in the one email most likely to be forwarded, and would leave that capability permanently valid in an inbox. The verify token is single-use and 24-hour-expiring (**R15**); the trade-off — an email-scanner prefetch consuming it — is accepted, and the links email is why that is survivable.

**Auth:** the token is the authorisation.

**Failure modes:**

| Failure | User sees |
|---|---|
| Malformed token | `'That link is not valid.'` — no database round-trip. |
| Unknown, consumed, expired, or poll not `draft` | `'That link is not valid.'` — **the identical string.** Different copy makes the endpoint an existence oracle. |
| Update fails | `'We could not activate your poll. Please try the link again.'` |

---

#### 3.6.3 `submitResponse`

```ts
export async function submitResponse(
  participantToken: string,
  input: SubmitResponseInput
): Promise<SubmitResponseResult>;
```

```ts
export const submitResponseSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, 'Your name must be at least 2 characters.')
    .max(50, 'Your name must be 50 characters or fewer.'),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Please enter a valid email address.')
    .max(254, 'That email address is too long.')
    .optional()
    .or(z.literal('')),
  votes: z
    .array(z.object({ optionId: z.string().uuid('That option is not valid.'), availability: availabilitySchema }))
    .min(1, 'Choose yes, if need be, or no for every option.')
    .max(8, 'That is more options than this poll has.')
    .refine((v) => new Set(v.map((x) => x.optionId)).size === v.length, {
      message: 'Each option can only be answered once.',
    }),
  website: z.string().optional(),
});

export type SubmitResponseInput = z.infer<typeof submitResponseSchema>;
```

`email` accepts `''` as well as `undefined` because the form posts an empty string for an untouched optional input. **Normalise `''` to `null`** before it reaches `poll_participants.email`, which is nullable — an empty string there is a value that looks like an address and would be mailed.

**Flow:**
1. Honeypot → `{ success: true }`, no write.
2. `submitResponseSchema.safeParse(input)`; `tokenSchema` on `participantToken`.
3. `poll_respond_ip` limit (fail-open).
4. Resolve: `select id, status, closes_at, expires_at from polls where participant_token = $1`.
5. State check: `status` must be `'open'`, and `expires_at > now()` (§1 O9.6). Also refuse if `closes_at` is set and now > `closes_at` (the column is advisory; only `setPollOpen` flips `status`, so this check makes the deadline real without a cron).
6. `poll_respond_poll` limit keyed on `hashKey(polls.id)` (fail-open).
7. **Every `optionId` must belong to this poll and every option must be answered.** `select id from poll_options where poll_id = $1`. Compare the two sets for **equality in both directions** — no unknown option, no missing answer (§1 P1.5, E14). The composite FK `poll_responses_option_fk` (`foreign key (option_id, poll_id) references poll_options(id, poll_id)`) would catch a cross-poll option at the database level, but a `foreign_key_violation` surfacing as a generic write failure is a bad user experience and a bad log line. Check first.
8. **INSERT, never upsert** — see §3.5. In order:
   - `randomUUID()` for `poll_participants.id`; `generateToken()` for its `edit_token`; insert with `poll_id`, `display_name`, `email` (or `null`).
   - Then one insert of the `poll_responses` rows. **Each row needs `id: randomUUID()` (no database default), `poll_id`, `participant_id`, `option_id`, `availability`** — `poll_id` is `not null` and is what the composite FKs check against, so omitting it fails the insert, not just the constraint.
   - If the responses insert fails, delete the participant row and return the write failure. If that delete also fails, log with `scrubTokens` and return the same message; the childless participant is cleared by the sweep with the poll.
9. Push retention out: `update polls set expires_at = <now + 60 days> where id = $1 and expires_at < <now + 60 days>`. "60 days after the last response **or** the last option date, whichever is later" — the guard clause is what implements "whichever is later".
10. Best-effort, in `try/catch`: mail the participant their own edit link **only if they typed an email address themselves**, with the Article 14 privacy notice (§4.3). Mail the organiser a digest — **never one mail per vote**; a 20-person poll must not be 20 emails (§4.2). **The organiser link must never appear in a participant email.**
11. `revalidatePath` for the participant and organiser paths (**R8**).
12. Return `{ success: true, editUrl: 'https://www.orangejelly.co.uk/availability/p/<participantToken>/edit/<editToken>' }`.

**Auth:** `participant_token` grants voting only. It never grants results, close, confirm or delete.

**Failure modes:**

| Failure | User sees |
|---|---|
| Honeypot filled | `{ success: true }`. No write. |
| Malformed / unknown participant token, or expired poll | `'That link is not valid.'` — identical for all. |
| `status === 'draft'` | `'That link is not valid.'` — a draft must not be distinguishable (§1 E7). |
| `status === 'closed'` \| `'confirmed'`, or past `closes_at` | `VALIDATION_MESSAGES.poll.votingClosed` — "Voting has closed on this poll." |
| Option not on this poll, or a missing answer | `'Choose yes, if need be, or no for every option.'` |
| Rate limit hit (either bucket) | `'Too many attempts. Please try again in a few minutes.'` |
| Participant insert fails | `'Your vote was not recorded. Please try again.'` |
| Responses insert fails | Same message; the orphan participant row is deleted first. |
| Edit-link mail fails | **`{ success: true, editUrl }`.** The vote is stored and the link is on screen, which is the primary route anyway. `console.error('[polls] Vote stored but edit link not sent:', scrubTokens(...))`. |
| Organiser digest fails | **`{ success: true, editUrl }`.** Logged, never surfaced. |

---

#### 3.6.4 `updateResponse`

```ts
export async function updateResponse(
  editToken: string,
  input: UpdateResponseInput
): Promise<PollActionResult>;
```

```ts
export const updateResponseSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, 'Your name must be at least 2 characters.')
    .max(50, 'Your name must be 50 characters or fewer.'),
  votes: submitResponseSchema.shape.votes,
  website: z.string().optional(),
});
```

`email` is **not** editable. Changing it would move where a privacy notice already went and buys nothing; a participant who wants a different address votes again and asks the organiser to remove the first row.

**Flow:** honeypot → parse → `poll_update_ip` limit (fail-open) → resolve → state check → verify the option set (both directions, as §3.6.3 step 7) → write → `revalidatePath`.

Resolution is one joined read:

```sql
select p.id, p.poll_id, polls.status, polls.closes_at
from poll_participants p
join polls on polls.id = p.poll_id
where p.edit_token = $1
```

`status` must be `'open'` and not past `closes_at`. Per §1 P2.5, the poll is resolved from the **`editToken`** alone; any `participant_token` in the URL is decoration and is not trusted.

**The write is the only genuine upsert in the design**, and it works precisely because `edit_token` gives the row a stable, unique key that a first-time responder does not have. **It must not mint new ids.** `poll_responses.id` has no database default, so a payload row needs an `id` — and supabase-js emits `ON CONFLICT (...) DO UPDATE SET` for **every column in the payload**, so passing a fresh `randomUUID()` would rewrite the primary key of an existing row on every edit. So:

1. `select id, option_id from poll_responses where participant_id = $1` — build a `Map<optionId, responseId>`.
2. Build the payload: for an option already answered, reuse its existing `id`; for an option answered for the first time (possible only if a previous submission was partial), `randomUUID()`.
3. `.upsert(payload, { onConflict: 'participant_id,option_id' })` against the table's `unique (participant_id, option_id)`.

The `poll_responses_set_updated_at` trigger maintains `updated_at`; do not set it by hand.

Also `update poll_participants set display_name = $1 where id = $2` — its `poll_participants_set_updated_at` trigger handles `updated_at` too.

Push `expires_at` out by the same rule as `submitResponse`.

**No organiser digest on an edit** as a separate mail — but the edit **does** open the digest window (§4.2 counts from `poll_responses.updated_at`, not `poll_participants.created_at`, precisely so an edit is not silently dropped). Mailing on every keystroke-correction is the mail-volume trap this design exists to avoid; the hourly window is what reconciles the two.

**Auth:** `edit_token` grants editing **that one participant's** responses. It grants nothing else — not results, not other participants, not the poll.

**Failure modes:**

| Failure | User sees |
|---|---|
| Malformed / unknown edit token | `'That link is not valid.'` — identical for both. |
| Poll `draft` | `'That link is not valid.'` |
| Poll `closed` \| `'confirmed'`, or past `closes_at` | `VALIDATION_MESSAGES.poll.votingClosed` |
| Option not on this poll, or a missing answer | `'Choose yes, if need be, or no for every option.'` |
| Rate limit hit | `'Too many attempts. Please try again in a few minutes.'` |
| Upsert fails | `'Your changes were not recorded. Please try again.'` |

---

#### 3.6.5 `setPollOpen`

```ts
export async function setPollOpen(
  organiserToken: string,
  open: boolean
): Promise<PollActionResult>;
```

```ts
export const setPollOpenSchema = z.object({
  organiserToken: tokenSchema,
  open: z.boolean(),
});
```

Per **R1** this replaces `SCOPE.md` §6's one-way `closePoll(organiserToken)`, which had no way to reverse it.

**Flow:** shape check → `poll_organiser_ip` limit (fail-open) → one conditional update, so there is no read-then-write window:

```sql
-- open === false
update polls set status = 'closed', closes_at = now()
where organiser_token = $1 and status = 'open';

-- open === true
update polls set status = 'open', closes_at = null
where organiser_token = $1 and status = 'closed';
```

Zero rows matched → re-read `status` to pick the right message from the table below. Then `revalidatePath`.

Closing stops voting. It does **not** delete anything and does **not** send mail — the organiser knows they clicked it, and nobody else needs telling until a time is confirmed. A closed poll can still be confirmed (**R6**).

**Auth:** `organiser_token` only. `participant_token` and `edit_token` must never resolve here — the lookup is `.eq('organiser_token', ...)`, so they cannot.

**Failure modes:**

| Failure | User sees |
|---|---|
| Malformed / unknown organiser token | `'That link is not valid.'` |
| `status === 'draft'` (either direction) | `'Confirm your email address before closing this poll.'` |
| Already in the target state | `{ success: true }` — idempotent. |
| `status === 'confirmed'` (either direction) | `VALIDATION_MESSAGES.poll.alreadyConfirmed` — "This poll is already confirmed." |
| Update fails | `'The poll was not updated. Please try again.'` |

---

#### 3.6.6 `confirmOption`

```ts
export async function confirmOption(
  organiserToken: string,
  optionId: string
): Promise<PollActionResult>;
```

```ts
export const confirmOptionSchema = z.object({
  organiserToken: tokenSchema,
  optionId: z.string().uuid('That option is not valid.'),
});
```

**Flow:**
1. Parse → `poll_organiser_ip` limit — **fail-closed**, this is a mail fan-out.
2. Resolve the poll by `organiser_token`. `status` must be `'open'` or `'closed'`.
3. `select id from poll_options where id = $1 and poll_id = $2` — the option must belong to **this** poll. `polls_confirmed_option_fk` is a simple FK to `poll_options(id)` (migration: `foreign key (confirmed_option_id) references poll_options(id) on delete set null`), **not** a composite one, unlike the FKs on `poll_responses`. The database would happily accept another poll's option id here. This check is the only thing preventing that. It is not optional.
4. The conditional update, which is the race guard (§1 E13), and which also bumps the `.ics` sequence (§4.4):

```sql
update polls
set status = 'confirmed',
    confirmed_option_id = $1,
    closes_at = coalesce(closes_at, now()),
    confirm_sequence = confirm_sequence + 1
where id = $2 and status in ('open','closed')
returning confirm_sequence;
```

`closes_at = coalesce(closes_at, now())` implements §1 O6.2: a poll confirmed from `closed` keeps its original close time. **Zero rows matched → return `VALIDATION_MESSAGES.poll.alreadyConfirmed` and fan out nothing.** Fan out **only** when the update matched a row.

5. Best-effort, in `try/catch`, **after** the update commits: fan out to **everyone invited, including non-voters** — every `poll_participants.email` that is not null, plus the organiser, de-duplicated on the lowercased address (§4.4 specifies the builder; a `UNION` is wrong). Time spelled out in words via `formatSlotRangeInLondon()` (`dateUtils.ts:128`) or `formatDateInLondon()` (`dateUtils.ts:80`) per `option_kind`, plus "UK time". Note `formatSlotRangeInLondon` **throws** if end ≤ start — unreachable given `poll_options_shape_chk` enforces `ends_at > starts_at`, but it sits inside the `try/catch` regardless. `.ics` attachment and Add-to-Google / Add-to-Outlook links are Phase 4.
6. Write the fan-out failure count to `polls.confirm_notify_failures` (§4.4) so the organiser page can show its note. **The count is not part of the action's return type** — the contract stays `PollActionResult`, and the organiser page reads the column on its own server-side render.
7. `revalidatePath` for both paths. Return `{ success: true }`.

**Mail failing must not un-confirm the poll.** The poll URL stays live and shows the confirmed time; that is the durable record.

**Auth:** `organiser_token` only.

**Failure modes:**

| Failure | User sees |
|---|---|
| Malformed / unknown organiser token | `'That link is not valid.'` |
| Option not on this poll | `'That option is not valid.'` |
| `status === 'draft'` | `'Confirm your email address before confirming a time.'` |
| `status === 'confirmed'` (zero rows matched) | `VALIDATION_MESSAGES.poll.alreadyConfirmed` — and **no** re-fan-out (§1 O6.7). |
| Rate limiter unavailable | `'Confirming is unavailable right now. Please try again shortly.'` (fail-closed) |
| Update fails | `'The time was not confirmed. Please try again.'` |
| Fan-out partly fails | `{ success: true }` + `confirm_notify_failures` written + the persistent note on the organiser page. Logged with `scrubTokens`. |

---

#### 3.6.7 `deleteResponse`

```ts
export async function deleteResponse(
  organiserToken: string,
  participantId: string
): Promise<PollActionResult>;
```

```ts
export const deleteResponseSchema = z.object({
  organiserToken: tokenSchema,
  participantId: z.string().uuid('That response is not valid.'),
});
```

**Flow:** parse → `poll_organiser_ip` limit (fail-open) → resolve the poll by `organiser_token`; `status` must not be `'confirmed'` → `delete from poll_participants where id = $1 and poll_id = $2` → `revalidatePath`.

**The `and poll_id = $2` is load-bearing.** Without it, an organiser of poll A deletes a participant of poll B by pasting an id. `poll_responses_participant_fk` — `foreign key (participant_id, poll_id) references poll_participants(id, poll_id) on delete cascade` — removes the participant's votes automatically. Do not delete them by hand.

**Data destruction, and therefore gated in the UI**, not in the action: a confirmation dialogue naming the participant, per §1 O4.1 and the project's own `ui-patterns` rule. The scope's ethics gate reserves bulk deletion (>1000 rows) for a human; this deletes one participant and their ≤8 votes, on the explicit instruction of the person who holds the organiser link. That is in scope.

**Auth:** `organiser_token` only.

**Failure modes:**

| Failure | User sees |
|---|---|
| Malformed / unknown organiser token | `'That link is not valid.'` |
| Participant not on this poll (or already gone) | `{ success: true }` — idempotent. Zero rows deleted is the desired end state. |
| `status === 'confirmed'` | `VALIDATION_MESSAGES.poll.responsesLocked` — "This poll is confirmed. Responses are locked." |
| Delete fails | `'That response was not removed. Please try again.'` |

---

#### 3.6.8 `deletePoll`

```ts
export async function deletePoll(organiserToken: string): Promise<PollActionResult>;
```

Schema: `z.object({ organiserToken: tokenSchema })`.

**Flow:** parse → `poll_organiser_ip` limit (fail-open) → resolve by `organiser_token` → `delete from polls where id = $1`.

`on delete cascade` on `poll_options.poll_id`, `poll_participants.poll_id` and all three `poll_responses` FKs removes everything. `polls_confirmed_option_fk` is `on delete set null`, which is irrelevant when the poll row itself goes.

**Allowed in every status, including `'confirmed'`.** This is the organiser's Article 17 route and the only self-service erasure path in the feature; refusing it on a confirmed poll would make erasure conditional on the poll's state, which is not a defensible position.

**Irreversible.** A confirmation dialogue is mandatory in the UI and must require typing the poll title, not just a click — this destroys third-party data (every participant's name, address and availability), not only the organiser's own. Use `src/components/ui/dialog.tsx`, which exists; there is no `alert-dialog.tsx` in the repo, so do not import one.

**Auth:** `organiser_token` only.

**Failure modes:**

| Failure | User sees |
|---|---|
| Malformed / unknown organiser token | `'That link is not valid.'` |
| Poll already gone | `{ success: true }` — idempotent. |
| Delete fails | `'The poll was not deleted. Please try again, or message Peter on WhatsApp.'` |

---

### 3.7 Surfacing errors — there is no toast

`@radix-ui/react-toast ^1.2.14` is installed but there is **no** `src/components/ui/toast.tsx`, no `toaster.tsx`, no `use-toast`, and nothing in `src/` imports it. Sonner is not installed. **The project has no working toast and this feature must not build one.**

Follow `src/components/forms/contact-form.tsx` exactly: a local `useState<'idle'|'submitting'|'success'|'error'>` machine, inline `<FormMessage>` (exported from `src/components/ui/form.tsx:167`) for field errors, a `role="alert"` block for the action's `error` string (`contact-form.tsx:132-138`), and a `role="status" aria-live="polite"` block for success.

`src/components/ui/alert.tsx` exports `Alert`, `AlertTitle`, `AlertDescription` and has **only** `variant: default | destructive` — there is no `success` variant, and adding one is out of scope. A "your vote is in" confirmation uses `variant="default"` plus the named design tokens agreed in §2.0 — `border-orange bg-orange-light text-charcoal`. **No hardcoded hex in components**, per the DoD. (The email templates in §4 are the single, narrow, argued exception.)

**One message per failure.** Zod's `safeParse` gives an array of issues; return `result.error.issues[0].message` — a single string, because the contract has room for exactly one:

```ts
const parsed = createPollSchema.safeParse(input);
if (!parsed.success) {
  return { error: parsed.error.issues[0]?.message ?? 'Please check the form and try again.' };
}
```

Client-side `zodResolver` (`@hookform/resolvers ^5.2.1`, already used by `contact-form.tsx`) on the same schema shows all issues inline at once; the server action is the backstop for anything that bypasses the form, and one message is enough for that.

---

### 3.8 Phase 5 — the retention sweep

`src/app/api/cron/poll-retention/route.ts` (**NET NEW**). A route handler, not a server action: Vercel Cron issues a plain `GET` and cannot invoke a server action.

```ts
import { NextResponse } from 'next/server';
import { sweepExpiredPolls, sweepUnverifiedDrafts, flushPendingDigests, sendPendingNudges } from '@/lib/db/polls';
import { scrubTokens } from '@/lib/poll-tokens';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request): Promise<NextResponse> {
  const secret = process.env.CRON_SECRET;

  // Fail closed. An unset secret must not mean an open delete endpoint.
  if (!secret) {
    console.error('[polls] Retention sweep refused — CRON_SECRET is not set.');
    return NextResponse.json({ error: 'Not configured.' }, { status: 503 });
  }

  if (request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  }

  // Four passes, each in its own try/catch, in this order. The two deletes are
  // GDPR obligations; the digest flush and the nudge are niceties and go last.
  // One pass failing must not abort the others.
  // 1. sweepExpiredPolls({ limit: 500 })   — 60-day retention
  // 2. sweepUnverifiedDrafts()             — 24-hour unverified-draft delete (§4.1)
  // 3. flushPendingDigests()               — closes the last-vote gap (§4.2)
  // 4. sendPendingNudges()                 — organiser nudge (§4.5)
  // ...
}
```

**Auth.** `CRON_SECRET` in an `Authorization: Bearer` header. Vercel Cron sends it automatically when the env var is set on the project. **`CRON_SECRET` is not in `.env.example` today — add it**, alongside the three Upstash/pepper vars from §3.4. This is the **only** authentication in the whole feature that is not a capability token, and it is the only endpoint that deletes without a human instruction — hence fail-closed on a missing secret and a **404, not a 401**, on a bad one. A 401 confirms the route exists and invites a brute-force; a 404 says nothing. Compare `src/app/api/events/route.ts`, which is an unauthenticated public POST — that is the pattern this route must **not** follow.

**`vercel.json` — no `crons` key exists today** (the file has `buildCommand`, `framework`, `regions`, `env`, `build`, `redirects`, `headers`). Add:

```json
"crons": [{ "path": "/api/cron/poll-retention", "schedule": "0 3 * * *" }]
```

03:00 UTC daily. Hobby plans allow 2 cron jobs at daily granularity; this is the first, so it fits either way. **The Vercel plan's cron limits are recorded as unverified in the scope — confirm the plan before this ships.**

**No CSP on this route.** `next.config.js:105-120` applies only `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` and `Permissions-Policy` to `/api/:path*`, and the middleware matcher (`src/middleware.ts:138`) excludes `api` entirely, so route handlers get a thinner header set and no CSP. That is correct here — nothing renders.

**`sweepExpiredPolls`** in `src/lib/db/polls.ts`:

```ts
export async function sweepExpiredPolls(
  options: { limit: number }
): Promise<{ deleted: number }>;
```

- `select id from polls where expires_at < now() order by expires_at asc limit $1`, then `delete from polls where id in (...)`. The cascades do the rest. `deleted` is the length of the id list actually deleted, not the length requested.
- **The `limit` is the safety rail.** The project's ethics gate requires human approval for bulk operations over 1,000 rows; capping at 500 per run means the sweep can never cross that line unattended. A backlog drains over consecutive nights, which is fine — retention is a 60-day boundary, not a 60-day-and-one-minute one.
- `polls_expires_at_idx` (`create index if not exists polls_expires_at_idx on polls (expires_at)`) covers the select.
- Rate limiting: **none.** The endpoint is not public in any meaningful sense and the bearer check is the control.
- `expires_at` is `not null` on every row, set at creation and pushed forward by `submitResponse` and `updateResponse`. A poll that is never voted on still expires 60 days after its last option date — which is the correct outcome, and is why the column has no default and no nullable path. It is also what guarantees the compensating-delete failures in §3.6.1 and §3.6.3 clean themselves up.

---

### 3.9 Tests — required, not optional

`src/app/actions/contact.test.ts` and `newsletter.test.ts` exist alongside their actions and `src/lib/poll-tokens.test.ts` already pins the token rules. `src/app/actions/polls.test.ts` ships in the same PR as the actions. `contact.test.ts` is a directly copyable template — it already mocks `@/lib/db/leads` and `@/lib/email` with `vi.mock` (lines 7 and 11) and tests the honeypot path.

Minimum per action: happy path, honeypot short-circuit, one Zod rejection, one wrong-state rejection, and — for every token-taking action — **an unknown token and a malformed token returning the identical string**. Mock `@/lib/db/polls`, `@/lib/email`, `@/lib/rate-limit`, `next/headers` and `next/cache`; never touch Upstash, Resend or Supabase in a test. Full plan in §5.

Four tests that exist because the bug they catch is silent:
- **`createPoll` with `dates: ['rubbish']` returns `'Enter a date as YYYY-MM-DD.'` and does not throw.** This is the regression test for the chained-`.refine()` bug: `compareIsoDates` throws on malformed input, so a naive chain turns a typo into a 500.
- **`confirmOption` with an `optionId` belonging to a different poll** returns `'That option is not valid.'` and writes nothing. `polls_confirmed_option_fk` is a simple FK and will not catch this.
- **`deleteResponse` with a `participantId` belonging to a different poll** deletes nothing.
- **`updateResponse` called twice does not change any `poll_responses.id`.** Asserts the upsert payload reuses the existing ids rather than minting new ones.

---

## 4. Email specification

This section specifies the five emails the availability poll sends. It is written against the live repo: `src/lib/email.ts`, `src/lib/dateUtils.ts`, `src/lib/site-config.ts`, `src/lib/poll-tokens.ts`, `supabase/migrations/20260716150000_availability_polls.sql`, and the store-first / notify-best-effort philosophy set by `src/app/actions/contact.ts`.

### 4.0 Ground rules that apply to every email

| Rule | Detail |
|---|---|
| **Plain-text part is mandatory** | Every `sendPollEmail` call passes both `html` and `text`. Commit `ca016bd9` added the plain-text part to the contact flow because HTML-only mail landed in spam. No poll email ships without one. |
| **Escaping is mandatory** | Poll titles, organiser names, participant names, descriptions and locations are all attacker-controlled. Every interpolation into `html` goes through `escapeHtml()` from `src/lib/email.ts` (it escapes `&`, `<`, `>`, `"`, `'`). The `text` part needs no escaping but does need newline stripping on any value that goes into a subject line (`.replace(/[\r\n]+/g, ' ').trim()`), copying `contact.ts:78`'s subject handling — header injection is the risk. |
| **Sending never blocks the write** | Every send sits in a `try/catch` **after** the database write has succeeded. A failed or unconfigured send is a `console.error` with a `[poll-email]` tag prefix, never a user-facing error. Match `contact.ts:73-89` exactly. One exception, argued in §4.3: the participant edit link, because the on-screen link is the only other copy they will get. |
| **Tokens never reach a log** | Every `console.error` message in this section is passed through `scrubTokens()` from `src/lib/poll-tokens.ts` before it is logged. Capability URLs leak through logs; that is the leak we control. Poll ids are uuids, do not match the token pattern, and stay readable. |
| **Absolute URLs use the existing helper** | Use `getAbsoluteUrl(path)` from `src/lib/site-config.ts` — it already exists and already defaults to `https://www.orangejelly.co.uk`. **Do not write a `pollUrl()` helper; it would duplicate it.** One wrinkle must be handled: `getBaseUrl()` honours `NEXT_PUBLIC_BASE_URL`, which is `http://localhost:3000` in dev and `https://staging.orangejelly.co.uk` on staging per `.env.example`. A poll email built in a preview deployment would therefore carry a preview link. Poll email is only sent when `RESEND_API_KEY` and the from-address are configured, which they are not in preview — but assert it: `sendPollEmail` returns `{ error: 'Refusing to send: base URL is not the production host.' }` when `getBaseUrl() !== 'https://www.orangejelly.co.uk'`. Never the apex, always `www`. (Note for accuracy: `vercel.json`'s apex→www redirect sets `"permanent": true`, which Vercel emits as a **308**. A 308 *does* preserve the method and body — an apex link would not drop a POST. The `www` rule stands on canonicalisation, not on that.) |
| **The organiser link never appears in a participant email** | Enforced in code, not by discipline — see §4.3. |
| **Times are spelled out with the zone named** | Always via `dateUtils`, always with the literal string ` (UK time)` appended to slot times. Never a bare `Date`, never `toISOString()`. |
| **Hex literals in email templates are a deliberate, narrow exception** | CLAUDE.md's DoD forbids hardcoded hex in components. Email clients cannot consume Tailwind — there is no build step in an inbox — so the templates carry literals. Every literal used below is the canonical token value from `tailwind.config.js` and no other value may appear: `#F65403` (`brand.DEFAULT`), `#1A2F49` (`brand-base.DEFAULT` / `charcoal.DEFAULT`), `#01619E` (`blue-support.DEFAULT` / `teal.DEFAULT`), `#F2F8FC` (`surface.DEFAULT` / `cream.DEFAULT`). Say this in the PR description so a reviewer does not bounce it against the DoD. |
| **Banned terms** | `scripts/check-growth-language.mjs` blocks one cost-reduction verb and its inflections. It runs three ways: via lint-staged on `*.{js,jsx,ts,tsx,json,md}`, and unconditionally inside `npm run build` and `npm run lint` over a fixed `FILE_TARGETS` list plus `content/data`, `content/faqs`, `content/case-studies`. Because it accepts arbitrary CLI paths, **any staged file — including this spec — is checked.** Approved copy: **"Add to your calendar"**, **"Confirm"**, **"Update your response"**, **"Publish poll"**. All prose in this section has been run through the script and passes. |
| **British English** | `scripts/check-british-english.mjs` blocks the American spellings of "optimise", "analyse", "behaviour", "favourite", "maximise" and "recognise" everywhere it looks; the American spelling of "centre" under `content/`; and the American spelling of "colour" in `.md` files only. The CSS `color:` property in the templates below is safe for two reasons, and the second is the one that matters: (a) the templates ship as `.ts`, and the markdown-only rule only applies to `.md`; (b) `shouldCheckCliPath` rejects any CLI path outside `content/` or the exact `FILE_TARGETS` set, so `tasks/**/*.md` — this spec — is never read at all. **If this spec is ever moved under `content/`, it will fail.** The `organizer` key in the `ics` API and the `ORGANIZER` iCalendar property match no banned rule. |

#### Extending the British-English check to the new module — **NET NEW**

The check must cover `src/lib/poll-emails/`, and the obvious move does not work. `FILE_TARGETS` (line 9) is a `Set` of **exact relative file paths**, tested with `FILE_TARGETS.has(relativePath)` (line 137). There is no glob expansion anywhere in the script, so adding `'src/lib/poll-emails/**'` would silently match nothing forever. Use the recursive mechanism instead — `DIRECTORY_TARGETS` (line 17) is walked by `walkDirectory` (line 61):

```js
const DIRECTORY_TARGETS = ['content', 'src/lib/poll-emails'];
```

`shouldCheckCliPath` (line 132) also needs `relativePath.startsWith('src/lib/poll-emails/')` added, or lint-staged will skip the module on commit even though `npm run lint` catches it. No change is needed to `check-growth-language.mjs` — it accepts any CLI path and walks nothing new.

#### Time formatting helper — **NET NEW**

`src/lib/poll-emails/formatOptionForEmail.ts`:

```ts
import {
  formatDateInLondon,
  formatSlotRangeInLondon,
  type IsoDate,
} from '@/lib/dateUtils';

/**
 * NOTE ON SHAPE: `option_kind` is a column on `polls`, NOT on `poll_options`
 * (see migration 20260716150000, line 44). A `select *` from `poll_options`
 * will not contain it. The caller must read it from the parent poll and pass it
 * in explicitly — this type is a view over a join, not a table row.
 */
export interface OptionForEmail {
  /** From polls.option_kind. */
  optionKind: 'dates' | 'slots';
  /** From poll_options.option_date. Non-null iff optionKind === 'dates'. */
  optionDate: IsoDate | null;
  /** From poll_options.starts_at. Non-null iff optionKind === 'slots'. */
  startsAt: string | null; // timestamptz, ISO 8601 with zone
  /** From poll_options.ends_at. Non-null iff optionKind === 'slots'. */
  endsAt: string | null;
}

/**
 * The one place an option becomes human-readable prose.
 * Date-only options never touch a zone conversion; slot options always do.
 * dateUtils throws on bad input — callers must let it throw at build-payload
 * time, before any send is attempted. A malformed option is a data bug, not a
 * mail bug, and must not be swallowed by the send try/catch.
 */
export function formatOptionForEmail(option: OptionForEmail): string {
  if (option.optionKind === 'dates') {
    if (!option.optionDate) {
      throw new Error('A dates option must carry option_date.');
    }
    // 'Saturday, 4 July 2026' — no time, so no zone label. Adding one would be a lie.
    return formatDateInLondon(option.optionDate, 'long');
  }
  if (!option.startsAt || !option.endsAt) {
    throw new Error('A slots option must carry starts_at and ends_at.');
  }
  // 'Saturday, 4 July 2026, 7:30pm – 9:00pm (UK time)'
  return `${formatSlotRangeInLondon(option.startsAt, option.endsAt)} (UK time)`;
}
```

The explicit null guards replace non-null assertions: the `poll_options_shape_chk` constraint guarantees the invariant in the database, but the types coming back from a join do not, and `formatSlotRangeInLondon(null!, null!)` produces `Invalid start instant: "null"` — a confusing error a long way from its cause.

The `(UK time)` suffix is appended **only** for `slots`. A date-only option has no clock reading, so a zone label on it is meaningless and misleading. This is deliberate and must not be "fixed" later.

Short-date rendering for subject lines uses `formatDateInLondon(date, 'short')` → `Sat 4 Jul`.

#### `src/lib/email.ts` — required change (**NET NEW**, additive only)

Today `sendLeadNotification` resolves its recipient internally from `CONTACT_NOTIFICATION_EMAIL` and takes no `to`. It also does not pass `attachments` or `headers` through to Resend. Both are blockers for this feature.

**Do not change `sendLeadNotification`.** Add two siblings and leave the contact flow untouched. This is the **single** signature (per **R13**) — Phase 2 simply passes neither optional field:

```ts
interface PollEmail {
  to: string;
  subject: string;
  html: string;
  text: string;                    // REQUIRED here, unlike LeadNotification
  replyTo?: string;
  attachments?: Array<{ filename: string; content: string }>; // content = base64
  headers?: Record<string, string>;
}

export async function sendPollEmail({
  to, subject, html, text, replyTo, attachments, headers,
}: PollEmail): Promise<{ success?: boolean; error?: string }>;

/**
 * Fan out one email per recipient for confirmOption.
 *
 * Sequential, not Promise.all: Resend rate-limits, and a 20-person poll firing
 * 20 concurrent sends is how a confirmation half-delivers. Returns the failure
 * count so the organiser page can show its note; never throws.
 */
export async function sendPollEmails(messages: PollEmail[]): Promise<{ sent: number; failed: number }>;
```

`sendPollEmail`'s body copies `sendLeadNotification` verbatim — construct `new Resend(apiKey)` per call, read `RESEND_API_KEY` at call time, return `{ error }` on a missing key, never throw on a normal failure path — with four differences:

1. `to` comes from the argument, never from env.
2. `from` comes from `POLL_FROM_EMAIL` (**NET NEW env var**), falling back to `CONTACT_FROM_EMAIL`. See §4.6 on the sending subdomain.
3. `attachments` and `headers` pass straight through to `resend.emails.send`. The Resend SDK (`resend@^6.17.1`, already a dependency) supports both.
4. The production-host guard from §4.0: if `getBaseUrl() !== 'https://www.orangejelly.co.uk'`, return `{ error: 'Refusing to send: base URL is not the production host.' }` without calling Resend. A preview build must not put a preview link in a third party's inbox.

Every log line inside both functions is `[poll-email]`-tagged and passes through `scrubTokens()` — the `html` and `text` bodies contain capability URLs, so an unscrubbed `console.error(JSON.stringify(error))` of the kind at `email.ts:64` would put a token in the logs. That is precisely the leak §3.2 forbids.

Document `POLL_FROM_EMAIL` in `.env.example`, alongside the existing `RESEND_API_KEY` / `CONTACT_FROM_EMAIL` / `CONTACT_NOTIFICATION_EMAIL` block. `text` is a required field on the interface so the compiler enforces the plain-text rule rather than a code reviewer.

---

### 4.1 Organiser — confirm your email

| | |
|---|---|
| **Trigger** | `createPoll(input)` in `src/app/actions/polls.ts`, immediately after the `polls` row (status `draft`) and its `poll_options` rows commit. |
| **Recipient** | `polls.organiser_email`. Self-asserted and unverified — this email is what verifies it. |
| **Reply-to** | None. Nothing to reply to. |
| **Subject** | `Confirm your email to publish "<poll title>"` |
| **Contains** | The verify link only. No participant link, no organiser link — neither exists to the user until the poll is live. |

**Link:** `https://www.orangejelly.co.uk/availability/verify/<verify_token>`

This needs a third poll-level token (**R2**). `polls` has `participant_token` and `organiser_token` (migration lines 42-43); a verify link must not be either of them, because the verify URL is the one that lands in an inbox before the organiser has proven they own it.

**Migration addition (NET NEW):**

```sql
alter table polls add column if not exists verify_token text unique;
alter table polls add column if not exists verify_token_expires_at timestamptz;
```

Both nullable, both set to `null` on successful verification so the link is single-use — Postgres permits many nulls under a unique constraint, so nulling out is safe and needs no partial index. Generated by `generateToken()` from `src/lib/poll-tokens.ts`, the same 16-byte / base64url / 22-char / 128-bit draw as the other three. `generatePollTokens()` returns only the three existing tokens; call `generateToken()` separately rather than widening it, so the verify token stays an independent draw. Expiry: 24 hours from creation. Routes validate with `isWellFormedToken()` before touching the database.

**Plain text:**

```
Hi <organiser_name>,

You've built a poll on Orange Jelly:

  <poll title>

One step left. Confirm this is your email address and the poll goes live:

  https://www.orangejelly.co.uk/availability/verify/<verify_token>

This link works for 24 hours and once only. After that the poll is removed
and you'd need to build it again.

Once you confirm, you'll get two links: one to share with the people you're
inviting, and a private one for you.

Didn't build this poll? Ignore this email. Nothing goes live and nothing gets
sent to anyone until someone clicks that link.

Orange Jelly
www.orangejelly.co.uk
```

**HTML:**

```html
<div style="font-family:'Open Sans',Helvetica,Arial,sans-serif;color:#1A2F49;max-width:560px;margin:0 auto;padding:24px;background:#F2F8FC;">
  <p style="margin:0 0 16px;">Hi ${escapeHtml(organiserName)},</p>
  <p style="margin:0 0 16px;">You&rsquo;ve built a poll on Orange Jelly:</p>
  <p style="margin:0 0 24px;font-size:18px;font-weight:700;">${escapeHtml(pollTitle)}</p>
  <p style="margin:0 0 24px;">One step left. Confirm this is your email address and the poll goes live.</p>
  <p style="margin:0 0 24px;">
    <a href="${escapeHtml(verifyUrl)}"
       style="display:inline-block;background:#F65403;color:#ffffff;text-decoration:none;
              padding:14px 28px;border-radius:6px;font-weight:700;min-height:44px;line-height:20px;">
      Confirm and publish
    </a>
  </p>
  <p style="margin:0 0 16px;font-size:14px;">
    Button not working? Paste this into your browser:<br>
    <a href="${escapeHtml(verifyUrl)}" style="color:#01619E;word-break:break-all;">${escapeHtml(verifyUrl)}</a>
  </p>
  <p style="margin:0 0 16px;font-size:14px;">
    This link works for 24 hours and once only.
  </p>
  <p style="margin:0 0 16px;font-size:14px;">
    Didn&rsquo;t build this poll? Ignore this email. Nothing goes live and nothing
    gets sent to anyone until someone clicks that link.
  </p>
  <p style="margin:24px 0 0;font-size:13px;color:rgba(26,47,73,0.72);">
    Orange Jelly &middot;
    <a href="https://www.orangejelly.co.uk" style="color:#01619E;">www.orangejelly.co.uk</a>
  </p>
</div>
```

`'Open Sans'` matches the site's body face (`Open_Sans` via `next/font/google`, `src/app/layout.tsx:2`). It will not load in an inbox; the Helvetica/Arial fallback is the point. Note that the whole family is a fallback chain, not a webfont link — do not add one.

`verifyUrl` is server-built by `getAbsoluteUrl()` and contains only base64url characters, so escaping is a no-op — but it goes through `escapeHtml()` anyway. Escaping every interpolation without exception is cheaper than auditing which ones are safe. It **must** be built by `getAbsoluteUrl()` and never concatenated from a request header.

**On failure:** the poll row already exists as `draft`. `createPoll` returns `{ success: true }` regardless and the confirmation screen says *"Check your inbox — we've sent a link to `<masked email>`."* Log `` `[poll-email] Verify link not sent for poll ${pollId}: ${scrubTokens(String(err))}` ``. The organiser is not stranded: the create screen carries a **"Send it again"** control, rate-limited to one per 60 seconds per poll, which regenerates `verify_token` and `verify_token_expires_at` and re-sends. Regenerating invalidates the previous link — say so on screen.

**The 24-hour sweep needs its own predicate.** The Phase 5 retention job runs off `expires_at`, which is `not null` and set to 60 days after the last response or last option date (migration lines 55-57). It cannot express a 24-hour draft sweep. Add a second statement to the same cron (`sweepUnverifiedDrafts`, §3.8), with its own try/catch:

```sql
delete from polls
where status = 'draft'
  and email_verified_at is null
  and created_at < now() - interval '24 hours';
```

`on delete cascade` on `poll_options.poll_id` clears the children. An unverified poll is an abandoned poll holding an unverified third-party email address, so it must not linger.

**The email that immediately follows.** On successful verification, `verifyOrganiserEmail(token)` sets `email_verified_at = now()`, `status = 'open'`, nulls both verify columns, and sends a second organiser email carrying **both** links — participant and organiser — clearly separated, each under its own heading, with the warning: *"Anyone you send the private link to can close the poll, delete responses and confirm the time. Keep it to yourself."* That is the accepted trade-off for no-login, named explicitly in `src/lib/poll-tokens.ts`'s own header comment, and it must be named in the email rather than left implicit. Its structure is identical to the template above and is not repeated here; failure handling is the same — the poll is live either way, and the verify page shows both links on screen at the moment of verification, so the email is a convenience. **But it is the load-bearing convenience:** per **R15** the verify link is consumed on first use, so if the organiser's own click was not the one that consumed it, this email is their only route back. Its send failure is logged loudly.

---

### 4.2 Organiser — you have new responses (digest)

| | |
|---|---|
| **Trigger** | Lazily, inside `submitResponse` / `updateResponse`, **after** the response commits. Never one email per vote. |
| **Recipient** | `polls.organiser_email`. Only ever the organiser. |
| **Reply-to** | None. Participant emails are optional and must not be exposed in a reply-to. |
| **Subject** | Singular: `1 new response to "<poll title>"` · Plural: `<n> new responses to "<poll title>"` |
| **Contains** | Who responded, the running totals per option, the organiser link. Never a participant's edit link, never a participant's email address. |
| **`List-Unsubscribe`** | Required. See §4.6. |

**Migration additions (NET NEW)** to `polls`:

```sql
alter table polls add column if not exists last_digest_at timestamptz;
alter table polls add column if not exists digest_pending_since timestamptz;
```

**The rule.** After a response commits:

1. If `digest_pending_since is null`, set it to `now()`. This marks "there is something to tell the organiser".
2. If `last_digest_at is null or last_digest_at < now() - interval '60 minutes'`, build and send the digest, then — **only on a successful send** — set `last_digest_at = now()` and `digest_pending_since = null`.
3. Otherwise do nothing. The next response after the window opens carries it.

**Counting: from `poll_responses.updated_at`, not `poll_participants.created_at`.** The draft's original rule counted `poll_participants.created_at > coalesce(last_digest_at, polls.created_at)`, which is broken. `updateResponse` mutates `poll_responses` for a participant who already exists; `poll_participants.created_at` never moves, and the `poll_responses_set_updated_at` trigger (migration line 137) touches `updated_at` only. So an edit trips the trigger, opens the window, and sends a digest reading "0 new responses" above an empty list. Count the responses instead, and derive the names from them:

```sql
-- $1 = poll_id, $2 = coalesce(polls.last_digest_at, polls.created_at)
select p.id, p.display_name
from poll_participants p
where p.poll_id = $1
  and exists (
    select 1 from poll_responses r
    where r.participant_id = p.id and r.poll_id = $1 and r.updated_at > $2
  )
order by p.display_name;
```

`newCount` is that result's length. Because an edit now legitimately counts, the copy must not claim these are all first-time responses — the heading reads **"New or updated since we last wrote"** and the subject counts "responses", which covers both honestly. If `newCount` is `0` (possible under a race where a concurrent send already flushed the window), **abort without sending** and leave `last_digest_at` alone.

Totals for the "where it stands" block:

```sql
select o.id, count(*) filter (where r.availability = 'yes')         as yes,
              count(*) filter (where r.availability = 'if_need_be') as if_need_be,
              count(*) filter (where r.availability = 'no')         as no
from poll_options o
left join poll_responses r on r.option_id = o.id and r.poll_id = o.poll_id
where o.poll_id = $1
group by o.id, o.position
order by o.position;
```

`availability` is constrained to exactly `'yes' | 'if_need_be' | 'no'` (migration line 108) — those three and no others.

**The honest gap.** A lazy trigger cannot fire on the *last* vote — if nobody else responds, `digest_pending_since` stays set and the organiser is never told about the final response. This is a real defect, not a rounding error, and it is closed in Phase 5: `flushPendingDigests()` in the same Vercel cron (§3.8) selects `polls where digest_pending_since < now() - interval '60 minutes' and status = 'open'` and flushes them. Until Phase 5 lands, the organiser page shows live results on load and the poll link is in their inbox, so the failure mode is "you have to look" rather than "you lose the response". Ship Phase 4 with this stated in the PR description as known, time-boxed tech debt — do not build a bespoke cron for it.

**Plain text:**

```
Hi <organiser_name>,

<n> new response(s) to your poll:

  <poll title>

New or updated since we last wrote:
  - <participant display_name>
  - <participant display_name>

Where it stands (<total> people have responded):

  Saturday, 4 July 2026, 7:30pm – 9:00pm (UK time)
      Yes 4  ·  If need be 1  ·  No 0
  Sunday, 5 July 2026, 2:00pm – 4:00pm (UK time)
      Yes 2  ·  If need be 3  ·  No 0
  Monday, 6 July 2026, 7:00pm – 9:00pm (UK time)
      Yes 1  ·  If need be 0  ·  No 4

See the full picture and confirm a time:

  https://www.orangejelly.co.uk/availability/o/<organiser_token>

That link is private to you. Anyone who has it can confirm the time, close the
poll and delete responses.

We batch these — you'll get at most one an hour, however many people respond.

Orange Jelly
www.orangejelly.co.uk
```

**HTML:** same shell as §4.1. Body:

```html
<p style="margin:0 0 16px;">Hi ${escapeHtml(organiserName)},</p>
<p style="margin:0 0 8px;font-size:18px;font-weight:700;">
  ${newCount === 1 ? '1 new response' : `${newCount} new responses`}
</p>
<p style="margin:0 0 24px;">to your poll <strong>${escapeHtml(pollTitle)}</strong>.</p>

<p style="margin:0 0 8px;font-weight:700;">New or updated since we last wrote</p>
<ul style="margin:0 0 24px;padding-left:20px;">
  ${newNames.map((n) => `<li style="margin:0 0 4px;">${escapeHtml(n)}</li>`).join('\n')}
</ul>

<p style="margin:0 0 8px;font-weight:700;">
  Where it stands (${totalResponders} ${totalResponders === 1 ? 'person has' : 'people have'} responded)
</p>
<table role="presentation" cellpadding="0" cellspacing="0" border="0"
       style="width:100%;margin:0 0 24px;border-collapse:collapse;">
  ${rows.map((r) => `
  <tr>
    <td style="padding:10px 0;border-bottom:1px solid rgba(26,47,73,0.18);">
      <div style="font-weight:600;">${escapeHtml(r.label)}</div>
      <div style="font-size:14px;color:rgba(26,47,73,0.72);">
        &#10003; Yes ${r.yes} &nbsp;&middot;&nbsp; ~ If need be ${r.ifNeedBe} &nbsp;&middot;&nbsp; &#10007; No ${r.no}
      </div>
    </td>
  </tr>`).join('\n')}
</table>

<p style="margin:0 0 24px;">
  <a href="${escapeHtml(organiserUrl)}"
     style="display:inline-block;background:#F65403;color:#ffffff;text-decoration:none;
            padding:14px 28px;border-radius:6px;font-weight:700;min-height:44px;line-height:20px;">
    See the results
  </a>
</p>
<p style="margin:0 0 16px;font-size:14px;">
  That link is private to you. Anyone who has it can confirm the time, close the
  poll and delete responses.
</p>
<p style="margin:0 0 16px;font-size:14px;color:rgba(26,47,73,0.72);">
  We batch these &mdash; you&rsquo;ll get at most one an hour, however many people respond.
</p>
```

This and the §4.5 nudge are the **only** templates in the feature that may carry `organiserUrl`, and both go only to `polls.organiser_email`. `r.yes`, `r.ifNeedBe` and `r.no` are integers from the aggregate above, not user input, so they are interpolated raw; every string is escaped.

Each option's counts carry a glyph **and** a word (`✓ Yes 4`), never a colour swatch alone. Email clients strip CSS unpredictably and a count that only reads as green fails for anyone whose client blocks styles — the same WCAG 1.4.1 reasoning that governs the poll page itself, and the same rule the workspace `ui-patterns.md` states as "colour is not the only indicator of state".

`r.label` comes from `formatOptionForEmail()` and is escaped anyway, defensively: it is server-generated today, but escaping every interpolation without exception is cheaper than auditing which ones are safe.

**On failure:** the response is already stored and visible on the organiser page. Log `` `[poll-email] Digest not sent for poll ${pollId}: ${scrubTokens(String(err))}` ``. Critically — **only set `last_digest_at` after a successful send.** If the send fails, leave `last_digest_at` untouched and `digest_pending_since` set, so the next response retries the same digest rather than silently swallowing the window. `submitResponse` returns `{ success: true }` regardless.

---

### 4.3 Participant — here is your edit link

| | |
|---|---|
| **Trigger** | `submitResponse(participantToken, input)`, after the `poll_participants` row and its `poll_responses` rows commit — **only if** the participant typed an email address. `poll_participants.email` is nullable (migration line 93); email is optional and always will be. |
| **Recipient** | `poll_participants.email`, and no other address, ever. This is the entire anti-relay control: a participant email goes only to an address the recipient typed themselves. |
| **Reply-to** | `polls.organiser_email`. The organiser is the person they'd actually want to reach. |
| **Subject** | `Your response to "<poll title>"` |
| **Contains** | Their own answers, their own edit link, the Article 14 privacy notice. **Never the organiser link.** Never other participants' names or answers. |

**Link:** `https://www.orangejelly.co.uk/availability/p/<participant_token>/edit/<edit_token>`

This URL carries the participant token as well as the edit token — the participant already has the participant token (they voted through it), so this leaks nothing new. `edit_token` is per-participant and unique (migration line 96).

**Enforcing "no organiser link in a participant email".** Do not rely on review. Structure the code so it cannot happen:

- `src/lib/poll-emails/participant.ts` exports `buildParticipantEmail(input: ParticipantEmailInput)`. `ParticipantEmailInput` **does not have an `organiserToken` field.** The type makes the mistake unrepresentable.
- The poll record is never passed whole into that module. The caller destructures the five fields it needs (`title`, `description`, `location`, `organiserName`, `organiserEmail`) at the call site.
- `src/lib/poll-emails/participant.test.ts` asserts `expect(html).not.toContain(organiserToken)` and the same on `text`, using a token from a real `generateToken()` call. Cheap, and it fails loudly if someone widens the input type later.

**Plain text:**

```
Hi <display_name>,

Thanks — your response to "<poll title>" is in.

Here's what you told us:

  Saturday, 4 July 2026, 7:30pm – 9:00pm (UK time)  —  Yes
  Sunday, 5 July 2026, 2:00pm – 4:00pm (UK time)  —  If need be
  Monday, 6 July 2026, 7:00pm – 9:00pm (UK time)  —  No

Changed your mind? Update your response any time until the poll closes:

  https://www.orangejelly.co.uk/availability/p/<participant_token>/edit/<edit_token>

Keep that link. It's the only way back to your own answers, and it's yours alone.

<organiser_name> will confirm a time once enough people have responded. We'll
email you when they do.

--
How we handle your details

Orange Jelly Limited runs this poll tool at www.orangejelly.co.uk and is the
controller of your data. <organiser_name> (<organiser_email>) built this poll
and invited you; that's where we got your details.

We hold your name, your answers and — because you gave it — your email address,
so the group can find a time that works and so we can tell you what was
confirmed. Our lawful basis is legitimate interests: arranging a meeting people
have chosen to take part in.

Your name and answers are visible to <organiser_name>. We do not show your email
address to anyone else. (If you reply to this email it goes to <organiser_name>,
who will then see the address you reply from.)

We delete the whole poll 60 days after the last response or the last proposed
date, whichever is later.

To see, correct or delete your data, write to peter@orangejelly.co.uk. Please
don't reply to this email for that — replies go to <organiser_name>, not to us.
You can also complain to the ICO at ico.org.uk.

Orange Jelly
www.orangejelly.co.uk
```

**The reply-to correction, because it is a live compliance defect in the obvious draft of this email.** The tempting wording — *"reply to this email or write to peter@orangejelly.co.uk"* — is wrong, and wrong in a way that matters. This email sets `Reply-to: polls.organiser_email`. A reply reaches **the organiser**, a third party with no obligation to action a subject-access request, and hands them the data subject's message and address. The notice names Orange Jelly Limited as controller two paragraphs earlier. Instructing the reader to exercise their Article 15–17 rights by replying routes them to the wrong controller. Rights go to `peter@orangejelly.co.uk` only, and the email must say so plainly, because the reply-to makes the natural assumption the wrong one. The disclosure about what a reply reveals is also load-bearing: "we do not show your email address to anyone else" is a promise about our behaviour, and a reply is the one path that defeats it. Say it rather than let it surprise someone.

**HTML:** same shell. Body:

```html
<p style="margin:0 0 16px;">Hi ${escapeHtml(displayName)},</p>
<p style="margin:0 0 24px;">
  Thanks &mdash; your response to <strong>${escapeHtml(pollTitle)}</strong> is in.
</p>

<p style="margin:0 0 8px;font-weight:700;">Here&rsquo;s what you told us</p>
<table role="presentation" cellpadding="0" cellspacing="0" border="0"
       style="width:100%;margin:0 0 24px;border-collapse:collapse;">
  ${answers.map((a) => `
  <tr>
    <td style="padding:10px 0;border-bottom:1px solid rgba(26,47,73,0.18);">
      <div style="font-weight:600;">${escapeHtml(a.label)}</div>
      <div style="font-size:14px;color:rgba(26,47,73,0.72);">${a.glyph} ${escapeHtml(a.stateLabel)}</div>
    </td>
  </tr>`).join('\n')}
</table>

<p style="margin:0 0 16px;">Changed your mind? You can update your response until the poll closes.</p>
<p style="margin:0 0 24px;">
  <a href="${escapeHtml(editUrl)}"
     style="display:inline-block;background:#F65403;color:#ffffff;text-decoration:none;
            padding:14px 28px;border-radius:6px;font-weight:700;min-height:44px;line-height:20px;">
    Update your response
  </a>
</p>
<p style="margin:0 0 24px;font-size:14px;">
  Keep this link. It&rsquo;s the only way back to your own answers, and it&rsquo;s yours alone.<br>
  <a href="${escapeHtml(editUrl)}" style="color:#01619E;word-break:break-all;">${escapeHtml(editUrl)}</a>
</p>
<p style="margin:0 0 24px;">
  ${escapeHtml(organiserName)} will confirm a time once enough people have responded.
  We&rsquo;ll email you when they do.
</p>

<hr style="border:0;border-top:1px solid rgba(26,47,73,0.18);margin:0 0 16px;">
<p style="margin:0 0 8px;font-size:13px;font-weight:700;">How we handle your details</p>
<p style="margin:0 0 8px;font-size:13px;color:rgba(26,47,73,0.72);">
  Orange Jelly Limited runs this poll tool at www.orangejelly.co.uk and is the
  controller of your data. ${escapeHtml(organiserName)}
  (${escapeHtml(organiserEmail)}) built this poll and invited you; that&rsquo;s
  where we got your details.
</p>
<p style="margin:0 0 8px;font-size:13px;color:rgba(26,47,73,0.72);">
  We hold your name, your answers and &mdash; because you gave it &mdash; your
  email address, so the group can find a time that works and so we can tell you
  what was confirmed. Our lawful basis is legitimate interests: arranging a
  meeting people have chosen to take part in. Your name and answers are visible
  to ${escapeHtml(organiserName)}. We do not show your email address to anyone
  else. (If you reply to this email it goes to ${escapeHtml(organiserName)}, who
  will then see the address you reply from.)
</p>
<p style="margin:0 0 8px;font-size:13px;color:rgba(26,47,73,0.72);">
  We delete the whole poll 60 days after the last response or the last proposed
  date, whichever is later. To see, correct or delete your data, write to
  <a href="mailto:peter@orangejelly.co.uk" style="color:#01619E;">peter@orangejelly.co.uk</a>
  &mdash; please don&rsquo;t reply to this email for that, as replies go to
  ${escapeHtml(organiserName)} rather than to us. You can also complain to the ICO at
  <a href="https://ico.org.uk" style="color:#01619E;">ico.org.uk</a>.
</p>
```

`a.glyph` is `&#10003;` (yes), `~` (if need be) or `&#10007;` (no); `a.stateLabel` is `Yes` / `If need be` / `No`, mapped from the `availability` enum. Glyph plus word, never one alone.

**The Article 14 notice is load-bearing, not boilerplate.** This is the first communication with a person whose data the organiser supplied, so the notice must be *in this email*, not only on the poll page. The notice text is a single exported constant (`src/lib/poll-emails/privacyNotice.ts`, exporting both an HTML and a plain-text builder from one source of wording) so it cannot drift between the email and the page. **Resolved 16 July 2026.** The rights address is `peter@orangejelly.co.uk`. Orange Jelly does not run a `privacy@` mailbox and is not going to, so an earlier draft of this spec named an address that would have bounced — a GDPR notice pointing at a dead inbox is worse than one naming no address at all. `peter@orangejelly.co.uk` is already the fallback recipient in `src/lib/email.ts:44`, so it is a known-live address rather than an aspiration. No prerequisite remains here.

**On failure:** the response is stored. Log `` `[poll-email] Edit link not sent for participant ${participantId}: ${scrubTokens(String(err))}` ``. This one has a specific mitigation that removes most of its sting: **the edit link is shown on screen immediately after submitting** (§1 P2.1, §2.3) — it is the honest fix for the duplicate-participant problem and it doubles as the fallback when email fails. The confirmation panel says: *"Keep this link if you need to change your answer."* and — only when a send failed — an inline `<Alert>` from `src/components/ui/alert.tsx` reading *"We couldn't email this to you, so copy it now."*

Use `<Alert>` with its **`default`** variant, not `destructive`. `alertVariants` defines only those two, and `destructive` renders in the error palette — wrong for a notice that must read as information rather than as a failure. If a distinct informational variant is wanted, that is a change to `alert.tsx` and a separate changeset; do not inline ad-hoc classes to fake one. This is the one case where a send failure surfaces to the user, because the on-screen link is the only copy they will ever get. `submitResponse` still returns `{ success: true, editUrl }`.

The GDPR notice does **not** get shown only on screen — if the send fails, the notice on the poll page itself is what discharges the obligation. That page must carry it regardless (§1 P1.12).

---

### 4.4 Everyone invited — the time is confirmed

| | |
|---|---|
| **Trigger** | `confirmOption(organiserToken, optionId)`, after `status = 'confirmed'` and `confirmed_option_id` commit. |
| **Recipient** | **Everyone invited who has an email address on record — not only the people who voted.** |
| **Reply-to** | `polls.organiser_email`. |
| **Subject** | `Confirmed: "<poll title>" — <short date>` e.g. `Confirmed: "July planning call" — Sat 4 Jul`, from `formatDateInLondon(date, 'short')`. |
| **Contains** | The time in words with the zone named, an `.ics` attachment, Add-to-Google and Add-to-Outlook links. The poll is locked, so no edit link. The organiser gets a copy without any organiser-specific link. |

#### Who "everyone invited" means

Doodle only emails people who voted. That is a named flaw we are fixing: a licensee who never got round to responding still needs to know when the meeting is.

**Build the recipient set in application code, not in one SQL statement.** The obvious query is wrong:

```sql
-- WRONG. Do not use.
select distinct lower(email) as email, min(display_name) as display_name
from poll_participants where poll_id = $1 and email is not null group by lower(email)
union
select lower($organiser_email), $organiser_name
```

`UNION` deduplicates on the **whole row**, not on `email`. Nothing constrains `polls.organiser_name` (migration line 40) to equal the `display_name` the organiser used when voting (line 92) — if they typed "Pete" and the poll says "Peter Pitcher", the two rows differ, `UNION` keeps both, and the organiser is emailed twice about their own meeting. Instead:

```sql
select lower(trim(email)) as email, min(display_name) as display_name
from poll_participants
where poll_id = $1 and email is not null and length(trim(email)) > 0
group by lower(trim(email));
```

Then, in TypeScript, key a `Map` on the lowercased address, seed it with the organiser, and let participant rows fill in only addresses the map does not already hold:

```ts
const recipients = new Map<string, { email: string; displayName: string }>();
const organiserKey = organiserEmail.trim().toLowerCase();
recipients.set(organiserKey, { email: organiserKey, displayName: organiserName });
for (const row of participantRows) {
  if (!recipients.has(row.email)) {
    recipients.set(row.email, { email: row.email, displayName: row.display_name });
  }
}
```

Seeding the organiser first means their `organiser_name` wins over whatever `display_name` they voted under — the right precedence, and the dedupe is on the address alone, which is the only thing that decides who gets an email. The duplicate-participant reality means the same person can hold two `poll_participants` rows; `min(display_name)` collapses them to one, and picks deterministically rather than arbitrarily. Per **R16**, the set is never empty: `polls.organiser_email` is `not null` and verified, so a zero-response poll's fan-out is a normal one-recipient send, not a case to special-case.

**The honest limit.** "Everyone invited" is, in this design, everyone who *gave an email address*. There is no separate invitee list — the poll has no address book, deliberately, because an address book is the open relay. So a licensee who opened the participant link, voted, and left the email field blank cannot be reached. That is correct and must not be "fixed" by letting the organiser type in arbitrary addresses. **Mitigation, in Phase 4:** the confirm screen gives the organiser a copyable plain-text block of the confirmed details plus the poll URL, to paste into WhatsApp or their own mail client. The organiser's own address book is the right place for that data; ours is not.

#### Per-recipient loop

Send one email per recipient, in series with a small delay, not one email with everyone in `to` — putting the whole group in a visible `to` discloses participants' email addresses to each other, which §4.3's privacy notice explicitly promises will not happen. `bcc` is not an option: `sendPollEmail` has no `bcc` passthrough by design, and a bulk `bcc` scores worse on spam filters than n individual sends.

```ts
let failures = 0;
for (const recipient of recipients.values()) {
  try {
    const result = await sendPollEmail({ to: recipient.email, /* ... */ });
    if (result.error) {
      failures++;
      console.error(
        `[poll-email] Confirm not sent to one recipient of poll ${pollId}:`,
        scrubTokens(result.error)
      );
    }
  } catch (err) {
    failures++;
    console.error(
      `[poll-email] Confirm threw for one recipient of poll ${pollId}:`,
      scrubTokens(String(err))
    );
  }
  await sleep(120); // Resend's documented limit is 2 requests/second. Verify against the live plan (§4.6).
}
```

Note the recipient's address is **not** logged — the whole point of the per-recipient loop is that addresses stay private, and a log line naming one undoes that. The poll id is enough to investigate.

Build the `.ics`, the HTML and the text **once**, before the loop. Only the greeting name and the `to` vary. Building per recipient would multiply the `dateUtils` throw risk by the recipient count for no gain. The participant URL in the body is poll-level (`polls.participant_token`), not per-recipient, so it is loop-invariant too.

#### The .ics attachment

**Library: `ics` (npm), ISC licence — NET NEW dependency**, and binding per **R12**. It is not currently in `package.json`; `npm install ics` is a required step. ISC is permissive and passes the GPL/AGPL gate cleanly. Do not hand-roll the VCALENDAR string: line folding at 75 octets, `\r\n` line endings, and comma/semicolon/backslash escaping in `SUMMARY` and `DESCRIPTION` are exactly the details that break silently in Outlook and are exactly what a library exists to get right. A poll title containing a comma is not an edge case.

```ts
import { createEvent, type EventAttributes } from 'ics';
```

No `randomUUID` import — the UID is deterministic and a random one is the bug this section exists to prevent. An unused import would also fail `next lint`.

**VEVENT field mapping — `slots` options:**

| Field | Value | Notes |
|---|---|---|
| `METHOD` | `PUBLISH` | **Not `REQUEST`.** RFC 5546 §3.2.2 requires at least one `ATTENDEE` on a VEVENT `REQUEST`; an attendee-less REQUEST is malformed iTIP and client behaviour on it is undefined — the same class of silent Outlook breakage the library is here to avoid. We are delivering an agreed time, not managing RSVPs, and `PUBLISH` is precisely the method for that. Set via `method: 'PUBLISH'`. |
| `UID` | `` `${pollId}@orangejelly.co.uk` `` | **Keyed on the poll, not the option.** `polls.confirmed_option_id` is mutable and reopening a poll usually means picking a *different* time — an option-keyed UID would mint a new event and leave the old one sitting in everyone's calendar forever. Poll-keyed plus a rising `SEQUENCE` supersedes the previous entry, which is the whole point. |
| `DTSTAMP` | `now()` in UTC, `Z` suffix | The `ics` library emits this itself from the current instant. Do not override. |
| `DTSTART` | `poll_options.starts_at` formatted as UTC | `start: toIcsUtcArray(startsAt)`, `startInputType: 'utc'`, `startOutputType: 'utc'`. |
| `DTEND` | `poll_options.ends_at` formatted as UTC | `end: toIcsUtcArray(endsAt)`, `endInputType: 'utc'`, `endOutputType: 'utc'`. The column is `timestamptz` and already a UTC instant — this is a formatting step, never a zone conversion. `poll_options_shape_chk` guarantees `ends_at > starts_at`. |
| `SEQUENCE` | `polls.confirm_sequence` | **Migration addition (NET NEW):** `alter table polls add column if not exists confirm_sequence integer not null default 0;` Incremented inside `confirmOption`'s conditional update (§3.6.6) on every confirm, and read back via `returning confirm_sequence`. Never send `SEQUENCE:0` twice for the same UID. |
| `SUMMARY` | `polls.title` | Raw — the library escapes it. Do **not** pass it through `escapeHtml()`; HTML entities in a calendar entry are a bug. |
| `DESCRIPTION` | `polls.description` + the poll URL | Same — raw, library-escaped. |
| `LOCATION` | `polls.location`, omitted when null | The column is nullable (migration line 39). |
| `ORGANIZER` | `{ name: organiserName, email: organiserEmail }` | Optional under `PUBLISH`, but useful and harmless. |
| `STATUS` | `CONFIRMED` | |
| `PRODID` | `-//Orange Jelly//Availability Poll//EN` | Via `productId`. |

```ts
/** timestamptz -> the [y, m, d, h, min] tuple `ics` wants, in UTC. */
function toIcsUtcArray(instant: string): [number, number, number, number, number] {
  const d = new Date(instant);
  if (Number.isNaN(d.getTime())) throw new Error(`Invalid instant: "${instant}".`);
  return [
    d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate(),
    d.getUTCHours(), d.getUTCMinutes(),
  ];
}

const attrs: EventAttributes = {
  productId: '-//Orange Jelly//Availability Poll//EN',
  uid: `${pollId}@orangejelly.co.uk`,
  sequence: confirmSequence,
  method: 'PUBLISH',
  status: 'CONFIRMED',
  title: pollTitle,
  description: `${pollDescription ?? ''}\n\n${getAbsoluteUrl(`/availability/p/${participantToken}`)}`.trim(),
  ...(location ? { location } : {}),
  organizer: { name: organiserName, email: organiserEmail },
  start: toIcsUtcArray(startsAt),
  startInputType: 'utc',
  startOutputType: 'utc',
  end: toIcsUtcArray(endsAt),
  endInputType: 'utc',
  endOutputType: 'utc',
};
```

**`dates` options — the all-day case.** A date-only option has no clock reading and must never be converted through a zone — `dateUtils`' central rule, stated in its own header. It becomes an all-day VEVENT:

- `start: [y, m, d]` (three elements — `ics` emits `DTSTART;VALUE=DATE:20260704`)
- `end: [y, m, d]` of the **next** calendar day — `DTEND` on an all-day VEVENT is exclusive per RFC 5545. Getting this wrong is a one-day-out bug, the date-only twin of the one-hour-offset bug.
- No `startInputType` / `startOutputType`. Setting `'utc'` on a date-only value is precisely the conversion the rule forbids.
- Derive the next day arithmetically on the `YYYY-MM-DD` parts via `Date.UTC`, never by adding 86,400,000 ms to a local-zone `Date`:

```ts
function nextCalendarDay(date: IsoDate): [number, number, number] {
  const [y, m, d] = date.split('-').map(Number);
  const next = new Date(Date.UTC(y, m - 1, d + 1)); // Date.UTC normalises month/year rollover.
  return [next.getUTCFullYear(), next.getUTCMonth() + 1, next.getUTCDate()];
}
```

**Reading the result.** `createEvent(attrs)` **returns** `{ error, value }` directly. (It also accepts an optional callback, `createEvent(attrs, cb)`, which invokes `cb(error, value)` and returns nothing — do not mix the two forms.) Use the return form:

```ts
const { error: icsError, value: icsValue } = createEvent(attrs);
```

**Check `icsError` explicitly** — the library does not throw. If it is set, log `` `[poll-email] .ics build failed for poll ${pollId}: ${scrubTokens(String(icsError))}` `` and **send the emails without the attachment**, adjusting the copy to drop the "there's a calendar file attached" sentence. The time in words is the payload; the `.ics` is a convenience. A calendar file that will not build must never suppress the notification that the meeting is happening — that would be the tail wagging the dog.

**Attachment:** `filename: 'orange-jelly-poll.ics'`, `content: Buffer.from(icsValue, 'utf8').toString('base64')`. Also set `headers: { 'Content-Class': 'urn:content-classes:calendarmessage' }` via the `headers` passthrough — Outlook needs it to render the card.

#### Add-to-calendar links

Plain URLs. No third-party script — the CSP allows neither, and an email cannot run one anyway.

**Google** (`YYYYMMDDTHHMMSSZ` for slots; `YYYYMMDD/YYYYMMDD` with the exclusive end for dates):

```
https://calendar.google.com/calendar/render
  ?action=TEMPLATE
  &text=<encodeURIComponent(title)>
  &dates=<start>/<end>
  &details=<encodeURIComponent(details)>
  &location=<encodeURIComponent(location)>
```

**Outlook Web** (`startdt`/`enddt` as full ISO 8601 with the `Z`; `allday=true` for date-only):

```
https://outlook.live.com/calendar/0/deeplink/compose
  ?path=/calendar/action/compose
  &rru=addevent
  &subject=<encodeURIComponent(title)>
  &startdt=<ISO8601Z>
  &enddt=<ISO8601Z>
  &body=<encodeURIComponent(details)>
  &location=<encodeURIComponent(location)>
```

Omit `&location=` entirely when `polls.location` is null rather than emitting an empty parameter. Every parameter goes through `encodeURIComponent`. The assembled URL then goes through `escapeHtml()` when it lands in an `href`, because `&` in an attribute must be `&amp;` — that is not belt-and-braces, it is required for the URL to survive a strict parser.

**Plain text:**

```
Hi <display_name>,

It's confirmed.

  <poll title>
  Saturday, 4 July 2026, 7:30pm – 9:00pm (UK time)
  The Anchor, Stanwell Moor

<description, if there is one>

There's a calendar file attached — open it and the time drops into your diary.
Or use one of these:

  Google Calendar:  <google url>
  Outlook:          <outlook url>

The poll page stays live and now shows the confirmed time:

  https://www.orangejelly.co.uk/availability/p/<participant_token>

Can't make it after all? Reply to this email and it goes straight to
<organiser_name>.

--
How we handle your details

<the same Article 14 notice as §4.3, from the same exported constant>

Orange Jelly
www.orangejelly.co.uk
```

The time is rendered **three times over** in different forms — in the subject as a short date, in the body as full prose with the zone named, and in the `.ics` as machine data. That redundancy is deliberate. The `.ics` is the thing that silently goes wrong; the words are what a person actually reads and can sanity-check against.

**HTML:** same shell. Body:

```html
<p style="margin:0 0 16px;">Hi ${escapeHtml(displayName)},</p>
<p style="margin:0 0 24px;font-size:22px;font-weight:700;">It&rsquo;s confirmed.</p>

<table role="presentation" cellpadding="0" cellspacing="0" border="0"
       style="width:100%;margin:0 0 24px;background:#ffffff;border-radius:8px;
              border-left:4px solid #F65403;">
  <tr>
    <td style="padding:20px;">
      <div style="font-size:18px;font-weight:700;margin:0 0 8px;">${escapeHtml(pollTitle)}</div>
      <div style="font-size:17px;font-weight:600;margin:0 0 4px;">${escapeHtml(whenInWords)}</div>
      ${location ? `<div style="font-size:15px;color:rgba(26,47,73,0.72);">${escapeHtml(location)}</div>` : ''}
    </td>
  </tr>
</table>

${description ? `<p style="margin:0 0 24px;">${escapeHtml(description)}</p>` : ''}

${icsAttached ? `<p style="margin:0 0 16px;">
  There&rsquo;s a calendar file attached &mdash; open it and the time drops into
  your diary. Or use one of these:
</p>` : `<p style="margin:0 0 16px;">Add it to your calendar:</p>`}
<p style="margin:0 0 24px;">
  <a href="${escapeHtml(googleUrl)}"
     style="display:inline-block;background:#01619E;color:#ffffff;text-decoration:none;
            padding:12px 20px;border-radius:6px;font-weight:600;min-height:44px;
            line-height:20px;margin:0 8px 8px 0;">Add to Google Calendar</a>
  <a href="${escapeHtml(outlookUrl)}"
     style="display:inline-block;background:#01619E;color:#ffffff;text-decoration:none;
            padding:12px 20px;border-radius:6px;font-weight:600;min-height:44px;
            line-height:20px;margin:0 8px 8px 0;">Add to Outlook</a>
</p>

<p style="margin:0 0 24px;font-size:14px;">
  The poll page stays live and now shows the confirmed time:<br>
  <a href="${escapeHtml(participantUrl)}" style="color:#01619E;word-break:break-all;">${escapeHtml(participantUrl)}</a>
</p>
<p style="margin:0 0 24px;font-size:14px;">
  Can&rsquo;t make it after all? Reply to this email and it goes straight to
  ${escapeHtml(organiserName)}.
</p>

<hr style="border:0;border-top:1px solid rgba(26,47,73,0.18);margin:0 0 16px;">
<!-- the same Article 14 notice block as §4.3, from the same exported constant -->
```

`whenInWords` is `formatOptionForEmail(confirmedOption)`. `icsAttached` is `false` when the `.ics` build errored — the copy must not promise an attachment that is not there.

**The organiser's copy** is the same template with two changes: the opening line becomes *"You've confirmed the time. Everyone who gave us an email address has been told."*, and the privacy notice is dropped (the organiser is not an Article 14 data subject here — they supplied their own details). The participant URL stays, since the organiser already holds it. The organiser link is **not** in this email — it is a fan-out email and the template that builds it is `buildConfirmEmail`, whose input type, like `buildParticipantEmail`'s, has no `organiserToken` field. Same test asserts the same thing.

**On failure:** the poll is already `confirmed` and the page shows the confirmed time. Per-recipient failures are caught individually so one bad address cannot stop the rest of the fan-out — that is the whole reason for the try/catch inside the loop rather than around it. `confirmOption` returns `{ success: true }` if the status write succeeded, regardless of how many sends failed.

But a silent partial fan-out is worse than a silent single failure, because the organiser believes everyone has been told. So: count the failures, and **write the count back**. **Migration addition (NET NEW):** `alter table polls add column if not exists confirm_notify_failures integer not null default 0;` Write the loop's `failures` to it after the loop completes. The organiser page reads it and, when non-zero, shows a `role="status"` note (§1 O6.6 — deliberately not `Alert`, whose hardcoded `role="alert"` would interrupt): *"Confirmed. We couldn't reach `<n>` of the `<total>` people on this poll — here are the details to send yourself:"* followed by the copyable block. This is the one place a send failure changes what the organiser sees, and it must — telling someone "everyone knows" when they don't is the failure that actually costs a meeting.

---

### 4.5 Non-responders — a nudge (Phase 5, optional)

**The problem this email has, before any of it is specified.** A `poll_participants` row only exists once someone has responded — that is the data model. So "participants of an open poll who have submitted no `poll_responses` rows" is, at the schema level, **an empty set**. The briefed email cannot be built against the current schema, and that must be said rather than papered over.

There are exactly two honest routes:

1. **Nudge the organiser instead of the participants.** Cron finds `open` polls with no new responses for seven days and emails the organiser: *"Three people have responded to `<poll title>`. If you're still waiting on others, here's the link to chase them."* Requires **no new table**, sends **no** email to a third party, and adds **zero** relay surface. **This is the recommendation, and it is what is specified below.**
2. **Add an invitee list.** A `poll_invitees` table of names and addresses the organiser types in, so there is something to nudge. This is the address book identified as the open-relay risk, and it would put arbitrary attacker-supplied addresses back in scope on the sending domain. It would need its own verification-and-throttling design. **Do not do this to get a reminder email.**

If Peter wants route 2, it is its own scoped piece of work with its own security review, not a Phase 5 polish item. See §7.

| | |
|---|---|
| **Trigger** | Vercel cron, the same daily sweep as retention (`sendPendingNudges`, §3.8). Never on a page load. |
| **Recipient** | `polls.organiser_email` of an `open`, verified poll with no `poll_responses` activity for seven days. |
| **Reply-to** | None. Same reasoning as the digest — there is no third party to reply to. |
| **Subject** | `A quick nudge — "<poll title>" is still open` |
| **Contains** | Both links, clearly separated, and the count of responses so far. |
| **`List-Unsubscribe`** | Required. See §4.6. |

**The cron query:**

```sql
select p.id, p.title, p.organiser_name, p.organiser_email,
       p.participant_token, p.organiser_token
from polls p
where p.status = 'open'
  and p.email_verified_at is not null
  and p.nudge_sent_at is null
  and p.digest_opt_out = false
  and not exists (
    select 1 from poll_responses r
    where r.poll_id = p.id and r.updated_at > now() - interval '7 days'
  )
  and p.created_at < now() - interval '7 days';
```

The final predicate matters: without it, a poll created an hour ago has no responses in the last seven days either, and gets nudged on day one.

**Plain text:**

```
Hi <organiser_name>,

Your poll has been quiet for a week:

  <poll title>

<n> people have responded so far. The best option right now is
Saturday, 4 July 2026, 7:30pm – 9:00pm (UK time), with 4 yeses.

Still waiting on people? Here's the link to send them:

  https://www.orangejelly.co.uk/availability/p/<participant_token>

Happy with what you've got? Confirm the time and everyone gets told:

  https://www.orangejelly.co.uk/availability/o/<organiser_token>

This is the only nudge we'll send about this poll.

Orange Jelly
www.orangejelly.co.uk
```

Handle `<n> = 0` — a poll nobody has answered is the commonest case for this email, and "0 people have responded so far. The best option right now is <undefined>" is the obvious crash. When there are no responses, drop the best-option sentence entirely and use *"Nobody has responded yet."* The same suppression applies when no option has any yes or if-need-be (§1 O3.9).

**HTML:** the §4.2 digest shell, with the two links under separate headings — **"Send this to the people you're inviting"** above the participant link and **"Private — just for you"** above the organiser link. The visual separation is the control that stops an organiser forwarding the wrong one, and it is the same separation the post-verification email uses.

**Send once per poll, ever.** **Migration addition (NET NEW):** `alter table polls add column if not exists nudge_sent_at timestamptz;` The cron query filters `nudge_sent_at is null`. Set it only after a successful send. A tool that nudges twice is spam, and the organiser opted into exactly one poll, not a mailing list.

**On failure:** log `` `[poll-email] Nudge not sent for poll ${pollId}: ${scrubTokens(String(err))}` ``, leave `nudge_sent_at` null so tomorrow's sweep retries, and return `200` from the cron route. A cron failing on one poll must not abort the sweeps running in the same job. The pass order is fixed in §3.8: retention delete, unverified-draft delete, digest flush, nudges. The two deletes are GDPR obligations; the rest are niceties and go last.

---

### 4.6 Deliverability — the risk, and the fix

**The exposure, stated plainly.** Resend's free tier is **100 emails a day and 3,000 a month**. This tool's send volume is not the organiser's send volume — it is the *fan-out*. One poll with 20 people invited produces: 1 verify + 1 links + up to 24 digests over the poll's life (hourly window) + up to 20 edit links + 21 confirms = **roughly 65 emails from a single poll**. Two live polls in one day would take a bite out of the daily cap. Three could exhaust it.

**What "exhaust it" actually costs.** Not "polls stop working" — that is the harmless failure. The real one: `submitContactForm` and the poll tool sit on the **same Resend account and the same sending domain**. A day of poll activity that hits the cap means **a real client enquiry silently fails to reach Peter's inbox**. That lead is already in Supabase, so it is not lost — but nobody knows it arrived until someone opens the admin dashboard. The lead-notification path is best-effort by design (`src/lib/email.ts` says so explicitly in its own doc comment), and that design is correct precisely *because* it assumes email is a nicety on top of a durable write. It was never designed to absorb another feature eating its quota.

**The reputation exposure is the more serious half.** Poll mail is, by its nature, unsolicited mail to third parties who never asked Orange Jelly for anything. Even done perfectly — verified organiser, no address book, participants emailed only at addresses they typed themselves — this is mail that will attract spam complaints at a rate transactional client mail never does. Some percentage of recipients will mark it as junk simply because they do not remember agreeing to it. On a shared domain, those complaints are attributed to `orangejelly.co.uk`, and the damage lands on **the deliverability of the client work the business actually runs on**.

**Recommendation: a separate sending subdomain for poll mail, before Phase 2b ships.**

| | |
|---|---|
| **Domain** | `poll.orangejelly.co.uk`, verified separately in Resend with its own DKIM and its own Return-Path. |
| **Sender** | `POLL_FROM_EMAIL=Orange Jelly Polls <polls@poll.orangejelly.co.uk>` — **NET NEW**, to be added to `.env.example` and to Vercel. |
| **Client mail** | Stays exactly where it is on `CONTACT_FROM_EMAIL`. Not touched, not migrated, not risked. |

**Why a subdomain rather than a separate account or just "being careful":**

1. **Reputation is tracked per sending domain and per DKIM `d=` value.** A subdomain with its own DKIM key is a distinct reputation entity to Gmail, Outlook and every major filter. Poll complaints accrue to `poll.orangejelly.co.uk` and cannot pull down the apex. This is the entire and sufficient reason; the rest are bonuses.
2. **It is a firebreak, and firebreaks are only useful before the fire.** Retrofitting a subdomain after `orangejelly.co.uk` has taken reputation damage does not undo the damage — the apex still carries it, and rebuilding a burnt domain reputation takes months. The cost of doing this now is a DNS record and an env var. The cost of doing it later is a burnt domain plus the DNS record plus the env var.
3. **It makes the volume visible.** Separate domain, separate stats in the Resend dashboard. Peter can see poll mail growing without inferring it from a total.
4. **It bounds the blast radius of the bug we have not found yet.** A loop bug in the fan-out on a shared domain is a business incident. On a subdomain it is a poll outage.

**The DMARC subtlety, because it is the part people get wrong.** A DMARC record on `orangejelly.co.uk` applies to subdomains by inheritance unless overridden. Publish an explicit `sp=` policy on the apex, or a dedicated `_dmarc.poll.orangejelly.co.uk` record, so poll-mail policy can be set independently of client-mail policy. Otherwise tightening the apex to `p=reject` later silently changes how poll mail is handled — the "improved our security posture and broke a feature nobody connected to it" failure.

**Also required, and none of it optional:**

- **Verify the account's actual Resend plan before Phase 2b.** This is currently unverified. The 100/day figure may be wrong in either direction, and the whole shape of this risk depends on it. The 2 requests/second figure that sets the loop's `sleep(120)` needs the same check. If the account is already on a paid tier the urgency drops but the reputation argument does not — the subdomain is warranted at any volume.
- **`List-Unsubscribe` on the digest and the nudge.** Both are recurring-ish mail to an inbox and both need a one-click opt-out header, via the `headers` passthrough on `sendPollEmail`. Send both `List-Unsubscribe: <https://www.orangejelly.co.uk/availability/o/<organiser_token>/unsubscribe>, <mailto:peter@orangejelly.co.uk?subject=unsubscribe>` and `List-Unsubscribe-Post: List-Unsubscribe=One-Click` — Gmail's bulk-sender rules require the POST form, and the header alone without it is not compliant. The unsubscribe route sets a **NET NEW** `polls.digest_opt_out boolean not null default false`, which both §4.2 and §4.5 must check before sending. The verify, links, edit-link and confirm emails are single transactional messages and do not need one. "We're under the volume threshold" is not a defence worth relying on.
- **A hard per-poll send ceiling.** Add a counter and refuse to fan out beyond a fixed limit per poll per day. With an 8-option cap and no address book the natural ceiling is low, but "the data model makes this impossible" is exactly what gets said before the incident. This is a cheap belt on top of the braces.
- **Rate limiting must land first.** Phase 2a before 2b. Poll mail does not go out on any Orange Jelly domain until organiser verification and rate limiting are live. This section does not reopen that; it reinforces it.

---

### 4.7 Summary of net-new work this section creates

| Item | Type | Blocking phase |
|---|---|---|
| `verify_token`, `verify_token_expires_at` on `polls` | migration | 1 |
| `last_digest_at`, `digest_pending_since` on `polls` | migration | 2 |
| `confirm_sequence`, `confirm_notify_failures` on `polls` | migration | 4 |
| `nudge_sent_at`, `digest_opt_out` on `polls` | migration | 5 |
| 24-hour unverified-draft delete predicate | cron SQL | 5 |
| `sendPollEmail` + `sendPollEmails` in `src/lib/email.ts` | code | 1 |
| `src/lib/poll-emails/` module + tests | code | 1 |
| `POLL_FROM_EMAIL` in `.env.example` and Vercel | config | 2b |
| `npm install ics` | dependency | 4 |
| `src/lib/poll-emails` added to `DIRECTORY_TARGETS` and `shouldCheckCliPath` in `check-british-english.mjs` | tooling | 1 |
| `poll.orangejelly.co.uk` verified in Resend, DKIM + `sp=` DMARC | infrastructure | 2b |
| ~~A monitored inbox for data-rights requests~~ — resolved: `peter@orangejelly.co.uk` | ~~prerequisite~~ done | — |
| Confirm the live Resend plan's daily cap and rate limit | prerequisite | 2b |

**Superseded — see the correction in the front matter.** `20260716150000_availability_polls.sql` was applied to production on 16 July 2026, so it is no longer editable. Every migration addition in the table above ships as a follow-up `alter table`, gathered into `supabase/migrations/20260716160000_availability_polls_email_columns.sql` and applied the same day. All of them are nullable additions or carry a default, so they are additive and carry no risk to the existing rows.

---

## 5. Test plan

### 5.0 What already exists — do not rebuild

Two modules under this feature's umbrella are **already built and already tested**. Verify with `npx vitest run` before writing a line.

**`src/lib/dateUtils.ts`** — `src/lib/dateUtils.test.ts` holds **43 passing tests** covering `isValidIsoDate`, `formatDateInLondon`, `toLocalIsoDate`, `getTodayIsoDate`, `formatSlotInLondon`, `formatSlotRangeInLondon`, `londonWallClockToInstant` and `compareIsoDates` — including both DST boundaries (the spring-forward throw and the autumn-overlap earlier-occurrence rule), the date-only-vs-instant guard, and the 30-February / non-leap-year rejections.

**Do not write a single new DST test.** Poll code proves it *calls* `dateUtils` correctly; `dateUtils` proves the arithmetic. If a poll test asserts on a formatted London string, it is testing the wrong module — assert that the right helper was called with the right arguments, or assert on the helper's documented output shape and nothing more. The two shapes a developer will need:

- `formatSlotInLondon(instant)` → `'Saturday, 4 July 2026 at 7:30pm'` (`EEEE, d MMMM yyyy 'at' h:mmaaa`, dateUtils.ts:111).
- `formatSlotRangeInLondon(start, end)` → `'Saturday, 4 July 2026, 7:30pm – 9:00pm'` on one London day, and `'Saturday, 4 July 2026, 11:00pm – Sunday, 5 July 2026, 12:30am'` when it crosses midnight (dateUtils.ts:128). It **throws** when `end <= start`. A slots poll renders ranges, not single instants — use this one.

**The one new `dateUtils` test that is required** is §1 E17's hazard pin: `formatSlotInLondon('2026-07-04')` returns `'Saturday, 4 July 2026 at 1:00am'` rather than throwing. Pin the hazard with a test rather than a comment.

**`src/lib/poll-tokens.ts`** — `src/lib/poll-tokens.test.ts` holds **27 passing tests**. The module exports `TOKEN_LENGTH` (22), `TOKEN_ENTROPY_BITS` (128), `generateToken()`, `generatePollTokens()`, `isWellFormedToken()` and `scrubTokens()`. There is **no `src/lib/tokens.ts` and there must not be one** — importing from `@/lib/poll-tokens` is the only correct path. The existing suite already proves entropy, base64url shape, exact length, non-repetition across 5,000 draws, non-derivability of the organiser token from the participant token across 200 pairs, `isWellFormedToken`'s accept/reject table, and `scrubTokens`' uuid-preserving behaviour. **Adding a second token suite is duplicated work, not coverage.** §5.4 below lists only the gaps.

The repo runs **149 tests across 12 files** today (Vitest 3, jsdom, `globals: true`, setup at `src/test/setup.ts`, `@` aliased to `src/` — see `vitest.config.ts`). Everything below is additive.

---

### 5.1 Runner and file layout

| File | Covers | Status |
|---|---|---|
| `src/lib/poll-tokens.test.ts` | Token generator, shape guard, log scrubber | **EXISTS — 27 tests. Extend only per §5.4.** |
| `src/lib/dateUtils.test.ts` | London date/time helpers | **EXISTS — 43 tests. One addition only (E17's hazard pin).** |
| `src/lib/poll-state.test.ts` | Status state machine | Unit — **net new** |
| `src/lib/poll-aggregate.test.ts` | Aggregate-count logic | Unit — **net new** |
| `src/lib/rate-limit.test.ts` | Request throttle | Unit — **net new (module is net new too, see §5.2)** |
| `src/lib/email.test.ts` | `sendPollEmail` + `escapeHtml` end-to-end | Unit, Resend mocked — **net new** |
| `src/lib/poll-emails/participant.test.ts` | "No organiser token in a participant email" | Unit — **net new** |
| `src/lib/db/polls.test.ts` | Data layer contract | Unit, Supabase mocked — **net new** |
| `src/app/actions/polls.test.ts` | All eight server actions | Unit, all boundaries mocked — **net new** |
| `src/components/availability/OptionCard.test.tsx` | Participant vote card | Component (RTL) — **net new, as is the directory** |
| `src/components/availability/ResultsTable.test.tsx` | Organiser matrix | Component (RTL) — **net new** |
| `e2e/availability.spec.ts` | Two happy-path journeys | Playwright — **Phase 4, optional** |

`vitest.config.ts` includes `src/**/*.{test,spec}.*` only, so an `e2e/` directory will not be picked up by Vitest — no exclusion needed.

**E2E is a bigger net-new bill than it looks.** The `playwright` devDependency is the driver library, **not** the `@playwright/test` runner — a `.spec.ts` with `import { test, expect } from '@playwright/test'` will not resolve today. Taking Phase 4 E2E means adding `@playwright/test`, a `playwright.config.ts`, an `e2e/` directory and a `test:e2e` script. It is not a gate for any phase — the unit suite is. If Phase 4 slips, drop the E2E file rather than the unit tests.

---

### 5.2 Mock strategy

Repo rule: never hit a real API. Copy the shape of `src/app/actions/contact.test.ts` verbatim — module-level `vi.mock` factories, `beforeEach(() => vi.clearAllMocks())`, `vi.mocked(fn).mockResolvedValue(...)` per test.

**Always mock:** `@/lib/db/polls` (the whole data layer, in action tests), `@/lib/db/supabase-admin` (in `db/polls.test.ts` only), `@/lib/email`, `@/lib/rate-limit`, `next/headers`, `next/cache`.
**Never mock:** `@/lib/dateUtils`, `@/lib/poll-tokens`, `@/lib/poll-state`, `@/lib/poll-aggregate` — these are the internal logic under test and mocking them would test the mock.

Two of the mocked boundaries **do not exist yet** and must be built before their tests can run. Do not read this list as a description of the repo:

- **`src/lib/email.ts` → `sendPollEmail` is NET NEW.** The module today exports only `escapeHtml` and `sendLeadNotification`. `sendLeadNotification` reads its recipient from `process.env.CONTACT_NOTIFICATION_EMAIL` and takes no `to`, so it **cannot** address a per-call recipient and is unusable for participant fan-out. `sendPollEmail` is the `to`-taking function from §4.
- **`src/lib/rate-limit.ts` is NET NEW — the module does not exist.** Nothing in the repo throttles anything today. Its contract is pinned in §3.4 and is binding here per **R14**: `checkRateLimit(bucket: RateLimitBucket, key: string): Promise<{ allowed: boolean; retryAfterSeconds: number }>` — **two arguments**, not one.

```ts
// src/app/actions/polls.test.ts — header
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  createPoll,
  verifyOrganiserEmail,
  submitResponse,
  updateResponse,
  setPollOpen,
  deleteResponse,
  deletePoll,
  confirmOption,
} from './polls';
import {
  storePoll,
  markOrganiserVerified,
  storeParticipantResponse,
  updateParticipantResponse,
  getPollByParticipantToken,
  getPollByOrganiserToken,
  getPollByEditToken,
  setPollStatus,
  removeResponse,
  removePoll,
  setConfirmedOption,
} from '@/lib/db/polls';
import { sendPollEmail } from '@/lib/email';
import { checkRateLimit } from '@/lib/rate-limit';

vi.mock('@/lib/db/polls', () => ({
  storePoll: vi.fn(),
  markOrganiserVerified: vi.fn(),
  storeParticipantResponse: vi.fn(),
  updateParticipantResponse: vi.fn(),
  getPollByParticipantToken: vi.fn(),
  getPollByOrganiserToken: vi.fn(),
  getPollByEditToken: vi.fn(),
  setPollStatus: vi.fn(),
  removeResponse: vi.fn(),
  removePoll: vi.fn(),
  setConfirmedOption: vi.fn(),
}));

// `sendPollEmail` is the NET NEW `to`-taking function from §4.
// `sendLeadNotification` reads CONTACT_NOTIFICATION_EMAIL and cannot address a
// per-call recipient, so it is not used here. It is stubbed only so the factory
// mirrors the real module's export list.
vi.mock('@/lib/email', () => ({
  sendPollEmail: vi.fn().mockResolvedValue({ success: true }),
  sendPollEmails: vi.fn().mockResolvedValue({ sent: 1, failed: 0 }),
  sendLeadNotification: vi.fn().mockResolvedValue({ success: true }),
  escapeHtml: (value: string) => value,
}));

// NET NEW module — see the note above. Two arguments (R14).
vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ allowed: true, retryAfterSeconds: 0 }),
  isRateLimitConfigured: vi.fn().mockReturnValue(true),
  hashKey: (value: string) => value,
  getClientIp: () => '203.0.113.1',
}));

// headers() is synchronous on next 14 — the mock must be too.
vi.mock('next/headers', () => ({
  headers: () => new Map([['x-forwarded-for', '203.0.113.1']]),
}));

// revalidatePath has no in-repo precedent — `grep -rn "revalidatePath\|next/cache" src/`
// returns nothing repo-wide. It is a NEW pattern for this feature (R8), so it gets
// mocked and asserted.
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));
```

Fixtures live in `src/test/fixtures/polls.ts` (**NET NEW** — `src/test/` currently holds only `setup.ts`, `utils.tsx` and `packages/`) — factories, not inline literals, per the repo's test rule. Use the documented test data: venue `The Test Arms`, organiser `Test Landlord`, `test@pub.example`.

Two mock-boundary traps to state explicitly:

1. **`vi.mock` is hoisted.** A fixture referenced inside a factory body must be declared inside the factory or accessed via `vi.hoisted`. `contact.test.ts` sidesteps this by keeping factories literal — do the same.
2. **`escapeHtml` is mocked to identity** in `contact.test.ts:13`. Keep that, and prove escaping separately in `src/lib/email.test.ts` (**NET NEW**) against the real `escapeHtml` with Resend's `emails.send` mocked — otherwise the identity mock hides the very injection the escaping exists to stop.

---

### 5.3 Server action tests — `src/app/actions/polls.test.ts`

Highest priority per the repo's prioritisation rule. Every action gets a happy path and at least one error path. Six return `Promise<{ success?: boolean; error?: string }>` — both keys optional, no discriminated union, matching `submitContactForm`. `createPoll` adds `nextPath?`; `submitResponse` adds `editUrl?` (§3.1). Assertions follow `contact.test.ts`: check `result.error` is defined, or `result.success` is `true`.

#### `createPoll`

```
describe('createPoll', () => {
  it('should store the poll and send the organiser the verify link when the input is valid')
  it('should leave the poll in draft status when it is first created')
  it('should generate a participant token, an organiser token and a verify token that all differ when a poll is stored')
  it('should not return any token to the caller when a poll is stored')
  it('should return an error without storing when the title is empty')
  it('should return an error without storing when fewer than two options are supplied')
  it('should return an error without storing when more than eight options are supplied')
  it('should return an error without storing when the organiser email has no @')
  it('should return an error without storing when a slots poll supplies an option whose end is not after its start')
  it('should return an error without storing when a dates poll supplies an option carrying a time')
  it('should return an error without storing when two options describe the same date')
  it('should return the date-format message without throwing when a dates poll supplies an unparseable date')
  it('should silently accept without storing when the honeypot website field is filled')
  it('should return an error without storing when the rate limiter refuses the request')
  it('should return an error without storing when the rate limiter is unavailable')
  it('should still report success when the verify email fails')
  it('should not send the verify email when storage fails')
  it('should not report success when storage fails')
})
```

Notes that decide implementation:

- **The option-count bounds are 2 and 8** (§3.6.1). Nothing in the database enforces them — `poll_options` has no count constraint — so they are an application rule and the test must read the same constants the action does. Do not hardcode the integers in the test.
- The **honeypot** test mirrors `contact.test.ts:84-89` exactly — `{ ...validPoll, website: 'https://spam.test' }`, expect `success: true`, expect `storePoll` **not** called.
- **"should still report success when the verify email fails"** encodes the store-first-notify-best-effort philosophy from `contact.ts:70-83`. Use `mockRejectedValueOnce(new Error('Resend down'))` plus a `vi.spyOn(console, 'error').mockImplementation(() => {})` that is restored, exactly as `contact.test.ts:55-65` does.
- **Rate limiting is different from the email path and must not be modelled on it.** A refused rate limit is a user-facing error, not a swallowed one: `checkRateLimit` returning `{ allowed: false }` must give `result.error` and `storePoll` not called. `createPoll` is **fail-closed**, so `isRateLimitConfigured()` returning `false` must also refuse (§3.4).
- **"should return the date-format message without throwing when a dates poll supplies an unparseable date"** is the regression test for the chained-`.refine()` bug: `compareIsoDates` throws on malformed input, so a naive chain turns a typo into a 500. Drive it with `dates: ['rubbish']` and assert `'Enter a date as YYYY-MM-DD.'`.
- The three-token test asserts mutual inequality and that all three satisfy `isWellFormedToken` — the entropy and non-derivability proofs live in `poll-tokens.test.ts` and are not repeated here.

#### `verifyOrganiserEmail`

```
describe('verifyOrganiserEmail', () => {
  it('should set email_verified_at and open the poll when the token matches a draft poll')
  it('should null the verify token when verification succeeds')
  it('should send the organiser both the participant link and the organiser link when verification succeeds')
  it('should return the same error for an unknown token as for a consumed one')
  it('should return an error when the verify token has expired')
  it('should return an error when the token matches a poll that is already open')
  it('should still report the poll live when the links email fails')
})
```

Per **R15** the token is single-use: "already open" is an error path, not an idempotent success, because the conditional update's `and status = 'draft'` clause will not match. "should return the same error for an unknown token as for a consumed one" is the oracle test — assert string equality between the two results, not merely that both are errors.

#### `submitResponse`

```
describe('submitResponse', () => {
  it('should create a participant and store one response per option when the poll is open')
  it('should mint a fresh edit token for each participant rather than reusing a poll-level token')
  it('should return the participant edit url to the caller when a response is stored')
  it('should create a second participant when the same display name responds twice')
  it('should notify the organiser when a response is stored')
  it('should send the participant their own edit link when they supply an email')
  it('should not send a participant email when no email is supplied')
  it('should store null rather than an empty string when the email field is left blank')
  it('should never include the organiser token in the participant email')
  it('should return an error without storing when the display name is empty')
  it('should return an error without storing when an option id does not belong to this poll')
  it('should return an error without storing when the availability value is not yes, if_need_be or no')
  it('should return an error without storing when a vote is missing for an option')
  it('should return an error without storing when the participant token is malformed')
  it('should return an error without storing when the participant token matches no poll')
  it('should return an error without storing when the poll is closed')
  it('should return an error without storing when the poll is confirmed')
  it('should return an error without storing when the poll is still in draft')
  it('should return an error without storing when the poll is past expires_at')
  it('should silently accept without storing when the honeypot website field is filled')
  it('should return an error without storing when the rate limiter refuses the request')
  it('should still report success when the organiser notification fails')
  it('should push expires_at forward when a response is stored')
  it('should revalidate the participant path when a response is stored')
})
```

**"should mint a fresh edit token for each participant"** closes a real trap in the existing code. `generatePollTokens()` (poll-tokens.ts:70) returns `{ participantToken, organiserToken, editToken }` — a *single* `editToken`. But the schema puts `edit_token` on `poll_participants`, one row per participant, `not null unique`. If the action stores the poll-level `editToken` on every participant, the `unique` constraint rejects the second responder — and if someone "fixes" that by dropping the constraint, every participant can edit every other participant's response. The action must call `generateToken()` per participant. Drive the test by having two participants respond and asserting their stored `edit_token` values differ.

**"should never include the organiser token in the participant email"** is the single highest-value test in this suite — it is §4's one hard security rule about email content. Implement it by capturing `vi.mocked(sendPollEmail).mock.calls`, selecting the call whose `to` is the participant's address, and asserting `JSON.stringify(call)` does not contain `poll.organiser_token`. Not a `toMatchObject` — a substring check across the whole payload, so it catches the token appearing in html, text or a link. `src/lib/poll-emails/participant.test.ts` asserts the same thing one level down, against the builder.

**"should create a second participant when the same display name responds twice"** pins the accepted duplicate-participant behaviour from §3.5 as intended, not as a defect. `poll_participants` has no unique constraint on `(poll_id, display_name)`, so the database permits it by design. If someone later "fixes" it into an upsert, this test fails and forces the product conversation.

**"should return an error without storing when the participant token is malformed"** pins the `isWellFormedToken` guard: junk is rejected before any database round-trip, so `getPollByParticipantToken` is never called.

**"should return an error without storing when the poll is still in draft"** must assert the message is `'That link is not valid.'` — identical to the unknown-token case (§1 E7). A draft must not be distinguishable from a poll that never existed.

#### `updateResponse`

```
describe('updateResponse', () => {
  it('should update the existing responses in place when the edit token matches a participant')
  it('should not change any response id when a response is updated')
  it('should not create a second participant when a response is updated')
  it('should resolve the poll from the edit token when the participant token in the url disagrees')
  it('should return an error when the edit token matches no participant')
  it('should return an error when the poll is closed')
  it('should return an error when an option id belongs to a different poll')
  it('should still report success when the organiser notification fails')
})
```

**"should not change any response id"** is the upsert-payload test: supabase-js emits `ON CONFLICT DO UPDATE SET` for every column in the payload, so a fresh `randomUUID()` would rewrite the primary key on every edit. Assert the payload reuses the ids read back from `poll_responses`.

The conflict target is `poll_responses (participant_id, option_id)` — the table's declared `unique (participant_id, option_id)`. That is the only valid target; there is no unique constraint on `(poll_id, option_id)` and there must not be one, because several participants vote on the same option.

#### `setPollOpen` / `deleteResponse` / `deletePoll`

Per **R1** this is `setPollOpen(organiserToken, open)`, not `closePoll(organiserToken)`.

```
describe('setPollOpen', () => {
  it('should move the poll to closed when the organiser token matches an open poll')
  it('should set closes_at when a poll is closed')
  it('should move the poll to open when the organiser token matches a closed poll')
  it('should clear closes_at when a poll is reopened')
  it('should return an error when the organiser token matches no poll')
  it('should return an error when the participant token is passed instead of the organiser token')
  it('should return an error when the poll is already confirmed')
  it('should return an error when the poll is still in draft')
  it('should report success without a second write when the poll is already in the target state')
})

describe('deleteResponse', () => {
  it('should remove the response when the organiser token matches the poll that owns it')
  it('should return an error when the participant belongs to a different poll')
  it('should return an error when the organiser token matches no poll')
  it('should return an error when the participant token is passed instead of the organiser token')
  it('should return an error when the poll is confirmed')
})

describe('deletePoll', () => {
  it('should remove the poll when the organiser token matches')
  it('should remove the poll when the poll is confirmed')
  it('should return an error when the organiser token matches no poll')
  it('should return an error when the participant token is passed instead of the organiser token')
  it('should not send any email when a poll is deleted')
})
```

**"should return an error when the participant token is passed instead of the organiser token"** is the token-confusion test. It must exist on every organiser action — it is the one mistake that turns a participant link into an admin link. Drive it by having `getPollByOrganiserToken` resolve `null` for that value while `getPollByParticipantToken` would have resolved a poll: the action must never fall back to the participant lookup.

**"should remove the poll when the poll is confirmed"** pins §3.6.8: deletion is the Article 17 route and must not be conditional on state.

`deletePoll` relies on `on delete cascade` from `polls` through options, participants and responses (all four FKs in the migration cascade). Do not write a test asserting the children vanish — that is Postgres's job against a mock that will agree with anything. Assert only that `removePoll` was called with the right id.

#### `confirmOption`

```
describe('confirmOption', () => {
  it('should set confirmed_option_id and move the poll to confirmed when the organiser token matches an open poll')
  it('should confirm the poll when the organiser token matches a closed poll')
  it('should keep the original closes_at when a closed poll is confirmed')
  it('should set closes_at when an open poll is confirmed')
  it('should increment confirm_sequence when an option is confirmed')
  it('should notify every invited participant including those who never voted when an option is confirmed')
  it('should notify the organiser when an option is confirmed')
  it('should notify a participant only once when they hold two participant rows with the same email')
  it('should notify the organiser only once when they also voted under a different display name')
  it('should include the time written out in words and the timezone in the confirmation email')
  it('should attach an ics file to the confirmation email when the poll uses slot options')
  it('should attach an all-day ics file when the poll uses date-only options')
  it('should send without an attachment when the ics build fails')
  it('should return an error when the option belongs to a different poll')
  it('should return an error and send nothing when the poll is already confirmed')
  it('should return an error when the poll is still in draft')
  it('should return an error without confirming when the rate limiter is unavailable')
  it('should still report success when some confirmation emails fail')
  it('should record the failure count when some confirmation emails fail')
  it('should revalidate the participant path and the organiser path when an option is confirmed')
})
```

`confirmed_option_id` and `option_kind` are the real columns; `polls_confirmed_option_fk` is `on delete set null`, so a confirmed option that is later deleted nulls the pointer rather than cascading the poll away — do not test that against a mock either.

"including those who never voted" pins §4.4's non-voter fan-out. The two dedupe tests pin the `Map`-based recipient builder that replaces the wrong `UNION`. "should still report success when some confirmation emails fail" pins the fan-out as partial-failure-tolerant — the poll is confirmed in the database and a bounced invitee must not roll that back or surface as an error. "should return an error and send nothing when the poll is already confirmed" is §1 E13's race guard and §1 O6.7's double-tap guard: assert `sendPollEmail` was **not** called. The ics tests key off `option_kind`, which is the column that decides whether an option is a calendar date or an instant range. `confirmOption` is **fail-closed** on the limiter (§3.4).

---

### 5.4 Token generation — `src/lib/poll-tokens.test.ts` (EXISTING — gaps only)

**The module and its suite already exist.** `src/lib/poll-tokens.ts` exports `TOKEN_LENGTH = 22`, `TOKEN_ENTROPY_BITS = 128`, `generateToken()`, `generatePollTokens()`, `isWellFormedToken()` and `scrubTokens()`. Tokens are `randomBytes(16)` → base64url → **exactly 22 characters, exactly 128 bits** — at OWASP's session-identifier floor, not over it. The 22 characters encode 132 bits of *width*, but the entropy is the 128 bits drawn; assert on `TOKEN_ENTROPY_BITS`, never on character count as a proxy for entropy.

The existing 27 tests already cover: the 128-bit floor, base64url shape across 50 draws, exact length across 50 draws, no repeats across 5,000 draws, no first-character concentration across 500 draws, three distinct tokens from `generatePollTokens`, non-derivability across 200 pairs (no shared 8-char prefix, >150 distinct 6-char prefixes), 3,000 globally unique tokens across 1,000 polls, `isWellFormedToken`'s full accept/reject table including padding, `+`, `/` and `../../etc/passwd`, non-string rejection, and `scrubTokens` including the uuid-preservation case that the lookarounds exist for.

**Do not rewrite any of that.** Two genuine gaps remain:

```
describe('generateToken', () => {
  it('should draw from crypto.randomBytes rather than Math.random when a token is generated')
})

describe('generatePollTokens', () => {
  it('should not derive any token from the poll id when a poll is created')
})
```

How the two gaps are actually proved — no hand-waving:

- **CSPRNG source.** The suite proves the *shape* of the output but never its *provenance*, and `Math.random()` output is shape-identical to a good token. Close it with `vi.mock('crypto', ...)` wrapping `randomBytes` in a spy (the module imports `randomBytes` at load, so a module mock is required — a `vi.spyOn(crypto, 'randomBytes')` after import will not intercept it), assert it is called with `16`, and assert `vi.spyOn(Math, 'random')` was never called. This is the only test that proves provenance rather than appearance.
- **No derivability from the poll id.** Generate a poll id with `randomUUID()`, generate the tokens, and assert no token contains any 8-character substring of the id with hyphens stripped. This is the honest limit of a unit test: it cannot prove non-derivability in general, only close the specific bug a reviewer would ship (a token seeded from or slice-derived from the id). Anything stronger belongs in a statistical review, not the suite.

Do not attempt a Shannon-entropy estimate over a 22-character string — it is noise at that length and would flake.

---

### 5.5 State machine — `src/lib/poll-state.test.ts`

Module under test is **NET NEW**: `src/lib/poll-state.ts`, exporting `type PollStatus = 'draft' | 'open' | 'closed' | 'confirmed'`, `canTransition(from, to): boolean` and `assertTransition(from, to): void` (throws). The database CHECK constraint (`check (status in ('draft', 'open', 'closed', 'confirmed'))`) enforces the *set* of valid statuses; nothing in Postgres enforces the *edges*. That is why this module exists and why every edge is tested.

Legal edges, and only these — **five, including `closed → open`, per R1**:

| From | To | Trigger |
|---|---|---|
| `draft` | `open` | `verifyOrganiserEmail` |
| `open` | `closed` | `setPollOpen(t, false)` |
| `closed` | `open` | `setPollOpen(t, true)` |
| `open` | `confirmed` | `confirmOption` |
| `closed` | `confirmed` | `confirmOption` |

```
describe('canTransition', () => {
  it('should allow the move when a draft poll is opened')
  it('should allow the move when an open poll is closed')
  it('should allow the move when a closed poll is reopened')
  it('should allow the move when an open poll is confirmed')
  it('should allow the move when a closed poll is confirmed')

  it('should refuse the move when a draft poll is closed')
  it('should refuse the move when a draft poll is confirmed')
  it('should refuse the move when an open poll is returned to draft')
  it('should refuse the move when a closed poll is returned to draft')
  it('should refuse the move when a confirmed poll is returned to draft')
  it('should refuse the move when a confirmed poll is reopened')
  it('should refuse the move when a confirmed poll is closed')
  it('should refuse the move when a confirmed poll is confirmed again')

  it('should refuse the move when a draft poll transitions to draft')
  it('should refuse the move when an open poll transitions to open')
  it('should refuse the move when a closed poll transitions to closed')

  it('should refuse the move when the source status is not a known status')
  it('should refuse the move when the target status is not a known status')
})

describe('assertTransition', () => {
  it('should throw naming both statuses when the transition is illegal')
  it('should not throw when the transition is legal')
})
```

That is **all 16 ordered pairs** over 4 states — 5 legal, 11 illegal — plus two unknown-status guards. Write it as an explicit table in the test file, not a loop over a matrix derived from the implementation, or the test derives its expectations from the code it is checking and proves nothing:

```ts
const LEGAL: ReadonlyArray<[PollStatus, PollStatus]> = [
  ['draft', 'open'],
  ['open', 'closed'],
  ['closed', 'open'],
  ['open', 'confirmed'],
  ['closed', 'confirmed'],
];
```

Then one `it` per illegal pair, spelled out. Verbose on purpose: a reviewer must be able to read the legal set off the test file without opening the module.

`confirmed` is terminal (§1 O7.1). `confirmed → confirmed` is illegal rather than idempotent because a second confirm would refire the fan-out and email everyone twice.

Note the deliberate asymmetry with `setPollOpen`, which treats "already in the target state" as an idempotent success at the *action* level (§3.6.5) — it does that by matching zero rows on its conditional update and re-reading, not by asking this module about an `open → open` edge. The module stays strict; the action is the place that decides an already-satisfied request is not a failure.

---

### 5.6 Aggregate counts — `src/lib/poll-aggregate.test.ts`

Module under test is **NET NEW**: `src/lib/poll-aggregate.ts`, exporting `aggregateByOption(options, responses): OptionTally[]` where `OptionTally = { option_id, yes, if_need_be, no, responded }` (snake_case throughout — the repo has no `fromDb` mapper, `leads.ts` maps by hand, and this feature must not introduce one), and `bestOption(tallies): OptionTally[]`.

The three availability values are exactly `'yes' | 'if_need_be' | 'no'`, matching the `check (availability in ('yes', 'if_need_be', 'no'))` constraint on `poll_responses`.

Decision 3 makes this load-bearing: during voting, participants see **only** these aggregates. A bug here is not cosmetic — it either leaks per-person votes or misreports the winner.

**Ranking rule, stated so the tests can be read, and taken from §1 O3.5 — there is no weighted score.** Sort by `yes` descending, then `if_need_be` descending, then `poll_options.position` ascending. An earlier draft proposed `score = yes×2 + if_need_be`, which is a *different* ordering (three if-need-bes would beat one yes) and contradicts O3.5. **O3.5 wins; there is no `score` field on `OptionTally`.** `position` is the `poll_options.position` integer, which is also what `poll_options_poll_id_idx (poll_id, position)` orders on.

`bestOption` returns an **array**, not a single tally, because §1 O3.6 badges *every* tied option. It returns `[]` — the badge suppressed entirely — when no option has `yes + if_need_be > 0` (§1 O3.9).

```
describe('aggregateByOption', () => {
  it('should return a tally for every option when no responses exist')
  it('should report zero across every state when an option has no responses')
  it('should count one yes when a single participant votes yes')
  it('should count each state separately when three participants vote yes, if need be and no')
  it('should count a participant once per option when they vote on every option')
  it('should preserve option order by position when tallies are returned')
  it('should ignore responses whose option id is not in the option list')
  it('should not include any participant identifier in the returned tally')
  it('should count responded as the number of participants who voted on that option')
  it('should count responded excluding participants who skipped that option')
})

describe('bestOption', () => {
  it('should return nothing when no options exist')
  it('should return nothing when no responses exist')
  it('should return nothing when every participant voted no on every option')
  it('should return the option with the most yes votes when yes counts differ')
  it('should rank on yes count alone when one option has more yes and fewer if need be')
  it('should return the option with more if need be votes when two options tie on yes')
  it('should return the earlier option by position when two options tie on yes and on if need be')
  it('should return every tied option when two options tie completely')
})
```

**"should rank on yes count alone when one option has more yes and fewer if need be"** is the test that pins O3.5 against the weighted-score reading: an option with 2 yes / 0 if-need-be beats one with 1 yes / 5 if-need-be. Under the rejected `yes×2 + if_need_be` score it would lose 4–7. If someone reintroduces a weighted score, this fails.

**"should return nothing when every participant voted no on every option"** is §1 O3.9 and E2 — without it, the tie rule badges every option and every option is a winner.

**"should not include any participant identifier in the returned tally"** is the aggregate-only rule made testable: assert the returned object keys are exactly `['option_id', 'yes', 'if_need_be', 'no', 'responded']` and that `JSON.stringify(tallies)` contains no participant id and no display name from the fixture. If a future refactor threads participants through for the organiser view, this fails and forces the split into two functions — which is the correct outcome, because the organiser matrix and the participant counts are two different views with two different privacy postures.

---

### 5.7 Data layer — `src/lib/db/polls.test.ts`

Second tier. `src/lib/db/polls.ts` is **NET NEW**. Mock `@/lib/db/supabase-admin` at the module boundary — `getSupabaseAdminClient()` and `isSupabaseAdminConfigured()` are the helpers `leads.ts` uses and the ones `polls.ts` must use. Assert the `StoredResult` contract from `leads.ts:31-35` — `{ stored: boolean; id?: string; error?: string }` — with the one departure in §3.1: **real errors surface**, they are not flattened into `{ stored: false }` with only a `console.error`.

```
describe('storePoll', () => {
  it('should return stored true with the poll id when the insert succeeds')
  it('should return stored false with the database message when the insert fails')
  it('should generate the poll id with randomUUID rather than relying on a database default')
  it('should return stored false when the Supabase admin client is not configured')
  it('should insert every option with a position matching its order when a poll is stored')
  it('should delete the poll row when the options insert fails')
})

describe('getPollByParticipantToken', () => {
  it('should return the poll with its options when the token matches')
  it('should return null when the token matches no poll')
  it('should return null when the poll is past expires_at')
})

describe('storeParticipantResponse', () => {
  it('should insert the participant before the responses when a response is stored')
  it('should delete the participant row when the responses insert fails')
  it('should return stored false with the constraint message when the option belongs to another poll')
})

describe('sweepExpiredPolls', () => {
  it('should delete no more polls than the limit when more have expired')
  it('should return the number actually deleted rather than the number requested')
})
```

"should generate the poll id with randomUUID" pins a real schema fact: every `id` column in the migration is `uuid primary key` with **no default**, exactly as the lead tables do it (`leads.ts:1` imports `randomUUID`). An insert that omits the id fails with a not-null violation, not a silent default.

The two compensating-delete tests pin §3.6.1 and §3.6.3 — supabase-js has no transaction, so a multi-table write that half-fails must clean up after itself rather than leave an orphan.

The composite-FK behaviour itself is enforced by Postgres and was verified against the live database on 16 July 2026 in a rolled-back transaction (SCOPE.md §5). Do not attempt to re-prove a foreign key against a mock — the mock will happily agree with whatever you tell it. The test above proves only that a constraint error is surfaced rather than swallowed.

There is deliberately **no** raw-`pg` branch to test: `leads.ts` runs a dual path (`dbQuery` via `pg`, plus the Supabase admin client), and §3.1 rules out replicating that here. `polls.ts` uses the Supabase admin client only.

Nor is there an `updated_at` test: the migration installs `set_updated_at()` triggers on `polls`, `poll_participants` and `poll_responses`, so the application must never set that column by hand and a test against a mock would prove nothing either way.

---

### 5.8 Component tests — RTL

Fourth tier. `src/components/availability/` is **NET NEW**. Interactive behaviour only; no snapshot tests of markup.

```
// src/components/availability/OptionCard.test.tsx
describe('OptionCard', () => {
  it('should render three mutually exclusive radios when an option is shown')
  it('should render a glyph and text for every state so colour is not the only indicator')
  it('should select if need be by default when no prior response exists')
  it('should preselect the stored state when a prior response exists')
  it('should show the aggregate count without naming any participant when counts are supplied')
  it('should show the first-responder line rather than three zeroes when no responses exist')
  it('should associate the radiogroup with the option label when rendered')
  it('should disable every radio when the poll is closed')
})

// src/components/availability/ResultsTable.test.tsx
describe('ResultsTable', () => {
  it('should render a column header for every option when the matrix is shown')
  it('should render a row header for every participant when the matrix is shown')
  it('should give every cell a self-contained accessible name when the matrix is shown')
  it('should render not answered when a participant skipped an option')
  it('should render an empty state rather than a table when no responses exist')
  it('should mark every best option when two options tie')
  it('should mark no option when nobody said yes or if need be')
  it('should give the scroll container an accessible name when the matrix is shown')
})
```

"should select if need be by default" pins SCOPE.md §4's default-on decision — Doodle defaults it off, and the third state only gets used when the option set is small, which ours is by design. "should give every cell a self-contained accessible name" pins §1 O3.2 — assert the accessible name of a cell reads as name, option and state together, so it stands alone without visual position. "should mark no option when nobody said yes or if need be" is §1 O3.9 at the component level.

`src/test/setup.ts` already mocks `next/image`, `next/link`, `next/navigation`, `IntersectionObserver` and `matchMedia`, and calls `cleanup()` after each test. Do not re-mock any of them locally.

---

### 5.9 Coverage targets

Per the repo's bars:

| Layer | Target | Files |
|---|---|---|
| Business logic | **90%** | `src/lib/poll-state.ts`, `src/lib/poll-aggregate.ts`, `src/lib/rate-limit.ts`, `src/app/actions/polls.ts` |
| Data / API | **80%** | `src/lib/db/polls.ts`, `src/lib/email.ts` additions, `src/lib/poll-emails/*` |
| UI | **70%** | `src/components/availability/*` |

`src/lib/poll-tokens.ts` and `src/lib/dateUtils.ts` are already covered by their existing suites and are not listed — they are not this feature's coverage debt.

Do not chase coverage on `src/app/availability/**/page.tsx` route shells, type files or the Zod schema declarations. The overall project bar is 80%; these targets exist so the poll feature does not inherit the existing coverage gap (12 test files, 2 of them covering server actions).

**Two blockers before any coverage number can be produced:**

1. There is **no `test:ci` script**. The scripts are `test` (`vitest` — watch mode, never exits, unusable in CI), `test:run` (`vitest run`) and `test:coverage` (`vitest run --coverage`). Use `npm run test:coverage`.
2. **`@vitest/coverage-v8` is not installed.** `vitest.config.ts` declares `coverage.reporter` but the provider package is absent from devDependencies, so `test:coverage` cannot run today. Adding it is **NET NEW** and belongs in Phase 1, not discovered in Phase 4.

Every phase ships green through the full pipeline, in this order:

```
npm run type-check   # tsc --noEmit
npm run lint         # next lint + check:growth-language + check:british-english
npm run test:run     # vitest run — NOT `npm test`, which is watch mode
npm run build        # runs both language checks again, then next build
```

The two language gates run three times over: on commit via lint-staged, in `lint`, and again in `build`. `scripts/check-growth-language.mjs` lints **any** staged `.md`/`.ts`/`.tsx`/`.json`, including this spec file, so no test title, comment or heading may use that same banned verb. `scripts/check-british-english.mjs` gates its CLI arguments through `shouldCheckCliPath()` and so only lints `content/**` and its own FILE_TARGETS — it will **not** catch an Americanism in a poll test file, which is exactly why British spelling here is a review responsibility rather than a machine one, until §4.0's `DIRECTORY_TARGETS` change lands for `src/lib/poll-emails`.

---

### 5.10 Manual QA checklist

Automation catches none of the below. Each item is signed off by a person before the phase merges.

**Participant list on a real iPhone Safari** *(Phase 3 — a simulator does not count; the gestures are the point)*

- [ ] Every one of the three state controls per card is hit first-time with a thumb, one-handed, holding the phone naturally.
- [ ] Scrolling the list at speed does **not** change any selected state — this is the When2Meet failure, and it only reproduces on real touch hardware.
- [ ] No horizontal scroll and no zoom at any point on a 375px viewport.
- [ ] Tapping a text input does not zoom the page (`globals.css:475` forces `font-size: 16px !important` on mobile inputs for exactly this).
- [ ] The focus ring appears on keyboard focus via an external keyboard. It is `var(--color-focus-ring)` → `var(--color-accent-secondary)` → `#ff8901` (`globals.css:85,112,384`), exposed to Tailwind as `brand-secondary` / `orange-dark`. Use the token; never hardcode the hex — the DoD forbids it.
- [ ] The page works at 320px and at 200% browser zoom without two-dimensional scrolling.
- [ ] Content reflows correctly in landscape.
- [ ] The sticky submit bar does not cover the last option card, and it renders at all — `<Section>`'s `overflow-hidden` breaks `position: sticky`, so this is the check that the form was rendered outside it.

**Screen-reader pass on the organiser table** *(Phase 4 — VoiceOver on macOS Safari, and NVDA on Windows Firefox)*

- [ ] Table dimensions are announced on entry, and it is announced as a table — not as a grid or an application.
- [ ] Column and row headers are announced when moving between cells.
- [ ] Each cell announces name, option and state together — "Peter, Tuesday 14 July, 2pm, if need be" — with no reliance on visual position.
- [ ] The horizontal scroll container is reachable by keyboard and has an accessible name.
- [ ] The best-option highlight is announced, not conveyed by fill alone.
- [ ] Close, reopen, delete and confirm controls announce their target poll or participant unambiguously.
- [ ] The confirm action's result is announced through the `aria-live` region.

**Real email in a real inbox** *(Phase 4 — a Resend dashboard preview does not count)*

- [ ] The confirmation email lands in Gmail, Outlook.com and Apple Mail — inbox, not spam. Check with the sender warmed and with a cold recipient.
- [ ] The plain-text part is present and readable (the lesson of `ca016bd9`; `text` is a required field on `PollEmail` so the compiler enforces it).
- [ ] `POLL_FROM_EMAIL` (or its `CONTACT_FROM_EMAIL` fallback) is set to a sender on a Resend-verified domain — without it `email.ts` refuses to send and returns an error rather than throwing.
- [ ] Reply-to goes back to the right person — the organiser on participant mail, nowhere on the digest and the nudge.
- [ ] The time in words matches the `.ics` exactly, including the timezone label, and matches `formatSlotRangeInLondon`'s output character for character.
- [ ] A poll titled `<script>alert(1)</script> & "friends"` renders as literal text in the HTML part — `escapeHtml` proven end-to-end, not through the identity mock — and parses cleanly in the `.ics`.
- [ ] The participant email contains no organiser token — read the raw source, do not trust the rendering.
- [ ] No token appears in any server log for the send — `scrubTokens` proven in situ.
- [ ] Links use `www.orangejelly.co.uk`, never the apex.
- [ ] The digest arrives once, not once per vote, when five people respond within an hour.

**The `.ics`, opened for real** *(Phase 4)*

- [ ] Opens in **Google Calendar** at the correct time, on the correct day, in Europe/London.
- [ ] Opens in **Outlook** (both desktop and web) at the correct time.
- [ ] Opens in Apple Calendar at the correct time.
- [ ] Repeat all three for a slot **during BST** and a slot **during GMT** — the offset bug only shows itself on one side of the boundary.
- [ ] An all-day (dates) option lands on the right single day, not two — the exclusive-`DTEND` check.
- [ ] Add-to-Google and Add-to-Outlook links land on the same time the `.ics` carries.
- [ ] The event title, location and description carry through, and a title with an apostrophe or a comma does not break the VCALENDAR parse.

**Delivery gate**

- [ ] Nothing merges on a manual checklist alone — the automated suite is green first, and the checklist covers only what it cannot reach.

---

## 6. Build order

Mapped onto SCOPE.md §9's six phases. Dependencies are unchanged: 0, 1 and 2a are prerequisites for everything; 3 depends on 1; 4 depends on 3; 5 depends on 1.

| Phase | SCOPE.md §9 | State | What this spec adds |
|---|---|---|---|
| **0 — Date foundation** | `src/lib/dateUtils.ts` + a date library, both DST boundaries tested | **DONE — `71356d71`.** 43 tests, pipeline green. | One test only: §1 E17's hazard pin (`formatSlotInLondon('2026-07-04')` returns the 1:00am string rather than throwing). Everything else in `dateUtils` is finished — §5.0 forbids re-testing it. |
| **1 — Schema + data layer** | Migration, `conversion_events` CHECK `ALTER`, `src/lib/db/polls.ts`, token generator | **PART DONE — `89e7ef2a`.** Migration written to `supabase/migrations/20260716150000_availability_polls.sql` but **NOT APPLIED** — that needs Peter's explicit go-ahead. `src/lib/poll-tokens.ts` **is** done (27 tests), contrary to the scope's note. `src/lib/db/polls.ts` still to do. | **Edit the unapplied migration** before applying it, adding the eight columns in §4.7: `verify_token`, `verify_token_expires_at`, `last_digest_at`, `digest_pending_since`, `confirm_sequence`, `confirm_notify_failures`, `nudge_sent_at`, `digest_opt_out`. Once applied they become eight separate `alter table` migrations, so do this first. Then `src/lib/db/polls.ts` (§3.1, §5.7), `src/lib/poll-state.ts` (§5.5), `src/lib/poll-aggregate.ts` (§5.6), `sendPollEmail`/`sendPollEmails` (§4.0), `src/lib/poll-emails/` + `formatOptionForEmail` (§4.0), the `check-british-english.mjs` `DIRECTORY_TARGETS` change (§4.0), `@vitest/coverage-v8` (§5.9). |
| **2a — Rate limiting + Turnstile + CSP** | Standalone security control, split out of Phase 2 because it is EPIC | Not started. **Blocks all poll mail.** | `src/lib/rate-limit.ts` in full (§3.4) — Upstash, seven named buckets, peppered keys, fail-closed on `createPoll` and `confirmOption`, fail-open elsewhere. The `Referrer-Policy: no-referrer` middleware change (§3.3), all four call sites. Turnstile on `createPoll` only, plus `challenges.cloudflare.com` in `script-src`, `frame-src` and `connect-src`. `.env.example`: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `RATE_LIMIT_KEY_PEPPER`, `CRON_SECRET`, `POLL_FROM_EMAIL`. |
| **2b — Create + verify** | `/availability/new`, `createPoll`, magic-link verification, Zod schemas, honeypot | Not started. Depends on 1 and 2a. | Screens 1 and 2 (§2.1, §2.2). `createPoll` and `verifyOrganiserEmail` (§3.6.1, §3.6.2). Emails 4.1 (verify) and the links email. `src/lib/validation/polls.ts` and the `VALIDATION_MESSAGES.poll` keys (§1 US-O1). **Prerequisites before this ships:** `poll.orangejelly.co.uk` verified in Resend with its own DKIM and an `sp=` DMARC policy, and the live Resend plan's daily cap and rate limit confirmed (§4.6). |
| **3 — Participant voting** | `/availability/p/[token]`, vertical cards, three states, `submitResponse`, edit link, GDPR notice | Not started. Depends on 1. **This is the phase that makes the tool useful.** | Screen 3 (§2.3) and the edit screen. `answer-radio-group.tsx` — native radios, **no** `@radix-ui/react-radio-group` (the scope assumed one dependency here; there is none). `submitResponse` and `updateResponse` (§3.6.3, §3.6.4). Email 4.3 + `privacyNotice.ts`, whose rights address is `peter@orangejelly.co.uk`. **No outstanding prerequisite.** |
| **4 — Organiser results + confirm** | `/availability/o/[token]`, matrix, close/delete, `confirmOption`, fan-out + `.ics` + Add-to-Calendar, digests | Not started. Depends on 3. | Screen 4 (§2.4). `setPollOpen`, `confirmOption`, `deleteResponse`, `deletePoll` (§3.6.5–3.6.8). Emails 4.2 (digest) and 4.4 (confirm fan-out). `npm install ics` — the one new dependency (**R12**). Ships with the §4.2 digest gap named in the PR as known, time-boxed tech debt, closed by Phase 5. |
| **5 — Retention + polish** | Vercel cron + token-protected sweep route, nav entry, conversion events, optional reminders | Not started. Depends on 1. | The cron route and its four passes in order (§3.8): retention delete, unverified-draft delete, digest flush, nudge. `crons` key in `vercel.json` — none exists today. Email 4.5, **route 1 only** (nudge the organiser, not the participants — route 2 needs an address book and its own security review; see §7). `digest_opt_out` unsubscribe route + `List-Unsubscribe` headers (§4.6). **No nav entry** — §2.0 rules it out; the tool is link-shared, not browsed to, so `content/data/navigation.json` is untouched. **Prerequisite:** confirm the Vercel plan's cron limits. |

**The two ordering rules that are not negotiable:**

1. **Edit the migration before it is applied.** Eight columns, one file, zero cost — versus eight follow-up migrations if it lands first. This is the single highest-leverage sequencing decision in the build.
2. **2a before 2b, and no poll mail before both.** SCOPE.md decision 6 says so, §4.6 explains what it costs if it is skipped, and the failure lands on client-enquiry deliverability, not on polls.

---

## 7. Open questions

Everything the five sections flagged as needing a decision or a check. **None of these blocks Phase 1.** The prerequisites are marked — those block their phase and are not optional.

### Needs Peter's decision

| # | Question | Recommendation |
|---|---|---|
| **Q1** | **The nudge email (§4.5) cannot reach non-responders**, because a `poll_participants` row only exists once someone has answered — "invitees who haven't replied" is an empty set at the schema level. Route 1 nudges the organiser instead. Route 2 adds a `poll_invitees` address book. | **Route 1.** No new table, no email to a third party, zero relay surface. Route 2 is the address book §4.6 exists to avoid — it puts attacker-supplied addresses back on the sending domain and needs its own verification design. If it is wanted, it is separate work with its own security review, not a Phase 5 polish item. |
| **Q2** | **Should `src/app/availability/**` be added to `check-british-english.mjs`?** British spelling in the poll UI is currently unenforced — the script's `shouldCheckCliPath` drops anything outside `content/` and six hardcoded files. §4.0 adds `src/lib/poll-emails` to `DIRECTORY_TARGETS`; the UI is a separate call. | **Yes, in Phase 2** — it is one entry in the same array. The alternative is relying on hand-discipline for the site's own house style, on the pages a client is most likely to be pointed at. |
| **Q3** | **The verify link is single-use (R15), so an email scanner's prefetch can consume it** before the organiser clicks. The links email is the mitigation. | **Accept it.** The alternative — a reusable magic link — leaves a permanent capability in an inbox. The links email fires on verification regardless of who clicked, so the organiser is not stranded. |
| **Q4** | **Turnstile on `createPoll`** needs `challenges.cloudflare.com` in three CSP directives. That is a real change to a security header on the whole site. | **Do it in 2a**, as the scope already plans. It is the only control that stops an automated poll-creation flood from a proxy pool once rate limits are per-IP. |

### Needs verification before its phase ships

| # | Unknown | Blocks | Why it matters |
|---|---|---|---|
| **Q5** | **The live Resend plan's daily cap and requests-per-second limit.** Recorded as unverified in SCOPE.md's Unknowns. The 100/day and 2/second figures may be wrong in either direction. | **Phase 2b — prerequisite.** | One 20-person poll is ~65 emails. Exhausting the cap means a real client enquiry silently fails to reach Peter's inbox, because poll mail and client mail share the account. The 2/second figure also sets the fan-out loop's `sleep(120)`. |
| **Q6** | **`poll.orangejelly.co.uk` verified in Resend, with its own DKIM and an explicit `sp=` DMARC policy on the apex (or a dedicated `_dmarc.poll` record).** | **Phase 2b — prerequisite.** | Poll mail attracts spam complaints at a rate transactional client mail never does. On a shared domain those complaints land on the deliverability of the work the business runs on. A firebreak is only useful before the fire. |
| **Q7** | ~~A real, monitored inbox for data-rights requests.~~ **Resolved 16 July 2026 — no longer blocks Phase 3.** | — | The rights address is **`peter@orangejelly.co.uk`**. Orange Jelly runs no `privacy@` mailbox, which earlier drafts of this spec assumed; that notice would have pointed at a dead inbox. `peter@orangejelly.co.uk` is already `src/lib/email.ts`'s fallback recipient, so it is known-live. |
| **Q8** | **The Vercel plan's cron limits.** Hobby allows 2 jobs at daily granularity; the account's plan is unverified. | **Phase 5.** | One daily job running four passes fits either way — but confirm before designing around it. |
| **Q9** | **Whether `conversion_events` should carry `poll_created` / `vote_submitted`.** SCOPE.md §5 notes the `owner_type` CHECK constraint limits it to `'contact'`/`'newsletter_subscriber'` and would need an `ALTER`. Not specified in any of the five sections. | **Phase 5.** | It surfaces poll activity in the admin dashboard for free. Cheap, but it is a schema change to a live table with existing rows, so it needs a deliberate yes rather than a drive-by `ALTER`. |












