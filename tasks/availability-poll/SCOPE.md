# Availability Poll ("Doodle for Orange Jelly") — Build Scope

**Status:** approved to build. Phase 0 in progress.
**Date:** 16 July 2026
**Author:** research + codebase audit, verified against the live repo and live Supabase project.

---

## Decisions taken — 16 July 2026

Peter's answers to §10. Recorded here so the build has a single reference.

| # | Decision | Answer |
|---|---|---|
| 1 | Build, or pay ~£44/yr for Rallly Cloud Pro? | **Build**, in-repo. Accepts the ~£6–12k capacity cost against the branding and URL being the point. |
| 7 | The GPL/AGPL gate | **Upheld.** No AGPL or GPL code enters this repo. Rallly, Crab.fit, Nextcloud Polls, jawanndenn, Dudle, CabbageMeet and Easy!Appointments are all out. Parachute (MIT) may be used as a reference for grid logic only. Crab.fit's source is not to be read with intent to copy. |

**Proceeding on the §10 recommendations** for the decisions that shape Phase 0/1 and were not separately raised. Any of these can be reversed — say so and it changes:

| # | Decision | Proceeding with |
|---|---|---|
| 2 | Controller or processor? | **Controller** — OJ's tool, on OJ's site, OJ decides the purpose. |
| 3 | Aggregate counts or per-person votes during voting? | **Aggregate only** — shapes the Phase 1 data model. |
| 4 | Hard cap on options | **8** |
| 6 | Poll mail on the orangejelly.co.uk sending domain | **Yes, but** Phase 2a (verification + rate limiting) lands before 2b. |

**Still genuinely open — see §10:** decision 5 (deleting `db/migrations/`, a deletion needing an explicit yes) and decision 8 (the retention window, which blocks the GDPR notice in Phase 2).

---

## 1. Does this app have a dedicated database?

Yes. There is a live, linked Supabase Postgres project — ref `miqqkllqfyvaomzgujed`, name "Orangejelly.co.uk", region eu-west-1, Postgres 17.6.1.127, ACTIVE_HEALTHY, created 16 June 2026. Today it holds exactly four tables and nothing else: `newsletter_subscribers` (0 rows), `contacts` (5 rows), `lead_sources` (14 rows), `conversion_events` (9 rows). There is no poll, event or scheduling schema of any kind, so there is zero name-collision risk. On posture: RLS is enabled on all four tables and there are **zero** policies anywhere (`pg_policies` returns no rows for the public schema), which means anon and authenticated roles can neither read nor write — only the service-role key reaches the data, and it does so from server code. Auth is real Supabase Auth (`signInWithPassword`) plus an `ADMIN_EMAILS` env allowlist checked at the API layer; exactly one auth user exists (peter@orangejelly.co.uk). There is no cookie session, no `@supabase/ssr`, and no middleware auth gate — `/admin`'s page shell is public and only its data is protected.

---

## 2. Existing repositories — the honest verdict

Every licence below was read from the actual licence file in the repo, not from the GitHub sidebar label. Two entries are cases where the GitHub API is wrong.

| Project | Actual licence | Does group availability polling? | Stack | Maintained? | Verdict |
|---|---|---|---|---|---|
| **Rallly** | **AGPL-3.0** | Yes — closest match to Doodle in existence | TS, Next.js, Prisma+Postgres, tRPC, Tailwind | Yes (pushed today) | **Blocked** |
| **Crab.fit** | **GPL-3.0** | Yes — when2meet replacement, live heat map | TypeScript | Yes (Apr 2026) | **Blocked** |
| **Nextcloud Polls** | **AGPL-3.0-or-later** | Yes, but only inside Nextcloud | Vue + PHP | Yes | **Blocked** |
| **jawanndenn** | **AGPL-3.0-or-later** | Yes | Python/Django + React/MUI | Yes | **Blocked** |
| **Dudle** (kellerben) | **AGPL-3.0** | Yes | Ruby, CGI | Quiet (Mar 2025) | **Blocked** |
| **CabbageMeet** | **AGPL-3.0** | Yes | TypeScript | **Archived** | **Blocked** |
| **Easy!Appointments** | **GPL-3.0** | No — Calendly-style booking | PHP (CodeIgniter) | Yes | **Blocked** |
| **Parachute** | **MIT** | Yes — explicit when2meet alternative | Next.js 13 pages router, React 18, TS, tRPC, Prisma, Tailwind + styled-components | No (last push Oct 2024, 15 stars) | **Usable — code donor** |
| **Croodle** | **MIT** | Yes, with client-side encryption | Ember + PHP | Yes | Usable but stack-incompatible — reference only |
| **polly** (manfredsteger) | **MIT** | Mostly | React + Express + Postgres | Yes, but 3 stars | Usable but not worth it — reference only |
| **Framadate / OpenSondage** | **CeCILL-B** (permissive, BSD-like) | Yes | PHP | GitHub repo **archived**, 2014 snapshot | Reference only |
| **cal.diy** (was cal.com) | **MIT** *today* | No — Calendly-style, wrong category | TS, Next.js, Prisma, tRPC | Yes | Reference only |

### The killer point

**Seven of the twelve are AGPL-3.0 or GPL-3.0.** The project's own documented rule is: *"AI MUST stop and request explicit approval before… using GPL/AGPL code in proprietary projects."* orangejelly.co.uk is a proprietary commercial site. That rule gates **every single one of the best-maintained, best-fitting options** — including Rallly, which is functionally and technically the ideal match and is exactly why its licence hurts.

> **Precision on what that rule is.** It is an **approval gate, not an absolute prohibition** — the rule says *stop and ask*, and Peter can say yes. The "Blocked" verdicts in the table above are therefore this document's *recommendation* under that gate, not a decision already taken on his behalf. Because the rule reserves the call for Peter, it is put to him explicitly as **open decision 7 in §10** rather than settled here. Everything below explains why the recommendation is "don't", but the decision is his.

Concretely on Rallly: AGPL §13 obliges anyone who **modifies** the program and offers it over a network to give every user of it the complete corresponding source of their version, free. Restyling by editing CSS/templates/components counts as modification. So an on-brand Rallly fork would have to be published under AGPL — competitors could take the themed build. Running an **unmodified** Rallly on a separate domain does *not* trigger §13 (§0 explicitly carves out "executing it on a computer"), and that is the only compliant route to Rallly code.

Crab.fit's GPL-3.0 lacks AGPL's network clause, so pure SaaS use *arguably* would not trigger distribution — but that is a contested legal grey area, not a foundation for a commercial product, and it conflicts with the standing rule regardless. Treat as blocked. Look at the live site for UX ideas; do not read the source with intent to copy.

