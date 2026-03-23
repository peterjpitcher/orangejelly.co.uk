import { generateMetadata } from '@/lib/metadata';
import PubMarketingLocationLandingPage from '@/components/PubMarketingLocationLandingPage';
import hampshireData from '../../../content/data/pub-marketing-hampshire.json';

export const metadata = generateMetadata({
  title: 'Pub Marketing in Hampshire — Results-Driven Help',
  description:
    'Local pub marketing consultant for Hampshire pubs in Winchester, Southampton, Portsmouth, and beyond. Proven systems from a working publican. £75/hr + VAT.',
  path: '/pub-marketing-hampshire',
  ogType: 'website',
});

export default function PubMarketingHampshirePage() {
  return (
    <PubMarketingLocationLandingPage
      data={hampshireData}
      breadcrumbLabel="Pub Marketing Hampshire"
      currentSlug="pub-marketing-hampshire"
    />
  );
}
