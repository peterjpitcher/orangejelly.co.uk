import { generateMetadata } from '@/lib/metadata';
import PubMarketingLocationLandingPage from '@/components/PubMarketingLocationLandingPage';
import oxfordshireData from '../../../content/data/pub-marketing-oxfordshire.json';

export const metadata = generateMetadata({
  title: 'Pub Marketing Oxfordshire - Consultant for Oxfordshire Pubs',
  description:
    'Pub marketing for Oxfordshire pubs: get found locally, build repeatable events, and drive footfall with simple systems. Practical help at £75/hour + VAT.',
  path: '/pub-marketing-oxfordshire',
  keywords:
    'pub marketing oxfordshire, pub marketing consultant oxfordshire, marketing for pubs oxfordshire, oxfordshire pub marketing agency, increase pub footfall oxfordshire',
  ogType: 'website',
});

export default function PubMarketingOxfordshirePage() {
  return (
    <PubMarketingLocationLandingPage
      data={oxfordshireData}
      breadcrumbLabel="Pub Marketing Oxfordshire"
    />
  );
}
