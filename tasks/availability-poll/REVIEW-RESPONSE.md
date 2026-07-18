# Response to the external spec review

**Date:** 16 July 2026
**Baseline commit:** `ededdb01` (plus `be991298` on `src/lib/db/polls.ts`)
**Scope:** all 39 findings in `tasks/availability-poll/SPEC-REVIEW.md`, independently triaged against the repo.

---

## 1. The verdict

The reviewer was substantially right, and "not ready for implementation" is the correct call — but for different reasons than they gave, and at a much lower temperature. Of 39 findings, 13 are confirmed as written, 24 are partially correct (real defect, wrong mechanism or inflated blast radius), 1 is already fixed in code the reviewer had not read, and 1 dissolves under scrutiny. The headline is this: **almost nothing is wrong in shipped code**. The data layer, the token module, `dateUtils` and all three applied migrations are correct and green at 171 of 171 tests. What is wrong is the spec — it is 3,672 lines, it describes a repo that has moved on underneath it, and in at least one place it issues an instruction that would cause real harm if followed. That is our error, not the reviewer's, and it is the thing to fix first. Where the reviewer is wrong they are wrong in a specific and dangerous way: they graded 11 findings P0 on the basis of code that does not exist, and one of those (C11) would send a developer to rewrite a function that we already fixed, back into the broken shape. An unchallenged wrong P0 is worse than a missed P2, so section 4 documents every one.

---

## 2. What is broken in SHIPPED CODE

Only two items in the entire review touch committed code, and neither can hurt a user today because nothing calls them. Both are our own errors.

### 2.1 `confirm_notify_failures` is the wrong type in production — P2

**What:** `supabase/migrations/20260716160000_availability_polls_email_columns.sql:28` applied the column as `jsonb not null default '[]'::jsonb`, intended to hold the email addresses the fan-out could not reach. The spec asks for an integer count in three places (SPEC.md:1058 compares it with `> 0`; SPEC.md:2843 declares it `integer`). Production confirms `jsonb`. The two shapes cannot both be built.

**Why it matters, plainly:** the jsonb shape stores people's email addresses for no stated purpose and with no retention rule attached — personal data we do not need. The count shape is all the organiser's on-screen note actually requires. We also broke our own rule here: the spec said "edit the migration before it is applied" and we applied it wrong instead, so the cheap window is gone.

**Fix:** a fourth, additive migration dropping and re-adding as `integer not null default 0`. I audited it: zero functions, triggers or views reference the column, `grep -rn "confirm_notify" src/` returns nothing, and `select count(*) from polls` is **0**. The drop is genuinely lossless. Because it is a `DROP COLUMN`, it needs Peter's explicit go-ahead (see section 7, decision 1).

**Effort:** trivial. **Blocks:** Phase 4, which has not started.

### 2.2 `sweepExpiredPolls` is an unbounded delete — P3

**What:** `src/lib/db/polls.ts:580` `deleteExpiredPolls()` runs `.delete().lt('expires_at', now)` with no limit, no ordering and no batching. The spec's own ethics rail (SPEC.md:2010) says the sweep caps at 500 rows per run precisely so it can never cross the 1,000-row bulk-operation gate unattended. The shipped function ignores that. Its name does not match the spec's `sweepExpiredPolls({ limit })` either.

**Why it matters:** it has no caller yet, so it cannot fire. But Phase 5 wires it to a cron with no human in the loop, and at that point an unbounded delete of poll data is exactly the operation our own rules say must not run unattended.

**Fix:** rename to `sweepExpiredPolls(options: { limit: number })`, implement select-then-delete-by-id with `order by expires_at asc limit $1`. Roughly fifteen lines, no migration, no risk — the function is unreferenced.

**Effort:** trivial. **Blocks:** Phase 5.

### 2.3 Two shipped-code notes that are *not* defects

- **`updateResponse` (C11) is already fixed.** The reviewer graded it P0 for a destructive delete-then-insert. Commit `be991298` replaced it with an upsert on `{ onConflict: 'participant_id,option_id' }`. The finding is dead. See section 4.1 — this is the most important correction in the document.
- **`polls.ts:502-503` carries a false comment** ("The FK would catch a cross-poll id"). It would not; `polls_confirmed_option_fk` is a simple FK. The code is correct — the `.eq('poll_id', poll.id)` scope is the real control — only the comment lies. One-line fix.

---

## 3. What is wrong only in the SPEC TEXT

Thirty-odd findings collapse into six themes. All are cheap now and expensive later.

### 3.1 The spec describes a repo that no longer exists (C01, C33, C36, C38)

