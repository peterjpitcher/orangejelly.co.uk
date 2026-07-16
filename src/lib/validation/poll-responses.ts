import { z } from 'zod';
import { VALIDATION_MESSAGES } from '@/lib/validation-messages';

/**
 * Validation for participant answers.
 *
 * The wire values are fixed by `poll_responses.availability`'s CHECK constraint:
 * 'yes', 'if_need_be', 'no'. Not 'if_needed' — the database rejects anything
 * else, so a typo here is not a cosmetic bug, it is every vote failing.
 *
 * Name rules reuse VALIDATION_MESSAGES.name rather than inventing a second cap
 * (§1 P1.7). A different limit here would make `name.maxLength` a lie.
 */

/** The three answers, exactly as the CHECK constraint spells them. */
export const availabilitySchema = z.enum(['yes', 'if_need_be', 'no']);

export type AvailabilityAnswer = z.infer<typeof availabilitySchema>;

/**
 * One answer per option.
 *
 * `.min(1)` and the duplicate refinement are structural only. They do not prove
 * the set is complete — the option ids belong to the poll and only the server
 * knows them, so set-equality is checked in the action against the database.
 */
const votesSchema = z
  .array(
    z.object({
      optionId: z.string().uuid('That option is not valid'),
      availability: availabilitySchema,
    })
  )
  .min(1, VALIDATION_MESSAGES.poll.answerEveryOption)
  .max(8, VALIDATION_MESSAGES.poll.tooManyOptions)
  .refine((votes) => new Set(votes.map((vote) => vote.optionId)).size === votes.length, {
    message: 'Each option can only be answered once',
  });

const displayNameSchema = z
  .string()
  .trim()
  .min(1, VALIDATION_MESSAGES.name.required)
  .min(2, VALIDATION_MESSAGES.name.minLength)
  .max(50, VALIDATION_MESSAGES.name.maxLength);

/**
 * Optional email.
 *
 * Accepts `''` as well as `undefined` because an untouched optional input posts
 * an empty string. The action normalises `''` to `null` before it reaches
 * `poll_participants.email`, which is nullable — an empty string stored there is
 * a value that looks like an address and would later be treated as one.
 */
const optionalEmailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email(VALIDATION_MESSAGES.email.invalid)
  .max(254, 'That email address is too long')
  .optional()
  .or(z.literal(''));

export const submitResponseSchema = z.object({
  displayName: displayNameSchema,
  email: optionalEmailSchema,
  votes: votesSchema,
  /** Honeypot. Never rendered to a person, so anything in it is a bot. */
  website: z.string().optional(),
});

/**
 * Editing does not carry an email.
 *
 * `updateResponse` never writes `poll_participants.email` (§3.6.4), so an email
 * field here would be a control that accepts input and silently discards it.
 * The edit screen therefore renders no email input at all — not an editable one
 * and not a pre-filled disabled one.
 */
export const updateResponseSchema = z.object({
  displayName: displayNameSchema,
  votes: votesSchema,
  website: z.string().optional(),
});

export type SubmitResponseInput = z.infer<typeof submitResponseSchema>;
export type UpdateResponseInput = z.infer<typeof updateResponseSchema>;

/**
 * Normalises the optional email to what the column wants.
 *
 * One place, because `''` reaching the database is the whole failure mode.
 */
export function normaliseOptionalEmail(email: string | undefined): string | null {
  const trimmed = email?.trim();
  return trimmed ? trimmed.toLowerCase() : null;
}

/**
 * Proves the answered set is exactly the poll's option set — both directions.
 *
 * Both directions matter, and for different reasons:
 *   - An **unknown** option id means a vote aimed at another poll. The composite
 *     FK would catch it, but as an opaque write failure and an ugly log line.
 *   - A **missing** answer means a partial response, which reads as availability
 *     nobody gave (§1 P1.5). It also matters to `updateResponse`, whose upsert
 *     never prunes: a payload that omits an option leaves the previous answer
 *     standing rather than clearing it. This check is what stops that being a
 *     silent partial update.
 */
export function answersCoverAllOptions(
  optionIds: readonly string[],
  answeredIds: readonly string[]
): boolean {
  const expected = new Set(optionIds);
  const answered = new Set(answeredIds);

  if (expected.size !== answered.size) return false;
  for (const id of expected) {
    if (!answered.has(id)) return false;
  }
  return true;
}
