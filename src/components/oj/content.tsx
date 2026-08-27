import * as React from 'react';

import { cn } from '@/lib/utils';

import { Stat } from './Stat';
import { Tag } from './Tag';

/**
 * Content surfaces for the repositioning.
 *
 * PressureCard fixes a real defect in the reference: it puts an onClick on the card
 * and a link inside it, which makes the card look clickable to a mouse and expose
 * only a bare arrow to a keyboard. Here the whole card IS the link, so it is
 * reachable by tab, announced with its title, and needs no duplicate handler.
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: 'paper' | 'ink' | 'orange';
  /** Hover shift and hard shadow, for cards that go somewhere. */
  pressure?: boolean;
  children?: React.ReactNode;
}

const CARD_TONE = {
  paper: 'bg-oj-paper text-oj-ink',
  ink: 'bg-oj-ink text-oj-cream',
  orange: 'bg-oj-orange text-oj-ink',
} as const;

export function Card({
  tone = 'paper',
  pressure = false,
  className,
  children,
  ...rest
}: CardProps): JSX.Element {
  return (
    <div
      className={cn(
        'border-1.5 border-oj-ink rounded-oj p-5',
        CARD_TONE[tone],
        pressure && 'oj-press',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export interface PressureCardProps {
  title: React.ReactNode;
  desc?: React.ReactNode;
  href?: string;
  className?: string;
}

export function PressureCard({
  title,
  desc,
  href = '#',
  className,
}: PressureCardProps): JSX.Element {
  return (
    <a
      href={href}
      className={cn(
        'group/pressure flex flex-col gap-2 no-underline',
        'border-1.5 border-oj-ink rounded-oj bg-oj-paper p-5 text-oj-ink',
        'oj-press oj-focus',
        className
      )}
    >
      <span className="flex items-center justify-between gap-2.5">
        <span className="font-oj text-[19px] font-black tracking-[-0.01em]">{title}</span>
        <span
          aria-hidden="true"
          className="text-xl font-normal text-oj-orange-deep transition-transform duration-oj-hover ease-oj group-hover/pressure:translate-x-1 motion-reduce:transition-none"
        >
          →
        </span>
      </span>
      {desc ? <span className="text-[14.5px] leading-normal text-oj-ink-2">{desc}</span> : null}
    </a>
  );
}

export interface ProofCardProps {
  value: React.ReactNode;
  label: React.ReactNode;
  /** Baseline, period, or honest qualifier. Not optional in practice. */
  context?: React.ReactNode;
  area?: React.ReactNode;
  tone?: 'paper' | 'ink';
  className?: string;
}

export function ProofCard({
  value,
  label,
  context,
  area,
  tone = 'paper',
  className,
}: ProofCardProps): JSX.Element {
  const dark = tone === 'ink';
  return (
    <Card tone={tone} className={cn('flex flex-col gap-3.5', className)}>
      <Stat value={value} label={label} tone={dark ? 'dark' : 'light'} />
      {context ? (
        <p
          className={cn('m-0 text-sm leading-normal', dark ? 'text-oj-cream/75' : 'text-oj-ink-2')}
        >
          {context}
        </p>
      ) : null}
      {area ? (
        <span>
          <Tag size="sm" variant={dark ? 'orange' : 'outline'} dot={false}>
            {area}
          </Tag>
        </span>
      ) : null}
    </Card>
  );
}

export interface MethodStepProps {
  /** 1 to 4. Rendered zero-padded. */
  index: number;
  /** HEAR. CHALLENGE. BUILD. OPTIMISE. The only ALL CAPS in the system. */
  word: React.ReactNode;
  text: React.ReactNode;
  tone?: 'dark' | 'light';
  active?: boolean;
  className?: string;
}

export function MethodStep({
  index,
  word,
  text,
  tone = 'dark',
  active = false,
  className,
}: MethodStepProps): JSX.Element {
  const dark = tone === 'dark';
  return (
    <div
      className={cn(
        'flex flex-col gap-2.5 border-l-[3px] px-5 py-[18px]',
        active ? 'border-l-oj-orange' : dark ? 'border-l-oj-cream/25' : 'border-l-oj-ink/20',
        className
      )}
    >
      <span className={cn('text-xs font-semibold', dark ? 'text-oj-peach' : 'text-oj-orange-deep')}>
        {String(index).padStart(2, '0')}
      </span>
      <span
        className={cn(
          'font-oj text-[28px] font-black leading-none',
          active ? 'text-oj-orange' : dark ? 'text-oj-cream' : 'text-oj-ink'
        )}
      >
        {word}
      </span>
      <span className={cn('text-sm leading-normal', dark ? 'text-oj-cream/75' : 'text-oj-ink-2')}>
        {text}
      </span>
    </div>
  );
}

export interface QuoteProps {
  children?: React.ReactNode;
  name?: React.ReactNode;
  role?: React.ReactNode;
  tone?: 'light' | 'dark';
  className?: string;
}

export function Quote({
  children,
  name,
  role,
  tone = 'light',
  className,
}: QuoteProps): JSX.Element {
  const dark = tone === 'dark';
  return (
    <figure
      className={cn(
        'm-0 flex flex-col gap-3 border-l-[3px] border-l-oj-orange py-1.5 pl-[22px]',
        className
      )}
    >
      <blockquote
        className={cn(
          'm-0 text-[21px] font-bold leading-tight tracking-[-0.01em]',
          dark ? 'text-oj-cream' : 'text-oj-ink'
        )}
      >
        {children}
      </blockquote>
      {name || role ? (
        <figcaption
          className={cn('text-[12.5px] font-semibold', dark ? 'text-oj-cream/70' : 'text-oj-ink-3')}
        >
          {name}
          {role ? <span> · {role}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
