# Footer credit: "Built and maintained by Orange Jelly"

Every site Orange Jelly builds and maintains carries one line in its footer that links back here. The wording and the destinations are owned by this repo, so one edit changes every footer.

## How it works

1. `src/lib/client-credits.ts` holds the line (prefix, link text, nofollow) and one destination per site. It is the only place to change them.
2. `src/app/api/credit/[site]/route.ts` publishes each site's resolved line as static JSON at `https://www.orangejelly.co.uk/api/credit/<site>`, rebuilt on every release of this site.
3. Each site fetches its own entry on the server, caches it for 24 hours, and renders it in its footer. If the feed is unreachable, slow (over 3 seconds), malformed, or links anywhere except `https://www.orangejelly.co.uk`, the site renders its built-in fallback line instead, linking to the home page.

A change here reaches every site within a day of this site's release, or straight away when a site next deploys. No site needs a code change.

## The feed

`GET https://www.orangejelly.co.uk/api/credit/the-anchor`

```json
{
  "prefix": "Built and maintained by",
  "label": "Orange Jelly",
  "href": "https://www.orangejelly.co.uk/solutions/hospitality-websites",
  "nofollow": false
}
```

An unknown id answers 404, so a consumer with a typo shows its fallback rather than someone else's link.

## Sites

| Id | Site | Repo | Where the line renders |
|---|---|---|---|
| `the-anchor` | www.the-anchor.pub | OJ-The-Anchor.pub | `components/layout/Footer.tsx`, bottom row |
| `dukes-head` | www.dukesheadleatherhead.com | DUKESHEAD-Leatherhead.com | `src/components/layout/Footer.tsx`, bottom row |
| `sea-and-seeds` | www.seaandseeds.co.uk | DUKESHEAD-seaandseeds.co.uk | `src/components/chrome/Footer.tsx`, bottom row |
| `ase-associates` | www.aseassociates.co.uk | OJ-ASE | `src/components/layout/footer.tsx`, bottom row |
| `cheers` | cheers.orangejelly.co.uk | OJ-CheersAI2.0 | `src/features/marketing/site-footer.tsx`, bottom row |
| `management-tools` | management.orangejelly.co.uk | OJ-AnchorManagementTools | sign-in pages (`src/app/auth/layout.tsx`) |

Search value, so nobody overstates it: the first four are separate domains, so each is one referring domain for orangejelly.co.uk. Cheers and the management tools sit on subdomains of this site, so they add brand attribution, not backlinks, and the management tools send `noindex, nofollow`, so they pass nothing to search at all.

## Rules

- **Brand name only in the link text.** Google's spam policies list keyword-rich links in widely distributed footers as link spam. "Orange Jelly" is fine; a service phrase is not.
- **No tracking parameters.** GA4 already reports these visits as referrals from each site, and a tagged URL is a duplicate of the page it points at.
- **Destinations must be live, indexable pages.** `src/lib/client-credits.test.ts` checks each one against the route manifest's sitemap routes, so retiring a page fails the test instead of stranding a credit.
- **Client sites need the client's agreement.** If a client would rather the link carried no ranking credit, set `nofollow: true` in that site's `overrides`.

## Changing the line

- Wording or `nofollow` for every site: edit `DEFAULT_LINE` in `src/lib/client-credits.ts`.
- One site's destination: edit its `path`. It must be a live sitemap route.
- One site's wording: add `overrides` to its entry.

Release this site. Each footer follows within 24 hours.

## Adding a site

1. Add an entry to `SITES` in `src/lib/client-credits.ts` and update the list in `client-credits.test.ts`. Release this site first, so the feed exists before the site asks for it.
2. In the new site, copy the two files below, set `ORANGE_JELLY_CREDIT_SITE`, and render `<OrangeJellyCredit />` in the footer's bottom row, styled with that site's own tokens. It is an async Server Component: a client footer takes it as a prop from the server layout that renders it.
3. Copy the tests from any existing site (the Dukes Head repo has the full set): feed answers, feed fails, feed times out, foreign or non-HTTPS link rejected, nofollow honoured.
4. Add the site to the table above.

### `src/lib/orange-jelly-credit.ts`

