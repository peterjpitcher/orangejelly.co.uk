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

// Common voice search queries for pubs
export const commonPubQueries = [
  {
    question: 'How can I get more customers in my pub?',
    answer:
      'Orange Jelly helps UK pubs attract more customers through AI-powered marketing, menu optimization, and social media automation. Our proven strategies transformed The Anchor from struggling to thriving.',
  },
  {
    question: 'How much does pub marketing cost?',
    answer:
      'Orange Jelly charges £75 per hour plus VAT for all services. No hidden fees, transparent pricing. You only pay for the time you need. First pub chain training scheduled September 2025.',
  },
  {
    question: "What's the best way to promote my pub?",
    answer:
      'The most effective pub promotion combines compelling social media content, optimised menus that sell high-margin items, and targeted local marketing. Orange Jelly automates these tasks using AI, saving you up to 25 hours weekly.',
  },
  {
    question: 'How do I fill my pub on quiet nights?',
    answer:
      'Orange Jelly specializes in filling quiet nights like Tuesdays. We create targeted promotions, quiz nights, and special events that work. The Anchor went from 20 to 60+ covers on Tuesday nights using our strategies.',
  },
];
