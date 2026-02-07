import { memo } from 'react';

import Link from 'next/link';
import OptimizedImage from './OptimizedImage';
import Heading from './Heading';
import Text from './Text';

interface LogoProps {
  variant?: 'default' | 'icon' | 'horizontal' | 'stacked';
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  showTagline?: boolean;
  className?: string;
  href?: string;
}

function Logo({
  variant = 'default',
  size = 'medium',
  showTagline = false,
  className = '',
  href,
}: LogoProps) {
  const sizes = {
    small: { logo: 32, text: 'text-sm' },
    medium: { logo: 48, text: 'text-lg' },
    large: { logo: 64, text: 'text-xl' },
    xlarge: { logo: 96, text: 'text-2xl' },
  };

  const currentSize = sizes[size];

  const logoContent = () => {
    switch (variant) {
      case 'icon':
        return (
          <div className="relative">
            <OptimizedImage
              src="/logo.png"
              alt="Orange Jelly"
              width={currentSize.logo}
              height={currentSize.logo}
              className="rounded-lg"
              priority
            />
            <div className="absolute inset-0 bg-orange/20 rounded-lg blur-xl -z-10"></div>
          </div>
        );

      case 'horizontal':
        return (
          <div className="flex items-center gap-3">
            <OptimizedImage
              src="/logo.png"
              alt="Orange Jelly"
              width={currentSize.logo}
              height={currentSize.logo}
              className="rounded-lg"
              priority
            />
            <div>
              <Heading level={3} className={`font-bold ${currentSize.text} text-charcoal`}>
                Orange Jelly
              </Heading>
              {showTagline && (
                <Text size="xs" className="text-charcoal/60">
                  Transformative Hospitality Marketing
                </Text>
              )}
            </div>
          </div>
        );

      case 'stacked':
        return (
          <div className="text-center">
            <OptimizedImage
              src="/logo.png"
              alt="Orange Jelly"
              width={currentSize.logo}
              height={currentSize.logo}
              className="rounded-lg mx-auto mb-2"
              priority
            />
            <Heading level={3} className={`font-bold ${currentSize.text} text-charcoal`}>
              Orange Jelly
            </Heading>
            {showTagline && (
              <Text size="sm" className="text-charcoal/60 mt-1">
                Transformative Hospitality Marketing
              </Text>
            )}
          </div>
        );

      default:
        return (
          <OptimizedImage
            src="/logo.png"
            alt="Orange Jelly"
            width={currentSize.logo}
            height={currentSize.logo}
            className="rounded-lg"
            priority
          />
        );
    }
  };

  const content = <div className={`inline-block ${className}`}>{logoContent()}</div>;

  if (href) {
    return (
      <Link href={href} className="hover:opacity-80 transition-quick">
        {content}
      </Link>
    );
  }

  return content;
}

export default memo(Logo);
