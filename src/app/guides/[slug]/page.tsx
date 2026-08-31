import { type Metadata } from 'next';
import { draftMode } from 'next/headers';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import path from 'path';

import {
  Anchor,
  ArticleCard,
  Band,
  Breadcrumb,
  Button,
  CategoryTag,
  FAQ,
  KeepCase,
  NextStep,
  OjFooter,
  OjHeader,
  ShareRow,
  StickyCTA,
  Tag,
  Toc,
} from '@/components/oj';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';
import { getNextStepFor } from '@/lib/article-next-step';
import { type Category, getCategoryBySlug, getCategoryHue } from '@/lib/blog';
import { getAllBlogPosts, getMarkdownBySlug, parseMarkdownFile } from '@/lib/markdown/index';
import { type BlogPost as MarkdownBlogPost } from '@/lib/markdown/markdown-types';
import { preprocessMarkdown } from '@/lib/markdown/preprocess';
import { renderMarkdownToHtml } from '@/lib/markdown/render';
import { resolveOgImage } from '@/lib/og-image';
import { getHubBySlug, getHubForSpoke } from '@/lib/seasonal-hubs';
import { seoOverrides } from '@/lib/seo-overrides';
import { getBaseUrl } from '@/lib/site-config';

/**
 * One guide.
 *
 * This route carries 92.9% of the site's search clicks across 105 articles, so the
 * rebuild onto the oj design system changed the shell and nothing that a crawler
 * reads. Every schema block the legacy template emitted is emitted here: BlogPosting
 * with its Person author and Organization publisher, FAQPage, BreadcrumbList, and
 * ItemList on the three seasonal hubs. So are the canonical, the OpenGraph article
 * block, the Twitter card and the seo-overrides lookup.
 *
 * Two things are new rather than ported. The FAQs in the front matter are now shown
 * on the page instead of existing only inside FAQPage schema, which is what Google
 * asks for, and a table of contents is built from the rendered H2s. Both are additive.
 *
 * The category is the blog's own eight-name taxonomy, because that is what the URLs
 * and the content use. The oj hue is passed alongside it purely for colour.
 *
 * @see src/lib/blog.ts for the category hue map, shared with the index and the listings
 */
interface GuidePageProps {
  params: { slug: string };
}

export const revalidate = 60;
export const dynamicParams = false;

const CONTENT_DIR = path.join(process.cwd(), 'content/blog');
const AUTHOR_ROLE = 'Founder, Orange Jelly';

/**
 * The default byline.
 *
 * What was here read "Licensee of The Anchor and founder of Orange Jelly. Helping
 * pubs thrive with proven strategies", which is the old hospitality position in the
 * founder's own voice, and leans on the word this company no longer sells on. This
 * says the two facts and stops.
 */
const AUTHOR_BIO =
  'Founder of Orange Jelly and licensee of The Anchor in Stanwell Moor. Everything in this library is run in a working business before it is written down.';

const str = (value: unknown): string | undefined => {
  if (typeof value === 'string' && value.trim().length > 0) return value;
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().split('T')[0];
  }
  if (typeof value === 'number' && !Number.isNaN(value)) {
    return new Date(value).toISOString().split('T')[0];
  }
  return undefined;
};

const strArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter(
      (item): item is string => typeof item === 'string' && item.trim().length > 0
    );
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const record = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : null;

/** Never undefined: an article with no date still has to render and still has to date itself. */
const safeDate = (value: unknown): string => {
  const parsed = str(value);
  return parsed ? parsed : new Date().toISOString();
};

const toFaqs = (value: unknown): Array<{ question: string; answer: string }> => {
  if (!Array.isArray(value)) return [];
  return value.reduce<Array<{ question: string; answer: string }>>((acc, item) => {
    const entry = record(item);
    const question = typeof entry?.question === 'string' ? entry.question.trim() : '';
    const answer = typeof entry?.answer === 'string' ? entry.answer.trim() : '';
    if (question && answer) acc.push({ question, answer });
    return acc;
  }, []);
};

/** An unknown category slug still gets a name and a listing URL rather than a blank. */
const toCategory = (candidate?: string): Category => {
  if (!candidate) return { slug: 'general', name: 'General', description: '' };
  const slug = candidate.toLowerCase().replace(/\s+/g, '-');
  return getCategoryBySlug(slug) ?? { slug, name: candidate, description: '' };
};

