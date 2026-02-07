import { generateMetadata } from '@/lib/metadata';
import PubMarketingLocationLandingPage from '@/components/PubMarketingLocationLandingPage';
import hertfordshireData from '../../../content/data/pub-marketing-hertfordshire.json';

export const metadata = generateMetadata({
  title: 'Pub Marketing Hertfordshire - Consultant for Hertfordshire Pubs',
  description:
    'Pub marketing for Hertfordshire pubs: get found locally, build repeatable events, and drive footfall with simple systems. Practical help at £75/hour + VAT.',
  path: '/pub-marketing-hertfordshire',
  keywords:
    'pub marketing hertfordshire, pub marketing consultant hertfordshire, marketing for pubs hertfordshire, hertfordshire pub marketing support, increase pub footfall hertfordshire',
  ogType: 'website',
});

export default function PubMarketingHertfordshirePage() {
  return (
    <PubMarketingLocationLandingPage
      data={hertfordshireData}
      breadcrumbLabel="Pub Marketing Hertfordshire"
    />
  );
}
