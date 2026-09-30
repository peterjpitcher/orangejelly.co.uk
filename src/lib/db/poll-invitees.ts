import { randomUUID } from 'crypto';
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from './supabase-admin';
import { generateToken } from '@/lib/poll-tokens';
import { MAX_INVITEES_PER_POLL } from '@/lib/validation/poll-invitees';
import type { OptionKind, PollStatus, StoredResult } from './polls';

/**
 * Data access for poll invitations: the people a signed-in admin asked us to
 * email, each with a personal link. See migration 20260930113639.
 *
 * Service-role only, like the rest of the poll data. Who may invite is decided
 * in the server actions (signed-in admin, on their own poll); nothing here
 * checks it, so nothing here may be called from a path that has not.
 */

/** Sentinel for a lookup that matched nothing. Mapped to copy by the caller. */
export const INVITEE_NOT_FOUND = 'INVITEE_NOT_FOUND';

/** Sentinel for an add that would take the poll past MAX_INVITEES_PER_POLL. */
export const TOO_MANY_INVITEES = 'TOO_MANY_INVITEES';

export interface InviteeRow {
  id: string;
  poll_id: string;
  email: string;
  invite_token: string;
  participant_id: string | null;
  invited_at: string | null;
  reminded_at: string | null;
  opted_out_at: string | null;
  created_at: string;
}

const INVITEE_COLUMNS =
  'id, poll_id, email, invite_token, participant_id, invited_at, reminded_at, opted_out_at, created_at';

function requireAdminClient() {
  if (!isSupabaseAdminConfigured()) {
    throw new Error('Poll database is not configured.');
  }
  return getSupabaseAdminClient();
}

export function normaliseInviteeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error.';
}

/**
 * Adds people to a poll's invite list. Addresses already on it are skipped, not
 * duplicated, so pasting the same list twice is harmless.
 *
 * Someone who has already answered through the shared link with the same address
 * is linked to that answer on the way in. They count as answered, and the
 * sender never invites them, because being asked for something you already gave
 * reads as a system that is not paying attention.
 */
export async function addInvitees(
  pollId: string,
  emails: string[]
): Promise<StoredResult<{ added: InviteeRow[]; alreadyInvited: number }>> {
  try {
    const supabase = requireAdminClient();
    const wanted = [...new Set(emails.map(normaliseInviteeEmail).filter(Boolean))];

    const [{ data: existing, error: existingError }, { data: participants }] = await Promise.all([
      supabase.from('poll_invitees').select('email').eq('poll_id', pollId),
      supabase
        .from('poll_participants')
        .select('id, email, created_at')
        .eq('poll_id', pollId)
        .not('email', 'is', null)
        .order('created_at'),
    ]);

    if (existingError) return { stored: false, error: existingError.message };

    const already = new Set((existing ?? []).map((row) => row.email as string));
    const fresh = wanted.filter((email) => !already.has(email));

    if (already.size + fresh.length > MAX_INVITEES_PER_POLL) {
      return { stored: false, error: TOO_MANY_INVITEES };
    }
    if (fresh.length === 0) {
      return { stored: true, data: { added: [], alreadyInvited: wanted.length } };
    }

    // The earliest answer under each address, matching how the organiser sees them.
    const answeredBy = new Map<string, string>();
    for (const row of (participants ?? []) as Array<{ id: string; email: string }>) {
      const email = normaliseInviteeEmail(row.email);
      if (!answeredBy.has(email)) answeredBy.set(email, row.id);
    }

    const { data: inserted, error } = await supabase
      .from('poll_invitees')
      .insert(
        fresh.map((email) => ({
          id: randomUUID(),
          poll_id: pollId,
          email,
          invite_token: generateToken(),
          participant_id: answeredBy.get(email) ?? null,
        }))
      )
      .select(INVITEE_COLUMNS);

    if (error) return { stored: false, error: error.message };

    return {
      stored: true,
      data: {
        added: (inserted ?? []) as InviteeRow[],
        alreadyInvited: wanted.length - fresh.length,
      },
    };
  } catch (error) {
    return { stored: false, error: errorMessage(error) };
  }
}

/** A poll's invite list, oldest first, for the organiser's page. */
export async function listInvitees(pollId: string): Promise<InviteeRow[]> {
  const { data, error } = await requireAdminClient()
    .from('poll_invitees')
    .select(INVITEE_COLUMNS)
    .eq('poll_id', pollId)
    .order('created_at')
    .order('email');

  if (error) throw new Error(error.message);
  return (data ?? []) as InviteeRow[];
}

/**
 * The invitations still to go: not sent, not answered, not opted out.
 *
 * What the sender works through when a poll goes live, and again when the
 * organiser asks us to retry the ones that failed.
 */
