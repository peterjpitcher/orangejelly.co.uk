import { describe, expect, it } from 'vitest';

import { GET, generateStaticParams } from '@/app/api/credit/[site]/route';
import { getSitemapRoutes } from '@/lib/route-manifest';
import {
  CLIENT_CREDIT_ORIGIN,
  CLIENT_CREDIT_SITES,
  getClientCredit,
  getClientCreditPaths,
} from './client-credits';

describe('client credits', () => {
  it('covers the six sites that carry the credit', () => {
    expect([...CLIENT_CREDIT_SITES].sort()).toEqual(
      [
        'ase-associates',
        'cheers',
        'dukes-head',
        'management-tools',
        'sea-and-seeds',
        'the-anchor',
      ].sort()
    );
  });

  it('gives every site the approved line with a branded link', () => {
    for (const site of CLIENT_CREDIT_SITES) {
      const credit = getClientCredit(site);
      expect(credit, site).not.toBeNull();
      expect(credit?.prefix, site).toBe('Built and maintained by');
      expect(credit?.label, site).toBe('Orange Jelly');
      expect(credit?.nofollow, site).toBe(false);
    }
  });

  it('points every site at a live, indexable page on the production origin', () => {
    // Sitemap routes are live and not blocked, so a retired or redirected page fails here.
    const indexable = new Set(getSitemapRoutes().map((route: { path: string }) => route.path));

    for (const { site, path } of getClientCreditPaths()) {
      expect(indexable.has(path), `${site} -> ${path}`).toBe(true);

      const href = new URL(getClientCredit(site)?.href ?? '');
      expect(href.origin, site).toBe(CLIENT_CREDIT_ORIGIN);
      expect(href.search, `${site} must not carry tracking parameters`).toBe('');
    }
  });

  it('links each site to the page that sells what it is', () => {
    expect(getClientCredit('the-anchor')?.href).toBe(
      'https://www.orangejelly.co.uk/solutions/hospitality-websites'
    );
    expect(getClientCredit('ase-associates')?.href).toBe(
      'https://www.orangejelly.co.uk/sectors/professional-services'
    );
    expect(getClientCredit('management-tools')?.href).toBe(
      'https://www.orangejelly.co.uk/solutions/bespoke-applications'
    );
  });

  it('knows nothing about an unlisted id, including inherited object keys', () => {
    expect(getClientCredit('not-a-site')).toBeNull();
    expect(getClientCredit('constructor')).toBeNull();
    expect(getClientCredit('__proto__')).toBeNull();
  });
});

describe('GET /api/credit/[site]', () => {
  it('prerenders one file per site', () => {
    expect(generateStaticParams()).toEqual(CLIENT_CREDIT_SITES.map((site) => ({ site })));
  });

  it('returns the resolved line as JSON', async () => {
    const response = GET(new Request('https://www.orangejelly.co.uk/api/credit/cheers'), {
      params: { site: 'cheers' },
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      prefix: 'Built and maintained by',
      label: 'Orange Jelly',
      href: 'https://www.orangejelly.co.uk/solutions/bespoke-applications',
      nofollow: false,
    });
  });

  it('answers an unknown id with a 404, not the default line', async () => {
    const response = GET(new Request('https://www.orangejelly.co.uk/api/credit/nope'), {
      params: { site: 'nope' },
    });

    expect(response.status).toBe(404);
  });
});
