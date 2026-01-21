import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import BlogPostCard from '@/components/blog/BlogPostCard';
import CategoryList from '@/components/blog/CategoryList';
import { getAllPosts, getCategories } from '@/lib/blog-md';
import { CollectionPageSchema } from '@/components/CollectionPageSchema';
import { breadcrumbPaths } from '@/components/Breadcrumb';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';
import { getCategoryBySlug } from '@/lib/blog';
import { generateMetadata as generateMeta } from '@/lib/metadata';

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

// Enable ISR (Incremental Static Regeneration) - pages revalidate every 60 seconds
export const revalidate = 60;

export async function generateStaticParams() {
  const categories = getCategories();
  return categories.map((category) => ({
    category: category.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = getCategoryBySlug(params.category);
  const title = category?.name || humanizeCategorySlug(params.category);
  const description =
    category?.description ||
    `Browse all ${title} articles from The Licensee's Guide. Practical, proven ideas you can use.`;

  return generateMeta({
    title: `${title} - The Licensee's Guide`,
    description,
    path: `/licensees-guide/category/${params.category}`,
    ogType: 'website',
  });
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const posts = getAllPosts();
  const categories = getCategories();

  const categoryPosts = posts.filter((post) => post.category === params.category);

  if (categoryPosts.length === 0) {
    notFound();
  }

  const category = getCategoryBySlug(params.category);
  const categoryTitle = category?.name || humanizeCategorySlug(params.category);
  const categoryDescription = category?.description;

  return (
    <>
      <CollectionPageSchema
        name={`${categoryTitle} - The Licensee's Guide`}
        description={categoryDescription || `Browse all ${categoryTitle} articles`}
        url={`/licensees-guide/category/${params.category}`}
        items={categoryPosts.map((post) => ({
          url: `/licensees-guide/${post.slug}`,
          name: post.title,
          description: post.excerpt,
          datePublished: post.publishedDate,
          author: 'Peter Pitcher',
          image: post.featuredImage || '/logo.png',
        }))}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: "The Licensee's Guide", url: '/licensees-guide' },
          { name: categoryTitle, url: `/licensees-guide/category/${params.category}` },
        ]}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: "The Licensee's Guide", url: '/licensees-guide' },
          { name: categoryTitle, url: `/licensees-guide/category/${params.category}` },
        ]}
      />
      <Hero
        title={categoryTitle}
        subtitle={categoryDescription}
        showCTA={false}
        breadcrumbs={[
          ...breadcrumbPaths.licenseesGuide,
          { label: categoryTitle, href: `/licensees-guide/category/${params.category}` },
        ]}
      />

      <Section background="white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          {/* Category Navigation */}
          <div className="mb-12">
            <CategoryList
              categories={categories}
              currentCategory={params.category}
              variant="grid"
            />
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoryPosts.map((post) => (
              <BlogPostCard
                key={post.slug}
                post={{
                  slug: post.slug,
                  title: post.title,
                  excerpt: post.excerpt,
                  publishedDate: post.publishedDate,
                  category: {
                    name: categoryTitle,
                    slug: params.category,
                  },
                  featuredImage: {
                    src: post.featuredImage || '/logo.png',
                    alt: post.title,
                  },
                  author: {
                    name: 'Peter Pitcher',
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
