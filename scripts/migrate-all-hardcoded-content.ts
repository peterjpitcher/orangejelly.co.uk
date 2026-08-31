#!/usr/bin/env node
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '9brdfanc',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function migrateContactFAQs() {
  console.log('📝 Migrating Contact Page FAQs...');
  
  const contactFAQs = [
    {
      _type: 'contactFAQ',
      _id: 'contact-faq-1',
      question: "I've never met a digital agency that really understands my pub. How are you different?",
      answer: [{
        _type: 'block',
        _key: 'a1',
        style: 'normal',
        children: [{
          _type: 'span',
          _key: 'a1-1',
          text: "That's because they've never stood behind your bar at 2am doing the till. I'm Peter, and I run The Anchor in Stanwell Moor with my husband Billy. Every single strategy I share has been tested in our own pub first. When you message me, you're talking to someone who knows what it's like when the beer delivery comes mid-service, or when your chef calls in sick on a Saturday."
        }]
      }],
      category: 'general',
      order: 0,
      active: true
    },
    {
      _type: 'contactFAQ',
      _id: 'contact-faq-2',
      question: "How quickly will I see results?",
      answer: [{
        _type: 'block',
        _key: 'a2',
        style: 'normal',
        children: [{
          _type: 'span',
          _key: 'a2-1',
          text: "At The Anchor, our first AI-powered quiz night brought in 35 people instead of the usual 20 - that was week one. Most pubs see their first wins within 14 days because I focus on quick-impact strategies first. You won't wait months wondering if it's working."
        }]
      }],
      category: 'results',
      order: 1,
      active: true
    },
    {
      _type: 'contactFAQ',
      _id: 'contact-faq-3',
      question: "What exactly do you do for £75 per hour?",
      answer: [{
        _type: 'block',
        _key: 'a3',
        style: 'normal',
        children: [{
          _type: 'span',
          _key: 'a3-1',
          text: "Everything from writing your social media posts to designing menus that sell. I can create quiz nights that pack your pub, write emails that get opened, fix your Google listing so locals find you, or teach you AI tools that save 5 hours a week. You tell me what's hurting your business most - I'll fix it using methods proven at The Anchor."
        }]
      }],
      category: 'pricing',
      order: 2,
      active: true
    },
    {
      _type: 'contactFAQ',
      _id: 'contact-faq-4',
      question: "I'm not tech-savvy. Will I be able to use these AI tools?",
      answer: [{
        _type: 'block',
        _key: 'a4',
        style: 'normal',
        children: [{
          _type: 'span',
          _key: 'a4-1',
          text: "If you can send a WhatsApp message, you can use these tools. I explain everything in plain English - no jargon, no confusion. When I show you how to create a month of social posts in 20 minutes, you'll wonder why everyone makes it sound so complicated."
        }]
      }],
      category: 'process',
      order: 3,
      active: true
    },
    {
      _type: 'contactFAQ',
      _id: 'contact-faq-5',
      question: "How do I know this will work for my type of pub?",
      answer: [{
        _type: 'block',
        _key: 'a5',
        style: 'normal',
        children: [{
          _type: 'span',
          _key: 'a5-1',
          text: "The Anchor isn't in a city center. We're in a small village, competing with chains 30 minutes away. If these strategies work here, they'll work anywhere. Plus, I customize everything to your specific situation - your customers, your competition, your strengths."
        }]
      }],
      category: 'services',
      order: 4,
      active: true
    },
    {
      _type: 'contactFAQ',
      _id: 'contact-faq-6',
      question: "Why £75 per hour? Why not packages?",
      answer: [{
        _type: 'block',
        _key: 'a6',
        style: 'normal',
        children: [{
          _type: 'span',
          _key: 'a6-1',
          text: "Because your pub doesn't need what every other pub needs. Maybe you just need 3 hours to fix your dead Monday nights. Maybe you need 20 hours for a complete marketing overhaul. Pay for exactly what you need, nothing more."
        }]
      }],
      category: 'pricing',
      order: 5,
      active: true
    },
    {
      _type: 'contactFAQ',
      _id: 'contact-faq-7',
      question: "Can I see examples of your work?",
      answer: [{
        _type: 'block',
        _key: 'a7',
        style: 'normal',
        children: [{
          _type: 'span',
          _key: 'a7-1',
          text: "Visit The Anchor's social media pages - everything you see there, I created using the same tools I'll teach you. 60,000+ views monthly, quiz nights up 40%, food GP improved from 58% to 71%. That's not theory - that's our actual pub."
        }]
      }],
      category: 'results',
      order: 6,
      active: true
    },
    {
      _type: 'contactFAQ',
      _id: 'contact-faq-8',
      question: "What if it doesn't work?",
      answer: [{
        _type: 'block',
        _key: 'a8',
        style: 'normal',
        children: [{
          _type: 'span',
          _key: 'a8-1',
          text: "30-day action plan with weekly support. If you don't see real improvements in your business, I'll refund every penny. I can offer this because in 6 years at The Anchor, these strategies have never failed when properly implemented."
        }]
      }],
      category: 'pricing',
      order: 7,
      active: true
    },
    {
      _type: 'contactFAQ',
      _id: 'contact-faq-9',
      question: "How do we get started?",
      answer: [{
        _type: 'block',
        _key: 'a9',
        style: 'normal',
        children: [{
          _type: 'span',
          _key: 'a9-1',
          text: "WhatsApp me. Tell me your biggest problem. I'll tell you exactly how I fixed the same issue at The Anchor and how long it'll take for your pub. No sales pitch, no pressure - just licensee to licensee."
        }]
      }],
      category: 'process',
      order: 8,
      active: true
    },
    {
      _type: 'contactFAQ',
      _id: 'contact-faq-10',
      question: "Do you work with chains or just independents?",
      answer: [{
        _type: 'block',
        _key: 'a10',
        style: 'normal',
        children: [{
          _type: 'span',
          _key: 'a10-1',
          text: "Both. I'm training a pub chain team in September 2025. Whether you're a family-run free house or part of a larger group, if you want to fill your pub and save hours weekly, I can help."
        }]
      }],
      category: 'services',
      order: 9,
      active: true
    },
    {
      _type: 'contactFAQ',
      _id: 'contact-faq-11',
      question: "What areas do you cover?",
      answer: [{
        _type: 'block',
        _key: 'a11',
        style: 'normal',
        children: [{
          _type: 'span',
          _key: 'a11-1',
          text: "Everywhere. Most work is done remotely via video calls and screen sharing. I can show you exactly what to do from my screen to yours. For local pubs in Surrey/Berkshire, I can visit in person."
        }]
      }],
      category: 'services',
      order: 10,
      active: true
    },
    {
      _type: 'contactFAQ',
      _id: 'contact-faq-12',
      question: "When are you available?",
      answer: [{
        _type: 'block',
        _key: 'a12',
        style: 'normal',
        children: [{
          _type: 'span',
          _key: 'a12-1',
          text: "I work around pub life. Early mornings before deliveries, quiet afternoons, or late evenings after service. I know when you're free because I live the same schedule."
        }]
      }],
      category: 'process',
      order: 11,
      active: true
    }
  ];

  for (const faq of contactFAQs) {
    try {
      await client.createOrReplace(faq);
      console.log(`✅ Created FAQ: ${faq.question.substring(0, 50)}...`);
    } catch (error) {
      console.error(`❌ Error creating FAQ ${faq._id}:`, error);
    }
  }
}

