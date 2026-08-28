import { z } from 'zod';

/**
 * One schema for the enquiry, shared by the client form, the server actions and the
 * storage mapper.
 *
 * The existing contact flow validates twice, in two places, with two different sets
 * of rules: the form has a Zod schema and the server action has a hand-written
 * chain of ifs. That is how they drift, and when they drift the server one wins
 * silently and the user gets an error the form said was fine.
 *
 * @see tasks/repositioning/SUB-SPECS.md part 1
 */

/**
 * Step one asks only what is needed to have a conversation, and the lead is written
 * the moment it is submitted. Someone who abandons at step two still leaves a real
 * enquiry rather than nothing.
 */
export const enquiryStep1Schema = z.object({
  name: z.string().trim().min(2, 'Tell us your name').max(80, 'That is longer than we can store'),
  email: z
    .string()
    .trim()
    .min(1, 'We need an email address to reply to')
    .max(254, 'That is longer than an email address can be')
    .email('That does not look like an email address'),
  company: z
    .string()
    .trim()
    .min(2, 'Tell us the company name')
    .max(120, 'That is longer than we can store'),
  situation: z
    .string()
    .trim()
    // The floor is deliberate. Someone who will not describe the problem in a
    // sentence is not the client, and with no price on the site this is one of the
    // few honest filters left.
    .min(20, 'A sentence or two, so we know what we are looking at')
    .max(2000, 'Keep it to a couple of paragraphs, we will ask the rest'),
  /**
   * Honeypot. A real person never sees it, so anything in it is a bot.
   *
   * It is deliberately NOT rejected here. Failing validation would send the bot a
   * message naming the field it got wrong, which is a free lesson, and would show a
   * real person an error against a field they cannot see if a password manager
   * filled it for them. The server action reads it and answers as though the
   * submission worked.
   */
  website: z.string().max(200).optional(),
});

export const ENQUIRY_ROLES = [
  'Owner or founder',
  'Managing director',
  'Chief executive',
  'Commercial director',
  'Operations director',
  'Marketing director',
  'Other',
] as const;

export const ENQUIRY_SIZE_BANDS = [
  '1 to 9',
  '10 to 49',
  '50 to 249',
  '250 to 500',
  'More than 500',
] as const;

/**
 * Step two is entirely optional and framed as such. It exists to make the first
 * conversation useful, not to qualify anyone out before it has happened.
 *
 * Two questions from the blueprint are deliberately absent. Investment range is
 * incoherent once pricing is off the site, and "who is involved in the decision" on
 * a form turns a discovery conversation into a qualification gate.
 */
export const enquiryStep2Schema = z.object({
  role: z.enum(ENQUIRY_ROLES).optional().or(z.literal('')),
  sizeBand: z.enum(ENQUIRY_SIZE_BANDS).optional().or(z.literal('')),
  companyWebsite: z
    .string()
    .trim()
    .max(200)
    .optional()
    .or(z.literal(''))
    .transform((value) =>
      value && !/^https?:\/\//i.test(value) ? `https://${value}` : (value ?? '')
    ),
  blocker: z.string().trim().max(2000).optional().or(z.literal('')),
  success: z.string().trim().max(2000).optional().or(z.literal('')),
  whyNow: z.string().trim().max(1000).optional().or(z.literal('')),
});

export type EnquiryStep1 = z.infer<typeof enquiryStep1Schema>;
export type EnquiryStep2 = z.infer<typeof enquiryStep2Schema>;

/** Shape stored in contacts.qualification, versioned so it can change later. */
export const QUALIFICATION_SCHEMA_VERSION = 1;

export interface QualificationPayload {
  blocker?: string;
  success?: string;
  whyNow?: string;
}

/** Turns validated step-two input into the jsonb column's shape. */
export function toQualificationPayload(input: EnquiryStep2): QualificationPayload {
  const payload: QualificationPayload = {};
  if (input.blocker) payload.blocker = input.blocker;
  if (input.success) payload.success = input.success;
  if (input.whyNow) payload.whyNow = input.whyNow;
  return payload;
}

/** How many of the six optional answers arrived. Tracked as an engagement signal. */
export function countCompletedFields(input: EnquiryStep2): number {
  return [
    input.role,
    input.sizeBand,
    input.companyWebsite,
    input.blocker,
    input.success,
    input.whyNow,
  ].filter((value) => Boolean(value && String(value).trim())).length;
}

/**
 * The lead pipeline.
 *
 * Extends the existing `status` column, which was free text defaulting to 'new'.
 * A database CHECK constraint enforces the same six, because a convention that
 * nothing enforces is a typo away from a seventh state that no filter knows about.
 *
 * @see supabase/migrations/20260828090000_contact_lead_states.sql
 */
export const LEAD_STATES = [
  'new',
  'contacted',
  'qualified',
  'conversation_booked',
  'declined',
  'client',
] as const;

export type LeadState = (typeof LEAD_STATES)[number];

export const LEAD_STATE_LABELS: Record<LeadState, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  conversation_booked: 'Conversation booked',
  declined: 'Declined',
  client: 'Client',
};

export function isLeadState(value: unknown): value is LeadState {
  return typeof value === 'string' && (LEAD_STATES as readonly string[]).includes(value);
}
