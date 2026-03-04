import { generateMetadata } from '@/lib/metadata';
import PubServiceLandingPage from '@/components/PubServiceLandingPage';
import fixMyPubData from '../../../content/data/services/fix-my-pub.json';

export const metadata = generateMetadata({
  title: 'Fix My Pub — Honest Help From a Working Licensee',
  description:
    "Pub struggling? I run one myself. Tell me what's wrong and I'll show you the fastest fix — with a clear plan and templates. £75/hr + VAT, no contract.",
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
