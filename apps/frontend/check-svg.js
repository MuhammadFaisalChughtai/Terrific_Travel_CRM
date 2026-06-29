const fs = require('fs');
const path = require('path');

const svgPath = 'E:/Terrific-Travel_TMS/apps/frontend/public/Logo.svg';
const content = fs.readFileSync(svgPath, 'utf8');

console.log("SVG Length:", content.length);
// Let's find all path and line tags in the SVG
const tags = [];
const regex = /<[a-zA-Z0-9:-]+[^>]*>/g;
let match;
while ((match = regex.exec(content)) !== null) {
  const tag = match[0];
  if (!tag.includes('base64')) {
    tags.push(tag);
  }
}
console.log("Non-base64 tags in SVG:");
tags.slice(0, 100).forEach(t => console.log(t));
if (tags.length > 100) {
  console.log(`... and ${tags.length - 100} more tags`);
}
