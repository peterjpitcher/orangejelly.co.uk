# Availability Poll — Implementation Plan

**Date:** 16 July 2026
**Baseline:** commit `0588b83b`. 180 tests across 13 files, green. Four migrations applied to production (`miqqkllqfyvaomzgujed`).
**Contract:** `tasks/availability-poll/SPEC.md` is authoritative on HOW. `tasks/availability-poll/SCOPE.md` is authoritative on WHAT and WHY. This plan is neither — it is the **execution order**, and it says only which work can run at the same time and what must not start early.

Read the spec section named in a stream before writing any of its code. This plan deliberately does not restate the spec's detail; duplicating it is how the two drift apart, which is the exact failure the errata pass just spent a day undoing.

---

## Rules that bind every stream

1. **Never edit a file in `supabase/migrations/`.** All four are applied to production. Editing an applied migration changes nothing in the database and fails silently. Any schema change is a **new** file with a later timestamp.
2. **Never weaken `src/lib/dateUtils.ts`.** `formatSlotInLondon` throws on a date-only value and on a zoneless timestamp. That is specified behaviour (§1 E17), asserted by tests, and the exact bug that shipped once already. Phase 0 is closed.
3. **Never re-derive what `src/lib/db/polls.ts` already does.** It exists, it is 582 lines, and its export names are not the ones you would guess. `updateResponse` is an upsert; there is no `deleteExpiredPolls`; `sweepExpiredPolls({ limit })` is bounded at 500. Read it first.
4. **No poll mail ships before Stream C.** Poll mail shares the `noreply@auth.orangejelly.co.uk` sender and the Resend account with Peter's other mail. An unthrottled poll form is a problem for that mail, not just for polls.
5. **British English, and the growth-language check blocks certain words.** Read `scripts/check-growth-language.mjs` before writing UI copy or comments. The hook rejects the commit, not the build — you will find out late.
6. **Every stream ends green:** `npx tsc --noEmit`, `npx eslint`, `npx vitest run`, `npm run build`. A stream that leaves the suite red is not done.

---

## Dependency graph

```
  A (poll logic)  ─┐
  B (email infra) ─┼─→  D (2b create+verify) ─→ ┐
  C (security)    ─┘                            ├─→ F (4: results+confirm)
                   └─────→ E (3: voting) ───────┘
                   └─────→ G (5: cron)
```

**Round 1 — A, B and C run in parallel.** No shared files, no shared state.
**Round 2 — D and E run in parallel** once A, B and C are merged.
**Round 3 — F**, once E is merged.
**G** may start any time after A and C. It is the only stream that can slip without blocking anything else.

---

## Stream A — Poll logic

**Depends on:** nothing. **Spec:** §5.5, §5.6.

Two pure modules. No database, no network, no React. The easiest stream to test properly and the one everything else asserts against.

- `src/lib/poll-state.ts` — the state machine. Legal transitions only: `draft → open → closed ⇄ open`, `open|closed → confirmed`. `confirmed` is terminal. Every illegal transition returns a refusal, never throws.
- `src/lib/poll-aggregate.ts` — the counting. Per-option Yes / If-need-be / No counts, responder totals, and the "best so far" ranking: Yes desc, then If-need-be desc, then `position` asc.

**The rule that is easy to miss:** when every option has zero Yes *and* zero If-need-be, **no option is "best so far"**. Without that suppression every option ties and every option wins a badge, which is worse than showing none. Test it explicitly.

**Done when:** both modules exist, every legal and illegal transition is tested by name, the zero-signal case is pinned, and the suite is green.

---

## Stream B — Email infrastructure

**Depends on:** nothing. **Spec:** §4.0, §4.6.

- `sendPollEmail({ to, subject, html, text, replyTo?, attachments?, headers? })` and `sendPollEmails` in `src/lib/email.ts`. **One signature.** The existing `sendLeadNotification` cannot be reused — it has no `to` and resolves its recipient internally from `CONTACT_NOTIFICATION_EMAIL`. Do not change it; add alongside.
- `src/lib/poll-emails/` — template builders plus `formatOptionForEmail`. One source of wording producing both an HTML and a plain-text body, so the two cannot drift.
- `POLL_FROM_EMAIL` in `.env.example`, defaulting to `CONTACT_FROM_EMAIL`.
- Add `src/lib/poll-emails` to `DIRECTORY_TARGETS` in `scripts/check-british-english.mjs`.

**Deliverability hygiene is load-bearing here, not decoration.** Poll mail now shares a domain with Peter's other mail (his decision, 16 July 2026), so every rule in §4.6 is a requirement: a plain-text part on every email without exception, `List-Unsubscribe` **and** `List-Unsubscribe-Post` on digest and nudge, a real From display name, Reply-to set, no URL shorteners, no all-caps or spam-trigger phrasing, sensible text-to-HTML ratio.

