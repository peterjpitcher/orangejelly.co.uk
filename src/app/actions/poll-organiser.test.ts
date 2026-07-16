import { beforeEach, describe, expect, it, vi } from 'vitest';

import { confirmOption, deletePoll, deleteResponse, setPollOpen } from './poll-organiser';

/**
 * Organiser action tests.
 *
 * Every external service is mocked — Supabase via the data layer, Resend via
 * `sendPollEmails`. These prove the ACTION's ordering, its gates and its failure
 * copy; the data layer's own queries are the data layer's to prove.
 *
 * `@/lib/poll-ics` and `@/lib/poll-emails` are NOT mocked. Both are pure and
 * offline, and the thing most worth asserting here is that a real .ics reaches
 * the attachment with a real base64 body — a mock would assert only that this
 * file calls a function.
 */

const closePoll = vi.fn();
const reopenPoll = vi.fn();
const storeConfirmOption = vi.fn();
const deleteParticipant = vi.fn();
const storeDeletePoll = vi.fn();
const getOrganiserView = vi.fn();
const getConfirmRecipients = vi.fn();
const recordConfirmNotifyFailures = vi.fn();

vi.mock('@/lib/db/polls', () => ({
  ALREADY_CONFIRMED: 'ALREADY_CONFIRMED',
  closePoll: (...args: unknown[]) => closePoll(...args),
  reopenPoll: (...args: unknown[]) => reopenPoll(...args),
  confirmOption: (...args: unknown[]) => storeConfirmOption(...args),
  deleteParticipant: (...args: unknown[]) => deleteParticipant(...args),
  deletePoll: (...args: unknown[]) => storeDeletePoll(...args),
  getOrganiserView: (...args: unknown[]) => getOrganiserView(...args),
  getConfirmRecipients: (...args: unknown[]) => getConfirmRecipients(...args),
  recordConfirmNotifyFailures: (...args: unknown[]) => recordConfirmNotifyFailures(...args),
}));

const sendPollEmails = vi.fn();
vi.mock('@/lib/email', () => ({
  sendPollEmails: (...args: unknown[]) => sendPollEmails(...args),
  escapeHtml: (value: string) =>
    value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
}));

const checkRateLimit = vi.fn();
const isRateLimitConfigured = vi.fn(() => true);
vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: (...args: unknown[]) => checkRateLimit(...args),
  isRateLimitConfigured: () => isRateLimitConfigured(),
  hashKey: (value: string) => `hashed:${value}`,
  getClientIp: () => '203.0.113.7',
}));

const revalidatePath = vi.fn();
vi.mock('next/cache', () => ({ revalidatePath: (...args: unknown[]) => revalidatePath(...args) }));
vi.mock('next/headers', () => ({ headers: () => new Map() }));

const TOKEN = 'aaaaaaaaaaaaaaaaaaaaaa'; // 22 chars — a well-formed token shape.
const OPTION_ID = '22222222-2222-4222-8222-222222222222';
const OTHER_OPTION_ID = '33333333-3333-4333-8333-333333333333';
const PARTICIPANT_ID = '44444444-4444-4444-8444-444444444444';
const POLL_ID = '11111111-1111-4111-8111-111111111111';

const SLOT_OPTION = {
  id: OPTION_ID,
  poll_id: POLL_ID,
  option_date: null,
  starts_at: '2026-07-04T18:30:00.000Z',
  ends_at: '2026-07-04T20:00:00.000Z',
  position: 0,
};

const DATE_OPTION = {
  ...SLOT_OPTION,
  option_date: '2026-07-04',
  starts_at: null,
  ends_at: null,
};

function pollRow(overrides: Record<string, unknown> = {}) {
  return {
    id: POLL_ID,
    title: 'July planning call',
    description: 'A quick catch-up.',
    agenda: null,
    location: null,
    organiser_name: 'Peter Pitcher',
    organiser_email: 'peter@orangejelly.co.uk',
    option_kind: 'slots',
    timezone: 'Europe/London',
    status: 'confirmed',
    confirmed_option_id: OPTION_ID,
    email_verified_at: '2026-07-01T00:00:00.000Z',
    closes_at: null,
    expires_at: '2099-01-01T00:00:00.000Z',
    created_at: '2026-07-01T00:00:00.000Z',
    ...overrides,
  };
}

