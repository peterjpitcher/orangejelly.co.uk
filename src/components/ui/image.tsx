'use client';

import * as React from 'react';
import NextImage, { type ImageProps as NextImageProps } from 'next/image';
import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';

export interface ImageProps extends Omit<NextImageProps, 'alt'> {
  alt: string; // Make alt required for accessibility
  caption?: string;
  asChild?: boolean;
  // SEO props
  itemProp?: string;
  itemScope?: boolean;
  itemType?: string;
  // Schema.org image object properties
  schemaProps?: {
    '@context'?: string;
    '@type'?: string;
    contentUrl?: string;
    caption?: string;
    creditText?: string;
    copyrightNotice?: string;
    license?: string;
    acquireLicensePage?: string;
    creator?: {
      '@type': string;
      name: string;
    };
  };
}

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      className,
      alt,
      caption,
      asChild = false,
      itemProp,
      itemScope,
      itemType,
      schemaProps,
      sizes,
      quality = 85,
      priority = false,
      placeholder = 'empty',
      loading,
      onLoad,
      style,
      ...props
    },
    ref
  ) => {
    // Check if the image is an SVG first
    const isSvg = typeof props.src === 'string' && props.src.endsWith('.svg');

    // SVGs don't need loading states as they load instantly
    const [isLoading, setIsLoading] = React.useState(!isSvg);
    const [hasError, setHasError] = React.useState(false);

    // For local SVGs, we'll use img tag to avoid Next.js Image optimization issues
    const useImgTag = isSvg;

    // Default sizes for responsive images
    const defaultSizes = sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';

    // SEO-friendly loading attribute
    const loadingAttr = loading || (priority ? 'eager' : 'lazy');

    const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
      setIsLoading(false);
      onLoad?.(e);
    };

    const handleError = () => {
      setIsLoading(false);
      setHasError(true);
    };

    // Generate schema markup if provided
    const schemaMarkup = React.useMemo(() => {
      if (!schemaProps) return null;

      const schema = {
        '@context': 'https://schema.org',
        '@type': 'ImageObject',
        ...schemaProps,
        contentUrl: schemaProps.contentUrl || props.src,
        caption: schemaProps.caption || caption || alt,
      };

      return JSON.stringify(schema);
    }, [schemaProps, props.src, caption, alt]);

    if (hasError) {
      return (
        <div
          className={cn(
            'flex items-center justify-center bg-muted text-muted-foreground',
            className
          )}
          style={style}
          role="img"
          aria-label={alt}
        >
          <span className="text-sm">Image unavailable</span>
        </div>
      );
    }

    const Comp = asChild ? Slot : NextImage;

    // For SVGs (local or external), use a regular img tag instead of Next.js Image
    const imageElement = useImgTag ? (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        ref={ref as React.Ref<HTMLImageElement>}
        src={props.src as string}
        alt={alt}
        loading={loadingAttr}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          !isSvg && 'transition-opacity duration-300',
          !isSvg && isLoading && !priority ? 'opacity-0' : 'opacity-100',
          className
        )}
        style={{
          ...style,
          ...(props.fill && {
            position: 'absolute',
            height: '100%',
            width: '100%',
            inset: 0,
            objectFit: 'cover',
          }),
        }}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        itemProp={itemProp}
        itemScope={itemScope}
        itemType={itemType}
        width={props.width}
        height={props.height}
      />
    ) : (
      <Comp
        ref={ref}
        alt={alt}
        sizes={defaultSizes}
        quality={quality}
        priority={priority}
        placeholder={placeholder}
        loading={loadingAttr}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'transition-opacity duration-300',
          isLoading && !priority && 'opacity-0',
          className
        )}
        style={style}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        itemProp={itemProp}
        itemScope={itemScope}
        itemType={itemType}
        {...props}
      />
    );

    if (caption || schemaMarkup) {
      return (
        <figure className="space-y-2">
          {schemaMarkup && (
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaMarkup }} />
          )}
          {isLoading && !priority && !useImgTag && (
            <div
              className={cn('absolute inset-0 animate-pulse bg-muted', className)}
              aria-hidden="true"
            />
          )}
          {imageElement}
          {caption && (
            <figcaption className="text-sm text-muted-foreground text-center">{caption}</figcaption>
          )}
        </figure>
      );
    }

    return (
      <>
        {schemaMarkup && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaMarkup }} />
        )}
        {isLoading && !priority && !useImgTag && (
          <div
            className={cn('absolute inset-0 animate-pulse bg-muted', className)}
            aria-hidden="true"
          />
        )}
        {imageElement}
      </>
    );
  }
);
Image.displayName = 'Image';

// Aspect ratio wrapper for consistent dimensions
export interface AspectRatioImageProps extends ImageProps {
  aspectRatio?: number;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

export const AspectRatioImage = React.forwardRef<HTMLDivElement, AspectRatioImageProps>(
  ({ aspectRatio = 16 / 9, objectFit = 'cover', className, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('relative overflow-hidden', className)}
        style={{
          paddingBottom: `${(1 / aspectRatio) * 100}%`,
          ...style,
        }}
      >
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <Image {...props} fill className="absolute inset-0" style={{ objectFit }} />
      </div>
    );
  }
);
AspectRatioImage.displayName = 'AspectRatioImage';

// Gallery image with lightbox support
export interface GalleryImageProps extends ImageProps {
  thumbnailSrc?: string;
  onExpand?: () => void;
}

export const GalleryImage = React.forwardRef<HTMLImageElement, GalleryImageProps>(
  ({ thumbnailSrc, onExpand, className, ...props }, ref) => {
    const imageSrc = thumbnailSrc || props.src;
    return (
      <button
        type="button"
        onClick={onExpand}
        className={cn(
          'group relative overflow-hidden rounded-lg',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          className
        )}
        aria-label={`Expand image: ${props.alt}`}
      >
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <Image
          {...props}
          ref={ref}
          src={imageSrc}
          className="transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="rounded-full bg-white/90 p-2">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
              />
            </svg>
          </div>
        </div>
      </button>
    );
  }
);
GalleryImage.displayName = 'GalleryImage';

export { Image };
