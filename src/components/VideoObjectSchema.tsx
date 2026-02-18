interface VideoObjectSchemaProps {
  name: string;
  description: string;
  thumbnailUrl: string | string[];
  uploadDate: string;
  duration?: string; // ISO 8601 duration format (e.g., "PT5M30S" for 5 minutes 30 seconds)
  contentUrl?: string;
  embedUrl?: string;
  interactionStatistic?: {
    watchCount?: number;
    likeCount?: number;
    commentCount?: number;
  };
  publication?: {
    isLiveBroadcast: boolean;
    startDate?: string;
    endDate?: string;
  };
  creator?: {
    name: string;
    url?: string;
  };
  keywords?: string[];
  transcript?: string;
}

export function VideoObjectSchema({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  duration,
  contentUrl,
  embedUrl,
  interactionStatistic,
  publication,
  creator,
  keywords,
  transcript,
}: VideoObjectSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name,
    description,
    thumbnailUrl: Array.isArray(thumbnailUrl) ? thumbnailUrl : [thumbnailUrl],
    uploadDate,
    ...(duration && { duration }),
    ...(contentUrl && { contentUrl }),
    ...(embedUrl && { embedUrl }),
    ...(interactionStatistic && {
      interactionStatistic: [
        ...(interactionStatistic.watchCount
          ? [
              {
                '@type': 'InteractionCounter',
                interactionType: { '@type': 'WatchAction' },
                userInteractionCount: interactionStatistic.watchCount,
              },
            ]
          : []),
        ...(interactionStatistic.likeCount
          ? [
              {
                '@type': 'InteractionCounter',
                interactionType: { '@type': 'LikeAction' },
                userInteractionCount: interactionStatistic.likeCount,
              },
            ]
          : []),
        ...(interactionStatistic.commentCount
          ? [
              {
                '@type': 'InteractionCounter',
                interactionType: { '@type': 'CommentAction' },
                userInteractionCount: interactionStatistic.commentCount,
              },
            ]
          : []),
      ],
    }),
    ...(publication && {
      publication: {
        '@type': 'BroadcastEvent',
        isLiveBroadcast: publication.isLiveBroadcast,
        ...(publication.startDate && { startDate: publication.startDate }),
        ...(publication.endDate && { endDate: publication.endDate }),
      },
    }),
    ...(creator && {
      creator: {
        '@type': 'Person',
        name: creator.name,
        ...(creator.url && { url: creator.url }),
      },
    }),
    ...(keywords && { keywords: keywords.join(', ') }),
    ...(transcript && { transcript }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default VideoObjectSchema;