const categoryOf = (frontMatter: Record<string, unknown>): Category =>
  toCategory(str(frontMatter.category) ?? strArray(frontMatter.categories)[0]);

const publishedOf = (entry: MarkdownBlogPost): string | undefined =>
  str(entry.publishedAt) ??
  str(entry.frontMatter.publishedAt) ??
  str(entry.frontMatter.publishedDate);

const timestampOf = (entry: MarkdownBlogPost): number => {
  const value = publishedOf(entry);
  return value ? new Date(value).getTime() : 0;
};

/** Drafts and anything dated ahead of today are not published. */
const isPublishable = (frontMatter: Record<string, unknown>): boolean => {
  const status =
    typeof frontMatter.status === 'string' ? frontMatter.status.toLowerCase().trim() : null;
  if (frontMatter.draft === true || status === 'draft') return false;

  const published = str(frontMatter.publishedAt) ?? str(frontMatter.publishedDate);
  if (!published) return true;
  const date = new Date(published);
  return Number.isNaN(date.getTime()) || date.getTime() <= Date.now();
};

interface Guide {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishedDate: string;
  updatedDate?: string;
  category: Category;
  tags: string[];
  featuredImage?: string;
  metaTitle: string;
  metaDescription: string;
  authorName: string;
  authorBio: string;
  readingTime: number;
  quickAnswer?: string;
  voiceSearchQueries: string[];
  faqs: Array<{ question: string; answer: string }>;
  /** Feeds schema.org `about`. Front matter calls them localModifiers on most posts. */
  localKeywords: string[];
  featuredGuides?: string[];
}

function loadGuide(slug: string, includeDrafts: boolean): Guide | null {
  const filePath = getMarkdownBySlug(CONTENT_DIR, slug);
  if (!filePath) return null;

  const parsed = parseMarkdownFile(filePath);
  const frontMatter = parsed.frontMatter as Record<string, unknown>;
  if (!includeDrafts && !isPublishable(frontMatter)) return null;

  const author = record(frontMatter.author);
  const localSeo = record(frontMatter.localSEO);

  return {
    slug: parsed.frontMatter.slug,
    title: parsed.frontMatter.title,
    excerpt: parsed.excerpt || str(frontMatter.description) || '',
    content: parsed.content,
    publishedDate: safeDate(str(frontMatter.publishedAt) ?? str(frontMatter.publishedDate)),
    updatedDate: str(frontMatter.updatedAt) ?? str(frontMatter.updatedDate),
    category: categoryOf(frontMatter),
    tags: strArray(frontMatter.tags),
    featuredImage: str(frontMatter.featuredImage) ?? `/images/blog/${slug}.svg`,
    metaTitle: str(frontMatter.seoTitle) ?? str(frontMatter.metaTitle) ?? parsed.frontMatter.title,
    metaDescription:
      str(frontMatter.seoDescription) ?? str(frontMatter.metaDescription) ?? parsed.excerpt ?? '',
    authorName: str(frontMatter.author) ?? str(author?.name) ?? 'Peter Pitcher',
    authorBio: str(author?.bio) ?? AUTHOR_BIO,
    readingTime: Math.round(parsed.readingTime?.minutes || 5),
    quickAnswer: str(frontMatter.quickAnswer),
    voiceSearchQueries: strArray(frontMatter.voiceSearchQueries),
    faqs: toFaqs(frontMatter.faqs),
    localKeywords: localSeo
      ? (() => {
          const keywords = strArray(localSeo.keywords);
          return keywords.length > 0 ? keywords : strArray(localSeo.localModifiers);
        })()
      : [],
    featuredGuides: strArray(frontMatter.featuredGuides).length
      ? strArray(frontMatter.featuredGuides)
      : undefined,
  };
}

export function generateStaticParams(): Array<{ slug: string }> {
  return getAllBlogPosts(CONTENT_DIR, { draft: false, dateTo: new Date() }).map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { isEnabled } = await draftMode();
  const guide = loadGuide(params.slug, isEnabled);
  if (!guide) return { title: 'Post Not Found' };

  const baseUrl = getBaseUrl();
  const canonicalPath = `/guides/${params.slug}`;
  const override = seoOverrides[canonicalPath];

  // Resolve to an image that actually exists and that social platforms can render.
  // See src/lib/og-image.ts: the old `/images/blog/<slug>.svg` assumption 404'd for
  // 23 of 105 guides and SVG is not renderable as an og:image anyway.
  const ogImage = resolveOgImage(params.slug, guide.featuredImage);
  const absoluteImageUrl = ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`;

  const title = override?.title || guide.metaTitle || guide.title;
  const description = override?.description || guide.metaDescription || guide.excerpt;
  const canonicalUrl = override?.canonical || `${baseUrl}${canonicalPath}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: guide.publishedDate,
      modifiedTime: guide.updatedDate,
      authors: [guide.authorName],
      siteName: 'Orange Jelly',
      locale: 'en_GB',
      url: canonicalUrl,
      images: [
        {
          url: absoluteImageUrl,
          width: 1600,
          height: 900,
          alt: guide.title,
          type: 'image/webp',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [absoluteImageUrl],
      creator: '@orangejelly_uk',
      site: '@orangejelly_uk',
    },
    alternates: { canonical: canonicalUrl },
  };
}

