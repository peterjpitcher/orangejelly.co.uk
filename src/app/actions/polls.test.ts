import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createPoll, resendVerification, verifyOrganiserEmail } from './polls';
import type { CreatePollFormValues } from '@/lib/validation/polls';
import type * as EmailModule from '@/lib/email';

/**
 * Server action tests.
 *
 * Every external service is mocked — the repo's rule is that tests never reach a
 * real one. The data layer is mocked too, so these prove the ACTION's ordering,
 * its gates and its failure copy; src/lib/db/polls.test.ts proves the queries.
 */

const storePoll = vi.fn();
const issueVerifyToken = vi.fn();
const verifyAndOpenPoll = vi.fn();
const getResendTarget = vi.fn();
const claimResendSlot = vi.fn();
const refreshVerifyToken = vi.fn();
const deletePoll = vi.fn();

vi.mock('@/lib/db/polls', () => ({
  createPoll: (...args: unknown[]) => storePoll(...args),
  issueVerifyToken: (...args: unknown[]) => issueVerifyToken(...args),
  verifyAndOpenPoll: (...args: unknown[]) => verifyAndOpenPoll(...args),
  getResendTarget: (...args: unknown[]) => getResendTarget(...args),
  claimResendSlot: (...args: unknown[]) => claimResendSlot(...args),
  refreshVerifyToken: (...args: unknown[]) => refreshVerifyToken(...args),
  deletePoll: (...args: unknown[]) => deletePoll(...args),
}));

const sendPollEmail = vi.fn();
vi.mock('@/lib/email', async (importOriginal) => {
  const actual = await importOriginal<typeof EmailModule>();
  return { ...actual, sendPollEmail: (...args: unknown[]) => sendPollEmail(...args) };
});

const verifyTurnstileToken = vi.fn();
const isTurnstileConfigured = vi.fn(() => true);
vi.mock('@/lib/turnstile', () => ({
  verifyTurnstileToken: (...args: unknown[]) => verifyTurnstileToken(...args),
  isTurnstileConfigured: () => isTurnstileConfigured(),
}));

const checkRateLimit = vi.fn();
const isRateLimitConfigured = vi.fn(() => true);
vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: (...args: unknown[]) => checkRateLimit(...args),
  isRateLimitConfigured: () => isRateLimitConfigured(),
  hashKey: (value: string) => `hashed:${value}`,
  getClientIp: () => '203.0.113.7',
  RATE_LIMIT_MESSAGE: 'Too many attempts. Please try again in a few minutes.',
}));

vi.mock('next/headers', () => ({ headers: () => new Map() }));

const FUTURE = '2099-07-04';
const TOKEN = 'aaaaaaaaaaaaaaaaaaaaaa'; // 22 chars — a well-formed token shape.
const OTHER_TOKEN = 'bbbbbbbbbbbbbbbbbbbbbb';

function validInput(overrides: Partial<CreatePollFormValues> = {}): CreatePollFormValues {
  return {
    title: 'Quiz night briefing',
    description: '',
    agenda: '',
    location: '',
    organiserName: 'Peter',
    organiserEmail: 'peter@orangejelly.co.uk',
    optionKind: 'dates',
    dates: [{ date: FUTURE }, { date: '2099-07-05' }],
    slots: undefined,
    turnstileToken: 'turnstile-token',
    website: '',
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, 'error').mockImplementation(() => {});

  isTurnstileConfigured.mockReturnValue(true);
  isRateLimitConfigured.mockReturnValue(true);
  verifyTurnstileToken.mockResolvedValue({ success: true });
  checkRateLimit.mockResolvedValue({ allowed: true, retryAfterSeconds: 0 });
  sendPollEmail.mockResolvedValue({ success: true });

  storePoll.mockResolvedValue({
    stored: true,
    data: { pollId: 'poll-1', participantToken: 'p-token', organiserToken: 'o-token' },
  });
  issueVerifyToken.mockResolvedValue({
    stored: true,
    data: { verifyToken: 'v-token', resendToken: 'r-token' },
  });
  claimResendSlot.mockResolvedValue(true);
});

