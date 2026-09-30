'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { resolveAdminIdentity } from '@/lib/admin-identity';
import { getOrganiserView } from '@/lib/db/polls';
import {
  INVITEE_NOT_FOUND,
  TOO_MANY_INVITEES,
  addInvitees,
  removeInvitee,
  setInviteeOptOut,
} from '@/lib/db/poll-invitees';
import { sendPendingInvitations } from '@/lib/poll-invitations';
import { isWellFormedToken, scrubTokens } from '@/lib/poll-tokens';
import { checkRateLimit, getClientIp, hashKey } from '@/lib/rate-limit';
import { tokenSchema } from '@/lib/validation/poll-tokens';
import {
  MAX_INVITEES_PER_POLL,
  inviteEmailsFieldSchema,
  inviteEmailsProblem,
  parseInviteEmails,
} from '@/lib/validation/poll-invitees';
import { VALIDATION_MESSAGES } from '@/lib/validation-messages';

/**
 * Email invitations: the organiser's controls, and the invitee's own switch.
 *
 * WHO MAY INVITE. A signed-in admin, on a poll they set up, and nobody else.
 * `/availability/new` is public, and a list of addresses anyone could type in is
 * how a stranger would use our sending domain to mail people who never asked.
 * The organiser token alone is not enough: it proves you hold the poll, not who
 * you are. So every organiser action here needs both the token and an access
 * token Supabase confirms belongs to an allowlisted admin whose address is the
 * poll's organiser address. Peter's decision, 30 September 2026.
 *
 * Sending actions fail CLOSED on the limiter, like confirmOption: they send mail.
 */

export interface InviteActionResult {
  success?: boolean;
  error?: string;
  /** What happened, so the screen can say it plainly. */
  invited?: { added: number; alreadyInvited: number; sent: number; failed: number };
}

const LINK_NOT_VALID = 'That link is not valid.';
const SIGN_IN_TO_INVITE = 'Sign in to invite people by email.';
const NOT_YOUR_POLL = 'You can only invite people to polls you set up while signed in.';
const NOT_TAKING_ANSWERS = 'This poll is not taking answers, so there is nobody to invite.';
const INVITE_UNAVAILABLE = 'Sending is unavailable right now. Please try again shortly.';
const INVITE_FAILED = 'Those people were not added. Please try again.';

const inviteSchema = z.object({
  organiserToken: tokenSchema,
  emails: inviteEmailsFieldSchema,
});

const removeSchema = z.object({
  organiserToken: tokenSchema,
  inviteeId: z.string().uuid('That person is not valid.'),
});

function clientIp(): string {
  // headers() is synchronous on next 14. Do not await it.
  return getClientIp(headers());
}

/**
 * The gate every organiser action here shares. Returns the poll, or the one
 * string to show.
 */
async function resolveOwnPoll(
  organiserToken: string,
  adminToken: string | undefined
): Promise<{ pollId: string; status: string } | { error: string }> {
  const admin = await resolveAdminIdentity(adminToken);
  if (!admin) return { error: SIGN_IN_TO_INVITE };

  const view = await getOrganiserView(organiserToken);
  if (!view || view.poll.status === 'draft') return { error: LINK_NOT_VALID };
  if (new Date(view.poll.expires_at).getTime() <= Date.now()) return { error: LINK_NOT_VALID };

  if (view.poll.organiser_email.trim().toLowerCase() !== admin.email) {
    return { error: NOT_YOUR_POLL };
  }

  return { pollId: view.poll.id, status: view.poll.status };
}

/** Fail closed: these actions send mail. */
async function sendingAllowed(): Promise<string | null> {
  try {
    const result = await checkRateLimit('poll_organiser_ip', hashKey(clientIp()));
    return result.allowed ? null : VALIDATION_MESSAGES.poll.rateLimited;
  } catch (error) {
    console.error('[polls] Invite rate limiter threw, refusing:', scrubTokens(String(error)));
    return INVITE_UNAVAILABLE;
  }
}

/**
 * Adds people to a live poll's invite list and emails each their own link.
 */
