/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const blogDir = path.join(process.cwd(), 'content/blog');
const files = fs.readdirSync(blogDir).filter((file) => file.endsWith('.md'));

const categoryImageMap = {
  // Marketing & Social Media
  'social-media': '/images/blog/marketing-theme.png',
  'customer-acquisition': '/images/blog/marketing-theme.png',
  'digital-reputation': '/images/blog/marketing-theme.png',
  'low-budget-marketing': '/images/blog/marketing-theme.png',
  'pub-marketing': '/images/blog/marketing-theme.png',

  // Events & Entertainment
  'events-promotions': '/images/blog/events-theme.png',
  events: '/images/blog/events-theme.png',
  competition: '/images/blog/events-theme.png',
  'empty-pub-solutions': '/images/blog/events-theme.png',

  // Food & Drink
  'food-drink': '/images/blog/food-theme.png',
  'menu-pricing': '/images/blog/food-theme.png',
  'supplier-relations': '/images/blog/food-theme.png',

  // Business & Operations
  'financial-management': '/images/blog/business-theme.png',
  operations: '/images/blog/business-theme.png',
  'location-challenges': '/images/blog/business-theme.png',
  'crisis-management': '/images/blog/business-theme.png',
  compliance: '/images/blog/business-theme.png',
  toolkits: '/images/blog/business-theme.png',

  // Staff & Team (fallback to business if no staff category explicitly)
  staff: '/images/blog/staff-theme.png',
  team: '/images/blog/staff-theme.png',
};

const defaultImage = '/images/blog/marketing-theme.png';

let updatedCount = 0;

files.forEach((file) => {
  const filePath = path.join(blogDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Check if featuredImage already exists
  if (content.match(/^featuredImage:/m)) {
    // Skip if already has an image (unless we want to overwrite, but let's respect existing for now except our placeholder)
    // Actually, user wants "images for any articles that don't have a photo yet"
    // So we skip if it exists.
    // console.log(`Skipping ${file} - already has image`);
    return;
  }

  // Extract category
  const categoryMatch = content.match(/^category: ["']?([^"'\n]+)["']?/m);
  const category = categoryMatch ? categoryMatch[1] : null;

  let imageToUse = defaultImage;
  if (category && categoryImageMap[category]) {
    imageToUse = categoryImageMap[category];
  } else {
    // Try to infer from filename/title keywords if category doesn't match
    if (file.includes('staff') || file.includes('team') || content.includes('staff')) {
      imageToUse = '/images/blog/staff-theme.png';
    } else if (
      file.includes('food') ||
      file.includes('menu') ||
      file.includes('drink') ||
      file.includes('kitchen')
    ) {
      imageToUse = '/images/blog/food-theme.png';
    } else if (
      file.includes('money') ||
      file.includes('profit') ||
      file.includes('cost') ||
      file.includes('finance')
    ) {
      imageToUse = '/images/blog/business-theme.png';
    } else if (file.includes('music') || file.includes('quiz') || file.includes('event')) {
      imageToUse = '/images/blog/events-theme.png';
    }
  }

  // Insert featuredImage after category
  const replacement = `category: "${category}"\nfeaturedImage: "${imageToUse}"`;
  // Replace the category line with category + featuredImage
  // We use the exact match from earlier to be safe
  if (categoryMatch) {
    content = content.replace(categoryMatch[0], replacement);
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file} with ${imageToUse} (Category: ${category})`);
    updatedCount++;
  } else {
    // Fallback: insert after ---
    // content = content.replace(/^---\n/, `---\nfeaturedImage: "${imageToUse}"\n`);
    // safer: replace first occurrence of some other common field like title if category missing
    const titleMatch = content.match(/^title:.*$/m);
    if (titleMatch) {
      content = content.replace(titleMatch[0], `${titleMatch[0]}\nfeaturedImage: "${imageToUse}"`);
      fs.writeFileSync(filePath, content);
      console.log(`Updated ${file} with ${imageToUse} (No category found, inserted after title)`);
      updatedCount++;
    }
  }
});

console.log(`Total files updated: ${updatedCount}`);
