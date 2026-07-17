import { sendPollEmail, POLL_EMAIL_SEND_INTERVAL_MS } from '@/lib/email';
import {
  SWEEP_LIMIT,
  findPollsDueForDeadlineReminder,
  markDeadlineReminded,
  sweepExpiredPolls,
  sweepRateLimitWindows,
  sweepUnverifiedDrafts,
  type Availability,
  type OptionKind,
  type PollDueForReminder,
} from '@/lib/db/polls';
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from '@/lib/db/supabase-admin';
import { aggregateByOption, bestOption, countResponders } from '@/lib/poll-aggregate';
import {
  buildDeadlineReminderEmail,
  buildDigestEmail,
  buildNudgeEmail,
  buildUnsubscribeHeaders,
} from '@/lib/poll-emails';
import { formatOptionForEmail } from '@/lib/poll-emails/formatOptionForEmail';
import { scrubTokens } from '@/lib/poll-tokens';
import { getAbsoluteUrl } from '@/lib/site-config';
import type { IsoDate } from '@/lib/dateUtils';

/**
 * The five passes behind the daily poll cron. See SPEC §3.8.
 *
 * Split out of the route handler because a route handler that also contains the
 * work cannot be tested without a request, and this is the one unattended job in
 * the feature — the part most worth testing is the part nobody watches.
 *
 * THE ORDER IS NOT ARBITRARY. The three deletes run first because they are the
 * retention promise made in the privacy notice; the digest and the nudge are
 * courtesies. If the function times out halfway, the obligations have already
 * been kept and the courtesies are what is dropped.
 *
 * EVERY PASS FAILS ALONE. Each sits in its own try/catch and pushes a scrubbed
 * message onto `errors`. One pass throwing must never stop the retention delete
 * from running — the whole point of ordering them is lost if the first failure
 * aborts the job.
 *
 * VERCEL DOES NOT RETRY A FAILED CRON. There is no backoff and no second
 * attempt: a failure means the work waits until tomorrow. That is why the report
 * has to be honest rather than reassuring — the non-200 in the Vercel dashboard
 * is the entirety of our alerting, and a pass that fails silently is a promise
 * that quietly stopped being kept.
 */

/** Minutes a digest waits before the cron flushes it. Matches the lazy window in §4.2. */
export const DIGEST_FLUSH_DELAY_MINUTES = 60;

/** Days of no response activity before an open poll earns its one nudge. */
export const NUDGE_QUIET_DAYS = 7;

/**
 * Polls one run may email, per pass.
 *
 * Far below SWEEP_LIMIT on purpose: the deletes are one statement each, whereas
 * a mail pass costs a round trip to Resend per poll, paced at
 * POLL_EMAIL_SEND_INTERVAL_MS to stay inside Resend's 2-per-second rate limit.
 * Twenty digests plus twenty nudges is about 24 seconds of sending, which fits
 * inside the route's maxDuration with room for the queries around it. A backlog
 * drains tomorrow; a timeout mid-fan-out would leave the run's bookkeeping
 * half-written, which is worse.
 */
export const EMAIL_PASS_LIMIT = 20;

/** A delete pass: how many went, and whether it hit its bound with more to come. */
export interface SweepDeleteResult {
  deleted: number;
  /** True when the pass hit its limit and more rows remain. Not an error. */
  backlog: boolean;
}

/** A mail pass. `failed` is per-poll; one bad address must not fail the pass. */
export interface SweepEmailResult {
  sent: number;
  failed: number;
  /** True when the pass hit EMAIL_PASS_LIMIT and more polls are waiting. */
  backlog: boolean;
}

export interface PollSweepReport {
  expired: SweepDeleteResult;
  drafts: SweepDeleteResult;
  rateLimits: SweepDeleteResult;
  digests: SweepEmailResult;
  nudges: SweepEmailResult;
  deadlineReminders: SweepEmailResult;
  /** One scrubbed message per FAILED pass. Non-empty means the route returns 500. */
  errors: string[];
}

