import { sendPollEmailBatch, type PollEmail } from '@/lib/email';
import { getSupabaseAdminClient } from '@/lib/db/supabase-admin';
import {
  claimInvitees,
  listUnsentInvitees,
  releaseInvitees,
  type InviteeRow,
} from '@/lib/db/poll-invitees';
import type { OptionKind } from '@/lib/db/polls';
import { buildInvitationEmail, buildInviteeUnsubscribeHeaders } from '@/lib/poll-emails';
import { formatOptionForEmail } from '@/lib/poll-emails/formatOptionForEmail';
import { formatSlotInLondon, type IsoDate } from '@/lib/dateUtils';
import { scrubTokens } from '@/lib/poll-tokens';
import { getAbsoluteUrl } from '@/lib/site-config';

/**
 * Sends the invitations a signed-in admin asked for. See migration 20260930113639.
 *
 * Works through the invitees not yet sent, not answered and not opted out: one
 * email each, sent through Resend's batch API so fifty invitations are one
 * request rather than forty-five seconds of paced sends inside a server action.
 *
 * Each person is claimed (stamped) before their email is built, so two sends
 * overlapping cannot both email them; anyone whose email Resend refuses is
 * released again, back into the "not sent" set the organiser's page shows and
 * retries. Nothing here throws on a single bad address.
 *
 * Only for a live poll. Invitations for a poll still waiting on its organiser's
 * email confirmation stay queued and go when verification opens it.
 */

export interface InvitationSendResult {
  sent: number;
  failed: number;
}

interface InvitationPoll {
  id: string;
  status: string;
  title: string;
  description: string | null;
  location: string | null;
  organiser_name: string;
  organiser_email: string;
  option_kind: OptionKind;
  entries_close_at: string | null;
}

interface InvitationOption {
  option_date: IsoDate | null;
  starts_at: string | null;
  ends_at: string | null;
}

/** Everything the invitation says that is the same for every person on the poll. */
export async function readInvitationPoll(pollId: string): Promise<{
  poll: InvitationPoll;
  optionLabels: string[];
  deadlineLabel: string | null;
} | null> {
  const supabase = getSupabaseAdminClient();

  const [{ data: poll, error }, { data: options }] = await Promise.all([
    supabase
      .from('polls')
      .select(
        'id, status, title, description, location, organiser_name, organiser_email, option_kind, entries_close_at'
      )
      .eq('id', pollId)
      .maybeSingle(),
    supabase
      .from('poll_options')
      .select('option_date, starts_at, ends_at')
      .eq('poll_id', pollId)
      .order('position'),
  ]);

  if (error) throw new Error(error.message);
  if (!poll) return null;

  const row = poll as InvitationPoll;

  return {
    poll: row,
    optionLabels: ((options ?? []) as InvitationOption[]).map((option) =>
      formatOptionForEmail({
        optionKind: row.option_kind,
        optionDate: option.option_date,
        startsAt: option.starts_at,
        endsAt: option.ends_at,
      })
    ),
    deadlineLabel: row.entries_close_at ? formatSlotInLondon(row.entries_close_at) : null,
  };
}

/** One person's invitation or reminder, addressed and ready to send. */
export function buildInvitationMessage(
  context: NonNullable<Awaited<ReturnType<typeof readInvitationPoll>>>,
  invitee: Pick<InviteeRow, 'email' | 'invite_token'>,
  isReminder = false
): PollEmail {
  const { poll, optionLabels, deadlineLabel } = context;
  const inviteUrl = getAbsoluteUrl(`/availability/i/${invitee.invite_token}`);

  const email = buildInvitationEmail({
    organiserName: poll.organiser_name,
    pollTitle: poll.title,
    description: poll.description,
    location: poll.location,
    optionLabels,
    deadlineLabel,
    inviteUrl,
    stopEmailsUrl: `${inviteUrl}#emails`,
    isReminder,
  });

  return {
    to: invitee.email,
    subject: email.subject,
    html: email.html,
    text: email.text,
    // A reply reaches the person who knows them, never an unwatched mailbox.
    replyTo: poll.organiser_email,
    headers: buildInviteeUnsubscribeHeaders(invitee.invite_token),
  };
}

export async function sendPendingInvitations(pollId: string): Promise<InvitationSendResult> {
  const context = await readInvitationPoll(pollId);
  if (!context || context.poll.status !== 'open') return { sent: 0, failed: 0 };

  const pending = await listUnsentInvitees(pollId);
  if (pending.length === 0) return { sent: 0, failed: 0 };

  const claimedAt = new Date().toISOString();
  const won = await claimInvitees(
    pending.map((invitee) => invitee.id),
    claimedAt
  );
  const mine = pending.filter((invitee) => won.has(invitee.id));
  if (mine.length === 0) return { sent: 0, failed: 0 };

  const accepted = await sendPollEmailBatch(
    mine.map((invitee) => buildInvitationMessage(context, invitee))
  );

  const refused = mine.filter((_invitee, index) => !accepted[index]).map((invitee) => invitee.id);
  if (refused.length > 0) {
    // The address is never logged: it is someone else's, given to us by the organiser.
    console.error(
      `[poll-email] ${refused.length} of ${mine.length} invitations failed for poll ${pollId}.`
    );
    try {
      await releaseInvitees(refused, claimedAt);
    } catch (error) {
      // They would then read as sent. Loud, because the organiser cannot see it.
      console.error(
        `[poll-email] Failed invitations not released for poll ${pollId}: ${scrubTokens(String(error))}`
      );
    }
  }

  return { sent: mine.length - refused.length, failed: refused.length };
}
