'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { updateGtagConsent } from '@/components/GoogleTagManager';

const STORAGE_KEY = 'oj-cookie-consent';

interface ConsentPreferences {
  analytics: boolean;
  timestamp: string;
}

export default function CookieNotice() {
  const [visible, setVisible] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setVisible(true);
      return;
    }

    try {
      const parsed: ConsentPreferences | string = JSON.parse(stored);
      if (typeof parsed === 'string') {
        // Legacy string storage (accepted / rejected)
        const legacyPrefs: ConsentPreferences = {
          analytics: parsed === 'accepted',
          timestamp: new Date().toISOString(),
        };
        setPreferences(legacyPrefs);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(legacyPrefs));
        updateGtagConsent(legacyPrefs.analytics);
        return;
      }
      setPreferences(parsed);
      updateGtagConsent(parsed.analytics);
    } catch {
      // Handle legacy string value
      const analyticsAllowed = stored === 'accepted';
      const payload: ConsentPreferences = {
        analytics: analyticsAllowed,
        timestamp: new Date().toISOString(),
      };
      setPreferences(payload);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      updateGtagConsent(analyticsAllowed);
    }
  }, []);

  const savePreferences = (analytics: boolean) => {
    if (typeof window !== 'undefined') {
      const payload: ConsentPreferences = {
        analytics,
        timestamp: new Date().toISOString(),
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      setPreferences(payload);
      // Update Google Consent Mode so GTM tags respond immediately
      updateGtagConsent(analytics);
    }
    setVisible(false);
  };

  const handleAccept = () => savePreferences(true);
  const handleReject = () => savePreferences(false);

  if (!visible || preferences) {
    return null;
  }

  /*
   * The consent panel is on every page, so it was the one piece of old design the
   * repositioning could not hide from and the one nobody looked at. It carried the
   * legacy palette (`bg-brand-base`, `rounded-lg`, soft shadows) beside pages built
   * on ink, 1.5px borders and the press shadow, and its accept button was
   * `bg-orange` with `text-brand-base`, which is dark text on brand orange: exactly
   * the pairing that came off every other button on the site.
   *
   * Restyled here rather than gated behind a route check, because the button rule
   * is not a redesign preference. Dark text on brand orange measures 2.97:1 and
   * fails at any size, on the legacy pages as much as the new ones.
   *
   * Colours follow the same table as `oj/Button`: deep orange fill carries white,
   * and on a dark ground the outline is white so it stays a visible boundary.
   */
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:right-6 sm:max-w-md">
      <div
        className="font-oj space-y-3 rounded-oj border-1.5 border-oj-cream bg-oj-ink px-4 py-4 text-oj-cream shadow-press"
        role="dialog"
        aria-modal="false"
        aria-label="Cookie preferences"
      >
        <p className="text-xs leading-relaxed sm:text-sm">
          We use essential cookies to keep the site running and optional analytics to understand how
          people find and use Orange Jelly. You can accept or reject analytics below. Questions?{' '}
          <Link href="/contact" className="font-semibold underline underline-offset-2">
            Contact us
          </Link>
          .
        </p>

        <div
          id="cookie-details-panel"
          className={`space-y-2 rounded-oj border-1.5 border-oj-cream/35 p-3 text-xs ${showDetails ? 'block' : 'hidden'}`}
        >
          <div>
            <p className="font-bold">Essential (always on)</p>
            <p className="text-oj-cream/80">
              Keeps navigation, forms, and security working. Served directly by Next.js, no third
              parties.
            </p>
          </div>
          <div>
            <p className="font-bold">Analytics (optional)</p>
            <p className="text-oj-cream/80">
              Google Tag Manager, GA4, and first-party conversion events. Runs in cookieless mode
              until you accept.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={() => setShowDetails((prev) => !prev)}
            className="oj-focus inline-flex items-center justify-center rounded-oj px-1 py-2 text-xs font-bold text-oj-cream underline underline-offset-4 transition-colors hover:text-oj-peach sm:mr-auto"
            aria-expanded={showDetails}
            aria-controls="cookie-details-panel"
          >
            {showDetails ? 'Hide details' : 'Manage settings'}
          </button>
          <button
            type="button"
            onClick={handleReject}
            className="oj-focus inline-flex items-center justify-center rounded-oj border-1.5 border-oj-on-band px-3 py-2 text-xs font-bold text-oj-cream transition-colors hover:bg-oj-cream/10"
          >
            Reject analytics
          </button>
          <button
            type="button"
            onClick={handleAccept}
            className="oj-focus inline-flex items-center justify-center rounded-oj border-1.5 border-oj-on-band bg-oj-orange-deep px-3 py-2 text-xs font-bold text-oj-on-band transition-colors hover:bg-oj-ember"
          >
            Accept analytics
          </button>
        </div>
      </div>
    </div>
  );
}
