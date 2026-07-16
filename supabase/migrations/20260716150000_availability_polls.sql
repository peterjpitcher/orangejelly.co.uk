-- Availability polls ("Doodle for Orange Jelly") — Phase 1 schema.
-- Scope: tasks/availability-poll/SCOPE.md
--
-- Conventions follow the existing lead-data layer exactly: uuid primary keys with
-- no database default (the app generates them via randomUUID() and passes them
-- in), timestamptz defaults, snake_case columns, <table>_<cols>_idx index naming,
-- and RLS enabled with no policies so only the service-role key reaches the data.
--
-- Two deliberate departures from the existing schema, both justified:
--   1. Real foreign keys. The lead tables use a polymorphic owner_type/owner_id
--      pair with no FKs. Poll data is genuinely relational and a dangling vote is
--      a correctness bug, so this improves on that pattern rather than copying it.
--   2. An updated_at trigger. The existing tables maintain timestamps by hand and
--      inconsistently. Votes are mutable, so a trigger is warranted.

-- Shared trigger function for mutable rows.
-- `set search_path = ''` is deliberate: without it Supabase's advisor raises
-- function_search_path_mutable, and a mutable search_path on a trigger function
-- is a real, if narrow, privilege-escalation vector.
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
  -- Capability tokens, not identifiers: CSPRNG, base64url, >= 128 bits of
  -- entropy, and never derivable from each other or from the id.
  participant_token   text not null unique,
  organiser_token     text not null unique,
  -- 'dates' options are calendar days and must never touch a timezone
  -- conversion. 'slots' options are absolute instants. See src/lib/dateUtils.ts.
  option_kind         text not null check (option_kind in ('dates', 'slots')),
  -- IANA zone id for display. Never a fixed offset such as '+01:00', which
  -- breaks twice a year.
  timezone            text not null default 'Europe/London',
  status              text not null default 'draft'
                      check (status in ('draft', 'open', 'closed', 'confirmed')),
  confirmed_option_id uuid,
  email_verified_at   timestamptz,
  closes_at           timestamptz,
  -- GDPR retention. Set by the app to 60 days after the last response or the
  -- last option date, whichever is later. Swept by the Phase 5 cron.
  expires_at          timestamptz not null,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create table if not exists poll_options (
  id          uuid primary key,
  poll_id     uuid not null references polls(id) on delete cascade,
  -- Exactly one of option_date OR (starts_at, ends_at) is populated, determined
  -- by the parent poll's option_kind and enforced by the shape check below.
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
  -- Supports the composite FK from poll_responses.
  constraint poll_options_id_poll_id_key unique (id, poll_id)
);

alter table polls
  add constraint polls_confirmed_option_fk
  foreign key (confirmed_option_id) references poll_options(id) on delete set null;

create table if not exists poll_participants (
  id           uuid primary key,
  poll_id      uuid not null references polls(id) on delete cascade,
  display_name text not null,
  email        text,
  -- Lets a participant edit their own response from their own email link. The
  -- single most-requested thing missing from every comparable tool.
  edit_token   text not null unique,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  -- Supports the composite FK from poll_responses.
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
  -- Composite FKs, not simple ones. Three independent single-column FKs would
  -- happily accept a vote whose option_id belongs to poll A while poll_id says
  -- poll B — the exact dangling-vote bug these FKs exist to prevent.
  constraint poll_responses_poll_fk
    foreign key (poll_id) references polls(id) on delete cascade,
  constraint poll_responses_participant_fk
    foreign key (participant_id, poll_id)
    references poll_participants(id, poll_id) on delete cascade,
  constraint poll_responses_option_fk
    foreign key (option_id, poll_id)
    references poll_options(id, poll_id) on delete cascade
);

create index if not exists polls_created_at_idx          on polls (created_at desc);
create index if not exists polls_expires_at_idx          on polls (expires_at);
create index if not exists polls_organiser_email_idx     on polls (organiser_email);
create index if not exists poll_options_poll_id_idx      on poll_options (poll_id, position);
create index if not exists poll_participants_poll_id_idx on poll_participants (poll_id);
create index if not exists poll_responses_poll_id_idx    on poll_responses (poll_id);
create index if not exists poll_responses_option_id_idx  on poll_responses (option_id);

create trigger polls_set_updated_at
  before update on polls
  for each row execute function public.set_updated_at();
create trigger poll_participants_set_updated_at
  before update on poll_participants
  for each row execute function public.set_updated_at();
create trigger poll_responses_set_updated_at
  before update on poll_responses
  for each row execute function public.set_updated_at();

-- Server-only data. RLS enabled with no policies: anon and authenticated roles
-- can neither read nor write, and only the service-role key reaches these tables
-- from trusted server code. Matches the posture of the lead-data layer.
alter table polls             enable row level security;
alter table poll_options      enable row level security;
alter table poll_participants enable row level security;
alter table poll_responses    enable row level security;

comment on table polls is
  'Server-only availability poll data. RLS enabled with no policies; writes happen through trusted server code via the service-role key.';
comment on table poll_options is
  'Server-only poll options. Either a calendar date or an instant range, never both — see poll_options_shape_chk.';
comment on table poll_participants is
  'Server-only poll participants. Account-free: identified by an unguessable edit_token, not a login.';
comment on table poll_responses is
  'Server-only poll votes. Composite FKs guarantee a vote''s option and participant belong to the same poll as the vote.';
