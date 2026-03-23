import { generateMetadata } from '@/lib/metadata';
import PubMarketingLocationLandingPage from '@/components/PubMarketingLocationLandingPage';
import buckinghamshireData from '../../../content/data/pub-marketing-buckinghamshire.json';

export const metadata = generateMetadata({
  title: 'Pub Marketing in Buckinghamshire — Grow Your Trade',
  description:
    'Pub marketing for Buckinghamshire pubs in Aylesbury, High Wycombe, and the Chilterns. Google visibility, events, and social media. £75/hr + VAT.',
  path: '/pub-marketing-buckinghamshire',
  ogType: 'website',
});

export default function PubMarketingBuckinghamshirePage() {
  return (
    <PubMarketingLocationLandingPage
      data={buckinghamshireData}
      breadcrumbLabel="Pub Marketing Buckinghamshire"
      currentSlug="pub-marketing-buckinghamshire"
    />
  );
}
