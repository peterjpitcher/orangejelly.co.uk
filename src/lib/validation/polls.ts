import { z } from 'zod';
import {
  compareIsoDates,
  getTodayIsoDate,
  isValidIsoDate,
  londonWallClockToInstant,
} from '@/lib/dateUtils';
import { VALIDATION_MESSAGES } from '@/lib/validation-messages';
import type { PollOptionInput } from '@/lib/db/polls';

/**
 * Shared zod primitives for availability polls.
 *
 * These schemas run on both sides of the wire: the create form drives
 * `useForm` with `createPollSchema`, and the server action re-parses the same
 * schema. One definition is the point — a form that caps at 500 against a
 * server that allows 1,000 is not a stricter client, it is a different product
 * (SPEC §3.6.1).
 *
 * THIS MODULE MUST STAY CLIENT-SAFE. It is imported by the create form, so
 * anything it reaches ships to the browser. In particular it must never import
 * `@/lib/poll-tokens`, which imports Node's `crypto` at module scope and drags a
 * 317 KB browserified shim into the bundle with it. The token schemas live in
 * ./poll-tokens.ts for exactly that reason — see the note there before moving
 * one back.
 *
 * Copy lives in `VALIDATION_MESSAGES.poll.*` where a key exists for it. The
 * remaining strings are specific to one field on one form and have no key; they
 * are written here in British English, present tense, telling the user what to
 * do.
 */

/** The hard ceiling. Mirrors MAX_OPTIONS in src/lib/db/polls.ts. */
export const MAX_POLL_OPTIONS = 8;

/** A poll with one option is an announcement, not a poll. */
export const MIN_POLL_OPTIONS = 2;

/** Longest a single slot may run. An overnight slot is legitimate; two days is a typo. */
export const MAX_SLOT_MS = 24 * 60 * 60 * 1000;

/**
 * The 24-hour wall-clock shape `londonWallClockToInstant` accepts.
 *
 * Matching it here means the conversion throws only on a genuinely impossible
 * time (the spring-forward gap), never on a malformed string.
 */
export const WALL_CLOCK_TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

/** Matches polls.option_kind. */
export const optionKindSchema = z.enum(['dates', 'slots'], {
  message: 'Choose whether the poll is about whole days or specific times.',
});

/**
 * A calendar date. Never converted between zones — see the header of
 * src/lib/dateUtils.ts.
 *
 * superRefine with an early return, NOT two chained .refine() calls. Zod runs
 * every refinement in a chain even after an earlier one fails, and
 * compareIsoDates() calls assertIsoDate(), which THROWS on malformed input.
 * Chained, `safeParse('rubbish')` throws an uncaught Error instead of returning
 * { success: false }, and createPoll 500s on any typo'd date. The order below is
 * load-bearing: nothing calls a dateUtils function until isValidIsoDate has
 * passed.
 */
export const isoDateSchema = z.string().superRefine((value, ctx) => {
  if (!isValidIsoDate(value)) {
    ctx.addIssue({ code: 'custom', message: 'Enter a date as YYYY-MM-DD.' });
    return; // Mandatory. compareIsoDates() below throws on anything malformed.
  }
  if (compareIsoDates(value, getTodayIsoDate()) < 0) {
    ctx.addIssue({ code: 'custom', message: 'Dates must be today or later.' });
  }
});

/** A London wall-clock time, as typed into `<input type="time">`. */
export const wallClockTimeSchema = z
  .string()
  .regex(WALL_CLOCK_TIME_PATTERN, { message: 'Enter a time as HH:mm.' });

/**
 * One timed slot, as the form collects it: a London wall-clock date and two
 * times, plus an explicit next-day flag.
 *
 * Wall clock rather than instants, deliberately. The organiser is thinking "7:30
 * on the 4th", and the conversion to an instant is a London-timezone decision
 * that belongs on the server where it cannot be faked or skewed by a client
 * clock. `endsNextDay` only means anything as a wall-clock concept, and it is
 * never inferred from `endTime < startTime` — an inferred flag turns a mistyped
 * time into a silent all-night event.
 */
