import { createEvent, type DateArray, type EventAttributes } from 'ics';
import type { IsoDate } from '@/lib/dateUtils';

/**
 * The calendar payload for a confirmed poll: an RFC 5545 VEVENT, plus the two
 * add-to-calendar URLs the email offers as a fallback.
 *
 * Pure by design — no I/O, no framework, no database. The caller reads the poll
 * and hands the fields in.
 *
 * WHY A LIBRARY. Line folding at 75 octets, CRLF endings, and comma/semicolon/
 * backslash escaping in SUMMARY and DESCRIPTION are exactly the details that
 * break silently in Outlook, and exactly what `ics` exists to get right. A poll
 * title containing a comma is not an edge case. Do not hand-roll the VCALENDAR.
 *
 * THE TWO SHAPES ARE NOT INTERCHANGEABLE. A 'slots' option is an instant pair
 * and is emitted as a UTC instant with a trailing Z. A 'dates' option has no
 * clock reading at all, and pushing it through a zone conversion invents a time
 * nobody chose — dateUtils' central rule. It becomes an all-day VEVENT instead,
 * with no input/output type set, because setting 'utc' on a date-only value IS
 * the conversion the rule forbids.
 */

/** Matches polls.option_kind. Declared locally so this module stays dependency-light. */
export type IcsOptionKind = 'dates' | 'slots';

export interface PollIcsInput {
  /** polls.id — the UID is keyed on the poll, never the option. See below. */
  pollId: string;
  optionKind: IcsOptionKind;
  /** poll_options.option_date. Non-null iff optionKind === 'dates'. */
  optionDate: IsoDate | null;
  /** poll_options.starts_at. Non-null iff optionKind === 'slots'. */
  startsAt: string | null;
  /** poll_options.ends_at. Non-null iff optionKind === 'slots'. */
  endsAt: string | null;
  title: string;
  description: string | null;
  agenda: string | null;
  location: string | null;
  organiserName: string;
  organiserEmail: string;
  /** The poll page. Goes in DESCRIPTION so the entry links back to the poll. */
  participantUrl: string;
  /** polls.confirm_sequence, read back from confirmOption's conditional update. */
  confirmSequence: number;
}

export const ICS_PRODUCT_ID = '-//Orange Jelly//Availability Poll//EN';
export const ICS_FILENAME = 'orange-jelly-poll.ics';

/**
 * Outlook renders the attachment as a calendar card only when this header is set.
 * Everything else treats it as a plain attachment either way.
 */
export const ICS_CONTENT_CLASS_HEADER = 'urn:content-classes:calendarmessage';

