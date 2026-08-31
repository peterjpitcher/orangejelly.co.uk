import { type Metadata } from 'next';
import { draftMode } from 'next/headers';
import { notFound, permanentRedirect } from 'next/navigation';

import { CollectionPageSchema } from '@/components/CollectionPageSchema';
import {
  ArticleCard,
  Band,
  Breadcrumb,
  Button,
  CategoryTag,
  OjFooter,
  OjHeader,
} from '@/components/oj';
import { formatDate, getCategoryBySlug, getCategoryHue } from '@/lib/blog';
import { getCategories, getPostsByCategory, resolveCategorySlug } from '@/lib/blog-md';
import { generateMetadata as generateMeta } from '@/lib/metadata';

/**
 * One category of the guides library.
 *
 * The shell is the insights listing: cream hero, then the cards, then the one
 * closing call to action. Everything the old page emitted for search is unchanged.
 * The CollectionPage schema below carries the same items and the same trail, the
 * canonical still comes from the shared metadata helper, and the URLs are untouched
 * because six of the article URLs under them are printed on QR codes.
 */
interface CategoryPageProps {
  params: {
    category: string;
  };
}

function humanizeCategorySlug(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getCanonicalCategorySlug(rawCategory: string): string {
  try {
    return resolveCategorySlug(decodeURIComponent(rawCategory));
  } catch {
    return resolveCategorySlug(rawCategory);
  }
}

// Enable ISR (Incremental Static Regeneration) - pages revalidate every 60 seconds
export const revalidate = 60;

export async function generateStaticParams() {
  const categories = getCategories();
  return categories.map((category) => ({
    category: category.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const canonicalCategorySlug = getCanonicalCategorySlug(params.category);
  const category = getCategoryBySlug(canonicalCategorySlug);
  const title = category?.name || humanizeCategorySlug(canonicalCategorySlug);
  const description =
    category?.description ||
    `Browse all ${title} articles from The Licensee's Guide. Practical, proven ideas you can use.`;

  return generateMeta({
    title: `${title} - The Licensee's Guide`,
    description,
    path: `/guides/category/${canonicalCategorySlug}`,
    ogType: 'website',
  });
}

export default async function CategoryPage({ params }: CategoryPageProps): Promise<JSX.Element> {
  const canonicalCategorySlug = getCanonicalCategorySlug(params.category);
  if (params.category !== canonicalCategorySlug) {
    permanentRedirect(`/guides/category/${canonicalCategorySlug}`);
  }

  const { isEnabled } = await draftMode();
  const publishOptions = isEnabled ? { includeDrafts: true, includeFuture: true } : undefined;
  const categoryPosts = getPostsByCategory(canonicalCategorySlug, publishOptions);

  if (categoryPosts.length === 0) {
    notFound();
  }

  const category = getCategoryBySlug(canonicalCategorySlug);
  const categoryTitle = category?.name || humanizeCategorySlug(canonicalCategorySlug);
  const categoryDescription = category?.description;
  // The descriptions are stored without a closing stop because they are also the
  // meta description. As a standfirst they need one, and this survives an editor
  // adding their own.
  const standfirst = categoryDescription ? categoryDescription.replace(/\.?$/, '.') : null;
  const hue = getCategoryHue(canonicalCategorySlug);
  // Only categories that actually have articles, so the row never offers a dead end.
  const siblings = getCategories(publishOptions);

  return (
    <>
      <CollectionPageSchema
        name={`${categoryTitle} - The Licensee's Guide`}
        description={categoryDescription || `Browse all ${categoryTitle} articles`}
        url={`/guides/category/${canonicalCategorySlug}`}
        items={categoryPosts.map((post) => ({
          url: `/guides/${post.slug}`,
          name: post.title,
          description: post.excerpt,
          datePublished: post.publishedDate,
          author: 'Peter Pitcher',
          image: post.featuredImage || '/logo.png',
        }))}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: "The Licensee's Guide", url: '/guides' },
          { name: categoryTitle, url: `/guides/category/${canonicalCategorySlug}` },
        ]}
      />
      {/*
        No standalone BreadcrumbJsonLd here. CollectionPageSchema above carries the
        identical trail nested under CollectionPage.breadcrumb, which is the
        schema.org-preferred association, and emitting both gave Google two competing
        BreadcrumbLists for the same page. The oj Breadcrumb is presentation only, so
        rendering it below adds no second list.
      */}

      <OjHeader current="guides" />

      <main id="main-content">
        <section className="border-b-1.5 border-oj-ink bg-oj-cream py-12 sm:py-16">
          <div className="page-shell">
            <Breadcrumb
              className="mb-7"
              items={[
                { label: 'Home', href: '/' },
                { label: "The Licensee's Guide", href: '/guides' },
                { label: categoryTitle },
              ]}
            />
            <p className="oj-eyebrow m-0">The Licensee&rsquo;s Guide</p>
            <h1 className="oj-display mt-1 text-[clamp(40px,8vw,72px)] leading-[0.94] text-oj-ink">
              {categoryTitle}.
            </h1>
            {standfirst ? (
              <p className="measure mt-5 text-[19px] leading-relaxed text-oj-ink-2">{standfirst}</p>
            ) : null}
            <p className="mt-6 text-[14.5px] text-oj-ink-3">
              {categoryPosts.length} {categoryPosts.length === 1 ? 'article' : 'articles'}, newest
              first.
            </p>
          </div>
        </section>

        <Band tone="paper" divider={false}>
          {/*
           * The other categories, as real links. This is the only route between
           * them apart from the index, so it is navigation rather than decoration:
           * the current one is filled and unlinked so its position is obvious.
           */}
          <nav aria-label="Guide categories" className="flex flex-wrap gap-2">
            {siblings.map((sibling) => {
              const current = sibling.slug === canonicalCategorySlug;
              return (
                <CategoryTag
                  key={sibling.slug}
                  category={getCategoryHue(sibling.slug)}
                  filled={current}
                  href={current ? undefined : `/guides/category/${sibling.slug}`}
                >
                  {sibling.name}
                </CategoryTag>
              );
            })}
          </nav>

          <ul className="mt-10 grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {categoryPosts.map((post) => (
              <li key={post.slug}>
                {/* No href on this tag: CategoryTag renders an anchor when given one,
                    and an anchor inside the card's own anchor is invalid markup. */}
                <ArticleCard
                  className="h-full"
                  href={`/guides/${post.slug}`}
                  category={<CategoryTag category={hue}>{categoryTitle}</CategoryTag>}
                  title={post.title}
                  excerpt={post.excerpt}
                  date={formatDate(post.publishedDate)}
                  readTime={`${post.readingTime || 5} min read`}
                />
              </li>
            ))}
          </ul>
        </Band>

        <Band tone="ink" size="lg" divider={false}>
          <h2 className="oj-display text-[clamp(34px,7vw,64px)] leading-[0.95] text-oj-cream">
            still stuck on this one?
          </h2>
          <p className="measure mt-4 text-[18px] leading-relaxed text-oj-cream/80">
            If one of these keeps coming back, an hour on the phone gets further than another
            article. It's free and it isn't a pitch.
          </p>
          <div className="mt-8">
            <Button size="lg" arrow href="/start-here">
              Let's talk
            </Button>
          </div>
        </Band>
      </main>

      <OjFooter />
    </>
  );
}
