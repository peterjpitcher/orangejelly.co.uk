-- Availability polls — the agenda field.
-- Peter's decision, 16 July 2026: free text, not a structured item list.
--
-- Distinct from `description` on purpose. `description` is the one-line "what
-- this is about" that frames the invitation; `agenda` is what will actually be
-- discussed. Someone deciding whether they can make Tuesday wants both, and
-- collapsing them into one box means the agenda is missing from the calendar
-- invite, which is the moment it is most useful.
--
-- Additive and nullable. Existing rows are unaffected; there are none yet.

alter table polls add column if not exists agenda text;

comment on column polls.agenda is
  'Optional free-text agenda. Shown on the vote page and carried into the .ics DESCRIPTION so it is present in the calendar entry on the day.';
