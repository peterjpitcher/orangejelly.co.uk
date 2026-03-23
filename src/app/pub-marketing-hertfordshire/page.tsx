import { generateMetadata } from '@/lib/metadata';
import PubMarketingLocationLandingPage from '@/components/PubMarketingLocationLandingPage';
import hertfordshireData from '../../../content/data/pub-marketing-hertfordshire.json';

export const metadata = generateMetadata({
  title: 'Pub Marketing in Hertfordshire — Build Repeat Trade',
  description:
    'Pub marketing for Hertfordshire pubs in St Albans, Watford, Hertford, and the Home Counties. Local SEO, events, and social media. £75/hr + VAT.',
  path: '/pub-marketing-hertfordshire',
  ogType: 'website',
});

export default function PubMarketingHertfordshirePage() {
  return (
    <PubMarketingLocationLandingPage
      data={hertfordshireData}
      breadcrumbLabel="Pub Marketing Hertfordshire"
      currentSlug="pub-marketing-hertfordshire"
    />
  );
}
