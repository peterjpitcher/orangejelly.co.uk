import { generateMetadata } from '@/lib/metadata';
import PubMarketingLocationLandingPage from '@/components/PubMarketingLocationLandingPage';
import kentData from '../../../content/data/pub-marketing-kent.json';

export const metadata = generateMetadata({
  title: 'Pub Marketing Kent - Consultant for Kent Pubs',
  description:
    'Pub marketing for Kent pubs: get found locally, build repeatable events, and drive footfall with simple systems. Practical help at £75/hour + VAT.',
  path: '/pub-marketing-kent',
  keywords:
    'pub marketing kent, pub marketing consultant kent, marketing for pubs kent, kent pub marketing support, increase pub footfall kent',
  ogType: 'website',
});

export default function PubMarketingKentPage() {
  return <PubMarketingLocationLandingPage data={kentData} breadcrumbLabel="Pub Marketing Kent" />;
}
