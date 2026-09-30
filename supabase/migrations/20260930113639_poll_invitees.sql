-- Email invitations for availability polls.
--
-- Until now the poll had no address book on purpose: /availability/new is
-- public, and a list of addresses the organiser types in is what would let a
-- stranger use our sending domain to mail anyone. Peter decided on
-- 30 September 2026 to add invitations for signed-in admins only (the server
-- actions enforce that), with a personal link per person, one reminder, and
-- the confirmed time sent to everyone invited.
--
-- One row per person invited to one poll. The address is the organiser's to
-- give us, so every invitation carries an Article 14 notice, and the row goes
-- with the poll: `on delete cascade`, so the 60-day retention delete takes it.

create table if not exists poll_invitees (
  id              uuid primary key,
  poll_id         uuid not null references polls(id) on delete cascade,
  -- Normalised (trimmed, lowercased) by the data layer, so the unique key below
  -- catches the same person typed twice.
  email           text not null,
  -- The personal link: /availability/i/<invite_token>. A bearer capability like
  -- every other poll token, and resolved by exact match only.
  invite_token    text not null unique,
  -- Set once this person has answered, through their link or through the shared
  -- link with the same address. Set back to null if the organiser deletes that
  -- answer, so they read as "not answered" again. The composite key keeps a
  -- participant from another poll out; SET NULL names the one column to clear,
  -- because poll_id is not nullable.
  participant_id  uuid,
  -- Null until the invitation email has actually gone. A failed send leaves it
  -- null, which is what the organiser's page shows and retries.
  invited_at      timestamptz,
  -- The one reminder, stamped only after a successful send.
  reminded_at     timestamptz,
  -- The person asked us to stop emailing them about this poll.
  opted_out_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint poll_invitees_poll_email_key unique (poll_id, email),
  constraint poll_invitees_participant_fk
    foreign key (participant_id, poll_id)
    references poll_participants(id, poll_id)
    on delete set null (participant_id)
);

create index if not exists poll_invitees_poll_id_idx on poll_invitees (poll_id);

create trigger poll_invitees_set_updated_at
  before update on poll_invitees
  for each row execute function public.set_updated_at();

-- Server-only, like every other poll table. RLS with no policies stops anon and
-- authenticated; the revoke makes that true of the grants as well.
alter table poll_invitees enable row level security;

revoke all on table poll_invitees from anon, authenticated;

-- Granted explicitly rather than inherited, as the surveys migration explains:
-- newer Supabase defaults no longer grant new public tables to service_role.
grant select, insert, update, delete on table poll_invitees to service_role;

comment on table poll_invitees is
  'Server-only. People a signed-in admin invited to a poll by email: the address, the personal invite token, and whether they have answered, been reminded or opted out. Deleted with the poll.';