```ts
/**
 * The "Built and maintained by Orange Jelly" footer line.
 *
 * orangejelly.co.uk owns the wording and the link (src/lib/client-credits.ts in that
 * repo) and publishes them per site. This reads that feed on the server and caches it
 * for a day, so a change there reaches this footer without a release here.
 *
 * It never fails the page. If the feed is unreachable, slow, malformed, or links
 * anywhere except orangejelly.co.uk, the footer shows FALLBACK_CREDIT, so the line
 * cannot disappear and the feed can never place a foreign link on this site.
 *
 * Reference copy: docs/credit/README.md in the orangejelly.co.uk repo.
 */

export const ORANGE_JELLY_CREDIT_SITE = 'the-anchor';

const ALLOWED_ORIGIN = 'https://www.orangejelly.co.uk';
const FEED_URL = `${ALLOWED_ORIGIN}/api/credit/${ORANGE_JELLY_CREDIT_SITE}`;
const REVALIDATE_SECONDS = 60 * 60 * 24;
const TIMEOUT_MS = 3000;
const MAX_TEXT_LENGTH = 80;

export interface OrangeJellyCreditContent {
  /** Text before the link. May be empty. */
  prefix: string;
  label: string;
  href: string;
  rel?: 'nofollow';
}

export const FALLBACK_CREDIT: OrangeJellyCreditContent = {
  prefix: 'Built and maintained by',
  label: 'Orange Jelly',
  href: `${ALLOWED_ORIGIN}/`,
};

/** The feed's answer as renderable content, or null when it is anything unexpected. */
export function parseOrangeJellyCredit(data: unknown): OrangeJellyCreditContent | null {
  if (!data || typeof data !== 'object') return null;
  const { prefix, label, href, nofollow } = data as Record<string, unknown>;

  if (typeof prefix !== 'string' || prefix.length > MAX_TEXT_LENGTH) return null;
  if (typeof label !== 'string' || !label.trim() || label.length > MAX_TEXT_LENGTH) return null;
  if (typeof href !== 'string') return null;

  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  if (url.origin !== ALLOWED_ORIGIN || url.username || url.password) return null;

  return {
    prefix: prefix.trim(),
    label: label.trim(),
    href: url.toString(),
    ...(nofollow === true ? { rel: 'nofollow' as const } : {}),
  };
}

export async function getOrangeJellyCredit(): Promise<OrangeJellyCreditContent> {
  try {
    const response = await fetch(FEED_URL, {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) throw new Error(`feed answered ${response.status}`);

    const credit = parseOrangeJellyCredit(await response.json());
    if (!credit) throw new Error('feed answered with an unexpected shape');
    return credit;
  } catch (error) {
    // Next.js signals dynamic rendering and redirects by throwing errors that carry a
    // digest. Those are not feed failures and must reach the framework.
    if (error && typeof error === 'object' && 'digest' in error) throw error;
    console.warn('[orange-jelly-credit] showing the fallback line:', error);
    return FALLBACK_CREDIT;
  }
}
```

### `src/components/OrangeJellyCredit.tsx`

```tsx
import type { ReactElement } from 'react';

import { getOrangeJellyCredit, type OrangeJellyCreditContent } from '@/lib/orange-jelly-credit';

interface OrangeJellyCreditStyleProps {
  className?: string;
  linkClassName?: string;
}

interface OrangeJellyCreditLineProps extends OrangeJellyCreditStyleProps {
  credit: OrangeJellyCreditContent;
}

/** The line itself. Separate from the fetch so it can be tested without a network. */
export function OrangeJellyCreditLine({
  credit,
  className,
  linkClassName,
}: OrangeJellyCreditLineProps): ReactElement {
  return (
    <p className={className}>
      {credit.prefix ? `${credit.prefix} ` : null}
      <a href={credit.href} rel={credit.rel} className={linkClassName}>
        {credit.label}
      </a>
    </p>
  );
}

/** Async Server Component: reads the feed (cached for a day) and renders the line. */
export async function OrangeJellyCredit(props: OrangeJellyCreditStyleProps): Promise<ReactElement> {
  const credit = await getOrangeJellyCredit();
  return <OrangeJellyCreditLine credit={credit} {...props} />;
}
```
