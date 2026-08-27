import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Evidence treated as a design asset.
 *
 * The brand pack is explicit that numbers get as much space as headlines, because
 * the whole positioning rests on "do not claim to be impactful, show the evidence".
 * A stat rendered at body size undercuts that.
 *
 * The `sub` slot exists for the qualifying sentence: baseline, period, caveat. Use
 * it. Every approved claim has a provenance and a bare percentage without one is
 * exactly the marketing the pack argues against.
 */
export interface StatProps {
  /** The number, for example "403%". */
  value: React.ReactNode;
  /** Short uppercase label under the value. */
  label: React.ReactNode;
  /** Qualifying sentence: baseline, period, caveat. */
  sub?: React.ReactNode;
  /** Match the surface it sits on. */
  tone?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  /** Orange value. Turn off when the stat sits next to a call to action, so the two do not compete for the same signal. */
  accent?: boolean;
  className?: string;
}

const VALUE_SIZE = {
  sm: 'text-[32px]',
  md: 'text-[44px]',
  lg: 'text-[64px]',
} as const;

export function Stat({
  value,
  label,
  sub,
  tone = 'light',
  size = 'md',
  accent = true,
  className,
}: StatProps): JSX.Element {
  const dark = tone === 'dark';

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <span
        className={cn(
          'font-oj font-black leading-none tracking-[-0.02em]',
          VALUE_SIZE[size],
          accent ? 'text-oj-orange' : dark ? 'text-oj-cream' : 'text-oj-ink'
        )}
      >
        {value}
      </span>
      <span
        className={cn(
          'text-xs font-semibold uppercase tracking-[0.08em]',
          dark ? 'text-oj-cream' : 'text-oj-ink'
        )}
      >
        {label}
      </span>
      {sub ? (
        <span
          className={cn(
            'text-[13.5px] leading-snug',
            // On ink the secondary ink shade would disappear, so the dark tone drops
            // the cream back rather than reaching for a mid grey.
            dark ? 'text-oj-cream/70' : 'text-oj-ink-2'
          )}
        >
          {sub}
        </span>
      ) : null}
    </div>
  );
}

export default Stat;
