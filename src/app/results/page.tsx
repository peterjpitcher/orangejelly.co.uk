import { generateStaticMetadata } from '@/lib/metadata';
import ResultsPage from './ResultsPage';
import { getBaseUrl } from '@/lib/site-config';

export async function generateMetadata() {
  return generateStaticMetadata({
    title: 'Pub Marketing Results - Proven at The Anchor',
    description:
      'Pub marketing results from The Anchor: Google Search visibility +828%, table bookings +403%, food revenue +98%. See what works.',
    path: '/results',
    ogImage: '/images/og-default.jpg',
    ogType: 'website',
  });
}

export default function Results() {
  // Use local data

  // Generate comprehensive schema for Results
  const baseUrl = getBaseUrl();
  const resultsSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'HowTo',
        '@id': `${baseUrl}/results#no-shows`,
        name: 'How to Cut Booking No-Shows with a Deposit System',
        description:
          'How The Anchor cut booking no-shows by 89% using a simple online booking, deposit, and reminder system',
        supply: ['Online booking form', 'Payment processor', 'SMS system'],
        tool: ['Online form builder', 'Automated SMS tool'],
        step: [
          {
            '@type': 'HowToStep',
            name: 'Set up an easy online booking flow',
            text: 'Create a simple booking form with a small deposit option',
          },
          {
            '@type': 'HowToStep',
            name: 'Take a small deposit',
            text: 'A small deposit creates commitment without scaring guests off',
          },
          {
            '@type': 'HowToStep',
            name: 'Send automated reminders',
            text: 'Automated SMS confirms the booking and reminds guests the day before',
          },
          {
            '@type': 'HowToStep',
            name: 'Link bookings to kitchen prep',
            text: 'Confirmed bookings mean accurate prep and reliable covers',
          },
        ],
        yield: 'Booking no-shows cut by 89%',
      },
      {
        '@type': 'Article',
        '@id': `${baseUrl}/results#search-visibility`,
        headline: 'How an AI-Optimised Website Grew Our Google Search Visibility by 828%',
        description:
          'Case study showing how The Anchor launched a search-led website that grew Google Search visibility by 828%',
        author: {
          '@id': `${baseUrl}/#peter-pitcher`,
        },
        datePublished: '2025-08-15',
        articleBody:
          'We launched the-anchor.pub as an AI-optimised, search-led website in August 2025. Built around what locals actually search for, Google Search visibility grew 828% — and the people finding us are booking tables...',
      },
      {
        '@type': 'Article',
        '@id': `${baseUrl}/results#table-bookings`,
        headline: 'How We Grew Table Bookings by 403% at The Anchor',
        description:
          'How AI-planned events, a clear reason to book, and an easy booking journey grew table bookings by 403%',
        author: {
          '@id': `${baseUrl}/#peter-pitcher`,
        },
        datePublished: '2025-10-01',
        articleBody:
          'Quiet sessions used to barely cover the staff. With AI-planned events, a clear reason to book, and an easy direct booking journey, table bookings grew 403% and the quiet nights started to pay...',
      },
      {
        '@type': 'HowTo',
        '@id': `${baseUrl}/results#private-hire`,
        name: 'How to Grow Private Hire Bookings by 567%',
        description:
          'How The Anchor grew private hire bookings by 567% with a clear offer and an easy enquiry-to-booking journey',
        step: [
          {
            '@type': 'HowToStep',
            name: 'Build a clear, premium offer',
            text: 'Give the space a reason to be booked with curated, premium experiences',
          },
          {
            '@type': 'HowToStep',
            name: 'Make the space easy to find',
            text: 'Show up for local searches like private hire nearby',
          },
          {
            '@type': 'HowToStep',
            name: 'Convert enquiries quickly',
            text: 'A smooth enquiry-to-booking journey turns interest into confirmed dates',
          },
          {
            '@type': 'HowToStep',
            name: 'Price for the experience',
            text: 'Partner with quality local suppliers and price with confidence',
          },
        ],
        yield: 'Private hire bookings up 567%',
      },
      {
        '@type': 'Article',
        '@id': `${baseUrl}/results#food-revenue`,
        headline: 'How We Grew Food Revenue by 98% in Three Months',
        description:
          'How menu engineering, strategic pricing, and a high-margin hero product grew food revenue by 98%',
        author: {
          '@id': `${baseUrl}/#peter-pitcher`,
        },
        datePublished: '2025-09-15',
        articleBody:
          'Food sales had gone flat. With AI-led menu engineering, sensory descriptions, strategic pricing, and a stone-baked pizza hero product, food revenue grew 98% in three months...',
      },
    ],
  };

  return (
    <>
      <ResultsPage />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(resultsSchema) }}
      />
    </>
  );
}
