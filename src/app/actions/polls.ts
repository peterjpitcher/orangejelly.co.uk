'use server';

import { headers } from 'next/headers';
import {
  claimResendSlot,
  createPoll as storePoll,
  deletePoll,
  getResendTarget,
  issueVerifyToken,
  refreshVerifyToken,
  verifyAndOpenPoll,
} from '@/lib/db/polls';
import { sendPollEmail } from '@/lib/email';
import { buildLinksEmail, buildVerifyEmail } from '@/lib/poll-emails';
import { scrubTokens } from '@/lib/poll-tokens';
import { checkRateLimit, getClientIp, hashKey, isRateLimitConfigured } from '@/lib/rate-limit';
import { getAbsoluteUrl } from '@/lib/site-config';
import { isTurnstileConfigured, verifyTurnstileToken } from '@/lib/turnstile';
import { VALIDATION_MESSAGES } from '@/lib/validation-messages';
import {
  buildPollOptions,
  createPollSchema,
  type CreatePollFormValues,
} from '@/lib/validation/polls';
// Server-only, and kept out of @/lib/validation/polls so the create form does
// not drag Node's crypto shim into the browser. See the note in that file.
import { resendVerificationSchema, verifyOrganiserEmailSchema } from '@/lib/validation/poll-tokens';

/**
 * Server actions for availability polls: build one, prove the organiser's
 * address, and re-send that proof when it goes astray.
 *
 * Shape follows src/app/actions/contact.ts — `'use server'`, an explicit
 * `{ success?: boolean; error?: string }` return, the honeypot short-circuiting
 * before anything else, and a store-then-notify order where a failed
 * notification never turns a stored record into a user-facing error.
 *
 * What is different from contact.ts, and why: these actions validate with zod
 * (contact.ts hand-rolls if-chains), and they fail CLOSED on an unavailable
 * Turnstile or rate limiter. Refusing to create a poll is recoverable. An
 * unthrottled endpoint that sends mail on our own sending domain is an open
 * relay, and it would damage deliverability for real client mail.
 */

export interface PollActionResult {
  success?: boolean;
  error?: string;
  /**
   * Re-sends the verify email for this one poll, to the address already on the
   * row. Held in client state only and never written to a URL.
   *
   * Never a poll capability: participant_token, organiser_token and verify_token
   * are never returned to the browser. The organiser gets the verify link by
   * email, and receiving it is what proves they own the address.
   */
  resendToken?: string;
}

/** The two links verification reveals, ready to render. */
export interface PollLinks {
  participantUrl: string;
  organiserUrl: string;
  organiserToken: string;
}

/**
 * Verification's result.
 *
 * This one DOES carry poll capabilities, unlike createPoll's — and the
 * distinction is the whole point of the feature. Holding an unexpired verify
 * token is proof the caller owns the organiser's inbox, so the links are exactly
 * what they have earned. createPoll has no such proof, which is why it returns
 * nothing but a resend token.
 *
 * These are rendered by a Server Component into the response for the request
 * that carried the verify token. They never reach a client bundle.
 */
export interface VerifyActionResult {
  success?: boolean;
  error?: string;
  links?: PollLinks;
}

/** Fail-closed copy. Identical for a missing Turnstile and a missing limiter. */
const UNAVAILABLE = 'Poll creation is unavailable right now. Please try again shortly.';
const WRITE_FAILED = 'Your poll was not created. Please try again, or message Peter on WhatsApp.';
const TURNSTILE_FAILED = 'Please complete the verification check.';

/**
 * One string for an unknown, consumed, expired or already-live resend token.
 *
 * Four causes, one sentence. Different copy per cause would make this endpoint
 * an oracle: a caller could walk tokens and learn which polls exist.
 */
const RESEND_NOT_PENDING = 'That poll is already live — check your inbox for the links.';
const RESEND_MAIL_FAILED = 'We could not send that email. Please message Peter on WhatsApp.';
const RESEND_UNAVAILABLE = 'Sending is unavailable right now. Please try again shortly.';

