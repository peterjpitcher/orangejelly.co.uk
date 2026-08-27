import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Ink site footer: brand and tagline, link columns, legal bar.
 *
 * "Orange Jelly Limited", never "Ltd". The signature line on the right is part of
 * the positioning rather than decoration: it is the last thing a reader sees and it
 * says what the company is not.
 */
export interface FooterColumn {
  title: string;
  links: Array<{ label: string; href: string }>;
}

export interface FooterProps {
  /** Pass the white reversed mark. Defaults to the type wordmark. */
  logo?: React.ReactNode;
  tagline?: React.ReactNode;
  columns?: FooterColumn[];
  legal?: React.ReactNode;
  note?: React.ReactNode;
  /** Extra brand-block content, for example an availability Tag. */
  children?: React.ReactNode;
  className?: string;
}

export function Footer({
  logo,
  tagline = 'You bring the growth problem. We build the solution.',
  columns = [],
  legal,
  note = 'AI is part of the toolkit, not the product.',
  children,
  className,
}: FooterProps): JSX.Element {
  const brand = logo ?? (
    <span className="font-oj text-[22px] font-black tracking-[-0.02em]">
      orange <span className="text-oj-orange">jelly</span>
    </span>
  );

  return (
    <footer className={cn('bg-oj-ink pb-[30px] pt-16 text-oj-cream', className)}>
      <div className="mx-auto max-w-[1160px] px-8">
        <div className="flex flex-wrap items-start justify-between gap-16">
          <div className="flex max-w-[300px] flex-col gap-3.5">
            {brand}
            {tagline ? (
              <p className="m-0 text-[15.5px] font-bold leading-normal text-oj-cream/85">
                {tagline}
              </p>
            ) : null}
            {children}
          </div>

          <div className="flex flex-wrap gap-14">
            {columns.map((column) => (
              <div key={column.title} className="flex min-w-[120px] flex-col gap-2.5">
                <span className="mb-0.5 text-xs font-bold uppercase tracking-[0.14em] text-oj-peach">
                  {column.title}
                </span>
                {column.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-[14.5px] font-medium text-oj-cream/75 no-underline hover:text-oj-orange"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-[52px] flex flex-wrap justify-between gap-4 border-t border-oj-cream/20 pt-5 text-[13px] text-oj-cream/55">
          <span>{legal ?? `© ${new Date().getFullYear()} Orange Jelly Limited`}</span>
          <span>{note}</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
