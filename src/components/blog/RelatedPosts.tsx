import { memo } from 'react';

import Grid from '@/components/Grid';
import Heading from '@/components/Heading';
import BlogPostCard from './BlogPostCard';

interface RelatedPostsProps {
  posts: Array<{
    slug: string;
    title: string;
    excerpt: string;
    publishedDate: string;
    category: {
      name: string;
      slug: string;
    };
    featuredImage: {
      src: string;
      alt: string;
    };
    author: {
      name: string;
    };
    readingTime: number;
  }>;
  currentPostSlug?: string;
}

function RelatedPosts({ posts, currentPostSlug }: RelatedPostsProps) {
  // Filter out current post and limit to 3
  const relatedPosts = posts.filter((post) => post.slug !== currentPostSlug).slice(0, 3);

  if (relatedPosts.length === 0) return null;

  return (
    <section className="py-12">
      <Heading level={2} className="mb-8">
        You might also like
      </Heading>
      <Grid columns={{ default: 1, md: 3 }} gap="medium">
        {relatedPosts.map((post) => (
          <BlogPostCard key={post.slug} post={post} />
        ))}
      </Grid>
    </section>
  );
}

export default memo(RelatedPosts);
