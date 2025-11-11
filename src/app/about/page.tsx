import { generateStaticMetadata } from '@/lib/metadata';
import AboutPage from './AboutPage';

export async function generateMetadata() {
  return generateStaticMetadata({
    title: 'About Orange Jelly - From One licensee to Another',
    description:
      'Who is Peter Pitcher? How can AI help my pub? Meet the pub owner behind Orange Jelly who helps UK licensees save 5+ hours weekly with practical AI tools. Real experience from running The Anchor pub.',
    path: '/about',
    keywords: [
      'Peter Pitcher',
      'Orange Jelly',
      'pub AI tools',
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
        name: 'About Orange Jelly - From One licensee to Another',
        description:
          'Learn about Peter Pitcher and Billy Summers, who run The Anchor pub and help other licensees save time with AI tools.',
        url: 'https://www.orangejelly.co.uk/about',
        mainEntity: {
          '@id': 'https://www.orangejelly.co.uk/#organization',
        },
      },
      {
        '@type': 'Person',
        '@id': 'https://www.orangejelly.co.uk/#peter-pitcher',
        name: 'Peter Pitcher',
        jobTitle: 'Founder & AI Consultant',
        description:
          'Pub owner who discovered how AI can Save At Least 5 Hours a Week on boring admin tasks. Co-owner of The Anchor in Stanwell Moor with wife Billy Summers.',
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
          'AI-powered marketing solutions for UK pubs and restaurants from real licensees who understand the challenges.',
        areaServed: {
          '@type': 'Country',
          name: 'United Kingdom',
        },
        knowsAbout: [
          'Pub Marketing',
          'AI Tools',
          'Social Media Automation',
          'Menu Design',
          'Customer Retention',
        ],
        slogan: 'Save At Least 5 Hours a Week with AI',
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
