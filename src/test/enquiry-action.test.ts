import { beforeEach, describe, expect, it, vi } from 'vitest';

import { submitEnquiry } from '@/app/actions/enquiry';
import { ENQUIRY_INITIAL_STATE } from '@/lib/schemas/enquiry';
import { storeEnquiryStep1, storeEnquiryStep2 } from '@/lib/db/enquiries';
import type * as RateLimit from '@/lib/rate-limit';

/**
 * The state machine behind the form.
 *
 * One action drives both steps so the whole enquiry can live in a single native
 * form and work without JavaScript. Which step runs is decided by the state the
 * form carries, never by anything the client asserts, and these tests exist mostly
 * to hold that line.
 */
vi.mock('@/lib/db/enquiries', () => ({
  storeEnquiryStep1: vi.fn(),
  storeEnquiryStep2: vi.fn(),
  countCompletedFields: vi.fn(() => 0),
}));

vi.mock('@/lib/db/leads', () => ({
  storeConversionEvent: vi.fn().mockResolvedValue({ stored: true }),
}));

vi.mock('@/lib/email', () => ({
  sendLeadNotification: vi.fn().mockResolvedValue({ success: true }),
  escapeHtml: (value: string) => value,
}));

vi.mock('next/headers', () => ({
  headers: () => new Headers({ 'x-forwarded-for': '203.0.113.9' }),
}));

vi.mock('@/lib/rate-limit', async () => {
  const actual = await vi.importActual<typeof RateLimit>('@/lib/rate-limit');
  return { ...actual, isRateLimitConfigured: () => false };
});

function formData(fields: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.append(key, value);
  return data;
}

const VALID = {
  name: 'Sam Whitfield',
  email: 'sam@bartonreed.co.uk',
  company: 'Barton Reed',
  situation: 'Enquiries have halved since the spring and nobody can agree why.',
};

describe('submitEnquiry, step one', () => {
  beforeEach(() => {
    vi.mocked(storeEnquiryStep1).mockReset().mockResolvedValue({ stored: true, id: 'lead-1' });
    vi.mocked(storeEnquiryStep2).mockReset().mockResolvedValue({ stored: true, id: 'lead-1' });
  });

  it('stores the enquiry and moves to step two', async () => {
    const next = await submitEnquiry(ENQUIRY_INITIAL_STATE, formData(VALID));

    expect(storeEnquiryStep1).toHaveBeenCalled();
    expect(next).toEqual({ step: 2, leadId: 'lead-1' });
  });

  it('reads attribution from the hidden field, and shrugs off a malformed one', async () => {
    await submitEnquiry(
      ENQUIRY_INITIAL_STATE,
      formData({ ...VALID, leadSource: '{"sourcePage":"/start-here"}' })
    );
    expect(vi.mocked(storeEnquiryStep1).mock.calls[0][1]).toMatchObject({
      sourcePage: '/start-here',
    });

    // A broken hidden field is an attribution problem, never a reason to lose the
    // enquiry.
    const next = await submitEnquiry(
      ENQUIRY_INITIAL_STATE,
      formData({ ...VALID, leadSource: '{' })
    );
    expect(next.step).toBe(2);
  });

  it('returns the field errors and what was typed, so the form can be rebuilt', async () => {
    const next = await submitEnquiry(
      ENQUIRY_INITIAL_STATE,
      formData({ ...VALID, email: 'sam@', situation: 'help' })
    );

    expect(storeEnquiryStep1).not.toHaveBeenCalled();
    expect(next.step).toBe(1);
    expect(Object.keys(next.fieldErrors ?? {})).toEqual(['email', 'situation']);
    expect(next.values).toMatchObject({ name: 'Sam Whitfield', email: 'sam@' });
  });

  it('sends a honeypot submission straight to the confirmation without storing it', async () => {
    const next = await submitEnquiry(
      ENQUIRY_INITIAL_STATE,
      formData({ ...VALID, subject: 'http://spam.example' })
    );

    // Telling a bot it failed only teaches it. It gets the thank-you and no lead id,
    // so it is not walked through step two either.
    expect(storeEnquiryStep1).not.toHaveBeenCalled();
    expect(next).toEqual({ step: 'done' });
  });

  it('keeps the form on step one when the row could not be written', async () => {
    vi.mocked(storeEnquiryStep1).mockResolvedValue({ stored: false, error: 'down' });

    const next = await submitEnquiry(ENQUIRY_INITIAL_STATE, formData(VALID));
    expect(next.step).toBe(1);
    expect(next.error).toMatch(/peter@orangejelly.co.uk/);
    expect(next.values).toMatchObject({ email: 'sam@bartonreed.co.uk' });
  });
});

describe('submitEnquiry, step two', () => {
  beforeEach(() => {
    vi.mocked(storeEnquiryStep1).mockReset().mockResolvedValue({ stored: true, id: 'lead-1' });
    vi.mocked(storeEnquiryStep2).mockReset().mockResolvedValue({ stored: true, id: 'lead-1' });
  });

  it('enriches the lead the previous state names', async () => {
    const next = await submitEnquiry(
      { step: 2, leadId: 'lead-1' },
      formData({ role: 'Managing director', blocker: 'Nobody agrees what the problem is' })
    );

    expect(storeEnquiryStep2).toHaveBeenCalledWith(
      'lead-1',
      expect.objectContaining({ role: 'Managing director' })
    );
    expect(next).toEqual({ step: 'done', leadId: 'lead-1' });
  });

  it('honours skip without writing anything', async () => {
    const next = await submitEnquiry({ step: 2, leadId: 'lead-1' }, formData({ intent: 'skip' }));

    // Step two is described as optional, so the control that says so has to work.
    expect(storeEnquiryStep2).not.toHaveBeenCalled();
    expect(next).toEqual({ step: 'done', leadId: 'lead-1' });
  });

  it('still confirms when step two fails, because the enquiry is already safe', async () => {
    vi.mocked(storeEnquiryStep2).mockResolvedValue({ stored: false, error: 'down' });

    const next = await submitEnquiry(
      { step: 2, leadId: 'lead-1' },
      formData({ whyNow: 'Renewal' })
    );
    // There is nothing useful for the person to do about it, and telling them
    // implies their enquiry is at risk when it is not.
    expect(next).toEqual({ step: 'done', leadId: 'lead-1' });
  });

  it('cannot be reached without a lead id, whatever the form claims', async () => {
    // A crafted post saying step 2 with no lead id falls back to step one, where the
    // missing contact fields fail validation. It never reaches the update path.
    const next = await submitEnquiry({ step: 2 }, formData({ role: 'Managing director' }));

    expect(storeEnquiryStep2).not.toHaveBeenCalled();
    expect(next.step).toBe(1);
  });
});
