import { generateStaticMetadata } from '@/lib/metadata';
import ResultsPage from './ResultsPage';
import { getBaseUrl } from '@/lib/site-config';

export async function generateMetadata() {
  return generateStaticMetadata({
    title: 'Hospitality Marketing Results for Pubs, Bars & Venues',
    description:
      'See hospitality marketing results proven at The Anchor, then adapted for hospitality partners. Real numbers, real strategies, measurable growth.',
    path: '/results',
    keywords:
      'hospitality marketing results, pub success stories, restaurant marketing results, bar marketing results, increase revenue, The Anchor success',
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
        '@id': `${baseUrl}/results#sunday-lunches`,
        name: 'How to Fix Sunday Lunch Chaos with Pre-Order System',
        description:
          'Learn how The Anchor reduced Sunday lunch waste by £250/week using a custom-built pre-order system',
        supply: ['Google Forms or similar', 'Payment processor', 'SMS system'],
        tool: ['Online form builder', 'Automated SMS tool'],
        step: [
          {
            '@type': 'HowToStep',
            name: 'Set up simple pre-order form',
            text: 'Create online form with menu choices and deposit option',
          },
          {
            '@type': 'HowToStep',
            name: 'Implement a small deposit system',
            text: 'A small deposit prevents no-shows without scaring customers',
          },
          {
            '@type': 'HowToStep',
            name: 'Send confirmation texts',
            text: 'Automated SMS confirms booking and reminds day before',
          },
          {
            '@type': 'HowToStep',
            name: 'Lock in menu choices',
            text: 'Pre-orders mean exact prep with no waste',
          },
        ],
        yield: '£250 weekly margin gain, 90% reduction in food waste',
      },
      {
        '@type': 'Article',
        '@id': `${baseUrl}/results#social-media`,
        headline: 'How AI Transformed Our Social Media from Chore to Customer Magnet',
        description:
          'Case study showing how The Anchor plans and schedules 30 days of social content in 2 hours',
        author: {
          '@id': `${baseUrl}/#peter-pitcher`,
        },
        datePublished: '2024-09-15',
        articleBody:
          'From posting once a week to daily visibility that drives bookings. AI creates content that sounds like us, not a robot...',
      },
      {
        '@type': 'Article',
        '@id': `${baseUrl}/results#quiz-night`,
        headline: 'Tuesday Quiz Night: 25-30 Regular Teams Every Month Using AI',
        description:
          'How we ditched expensive quiz subscriptions and created better quizzes with AI in minutes',
        author: {
          '@id': `${baseUrl}/#peter-pitcher`,
        },
        datePublished: '2024-10-01',
        articleBody:
          'QuestionOne was stale and expensive. Now AI creates custom quizzes with local flavor that pack the pub every Tuesday...',
      },
      {
        '@type': 'HowTo',
        '@id': `${baseUrl}/results#quiet-weeks`,
        name: 'Transform Quiet Weeks into Premium Events',
        description: 'How The Anchor created sold-out tasting events with premium pricing',
        step: [
          {
            '@type': 'HowToStep',
            name: 'Ask locals what they want',
            text: 'Use AI to analyse feedback and identify gaps',
          },
          {
            '@type': 'HowToStep',
            name: 'Partner with local suppliers',
            text: 'Gin distilleries and breweries love showcasing products',
          },
          {
            '@type': 'HowToStep',
            name: 'Price for value not volume',
            text: 'Premium pricing with a proper experience beats cheap offers',
          },
          {
            '@type': 'HowToStep',
            name: 'Build WhatsApp community',
            text: 'Direct communication with interested customers',
          },
        ],
        yield: 'Sold-out tasting nights with strong repeat attendance',
      },
      {
        '@type': 'Review',
        itemReviewed: {
          '@type': 'Service',
          name: 'Orange Jelly Pub Consulting',
          provider: {
            '@id': `${baseUrl}/#organization`,
          },
        },
        reviewBody:
          "Peter's AI strategies transformed our pub. Quiz nights now attract 25-30 regular teams each month, Sunday waste is down £250/week, and we actually have evenings off now. Best investment we've made.",
        author: {
          '@type': 'Restaurant',
          name: 'The Anchor',
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5',
        },
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
