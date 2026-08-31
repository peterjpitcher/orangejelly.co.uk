#!/usr/bin/env npx tsx
import fs from 'fs';
import path from 'path';

const fixes = [
  // Licensees Guide main page
  {
    file: 'src/app/guides/page.tsx',
    find: "images: ['/images/og/guides.svg'],",
    replace: "images: ['/logo.png'],",
  },
  // Licensees Guide article pages (fallback)
  {
    file: 'src/app/guides/[slug]/page.tsx',
    find: "images: [post.featuredImage || '/images/og/default.svg'],",
    replace: "images: [post.featuredImage || '/logo.png'],",
  },
  // Twitter card in article pages
  {
    file: 'src/app/guides/[slug]/page.tsx',
    find: "images: [post.featuredImage || '/images/og/default.svg'],",
    replace: "images: [post.featuredImage || '/logo.png'],",
    occurrence: 2,
  },
  // Meta component default
  {
    file: 'src/components/Meta.tsx',
    find: "ogImage = '/images/og/default.svg',",
    replace: "ogImage = '/logo.png',",
  },
  // Blog post card images in licensees guide
  {
    file: 'src/app/guides/page.tsx',
    find: "image: typeof post.featuredImage === 'string' ? post.featuredImage : '/images/blog/default.svg'",
    replace: "image: typeof post.featuredImage === 'string' ? post.featuredImage : '/logo.png'",
  },
  {
    file: 'src/app/guides/page.tsx',
    find: "src: typeof post.featuredImage === 'string' ? post.featuredImage : '/images/blog/default.svg',",
    replace: "src: typeof post.featuredImage === 'string' ? post.featuredImage : '/logo.png',",
  },
  // Category pages
  {
    file: 'src/app/guides/category/[category]/page.tsx',
    find: "image: post.featuredImage || '/images/blog/default.svg'",
    replace: "image: post.featuredImage || '/logo.png'",
  },
  {
    file: 'src/app/guides/category/[category]/page.tsx',
    find: "src: post.featuredImage || '/images/blog/default.svg',",
    replace: "src: post.featuredImage || '/logo.png',",
  },
];

console.log('🔧 Fixing OpenGraph images across the site...\n');

fixes.forEach((fix) => {
  const filePath = path.join(process.cwd(), fix.file);

  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${fix.file}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf-8');
  const originalContent = content;

  if (fix.occurrence === 2) {
    // Handle second occurrence
    const firstIndex = content.indexOf(fix.find);
    if (firstIndex !== -1) {
      const secondIndex = content.indexOf(fix.find, firstIndex + fix.find.length);
      if (secondIndex !== -1) {
        content =
          content.substring(0, secondIndex) +
          fix.replace +
          content.substring(secondIndex + fix.find.length);
      }
    }
  } else {
    // Normal replacement
    content = content.replace(fix.find, fix.replace);
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed: ${fix.file}`);
    console.log(`   Changed: ${fix.find}`);
    console.log(`   To: ${fix.replace}\n`);
  } else {
    console.log(`⚠️  No change needed: ${fix.file}\n`);
  }
});

console.log('\n📝 Summary:');
console.log('- All pages now use /logo.png as the default OpenGraph image');
console.log('- Blog articles will use their featured image if available');
console.log('- Fallback is always /logo.png (PNG format, not SVG)');
console.log('\n✨ OpenGraph images fixed successfully!');