This is the root cause of a third of the review. The document was written against a pre-fix tree and corrections were layered on top rather than deleting the stale text. Consequences:

- §6's build table still says the base migration is **NOT APPLIED** and instructs "**Edit the unapplied migration** before applying it" — escalated at SPEC.md:3637 to a non-negotiable ordering rule. All three migrations are applied. **This is the one stale instruction whose failure is silent rather than loud, and it must be deleted, not annotated.**
- `src/lib/db/polls.ts` is marked NET NEW. It exists, 582 lines, 18 passing tests.
- Phase 0's sole remaining deliverable is a test asserting `formatSlotInLondon('2026-07-04')` returns a wrong-but-plausible string. Commit `41d9a0af` made it throw, and `dateUtils.test.ts:131` already asserts the opposite. The required test is unwritable — and an obedient developer might weaken a correct guard to make it pass.
- Test counts say 149 across 12 files; actual is 171 across 13.
- The front-matter note ("where the text below says 'not yet applied', read this note instead") has demonstrably failed to hold §6 in line. Delete the stale text and then delete the note.

**Fix:** one dated errata pass baselined on `ededdb01`. Also retire the seventeen-ruling table at SPEC.md:45-70 by applying its rulings into the section text — a table that says "everywhere X, read Y" is a permanent trap for anyone reading a section without it.

### 3.2 The create screen contradicts the product decisions (C03, C39, C14, C15)

`§3.6.1` unilaterally drops the date-or-slots choice, location and agenda — all of which O1.1, SCOPE.md:112-113 and the shipped `createPoll` already support. Agenda is worse: it is a settled decision with an applied column and passing tests, mentioned in exactly four lines of a 3,672-line spec and absent from the create schema, the field table, the vote page, the escaping contract and the calendar code sample. It would ship stored-but-invisible. Alongside: duplicate-option rules disagree between O1.8 (same start) and both schemas (full range); `position` is documented 0-based and shipped 1-based; the description cap is 500 in the form and 1,000 on the server.

**Fix:** one reconciliation pass. Recommend slots-only for launch, keeping location and agenda; align `position` to the shipped code, not the other way round.

### 3.3 The unbuilt screens have holes (C04, C06, C07, C18, C17)

The create action returns `nextPath: '/availability/new/check-your-inbox'` — a route in no inventory and no screen section — while O1.11 says the page re-renders in place. "Send it again" is placed on the create screen three times and on check-your-inbox once, is rate-limited "per poll", and has no poll handle to key on because the action is forbidden from returning any token. The `.ics` download promised to participants has no route contract. The shared "not live" 404 has no mechanism (`notFound()` is never named, and the root `not-found.tsx` is a marketing page that would swallow it) and three different copy strings. The edit screen has no layout, no loading/error boundaries and no form component in the inventory, and P2.3 pre-fills an email that §3.6.4 says is not editable.

### 3.4 Privacy and legal (C27, C28, C20)

Two real defects. **The notice cites Article 14 and tells participants "that's where we got your details"** — false. There is no invitee list; participants type their own details into our form. That is Article 13, direct collection. The wording is inherited from an earlier design that we explicitly rejected. It would ship to third parties' inboxes precisely *because* the spec is emphatic about it. Separately, the notice names no recipients and no transfers (Art 14(1)(e)/(f), and Art 13(1)(e)/(f) equally) despite Upstash, Resend, Supabase and Vercel all processing this data — and the site has no privacy policy page at all. Third: the `oj_poll_{pollId}` cookie holds a 90-day edit token, is client-set so cannot be HttpOnly, and is path-scoped to a **team-wide** participant link — so on a shared device the second person to open the link gets the first person's answers and edit rights. That is the default case, not an edge case.

### 3.5 Email and rate limiting (C08, C22, C23, C25, C26, C30)

The participant edit-link email goes to an unverified, attacker-typeable address, and `submitResponse` is explicitly exempted from the spec's own fail-closed rule. The fix is nearly free: P2.1 already shows the edit link on screen unconditionally, so the email adds no capability — only relay surface. Elsewhere: `sleep(120)` contradicts the 2-requests-per-second limit it cites; the mandatory per-poll send ceiling is named once and specified nowhere while §3.4 declares its bucket list complete without it; the digest window is claimed by read-then-write with no atomic claim; Turnstile is a namedrop with no verify contract; and fail-closed rate limiting with no local-dev escape means a fresh clone cannot create a poll.

### 3.6 Accessibility and layout (C31, C32, C09, C10)