**Genuinely usable:** Parachute (MIT) is the only verified project that both does group availability polling and shares the target stack. Treat it as a code donor, not an upstream — 15 stars and no commits since October 2024 means there is nothing to track.

### What the research refuted or corrected — recorded, not dropped

- **cal.com no longer exists at that URL.** `github.com/calcom/cal.com` now redirects to `calcom/cal.diy` (same repo id 350360184 — renamed). What sits there today is MIT with the enterprise code removed. Historic context: Cal.com moved MIT → AGPLv3 in Sept 2021. The licence position at this URL has already changed meaning once — re-verify and pin a commit if ever used.
- **"GraceyWong/crabfit" does not exist.** The real repo is `GRA0007/crab.fit`.
- **GitHub's licence API is wrong twice.** It reports `NONE` for jawanndenn (no LICENSE file — but `setup.py` says `license="AGPLv3+"` and the README confirms AGPL) and `NONE` for Framadate (files named `LICENCE.fr.txt` / `LICENSE.en.txt`, which the detector misses — they are CeCILL-B). Anyone trusting the API alone would wrongly read jawanndenn as unlicensed.
- **Croodle's copyright header is stale.** The LICENSE body is a valid MIT grant but carries a leftover `Copyright (c) 2013 Stefan Penner and Ember App Kit Contributors` line from the scaffold. Grant is MIT; the attribution line is wrong.
- **Framadate's licence is only partially verified.** CeCILL-B confirmed on the archived 2014 GitHub snapshot only. The maintained Framagit version's current licence is **unverified**.
- **Dudle is not "GPL v3"** as search results claim — the licence file is AGPL-3.0, which is stricter.

---

## 3. Recommendation

**Build it. Small, in-repo, from scratch, using Parachute as a reference for the availability-grid logic only.**

Why: the whole point of this is a poll living at `www.orangejelly.co.uk/availability` as a first-class, on-brand page. No SaaS gives you that — "white-label" universally means your logo and colours on *their* domain, or a CNAME at the top tier. Self-hosting Rallly cannot get you there either: restyling it triggers AGPL §13, so the on-brand version would have to be given away, and Rallly's own commercial gate means multi-user self-hosting needs a purchased licence key ($299+ one-time; whether "one organiser + anonymous responders" counts as single-user is **unverified — needs vendor confirmation**). It also does not run on Vercel in any supported way.

The trade-off is honest: this is genuinely 2–4 weeks of proper work, not a weekend. The hard parts are timezones, token security, spam on a public write endpoint, and GDPR for third-party names — all named in §7. That cost is justified only if this is a client-facing differentiator for licensees, not an internal convenience. Every reason people abandon Doodle (free-tier degradation, ads, mobile grid failure, no way to edit your own entry, timezone errors) is a **business-model** wound, not a technical one — a free, ad-free, account-free tool with working timezones and an edit-your-response link beats Doodle on all five with no clever engineering.

**Runner-up: Rallly Cloud Pro at $56/year (~£44).** It lost only on branding and URL. It avoids every hard part in §7 for less than an hour of billed time, and if this is really just "coordinate a meeting with a licensee occasionally", it is objectively the right answer and the build is a false economy. It loses because it cannot live on orangejelly.co.uk, cannot carry OJ brand, and produces nothing to point clients at.

**Rejected outright: iframe embed of any SaaS.** Third-party cookies are blocked by default in Safari and Brave and partitioned in Firefox, so an iframed app cannot rely on its own session; iframe content contributes nothing to your page's SEO; and cross-origin iframes do not auto-size, giving the double-scrollbar trap on mobile.

---

## 4. What "Doodle for Orange Jelly" actually is

Minimum lovable set. Everything here is irreducible.

1. **Create a poll** — title, optional description/location, organiser name + email. Organiser email verified by magic link before the poll goes live.
2. **Propose 5–8 options** — either date-only *or* specific time slots with individual start/end per option (pubs run irregular hours; a uniform duration does not fit). Hard cap at 8 in the UI.
3. **Two unguessable links** — one participant, one organiser. Never derivable from each other.
4. **Respond with no account** — name required, email optional, three states per option: **Yes / If need be / No**. This is the whole point and the single biggest advantage over Doodle.
5. **Edit your own response** via a tokenised link in your own email. This is the #1 unfixed complaint about every existing tool and it is cheap.
6. **Results view** — organiser sees the participants × options matrix with per-option totals and the best option highlighted.
7. **Organiser controls** — close poll, delete a response, delete poll.
8. **Notification to the organiser on response** — digested, not one email per vote.
9. **Confirm the winning slot** — one commit button, poll locks, everyone invited is notified with the time spelled out in words plus the timezone, an `.ics` attachment, and Add-to-Google/Add-to-Outlook links. Poll URL stays live afterwards showing the confirmed time.

### Three product decisions baked in, with evidence

- **Cap options at 8.** The Togedule study (*Proc. ACM HCI* 2025, N=66) found large option sets make people silently omit real availability — *"There were just too many time slots, so I just checked the ones that seem popular."* Cutting option count is cheaper and more effective than engineering a better grid.
- **Default "if need be" ON.** Doodle defaults it off. The third state only gets used when the option set is small — which ours is, by design.
- **During voting, show aggregate counts only — never per-person votes.** Zou/Meir/Parkes' analysis of 14M+ Doodle votes across 340,000+ polls found open polls push responders toward very popular and very unpopular slots and starve the intermediate ones. Aggregate counts keep the useful signal and dampen the anchoring. This shapes the data model, so it needs confirming (see §10).

### NOT IN SCOPE

- Any account or login for participants, ever.
- Any account for the organiser beyond a magic-link email verification.
- OAuth calendar sync / reading the organiser's busy times. This is an account requirement in disguise, and both Doodle and Rallly paywall it, so nobody expects it free.
- Automatic reminders to non-responders (needs cron — see §9 phase 5).
- Comments on polls.
- Hidden/blind polls as a togglable mode.
- Multiple organisers per poll, teams, spaces, roles.
- Embedding the poll in a licensee's own site via iframe. CSP is `frame-ancestors 'self'` and would need an explicit change.
- Timezone detection or multi-timezone display. Lock to Europe/London and say so on screen. Our users are all UK. The one-hour-offset bug is the single thing that most destroys trust in these tools; the cheapest way to never ship it is to not build the feature.
- Anonymous poll *creation*. Creation must be gated behind a verified email — see the open-relay risk in §7.
- Recurring polls, poll templates, CSV export, PDF export.
- Realtime/live-updating results. CSP `connect-src` excludes Supabase and `wss://`; server-rendered results on load are enough.

---

## 5. Proposed data model

