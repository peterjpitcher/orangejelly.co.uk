import { createClient } from '@sanity/client';
import { CONTACT, COMPANY, PRICING, MESSAGES, SUCCESS_METRICS } from '../src/lib/constants';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Create Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
});

async function migrateSiteSettings() {
  console.log('Migrating site settings...');
  
  const siteSettings = {
    _id: 'siteSettings',
    _type: 'siteSettings',
    businessName: COMPANY.name,
    tagline: COMPANY.tagline,
    company: {
      owner: CONTACT.owner,
      coOwner: 'Billy Summers',
      vatRegistered: false,
    },
    contact: {
      email: CONTACT.email,
      phone: CONTACT.phone,
      whatsapp: CONTACT.phone,
      whatsappNumber: CONTACT.whatsappNumber,
      address: 'The Anchor, Stanwell Moor, Staines TW19 6AQ',
    },
    pricing: {
      hourlyRate: PRICING.hourlyRate.amount,
      currency: 'GBP',
      vatRate: 20,
      includesVAT: false,
    },
    metrics: [
      {
        label: 'Quiz Night Attendance',
        value: '25-35 regulars',
        description: 'Up from 20 people',
      },
      {
        label: 'Food GP Improvement',
        value: '71%',
        description: 'Up from 58%',
      },
      {
        label: 'Social Media Views',
        value: '60,000-70,000',
        description: 'Monthly reach',
      },
      {
        label: 'Customer Database',
        value: '300 contacts',
        description: 'Opted-in customers',
      },
    ],
    socialMedia: {
      facebook: 'https://www.facebook.com/orangejellypubs',
      instagram: 'https://www.instagram.com/orangejellypubs',
    },
  };

  try {
    const result = await client.createOrReplace(siteSettings);
    console.log('✓ Site settings migrated:', result._id);
  } catch (error) {
    console.error('✗ Error migrating site settings:', error);
  }
}

async function migrateNavigation() {
  console.log('Migrating navigation...');
  
  const navigation = {
    _id: 'mainNavigation',
    _type: 'navigation',
    title: 'Main Navigation',
    mainMenu: [
      { label: 'Home', href: '/', order: 1 },
      { label: 'Services', href: '/services', order: 2 },
      { label: "Licensee's Guide", href: '/guides', order: 3 },
      { label: 'Success Stories', href: '/results', order: 4 },
      { label: 'About', href: '/about', order: 5 },
      { label: 'Contact', href: '/contact', order: 6 },
    ],
  };

  try {
    const result = await client.createOrReplace(navigation);
    console.log('✓ Navigation migrated:', result._id);
  } catch (error) {
    console.error('✗ Error migrating navigation:', error);
  }
}

