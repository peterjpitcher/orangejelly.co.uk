import { generateMetadata } from '@/lib/metadata';
import PubMarketingLocationLandingPage from '@/components/PubMarketingLocationLandingPage';
import hampshireData from '../../../content/data/pub-marketing-hampshire.json';

export const metadata = generateMetadata({
  title: 'Pub Marketing Hampshire - Consultant for Hampshire Pubs',
  description:
    'Pub marketing for Hampshire pubs: get found locally, build repeatable events, and drive footfall with simple systems. Practical help at £75/hour + VAT.',
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
