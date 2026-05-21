import { generateMetadata } from '@/lib/metadata';
import PubMarketingLocationLandingPage from '@/components/PubMarketingLocationLandingPage';
import surreyData from '../../../content/data/pub-marketing-surrey.json';

export const metadata = generateMetadata({
  title: 'Pub Marketing for Surrey Pubs — Practical, Proven Help',
  description:
    'Pub marketing for Surrey pubs from a working licensee near Heathrow. Social media, events and local SEO, proven at our own pub. Packages from £375 + VAT.',
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
