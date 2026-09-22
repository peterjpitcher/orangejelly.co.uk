'use client';

import { usePathname } from 'next/navigation';

import { openCookieSettings } from '@/components/CookieNotice';
import { cn } from '@/lib/utils';
import { isScriptFreeRoute } from '@/lib/token-routes';

interface CookieSettingsButtonProps {
  className?: string;
}

/**
 * "Cookie settings" in the footer: reopens the consent panel so a stored choice
 * can be changed, which the privacy notice promises you can do at any time.
 *
 * A button, not a link, because it goes nowhere. It is hidden on the routes where
 * the consent panel never mounts (see MarketingChrome), so it can never be a
 * control that does nothing.
 */
export function CookieSettingsButton({ className }: CookieSettingsButtonProps): JSX.Element | null {
  const pathname = usePathname();
  if (isScriptFreeRoute(pathname)) return null;

  return (
    <button
      type="button"
      onClick={openCookieSettings}
      className={cn('cursor-pointer self-start border-0 bg-transparent p-0 text-left', className)}
    >
      Cookie settings
    </button>
  );
}

export default CookieSettingsButton;
