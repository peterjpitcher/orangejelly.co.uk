-- How an answer was tied to an invitation.
--
-- 'link': the person answered through their own invite link, which proves they
-- are the person invited. 'email': someone answered on the shared link with the
-- same address, which anyone could type. Only 'link' lets the invite link offer
-- "change your answers", so typing someone else's address on the shared link
-- can neither take over their invitation nor lock them out of it. An independent
-- review found that gap on 30 September 2026, before the feature shipped.
--
-- No constraint ties this to participant_id: the foreign key clears
-- participant_id alone when an answer is deleted, and a stale value here then
-- means nothing, because every reader checks participant_id first.

alter table poll_invitees
  add column if not exists answered_via text
  constraint poll_invitees_answered_via_chk check (answered_via in ('link', 'email'));

comment on column poll_invitees.answered_via is
  'How participant_id was set: link (through the personal invite link) or email (the same address on the shared link). Only link unlocks editing from the invite link.';
