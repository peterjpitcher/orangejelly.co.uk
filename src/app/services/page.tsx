import { generateStaticMetadata } from '@/lib/metadata';
import ServicesPage from './ServicesPage';

export async function generateMetadata() {
  return generateStaticMetadata({
    title: 'Hospitality Marketing Services for Pubs, Restaurants & Bars',
    description:
      'How do I fill empty tables and grow revenue? Orange Jelly delivers hospitality marketing services for pubs, restaurants, and bars with results inside 30 days. £75 per hour plus VAT. AI training and consulting from a real operator.',
    path: '/services',
    keywords:
      'hospitality marketing services, pub marketing, restaurant marketing, bar marketing, AI training, hospitality consultancy UK',
    ogImage: '/images/og-default.jpg',
    ogType: 'website',
  });
}

export default function Services() {
  return <ServicesPage />;
}
