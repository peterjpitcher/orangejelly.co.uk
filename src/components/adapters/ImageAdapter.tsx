import * as React from 'react';
import { Image as ShadcnImage } from '@/components/ui/image';
import type { ImageProps as ShadcnImageProps } from '@/components/ui/image';
import { cn } from '@/lib/utils';

// Legacy OptimizedImage props
interface LegacyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  className?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  fill?: boolean;
  style?: React.CSSProperties;
  onLoad?: () => void;
  loading?: 'lazy' | 'eager';
}

export default function ImageAdapter({
  src,
  alt,
  width,
  height,
  priority = false,
  sizes,
  className = '',
  quality = 85,
  placeholder = 'empty',
  blurDataURL,
  fill = false,
  style,
  onLoad,
  loading,
}: LegacyImageProps) {
  // Map legacy props to shadcn props
  const imageProps: ShadcnImageProps = {
    src,
    alt,
    priority,
    sizes,
    className,
    quality,
    placeholder,
    blurDataURL,
    style,
    onLoad,
    loading,
  };

  // Add dimensions if not using fill
  if (!fill) {
    imageProps.width = width;
    imageProps.height = height;
  } else {
    imageProps.fill = true;
  }

  // For fill images, wrap in a container
  if (fill) {
    return (
      <div style={style}>
        <ShadcnImage {...imageProps} className={className} />
      </div>
    );
  }

  return <ShadcnImage {...imageProps} />;
}

// ResponsiveImage adapter
interface ResponsiveImageProps {
  sources: Array<{
    media: string;
    src: string;
  }>;
  fallback: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export function ResponsiveImage({
  sources,
  fallback,
  className = '',
  priority = false,
  sizes,
}: ResponsiveImageProps) {
  const loadingAttr = priority ? 'eager' : 'lazy';
  const imageClass = cn('w-full h-auto', className);

  return (
    <picture>
      {sources.map((source) => (
        <source key={`${source.media}-${source.src}`} media={source.media} srcSet={source.src} />
      ))}
      <img
        src={fallback.src}
        alt={fallback.alt}
        width={fallback.width}
        height={fallback.height}
        loading={loadingAttr}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        className={imageClass}
        sizes={sizes}
      />
    </picture>
  );
}

// OptimizedBackground adapter
interface OptimizedBackgroundProps {
  src: string;
  alt?: string;
  className?: string;
  children?: React.ReactNode;
  overlay?: boolean;
  overlayOpacity?: number;
}

export function OptimizedBackground({
  src,
  alt = '',
  className = '',
  children,
  overlay = false,
  overlayOpacity = 0.5,
}: OptimizedBackgroundProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <ShadcnImage
        src={src}
        alt={alt}
        fill
        sizes="100vw"
        quality={90}
        priority
        className="object-cover"
        style={{ zIndex: -1 }}
      />
      {overlay && (
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity, zIndex: 0 }}
          aria-hidden="true"
        />
      )}
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}
