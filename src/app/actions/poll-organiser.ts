'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import {
  ALREADY_CONFIRMED,
  closePoll,
  confirmOption as storeConfirmOption,
  deleteParticipant,
  deletePoll as storeDeletePoll,
  getConfirmRecipients,
  getOrganiserView,
  recordConfirmNotifyFailures,
  reopenPoll,
  type ConfirmedPollResult,
} from '@/lib/db/polls';
import { sendPollEmails, type PollEmail } from '@/lib/email';
import {
  buildConfirmEmail,
  formatOptionForEmail,
  formatOptionShortForSubject,
} from '@/lib/poll-emails';
import {
  buildCalendarLinks,
  buildPollIcs,
  ICS_CONTENT_CLASS_HEADER,
  ICS_FILENAME,
} from '@/lib/poll-ics';
import { scrubTokens } from '@/lib/poll-tokens';
import { checkRateLimit, getClientIp, hashKey, isRateLimitConfigured } from '@/lib/rate-limit';
import { getAbsoluteUrl } from '@/lib/site-config';
import { VALIDATION_MESSAGES } from '@/lib/validation-messages';
import { tokenSchema } from '@/lib/validation/poll-tokens';
import type { PollActionResult } from './polls';

/**
 * The organiser's four controls: stop the voting, pick the time, remove one
 * person's answers, and delete the poll outright.
 *
 * Shape follows `src/app/actions/polls.ts` — `'use server'`, a zod parse first,
 * an explicit `PollActionResult`, and a store-then-notify order where a failed
 * notification never turns a stored write into a user-facing error.
 *
 * AUTH IS THE ORGANISER TOKEN AND NOTHING ELSE. Every lookup here goes through
 * `.eq('organiser_token', ...)`, so a participant_token or an edit_token cannot
 * resolve. There is no session to check: holding the link IS the authorisation,
 * which is exactly why every delete is scoped by the poll the token resolved to
 * and never by an id the client supplied.
 *
 * FAIL-OPEN vs FAIL-CLOSED, deliberately split. `setPollOpen`, `deleteResponse`
 * and `deletePoll` fail OPEN on an unavailable rate limiter: they send no mail,
 * and locking an organiser out of their own poll because Upstash is down is the
 * worse failure. `confirmOption` fails CLOSED: it is a mail fan-out, and an
 * unthrottled endpoint that sends mail on our own sending domain is an open
 * relay that would damage deliverability for real client mail.
 */

const organiserTokenSchema = z.object({ organiserToken: tokenSchema });

const setPollOpenSchema = z.object({
  organiserToken: tokenSchema,
  open: z.boolean(),
});

const confirmOptionSchema = z.object({
  organiserToken: tokenSchema,
  optionId: z.string().uuid('That option is not valid.'),
});

const deleteResponseSchema = z.object({
  organiserToken: tokenSchema,
  participantId: z.string().uuid('That response is not valid.'),
});

/**
 * One string for a malformed token, an unknown token, an expired poll and a
 * deleted poll alike.
 *
 * Different copy per cause would make these actions an oracle: a caller could
 * walk tokens and learn which polls exist. The same reasoning as
 * `RESEND_NOT_PENDING` in `polls.ts`.
 */
const LINK_NOT_VALID = 'That link is not valid.';

const CONFIRM_UNAVAILABLE = 'Confirming is unavailable right now. Please try again shortly.';
const UPDATE_FAILED = 'The poll was not updated. Please try again.';
const CONFIRM_FAILED = 'The time was not confirmed. Please try again.';
const DELETE_RESPONSE_FAILED = 'That response was not removed. Please try again.';
const DELETE_POLL_FAILED =
  'The poll was not deleted. Please try again, or message Peter on WhatsApp.';

/** The client IP, for the rate limiter. */
function clientIp(): string {
  // headers() is synchronous on next 14. Do not await it.
  return getClientIp(headers());
}

/**
 * The per-organiser-IP gate, shared by the three non-mailing actions.
 *
 * Returns an error string to surface, or null to proceed. Fails OPEN — see the
 * module header.
 */
