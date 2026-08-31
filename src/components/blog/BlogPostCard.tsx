'use client';

import Image from 'next/image';
import Link from 'next/link';
import Card from '@/components/Card';
import Heading from '@/components/Heading';
import Text from '@/components/Text';
import { formatDate } from '@/lib/utils';
import { getCategoryColour, getCategoryGradient, getCategoryLabel } from '@/lib/category-colours';

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
  const postUrl = `/guides/${post.slug}`;
  const categorySlug = post.category?.slug || 'operations';
  const gradient = getCategoryGradient(categorySlug);
  const colour = getCategoryColour(categorySlug);
  const categoryLabel = getCategoryLabel(categorySlug);
  const featuredImageSrc =
    typeof post.featuredImage === 'string'
      ? post.featuredImage
      : post.featuredImage?.src || post.featuredImage?.asset?.url;

  if (featured) {
    return (
      <Card variant="bordered" className="overflow-hidden">
        <Link href={postUrl} className="group">
          <div className="grid md:grid-cols-2 gap-0">
            <div
              className="relative aspect-[16/9] md:aspect-auto md:min-h-[280px] overflow-hidden flex items-center justify-center p-8"
              style={{ background: gradient }}
            >
              {featuredImageSrc && (
                <Image
                  src={featuredImageSrc}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              )}
              <div className="absolute inset-0 bg-brand-base/45" aria-hidden="true" />
              {/*
                Same reasoning as the standard card above, and the "Featured" pill had
                the worse version of the problem: white text on a 20% white fill over a
                photograph, which is unreadable the moment the photo is pale.
              */}
              <div className="relative text-center">
                <span className="mb-3 inline-block rounded-full bg-brand-base px-3 py-1 text-xs font-medium text-white">
                  Featured
                </span>
                <Text
                  size="lg"
                  color="white"
                  align="center"
                  className="inline-block rounded bg-brand-base px-3 py-1 font-medium text-white"
                >
                  {categoryLabel}
                </Text>
              </div>
            </div>

            <div className="p-6 flex flex-col justify-center">
              <div
                className="text-sm font-medium mb-2 inline-block cursor-pointer hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.location.href = `/guides/category/${categorySlug}`;
                }}
              >
                <span
                  className="inline-block w-2 h-2 rounded-full mr-1.5 align-middle"
                  style={{ backgroundColor: colour }}
                />
                {categoryLabel}
              </div>

              <Heading level={2} className="mb-3 group-hover:text-orange-dark transition-colors">
                {post.title}
              </Heading>

              <Text color="muted" className="mb-4 line-clamp-3">
                {post.excerpt}
              </Text>

              <div className="flex items-center gap-4 text-sm text-brand-base/75">
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
          {featuredImageSrc && (
            <Image
              src={featuredImageSrc}
              alt=""
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          )}
          <div className="absolute inset-0 bg-brand-base/35" aria-hidden="true" />
          {/*
            A solid block behind the label, not a tint over the photo.

            The label used to be white at 80% sitting on this 35% scrim, and against
            the gradient fallback that is 5.40:1 and perfectly fine. Against the real
            photographs it is not: measured across all 105 hero images, 80 of them
            leave it under the 4.5:1 that text needs, and the worst is 1.83:1.

            A scrim cannot fix that. Getting every photo above 4.5:1 needs it at
            roughly 74%, which hides most of the picture, and the picture is the point
            of having one. A solid block is 13.58:1 on every card regardless of what
            is behind it, and the photo stays visible around it.
          */}
          <Text
            size="sm"
            color="white"
            align="center"
            weight="medium"
            className="relative rounded bg-brand-base px-2.5 py-1 uppercase tracking-wider text-white"
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
              window.location.href = `/guides/category/${categorySlug}`;
            }}
          >
            <span
              className="inline-block w-2 h-2 rounded-full mr-1.5 align-middle"
              style={{ backgroundColor: colour }}
            />
            {categoryLabel}
          </div>

          <Heading level={3} className="mb-2 group-hover:text-orange-dark transition-colors">
            {post.title}
          </Heading>

          <Text color="muted" className="mb-4 line-clamp-2 flex-grow">
            {post.excerpt}
          </Text>

          <div className="flex items-center gap-3 text-sm text-brand-base/75">
            <time dateTime={post.publishedDate}>{formatDate(post.publishedDate)}</time>
            <span>&middot;</span>
            <span>{post.readingTime} min read</span>
          </div>
        </div>
      </Link>
    </Card>
  );
}
