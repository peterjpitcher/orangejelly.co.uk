'use client';

import { useState, useEffect } from 'react';
import WhatsAppButton from './WhatsAppButton';
import OptimizedImage from './OptimizedImage';
import Text from './Text';
import Button from './Button';

export default function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past 800px
      const shouldShow = window.scrollY > 800;
      setIsVisible(shouldShow);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-orange/20 shadow-lg transform transition-normal">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Left side - Logo and message */}
          <div className="flex items-center gap-3">
            <OptimizedImage
              src="/logo.png"
              alt="Orange Jelly - transformative hospitality marketing"
              width={32}
              height={32}
              className="rounded hidden sm:block"
            />
            <div className="text-center sm:text-left">
              <Text size="sm" weight="semibold" className="sm:text-base">
                Small Team. Action-First Support.
              </Text>
              <Text size="xs" className="text-charcoal/60 hidden sm:block">
                Pay for progress, not overheads. Meaningful momentum inside 30 days.
              </Text>
            </div>
          </div>

          {/* Right side - CTA */}
          <div className="flex items-center gap-3">
            <WhatsAppButton text="Start a Growth Chat" size="small" />

            {/* Close button */}
            <Button
              onClick={() => setIsVisible(false)}
              variant="ghost"
              size="small"
              className="p-2 hover:bg-cream rounded-lg transition-quick text-charcoal/60 hover:text-charcoal"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