describe('createPoll', () => {
  it('should return a fake success without storing when the honeypot is filled', async () => {
    const result = await createPoll(validInput({ website: 'https://spam.example' }));

    expect(result).toEqual({ success: true });
    expect(storePoll).not.toHaveBeenCalled();
    expect(sendPollEmail).not.toHaveBeenCalled();
    // The fake success must not carry a resend token, or it becomes a way to
    // make us send mail.
    expect(result.resendToken).toBeUndefined();
  });

  it('should check the honeypot before validating, so a bot never learns the rules', async () => {
    const result = await createPoll(validInput({ website: 'spam', title: '' }));
    expect(result).toEqual({ success: true });
  });

  it('should return the first validation message when the input is invalid', async () => {
    const result = await createPoll(validInput({ title: 'no' }));

    expect(result.error).toBe('Give the poll a title of at least 3 characters.');
    expect(storePoll).not.toHaveBeenCalled();
  });

  it('should verify the turnstile token server-side before storing anything', async () => {
    await createPoll(validInput());

    expect(verifyTurnstileToken).toHaveBeenCalledWith('turnstile-token', '203.0.113.7');
  });

  it('should refuse when the turnstile token does not verify', async () => {
    verifyTurnstileToken.mockResolvedValue({ success: false });

    const result = await createPoll(validInput());

    expect(result.error).toBe('Please complete the verification check.');
    expect(storePoll).not.toHaveBeenCalled();
  });

  it('should fail closed when turnstile is not configured in production', async () => {
    const original = process.env.NODE_ENV;
    vi.stubEnv('NODE_ENV', 'production');
    isTurnstileConfigured.mockReturnValue(false);

    const result = await createPoll(validInput());

    expect(result.error).toBe('Poll creation is unavailable right now. Please try again shortly.');
    expect(storePoll).not.toHaveBeenCalled();
    vi.stubEnv('NODE_ENV', original ?? 'test');
  });

  it('should fail closed when the rate limiter is not configured in production', async () => {
    const original = process.env.NODE_ENV;
    vi.stubEnv('NODE_ENV', 'production');
    isRateLimitConfigured.mockReturnValue(false);

    const result = await createPoll(validInput());

    expect(result.error).toBe('Poll creation is unavailable right now. Please try again shortly.');
    expect(storePoll).not.toHaveBeenCalled();
    vi.stubEnv('NODE_ENV', original ?? 'test');
  });

  it('should fail closed when the rate limiter throws', async () => {
    checkRateLimit.mockRejectedValue(new Error('limiter down'));

    const result = await createPoll(validInput());

    expect(result.error).toBe('Poll creation is unavailable right now. Please try again shortly.');
    expect(storePoll).not.toHaveBeenCalled();
  });

  it('should hash both rate-limit keys rather than pass a raw IP or address', async () => {
    await createPoll(validInput());

    expect(checkRateLimit).toHaveBeenCalledWith('poll_create_ip', 'hashed:203.0.113.7');
    expect(checkRateLimit).toHaveBeenCalledWith(
      'poll_create_email',
      'hashed:peter@orangejelly.co.uk'
    );
  });

  it('should refuse when the IP rate limit is hit', async () => {
    checkRateLimit.mockResolvedValueOnce({ allowed: false, retryAfterSeconds: 60 });

    const result = await createPoll(validInput());

    expect(result.error).toBe('Too many attempts. Please try again in a few minutes.');
    expect(storePoll).not.toHaveBeenCalled();
  });

  it('should refuse when the email rate limit is hit', async () => {
    checkRateLimit
      .mockResolvedValueOnce({ allowed: true, retryAfterSeconds: 0 })
      .mockResolvedValueOnce({ allowed: false, retryAfterSeconds: 60 });

    const result = await createPoll(validInput());

    expect(result.error).toBe('Too many attempts. Please try again in a few minutes.');
    expect(storePoll).not.toHaveBeenCalled();
  });

  it('should store a dates poll as draft with its options in order', async () => {
    await createPoll(validInput());

    expect(storePoll).toHaveBeenCalledWith(
      expect.objectContaining({
        optionKind: 'dates',
        options: [{ optionDate: FUTURE }, { optionDate: '2099-07-05' }],
      })
    );
  });

  it('should store a slots poll with converted instants', async () => {
    await createPoll(
      validInput({
        optionKind: 'slots',
        dates: undefined,
        slots: [
          { date: '2099-07-04', startTime: '19:30', endTime: '21:00', endsNextDay: false },
          { date: '2099-07-05', startTime: '19:30', endTime: '21:00', endsNextDay: false },
        ],
      })
    );

    const call = storePoll.mock.calls[0][0];
    expect(call.optionKind).toBe('slots');
    expect(call.options[0].startsAt).toBeInstanceOf(Date);
    expect(call.options[0].optionDate).toBeUndefined();
  });

  it('should surface the date error rather than throw when a slot falls in the spring-forward gap', async () => {
    const result = await createPoll(
      validInput({
        optionKind: 'slots',
        dates: undefined,
        slots: [
          { date: '2027-03-28', startTime: '01:30', endTime: '03:00', endsNextDay: false },
          { date: '2027-03-29', startTime: '19:30', endTime: '21:00', endsNextDay: false },
        ],
      })
    );

    expect(result.error).toContain('does not exist');
    expect(storePoll).not.toHaveBeenCalled();
  });

  it('should return the write-failure message when the poll insert fails', async () => {
    storePoll.mockResolvedValue({ stored: false, error: 'insert exploded' });

    const result = await createPoll(validInput());

    expect(result.error).toBe(
      'Your poll was not created. Please try again, or message Peter on WhatsApp.'
    );
    expect(sendPollEmail).not.toHaveBeenCalled();
  });

  it('should delete the poll when the verify token cannot be issued', async () => {
    // A draft with no verify token can never be published and never re-sent.
    // Leaving it would be an unreachable row waiting 60 days for the sweep.
    issueVerifyToken.mockResolvedValue({ stored: false, error: 'update failed' });

    const result = await createPoll(validInput());

    expect(deletePoll).toHaveBeenCalledWith('o-token');
    expect(result.error).toBe(
      'Your poll was not created. Please try again, or message Peter on WhatsApp.'
    );
  });

  it('should email the organiser the verify link', async () => {
    await createPoll(validInput());

    expect(sendPollEmail).toHaveBeenCalledTimes(1);
    const message = sendPollEmail.mock.calls[0][0];
    expect(message.to).toBe('peter@orangejelly.co.uk');
    expect(message.text).toContain('/availability/verify/v-token');
  });

  it('should never put the organiser link in the verify email', async () => {
    // The verify email is the most forwardable message this feature sends.
    await createPoll(validInput());

    const message = sendPollEmail.mock.calls[0][0];
    expect(message.text).not.toContain('o-token');
    expect(message.html).not.toContain('o-token');
    expect(message.text).not.toContain('/availability/o/');
    expect(message.html).not.toContain('/availability/o/');
  });

  it('should never put the participant link in the verify email', async () => {
    await createPoll(validInput());

    const message = sendPollEmail.mock.calls[0][0];
    expect(message.text).not.toContain('p-token');
    expect(message.html).not.toContain('p-token');
  });

  it('should still report success when the verification mail fails', async () => {
    sendPollEmail.mockResolvedValue({ error: 'resend is down' });

    const result = await createPoll(validInput());

    // The poll is stored. A failed notification must never turn a stored record
    // into a user-facing error — and the resend token is the recovery route.
    expect(result.success).toBe(true);
    expect(result.resendToken).toBe('r-token');
  });

  it('should still report success when the verification mail throws', async () => {
    sendPollEmail.mockRejectedValue(new Error('network'));

    const result = await createPoll(validInput());

    expect(result.success).toBe(true);
    expect(result.resendToken).toBe('r-token');
  });

  it('should return the resend token and no poll capability', async () => {
    const result = await createPoll(validInput());

    expect(result).toEqual({ success: true, resendToken: 'r-token' });
    // Explicit: the browser must never receive any of these.
    expect(JSON.stringify(result)).not.toContain('p-token');
    expect(JSON.stringify(result)).not.toContain('o-token');
    expect(JSON.stringify(result)).not.toContain('v-token');
  });
});

