/**
 * The route manifest: one place that knows what every public URL is for.
 *
 * Before this file, the same information lived in three places that could disagree
 * and did. next.config.js held redirects, src/app/sitemap.ts held a hand-maintained
 * list of static pages with a hand-maintained set of redirected slugs to exclude, and
 * the repositioning spec held a third description in prose. Counting the redirects by
 * hand produced the wrong number twice, and a sitemap that lists a redirecting URL
 * wastes crawl budget and tells Google the redirect was unintended.
 *
 * CommonJS on purpose. next.config.js is CJS and cannot require a TypeScript module,
 * and a generated file would need a freshness check to stop it drifting. One plain
 * module that both sides read has neither problem. Types come from the JSDoc below and
 * are checked because tsconfig sets allowJs.
 *
 * WHAT THIS FILE DOES NOT DO YET: the repositioning's redirects are declared here with
 * phase 'phase4' and are deliberately NOT emitted. Shipping them early would redirect
 * live pages before their replacements exist, which is exactly the half-launched state
 * the implementation spec forbids. Flipping them on is a one-line change to
 * ACTIVE_PHASES when phase 4 ships.
 *
 * @see tasks/repositioning/IMPLEMENTATION-SPEC.md section 3
 */

/**
 * @typedef {'live'|'redirect'|'planned'|'deleted'} Disposition
 * 'live'     - serves a 200 today
 * 'redirect' - serves a redirect today or in a named future phase
 * 'planned'  - does not exist yet, built during the repositioning
 * 'deleted'  - removed, intentionally 404s
 *
 * @typedef {'active'|'phase4'} Phase
 *
 * @typedef {Object} RouteEntry
 * @property {string} path
 * @property {Disposition} disposition
 * @property {string} [destination]      Redirect target. Required when disposition is 'redirect'.
 * @property {Phase} [phase]             Defaults to 'active'.
 * @property {boolean} [sitemap]         Include in sitemap.xml. Only meaningful when live.
 * @property {number} [priority]
 * @property {'always'|'hourly'|'daily'|'weekly'|'monthly'|'yearly'|'never'} [changeFrequency]
 * @property {string} [lastModified]
 * @property {string} [note]
 */

/** Redirect phases currently emitted into next.config.js. */
const ACTIVE_PHASES = ['active'];

/**
 * Counties consolidated into /pub-marketing on 2026-08-09. Eight near-identical
 * ~630-word templated pages returned 149 impressions and 1 click across 12 months
 * while splitting authority away from /pub-marketing, which earns 847 impressions on
 * its own. Orange Jelly works UK-wide, so county-level doorway pages argued against
 * the positioning as well as underperforming.
 */
const CONSOLIDATED_COUNTIES = [
  'surrey',
  'london',
  'berkshire',
  'buckinghamshire',
  'hampshire',
  'hertfordshire',
  'kent',
  'oxfordshire',
];

const LAST_CONTENT_SWEEP = '2026-08-09';

