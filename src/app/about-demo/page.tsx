import { type Metadata } from 'next';
import AboutDemoPage from './AboutDemoPage';
import { BreadcrumbSchema } from '@/components/StructuredData';
// Demo page

export const metadata: Metadata = {
  title: 'About Demo - Shadcn Components | Orange Jelly',
  description:
    'Demo version of the about page using shadcn/ui components showcasing modern UI patterns with Peter Pitcher, hospitality marketing specialist leveraging AI to deliver great results.',
  keywords: [
    'shadcn demo',
    'Peter Pitcher',
    'Orange Jelly',
    'hospitality marketing',
    'The Anchor Stanwell Moor',
  ],
  openGraph: {
    title: 'About Orange Jelly Demo - Modern UI Components',
    description:
      'See how modern UI components can enhance the Orange Jelly website. Peter Pitcher is a hospitality marketing specialist leveraging AI to deliver great results.',
    type: 'website',
    url: 'https://www.orangejelly.co.uk/about-demo',
    images: [
      {
        url: '/images/peter-pitcher.jpg',
        width: 1200,
        height: 630,
        alt: 'Peter Pitcher - Orange Jelly Founder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Orange Jelly Demo - Modern UI',
    description: 'Demo of shadcn/ui components for Orange Jelly website',
  },
  alternates: {
    canonical: 'https://www.orangejelly.co.uk/about-demo',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AboutDemo() {
  const breadcrumbs = [
    { name: 'Home', url: 'https://www.orangejelly.co.uk' },
    { name: 'About Demo', url: 'https://www.orangejelly.co.uk/about-demo' },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <AboutDemoPage />
    </>
  );
}