interface DigestPollRow {
  id: string;
  title: string;
  organiser_name: string;
  organiser_email: string;
  organiser_token: string;
  option_kind: OptionKind;
  last_digest_at: string | null;
  created_at: string;
}

interface NudgePollRow {
  id: string;
  title: string;
  organiser_name: string;
  organiser_email: string;
  participant_token: string;
  organiser_token: string;
  option_kind: OptionKind;
}

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

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function errorMessage(error: unknown): string {
  return scrubTokens(error instanceof Error ? error.message : String(error));
}

function minutesAgo(minutes: number): string {
  return new Date(Date.now() - minutes * 60 * 1000).toISOString();
}

function daysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

/** Turns an option row into the prose the emails print. See formatOptionForEmail. */
function labelFor(option: OptionRow, optionKind: OptionKind): string {
  return formatOptionForEmail({
    optionKind,
    optionDate: option.option_date,
    startsAt: option.starts_at,
    endsAt: option.ends_at,
  });
}

/**
 * Pass 1 — the retention delete. The GDPR promise; everything else is optional.
 *
 * sweepExpiredPolls is already shipped and already bounded at SWEEP_LIMIT, and
 * enforces that cap on its own callers. It is called, never reimplemented.
 */
async function runRetentionPass(): Promise<SweepDeleteResult> {
  const result = await sweepExpiredPolls({ limit: SWEEP_LIMIT });
  if (!result.stored) throw new Error(result.error ?? 'The retention sweep failed.');

  const backlog = result.data?.remaining === -1;
  if (backlog) {
    console.warn('[polls] Retention backlog — a full batch was deleted; more remain.');
  }

  return { deleted: result.data?.deleted ?? 0, backlog };
}

/** Pass 2 — drafts whose organiser never verified. Bounded; see sweepUnverifiedDrafts. */
async function runDraftPass(): Promise<SweepDeleteResult> {
  const result = await sweepUnverifiedDrafts({ limit: SWEEP_LIMIT });
  if (!result.stored) throw new Error(result.error ?? 'The unverified-draft sweep failed.');

  const backlog = result.data?.remaining === -1;
  if (backlog) {
    console.warn('[polls] Unverified-draft backlog — a full batch was deleted; more remain.');
  }

  return { deleted: result.data?.deleted ?? 0, backlog };
}

/** Pass 3 — rate-limit counters past their window. A pass here, never a second cron. */
async function runRateLimitPass(): Promise<SweepDeleteResult> {
  const result = await sweepRateLimitWindows({ limit: SWEEP_LIMIT });
  if (!result.stored) throw new Error(result.error ?? 'The rate-limit sweep failed.');

  const backlog = result.data?.remaining === -1;
  if (backlog) {
    console.warn('[polls] Rate-limit backlog — a bounded slice was deleted; more remain.');
  }

  return { deleted: result.data?.deleted ?? 0, backlog };
}

/**
 * Pass 4 — the digest flush, which closes the last-vote gap (§4.2).
 *
 * The digest normally fires lazily off a response. That cannot fire on the LAST
 * response: if nobody else answers, `digest_pending_since` stays set and the
 * organiser is never told about the final vote. This pass is the only thing that
 * closes that gap, which is why it is a pass and not a nicety to drop.
 */
