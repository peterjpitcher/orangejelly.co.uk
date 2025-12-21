import Hero from '@/components/Hero';
import Section from '@/components/Section';
import BlogPostCard from '@/components/blog/BlogPostCard';
import CategoryList from '@/components/blog/CategoryList';
import Heading from '@/components/Heading';
import Text from '@/components/Text';
import { breadcrumbPaths } from '@/components/Breadcrumb';
import { getAllBlogPosts } from '@/lib/markdown/markdown';
import path from 'path';
import { CollectionPageSchema } from '@/components/CollectionPageSchema';
import { generateStaticMetadata } from '@/lib/metadata';

type GuidePost = {
  slug: string;
  title: string;
  excerpt: string;
  publishedDate: string;
  category: string;
  author: { name: string };
  featuredImage: string;
  readingTime: number;
};

type GuideCategory = ReturnType<typeof getCategoryDisplayInfo> & { count: number };

const toStringValue = (value: unknown): string | undefined => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value;
  }
  if (value instanceof Date && !isNaN(value.getTime())) {
    return value.toISOString().split('T')[0];
  }
  if (typeof value === 'number' && !Number.isNaN(value)) {
    return new Date(value).toISOString().split('T')[0];
  }
  return undefined;
};

// Enable ISR (Incremental Static Regeneration) - pages revalidate every 60 seconds
export const revalidate = 60;

export async function generateMetadata() {
  return generateStaticMetadata({
    title: "The Licensee's Guide - Expert Pub Management Advice",
    description:
      'Essential guides for pub owners covering marketing, events, food, and business strategy. Practical advice that also applies to restaurants and bars.',
    path: '/licensees-guide',
    keywords: [
      'pub management',
      'pub marketing',
      'restaurant marketing',
      'bar marketing',
      'licensee guide',
      'pub business advice',
      'pub owner tips',
    ].join(', '),
    ogImage: '/images/og-default.jpg',
    ogType: 'website',
  });
}

// Helper function to map category slugs to display names and descriptions
function getCategoryDisplayInfo(categorySlug: string) {
  const categoryMap: Record<string, { name: string; slug: string; description: string }> = {
    'customer-acquisition': {
      name: 'Customer Acquisition',
      slug: 'customer-acquisition',
      description: 'Attracting and retaining new customer segments',
    },
    'digital-reputation': {
      name: 'Digital Reputation',
      slug: 'digital-reputation',
      description: 'Managing online presence and reviews',
    },
    'location-challenges': {
      name: 'Location Challenges',
      slug: 'location-challenges',
      description: 'Overcoming geographical and demographic obstacles',
    },
    compliance: {
      name: 'Compliance',
      slug: 'compliance',
      description: 'Regulations, licensing, and legal requirements',
    },
    'crisis-management': {
      name: 'Crisis Management',
      slug: 'crisis-management',
      description: 'Handling emergencies and unexpected situations',
    },
    competition: {
      name: 'Competition',
      slug: 'competition',
      description: 'Strategies for competing with other pubs and chains',
    },
    'empty-pub-solutions': {
      name: 'Empty Pub Solutions',
      slug: 'empty-pub-solutions',
      description: 'Solutions for filling quiet pubs and increasing footfall',
    },
    events: {
      name: 'Events',
      slug: 'events',
      description: 'Articles about events & entertainment',
    },
    'events-promotions': {
      name: 'Events & Promotions',
      slug: 'events-promotions',
      description: 'Planning and running successful pub events and promotions',
    },
    'food-drink': {
      name: 'Food & Drink',
      slug: 'food-drink',
      description: 'Food and beverage management, menus, and offerings',
    },
    'menu-pricing': {
      name: 'Menu & Pricing',
      slug: 'menu-pricing',
      description: 'Articles about menu & pricing',
    },
    'social-media': {
      name: 'Social Media',
      slug: 'social-media',
      description: 'Social media marketing and online presence',
    },
    'supplier-relations': {
      name: 'Supplier Relations',
      slug: 'supplier-relations',
      description: 'Managing brewery ties and supplier relationships',
    },
    'financial-management': {
      name: 'Financial Management',
      slug: 'financial-management',
      description: 'Cash flow, budgeting, and financial planning',
    },
    operations: {
      name: 'Operations',
      slug: 'operations',
      description: 'Day-to-day pub management and systems',
    },
    toolkits: {
      name: 'Toolkits & Templates',
      slug: 'toolkits',
      description: 'Licensee playbooks, checklists, and downloadable assets',
    },
  };

  return categoryMap[categorySlug] || { name: categorySlug, slug: categorySlug, description: '' };
}

