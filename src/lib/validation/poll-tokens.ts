import { z } from 'zod';
import { isWellFormedToken } from '@/lib/poll-tokens';
import { VALIDATION_MESSAGES } from '@/lib/validation-messages';

/**
 * Token schemas — deliberately NOT in ./polls.ts.
 *
 * `@/lib/poll-tokens` opens with `import { randomBytes } from 'crypto'`. That is
 * correct for a module whose job is minting tokens, but it is a module-level
 * import of a Node builtin, so anything reaching it from a client component
 * drags webpack's browserified `crypto` shim — 317 KB of pseudoRandomBytes,
 * createHash and friends — into the browser bundle. Putting `tokenSchema` in
 * ./polls.ts did exactly that: the create form imports `createPollSchema`, and
 * /availability/new alone went to 313 KB First Load against /contact's 201 KB
 * for a comparable form.
 *
 * Tree-shaking does not rescue us there — the crypto import is a module side
 * effect, so pulling one pure function out of the module pulls the whole thing.
 *
 * Nothing here is ever needed client-side: a token is validated where it is
 * redeemed, which is always the server. Keeping these schemas in their own file
 * is what lets ./polls.ts stay client-safe.
 */

/** A capability token. Shape only — existence is a database question. */
export const tokenSchema = z.string().refine(isWellFormedToken, {
  message: VALIDATION_MESSAGES.poll.linkNotValid,
});

export const verifyOrganiserEmailSchema = z.object({ token: tokenSchema });

export const resendVerificationSchema = z.object({ resendToken: tokenSchema });
