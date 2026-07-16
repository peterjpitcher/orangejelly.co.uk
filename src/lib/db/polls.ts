import { randomUUID } from 'crypto';
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from './supabase-admin';
import { generatePollTokens, generateToken } from '@/lib/poll-tokens';
import { LONDON_TIME_ZONE, londonWallClockToInstant, type IsoDate } from '@/lib/dateUtils';

/**
 * Data access for availability polls.
 *
 * Supabase-only, deliberately. `leads.ts` writes every query twice — once
 * against Supabase, once against raw Postgres via DATABASE_URL — and picks at
 * runtime. That fallback has never run for polls (DATABASE_URL is unset), and
 * duplicating a dozen relational queries for an unexercised path doubles the
 * surface area where untested bugs live. Polls take the Supabase path only and
 * fail loudly if it is not configured.
 *
 * Every function here uses the service-role client. The poll tables have RLS
 * enabled with no policies, so this is the only route to the data — matching the
 * posture of the lead-data layer.
 */

/** Days of inactivity before a poll is swept. Peter's decision, 16 July 2026. */
export const RETENTION_DAYS = 60;

/** Doodle's free tier gives 10. Ours gives 8, but free and ad-free. */
export const MAX_OPTIONS = 8;

export type PollStatus = 'draft' | 'open' | 'closed' | 'confirmed';
export type OptionKind = 'dates' | 'slots';
export type Availability = 'yes' | 'if_need_be' | 'no';

/** A proposed option: either a calendar date or an instant range, never both. */
export type PollOptionInput =
  | { optionDate: IsoDate; startsAt?: never; endsAt?: never }
  | { optionDate?: never; startsAt: Date; endsAt: Date };

export interface CreatePollInput {
  title: string;
  description?: string;
  /**
   * What will actually be discussed. Distinct from `description`, which is the
   * one-line framing of the invitation. Someone deciding whether they can make
   * Tuesday wants both, and it carries into the calendar entry.
   */
  agenda?: string;
  location?: string;
  organiserName: string;
  organiserEmail: string;
  optionKind: OptionKind;
  options: PollOptionInput[];
}

export interface PollTokensResult {
  pollId: string;
  participantToken: string;
  organiserToken: string;
}

export interface StoredResult<T = undefined> {
  stored: boolean;
  data?: T;
  error?: string;
}

export interface PollOptionRow {
  id: string;
  poll_id: string;
  option_date: string | null;
  starts_at: string | null;
  ends_at: string | null;
  position: number;
}

export interface PollRow {
  id: string;
  title: string;
  description: string | null;
  agenda: string | null;
  location: string | null;
  organiser_name: string;
  organiser_email: string;
  option_kind: OptionKind;
  timezone: string;
  status: PollStatus;
  confirmed_option_id: string | null;
  email_verified_at: string | null;
  closes_at: string | null;
  expires_at: string;
  created_at: string;
}

/**
 * A poll with its options, as a participant sees it.
 *
 * Note what is absent: no per-person votes. Only aggregate counts. An analysis
 * of 14M Doodle votes found that showing who voted for what pushes responders
 * toward very popular and very unpopular slots and starves the intermediate
 * ones — which are often the best answer. The shape of this type enforces that.
 */
export interface ParticipantPollView {
  poll: PollRow;
  options: PollOptionRow[];
  /** option_id -> count of 'yes' plus 'if_need_be'. Never who. */
  aggregateCounts: Record<string, number>;
  responderCount: number;
}

export interface OrganiserPollView {
  poll: PollRow;
  options: PollOptionRow[];
  participants: Array<{ id: string; display_name: string; email: string | null }>;
  /** `${participant_id}:${option_id}` -> availability. The organiser sees all. */
  responses: Record<string, Availability>;
}

function cleanText(value?: string | null): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function normaliseEmail(email: string): string {
  return email.trim().toLowerCase();
}

function requireAdminClient() {
  if (!isSupabaseAdminConfigured()) {
    throw new Error('Poll database is not configured.');
  }
  return getSupabaseAdminClient();
}