async function checkOrganiserLimit(): Promise<string | null> {
  try {
    const result = await checkRateLimit('poll_organiser_ip', hashKey(clientIp()));
    return result.allowed ? null : VALIDATION_MESSAGES.poll.rateLimited;
  } catch (error) {
    // Fail open. The action mutates one poll the caller already holds the link
    // to and sends nothing.
    console.error('[polls] Organiser rate limiter threw — allowing:', scrubTokens(String(error)));
    return null;
  }
}

/**
 * Re-render both screens after any organiser write.
 *
 * Both routes are `force-dynamic`, so this is belt-and-braces today. It is
 * called anyway because the behaviour must not depend on a single `dynamic`
 * export surviving a future refactor — the failure mode if it does not is an
 * organiser staring at a stale matrix, which reads as "the click did nothing".
 */
function revalidatePoll(organiserToken: string, participantToken?: string): void {
  revalidatePath(`/availability/o/${organiserToken}`);
  if (participantToken) {
    revalidatePath(`/availability/p/${participantToken}`);
  }
}

/**
 * Reads the poll's status so a no-op can be told from a refusal.
 *
 * Only called after a conditional update matched nothing — which means either
 * "already in that state" (idempotent success) or "in a state that forbids it".
 */
async function readStatus(organiserToken: string): Promise<string | null> {
  const view = await getOrganiserView(organiserToken);
  return view?.poll.status ?? null;
}

/**
 * Stops or restarts the voting.
 *
 * CLOSING IS REVERSIBLE AND CONFIRMING IS NOT — that asymmetry is the whole
 * reason this replaces the one-way `closePoll` the scope originally specified.
 * Closing only stops replies; it does not make the decision, does not delete
 * anything and does not send mail. The organiser knows they clicked it, and
 * nobody else needs telling until a time is confirmed.
 *
 * A CLOSED POLL CAN STILL BE CONFIRMED. That is `confirmOption`'s
 * `status in ('open','closed')`, not this function's business.
 */
export async function setPollOpen(
  organiserToken: string,
  open: boolean
): Promise<PollActionResult> {
  const parsed = setPollOpenSchema.safeParse({ organiserToken, open });
  if (!parsed.success) {
    return { error: LINK_NOT_VALID };
  }

  const limited = await checkOrganiserLimit();
  if (limited) return { error: limited };

  // One conditional update, so there is no read-then-write window. `closePoll`
  // filters on status = 'open'; `reopenPoll` on status = 'closed'.
  const result = open ? await reopenPoll(organiserToken) : await closePoll(organiserToken);

  if (!result.stored) {
    // Zero rows matched. Re-read to tell "already there" from "not allowed".
    const status = await readStatus(organiserToken);

    if (status === null) return { error: LINK_NOT_VALID };

    // Idempotent: the caller wanted this state and this state is what exists.
    if ((open && status === 'open') || (!open && status === 'closed')) {
      return { success: true };
    }

    if (status === 'draft') {
      return {
        error: open
          ? 'Confirm your email address before reopening this poll.'
          : 'Confirm your email address before closing this poll.',
      };
    }

    if (status === 'confirmed') {
      return { error: VALIDATION_MESSAGES.poll.alreadyConfirmed };
    }

    console.error(
      '[polls] Poll status not updated:',
      scrubTokens(result.error ?? 'Unknown error.')
    );
    return { error: UPDATE_FAILED };
  }

  revalidatePoll(organiserToken);
  return { success: true };
}

/**
 * Everything the fan-out sends, built once before the loop.
 *
 * Building per recipient would multiply the dateUtils throw risk by the
 * recipient count for no gain: only the greeting name and the `to` vary. The
 * poll link is poll-level, so it is loop-invariant too.
 */
interface ConfirmPayload {
  subject: string;
  icsAttached: boolean;
  icsValue?: string;
  build: (
    displayName: string,
    isOrganiserCopy: boolean
  ) => { subject: string; html: string; text: string };
}

