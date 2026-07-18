import { beforeEach, describe, expect, it, vi } from 'vitest';

import { submitResponse, updateResponse } from './poll-responses';
import { VALIDATION_MESSAGES } from '@/lib/validation-messages';

/**
 * Server action tests.
 *
 * Every external service is mocked, per the repo rule. The data layer is mocked
 * too, so these prove the ACTION's ordering, its gates and its failure copy;
 * src/lib/db/polls.test.ts proves the queries themselves.
 */

const storeResponse = vi.fn();
const storeUpdatedResponse = vi.fn();
const getParticipantView = vi.fn();

vi.mock('@/lib/db/polls', () => ({
  submitResponse: (...args: unknown[]) => storeResponse(...args),
  updateResponse: (...args: unknown[]) => storeUpdatedResponse(...args),
  getParticipantView: (...args: unknown[]) => getParticipantView(...args),
}));

const resolveEditParticipant = vi.fn();
vi.mock('@/app/availability/p/poll-data', () => ({
  resolveEditParticipant: (...args: unknown[]) => resolveEditParticipant(...args),
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

const revalidatePath = vi.fn();
vi.mock('next/cache', () => ({ revalidatePath: (...args: unknown[]) => revalidatePath(...args) }));

const TOKEN = 'aaaaaaaaaaaaaaaaaaaaaa'; // 22 chars — a well-formed token shape.
const EDIT_TOKEN = 'bbbbbbbbbbbbbbbbbbbbbb';
const OPTION_A = '11111111-1111-4111-8111-111111111111';
const OPTION_B = '22222222-2222-4222-8222-222222222222';

const FAR_FUTURE = new Date(Date.now() + 60 * 86_400_000).toISOString();
const PAST = new Date(Date.now() - 86_400_000).toISOString();

function pollView(overrides: Record<string, unknown> = {}) {
  return {
    poll: {
      id: 'poll-1',
      status: 'open',
      closes_at: null,
      expires_at: FAR_FUTURE,
      organiser_name: 'Peter',
      option_kind: 'dates',
      ...overrides,
    },
    options: [{ id: OPTION_A }, { id: OPTION_B }],
    aggregateCounts: {},
    responderCount: 0,
  };
}

function bothVotes() {
  return [
    { optionId: OPTION_A, availability: 'yes' as const },
    { optionId: OPTION_B, availability: 'if_need_be' as const },
  ];
}

function submission(overrides: Record<string, unknown> = {}) {
  return {
    displayName: 'Billy Summers',
    email: 'billy@example.com',
    votes: bothVotes(),
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  isRateLimitConfigured.mockReturnValue(true);
  checkRateLimit.mockResolvedValue({ allowed: true, retryAfterSeconds: 0, reason: 'ok' });
  getParticipantView.mockResolvedValue(pollView());
  storeResponse.mockResolvedValue({ stored: true, data: { editToken: EDIT_TOKEN } });
  storeUpdatedResponse.mockResolvedValue({ stored: true });
  resolveEditParticipant.mockResolvedValue({
    participantId: 'participant-1',
    displayName: 'Billy Summers',
    poll: {
      id: 'poll-1',
      status: 'open',
      closes_at: null,
      expires_at: FAR_FUTURE,
      participant_token: TOKEN,
    },
    options: [{ id: OPTION_A }, { id: OPTION_B }],
  });
});

describe('submitResponse', () => {
  it('should record a valid response and return the edit link on screen', async () => {
    const result = await submitResponse(TOKEN, submission());

    expect(result.success).toBe(true);
    expect(result.editUrl).toBe(
      `https://www.orangejelly.co.uk/availability/p/${TOKEN}/edit/${EDIT_TOKEN}`
    );
  });

  it('should send the participant no email — the edit link is on screen only', async () => {
    // Peter's decision, 16 July 2026. There is no participant email template and
    // nothing here may mail an address an anonymous caller typed into a form.
    // This test exists to fail loudly if a send is ever reinstated.
    await submitResponse(TOKEN, submission({ email: 'billy@example.com' }));
    expect(storeResponse).toHaveBeenCalledTimes(1);
  });

  it('should pass the email through when one is given', async () => {
    await submitResponse(TOKEN, submission({ email: 'Billy@Example.COM' }));
    expect(storeResponse).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'billy@example.com' })
    );
  });

  it('should refuse a blank email, because without one we cannot send the invite', async () => {
    // Was: "normalises an empty email to undefined". The address is required as
    // of 17 July 2026 — an optional one bought a participant the right to answer
    // and then never hear the outcome, which is the one thing the tool exists to
    // tell them.
    const result = await submitResponse(TOKEN, submission({ email: '' }));

    expect(result.error).toBeDefined();
    expect(storeResponse).not.toHaveBeenCalled();
  });

  it('should refuse an address that is not an address', async () => {
    const result = await submitResponse(TOKEN, submission({ email: 'not-an-email' }));

    expect(result.error).toBeDefined();
    expect(storeResponse).not.toHaveBeenCalled();
  });

  it('should short-circuit on the honeypot, reporting success and writing nothing', async () => {
    const result = await submitResponse(TOKEN, submission({ website: 'http://spam.example' }));

    expect(result).toEqual({ success: true });
    expect(storeResponse).not.toHaveBeenCalled();
    expect(getParticipantView).not.toHaveBeenCalled();
  });

  it('should reject a malformed token without touching the database', async () => {
    const result = await submitResponse('too-short', submission());

    expect(result.error).toBe(VALIDATION_MESSAGES.poll.linkNotValid);
    expect(getParticipantView).not.toHaveBeenCalled();
  });

  it('should give the same message for an unknown token as for a draft poll', async () => {
    // getParticipantView returns null for both. A draft must not be
    // distinguishable from a bad guess (§1 E7).
    getParticipantView.mockResolvedValue(null);
    const result = await submitResponse(TOKEN, submission());

    expect(result.error).toBe(VALIDATION_MESSAGES.poll.linkNotValid);
    expect(storeResponse).not.toHaveBeenCalled();
  });

  it('should refuse an expired poll at request time, not wait for the sweep', async () => {
    getParticipantView.mockResolvedValue(pollView({ expires_at: PAST }));
    const result = await submitResponse(TOKEN, submission());

    expect(result.error).toBe(VALIDATION_MESSAGES.poll.linkNotValid);
    expect(storeResponse).not.toHaveBeenCalled();
  });

  it.each(['closed', 'confirmed'])('should refuse a %s poll', async (status) => {
    getParticipantView.mockResolvedValue(pollView({ status }));
    const result = await submitResponse(TOKEN, submission());

    expect(result.error).toBe(VALIDATION_MESSAGES.poll.votingClosed);
    expect(storeResponse).not.toHaveBeenCalled();
  });

  it('should refuse once closes_at has passed, because nothing else enforces it', async () => {
    // closes_at is advisory — no cron flips status — so the action is the only
    // thing making the organiser's deadline real.
    getParticipantView.mockResolvedValue(pollView({ closes_at: PAST }));
    const result = await submitResponse(TOKEN, submission());

    expect(result.error).toBe(VALIDATION_MESSAGES.poll.votingClosed);
    expect(storeResponse).not.toHaveBeenCalled();
  });

  it('should refuse a partial answer set', async () => {
    const result = await submitResponse(
      TOKEN,
      submission({ votes: [{ optionId: OPTION_A, availability: 'yes' }] })
    );

    expect(result.error).toBe(VALIDATION_MESSAGES.poll.answerEveryOption);
    expect(storeResponse).not.toHaveBeenCalled();
  });

  it('should refuse an option that belongs to another poll', async () => {
    const result = await submitResponse(
      TOKEN,
      submission({
        votes: [
          { optionId: OPTION_A, availability: 'yes' },
          { optionId: '33333333-3333-4333-8333-333333333333', availability: 'no' },
        ],
      })
    );

    expect(result.error).toBe(VALIDATION_MESSAGES.poll.answerEveryOption);
    expect(storeResponse).not.toHaveBeenCalled();
  });

  it('should still accept the vote when the rate limiter itself is unavailable', async () => {
    // Voting fails OPEN, and this is the case that used to defeat it. An outage
    // and a genuine limit hit both arrived as `allowed: false`, so the action
    // could not tell them apart and quietly failed CLOSED — on the one action
    // the whole tool exists to make effortless. `reason` is what separates them.
    // The trade is asymmetric on purpose: a missed limit costs a few junk rows
    // the organiser can delete; a false block costs a real person their reply,
    // with no account to appeal through and no sign they were blocked in error.
    checkRateLimit.mockResolvedValue({
      allowed: false,
      retryAfterSeconds: 60,
      reason: 'unavailable',
    });

    const result = await submitResponse(TOKEN, submission());

    expect(result.error).toBeUndefined();
    expect(result.success).toBe(true);
  });

  it('should block when the IP rate limit is hit', async () => {
    checkRateLimit.mockResolvedValue({ allowed: false, retryAfterSeconds: 60, reason: 'limited' });
    const result = await submitResponse(TOKEN, submission());

    expect(result.error).toBe(VALIDATION_MESSAGES.poll.rateLimited);
    expect(storeResponse).not.toHaveBeenCalled();
  });

  it('should allow the vote when the limiter is not configured — voting fails open', async () => {
    // A limiter outage must never be the reason a licensee cannot answer.
    isRateLimitConfigured.mockReturnValue(false);
    const result = await submitResponse(TOKEN, submission());

    expect(result.success).toBe(true);
    expect(checkRateLimit).not.toHaveBeenCalled();
  });

  it('should allow the vote when the limiter throws', async () => {
    checkRateLimit.mockRejectedValue(new Error('limiter down'));
    const result = await submitResponse(TOKEN, submission());

    expect(result.success).toBe(true);
    expect(storeResponse).toHaveBeenCalled();
  });

  it('should hash the rate-limit keys rather than pass a raw IP or poll id', async () => {
    await submitResponse(TOKEN, submission());

    expect(checkRateLimit).toHaveBeenCalledWith('poll_respond_ip', 'hashed:203.0.113.7');
    expect(checkRateLimit).toHaveBeenCalledWith('poll_respond_poll', 'hashed:poll-1');
  });

  it('should surface a write failure without leaking the underlying error', async () => {
    storeResponse.mockResolvedValue({ stored: false, error: 'duplicate key value violates...' });
    const result = await submitResponse(TOKEN, submission());

    expect(result.error).toBe('Your answer was not recorded. Please try again.');
    expect(result.editUrl).toBeUndefined();
  });

  it('should revalidate the participant path so the counts are current next load', async () => {
    await submitResponse(TOKEN, submission());
    expect(revalidatePath).toHaveBeenCalledWith(`/availability/p/${TOKEN}`);
  });
});

