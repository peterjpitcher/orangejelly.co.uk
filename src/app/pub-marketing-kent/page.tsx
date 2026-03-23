import { generateMetadata } from '@/lib/metadata';
import PubMarketingLocationLandingPage from '@/components/PubMarketingLocationLandingPage';
import kentData from '../../../content/data/pub-marketing-kent.json';

export const metadata = generateMetadata({
  title: 'Pub Marketing in Kent — Drive Local Footfall',
  description:
    'Pub marketing consultant for Kent pubs in Canterbury, Maidstone, Tunbridge Wells, and across the county. Proven systems from a licensee. £75/hr + VAT.',
  path: '/pub-marketing-kent',
  ogType: 'website',
});

export default function PubMarketingKentPage() {
  return (
    <PubMarketingLocationLandingPage
      data={kentData}
      breadcrumbLabel="Pub Marketing Kent"
      currentSlug="pub-marketing-kent"
    />
  );
}
