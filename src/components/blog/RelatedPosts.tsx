import Grid from '@/components/Grid';
import Heading from '@/components/Heading';
import Text from '@/components/Text';
import BlogPostCard from './BlogPostCard';

interface RelatedPost {
  slug: string;
  title: string;
  excerpt: string;
  publishedDate: string;
  category: {
    name: string;
    slug: string;
  };
  featuredImage:
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
}

interface RelatedPostsProps {
  posts: RelatedPost[];
  currentPostSlug?: string;
}

export default function RelatedPosts({ posts, currentPostSlug }: RelatedPostsProps) {
  // Filter out current post and limit to 3 — one clean row at the 3-wide card standard.
  const relatedPosts = posts.filter((post) => post.slug !== currentPostSlug).slice(0, 3);

  if (relatedPosts.length === 0) return null;

  return (
    <section className="py-12 border-t border-charcoal/10">
      <Heading level={2} className="mb-2">
        Keep reading
      </Heading>
      <Text color="muted" className="mb-8">
        More guides to help you grow your pub
      </Text>
      <Grid columns={{ default: 1, sm: 2, lg: 3 }} gap="medium">
        {relatedPosts.map((post) => (
          <BlogPostCard key={post.slug} post={post} />
        ))}
      </Grid>
    </section>
  );
}
