'use client';

import { useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, type FieldErrors } from 'react-hook-form';
import { Loader2 } from 'lucide-react';

import { Alert, Button, Field, Input, Modal, Textarea } from '@/components/oj';
import { CONTACT } from '@/lib/constants';
import { getTodayIsoDate, type IsoDate } from '@/lib/dateUtils';
import {
  computeSlotEnd,
  DEFAULT_DURATION_MINUTES,
  slotKey,
  type CalendarSlot,
  type DurationChoice,
} from '@/lib/poll-calendar';
import {
  createPollSchema,
  MAX_POLL_OPTIONS,
  type CreatePollFormValues,
} from '@/lib/validation/polls';
import { createPoll, resendVerification, type PollLinks } from '@/app/actions/polls';
import CopyButton from '@/components/polls/copy-button';
import {
  buildInvitationText,
  formatInvitationOption,
  formatWallClockTime,
} from '@/lib/poll-invitation';
import AvailabilityGrid from './availability-grid';
import DurationSelector from './duration-selector';
import TurnstileWidget from './turnstile-widget';

/**
 * The create-poll form.
 *
 * A client component because it needs `useForm` and `useState` for the submitted
 * state.
 *
 * WHAT WEARS THE FORM. The controls, the label-and-error wrapper, the buttons, the
 * notices and the confirm dialog all come from `@/components/oj`. React Hook Form
 * still owns the values, the schema and the submit; it has simply stopped owning
 * the markup, so `Field` wires each label, hint and error to its control instead
 * of every call site being asked to remember to.
 *
 * React Hook Form's own error focus cannot survive that swap: its `field.ref` wants
 * a forwardRef control and the design system's do not take one, so the ref is
 * dropped deliberately below rather than passed and silently ignored. The BEHAVIOUR
 * it provided is kept, by naming each control's id here and moving focus by id when
 * a submit fails. The cursor lands where it always did, and `Field` now also marks
 * each message `role="alert"`, which this form did not do before, so a failed submit
 * speaks as well as moving the cursor.
 *
 * The options are picked on a calendar grid rather than typed into a repeater.
 * The grid is a different way of producing the same two shapes this form has
 * always emitted, and nothing downstream knows it changed:
 *
 *   - `optionKind: 'dates'` → `{ date }`
 *   - `optionKind: 'slots'` → `{ date, startTime, endTime, endsNextDay }`
 *
 * The duration is what decides between them ("All day" means whole days, any
 * length means times), so there is no separate kind toggle any more. The two
 * arrays stay in react-hook-form rather than in local state, so the schema, the
 * error messages and the server action all keep working unchanged.
 *
 * The success state replaces the form in place. There is no navigation and no
 * separate route: the resend token lives in client state and must never reach a
 * URL, so there is nowhere for a success route to read it from.
 */

/**
 * The form mounts with nothing picked. The schema asks for at least two.
 *
 * The organiser fields are PREFILLED but not fixed: Peter is the only organiser
 * this tool has, and making him retype his own details on his own tool is
 * friction with nothing on the other side of it. Both stay editable and fully
 * validated: creation is public by design, gated by email verification rather
 * than by a login, so a stranger must be able to type straight over them.
 *
 * Both values come from CONTACT rather than a literal. The address is already
 * the one the footer, the contact page and the privacy notice render, so a
 * second copy here is just a second thing to miss when it changes, and it
 * exposes nothing new, being public in three places already.
 *
 * It also fails safe. If a stranger did reach this form and left the defaults
 * alone, the verification email goes to Peter, who will not click it, and the
 * poll never opens. The prefill cannot be used to send mail in his name.
 *
 * `website` is the honeypot and MUST stay empty. Prefilling it would make every
 * real submission look like a bot to our own check.
 */
// London's today, so the deadline picker never offers a date already gone. The
// server rejects a past instant too; this only spares the obvious mistake.
const minDeadlineDate = getTodayIsoDate();

/**
 * The heading for a tool screen.
 *
 * Sentence case, not the lowercase display face the marketing pages use. This is
 * a thing you operate rather than a thing you are being sold, and a heading that
 * shouts in lowercase over a form reads as branding applied to the wrong surface.
 * The weight and the tight tracking are what make it belong to the same family.
 */
const TOOL_HEADING = 'text-[28px] font-black leading-tight tracking-[-0.02em] text-oj-ink';

/**
 * A URL you are meant to copy, shown whole.
 *
 * `break-all` rather than a truncation: the point of showing it is that someone
 * can read it back or select it by hand when the copy button cannot help them.
 */
