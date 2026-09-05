import { cleanup, render } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import GrowthProblemsHubPage from '@/app/growth-problems/page';
import { GROWTH_PROBLEMS } from '@/app/growth-problems/content';
import AboutPage from '@/app/about/page';
import ContactPage from '@/app/contact/page';
import FractionalCmoPage from '@/app/fractional-cmo/page';
import GuidesPage from '@/app/guides/page';
import HowWeWorkPage from '@/app/how-we-work/page';
import InsightsPage from '@/app/insights/page';
import HomePage from '@/app/page';
import PubMarketingPage from '@/app/pub-marketing/page';
import ResultsPage from '@/app/results/page';
import { CASE_STUDIES } from '@/app/results/case-studies';
import ProfessionalServicesPage from '@/app/sectors/professional-services/page';
import sitemap from '@/app/sitemap';
import BespokeApplicationsPage from '@/app/solutions/bespoke-applications/page';
import BookingSystemsPage from '@/app/solutions/booking-systems/page';
import HospitalityWebsitesPage from '@/app/solutions/hospitality-websites/page';
import SolutionsPage from '@/app/solutions/page';
import StartHerePage from '@/app/start-here/page';
import AiReadinessPage from '@/app/tools/ai-readiness/page';
import WhyRevenueIsFallingPage from '@/app/why-revenue-is-falling/page';
import { blogCategories } from '@/lib/blog';
import { getAllPosts } from '@/lib/blog-md';
import { getAllInsights, getInsightBySlug } from '@/lib/insights';
import { markdownToHtml } from '@/lib/markdown/markdown';
import { ROUTES } from '@/lib/route-manifest';
import { getBaseUrl } from '@/lib/site-config';
import type * as ReactDom from 'react-dom';

/**
 * No page the sitemap advertises may be an orphan.
 *
 * On 5 September 2026 `/fractional-cmo` and `/tools/ai-readiness` were both in the
 * sitemap, both served 200, and neither had a single inbound internal link from any
 * of the 145 sitemap pages. Google had never crawled either of them. The sitemap is
 * a hint; internal links are how a page is actually found, and nothing in the repo
 * noticed that two published pages had none.
 *
 * THE RULE. Every path in the sitemap must have at least one inbound link from a
 * different page, and must be reachable from `/` by following links. Reachability is
 * the half that matters: two pages linking only to each other satisfy the first rule
 * and are still invisible.
 *
 * THE LIMITATION, stated so nobody mistakes what this proves. Edges come from two
 * places: the rendered live non-dynamic pages listed in `RENDERED`, and the markdown
 * body of every insight and guide. Dynamic detail pages are not rendered, so a page
 * whose only inbound link is a template link on `/guides/[slug]` or
 * `/results/[slug]` would be reported here as an orphan even though it is linked in
 * production. The fix in that case is to add the template to `RENDERED` as a source,
 * never to add the page to an exclusion list.
 *
 * It is offline and deterministic on purpose: no network, no reading `.next`, no
 * shelling out. It runs in the same second as the rest of the suite and cannot pass
 * because a fetch quietly failed.
 */
vi.mock('@/lib/tracking', () => ({
  trackClientEvent: vi.fn(),
  hasAnalyticsConsent: () => false,
}));

vi.mock('react-dom', async () => {
  const actual = await vi.importActual<typeof ReactDom>('react-dom');
  return {
    ...actual,
    useFormStatus: () => ({ pending: false }),
    useFormState: () => [{ step: 1 }, vi.fn()],
  };
});

/*
 * `/guides` awaits `draftMode()`, which needs the request store jsdom does not have.
 * Draft mode off is the published view, which is the graph the crawler sees.
 */
vi.mock('next/headers', () => ({
  draftMode: () => ({ isEnabled: false }),
}));

interface Edge {
  from: string;
  to: string;
}

