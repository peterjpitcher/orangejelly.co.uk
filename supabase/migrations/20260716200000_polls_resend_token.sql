-- Availability polls — the resend capability token.
--
-- Assigned by the orchestrator after Stream C flagged that SPEC §3.4.1 named
-- this column but no stream owned it. Left unassigned, the "Send it again"
-- control on the check-your-inbox screen would have shipped pointing at nothing.
--
-- Why a fourth token rather than reusing one we already have:
--
-- createPoll deliberately returns no poll id and no organiser token — the whole
-- point of the draft state is that nothing capability-bearing reaches the page
-- before the address is proven. So the success screen holds no handle it could
-- use to ask for another email. This token is that handle, and nothing else: it
-- can only cause the verification email to be sent again, to the address already
-- on the poll. It cannot read the poll, cannot open it, and cannot organise it.
--
-- It cannot be keyed on the email address instead: multiple drafts per address
-- are allowed by design (there is no uniqueness on organiser_email), so an email
-- key would resend for whichever draft happened to match.
--
-- resend_last_sent_at backs a cooldown, so the control cannot be leaned on to
-- mail the same address repeatedly — the one thing an unauthenticated resend
-- button is actually good for if left unguarded.
--
-- Additive and nullable. Both are nulled on verification alongside verify_token,
-- so a verified poll carries no resend capability at all.

alter table polls add column if not exists resend_token        text unique;
alter table polls add column if not exists resend_last_sent_at timestamptz;

create index if not exists polls_resend_token_idx
  on polls (resend_token)
  where resend_token is not null;

comment on column polls.resend_token is
  'Single-purpose capability token for re-sending the verification email to the address already on the poll. Confers nothing else — not read, not organiser. Nulled on verification.';
comment on column polls.resend_last_sent_at is
  'Backs the resend cooldown. Without it an unauthenticated control can be used to mail one address repeatedly.';
