import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Inner-page trail. The last item is the current page: unlinked, ink, and marked
 * aria-current so it is announced as the destination rather than another option.
 *
 * The arrows are decorative and hidden. A screen reader reading "Insights right
 * arrow Quiz night ideas" is worse than reading the two labels in order.
 */
export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  /** In order from root. Omit `href` on the last item. */
  items?: Array<{ label: string; href?: string }>;
  /**
   * The surface underneath.
   *
   * On the orange campaign hero the muted link grey measures 1.49:1, which is not
   * a near miss, it is invisible. Orange is a dark-enough surface that ink is the
   * only readable choice, so links there are ink and are underlined to stay
   * distinguishable from the current-page item, which is also ink.
   */
  tone?: 'light' | 'orange';
}

export function Breadcrumb({
  items = [],
  tone = 'light',
  className,
  ...rest
}: BreadcrumbProps): JSX.Element {
  const onOrange = tone === 'orange';
  return (
    <nav aria-label="Breadcrumb" className={cn(className)} {...rest}>
      <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0 text-[13.5px] font-semibold">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-2">
              {item.href && !last ? (
                <a
                  href={item.href}
                  className={cn(
                    onOrange
                      ? 'text-oj-ink underline decoration-oj-ink/40 underline-offset-2 hover:decoration-oj-ink'
                      : 'text-oj-ink-3 no-underline hover:text-oj-orange-deep'
                  )}
                >
                  {item.label}
                </a>
              ) : (
                <span aria-current={last ? 'page' : undefined} className="text-oj-ink">
                  {item.label}
                </span>
              )}
              {!last ? (
                <span
                  aria-hidden="true"
                  className={cn('font-normal', onOrange ? 'text-oj-ink/70' : 'text-oj-orange')}
                >
                  →
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
