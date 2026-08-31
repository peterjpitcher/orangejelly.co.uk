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
    path: '/guides',
    disposition: 'live',
    sitemap: true,
    priority: 0.8,
    changeFrequency: 'weekly',
    lastModified: LAST_CONTENT_SWEEP,
    note: 'Was /licensees-guide until 31 Aug 2026. Renamed on Peter\'s instruction because "licensee" is hospitality-only language and the section is meant to read as small business. The old path and every article under it redirect permanently and must never stop: seven of those URLs are printed on QR codes. It carries 900 of the site\'s 978 annual clicks, which is why the redirects matter more here than anywhere else on the site.',
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
    path: '/why-revenue-is-falling',
    disposition: 'live',
    sitemap: true,
    priority: 0.75,
    changeFrequency: 'monthly',
    lastModified: LAST_CONTENT_SWEEP,
    note: 'Was /pub-rescue, then briefly /small-business-rescue, neither of which shipped. De-sectored because the six causes behave the same way outside hospitality, and reframed away from rescue because the page is about finding the cause, not about insolvency.',
  },
  {
    path: '/pub-rescue',
    disposition: 'redirect',
    destination: '/why-revenue-is-falling',
    note: 'Renamed, not retired. It was the strongest of the pub pages at 6 clicks and 519 impressions a year, which is little enough that the rename costs almost nothing and enough that it earns a permanent redirect rather than a 410. The query "pub rescue" itself earned none of those clicks.',
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
    disposition: 'live',
    sitemap: true,
    priority: 0.85,
    changeFrequency: 'monthly',
    lastModified: '2026-08-28',
    note: 'Hub. Eight symptom-shaped problems, each tagged with the areas it touches.',
  },
  /*
   * Eight, not the homepage's six. The six are AREAS (where growth gets stuck) and
   * the eight are SYMPTOMS (how it presents). Six map one to one; the other two are
   * "growth has stalled", which is the umbrella people arrive with, and "using AI
   * intelligently", which the keyword research found is the strongest entry cluster
   * the company has.
   *
   * Individual slugs are generated from GROWTH_PROBLEMS, so the sitemap adds them
   * from the data rather than from this dynamic path.
   */
  {
    path: '/growth-problems/[slug]',
    disposition: 'live',
    sitemap: false,
  },
  {
    path: '/sectors/professional-services',
    disposition: 'live',
    sitemap: true,
    priority: 0.8,
    changeFrequency: 'monthly',
    lastModified: '2026-08-28',
    note: 'The primary target sector. Translates the six areas into firm language, and says plainly that there is no sector case study yet.',
  },
  {
    path: '/insights',
    disposition: 'live',
    sitemap: true,
    priority: 0.8,
    changeFrequency: 'weekly',
    lastModified: '2026-08-28',
    note: 'The second collection. Separate from the 105 hospitality guides by a front-matter discriminant, not by path.',
  },
  { path: '/insights/[slug]', disposition: 'live', sitemap: false },
  {
    path: '/fractional-cmo',
    disposition: 'live',
    sitemap: true,
    priority: 0.75,
    changeFrequency: 'monthly',
    lastModified: '2026-08-28',
    note: 'Uses the category language to be found, then argues against the format. Four fractional terms in the 500 tier, one at competition index 12, and the pack never mentions the category.',
  },
  {
    path: '/tools/ai-readiness',
    disposition: 'live',
    sitemap: true,
    priority: 0.75,
    changeFrequency: 'monthly',
    lastModified: '2026-08-28',
    note: 'Assessment. Real search demand for the term, and it prepares somebody for the first conversation.',
  },
  {
    path: '/solutions',
    disposition: 'live',
    sitemap: true,
    priority: 0.8,
    changeFrequency: 'monthly',
    lastModified: '2026-08-28',
    note: 'What a fix can be made of. Built ahead of its place in the plan because the phase 4 table redirects /capabilities here, so the release could not ship without it.',
  },
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
    note: 'Retired guide, previously 410. Repointed to /why-revenue-is-falling in phase 4 when /fix-my-pub retires.',
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
    destination: '/guides/pub-wages-labour-costs-guide',
    note: 'Slug rename that never got a redirect.',
  },
  {
    path: '/licensees-guide/beat-chain-pubs',
    disposition: 'redirect',
    destination: '/guides/compete-with-wetherspoons',
  },
  {
    path: '/licensees-guide/local-pub-marketing',
    disposition: 'redirect',
    destination: '/pub-marketing',
  },
  {
    path: '/licensees-guide/fill-empty-seats-midweek-offers',
    disposition: 'redirect',
    destination: '/guides/fill-empty-pub-tables',
  },
  {
    path: '/licensees-guide/crisis-pr-landlords-bad-reviews',
    disposition: 'redirect',
    destination: '/guides/terrible-online-reviews-damage-control',
  },
  {
    path: '/licensees-guide/fizz-street-food-pop-up',
    disposition: 'redirect',
    destination: '/guides/pop-up-events-for-pubs',
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

  /*
   * The guide rename, 31 August 2026. /licensees-guide became /guides.
   *
   * THESE THREE MUST NEVER BE REMOVED. Seven article URLs under the old prefix are
   * printed on QR codes distributed to licensees through Greene King, and a printed
   * code cannot be reissued. `src/test/printed-urls.test.ts` names them and fails if
   * any of them stops resolving. The section also carries 900 of the site's 978 annual
   * clicks, so the redirects protect nearly all of the search traffic the company has.
   *
   * DECLARATION ORDER IS LOAD-BEARING. `getRedirectsForPhases` emits in array order and
   * Next matches first-wins, so the six exact old-slug rules above must stay above this
   * wildcard. Four of those slugs have no article behind them: if the wildcard matched
   * first it would rewrite the prefix and land them on a 404 under the new name, which
   * is a worse outcome than not renaming at all. Moving either block past the other
   * breaks it silently.
   *
   * The category rule is separate rather than covered by :slug because a single :slug
   * segment does not match /category/<name>, which is two.
   */
  {
    path: '/licensees-guide',
    disposition: 'redirect',
    destination: '/guides',
    note: 'The section index. Linked from an already-sent Greene King email.',
  },
  {
    path: '/licensees-guide/category/:category',
    disposition: 'redirect',
    destination: '/guides/category/:category',
    note: 'Declared before the article wildcard: /category/x is two segments and :slug is one, so this would never be reached otherwise.',
  },
  {
    path: '/licensees-guide/:slug',
    disposition: 'redirect',
    destination: '/guides/:slug',
    note: 'All 104 articles, including the seven printed on QR codes. Permanent, and permanent means permanent.',
  },
];

