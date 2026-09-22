import OptimizedImage from '@/components/OptimizedImage';

/**
 * The public site's loading screen.
 *
 * It used to be `src/app/loading.tsx`, at the app root. It moved on 22 September
 * 2026 because a `loading.tsx` is a Suspense boundary, and Next 14 sends the 200
 * headers as soon as everything outside a Suspense boundary is ready. Anything
 * under the root one could never answer a real 404: dead poll links, unknown
 * surveys and unknown insights all returned 200. It is now re-exported by the
 * `loading.tsx` of each public page that renders on request (`/contact`,
 * `/start-here` and the `/insights` list), which is the only place it ever showed:
 * static pages arrive complete, so it never appeared on them.
 *
 * DO NOT put a `loading.tsx` back at the app root, or above any route that calls
 * `notFound()`. `src/test/loading-boundaries.test.ts` fails if you do.
 *
 * It covers the viewport rather than sitting in the layout's content slot, because
 * a route segment's `loading.tsx` is swapped in before that route's own header
 * exists. Anything less than a full cover would show a headerless strip of page
 * while the real one arrives.
 *
 * Restyled onto the repositioned system, 31 August 2026. It was the last screen
 * carrying the old surface colour and, more visibly, a blurred orange glow behind
 * the logo. This system has no blur: depth is a hard offset shadow with no spread,
 * so the mark now sits in a bordered block casting `shadow-press`. The behaviour,
 * the copy and the image are unchanged.
 */
export default function SiteLoadingScreen(): JSX.Element {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-oj-paper">
      <div className="text-center">
        <div className="inline-block animate-pulse rounded-oj border-1.5 border-oj-ink bg-oj-cream p-5 shadow-press">
          <OptimizedImage
            src="/logo.png"
            alt="Orange Jelly"
            width={100}
            height={100}
            className="block"
            priority
          />
        </div>

        <p className="mt-8 animate-fade-in font-bold text-oj-ink">Loading Orange Jelly...</p>

        {/* Loading dots */}
        <div className="mt-4 flex justify-center gap-2">
          <div className="animation-delay-0 h-2 w-2 animate-bounce rounded-full bg-oj-orange-deep"></div>
          <div className="animation-delay-150 h-2 w-2 animate-bounce rounded-full bg-oj-orange-deep"></div>
          <div className="animation-delay-300 h-2 w-2 animate-bounce rounded-full bg-oj-orange-deep"></div>
        </div>
      </div>
    </div>
  );
}
