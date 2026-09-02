'use client';

import * as React from 'react';
import { useFormState, useFormStatus } from 'react-dom';

import { submitEnquiry } from '@/app/actions/enquiry';
import { ENQUIRY_INITIAL_STATE, type EnquiryFormState } from '@/lib/schemas/enquiry';
import { getBrowserLeadSource } from '@/lib/lead-source';
import { hasAnalyticsConsent, trackClientEvent } from '@/lib/tracking';
import { cn } from '@/lib/utils';

import { Anchor } from './Anchor';
import { Button } from './Button';
import { Field } from './Field';
import { Input, Textarea } from './inputs';

/**
 * The enquiry form. Two steps, one `<form>`, one server action.
 *
 * WHY ONE FORM. Step one writes the lead; step two enriches it. Keeping both in a
 * single native form whose action is a server action is what makes the whole thing
 * work with JavaScript switched off: the browser posts, the action runs, Next
 * re-renders with the new state. Splitting it into two components with a client
 * router push would have made step one JavaScript-only, and step one is the half
 * that must never fail.
 *
 * Ids are fixed strings rather than `useId` so the error summary can link to them
 * and so the server-rendered no-JS pass produces the same markup as the client.
 *
 * @see tasks/repositioning/SUB-SPECS.md part 1
 */

/** Where the person came from. Analytics only, never shown. */
export type EnquiryEntryPoint = 'nav' | 'sticky' | 'cta_band' | 'next_step' | 'scorecard' | 'page';

export interface EnquiryFormProps {
  entryPoint?: EnquiryEntryPoint;
  className?: string;
}

const STEP_ONE_FIELDS = [
  { name: 'name', id: 'enquiry-name', label: 'Your name' },
  /*
   * "Email", not "Work email". A publican's business email is often a Gmail
   * address, and "work email" made some of them pause over whether it counted.
   * "Business or venue", not "Company", for the same reader.
   */
  { name: 'email', id: 'enquiry-email', label: 'Email' },
  { name: 'company', id: 'enquiry-company', label: 'Business or venue' },
  { name: 'situation', id: 'enquiry-situation', label: "What's going on?" },
] as const;

function SubmitButton({ children }: { children: React.ReactNode }): JSX.Element {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" arrow disabled={pending}>
      {pending ? 'Sending…' : children}
    </Button>
  );
}

/**
 * The error summary.
 *
 * Inline messages alone are not enough: on submit the page does not move, and a
 * screen-reader user is given no reason to think anything happened. This takes
 * focus, states how many fields need attention, and links to each one.
 */
