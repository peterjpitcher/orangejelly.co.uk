'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Calendar, CheckCircle2, MapPin, Zap, Trophy, Target } from 'lucide-react';
import { FAQSchema } from '@/components/StructuredData';
// Demo page imports
import Heading from '@/components/Heading';
import Text from '@/components/Text';
import Section from '@/components/Section';

interface AboutDemoFounder {
  name?: string;
  role?: string;
}

interface AboutDemoContent {
  founderSection?: AboutDemoFounder;
}

interface AboutDemoPageProps {
  aboutContent?: AboutDemoContent;
}

export default function AboutDemoPage({ aboutContent }: AboutDemoPageProps) {
  const faqs = [
    {
      question: 'Who is Peter Pitcher and why should I trust Orange Jelly?',
      answer:
        "I'm Peter Pitcher. Billy runs The Anchor pub in Stanwell Moor day-to-day, and I handle marketing and business development around my full-time role as an AI Marketing Capabilities Lead for a global food manufacturer. I've been an early AI adopter since 2021 and discovered how AI can add 25 hours of value per week. Orange Jelly exists to share these proven strategies with fellow licensees.",
    },
    {
      question: 'What makes Orange Jelly different from other consultants?',
      answer:
        "We're not consultants who've never pulled a pint. We run an actual pub and test every strategy in our own business first. No corporate nonsense, no jargon - just one licensee helping another with tools that actually work.",
    },
    {
      question: 'Can I visit The Anchor to see your strategies in action?',
      answer:
        "Absolutely! We'd love to show you around. Pop in for a pint and see how we use AI tools in real pub operations. First pint's on me if you mention Orange Jelly. We're at Horton Road, Stanwell Moor, Staines TW19 6AQ.",
    },
    {
      question: 'What results have you achieved at The Anchor?',
      answer:
        "We reach 60,000-70,000 people every month on social media, our quiz nights now attract 25-30 regular teams each month, we've cut £250/week in Sunday waste and £4,000+ a month in supplier, rota, and energy costs, and added £75,000-£100,000 of value to our business using AI. Most importantly - we got our evenings back. Every strategy we share has delivered real results in our own pub.",
    },
    {
      question: 'How can I be sure Orange Jelly will work for my pub?',
      answer:
        "Every pub is different, but the challenges are similar. That's why we offer a free consultation to understand your specific situation and stay hands-on through the first month to make sure the plan sticks. These aren't theories - they're proven strategies from our own pub.",
    },
  ];

  return (
    <>
      <FAQSchema faqs={faqs} />
      <main className="min-h-screen bg-gradient-to-b from-cream to-white">
        {/* Hero Section with gradient background */}
        <Section background="cream" padding="large" className="relative">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center space-y-4">
              <Badge variant="outline" className="mb-4">
                Est. 2019
              </Badge>
              <Heading level={1} className="text-4xl md:text-6xl font-bold text-charcoal">
                From One Licensee to Another
              </Heading>
              <Text className="text-xl text-charcoal/80 max-w-3xl mx-auto">
                We run The Anchor in Stanwell Moor. We unlocked 25 hours of value per week by
                applying AI across our pub. Now we help other licensees do the same.
              </Text>
              <div className="flex gap-4 justify-center pt-4">
                <Button size="lg" asChild>
                  <Link href="/contact">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/results">See Our Results</Link>
                </Button>
              </div>
            </div>
          </div>
        </Section>

        {/* Quick Stats */}
        <Section background="white" padding="medium" className="aria-label-key-performance-metrics">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="text-center">
                <CardHeader className="pb-3">
                  <CardTitle className="text-3xl font-bold text-orange">£250/week</CardTitle>
                  <CardDescription>Sunday Waste Cut</CardDescription>
                </CardHeader>
              </Card>
              <Card className="text-center">
                <CardHeader className="pb-3">
                  <CardTitle className="text-3xl font-bold text-orange">25-30</CardTitle>
                  <CardDescription>Quiz Teams Each Month</CardDescription>
                </CardHeader>
              </Card>
              <Card className="text-center">
                <CardHeader className="pb-3">
                  <CardTitle className="text-3xl font-bold text-orange">60-70k</CardTitle>
                  <CardDescription>Monthly Social Reach</CardDescription>
                </CardHeader>
              </Card>
              <Card className="text-center">
                <CardHeader className="pb-3">
                  <CardTitle className="text-3xl font-bold text-orange">£75k-£100k</CardTitle>
                  <CardDescription>Value Added</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </Section>

        {/* Story Section with Tabs */}
        <Section padding="large" className="aria-label-our-story-and-values">
          <div className="container mx-auto max-w-4xl">
            <Heading level={2} className="text-3xl font-bold text-center mb-8">
              Our Journey
            </Heading>

            <Tabs defaultValue="story" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="story">The Story</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="values">Our Values</TabsTrigger>
              </TabsList>

              <TabsContent value="story" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>The Real Story Behind Orange Jelly</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Text className="text-lg">
                      I'm Peter. Billy runs <strong>The Anchor in Stanwell Moor</strong> day-to-day,
                      and I handle marketing and business development around a full-time role. Like
                      you, we've faced empty tables, rising costs, and 70-hour weeks wondering if
                      it's all worth it.
                    </Text>
                    <Text className="text-lg">
                      Everything changed when I discovered how{' '}
                      <strong>AI could transform pub operations</strong>. As an early adopter since
                      2021, I've tested everything - the failures taught me what to avoid, the
                      successes showed me what to share.
                    </Text>
                    <Text className="text-lg">
                      Today, our quiz nights attract <strong>25-30 regular teams each month</strong>
                      , we cut <strong>£250/week in Sunday waste</strong> and{' '}
                      <strong>£4,000+ a month</strong> in supplier, rota, and energy costs, and we
                      actually have evenings off. Orange Jelly exists to help you achieve the same
                      transformation.
                    </Text>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="timeline" className="mt-6">
                <div className="space-y-4">
                  {[
                    {
                      date: 'March 2019',
                      icon: <Calendar className="h-5 w-5" />,
                      title: 'Took Over The Anchor',
                      desc: 'Empty tables, no strategy, pure hope.',
                    },
                    {
                      date: '2021',
                      icon: <Zap className="h-5 w-5" />,
                      title: 'Discovered AI',
                      desc: 'Started testing, failing, learning.',
                    },
                    {
                      date: 'Jan-Feb 2024',
                      icon: <Trophy className="h-5 w-5" />,
                      title: 'Transformation',
                      desc: 'Six brutal weeks forced full AI adoption. We focused on cutting waste and simplifying operations.',
                    },
                    {
                      date: 'Today',
                      icon: <Target className="h-5 w-5" />,
                      title: 'Helping Others',
                      desc: 'Helping licensees save up to 25 hours weekly with proven tools.',
                    },
                  ].map((item, i) => (
                    <Card key={i}>
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          <div className="text-orange">{item.icon}</div>
                          <div>
                            <CardTitle className="text-lg">{item.title}</CardTitle>
                            <CardDescription>{item.date}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Text>{item.desc}</Text>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="values" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      icon: '🎯',
                      title: 'Real Experience',
                      desc: 'We run an actual pub. Every strategy tested first.',
                    },
                    {
                      icon: '💰',
                      title: 'Honest Pricing',
                      desc: '£75 per hour plus VAT. No packages, no surprises.',
                    },
                    {
                      icon: '🛡️',
                      title: 'Results Backed by Experience',
                      desc: 'Everything we teach runs daily inside The Anchor.',
                    },
                    {
                      icon: '🤝',
                      title: 'Personal Service',
                      desc: 'Just me, no sales team. Direct access to someone who understands.',
                    },
                  ].map((value, i) => (
                    <Card key={i} className="text-center">
                      <CardHeader>
                        <div className="text-4xl mb-2">{value.icon}</div>
                        <CardTitle className="text-lg">{value.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Text className="text-sm text-muted-foreground">{value.desc}</Text>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </Section>

        {/* Meet Peter Section */}
        <Section background="orange-light" padding="large" className="aria-label-meet-the-founder">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src="/images/peter-and-billy-anchor.jpg"
                      alt="Peter Pitcher, founder of Orange Jelly"
                    />
                    <AvatarFallback>PP</AvatarFallback>
                  </Avatar>
                  <div>
                    <Heading level={2} className="text-3xl font-bold">
                      {aboutContent?.founderSection?.name || 'Meet Peter Pitcher'}
                    </Heading>
                    <Text className="text-muted-foreground">
                      {aboutContent?.founderSection?.role || 'Founder & Pub Owner'}
                    </Text>
                  </div>
                </div>

                <div className="space-y-4">
                  <Text className="text-lg">
                    I'm not your typical consultant. By day, I'm an AI Marketing Capabilities Lead
                    for a global food manufacturer. By night and weekends, I'm pulling pints at The
                    Anchor.
                  </Text>
                  <Text className="text-lg">
                    My curiosity for technology made me an early AI adopter in 2021. When I saw how
                    it could save hours on pub admin, I had to share it with other licensees
                    struggling like we were.
                  </Text>
                  <Text className="text-lg">
                    Now I help pubs across the UK implement the same AI strategies that transformed
                    our business. No theory, no fluff - just practical tools that work in real pub
                    life.
                  </Text>
                </div>

                <Card className="bg-teal text-white">
                  <CardContent className="pt-6">
                    <Text className="italic text-lg">
                      "If I can run a successful pub while working full-time, imagine what you can
                      achieve with the right AI tools supporting you."
                    </Text>
                  </CardContent>
                </Card>
              </div>

              <div className="relative aspect-square max-w-[400px] mx-auto">
                <Card className="h-full w-full overflow-hidden">
                  <Image
                    src="/images/peter-and-billy-anchor.jpg"
                    alt="Peter and Billy at The Anchor pub"
                    width={400}
                    height={400}
                    className="object-cover"
                    loading="lazy"
                  />
                </Card>
              </div>
            </div>
          </div>
        </Section>

        {/* Quick Facts Section */}
        <Section padding="large" className="aria-label-quick-facts-about-orange-jelly">
          <div className="container mx-auto max-w-4xl">
            <Card className="bg-gradient-to-br from-orange-light to-orange">
              <CardHeader>
                <CardTitle className="text-2xl text-white">
                  Quick Facts About Orange Jelly
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    'Pub owners since March 2019',
                    'AI early adopter since 2021',
                    'Full-time job + pub + Orange Jelly',
                    'Featured in BII magazine',
                    'Greene King tenants',
                    '£75/hour - no packages',
                    '30-day action plan with weekly check-ins',
                    'First pint free when you visit!',
                  ].map((fact, i) => (
                    <div key={i} className="flex items-center gap-2 text-white">
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                      <span>{fact}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </Section>

        {/* FAQs Section */}
        <Section
          background="cream"
          padding="large"
          className="aria-label-frequently-asked-questions"
        >
          <div className="container mx-auto max-w-3xl">
            <Heading level={2} className="text-3xl font-bold text-center mb-8">
              Your Questions Answered
            </Heading>

            <Accordion
              type="single"
              collapsible
              className="w-full"
              itemScope
              itemType="https://schema.org/FAQPage"
            >
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  itemScope
                  itemProp="mainEntity"
                  itemType="https://schema.org/Question"
                >
                  <AccordionTrigger itemProp="name">{faq.question}</AccordionTrigger>
                  <AccordionContent
                    className="text-muted-foreground"
                    itemScope
                    itemProp="acceptedAnswer"
                    itemType="https://schema.org/Answer"
                  >
                    <span itemProp="text">{faq.answer}</span>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Section>

        {/* Partners Section */}
        <Section padding="large" className="aria-label-partners-and-memberships">
          <div className="container mx-auto max-w-6xl">
            <Heading level={2} className="text-3xl font-bold text-center mb-8">
              Our Partners & Memberships
            </Heading>
            <div className="flex flex-wrap justify-center items-center gap-8">
              <Badge variant="secondary" className="text-lg px-6 py-2">
                Greene King Tenant
              </Badge>
              <Badge variant="secondary" className="text-lg px-6 py-2">
                BII Member
              </Badge>
              <Badge variant="secondary" className="text-lg px-6 py-2">
                Featured in BII Magazine Autumn 2025
              </Badge>
            </div>
          </div>
        </Section>

        {/* Visit CTA */}
        <Section background="teal" padding="large" className="aria-label-visit-the-anchor">
          <div className="container mx-auto max-w-4xl text-center">
            <Heading level={2} className="text-3xl font-bold mb-6">
              Come See The Results Yourself
            </Heading>
            <Text className="text-xl mb-8">
              Visit The Anchor and see how we use AI in real pub operations. First pint's on me if
              you mention Orange Jelly.
            </Text>

            <Card className="inline-block">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  The Anchor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Text className="text-muted-foreground">
                  Horton Road, Stanwell Moor
                  <br />
                  Staines TW19 6AQ
                </Text>
              </CardContent>
              <CardFooter>
                <Button variant="link" asChild className="w-full">
                  <Link
                    href="https://maps.google.com/?q=The+Anchor+Stanwell+Moor"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get Directions <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </Section>

        {/* Final CTA */}
        <Section background="charcoal" padding="large" className="aria-label-call-to-action">
          <div className="container mx-auto max-w-4xl text-center">
            <Heading level={2} className="text-4xl font-bold mb-6">
              Ready to Transform Your Pub?
            </Heading>
            <Text className="text-xl mb-8">
              Let's chat about your challenges. No sales pitch, just one licensee to another.
            </Text>
            <div className="flex gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/contact">Book Free Consultation</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent text-white border-white hover:bg-white hover:text-orange"
                asChild
              >
                <Link href="/services">View Services</Link>
              </Button>
            </div>
          </div>
        </Section>
      </main>
    </>
  );
}
