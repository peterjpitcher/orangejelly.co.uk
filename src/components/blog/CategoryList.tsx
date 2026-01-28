import { memo } from 'react';

import Link from 'next/link';
import Card from '@/components/Card';
import Heading from '@/components/Heading';

interface Category {
  slug: string;
  name: string;
  description?: string;
  postCount?: number;
}

interface CategoryListProps {
  categories: Category[];
  currentCategory?: string;
  variant?: 'sidebar' | 'grid';
  maxVisible?: number;
}

function CategoryList({
  categories,
  currentCategory,
  variant = 'sidebar',
  maxVisible,
}: CategoryListProps) {
  if (variant === 'grid') {
    const maxItems =
      typeof maxVisible === 'number' && maxVisible > 0 ? maxVisible : categories.length;
    const visibleCategories = categories.slice(0, maxItems);
    const hiddenCategories = categories.slice(maxItems);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {visibleCategories.map((category) => (
            <Link
              key={category.slug}
              href={`/licensees-guide/category/${category.slug}`}
              className="group"
            >
              <Card
                variant="bordered"
                className={`
                  text-center hover:border-orange transition-colors
                  ${currentCategory === category.slug ? 'border-orange' : ''}
                `}
              >
                <Heading level={4} className="mb-1 group-hover:text-orange transition-colors">
                  {category.name}
                </Heading>
                {category.postCount !== undefined && (
                  <p className="text-sm text-charcoal/60">
                    {category.postCount} {category.postCount === 1 ? 'article' : 'articles'}
                  </p>
                )}
              </Card>
            </Link>
          ))}
        </div>

        {hiddenCategories.length > 0 && (
          <details className="group rounded-xl border border-charcoal/10 bg-cream p-4">
            <summary className="cursor-pointer text-sm font-semibold text-charcoal/70 transition-colors hover:text-charcoal">
              See all topics ({categories.length})
            </summary>
            <div className="mt-4 flex flex-wrap gap-2">
              {hiddenCategories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/licensees-guide/category/${category.slug}`}
                  className={`
                    inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors
                    ${
                      currentCategory === category.slug
                        ? 'border-orange bg-orange/10 text-orange'
                        : 'border-charcoal/10 text-charcoal/70 hover:border-orange/50 hover:text-orange'
                    }
                  `}
                >
                  <span>{category.name}</span>
                  {category.postCount !== undefined && (
                    <span className="text-[10px] text-charcoal/50">{category.postCount}</span>
                  )}
                </Link>
              ))}
            </div>
          </details>
        )}
      </div>
    );
  }

  return (
    <Card variant="bordered" padding="medium">
      <Heading level={4} className="mb-4">
        Categories
      </Heading>
      <ul className="space-y-2">
        <li>
          <Link
            href="/licensees-guide"
            className={`
              block py-2 px-3 rounded-lg transition-colors text-sm
              ${!currentCategory ? 'bg-orange text-white' : 'hover:bg-orange/10 text-charcoal'}
            `}
          >
            All Articles
          </Link>
        </li>
        {categories.map((category) => (
          <li key={category.slug}>
            <Link
              href={`/licensees-guide/category/${category.slug}`}
              className={`
                block py-2 px-3 rounded-lg transition-colors text-sm
                ${
                  currentCategory === category.slug
                    ? 'bg-orange text-white'
                    : 'hover:bg-orange/10 text-charcoal'
                }
              `}
            >
              <span className="flex justify-between items-center">
                {category.name}
                {category.postCount !== undefined && (
                  <span
                    className={`
                    text-xs
                    ${currentCategory === category.slug ? 'text-white/80' : 'text-charcoal/60'}
                  `}
                  >
                    {category.postCount}
                  </span>
                )}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}

// Default categories for the blog
export const defaultCategories: Category[] = [
  {
    slug: 'empty-pub-solutions',
    name: 'Empty Pub Solutions',
    description: 'Proven strategies to fill empty tables and boost footfall',
  },
  {
    slug: 'social-media',
    name: 'Social Media',
    description: 'Make social media work for your pub without wasting hours',
  },
  {
    slug: 'competition',
    name: 'Competition',
    description: 'Stand out from chains and nearby pubs',
  },
  {
    slug: 'food-drink',
    name: 'Food & Drink',
    description: 'Menu strategies that increase sales and profits',
  },
  {
    slug: 'events-promotions',
    name: 'Events & Promotions',
    description: 'Events and promotions that actually bring customers in',
  },
];

export default memo(CategoryList);
