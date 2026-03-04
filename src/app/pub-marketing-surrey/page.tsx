import { generateMetadata } from '@/lib/metadata';
import PubMarketingLocationLandingPage from '@/components/PubMarketingLocationLandingPage';
import surreyData from '../../../content/data/pub-marketing-surrey.json';

export const metadata = generateMetadata({
  title: 'Pub Marketing Surrey - Grow Your Local Trade',
  description:
    'Practical pub marketing for Surrey venues: local SEO, community events, and social media systems that drive footfall from nearby residents. £75/hr + VAT.',
  path: '/pub-marketing-surrey',
  keywords:
    'pub marketing surrey, pub marketing consultant surrey, marketing for pubs surrey, surrey pub marketing support, increase pub footfall surrey',
  ogType: 'website',
});

export default function PubMarketingSurreyPage() {
  return (
    <PubMarketingLocationLandingPage data={surreyData} breadcrumbLabel="Pub Marketing Surrey" />
  );
}
