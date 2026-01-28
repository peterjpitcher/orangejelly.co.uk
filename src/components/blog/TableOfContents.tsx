'use client';

import { useEffect, useMemo, useState, type MouseEvent } from 'react';
import clsx from 'clsx';

export interface TocHeading {
  id: string;
  title: string;
  level: 2 | 3;
}

interface TableOfContentsProps {
  headings: TocHeading[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  // Filter to show only H2s (level 2) to keep the list concise
  const displayHeadings = useMemo(() => headings.filter((h) => h.level === 2), [headings]);
  const [activeId, setActiveId] = useState<string | null>(displayHeadings[0]?.id ?? null);

  useEffect(() => {
    if (
      displayHeadings.length === 0 ||
      typeof window === 'undefined' ||
      typeof document === 'undefined'
    ) {
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry?.target?.id) {
          setActiveId(visibleEntry.target.id);
        }
      },
      {
        rootMargin: '0px 0px -70% 0px',
        threshold: [0, 0.25, 0.5, 1],
      }
    );

    const headingElements = displayHeadings
      .map((heading) => document.getElementById(heading.id))
      .filter((el): el is HTMLElement => Boolean(el));

    headingElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [displayHeadings]);

  if (displayHeadings.length === 0) {
    return null;
  }

  const handleClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
      target.focus?.();
    }
  };

  const scrollToTop = () => {
    const article = document.getElementById('blog-article');
    article?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav aria-label="Table of contents" className="space-y-4">
      <div>
        <p className="text-xs font-semibold tracking-wide text-charcoal/70 uppercase">
          On this page
        </p>
        <p className="text-sm text-charcoal/70">
          Jump to the sections licensees ask about most and find what you need faster.
        </p>
      </div>
      <ul className="space-y-2 text-sm">
        {displayHeadings.map((heading) => (
          <li
            key={heading.id}
            className={clsx(
              'transition-all',
              heading.level === 3 ? 'pl-4 border-l border-cream' : ''
            )}
          >
            <a
              href={`#${heading.id}`}
              onClick={(event) => handleClick(event, heading.id)}
              className={clsx(
                'inline-flex items-center gap-2 rounded px-2 py-1 text-left leading-snug text-charcoal/80 hover:text-orange focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange',
                activeId === heading.id ? 'bg-cream text-charcoal font-semibold' : ''
              )}
            >
              {heading.level === 3 && <span className="text-xs text-orange">•</span>}
              <span>{heading.title}</span>
            </a>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={scrollToTop}
        className="text-sm font-semibold text-orange hover:text-orange-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
      >
        Back to top ↑
      </button>
    </nav>
  );
}
