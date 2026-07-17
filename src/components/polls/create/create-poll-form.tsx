'use client';

import { useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import Button from '@/components/Button';
import Heading from '@/components/Heading';
import Text from '@/components/Text';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import AvailabilityGrid from './availability-grid';
import DurationSelector from './duration-selector';
import TurnstileWidget from './turnstile-widget';

/**
 * The create-poll form.
 *
 * A client component because it needs `useForm` and `useState` for the submitted
 * state. Mirrors the split in src/components/forms/contact-form.tsx in shape only
 * — that file imports the raw shadcn Button, whose `--primary` is charcoal rather
 * than brand orange and whose default size is under the 44px tap target. This one
 * uses the legacy Button.
 *
 * The options are picked on a calendar grid rather than typed into a repeater.
 * The grid is a different way of producing the same two shapes this form has
 * always emitted, and nothing downstream knows it changed:
 *
 *   - `optionKind: 'dates'` → `{ date }`
 *   - `optionKind: 'slots'` → `{ date, startTime, endTime, endsNextDay }`
 *
 * The duration is what decides between them — "All day" means whole days, any
 * length means times — so there is no separate kind toggle any more. The two
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
 * validated — creation is public by design, gated by email verification rather
 * than by a login, so a stranger must be able to type straight over them.
 *
 * Both values come from CONTACT rather than a literal. The address is already
 * the one the footer, the contact page and the privacy notice render, so a
 * second copy here is just a second thing to miss when it changes — and it
 * exposes nothing new, being public in three places already.
 *
 * It also fails safe. If a stranger did reach this form and left the defaults
 * alone, the verification email goes to Peter, who will not click it, and the
 * poll never opens. The prefill cannot be used to send mail in his name.
 *
 * `website` is the honeypot and MUST stay empty — prefilling it would make every
 * real submission look like a bot to our own check.
 */
// London's today, so the deadline picker never offers a date already gone. The
// server rejects a past instant too; this only spares the obvious mistake.
const minDeadlineDate = getTodayIsoDate();

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

    // Unpicking always works. Picking stops at the cap — the grid disables the
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
   * lengths keeps every start and simply recomputes where each one ends — there
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
      setStatus('success');
    } catch {
      setError('Something went wrong. Please try again, or message Peter on WhatsApp.');
      setStatus('idle');
      window.requestAnimationFrame(() => errorRef.current?.focus());
    }
  }

  if (status === 'success') {
    return <SuccessState email={sentTo} resendToken={resendToken} links={links} />;
  }

  const isSubmitting = status === 'submitting';

  return (
    <div className="max-w-2xl mt-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What are you arranging?</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    maxLength={120}
                    placeholder="Quiz night briefing"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Any detail people need (optional)</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={3} maxLength={1000} disabled={isSubmitting} />
                </FormControl>
                <FormDescription>Shown to everyone you send the link to.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="agenda"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What&apos;s on the agenda? (optional)</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={4} maxLength={2000} disabled={isSubmitting} />
                </FormControl>
                <FormDescription>
                  Shown on the poll, and it goes into the calendar entry so it&apos;s there on the
                  day.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Where? (optional)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    maxLength={200}
                    placeholder="The Anchor, back room"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>
                  Shown on the poll and added to the calendar entry.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="organiserName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    autoComplete="name"
                    maxLength={50}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>
                  Shown on the poll so people know who&apos;s asking.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="organiserEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    maxLength={254}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>
                  We send your organiser link here. It is the only way back into your results, so
                  use an address you can get to.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/*
            Optional deadline. Leaving it blank keeps the old behaviour: the poll
            stays open until you confirm it. Set it and we email YOU when it
            passes, to come and pick. Nothing sends to guests on its own. The
            invite always waits for you to choose, because a tie or a thin
            turnout is a judgement, not a sum.
          */}
          <fieldset className="rounded-lg border border-charcoal/15 p-4">
            <legend className="px-1 text-sm font-medium text-charcoal">
              Close entries automatically (optional)
            </legend>
            <p className="mb-3 text-sm text-charcoal/60">
              We&rsquo;ll email you when this passes so you can pick a time. We never send the
              invite for you.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="deadlineDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        type="date"
                        min={minDeadlineDate}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deadlineTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        type="time"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </fieldset>

          {/* The duration decides what kind of poll this is, so it sits above the
              grid: "All day" asks about whole days, any length asks about times. */}
          <DurationSelector value={duration} onChange={requestDuration} disabled={isSubmitting} />

          {/* min-w-0 is load-bearing. A fieldset's UA style is
              `min-inline-size: min-content`, so it refuses to shrink below its
              widest child — here, a 43rem grid. Without this it sits 690px wide
              inside a 375px screen, the scroll container inherits that width and
              therefore never scrolls, and the back half of the week becomes
              unreachable on a phone. */}
          <fieldset className="min-w-0 space-y-3">
            <legend className="text-base font-medium text-charcoal">Your options</legend>
            <Text size="sm" color="muted">
              {allDay
                ? 'Tap the days that work. Pick between two and eight.'
                : 'Tap the times that work. Pick between two and eight — all times are London time.'}
            </Text>

            <AvailabilityGrid
              duration={duration}
              dates={dates}
              slots={slots}
              onToggleDate={toggleDate}
              onToggleSlot={toggleSlot}
              disabled={isSubmitting}
            />

            {/* The array-level message: too few, too many, duplicates.
                A plain <p>, not <FormMessage>: FormMessage calls useFormField(),
                which reads a FormField context that does not exist out here and
                would resolve the field name to undefined. It belongs to the
                array, not to any one row's input. */}
            {optionsError && (
              <p role="alert" className="text-[0.8rem] font-medium text-destructive">
                {optionsError}
              </p>
            )}
          </fieldset>

          {/* Honeypot. Verbatim from contact-form.tsx — all five attributes. */}
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
          <FormField
            control={form.control}
            name="turnstileToken"
            render={() => (
              <FormItem>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && (
            <Alert variant="destructive" role="alert" className="mb-6" ref={errorRef} tabIndex={-1}>
              <AlertTitle>That didn&apos;t go through</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="md:w-auto md:inline-block">
            <Button variant="primary" size="large" type="submit" fullWidth loading={isSubmitting}>
              Send me my links
            </Button>
          </div>

          <Text size="sm" color="muted">
            By sending this you agree we can email you about this poll. Nothing else, and we
            don&apos;t pass your address on. We delete the poll and everyone&apos;s answers 60 days
            after the last date on it.
          </Text>
        </form>
      </Form>

      {/* Only ever opens for the one change that cannot keep what is picked:
          whole days and times are different shapes and cannot hold each other's
          values. Changing between two timed lengths keeps everything. */}
      <Dialog
        open={pendingDuration !== null}
        onOpenChange={(open) => !open && setPendingDuration(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start the options again?</DialogTitle>
            <DialogDescription>
              {pendingDuration === 'all-day'
                ? 'Asking about whole days means the times you picked no longer fit, so we’ll clear them and you can pick days instead.'
                : 'Asking about times means the days you picked no longer fit, so we’ll clear them and you can pick times instead.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              size="medium"
              type="button"
              onClick={() => setPendingDuration(null)}
            >
              Leave it as it is
            </Button>
            <Button
              variant="primary"
              size="medium"
              type="button"
              onClick={() => {
                if (pendingDuration !== null) applyDuration(pendingDuration);
                setPendingDuration(null);
              }}
            >
              Yes, clear them
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/**
 * The success state. Replaces the form in place — no navigation, no redirect.
 *
 * The poll is `status='draft'` here and the participant link does not work yet,
 * so no link is shown. The resend token is client state and never reaches a URL;
 * reloading loses it, and the control with it, which is correct — at that point
 * the recovery route is a fresh poll, not an unbounded resend.
 */
function SuccessState({
  email,
  resendToken,
  links,
}: {
  email: string;
  resendToken: string | null;
  /** Set only when a signed-in admin created the poll: it is already live. */
  links: PollLinks | null;
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
        <Heading level={1} color="charcoal">
          Your poll is live
        </Heading>

        <Alert
          variant="default"
          role="status"
          className="mt-4 border-orange bg-orange-light text-charcoal"
        >
          <AlertTitle>No email needed</AlertTitle>
          <AlertDescription>
            You were already signed in, so we did not make you confirm an address you had just
            proved. Your poll is open and taking answers now.
          </AlertDescription>
        </Alert>

        <div className="mt-6 space-y-6">
          <div>
            <Text weight="semibold" color="charcoal">
              Send this one to your guests
            </Text>
            <Text size="sm" color="muted" className="mt-1">
              Anyone with it can answer. They will not need an account.
            </Text>
            <p className="mt-2 break-all rounded-md border border-charcoal/15 bg-white p-3 font-mono text-sm text-charcoal">
              {links.participantUrl}
            </p>
          </div>

          <div>
            <Text weight="semibold" color="charcoal">
              Keep this one to yourself
            </Text>
            <Text size="sm" color="muted" className="mt-1">
              It shows who said what, and it can close the poll and confirm the time. Anyone you
              forward it to can do the same, so do not send it round with the other one.
            </Text>
            <p className="mt-2 break-all rounded-md border border-charcoal/15 bg-white p-3 font-mono text-sm text-charcoal">
              {links.organiserUrl}
            </p>
          </div>

          <Button href={links.organiserUrl} variant="primary">
            Open my poll
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mt-8">
      <Heading level={1} color="charcoal">
        Check your inbox
      </Heading>

      {/* There is no success variant on Alert, so border-orange + bg-orange-light
          is the agreed treatment, used identically on every poll screen. */}
      <Alert
        variant="default"
        role="status"
        className="mt-4 border-orange bg-orange-light text-charcoal"
      >
        <AlertTitle>We&apos;ve sent your links</AlertTitle>
        <AlertDescription>
          We&apos;ve emailed <strong>{email}</strong> a link to confirm your address. Tap it and
          your poll goes live — then you&apos;ll get your team&apos;s link and your own private one.
        </AlertDescription>
      </Alert>

      {resendToken && resendState !== 'sent' && (
        <div className="mt-6 space-y-3">
          <Text size="sm" color="muted">
            Nothing there? Have a look in your spam folder first.
          </Text>
          <Button
            variant="outline"
            size="medium"
            type="button"
            loading={resendState === 'sending'}
            onClick={onResend}
          >
            Send it again
          </Button>
          {resendError && (
            <Alert variant="destructive" role="alert">
              <AlertDescription>{resendError}</AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {resendState === 'sent' && (
        <Text size="sm" color="muted" className="mt-6">
          Sent again. Give it a minute to come through.
        </Text>
      )}

      {!resendToken && (
        <Text size="sm" color="muted" className="mt-6">
          Still nothing? <a href="/availability/new">Set up a new poll.</a>
        </Text>
      )}
    </div>
  );
}
