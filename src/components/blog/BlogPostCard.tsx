'use client';

import Link from 'next/link';
import Card from '@/components/Card';
import Heading from '@/components/Heading';
import Text from '@/components/Text';
import { formatDate } from '@/lib/utils';
import { getCategoryGradient, getCategoryLabel } from '@/lib/category-colours';

interface BlogPostCardProps {
  post: {
    slug: string;
    title: string;
    excerpt: string;
    publishedDate: string;
    category: {
      name: string;
      slug: string;
    };
    featuredImage?:
      | string
      | {
          src?: string;
          alt?: string;
          asset?: {
            _id?: string;
            url?: string;
          };
        };
    author: {
      name: string;
    };
    readingTime: number;
  };
  featured?: boolean;
}

export default function BlogPostCard({ post, featured = false }: BlogPostCardProps) {
  const postUrl = `/licensees-guide/${post.slug}`;
  const categorySlug = post.category?.slug || 'operations';
  const gradient = getCategoryGradient(categorySlug);
  const categoryLabel = getCategoryLabel(categorySlug);

  if (featured) {
    return (
      <Card variant="bordered" className="overflow-hidden">
        <Link href={postUrl} className="group">
          <div className="grid md:grid-cols-2 gap-0">
            <div
              className="relative aspect-[16/9] md:aspect-auto md:min-h-[280px] flex items-center justify-center p-8"
              style={{ background: gradient }}
            >
              <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 11px)',
                }}
              />
              <div className="relative text-center">
                <span className="inline-block bg-white/20 text-white px-3 py-1 rounded-full text-xs font-medium mb-3">
                  Featured
                </span>
                <Text size="lg" color="white" align="center" className="text-white/90 font-medium">
                  {categoryLabel}
                </Text>
              </div>
            </div>

            <div className="p-6 flex flex-col justify-center">
              <div
                className="text-sm font-medium mb-2 inline-block cursor-pointer"
                style={{
                  color: getCategoryGradient(categorySlug).includes('#') ? categorySlug : undefined,
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.location.href = `/licensees-guide/category/${post.category.slug}`;
                }}
              >
                <span
                  className="inline-block w-2 h-2 rounded-full mr-1.5"
                  style={{
                    backgroundColor: gradient
                      .split(',')[0]
                      ?.replace('linear-gradient(135deg', '')
                      .trim(),
                  }}
                />
                {categoryLabel}
              </div>

              <Heading level={2} className="mb-3 group-hover:text-orange transition-colors">
                {post.title}
              </Heading>

              <Text color="muted" className="mb-4 line-clamp-3">
                {post.excerpt}
              </Text>

              <div className="flex items-center gap-4 text-sm text-charcoal/60">
                <span>{post.author.name}</span>
                <span>&middot;</span>
                <time dateTime={post.publishedDate}>{formatDate(post.publishedDate)}</time>
                <span>&middot;</span>
                <span>{post.readingTime} min read</span>
              </div>
            </div>
          </div>
        </Link>
      </Card>
    );
  }

  return (
    <Card variant="bordered" className="overflow-hidden h-full flex flex-col">
      <Link href={postUrl} className="group flex flex-col h-full">
        <div
          className="relative aspect-[16/9] overflow-hidden flex items-center justify-center"
          style={{ background: gradient }}
        >
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 11px)',
            }}
          />
          <Text
            size="sm"
            color="white"
            align="center"
            weight="medium"
            className="relative text-white/80 uppercase tracking-wider"
          >
            {categoryLabel}
          </Text>
        </div>

        <div className="p-6 flex flex-col flex-grow">
          <div
            className="text-sm font-medium mb-2 inline-block cursor-pointer hover:underline"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.location.href = `/licensees-guide/category/${post.category.slug}`;
            }}
          >
            <span
              className="inline-block w-2 h-2 rounded-full mr-1.5 align-middle"
              style={{
                backgroundColor: gradient
                  .split(',')[0]
                  ?.replace('linear-gradient(135deg', '')
                  .trim(),
              }}
            />
            {categoryLabel}
          </div>

          <Heading level={3} className="mb-2 group-hover:text-orange transition-colors">
            {post.title}
          </Heading>

          <Text color="muted" className="mb-4 line-clamp-2 flex-grow">
            {post.excerpt}
          </Text>

          <div className="flex items-center gap-3 text-sm text-charcoal/60">
            <time dateTime={post.publishedDate}>{formatDate(post.publishedDate)}</time>
            <span>&middot;</span>
            <span>{post.readingTime} min read</span>
          </div>
        </div>
      </Link>
    </Card>
  );
}
