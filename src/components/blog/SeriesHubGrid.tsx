import Grid from '@/components/Grid';
import Heading from '@/components/Heading';
import Text from '@/components/Text';
import BlogPostCard from './BlogPostCard';

interface SeriesSpoke {
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
}

interface SeriesHubGridProps {
  posts: SeriesSpoke[];
  baseUrl: string;
  heading?: string;
  subtitle?: string;
  listName?: string;
}

/**
 * Curated grid of the guides in a content series (the "spokes"), shown on the
 * series hub/pillar page. Renders an ItemList JSON-LD so search engines and AI
 * answer engines see the hub-and-spoke set explicitly. Additive only — the route
 * renders this exclusively on the hub page, so other posts are unaffected.
 */
export default function SeriesHubGrid({
  posts,
  baseUrl,
  heading = 'The full Autumn Pub Playbook',
  subtitle = 'Seven practical guides — pick the moments that fit your pub.',
  listName = 'The Autumn Pub Playbook',
}: SeriesHubGridProps) {
  if (!posts || posts.length === 0) return null;

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    itemListElement: posts.map((post, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${baseUrl}/licensees-guide/${post.slug}`,
      name: post.title,
    })),
  };

  return (
    <section className="py-12 border-t border-charcoal/10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <Heading level={2} className="mb-2">
        {heading}
      </Heading>
      <Text color="muted" className="mb-8">
        {subtitle}
      </Text>
      <Grid columns={{ default: 1, sm: 2, lg: 3 }} gap="medium">
        {posts.map((post) => (
          <BlogPostCard key={post.slug} post={post} />
        ))}
      </Grid>
    </section>
  );
}
