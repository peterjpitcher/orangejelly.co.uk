import { Suspense } from 'react';
import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import path from 'path';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import BlogPostClient from './BlogPostClient';
import { getAllBlogPosts, getMarkdownBySlug, parseMarkdownFile } from '@/lib/markdown/index';
import { BlogPostingSchema } from '@/components/BlogPostingSchema';
import EnhancedBlogSchema from '@/components/blog/EnhancedBlogSchema';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';
import { breadcrumbPaths } from '@/components/Breadcrumb';
import { AsyncErrorBoundary } from '@/components/ErrorBoundary';
import { PageLoading } from '@/components/Loading';
import { getBaseUrl } from '@/lib/site-config';
import { type BlogPost as BlogPostType, type Category, getCategoryBySlug } from '@/lib/blog';
import { type BlogPost as MarkdownBlogPost } from '@/lib/markdown/markdown-types';
import { seoOverrides } from '@/lib/seo-overrides';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

// Enable ISR (Incremental Static Regeneration) - pages revalidate every 60 seconds
export const revalidate = 60;

export async function generateStaticParams() {
  const contentDir = path.join(process.cwd(), 'content/blog');
  const posts = getAllBlogPosts(contentDir);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

type QuickStat = {
  label: string;
  value: string;
  description?: string;
};

type ExtendedBlogPost = BlogPostType & {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  isPortableText?: boolean;
  quickAnswer?: string;
  quickStats?: QuickStat[];
  voiceSearchQueries?: string[];
  localSEO?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  faqs?: Array<{
    question: string;
    answer: string;
    isVoiceOptimized?: boolean;
  }>;
  ctaSettings?: {
    title?: string;
    subtitle?: string;
    buttonText?: string;
    whatsappMessage?: string;
  };
  rawContent?: string;
};

type AdjacentPost = {
  slug: string;
  title: string;
  excerpt: string;
  publishedDate?: string;
  category: Category;
};

type AdjacentPosts = {
  previous?: AdjacentPost;
  next?: AdjacentPost;
};

const mapAdjacentPost = (source?: MarkdownBlogPost): AdjacentPost | undefined => {
  if (!source) return undefined;

  const categoryCandidate =
    toStringValue(source.frontMatter.category) || toStringArray(source.frontMatter.categories)[0];

  return {
    slug: source.slug,
    title: source.title,
    excerpt: source.excerpt || source.frontMatter.description || '',
    publishedDate:
      toStringValue(source.publishedAt) ||
      toStringValue(source.frontMatter.publishedAt) ||
      toStringValue(source.frontMatter.publishedDate),
    category: toCategory(categoryCandidate),
  };
};

const toStringArray = (value: unknown): string[] => {
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

const getOptionalStringArray = (value: unknown): string[] | undefined => {
  const arr = toStringArray(value);
  return arr.length > 0 ? arr : undefined;
};

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

const asRecord = (value: unknown): Record<string, unknown> | null => {
  if (value && typeof value === 'object') {
    return value as Record<string, unknown>;
  }
  return null;
};

const toQuickStats = (value: unknown): QuickStat[] => {
  if (!Array.isArray(value)) return [];
  return value.reduce<QuickStat[]>((acc, item) => {
    if (!item || typeof item !== 'object') {
      return acc;
    }

    const label = 'label' in item && typeof item.label === 'string' ? item.label : null;
    const val = 'value' in item && typeof item.value === 'string' ? item.value : null;

    if (!label || !val) {
      return acc;
    }

    acc.push({
      label,
      value: val,
      description:
        'description' in item && typeof item.description === 'string'
          ? item.description
          : undefined,
    });

    return acc;
  }, []);
};

const toFaqs = (
  value: unknown
): Array<{
  question: string;
  answer: string;
  isVoiceOptimized?: boolean;
}> => {
  if (!Array.isArray(value)) return [];
  return value.reduce<
    Array<{
      question: string;
      answer: string;
      isVoiceOptimized?: boolean;
    }>
  >((acc, item) => {
    if (!item || typeof item !== 'object') {
      return acc;
    }

    const question =
      'question' in item && typeof item.question === 'string' ? item.question.trim() : null;
    const answer = 'answer' in item && typeof item.answer === 'string' ? item.answer.trim() : null;

    if (!question || !answer) {
      return acc;
    }

    acc.push({
      question,
      answer,
      isVoiceOptimized:
        'isVoiceOptimized' in item && typeof item.isVoiceOptimized === 'boolean'
          ? item.isVoiceOptimized
          : undefined,
    });

    return acc;
  }, []);
};

const toCategory = (slugCandidate?: string | null): Category => {
  if (slugCandidate) {
    const normalizedSlug = slugCandidate.toLowerCase().replace(/\s+/g, '-');
    const existingCategory = getCategoryBySlug(normalizedSlug);
    if (existingCategory) {
      return existingCategory;
    }
    return {
      slug: normalizedSlug,
      name: slugCandidate,
      description: '',
    };
  }

  return {
    slug: 'general',
    name: 'General',
    description: '',
  };
};

const safeDate = (value: unknown): string => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value;
  }
  if (value instanceof Date && !isNaN(value.getTime())) {
    return value.toISOString();
  }
  if (typeof value === 'number' && !Number.isNaN(value)) {
    return new Date(value).toISOString();
  }
  return new Date().toISOString();
};

