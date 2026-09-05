import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { type MetadataRoute } from 'next';

import robots from '@/app/robots';
import { getBaseUrl } from '@/lib/site-config';

import { explain, isAllowed, parseRobots, selectGroup } from '../../scripts/lib/robots-matcher.mjs';

/**
 * What Googlebot may actually fetch.
 *
 * WHY THIS FILE IS SHAPED LIKE THIS. The site shipped for months with four rules that
 * blocked every stylesheet, every script chunk, the image optimiser behind 394 of the
 * 398 `<img>` elements, the only favicon and the social image. Search Console reported
 * one blocked stylesheet, which is the visible tip of that, and nothing in the repo
 * could have caught the rest.
 *
 * A test that asserts `disallow` does not contain `/_next/` would not have caught it
 * either, and would not catch its return. `/*_next*` blocks the same URLs without that
 * string appearing anywhere in the array, and a `Googlebot` group can block them for
 * the one crawler that matters while the `*` group looks spotless. So every assertion
 * below goes through a Robots Exclusion Protocol matcher against the file Next will
 * actually serve, and the last two fixtures prove the membership test fails both traps.
 *
 * @see tasks/gsc-indexing/SPEC.md section 4, P1
 */

const AGENTS = ['*', 'Googlebot'] as const;

type RobotsRule = {
  userAgent?: string | string[];
  allow?: string | string[];
  disallow?: string | string[];
  crawlDelay?: number;
};

function toArray(value: string | string[]): string[] {
  return Array.isArray(value) ? value : [value];
}

/**
 * Serialise a robots config the way Next does.
 *
 * Mirrors `resolveRobots` in
 * `node_modules/next/dist/build/webpack/loaders/metadata/resolve-route-data.js`, pinned
 * at `next@14.2.35`: one `User-Agent` line per agent, then `Allow`, then `Disallow` in
 * array order, then a blank line closing every group, then `Host`, then `Sitemap`.
 *
 * Testing the object would test the wrong artefact. Crawlers read the file, and the
 * order and grouping of these lines is what decides precedence.
 */
function serialiseRobots(config: MetadataRoute.Robots): string {
  const rules: RobotsRule[] = Array.isArray(config.rules) ? config.rules : [config.rules];
  let content = '';

  for (const rule of rules) {
    for (const agent of toArray(rule.userAgent ?? '*')) {
      content += `User-Agent: ${agent}\n`;
    }
    if (rule.allow) {
      for (const item of toArray(rule.allow)) content += `Allow: ${item}\n`;
    }
    if (rule.disallow) {
      for (const item of toArray(rule.disallow)) content += `Disallow: ${item}\n`;
    }
    if (rule.crawlDelay) {
      content += `Crawl-delay: ${rule.crawlDelay}\n`;
    }
    content += '\n';
  }

  if (config.host) content += `Host: ${config.host}\n`;
  if (config.sitemap) {
    for (const item of toArray(config.sitemap)) content += `Sitemap: ${item}\n`;
  }

  return content;
}

/** The exact bytes production will serve. Every assertion below reads this string. */
const LIVE = serialiseRobots(robots());

