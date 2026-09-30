import { describe, expect, it } from 'vitest';

import { MAX_INVITEES_PER_POLL, inviteEmailsProblem, parseInviteEmails } from './poll-invitees';

describe('parseInviteEmails', () => {
  it('should take one address per line', () => {
    expect(parseInviteEmails('sam@example.com\nalex@example.com').emails).toEqual([
      'sam@example.com',
      'alex@example.com',
    ]);
  });

  it('should take commas, semicolons and plain spaces', () => {
    expect(
      parseInviteEmails('a@example.com, b@example.com; c@example.com d@example.com').emails
    ).toEqual(['a@example.com', 'b@example.com', 'c@example.com', 'd@example.com']);
  });

  it('should keep the address out of a pasted Outlook "To" line', () => {
    const parsed = parseInviteEmails('Sam Reed <Sam@Example.com>; "Reed, Alex" <alex@example.com>');
    expect(parsed.emails).toEqual(['sam@example.com', 'alex@example.com']);
    expect(parsed.invalid).toEqual([]);
  });

  it('should not let a display name swallow a plain address typed before it', () => {
    expect(parseInviteEmails('a@example.com Sam Reed <sam@example.com>').emails).toEqual([
      'a@example.com',
      'sam@example.com',
    ]);
  });

  it('should lowercase and de-duplicate, keeping the first order', () => {
    expect(parseInviteEmails('B@example.com\nb@example.com\na@example.com').emails).toEqual([
      'b@example.com',
      'a@example.com',
    ]);
  });

  it('should report what is not an address rather than drop it', () => {
    // A silently lost typo is a person who never gets asked.
    const parsed = parseInviteEmails('sam@example.com\nalex@example\nbob');
    expect(parsed.emails).toEqual(['sam@example.com']);
    expect(parsed.invalid).toEqual(['alex@example', 'bob']);
  });

  it('should treat an empty box as nobody to invite', () => {
    expect(parseInviteEmails('')).toEqual({ emails: [], invalid: [] });
    expect(parseInviteEmails(undefined)).toEqual({ emails: [], invalid: [] });
    expect(parseInviteEmails('  \n , ')).toEqual({ emails: [], invalid: [] });
  });
});

describe('inviteEmailsProblem', () => {
  it('should name the first thing that is not an address', () => {
    expect(inviteEmailsProblem(parseInviteEmails('alex@example'))).toBe(
      '"alex@example" is not an email address. Fix it or take it out.'
    );
    expect(inviteEmailsProblem(parseInviteEmails('alex@example, bob, carl'))).toContain(
      'and 2 more are not email addresses'
    );
  });

  it('should refuse more than the per-poll cap', () => {
    const many = Array.from({ length: MAX_INVITEES_PER_POLL + 1 }, (_, i) => `p${i}@example.com`);
    expect(inviteEmailsProblem(parseInviteEmails(many.join('\n')))).toContain(
      `up to ${MAX_INVITEES_PER_POLL}`
    );
  });

  it('should pass a clean list', () => {
    expect(inviteEmailsProblem(parseInviteEmails('sam@example.com'))).toBeNull();
  });
});
