-- Availability polls — rate limiting counters. Phase 2a.
-- Scope: tasks/availability-poll/SPEC.md §3.4
--
-- The limiter runs on Postgres. No Redis, no Upstash, no new vendor (Peter's
-- decision, 16 July 2026). The honest trade-off, recorded once: a database round
-- trip costs roughly 30ms more than a Redis one. On a form a human submits once,
-- that is invisible. It is not free and it is not a problem; it is the price of
-- not onboarding a vendor for nine counters.
--
-- Conventions follow 20260716150000_availability_polls.sql: timestamptz,
-- snake_case, <table>_<cols>_idx index naming, RLS enabled with no policies.

-- One row per (bucket, key, window).
--
-- Fixed windows, not sliding: a fixed window is one primary-key upsert, whereas a
-- sliding window needs a row per hit plus a range count. The cost of that choice
-- is a burst of at most 2x the limit across a window boundary. For "3 polls an
-- hour" that is not worth a table which grows per request.
create table if not exists poll_rate_limits (
  bucket        text        not null,
  key           text        not null,
  window_start  timestamptz not null,
  count         integer     not null default 0,
  primary key (bucket, key, window_start)
);

-- Supports the retention sweep, which deletes by window_start. The sweep itself
-- belongs to the Phase 5 cron and is deliberately not created here.
create index if not exists poll_rate_limits_window_start_idx
  on poll_rate_limits (window_start);

alter table poll_rate_limits enable row level security;
-- Deliberately zero policies, exactly like the four poll tables: anon and
-- authenticated can neither read nor write, and only the service-role key
-- reaches this table from trusted server code.

comment on table poll_rate_limits is
  'Server-only rate-limit counters. RLS enabled with no policies; reached only by the service-role key. `key` is always a peppered SHA-256 — never a raw IP or email address.';
comment on column poll_rate_limits.key is
  'Peppered SHA-256 of the identifier (IP, email, or poll id), truncated to 32 hex chars. Never the raw value: an unpeppered hash of an IP or an address is reversible by brute force, so storing one would mean storing personal data.';

/**
 * Atomic increment. Returns the count AFTER this hit.
 *
 * This MUST be a database function. A read-then-write in TypeScript races: two
 * concurrent requests both read 2, both write 3, and a limit of 3 admits four
 * requests. The insert below is a single statement holding a row lock, and
 * cannot race.
 *
 * `security invoker` because the only caller is the service-role key, which
 * already bypasses RLS — `security definer` would grant privilege this function
 * has no use for.
 *
 * `set search_path = ''` is deliberate, matching public.set_updated_at(): without
 * it Supabase's advisor raises function_search_path_mutable, and a mutable
 * search_path is a real, if narrow, privilege-escalation vector. It is why every
 * identifier below is schema-qualified.
 *
 * NOTE FOR THE READER: this is the second and last Postgres function in the
 * feature. Everything else deliberately keeps logic in the application. This one
 * exists because atomicity is the entire point of a counter, and supabase-js has
 * no transaction.
 */
create or replace function public.poll_rate_limit_hit(
  p_bucket          text,
  p_key             text,
  p_window_seconds  integer
) returns integer
language sql
security invoker
set search_path = ''
as $$
  insert into public.poll_rate_limits (bucket, key, window_start, count)
  values (
    p_bucket,
    p_key,
    -- Floor now() to the start of the current fixed window. Every caller inside
    -- the same window computes the same boundary, so they collide on the primary
    -- key and increment one row.
    to_timestamp(floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds),
    1
  )
  on conflict (bucket, key, window_start)
    do update set count = public.poll_rate_limits.count + 1
  returning count;
$$;

-- Only the service-role key may count. anon and authenticated have no business
-- reaching the limiter directly — being able to call this is being able to
-- exhaust someone else's bucket.
revoke all on function public.poll_rate_limit_hit(text, text, integer) from public;
revoke all on function public.poll_rate_limit_hit(text, text, integer) from anon;
revoke all on function public.poll_rate_limit_hit(text, text, integer) from authenticated;

comment on function public.poll_rate_limit_hit(text, text, integer) is
  'Atomically increments the (bucket, key, current-window) counter and returns the new count. Single statement by design: a read-then-write in application code races under concurrency and admits more requests than the limit allows.';
