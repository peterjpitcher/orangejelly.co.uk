import { generateStaticMetadata } from '@/lib/metadata';
import ServicesPage from './ServicesPage';

export async function generateMetadata() {
  return generateStaticMetadata({
    title: 'Hospitality Growth Services for Pubs & Venues',
    description:
      'Action-first growth services for hospitality partners: event innovation, marketing systems, simplified tools, and clarity that unlocks momentum.',
    path: '/services',
    keywords:
      'hospitality growth services, event innovation hospitality, transformational marketing hospitality, simplified technology tools hospitality, action-first marketing support',
    ogImage: '/images/og-default.jpg',
    ogType: 'website',
  });
}

export default function Services() {
  return <ServicesPage />;
}
