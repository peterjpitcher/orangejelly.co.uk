/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const blogDir = path.join(process.cwd(), 'content/blog');
const files = fs.readdirSync(blogDir).filter((file) => file.endsWith('.md'));

const posts = files
  .map((file) => {
    const content = fs.readFileSync(path.join(blogDir, file), 'utf8');
    const slugMatch = content.match(/slug: ["']?([^"'\n]+)["']?/);
    const titleMatch = content.match(/title: ["']?([^"'\n]+)["']?/);
    const imageMatch = content.match(/featuredImage: ["']?([^"'\n]+)["']?/);

    return {
      file,
      slug: slugMatch ? slugMatch[1] : file.replace('.md', ''),
      title: titleMatch ? titleMatch[1] : 'Unknown Title',
      currentImage: imageMatch ? imageMatch[1] : null,
    };
  })
  .sort((a, b) => a.slug.localeCompare(b.slug));

console.log(JSON.stringify(posts, null, 2));