async function migrateServices() {
  console.log('Migrating services...');
  
  const services = [
    {
      _type: 'service',
      title: 'Quiz Night Rescue',
      slug: { _type: 'slug', current: 'quiz-night-rescue' },
      emoji: '🎯',
      order: 1,
      problem: 'Your quiz is dead in the water',
      deliverable: '30+ engaged regulars within weeks',
      description: "I'll share the exact AI prompts and Facebook strategies that took our quiz from 20 to 35+ regulars. Create questions that get people talking, build anticipation on social media, and turn your quiz into the highlight of the week.",
      features: [
        'Quiz question generation templates',
        'Social media countdown posts',
        'Team name generators',
        'Winner announcement templates',
        'Booking reminder sequences',
      ],
      example: {
        before: '20 people, same old crowd',
        after: 'Standing room only, booking essential',
        result: '75% increase in Tuesday takings',
      },
      timeEstimate: '6 hours per month',
      priceBreakdown: '6 hours × £75 = £375 + VAT',
      price: '£375 + VAT',
      timeline: 'Results in 2-3 weeks',
      highlight: true,
    },
    {
      _type: 'service',
      title: 'Social Media That Works',
      slug: { _type: 'slug', current: 'social-media-that-works' },
      emoji: '📱',
      order: 2,
      problem: 'Nobody sees your posts',
      deliverable: 'Consistent 60k+ monthly views',
      description: "Stop wasting hours on posts nobody sees. I'll show you the AI tools and scheduling tricks that get 60,000+ views monthly with just 30 minutes of work per week. Real examples from The Anchor included.",
      features: [
        'Content calendar templates',
        'AI prompt library for posts',
        'Photo editing shortcuts',
        'Hashtag research tools',
        'Engagement tracking setup',
      ],
      example: {
        before: 'Random posts, no engagement',
        after: '60,000+ monthly views',
        result: 'Quiz fully booked every week',
      },
      timeEstimate: '8 hours setup + 2 hours monthly',
      priceBreakdown: 'Setup: 8 × £75 = £500, Monthly: £125',
      price: '£500 setup + £125/month',
      timeline: 'Live within 1 week',
    },
    {
      _type: 'service',
      title: 'Menu Makeover',
      slug: { _type: 'slug', current: 'menu-makeover' },
      emoji: '🍽️',
      order: 3,
      problem: 'Menu not pulling its weight',
      deliverable: 'Optimized menu driving 71%+ GP',
      description: "Your menu is costing you money. I'll analyze your dishes, rewrite descriptions that sell, and show you the pricing psychology that increased our food GP from 58% to 71%. Includes AI tools for seasonal updates.",
      features: [
        'Menu engineering analysis',
        'Description writing templates',
        'Pricing psychology guide',
        'Seasonal menu planners',
        'Allergen management tools',
      ],
      example: {
        before: 'Bland descriptions, poor margins',
        after: 'Mouthwatering menu, 71% GP',
        result: '£4.50 higher average spend',
      },
      timeEstimate: '12 hours total',
      priceBreakdown: '12 hours × £75 = £750 + VAT',
      price: '£750 + VAT',
      timeline: 'Complete in 2 weeks',
    },
    {
      _type: 'service',
      title: 'Midweek Marketing Magic',
      slug: { _type: 'slug', current: 'midweek-marketing-magic' },
      emoji: '📅',
      order: 4,
      problem: 'Monday to Thursday is dead',
      deliverable: 'Busy midweek sessions',
      description: "Empty Monday-Thursday? I'll share the exact promotions, social media tactics, and booking systems that fill our quiet nights. From curry clubs to cocktail hours, get the templates that actually work.",
      features: [
        'Midweek promotion calendar',
        'Event planning templates',
        'Booking system setup',
        'Social media event tools',
        'Email campaign sequences',
      ],
      example: {
        before: 'Ghost town Monday-Thursday',
        after: 'Bookings needed for curry night',
        result: '£300+ extra per quiet night',
      },
      timeEstimate: '10 hours setup',
      priceBreakdown: '10 hours × £75 = £625 + VAT',
      price: '£625 + VAT',
      timeline: 'First event in 10 days',
    },
    {
      _type: 'service',
      title: 'Event Planning That Pays',
      slug: { _type: 'slug', current: 'event-planning-that-pays' },
      emoji: '🎉',
      order: 5,
      problem: 'Events flop or break even',
      deliverable: 'Profitable, packed events',
      description: "From drag bingo to wine tastings, I'll share the event formulas that actually make money. Get the planning templates, promotion strategies, and pricing models that ensure every event adds to your bottom line.",
      features: [
        'Event ROI calculator',
        'Promotion timeline templates',
        'Ticket pricing strategies',
        'Partnership pitch decks',
        'Post-event analysis tools',
      ],
      example: {
        before: 'Half-empty events, no profit',
        after: 'Sold out, £500+ profit per event',
        result: '2 profitable events monthly',
      },
      timeEstimate: '8 hours per event',
      priceBreakdown: '8 hours × £75 = £500 + VAT',
      price: '£500 + VAT per event',
      timeline: 'First event in 3 weeks',
    },
    {
      _type: 'service',
      title: 'Staff Training Revolution',
      slug: { _type: 'slug', current: 'staff-training-revolution' },
      emoji: '👥',
      order: 6,
      problem: 'Staff drain your time and energy',
      deliverable: 'Self-managing dream team',
      description: "Transform your team with AI-powered training tools. From rota management to upselling scripts, I'll show you how to save 10+ hours weekly while your staff deliver better service. Based on real results at The Anchor.",
      features: [
        'AI rota optimization',
        'Training video scripts',
        'Upselling prompt cards',
        'Team communication tools',
        'Performance tracking sheets',
      ],
      example: {
        before: '10 hours weekly on admin',
        after: 'Team runs itself',
        result: '£500 weekly in time saved',
      },
      timeEstimate: '16 hours total',
      priceBreakdown: '16 hours × £75 = £1,000 + VAT',
      price: '£1,000 + VAT',
      timeline: 'Fully implemented in 4 weeks',
    },
  ];

  for (const service of services) {
    try {
      const result = await client.create(service);
      console.log(`✓ Service migrated: ${service.title} (${result._id})`);
    } catch (error) {
      console.error(`✗ Error migrating service ${service.title}:`, error);
    }
  }
}

async function main() {
  console.log('Starting Phase 1 content migration...\n');
  
  try {
    await migrateSiteSettings();
    await migrateNavigation();
    await migrateServices();
    
    console.log('\n✓ Phase 1 content migration complete!');
  } catch (error) {
    console.error('\n✗ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
main();