State the limit honestly in the PR: good structure gets past filters, it does not stop a recipient marking an invitation as junk because they forgot they were invited. That risk is accepted and reversible via `POLL_FROM_EMAIL`.

**Done when:** both senders exist with one signature, every template emits both parts, the British check covers the new directory, and the suite is green. **No email is wired to a user action in this stream.**

---

## Stream C — Security foundation

**Depends on:** nothing. **Spec:** §3.3, §3.4. **Blocks:** all poll mail.

Four separate pieces. Land them as separate commits — they fail differently.

**C1. Rate limiting on Supabase Postgres.** No Redis, no Upstash, no new vendor (Peter's decision, 16 July 2026).
- A **new** migration adding the counter table: hashed identifier + fixed window + count.
- A Postgres function whose upsert increments and returns the new count **in one statement**. A read-then-write in TypeScript races — do not build it.
- `src/lib/rate-limit.ts`: `checkRateLimit(bucket, key)`, peppered keys via `RATE_LIMIT_KEY_PEPPER`, seven named buckets.
- **Fail closed** on `createPoll` and `confirmOption`; fail open elsewhere. A limiter outage must not let someone mint polls.
- Uniform refusal copy on every bucket: naming the bucket tells an attacker which limit they hit.
- Old rows are swept by Stream G's cron. Do not add a second cron.

**C2. Turnstile on `createPoll` only.** Keys are already in Vercel and `.env.local`: `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`. Server-side `siteverify` is the control — client rendering alone is not. Add `challenges.cloudflare.com` to `script-src` and `frame-src` **only**; `connect-src` is not required for the chosen mode. Turnstile matters more than usual here: the limiter is per-IP, and a proxy pool defeats per-IP on its own.

**C3. `Referrer-Policy: no-referrer` on token routes** (§3.3), all four call sites.

**C4. Keep third-party scripts off token pages — this is the one that leaks credentials.**
`src/app/layout.tsx` currently loads GTM, `GoogleTagManagerNoscript`, Vercel `Analytics`, `SpeedInsights`, `PerformanceMonitor`, `CookieNotice`, `StickyEngagementBar`, `ExitIntentModal` and `MobileScrollPrompt` on **every** route. Poll URLs carry a bearer token in the path. So opening a poll would hand its own access token to Google and Vercel, and anyone with analytics access could then act as the organiser. `Referrer-Policy` does not help — JavaScript reads `window.location` directly.

Do **not** restructure into multiple root layouts. GTM is already a client component and the engagement widgets already use `usePathname`; the fix is a pathname guard on `/availability/*`, which is a pattern already in this codebase. Also drop the marketing overlays there for their own sake: an exit-intent modal over someone's ballot is a bug regardless of the leak.

Then correct every spec assertion that poll pages load no third-party resources — today that claim is false.

**Done when:** an automated assertion proves no third-party request fires on a token route, the limiter's atomicity is proven against the live database in a **rolled-back** transaction (a mock cannot show a race), and the suite is green.

---

## Stream D — Create and verify

**Depends on:** A, B, C. **Spec:** §2.1, §2.2, §3.6.1, §3.6.2, §1 US-O1, US-O2.

`/availability/new` and `/availability/verify/[token]`. `createPoll`, `verifyOrganiserEmail`, `src/lib/validation/polls.ts`, the `VALIDATION_MESSAGES.poll` keys, honeypot.

**Both option kinds ship here.** Peter overruled the slots-only recommendation on 16 July 2026: date-only polls **and** timed slots must each be buildable from the form, including a slot that crosses midnight via an "ends next day" control. Neither is a follow-up.

**Three traps, all previously shipped or nearly shipped:**
- `verifyAndOpenPoll` in the data layer predates the `verify_token` decision — it matches on `organiser_token` and never touches `verify_token`. Rework it to take the verify token, guard on `status = 'draft'` and `verify_token_expires_at > now()`, and null the token in the same update. Keep its single-round-trip update-and-return shape; that part is right.
- Zod refinement chains run every refinement even after one fails, so a chain calling `compareIsoDates` **throws** on malformed input instead of returning a validation error. Use one `superRefine` with an early return.
- The organiser link must never appear in an email that also carries the verify link.

**Done when:** a poll can be created and verified end to end in a real browser, both option kinds, mail restricted to a real inbox Peter controls, and the suite is green.

---

## Stream E — Participant voting

**Depends on:** A, B, C. **Spec:** §2.3, §3.6.3, §3.6.4, §4.3. **This is the stream that makes the tool useful.**

`/availability/p/[token]` and the edit screen. `submitResponse`, `updateResponse`.

- **A vertical list, one card per option. Never a matrix.** When2Meet's drag grid registers a drag as a scroll on iPhone Safari and silently deselects answers already given. Vertical scroll is the only gesture a phone does reliably.
- Three states as **native radios** in a radiogroup — no `@radix-ui/react-radio-group`; it is not installed and is not needed. Every state carries a **glyph**, never colour alone (WCAG 1.4.1 — the most-failed criterion in every tool of this kind).
- Tap targets ≥44×44px.
- **Aggregate counts only.** "4 yes · 1 if need be · 2 no" and "7 people so far" — never who. Re-confirmed by Peter on 16 July 2026 after he asked for live results; counts were already the answer.
- The edit link is shown **on screen only**. There is no participant edit-link email, so nothing ever mails an address nobody proved.

**Also in this stream, and not optional:** the Article 13 privacy notice (`privacyNotice.ts`) **and the `/privacy` page it links to**. No such route exists today; the cookie banner points at `/contact`. The notice must say the participant gave us their details — the earlier Article 14 wording claiming the organiser supplied them was simply false. Rights address: `peter@orangejelly.co.uk`. There is no `privacy@` mailbox and there is not going to be one.

**Done when:** a real iPhone can vote and edit, a screen reader reads the answers sensibly, `/privacy` exists, and the suite is green.

---

## Stream F — Organiser results and confirm

**Depends on:** E. **Spec:** §2.4, §3.6.5–3.6.8, §4.2, §4.4.

`/availability/o/[token]`. `setPollOpen`, `confirmOption`, `deleteResponse`, `deletePoll`. Digest and confirmation fan-out. `npm install ics` — the one new dependency, ISC licensed, which passes the copyleft gate.

- The matrix goes **here**, not on the participant page: a semantic `<table>` with `<thead>` / `<th scope>`, in an `overflow-x: auto` container carrying `tabindex="0"` and an accessible name. **Not `role="grid"`** — a half-done grid makes cells *invisible* to screen readers rather than merely awkward.
- `confirmOption`'s `.eq('poll_id')` scope is the **only** control on cross-poll option ids. `polls_confirmed_option_fk` is a simple FK and will not catch it. The composite FKs guard votes, not this.
- The fan-out reaches the organiser and every responder who gave an address. It does **not** reach non-voters — they have no row and no address. Say that plainly in the copy rather than claiming everyone was told.
- `confirm_notify_failures` is an `integer` count. There are no addresses to render and none to store.
- Guard the double-tap: a second `confirmOption` must not re-mail twenty people.

**Done when:** a poll can be confirmed, the `.ics` opens correctly in Google Calendar **and** Outlook, and the suite is green.

---

## Stream G — Retention and polish

**Depends on:** A, C. **Spec:** §3.8, §4.5, §4.6.

One cron route, five passes in order: retention delete via the shipped `sweepExpiredPolls({ limit })`, unverified-draft delete, rate-limit window sweep, digest flush, nudge. `crons` in `vercel.json` — none exists today. `CRON_SECRET`.

The nudge chases **the organiser, not the participants**. A non-responder does not exist in the schema until they answer, so "remind the people who haven't replied" is an empty set. The alternative needs an address book, which is the thing this design exists to avoid.

**No nav entry.** The tool is link-shared, not browsed to. `content/data/navigation.json` is untouched.

**Done when:** the cron runs all five passes, reports a real status rather than a silent 200, and the suite is green.

---

## What is explicitly not being built

Recorded so nobody adds them back as "obvious":

- **No error-tracking service.** The site has none, and the live contact-mail path is already best-effort console logging by design. Requiring this feature to invent an observability stack the whole site lacks is scope inflation.
- **No Playwright suite as a gate.** There is no CI to gate it on. Per-phase human sign-off covers the journeys.
- **No outbox, queue, RPC layer or webhook.** None exists; none was adopted. The review recommended monitoring an outbox backlog — there is no outbox.
- **No invitee address book.** It is the relay surface the whole design avoids.
- **No `poll.orangejelly.co.uk`.** Peter reuses `auth.*`. `POLL_FROM_EMAIL` is the entire migration if that changes.

---

## Prerequisites still outstanding

| Item | Blocks | Owner |
|---|---|---|
| Turnstile keys in **Vercel** (they are in `.env.local`) | Stream C in production | Peter |
| The live Resend plan's daily cap and rate limit | Stream D shipping mail | Peter |
| The Vercel plan's cron limits | Stream G | Peter |

None of these blocks writing the code. All three block shipping the stream that needs them.
