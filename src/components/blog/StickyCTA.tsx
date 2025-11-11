'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/Button';
import Text from '@/components/Text';
import { URLS } from '@/lib/constants';

export default function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 30% of the page
      const scrollPercentage = (window.scrollY / document.documentElement.scrollHeight) * 100;
      setIsVisible(scrollPercentage > 30);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Desktop floating CTA - bottom right */}
      <div
        className={`hidden md:block fixed bottom-8 right-8 z-40 transition-all duration-300 ${
          isMinimized ? 'w-16' : 'w-80'
        }`}
      >
        <div className="bg-white rounded-lg shadow-2xl border-2 border-orange">
          {isMinimized ? (
            <button
              onClick={() => setIsMinimized(false)}
              className="w-full h-16 flex items-center justify-center text-orange hover:bg-orange hover:text-white transition-colors rounded-lg"
              aria-label="Expand help offer"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 12H16M12 8V16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          ) : (
            <div className="p-4">
              <button
                onClick={() => setIsMinimized(true)}
                className="absolute top-2 right-2 text-charcoal/40 hover:text-charcoal"
                aria-label="Minimize"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M5 10H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>

              <Text size="sm" className="font-semibold mb-2 pr-6">
                Need help with your pub?
              </Text>
              <Text size="xs" color="muted" className="mb-3">
                Get practical advice from a real licensee who's been there.
              </Text>
              <Button
                href={URLS.whatsapp('Hi Peter, I just read your blog and need help with my pub')}
                variant="primary"
                size="small"
                fullWidth
                external
              >
                Get in Touch
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile sticky CTA - bottom bar */}
      <div
        className={`md:hidden fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="bg-orange text-white p-3 shadow-lg">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <Text size="sm" className="font-semibold text-white">
                Need help with your pub?
              </Text>
              <Text size="xs" className="text-white/90">
                Real advice from a real licensee
              </Text>
            </div>
            <Button
              href={URLS.whatsapp('Hi Peter, I just read your blog and need help')}
              variant="secondary"
              size="small"
              external
              className="!bg-white !text-orange hover:!bg-cream whitespace-nowrap"
            >
              Get Help
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
