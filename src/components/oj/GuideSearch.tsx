'use client';

import * as React from 'react';

import type { SearchableItem } from '@/lib/search';
import { trackClientEvent } from '@/lib/tracking';

import { SiteSearch, type SiteSearchResult } from './SiteSearch';

const MAX_RESULTS = 8;
const DEBOUNCE_MS = 300;
const TRACK_AFTER_MS = 1000;

/**
 * The guides library search: the `oj/SiteSearch` field with something behind it.
 *
 * `SiteSearch` was built during the redesign and never wired up, so /guides was
 * still rendering the legacy `SearchComponent`. That left one control on the whole
 * redesigned site in the old design, a pill-shaped grey-bordered input in the middle
 * of a page of square ink-bordered blocks, which is the sort of thing that reads as
 * a broken page rather than as an older page.
 *
 * The index loads on first interaction, not on mount. It is 196KB of JSON and the
 * overwhelming majority of visitors never type anything, so the legacy component was
 * spending that on every single view of the busiest section of the site. Fuse is
 * dynamically imported for the same reason: it only exists once somebody searches.
 *
 * `SiteSearch` owns the input and the results; this owns the fetching. That split is
 * the component's own contract and it is what lets the search field appear on other
 * pages later without each one re-implementing the debounce.
 */
export function GuideSearch({ placeholder }: { placeholder?: string }): JSX.Element {
  const [index, setIndex] = React.useState<SearchableItem[] | null>(null);
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<SiteSearchResult[]>([]);
  const [loading, setLoading] = React.useState(false);
  const lastTracked = React.useRef('');

  /*
   * One load, triggered by the first keystroke. `loading` covers the gap so the
   * field does not report "0 results" while the index is still in flight, which is
   * the wrong answer rather than a slow one.
   */
  const ensureIndex = React.useCallback(async () => {
    if (index) return index;
    setLoading(true);
    try {
      const response = await fetch('/search-index.json');
      if (!response.ok) throw new Error(`search index ${response.status}`);
      const loaded = (await response.json()) as SearchableItem[];
      setIndex(loaded);
      return loaded;
    } catch {
      /* A search that cannot load its index behaves like a search that found
         nothing, which is honest and is not worth an error state of its own. */
      setIndex([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [index]);

  React.useEffect(() => {
    const term = query.trim();
    if (term.length < 2) {
      setResults([]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const timer = window.setTimeout(async () => {
      const items = await ensureIndex();
      if (cancelled) return;

      const { default: Fuse } = await import('fuse.js');
      if (cancelled) return;

      const fuse = new Fuse(items, {
        keys: [
          { name: 'title', weight: 0.4 },
          { name: 'excerpt', weight: 0.3 },
          { name: 'content', weight: 0.2 },
          { name: 'tags', weight: 0.1 },
        ],
        threshold: 0.4,
        distance: 100,
        minMatchCharLength: 2,
        findAllMatches: true,
      });

      setResults(
        fuse.search(term, { limit: MAX_RESULTS }).map(({ item }) => ({
          id: item.id,
          title: item.title,
          excerpt: item.excerpt,
          url: item.url,
          category: item.category,
        }))
      );
      setLoading(false);
    }, DEBOUNCE_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query, ensureIndex]);

  /* Reported once the typing has settled, so one search is one event rather than
     one event per character. */
  React.useEffect(() => {
    const term = query.trim().toLowerCase();
    if (term.length < 2 || loading || term === lastTracked.current) return;

    const timer = window.setTimeout(() => {
      lastTracked.current = term;
      trackClientEvent('site_search', {
        properties: { query: term, result_count: results.length, component: 'GuideSearch' },
      });
    }, TRACK_AFTER_MS);

    return () => window.clearTimeout(timer);
  }, [query, loading, results.length]);

  return (
    <SiteSearch
      label="Search the guides"
      placeholder={placeholder}
      loading={loading}
      results={results}
      onQuery={setQuery}
      noResultsHref="/growth-problems"
    />
  );
}

export default GuideSearch;
