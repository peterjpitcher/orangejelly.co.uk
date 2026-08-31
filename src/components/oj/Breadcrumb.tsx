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
   *
   * `ink` was added on 31 August 2026 when eighteen page heroes moved onto the ink
   * ground. It exists because it was already being done without it: every one of
   * those call sites had grown its own `[&_a]:text-oj-cream/85` style override, in
   * two different flavours, so the separator was peach on fifteen pages and cream on
   * three. That is the drift the tone prop is here to prevent.
   *
   * Ink takes the same shape as the band: the link is light and underlined, the
   * current page is light and not underlined, and the separator is peach. Measured
   * against ink: cream/85 at 10.50:1, cream at 14.02:1, peach at 11.03:1, all clear
   * of the 4.5:1 that 13.5px text needs.
   */
  tone?: 'light' | 'orange' | 'ink';
}

export function Breadcrumb({
  items = [],
  tone = 'light',
  className,
  ...rest
}: BreadcrumbProps): JSX.Element {
  const onOrange = tone === 'orange';
  const onDark = onOrange || tone === 'ink';
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
                    tone === 'ink' &&
                      'text-oj-cream/85 underline decoration-oj-cream/45 underline-offset-2 hover:text-oj-cream',
                    onOrange &&
                      'text-oj-on-band underline decoration-oj-on-band/50 underline-offset-2 hover:decoration-oj-on-band',
                    !onDark && 'text-oj-ink-3 no-underline hover:text-oj-orange-deep'
                  )}
                >
                  {item.label}
                </Anchor>
              ) : (
                <span
                  aria-current={last ? 'page' : undefined}
                  /*
                   * On the band this has to be the band's own text colour. It was
                   * ink, which against the brand orange was fine and against the
                   * deeper band is 2.92:1, under the 4.5:1 that 13.5px text needs.
                   * The current page is already distinguished from the others by
                   * being the only item without an underline, so nothing is lost by
                   * dropping the colour difference here.
                   */
                  className={cn(
                    tone === 'ink' && 'text-oj-cream',
                    onOrange && 'text-oj-on-band',
                    !onDark && 'text-oj-ink'
                  )}
                >
                  {item.label}
                </span>
              )}
              {!last ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    'font-normal',
                    tone === 'ink' && 'text-oj-peach',
                    onOrange && 'text-oj-on-band/80',
                    !onDark && 'text-oj-orange-deep'
                  )}
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
