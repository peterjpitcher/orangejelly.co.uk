import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

// List of all pages to test
const pages = [
  { name: 'home', path: '/' },
  { name: 'services', path: '/services' },
  { name: 'about', path: '/about' },
  { name: 'results', path: '/results' },
  { name: 'contact', path: '/contact' },
  { name: 'licensees-guide', path: '/licensees-guide' },
  // Landing pages
  { name: 'empty-pub-solutions', path: '/empty-pub-solutions' },
  { name: 'quiet-midweek-solutions', path: '/quiet-midweek-solutions' },
  { name: 'compete-with-pub-chains', path: '/compete-with-pub-chains' },
  { name: 'why-revenue-is-falling', path: '/why-revenue-is-falling' },
  { name: 'pub-marketing-no-budget', path: '/pub-marketing-no-budget' },
];

async function testAllPages() {
  // Create directories for screenshots and logs
  const screenshotDir = path.join(process.cwd(), 'test-results', 'screenshots');
  const logsDir = path.join(process.cwd(), 'test-results', 'logs');

  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  // Launch browser
  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  });

  const baseUrl = 'http://localhost:3000'; // Default Next.js port

  console.log('🚀 Starting page tests...\n');

  for (const pageInfo of pages) {
    console.log(`📸 Testing ${pageInfo.name} page...`);

    const page = await context.newPage();
    const consoleLogs: string[] = [];
    const errors: string[] = [];

    // Capture console messages
    page.on('console', (msg) => {
      const type = msg.type();
      const text = msg.text();
      consoleLogs.push(`[${type.toUpperCase()}] ${text}`);

      if (type === 'error') {
        errors.push(text);
      }
    });

    // Capture page errors
    page.on('pageerror', (error) => {
      errors.push(`Page Error: ${error.message}`);
    });

    // Capture request failures
    page.on('requestfailed', (request) => {
      errors.push(`Request Failed: ${request.url()} - ${request.failure()?.errorText}`);
    });

    try {
      // Navigate to page
      const response = await page.goto(`${baseUrl}${pageInfo.path}`, {
        waitUntil: 'networkidle',
        timeout: 30000,
      });

      // Check response status
      const status = response?.status() || 0;
      if (status >= 400) {
        errors.push(`HTTP ${status} error`);
      }

      // Wait a bit for any async content to load
      await page.waitForTimeout(2000);

      // Take screenshot
      await page.screenshot({
        path: path.join(screenshotDir, `${pageInfo.name}.png`),
        fullPage: true,
      });

      // Also take a mobile screenshot
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE size
      await page.screenshot({
        path: path.join(screenshotDir, `${pageInfo.name}-mobile.png`),
        fullPage: true,
      });

      // Log results
      const logContent = [
        `Page: ${pageInfo.name} (${pageInfo.path})`,
        `URL: ${baseUrl}${pageInfo.path}`,
        `Status: ${status}`,
        `Timestamp: ${new Date().toISOString()}`,
        '',
        '=== Console Logs ===',
        consoleLogs.length > 0 ? consoleLogs.join('\n') : 'No console logs',
        '',
        '=== Errors ===',
        errors.length > 0 ? errors.join('\n') : 'No errors detected',
        '',
        '=== Page Metrics ===',
        `Title: ${await page.title()}`,
        `URL: ${page.url()}`,
      ].join('\n');

      fs.writeFileSync(path.join(logsDir, `${pageInfo.name}.log`), logContent);

      // Print summary
      if (errors.length > 0) {
        console.log(`  ❌ ${errors.length} errors found`);
      } else {
        console.log(`  ✅ No errors`);
      }
      console.log(`  📄 Screenshots written`);
      console.log(`  📝 Logs written\n`);
    } catch (error) {
      console.error(`  ❌ Failed to test page: ${error}`);

      // Write the error log
      fs.writeFileSync(
        path.join(logsDir, `${pageInfo.name}-error.log`),
        `Failed to load page: ${error}\n\nConsole logs:\n${consoleLogs.join('\n')}`
      );
    } finally {
      await page.close();
    }
  }

  // Create summary report
  const summaryPath = path.join(process.cwd(), 'test-results', 'summary.md');
  const summary = [
    '# Orange Jelly Website Test Results',
    `Generated: ${new Date().toISOString()}`,
    '',
    '## Pages Tested',
    pages.map((p) => `- [${p.name}](${p.path})`).join('\n'),
    '',
    '## Results',
    'Check the screenshots and logs directories for detailed results.',
    '',
    '### Screenshot Files',
    '- Desktop (1280x720): `[page-name].png`',
    '- Mobile (375x667): `[page-name]-mobile.png`',
    '',
    '### Log Files',
    '- Console and error logs: `[page-name].log`',
  ].join('\n');

  fs.writeFileSync(summaryPath, summary);

  await browser.close();

  console.log('✨ All tests complete!');
  console.log(`📁 Results written to: ${path.join(process.cwd(), 'test-results')}`);
}

// Run the tests
testAllPages().catch(console.error);
