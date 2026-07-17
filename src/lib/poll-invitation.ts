import { formatDateInLondon, type IsoDate } from '@/lib/dateUtils';

/**
 * The invitation block: the poll as one pasteable message.
 *
 * The bare link answers "where do I click" and nothing else. A licensee
 * forwarded a naked URL on WhatsApp has to open it to find out what it is,
 * which is one tap more than plenty of people give an unexplained link. This
 * block is the context the link deserves: what the meeting is, what is being
 * covered, the times on offer, how to answer and by when, so the recipient
 * understands before they tap.
 *
 * Plain text on purpose. It is built to be pasted into WhatsApp, a text or an
 * email body, and every one of those mangles markup differently. Plain text
 * survives them all.
 *
 * CLIENT-SAFE BY DESIGN: no import from `@/lib/email` (whose module graph pulls
 * in Resend, server-only) and no import from `@/lib/poll-tokens` (Node crypto,
 * which drags a 300 kB shim into the browser; that regression has shipped once
 * already). The create form builds this in the browser from its own values.
 */

/** One proposed time, as the create form holds it: London wall clock. */
export type InvitationOption =
  | { date: IsoDate; startTime?: never; endTime?: never; endsNextDay?: never }
  | { date: IsoDate; startTime: string; endTime: string; endsNextDay: boolean };

export interface InvitationInput {
  title: string;
  organiserName: string;
  description?: string;
  agenda?: string;
  location?: string;
  /**
   * Already formatted, one per option. The server formats with the email
   * formatter, the create form with formatInvitationOption below, and the
   * assembly stays blind to the difference.
   */
  optionLabels: string[];
  participantUrl: string;
  /** Already formatted prose, e.g. "Tuesday, 22 July 2026 at 6:00pm". */
  deadlineLabel?: string;
}

/** '19:00' -> '7:00pm'. Wall-clock display, no timezone involved. */
export function formatWallClockTime(time: string): string {
  const [hourText, minute] = time.split(':');
  const hour = Number(hourText);
  const suffix = hour < 12 ? 'am' : 'pm';
  const twelveHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${twelveHour}:${minute}${suffix}`;
}

/** One option as prose: "Tuesday, 14 July 2026, 7:00pm to 9:00pm". */
export function formatInvitationOption(option: InvitationOption): string {
  const day = formatDateInLondon(option.date, 'long');
  if (option.startTime === undefined) return day;

  const range = `${formatWallClockTime(option.startTime)} to ${formatWallClockTime(option.endTime)}`;
  return option.endsNextDay ? `${day}, ${range} (finishes next day)` : `${day}, ${range}`;
}

/**
 * Assembles the block. Sections with nothing to say are omitted entirely,
 * because "Agenda: (none)" reads like a form and the point is to not read like
 * a form.
 */
export function buildInvitationText(input: InvitationInput): string {
  const lines: string[] = [];

  lines.push(`${input.organiserName} is finding a time for: ${input.title}`);

  if (input.description?.trim()) {
    lines.push('', input.description.trim());
  }

  if (input.agenda?.trim()) {
    lines.push('', "What we'll cover:", input.agenda.trim());
  }

  if (input.location?.trim()) {
    lines.push('', `Where: ${input.location.trim()}`);
  }

  lines.push('', 'The times on offer (UK time):');
  for (const label of input.optionLabels) {
    lines.push(`  - ${label}`);
  }

  lines.push(
    '',
    'Say which you can make, and whether you would be there in person or need a video link:',
    input.participantUrl
  );
  lines.push('', 'It takes a minute and you will not need an account.');

  if (input.deadlineLabel) {
    lines.push('', `Please answer by ${input.deadlineLabel}.`);
  }

  lines.push('', "Once a time is picked you'll get an email with the calendar invite.");

  return lines.join('\n');
}