/** @type {RouteEntry[]} */
const ROUTES = [
  // ---------------------------------------------------------------- live pages
  {
    path: '/',
    disposition: 'live',
    sitemap: true,
    priority: 1.0,
    changeFrequency: 'weekly',
    lastModified: LAST_CONTENT_SWEEP,
  },
  {
    path: '/about',
    disposition: 'live',
    sitemap: true,
    priority: 0.7,
    changeFrequency: 'monthly',
    lastModified: LAST_CONTENT_SWEEP,
  },
  {
    path: '/contact',
    disposition: 'live',
    sitemap: true,
    priority: 0.8,
    changeFrequency: 'monthly',
    lastModified: LAST_CONTENT_SWEEP,
  },
  {
    path: '/results',
    disposition: 'live',
    sitemap: true,
    priority: 0.8,
    changeFrequency: 'monthly',
    lastModified: LAST_CONTENT_SWEEP,
  },
  {
    path: '/licensees-guide',
    disposition: 'live',
    sitemap: true,
    priority: 0.8,
    changeFrequency: 'weekly',
    lastModified: LAST_CONTENT_SWEEP,
    note: 'Becomes the hospitality sector hub. Path does not change: it carries 897 of the site’s 969 annual clicks.',
  },

  // ways-to-work becomes /how-we-work in phase 4. Live and in the sitemap until then.
  {
    path: '/ways-to-work',
    disposition: 'live',
    sitemap: true,
    priority: 0.9,
    changeFrequency: 'weekly',
    lastModified: LAST_CONTENT_SWEEP,
  },
  {
    path: '/ways-to-work/growth-fix',
    disposition: 'live',
    sitemap: true,
    priority: 0.85,
    changeFrequency: 'monthly',
    lastModified: LAST_CONTENT_SWEEP,
  },
  {
    path: '/ways-to-work/momentum-month',
    disposition: 'live',
    sitemap: true,
    priority: 0.85,
    changeFrequency: 'monthly',
    lastModified: LAST_CONTENT_SWEEP,
  },
  {
    path: '/ways-to-work/growth-partner',
    disposition: 'live',
    sitemap: true,
    priority: 0.85,
    changeFrequency: 'monthly',
    lastModified: LAST_CONTENT_SWEEP,
  },
  {
    path: '/ways-to-work/turnaround-intensive',
    disposition: 'live',
    sitemap: true,
    priority: 0.85,
    changeFrequency: 'monthly',
    lastModified: LAST_CONTENT_SWEEP,
  },
  {
    path: '/capabilities',
    disposition: 'live',
    sitemap: true,
    priority: 0.85,
    changeFrequency: 'monthly',
    lastModified: LAST_CONTENT_SWEEP,
  },

  // Hospitality landing pages. All keep their URLs; most are consolidated in phase 4.
  {
    path: '/pub-marketing',
    disposition: 'live',
    sitemap: true,
    priority: 0.85,
    changeFrequency: 'weekly',
    lastModified: LAST_CONTENT_SWEEP,
    note: 'Survives as the single hospitality service page and absorbs the /services children.',
  },
  {
    path: '/pub-rescue',
    disposition: 'live',
    sitemap: true,
    priority: 0.75,
    changeFrequency: 'monthly',
    lastModified: LAST_CONTENT_SWEEP,
    note: 'Strongest of the pub pages: 6 clicks, 519 impressions.',
  },
  {
    path: '/fix-my-pub',
    disposition: 'live',
    sitemap: true,
    priority: 0.8,
    changeFrequency: 'monthly',
    lastModified: LAST_CONTENT_SWEEP,
  },
  {
    path: '/quiet-midweek-solutions',
    disposition: 'live',
    sitemap: true,
    priority: 0.75,
    changeFrequency: 'monthly',
    lastModified: LAST_CONTENT_SWEEP,
  },
  {
    path: '/empty-pub-solutions',
    disposition: 'live',
    sitemap: true,
    priority: 0.75,
    changeFrequency: 'monthly',
    lastModified: LAST_CONTENT_SWEEP,
  },
  {
    path: '/pub-marketing-no-budget',
    disposition: 'live',
    sitemap: true,
    priority: 0.7,
    changeFrequency: 'monthly',
    lastModified: LAST_CONTENT_SWEEP,
  },
  {
    path: '/compete-with-pub-chains',
    disposition: 'live',
    sitemap: true,
    priority: 0.7,
    changeFrequency: 'monthly',
    lastModified: LAST_CONTENT_SWEEP,
  },
  {
    path: '/pub-marketing-agency',
    disposition: 'live',
    sitemap: true,
    priority: 0.8,
    changeFrequency: 'monthly',
    lastModified: LAST_CONTENT_SWEEP,
  },

  // Service pages that render their own self-canonical content.
  {
    path: '/services/social-media-marketing-for-pubs',
    disposition: 'live',
    sitemap: true,
    priority: 0.75,
    changeFrequency: 'monthly',
    lastModified: LAST_CONTENT_SWEEP,
  },
  {
    path: '/services/paid-social-for-pubs',
    disposition: 'live',
    sitemap: true,
    priority: 0.75,
    changeFrequency: 'monthly',
    lastModified: LAST_CONTENT_SWEEP,
  },
  {
    path: '/services/content-creation-for-pubs',
    disposition: 'live',
    sitemap: true,
    priority: 0.75,
    changeFrequency: 'monthly',
    lastModified: LAST_CONTENT_SWEEP,
  },

  // ------------------------------------------------------ repositioning routes
  /*
   * Declared here before they exist so the shape of the finished site is recorded
   * in one place rather than inferred from which files happen to be present. The
   * navigation already links to them, which is correct: phase 4 is an atomic
   * release and nothing here goes live on its own.
   */
  {
    path: '/growth-problems',
    disposition: 'planned',
    note: 'Hub. Six pressure points, each with its own page. Linked from the homepage and the nav.',
  },
  ...[
    'create-demand',
    'convert-more',
    'protect-margin',
    'operational-drag',
    'improve-experience',
    'build-for-scale',
  ].map((slug) => ({
    path: `/growth-problems/${slug}`,
    disposition: /** @type {Disposition} */ ('planned'),
  })),
  {
    path: '/how-we-work',
    disposition: 'live',
    sitemap: true,
    priority: 0.8,
    changeFrequency: 'monthly',
    lastModified: '2026-08-28',
    note: 'HEAR CHALLENGE BUILD OPTIMISE in full.',
  },
  {
    path: '/results/[slug]',
    disposition: 'live',
    sitemap: false,
    note: 'Case studies. Individual slugs are generated, so the sitemap adds them from CASE_STUDIES rather than from this dynamic path. /results and /about already exist and are rebuilt in place, so they stay listed as live above.',
  },
  {
    path: '/start-here',
    disposition: 'live',
    sitemap: true,
    priority: 0.9,
    changeFrequency: 'monthly',
    lastModified: '2026-08-28',
    note: 'The conversion page. Carries the fit language that replaced the price when D3 removed pricing.',
  },

  // Live but deliberately out of the sitemap.
  { path: '/privacy', disposition: 'live', sitemap: false },
  {
    path: '/dev/components',
    disposition: 'live',
    sitemap: false,
    note: 'Component harness. Dynamic so notFound() returns a real 404 in production rather than a soft one. Never indexed.',
  },
  {
    path: '/admin',
    disposition: 'live',
    sitemap: false,
    note: 'Authed. Out of scope for the repositioning.',
  },
  {
    path: '/availability',
    disposition: 'live',
    sitemap: false,
    note: 'Separate poll product. Out of scope. Token routes must never receive third-party scripts.',
  },

  // ------------------------------------------------------------ active redirects
  {
    path: '/services',
    disposition: 'redirect',
    destination: '/ways-to-work',
    note: 'Already a redirect, not a page, despite 1,199 impressions at position 24.',
  },
  ...CONSOLIDATED_COUNTIES.map((county) => ({
    path: `/pub-marketing-${county}`,
    disposition: /** @type {Disposition} */ ('redirect'),
    destination: '/pub-marketing',
  })),
  {
    path: '/licensees-guide/cash-flow-crisis-breaking-cycle',
    disposition: 'redirect',
    destination: '/fix-my-pub',
    note: 'Retired guide, previously 410. Repointed to /pub-rescue in phase 4 when /fix-my-pub retires.',
  },
  {
    path: '/services/instagram-services-for-pubs',
    disposition: 'redirect',
    destination: '/services/social-media-marketing-for-pubs',
  },
  {
    path: '/services/facebook-services-for-pubs',
    disposition: 'redirect',
    destination: '/services/social-media-marketing-for-pubs',
  },
  {
    path: '/licensees-guide/pub-wages-labour-costs-uk',
    disposition: 'redirect',
    destination: '/licensees-guide/pub-wages-labour-costs-guide',
    note: 'Slug rename that never got a redirect.',
  },
  {
    path: '/licensees-guide/beat-chain-pubs',
    disposition: 'redirect',
    destination: '/licensees-guide/compete-with-wetherspoons',
  },
  {
    path: '/licensees-guide/local-pub-marketing',
    disposition: 'redirect',
    destination: '/pub-marketing',
  },
  {
    path: '/licensees-guide/fill-empty-seats-midweek-offers',
    disposition: 'redirect',
    destination: '/licensees-guide/fill-empty-pub-tables',
  },
  {
    path: '/licensees-guide/crisis-pr-landlords-bad-reviews',
    disposition: 'redirect',
    destination: '/licensees-guide/terrible-online-reviews-damage-control',
  },
  {
    path: '/licensees-guide/fizz-street-food-pop-up',
    disposition: 'redirect',
    destination: '/licensees-guide/pop-up-events-for-pubs',
  },

  // ------------------------------------------------------------------- deleted
  {
    path: '/test-shadcn',
    disposition: 'deleted',
    note: 'Development artefact. Removed 27 Aug 2026.',
  },
  {
    path: '/about-demo',
    disposition: 'deleted',
    note: 'Leftover route.ts handler, indexed at 22 impressions. Removed 27 Aug 2026.',
  },
];