/** The first issue's message. The form renders it inline against the field. */
function firstIssueMessage(error: { issues: Array<{ message: string }> }): string {
  return error.issues[0]?.message ?? 'Please check the form and try again.';
}

/** The client IP, for the rate limiter and Turnstile's hint. */
function clientIp(): string {
  // headers() is synchronous on next 14. Do not await it.
  return getClientIp(headers());
}

/**
 * Creates a poll in 'draft' and emails the organiser a link to publish it.
 *
 * Order is load-bearing and matches SPEC §3.6.1: honeypot, then shape, then
 * Turnstile, then the two rate-limit buckets, then the write. Every gate that
 * costs a round-trip sits behind one that does not.
 */
export async function createPoll(input: CreatePollFormValues): Promise<PollActionResult> {
  // Honeypot first, before parsing. A bot gets a fake success: no write, no
  // mail, and no resendToken — so the fake success cannot be used to mail
  // anyone. Mirrors contact.ts.
  if (input.website) {
    return { success: true };
  }

  const parsed = createPollSchema.safeParse(input);
  if (!parsed.success) {
    return { error: firstIssueMessage(parsed.error) };
  }
  const data = parsed.data;

  const ip = clientIp();

  // Turnstile before the limiter: the limiter is keyed per IP, and a proxy pool
  // defeats a per-IP limit outright. Turnstile is what makes the IP bucket mean
  // something.
  if (!isTurnstileConfigured() && process.env.NODE_ENV === 'production') {
    console.error('[polls] Turnstile unavailable — refusing to create.');
    return { error: UNAVAILABLE };
  }

  const turnstile = await verifyTurnstileToken(data.turnstileToken, ip);
  if (!turnstile.success) {
    return { error: TURNSTILE_FAILED };
  }

  // Fail closed on an unconfigured limiter in production. checkRateLimit itself
  // returns { allowed: false } on failure, but it cannot tell a caller that must
  // fail closed from one that must fail open, so the check is explicit here.
  if (!isRateLimitConfigured() && process.env.NODE_ENV === 'production') {
    console.error('[polls] Rate limiter unavailable — refusing to create.');
    return { error: UNAVAILABLE };
  }

  try {
    const byIp = await checkRateLimit('poll_create_ip', hashKey(ip));
    if (!byIp.allowed) return { error: VALIDATION_MESSAGES.poll.rateLimited };

    const byEmail = await checkRateLimit('poll_create_email', hashKey(data.organiserEmail));
    if (!byEmail.allowed) return { error: VALIDATION_MESSAGES.poll.rateLimited };
  } catch (error) {
    console.error('[polls] Rate limiter threw — refusing to create:', error);
    return { error: UNAVAILABLE };
  }

  // Wall clock becomes instant here, and the spring-forward gap is caught rather
  // than allowed to 500 the action. The message is already user-facing.
  const built = buildPollOptions(data);
  if (built.error !== undefined || built.options === undefined) {
    return { error: built.error ?? 'Please check your options and try again.' };
  }

  const stored = await storePoll({
    title: data.title,
    description: data.description,
    agenda: data.agenda,
    location: data.location,
    organiserName: data.organiserName,
    organiserEmail: data.organiserEmail,
    optionKind: data.optionKind,
    options: built.options,
  });

  if (!stored.stored || !stored.data) {
    console.error('[polls] Poll not created:', scrubTokens(stored.error ?? 'Unknown error.'));
    return { error: WRITE_FAILED };
  }

  const { pollId, participantToken, organiserToken } = stored.data;

  // A draft with no verify token is unreachable by anyone — it can never be
  // published and never be re-sent. Delete it rather than leave it for the
  // sweep to find in 60 days.
  const tokens = await issueVerifyToken(pollId);
  if (!tokens.stored || !tokens.data) {
    console.error(
      '[polls] Verify token not issued:',
      scrubTokens(tokens.error ?? 'Unknown error.')
    );
    await deletePoll(organiserToken);
    return { error: WRITE_FAILED };
  }

  const { verifyToken, resendToken } = tokens.data;

  // Best-effort, exactly as contact.ts states: the poll is already stored, so a
  // failed or unconfigured send must never turn a stored poll into a user-facing
  // error. The success state carries the "Send it again" control, which is the
  // recovery route.
  //
  // Note what this email does NOT carry: the participant link or the organiser
  // link. Neither exists to the user until the poll is live, and this is the most
  // forwardable message the feature sends.
  const verifyUrl = getAbsoluteUrl(`/availability/verify/${verifyToken}`);

  // Development only: print the magic link to the terminal.
  //
  // Without this the feature cannot be exercised locally at all, and the reason
  // is a pincer between two things that are each individually correct.
  // sendPollEmail refuses to send unless the base URL is the production host,
  // which is right — a preview deploy must never mail a licensee. But
  // getBaseUrl() falls back to the production host when NEXT_PUBLIC_BASE_URL is
  // unset, so a local run either sends a real email whose link points at
  // production (where the poll does not exist), or sets the base URL to
  // localhost and has the send correctly refused. Neither leaves a way in.
  //
  // Printing the link is the standard escape and it leaks nothing: the token is
  // already in this process, and the gate is NODE_ENV, which is 'production' on
  // every Vercel deployment including previews — so this cannot be switched on
  // from the dashboard.
  if (process.env.NODE_ENV !== 'production') {
    console.info(
      `\n[polls] DEV ONLY — verification link for "${data.title}":\n  ${verifyUrl}\n  (printed because poll mail does not send outside production)\n`
    );
  }

  try {
    const email = buildVerifyEmail({
      organiserName: data.organiserName,
      pollTitle: data.title,
      verifyUrl,
    });

    const sent = await sendPollEmail({ to: data.organiserEmail, ...email });
    if (sent.error) {
      console.error(
        '[polls] Poll created but verification mail not sent:',
        scrubTokens(sent.error)
      );
    }
  } catch (error) {
    console.error('[polls] Poll created but verification mail threw:', scrubTokens(String(error)));
  }

  // participantToken is deliberately unused here: the poll is a draft, its
  // participant link does not work yet, and returning it would leak a capability
  // the verify email exists to gate.
  void participantToken;

  return { success: true, resendToken };
}

