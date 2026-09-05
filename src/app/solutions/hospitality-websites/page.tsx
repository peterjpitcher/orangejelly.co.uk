import { ServicePage } from '@/components/oj/ServicePage';
import { generateMetadata } from '@/lib/metadata';

import { CONTENT } from './content';

export const metadata = generateMetadata({
  ogImage: '/opengraph-image',
  title: 'Hospitality Website Design',
  description:
    'Hospitality website design: pubs, restaurants and venues. Clear guest information, booking connections and enquiry journeys built around your venue.',
  path: '/solutions/hospitality-websites',
});

export default function HospitalityWebsitesPage(): JSX.Element {
  return <ServicePage content={CONTENT} />;
}
