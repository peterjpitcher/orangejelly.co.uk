import { sendPollEmail } from '@/lib/email';
import type { Availability, OptionKind } from '@/lib/db/polls';
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from '@/lib/db/supabase-admin';
import { aggregateByOption, countResponders } from '@/lib/poll-aggregate';
import { buildDigestEmail, buildUnsubscribeHeaders } from '@/lib/poll-emails';
import { formatOptionForEmail } from '@/lib/poll-emails/formatOptionForEmail';
import { scrubTokens } from '@/lib/poll-tokens';
import { getAbsoluteUrl } from '@/lib/site-config';
import type { IsoDate } from '@/lib/dateUtils';

/**
 * The organiser's "you have new responses" digest. See SPEC §4.2.
 *
 * Two callers, one implementation. A vote or an edit marks the poll pending and
 * tries to send straight away (`notifyOrganiserOfResponse`); the daily cron
 * flushes whatever that could not send (`deliverDigest` from poll-sweep.ts).
 * Both go through the same claim, so they cannot both mail one window.
 *
 * Until 29 September 2026 nothing set `digest_pending_since`, so the cron pass
 * never found a poll and no digest was ever sent. The lazy trigger below is the
 * half of §4.2 that was missing.
 */

/** At most one digest per poll in this many minutes, however many people respond. */
export const DIGEST_WINDOW_MINUTES = 60;

/** The columns a digest needs. Shared so the cron and the lazy path read the same row. */
export const DIGEST_POLL_COLUMNS =
  'id, title, organiser_name, organiser_email, organiser_token, option_kind, last_digest_at, created_at';

export interface DigestPollRow {
  id: string;
  title: string;
  organiser_name: string;
  organiser_email: string;
  organiser_token: string;
  option_kind: OptionKind;
  last_digest_at: string | null;
  created_at: string;
}

/**
 * What happened to one poll's digest.
 *
 * `not_claimed` is not a failure: another request holds the window, and it is
 * the one that sends.
 */
export type DigestOutcome = 'sent' | 'failed' | 'nothing_new' | 'not_claimed';

interface OptionRow {
  id: string;
  position: number;
  option_date: IsoDate | null;
  starts_at: string | null;
  ends_at: string | null;
}

interface ResponseRow {
  participant_id: string;
  option_id: string;
  availability: Availability;
  updated_at: string;
}

/**
 * Marks that the organiser has news waiting. Only ever sets it from null, so the
 * marker keeps the time of the OLDEST news, which is what the cron's delay is
 * measured from.
 */
export async function markDigestPending(pollId: string): Promise<void> {
  const { error } = await getSupabaseAdminClient()
    .from('polls')
    .update({ digest_pending_since: new Date().toISOString() })
    .eq('id', pollId)
    .is('digest_pending_since', null);

  if (error) throw new Error(error.message);
}

/**
 * Clears the marker, then puts it back if a response landed after `after`.
 *
 * A response that commits while a digest is being built finds the marker
 * already set, so its own `markDigestPending` does nothing. Clearing blindly
 * would then drop that news until somebody else answered. The re-check is one
 * cheap query and closes that gap.
 */
async function clearPendingUnlessMoreArrived(pollId: string, after: string): Promise<void> {
  const supabase = getSupabaseAdminClient();

  await supabase.from('polls').update({ digest_pending_since: null }).eq('id', pollId);

  const { data: later } = await supabase
    .from('poll_responses')
    .select('participant_id')
    .eq('poll_id', pollId)
    .gt('updated_at', after)
    .limit(1);

  if (later && later.length > 0) await markDigestPending(pollId);
}

function labelFor(option: OptionRow, optionKind: OptionKind): string {
  return formatOptionForEmail({
    optionKind,
    optionDate: option.option_date,
    startsAt: option.starts_at,
    endsAt: option.ends_at,
  });
}

/**
 * Claims the poll's digest window, then builds and sends the digest.
 *
 * THE CLAIM IS ONE STATEMENT. It moves `last_digest_at` only if it still holds
 * the value this caller read, so two responses landing in the same second
 * cannot both send: exactly one update matches, the other gets no row back and
 * stands down. A read-then-write would let both through.
 *
 * On a failed send the claim stays, and `digest_pending_since` stays set, so the
 * next window or the nightly cron retries. Reverting the claim would let every
 * later vote retry a failing address immediately (SPEC §4.2, "do not fix this").
 *
 * The caller decides whether the window is open; this function trusts it, and
 * the claim is what makes a stale decision harmless.
 */
