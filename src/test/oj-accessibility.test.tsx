import { render } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';

import {
  Button,
  Tag,
  Stat,
  Field,
  Input,
  Select,
  Textarea,
  Checkbox,
  Radio,
  Header,
  Footer,
  Breadcrumb,
  Card,
  PressureCard,
  ProofCard,
  MethodStep,
  Quote,
  Alert,
  EmptyState,
  Skeleton,
  FAQ,
  Toc,
  CategoryTag,
  ArticleCard,
  Pagination,
  Tabs,
  NextStep,
  OfferCard,
  CompareTable,
  LogoStrip,
  SeasonalBand,
  PressureMap,
  PressureCheck,
  StickyCTA,
  ShareRow,
  SiteSearch,
} from '@/components/oj';

/**
 * Automated accessibility sweep across the ported library.
 *
 * axe catches a minority of accessibility problems and none of the interesting
 * ones, so this is a floor rather than a ceiling. The behaviour it cannot see,
 * focus order, Escape handling, focus return, announcement of dynamic content, is
 * covered by the per-component tests alongside this file.
 *
 * Run against axe's wcag2a, wcag2aa and wcag21aa rule sets, which is the standard
 * the programme commits to.
 */
async function scan(ui: React.ReactElement): Promise<string[]> {
  const { container } = render(ui);
  const results = await axe.run(container, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
    // Colour contrast needs real rendering, which jsdom does not do. It is asserted
    // properly in design-tokens.contrast.test.ts against the actual token values.
    rules: { 'color-contrast': { enabled: false } },
  });
  return results.violations.map(
    (violation) => `${violation.id}: ${violation.help} (${violation.nodes.length} node(s))`
  );
}

const NAV_ITEMS = [
  { label: 'How we work', href: '/how-we-work' },
  { label: 'About', href: '/about' },
];

const CASES: Array<[string, React.ReactElement]> = [
  ['Button', <Button key="b">Let's talk</Button>],
  [
    'Button as link',
    <Button key="bl" href="/start-here" arrow>
      Start here
    </Button>,
  ],
  ['Tag', <Tag key="t">Create demand</Tag>],
  ['Stat', <Stat key="s" value="403%" label="Table bookings" sub="At The Anchor" />],
  [
    'Field with input',
    <Field key="f" label="Work email" hint="One reply." required>
      <Input type="email" />
    </Field>,
  ],
  [
    'Field with error',
    <Field key="fe" label="Work email" error="Enter a work email address">
      <Input type="email" />
    </Field>,
  ],
  [
    'Select',
    <Field key="sel" label="Your role">
      <Select>
        <option value="">Choose one</option>
      </Select>
    </Field>,
  ],
  [
    'Textarea',
    <Field key="ta" label="What is happening?">
      <Textarea />
    </Field>,
  ],
  ['Checkbox', <Checkbox key="cb" label="Send me the write-up" />],
  ['Radio', <Radio key="r" name="size" label="10 to 49 people" />],
  [
    'Header',
    <Header key="h" items={NAV_ITEMS} cta={{ label: "Let's talk", href: '/s' }} />,
  ],
  ['Header orange', <Header key="ho" tone="orange" items={NAV_ITEMS} />],
  [
    'Footer',
    <Footer
      key="fo"
      columns={[{ title: 'Company', links: [{ label: 'About', href: '/about' }] }]}
    />,
  ],
  [
    'Breadcrumb',
    <Breadcrumb key="bc" items={[{ label: 'Home', href: '/' }, { label: 'Insights' }]} />,
  ],
  ['Card', <Card key="c">Body copy</Card>],
  ['PressureCard', <PressureCard key="pc" title="Protect margin" desc="Where value leaks" />],
  ['ProofCard', <ProofCard key="pf" value="98%" label="Food revenue" context="At The Anchor" />],
  [
    'MethodStep',
    <MethodStep key="ms" index={1} word="HEAR." text="Understand what is happening." />,
  ],
  [
    'Quote',
    <Quote key="q" name="Sam Whitfield" role="MD">
      They challenged us.
    </Quote>,
  ],
  [
    'Alert',
    <Alert key="a" tone="danger" title="Could not send">
      Try again.
    </Alert>,
  ],
  [
    'EmptyState',
    <EmptyState
      key="es"
      title="Nothing here"
      action={{ label: 'Clear filters', href: '/insights' }}
    />,
  ],
  ['Skeleton', <Skeleton key="sk" variant="article" />],
  [
    'FAQ',
    <FAQ key="faq" items={[{ q: 'What does it cost?', a: 'It is scoped to the problem.' }]} />,
  ],
  [
    'Toc',
    <Toc key="toc" items={[{ label: 'The problem', href: '#problem' }]} current="#problem" />,
  ],
  ['CategoryTag', <CategoryTag key="ct" category="margin" href="/insights?c=margin" />],
  [
    'ArticleCard',
    <ArticleCard key="ac" title="Where AI helps" excerpt="A look" date="12 Aug 2026" />,
  ],
  ['Pagination', <Pagination key="pg" page={3} total={12} hrefFor={(n) => `?page=${n}`} />],
  [
    'Tabs',
    <Tabs
      key="tb"
      items={[
        { label: 'Demand', content: 'One' },
        { label: 'Margin', content: 'Two' },
      ]}
    />,
  ],
  [
    'NextStep',
    <NextStep
      key="ns"
      links={[{ stage: 'The problem', title: 'Growth has stalled', href: '/p' }]}
    />,
  ],
  [
    'OfferCard',
    <OfferCard
      key="oc"
      name="Growth diagnostic"
      includes={['Interviews']}
      cta={{ label: 'Start', href: '/s' }}
    />,
  ],
  [
    'CompareTable',
    <CompareTable
      key="cmp"
      caption="What is included"
      columns={['Diagnostic', 'Sprint']}
      rows={[{ label: 'Baseline agreed', values: [true, false] }]}
    />,
  ],
  ['LogoStrip', <LogoStrip key="ls" items={['Greene King', 'BII']} />],
  ['SeasonalBand', <SeasonalBand key="sb" items={[{ month: 'October', event: 'Oktoberfest' }]} />],
  ['PressureMap', <PressureMap key="pm" title="Where the pressure is" />],
  ['PressureCheck', <PressureCheck key="pchk" />],
  ['StickyCTA', <StickyCTA key="sc" showAfter={0} />],
  ['ShareRow', <ShareRow key="sr" url="https://orangejelly.co.uk/x" title="X" />],
  ['SiteSearch', <SiteSearch key="ss" />],
];

describe('oj library accessibility', () => {
  it.each(CASES)('%s has no automated violations', async (name, ui) => {
    const violations = await scan(ui);
    expect(violations, `${name}:\n${violations.join('\n')}`).toEqual([]);
  });
});
