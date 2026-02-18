/**
 * Simple test to verify the markdown utilities work correctly
 * Run with: npx tsx src/lib/markdown/test.ts
 */

import path from 'path';
import {
  parseMarkdownFile,
  markdownToHtml,
  extractExcerpt,
  calculateReadingTime,
} from './markdown';

async function runTest() {
  console.log('🧪 Testing Markdown Utilities\n');

  try {
    // Test file path
    const testFile = path.join(__dirname, 'test-example.md');
    console.log('📁 Test file:', testFile);

    // Test parsing
    console.log('\n1️⃣ Testing parseMarkdownFile...');
    const parsed = parseMarkdownFile(testFile, {
      excerptLength: 100,
      includeReadingTime: true,
    });

    console.log('✅ Frontmatter:', {
      title: parsed.frontMatter.title,
      slug: parsed.frontMatter.slug,
      author: parsed.frontMatter.author,
      tags: parsed.frontMatter.tags,
    });

    console.log('✅ Content length:', parsed.content.length, 'characters');
    console.log('✅ Excerpt:', parsed.excerpt);
    console.log('✅ Reading time:', parsed.readingTime);

    // Test HTML conversion
    console.log('\n2️⃣ Testing markdownToHtml...');
    const html = await markdownToHtml(parsed.content);
    console.log('✅ HTML length:', html.length, 'characters');
    console.log('✅ HTML preview:', html.substring(0, 100) + '...');

    // Test excerpt extraction
    console.log('\n3️⃣ Testing extractExcerpt...');
    const customExcerpt = extractExcerpt(parsed.content, 50);
    console.log('✅ Custom excerpt (50 chars):', customExcerpt);

    // Test reading time calculation
    console.log('\n4️⃣ Testing calculateReadingTime...');
    const readingTime = calculateReadingTime(parsed.content);
    console.log('✅ Reading time details:', readingTime);

    console.log('\n🎉 All tests passed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
runTest();