/**
 * The retention deadline: RETENTION_DAYS after the latest of the last option and
 * now. Refreshed on each response, so an active poll is not swept mid-use.
 */
export function calculateExpiresAt(options: PollOptionInput[], from: Date = new Date()): Date {
  const optionInstants: Date[] = [];

  for (const option of options) {
    if (option.optionDate !== undefined) {
      // End of that day IN LONDON, not in UTC.
      //
      // `${date}T23:59:59Z` was the obvious version and it is wrong for half
      // the year: during BST it resolves to 00:59 the following morning. The
      // drift is an hour on a 60-day window, so nothing breaks — but this is
      // exactly the class of error dateUtils exists to stop, and a codebase
      // that keeps a hand-rolled UTC anchor next to a library built to prevent
      // hand-rolled UTC anchors teaches the wrong lesson to whoever reads it
      // next. 23:59 is never inside the spring-forward gap, so this cannot throw.
      optionInstants.push(londonWallClockToInstant(option.optionDate, '23:59'));
    } else if (option.endsAt !== undefined) {
      optionInstants.push(option.endsAt);
    }
  }

  const latest = optionInstants.reduce(
    (max, instant) => (instant.getTime() > max.getTime() ? instant : max),
    from
  );

  const expires = new Date(latest.getTime());
  expires.setUTCDate(expires.getUTCDate() + RETENTION_DAYS);
  return expires;
}

/**
 * Creates a poll and its options.
 *
 * Starts in 'draft': the poll is not live until the organiser's email is
 * verified. An unverified create endpoint is an open relay for our own sending
 * domain, which would damage deliverability for real client mail.
 */
export async function createPoll(input: CreatePollInput): Promise<StoredResult<PollTokensResult>> {
  if (input.options.length === 0) {
    return { stored: false, error: 'A poll needs at least one option.' };
  }
  if (input.options.length > MAX_OPTIONS) {
    return { stored: false, error: `A poll can have at most ${MAX_OPTIONS} options.` };
  }

  try {
    const supabase = requireAdminClient();
    const pollId = randomUUID();
    const { participantToken, organiserToken } = generatePollTokens();

    const { error: pollError } = await supabase.from('polls').insert({
      id: pollId,
      title: input.title.trim(),
      description: cleanText(input.description),
      agenda: cleanText(input.agenda),
      location: cleanText(input.location),
      organiser_name: input.organiserName.trim(),
      organiser_email: normaliseEmail(input.organiserEmail),
      participant_token: participantToken,
      organiser_token: organiserToken,
      option_kind: input.optionKind,
      timezone: LONDON_TIME_ZONE,
      status: 'draft',
      expires_at: calculateExpiresAt(input.options).toISOString(),
    });

    if (pollError) {
      return { stored: false, error: pollError.message };
    }

    const { error: optionsError } = await supabase.from('poll_options').insert(
      input.options.map((option, index) => ({
        id: randomUUID(),
        poll_id: pollId,
        option_date: option.optionDate ?? null,
        starts_at: option.startsAt?.toISOString() ?? null,
        ends_at: option.endsAt?.toISOString() ?? null,
        position: index + 1,
      }))
    );

    if (optionsError) {
      // The poll is useless without its options, and a draft with none would
      // confuse the organiser on verification. Cascade removes both.
      await supabase.from('polls').delete().eq('id', pollId);
      return { stored: false, error: optionsError.message };
    }

    return { stored: true, data: { pollId, participantToken, organiserToken } };
  } catch (error) {
    return { stored: false, error: error instanceof Error ? error.message : 'Unknown error.' };
  }
}

/** How long a verify link stays usable. Long enough to survive a night's sleep. */
export const VERIFY_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

/** Shortest gap between two sends of the same verify email. */
export const RESEND_COOLDOWN_SECONDS = 60;

/** The tokens that gate a draft poll: one to publish it, one to re-send the first. */
export interface VerifyTokensResult {
  verifyToken: string;
  resendToken: string;
}

/**
 * What verification hands back — the two links the organiser needs, and the
 * fields the "your poll is live" email interpolates.
 *
 * Deliberately not PollRow: PollRow carries no tokens, and this is the one call
 * whose entire purpose is to return them.
 */
