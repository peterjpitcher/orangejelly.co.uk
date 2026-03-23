import { generateMetadata } from '@/lib/metadata';
import PubMarketingLocationLandingPage from '@/components/PubMarketingLocationLandingPage';
import surreyData from '../../../content/data/pub-marketing-surrey.json';

export const metadata = generateMetadata({
  title: 'Pub Marketing in Surrey — Local Expertise, Real Results',
  description:
    'Pub marketing in Surrey from a local licensee. Social media, events, and local SEO proven at The Anchor, Stanwell Moor. £75/hr + VAT.',
  path: '/pub-marketing-surrey',
  ogType: 'website',
});

export default function PubMarketingSurreyPage() {
  return (
    <PubMarketingLocationLandingPage
      data={surreyData}
      breadcrumbLabel="Pub Marketing Surrey"
      currentSlug="pub-marketing-surrey"
    />
  );
}
