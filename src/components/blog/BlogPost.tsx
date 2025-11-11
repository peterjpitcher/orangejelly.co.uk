'use client';

import React, { useEffect, useMemo } from 'react';
import OptimizedImage from '@/components/OptimizedImage';
import Heading from '@/components/Heading';
import Text from '@/components/Text';
import Card from '@/components/Card';
import Button from '@/components/Button';
import ShareButtons from './ShareButtons';
import AuthorInfo from './AuthorInfo';
import RelatedPosts from './RelatedPosts';
import StickyCTA from './StickyCTA';
import QuickAnswer from './QuickAnswer';
import QuickStats from './QuickStats';
import { formatDate } from '@/lib/utils';
import { type BlogPost as BlogPostType } from '@/lib/blog';
import { getBlogImageSrc, getBlogImageAlt } from '@/lib/blog-images';
// MarkdownContent is now only used for PortableText (if needed)
import MarkdownContent from '@/components/MarkdownContent';
import { MESSAGES, URLS } from '@/lib/constants';
import { FAQListAdapter } from '@/components/adapters/FAQAdapter';
import TableOfContents, { type TocHeading } from './TableOfContents';
import AdjacentPostNav from './AdjacentPostNav';
import { type AdjacentPostNavItem } from './BlogPostServer';

interface BlogPostProps {
  post: BlogPostType & {
    contentHtml?: string;
    isPreProcessed?: boolean;
    quickAnswer?: string;
    quickStats?: Array<{ label: string; value: string; description?: string }>;
    voiceSearchQueries?: string[];
    localSEO?: {
      title?: string;
      description?: string;
      keywords?: string[];
    };
    faqs?: Array<{ question: string; answer: string; isVoiceOptimized?: boolean }>;
    isPortableText?: boolean;
    ctaSettings?: {
      title?: string;
      subtitle?: string;
      buttonText?: string;
      whatsappMessage?: string;
    };
  };
  relatedPosts?: BlogPostType[];
  adjacentPosts?: {
    previous?: AdjacentPostNavItem;
    next?: AdjacentPostNavItem;
  };
}