/**
 * Publishes a poll once the organiser has proved the address.
 *
 * The token is a `verify_token` — never the organiser token. The verify link is
 * single-use and expires in 24 hours; `resendVerification` is the recovery path
 * when it lapses.
 */
export async function verifyOrganiserEmail(token: string): Promise<VerifyActionResult> {
  const parsed = verifyOrganiserEmailSchema.safeParse({ token });
  if (!parsed.success) {
    // No database round-trip on an obviously malformed token.
    return { error: VALIDATION_MESSAGES.poll.linkNotValid };
  }

  // Fail OPEN, unlike createPoll. This action sends no mail on the abusive path
  // and the token is unguessable, so an unavailable limiter must not stop a real
  // organiser publishing the poll they already paid for with their attention.
  try {
    const limited = await checkRateLimit('poll_verify_ip', hashKey(clientIp()));
    if (!limited.allowed && isRateLimitConfigured()) {
      return { error: VALIDATION_MESSAGES.poll.rateLimited };
    }
  } catch (error) {
    console.error('[polls] Rate limiter threw on verify — allowing:', error);
  }

  const result = await verifyAndOpenPoll(parsed.data.token);

  if (!result.stored || !result.data) {
    // Byte-identical for an unknown token, a consumed one, an expired one and a
    // poll that is already open. Different copy makes this an existence oracle.
    return { error: VALIDATION_MESSAGES.poll.linkNotValid };
  }

  const poll = result.data;
  const participantUrl = getAbsoluteUrl(`/availability/p/${poll.participantToken}`);
  const organiserUrl = getAbsoluteUrl(`/availability/o/${poll.organiserToken}`);

  // Best-effort, and the reason a scanner prefetch consuming the token is
  // survivable: the organiser's links reach them by mail regardless of who or
  // what clicked first.
  try {
    const email = buildLinksEmail({
      organiserName: poll.organiserName,
      pollTitle: poll.title,
      participantUrl,
      organiserUrl,
    });

    const sent = await sendPollEmail({ to: poll.organiserEmail, ...email });
    if (sent.error) {
      console.error('[polls] Poll live but links mail not sent:', scrubTokens(sent.error));
    }
  } catch (error) {
    console.error('[polls] Poll live but links mail threw:', scrubTokens(String(error)));
  }

  return {
    success: true,
    links: { participantUrl, organiserUrl, organiserToken: poll.organiserToken },
  };
}