P1.3 demands a `fieldset`/`legend`; §2.3 mandates a `fieldset`-free `role="radiogroup"`. Only one can be built. The sticky submit bar has no safe-area padding, no z-index and no spacer — and the root layout unconditionally renders `StickyEngagementBar` (z-40) and `CookieNotice` (z-50) on every route, so a marketing bar would sit on top of the primary submit control on the 375px viewport this feature exists for. The same root layout injects GTM and Vercel Analytics onto token pages while the spec asserts in four places that token pages load no third-party resources — Vercel Analytics sends the raw path, so the capability URL leaks. That assertion is worse than an omission: it tells the developer not to look.

---

## 4. Where the reviewer was WRONG or STALE

### 4.1 C11 — the P0 that would break working code

The reviewer graded `updateResponse` P0 for an unconditional `delete()` before `insert()`. **That code does not exist.** `src/lib/db/polls.ts:429-448` is an upsert with `{ onConflict: 'participant_id,option_id' }`, preceded by a comment narrating the removal of the destructive path. `git log` shows `be991298` "fix(polls): stop updateResponse destroying answers it fails to replace". The reviewer's own proposed fix is byte-for-byte the shipped code. **Acting on this finding sends a developer to rewrite the current implementation as itself, or worse, back to the broken shape.** All that survives is a spec-wording point: the upsert never prunes answers for omitted options, so §3.6.3's "replaces" wording is stale. P3.

### 4.2 Findings that reason from things that do not exist

- **C22, C35:** recommend monitoring "outbox backlog" and "email queue depth". There is no outbox and no queue. The fan-out is a synchronous in-request loop. "outbox" appears zero times in the spec, scope and migrations.
- **C34:** recommends concurrency tests for "RPC atomicity" and "webhook signature tests". There is no RPC (`grep "rpc("` returns nothing; the spec explicitly designs compensating deletes instead) and no webhook anywhere in the feature.
- **C33:** cites a component called `ResultsMatrix` as what "the component inventory names". The string does not exist in the spec. It was invented.
- **C29, C30:** ask "what is the live Vercel plan?" and "can CI run Supabase locally?". There is no CI in this repo at all.

### 4.3 Findings that criticise the spec for saying the opposite of what it says

- **C12:** claims O6.3 and §3.6.6 describe application checks as database guarantees. Both sections state the reviewer's own position verbatim — "the database will **not** catch this — the check is the only control". They read the headings, not the prose.
- **C05:** claims verification needs a re-read because the action does not return the id. §3.6.2 specifies a `returning id, participant_token, organiser_token, …` clause one line below the signature they quoted, and `verifyAndOpenPoll` already ships as a one-call update-and-return.
- **C21:** says the spec "later admits" the non-voter limit in §4.5. It admits it in §4.4, the section being criticised, and their recommended fix is already the spec's stated position in three places.
- **C18:** alleges the edit screen has no validation, failure or locked-state detail. §3.6.4 gives a full schema and failure table; P2.5-P2.7 give token precedence, locked states with verbatim copy, and the 404.
- **C06:** says the edit route has no screen-level specification and check-your-inbox is absent. Both are specified; only inventory rows and boundaries are missing.
- **C37:** presents the production-host mail guard as a hard block. `getBaseUrl()` is env-driven — the "bypass" is one environment variable.

### 4.4 Findings that overstate the security consequence

- **C19:** graded "Security / possible data exposure". The mismatched URL cannot be constructed without already holding the target poll's edit token, which outranks the participant token it would be paired against. No privilege gain. It is a canonicalisation wart. P3.
- **C07:** claims "inconsistent token-oracle behaviour". Byte-identity holds *within* each route, which is where an oracle would live. The divergence is between routes and leaks only which URL you visited.
- **C08:** "open relay" is the wrong class. Each send costs one verified poll creation plus one vote, is rate-limited, and there is deliberately no address book. Low-volume unsolicited mail, not a relay.
- **C24:** worries about repeatedly mailing hard-bouncing addresses. There is no re-send loop and no address book; the only recurring mail goes to a magic-link-verified organiser behind an opt-out and `List-Unsubscribe`.
- **C10:** says "keep token routes out of the sitemap". `sitemap.ts` is a hand-maintained array. Nothing to do.

### 4.5 Where the reviewer under-called

Fairness cuts both ways. They missed that `formatSlotInLondon` now rejects **zoneless** strings too, not just date-only — a guard the spec does not know exists, which affects how the data layer hands out timestamps. They missed that the participant link is one shared team link, which makes the cookie collision (C20) the default rather than bad luck. They missed the agenda field entirely in C03. And they missed the sharpest version of their own C08 argument: `submitResponse` is explicitly exempted from the spec's fail-closed rule.

