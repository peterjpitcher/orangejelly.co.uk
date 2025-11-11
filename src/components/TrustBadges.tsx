import Card from './Card';
import Heading from './Heading';
import Text from './Text';
import OptimizedImage from './OptimizedImage';

// Define local trust badge type interface
interface LocalTrustBadge {
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  order: number;
  isActive: boolean;
}

interface TrustBadgesProps {
  variant?: 'horizontal' | 'vertical' | 'compact';
  showAll?: boolean;
  trustBadges?: LocalTrustBadge[];
  isLoading?: boolean;
}

export default function TrustBadges({
  variant = 'horizontal',
  showAll = true,
  trustBadges,
  isLoading = false,
}: TrustBadgesProps) {
  // Map icon names to emojis
  const iconMap: Record<string, string> = {
    money: '💰',
    clock: '📅',
    shield: '🛡️',
    star: '⭐',
    check: '✅',
    heart: '❤️',
  };

  // Show loading state
  if (isLoading) {
    return (
      <div
        className={
          variant === 'horizontal'
            ? 'grid grid-cols-2 md:grid-cols-4 gap-4'
            : 'grid grid-cols-1 gap-4'
        }
      >
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} variant="shadowed" padding="small" className="animate-pulse">
            <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </Card>
        ))}
      </div>
    );
  }

  // Show error state if no badges
  if (!trustBadges || trustBadges.length === 0) {
    return (
      <Card variant="bordered" padding="medium" className="text-center">
        <Text color="muted">Trust badges are currently being updated. Please check back soon.</Text>
      </Card>
    );
  }

  // Transform local data
  const badges = trustBadges
    .filter((badge) => badge.isActive)
    .sort((a, b) => a.order - b.order)
    .map((badge) => ({
      icon: iconMap[badge.icon] || '📌',
      title: badge.title,
      subtitle: badge.subtitle,
    }));

  const displayBadges = showAll ? badges : badges.slice(0, 3);

  if (variant === 'compact') {
    return (
      <div className="flex flex-wrap justify-center gap-4">
        {displayBadges.map((badge, index) => (
          <Card
            key={index}
            variant="bordered"
            padding="small"
            className="flex items-center gap-2 backdrop-blur-sm !rounded-full"
          >
            <span className="text-2xl">{badge.icon}</span>
            <span className="font-semibold text-sm">{badge.title}</span>
          </Card>
        ))}
      </div>
    );
  }

  const gridClass =
    variant === 'horizontal' ? 'grid grid-cols-2 md:grid-cols-4 gap-4' : 'grid grid-cols-1 gap-4';

  return (
    <div className={gridClass}>
      {displayBadges.map((badge, index) => (
        <Card
          key={index}
          variant="shadowed"
          padding="small"
          className="text-center bg-gradient-to-br from-white to-cream hover:shadow-lg transition-normal hover:-translate-y-1"
        >
          <div className="text-4xl mb-2">{badge.icon}</div>
          <Heading level={4} align="center" className="text-charcoal">
            {badge.title}
          </Heading>
          <Text size="xs" align="center" className="text-charcoal/60 mt-1">
            {badge.subtitle}
          </Text>
        </Card>
      ))}
    </div>
  );
}

interface TrustBadgeClaims {
  noAgencyFees?: {
    claim?: string;
    context?: string;
  };
}

export function FloatingTrustBadge({ claims }: { claims?: TrustBadgeClaims }) {
  // Show loading state
  if (!claims) {
    return (
      <div className="fixed bottom-4 left-4 z-30 hidden lg:block">
        <Card variant="bordered" padding="small" className="shadow-lg max-w-xs animate-pulse">
          <div className="h-20 w-64 bg-gray-200 rounded"></div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-30 hidden lg:block">
      <Card
        variant="bordered"
        padding="small"
        className="shadow-lg max-w-xs animate-fade-in border-2"
      >
        <div className="flex items-center gap-3">
          <div className="text-3xl">💰</div>
          <div>
            <Text size="sm" weight="bold">
              {claims.noAgencyFees?.claim || 'No Agency Fees'}
            </Text>
            <Text size="xs" className="text-charcoal/60">
              {claims.noAgencyFees?.context || 'Honest hourly pricing'}
            </Text>
          </div>
        </div>

        {/* Verified by Orange Jelly */}
        <div className="mt-3 pt-3 border-t flex items-center justify-between">
          <OptimizedImage
            src="/logo.png"
            alt="Orange Jelly"
            width={24}
            height={24}
            className="rounded"
          />
          <span className="text-xs text-charcoal/60">Verified Promise</span>
        </div>
      </Card>
    </div>
  );
}
