import Hero from '@/components/Hero';
import { Button as OjButton, OjFooter, OjHeader } from '@/components/oj';
import Section from '@/components/Section';
import BlogPostCard from '@/components/blog/BlogPostCard';
import CategoryList from '@/components/blog/CategoryList';
import CategoryLegend from '@/components/blog/CategoryLegend';
import Heading from '@/components/Heading';
import Text from '@/components/Text';
import { breadcrumbPaths } from '@/components/Breadcrumb';
import { getAllBlogPosts } from '@/lib/markdown/markdown';
import path from 'path';
import { draftMode } from 'next/headers';
import { CollectionPageSchema } from '@/components/CollectionPageSchema';
import { generateStaticMetadata } from '@/lib/metadata';
import SearchComponent from '@/components/SearchComponent';
import SeasonalPlaybooksBand from '@/components/SeasonalPlaybooksBand';

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

type GuideCategory = ReturnType<typeof getCategoryDisplayInfo> & { postCount: number };

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
    ogImage: '/images/og-default.jpg',
    ogType: 'website',
  });
}

// Helper function to map category slugs to display names and descriptions
function getCategoryDisplayInfo(categorySlug: string) {
  const categoryMap: Record<string, { name: string; slug: string; description: string }> = {
    'revenue-growth': {
      name: 'Revenue & Growth',
      slug: 'revenue-growth',
      description: 'Cash flow, pricing, sales tactics, and financial planning for pubs',
    },
    operations: {
      name: 'Operations',
      slug: 'operations',
      description: 'Day-to-day pub management, systems, compliance, and licensing',
    },
    marketing: {
      name: 'Marketing',
      slug: 'marketing',
      description: 'Social media, online reputation, customer acquisition, and local marketing',
    },
    events: {
      name: 'Events',
      slug: 'events',
      description: 'Planning and running successful pub events, promotions, and entertainment',
    },
    'food-drink': {
      name: 'Food & Drink',
      slug: 'food-drink',
      description: 'Food and beverage management, menus, and drinks',
    },
    people: {
      name: 'People',
      slug: 'people',
      description: 'Recruitment, staff motivation, team leadership, and training',
    },
    property: {
      name: 'Property',
      slug: 'property',
      description: 'Location challenges, refurbishment, supplier and brewery relations',
    },
    turnaround: {
      name: 'Turnaround',
      slug: 'turnaround',
      description: 'Crisis management, empty pub recovery, and community reconnection',
    },
  };

  return categoryMap[categorySlug] || { name: categorySlug, slug: categorySlug, description: '' };
}

