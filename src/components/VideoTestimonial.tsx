'use client';

import { useState } from 'react';
import OptimizedImage from '@/components/OptimizedImage';
import Card from './Card';
import Button from './Button';
import Heading from './Heading';
import Text from './Text';

interface VideoTestimonialProps {
  title?: string;
  subtitle?: string;
  testimonialText: string;
  author: string;
  result?: string;
}

export default function VideoTestimonial({
  title = 'See How Billy Got His Evenings Back',
  subtitle = '2 hours earlier home every night',
  testimonialText,
  author,
  result,
}: VideoTestimonialProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <Card
      background="orange-light"
      className="bg-gradient-to-br from-orange/10 to-orange/5 overflow-hidden shadow-xl"
    >
      {/* Video/Thumbnail Section */}
      <div className="relative aspect-video bg-charcoal">
        {!isPlaying ? (
          <div className="relative w-full h-full">
            {/* Placeholder for video thumbnail */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-charcoal to-charcoal-dark">
              <div className="text-center text-white">
                <div className="mb-4">
                  <OptimizedImage
                    src="/logo_the-anchor.png"
                    alt="The Anchor"
                    width={200}
                    height={80}
                    className="mx-auto opacity-50"
                  />
                </div>
                <Text className="text-xl font-semibold mb-2 text-white">{title}</Text>
                <Text className="text-cream/80">{subtitle}</Text>
              </div>
            </div>

            {/* Play Button */}
            <Button
              onClick={() => setIsPlaying(true)}
              variant="ghost"
              className="absolute inset-0 flex items-center justify-center group"
              aria-label="Play video"
            >
              <div className="bg-orange text-white rounded-full p-6 shadow-lg group-hover:scale-110 transition-normal">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </Button>

            {/* Coming Soon Badge */}
            <div className="absolute top-4 right-4 bg-orange text-white px-3 py-1 rounded-full text-sm font-semibold">
              Video Coming Soon
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-charcoal flex items-center justify-center">
            <Text className="text-white">Video player would go here</Text>
          </div>
        )}
      </div>

      {/* Testimonial Text */}
      <div className="p-8">
        <blockquote className="text-lg italic text-charcoal/80 mb-4">
          "{testimonialText}"
        </blockquote>

        <div className="flex items-center justify-between">
          <div>
            <Text className="font-semibold text-charcoal">{author}</Text>
            {result && (
              <Text size="sm" className="text-orange font-medium">
                {result}
              </Text>
            )}
          </div>

          <OptimizedImage
            src="/logo.png"
            alt="Orange Jelly"
            width={40}
            height={40}
            className="rounded-lg opacity-50"
          />
        </div>
      </div>
    </Card>
  );
}

export function VideoTestimonialGrid() {
  const testimonials = [
    {
      title: 'Social Media in Minutes',
      subtitle: '3 months of content in one afternoon',
      testimonialText:
        'I used to spend Sunday nights doing Facebook posts. Now I batch create everything monthly and spend Sundays with Marty instead.',
      author: 'Billy Summers, The Anchor',
      result: '2 hours saved every week',
    },
    {
      title: 'Menu Magic That Works',
      subtitle: '£400+ extra per week',
      testimonialText:
        'The AI helped us rewrite our menu descriptions. Our Sunday roast sales went up 15% in the first week. It paid for itself immediately.',
      author: 'Peter Pitcher, The Anchor',
      result: '15% increase in premium dishes',
    },
    {
      title: 'Wednesday Night Transformation',
      subtitle: 'From empty to buzzing',
      testimonialText:
        'AI helped us plan a steak night with smart pricing. Now Wednesdays are one of our strongest nights.',
      author: 'The Anchor Team',
      result: 'From 20 to 60+ covers',
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {testimonials.map((testimonial, index) => (
        <Card key={index} variant="shadowed" padding="medium">
          <Heading level={4} className="font-bold mb-2">
            {testimonial.title}
          </Heading>
          <Text size="sm" className="text-charcoal/60 mb-4">
            {testimonial.subtitle}
          </Text>

          <blockquote className="text-charcoal/80 italic mb-4">
            "{testimonial.testimonialText}"
          </blockquote>

          <div className="border-t pt-4">
            <Text size="sm" className="font-semibold">
              {testimonial.author}
            </Text>
            <Text className="text-orange font-bold">{testimonial.result}</Text>
          </div>
        </Card>
      ))}
    </div>
  );
}
