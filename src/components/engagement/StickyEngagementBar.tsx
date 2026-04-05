'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { getStickyBarConfig, STICKY_BAR_HIDDEN_PATHS } from './engagement-config';

const DISMISS_KEY = 'oj-sticky-dismissed';

export default function StickyEngagementBar(): React.ReactElement | null {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(true); // Start hidden

  // Check sessionStorage on mount and start delay timer
  useEffect(() => {
    const wasDismissed = sessionStorage.getItem(DISMISS_KEY) === 'true';
    if (wasDismissed) {
      setDismissed(true);
      return;
    }
    setDismissed(false);

    const timer = setTimeout(() => {
      setVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Hide on excluded paths
  const isHiddenPath = STICKY_BAR_HIDDEN_PATHS.some((p) => pathname === p);
  if (isHiddenPath || dismissed) return null;

  const config = getStickyBarConfig(pathname);

  function handleDismiss(): void {
    sessionStorage.setItem(DISMISS_KEY, 'true');
    setDismissed(true);
  }

  const isExternal = config.ctaType === 'whatsapp';

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40 h-12 bg-charcoal text-white transition-transform duration-300',
        visible ? 'translate-y-0' : 'translate-y-full'
      )}
      role="complementary"
      aria-label="Engagement bar"
    >
      <div className="relative mx-auto flex h-full max-w-5xl items-center justify-center gap-4 px-4 pr-12">
        <p className="text-sm text-white/90">{config.message}</p>

        {isExternal ? (
          <a
            href={config.ctaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-full bg-orange px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-orange/90"
          >
            {config.ctaText}
          </a>
        ) : (
          <Link
            href={config.ctaLink}
            className="shrink-0 rounded-full bg-orange px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-orange/90"
          >
            {config.ctaText}
          </Link>
        )}

        <button
          type="button"
          onClick={handleDismiss}
          className="absolute right-4 text-white/60 transition-colors hover:text-white"
          aria-label="Dismiss engagement bar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