export interface VerifiedPollResult {
  id: string;
  title: string;
  participantToken: string;
  organiserToken: string;
  organiserName: string;
  organiserEmail: string;
}

/** A draft poll resolved by its resend token. Never carries a poll capability. */
export interface ResendTargetResult {
  id: string;
  title: string;
  organiserName: string;
  organiserEmail: string;
  verifyToken: string | null;
  verifyTokenExpiresAt: string | null;
}

/**
 * Issues a draft poll's verify and resend tokens.
 *
 * Separate from createPoll on purpose. createPoll is shipped, green and shared
 * with other callers, and its CreatePollInput takes no tokens — so the verify
 * columns are set in a second statement rather than by reworking a working
 * function. The window between the two is harmless: a draft with no verify token
 * is unreachable by anyone, and the caller deletes the poll if this fails.
 *
 * Each token is an independent CSPRNG draw. Nothing is derived from the poll id
 * and nothing is derived from the organiser token — the verify link travels in
 * the most forwardable email this feature sends, so it must not be a capability.
 */
export async function issueVerifyToken(pollId: string): Promise<StoredResult<VerifyTokensResult>> {
  try {
    const supabase = requireAdminClient();
    const verifyToken = generateToken();
    const resendToken = generateToken();
    const expiresAt = new Date(Date.now() + VERIFY_TOKEN_TTL_MS).toISOString();

    const { data, error } = await supabase
      .from('polls')
      .update({
        verify_token: verifyToken,
        verify_token_expires_at: expiresAt,
        resend_token: resendToken,
      })
      .eq('id', pollId)
      .eq('status', 'draft')
      .select('id')
      .maybeSingle();

    if (error) return { stored: false, error: error.message };
    if (!data) return { stored: false, error: 'This poll cannot be verified.' };

    return { stored: true, data: { verifyToken, resendToken } };
  } catch (error) {
    return { stored: false, error: error instanceof Error ? error.message : 'Unknown error.' };
  }
}

/**
 * Marks the organiser's email verified and opens the poll for voting.
 *
 * Matches on `verify_token`, NOT `organiser_token`. An earlier version of this
 * function matched the organiser token, which predates the separate verify token
 * and would have put admin capability in the one email most likely to be
 * forwarded on.
 *
 * One statement, guarded and single-use: `status = 'draft'` and an unexpired
 * `verify_token_expires_at` are part of the WHERE, so a consumed, expired or
 * already-open poll simply matches zero rows and the caller cannot tell those
 * cases apart. All three token columns are nulled in the same update — once the
 * poll is live there is nothing left to verify or re-send, and a capability with
 * no job left is a capability to delete.
 */
export async function verifyAndOpenPoll(
  verifyToken: string
): Promise<StoredResult<VerifiedPollResult>> {
  try {
    const supabase = requireAdminClient();
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('polls')
      .update({
        email_verified_at: now,
        status: 'open',
        verify_token: null,
        verify_token_expires_at: null,
        resend_token: null,
      })
      .eq('verify_token', verifyToken)
      .eq('status', 'draft')
      .gt('verify_token_expires_at', now)
      .select('id, title, participant_token, organiser_token, organiser_name, organiser_email')
      .maybeSingle();

    if (error) return { stored: false, error: error.message };
    if (!data) return { stored: false, error: 'This link is no longer valid.' };

    return {
      stored: true,
      data: {
        id: data.id,
        title: data.title,
        participantToken: data.participant_token,
        organiserToken: data.organiser_token,
        organiserName: data.organiser_name,
        organiserEmail: data.organiser_email,
      },
    };
  } catch (error) {
    return { stored: false, error: error instanceof Error ? error.message : 'Unknown error.' };
  }
}

/**
 * Resolves a draft poll from its resend token.
 *
 * Returns no participant or organiser token by design: the resend path must not
 * be able to hand back a poll capability, or it would become a way to skip
 * verification entirely.
 */