function buildConfirmPayload(confirmed: ConfirmedPollResult): ConfirmPayload {
  const { poll, option, confirmSequence, participantToken } = confirmed;

  const optionForEmail = {
    optionKind: poll.option_kind,
    optionDate: option.option_date,
    startsAt: option.starts_at,
    endsAt: option.ends_at,
  };

  // Branches on option_kind. formatSlotRangeInLondon THROWS on a date-only
  // value, and formatDateInLondon on an instant — the branch lives inside
  // formatOptionForEmail, which is why this calls it rather than a formatter.
  const whenInWords = formatOptionForEmail(optionForEmail);
  const whenShort = formatOptionShortForSubject(optionForEmail);

  const participantUrl = getAbsoluteUrl(`/availability/p/${participantToken}`);

  const icsInput = {
    pollId: poll.id,
    optionKind: poll.option_kind,
    optionDate: option.option_date,
    startsAt: option.starts_at,
    endsAt: option.ends_at,
    title: poll.title,
    description: poll.description,
    agenda: poll.agenda,
    location: poll.location,
    organiserName: poll.organiser_name,
    organiserEmail: poll.organiser_email,
    participantUrl,
    confirmSequence,
  };

  const { value: icsValue, error: icsError } = buildPollIcs(icsInput);

  if (icsError) {
    // A calendar file that will not build must never suppress the notification
    // that the meeting is happening. Drop the attachment, drop the sentence
    // promising it, and send the words — which are the actual payload.
    console.error(
      `[poll-email] .ics build failed for poll ${poll.id}:`,
      scrubTokens(String(icsError))
    );
  }

  const { googleUrl, outlookUrl } = buildCalendarLinks(icsInput);
  const icsAttached = Boolean(icsValue);

  const build = (displayName: string, isOrganiserCopy: boolean) =>
    buildConfirmEmail({
      displayName,
      pollTitle: poll.title,
      description: poll.description,
      location: poll.location,
      organiserName: poll.organiser_name,
      whenInWords,
      whenShort,
      participantUrl,
      googleUrl,
      outlookUrl,
      icsAttached,
      isOrganiserCopy,
    });

  return { subject: build('', false).subject, icsAttached, icsValue, build };
}

/**
 * Builds the recipient set: the organiser, plus everyone who voted AND gave an
 * address.
 *
 * "EVERYONE INVITED" IS NOT A SET THIS FEATURE CAN ADDRESS, and no wording
 * anywhere may imply otherwise. There is no invitee list and no address book: a
 * `poll_participants` row exists only because someone voted, and an address is
 * on it only because that person typed it in. Someone who was sent the link and
 * never voted gets nothing, because we have never held their address. That is a
 * property of the design, not a gap in it — an address book is the open relay.
 *
 * The organiser is seeded FIRST so their `organiser_name` wins over whatever
 * `display_name` they happened to vote under, and so the dedupe is on the
 * address alone — the only thing that decides who gets an email.
 */
async function buildRecipients(
  pollId: string,
  organiserEmail: string,
  organiserName: string
): Promise<Array<{ email: string; displayName: string; isOrganiser: boolean }>> {
  const recipients = new Map<
    string,
    { email: string; displayName: string; isOrganiser: boolean }
  >();

  const organiserKey = organiserEmail.trim().toLowerCase();
  recipients.set(organiserKey, {
    email: organiserKey,
    displayName: organiserName,
    isOrganiser: true,
  });

  for (const row of await getConfirmRecipients(pollId)) {
    if (!recipients.has(row.email)) {
      recipients.set(row.email, {
        email: row.email,
        displayName: row.display_name,
        isOrganiser: false,
      });
    }
  }

  return [...recipients.values()];
}

/**
 * Picks the winning option, locks the poll and tells everyone.
 *
 * THE DOUBLE-TAP GUARD LIVES IN THE CONDITIONAL UPDATE, not here: `confirmOption`
 * in the data layer filters on `status in ('open','closed')`, so a second click
 * matches zero rows and returns ALREADY_CONFIRMED. This fans out ONLY when the
 * update matched a row. Without that, a double-tap mails twenty people twice.
 *
 * MAIL FAILING MUST NOT UN-CONFIRM THE POLL. The fan-out sits in a try/catch
 * after the write commits, and the poll URL stays live showing the confirmed
 * time — that is the durable record. The failure COUNT is written back so the
 * organiser can be told plainly that some people still need telling by hand.
 */
