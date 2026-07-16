import { describe, expect, it } from 'vitest';
import {
  answersCoverAllOptions,
  availabilitySchema,
  normaliseOptionalEmail,
  submitResponseSchema,
  updateResponseSchema,
} from './poll-responses';
import { VALIDATION_MESSAGES } from '@/lib/validation-messages';

const OPTION_A = '11111111-1111-4111-8111-111111111111';
const OPTION_B = '22222222-2222-4222-8222-222222222222';

function validSubmission(overrides: Record<string, unknown> = {}) {
  return {
    displayName: 'Billy Summers',
    email: '',
    votes: [{ optionId: OPTION_A, availability: 'yes' as const }],
    ...overrides,
  };
}

describe('availabilitySchema', () => {
  it.each(['yes', 'if_need_be', 'no'])('should accept the wire value %s', (value) => {
    expect(availabilitySchema.safeParse(value).success).toBe(true);
  });

  it('should reject if_needed, which the database CHECK constraint refuses', () => {
    // Not a style preference. `poll_responses.availability` allows exactly
    // 'yes' | 'if_need_be' | 'no', so this typo would fail every single vote.
    expect(availabilitySchema.safeParse('if_needed').success).toBe(false);
  });

  it('should reject maybe', () => {
    expect(availabilitySchema.safeParse('maybe').success).toBe(false);
  });
});

describe('submitResponseSchema', () => {
  it('should accept a valid submission with no email', () => {
    expect(submitResponseSchema.safeParse(validSubmission()).success).toBe(true);
  });

  it('should accept an empty string email, because an untouched input posts one', () => {
    const result = submitResponseSchema.safeParse(validSubmission({ email: '' }));
    expect(result.success).toBe(true);
  });

  it('should accept a valid email and lowercase it', () => {
    const result = submitResponseSchema.safeParse(validSubmission({ email: 'Peter@Example.COM' }));
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.email).toBe('peter@example.com');
  });

  it('should reject a malformed email', () => {
    const result = submitResponseSchema.safeParse(validSubmission({ email: 'not-an-address' }));
    expect(result.success).toBe(false);
  });

  it('should reject a name under 2 characters using the shared name message', () => {
    const result = submitResponseSchema.safeParse(validSubmission({ displayName: 'A' }));
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(VALIDATION_MESSAGES.name.minLength);
    }
  });

  it('should reject a whitespace-only name', () => {
    expect(submitResponseSchema.safeParse(validSubmission({ displayName: '   ' })).success).toBe(
      false
    );
  });

  it('should reject a name over 50 characters rather than invent a different cap', () => {
    const result = submitResponseSchema.safeParse(validSubmission({ displayName: 'a'.repeat(51) }));
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(VALIDATION_MESSAGES.name.maxLength);
    }
  });

  it('should trim the name', () => {
    const result = submitResponseSchema.safeParse(validSubmission({ displayName: '  Billy  ' }));
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.displayName).toBe('Billy');
  });

  it('should reject an empty votes array', () => {
    const result = submitResponseSchema.safeParse(validSubmission({ votes: [] }));
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(VALIDATION_MESSAGES.poll.answerEveryOption);
    }
  });

  it('should reject a duplicate option id', () => {
    const result = submitResponseSchema.safeParse(
      validSubmission({
        votes: [
          { optionId: OPTION_A, availability: 'yes' },
          { optionId: OPTION_A, availability: 'no' },
        ],
      })
    );
    expect(result.success).toBe(false);
  });

  it('should reject more than 8 votes, the poll option ceiling', () => {
    const votes = Array.from({ length: 9 }, (_, index) => ({
      optionId: `1111111${index}-1111-4111-8111-111111111111`,
      availability: 'yes' as const,
    }));
    expect(submitResponseSchema.safeParse(validSubmission({ votes })).success).toBe(false);
  });

  it('should reject a non-uuid option id', () => {
    const result = submitResponseSchema.safeParse(
      validSubmission({ votes: [{ optionId: 'nope', availability: 'yes' }] })
    );
    expect(result.success).toBe(false);
  });
});

describe('updateResponseSchema', () => {
  it('should accept a name and votes', () => {
    const result = updateResponseSchema.safeParse({
      displayName: 'Billy Summers',
      votes: [{ optionId: OPTION_A, availability: 'no' }],
    });
    expect(result.success).toBe(true);
  });

  it('should not carry an email, because updateResponse never writes one', () => {
    const result = updateResponseSchema.safeParse({
      displayName: 'Billy Summers',
      email: 'billy@example.com',
      votes: [{ optionId: OPTION_A, availability: 'no' }],
    });
    expect(result.success).toBe(true);
    // The address is dropped rather than silently persisted. An email field on
    // the edit screen would be a control that accepts input and discards it.
    if (result.success) expect(result.data).not.toHaveProperty('email');
  });
});

describe('normaliseOptionalEmail', () => {
  it('should turn an empty string into null', () => {
    // An empty string in poll_participants.email is a value that looks like an
    // address and would later be treated as a recipient.
    expect(normaliseOptionalEmail('')).toBeNull();
  });

  it('should turn whitespace into null', () => {
    expect(normaliseOptionalEmail('   ')).toBeNull();
  });

  it('should turn undefined into null', () => {
    expect(normaliseOptionalEmail(undefined)).toBeNull();
  });

  it('should lowercase and trim a real address', () => {
    expect(normaliseOptionalEmail('  Peter@Example.COM ')).toBe('peter@example.com');
  });
});

describe('answersCoverAllOptions', () => {
  it('should accept an exact match', () => {
    expect(answersCoverAllOptions([OPTION_A, OPTION_B], [OPTION_B, OPTION_A])).toBe(true);
  });

  it('should reject a missing answer', () => {
    // A partial response reads as availability the person never gave, and the
    // upsert in updateResponse would leave their old answer standing.
    expect(answersCoverAllOptions([OPTION_A, OPTION_B], [OPTION_A])).toBe(false);
  });

  it('should reject an unknown option, which would be a vote aimed at another poll', () => {
    expect(answersCoverAllOptions([OPTION_A], [OPTION_A, OPTION_B])).toBe(false);
  });

  it('should reject a same-size set with a substituted id', () => {
    // Same length, so a naive length check would pass this.
    expect(answersCoverAllOptions([OPTION_A], [OPTION_B])).toBe(false);
  });

  it('should accept two empty sets', () => {
    expect(answersCoverAllOptions([], [])).toBe(true);
  });
});