function confirmedResult(overrides: Record<string, unknown> = {}) {
  return {
    stored: true,
    data: {
      poll: pollRow(),
      option: SLOT_OPTION,
      confirmSequence: 1,
      participantToken: 'bbbbbbbbbbbbbbbbbbbbbb',
      ...overrides,
    },
  };
}

/** The organiser view the actions re-read for status. */
function view(status: string) {
  return { poll: pollRow({ status }), options: [], participants: [], responses: {} };
}

beforeEach(() => {
  vi.clearAllMocks();
  checkRateLimit.mockResolvedValue({ allowed: true });
  isRateLimitConfigured.mockReturnValue(true);
  sendPollEmails.mockResolvedValue({ sent: 1, failed: 0 });
  getConfirmRecipients.mockResolvedValue([]);
  recordConfirmNotifyFailures.mockResolvedValue(undefined);
});

describe('setPollOpen', () => {
  it('should close an open poll', async () => {
    closePoll.mockResolvedValue({ stored: true });

    const result = await setPollOpen(TOKEN, false);

    expect(result).toEqual({ success: true });
    expect(closePoll).toHaveBeenCalledWith(TOKEN);
    expect(reopenPoll).not.toHaveBeenCalled();
  });

  it('should reopen a closed poll, because closing is reversible', async () => {
    reopenPoll.mockResolvedValue({ stored: true });

    const result = await setPollOpen(TOKEN, true);

    expect(result).toEqual({ success: true });
    expect(reopenPoll).toHaveBeenCalledWith(TOKEN);
    expect(closePoll).not.toHaveBeenCalled();
  });

  it('should never send email when closing — nobody needs telling until a time is confirmed', async () => {
    closePoll.mockResolvedValue({ stored: true });

    await setPollOpen(TOKEN, false);

    expect(sendPollEmails).not.toHaveBeenCalled();
  });

  it('should revalidate the organiser path so the matrix is not stale', async () => {
    closePoll.mockResolvedValue({ stored: true });

    await setPollOpen(TOKEN, false);

    expect(revalidatePath).toHaveBeenCalledWith(`/availability/o/${TOKEN}`);
  });

  it('should be idempotent when the poll is already closed', async () => {
    closePoll.mockResolvedValue({ stored: false, error: 'This poll cannot be closed.' });
    getOrganiserView.mockResolvedValue(view('closed'));

    await expect(setPollOpen(TOKEN, false)).resolves.toEqual({ success: true });
  });

  it('should be idempotent when the poll is already open', async () => {
    reopenPoll.mockResolvedValue({ stored: false, error: 'This poll cannot be reopened.' });
    getOrganiserView.mockResolvedValue(view('open'));

    await expect(setPollOpen(TOKEN, true)).resolves.toEqual({ success: true });
  });

  it('should refuse a draft poll and name the reason', async () => {
    closePoll.mockResolvedValue({ stored: false, error: 'This poll cannot be closed.' });
    getOrganiserView.mockResolvedValue(view('draft'));

    const result = await setPollOpen(TOKEN, false);

    expect(result.error).toContain('Confirm your email address');
  });

  it('should refuse a confirmed poll in either direction', async () => {
    closePoll.mockResolvedValue({ stored: false, error: 'This poll cannot be closed.' });
    reopenPoll.mockResolvedValue({ stored: false, error: 'This poll cannot be reopened.' });
    getOrganiserView.mockResolvedValue(view('confirmed'));

    await expect(setPollOpen(TOKEN, false)).resolves.toEqual({
      error: 'This poll is already confirmed',
    });
    await expect(setPollOpen(TOKEN, true)).resolves.toEqual({
      error: 'This poll is already confirmed',
    });
  });

  it('should reject a malformed token without reaching the data layer', async () => {
    const result = await setPollOpen('nope', false);

    expect(result).toEqual({ error: 'That link is not valid.' });
    expect(closePoll).not.toHaveBeenCalled();
  });

  it('should give one message for an unknown token, so it cannot be used as an oracle', async () => {
    closePoll.mockResolvedValue({ stored: false, error: 'This poll could not be found.' });
    getOrganiserView.mockResolvedValue(null);

    await expect(setPollOpen(TOKEN, false)).resolves.toEqual({ error: 'That link is not valid.' });
  });

  it('should fail open when the rate limiter throws, since it mutates one poll and sends nothing', async () => {
    checkRateLimit.mockRejectedValue(new Error('Upstash down'));
    closePoll.mockResolvedValue({ stored: true });

    await expect(setPollOpen(TOKEN, false)).resolves.toEqual({ success: true });
  });

  it('should refuse when the caller is over the rate limit', async () => {
    checkRateLimit.mockResolvedValue({ allowed: false });

    const result = await setPollOpen(TOKEN, false);

    expect(result.error).toContain('Too many attempts');
    expect(closePoll).not.toHaveBeenCalled();
  });
});

