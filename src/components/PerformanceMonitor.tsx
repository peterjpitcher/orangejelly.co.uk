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
  return (
    <>
      {/* Google Fonts are automatically optimized by Next.js, no need to preload */}

      {/* Preload logo */}
      <link rel="preload" href="/logo.png" as="image" type="image/png" />

      {/* DNS prefetch / preconnect for external resources used by analytics */}
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.google-analytics.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://region1.google-analytics.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.clarity.ms" crossOrigin="anonymous" />
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
