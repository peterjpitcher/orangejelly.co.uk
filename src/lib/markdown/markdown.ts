/**
 * Comprehensive markdown utilities with error handling
 * Production-ready utilities for working with markdown files
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import readingTime from 'reading-time';
import {
  type BlogPost,
  type CaseStudy,
  type Service,
  type FAQ,
  type ParsedMarkdown,
  type FrontMatter,
  type MarkdownParseOptions,
  type MarkdownFileFilter,
  type MarkdownFileSortOptions,
  MarkdownError,
  FrontMatterError,
  FileNotFoundError,
} from './markdown-types';

/**
 * Default options for markdown parsing
 */
const DEFAULT_PARSE_OPTIONS: MarkdownParseOptions = {
  excerptLength: 160,
  excerptSeparator: '<!--more-->',
  includeReadingTime: true,
  stripHtml: true,
};

/**
 * Get all markdown files from a directory
 * @param directory - The directory to search for markdown files
 * @param recursive - Whether to search recursively in subdirectories
 * @returns Array of file paths
 */
export function getAllMarkdownFiles(directory: string, recursive: boolean = false): string[] {
  try {
    if (!fs.existsSync(directory)) {
      throw new MarkdownError(`Directory not found: ${directory}`);
    }

    const files: string[] = [];
    const items = fs.readdirSync(directory, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(directory, item.name);

      if (item.isDirectory() && recursive) {
        files.push(...getAllMarkdownFiles(fullPath, true));
      } else if (item.isFile() && path.extname(item.name) === '.md' && item.name !== 'README.md') {
        files.push(fullPath);
      }
    }

    return files.sort();
  } catch (error) {
    if (error instanceof MarkdownError) {
      throw error;
    }
    throw new MarkdownError(
      `Failed to read markdown files from directory: ${directory}`,
      directory,
      error as Error
    );
  }
}

/**
 * Get a markdown file by slug from a directory
 * @param directory - The directory to search
 * @param slug - The slug to match (filename without extension)
 * @param recursive - Whether to search recursively
 * @returns File path or null if not found
 */
export function getMarkdownBySlug(
  directory: string,
  slug: string,
  recursive: boolean = false
): string | null {
  try {
    const files = getAllMarkdownFiles(directory, recursive);

    for (const filePath of files) {
      const filename = path.basename(filePath, '.md');
      if (filename === slug) {
        return filePath;
      }

      // Also check frontmatter for slug field
      try {
        const { data } = matter(fs.readFileSync(filePath, 'utf8'));
        if (data.slug === slug) {
          return filePath;
        }
      } catch {
        // Continue checking other files if this one fails to parse
        continue;
      }
    }

    return null;
  } catch (error) {
    if (error instanceof MarkdownError) {
      throw error;
    }
    throw new MarkdownError(
      `Failed to find markdown file with slug: ${slug}`,
      undefined,
      error as Error
    );
  }
}

/**
 * Parse a markdown file with frontmatter
 * @param filePath - Path to the markdown file
 * @param options - Parsing options
 * @returns Parsed markdown data
 */