/**
 * Re-sends the verify email for one draft poll.
 *
 * It never takes an address. The recipient is the one already stored on the row,
 * so there is no path here to mail an address the caller supplies — which is
 * what keeps this off the relay surface. It exists because the alternative,
 * asking for the email address again, is an address-enumeration oracle.
 */
export async function resendVerification(resendToken: string): Promise<PollActionResult> {
  const parsed = resendVerificationSchema.safeParse({ resendToken });
  if (!parsed.success) {
    return { error: RESEND_NOT_PENDING };
  }

  let target: Awaited<ReturnType<typeof getResendTarget>>;
  try {
    target = await getResendTarget(parsed.data.resendToken);
  } catch (error) {
    console.error('[polls] Resend lookup threw:', scrubTokens(String(error)));
    return { error: RESEND_UNAVAILABLE };
  }

  if (!target) {
    return { error: RESEND_NOT_PENDING };
  }

  // Fail closed: this path sends mail.
  if (!isRateLimitConfigured() && process.env.NODE_ENV === 'production') {
    console.error('[polls] Rate limiter unavailable — refusing to re-send.');
    return { error: RESEND_UNAVAILABLE };
  }

  try {
    const limited = await checkRateLimit('poll_resend_poll', hashKey(target.id));
    if (!limited.allowed) return { error: VALIDATION_MESSAGES.poll.rateLimited };
  } catch (error) {
    console.error('[polls] Rate limiter threw on re-send — refusing:', error);
    return { error: RESEND_UNAVAILABLE };
  }

  // The 60-second cooldown, claimed atomically. Two taps a millisecond apart
  // cannot both send.
  const claimed = await claimResendSlot(target.id);
  if (!claimed) {
    return { error: VALIDATION_MESSAGES.poll.rateLimited };
  }

  // A link that expired while the organiser was hunting for it should still
  // work, so mint a fresh one rather than send a dead link.
  let verifyToken = target.verifyToken;
  const expired =
    !target.verifyTokenExpiresAt || new Date(target.verifyTokenExpiresAt).getTime() <= Date.now();

  if (!verifyToken || expired) {
    const refreshed = await refreshVerifyToken(target.id);
    if (!refreshed.stored || !refreshed.data) {
      return { error: RESEND_NOT_PENDING };
    }
    verifyToken = refreshed.data.verifyToken;
  }

  // Surfaced, unlike everywhere else: re-sending the mail is the entire and only
  // purpose of this call, so a silent success would be a lie.
  try {
    const email = buildVerifyEmail({
      organiserName: target.organiserName,
      pollTitle: target.title,
      verifyUrl: getAbsoluteUrl(`/availability/verify/${verifyToken}`),
    });

    const sent = await sendPollEmail({ to: target.organiserEmail, ...email });
    if (sent.error) {
      console.error('[polls] Verification mail not re-sent:', scrubTokens(sent.error));
      return { error: RESEND_MAIL_FAILED };
    }
  } catch (error) {
    console.error('[polls] Verification mail threw on re-send:', scrubTokens(String(error)));
    return { error: RESEND_MAIL_FAILED };
  }

  return { success: true };
}