/** A timestamptz as the [y, m, d, h, min] tuple `ics` wants, in UTC. */
function toIcsUtcArray(instant: string): [number, number, number, number, number] {
  const date = new Date(instant);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid instant: "${instant}".`);
  }

  return [
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
  ];
}

/** A date-only value as the [y, m, d] tuple `ics` wants. No zone is involved. */
function toIcsDateArray(date: IsoDate): [number, number, number] {
  const parts = date.split('-').map(Number);
  if (parts.length !== 3 || parts.some((part) => !Number.isFinite(part))) {
    throw new Error(`Invalid date: "${date}".`);
  }
  return [parts[0], parts[1], parts[2]];
}

/**
 * The day after `date`, arithmetically.
 *
 * DTEND on an all-day VEVENT is EXCLUSIVE per RFC 5545 — a single-day event on
 * the 4th ends on the 5th. Getting this wrong is a one-day-out bug, the
 * date-only twin of the one-hour-offset bug.
 *
 * `Date.UTC` normalises month and year rollover, so 31 December resolves
 * correctly. Never add 86,400,000ms to a local-zone Date: across a DST boundary
 * a day is not 24 hours, and the arithmetic silently lands on the wrong date.
 */
export function nextCalendarDay(date: IsoDate): [number, number, number] {
  const [year, month, day] = toIcsDateArray(date);
  const next = new Date(Date.UTC(year, month - 1, day + 1));
  return [next.getUTCFullYear(), next.getUTCMonth() + 1, next.getUTCDate()];
}

/**
 * DESCRIPTION: the description, the agenda, then the poll link.
 *
 * THE AGENDA BELONGS HERE and this is why the field exists. The calendar entry
 * is where someone looks on the morning of the meeting; it is the one place the
 * agenda is genuinely load-bearing. `ics` handles the RFC 5545 folding and the
 * escaping of the newlines an agenda will contain.
 *
 * Raw, never escapeHtml'd — HTML entities in a calendar entry are a bug.
 */
function buildDescription(input: PollIcsInput): string {
  return [
    input.description ?? '',
    input.agenda ? `Agenda:\n${input.agenda}` : '',
    input.participantUrl,
  ]
    .filter(Boolean)
    .join('\n\n')
    .trim();
}

/**
 * The VEVENT's timing.
 *
 * Declared rather than `Pick`ed off `EventAttributes`: that type is a union
 * whose `end` lives in a separate branch from `duration`, so `Pick` cannot
 * reach it.
 *
 * The input/output types are optional because the all-day branch must NOT set
 * them — see `buildTiming`.
 */
interface IcsTiming {
  start: DateArray;
  end: DateArray;
  startInputType?: 'utc';
  startOutputType?: 'utc';
  endInputType?: 'utc';
  endOutputType?: 'utc';
}

/** The VEVENT's start/end, per option kind. Throws on a shape the constraint forbids. */
function buildTiming(input: PollIcsInput): IcsTiming {
  if (input.optionKind === 'slots') {
    if (!input.startsAt || !input.endsAt) {
      throw new Error(`Slot option on poll ${input.pollId} is missing starts_at or ends_at.`);
    }

    // The columns are timestamptz and already UTC instants. This is a
    // formatting step, never a zone conversion.
    return {
      start: toIcsUtcArray(input.startsAt),
      startInputType: 'utc',
      startOutputType: 'utc',
      end: toIcsUtcArray(input.endsAt),
      endInputType: 'utc',
      endOutputType: 'utc',
    };
  }

  if (!input.optionDate) {
    throw new Error(`Date option on poll ${input.pollId} is missing option_date.`);
  }

  // No startInputType/startOutputType. Setting 'utc' on a date-only value is
  // precisely the conversion dateUtils forbids.
  return {
    start: toIcsDateArray(input.optionDate),
    end: nextCalendarDay(input.optionDate),
  };
}

export interface PollIcsResult {
  /** The VCALENDAR text. Absent when the build failed. */
  value?: string;
  /** Set when `ics` refused the attributes, or a shape guard threw. */
  error?: string;
}

/**
 * Builds the .ics for a confirmed poll.
 *
 * NEVER THROWS. `createEvent` returns `{ error, value }` rather than throwing,
 * and the shape guards above are wrapped, because a calendar file that will not
 * build must never suppress the notification that the meeting is happening. The
 * caller drops the attachment, adjusts one sentence of copy, and sends anyway.
 * The time in words is the payload; the .ics is a convenience.
 */
export function buildPollIcs(input: PollIcsInput): PollIcsResult {
  let attributes: EventAttributes;

  try {
    attributes = {
      productId: ICS_PRODUCT_ID,

      // UID IS KEYED ON THE POLL, NOT THE OPTION. polls.confirmed_option_id is
      // mutable, and reopening a poll usually means picking a DIFFERENT time.
      // An option-keyed UID would mint a second event and leave the first one
      // sitting in everyone's calendar forever. Poll-keyed, plus a rising
      // SEQUENCE, supersedes the previous entry — which is the entire point.
      uid: `${input.pollId}@orangejelly.co.uk`,
      sequence: input.confirmSequence,

      // PUBLISH, NOT REQUEST. RFC 5546 §3.2.2 requires at least one ATTENDEE on
      // a VEVENT REQUEST; an attendee-less REQUEST is malformed iTIP and client
      // behaviour on it is undefined — the same class of silent Outlook
      // breakage the library is here to avoid. We are delivering an agreed
      // time, not managing RSVPs, and PUBLISH is precisely the method for that.
      method: 'PUBLISH',
      status: 'CONFIRMED',

      // Raw. The library escapes it; escapeHtml would corrupt it.
      title: input.title,
      description: buildDescription(input),
      ...(input.location ? { location: input.location } : {}),
      organizer: { name: input.organiserName, email: input.organiserEmail },
      ...buildTiming(input),
    };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unknown error.' };
  }

  // The return form, not the callback form. Mixing the two gets you undefined.
  const { error, value } = createEvent(attributes);

  if (error) {
    return { error: String(error) };
  }
  if (!value) {
    return { error: 'The calendar file came back empty.' };
  }

  return { value };
}

/** Zero-pads to two digits. Calendar URL params are fixed-width. */
function pad(value: number): string {
  return String(value).padStart(2, '0');
}

/** 'YYYYMMDDTHHMMSSZ' — Google's instant format. */
function toGoogleInstant(instant: string): string {
  const date = new Date(instant);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid instant: "${instant}".`);
  }

  return (
    `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}` +
    `T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`
  );
}