export async function getResendTarget(resendToken: string): Promise<ResendTargetResult | null> {
  const supabase = requireAdminClient();

  const { data } = await supabase
    .from('polls')
    .select(
      'id, title, status, organiser_name, organiser_email, verify_token, verify_token_expires_at'
    )
    .eq('resend_token', resendToken)
    .maybeSingle();

  if (!data || data.status !== 'draft') return null;

  return {
    id: data.id,
    title: data.title,
    organiserName: data.organiser_name,
    organiserEmail: data.organiser_email,
    verifyToken: data.verify_token,
    verifyTokenExpiresAt: data.verify_token_expires_at,
  };
}

/**
 * Takes the 60-second resend slot, atomically.
 *
 * A read-then-write would race: two taps a millisecond apart would both see an
 * old `resend_last_sent_at` and both send. The cooldown is therefore the WHERE
 * clause of the update that records it — the second caller matches zero rows and
 * is refused. Returns true when the slot was claimed.
 *
 * The slot is claimed before the mail is sent, so a send that then fails still
 * costs the cooldown. That is the right way round: it bounds the damage when
 * mail is failing, and the user waits a minute rather than hammering the API.
 */
export async function claimResendSlot(
  pollId: string,
  cooldownSeconds: number = RESEND_COOLDOWN_SECONDS
): Promise<boolean> {
  const supabase = requireAdminClient();
  const now = new Date();
  const threshold = new Date(now.getTime() - cooldownSeconds * 1000).toISOString();

  const { data } = await supabase
    .from('polls')
    .update({ resend_last_sent_at: now.toISOString() })
    .eq('id', pollId)
    .eq('status', 'draft')
    .or(`resend_last_sent_at.is.null,resend_last_sent_at.lt.${threshold}`)
    .select('id')
    .maybeSingle();

  return Boolean(data);
}

/**
 * Mints a fresh verify token and pushes the expiry out 24 hours.
 *
 * The recovery path when a link lapses while the organiser was looking for it.
 * The old token stops working the moment this returns, because the column holds
 * one value.
 */
export async function refreshVerifyToken(
  pollId: string
): Promise<StoredResult<{ verifyToken: string }>> {
  try {
    const supabase = requireAdminClient();
    const verifyToken = generateToken();
    const expiresAt = new Date(Date.now() + VERIFY_TOKEN_TTL_MS).toISOString();

    const { data, error } = await supabase
      .from('polls')
      .update({ verify_token: verifyToken, verify_token_expires_at: expiresAt })
      .eq('id', pollId)
      .eq('status', 'draft')
      .select('id')
      .maybeSingle();

    if (error) return { stored: false, error: error.message };
    if (!data) return { stored: false, error: 'This poll cannot be verified.' };

    return { stored: true, data: { verifyToken } };
  } catch (error) {
    return { stored: false, error: error instanceof Error ? error.message : 'Unknown error.' };
  }
}

async function fetchPollByToken(
  column: 'participant_token' | 'organiser_token',
  token: string
): Promise<PollRow | null> {
  const supabase = requireAdminClient();
  const { data } = await supabase.from('polls').select('*').eq(column, token).maybeSingle();
  return (data as PollRow) ?? null;
}

/**
 * The participant's view: options plus aggregate counts, never per-person votes.
 *
 * A draft poll is treated as absent — it is not live until verified, and leaking
 * its existence would tell a token-guesser they had guessed correctly.
 */
export async function getParticipantView(
  participantToken: string
): Promise<ParticipantPollView | null> {
  const poll = await fetchPollByToken('participant_token', participantToken);
  if (!poll || poll.status === 'draft') return null;

  const supabase = requireAdminClient();

  const [{ data: options }, { data: responses }] = await Promise.all([
    supabase.from('poll_options').select('*').eq('poll_id', poll.id).order('position'),
    supabase
      .from('poll_responses')
      .select('option_id, participant_id, availability')
      .eq('poll_id', poll.id),
  ]);

  const aggregateCounts: Record<string, number> = {};
  for (const option of options ?? []) {
    aggregateCounts[option.id] = 0;
  }

  const responders = new Set<string>();
  for (const response of responses ?? []) {
    responders.add(response.participant_id);
    if (response.availability !== 'no') {
      aggregateCounts[response.option_id] = (aggregateCounts[response.option_id] ?? 0) + 1;
    }
  }

  return {
    poll,
    options: (options ?? []) as PollOptionRow[],
    aggregateCounts,
    responderCount: responders.size,
  };
}

