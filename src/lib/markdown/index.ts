/**
 * Markdown utilities main export file
 * Provides easy imports for all markdown-related functionality
 */

// Main utilities
export {
  getAllMarkdownFiles,
  getMarkdownBySlug,
  parseMarkdownFile,
  markdownToHtml,
  extractExcerpt,
  calculateReadingTime,
  getAllBlogPosts,
  getAllCaseStudies,
  getAllServices,
  getAllFAQs,
} from './markdown';

// Types and interfaces
export type {
  FrontMatter,
  BlogPost,
  CaseStudy,
  Service,
  FAQ,
  MarkdownFile,
  ParsedMarkdown,
  MarkdownParseOptions,
  MarkdownFileFilter,
  MarkdownFileSortOptions,
} from './markdown-types';

// Error classes
export { MarkdownError, FrontMatterError, FileNotFoundError } from './markdown-types';

// Default export for convenience
export * from './markdown';