export async function listUnsentInvitees(pollId: string): Promise<InviteeRow[]> {
  const { data, error } = await requireAdminClient()
    .from('poll_invitees')
    .select(INVITEE_COLUMNS)
    .eq('poll_id', pollId)
    .is('invited_at', null)
    .is('participant_id', null)
    .is('opted_out_at', null)
    .order('created_at');

  if (error) throw new Error(error.message);
  return (data ?? []) as InviteeRow[];
}

/** Stamps an invitation as sent. Only ever after Resend accepted it. */
export async function markInvited(inviteeId: string): Promise<void> {
  const { error } = await requireAdminClient()
    .from('poll_invitees')
    .update({ invited_at: new Date().toISOString() })
    .eq('id', inviteeId);

  if (error) throw new Error(error.message);
}

/** Removes one person from a poll's list. Their answer, if any, stays. */
export async function removeInvitee(pollId: string, inviteeId: string): Promise<StoredResult> {
  try {
    const { data, error } = await requireAdminClient()
      .from('poll_invitees')
      .delete()
      .eq('poll_id', pollId)
      .eq('id', inviteeId)
      .select('id')
      .maybeSingle();

    if (error) return { stored: false, error: error.message };
    if (!data) return { stored: false, error: INVITEE_NOT_FOUND };
    return { stored: true };
  } catch (error) {
    return { stored: false, error: errorMessage(error) };
  }
}

/** What an invite link resolves to. */
export interface InviteView {
  invitee: InviteeRow;
  poll: {
    id: string;
    title: string;
    status: PollStatus;
    option_kind: OptionKind;
    participant_token: string;
    closes_at: string | null;
    expires_at: string;
  };
  /** The participant's edit token, once this person has answered. */
  editToken: string | null;
}

/**
 * Resolves a personal invite link. Null for an unknown token and for a poll
 * that is not live, which is one outcome, so a guesser learns nothing.
 */
export async function getInviteByToken(inviteToken: string): Promise<InviteView | null> {
  const supabase = requireAdminClient();

  const { data: invitee } = await supabase
    .from('poll_invitees')
    .select(INVITEE_COLUMNS)
    .eq('invite_token', inviteToken)
    .maybeSingle();

  if (!invitee) return null;
  const row = invitee as InviteeRow;

  const [{ data: poll }, { data: participant }] = await Promise.all([
    supabase
      .from('polls')
      .select('id, title, status, option_kind, participant_token, closes_at, expires_at')
      .eq('id', row.poll_id)
      .maybeSingle(),
    row.participant_id
      ? supabase
          .from('poll_participants')
          .select('edit_token')
          .eq('id', row.participant_id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  if (!poll || poll.status === 'draft') return null;
  if (new Date(poll.expires_at as string).getTime() <= Date.now()) return null;

  return {
    invitee: row,
    poll: poll as InviteView['poll'],
    editToken: (participant as { edit_token?: string } | null)?.edit_token ?? null,
  };
}

/**
 * The invitee's own switch: stop, or restart, emails about this one poll.
 * Idempotent both ways, because a mail client may send the one-click POST twice.
 */
export async function setInviteeOptOut(
  inviteToken: string,
  optOut: boolean
): Promise<StoredResult> {
  try {
    const { data, error } = await requireAdminClient()
      .from('poll_invitees')
      .update({ opted_out_at: optOut ? new Date().toISOString() : null })
      .eq('invite_token', inviteToken)
      .select('id')
      .maybeSingle();

    if (error) return { stored: false, error: error.message };
    if (!data) return { stored: false, error: INVITEE_NOT_FOUND };
    return { stored: true };
  } catch (error) {
    return { stored: false, error: errorMessage(error) };
  }
}

/**
 * Ties a fresh answer to the invitee it came from, so the organiser sees who has
 * answered and the reminder skips them.
 *
 * By invite token when they came through their own link. Otherwise by address:
 * someone invited by email who answers through the shared link instead is the
 * same person, and treating them as a non-responder would earn them a reminder
 * for something they already did.
 */
export async function linkInviteeToParticipant(input: {
  pollId: string;
  participantId: string;
  inviteToken?: string;
  email?: string | null;
}): Promise<void> {
  const supabase = requireAdminClient();

  if (input.inviteToken) {
    const { error } = await supabase
      .from('poll_invitees')
      .update({ participant_id: input.participantId })
      .eq('poll_id', input.pollId)
      .eq('invite_token', input.inviteToken);
    if (error) throw new Error(error.message);
    return;
  }

  if (!input.email) return;

  const { error } = await supabase
    .from('poll_invitees')
    .update({ participant_id: input.participantId })
    .eq('poll_id', input.pollId)
    .eq('email', normaliseInviteeEmail(input.email))
    .is('participant_id', null);
  if (error) throw new Error(error.message);
}
