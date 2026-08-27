'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

import { Button } from './Button';
import { Field } from './Field';
import { Input } from './inputs';

/**
 * Marketing surfaces.
 *
 * OfferCard is permanently price-free. That is a decision (D3), not an oversight:
 * all work is bespoke and published estimates would read as high and put the right
 * clients off before a conversation. The footnote carries the investment
 * conversation instead.
 */
export interface OfferCardProps {
  eyebrow?: React.ReactNode;
  name: React.ReactNode;
  blurb?: React.ReactNode;
  includes?: React.ReactNode[];
  footnote?: React.ReactNode;
  cta?: { label: string; href?: string; onClick?: () => void };
  /** Ink treatment for the recommended entry point. One per row. */
  featured?: boolean;
  className?: string;
}

export function OfferCard({
  eyebrow,
  name,
  blurb,
  includes = [],
  footnote,
  cta,
  featured = false,
  className,
}: OfferCardProps): JSX.Element {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 border-1.5 border-oj-ink rounded-oj p-6',
        featured ? 'bg-oj-ink text-oj-cream shadow-press-orange' : 'bg-oj-paper text-oj-ink',
        className
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            'm-0 text-xs font-bold uppercase tracking-[0.14em]',
            featured ? 'text-oj-peach' : 'text-oj-orange-deep'
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <p className="m-0 font-oj text-[23px] font-black leading-tight tracking-[-0.01em]">{name}</p>
      {blurb ? (
        <p
          className={cn(
            'm-0 text-[15px] leading-normal',
            featured ? 'text-oj-cream/80' : 'text-oj-ink-2'
          )}
        >
          {blurb}
        </p>
      ) : null}
      {includes.length ? (
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {includes.map((item, index) => (
            <li key={index} className="flex gap-2.5 text-[14.5px] leading-normal">
              <span
                aria-hidden="true"
                className={featured ? 'text-oj-orange' : 'text-oj-orange-deep'}
              >
                →
              </span>
              <span className={featured ? 'text-oj-cream/85' : 'text-oj-ink-2'}>{item}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {footnote ? (
        <p className={cn('m-0 text-[13px]', featured ? 'text-oj-cream/60' : 'text-oj-ink-3')}>
          {footnote}
        </p>
      ) : null}
      {cta ? (
        <div className="mt-auto pt-2">
          <Button
            variant={featured ? 'primary' : 'ink'}
            href={cta.href}
            onClick={cta.onClick}
            arrow
          >
            {cta.label}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export interface CompareTableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  caption?: React.ReactNode;
  columns?: React.ReactNode[];
  rows?: Array<{ label: React.ReactNode; values: Array<React.ReactNode | boolean> }>;
  /** Zero-based index of the column to highlight. */
  highlight?: number;
}

export function CompareTable({
  caption,
  columns = [],
  rows = [],
  highlight,
  className,
  ...rest
}: CompareTableProps): JSX.Element {
  return (
    // Wide tables scroll inside their own container rather than making the page
    // scroll sideways, which is what breaks reflow at 320px.
    <div className="overflow-x-auto">
      <table
        className={cn(
          'w-full border-collapse border-1.5 border-oj-ink bg-oj-paper text-sm',
          className
        )}
        {...rest}
      >
        {caption ? (
          <caption className="pb-3 text-left text-sm text-oj-ink-2">{caption}</caption>
        ) : null}
        <thead>
          <tr>
            <th scope="col" className="bg-oj-ink px-3.5 py-2.5 text-left text-oj-cream" />
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className={cn(
                  'px-3.5 py-2.5 text-left font-bold',
                  index === highlight ? 'bg-oj-orange text-oj-ink' : 'bg-oj-ink text-oj-cream'
                )}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <th
                scope="row"
                className="border-t border-oj-ink/15 px-3.5 py-2.5 text-left font-semibold text-oj-ink"
              >
                {row.label}
              </th>
              {row.values.map((value, index) => (
                <td
                  key={index}
                  className={cn(
                    'border-t border-oj-ink/15 px-3.5 py-2.5 text-oj-ink-2',
                    index === highlight && 'bg-oj-orange-soft'
                  )}
                >
                  {typeof value === 'boolean' ? (
                    <>
                      <span aria-hidden="true">{value ? '✓' : '—'}</span>
                      <span className="sr-only">{value ? 'Included' : 'Not included'}</span>
                    </>
                  ) : (
                    (value ?? <span aria-hidden="true">—</span>)
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export interface LogoStripProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
  /** Image items, or plain strings for type-only marks. */
  items?: Array<{ src: string; alt?: string; height?: number } | string>;
  height?: number;
  tone?: 'light' | 'dark';
}

export function LogoStrip({
  label = 'In partnership with',
  items = [],
  height = 30,
  tone = 'light',
  className,
  ...rest
}: LogoStripProps): JSX.Element {
  const dark = tone === 'dark';
  return (
    <div className={cn('flex flex-col gap-3', className)} {...rest}>
      <p className={cn('m-0 oj-eyebrow', dark && 'text-oj-peach')}>{label}</p>
      <div className="flex flex-wrap items-center gap-8">
        {items.map((item, index) =>
          typeof item === 'string' ? (
            <span
              key={index}
              className={cn(
                'font-oj text-lg font-bold',
                dark ? 'text-oj-cream/80' : 'text-oj-ink-2'
              )}
            >
              {item}
            </span>
          ) : (
            // Greyscale until hover, so the partner's own colour never competes with
            // the orange. eslint-disable: these are partner marks of unknown
            // dimensions, so next/image would need per-logo sizing to no benefit.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={index}
              src={item.src}
              alt={item.alt ?? ''}
              style={{ height: item.height ?? height }}
              className="w-auto grayscale transition-[filter] duration-oj-move ease-oj hover:grayscale-0 motion-reduce:transition-none"
            />
          )
        )}
      </div>
    </div>
  );
}

export interface NewsletterBandProps {
  title?: React.ReactNode;
  blurb?: React.ReactNode;
  placeholder?: string;
  buttonLabel?: string;
  note?: React.ReactNode;
  onSubmit?: (email: string) => void;
  className?: string;
}

export function NewsletterBand({
  title = 'Straight thinking, monthly.',
  blurb,
  placeholder = 'you@company.co.uk',
  buttonLabel = 'Sign up',
  note,
  onSubmit,
  className,
}: NewsletterBandProps): JSX.Element {
  const [email, setEmail] = React.useState('');

  return (
    <section className={cn('bg-oj-ink px-8 py-12 text-oj-cream', className)}>
      <div className="mx-auto flex max-w-[1160px] flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="max-w-md">
          <h2 className="oj-display m-0 font-oj text-[28px] font-black leading-tight">{title}</h2>
          {blurb ? (
            <p className="mt-2 text-[15px] leading-normal text-oj-cream/75">{blurb}</p>
          ) : null}
        </div>
        <form
          className="flex w-full max-w-md flex-col gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit?.(email);
          }}
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <Field label={<span className="sr-only">Work email</span>}>
                <Input
                  type="email"
                  required
                  value={email}
                  placeholder={placeholder}
                  autoComplete="email"
                  onChange={(event) => setEmail(event.target.value)}
                />
              </Field>
            </div>
            <Button type="submit">{buttonLabel}</Button>
          </div>
          {note ? <p className="m-0 text-[13px] text-oj-cream/55">{note}</p> : null}
        </form>
      </div>
    </section>
  );
}

export interface SeasonalItem {
  month: string;
  event: string;
  note?: string;
  href?: string;
  cta?: string;
}

export interface SeasonalBandProps {
  heading?: string;
  viewAll?: { label: string; href: string } | null;
  items?: SeasonalItem[];
  className?: string;
}

/**
 * Hospitality sector hub only. Month labels wear the hospitality taxonomy hue,
 * never orange.
 */
export function SeasonalBand({
  heading = 'What is coming up',
  viewAll,
  items = [],
  className,
}: SeasonalBandProps): JSX.Element {
  return (
    <section className={cn('flex flex-col gap-4', className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="oj-display m-0 font-oj text-2xl font-black text-oj-ink">{heading}</h2>
        {viewAll ? (
          <a href={viewAll.href} className="text-sm font-bold text-oj-orange-deep">
            {viewAll.label}
          </a>
        ) : null}
      </div>
      <ul className="m-0 flex list-none snap-x snap-mandatory gap-4 overflow-x-auto p-0 pb-2">
        {items.map((item, index) => (
          <li key={index} className="min-w-[240px] snap-start">
            <a
              href={item.href ?? '#'}
              className="flex h-full flex-col gap-1.5 border-1.5 border-oj-ink rounded-oj bg-oj-paper p-4 no-underline oj-press oj-focus"
            >
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-cat-hospitality">
                {item.month}
              </span>
              <span className="font-oj text-[17px] font-black text-oj-ink">{item.event}</span>
              {item.note ? (
                <span className="text-sm leading-normal text-oj-ink-2">{item.note}</span>
              ) : null}
              {item.cta ? (
                <span className="mt-auto pt-2 text-sm font-bold text-oj-orange-deep">
                  {item.cta} →
                </span>
              ) : null}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
