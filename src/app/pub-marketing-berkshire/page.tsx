import { generateMetadata } from '@/lib/metadata';
import PubMarketingLocationLandingPage from '@/components/PubMarketingLocationLandingPage';
import berkshireData from '../../../content/data/pub-marketing-berkshire.json';

export const metadata = generateMetadata({
  title: 'Pub Marketing for Berkshire Pubs — Proven Systems',
  description:
    'Pub marketing consultant for Berkshire pubs in Reading, Windsor, Maidenhead, and beyond. Events, social media, and local SEO. Packages from £375 + VAT.',
  path: '/pub-marketing-berkshire',
  ogType: 'website',
});

export default function PubMarketingBerkshirePage() {
  return (
    <PubMarketingLocationLandingPage
      data={berkshireData}
      breadcrumbLabel="Pub Marketing Berkshire"
      currentSlug="pub-marketing-berkshire"
    />
  );
}