export default async function LicenseesGuidePage() {
  const { isEnabled } = await draftMode();
  let posts: GuidePost[] = [];
  let categories: GuideCategory[] = [];

  try {
    const blogDirectory = path.join(process.cwd(), 'content/blog');
    // Get all blog posts, sorted by date (newest first)
    const allPosts = getAllBlogPosts(
      blogDirectory,
      isEnabled ? undefined : { draft: false, dateTo: new Date() },
      {
        field: 'publishedAt',
        direction: 'desc',
      }
    );

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
        postCount,
      };
    });

    categories.sort((a, b) => {
      if (b.postCount !== a.postCount) {
        return b.postCount - a.postCount;
      }
      return a.name.localeCompare(b.name);
    });

    console.log(
      `Loading blog posts from: markdown files (${posts.length} posts, ${categories.length} categories)`
    );
  } catch (error) {
    console.error('Error loading blog data:', error);
    // Return a fallback UI
    return (
      <>
        <OjHeader current="guides" />
        <main id="main-content">
          <Hero
            title="The Licensee's Guide"
            subtitle="Essential guides for modern pub management"
            showCTA={false}
          />
          <Section background="white">
            <div className="measure py-12">
              <Text className="text-red-600 text-center">
                Error loading blog posts. Please try refreshing the page.
              </Text>
            </div>
          </Section>
        </main>
        <OjFooter />
      </>
    );
  }

  return (
    <>
      <OjHeader current="guides" />
      <main id="main-content">
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

        {/*
        breadcrumbEmitJsonLd is false because CollectionPageSchema above already nests
        the trail under CollectionPage.breadcrumb, the schema.org-preferred association.
      */}
        <Hero
          title="The Licensee's Guide"
          subtitle="Proven strategies that increase revenue for pubs, restaurants, and bars"
          showCTA={false}
          breadcrumbs={breadcrumbPaths.licenseesGuide}
          backgroundImage="/images/headers/licensees-guide.png"
          breadcrumbEmitJsonLd={false}
        />

        {/*
         * The sector framing. This library is 105 hospitality articles carrying 92.9%
         * of the site's search clicks, so it is not going anywhere, and it is also no
         * longer what the company is. Saying that here, once, is what lets the
         * articles keep their sector language without the site as a whole reading as
         * a pub agency.
         */}
        <section className="border-y-1.5 border-oj-ink bg-oj-cream py-9">
          <div className="page-shell">
            <p className="font-oj text-[13px] font-bold uppercase tracking-[0.14em] text-oj-orange-deep">
              hospitality
            </p>
            <p className="measure mt-2.5 text-[17px] leading-relaxed text-oj-ink-2">
              Hospitality is the sector we know best, because we run one. Orange Jelly is a growth
              partner for ambitious small and mid-sized businesses, and this library is the part of
              it written for people running venues. Every article ends with the business problem
              underneath it.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <OjButton variant="ghost" size="sm" href="/pub-marketing">
                Pub marketing
              </OjButton>
              <OjButton variant="ghost" size="sm" href="/small-business-rescue">
                Trade is falling
              </OjButton>
              <OjButton variant="ghost" size="sm" href="/growth-problems">
                The eight growth problems
              </OjButton>
            </div>
          </div>
        </section>

        <SeasonalPlaybooksBand background="surface" />

        <Section background="white">
          <div className="measure py-12">
            {/* Lead paragraph */}
            <Text size="lg" align="center" className="mb-8 text-brand-base/70">
              Essential guides for modern pub management, with ideas you can adapt for restaurants
              and bars. From filling empty venues to competing with chains, discover practical
              advice that actually works.
            </Text>

            {/* Key Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 measure-wide mb-12">
              <div className="text-center p-6 bg-surface rounded-lg">
                <div className="text-3xl font-bold text-orange-dark mb-2">+403%</div>
                <Text size="sm" className="text-brand-base/70">
                  Table bookings
                </Text>
              </div>
              <div className="text-center p-6 bg-surface rounded-lg">
                <div className="text-3xl font-bold text-orange-dark mb-2">-89%</div>
                <Text size="sm" className="text-brand-base/70">
                  Booking no-shows
                </Text>
              </div>
              <div className="text-center p-6 bg-surface rounded-lg">
                <div className="text-3xl font-bold text-orange-dark mb-2">+828%</div>
                <Text size="sm" className="text-brand-base/70">
                  Google Search visibility
                </Text>
              </div>
            </div>

            {/* Introduction */}
            <div className="prose prose-lg measure mb-12">
              <Text className="mb-4">
                Every guide in this collection comes from real experience at The Anchor in Stanwell
                Moor. We've tested these strategies firsthand, measuring their impact on our bottom
                line.
              </Text>
              <Text className="mb-4">
                Whether you're tackling quiet Tuesday nights, competing with chains, or building a
                stronger food offer, you'll find honest, practical advice that works for pubs, bars,
                and venues.
              </Text>
              <Text className="mb-8">
                No theory. No fluff. Just proven methods that created a measurable step-change in
                our own pub and can do the same for yours.
              </Text>
            </div>

            {/* What You'll Learn */}
            <div className="bg-brand-base/5 rounded-xl p-8 mb-12 measure">
              <Heading level={2} align="center" className="mb-6">
                What You'll Learn
              </Heading>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <span className="text-orange-dark mr-3">✓</span>
                  <Text size="sm">How to fill your pub on quiet weeknights</Text>
                </div>
                <div className="flex items-start">
                  <span className="text-orange-dark mr-3">✓</span>
                  <Text size="sm">Social media strategies that actually drive footfall</Text>
                </div>
                <div className="flex items-start">
                  <span className="text-orange-dark mr-3">✓</span>
                  <Text size="sm">Food menu optimisation for maximum profit</Text>
                </div>
                <div className="flex items-start">
                  <span className="text-orange-dark mr-3">✓</span>
                  <Text size="sm">Event ideas that build loyal communities</Text>
                </div>
                <div className="flex items-start">
                  <span className="text-orange-dark mr-3">✓</span>
                  <Text size="sm">Competing with chains without matching prices</Text>
                </div>
                <div className="flex items-start">
                  <span className="text-orange-dark mr-3">✓</span>
                  <Text size="sm">Budget-friendly marketing that delivers results</Text>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="mb-12 measure">
              <Heading level={2} align="center" className="mb-6">
                Search the Guides
              </Heading>
              <SearchComponent
                placeholder="Search guides by topic, problem, or event..."
                maxResults={8}
              />
            </div>

            {/* Category Navigation */}
            <div className="mb-12">
              <Heading level={2} align="center" className="mb-6">
                Top Topics
              </Heading>
              <CategoryList categories={categories} variant="grid" maxVisible={6} />
            </div>

            {/* Category Colour Legend */}
            <div className="mb-8">
              <CategoryLegend />
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
      </main>
      <OjFooter />
    </>
  );
}