export default function BlogPost({ post, relatedPosts = [], adjacentPosts }: BlogPostProps) {
  // Track reading progress
  useEffect(() => {
    const updateProgress = () => {
      const article = document.getElementById('blog-article');
      if (!article) return;

      const totalHeight = article.clientHeight;
      const windowHeight = window.innerHeight;
      const position = window.scrollY;
      const progress = Math.min(100, (position / (totalHeight - windowHeight)) * 100);

      const progressBar = document.getElementById('reading-progress');
      if (progressBar) {
        progressBar.style.width = `${progress}%`;
      }
    };

    window.addEventListener('scroll', updateProgress);
    updateProgress();

    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  const tocHeadings = useMemo<TocHeading[]>(() => {
    if (!post.contentHtml) {
      return [];
    }
    return extractHeadings(post.contentHtml);
  }, [post.contentHtml]);

  const hasTableOfContents = tocHeadings.length > 1;
  const hasAdjacentPosts = Boolean(adjacentPosts?.previous || adjacentPosts?.next);

  return (
    <>
      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-cream z-50">
        <div id="reading-progress" className="h-full bg-orange transition-all duration-100 w-0" />
      </div>

      {/* Share buttons (floating on desktop) */}
      <ShareButtons url={`/licensees-guide/${post.slug}`} title={post.title} variant="floating" />

      {/* Sticky CTA */}
      <StickyCTA />

      <article id="blog-article">
        {/* Post metadata */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-4 text-sm text-charcoal/60 mb-6">
            <Button
              href={`/licensees-guide/category/${typeof post.category === 'string' ? post.category : post.category.slug}`}
              variant="ghost"
              size="small"
              className="text-orange hover:text-orange-dark font-medium text-sm p-0"
            >
              {typeof post.category === 'string' ? post.category : post.category.name}
            </Button>
            <span>•</span>
            {post.author && (
              <AuthorInfo
                author={{
                  name: post.author.name,
                  role: 'Founder & Licensee',
                  bio:
                    post.author.bio ||
                    'Founder of Orange Jelly Limited and licensee of The Anchor pub',
                  image: post.author.image || '/images/peter-pitcher.jpg',
                }}
                variant="compact"
              />
            )}
            <span>•</span>
            <time dateTime={post.publishedDate}>{formatDate(post.publishedDate)}</time>
            {post.readingTime && (
              <>
                <span>•</span>
                <span>{post.readingTime} min read</span>
              </>
            )}
          </div>

          {/* Share buttons (inline on mobile) */}
          <div className="lg:hidden mb-6">
            <ShareButtons
              url={`/licensees-guide/${post.slug}`}
              title={post.title}
              variant="inline"
            />
          </div>
        </header>

        {/* Featured image - always show, use default if not set */}
        <div className="relative aspect-[16/9] mb-8 -mx-4 sm:mx-0 sm:rounded-lg overflow-hidden">
          <OptimizedImage
            src={getBlogImageSrc(post.featuredImage, post.slug)}
            alt={getBlogImageAlt(post.featuredImage, post.title)}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
        </div>

        {/* Quick Answer for featured snippets */}
        {post.quickAnswer && <QuickAnswer answer={post.quickAnswer} className="mb-8" />}

        {/* Quick Stats for AI Overview extraction */}
        {post.quickStats && post.quickStats.length > 0 && (
          <QuickStats stats={post.quickStats} className="mb-8" />
        )}

        {hasTableOfContents && (
          <Card variant="bordered" className="mb-10">
            <TableOfContents headings={tocHeadings} />
          </Card>
        )}

        {/* Main content - removed empty sidebar */}
        <div className="mb-12">
          {post.isPortableText ? (
            <div className="prose prose-lg max-w-none">
              <MarkdownContent
                content={
                  Array.isArray(post.content)
                    ? JSON.stringify(post.content)
                    : (post.content as string)
                }
              />
            </div>
          ) : (
            // Use server-processed HTML (no client fallback)
            <div
              className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-charcoal prose-p:text-charcoal prose-li:text-charcoal prose-strong:text-charcoal prose-a:text-orange prose-a:underline hover:prose-a:text-orange-dark prose-blockquote:border-orange prose-blockquote:text-charcoal/80 prose-code:bg-gray-100 prose-code:text-charcoal prose-pre:bg-gray-100"
              dangerouslySetInnerHTML={{ __html: post.contentHtml! }}
            />
          )}
        </div>

        {/* FAQs Section for Voice Search */}
        {post.faqs && post.faqs.length > 0 && (
          <Card variant="bordered" className="mb-12">
            <Heading level={2} className="mb-6 flex items-center gap-2">
              <span>❓</span> Frequently Asked Questions
            </Heading>
            <FAQListAdapter
              useAccordion
              defaultOpen="faq-0"
              items={post.faqs.map((faq) => ({
                question: faq.question,
                answer: faq.answer,
                icon: faq.isVoiceOptimized ? '🎙️' : undefined,
              }))}
            />
          </Card>
        )}

        {/* Call to action */}
        <Card variant="bordered" className="bg-orange mb-12">
          <div className="text-center">
            <Heading level={3} align="center" color="white" className="mb-4">
              Need Help Implementing These Ideas?
            </Heading>
            <Text align="center" color="white" className="mb-6 max-w-2xl mx-auto">
              I've proven these strategies work at The Anchor and will start training other pubs
              from September 2025. Let's chat about your specific situation - no sales pitch, just
              licensee to licensee.
            </Text>
            <Button
              href={URLS.whatsapp(post.ctaSettings?.whatsappMessage || MESSAGES.whatsapp.blog)}
              variant="secondary"
              size="large"
              external
              className="!bg-white !text-charcoal hover:!bg-cream"
            >
              Get Help Now
            </Button>
          </div>
        </Card>

        {/* Author bio */}
        {post.author && (
          <AuthorInfo
            author={{
              name: post.author.name,
              role: 'Founder & Licensee',
              bio:
                post.author.bio || 'Founder of Orange Jelly Limited and licensee of The Anchor pub',
              image: post.author.image || '/images/peter-pitcher.jpg',
            }}
            variant="full"
          />
        )}

        {hasAdjacentPosts && adjacentPosts && <AdjacentPostNav adjacentPosts={adjacentPosts} />}

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-8 pt-8 border-t border-charcoal/10">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-charcoal/60">Tagged:</span>
              {post.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-cream rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <div className="mt-12">
          <RelatedPosts
            posts={relatedPosts.map((post) => ({
              slug: post.slug,
              title: post.title,
              excerpt: post.excerpt,
              publishedDate: post.publishedDate,
              category: {
                name: typeof post.category === 'string' ? post.category : post.category.name,
                slug:
                  typeof post.category === 'string'
                    ? (post.category as string).toLowerCase().replace(/\s+/g, '-')
                    : post.category.slug,
              },
              featuredImage: {
                src:
                  typeof post.featuredImage === 'string'
                    ? post.featuredImage
                    : '/images/blog/default.jpg',
                alt: post.title,
              },
              author: {
                name: post.author?.name || 'Peter Pitcher',
              },
              readingTime: post.readingTime || 5,
            }))}
          />
        </div>
      )}
    </>
  );
}

const HEADING_REGEX = /<h(2|3)([^>]*)>(.*?)<\/h\1>/gis;
const ID_REGEX = /id="([^"]+)"/i;

function extractHeadings(html: string): TocHeading[] {
  if (!html) return [];

  const headings: TocHeading[] = [];
  let match: RegExpExecArray | null;

  while ((match = HEADING_REGEX.exec(html)) !== null) {
    const level = match[1] === '3' ? 3 : 2;
    const attributes = match[2] || '';
    const idMatch = attributes.match(ID_REGEX);
    if (!idMatch) continue;

    const id = idMatch[1];
    const rawText = stripHtmlTags(match[3]);
    const title = decodeEntities(rawText).trim();

    if (title.length === 0) continue;

    headings.push({
      id,
      level: level as 2 | 3,
      title,
    });
  }

  return headings;
}

function stripHtmlTags(input: string): string {
  return input.replace(/<[^>]*>/g, ' ');
}

function decodeEntities(input: string): string {
  return input
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}
