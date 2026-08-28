import * as React from 'react';

import { cn } from '@/lib/utils';

import { Anchor } from './Anchor';

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
   * On the orange band the muted link grey measures 1.49:1, which is not a near
   * miss, it is invisible. The band is now the deeper orange carrying white text,
   * so links there are white and underlined to stay distinguishable from the
   * current-page item, which is also white.
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
                <Anchor
                  href={item.href}
                  className={cn(
                    onOrange
                      ? 'text-oj-on-band underline decoration-oj-on-band/50 underline-offset-2 hover:decoration-oj-on-band'
                      : 'text-oj-ink-3 no-underline hover:text-oj-orange-deep'
                  )}
                >
                  {item.label}
                </Anchor>
              ) : (
                <span aria-current={last ? 'page' : undefined} className="text-oj-ink">
                  {item.label}
                </span>
              )}
              {!last ? (
                <span
                  aria-hidden="true"
                  className={cn('font-normal', onOrange ? 'text-oj-on-band/70' : 'text-oj-orange')}
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
