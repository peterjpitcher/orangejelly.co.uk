'use client';

import React, { useState, useEffect, useId } from 'react';
import { Search } from 'lucide-react';
import { type SearchableItem, type SearchResult } from '@/lib/search';
import Fuse from 'fuse.js';
import Heading from './Heading';
import Text from './Text';

interface SearchComponentProps {
  onResults?: (results: SearchResult[]) => void;
  placeholder?: string;
  maxResults?: number;
  className?: string;
}

export default function SearchComponent({
  onResults,
  placeholder = 'Search articles...',
  maxResults = 5,
  className = '',
}: SearchComponentProps) {
  const [query, setQuery] = useState('');
  const [searchIndex, setSearchIndex] = useState<SearchableItem[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isIndexLoaded, setIsIndexLoaded] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const resultsListId = useId();
  const statusMessageId = useId();

  // Load search index on mount
  useEffect(() => {
    const loadSearchIndex = async () => {
      try {
        const response = await fetch('/search-index.json');
        if (response.ok) {
          const index = await response.json();
          setSearchIndex(index);
          setIsIndexLoaded(true);
        }
      } catch (error) {
        console.error('Failed to load search index:', error);
      }
    };

    loadSearchIndex();
  }, []);

  // Perform search when query changes
  useEffect(() => {
    if (!query.trim() || !isIndexLoaded || searchIndex.length === 0) {
      setResults([]);
      onResults?.([]);
      return;
    }

    setIsLoading(true);

    const performSearch = () => {
      const fuseOptions = {
        keys: [
          { name: 'title', weight: 0.4 },
          { name: 'excerpt', weight: 0.3 },
          { name: 'content', weight: 0.2 },
          { name: 'tags', weight: 0.1 },
        ],
        threshold: 0.4,
        distance: 100,
        minMatchCharLength: 2,
        includeScore: true,
        includeMatches: true,
        findAllMatches: true,
      };

      const fuse = new Fuse(searchIndex, fuseOptions);
      const searchResults = fuse.search(query, { limit: maxResults });

      const formattedResults: SearchResult[] = searchResults.map((result) => ({
        item: result.item,
        score: result.score || 0,
        matches: result.matches,
      }));

      setResults(formattedResults);
      onResults?.(formattedResults);
      setIsLoading(false);
    };

    // Debounce search
    const timeoutId = setTimeout(performSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [query, searchIndex, isIndexLoaded, maxResults, onResults]);

  useEffect(() => {
    if (!query.trim()) {
      setAnnouncement('');
      return;
    }

    if (isLoading) {
      setAnnouncement('Searching articles…');
      return;
    }

    setAnnouncement(
      results.length
        ? `${results.length} article${results.length > 1 ? 's' : ''} found`
        : 'No matching articles'
    );
  }, [isLoading, results.length, query]);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          role="combobox"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          disabled={!isIndexLoaded}
          aria-autocomplete="list"
          aria-controls={resultsListId}
          aria-expanded={results.length > 0}
          aria-describedby={statusMessageId}
          aria-haspopup="listbox"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
          </div>
        )}
      </div>

      <div aria-live="polite" id={statusMessageId} className="sr-only">
        {announcement}
      </div>

      {results.length > 0 && (
        <ul
          id={resultsListId}
          role="listbox"
          aria-label="Search results"
          className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto"
          aria-busy={isLoading}
        >
          {results.map((result, index) => (
            <SearchResultItem
              key={result.item.id}
              result={result}
              isLast={index === results.length - 1}
            />
          ))}
        </ul>
      )}

      {query.trim() && results.length === 0 && !isLoading && isIndexLoaded && (
        <div
          className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-500"
          role="status"
          aria-live="polite"
        >
          No articles found for "{query}"
        </div>
      )}
    </div>
  );
}

interface SearchResultItemProps {
  result: SearchResult;
  isLast: boolean;
}

function SearchResultItem({ result, isLast }: SearchResultItemProps) {
  const { item } = result;

  return (
    <li
      role="option"
      aria-selected="false"
      className={`p-4 transition-colors ${!isLast ? 'border-b border-gray-100' : ''}`}
    >
      <a
        href={item.url}
        className="flex flex-col gap-2 hover:bg-gray-50 focus:bg-gray-100 rounded-md transition-colors p-2 -m-2"
      >
        <Heading level={3} className="text-sm truncate">
          {item.title}
        </Heading>
        <Text size="sm" color="muted" className="line-clamp-2">
          {item.excerpt}
        </Text>
        <div className="mt-1 flex items-center flex-wrap gap-2">
          <Text
            size="xs"
            weight="medium"
            className="inline-flex items-center px-2 py-0.5 rounded bg-orange-100 text-orange-800"
          >
            {item.category}
          </Text>
          {item.tags.slice(0, 2).map((tag, index) => (
            <Text
              key={index}
              size="xs"
              weight="medium"
              className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-600"
            >
              {tag}
            </Text>
          ))}
        </div>
      </a>
    </li>
  );
}