async function migrateTrustBar() {
  console.log('📊 Migrating Trust Bar...');
  
  const trustBar = {
    _type: 'trustBar',
    _id: 'trustBar',
    title: 'Homepage Trust Bar',
    items: [
      {
        _key: 'item1',
        value: '15-20% Covers',
        label: 'Average increase in 6 weeks',
        order: 0
      },
      {
        _key: 'item2',
        value: '£75/hour',
        label: 'AI-powered marketing solutions',
        order: 1
      },
      {
        _key: 'item3',
        value: '14 Days',
        label: 'Guaranteed quick results',
        order: 2
      }
    ],
    active: true
  };

  try {
    await client.createOrReplace(trustBar);
    console.log('✅ Trust Bar migrated');
  } catch (error) {
    console.error('❌ Error migrating Trust Bar:', error);
  }
}

async function migrateROICalculator() {
  console.log('🧮 Migrating ROI Calculator...');
  
  const roiCalculator = {
    _type: 'roiCalculator',
    _id: 'roiCalculator',
    title: 'Calculate Your Time & Money Savings',
    hourlyValue: 25,
    sliders: [
      {
        _key: 'slider1',
        id: 'adminHours',
        label: 'Hours per week on admin tasks (rotas, ordering, emails):',
        min: 0,
        max: 20,
        defaultValue: 10,
        unit: 'h',
        calculation: 0.5
      },
      {
        _key: 'slider2',
        id: 'socialMediaHours',
        label: 'Hours per week on social media & marketing:',
        min: 0,
        max: 15,
        defaultValue: 5,
        unit: 'h',
        calculation: 0.8
      },
      {
        _key: 'slider3',
        id: 'menuUpdates',
        label: 'Hours per month updating menus & descriptions:',
        min: 0,
        max: 10,
        defaultValue: 4,
        unit: 'h',
        calculation: 0.75
      },
      {
        _key: 'slider4',
        id: 'averageSpend',
        label: 'Current average customer spend (£):',
        min: 10,
        max: 30,
        defaultValue: 18,
        unit: '£',
        calculation: 0
      }
    ],
    resultMessages: {
      hoursSavedLabel: 'Hours saved per month:',
      moneySavedLabel: 'Value of time saved:',
      revenueIncreaseLabel: 'Potential revenue increase:',
      totalBenefitLabel: 'Total monthly benefit:',
      ctaText: 'Claim Your Time Back'
    }
  };

  try {
    await client.createOrReplace(roiCalculator);
    console.log('✅ ROI Calculator migrated');
  } catch (error) {
    console.error('❌ Error migrating ROI Calculator:', error);
  }
}