Conventions followed exactly as found in the audit: `uuid` PK with **no** database default (the app generates it via `randomUUID()` from node crypto and passes it in), `timestamptz NOT NULL DEFAULT now()`, snake_case columns, `<table>_<cols>_idx` index naming, RLS enabled with **no policies** (server-only access via the service-role key, matching the existing `db/migrations/002_enable_lead_data_rls.sql` posture).

Two deliberate departures from existing convention, both justified:

- **Real foreign keys with `ON DELETE CASCADE`, and *composite* ones where a row spans two parents.** The existing schema has zero FKs and uses a polymorphic `owner_type`/`owner_id` pair enforced only by CHECK constraints. Poll data is inherently relational and a dangling vote is a correctness bug. This improves on the existing pattern rather than copying it. Note the subtlety: `poll_responses` carries `poll_id`, `participant_id` *and* `option_id`, so three independent single-column FKs would still permit a vote whose option belongs to a different poll than its `poll_id` says. The composite FKs below close that hole. **Verified against the live database on 16 July 2026** by running this DDL in a rolled-back transaction: the cross-poll insert raises `foreign_key_violation`, the legitimate insert succeeds.
- **An `updated_at` trigger.** Existing tables maintain timestamps by hand and inconsistently (SQL `now()` in one path, `new Date().toISOString()` in another). Votes are mutable, so this needs a trigger.

Migration goes in `supabase/migrations/` with timestamp naming — that is what demonstrably built the live schema (the ledger holds `20260616110000` and `20260616111500`). Apply with `npx supabase db push`. **Do not** use `npm run db:migrate`: it reads `db/migrations/`, requires `DATABASE_URL` which is unset locally, and has never run against this database (`to_regclass('public.schema_migrations')` returns null). See open decision 5 on the duplicate directories.

```sql
-- supabase/migrations/<timestamp>_availability_polls.sql

-- Shared trigger function for mutable rows.
-- `set search_path = ''` is deliberate: without it Supabase's security advisor
-- raises `function_search_path_mutable`, and a mutable search_path on a trigger
-- function is a real (if narrow) privilege-escalation vector.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create table if not exists polls (
  id                  uuid primary key,
  title               text not null,
  description         text,
  location            text,
  organiser_name      text not null,
  organiser_email     text not null,
  -- Two independent CSPRNG tokens, base64url, >= 128 bits of entropy each.
  -- Never derivable from each other; never from the id.
  participant_token   text not null unique,
  organiser_token     text not null unique,
  -- 'dates' options are calendar days and must NEVER touch a timezone conversion.
  -- 'slots' options are absolute instants.
  option_kind         text not null check (option_kind in ('dates', 'slots')),
  -- IANA zone id for display/labelling. Never a fixed offset like '+01:00'.
  timezone            text not null default 'Europe/London',
  status              text not null default 'draft'
                      check (status in ('draft', 'open', 'closed', 'confirmed')),
  confirmed_option_id uuid,          -- FK added after poll_options exists
  email_verified_at   timestamptz,
  closes_at           timestamptz,
  expires_at          timestamptz not null,  -- auto-delete after inactivity (GDPR retention)
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create table if not exists poll_options (
  id          uuid primary key,
  poll_id     uuid not null references polls(id) on delete cascade,
  -- Exactly one of option_date OR (starts_at, ends_at) is populated,
  -- determined by the parent poll's option_kind.
  option_date date,
  starts_at   timestamptz,
  ends_at     timestamptz,
  position    integer not null,
  properties  jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  constraint poll_options_shape_chk check (
    (option_date is not null and starts_at is null and ends_at is null)
    or
    (option_date is null and starts_at is not null and ends_at is not null and ends_at > starts_at)
  ),
  -- Lets poll_responses carry a composite FK, so an option can never be
  -- attached to a vote belonging to a different poll. See note below.
  constraint poll_options_id_poll_id_key unique (id, poll_id)
);

alter table polls
  add constraint polls_confirmed_option_fk
  foreign key (confirmed_option_id) references poll_options(id) on delete set null;

create table if not exists poll_participants (
  id          uuid primary key,
  poll_id     uuid not null references polls(id) on delete cascade,
  display_name text not null,
  email       text,
  -- Lets a participant edit their own response from their own email link.
  edit_token  text not null unique,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint poll_participants_id_poll_id_key unique (id, poll_id)
);

create table if not exists poll_responses (
  id             uuid primary key,
  poll_id        uuid not null,
  participant_id uuid not null,
  option_id      uuid not null,
  availability   text not null check (availability in ('yes', 'if_need_be', 'no')),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  unique (participant_id, option_id),
  -- Composite FKs, not simple ones. A simple FK per column would happily accept
  -- a vote whose option_id belongs to poll A while poll_id says poll B — the
  -- exact "dangling vote" class of bug the FKs are here to prevent.
  constraint poll_responses_poll_fk
    foreign key (poll_id) references polls(id) on delete cascade,
  constraint poll_responses_participant_fk
    foreign key (participant_id, poll_id)
    references poll_participants(id, poll_id) on delete cascade,
  constraint poll_responses_option_fk
    foreign key (option_id, poll_id)
    references poll_options(id, poll_id) on delete cascade
);

-- Indexes (mirrors the existing <table>_<cols>_idx convention)
create index if not exists polls_created_at_idx           on polls (created_at desc);
create index if not exists polls_expires_at_idx           on polls (expires_at);
create index if not exists polls_organiser_email_idx      on polls (organiser_email);
create index if not exists poll_options_poll_id_idx       on poll_options (poll_id, position);
create index if not exists poll_participants_poll_id_idx  on poll_participants (poll_id);
create index if not exists poll_responses_poll_id_idx     on poll_responses (poll_id);
create index if not exists poll_responses_option_id_idx   on poll_responses (option_id);

create trigger polls_set_updated_at
  before update on polls
  for each row execute function public.set_updated_at();
create trigger poll_participants_set_updated_at
  before update on poll_participants
  for each row execute function public.set_updated_at();
create trigger poll_responses_set_updated_at
  before update on poll_responses
  for each row execute function public.set_updated_at();

-- Server-only data. RLS enabled; no policies. Only the service-role key reaches
-- these tables, exclusively from trusted server code. Matches the posture set by
-- db/migrations/002_enable_lead_data_rls.sql.
alter table polls              enable row level security;
alter table poll_options       enable row level security;
alter table poll_participants  enable row level security;
alter table poll_responses     enable row level security;

comment on table polls is
  'Server-only availability poll data. RLS enabled with no policies; writes happen through trusted server code via the service-role key.';
```

**Note on tokens vs primary keys.** `participant_token`, `organiser_token` and `edit_token` are capability tokens, not identifiers. They must come from a CSPRNG (`crypto.randomBytes`), be base64url-encoded, and carry at least 128 bits of entropy — a 22-char base64url string is ≈132 bits, per OWASP session-ID guidance. Never sequential ids, never UUIDv1, never `Math.random()`.