describe('confirmOption', () => {
  describe('the double-tap guard', () => {
    it('should fan out nothing when the conditional update matched no row', async () => {
      // ALREADY_CONFIRMED is what the data layer returns when its
      // `status in ('open','closed')` filter matched nothing — i.e. someone
      // confirmed it a moment ago. Re-mailing here is the bug this prevents.
      storeConfirmOption.mockResolvedValue({ stored: false, error: 'ALREADY_CONFIRMED' });

      const result = await confirmOption(TOKEN, OPTION_ID);

      expect(result).toEqual({ error: 'This poll is already confirmed' });
      expect(sendPollEmails).not.toHaveBeenCalled();
      expect(recordConfirmNotifyFailures).not.toHaveBeenCalled();
    });

    it('should not re-read status to decide, so a second confirm cannot race back in', async () => {
      storeConfirmOption.mockResolvedValue({ stored: false, error: 'ALREADY_CONFIRMED' });

      await confirmOption(TOKEN, OPTION_ID);

      // The sentinel is decisive on its own: the database already refused.
      expect(getOrganiserView).not.toHaveBeenCalled();
    });

    it('should mail twenty people exactly once across two racing confirms', async () => {
      getConfirmRecipients.mockResolvedValue(
        Array.from({ length: 19 }, (_, index) => ({
          email: `voter${index}@example.com`,
          display_name: `Voter ${index}`,
        }))
      );
      // First call wins the update; the second matches zero rows.
      storeConfirmOption
        .mockResolvedValueOnce(confirmedResult())
        .mockResolvedValueOnce({ stored: false, error: 'ALREADY_CONFIRMED' });

      const [first, second] = await Promise.all([
        confirmOption(TOKEN, OPTION_ID),
        confirmOption(TOKEN, OPTION_ID),
      ]);

      expect(first).toEqual({ success: true });
      expect(second).toEqual({ error: 'This poll is already confirmed' });
      expect(sendPollEmails).toHaveBeenCalledTimes(1);
      // 19 voters + the organiser, once.
      expect(sendPollEmails.mock.calls[0][0]).toHaveLength(20);
    });
  });

  describe('the fan-out', () => {
    it('should send to the organiser even when nobody voted', async () => {
      storeConfirmOption.mockResolvedValue(confirmedResult());
      getConfirmRecipients.mockResolvedValue([]);

      await confirmOption(TOKEN, OPTION_ID);

      const messages = sendPollEmails.mock.calls[0][0];
      expect(messages).toHaveLength(1);
      expect(messages[0].to).toBe('peter@orangejelly.co.uk');
    });

    it('should reach every responder who gave an address, plus the organiser', async () => {
      storeConfirmOption.mockResolvedValue(confirmedResult());
      getConfirmRecipients.mockResolvedValue([
        { email: 'sarah@example.com', display_name: 'Sarah' },
        { email: 'billy@example.com', display_name: 'Billy' },
      ]);

      await confirmOption(TOKEN, OPTION_ID);

      const recipients = sendPollEmails.mock.calls[0][0].map((m: { to: string }) => m.to);
      expect(recipients).toEqual([
        'peter@orangejelly.co.uk',
        'sarah@example.com',
        'billy@example.com',
      ]);
    });

    it('should not email the organiser twice when they also voted under a different name', async () => {
      storeConfirmOption.mockResolvedValue(confirmedResult());
      // The organiser voted as "Pete" while the poll says "Peter Pitcher". A
      // UNION on the whole row would keep both and mail them twice.
      getConfirmRecipients.mockResolvedValue([
        { email: 'peter@orangejelly.co.uk', display_name: 'Pete' },
      ]);

      await confirmOption(TOKEN, OPTION_ID);

      const messages = sendPollEmails.mock.calls[0][0];
      expect(messages).toHaveLength(1);
      // The organiser's own name wins over the display_name they voted under.
      expect(messages[0].text).toContain('Peter Pitcher');
      expect(messages[0].text).not.toContain('Hi Pete,');
    });

    it('should dedupe on the lowercased address', async () => {
      storeConfirmOption.mockResolvedValue(confirmedResult());
      getConfirmRecipients.mockResolvedValue([
        { email: 'peter@orangejelly.co.uk', display_name: 'Pete' },
        { email: 'sarah@example.com', display_name: 'Sarah' },
      ]);

      await confirmOption(TOKEN, OPTION_ID);

      expect(sendPollEmails.mock.calls[0][0]).toHaveLength(2);
    });

    it('should send one message per recipient, never one message addressed to everybody', async () => {
      storeConfirmOption.mockResolvedValue(confirmedResult());
      getConfirmRecipients.mockResolvedValue([
        { email: 'sarah@example.com', display_name: 'Sarah' },
        { email: 'billy@example.com', display_name: 'Billy' },
      ]);

      await confirmOption(TOKEN, OPTION_ID);

      // Putting the group in a visible `to` would disclose participants'
      // addresses to each other — which the privacy notice promises it will not.
      for (const message of sendPollEmails.mock.calls[0][0]) {
        expect(message.to).not.toContain(',');
      }
    });

    it('should set reply-to to the organiser so a "cannot make it" reaches a human', async () => {
      storeConfirmOption.mockResolvedValue(confirmedResult());
      getConfirmRecipients.mockResolvedValue([
        { email: 'sarah@example.com', display_name: 'Sarah' },
      ]);

      await confirmOption(TOKEN, OPTION_ID);

      for (const message of sendPollEmails.mock.calls[0][0]) {
        expect(message.replyTo).toBe('peter@orangejelly.co.uk');
      }
    });

    it('should never put the organiser token in a participant email', async () => {
      storeConfirmOption.mockResolvedValue(confirmedResult());
      getConfirmRecipients.mockResolvedValue([
        { email: 'sarah@example.com', display_name: 'Sarah' },
      ]);

      await confirmOption(TOKEN, OPTION_ID);

      // The whole feature turns on this. Anyone holding the organiser link can
      // confirm the time, close the poll and delete every response.
      for (const message of sendPollEmails.mock.calls[0][0]) {
        expect(message.html).not.toContain(TOKEN);
        expect(message.text).not.toContain(TOKEN);
        expect(message.html).not.toContain('/availability/o/');
        expect(message.text).not.toContain('/availability/o/');
      }
    });

    it('should not carry a List-Unsubscribe header, whose URL embeds the organiser token', async () => {
      storeConfirmOption.mockResolvedValue(confirmedResult());

      await confirmOption(TOKEN, OPTION_ID);

      const message = sendPollEmails.mock.calls[0][0][0];
      expect(message.headers?.['List-Unsubscribe']).toBeUndefined();
    });
  });

  describe('the .ics attachment', () => {
    it('should attach a real, base64-encoded calendar file', async () => {
      storeConfirmOption.mockResolvedValue(confirmedResult());

      await confirmOption(TOKEN, OPTION_ID);

      const message = sendPollEmails.mock.calls[0][0][0];
      expect(message.attachments).toHaveLength(1);
      expect(message.attachments[0].filename).toBe('orange-jelly-poll.ics');

      const decoded = Buffer.from(message.attachments[0].content, 'base64').toString('utf8');
      expect(decoded).toContain('BEGIN:VCALENDAR');
      expect(decoded).toContain('DTSTART:20260704T183000Z');
    });

    it('should set the Outlook Content-Class header so the card renders', async () => {
      storeConfirmOption.mockResolvedValue(confirmedResult());

      await confirmOption(TOKEN, OPTION_ID);

      const message = sendPollEmails.mock.calls[0][0][0];
      expect(message.headers['Content-Class']).toBe('urn:content-classes:calendarmessage');
    });

    it('should carry the poll sequence, so a re-confirm supersedes the old entry', async () => {
      storeConfirmOption.mockResolvedValue(confirmedResult({ confirmSequence: 3 }));

      await confirmOption(TOKEN, OPTION_ID);

      const message = sendPollEmails.mock.calls[0][0][0];
      const decoded = Buffer.from(message.attachments[0].content, 'base64').toString('utf8');
      expect(decoded).toContain('SEQUENCE:3');
      expect(decoded).toContain(`UID:${POLL_ID}@orangejelly.co.uk`);
    });

    it('should build an all-day event on a dates poll rather than throwing', async () => {
      // formatSlotInLondon throws on a date-only value. This is the branch that
      // prevents that reaching a send.
      storeConfirmOption.mockResolvedValue(
        confirmedResult({ poll: pollRow({ option_kind: 'dates' }), option: DATE_OPTION })
      );

      const result = await confirmOption(TOKEN, OPTION_ID);

      expect(result).toEqual({ success: true });
      const message = sendPollEmails.mock.calls[0][0][0];
      const decoded = Buffer.from(message.attachments[0].content, 'base64').toString('utf8');
      expect(decoded).toContain('DTSTART;VALUE=DATE:20260704');
      expect(decoded).toContain('DTEND;VALUE=DATE:20260705');
    });

    // These two drive the build failure through `ics`'s organizer.email
    // validation, which rejects an address containing a space. That exact input
    // is guarded upstream by zod on the create form, so the branch is
    // DEFENSIVE rather than live — it exists because a calendar file that will
    // not build must never suppress the notification that the meeting is
    // happening, and the cost of being wrong about "unreachable" is that nobody
    // is told the meeting is on. `ics` is left unmocked so the branch is proven
    // against the library's real validation rather than against a stub.
    it('should still send, without an attachment, when the calendar file will not build', async () => {
      storeConfirmOption.mockResolvedValue(
        confirmedResult({ poll: pollRow({ organiser_email: 'peter pitcher@orangejelly.co.uk' }) })
      );

      const result = await confirmOption(TOKEN, OPTION_ID);

      expect(result).toEqual({ success: true });
      const message = sendPollEmails.mock.calls[0][0][0];
      expect(message.attachments).toBeUndefined();
      // The copy must not promise an attachment that is not there.
      expect(message.text).not.toContain('calendar file attached');
      expect(message.text).toContain('Add it to your calendar');
      // The time in words still goes out — that is the actual payload.
      expect(message.text).toContain('4 July 2026');
    });

    it('should still send the add-to-calendar links when the attachment failed', async () => {
      storeConfirmOption.mockResolvedValue(
        confirmedResult({ poll: pollRow({ organiser_email: 'peter pitcher@orangejelly.co.uk' }) })
      );

      await confirmOption(TOKEN, OPTION_ID);

      const message = sendPollEmails.mock.calls[0][0][0];
      expect(message.text).toContain('calendar.google.com');
      expect(message.text).toContain('outlook.live.com');
    });
  });

  describe('a malformed option', () => {
    it('should not un-confirm the poll when the option shape makes the payload throw', async () => {
      // formatOptionForEmail throws on this shape, before any send. The fan-out
      // is caught wholesale and the poll stays confirmed regardless.
      storeConfirmOption.mockResolvedValue(
        confirmedResult({ option: { ...SLOT_OPTION, starts_at: null } })
      );

      const result = await confirmOption(TOKEN, OPTION_ID);

      expect(result).toEqual({ success: true });
      expect(sendPollEmails).not.toHaveBeenCalled();
    });
  });

  describe('the failure count', () => {
    it('should write the count back so the organiser can be told plainly', async () => {
      storeConfirmOption.mockResolvedValue(confirmedResult());
      getConfirmRecipients.mockResolvedValue([
        { email: 'sarah@example.com', display_name: 'Sarah' },
        { email: 'bounces@example.com', display_name: 'Bouncer' },
      ]);
      sendPollEmails.mockResolvedValue({ sent: 2, failed: 1 });

      await confirmOption(TOKEN, OPTION_ID);

      expect(recordConfirmNotifyFailures).toHaveBeenCalledWith(POLL_ID, 1);
    });

    it('should write a count, never an address', async () => {
      storeConfirmOption.mockResolvedValue(confirmedResult());
      sendPollEmails.mockResolvedValue({ sent: 0, failed: 1 });

      await confirmOption(TOKEN, OPTION_ID);

      const [, written] = recordConfirmNotifyFailures.mock.calls[0];
      expect(typeof written).toBe('number');
    });

    it('should write zero on a clean fan-out, clearing a previous run’s note', async () => {
      storeConfirmOption.mockResolvedValue(confirmedResult());

      await confirmOption(TOKEN, OPTION_ID);

      expect(recordConfirmNotifyFailures).toHaveBeenCalledWith(POLL_ID, 0);
    });

    it('should count a fan-out rate-limit refusal as a failure and carry on', async () => {
      storeConfirmOption.mockResolvedValue(confirmedResult());
      getConfirmRecipients.mockResolvedValue([
        { email: 'sarah@example.com', display_name: 'Sarah' },
      ]);
      checkRateLimit.mockImplementation((bucket: string) =>
        bucket === 'poll_send_fanout' ? { allowed: false } : { allowed: true }
      );

      const result = await confirmOption(TOKEN, OPTION_ID);

      expect(result).toEqual({ success: true });
      expect(sendPollEmails).not.toHaveBeenCalled();
      expect(recordConfirmNotifyFailures).toHaveBeenCalledWith(POLL_ID, 2);
    });
  });

  describe('mail failing must not un-confirm the poll', () => {
    it('should return success when every send fails', async () => {
      storeConfirmOption.mockResolvedValue(confirmedResult());
      sendPollEmails.mockResolvedValue({ sent: 0, failed: 1 });

      await expect(confirmOption(TOKEN, OPTION_ID)).resolves.toEqual({ success: true });
    });

    it('should return success when the fan-out throws outright', async () => {
      storeConfirmOption.mockResolvedValue(confirmedResult());
      sendPollEmails.mockRejectedValue(new Error('Resend exploded'));

      // The poll is already confirmed and the page shows the time — that is the
      // durable record.
      await expect(confirmOption(TOKEN, OPTION_ID)).resolves.toEqual({ success: true });
    });

    it('should return success when reading the recipients throws', async () => {
      storeConfirmOption.mockResolvedValue(confirmedResult());
      getConfirmRecipients.mockRejectedValue(new Error('Supabase down'));

      await expect(confirmOption(TOKEN, OPTION_ID)).resolves.toEqual({ success: true });
    });
  });

  describe('gates', () => {
    it('should fail closed when the rate limiter is unconfigured in production', async () => {
      const previous = process.env.NODE_ENV;
      vi.stubEnv('NODE_ENV', 'production');
      isRateLimitConfigured.mockReturnValue(false);

      const result = await confirmOption(TOKEN, OPTION_ID);

      // An unthrottled endpoint that sends mail on our own sending domain is an
      // open relay.
      expect(result.error).toContain('unavailable');
      expect(storeConfirmOption).not.toHaveBeenCalled();

      vi.stubEnv('NODE_ENV', previous ?? 'test');
    });

    it('should fail closed when the rate limiter throws', async () => {
      checkRateLimit.mockRejectedValue(new Error('Upstash down'));

      const result = await confirmOption(TOKEN, OPTION_ID);

      expect(result.error).toContain('unavailable');
      expect(storeConfirmOption).not.toHaveBeenCalled();
    });

    it('should reject a malformed option id without reaching the data layer', async () => {
      const result = await confirmOption(TOKEN, 'not-a-uuid');

      expect(result).toEqual({ error: 'That option is not valid.' });
      expect(storeConfirmOption).not.toHaveBeenCalled();
    });

    it('should refuse an option belonging to another poll', async () => {
      // polls_confirmed_option_fk is a SIMPLE FK, so the database would accept
      // this. The data layer's poll_id scope is the only control, and the action
      // surfaces its refusal.
      storeConfirmOption.mockResolvedValue({
        stored: false,
        error: 'That option does not belong to this poll.',
      });
      getOrganiserView.mockResolvedValue(view('open'));

      const result = await confirmOption(TOKEN, OTHER_OPTION_ID);

      expect(result).toEqual({ error: 'That option is not valid.' });
      expect(sendPollEmails).not.toHaveBeenCalled();
    });

    it('should refuse a draft poll', async () => {
      storeConfirmOption.mockResolvedValue({
        stored: false,
        error: 'This poll cannot be confirmed.',
      });
      getOrganiserView.mockResolvedValue(view('draft'));

      const result = await confirmOption(TOKEN, OPTION_ID);

      expect(result.error).toContain('Confirm your email address');
      expect(sendPollEmails).not.toHaveBeenCalled();
    });

    it('should confirm a closed poll — closing stops replies, it does not decide', async () => {
      storeConfirmOption.mockResolvedValue(confirmedResult());

      await expect(confirmOption(TOKEN, OPTION_ID)).resolves.toEqual({ success: true });
    });

    it('should revalidate both the organiser and the participant paths', async () => {
      storeConfirmOption.mockResolvedValue(confirmedResult());

      await confirmOption(TOKEN, OPTION_ID);

      expect(revalidatePath).toHaveBeenCalledWith(`/availability/o/${TOKEN}`);
      expect(revalidatePath).toHaveBeenCalledWith('/availability/p/bbbbbbbbbbbbbbbbbbbbbb');
    });
  });
});

