import { generateMetadata } from '@/lib/metadata';
import PubMarketingLocationLandingPage from '@/components/PubMarketingLocationLandingPage';
import oxfordshireData from '../../../content/data/pub-marketing-oxfordshire.json';

export const metadata = generateMetadata({
  title: 'Pub Marketing in Oxfordshire — More Covers, Less Stress',
  description:
    'Pub marketing for Oxfordshire pubs in Oxford, Banbury, Witney, and the Cotswolds. Local SEO, events, and social systems from a working publican. Packages from £375 + VAT.',
  path: '/pub-marketing-oxfordshire',
  ogType: 'website',
});

export default function PubMarketingOxfordshirePage() {
  return (
    <PubMarketingLocationLandingPage
      data={oxfordshireData}
      breadcrumbLabel="Pub Marketing Oxfordshire"
      currentSlug="pub-marketing-oxfordshire"
    />
  );
}
