/**
 * TypeScript interfaces for markdown content types
 */

export interface FrontMatter {
  title: string;
  slug: string;
  description?: string;
  publishedAt?: string;
  publishedDate?: string;
  updatedAt?: string;
  updatedDate?: string;
  author?: string;
  tags?: string[];
  categories?: string[];
  category?: string;
  featured?: boolean;
  draft?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  featuredImage?: string;
  keywords?: string[];
  client?: string;
  id?: string;
  question?: string;
  quickAnswer?: string;
  voiceSearchQueries?: string[];
  quickStats?: Array<{ label: string; value: string; description?: string }>;
  faqs?: Array<{ question: string; answer: string; isVoiceOptimized?: boolean }>;
  localSEO?: Record<string, unknown>;
  ctaSettings?: Record<string, unknown>;
  order?: number;
  [key: string]: unknown; // Allow additional custom fields
}

export interface BlogPost {
  slug: string;
  title: string;
  description?: string;
  content: string;
  excerpt?: string;
  publishedAt?: string;
  updatedAt?: string;
  author?: string;
  tags?: string[];
  categories?: string[];
  featured?: boolean;
  draft?: boolean;
  readingTime?: {
    text: string;
    minutes: number;
    time: number;
    words: number;
  };
  seo?: {
    title?: string;
    description?: string;
    ogImage?: string;
    canonicalUrl?: string;
  };
  frontMatter: FrontMatter;
  filePath: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  description?: string;
  content: string;
  excerpt?: string;
  client: string;
  industry?: string;
  challenge?: string;
  solution?: string;
  results?: string[];
  metrics?: {
    name: string;
    value: string;
    description?: string;
  }[];
  testimonial?: {
    quote: string;
    author: string;
    position?: string;
    company?: string;
    avatar?: string;
  };
  publishedAt?: string;
  updatedAt?: string;
  featured?: boolean;
  draft?: boolean;
  tags?: string[];
  categories?: string[];
  readingTime?: {
    text: string;
    minutes: number;
    time: number;
    words: number;
  };
  seo?: {
    title?: string;
    description?: string;
    ogImage?: string;
    canonicalUrl?: string;
  };
  frontMatter: FrontMatter;
  filePath: string;
}

export interface Service {
  slug: string;
  title: string;
  description?: string;
  content: string;
  excerpt?: string;
  shortDescription?: string;
  features?: string[];
  benefits?: string[];
  pricing?: {
    type: 'fixed' | 'hourly' | 'package' | 'custom';
    amount?: number;
    currency?: string;
    description?: string;
  };
  duration?: string;
  deliverables?: string[];
  process?: {
    step: number;
    title: string;
    description: string;
  }[];
  faqs?: FAQ[];
  caseStudies?: string[]; // slugs of related case studies
  testimonials?: {
    quote: string;
    author: string;
    position?: string;
    company?: string;
    avatar?: string;
  }[];
  publishedAt?: string;
  updatedAt?: string;
  featured?: boolean;
  draft?: boolean;
  tags?: string[];
  categories?: string[];
  readingTime?: {
    text: string;
    minutes: number;
    time: number;
    words: number;
  };
  seo?: {
    title?: string;
    description?: string;
    ogImage?: string;
    canonicalUrl?: string;
  };
  frontMatter: FrontMatter;
  filePath: string;
}

export interface FAQ {
  id?: string;
  question: string;
  answer: string;
  category?: string;
  tags?: string[];
  order?: number;
  featured?: boolean;
  publishedAt?: string;
  updatedAt?: string;
  frontMatter?: FrontMatter;
  filePath?: string;
}

export interface MarkdownFile {
  slug: string;
  content: string;
  frontMatter: FrontMatter;
  excerpt?: string;
  readingTime?: {
    text: string;
    minutes: number;
    time: number;
    words: number;
  };
  filePath: string;
}

export interface ParsedMarkdown {
  frontMatter: FrontMatter;
  content: string;
  excerpt?: string;
  readingTime?: {
    text: string;
    minutes: number;
    time: number;
    words: number;
  };
}

export interface MarkdownParseOptions {
  excerptLength?: number;
  excerptSeparator?: string;
  includeReadingTime?: boolean;
  stripHtml?: boolean;
}

export interface MarkdownFileFilter {
  published?: boolean;
  draft?: boolean;
  featured?: boolean;
  category?: string;
  tag?: string;
  author?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface MarkdownFileSortOptions {
  field: 'publishedAt' | 'updatedAt' | 'title' | 'slug';
  direction: 'asc' | 'desc';
}

// Error types for better error handling
export class MarkdownError extends Error {
  constructor(
    message: string,
    public filePath?: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'MarkdownError';
  }
}

export class FrontMatterError extends MarkdownError {
  constructor(message: string, filePath?: string, originalError?: Error) {
    super(message, filePath, originalError);
    this.name = 'FrontMatterError';
  }
}

export class FileNotFoundError extends MarkdownError {
  constructor(filePath: string) {
    super(`Markdown file not found: ${filePath}`, filePath);
    this.name = 'FileNotFoundError';
  }
}