**Conversion events.** `conversion_events.owner_type` has a CHECK constraint limiting it to `'contact'`/`'newsletter_subscriber'`. Logging `poll_created` / `vote_submitted` through the existing `trackConversionEvent` plumbing needs an `ALTER` to extend that CHECK. Worth doing — it surfaces poll activity in the admin dashboard for free.

**snake_case.** This repo has no `fromDb` helper and no camelCase mapper; DB field names leak raw into component props (`AdminDashboard.tsx` declares `pub_name`, `created_at`). Match that — do not introduce a mapper for this feature alone.

---

## 6. Architecture

### Fundamentals — all green

Next.js 14.2.32 App Router, React 18. `next.config.js` sets no `output` mode, so SSR, dynamic rendering and server actions are all fully available with no build-config change. Plan for Next 14 idioms — `unstable_cache`/`after()` and Next 15 caching semantics do not apply.

### The controlling constraint: everything server-side

CSP `connect-src` (`src/middleware.ts:66`) is an allowlist that does **not** include `*.supabase.co` or `wss://`. Any browser-side `supabase-js` call is blocked. Rather than widen the security header, route **all** poll reads and writes through same-origin server actions. That needs no CSP change, keeps the service-role key server-side, and matches the existing architecture exactly.

Prefer **server actions over `/api` route handlers** for mutations, for a second reason: middleware's matcher excludes `api`, so route handlers get a thinner header set and **no CSP at all** (`next.config.js:103-116`). Server actions post to the page route and get the full CSP.

### Routes

| Path | Rendering | Purpose |
|---|---|---|
| `src/app/availability/page.tsx` | static | Marketing/landing + "Build your poll" entry |
| `src/app/availability/new/page.tsx` | `force-dynamic` | Create-poll form |
| `src/app/availability/verify/[token]/page.tsx` | `force-dynamic` | Magic-link handler; flips `status` draft → open |
| `src/app/availability/p/[token]/page.tsx` | `force-dynamic` | Participant view — vertical slot cards, aggregate counts |
| `src/app/availability/p/[token]/edit/[editToken]/page.tsx` | `force-dynamic` | Edit your own response |
| `src/app/availability/o/[token]/page.tsx` | `force-dynamic` | Organiser view — results matrix, close, confirm, delete |

Every dynamic page needs `export const runtime = 'nodejs'` and `export const dynamic = 'force-dynamic'` — the established pattern at `api/admin/stats/route.ts:6-7`. `next.config.js:36-40` documents a real past bug where page-level redirect logic no-op'd because the route rendered statically. The same class of bug will bite a poll page that forgets this.

Set `Referrer-Policy: no-referrer` on all `/availability/p/*` and `/availability/o/*` routes — the tokens are in the URL and would otherwise leak via `Referer`.

### Server actions — `src/app/actions/polls.ts`

Copy the shape of `src/app/actions/contact.ts` wholesale: `'use server'` at the top, honeypot short-circuit returning a fake success, validation before any write, persist first, then best-effort side-effects in a `try/catch` that can never fail the user path, and the return type `Promise<{ success?: boolean; error?: string }>`.

One deliberate departure: **use Zod**. `zod ^4.0.14` is already a dependency but no action uses it — validation is hand-rolled ifs. Nested date/slot/vote payloads justify introducing it here.

- `createPoll(input)` → validates, generates tokens, inserts `polls` + `poll_options`, sends the organiser magic link. Poll stays `draft` until verified.
- `verifyOrganiserEmail(token)` → sets `email_verified_at`, `status = 'open'`.
- `submitResponse(participantToken, input)` → **inserts** a `poll_participants` row (generating its `edit_token`), then inserts its `poll_responses`. Not an upsert — see the note below.
- `updateResponse(editToken, input)` → resolves the participant by their own `edit_token`, then upserts `poll_responses` on the `(participant_id, option_id)` unique constraint. This is the only genuine upsert in the design.
- `closePoll(organiserToken)` / `deleteResponse(organiserToken, participantId)` / `deletePoll(organiserToken)`.
- `confirmOption(organiserToken, optionId)` → sets `status = 'confirmed'`, `confirmed_option_id`, fires the notification fan-out.

**Note — "upsert a participant" is not implementable, and that is a product decision in disguise.** An upsert needs a unique conflict target. A first-time responder has no stable key: `display_name` is self-asserted and non-unique, `email` is optional, and `edit_token` is generated by us at insert time. The only workable rule is: **a submission without an `edit_token` always creates a new participant.** The consequence is that the same person responding twice from the participant link appears twice, and the organiser's matrix shows a duplicate row.

Mitigations, in order of preference:
1. **Return the edit link immediately on submit** (on-screen, not only by email) so a returning responder has a token to come back with. Cheap, and it is the honest fix.
2. **Organiser can delete a response** — already in scope (§4.7), and it makes duplicates a nuisance rather than a defect.
3. *Optionally* a partial unique index `(poll_id, lower(email)) where email is not null` to collapse duplicates for people who supply an email. **Do not do this by default** — it breaks two colleagues sharing one address, which is common in pubs, and turns a cosmetic duplicate into a hard submission failure for a real user.

Accept duplicate participants. Do not engineer identity into an explicitly account-free tool.

### Data access — `src/lib/db/polls.ts`

Use `getSupabaseAdminClient()` / `isSupabaseAdminConfigured()` from `src/lib/db/supabase-admin.ts`. **Do not** replicate the dual-path pattern in `leads.ts`: the raw-`pg` branch is unreachable dead code in this environment (every write checks `isSupabaseAdminConfigured()` first, and `DATABASE_URL` is unset), and it is precisely why that file is 453 lines. The `pg` Pool's `max: 5` is also a real constraint on Vercel serverless — each lambda opens its own pool.

Mirror the `storeX() → { stored, id?, error? }` contract from `leads.ts`, but **surface real errors**. `leads.ts` swallows everything into `{ stored: false }` with a `console.error`. A silently-dropped vote is a correctness bug users notice.

### Date utilities — `src/lib/dateUtils.ts` (net new, build first)

Does not exist. Must be built before any poll logic. See §7.

### Email — `src/lib/email.ts` needs generalising

Resend is wired and gated on `RESEND_API_KEY` + `CONTACT_FROM_EMAIL`. `sendLeadNotification` resolves its recipient internally — `const to = process.env.CONTACT_NOTIFICATION_EMAIL || 'peter@orangejelly.co.uk'` (`email.ts:44`) — so it is env-configurable to exactly one address but takes no `to` argument and therefore cannot address a per-call recipient. It needs a `to` parameter. Keep what it already does right: a plain-text part (learned the hard way in commit `ca016bd9`) and a reply-to. `escapeHtml()` (`email.ts:7-14`) is directly reusable and **mandatory** — poll titles are attacker-controlled and end up in HTML email.

