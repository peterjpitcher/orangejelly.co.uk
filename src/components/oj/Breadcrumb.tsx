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
}

export function Breadcrumb({ items = [], className, ...rest }: BreadcrumbProps): JSX.Element {
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
                  className="text-oj-ink-3 no-underline hover:text-oj-orange-deep"
                >
                  {item.label}
                </a>
              ) : (
                <span aria-current={last ? 'page' : undefined} className="text-oj-ink">
                  {item.label}
                </span>
              )}
              {!last ? (
                <span aria-hidden="true" className="font-normal text-oj-orange">
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
