// Voice search optimized content component
// Structures content to answer common voice queries naturally

import Heading from '@/components/Heading';
import Text from '@/components/Text';

interface VoiceSearchContentProps {
  question: string;
  answer: string;
  schema?: boolean;
  className?: string;
}

export default function VoiceSearchContent({
  question,
  answer,
  schema = true,
  className = '',
}: VoiceSearchContentProps) {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Question',
    name: question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: answer,
    },
  };

  return (
    <div className={`voice-search-content ${className}`}>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      )}
      <Heading level={3} className="mb-2">
        {question}
      </Heading>
      <Text color="muted" className="leading-relaxed">
        {answer}
      </Text>
    </div>
  );
}

interface VoiceSearchSectionProps {
  title: string;
  items: Array<{
    question: string;
    answer: string;
  }>;
  className?: string;
}

export function VoiceSearchSection({ title, items, className = '' }: VoiceSearchSectionProps) {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <section className={`voice-search-section ${className}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Heading level={2} align="center" className="mb-6">
        {title}
      </Heading>
      <div className="grid md:grid-cols-2 gap-6">
        {items.map((item, index) => (
          <VoiceSearchContent
            key={index}
            question={item.question}
            answer={item.answer}
            schema={false} // Already included in section schema
          />
        ))}
      </div>
    </section>
  );
}

// Common voice search queries for hospitality operators
export const commonPubQueries = [
  {
    question: 'How can I get more customers in my hospitality venue?',
    answer:
      'Orange Jelly helps hospitality partners attract more customers through action-first marketing, practical systems, and AI-enabled delivery. Our proven strategies created a measurable step-change at The Anchor.',
  },
  {
    question: 'How much does hospitality marketing support cost?',
    answer:
      'Orange Jelly charges £75 per hour plus VAT for all services. No hidden fees, transparent pricing. You only pay for the time you need.',
  },
  {
    question: "What's the best way to promote my venue?",
    answer:
      'The most effective venue promotion combines compelling social content, clear offers, practical events, and local visibility. Orange Jelly uses AI-enabled workflows to increase speed and consistency without adding noise.',
  },
  {
    question: 'How do I fill quiet nights?',
    answer:
      'Orange Jelly specializes in turning quiet nights into repeat demand. We create targeted offers, events, and weekly execution rhythms that work. The Anchor now sees 25-30 regular quiz teams each month using these strategies.',
  },
];
