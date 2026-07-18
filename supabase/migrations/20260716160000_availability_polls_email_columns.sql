-- Availability polls — columns required by the email and verification flows.
-- Spec: tasks/availability-poll/SPEC.md §4.7
--
-- A follow-up rather than an edit to 20260716150000_availability_polls.sql,
-- because that migration is already applied to production. Every column here is
-- nullable or carries a default, so this is additive and cannot affect existing
-- rows. There are no poll rows yet in any case.

-- Verification. A THIRD token, independent of participant_token and
-- organiser_token. The verify link is the one that lands in an unverified inbox
-- and is the most likely of any to be forwarded on, so it must not carry
-- organiser capability. Nulled on use, which makes the link single-use.
alter table polls add column if not exists verify_token            text unique;
alter table polls add column if not exists verify_token_expires_at timestamptz;

-- Digest bookkeeping. The organiser is notified of new responses in a digest,
-- never one email per vote. digest_pending_since marks the oldest un-notified
-- response; last_digest_at stops a re-send.
alter table polls add column if not exists last_digest_at        timestamptz;
alter table polls add column if not exists digest_pending_since  timestamptz;

-- Confirmation bookkeeping. confirm_sequence is the iCalendar SEQUENCE for the
-- .ics; a calendar client ignores an update that does not increment it.
-- confirm_notify_failures records addresses the fan-out could not reach, so the
-- organiser can be told to pass the details on by hand rather than assuming
-- everyone knows.
alter table polls add column if not exists confirm_sequence        integer not null default 0;
alter table polls add column if not exists confirm_notify_failures jsonb   not null default '[]'::jsonb;

-- Nudge and opt-out. digest_opt_out is checked before any digest or nudge:
-- both are recurring mail and need a one-click unsubscribe to satisfy Gmail's
-- bulk-sender rules.
alter table polls add column if not exists nudge_sent_at   timestamptz;
alter table polls add column if not exists digest_opt_out  boolean not null default false;

-- Partial: the sweep only ever looks for tokens that still exist.
create index if not exists polls_verify_token_idx
  on polls (verify_token)
  where verify_token is not null;

-- Drives the 24-hour unverified-draft sweep without a full scan.
create index if not exists polls_draft_created_at_idx
  on polls (created_at)
  where status = 'draft';

comment on column polls.verify_token is
  'Single-use magic-link token, independent of participant_token and organiser_token. Nulled on verification.';
comment on column polls.confirm_sequence is
  'iCalendar SEQUENCE for the .ics attachment. Must increment on any re-issue or calendar clients ignore the update.';
comment on column polls.digest_opt_out is
  'Organiser has unsubscribed from digests and nudges. Checked before every non-transactional send.';
