import { memo } from 'react';

import OptimizedImage from '@/components/OptimizedImage';
import Link from 'next/link';
import Card from '@/components/Card';
import Heading from '@/components/Heading';
import Text from '@/components/Text';

interface AuthorInfoProps {
  author: {
    name: string;
    role: string;
    bio: string;
    image: string;
  };
  variant?: 'full' | 'compact';
}

function AuthorInfo({ author, variant = 'full' }: AuthorInfoProps) {
  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3">
        <OptimizedImage
          src={author.image}
          alt={author.name}
          width={40}
          height={40}
          className="rounded-full"
        />
        <div>
          <Text size="sm" weight="medium">
            {author.name}
          </Text>
          <Text size="xs" color="muted">
            {author.role}
          </Text>
        </div>
      </div>
    );
  }

  return (
    <Card variant="bordered" padding="large">
      <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
        <OptimizedImage
          src={author.image}
          alt={author.name}
          width={120}
          height={120}
          className="rounded-full"
        />

        <div className="text-center sm:text-left">
          <Heading level={3} className="mb-1">
            {author.name}
          </Heading>
          <Text className="text-orange mb-3">{author.role}</Text>
          <Text color="muted" className="mb-4">
            {author.bio}
          </Text>

          <Link href="/about" className="text-orange hover:text-orange-dark font-medium text-sm">
            Learn more about Peter →
          </Link>
        </div>
      </div>
    </Card>
  );
}

// Default author for most posts
export const defaultAuthor = {
  name: 'Peter Pitcher',
  role: 'Licensee & Founder',
  bio: 'I run The Anchor in Stanwell Moor with my husband Billy. After struggling with empty tables and overwhelming marketing tasks, I started using AI to make pub marketing faster and more effective. Everything I share is tested at The Anchor first.',
  image: '/images/peter-pitcher.jpg',
};

export default memo(AuthorInfo);