/**
 * BlogPosting, unchanged from the legacy template field for field.
 *
 * `speakable` still points at `.quick-answer`, so the quick answer block on the page
 * still carries that class. `about` still comes from the front matter's local
 * modifiers and `keywords` from its voice search queries.
 */
function articleSchema(guide: Guide, baseUrl: string, imageUrl: string): Record<string, unknown> {
  const url = `${baseUrl}/guides/${guide.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: guide.title,
    description: guide.excerpt,
    url,
    image: { '@type': 'ImageObject', url: imageUrl, width: 1600, height: 900 },
    datePublished: guide.publishedDate,
    dateModified: guide.updatedDate || guide.publishedDate,
    author: { '@type': 'Person', name: guide.authorName, url: `${baseUrl}/about` },
    publisher: {
      '@type': 'Organization',
      name: 'Orange Jelly Limited',
      logo: { '@type': 'ImageObject', url: `${baseUrl}/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    ...(guide.quickAnswer && {
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['.quick-answer'],
        xpath: ['//*[@class="quick-answer"]'],
      },
    }),
    ...(guide.localKeywords.length > 0 && {
      about: guide.localKeywords.map((keyword) => ({ '@type': 'Thing', name: keyword })),
    }),
    ...(guide.voiceSearchQueries.length > 0 && {
      keywords: guide.voiceSearchQueries.join(', '),
    }),
  };
}

function JsonLd({ data }: { data: Record<string, unknown> }): JSX.Element {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

interface CardPost {
  slug: string;
  title: string;
  excerpt: string;
  categoryName: string;
  categorySlug: string;
  readingTime: number;
}

const toCard = (entry: MarkdownBlogPost): CardPost => {
  const category = categoryOf(entry.frontMatter as Record<string, unknown>);
  return {
    slug: entry.slug,
    title: entry.title,
    excerpt: entry.excerpt || str(entry.frontMatter.description) || '',
    categoryName: category.name,
    categorySlug: category.slug,
    readingTime: Math.round(entry.readingTime?.minutes || 5),
  };
};

function GuideGrid({ posts }: { posts: CardPost[] }): JSX.Element {
  return (
    <ul className="grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <li key={post.slug}>
          <ArticleCard
            className="h-full"
            href={`/guides/${post.slug}`}
            category={
              <CategoryTag category={getCategoryHue(post.categorySlug)}>
                {post.categoryName}
              </CategoryTag>
            }
            title={<KeepCase>{post.title}</KeepCase>}
            excerpt={post.excerpt}
            readTime={`${post.readingTime} min read`}
          />
        </li>
      ))}
    </ul>
  );
}

/**
 * The contents, built from the rendered H2s.
 *
 * rehype-slug has already put an id on every heading, so reading them back out of the
 * HTML is guaranteed to agree with what the anchors actually are. Deriving the slugs
 * a second time from the markdown would not be.
 */
