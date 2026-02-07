import { generateStaticMetadata } from '@/lib/metadata';
import AboutPage from './AboutPage';

export async function generateMetadata() {
  return generateStaticMetadata({
    title: 'About Orange Jelly - Small Team, Transformative Growth Partner',
    description:
      'Meet Peter Pitcher, founder of Orange Jelly and co-owner of The Anchor. We are a small, hands-on team helping hospitality partners grow through tough trading conditions.',
    path: '/about',
    keywords: [
      'Peter Pitcher',
      'Orange Jelly',
      'hospitality growth partner',
      'pub marketing',
      'bar marketing',
      'The Anchor Stanwell Moor',
      'hospitality marketing consultant',
      'hospitality growth partner',
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
        name: 'About Orange Jelly - Transformative Hospitality Growth Partner',
        description:
          'Learn about Peter Pitcher and Billy Summers. Billy runs The Anchor day-to-day while Peter leads marketing and growth, helping hospitality partners create measurable uplift in bookings, footfall, and revenue.',
        url: 'https://www.orangejelly.co.uk/about',
        mainEntity: {
          '@id': 'https://www.orangejelly.co.uk/#organization',
        },
      },
      {
        '@type': 'Person',
        '@id': 'https://www.orangejelly.co.uk/#peter-pitcher',
        name: 'Peter Pitcher',
        jobTitle: 'Founder & Hospitality Growth Partner',
        description:
          'Hospitality growth partner focused on transformative, action-first marketing. Co-owner of The Anchor in Stanwell Moor, where Billy runs day-to-day and Peter handles marketing.',
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
          'Transformative hospitality marketing for UK hospitality businesses from a small, hands-on team that understands trading pressure.',
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
        slogan: 'Small team. Big momentum. Transformative marketing for hospitality partners.',
        priceRange: '££',
        award: [
          'Featured in BII magazine for AI innovation',
          'Created a measurable performance step-change at The Anchor',
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
