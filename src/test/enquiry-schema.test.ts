import { describe, expect, it } from 'vitest';

import {
  ENQUIRY_ROLES,
  ENQUIRY_SIZE_BANDS,
  countCompletedFields,
  enquiryStep1Schema,
  enquiryStep2Schema,
  toQualificationPayload,
} from '@/lib/schemas/enquiry';

const VALID = {
  name: 'Sam Whitfield',
  email: 'sam@bartonreed.co.uk',
  company: 'Barton Reed',
  situation: 'Enquiries have halved since the spring and nobody can agree why.',
};

describe('enquiry step one', () => {
  it('accepts a real enquiry', () => {
    expect(enquiryStep1Schema.safeParse(VALID).success).toBe(true);
  });

  it('requires enough of the situation to be worth reading', () => {
    // The floor is a filter, not a formality. With no price on the site it is one
    // of the few honest ones left.
    const result = enquiryStep1Schema.safeParse({ ...VALID, situation: 'help' });
    expect(result.success).toBe(false);
  });

  it('accepts a free email provider', () => {
    // Plenty of legitimate owner-operators use Gmail. Rejecting them would filter
    // out exactly the ambitious small business this is aimed at.
    expect(
      enquiryStep1Schema.safeParse({ ...VALID, email: 'sam@gmail.com' }).success
    ).toBe(true);
  });

  it('rejects an address that is not one', () => {
    expect(enquiryStep1Schema.safeParse({ ...VALID, email: 'sam@' }).success).toBe(false);
  });

  it('trims rather than rejecting padded input', () => {
    const result = enquiryStep1Schema.parse({ ...VALID, name: '  Sam Whitfield  ' });
    expect(result.name).toBe('Sam Whitfield');
  });

  it('gives a message per field, so the form can show them inline', () => {
    const result = enquiryStep1Schema.safeParse({ name: 'S', email: 'no', company: '', situation: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const fields = new Set(result.error.issues.map((issue) => issue.path[0]));
      expect(fields).toEqual(new Set(['name', 'email', 'company', 'situation']));
    }
  });

  it('carries a honeypot, and lets a filled one through to the action', () => {
    // Rejecting it here would tell the bot which field is the trap, and would show a
    // real person an error against a field they cannot see if a password manager
    // filled it. The action reads it and answers as though the submission worked.
    const filled = enquiryStep1Schema.safeParse({ ...VALID, subject: 'http://spam' });
    expect(filled.success).toBe(true);
    if (filled.success) expect(filled.data.subject).toBe('http://spam');
  });
});

describe('enquiry step two', () => {
  it('accepts nothing at all, because every answer is optional', () => {
    expect(enquiryStep2Schema.safeParse({}).success).toBe(true);
  });

  it('normalises a website typed without a scheme', () => {
    const result = enquiryStep2Schema.parse({ companyWebsite: 'bartonreed.co.uk' });
    expect(result.companyWebsite).toBe('https://bartonreed.co.uk');
  });

  it('leaves an already-qualified website alone', () => {
    const result = enquiryStep2Schema.parse({ companyWebsite: 'https://bartonreed.co.uk' });
    expect(result.companyWebsite).toBe('https://bartonreed.co.uk');
  });

  it('offers roles and size bands the target client recognises', () => {
    expect(ENQUIRY_ROLES).toContain('Managing director');
    expect(ENQUIRY_SIZE_BANDS).toContain('10 to 49');
  });

  it('does not ask for a budget or who decides', () => {
    // Both were in the blueprint. Asking for a budget is incoherent with no prices
    // on the site, and asking who decides turns a discovery conversation into a
    // qualification gate.
    const keys = Object.keys(enquiryStep2Schema.shape);
    expect(keys).not.toContain('investment');
    expect(keys).not.toContain('decisionMaker');
  });

  it('only stores the answers that were given', () => {
    const payload = toQualificationPayload(
      enquiryStep2Schema.parse({ blocker: 'We cannot agree what the problem is' })
    );
    expect(payload).toEqual({ blocker: 'We cannot agree what the problem is' });
  });

  it('counts completed answers as an engagement signal', () => {
    const input = enquiryStep2Schema.parse({
      role: 'Managing director',
      sizeBand: '10 to 49',
      blocker: 'Conversion',
    });
    expect(countCompletedFields(input)).toBe(3);
    expect(countCompletedFields(enquiryStep2Schema.parse({}))).toBe(0);
  });
});

describe('the honeypot field name', () => {
  it('is not a name a password manager fills', () => {
    // The obvious name is `website`, and that is exactly the name Chrome and most
    // managers fill unprompted: autocomplete="off" is ignored on URL-shaped
    // fields. A honeypot an autofiller trips is worse than no honeypot, because a
    // real person's enquiry is silently discarded while they are shown a
    // confirmation.
    const keys = Object.keys(enquiryStep1Schema.shape);
    expect(keys).toContain('subject');
    expect(keys).not.toContain('website');
  });
});
