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

/**
 * How an answer was tied to an invitation. Only 'link' proves the person on the
 * invite link is the person who answered; 'email' means someone answered on
 * the shared link with the same address, which anyone could type.
 */
export type AnsweredVia = 'link' | 'email';

export interface InviteeRow {
  id: string;
  poll_id: string;
  email: string;
  invite_token: string;
  participant_id: string | null;
  answered_via: AnsweredVia | null;
  invited_at: string | null;
  reminded_at: string | null;
  opted_out_at: string | null;
  created_at: string;
}

const INVITEE_COLUMNS =
  'id, poll_id, email, invite_token, participant_id, answered_via, invited_at, reminded_at, opted_out_at, created_at';

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

    const [
      { data: existing, error: existingError },
      { data: participants, error: participantsError },
    ] = await Promise.all([
      supabase.from('poll_invitees').select('email').eq('poll_id', pollId),
      supabase
        .from('poll_participants')
        .select('id, email, created_at')
        .eq('poll_id', pollId)
        .not('email', 'is', null)
        .order('created_at'),
    ]);

    if (existingError) return { stored: false, error: existingError.message };
    // Not ignored: a failed read here would invite people who already answered.
    if (participantsError) return { stored: false, error: participantsError.message };

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

    // An upsert that ignores duplicates, so the same address added twice at once
    // (two tabs, a double tap) is skipped rather than failing the whole list on
    // the unique key. Two adds racing past the cap by a few is accepted: only a
    // signed-in admin can add, and the cap is a guard, not a quota.
    const { data: inserted, error } = await supabase
      .from('poll_invitees')
      .upsert(
        fresh.map((email) => {
          const participantId = answeredBy.get(email) ?? null;
          return {
            id: randomUUID(),
            poll_id: pollId,
            email,
            invite_token: generateToken(),
            participant_id: participantId,
            answered_via: participantId ? 'email' : null,
          };
        }),
        { onConflict: 'poll_id,email', ignoreDuplicates: true }
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

/**
 * Claims invitations for sending by stamping them first, in one conditional
 * update. Returns the ids this caller won.
 *
 * Two sends for one poll can overlap: an admin pressing "try again" in a second
 * tab while the first is still going. Both read the same unsent rows; only one
 * can stamp each, so nobody is emailed twice. A send that then fails is released
 * (releaseInvitees), putting the person back in the unsent set.
 */
export async function claimInvitees(inviteeIds: string[], claimedAt: string): Promise<Set<string>> {
  if (inviteeIds.length === 0) return new Set();

  const { data, error } = await requireAdminClient()
    .from('poll_invitees')
    .update({ invited_at: claimedAt })
    .in('id', inviteeIds)
    .is('invited_at', null)
    .is('participant_id', null)
    .is('opted_out_at', null)
    .select('id');

  if (error) throw new Error(error.message);
  return new Set(((data ?? []) as Array<{ id: string }>).map((row) => row.id));
}

/** Hands back claims whose email did not go, so they show as unsent and retry. */
export async function releaseInvitees(inviteeIds: string[], claimedAt: string): Promise<void> {
  if (inviteeIds.length === 0) return;

  const { error } = await requireAdminClient()
    .from('poll_invitees')
    .update({ invited_at: null })
    .in('id', inviteeIds)
    .eq('invited_at', claimedAt);

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
  /**
   * The participant's edit token, once this person has answered THROUGH THIS
   * LINK. Never for an answer matched by address: anyone on the shared link can
   * type someone else's address, and must not thereby hand that person's
   * invite link the power to edit their answer (or be locked out of their own).
   */
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
    row.participant_id && row.answered_via === 'link'
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
    // Overrides an earlier match by address: an answer through the person's own
    // link is the one that counts.
    const { error } = await supabase
      .from('poll_invitees')
      .update({ participant_id: input.participantId, answered_via: 'link' })
      .eq('poll_id', input.pollId)
      .eq('invite_token', input.inviteToken);
    if (error) throw new Error(error.message);
    return;
  }

  if (!input.email) return;

  const { error } = await supabase
    .from('poll_invitees')
    .update({ participant_id: input.participantId, answered_via: 'email' })
    .eq('poll_id', input.pollId)
    .eq('email', normaliseInviteeEmail(input.email))
    .is('participant_id', null);
  if (error) throw new Error(error.message);
}

/** An invitee whose reminder may be due, with the two poll facts that decide it. */
interface ReminderCandidate extends InviteeRow {
  polls: { status: string; entries_close_at: string | null } | null;
}

/** Hours before the organiser's deadline that the reminder goes. */
export const REMINDER_HOURS_BEFORE_DEADLINE = 48;

/** With no deadline, days after the invitation that the reminder goes. */
export const REMINDER_DAYS_WITHOUT_DEADLINE = 3;

