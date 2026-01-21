import { generateMetadata } from '@/lib/metadata';
import PubMarketingLocationLandingPage from '@/components/PubMarketingLocationLandingPage';
import buckinghamshireData from '../../../content/data/pub-marketing-buckinghamshire.json';

export const metadata = generateMetadata({
  title: 'Pub Marketing Buckinghamshire - Consultant for Buckinghamshire Pubs',
  description:
    'Pub marketing for Buckinghamshire pubs: get found locally, build repeatable events, and drive footfall with simple systems. Practical help at £75/hour + VAT.',
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
