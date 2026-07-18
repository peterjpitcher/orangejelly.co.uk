import { describe, it, expect } from 'vitest';
import {
  TOKEN_LENGTH,
  TOKEN_ENTROPY_BITS,
  generateToken,
  generatePollTokens,
  isWellFormedToken,
  scrubTokens,
} from './poll-tokens';

/**
 * These tokens are capability URLs: holding one IS the authorisation. There is no
 * login behind them, so a guessable token is a full compromise of a poll — read
 * and write. The properties below are the security model, not style preferences.
 */

describe('generateToken', () => {
  it('carries at least 128 bits of entropy', () => {
    // OWASP's floor for a session identifier. 22 base64url chars = 132 bits.
    expect(TOKEN_ENTROPY_BITS).toBeGreaterThanOrEqual(128);
  });

  it('is base64url, so it is safe unescaped in a URL path', () => {
    // '+' and '/' from standard base64 would need escaping; '=' padding breaks
    // naive route matching.
    for (let i = 0; i < 50; i += 1) {
      expect(generateToken()).toMatch(/^[A-Za-z0-9_-]+$/);
    }
  });

  it('is the declared length every time', () => {
    for (let i = 0; i < 50; i += 1) {
      expect(generateToken()).toHaveLength(TOKEN_LENGTH);
    }
  });

  it('does not repeat across a large sample', () => {
    const seen = new Set<string>();
    for (let i = 0; i < 5000; i += 1) {
      seen.add(generateToken());
    }
    expect(seen.size).toBe(5000);
  });

  it('does not concentrate on any character position', () => {
    // A crude smoke test for a broken source: if every token started with the
    // same character, entropy would be far lower than advertised.
    const firstChars = new Set<string>();
    for (let i = 0; i < 500; i += 1) {
      firstChars.add(generateToken()[0]);
    }
    expect(firstChars.size).toBeGreaterThan(10);
  });
});

describe('generatePollTokens', () => {
  it('returns three distinct tokens', () => {
    const { participantToken, organiserToken, editToken } = generatePollTokens();
    expect(new Set([participantToken, organiserToken, editToken]).size).toBe(3);
  });

  it('never derives the organiser token from the participant token', () => {
    // The whole access model rests on this. Anyone holding a participant link
    // must not be able to compute the organiser link from it.
    const pairs = Array.from({ length: 200 }, () => generatePollTokens());

    for (const { participantToken, organiserToken } of pairs) {
      expect(organiserToken).not.toBe(participantToken);
      expect(organiserToken).not.toContain(participantToken.slice(0, 8));
      expect(participantToken).not.toContain(organiserToken.slice(0, 8));
    }

    // No shared prefix across the sample either, which a counter or a common
    // seed would produce.
    const prefixes = new Set(pairs.map((p) => p.organiserToken.slice(0, 6)));
    expect(prefixes.size).toBeGreaterThan(150);
  });

  it('produces globally unique tokens across many polls', () => {
    const all = new Set<string>();
    for (let i = 0; i < 1000; i += 1) {
      const t = generatePollTokens();
      all.add(t.participantToken);
      all.add(t.organiserToken);
      all.add(t.editToken);
    }
    expect(all.size).toBe(3000);
  });
});

describe('isWellFormedToken', () => {
  it('accepts a generated token', () => {
    expect(isWellFormedToken(generateToken())).toBe(true);
  });

  it.each([
    ['', 'empty'],
    ['short', 'too short'],
    ['a'.repeat(TOKEN_LENGTH + 1), 'too long'],
    ['a'.repeat(TOKEN_LENGTH - 1) + '+', 'a non-base64url character'],
    ['a'.repeat(TOKEN_LENGTH - 1) + '/', 'a path separator'],
    ['a'.repeat(TOKEN_LENGTH - 1) + '=', 'base64 padding'],
    ['../../etc/passwd', 'a traversal attempt'],
  ])('rejects %s (%s)', (input) => {
    expect(isWellFormedToken(input)).toBe(false);
  });

  it.each([[null], [undefined], [42], [{}], [[]]])('rejects the non-string %s', (input) => {
    expect(isWellFormedToken(input)).toBe(false);
  });

  it('lets a route reject a malformed token before it ever reaches the database', () => {
    // The point of the guard: no database round-trip for obvious junk.
    expect(isWellFormedToken('not-a-real-token')).toBe(false);
  });
});

describe('scrubTokens', () => {
  it('removes a token from a log line', () => {
    const token = generateToken();
    const scrubbed = scrubTokens(`GET /availability/p/${token} 200`);

    expect(scrubbed).not.toContain(token);
    expect(scrubbed).toContain('[token]');
  });

  it('removes every token when a line carries more than one', () => {
    const a = generateToken();
    const b = generateToken();
    const scrubbed = scrubTokens(`from=/availability/p/${a} to=/availability/o/${b}`);

    expect(scrubbed).not.toContain(a);
    expect(scrubbed).not.toContain(b);
  });

  it('leaves ordinary text alone', () => {
    expect(scrubTokens('Poll closed by organiser')).toBe('Poll closed by organiser');
  });

  it('does not scrub a uuid, which is not a secret', () => {
    // Poll ids are not capability tokens and are useful in logs.
    const uuid = '3f2504e0-4f89-11d3-9a0c-0305e82c3301';
    expect(scrubTokens(`poll_id=${uuid}`)).toContain(uuid);
  });

  it('handles an empty string', () => {
    expect(scrubTokens('')).toBe('');
  });
});
