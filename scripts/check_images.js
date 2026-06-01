const fs = require('fs');
const path = require('path');
const blogDir = path.join(process.cwd(), 'content/blog');
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));
let missing = 0;
files.forEach(f => {
  const c = fs.readFileSync(path.join(blogDir, f), 'utf8');
  if (!c.includes('featuredImage:')) {
    missing++;
    console.log('Missing in: ' + f);
  }
});
console.log('Total Missing: ', missing);