/**
 * An internal path, or null for anything that is not one.
 *
 * Only same-origin absolute paths are edges. The fragment and the query go, because
 * `/start-here?situation=x` and `/start-here` are one page, and a trailing slash goes
 * with them because this site sets `trailingSlash: false`.
 */
function normalise(href: string): string | null {
  if (!href.startsWith('/')) return null;
  const path = href.split('#')[0].split('?')[0];
  if (path === '/') return '/';
  return path.replace(/\/$/, '') || '/';
}

/** Every path reachable from `root` by following edges, breadth first. */
function reachableFrom(root: string, edges: Edge[]): Set<string> {
  const out = new Map<string, string[]>();
  for (const edge of edges) {
    const list = out.get(edge.from);
    if (list) list.push(edge.to);
    else out.set(edge.from, [edge.to]);
  }

  const seen = new Set([root]);
  const queue = [root];
  while (queue.length) {
    const current = queue.shift() as string;
    for (const next of out.get(current) ?? []) {
      if (seen.has(next)) continue;
      seen.add(next);
      queue.push(next);
    }
  }
  return seen;
}

/** The targets with no inbound edge from a different page. */
function orphansIn(targets: string[], edges: Edge[]): string[] {
  const linked = new Set(edges.filter((edge) => edge.from !== edge.to).map((edge) => edge.to));
  return targets.filter((target) => !linked.has(target));
}

/**
 * The live non-dynamic pages, keyed by the URL each one serves.
 *
 * Every page here is rendered for real, so a page that throws fails this file loudly.
 * There is deliberately no try/catch: a source that silently contributes no links is
 * exactly how a gate like this stops proving anything.
 */
const RENDERED: Array<[string, () => JSX.Element | Promise<JSX.Element>]> = [
  ['/', () => <HomePage />],
  ['/about', () => <AboutPage />],
  ['/contact', () => <ContactPage />],
  ['/results', () => <ResultsPage />],
  ['/guides', () => GuidesPage()],
  ['/pub-marketing', () => <PubMarketingPage />],
  ['/why-revenue-is-falling', () => <WhyRevenueIsFallingPage />],
  ['/growth-problems', () => <GrowthProblemsHubPage />],
  ['/sectors/professional-services', () => <ProfessionalServicesPage />],
  ['/insights', () => <InsightsPage />],
  ['/fractional-cmo', () => <FractionalCmoPage />],
  ['/tools/ai-readiness', () => <AiReadinessPage />],
  ['/solutions', () => <SolutionsPage />],
  ['/solutions/hospitality-websites', () => <HospitalityWebsitesPage />],
  ['/solutions/bespoke-applications', () => <BespokeApplicationsPage />],
  ['/solutions/booking-systems', () => <BookingSystemsPage />],
  ['/how-we-work', () => <HowWeWorkPage />],
  ['/start-here', () => <StartHerePage />],
];

/**
 * Live non-dynamic routes deliberately not used as a source, each with its reason.
 *
 * This list plus `RENDERED` must equal the manifest exactly, so adding a page forces
 * a conscious choice and deleting one forces a prune.
 */
const NOT_RENDERED: Array<[string, string]> = [
  ['/privacy', 'Live but sitemap false: a notice, not a destination the graph has to reach.'],
  ['/admin', 'Authenticated, noindex, and behind a Supabase email allow-list.'],
  ['/availability', 'The separate poll product, not part of the marketing graph.'],
  ['/dev/components', 'Development harness: noindex, not in the sitemap, 404 in production.'],
];

const MARKDOWN_LINK = /(!)?\[[^\]]*\]\(\s*([^)\s]+)/g;

/** The internal paths linked from a markdown body, image syntax excluded. */
function markdownLinks(body: string): string[] {
  const found: string[] = [];
  for (const match of body.matchAll(MARKDOWN_LINK)) {
    if (match[1] === '!') continue;
    const path = normalise(match[2]);
    if (path) found.push(path);
  }
  return found;
}