/**
 * Phase 4 redirects. Declared, tested, and NOT emitted until the launch coherence
 * release. Total click exposure across all of them is 2 clicks a year.
 *
 * @type {RouteEntry[]}
 */
const PHASE_4_REDIRECTS = [
  { path: '/fix-my-pub', disposition: 'redirect', destination: '/pub-rescue', phase: 'phase4' },
  {
    path: '/licensees-guide/cash-flow-crisis-breaking-cycle',
    disposition: 'redirect',
    destination: '/pub-rescue',
    phase: 'phase4',
    note: 'Repointed from /fix-my-pub so the chain never forms.',
  },
  {
    path: '/empty-pub-solutions',
    disposition: 'redirect',
    destination: '/pub-rescue',
    phase: 'phase4',
  },
  {
    path: '/quiet-midweek-solutions',
    disposition: 'redirect',
    destination: '/pub-rescue',
    phase: 'phase4',
  },
  {
    path: '/compete-with-pub-chains',
    disposition: 'redirect',
    destination: '/licensees-guide/compete-with-wetherspoons',
    phase: 'phase4',
    note: 'That post earns 16 clicks on 1,262 impressions.',
  },
  {
    path: '/pub-marketing-agency',
    disposition: 'redirect',
    destination: '/pub-marketing',
    phase: 'phase4',
  },
  {
    path: '/pub-marketing-no-budget',
    disposition: 'redirect',
    destination: '/pub-marketing',
    phase: 'phase4',
  },
  {
    path: '/services/:slug',
    disposition: 'redirect',
    destination: '/pub-marketing',
    phase: 'phase4',
    note: 'Covers all five children, including the two that currently point at the social hub. Repointed to avoid a three-hop chain.',
  },
  {
    path: '/services',
    disposition: 'redirect',
    destination: '/how-we-work',
    phase: 'phase4',
    note: 'Repointed from /ways-to-work, which itself retires.',
  },
  { path: '/capabilities', disposition: 'redirect', destination: '/solutions', phase: 'phase4' },
  {
    path: '/ways-to-work',
    disposition: 'redirect',
    destination: '/how-we-work',
    phase: 'phase4',
    note: '835 impressions. Redirect, never delete.',
  },
  {
    path: '/ways-to-work/:slug',
    disposition: 'redirect',
    destination: '/how-we-work',
    phase: 'phase4',
  },
];