/**
 * Phase 4 redirects. Declared, tested, and NOT emitted until the launch coherence
 * release. Total click exposure across all of them is 2 clicks a year.
 *
 * @type {RouteEntry[]}
 */
const PHASE_4_REDIRECTS = [
  {
    path: '/fix-my-pub',
    disposition: 'redirect',
    destination: '/why-revenue-is-falling',
    phase: 'phase4',
  },
  {
    path: '/licensees-guide/cash-flow-crisis-breaking-cycle',
    disposition: 'redirect',
    destination: '/why-revenue-is-falling',
    phase: 'phase4',
    note: 'Repointed from /fix-my-pub so the chain never forms.',
  },
  {
    path: '/empty-pub-solutions',
    disposition: 'redirect',
    destination: '/why-revenue-is-falling',
    phase: 'phase4',
  },
  {
    path: '/quiet-midweek-solutions',
    disposition: 'redirect',
    destination: '/why-revenue-is-falling',
    phase: 'phase4',
  },
  {
    path: '/compete-with-pub-chains',
    disposition: 'redirect',
    destination: '/guides/compete-with-wetherspoons',
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
  /*
   * These two are already redirects today, pointing at the social hub, which itself
   * retires below. The wildcard underneath was written believing it superseded them.
   * It does not: `bySource` is keyed by the literal path, so the exact entries and
   * the wildcard are different keys and Next emits both. The exact ones come from
   * ROUTES, which is first in ALL_ENTRIES, so they match first and the hop stands.
   *
   * Declaring them here, at the same key and later in the array, is what actually
   * makes the "later declaration wins" rule apply to them.
   *
   * The chain test could not see this either, because it compared sources as plain
   * strings and skipped wildcards entirely. It understands patterns now.
   */
  {
    path: '/services/instagram-services-for-pubs',
    disposition: 'redirect',
    destination: '/pub-marketing',
    phase: 'phase4',
    note: 'Was pointing at the social hub, which retires. Straight to the destination.',
  },
  {
    path: '/services/facebook-services-for-pubs',
    disposition: 'redirect',
    destination: '/pub-marketing',
    phase: 'phase4',
    note: 'Was pointing at the social hub, which retires. Straight to the destination.',
  },
  {
    path: '/services/:slug',
    disposition: 'redirect',
    destination: '/pub-marketing',
    phase: 'phase4',
    note: 'Retires all five children, including the three that still publish a price. The two that currently hop through the social hub are declared explicitly above, because a wildcard does not supersede an exact source.',
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
      '/guides/autumn-pub-event-ideas?utm_source=greene-king&utm_medium=print-toolkit&utm_campaign=autumn-2026',
  },
  {
    source: '/christmas',
    destination:
      '/guides/christmas-pub-event-ideas?utm_source=greene-king&utm_medium=print-toolkit&utm_campaign=christmas-2026',
  },
  {
    source: '/summer',
    destination:
      '/guides/summer-pub-marketing?utm_source=bii&utm_medium=print-magazine&utm_campaign=summer-2026',
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
  /*
   * A source may be declared twice: once for today and once for the phase that
   * supersedes it. `/services` points at `/ways-to-work` now and at `/how-we-work`
   * in phase 4, because `/ways-to-work` itself retires.
   *
   * The later declaration wins. Emitting both would leave Next matching whichever
   * came first in the array, which is the older one, and the result is a chain:
   * /services to /ways-to-work to /how-we-work. Google follows it, but it dilutes
   * the signal and it is invisible in review because both lines look correct on
   * their own.
   */
  return getRedirectsForPhases(ACTIVE_PHASES);
}

/**
 * The redirect table for a given set of phases.
 *
 * Exported so the release can be checked before it happens. The test that proves
 * phase 4 is safe calls this with ['active', 'phase4'] rather than rebuilding the
 * merge itself, because a test that reimplements the rule can only ever agree with
 * its own version of it.
 *
 * @param {string[]} phases
 */
function getRedirectsForPhases(phases) {
  const bySource = new Map();
  for (const entry of ALL_ENTRIES) {
    if (entry.disposition !== 'redirect') continue;
    if (!phases.includes(entry.phase || 'active')) continue;
    bySource.set(entry.path, entry);
  }

  const routed = [...bySource.values()].map((r) => ({
    source: r.path,
    destination: /** @type {string} */ (r.destination),
    permanent: true,
  }));
  return [...routed, ...CAMPAIGN_REDIRECTS.map((c) => ({ ...c, permanent: false }))];
}

/**
 * Paths that must never appear in the sitemap.
 *
 * Anything that redirects TODAY, anything that is deleted, and anything DECLARED to
 * redirect in a future phase.
 *
 * That last one is the important part. It used to be scoped to the active phase, so
 * on the day phase 4 shipped the sitemap would have advertised eight URLs that had
 * become 308s an hour earlier. Dropping them now costs nothing: they are still
 * crawlable and still linked, and they are being consolidated anyway.
 */
function getNonIndexablePaths() {
  return ALL_ENTRIES.filter((r) => r.disposition === 'redirect' || r.disposition === 'deleted').map(
    (r) => r.path
  );
}

/** Live routes marked for the sitemap, in declaration order. */
function getSitemapRoutes() {
  const blocked = new Set(getNonIndexablePaths());
  return ROUTES.filter((r) => r.disposition === 'live' && r.sitemap && !blocked.has(r.path));
}

/** Guide slugs that redirect, so the sitemap never advertises them. */
function getRedirectedGuideSlugs() {
  /*
   * Both prefixes, deliberately.
   *
   * This exists to stop the sitemap advertising an article URL that redirects. The
   * sitemap builds those URLs from the markdown files under the CURRENT prefix, while
   * the redirect sources are still declared under the OLD one, because the old paths
   * are what people linked and printed.
   *
   * Reading only one prefix breaks it in whichever direction you pick, and it breaks
   * silently: the function returns an empty array, every filter downstream passes, and
   * the sitemap starts advertising redirecting URLs with nothing to say so. That is
   * exactly what happened during the rename, and no test caught it, because the sitemap
   * test only checks the static route list.
   *
   * Matching on the slug across both names is what makes it survive a rename. The slug
   * is the part that does not move.
   */
  const prefixes = ['/licensees-guide/', '/guides/'];
  const slugs = new Set();

  for (const nonIndexable of getNonIndexablePaths()) {
    if (nonIndexable.includes(':')) continue;
    for (const prefix of prefixes) {
      if (nonIndexable.startsWith(prefix)) slugs.add(nonIndexable.slice(prefix.length));
    }
  }

  return [...slugs];
}

module.exports = {
  getRedirectsForPhases,
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
