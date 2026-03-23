import { generateMetadata } from '@/lib/metadata';
import PubServiceLandingPage from '@/components/PubServiceLandingPage';
import StickyCTA from '@/components/StickyCTA';
import fixMyPubData from '../../../content/data/services/fix-my-pub.json';

export const metadata = generateMetadata({
  title: 'Fix My Pub — Emergency Turnaround Help From a Working Licensee',
  description:
    "Pub in crisis or just struggling? I run one myself. Tell me what's wrong and I'll show you the fastest fix — rescue plan, templates, and hands-on support. £75/hr + VAT.",
  path: '/fix-my-pub',
  ogType: 'website',
});

export default function FixMyPubPage() {
  return (
    <>
      <PubServiceLandingPage
        data={fixMyPubData}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Fix My Pub' }]}
      />
      <StickyCTA />
    </>
  );
}
