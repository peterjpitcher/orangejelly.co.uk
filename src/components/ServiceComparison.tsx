'use client';

import { useState } from 'react';
import WhatsAppButton from './WhatsAppButton';
import Card from './Card';
import { PRICING, COMPANY } from '@/lib/constants';
import Text from './Text';
import Heading from './Heading';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function ServiceComparison() {
  const [selectedService, setSelectedService] = useState('recovery');

  const services = {
    recovery: {
      name: 'Empty Pub Recovery',
      price: PRICING.hourlyRate.display,
      timeline: '15-20 hours estimated',
      perfect: 'Struggling pubs needing complete transformation',
      includes: [
        'Complete business analysis',
        'Menu optimization for profit',
        'Social media automation',
        'Event planning systems',
        'Customer retention strategy',
        'Weekly progress reviews',
      ],
      highlight: true,
    },
    menu: {
      name: 'Menu Makeover',
      price: PRICING.hourlyRate.display,
      timeline: '4-6 hours estimated',
      perfect: 'Pubs with food GP below 65%',
      includes: [
        'Complete menu analysis',
        'Psychology-based positioning',
        'Profit margin optimization',
        'Staff training materials',
        'Seasonal planning system',
      ],
      highlight: false,
    },
    custom: {
      name: 'Custom Projects',
      price: PRICING.hourlyRate.display,
      timeline: 'As needed',
      perfect: 'Specific projects or ongoing help',
      includes: [
        'Social media automation',
        'Website optimization',
        'Event planning',
        'AI training sessions',
        'Whatever you need!',
      ],
      highlight: false,
    },
  };

  return (
    <Card variant="shadowed" padding="large">
      {/* Mobile Service Selector */}
      <div className="md:hidden mb-6">
        <label className="block text-sm font-semibold mb-2">Compare Services:</label>
        <select
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
          className="w-full p-3 border rounded-lg"
        >
          {Object.entries(services).map(([key, service]) => (
            <option key={key} value={key}>
              {service.name}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop Comparison Table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="border-b-2 border-orange/20">
              <TableHead className="text-left py-4"></TableHead>
              {Object.entries(services).map(([key, service]) => (
                <TableHead key={key} className="text-center px-4 py-4">
                  <div className={service.highlight ? 'relative' : ''}>
                    {service.highlight && (
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-orange text-white px-4 py-1 rounded-full text-sm font-semibold whitespace-nowrap">
                        MOST POPULAR
                      </div>
                    )}
                    <Heading level={3} className="mb-2">
                      {service.name}
                    </Heading>
                    <Text size="2xl" weight="bold" className="text-orange">
                      {service.price}
                    </Text>
                    <Text size="sm" className="text-charcoal/60">
                      {service.timeline}
                    </Text>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="border-b">
              <TableCell className="py-4 font-semibold">Perfect for:</TableCell>
              {Object.entries(services).map(([key, service]) => (
                <TableCell key={key} className="px-4 py-4 text-center text-sm">
                  {service.perfect}
                </TableCell>
              ))}
            </TableRow>
            <TableRow className="border-b">
              <TableCell className="py-4 font-semibold align-top">What's included:</TableCell>
              {Object.entries(services).map(([key, service]) => (
                <TableCell key={key} className="px-4 py-4">
                  <ul className="space-y-2">
                    {service.includes.map((item, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <span className="text-orange mr-2 mt-0.5">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell></TableCell>
              {Object.entries(services).map(([key, service]) => (
                <TableCell key={key} className="px-4 py-6 text-center">
                  <WhatsAppButton
                    text={`I want the ${service.name}`}
                    size="small"
                    variant={service.highlight ? 'primary' : 'secondary'}
                  />
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Mobile Selected Service Display */}
      <div className="md:hidden">
        {Object.entries(services).map(([key, service]) => (
          <div
            key={key}
            className={`${selectedService === key ? 'block' : 'hidden'} ${
              service.highlight ? 'ring-2 ring-orange' : ''
            } rounded-lg p-6`}
          >
            {service.highlight && (
              <div className="bg-orange text-white px-4 py-1 rounded-full text-sm font-semibold inline-block mb-4">
                MOST POPULAR
              </div>
            )}

            <Heading level={3} className="mb-2">
              {service.name}
            </Heading>
            <Text size="2xl" weight="bold" className="text-orange mb-1">
              {service.price}
            </Text>
            <Text size="sm" className="text-charcoal/60 mb-4">
              {service.timeline}
            </Text>

            <div className="mb-6">
              <Text weight="semibold" className="mb-2">
                Perfect for:
              </Text>
              <Text className="text-charcoal/80">{service.perfect}</Text>
            </div>

            <div className="mb-6">
              <Text weight="semibold" className="mb-2">
                What's included:
              </Text>
              <ul className="space-y-2">
                {service.includes.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-orange mr-2 mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <WhatsAppButton text={`I want the ${service.name}`} fullWidth />
          </div>
        ))}
      </div>

      {/* Bottom comparison note */}
      <Card background="cream" padding="small" className="mt-8 text-center">
        <Text size="sm" className="text-charcoal/80 mb-2">
          <strong>Not sure which to choose?</strong> Struggling pubs start with Empty Pub Recovery
          for complete transformation, others choose specific services based on their biggest
          challenges.
        </Text>
        <Text size="xs" className="text-charcoal/60">
          {COMPANY.vatStatus}
        </Text>
      </Card>
    </Card>
  );
}