/** The organiser's view: the full matrix, including who voted for what. */
export async function getOrganiserView(organiserToken: string): Promise<OrganiserPollView | null> {
  const poll = await fetchPollByToken('organiser_token', organiserToken);
  if (!poll) return null;

  const supabase = requireAdminClient();

  const [{ data: options }, { data: participants }, { data: responses }] = await Promise.all([
    supabase.from('poll_options').select('*').eq('poll_id', poll.id).order('position'),
    supabase
      .from('poll_participants')
      .select('id, display_name, email')
      .eq('poll_id', poll.id)
      .order('created_at'),
    supabase
      .from('poll_responses')
      .select('participant_id, option_id, availability')
      .eq('poll_id', poll.id),
  ]);

  const responseMap: Record<string, Availability> = {};
  for (const response of responses ?? []) {
    responseMap[`${response.participant_id}:${response.option_id}`] = response.availability;
  }

  return {
    poll,
    options: (options ?? []) as PollOptionRow[],
    participants: participants ?? [],
    responses: responseMap,
  };
}

/**
 * Records a participant's answers.
 *
 * Insert-only, never upsert. There is no unique conflict target for a first-time
 * responder: display_name is not unique, email is optional, and edit_token is
 * generated by us. So a returning participant who does not use their edit link
 * creates a second row.
 *
 * That is accepted, not solved. Engineering identity into an account-free tool
 * means adding accounts, which is the one thing this tool exists not to do. The
 * mitigation is the edit link, shown on screen and emailed when we have an
 * address — which also fixes the single most-cited complaint about every
 * comparable tool: that you cannot correct your own entry.
 */
export async function submitResponse(input: {
  participantToken: string;
  displayName: string;
  email?: string;
  answers: Array<{ optionId: string; availability: Availability }>;
}): Promise<StoredResult<{ editToken: string }>> {
  try {
    const supabase = requireAdminClient();
    const poll = await fetchPollByToken('participant_token', input.participantToken);

    if (!poll) return { stored: false, error: 'This poll could not be found.' };
    if (poll.status !== 'open') {
      return { stored: false, error: 'This poll is no longer accepting responses.' };
    }

    const participantId = randomUUID();
    const editToken = generateToken();

    const { error: participantError } = await supabase.from('poll_participants').insert({
      id: participantId,
      poll_id: poll.id,
      display_name: input.displayName.trim(),
      email: input.email ? normaliseEmail(input.email) : null,
      edit_token: editToken,
    });

    if (participantError) return { stored: false, error: participantError.message };

    const { error: responsesError } = await supabase.from('poll_responses').insert(
      input.answers.map((answer) => ({
        id: randomUUID(),
        poll_id: poll.id,
        participant_id: participantId,
        option_id: answer.optionId,
        availability: answer.availability,
      }))
    );

    if (responsesError) {
      // A participant with no answers is noise in the organiser's matrix.
      await supabase.from('poll_participants').delete().eq('id', participantId);
      return { stored: false, error: responsesError.message };
    }

    await touchExpiry(poll.id);

    return { stored: true, data: { editToken } };
  } catch (error) {
    return { stored: false, error: error instanceof Error ? error.message : 'Unknown error.' };
  }
}

