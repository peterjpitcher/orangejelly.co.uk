import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { type Category, calculateReadingTime, getCategoryBySlug, blogCategories } from './blog';

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishedDate: string;
  updatedDate?: string;
  category: string;
  tags: string[];
  featuredImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  readingTime?: number;
}

const postsDirectory = path.join(process.cwd(), 'content/blog');

export interface BlogPostMeta {
  title: string;
  excerpt: string;
  publishedDate: string;
  updatedDate?: string;
  category: string;
  tags: string[];
  featuredImage?: string;
  publishedAt?: string;
  draft?: boolean;
  status?: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

export interface PublishOptions {
  includeDrafts?: boolean;
  includeFuture?: boolean;
  now?: Date;
}

// Get all post slugs
export function getAllPostSlugs() {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith('.md') && fileName.toLowerCase() !== 'readme.md')
    .map((fileName) => fileName.replace(/\.md$/, ''));
}

// Category mapping for legacy posts
const categoryMapping: Record<string, string> = {
  turnaround: 'turnaround',
  community: 'community',
  communications: 'communications',
  analytics: 'analytics',
  sales: 'sales',
  people: 'people',
  marketing: 'social-media',
  'pub-management': 'empty-pub-solutions',
  'pub-promotions': 'events-promotions',
  events: 'events-promotions',
  food: 'food-drink',
  seasonal: 'events-promotions',
  budget: 'empty-pub-solutions',
  undefined: 'empty-pub-solutions',
  'getting-started': 'empty-pub-solutions',
  competition: 'competition',
  'supplier-relations': 'empty-pub-solutions',
  'financial-management': 'empty-pub-solutions',
  compliance: 'food-drink',
  'crisis-management': 'empty-pub-solutions',
  operations: 'empty-pub-solutions',
  'digital-reputation': 'social-media',
  'location-challenges': 'empty-pub-solutions',
  'customer-acquisition': 'empty-pub-solutions',
  'revenue-growth': 'sales',
};

function normalizeCategorySlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function resolveCategorySlug(rawCategory?: string | null): string {
  const normalized = normalizeCategorySlug(rawCategory || 'undefined');
  return categoryMapping[normalized] || normalized || 'empty-pub-solutions';
}

const isPublishable = (meta: BlogPostMeta, options: PublishOptions = {}): boolean => {
  const now = options.now ?? new Date();
  const includeDrafts = options.includeDrafts === true;
  const includeFuture = options.includeFuture === true;
  const statusValue = typeof meta.status === 'string' ? meta.status.toLowerCase().trim() : null;
  const isDraft = meta.draft === true || statusValue === 'draft';
  if (!includeDrafts && isDraft) {
    return false;
  }

  const publishedAt = meta.publishedAt || meta.publishedDate;
  if (publishedAt) {
    const publishedDate = new Date(publishedAt);
    if (
      !includeFuture &&
      !Number.isNaN(publishedDate.getTime()) &&
      publishedDate.getTime() > now.getTime()
    ) {
      return false;
    }
  }

  return true;
};

// Get post by slug
export function getPostBySlug(slug: string, options: PublishOptions = {}): BlogPost | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const meta = data as BlogPostMeta;

    if (!isPublishable(meta, options)) {
      return null;
    }

    if (typeof meta.title !== 'string' || meta.title.trim().length === 0) {
      console.warn(`Skipping blog post with missing title: ${slug}`);
      return null;
    }

    // Map legacy/variant category values to canonical slugs
    const mappedCategory = resolveCategorySlug(meta.category);
    const category = getCategoryBySlug(mappedCategory);

    if (!category) {
      console.error(`Invalid category: ${meta.category} -> ${mappedCategory} for post: ${slug}`);
      // Use default category instead of returning null
      const defaultCategory = getCategoryBySlug('empty-pub-solutions');
      if (!defaultCategory) {
        return null;
      }
    }

    const finalCategory = category || getCategoryBySlug('empty-pub-solutions')!;

    const post: BlogPost = {
      slug,
      title: meta.title,
      excerpt: meta.excerpt,
      content,
      publishedDate: meta.publishedDate || meta.publishedAt || new Date().toISOString(),
      updatedDate: meta.updatedDate,
      category: finalCategory.slug,
      tags: meta.tags,
      featuredImage: meta.featuredImage || '/images/blog/default.svg',
      metaTitle: meta.seo?.title,
      metaDescription: meta.seo?.description || meta.excerpt,
      keywords: meta.seo?.keywords || meta.tags,
      readingTime: calculateReadingTime(content),
    };

    return post;
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

// Get all posts
export function getAllPosts(options: PublishOptions = {}): BlogPost[] {
  const slugs = getAllPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug, options))
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => {
      return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
    });

  return posts;
}

// Get posts by category
export function getPostsByCategory(categorySlug: string, options: PublishOptions = {}): BlogPost[] {
  const allPosts = getAllPosts(options);
  return allPosts.filter((post) => post.category === categorySlug);
}

// Get recent posts
export function getRecentPosts(limit: number = 5, options: PublishOptions = {}): BlogPost[] {
  const allPosts = getAllPosts(options);
  return allPosts.slice(0, limit);
}

// Get featured posts (most recent from each category)
export function getFeaturedPosts(options: PublishOptions = {}): BlogPost[] {
  const allPosts = getAllPosts(options);
  const featured: BlogPost[] = [];
  const categories = new Set<string>();

  for (const post of allPosts) {
    if (!categories.has(post.category)) {
      featured.push(post);
      categories.add(post.category);
    }
    if (featured.length >= 5) break;
  }

  return featured;
}

// Search posts
export function searchPosts(query: string, options: PublishOptions = {}): BlogPost[] {
  const allPosts = getAllPosts(options);
  const searchTerm = query.toLowerCase();

  return allPosts.filter((post) => {
    const searchableContent = `
      ${post.title} 
      ${post.excerpt} 
      ${post.content} 
      ${post.tags.join(' ')}
    `.toLowerCase();

    return searchableContent.includes(searchTerm);
  });
}

// Get all categories with post counts
export function getCategories(options: PublishOptions = {}): Category[] {
  const allPosts = getAllPosts(options);
  const categoryMap = new Map<string, number>();

  // Count posts per category
  allPosts.forEach((post) => {
    const count = categoryMap.get(post.category) || 0;
    categoryMap.set(post.category, count + 1);
  });

  // Return categories that have posts
  return blogCategories.filter(
    (category) => categoryMap.has(category.slug) && categoryMap.get(category.slug)! > 0
  );
}
