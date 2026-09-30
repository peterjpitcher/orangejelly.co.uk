import { z } from 'zod';

/**
 * Turns whatever the organiser pasted into a clean list of addresses.
 *
 * People paste from everywhere: one per line, comma or semicolon separated, or
 * straight out of an Outlook "To" line as `Sam Reed <sam@example.com>`. All of
 * those work. Anything that is not an address is reported back rather than
 * dropped, because a silently lost typo is a person who never gets asked.
 */

/**
 * The most people one poll may invite by email.
 *
 * A guard against a pasted list going wrong, not a sending budget: Peter's
 * Resend account is on a paid plan. Fifty is well past any team meeting. Lives
 * here, not in the data layer, so the browser form can use it without pulling
 * server code into its bundle.
 */
export const MAX_INVITEES_PER_POLL = 50;

const emailSchema = z.string().email();

/** The raw box, as the form sends it. Generous, because a pasted "To" line is long. */
export const inviteEmailsFieldSchema = z
  .string()
  .max(10_000, 'That list is too long. Paste fewer addresses.')
  .optional();

export interface ParsedInviteEmails {
  /** Valid, lowercased, de-duplicated, in the order given. */
  emails: string[];
  /** What was typed that is not an address, exactly as typed. */
  invalid: string[];
}

export function parseInviteEmails(raw: string | undefined | null): ParsedInviteEmails {
  const emails: string[] = [];
  const invalid: string[] = [];
  const seen = new Set<string>();

  // Quoted display names go first: `"Reed, Alex" <alex@example.com>` holds a
  // comma, and splitting before removing it would cut the entry in two.
  const unquoted = (raw ?? '').replace(/"[^"]*"/g, ' ');

  const candidates: string[] = [];
  for (const entry of unquoted.split(/[,;\n]+/)) {
    const bracketed = [...entry.matchAll(/<([^<>]+)>/g)].map((match) => match[1]);
    const words = entry
      .replace(/<[^<>]*>/g, ' ')
      .split(/\s+/)
      .filter(Boolean);

    if (bracketed.length > 0) {
      // An entry written `Sam Reed <sam@example.com>`: the bare words are the
      // name, not typos. Any address typed alongside it still counts.
      candidates.push(...words.filter((word) => word.includes('@')), ...bracketed);
    } else {
      candidates.push(...words);
    }
  }

  for (const candidate of candidates) {
    const value = candidate.trim().replace(/^mailto:/i, '');
    if (!value) continue;

    if (!emailSchema.safeParse(value).success) {
      invalid.push(value);
      continue;
    }

    const email = value.toLowerCase();
    if (!seen.has(email)) {
      seen.add(email);
      emails.push(email);
    }
  }

  return { emails, invalid };
}

/**
 * The one message a bad list gets, or null when the list is usable. Names the
 * first thing that is not an address, so the organiser can find it.
 */
export function inviteEmailsProblem(parsed: ParsedInviteEmails): string | null {
  if (parsed.invalid.length > 0) {
    const first = parsed.invalid[0];
    return parsed.invalid.length === 1
      ? `"${first}" is not an email address. Fix it or take it out.`
      : `"${first}" and ${parsed.invalid.length - 1} more are not email addresses. Fix them or take them out.`;
  }
  if (parsed.emails.length > MAX_INVITEES_PER_POLL) {
    return `You can invite up to ${MAX_INVITEES_PER_POLL} people by email on one poll.`;
  }
  return null;
}