/** Replaces a participant's answers, reached via their own edit token. */
export async function updateResponse(input: {
  editToken: string;
  displayName?: string;
  answers: Array<{ optionId: string; availability: Availability }>;
}): Promise<StoredResult> {
  try {
    const supabase = requireAdminClient();

    const { data: participant } = await supabase
      .from('poll_participants')
      .select('id, poll_id')
      .eq('edit_token', input.editToken)
      .maybeSingle();

    if (!participant) return { stored: false, error: 'This link is no longer valid.' };

    const { data: poll } = await supabase
      .from('polls')
      .select('status')
      .eq('id', participant.poll_id)
      .maybeSingle();

    if (!poll || poll.status !== 'open') {
      return { stored: false, error: 'This poll is no longer accepting changes.' };
    }

    if (input.displayName) {
      await supabase
        .from('poll_participants')
        .update({ display_name: input.displayName.trim() })
        .eq('id', participant.id);
    }

    // Upsert, never delete-then-insert.
    //
    // The original version deleted every one of the participant's answers and
    // then inserted the replacements. Anything failing between the two — a
    // dropped connection, a rejected row — left them with no response at all:
    // they submitted a change and their answers vanished, with an error message
    // that did not mention it. Editing your own response is the feature this
    // tool is meant to get right, so silently destroying it is the worst
    // available bug.
    //
    // `unique (participant_id, option_id)` on poll_responses gives a real
    // conflict target, so one statement does the whole job atomically. A failure
    // now leaves the previous answers exactly where they were.
    // Reuse the existing row's id where there is one.
    //
    // supabase-js builds its upsert as `on conflict do update set` across EVERY
    // column in the payload, `id` included. Handing it a fresh randomUUID() on
    // an edit therefore rewrites the primary key of a row that already exists —
    // the row keeps its answer but changes identity every time its owner
    // changes their mind. Nothing references that id today, so nothing breaks;
    // it is churn, not corruption. But a surrogate key that moves is a trap
    // laid for the first feature that does reference it, and the fix costs one
    // indexed read.
    const { data: existing } = await supabase
      .from('poll_responses')
      .select('id, option_id')
      .eq('participant_id', participant.id);

    const idByOption = new Map<string, string>(
      (existing ?? []).map((row: { id: string; option_id: string }) => [row.option_id, row.id])
    );

    const { error } = await supabase.from('poll_responses').upsert(
      input.answers.map((answer) => ({
        id: idByOption.get(answer.optionId) ?? randomUUID(),
        poll_id: participant.poll_id,
        participant_id: participant.id,
        option_id: answer.optionId,
        availability: answer.availability,
      })),
      { onConflict: 'participant_id,option_id' }
    );

    if (error) return { stored: false, error: error.message };

    await touchExpiry(participant.poll_id);
    return { stored: true };
  } catch (error) {
    return { stored: false, error: error instanceof Error ? error.message : 'Unknown error.' };
  }
}

/** Pushes the retention deadline out, so an active poll is not swept mid-use. */
async function touchExpiry(pollId: string): Promise<void> {
  const supabase = requireAdminClient();
  const expires = new Date();
  expires.setUTCDate(expires.getUTCDate() + RETENTION_DAYS);

  await supabase
    .from('polls')
    .update({ expires_at: expires.toISOString() })
    .eq('id', pollId)
    .lt('expires_at', expires.toISOString());
}

/** Stops further voting without picking a winner. */
export async function closePoll(organiserToken: string): Promise<StoredResult> {
  try {
    const supabase = requireAdminClient();
    const { data, error } = await supabase
      .from('polls')
      .update({ status: 'closed' })
      .eq('organiser_token', organiserToken)
      .eq('status', 'open')
      .select('id')
      .maybeSingle();

    if (error) return { stored: false, error: error.message };
    if (!data) return { stored: false, error: 'This poll cannot be closed.' };
    return { stored: true };
  } catch (error) {
    return { stored: false, error: error instanceof Error ? error.message : 'Unknown error.' };
  }
}

/**
 * Picks the winning option and locks the poll.
 *
 * Permitted from 'open' or 'closed' — an organiser who closed a poll to stop
 * late votes must still be able to confirm one.
 */
