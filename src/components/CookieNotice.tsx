'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

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
        return;
      }
      setPreferences(parsed);
    } catch {
      // Handle legacy string value
      const analyticsAllowed = stored === 'accepted';
      const payload: ConsentPreferences = {
        analytics: analyticsAllowed,
        timestamp: new Date().toISOString(),
      };
      setPreferences(payload);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
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
    }
    setVisible(false);
  };

  const handleAccept = () => savePreferences(true);
  const handleReject = () => savePreferences(false);

  if (!visible || preferences) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50">
      <div
        className="rounded-lg bg-charcoal text-cream px-4 py-4 shadow-lg space-y-3"
        role="dialog"
        aria-modal="false"
        aria-label="Cookie preferences"
      >
        <p className="text-xs sm:text-sm leading-relaxed">
          We use essential cookies to keep the site running and optional analytics (Google Tag
          Manager & GA4) to understand how people find Orange Jelly. You can accept or reject
          analytics below. Questions?{' '}
          <Link href="/contact" className="underline underline-offset-2">
            Contact us
          </Link>
          .
        </p>

        <div
          id="cookie-details-panel"
          className={`rounded-md bg-white/10 p-3 text-xs space-y-2 ${showDetails ? 'block' : 'hidden'}`}
        >
          <div>
            <p className="font-semibold">Essential (always on)</p>
            <p className="text-cream/80">
              Keeps navigation, forms, and security working. Served directly by Next.js—no third
              parties.
            </p>
          </div>
          <div>
            <p className="font-semibold">Analytics (optional)</p>
            <p className="text-cream/80">
              Google Tag Manager + GA4 events. Loaded only after you tap “Accept analytics”.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleReject}
            className="inline-flex items-center justify-center rounded-md border border-white/40 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
          >
            Reject analytics
          </button>
          <button
            type="button"
            onClick={handleAccept}
            className="inline-flex items-center justify-center rounded-md bg-orange px-3 py-2 text-xs font-semibold text-white hover:bg-orange-dark transition-colors"
          >
            Accept analytics
          </button>
          <button
            type="button"
            onClick={() => setShowDetails((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-md bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-colors"
            aria-expanded={showDetails}
            aria-controls="cookie-details-panel"
          >
            {showDetails ? 'Hide details' : 'Manage settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
