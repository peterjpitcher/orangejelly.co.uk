import type { Metadata } from 'next';

/**
 * Segment boundary for every availability-poll route.
 *
 * It exists for two reasons, and the first was found by running the app rather
 * than by a passing test.
 *
 * 1. **`not-found.tsx` needs a layout to be a boundary.** Without this file,
 *    `notFound()` thrown in `p/[token]/page.tsx` bubbled past
 *    `availability/not-found.tsx` to the root one, and a participant with a dead
 *    link got the marketing 404 ("Oops! This Page Got Lost") instead of the
 *    considered "This link isn't live" page. The status was correct throughout;
 *    only the words were wrong, which is exactly the kind of defect a test suite
 *    reports as green.
 *
 * 2. **noindex.** Poll URLs carry a bearer token in the path. A secret URL must
 *    not depend on a crawler's goodwill or on nobody ever pasting a link
 *    somewhere public. The root metadata is indexable, so without this every
 *    poll would inherit it.
 */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function AvailabilityLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  /*
   * The only thing this adds to its children is the page ground.
   *
   * The marketing chrome is already gated off these routes in MarketingChrome and
   * GoogleTagManager; re-implementing that here would give the same rule two homes
   * and let them drift. The surface is different: `<body>` still paints the legacy
   * background, so every organiser and participant screen under here sat on it and
   * the ink-bordered blocks had nothing of their own to sit on. Declaring it once
   * at the segment boundary is what stops four screens each picking their own.
   *
   * Paper, matching /admin, because the organiser moves between the two through
   * AuthedNav and a change of page colour on the way would read as a change of app.
   * Raised blocks are cream against it.
   */
  return <div className="min-h-screen bg-oj-paper text-oj-ink">{children}</div>;
}
