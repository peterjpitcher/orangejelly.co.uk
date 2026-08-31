import fs from 'fs';
import path from 'path';

import matter from 'gray-matter';
import { z } from 'zod';

import { GROWTH_PROBLEMS } from '@/app/growth-problems/content';
import { calculateReadingTime } from '@/lib/blog';
import { getAllPostSlugs } from '@/lib/blog-md';

/**
 * The insights collection.
 *
 * A second body of content at `/insights`, separate from the 105 hospitality
 * articles at `/guides`. They cannot share a loader by accident: the
 * existing one hard-codes `/guides/<slug>` for everything it finds under
 * `content/blog`, so a new article dropped in there would leak into the hospitality
 * sitemap, feed and search index with a hospitality URL.
 *
 * THE DISCRIMINANT IS A FIELD, NOT THE PATH. `collection` is required in the front
 * matter and validated. Guessing the collection from the directory works right up
 * until somebody moves a file, and then it fails silently in the direction of the
 * wrong canonical URL.
 *
 * `problemPage` and `targetTerm` are both REQUIRED, which is a deliberate piece of
 * friction. The brand pack's rule is that no article exists only to attract
 * traffic, and the keyword research closed with fifteen terms. An article that maps
 * to neither needs a conscious decision rather than a habit.
 *
 * @see tasks/repositioning/SUB-SPECS.md part 4
 */
const insightsDirectory = path.join(process.cwd(), 'content/insights');

const PROBLEM_SLUGS = GROWTH_PROBLEMS.map((problem) => problem.slug);

export const insightFrontMatterSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().min(1),
  publishedDate: z.union([z.string(), z.date()]),
  status: z.enum(['draft', 'published']).default('published'),
  collection: z.literal('insights'),
  author: z.object({ name: z.string(), bio: z.string().optional() }),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  /**
   * The growth problem this article hands over to. Required, and checked against
   * the real pages: a typo here produces an article that leads nowhere, which is
   * the whole failure the NextStep mapping exists to prevent.
   */
  problemPage: z.string().refine((slug) => PROBLEM_SLUGS.includes(slug), {
    message: `problemPage must be one of: ${PROBLEM_SLUGS.join(', ')}`,
  }),
  /** The keyword this exists for. The build fails without it. */
  targetTerm: z.string().min(1),
  sector: z.enum(['professional-services', 'trades', 'hospitality']).optional(),
  /**
   * Set when the article is written from research rather than from work Orange
   * Jelly has done. It is surfaced on the page. The pack's rule is that no claim
   * goes out without evidence behind it, and that applies to implied experience.
   */
  researchLed: z.boolean().default(false),
  quickAnswer: z.string().optional(),
  faqs: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),
});

export type InsightFrontMatter = z.infer<typeof insightFrontMatterSchema>;

export interface Insight extends Omit<InsightFrontMatter, 'publishedDate'> {
  publishedDate: string;
  content: string;
  readingTime: number;
}

function toIsoDate(value: string | Date): string {
  return value instanceof Date ? value.toISOString().split('T')[0] : String(value);
}

export function getAllInsightSlugs(): string[] {
  if (!fs.existsSync(insightsDirectory)) return [];
  return fs
    .readdirSync(insightsDirectory)
    .filter((file) => file.endsWith('.md') && file.toLowerCase() !== 'readme.md')
    .map((file) => file.replace(/\.md$/, ''));
}

/**
 * Reads one insight. Throws on invalid front matter rather than returning null,
 * because an insight with a bad `problemPage` is a broken page and it should stop
 * the build rather than render a dead end.
 */
export function getInsightBySlug(slug: string): Insight | null {
  const fullPath = path.join(insightsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const { data, content } = matter(fs.readFileSync(fullPath, 'utf8'));
  const parsed = insightFrontMatterSchema.safeParse(data);

  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    throw new Error(`content/insights/${slug}.md has invalid front matter. ${issues}`);
  }

  return {
    ...parsed.data,
    publishedDate: toIsoDate(parsed.data.publishedDate),
    content,
    readingTime: calculateReadingTime(content),
  };
}

export interface InsightOptions {
  includeDrafts?: boolean;
  includeFuture?: boolean;
  now?: Date;
}

/** Newest first. Drafts and future dates are out unless explicitly asked for. */
export function getAllInsights(options: InsightOptions = {}): Insight[] {
  const now = options.now ?? new Date();

  return getAllInsightSlugs()
    .map((slug) => getInsightBySlug(slug))
    .filter((insight): insight is Insight => insight !== null)
    .filter((insight) => options.includeDrafts || insight.status !== 'draft')
    .filter((insight) => options.includeFuture || new Date(insight.publishedDate) <= now)
    .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
}

/**
 * Slugs claimed by both collections.
 *
 * A collision breaks canonicals and internal links in a way that is invisible from
 * either side: each collection renders its own page happily and only the sitemap
 * and the search index know the two are competing.
 */
export function getSlugCollisions(): string[] {
  const guide = new Set(getAllPostSlugs());
  return getAllInsightSlugs().filter((slug) => guide.has(slug));
}

export const INSIGHTS_PER_PAGE = 12;

export function getInsightPage(page: number): {
  insights: Insight[];
  total: number;
  pages: number;
} {
  const all = getAllInsights();
  const pages = Math.max(1, Math.ceil(all.length / INSIGHTS_PER_PAGE));
  const safePage = Math.min(Math.max(1, page), pages);
  const start = (safePage - 1) * INSIGHTS_PER_PAGE;

  return { insights: all.slice(start, start + INSIGHTS_PER_PAGE), total: all.length, pages };
}