async function runDigestPass(): Promise<SweepEmailResult> {
  const supabase = getSupabaseAdminClient();
  let sent = 0;
  let failed = 0;

  const { data: polls, error } = await supabase
    .from('polls')
    .select(
      'id, title, organiser_name, organiser_email, organiser_token, option_kind, last_digest_at, created_at'
    )
    .eq('status', 'open')
    .eq('digest_opt_out', false)
    .lt('digest_pending_since', minutesAgo(DIGEST_FLUSH_DELAY_MINUTES))
    .order('digest_pending_since', { ascending: true })
    .limit(EMAIL_PASS_LIMIT);

  if (error) throw new Error(error.message);

  const due = (polls ?? []) as DigestPollRow[];

  for (const [index, poll] of due.entries()) {
    // `since` is the previous watermark: everything the organiser has not been
    // told about. created_at is the fallback for a poll that has never had one.
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
    // created_at never moves — counting participants would send a digest reading
    // "0 new responses" above an empty list every time somebody changed their mind.
    const movedIds = new Set(
      responseRows.filter((row) => row.updated_at > since).map((row) => row.participant_id)
    );

    const newNames = participantRows
      .filter((row) => movedIds.has(row.id))
      .map((row) => row.display_name)
      .sort((a, b) => a.localeCompare(b, 'en-GB'));

    if (newNames.length === 0) {
      // Nothing to report — a concurrent lazy send already covered this window.
      // Clear the marker so the poll stops appearing in this pass, and send no
      // mail: a digest saying "0 new responses" is worse than no digest.
      await supabase.from('polls').update({ digest_pending_since: null }).eq('id', poll.id);
      continue;
    }

    const tallies = aggregateByOption(
      optionRows.map((option) => ({ id: option.id, position: option.position })),
      responseRows
    );
    const labels = new Map(
      optionRows.map((option) => [option.id, labelFor(option, poll.option_kind)])
    );

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
      organiserUrl: getAbsoluteUrl(`/availability/o/${poll.organiser_token}`),
    });

    const result = await sendPollEmail({
      to: poll.organiser_email,
      subject: email.subject,
      html: email.html,
      text: email.text,
      headers: buildUnsubscribeHeaders(poll.organiser_token),
    });

    if (result.error) {
      // Leave digest_pending_since set so tomorrow's pass retries. The address
      // is not logged — §4.3 promises it is disclosed to nobody, and a log line
      // naming it undoes that.
      failed++;
      console.error(
        `[poll-email] Digest not flushed for poll ${poll.id}: ${scrubTokens(result.error)}`
      );
    } else {
      sent++;
      await supabase
        .from('polls')
        .update({ digest_pending_since: null, last_digest_at: new Date().toISOString() })
        .eq('id', poll.id);
    }

    if (index < due.length - 1) await sleep(POLL_EMAIL_SEND_INTERVAL_MS);
  }

  return { sent, failed, backlog: due.length === EMAIL_PASS_LIMIT };
}

/**
 * Pass 5 — the nudge. TO THE ORGANISER, never to participants.
 *
 * The briefed email was meant to chase non-responders and cannot exist: a
 * poll_participants row only comes into being once somebody has responded, so
 * "participants who have not responded" is an empty set at the schema level. The
 * only way to nudge participants would be an invitee list of addresses typed in
 * by the organiser — an address book of unverified third parties on our sending
 * domain, which is the open-relay risk this whole design exists to avoid. So the
 * nudge goes to the one person who has verified their address and can chase
 * people through channels they already have.
 *
 * Once per poll, ever: `nudge_sent_at` is set only after a successful send, so a
 * failure retries tomorrow and a success never repeats.
 */