export async function confirmOption(
  organiserToken: string,
  optionId: string
): Promise<PollActionResult> {
  const parsed = confirmOptionSchema.safeParse({ organiserToken, optionId });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? LINK_NOT_VALID };
  }

  // Fail CLOSED: this is a mail fan-out. checkRateLimit returns
  // { allowed: false } on failure, but it cannot tell a caller that must fail
  // closed from one that must fail open, so the check is explicit.
  if (!isRateLimitConfigured() && process.env.NODE_ENV === 'production') {
    console.error('[polls] Rate limiter unavailable — refusing to confirm.');
    return { error: CONFIRM_UNAVAILABLE };
  }

  try {
    const limit = await checkRateLimit('poll_organiser_ip', hashKey(clientIp()));
    if (!limit.allowed) return { error: VALIDATION_MESSAGES.poll.rateLimited };
  } catch (error) {
    console.error('[polls] Rate limiter threw — refusing to confirm:', scrubTokens(String(error)));
    return { error: CONFIRM_UNAVAILABLE };
  }

  const result = await storeConfirmOption(organiserToken, optionId);

  if (!result.stored || !result.data) {
    if (result.error === ALREADY_CONFIRMED) {
      // The conditional update matched nothing: someone confirmed it first.
      // Return the message and fan out NOTHING.
      return { error: VALIDATION_MESSAGES.poll.alreadyConfirmed };
    }

    const status = await readStatus(organiserToken);
    if (status === null) return { error: LINK_NOT_VALID };
    if (status === 'draft') {
      return { error: 'Confirm your email address before confirming a time.' };
    }
    if (status === 'confirmed') {
      return { error: VALIDATION_MESSAGES.poll.alreadyConfirmed };
    }
    if (result.error === 'That option does not belong to this poll.') {
      return { error: 'That option is not valid.' };
    }

    console.error('[polls] Time not confirmed:', scrubTokens(result.error ?? 'Unknown error.'));
    return { error: CONFIRM_FAILED };
  }

  const confirmed = result.data;

  // Best-effort from here. The poll is already confirmed and the page shows the
  // time; nothing below may turn that into a user-facing error.
  try {
    await fanOutConfirmation(confirmed);
  } catch (error) {
    console.error(
      `[poll-email] Confirm fan-out threw for poll ${confirmed.poll.id}:`,
      scrubTokens(String(error))
    );
  }

  revalidatePoll(organiserToken, confirmed.participantToken);
  return { success: true };
}

/**
 * The fan-out itself. Separated so `confirmOption` reads as its own contract:
 * everything here is best-effort and nothing here can fail the action.
 */
async function fanOutConfirmation(confirmed: ConfirmedPollResult): Promise<void> {
  const { poll } = confirmed;

  const payload = buildConfirmPayload(confirmed);
  const recipients = await buildRecipients(poll.id, poll.organiser_email, poll.organiser_name);

  // Per §3.4 every send is gated on the per-poll fan-out bucket. The tokens are
  // taken here, before the loop, rather than interleaved with it: the bucket is
  // keyed on the poll and bounds total sends per poll per day, so consuming n
  // tokens up front and dropping the refused recipients is equivalent — and it
  // keeps the send loop as `sendPollEmails`, which already paces at 600ms for
  // Resend's 2/second limit. Hand-rolling a second paced loop here to interleave
  // the check would duplicate that pacing and is how 429s get in.
  const messages: PollEmail[] = [];
  let failures = 0;

  for (const recipient of recipients) {
    let allowed = false;
    try {
      const gate = await checkRateLimit('poll_send_fanout', hashKey(poll.id));
      allowed = gate.allowed;
    } catch (error) {
      console.error(
        `[poll-email] Fan-out limiter threw for poll ${poll.id}:`,
        scrubTokens(String(error))
      );
    }

    if (!allowed) {
      // A refusal is a failure like any other: counted and logged, never
      // surfaced, and it never aborts the remaining sends.
      failures++;
      continue;
    }

    const built = payload.build(recipient.displayName, recipient.isOrganiser);

    messages.push({
      to: recipient.email,
      subject: built.subject,
      html: built.html,
      text: built.text,
      // A "can't make it after all" needs to reach a human, and the organiser
      // is the only human involved.
      replyTo: poll.organiser_email,
      ...(payload.icsValue
        ? {
            attachments: [
              {
                filename: ICS_FILENAME,
                content: Buffer.from(payload.icsValue, 'utf8').toString('base64'),
              },
            ],
            // Outlook renders the calendar card only with this set.
            headers: { 'Content-Class': ICS_CONTENT_CLASS_HEADER },
          }
        : {}),
    });
  }

  // NO List-Unsubscribe on this email, and that is not an oversight:
  // buildUnsubscribeHeaders embeds the ORGANISER token in its URL, and this is
  // the one template that reaches participants. The confirmation is a one-off
  // transactional message, so it carries none — exactly as the verify and links
  // emails do.
  if (messages.length > 0) {
    const { failed } = await sendPollEmails(messages);
    failures += failed;
  }

  // The recipient's address is never logged. The poll id is enough to
  // investigate, and a log line naming one undoes the whole point of the
  // per-recipient loop.
  if (failures > 0) {
    console.error(
      `[poll-email] Confirm fan-out for poll ${poll.id} failed for ${failures} of ${recipients.length} recipients.`
    );
  }

  // A COUNT. Never an address. Written even at zero, so a re-confirm that
  // succeeds clears a previous run's note.
  await recordConfirmNotifyFailures(poll.id, failures);
}

