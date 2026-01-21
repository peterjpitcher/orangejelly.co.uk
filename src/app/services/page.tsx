import { generateStaticMetadata } from '@/lib/metadata';
import ServicesPage from './ServicesPage';

export async function generateMetadata() {
  return generateStaticMetadata({
    title: 'Pub Marketing Services - Instagram, Facebook, Ads & Content',
    description:
      'Pub marketing services from a working licensee: Instagram, Facebook, paid social ads, and content creation that drive footfall. £75 per hour plus VAT.',
    path: '/services',
    keywords:
      'pub marketing services, instagram services for pubs, facebook services for pubs, paid social for pubs, content creation for pubs, social media marketing for pubs',
    ogImage: '/images/og-default.jpg',
    ogType: 'website',
  });
}

export default function Services() {
  return <ServicesPage />;
}
