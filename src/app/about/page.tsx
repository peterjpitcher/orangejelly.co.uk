import { generateStaticMetadata } from '@/lib/metadata';
import AboutPage from './AboutPage';

export async function generateMetadata() {
  return generateStaticMetadata({
    title: 'About Orange Jelly - Hospitality Marketing Specialist',
    description:
      'Meet Peter Pitcher, a hospitality marketing specialist who leverages AI to deliver great results for pubs, restaurants, and bars. Real experience from The Anchor, where Billy runs day-to-day and Peter handles marketing.',
    path: '/about',
    keywords: [
      'Peter Pitcher',
      'Orange Jelly',
      'hospitality marketing specialist',
      'pub marketing',
      'restaurant marketing',
      'bar marketing',
      'The Anchor Stanwell Moor',
      'pub marketing consultant',
      'licensee helping licensees',
    ].join(', '),
    ogImage: '/images/og-default.jpg',
    ogType: 'website',
  });
}

// Simple component with local data
function AboutPageData() {
  // FAQs are loaded from the about.json file
  const faqs = undefined; // Let AboutPage load from about.json

  // Generate comprehensive schema for About page
  const aboutSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
        name: 'About Orange Jelly - Hospitality Marketing Specialist',
        description:
          'Learn about Peter Pitcher and Billy Summers. Billy runs The Anchor pub day-to-day while Peter handles marketing and business development, helping pubs, restaurants, and bars reclaim up to 25 hours each week with AI tools.',
        url: 'https://www.orangejelly.co.uk/about',
        mainEntity: {
          '@id': 'https://www.orangejelly.co.uk/#organization',
        },
      },
      {
        '@type': 'Person',
        '@id': 'https://www.orangejelly.co.uk/#peter-pitcher',
        name: 'Peter Pitcher',
        jobTitle: 'Founder & Hospitality Marketing Specialist',
        description:
          'Pub owner and hospitality marketing specialist who discovered how AI can save up to 25 hours a week on boring admin tasks. Co-owner of The Anchor in Stanwell Moor, where Billy runs day-to-day and Peter handles marketing.',
        spouse: {
          '@type': 'Person',
          name: 'Billy Summers',
          jobTitle: 'Operations Manager at The Anchor',
        },
        worksFor: [
          {
            '@id': 'https://www.orangejelly.co.uk/#organization',
          },
          {
            '@type': 'Restaurant',
            name: 'The Anchor',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Horton Road',
              addressLocality: 'Stanwell Moor',
              addressRegion: 'Surrey',
              postalCode: 'TW19 6AQ',
              addressCountry: 'GB',
            },
          },
        ],
        knowsAbout: [
          'AI Tools',
          'Pub Management',
          'Marketing Automation',
          'Hospitality',
          'Small Business',
        ],
        alumniOf: {
          '@type': 'EducationalOrganization',
          name: 'School of Life - Running a Pub',
        },
      },
      {
        '@type': 'Organization',
        '@id': 'https://www.orangejelly.co.uk/#organization',
        name: 'Orange Jelly Limited',
        alternateName: 'Orange Jelly',
        url: 'https://www.orangejelly.co.uk',
        logo: 'https://www.orangejelly.co.uk/logo.png',
        founder: {
          '@id': 'https://www.orangejelly.co.uk/#peter-pitcher',
        },
        foundingDate: '2019',
        description:
          'AI-powered hospitality marketing for UK pubs, restaurants, and bars from real operators who understand the challenges.',
        areaServed: {
          '@type': 'Country',
          name: 'United Kingdom',
        },
        knowsAbout: [
          'Pub Marketing',
          'Restaurant Marketing',
          'Bar Marketing',
          'AI Tools',
          'Social Media Automation',
          'Menu Design',
          'Customer Retention',
        ],
        slogan: 'Hospitality marketing that delivers great results with AI',
        priceRange: '££',
        award: [
          'Featured in BII Autumn 2025 magazine for AI innovation',
          'Transformed The Anchor from struggling to thriving',
        ],
      },
    ],
  };

  return (
    <>
      <AboutPage faqs={faqs} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
    </>
  );
}

export default function About() {
  return <AboutPageData />;
}
