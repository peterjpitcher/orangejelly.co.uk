import Card from '@/components/Card';
import Heading from '@/components/Heading';
import Text from '@/components/Text';
import Button from '@/components/Button';
import { formatDate } from '@/lib/utils';
import { type AdjacentPostNavItem } from '@/lib/blog';
import clsx from 'clsx';

interface AdjacentPostNavProps {
  adjacentPosts: {
    previous?: AdjacentPostNavItem;
    next?: AdjacentPostNavItem;
  };
}

export default function AdjacentPostNav({ adjacentPosts }: AdjacentPostNavProps) {
  if (!adjacentPosts.previous && !adjacentPosts.next) {
    return null;
  }

  return (
    <section className="mt-12">
      <Heading level={3} className="mb-4">
        Keep exploring proven tactics
      </Heading>
      <div className="grid gap-4 md:grid-cols-2">
        {adjacentPosts.previous && (
          <PostCard label="Previously" post={adjacentPosts.previous} align="start" />
        )}
        {adjacentPosts.next && (
          <PostCard label="Up next" post={adjacentPosts.next} align="end" highlight />
        )}
      </div>
    </section>
  );
}

interface PostCardProps {
  label: string;
  post: AdjacentPostNavItem;
  align: 'start' | 'end';
  highlight?: boolean;
}

function PostCard({ label, post, align, highlight = false }: PostCardProps) {
  const alignmentClass = align === 'start' ? 'self-start' : 'self-end';

  return (
    <Card
      variant="bordered"
      className={clsx(
        'flex h-full flex-col gap-3 border',
        highlight ? 'border-orange/40 bg-cream/60' : 'border-charcoal/10'
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/60">{label}</p>
      <Text className="text-xs font-medium text-orange">
        {post.category.name} •{' '}
        {post.publishedDate ? formatDate(post.publishedDate) : 'Fresh from the guide'}
      </Text>
      <Heading level={4} className="text-lg leading-snug">
        {post.title}
      </Heading>
      <Text className="text-sm text-charcoal/70">{post.excerpt}</Text>
      <Button
        href={`/licensees-guide/${post.slug}`}
        variant="ghost"
        className={clsx('mt-auto text-sm font-semibold text-orange', alignmentClass)}
      >
        Read article
      </Button>
    </Card>
  );
}
