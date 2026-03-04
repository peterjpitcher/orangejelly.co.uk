import { generateMetadata } from '@/lib/metadata';
import PubMarketingLocationLandingPage from '@/components/PubMarketingLocationLandingPage';
import buckinghamshireData from '../../../content/data/pub-marketing-buckinghamshire.json';

export const metadata = generateMetadata({
  title: 'Pub Marketing Buckinghamshire - Boost Your Pub',
  description:
    'Hands-on marketing for Buckinghamshire pubs: Google visibility, weekly social content, and event ideas that turn quiet nights into full ones. £75/hr + VAT.',
  path: '/pub-marketing-buckinghamshire',
  keywords:
    'pub marketing buckinghamshire, pub marketing bucks, pub marketing consultant buckinghamshire, marketing for pubs buckinghamshire, increase pub footfall buckinghamshire',
  ogType: 'website',
});

export default function PubMarketingBuckinghamshirePage() {
  return (
    <PubMarketingLocationLandingPage
      data={buckinghamshireData}
      breadcrumbLabel="Pub Marketing Buckinghamshire"
    />
  );
}
