import { NextResponse } from 'next/server';

import { getAllowedAdminEmails, isAllowedAdmin } from '@/lib/admin-auth';
import { getSupabaseAdminClient } from '@/lib/db/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * The signed-in organiser's list of polls, for the /availability dashboard.
 *
 * This returns organiser tokens, which are the strongest capability the poll
 * feature issues: whoever holds one can confirm the time, delete responses and
 * delete the poll. So the endpoint is gated exactly like every other /api/admin
 * route: a bearer token verified WITH Supabase and checked against the email
 * allowlist. A member of the public cannot reach this list, and the dashboard
 * that renders it is only useful to the person who can.
 */
export async function GET(request: Request) {
  const allowedEmails = getAllowedAdminEmails();
  if (allowedEmails.length === 0) {
    return NextResponse.json({ error: 'Admin allowlist is not configured.' }, { status: 500 });
  }

  const token = request.headers
    .get('authorization')
    ?.replace(/^Bearer\s+/i, '')
    .trim();
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  const supabase = getSupabaseAdminClient();

  const { data: authData, error: authError } = await supabase.auth.getUser(token);
  if (authError || !authData.user) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }
  if (!isAllowedAdmin(authData.user.email, allowedEmails)) {
    return NextResponse.json({ error: 'Not authorised.' }, { status: 403 });
  }

  const { data: polls, error } = await supabase
    .from('polls')
    .select(
      'id, title, status, organiser_token, participant_token, option_kind, expires_at, created_at'
    )
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: 'Could not load polls.' }, { status: 500 });
  }

  const ids = (polls ?? []).map((p) => p.id);

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
    status: p.status,
    optionKind: p.option_kind,
    organiserToken: p.organiser_token,
    participantToken: p.participant_token,
    responderCount: responderByPoll.get(p.id)?.size ?? 0,
    createdAt: p.created_at,
    expiresAt: p.expires_at,
  }));

  return NextResponse.json({ polls: items });
}
