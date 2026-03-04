import { generateMetadata } from '@/lib/metadata';
import PubMarketingLocationLandingPage from '@/components/PubMarketingLocationLandingPage';
import kentData from '../../../content/data/pub-marketing-kent.json';

export const metadata = generateMetadata({
  title: 'Pub Marketing Kent - Drive Local Footfall',
  description:
    'Practical marketing for Kent pubs: local search dominance, community engagement, and social media that converts nearby browsers into regulars. £75/hr + VAT.',
  path: '/pub-marketing-kent',
  keywords:
    'pub marketing kent, pub marketing consultant kent, marketing for pubs kent, kent pub marketing support, increase pub footfall kent',
  ogType: 'website',
});

export default function PubMarketingKentPage() {
  return <PubMarketingLocationLandingPage data={kentData} breadcrumbLabel="Pub Marketing Kent" />;
}