describe('the matcher itself, before anything trusts it', () => {
  it('treats an empty Disallow value as no restriction, not as a rule matching everything', () => {
    const text = 'User-agent: *\nDisallow:\n';
    expect(isAllowed(text, '/anything')).toBe(true);
    expect(parseRobots(text)[0].rules).toEqual([]);
  });

  it('blocks everything on Disallow: /', () => {
    const text = 'User-agent: *\nDisallow: /\n';
    expect(isAllowed(text, '/')).toBe(false);
    expect(isAllowed(text, '/guides/anything')).toBe(false);
  });

  it('matches patterns as prefixes, not as whole path segments', () => {
    const text = 'User-agent: *\nDisallow: /a/\n';
    expect(isAllowed(text, '/a/b')).toBe(false);
    expect(isAllowed(text, '/ab')).toBe(true);
  });

  it('lets the longest matching pattern win rather than the first one', () => {
    const text = 'User-agent: *\nDisallow: /files/\nAllow: /files/public/\n';
    expect(isAllowed(text, '/files/private/x')).toBe(false);
    expect(isAllowed(text, '/files/public/x')).toBe(true);
    expect(explain(text, '/files/public/x').rule).toBe('Allow: /files/public/');
  });

  it('gives an allow the win over a disallow of exactly the same length', () => {
    const text = 'User-agent: *\nDisallow: /page\nAllow: /page\n';
    expect(isAllowed(text, '/page')).toBe(true);
  });

  it('treats * inside a pattern as a wildcard', () => {
    const text = 'User-agent: *\nDisallow: /*.json\n';
    expect(isAllowed(text, '/search-index.json')).toBe(false);
    expect(isAllowed(text, '/deep/nested/data.json')).toBe(false);
    expect(isAllowed(text, '/guides/json-for-beginners')).toBe(true);
  });

  it('treats a trailing $ as an anchor to the end of the path', () => {
    const text = 'User-agent: *\nDisallow: /report.pdf$\n';
    expect(isAllowed(text, '/report.pdf')).toBe(false);
    expect(isAllowed(text, '/report.pdf.html')).toBe(true);
  });

  it('matches the query string too, which is what let Disallow: /icon block the favicon', () => {
    const text = 'User-agent: *\nDisallow: /icon\n';
    expect(isAllowed(text, '/icon.png?9e068de9ff0ddf0e')).toBe(false);
    expect(explain(text, '/icon.png?9e068de9ff0ddf0e').target).toBe('/icon.png?9e068de9ff0ddf0e');
  });

  it('selects the longest matching user-agent token', () => {
    const text = [
      'User-agent: *',
      'Disallow: /everyone',
      '',
      'User-agent: Googlebot',
      'Disallow: /googlebot',
      '',
      'User-agent: Googlebot-Image',
      'Disallow: /images',
      '',
    ].join('\n');
    expect(explain(text, '/googlebot', 'Googlebot').allowed).toBe(false);
    expect(explain(text, '/everyone', 'Googlebot').allowed).toBe(true);
    expect(explain(text, '/images', 'Googlebot-Image').allowed).toBe(false);
    expect(explain(text, '/googlebot', 'Googlebot-Image').allowed).toBe(true);
  });

  it('falls back to the * group for an agent with no group of its own', () => {
    const text = 'User-agent: *\nDisallow: /everyone\n\nUser-agent: Googlebot\nDisallow: /gb\n';
    expect(explain(text, '/everyone', 'Bingbot').allowed).toBe(false);
    expect(explain(text, '/gb', 'Bingbot').allowed).toBe(true);
    expect(explain(text, '/everyone', 'Bingbot').agents).toEqual(['*']);
  });

  it('allows everything when no group governs the agent at all', () => {
    const text = 'User-agent: Googlebot\nDisallow: /\n';
    expect(isAllowed(text, '/anything', 'Bingbot')).toBe(true);
    expect(explain(text, '/anything', 'Bingbot').rule).toBeNull();
  });

  it('ignores comments, blank lines, colonless lines and rules before the first agent', () => {
    const text = [
      '# a leading comment',
      'Disallow: /orphaned-rule',
      'this line has no colon',
      '',
      'User-agent: *  # trailing comment',
      'Disallow: /api/ # another',
      '',
    ].join('\n');
    expect(isAllowed(text, '/orphaned-rule')).toBe(true);
    expect(isAllowed(text, '/api/events')).toBe(false);
    expect(parseRobots(text)).toHaveLength(1);
  });

  it('matches field names and agent tokens case-insensitively', () => {
    const text = 'USER-AGENT: GoogleBot\nDISALLOW: /api/\n';
    const groups = parseRobots(text);
    expect(groups[0].rules).toEqual([{ type: 'disallow', value: '/api/' }]);
    expect(selectGroup(groups, 'googlebot')).toBe(groups[0]);
    expect(isAllowed(text, '/api/events', 'googlebot')).toBe(false);
  });
});

