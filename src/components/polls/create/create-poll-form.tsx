'use client';

import { useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';

import Button from '@/components/Button';
import Heading from '@/components/Heading';
import Text from '@/components/Text';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
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
import { getTodayIsoDate } from '@/lib/dateUtils';
import {
  createPollSchema,
  MAX_POLL_OPTIONS,
  type CreatePollFormValues,
} from '@/lib/validation/polls';
import { createPoll, resendVerification } from '@/app/actions/polls';
import TurnstileWidget from './turnstile-widget';

/**
 * The create-poll form.
 *
 * A client component because it needs `useForm`, `useFieldArray` for the dynamic
 * option rows, and `useState` for the submitted state. Mirrors the split in
 * src/components/forms/contact-form.tsx in shape only — that file imports the
 * raw shadcn Button, whose `--primary` is charcoal rather than brand orange and
 * whose default size is under the 44px tap target. This one uses the legacy
 * Button.
 *
 * The success state replaces the form in place. There is no navigation and no
 * separate route: the resend token lives in client state and must never reach a
 * URL, so there is nowhere for a success route to read it from.
 */

const EMPTY_DATE = { date: '' };
const EMPTY_SLOT = { date: '', startTime: '', endTime: '', endsNextDay: false };

/** The form mounts with two rows. A poll with one option is meaningless. */
const DEFAULT_VALUES: CreatePollFormValues = {
  title: '',
  description: '',
  agenda: '',
  location: '',
  organiserName: '',
  organiserEmail: '',
  optionKind: 'dates',
  dates: [{ ...EMPTY_DATE }, { ...EMPTY_DATE }],
  slots: undefined,
  turnstileToken: '',
  website: '',
};

export default function CreatePollForm(): JSX.Element {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [resendToken, setResendToken] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState('');
  const [pendingKind, setPendingKind] = useState<'dates' | 'slots' | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  const form = useForm<CreatePollFormValues>({
    resolver: zodResolver(createPollSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onSubmit',
  });

  const optionKind = form.watch('optionKind');
  const isSlots = optionKind === 'slots';

  const dateFields = useFieldArray({ control: form.control, name: 'dates' });
  const slotFields = useFieldArray({ control: form.control, name: 'slots' });
  const rows = isSlots ? slotFields : dateFields;
  const atCap = rows.fields.length >= MAX_POLL_OPTIONS;

  // The superRefine attaches its issues to the array itself, so they land on
  // `.message` (or `.root.message`) rather than on any row's field.
  const optionArrayError = isSlots ? form.formState.errors.slots : form.formState.errors.dates;
  const optionsError = optionArrayError?.message ?? optionArrayError?.root?.message;

  // `getTodayIsoDate()` is London's date, not UTC's. A naive toISOString() puts
  // the poll a day out between midnight and 01:00 London in summer.
  const today = getTodayIsoDate();

  /** True when the organiser has typed anything into any option row. */
  function hasOptionContent(): boolean {
    const values = form.getValues();
    if (values.optionKind === 'dates') {
      return (values.dates ?? []).some((row) => row.date !== '');
    }
    return (values.slots ?? []).some(
      (row) => row.date !== '' || row.startTime !== '' || row.endTime !== ''
    );
  }

  /** Swaps the option list to the other shape. Always two fresh, empty rows. */
  function applyKind(kind: 'dates' | 'slots'): void {
    form.setValue('optionKind', kind, { shouldValidate: false });
    if (kind === 'dates') {
      form.setValue('slots', undefined);
      form.setValue('dates', [{ ...EMPTY_DATE }, { ...EMPTY_DATE }]);
    } else {
      form.setValue('dates', undefined);
      form.setValue('slots', [{ ...EMPTY_SLOT }, { ...EMPTY_SLOT }]);
    }
    form.clearErrors(['dates', 'slots']);
  }

  function requestKindChange(kind: 'dates' | 'slots'): void {
    if (kind === optionKind) return;
    // Warn before throwing away work, but only if there is work to throw away.
    if (hasOptionContent()) {
      setPendingKind(kind);
      return;
    }
    applyKind(kind);
  }

  function addRow(): void {
    if (atCap) return;
    if (isSlots) {
      slotFields.append({ ...EMPTY_SLOT });
    } else {
      dateFields.append({ ...EMPTY_DATE });
    }
    // Focus the new row's date input, so a keyboard user is not dropped back at
    // the top of the list.
    window.requestAnimationFrame(() => {
      const name = isSlots
        ? `slots.${slotFields.fields.length}.date`
        : `dates.${dateFields.fields.length}.date`;
      document.getElementsByName(name)[0]?.focus();
    });
  }

  function removeRow(index: number): void {
    if (rows.fields.length <= 1) return;
    if (isSlots) {
      slotFields.remove(index);
    } else {
      dateFields.remove(index);
    }
    // Focus the previous row's remove button, or the add button when row 1 went.
    window.requestAnimationFrame(() => {
      const target =
        index > 0
          ? document.querySelector<HTMLElement>(`[data-remove-option="${index - 1}"]`)
          : document.querySelector<HTMLElement>('[data-add-option]');
      target?.focus();
    });
  }

  async function onSubmit(values: CreatePollFormValues): Promise<void> {
    setStatus('submitting');
    setError(null);

    try {
      const result = await createPoll(values);

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
      setStatus('success');
    } catch {
      setError('Something went wrong. Please try again, or message Peter on WhatsApp.');
      setStatus('idle');
      window.requestAnimationFrame(() => errorRef.current?.focus());
    }
  }

  if (status === 'success') {
    return <SuccessState email={sentTo} resendToken={resendToken} />;
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

          {/* The kind toggle decides what every option row looks like, so it sits
              above the options fieldset. Native radios, not a Select: two
              mutually exclusive choices with helper text each. */}
          <fieldset className="space-y-3">
            <legend className="text-base font-medium text-charcoal">
              What are you asking for?
            </legend>
            <Text size="sm" color="muted">
              You can&apos;t change this once the poll is out, so pick the one that fits.
            </Text>

            <div className="grid gap-3 sm:grid-cols-2">
              {(
                [
                  {
                    value: 'dates' as const,
                    label: 'Whole days',
                    helper: 'People say which days work. No times.',
                  },
                  {
                    value: 'slots' as const,
                    label: 'Times on a day',
                    helper: 'People say which time slots work.',
                  },
                ] satisfies Array<{ value: 'dates' | 'slots'; label: string; helper: string }>
              ).map((choice) => (
                <label
                  key={choice.value}
                  className="flex min-h-[44px] cursor-pointer items-start gap-3 rounded-md border border-border bg-white p-3 focus-within:ring-2 focus-within:ring-orange focus-within:ring-offset-2"
                >
                  <input
                    type="radio"
                    name="optionKind"
                    value={choice.value}
                    checked={optionKind === choice.value}
                    onChange={() => requestKindChange(choice.value)}
                    disabled={isSubmitting}
                    className="mt-1 h-5 w-5 accent-orange"
                  />
                  <span>
                    <Text size="base" weight="medium">
                      {choice.label}
                    </Text>
                    <Text size="sm" color="muted">
                      {choice.helper}
                    </Text>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="text-base font-medium text-charcoal">Your options</legend>
            <Text size="sm" color="muted">
              {isSlots
                ? 'Add between two and eight. All times are London time.'
                : 'Add between two and eight days.'}
            </Text>

            {/* Announced politely so adding or removing a row is not silent. */}
            <div className="space-y-4" aria-live="polite">
              {rows.fields.map((field, index) => (
                <div
                  key={field.id}
                  className={
                    isSlots
                      ? 'rounded-md border border-border bg-white p-3 md:grid md:grid-cols-[1fr_auto_auto_auto_auto] md:gap-3 md:items-end md:border-0 md:bg-transparent md:p-0'
                      : 'rounded-md border border-border bg-white p-3 md:grid md:grid-cols-[1fr_auto] md:gap-3 md:items-end md:border-0 md:bg-transparent md:p-0'
                  }
                >
                  <FormField
                    control={form.control}
                    name={isSlots ? `slots.${index}.date` : `dates.${index}.date`}
                    render={({ field: dateField }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input {...dateField} type="date" min={today} disabled={isSubmitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {isSlots && (
                    <>
                      <div className="mt-3 grid grid-cols-2 gap-3 md:mt-0 md:contents">
                        <FormField
                          control={form.control}
                          name={`slots.${index}.startTime`}
                          render={({ field: startField }) => (
                            <FormItem>
                              <FormLabel>From</FormLabel>
                              <FormControl>
                                <Input
                                  {...startField}
                                  type="time"
                                  step={900}
                                  disabled={isSubmitting}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`slots.${index}.endTime`}
                          render={({ field: endField }) => (
                            <FormItem>
                              <FormLabel>Until</FormLabel>
                              <FormControl>
                                <Input
                                  {...endField}
                                  type="time"
                                  step={900}
                                  disabled={isSubmitting}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Its own line beneath the times, never beside them: it is
                          not part of the end-time control. Never inferred from
                          the times either — an inferred flag turns a mistyped
                          time into a silent all-night event. */}
                      <FormField
                        control={form.control}
                        name={`slots.${index}.endsNextDay`}
                        render={({ field: nextDayField }) => (
                          <FormItem className="mt-3 flex min-h-[44px] flex-row items-center gap-2 space-y-0 md:mt-0">
                            <FormControl>
                              <Checkbox
                                checked={nextDayField.value}
                                onCheckedChange={nextDayField.onChange}
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormLabel className="!mt-0 whitespace-nowrap">
                              Ends the next day
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {rows.fields.length > 1 && (
                    <div className="mt-3 md:mt-0">
                      <Button
                        variant="ghost"
                        size="small"
                        type="button"
                        aria-label={`Remove option ${index + 1}`}
                        onClick={() => removeRow(index)}
                        disabled={isSubmitting}
                        className="!px-3"
                      >
                        <span aria-hidden="true">✕</span>
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>

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

            <div className="md:w-auto md:inline-block">
              <Button
                variant="outline"
                size="medium"
                type="button"
                fullWidth
                disabled={atCap || isSubmitting}
                onClick={addRow}
                data-add-option
              >
                Add another option
              </Button>
            </div>
            {atCap && (
              <Text size="sm" color="muted">
                That&apos;s the maximum of eight options.
              </Text>
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

      <Dialog open={pendingKind !== null} onOpenChange={(open) => !open && setPendingKind(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start the options again?</DialogTitle>
            <DialogDescription>
              Switching means your options don&apos;t fit any more, so we&apos;ll clear them and you
              can put them in fresh.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              size="medium"
              type="button"
              onClick={() => setPendingKind(null)}
            >
              Leave it as it is
            </Button>
            <Button
              variant="primary"
              size="medium"
              type="button"
              onClick={() => {
                if (pendingKind) applyKind(pendingKind);
                setPendingKind(null);
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
}: {
  email: string;
  resendToken: string | null;
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