Touchpoints:

| Trigger | To | Contains |
|---|---|---|
| Poll created | Organiser (unverified) | Magic link to verify + activate |
| Poll live | Organiser | Participant link **and** organiser link, clearly separated |
| Response submitted | **Organiser only**, digested | Who responded. Never per-response — a 20-person poll = 20 emails |
| Response submitted | The participant, if they gave an email | Their own edit link + GDPR privacy notice |
| Option confirmed | Everyone invited, including non-voters | Time in words + timezone, `.ics` attachment, Add-to-Google/Add-to-Outlook links |

**The organiser link must never appear in a participant email.**

Notify everyone invited on confirm, not just voters — Doodle's non-voter gap is a genuine flaw; a licensee who never responded still needs to know when the meeting is. And spell the time out in words ("Tuesday 14 July 2026, 2:00pm UK time") — the `.ics` is the thing that silently goes wrong.

`.ics` is for delivering the agreed time, not managing RSVPs. Do not build RSVP on top of it.

### Rate limiting — `src/lib/rate-limit.ts` (net new)

There is **none anywhere in the codebase**. `src/app/api/events/route.ts` is an unauthenticated, unthrottled public POST that writes to the DB — the exact shape of the new endpoint, and a cautionary precedent, not a model. Add Upstash, per-IP and per-poll, on `createPoll` and `submitResponse`.

### Navigation

Add one `{ label, href, order }` object to `content/data/navigation.json`. No component changes needed — `NavigationWrapper.tsx` reads and sorts it. Note `src/lib/constants.ts` is **not** the nav home despite what you might assume; it holds contact/pricing/WhatsApp copy only.

### The apex-domain POST trap

`src/middleware.ts:88` correctly exempts POST from the apex→www 301 (a 301 would drop the body). But `vercel.json:15-26` adds a platform-level apex→www redirect with **no method guard**, and it fires *before* middleware. Every poll link, email link and QR code must use `www.orangejelly.co.uk` or submissions from an apex URL can lose their body.

### Testing

Vitest + jsdom + RTL exists but is thin — 10 files, 2 covering server actions. `src/app/actions/contact.test.ts` is a directly copyable template: it already mocks Resend and the DB layer and tests the honeypot path at line 84. Poll business logic ships with tests; do not inherit the coverage gap.

---

## 7. The hard parts, named honestly

### Timezones — the real bug, and the biggest gap

**Risk:** there is **no date library installed** (no date-fns, dayjs, luxon, moment) and **no `src/lib/dateUtils.ts`** despite the workspace standard mandating one. The only timezone-aware code in the entire app is `AdminDashboard.tsx`. Vercel lambdas run UTC; users are Europe/London. Dates and timezones *are* the domain model of an availability poll. The classic failure is treating all options the same — they are not. A date-only option converted to `timestamptz` turns "Saturday 3rd" into "Friday 2nd 23:00" for a viewer in Dublin. DST is where it bites: spring has a missing hour, autumn a repeated one. The one-hour-offset bug is the single fastest way to destroy trust — it is Doodle's most-cited failure.

**Mitigation:** build `src/lib/dateUtils.ts` **first**, before any poll logic, with a date library. Enforce the split at the type level: date-only options are `date` and must never touch a timezone conversion; slot options are `timestamptz` (Postgres stores a UTC instant, no offset retained). Store the IANA zone id `Europe/London`, never a fixed offset like `+01:00`. Lock display to Europe/London and label it on screen — do not build detection you can get wrong. Test explicitly across both DST boundaries.

### Anonymous access + token security

**Risk:** no login means identity is a self-asserted name string — anyone can claim to be anyone. Accept it; Doodle does. But it also means the endpoint is publicly writable, which drives everything below. Capability URLs leak via `Referer` headers, server logs, proxies and browser history. Anyone forwarded the organiser link becomes the organiser.

**Mitigation:** ≥128 bits of CSPRNG entropy per token (22-char base64url ≈132 bits). Two independent tokens, neither derivable from the other or from the id. `Referrer-Policy: no-referrer` on poll pages. No third-party resources loaded on token URLs. Scrub tokens from logging. The organiser link never appears in a participant email. The forwarded-admin-link risk is the accepted trade-off for no-login — name it in the organiser email.

### Mobile grid

**Risk:** When2Meet is the cautionary tale. On iPhone Safari, quick drags across the grid register as scroll gestures and *deselect* blocks already marked; zoom touches alter the calendar. The result is dropped responses and people not filling it in — and most participants open these links on a phone.

**Mitigation:** do not try to make the matrix work on 375px. Transpose it. The grid has two users doing two jobs; conflating them is the root error. **Participant view = a vertical list, one card per option**, three big tap targets each (≥44×44px), plus a light "3 of 6 so far" aggregate. Vertical scroll is the only gesture a phone does reliably. No drag, no horizontal scroll, no zoom. **Organiser view = the matrix**, in an `overflow-x: auto` container with `position: sticky` header row and first column, `tabindex="0"` and an accessible name on the scroll container. And the cheapest fix of all: cap options at 8, which removes most of the problem before it exists.

### Accessibility (WCAG 2.1 AA)

**Risk:** the reflexive move is `role="grid"`, which is a trap. APG is explicit: in a grid, *"every cell contains a focusable element or is itself focusable"*, because screen readers enter application mode and *"hears only focusable elements"* — a half-done grid makes cells **invisible** to screen readers rather than merely awkward. Separately, a green/amber/red cell grid fails 1.4.1 Use of Colour outright — the most-failed criterion in every availability tool.

**Mitigation:** avoid `role="grid"` entirely. Participant view is a `fieldset`/radiogroup per option — three mutually exclusive states *is* a radio group, and native radios give correct behaviour free. Organiser results are read-only, so a semantic `<table>` with `<thead>` / `<th scope="col">` / `<th scope="row">` is correct (APG: a table "is not an interactive widget"). This skips the whole roving-tabindex problem. Every state carries a glyph and text (✓ / ~ / ✗), never colour alone. Cell fills carrying meaning need 3:1 contrast against adjacent cells (1.4.11). Cell accessible names must be self-contained — "Peter, Tuesday 14 July 2pm, if need be" — never reliant on visual position. Content must work at 320px without 2D scrolling (1.4.10); a horizontally-scrolling *data table* is the named exception, a horizontally-scrolling *form* is not.

### Spam and abuse on a public write endpoint

