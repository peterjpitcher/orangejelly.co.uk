'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import {
  submitResponse as storeResponse,
  updateResponse as storeUpdatedResponse,
} from '@/lib/db/polls';
import {
  checkRateLimit,
  getClientIp,
  hashKey,
  isRateLimitConfigured,
  type RateLimitBucket,
} from '@/lib/rate-limit';
import { isWellFormedToken, scrubTokens } from '@/lib/poll-tokens';
import { canVote } from '@/lib/poll-state';
import { VALIDATION_MESSAGES } from '@/lib/validation-messages';
import { COMPANY } from '@/lib/constants';
import {
  answersCoverAllOptions,
  normaliseOptionalEmail,
  submitResponseSchema,
  updateResponseSchema,
  type SubmitResponseInput,
  type UpdateResponseInput,
} from '@/lib/validation/poll-responses';
import { getParticipantView } from '@/lib/db/polls';
import { resolveEditParticipant } from '@/app/availability/p/poll-data';

/**
 * Participant-facing server actions: answer a poll, and change your answer.
 *
 * Follows the `contact.ts` shape — honeypot first, validate server-side, call the
 * data layer, return `{ success }` or `{ error }`. Never throw at the caller: a
 * thrown server action renders a generic error boundary, and this form is the
 * one screen that has to work on a phone in a pub car park.
 *
 * Auth model: the participant token grants voting and nothing else. The edit
 * token grants editing that one participant's answers and nothing else. Neither
 * grants results, close, confirm or delete.
 */

export interface SubmitResponseResult {
  success?: boolean;
  error?: string;
  /** Shown on screen. This is the only place the edit link is ever delivered. */
  editUrl?: string;
}

export interface UpdateResponseResult {
  success?: boolean;
  error?: string;
}

/** Identical for unknown, malformed, draft and expired. Never say which. */
const LINK_NOT_VALID = VALIDATION_MESSAGES.poll.linkNotValid;

/**
 * Rate limiting for voting fails OPEN.
 *
 * A limiter outage must not stop a licensee answering. The trade is deliberate
 * and asymmetric: a missed limit costs us some junk rows the organiser can
 * delete; a false block costs a real person their reply, with no account to
 * appeal through and no way to tell they were blocked in error.
 *
 * `reason` is what makes that possible. It reports WHY, which is a different
 * question from whether the hit was allowed: an outage and a genuine limit hit
 * both arrive as `allowed: false`, so without it this function could not tell
 * them apart and voting was silently fail-CLOSED — the opposite of the intent
 * above, and on the one action the whole tool exists to make effortless.
 * `unavailable` therefore allows here, while `limited` denies.
 */
async function withinLimit(bucket: RateLimitBucket, key: string): Promise<boolean> {
  if (!isRateLimitConfigured()) return true;

  try {
    const { allowed, reason } = await checkRateLimit(bucket, hashKey(key));
    if (reason === 'unavailable') {
      console.error('[polls] Rate limiter unavailable; allowing the vote.');
      return true;
    }
    return allowed;
  } catch (error) {
    console.error('[polls] Rate limiter threw; allowing the vote.', error);
    return true;
  }
}

function clientIp(): string {
  return getClientIp(headers());
}

/** The participant paths a write invalidates. The organiser's is Stream F's. */
function revalidateParticipantPaths(participantToken: string): void {
  revalidatePath(`/availability/p/${participantToken}`);
}

/**
 * Records a first-time response.
 *
 * Insert-only. There is no conflict target for someone with no identity, so a
 * returning participant who does not use their edit link creates a second row.
 * That is accepted, not solved — engineering identity into an account-free tool
 * means adding accounts, which is the one thing this tool exists not to do.
 */