export async function inviteByEmail(
  organiserToken: string,
  adminToken: string | undefined,
  emails: string
): Promise<InviteActionResult> {
  const parsed = inviteSchema.safeParse({ organiserToken, emails });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? LINK_NOT_VALID };
  }

  const list = parseInviteEmails(parsed.data.emails);
  const problem = inviteEmailsProblem(list);
  if (problem) return { error: problem };
  if (list.emails.length === 0) return { error: 'Add at least one email address.' };

  const poll = await resolveOwnPoll(organiserToken, adminToken);
  if ('error' in poll) return { error: poll.error };
  if (poll.status !== 'open') return { error: NOT_TAKING_ANSWERS };

  const limited = await sendingAllowed();
  if (limited) return { error: limited };

  const added = await addInvitees(poll.pollId, list.emails);
  if (!added.stored || !added.data) {
    if (added.error === TOO_MANY_INVITEES) {
      return { error: `A poll can invite up to ${MAX_INVITEES_PER_POLL} people by email.` };
    }
    console.error('[polls] Invitees not stored:', scrubTokens(added.error ?? 'Unknown error.'));
    return { error: INVITE_FAILED };
  }

  // Sends to everyone still waiting, which includes anyone a previous attempt
  // failed to reach. Never throws per person; a total failure is reported.
  let result = { sent: 0, failed: 0 };
  try {
    result = await sendPendingInvitations(poll.pollId);
  } catch (error) {
    console.error('[poll-email] Invitations threw:', scrubTokens(String(error)));
    result = { sent: 0, failed: added.data.added.length };
  }

  revalidatePath(`/availability/o/${organiserToken}`);
  return {
    success: true,
    invited: {
      added: added.data.added.length,
      alreadyInvited: added.data.alreadyInvited,
      sent: result.sent,
      failed: result.failed,
    },
  };
}

/** Tries again for everyone whose invitation did not go. */
export async function retryInvitations(
  organiserToken: string,
  adminToken: string | undefined
): Promise<InviteActionResult> {
  if (!isWellFormedToken(organiserToken)) return { error: LINK_NOT_VALID };

  const poll = await resolveOwnPoll(organiserToken, adminToken);
  if ('error' in poll) return { error: poll.error };
  if (poll.status !== 'open') return { error: NOT_TAKING_ANSWERS };

  const limited = await sendingAllowed();
  if (limited) return { error: limited };

  try {
    const result = await sendPendingInvitations(poll.pollId);
    revalidatePath(`/availability/o/${organiserToken}`);
    return { success: true, invited: { added: 0, alreadyInvited: 0, ...result } };
  } catch (error) {
    console.error('[poll-email] Invitation retry threw:', scrubTokens(String(error)));
    return { error: INVITE_UNAVAILABLE };
  }
}

/** Takes one person off the list. Any answer they gave stays on the poll. */
export async function removeInvitation(
  organiserToken: string,
  adminToken: string | undefined,
  inviteeId: string
): Promise<InviteActionResult> {
  const parsed = removeSchema.safeParse({ organiserToken, inviteeId });
  if (!parsed.success) return { error: LINK_NOT_VALID };

  const poll = await resolveOwnPoll(organiserToken, adminToken);
  if ('error' in poll) return { error: poll.error };

  const result = await removeInvitee(poll.pollId, inviteeId);
  if (!result.stored) {
    if (result.error === INVITEE_NOT_FOUND) return { success: true };
    console.error('[polls] Invitee not removed:', scrubTokens(result.error ?? 'Unknown error.'));
    return { error: 'That person was not removed. Please try again.' };
  }

  revalidatePath(`/availability/o/${organiserToken}`);
  return { success: true };
}

/**
 * The invited person's own switch: stop, or restart, emails about this poll.
 *
 * The invite token is the authority, as the organiser token is for the
 * organiser. Fails OPEN on the limiter: it sends nothing, and being unable to
 * stop emails because a limiter is down is the worse failure.
 */
export async function setInvitationEmails(
  inviteToken: string,
  on: boolean
): Promise<InviteActionResult> {
  if (!isWellFormedToken(inviteToken) || typeof on !== 'boolean') {
    return { error: LINK_NOT_VALID };
  }

  try {
    const limited = await checkRateLimit('poll_update_ip', hashKey(clientIp()));
    if (!limited.allowed && limited.reason === 'limited') {
      return { error: VALIDATION_MESSAGES.poll.rateLimited };
    }
  } catch (error) {
    console.error('[polls] Invitee limiter threw, allowing:', scrubTokens(String(error)));
  }

  const result = await setInviteeOptOut(inviteToken, !on);
  if (!result.stored) {
    if (result.error === INVITEE_NOT_FOUND) return { error: LINK_NOT_VALID };
    console.error('[polls] Invitee emails not switched:', scrubTokens(result.error ?? ''));
    return { error: 'That did not go through. Please try again.' };
  }

  revalidatePath(`/availability/i/${inviteToken}`);
  return { success: true };
}
