'use client';

import { usePathname } from 'next/navigation';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import PerformanceMonitor from '@/components/PerformanceMonitor';
import CookieNotice from '@/components/CookieNotice';
import { isPollRoute } from '@/lib/token-routes';
import StickyEngagementBar from './StickyEngagementBar';
import ExitIntentModal from './ExitIntentModal';
import MobileScrollPrompt from './MobileScrollPrompt';

/**
 * Every analytics and marketing component that the root layout used to render
 * unconditionally, now gated on the pathname.
 *
 * WHY THIS EXISTS — it is a credential leak, not a tidiness measure.
 * Poll URLs carry a bearer token in the path (/availability/o/<token>). Vercel
 * Analytics and GTM both report the raw path, so before this gate existed,
 * opening a poll handed that poll's own access token to Google and to Vercel, and
 * anyone with analytics access could then act as the poll's organiser.
 * Referrer-Policy does NOT help: this JavaScript reads window.location directly.
 *
 * The marketing overlays are dropped on the same routes for their own sake too —
 * an exit-intent modal over someone's ballot is a bug regardless of the leak.
 *
 * These are collected into one component rather than guarded one-by-one so that
 * the root layout has a single place where third-party script loading happens,
 * and so the gate is provable in one assertion (see MarketingChrome.test.tsx).
 * The root layout is a server component and cannot call usePathname itself, which
 * is why this boundary is a client component.
 *
 * GTM is gated separately, inside GoogleTagManager.tsx: it must stay at the top of
 * <body> for its beforeInteractive consent defaults to run in the right order, so
 * it cannot be folded in here.
 */
export default function MarketingChrome(): React.ReactElement | null {
  const pathname = usePathname();

  // Fail closed for the leak: anything under /availability gets nothing. The
  // predicate is shared with middleware so the two cannot drift apart.
  if (isPollRoute(pathname)) {
    return null;
  }

  return (
    <>
      <PerformanceMonitor />
      <CookieNotice />
      <StickyEngagementBar />
      <ExitIntentModal />
      <MobileScrollPrompt />
      <Analytics />
      <SpeedInsights />
    </>
  );
}