**Risk:** the most under-appreciated one. **An open "invite people by email" form is an open relay for your sending domain.** Anyone could make orangejelly.co.uk send email to arbitrary strangers with attacker-controlled poll titles in the body. That torches the Resend domain reputation and the deliverability of actual client work. The only existing protection anywhere is a honeypot (`contact.ts:47-49`) — no Turnstile, no reCAPTCHA, no rate limiting of any kind.

**Mitigation**, in priority order:
1. **Anonymous users never trigger email to arbitrary addresses.** Only the verified organiser can add invitees. Notifications go to the organiser only. Participants get email only at the address they typed themselves.
2. Verify the organiser's email by magic link before the poll goes live.
3. Rate limit per IP and per poll (Upstash) on create-poll and submit-response.
4. Cloudflare Turnstile on poll **creation** only — not on responding, which would harm the no-login UX. Needs `challenges.cloudflare.com` added to CSP `script-src` **and** `connect-src` (`middleware.ts:62,66`).
5. Honeypot field (copy `contact-form.tsx:54,123-130` exactly — hidden `website` input, `tabIndex={-1}`, `aria-hidden`) plus a minimum time-to-submit.
6. Cap options per poll, responses per poll, and name/comment lengths.
7. `escapeHtml()` every piece of user content in email.

### GDPR — third-party names and emails

**Risk:** genuinely new for this codebase. The existing model stores lead PII server-only behind RLS with no user-facing read path. A poll exposes participant names and availability back to other participants. And because the organiser supplies participants' data, you obtain it **indirectly** — so **Article 14 applies, not Article 13**. You must provide privacy information within a reasonable period and no later than one month, **or at the point of first communication with that person, whichever is first**.

**Mitigation:** the invite/notification email **is** the first communication — put the privacy notice in it and on the poll page: who you are, what data, why, lawful basis, source of the data, retention, their rights, the ICO complaint route. Done at build time this is cheap. Lawful basis: legitimate interests, with a documented LIA. Retention: auto-delete polls after N days of inactivity via the `expires_at` column — Rallly's free tier does exactly this, and it is a compliance feature, not a limitation. PECR does not bite: invite and notification emails are service messages, not direct marketing — **unless** marketing gets bolted onto them, which would change that. Controller vs processor is unresolved and needs deciding deliberately (see §10).

---

## 8. Branding

The tool must look like it was always part of orangejelly.co.uk. Everything needed already exists.

**Tailwind is v3 CommonJS** (`tailwind.config.js`), not v4 `@theme inline`. Do not use v4 syntax.

**Canonical tokens** (`tailwind.config.js:12-32`) — use these names verbatim:
- `brand` — DEFAULT `#F65403`, secondary `#FF8901`, highlight `#FFBD28`, grounded `#736F26`
- `brand-base` — DEFAULT `#1A2F49`, light `#324A68`, dark `#122133`
- `blue-support` — DEFAULT `#01619E`, light `#2B84B9`, dark `#014D7E`
- `surface` — DEFAULT `#F2F8FC`, alt `#E7F1F8`

So: poll page background `bg-surface`, accent `bg-brand`, dark chrome and body text `brand-base`. Alias tokens (`orange`, `teal`, `cream`, `charcoal`) are still live and are what `Heading`/`Text` actually emit, so they must stay in config. Note `teal` is a misnomer — it is blue (`#01619E`).

**The shadcn trap:** `--primary` is `213 48% 19%` — **navy, not orange**. `<Button variant="default">` renders navy. Poll CTAs that must be orange need explicit `bg-brand` classes.

**Result bars:** use `--chart-1` through `--chart-5` (`globals.css:593-604`) in order. Already brand-consistent, no new palette needed. `src/components/ui/progress.tsx` is directly reusable.

**Fonts:** Fraunces → `--font-heading`, Open Sans → `--font-sans`, both `next/font/google` with `display: 'swap'`. Both CSS variables must be on `<body>` or headings silently fall back to Georgia (`layout.tsx:17-31`).

**Component signatures** (`src/components/ui/typography.tsx`):
- `<Heading level={1|2|3|4|5|6} color="default|base|support|accent|highlight|grounded|charcoal|orange|teal|white" align="left|center|right" />` — **no size or weight props**. Defaults `level=2`, `color="default"`, `align="left"`.
- `<Text as="p|span|div" size="xs|sm|base|lg|xl|2xl" color="default|base|support|accent|highlight|grounded|charcoal|muted|white|orange|error" weight="normal|medium|semibold|bold" align="left|center|right|justify" />` — **max size is `2xl`**, no `3xl`/`4xl`. `color="error"` exists for validation copy; `Heading` has no equivalent.
- `<List ordered? />` / `<ListItem />` for option lists — not raw `ul`/`li`.
- Use `{ Image } from '@/components/ui/image'` (required `alt`), **not** the deprecated `OptimizedImage` re-export, despite CLAUDE.md still documenting the latter.

**Which Button?** There are two competing APIs. `import Button from '@/components/Button'` is the legacy adapter (orange primary, `href`/`loading` support); `import { Button } from '@/components/ui/button'` is shadcn (navy default). The adapters are marked transitional. **Ruling for this tool: use `ui/button` with explicit brand classes.** Do not inherit deprecated code. Note the default `h-9` (36px) **violates the site's own 44px tap-target rule** — add `min-h-[44px]` on every button, as `ContactForm` does at line 233.

**Free from `globals.css`:** 44px minimum tap targets on every interactive element, the orange `#FF8901` `focus-visible` ring (a signature detail — reproduce it or it looks off-brand), `prefers-reduced-motion` handling, and 16px mobile input font-size to stop iOS zoom.

**Form pattern:** copy `src/components/forms/contact-form.tsx` exactly — `zodResolver`, explicit `defaultValues`, `space-y-6`, the `FormField`/`FormItem`/`FormLabel`/`FormControl`/`FormMessage` render pattern, the honeypot `website` input, a local `useState<'idle'|'submitting'|'success'|'error'>` machine, and inline `role="status" aria-live="polite"` success / `role="alert"` error blocks.

**Feedback:** there is **no Toast component**, despite `@radix-ui/react-toast ^1.2.14` being installed. Follow the site's proven inline pattern above rather than building one.

**Missing:** no `RadioGroup` in `src/components/ui/` — add `@radix-ui/react-radio-group`. No date/time picker. Both are net new.

**Validation copy** goes in `src/lib/validation-messages.ts` (`VALIDATION_MESSAGES` / `PLACEHOLDERS`), never inlined.

### Pre-commit language checks — a real constraint on microcopy

`scripts/check-growth-language.mjs` runs in lint-staged on `*.{js,jsx,ts,tsx,json,md}` **and** in the build (`package.json:15`). It hard-blocks two regexes:

- `/\bsave(?:d|s|ing)?\b/gi` — the verb and its `-d`/`-s`/`-ing` inflections
- `/\bsavings\b/gi`

> **Do not spell those words out in this document, in commit messages, or in any `.md`, `.json`, `.ts` or `.tsx` file you stage.** The regexes are quoted above in backtick form precisely because the leading `\b` makes the literal non-matching; prose mentions of the bare words are not so lucky, and this file will refuse to commit. This is not hypothetical — an earlier draft of this section failed its own check.

This rules out the single most common form button label. Use **"Publish poll"**, **"Update"**, **"Confirm"**, **"Done"** instead.

**Where the check actually fires — the nuance that matters.** The script has no path filter: it checks whatever files lint-staged hands it as CLI arguments, *plus* its own `FILE_TARGETS` and `content/` directories. Consequences:

- **At commit:** any staged `.ts`/`.tsx`/`.json`/`.md` file is checked, including a new `src/app/availability/*` page. (Staged `.js`/`.jsx` files match the lint-staged glob but are then dropped by the script's own `ALLOWED_EXTENSIONS`, which omits them — a latent gap in the check, not something to rely on.)
- **At build (`npm run build`):** no CLI arguments are passed, so **only** `FILE_TARGETS` + `content/` are checked. A poll page is **not** covered by the build gate.

So the protection is commit-time only, and it disappears entirely for anyone committing with `--no-verify` or editing via the GitHub UI. Treat it as a safety net, not a guarantee.

`scripts/check-british-english.mjs` blocks American spellings via these regexes (quoted, not spelled out, for the reason above — though note this script would not check *this* file anyway):

- `/\boptimiz(e|ed|ing|ation)\b/gi`, `/\banalyz(e|ed|ing)\b/gi`, `/\bbehavior(s)?\b/gi`, `/\bfavorit(e|es)\b/gi`, `/\bmaximiz(e|ed|ing|ation)\b/gi`, `/\brecogniz(e|ed|ing|able)\b/gi` — in all checked files
- `/\bcenter(s)?\b/gi` — `content/` only
- `/\bcolor(s)?\b/gi` — `.md` files only

**Important nuance, verified by reading the script:** unlike the growth-language script, this one *does* have a path filter — `shouldCheckCliPath()` (line 135) drops any CLI argument that is neither under `content/` nor one of the six hardcoded `FILE_TARGETS`. So a new page at `src/app/availability/*` is **never** checked by it, at commit or at build. British spelling in poll UI is therefore **completely unenforced** and must be maintained by hand — or add the poll pages to `FILE_TARGETS`. `center`/`color` remain legal in tsx classNames regardless.

*Recommendation: add `src/app/availability/**` to the British-English `FILE_TARGETS` as part of Phase 2. It is a one-line change and the alternative is relying on hand-discipline for the site's own house style.*

**Tone** (`docs/TONE_OF_VOICE.md`): avoid flat CTAs ("Learn more", "Contact us", "Submit", "Get in touch") and agency-speak ("bespoke packages", "digital solutions", "tailored support"). Use "Cast your vote", "See the results", "Build your poll", "Confirm this time". Second person, plain English, bold and human. Any quantified claim must come from `/CLAIMS.md` and be expressed as a percentage.

---

## 9. Delivery plan

Six phases, each independently shippable, each targeting 300–500 lines of meaningful change. Complexity scored on the project matrix (`Total = Σ(weight × score)`; 0–10 simple, 11–30 medium, 31–50 complex, 51+ epic).

> **Read the scores as bands, not as arithmetic.** Two caveats, stated rather than papered over. First, the sums below misapply the LOC factor — its weight is **1×**, but the inline workings multiply it by 3. Correcting it pushes every phase's raw total up (Phase 1 ≈ 46 not 35; Phase 2 ≈ 68 not 58). Second, the matrix has no zero: every factor scores a minimum of 1, so a strict reading gives a floor of ~22 and **nothing can ever score SIMPLE**. The scores below therefore treat "None" factors as 0, which is the only workable reading but is not what the matrix literally says. **Neither correction changes any phase's band or any split decision** — Phase 2 is EPIC and splits, Phases 1/3/4 are COMPLEX, Phase 0 is the smallest. The ordering and the dependencies are the load-bearing parts of this section; the integers are indicative.

**Phase 0 — Date foundation.** `src/lib/dateUtils.ts` + a date library. `getTodayIsoDate()`, `toLocalIsoDate()`, `formatDateInLondon()`, and the strict date-only vs instant split. Full unit tests across both DST boundaries. Ships alone, useful alone, and unblocks everything.
*Complexity: 2 files×2 + <50 LOC×1 + 1 dep×3 + no migration + no breaking + no security + no business impact = **~8, SIMPLE**.*

**Phase 1 — Schema + data layer.** The migration in §5 (into `supabase/migrations/`, applied with `npx supabase db push`), the `conversion_events` CHECK `ALTER`, `src/lib/db/polls.ts` on the admin client, and the token generator. No UI. Tests on the store functions.
*Complexity: 4 files×2 + ~200 LOC×3 + 0 deps + new tables×5 + no breaking + no security surface + internal = ~8+9+15+3 = **~35, COMPLEX** → design doc is this section; it stays one PR because it is additive-only with no live consumers.*

**Phase 2 — Create + verify.** `/availability/new`, `createPoll`, magic-link verification, `src/lib/email.ts` generalised to take a `to`, Zod schemas, honeypot, rate limiting (`src/lib/rate-limit.ts` + Upstash), Turnstile on creation + the CSP entries. Poll exists and goes live; nobody can vote yet.
*Complexity: 6 files×2 + ~400 LOC×3 + 2 deps×3 + no migration + no breaking + new auth flow×3 + customer-facing×4 = 12+9+6+15+16 = **~58, EPIC** → split: **2a** rate limiting + Turnstile + CSP as its own PR (a standalone security control the whole site benefits from), **2b** create + verify + email.*

**Phase 3 — Participant voting.** `/availability/p/[token]`, vertical slot cards, radiogroup per option, three states with glyphs, aggregate counts only, `submitResponse`, edit link email, GDPR notice, `Referrer-Policy: no-referrer`. **This is the phase that makes the tool useful.**
*Complexity: 5 files×2 + ~450 LOC×3 + 1 dep (radio-group)×3 + no migration + no breaking + no new auth + customer-facing×4 = 10+9+3+16 = **~38, COMPLEX** → keep as one PR; the card component and the action are inseparable.*

**Phase 4 — Organiser results + confirm.** `/availability/o/[token]`, semantic `<table>` matrix with sticky header/first column, close/delete controls, `confirmOption`, the fan-out email with time-in-words + `.ics` + Add-to-Calendar links, digested organiser notifications. Poll URL stays live post-confirmation.
*Complexity: 5 files×2 + ~450 LOC×3 + 1 dep (ics)×3 + no migration + no breaking + no new auth + customer-facing×4 = 10+9+3+16 = **~38, COMPLEX** → one PR.*

**Phase 5 — Retention + polish.** Vercel cron (`crons` key in `vercel.json` — none exists today) + a token-protected route to auto-delete polls past `expires_at`. Nav entry in `content/data/navigation.json`. Conversion events wired to the dashboard. Optionally reminders to non-responders.
*Complexity: 3 files×2 + <100 LOC×1 + 0 deps + no migration + no breaking + auth check×3 + internal×2 = 6+1+9+8 = **~24, MEDIUM**.*

Phases 0, 1 and 2a are prerequisites for everything. 3 depends on 1. 4 depends on 3. 5 depends on 1.

---

## 10. Open decisions for Peter

1. **Build it, or pay Rallly Cloud Pro $56/year?** — *Recommendation: only build if this is a client-facing differentiator you'll point licensees at. If it's an internal convenience for arranging your own meetings, take the $56 and close this document.* Building is 2–4 weeks and takes on timezone, spam, email-reputation and GDPR risk that the SaaS absorbs entirely.

   **The cost gap, stated in money rather than adjectives.** At the standard £75/hr rate, 2–4 weeks of build is roughly **£6,000–£12,000** of billable capacity — *before* ongoing maintenance. Rallly Cloud Pro is **~£44/year**. The build is therefore in the order of **140–270× the annual cost of the alternative**, and would take **over a century** of Rallly subscriptions to break even on the build alone. That maths does not decide it — a client-facing differentiator can be worth £12k of positioning, and this is opportunity cost rather than cash out of the door — but the decision should be taken with the number visible, not the vibe. If the honest answer to "will I point licensees at this?" is anything short of a confident yes, the £44 wins by two orders of magnitude.

   **Running costs of the build, which are not zero and are not yet quantified:**

   | Item | Status |
   |---|---|
   | Upstash (rate limiting) | Free tier likely sufficient at this volume; **unverified** |
   | Cloudflare Turnstile | Free |
   | Resend | **Needs checking** — the free tier is 100 emails/day / 3,000/month, and a confirm fan-out emails *everyone invited*. A handful of live polls could contend with real client mail on the same account |
   | Vercel cron (Phase 5 retention) | **Needs checking** — Hobby is limited to 2 cron jobs at daily granularity; confirm the account's plan before designing the sweep |
   | Supabase | Existing project, no incremental cost |

2. **Are you the controller or the processor?** — *Recommendation: controller. It's your tool on your own site, and you decide the purpose.* If a licensee-client decides the purpose instead, you're a processor and need a DPA. This must be settled before any build, because it changes the privacy notice.

3. **Show aggregate counts only during voting, or per-person votes?** — *Recommendation: aggregate counts only.* The 14M-vote Doodle analysis shows open polls push people toward very popular and very unpopular slots and starve the intermediate ones. Aggregate keeps the signal, dampens the anchoring. This shapes the data model, so decide before Phase 1.

4. **Hard cap of 8 options — acceptable?** — *Recommendation: yes, cap at 8.* The Togedule evidence is that large option sets make people silently omit real availability, and cutting the count is far cheaper than engineering a better mobile grid. Doodle's free tier gives 10; ours would give 8 but free, ad-free and account-free.

5. **`db/migrations/` and `supabase/migrations/` are byte-identical duplicates kept in sync by hand — resolve or maintain?** — *Recommendation: delete `db/migrations/` and `scripts/migrate-db.ts`.* `supabase/migrations/` is what actually built the live schema; the custom runner has never run against this database and can't (`DATABASE_URL` is unset). Nothing keeps the two in sync — it's a live footgun. This is a deletion, so it needs your explicit yes.

6. **Emails to poll participants go out on the orangejelly.co.uk sending domain — accept the reputation exposure?** — *Recommendation: yes, but only with organiser email verification plus rate limiting in place first (Phase 2a before 2b).* An unverified open invite form is an open relay for your sending domain and would damage deliverability for real client work.

7. **The GPL/AGPL gate — do you want to exercise it, or uphold it?** *(This is the decision the workspace rule actually reserves for you; §2 recommends but cannot settle it.)* — *Recommendation: uphold it. Do not take AGPL code.* Three routes exist and only you can pick:
   - **Uphold (recommended).** Build from scratch, or use Parachute (MIT). No licence risk.
   - **Unmodified Rallly, self-hosted on a separate domain.** AGPL §13 is not triggered by *running* unmodified software (§0 carves out "executing it on a computer"), so this is compliant — but it forfeits the branding and the URL, which are the entire rationale for the project. It also hits Rallly's own commercial gate (see Unknowns).
   - **Fork and restyle Rallly.** Restyling *is* modification, so §13 obliges you to publish your complete source under AGPL to every network user. Competitors could take the themed build. **This is the option the rule exists to stop; taking it needs your explicit, recorded yes.**

8. **Retention window — how many days of inactivity before a poll auto-deletes?** — *Recommendation: 60 days after the last response or the last option date, whichever is later.* This is currently listed only as an unknown, but it is a decision, not a fact to look up: it is your call and it must be stated in the privacy notice before Phase 2 ships, because the notice is a GDPR Article 14 obligation and cannot say "TBC". `expires_at` is already in the schema; it just needs a number.

---

## Unknowns — needs decision or verification

- **Whether Rallly's free "single-user instance" self-host tier covers one organiser + anonymous responders** — unverified; needs vendor confirmation. Only matters if self-hosting re-enters scope.
- **Framadate's current licence on Framagit** — unverified. The CeCILL-B reading is from the archived 2014 GitHub snapshot only.
- **SavvyCal Basic-tier price, and whether brand removal is Premium-only** — the pricing table was ambiguous.
- **Doodle's current free-tier slot limits and paywall boundaries** — verified 16 July 2026, but they have changed twice in 18 months. Re-verify before citing publicly.
- **Retention window (`expires_at`)** — promoted out of this list; it is a decision, not an unknown. See §10 decision 8.
- **Resend's current plan limits on this account, and whether poll mail should use a separate sending subdomain** — unverified. Relevant to §10 decision 1 and to the deliverability risk in §7.
- **The Vercel plan's cron limits** — unverified; constrains the Phase 5 retention sweep.
- **Trustpilot/Capterra complaint themes** — both returned HTTP 403 to direct fetch; those quotes are reported secondhand via search results.
- **The three-state model's benefit** — Togedule is design rationale plus qualitative formative evidence, **not** a controlled two-state vs three-state trial. No such head-to-head appears to exist publicly.