const getPostTimestamp = (entry: MarkdownBlogPost): number => {
  const dateValue =
    toStringValue(entry.publishedAt) ||
    toStringValue(entry.frontMatter.publishedAt) ||
    toStringValue(entry.frontMatter.publishedDate);
  return dateValue ? new Date(dateValue).getTime() : 0;
};

// Helper function to get blog post by slug from markdown
async function getMarkdownPost(slug: string): Promise<ExtendedBlogPost | null> {
  const contentDir = path.join(process.cwd(), 'content/blog');
  const filePath = getMarkdownBySlug(contentDir, slug);

  if (!filePath) {
    return null;
  }

  const parsedPost = parseMarkdownFile(filePath);
  const frontMatterRecord = parsedPost.frontMatter as Record<string, unknown>;

  // Convert to format expected by the existing components
  type FrontMatterAuthor = string | { name?: string; bio?: string } | null | undefined;
  const frontMatterAuthor = parsedPost.frontMatter.author as FrontMatterAuthor;
  const authorName =
    typeof frontMatterAuthor === 'string'
      ? frontMatterAuthor
      : frontMatterAuthor?.name || 'Peter Pitcher';
  const defaultBio =
    'Licensee of The Anchor and founder of Orange Jelly. Helping pubs thrive with proven strategies.';
  const authorBio =
    typeof frontMatterAuthor === 'object' && frontMatterAuthor
      ? frontMatterAuthor.bio || defaultBio
      : defaultBio;

  const categoryCandidate =
    toStringValue(parsedPost.frontMatter.category) ||
    toStringArray(parsedPost.frontMatter.categories)[0];

  const publishedDateRaw =
    toStringValue(parsedPost.frontMatter.publishedAt) ||
    toStringValue(frontMatterRecord.publishedDate);
  const updatedDateRaw =
    toStringValue(parsedPost.frontMatter.updatedAt) || toStringValue(frontMatterRecord.updatedDate);

  const seoTitle =
    toStringValue(parsedPost.frontMatter.seoTitle) ||
    toStringValue(frontMatterRecord.metaTitle) ||
    parsedPost.frontMatter.title;
  const seoDescription =
    toStringValue(parsedPost.frontMatter.seoDescription) ||
    toStringValue(frontMatterRecord.metaDescription) ||
    parsedPost.excerpt ||
    '';

  const keywords =
    getOptionalStringArray(frontMatterRecord.keywords) ??
    toStringArray(parsedPost.frontMatter.tags);

  const quickAnswer = toStringValue(frontMatterRecord.quickAnswer);
  const voiceSearchQueries = toStringArray(frontMatterRecord.voiceSearchQueries);
  const quickStats = toQuickStats(frontMatterRecord.quickStats);
  const faqs = toFaqs(frontMatterRecord.faqs);

  const localSeoRecord = asRecord(frontMatterRecord.localSEO);
  let localSeoKeywords: string[] | undefined;
  if (localSeoRecord) {
    localSeoKeywords = getOptionalStringArray(localSeoRecord.keywords);
    if (!localSeoKeywords) {
      localSeoKeywords = getOptionalStringArray(localSeoRecord.localModifiers);
    }
  }
  const localSEO = localSeoRecord
    ? {
        title: toStringValue(localSeoRecord.title),
        description: toStringValue(localSeoRecord.description),
        keywords: localSeoKeywords,
      }
    : undefined;

  const ctaRecord = asRecord(frontMatterRecord.ctaSettings);
  const ctaSettings = ctaRecord
    ? {
        title: toStringValue(ctaRecord.title),
        subtitle: toStringValue(ctaRecord.subtitle),
        buttonText: toStringValue(ctaRecord.buttonText),
        whatsappMessage: toStringValue(ctaRecord.whatsappMessage),
      }
    : undefined;

  return {
    title: parsedPost.frontMatter.title,
    slug: parsedPost.frontMatter.slug,
    excerpt: parsedPost.excerpt || parsedPost.frontMatter.description || '',
    content: parsedPost.content,
    publishedDate: safeDate(publishedDateRaw),
    updatedDate: updatedDateRaw ? safeDate(updatedDateRaw) : undefined,
    category: toCategory(categoryCandidate),
    tags: toStringArray(parsedPost.frontMatter.tags),
    featuredImage:
      (toStringValue(frontMatterRecord.featuredImage) as string | undefined) ||
      `/images/blog/${slug}.svg`,
    seo: {
      metaTitle: seoTitle,
      metaDescription: seoDescription,
      keywords,
    },
    metaTitle: seoTitle,
    metaDescription: seoDescription,
    keywords,
    author: {
      name: authorName,
      role: 'Founder & Licensee',
      bio: authorBio,
      image: '/images/peter-pitcher.jpg',
    },
    readingTime: Math.round(parsedPost.readingTime?.minutes || 5),
    isPortableText: false,
    quickAnswer,
    voiceSearchQueries,
    quickStats,
    faqs,
    localSEO,
    ctaSettings,
    rawContent: parsedPost.content,
  };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getMarkdownPost(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const baseUrl = getBaseUrl();
  const canonicalPath = `/licensees-guide/${params.slug}`;
  const override = seoOverrides[canonicalPath];

  // Use the article's featured image for OpenGraph
  const ogImage =
    typeof post.featuredImage === 'string' && post.featuredImage.length > 0
      ? post.featuredImage
      : `/images/blog/${params.slug}.svg`;
  const absoluteImageUrl = ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`;

  const metaTitle = typeof post.metaTitle === 'string' ? post.metaTitle : undefined;
  const metaDescription =
    typeof post.metaDescription === 'string' ? post.metaDescription : undefined;

  const resolvedTitle = override?.title || metaTitle || post.title;
  const resolvedDescription = override?.description || metaDescription || post.excerpt;

  const keywords =
    Array.isArray(post.keywords) && post.keywords.length > 0
      ? post.keywords
      : Array.isArray(post.tags)
        ? post.tags
        : undefined;

  const resolvedKeywords =
    override?.keywords && override.keywords.length > 0 ? override.keywords : keywords;
  const canonicalUrl = override?.canonical || `${baseUrl}${canonicalPath}`;

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    keywords: resolvedKeywords,
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      type: 'article',
      publishedTime: typeof post.publishedDate === 'string' ? post.publishedDate : undefined,
      modifiedTime: typeof post.updatedDate === 'string' ? post.updatedDate : undefined,
      authors: [post.author?.name || 'Peter Pitcher'],
      siteName: 'Orange Jelly',
      locale: 'en_GB',
      url: canonicalUrl,
      images: [
        {
          url: absoluteImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
          type: 'image/svg+xml',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle,
      description: resolvedDescription,
      images: [absoluteImageUrl],
      creator: '@orangejelly_uk',
      site: '@orangejelly_uk',
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

// Async component that fetches data
async function BlogPostPageData({ params }: { params: { slug: string } }) {
  try {
    const post = await getMarkdownPost(params.slug);

    if (!post) {
      notFound();
    }

    // Get related posts (same category, different post)
    const contentDir = path.join(process.cwd(), 'content/blog');
    const allPosts = getAllBlogPosts(contentDir) as MarkdownBlogPost[];
    const categorySlug = post.category?.slug;

    const relatedPostsData = allPosts
      .filter((p) => categorySlug && p.slug !== post.slug && p.categories?.includes(categorySlug))
      .slice(0, 3);

    const relatedPosts: BlogPostType[] = relatedPostsData.map((p) => {
      const frontMatterRecord = p.frontMatter as Record<string, unknown>;
      const normalizedCategory =
        toStringValue(p.frontMatter.category) || toStringArray(p.frontMatter.categories)[0];
      const publishedDate =
        toStringValue(p.publishedAt) ||
        toStringValue(p.frontMatter.publishedAt) ||
        toStringValue(p.frontMatter.publishedDate);
      const updatedDate =
        toStringValue(p.updatedAt) ||
        toStringValue(p.frontMatter.updatedAt) ||
        toStringValue(p.frontMatter.updatedDate);

      return {
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt || p.frontMatter.description || '',
        content: p.content,
        publishedDate: safeDate(publishedDate),
        updatedDate: updatedDate ? safeDate(updatedDate) : undefined,
        category: toCategory(normalizedCategory),
        tags: toStringArray(p.tags),
        featuredImage:
          (toStringValue(frontMatterRecord.featuredImage) as string | undefined) ||
          `/images/blog/${p.slug}.svg`,
        seo: {
          metaTitle: toStringValue(p.seo?.title) || p.title,
          metaDescription: toStringValue(p.seo?.description) || p.excerpt || '',
          keywords: toStringArray(p.tags),
        },
        readingTime: Math.round(p.readingTime?.minutes || 5),
        author: {
          name: 'Peter Pitcher',
          role: 'Founder & Licensee',
          bio: 'Licensee of The Anchor and founder of Orange Jelly. Helping pubs thrive with proven strategies.',
          image: '/images/peter-pitcher.jpg',
        },
      };
    });

    const sortedPosts = [...allPosts].sort((a, b) => getPostTimestamp(b) - getPostTimestamp(a));
    const currentIndex = sortedPosts.findIndex((p) => p.slug === post.slug);
    const adjacentPosts: AdjacentPosts =
      currentIndex === -1
        ? {}
        : {
            previous: mapAdjacentPost(sortedPosts[currentIndex - 1]),
            next: mapAdjacentPost(sortedPosts[currentIndex + 1]),
          };

    // Extract FAQs from content if they exist and strip from body copy
    let faqs: Array<{ question: string; answer: string; isVoiceOptimized?: boolean }> = [];
    let contentWithoutFaqs = typeof post.content === 'string' ? post.content : '';

    // Use FAQs from frontmatter if available, otherwise extract from markdown
    if (post.faqs && post.faqs.length > 0) {
      faqs = post.faqs;
    } else if (post.rawContent) {
      const faqPattern = /##\s*FAQs?\s*\n([\s\S]*?)(?=\n##|$)/i;
      const faqMatch = post.rawContent.match(faqPattern);

      if (faqMatch) {
        const faqContent = faqMatch[1].trim();

        // Try markdown ### headings first
        const faqItemPattern = /###\s*(.+?)\n([\s\S]*?)(?=\n###|$)/g;
        let match;
        while ((match = faqItemPattern.exec(faqContent)) !== null) {
          faqs.push({
            question: match[1].trim(),
            answer: match[2].trim(),
          });
        }

        if (faqs.length === 0) {
          // Fallback for bold-question inline format (**Question?** Answer)
          const lines = faqContent
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean);
          let currentQuestion: string | null = null;
          let currentAnswer: string[] = [];

          const flush = () => {
            if (currentQuestion) {
              faqs.push({
                question: currentQuestion,
                answer: currentAnswer.join(' ').trim(),
              });
            }
            currentQuestion = null;
            currentAnswer = [];
          };

          lines.forEach((line) => {
            const boldMatch = line.match(/^\*\*(.+?)\*\*\s*(.*)$/);
            if (boldMatch) {
              // finish previous
              flush();
              currentQuestion = boldMatch[1].trim();
              const initialAnswer = boldMatch[2]?.trim();
              if (initialAnswer) currentAnswer.push(initialAnswer);
            } else if (currentQuestion) {
              currentAnswer.push(line);
            }
          });
          flush();
        }

        if (typeof post.content === 'string') {
          contentWithoutFaqs = post.content.replace(faqMatch[0], '').trim();
        }
      }
    }

    const postWithFaqs: ExtendedBlogPost = {
      ...post,
      content: contentWithoutFaqs || post.content,
      faqs,
    };

    const baseUrl = getBaseUrl();
    const schemaImage =
      typeof post.featuredImage === 'string'
        ? post.featuredImage
        : post.featuredImage?.src || post.featuredImage?.asset?.url || '/logo.png';

    return (
      <>
        <EnhancedBlogSchema
          post={{
            ...postWithFaqs,
            faqs,
            quickAnswer: post.quickAnswer,
            voiceSearchQueries: post.voiceSearchQueries,
            localSEO: post.localSEO,
          }}
          baseUrl={baseUrl}
        />
        <BreadcrumbJsonLd
          items={[
            { name: 'Home', url: '/' },
            { name: "The Licensee's Guide", url: '/licensees-guide' },
            { name: post.title, url: `/licensees-guide/${post.slug}` },
          ]}
        />
        <BlogPostingSchema
          title={post.title}
          description={post.excerpt}
          content={post.content}
          author={{
            name: post.author?.name || 'Peter Pitcher',
            url: '/about',
          }}
          datePublished={post.publishedDate}
          dateModified={post.updatedDate}
          image={schemaImage}
          url={`/licensees-guide/${post.slug}`}
          keywords={post.tags}
          speakableSections={[
            '.prose h2',
            '.prose h3',
            '.prose > p:first-of-type',
            '.quick-answer',
          ]}
        />
        {/* FAQs are already included in EnhancedBlogSchema - removed duplicate FAQSchema */}
        <Hero
          title={post.title}
          subtitle={post.excerpt}
          showCTA={false}
          breadcrumbs={[...breadcrumbPaths.licenseesGuide, { label: post.title }]}
        />
        <Section background="white">
          <div className="max-w-6xl mx-auto">
            <BlogPostClient
              post={postWithFaqs}
              relatedPosts={relatedPosts}
              adjacentPosts={adjacentPosts}
            />
          </div>
        </Section>
      </>
    );
  } catch (error) {
    console.error('Error fetching blog post data:', error);
    throw new Error('Failed to load blog post content. Please try again.');
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  return (
    <AsyncErrorBoundary>
      <Suspense fallback={<PageLoading message="Loading blog post..." />}>
        <BlogPostPageData params={params} />
      </Suspense>
    </AsyncErrorBoundary>
  );
}
