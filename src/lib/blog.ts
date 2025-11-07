import { type BreadcrumbItem } from '@/components/Breadcrumb';

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
  bio: 'I run The Anchor in Stanwell Moor with my husband Billy. After struggling with empty tables and overwhelming marketing tasks, I discovered how AI could transform pub marketing. Now I help other licensees implement the same strategies that saved our pub.',
  image: '/images/peter-pitcher.jpg',
};

// Blog categories
export const blogCategories: Category[] = [
  {
    slug: 'empty-pub-solutions',
    name: 'Empty Pub Solutions',
    description: 'Proven strategies to fill empty tables and boost footfall',
  },
  {
    slug: 'social-media',
    name: 'Social Media',
    description: 'Make social media work for your pub without wasting hours',
  },
  {
    slug: 'competition',
    name: 'Competition',
    description: 'Stand out from chains and nearby pubs',
  },
  {
    slug: 'food-drink',
    name: 'Food & Drink',
    description: 'Menu strategies that increase sales and profits',
  },
  {
    slug: 'events-promotions',
    name: 'Events & Promotions',
    description: 'Events and promotions that actually bring customers in',
  },
  {
    slug: 'toolkits',
    name: 'Toolkits & Templates',
    description: 'Ready-to-use playbooks, guides, and assets for busy licensees',
  },
];

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
    { label: "The Licensee's Guide", href: '/licensees-guide' },
  ];

  if (type === 'category' && category) {
    breadcrumbs.push({ label: category.name });
  }

  if (type === 'post') {
    if (category) {
      breadcrumbs.push({
        label: category.name,
        href: `/licensees-guide/category/${category.slug}`,
      });
    }
    if (postTitle) {
      breadcrumbs.push({ label: postTitle });
    }
  }

  return breadcrumbs;
}
