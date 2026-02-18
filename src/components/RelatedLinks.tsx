import Link from 'next/link';
import Card from '@/components/Card';
import Heading from '@/components/Heading';
import Text from '@/components/Text';
import Grid from '@/components/Grid';
import AnimatedItem from '@/components/AnimatedItem';

export interface RelatedLink {
  title: string;
  description: string;
  href: string;
  emoji?: string;
  highlight?: boolean;
}

interface RelatedLinksProps {
  title?: string;
  subtitle?: string;
  links: RelatedLink[];
  variant?: 'card' | 'inline' | 'compact';
  columns?: {
    default?: 1 | 2 | 3 | 4;
    sm?: 1 | 2 | 3 | 4;
    md?: 1 | 2 | 3 | 4;
    lg?: 1 | 2 | 3 | 4;
  };
  centered?: boolean;
}

export default function RelatedLinks({
  title = 'Related Topics',
  subtitle,
  links,
  variant = 'card',
  columns = { default: 1, md: 2, lg: 3 },
  centered = false,
}: RelatedLinksProps) {
  if (links.length === 0) return null;

  // Card variant - for featured related content
  if (variant === 'card') {
    return (
      <AnimatedItem animation="fade-in">
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Heading level={3} className="mb-3">
            {title}
          </Heading>
          {subtitle && (
            <Text size="lg" className="text-charcoal/70 mb-6">
              {subtitle}
            </Text>
          )}

          <Grid columns={columns} gap="medium">
            {links.map((link, index) => (
              <Link key={index} href={link.href} className="block hover:no-underline">
                <Card variant={link.highlight ? 'colored' : 'default'} className="h-full">
                  <div className="flex items-start gap-4">
                    {link.emoji && (
                      <span className="text-2xl flex-shrink-0" aria-hidden="true">
                        {link.emoji}
                      </span>
                    )}
                    <div className="flex-1 min-w-0">
                      <Heading
                        level={4}
                        className="font-semibold text-charcoal mb-2 group-hover:text-orange transition-colors"
                      >
                        {link.title}
                      </Heading>
                      <Text size="sm" className="text-charcoal/70">
                        {link.description}
                      </Text>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </Grid>
        </div>
      </AnimatedItem>
    );
  }

  // Inline variant - for contextual links within content
  if (variant === 'inline') {
    return (
      <div className={`my-8 p-6 bg-cream rounded-lg ${centered ? 'text-center' : ''}`}>
        <Heading
          level={4}
          className={`font-semibold text-charcoal mb-4 ${centered ? 'text-center' : ''}`}
        >
          {title}
        </Heading>
        <ul className={`space-y-3 ${centered ? 'max-w-2xl mx-auto' : ''}`}>
          {links.map((link, index) => (
            <li
              key={index}
              className={`flex items-start gap-2 ${centered ? 'justify-center' : ''}`}
            >
              <span className="text-orange mt-0.5">→</span>
              <div className={centered ? 'text-left' : ''}>
                <Link
                  href={link.href}
                  className="font-medium text-charcoal hover:text-orange transition-colors"
                >
                  {link.title}
                </Link>
                {link.description && (
                  <Text size="sm" className="text-charcoal/70 mt-1">
                    {link.description}
                  </Text>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Compact variant - for footer or sidebar links
  return (
    <div className="space-y-2">
      <Heading
        level={4}
        className="font-semibold text-sm uppercase tracking-wider text-charcoal/60 mb-3"
      >
        {title}
      </Heading>
      <ul className="space-y-2">
        {links.map((link, index) => (
          <li key={index}>
            <Link
              href={link.href}
              className="text-sm text-charcoal/80 hover:text-orange transition-colors flex items-center gap-2"
            >
              {link.emoji && <span aria-hidden="true">{link.emoji}</span>}
              {link.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Note: Related links are now managed through local JSON data in /content/data/related-links.json