const LINK_BOX =
  'mt-2 break-all rounded-oj border-1.5 border-oj-ink bg-oj-paper p-3 text-sm text-oj-ink';

/**
 * The id every control carries, in the order the form reads.
 *
 * Named rather than generated for one reason: a failed submit has to put the
 * cursor on the first thing that is wrong. React Hook Form does that itself when
 * it can hold a ref on the control, and it cannot hold one on a plain function
 * component, so the same job is done here by id. Without this the cursor stays on
 * the submit button and someone using a keyboard has to go and hunt for the field
 * that failed.
 *
 * Prefixed because the page also carries the duration controls, and two elements
 * sharing an id breaks the label association of both.
 */
const FIELD_IDS = {
  title: 'poll-title',
  description: 'poll-description',
  agenda: 'poll-agenda',
  location: 'poll-location',
  organiserName: 'poll-organiser-name',
  organiserEmail: 'poll-organiser-email',
  deadlineDate: 'poll-deadline-date',
  deadlineTime: 'poll-deadline-time',
} as const;

/** Visual order, so "first invalid" means first on the screen. */
const FOCUS_ORDER = Object.keys(FIELD_IDS) as (keyof typeof FIELD_IDS)[];

/**
 * Moves the cursor to the first field that failed.
 *
 * The options array and the Turnstile token are deliberately absent: neither has a
 * control of ours to focus, and neither was focused before this either.
 */
function focusFirstInvalid(errors: FieldErrors<CreatePollFormValues>): void {
  const first = FOCUS_ORDER.find((name) => errors[name]);
  if (!first) return;
  window.requestAnimationFrame(() => document.getElementById(FIELD_IDS[first])?.focus());
}

const DEFAULT_VALUES: CreatePollFormValues = {
  title: '',
  description: '',
  agenda: '',
  location: '',
  organiserName: CONTACT.owner,
  organiserEmail: CONTACT.email,
  optionKind: 'slots',
  dates: undefined,
  slots: [],
  deadlineDate: '',
  deadlineTime: '',
  turnstileToken: '',
  website: '',
};

