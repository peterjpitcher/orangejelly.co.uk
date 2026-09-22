'use client';

import { useEffect } from 'react';

// Web Vitals monitoring component
export default function PerformanceMonitor() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Only run in production
    if (process.env.NODE_ENV !== 'production') return;

    const dispatchMetric = (metric: { name: string; value: number; id: string; delta: number }) => {
      const payload = {
        event: 'web_vitals',
        metric_id: metric.id,
        metric_name: metric.name,
        metric_value: metric.value,
        metric_delta: metric.delta,
      };

      const dataLayerWindow = window as typeof window & { dataLayer?: Record<string, unknown>[] };
      if (Array.isArray(dataLayerWindow.dataLayer)) {
        dataLayerWindow.dataLayer!.push(payload);
      } else {
        // Fall back to console so we still see metrics during verification
        console.debug(`[Web Vitals] ${metric.name}:`, metric.value, metric);
      }
    };

    // Dynamically import web-vitals to reduce bundle size
    import('web-vitals')
      .then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
        // Core Web Vitals
        onCLS(dispatchMetric); // Cumulative Layout Shift
        onFID(dispatchMetric); // First Input Delay
        onLCP(dispatchMetric); // Largest Contentful Paint

        // Additional metrics
        onFCP(dispatchMetric); // First Contentful Paint
        onTTFB(dispatchMetric); // Time to First Byte
      })
      .catch((error) => {
        console.error('[Web Vitals] Failed to load metrics library', error);
      });
  }, []);

  return null;
}

// Preload critical resources
export function PreloadResources() {
  /*
   * No analytics preconnects, since 22 September 2026.
   *
   * There were four here, to Google Analytics, GTM and Microsoft Clarity. A
   * preconnect opens a real TCP/TLS connection, so every visitor's browser
   * contacted Google before they had answered the consent banner. GTM now loads
   * only after consent and Clarity is gone, so the connections were both unwanted
   * and pointless.
   */
  return (
    <>
      {/* Preload logo */}
      <link rel="preload" href="/logo.png" as="image" type="image/png" />
    </>
  );
}

// Lazy load images that are below the fold
export function useLazyLoad() {
  useEffect(() => {
    if ('IntersectionObserver' in window) {
      const images = document.querySelectorAll('img[data-lazy]');

      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src || '';
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach((img) => imageObserver.observe(img));

      return () => {
        images.forEach((img) => imageObserver.unobserve(img));
      };
    }
  }, []);
}