---

## 5. Severity disagreements

The reviewer graded 11 findings P0. On independent triage, **zero are P0**. P0 should mean shipped code is broken or data is at risk. Nothing in this feature is shipped beyond the data layer, the token module and three applied migrations — all correct and green.

| Finding | Reviewer | Triage | Why |
|---|---|---|---|
| C11 `updateResponse` | P0 | **P3** | Already fixed in `be991298`. Evidence was stale. |
| C01 spec staleness | P0 | P1 | Fails loudly on first contact — except the migration-edit instruction, which is why it stays P1. |
| C02 `confirm_notify_failures` | P0 | P2 | Zero rows, zero readers. One `alter table`. |
| C03 create screen | P0 | P1 | Genuine product decision, blocks the whole create flow. |
| C04 check-your-inbox | P0 | P1 | Unimplementable contract needing a product call. |
| C05 verify signature | P0 | P2 | A TypeScript error the instant anyone writes it. |
| C08 unverified recipients | P0 | P1 | Real, but bounded and unbuilt. |
| C09 third-party on token pages | P0 | P1 | Spec asserts the control exists — that is what earns P1. |
| C13 `closes_at` | P0 | P2 | The deadline path is dead: parsed, then never persisted. |
| C16 preselect "if need be" | P0 | P1 | Would pass both guards vacuously. Silent bad data if built literally. |
| C21 non-voter fan-out | P0 | P2 | Decision already made and documented; stale wording only. |
| C22 fan-out throttle | P0 | P2 | Phase 4 design paragraph, gated behind three phases. |
| C27 Article 14 | P0 | P1 | Would ship a false statement *because* the spec is emphatic. |
| C33 test plan | P0 | P2 | Self-announcing red test. |

Two we grade **higher** in effect than the reviewer's framing implies: **C27** (they were right to alarm; their open question about controllership was already answered, which weakened their own case) and **C20** (they treated the shared-device collision as incidental; it is the default).

Three we grade **lower** than P2: C19 (P3), C24 (P3), C37 (P3).

---

## 6. The plan

### Now — before any further code (about a day)

1. **Delete the migration-edit instruction.** SPEC.md:3625 and the non-negotiable rule at :3637. This is the only stale instruction that fails silently. *Trivial.*
2. **Errata pass on SPEC.md**, baselined `ededdb01`: build table, NET NEW markers, test counts, Phase 0's impossible date test, E17's inverted hazard, the `digest_opt_out` "NET NEW" label. Add a baseline line to the front matter, then delete the front-matter redirect. *Small.*
3. **Fix the false comment** at `polls.ts:502-503`. *Trivial.*
4. **Retire the seventeen-ruling table** — apply the rulings into the sections. *Small.*

### Before Phase 1 (create flow)

5. Reconcile the create screen: option kind, location, agenda, duplicate rule, `position` (align spec to code), description cap. *Small.*
6. Agenda reconciliation pass — schema, field table, vote page, escaping list, calendar sample, tests. *Small.*

### Before Phase 2a (middleware, rate limiting, Turnstile)

7. Gate the marketing chrome on pathname; drop the dead preconnects; add `/availability` to the engagement exclusions. Correct the four false "no third-party" assertions. *Small — touches code.*
8. Specify the `poll_send_fanout` ceiling in §3.4's bucket enum and §4.7's table. *Small.*
9. Turnstile contract: mode, env vars, `siteverify`, fail-closed, CSP as `script-src` + `frame-src` only. *Small.*
10. Rate limiter: dev escape gated on `NODE_ENV`, a one-second timeout, `x-vercel-forwarded-for` precedence, pepper-rotation note. *Small.*

### Before Phase 2b (create + verify + first live mail)

11. Resolve check-your-inbox and "Send it again" — recommend in-place success plus a scoped resend token. *Medium.*
12. **Article 13 correction plus the recipients/transfers paragraph.** Non-negotiable before mail. *Small.*
13. Drop the participant edit-link email; gate the confirmation fan-out per address. *Small.*
14. Release checklist: deploy dark with `POLL_FROM_EMAIL` unset, smoke test, rollback = revert the deploy. *Small.*

### Before Phase 3 (participant voting)