function ErrorSummary({ state }: { state: EnquiryFormState }): JSX.Element | null {
  const ref = React.useRef<HTMLDivElement>(null);
  const fieldErrors = state.fieldErrors ?? {};
  const entries = STEP_ONE_FIELDS.filter((field) => fieldErrors[field.name]);
  const hasAnything = Boolean(state.error);

  React.useEffect(() => {
    if (hasAnything) ref.current?.focus();
  }, [hasAnything, state.error]);

  if (!hasAnything) return null;

  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="alert"
      className="mb-7 rounded-oj border-1.5 border-oj-danger bg-oj-paper p-5 shadow-[3px_3px_0_0_var(--oj-danger)] outline-none"
    >
      <p className="font-oj text-[17px] font-black text-oj-ink">
        {entries.length > 0
          ? `There ${entries.length === 1 ? 'is 1 thing' : `are ${entries.length} things`} to fix`
          : 'We could not send that'}
      </p>
      {entries.length > 0 ? (
        <ul className="mt-2.5 flex list-disc flex-col gap-1 pl-5 text-[15px]">
          {entries.map((field) => (
            <li key={field.name}>
              <a href={`#${field.id}`} className="font-semibold text-oj-orange-deep underline">
                {fieldErrors[field.name]}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-[15px] text-oj-ink-2">{state.error}</p>
      )}
    </div>
  );
}

export function EnquiryForm({ entryPoint = 'page', className }: EnquiryFormProps): JSX.Element {
  const [state, formAction] = useFormState(submitEnquiry, ENQUIRY_INITIAL_STATE);
  const [leadSource, setLeadSource] = React.useState('');
  const startedRef = React.useRef(false);
  const doneRef = React.useRef<HTMLDivElement>(null);

  // Attribution is read in an effect rather than during render: it reads the URL and
  // may read sessionStorage, neither of which exists on the server, and doing it
  // during render would make the first client pass disagree with the server one.
  React.useEffect(() => {
    setLeadSource(JSON.stringify(getBrowserLeadSource({ persist: hasAnalyticsConsent() })));
  }, []);

  // The success state has to be announced. Without this, submitting the form on a
  // screen reader is silent: the page does not navigate and focus stays on a button
  // that is no longer there.
  React.useEffect(() => {
    if (state.step === 'done') doneRef.current?.focus();
  }, [state.step]);

  const onFirstInput = React.useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    trackClientEvent('enquiry_started', {
      properties: { entry_point: entryPoint },
      dedupeKey: entryPoint,
    });
  }, [entryPoint]);

  if (state.step === 'done') {
    return (
      /*
        `role="status"` as well as the focus move.
        
        The banner that used to sit on the second step carried it and this did not,
        because focus moving here was enough while there was another screen after it.
        With the second step gone this is the only confirmation an enquiry ever gets,
        so it announces itself as well as taking focus.
      */
      <div
        ref={doneRef}
        role="status"
        tabIndex={-1}
        className={cn(
          'rounded-oj border-1.5 border-oj-ink bg-oj-paper p-8 shadow-press outline-none',
          className
        )}
      >
        <h2 className="oj-display text-[34px] leading-[1.05] text-oj-ink">that has arrived.</h2>
        <p className="measure mt-3.5 text-[17px] leading-relaxed text-oj-ink-2">
          A person will read it, not a filter. You'll get a reply from Orange Jelly, and it will be
          about your situation rather than a brochure.
        </p>
        <p className="mt-3 text-[15px] text-oj-ink-3">
          If anything changes in the meantime, reply to that email or write to{' '}
          <a href="mailto:peter@orangejelly.co.uk" className="font-semibold underline">
            peter@orangejelly.co.uk
          </a>
          .
        </p>
      </div>
    );
  }

  const values = state.values ?? {};
  const fieldErrors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className={className} noValidate>
      <ErrorSummary state={state} />

      {/* Attribution and the honeypot. Both are hidden from people and from screen
          readers: one is not information, the other is a trap. */}
      <input type="hidden" name="leadSource" value={leadSource} />
      <div className="absolute h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="enquiry-subject">Do not fill this in</label>
        <input id="enquiry-subject" name="subject" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <fieldset className="flex flex-col gap-5 border-0 p-0" onInput={onFirstInput}>
        <legend className="oj-display mb-1.5 text-[27px] leading-none text-oj-ink">
          tell us what's happening.
        </legend>

        <Field
          label="Your name"
          htmlFor="enquiry-name"
          required
          announceError={false}
          error={fieldErrors.name}
        >
          <Input name="name" autoComplete="name" maxLength={80} defaultValue={values.name} />
        </Field>

        <Field
          label="Email"
          htmlFor="enquiry-email"
          required
          announceError={false}
          error={fieldErrors.email}
          hint="One reply from a person. No list, no sequence."
        >
          <Input
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            defaultValue={values.email}
          />
        </Field>

        <Field
          label="Business or venue"
          htmlFor="enquiry-company"
          required
          announceError={false}
          error={fieldErrors.company}
        >
          <Input
            name="company"
            autoComplete="organization"
            maxLength={120}
            defaultValue={values.company}
          />
        </Field>

        <Field
          label="What's going on?"
          htmlFor="enquiry-situation"
          required
          announceError={false}
          error={fieldErrors.situation}
          hint="A line is plenty. We'll ask the rest when we talk."
        >
          <Textarea
            name="situation"
            rows={5}
            maxLength={2000}
            defaultValue={values.situation}
            placeholder="Enquiries have halved since the spring and nobody can agree why."
          />
        </Field>

        <div className="mt-1">
          <SubmitButton>Let's talk</SubmitButton>
        </div>

        <p className="text-[13.5px] leading-relaxed text-oj-ink-3">
          We use this to have one useful conversation, nothing else. See the{' '}
          <Anchor href="/privacy" className="font-semibold underline">
            privacy notice
          </Anchor>
          .
        </p>
      </fieldset>
    </form>
  );
}

export default EnquiryForm;
