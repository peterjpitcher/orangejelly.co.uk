import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * Resend is mocked at the module boundary. These tests must never reach the real
 * API — a test suite that sends mail is a test suite nobody dares run.
 */
const sendMock = vi.fn();

// A class, not vi.fn().mockImplementation(): restoreAllMocks() strips a vi.fn()'s
// implementation, which would leave `new Resend()` returning undefined and every
// send failing for a reason that has nothing to do with the code under test.
vi.mock('resend', () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

import { escapeHtml, sendPollEmail, sendPollEmails, type PollEmail } from './email';

/** Env is process-wide; snapshot it so one test cannot leak into the next. */
const originalEnv = { ...process.env };

function resetEnv(): void {
  process.env = { ...originalEnv };
  process.env.RESEND_API_KEY = 'test-key';
  process.env.CONTACT_FROM_EMAIL = 'Orange Jelly Website <noreply@auth.orangejelly.co.uk>';
  delete process.env.POLL_FROM_EMAIL;
  delete process.env.NEXT_PUBLIC_BASE_URL;
}

const message: PollEmail = {
  to: 'billy@example.com',
  subject: 'Confirmed: "July planning call" — Sat 4 Jul',
  html: '<p>It is confirmed.</p>',
  text: 'It is confirmed.',
};

describe('escapeHtml', () => {
  it('should escape every character that could break out of an HTML context', () => {
    expect(escapeHtml(`<script>alert("x") & 'y'</script>`)).toBe(
      '&lt;script&gt;alert(&quot;x&quot;) &amp; &#39;y&#39;&lt;/script&gt;'
    );
  });

  it('should escape the ampersand first, so an entity is not double-escaped', () => {
    expect(escapeHtml('a & b')).toBe('a &amp; b');
  });
});

describe('sendPollEmail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'info').mockImplementation(() => {});
    resetEnv();
    sendMock.mockResolvedValue({ data: { id: 'resend-id' }, error: null });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    process.env = { ...originalEnv };
  });

  it('should send to the address it is given, never one from the environment', async () => {
    // This is why sendLeadNotification could not be reused: it resolves its
    // recipient from CONTACT_NOTIFICATION_EMAIL and takes no `to` at all.
    process.env.CONTACT_NOTIFICATION_EMAIL = 'peter@orangejelly.co.uk';

    const result = await sendPollEmail(message);

    expect(result).toEqual({ success: true });
    expect(sendMock).toHaveBeenCalledWith(expect.objectContaining({ to: 'billy@example.com' }));
  });

  it('should fall back to CONTACT_FROM_EMAIL when POLL_FROM_EMAIL is unset', async () => {
    // The fallback is the intended production path, not a degraded one.
    await sendPollEmail(message);
    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 'Orange Jelly Website <noreply@auth.orangejelly.co.uk>',
      })
    );
  });

  it('should prefer POLL_FROM_EMAIL when it is set', async () => {
    // The whole point of the variable: poll mail moves to its own verified
    // domain with one Vercel setting and no code change.
    process.env.POLL_FROM_EMAIL = 'Orange Jelly <noreply@polls.orangejelly.co.uk>';
    await sendPollEmail(message);
    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({ from: 'Orange Jelly <noreply@polls.orangejelly.co.uk>' })
    );
  });

  it('should add a display name when the configured sender is a bare address', async () => {
    // A bare address reads as machine mail to both filters and people.
    process.env.POLL_FROM_EMAIL = 'noreply@auth.orangejelly.co.uk';
    await sendPollEmail(message);
    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({ from: 'Orange Jelly <noreply@auth.orangejelly.co.uk>' })
    );
  });

  it('should pass attachments and headers straight through', async () => {
    const attachments = [{ filename: 'orange-jelly-poll.ics', content: 'YmFzZTY0' }];
    const headers = { 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' };

    await sendPollEmail({ ...message, attachments, headers });

    expect(sendMock).toHaveBeenCalledWith(expect.objectContaining({ attachments, headers }));
  });

  it('should pass replyTo through', async () => {
    await sendPollEmail({ ...message, replyTo: 'peter@orangejelly.co.uk' });
    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({ replyTo: 'peter@orangejelly.co.uk' })
    );
  });

  it('should send both the html and text parts', async () => {
    await sendPollEmail(message);
    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({ html: message.html, text: message.text })
    );
  });

  it('should return an error without sending when there is no API key', async () => {
    delete process.env.RESEND_API_KEY;
    const result = await sendPollEmail(message);
    expect(result.error).toBe('Email delivery is not configured (no API key).');
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('should return an error without sending when no from address is configured', async () => {
    delete process.env.CONTACT_FROM_EMAIL;
    const result = await sendPollEmail(message);
    expect(result.error).toBe('Email delivery is not configured (no from address).');
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('should refuse to send when the base URL is not the production host', async () => {
    // Every link in the body comes from getAbsoluteUrl(), which honours
    // NEXT_PUBLIC_BASE_URL. A preview build must never put a preview link in a
    // third party's inbox.
    process.env.NEXT_PUBLIC_BASE_URL = 'https://staging.orangejelly.co.uk';
    const result = await sendPollEmail(message);
    expect(result.error).toBe('Refusing to send: base URL is not the production host.');
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('should refuse to send from localhost', async () => {
    process.env.NEXT_PUBLIC_BASE_URL = 'http://localhost:3000';
    const result = await sendPollEmail(message);
    expect(result.error).toBe('Refusing to send: base URL is not the production host.');
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('should return an error rather than throw when Resend rejects the send', async () => {
    sendMock.mockResolvedValue({ data: null, error: { message: 'Invalid recipient' } });
    const result = await sendPollEmail(message);
    expect(result).toEqual({ error: 'Failed to send email.' });
  });

  it('should return an error rather than throw when the send throws', async () => {
    // A failed email must never undo a database write, so nothing here escapes.
    sendMock.mockRejectedValue(new Error('network down'));
    const result = await sendPollEmail(message);
    expect(result).toEqual({ error: 'Failed to send email.' });
  });

  it('should scrub tokens out of a Resend error before logging it', async () => {
    // Resend echoes request detail back in its errors, and the bodies carry
    // capability URLs. An unscrubbed dump would put a token in the logs.
    const errorSpy = vi.spyOn(console, 'error');
    sendMock.mockResolvedValue({
      data: null,
      error: {
        message:
          'Bad request on https://www.orangejelly.co.uk/availability/o/kBqM3rXnT7vLpZa2cWyDsQ',
      },
    });

    await sendPollEmail(message);

    const logged = errorSpy.mock.calls.flat().join(' ');
    expect(logged).not.toContain('kBqM3rXnT7vLpZa2cWyDsQ');
    expect(logged).toContain('[token]');
  });

  it('should scrub tokens out of a thrown error before logging it', async () => {
    const errorSpy = vi.spyOn(console, 'error');
    sendMock.mockRejectedValue(
      new Error('failed for https://www.orangejelly.co.uk/availability/o/kBqM3rXnT7vLpZa2cWyDsQ')
    );

    await sendPollEmail(message);

    const logged = errorSpy.mock.calls.flat().join(' ');
    expect(logged).not.toContain('kBqM3rXnT7vLpZa2cWyDsQ');
  });

  it('should not log the recipient address', async () => {
    // The fan-out's whole point is that participants' addresses stay private;
    // a log line naming one undoes that. The Resend id is enough to trace.
    const infoSpy = vi.spyOn(console, 'info');
    await sendPollEmail(message);
    const logged = JSON.stringify(infoSpy.mock.calls);
    expect(logged).not.toContain('billy@example.com');
    expect(logged).toContain('resend-id');
  });

  it('should tag every log line for poll mail, not the contact flow', async () => {
    const errorSpy = vi.spyOn(console, 'error');
    delete process.env.RESEND_API_KEY;
    await sendPollEmail(message);
    expect(errorSpy.mock.calls[0][0]).toContain('[poll-email]');
  });
});

describe('sendPollEmails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'info').mockImplementation(() => {});
    resetEnv();
    sendMock.mockResolvedValue({ data: { id: 'resend-id' }, error: null });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    process.env = { ...originalEnv };
  });

  /** Drives the paced loop to completion without waiting in real time. */
  async function runFanOut(messages: PollEmail[]): Promise<{ sent: number; failed: number }> {
    const promise = sendPollEmails(messages);
    await vi.runAllTimersAsync();
    return promise;
  }

  const recipients = (count: number): PollEmail[] =>
    Array.from({ length: count }, (_, index) => ({
      ...message,
      to: `person${index}@example.com`,
    }));

  it('should send one email per recipient', async () => {
    const result = await runFanOut(recipients(3));
    expect(result).toEqual({ sent: 3, failed: 0 });
    expect(sendMock).toHaveBeenCalledTimes(3);
  });

  it('should address each recipient individually, never all in one `to`', async () => {
    // Putting the group in a visible `to` discloses participants' addresses to
    // each other, which the Article 13 notice explicitly promises will not happen.
    await runFanOut(recipients(3));
    const addressed = sendMock.mock.calls.map((call) => call[0].to);
    expect(addressed).toEqual([
      'person0@example.com',
      'person1@example.com',
      'person2@example.com',
    ]);
  });

  it('should pace the sends rather than fire them concurrently', async () => {
    // Resend's documented default is 2 requests per second. A 20-person poll
    // firing concurrently hits the rate limit, and a 429 half-delivers the one
    // email that tells people the meeting is happening.
    const promise = sendPollEmails(recipients(3));

    await vi.advanceTimersByTimeAsync(0);
    expect(sendMock).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(600);
    expect(sendMock).toHaveBeenCalledTimes(2);

    await vi.runAllTimersAsync();
    await promise;
    expect(sendMock).toHaveBeenCalledTimes(3);
  });

  it('should not wait after the final send', async () => {
    const promise = sendPollEmails(recipients(1));
    await vi.advanceTimersByTimeAsync(0);
    await expect(promise).resolves.toEqual({ sent: 1, failed: 0 });
  });

  it('should carry on past a failed recipient so one bad address cannot stop the rest', async () => {
    sendMock
      .mockResolvedValueOnce({ data: { id: 'a' }, error: null })
      .mockResolvedValueOnce({ data: null, error: { message: 'Invalid recipient' } })
      .mockResolvedValueOnce({ data: { id: 'c' }, error: null });

    const result = await runFanOut(recipients(3));

    expect(result).toEqual({ sent: 2, failed: 1 });
    expect(sendMock).toHaveBeenCalledTimes(3);
  });

  it('should count a thrown send as a failure and carry on', async () => {
    sendMock
      .mockRejectedValueOnce(new Error('network down'))
      .mockResolvedValueOnce({ data: { id: 'b' }, error: null });

    const result = await runFanOut(recipients(2));

    expect(result).toEqual({ sent: 1, failed: 1 });
  });

  it('should report every recipient as failed when nothing is configured', async () => {
    // The organiser page uses the count to show who still needs telling by hand.
    delete process.env.RESEND_API_KEY;
    const result = await runFanOut(recipients(4));
    expect(result).toEqual({ sent: 0, failed: 4 });
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('should return zeroes and never throw on an empty list', async () => {
    await expect(runFanOut([])).resolves.toEqual({ sent: 0, failed: 0 });
  });
});