function tocItems(html: string): Array<{ label: string; href: string }> {
  const items: Array<{ label: string; href: string }> = [];
  for (const match of html.matchAll(/<h2\b[^>]*\sid="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/g)) {
    const label = match[2].replace(/<[^>]+>/g, '').trim();
    if (label) items.push({ label, href: `#${match[1]}` });
  }
  return items;
}

/** 34 of the 105 already answer their questions in the body. Those keep one copy, not two. */
const BODY_HAS_FAQS = /^##\s+(faqs?|frequently asked)/im;

const formatDate = (value: string): string =>
  new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(
    new Date(value)
  );

export default async function GuidePage({ params }: GuidePageProps): Promise<JSX.Element> {
  const { isEnabled } = await draftMode();
  const guide = loadGuide(params.slug, isEnabled);
  if (!guide) notFound();

  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/guides/${guide.slug}`;
  const html = await renderMarkdownToHtml(preprocessMarkdown(guide.content));
  const toc = tocItems(html);
  const showFaqs = guide.faqs.length > 0 && !BODY_HAS_FAQS.test(guide.content);
  const nextStepLinks = getNextStepFor(guide.slug);
  const hue = getCategoryHue(guide.category.slug);

  // A per-slug raster or an explicit image. The site's default OG image is a fallback
  // for social cards, not something worth showing at the top of the article.
  const ogImage = resolveOgImage(guide.slug, guide.featuredImage);
  const heroImage =
    ogImage.startsWith('http') || ogImage.startsWith('/images/blog/') ? ogImage : null;

  const all = getAllBlogPosts(
    CONTENT_DIR,
    isEnabled ? undefined : { draft: false, dateTo: new Date() }
  ) as MarkdownBlogPost[];
  const newestFirst = (a: MarkdownBlogPost, b: MarkdownBlogPost): number =>
    timestampOf(b) - timestampOf(a);
  const others = all.filter((entry) => entry.slug !== guide.slug);

  /*
   * The article before and after this one, in publication order.
   *
   * The legacy template had this and the port dropped it, which cost roughly 208
   * internal links across the section. That matters more here than it would anywhere
   * else on the site: these 105 articles carry 92% of the search clicks, and
   * previous-and-next is what threads them into a sequence rather than 105 dead ends.
   * Related reading is not a substitute, because it is capped at three and chosen by
   * category, so the long tail of older articles ends up linked from nothing.
   */
  const chronological = [...all].sort(newestFirst);
  const position = chronological.findIndex((entry) => entry.slug === guide.slug);
  const newer = position > 0 ? chronological[position - 1] : undefined;
  const older =
    position >= 0 && position < chronological.length - 1 ? chronological[position + 1] : undefined;

  // A seasonal hub shows its own curated spokes instead of generic related reading,
  // and a spoke sits under its playbook in the breadcrumb trail.
  const hub = getHubBySlug(guide.slug);
  const spokeHub = hub ? undefined : getHubForSpoke(guide.slug);
  const spokeSlugs = hub ? (guide.featuredGuides ?? hub.featuredGuides) : [];

  /** Each hub collection carries its own ItemList, so the set is explicit to a crawler. */
  const collections = (
    hub
      ? [
          {
            tone: 'page' as const,
            name: hub.label,
            heading: `the full ${hub.label}.`,
            intro: 'Practical guides. Pick the moments that fit your pub.',
            posts: spokeSlugs
              .map((slug) => all.find((entry) => entry.slug === slug))
              .filter((entry): entry is MarkdownBlogPost => Boolean(entry))
              .map(toCard),
          },
          {
            tone: 'paper' as const,
            name: `More for ${hub.season}`,
            heading: `more for this ${hub.season}.`,
            intro: 'Extra guides that fit the same season.',
            posts: others
              .filter(
                (entry) =>
                  !spokeSlugs.includes(entry.slug) &&
                  strArray(entry.frontMatter.seasons)
                    .map((season) => season.toLowerCase())
                    .includes(hub.season)
              )
              .sort(newestFirst)
              .map(toCard),
          },
        ]
      : []
  ).filter((collection) => collection.posts.length > 0);

  // Same category first, topped up with the most recent so a thin category never
  // leaves an article with nowhere to go next.
  const related = hub
    ? []
    : [
        ...others
          .filter(
            (entry) =>
              categoryOf(entry.frontMatter as Record<string, unknown>).slug === guide.category.slug
          )
          .sort(newestFirst),
        ...[...others].sort(newestFirst),
      ]
        .filter((entry, at, list) => list.findIndex((p) => p.slug === entry.slug) === at)
        .slice(0, 3)
        .map(toCard);

  return (
    <>
      <OjHeader current="guides" />

      <main id="main-content">
        <JsonLd
          data={articleSchema(
            guide,
            baseUrl,
            ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`
          )}
        />
        {guide.faqs.length > 0 ? (
          <JsonLd
            data={{
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: guide.faqs.map((faq) => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: { '@type': 'Answer', text: faq.answer },
              })),
            }}
          />
        ) : null}
        <BreadcrumbJsonLd
          items={[
            { name: 'Home', url: '/' },
            { name: "The Licensee's Guide", url: '/guides' },
            ...(spokeHub
              ? [{ name: spokeHub.shortLabel, url: `/guides/${spokeHub.hubSlug}` }]
              : []),
            { name: guide.title, url: `/guides/${guide.slug}` },
          ]}
        />

        <StickyCTA
          note="Not sure this is your actual problem?"
          label="Let's talk"
          href="/start-here"
        />

        <section className="border-b-1.5 border-oj-ink bg-oj-cream py-12 sm:py-16">
          <div className="page-shell">
            <Breadcrumb
              className="mb-7"
              items={[
                { label: 'Home', href: '/' },
                { label: "The Licensee's Guide", href: '/guides' },
                ...(spokeHub
                  ? [{ label: spokeHub.shortLabel, href: `/guides/${spokeHub.hubSlug}` }]
                  : []),
                { label: guide.title },
              ]}
            />
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <CategoryTag category={hue} href={`/guides/category/${guide.category.slug}`}>
                {guide.category.name}
              </CategoryTag>
              {hub ? (
                <span className="oj-eyebrow">
                  {hub.label} · {hub.dateRangeLabel}
                </span>
              ) : null}
            </div>
            <h1 className="oj-display measure text-[clamp(34px,6.5vw,60px)] leading-[0.98] text-oj-ink">
              <KeepCase>{guide.title}</KeepCase>
            </h1>
            {guide.excerpt ? (
              <p className="measure mt-5 text-[19px] leading-relaxed text-oj-ink-2">
                {guide.excerpt}
              </p>
            ) : null}
            <p className="mt-6 text-[14.5px] text-oj-ink-3">
              {formatDate(guide.publishedDate)}
              {' · '}
              {guide.readingTime} min read
              {' · '}
              {guide.authorName}
            </p>
            {heroImage ? (
              <div className="measure mt-8 overflow-hidden rounded-oj border-1.5 border-oj-ink">
                <Image
                  src={heroImage}
                  alt=""
                  width={1600}
                  height={900}
                  priority
                  sizes="(min-width: 768px) 680px, 100vw"
                  className="h-auto w-full"
                />
              </div>
            ) : null}
          </div>
        </section>

        <Band tone="paper">
          <div className="measure">
            {guide.quickAnswer ? (
              /* The class is load-bearing: BlogPosting's speakable block points at it. */
              <div className="quick-answer mb-9 rounded-oj border-1.5 border-oj-ink bg-oj-cream p-5 shadow-press-sm">
                <p className="oj-eyebrow m-0">Quick answer</p>
                <p className="mt-2 text-[17px] font-semibold leading-relaxed text-oj-ink">
                  {guide.quickAnswer}
                </p>
              </div>
            ) : null}

            {toc.length >= 3 ? (
              <div className="mb-10 rounded-oj border-1.5 border-oj-ink bg-oj-cream p-5">
                <Toc items={toc} />
              </div>
            ) : null}

            <div className="oj-prose" dangerouslySetInnerHTML={{ __html: html }} />

            {showFaqs ? (
              <div className="mt-12">
                <h2 className="oj-display text-[28px] leading-none text-oj-ink">
                  questions people ask.
                </h2>
                <div className="mt-5">
                  <FAQ items={guide.faqs.map((faq) => ({ q: faq.question, a: faq.answer }))} />
                </div>
              </div>
            ) : null}

            {nextStepLinks.length > 0 ? (
              <div className="mt-12">
                <NextStep from="article" links={nextStepLinks} />
              </div>
            ) : null}

            {newer || older ? (
              <nav className="mt-12 border-t-1.5 border-oj-ink pt-6" aria-label="More guides">
                <div className="grid gap-4 sm:grid-cols-2">
                  {older ? (
                    <Anchor
                      href={`/guides/${older.slug}`}
                      className="group/adj block rounded-oj border-1.5 border-oj-ink bg-oj-paper p-4 no-underline"
                    >
                      <span className="block text-xs font-bold uppercase tracking-[0.14em] text-oj-orange-deep">
                        Earlier guide
                      </span>
                      <span className="mt-1.5 block font-oj text-[17px] font-black leading-snug text-oj-ink group-hover/adj:text-oj-orange-deep">
                        {older.title}
                      </span>
                    </Anchor>
                  ) : (
                    <span />
                  )}
                  {newer ? (
                    <Anchor
                      href={`/guides/${newer.slug}`}
                      className="group/adj block rounded-oj border-1.5 border-oj-ink bg-oj-paper p-4 no-underline sm:text-right"
                    >
                      <span className="block text-xs font-bold uppercase tracking-[0.14em] text-oj-orange-deep">
                        Later guide
                      </span>
                      <span className="mt-1.5 block font-oj text-[17px] font-black leading-snug text-oj-ink group-hover/adj:text-oj-orange-deep">
                        {newer.title}
                      </span>
                    </Anchor>
                  ) : null}
                </div>
              </nav>
            ) : null}

            <div className="mt-12 flex flex-col gap-5 rounded-oj border-1.5 border-oj-ink bg-oj-cream p-6 sm:flex-row sm:items-start">
              <Image
                src="/images/peter-pitcher.jpg"
                alt=""
                width={72}
                height={72}
                className="h-[72px] w-[72px] flex-none rounded-full border-1.5 border-oj-ink object-cover"
              />
              <div>
                <h2 className="font-oj text-[20px] font-black leading-tight text-oj-ink">
                  {guide.authorName}
                </h2>
                <p className="oj-eyebrow mt-2">{AUTHOR_ROLE}</p>
                <p className="mt-3 text-[15.5px] leading-relaxed text-oj-ink-2">
                  {guide.authorBio}
                </p>
                <p className="mt-3 text-[15px]">
                  <Anchor
                    href="/about"
                    className="font-semibold text-oj-orange-deep underline underline-offset-2"
                  >
                    More about Orange Jelly
                  </Anchor>
                </p>
              </div>
            </div>

            {guide.tags.length > 0 ? (
              <div className="mt-8 flex flex-wrap items-center gap-2">
                <span className="text-[13.5px] font-semibold text-oj-ink-3">Tagged</span>
                {guide.tags.map((tag) => (
                  <Tag key={tag} dot={false} size="sm">
                    {tag}
                  </Tag>
                ))}
              </div>
            ) : null}

            <div className="mt-8">
              <ShareRow url={url} title={guide.title} />
            </div>
          </div>
        </Band>

        {hub && hub.calendar.length > 0 ? (
          <Band
            tone="page"
            heading="at a glance."
            intro="The dates worth blocking now. Pick the two or three that fit your pub."
          >
            <ul className="grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
              {hub.calendar.map((entry) => {
                const body = (
                  <>
                    <span className="inline-flex w-fit rounded-full bg-oj-ink px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-oj-cream">
                      {entry.date}
                    </span>
                    <span className="font-oj text-[18px] font-black leading-tight text-oj-ink">
                      {entry.moment}
                    </span>
                    <span className="text-[15px] leading-relaxed text-oj-ink-2">
                      {entry.opportunity}
                    </span>
                    {entry.href ? (
                      <span className="mt-auto text-[14px] font-bold text-oj-orange-deep">
                        Read the guide →
                      </span>
                    ) : null}
                  </>
                );
                const shell =
                  'flex h-full flex-col items-start gap-2.5 rounded-oj border-1.5 border-oj-ink bg-oj-paper p-5';
                return (
                  <li key={`${entry.date}-${entry.moment}`}>
                    {entry.href ? (
                      <Anchor
                        href={entry.href}
                        className={`${shell} oj-press oj-focus no-underline`}
                      >
                        {body}
                      </Anchor>
                    ) : (
                      <div className={shell}>{body}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </Band>
        ) : null}

        {collections.map((collection) => (
          <Band
            key={collection.name}
            tone={collection.tone}
            heading={collection.heading}
            intro={collection.intro}
          >
            <JsonLd
              data={{
                '@context': 'https://schema.org',
                '@type': 'ItemList',
                name: collection.name,
                itemListElement: collection.posts.map((post, position) => ({
                  '@type': 'ListItem',
                  position: position + 1,
                  url: `${baseUrl}/guides/${post.slug}`,
                  name: post.title,
                })),
              }}
            />
            <GuideGrid posts={collection.posts} />
          </Band>
        ))}

        {related.length > 0 ? (
          <Band tone="page" heading="keep reading.">
            <GuideGrid posts={related} />
          </Band>
        ) : null}

        <Band tone="ink" size="lg" divider={false}>
          <h2 className="oj-display text-[clamp(32px,6.5vw,56px)] leading-[0.95] text-oj-cream">
            not sure this is your actual problem?
          </h2>
          <p className="measure mt-4 text-[18px] leading-relaxed text-oj-cream/80">
            That's the more common situation, and it's what the first conversation is for. An hour,
            free, going through what's happening in your business before anybody suggests a fix.
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