export const slotInputSchema = z.object({
  date: isoDateSchema,
  startTime: wallClockTimeSchema,
  endTime: wallClockTimeSchema,
  endsNextDay: z.boolean(),
});

export type SlotInput = z.infer<typeof slotInputSchema>;

/** One whole-day option, as the form collects it. */
export const dateInputSchema = z.object({
  date: isoDateSchema,
});

export type DateInput = z.infer<typeof dateInputSchema>;

/**
 * Adds one calendar day to an ISO date.
 *
 * Pure string arithmetic through UTC, never through a local Date: the value is a
 * calendar date, and running it through a timezone is the bug this whole module
 * exists to avoid. The result is handed straight back to
 * `londonWallClockToInstant`, which is what applies London's rules.
 */
export function addOneDay(date: string): string {
  const next = new Date(`${date}T00:00:00Z`);
  next.setUTCDate(next.getUTCDate() + 1);
  return next.toISOString().slice(0, 10);
}

export const createPollSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, 'Give the poll a title of at least 3 characters.')
      .max(120, 'The title must be 120 characters or fewer.'),
    // 1,000 is the single value. The form's `maxLength` and its counter use this
    // number too.
    description: z
      .string()
      .trim()
      .max(1000, 'The description must be 1,000 characters or fewer.')
      .optional(),
    /**
     * What will actually be discussed, as distinct from `description`, which is
     * the one-line framing of the invitation. It renders on the vote screen and
     * is carried into the calendar entry, so it must not ship
     * stored-but-invisible.
     */
    agenda: z.string().trim().max(2000, 'The agenda must be 2,000 characters or fewer.').optional(),
    location: z
      .string()
      .trim()
      .max(200, 'The location must be 200 characters or fewer.')
      .optional(),
    organiserName: z
      .string()
      .trim()
      .min(2, 'Your name must be at least 2 characters.')
      .max(50, 'Your name must be 50 characters or fewer.'),
    organiserEmail: z
      .string()
      .trim()
      .toLowerCase()
      .email('Please enter a valid email address.')
      .max(254, 'That email address is too long.'),
    optionKind: optionKindSchema,
    /** Populated when optionKind === 'dates'. */
    dates: z.array(dateInputSchema).optional(),
    /** Populated when optionKind === 'slots'. */
    slots: z.array(slotInputSchema).optional(),
    /**
     * Optional entry deadline, as a London wall-clock date and time. Both or
     * neither: a date with no time is a deadline with no meaning. Format is
     * checked here; the future-instant check and the timezone conversion happen
     * in the action, where `londonWallClockToInstant` lives and can throw on the
     * spring-forward gap. `''` is accepted because an untouched optional input
     * posts an empty string.
     */
    deadlineDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter the deadline date as YYYY-MM-DD.')
      .optional()
      .or(z.literal('')),
    deadlineTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Enter the deadline time as HH:mm.')
      .optional()
      .or(z.literal('')),
    /** Cloudflare Turnstile. See SPEC §3.4.3 — the keys exist; this is not optional. */
    turnstileToken: z.string().min(1, 'Please complete the verification check.'),
    /** Honeypot. Mirrors contact-form.tsx. */
    website: z.string().optional(),
  })
  // Exactly one option array, matching optionKind. Mirrors poll_options_shape_chk.
  //
  // ONE superRefine with early returns, not a chain: see isoDateSchema above for
  // why a chain is unsafe here.
  .superRefine((value, ctx) => {
    const list = value.optionKind === 'dates' ? value.dates : value.slots;
    const wrongList = value.optionKind === 'dates' ? value.slots : value.dates;
    const path = value.optionKind === 'dates' ? ['dates'] : ['slots'];

    if (wrongList && wrongList.length > 0) {
      ctx.addIssue({
        code: 'custom',
        path,
        message: 'A poll is about whole days or specific times, never both.',
      });
      return;
    }

    if (!list || list.length < MIN_POLL_OPTIONS) {
      ctx.addIssue({ code: 'custom', path, message: VALIDATION_MESSAGES.poll.tooFewOptions });
      return;
    }

    if (list.length > MAX_POLL_OPTIONS) {
      ctx.addIssue({ code: 'custom', path, message: VALIDATION_MESSAGES.poll.tooManyOptions });
      return;
    }

    // Duplicate options make the results matrix nonsense.
    //
    // The key is the START, not the full range — SPEC §3.6.1 and §1 O1.8. Two
    // slots that begin at the same instant and differ only in length are not two
    // choices a human can meaningfully vote between; they are a mis-entry. For
    // 'dates' the date IS the start, so one rule covers both kinds. There is no
    // database constraint behind this — poll_options has no unique key on
    // starts_at — so this check is the only control.
    //
    // Keyed on the wall clock rather than the converted instant on purpose: the
    // conversion can throw, and a validation schema must never throw.
    const keys = list.map((option) =>
      'startTime' in option ? `${option.date}T${option.startTime}` : option.date
    );
    if (new Set(keys).size !== keys.length) {
      ctx.addIssue({ code: 'custom', path, message: VALIDATION_MESSAGES.poll.duplicateOption });
    }

    // A deadline is a date AND a time, or neither. A date with no time has no
    // meaning, and a time with no date has nowhere to land. The future check and
    // the London conversion belong to the action, not here.
    const hasDeadlineDate = Boolean(value.deadlineDate);
    const hasDeadlineTime = Boolean(value.deadlineTime);
    if (hasDeadlineDate !== hasDeadlineTime) {
      ctx.addIssue({
        code: 'custom',
        path: hasDeadlineDate ? ['deadlineTime'] : ['deadlineDate'],
        message: 'A deadline needs both a date and a time, or leave both blank.',
      });
    }
  });