export async function deliverDigest(poll: DigestPollRow): Promise<DigestOutcome> {
  const supabase = getSupabaseAdminClient();
  const claimedAt = new Date().toISOString();

  const claimQuery = supabase
    .from('polls')
    .update({ last_digest_at: claimedAt })
    .eq('id', poll.id)
    .eq('status', 'open')
    .eq('digest_opt_out', false);

  const { data: claimed, error: claimError } = await (
    poll.last_digest_at === null
      ? claimQuery.is('last_digest_at', null)
      : claimQuery.eq('last_digest_at', poll.last_digest_at)
  )
    .select('id')
    .maybeSingle();

  if (claimError) throw new Error(claimError.message);
  if (!claimed) return 'not_claimed';

  // The previous watermark: everything the organiser has not been told about.
  // created_at is the fallback for a poll that has never had a digest.
  const since = poll.last_digest_at ?? poll.created_at;

  const [{ data: options }, { data: responses }, { data: participants }] = await Promise.all([
    supabase
      .from('poll_options')
      .select('id, position, option_date, starts_at, ends_at')
      .eq('poll_id', poll.id)
      .order('position'),
    supabase
      .from('poll_responses')
      .select('participant_id, option_id, availability, updated_at')
      .eq('poll_id', poll.id),
    supabase.from('poll_participants').select('id, display_name').eq('poll_id', poll.id),
  ]);

  const optionRows = (options ?? []) as OptionRow[];
  const responseRows = (responses ?? []) as ResponseRow[];
  const participantRows = (participants ?? []) as Array<{ id: string; display_name: string }>;

  // Count from poll_responses.updated_at, NOT poll_participants.created_at.
  // An edit mutates a response for a participant who already exists, so their
  // created_at never moves; counting participants would send a digest reading
  // "0 new responses" above an empty list every time somebody changed their mind.
  const movedIds = new Set(
    responseRows.filter((row) => row.updated_at > since).map((row) => row.participant_id)
  );

  const newNames = participantRows
    .filter((row) => movedIds.has(row.id))
    .map((row) => row.display_name)
    .sort((a, b) => a.localeCompare(b, 'en-GB'));

  if (newNames.length === 0) {
    // Nothing to report: another send already covered this news, or a response
    // was deleted. Hand the window back (only if nobody has claimed it since)
    // and send nothing: a digest saying "0 new responses" is worse than none.
    await supabase
      .from('polls')
      .update({ last_digest_at: poll.last_digest_at })
      .eq('id', poll.id)
      .eq('last_digest_at', claimedAt);
    await clearPendingUnlessMoreArrived(poll.id, since);
    return 'nothing_new';
  }

  const tallies = aggregateByOption(
    optionRows.map((option) => ({ id: option.id, position: option.position })),
    responseRows
  );
  const labels = new Map(
    optionRows.map((option) => [option.id, labelFor(option, poll.option_kind)])
  );
  const organiserUrl = getAbsoluteUrl(`/availability/o/${poll.organiser_token}`);

  const email = buildDigestEmail({
    organiserName: poll.organiser_name,
    pollTitle: poll.title,
    newNames,
    tallies: tallies.map((tally) => ({
      label: labels.get(tally.option_id) ?? '',
      yes: tally.yes,
      ifNeedBe: tally.if_need_be,
      no: tally.no,
    })),
    totalResponders: countResponders(responseRows),
    organiserUrl,
    manageEmailsUrl: `${organiserUrl}#emails`,
  });

  const result = await sendPollEmail({
    to: poll.organiser_email,
    subject: email.subject,
    html: email.html,
    text: email.text,
    headers: buildUnsubscribeHeaders(poll.organiser_token),
  });

  if (result.error) {
    // The address is not logged. §4.3 promises it is disclosed to nobody, and a
    // log line naming it undoes that.
    console.error(`[poll-email] Digest not sent for poll ${poll.id}: ${scrubTokens(result.error)}`);
    return 'failed';
  }

  await clearPendingUnlessMoreArrived(poll.id, claimedAt);
  return 'sent';
}

/**
 * Sends the digest now if this poll's window is open. The lazy path.
 *
 * Only a live, verified poll whose organiser has not turned the emails off. A
 * closed poll takes no votes, so it has nothing new to report; the cron flushes
 * nothing for it either.
 */
export async function sendDigestIfDue(pollId: string): Promise<DigestOutcome | 'not_due'> {
  const { data, error } = await getSupabaseAdminClient()
    .from('polls')
    .select(`${DIGEST_POLL_COLUMNS}, status, digest_opt_out, email_verified_at`)
    .eq('id', pollId)
    .maybeSingle();

  if (error) throw new Error(error.message);

  const poll = data as
    | (DigestPollRow & {
        status: string;
        digest_opt_out: boolean;
        email_verified_at: string | null;
      })
    | null;

  if (!poll || poll.status !== 'open' || poll.digest_opt_out || !poll.email_verified_at) {
    return 'not_due';
  }

  const windowOpensAt = Date.now() - DIGEST_WINDOW_MINUTES * 60 * 1000;
  if (poll.last_digest_at && new Date(poll.last_digest_at).getTime() > windowOpensAt) {
    // Inside the window. The marker is set, so the next response after the
    // window opens carries this news, or the cron does if nobody else answers.
    return 'not_due';
  }

  return deliverDigest(poll);
}

/**
 * Called by a vote or an edit once it has been stored. Never throws.
 *
 * The response is already stored and on the organiser's page, so nothing here
 * may turn it into an error for the person answering. A failure is logged and
 * the marker stays set, so the nightly cron picks the news up.
 */
export async function notifyOrganiserOfResponse(pollId: string): Promise<void> {
  if (!isSupabaseAdminConfigured()) return;

  try {
    await markDigestPending(pollId);
    await sendDigestIfDue(pollId);
  } catch (error) {
    console.error(
      `[poll-email] Digest not sent for poll ${pollId}: ${scrubTokens(
        error instanceof Error ? error.message : String(error)
      )}`
    );
  }
}
