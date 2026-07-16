-- Realign confirm_notify_failures with the spec: a count, not a delivery record.
-- Peter approved the drop on 16 July 2026.
--
-- 20260716160000 applied this column as `jsonb default '[]'`, intended to hold
-- the addresses the confirmation fan-out could not reach. The spec asks for an
-- integer count in three places, and the count is all the organiser's on-screen
-- note actually needs ("We couldn't reach 2 of the 9 people"). The total is
-- derivable from poll_participants at render time, so no second column.
--
-- The jsonb shape is the worse of the two independently of the mismatch: it
-- stores people's email addresses for no stated purpose and with no retention
-- rule attached. A count carries no personal data at all.
--
-- DROP COLUMN safety audit, run against the live database before writing this:
--   poll rows                              0
--   functions referencing the column       0
--   views on polls                         0
--   triggers referencing the column        0  (the one trigger sets updated_at)
-- The drop is therefore lossless.

alter table polls drop column if exists confirm_notify_failures;

alter table polls
  add column if not exists confirm_notify_failures integer not null default 0;

comment on column polls.confirm_notify_failures is
  'Count of confirmation fan-out recipients that could not be reached. Drives the organiser''s status note. Never stores addresses — no personal data, no retention obligation.';
