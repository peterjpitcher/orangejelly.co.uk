import Fuse, { type FuseResult, type IFuseOptions } from 'fuse.js';
import fs from 'fs';
import path from 'path';
import { getAllPosts } from './blog-md';

/**
 * Which content collection an item belongs to.
 *
 * The site runs two: the hospitality guides at /licensees-guide/*, which carry 900
 * of the site's 969 annual clicks and do not move, and the new-positioning articles
 * at /insights/*. The URL is derived from this rather than hard-coded, so a new
 * collection cannot silently end up advertising the wrong path.
 */
export type SearchCollection = 'licensees-guide' | 'insights';

export interface SearchableItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  slug: string;
  publishedDate: string;
  url: string;
  collection: SearchCollection;
}

export interface SearchResult {
  item: SearchableItem;
  score: number;
  matches?: FuseResult<SearchableItem>['matches'];
}

const SEARCH_INDEX_PATH = path.join(process.cwd(), 'public', 'search-index.json');

/**
 * How much article body goes into the index.
 *
 * The index used to carry every article in full, averaging 8,435 characters each
 * and reaching 28,053, which made a 936KB file that the search component fetched on
 * mount. Mobile is 78% of this site's search clicks, so that was most of a megabyte
 * spent on a feature most visitors never touch.
 *
 * Fuzzy matching does not need the whole article. The opening carries the subject,
 * and title, excerpt, category and tags are indexed separately and weighted higher
 * anyway. This keeps enough body to match on phrasing without shipping the site.
 */
const INDEXED_CONTENT_CHARS = 1200;

const COLLECTION_BASE: Record<SearchCollection, string> = {
  'licensees-guide': '/licensees-guide',
  insights: '/insights',
};

/** Single place that turns a slug into a URL, so the two collections cannot drift. */
export function searchItemUrl(collection: SearchCollection, slug: string): string {
  return `${COLLECTION_BASE[collection]}/${slug}`;
}

/**
 * Build search index from all markdown content
 * This creates a searchable index for client-side search
 */
export function buildSearchIndex(): SearchableItem[] {
  const posts = getAllPosts();

  const searchableItems: SearchableItem[] = posts
    .filter((post) => post && post.slug && post.title) // Filter out invalid posts
    .map((post) => ({
      id: post.slug,
      title: post.title || 'Untitled',
      excerpt: post.excerpt || '',
      content: stripMarkdown(post.content || '').slice(0, INDEXED_CONTENT_CHARS),
      category: post.category || '',
      tags: post.tags || [],
      slug: post.slug,
      publishedDate: post.publishedDate || new Date().toISOString(),
      collection: 'licensees-guide' as const,
      url: searchItemUrl('licensees-guide', post.slug),
    }));

  // Write the index to the public directory for client-side access
  try {
    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    fs.writeFileSync(SEARCH_INDEX_PATH, JSON.stringify(searchableItems, null, 2));
    console.log(`Search index built successfully with ${searchableItems.length} items`);
  } catch (error) {
    console.error('Could not write the search index:', error);
  }

  return searchableItems;
}

/**
 * Search content using Fuse.js fuzzy search
 */
export function searchContent(query: string, items?: SearchableItem[]): SearchResult[] {
  if (!query.trim()) {
    return [];
  }

  let searchItems = items;

  // If no items provided, try to load from file or build new index
  if (!searchItems) {
    if (fs.existsSync(SEARCH_INDEX_PATH)) {
      try {
        const indexData = fs.readFileSync(SEARCH_INDEX_PATH, 'utf8');
        searchItems = JSON.parse(indexData);
      } catch (error) {
        console.error('Error loading search index:', error);
        searchItems = buildSearchIndex();
      }
    } else {
      searchItems = buildSearchIndex();
    }
  }

  if (!searchItems || searchItems.length === 0) {
    return [];
  }

  const fuseOptions: IFuseOptions<SearchableItem> = {
    keys: [
      { name: 'title', weight: 0.4 },
      { name: 'excerpt', weight: 0.3 },
      { name: 'content', weight: 0.2 },
      { name: 'tags', weight: 0.1 },
    ],
    threshold: 0.4, // Lower = more strict matching
    distance: 100,
    minMatchCharLength: 2,
    includeScore: true,
    includeMatches: true,
    findAllMatches: true,
  };

  const fuse = new Fuse(searchItems, fuseOptions);
  const results = fuse.search(query, { limit: 20 });

  return results.map((result) => ({
    item: result.item,
    score: result.score || 0,
    matches: result.matches,
  }));
}

