import { generateMetadata } from '@/lib/metadata';
import PubMarketingLocationLandingPage from '@/components/PubMarketingLocationLandingPage';
import londonData from '../../../content/data/pub-marketing-london.json';

export const metadata = generateMetadata({
  title: 'Pub Marketing London - Stand Out in a Crowded City',
  description:
    'Cut through London competition with local pub marketing that builds regulars. Events, social media, and Google visibility tailored for city pubs. £75/hr + VAT.',
  path: '/pub-marketing-london',
  keywords:
    'pub marketing london, pub marketing consultant london, marketing for pubs london, london pub marketing support, increase pub footfall london',
  ogType: 'website',
});

export default function PubMarketingLondonPage() {
  return (
    <PubMarketingLocationLandingPage data={londonData} breadcrumbLabel="Pub Marketing London" />
  );
}
