import { sendPollEmail, POLL_EMAIL_SEND_INTERVAL_MS } from '@/lib/email';
import { getSupabaseAdminClient } from '@/lib/db/supabase-admin';
import { listUnsentInvitees, markInvited, type InviteeRow } from '@/lib/db/poll-invitees';
import type { OptionKind } from '@/lib/db/polls';
import { buildInvitationEmail, buildInviteeUnsubscribeHeaders } from '@/lib/poll-emails';
import { formatOptionForEmail } from '@/lib/poll-emails/formatOptionForEmail';
import { formatSlotInLondon, type IsoDate } from '@/lib/dateUtils';
import { scrubTokens } from '@/lib/poll-tokens';
import { getAbsoluteUrl } from '@/lib/site-config';

/**
 * Sends the invitations a signed-in admin asked for. See migration 20260930113639.
 *
 * Works through the invitees not yet sent, not answered and not opted out, one
 * email each, paced for Resend's rate limit. A person is stamped as invited only
 * after Resend accepts their email, so a failure leaves them in the "not sent"
 * set that the organiser's page shows and retries. Nothing here throws on a
 * single bad send: one address must not stop the rest.
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

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
): Parameters<typeof sendPollEmail>[0] {
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
  let sent = 0;
  let failed = 0;

  for (const [index, invitee] of pending.entries()) {
    let delivered = false;
    try {
      const result = await sendPollEmail(buildInvitationMessage(context, invitee));
      delivered = !result.error;
    } catch (error) {
      // The address is never logged: it is someone else's, given to us by the organiser.
      console.error(
        `[poll-email] Invitation not sent for poll ${pollId}: ${scrubTokens(String(error))}`
      );
    }

    if (delivered) {
      sent++;
      try {
        await markInvited(invitee.id);
      } catch (error) {
        // The email went. Failing to stamp it only risks a duplicate if the
        // organiser retries, which is better than reporting a sent email as failed.
        console.error(
          `[poll-email] Invitation sent but not stamped for poll ${pollId}: ${scrubTokens(String(error))}`
        );
      }
    } else {
      failed++;
    }

    if (index < pending.length - 1) await sleep(POLL_EMAIL_SEND_INTERVAL_MS);
  }

  if (failed > 0) {
    console.error(
      `[poll-email] ${failed} of ${pending.length} invitations failed for poll ${pollId}.`
    );
  }

  return { sent, failed };
}