async function updatePartnershipsInAbout() {
  console.log('🤝 Ensuring partnerships are in About content...');
  
  // Check if partnerships already exist in aboutContent
  const aboutContent = await client.fetch('*[_type == "aboutContent" && _id == "aboutContent"][0]');
  
  if (!aboutContent) {
    console.log('❌ About content not found');
    return;
  }

  if (!aboutContent.partnerships || aboutContent.partnerships.length === 0) {
    const partnerships = [
      {
        _key: 'partner1',
        name: 'Greene King',
        description: "We operate The Anchor as a Greene King tenant, sharing our AI innovations with one of the UK's leading pub companies.",
        logoUrl: '/partners/greene-king-logo.svg',
        url: 'https://www.greeneking.co.uk'
      },
      {
        _key: 'partner2',
        name: 'British Institute of Innkeeping',
        description: 'Proud BII members, featured in their Autumn 2025 magazine for our AI innovation in hospitality.',
        logoUrl: '/partners/bii-logo.svg',
        url: 'https://www.bii.org'
      },
      {
        _key: 'partner3',
        name: 'Federation of Small Businesses',
        description: "FSB members supporting the UK's small business community.",
        logoUrl: '/partners/fsb-logo.svg',
        url: 'https://www.fsb.org.uk'
      }
    ];

    try {
      await client.patch('aboutContent')
        .set({ partnerships })
        .commit();
      console.log('✅ Partnerships added to About content');
    } catch (error) {
      console.error('❌ Error updating partnerships:', error);
    }
  } else {
    console.log('✅ Partnerships already exist in About content');
  }
}

