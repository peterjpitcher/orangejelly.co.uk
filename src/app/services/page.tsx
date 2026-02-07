import { generateStaticMetadata } from '@/lib/metadata';
import ServicesPage from './ServicesPage';

export async function generateMetadata() {
  return generateStaticMetadata({
    title: 'Hospitality Growth Services - Events, Marketing, Tools & Clarity',
    description:
      'Transformative, action-first growth services for hospitality partners: event innovation, transformational marketing, simplified tools, and clarity that unlocks momentum.',
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
