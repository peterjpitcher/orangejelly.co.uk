import { generateMetadata } from '@/lib/metadata';
import PubMarketingLocationLandingPage from '@/components/PubMarketingLocationLandingPage';
import oxfordshireData from '../../../content/data/pub-marketing-oxfordshire.json';

export const metadata = generateMetadata({
  title: 'Pub Marketing Oxfordshire - More Covers, Less Stress',
  description:
    'Marketing support for Oxfordshire pubs: simple systems for local visibility, repeat trade, and events that fill your pub without adding workload. £75/hr + VAT.',
  path: '/pub-marketing-oxfordshire',
  keywords:
    'pub marketing oxfordshire, pub marketing consultant oxfordshire, marketing for pubs oxfordshire, oxfordshire pub marketing support, increase pub footfall oxfordshire',
  ogType: 'website',
});

export default function PubMarketingOxfordshirePage() {
  return (
    <PubMarketingLocationLandingPage
      data={oxfordshireData}
      breadcrumbLabel="Pub Marketing Oxfordshire"
    />
  );
}
