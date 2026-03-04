import { generateMetadata } from '@/lib/metadata';
import PubMarketingLocationLandingPage from '@/components/PubMarketingLocationLandingPage';
import berkshireData from '../../../content/data/pub-marketing-berkshire.json';

export const metadata = generateMetadata({
  title: 'Pub Marketing Berkshire - Fill Tables Consistently',
  description:
    'Marketing support for Berkshire pubs: build a loyal local following, run profitable events, and improve midweek trade with proven systems. £75/hr + VAT.',
  path: '/pub-marketing-berkshire',
  keywords:
    'pub marketing berkshire, pub marketing consultant berkshire, marketing for pubs berkshire, berkshire pub marketing support, increase pub footfall berkshire',
  ogType: 'website',
});

export default function PubMarketingBerkshirePage() {
  return (
    <PubMarketingLocationLandingPage
      data={berkshireData}
      breadcrumbLabel="Pub Marketing Berkshire"
    />
  );
}
