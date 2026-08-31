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

  it('stores the enquiry and confirms, with nothing else asked', async () => {
    const next = await submitEnquiry(ENQUIRY_INITIAL_STATE, formData(VALID));

    expect(storeEnquiryStep1).toHaveBeenCalled();
    expect(next).toEqual({ step: 'done', leadId: 'lead-1' });
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
    expect(next.step).toBe('done');
  });

  it('returns the field errors and what was typed, so the form can be rebuilt', async () => {
    const next = await submitEnquiry(
      ENQUIRY_INITIAL_STATE,
      formData({ ...VALID, email: 'sam@', situation: '' })
    );

    expect(storeEnquiryStep1).not.toHaveBeenCalled();
    expect(next.step).toBe(1);
    expect(Object.keys(next.fieldErrors ?? {})).toEqual(['email', 'situation']);
    expect(next.values).toMatchObject({ name: 'Sam Whitfield', email: 'sam@' });
  });

  /*
   * The minimum length came off on 31 August 2026. It was twenty characters, argued
   * as a filter on people who would not describe the problem; the owner's view is
   * that it is friction on the one field between somebody and a conversation. Four
   * characters used to be rejected and now go through, and the field is still
   * required, so an empty one still fails above.
   */
  it('accepts a short answer, because there is no minimum any more', async () => {
    const next = await submitEnquiry(
      ENQUIRY_INITIAL_STATE,
      formData({ ...VALID, situation: 'help' })
    );

    expect(storeEnquiryStep1).toHaveBeenCalled();
    expect(next.step).toBe('done');
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

/*
 * REPLACED 31 August 2026, when the second screen of optional questions was removed
 * on the owner's instruction. Six tests covered enriching, skipping and failing on a
 * step that no longer runs. What is worth keeping is the guarantee that took its
 * place: the enquiry now finishes where it is stored, so nothing can put a person
 * between deciding to make contact and being told it worked.
 *
 * `storeEnquiryStep2` and its columns are untouched: rows written before today still
 * carry answers and the admin dashboard still reads them.
 */
describe('submitEnquiry, after the second step was removed', () => {
  beforeEach(() => {
    vi.mocked(storeEnquiryStep1).mockReset().mockResolvedValue({ stored: true, id: 'lead-1' });
    vi.mocked(storeEnquiryStep2).mockReset().mockResolvedValue({ stored: true, id: 'lead-1' });
  });

  it('never returns step two, so the form can never render it again', async () => {
    const next = await submitEnquiry(ENQUIRY_INITIAL_STATE, formData(VALID));
    expect(next.step).toBe('done');
  });

  it('writes nothing to the step two columns from the form', async () => {
    await submitEnquiry(ENQUIRY_INITIAL_STATE, formData(VALID));
    expect(storeEnquiryStep2).not.toHaveBeenCalled();
  });

  it('ignores a crafted post claiming to be on the old second step', async () => {
    // A stale tab or a hand-rolled request must not reach the update path. With no
    // contact fields it falls through to validation, which is the safe outcome.
    const next = await submitEnquiry(
      { step: 2, leadId: 'lead-1' } as never,
      formData({ role: 'Managing director' })
    );

    expect(storeEnquiryStep2).not.toHaveBeenCalled();
    expect(next.step).toBe(1);
  });
});
