'use client';

import React, { useEffect } from 'react';
import OptimizedImage from '@/components/OptimizedImage';
import Heading from '@/components/Heading';
import Text from '@/components/Text';
import Card from '@/components/Card';
import Button from '@/components/Button';
import ShareButtons from './ShareButtons';
import AuthorInfo from './AuthorInfo';
import StickyCTA from './StickyCTA';
import QuickAnswer from './QuickAnswer';
import { formatDate } from '@/lib/utils';
import { type BlogPost as BlogPostType, type AdjacentPostNavItem, defaultAuthor } from '@/lib/blog';
import { getBlogImageSrc, getBlogImageAlt } from '@/lib/blog-images';
// MarkdownContent is now only used for PortableText (if needed)
import MarkdownContent from '@/components/MarkdownContent';
import { MESSAGES, URLS } from '@/lib/constants';
import AdjacentPostNav from './AdjacentPostNav';

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

export default function BlogPost({
  post,
  relatedPosts: _relatedPosts = [],
  adjacentPosts,
}: BlogPostProps) {
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
      <div className="fixed top-0 left-0 right-0 h-1 bg-cream z-50">
        <div id="reading-progress" className="h-full bg-teal transition-all duration-100 w-0" />
      </div>

      {/* Share buttons (floating on desktop) */}
      <ShareButtons url={`/licensees-guide/${post.slug}`} title={post.title} variant="floating" />

      {/* Sticky CTA */}
      <StickyCTA />

      <article id="blog-article" className="max-w-3xl mx-auto">
        {/* Post metadata */}
        <header className="mb-8 max-w-3xl mx-auto">
          <div className="flex flex-wrap items-center gap-4 text-sm text-charcoal/60 mb-6">
            <Button
              href={`/licensees-guide/category/${typeof post.category === 'string' ? post.category : post.category.slug}`}
              variant="ghost"
              size="small"
              className="text-teal hover:text-charcoal font-medium text-sm p-0"
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
              className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-charcoal prose-p:text-charcoal prose-li:text-charcoal prose-strong:text-charcoal prose-a:text-orange prose-a:underline hover:prose-a:text-orange-dark prose-blockquote:border-orange prose-blockquote:text-charcoal/80 prose-code:bg-gray-100 prose-code:text-charcoal prose-pre:bg-gray-100"
              dangerouslySetInnerHTML={{ __html: post.contentHtml! }}
            />
          )}
        </div>

        {/* Call to action */}
        <Card variant="bordered" className="bg-charcoal mb-12">
          <div className="text-center">
            <Heading level={3} align="center" color="white" className="mb-4">
              Need Help Implementing These Ideas?
            </Heading>
            <Text align="center" color="white" className="mb-6 max-w-2xl mx-auto">
              I've proven these strategies work at The Anchor. If you want help turning them into a
              simple plan for your pub, let's chat - no sales pitch, just licensee to licensee.
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

        <Card variant="bordered" className="mb-12">
          <div className="text-center">
            <Heading level={3} align="center" className="mb-4">
              Related services
            </Heading>
            <Text align="center" color="muted" className="mb-6 max-w-2xl mx-auto">
              If you'd rather copy a proven system than figure it out alone, these are the most
              requested pub marketing pages.
            </Text>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <Button href="/services/instagram-services-for-pubs" variant="outline" size="small">
              Instagram services for pubs
            </Button>
            <Button href="/services/facebook-services-for-pubs" variant="outline" size="small">
              Facebook services for pubs
            </Button>
            <Button href="/services/paid-social-for-pubs" variant="outline" size="small">
              Paid social for pubs
            </Button>
            <Button href="/services/content-creation-for-pubs" variant="outline" size="small">
              Content creation for pubs
            </Button>
            <Button href="/services/social-media-marketing-for-pubs" variant="outline" size="small">
              Social media marketing for pubs
            </Button>
            <Button href="/fix-my-pub" variant="outline" size="small">
              Fix my pub
            </Button>
          </div>
        </Card>

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
    </>
  );
}
