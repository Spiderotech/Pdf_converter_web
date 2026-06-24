const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const blogSource = fs.readFileSync(path.join(root, 'src/data/blogPosts.ts'), 'utf8');
const featuredSlugs = [...blogSource.matchAll(/seoReady: true,\s+slug: '([^']+)'/g)].map((match) => match[1]);
const directEditorialProfiles = [...blogSource.matchAll(/const ([A-Za-z]+)EditorialProfiles: Record[^=]+ = \{([\s\S]*?)\n\};/g)];
const factoryEditorialProfiles = [...blogSource.matchAll(/const ([A-Za-z]+)EditorialProfiles: Record[^=]+ = Object\.fromEntries\(([\s\S]*?)\);/g)];
const editorialProfiles = [...directEditorialProfiles, ...factoryEditorialProfiles].flatMap((profileMatch) => {
  const specialCategories = { cad: 'CAD', threeD: '3D', mapGis: 'Map/GIS' };
  const category = specialCategories[profileMatch[1]] ?? `${profileMatch[1][0].toUpperCase()}${profileMatch[1].slice(1)}`;
  return [...profileMatch[2].matchAll(/^\s{2,}(?:'([^']+)'|([A-Z0-9-]+)): (?:\{|makeTechnicalProfile\()/gm)].map((match) => ({ formatName: match[1] ?? match[2], category }));
});
const definitionLines = blogSource.split('\n').filter((line) => /^  \{ name: '[^']+', extension:/.test(line));
const reviewedGeneratedSlugs = editorialProfiles.map(({ formatName, category }) => {
  const definition = definitionLines.find((line) => line.includes(`name: '${formatName}'`) && line.includes(`category: '${category}'`));
  const explicitSlug = definition?.match(/slug: '([^']+)'/)?.[1];
  return explicitSlug ?? `what-is-a-${formatName.toLowerCase()}-file`;
});
const blogSlugs = [...new Set([...featuredSlugs, ...reviewedGeneratedSlugs])];

const staticPaths = [
  '/',
  '/pdf-to-word',
  '/word-to-pdf',
  '/compress-pdf',
  '/merge-pdf',
  '/split-pdf',
  '/sign-pdf',
  '/edit-pdf',
  '/pptx-to-pdf',
  '/xlsx-to-csv',
  '/excel-to-pdf',
  '/unlock-pdf',
  '/protect-pdf',
  '/about',
  '/contact',
  '/faq',
  '/blog',
  '/privacy',
  '/terms-and-conditions',
];

const blogPaths = blogSlugs.map((slug) => `/blog/${slug}`);
const urls = [...staticPaths, ...blogPaths];
const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map((url) => `  <url><loc>https://filebrother.com${url}</loc></url>`),
  '</urlset>',
  '',
].join('\n');

fs.writeFileSync(path.join(root, 'public/sitemap.xml'), xml);
console.log(`Generated sitemap with ${urls.length} URLs (${blogPaths.length} blog guides).`);
