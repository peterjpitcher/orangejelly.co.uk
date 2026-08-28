'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

import { Anchor } from './Anchor';

import { Button } from './Button';

/**
 * Conversion and consent surfaces.
 *
 * CookieNotice is the one place the analytics decision becomes visible to a
 * visitor, so accept and decline carry equal weight: same size, same prominence,
 * no dark pattern. That is not politeness, it is what makes consent valid.
 */
export interface StickyCTAProps {
  note?: React.ReactNode;
  label?: string;
  href?: string;
  onClick?: () => void;
  /** Scroll depth in px before it appears. 0 shows immediately. */
  showAfter?: number;
  dismissible?: boolean;
  className?: string;
}

export function StickyCTA({
  note = 'Growth stuck? Tell us what is happening.',
  label = 'Bring us the problem',
  href = '/start-here',
  onClick,
  showAfter = 480,
  dismissible = true,
  className,
}: StickyCTAProps): JSX.Element | null {
  const [past, setPast] = React.useState(showAfter === 0);
  const [dismissed, setDismissed] = React.useState(false);

  React.useEffect(() => {
    if (showAfter === 0) return undefined;
    const onScroll = () => setPast(window.scrollY > showAfter);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [showAfter]);

  if (!past || dismissed) return null;

  return (
    <div
      className={cn(
        // The band, not the brand orange, for the same reason as the heroes and the
        // campaign header: white on the brand orange is 2.97:1. On the band it is
        // 5.24:1, and the bar matches the hero it was scrolled away from.
        'fixed inset-x-0 bottom-0 z-[50] border-t-1.5 border-oj-ink bg-oj-band',
        // Sits above the home indicator on iOS rather than under it.
        'pb-[env(safe-area-inset-bottom)]',
        className
      )}
    >
      <div className="mx-auto flex max-w-[1160px] flex-wrap items-center justify-between gap-3 px-8 py-3">
        <p className="m-0 text-[15px] font-bold text-oj-on-band">{note}</p>
        <div className="flex items-center gap-2">
          <Button variant="ink" size="sm" href={href} onClick={onClick} arrow>
            {label}
          </Button>
          {dismissible ? (
            <button
              type="button"
              onClick={() => setDismissed(true)}
              // Full strength, not 70%. At 70% over orange the glyph measured
              // 3.27:1, which is under the 4.5:1 that text needs, and it is the only
              // way to get rid of a bar that covers content on a short screen.
              className="min-h-tap px-2 text-xl leading-none text-oj-on-band hover:text-oj-cream"
            >
              <span aria-hidden="true">×</span>
              <span className="sr-only">Dismiss</span>
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export interface CookieNoticeProps {
  message?: React.ReactNode;
  policyHref?: string;
  onAccept?: () => void;
  onDecline?: () => void;
  storageKey?: string;
  className?: string;
}

export function CookieNotice({
  message = 'We use analytics to understand how people find and use Orange Jelly. Nothing else.',
  policyHref = '/privacy',
  onAccept,
  onDecline,
  storageKey = 'oj-cookies',
  className,
}: CookieNoticeProps): JSX.Element | null {
  const [answered, setAnswered] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    try {
      setAnswered(window.localStorage.getItem(storageKey) !== null);
    } catch {
      // A context without storage still gets asked; it simply cannot remember.
      setAnswered(false);
    }
  }, [storageKey]);

  const answer = (accepted: boolean) => {
    try {
      window.localStorage.setItem(storageKey, accepted ? 'accepted' : 'declined');
    } catch {
      // Ignore: the choice still applies for this page view.
    }
    setAnswered(true);
    (accepted ? onAccept : onDecline)?.();
  };

  // null means not yet read from storage: render nothing rather than flashing a
  // banner at someone who already answered.
  if (answered !== false) return null;

  return (
    <div
      role="region"
      aria-label="Cookie choices"
      className={cn(
        'fixed inset-x-0 bottom-0 z-[80] border-t-1.5 border-oj-cream/20 bg-oj-ink',
        className
      )}
    >
      <div className="mx-auto flex max-w-[1160px] flex-wrap items-center justify-between gap-4 px-8 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <p className="m-0 max-w-2xl text-sm leading-normal text-oj-cream/85">
          {message}{' '}
          <Anchor
            href={policyHref}
            className="font-semibold text-oj-peach underline underline-offset-2"
          >
            How we handle data
          </Anchor>
        </p>
        {/* Equal weight, deliberately. An accept that shouts and a decline that
            whispers is not consent, it is a dark pattern. */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => answer(false)}
            className="!text-oj-cream !border-oj-cream"
          >
            Decline
          </Button>
          <Button size="sm" onClick={() => answer(true)}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}

export interface ShareRowProps {
  url?: string;
  title?: string;
  label?: string;
  networks?: Array<'linkedin' | 'x' | 'facebook' | 'email' | 'copy'>;
  className?: string;
}

const SHARE_LABEL = {
  linkedin: 'LinkedIn',
  x: 'X',
  facebook: 'Facebook',
  email: 'Email',
  copy: 'Copy link',
} as const;

/** Text-label chips rather than brand icon soup: no third-party assets, no guessing. */
export function ShareRow({
  url,
  title = '',
  label = 'Share this',
  networks = ['linkedin', 'x', 'copy'],
  className,
}: ShareRowProps): JSX.Element {
  const [copied, setCopied] = React.useState(false);
  const [href, setHref] = React.useState(url ?? '');

  React.useEffect(() => {
    if (!url && typeof window !== 'undefined') setHref(window.location.href);
  }, [url]);

  const intent = (network: string): string => {
    const u = encodeURIComponent(href);
    const t = encodeURIComponent(title);
    switch (network) {
      case 'linkedin':
        return `https://www.linkedin.com/sharing/share-offsite/?url=${u}`;
      case 'x':
        return `https://x.com/intent/tweet?url=${u}&text=${t}`;
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${u}`;
      case 'email':
        return `mailto:?subject=${t}&body=${u}`;
      default:
        return '#';
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard denied or unavailable: leave the label alone rather than claiming success.
    }
  };

  const chip =
    'inline-flex min-h-tap items-center rounded-oj border-1.5 border-oj-ink bg-oj-paper px-3.5 text-sm font-bold text-oj-ink no-underline';

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <span className="oj-eyebrow">{label}</span>
      {networks.map((network) =>
        network === 'copy' ? (
          <button key={network} type="button" onClick={copy} className={chip}>
            {copied ? 'Link copied' : SHARE_LABEL.copy}
          </button>
        ) : (
          <Anchor
            key={network}
            href={intent(network)}
            target="_blank"
            rel="noopener noreferrer"
            className={chip}
          >
            {SHARE_LABEL[network]}
            <span className="sr-only"> (opens in a new tab)</span>
          </Anchor>
        )
      )}
      {/* Announce the copy result rather than relying on the label change alone. */}
      <span aria-live="polite" className="sr-only">
        {copied ? 'Link copied to clipboard' : ''}
      </span>
    </div>
  );
}
