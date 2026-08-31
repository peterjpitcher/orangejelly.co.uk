import path from 'path';

import { draftMode } from 'next/headers';

import { CollectionPageSchema } from '@/components/CollectionPageSchema';
import {
  Anchor,
  ArticleCard,
  Band,
  Breadcrumb,
  Button,
  CategoryTag,
  EmptyState,
  GuideSearch,
  OjFooter,
  OjHeader,
  SeasonalBand,
  Stat,
} from '@/components/oj';
import { getCategoryBySlug, getCategoryHue } from '@/lib/blog';
import { getAllBlogPosts } from '@/lib/markdown/markdown';
import { generateStaticMetadata } from '@/lib/metadata';
import { SEASON_HUBS } from '@/lib/seasonal-hubs';

/**
 * `/guides`.
 *
 * The hospitality library: 105 articles carrying most of the site's search traffic.
 * It is the same shape of page as `/insights`, so it is built from the same parts,
 * and the differences are the ones that matter: eight visible categories rather
 * than the design system's seven hue ids, and a search box, because a hundred and
 * five articles is more than anyone scrolls.
 *
 * THE WHOLE LIBRARY IS ON ONE PAGE, DELIBERATELY. Paginating would cut the index's
 * outbound links from 105 to a couple of dozen, on the section that earns 92.9% of
 * the site's search clicks. The page is long. That is the cheaper problem.
 *
 * The eight category names are the visible labels because they are what the URLs
 * and the content use. The oj hue is passed alongside them purely for colour, from
 * the one map in `@/lib/blog` that the category and article routes share.
 */

// Enable ISR (Incremental Static Regeneration) - pages revalidate every 60 seconds
export const revalidate = 60;

interface GuidePost {
  slug: string;
  title: string;
  excerpt: string;
  publishedDate: string;
  category: string;
  author: string;
  featuredImage: string;
  readingTime: number;
}

interface GuideCategory {
  slug: string;
  name: string;
  postCount: number;
}

/**
 * The metadata is unchanged from before the restyle. This is the entry point for
 * most of the site's organic traffic, so the title, description and canonical are
 * not something to redecorate alongside the layout.
 */
export async function generateMetadata() {
  return generateStaticMetadata({
    title: "The Licensee's Guide - Expert Pub Management Advice",
    description:
      'Essential guides for pub owners covering marketing, events, food, and business strategy. Practical advice that also applies to restaurants and bars.',
    path: '/guides',
    ogImage: '/images/og-default.jpg',
    ogType: 'website',
  });
}

const DATE_FORMAT = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

/** Front matter arrives from markdown, so dates can be strings, Dates or numbers. */
function toStringValue(value: unknown): string | undefined {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value;
  }
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().split('T')[0];
  }
  if (typeof value === 'number' && !Number.isNaN(value)) {
    return new Date(value).toISOString().split('T')[0];
  }
  return undefined;
}