describe('verifyOrganiserEmail', () => {
  const verified = {
    stored: true,
    data: {
      id: 'poll-1',
      title: 'Quiz night briefing',
      participantToken: 'p-token',
      organiserToken: 'o-token',
      organiserName: 'Peter',
      organiserEmail: 'peter@orangejelly.co.uk',
    },
  };

  it('should open the poll and return both links when the token matches a draft poll', async () => {
    verifyAndOpenPoll.mockResolvedValue(verified);

    const result = await verifyOrganiserEmail(TOKEN);

    expect(verifyAndOpenPoll).toHaveBeenCalledWith(TOKEN);
    expect(result.success).toBe(true);
    expect(result.links?.participantUrl).toContain('/availability/p/p-token');
    expect(result.links?.organiserUrl).toContain('/availability/o/o-token');
  });

  it('should resolve by the verify token, never the organiser token', async () => {
    verifyAndOpenPoll.mockResolvedValue(verified);

    await verifyOrganiserEmail(TOKEN);

    // The data layer is handed the token from the URL as-is. If this ever reads
    // an organiser token, the magic link has become an admin capability.
    expect(verifyAndOpenPoll).toHaveBeenCalledWith(TOKEN);
    expect(verifyAndOpenPoll).not.toHaveBeenCalledWith('o-token');
  });

  it('should send the organiser both the participant link and the organiser link', async () => {
    verifyAndOpenPoll.mockResolvedValue(verified);

    await verifyOrganiserEmail(TOKEN);

    const message = sendPollEmail.mock.calls[0][0];
    expect(message.to).toBe('peter@orangejelly.co.uk');
    expect(message.text).toContain('/availability/p/p-token');
    expect(message.text).toContain('/availability/o/o-token');
  });

  it('should reject a malformed token without a database round-trip', async () => {
    const result = await verifyOrganiserEmail('../../etc/passwd');

    expect(result.error).toBe('This link is no longer valid');
    expect(verifyAndOpenPoll).not.toHaveBeenCalled();
  });

  it('should return the same error for an unknown token as for a consumed one', async () => {
    // The oracle test. Byte equality, not merely "both are errors".
    verifyAndOpenPoll.mockResolvedValue({ stored: false, error: 'This link is no longer valid.' });
    const unknown = await verifyOrganiserEmail(TOKEN);

    verifyAndOpenPoll.mockResolvedValue({ stored: false, error: 'Row not found' });
    const consumed = await verifyOrganiserEmail(OTHER_TOKEN);

    expect(unknown.error).toBe(consumed.error);
    expect(unknown).toEqual(consumed);
  });

  it('should return an error when the poll is already open', async () => {
    // Single-use: the conditional update's `status = 'draft'` clause matches
    // nothing, so this is an error path, not an idempotent success.
    verifyAndOpenPoll.mockResolvedValue({ stored: false, error: 'This link is no longer valid.' });

    const result = await verifyOrganiserEmail(TOKEN);

    expect(result.success).toBeUndefined();
    expect(result.links).toBeUndefined();
  });

  it('should still report the poll live when the links email fails', async () => {
    verifyAndOpenPoll.mockResolvedValue(verified);
    sendPollEmail.mockResolvedValue({ error: 'resend is down' });

    const result = await verifyOrganiserEmail(TOKEN);

    expect(result.success).toBe(true);
    expect(result.links).toBeDefined();
  });

  it('should allow verification through when the rate limiter throws', async () => {
    // Fail OPEN here, unlike createPoll: this path sends no mail to a stranger
    // and the token is unguessable, so a broken limiter must not stop a real
    // organiser publishing.
    verifyAndOpenPoll.mockResolvedValue(verified);
    checkRateLimit.mockRejectedValue(new Error('limiter down'));

    const result = await verifyOrganiserEmail(TOKEN);

    expect(result.success).toBe(true);
  });
});

