/**
 * The "Built and maintained by Orange Jelly" line in the footer of every site we build.
 *
 * This file is the only place the wording and the destinations live. Each site reads its
 * own entry from `/api/credit/<site>` on the server, keeps it for a day, and falls back to
 * a built-in copy of the default line when this site cannot be reached. One edit here
 * changes every footer within 24 hours, without redeploying any of them.
 * `docs/credit/README.md` has the contract and the code each site carries.
 *
 * Three rules, each for a reason:
 *
 * - The link text is the brand name and nothing else. Google's spam policies list
 *   keyword-rich links in widely distributed footers as link spam, so a service phrase
 *   never goes in `label`.
 * - `href` is always a live, indexable page on the production site, with no tracking
 *   parameters. GA4 already reports these visits as referrals from each site, and a
 *   tagged URL is a duplicate of the page it points at. The test checks every
 *   destination against the route manifest, so retiring a page cannot strand a credit.
 * - `nofollow: true` asks Google to give the link no ranking credit. Set it here, for one
 *   site or all of them, if a client asks for it or Google's stance changes.
 */

/** The consumers only accept links on this origin, so it is fixed, not read from env. */
export const CLIENT_CREDIT_ORIGIN = 'https://www.orangejelly.co.uk';

export interface ClientCredit {
  /** Plain text before the link, without a trailing space. */
  prefix: string;
  /** The link text. The brand name only. */
  label: string;
  /** Absolute URL on CLIENT_CREDIT_ORIGIN. */
  href: string;
  nofollow: boolean;
}

interface SiteCredit {
  /** Path on this site, which must be a live route in src/lib/route-manifest.js. */
  path: string;
  /** Per-site departures from the default line. Leave empty unless there is a reason. */
  overrides?: Partial<Pick<ClientCredit, 'prefix' | 'label' | 'nofollow'>>;
}

const DEFAULT_LINE: Pick<ClientCredit, 'prefix' | 'label' | 'nofollow'> = {
  prefix: 'Built and maintained by',
  label: 'Orange Jelly',
  nofollow: false,
};

/**
 * One entry per site. The key is the id the site asks for, so renaming one breaks that
 * site's feed until it is renamed there too (it shows its fallback line meanwhile).
 */
const SITES = {
  'the-anchor': { path: '/solutions/hospitality-websites' },
  'dukes-head': { path: '/solutions/hospitality-websites' },
  'sea-and-seeds': { path: '/solutions/hospitality-websites' },
  'ase-associates': { path: '/sectors/professional-services' },
  cheers: { path: '/solutions/bespoke-applications' },
  'management-tools': { path: '/solutions/bespoke-applications' },
} satisfies Record<string, SiteCredit>;

export type ClientCreditSite = keyof typeof SITES;

export const CLIENT_CREDIT_SITES = Object.keys(SITES) as ClientCreditSite[];

export function isClientCreditSite(site: string): site is ClientCreditSite {
  return Object.prototype.hasOwnProperty.call(SITES, site);
}

/** The resolved line for one site, or null for an id this file does not know. */
export function getClientCredit(site: string): ClientCredit | null {
  if (!isClientCreditSite(site)) return null;

  const entry: SiteCredit = SITES[site];
  return {
    ...DEFAULT_LINE,
    ...entry.overrides,
    href: `${CLIENT_CREDIT_ORIGIN}${entry.path}`,
  };
}

/** Every site's destination path, for the route manifest test. */
export function getClientCreditPaths(): Array<{ site: ClientCreditSite; path: string }> {
  return CLIENT_CREDIT_SITES.map((site) => ({ site, path: SITES[site].path }));
}
