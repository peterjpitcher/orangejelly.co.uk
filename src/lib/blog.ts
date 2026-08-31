import { type BreadcrumbItem } from '@/components/Breadcrumb';
import type { CategoryId } from '@/components/oj/editorial';

// Blog post type definitions
export interface Author {
  name: string;
  role: string;
  bio: string;
  image: string;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
}

export interface AdjacentPostNavItem {
  slug: string;
  title: string;
  excerpt: string;
  publishedDate?: string;
  category: Category;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: Author;
  publishedDate: string;
  updatedDate?: string;
  category: Category;
  tags: string[];
  featuredImage:
    | string
    | {
        src?: string;
        alt?: string;
        asset?: {
          _id?: string;
          url?: string;
        };
      };
  seo: {
    metaTitle?: string;
    metaDescription: string;
    keywords: string[];
  };
  readingTime: number;
}

// Calculate reading time based on word count
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return readingTime;
}

// Generate excerpt from content if not provided
export function generateExcerpt(content: string, maxLength: number = 160): string {
  const plainText = content.replace(/<[^>]*>/g, ''); // Strip HTML
  const trimmed = plainText.substring(0, maxLength);
  const lastSpace = trimmed.lastIndexOf(' ');
  return trimmed.substring(0, lastSpace) + '...';
}

// Format date for display
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// Generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Default author for blog posts
export const defaultAuthor: Author = {
  name: 'Peter Pitcher',
  role: 'Licensee & Founder',
  bio: 'I run The Anchor in Stanwell Moor with my husband Billy. After struggling with empty tables and overwhelming marketing tasks, I started using AI to make pub marketing faster and more effective. Everything I share is tested at The Anchor first.',
  image: '/images/peter-pitcher.jpg',
};

/*
 * Blog categories: simplified 8-category taxonomy.
 *
 * The slugs are in the URLs and on printed QR codes, so they never change. The
 * descriptions are copy and do change: five of them named pubs, breweries or
 * licensing in a section the company now presents as small business writing, while
 * the articles underneath them were always about cash flow, systems, events and
 * suppliers. The description is what a search result shows, so it is the half that
 * had to move.
 */
export const blogCategories: Category[] = [
  {
    slug: 'revenue-growth',
    name: 'Revenue & Growth',
    description: 'Cash flow, pricing, sales tactics and financial planning for small businesses',
  },
  {
    slug: 'operations',
    name: 'Operations',
    description: 'Day-to-day management, systems, compliance and licensing',
  },
  {
    slug: 'marketing',
    name: 'Marketing',
    description: 'Social media, online reputation, customer acquisition, and local marketing',
  },
  {
    slug: 'events',
    name: 'Events',
    description: 'Planning and running events, promotions and entertainment that fill quiet nights',
  },
  {
    slug: 'food-drink',
    name: 'Food & Drink',
    description: 'Menu strategies, food and beverage management, and offerings',
  },
  {
    slug: 'people',
    name: 'People',
    description: 'Recruitment, staff motivation, team leadership, and training',
  },
  {
    slug: 'property',
    name: 'Property',
    description: 'Location, refurbishment, and relationships with landlords and suppliers',
  },
  {
    slug: 'turnaround',
    name: 'Turnaround',
    description: 'Crisis management, winning trade back, and reconnecting with a local community',
  },
];

/**
 * The colour a category wears in the oj design system.
 *
 * The blog has eight categories and the design system has seven hue ids, and they
 * do not map one to one. The eight names stay: they are what the URLs use, what the
 * content is filed under, and what a reader recognises. This map exists only so a
 * category looks the same on the index, the category listing and the article, and
 * lives here rather than in three page files so it cannot drift between them.
 *
 * Pairs are by the shape of the problem, not by the wording: marketing sits with
 * revenue because both are about creating demand, property sits with events because
 * both are about what the visit feels like.
 */
export const CATEGORY_HUES: Record<string, CategoryId> = {
  'revenue-growth': 'demand',
  marketing: 'demand',
  events: 'experience',
  property: 'experience',
  'food-drink': 'margin',
  turnaround: 'margin',
  operations: 'operations',
  people: 'operations',
};

/** Falls back to the hospitality hue, which is the right answer for this library. */
export function getCategoryHue(slug: string): CategoryId {
  return CATEGORY_HUES[slug] ?? 'hospitality';
}

// Get category by slug
export function getCategoryBySlug(slug: string): Category | undefined {
  return blogCategories.find((cat) => cat.slug === slug);
}

// Sort posts by date (newest first)
export function sortPostsByDate(posts: BlogPost[]): BlogPost[] {
  return posts.sort((a, b) => {
    return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
  });
}

// Filter posts by category
export function filterPostsByCategory(posts: BlogPost[], categorySlug: string): BlogPost[] {
  return posts.filter((post) => post.category.slug === categorySlug);
}

// Get related posts based on category and tags
export function getRelatedPosts(
  posts: BlogPost[],
  currentPost: BlogPost,
  limit: number = 3
): BlogPost[] {
  // First, try to find posts in the same category
  const sameCategoryPosts = posts.filter(
    (post) => post.slug !== currentPost.slug && post.category.slug === currentPost.category.slug
  );

  // If we have enough posts from the same category, return them
  if (sameCategoryPosts.length >= limit) {
    return sameCategoryPosts.slice(0, limit);
  }

  // Otherwise, find posts with matching tags
  const postsWithMatchingTags = posts
    .filter(
      (post) =>
        post.slug !== currentPost.slug && post.tags.some((tag) => currentPost.tags.includes(tag))
    )
    .sort((a, b) => {
      // Sort by number of matching tags
      const aMatches = a.tags.filter((tag) => currentPost.tags.includes(tag)).length;
      const bMatches = b.tags.filter((tag) => currentPost.tags.includes(tag)).length;
      return bMatches - aMatches;
    });

  // Combine category posts and tag posts, remove duplicates
  const combined = [...sameCategoryPosts];
  postsWithMatchingTags.forEach((post) => {
    if (!combined.find((p) => p.slug === post.slug)) {
      combined.push(post);
    }
  });

  return combined.slice(0, limit);
}

// Generate meta description for blog posts
export function generateMetaDescription(post: BlogPost): string {
  if (post.seo.metaDescription) {
    return post.seo.metaDescription;
  }

  // Generate from excerpt, ensuring it includes problem/solution framing
  const excerpt = post.excerpt.substring(0, 150);
  return `${excerpt}... Real advice from a real licensee. No fluff, just proven strategies.`;
}

// Generate breadcrumbs for blog pages
export function generateBlogBreadcrumbs(
  type: 'home' | 'category' | 'post',
  category?: Category,
  postTitle?: string
): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: "The Licensee's Guide", href: '/guides' },
  ];

  if (type === 'category' && category) {
    breadcrumbs.push({ label: category.name });
  }

  if (type === 'post') {
    if (category) {
      breadcrumbs.push({
        label: category.name,
        href: `/guides/category/${category.slug}`,
      });
    }
    if (postTitle) {
      breadcrumbs.push({ label: postTitle });
    }
  }

  return breadcrumbs;
}