/**
 * Never remind someone within this long of inviting them, however close the
 * deadline: two emails in an afternoon reads as nagging.
 */
export const REMINDER_MIN_HOURS_AFTER_INVITE = 24;

const HOUR_MS = 60 * 60 * 1000;

/**
 * The invitees whose one reminder is due. Peter's decision, 30 September 2026:
 * one reminder, to people who have not answered.
 *
 * Due means: invited, not answered, not opted out, not already reminded, on an
 * open poll, invited at least a day ago, and either the organiser's deadline is
 * within the next 48 hours, or there is no deadline and the invitation went
 * three days ago. A deadline that has passed gets no reminder: asking someone to
 * answer a poll that has stopped wanting answers is noise.
 *
 * PostgREST cannot express the either/or on the embedded poll, so the stable
 * part is filtered in SQL and the timing here. Nearest deadline first, so a
 * night with more due than `limit` sends the urgent ones.
 */
export async function findInviteesDueForReminder(
  limit: number,
  now: Date = new Date()
): Promise<InviteeRow[]> {
  const nowMs = now.getTime();
  const invitedBefore = new Date(nowMs - REMINDER_MIN_HOURS_AFTER_INVITE * HOUR_MS).toISOString();

  const { data, error } = await requireAdminClient()
    .from('poll_invitees')
    .select(`${INVITEE_COLUMNS}, polls!inner(status, entries_close_at)`)
    .is('participant_id', null)
    .is('opted_out_at', null)
    .is('reminded_at', null)
    .not('invited_at', 'is', null)
    .lt('invited_at', invitedBefore)
    .eq('polls.status', 'open')
    .order('invited_at')
    .limit(500);

  if (error) throw new Error(error.message);

  const due = ((data ?? []) as unknown as ReminderCandidate[])
    .map((row) => {
      const deadline = row.polls?.entries_close_at
        ? new Date(row.polls.entries_close_at).getTime()
        : null;
      const isDue =
        deadline !== null
          ? deadline > nowMs && deadline - nowMs <= REMINDER_HOURS_BEFORE_DEADLINE * HOUR_MS
          : new Date(row.invited_at as string).getTime() <=
            nowMs - REMINDER_DAYS_WITHOUT_DEADLINE * 24 * HOUR_MS;
      return { row, deadline, isDue };
    })
    .filter((entry) => entry.isDue)
    .sort(
      (a, b) => (a.deadline ?? Number.MAX_SAFE_INTEGER) - (b.deadline ?? Number.MAX_SAFE_INTEGER)
    );

  return due.slice(0, limit).map(({ row }) => {
    const { polls: _polls, ...invitee } = row;
    return invitee;
  });
}

/** Stamps the one reminder as sent. Only ever after Resend accepted it. */
export async function markReminded(inviteeId: string): Promise<void> {
  const { error } = await requireAdminClient()
    .from('poll_invitees')
    .update({ reminded_at: new Date().toISOString() })
    .eq('id', inviteeId);

  if (error) throw new Error(error.message);
}

/**
 * Who hears about a confirmed time beyond the people who answered.
 *
 * `unanswered`: invitees who were sent an invitation, never answered and never
 * asked us to stop. Peter's decision, 30 September 2026: they were invited, so
 * they are told the outcome.
 *
 * `stopped`: every address that asked us to stop, including the address an
 * opted-out invitee answered under if it differs, so the confirmation fan-out
 * can leave them out even though they are also participants.
 */
export async function getInviteeConfirmationAudience(
  pollId: string
): Promise<{ unanswered: string[]; stopped: Set<string> }> {
  const supabase = requireAdminClient();

  const { data, error } = await supabase
    .from('poll_invitees')
    .select('email, participant_id, invited_at, opted_out_at')
    .eq('poll_id', pollId);

  if (error) throw new Error(error.message);

  const rows = (data ?? []) as Array<
    Pick<InviteeRow, 'email' | 'participant_id' | 'invited_at' | 'opted_out_at'>
  >;

  const unanswered = rows
    .filter((row) => !row.participant_id && !row.opted_out_at && row.invited_at)
    .map((row) => normaliseInviteeEmail(row.email));

  const stopped = new Set(
    rows.filter((row) => row.opted_out_at).map((row) => normaliseInviteeEmail(row.email))
  );

  const stoppedParticipantIds = rows
    .filter((row) => row.opted_out_at && row.participant_id)
    .map((row) => row.participant_id as string);

  if (stoppedParticipantIds.length > 0) {
    const { data: participants } = await supabase
      .from('poll_participants')
      .select('email')
      .in('id', stoppedParticipantIds);
    for (const participant of (participants ?? []) as Array<{ email: string | null }>) {
      if (participant.email) stopped.add(normaliseInviteeEmail(participant.email));
    }
  }

  return { unanswered, stopped };
}
