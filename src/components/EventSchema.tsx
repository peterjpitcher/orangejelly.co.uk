interface EventSchemaProps {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: {
    name: string;
    address: {
      streetAddress: string;
      addressLocality: string;
      addressRegion: string;
      postalCode: string;
      addressCountry: string;
    };
  };
  image?: string;
  url?: string;
  offers?: {
    price: string;
    priceCurrency: string;
    availability?: string;
    url?: string;
  };
  performer?: {
    name: string;
    type?: string;
  };
  organizer?: {
    name: string;
    url?: string;
  };
  eventStatus?: 'EventScheduled' | 'EventCancelled' | 'EventPostponed' | 'EventRescheduled';
  eventAttendanceMode?:
    | 'OfflineEventAttendanceMode'
    | 'OnlineEventAttendanceMode'
    | 'MixedEventAttendanceMode';
}

export function EventSchema({
  name,
  description,
  startDate,
  endDate,
  location,
  image,
  url,
  offers,
  performer,
  organizer,
  eventStatus = 'EventScheduled',
  eventAttendanceMode = 'OfflineEventAttendanceMode',
}: EventSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name,
    description,
    startDate,
    ...(endDate && { endDate }),
    eventStatus: `https://schema.org/${eventStatus}`,
    eventAttendanceMode: `https://schema.org/${eventAttendanceMode}`,
    location: {
      '@type': 'Place',
      name: location.name,
      address: {
        '@type': 'PostalAddress',
        ...location.address,
      },
    },
    ...(image && { image }),
    ...(url && { url }),
    ...(offers && {
      offers: {
        '@type': 'Offer',
        price: offers.price,
        priceCurrency: offers.priceCurrency,
        ...(offers.availability && { availability: `https://schema.org/${offers.availability}` }),
        ...(offers.url && { url: offers.url }),
      },
    }),
    ...(performer && {
      performer: {
        '@type': performer.type || 'Person',
        name: performer.name,
      },
    }),
    ...(organizer && {
      organizer: {
        '@type': 'Organization',
        name: organizer.name,
        ...(organizer.url && { url: organizer.url }),
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default EventSchema;
