'use client';

import { NextStep, ShareRow, StickyCTA } from '@/components/oj';
import { getNextStepFor } from '@/lib/article-next-step';
import { getBaseUrl } from '@/lib/site-config';
import React, { useEffect } from 'react';
import Heading from '@/components/Heading';
import Text from '@/components/Text';
import Card from '@/components/Card';
import Button from '@/components/Button';
import TrackedButton from '@/components/TrackedButton';
import ShareButtons from './ShareButtons';
import AuthorInfo from './AuthorInfo';
import QuickAnswer from './QuickAnswer';
import { formatDate } from '@/lib/utils';
import { type BlogPost as BlogPostType, type AdjacentPostNavItem, defaultAuthor } from '@/lib/blog';
// MarkdownContent is now only used for PortableText (if needed)
import MarkdownContent from '@/components/MarkdownContent';
import AdjacentPostNav from './AdjacentPostNav';
import RelatedPosts from './RelatedPosts';

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
  const nextStepLinks = getNextStepFor(post.slug);
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

  const categorySlug = typeof post.category === 'string' ? post.category : post.category.slug;
  const hasAdjacentPosts = Boolean(adjacentPosts?.previous || adjacentPosts?.next);
  const quickAnswerText = (
    post.quickAnswer ||
    post.excerpt ||
    post.seo?.metaDescription ||
    ''
  ).trim();
  const author = post.author || defaultAuthor;

  return (
    <>
      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-surface z-50">
        <div
          id="reading-progress"
          className="h-full bg-blue-support transition-all duration-100 w-0"
        />
      </div>

      {/* Share buttons (floating on desktop) */}
      <ShareButtons url={`/guides/${post.slug}`} title={post.title} variant="floating" />

      {/* Sticky CTA */}
      {/*
        The site's sticky bar, not the blog's own.

        The blog one offered "Packages for every pub" and "See Our Packages" pointing
        at /ways-to-work, on 106 pages: packages at prices this site removed (D3),
        and a destination that retires at phase 4. Its mobile bar was also white text
        on the brand orange, the 2.97:1 combination this release moved off.
      */}
      <StickyCTA
        note="Not sure this is your actual problem?"
        label="Let's talk"
        href="/start-here"
      />

      <article id="blog-article" className="measure">
        {/* Post metadata */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-4 text-sm text-brand-base/75 mb-6">
            <Button
              href={`/guides/category/${typeof post.category === 'string' ? post.category : post.category.slug}`}
              variant="ghost"
              size="small"
              className="text-blue-support hover:text-brand-base font-medium text-sm p-0"
            >
              {typeof post.category === 'string' ? post.category : post.category.name}
            </Button>
            <span>•</span>
            <AuthorInfo
              author={{
                name: author.name,
                role: 'Founder & Licensee',
                bio: author.bio || 'Founder of Orange Jelly Limited and licensee of The Anchor pub',
                image: author.image || '/images/peter-pitcher.jpg',
              }}
              variant="compact"
            />
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
              url={`/guides/${post.slug}`}
              title={post.title}
              variant="inline"
            />
          </div>
        </header>

        {/* Category hero handles the visual header, no featured image needed */}

        {/* Quick Answer for featured snippets */}
        <QuickAnswer answer={quickAnswerText} className="mb-8" />

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
              className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-brand-base prose-p:text-brand-base prose-li:text-brand-base prose-strong:text-brand-base prose-a:text-orange-dark prose-a:underline hover:prose-a:text-orange-dark prose-blockquote:border-orange prose-blockquote:text-brand-base/80 prose-code:bg-gray-100 prose-code:text-brand-base prose-pre:bg-gray-100"
              dangerouslySetInnerHTML={{ __html: post.contentHtml! }}
            />
          )}
        </div>

        {/* Author bio */}
        <AuthorInfo
          author={{
            name: author.name,
            role: 'Founder & Licensee',
            bio: author.bio || 'Founder of Orange Jelly Limited and licensee of The Anchor pub',
            image: author.image || '/images/peter-pitcher.jpg',
          }}
          variant="full"
        />

        {hasAdjacentPosts && adjacentPosts && <AdjacentPostNav adjacentPosts={adjacentPosts} />}

        {/* Related posts */}
        <RelatedPosts posts={relatedPosts} currentPostSlug={post.slug} />

        {/*
         * Where this article leads, and the way to pass it on.
         *
         * Added to the existing template rather than replacing it. These 105
         * articles carry 92.9% of the site's search clicks, and thirty of them
         * carry 95% of that, so the schema, canonicals, breadcrumbs and OG
         * handling above are deliberately untouched.
         *
         * The next step takes somebody who arrived from Google asking a pub
         * question and offers them the business problem underneath it, which is
         * the entire reason the hospitality library still earns its place in the
         * new positioning.
         */}
        {nextStepLinks.length > 0 && (
          <div className="mt-10">
            <NextStep from="article" links={nextStepLinks} />
          </div>
        )}

        {/*
          One call to action, and it is the site's call to action.

          What used to be here was three competing blocks: a card selling packages,
          a card of six links to /capabilities, and a category bridge. Every
          destination among them retires at phase 4, and the copy offered "our
          packages" with "clear pricing" on a site that D3 removed pricing from. On
          106 articles.

          The next-step chain above already does the useful work of naming the growth
          problem underneath the article. This is the invitation that follows it.
        */}
        <Card variant="bordered" className="bg-brand-base mb-12 mt-10">
          <div className="text-center">
            <Heading level={3} align="center" color="white" className="mb-4">
              Not sure this is your actual problem?
            </Heading>
            <Text align="center" color="white" className="mb-6">
              That is the more common situation, and it is what the first conversation is for. An
              hour, free, going through what is happening in your business before anybody suggests a
              fix.
            </Text>
            <TrackedButton
              eventName="guide_cta_click"
              eventProperties={{
                post_slug: post.slug,
                category: categorySlug,
                cta: 'blog_bring_us_the_problem',
              }}
              href="/start-here"
              variant="primary"
              size="large"
            >
              Let's talk
            </TrackedButton>
          </div>
        </Card>

        <div className="mt-8">
          <ShareRow url={`${getBaseUrl()}/guides/${post.slug}`} title={post.title} />
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-8 pt-8 border-t border-brand-base/10">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-brand-base/75">Tagged:</span>
              {post.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-surface rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}
