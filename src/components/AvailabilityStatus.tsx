'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/Card';
import Heading from '@/components/Heading';

export default function AvailabilityStatus() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getAvailabilityStatus = () => {
    const hour = currentTime.getHours();
    const day = currentTime.getDay();

    // Monday to Thursday (4pm-10pm service)
    if (day >= 1 && day <= 4 && hour >= 16 && hour < 22) {
      return {
        status: 'busy',
        message: "It's service time at The Anchor - I'll reply after 10pm",
        color: 'text-orange',
      };
    }

    // Friday (4pm-10pm service)
    if (day === 5 && hour >= 16 && hour < 22) {
      return {
        status: 'busy',
        message: "Friday service at The Anchor - I'll reply after 10pm",
        color: 'text-orange',
      };
    }

    // Saturday (12pm-12am service)
    if (day === 6 && hour >= 12) {
      return {
        status: 'busy',
        message: "Saturday service all day - WhatsApp me, I'll reply when I can",
        color: 'text-orange',
      };
    }

    // Sunday (12pm-10pm service)
    if (day === 0 && hour >= 12 && hour < 22) {
      return {
        status: 'busy',
        message: "Sunday service at The Anchor - I'll reply after 10pm",
        color: 'text-orange',
      };
    }

    // Weekday mornings - best time
    if (day >= 1 && day <= 5 && hour >= 9 && hour < 12) {
      return {
        status: 'available',
        message: 'Perfect time to call - usually free now!',
        color: 'text-green-600',
      };
    }

    // Weekday afternoons before service
    if (day >= 1 && day <= 5 && hour >= 12 && hour < 16) {
      return {
        status: 'available',
        message: 'Good time to chat before service starts',
        color: 'text-green-600',
      };
    }

    // Late evenings after service
    if (hour >= 22 || hour < 2) {
      return {
        status: 'maybe',
        message: 'Might be doing bedtime routine, but WhatsApp always works',
        color: 'text-teal',
      };
    }

    // Default
    return {
      status: 'normal',
      message:
        "Message me anytime - I'll get back as quickly as I can, but bear with me if I'm in service.",
      color: 'text-charcoal',
    };
  };

  const availability = getAvailabilityStatus();

  return (
    <Card background="cream" className="mb-6">
      <Heading level={3} className="mb-2">
        Right Now:
      </Heading>
      <p className={`${availability.color} font-medium`}>{availability.message}</p>
    </Card>
  );
}