async function runNudgePass(): Promise<SweepEmailResult> {
  const supabase = getSupabaseAdminClient();
  let sent = 0;
  let failed = 0;

  const quietSince = daysAgo(NUDGE_QUIET_DAYS);

  const { data: polls, error } = await supabase
    .from('polls')
    .select(
      'id, title, organiser_name, organiser_email, participant_token, organiser_token, option_kind'
    )
    .eq('status', 'open')
    .eq('digest_opt_out', false)
    .not('email_verified_at', 'is', null)
    .is('nudge_sent_at', null)
    // Without this a poll created an hour ago has had no responses in the last
    // seven days either, and gets nudged on day one.
    .lt('created_at', quietSince)
    .order('created_at', { ascending: true })
    .limit(EMAIL_PASS_LIMIT);

  if (error) throw new Error(error.message);

  const candidates = (polls ?? []) as NudgePollRow[];
  let considered = 0;

  for (const poll of candidates) {
    const { data: responses } = await supabase
      .from('poll_responses')
      .select('participant_id, option_id, availability, updated_at')
      .eq('poll_id', poll.id);

    const responseRows = (responses ?? []) as ResponseRow[];

    // The "quiet for a week" test. PostgREST has no NOT EXISTS, so the recency
    // check happens here rather than in the query — a poll with any activity in
    // the window is simply not quiet, and is skipped without touching a column.
    if (responseRows.some((row) => row.updated_at > quietSince)) continue;

    const { data: options } = await supabase
      .from('poll_options')
      .select('id, position, option_date, starts_at, ends_at')
      .eq('poll_id', poll.id)
      .order('position');

    const optionRows = (options ?? []) as OptionRow[];
    const responderCount = countResponders(responseRows);

    const tallies = aggregateByOption(
      optionRows.map((option) => ({ id: option.id, position: option.position })),
      responseRows
    );

    // bestOption returns [] when no option has a single yes or if-need-be, which
    // is the commonest case for this email. "The best option right now is
    // <undefined>" is the obvious crash, and this is where it is prevented.
    const [top] = bestOption(tallies);
    const topOption = top ? optionRows.find((option) => option.id === top.option_id) : undefined;

    const email = buildNudgeEmail({
      organiserName: poll.organiser_name,
      pollTitle: poll.title,
      responderCount,
      bestOption:
        top && topOption
          ? { label: labelFor(topOption, poll.option_kind), yesCount: top.yes }
          : null,
      participantUrl: getAbsoluteUrl(`/availability/p/${poll.participant_token}`),
      organiserUrl: getAbsoluteUrl(`/availability/o/${poll.organiser_token}`),
    });

    const result = await sendPollEmail({
      to: poll.organiser_email,
      subject: email.subject,
      html: email.html,
      text: email.text,
      headers: buildUnsubscribeHeaders(poll.organiser_token),
    });

    if (result.error) {
      failed++;
      console.error(
        `[poll-email] Nudge not sent for poll ${poll.id}: ${scrubTokens(result.error)}`
      );
    } else {
      sent++;
      // Only after a success. A tool that nudges twice is spam, and the organiser
      // opted into one poll, not a mailing list.
      await supabase
        .from('polls')
        .update({ nudge_sent_at: new Date().toISOString() })
        .eq('id', poll.id);
    }

    considered++;
    if (considered < candidates.length) await sleep(POLL_EMAIL_SEND_INTERVAL_MS);
  }

  return { sent, failed, backlog: candidates.length === EMAIL_PASS_LIMIT };
}

/**
 * Emails the organiser, once, when a poll's entry deadline has passed.
 *
 * This is the human step of the deadline flow. Nothing here confirms a time or
 * sends an invitation. It nudges the organiser to come and choose, because a
 * poll's best answer is a judgement (a tie, a thin turnout, the person the
 * meeting is for not having voted) and not a counter crossing a number.
 *
 * The claim is atomic and the send follows it, mirroring the nudge pass: mark
 * the poll reminded only after the email is away, so a transient failure retries
 * next run, while `markDeadlineReminded`'s `is null` guard stops two overlapping
 * runs both stamping. The organiser address is verified, so a permanent failure
 * that would loop is close to impossible.
 */
