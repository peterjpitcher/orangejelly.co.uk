'use client';

import { useState, useEffect } from 'react';
import OptimizedImage from '@/components/OptimizedImage';
import Card from './Card';
import Button from './Button';
import Text from './Text';

// Define local social proof type interface
interface LocalSocialProofItem {
  title: string;
  displayText: string;
  value: string;
  category: string;
  timeframe: string;
  location: string;
  order: number;
  isActive: boolean;
}

interface SocialProofProps {
  socialProofItems?: LocalSocialProofItem[];
}

export default function SocialProof({ socialProofItems }: SocialProofProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Transform local data to notification format
  const notifications = socialProofItems
    ? socialProofItems
        .filter((item) => item.isActive)
        .sort((a, b) => a.order - b.order)
        .map((item) => ({
          pub: item.location || 'The Anchor',
          location: 'Stanwell Moor',
          message: item.displayText,
          time: item.timeframe || 'Ongoing',
        }))
    : [
        {
          pub: 'The Anchor',
          location: 'Stanwell Moor',
          message: 'Cut £250/week in Sunday food waste',
          time: 'Ongoing',
        },
        {
          pub: 'The Anchor',
          location: 'Stanwell Moor',
          message: '25-30 quiz teams every month',
          time: 'Monthly',
        },
        {
          pub: 'The Anchor',
          location: 'Stanwell Moor',
          message: '60,000-70,000 people reached on social media',
          time: 'Monthly',
        },
        {
          pub: 'The Anchor',
          location: 'Stanwell Moor',
          message: '£4,000+ monthly margin growth across supplier, rota, and energy',
          time: 'Monthly',
        },
      ];

  useEffect(() => {
    // Start showing notifications after 10 seconds
    const initialDelay = setTimeout(() => {
      setIsVisible(true);
    }, 10000);

    // Cycle through notifications every 8 seconds
    const interval = setInterval(() => {
      setIsVisible(false);

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % notifications.length);
        setIsVisible(true);
      }, 500);
    }, 8000);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, [notifications.length]);

  const currentNotification = notifications[currentIndex];

  return (
    <div
      className={`fixed top-20 left-4 z-40 max-w-sm transition-slow transform ${
        isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
      }`}
    >
      <Card variant="bordered" padding="small" className="shadow-lg">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-orange/10 rounded-full flex items-center justify-center">
              <span className="text-xl">🍺</span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <Text size="sm" weight="semibold">
              {currentNotification.pub}
              <span className="text-xs text-charcoal/60 font-normal ml-1">
                ({currentNotification.location})
              </span>
            </Text>
            <Text size="sm" color="muted">
              {currentNotification.message}
            </Text>
            <Text size="xs" className="text-charcoal/50 mt-1">
              {currentNotification.time}
            </Text>
          </div>

          {/* Close button */}
          <Button
            onClick={() => setIsVisible(false)}
            variant="custom"
            className="text-charcoal/40 hover:text-charcoal/60 transition-quick p-0"
            aria-label="Close notification"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
        </div>

        {/* Orange Jelly branding */}
        <div className="mt-3 pt-3 border-t flex items-center justify-between">
          <span className="text-xs text-charcoal/50">Powered by</span>
          <OptimizedImage
            src="/logo.png"
            alt="Orange Jelly"
            width={20}
            height={20}
            className="rounded opacity-50"
          />
        </div>
      </Card>
    </div>
  );
}
