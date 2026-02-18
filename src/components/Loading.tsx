'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import Container from './Container';
import Card from './Card';
import Heading from './Heading';
import Text from './Text';

interface LoadingProps {
  fullScreen?: boolean;
  variant?: 'page' | 'section' | 'card' | 'minimal';
  message?: string;
  className?: string;
}

export default function Loading({
  fullScreen = false,
  variant = 'minimal',
  message = 'Loading...',
  className,
}: LoadingProps) {
  if (variant === 'minimal') {
    return <div className={cn('animate-pulse rounded-md bg-muted', className)} />;
  }

  if (variant === 'card') {
    return (
      <Card className={cn('p-6 space-y-4', className)}>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </Card>
    );
  }

  if (variant === 'section') {
    return (
      <div className={cn('py-16', className)}>
        <Container>
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/2 mx-auto" />
              <Skeleton className="h-4 w-1/3 mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="p-6 space-y-4">
                  <Skeleton className="h-12 w-12 rounded-full mx-auto" />
                  <Skeleton className="h-6 w-3/4 mx-auto" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // Page variant and fullScreen
  const content = (
    <Container className="text-center py-20">
      <div className="space-y-6">
        {/* Orange Jelly Loading Animation */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-orange border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-teal rounded-full animate-spin animation-delay-200"></div>
          </div>
        </div>

        <div className="space-y-2">
          <Heading level={3} className="text-charcoal">
            {message}
          </Heading>
          <Text color="muted">
            Just like pulling the perfect pint, good things take a moment...
          </Text>
        </div>

        {/* Content skeleton */}
        <div className="max-w-4xl mx-auto space-y-8 pt-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-2/3 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-6 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                </div>
                <Skeleton className="h-8 w-1/3" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );

  if (fullScreen) {
    return (
      <div className={cn('min-h-screen bg-cream flex items-center justify-center', className)}>
        {content}
      </div>
    );
  }

  return <div className={className}>{content}</div>;
}

// Export the minimal skeleton for backward compatibility
export { Skeleton };

// Specialized loading components for common use cases
export function PageLoading({ message = 'Loading page content...' }: { message?: string }) {
  return <Loading fullScreen variant="page" message={message} />;
}

export function SectionLoading({ className }: { className?: string }) {
  return <Loading variant="section" className={className} />;
}

export function CardLoading({ className }: { className?: string }) {
  return <Loading variant="card" className={className} />;
}