15. Resolve the fieldset/radiogroup conflict, the double h1, heading order, the matrix cell name, `inset-0`. *Small.*
16. Sticky bar: safe-area, z-index, spacer. *Small.*
17. Cookie rework: server-set, HttpOnly, poll-lifetime, and a "not me — start a fresh reply" claim step. *Small.*
18. Fix P2.3's email pre-fill contradiction; add the edit screen section, boundaries and form component. *Small.*
19. `.ics` download route contract on the existing participant token. *Small.*
20. The shared 404: `src/app/availability/not-found.tsx`, `notFound()` named explicitly, one copy string. *Small.*

### Before Phase 4 (organiser results + confirm)

21. **The `confirm_notify_failures` migration** (needs Peter — decision 1). *Trivial.*
22. Atomic digest claim, attempt cap, idempotency key, `maxDuration`. *Small.*
23. Reconcile the non-voter wording across spec and scope. *Trivial.*

### Before Phase 5 (retention cron)

24. `sweepExpiredPolls({ limit })` in shipped code; the same rail for `sweepUnverifiedDrafts`. *Trivial.*
25. Cron self-reporting: JSON body, 500 on failure, backlog count, dead-man's email. *Small.*

### Explicitly accepted, with reasons

- **No error-tracking service.** This repo has none, has no health endpoint, and the live contact-form mail path is already best-effort console logging by design. Requiring the poll feature to invent an observability stack the whole site lacks is scope inflation. Recorded as a decision, not an open question. *(C35)*
- **No Playwright end-to-end suite.** There is no CI to gate it on. §5.10's per-phase human sign-off already covers the journeys. Logged as tech debt with a named follow-up. *(C34)*
- **No local-Supabase integration suite as a release gate.** Cannot be a gate with no CI; would become a ritual that gets skipped. The composite FKs were already proven against the live database in a rolled-back transaction — stronger evidence than a mock. *(C34)*
- **No webhook-driven bounce suppression.** Resend's dashboard covers it at this volume; trigger for revisiting is a sustained bounce rate above roughly two percent. *(C24)*
- **No staged mail mode.** A two-line spec note on the env-driven escape hatch is proportionate; an allowlisted mail mode is not. *(C37)*
- **`closes_at` keeps its name.** Renaming an applied column for zero behavioural gain is not worth a migration. One comment pins the single meaning. *(C13)*

---

## 7. Decisions needed from Peter

Six, all with a recommendation. If you do not reply, we proceed with the recommendation.

1. **Approve the `confirm_notify_failures` column drop.**
   *Recommend yes.* It is a `DROP COLUMN`, so it needs your explicit go-ahead — but the table has zero rows, no code reads it, and no function, trigger or view references it. The current shape stores people's email addresses for no purpose; the replacement stores a count. Lossless.

2. **Are whole-day polls a launch requirement, or slots only?**
   *Recommend slots only.* Every other screen in the spec already assumes slots. A pub event has times. Date-only doubles the form, the render branches, the calendar path and the test matrix for a case we rarely need. Keep the database support as headroom; declare the deferral in the spec.

3. **Do overnight slots need to work at launch (a slot crossing midnight)?**
   *Recommend yes.* Pub events cross midnight, the formatter and the schema constraint already support it, and it costs one extra date field on the form. Leaving it out means the form cannot express something everything below it can.

4. **Keep the participant edit-link email?**
   *Recommend dropping it.* The edit link is already shown on screen unconditionally, so the email adds no capability — only a channel for mailing an unverified address someone typed. Dropping it removes the largest deliverability risk for free.

5. **Do we create a privacy policy page now, or defer?**
   *Recommend now, in the same phase.* There is no `/privacy` route at all, and the cookie banner points at `/contact`. An Article 13 notice with no policy behind it is not defensible, and this feature is what makes the gap untenable.

6. **Separate sending domain for poll mail (`poll.orangejelly.co.uk`)?**
   *Recommend yes.* Poll mail currently shares the Resend account with client enquiry mail. Exhausting the daily cap means a real enquiry silently fails to reach your inbox. Isolation removes that coupling entirely and is cheaper than the alerting that would otherwise be needed to detect it.

---

**Done** — all 39 findings triaged against the repo, verdict recorded, plan ordered by phase with effort, six decisions surfaced.
**Next:** on your go-ahead for decision 1, the errata pass and the four "Now" items can proceed immediately — none of them needs any further input.
**You need to:**
- [ ] Approve or refuse the `confirm_notify_failures` column drop (decision 1)
- [ ] Confirm slots-only for launch (decision 2)
- [ ] Confirm overnight slots at launch (decision 3)
- [ ] Confirm dropping the participant edit-link email (decision 4)
- [ ] Confirm the privacy policy page lands in the same phase (decision 5)
- [ ] Confirm a separate poll sending domain (decision 6)