export async function confirmOption(
  organiserToken: string,
  optionId: string
): Promise<StoredResult<PollRow>> {
  try {
    const supabase = requireAdminClient();
    const poll = await fetchPollByToken('organiser_token', organiserToken);

    if (!poll) return { stored: false, error: 'This poll could not be found.' };
    if (poll.status !== 'open' && poll.status !== 'closed') {
      return { stored: false, error: 'This poll cannot be confirmed.' };
    }

    // This check is the ONLY control on the option's parentage — do not remove it
    // believing the database has your back. `polls_confirmed_option_fk` is a
    // simple FK to poll_options(id), so it accepts an option belonging to any
    // poll. The composite FKs on poll_responses do guard votes; nothing guards
    // confirmed_option_id except this scope.
    const { data: option } = await supabase
      .from('poll_options')
      .select('id')
      .eq('id', optionId)
      .eq('poll_id', poll.id)
      .maybeSingle();

    if (!option) return { stored: false, error: 'That option does not belong to this poll.' };

    const { data, error } = await supabase
      .from('polls')
      .update({ status: 'confirmed', confirmed_option_id: optionId })
      .eq('id', poll.id)
      .select()
      .maybeSingle();

    if (error) return { stored: false, error: error.message };
    return { stored: true, data: data as PollRow };
  } catch (error) {
    return { stored: false, error: error instanceof Error ? error.message : 'Unknown error.' };
  }
}

/** Removes one participant and their answers. Cascades via the composite FK. */
export async function deleteParticipant(
  organiserToken: string,
  participantId: string
): Promise<StoredResult> {
  try {
    const supabase = requireAdminClient();
    const poll = await fetchPollByToken('organiser_token', organiserToken);
    if (!poll) return { stored: false, error: 'This poll could not be found.' };

    const { error } = await supabase
      .from('poll_participants')
      .delete()
      .eq('id', participantId)
      .eq('poll_id', poll.id);

    if (error) return { stored: false, error: error.message };
    return { stored: true };
  } catch (error) {
    return { stored: false, error: error instanceof Error ? error.message : 'Unknown error.' };
  }
}

/** Removes a poll and everything under it. */
export async function deletePoll(organiserToken: string): Promise<StoredResult> {
  try {
    const supabase = requireAdminClient();
    const { error } = await supabase.from('polls').delete().eq('organiser_token', organiserToken);
    if (error) return { stored: false, error: error.message };
    return { stored: true };
  } catch (error) {
    return { stored: false, error: error instanceof Error ? error.message : 'Unknown error.' };
  }
}

/** Most polls a single sweep may remove. See sweepExpiredPolls. */
export const SWEEP_LIMIT = 500;

/**
 * Deletes polls past their retention deadline. Driven by the Phase 5 cron.
 *
 * This is the retention promise made in the privacy notice, so it must actually
 * run — an unkept retention promise is worse than none.
 *
 * **Bounded on purpose.** The first version issued an unqualified
 * `delete().lt('expires_at', now)`: no limit, no ordering, no batching. Nothing
 * called it, so it never fired — but Phase 5 wires this to a cron with no human
 * watching, and the workspace rules require approval for any bulk operation
 * touching more than 1,000 rows. An unbounded delete of other people's data,
 * running unattended, is exactly what that rule exists to stop. Selecting the
 * oldest SWEEP_LIMIT ids first and deleting by id keeps every run provably
 * under the gate. A backlog simply clears over successive runs, which is the
 * correct behaviour for a daily job.
 */
export async function sweepExpiredPolls(
  options: { limit?: number } = {}
): Promise<StoredResult<{ deleted: number; remaining: number }>> {
  const limit = Math.min(options.limit ?? SWEEP_LIMIT, SWEEP_LIMIT);

  try {
    const supabase = requireAdminClient();
    const now = new Date().toISOString();

    const { data: due, error: selectError } = await supabase
      .from('polls')
      .select('id')
      .lt('expires_at', now)
      .order('expires_at', { ascending: true })
      .limit(limit);

    if (selectError) return { stored: false, error: selectError.message };
    if (!due || due.length === 0) return { stored: true, data: { deleted: 0, remaining: 0 } };

    const ids = due.map((row: { id: string }) => row.id);
    const { error: deleteError } = await supabase.from('polls').delete().in('id', ids);

    if (deleteError) return { stored: false, error: deleteError.message };

    // Report a full batch as a possible backlog so the cron can surface it
    // rather than quietly falling behind on a deletion promise.
    return {
      stored: true,
      data: { deleted: ids.length, remaining: ids.length === limit ? -1 : 0 },
    };
  } catch (error) {
    return { stored: false, error: error instanceof Error ? error.message : 'Unknown error.' };
  }
}
