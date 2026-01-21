import { generateMetadata } from '@/lib/metadata';
import PubServiceLandingPage from '@/components/PubServiceLandingPage';
import fixMyPubData from '../../../content/data/services/fix-my-pub.json';

export const metadata = generateMetadata({
  title: 'Fix My Pub - Practical Pub Marketing Help',
  description:
    'Fix your pub with practical help from a working licensee: fast diagnosis, a simple plan, and templates that get implemented. £75/hour + VAT.',
  path: '/fix-my-pub',
  keywords:
    'fix my pub, pub marketing help, pub recovery, increase pub footfall, fill empty pub, pub marketing consultant',
  ogType: 'website',
});

export default function FixMyPubPage() {
  return (
    <PubServiceLandingPage
      data={fixMyPubData}
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Fix My Pub' }]}
    />
  );
}