async function runDeadlineReminderPass(): Promise<SweepEmailResult> {
  const supabase = getSupabaseAdminClient();
  let sent = 0;
  let failed = 0;

  const due = await findPollsDueForDeadlineReminder({ limit: EMAIL_PASS_LIMIT });
  if (!due.stored)
    throw new Error(due.error ?? 'Could not read polls due for a deadline reminder.');

  const polls = (due.data ?? []) as PollDueForReminder[];

  for (let index = 0; index < polls.length; index++) {
    const poll = polls[index];

    // The turnout figure the email states, so it can say "only two people have
    // answered" rather than push the organiser to confirm a thin poll.
    const { data: responses } = await supabase
      .from('poll_responses')
      .select('participant_id, option_id, availability')
      .eq('poll_id', poll.id);

    const responderCount = countResponders((responses ?? []) as ResponseRow[]);

    const email = buildDeadlineReminderEmail({
      organiserName: poll.organiser_name,
      pollTitle: poll.title,
      totalResponders: responderCount,
      organiserUrl: getAbsoluteUrl(`/availability/o/${poll.organiser_token}`),
    });

    const result = await sendPollEmail({
      to: poll.organiser_email,
      subject: email.subject,
      html: email.html,
      text: email.text,
      // A single transactional reminder about one poll the organiser set up, not
      // recurring mail, so no List-Unsubscribe. It cannot repeat.
    });

    if (result.error) {
      failed++;
      console.error(
        `[poll-email] Deadline reminder not sent for poll ${poll.id}: ${scrubTokens(result.error)}`
      );
    } else {
      sent++;
      const stamped = await markDeadlineReminded(poll.id);
      if (!stamped.stored) {
        // Another run claimed it in the gap. The organiser has (or will have)
        // exactly one reminder; this send was the redundant half of a race that
        // the daily schedule makes near-impossible in practice.
        console.error(
          `[poll-email] Deadline reminder sent but not stamped for poll ${poll.id}: ${scrubTokens(stamped.error ?? 'unknown')}`
        );
      }
    }

    if (index < polls.length - 1) await sleep(POLL_EMAIL_SEND_INTERVAL_MS);
  }

  return { sent, failed, backlog: polls.length === EMAIL_PASS_LIMIT };
}

const NO_DELETES: SweepDeleteResult = { deleted: 0, backlog: false };
const NO_EMAILS: SweepEmailResult = { sent: 0, failed: 0, backlog: false };

/**
 * Runs all five passes and reports what actually happened.
 *
 * Never throws. A pass that fails is recorded in `errors` and the next one still
 * runs; the caller turns a non-empty `errors` into a 500.
 */
export async function runPollSweep(): Promise<PollSweepReport> {
  const errors: string[] = [];

  if (!isSupabaseAdminConfigured()) {
    // Fail loudly rather than reporting five clean zeroes. A sweep that cannot
    // reach the database has not kept the retention promise, and a 200 saying
    // "0 deleted" is indistinguishable from "nothing was due".
    return {
      expired: NO_DELETES,
      drafts: NO_DELETES,
      rateLimits: NO_DELETES,
      digests: NO_EMAILS,
      nudges: NO_EMAILS,
      deadlineReminders: NO_EMAILS,
      errors: ['The poll database is not configured.'],
    };
  }

  async function runDelete(
    name: string,
    pass: () => Promise<SweepDeleteResult>
  ): Promise<SweepDeleteResult> {
    try {
      return await pass();
    } catch (error) {
      errors.push(`${name}: ${errorMessage(error)}`);
      console.error(`[polls] ${name} failed: ${errorMessage(error)}`);
      return NO_DELETES;
    }
  }

  async function runEmail(
    name: string,
    pass: () => Promise<SweepEmailResult>
  ): Promise<SweepEmailResult> {
    try {
      return await pass();
    } catch (error) {
      errors.push(`${name}: ${errorMessage(error)}`);
      console.error(`[polls] ${name} failed: ${errorMessage(error)}`);
      return NO_EMAILS;
    }
  }

  // Sequential, not Promise.all. The order is the point (see the header): the
  // retention obligations complete before anything optional is attempted.
  const expired = await runDelete('retention sweep', runRetentionPass);
  const drafts = await runDelete('unverified-draft sweep', runDraftPass);
  const rateLimits = await runDelete('rate-limit sweep', runRateLimitPass);
  const digests = await runEmail('digest flush', runDigestPass);
  const nudges = await runEmail('nudge', runNudgePass);
  const deadlineReminders = await runEmail('deadline reminder', runDeadlineReminderPass);

  return { expired, drafts, rateLimits, digests, nudges, deadlineReminders, errors };
}
