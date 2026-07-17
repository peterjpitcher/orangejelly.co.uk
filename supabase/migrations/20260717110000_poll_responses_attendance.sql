-- Availability polls: how someone would attend, not just whether they can.
-- Peter's addition, 17 July 2026: a yes (or an if-need-be) now also says whether
-- that availability is in person or needs a video call or dial-in. The organiser
-- can then see not only which time wins but whether the winning time is a table
-- in the pub or a laptop on the bar.
--
-- A second column rather than richer availability values, deliberately. Folding
-- the mode into the state ('yes_in_person', 'yes_virtual', ...) doubles the
-- state space, breaks the CHECK constraint every existing row satisfies, and
-- entangles two questions the UI asks separately. Attendance qualifies a yes;
-- it is not a different kind of yes.
--
-- Nullable, and null on a 'no' by rule: someone who cannot make a time has no
-- attendance mode for it. Existing rows stay null, which reads correctly as
-- "recorded before we asked".

alter table poll_responses add column if not exists attendance text
  check (attendance in ('in_person', 'virtual'));

comment on column poll_responses.attendance is
  'How the participant would attend, qualifying a yes or an if-need-be. Null on a no, and null on rows recorded before the question existed.';