describe('updateResponse', () => {
  function update(overrides: Record<string, unknown> = {}) {
    return { displayName: 'Billy Summers', votes: bothVotes(), ...overrides };
  }

  it('should record a valid change', async () => {
    const result = await updateResponse(EDIT_TOKEN, update());

    expect(result.success).toBe(true);
    expect(storeUpdatedResponse).toHaveBeenCalledWith(
      expect.objectContaining({ editToken: EDIT_TOKEN, displayName: 'Billy Summers' })
    );
  });

  it('should resolve the poll from the edit token alone', async () => {
    // The [token] segment in the URL is decoration (§1 P2.5). Nothing here may
    // read it, compare it, or authorise against it.
    await updateResponse(EDIT_TOKEN, update());
    expect(resolveEditParticipant).toHaveBeenCalledWith(EDIT_TOKEN);
  });

  it('should never write an email, even if one is passed', async () => {
    await updateResponse(EDIT_TOKEN, update({ email: 'new@example.com' }));

    expect(storeUpdatedResponse).toHaveBeenCalledWith(
      expect.not.objectContaining({ email: expect.anything() })
    );
  });

  it('should short-circuit on the honeypot', async () => {
    const result = await updateResponse(EDIT_TOKEN, update({ website: 'http://spam.example' }));

    expect(result).toEqual({ success: true });
    expect(storeUpdatedResponse).not.toHaveBeenCalled();
  });

  it('should reject a malformed edit token without a lookup', async () => {
    const result = await updateResponse('nope', update());

    expect(result.error).toBe(VALIDATION_MESSAGES.poll.linkNotValid);
    expect(resolveEditParticipant).not.toHaveBeenCalled();
  });

  it('should reject an unknown edit token', async () => {
    resolveEditParticipant.mockResolvedValue(null);
    const result = await updateResponse(EDIT_TOKEN, update());

    expect(result.error).toBe(VALIDATION_MESSAGES.poll.linkNotValid);
  });

  it.each(['closed', 'confirmed'])('should refuse to change a %s poll', async (status) => {
    resolveEditParticipant.mockResolvedValue({
      participantId: 'participant-1',
      displayName: 'Billy',
      poll: {
        id: 'poll-1',
        status,
        closes_at: null,
        expires_at: FAR_FUTURE,
        participant_token: TOKEN,
      },
      options: [{ id: OPTION_A }, { id: OPTION_B }],
    });

    const result = await updateResponse(EDIT_TOKEN, update());

    expect(result.error).toBe(VALIDATION_MESSAGES.poll.votingClosed);
    expect(storeUpdatedResponse).not.toHaveBeenCalled();
  });

  it('should refuse a partial payload, which the upsert would turn into a silent partial update', async () => {
    // The set-equality check and the non-pruning upsert are a pair. Removing
    // this check makes an omitted option keep its old answer rather than clear.
    const result = await updateResponse(
      EDIT_TOKEN,
      update({ votes: [{ optionId: OPTION_A, availability: 'no' }] })
    );

    expect(result.error).toBe(VALIDATION_MESSAGES.poll.answerEveryOption);
    expect(storeUpdatedResponse).not.toHaveBeenCalled();
  });

  it('should surface a write failure without destroying the existing answers', async () => {
    storeUpdatedResponse.mockResolvedValue({ stored: false, error: 'connection reset' });
    const result = await updateResponse(EDIT_TOKEN, update());

    expect(result.error).toBe('Your changes were not recorded. Please try again.');
  });

  it('should allow the change when the limiter is not configured', async () => {
    isRateLimitConfigured.mockReturnValue(false);
    const result = await updateResponse(EDIT_TOKEN, update());

    expect(result.success).toBe(true);
  });

  it('should block when the update rate limit is hit', async () => {
    checkRateLimit.mockResolvedValue({ allowed: false, retryAfterSeconds: 60, reason: 'limited' });
    const result = await updateResponse(EDIT_TOKEN, update());

    expect(result.error).toBe(VALIDATION_MESSAGES.poll.rateLimited);
  });

  it('should revalidate both the vote and the edit paths', async () => {
    await updateResponse(EDIT_TOKEN, update());

    expect(revalidatePath).toHaveBeenCalledWith(`/availability/p/${TOKEN}`);
    expect(revalidatePath).toHaveBeenCalledWith(`/availability/p/${TOKEN}/edit/${EDIT_TOKEN}`);
  });
});
