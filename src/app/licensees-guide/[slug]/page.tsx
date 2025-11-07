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

// Helper function to get blog post by slug from markdown
async function getMarkdownPost(slug: string) {
  const contentDir = path.join(process.cwd(), 'content/blog');
  const filePath = getMarkdownBySlug(contentDir, slug);

  if (!filePath) {
    return null;
  }

  const parsedPost = parseMarkdownFile(filePath);
  // Don't convert to HTML here - let the components handle it

  // Convert to format expected by the existing components
  return {
    title: parsedPost.frontMatter.title,
    slug: parsedPost.frontMatter.slug,
    excerpt: parsedPost.excerpt || parsedPost.frontMatter.description || '',
    content: parsedPost.content,
    publishedDate: parsedPost.frontMatter.publishedAt || parsedPost.frontMatter.publishedDate,
    updatedDate: parsedPost.frontMatter.updatedAt || parsedPost.frontMatter.updatedDate,
    category: {
      slug: parsedPost.frontMatter.category || parsedPost.frontMatter.categories?.[0] || 'general',
      name: parsedPost.frontMatter.category || parsedPost.frontMatter.categories?.[0] || 'General',
      description: '',
    },
    tags: parsedPost.frontMatter.tags || [],
    featuredImage: parsedPost.frontMatter.featuredImage || `/images/blog/${slug}.svg`,
    seo: {
      metaTitle:
        parsedPost.frontMatter.seoTitle ||
        parsedPost.frontMatter.metaTitle ||
        parsedPost.frontMatter.title,
      metaDescription:
        parsedPost.frontMatter.seoDescription ||
        parsedPost.frontMatter.metaDescription ||
        parsedPost.excerpt ||
        '',
      keywords: parsedPost.frontMatter.keywords || parsedPost.frontMatter.tags || [],
    },
    metaTitle:
      parsedPost.frontMatter.seoTitle ||
      parsedPost.frontMatter.metaTitle ||
      parsedPost.frontMatter.title,
    metaDescription:
      parsedPost.frontMatter.seoDescription ||
      parsedPost.frontMatter.metaDescription ||
      parsedPost.excerpt,
    keywords: parsedPost.frontMatter.keywords || parsedPost.frontMatter.tags || [],
    author: {
      name:
        typeof parsedPost.frontMatter.author === 'string'
          ? parsedPost.frontMatter.author
          : (parsedPost.frontMatter.author as any)?.name || 'Peter Pitcher',
      role: 'Founder & Licensee',
      bio:
        typeof parsedPost.frontMatter.author === 'object' && parsedPost.frontMatter.author
          ? (parsedPost.frontMatter.author as any).bio ||
            'Licensee of The Anchor and founder of Orange Jelly. Helping pubs thrive with proven strategies.'
          : 'Licensee of The Anchor and founder of Orange Jelly. Helping pubs thrive with proven strategies.',
      image: '/images/peter-pitcher.jpg',
    },
    readingTime: Math.round(parsedPost.readingTime?.minutes || 5),
    isPortableText: false,
    // Enhanced SEO fields from markdown frontmatter
    quickAnswer: parsedPost.frontMatter.quickAnswer,
    voiceSearchQueries: parsedPost.frontMatter.voiceSearchQueries,
    quickStats: parsedPost.frontMatter.quickStats,
    faqs: parsedPost.frontMatter.faqs,
    localSEO: parsedPost.frontMatter.localSEO,
    ctaSettings: parsedPost.frontMatter.ctaSettings,
    // Keep original content for FAQ extraction
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

  // Use the article's featured image for OpenGraph
  const ogImage = post.featuredImage || `/images/blog/${params.slug}.svg`;
  const absoluteImageUrl = ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`;

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    keywords: post.keywords || post.tags,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      type: 'article',
      publishedTime: post.publishedDate,
      modifiedTime: post.updatedDate,
      authors: [post.author?.name || 'Peter Pitcher'],
      siteName: 'Orange Jelly',
      locale: 'en_GB',
      url: `${baseUrl}/licensees-guide/${params.slug}`,
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
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      images: [absoluteImageUrl],
      creator: '@orangejelly_uk',
      site: '@orangejelly_uk',
    },
    alternates: {
      canonical: `${baseUrl}/licensees-guide/${params.slug}`,
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
    const allPosts = getAllBlogPosts(contentDir);
    const relatedPostsData = allPosts
      .filter((p) => p.categories?.includes(post.category.slug) && p.slug !== post.slug)
      .slice(0, 3);

    const relatedPosts = await Promise.all(
      relatedPostsData.map(async (p) => {
        // Don't convert to HTML here - let the components handle it
        return {
          title: p.title,
          slug: p.slug,
          excerpt: p.excerpt || '',
          content: p.content,
          publishedDate: p.publishedAt || p.frontMatter?.publishedDate || '',
          updatedDate: p.updatedAt || p.frontMatter?.updatedDate,
          category: {
            slug: p.categories?.[0] || 'general',
            name: p.categories?.[0] || 'General',
            description: '',
          },
          tags: p.tags || [],
          featuredImage: p.frontMatter?.featuredImage || `/images/blog/${p.slug}.svg`,
          seo: {
            metaTitle: p.seo?.title || p.title,
            metaDescription: p.seo?.description || p.excerpt || '',
            keywords: p.tags || [],
          },
          metaTitle: p.seo?.title || p.title,
          metaDescription: p.seo?.description || p.excerpt,
          keywords: p.tags || [],
          author: {
            name: 'Peter Pitcher',
            role: 'Founder & Licensee',
            bio: 'Licensee of The Anchor and founder of Orange Jelly. Helping pubs thrive with proven strategies.',
            image: '/images/peter-pitcher.jpg',
          },
          readingTime: Math.round(p.readingTime?.minutes || 5),
          isPortableText: false,
        };
      })
    );

    // Extract FAQs from content if they exist and strip from body copy
    let faqs: Array<{ question: string; answer: string }> = [];
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

    const postWithFaqs = {
      ...post,
      content: contentWithoutFaqs || post.content,
      faqs,
    };

    const baseUrl = getBaseUrl();

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
          image={post.featuredImage || '/logo.png'}
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
            <BlogPostClient post={postWithFaqs} relatedPosts={relatedPosts} />
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
