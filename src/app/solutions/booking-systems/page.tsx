import { ServicePage } from '@/components/oj/ServicePage';
import { generateMetadata } from '@/lib/metadata';

import { CONTENT } from './content';

export const metadata = generateMetadata({
  ogImage: '/opengraph-image',
  title: 'Online and Table Booking Systems',
  description:
    'Online booking and table reservation systems for restaurants, pubs and venues. Connect the booking software you already have, or build the missing part.',
  path: '/solutions/booking-systems',
});

export default function BookingSystemsPage(): JSX.Element {
  return <ServicePage content={CONTENT} />;
}
