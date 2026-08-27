'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

import { useFieldControl } from './Field';

/**
 * Form controls for the repositioning.
 *
 * Each one inherits its id, aria-describedby and invalid state from the Field
 * wrapping it, so the accessible wiring cannot be forgotten. An explicit prop still
 * wins, for the cases where a control is used outside a Field.
 *
 * Paper surface, 1.5px ink border, orange focus ring, and an error state that
 * borrows the pressure shadow in danger red so a failed field reads as a physical
 * state rather than only a colour change.
 */
const CONTROL = [
  'w-full box-border font-oj text-[15.5px] text-oj-ink',
  'bg-oj-paper border-1.5 border-oj-ink rounded-oj',
  'px-[13px] py-[11px]',
  'placeholder:text-oj-ink-3',
  'transition-shadow duration-oj-hover ease-oj motion-reduce:transition-none',
  'focus:outline-none focus:shadow-[0_0_0_2px_var(--oj-surface-page),0_0_0_4.5px_var(--oj-orange)]',
  'aria-[invalid=true]:border-oj-danger aria-[invalid=true]:shadow-[2px_2px_0_0_var(--oj-danger)]',
  'disabled:bg-oj-cream-2 disabled:opacity-60',
].join(' ');

/** Shared plumbing: a control uses its own props first, then the Field's. */
function useControlProps<
  T extends {
    id?: string;
    'aria-describedby'?: string;
    'aria-invalid'?: React.AriaAttributes['aria-invalid'];
  },
>(props: T): T {
  const field = useFieldControl();
  return {
    ...props,
    id: props.id ?? field.id,
    'aria-describedby': props['aria-describedby'] ?? field.describedBy,
    'aria-invalid': props['aria-invalid'] ?? (field.invalid ? true : undefined),
  };
}

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...rest }: InputProps): JSX.Element {
  return <input {...useControlProps(rest)} className={cn(CONTROL, 'min-h-tap', className)} />;
}

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...rest }: TextareaProps): JSX.Element {
  return (
    <textarea
      {...useControlProps(rest)}
      className={cn(CONTROL, 'min-h-24 resize-y leading-normal', className)}
    />
  );
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children?: React.ReactNode;
}

export function Select({ className, children, ...rest }: SelectProps): JSX.Element {
  return (
    <select
      {...useControlProps(rest)}
      className={cn(
        CONTROL,
        'min-h-tap appearance-none pr-9',
        // The chevron is drawn in CSS rather than shipped as an icon, so it inherits
        // the ink colour and costs no request.
        'bg-[linear-gradient(45deg,transparent_50%,var(--oj-ink)_50%),linear-gradient(135deg,var(--oj-ink)_50%,transparent_50%)]',
        'bg-[position:calc(100%-19px)_55%,calc(100%-13px)_55%]',
        'bg-[size:6px_6px] bg-no-repeat',
        className
      )}
    >
      {children}
    </select>
  );
}

const TICKBOX = [
  'appearance-none w-5 h-5 flex-none mt-px grid place-content-center cursor-pointer',
  'bg-oj-paper border-1.5 border-oj-ink',
  'transition-[background-color] duration-oj-hover ease-oj motion-reduce:transition-none',
  'focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_var(--oj-surface-page),0_0_0_4.5px_var(--oj-orange)]',
  'disabled:opacity-60 disabled:cursor-not-allowed',
].join(' ');

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
}

export function Checkbox({ label, className, ...rest }: CheckboxProps): JSX.Element {
  return (
    <label className="flex cursor-pointer items-start gap-[11px] text-[15px] leading-snug">
      <input
        type="checkbox"
        {...useControlProps(rest)}
        className={cn(
          TICKBOX,
          'rounded-oj checked:bg-oj-orange',
          // The tick is a rotated open corner rather than an SVG, so it scales with
          // the box and needs no icon request.
          "checked:after:content-[''] checked:after:w-2.5 checked:after:h-1.5",
          'checked:after:border-[2.5px] checked:after:border-oj-ink',
          'checked:after:border-t-0 checked:after:border-r-0',
          'checked:after:-rotate-45 checked:after:translate-x-px checked:after:-translate-y-px',
          className
        )}
      />
      {label ? <span>{label}</span> : null}
    </label>
  );
}

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
}

export function Radio({ label, className, ...rest }: RadioProps): JSX.Element {
  return (
    <label className="flex cursor-pointer items-start gap-[11px] text-[15px] leading-snug">
      <input
        type="radio"
        {...useControlProps(rest)}
        className={cn(
          TICKBOX,
          'rounded-full',
          "checked:after:content-[''] checked:after:w-2.5 checked:after:h-2.5",
          'checked:after:rounded-full checked:after:bg-oj-orange',
          className
        )}
      />
      {label ? <span>{label}</span> : null}
    </label>
  );
}
