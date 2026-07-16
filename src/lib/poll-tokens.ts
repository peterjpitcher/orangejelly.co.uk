import { randomBytes } from 'crypto';

/**
 * Capability tokens for availability polls.
 *
 * There is no login anywhere in this feature — holding a token IS the
 * authorisation. That makes these tokens the entire access-control model, and a
 * guessable one is a full compromise of a poll, read and write.
 *
 * Three rules follow, and each is pinned by a test:
 *
 *   1. **CSPRNG only.** `randomBytes`, never `Math.random()`, never a uuid, never
 *      a counter. UUIDv1 leaks a timestamp and a MAC address; `Math.random()` is
 *      not seeded for unpredictability.
 *   2. **At least 128 bits of entropy**, per OWASP's floor for a session
 *      identifier. These are longer-lived than a session, so the floor is a floor.
 *   3. **Independent.** The organiser token must never be derivable from the
 *      participant token. They are drawn separately from the CSPRNG and share no
 *      seed, so a participant cannot compute the organiser link.
 *
 * The accepted trade-off, which is the price of no-login: anyone forwarded the
 * organiser link becomes the organiser. Doodle has the same property. The
 * organiser email names it rather than pretending otherwise.
 */

/** 22 base64url characters. */
export const TOKEN_LENGTH = 22;

/** 16 bytes drawn, encoded to 22 base64url chars ≈ 132 bits. */
const TOKEN_BYTES = 16;

/** Actual entropy of the drawn value, not of the encoding. */
export const TOKEN_ENTROPY_BITS = TOKEN_BYTES * 8;

const TOKEN_PATTERN = new RegExp(`^[A-Za-z0-9_-]{${TOKEN_LENGTH}}$`);

/**
 * Matches a token-shaped run in a string, for log scrubbing.
 *
 * The lookarounds are load-bearing. Without them the pattern matches a 22-char
 * window *inside* any longer run of the same alphabet — and a uuid is a 36-char
 * run of exactly that alphabet, so `poll_id=<uuid>` came back as
 * `poll_id=[token]c-0305e82c3301`, destroying the one identifier worth having in
 * a log. Only free-standing runs of exactly TOKEN_LENGTH are scrubbed.
 */
const TOKEN_IN_TEXT_PATTERN = new RegExp(
  `(?<![A-Za-z0-9_-])[A-Za-z0-9_-]{${TOKEN_LENGTH}}(?![A-Za-z0-9_-])`,
  'g'
);

export interface PollTokens {
  /** Shared with everyone invited. Grants voting only. */
  participantToken: string;
  /** Held by the organiser alone. Grants results, close, confirm and delete. */
  organiserToken: string;
  /** Per-participant. Grants editing that one response. */
  editToken: string;
}

/**
 * Draws one token from the CSPRNG.
 *
 * base64url rather than hex: the same entropy in fewer characters, and safe
 * unescaped in a URL path. Standard base64 would emit '+' and '/', which need
 * escaping, and '=' padding, which breaks naive route matching.
 */
export function generateToken(): string {
  return randomBytes(TOKEN_BYTES).toString('base64url').slice(0, TOKEN_LENGTH);
}

/**
 * Draws a poll's three tokens.
 *
 * Each is an independent draw. Nothing is derived from anything else, and
 * nothing is derived from the poll id.
 */
export function generatePollTokens(): PollTokens {
  return {
    participantToken: generateToken(),
    organiserToken: generateToken(),
    editToken: generateToken(),
  };
}

/**
 * True if the value could be one of our tokens.
 *
 * A shape check, not an authorisation check — it says nothing about whether the
 * token exists. Its job is to let a route reject obvious junk without a database
 * round-trip, and to keep traversal attempts out of a query.
 */
export function isWellFormedToken(value: unknown): value is string {
  return typeof value === 'string' && TOKEN_PATTERN.test(value);
}

/**
 * Replaces token-shaped runs with a placeholder, for anything that gets logged.
 *
 * Capability URLs leak through server logs, proxies, `Referer` headers and
 * browser history. Logs are the leak we control, so tokens never reach them.
 *
 * Deliberately shape-based rather than context-based: it catches a token
 * wherever it appears, including inside a URL or an error message. Uuids do not
 * match — they are not secrets and are useful in logs.
 */
export function scrubTokens(text: string): string {
  return text.replace(TOKEN_IN_TEXT_PATTERN, '[token]');
}