function humanise(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function categoryName(slug: string): string {
  return getCategoryBySlug(slug)?.name ?? humanise(slug);
}

function loadGuides(includeDrafts: boolean): GuidePost[] {
  const blogDirectory = path.join(process.cwd(), 'content/blog');
  const allPosts = getAllBlogPosts(
    blogDirectory,
    includeDrafts ? undefined : { draft: false, dateTo: new Date() },
    { field: 'publishedAt', direction: 'desc' }
  );

  return allPosts.map((post) => {
    const frontMatter = post.frontMatter as Record<string, unknown>;
    const frontMatterAuthor = frontMatter.author as string | { name?: string } | undefined;

    const author =
      typeof frontMatterAuthor === 'string' && frontMatterAuthor.trim().length > 0
        ? frontMatterAuthor
        : typeof frontMatterAuthor === 'object' && frontMatterAuthor
          ? toStringValue(frontMatterAuthor.name) || 'Peter Pitcher'
          : 'Peter Pitcher';

    const publishedDate =
      toStringValue(post.publishedAt) ||
      toStringValue(frontMatter.publishedAt) ||
      toStringValue(frontMatter.publishedDate) ||
      new Date().toISOString();

    return {
      slug: post.slug,
      title: post.title,
      excerpt: toStringValue(post.excerpt) || toStringValue(frontMatter.description) || '',
      publishedDate,
      category:
        toStringValue(post.categories?.[0]) ||
        toStringValue(frontMatter.category) ||
        'empty-pub-solutions',
      author,
      featuredImage: toStringValue(frontMatter.featuredImage) || `/images/blog/${post.slug}.svg`,
      readingTime: Math.round(post.readingTime?.minutes || 5),
    };
  });
}

/** Most-stocked topic first, so the row reads as a size order rather than a list. */
function countCategories(posts: GuidePost[]): GuideCategory[] {
  const counts = new Map<string, number>();
  posts.forEach((post) => {
    if (post.category) counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
  });

  return Array.from(counts.entries())
    .map(([slug, postCount]) => ({ slug, name: categoryName(slug), postCount }))
    .sort((a, b) => b.postCount - a.postCount || a.name.localeCompare(b.name));
}

export default async function GuidesPage(): Promise<JSX.Element> {
  const { isEnabled } = await draftMode();

  let posts: GuidePost[] = [];
  let failed = false;
  try {
    posts = loadGuides(isEnabled);
  } catch (error) {
    console.error('Error loading guides:', error);
    failed = true;
  }

  const categories = countCategories(posts);

  return (
    <>
      <OjHeader current="guides" />

      <main id="main-content">
        {posts.length > 0 ? (
          <CollectionPageSchema
            name="The Licensee's Guide"
            description="Essential guides for pub owners covering marketing, events, food, and business strategy. Practical advice to increase revenue and build thriving local pubs."
            url="/guides"
            items={posts.map((post) => ({
              url: `/guides/${post.slug}`,
              name: post.title,
              description: post.excerpt,
              datePublished: post.publishedDate,
              author: post.author,
              image: post.featuredImage,
            }))}
            breadcrumbs={[
              { name: 'Home', url: '/' },
              { name: "The Licensee's Guide", url: '/guides' },
            ]}
          />
        ) : null}

        {/*
         * The sector framing, said once, at the top. This library is hospitality and
         * is not pretending otherwise. What has changed is the company around it, so
         * the heading is about the business rather than about the job title.
         */}
        <section className="border-b-1.5 border-oj-ink bg-oj-cream py-12 sm:py-16">
          <div className="page-shell">
            <Breadcrumb
              className="mb-7"
              items={[{ label: 'Home', href: '/' }, { label: "The Licensee's Guide" }]}
            />
            <p className="oj-eyebrow m-0">Hospitality</p>
            <h1 className="oj-display mt-2 text-[clamp(38px,7.5vw,68px)] leading-[0.94] text-oj-ink">
              guides for growing a venue.
            </h1>
            <p className="measure mt-5 text-[19px] leading-relaxed text-oj-ink-2">
              {posts.length > 0
                ? `There are ${posts.length} of them, written for pubs, bars and restaurants, and tested at The Anchor before any of it went out.`
                : 'Written for pubs, bars and restaurants, and tested at The Anchor before any of it went out.'}
            </p>
            <p className="measure mt-4 text-[17px] leading-relaxed text-oj-ink-2">
              The tactics are hospitality, because that is the sector we know best: we run one. The
              thinking underneath is the same commercial thinking we bring to any ambitious small
              business. Find what is actually holding growth back, then act on it.
            </p>
            <p className="measure mt-4 text-[16px] leading-relaxed text-oj-ink-3">
              Not running a venue? The same thinking, applied to every other sector, is over at{' '}
              <Anchor href="/insights" className="font-semibold underline">
                Insights
              </Anchor>
              .
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button variant="ghost" size="sm" href="/pub-marketing">
                Pub marketing
              </Button>
              <Button variant="ghost" size="sm" href="/why-revenue-is-falling">
                Why revenue is falling
              </Button>
              <Button variant="ghost" size="sm" href="/growth-problems">
                The eight growth problems
              </Button>
            </div>
          </div>
        </section>

        <Band tone="paper">
          <div className="grid gap-8 sm:grid-cols-3">
            <Stat
              value="+828%"
              label="Google Search visibility"
              sub="Search Console clicks and impressions, against the baseline before any work started."
            />
            <Stat
              value="+403%"
              label="Table bookings"
              sub="Bookings taken at The Anchor, against the previous run rate."
            />
            <Stat
              value="89%"
              label="Fewer booking no-shows"
              sub="No-show rate fell from around 20% to around 2%."
            />
          </div>
          <p className="measure mt-8 text-[15px] leading-relaxed text-oj-ink-3">
            Every figure is from The Anchor, our own venue, measured against a baseline taken before
            any work started. It is one business, and it is ours, so the risk of getting it wrong
            was ours too.
          </p>
        </Band>

        <Band
          tone="page"
          heading="browse by topic."
          intro="Every guide is filed under one of eight topics. Start with the one closest to whatever you are working on this week."
        >
          {categories.length > 0 ? (
            <div className="flex flex-wrap gap-2.5">
              {categories.map((category) => (
                <CategoryTag
                  key={category.slug}
                  category={getCategoryHue(category.slug)}
                  href={`/guides/category/${category.slug}`}
                >
                  {category.name} ({category.postCount})
                </CategoryTag>
              ))}
            </div>
          ) : null}

          <div className="measure mt-10">
            <p className="oj-eyebrow m-0">Or search the library</p>
            <div className="mt-3">
              <GuideSearch placeholder="Search guides by topic, problem, or event..." />
            </div>
          </div>
        </Band>

        {SEASON_HUBS.length > 0 ? (
          <Band tone="paper">
            <SeasonalBand
              heading="seasonal playbooks."
              viewAll={null}
              items={SEASON_HUBS.map((hub) => ({
                month: hub.dateRangeLabel,
                event: hub.label,
                note: `${hub.featuredGuides.length} guides for the ${hub.season} season.`,
                href: `/guides/${hub.hubSlug}`,
                cta: 'Open the playbook',
              }))}
            />
          </Band>
        ) : null}

        <Band tone="page" heading="every guide." intro="Newest first. All of them, on one page.">
          {posts.length === 0 ? (
            <EmptyState
              title={failed ? 'The library did not load.' : 'Nothing here yet.'}
              body={
                failed
                  ? 'Something went wrong reading the guides. Refreshing usually sorts it, and if it does not, tell us and we will fix it.'
                  : 'The guides are being written. In the meantime the growth problems pages cover the same ground from the business end.'
              }
              action={{ label: 'See the eight growth problems', href: '/growth-problems' }}
            />
          ) : (
            <>
              <ul className="grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <li key={post.slug}>
                    {/*
                     * The category tag inside a card carries no href. The card is
                     * already one link, and an anchor inside an anchor is invalid
                     * markup that browsers resolve by dropping one of them. The
                     * linked version of the same tag is the topic row above.
                     */}
                    <ArticleCard
                      className="h-full"
                      href={`/guides/${post.slug}`}
                      category={
                        <CategoryTag category={getCategoryHue(post.category)}>
                          {categoryName(post.category)}
                        </CategoryTag>
                      }
                      title={post.title}
                      excerpt={post.excerpt}
                      date={DATE_FORMAT.format(new Date(post.publishedDate))}
                      readTime={`${post.readingTime} min read`}
                    />
                  </li>
                ))}
              </ul>

              <p className="mt-8 text-[14.5px] text-oj-ink-3">
                {posts.length} {posts.length === 1 ? 'guide' : 'guides'} across {categories.length}{' '}
                topics.
              </p>
            </>
          )}
        </Band>

        <Band tone="ink" size="lg" divider={false}>
          <h2 className="oj-display text-[clamp(34px,7vw,64px)] leading-[0.95] text-oj-cream">
            pick one and run it this week.
          </h2>
          <p className="measure mt-4 text-[18px] leading-relaxed text-oj-cream/80">
            Reading is the cheap part. If you would rather work out which change matters most for
            your venue first, an hour on the phone gets further than another article. It's free, and
            it isn't a pitch.
          </p>
          <div className="mt-8">
            <Button size="lg" arrow href="/start-here">
              Let&rsquo;s talk
            </Button>
          </div>
        </Band>
      </main>

      <OjFooter />
    </>
  );
}