export default async function LicenseesGuidePage() {
  let posts: GuidePost[] = [];
  let categories: GuideCategory[] = [];

  try {
    const blogDirectory = path.join(process.cwd(), 'content/blog');
    // Get all blog posts, sorted by date (newest first)
    const allPosts = getAllBlogPosts(blogDirectory, undefined, {
      field: 'publishedAt',
      direction: 'desc',
    });

    // Transform posts to match the expected structure
    posts = allPosts.map((post) => {
      const frontMatterRecord = post.frontMatter as Record<string, unknown>;
      type FrontMatterAuthor = string | { name?: string } | undefined;
      const frontMatterAuthor = frontMatterRecord.author as FrontMatterAuthor;

      const authorName =
        typeof frontMatterAuthor === 'string' && frontMatterAuthor.trim().length > 0
          ? frontMatterAuthor
          : typeof frontMatterAuthor === 'object' && frontMatterAuthor
            ? toStringValue(frontMatterAuthor.name) || 'Peter Pitcher'
            : 'Peter Pitcher';

      const publishedDate =
        toStringValue(post.publishedAt) ||
        toStringValue(frontMatterRecord.publishedAt) ||
        toStringValue(frontMatterRecord.publishedDate);
      const safePublishedDate = publishedDate || new Date().toISOString();

      const categorySlug =
        toStringValue(post.categories?.[0]) ||
        toStringValue(frontMatterRecord.category) ||
        'empty-pub-solutions';

      const featuredImage =
        toStringValue(frontMatterRecord.featuredImage) || `/images/blog/${post.slug}.svg`;

      const excerpt =
        toStringValue(post.excerpt) || toStringValue(frontMatterRecord.description) || '';

      return {
        slug: post.slug,
        title: post.title,
        excerpt,
        publishedDate: safePublishedDate,
        category: categorySlug,
        author: {
          name: authorName,
        },
        featuredImage,
        readingTime: Math.round(post.readingTime?.minutes || 5),
      };
    });

    // Get unique categories from posts and create category list
    const categorySet = new Set<string>();
    posts.forEach((post) => {
      if (post.category) categorySet.add(post.category);
    });

    categories = Array.from(categorySet).map((categorySlug) => {
      const categoryInfo = getCategoryDisplayInfo(categorySlug);
      const postCount = posts.filter((post) => post.category === categorySlug).length;
      return {
        ...categoryInfo,
        count: postCount,
      };
    });

    console.log(
      `Loading blog posts from: markdown files (${posts.length} posts, ${categories.length} categories)`
    );
  } catch (error) {
    console.error('Error loading blog data:', error);
    // Return a fallback UI
    return (
      <>
        <Hero
          title="The Licensee's Guide"
          subtitle="Essential guides for modern pub management"
          showCTA={false}
        />
        <Section background="white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
            <Text className="text-red-600 text-center">
              Error loading blog posts. Please try refreshing the page.
            </Text>
          </div>
        </Section>
      </>
    );
  }

  return (
    <>
      {posts.length > 0 && (
        <CollectionPageSchema
          name="The Licensee's Guide"
          description="Essential guides for pub owners covering marketing, events, food, and business strategy. Practical advice to increase revenue and build thriving local pubs."
          url="/licensees-guide"
          items={posts.map((post) => ({
            url: `/licensees-guide/${post.slug}`,
            name: post.title,
            description: post.excerpt,
            datePublished: post.publishedDate,
            author: post.author?.name || 'Peter Pitcher',
            image: typeof post.featuredImage === 'string' ? post.featuredImage : '/logo.png',
          }))}
          breadcrumbs={[
            { name: 'Home', url: '/' },
            { name: "The Licensee's Guide", url: '/licensees-guide' },
          ]}
        />
      )}

      <Hero
        title="The Licensee's Guide"
        subtitle="Proven strategies that increase revenue for pubs, restaurants, and bars"
        showCTA={false}
        breadcrumbs={breadcrumbPaths.licenseesGuide}
      />

      <Section background="white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          {/* Lead paragraph */}
          <Text size="lg" align="center" className="max-w-3xl mx-auto mb-8 text-charcoal/70">
            Essential guides for modern pub management, with ideas you can adapt for restaurants and
            bars. From filling empty venues to competing with chains, discover practical advice that
            actually works.
          </Text>

          {/* Key Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div className="text-center p-6 bg-cream rounded-lg">
              <div className="text-3xl font-bold text-orange mb-2">25-30</div>
              <Text size="sm" className="text-charcoal/70">
                Quiz teams each month
              </Text>
            </div>
            <div className="text-center p-6 bg-cream rounded-lg">
              <div className="text-3xl font-bold text-orange mb-2">£250/week</div>
              <Text size="sm" className="text-charcoal/70">
                Sunday waste cut
              </Text>
            </div>
            <div className="text-center p-6 bg-cream rounded-lg">
              <div className="text-3xl font-bold text-orange mb-2">£75k-£100k</div>
              <Text size="sm" className="text-charcoal/70">
                Added to business value
              </Text>
            </div>
          </div>

          {/* Introduction */}
          <div className="prose prose-lg max-w-3xl mx-auto mb-12">
            <Text className="mb-4">
              Every guide in this collection comes from real experience at The Anchor in Stanwell
              Moor. We've tested these strategies firsthand, measuring their impact on our bottom
              line.
            </Text>
            <Text className="mb-4">
              Whether you're struggling with empty Tuesday nights, competing with Wetherspoons, or
              trying to build a profitable food offering, you'll find honest, practical advice that
              works for pubs, restaurants, and bars.
            </Text>
            <Text className="mb-8">
              No theory. No fluff. Just proven methods that have transformed our pub from struggling
              to thriving - and can do the same for yours.
            </Text>
          </div>

          {/* What You'll Learn */}
          <div className="bg-teal-dark/5 rounded-xl p-8 mb-12 max-w-4xl mx-auto">
            <Heading level={2} align="center" className="mb-6">
              What You'll Learn
            </Heading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <span className="text-orange mr-3">✓</span>
                <Text size="sm">How to fill your pub on quiet weeknights</Text>
              </div>
              <div className="flex items-start">
                <span className="text-orange mr-3">✓</span>
                <Text size="sm">Social media strategies that actually drive footfall</Text>
              </div>
              <div className="flex items-start">
                <span className="text-orange mr-3">✓</span>
                <Text size="sm">Food menu optimization for maximum profit</Text>
              </div>
              <div className="flex items-start">
                <span className="text-orange mr-3">✓</span>
                <Text size="sm">Event ideas that build loyal communities</Text>
              </div>
              <div className="flex items-start">
                <span className="text-orange mr-3">✓</span>
                <Text size="sm">Competing with chains without matching prices</Text>
              </div>
              <div className="flex items-start">
                <span className="text-orange mr-3">✓</span>
                <Text size="sm">Budget-friendly marketing that delivers results</Text>
              </div>
            </div>
          </div>

          {/* Category Navigation */}
          <div className="mb-12">
            <Heading level={2} align="center" className="mb-6">
              Browse by Topic
            </Heading>
            <CategoryList categories={categories} variant="grid" />
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogPostCard
                key={post.slug}
                post={{
                  slug: post.slug,
                  title: post.title,
                  excerpt: post.excerpt,
                  publishedDate: post.publishedDate,
                  category: {
                    name: getCategoryDisplayInfo(post.category).name,
                    slug: post.category,
                  },
                  featuredImage: post.featuredImage, // Pass the raw featuredImage data
                  author: {
                    name: post.author?.name || 'Peter Pitcher',
                  },
                  readingTime: post.readingTime || 5,
                }}
              />
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
