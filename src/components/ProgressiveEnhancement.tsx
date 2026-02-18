'use client';

import { useEffect, useState } from 'react';
import OptimizedImage from '@/components/OptimizedImage';

// Component that only renders children when JavaScript is available
export function ClientOnly({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
}

// Fallback content for when JavaScript is disabled
export function NoScriptFallback({ children }: { children: React.ReactNode }) {
  return <noscript>{children}</noscript>;
}

// Enhanced image that works without JavaScript
export function ProgressiveImage({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}) {
  return (
    <>
      {/* Use OptimizedImage component */}
      <OptimizedImage
        src={src}
        alt={alt}
        className={className}
        width={width || 100}
        height={height || 100}
        priority={priority}
      />
    </>
  );
}

// Accordion that works without JavaScript using details/summary
export function ProgressiveAccordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details open={defaultOpen} className="group">
      <summary className="cursor-pointer list-none p-4 bg-white rounded-lg shadow-soft hover:shadow-hover transition-shadow">
        <div className="flex justify-between items-center">
          <span className="font-semibold">{title}</span>
          <span className="transition-transform group-open:rotate-180">▼</span>
        </div>
      </summary>
      <div className="mt-2 p-4 bg-cream-light rounded-lg">{children}</div>
    </details>
  );
}

// Form that works without JavaScript
export function ProgressiveForm({
  action,
  method = 'POST',
  children,
  onSubmit,
}: {
  action: string;
  method?: 'GET' | 'POST';
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
}) {
  const [isEnhanced, setIsEnhanced] = useState(false);

  useEffect(() => {
    setIsEnhanced(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    if (isEnhanced && onSubmit) {
      e.preventDefault();
      onSubmit(e);
    }
    // Otherwise, let the form submit normally
  };

  return (
    <form action={action} method={method} onSubmit={handleSubmit}>
      {children}
      <NoScriptFallback>
        <p className="text-sm text-charcoal/60 mt-2">
          JavaScript is disabled. The form will submit and reload the page.
        </p>
      </NoScriptFallback>
    </form>
  );
}