describe('deleteResponse', () => {
  it('should remove the participant, scoped by the token-resolved poll', async () => {
    getOrganiserView.mockResolvedValue(view('open'));
    deleteParticipant.mockResolvedValue({ stored: true });

    const result = await deleteResponse(TOKEN, PARTICIPANT_ID);

    expect(result).toEqual({ success: true });
    // The organiser token, never a client-supplied poll id: without the scope,
    // an organiser of poll A deletes a participant of poll B by pasting an id.
    expect(deleteParticipant).toHaveBeenCalledWith(TOKEN, PARTICIPANT_ID);
  });

  it('should refuse once the poll is confirmed, server-side and not merely in the UI', async () => {
    getOrganiserView.mockResolvedValue(view('confirmed'));

    const result = await deleteResponse(TOKEN, PARTICIPANT_ID);

    expect(result).toEqual({ error: 'This poll is confirmed. Responses are locked' });
    expect(deleteParticipant).not.toHaveBeenCalled();
  });

  it('should be idempotent when the participant is already gone', async () => {
    getOrganiserView.mockResolvedValue(view('open'));
    // Zero rows deleted is the desired end state.
    deleteParticipant.mockResolvedValue({ stored: true });

    await expect(deleteResponse(TOKEN, PARTICIPANT_ID)).resolves.toEqual({ success: true });
  });

  it('should reject a malformed participant id without reaching the data layer', async () => {
    const result = await deleteResponse(TOKEN, 'not-a-uuid');

    expect(result).toEqual({ error: 'That response is not valid.' });
    expect(deleteParticipant).not.toHaveBeenCalled();
  });

  it('should give one message for an unknown token', async () => {
    getOrganiserView.mockResolvedValue(null);

    await expect(deleteResponse(TOKEN, PARTICIPANT_ID)).resolves.toEqual({
      error: 'That link is not valid.',
    });
  });

  it('should surface a delete failure', async () => {
    getOrganiserView.mockResolvedValue(view('open'));
    deleteParticipant.mockResolvedValue({ stored: false, error: 'boom' });

    const result = await deleteResponse(TOKEN, PARTICIPANT_ID);

    expect(result.error).toContain('was not removed');
  });
});

