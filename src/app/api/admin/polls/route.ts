import { NextResponse } from 'next/server';

import { requireAdmin } from '@/lib/admin-auth';
import { getSupabaseAdminClient } from '@/lib/db/supabase-admin';
import { formatOptionForEmail } from '@/lib/poll-emails/formatOptionForEmail';
import { deadlinePassed } from '@/lib/poll-state';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// Without this the poll list is stale. supabase-js reads through fetch, which
// Next caches in the Data Cache, so a poll the organiser had just closed still
// showed as "Taking answers" on the dashboard. force-no-store keeps the list
// live, so status always reflects reality. Same fix as the results page.
export const fetchCache = 'force-no-store';

/**
 * The signed-in organiser's list of polls, for the /availability dashboard.
 *
 * This returns organiser tokens, which are the strongest capability the poll
 * feature issues: whoever holds one can confirm the time, delete responses and
 * delete the poll. So the endpoint sits behind the shared gate every /api/admin
 * route uses, `requireAdmin`, and never an inline copy of it.
 *
 * ONLY THE ADMIN'S OWN POLLS. `/availability/new` is public, so the table also
 * holds polls members of the public set up, with their organiser tokens. Until
 * 29 September 2026 this listed all of them, which handed every stranger's poll
 * controls to the dashboard. The dashboard says "every poll you have set up",
 * and now that is what it gets: polls whose organiser address is the one
 * Supabase verified for this session. Addresses are stored lowercased
 * (normaliseEmail in the data layer), so the comparison is too.
 */
export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if ('response' in auth) return auth.response;

  const supabase = getSupabaseAdminClient();

  const { data: polls, error } = await supabase
    .from('polls')
    .select(
      'id, title, status, closes_at, entries_close_at, organiser_token, participant_token, option_kind, confirmed_option_id, expires_at, created_at'
    )
    .eq('organiser_email', auth.email.trim().toLowerCase())
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: 'Could not load polls.' }, { status: 500 });
  }

  const ids = (polls ?? []).map((p) => p.id);

  // The chosen time for confirmed polls, so the dashboard can show the outcome
  // on the card rather than making the organiser open the poll to remember it.
  const confirmedLabelByPoll = new Map<string, string>();
  const confirmedOptionIds = (polls ?? [])
    .map((p) => p.confirmed_option_id)
    .filter((value): value is string => Boolean(value));

  if (confirmedOptionIds.length > 0) {
    const { data: confirmedOptions } = await supabase
      .from('poll_options')
      .select('id, poll_id, option_date, starts_at, ends_at')
      .in('id', confirmedOptionIds);

    const pollById = new Map((polls ?? []).map((p) => [p.id, p]));
    for (const option of confirmedOptions ?? []) {
      const poll = pollById.get(option.poll_id);
      if (!poll) continue;
      confirmedLabelByPoll.set(
        poll.id,
        formatOptionForEmail({
          optionKind: poll.option_kind,
          optionDate: option.option_date,
          startsAt: option.starts_at,
          endsAt: option.ends_at,
        })
      );
    }
  }

  // One query for every response row, counted in memory. A poll list is small
  // (one organiser's polls), so this is cheaper than a count per poll.
  const responderByPoll = new Map<string, Set<string>>();
  if (ids.length > 0) {
    const { data: responses } = await supabase
      .from('poll_responses')
      .select('poll_id, participant_id')
      .in('poll_id', ids);

    for (const row of responses ?? []) {
      const set = responderByPoll.get(row.poll_id) ?? new Set<string>();
      set.add(row.participant_id);
      responderByPoll.set(row.poll_id, set);
    }
  }

  const items = (polls ?? []).map((p) => ({
    id: p.id,
    title: p.title,
    // An open poll past its deadline takes no answers (Peter, 30 September
    // 2026), so the dashboard shows it as closed rather than "Taking answers".
    status: deadlinePassed(p) ? 'closed' : p.status,
    optionKind: p.option_kind,
    organiserToken: p.organiser_token,
    participantToken: p.participant_token,
    responderCount: responderByPoll.get(p.id)?.size ?? 0,
    confirmedLabel: confirmedLabelByPoll.get(p.id) ?? null,
    createdAt: p.created_at,
    expiresAt: p.expires_at,
  }));

  return NextResponse.json({ polls: items });
}
