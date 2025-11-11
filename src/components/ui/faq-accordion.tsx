'use client';

import * as React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion';
import { cn } from '@/lib/utils';
import Heading from '@/components/Heading';

export interface FAQItem {
  id: string;
  question: string;
  answer: string | React.ReactNode;
  category?: string;
}

export interface FAQAccordionProps {
  items: FAQItem[];
  className?: string;
  defaultOpen?: string | string[];
  // SEO props
  itemScope?: boolean;
  itemType?: string;
  // Schema.org FAQ props
  schemaProps?: {
    '@context'?: string;
    '@type'?: string;
    name?: string;
    description?: string;
  };
}

export function FAQAccordion({
  items,
  className,
  defaultOpen,
  itemScope = true,
  itemType = 'https://schema.org/FAQPage',
  schemaProps,
}: FAQAccordionProps) {
  // Generate FAQ schema markup
  const schemaMarkup = React.useMemo(() => {
    if (!schemaProps && !itemScope) return null;

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      ...schemaProps,
      mainEntity: items.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: typeof item.answer === 'string' ? item.answer : '',
        },
      })),
    };

    return JSON.stringify(faqSchema);
  }, [items, schemaProps, itemScope]);

  const isMultiple = Array.isArray(defaultOpen);
  const defaultValue = isMultiple
    ? defaultOpen
    : typeof defaultOpen === 'string'
      ? defaultOpen
      : undefined;
  const accordionProps = isMultiple
    ? { type: 'multiple' as const, defaultValue: defaultValue as string[] | undefined }
    : { type: 'single' as const, defaultValue: defaultValue as string | undefined };

  return (
    <>
      {schemaMarkup && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaMarkup }} />
      )}
      <Accordion
        {...accordionProps}
        className={cn('w-full', className)}
        itemScope={itemScope}
        itemType={itemType}
      >
        {items.map((item) => (
          <FAQItem key={item.id} item={item} />
        ))}
      </Accordion>
    </>
  );
}

interface FAQItemProps {
  item: FAQItem;
}

function FAQItem({ item }: FAQItemProps) {
  return (
    <AccordionItem
      value={item.id}
      itemScope
      itemProp="mainEntity"
      itemType="https://schema.org/Question"
    >
      <AccordionTrigger className="text-left" itemProp="name">
        {item.question}
      </AccordionTrigger>
      <AccordionContent itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
        <div itemProp="text">{item.answer}</div>
      </AccordionContent>
    </AccordionItem>
  );
}

// Categorized FAQ component
export interface CategorizedFAQProps {
  categories: {
    name: string;
    items: FAQItem[];
  }[];
  className?: string;
  defaultOpenItems?: string[];
}

export function CategorizedFAQ({
  categories,
  className,
  defaultOpenItems = [],
}: CategorizedFAQProps) {
  const allItems = categories.flatMap((cat) => cat.items);

  const schemaMarkup = React.useMemo(() => {
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: allItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: typeof item.answer === 'string' ? item.answer : '',
        },
      })),
    };

    return JSON.stringify(faqSchema);
  }, [allItems]);

  return (
    <>
      {schemaMarkup && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaMarkup }} />
      )}
      <div className={cn('space-y-8', className)}>
        {categories.map((category) => (
          <div key={category.name} className="space-y-4">
            <Heading level={3} className="text-lg font-semibold">
              {category.name}
            </Heading>
            <FAQAccordion
              items={category.items}
              defaultOpen={defaultOpenItems.filter((id) =>
                category.items.some((item) => item.id === id)
              )}
            />
          </div>
        ))}
      </div>
    </>
  );
}

// Simple FAQ list (no accordion)
export interface FAQListProps {
  items: FAQItem[];
  className?: string;
  showSchema?: boolean;
}

export function FAQList({ items, className, showSchema = true }: FAQListProps) {
  const schemaMarkup = React.useMemo(() => {
    if (!showSchema) return null;

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: items.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: typeof item.answer === 'string' ? item.answer : '',
        },
      })),
    };

    return JSON.stringify(faqSchema);
  }, [items, showSchema]);

  return (
    <>
      {schemaMarkup && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaMarkup }} />
      )}
      <dl className={cn('space-y-6', className)} itemScope itemType="https://schema.org/FAQPage">
        {items.map((item) => (
          <div key={item.id} itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
            <dt className="font-semibold" itemProp="name">
              {item.question}
            </dt>
            <dd
              className="mt-2 text-muted-foreground"
              itemScope
              itemProp="acceptedAnswer"
              itemType="https://schema.org/Answer"
            >
              <div itemProp="text">{item.answer}</div>
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
}