describe('deletePoll', () => {
  it('should delete the poll', async () => {
    storeDeletePoll.mockResolvedValue({ stored: true });

    const result = await deletePoll(TOKEN);

    expect(result).toEqual({ success: true });
    expect(storeDeletePoll).toHaveBeenCalledWith(TOKEN);
  });

  it('should be allowed on a confirmed poll — erasure is not conditional on state', async () => {
    // This is the organiser's Article 17 route. Refusing it once a time is
    // confirmed would make the right conditional, which is indefensible.
    getOrganiserView.mockResolvedValue(view('confirmed'));
    storeDeletePoll.mockResolvedValue({ stored: true });

    await expect(deletePoll(TOKEN)).resolves.toEqual({ success: true });
  });

  it('should reject a malformed token without reaching the data layer', async () => {
    const result = await deletePoll('nope');

    expect(result).toEqual({ error: 'That link is not valid.' });
    expect(storeDeletePoll).not.toHaveBeenCalled();
  });

  it('should surface a delete failure with a route to a human', async () => {
    storeDeletePoll.mockResolvedValue({ stored: false, error: 'boom' });

    const result = await deletePoll(TOKEN);

    expect(result.error).toContain('WhatsApp');
  });

  it('should never send email', async () => {
    storeDeletePoll.mockResolvedValue({ stored: true });

    await deletePoll(TOKEN);

    expect(sendPollEmails).not.toHaveBeenCalled();
  });
});