describe('the file Next will serve', () => {
  it('resolves the canonical host, so the expected text below is stable', () => {
    // Vitest does not load `.env.local`, so `NEXT_PUBLIC_BASE_URL` is unset here and
    // `getBaseUrl()` returns its default. If this fails, the environment is overriding
    // the base URL and the whole-string assertion below is measuring a preview host.
    expect(getBaseUrl()).toBe('https://www.orangejelly.co.uk');
  });

  it('is exactly this text', () => {
    // `toBe` against a literal on purpose, never `toMatchInlineSnapshot`: a snapshot
    // would be silently rewritten by `vitest -u` instead of failing, which is precisely
    // the kind of quiet change this file exists to stop.
    expect(LIVE).toBe(
      `User-Agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /private/
Disallow: /search-index.json

Sitemap: https://www.orangejelly.co.uk/sitemap.xml
`
    );
  });
});

type AssetKind =
  | 'stylesheet'
  | 'script'
  | 'font'
  | 'optimised-image'
  | 'favicon'
  | 'apple-touch-icon'
  | 'open-graph-image'
  | 'manifest'
  | 'page'
  | 'discovery';

/**
 * Every kind of URL a crawler has to fetch to render and display this site.
 *
 * The `/_next/static` hashes are sample shapes, not fixtures that must exist: a content
 * hash changes on every build. What is being asserted is the shape of the path, because
 * that is what a robots pattern matches on.
 */
const ALLOWED: Array<{ kind: AssetKind; url: string; why: string }> = [
  {
    kind: 'stylesheet',
    url: '/_next/static/css/f62ad9e515a7337d.css',
    why: 'the stylesheet Search Console logged as blocked',
  },
  {
    kind: 'stylesheet',
    url: '/_next/static/css/f62ad9e515a7337d.css?dpl=dpl_9nCzJk4Qm2VtP',
    why: 'Vercel appends a deployment id to asset URLs',
  },
  {
    kind: 'script',
    url: '/_next/static/chunks/main-app-0f3a1b2c4d5e6f70.js',
    why: '17 JS chunks on the home page alone',
  },
  {
    kind: 'script',
    url: '/_next/static/chunks/app/guides/%5Bslug%5D/page-1a2b3c4d5e6f7081.js',
    why: 'a route chunk, so the guide pages render for Google as they do for a reader',
  },
  {
    kind: 'font',
    url: '/_next/static/media/a34f9d1e2b3c4d5e-s.p.woff2',
    why: 'a blocked font changes how the rendered page is measured',
  },
  {
    kind: 'optimised-image',
    url: '/_next/image?url=%2Fimages%2Fhero.jpg&w=1200&q=75',
    why: '394 of the 398 img elements on the site point at the optimiser',
  },
  {
    kind: 'favicon',
    url: '/icon.png?9e068de9ff0ddf0e',
    why: 'the only favicon the site has, linked on all 145 pages',
  },
  {
    kind: 'apple-touch-icon',
    url: '/apple-icon.png?9e068de9ff0ddf0e',
    why: 'the apple-touch-icon linked on all 145 pages',
  },
  {
    kind: 'open-graph-image',
    url: '/opengraph-image?e7f2a1b0c9d8e7f6',
    why: 'the og:image on 4 pages and the twitter:image on 32',
  },
  {
    kind: 'manifest',
    url: '/manifest.webmanifest',
    why: 'the web app manifest, served by src/app/manifest.ts',
  },
  {
    kind: 'page',
    url: '/guides/summer-moments-simple-campaigns',
    why: 'a guide page, the content 92.9 per cent of clicks land on',
  },
  { kind: 'discovery', url: '/sitemap.xml', why: 'the sitemap this file points crawlers at' },
  { kind: 'discovery', url: '/llms.txt', why: 'the machine-readable site summary' },
];

/**
 * Every URL that must stay out of the index. `/api/contact` is deliberately absent:
 * there is no such route, and a row for a URL that does not exist teaches the wrong
 * thing to whoever reads this next.
 */
const BLOCKED: string[] = [
  '/api/',
  '/api/events',
  '/api/admin/enquiries',
  '/api/cron/polls',
  '/api/preview?secret=x',
  '/admin/',
  '/admin/enquiries',
  '/private/',
  '/private/anything.html',
  '/search-index.json',
];

describe.each(AGENTS)('what %s may fetch', (agent) => {
  it.each(ALLOWED)('allows the $kind $url', ({ url, why }) => {
    const verdict = explain(LIVE, url, agent);
    expect(
      verdict.allowed,
      `${agent} must be able to fetch ${url} (${why}) but "${verdict.rule}" blocks it`
    ).toBe(true);
  });

  it.each(BLOCKED)('blocks %s', (url) => {
    const verdict = explain(LIVE, url, agent);
    expect(verdict.allowed, `${agent} must not be able to fetch ${url}`).toBe(false);
  });
});