export async function submitResponse(
  participantToken: string,
  input: SubmitResponseInput
): Promise<SubmitResponseResult> {
  // Honeypot short-circuit, first statement, exactly as contact.ts does it.
  // Reports success and writes nothing: telling a bot it was caught only tells
  // it what to change.
  if (input.website) {
    return { success: true };
  }

  if (!isWellFormedToken(participantToken)) {
    return { error: LINK_NOT_VALID };
  }

  const parsed = submitResponseSchema.safeParse(input);
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? VALIDATION_MESSAGES.generic.validationFailed,
    };
  }

  if (!(await withinLimit('poll_respond_ip', clientIp()))) {
    return { error: VALIDATION_MESSAGES.poll.rateLimited };
  }

  // Resolves the poll and its options in one sanctioned read. `getParticipantView`
  // returns null for a draft as well as for an unknown token, which is the
  // behaviour we want: a draft must not be distinguishable from a bad guess.
  const view = await getParticipantView(participantToken);
  if (!view) {
    return { error: LINK_NOT_VALID };
  }

  // Expiry is checked at request time, not left to the sweep. The cron is
  // periodic, so between expiry and collection an expired poll would otherwise
  // still take votes (§1 O9.6).
  if (new Date(view.poll.expires_at).getTime() <= Date.now()) {
    return { error: LINK_NOT_VALID };
  }

  if (!canVote(view.poll.status)) {
    return { error: VALIDATION_MESSAGES.poll.votingClosed };
  }

  // `closes_at` is advisory — nothing flips `status` when it passes — so this
  // check is what makes the organiser's deadline real without a cron.
  if (view.poll.closes_at && new Date(view.poll.closes_at).getTime() <= Date.now()) {
    return { error: VALIDATION_MESSAGES.poll.votingClosed };
  }

  if (!(await withinLimit('poll_respond_poll', view.poll.id))) {
    return { error: VALIDATION_MESSAGES.poll.rateLimited };
  }

  const optionIds = view.options.map((option) => option.id);
  const answeredIds = parsed.data.votes.map((vote) => vote.optionId);
  if (!answersCoverAllOptions(optionIds, answeredIds)) {
    return { error: VALIDATION_MESSAGES.poll.answerEveryOption };
  }

  const email = normaliseOptionalEmail(parsed.data.email);
  const stored = await storeResponse({
    participantToken,
    displayName: parsed.data.displayName,
    email: email ?? undefined,
    answers: parsed.data.votes.map((vote) => ({
      optionId: vote.optionId,
      availability: vote.availability,
    })),
  });

  if (!stored.stored || !stored.data) {
    console.error('[polls] Response not recorded:', scrubTokens(stored.error ?? 'unknown error'));
    return { error: 'Your answer was not recorded. Please try again.' };
  }

  revalidateParticipantPaths(participantToken);

  // The edit link is returned for the screen and delivered nowhere else. There
  // is no participant email — dropped deliberately (Peter, 16 July 2026),
  // because it would have mailed an address that an anonymous caller typed into
  // a public form, and the screen already carries the link.
  return {
    success: true,
    editUrl: `${COMPANY.website}/availability/p/${participantToken}/edit/${stored.data.editToken}`,
  };
}

/**
 * Changes an existing response.
 *
 * Resolved from the edit token alone (§1 P2.5). Any participant token in the URL
 * is decoration: it is not compared, not looked up and not trusted.
 */
export async function updateResponse(
  editToken: string,
  input: UpdateResponseInput
): Promise<UpdateResponseResult> {
  if (input.website) {
    return { success: true };
  }

  if (!isWellFormedToken(editToken)) {
    return { error: LINK_NOT_VALID };
  }

  const parsed = updateResponseSchema.safeParse(input);
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? VALIDATION_MESSAGES.generic.validationFailed,
    };
  }

  if (!(await withinLimit('poll_update_ip', clientIp()))) {
    return { error: VALIDATION_MESSAGES.poll.rateLimited };
  }

  const resolved = await resolveEditParticipant(editToken);
  if (!resolved) {
    return { error: LINK_NOT_VALID };
  }

  if (new Date(resolved.poll.expires_at).getTime() <= Date.now()) {
    return { error: LINK_NOT_VALID };
  }

  if (!canVote(resolved.poll.status)) {
    return { error: VALIDATION_MESSAGES.poll.votingClosed };
  }

  if (resolved.poll.closes_at && new Date(resolved.poll.closes_at).getTime() <= Date.now()) {
    return { error: VALIDATION_MESSAGES.poll.votingClosed };
  }

  // The set-equality check and the upsert are a pair. `updateResponse` in the
  // data layer never prunes — it overwrites the rows it is given and leaves any
  // option it is not given alone. That is safe ONLY because this check has
  // already proven the payload is the complete option set. Remove this check and
  // the upsert silently becomes a partial update.
  const optionIds = resolved.options.map((option) => option.id);
  const answeredIds = parsed.data.votes.map((vote) => vote.optionId);
  if (!answersCoverAllOptions(optionIds, answeredIds)) {
    return { error: VALIDATION_MESSAGES.poll.answerEveryOption };
  }

  const stored = await storeUpdatedResponse({
    editToken,
    displayName: parsed.data.displayName,
    answers: parsed.data.votes.map((vote) => ({
      optionId: vote.optionId,
      availability: vote.availability,
    })),
  });

  if (!stored.stored) {
    console.error('[polls] Change not recorded:', scrubTokens(stored.error ?? 'unknown error'));
    return { error: 'Your changes were not recorded. Please try again.' };
  }

  revalidateParticipantPaths(resolved.poll.participant_token);
  revalidatePath(`/availability/p/${resolved.poll.participant_token}/edit/${editToken}`);

  return { success: true };
}