/**
 * Get search suggestions based on partial query
 */
export function getSearchSuggestions(query: string, items?: SearchableItem[]): string[] {
  if (query.length < 2) {
    return [];
  }

  let searchItems = items;
  if (!searchItems) {
    if (fs.existsSync(SEARCH_INDEX_PATH)) {
      try {
        const indexData = fs.readFileSync(SEARCH_INDEX_PATH, 'utf8');
        searchItems = JSON.parse(indexData);
      } catch {
        searchItems = buildSearchIndex();
      }
    } else {
      searchItems = buildSearchIndex();
    }
  }

  if (!searchItems) {
    return [];
  }

  const suggestions = new Set<string>();
  const queryLower = query.toLowerCase();

  // Add title matches
  searchItems.forEach((item) => {
    if (item.title && item.title.toLowerCase().includes(queryLower)) {
      suggestions.add(item.title);
    }

    // Add tag matches
    (item.tags || []).forEach((tag) => {
      if (tag && tag.toLowerCase().includes(queryLower)) {
        suggestions.add(tag);
      }
    });
  });

  return Array.from(suggestions).slice(0, 5);
}

/**
 * Get popular search terms from content
 */
export function getPopularSearchTerms(): string[] {
  const posts = getAllPosts();
  const termFrequency: Record<string, number> = {};

  posts.forEach((post) => {
    // Extract terms from tags
    (post.tags || []).forEach((tag) => {
      if (tag) {
        const normalized = tag.toLowerCase().trim();
        termFrequency[normalized] = (termFrequency[normalized] || 0) + 1;
      }
    });

    // Extract key phrases from titles
    if (post.title) {
      const titleWords = post.title
        .toLowerCase()
        .split(/\s+/)
        .filter((word) => word.length > 3 && !isStopWord(word));

      titleWords.forEach((word) => {
        termFrequency[word] = (termFrequency[word] || 0) + 1;
      });
    }
  });

  // Sort by frequency and return top terms
  return Object.entries(termFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([term]) => term);
}

/**
 * Strip markdown formatting for search content
 */
function stripMarkdown(content: string): string {
  return content
    .replace(/#{1,6}\s+/g, '') // Remove headers
    .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.+?)\*/g, '$1') // Remove italic
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Remove links, keep text
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`(.+?)`/g, '$1') // Remove inline code
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
}

/**
 * Check if a word is a common stop word
 */
function isStopWord(word: string): boolean {
  const stopWords = new Set([
    'the',
    'and',
    'or',
    'but',
    'in',
    'on',
    'at',
    'to',
    'for',
    'of',
    'with',
    'by',
    'from',
    'as',
    'is',
    'was',
    'are',
    'were',
    'be',
    'been',
    'have',
    'has',
    'had',
    'do',
    'does',
    'did',
    'will',
    'would',
    'could',
    'should',
    'may',
    'might',
    'must',
    'can',
    'shall',
    'this',
    'that',
    'these',
    'those',
    'a',
    'an',
    'my',
    'your',
    'how',
    'what',
    'when',
    'where',
    'why',
    'who',
  ]);

  return stopWords.has(word.toLowerCase());
}

/**
 * Load search index from file (for client-side usage)
 */
export async function loadSearchIndex(): Promise<SearchableItem[]> {
  try {
    const response = await fetch('/search-index.json');
    if (!response.ok) {
      throw new Error('Failed to load search index');
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading search index:', error);
    return [];
  }
}
