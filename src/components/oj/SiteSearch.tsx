'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

import { Anchor } from './Anchor';

import { EmptyState } from './feedback';
import { Field } from './Field';
import { Input } from './inputs';

export interface SiteSearchResult {
  id: string;
  title: string;
  excerpt?: string;
  url: string;
  category?: string;
}

export interface SiteSearchProps {
  /** Called on every keystroke, debounced by the caller if needed. */
  onQuery?: (query: string) => void;
  results?: SiteSearchResult[];
  /** True while results are being fetched or the index is loading. */
  loading?: boolean;
  label?: string;
  placeholder?: string;
  /** Where a fruitless search should send someone. */
  noResultsHref?: string;
  className?: string;
}

/**
 * Site search.
 *
 * The index is 196KB and most visitors never search, so it is the caller's job to
 * load it lazily on first interaction rather than on mount. This component owns the
 * input, the results and the empty state, not the fetching.
 *
 * A search that finds nothing is a dead end unless it offers a way on. The empty
 * state routes to the growth-problems hub, which is the page most likely to match
 * whatever the person was actually looking for.
 */
export function SiteSearch({
  onQuery,
  results,
  loading = false,
  label = 'Search',
  placeholder = 'What is the problem?',
  noResultsHref = '/growth-problems',
  className,
}: SiteSearchProps): JSX.Element {
  const [query, setQuery] = React.useState('');
  const listId = React.useId();

  const change = (value: string) => {
    setQuery(value);
    onQuery?.(value);
  };

  const searched = query.trim().length > 1;
  const found = results?.length ?? 0;

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <Field label={<span className="sr-only">{label}</span>}>
        <Input
          type="search"
          value={query}
          placeholder={placeholder}
          autoComplete="off"
          role="combobox"
          aria-expanded={searched}
          aria-controls={listId}
          onChange={(event) => change(event.target.value)}
        />
      </Field>

      {/* Result counts are announced, because a list appearing silently below the
          field tells a screen-reader user nothing. */}
      <p aria-live="polite" className="sr-only">
        {loading
          ? 'Searching'
          : searched
            ? `${found} ${found === 1 ? 'result' : 'results'} for ${query}`
            : ''}
      </p>

      {searched && !loading ? (
        found ? (
          <ul id={listId} className="m-0 flex list-none flex-col gap-3 p-0">
            {results?.map((result) => (
              <li key={result.id}>
                <Anchor
                  href={result.url}
                  className="flex flex-col gap-1 border-1.5 border-oj-ink rounded-oj bg-oj-paper p-4 no-underline oj-press oj-focus"
                >
                  {result.category ? (
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-oj-orange-deep">
                      {result.category}
                    </span>
                  ) : null}
                  <span className="font-oj text-[17px] font-black text-oj-ink">{result.title}</span>
                  {result.excerpt ? (
                    <span className="text-sm leading-normal text-oj-ink-2">{result.excerpt}</span>
                  ) : null}
                </Anchor>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            glyph="?"
            title="Nothing matched that"
            body="Try a different word, or start from the problem you are trying to solve."
            action={{ label: 'See the growth problems', href: noResultsHref }}
          />
        )
      ) : null}
    </div>
  );
}

export default SiteSearch;
