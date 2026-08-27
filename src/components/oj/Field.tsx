'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Label, control, and hint or error wrapper for every form control.
 *
 * WHAT THIS PORT ADDS. The reference renders a label, the child, and a hint or
 * error line, and leaves the caller to remember `aria-invalid` and to wire
 * `aria-describedby` themselves. On a twelve-field enquiry form that will be
 * forgotten at least once, and when it is, a screen-reader user hears "Work email,
 * edit text" with no hint that the field is wrong or why.
 *
 * So the association is not optional here. Field generates the ids and passes them
 * down through context; the controls below pick them up automatically. A caller
 * can still override anything, but doing nothing gives the correct behaviour rather
 * than a silent accessibility hole.
 *
 * The error replaces the hint rather than sitting beside it. Two lines of
 * competing guidance under one input is worse than one line of the right guidance.
 */
interface FieldContextValue {
  id?: string;
  describedBy?: string;
  invalid: boolean;
}

const FieldContext = React.createContext<FieldContextValue>({ invalid: false });

/** Controls call this to inherit their field's id, description and error state. */
export function useFieldControl(): FieldContextValue {
  return React.useContext(FieldContext);
}

export interface FieldProps {
  label?: React.ReactNode;
  /** Helper line. Replaced by the error when there is one. */
  hint?: React.ReactNode;
  /** Validation message. Its presence also marks the control invalid. */
  error?: React.ReactNode;
  /** Adds the orange asterisk and marks the control required. */
  required?: boolean;
  /** Explicit id for the control. One is generated when omitted. */
  htmlFor?: string;
  children?: React.ReactNode;
  className?: string;
}

export function Field({
  label,
  hint,
  error,
  required,
  htmlFor,
  children,
  className,
}: FieldProps): JSX.Element {
  const generatedId = React.useId();
  const id = htmlFor ?? generatedId;
  const messageId = `${id}-message`;
  const hasMessage = Boolean(error ?? hint);

  const context = React.useMemo<FieldContextValue>(
    () => ({
      id,
      describedBy: hasMessage ? messageId : undefined,
      invalid: Boolean(error),
    }),
    [id, messageId, hasMessage, error]
  );

  return (
    <FieldContext.Provider value={context}>
      <div className={cn('flex flex-col gap-[7px]', className)}>
        {label ? (
          <label htmlFor={id} className="text-[14.5px] font-bold text-oj-ink">
            {label}
            {required ? (
              <span className="text-oj-orange-deep">
                {' '}
                <span aria-hidden="true">*</span>
                <span className="sr-only">(required)</span>
              </span>
            ) : null}
          </label>
        ) : null}

        {children}

        {error ? (
          // role="alert" so a validation message that appears after submit is
          // announced rather than sitting there silently.
          <span id={messageId} role="alert" className="text-xs font-semibold text-oj-danger">
            {error}
          </span>
        ) : hint ? (
          <span id={messageId} className="text-[13px] text-oj-ink-3">
            {hint}
          </span>
        ) : null}
      </div>
    </FieldContext.Provider>
  );
}

export default Field;
