-- Availability polls: an optional entry deadline that nudges the organiser.
-- Peter's decision, 17 July 2026: a deadline emails HIM to come and pick, then he
-- confirms and the invite goes out. Not an automatic send. A machine that fires
-- the invite the moment a counter passes a number will confirm the wrong date on
-- a tie, on a low turnout, or before the person the meeting is for has voted, and
-- un-inviting people is worse than a nudge.
--
-- entries_close_at is deliberately SEPARATE from closes_at, not a reuse of it.
-- closes_at records when the poll ACTUALLY closed (organiser action, or
-- confirmation). entries_close_at is a SCHEDULED future intent. One column
-- cannot mean both a past event and a future plan without the two colliding.
-- Reopening a poll nulls closes_at, and that must not erase a deadline the
-- organiser set. Keeping them apart is the whole point.
--
-- deadline_reminded_at stamps the one nudge. Without it the daily cron would
-- email the organiser every morning from the deadline until they got round to
-- confirming, which trains them to ignore the mail: the opposite of the intent.
--
-- Additive and nullable. A poll with no deadline behaves exactly as before.

alter table polls add column if not exists entries_close_at     timestamptz;
alter table polls add column if not exists deadline_reminded_at timestamptz;

-- Drives the cron's deadline pass: find open polls whose deadline has passed and
-- which have not yet been reminded, without scanning the table.
create index if not exists polls_deadline_due_idx
  on polls (entries_close_at)
  where entries_close_at is not null
    and deadline_reminded_at is null
    and status = 'open';

comment on column polls.entries_close_at is
  'Optional scheduled deadline for entries. When it passes, the cron emails the organiser to come and confirm. Distinct from closes_at, which is when the poll actually closed. Never triggers an automatic send.';
comment on column polls.deadline_reminded_at is
  'When the organiser was nudged that the deadline passed. Set once so the reminder does not repeat every day until they confirm.';
