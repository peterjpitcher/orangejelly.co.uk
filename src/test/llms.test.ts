import { describe, expect, it } from 'vitest';

import { CASE_STUDIES } from '@/app/results/case-studies';
import { buildLlmsFullTxt, buildLlmsTxt } from '@/lib/llms';

/**
 * llms.txt and llms-full.txt.
 *
 * These are among the very few files on the site written specifically for a machine
 * to believe, and nobody had looked at the hand-written versions in a year: five
 * services at prices that no longer exist, a founder story, and four retired
 * claims. Generating them from the same data the pages use is the only version of
 * this that stays true.
 */
const SHORT = buildLlmsTxt();
const FULL = buildLlmsFullTxt();

describe('llms.txt', () => {
  it('describes the company by what it does', () => {
    expect(SHORT).toMatch(/finds what is stopping a business growing, then fixes it/i);
  });

  it('carries the hourly rate and nothing else priced, no package and no retired claim', () => {
    // Everything Orange Jelly says about itself. The article index below it is
    // excluded because it reproduces guide titles verbatim, and one of those is
    // "What to Fix First for Under £5K", which is a refurbishment budget in a
    // hospitality article and not a fee anybody is being quoted.
    //
    // One price is allowed: the hourly rate, which is the only number the site
    // advertises. Anything else with a pound sign is a package by another name.
    const selfDescription = FULL.split('## Guides')[0];
    for (const text of [SHORT, selfDescription]) {
      expect(text).toMatch(/£62\.50 plus VAT an hour/);
      expect(text.match(/£/g)).toHaveLength(1);
      expect(text).not.toMatch(/Growth Fix|Momentum Month|Turnaround Intensive/);
      expect(text).not.toMatch(/25 hours|5 hours a week|save/i);
    }
  });

  it('promises no response time', () => {
    expect(SHORT).toMatch(/No response time is promised/);
    expect(SHORT).not.toMatch(/within \d+ (hours|days)/i);
  });

  it('names the method in the agreed words', () => {
    for (const word of ['HEAR', 'CHALLENGE', 'BUILD', 'OPTIMISE']) {
      expect(SHORT).toContain(word);
    }
    expect(SHORT).not.toMatch(/EXPOSE/);
  });

  it('states who it is not for, which is what stops a bad referral', () => {
    // An assistant recommending Orange Jelly to someone who wants three posts a
    // week wastes everybody's time. This is the same filter the site uses.
    expect(SHORT).toMatch(/Who this is not for/);
    expect(SHORT).toMatch(/post three times a week/);
  });

  it('gives every figure as a percentage and says where it came from', () => {
    expect(SHORT).toMatch(
      /from The Anchor, the venue Orange Jelly runs itself, measured against a baseline/
    );
    for (const figure of ['828%', '403%', '567%', '89%', '98%']) {
      expect(SHORT).toContain(figure);
    }
  });

  it('is honest that the proof is one business', () => {
    expect(FULL).toMatch(/Every case study is The Anchor, the business Orange Jelly runs itself/);
    expect(FULL).not.toMatch(/our clients|trusted by/i);
  });

  it('links to the pages that exist', () => {
    for (const path of ['/start-here', '/how-we-work', '/results', '/about']) {
      expect(SHORT).toContain(path);
    }
  });
});

describe('llms-full.txt', () => {
  it('contains everything the short one does', () => {
    expect(FULL.startsWith(SHORT)).toBe(true);
  });

  it('carries every case study, told through the method', () => {
    for (const study of CASE_STUDIES) {
      expect(FULL).toContain(study.title);
      expect(FULL).toContain(study.transfer);
    }
    expect(FULL).toMatch(/HEAR\. /);
    expect(FULL).toMatch(/OPTIMISE\. /);
  });

  it('indexes the article library and says what it is', () => {
    expect(FULL).toMatch(/## Guides \(\d+ articles\)/);
    // Hospitality is one market, and the file says so rather than letting a
    // hundred pub articles imply the company is a pub agency.
    expect(FULL).toMatch(/Hospitality is one market Orange Jelly works in/);
  });
});