describe('resendVerification', () => {
  const target = {
    id: 'poll-1',
    title: 'Quiz night briefing',
    organiserName: 'Peter',
    organiserEmail: 'peter@orangejelly.co.uk',
    verifyToken: 'v-token',
    verifyTokenExpiresAt: new Date(Date.now() + 60_000).toISOString(),
  };

  it('should re-send the verify email to the stored address', async () => {
    getResendTarget.mockResolvedValue(target);

    const result = await resendVerification(TOKEN);

    expect(result.success).toBe(true);
    expect(sendPollEmail.mock.calls[0][0].to).toBe('peter@orangejelly.co.uk');
  });

  it('should never accept an address from the caller', async () => {
    getResendTarget.mockResolvedValue(target);

    await resendVerification(TOKEN);

    // The signature takes one token and nothing else. This is what keeps the
    // action off the open-relay surface.
    expect(resendVerification.length).toBe(1);
  });

  it('should return one string for an unknown token and for an already-live poll', async () => {
    getResendTarget.mockResolvedValue(null);
    const unknown = await resendVerification(TOKEN);
    const live = await resendVerification(OTHER_TOKEN);

    expect(unknown.error).toBe('That poll is already live — check your inbox for the links.');
    expect(unknown.error).toBe(live.error);
    expect(sendPollEmail).not.toHaveBeenCalled();
  });

  it('should refuse a malformed token with the same string', async () => {
    const result = await resendVerification('nope');

    expect(result.error).toBe('That poll is already live — check your inbox for the links.');
    expect(getResendTarget).not.toHaveBeenCalled();
  });

  it('should refuse when the 60-second cooldown has not elapsed', async () => {
    getResendTarget.mockResolvedValue(target);
    claimResendSlot.mockResolvedValue(false);

    const result = await resendVerification(TOKEN);

    expect(result.error).toBe('Too many attempts. Please try again in a few minutes.');
    expect(sendPollEmail).not.toHaveBeenCalled();
  });

  it('should key the resend rate limit on the hashed poll id', async () => {
    getResendTarget.mockResolvedValue(target);

    await resendVerification(TOKEN);

    expect(checkRateLimit).toHaveBeenCalledWith('poll_resend_poll', 'hashed:poll-1');
  });

  it('should refuse when the resend rate limit is hit', async () => {
    getResendTarget.mockResolvedValue(target);
    checkRateLimit.mockResolvedValue({ allowed: false, retryAfterSeconds: 60 });

    const result = await resendVerification(TOKEN);

    expect(result.error).toBe('Too many attempts. Please try again in a few minutes.');
    expect(sendPollEmail).not.toHaveBeenCalled();
  });

  it('should fail closed when the rate limiter throws', async () => {
    getResendTarget.mockResolvedValue(target);
    checkRateLimit.mockRejectedValue(new Error('limiter down'));

    const result = await resendVerification(TOKEN);

    expect(result.error).toBe('Sending is unavailable right now. Please try again shortly.');
    expect(sendPollEmail).not.toHaveBeenCalled();
  });

  it('should mint a fresh token when the existing one has expired', async () => {
    getResendTarget.mockResolvedValue({
      ...target,
      verifyTokenExpiresAt: new Date(Date.now() - 60_000).toISOString(),
    });
    refreshVerifyToken.mockResolvedValue({ stored: true, data: { verifyToken: 'fresh-token' } });

    const result = await resendVerification(TOKEN);

    expect(refreshVerifyToken).toHaveBeenCalledWith('poll-1');
    expect(result.success).toBe(true);
    expect(sendPollEmail.mock.calls[0][0].text).toContain('/availability/verify/fresh-token');
  });

  it('should not mint a fresh token when the existing one is still good', async () => {
    getResendTarget.mockResolvedValue(target);

    await resendVerification(TOKEN);

    expect(refreshVerifyToken).not.toHaveBeenCalled();
    expect(sendPollEmail.mock.calls[0][0].text).toContain('/availability/verify/v-token');
  });

  it('should surface a mail failure, unlike every other action', async () => {
    // Re-sending the mail is the entire purpose of this call, so a silent
    // success would be a lie.
    getResendTarget.mockResolvedValue(target);
    sendPollEmail.mockResolvedValue({ error: 'resend is down' });

    const result = await resendVerification(TOKEN);

    expect(result.error).toBe('We could not send that email. Please message Peter on WhatsApp.');
    expect(result.success).toBeUndefined();
  });

  it('should surface a mail failure when the send throws', async () => {
    getResendTarget.mockResolvedValue(target);
    sendPollEmail.mockRejectedValue(new Error('network'));

    const result = await resendVerification(TOKEN);

    expect(result.error).toBe('We could not send that email. Please message Peter on WhatsApp.');
  });
});