const edges: Edge[] = [];
/** Links per rendered page, so the per-page floor can name the page that fell short. */
const renderedLinkCounts = new Map<string, number>();
/** Distinct outbound paths per rendered page, for the hub guards. */
const renderedTargets = new Map<string, Set<string>>();
let sitemapPaths: string[] = [];

beforeAll(async () => {
  for (const [path, renderPage] of RENDERED) {
    const { container } = render(await renderPage());
    const targets = [...container.querySelectorAll('a[href]')]
      .map((anchor) => normalise(anchor.getAttribute('href') ?? ''))
      .filter((href): href is string => href !== null);
    cleanup();

    for (const target of targets) edges.push({ from: path, to: target });
    renderedLinkCounts.set(path, targets.length);
    renderedTargets.set(path, new Set(targets));
  }

  for (const insight of getAllInsights()) {
    const from = `/insights/${insight.slug}`;
    for (const target of markdownLinks(insight.content)) edges.push({ from, to: target });
  }

  for (const post of getAllPosts()) {
    const from = `/guides/${post.slug}`;
    for (const target of markdownLinks(post.content)) edges.push({ from, to: target });
  }

  const base = getBaseUrl();
  sitemapPaths = (await sitemap()).map((entry) => {
    const path = String(entry.url).slice(base.length);
    return path === '' ? '/' : path;
  });
});

describe('the link graph is a real graph', () => {
  it('renders every live non-dynamic route, or names why not', () => {
    // Guard 1. Set equality, not a subset: a new page added to the manifest and to
    // neither list fails here, which is the moment somebody has to decide whether it
    // needs inbound links. Deleting a page forces the prune the same way.
    const manifest = ROUTES.filter(
      (route) => route.disposition === 'live' && !route.path.includes('[')
    ).map((route) => route.path);

    const covered = [...RENDERED.map(([path]) => path), ...NOT_RENDERED.map(([path]) => path)];

    expect([...covered].sort()).toEqual([...manifest].sort());
  });

  it('harvests a real number of links, so an empty render cannot pass', () => {
    /*
     * Guard 2, measured rather than guessed.
     *
     * Measured on 5 September 2026, on this branch and with the footer entries in
     * place: the thinnest rendered page was `/tools/ai-readiness` at 25 anchors, and
     * the whole graph carried 1,229 edges, 669 of them from the rendered pages and
     * the rest from the published guide and insight bodies.
     *
     * The floors are 12 and 800, deliberately well under both. They are here to
     * catch a page that renders empty or a harvest that silently stops working, not
     * to police copy: a floor a normal edit can trip gets raised until it means
     * nothing. Re-measure and record the new numbers if either moves a long way.
     */
    const thin = [...renderedLinkCounts.entries()].filter(([, count]) => count < 12);
    expect(thin).toEqual([]);
    expect(edges.length).toBeGreaterThanOrEqual(800);
  });

  it('still lists the whole collection on each hub', () => {
    // Guard 3. Every floor is derived from the collection, never typed as a number,
    // so publishing a guide raises the bar the hub has to clear.
    const guideSlugs = sitemapPaths.filter(
      (path) => path.startsWith('/guides/') && !path.startsWith('/guides/category/')
    );
    const guidesTargets = renderedTargets.get('/guides') ?? new Set<string>();
    const linkedGuides = [...guidesTargets].filter(
      (path) => path.startsWith('/guides/') && !path.startsWith('/guides/category/')
    );
    const linkedCategories = [...guidesTargets].filter((path) =>
      path.startsWith('/guides/category/')
    );
    expect(linkedGuides.length).toBeGreaterThanOrEqual(guideSlugs.length);
    expect(linkedCategories).toHaveLength(blogCategories.length);

    const insightsTargets = renderedTargets.get('/insights') ?? new Set<string>();
    expect(
      [...insightsTargets].filter((path) => path.startsWith('/insights/')).length
    ).toBeGreaterThanOrEqual(getAllInsights().length);

    const resultsTargets = renderedTargets.get('/results') ?? new Set<string>();
    expect(
      [...resultsTargets].filter((path) => path.startsWith('/results/')).length
    ).toBeGreaterThanOrEqual(CASE_STUDIES.length);

    const problemTargets = renderedTargets.get('/growth-problems') ?? new Set<string>();
    expect(
      [...problemTargets].filter((path) => path.startsWith('/growth-problems/')).length
    ).toBeGreaterThanOrEqual(GROWTH_PROBLEMS.length);
  });
});