describe('the shape of the rules, so a legitimate rewording still gets checked', () => {
  const config = robots();
  const rules: RobotsRule[] = Array.isArray(config.rules) ? config.rules : [config.rules];
  const disallow = rules.flatMap((rule) => (rule.disallow ? toArray(rule.disallow) : []));

  it('has exactly one group, addressed to every crawler', () => {
    expect(rules).toHaveLength(1);
    expect(rules[0].userAgent).toBe('*');
  });

  it('allows the whole site', () => {
    expect(rules[0].allow).toBe('/');
  });

  it('uses no wildcard or anchor in a disallow, which would widen it unpredictably', () => {
    expect(disallow.filter((value) => value.includes('*') || value.includes('$'))).toEqual([]);
  });

  it('never disallows the root', () => {
    expect(disallow).not.toContain('/');
  });
});

describe('the traps a membership test would walk straight past', () => {
  const FIXED_DISALLOW = ['/api/', '/admin/', '/private/', '/search-index.json'];
  const RENDERING_ASSETS = [
    '/_next/static/css/f62ad9e515a7337d.css',
    '/_next/static/chunks/main-app-0f3a1b2c4d5e6f70.js',
    '/_next/static/media/a34f9d1e2b3c4d5e-s.p.woff2',
    '/_next/image?url=%2Fimages%2Fhero.jpg&w=1200&q=75',
  ];

  it('catches a wildcard rule that blocks /_next/ without ever spelling it', () => {
    const trap = serialiseRobots({
      rules: {
        userAgent: '*',
        allow: '/',
        disallow: [...FIXED_DISALLOW, '/*_next*', '/*.json$'],
      },
      sitemap: `${getBaseUrl()}/sitemap.xml`,
    });

    // The membership test everyone reaches for first passes on this file.
    expect(parseRobots(trap)[0].rules.map((rule) => rule.value)).not.toContain('/_next/');

    for (const url of RENDERING_ASSETS) {
      expect(isAllowed(trap, url), `${url} is blocked by "${explain(trap, url).rule}"`).toBe(false);
    }
  });

  it('catches a Googlebot-only group blocking what the * group allows', () => {
    const trap = serialiseRobots({
      rules: [
        { userAgent: '*', allow: '/', disallow: FIXED_DISALLOW },
        { userAgent: 'Googlebot', disallow: ['/_next/'] },
      ],
      sitemap: `${getBaseUrl()}/sitemap.xml`,
    });

    // The `*` group is spotless, which is the whole point of the trap.
    expect(selectGroup(parseRobots(trap), 'Bingbot').rules.map((rule) => rule.value)).not.toContain(
      '/_next/'
    );

    const css = RENDERING_ASSETS[0];
    expect(isAllowed(trap, css, 'Googlebot')).toBe(false);
    expect(isAllowed(trap, css, 'Bingbot')).toBe(true);
  });
});

describe('the rest of the robots surface', () => {
  const REQUIRED_KINDS: AssetKind[] = [
    'stylesheet',
    'script',
    'font',
    'optimised-image',
    'favicon',
    'apple-touch-icon',
    'open-graph-image',
    'manifest',
    'page',
    'discovery',
  ];

  it('still covers every kind of asset a rendered page needs', () => {
    // Without this, a future edit could delete a whole class of asset from the table
    // above and every remaining test would still pass.
    const covered = new Set(ALLOWED.map((asset) => asset.kind));
    expect(REQUIRED_KINDS.filter((kind) => !covered.has(kind))).toEqual([]);
  });

  it('has no static public/robots.txt to collide with the metadata route', () => {
    // A file at `public/robots.txt` is served in preference to `src/app/robots.ts`, so
    // one would silently replace everything asserted above. Separately, and not fixed
    // here: `generateRobotsTxt()` in `src/lib/feeds.ts` is a second, unused set of
    // robots rules with nothing calling it. It should be deleted on its own.
    expect(existsSync(path.join(process.cwd(), 'public', 'robots.txt'))).toBe(false);
  });
});
