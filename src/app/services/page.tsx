import { generateStaticMetadata } from '@/lib/metadata';
import ServicesPage from './ServicesPage';

export async function generateMetadata() {
  return generateStaticMetadata({
    title: 'Pub Marketing Services - Practical Help From \u00A375/hr',
    description:
      'Pub marketing services: social media, events, menu engineering, and local SEO. Tested at The Anchor, delivered for your pub. \u00A375/hr + VAT, no retainer.',
    path: '/services',
    ogImage: '/images/og-default.jpg',
    ogType: 'website',
  });
}

export default function Services() {
  return <ServicesPage />;
}