/**
 * Removes one participant and their answers.
 *
 * Data destruction, so a confirmation dialogue naming the participant is
 * mandatory in the UI. It is gated there rather than here because the action
 * cannot know whether the caller has been asked.
 *
 * THE POLL SCOPE IS LOAD-BEARING. `deleteParticipant` filters on
 * `poll_id = <the token's poll>`; without it, an organiser of poll A deletes a
 * participant of poll B by pasting an id. The composite FK on `poll_responses`
 * cascades the votes automatically — never delete them by hand.
 */
export async function deleteResponse(
  organiserToken: string,
  participantId: string
): Promise<PollActionResult> {
  const parsed = deleteResponseSchema.safeParse({ organiserToken, participantId });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? LINK_NOT_VALID };
  }

  const limited = await checkOrganiserLimit();
  if (limited) return { error: limited };

  const status = await readStatus(organiserToken);
  if (status === null) return { error: LINK_NOT_VALID };

  // Refused server-side, not merely hidden in the UI: a request can arrive from
  // anywhere.
  if (status === 'confirmed') {
    return { error: VALIDATION_MESSAGES.poll.responsesLocked };
  }

  const result = await deleteParticipant(organiserToken, participantId);

  if (!result.stored) {
    console.error('[polls] Response not removed:', scrubTokens(result.error ?? 'Unknown error.'));
    return { error: DELETE_RESPONSE_FAILED };
  }

  revalidatePoll(organiserToken);
  return { success: true };
}

/**
 * Deletes the poll and everything under it.
 *
 * ALLOWED IN EVERY STATUS, INCLUDING 'confirmed'. This is the organiser's
 * Article 17 route and the only self-service erasure path in the feature;
 * refusing it on a confirmed poll would make erasure conditional on the poll's
 * state, which is not a defensible position.
 *
 * Irreversible, and it destroys THIRD-PARTY data — every participant's name,
 * address and availability, not only the organiser's own. The UI therefore
 * requires the poll title to be typed, not just a click.
 */
export async function deletePoll(organiserToken: string): Promise<PollActionResult> {
  const parsed = organiserTokenSchema.safeParse({ organiserToken });
  if (!parsed.success) {
    return { error: LINK_NOT_VALID };
  }

  const limited = await checkOrganiserLimit();
  if (limited) return { error: limited };

  const result = await storeDeletePoll(organiserToken);

  if (!result.stored) {
    console.error('[polls] Poll not deleted:', scrubTokens(result.error ?? 'Unknown error.'));
    return { error: DELETE_POLL_FAILED };
  }

  // Idempotent by construction: a delete that matches no row is the desired end
  // state, and `deletePoll` reports that as stored.
  revalidatePoll(organiserToken);
  return { success: true };
}
