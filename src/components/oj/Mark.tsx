import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Highlighter showing focus or intervention.
 *
 * Two tones with different mechanics, and the difference matters:
 *
 * `peach` is a solid block with ink text forced on. Safe on any surface because it
 * sets both ground and foreground, so it cannot inherit an unreadable pair.
 *
 * `orange` is a lower-half gradient sweep that inherits the surrounding text colour.
 * The gradient starts at 55% so ascenders and tight display line-height are never
 * covered, which a solid block behind multi-line text would do. This is the one
 * gradient the design system permits: gradients are banned as decoration, and this
 * is a typographic device.
 */
export interface MarkProps {
  tone?: 'peach' | 'orange';
  children?: React.ReactNode;
  className?: string;
}

export function Mark({ tone = 'peach', children, className }: MarkProps): JSX.Element {
  if (tone === 'peach') {
    return <span className={cn('bg-oj-peach px-[0.1em] text-oj-ink', className)}>{children}</span>;
  }

  return (
    <span
      className={cn(
        'px-[0.08em]',
        'bg-[linear-gradient(transparent_55%,var(--oj-orange)_55%,var(--oj-orange)_96%,transparent_96%)]',
        className
      )}
    >
      {children}
    </span>
  );
}

export default Mark;