export type CreatePollFormValues = z.infer<typeof createPollSchema>;

/** What `buildPollOptions` gives back: usable options, or one user-facing message. */
export type BuildOptionsResult =
  | { options: PollOptionInput[]; error?: never }
  | { options?: never; error: string };

/**
 * Turns validated form values into the option rows the data layer stores.
 *
 * This is where wall clock becomes instant, and it is the only place that
 * happens. `londonWallClockToInstant` THROWS on a time inside the spring-forward
 * gap — 01:30 does not exist on the day the clocks go forward — and its message
 * is already the exact user-facing sentence, so it is caught and returned rather
 * than reworded or allowed to 500 the action.
 *
 * The end-after-start and 24-hour rules live here rather than in the schema
 * because both are questions about the computed instants, and the next-day flag
 * has to be applied before either can be answered.
 */
export function buildPollOptions(value: CreatePollFormValues): BuildOptionsResult {
  if (value.optionKind === 'dates') {
    const dates = value.dates ?? [];
    return { options: dates.map((entry) => ({ optionDate: entry.date })) };
  }

  const slots = value.slots ?? [];
  const options: PollOptionInput[] = [];

  for (const slot of slots) {
    let startsAt: Date;
    let endsAt: Date;

    try {
      startsAt = londonWallClockToInstant(slot.date, slot.startTime);
      // The next-day flag is applied here and nowhere else. Never inferred.
      const endDate = slot.endsNextDay ? addOneDay(slot.date) : slot.date;
      endsAt = londonWallClockToInstant(endDate, slot.endTime);
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'That time is not valid.' };
    }

    if (endsAt.getTime() <= startsAt.getTime()) {
      return { error: VALIDATION_MESSAGES.poll.slotEndBeforeStart };
    }

    // 24 hours, not "same calendar day". An overnight slot is legitimate and
    // must pass; only a slot long enough to be a data-entry error is refused.
    if (endsAt.getTime() - startsAt.getTime() > MAX_SLOT_MS) {
      return { error: 'A slot cannot be longer than 24 hours.' };
    }

    options.push({ startsAt, endsAt });
  }

  return { options };
}
