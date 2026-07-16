import { beforeEach, describe, expect, it, vi } from 'vitest';

import { calculateExpiresAt, createPoll, MAX_OPTIONS, RETENTION_DAYS } from './polls';

/**
 * Supabase is mocked throughout — the repo's rule is that tests never reach a
 * real service. The pure retention logic is tested directly; the storage paths
 * are tested through the mock to prove their guards and their clean-up.
 */

const insert = vi.fn();
const del = vi.fn();
const eq = vi.fn();

vi.mock('./supabase-admin', () => ({
  isSupabaseAdminConfigured: vi.fn(() => true),
  getSupabaseAdminClient: vi.fn(() => ({
    from: (table: string) => ({
      insert: (rows: unknown) => insert(table, rows),
      delete: () => ({ eq: (col: string, val: unknown) => del(table, col, val) }),
      select: () => ({ eq }),
    }),
  })),
}));

beforeEach(() => {
  vi.clearAllMocks();
  insert.mockResolvedValue({ error: null });
  del.mockResolvedValue({ error: null });
});

const dateOption = (optionDate: string) => ({ optionDate });

const validInput = {
  title: 'Catch-up about the quiz night',
  organiserName: 'Peter',
  organiserEmail: 'Peter@OrangeJelly.co.uk',
  optionKind: 'dates' as const,
  options: [dateOption('2026-08-04'), dateOption('2026-08-05')],
};

describe('calculateExpiresAt', () => {
  it('expires the retention window after the last option, not after creation', () => {
    // A poll for an event two months out must not be swept before it happens.
    const from = new Date('2026-07-16T12:00:00Z');
    const expires = calculateExpiresAt([dateOption('2026-09-30')], from);

    // 30 Sept end-of-day plus 60 days.
    expect(expires.toISOString().slice(0, 10)).toBe('2026-11-29');
  });

  it('expires the retention window after creation when every option is in the past', () => {
    const from = new Date('2026-07-16T12:00:00Z');
    const expires = calculateExpiresAt([dateOption('2026-01-01')], from);

    expect(expires.toISOString().slice(0, 10)).toBe('2026-09-14');
  });

  it('uses the latest option when several are given', () => {
    const from = new Date('2026-07-16T12:00:00Z');
    const expires = calculateExpiresAt(
      [dateOption('2026-08-04'), dateOption('2026-09-30'), dateOption('2026-08-20')],
      from
    );

    expect(expires.toISOString().slice(0, 10)).toBe('2026-11-29');
  });

  it('handles slot options via their end instant', () => {
    const from = new Date('2026-07-16T12:00:00Z');
    const expires = calculateExpiresAt(
      [{ startsAt: new Date('2026-09-30T18:00:00Z'), endsAt: new Date('2026-09-30T19:00:00Z') }],
      from
    );

    expect(expires.toISOString().slice(0, 10)).toBe('2026-11-29');
  });

  it('honours the agreed retention window', () => {
    expect(RETENTION_DAYS).toBe(60);
  });
});

describe('createPoll', () => {
  it('should store a poll and return both tokens when the input is valid', async () => {
    const result = await createPoll(validInput);

    expect(result.stored).toBe(true);
    expect(result.data?.participantToken).toHaveLength(22);
    expect(result.data?.organiserToken).toHaveLength(22);
    expect(result.data?.participantToken).not.toBe(result.data?.organiserToken);
  });

  it('should open in draft, not open, so an unverified poll cannot collect votes', async () => {
    // An unverified create endpoint is an open relay for our sending domain.
    await createPoll(validInput);

    const [, row] = insert.mock.calls.find(([table]) => table === 'polls')!;
    expect(row.status).toBe('draft');
    expect(row.email_verified_at).toBeUndefined();
  });

  it('should store the agenda separately from the description', async () => {
    // Two different things: description frames the invitation, agenda says what
    // will be discussed. Collapsing them loses the agenda from the calendar
    // entry, which is where it matters most.
    await createPoll({
      ...validInput,
      description: 'A catch-up about the quiz night.',
      agenda: '1. Last quarter\n2. New format\n3. Prize budget',
    });

    const [, row] = insert.mock.calls.find(([table]) => table === 'polls')!;
    expect(row.description).toBe('A catch-up about the quiz night.');
    expect(row.agenda).toBe('1. Last quarter\n2. New format\n3. Prize budget');
  });

  it('should store a null agenda when none is given, not an empty string', async () => {
    await createPoll({ ...validInput, agenda: '   ' });

    const [, row] = insert.mock.calls.find(([table]) => table === 'polls')!;
    expect(row.agenda).toBeNull();
  });

  it('should normalise the organiser email to lower case', async () => {
    await createPoll(validInput);

    const [, row] = insert.mock.calls.find(([table]) => table === 'polls')!;
    expect(row.organiser_email).toBe('peter@orangejelly.co.uk');
  });

  it('should lock the timezone to Europe/London', async () => {
    await createPoll(validInput);

    const [, row] = insert.mock.calls.find(([table]) => table === 'polls')!;
    expect(row.timezone).toBe('Europe/London');
  });

  it('should number options from one, in the order given', async () => {
    await createPoll(validInput);

    const [, rows] = insert.mock.calls.find(([table]) => table === 'poll_options')!;
    expect(rows.map((r: { position: number }) => r.position)).toEqual([1, 2]);
  });

  it('should reject a poll with no options', async () => {
    const result = await createPoll({ ...validInput, options: [] });

    expect(result.stored).toBe(false);
    expect(result.error).toMatch(/at least one option/i);
    expect(insert).not.toHaveBeenCalled();
  });

  it(`should reject more than ${MAX_OPTIONS} options`, async () => {
    // The cap is a product decision: large option sets make people silently omit
    // real availability.
    const options = Array.from({ length: MAX_OPTIONS + 1 }, (_, i) =>
      dateOption(`2026-08-${String(i + 1).padStart(2, '0')}`)
    );

    const result = await createPoll({ ...validInput, options });

    expect(result.stored).toBe(false);
    expect(result.error).toMatch(new RegExp(`at most ${MAX_OPTIONS}`, 'i'));
    expect(insert).not.toHaveBeenCalled();
  });

  it('should report the error and not orphan a poll when the poll insert fails', async () => {
    insert.mockResolvedValueOnce({ error: { message: 'poll insert exploded' } });

    const result = await createPoll(validInput);

    expect(result.stored).toBe(false);
    expect(result.error).toBe('poll insert exploded');
  });

  it('should delete the poll when its options fail to store', async () => {
    // A draft poll with no options would confuse the organiser on verification.
    insert
      .mockResolvedValueOnce({ error: null })
      .mockResolvedValueOnce({ error: { message: 'options insert exploded' } });

    const result = await createPoll(validInput);

    expect(result.stored).toBe(false);
    expect(del).toHaveBeenCalledWith('polls', 'id', expect.any(String));
  });

  it('should return an error rather than throw when the database is not configured', async () => {
    const { isSupabaseAdminConfigured } = await import('./supabase-admin');
    vi.mocked(isSupabaseAdminConfigured).mockReturnValueOnce(false);

    const result = await createPoll(validInput);

    expect(result.stored).toBe(false);
    expect(result.error).toMatch(/not configured/i);
  });

  it('should give two polls different tokens', async () => {
    const first = await createPoll(validInput);
    const second = await createPoll(validInput);

    expect(first.data?.participantToken).not.toBe(second.data?.participantToken);
    expect(first.data?.organiserToken).not.toBe(second.data?.organiserToken);
  });
});
