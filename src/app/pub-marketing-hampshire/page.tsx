import { generateMetadata } from '@/lib/metadata';
import PubMarketingLocationLandingPage from '@/components/PubMarketingLocationLandingPage';
import hampshireData from '../../../content/data/pub-marketing-hampshire.json';

export const metadata = generateMetadata({
  title: 'Pub Marketing Hampshire - Grow Bookings & Trade',
  description:
    'Grow your Hampshire pub with targeted marketing: seasonal events, local partnerships, and social content that brings people through the door. £75/hr + VAT.',
  path: '/pub-marketing-hampshire',
  keywords:
    'pub marketing hampshire, pub marketing consultant hampshire, marketing for pubs hampshire, hampshire pub marketing support, increase pub footfall hampshire',
  ogType: 'website',
});

export default function PubMarketingHampshirePage() {
  return (
    <PubMarketingLocationLandingPage
      data={hampshireData}
      breadcrumbLabel="Pub Marketing Hampshire"
    />
  );
}
