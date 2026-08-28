'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Editorial components for the insights and article templates.
 *
 * FAQ uses real <details> elements rather than a JavaScript accordion. They open
 * without JavaScript, they are findable by browser in-page search when closed in
 * Chrome, and they carry the disclosure semantics for free. The reference builds a
 * button-and-panel accordion, which is more code for less behaviour.
 */
export interface FAQProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: ReadonlyArray<{ readonly q: React.ReactNode; readonly a: React.ReactNode }>;
  openFirst?: boolean;
}

export function FAQ({ items = [], openFirst = false, className, ...rest }: FAQProps): JSX.Element {
  return (
    <div className={cn('border-t-1.5 border-oj-ink', className)} {...rest}>
      {items.map((item, index) => (
        <details
          key={index}
          open={openFirst && index === 0}
          className="group/faq border-b-1.5 border-oj-ink"
        >
          <summary className="flex min-h-tap cursor-pointer list-none items-center justify-between gap-4 py-4 font-oj text-[17px] font-bold text-oj-ink marker:hidden [&::-webkit-details-marker]:hidden">
            {item.q}
            <span
              aria-hidden="true"
              className="shrink-0 text-xl font-normal text-oj-orange-deep group-open/faq:hidden"
            >
              +
            </span>
            <span
              aria-hidden="true"
              className="hidden shrink-0 text-xl font-normal text-oj-orange-deep group-open/faq:block"
            >
              ×
            </span>
          </summary>
          <div className="pb-5 text-[15px] leading-relaxed text-oj-ink-2">{item.a}</div>
        </details>
      ))}
    </div>
  );
}

export interface TocProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Omitted above: the native `title` is a tooltip string, this is a heading node. */
  title?: React.ReactNode;
  items?: Array<{ label: React.ReactNode; href: string; level?: 2 | 3 }>;
  /** href of the section in view. */
  current?: string;
}