export function parseMarkdownFile(
  filePath: string,
  options: MarkdownParseOptions = {}
): ParsedMarkdown {
  const opts = { ...DEFAULT_PARSE_OPTIONS, ...options };

  try {
    if (!fs.existsSync(filePath)) {
      throw new FileNotFoundError(filePath);
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    // Validate frontmatter
    if (!data.title) {
      throw new FrontMatterError('Missing required frontmatter field: title', filePath);
    }

    // Generate slug from filename if not provided
    if (!data.slug) {
      data.slug = path.basename(filePath, '.md');
    }

    const statusValue = typeof data.status === 'string' ? data.status.toLowerCase().trim() : null;
    if (statusValue === 'draft') {
      data.draft = true;
    } else if (statusValue === 'published' && data.draft === undefined) {
      data.draft = false;
    }

    if (!data.publishedAt && data.publishedDate) {
      data.publishedAt = data.publishedDate;
    }

    const frontMatter: FrontMatter = {
      ...data,
      title: data.title,
      slug: data.slug,
    };

    // Extract excerpt
    let excerpt: string | undefined;
    if (content.includes(opts.excerptSeparator!)) {
      excerpt = content.split(opts.excerptSeparator!)[0].trim();
    } else if (opts.excerptLength! > 0) {
      excerpt = extractExcerpt(content, opts.excerptLength!, opts.stripHtml!);
    }

    // Calculate reading time
    let readingTimeData;
    if (opts.includeReadingTime) {
      readingTimeData = calculateReadingTime(content);
    }

    return {
      frontMatter,
      content,
      excerpt,
      readingTime: readingTimeData,
    };
  } catch (error) {
    if (error instanceof MarkdownError) {
      throw error;
    }
    throw new MarkdownError(`Failed to parse markdown file: ${filePath}`, filePath, error as Error);
  }
}

/**
 * Convert markdown content to HTML
 * @param markdown - Markdown content
 * @param sanitize - Whether to sanitize HTML (default: true)
 * @returns HTML string
 */
export async function markdownToHtml(markdown: string, sanitize: boolean = true): Promise<string> {
  try {
    const result = await remark().use(html, { sanitize }).process(markdown);

    return result.toString();
  } catch (error) {
    throw new MarkdownError('Failed to convert markdown to HTML', undefined, error as Error);
  }
}

/**
 * Extract excerpt from content
 * @param content - Content to extract excerpt from
 * @param length - Maximum length of excerpt
 * @param stripHtml - Whether to strip HTML tags
 * @returns Excerpt string
 */
export function extractExcerpt(
  content: string,
  length: number = 160,
  stripHtml: boolean = true
): string {
  try {
    let text = content;

    // Strip HTML tags if requested
    if (stripHtml) {
      text = text.replace(/<[^>]*>/g, '');
    }

    // Remove markdown syntax
    text = text
      .replace(/#{1,6}\s+/g, '') // Headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
      .replace(/\*(.*?)\*/g, '$1') // Italic
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Links
      .replace(/`(.*?)`/g, '$1') // Inline code
      .replace(/```[\s\S]*?```/g, '') // Code blocks
      .replace(/^\s*[-*+]\s+/gm, '') // List items
      .replace(/^\s*\d+\.\s+/gm, '') // Numbered lists
      .replace(/\n{2,}/g, ' ') // Multiple newlines
      .trim();

    // Truncate to specified length
    if (text.length > length) {
      text = text.substring(0, length);
      // Find the last complete word
      const lastSpace = text.lastIndexOf(' ');
      if (lastSpace > length * 0.8) {
        text = text.substring(0, lastSpace);
      }
      text += '...';
    }

    return text;
  } catch (error) {
    throw new MarkdownError('Failed to extract excerpt from content', undefined, error as Error);
  }
}

/**
 * Calculate reading time for content
 * @param content - Content to analyze
 * @returns Reading time data
 */
export function calculateReadingTime(content: string): {
  text: string;
  minutes: number;
  time: number;
  words: number;
} {
  try {
    return readingTime(content);
  } catch (error) {
    throw new MarkdownError('Failed to calculate reading time', undefined, error as Error);
  }
}

/**
 * Get all blog posts from a directory
 * @param directory - Directory containing blog markdown files
 * @param filter - Optional filter criteria
 * @param sort - Optional sort criteria
 * @returns Array of blog posts
 */
export function getAllBlogPosts(
  directory: string,
  filter?: MarkdownFileFilter,
  sort?: MarkdownFileSortOptions
): BlogPost[] {
  try {
    const files = getAllMarkdownFiles(directory);
    const posts: BlogPost[] = [];

    for (const filePath of files) {
      try {
        const parsed = parseMarkdownFile(filePath);

        // Apply filters
        if (filter && !matchesFilter(parsed.frontMatter, filter)) {
          continue;
        }

        const post: BlogPost = {
          ...parsed.frontMatter,
          content: parsed.content,
          excerpt: parsed.excerpt,
          readingTime: parsed.readingTime,
          // Map publishedDate to publishedAt for consistency
          publishedAt: parsed.frontMatter.publishedDate || parsed.frontMatter.publishedAt,
          seo: {
            title: parsed.frontMatter.seoTitle,
            description: parsed.frontMatter.seoDescription,
            ogImage: parsed.frontMatter.ogImage,
            canonicalUrl: parsed.frontMatter.canonicalUrl,
          },
          frontMatter: parsed.frontMatter,
          filePath,
        };

        posts.push(post);
      } catch (error) {
        console.warn(`Failed to parse blog post: ${filePath}`, error);
        continue;
      }
    }

    // Apply sorting
    if (sort) {
      posts.sort((a, b) => {
        const aValue = a[sort.field] || '';
        const bValue = b[sort.field] || '';

        // Special handling for date fields
        if (sort.field === 'publishedAt' || sort.field === 'updatedAt') {
          const aDate = new Date(aValue);
          const bDate = new Date(bValue);

          if (sort.direction === 'desc') {
            return bDate.getTime() - aDate.getTime();
          }
          return aDate.getTime() - bDate.getTime();
        }

        // Regular string comparison for other fields
        if (sort.direction === 'desc') {
          return aValue < bValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    return posts;
  } catch (error) {
    throw new MarkdownError(
      `Failed to get blog posts from directory: ${directory}`,
      directory,
      error as Error
    );
  }
}

/**
 * Get all case studies from a directory
 * @param directory - Directory containing case study markdown files
 * @param filter - Optional filter criteria
 * @param sort - Optional sort criteria
 * @returns Array of case studies
 */
export function getAllCaseStudies(
  directory: string,
  filter?: MarkdownFileFilter,
  sort?: MarkdownFileSortOptions
): CaseStudy[] {
  try {
    const files = getAllMarkdownFiles(directory);
    const caseStudies: CaseStudy[] = [];

    for (const filePath of files) {
      try {
        const parsed = parseMarkdownFile(filePath);

        // Apply filters
        if (filter && !matchesFilter(parsed.frontMatter, filter)) {
          continue;
        }

        // Validate required fields for case studies
        if (!parsed.frontMatter.client) {
          console.warn(`Case study missing client field: ${filePath}`);
          continue;
        }

        const caseStudy: CaseStudy = {
          ...parsed.frontMatter,
          client: parsed.frontMatter.client,
          content: parsed.content,
          excerpt: parsed.excerpt,
          readingTime: parsed.readingTime,
          seo: {
            title: parsed.frontMatter.seoTitle,
            description: parsed.frontMatter.seoDescription,
            ogImage: parsed.frontMatter.ogImage,
            canonicalUrl: parsed.frontMatter.canonicalUrl,
          },
          frontMatter: parsed.frontMatter,
          filePath,
        };

        caseStudies.push(caseStudy);
      } catch (error) {
        console.warn(`Failed to parse case study: ${filePath}`, error);
        continue;
      }
    }

    // Apply sorting
    if (sort) {
      caseStudies.sort((a, b) => {
        const aValue = a[sort.field] || '';
        const bValue = b[sort.field] || '';

        if (sort.direction === 'desc') {
          return aValue < bValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    return caseStudies;
  } catch (error) {
    throw new MarkdownError(
      `Failed to get case studies from directory: ${directory}`,
      directory,
      error as Error
    );
  }
}

/**
 * Get all services from a directory
 * @param directory - Directory containing service markdown files
 * @param filter - Optional filter criteria
 * @param sort - Optional sort criteria
 * @returns Array of services
 */
export function getAllServices(
  directory: string,
  filter?: MarkdownFileFilter,
  sort?: MarkdownFileSortOptions
): Service[] {
  try {
    const files = getAllMarkdownFiles(directory);
    const services: Service[] = [];

    for (const filePath of files) {
      try {
        const parsed = parseMarkdownFile(filePath);

        // Apply filters
        if (filter && !matchesFilter(parsed.frontMatter, filter)) {
          continue;
        }

        const service: Service = {
          ...parsed.frontMatter,
          content: parsed.content,
          excerpt: parsed.excerpt,
          readingTime: parsed.readingTime,
          seo: {
            title: parsed.frontMatter.seoTitle,
            description: parsed.frontMatter.seoDescription,
            ogImage: parsed.frontMatter.ogImage,
            canonicalUrl: parsed.frontMatter.canonicalUrl,
          },
          frontMatter: parsed.frontMatter,
          filePath,
        };

        services.push(service);
      } catch (error) {
        console.warn(`Failed to parse service: ${filePath}`, error);
        continue;
      }
    }

    // Apply sorting
    if (sort) {
      services.sort((a, b) => {
        const aValue = a[sort.field] || '';
        const bValue = b[sort.field] || '';

        if (sort.direction === 'desc') {
          return aValue < bValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    return services;
  } catch (error) {
    throw new MarkdownError(
      `Failed to get services from directory: ${directory}`,
      directory,
      error as Error
    );
  }
}

/**
 * Get all FAQs from a directory
 * @param directory - Directory containing FAQ markdown files
 * @returns Array of FAQs
 */
export function getAllFAQs(directory: string): FAQ[] {
  try {
    const files = getAllMarkdownFiles(directory);
    const faqs: FAQ[] = [];

    for (const filePath of files) {
      try {
        const parsed = parseMarkdownFile(filePath);

        // Validate required fields for FAQs
        if (!parsed.frontMatter.question) {
          console.warn(`FAQ missing question field: ${filePath}`);
          continue;
        }

        const faq: FAQ = {
          id: parsed.frontMatter.id,
          question: parsed.frontMatter.question,
          answer: parsed.content,
          category: parsed.frontMatter.category,
          tags: parsed.frontMatter.tags,
          order: parsed.frontMatter.order,
          featured: parsed.frontMatter.featured,
          publishedAt: parsed.frontMatter.publishedAt,
          updatedAt: parsed.frontMatter.updatedAt,
          frontMatter: parsed.frontMatter,
          filePath,
        };

        faqs.push(faq);
      } catch (error) {
        console.warn(`Failed to parse FAQ: ${filePath}`, error);
        continue;
      }
    }

    // Sort by order field if available, then by question
    faqs.sort((a, b) => {
      if (a.order && b.order) {
        return a.order - b.order;
      }
      if (a.order) return -1;
      if (b.order) return 1;
      return a.question.localeCompare(b.question);
    });

    return faqs;
  } catch (error) {
    throw new MarkdownError(
      `Failed to get FAQs from directory: ${directory}`,
      directory,
      error as Error
    );
  }
}

/**
 * Helper function to check if frontmatter matches filter criteria
 */
function matchesFilter(frontMatter: FrontMatter, filter: MarkdownFileFilter): boolean {
  if (filter.published !== undefined && !frontMatter.publishedAt === filter.published) {
    return false;
  }

  if (filter.draft !== undefined && !!frontMatter.draft !== filter.draft) {
    return false;
  }

  if (filter.featured !== undefined && !!frontMatter.featured !== filter.featured) {
    return false;
  }

  if (
    filter.category &&
    frontMatter.categories &&
    !frontMatter.categories.includes(filter.category)
  ) {
    return false;
  }

  if (filter.tag && frontMatter.tags && !frontMatter.tags.includes(filter.tag)) {
    return false;
  }

  if (filter.author && frontMatter.author !== filter.author) {
    return false;
  }

  if (filter.dateFrom && frontMatter.publishedAt) {
    const publishedDate = new Date(frontMatter.publishedAt);
    if (publishedDate < filter.dateFrom) {
      return false;
    }
  }

  if (filter.dateTo && frontMatter.publishedAt) {
    const publishedDate = new Date(frontMatter.publishedAt);
    if (publishedDate > filter.dateTo) {
      return false;
    }
  }

  return true;
}

// Re-export types for convenience
export * from './markdown-types';