export default function CreatePollForm(): JSX.Element {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [resendToken, setResendToken] = useState<string | null>(null);
  const [links, setLinks] = useState<PollLinks | null>(null);
  const [invitation, setInvitation] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState('');
  const [duration, setDuration] = useState<DurationChoice>(DEFAULT_DURATION_MINUTES);
  const [pendingDuration, setPendingDuration] = useState<DurationChoice | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  const form = useForm<CreatePollFormValues>({
    resolver: zodResolver(createPollSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onSubmit',
  });

  const allDay = duration === 'all-day';

  // Watched, not held in local state: react-hook-form stays the one place the
  // emitted value lives, so the schema and the server action see exactly what
  // they always saw.
  const dates = form.watch('dates') ?? [];
  const slots = form.watch('slots') ?? [];

  // The superRefine attaches its issues to the array itself, so they land on
  // `.message` (or `.root.message`) rather than on any row's field.
  const optionArrayError = allDay ? form.formState.errors.dates : form.formState.errors.slots;
  const optionsError = optionArrayError?.message ?? optionArrayError?.root?.message;

  /** True when there is anything to lose by changing the kind of poll. */
  function hasSelections(): boolean {
    const values = form.getValues();
    return (values.dates ?? []).length > 0 || (values.slots ?? []).length > 0;
  }

  /** Chronological, so the poll reads in the order the week runs. */
  function sortSlots(list: CalendarSlot[]): CalendarSlot[] {
    return [...list].sort((a, b) => slotKey(a).localeCompare(slotKey(b)));
  }

  function toggleDate(date: IsoDate): void {
    const current = form.getValues('dates') ?? [];
    const selected = current.some((entry) => entry.date === date);

    // Unpicking always works. Picking stops at the cap: the grid disables the
    // cell too, but the cap is a rule about the value, so it is enforced here as
    // well rather than trusted to the view.
    if (!selected && current.length >= MAX_POLL_OPTIONS) return;

    const next = selected
      ? current.filter((entry) => entry.date !== date)
      : [...current, { date }].sort((a, b) => a.date.localeCompare(b.date));

    form.setValue('dates', next, { shouldValidate: false });
    form.clearErrors('dates');
  }

  function toggleSlot(slot: CalendarSlot): void {
    const current = form.getValues('slots') ?? [];
    const key = slotKey(slot);
    const selected = current.some((entry) => slotKey(entry) === key);

    if (!selected && current.length >= MAX_POLL_OPTIONS) return;

    const next = selected
      ? current.filter((entry) => slotKey(entry) !== key)
      : sortSlots([...current, slot]);

    form.setValue('slots', next, { shouldValidate: false });
    form.clearErrors('slots');
  }

  /**
   * Applies a new duration.
   *
   * Two different changes wear the same control. Moving between "All day" and a
   * timed length changes what kind of poll this is, and the two shapes cannot
   * hold each other's values, so the selection goes. Moving between two timed
   * lengths keeps every start and simply recomputes where each one ends: there
   * is nothing to throw away, and throwing it away would be gratuitous.
   */
  function applyDuration(next: DurationChoice): void {
    const crossesKind = allDay !== (next === 'all-day');

    if (crossesKind) {
      if (next === 'all-day') {
        form.setValue('optionKind', 'dates', { shouldValidate: false });
        form.setValue('slots', undefined);
        form.setValue('dates', []);
      } else {
        form.setValue('optionKind', 'slots', { shouldValidate: false });
        form.setValue('dates', undefined);
        form.setValue('slots', []);
      }
      form.clearErrors(['dates', 'slots']);
    } else if (next !== 'all-day') {
      // Starts are untouched, so no selection can collide with another: the
      // duplicate rule is keyed on the start.
      const current = form.getValues('slots') ?? [];
      form.setValue(
        'slots',
        current.map((slot) => computeSlotEnd(slot.date, slot.startTime, next)),
        { shouldValidate: false }
      );
    }

    setDuration(next);
  }

  function requestDuration(next: DurationChoice): void {
    if (next === duration) return;
    const crossesKind = allDay !== (next === 'all-day');
    // Warn before discarding work, but only when there is work to discard.
    if (crossesKind && hasSelections()) {
      setPendingDuration(next);
      return;
    }
    applyDuration(next);
  }

  /**
   * The signed-in admin's Supabase token, if there is one.
   *
   * Read at submit time rather than on render: sessionStorage does not exist on
   * the server, so touching it during render is a hydration mismatch waiting to
   * happen. Absent for the public, which is the normal case.
   *
   * Sending this is not a claim the server trusts. It is verified with Supabase
   * inside the action, and anything short of a live token for an allowlisted
   * address is treated as a member of the public and gets the verify email.
   */
  function readAdminToken(): string | undefined {
    try {
      const raw = window.sessionStorage.getItem('oj-admin-session');
      if (!raw) return undefined;
      const parsed: unknown = JSON.parse(raw);
      const token = (parsed as { access_token?: unknown })?.access_token;
      return typeof token === 'string' && token.length > 0 ? token : undefined;
    } catch {
      // Malformed or unavailable storage means "not an admin", never a throw
      // that costs someone the poll they just filled in.
      return undefined;
    }
  }

  async function onSubmit(values: CreatePollFormValues): Promise<void> {
    setStatus('submitting');
    setError(null);

    try {
      const result = await createPoll({ ...values, adminToken: readAdminToken() });

      if (result.error) {
        setError(result.error);
        setStatus('idle');
        // Move focus to the alert so the failure is announced rather than left
        // for a sighted user to notice.
        window.requestAnimationFrame(() => errorRef.current?.focus());
        return;
      }

      setSentTo(values.organiserEmail);
      setResendToken(result.resendToken ?? null);
      // Present only when a signed-in admin created it, in which case the poll
      // is already live and no email was ever sent.
      setLinks(result.links ?? null);
      if (result.links) {
        // Built here because only the form still holds the values; the action
        // deliberately returns nothing but the links. Labels use the same
        // wording rules as the server's version, tested in poll-invitation.
        const labels =
          values.optionKind === 'dates'
            ? (values.dates ?? []).map((entry) => formatInvitationOption({ date: entry.date }))
            : (values.slots ?? []).map((entry) =>
                formatInvitationOption({
                  date: entry.date,
                  startTime: entry.startTime,
                  endTime: entry.endTime,
                  endsNextDay: entry.endsNextDay,
                })
              );
        setInvitation(
          buildInvitationText({
            title: values.title,
            organiserName: values.organiserName,
            description: values.description,
            agenda: values.agenda,
            location: values.location,
            optionLabels: labels,
            participantUrl: result.links.participantUrl,
            deadlineLabel:
              values.deadlineDate && values.deadlineTime
                ? `${formatInvitationOption({ date: values.deadlineDate })} at ${formatWallClockTime(values.deadlineTime)}`
                : undefined,
          })
        );
      }
      setStatus('success');
    } catch {
      setError('Something went wrong. Please try again, or message Peter on WhatsApp.');
      setStatus('idle');
      window.requestAnimationFrame(() => errorRef.current?.focus());
    }
  }

  if (status === 'success') {
    return (
      <SuccessState
        email={sentTo}
        resendToken={resendToken}
        links={links}
        invitation={invitation}
      />
    );
  }

  const isSubmitting = status === 'submitting';

  return (
    <div className="max-w-2xl mt-8">
      <form
        onSubmit={form.handleSubmit(onSubmit, focusFirstInvalid)}
        className="space-y-6"
        noValidate
      >
        {/* `ref` is pulled out of every field below. React Hook Form hands one
            down for its own focus-on-error, and the design system's controls are
            plain function components, so passing it through would warn in the
            console and attach to nothing. Dropping it here says so out loud. */}
        <Controller
          control={form.control}
          name="title"
          render={({ field: { ref: _ref, ...field }, fieldState }) => (
            <Field
              htmlFor={FIELD_IDS.title}
              label="What are you arranging?"
              error={fieldState.error?.message}
            >
              <Input
                {...field}
                type="text"
                maxLength={120}
                placeholder="Quiz night briefing"
                disabled={isSubmitting}
              />
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="description"
          render={({ field: { ref: _ref, ...field }, fieldState }) => (
            <Field
              htmlFor={FIELD_IDS.description}
              label="Any detail people need (optional)"
              hint="Shown to everyone you send the link to."
              error={fieldState.error?.message}
            >
              <Textarea {...field} rows={3} maxLength={1000} disabled={isSubmitting} />
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="agenda"
          render={({ field: { ref: _ref, ...field }, fieldState }) => (
            <Field
              htmlFor={FIELD_IDS.agenda}
              label="What's on the agenda? (optional)"
              hint="Shown on the poll, and it goes into the calendar entry so it's there on the day."
              error={fieldState.error?.message}
            >
              <Textarea {...field} rows={4} maxLength={2000} disabled={isSubmitting} />
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="location"
          render={({ field: { ref: _ref, ...field }, fieldState }) => (
            <Field
              htmlFor={FIELD_IDS.location}
              label="Where? (optional)"
              hint="Shown on the poll and added to the calendar entry."
              error={fieldState.error?.message}
            >
              <Input
                {...field}
                type="text"
                maxLength={200}
                placeholder="The Anchor, back room"
                disabled={isSubmitting}
              />
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="organiserName"
          render={({ field: { ref: _ref, ...field }, fieldState }) => (
            <Field
              htmlFor={FIELD_IDS.organiserName}
              label="Your name"
              hint="Shown on the poll so people know who's asking."
              error={fieldState.error?.message}
            >
              <Input
                {...field}
                type="text"
                autoComplete="name"
                maxLength={50}
                disabled={isSubmitting}
              />
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="organiserEmail"
          render={({ field: { ref: _ref, ...field }, fieldState }) => (
            <Field
              htmlFor={FIELD_IDS.organiserEmail}
              label="Your email"
              hint="We send your organiser link here. It is the only way back into your results, so use an address you can get to."
              error={fieldState.error?.message}
            >
              <Input
                {...field}
                type="email"
                inputMode="email"
                autoComplete="email"
                maxLength={254}
                disabled={isSubmitting}
              />
            </Field>
          )}
        />

        {/*
          Optional deadline. Leaving it blank keeps the old behaviour: the poll
          stays open until you confirm it. Set it and we email YOU when it
          passes, to come and pick. Nothing sends to guests on its own. The
          invite always waits for you to choose, because a tie or a thin
          turnout is a judgement, not a sum.
        */}
        <fieldset className="rounded-oj-lg border-1.5 border-oj-ink bg-oj-cream p-4">
          <legend className="px-1 text-[14.5px] font-bold text-oj-ink">
            Close entries automatically (optional)
          </legend>
          <p className="mb-3 text-[14.5px] leading-normal text-oj-ink-2">
            We&rsquo;ll email you when this passes so you can pick a time. We never send the invite
            for you.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Controller
              control={form.control}
              name="deadlineDate"
              render={({ field: { ref: _ref, ...field }, fieldState }) => (
                <Field
                  htmlFor={FIELD_IDS.deadlineDate}
                  label="Date"
                  error={fieldState.error?.message}
                >
                  <Input
                    {...field}
                    value={field.value ?? ''}
                    type="date"
                    min={minDeadlineDate}
                    disabled={isSubmitting}
                  />
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="deadlineTime"
              render={({ field: { ref: _ref, ...field }, fieldState }) => (
                <Field
                  htmlFor={FIELD_IDS.deadlineTime}
                  label="Time"
                  error={fieldState.error?.message}
                >
                  <Input {...field} value={field.value ?? ''} type="time" disabled={isSubmitting} />
                </Field>
              )}
            />
          </div>
        </fieldset>

        {/* The duration decides what kind of poll this is, so it sits above the
            grid: "All day" asks about whole days, any length asks about times. */}
        <DurationSelector value={duration} onChange={requestDuration} disabled={isSubmitting} />

        {/* min-w-0 is load-bearing. A fieldset's UA style is
            `min-inline-size: min-content`, so it refuses to shrink below its
            widest child (here, a 43rem grid). Without this it sits 690px wide
            inside a 375px screen, the scroll container inherits that width and
            therefore never scrolls, and the back half of the week becomes
            unreachable on a phone. */}
        <fieldset className="min-w-0 space-y-3">
          <legend className="text-base font-black tracking-[-0.02em] text-oj-ink">
            Your options
          </legend>
          <p className="text-[14.5px] leading-normal text-oj-ink-3">
            {allDay
              ? 'Tap the days that work. Pick between two and eight.'
              : 'Tap the times that work. Pick between two and eight. All times are London time.'}
          </p>

          <AvailabilityGrid
            duration={duration}
            dates={dates}
            slots={slots}
            onToggleDate={toggleDate}
            onToggleSlot={toggleSlot}
            disabled={isSubmitting}
          />

          {/* The array-level message: too few, too many, duplicates.
              A plain <p>, not a Field: it belongs to the array, not to any one
              row's input, and there is no control here for a Field to wrap. It
              wears the same size, weight and colour a Field error does. */}
          {optionsError && (
            <p role="alert" className="text-xs font-semibold text-oj-danger">
              {optionsError}
            </p>
          )}
        </fieldset>

        {/* Honeypot. Verbatim from contact-form.tsx: all five attributes. */}
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
          {...form.register('website')}
        />

        <TurnstileWidget
          onToken={(token) =>
            form.setValue('turnstileToken', token ?? '', { shouldValidate: false })
          }
        />
        {/* The widget is a third-party iframe with no control of ours to label,
            so its message stands on its own, exactly as the options one does. */}
        {form.formState.errors.turnstileToken?.message && (
          <p role="alert" className="text-xs font-semibold text-oj-danger">
            {form.formState.errors.turnstileToken.message}
          </p>
        )}

        {error && (
          // The wrapper holds the focus, not the notice. Alert takes no ref, and
          // the failure has to land somewhere a keyboard and a screen reader both
          // arrive at, so the thing that takes focus is the thing wrapping it.
          <div ref={errorRef} tabIndex={-1} className="mb-6 outline-none">
            <Alert tone="danger" title="That didn't go through">
              {error}
            </Alert>
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          aria-busy={isSubmitting || undefined}
          className="w-full md:w-auto"
        >
          {isSubmitting && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
          Send me my links
        </Button>

        <p className="text-[14.5px] leading-normal text-oj-ink-3">
          By sending this you agree we can email you about this poll. Nothing else, and we
          don&apos;t pass your address on. We delete the poll and everyone&apos;s answers 60 days
          after the last date on it.
        </p>
      </form>

      {/* Only ever opens for the one change that cannot keep what is picked:
          whole days and times are different shapes and cannot hold each other's
          values. Changing between two timed lengths keeps everything. */}
      <Modal
        open={pendingDuration !== null}
        onClose={() => setPendingDuration(null)}
        /* Modal draws its title with the lowercase display face, which belongs to
           the marketing pages. This is a tool, and a dialog that asks "start the
           options again?" in lowercase reads as branding stuck on the wrong
           surface. `oj-keep-case` is the design system's own escape hatch for
           text that must survive inside a display heading, so the case is fixed
           here rather than by forking Modal. */
        title={<span className="oj-keep-case">Start the options again?</span>}
        actions={
          <>
            <Button variant="ghost" type="button" onClick={() => setPendingDuration(null)}>
              Leave it as it is
            </Button>
            <Button
              variant="primary"
              type="button"
              onClick={() => {
                if (pendingDuration !== null) applyDuration(pendingDuration);
                setPendingDuration(null);
              }}
            >
              Yes, clear them
            </Button>
          </>
        }
      >
        {pendingDuration === 'all-day'
          ? 'Asking about whole days means the times you picked no longer fit, so we’ll clear them and you can pick days instead.'
          : 'Asking about times means the days you picked no longer fit, so we’ll clear them and you can pick times instead.'}
      </Modal>
    </div>
  );
}

/**
 * The success state. Replaces the form in place: no navigation, no redirect.
 *
 * The poll is `status='draft'` here and the participant link does not work yet,
 * so no link is shown. The resend token is client state and never reaches a URL;
 * reloading loses it, and the control with it, which is correct: at that point
 * the recovery route is a fresh poll, not an unbounded resend.
 */
function SuccessState({
  email,
  resendToken,
  links,
  invitation,
}: {
  email: string;
  resendToken: string | null;
  /** Set only when a signed-in admin created the poll: it is already live. */
  links: PollLinks | null;
  /** The pasteable message, built from the submitted values. Admin path only. */
  invitation: string | null;
}): JSX.Element {
  const [resendState, setResendState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [resendError, setResendError] = useState<string | null>(null);

  async function onResend(): Promise<void> {
    if (!resendToken) return;
    setResendState('sending');
    setResendError(null);

    const result = await resendVerification(resendToken);
    if (result.error) {
      setResendError(result.error);
      setResendState('error');
      return;
    }
    setResendState('sent');
  }

  // The admin fast path. The poll is already live, no email was sent, and there
  // is nothing to check an inbox for. Telling someone to check their inbox when
  // nothing was sent is the worst of both: they wait, then they go looking.
  if (links) {
    return (
      <div className="max-w-2xl mt-8">
        <h1 className={TOOL_HEADING}>Your poll is live</h1>

        <Alert tone="ok" title="No email needed" className="mt-4">
          You were already signed in, so we did not make you confirm an address you had just proved.
          Your poll is open and taking answers now.
        </Alert>

        <div className="mt-6 space-y-6">
          <div>
            <p className="font-bold text-oj-ink">Send this one to your guests</p>
            <p className="mt-1 text-[14.5px] leading-normal text-oj-ink-3">
              Anyone with it can answer. They will not need an account.
            </p>
            <p className={LINK_BOX}>{links.participantUrl}</p>
          </div>

          <div>
            <p className="font-bold text-oj-ink">Keep this one to yourself</p>
            <p className="mt-1 text-[14.5px] leading-normal text-oj-ink-3">
              It shows who said what, and it can close the poll and confirm the time. Anyone you
              forward it to can do the same, so do not send it round with the other one.
            </p>
            <p className={LINK_BOX}>{links.organiserUrl}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button href={links.organiserUrl} variant="primary">
              Open my poll
            </Button>
            <CopyButton text={links.participantUrl} label="Copy the link" />
            {invitation && (
              <CopyButton
                text={invitation}
                label="Copy as an invitation"
                copiedLabel="Invitation copied"
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mt-8">
      <h1 className={TOOL_HEADING}>Check your inbox</h1>

      {/* The design system has a success tone, so this is that rather than the
          orange-tinted stand-in the poll screens used to share. */}
      <Alert tone="ok" title="We've sent your links" className="mt-4">
        We&apos;ve emailed <strong>{email}</strong> a link to confirm your address. Tap it and your
        poll goes live, then you&apos;ll get your team&apos;s link and your own private one.
      </Alert>

      {resendToken && resendState !== 'sent' && (
        <div className="mt-6 space-y-3">
          <p className="text-[14.5px] leading-normal text-oj-ink-3">
            Nothing there? Have a look in your spam folder first.
          </p>
          <Button
            variant="ghost"
            type="button"
            disabled={resendState === 'sending'}
            aria-busy={resendState === 'sending' || undefined}
            onClick={onResend}
          >
            {resendState === 'sending' && (
              <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
            )}
            Send it again
          </Button>
          {resendError && <Alert tone="danger">{resendError}</Alert>}
        </div>
      )}

      {resendState === 'sent' && (
        <p className="mt-6 text-[14.5px] leading-normal text-oj-ink-3">
          Sent again. Give it a minute to come through.
        </p>
      )}

      {!resendToken && (
        <p className="mt-6 text-[14.5px] leading-normal text-oj-ink-3">
          Still nothing?{' '}
          <a
            href="/availability/new"
            className="font-bold text-oj-orange-deep underline underline-offset-4"
          >
            Set up a new poll.
          </a>
        </p>
      )}
    </div>
  );
}
