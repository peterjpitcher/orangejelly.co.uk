import { generateStaticMetadata } from '@/lib/metadata';
import ServicesPage from './ServicesPage';

export async function generateMetadata() {
  return generateStaticMetadata({
    title: 'Pub Marketing Services - Practical Help From £375 + VAT',
    description:
      'Pub marketing services: social media, events, menu engineering, and local SEO. Tested at The Anchor, delivered for your pub. Packages from £375 + VAT.',
    path: '/services',
    ogImage: '/images/og-default.jpg',
    ogType: 'website',
  });
}

export default function Services() {
  return <ServicesPage />;
}
