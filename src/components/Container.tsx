import { cn } from '@/lib/utils';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Which of the two inner measures to use, or `full` to fill the shell.
   *
   * This replaced a `maxWidth` prop taking Tailwind sizes (3xl, 4xl, 5xl, 6xl,
   * 7xl). Those were invisible to a class-based sweep, because Container builds
   * the class from the prop at runtime, so 41 call sites kept setting page widths
   * by hand long after the raw utilities had been cleaned out of the markup.
   * Naming the jobs instead of the sizes is what stops that happening again.
   */
  width?: 'measure' | 'measure-wide' | 'full';
  center?: boolean;
  padding?: boolean;
}

/**
 * Constrains a reading measure. It does NOT own the page gutter.
 *
 * `padding` used to default to true, and 57 of the 59 Containers in this codebase
 * sit inside a `<Section>`, which already applies `.page-shell`. Each one was
 * therefore adding a second gutter on top of the first, insetting its contents by
 * another 32px: measured on /ways-to-work at 1920px, the section band started at
 * 416 and everything inside these Containers started at 448.
 *
 * The default maxWidth made it worse by hiding the cause. 7xl is 1280px, wider
 * than the 1088px a shell actually offers, so the Container constrained nothing
 * and its only effect was that stray gutter.
 *
 * Pass `padding` explicitly for the rare standalone use that is not inside a
 * Section. Better still, use the `page-shell` class for that.
 */
export default function Container({
  children,
  className,
  width = 'full',
  center = true,
  padding = false,
}: ContainerProps) {
  // `full` emits nothing: the surrounding shell already sets the width, and adding
  // max-w-full on top of it just restates that in a second place.
  const widthClasses = {
    measure: 'measure',
    'measure-wide': 'measure-wide',
    full: '',
  };

  return (
    <div
      className={cn(
        widthClasses[width],
        // The measures centre themselves, so mx-auto is only needed for `full`.
        center && width === 'full' && 'mx-auto',
        padding && 'px-4 sm:px-6 lg:px-8',
        className
      )}
    >
      {children}
    </div>
  );
}
