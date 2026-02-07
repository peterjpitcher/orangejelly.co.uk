import { generateMetadata } from '@/lib/metadata';
import PubMarketingLocationLandingPage from '@/components/PubMarketingLocationLandingPage';
import londonData from '../../../content/data/pub-marketing-london.json';

export const metadata = generateMetadata({
  title: 'Pub Marketing London - Consultant for London Pubs',
  description:
    'Pub marketing for London pubs: get found locally, build repeatable events, and drive footfall with simple systems. Practical help at £75/hour + VAT.',
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
