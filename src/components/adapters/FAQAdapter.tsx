'use client';

import * as React from 'react';
import { FAQAccordion, type FAQItem as ShadcnFAQItem } from '@/components/ui/faq-accordion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Text from '../Text';

// Legacy FAQItem props
interface LegacyFAQItemProps {
  question: string;
  answer: string | React.ReactNode;
  icon?: string;
}

// Single FAQ item adapter - renders accordion style
export default function FAQItemAdapter({ question, answer, icon }: LegacyFAQItemProps) {
  // Each item is a complete accordion for now
  // This provides consistent accordion styling across all pages
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item" className="border rounded-lg">
        <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50 rounded-t-lg text-left">
          <span className="font-medium text-base flex items-start">
            {icon && <span className="mr-2">{icon}</span>}
            {question}
          </span>
        </AccordionTrigger>
        <AccordionContent className="px-6 pb-4">
          <div className="text-charcoal/80 pt-2">
            {typeof answer === 'string' ? <Text>{answer}</Text> : answer}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

// FAQ list adapter for multiple items
interface FAQListAdapterProps {
  items: LegacyFAQItemProps[];
  useAccordion?: boolean;
  defaultOpen?: string | string[];
}

export function FAQListAdapter({ items, useAccordion = false, defaultOpen }: FAQListAdapterProps) {
  // Convert legacy items to shadcn format
  const shadcnItems: ShadcnFAQItem[] = items.map((item, index) => ({
    id: `faq-${index}`,
    question: item.icon ? `${item.icon} ${item.question}` : item.question,
    answer: item.answer,
  }));

  if (useAccordion) {
    return <FAQAccordion items={shadcnItems} defaultOpen={defaultOpen} />;
  }

  // Use card-based layout for non-accordion style
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <FAQItemAdapter key={index} {...item} />
      ))}
    </div>
  );
}
