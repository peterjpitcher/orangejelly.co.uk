'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { getWhatsAppUrl } from './engagement-config';
import { MESSAGES } from '@/lib/constants';

const SESSION_KEY = 'oj-scroll-prompt-shown';

export default function MobileScrollPrompt(): React.ReactElement | null {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Only on blog post pages: /licensees-guide/[slug]
  const isBlogPost = pathname.startsWith('/licensees-guide/') && pathname !== '/licensees-guide/';

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;

    const scrollPercent = scrollTop / docHeight;
    if (scrollPercent >= 0.6) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      setVisible(true);
      // Remove listener after triggering
      window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  useEffect(() => {
    if (!isBlogPost) return;
    if (sessionStorage.getItem(SESSION_KEY) === 'true') return;

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isBlogPost, handleScroll]);

  function handleDismiss(): void {
    setDismissed(true);
  }

  if (!isBlogPost || dismissed || !visible) return null;

  const whatsAppUrl = getWhatsAppUrl(MESSAGES.whatsapp.blog);

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40 p-4 md:hidden',
        'animate-in slide-in-from-bottom duration-300'
      )}
      role="complementary"
      aria-label="Help prompt"
    >
      <div className="rounded-xl bg-white p-4 shadow-lg ring-1 ring-charcoal/10">
        <div className="flex items-start justify-between">
          <p className="pr-3 text-sm font-medium text-charcoal">Need hands-on help with this?</p>
          <button
            type="button"
            onClick={handleDismiss}
            className="shrink-0 text-charcoal/40 transition-colors hover:text-charcoal"
            aria-label="Dismiss prompt"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
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

        <a
          href={whatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.638l4.685-1.228A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.239 0-4.308-.724-5.993-1.953l-.42-.306-2.786.731.748-2.734-.335-.443A9.96 9.96 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
          </svg>
          WhatsApp Peter
        </a>
      </div>
    </div>
  );
}
