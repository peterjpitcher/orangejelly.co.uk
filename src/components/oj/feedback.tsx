'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

import { Anchor } from './Anchor';

/**
 * Feedback surfaces.
 *
 * Modal gets a real focus trap, which the reference does not have. A dialog that
 * lets tab wander onto the page behind it is a dialog only for mouse users.
 */
export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  tone?: 'info' | 'ok' | 'danger';
  /** Omitted from the HTML attributes above: the native `title` is a tooltip string, this is a heading node. */
  title?: React.ReactNode;
  children?: React.ReactNode;
  /** Shows a dismiss control when provided. */
  onClose?: () => void;
}

const ALERT_RULE = {
  info: 'border-l-oj-orange',
  ok: 'border-l-oj-ok',
  danger: 'border-l-oj-danger',
} as const;

const ALERT_TITLE = {
  info: 'text-oj-ink',
  ok: 'text-oj-ok',
  danger: 'text-oj-danger',
} as const;

export function Alert({
  tone = 'info',
  title,
  children,
  onClose,
  className,
  ...rest
}: AlertProps): JSX.Element {
  return (
    <div
      // Errors and successes both need announcing; an info note does not interrupt.
      role={tone === 'danger' ? 'alert' : 'status'}
      className={cn(
        'flex items-start gap-3 border-1.5 border-l-[6px] border-oj-ink rounded-oj bg-oj-paper p-4',
        ALERT_RULE[tone],
        className
      )}
      {...rest}
    >
      <div className="flex-1 text-[15px] leading-normal text-oj-ink">
        {title ? <p className={cn('m-0 font-bold', ALERT_TITLE[tone])}>{title}</p> : null}
        {children ? <div className={cn(title && 'mt-1')}>{children}</div> : null}
      </div>
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          className="min-h-tap shrink-0 px-2 text-xl leading-none text-oj-ink-3 hover:text-oj-ink"
        >
          <span aria-hidden="true">×</span>
          <span className="sr-only">Dismiss</span>
        </button>
      ) : null}
    </div>
  );
}

export interface ModalProps {
  open: boolean;
  onClose?: () => void;
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  actions?: React.ReactNode;
  width?: number;
  children?: React.ReactNode;
}

export function Modal({
  open,
  onClose,
  eyebrow,
  title,
  actions,
  width = 520,
  children,
}: ModalProps): JSX.Element | null {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const titleId = React.useId();

  React.useEffect(() => {
    if (!open) return undefined;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose?.();
        return;
      }
      if (event.key !== 'Tab') return;

      // Focus trap. Without it, tab walks out of the dialog and onto the page
      // behind the scrim, which makes this a dialog for mouse users only.
      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-oj-ink/70 p-6"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        style={{ maxWidth: width }}
        onClick={(event) => event.stopPropagation()}
        className="w-full border-1.5 border-oj-ink rounded-oj bg-oj-paper p-7 shadow-press outline-none"
      >
        {eyebrow ? <p className="oj-eyebrow m-0">{eyebrow}</p> : null}
        {title ? (
          <h2 id={titleId} className="oj-display mt-2 font-oj text-[28px] text-oj-ink">
            {title}
          </h2>
        ) : null}
        {children ? (
          <div className="mt-3 text-[15px] leading-normal text-oj-ink-2">{children}</div>
        ) : null}
        {actions ? <div className="mt-6 flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </div>
  );
}

export interface EmptyStateProps {
  glyph?: string;
  title?: string;
  body?: React.ReactNode;
  /** Always offer a route out. An empty state without one is a dead end. */
  action?: { label: string; href?: string; onClick?: () => void };
}

export function EmptyState({ glyph = '0', title, body, action }: EmptyStateProps): JSX.Element {
  return (
    <div className="flex flex-col items-center gap-3 border-1.5 border-dashed border-oj-ink/30 rounded-oj bg-oj-cream-2 px-6 py-12 text-center">
      <span
        aria-hidden="true"
        className="flex h-12 w-12 items-center justify-center rounded-full border-1.5 border-oj-ink font-oj text-xl font-black text-oj-ink"
      >
        {glyph}
      </span>
      {title ? <p className="m-0 font-oj text-lg font-bold text-oj-ink">{title}</p> : null}
      {body ? (
        <div className="max-w-md text-[15px] leading-normal text-oj-ink-2">{body}</div>
      ) : null}
      {action ? (
        action.href ? (
          <Anchor
            href={action.href}
            className="min-h-tap inline-flex items-center font-bold text-oj-orange-deep underline underline-offset-4"
          >
            {action.label}
          </Anchor>
        ) : (
          <button
            type="button"
            onClick={action.onClick}
            className="min-h-tap font-bold text-oj-orange-deep underline underline-offset-4"
          >
            {action.label}
          </button>
        )
      ) : null}
    </div>
  );
}

export interface SkeletonProps {
  variant?: 'text' | 'card' | 'article';
  lines?: number;
  width?: number | string;
}

/** Sunken tone rather than grey on white, so it belongs to this palette. */
function Bar({ w = '100%' }: { w?: number | string }): JSX.Element {
  return (
    <span className="block h-3.5 animate-pulse rounded-sm bg-oj-cream-2" style={{ width: w }} />
  );
}

export function Skeleton({ variant = 'text', lines = 3, width }: SkeletonProps): JSX.Element {
  // aria-hidden plus a live status: a screen reader is told "loading" once rather
  // than being read a wall of placeholder boxes.
  const shell = (content: React.ReactNode) => (
    <div role="status" aria-label="Loading" style={{ width }}>
      <span className="sr-only">Loading</span>
      <div aria-hidden="true">{content}</div>
    </div>
  );

  if (variant === 'card') {
    return shell(
      <div className="flex flex-col gap-3 border-1.5 border-oj-ink rounded-oj bg-oj-paper p-5">
        <Bar w="35%" />
        <Bar w="85%" />
        <Bar w="65%" />
      </div>
    );
  }

  if (variant === 'article') {
    return shell(
      <div className="flex flex-col gap-4">
        <Bar w="70%" />
        <Bar w="30%" />
        <div className="mt-2 flex flex-col gap-2">
          {Array.from({ length: lines }, (_, i) => (
            <Bar key={i} w={i === lines - 1 ? '55%' : '100%'} />
          ))}
        </div>
      </div>
    );
  }

  return shell(
    <div className="flex flex-col gap-2">
      {Array.from({ length: lines }, (_, i) => (
        <Bar key={i} w={i === lines - 1 ? '60%' : '100%'} />
      ))}
    </div>
  );
}