describe('no advertised page is an orphan', () => {
  it('gives every sitemap path at least one inbound link', () => {
    expect(orphansIn(sitemapPaths, edges)).toEqual([]);
  });

  it('leaves every sitemap path reachable from the home page', () => {
    // Inbound links alone are not enough: two pages linking only to each other each
    // have one, and neither can be found from anywhere a visitor or a crawler starts.
    const reachable = reachableFrom('/', edges);
    expect(sitemapPaths.filter((path) => !reachable.has(path))).toEqual([]);
  });

  it('keeps inbound links on the two pages orphaned on 5 September 2026', () => {
    // Named for the history. /fractional-cmo and /tools/ai-readiness sat in the
    // sitemap for a week with zero inbound links and were never crawled. A future
    // failure here should say which pages and why they matter, not just "orphan".
    //
    // Both halves of the fix are required, not either one. The repair was a contextual
    // link from one insight AND a sitewide footer entry, and a bare "at least one
    // inbound link" assertion is satisfied by the insight alone: someone tidying the
    // footer could take sitewide discovery for these two pages from 143 sources back
    // down to one and every assertion in this file would still pass. Counting distinct
    // sources is what makes the footer entries load-bearing rather than decorative.
    const sources = (target: string): string[] => [
      ...new Set(
        edges.filter((edge) => edge.to === target && edge.from !== target).map((e) => e.from)
      ),
    ];

    for (const target of ['/fractional-cmo', '/tools/ai-readiness']) {
      const from = sources(target);
      expect(from, `${target} has no inbound link at all`).not.toEqual([]);
      // The footer puts a link on every rendered page, so losing it collapses this to
      // the single insight that carries the contextual link.
      expect(
        from.length,
        `${target} is reachable from only ${from.join(', ')}. Both the contextual link and the footer entry are part of the fix.`
      ).toBeGreaterThan(1);
    }
  });

  it('renders the two contextual links as real anchors', async () => {
    // Through the same renderer the insight route uses, so keeping the footer entry
    // and quietly dropping the body link fails here. A footer link on every page is
    // weak discovery; a link inside the article that argues the same case is not.
    const cmo = getInsightBySlug('what-is-a-fractional-cmo');
    expect(cmo).not.toBeNull();
    expect(await markdownToHtml(cmo?.content ?? '')).toContain('href="/fractional-cmo"');

    const ai = getInsightBySlug('ai-for-accountants');
    expect(ai).not.toBeNull();
    expect(await markdownToHtml(ai?.content ?? '')).toContain('href="/tools/ai-readiness"');
  });
});

describe('the orphan finder and the reachability check actually discriminate', () => {
  // Synthetic edge sets through the same helpers the real assertions use. Without
  // these the file proves the site is fine and nothing about whether it could tell.
  it('reports a target with no inbound edge', () => {
    expect(orphansIn(['/', '/a', '/b'], [{ from: '/', to: '/a' }])).toEqual(['/', '/b']);
  });

  it('reports a mutually linking pair that inbound links alone would pass', () => {
    const synthetic: Edge[] = [
      { from: '/', to: '/a' },
      { from: '/x', to: '/y' },
      { from: '/y', to: '/x' },
    ];
    expect(orphansIn(['/x', '/y'], synthetic)).toEqual([]);
    expect([...reachableFrom('/', synthetic)].sort()).toEqual(['/', '/a']);
  });
});