/** 'YYYYMMDD' — Google's all-day format. */
function toGoogleDate(parts: [number, number, number]): string {
  return `${parts[0]}${pad(parts[1])}${pad(parts[2])}`;
}

/** 'YYYY-MM-DD' from a tuple, for Outlook's all-day params. */
function toIsoDateString(parts: [number, number, number]): string {
  return `${parts[0]}-${pad(parts[1])}-${pad(parts[2])}`;
}

/**
 * The add-to-calendar links.
 *
 * Plain URLs, no third-party script: the CSP allows neither, and an email cannot
 * run one anyway.
 *
 * Every parameter goes through encodeURIComponent here. The assembled URL is
 * then escapeHtml'd by the template on the way into an href, because a bare `&`
 * in an attribute must be `&amp;` — that is required for the URL to survive a
 * strict parser, not belt-and-braces.
 */
export interface CalendarLinks {
  googleUrl: string;
  outlookUrl: string;
}

/**
 * Both links for one confirmed option.
 *
 * Throws on a malformed option, exactly as `formatOptionForEmail` does: a
 * malformed option is a data bug that belongs at build-payload time, before any
 * send is attempted. The caller builds the payload inside its own try/catch.
 */
export function buildCalendarLinks(input: PollIcsInput): CalendarLinks {
  const details = buildDescription(input);

  let googleDates: string;
  let outlookStart: string;
  let outlookEnd: string;
  let allDay = false;

  if (input.optionKind === 'slots') {
    if (!input.startsAt || !input.endsAt) {
      throw new Error(`Slot option on poll ${input.pollId} is missing starts_at or ends_at.`);
    }
    googleDates = `${toGoogleInstant(input.startsAt)}/${toGoogleInstant(input.endsAt)}`;
    outlookStart = new Date(input.startsAt).toISOString();
    outlookEnd = new Date(input.endsAt).toISOString();
  } else {
    if (!input.optionDate) {
      throw new Error(`Date option on poll ${input.pollId} is missing option_date.`);
    }
    const start = toIcsDateArray(input.optionDate);
    const end = nextCalendarDay(input.optionDate);
    // Exclusive end, the same rule as DTEND on the all-day VEVENT.
    googleDates = `${toGoogleDate(start)}/${toGoogleDate(end)}`;
    outlookStart = toIsoDateString(start);
    outlookEnd = toIsoDateString(end);
    allDay = true;
  }

  const googleParams = [
    'action=TEMPLATE',
    `text=${encodeURIComponent(input.title)}`,
    `dates=${googleDates}`,
    `details=${encodeURIComponent(details)}`,
    // Omitted entirely when null, rather than emitted empty.
    ...(input.location ? [`location=${encodeURIComponent(input.location)}`] : []),
  ];

  const outlookParams = [
    'path=%2Fcalendar%2Faction%2Fcompose',
    'rru=addevent',
    ...(allDay ? ['allday=true'] : []),
    `subject=${encodeURIComponent(input.title)}`,
    `startdt=${encodeURIComponent(outlookStart)}`,
    `enddt=${encodeURIComponent(outlookEnd)}`,
    `body=${encodeURIComponent(details)}`,
    ...(input.location ? [`location=${encodeURIComponent(input.location)}`] : []),
  ];

  return {
    googleUrl: `https://calendar.google.com/calendar/render?${googleParams.join('&')}`,
    outlookUrl: `https://outlook.live.com/calendar/0/deeplink/compose?${outlookParams.join('&')}`,
  };
}