export function Toc({
  title = 'On this page',
  items = [],
  current,
  className,
  ...rest
}: TocProps): JSX.Element {
  return (
    <nav aria-label="On this page" className={cn('flex flex-col gap-2', className)} {...rest}>
      <p className="oj-eyebrow m-0">{title}</p>
      <ul className="m-0 flex list-none flex-col gap-1 p-0">
        {items.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              aria-current={current === item.href ? 'location' : undefined}
              className={cn(
                'block border-l-2 py-1 text-sm no-underline',
                item.level === 3 ? 'pl-5' : 'pl-3',
                current === item.href
                  ? 'border-l-oj-orange font-semibold text-oj-ink'
                  : 'border-l-oj-ink/15 text-oj-ink-2 hover:text-oj-orange-deep'
              )}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export type CategoryId =
  | 'demand'
  | 'conversion'
  | 'margin'
  | 'operations'
  | 'experience'
  | 'scale'
  | 'hospitality';

/**
 * Seven muted hues, and a category is never orange: orange is the action signal, so
 * a category wearing it would compete with every call to action on the page.
 *
 * Static class strings on purpose. Tailwind cannot see a constructed class name like
 * `bg-cat-${id}`, so it would emit nothing and the tag would render unstyled.
 */
const CATEGORY: Record<CategoryId, { label: string; text: string; tint: string }> = {
  demand: { label: 'Create demand', text: 'text-cat-demand', tint: 'bg-cat-demand-soft' },
  conversion: { label: 'Convert more', text: 'text-cat-convert', tint: 'bg-cat-convert-soft' },
  margin: { label: 'Protect margin', text: 'text-cat-margin', tint: 'bg-cat-margin-soft' },
  operations: { label: 'Remove operational drag', text: 'text-cat-ops', tint: 'bg-cat-ops-soft' },
  experience: {
    label: 'Improve experience',
    text: 'text-cat-experience',
    tint: 'bg-cat-experience-soft',
  },
  scale: { label: 'Build for scale', text: 'text-cat-scale', tint: 'bg-cat-scale-soft' },
  hospitality: {
    label: 'Hospitality',
    text: 'text-cat-hospitality',
    tint: 'bg-cat-hospitality-soft',
  },
};

export interface CategoryTagProps {
  category?: CategoryId;
  href?: string;
  filled?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export function CategoryTag({
  category = 'demand',
  href,
  filled = false,
  children,
  className,
}: CategoryTagProps): JSX.Element {
  const config = CATEGORY[category];
  const classes = cn(
    'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold no-underline',
    config.text,
    filled ? config.tint : 'bg-oj-paper border border-current/25',
    className
  );
  const label = children ?? config.label;

  return href ? (
    <a href={href} className={classes}>
      {label}
    </a>
  ) : (
    <span className={classes}>{label}</span>
  );
}

export interface ArticleCardProps {
  category?: React.ReactNode;
  title: React.ReactNode;
  excerpt?: React.ReactNode;
  date?: React.ReactNode;
  readTime?: React.ReactNode;
  href?: string;
  tone?: 'paper' | 'ink';
  className?: string;
}

export function ArticleCard({
  category,
  title,
  excerpt,
  date,
  readTime,
  href = '#',
  tone = 'paper',
  className,
}: ArticleCardProps): JSX.Element {
  const dark = tone === 'ink';
  return (
    <a
      href={href}
      className={cn(
        'flex flex-col gap-3 border-1.5 border-oj-ink rounded-oj p-5 no-underline oj-press oj-focus',
        dark ? 'bg-oj-ink text-oj-cream' : 'bg-oj-paper text-oj-ink',
        className
      )}
    >
      {category ? <span>{category}</span> : null}
      <span className="font-oj text-[19px] font-black leading-tight tracking-[-0.01em]">
        {title}
      </span>
      {excerpt ? (
        <span
          className={cn(
            'text-[14.5px] leading-normal',
            dark ? 'text-oj-cream/75' : 'text-oj-ink-2'
          )}
        >
          {excerpt}
        </span>
      ) : null}
      {date || readTime ? (
        <span className={cn('text-xs font-semibold', dark ? 'text-oj-cream/60' : 'text-oj-ink-3')}>
          {date}
          {date && readTime ? ' · ' : null}
          {readTime}
        </span>
      ) : null}
    </a>
  );
}

export interface PaginationProps {
  page?: number;
  total?: number;
  /** Prefer this: real links keep the listing crawlable. */
  hrefFor?: (n: number) => string;
  onPage?: (n: number) => void;
  label?: string;
}

/** Collapse to first, last, current and neighbours once past seven pages. */
function pageWindow(page: number, total: number): Array<number | 'gap'> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const out: Array<number | 'gap'> = [1];
  const from = Math.max(2, page - 1);
  const to = Math.min(total - 1, page + 1);
  if (from > 2) out.push('gap');
  for (let n = from; n <= to; n += 1) out.push(n);
  if (to < total - 1) out.push('gap');
  out.push(total);
  return out;
}

export function Pagination({
  page = 1,
  total = 1,
  hrefFor,
  onPage,
  label = 'Pagination',
}: PaginationProps): JSX.Element {
  const items = pageWindow(page, total);

  return (
    <nav aria-label={label}>
      <ul className="m-0 flex list-none flex-wrap items-center gap-1.5 p-0">
        {items.map((item, index) =>
          item === 'gap' ? (
            <li key={`gap-${index}`} aria-hidden="true" className="px-2 text-oj-ink-3">
              …
            </li>
          ) : (
            <li key={item}>
              {hrefFor ? (
                <a
                  href={hrefFor(item)}
                  aria-current={item === page ? 'page' : undefined}
                  aria-label={`Page ${item}`}
                  className={cn(
                    'inline-flex min-h-tap min-w-tap items-center justify-center rounded-oj border-1.5 border-oj-ink px-3 text-sm font-bold no-underline',
                    item === page ? 'bg-oj-orange text-oj-ink' : 'bg-oj-paper text-oj-ink'
                  )}
                >
                  {item}
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => onPage?.(item)}
                  aria-current={item === page ? 'page' : undefined}
                  aria-label={`Page ${item}`}
                  className={cn(
                    'inline-flex min-h-tap min-w-tap items-center justify-center rounded-oj border-1.5 border-oj-ink px-3 text-sm font-bold',
                    item === page ? 'bg-oj-orange text-oj-ink' : 'bg-oj-paper text-oj-ink'
                  )}
                >
                  {item}
                </button>
              )}
            </li>
          )
        )}
      </ul>
    </nav>
  );
}

export interface TabsProps {
  items?: Array<{ label: string; content?: React.ReactNode }>;
  active?: number;
  onChange?: (i: number) => void;
  renderPanel?: boolean;
}

/** In-page content switching only. Never primary navigation. */
export function Tabs({ items = [], active, onChange, renderPanel = true }: TabsProps): JSX.Element {
  const [internal, setInternal] = React.useState(0);
  const current = active ?? internal;
  const baseId = React.useId();

  const select = (index: number) => {
    if (active === undefined) setInternal(index);
    onChange?.(index);
  };

  // Arrow keys move between tabs, which is what the tablist pattern requires and
  // what a row of plain buttons does not give you.
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    const delta = event.key === 'ArrowRight' ? 1 : -1;
    select((current + delta + items.length) % items.length);
  };

  return (
    <div>
      <div
        role="tablist"
        onKeyDown={onKeyDown}
        className="flex flex-wrap gap-1 border-b-1.5 border-oj-ink"
      >
        {items.map((item, index) => (
          <button
            key={item.label}
            type="button"
            role="tab"
            id={`${baseId}-tab-${index}`}
            aria-selected={index === current}
            aria-controls={`${baseId}-panel-${index}`}
            tabIndex={index === current ? 0 : -1}
            onClick={() => select(index)}
            className={cn(
              'min-h-tap px-4 text-[15px] font-bold',
              index === current
                ? 'text-oj-ink shadow-[inset_0_-3px_0_var(--oj-orange)]'
                : 'text-oj-ink-3 hover:text-oj-ink'
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      {renderPanel && items[current] ? (
        <div
          role="tabpanel"
          id={`${baseId}-panel-${current}`}
          aria-labelledby={`${baseId}-tab-${current}`}
          tabIndex={0}
          className="pt-5"
        >
          {items[current].content}
        </div>
      ) : null}
    </div>
  );
}

export interface NextStepLink {
  /** Chain stage: "The problem", "The proof", "Next step". */
  stage: string;
  title: string;
  desc?: string;
  href: string;
}

export interface NextStepProps {
  from?: 'article' | 'problem' | 'case';
  heading?: string;
  /** One or two. More dilutes the chain. */
  links?: NextStepLink[];
  className?: string;
}

const NEXT_HEADING = {
  article: 'Where this leads',
  problem: 'See it work',
  case: 'Your move',
} as const;

/**
 * The designed conversion chain: article, then problem page, then case study, then
 * offer. One component so the chain survives 105 posts rather than becoming
 * ad-hoc links that rot.
 */
export function NextStep({
  from = 'article',
  heading,
  links = [],
  className,
}: NextStepProps): JSX.Element {
  return (
    <aside className={cn('border-t-1.5 border-oj-ink pt-6', className)}>
      <p className="oj-eyebrow m-0">{heading ?? NEXT_HEADING[from]}</p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {links.slice(0, 2).map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="flex flex-col gap-1 border-1.5 border-oj-ink rounded-oj bg-oj-paper p-4 no-underline oj-press oj-focus"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-oj-orange-deep">
              {link.stage}
            </span>
            <span className="font-oj text-[17px] font-black text-oj-ink">{link.title}</span>
            {link.desc ? (
              <span className="text-sm leading-normal text-oj-ink-2">{link.desc}</span>
            ) : null}
          </a>
        ))}
      </div>
    </aside>
  );
}
