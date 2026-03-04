import { generateMetadata } from '@/lib/metadata';
import PubMarketingLocationLandingPage from '@/components/PubMarketingLocationLandingPage';
import hertfordshireData from '../../../content/data/pub-marketing-hertfordshire.json';

export const metadata = generateMetadata({
  title: 'Pub Marketing Hertfordshire - Build Repeat Trade',
  description:
    'Marketing help for Hertfordshire pubs: attract new customers, retain regulars, and build a consistent weekly rhythm that keeps tables full. £75/hr + VAT.',
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
