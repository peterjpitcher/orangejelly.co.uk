/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const slug = process.argv[2];
const imagePath = process.argv[3];

if (!slug || !imagePath) {
  console.error('Usage: node assign_unique_image.js <slug> <imagePath>');
  process.exit(1);
}

const blogDir = path.join(process.cwd(), 'content/blog');
const filePath = path.join(blogDir, `${slug}.md`);

if (!fs.existsSync(filePath)) {
  console.error(`File not found: ${filePath}`);
  process.exit(1);
}

let content = fs.readFileSync(filePath, 'utf8');

// Normalize image path to ensure it starts with /
let finalImagePath = imagePath;
// if (!finalImagePath.startsWith('/')) {
//    finalImagePath = '/' + finalImagePath;
// }

// Replace or Insert featuredImage
if (content.match(/^featuredImage:.*$/m)) {
  content = content.replace(/^featuredImage:.*$/m, `featuredImage: "${finalImagePath}"`);
} else {
  // Insert after category
  const categoryMatch = content.match(/^category:.*$/m);
  if (categoryMatch) {
    content = content.replace(
      categoryMatch[0],
      `${categoryMatch[0]}\nfeaturedImage: "${finalImagePath}"`
    );
  } else {
    // Fallback after title
    const titleMatch = content.match(/^title:.*$/m);
    if (titleMatch) {
      content = content.replace(
        titleMatch[0],
        `${titleMatch[0]}\nfeaturedImage: "${finalImagePath}"`
      );
    }
  }
}

fs.writeFileSync(filePath, content);
console.log(`Updated ${slug}.md with ${finalImagePath}`);