/**
 * Campaign redirects. Print and partner tracking, annual ownership, deliberately kept
 * separate because they carry UTM query strings and point at protected posts.
 *
 * These are TEMPORARY (307), not permanent, and must stay that way. They are seasonal
 * and repoint each year, so a permanent redirect would tell Google a mapping is final
 * when it is not, and the wrong target would stick.
 */
const CAMPAIGN_REDIRECTS = [
  {
    source: '/autumn',
    destination:
      '/licensees-guide/autumn-pub-event-ideas?utm_source=greene-king&utm_medium=print-toolkit&utm_campaign=autumn-2026',
  },
  {
    source: '/christmas',
    destination:
      '/licensees-guide/christmas-pub-event-ideas?utm_source=greene-king&utm_medium=print-toolkit&utm_campaign=christmas-2026',
  },
  {
    source: '/summer',
    destination:
      '/licensees-guide/summer-pub-marketing?utm_source=bii&utm_medium=print-magazine&utm_campaign=summer-2026',
  },
];

const ALL_ENTRIES = [...ROUTES, ...PHASE_4_REDIRECTS];

/**
 * Redirects for next.config.js. `permanent: true` emits a 308 in Next 14, which
 * Google treats as equivalent to a 301 for consolidation.
 *
 * @returns {{source: string, destination: string, permanent: boolean}[]}
 */
function getRedirects() {
  const routed = ALL_ENTRIES.filter(
    (r) => r.disposition === 'redirect' && ACTIVE_PHASES.includes(r.phase || 'active')
  ).map((r) => ({
    source: r.path,
    destination: /** @type {string} */ (r.destination),
    permanent: true,
  }));
  return [...routed, ...CAMPAIGN_REDIRECTS.map((c) => ({ ...c, permanent: false }))];
}

/** Paths that must never appear in the sitemap because they do not serve a 200. */
function getNonIndexablePaths() {
  return ALL_ENTRIES.filter(
    (r) =>
      (r.disposition === 'redirect' && ACTIVE_PHASES.includes(r.phase || 'active')) ||
      r.disposition === 'deleted'
  ).map((r) => r.path);
}

/** Live routes marked for the sitemap, in declaration order. */
function getSitemapRoutes() {
  const blocked = new Set(getNonIndexablePaths());
  return ROUTES.filter((r) => r.disposition === 'live' && r.sitemap && !blocked.has(r.path));
}

/** Guide slugs that redirect, so the sitemap never advertises them. */
function getRedirectedGuideSlugs() {
  const prefix = '/licensees-guide/';
  return getNonIndexablePaths()
    .filter((p) => p.startsWith(prefix) && !p.includes(':'))
    .map((p) => p.slice(prefix.length));
}

module.exports = {
  ROUTES,
  PHASE_4_REDIRECTS,
  CAMPAIGN_REDIRECTS,
  ALL_ENTRIES,
  ACTIVE_PHASES,
  getRedirects,
  getNonIndexablePaths,
  getSitemapRoutes,
  getRedirectedGuideSlugs,
};
