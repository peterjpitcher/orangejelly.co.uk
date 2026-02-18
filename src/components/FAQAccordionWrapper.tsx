'use client';

import * as React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Text from '@/components/Text';

interface FAQItem {
  question: string;
  answer: string | React.ReactNode;
  icon?: string;
}

interface FAQAccordionWrapperProps {
  items: FAQItem[];
  className?: string;
  defaultOpenIndex?: number;
}

export default function FAQAccordionWrapper({
  items,
  className = '',
  defaultOpenIndex = -1,
}: FAQAccordionWrapperProps) {
  // No items open by default (defaultOpenIndex = -1)
  const defaultValue =
    defaultOpenIndex >= 0 && defaultOpenIndex < items.length
      ? `item-${defaultOpenIndex}`
      : undefined;

  return (
    <Accordion
      type="single"
      collapsible
      className={`w-full space-y-2 ${className}`}
      defaultValue={defaultValue}
    >
      {items.map((item, index) => (
        <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg">
          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50 rounded-t-lg">
            <span className="text-left font-medium text-base">
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.question}
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4">
            <div className="text-charcoal/80 pt-2">
              {typeof item.answer === 'string' ? <Text>{item.answer}</Text> : item.answer}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