async function updateNavigationDefaults() {
  console.log('🧭 Ensuring navigation has all menu items...');
  
  const navigation = await client.fetch('*[_type == "navigation" && _id == "navigation"][0]');
  
  if (!navigation || !navigation.mainMenu || navigation.mainMenu.length === 0) {
    const defaultNavigation = {
      _type: 'navigation',
      _id: 'navigation',
      mainMenu: [
        { _key: 'nav1', href: '/', label: 'Home' },
        { _key: 'nav2', href: '/services', label: 'Services' },
        { _key: 'nav3', href: '/guides', label: "Licensee's Guide" },
        { _key: 'nav4', href: '/results', label: 'Success Stories' },
        { _key: 'nav5', href: '/about', label: 'About' },
        { _key: 'nav6', href: '/contact', label: 'Contact' }
      ],
      mobileMenu: [
        { _key: 'mnav1', href: '/', label: 'Home' },
        { _key: 'mnav2', href: '/services', label: 'Services' },
        { _key: 'mnav3', href: '/guides', label: "Licensee's Guide" },
        { _key: 'mnav4', href: '/results', label: 'Success Stories' },
        { _key: 'mnav5', href: '/about', label: 'About' },
        { _key: 'mnav6', href: '/contact', label: 'Contact' }
      ],
      whatsappCta: {
        enabled: true,
        text: "Hi Peter, I'd like to chat about Orange Jelly",
        showInDesktop: true,
        showInMobile: true
      }
    };

    try {
      await client.createOrReplace(defaultNavigation);
      console.log('✅ Navigation migrated');
    } catch (error) {
      console.error('❌ Error migrating navigation:', error);
    }
  } else {
    console.log('✅ Navigation already exists');
  }
}

async function updateFooterDefaults() {
  console.log('🦶 Ensuring footer has all content...');
  
  const footer = await client.fetch('*[_type == "footerContent" && _id == "footerContent"][0]');
  
  if (!footer || !footer.services || footer.services.length === 0) {
    const footerPatch = {
      services: [
        { _key: 'fs1', title: 'Empty Pub Recovery', href: '/services#empty-pub-recovery' },
        { _key: 'fs2', title: 'Menu Makeover', href: '/services#boost-food-sales' },
        { _key: 'fs3', title: 'Marketing Package', href: '/services#done-for-you-marketing' },
        { _key: 'fs4', title: 'View All →', href: '/services' }
      ],
      quickLinks: [
        { _key: 'fq1', title: 'About Us', href: '/about', external: false },
        { _key: 'fq2', title: 'Success Stories', href: '/results', external: false },
        { _key: 'fq3', title: 'Contact', href: '/contact', external: false },
        { _key: 'fq4', title: 'The Anchor', href: 'https://the-anchor.pub', external: true }
      ]
    };

    try {
      await client.patch('footerContent')
        .setIfMissing(footerPatch)
        .commit();
      console.log('✅ Footer content updated');
    } catch (error) {
      console.error('❌ Error updating footer:', error);
    }
  } else {
    console.log('✅ Footer content already exists');
  }
}

async function main() {
  console.log('🚀 Starting comprehensive content migration to Sanity...\n');
  
  // Check token
  if (!process.env.SANITY_API_TOKEN) {
    console.error('❌ SANITY_API_TOKEN not found in environment variables');
    process.exit(1);
  }

  try {
    // Run all migrations
    await migrateContactFAQs();
    await migrateTrustBar();
    await migrateROICalculator();
    await updatePartnershipsInAbout();
    await updateNavigationDefaults();
    await updateFooterDefaults();
    
    console.log('\n✅ All content successfully migrated to Sanity!');
    console.log('\n📝 Next steps:');
    console.log('1. Deploy Sanity Studio: cd sanity-studio && npx sanity deploy');
    console.log('2. Update components to remove hardcoded fallbacks');
    console.log('3. Test all pages to ensure Sanity content loads');
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
main();