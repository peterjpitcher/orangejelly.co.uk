import { generateMetadata } from '@/lib/metadata';
import PubMarketingLocationLandingPage from '@/components/PubMarketingLocationLandingPage';
import berkshireData from '../../../content/data/pub-marketing-berkshire.json';

export const metadata = generateMetadata({
  title: 'Pub Marketing Berkshire - Consultant for Berkshire Pubs',
  description:
    'Pub marketing for Berkshire pubs: get found locally, build repeatable events, and drive footfall with simple systems. Practical help at £75/hour + VAT.',
  path: '/pub-marketing-berkshire',
  keywords:
    'pub marketing berkshire, pub marketing consultant berkshire, marketing for pubs berkshire, berkshire pub marketing agency, increase pub footfall berkshire',
  ogType: 'website',
});

export default function PubMarketingBerkshirePage() {
  return (
    <PubMarketingLocationLandingPage
      data={berkshireData}
      breadcrumbLabel="Pub Marketing Berkshire"
    />
  );
}
