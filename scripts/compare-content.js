#!/usr/bin/env node

/**
 * Content Comparison Script
 * Compares content between local dev server and production
 *
 * Run by hand with `node scripts/compare-content.js`, never bundled, so it is plain
 * CommonJS. The repo's TypeScript rules forbid `require()`, which is right for
 * everything the build touches and wrong for a standalone Node script like this one.
 * The unused bindings are pre-existing and left alone: this is a one-line rename,
 * not a rewrite of a dev tool.
 */
/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */

const https = require('https');
const http = require('http');
const { JSDOM } = require('jsdom');

const PAGES = [
  { name: 'Homepage', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Results', path: '/results' },
  { name: 'Contact', path: '/contact' },
  { name: 'Small business rescue', path: '/small-business-rescue' },
  { name: 'Compete with Chains', path: '/compete-with-pub-chains' },
  { name: 'Quiet Midweek', path: '/quiet-midweek-solutions' },
];

// Fetch content from URL
async function fetchContent(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;

    client
      .get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve(data));
      })
      .on('error', reject);
  });
}

// Extract text content from HTML
function extractTextContent(html) {
  const dom = new JSDOM(html);
  const document = dom.window.document;

  // Remove scripts, styles, and other non-content elements
  const elementsToRemove = document.querySelectorAll('script, style, noscript, svg, path');
  elementsToRemove.forEach((el) => el.remove());

  // Extract key content areas
  const content = {
    title: document.querySelector('title')?.textContent?.trim() || '',
    h1: Array.from(document.querySelectorAll('h1')).map((el) => el.textContent.trim()),
    h2: Array.from(document.querySelectorAll('h2')).map((el) => el.textContent.trim()),
    h3: Array.from(document.querySelectorAll('h3')).map((el) => el.textContent.trim()),
    paragraphs: Array.from(document.querySelectorAll('p'))
      .map((el) => el.textContent.trim())
      .filter((t) => t.length > 20),
    buttons: Array.from(document.querySelectorAll('button, a.button, [class*="button"]'))
      .map((el) => el.textContent.trim())
      .filter((t) => t && t.length < 50),
    navigation: Array.from(document.querySelectorAll('nav a')).map((el) => el.textContent.trim()),
  };

  return content;
}

// Compare two content objects
function compareContent(local, production, pageName) {
  const differences = [];

  // Compare titles
  if (local.title !== production.title) {
    differences.push({
      type: 'Title',
      local: local.title,
      production: production.title,
    });
  }

  // Compare H1s
  const localH1s = local.h1.join(' | ');
  const prodH1s = production.h1.join(' | ');
  if (localH1s !== prodH1s) {
    differences.push({
      type: 'H1 Headings',
      local: localH1s || '(none)',
      production: prodH1s || '(none)',
    });
  }

  // Compare H2s
  const localH2s = local.h2.join(' | ');
  const prodH2s = production.h2.join(' | ');
  if (localH2s !== prodH2s) {
    differences.push({
      type: 'H2 Headings',
      local: localH2s || '(none)',
      production: prodH2s || '(none)',
    });
  }

  // Compare navigation
  const localNav = local.navigation.join(' | ');
  const prodNav = production.navigation.join(' | ');
  if (localNav !== prodNav) {
    differences.push({
      type: 'Navigation',
      local: localNav || '(none)',
      production: prodNav || '(none)',
    });
  }

  return differences;
}

// Main comparison function
async function comparePage(page) {
  console.log(`\n📊 Comparing ${page.name}...`);

  try {
    // Wait a bit between requests to avoid overwhelming servers
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const localUrl = `http://localhost:3000${page.path}`;
    const productionUrl = `https://orangejelly.co.uk${page.path}`;

    const [localHtml, productionHtml] = await Promise.all([
      fetchContent(localUrl),
      fetchContent(productionUrl),
    ]);

    const localContent = extractTextContent(localHtml);
    const productionContent = extractTextContent(productionHtml);

    const differences = compareContent(localContent, productionContent, page.name);

    if (differences.length === 0) {
      console.log(`✅ ${page.name}: Content matches!`);
    } else {
      console.log(`⚠️  ${page.name}: Found ${differences.length} difference(s):`);
      differences.forEach((diff) => {
        console.log(`\n  ${diff.type}:`);
        console.log(
          `    Local: "${diff.local.substring(0, 100)}${diff.local.length > 100 ? '...' : ''}"`
        );
        console.log(
          `    Prod:  "${diff.production.substring(0, 100)}${diff.production.length > 100 ? '...' : ''}"`
        );
      });
    }

    return { page: page.name, differences };
  } catch (error) {
    console.error(`❌ Error comparing ${page.name}: ${error.message}`);
    return { page: page.name, error: error.message };
  }
}

// Run all comparisons
async function runComparison() {
  console.log('🔍 Starting content comparison between local and production...\n');
  console.log('Local: http://localhost:3000');
  console.log('Production: https://orangejelly.co.uk');
  console.log('='.repeat(60));

  const results = [];

  for (const page of PAGES) {
    const result = await comparePage(page);
    results.push(result);
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📋 SUMMARY');
  console.log('='.repeat(60));

  const matching = results.filter(
    (r) => !r.error && (!r.differences || r.differences.length === 0)
  );
  const different = results.filter((r) => r.differences && r.differences.length > 0);
  const errors = results.filter((r) => r.error);

  console.log(`\n✅ Matching pages: ${matching.length}`);
  matching.forEach((r) => console.log(`   - ${r.page}`));

  if (different.length > 0) {
    console.log(`\n⚠️  Pages with differences: ${different.length}`);
    different.forEach((r) => console.log(`   - ${r.page}: ${r.differences.length} difference(s)`));
  }

  if (errors.length > 0) {
    console.log(`\n❌ Pages with errors: ${errors.length}`);
    errors.forEach((r) => console.log(`   - ${r.page}: ${r.error}`));
  }

  console.log('\n' + '='.repeat(60));
  console.log(
    different.length === 0
      ? '🎉 All pages match production!'
      : '⚠️  Some differences found - review above'
  );
}

// Check if jsdom is installed
try {
  require.resolve('jsdom');
  runComparison().catch(console.error);
} catch (e) {
  console.log('📦 Installing required dependency (jsdom)...');
  require('child_process').execSync('npm install jsdom', { stdio: 'inherit' });
  console.log('✅ Dependency installed. Please run the script again.');
}
